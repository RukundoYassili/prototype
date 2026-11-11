import { test, expect } from "@playwright/test";

test("homepage replaces the course showcase with three equal support cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /We care about\s*yoursmile\./,
  );
  await expect(
    page.locator(".course-card,.browse-toolbar,.review-card"),
  ).toHaveCount(0);
  const cards = page.locator(".support-topic-card");
  await expect(cards).toHaveCount(3);
  const boxes = await cards.evaluateAll((nodes) =>
    nodes.map((n) => ({
      height: n.getBoundingClientRect().height,
      top: n.getBoundingClientRect().top,
    })),
  );
  expect(new Set(boxes.map((b) => b.top)).size).toBe(1);
  expect(
    Math.max(...boxes.map((b) => b.height)) -
      Math.min(...boxes.map((b) => b.height)),
  ).toBeLessThan(1);
  await expect(page.locator(".support-pathway")).toHaveCount(5);
  await expect(page.locator(".support-category-list > a")).toHaveCount(5);
  await expect(page.locator(".support-values > article")).toHaveCount(4);
  await expect(page.locator(".support-program-list > article")).toHaveCount(3);
});

for (const [action, route, title] of [
  [
    "Explore mental health",
    "/mental-health",
    "You don’t have to figure it out alone.",
  ],
  [
    "Explore alcohol & drugs",
    "/alcohol-and-drugs",
    "A different next step is possible.",
  ],
  ["Explore GBV support", "/understand-gbv", "You deserve safety and respect."],
])
  test(`${action} opens its topic and related resources`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: action, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(".support-source").first()).toContainText(
      "Source checked 8 November 2026",
    );
    await page.getByRole("link", { name: "Browse related resources" }).click();
    await expect(page).toHaveURL(new RegExp(`topic=${route.slice(1)}`));
    await expect(page.locator(".svc-resource-card").first()).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  });

test("support pathways and deep links keep destinations clear of the floating header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Find support", exact: true })
    .click();
  await expect(page).toHaveURL(/\/support$/);
  await page.getByRole("link", { name: /I want to help someone/ }).click();
  await expect(page).toHaveURL(/\/support#help-someone$/);
  await expect(page.locator("#help-someone")).toBeFocused();
  await expect
    .poll(async () => {
      const header = await page.getByRole("banner").boundingBox();
      const target = await page.locator("#help-someone").boundingBox();
      return target!.y >= header!.y + header!.height;
    })
    .toBe(true);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Awareness", exact: true })
    .click();
  await expect(page).toHaveURL(/\/awareness$/);
  await expect(page.locator("#service-main")).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("resource filters combine, retain URLs, support history and reset empty results", async ({
  page,
}) => {
  await page.goto("/resources?topic=understand-gbv");
  await expect(page.getByLabel("Resource topic", { exact: true })).toHaveValue(
    "understand-gbv",
  );
  await expect(page.locator(".svc-resource-card")).toHaveCount(1);
  const trigger = page.getByRole("button", { name: "Read more", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toContainText(/law.enforcement/);
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "Isange One Stop Centres" }),
  ).toHaveAttribute("href", "https://help.unhcr.org/rwanda/services/sgbv/");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page
    .getByLabel("Resource topic", { exact: true })
    .selectOption("alcohol-and-drugs");
  await page.goBack();
  await expect(page.getByLabel("Resource topic", { exact: true })).toHaveValue(
    "understand-gbv",
  );
  await page.goForward();
  await expect(page.getByLabel("Resource topic", { exact: true })).toHaveValue(
    "alcohol-and-drugs",
  );
  await page
    .getByLabel("Resource category", { exact: true })
    .selectOption("wellness");
  await expect(
    page.getByRole("heading", { name: "No resources found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset resource filters" }).click();
  await expect(page).toHaveURL(/\/resources$/);
  await page.getByLabel("Search resources", { exact: true }).fill("boundaries");
  await expect(page).toHaveURL(/q=boundaries/);
  await expect(
    page.getByRole("button", { name: "Clear all resource filters" }),
  ).toBeVisible();
});

test("urgent assistance follows the region without treating directories as responders", async ({
  page,
}) => {
  await page.goto("/understand-gbv");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Urgent help", exact: true })
    .click();
  await expect(page).toHaveURL(/\/urgent-help$/);
  await expect(page.locator('a[href="tel:112"]')).toBeVisible();
  await expect(page.locator('a[href="tel:912"]')).toBeVisible();
  await expect(page.locator(".support-note").first()).toContainText(
    "law-enforcement report",
  );
  await page
    .getByLabel("Support location", { exact: true })
    .selectOption("International");
  await expect(page.locator('a[href="tel:112"]')).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Outside Rwanda", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".support-source")).toHaveCount(2);
  await expect(page.locator("main")).toContainText(
    "not crisis lines or emergency responders",
  );
});

test("Quick exit replaces the current page in the same tab and is keyboard reachable", async ({
  page,
  context,
}) => {
  await page.route("https://www.google.com/**", (route) =>
    route.fulfill({
      body: "<title>Neutral destination</title><h1>Search</h1>",
      contentType: "text/html",
    }),
  );
  await page.goto("/about");
  await page.goto("/understand-gbv");
  const exit = page.getByRole("button", { name: "Quick exit", exact: true });
  await expect(exit).toHaveAccessibleDescription(
    /Does not erase browsing history/,
  );
  await exit.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://www.google.com/");
  expect(context.pages()).toHaveLength(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/about$/);
});

for (const width of [375, 768, 1024, 1440, 1920])
  test(`support pages fit ${width}px without overflow or console errors`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [],
      posts: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });
    for (const route of [
      "/",
      "/mental-health",
      "/alcohol-and-drugs",
      "/understand-gbv",
      "/support",
      "/urgent-help",
      "/about",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const exit = page.getByRole("button", {
        name: "Quick exit",
        exact: true,
      });
      await expect(exit).toBeInViewport();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((image) => {
            image.loading = "eager";
            return image.decode();
          }),
        );
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `artifacts/support-verified-${route === "/" ? "home" : route.slice(1)}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
    expect(posts).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
  });
