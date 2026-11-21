import { test, expect } from "@playwright/test";

const slides = [
  ["Mental health matters.", "/why-mental-health"],
  ["Listening makes a difference.", "/support"],
  ["Understand gender-based violence.", "/understand-gbv"],
  ["Safety and choice matter.", "/support"],
  ["You don't have to begin alone.", "/knowledge-hub"],
];

for (const width of [375, 768, 1440]) {
  test(`five awareness messages and images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator(".hero");
    const images = hero.locator(".hero-slide");
    expect(await images.count()).toBe(5);
    await expect(images.first()).toHaveCSS("object-position", width <= 650 ? "62% 50%" : "50% 50%");
    await expect(hero.locator(".hero-nav-button")).toHaveCount(5);
    expect((await hero.locator(".hero-nav-button").allTextContents()).join("").trim()).toBe("");
    const heroBox = await hero.boundingBox();
    expect(Math.abs(heroBox!.y + heroBox!.height - 900)).toBeLessThan(2);
    await images.evaluateAll((items) => Promise.all(items.map((item) => (item as HTMLImageElement).decode())));
    for (let i = 0; i < slides.length; i++) {
      const button = hero.getByRole("button", { name: `Slide ${i + 1}: ${slides[i][0]}` });
      await button.click();
      await expect(button).toHaveAttribute("aria-current", "true");
      await expect(hero.getByRole("heading", { level: 1 })).toHaveText(slides[i][0]);
      await expect(hero.locator(".support-button")).toHaveAttribute("href", slides[i][1]);
      await expect(hero.locator(".hero-track")).toHaveAttribute("data-active-slide", String(i + 1));
      const dimensions = await hero.evaluate((el) => {
        const frame = el.getBoundingClientRect();
        const copy = el.querySelector('.hero-bottom')!.getBoundingClientRect();
        const nav = el.querySelector('.hero-navigation')!.getBoundingClientRect();
        return { frame: frame.toJSON(), copy: copy.toJSON(), nav: nav.toJSON(), scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth };
      });
      expect(dimensions.copy.top).toBeGreaterThanOrEqual(dimensions.frame.top);
      expect(dimensions.copy.bottom).toBeLessThanOrEqual(dimensions.nav.top);
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport);
    }
    await hero.screenshot({ path: `artifacts/awareness-hero-${width}.png` });
  });
}

test("automatic rotation loops and pauses on hover and focus", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.mouse.move(0, 0);
  const hero = page.locator(".hero");
  const track = hero.locator(".hero-track");
  await expect(hero.locator(".hero-slide").first()).toHaveCSS("transition-duration", "0.9s");
  for (let i = 1; i <= 5; i++) {
    await page.clock.fastForward(6500);
    await expect(track).toHaveAttribute("data-active-slide", String((i % 5) + 1));
  }
  await page.clock.runFor(1100);
  await expect(track).toHaveAttribute("data-position", "0");
  await hero.hover();
  await expect(track).toHaveAttribute("data-playing", "false");
  await page.mouse.move(0, 0);
  await hero.focus();
  await expect(track).toHaveAttribute("data-playing", "false");
  await page.keyboard.press("Space");
  await expect(track).toHaveAttribute("data-playing", "true");
});

test("reduced motion permits keyboard slide selection without automatic rotation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  const hero = page.locator(".hero");
  await expect(hero.locator(".hero-slide").first()).toHaveCSS("transition-duration", "0s");
  await page.clock.fastForward(20000);
  await expect(hero.locator(".hero-track")).toHaveAttribute("data-active-slide", "1");
  const button = hero.getByRole("button", { name: /Slide 3:/ });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(slides[2][0]);
  await expect(button).toBeFocused();
});
