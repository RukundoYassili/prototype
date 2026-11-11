import { readFile, writeFile, mkdir, copyFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import ts from "typescript";

const root = "artifacts/gbv-library-refresh";
const destination = "public/images/learning/gbv-covers";
const briefs = JSON.parse(await readFile(`${root}/briefs.json`, "utf8"));
await mkdir(destination, { recursive: true });
await mkdir(`${root}/originals`, { recursive: true });
const chapters = [];
for (const path of ["src/learning/gbv/chapters.generated.ts", "src/learning/gbv/chapters-04-10.generated.ts"]) {
  const code = ts.transpile(await readFile(path, "utf8"), { module: ts.ModuleKind.ESNext });
  const module = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
  chapters.push(...Object.values(module)[0]);
}
const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const assets = [];
for (const brief of briefs) {
  // Initial import only. Subsequent runs use the retained workspace originals.
  try { await access(brief.original); } catch { await copyFile(brief.generatedFile, brief.original); }
  const original = await readFile(brief.original);
  const metadata = await sharp(original).metadata();
  if (metadata.width !== 1536 || metadata.height !== 1024) throw new Error(`Unexpected dimensions: ${brief.file}`);
  const files = [];
  for (const width of [480, 960, 1440]) {
    const path = `${destination}/${brief.file}-${width}.webp`;
    const data = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toBuffer();
    await writeFile(path, data);
    files.push({ path, width, height: width * 2 / 3, bytes: data.length, sha256: sha256(data) });
  }
  const chapter = chapters.find(c => c.number === brief.number);
  assets.push({ id: chapter?.slug ?? "gbv-landing-hero", file: brief.file, chapterNumber: chapter?.number ?? null, title: chapter?.title ?? "You deserve safety and respect.", placement: brief.placement, original: brief.original, originalSha256: sha256(original), dimensions: [metadata.width, metadata.height], generator: brief.generator, prompt: brief.prompt, review: brief.review, files });
}
await writeFile(`${destination}/provenance.json`, JSON.stringify({ disclosure: "AI-generated fictional illustrations. Not photographs or editable vectors. No real survivors or service users are identified; no outcome is promised.", generatedOn: "2026-11-11", assets }, null, 2) + "\n");
await writeFile(`${root}/chapter-metadata.json`, JSON.stringify(chapters.map(c => ({number:c.number,slug:c.slug,title:c.title,summary:c.summary,language:c.language,sections:c.sections.length,studyTime:c.studyTime,image:c.image})), null, 2) + "\n");
console.log(JSON.stringify({ assets: assets.length, variants: assets.reduce((n,a)=>n+a.files.length,0), totalBytes: assets.flatMap(a=>a.files).reduce((n,f)=>n+f.bytes,0) }));
