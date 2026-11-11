import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("artifacts", { recursive: true });
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const slugs = [
  "understanding-mental-health-and-wellbeing",
  "recognizing-emotions-and-responding-to-them",
];
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}/why-mental-health`);
  await page.locator(".mh-library").waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => {
        image.loading = "eager";
        return image.decode();
      }),
    );
  });
  await page.screenshot({
    path: `artifacts/mental-health-library-${width}.png`,
    fullPage: true,
  });
  for (let index = 0; index < slugs.length; index++) {
    const number = index + 1;
    await page.goto(`${base}/why-mental-health/${slugs[index]}`);
    await page.locator(".mh-article").waitFor();
    await page.screenshot({
      path: `artifacts/mental-health-chapter-${number}-top-${width}.png`,
    });
    if (width === 1440)
      await page.screenshot({
        path: `artifacts/mental-health-chapter-${number}-full.png`,
        fullPage: true,
      });
    for (const [label, section] of [
      ["table", `section-${number}-2`],
      ["reflection", `section-${number}-${number === 1 ? 13 : 15}`],
      ["answers", `section-${number}-${number === 1 ? 14 : 16}`],
      ["references", "chapter-references"],
    ]) {
      await page.goto(`${base}/why-mental-health/${slugs[index]}#${section}`);
      await page.locator(`#${section}`).waitFor();
      if (label === "answers")
        await page.locator(".mh-answer").first().locator("summary").click();
      await page
        .locator(`#${section}`)
        .evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
      await page.screenshot({
        path: `artifacts/mental-health-chapter-${number}-${label}-${width}.png`,
      });
    }
    console.log(
      JSON.stringify({
        width,
        chapter: number,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      }),
    );
  }
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
