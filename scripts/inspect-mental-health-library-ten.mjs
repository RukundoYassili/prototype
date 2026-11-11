import { chromium } from "@playwright/test";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = "artifacts/mental-health-library-ten";
await mkdir(`${root}/before`, { recursive: true });
const sourceFiles = [
  "chapters.generated.ts",
  "chapters-03-07.generated.ts",
  "chapters-08-10.generated.ts",
];
const mentalHealthChapters = (
  await Promise.all(
    sourceFiles.map(async (file) => {
      const text = await readFile(`src/learning/${file}`, "utf8");
      // These generated modules contain only JSON-compatible source records.
      const array = text.match(/= (\[[\s\S]*\]);\s*$/)?.[1];
      return Function(`"use strict"; return (${array});`)();
    }),
  )
)
  .flat()
  .sort((a, b) => a.number - b.number);
const metadata = mentalHealthChapters.map(
  ({ number, slug, title, summary, studyTime, sections }) => ({
    number,
    slug,
    title,
    summary,
    studyTime,
    sectionCount: sections.length,
    sectionTitles: sections.map(({ title }) => title),
  }),
);
await writeFile(`${root}/chapters.json`, JSON.stringify(metadata, null, 2));
const editable = new Set([
  "src/learning/MentalHealthPages.tsx",
  "src/learning/mental-health-covers.tsx",
  "src/learning/mental-health-library.css",
]);
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? files(`${dir}/${e.name}`) : `${dir}/${e.name}`,
      ),
    )
  ).flat();
}
const protectedPaths = [
  ...(await files("src")),
  ...(await files("public/learning")),
  ...(await files("public/images/learning")),
].filter((p) => !editable.has(p));
const hashes = {};
for (const path of protectedPaths)
  hashes[path] = createHash("sha256")
    .update(await readFile(path))
    .digest("hex");
await writeFile(
  `${root}/before/protected-files.json`,
  JSON.stringify(hashes, null, 2),
);
for (const path of editable)
  await writeFile(
    `${root}/before/${path.split("/").at(-1)}`,
    await readFile(path),
  );
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
for (const width of [375, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://127.0.0.1:5173/why-mental-health");
  await page.locator(".mh-chapter-card").last().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) => {
        i.loading = "eager";
        return i.decode();
      }),
    );
  });
  await page.screenshot({
    path: `${root}/before/library-${width}.png`,
    fullPage: true,
  });
  await page
    .locator(".mh-library-hero")
    .screenshot({ path: `${root}/before/hero-${width}.png` });
  await page
    .locator(".mh-chapter-card")
    .nth(7)
    .screenshot({ path: `${root}/before/sleep-${width}.png` });
}
await browser.close();
const oldManifest = JSON.parse(
  await readFile(
    "artifacts/mental-health-library-refresh/illustration-manifest.json",
    "utf8",
  ),
);
const thumbs = await Promise.all(
  oldManifest.assets.map(async (asset, i) => ({
    input: await sharp(asset.original).resize(384, 256).png().toBuffer(),
    left: (i % 3) * 384,
    top: Math.floor(i / 3) * 256,
  })),
);
await sharp({
  create: { width: 1152, height: 768, channels: 3, background: "#ffffff" },
})
  .composite(thumbs)
  .jpeg({ quality: 90 })
  .toFile(`${root}/before/existing-covers.jpg`);
console.log(
  JSON.stringify(
    metadata.map(({ number, title, sectionCount }) => ({
      number,
      title,
      sectionCount,
    })),
    null,
    2,
  ),
);
