import { chromium, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import sharp from "sharp";

const root = "artifacts/mental-health-library-refresh";
const output = `${root}/after`;
const base = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const metadata = JSON.parse(
  await readFile(`${root}/chapter-metadata.json`, "utf8"),
);
await mkdir(output, { recursive: true });
const report = {
  layouts: [],
  interactions: [],
  comparisons: [],
  errors: [],
  contrast: [],
  sourceChecks: [],
};
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
page.on("pageerror", (e) => report.errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") report.errors.push(m.text());
});
const posts = [];
page.on("request", (r) => {
  if (r.method() === "POST") posts.push(r.url());
});

async function settleImages() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) => {
        i.loading = "eager";
        return i.decode();
      }),
    );
  });
}
async function openLibrary() {
  await page.goto(`${base}/why-mental-health`);
  await expect(page.locator(".mh-chapter-card")).toHaveCount(7);
  await expect(page.locator("#service-main")).toBeFocused();
}
async function verifyMetadata() {
  for (let i = 0; i < metadata.length; i++) {
    const chapter = metadata[i];
    const card = page.locator(".mh-chapter-card").nth(i);
    await expect(card.locator("h3")).toHaveText(chapter.title);
    await expect(card.locator(".mh-card-body > p")).toHaveText(chapter.summary);
    await expect(card.locator(".mh-card-time")).toHaveText(chapter.studyTime);
    await expect(card.locator(".mh-card-meta")).toContainText(
      `${chapter.sections} sections`,
    );
    await expect(card.locator(".mh-card-meta")).toContainText(
      "English · Educational draft",
    );
    await expect(card.locator("a")).toHaveAttribute(
      "href",
      `/why-mental-health/${chapter.slug}`,
    );
    await expect(card.locator("a")).toHaveAccessibleName(
      `Read Chapter ${String(chapter.number).padStart(2, "0")}: ${chapter.title}`,
    );
    await expect(card.locator("img")).toHaveAttribute("alt", /Illustration of/);
  }
  await expect(page.locator(".mh-center-overview")).toContainText(
    "148 sections",
  );
  await expect(page.locator(".mh-draft-note")).toContainText(
    "have not been clinically reviewed or approved for public release",
  );
  await expect(page.locator(".mh-draft-note")).toContainText(
    "Version 1.1 · 9 November 2026",
  );
}

try {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await openLibrary();
    await verifyMetadata();
    const loading = await page
      .locator(".mh-library img")
      .evaluateAll((images) =>
        images.map((i) => ({ loading: i.loading, priority: i.fetchPriority })),
      );
    assert.equal(loading[0].loading, "eager");
    assert.equal(loading[0].priority, "high");
    assert(loading.slice(1).every((i) => i.loading === "lazy"));
    await settleImages();
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      headings: [
        ...document.querySelectorAll(
          ".mh-library h1,.mh-library h2,.mh-library h3",
        ),
      ].map((h) => Number(h.tagName.slice(1))),
      images: [...document.querySelectorAll(".mh-library img")].map((i) => ({
        src: i.currentSrc,
        width: i.clientWidth,
        height: i.clientHeight,
        loaded: i.naturalWidth > 0,
        reserved: i.hasAttribute("width") && i.hasAttribute("height"),
        fit: getComputedStyle(i).objectFit,
        ratioError: Math.abs(
          i.clientWidth / i.clientHeight - i.naturalWidth / i.naturalHeight,
        ),
      })),
    }));
    assert.equal(metrics.overflow, false, `Overflow at ${width}`);
    assert.equal(metrics.images.length, 8);
    assert.equal(new Set(metrics.images.slice(1).map((i) => i.src)).size, 7);
    assert(
      metrics.images.every(
        (i) =>
          i.loaded && i.reserved && i.fit === "contain" && i.ratioError < 0.015,
      ),
    );
    assert.equal(metrics.headings.filter((h) => h === 1).length, 1);
    metrics.headings.forEach((h, i, all) => {
      if (i) assert(h <= all[i - 1] + 1);
    });
    report.layouts.push(metrics);
    await page.screenshot({
      path: `${output}/library-${width}.png`,
      fullPage: true,
    });
    if ([375, 1440].includes(width)) {
      await page.screenshot({
        path: `${output}/library-${width}-viewport.png`,
      });
      for (const [name, locator] of [
        ["hero", page.locator(".mh-library-hero")],
        ...[...Array(7)].map((_, i) => [
          `chapter-${String(i + 1).padStart(2, "0")}`,
          page.locator(".mh-chapter-card").nth(i),
        ]),
      ]) {
        const box = await locator.boundingBox();
        await sharp(`${output}/library-${width}.png`)
          .extract({
            left: Math.round(box.x),
            top: Math.round(box.y),
            width: Math.floor(box.width),
            height: Math.floor(box.height),
          })
          .toFile(`${output}/${name}-${width}.png`);
      }
    }
  }

  report.contrast = await page.locator(".mh-library").evaluate((root) => {
    const parse = (value) => value.match(/[\d.]+/g)?.map(Number) || [];
    const lum = (rgb) =>
      rgb
        .slice(0, 3)
        .map((v) => v / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
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
        let bg = [255, 255, 255];
        for (let a = el; a; a = a.parentElement) {
          const c = parse(getComputedStyle(a).backgroundColor);
          if (c.length === 3 || c[3] === 1) {
            bg = c;
            break;
          }
        }
        const f = lum(parse(style.color)),
          b = lum(bg),
          ratio = (Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05);
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
    report.contrast.every((c) => c.ratio >= c.required),
    JSON.stringify(report.contrast.filter((c) => c.ratio < c.required)),
  );

  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openLibrary();
    await page
      .getByRole("link", { name: "Explore the chapters", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#mental-health-chapters")).toBeFocused();
    const sectionTop = await page
      .locator("#mental-health-chapters")
      .evaluate((e) => e.getBoundingClientRect().top);
    const headerBottom = await page
      .getByRole("banner")
      .evaluate((e) => e.getBoundingClientRect().bottom);
    assert(sectionTop >= headerBottom - 2, "Chapter anchor hidden by header");
    report.interactions.push(
      `${width}px: chapter jump preserves focus and header offset`,
    );
    const search = page.getByRole("searchbox", { name: "Search chapters" });
    await search.fill("  GRIEF, LOSS  ");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(1);
    await expect(page.locator(".mh-chapter-card h3")).toHaveText(
      metadata[6].title,
    );
    await expect(page.locator(".mh-library-toolbar [role=status]")).toHaveText(
      "1 of 7 chapters",
    );
    await search.fill("not-a-matching-topic");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(0);
    await page.getByRole("button", { name: "Show all chapters" }).focus();
    await page.keyboard.press("Enter");
    await expect(search).toBeFocused();
    await expect(search).toHaveValue("");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(7);
    report.interactions.push(
      `${width}px: trimmed case-insensitive search, live count, empty state, keyboard reset and focus`,
    );
    await search.fill("What is mental health?");
    await expect(page.locator(".mh-chapter-card h3")).toHaveText(
      metadata[0].title,
    );
    await search.fill("");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(7);
    report.interactions.push(`${width}px: section-title search still works`);
    for (const chapter of metadata) {
      await openLibrary();
      const link = page.getByRole("link", {
        name: `Read Chapter ${String(chapter.number).padStart(2, "0")}: ${chapter.title}`,
        exact: true,
      });
      await link.focus();
      await expect(link).toBeFocused();
      assert(
        parseFloat(
          await link.evaluate((e) => getComputedStyle(e).outlineWidth),
        ) >= 3,
      );
      await page.keyboard.press("Enter");
      await page.waitForURL(`${base}/why-mental-health/${chapter.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        chapter.title,
      );
      report.interactions.push(
        `${width}px: Chapter ${chapter.number} opens by keyboard`,
      );
    }
    await openLibrary();
    await page
      .getByRole("link", { name: "Start learning", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      metadata[0].title,
    );
    report.interactions.push(`${width}px: Start learning opens Chapter 01`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [name, route] of [
    ["chapter-01", "/why-mental-health/" + metadata[0].slug],
    ["gbv", "/understand-gbv"],
    ["about", "/about"],
  ]) {
    await page.goto(base + route);
    await page.locator("h1").waitFor();
    await settleImages();
    const comparisonPath = `${output}/${name === "chapter-01" ? "reader-01" : name}-1440.png`;
    await page.screenshot({
      path: comparisonPath,
      fullPage: name !== "chapter-01",
    });
    const before = await sharp(`${root}/before/${name}-1440.png`)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const after = await sharp(comparisonPath)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const sameDimensions =
      before.info.width === after.info.width &&
      before.info.height === after.info.height;
    let significant = 0,
      total = 0;
    if (sameDimensions)
      for (let i = 0; i < before.data.length; i++) {
        const d = Math.abs(before.data[i] - after.data[i]);
        if (d > 8) significant++;
        total += d;
      }
    const result = {
      name,
      sameDimensions,
      significantChannels: significant,
      meanChannelDelta: total / before.data.length,
    };
    report.comparisons.push(result);
    assert(
      sameDimensions && significant <= 50 && result.meanChannelDelta < 0.05,
      `Unexpected visual change: ${JSON.stringify(result)}`,
    );
    if (name === "gbv") {
      await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
      assert(
        (
          await page
            .locator(".mh-card-photo img")
            .evaluateAll((images) => images.map((i) => i.getAttribute("src")))
        ).every((src) => !src.includes("mental-health-covers")),
      );
    }
  }
  for (const item of JSON.parse(
    await readFile(`${root}/before/protected-files.json`, "utf8"),
  )) {
    const unchanged =
      createHash("sha256")
        .update(await readFile(item.file))
        .digest("hex") === item.sha256;
    report.sourceChecks.push({ file: item.file, unchanged });
    assert(unchanged, `Protected source changed: ${item.file}`);
  }
  const before = await readFile(`${root}/before/LearningPages.tsx`, "utf8");
  const after = await readFile("src/learning/LearningPages.tsx", "utf8");
  const normalize = (value) =>
    value
      .replace(", type ReactNode", "")
      .replace(
        /export function ChapterCard[\s\S]*?(?=function ChapterContents)/,
        "",
      )
      .replaceAll("\r\n", "\n");
  assert.equal(
    normalize(before),
    normalize(after),
    "Shared reader changed beyond optional card cover slot",
  );
  assert.deepEqual(posts, []);
  assert.deepEqual(report.errors, []);
  assert.deepEqual(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    [0, 0],
  );
  report.status = "passed";
  console.log(
    JSON.stringify({
      status: report.status,
      widths: report.layouts.length,
      interactions: report.interactions.length,
      minTextContrast: Math.min(...report.contrast.map((c) => c.ratio)),
      protectedFiles: report.sourceChecks.length,
      comparisons: report.comparisons,
    }),
  );
} finally {
  await writeFile(`${output}/review.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
