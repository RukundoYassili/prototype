import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const stage = process.argv[2] || "after";
const directory = `artifacts/gbv-learning/${stage}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const errors = [],
  metrics = [];
page.on("pageerror", (e) => errors.push(e.message));
const routes =
  stage === "before"
    ? [
        "/understand-gbv",
        "/why-mental-health",
        "/why-mental-health/understanding-mental-health-and-wellbeing",
        "/why-mental-health/recognizing-emotions-and-responding-to-them",
      ]
    : [
        "/understand-gbv",
        "/understand-gbv/understanding-gender-based-violence",
        "/understand-gbv/types-and-forms-of-gender-based-violence",
        "/understand-gbv/root-causes-risk-factors-and-gender-inequality",
      ];
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const [i, route] of routes.entries()) {
    await page.goto(base + route);
    await page.locator("h1").waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map(async (image) => {
          image.loading = "eager";
          await image.decode().catch(() => {});
        }),
      );
    });
    await page.screenshot({
      path: `${directory}/page-${i}-${width}.png`,
      fullPage: true,
    });
    metrics.push({
      route,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      failedImages: await page.locator(".lv-image-unavailable").count(),
    });
    if (stage === "after" && i) {
      for (const visual of await page.locator(".lv-visual").all()) {
        await visual.screenshot({
          path: `${directory}/${await visual.getAttribute("data-visual-id")}-${width}.png`,
          style: ".site-header,.skip {visibility:hidden!important}",
        });
      }
    }
  }
}
await writeFile(
  `${directory}/results.json`,
  JSON.stringify({ metrics, errors }, null, 2),
);
await browser.close();
console.log(JSON.stringify({ stage, metrics, errors }));
if (errors.length || metrics.some((x) => x.overflow || x.failedImages))
  process.exitCode = 1;
