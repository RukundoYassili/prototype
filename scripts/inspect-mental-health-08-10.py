"""Extract and render the three supplied Mental Health continuation PDFs."""
from pathlib import Path
import json
import pdfplumber
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/mental-health-08-10'
FILES = {
    8: 'Mental_Health_Chapter_08_Sleep_and_Wellbeing.pdf',
    9: 'Mental_Health_Chapter_09_Relationships_and_Social_Wellbeing.pdf',
    10: 'Mental_Health_Chapter_10_Child_and_Adolescent_Mental_Health.pdf',
}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for number, name in FILES.items():
        records, thumbs = [], []
        with pdfplumber.open(Path('C:/Users/VUGANDAKUMVA/Downloads') / name) as pdf:
            for index, page in enumerate(pdf.pages, 1):
                lines = []
                for line in page.extract_text_lines(return_chars=True):
                    chars = line.pop('chars')
                    letters = [c for c in chars if c['text'].isalpha()]
                    line['size'] = round(max(c['size'] for c in chars), 2)
                    line['bold'] = round(sum('Bold' in c['fontname'] for c in letters) / max(1, len(letters)), 2)
                    lines.append(line)
                records.append({'page': index, 'width': page.width, 'height': page.height,
                    'lines': lines, 'tables': [{'bbox': t.bbox, 'rows': t.extract()} for t in page.find_tables()]})
                img = page.to_image(resolution=100).original.convert('RGB')
                img.save(OUT / f'source-{number}-page-{index}.png')
                img.thumbnail((390, 550))
                thumbs.append(img)
        for start in range(0, len(thumbs), 6):
            group = thumbs[start:start+6]
            sheet = Image.new('RGB', (1200, ((len(group)+2)//3)*585), '#e8ece3')
            draw = ImageDraw.Draw(sheet)
            for j, img in enumerate(group):
                x, y = (j % 3)*400, (j//3)*585
                draw.text((x+10, y+5), f'Chapter {number} / page {start+j+1}', fill='#163b2b')
                sheet.paste(img, (x+5, y+25))
            sheet.save(OUT / f'source-{number}-sheet-{start//6+1}.jpg')
        (OUT / f'source-{number}.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf8')
        (OUT / f'source-{number}.txt').write_text('\n'.join(f"PAGE {p['page']}\n"+'\n'.join(f"{l['size']:5} {'B' if l['bold']>.8 else ' '} {l['text']}" for l in p['lines']) for p in records), encoding='utf8')
        print(f'Chapter {number}: {len(records)} pages, {sum(len(p["tables"]) for p in records)} tables', flush=True)
