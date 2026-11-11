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
for (const width of (process.env.REVIEW_WIDTHS || "375,768,1024,1440,1920").split(",").map(Number)) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/blog",
    "/blog/your-first-support-conversation",
    "/blog?topic=understand-gbv",
    "/",
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
    const name =
      route === "/"
        ? "home"
        : route.includes("?")
          ? "filtered"
          : route === "/blog"
            ? "index"
            : "article";
    const file = `artifacts/blog-${name}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    if (route === "/") {
      const box = await page.locator(".blog-home-section").boundingBox();
      await sharp(file)
        .extract({
          left: 0,
          top: Math.round(box.y),
          width,
          height: Math.floor(box.height),
        })
        .toFile(`artifacts/blog-home-preview-${width}.png`);
    }
    console.log(
      JSON.stringify({
        width,
        route,
        ...(await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          title: document.title,
        }))),
      }),
    );
  }
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
