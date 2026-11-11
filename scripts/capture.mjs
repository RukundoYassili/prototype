import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1024, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("requestfailed", (request) => errors.push(`Request failed: ${request.url()}`));
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((image) => {
      image.loading = "eager";
      return image.decode();
    }),
  );
});
await page.screenshot({ path: "artifacts/desktop-1024.png", fullPage: true });
console.log(
  JSON.stringify({
    title: await page.title(),
    errors,
    sections: await page.locator("section").evaluateAll((nodes) =>
      nodes.map((n) => ({
        id: n.id,
        top: n.getBoundingClientRect().top,
        height: n.getBoundingClientRect().height,
      })),
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await browser.close();
