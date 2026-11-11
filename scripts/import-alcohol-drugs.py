"""Import all four Alcohol & Drugs PDFs without shortening source lessons.
Run inspect-alcohol-drugs.py first. Tables are audited against source characters.
"""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json, re, shutil, unicodedata
import pdfplumber
from pypdf import PdfReader

spec = importlib.util.spec_from_file_location('mh_sources', Path(__file__).with_name('inspect-alcohol-drugs.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
FILES = module.FILES
ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / 'artifacts/alcohol-drugs-01-04'
DEST = ROOT / 'public/learning/alcohol-drugs'
OUT = ROOT / 'src/learning/alcohol-drugs'
def compact(s): return ' '.join(s.split())
def ordered(s): return ''.join(c for c in unicodedata.normalize('NFKC', s) if c.isalnum())
def coverage(s): return Counter(ordered(s))
def text(b):
    t = b['type']
    if t == 'table': return ' '.join(b['headers'] + [c for row in b['rows'] for c in row])
    if t == 'list': return ' '.join(b['items'])
    if t in ['example', 'subsection']: return b['title']+' '+' '.join(map(text, b['blocks']))
    if t == 'disclosure': return ' '.join(map(text, b['blocks'])) # UI-only disclosure label.
    if t == 'questions': return ' '.join(q['question']+' '+q.get('answerLabel','')+' '+q['answer'] for q in b['items'])
    if t == 'references': return b['sourceText']
    return b['text']
def walk(blocks):
    for b in blocks:
        yield b
        if 'blocks' in b: yield from walk(b['blocks'])

def events_for(n):
    pages = json.loads((AUDIT/f'source-{n}.json').read_text(encoding='utf8'))
    events, tables = [], []
    with pdfplumber.open(Path('C:/Users/VUGANDAKUMVA/Downloads')/FILES[n]) as pdf:
        for page in pages:
            table_regions = []
            for index, table in enumerate(pdf.pages[page['page']-1].find_tables()):
                special = {(1,4):[65,160,292,530],(1,5):[65,200,530],(1,6):[65,255,530],(1,10):[65,187,530],(4,3):[64,176,366,543],(4,7):[64,196,543]}
                xs = special.get((n,page['page']))
                rows = []
                if xs:
                    for row in table.rows:
                        rows.append([compact(pdf.pages[page['page']-1].crop((left,row.bbox[1],right,row.bbox[3])).extract_text() or '') for left,right in zip(xs,xs[1:])])
                else: rows = [[compact(c or '') for c in row] for row in table.extract()]
                b = {'type':'table','headers':rows[0],'rows':rows[1:]}
                raw = compact(' '.join(c or '' for row in table.extract() for c in row))
                assert coverage(raw) == coverage(text(b)), (n,'table characters',raw,rows)
                tables.append({'page':page['page'],'columns':xs,'sourceText':raw,'table':b,'allCharactersPreserved':True})
                table_regions.append(table.bbox)
                events.append({'kind':'table','page':page['page'],'top':table.bbox[1],'block':b})
            for line in page['lines']:
                if line['top'] > page['height']-45: continue # Running footer only.
                if any(t[1]-.5 <= line['top'] < t[3] for t in table_regions): continue
                events.append({**line,'page':page['page'],'kind':'line'})
    events.sort(key=lambda e:(e['page'],e['top']))
    return events, tables

def blocks_for(events):
    result=[];pending=None;previous=None
    def flush():
        nonlocal pending
        if pending: result.append(pending)
        pending=None
    for e in events:
        if e['kind']=='table': flush();result.append(e['block']);previous=None;continue
        value=e['text'].replace('(cid:127)','•').replace('\x7f','•')
        kind='heading' if e['bold']>.8 and e['size']>=10 else 'paragraph'
        fresh=bool(re.match(r'^(?:•|\d+\. |\[R?\d+\]|(?:Answer|Reflection|Situation|Supportive response|Safety note|How to practice|Purpose|Audience|Publication status|Edition|Important|Safety and safeguarding):)',value))
        # Glossary entries and labelled short paragraphs remain independently readable.
        if re.match(r'^[A-Z][A-Za-z -]{1,45}:',value): fresh=True
        same=previous and previous['page']==e['page']
        gap=e['top']-previous['bottom'] if same else 0
        joins=pending and pending['type']==kind and not fresh and gap<=8.5
        if kind=='heading': joins=joins and same and abs(e['size']-previous['size'])<.3
        url_tail=pending and re.search(r'https?://\S*$',pending['text'])
        if url_tail and not fresh and ' ' not in value and kind=='paragraph': joins=True
        if joins: pending['text']+=('' if url_tail and ' ' not in value else ' ')+value
        else: flush();pending={'type':kind,'text':value}
        previous=e
    flush()
    out=[]
    for b in result:
        if b['type']=='paragraph' and b['text'].startswith('•'):
            if out and out[-1]['type']=='list':out[-1]['items'].append(b['text'].lstrip('• '))
            else:out.append({'type':'list','items':[b['text'].lstrip('• ')]})
        else:out.append(b)
    return out

def structure(blocks,n,section):
    result=[];i=0
    while i<len(blocks):
        b=blocks[i];s=b.get('text','')
        m=re.match(r'^(Case|Scenario|Activity) ([A-E1-5])\b',s) if b['type']=='heading' else None
        child_case=re.match(r'^([A-E])\. ',s) if n==10 and section.endswith('-scenarios') else None
        child_activity=re.match(r'^([1-5])\. ',s) if n==10 and section.endswith('-activities') else None
        if m or child_case or child_activity:
            activity=bool(child_activity or (m and m[1]=='Activity'))
            key=m[2] if m else (child_case or child_activity)[1]
            group={'type':'subsection' if activity else 'example','id':f'mh-{n}-'+('activity' if activity else 'scenario')+'-'+key.lower(),'title':s,'blocks':[]}
            i+=1
            while i<len(blocks) and blocks[i]['type']!='heading':group['blocks'].append(blocks[i]);i+=1
            result.append(group);continue
        if n==9 and section.endswith('-17') and re.match(r'^\d+\. ',s):
            if s.startswith('3. '):cut=s.index('Examples:')
            else:cut=s.index('?')+1
            q={'question':s[:cut].strip(),'answer':s[cut:].strip(),'answerLabel':''}
            if result and result[-1]['type']=='questions':result[-1]['items'].append(q)
            else:result.append({'type':'questions','items':[q]})
            i+=1;continue
        if n==10 and section.endswith('-knowledge') and b['type']=='heading':
            answer=blocks[i+1]['text'];assert answer.startswith('Answer:'),(n,s,answer)
            q={'question':s,'answer':answer[len('Answer:'):].strip(),'answerLabel':'Answer:'}
            if result and result[-1]['type']=='questions':result[-1]['items'].append(q)
            else:result.append({'type':'questions','items':[q]})
            i+=2;continue
        result.append(b);i+=1
    if n==8 and section.endswith('-18'):
        result=[{'type':'disclosure','title':'Show answers and explanations','blocks':result}]
    assert ordered(' '.join(map(text,blocks)))==ordered(' '.join(map(text,result))),(n,section,'group text changed')
    return result

def references_for(blocks):
    result=[];refs=[];i=0
    while i<len(blocks):
        b=blocks[i];s=b.get('text','');m=re.match(r'^(\[R?(\d+)\]) ',s)
        if not m:result.append(b);i+=1;continue
        raw=s;i+=1
        while i<len(blocks) and blocks[i].get('text','').startswith('http'):
            raw+=' '+blocks[i]['text'];i+=1
        urls=re.findall(r'https?://\S+',raw);assert len(urls)==1,raw
        ref={'number':int(m[2]),'label':m[1],'text':raw[len(m[1]):].strip(),'url':urls[0]}
        refs.append(ref);result.append({'type':'references','numbers':[ref['number']],'sourceText':raw})
    assert ordered(' '.join(map(text,blocks)))==ordered(' '.join(map(text,result))),'reference text changed'
    return result,refs

CONFIG = {
1: ('what-are-alcohol-and-drugs','What Are Alcohol and Drugs?', 'Understand alcohol, psychoactive substances, everyday risks, and respectful ways to seek support.',15,6,'8–12 minutes'),
2: ('how-substances-affect-the-brain-and-body','How Alcohol and Other Substances Affect the Brain and Body','Explore effects on the brain and body through detailed explanations, comparison tables, and fictional learning cases.',11,8,'At your own pace'),
3: ('short-and-long-term-health-risks','Short-Term and Long-Term Health Risks of Alcohol and Drug Use','Understand immediate and longer-term risks, protective support, and when medical attention matters.',20,10,'12–15 minutes'),
4: ('understanding-use-dependence-and-addiction','Understanding Substance Use, Misuse, Dependence & Addiction','Distinguish use, harmful use, tolerance, physical dependence, and substance use disorders without stigma.',17,7,'12–18 minutes'),
}

def import_all():
    DEST.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
    chapters=[];audits=[]
    for n,(slug,title,summary,count,refcount,time) in CONFIG.items():
        events,tables=events_for(n);blocks=blocks_for(events)
        pattern=r'^(\d{2})(?:\s*\|\s*|\.\s+|\s+)(.+)$'
        first=next(i for i,b in enumerate(blocks) if b['type']=='heading' and re.match(pattern,b['text']))
        intro=blocks[:first];sections=[];headings=[]
        for b in blocks[first:]:
            m=re.match(pattern,b.get('text','')) if b['type']=='heading' else None
            if m and int(m[1])==len(sections)+1:
                sections.append({'number':m[1],'id':f'ad-{n}-section-{int(m[1])}','title':m[2],'blocks':[]});headings.append(b['text'])
            else: sections[-1]['blocks'].append(b)
        assert len(sections)==count,(n,[(s['number'],s['title']) for s in sections])
        refs=[]
        for sec in sections:
            original=ordered(' '.join(map(text,sec['blocks'])))
            sec['blocks']=structure(sec['blocks'],n,sec['id'])
            # Native disclosures preserve every answer verbatim without collecting responses.
            for b in walk(sec['blocks']):
                if b['type']=='subsection':
                    b['id']=b['id'].replace('mh-','ad-')
                    for i,inner in enumerate(b['blocks']):
                        if inner.get('text','').startswith(('Feedback:', 'Recommended answer:')):
                            b['blocks'][i]={'type':'disclosure','title':'Read the source feedback','blocks':[inner]}
                elif b['type']=='example':b['id']=b['id'].replace('mh-','ad-')
            if sec==sections[-1]:sec['blocks'],refs=references_for(sec['blocks'])
            assert ordered(' '.join(map(text,sec['blocks'])))==original,(n,sec['id'])
        assert len(refs)==refcount,(n,'references',refs)
        original=' '.join(text(e['block']) if e['kind']=='table' else e['text'] for e in events)
        restored=' '.join(map(text,intro))+' '+' '.join(h+' '+' '.join(map(text,s['blocks'])) for h,s in zip(headings,sections))
        assert ordered(original)==ordered(restored),(n,'ordered source coverage')
        source=Path('C:/Users/VUGANDAKUMVA/Downloads')/FILES[n]
        # Independent parser checks all text except the repeated running footer.
        independent=[]
        for pno,page in enumerate(PdfReader(source).pages,1):
            lines=(page.extract_text() or '').splitlines()
            for line in lines:
                if line.strip().startswith('Editorial draft'):continue
                if line.startswith('VUGA NDAKUMVA') and (' | ' in line or ' / Alcohol' in line):continue
                if re.match(r'^(?:Editorial draft [•·] )?'+str(pno)+r'$',line.strip()):continue
                independent.append(line)
        missing=coverage(' '.join(independent))-coverage(restored);extra=coverage(restored)-coverage(' '.join(independent))
        assert not missing and not extra,(n,'independent',missing,extra)
        activity=[s for s in sections if any(b['type']=='subsection' for b in s['blocks'])]
        worksheet=f'topic-{n:02}-activities.txt'
        (DEST/worksheet).write_text(title+'\nOptional learning activities — educational draft\nNothing is submitted. You may skip any activity.\n\n'+'\n\n'.join(s['title']+'\n'+'\n\n'.join(map(text,s['blocks'])) for s in activity),encoding='utf8')
        status='Educational draft. Clinical, youth-safeguarding, accessibility, language and Rwanda referral review remain required before public use. See the original publication notices and review requirements in this lesson.'
        chapter=dict(number=n,slug=slug,title=title,summary=summary,timeLabel=time,studyTime=time,referenceHeading=sections[-1]['title'],editorialHeading='Publication review',reflectionSection=activity[0]['number'],image=['mental-health-listening','mental-health-connection','mental-health-group','mental-health-listening'][n-1],position='50% 40%',originalFilename=FILES[n],version='1.0',date='2026-11-11',language='English',author='VUGA NDAKUMVA',pdfUrl='/learning/alcohol-drugs/'+FILES[n],worksheetUrl='/learning/alcohol-drugs/'+worksheet,worksheetLabel='Download learning activities',sourcePages=len(PdfReader(source).pages),frontMatter=[text(b) for b in intro],coverBlocks=intro,introductionBlocks=[{'type':'paragraph','text':'Read at your own pace. Activities use fictional situations and are optional. Nothing is submitted or scored. Original PDF wording, including descriptions of planned website features, is preserved below.'}],safetyNotices=[],goalsHeading='About this lesson',goalBlocks=[{'type':'paragraph','text':summary}],goals=[],editionText='English master · Version 1.0 · 11 November 2026',publicationStatus=status,endMatterPlacement='inline',sections=sections,references=refs,referenceNotes=[],editorialReview=[],approval=[])
        shutil.copyfile(source,DEST/FILES[n]);digest=hashlib.sha256(source.read_bytes()).hexdigest();assert hashlib.sha256((DEST/FILES[n]).read_bytes()).hexdigest()==digest
        chapters.append(chapter);audits.append({'topic':n,'pages':chapter['sourcePages'],'sections':len(sections),'references':len(refs),'tables':tables,'orderedSourcePreserved':True,'independentPdfCoverage':True,'sha256':digest,'filename':FILES[n]})
        print(n,len(sections),'sections; complete ordered and independent source checks passed')
    for filename,name,data,typ in [('chapters.generated.ts','alcoholChapters',chapters,'LearningChapter'),('catalog.generated.ts','alcoholCatalog',[{k:c[k] for k in ['number','slug','title','summary']} for c in chapters],'ChapterCatalogEntry')]:
        (OUT/filename).write_text('// Generated by scripts/import-alcohol-drugs.py. Preserve source wording.\nimport type { '+typ+' } from "../types";\nexport const '+name+': '+typ+'[] = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
    (AUDIT/'content.json').write_text(json.dumps(chapters,ensure_ascii=False,indent=2),encoding='utf8')
    (DEST/'source-audit.json').write_text(json.dumps({'reviewedOn':'2026-11-11','clinicalApproval':False,'sources':audits},ensure_ascii=False,indent=2),encoding='utf8')

if __name__=='__main__':import_all()
