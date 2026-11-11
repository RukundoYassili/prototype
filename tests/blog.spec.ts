import { test, expect } from "@playwright/test";

test("blog is reachable from the homepage, header, and footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".blog-home-section .blog-card")).toHaveCount(3);
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Blog & articles" }),
  ).toHaveAttribute("href", "/blog");
  await page
    .getByRole("button", { name: "Knowledge Hub", exact: true })
    .click();
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(page).toHaveTitle("Blog — BetterHelp");
  await expect(page.locator(".blog-card--featured")).toHaveCount(1);
  await expect(page.locator(".blog-card--standard")).toHaveCount(5);
  await expect(page.getByRole("status")).toContainText("6 articles to explore");
  await expect(
    page.getByRole("button", { name: "Knowledge Hub", exact: true }),
  ).toHaveClass(/active/);
  await page.goBack();
  await page
    .getByRole("link", { name: "View all articles", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("search and topics combine, preserve history, and reset empty results", async ({
  page,
}) => {
  await page.goto("/blog");
  const topics = page.getByRole("group", { name: "Blog topics" });
  const search = page.getByLabel("Search blog", { exact: true });
  await topics
    .getByRole("button", { name: "Mental health", exact: true })
    .click();
  await expect(page).toHaveURL(/topic=mental-health/);
  await expect(page.locator(".blog-card")).toHaveCount(2);
  await expect(page.locator(".blog-card--featured")).toHaveCount(0);
  await search.fill("demanding");
  await expect(page.locator(".blog-card")).toHaveCount(1);
  await expect(page.locator(".blog-card")).toContainText(
    "Making a little space",
  );
  await page
    .getByRole("button", { name: "Clear blog search", exact: true })
    .click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(page.locator(".blog-card")).toHaveCount(2);
  await topics
    .getByRole("button", { name: "Alcohol & drugs", exact: true })
    .click();
  await page.goBack();
  await expect(
    topics.getByRole("button", { name: "Mental health", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(
    topics.getByRole("button", { name: "Alcohol & drugs", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await search.fill("no-match-84726");
  await expect(
    page.getByRole("heading", { name: "A different search might help." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all articles", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.locator(".blog-card")).toHaveCount(6);
  await page.goto("/blog?topic=does-not-exist");
  await expect(
    page.getByRole("heading", { name: "A different search might help." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.locator(".blog-card")).toHaveCount(6);
});

test("reading, article anchors, related posts, and return links preserve discovery", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/blog?topic=mental-health&q=demanding");
  await page.locator(".blog-card-link").click();
  await expect(page).toHaveURL(/\/blog\/a-little-space-in-a-demanding-day$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Making a little space in a demanding day.",
  );
  await expect(page).toHaveTitle(
    "Making a little space in a demanding day. — BetterHelp",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Everyday reflection/,
  );
  const contents = page.getByRole("navigation", { name: "Article contents" });
  await contents
    .getByRole("link", { name: /Sources & further reading/ })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#article-sources")).toBeFocused();
  await expect(
    page
      .locator("#article-sources")
      .getByRole("link", { name: "WHO: understanding stress", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.who.int/news-room/questions-and-answers/item/stress",
  );
  await expect
    .poll(async () => {
      const header = await page.getByRole("banner").boundingBox();
      const source = await page.locator("#article-sources").boundingBox();
      return source!.y >= header!.y + header!.height;
    })
    .toBe(true);
  await expect(page.locator(".blog-related .blog-card")).toHaveCount(2);
  await page.locator(".blog-related .blog-card-link").first().click();
  await expect(page).toHaveURL(/\/blog\/your-first-support-conversation$/);
  await page
    .getByRole("link", { name: "Back to the blog", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog\?topic=mental-health&q=demanding$/);
  await expect(page.getByLabel("Search blog", { exact: true })).toHaveValue(
    "demanding",
  );
  await expect(page.locator(".blog-card")).toHaveCount(1);
});

test("all six article routes contain reading content and source links", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const slug of [
    "your-first-support-conversation",
    "listening-without-having-all-the-answers",
    "alcohol-and-support-without-judgment",
    "understanding-gbv-and-your-options",
    "a-little-space-in-a-demanding-day",
    "finding-your-way-through-substance-use-information",
  ]) {
    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator(".blog-prose")).toBeVisible();
    await expect(page.locator(".blog-lead")).not.toBeEmpty();
    expect(await page.locator(".blog-sources li > a").count()).toBeGreaterThan(
      0,
    );
    await expect(page.locator(".blog-reader-meta")).toContainText(
      /\d+ min read/,
    );
    await expect(
      page.getByRole("link", { name: "Explore related support", exact: true }),
    ).toHaveAttribute(
      "href",
      /^\/support|^\/mental-health|^\/alcohol-and-drugs|^\/understand-gbv/,
    );
  }
});

test("unknown articles have a clear recovery path", async ({ page }) => {
  await page.goto("/blog/not-an-article");
  await expect(page).toHaveTitle("Article not found — BetterHelp");
  await expect(
    page.getByRole("heading", { name: "That article isn’t here." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to the blog", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
});

for (const width of [375, 768, 1024, 1440, 1920])
  test(`blog discovery and reading fit ${width}px with keyboard access and reduced motion`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const errors: string[] = [],
      posts: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "/blog",
      "/blog/your-first-support-conversation",
      "/blog?topic=understand-gbv",
    ]) {
      await page.goto(route);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((image) => {
            image.loading = "eager";
            return image.decode();
          }),
        );
      });
      await expect(
        page.getByRole("button", { name: "Quick exit", exact: true }),
      ).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `artifacts/blog-verified-${route.includes("?") ? "filtered" : route === "/blog" ? "index" : "article"}-${width}.png`,
        fullPage: true,
      });
    }
    const link = page.locator(".blog-card-link").first();
    await link.focus();
    await link.hover();
    await expect(link.locator("img")).toHaveCSS("transform", "none");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/blog\/understanding-gbv-and-your-options$/);
    if (width <= 1250) {
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Knowledge Hub", exact: true })
        .click();
      await expect(
        page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Blog", exact: true }),
      ).toHaveAttribute("aria-current", "page");
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Knowledge Hub", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open navigation", exact: true }),
      ).toBeFocused();
    }
    expect(errors).toEqual([]);
    expect(posts).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
  });
