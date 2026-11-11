import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gbvChapters } from "../src/learning/gbv/chapters";
import { gbvContinuationChapters as chapters } from "../src/learning/gbv/chapters-04-10.generated";
import type { ChapterBlock } from "../src/learning/types";

const route = (slug: string) => `/understand-gbv/${slug}`;
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
function strings(b: ChapterBlock): string[] {
  if (b.type === "list") return b.items;
  if (b.type === "table") return [...b.headers, ...b.rows.flat()];
  if (b.type === "questions")
    return b.items.flatMap((q) => [q.question, q.answer, q.answerLabel || ""]);
  if (
    b.type === "example" ||
    b.type === "subsection" ||
    b.type === "disclosure"
  )
    return [b.title, ...b.blocks.flatMap(strings)];
  if (b.type === "references") return [b.sourceText];
  return [b.text];
}
test("all 73 source pages are audited and ten chapters stay in numeric order", async ({
  page,
}) => {
  const audit = JSON.parse(
    await readFile("artifacts/gbv-continuation/source-audit.json", "utf8"),
  );
  expect(audit.chapters.map((c: any) => c.pages)).toEqual([
    9, 9, 9, 14, 12, 10, 10,
  ]);
  expect(audit.chapters.map((c: any) => c.numberedSections)).toEqual([
    17, 17, 18, 23, 18, 20, 20,
  ]);
  expect(
    audit.chapters.reduce((sum: number, c: any) => sum + c.scenarios, 0),
  ).toBe(34);
  expect(
    audit.chapters.reduce((sum: number, c: any) => sum + c.references, 0),
  ).toBe(52);
  for (const c of audit.chapters) {
    expect(
      c.frontMatterPreserved &&
        c.independentPypdfCoverage &&
        c.downloadHashMatch,
    ).toBe(true);
    expect(c.questions).toBe(10);
    expect(c.activities).toBe(5);
    for (const s of c.sections) expect(s.orderedContentPreserved).toBe(true);
  }
  expect(gbvChapters.map((c) => c.number)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  await page.goto("/understand-gbv");
  await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
  await expect(page.locator(".gbv-library-meta")).toContainText(
    "10 chapters · 192 sections",
  );
  for (const c of gbvChapters)
    await expect(
      page.locator(`.mh-chapter-card a[href="${route(c.slug)}"]`),
    ).toHaveCount(1);
  await expect(
    page.locator(".support-photo-note").filter({ hasText: "Chapters 1–10" }),
  ).toContainText("further chapters");
});

for (const chapter of chapters) {
  test(`GBV ${chapter.number}: every source block, reference marker, scenario and answer renders`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(route(chapter.slug));
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
      const rendered = norm(await page.locator(`#${section.id}`).innerText());
      for (const s of section.blocks.flatMap(strings))
        expect(rendered, `${section.id}: ${s}`).toContain(norm(s));
    }
    const all = norm(await page.locator(".mh-reader").innerText());
    for (const b of [
      ...chapter.coverBlocks!,
      ...chapter.introductionBlocks!,
      ...chapter.safetyNotices!,
      ...chapter.goalBlocks!,
      ...chapter.afterGoals!,
    ]) {
      for (const s of strings(b)) expect(all).toContain(norm(s));
    }
    for (const ref of chapter.references) {
      const item = page.locator(`#reference-${ref.number}`);
      await expect(item.locator("a")).toHaveAttribute("href", ref.url!);
      if (ref.label)
        await expect(item.locator(".mh-reference-number")).toHaveText(
          ref.label,
        );
      else await expect(item.locator(".mh-reference-number")).toHaveCount(0);
    }
    await expect(page.locator(".mh-knowledge-check details")).toHaveCount(10);
    await expect(
      page.locator(".mh-reader input,.mh-reader textarea,.mh-reader form"),
    ).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`GBV ${chapter.number}: exact source download and complete optional activities`, async ({
    page,
    request,
  }) => {
    const manifest = JSON.parse(
      await readFile("public/learning/gbv/source-manifest-04-10.json", "utf8"),
    );
    const response = await request.get(chapter.pdfUrl);
    expect(response.ok()).toBe(true);
    expect(
      createHash("sha256")
        .update(await response.body())
        .digest("hex"),
    ).toBe(
      manifest.sources.find((s: any) => s.chapter === chapter.number).sha256,
    );
    const worksheet = await request.get(chapter.worksheetUrl);
    expect(worksheet.ok()).toBe(true);
    const content = await worksheet.text();
    expect(content).toContain("Nothing is submitted");
    const activity = chapter.sections.find(
      (s) => s.number === chapter.reflectionSection,
    )!;
    for (const s of activity.blocks.flatMap(strings))
      expect(norm(content)).toContain(norm(s));
    await page.goto(route(chapter.slug));
    await expect(
      page.getByRole("link", { name: /Download source PDF/ }),
    ).toHaveAttribute("download", "");
    await expect(page.locator(".mh-worksheet-download")).toHaveAttribute(
      "href",
      chapter.worksheetUrl,
    );
  });

  test(`GBV ${chapter.number}: optional keyboard answers and print restoration collect no responses`, async ({
    page,
  }) => {
    const submissions: string[] = [];
    page.on("request", (r) => {
      if (!["GET", "HEAD"].includes(r.method())) submissions.push(r.url());
    });
    await page.goto(route(chapter.slug));
    const initial = await page.evaluate(() => [
      JSON.stringify(localStorage),
      JSON.stringify(sessionStorage),
    ]);
    const answer = page.locator(".mh-knowledge-check details").first();
    await answer.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(answer).toHaveAttribute("open", "");
    const ds = page.locator(".mh-article details");
    const before = await ds.evaluateAll((es) =>
      es.map((e) => (e as HTMLDetailsElement).open),
    );
    await page.evaluate(() => {
      dispatchEvent(new Event("beforeprint"));
      dispatchEvent(new Event("beforeprint"));
    });
    expect(
      await ds.evaluateAll((es) =>
        es.every((e) => (e as HTMLDetailsElement).open),
      ),
    ).toBe(true);
    await page.evaluate(() => dispatchEvent(new Event("afterprint")));
    expect(
      await ds.evaluateAll((es) =>
        es.map((e) => (e as HTMLDetailsElement).open),
      ),
    ).toEqual(before);
    expect(
      await page.evaluate(() => [
        JSON.stringify(localStorage),
        JSON.stringify(sessionStorage),
      ]),
    ).toEqual(initial);
    expect(submissions).toEqual([]);
  });
}

test("chapter navigation, citations and browser history retain the correct subject", async ({
  page,
}) => {
  await page.goto(route(gbvChapters[2].slug));
  for (const chapter of chapters) {
    await page
      .getByRole("navigation", { name: "Chapter navigation" })
      .getByRole("link", { name: /NEXT CHAPTER/ })
      .click();
    await expect(page.locator("h1")).toHaveText(chapter.title);
    await expect(
      page
        .getByRole("navigation", { name: "Chapter navigation" })
        .getByRole("link", { name: /PREVIOUS CHAPTER/ }),
    ).toHaveAttribute("href", route(gbvChapters[chapter.number - 2].slug));
  }
  await expect(
    page.getByRole("link", { name: /THE SERIES CONTINUES/ }),
  ).toHaveAttribute("href", "/understand-gbv");
  await page.goBack();
  await expect(page.locator("h1")).toHaveText(chapters[5].title);
  const citation = page.locator(".mh-inline-citations a").first();
  const href = await citation.getAttribute("href");
  await citation.click();
  await expect(page.locator(href!.slice(href!.indexOf("#")))).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(chapters[5].slug + "$"));
  await page.goForward();
  await expect(page).toHaveURL(new RegExp("#reference-"));
});

for (const width of [375, 768, 1024, 1440, 1920])
  test(`continuation readers and mobile index fit ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/understand-gbv");
    await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
    for (const chapter of chapters) {
      const id = chapter.sections[7].id;
      await page.goto(route(chapter.slug) + "#" + id);
      await expect(page.locator("#" + id)).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const header = await page.getByRole("banner").boundingBox();
      const target = await page.locator("#" + id).boundingBox();
      expect(target!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
      if (width <= 1100) await page.locator(".gbv-mobile-tools button").click();
      expect(
        await page
          .locator(".mh-contents nav > a")
          .evaluateAll((links) =>
            links.every((link) => link.scrollHeight <= link.clientHeight + 1),
          ),
      ).toBe(true);
      const link = page
        .getByRole("navigation", {
          name: width <= 1100 ? "Mobile chapter contents" : "Chapter contents",
        })
        .locator(`a[href$="#${chapter.sections[2].id}"]`);
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#" + chapter.sections[2].id)).toBeFocused();
      if (width <= 1100)
        await expect(page.locator(".gbv-mobile-tools button")).toHaveAttribute(
          "aria-expanded",
          "false",
        );
    }
  });
