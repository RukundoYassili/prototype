import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { mentalHealthChapters, chapterPath } from "../src/learning/chapters";
import { visualStories, learningDiagrams } from "../src/learning/visuals";

test("all scene assets have provenance, distinct sources, and correctly sized local variants", async () => {
  const manifest = JSON.parse(
    await readFile("public/images/learning/provenance.json", "utf8"),
  );
  expect(manifest.tool).toBe("Built-in image_gen");
  expect(manifest.scenes).toHaveLength(visualStories.length * 2);
  expect(
    new Set(manifest.scenes.map((scene: { sha256: string }) => scene.sha256))
      .size,
  ).toBe(visualStories.length * 2);
  const expectedIds = visualStories.flatMap((story) => [
    `${story.id}-situation`,
    `${story.id}-support`,
  ]);
  expect(
    manifest.scenes.map((scene: { id: string }) => scene.id).sort(),
  ).toEqual(expectedIds.sort());
  for (const scene of manifest.scenes) {
    const source = await readFile(scene.source);
    expect(createHash("sha256").update(source).digest("hex")).toBe(
      scene.sha256,
    );
    expect(scene.prompt.toLowerCase()).toContain("fictional");
    for (const output of scene.outputs) {
      const meta = await sharp(`public${output.file}`).metadata();
      expect(meta.width).toBe(output.width);
      expect(meta.height).toBe(output.height);
      expect(meta.format).toBe("webp");
    }
  }
});

for (const chapter of mentalHealthChapters) {
  test(`chapter ${chapter.number} places complete visual stories and diagrams with their source lessons`, async ({
    page,
  }) => {
    await page.goto(chapterPath(chapter.slug));
    const stories = visualStories.filter(
      (story) => story.chapterSlug === chapter.slug,
    );
    const diagrams = learningDiagrams.filter(
      (diagram) => diagram.chapterSlug === chapter.slug,
    );
    await expect(page.locator(".lv-story")).toHaveCount(stories.length);
    await expect(page.locator(".lv-diagram")).toHaveCount(diagrams.length);
    for (const story of stories) {
      const block = page.locator(
        `#${story.sectionId} [data-visual-id="${story.id}"]`,
      );
      await expect(block).toContainText("Illustrative fictional example.");
      await expect(block.locator(".lv-scene")).toHaveCount(2);
      await expect(block.locator(".lv-explanation")).not.toHaveAttribute(
        "open",
        "",
      );
      for (const scene of story.scenes) {
        await expect(block).toContainText(scene.caption);
        await expect(
          block.getByRole("img", { name: scene.alt, exact: true }),
        ).toHaveAttribute("loading", "lazy");
      }
      if (story.sourceExample)
        await expect(block.locator("..")).toHaveClass("mh-example");
    }
    for (const diagram of diagrams) {
      const block = page.locator(
        `#${diagram.sectionId} [data-visual-id="${diagram.id}"]`,
      );
      await expect(block).toHaveAccessibleName(diagram.title);
      await expect(block).toContainText(diagram.note);
      for (const step of diagram.steps) {
        await expect(block).toContainText(step.title);
        await expect(block).toContainText(step.text);
      }
    }
    await page.locator(".lv-scene img").evaluateAll(async (images) => {
      await Promise.all(
        images.map(async (element) => {
          const image = element as HTMLImageElement;
          image.loading = "eager";
          await image.decode();
        }),
      );
    });
    expect(
      await page
        .locator(".lv-scene img")
        .evaluateAll((images) =>
          images.every(
            (element) => (element as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    await expect(
      page.locator(
        ".lv-visual input, .lv-visual textarea, .lv-visual form, .lv-visual button",
      ),
    ).toHaveCount(0);
  });
}

test("explanations are optional keyboard disclosures with no submissions, storage, or forced progression", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") posts.push(request.url());
  });
  await page.goto(chapterPath(mentalHealthChapters[0].slug));
  const story = page.locator('[data-visual-id="exam-pressure"]');
  const details = story.locator("details");
  const toggle = details.locator("summary");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await expect(details.locator("p")).toHaveText(visualStories[0].explanation);
  await page.keyboard.press("Space");
  await expect(details).not.toHaveAttribute("open", "");
  await expect(story.locator(".lv-reflection")).toContainText(
    visualStories[0].reflection,
  );
  await expect(page.locator(".mh-learning-note")).toContainText(
    "Nothing to submit",
  );
  await page.locator(".mh-chapter-pagination a").last().click();
  await expect(page).toHaveURL(chapterPath(mentalHealthChapters[1].slug));
  await page.goBack();
  await expect(page.locator('[data-visual-id="exam-pressure"]')).toBeAttached();
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    })),
  ).toEqual({ local: [], session: [] });
});

test("a failed scene retains its description, teaching caption, and explanation", async ({
  page,
}) => {
  await page.route(
    "**/images/learning/exam-pressure-situation-*.webp",
    (route) => route.abort(),
  );
  await page.goto(`${chapterPath(mentalHealthChapters[0].slug)}#section-1-12`);
  const scene = page
    .locator('[data-visual-id="exam-pressure"] .lv-scene')
    .first();
  await scene.scrollIntoViewIfNeeded();
  await expect(scene.getByRole("status")).toContainText("Image unavailable");
  await expect(scene.locator(".lv-scene-description")).toHaveText(
    visualStories[0].scenes[0].alt,
  );
  await expect(scene).toContainText(visualStories[0].scenes[0].caption);
});

test("printing includes all visual explanations and restores the reader’s selected disclosure state", async ({
  page,
}) => {
  await page.goto(chapterPath(mentalHealthChapters[1].slug));
  await expect(page.locator(".lv-explanation")).toHaveCount(12);
  await page
    .locator(".lv-explanation")
    .first()
    .evaluate((element) => ((element as HTMLDetailsElement).open = true));
  await page.evaluate(() => {
    window.print = () => window.dispatchEvent(new Event("beforeprint"));
  });
  await page
    .getByRole("button", { name: "Print chapter", exact: true })
    .click();
  expect(
    await page
      .locator(".lv-explanation")
      .evaluateAll((elements) =>
        elements.every((element) => (element as HTMLDetailsElement).open),
      ),
  ).toBe(true);
  await page.emulateMedia({ media: "print" });
  expect(
    await page
      .locator(".lv-visual")
      .evaluateAll((elements) =>
        elements.every(
          (element) => getComputedStyle(element).breakInside === "avoid",
        ),
      ),
  ).toBe(true);
  await expect(page.getByRole("banner")).toBeHidden();
  await expect(
    page.locator(".lv-explanation").last().locator("p"),
  ).toBeVisible();
  expect(
    await page
      .locator(".lv-scene")
      .evaluateAll((elements) =>
        elements.every(
          (element) => getComputedStyle(element).breakInside === "avoid",
        ),
      ),
  ).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  expect(
    await page
      .locator(".lv-explanation")
      .evaluateAll((elements) =>
        elements.map((element) => (element as HTMLDetailsElement).open),
      ),
  ).toEqual([true, ...Array(11).fill(false)]);
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`visual lessons remain readable and ordered at ${width}px with reduced motion`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const chapter of mentalHealthChapters) {
      await page.goto(chapterPath(chapter.slug));
      await expect(page.locator(".lv-story").first()).toBeAttached();
      await page.locator(".lv-scene img").evaluateAll(async (images) => {
        await Promise.all(
          images.map(async (element) => {
            const image = element as HTMLImageElement;
            image.loading = "eager";
            await image.decode();
          }),
        );
      });
      const bounds = await page
        .locator(".lv-story")
        .first()
        .locator(".lv-scene")
        .evaluateAll((elements) =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width };
          }),
        );
      if (width === 375) {
        expect(bounds[1].y).toBeGreaterThan(bounds[0].y);
        expect(Math.abs(bounds[1].x - bounds[0].x)).toBeLessThan(1);
      } else {
        expect(Math.abs(bounds[1].y - bounds[0].y)).toBeLessThan(1);
        expect(bounds[1].x).toBeGreaterThan(bounds[0].x);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      expect(
        await page
          .locator(".lv-visual")
          .evaluateAll((elements) =>
            elements.every(
              (element) => element.scrollWidth <= element.clientWidth + 1,
            ),
          ),
      ).toBe(true);
      expect(
        await page
          .locator(".lv-visual")
          .evaluateAll((elements) =>
            elements.every((element) =>
              element
                .getAnimations({ subtree: true })
                .every((animation) => animation.playState !== "running"),
            ),
          ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
