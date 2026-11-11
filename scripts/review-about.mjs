import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const base = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const output = "artifacts/about-refresh/after";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const report = {
  layouts: [],
  interactions: [],
  contrast: [],
  homepageComparison: null,
};

async function settleImages() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) => {
        img.loading = "eager";
        return img.decode();
      }),
    );
  });
}

try {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/about`);
    await settleImages();
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1Count: document.querySelectorAll("h1").length,
      images: [...document.querySelectorAll(".about-page img")].map((img) => ({
        src: img.currentSrc,
        alt: img.alt,
        loaded: img.naturalWidth > 0,
        reserved: img.hasAttribute("width") && img.hasAttribute("height"),
        ratioError: Math.abs(
          img.clientWidth / img.clientHeight -
            img.naturalWidth / img.naturalHeight,
        ),
        objectFit: getComputedStyle(img).objectFit,
      })),
      headingLevels: [
        ...document.querySelectorAll(
          ".about-page h1,.about-page h2,.about-page h3",
        ),
      ].map((h) => Number(h.tagName.slice(1))),
    }));
    assert.equal(metrics.overflow, false, `Overflow at ${width}px`);
    assert.equal(metrics.h1Count, 1);
    assert.equal(metrics.images.length, 2);
    assert(
      metrics.images.every(
        (img) =>
          img.loaded &&
          img.reserved &&
          img.ratioError < 0.015 &&
          img.objectFit === "contain",
      ),
    );
    metrics.headingLevels.forEach((level, index, levels) => {
      if (index)
        assert(level <= levels[index - 1] + 1, "Heading level skipped");
    });
    report.layouts.push(metrics);
    await page.screenshot({
      path: `${output}/about-${width}.png`,
      fullPage: true,
    });
    if ([375, 1440].includes(width)) {
      await page.screenshot({ path: `${output}/about-${width}-viewport.png` });
      // Crop the accepted full-page capture so the floating header cannot cover sections.
      for (const section of ["hero", "purpose", "values", "choices"]) {
        const box = await page.locator(`.about-${section}`).boundingBox();
        await sharp(`${output}/about-${width}.png`)
          .extract({
            left: Math.round(box.x),
            top: Math.round(box.y),
            width: Math.floor(box.width),
            height: Math.floor(box.height),
          })
          .toFile(`${output}/${section}-${width}.png`);
      }
    }
  }

  // Contrast for real text in the redesigned page (solid section backgrounds).
  report.contrast = await page.locator(".about-page").evaluate((root) => {
    const parse = (value) => value.match(/[\d.]+/g)?.map(Number) || [];
    const luminance = (channels) =>
      channels
        .slice(0, 3)
        .map((v) => v / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    return [...root.querySelectorAll("*")]
      .filter(
        (el) =>
          el.namespaceURI === "http://www.w3.org/1999/xhtml" &&
          [...el.childNodes].some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
          ),
      )
      .map((el) => {
        const style = getComputedStyle(el);
        let background = [255, 255, 255];
        for (let ancestor = el; ancestor; ancestor = ancestor.parentElement) {
          const color = parse(getComputedStyle(ancestor).backgroundColor);
          if (color.length === 3 || color[3] === 1) {
            background = color;
            break;
          }
        }
        const fore = luminance(parse(style.color));
        const back = luminance(background);
        const ratio =
          (Math.max(fore, back) + 0.05) / (Math.min(fore, back) + 0.05);
        const large =
          parseFloat(style.fontSize) >= 24 ||
          (parseFloat(style.fontSize) >= 18.66 &&
            parseInt(style.fontWeight) >= 700);
        return {
          text: el.textContent.trim().slice(0, 65),
          ratio: Number(ratio.toFixed(2)),
          required: large ? 3 : 4.5,
        };
      });
  });
  assert(
    report.contrast.every((item) => item.ratio >= item.required),
    JSON.stringify(
      report.contrast.filter((item) => item.ratio < item.required),
    ),
  );

  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/about`);
    // NavigationReset intentionally focuses main on initial load in this project.
    await expect(page.locator("#service-main")).toBeFocused();
    await page.getByRole("link", { name: "Skip to content" }).focus();
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#service-main")).toBeFocused();
    report.interactions.push(`Skip to content works at ${width}px`);
    if (width === 375) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      assert.equal(
        await page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "About Us", exact: true })
          .getAttribute("aria-current"),
        "page",
      );
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
      report.interactions.push(
        "Mobile menu opens, indicates About Us, and closes with Escape",
      );
    }
    const links = await page.locator(".about-page a").evaluateAll((nodes) =>
      nodes.map((a) => ({
        text: a.textContent.trim(),
        href: a.getAttribute("href"),
      })),
    );
    for (const link of links) {
      await page.goto(`${base}/about`);
      await expect(page.locator("#service-main")).toBeFocused();
      const target = page
        .locator(".about-page a")
        .filter({ hasText: link.text })
        .first();
      await target.focus();
      const focus = await target.evaluate((el) => ({
        focused: el === document.activeElement,
        outline: getComputedStyle(el).outlineWidth,
      }));
      assert(
        focus.focused && parseFloat(focus.outline) >= 3,
        "Visible focus missing",
      );
      await page.keyboard.press("Enter");
      await page.waitForURL(`${base}${link.href}`);
      assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
      if (link.href.includes("#")) {
        const id = link.href.split("#")[1];
        await page.waitForFunction(
          (id) => document.activeElement?.id === id,
          id,
        );
      }
      report.interactions.push(`${width}px: ${link.href} via keyboard`);
    }
  }

  // The shared values also appear on the homepage: verify scoped CSS did not alter it.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await settleImages();
  await page.screenshot({ path: `${output}/home-1440.png`, fullPage: true });
  const before = await sharp("artifacts/about-refresh/before/home-1440.png")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const after = await sharp(`${output}/home-1440.png`)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const dimensionsMatch =
    before.info.width === after.info.width &&
    before.info.height === after.info.height;
  let differences = 0;
  let significantDifferences = 0;
  let totalDelta = 0;
  if (dimensionsMatch)
    for (let i = 0; i < before.data.length; i++) {
      const delta = Math.abs(before.data[i] - after.data[i]);
      if (delta > 0) differences++;
      if (delta > 8) significantDifferences++;
      totalDelta += delta;
    }
  report.homepageComparison = {
    dimensionsMatch,
    changedChannels: differences,
    significantChangedChannels: significantDifferences,
    meanChannelDelta: totalDelta / before.data.length,
    totalChannels: before.data.length,
  };
  assert(
    dimensionsMatch &&
      significantDifferences <= 32 &&
      totalDelta / before.data.length < 0.05,
    "Homepage screenshot changed; inspect before/after",
  );
  assert.deepEqual(errors, []);
  report.errors = errors;
  report.status = "passed";
  console.log(
    JSON.stringify({
      status: report.status,
      layouts: report.layouts.length,
      interactions: report.interactions.length,
      minimumTextContrast: Math.min(...report.contrast.map((c) => c.ratio)),
      homepageComparison: report.homepageComparison,
    }),
  );
} finally {
  await writeFile(`${output}/review.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
