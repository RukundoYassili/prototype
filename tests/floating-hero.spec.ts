import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1440]) {
  for (const route of ["/", "/services"]) {
    test(`floating header on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const header = page.getByRole("banner");
      await expect(header).not.toHaveClass(/is-floating/);
      const content = page.locator(
        route === "/" ? ".page-content" : "#service-main",
      );
      const documentTop = () =>
        content.evaluate((el) => el.getBoundingClientRect().top + scrollY);
      const before = await documentTop();
      await page.evaluate(() => scrollTo({ top: 1200, behavior: "instant" }));
      await expect(header).toHaveClass(/is-floating/);
      const box = await header.boundingBox();
      expect(box!.y).toBe(width <= 650 ? 8 : 12);
      expect(box!.x).toBe(width <= 650 ? 8 : 16);
      await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
      expect(Math.abs((await documentTop()) - before)).toBeLessThan(2);
      expect(
        await header.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return el.contains(
            document.elementFromPoint(r.x + r.width / 2, r.y + 8),
          );
        }),
      ).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      await page.screenshot({
        path: `artifacts/floating-${route === "/" ? "home" : "services"}-${width}.png`,
      });
      if (width <= 1000) {
        const toggle = page.getByRole("button", {
          name: "Open navigation",
          exact: true,
        });
        await toggle.click();
        await expect(
          page
            .getByRole("navigation")
            .getByRole("button", { name: "Knowledge Hub", exact: true }),
        ).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(toggle).toBeFocused();
        await toggle.click();
        await page
          .getByRole("navigation")
          .getByRole("link", {
            name: route === "/" ? "Awareness" : "Why Mental Health",
            exact: true,
          })
          .click();
        await expect(header).not.toHaveClass(/is-floating/);
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await expect(header).not.toHaveClass(/is-floating/);
    });
  }
}
for (const width of [375, 1440]) {
  test(`all five photographs fill the hero at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install();
    await page.goto("/");
    await page.mouse.move(-10, -10);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll<HTMLImageElement>(".hero-slide")].map(
          (i) => i.decode(),
        ),
      );
    });
    const hero = page.locator(".hero");
    const box = await hero.boundingBox();
    const header = await page.getByRole("banner").boundingBox();
    expect(Math.abs(box!.y - header!.height)).toBeLessThan(1);
    expect(Math.abs(box!.y + box!.height - 900)).toBeLessThan(1);
    for (let i = 0; i < 5; i++) {
      await expect(page.locator(".hero-track")).toHaveAttribute(
        "data-active-slide",
        String(i + 1),
      );
      const slide = page.locator(".hero-slide").nth(i);
      await expect(slide).toHaveCSS("object-fit", "cover");
      await hero.screenshot({
        path: `artifacts/fitted-hero-${width}-slide-${i + 1}.png`,
        animations: "disabled",
      });
      const photo = await slide.boundingBox();
      expect(Math.abs(photo!.width - box!.width)).toBeLessThan(1);
      expect(Math.abs(photo!.height - box!.height)).toBeLessThan(1);
      expect(Math.abs(photo!.x - box!.x)).toBeLessThan(1);
      if (i < 4) {
        await page.clock.fastForward(6500);
        await page.clock.runFor(1000);
      }
    }
  });
}
