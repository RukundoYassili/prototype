import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { mentalHealthChapters, chapterPath } from "../src/learning/chapters";
import { continuationChapters } from "../src/learning/chapters-03-07.generated";
import {
  continuationStories,
  continuationDiagrams,
} from "../src/learning/visuals-03-07";
import type { ChapterBlock } from "../src/learning/types";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
function strings(block: ChapterBlock): string[] {
  if (block.type === "table") return [...block.headers, ...block.rows.flat()];
  if (block.type === "list") return block.items;
  if (block.type === "questions")
    return block.items.flatMap((item) => [item.question, item.answer]);
  if (
    block.type === "example" ||
    block.type === "subsection" ||
    block.type === "disclosure"
  )
    return [block.title, ...block.blocks.flatMap(strings)];
  if (block.type === "references") return [block.sourceText];
  return [block.text];
}

test("ten chapters remain ordered and the original continuation stays linked in both directions", async ({
  page,
}) => {
  await page.goto("/why-mental-health");
  await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
  await expect(page.locator(".mh-library-meta")).toContainText(
    "10 chapters available",
  );
  expect(mentalHealthChapters.map((chapter) => chapter.number)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  for (const chapter of mentalHealthChapters)
    await expect(
      page.locator(`.mh-chapter-card a[href="${chapterPath(chapter.slug)}"]`),
    ).toHaveCount(1);
  await page.locator(".mh-chapter-card a").nth(2).click();
  for (const chapter of continuationChapters) {
    await expect(page).toHaveTitle(`${chapter.title} — VUGA NDAKUMVA`);
    const nav = page.getByRole("navigation", { name: "Chapter navigation" });
    await expect(
      nav.getByRole("link", { name: /PREVIOUS CHAPTER/ }),
    ).toHaveAttribute(
      "href",
      chapterPath(mentalHealthChapters[chapter.number - 2].slug),
    );
    if (chapter.number < 7)
      await nav.getByRole("link", { name: /NEXT CHAPTER/ }).click();
    else
      await expect(
        nav.getByRole("link", { name: /NEXT CHAPTER/ }),
      ).toHaveAttribute("href", chapterPath(mentalHealthChapters[7].slug));
  }
});

for (const chapter of continuationChapters) {
  test(`chapter ${chapter.number} renders its complete source, original labels, references, and editorial material`, async ({
    page,
  }) => {
    await page.goto(chapterPath(chapter.slug));
    await expect(page.locator(".mh-article")).toBeVisible();
    await page
      .locator(".mh-article details")
      .evaluateAll((nodes) =>
        nodes.forEach((node) => ((node as HTMLDetailsElement).open = true)),
      );
    await expect(
      page.locator(".mh-article [data-chapter-section]"),
    ).toHaveCount(chapter.sections.length + 1);
    await expect(page.locator(".mh-reader-draft p")).not.toBeEmpty();
    await expect(page.locator(".mh-reader-version")).toHaveText(
      chapter.editionText!,
    );
    for (const section of chapter.sections) {
      const target = page.locator(`[id="${section.id}"]`);
      await expect(target.locator(":scope > h2")).toContainText(section.title);
      if (section.number)
        await expect(target.locator(".mh-section-number")).toHaveText(
          section.number,
        );
      const text = normalize(await target.innerText());
      for (const source of section.blocks.flatMap(strings))
        expect(text, `${chapter.number}: ${section.id}`).toContain(
          normalize(source),
        );
    }
    const all = normalize(await page.locator(".mh-reader").innerText());
    for (const source of [
      ...chapter.goals,
      ...chapter.introductionBlocks!.flatMap(strings),
      ...chapter.afterGoals!.flatMap(strings),
    ])
      expect(all).toContain(normalize(source));
    for (const reference of chapter.references) {
      const item = page.locator(`#reference-${reference.number}`);
      expect(
        normalize(
          (await item.innerText()).replace(reference.url || "\u0000", ""),
        ),
      ).toContain(normalize(reference.text));
      if (reference.url)
        await expect(item.locator("a")).toHaveAttribute("href", reference.url);
      else await expect(item.locator("a")).toHaveCount(0);
    }
    await expect(page.locator("#chapter-editorial-notes")).toHaveCount(0);
    await expect(
      page.locator(".mh-reader input, .mh-reader textarea, .mh-reader form"),
    ).toHaveCount(0);
  });

  test(`chapter ${chapter.number} downloads the unchanged PDF and private reflection prompts`, async ({
    page,
    request,
  }) => {
    const sources = JSON.parse(
      await readFile("artifacts/mental-health-sources-03-07.json", "utf8"),
    );
    const response = await request.get(chapter.pdfUrl);
    expect(response.ok()).toBe(true);
    expect(
      createHash("sha256")
        .update(await response.body())
        .digest("hex"),
    ).toBe(
      sources.find(
        (source: { chapter: number }) => source.chapter === chapter.number,
      ).sha256,
    );
    const worksheet = await request.get(chapter.worksheetUrl);
    expect(worksheet.ok()).toBe(true);
    expect(await worksheet.text()).toContain(chapter.title);
    expect(await worksheet.text()).not.toContain("Answers with explanations");
    await page.goto(chapterPath(chapter.slug));
    await expect(
      page.getByRole("link", { name: /Download source PDF/ }),
    ).toHaveAttribute("download", "");
    await expect(
      page.getByRole("link", { name: /Download reflection prompts/ }),
    ).toHaveAttribute("href", chapter.worksheetUrl);
  });

  test(`chapter ${chapter.number} preserves optional answers, print state and private learning`, async ({
    page,
  }) => {
    const submissions: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") submissions.push(request.url());
    });
    await page.goto(chapterPath(chapter.slug));
    const answers = page.locator(".mh-answer, .mh-table-answer");
    await expect(answers.first()).toBeAttached();
    const first = answers.first();
    await first.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("open", "");
    const before = await page
      .locator(".mh-article details")
      .evaluateAll((nodes) =>
        nodes.map((node) => (node as HTMLDetailsElement).open),
      );
    await page.evaluate(() => {
      window.dispatchEvent(new Event("beforeprint"));
      window.dispatchEvent(new Event("beforeprint"));
    });
    expect(
      await page
        .locator(".mh-article details")
        .evaluateAll((nodes) =>
          nodes.every((node) => (node as HTMLDetailsElement).open),
        ),
    ).toBe(true);
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    expect(
      await page
        .locator(".mh-article details")
        .evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLDetailsElement).open),
        ),
    ).toEqual(before);
    expect(submissions).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
  });
}

test("new visual inventory is complete and linked to exact source examples and exercises", () => {
  expect(continuationStories).toHaveLength(21);
  expect(
    continuationDiagrams.filter((diagram) => diagram.kind === "skill"),
  ).toHaveLength(18);
  expect(
    continuationDiagrams.filter((diagram) => diagram.kind !== "skill"),
  ).toHaveLength(10);
  for (const chapter of continuationChapters) {
    const examples = chapter.sections
      .flatMap((section) => section.blocks)
      .filter((block) => block.type === "example");
    const stories = continuationStories.filter(
      (story) => story.chapterSlug === chapter.slug,
    );
    expect(stories).toHaveLength(chapter.number === 7 ? 5 : 4);
    for (const story of stories)
      expect(
        examples.some(
          (block) =>
            block.type === "example" && block.id === story.sourceExampleId,
        ),
      ).toBe(true);
  }
});

test("Grief retains Parts IV to VII and five individually illustrated activities", async ({
  page,
}) => {
  const chapter = continuationChapters[4];
  await page.goto(chapterPath(chapter.slug));
  for (const number of ["Part IV", "Part V", "Part VI", "Part VII"])
    await expect(
      page
        .locator(".mh-article > section > h2 > .mh-section-number")
        .filter({ hasText: new RegExp(`^${number}$`) }),
    ).toHaveCount(1);
  await expect(
    page.locator("#section-7-part-iv .mh-source-activity"),
  ).toHaveCount(5);
  for (let index = 1; index <= 5; index++)
    await expect(
      page
        .locator(`#grief-activity-${index}`)
        .locator("..")
        .locator(".lv-skill"),
    ).toHaveCount(1);
});

test("new direct section and citation-range links preserve focus and history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  const chapter = continuationChapters[2];
  await page.goto(`${chapterPath(chapter.slug)}#section-5-1`);
  await expect(page.locator("#section-5-1")).toBeFocused();
  const citation = page
    .locator("#section-5-1")
    .getByRole("link", { name: "Reference 3", exact: true })
    .first();
  await citation.click();
  await expect(page.locator("#reference-3")).toBeFocused();
  await page.goBack();
  await expect(page.locator("#section-5-1")).toBeFocused();
  await page.locator(".mh-contents-toggle").click();
  await page
    .getByRole("navigation", { name: "Chapter contents" })
    .locator('a[href$="#section-5-20"]')
    .click();
  await expect(page.locator("#section-5-20")).toBeFocused();
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`continuation chapters preserve source layout, visual order and readable crops at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const chapter of continuationChapters) {
      await page.goto(chapterPath(chapter.slug));
      const stories = continuationStories.filter(
        (story) => story.chapterSlug === chapter.slug,
      );
      await expect(page.locator(".lv-story")).toHaveCount(stories.length);
      for (const story of stories) {
        const visual = page.locator(`[data-visual-id="${story.id}"]`);
        await expect(visual).toHaveAttribute(
          "aria-labelledby",
          story.sourceExampleId!,
        );
        await expect(visual.locator("h3,h4")).toHaveCount(0);
        const panels = await visual.locator(".lv-scene").evaluateAll((nodes) =>
          nodes.map((node) => ({
            x: node.getBoundingClientRect().x,
            y: node.getBoundingClientRect().y,
          })),
        );
        if (width === 375) expect(panels[1].y).toBeGreaterThan(panels[0].y);
        else expect(Math.abs(panels[0].y - panels[1].y)).toBeLessThan(1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      expect(
        await page
          .locator(".lv-scene figcaption p")
          .first()
          .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      ).toBeGreaterThanOrEqual(14);
      if (width > 680) {
        for (const diagram of await page.locator(".lv-influences").all()) {
          const cells = await diagram
            .locator(".lv-steps > li")
            .evaluateAll((nodes) =>
              nodes.map((node) => ({
                x: node.getBoundingClientRect().x,
                y: node.getBoundingClientRect().y,
              })),
            );
          if (cells.length === 4) {
            expect(Math.abs(cells[2].y - cells[3].y)).toBeLessThan(1);
            expect(cells[3].x).toBeGreaterThan(cells[2].x);
          }
        }
      }
      if (chapter.number === 6) {
        const sequence = page.locator(
          '[data-visual-id="trauma-early-support"]',
        );
        const steps = await sequence
          .locator(".lv-steps > li")
          .evaluateAll((nodes) =>
            nodes.map((node) => ({
              x: node.getBoundingClientRect().x,
              y: node.getBoundingClientRect().y,
            })),
          );
        expect(steps).toHaveLength(4);
        for (const [index, step] of steps.entries()) {
          expect(Math.abs(step.x - steps[0].x)).toBeLessThan(1);
          if (index) expect(step.y).toBeGreaterThan(steps[index - 1].y);
        }
      }
    }
    expect(errors).toEqual([]);
  });
}
