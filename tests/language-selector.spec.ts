import { expect, test } from "@playwright/test";

// The provider is stubbed here so control behavior does not depend on a network
// service. Real translation is checked separately against Google Translate.
test.beforeEach(async ({ page }) => {
  await page.route("https://translate.google.com/translate_a/element.js*", (route) => route.fulfill({
    contentType: "application/javascript",
    body: `window.google = { translate: { TranslateElement: function(options, id) {
      const select = document.createElement('select');
      select.className = 'goog-te-combo';
      select.innerHTML = '<option value="en">English</option><option value="rw">Kinyarwanda</option>';
      select.addEventListener('change', () => {
        document.cookie = 'googtrans=/en/' + select.value + '; path=/';
        document.documentElement.classList.toggle('translated-ltr', select.value === 'rw');
      });
      document.getElementById(id).append(select);
    } } }; window.googleTranslateElementInit();`,
  }));
});

test("desktop selector switches languages and supports Escape", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const selector = page.locator(".language-selector--desktop");
  const trigger = selector.getByRole("button", { name: "Choose language" });
  await trigger.click();
  await expect(selector.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await selector.getByRole("button", { name: "Kinyarwanda" }).click();
  await expect(trigger).toContainText("RW");
  await expect(page.locator(".site-translation-notice")).toBeVisible();
  await trigger.click();
  await selector.getByRole("button", { name: "English" }).click();
  await expect(trigger).toContainText("EN");
  await expect(page.locator(".site-translation-notice")).toHaveCount(0);
});

test("mobile selector is available after Donate in the menu", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.locator(".site-menu-toggle").click();
  const nav = page.locator(".public-navigation");
  const selector = nav.locator(".language-selector--mobile");
  await expect(selector).toBeVisible();
  await expect(nav.locator(".header-mobile-donate + .language-selector--mobile")).toHaveCount(1);
  await selector.getByRole("button", { name: "Choose language" }).click();
  await selector.getByRole("button", { name: "Kinyarwanda" }).click();
  await expect(selector.getByRole("button", { name: "Choose language" })).toContainText("RW");
});
