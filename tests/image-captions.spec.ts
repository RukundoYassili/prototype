import { expect, test } from "@playwright/test";

for (const path of ["/awareness", "/why-mental-health", "/understand-gbv", "/alcohol-and-drugs", "/understand-gbv/understanding-gender-based-violence", "/blog/listening-without-having-all-the-answers"]) {
  test(`images have no descriptive captions on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("figure:has(img) > figcaption")).toHaveCount(0);
    await expect(page.locator(".lv-fictional")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/AI.generated/i);
  });
}
