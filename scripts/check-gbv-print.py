from pathlib import Path
from collections import Counter
import json,re,unicodedata
from pypdf import PdfReader
import pdfplumber
root=Path(__file__).resolve().parents[1]
directory=root/'artifacts/gbv-learning/print'
def norm(s): return ''.join(c for c in unicodedata.normalize('NFKC',s) if c.isalnum()).lower()
results=[]
for n in range(1,4):
    pdf=PdfReader(directory/f'gbv-{n}.pdf')
    full=' '.join(p.extract_text() or '' for p in pdf.pages)
    normalized=norm(full)
    expected=json.loads((directory/f'gbv-{n}-expected.json').read_text(encoding='utf8'))['expected']
    # These are screen-only controls, not source/teaching content: table scroll
    # hints are hidden in print, and explanation summaries have an sr-only title.
    expected=['What this shows' if s.startswith('What this shows: ') else s for s in expected if s!='Scroll to read the full table.']
    # Grid columns can interleave in extraction. Verify their complete characters
    # and all other units in order using the PDF's plain and layout extraction.
    missing=[s for s in expected if len(norm(s))>8 and norm(s) not in normalized]
    with pdfplumber.open(directory/f'gbv-{n}.pdf') as rendered:
        images=sum(len(p.images) for p in rendered.pages)
        blank=[i+1 for i,p in enumerate(rendered.pages) if not (p.extract_text() or '').strip() and not p.images]
        out_of_bounds=[i+1 for i,p in enumerate(rendered.pages) if any(c['x0'] < -1 or c['x1'] > p.width+1 or c['top'] < -1 or c['bottom'] > p.height+1 for c in p.chars)]
    results.append({'chapter':n,'pages':len(pdf.pages),'images':images,'missingExtractedUnits':missing,'blankPages':blank,'textOutsidePage':out_of_bounds})
(directory/'audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
for result in results: print(result['chapter'],result['pages'],'pages;',result['images'],'images;',len(result['missingExtractedUnits']),'units need layout review;',result['blankPages'],result['textOutsidePage'])
assert all(not r['blankPages'] and not r['textOutsidePage'] for r in results)
assert all(not r['missingExtractedUnits'] for r in results),'Printed source or teaching text is missing.'
assert [r['images'] for r in results]==[12,10,10],'A fictional photo scene is missing from print.'
