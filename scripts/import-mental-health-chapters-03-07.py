"""Import the five supplied continuation chapters without changing the originals.

Uses PDF geometry/font information to preserve headings and two-column tables.
The source PDFs were visually reviewed on all 50 pages. Generated content and
supplemental teaching visuals remain separate. Run with pypdf + pdfplumber.
"""
from pathlib import Path
from collections import Counter
import hashlib
import json
import re
import shutil
import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/learning/mental-health"
DOWNLOADS = Path("C:/Users/VUGANDAKUMVA/Downloads")
CONFIG = [
    (3, "Stress", "understanding-stress-and-healthy-coping-strategies", "Understanding Stress and Healthy Coping Strategies", "Explore stress, practical pressures, flexible coping, and when additional support matters.", "mental-health-learning", "16"),
    (4, "Anxiety", "understanding-anxiety-and-anxiety-disorders", "Understanding Anxiety and Anxiety Disorders", "Understand everyday anxiety, anxiety disorders, supportive responses, and professional care.", "mental-health-listening", "04.21"),
    (5, "Depression", "understanding-depression-and-depressive-disorders", "Understanding Depression and Depressive Disorders", "Learn about depression, compassionate support, treatment, and small steps that respect individual circumstances.", "mental-health-counseling", "20"),
    (6, "Trauma_PTSD", "understanding-trauma-and-post-traumatic-stress", "Understanding Trauma and Post-Traumatic Stress", "Explore trauma responses, safety, voluntary coping, and pathways to appropriate professional support.", "mental-health-connection", "25"),
    (7, "Grief_Loss", "understanding-grief-loss-and-emotional-adjustment", "Understanding Grief, Loss, and Emotional Adjustment", "Understand different losses, changing grief experiences, practical support, and when assessment may help.", "mental-health-group", "Part VI"),
]
TABLE_HEADERS = {
    "Life area": "Examples of possible stressors",
    "Area": None,
    "You may be able to influence": "You may not be able to control directly",
    "Moment": "A flexible example",
    "What is weighing on me?": "One possible response or source of support",
    "Day": None,
    "Term": None,
    "Stage": "Example",
    "Situation": "Suggested action",
    "Domain": "Examples of reactions",
    "Question": "Suggested answer and explanation",
}
BRIEFS = json.loads((ROOT / "artifacts/learning-visuals/chapters-03-07-scenes.json").read_text(encoding="utf8"))
review_file=ROOT / "artifacts/mental-health-reference-review-03-07.json"
LINK_CHECKS={item.get("url"):item for item in json.loads(review_file.read_text(encoding="utf8"))["references"]} if review_file.exists() else {}

def compact(s):
    return " ".join(s.split())

def tokens(s):
    return Counter(re.findall(r"[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*", s.replace("\x7f", "")))

def block_text(b):
    kind = b["type"]
    if kind == "table": return " ".join(b["headers"] + [c for r in b["rows"] for c in r])
    if kind == "list": return " ".join(b["items"])
    if kind in ["example","subsection"]: return b["title"] + " " + " ".join(map(block_text, b["blocks"]))
    if kind == "disclosure": return b["title"] + " " + " ".join(map(block_text, b["blocks"]))
    if kind == "questions": return " ".join(i["question"] + " Answer: " + i["answer"] for i in b["items"])
    if kind == "references": return b["sourceText"]
    return b["text"]

def line_info(line, page):
    chars = line["chars"]
    letters = [c for c in chars if c["text"].isalpha()]
    bold = sum("Bold" in c["fontname"] for c in letters) / max(1, len(letters))
    size = max(c["size"] for c in chars)
    return {"text": compact(line["text"]), "top": line["top"], "bottom": line["bottom"], "size": size, "heading": bold > .8 and size >= 10, "page": page}

def page_events(page, page_number, chapter):
    lines = [line_info(l, page_number) for l in page.extract_text_lines(return_chars=True)
             if l["top"] < page.height - 48 and l["top"] > 45]
    tables, excluded = [], set()
    for i, line in enumerate(lines):
        if i in excluded or abs(line["size"] - 8.1) > .15: continue
        left = next((h for h in TABLE_HEADERS if line["text"].startswith(h + " ")), None)
        if left is None: continue
        right = TABLE_HEADERS[left] or line["text"][len(left):].strip()
        if not line["text"].startswith(left + " " + right): continue
        end = i + 1
        while end < len(lines) and abs(lines[end]["size"] - 8.1) < .15: end += 1
        bounds = (page.bbox[0], line["top"] - .3, page.bbox[2], lines[end-1]["bottom"] + .3)
        words = page.crop(bounds).extract_words()
        header_words = [w for w in words if abs(w["top"]-line["top"])<2]
        right_words = right.split()
        word = next(header_words[k] for k in range(len(header_words)) if [w["text"] for w in header_words[k:k+len(right_words)]] == right_words)
        split = word["x0"] - 4
        left_lines = page.crop((bounds[0], bounds[1], split, bounds[3])).extract_text_lines()
        groups = []
        for l in left_lines:
            if not groups or l["top"] - groups[-1][-1]["bottom"] > 7:
                groups.append([l])
            else: groups[-1].append(l)
        rows = []
        for row_index, group in enumerate(groups):
            top = group[0]["top"] - .3
            bottom = groups[row_index+1][0]["top"] - .3 if row_index+1 < len(groups) else bounds[3]
            right_text = compact(page.crop((split, top, bounds[2], bottom)).extract_text() or "")
            rows.append([compact(" ".join(l["text"] for l in group)), right_text])
        assert rows[0] == [left, right], (chapter, page_number, rows[0], left, right)
        table = {"type": "table", "headers": rows[0], "rows": rows[1:]}
        if left == "Question": table["revealAnswers"] = True
        expected = tokens(" ".join(l["text"] for l in lines[i:end]))
        assert expected == tokens(block_text(table)), (chapter, page_number, expected-tokens(block_text(table)))
        tables.append((i, table))
        excluded.update(range(i, end))
    events = []
    table_map = dict(tables)
    for i, line in enumerate(lines):
        if i in table_map:
            events.append({"type": "table", "block": table_map[i], "page": page_number})
        if i not in excluded: events.append({"type": "line", **line})
    return events

def to_blocks(events):
    output, pending = [], None
    previous = None
    def flush():
        nonlocal pending
        if pending:
            pending["text"] = compact(pending["text"])
            output.append(pending)
        pending = None
    for e in events:
        if e["type"] == "table":
            flush()
            table = e["block"]
            if output and output[-1]["type"] == "table" and output[-1]["headers"] == table["headers"]:
                output[-1]["rows"].extend(table["rows"])
            else: output.append(table)
            previous = None
            continue
        text = e["text"]
        kind = "heading" if e["heading"] else "paragraph"
        fresh = bool(re.match(r"^(?:[•\x7f]|Q\d+\.|Answer:|\d+\. |Day \d+:)", text))
        same_page = previous and e["page"] == previous["page"]
        gap = e["top"] - previous["bottom"] if same_page else 0
        continuation = pending and pending["type"] == kind and not fresh and (gap <= 8.5)
        if kind == "heading" and previous:
            continuation = continuation and abs(e["size"]-previous["size"]) < .2 and same_page
        if continuation: pending["text"] += " " + text
        else:
            flush()
            pending = {"type": kind, "text": text}
        previous = e
    flush()
    final = []
    for block in output:
        if block["type"] == "paragraph" and re.match(r"^[•\x7f]", block["text"]):
            item = block["text"].lstrip("•\x7f ")
            if final and final[-1]["type"] == "list": final[-1]["items"].append(item)
            else: final.append({"type": "list", "items": [item]})
        else: final.append(block)
    return final

def section_label(chapter, text):
    patterns = {3:r"^(\d+)\. (.+)$",4:r"^(04\.\d+) (.+)$",5:r"^(\d+) \| (.+)$",6:r"^(\d+)\. (.+)$",7:r"^(07\.\d+) [—–] (.+)$"}
    match = re.match(patterns[chapter], text)
    if match: return match[1], match[2]
    match = re.match(r"^(Part [IVX]+) [—–] (.+)$", text)
    if chapter == 7 and match: return match[1], match[2]
    if chapter in [3,5] and text in ["References and editorial note", "References and source notes"]:
        return "", text
    return None

def process_examples(blocks, briefs):
    result, index = [], 0
    while index < len(blocks):
        block = blocks[index]
        if block["type"] == "heading" and block["text"].startswith(("Scenario ","Activity ")):
            if block["text"].startswith("Scenario "):
                ordinal = ord(re.match(r"Scenario ([A-E])", block["text"])[1]) - ord('A')
                brief = briefs[ordinal]
                group = {"type":"example", "id":"example-"+brief["id"], "title":block["text"], "blocks":[]}
            else:
                ordinal=re.match(r"Activity (\d+)",block["text"])[1]
                group = {"type":"subsection", "id":"grief-activity-"+ordinal,"title":block["text"],"blocks":[]}
            index += 1
            while index < len(blocks) and blocks[index]["type"] != "heading":
                group["blocks"].append(blocks[index]); index += 1
            result.append(group)
            continue
        result.append(block); index += 1
    return result

def optional_answers(blocks):
    # Source-separated answer groups stay separated and retain their source order.
    for index, b in enumerate(blocks):
        if b["type"] == "heading" and b["text"] in ["Suggested answers", "Answers with explanations"]:
            end = index+1
            while end < len(blocks) and blocks[end]["type"] != "heading": end += 1
            return blocks[:index]+[{"type":"disclosure", "title":b["text"], "blocks":blocks[index+1:end]}]+blocks[end:]
    result, index = [], 0
    while index < len(blocks):
        b = blocks[index]
        if b["type"] in ["paragraph","heading"] and re.match(r"^(?:Q\d+\.|\d+\.) ",b["text"]) and index+1<len(blocks) and blocks[index+1]["type"]=="paragraph" and blocks[index+1]["text"].startswith("Answer:"):
            question={"question":b["text"],"answer":blocks[index+1]["text"][len("Answer:"):].strip()}
            if result and result[-1]["type"]=="questions": result[-1]["items"].append(question)
            else: result.append({"type":"questions","items":[question]})
            index+=2
        else: result.append(b);index+=1
    return result

def normalize(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

chapters, audit, source_records = [], [], []
SOURCE.mkdir(parents=True, exist_ok=True)
for n, suffix, slug, title, summary, image, reflection in CONFIG:
    original = f"VUGA_NDAKUMVA_Mental_Health_Expanded_Chapter_{n:02}_{suffix}.pdf"
    public_name = f"chapter-{n:02}-{suffix.lower().replace('_','-')}.pdf"
    target = SOURCE / public_name
    shutil.copyfile(DOWNLOADS / original, target)
    with pdfplumber.open(target) as pdf:
        events = [e for i,p in enumerate(pdf.pages,1) for e in page_events(p,i,n)]
        page_count = len(pdf.pages)
    blocks = to_blocks(events)
    first = next(i for i,b in enumerate(blocks) if b["type"]=="heading" and section_label(n,b["text"]))
    intro = blocks[:first]
    edition_index = next(i for i,b in enumerate(intro) if b["type"]=="paragraph" and "Version 1.1" in b["text"])
    edition = intro[edition_index]["text"]
    intro = intro[edition_index+1:]
    goal_index = next(i for i,b in enumerate(intro) if b.get("text","") in ["Learning outcomes","Learning objectives"])
    goal_heading = intro[goal_index]["text"]
    assert intro[goal_index+1]["type"]=="list", (n,intro[goal_index+1])
    goals = intro[goal_index+1]["items"]
    intro_blocks, after_goals = intro[:goal_index], intro[goal_index+2:]
    sections, current = [], None
    for b in blocks[first:]:
        label = section_label(n,b["text"]) if b["type"]=="heading" else None
        if label:
            number, heading = label
            key = "section-"+str(n)+"-"+(str(int(number.split('.')[-1])) if number and not number.startswith("Part") else normalize(number or 'references'))
            current={"number":number,"id":key,"title":heading,"blocks":[]}
            sections.append(current)
        else:
            assert current is not None
            current["blocks"].append(b)
    chapter_briefs = [b for b in BRIEFS if b["chapter"]==n]
    references=[]
    section_audit=[]
    for section in sections:
        before = (section["number"]+" "+section["title"]+" "+" ".join(map(block_text,section["blocks"]))).strip()
        section["blocks"] = process_examples(section["blocks"],chapter_briefs)
        section["blocks"] = optional_answers(section["blocks"])
        converted=[]
        for index,b in enumerate(section["blocks"]):
            if b["type"]=="paragraph" and re.match(r"^\[\d+\]",b["text"]):
                text=b["text"]
                # PDF layout may separate a citation's URL into its own paragraph.
                if index+1<len(section["blocks"]) and section["blocks"][index+1]["type"]=="paragraph" and section["blocks"][index+1]["text"].startswith("https://"):
                    text += " " + section["blocks"][index+1]["text"]
                    section["blocks"][index+1]["consumed"] = True
                number=int(re.match(r"\[(\d+)\]",text)[1])
                urls=re.findall(r"https?://\S+",text)
                url=urls[0] if urls else None
                ref={"number":number,"text":re.sub(r"^\[\d+\]\s*","",text).replace(url or "\0","").strip()}
                if url:
                    ref["url"]=url
                    if LINK_CHECKS.get(url,{}).get("status")=="retrieved":ref["checkedAt"]=LINK_CHECKS[url]["checkedAt"]
                references.append(ref)
                converted.append({"type":"references","numbers":[number],"sourceText":text})
            elif not b.get("consumed"): converted.append(b)
        section["blocks"]=converted
        after=(section["number"]+" "+section["title"]+" "+" ".join(map(block_text,section["blocks"]))).strip()
        expected, actual=tokens(before),tokens(after)
        assert expected==actual,(n,section["number"],expected-actual,actual-expected)
        section_audit.append({"section":section["number"] or section["title"],"id":section["id"],"sourceWords":sum(expected.values()),"matchingWords":sum(actual.values()),"complete":True})
    assert len(references)=={3:3,4:5,5:3,6:4,7:6}[n],(n,references)
    raw_pages=[]
    for page in PdfReader(target).pages:
        text=page.extract_text() or ""
        text=re.sub(r"\AVUGA NDAKUMVA[^\n]*\n(?:CHAPTER 07[^\n]*\n)?(?:Page )?\d+\n", "",text)
        raw_pages.append(text)
    raw="\n".join(raw_pages)
    first_title={3:"1. What stress means",4:"04.1 What is anxiety?",5:"01 | What is depression?",6:"1. Understanding psychological trauma",7:"07.1 — What grief means"}[n]
    source_start=raw.index(first_title)
    front=compact(raw[:source_start])
    front=front[front.index(compact(edition))+len(compact(edition)):].strip()
    front_actual=" ".join(map(block_text,intro_blocks))+" "+goal_heading+" "+" ".join(goals)+" "+" ".join(map(block_text,after_goals))
    assert tokens(front)==tokens(front_actual),(n,"Front matter audit",tokens(front)-tokens(front_actual),tokens(front_actual)-tokens(front))
    raw=raw[source_start:]
    rendered=" ".join((s['number']+' '+s['title']+' '+' '.join(map(block_text,s['blocks']))) for s in sections)
    expected=tokens(raw)
    if n==3: expected.subtract(tokens("Day Small, flexible practice"))
    actual=tokens(rendered)
    assert expected==actual,(n,"Independent whole-body audit",expected-actual,actual-expected)
    for section in sections:
        for b in section["blocks"]:
            if b["type"]=="heading": b["id"]=section["id"]+"-"+normalize(b["text"])
    # A compact private worksheet contains only the source reflection prompts.
    reflection_section = next(s for s in sections if s["number"]==reflection)
    reflection_blocks=[]
    for b in reflection_section["blocks"]:
        if b["type"] in ["questions","disclosure"]: break
        if b["type"]=="heading" and b["text"].lower().startswith("knowledge"): break
        reflection_blocks.append(b)
    worksheet = title+"\nVUGA NDAKUMVA | Version 1.1 | 9 November 2026 | Educational draft\n\n"+"\n\n".join(map(block_text,reflection_blocks))+"\n"
    worksheet_url=f"/learning/mental-health/chapter-{n:02}-reflection.txt"
    (ROOT/"public"/worksheet_url.lstrip('/')).write_text(worksheet,encoding="utf8")
    status=next((b["text"] for b in intro_blocks if b["type"]=="paragraph" and b["text"].startswith(("Publication status:","Editorial status:"))),None)
    chapter={"number":n,"slug":slug,"title":title,"summary":summary,"timeLabel":"Estimated reading","studyTime":f"{18 if n==3 else 20} minutes, plus optional reflection","referenceHeading":"References and source notes","editorialHeading":"Publication review","reflectionSection":reflection,"image":image,"position":"50% 40%","originalFilename":original,"version":"1.1","date":"2026-11-09","language":"English master draft","author":"VUGA NDAKUMVA","pdfUrl":"/learning/mental-health/"+public_name,"worksheetUrl":worksheet_url,"sourcePages":page_count,"frontMatter":[b["text"] for b in intro_blocks if b["type"]=="paragraph"],"goals":goals,"goalsHeading":goal_heading,"editionText":edition,"introductionBlocks":intro_blocks,"afterGoals":after_goals,"endMatterPlacement":"inline","sections":sections,"references":references,"referenceNotes":[],"editorialReview":[],"approval":[]}
    if status: chapter["publicationStatus"]=status
    chapters.append(chapter)
    source_records.append({"chapter":n,"originalFilename":original,"file":"public/learning/mental-health/"+public_name,"pages":page_count,"sha256":hashlib.sha256(target.read_bytes()).hexdigest()})
    audit.append({**source_records[-1],"sections":section_audit,"frontMatterWords":sum(tokens(" ".join(map(block_text,intro_blocks+after_goals))).values()),"goals":len(goals),"tables":sum(b["type"]=="table" for s in sections for b in s["blocks"]),"examples":sum(b["type"]=="example" for s in sections for b in s["blocks"]),"normalizations":["PDF line wrapping and bullet glyphs normalized","Running page footers excluded","Repeated headers on the split seven-day table merged","Original section labels retained separately from stable IDs"]})

    audit[-1]["independentBodyAudit"]={"complete":True,"sourceWords":sum(expected.values()),"matchingWords":sum(actual.values())}
    audit[-1]["independentFrontMatterAudit"]={"complete":True,"sourceWords":sum(tokens(front).values()),"matchingWords":sum(tokens(front_actual).values())}

def write_json(path, value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+"\n",encoding="utf8")

prefix='// Generated by scripts/import-mental-health-chapters-03-07.py. Do not hand-edit.\n'
(ROOT/"src/learning/chapters-03-07.generated.ts").write_text(prefix+'import type { MentalHealthChapter } from "./types";\nexport const continuationChapters: MentalHealthChapter[] = '+json.dumps(chapters,ensure_ascii=False,indent=2)+';\n',encoding="utf8")
(ROOT/"src/learning/chapter-catalog-03-07.generated.ts").write_text(prefix+'import type { ChapterCatalogEntry } from "./types";\nexport const continuationCatalog: ChapterCatalogEntry[] = '+json.dumps([{k:c[k] for k in ['number','slug','title','summary']} for c in chapters],ensure_ascii=False,indent=2)+';\n',encoding="utf8")
write_json(ROOT/"artifacts/mental-health-source-review-03-07.json",audit)
write_json(ROOT/"artifacts/mental-health-sources-03-07.json",source_records)
write_json(ROOT/"artifacts/mental-health-content-03-07.json",chapters)
print(json.dumps([{k:a[k] for k in ['chapter','pages','goals','tables','examples']} for a in audit]))
