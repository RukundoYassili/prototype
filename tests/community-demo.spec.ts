import { test, expect } from "@playwright/test";

test("both public demo films actually play locally with captions and transcripts", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      external.push(request.url());
  });
  for (const [slug, seconds] of [
    ["moments-of-connection", 12],
    ["a-moment-to-pause", 5],
  ] as const) {
    await page.goto(`/community/${slug}`);
    await expect(
      page.getByRole("complementary", { name: "Demo content" }),
    ).toContainText("Demonstration content");
    await expect(page.locator("video")).toHaveCount(0);
    await page.getByText("Read the transcript", { exact: true }).click();
    await expect(page.locator(".community-transcript p")).toContainText("Demo");
    await page.getByRole("button", { name: "Load video", exact: true }).click();
    const video = page.locator("video");
    await expect
      .poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState))
      .toBeGreaterThanOrEqual(2);
    await expect(video).toHaveJSProperty("paused", true);
    await expect(video).toHaveJSProperty("autoplay", false);
    expect(
      await video.evaluate((node: HTMLVideoElement) => node.duration),
    ).toBeCloseTo(seconds, 0);
    await expect(video.locator("track")).toHaveAttribute("srclang", "en");
    await video.evaluate((node: HTMLVideoElement) => node.play());
    await expect
      .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
      .toBeGreaterThan(0);
    await expect
      .poll(() =>
        video.evaluate(
          (node: HTMLVideoElement) => node.textTracks[0]?.cues?.length || 0,
        ),
      )
      .toBeGreaterThan(0);
  }
  expect(external).toEqual([]);
});

test("collection links retain the full set of content types they introduce", async ({
  page,
}) => {
  await page.goto("/community");
  await page
    .locator("#community-watch")
    .getByRole("link", { name: "Explore more" })
    .click();
  await expect(page).toHaveURL(/type=videos#community-updates$/);
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    2,
  );
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await page
    .locator("#community-upcoming")
    .getByRole("link", { name: "Explore more" })
    .click();
  await expect(
    page.locator("#community-updates .community-entry-events"),
  ).toHaveCount(1);
  await expect(
    page.locator("#community-updates .community-entry-workshops"),
  ).toHaveCount(1);
  await page
    .locator("#community-stories")
    .getByRole("link", { name: "Explore more" })
    .click();
  await expect(
    page.locator("#community-updates .community-entry-albums"),
  ).toHaveCount(1);
});

test("demo activities are clearly fictional and cannot accept registrations", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  for (const slug of ["community-connection-day", "listening-with-care"]) {
    await page.goto(`/community/${slug}`);
    await expect(
      page.getByRole("complementary", { name: "Demo content" }),
    ).toContainText("No event is confirmed");
    await expect(page.locator(".community-practical")).toContainText(
      "Demo only",
    );
    await expect(
      page.getByRole("link", { name: "Registration details", exact: true }),
    ).toHaveCount(0);
    await expect(page.locator(".community-detail form")).toHaveCount(0);
  }
  expect(posts).toEqual([]);
});

for (const width of [375, 768, 1440]) {
  test(`polished demo hub and photo album fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/community");
    for (const image of await page.locator(".community-hub img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((node: HTMLImageElement) => node.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/community-demo-polished-${width}.png`,
      fullPage: true,
    });
    await page.goto("/community/community-photo-journal");
    const trigger = page.getByRole("button", {
      name: "View photo: Making room for conversation",
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog", {
      name: "People. Conversations. Connection.",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
      "Stronger through connection",
    );
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}
