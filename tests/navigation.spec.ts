import { test, expect } from "@playwright/test";

test("desktop navigation uses the new structure and keeps support and donation actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const banner = page.getByRole("banner");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  for (const [name, route] of [
    ["About Us", "/about"],
    ["Awareness", "/awareness"],
    ["Why Mental Health", "/why-mental-health"],
    ["Community", "/community"],
  ]) {
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      route,
    );
  }
  await expect(
    nav.getByRole("link", { name: "Resources", exact: true }),
  ).toHaveCount(0);
  await expect(
    nav.getByRole("link", { name: "Our work", exact: true }),
  ).toHaveCount(0);
  await expect(
    banner.getByRole("link", { name: "Find support", exact: true }),
  ).toHaveAttribute("href", "/support");
  await expect(
    banner.getByRole("link", { name: "Donate", exact: true }),
  ).toHaveAttribute("href", "/donate");
  await banner.getByRole("link", { name: "Awareness", exact: true }).click();
  await expect(page).toHaveTitle("Awareness — BetterHelp");
  await expect(
    banner.getByRole("link", { name: "Awareness", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await banner
    .getByRole("link", { name: "Why Mental Health", exact: true })
    .click();
  await expect(page).toHaveTitle("Why Mental Health — BetterHelp");
  await expect(page.locator(".information-source a")).toHaveAttribute(
    "href",
    "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
  );
});

test("Knowledge Hub disclosure supports keyboard navigation, Escape, outside dismissal and active routes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: "Knowledge Hub",
    exact: true,
  });
  const panel = page.getByRole("group", { name: "Knowledge Hub links" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    panel.getByRole("link", { name: "Explore the Knowledge Hub", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    panel.getByRole("link", { name: "Understand GBV", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(panel).toBeHidden();
  await page.keyboard.press("ArrowUp");
  await expect(
    panel.getByRole("link", { name: "Blog", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Community", exact: true }),
  ).toBeFocused();
  await expect(panel).toBeHidden();
  await toggle.click();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(panel).toBeHidden();
  for (const [name, route] of [
    ["Explore the Knowledge Hub", "/knowledge-hub"],
    ["Understand GBV", "/understand-gbv"],
    ["Alcohol & Drugs", "/alcohol-and-drugs"],
    ["Guides & Worksheets", "/resources"],
    ["Blog", "/blog"],
  ]) {
    await toggle.click();
    await panel.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveClass(/active/);
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/resources$/);
  await expect(toggle).toHaveClass(/active/);
  await toggle.click();
  await panel
    .getByRole("link", { name: "Guides & Worksheets", exact: true })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("mobile nested navigation closes in layers and Donate remains available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const menu = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  await menu.click();
  const hub = page.getByRole("button", { name: "Knowledge Hub", exact: true });
  await hub.click();
  await expect(
    page.getByRole("group", { name: "Knowledge Hub links" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(hub).toBeFocused();
  await expect(hub).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Donate", exact: true })
    .click();
  await expect(page).toHaveURL(/\/donate$/);
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Donations not yet open", exact: true }),
  ).toBeDisabled();
  await page.setViewportSize({ width: 375, height: 667 });
  await menu.click();
  await hub.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Donate", exact: true })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeHidden();
  await expect(menu).toBeFocused();
});

test("touch selection remains stable when leaving an expanded mobile disclosure", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("/donate");
    for (const destination of ["Donate", "Community"]) {
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .tap();
      await page
        .getByRole("button", { name: "Knowledge Hub", exact: true })
        .tap();
      const link = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: destination, exact: true });
      await link.scrollIntoViewIfNeeded();
      await link.tap();
      await expect(page).toHaveURL(
        new RegExp(destination === "Donate" ? "/donate$" : "/community$"),
      );
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeHidden();
    }
  } finally {
    await context.close();
  }
});

test("knowledge landing pages provide working destinations and Donate collects no payments", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/knowledge-hub");
  await expect(page).toHaveTitle("Knowledge Hub — BetterHelp");
  await expect(
    page.locator(".information-hub-grid .information-card"),
  ).toHaveCount(6);
  await expect(page.locator(".blog-home-section .blog-card")).toHaveCount(3);
  await page
    .locator(".information-hub-grid")
    .getByRole("link", { name: /^Understand GBV/ })
    .click();
  await expect(page).toHaveURL(/\/understand-gbv$/);
  await page.goto("/awareness");
  await page
    .getByRole("link", { name: "Explore Community", exact: true })
    .click();
  await expect(page).toHaveURL(/\/community$/);
  await page.goto("/donate");
  await expect(page).toHaveTitle("Donate — BetterHelp");
  await expect(
    page.getByRole("button", { name: "Donations not yet open", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".donation-page form")).toHaveCount(0);
  await expect(page.locator(".donation-page input")).toHaveCount(0);
  await expect(page.locator(".donation-giving")).toContainText(
    "No payments or financial details are collected",
  );
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
});

for (const width of [375, 768, 1024, 1251, 1440, 1920]) {
  test(`new navigation and information pages fit ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of [
      "/awareness",
      "/why-mental-health",
      "/knowledge-hub",
      "/donate",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("button", { name: "Quick exit", exact: true }),
      ).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    if (width <= 1250)
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
    await page
      .getByRole("button", { name: "Knowledge Hub", exact: true })
      .click();
    const panel = page.getByRole("group", { name: "Knowledge Hub links" });
    await expect(
      panel.getByRole("link", { name: "Blog", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const bounds = await panel.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await panel.getByRole("link", { name: "Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/blog$/);
    if (width <= 1250) {
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeHidden();
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
    }
    await expect(
      page.getByRole("button", { name: "Knowledge Hub", exact: true }),
    ).toHaveClass(/active/);
    expect(errors).toEqual([]);
  });
}
