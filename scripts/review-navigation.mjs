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
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/awareness",
    "/why-mental-health",
    "/knowledge-hub",
    "/donate",
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
    await page.screenshot({
      path: `artifacts/navigation-${route.slice(1)}-${width}.png`,
      fullPage: true,
    });
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
  await page.goto(base);
  await page.evaluate(() => scrollTo({ top: 1000, behavior: "instant" }));
  if (width <= 1250)
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Knowledge Hub", exact: true })
    .click();
  await page.screenshot({ path: `artifacts/navigation-dropdown-${width}.png` });
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
