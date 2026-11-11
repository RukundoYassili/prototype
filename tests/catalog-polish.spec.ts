import { test, expect } from "@playwright/test";

test("mobile filters preserve selections, chips, reset and browser history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/services");
  const toggle = page.getByRole("button", { name: /^Filters/ });
  await expect(page.getByLabel("Price", { exact: true })).toBeHidden();
  await toggle.click();
  await page.getByLabel("Price", { exact: true }).selectOption("free");
  await page.getByLabel("Format", { exact: true }).selectOption("Online");
  await expect(toggle).toHaveText("Filters 2");
  await toggle.click();
  await expect(page.getByLabel("Price", { exact: true })).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Remove Free filter" }),
  ).toBeVisible();
  await page.goBack();
  await expect(toggle).toHaveText("Filters 1");
  await page.goForward();
  await expect(toggle).toHaveText("Filters 2");
  await page.getByRole("button", { name: "Remove Free filter" }).click();
  await expect(page).not.toHaveURL(/cost=/);
  await expect(
    page.getByRole("textbox", { name: "Search services" }),
  ).toBeFocused();
  await toggle.click();
  await expect(page.getByLabel("Format", { exact: true })).toHaveValue(
    "Online",
  );
  await page
    .getByRole("textbox", { name: "Search services" })
    .fill("unmatched-example");
  await expect(
    page.getByRole("heading", { name: "Let’s try a different path." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remove Search: unmatched-example filter" })
    .click();
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.locator(".svc-card")).toHaveCount(8);
  await expect(page).toHaveURL(/\/services$/);
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`polished catalog layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/services");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".svc-card--editorial")).toHaveCount(8);
    await expect(
      page.getByRole("link", {
        name: "Explore Yoga, at your own pace",
        exact: true,
      }),
    ).toContainText("Explore service");
    const dimensions = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      columns: getComputedStyle(
        document.querySelector(".svc-card-grid")!,
      ).gridTemplateColumns.split(" ").length,
      title: getComputedStyle(document.querySelector(".svc-card h3")!).fontSize,
    }));
    expect(dimensions.overflow).toBe(false);
    expect(dimensions.columns).toBe(width < 650 ? 1 : width < 1024 ? 2 : 3);
    expect(dimensions.title).toBe("22px");
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          return img.decode();
        }),
      );
    });
    await page.screenshot({
      path: `artifacts/catalog-polished-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
