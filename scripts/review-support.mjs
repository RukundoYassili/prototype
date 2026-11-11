import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

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
    "/mental-health",
    "/understand-gbv",
    "/support",
    "/urgent-help",
    "/resources?topic=alcohol-and-drugs",
  ]) {
    await page.goto(`http://127.0.0.1:5173${route}`);
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
    await page.screenshot({
      path: `artifacts/support-${name}-${width}.png`,
      fullPage: true,
    });
    console.log(
      JSON.stringify({
        route,
        width,
        ...(await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          header: document.querySelector("header").getBoundingClientRect()
            .height,
          heading: document.querySelector("h1")?.textContent,
        }))),
      }),
    );
    if (route === "/" && (width === 1440 || width === 375))
      await page
        .locator("#explore-support")
        .screenshot({ path: `artifacts/support-cards-${width}.png` });
  }
}
console.log(JSON.stringify({ errors }));
await browser.close();
