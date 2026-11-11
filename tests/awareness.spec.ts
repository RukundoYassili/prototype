import { test, expect } from "@playwright/test";
import { loadAwarenessContent } from "../src/awareness/content";
import type { CommunityEntry } from "../src/community/content";

test("only published, approved, confirmed Community entries reach Awareness", () => {
  const activity: CommunityEntry = {
    slug: "confirmed-workshop",
    kind: "workshops",
    title: "Confirmed workshop",
    summary: "A confirmed activity",
    image: "mental-health-group",
    imageAlt: "Group",
    position: "50% 50%",
    template: false,
    illustrative: false,
    publishedAt: "2026-11-11",
    sections: [],
    status: "published",
    mediaApproved: true,
    topics: [],
  };
  expect(loadAwarenessContent([]).activities).toEqual([]);
  const entries: CommunityEntry[] = [
    activity,
    { ...activity, slug: "template", template: true },
    { ...activity, slug: "illustrative", illustrative: true },
    { ...activity, slug: "unpublished", publishedAt: undefined },
    { ...activity, slug: "draft", status: "draft" },
    { ...activity, slug: "unapproved", mediaApproved: false },
  ];
  expect(
    loadAwarenessContent(entries).activities.map((entry) => entry.slug),
  ).toEqual(["confirmed-workshop"]);
});

test("audience actions, disclosures, anchors and privacy", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/awareness");
  await expect(page).toHaveTitle("Awareness — BetterHelp");
  await expect(page.locator("h1")).toHaveText(
    "Understanding starts with a conversation.",
  );
  await expect(page.locator(".awareness-lesson")).toHaveCount(3);
  const content = loadAwarenessContent();
  for (const audience of content.audiences) {
    const button = page.getByRole("button", {
      name: audience.label,
      exact: true,
    });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toBeFocused();
    await expect(page.locator("#awareness-audience-content h3")).toHaveText(
      audience.title,
    );
    await expect(page.locator("#awareness-audience-content li")).toHaveCount(3);
    await expect(page.locator("#awareness-audience-content li")).toHaveText(
      audience.actions,
    );
    await expect(page.locator("#awareness-audience-content p")).toHaveText(
      audience.intro,
    );
  }
  const question = page
    .locator(".awareness-faq summary")
    .filter({ hasText: "Can I take part without sharing my experience?" });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details[open]")).toContainText(
    "There are no answers to submit",
  );
  await page.keyboard.press("Enter");
  for (const faq of content.faqs) {
    const disclosure = page
      .locator(".awareness-faq details")
      .filter({ has: page.getByText(faq.question, { exact: true }) });
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Space");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(disclosure.locator("p")).toHaveText(faq.answer);
    await page.keyboard.press("Space");
    await expect(disclosure).not.toHaveAttribute("open", "");
  }
  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Resources", exact: true })
    .click();
  await expect(page).toHaveURL(/#awareness-resources$/);
  await expect(page.locator("#awareness-resources")).toBeFocused();
  await expect(
    page.locator(".awareness-resource-grid").getByRole("link"),
  ).toHaveCount(6);
  await expect(
    page.getByText("No confirmed activities are published here yet.", {
      exact: false,
    }),
  ).toBeVisible();
  expect(posts).toEqual([]);
  await expect(page.locator(".awareness-review time")).toHaveAttribute(
    "datetime",
    "2026-11-11",
  );
  await expect(page.locator(".awareness-review")).toContainText(
    content.review.label,
  );
  for (const source of content.sources)
    await expect(
      page.locator(".awareness-source").filter({ hasText: source.title }),
    ).toHaveAttribute("href", source.url);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

test("confirmed activities render from the content boundary", async ({
  page,
}) => {
  const activity: CommunityEntry = {
    slug: "confirmed-workshop",
    kind: "workshops",
    title: "Confirmed workshop",
    summary: "Confirmed learning opportunity",
    image: "mental-health-group",
    imageAlt: "Group",
    position: "50% 50%",
    template: false,
    illustrative: false,
    publishedAt: "2026-11-11",
    sections: [],
    status: "published",
    mediaApproved: true,
    topics: [],
  };
  await page.route("**/src/awareness/content.ts*", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    expect(body).toContain("entries = communityEntries");
    await route.fulfill({
      response,
      body: body.replace(
        "entries = communityEntries",
        `entries = ${JSON.stringify([activity])}`,
      ),
    });
  });
  await page.goto("/awareness");
  await expect(
    page.getByRole("link", { name: /Confirmed workshop/ }),
  ).toHaveAttribute("href", "/community/confirmed-workshop");
  await expect(page.locator(".awareness-empty")).toHaveCount(0);
});

test("curated resources and support journeys resolve", async ({ page }) => {
  for (const resource of loadAwarenessContent().resources) {
    await page.goto("/awareness");
    await page
      .locator("#awareness-resources")
      .getByRole("link")
      .filter({
        has: page.getByRole("heading", { name: resource.title, exact: true }),
      })
      .click();
    await expect(page).toHaveURL(new RegExp(resource.to + "$"));
    await expect(page.locator("h1")).not.toContainText("not found");
  }
  await page.goto("/awareness");
  await page
    .getByRole("link", { name: "Explore community activities", exact: true })
    .click();
  await expect(page).toHaveURL(/\/community$/);
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Find support", exact: true })
    .click();
  await expect(page).toHaveURL(/\/support$/);
  await page.goto("/awareness");
  await page
    .locator(".awareness-support")
    .getByRole("link", { name: "Urgent help information", exact: true })
    .click();
  await expect(page).toHaveURL(/\/urgent-help$/);
});

for (const width of [375, 768, 1440]) {
  test(`Awareness layout and images at ${width}px`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/awareness");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((image) => {
          image.loading = "eager";
          return image.decode();
        }),
      );
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".awareness-illustration")).toHaveCount(4);
    await expect(page.locator(".awareness-resource-cover")).toHaveCount(6);
    for (const illustration of await page
      .locator(".awareness-illustration img")
      .all()) {
      await expect(illustration).toHaveCSS("object-fit", "contain");
      expect(
        await illustration.evaluate((img) => {
          const image = img as HTMLImageElement;
          return (
            image.complete &&
            image.naturalWidth > 0 &&
            Math.abs(image.clientWidth / image.clientHeight - 1.5) < 0.02
          );
        }),
      ).toBe(true);
    }
    await expect(
      page.locator(".awareness-illustration-hero figcaption"),
    ).toContainText("not a record of an outreach activity");
    for (const anchor of [
      "awareness-topics",
      "awareness-actions",
      "awareness-campaigns",
      "awareness-resources",
      "awareness-questions",
    ]) {
      await page
        .locator(`.awareness-section-nav a[href$="#${anchor}"]`)
        .click();
      await expect(
        page.locator(`.awareness-section-nav a[href$="#${anchor}"]`),
      ).toHaveAttribute("aria-current", "location");
      await expect(page.locator(`#${anchor}`)).toBeFocused();
    }
    await page
      .getByRole("link", { name: "Explore the topics", exact: true })
      .click();
    await expect
      .poll(() =>
        page
          .locator("#awareness-topics")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(300);
    const positions = await page
      .locator("#awareness-topics")
      .evaluate((element) => ({
        top: element.getBoundingClientRect().top,
        headerBottom:
          document.querySelector(".site-header")?.getBoundingClientRect()
            .bottom || 0,
      }));
    expect(positions.top).toBeGreaterThan(positions.headerBottom);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/awareness/finished-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
