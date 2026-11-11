from pathlib import Path
import subprocess, json
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parents[1]
directory=root/'artifacts/gbv-learning/print'
for n in range(1,4):
    prefix=directory/f'gbv-{n}-page'
    subprocess.run(['pdftoppm','-r','55','-png',str(directory/f'gbv-{n}.pdf'),str(prefix)],check=True)
    pages=sorted(directory.glob(f'gbv-{n}-page-*.png'))
    canvas=Image.new('RGB',(4*260,((len(pages)+3)//4)*390),'#e6e9e2')
    draw=ImageDraw.Draw(canvas)
    for i,page in enumerate(pages):
        thumb=Image.open(page).convert('RGB');thumb.thumbnail((246,354))
        x=(i%4)*260+7;y=(i//4)*390+23
        canvas.paste(thumb,(x,y));draw.text((x,y-18),f'Chapter {n} / page {i+1}',fill='#203e2d')
    canvas.save(directory/f'gbv-{n}-overview.png')
print('Rendered all 69 browser-print pages and three labeled overviews.')
