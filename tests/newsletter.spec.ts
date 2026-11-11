import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1440]) {
  test(`newsletter is shared, readable, and unavailable without a connection at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    for (const route of ["/", "/services", "/resources"]) {
      await page.goto(route);
      const newsletter = page.locator("#newsletter");
      await expect(newsletter).toHaveCount(1);
      await newsletter.scrollIntoViewIfNeeded();
      await expect(newsletter.getByLabel("Email address")).toBeDisabled();
      await expect(
        newsletter.getByRole("button", { name: "Subscribe", exact: true }),
      ).toBeDisabled();
      await expect(newsletter).toContainText("Signups open soon");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
    }
    await page
      .locator("#newsletter")
      .screenshot({ path: `artifacts/newsletter-${width}.png` });
    expect(posts).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
  });
}
