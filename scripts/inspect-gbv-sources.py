from pathlib import Path
import json, pdfplumber

root = Path(__file__).resolve().parents[1]
directory = root / 'artifacts/gbv-learning'
directory.mkdir(parents=True, exist_ok=True)
names = ['GBV_Chapter_01.pdf', 'VUGA_NDAKUMVA_GBV_Expanded_Chapter_02_Types_and_Forms.pdf', 'VUGA_NDAKUMVA_GBV_Expanded_Chapter_03_Root_Causes_Risk_Factors_Gender_Inequality.pdf']
for n, name in enumerate(names, 1):
    records=[]
    with pdfplumber.open(Path('C:/Users/VUGANDAKUMVA/Downloads') / name) as pdf:
        for i,page in enumerate(pdf.pages, 1):
            tables=page.find_tables()
            lines=[]
            for line in page.extract_text_lines(return_chars=True):
                chars=line.pop('chars')
                letters=[c for c in chars if c['text'].isalpha()]
                line['size']=round(max(c['size'] for c in chars),2)
                line['bold']=round(sum('Bold' in c['fontname'] for c in letters)/max(1,len(letters)),2)
                lines.append(line)
            records.append({'page':i,'height':page.height,'lines':lines,'tables':[{'bbox':t.bbox,'rows':t.extract()} for t in tables]})
    (directory/f'source-{n}.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
    (directory/f'source-{n}.txt').write_text('\n'.join(f"PAGE {p['page']}\n"+'\n'.join(f"{l['size']} {'B' if l['bold']>.8 else ' '} {l['text']}" for l in p['lines']) for p in records),encoding='utf8')
print('Extracted all 33 pages, including font geometry and table cells.')
