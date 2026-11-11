import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";

const chapters = JSON.parse(
  await readFile("artifacts/mental-health-content-03-07.json", "utf8"),
);
const directory = "artifacts/chapters-03-07/screens";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
page.setDefaultTimeout(60000);
const resume = process.argv.includes("--resume");
async function capture(target, options) {
  if (
    resume &&
    (await stat(options.path)
      .then((file) => file.size > 100)
      .catch(() => false))
  )
    return;
  await target.screenshot({
    ...options,
    animations: "disabled",
    timeout: 60000,
  });
}
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const errors = [],
  checks = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
async function ready() {
  await page.locator(".mh-library, .mh-reader").waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
  });
}
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`${base}/why-mental-health`);
  await ready();
  await capture(page, {
    path: `${directory}/library-${width}.jpg`,
    fullPage: true,
    quality: 82,
  });
  checks.push({
    page: "library",
    width,
    cards: await page.locator(".mh-chapter-card").count(),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
  });
  for (const chapter of chapters) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/why-mental-health/${chapter.slug}`);
    await ready();
    await capture(page, {
      path: `${directory}/chapter-${chapter.number}-top-${width}.jpg`,
      quality: 85,
    });
    await capture(page, {
      path: `${directory}/chapter-${chapter.number}-full-${width}.jpg`,
      fullPage: true,
      quality: 76,
    });
    // Paint the complete mobile panel before taking an element screenshot.
    // A short viewport can leave the panel's lower reflection unpainted.
    await page.setViewportSize({ width, height: 2200 });
    for (const visual of await page.locator(".lv-visual").all()) {
      const id = await visual.getAttribute("data-visual-id");
      await capture(visual, {
        path: `${directory}/${id}-${width}.jpg`,
        quality: 85,
        style: ".site-header, .skip { visibility: hidden !important; }",
      });
    }
    checks.push({
      chapter: chapter.number,
      width,
      sections: await page.locator("[data-chapter-section]").count(),
      stories: await page.locator(".lv-story").count(),
      diagrams: await page.locator(".lv-diagram").count(),
      failedImages: await page.locator(".lv-image-unavailable").count(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
    });
  }
}
await writeFile(
  "artifacts/chapters-03-07/screen-checks.json",
  JSON.stringify({ checks, errors }, null, 2) + "\n",
);
await browser.close();
console.log(JSON.stringify({ checks, errors }));
if (
  errors.length ||
  checks.some((check) => check.overflow || check.failedImages)
)
  process.exitCode = 1;
