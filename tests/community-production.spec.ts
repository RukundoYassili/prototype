import { test, expect } from "@playwright/test";

test.skip(
  !process.env.PLAYWRIGHT_PRODUCTION,
  "Run against npm run preview with PLAYWRIGHT_PRODUCTION=1",
);

test("production ignores template preview parameters and does not serve test media", async ({
  page,
  request,
}) => {
  await page.goto("/community?preview=templates");
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    7,
  );
  await expect(page.locator(".community-template-badge")).toHaveCount(0);
  await expect(page.locator(".community-publishing-note")).toHaveCount(0);
  await page.goto("/community/healthy-boundaries?preview=templates");
  await expect(
    page.getByRole("heading", { name: "This update isn’t here." }),
  ).toBeVisible();
  const harness = await request.get("/tests/fixtures/community.html");
  expect(await harness.text()).not.toContain("community-harness.tsx");
  const clip = await request.get("/tests/fixtures/clip.webm");
  expect(clip.headers()["content-type"]).not.toContain("video/");
});
