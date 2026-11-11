import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { mentalHealthChapters, chapterPath } from "../src/learning/chapters";
import { laterChapters as chapters } from "../src/learning/chapters-08-10.generated";
import type { ChapterBlock } from "../src/learning/types";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
function strings(b: ChapterBlock): string[] {
  if (b.type === "list") return b.items;
  if (b.type === "table") return [...b.headers, ...b.rows.flat()];
  if (b.type === "questions")
    return b.items.flatMap((q) => [q.question, q.answer]);
  if (
    b.type === "example" ||
    b.type === "subsection" ||
    b.type === "disclosure"
  )
    return [b.title, ...b.blocks.flatMap(strings)];
  if (b.type === "references") return [b.sourceText];
  return [b.text];
}

test("31 source pages are preserved and ten chapters are searchable and ordered", async ({
  page,
}) => {
  const audit = JSON.parse(
    await readFile("artifacts/mental-health-08-10/source-audit.json", "utf8"),
  );
  expect(audit.chapters.map((c: any) => c.pages)).toEqual([11, 10, 10]);
  expect(audit.chapters.map((c: any) => c.readerSections)).toEqual([
    21, 21, 20,
  ]);
  expect(audit.chapters.map((c: any) => c.scenarios)).toEqual([4, 5, 5]);
  expect(audit.chapters.map((c: any) => c.activities)).toEqual([3, 5, 5]);
  expect(audit.chapters.map((c: any) => c.references)).toEqual([10, 6, 7]);
  expect(audit.chapters.map((c: any) => c.tables.length)).toEqual([4, 0, 1]);
  for (const c of audit.chapters) {
    expect(c.questions).toBe(10);
    expect(
      c.frontMatterPreserved &&
        c.independentPypdfCoverage &&
        c.downloadHashMatch,
    ).toBe(true);
    expect(c.sections.every((s: any) => s.orderedContentPreserved)).toBe(true);
  }
  expect(mentalHealthChapters.map((c) => c.number)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  await page.goto("/why-mental-health");
  await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
  await expect(page.locator(".mh-library-meta")).toContainText(
    "10 chapters available",
  );
  for (const c of chapters)
    await expect(
      page.locator(`.mh-chapter-card a[href="${chapterPath(c.slug)}"]`),
    ).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Search chapters" }).fill("sleep");
  // Search includes section headings in earlier chapters, not only card titles.
  await expect(
    page.locator(`.mh-chapter-card a[href="${chapterPath(chapters[0].slug)}"]`),
  ).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "Search chapters" })
    .fill("Understanding Sleep");
  await expect(page.locator(".mh-chapter-card")).toHaveCount(1);
  await expect(page.locator(".mh-chapter-card h3")).toHaveText(
    chapters[0].title,
  );
  await page
    .getByRole("searchbox", { name: "Search chapters" })
    .fill("unavailable topic xyz");
  await expect(
    page.getByRole("heading", { name: "No chapters found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all chapters" }).click();
  await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
});

for (const chapter of chapters) {
  test(`MH ${chapter.number}: complete source, original headings, tables, references and notices render`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(chapterPath(chapter.slug));
    await expect(page).toHaveTitle(`${chapter.title} — VUGA NDAKUMVA`);
    await expect(page.locator("h1")).toHaveText(chapter.title);
    await expect(page.locator(".mh-reader-version")).toHaveText(
      chapter.editionText!,
    );
    await expect(page.locator(".mh-reader-draft")).toContainText(
      chapter.publicationStatus!,
    );
    await page
      .locator(".mh-article details")
      .evaluateAll((es) =>
        es.forEach((e) => ((e as HTMLDetailsElement).open = true)),
      );
    for (const section of chapter.sections) {
      const target = page.locator(`#${section.id}`);
      await expect(target.locator(":scope > h2")).toContainText(section.title);
      const rendered = norm(await target.innerText());
      for (const s of section.blocks.flatMap(strings))
        expect(rendered, `${section.id}: ${s}`).toContain(norm(s));
    }
    const all = norm(await page.locator(".mh-reader").innerText());
    for (const b of [
      ...chapter.coverBlocks!,
      ...chapter.safetyNotices!,
      ...chapter.goalBlocks!,
      ...chapter.afterGoals!,
    ])
      for (const s of strings(b)) expect(all).toContain(norm(s));
    for (const ref of chapter.references) {
      const item = page.locator(`#reference-${ref.number}`);
      await expect(item.locator("a")).toHaveAttribute("href", ref.url!);
      await expect(item.locator(".mh-reference-number")).toHaveText(ref.label!);
    }
    await expect(page.locator(".mh-example")).toHaveCount(
      chapter.number === 8 ? 4 : 5,
    );
    await expect(
      page.locator(".mh-reader input,.mh-reader textarea,.mh-reader form"),
    ).toHaveCount(0);
    // New source scenarios do not make unsupported AI-image claims.
    await expect(page.locator(".mh-visual-disclosure")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`MH ${chapter.number}: original PDF and every optional activity are downloadable`, async ({
    page,
    request,
  }) => {
    const manifest = JSON.parse(
      await readFile(
        "public/learning/mental-health/source-manifest-08-10.json",
        "utf8",
      ),
    );
    const pdf = await request.get(chapter.pdfUrl);
    expect(pdf.ok()).toBe(true);
    expect(
      createHash("sha256")
        .update(await pdf.body())
        .digest("hex"),
    ).toBe(
      manifest.sources.find((s: any) => s.chapter === chapter.number).sha256,
    );
    const worksheet = await request.get(chapter.worksheetUrl);
    expect(worksheet.ok()).toBe(true);
    const downloaded = norm(await worksheet.text());
    expect(downloaded).toContain("Nothing is submitted");
    const activities = chapter.sections.filter((s) =>
      /^(Guided activity|Guided educational|Five practical)/.test(s.title),
    );
    for (const section of activities)
      for (const s of section.blocks.flatMap(strings))
        expect(downloaded).toContain(norm(s));
    await page.goto(chapterPath(chapter.slug));
    await expect(
      page.getByRole("link", { name: /Download source PDF/ }),
    ).toHaveAttribute("download", "");
    await expect(
      page.getByRole("link", { name: "Download learning activities" }),
    ).toHaveAttribute("href", chapter.worksheetUrl);
  });

  test(`MH ${chapter.number}: optional keyboard answers, private reading and print state restoration`, async ({
    page,
  }) => {
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") posts.push(r.url());
    });
    await page.goto(chapterPath(chapter.slug));
    const before = await page.evaluate(() => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }));
    const answer =
      chapter.number === 8
        ? page.locator("#section-8-18 details")
        : page.locator(".mh-knowledge-check details").first();
    await expect(answer).not.toHaveAttribute("open", "");
    await answer.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(answer).toHaveAttribute("open", "");
    const details = page.locator(".mh-article details");
    const states = await details.evaluateAll((es) =>
      es.map((e) => (e as HTMLDetailsElement).open),
    );
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    expect(
      await details.evaluateAll((es) =>
        es.every((e) => (e as HTMLDetailsElement).open),
      ),
    ).toBe(true);
    await page.evaluate(() => dispatchEvent(new Event("afterprint")));
    expect(
      await details.evaluateAll((es) =>
        es.map((e) => (e as HTMLDetailsElement).open),
      ),
    ).toEqual(states);
    expect(
      await page.evaluate(() => ({
        local: { ...localStorage },
        session: { ...sessionStorage },
      })),
    ).toEqual(before);
    expect(posts).toEqual([]);
  });
}

test("new chapters continue from Grief; R-prefixed citations and direct anchors preserve history", async ({
  page,
}) => {
  await page.goto(chapterPath(mentalHealthChapters[6].slug));
  for (const c of chapters) {
    await page
      .getByRole("navigation", { name: "Chapter navigation" })
      .getByRole("link", { name: /NEXT CHAPTER/ })
      .click();
    await expect(page.locator("h1")).toHaveText(c.title);
  }
  await expect(
    page
      .getByRole("navigation", { name: "Chapter navigation" })
      .getByRole("link", { name: /THE SERIES CONTINUES/ }),
  ).toHaveAttribute("href", "/why-mental-health");
  await page.goto(`${chapterPath(chapters[2].slug)}#section-10-1`);
  await expect(page.locator("#section-10-1")).toBeFocused();
  const citation = page
    .locator("#section-10-1")
    .getByRole("link", { name: "Reference R1", exact: true })
    .first();
  await expect(citation).toHaveText("R1");
  await citation.click();
  await expect(page.locator("#reference-1")).toBeFocused();
  await expect(page.locator("#reference-1 .mh-reference-number")).toHaveText(
    "[R1]",
  );
  await page.goBack();
  await expect(page.locator("#section-10-1")).toBeFocused();
  await page.goForward();
  await expect(page.locator("#reference-1")).toBeFocused();
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`new readers preserve source order, focus and overflow at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const chapter of chapters) {
      await page.goto(chapterPath(chapter.slug));
      if (width <= 1100) await page.locator(".mh-contents-toggle").click();
      const nav = page.getByRole("navigation", { name: "Chapter contents" });
      const target = chapter.sections.at(-1)!;
      await nav.locator(`a[href$="#${target.id}"]`).click();
      await expect(page.locator(`#${target.id}`)).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      expect(
        await page
          .locator(".mh-contents nav > a")
          .evaluateAll((es) =>
            es.every((e) => e.scrollHeight <= e.clientHeight + 1),
          ),
      ).toBe(true);
      await expect(
        page.locator(".mh-article [data-chapter-section]"),
      ).toHaveCount(chapter.sections.length + 1);
    }
  });
}
