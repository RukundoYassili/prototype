import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const directory = "artifacts/gbv-learning/print";
await mkdir(directory, { recursive: true });
const audit = JSON.parse(
  await readFile("artifacts/gbv-learning/source-audit.json", "utf8"),
);
const catalog = JSON.parse(
  await readFile("public/learning/gbv/source-manifest.json", "utf8"),
).sources.map((s) => ({ ...s, number: s.chapter }));
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const results = [];
for (const chapter of catalog) {
  await page.goto(
    (process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173") +
      "/understand-gbv/" +
      chapter.slug,
  );
  await page.locator(".mh-article").waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (img) => {
        img.loading = "eager";
        await img.decode();
      }),
    );
  });
  const details = page.locator(".mh-article details");
  await details.first().evaluate((e) => (e.open = true));
  const before = await details.evaluateAll((es) => es.map((e) => e.open));
  await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: `${directory}/gbv-${chapter.number}.pdf`,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: "15mm", right: "14mm", bottom: "15mm", left: "14mm" },
    preferCSSPageSize: false,
  });
  await page.evaluate(() => dispatchEvent(new Event("afterprint")));
  await page.emulateMedia({ media: "screen" });
  const after = await details.evaluateAll((es) => es.map((e) => e.open));
  if (JSON.stringify(before) !== JSON.stringify(after))
    throw new Error("Print did not restore disclosures.");
  const expected = await page.locator(".mh-article").evaluate((article) => {
    const clone = article.cloneNode(true);
    clone.querySelectorAll("details").forEach((e) => (e.open = true));
    return [
      ...clone.querySelectorAll("h2,h3,p,li,th,td,dt,dd,summary,figcaption"),
    ]
      .filter((e) => !e.querySelector("p,li,th,td,dt,dd"))
      .map((e) => e.textContent.trim())
      .filter(Boolean);
  });
  await writeFile(
    `${directory}/gbv-${chapter.number}-expected.json`,
    JSON.stringify({ chapter: chapter.number, expected }, null, 2),
  );
  results.push({
    chapter: chapter.number,
    restoredDisclosures: true,
    sourceSections: audit.chapters[chapter.number - 1].numberedSections,
  });
}
await browser.close();
await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results));
