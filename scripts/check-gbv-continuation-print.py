"""Audit and render the seven browser-print chapters, without editing source PDFs."""
from pathlib import Path
import json,re,unicodedata
from pypdf import PdfReader
import pdfplumber
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
DIR=ROOT/'artifacts/gbv-continuation/print'
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKC',s) if c.isalnum()).lower()
results=[]
for n in range(4,11):
    reader=PdfReader(DIR/f'gbv-{n}.pdf')
    raw=norm(' '.join(p.extract_text() or '' for p in reader.pages))
    expected=json.loads((DIR/f'gbv-{n}-expected.json').read_text(encoding='utf8'))['expected']
    expected=[s for s in expected if s not in ['Scroll to read the full table.','Original cover information']]
    missing=[s for s in expected if len(norm(s))>8 and norm(s) not in raw]
    with pdfplumber.open(DIR/f'gbv-{n}.pdf') as pdf:
        blank=[];outside=[];thumbs=[]
        for i,p in enumerate(pdf.pages,1):
            if not (p.extract_text() or '').strip():blank.append(i)
            if any(c['x0']<-.5 or c['x1']>p.width+.5 or c['top']<-.5 or c['bottom']>p.height+.5 for c in p.chars):outside.append(i)
            image=p.to_image(resolution=60).original.convert('RGB')
            image.save(DIR/f'gbv-{n}-page-{i}.png')
            image.thumbnail((374,530));thumbs.append(image)
        for start in range(0,len(thumbs),6):
            sheet=Image.new('RGB',(1152,1132),'#e2e9dc');draw=ImageDraw.Draw(sheet)
            for j,img in enumerate(thumbs[start:start+6]):
                x=(j%3)*384;y=(j//3)*566
                draw.text((x+8,y+5),f'GBV {n} / page {start+j+1}',fill='#224834');sheet.paste(img,(x+5,y+26))
            sheet.save(DIR/f'gbv-{n}-sheet-{start//6+1}.jpg')
    results.append({'chapter':n,'pages':len(reader.pages),'checkedTextUnits':len(expected),'missing':missing,'blankPages':blank,'outsidePage':outside})
    print(n,len(reader.pages),'pages',len(expected),'text units;',len(missing),'missing;',blank,outside,flush=True)
(DIR/'audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
assert all(not r['missing'] and not r['blankPages'] and not r['outsidePage'] for r in results)
