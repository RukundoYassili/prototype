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
  await page.goto(base);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => {
        image.loading = "eager";
        return image.decode();
      }),
    );
  });
  const file = `artifacts/community-home-${width}.png`;
  await page.screenshot({ path: file, fullPage: true });
  const section = await page.locator("#community").boundingBox();
  await sharp(file)
    .extract({
      left: 0,
      top: Math.round(section.y),
      width,
      height: Math.floor(section.height),
    })
    .toFile(`artifacts/community-${width}.png`);
  await page
    .getByRole("button", { name: "View photo: Making room for conversation" })
    .click();
  await page.screenshot({ path: `artifacts/community-viewer-${width}.png` });
  console.log(
    JSON.stringify({
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    }),
  );
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
