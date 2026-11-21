import { test, expect } from "@playwright/test";

for (const width of [320, 375, 768, 1440, 1920]) {
  test(`About content and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "Born from the need to be heard." })).toBeVisible();
    await expect(page.locator("#our-story")).toContainText("Founded in 2025 by David Niyomugabo");
    await expect(page.getByText("01 / Our mission")).toBeVisible();
    await expect(page.getByText("02 / Our vision")).toBeVisible();
    const cards = page.locator(".about-team-card");
    await expect(cards).toHaveCount(8);
    await expect(cards.first()).toContainText("David Niyomugabo");
    await expect(cards.last()).toContainText("Gloria hycentha UWIMANA");
    const portraits = page.locator(".about-team-photo img");
    await portraits.evaluateAll(images => {
      images.forEach(image => { (image as HTMLImageElement).loading = "eager"; });
      return Promise.all(images.map(image => (image as HTMLImageElement).decode()));
    });
    expect(await portraits.evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0 && image.getAttribute("alt")))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("About navigation, focus and support links", async ({ page }) => {
  await page.goto("/about");
  const story = page.getByRole("link", { name: "Discover our story" });
  await story.focus();
  await expect(story).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#our-story$/);
  await page.getByRole("link", { name: "Meet the team", exact: true }).click();
  await expect(page).toHaveURL(/#our-team$/);
  await expect(page.getByRole("heading", { name: "Meet our team." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mental health.*Explore this topic/ })).toHaveAttribute("href", "/mental-health");
  await expect(page.getByRole("link", { name: /Understanding GBV.*Explore this topic/ })).toHaveAttribute("href", "/understand-gbv");
  await expect(page.getByRole("link", { name: /Alcohol & drugs.*Explore this topic/ })).toHaveAttribute("href", "/alcohol-and-drugs");
  await expect(page.getByRole("link", { name: "Explore support options" })).toHaveAttribute("href", "/support");
  await expect(page.locator(".about-redesign a[href='/privacy']")).toHaveCount(0);
});
