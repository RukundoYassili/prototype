// Build the assistant's local search index from the same educational text used
// by the website readers. Run via esbuild; do not include example stories,
// review checklists, personal data, or unapproved provider claims.
import { writeFileSync } from 'node:fs';
import { mentalHealthChapters } from '../src/learning/chapters';
import { gbvChapters } from '../src/learning/gbv/chapters';
import { alcoholChapters } from '../src/learning/alcohol-drugs/chapters.generated';

const records: { title: string; url: string; text: string; status: string }[] = [
  { title: 'About Vuga Ndakumva', url: '/about', text: 'Vuga Ndakumva means Speak, I can hear. Founded in 2025 by David Niyomugabo, it is an independent educational initiative for communities in Rwanda. Its mission is to raise awareness, educate communities and make support pathways easier to find, helping reduce gender-based violence and empower survivors. It addresses gender-based violence, mental health and substance use. The website provides information, not care or emergency response. Booking and professional profiles are in development.', status: 'website' },
  { title: 'Support and urgent help', url: '/urgent-help', text: 'The website cannot respond to emergencies. In Rwanda, the Government of Rwanda lists 112 for emergencies and 912 for an ambulance. Isange One Stop Centres can be reached on 3029 for specialist gender-based violence support. Outside Rwanda, consult local emergency services. See the urgent help page for sources and details.', status: 'website' },
  { title: 'Website resources', url: '/resources', text: 'The website has educational guides and worksheets on mental health, gender-based violence, alcohol and drugs, and supporting someone. Explore the learning library and the support page for pathways and questions to ask providers.', status: 'website' },
];
for (const [chapters, base] of [[mentalHealthChapters, '/why-mental-health'], [gbvChapters, '/understand-gbv'], [alcoholChapters, '/alcohol-and-drugs']] as const) {
  for (const chapter of chapters) {
    for (const section of chapter.sections) {
      const paragraphs = section.blocks.filter((b) => b.type === 'paragraph').map((b) => (b as {text: string}).text);
      for (const [paragraphIndex, paragraph] of paragraphs.entries()) {
        if (paragraph.length < 60) continue;
        records.push({ title: `${chapter.title} — ${section.title}`, url: `${base}/${chapter.slug}#${section.id}`, text: paragraph.slice(0, 1600), status: 'educational draft; specialist review pending', paragraphIndex } as typeof records[number]);
      }
    }
  }
}
writeFileSync('deploy/assistant-knowledge.json', JSON.stringify(records, null, 2) + '\n');
console.log(`Wrote ${records.length} knowledge passages`);
