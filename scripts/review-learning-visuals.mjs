import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const continuationOnly = process.argv.includes("--continuation-only");
const directory = continuationOnly
  ? "artifacts/chapters-03-07/review"
  : "artifacts/learning-visuals/review";
await mkdir(directory, { recursive: true });
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const continuation = JSON.parse(
  await readFile("artifacts/mental-health-content-03-07.json", "utf8"),
);
const chapters = [
  { number: 1, slug: "understanding-mental-health-and-wellbeing" },
  { number: 2, slug: "recognizing-emotions-and-responding-to-them" },
  ...continuation,
];
const requestedChapter = process.argv
  .find((argument) => argument.startsWith("--chapter="))
  ?.split("=")[1];
const selected = (continuationOnly ? chapters.slice(2) : chapters).filter(
  (chapter) => !requestedChapter || chapter.number === Number(requestedChapter),
);
const checks = [];
const printOnly = process.argv.includes("--print-only");
for (const width of printOnly ? [] : [375, 768, 1024, 1440, 1920]) {
  // Keep full visual units in the painted viewport for element screenshots.
  await page.setViewportSize({ width, height: 2200 });
  for (const { number, slug } of selected) {
    await page.goto(`${base}/why-mental-health/${slug}`);
    await page.locator(".lv-visual").first().waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map(async (image) => {
          image.loading = "eager";
          await image.decode();
        }),
      );
    });
    const blocks = page.locator(".lv-visual");
    for (const block of await blocks.all()) {
      const id = await block.getAttribute("data-visual-id");
      await block.screenshot({
        path: `${directory}/${id}-${width}.png`,
        style: ".site-header, .skip { visibility: hidden !important; }",
      });
    }
    const story = page.locator(".lv-story").first();
    await story.evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollY - 160,
        behavior: "instant",
      }),
    );
    await page.screenshot({
      path: `${directory}/chapter-${number}-context-${width}.png`,
    });
    checks.push({
      width,
      chapter: number,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      visuals: await blocks.count(),
      imageFailures: await page.locator(".lv-image-unavailable").count(),
    });
  }
}
await page.setViewportSize({ width: 1024, height: 1000 });
for (const { number, slug } of selected) {
  await page.goto(`${base}/why-mental-health/${slug}`);
  await page.locator(".lv-visual").first().waitFor();
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
    window.dispatchEvent(new Event("beforeprint"));
  });
  await page.emulateMedia({ media: "print" });
  await writeFile(
    `${directory}/chapter-${number}-print-visuals.json`,
    JSON.stringify(
      await page.locator(".lv-visual").evaluateAll((elements) =>
        elements.map((element) => ({
          id: element.getAttribute("data-visual-id"),
          title:
            document.getElementById(element.getAttribute("aria-labelledby"))
              ?.textContent ||
            element.querySelector(".lv-heading h3, .lv-heading h4")
              ?.textContent,
          explanation: element.querySelector(".lv-explanation > p")
            ?.textContent,
          reflection: element.querySelector(".lv-reflection")?.textContent,
          scenes: element.querySelectorAll(".lv-scene").length,
        })),
      ),
      null,
      2,
    ) + "\n",
  );
  await writeFile(
    `${directory}/chapter-${number}-print-expected.json`,
    JSON.stringify(
      await page
        .locator(
          ".lv-visual p, .lv-scene-label, .lv-heading h3, .lv-heading h4",
        )
        .allTextContents(),
      null,
      2,
    ) + "\n",
  );
  await page
    .locator(".lv-story")
    .first()
    .screenshot({
      path: `${directory}/chapter-${number}-print-story.png`,
    });
  await page.pdf({
    path: `${directory}/chapter-${number}-print.pdf`,
    format: "A4",
    printBackground: true,
    margin: { top: "15mm", bottom: "15mm", left: "14mm", right: "14mm" },
    preferCSSPageSize: false,
  });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await page.emulateMedia({ media: "screen" });
}
await writeFile(
  `${directory}/${printOnly ? "print-only-results" : "results"}.json`,
  JSON.stringify({ checks, errors }, null, 2) + "\n",
);
console.log(JSON.stringify({ checks, errors }));
await browser.close();
if (
  errors.length ||
  checks.some((check) => check.overflow || check.imageFailures)
)
  process.exitCode = 1;
