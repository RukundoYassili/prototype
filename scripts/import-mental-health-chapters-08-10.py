"""Import complete Chapters 8–10 without changing the previous collections.

Run inspect-mental-health-08-10.py first. Every source page was reviewed;
tables use measured column boundaries because the PDFs have no vertical rules.
"""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json, re, shutil, unicodedata
import pdfplumber
from pypdf import PdfReader

spec = importlib.util.spec_from_file_location('mh_sources', Path(__file__).with_name('inspect-mental-health-08-10.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
FILES = module.FILES
ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / 'artifacts/mental-health-08-10'
DEST = ROOT / 'public/learning/mental-health'
OUT = ROOT / 'src/learning'
CONFIG = {
    8: ('understanding-sleep-and-mental-wellbeing', 'Understanding Sleep and Mental Wellbeing',
        'Explore sleep rhythms, common sleep difficulties, realistic routines, and when professional assessment matters.',
        'mental-health-listening', 19, 21, 10, 4, 3, 11),
    9: ('relationships-social-connection-and-mental-wellbeing', 'Relationships, Social Connection, and Mental Wellbeing',
        'Understand connection, loneliness, respectful boundaries, communication, and safe ways to seek support.',
        'mental-health-connection', 20, 21, 6, 5, 5, 10),
    10: ('child-and-adolescent-mental-health', 'Child and Adolescent Mental Health',
        'Learn about development, supportive families and schools, bullying, safeguarding, and age-appropriate care.',
        'mental-health-group', 14, 20, 7, 5, 5, 10),
}
UNNUMBERED = {
    'Scientific and institutional references': 'references',
    'Pre-publication review checklist': 'editorial',
    'Publication review checklist': 'editorial',
    'Five Rwanda-relevant fictional learning scenarios': 'scenarios',
    'Five practical learning activities': 'activities',
    'Knowledge check: questions and explained answers': 'knowledge',
    'Short glossary': 'glossary',
    'References and evidence register': 'references',
    'Editorial and publication safeguards': 'editorial',
}

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
                if n == 10: xs = [61, 161, 338, 546]
                elif page['page'] == 2: xs = [54, 144, 564]
                elif page['page'] == 8: xs = [54.22222222222222, 109, 314, 564]
                elif index == 0: xs = [54, 154, 564]
                else: xs = [54, 234, 564]
                rows = []
                for row in table.rows:
                    rows.append([compact(pdf.pages[page['page']-1].crop((left,row.bbox[1],right,row.bbox[3])).extract_text() or '') for left,right in zip(xs,xs[1:])])
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

def import_all():
    chapters=[];audits=[];manifest=[]
    DEST.mkdir(parents=True,exist_ok=True)
    for n,config in CONFIG.items():
        slug,title,summary,image,numbered_count,reader_count,ref_count,case_count,activity_count,page_count=config
        events,tables=events_for(n)
        blocks=blocks_for(events)
        first=next(i for i,b in enumerate(blocks) if b['type']=='heading' and re.match(r'^0?1\. ',b['text']))
        intro=blocks[:first];sections=[];headings=[]
        for b in blocks[first:]:
            s=b.get('text','');m=re.match(r'^(\d+)\. (.+)$',s) if b['type']=='heading' else None
            expected=sum(bool(sec['number']) for sec in sections)+1
            if m and int(m[1])==expected and expected<=numbered_count:
                sections.append({'number':m[1],'id':f'section-{n}-{int(m[1])}','title':m[2],'blocks':[]});headings.append(s)
            elif b['type']=='heading' and s in UNNUMBERED:
                sections.append({'number':'','id':f'section-{n}-{UNNUMBERED[s]}','title':s,'blocks':[]});headings.append(s)
            else:sections[-1]['blocks'].append(b)
        assert len(sections)==reader_count and sum(bool(s['number']) for s in sections)==numbered_count,(n,'sections',[(s['number'],s['title']) for s in sections])
        refs=[];section_audit=[]
        for sec,heading in zip(sections,headings):
            before=' '.join(map(text,sec['blocks']))
            sec['blocks']=structure(sec['blocks'],n,sec['id'])
            if 'references' in sec['title'].lower():sec['blocks'],refs=references_for(sec['blocks'])
            assert ordered(before)==ordered(' '.join(map(text,sec['blocks']))),(n,sec['id'],'section mismatch')
            section_audit.append({'id':sec['id'],'sourceHeading':heading,'orderedContentPreserved':True,'sourceCharacters':len(ordered(before))})
        assert len(refs)==ref_count,(n,'refs',refs)
        goal_index=next(i for i,b in enumerate(intro) if b.get('text','').startswith(('Learning goals','Learning outcomes')))
        cover=intro[:goal_index];goal_heading=intro[goal_index]['text'];goal_blocks=intro[goal_index+1:];after=[]
        if n==9:
            split=next(i for i,b in enumerate(goal_blocks) if b['type']=='heading')
            after=goal_blocks[split:];goal_blocks=goal_blocks[:split]
        if n==10:after=goal_blocks[1:];goal_blocks=goal_blocks[:1]
        safety=[b for b in cover if b.get('text','').startswith(('Important:','Safety and safeguarding:'))]
        cover=[b for b in cover if b not in safety]
        edition=next(b['text'] for b in intro if b.get('text','').startswith(('Edition 1.0','Version 1.0','Educational draft — version')))
        if n==9:edition='Version 1.0 | 11 November 2026 | English'
        if n==8:status=next(b['text'] for b in intro if b.get('text','').startswith('Publication status.'))
        elif n==9:status=next(b['text'] for b in intro if b.get('text','').startswith('Version 1.0'))
        else:status=edition+'. '+next(b['text'] for b in intro if b.get('text','').startswith('For caregivers,'))
        reconstructed_intro=' '.join(map(text,cover+safety))+' '+goal_heading+' '+' '.join(map(text,goal_blocks+after))
        assert coverage(' '.join(map(text,intro)))==coverage(reconstructed_intro),(n,'frontmatter')
        source=Path('C:/Users/VUGANDAKUMVA/Downloads')/FILES[n]
        pdf=PdfReader(source);assert len(pdf.pages)==page_count
        independent=[]
        for pno,p in enumerate(pdf.pages,1):
            lines=(p.extract_text() or '').splitlines()
            footer=False
            for i,line in enumerate(lines):
                line=compact(line)
                if re.match(r'^VUGA NDAKUMVA [|·] (?:Mental Health (?:Content Library|Library)|MENTAL HEALTH CONTENT LIBRARY) [|·] (?:EDUCATIONAL DRAFT|Educational draft)',line):footer=True;continue
                if (line==str(pno) or re.match(r'^Chapter 10 · \d+$',line)) and (footer or i>=len(lines)-2):footer=False;continue
                footer=False
                independent.append(line)
        body=reconstructed_intro+' '+' '.join(h+' '+' '.join(map(text,s['blocks'])) for h,s in zip(headings,sections))
        assert coverage(' '.join(independent))==coverage(body),(n,'independent PDF mismatch',coverage(' '.join(independent))-coverage(body),coverage(body)-coverage(' '.join(independent)))
        flat=list(walk([b for s in sections for b in s['blocks']]))
        cases=[b for b in flat if b['type']=='example']
        activities=[b for b in flat if b['type']=='subsection'] if n!=8 else [s for s in sections if s['title'].startswith('Guided activity')]
        questions=[q for b in flat if b['type']=='questions' for q in b['items']]
        if n==8:
            questions=next(s for s in sections if s['number']=='17')['blocks']
            assert len(next(s for s in sections if s['number']=='18')['blocks'][0]['blocks'])==10
        assert len(cases)==case_count and len(activities)==activity_count and len(questions)==10,(n,'counts',len(cases),len(activities),len(questions))
        activity_sections=[s for s in sections if s['title'].startswith(('Guided activity','Guided educational','Five practical'))]
        worksheet=f'chapter-{n:02}-activities.txt'
        worksheet_text=title+'\nOptional learning activities\n\nKeep reflections private. Nothing is submitted. You may skip any activity. Avoid recording personal details on shared or monitored devices. The original educational-draft status and safety qualifications apply.\n\n'
        worksheet_text+='\n\n'.join(s['title']+'\n\n'+'\n\n'.join(text(b) for b in s['blocks']) for s in activity_sections)
        worksheet_text+='\n\nSource: '+FILES[n]+'\n'
        (DEST/worksheet).write_text(worksheet_text,encoding='utf8')
        chapter={'number':n,'slug':slug,'title':title,'summary':summary,'timeLabel':'Read at your own pace','studyTime':'Read at your own pace',
            'referenceHeading':next(s['title'] for s in sections if 'references' in s['title'].lower()),'editorialHeading':sections[-1]['title'],
            'reflectionSection':activity_sections[0]['number'] or activity_sections[0]['id'],'image':image,'position':'50% 40%',
            'originalFilename':FILES[n],'version':'1.0','date':'2026-11-11','language':'English','author':'VUGA NDAKUMVA',
            'pdfUrl':'/learning/mental-health/'+FILES[n],'worksheetUrl':'/learning/mental-health/'+worksheet,'worksheetLabel':'Download learning activities',
            'sourcePages':page_count,'frontMatter':[text(b) for b in intro],'coverBlocks':cover,'introductionBlocks':[],'safetyNotices':safety,
            'goalsHeading':goal_heading,'goalBlocks':goal_blocks,'goals':[],'afterGoals':after,'editionText':edition,'publicationStatus':status,
            'endMatterPlacement':'inline','sections':sections,'references':refs,'referenceNotes':[],'editorialReview':[],'approval':[]}
        target=DEST/FILES[n];shutil.copyfile(source,target)
        digest=hashlib.sha256(source.read_bytes()).hexdigest();assert hashlib.sha256(target.read_bytes()).hexdigest()==digest
        manifest.append({'chapter':n,'slug':slug,'title':title,'filename':FILES[n],'pdfUrl':chapter['pdfUrl'],'pages':page_count,'sha256':digest,'editionText':edition})
        audits.append({'chapter':n,'pages':page_count,'numberedSections':numbered_count,'readerSections':len(sections),'sections':section_audit,
            'frontMatterPreserved':True,'independentPypdfCoverage':True,'downloadHashMatch':True,'references':len(refs),'questions':len(questions),
            'scenarios':len(cases),'activities':len(activities),'tables':tables})
        chapters.append(chapter)
        print(f'Chapter {n}: {len(sections)} sections, {len(refs)} references, {len(cases)} scenarios, {len(activities)} activities, 10 answers. Source audit passed.',flush=True)
    for filename,name,data,typ in [
        ('chapters-08-10.generated.ts','laterChapters',chapters,'LearningChapter'),
        ('chapter-catalog-08-10.generated.ts','laterCatalog',[{k:c[k] for k in ['number','slug','title','summary']} for c in chapters],'ChapterCatalogEntry')]:
        (OUT/filename).write_text('// Generated by scripts/import-mental-health-chapters-08-10.py. Edit the importer, not source content.\nimport type { '+typ+' } from "./types";\nexport const '+name+': '+typ+'[] = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
    (AUDIT/'content.json').write_text(json.dumps(chapters,ensure_ascii=False,indent=2),encoding='utf8')
    (AUDIT/'source-audit.json').write_text(json.dumps({'reviewedOn':'2026-11-11','method':'31-page text and visual review, measured table columns, ordered per-section checks, independent pypdf character coverage and unchanged PDF hashes. Publication checklists remain pending source material.','chapters':audits},ensure_ascii=False,indent=2),encoding='utf8')
    (DEST/'source-manifest-08-10.json').write_text(json.dumps({'collection':'mental-health-08-10','sources':manifest},ensure_ascii=False,indent=2),encoding='utf8')

if __name__=='__main__': import_all()
