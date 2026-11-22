import { test, expect } from "@playwright/test";

test("media release retains the existing website assistant", async ({ page }) => {
  await page.route("**/api/vuga-chat", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ reply: "Assistant response available." }) }));
  await page.goto("/community/cyanika-technical-secondary-school-outreach");
  await page.getByRole("button", { name: "AI assistant", exact: true }).click();
  await page.getByRole("textbox", { name: "Your message" }).fill("Hello");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText("Assistant response available.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Show all 37 photos" })).toBeVisible();
});
