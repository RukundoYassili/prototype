import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { alcoholChapters } from "../src/learning/alcohol-drugs/chapters.generated";
import {
  alcoholStories,
  alcoholDiagrams,
} from "../src/learning/alcohol-drugs/visuals";

test.use({
  reducedMotion: "reduce",
  launchOptions: { args: ["--disable-gpu"] },
});
test.setTimeout(90000);

test("source inventory, downloads and illustration associations remain intact", () => {
  expect(alcoholChapters.map((c) => c.sections.length)).toEqual([
    15, 11, 20, 17,
  ]);
  const audit = JSON.parse(
    readFileSync("public/learning/alcohol-drugs/source-audit.json", "utf8"),
  );
  for (const source of audit.sources)
    expect(
      createHash("sha256")
        .update(
          readFileSync(`public/learning/alcohol-drugs/${source.filename}`),
        )
        .digest("hex"),
    ).toBe(source.sha256);
  for (const story of alcoholStories) {
    const chapter = alcoholChapters.find((c) => c.slug === story.chapterSlug)!;
    const section = chapter.sections.find((s) => s.id === story.sectionId)!;
    expect(
      section.blocks.some((b) => "id" in b && b.id === story.sourceExampleId),
    ).toBeTruthy();
  }
  expect(alcoholDiagrams).toHaveLength(4);
});

test("landing navigation, synchronized covers and browser history", async ({
  page,
}) => {
  await page.goto("/alcohol-and-drugs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A different next step is possible.",
  );
  const jumps = page.getByRole("navigation", { name: "On this page" });
  await expect(
    jumps.getByRole("link", { name: "Chapters", exact: true }),
  ).toHaveAttribute("href", "#alcohol-chapters");
  for (const label of [
    "Chapters",
    "Understanding",
    "Support options",
    "Official resources",
    "For supporters",
  ]) {
    const link = jumps.getByRole("link", { name: label, exact: true });
    const hash = await link.getAttribute("href");
    await link.click();
    await expect(page.locator(hash!)).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(hash!)
          .evaluate(
            (el) =>
              el.getBoundingClientRect().top -
              (document.querySelector(".site-header")?.getBoundingClientRect()
                .bottom || 0),
          ),
      )
      .toBeGreaterThanOrEqual(0);
  }
  await page.locator(".mh-chapter-card a").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".ad-reader-hero img")).toHaveAttribute(
    "src",
    /cover-01-1440/,
  );
  await page.goBack();
  await expect(page.locator(".mh-chapter-card")).toHaveCount(4);
});

for (const chapter of alcoholChapters)
  test(`chapter ${chapter.number}: illustrations, disclosures, print and privacy`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/alcohol-and-drugs/${chapter.slug}`);
    const story = page.locator(".lv-story");
    await expect(story).toHaveCount(1);
    await story.scrollIntoViewIfNeeded();
    await expect(story.locator(".lv-scene")).toHaveCount(2);
    for (const img of await story.locator("img").all()) {
      await expect(img).toBeVisible();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBeTruthy();
      await expect(img).not.toHaveAttribute("alt", "");
    }
    await expect(story.locator(".lv-fictional")).toContainText("AI-generated");
    await expect(page.locator(".lv-diagram")).toHaveCount(1);
    const explanation = story.locator("summary");
    await explanation.focus();
    await page.keyboard.press("Enter");
    await expect(story.locator("details")).toHaveAttribute("open", "");
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    expect(
      await page
        .locator(".mh-article details")
        .evaluateAll((elements) =>
          elements.every((el) => (el as HTMLDetailsElement).open),
        ),
    ).toBeTruthy();
    await page.emulateMedia({ media: "print" });
    await expect(story.locator(".lv-explanation p")).toBeVisible();
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(story.locator("details")).toHaveAttribute("open", "");
    await expect(
      page.locator(".mh-article input, .mh-article textarea, .mh-article form"),
    ).toHaveCount(0);
    expect(errors).toEqual([]);
  });

test("image failures retain scene descriptions and learning captions", async ({
  page,
}) => {
  await page.route("**/images/learning/alcohol-drugs/**", (route) =>
    route.abort(),
  );
  await page.goto(`/alcohol-and-drugs/${alcoholChapters[2].slug}`);
  await page.locator(".lv-story").scrollIntoViewIfNeeded();
  await expect(page.locator(".lv-scene-description")).toHaveCount(2);
  await expect(page.locator(".lv-scene-description").first()).toContainText(
    "Mireille",
  );
  await expect(page.locator(".ad-reader-hero [role=status]")).toContainText(
    "Illustration unavailable",
  );
});

test("quick exit remains visible and replaces the page on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.route("https://www.google.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Exit destination</title>",
    }),
  );
  await page.goto("/alcohol-and-drugs");
  const button = page.getByRole("button", { name: "Quick exit" });
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute("aria-describedby", "quick-exit-note");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://www.google.com/");
});

for (const width of [375, 768, 1024, 1440, 1920])
  test(`editorial layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const [index, path] of [
      "/alcohol-and-drugs",
      ...alcoholChapters.map((c) => `/alcohol-and-drugs/${c.slug}`),
    ].entries()) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
      if (index === 0) {
        await page.screenshot({
          path: `artifacts/alcohol-editorial/hero-${width}.png`,
          animations: "disabled",
        });
        for (const image of await page.locator(".ad-library img").all()) {
          await image.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              image.evaluate(
                (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
              ),
            )
            .toBeTruthy();
        }
        await page.setViewportSize({
          width,
          height:
            Math.ceil(
              (await page.locator(".ad-library").boundingBox())!.height,
            ) + 400,
        });
        await page.locator(".ad-library").screenshot({
          path: `artifacts/alcohol-editorial/library-${width}.png`,
          style:
            ".site-header-space, .skip-link { visibility: hidden !important; }",
          animations: "disabled",
        });
      } else {
        const story = page.locator(".lv-story");
        await story.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            story
              .locator("img")
              .evaluateAll((images) =>
                images.every(
                  (img) =>
                    (img as HTMLImageElement).complete &&
                    (img as HTMLImageElement).naturalWidth > 0,
                ),
              ),
          )
          .toBeTruthy();
        expect(
          await story
            .locator(".lv-story-scenes")
            .evaluate(
              (el) =>
                getComputedStyle(el).gridTemplateColumns.split(" ").length,
            ),
        ).toBe(width <= 680 ? 1 : 2);
        await page.setViewportSize({
          width,
          height: Math.ceil((await story.boundingBox())!.height) + 400,
        });
        await story.screenshot({
          path: `artifacts/alcohol-editorial/chapter-${index}-story-${width}.png`,
          style:
            ".site-header-space, .skip-link { visibility: hidden !important; }",
          animations: "disabled",
        });
        await page.setViewportSize({
          width,
          height:
            Math.ceil(
              (await page.locator(".lv-diagram").boundingBox())!.height,
            ) + 400,
        });
        await page.locator(".lv-diagram").screenshot({
          path: `artifacts/alcohol-editorial/chapter-${index}-diagram-${width}.png`,
          style:
            ".site-header-space, .skip-link { visibility: hidden !important; }",
          animations: "disabled",
        });
      }
    }
  });
