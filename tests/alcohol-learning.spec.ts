import { test, expect } from "@playwright/test";
import { alcoholChapters } from "../src/learning/alcohol-drugs/chapters.generated";

test("catalog contains four complete chapters and preserves support guidance", async ({
  page,
}) => {
  await page.goto("/alcohol-and-drugs");
  await expect(page.locator(".mh-chapter-card")).toHaveCount(4);
  // Cosmetic ad filters must not hide educational chapter cards.
  await page.addStyleTag({ content: ".ad-cover { display: none !important; }" });
  for (const card of await page.locator(".mh-chapter-card").all())
    await expect(card).toBeVisible();
  await expect(page.locator("#support-options")).toBeVisible();
  await page
    .getByRole("link", { name: "Explore the chapters", exact: true })
    .click();
  await expect(page).toHaveURL(/#alcohol-chapters/);
});

for (const chapter of alcoholChapters) {
  test(`topic ${chapter.number}: complete sections, references, feedback and downloads`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/alcohol-and-drugs/${chapter.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      chapter.title,
    );
    await expect(page).toHaveTitle(
      new RegExp(chapter.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
    for (const section of chapter.sections)
      await expect(page.locator(`#${section.id}`)).toHaveCount(1);
    for (const reference of chapter.references)
      await expect(page.locator(`#reference-${reference.number}`)).toHaveCount(
        1,
      );
    const feedback = page
      .getByText("Read the source feedback", { exact: true })
      .first();
    await feedback.focus();
    await page.keyboard.press("Enter");
    await expect(feedback.locator("..")).toHaveAttribute("open", "");
    for (const url of [chapter.pdfUrl, chapter.worksheetUrl])
      expect((await request.get(url)).ok()).toBeTruthy();
    expect(errors).toEqual([]);
  });
}

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/alcohol-and-drugs",
      ...alcoholChapters.map((c) => `/alcohol-and-drugs/${c.slug}`),
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `artifacts/alcohol-drugs-01-04/${width}-${path.split("/").pop()}.png`,
      });
    }
  });
}
