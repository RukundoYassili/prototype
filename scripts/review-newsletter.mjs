import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const section = () => page.locator("#newsletter");
const email = () => section().getByLabel("Email address");
const submit = () =>
  section().getByRole("button", { name: "Subscribe", exact: true });
let requests = [];
await page.route("**/api/newsletter", async (route) => {
  requests.push(route.request().postDataJSON());
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ status: "subscribed" }),
  });
});
await page.goto("http://127.0.0.1:5174/");
await submit().click();
expect(requests).toHaveLength(0);
await email().fill("not-an-email");
await submit().click();
expect(requests).toHaveLength(0);
await email().fill("reader@example.com");
await section().screenshot({
  path: "artifacts/newsletter-connected-desktop.png",
});
await submit().click();
await expect(section().getByRole("status")).toContainText(
  "You’re on the list.",
);
expect(requests).toEqual([{ email: "reader@example.com" }]);
await expect(section().getByRole("status")).toBeFocused();
expect(await section().textContent()).not.toContain("reader@example.com");
expect(
  await page.evaluate(() => [localStorage.length, sessionStorage.length]),
).toEqual([0, 0]);
await page.unroute("**/api/newsletter");
await page.route("**/api/newsletter", (route) =>
  route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ status: "confirmation_required" }),
  }),
);
await page.reload();
await email().fill("reader@example.com");
await submit().click();
await expect(section().getByRole("status")).toContainText("Check your inbox");
await page.unroute("**/api/newsletter");
await page.route("**/api/newsletter", (route) =>
  route.fulfill({ status: 500, body: "unavailable" }),
);
await page.reload();
await email().fill("reader@example.com");
await submit().click();
await expect(section().getByRole("alert")).toContainText("couldn’t confirm");
await expect(email()).toHaveValue("reader@example.com");
await expect(submit()).toBeEnabled();
await page.unroute("**/api/newsletter");
await page.route("**/api/newsletter", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ status: "unverified" }),
  }),
);
await submit().click();
await expect(section().getByRole("alert")).toBeVisible();
await expect(section().getByRole("status")).toHaveCount(0);
await page.unroute("**/api/newsletter");
let release;
await page.route("**/api/newsletter", async (route) => {
  await new Promise((resolve) => {
    release = resolve;
  });
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ status: "subscribed" }),
  });
});
await submit().click();
await expect(submit()).toBeDisabled();
await expect(submit()).toHaveAttribute("aria-busy", "true");
await expect(email()).toBeDisabled();
await expect.poll(() => !!release).toBe(true);
release();
await expect(section().getByRole("status")).toBeVisible();
await page.reload();
await page.setViewportSize({ width: 375, height: 900 });
await section().screenshot({
  path: "artifacts/newsletter-connected-mobile.png",
});
expect(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
).toBe(false);
expect(errors).toEqual([]);
console.log(
  "Configured signup verified with mocked API responses: native email validation, confirmed success, double opt-in, server failure/retry, unexpected response rejection, loading and duplicate-submit prevention, focus, no browser storage, desktop/mobile layout. No real subscriptions were made.",
);
await browser.close();
