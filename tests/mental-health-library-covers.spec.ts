import { test, expect } from "@playwright/test";
import { mentalHealthChapters } from "../src/learning/chapters";
import { mentalHealthCovers } from "../src/learning/mental-health-covers";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

test("ten covers preserve the complete catalog and its existing source metadata", async ({
  page,
}) => {
  await page.goto("/why-mental-health");
  const cards = page.locator(".mh-chapter-card");
  await expect(cards).toHaveCount(mentalHealthChapters.length);
  await expect(page.locator(".mh-center-overview")).toContainText(
    `${mentalHealthChapters.reduce((total, c) => total + c.sections.length, 0)} sections`,
  );
  expect(
    mentalHealthChapters.find((c) => c.number === 7)?.sections,
  ).toHaveLength(20);
  for (const [index, chapter] of mentalHealthChapters.entries()) {
    const card = cards.nth(index);
    await expect(card.locator("h3")).toHaveText(chapter.title);
    await expect(card.locator(".mh-card-body > p")).toHaveText(chapter.summary);
    await expect(card.locator(".mh-card-time")).toHaveText(chapter.studyTime);
    await expect(card.locator(".mh-card-meta")).toContainText(
      `${chapter.sections.length} sections`,
    );
    await expect(card.locator(".mh-card-meta")).toContainText(
      "English · Educational draft",
    );
    await expect(card.locator("img")).toHaveAttribute(
      "data-chapter-cover",
      chapter.slug,
    );
    await expect(card.locator("img")).toHaveAttribute(
      "alt",
      mentalHealthCovers[chapter.slug].alt,
    );
    await expect(card.locator("img")).toHaveAttribute("loading", "lazy");
  }
  await expect(page.locator(".mh-cover-note")).toContainText("AI-generated");
  await expect(page.locator(".mh-cover-note")).not.toContainText("Photography");
  await expect(page.locator(".mh-draft-note")).toContainText(
    "have not been clinically reviewed",
  );
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`all ten covers remain intact with aligned actions at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/why-mental-health");
    await expect(page.locator(".mh-cover-illustration")).toHaveCount(10);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll<HTMLImageElement>(".mh-library img")].map(
          (img) => {
            img.loading = "eager";
            return img.decode();
          },
        ),
      );
    });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      images: [
        ...document.querySelectorAll<HTMLImageElement>(
          ".mh-cover-illustration",
        ),
      ].map((img) => ({
        loaded: img.naturalWidth > 0,
        aspectRatio: img.clientWidth / img.clientHeight,
        fit: getComputedStyle(img).objectFit,
        transform: getComputedStyle(img).transform,
        transition: getComputedStyle(img).transitionDuration,
        reserved: img.hasAttribute("width") && img.hasAttribute("height"),
      })),
      cards: [...document.querySelectorAll(".mh-chapter-card")].map((card) => ({
        top: card.getBoundingClientRect().top,
        bottom: card.getBoundingClientRect().bottom,
        actionTop: card
          .querySelector(".mh-card-action")!
          .getBoundingClientRect().top,
      })),
    }));
    expect(layout.overflow).toBe(false);
    for (const img of layout.images) {
      expect(img.loaded && img.reserved).toBe(true);
      expect(img.aspectRatio).toBeCloseTo(1.5, 1);
      expect(img.fit).toBe("contain");
      expect(img.transform).toBe("none");
      expect(img.transition).toBe("0s");
    }
    const columns = width >= 1180 ? 3 : width > 650 ? 2 : 1;
    for (let index = 0; index < layout.cards.length; index += columns) {
      const row = layout.cards.slice(index, index + columns);
      for (const card of row.slice(1)) {
        expect(Math.abs(row[0].top - card.top)).toBeLessThan(2);
        expect(Math.abs(row[0].actionTop - card.actionTop)).toBeLessThan(2);
        expect(Math.abs(row[0].bottom - card.bottom)).toBeLessThan(2);
      }
      if (index + columns < layout.cards.length)
        expect(layout.cards[index + columns].top).toBeGreaterThan(
          row[0].bottom,
        );
    }
    const output = "artifacts/mental-health-library-ten/after";
    await mkdir(output, { recursive: true });
    await page.screenshot({
      path: `${output}/library-${width}.png`,
      fullPage: true,
    });
    await page
      .locator(".mh-library-hero")
      .screenshot({ path: `${output}/hero-${width}.png` });
    for (const index of [7, 8, 9])
      await page
        .locator(".mh-chapter-card")
        .nth(index)
        .screenshot({ path: `${output}/chapter-${index + 1}-${width}.png` });
    expect(errors).toEqual([]);
    await writeFile(
      `${output}/layout-${width}.json`,
      JSON.stringify({ width, ...layout, errors }, null, 2),
    );
  });
}

test("search, reset, chapter navigation and browser history work with the covers", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/why-mental-health");
  const search = page.getByRole("searchbox", { name: "Search chapters" });
  await search.fill("a topic that does not exist");
  await expect(
    page.getByRole("heading", { name: "No chapters found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all chapters" }).click();
  await expect(search).toBeFocused();
  for (const chapter of mentalHealthChapters) {
    await search.fill(chapter.title);
    await expect(page.locator(".mh-chapter-card")).toHaveCount(1);
    const link = page.locator(".mh-chapter-card > a");
    await search.focus();
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
      "solid",
    );
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`/why-mental-health/${chapter.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      chapter.title,
    );
    await expect(page.locator("[data-chapter-cover]")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Download source PDF/ }),
    ).toBeVisible();
    await page.goBack();
    await expect(search).toBeVisible();
  }
});

test("Explore the chapters keeps the focused section below the floating header", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/why-mental-health");
    const explore = page.getByRole("link", { name: "Explore the chapters" });
    await explore.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#mental-health-chapters$/);
    await expect(page.locator("#mental-health-chapters")).toBeFocused();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const section = document
            .getElementById("mental-health-chapters")!
            .getBoundingClientRect();
          const header = document
            .querySelector(".site-header")!
            .getBoundingClientRect();
          return section.top >= header.bottom;
        }),
      )
      .toBe(true);
  }
});

test("failed cover requests leave the title, description and chapter link available", async ({
  page,
}) => {
  await page.route("**/images/learning/mental-health-covers/*.webp", (route) =>
    route.abort(),
  );
  await page.goto("/why-mental-health");
  const card = page.locator(".mh-chapter-card").nth(9);
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator("h3")).toHaveText(
    "Child and Adolescent Mental Health",
  );
  await expect(card.locator("img")).toHaveAttribute(
    "alt",
    /child drawing.*adolescent/,
  );
  await expect(card.locator(".mh-card-body > p")).toContainText(
    "age-appropriate care",
  );
  await card.locator("a").click();
  await expect(page).toHaveURL(/child-and-adolescent-mental-health$/);
});

test("Mental Health lessons, downloads and existing assets retain their source bytes", async () => {
  const baseline = JSON.parse(
    await readFile(
      "artifacts/mental-health-library-ten/before/protected-files.json",
      "utf8",
    ),
  );
  for (const [path, expectedHash] of Object.entries(baseline)) {
    // Audit source content and artwork, not historical hashes of unrelated
    // application components that continue to change as the site evolves.
    const mentalHealthSource =
      /^src\/learning\/(?:catalog|chapter-catalog[^/]*|chapters[^/]*)\.ts$/.test(
        path,
      );
    const mentalHealthDownload = path.startsWith(
      "public/learning/mental-health/",
    );
    const mentalHealthArtwork =
      path.startsWith("public/images/learning/") &&
      !path.includes("/gbv") &&
      !path.includes("/alcohol-drugs/");
    if (!mentalHealthSource && !mentalHealthDownload && !mentalHealthArtwork)
      continue;
    expect(
      createHash("sha256")
        .update(await readFile(path))
        .digest("hex"),
      path,
    ).toBe(expectedHash);
  }
});
