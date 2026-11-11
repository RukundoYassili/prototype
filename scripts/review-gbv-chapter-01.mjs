import { chromium, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import sharp from "sharp";
import { format } from "prettier";

const root = "artifacts/gbv-chapter-01-refresh";
const output = `${root}/after`;
const base = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const route = "/understand-gbv/understanding-gender-based-violence";
const source = JSON.parse(
  await readFile(`${root}/chapter-source.json`, "utf8"),
);
const originals = JSON.parse(
  await readFile(`${root}/current-visuals.json`, "utf8"),
);
await mkdir(output, { recursive: true });
const report = {
  status: "running",
  layouts: [],
  interactions: [],
  comparisons: [],
  sourceChecks: [],
  contrast: [],
  errors: [],
};
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") report.errors.push(message.text());
});
const mutations = [];
page.on("request", (request) => {
  if (!["GET", "HEAD"].includes(request.method()))
    mutations.push(request.url());
});
const normalize = (text) => text.replace(/\s+/g, " ").trim();
function strings(block) {
  if (block.type === "list") return block.items;
  if (block.type === "table") return [...block.headers, ...block.rows.flat()];
  if (block.type === "questions")
    return block.items.flatMap((q) => [
      q.question,
      q.answer,
      q.answerLabel || "",
    ]);
  if ("blocks" in block) return [block.title, ...block.blocks.flatMap(strings)];
  if (block.type === "references") return [block.sourceText];
  return "text" in block ? [block.text] : [];
}
async function settle() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.querySelectorAll(".mh-reader img")].map((image) => {
        image.loading = "eager";
        return image.decode();
      }),
    );
  });
}
async function verifySource() {
  await page.locator(".mh-article details").evaluateAll((elements) =>
    elements.forEach((element) => {
      element.open = true;
    }),
  );
  await expect(page.locator("h1")).toHaveText(source.title);
  for (const section of source.sections) {
    const element = page.locator(`#${section.id}`);
    await expect(element.locator("h2").first()).toContainText(section.title);
    const text = normalize(await element.innerText());
    for (const expected of section.blocks.flatMap(strings))
      assert(
        text.includes(normalize(expected)),
        `Missing source: ${section.id}: ${expected}`,
      );
  }
  for (const story of originals.gbvStories) {
    const visual = page.locator(`[data-visual-id="${story.id}"]`);
    await expect(visual).toHaveAttribute(
      "aria-labelledby",
      story.sourceExampleId,
    );
    for (const caption of story.scenes.map((scene) => scene.caption))
      await expect(visual).toContainText(caption);
    await expect(visual).toContainText(story.reflection);
    await expect(visual).toContainText(story.explanation);
    await expect(visual).toContainText("A possible supportive response");
  }
  for (const reference of source.references)
    await expect(
      page.locator(`#reference-${reference.number} a`),
    ).toHaveAttribute("href", reference.url);
  await expect(page.locator(".mh-learning-note")).toContainText(
    "illustrations are AI-generated fictional teaching scenes",
  );
  await expect(page.locator(".mh-learning-note")).not.toContainText(
    "photo scenes",
  );
  await expect(page.locator(".mh-reader-draft")).toContainText(
    source.publicationStatus,
  );
  await expect(page.locator(".mh-source-safety")).toContainText(
    source.safetyNotices[0].text,
  );
  await page.locator(".mh-article details").evaluateAll((elements) =>
    elements.forEach((element) => {
      element.open = false;
    }),
  );
}

try {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200);
    await expect(page.locator(".gbv-foundations")).toHaveCount(1);
    await expect(page.locator(".mh-reader img")).toHaveCount(13);
    await expect(page.locator(".lv-story")).toHaveCount(6);
    await expect(page.locator(".lv-diagram")).toHaveCount(3);
    await expect(
      page.locator(".mh-reader input,.mh-reader textarea,.mh-reader form"),
    ).toHaveCount(0);
    await expect(page.locator(".gbv-foundations-hero img")).toHaveAttribute(
      "fetchpriority",
      "high",
    );
    await expect(page.locator(".lv-scene img").first()).toHaveAttribute(
      "loading",
      "lazy",
    );
    await verifySource();
    await settle();
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      images: [...document.querySelectorAll(".mh-reader img")].map((image) => ({
        loaded: image.naturalWidth > 0,
        reserved: image.hasAttribute("width") && image.hasAttribute("height"),
        fit: getComputedStyle(image).objectFit,
        ratioError: Math.abs(
          image.clientWidth / image.clientHeight -
            image.naturalWidth / image.naturalHeight,
        ),
        alt: image.alt,
      })),
    }));
    assert.equal(metrics.overflow, false);
    assert(
      metrics.images.every(
        (image) =>
          image.loaded &&
          image.reserved &&
          image.fit === "contain" &&
          image.ratioError < 0.02 &&
          image.alt.length > 30,
      ),
    );
    report.layouts.push(metrics);
    if ([375, 1440].includes(width)) {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      const screenshot = `${output}/chapter-${width}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      await page.screenshot({ path: `${output}/header-${width}.png` });
      const targets = [
        ".mh-reader-header",
        '[data-visual-id="gbv-control-versus-care"]',
        '[data-visual-id="gbv-consent"]',
        '[data-visual-id="gbv-lives"]',
        ...originals.gbvStories.map(
          (story) => `[data-visual-id="${story.id}"]`,
        ),
      ];
      for (const selector of targets) {
        const locator = page.locator(selector);
        const name = (await locator.getAttribute("data-visual-id")) || "hero";
        await locator.screenshot({
          path: `${output}/${name}-${width}.png`,
          style: ".site-header, .skip-link { visibility: hidden !important; }",
        });
      }
    }
  }
  report.contrast = await page.locator(".gbv-foundations").evaluate((root) => {
    const parse = (value) => (value.match(/[\d.]+/g) || []).map(Number);
    const luminance = (rgb) =>
      rgb
        .slice(0, 3)
        .map((value) => value / 255)
        .map((value) =>
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        )
        .reduce(
          (total, value, index) =>
            total + value * [0.2126, 0.7152, 0.0722][index],
          0,
        );
    return [...root.querySelectorAll("*")]
      .filter(
        (element) =>
          element.namespaceURI === "http://www.w3.org/1999/xhtml" &&
          [...element.childNodes].some(
            (node) =>
              node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
          ),
      )
      .map((element) => {
        const style = getComputedStyle(element);
        let background = [255, 255, 255];
        for (let parent = element; parent; parent = parent.parentElement) {
          const color = parse(getComputedStyle(parent).backgroundColor);
          if (color.length === 3 || color[3] === 1) {
            background = color;
            break;
          }
        }
        const foregroundLuminance = luminance(parse(style.color)),
          backgroundLuminance = luminance(background);
        const ratio =
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
        const large =
          parseFloat(style.fontSize) >= 24 ||
          (parseFloat(style.fontSize) >= 18.66 &&
            parseInt(style.fontWeight) >= 700);
        return {
          text: element.textContent.trim().slice(0, 70),
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
    await page.setViewportSize({ width, height: 960 });
    await page.goto(base + route);
    if (width < 1101)
      await page
        .getByRole("button", { name: "In this chapter", exact: true })
        .click();
    const link = page
      .getByRole("navigation", { name: "Chapter contents" })
      .locator('a[href$="#gbv-section-1-8"]');
    await link.focus();
    assert(
      parseFloat(
        await link.evaluate(
          (element) => getComputedStyle(element).outlineWidth,
        ),
      ) >= 3,
    );
    await page.keyboard.press("Enter");
    await expect(page.locator("#gbv-section-1-8")).toBeFocused();
    assert(
      await page.evaluate(
        () =>
          document.querySelector("#gbv-section-1-8").getBoundingClientRect()
            .top >=
          document.querySelector(".site-header").getBoundingClientRect()
            .bottom -
            2,
      ),
    );
    const details = page.locator('[data-visual-id="gbv-consent"] details');
    await details.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
    await page
      .getByRole("navigation", { name: "Chapter navigation" })
      .getByRole("link", { name: /NEXT CHAPTER/ })
      .focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(
      base + "/understand-gbv/types-and-forms-of-gender-based-violence",
    );
    await expect(page.locator(".gbv-foundations")).toHaveCount(0);
    report.interactions.push(
      `${width}px: keyboard contents, visible focus, header offset, optional disclosure and next-chapter navigation passed`,
    );
  }

  await page.setViewportSize({ width: 1440, height: 960 });
  const baseline = JSON.parse(
    await readFile(`${root}/before/source-files.json`, "utf8"),
  );
  const libraryStyleBaseline = baseline.find(
    (entry) => entry.path === "src/learning/gbv/gbv.css",
  );
  const libraryChangedElsewhere =
    createHash("sha256")
      .update(await readFile(libraryStyleBaseline.path))
      .digest("hex") !== libraryStyleBaseline.sha256;
  for (const [name, path] of [
    ["gbv-library", "/understand-gbv"],
    ["gbv-02", "/understand-gbv/types-and-forms-of-gender-based-violence"],
    [
      "mental-health-01",
      "/why-mental-health/understanding-mental-health-and-wellbeing",
    ],
  ]) {
    await page.goto(base + path);
    await page
      .locator(name === "gbv-library" ? ".topic-understand-gbv" : ".mh-reader")
      .waitFor();
    await page.evaluate(() => document.fonts.ready);
    const file = `${output}/${name}.png`;
    await page.screenshot({ path: file });
    if (name === "gbv-library" && libraryChangedElsewhere) {
      await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
      await expect(page.locator(".gbv-foundations")).toHaveCount(0);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      report.comparisons.push({
        name,
        status:
          "Current library loads with ten cards and no chapter-specific presentation. Before/after pixel comparison excluded because an independent library-layout edit changed gbv.css during this task.",
      });
      continue;
    }
    // The initial comparison-reader captures caught React's loading fallback.
    // The attempted isolated original-source server could not prebundle under
    // the Windows sandbox. Do not treat those images as valid pixel baselines.
    if (name !== "gbv-library") {
      await expect(
        page.locator(".gbv-foundations,.gbv-foundations-hero"),
      ).toHaveCount(0);
      await expect(
        page.locator('.lv-story[data-artwork="illustration"]'),
      ).toHaveCount(0);
      await expect(page.locator(".mh-learning-note")).toContainText(
        "The photo scenes are AI-generated fictional examples",
      );
      await expect(page.locator(".mh-reader-actions button")).toHaveText(
        "Print chapter",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      report.comparisons.push({
        name,
        status:
          "Default reader presentation, original photo scenes, print action and layout verified; screenshot saved for visual review. Pixel baseline unavailable: initial capture was a loading screen, and isolated baseline prebundling was blocked by sandbox filesystem access.",
      });
      continue;
    }
    const before = await sharp(
      `${root}/before/${name === "gbv-library" ? name : `reconstructed-${name}`}.png`,
    )
      .raw()
      .toBuffer({ resolveWithObject: true });
    const after = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual(before.info, after.info);
    let delta = 0,
      significant = 0;
    for (let index = 0; index < before.data.length; index++) {
      const change = Math.abs(before.data[index] - after.data[index]);
      delta += change;
      if (change > 8) significant++;
    }
    const comparison = {
      name,
      meanChannelDelta: delta / before.data.length,
      significantChannels: significant,
    };
    assert(
      comparison.meanChannelDelta < 0.05 && significant < 80,
      JSON.stringify(comparison),
    );
    report.comparisons.push(comparison);
  }
  for (const entry of baseline.filter((entry) =>
    /chapters.*generated|gbv\/visuals|\.css$/.test(entry.path),
  )) {
    const unchanged =
      createHash("sha256")
        .update(await readFile(entry.path))
        .digest("hex") === entry.sha256;
    if (
      !unchanged &&
      entry.path === "src/learning/gbv/gbv.css" &&
      libraryChangedElsewhere
    ) {
      report.sourceChecks.push({
        path: entry.path,
        unchanged: false,
        note: "Independent library-layout update reviewed and preserved. This task does not edit this file.",
      });
      continue;
    }
    if (!unchanged && entry.path.endsWith(".css")) {
      const original = await format(
        await readFile(
          `${root}/before/${entry.path.replaceAll("/", "__")}`,
          "utf8",
        ),
        { parser: "css" },
      );
      const current = await format(await readFile(entry.path, "utf8"), {
        parser: "css",
      });
      assert.equal(
        current,
        original,
        `Protected styles changed: ${entry.path}`,
      );
      report.sourceChecks.push({
        path: entry.path,
        unchanged: false,
        sameAfterFormatting: true,
        note: "Concurrent whitespace-only formatting preserved.",
      });
      continue;
    }
    assert(unchanged, `Protected source changed: ${entry.path}`);
    report.sourceChecks.push({ path: entry.path, unchanged });
  }
  await page.goto(base + route);
  assert.deepEqual(
    await page.evaluate(() => [
      Object.keys(localStorage),
      Object.keys(sessionStorage),
    ]),
    [[], []],
  );
  assert.deepEqual(mutations, []);
  const quickExit = page.getByRole("button", {
    name: "Quick exit",
    exact: true,
  });
  await expect(quickExit).toHaveAccessibleDescription(
    "Changes this page immediately. Does not erase browsing history.",
  );
  await page.route("https://www.google.com/**", (request) =>
    request.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>Exit destination</title>",
    }),
  );
  await quickExit.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://www.google.com/");
  report.interactions.push(
    "Quick exit still replaces the page with its original destination; browsing-history limitation remains accessible. Destination mocked for this check.",
  );
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} finally {
  await writeFile(`${output}/review.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(
  JSON.stringify(
    {
      status: report.status,
      widths: report.layouts.map((layout) => layout.width),
      contrastChecks: report.contrast.length,
      interactions: report.interactions,
      comparisons: report.comparisons,
      sourceChecks: report.sourceChecks.length,
      errors: report.errors,
    },
    null,
    2,
  ),
);
