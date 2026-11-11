"""Lossless, geometry-based import of the three supplied GBV draft PDFs.

Run with the bundled Python (pdfplumber + pypdf). Generated source content is
independent of optional teaching visuals and link-verification records.
"""
from pathlib import Path
from collections import Counter
import hashlib, json, re, shutil, unicodedata
import pdfplumber
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'public/learning/gbv'
OUT=ROOT/'src/learning/gbv'
AUDIT=ROOT/'artifacts/gbv-learning'
CONFIG=[
 (1,'GBV_Chapter_01.pdf','understanding-gender-based-violence','Understanding Gender-Based Violence','Build a foundation in consent, coercive control, survivor-centred support and safer referral.','gbv-training-opportunity-situation',12,18,7,8),
 (2,'VUGA_NDAKUMVA_GBV_Expanded_Chapter_02_Types_and_Forms.pdf','types-and-forms-of-gender-based-violence','Types and Forms of Gender-Based Violence','Understand different forms, how they overlap, and respectful ways to offer support.','gbv-trainee-support-situation',10,19,12,10),
 (3,'VUGA_NDAKUMVA_GBV_Expanded_Chapter_03_Root_Causes_Risk_Factors_Gender_Inequality.pdf','root-causes-risk-factors-and-gender-inequality','Root Causes, Risk Factors, and Gender Inequality','Explore unequal power, connected influences and prevention without blame or stereotypes.','gbv-challenging-norms-support',11,20,6,10),
]
BRIEFS=json.loads((AUDIT/'scenes.json').read_text(encoding='utf8'))
TABLE_COLUMNS={
  2:[(['Setting','Examples of potential GBV','Important consideration'],['Examples','Important']),(['Principle','What supportive behavior can sound like'],['What']),(['Service','Published contact','Important note'],['Published','Important']),(['Term','Plain-language explanation'],['Plain-language'])],
  3:[(['Concept','Meaning and example'],['Meaning']),(['Harmful message','Healthier principle'],['Healthier']),(['Level','Examples of concerns','Possible protective response'],['Examples','Possible']),(['Risk factor (association)','Warning sign (behavior to take seriously)'],['Warning'])]
}
def compact(s): return ' '.join(s.split())
def coverage(s):
    # Whitespace, layout punctuation and bullet glyphs may change; all letters
    # and numbers, including every URL and table cell, must remain unchanged.
    s=unicodedata.normalize('NFKC',s).replace('(cid:127)','').replace('\x7f','')
    return Counter(c for c in s if c.isalnum())
def text(b):
    if b['type']=='table': return ' '.join(b['headers']+[c for r in b['rows'] for c in r])
    if b['type']=='list': return ' '.join(b['items'])
    if b['type'] in ['example','subsection','disclosure']: return b['title']+' '+' '.join(map(text,b['blocks']))
    if b['type']=='questions': return ' '.join(q['question']+' '+q.get('answerLabel','Answer:')+' '+q['answer'] for q in b['items'])
    if b['type']=='references': return b['sourceText']
    return b['text']
def events_for(page,pno,chapter):
    tables=page.find_tables()
    events=[]
    for table in tables:
        rows=[[compact(c or '') for c in r] for r in table.extract()]
        if chapter in TABLE_COLUMNS:
            expected,anchors=next((h,a) for h,a in TABLE_COLUMNS[chapter] if rows[0][0].startswith(h[0]))
            header_words=page.crop(table.rows[0].bbox).extract_words()
            splits=[next(w['x0']-3 for w in header_words if w['text']==a) for a in anchors]
            xs=[table.bbox[0],*splits,table.bbox[2]]
            rows=[[compact(page.crop((xs[col],row.bbox[1],xs[col+1],row.bbox[3])).extract_text() or '') for col in range(len(xs)-1)] for row in table.rows]
            assert rows[0]==expected,(chapter,pno,'table headers',rows[0],expected)
        block={'type':'table','headers':rows[0],'rows':rows[1:]}
        events.append({'kind':'table','top':table.bbox[1],'bottom':table.bbox[3],'page':pno,'block':block,'bbox':table.bbox})
    for l in page.extract_text_lines(return_chars=True):
        if l['text'].startswith('VUGA NDAKUMVA | GBV '): continue # exact running footer only
        if any(t.bbox[1]-.5 <= l['top'] <= t.bbox[3]-.5 for t in tables): continue
        chars=l['chars']; letters=[c for c in chars if c['text'].isalpha()]
        size=max(c['size'] for c in chars)
        bold=sum('Bold' in c['fontname'] for c in letters)/max(1,len(letters))
        events.append({'kind':'line','text':compact(l['text']).replace('(cid:127)','•').replace('\x7f','•'),'top':l['top'],'bottom':l['bottom'],'page':pno,'size':size,'heading':bold>.8 and size>=9.5})
    return sorted(events,key=lambda e:e['top'])
def blocks_for(events):
    blocks=[]; pending=None; prev=None
    def flush():
        nonlocal pending
        if pending: blocks.append(pending)
        pending=None
    for e in events:
        if e['kind']=='table': flush();blocks.append(e['block']);prev=None;continue
        s=e['text'];kind='heading' if e['heading'] else 'paragraph'
        fresh=bool(re.match(r'^(?:•|\d+\. |Suggested answer:|(?:Gender norm|Coercive control|Risk factor|Protective factor|Ecological model|Survivor-centred|Prevention):)',s)) or (e['size']<9 and bool(re.match(r'^\[\d+\]',s)))
        same=prev and e['page']==prev['page']
        gap=e['top']-prev['bottom'] if same else 0
        continuation=pending and pending['type']==kind and not fresh and gap<=8.5
        if kind=='heading': continuation=continuation and same and abs(e['size']-prev['size'])<.2
        if continuation:
            # Normalize broken source URLs without rewriting their characters.
            join='' if re.search(r'https?://\S+$',pending['text']) and not s.startswith('[') else ' '
            pending['text']+=join+s
        else: flush();pending={'type':kind,'text':s}
        prev=e
    flush()
    final=[]
    for b in blocks:
        if b['type']=='paragraph' and b['text'].startswith('•'):
            value=b['text'].lstrip('• ')
            if final and final[-1]['type']=='list':final[-1]['items'].append(value)
            else:final.append({'type':'list','items':[value]})
        else:final.append(b)
    return final
def structured(blocks,n,sec):
    result=[];i=0
    while i<len(blocks):
        b=blocks[i]
        brief=next((x for x in BRIEFS if x['chapter']==n and x['section']==sec and b.get('text','').startswith(x['prefix'])),None)
        activity=re.match(r'^Activity (\d+)',b.get('text','')) if b['type']=='heading' else None
        if brief or activity:
            group={'type':'example' if brief else 'subsection','id':'example-'+brief['id'] if brief else f'gbv-{n}-activity-{activity[1]}','title':b['text'],'blocks':[]}
            i+=1
            while i<len(blocks) and blocks[i]['type']!='heading':group['blocks'].append(blocks[i]);i+=1
            result.append(group);continue
        if re.match(r'^\d+\. ',b.get('text','')) and sec in ([14] if n==1 else [16]):
            assert i+1<len(blocks) and blocks[i+1]['type']=='paragraph',(n,sec,b)
            answer=blocks[i+1]['text'];label='Suggested answer:' if answer.startswith('Suggested answer:') else ''
            q={'question':b['text'],'answer':answer[len(label):].strip(),'answerLabel':label}
            if result and result[-1]['type']=='questions':result[-1]['items'].append(q)
            else:result.append({'type':'questions','items':[q]})
            i+=2;continue
        result.append(b);i+=1
    return result

DEST.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
chapters=[];audits=[];manifest=[]
for n,filename,slug,title,summary,image,pages,section_count,ref_count,qa_count in CONFIG:
    source=Path('C:/Users/VUGANDAKUMVA/Downloads')/filename
    target=DEST/filename;shutil.copyfile(source,target)
    with pdfplumber.open(target) as pdf:
        events=[e for i,p in enumerate(pdf.pages,1) for e in events_for(p,i,n)]
        assert len(pdf.pages)==pages
        cells=[e['block'] for e in events if e['kind']=='table']
        geometry_body=' '.join(e['text'] if e['kind']=='line' else text(e['block']) for e in events)
    blocks=blocks_for(events)
    # A heading may wrap across lines. Only >=14pt numbered headings are sections;
    # questions are 9.3-9.6pt and stay within their assessment section.
    labels={compact(e['text']):e['size'] for e in events if e['kind']=='line'}
    first=next(i for i,b in enumerate(blocks) if b['type']=='heading' and b['text'].startswith('1. '))
    intro=blocks[:first];sections=[]
    for b in blocks[first:]:
        m=re.match(r'^(\d+)\. (.+)$',b.get('text',''))
        if b['type']=='heading' and m and (int(m[1])==len(sections)+1) and (len(sections)==0 or int(m[1])>int(sections[-1]['number'])):
            # Knowledge-check questions are in the assessment section, so their
            # reset to 1 cannot become new top-level sections.
            sections.append({'number':m[1],'id':f'gbv-section-{n}-{m[1]}','title':m[2],'blocks':[]})
        else:sections[-1]['blocks'].append(b)
    assert len(sections)==section_count,(n,len(sections))
    section_audit=[];references=[]
    for s in sections:
        before=' '.join(map(text,s['blocks']))
        original=s['blocks']
        converted=structured(original,n,int(s['number']))
        final=[]
        for index,b in enumerate(converted):
            if b.get('consumed'):continue
            match=re.match(r'^\[(\d+)\]',b.get('text',''))
            if b['type']=='paragraph' and match and int(s['number'])==(17 if n==1 else 19):
                raw=b['text'];number=int(match[1])
                if index+1<len(converted) and converted[index+1].get('text','').startswith('https://'):
                    raw+=' '+converted[index+1]['text'];converted[index+1]['consumed']=True
                urls=re.findall(r'https?://\S+',raw)
                url=urls[0] if urls else None
                references.append({'number':number,'text':re.sub(r'^\[\d+\]\s*','',raw),'url':url} if url else {'number':number,'text':re.sub(r'^\[\d+\]\s*','',raw)})
                final.append({'type':'references','numbers':[number],'sourceText':raw})
            else:final.append(b)
        s['blocks']=final
        assert coverage(before)==coverage(' '.join(map(text,final))),(n,s['number'],'section changed')
        ordered=lambda value: ''.join(c for c in unicodedata.normalize('NFKC',value).replace('(cid:127)','') if c.isalnum())
        assert ordered(before)==ordered(' '.join(map(text,final))),(n,s['number'],'source order changed')
        section_audit.append({'id':s['id'],'number':s['number'],'title':s['title'],'sourceCharacters':sum(coverage(before).values()),'preserved':True,'orderedContentPreserved':True})
    goal_at=next(i for i,b in enumerate(intro) if b.get('text','') in ['Learning outcomes','Chapter learning objectives','Chapter purpose and learning outcomes'])
    if n==3:
        # The source purpose paragraph precedes its objective bullets under one heading.
        goals_at=goal_at+2
        goal_blocks=[intro[goals_at]]
        introduction=intro[:goal_at]+[intro[goal_at+1]]
        after=intro[goals_at+1:]
    else:
        goal_blocks=[intro[goal_at+1]];introduction=intro[:goal_at];after=intro[goal_at+2:]
    safety_prefix='Reader safety:' if n==1 else 'A note to readers:' if n==2 else None
    safety=[b for b in introduction+after if safety_prefix and b.get('text','').startswith(safety_prefix)]
    introduction=[b for b in introduction if b not in safety];after=[b for b in after if b not in safety]
    cover_end=next((i for i,b in enumerate(introduction) if b.get('text','')=='How to use this chapter'),len(introduction)-(1 if n==3 else 0))
    cover=introduction[:cover_end];introduction=introduction[cover_end:]
    edition=next(b['text'] for b in intro if 'Version' in b.get('text','') and ('1.1' in b['text']))
    publication=next(b['text'] for b in intro if b.get('text','').startswith(('Editorial status:','EDUCATIONAL DRAFT','Educational status:')))
    rawreader=PdfReader(target)
    author=str(rawreader.metadata.author)
    chapter={'number':n,'slug':slug,'title':title,'summary':summary,'timeLabel':'Read at your own pace','studyTime':'Read at your own pace','referenceHeading':sections[-2 if n in [1,3] else -1]['title'],'editorialHeading':'Publication review requirements','reflectionSection':'','image':'learning/gbv/'+image+'-1280','position':'50% 40%','originalFilename':filename,'version':'1.1','date':'2026-11-09' if n<3 else '2026-11','language':'English','author':author,'pdfUrl':'/learning/gbv/'+filename,'worksheetUrl':'','sourcePages':pages,'frontMatter':[text(b) for b in intro],'introductionBlocks':introduction,'safetyNotices':safety,'afterGoals':after,'goalsHeading':intro[goal_at]['text'],'editionText':edition,'publicationStatus':publication,'endMatterPlacement':'inline','goals':goal_blocks[0]['items'] if goal_blocks[0]['type']=='list' else [],'goalBlocks':goal_blocks,'sections':sections,'references':references,'referenceNotes':[],'editorialReview':[],'approval':[]}
    chapter['coverBlocks']=cover
    reconstructed=' '.join(map(text,cover+introduction+safety+[intro[goal_at]]+goal_blocks+after))+' '+' '.join(s['number']+'. '+s['title']+' '+' '.join(map(text,s['blocks'])) for s in sections)
    assert coverage(geometry_body)==coverage(reconstructed),(n,'full source coverage',coverage(geometry_body)-coverage(reconstructed),coverage(reconstructed)-coverage(geometry_body))
    # Independent pypdf extraction: exclude exactly the known running footer.
    independent_lines=[]
    for pno,page in enumerate(rawreader.pages,1):
        lines=(page.extract_text() or '').splitlines()
        for index,line in enumerate(lines):
            if line.startswith('VUGA NDAKUMVA | GBV '): continue
            if index and lines[index-1].startswith('VUGA NDAKUMVA | GBV ') and line.strip() in [str(pno),f'Page {pno}']: continue
            independent_lines.append(line)
    independent=' '.join(independent_lines)
    assert coverage(independent)==coverage(reconstructed),(n,'independent PDF extraction',coverage(independent)-coverage(reconstructed),coverage(reconstructed)-coverage(independent))
    all_tables=[b for s in sections for b in s['blocks'] if b['type']=='table']
    assert all_tables==cells,(n,'table cells changed')
    reviewed=json.loads((AUDIT/'table-cells.reviewed.json').read_text(encoding='utf8'))
    assert cells==next(c['tables'] for c in reviewed['chapters'] if c['chapter']==n),(n,'reviewed source cells changed')
    assert len(cells)==4 and len(references)==ref_count,(n,len(cells),len(references))
    questions=[q for s in sections for b in s['blocks'] if b['type']=='questions' for q in b['items']]
    assert len(questions)==qa_count,(n,len(questions))
    example_ids=[b['id'] for s in sections for b in s['blocks'] if b['type']=='example']
    assert len(example_ids)==(6 if n==1 else 5)
    source_hash=hashlib.sha256(source.read_bytes()).hexdigest();assert source_hash==hashlib.sha256(target.read_bytes()).hexdigest()
    manifest.append({'chapter':n,'slug':slug,'title':title,'filename':filename,'pdfUrl':chapter['pdfUrl'],'sha256':source_hash,'pages':pages,'author':author,'editionText':edition,'publicationStatus':publication})
    audits.append({'chapter':n,'pages':pages,'numberedSections':len(sections),'sections':section_audit,'frontMatter':{'sourceBlocks':len(intro),'allCharactersPreserved':True,'paragraphObjectives':n==2,'safetyNotices':len(safety)},'tables':cells,'tableCellChecks':sum(len(t['headers'])+sum(len(r) for r in t['rows']) for t in cells),'references':references,'questionsAndAnswers':questions,'examples':example_ids,'independentPypdfCoverage':True,'downloadHashMatch':True,'checklistsRemainUnchecked':True})
    chapters.append(chapter)
def generated(path,name,data,type_name):
    path.write_text('// Generated by scripts/import-gbv-chapters.py. Preserve the source; edit the importer.\nimport type { '+type_name+' } from "../types";\nexport const '+name+': '+type_name+'[] = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
generated(OUT/'chapters.generated.ts','gbvChapters',chapters,'LearningChapter')
generated(OUT/'catalog.generated.ts','gbvCatalog',[{k:c[k] for k in ['number','slug','title','summary']} for c in chapters],'ChapterCatalogEntry')
(DEST/'source-manifest.json').write_text(json.dumps({'collection':'gbv','sourceStatus':'Original educational drafts; no publication approval claimed.','sources':manifest},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(AUDIT/'source-audit.json').write_text(json.dumps({'method':'PDF geometry + independent pypdf character coverage, per-section preservation, exact ordered table cells, explicit reference and Q&A counts, unchanged download hashes.','chapters':audits},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Imported 3 chapters: 57 sections, 12 tables, 25 references, 28 Q&A, 16 named examples. All source/hash assertions passed.')
