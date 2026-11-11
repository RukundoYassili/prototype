import { test, expect } from "@playwright/test";

async function ready(page: import("@playwright/test").Page) {
  await page.clock.install();
  await page.goto("/");
  await page.mouse.move(-10, -10);
  await page.evaluate(() =>
    Promise.all(
      [...document.querySelectorAll<HTMLImageElement>(".hero-slide")].map(
        (image) => image.decode(),
      ),
    ),
  );
}

test("five photos load with a loop duplicate and no slideshow buttons", async ({
  page,
}) => {
  await ready(page);
  const sources = await page
    .locator(".hero-slide")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(new Set(sources).size).toBe(5);
  expect(sources).toHaveLength(6);
  expect(sources[5]).toBe(sources[0]);
  await expect(
    page.locator(
      ".slideshow-controls,.slide-dots,.slide-arrow,.slide-play,.slide-count",
    ),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Find support", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("next photograph enters from the right while the adjacent heading stays fixed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  const title = await page.getByRole("heading", { level: 1 }).boundingBox();
  const frame = await page.locator(".hero-slides").boundingBox();
  await page.clock.fastForward(6500);
  await expect(page.locator(".hero-track")).toHaveAttribute(
    "data-position",
    "1",
  );
  await page.waitForTimeout(250);
  const boxes = await page
    .locator(".hero-slide")
    .evaluateAll((images) =>
      images.slice(0, 2).map((image) => image.getBoundingClientRect().left),
    );
  expect(boxes[0]).toBeLessThan(frame!.x);
  expect(boxes[1]).toBeGreaterThan(frame!.x);
  expect(boxes[1]).toBeLessThan(frame!.x + frame!.width);
  expect(await page.getByRole("heading", { level: 1 }).boundingBox()).toEqual(
    title,
  );
  await page.screenshot({ path: "artifacts/hero-sliding-mid-transition.png" });
});

test("automatic sequence loops left through five photos without reversing", async ({
  page,
}) => {
  await ready(page);
  const track = page.locator(".hero-track");
  for (let step = 1; step <= 5; step++) {
    await page.clock.fastForward(6500);
    await expect(track).toHaveAttribute(
      "data-active-slide",
      String((step % 5) + 1),
    );
    if (step < 5)
      await expect(track).toHaveAttribute("data-position", String(step));
  }
  await page.clock.runFor(1050);
  await expect(track).toHaveAttribute("data-position", "0");
  expect(await track.evaluate((el) => getComputedStyle(el).transform)).toBe(
    "matrix(1, 0, 0, 1, 0, 0)",
  );
  await page.clock.fastForward(6500);
  await expect(track).toHaveAttribute("data-active-slide", "2");
});

test("hover, focus, Space and offscreen visibility pause or resume rotation", async ({
  page,
}) => {
  await ready(page);
  const hero = page.locator(".hero"),
    track = page.locator(".hero-track");
  await page.mouse.move(450, 200);
  await expect(track).toHaveAttribute("data-playing", "false");
  await page.clock.fastForward(14000);
  await expect(track).toHaveAttribute("data-position", "0");
  await page.mouse.move(-10, -10);
  await expect(track).toHaveAttribute("data-playing", "true");
  await hero.focus();
  await expect(track).toHaveAttribute("data-playing", "false");
  await page.keyboard.press("Space");
  await expect(track).toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(6500);
  await expect(track).toHaveAttribute("data-active-slide", "2");
  await page.keyboard.press("Space");
  await expect(track).toHaveAttribute("data-playing", "false");
  await page.clock.fastForward(14000);
  await expect(track).toHaveAttribute("data-active-slide", "2");
  await page.evaluate(() => {
    (document.activeElement as HTMLElement).blur();
    window.scrollTo({ top: 1500, behavior: "instant" });
  });
  await expect(track).toHaveAttribute("data-playing", "false");
  await page.clock.fastForward(14000);
  await expect(track).toHaveAttribute("data-active-slide", "2");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(track).toHaveAttribute("data-playing", "true");
});

test("reduced motion disables automatic movement and swipe navigation is removed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 850 });
  await ready(page);
  const hero = page.locator(".hero"),
    track = page.locator(".hero-track");
  await hero.focus();
  await page.keyboard.press("Space");
  await page.clock.fastForward(30000);
  await expect(track).toHaveAttribute("data-position", "0");
  await expect(track).toHaveAttribute("data-playing", "false");
  await page
    .locator(".hero-slide")
    .first()
    .evaluate((image) => {
      const start = new Touch({
        identifier: 1,
        target: image,
        clientX: 300,
        clientY: 180,
      });
      const end = new Touch({
        identifier: 1,
        target: image,
        clientX: 100,
        clientY: 185,
      });
      image.dispatchEvent(
        new TouchEvent("touchstart", { touches: [start], bubbles: true }),
      );
      image.dispatchEvent(
        new TouchEvent("touchend", { changedTouches: [end], bubbles: true }),
      );
    });
  await expect(track).toHaveAttribute("data-position", "0");
  expect(
    await track.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("capture unobstructed desktop slides and mobile hero", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  for (let i = 1; i <= 5; i++) {
    await page.screenshot({
      path: `artifacts/hero-clean-slide-${i}.png`,
      animations: "disabled",
    });
    if (i < 5) await page.clock.fastForward(6500);
  }
  await page.setViewportSize({ width: 375, height: 850 });
  await page.screenshot({
    path: "artifacts/hero-clean-mobile.png",
    animations: "disabled",
  });
});
