import { test, expect } from "@playwright/test";

test("community hub is linked from the homepage, header, and footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Community", exact: true }),
  ).toHaveAttribute("href", "/community");
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Community, events & workshops" }),
  ).toHaveAttribute("href", "/community");
  await page
    .locator("#community")
    .getByRole("link", { name: "Explore our community work" })
    .click();
  await expect(page).toHaveTitle("Community — BetterHelp");
  await expect(page.locator("meta[name='description']")).toHaveAttribute(
    "content",
    /Community news, outreach stories, events, and workshops/,
  );
  await expect(page.locator(".community-entry")).toHaveCount(6);
  await expect(page.locator(".community-template-badge")).toHaveCount(6);
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Community", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator("#newsletter")).toHaveCount(1);
});

test("combined filters support URLs, browser history, empty results and reset", async ({
  page,
}) => {
  await page.goto("/community");
  const filters = page.getByRole("group", { name: "Community content type" });
  const search = page.getByRole("searchbox", {
    name: "Search community",
    exact: true,
  });
  await filters.getByRole("button", { name: "Workshops", exact: true }).click();
  await expect(page).toHaveURL(/type=workshops$/);
  await expect(page.locator(".community-entry")).toHaveCount(2);
  await search.fill("care");
  await expect(page.locator(".community-entry")).toHaveCount(1);
  await expect(page.locator(".community-entry")).toContainText(
    "Listening with care",
  );
  await page.getByRole("button", { name: "Clear community search" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await filters.getByRole("button", { name: "Events", exact: true }).click();
  await expect(page.locator(".community-entry-events")).toHaveCount(2);
  await page.goBack();
  await expect(
    filters.getByRole("button", { name: "Workshops", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(
    filters.getByRole("button", { name: "Events", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await search.fill("not-a-match-283746");
  await expect(
    page.getByRole("heading", { name: "A different search might help." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all updates" }).click();
  await expect(page).toHaveURL(/\/community$/);
  await expect(page.locator(".community-entry")).toHaveCount(6);
  await page.goto("/community?type=unknown");
  await expect(page.locator(".community-entry")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.locator(".community-entry")).toHaveCount(6);
});

test("category shortcuts keep focus and filtering below the floating header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/community");
  const shortcuts = page.getByRole("navigation", {
    name: "Explore community categories",
  });
  await shortcuts.getByRole("link", { name: /^Workshops/ }).click();
  await expect(page).toHaveURL(/type=workshops#community-updates$/);
  await expect(page.locator("#community-updates")).toBeFocused();
  await expect(page.locator(".community-entry")).toHaveCount(2);
  const filters = page.getByRole("group", { name: "Community content type" });
  await filters.getByRole("button", { name: "News", exact: true }).click();
  await expect(page).toHaveURL(/type=news#community-updates$/);
  await expect(page.locator(".community-entry-news")).toHaveCount(2);
  const before = await page.evaluate(() => window.scrollY);
  await page
    .getByRole("searchbox", { name: "Search community" })
    .fill("outreach");
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - before),
  ).toBeLessThan(10);
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page).toHaveURL(/\/community#community-updates$/);
  await expect(page.locator(".community-entry")).toHaveCount(6);
});

test("detail templates, related content and return journeys preserve selected filters", async ({
  page,
}) => {
  await page.goto("/community?type=workshops&q=care");
  await page.locator(".community-entry-link").click();
  await expect(page).toHaveURL(/\/community\/listening-with-care$/);
  await expect(page).toHaveTitle("Listening with care — BetterHelp");
  await expect(page.locator(".community-detail-template")).toContainText(
    "Confirmed details coming soon",
  );
  await expect(page.locator(".community-practical")).toContainText(
    "To be announced",
  );
  await expect(page.locator(".community-practical")).toContainText(
    "Not open for registration",
  );
  await expect(
    page.getByRole("link", { name: "Registration details", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".community-related .community-entry")).toHaveCount(
    3,
  );
  await page
    .locator(".community-related .community-entry-link")
    .first()
    .click();
  await expect(page).toHaveURL(/\/community\/healthy-boundaries$/);
  await page
    .getByRole("link", { name: "Back to community", exact: true })
    .click();
  await expect(page).toHaveURL(/\/community\?type=workshops&q=care$/);
  await expect(
    page.getByRole("searchbox", { name: "Search community" }),
  ).toHaveValue("care");
  await expect(page.locator(".community-entry")).toHaveCount(1);
});

test("every template has a direct route without booking or submitting data", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  for (const slug of [
    "community-outreach-update",
    "community-voices",
    "community-connection-day",
    "community-conversations",
    "listening-with-care",
    "healthy-boundaries",
  ]) {
    await page.goto(`/community/${slug}`);
    await expect(page.locator(".community-detail-header h1")).toBeVisible();
    await expect(page.locator(".community-detail-template")).toContainText(
      "Content template",
    );
    await expect(page.locator(".community-detail-body > section")).toHaveCount(
      3,
    );
    await expect(
      page.locator(".community-detail-photo figcaption"),
    ).toContainText("Illustrative photography");
    await expect(page.locator(".community-detail form")).toHaveCount(0);
  }
  await page.goto("/community/no-such-entry");
  await expect(
    page.getByRole("heading", { name: "This update isn’t here." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to community", exact: true })
    .click();
  await expect(page).toHaveURL(/\/community$/);
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

for (const width of [375, 768, 1024, 1251, 1440, 1920]) {
  test(`community templates fit ${width}px with accessible navigation and reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of ["/community", "/community/community-connection-day"]) {
      await page.goto(route);
      await expect(
        page.getByRole("button", { name: "Quick exit", exact: true }),
      ).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      if (width > 1250) {
        const brand = await page
          .getByRole("banner")
          .getByRole("link", { name: "BetterHelp home" })
          .boundingBox();
        const nav = await page
          .getByRole("navigation", { name: "Main navigation" })
          .boundingBox();
        const cta = await page
          .getByRole("banner")
          .getByRole("link", { name: "Find support", exact: true })
          .boundingBox();
        expect(brand!.x + brand!.width).toBeLessThan(nav!.x);
        expect(nav!.x + nav!.width).toBeLessThan(cta!.x);
        const last = await page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link")
          .last()
          .boundingBox();
        expect(last!.x + last!.width).toBeLessThan(cta!.x);
      }
    }
    if (width <= 1250) {
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
      const community = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Community", exact: true });
      await expect(community).toHaveAttribute("aria-current", "page");
      await community.click();
      await expect(page).toHaveURL(/\/community$/);
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeHidden();
    } else await page.goto("/community");
    const card = page.locator(".community-entry-link").first();
    await card.focus();
    await card.hover();
    await expect(card.locator("img")).toHaveCSS("transform", "none");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/community\/community-outreach-update$/);
    expect(errors).toEqual([]);
  });
}
