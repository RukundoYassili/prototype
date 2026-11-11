from pathlib import Path
import json, unicodedata, subprocess
from pypdf import PdfReader
import pdfplumber
from PIL import Image, ImageDraw

directory = Path(__file__).parent / 'print'
pdf_path = directory / 'chapter-01.pdf'
reader = PdfReader(pdf_path)
def norm(value):
    return ''.join(char for char in unicodedata.normalize('NFKC', value) if char.isalnum()).lower()
full = norm(' '.join(page.extract_text() or '' for page in reader.pages))
expected = json.loads((directory / 'expected.json').read_text(encoding='utf8'))['expected']
expected = ['What this shows' if text.startswith('What this shows: ') else text for text in expected if text != 'Scroll to read the full table.']
missing = [text for text in expected if len(norm(text)) > 8 and norm(text) not in full]
with pdfplumber.open(pdf_path) as pdf:
    image_count = sum(len(page.images) for page in pdf.pages)
    blank = [index + 1 for index, page in enumerate(pdf.pages) if not (page.extract_text() or '').strip() and not page.images]
    outside = [index + 1 for index, page in enumerate(pdf.pages) if any(char['x0'] < -1 or char['x1'] > page.width + 1 or char['top'] < -1 or char['bottom'] > page.height + 1 for char in page.chars)]
report = {'pages': len(reader.pages), 'teachingImages': image_count, 'missingTextUnits': missing, 'blankPages': blank, 'textOutsidePage': outside}
(directory / 'audit.json').write_text(json.dumps(report, indent=2), encoding='utf8')
print(json.dumps(report, indent=2))
poppler = Path('C:/Users/VUGANDAKUMVA/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
subprocess.run([str(poppler), '-r', '65', '-png', str(pdf_path), str(directory / 'page')], check=True)
pages = sorted(directory.glob('page-*.png'), key=lambda path: int(path.stem.split('-')[-1]))
for start in range(0, len(pages), 12):
    canvas = Image.new('RGB', (900, 1740), '#e9e7ec')
    draw = ImageDraw.Draw(canvas)
    for index, path in enumerate(pages[start:start + 12]):
        image = Image.open(path).convert('RGB')
        image.thumbnail((282, 405))
        x = index % 3 * 300 + 9
        y = index // 3 * 435 + 23
        canvas.paste(image, (x, y))
        draw.text((x, y - 17), f'Page {start + index + 1}', fill='#392653')
    canvas.save(directory / f'overview-{start // 12 + 1}.png')
assert not blank and not outside
assert image_count == 12
assert not missing, 'Printed source or teaching text needs review.'
