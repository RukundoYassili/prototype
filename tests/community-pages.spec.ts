import { test, expect } from "@playwright/test";

test("public community presents labelled demos and hides unpublished drafts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Community", exact: true }),
  ).toHaveAttribute("href", "/community");
  await page
    .locator("#community")
    .getByRole("link", { name: "Explore our community work" })
    .click();
  await expect(page).toHaveTitle("Community — VUGA NDAKUMVA");
  await expect(
    page.getByRole("complementary", { name: "Demo content" }),
  ).toContainText("A preview of what’s possible");
  await expect(page.locator(".community-featured-card")).toHaveCount(1);
  await expect(page.locator("#community-watch .community-entry")).toHaveCount(
    2,
  );
  await expect(
    page.locator("#community-upcoming .community-entry"),
  ).toHaveCount(2);
  await expect(page.locator("#community-stories .community-entry")).toHaveCount(
    3,
  );
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    7,
  );
  await expect(page.locator(".community-demo-badge")).toHaveCount(15);
  await expect(page.locator("video, iframe")).toHaveCount(0);
  await expect(page.locator("#newsletter")).toHaveCount(1);
  for (const slug of [
    "community-conversations",
    "healthy-boundaries",
    "missing",
  ]) {
    await page.goto(`/community/${slug}`);
    await expect(
      page.getByRole("heading", { name: "This update isn’t here." }),
    ).toBeVisible();
    await expect(page).toHaveTitle("Community update not found — VUGA NDAKUMVA");
  }
});

test("legacy templates remain available only in explicit development previews", async ({
  page,
}) => {
  await page.goto("/community?preview=templates&type=workshops&q=boundaries");
  await expect(page.locator(".community-publishing-note")).toContainText(
    "Development preview",
  );
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    1,
  );
  await page.locator(".community-entry-link").click();
  await expect(page).toHaveURL(/healthy-boundaries\?preview=templates$/);
  await expect(page.locator(".community-detail-template")).toContainText(
    "Content template",
  );
  await expect(page.locator(".community-practical")).toContainText(
    "Not open for registration",
  );
  await expect(
    page.getByRole("link", { name: "Registration details", exact: true }),
  ).toHaveCount(0);
  await page
    .locator(".community-related .community-entry-link")
    .first()
    .click();
  await page
    .getByRole("link", { name: "Back to community", exact: true })
    .click();
  await expect(page).toHaveURL(
    /preview=templates&type=workshops&q=boundaries$/,
  );
  await expect(
    page.getByRole("searchbox", { name: "Search community" }),
  ).toHaveValue("boundaries");
});

test("public filters support direct URLs, empty results, reset and browser history", async ({
  page,
}) => {
  await page.goto("/community");
  const filters = page.getByRole("group", { name: "Community content type" });
  await filters.getByRole("button", { name: "Videos", exact: true }).click();
  await expect(page).toHaveURL(/type=videos$/);
  await filters
    .getByRole("button", { name: "Photo albums", exact: true })
    .click();
  await page.goBack();
  await expect(
    filters.getByRole("button", { name: "Videos", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const search = page.getByRole("searchbox", { name: "Search community" });
  await search.fill("no matching content");
  await expect(
    page.getByRole("heading", { name: "A different search might help." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear community search" }).click();
  await expect(search).toBeFocused();
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page).toHaveURL(/\/community$/);
  await page.goto("/community?type=unknown&topic=unknown");
  await expect(page.locator(".community-entry")).toHaveCount(0);
  await page.getByRole("button", { name: "Show all updates" }).click();
  await expect(page).toHaveURL(/\/community$/);
});

for (const width of [375, 768, 1440]) {
  test(`public community fits ${width}px and does not collect browsing data`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const posts: string[] = [];
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    await page.goto("/community");
    await page
      .getByRole("navigation", { name: "Explore community categories" })
      .getByRole("link", { name: "Videos", exact: false })
      .click();
    await expect(page.locator("#community-updates")).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
    expect(posts).toEqual([]);
    expect(errors).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/community-hub-${width}.png`,
      fullPage: true,
    });
  });
}
