import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import sharp from "sharp";

const phase = process.argv[2] || "after";
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
const directory = `artifacts/site-refinement/${phase}`;
await fs.mkdir(directory, { recursive: true });
const routes = [
  ["01-home", "/"],
  ["02-about", "/about"],
  ["03-awareness", "/awareness"],
  ["04-mental-health", "/why-mental-health"],
  ["05-gbv", "/understand-gbv"],
  ["06-alcohol", "/alcohol-and-drugs"],
  ["07-knowledge", "/knowledge-hub"],
  ["08-community", "/community"],
  ["09-blog", "/blog"],
  ["10-resources", "/resources"],
  ["11-support", "/support"],
  ["12-contact", "/contact"],
  ["13-urgent", "/urgent-help"],
  ["14-donate", "/donate"],
  [
    "15-reader-mh",
    "/why-mental-health/understanding-mental-health-and-wellbeing",
  ],
  ["16-reader-gbv", "/understand-gbv/understanding-gender-based-violence"],
  ["17-reader-ad", "/alcohol-and-drugs/what-are-alcohol-and-drugs"],
];
const browser = await chromium.launch({ channel: "msedge" });
const reports = [];
try {
  for (const width of [1440, 375]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [name, route] of routes) {
      await page.goto(base + route);
      await page
        .locator(name.includes("reader") ? ".mh-reader" : "main h1")
        .first()
        .waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (image) => {
            image.loading = "eager";
            try {
              await image.decode();
            } catch {}
          }),
        );
      });
      await page.screenshot({
        path: `${directory}/${name}-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `${directory}/${name}-${width}-top.png` });
      const report = await page.evaluate(() => ({
        route: location.pathname,
        width: innerWidth,
        height: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
        headerHeight: document
          .querySelector(".site-header")
          ?.getBoundingClientRect().height,
        brokenImages: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.getAttribute("src")),
        smallText: [...document.querySelectorAll("main p, main a, main button")]
          .filter(
            (e) =>
              e.checkVisibility() &&
              parseFloat(getComputedStyle(e).fontSize) < 12,
          )
          .map((e) => ({
            class: e.className,
            size: getComputedStyle(e).fontSize,
            text: e.textContent.trim().slice(0, 50),
          })),
      }));
      reports.push({ ...report, errors: [...errors] });
      await fs.writeFile(
        `${directory}/review.json`,
        JSON.stringify(reports, null, 2),
      );
      console.log(
        name,
        width,
        report.overflow ? "OVERFLOW" : "ok",
        report.height,
      );
    }
    await page.goto(base);
    if (width < 1251)
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
    await page
      .getByRole("button", { name: "Knowledge Hub", exact: true })
      .click();
    await page.screenshot({ path: `${directory}/18-navigation-${width}.png` });
    await page.close();
  }
  for (const width of [1440, 375]) {
    const tiles = await Promise.all(
      routes.map(async ([name], index) => ({
        input: await sharp(`${directory}/${name}-${width}-top.png`)
          .resize({
            width: 360,
            height: 250,
            fit: "contain",
            background: "white",
          })
          .png()
          .toBuffer(),
        left: (index % 4) * 360,
        top: Math.floor(index / 4) * 280 + 30,
      })),
    );
    await sharp({
      create: {
        width: 1440,
        height: Math.ceil(routes.length / 4) * 280,
        channels: 3,
        background: "#e8ece6",
      },
    })
      .composite(tiles)
      .png()
      .toFile(`${directory}/overview-${width}.png`);
  }
} finally {
  await browser.close();
}
