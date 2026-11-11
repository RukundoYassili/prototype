import { test, expect } from "@playwright/test";

test("homepage community preview uses the public collection and sits above newsletter", async ({
  page,
}) => {
  await page.goto("/");
  const community = page.locator("#community");
  await expect(community.getByRole("heading", { level: 2 })).toHaveText(
    "A community thatcares, together.",
  );
  await expect(community).toContainText("Demo stories and illustrative media");
  await expect(community.locator(".community-entry")).toHaveCount(3);
  await expect(community.locator(".community-demo-badge")).toHaveCount(3);
  await expect(
    community.getByRole("button", { name: /^View photo:/ }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      Math.abs(
        document.querySelector("#community")!.getBoundingClientRect().bottom -
          document.querySelector("#newsletter")!.getBoundingClientRect().top,
      ),
    ),
  ).toBeLessThanOrEqual(1);
  await community
    .getByRole("link", { name: "Explore our community work" })
    .click();
  await expect(page).toHaveURL(/\/community$/);
  await expect(page).toHaveTitle("Community — VUGA NDAKUMVA");
  await page.goto("/about");
  await expect(page.locator("#community")).toHaveCount(0);
});
