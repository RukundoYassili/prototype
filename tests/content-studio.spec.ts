import { test, expect } from "@playwright/test";

const user = { id: "test-user", username: "admin", role: "admin" };
const first = {
  id: "draft-one",
  type: "article",
  title: "Starting a supportive conversation",
  summary: "A thoughtful first step.",
  language: "English",
  topic: "Mental health",
  status: "draft",
  updatedAt: "2026-11-22T08:00:00Z",
  owner: "admin",
  ownerId: "test-user",
  revision: 1,
  body: "",
  details: { contentOwner: "Review team", nextReview: "2020-01-01" },
};

test("studio signs in through the existing media account and creates a private draft", async ({
  page,
}) => {
  let signedIn = false;
  let entries = [first];
  await page.route("**/api/media/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/session"))
      return route.fulfill({
        status: signedIn ? 200 : 401,
        json: signedIn
          ? { user, csrf: "test-csrf" }
          : { error: "Please sign in." },
      });
    if (path.endsWith("/login")) {
      signedIn = true;
      return route.fulfill({ json: { user, csrf: "test-csrf" } });
    }
    if (path.endsWith("/editorial/roles"))
      return route.fulfill({
        json: { roles: ["author", "reviewer", "publisher"] },
      });
    if (path.endsWith("/editorial/users"))
      return route.fulfill({
        json: {
          users: [
            {
              ...user,
              disabled: 0,
              editorialRoles: ["author", "reviewer", "publisher"],
            },
          ],
        },
      });
    if (path.endsWith("/history"))
      return route.fulfill({ json: { history: [] } });
    if (path.endsWith("/activity"))
      return route.fulfill({ json: { activity: [] } });
    if (path.endsWith("/editorial/items") && route.request().method() === "GET")
      return route.fulfill({ json: { items: entries } });
    if (
      path.endsWith("/editorial/items") &&
      route.request().method() === "POST"
    ) {
      const data = route.request().postDataJSON();
      entries = [{ ...first, ...data, id: "new-draft" }, ...entries];
      return route.fulfill({ status: 201, json: { id: "new-draft" } });
    }
    return route.fulfill({ status: 404, json: { error: "Not found" } });
  });
  await page.goto("/staff/content");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("local-test-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back, admin." }),
  ).toBeVisible();
  await expect(
    page.locator(".studio-row-content strong").filter({ hasText: first.title }),
  ).toBeVisible();
  await page.getByLabel("Filter by review date").selectOption("soon");
  await expect(
    page.getByRole("heading", { name: "No matching content" }),
  ).toBeVisible();
  await page.getByLabel("Filter by review date").selectOption("overdue");
  await expect(
    page.locator(".studio-row-content strong").filter({ hasText: first.title }),
  ).toBeVisible();
  await page.getByLabel("Filter by review date").selectOption("all");
  await page.getByRole("button", { name: "Create content" }).click();
  await page.getByLabel("Title", { exact: true }).fill("A new draft");
  await page.getByLabel("Summary").fill("A summary for review.");
  await page.getByLabel("Language", { exact: true }).fill("English");
  await page.getByLabel("Topic").fill("Wellbeing");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByRole("status")).toContainText(
    "not visible on the website",
  );
  await expect(
    page
      .locator(".studio-row-content strong")
      .filter({ hasText: "A new draft" }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/content-studio-desktop.png",
    fullPage: true,
  });
});

test("mobile studio has no horizontal overflow and offers the existing media library", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.route("**/api/media/session", (route) =>
    route.fulfill({ json: { user, csrf: "test-csrf" } }),
  );
  await page.route("**/api/media/editorial/items", (route) =>
    route.fulfill({ json: { items: [first] } }),
  );
  await page.route("**/api/media/editorial/items/*/history", (route) =>
    route.fulfill({ json: { history: [] } }),
  );
  await page.route("**/api/media/editorial/items/*/activity", (route) =>
    route.fulfill({ json: { activity: [] } }),
  );
  await page.route("**/api/media/editorial/roles", (route) =>
    route.fulfill({ json: { roles: ["author", "reviewer", "publisher"] } }),
  );
  await page.route("**/api/media/editorial/users", (route) =>
    route.fulfill({
      json: {
        users: [
          {
            ...user,
            disabled: 0,
            editorialRoles: ["author", "reviewer", "publisher"],
          },
        ],
      },
    }),
  );
  await page.goto("/staff/content");
  await expect(
    page.getByRole("heading", { name: "Content library" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("link", { name: "Open media library" }),
  ).toHaveAttribute("href", "/staff/media");
  await page.screenshot({
    path: "artifacts/content-studio-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: `Open ${first.title}` }).click();
  await page.getByLabel("Block type").selectOption("table");
  await page.getByRole("button", { name: "Add block" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/content-studio-editor-mobile.png",
    fullPage: true,
  });
});

test("a missing content service does not pretend that drafts loaded", async ({
  page,
}) => {
  await page.route("**/api/media/session", (route) =>
    route.fulfill({ json: { user, csrf: "test-csrf" } }),
  );
  await page.route("**/api/media/editorial/items", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.route("**/api/media/editorial/roles", (route) =>
    route.fulfill({ json: { roles: ["author"] } }),
  );
  await page.goto("/staff/content");
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Create content" }),
  ).toBeDisabled();
});

test("the public assistant stays visible on public pages and out of the staff workspace", async ({
  page,
}) => {
  await page.route("**/api/media/session", (route) =>
    route.fulfill({ status: 401, json: { error: "Please sign in." } }),
  );
  await page.goto("/staff/content");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.locator("#vuga-assistant-host")).toBeHidden();
  await page.goto("/community/cyanika-technical-secondary-school-outreach");
  await expect(
    page.getByRole("button", { name: "AI assistant", exact: true }),
  ).toBeVisible();
});
