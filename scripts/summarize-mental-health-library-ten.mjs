import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const root = "artifacts/mental-health-library-ten";
const chapters = JSON.parse(await readFile(`${root}/chapters.json`, "utf8"));
const provenance = JSON.parse(
  await readFile(
    "public/images/learning/mental-health-covers/provenance.json",
    "utf8",
  ),
);
const layouts = await Promise.all(
  [375, 768, 1024, 1440, 1920].map(async (width) =>
    JSON.parse(await readFile(`${root}/after/layout-${width}.json`, "utf8")),
  ),
);
const protectedFiles = JSON.parse(
  await readFile(`${root}/before/protected-files.json`, "utf8"),
);
const changedProtectedFiles = [];
for (const [path, expected] of Object.entries(protectedFiles)) {
  const actual = createHash("sha256")
    .update(await readFile(path))
    .digest("hex");
  if (actual !== expected) changedProtectedFiles.push(path);
}
const concurrentChanges = changedProtectedFiles.filter(
  (path) => path === "src/learning/gbv/chapter-01.css",
);
assert.deepEqual(
  changedProtectedFiles.filter((path) => !concurrentChanges.includes(path)),
  [],
);
const beforeHero = await sharp(`${root}/before/hero-375.png`).metadata();
const afterHero = await sharp(`${root}/after/hero-375.png`).metadata();
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:5173/why-mental-health");
await page.locator(".mh-chapter-card").last().waitFor();
const contrast = await page.evaluate(() => {
  function rgb(value) {
    return (value.match(/[\d.]+/g) || []).map(Number);
  }
  function luminance(values) {
    return values
      .slice(0, 3)
      .map((v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      })
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  }
  return [
    ...document.querySelectorAll(
      ".mh-library h1,.mh-library h2,.mh-library h3,.mh-library p,.mh-card-meta span,.mh-card-time,.mh-card-visuals,.mh-card-action,.mh-card-photo > span,.mh-library-toolbar strong,.mh-library-toolbar [role=status],.mh-library figcaption",
    ),
  ].map((el) => {
    let ancestor = el;
    let bg;
    while (ancestor) {
      const color = rgb(getComputedStyle(ancestor).backgroundColor);
      if (color.length >= 3 && (color.length === 3 || color[3] === 1)) {
        bg = color;
        break;
      }
      ancestor = ancestor.parentElement;
    }
    const style = getComputedStyle(el);
    const a = luminance(rgb(style.color));
    const b = luminance(bg || [255, 255, 255]);
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const size = parseFloat(style.fontSize);
    const minimum =
      size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700)
        ? 3
        : 4.5;
    return {
      text: el.textContent.trim().slice(0, 90),
      ratio: Number(ratio.toFixed(2)),
      minimum,
      passes: ratio >= minimum,
    };
  });
});
await browser.close();
assert(
  contrast.every((item) => item.passes),
  JSON.stringify(contrast.filter((item) => !item.passes)),
);
const tiles = [];
for (const [i, asset] of provenance.assets.entries()) {
  const label = Buffer.from(
    `<svg width="480" height="36"><rect width="100%" height="100%" fill="#f1edf7"/><text x="14" y="24" font-family="Arial" font-size="16" fill="#392653">${String(asset.chapter).padStart(2, "0")} · ${asset.id.substring(3).replaceAll("-", " ")}</text></svg>`,
  );
  const artwork = await sharp(`public${asset.variants[0].path}`)
    .resize(480, 320)
    .toBuffer();
  const left = (i % 2) * 480,
    top = Math.floor(i / 2) * 356;
  tiles.push(
    { input: label, left, top },
    { input: artwork, left, top: top + 36 },
  );
}
await sharp({
  create: { width: 960, height: 1780, channels: 3, background: "#fff" },
})
  .composite(tiles)
  .jpeg({ quality: 91 })
  .toFile(`${root}/after/ten-cover-inventory.jpg`);
const report = {
  scope: "Why Mental Health chapter library only",
  date: "2026-11-11",
  chapterCount: chapters.length,
  sectionCount: chapters.reduce((n, c) => n + c.sectionCount, 0),
  protectedFiles: Object.keys(protectedFiles).length,
  changedProtectedFiles,
  concurrentChanges,
  mobileHero: {
    beforeHeight: beforeHero.height,
    afterHeight: afterHero.height,
    reduction: beforeHero.height - afterHero.height,
  },
  layouts,
  contrast,
};
await writeFile(
  `${root}/verification.json`,
  JSON.stringify(report, null, 2) + "\n",
);
await writeFile(
  `${root}/handoff.json`,
  JSON.stringify(
    {
      scope: report.scope,
      url: "http://localhost:5173/why-mental-health",
      changedFiles: [
        "src/learning/MentalHealthPages.tsx",
        "src/learning/mental-health-covers.tsx",
        "src/learning/mental-health-library.css",
        "public/images/learning/mental-health-covers/provenance.json",
        "scripts/inspect-mental-health-library-ten.mjs",
        "scripts/prepare-mental-health-library-ten.mjs",
        "scripts/summarize-mental-health-library-ten.mjs",
        "tests/mental-health-library-covers.spec.ts",
        "CONTENT_LIBRARY_GUIDE.md",
        "README.md",
        "design-qa.md",
      ],
      artwork: {
        method: "Built-in image_gen",
        responsiveFiles: "public/images/learning/mental-health-covers/",
        newOriginalsAndPrompts: root,
        fullPromptSet:
          "public/images/learning/mental-health-covers/provenance.json",
        format: "Raster PNG and WebP, not editable vector files",
      },
      completedMappings: chapters.map((c) => {
        const asset = provenance.assets.find((a) => a.slug === c.slug);
        return {
          chapter: c.number,
          title: c.title,
          sections: c.sectionCount,
          asset: asset.id,
          reused: asset.reused,
          message: asset.message,
        };
      }),
      verification:
        "See verification.json, the browser test output, and design-qa.md for final results.",
      remainingGaps: {
        libraryCovers: "None; all ten are complete.",
        singleChapterWork:
          "Deferred by the selected scope; original internal photography and teaching visuals remain.",
        editorialStatus:
          "Original educational-draft status retained; visual work does not constitute clinical or publication approval.",
      },
      nextChapterHandoff: {
        suggestedTarget: "Chapter 01, in a separate explicitly selected task",
        readFirst:
          "CONTENT_LIBRARY_GUIDE.md; all current Chapter 01 sections, examples, captions, reflections and source notes",
        retain:
          "15 sections; interacting-influences, pressure/protection, and Ask–Listen–Offer diagrams; paired examination-pressure, unemployment, and family-responsibility stories; routes, citations, downloads and print behavior",
        artDirection:
          "Reuse the established palette and reviewed flat 2D references; keep recurring characters and props consistent within each pair; use editable labels and preserve all qualifications.",
      },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    {
      protectedFiles: report.protectedFiles,
      concurrentChanges,
      scopedFilesUnchanged:
        changedProtectedFiles.length === concurrentChanges.length,
      mobileHero: report.mobileHero,
      contrastChecks: contrast.length,
      layouts: layouts.length,
    },
    null,
    2,
  ),
);
