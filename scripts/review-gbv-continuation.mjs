import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const root = "artifacts/gbv-continuation";
const chapters = JSON.parse(await readFile(`${root}/content.json`, "utf8"));
const printing = process.argv.includes("--print");
const dir = `${root}/${printing ? "print" : "screens"}`;
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
page.setDefaultTimeout(60000);
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const errors = [],
  metrics = [];
page.on("pageerror", (e) => errors.push(e.message));
async function ready(path) {
  await page.goto(base + path);
  await page.locator("h1").waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (img) => {
        img.loading = "eager";
        await img.decode().catch(() => {});
      }),
    );
  });
}
if (!printing) {
  for (const width of [375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const chapter of [null, ...chapters]) {
      const id = chapter?.number || "library";
      await ready(
        chapter ? `/understand-gbv/${chapter.slug}` : "/understand-gbv",
      );
      await page.screenshot({
        path: `${dir}/${id}-${width}-top.jpg`,
        quality: 75,
      });
      await page.screenshot({
        path: `${dir}/${id}-${width}-full.jpg`,
        quality: 60,
        fullPage: true,
      });
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        failedImages: [...document.images]
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
      }));
      metrics.push({ chapter: id, width, ...state });
      if (chapter) {
        const example = page.locator(".mh-example").first();
        if (await example.count())
          await example.screenshot({
            path: `${dir}/${id}-${width}-example.jpg`,
            quality: 75,
            style: ".site-header{visibility:hidden!important}",
          });
        else
          await page.locator("#gbv-section-7-13").screenshot({
            path: `${dir}/${id}-${width}-example.jpg`,
            quality: 75,
            style: ".site-header{visibility:hidden!important}",
          });
      }
      console.log(`Reviewed ${id} at ${width}px`);
    }
  }
} else {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const chapter of chapters) {
    await ready(`/understand-gbv/${chapter.slug}`);
    const details = page.locator(".mh-article details");
    await details.first().evaluate((e) => (e.open = true));
    const before = await details.evaluateAll((es) => es.map((e) => e.open));
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    const expected = await page.locator(".mh-reader").evaluate((el) =>
      [...el.querySelectorAll("h1,h2,h3,p,li,th,td,summary")]
        .filter(
          (e) =>
            !e.querySelector("p,li,th,td,summary") &&
            !e.closest(
              ".mh-contents,.mh-reader-actions,.mh-chapter-pagination,.mh-reader-footer",
            ),
        )
        .map((e) => e.textContent.trim())
        .filter(Boolean),
    );
    await writeFile(
      `${dir}/gbv-${chapter.number}-expected.json`,
      JSON.stringify({ chapter: chapter.number, expected }, null, 2),
    );
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: `${dir}/gbv-${chapter.number}.pdf`,
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", right: "14mm", bottom: "15mm", left: "14mm" },
    });
    await page.evaluate(() => dispatchEvent(new Event("afterprint")));
    await page.emulateMedia({ media: "screen" });
    const after = await details.evaluateAll((es) => es.map((e) => e.open));
    if (JSON.stringify(before) !== JSON.stringify(after))
      throw new Error("Disclosure restoration failed");
    metrics.push({ chapter: chapter.number, restoredDisclosures: true });
    console.log(`Printed GBV ${chapter.number}`);
  }
}
await browser.close();
await writeFile(
  `${dir}/results.json`,
  JSON.stringify({ metrics, errors }, null, 2),
);
if (errors.length || metrics.some((m) => m.overflow || m.failedImages?.length))
  process.exitCode = 1;
