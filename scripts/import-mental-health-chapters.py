"""Transcribe the two supplied PDFs into typed, editable frontend content.

Run with the bundled Python runtime (pypdf). No PDF is modified. Tables were
checked visually against every source page; section token coverage is asserted.
"""
from pathlib import Path
from collections import Counter
import hashlib
import json
import re
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public/learning/mental-health"
OUTPUT = ROOT / "src/learning/chapters.generated.ts"

TABLES = {
    "definitions": {
        "headers": ["Term", "Plain-language meaning"],
        "rows": [
            ["Mental wellbeing", "How supported, connected, capable and able to participate a person may feel; it can fluctuate."],
            ["Emotional distress", "Painful emotions or thoughts that may arise after difficult experiences; not automatically a disorder."],
            ["Mental health condition", "A pattern of symptoms or experiences involving significant distress, impaired functioning or other clinical concerns that may need professional care."],
            ["Recovery", "A personal process that can involve symptom improvement, finding meaning and rebuilding participation and support; it is not identical for everyone."],
        ],
    },
    "pressures": {
        "headers": ["Possible pressures", "Possible protective influences"],
        "rows": [
            ["Prolonged financial strain", "Reliable practical and social support"],
            ["Bullying or exclusion", "Safe, inclusive school or workplace"],
            ["Sleep problems or untreated illness", "Accessible healthcare and supportive routines"],
            ["Social isolation", "Trustworthy relationships and community connection"],
            ["Unstable or unsafe conditions", "Safety, stable services and practical resources"],
        ],
    },
    "myths": {
        "headers": ["Myth", "More accurate understanding"],
        "rows": [
            ["Mental illness is a personal weakness.", "Mental health conditions have complex causes; they are not moral failures."],
            ["A person must be visibly distressed to need help.", "Difficulties are not always visible to others."],
            ["People with conditions cannot recover or contribute.", "Many people improve with appropriate care and maintain meaningful lives."],
            ["Self-help is enough for everyone.", "Self-help can be useful but professional care or external support may be essential."],
            ["Asking for help means failure.", "Asking for assistance is a reasonable step in caring for health."],
        ],
    },
    "emotions": {
        "headers": ["Emotion", "What it may signal", "Example of a helpful response"],
        "rows": [
            ["Joy", "Something valued or enjoyable has happened", "Notice and enjoy it; share if you wish"],
            ["Sadness", "Loss, disappointment or unmet needs", "Allow the feeling; consider comfort or support"],
            ["Fear", "A possible threat or uncertainty", "Check present safety and available options"],
            ["Anger", "A perceived injustice or boundary issue", "Pause, examine the situation and respond safely"],
            ["Shame", "Concern about negative judgment or self-worth", "Challenge harsh labels and seek understanding"],
            ["Guilt", "Concern about a specific action", "Consider repair when appropriate, without self-punishment"],
            ["Loneliness", "A need for connection or belonging", "Reach out to safe people or services"],
        ],
    },
    "misunderstandings": {
        "headers": ["Misunderstanding", "More accurate understanding"],
        "rows": [
            ['"Negative" emotions should always be removed.', "Unpleasant emotions may carry information and are part of life; safe responses matter."],
            ["Feeling angry means acting aggressively.", "An emotion and an action are different. Anger can be managed without harm."],
            ["A calm appearance means a person is fine.", "People may experience strong emotions privately or express them differently."],
            ["A coping exercise always works.", "Some techniques help some people in some settings; adaptation and support may be needed."],
            ["Opening up to anyone is always healthy.", "Choose safe, trustworthy people. Privacy and personal choice matter."],
        ],
    },
    "terms": {
        "headers": ["Term", "Plain-language meaning"],
        "rows": [
            ["Emotion", "An experience that can include feeling, body responses, thoughts and urges."],
            ["Emotional awareness", "Recognizing and naming what one is experiencing."],
            ["Emotional regulation", "Ways of responding to emotions and guiding behavior in context."],
            ["Grounding", "Returning attention to the present environment when overwhelmed."],
            ["Self-kindness", "Responding to oneself with care rather than insults or harsh judgment."],
            ["Psychological distress", "Difficult emotions or thoughts; not automatically a disorder."],
        ],
    },
    "review": {
        "headers": ["Dimension", "Finding", "Required revision"],
        "rows": [
            ["Depth", "Topics often presented on one page", "Expand concepts, context, examples and learning activities"],
            ["Evidence", "Reference list without systematic inline mapping", "Place authoritative references alongside claims and chapter bibliography"],
            ["Safety", "General warning included", "Add signs for routine care, urgent care and self-help limitations"],
            ["Learning", "Some reflection prompts", "Define objectives, recap and answers to knowledge checks"],
            ["Local relevance", "Limited context", "Use inclusive Rwanda-relevant examples and professionally validate terminology"],
            ["Publication", "Not clinically reviewed", "Require clinical, language and accessibility approval"],
        ],
    },
}

REPLACEMENTS = {
    "1.2": ("definitions", r"Term\s+Plain-language meaning.*?participation and support; it is not identical for everyone\."),
    "1.5": ("pressures", r"Possible pressures\s+Possible protective influences.*?Safety, stable services and practical resources"),
    "1.8": ("myths", r"Myth\s+More accurate understanding.*?Asking for assistance is a reasonable step in caring for health\."),
    "2.2": ("emotions", r"Emotion\s+What it may signal\s+Example of a helpful response.*?Reach out to safe people or services"),
    "2.13": ("misunderstandings", r"Misunderstanding\s+More accurate understanding.*?Choose safe, trustworthy people\. Privacy and personal choice matter\."),
    "2.18": ("terms", r"Term\s+Plain-language meaning.*?Difficult emotions or thoughts; not automatically a disorder\."),
}

def compact(text):
    return " ".join(text.split())

def paragraphs(text):
    return [compact(part) for part in re.split(r"\n\s*\n", text.strip()) if compact(part)]

def tokens(text):
    return Counter(re.findall(r"[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*", text.replace("\x7f", "")))

def block_text(block):
    if block["type"] == "table":
        return " ".join(block["headers"] + [cell for row in block["rows"] for cell in row])
    if block["type"] == "list":
        return " ".join(block["items"])
    if block["type"] == "questions":
        return " ".join(question["question"] + " Answer: " + question["answer"] for question in block["items"])
    return block["text"]

def blocks(text):
    result = []
    pending_items = []
    pending_questions = []

    def flush():
        if pending_items:
            result.append({"type": "list", "items": pending_items.copy()})
            pending_items.clear()
        if pending_questions:
            result.append({"type": "questions", "items": pending_questions.copy()})
            pending_questions.clear()

    for part in paragraphs(text):
        marker = re.fullmatch(r"@@TABLE:(\w+)@@", part)
        if marker:
            flush()
            result.append({"type": "table", **TABLES[marker[1]]})
        elif part.startswith("\x7f"):
            if pending_questions:
                flush()
            pending_items.append(part.lstrip("\x7f "))
        elif re.match(r"(?:Question \d+\.|\d+\.)", part) and "Answer:" in part:
            if pending_items:
                flush()
            question, answer = part.split("Answer:", 1)
            pending_questions.append({"question": question.strip(), "answer": answer.strip()})
        else:
            flush()
            result.append({"type": "paragraph", "text": part})
    flush()
    return result

def verify_coverage(label, source, actual):
    expected_tokens = tokens(source)
    actual_tokens = tokens(actual)
    if expected_tokens != actual_tokens:
        raise ValueError(f"Transcription mismatch in {label}: missing={expected_tokens-actual_tokens}; added={actual_tokens-expected_tokens}")
    return {"section": label, "sourceWords": sum(expected_tokens.values()), "matchingWords": sum(actual_tokens.values()), "complete": True}

CHAPTERS = [
    {"number": 1, "slug": "understanding-mental-health-and-wellbeing", "title": "Understanding Mental Health and Wellbeing", "file": "chapter-01-mental-health.pdf", "originalFilename": "VUGA_NDAKUMVA_Mental_Health_Review_and_Expanded_Chapter_01.pdf", "summary": "Explore what mental health means, what shapes wellbeing, and the ways people can care for themselves and support others.", "timeLabel": "Estimated reading", "studyTime": "25-35 minutes, with optional reflection", "referenceHeading": "References and source notes", "editorialHeading": "Publication approval checklist", "reflectionSection": "1.13", "image": "mental-health-group", "position": "50% 42%"},
    {"number": 2, "slug": "recognizing-emotions-and-responding-to-them", "title": "Recognizing Emotions and Responding to Them", "file": "chapter-02-emotions.pdf", "originalFilename": "VUGA_NDAKUMVA_Mental_Health_Expanded_Chapter_02_Emotions.pdf", "summary": "Learn about emotional experiences, practical responses, safe communication, and when additional support may be useful.", "timeLabel": "Suggested study time", "studyTime": "35-50 minutes plus optional exercises", "referenceHeading": "Evidence and editorial references", "editorialHeading": "Pre-publication approval checklist", "reflectionSection": "2.15", "image": "mental-health-listening", "position": "43% 38%"},
]

chapters = []
audit = []
for config in CHAPTERS:
    reader = PdfReader(SOURCE_DIR / config["file"])
    pages = []
    for page in reader.pages:
        text = page.extract_text(extraction_mode="layout")
        text = re.sub(r"(?m)^\s*VUGA NDAKUMVA\s*\|\s*Mental Health Education\s*\|\s*Editorial draft\s+\d+\s*$", "", text)
        pages.append(text.strip())
    all_text = "\n\n".join(pages)
    start = re.search(rf"(?m)^\s*{config['number']}\.1 ", all_text).start()
    reference_start = all_text.index(config["referenceHeading"])
    body = all_text[start:reference_start]
    headings = list(re.finditer(rf"(?m)^\s*({config['number']}\.\d+) (.+)$", body))
    section_data = []
    coverage = []
    for index, heading in enumerate(headings):
        number, title = heading[1], heading[2].strip()
        source = body[heading.end():headings[index + 1].start() if index + 1 < len(headings) else len(body)].strip()
        edited = source
        if number in REPLACEMENTS:
            key, pattern = REPLACEMENTS[number]
            edited, count = re.subn(pattern, f"\n\n@@TABLE:{key}@@\n\n", edited, flags=re.S)
            assert count == 1, (number, count)
        content = blocks(edited)
        coverage.append(verify_coverage(number, source, " ".join(block_text(block) for block in content)))
        section_data.append({"number": number, "id": "section-" + number.replace(".", "-"), "title": title, "blocks": content})
    goal_start = all_text.index("Learning goals") + len("Learning goals")
    goals = [item for block in blocks(all_text[goal_start:start]) if block["type"] == "list" for item in block["items"]]
    assert len(goals) == (5 if config["number"] == 1 else 6)
    front_text = pages[0].split("Section A.")[0] if config["number"] == 1 else all_text[:goal_start - len("Learning goals")]
    front_fields = list(re.finditer(r"(?m)^\s*(?:Purpose:|Editorial status:|For immediate danger:|Safety:|Audience:)", front_text))
    front_matter = [compact(front_text[field.start():front_fields[index + 1].start() if index + 1 < len(front_fields) else len(front_text)]) for index, field in enumerate(front_fields)]
    if config["number"] == 1:
        audience_start = all_text.index("Audience:", all_text.index("Section B."))
        front_matter.insert(0, compact(all_text[audience_start:goal_start - len("Learning goals")]))
    assert len(front_matter) == 4, (config["number"], front_matter)
    references_end = all_text.index(config["editorialHeading"])
    reference_parts = paragraphs(all_text[reference_start + len(config["referenceHeading"]):references_end])
    references = []
    reference_notes = []
    for part in reference_parts:
        if re.match(r"\[\d+\]", part):
            url = re.search(r"https://\S+", part)[0]
            title = re.sub(r"^\[\d+\]\s*", "", part).replace(url, "").strip()
            references.append({"number": int(re.match(r"\[(\d+)\]", part)[1]), "text": title, "url": url, "checkedAt": "2026-11-09"})
        else:
            reference_notes.append(part)
    approval = blocks(all_text[references_end + len(config["editorialHeading"]):])
    editorial_review = []
    if config["number"] == 1:
        review_text = pages[0].split("Section A. Review of the existing handbook", 1)[1]
        replaced, count = re.subn(r"Dimension\s+Finding\s+Required revision.*?Require clinical, language and accessibility approval", "\n\n@@TABLE:review@@\n\n", review_text, flags=re.S)
        assert count == 1
        editorial_review = blocks(replaced)
        coverage.append(verify_coverage("Editorial review", review_text, " ".join(block_text(block) for block in editorial_review)))
    chapter = {
        **{key: value for key, value in config.items() if key not in ["file"]},
        "version": "1.1", "date": "2026-11-09", "language": "English master draft", "author": "VUGA NDAKUMVA",
        "pdfUrl": "/learning/mental-health/" + config["file"], "sourcePages": len(pages), "frontMatter": front_matter,
        "goals": goals, "sections": section_data, "references": references, "referenceNotes": reference_notes,
        "editorialReview": editorial_review, "approval": approval,
    }
    assert len(section_data) == (15 if config["number"] == 1 else 18)
    reflection = next(section for section in section_data if section["number"] == config["reflectionSection"])
    worksheet = f"{config['title']}\nVUGA NDAKUMVA | Version 1.1 | 9 November 2026 | Educational draft\n\n{reflection['number']} {reflection['title']}\n\n"
    for block in reflection["blocks"]:
        worksheet += ("\n\n".join("- " + item for item in block["items"]) if block["type"] == "list" else block["text"]) + "\n\n"
    chapter["worksheetUrl"] = f"/learning/mental-health/chapter-{config['number']:02}-reflection.txt"
    (SOURCE_DIR / Path(chapter["worksheetUrl"]).name).write_text(worksheet, encoding="utf-8")
    chapters.append(chapter)
    audit.append({"chapter": config["number"], "source": config["originalFilename"], "pages": len(pages), "sha256": hashlib.sha256((SOURCE_DIR / config["file"]).read_bytes()).hexdigest(), "sections": coverage})

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text('// Generated from the supplied PDFs by scripts/import-mental-health-chapters.py.\n// Full educational text; edit source content deliberately and retain provenance.\nimport type { MentalHealthChapter } from "./types";\n\nexport const mentalHealthChapters: MentalHealthChapter[] = ' + json.dumps(chapters, ensure_ascii=False, indent=2) + ';\n', encoding="utf-8")
(ROOT / "artifacts/mental-health-source-review.json").write_text(json.dumps(audit, indent=2), encoding="utf-8")
(ROOT / "src/learning/chapter-catalog.generated.ts").write_text('import type { ChapterCatalogEntry } from "./types";\n\nexport const chapterCatalog: ChapterCatalogEntry[] = ' + json.dumps([{key: chapter[key] for key in ["number", "slug", "title", "summary"]} for chapter in chapters], ensure_ascii=False, indent=2) + ';\n', encoding="utf-8")
print(json.dumps({"chapters": len(chapters), "sections": sum(len(chapter['sections']) for chapter in chapters), "tables": sum(sum(block['type'] == 'table' for block in section['blocks']) for chapter in chapters for section in chapter['sections']), "coverage": "All source section words preserved", "output": str(OUTPUT)}))
