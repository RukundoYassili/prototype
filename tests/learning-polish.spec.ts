import { test, expect } from "@playwright/test";
import {
  mentalHealthChapters as allChapters,
  chapterPath,
} from "../src/learning/chapters";
import { visualStories } from "../src/learning/visuals";
const mentalHealthChapters = allChapters.filter(
  (chapter) => chapter.number <= 2,
);

test("source example headings label visual groups without duplicated supplemental titles", async ({
  page,
}) => {
  for (const chapter of mentalHealthChapters) {
    await page.goto(chapterPath(chapter.slug));
    await expect(page.locator(".mh-learning-note")).toHaveCount(1);
    await expect(page.locator(".mh-learning-note")).toContainText(
      "Nothing to submit",
    );
    await expect(page.locator(".lv-freedom")).toHaveCount(0);
    for (const story of visualStories.filter(
      (story) => story.chapterSlug === chapter.slug,
    )) {
      // The visual group itself carries the source association.
      const visual = page.locator(`[data-visual-id="${story.id}"]`);
      await expect(visual).toHaveAttribute("role", "group");
      const id = await visual.getAttribute("aria-labelledby");
      expect(id).toBeTruthy();
      const heading = page.locator(`[id="${id}"]`);
      if (story.sourceExample) {
        await expect(heading).toContainText(story.sourceExample);
        await expect(visual.locator("h3,h4")).toHaveCount(0);
      } else await expect(heading).toHaveText(story.title);
      await expect(visual).toContainText("AI-generated");
      await expect(visual.locator(".lv-scene")).toHaveCount(2);
    }
  }
});

test("desktop current-section tracking scrolls only the contents panel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(chapterPath(mentalHealthChapters[1].slug));
  const nav = page.getByRole("navigation", { name: "Chapter contents" });
  for (const section of ["section-2-17", "section-2-18", "section-2-3"]) {
    const top = await page.locator(`#${section}`).evaluate((element) => {
      const target = element.getBoundingClientRect().top + scrollY - 155;
      window.scrollTo({ top: target, behavior: "instant" });
      return target;
    });
    const current = nav.locator(`a[href$="#${section}"]`);
    await expect(current).toHaveAttribute("aria-current", "location");
    await expect
      .poll(async () =>
        current.evaluate((element) => {
          const panel = element.closest("nav")!;
          const rect = element.getBoundingClientRect();
          const bounds = panel.getBoundingClientRect();
          return rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1;
        }),
      )
      .toBe(true);
    expect(Math.abs((await page.evaluate(() => scrollY)) - top)).toBeLessThan(
      2,
    );
    expect(
      await current.evaluate(
        (element) => element.getBoundingClientRect().height,
      ),
    ).toBeGreaterThanOrEqual(44);
  }
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`polished library and reader maintain typography, crops, and alignment at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/why-mental-health");
    await expect(page.locator(".mh-card-visuals")).toHaveCount(
      allChapters.length,
    );
    await expect(page.locator(".mh-card-visuals").first()).toContainText(
      "Visual examples",
    );
    if (width >= 768) {
      const actions = await page
        .locator(".mh-card-action")
        .evaluateAll((elements) =>
          elements.map((element) => element.getBoundingClientRect().top),
        );
      expect(Math.abs(actions[0] - actions[1])).toBeLessThan(2);
    }
    for (const chapter of mentalHealthChapters) {
      await page.goto(chapterPath(chapter.slug));
      await expect(page.locator(".lv-story").first()).toBeAttached();
      const textSize = await page
        .locator("#section-1-1 > p, #section-2-1 > p")
        .first()
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      expect(textSize).toBeGreaterThanOrEqual(width === 375 ? 15 : 16);
      for (const frame of await page.locator(".lv-scene-image").all()) {
        const bounds = await frame.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.width / bounds!.height).toBeCloseTo(
          width === 375 ? 1.5 : 4 / 3,
          1,
        );
      }
      expect(
        await page
          .locator(".lv-scene figcaption p")
          .first()
          .evaluate((element) =>
            parseFloat(getComputedStyle(element).fontSize),
          ),
      ).toBeGreaterThanOrEqual(14);
      for (const label of [
        ".lv-fictional",
        ".lv-scene-label",
        ".lv-step-number",
        ".lv-eyebrow",
      ]) {
        expect(
          await page
            .locator(label)
            .first()
            .evaluate((element) =>
              parseFloat(getComputedStyle(element).fontSize),
            ),
        ).toBeGreaterThanOrEqual(12);
      }
      const checkin = page.locator('[data-visual-id="emotional-check-in"]');
      if (chapter.number === 2) {
        const positions = await checkin
          .locator(".lv-steps > li")
          .evaluateAll((elements) =>
            elements.map((element) => {
              const rect = element.getBoundingClientRect();
              return { x: rect.x, y: rect.y };
            }),
          );
        for (let index = 1; index < positions.length; index++) {
          expect(positions[index].y).toBeGreaterThan(positions[index - 1].y);
          expect(Math.abs(positions[index].x - positions[0].x)).toBeLessThan(1);
        }
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  });
}
