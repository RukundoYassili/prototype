import { test, expect } from "@playwright/test";

test("topic photography opens the same accessible card destination", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.getByRole("link", {
    name: "Explore mental health",
    exact: true,
  });
  await card.locator("img").click();
  await expect(page).toHaveURL(/\/mental-health$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "You don’t have to figure it out alone.",
  );
  await page.goBack();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await card.focus();
  await expect(card).toBeFocused();
  await card.hover();
  await expect(card.locator("img")).toHaveCSS("transform", "none");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/mental-health$/);
});

test("compact laptop navigation dismisses and resets across breakpoints", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(navigation).toBeHidden();
  await toggle.click();
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(navigation).toBeHidden();
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".site-menu-toggle")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(navigation).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(navigation).toBeHidden();
  await toggle.click();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(navigation).toBeHidden();
});

test("topic section navigation moves keyboard focus below the floating header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/understand-gbv");
  const jumps = page.getByRole("navigation", { name: "On this page" });
  for (const [name, id] of [
    ["Understanding", "understanding"],
    ["Support options", "support-options"],
    ["Official resources", "official-resources"],
    ["For supporters", "for-supporters"],
  ]) {
    const link = jumps.getByRole("link", { name, exact: true });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    const target = page.locator(`#${id}`);
    await expect(target).toBeFocused();
    await expect
      .poll(async () => {
        const header = await page.getByRole("banner").boundingBox();
        const box = await target.boundingBox();
        return box!.y >= header!.y + header!.height;
      })
      .toBe(true);
  }
});
