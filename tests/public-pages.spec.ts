import { test, expect } from "@playwright/test";

test("shared navigation, profile links, and illustrative story dialogs", async ({
  page,
}) => {
  await page.goto("/expertise");
  await expect(page).toHaveTitle("Expertise — VUGA NDAKUMVA");
  await page
    .getByRole("link", { name: "Explore profile", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/professionals\//);
  await expect(
    page.getByText("Actual credential information", { exact: false }).first(),
  ).toBeVisible();
  await page
    .getByRole("contentinfo")
    .locator(".support-preview-links")
    .evaluate((el) => ((el as HTMLDetailsElement).open = true));
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Illustrative stories", exact: true })
    .click();
  const trigger = page.getByRole("button", {
    name: "Read story: Mindful movement",
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toContainText(
    "not a customer testimonial",
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Privacy", exact: true })
    .click();
  await expect(page).toHaveTitle("Privacy — VUGA NDAKUMVA");
});

test("contact validates locally, clears fields, and sends no request", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page
    .getByLabel("What is your enquiry about?")
    .selectOption("Using this prototype");
  await page.getByLabel("Your name", { exact: true }).fill("Demo Visitor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("visitor@example.com");
  await page.getByLabel("Your question").fill("How do I browse services?");
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing was sent or saved",
  );
  await expect(page.getByLabel("Email address", { exact: true })).toHaveValue(
    "",
  );
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

for (const width of [375, 768, 1440]) {
  test(`public pages and shared shell at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "/",
      "/expertise",
      "/stories",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
    ]) {
      await page.goto(route);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images).map((image) => {
            image.loading = "eager";
            return image.decode();
          }),
        );
      });
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `artifacts/public-${route === "/" ? "home" : route.slice(1)}-${width}.png`,
        fullPage: true,
      });
    }
    if (width < 1000) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(
        page
          .getByRole("navigation")
          .getByRole("link", { name: "Awareness", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Why Mental Health", exact: true })
        .click();
      await expect(page).toHaveURL(/\/why-mental-health$/);
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
    expect(errors).toEqual([]);
  });
}
