import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const stage = process.argv[2] || "after";
if (!["before", "after"].includes(stage))
  throw new Error("Use before or after.");
const directory = `artifacts/learning-polish/${stage}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const slugs = [
  "understanding-mental-health-and-wellbeing",
  "recognizing-emotions-and-responding-to-them",
];
async function loaded() {
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
const metrics = [];
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 2400 });
  await page.goto(`${base}/why-mental-health`);
  await page.locator(".mh-chapter-card").first().waitFor();
  await loaded();
  await page.screenshot({
    path: `${directory}/library-${width}.png`,
    fullPage: true,
  });
  metrics.push({
    page: "library",
    width,
    chaptersStart: await page
      .locator("#mental-health-chapters")
      .evaluate((element) => element.getBoundingClientRect().top + scrollY),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
  });
  for (const [index, slug] of slugs.entries()) {
    await page.goto(`${base}/why-mental-health/${slug}`);
    await page.locator(".lv-visual").first().waitFor();
    await loaded();
    const visuals = page.locator(".lv-visual");
    for (const visual of await visuals.all()) {
      const id = await visual.getAttribute("data-visual-id");
      const bounds = await visual.boundingBox();
      metrics.push({
        page: index + 1,
        width,
        id,
        height: bounds.height,
        renderedWidth: bounds.width,
      });
      await visual.screenshot({
        path: `${directory}/${id}-${width}.png`,
        style: ".site-header, .skip { visibility: hidden !important; }",
      });
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `${directory}/reader-${index + 1}-top-${width}.png`,
    });
    metrics.push({
      page: index + 1,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      imageFailures: await page.locator(".lv-image-unavailable").count(),
    });
  }
}
await writeFile(
  `${directory}/results.json`,
  JSON.stringify({ metrics, errors }, null, 2) + "\n",
);
if (stage === "after") {
  const before = JSON.parse(
    await readFile("artifacts/learning-polish/before/results.json", "utf8"),
  );
  const storyIds = [
    "exam-pressure",
    "unemployment",
    "caregiving",
    "work-meeting",
    "results",
    "caregiver-exhaustion",
    "moving",
    "conflict-safety",
  ];
  const stories = metrics
    .filter((metric) => metric.width === 375 && storyIds.includes(metric.id))
    .map((metric) => {
      const old = before.metrics.find(
        (previous) =>
          previous.width === metric.width && previous.id === metric.id,
      );
      return {
        id: metric.id,
        before: old.height,
        after: metric.height,
        reductionPercent:
          Math.round((1 - metric.height / old.height) * 1000) / 10,
      };
    });
  const library = metrics
    .filter((metric) => metric.page === "library")
    .map((metric) => ({
      width: metric.width,
      before: before.metrics.find(
        (previous) =>
          previous.page === "library" && previous.width === metric.width,
      ).chaptersStart,
      after: metric.chaptersStart,
    }));
  await writeFile(
    "artifacts/learning-polish/comparison.json",
    JSON.stringify({ stories, library }, null, 2) + "\n",
  );
  if (
    stories.length !== 8 ||
    stories.some((story) => story.after >= story.before)
  )
    throw new Error("A mobile story did not become shorter.");
  if (library.some((item) => item.after >= item.before))
    throw new Error("The library chapter section did not move earlier.");
}
await browser.close();
console.log(
  JSON.stringify({
    stage,
    screenshots: 105,
    errors,
    layoutChecks: metrics.filter((metric) => "overflow" in metric),
  }),
);
if (
  errors.length ||
  metrics.some((metric) => metric.overflow || metric.imageFailures)
)
  process.exitCode = 1;
