import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

await mkdir("artifacts", { recursive: true });
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const [name, route] of [
    ["index", "/community"],
    ["news", "/community/community-outreach-update"],
    ["event", "/community/community-connection-day"],
    ["workshop", "/community/listening-with-care"],
    ["filtered", "/community?type=events"],
  ]) {
    await page.goto(base + route);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((image) => {
          image.loading = "eager";
          return image.decode();
        }),
      );
    });
    const file = `artifacts/community-page-${name}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    if (name === "index") {
      const box = await page.locator(".community-page-hero").boundingBox();
      await sharp(file)
        .extract({
          left: 0,
          top: Math.round(box.y),
          width,
          height: Math.floor(box.height),
        })
        .toFile(`artifacts/community-page-hero-${width}.png`);
      const cards = await page.locator("#community-updates").boundingBox();
      await sharp(file)
        .extract({
          left: 0,
          top: Math.round(cards.y),
          width,
          height: Math.floor(cards.height),
        })
        .toFile(`artifacts/community-page-catalog-${width}.png`);
    }
    console.log(
      JSON.stringify({
        width,
        route,
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
