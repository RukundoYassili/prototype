"""Import the seven supplied GBV continuation drafts; source content stays separate.

Per-document font/geometry extraction, explicit review of the flattened Chapter 5
comparisons, ordered section audit, independent pypdf coverage and download hashes.
Run after inspect-gbv-continuation.py with the bundled pdfplumber/pypdf Python.
"""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json, re, shutil, unicodedata
import pdfplumber
from pypdf import PdfReader
spec=importlib.util.spec_from_file_location('gbv_sources',Path(__file__).with_name('inspect-gbv-continuation.py'))
source_module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(source_module)
FILES=source_module.FILES

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / 'artifacts/gbv-continuation'
DEST = ROOT / 'public/learning/gbv'
OUT = ROOT / 'src/learning/gbv'
CONFIG = {
 4: ('understanding-consent-boundaries-and-bodily-autonomy', 'Understanding Consent, Boundaries, and Bodily Autonomy', 'Explore freely given consent, personal boundaries, bodily autonomy and safety when choice is constrained.', 'mental-health-connection', 17, 6, 9, '1.1'),
 5: ('domestic-violence-and-intimate-partner-violence', 'Domestic Violence and Intimate Partner Violence', 'Recognize coercive control, understand barriers to help, and learn about respectful support and Rwanda referral pathways.', 'mental-health-listening', 17, 7, 9, 'Updated edition'),
 6: ('sexual-violence-harassment-and-exploitation', 'Sexual Violence, Harassment, and Exploitation', 'Understand consent, abuse of authority, safer first responses, time-sensitive care and safeguarding.', 'mental-health-counseling', 18, 9, 9, '1.1'),
 7: ('emotional-psychological-and-verbal-abuse', 'Emotional, Psychological and Verbal Abuse', 'Understand harmful patterns, distinguish abuse from disagreement, and explore safety-aware support.', 'mental-health-listening', 23, 7, 14, '1.1'),
 8: ('economic-violence-and-financial-control', 'Economic Violence and Financial Control', 'Learn how money, work, property and digital access can be used to control, and how support can preserve choice.', 'mental-health-learning', 18, 8, 12, '2.0'),
 9: ('technology-facilitated-and-online-gender-based-violence', 'Technology-Facilitated and Online Gender-Based Violence', 'Explore digital abuse, consent, privacy, institutional responsibilities and responses that put safety first.', 'mental-health-connection', 20, 8, 10, '1.0'),
 10: ('gender-based-violence-against-children-and-adolescents', 'Gender-Based Violence Against Children and Adolescents', 'Learn about child protection, safe disclosure, age-appropriate support and pathways to help in Rwanda.', 'mental-health-group', 20, 7, 10, '1.0'),
}

def compact(value): return ' '.join(value.split())
def ordered(value): return ''.join(c for c in unicodedata.normalize('NFKC', value) if c.isalnum())
def coverage(value): return Counter(ordered(value))
def tokens(value): return Counter(re.findall(r'[A-Za-z0-9]+', unicodedata.normalize('NFKC',value)))
def text(block):
    kind = block['type']
    if kind == 'table': return ' '.join(block['headers'] + [c for row in block['rows'] for c in row])
    if kind == 'list': return ' '.join(block['items'])
    if kind in ['example', 'subsection', 'disclosure']: return block['title']+' '+' '.join(map(text,block['blocks']))
    if kind == 'questions': return ' '.join(q['question']+' '+q['answerLabel']+' '+q['answer'] for q in block['items'])
    if kind == 'references': return block['sourceText']
    return block['text']

# These five comparisons are printed as run-together prose in the updated PDF.
# Transcribe the reviewed cell boundaries explicitly; keep every word. Two wrapped
# rows interleave cells in the source and are restored to their intended columns.
FLAT_TABLES = [
 ('Example behavior Why it is concerning', 'Not every request,', {
  'type':'table','headers':['Example behavior','Why it is concerning'], 'rows':[
   ['Requiring constant location updates','May create surveillance, fear, and loss of independence'],
   ['Preventing visits to trusted friends','May isolate the person from support'],
   ['Threatening to take children away','May use parenting fears as a means of coercion'],
   ['Taking all wages or IDs','May reduce access to basic needs and safe options'],
   ['Threatening self-harm to prevent a breakup','May impose guilt and pressure; threats still require appropriate safety response']]}),
 ('Element Practical approach','Helpful and unhelpful responses',{
  'type':'table','headers':['Element','Practical approach'],'rows':[
   ['L - Listen','Listen patiently, without judgment or repeated requests for details'],
   ['I - Inquire about needs','Ask what the person needs now, privately and without pressure'],
   ['V - Validate','Communicate that the abuse is serious and the survivor is not to blame'],
   ['E - Enhance safety','Ask about immediate safety and link to skilled help rather than imposing a plan'],
   ['S - Support','Explain available care, referral, and practical options; respect choice and confidentiality limits']]}),
 ('More supportive Potentially harmful','Supporters should not investigate',{
  'type':'table','headers':['More supportive','Potentially harmful'],'rows':[
   ['“Thank you for telling me. What would help you feel safer?”','“Why didn’t you leave earlier?”'],
   ['“We can explore options; you decide what feels safe.”','“You must report right now, whatever the risk.”'],
   ['“I will explain what I can and cannot keep confidential.”','“I promise nobody will ever know.”'],
   ['“You do not have to describe every detail to me.”','“Tell me exactly everything that happened.”']]}),
 ('Official contact Purpose','These numbers are published',{
  'type':'table','headers':['Official contact','Purpose'],'rows':[
   ['3029','Isange One Stop Centre (RIB contact page)'],['3512','Reporting domestic or gender-based violence (RIB)'],
   ['116','Reporting child abuse (RIB)'],['166','Emergency or crime-related information (RIB)'],['9059','MIGEPROF assistance hotline (ministry site)']]}),
 ('Term Plain-language meaning','15 Key messages',{
  'type':'table','headers':['Term','Plain-language meaning'],'rows':[
   ['Domestic violence','Abuse occurring in a domestic or family relationship'],['Intimate partner violence','Abuse by a current or former intimate partner'],
   ['Coercive control','Pattern of threats, restrictions and monitoring that reduces autonomy'],['Survivor-centred','Support that prioritizes dignity, choices, safety and needs'],
   ['Safety planning','Individualized consideration of actions and resources to reduce risk'],['Referral','Connecting someone with suitable professional support or services']]})
]

def running_line(line, n):
    s = line['text']
    return (line['top'] > 790 or
        (line['top'] < 40 and s.startswith('VUGA NDAKUMVA / GBV EDUCATIONAL')) or
        (n == 8 and s.startswith('CHAPTER 08 / ECONOMIC VIOLENCE AND FINANCIAL CONTROL')))

def events_for(n):
    pages=json.loads((AUDIT/f'source-{n}.json').read_text(encoding='utf8'))
    events=[]
    for page in pages:
        for line in page['lines']:
            if running_line(line,n): continue
            if any(t['bbox'][1]-.5 <= line['top'] < t['bbox'][3] for t in page['tables']): continue
            events.append({**line,'page':page['page'],'kind':'line'})
        for t in page['tables']:
            rows=[[compact(c or '') for c in r] for r in t['rows']]
            events.append({'kind':'table','page':page['page'],'top':t['bbox'][1], 'block':{'type':'table','headers':rows[0],'rows':rows[1:]}})
    events.sort(key=lambda e:(e['page'],e['top']))
    corrections=[]
    if n==5:
        for start,stop,table in FLAT_TABLES:
            a=next(i for i,e in enumerate(events) if e.get('text','').startswith(start))
            b=next(i for i,e in enumerate(events[a+1:],a+1) if e.get('text','').startswith(stop))
            raw=' '.join(e['text'] for e in events[a:b])
            assert tokens(raw)==tokens(text(table)), (n,start,'table word mismatch')
            corrections.append({'page':events[a]['page'],'sourceText':raw,'table':table,'allWordsPreserved':True,'columnOrderRestored':ordered(raw)!=ordered(text(table))})
            events[a:b]=[{'kind':'table','block':table,'page':events[a]['page'],'top':events[a]['top']}]
    return events,corrections

def blocks_for(events,n):
    out=[];pending=None;previous=None
    def flush():
        nonlocal pending
        if pending: out.append(pending)
        pending=None
    for e in events:
        if e['kind']=='table': flush();out.append(e['block']);previous=None;continue
        value=e['text'].replace('(cid:127)','•').replace('\x7f','•')
        kind='heading' if e['bold']>.8 and e['size']>=10 else 'paragraph'
        # The printed ninth chapter has small boxed labels rather than bold headings.
        if n==9 and value in ['An essential starting point','Safer response sequence','Rwanda referral note']: kind='heading'
        fresh=bool(re.match(r'^(?:•|\d+\. |\[\d+\]|(?:Suggested answer|Answer|Learning point|Learning response|Learning points|Situation|Task|Facilitator guidance|Fictional case|Learning discussion):)',value))
        if n==10 and value.startswith(('WHO (','WHO clinical guidelines','UNICEF,','MIGEPROF,','UNHCR Rwanda,')):fresh=True
        same=previous and previous['page']==e['page']
        gap=e['top']-previous['bottom'] if same else 0
        joins=pending and pending['type']==kind and not fresh and gap<=8.5
        if n==8 and pending and pending['type']==kind=='paragraph' and not fresh:
            # Version 2 has an extra layout break every few words; join those
            # fragments until a completed sentence or a new labelled paragraph.
            ended=bool(re.search(r'[.!?](?:\s*\[[\d, ]+\])?$',pending['text']))
            joins=(gap<=8.5 or not ended) and not re.match(r'^(?:Myth:|[A-Z][A-Za-z -]{1,35}:)',value)
        if kind=='heading': joins=joins and same and abs(e['size']-previous['size'])<.3
        if value.startswith(('Answer:','Suggested answer:')): joins=False
        # A URL may wrap over any number of lines, including a page break.
        url_tail=pending and re.search(r'https?(?:://\S*)?$',pending['text'])
        if url_tail and not fresh and ' ' not in value and kind=='paragraph':
            joins=True
        if joins:
            separator='' if url_tail and ' ' not in value else ' '
            pending['text']+=separator+value
        else: flush();pending={'type':kind,'text':value}
        previous=e
    flush()
    result=[]
    for b in out:
        if b['type']=='paragraph' and b['text'].startswith('•'):
            if result and result[-1]['type']=='list':result[-1]['items'].append(b['text'].lstrip('• '))
            else:result.append({'type':'list','items':[b['text'].lstrip('• ')]})
        else:result.append(b)
    return result

def section_match(n,s):
    pattern=r'^(\d{2}) \| (.+)$' if n in [4,9,10] else r'^(\d{2}) (.+)$' if n in [5,7] else r'^(\d+)\. (.+)$'
    return re.match(pattern,s)

def structure(blocks,n,section):
    # In the updated fifth PDF these three source subheadings run into prose.
    inline=['Physical violence','Scenario A - Financial restrictions in a household','Activity 1 - Identify the pattern'] if n==5 else []
    expanded=[]
    for b in blocks:
        prefix=next((p for p in inline if b.get('text','').startswith(p+' ')),None)
        if prefix:expanded.extend([{'type':'heading','text':prefix},{'type':'paragraph','text':b['text'][len(prefix):].strip()}])
        else:expanded.append(b)
    result=[];i=0
    while i<len(expanded):
        b=expanded[i];s=b.get('text','')
        group=re.match(r'^(Scenario|Case|Activity) ([A-E1-5])\b',s) if b['type']=='heading' else None
        if group:
            ident=f'gbv-{n}-{group[1].lower()}-{group[2].lower()}'
            item={'type':'subsection' if group[1]=='Activity' else 'example','id':ident,'title':s,'blocks':[]}
            i+=1
            while i<len(expanded) and expanded[i]['type']!='heading':item['blocks'].append(expanded[i]);i+=1
            result.append(item);continue
        if re.match(r'^\d+\. ',s) and i+1<len(expanded) and re.match(r'^(?:Suggested answer|Answer):',expanded[i+1].get('text','')):
            answer=expanded[i+1]['text'];label=answer.split(':',1)[0]+':'
            q={'question':s,'answer':answer[len(label):].strip(),'answerLabel':label}
            if result and result[-1]['type']=='questions':result[-1]['items'].append(q)
            else:result.append({'type':'questions','items':[q]})
            i+=2;continue
        result.append(b);i+=1
    assert ordered(' '.join(map(text,blocks)))==ordered(' '.join(map(text,result))),(n,section,'group order changed')
    return result

def references_for(blocks,n):
    result=[];refs=[];i=0
    while i<len(blocks):
        b=blocks[i];s=b.get('text','')
        match=re.match(r'^(?:\[(\d+)\]|(\d+)\.) ',s)
        is_ref=match or (n==10 and b['type']=='paragraph' and s.startswith(('WHO','UNICEF','MIGEPROF','UNHCR')))
        if not is_ref:result.append(b);i+=1;continue
        raw=s;i+=1
        while i<len(blocks) and blocks[i].get('text','').startswith(('http', '://')):
            raw+=' '+blocks[i]['text'];i+=1
        number=int(match[1] or match[2]) if match else len(refs)+1
        label=f'[{number}]' if n<9 else f'{number}.' if n==9 else ''
        urls=re.findall(r'https?://\S+',raw)
        assert len(urls)==1,(n,number,'reference URL',raw)
        ref={'number':number,'label':label,'text':raw[len(label):].strip() if label else raw,'url':urls[0]}
        refs.append(ref);result.append({'type':'references','numbers':[number],'sourceText':raw})
    assert ordered(' '.join(map(text,blocks)))==ordered(' '.join(map(text,result))), (n,'reference order')
    return result,refs

def walk(blocks):
    for b in blocks:
        yield b
        if 'blocks' in b:yield from walk(b['blocks'])

def import_all():
    chapters=[];audits=[];manifest=[]
    for n,config in CONFIG.items():
        slug,title,summary,image,section_count,reference_count,pages,version=config
        events,corrections=events_for(n)
        blocks=blocks_for(events,n)
        first=next(i for i,b in enumerate(blocks) if b['type']=='heading' and section_match(n,b['text']) and int(section_match(n,b['text'])[1])==1)
        intro=blocks[:first];sections=[];heading_sources=[]
        for b in blocks[first:]:
            s=b.get('text','');m=section_match(n,s) if b['type']=='heading' else None
            next_number=sum(bool(x['number']) for x in sections)+1
            if m and int(m[1])==next_number:
                sections.append({'number':m[1],'id':f'gbv-section-{n}-{int(m[1])}','title':m[2],'blocks':[]});heading_sources.append(s)
            elif b['type']=='heading' and s in ['References and evidence notes','Publication and safeguarding review']:
                sections.append({'number':'','id':f'gbv-section-{n}-'+('references' if s.startswith('References') else 'publication'),'title':s,'blocks':[]});heading_sources.append(s)
            else:sections[-1]['blocks'].append(b)
        assert sum(bool(s['number']) for s in sections)==section_count,(n,'section count',[(s['number'],s['title']) for s in sections])
        refs=[];section_audit=[]
        for sec,heading in zip(sections,heading_sources):
            before=' '.join(map(text,sec['blocks']))
            converted=structure(sec['blocks'],n,sec['id'])
            if 'references' in sec['title'].lower():converted,refs=references_for(converted,n)
            sec['blocks']=converted
            after=' '.join(map(text,converted))
            assert ordered(before)==ordered(after),(n,sec['id'],'section text changed')
            section_audit.append({'id':sec['id'],'sourceHeading':heading,'orderedContentPreserved':True,'sourceCharacters':len(ordered(before))})
        assert len(refs)==reference_count,(n,'reference count',len(refs))
        goal_index=next(i for i,b in enumerate(intro) if b.get('text','').startswith(('Purpose and learning outcomes','Learning goals','Learning objectives','Learning outcomes')))
        goal_heading=intro[goal_index]['text']
        if n==6:
            prefix='Learning outcomes:'
            goal_heading=prefix
            goal_blocks=[{'type':'paragraph','text':intro[goal_index]['text'][len(prefix):].strip()}]
            after=[]
        else:
            goal_end=goal_index+1
            while goal_end<len(intro) and intro[goal_end]['type']!='heading':goal_end+=1
            goal_blocks=intro[goal_index+1:goal_end];after=intro[goal_end:]
        before_goals=intro[:goal_index]
        if n==9:
            # Boxed safety guidance is after the purpose paragraph, not part of it.
            goal_blocks=[intro[goal_index+1]];after=intro[goal_index+2:]
        cover_end=next((i for i,b in enumerate(before_goals) if b.get('text','').startswith(('How to use this chapter','Educational and safety notice','Who this chapter is for:','Reader safety note:'))),len(before_goals))
        cover=before_goals[:cover_end];introduction=before_goals[cover_end:]
        safety=[]
        for pool in [cover,introduction,after]:
            for b in pool[:]:
                if b.get('text','').startswith(('Reader safety note:','Immediate concern:','Safety first:')):safety.append(b);pool.remove(b)
        if n==7:
            safety=introduction[:2];introduction=introduction[2:]
        edition=next((b['text'] for b in intro if 'Version' in b.get('text','') or b.get('text','').startswith('Updated edition')),version)
        if n==9:edition='English | Version 1.0 | 11 November 2026'
        if n==10:edition='EDUCATIONAL DRAFT | November 2026 | Version 1.0'
        if n==4:status=next(b['text'] for b in intro if b.get('text','').startswith('PUBLICATION STATUS:'))
        elif n==5:status=next(b['text'] for b in intro if b.get('text','').startswith('Publication status:'))
        elif n==6:status=next(b['text'] for b in intro if b.get('text','').startswith('Editorial status:'))
        elif n==7:status=next(b['text'] for b in walk(sections[-1]['blocks']) if b.get('text','').startswith('Evidence-informed educational draft only.'))
        elif n==8:status=next(b['text'] for b in intro if b.get('text','').startswith('Prepared for educational'))
        elif n==9:status=next(b['text'] for b in intro if 'Evidence-informed educational draft |' in b.get('text',''))
        else:status=next(b['text'] for b in intro if b.get('text','').startswith('EDUCATIONAL DRAFT'))
        # Full frontmatter conservation, regardless of reader presentation order.
        reconstructed_intro=' '.join(map(text,cover+introduction+safety))+ ' '+goal_heading+' '+' '.join(map(text,goal_blocks+after))
        assert coverage(' '.join(map(text,intro)))==coverage(reconstructed_intro),(n,'front matter mismatch',coverage(' '.join(map(text,intro)))-coverage(reconstructed_intro))
        filename=FILES[n];source=Path('C:/Users/VUGANDAKUMVA/Downloads')/filename;target=DEST/filename
        source_pdf=PdfReader(source);assert len(source_pdf.pages)==pages
        # Independent extraction removes only known running furniture and page numbers.
        independent=[]
        for pno,p in enumerate(source_pdf.pages,1):
            lines=(p.extract_text() or '').splitlines()
            previous_furniture=False
            for index,line in enumerate(lines):
                line=compact(line)
                if line!='VUGA NDAKUMVA | GBV EDUCATIONAL CONTENT SERIES' and re.match(r'^(?:VUGA NDAKUMVA [|/] GBV (?:EDUCATION|Educational|Content|CHAPTER)|Chapter 07 \||CHAPTER 05 \| UPDATED|CHAPTER 08 / ECONOMIC)',line):previous_furniture=True;continue
                if line.strip()==str(pno) and (previous_furniture or index>=len(lines)-2):previous_furniture=False;continue
                previous_furniture=False
                independent.append(line)
        source_body=reconstructed_intro+' '+' '.join(h+' '+' '.join(map(text,s['blocks'])) for h,s in zip(heading_sources,sections))
        assert coverage(' '.join(independent))==coverage(source_body),(n,'independent extraction mismatch',coverage(' '.join(independent))-coverage(source_body),coverage(source_body)-coverage(' '.join(independent)))
        # Words can be interleaved in a true table, so independent character coverage
        # complements exact, per-section ordered text and explicit cell inspection.
        flat=list(walk([b for s in sections for b in s['blocks']]))
        questions=[q for b in flat if b['type']=='questions' for q in b['items']]
        examples=[b for b in flat if b['type']=='example']
        if n==7:examples=[s for s in sections if s['title'].startswith('Scenario ')]
        activities=[b for b in flat if b['type']=='subsection' and b['title'].startswith('Activity ')]
        assert len(questions)==10 and len(examples)==(4 if n==4 else 5) and len(activities)==5,(n,'counts',len(questions),len(examples),len(activities))
        activity_section=next(s for s in sections if any(b['type']=='subsection' for b in s['blocks']))
        worksheet=f'chapter-{n:02}-activities.txt'
        (DEST/worksheet).write_text(title+'\nOptional learning activities\n\nKeep any reflections private. Nothing is submitted. You may skip any activity. These are educational drafts; original qualifications and safety notes apply. Avoid saving personal details on a device someone else can access.\n\n'+'\n\n'.join(text(b) for b in activity_section['blocks'])+'\n\nSource: '+filename+'\n',encoding='utf8')
        chapter={'number':n,'slug':slug,'title':title,'summary':summary,'timeLabel':'Read at your own pace','studyTime':'Read at your own pace','referenceHeading':next(s['title'] for s in sections if 'references' in s['title'].lower()),'editorialHeading':sections[-1]['title'],'reflectionSection':activity_section['number'],'image':image,'position':'50% 40%','originalFilename':filename,'version':version,'date':'2026-11-11' if n in [6,7,9] else '2026-11','language':'English','author':'VUGA NDAKUMVA INITIATIVE','pdfUrl':'/learning/gbv/'+filename,'worksheetUrl':'/learning/gbv/'+worksheet,'sourcePages':pages,'frontMatter':[text(b) for b in intro],'coverBlocks':cover,'introductionBlocks':introduction,'safetyNotices':safety,'afterGoals':after,'goalsHeading':goal_heading,'editionText':edition,'publicationStatus':status,'endMatterPlacement':'inline','goals':[],'goalBlocks':goal_blocks,'sections':sections,'references':refs,'referenceNotes':[],'editorialReview':[],'approval':[]}
        chapter['worksheetLabel']='Download learning activities'
        shutil.copyfile(source,target)
        digest=hashlib.sha256(source.read_bytes()).hexdigest();assert hashlib.sha256(target.read_bytes()).hexdigest()==digest
        manifest.append({'chapter':n,'slug':slug,'title':title,'filename':filename,'pdfUrl':chapter['pdfUrl'],'pages':pages,'sha256':digest,'version':version,'editionText':edition})
        audits.append({'chapter':n,'pages':pages,'numberedSections':section_count,'readerSections':len(sections),'sections':section_audit,'frontMatterPreserved':True,'independentPypdfCoverage':True,'downloadHashMatch':True,'references':len(refs),'questions':len(questions),'scenarios':len(examples),'activities':len(activities),'tables':[b for b in flat if b['type']=='table'],'layoutCorrections':corrections})
        chapters.append(chapter)
        print(f'Chapter {n}: {len(sections)} sections, {len(refs)} references, {len(examples)} scenarios, 5 activities, 10 answers. Source audit passed.',flush=True)
    def generated(filename,name,data,type_name):
        (OUT/filename).write_text('// Generated by scripts/import-gbv-chapters-04-10.py. Edit the importer, not source content.\nimport type { '+type_name+' } from "../types";\nexport const '+name+': '+type_name+'[] = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
    generated('chapters-04-10.generated.ts','gbvContinuationChapters',chapters,'LearningChapter')
    generated('catalog-04-10.generated.ts','gbvContinuationCatalog',[{k:c[k] for k in ['number','slug','title','summary']} for c in chapters],'ChapterCatalogEntry')
    (AUDIT/'content.json').write_text(json.dumps(chapters,ensure_ascii=False,indent=2),encoding='utf8')
    (AUDIT/'source-audit.json').write_text(json.dumps({'reviewedOn':'2026-11-11','method':'73 page visual review, geometry extraction, ordered section checks, independent pypdf character coverage, explicit flattened-table transcription, unchanged PDF hashes. Review requirements in the sources are not claims that review has occurred.','chapters':audits},ensure_ascii=False,indent=2),encoding='utf8')
    (DEST/'source-manifest-04-10.json').write_text(json.dumps({'collection':'gbv-continuation','sources':manifest},ensure_ascii=False,indent=2),encoding='utf8')

if __name__=='__main__': import_all()
