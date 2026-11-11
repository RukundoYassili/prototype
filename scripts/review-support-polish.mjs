import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const phase = process.argv[2] || "after";
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/",
    "/understand-gbv",
    "/resources?topic=alcohol-and-drugs",
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
    const name = route === "/" ? "home" : route.split("?")[0].slice(1);
    const file = `artifacts/support-polish-${phase}-${name}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    if (route === "/") {
      const bounds = await page.locator("#explore-support").boundingBox();
      const top = Math.round(bounds.y);
      await sharp(file)
        .extract({
          left: 0,
          top,
          width,
          height: Math.floor(Math.min(bounds.height, 1700)),
        })
        .toFile(`artifacts/support-polish-${phase}-cards-${width}.png`);
      if (width === 375) {
        await page.getByRole("button", { name: "Open navigation" }).click();
        await page.screenshot({
          path: `artifacts/support-polish-${phase}-menu.png`,
        });
      }
    }
    console.log(
      JSON.stringify({
        phase,
        width,
        route,
        ...(await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          height: document.documentElement.scrollHeight,
        }))),
      }),
    );
  }
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
