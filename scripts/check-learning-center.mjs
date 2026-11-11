import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await mkdir("artifacts/learning-center", { recursive: true });
await page.goto("http://localhost:5173/why-mental-health");
await page
  .getByRole("searchbox", { name: "Search chapters" })
  .fill("zzzznomatch");
if (await page.locator(".mh-chapter-card").count())
  throw new Error("Search failed");
await page.getByRole("button", { name: "Show all chapters" }).click();
if ((await page.locator(".mh-chapter-card").count()) !== 7)
  throw new Error("Reset failed");
for (const width of [375, 768, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const [name, path] of [
    ["library", ""],
    ["reader", "/understanding-mental-health-and-wellbeing"],
  ]) {
    await page.goto("http://localhost:5173/why-mental-health" + path);
    await page
      .locator(name === "library" ? ".mh-chapter-card" : ".mh-article")
      .first()
      .waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )
    )
      throw new Error("Overflow " + name + " " + width);
    await page.screenshot({
      path: `artifacts/learning-center/${name}-${width}.png`,
    });
  }
}
await browser.close();
if (errors.length) throw new Error(errors.join("\n"));
console.log("Search, reset, six responsive layouts and runtime checks passed.");
