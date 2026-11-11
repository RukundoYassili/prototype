"""Inspect generated browser-print QA PDFs; never edits the source lessons."""
from pathlib import Path
import json
import re
import sys
import pdfplumber
from pypdf import PdfReader

root = Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1] / "artifacts/learning-visuals/review"
normalize = lambda text: re.sub(r"\s+", "", text).casefold()
report = []
content_file=Path(__file__).resolve().parents[1]/"artifacts/mental-health-content-03-07.json"
source_chapters=json.loads(content_file.read_text(encoding="utf8")) if content_file.exists() else []
def source_strings(block):
    kind=block["type"]
    if kind=="table": return block["headers"]+[cell for row in block["rows"] for cell in row]
    if kind=="list": return block["items"]
    if kind=="questions": return [text for item in block["items"] for text in [item["question"],item["answer"]]]
    if kind in ["example","subsection","disclosure"]: return [block["title"]]+[text for child in block["blocks"] for text in source_strings(child)]
    if kind=="references": return [block["sourceText"]]
    return [block["text"]]

def source_tables(blocks):
    for block in blocks:
        if block["type"]=="table": yield block
        elif "blocks" in block: yield from source_tables(block["blocks"])

def source_questions(blocks):
    for block in blocks:
        if block["type"]=="questions": yield from block["items"]
        elif "blocks" in block: yield from source_questions(block["blocks"])
for expected_file in sorted(root.glob("chapter-*-print-expected.json")):
    chapter=int(expected_file.name.split('-')[1])
    expected = json.loads((root / f"chapter-{chapter}-print-expected.json").read_text(encoding="utf8"))
    visuals = json.loads((root / f"chapter-{chapter}-print-visuals.json").read_text(encoding="utf8"))
    with pdfplumber.open(root / f"chapter-{chapter}-print.pdf") as pdf:
        # Content-stream order preserves paragraphs in side-by-side scene cards.
        # Geometric row extraction interleaves the two columns' captions.
        reader = PdfReader(root / f"chapter-{chapter}-print.pdf")
        page_texts = [normalize(page.extract_text() or "") for page in reader.pages]
        text = "".join(page_texts)
        geometric_text="".join(normalize(page.extract_text() or "") for page in pdf.pages)
        missing = [item for item in expected if normalize(item) not in text]
        source=next((item for item in source_chapters if item["number"]==chapter),None)
        source_expected=[]
        if source:
            source_expected=[source["title"],source["editionText"],source["goalsHeading"]]+source["goals"]
            source_expected += [item for block in source["introductionBlocks"]+source["afterGoals"] for item in source_strings(block)]
            for section in source["sections"]:
                source_expected.append(section["title"])
                source_expected += [item for block in section["blocks"] for item in source_strings(block)]
        # Grid children can be painted late in a page's content stream. The
        # geometric reading order provides an independent equivalent for prose.
        missing_source=[item for item in source_expected if normalize(item) not in text and normalize(item) not in geometric_text]
        tables=[table for section in source["sections"] for table in source_tables(section["blocks"])] if source else []
        orphaned_table_headers=[table["headers"] for table in tables if table["rows"] and not any(all(normalize(cell) in content for cell in table["headers"]+table["rows"][0]) for content in page_texts)]
        questions=[question for section in source["sections"] for question in source_questions(section["blocks"])] if source else []
        split_questions=[question["question"] for question in questions if not any(all(normalize(question[key]) in content for key in ["question","answer"]) for content in page_texts)]
        pages = []
        for number, page in enumerate(pdf.pages, 1):
            outside = [char for char in page.chars if char["x0"] < -1 or char["x1"] > page.width + 1 or char["top"] < -1 or char["bottom"] > page.height + 1]
            pages.append({"page": number, "images": len(page.images), "charactersOutsidePage": len(outside), "textCharacters": len(page.chars)})
        split_visuals = [visual["id"] for visual in visuals if not any(all(normalize(visual[key]) in content for key in ("title", "explanation", "reflection")) for content in page_texts)]
        item = {"chapter": chapter, "pages": len(pdf.pages), "expectedTextBlocks": len(expected), "expectedSourceBlocks":len(source_expected),"missingSource":missing_source,"missing": missing, "splitVisuals": split_visuals, "tablesChecked":len(tables),"orphanedTableHeaders":orphaned_table_headers,"questionPairsChecked":len(questions),"splitQuestions":split_questions,"pageChecks": pages}
        report.append(item)
        assert not missing, f"Missing print content: {missing}"
        assert not missing_source, f"Missing source print content: {[item[:160] for item in missing_source]}"
        assert not orphaned_table_headers, f"Printed table header separated from its first row: {orphaned_table_headers}"
        assert not split_questions, f"Printed question separated from its answer: {split_questions}"
        assert not split_visuals, f"Visual units split across print pages: {split_visuals}"
        assert sum(page["images"] for page in pages) == sum(visual["scenes"] for visual in visuals), "Printed scene count differs from the reader"
        assert not any(page["charactersOutsidePage"] for page in pages), "Print text outside page"
        assert all(page["textCharacters"] for page in pages), "Unexpected blank print page"
(root / "print-checks.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf8")
print(json.dumps([{key: item[key] for key in ("chapter", "pages", "expectedTextBlocks", "missing")} for item in report]))
