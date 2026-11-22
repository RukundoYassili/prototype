import { test, expect } from "@playwright/test";

test("migrated Cyanika gallery displays all 37 photos and opens the viewer", async ({ page }) => {
  await page.goto("/community/cyanika-technical-secondary-school-outreach");
  const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Outreach in pictures." }) });
  await expect(section.getByRole("button", { name: "Show all 37 photos" })).toBeVisible();
  await section.getByRole("button", { name: "Show all 37 photos" }).click();
  await expect(section.getByRole("button", { name: /^View photo:/ })).toHaveCount(37);
  await section.getByRole("button", { name: /^View photo:/ }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("mobile gallery keeps its layout and keyboard-accessible viewer", async ({ page }) => {
  await page.setViewportSize({width: 320, height: 800});
  await page.goto("/community/cyanika-technical-secondary-school-outreach");
  const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Outreach in pictures." }) });
  await expect(section.getByRole("button", {name:"Show all 37 photos"})).toBeVisible();
  await section.scrollIntoViewIfNeeded();
  await expect.poll(() => section.locator("img").first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({path:"artifacts/media-gallery-mobile.png"});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await section.getByRole("button", {name:/^View photo:/}).first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("staff dashboard authenticates and edits a gallery photo", async ({ page }) => {
  await page.goto("/staff/media");
  await page.getByLabel("Username").fill("testadmin");
  await page.getByLabel("Password", { exact: true }).fill("temporary-testing-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Outreach gallery" })).toBeVisible();
  await expect(page.locator(".media-photo")).toHaveCount(37);
  await page.screenshot({path:"artifacts/media-dashboard-desktop.png"});
  const item=page.locator(".media-photo").first();
  await expect(item.getByLabel("Published")).toBeChecked();
  await item.getByLabel("Caption (optional)").fill("A school outreach moment.");
  await item.getByRole("button", {name:"Save"}).click();
  await expect(page.getByRole("status")).toContainText("Photo updated.");
  await page.getByRole("button",{name:"Sign out"}).click();
  await expect(page.getByRole("button",{name:"Sign in"})).toBeVisible();
  await page.goto("/community/cyanika-technical-secondary-school-outreach");
  const section=page.locator("section").filter({has:page.getByRole("heading",{name:"Outreach in pictures."})});
  await section.getByRole("button",{name:/^View photo:/}).first().click();
  await expect(page.getByRole("dialog")).toContainText("A school outreach moment.");
});
