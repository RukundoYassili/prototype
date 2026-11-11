import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gbvChapters } from "../src/learning/gbv/chapters.generated";
import { gbvStories, gbvDiagrams } from "../src/learning/gbv/visuals";
import type { ChapterBlock } from "../src/learning/types";

const path = (slug: string) => `/understand-gbv/${slug}`;
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
function strings(block: ChapterBlock): string[] {
  if (block.type === "list") return block.items;
  if (block.type === "table") return [...block.headers, ...block.rows.flat()];
  if (block.type === "questions")
    return block.items.flatMap((q) => [
      q.question,
      q.answer,
      q.answerLabel || "",
    ]);
  if (
    ["example", "subsection", "disclosure"].includes(block.type) &&
    "blocks" in block
  )
    return [block.title, ...block.blocks.flatMap(strings)];
  if (block.type === "references") return [block.sourceText];
  return "text" in block ? [block.text] : [];
}

test("GBV source audit covers every section, table cell, reference, answer and unchanged download", async () => {
  const audit = JSON.parse(
    await readFile("artifacts/gbv-learning/source-audit.json", "utf8"),
  );
  expect(audit.chapters.map((c: any) => c.numberedSections)).toEqual([
    18, 19, 20,
  ]);
  expect(audit.chapters.map((c: any) => c.tableCellChecks)).toEqual([
    50, 67, 43,
  ]);
  expect(audit.chapters.flatMap((c: any) => c.references)).toHaveLength(25);
  expect(
    audit.chapters.flatMap((c: any) => c.questionsAndAnswers),
  ).toHaveLength(28);
  for (const chapter of audit.chapters) {
    expect(chapter.independentPypdfCoverage).toBe(true);
    expect(chapter.downloadHashMatch).toBe(true);
    expect(chapter.frontMatter.allCharactersPreserved).toBe(true);
    for (const section of chapter.sections)
      expect(section.orderedContentPreserved).toBe(true);
  }
  const manifest = JSON.parse(
    await readFile("public/learning/gbv/source-manifest.json", "utf8"),
  );
  for (const source of manifest.sources)
    expect(
      createHash("sha256")
        .update(await readFile(`public${source.pdfUrl}`))
        .digest("hex"),
    ).toBe(source.sha256);
  expect(gbvStories).toHaveLength(16);
  expect(gbvDiagrams).toHaveLength(8);
  const visuals = JSON.parse(
    await readFile("artifacts/gbv-learning/visual-manifest.json", "utf8"),
  );
  expect(visuals.scenes).toHaveLength(32);
  expect(new Set(visuals.scenes.map((s: any) => s.sourceSha256)).size).toBe(32);
  for (const scene of visuals.scenes)
    for (const file of scene.files)
      expect(
        createHash("sha256")
          .update(await readFile(file.path))
          .digest("hex"),
      ).toBe(file.sha256);
});

test("the expanded collection follows the existing GBV hero and page index", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/understand-gbv");
  await expect(page.locator("h1")).toHaveText(
    "You deserve safety and respect.",
  );
  await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
  await expect(
    page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("link", { name: "Chapters", exact: true }),
  ).toHaveAttribute("href", "#gbv-chapters");
  expect(
    await page
      .locator("#gbv-chapters")
      .evaluate(
        (e) => !!e.previousElementSibling?.matches(".support-topic-jumps"),
      ),
  ).toBe(true);
  for (const id of [
    "understanding",
    "support-options",
    "official-resources",
    "for-supporters",
  ])
    expect(
      await page
        .locator("#gbv-chapters")
        .evaluate(
          (e, id) =>
            !!(
              e.compareDocumentPosition(document.getElementById(id)!) &
              Node.DOCUMENT_POSITION_FOLLOWING
            ),
          id,
        ),
    ).toBe(true);
  await page.locator(".mh-chapter-card a").first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${gbvChapters[0].slug}$`));
  await page
    .getByRole("button", { name: "Knowledge Hub", exact: true })
    .click();
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Understand GBV", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

for (const chapter of gbvChapters) {
  test(`GBV ${chapter.number} renders every original block and attaches supplements after named examples`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.goto(path(chapter.slug));
    await expect(page).toHaveTitle(`${chapter.title} — VUGA NDAKUMVA`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      chapter.summary,
    );
    await expect(page.locator("h1")).toHaveText(chapter.title);
    await page
      .locator(".mh-article details")
      .evaluateAll((es) =>
        es.forEach((e) => ((e as HTMLDetailsElement).open = true)),
      );
    for (const section of chapter.sections) {
      const target = page.locator(`#${section.id}`);
      const rendered = normalize(await target.innerText());
      for (const value of section.blocks.flatMap(strings))
        expect(
          rendered,
          `${chapter.number}/${section.number}: ${value}`,
        ).toContain(normalize(value));
    }
    const text = normalize(await page.locator(".mh-reader").innerText());
    for (const value of chapter.frontMatter)
      expect(text).toContain(normalize(value));
    const tables = chapter.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === "table");
    await expect(page.locator(".mh-article table")).toHaveCount(4);
    for (const [i, table] of tables.entries()) {
      const cells = page.locator(".mh-article table").nth(i).locator("th,td");
      expect((await cells.allTextContents()).map(normalize)).toEqual(
        [...table.headers, ...table.rows.flat()].map(normalize),
      );
    }
    for (const reference of chapter.references)
      await expect(
        page.locator(`#reference-${reference.number} a`),
      ).toHaveAttribute("href", reference.url!);
    for (const story of gbvStories.filter(
      (s) => s.chapterSlug === chapter.slug,
    )) {
      const example = page.locator(`#${story.sourceExampleId}`).locator("..");
      const visual = example.locator(`[data-visual-id="${story.id}"]`);
      await expect(visual).toHaveAttribute(
        "aria-labelledby",
        story.sourceExampleId!,
      );
      await expect(visual.locator(".lv-scene")).toHaveCount(2);
      await expect(visual.locator(".lv-fictional")).toHaveText(
        "Illustrative fictional example. AI-generated.",
      );
      expect(
        await visual.evaluate((e) => e.previousElementSibling?.tagName),
      ).toBe("P");
    }
    await expect(page.locator(".mh-reference-check").last()).toContainText(
      "not specialist",
    );
    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: /Download source PDF/ }).click();
    const file = await download;
    expect(file.suggestedFilename()).toBe(chapter.originalFilename);
    const expected = createHash("sha256")
      .update(await readFile(`public${chapter.pdfUrl}`))
      .digest("hex");
    expect(
      createHash("sha256")
        .update(await readFile((await file.path())!))
        .digest("hex"),
    ).toBe(expected);
  });
}

test("paragraph objectives, safety notices, unchecked checklists and future chapters retain source meaning", async ({
  page,
}) => {
  await page.goto(path(gbvChapters[1].slug));
  await expect(page.locator("#learning-goals > p").first()).toContainText(
    "After working through this chapter",
  );
  await expect(page.locator("#learning-goals > ul")).toHaveCount(0);
  await expect(page.locator(".mh-source-safety")).toContainText(
    "A note to readers:",
  );
  await page.goto(path(gbvChapters[2].slug));
  await expect(page.locator(".mh-reader-version")).toContainText(
    "November 2026",
  );
  await expect(page.locator("#gbv-section-3-20 li")).toHaveCount(7);
  for (const item of await page.locator("#gbv-section-3-20 li").all())
    await expect(item).toContainText("[ ]");
  await expect(page.locator("#gbv-section-3-20")).toContainText(
    "Next chapter: Chapter 04",
  );
  await expect(
    page.locator('.mh-chapter-pagination a[href*="consent"]'),
  ).toHaveCount(1);
});

test("GBV boundaries, missing routes and browser history stay within the subject", async ({
  page,
}) => {
  await page.goto(path(gbvChapters[0].slug));
  const nav = page.getByRole("navigation", { name: "Chapter navigation" });
  await expect(nav.getByRole("link", { name: /PREVIOUS CHAPTER/ })).toHaveCount(
    0,
  );
  await nav.getByRole("link", { name: /NEXT CHAPTER/ }).click();
  await expect(page).toHaveURL(new RegExp(`${gbvChapters[1].slug}$`));
  await expect(page.locator("h1")).toHaveText(gbvChapters[1].title);
  await nav.getByRole("link", { name: /NEXT CHAPTER/ }).click();
  await expect(page.locator("h1")).toHaveText(gbvChapters[2].title);
  await expect(nav.getByRole("link", { name: /NEXT CHAPTER/ })).toHaveAttribute(
    "href",
    "/understand-gbv/understanding-consent-boundaries-and-bodily-autonomy",
  );
  for (const href of await nav
    .locator("a")
    .evaluateAll((es) => es.map((e) => e.getAttribute("href"))))
    expect(href).toMatch(/^\/understand-gbv/);
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`${gbvChapters[1].slug}$`));
  await page.goto("/understand-gbv/chapter-four");
  await expect(page).toHaveTitle("Chapter not found — VUGA NDAKUMVA");
  await expect(page.locator("h1")).toHaveText("This chapter isn’t available.");
  await page
    .getByRole("link", { name: "Back to the chapters", exact: true })
    .click();
  await expect(page).toHaveURL(/\/understand-gbv$/);
});

test("knowledge checks and optional explanations use keyboard disclosure without submissions or storage", async ({
  page,
}) => {
  const mutations: string[] = [];
  page.on("request", (r) => {
    if (!["GET", "HEAD"].includes(r.method())) mutations.push(r.url());
  });
  await page.goto(path(gbvChapters[0].slug));
  const before = await page.evaluate(() => [
    JSON.stringify(localStorage),
    JSON.stringify(sessionStorage),
  ]);
  for (const selector of [
    ".mh-knowledge-check .mh-answer",
    ".lv-explanation",
  ]) {
    const detail = page.locator(selector).first();
    await detail.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(detail).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(detail).not.toHaveAttribute("open", "");
  }
  await expect(
    page.locator(".mh-reader input,.mh-reader textarea,.mh-reader form"),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => [
      JSON.stringify(localStorage),
      JSON.stringify(sessionStorage),
    ]),
  ).toEqual(before);
  expect(mutations).toEqual([]);
});

test("missing images preserve alt descriptions, captions and source examples", async ({
  page,
}) => {
  await page.route("**/images/learning/gbv/**", (route) => route.abort());
  await page.goto(path(gbvChapters[0].slug));
  const scene = page.locator(".lv-scene").first();
  await scene.scrollIntoViewIfNeeded();
  await expect(scene.locator(".lv-image-unavailable")).toBeVisible();
  await expect(scene).toContainText(
    "Fictional illustration of a young woman in a mustard cardigan",
  );
  await expect(scene).toContainText(gbvStories[0].scenes[0].caption);
});

for (const width of [375, 768, 1024, 1440, 1920])
  test(`all GBV pages fit ${width}px with keyboard contents, visible focus and header offsets`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/understand-gbv");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
    for (const chapter of gbvChapters) {
      await page.goto(`${path(chapter.slug)}#gbv-section-${chapter.number}-8`);
      const section = page.locator(`#gbv-section-${chapter.number}-8`);
      await expect(section).toBeFocused();
      await expect
        .poll(async () => {
          const header = await page.getByRole("banner").boundingBox();
          const bounds = await section.boundingBox();
          return bounds!.y >= header!.y + header!.height - 1;
        })
        .toBe(true);
      if (width <= 1100) await page.locator(".gbv-mobile-tools button").click();
      const link = page
        .getByRole("navigation", {
          name: width <= 1100 ? "Mobile chapter contents" : "Chapter contents",
        })
        .locator(`a[href$="#gbv-section-${chapter.number}-3"]`);
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(
        page.locator(`#gbv-section-${chapter.number}-3`),
      ).toBeFocused();
      const table = page.locator(".mh-table-scroll:visible").first();
      if (await table.count()) {
        await table.focus();
        await page.keyboard.press("ArrowRight");
      } else {
        await expect(page.locator(".gbv-table-pairs").first()).toBeVisible();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const image = page.locator(".lv-scene-image").first();
      const bounds = await image.boundingBox();
      expect(bounds!.width / bounds!.height).toBeCloseTo(4 / 3, 1);
    }
  });

test("desktop tracking scrolls only the contents panel and print restores mixed disclosure states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path(gbvChapters[2].slug));
  const nav = page.getByRole("navigation", { name: "Chapter contents" });
  for (const id of [
    "gbv-section-3-19",
    "gbv-section-3-20",
    "gbv-section-3-4",
  ]) {
    const top = await page.locator(`#${id}`).evaluate((e) => {
      const top =
        e.getBoundingClientRect().top +
        scrollY -
        (document.querySelector(".site-header")!.getBoundingClientRect()
          .bottom +
          24);
      scrollTo({ top, behavior: "instant" });
      return top;
    });
    await expect(nav.locator(`a[href$="#${id}"]`)).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(Math.abs((await page.evaluate(() => scrollY)) - top)).toBeLessThan(
      2,
    );
  }
  const details = page.locator(".mh-article details");
  await details
    .first()
    .evaluate((e) => ((e as HTMLDetailsElement).open = true));
  const before = await details.evaluateAll((es) =>
    es.map((e) => (e as HTMLDetailsElement).open),
  );
  await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
  expect(
    await details.evaluateAll((es) =>
      es.every((e) => (e as HTMLDetailsElement).open),
    ),
  ).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("banner")).toBeHidden();
  await page.evaluate(() => dispatchEvent(new Event("afterprint")));
  expect(
    await details.evaluateAll((es) =>
      es.map((e) => (e as HTMLDetailsElement).open),
    ),
  ).toEqual(before);
});
