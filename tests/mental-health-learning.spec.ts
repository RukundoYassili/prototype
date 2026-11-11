import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  mentalHealthChapters as allChapters,
  chapterPath,
} from "../src/learning/chapters";
import type { ChapterBlock } from "../src/learning/types";

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
// These source-specific assertions continue to protect the original two PDFs.
// The continuation suite independently covers the five new source formats.
const mentalHealthChapters = allChapters.filter(
  (chapter) => chapter.number <= 2,
);
function blockStrings(block: ChapterBlock): string[] {
  if (block.type === "paragraph") return [block.text];
  if (block.type === "list") return block.items;
  if (block.type === "table") return [...block.headers, ...block.rows.flat()];
  if (block.type === "questions")
    return block.items.flatMap((item) => [item.question, item.answer]);
  if (
    block.type === "example" ||
    block.type === "subsection" ||
    block.type === "disclosure"
  )
    return [block.title, ...block.blocks.flatMap(blockStrings)];
  if (block.type === "references") return [block.sourceText];
  return [block.text];
}

test("Why Mental Health opens the growing chapter library from the shared navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Why Mental Health", exact: true })
    .click();
  await expect(page).toHaveTitle("Why Mental Health — VUGA NDAKUMVA");
  await expect(page.locator(".mh-chapter-card")).toHaveCount(
    allChapters.length,
  );
  await expect(
    page.locator(".mh-series-continuation").getByRole("heading", { level: 2 }),
  ).toBeVisible();
  await expect(page.locator(".mh-series-continuation")).toContainText(
    "More Mental Health chapters are on the way.",
  );
  await expect(page.locator(".mh-draft-note")).toContainText(
    "have not been clinically reviewed",
  );
  await expect(page.locator(".mh-library-meta")).toContainText(
    "10 chapters available",
  );
  await page.locator(".mh-chapter-card a").first().click();
  await expect(page).toHaveURL(
    new RegExp(`${chapterPath(mentalHealthChapters[0].slug)}$`),
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    mentalHealthChapters[0].title,
  );
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Why Mental Health", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

for (const chapter of mentalHealthChapters) {
  test(`chapter ${chapter.number} retains every supplied lesson, table, answer, and source note`, async ({
    page,
  }) => {
    await page.goto(chapterPath(chapter.slug));
    await expect(page).toHaveTitle(`${chapter.title} — VUGA NDAKUMVA`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      chapter.title,
    );
    await expect(
      page.locator(".mh-article [data-chapter-section]"),
    ).toHaveCount(chapter.sections.length + 3);
    await page.locator(".mh-article details").evaluateAll((elements) =>
      elements.forEach((element) => {
        (element as HTMLDetailsElement).open = true;
      }),
    );
    for (const section of chapter.sections) {
      const target = page.locator(`#${section.id}`);
      await expect(target.getByRole("heading", { level: 2 })).toContainText(
        section.title,
      );
      const rendered = normalize(await target.innerText());
      for (const source of section.blocks.flatMap(blockStrings))
        expect(
          rendered,
          `Chapter ${chapter.number}, section ${section.number}`,
        ).toContain(normalize(source));
    }
    const fullText = normalize(await page.locator(".mh-reader").innerText());
    for (const source of [
      ...chapter.frontMatter,
      ...chapter.goals,
      ...chapter.referenceNotes,
      ...chapter.editorialReview.flatMap(blockStrings),
      ...chapter.approval.flatMap(blockStrings),
    ])
      expect(fullText).toContain(normalize(source));
    for (const reference of chapter.references) {
      await expect(
        page.locator(`#reference-${reference.number} a`),
      ).toHaveAttribute("href", reference.url);
      await expect(
        page.locator(`#reference-${reference.number}`),
      ).toContainText(reference.text);
    }
    const tableCount = chapter.sections
      .flatMap((section) => section.blocks)
      .filter((block) => block.type === "table").length;
    await expect(
      page.locator(".mh-article > section:not(.mh-editorial-section) table"),
    ).toHaveCount(tableCount);
    await expect(page.locator(".mh-answer")).toHaveCount(5);
  });
}

test("chapter source audit covers all 33 lesson sections without losing source words", async () => {
  const audit = JSON.parse(
    await readFile("artifacts/mental-health-source-review.json", "utf8"),
  ) as {
    chapter: number;
    sections: {
      section: string;
      sourceWords: number;
      matchingWords: number;
      complete: boolean;
    }[];
  }[];
  expect(audit).toHaveLength(2);
  const sections = audit.flatMap((chapter) =>
    chapter.sections.filter((section) => /^\d/.test(section.section)),
  );
  expect(sections).toHaveLength(33);
  for (const chapter of audit)
    for (const section of chapter.sections) {
      expect(section.complete).toBe(true);
      expect(section.matchingWords).toBe(section.sourceWords);
    }
});

test("cold deep links, mobile contents, inline references and browser history restore focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const chapter = mentalHealthChapters[1];
  await page.goto(`${chapterPath(chapter.slug)}#section-2-15`);
  await expect(page.locator("#section-2-15")).toBeFocused();
  await expect
    .poll(async () => {
      const header = await page.getByRole("banner").boundingBox();
      const section = await page.locator("#section-2-15").boundingBox();
      return section!.y >= header!.y + header!.height;
    })
    .toBe(true);
  await page.locator(".mh-contents-toggle").click();
  const contents = page.getByRole("navigation", { name: "Chapter contents" });
  await contents.locator('a[href$="#section-2-7"]').focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#section-2-7$/);
  await expect(page.locator("#section-2-7")).toBeFocused();
  await expect(contents).toBeHidden();
  await page
    .locator("#section-2-7")
    .getByRole("link", { name: "Reference 1", exact: true })
    .click();
  await expect(page).toHaveURL(/#reference-1$/);
  await expect(page.locator("#reference-1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/#section-2-7$/);
  await expect(page.locator("#section-2-7")).toBeFocused();
});

test("knowledge checks reveal original answers by keyboard without scoring or storing information", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto(`${chapterPath(mentalHealthChapters[1].slug)}#section-2-16`);
  const check = page.locator(".mh-answer").first();
  await expect(check.locator("p")).toBeHidden();
  await check.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(check.locator("p")).toContainText(
    "False. Fear may help identify threats",
  );
  await page.keyboard.press("Enter");
  await expect(check.locator("p")).toBeHidden();
  await expect(
    page.locator(".mh-reader input, .mh-reader textarea, .mh-reader form"),
  ).toHaveCount(0);
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

test("source PDF downloads retain the original bytes and reflection downloads keep the prompts", async ({
  page,
}) => {
  const audit = JSON.parse(
    await readFile("artifacts/mental-health-source-review.json", "utf8"),
  );
  for (const chapter of mentalHealthChapters) {
    await page.goto(chapterPath(chapter.slug));
    const sourceDownload = page.waitForEvent("download");
    await page.getByRole("link", { name: /Download source PDF/ }).click();
    const pdf = await sourceDownload;
    expect(
      createHash("sha256")
        .update(await readFile((await pdf.path())!))
        .digest("hex"),
    ).toBe(
      audit.find((item: { chapter: number }) => item.chapter === chapter.number)
        .sha256,
    );
    const reflectionDownload = page.waitForEvent("download");
    await page
      .getByRole("link", { name: /Download reflection prompts/ })
      .click();
    const reflection = await reflectionDownload;
    expect(reflection.suggestedFilename()).toBe(
      `chapter-${String(chapter.number).padStart(2, "0")}-reflection.txt`,
    );
    const text = await readFile((await reflection.path())!, "utf8");
    for (const source of chapter.sections
      .find((section) => section.number === chapter.reflectionSection)!
      .blocks.flatMap(blockStrings))
      expect(text).toContain(source);
  }
});

test("chapter pagination, editorial review and missing chapters remain navigable", async ({
  page,
}) => {
  await page.goto(chapterPath(mentalHealthChapters[0].slug));
  const notes = page.locator(".mh-editorial-details").first();
  await notes.locator("summary").click();
  await expect(notes.getByRole("table")).toBeVisible();
  await expect(notes).toContainText("Retain the 18-chapter scope");
  await page
    .getByRole("navigation", { name: "Chapter navigation" })
    .getByRole("link", { name: /NEXT CHAPTER/ })
    .click();
  await expect(page).toHaveURL(new RegExp(`${mentalHealthChapters[1].slug}$`));
  await page
    .getByRole("navigation", { name: "Chapter navigation" })
    .getByRole("link", { name: /PREVIOUS CHAPTER/ })
    .click();
  await expect(page).toHaveURL(new RegExp(`${mentalHealthChapters[0].slug}$`));
  await page.goto("/why-mental-health/not-a-chapter");
  await expect(
    page.getByRole("heading", { name: "This chapter isn’t available." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to the chapters", exact: true })
    .click();
  await expect(page).toHaveURL(/\/why-mental-health$/);
});

test("printing reveals all answers and editorial notes and restores their previous state", async ({
  page,
}) => {
  await page.goto(chapterPath(mentalHealthChapters[0].slug));
  await expect(page.locator(".mh-article")).toBeVisible();
  await page
    .locator(".mh-answer")
    .first()
    .evaluate((element) => {
      (element as HTMLDetailsElement).open = true;
    });
  await page.evaluate(() => {
    window.print = () => window.dispatchEvent(new Event("beforeprint"));
  });
  await page
    .getByRole("button", { name: "Print chapter", exact: true })
    .click();
  expect(
    await page
      .locator(".mh-article details")
      .evaluateAll((elements) =>
        elements.every((element) => (element as HTMLDetailsElement).open),
      ),
  ).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("banner")).toBeHidden();
  await expect(page.locator("#newsletter")).toBeHidden();
  await expect(page.locator(".mh-reader-actions")).toBeHidden();
  await expect(page.locator(".mh-answer").last().locator("p")).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  expect(
    await page
      .locator(".mh-answer")
      .evaluateAll((elements) =>
        elements.map((element) => (element as HTMLDetailsElement).open),
      ),
  ).toEqual([true, false, false, false, false]);
  await page.emulateMedia({ media: "screen" });
  await expect(page.getByRole("banner")).toBeVisible();
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`learning pages fit ${width}px with readable tables, keyboard access and reduced motion`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/why-mental-health");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(
      allChapters.length,
    );
    const first = page.locator(".mh-chapter-card > a").first();
    await first.focus();
    await first.hover();
    await expect(first.locator("img")).toHaveCSS("transform", "none");
    for (const chapter of mentalHealthChapters) {
      await page.goto(chapterPath(chapter.slug));
      await expect(page.locator(".mh-article")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(
        page.getByRole("button", { name: "Quick exit", exact: true }),
      ).toBeInViewport();
      if (width <= 1100) {
        await expect(
          page.getByRole("navigation", { name: "Chapter contents" }),
        ).toBeHidden();
        await page.locator(".mh-contents-toggle").click();
      }
      const target = chapter.number === 1 ? "section-1-2" : "section-2-2";
      await page
        .getByRole("navigation", { name: "Chapter contents" })
        .locator(`a[href$="#${target}"]`)
        .click();
      await expect(page.locator(`#${target}`)).toBeFocused();
      const table = page.locator(`#${target} .mh-table-scroll`);
      await table.focus();
      await page.keyboard.press("ArrowRight");
      expect(
        await table.evaluate(
          (element) => element.scrollWidth >= element.clientWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    expect(errors).toEqual([]);
  });
}
