import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1440]) {
  test(`school outreach page works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/community");
    await expect(page.getByRole("heading", { name: "Bringing conversations into schools." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Meet our team" }).first()).toHaveAttribute("href", "/about#our-team");
    await expect(page.getByRole("heading", { name: "Videos: In development" })).toBeVisible();
    await expect(page.locator("#outreach-photos button[aria-haspopup=dialog]")).toHaveCount(8);
    await expect(page.locator("#community-past .community-entry")).toHaveCount(3);
    await expect(page.locator("#community-past")).toContainText("Saint Aloys Rwamagana");
    await expect(page.locator("#community-past")).toContainText("GS Nyagasambu");
    await expect(page.locator("#community-past")).toContainText("Cyanika Technical Secondary School");
    await expect(page.locator("#community-past .community-entry").first()).toContainText("Cyanika Technical Secondary School");
    const images = page.locator("#outreach-photos img");
    await images.evaluateAll((items) => Promise.all(items.map((item) => { const image = item as HTMLImageElement; image.loading = "eager"; return image.decode(); })));
    expect(await images.evaluateAll((items) => items.every((item) => (item as HTMLImageElement).naturalWidth > 0 && Boolean(item.getAttribute("alt"))))).toBe(true);
    expect(await images.first().evaluate((item) => getComputedStyle(item).objectFit)).toBe("cover");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("photo viewer opens, navigates and returns focus", async ({ page }) => {
  await page.goto("/community");
  const first = page.getByRole("button", { name: "View photo: A student shares during a school gathering" });
  await first.click();
  await expect(page.getByRole("dialog", { name: "School outreach photos" })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("1 / 8");
  await page.getByRole("button", { name: "Next community photo" }).click();
  await expect(page.getByRole("dialog")).toContainText("2 / 8");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(first).toBeFocused();
});

test("school visits are discoverable as past events without invented dates", async ({ page }) => {
  await page.goto("/community?type=events#community-updates");
  const results = page.locator("#community-updates");
  await expect(results.locator(".community-entry")).toHaveCount(3);
  await expect(results).toContainText("Past events & workshops");
  await results.getByRole("link", { name: "Explore School outreach at Saint Aloys Rwamagana" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "School outreach at Saint Aloys Rwamagana" })).toBeVisible();
  await expect(page.locator(".community-practical")).toContainText("Past event");
  await expect(page.locator(".community-practical")).toContainText("Wednesday, 11 November 2026");
  await expect(page.locator(".community-detail-body")).toContainText("mental health");
  await expect(page.locator(".community-detail-body")).toContainText("gender-based violence");
  await expect(page.locator(".community-detail-body")).toContainText("alcohol and drugs");
  await expect(page.getByRole("link", { name: "Registration details" })).toHaveCount(0);
  await page.goto("/community/gs-nyagasambu-outreach");
  await expect(page.locator(".community-practical")).toContainText("Tuesday, 10 November 2026");
  await expect(page.locator(".community-detail-body")).toContainText("mental health");
  await expect(page.locator(".community-detail-body")).toContainText("gender-based violence");
  await expect(page.locator(".community-detail-body")).toContainText("alcohol and drugs");
  await expect(page.locator(".community-practical").getByRole("link", { name: "Understanding GBV" })).toHaveAttribute("href", "/understand-gbv");
});

test("community media links lead to the video and photo sections", async ({ page }) => {
  await page.goto("/community");
  const navigation = page.getByRole("navigation", { name: "Explore community categories" });
  await navigation.getByRole("link", { name: /Videos/ }).click();
  await expect(page).toHaveURL(/\/community#community-watch$/);
  await expect(page.locator("#community-watch")).toBeFocused();
  await expect(page.locator("#community-watch")).toContainText("Outreach videos will appear here when links are available.");
  await navigation.getByRole("link", { name: /Photo albums/ }).click();
  await expect(page).toHaveURL(/\/community#outreach-photos$/);
  await expect(page.locator("#outreach-photos")).toBeFocused();
});

for (const width of [375, 1440]) {
  for (const slug of ["saint-aloys-rwamagana-outreach", "gs-nyagasambu-outreach"]) {
    test(`${slug} displays its original photo without enlarging or cropping at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/community/${slug}`);
      const image = page.locator(".community-detail-photo img");
      await image.evaluate((element: HTMLImageElement) => element.decode());
      const dimensions = await image.evaluate((element: HTMLImageElement) => ({
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
        fit: getComputedStyle(element).objectFit,
      }));
      expect(dimensions.width).toBeLessThanOrEqual(dimensions.naturalWidth);
      expect(dimensions.height).toBeLessThanOrEqual(dimensions.naturalHeight);
      expect(dimensions.width / dimensions.height).toBeCloseTo(dimensions.naturalWidth / dimensions.naturalHeight, 2);
      expect(dimensions.fit).toBe("contain");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

test("Cyanika visit retains the supplied photos without hosting videos", async ({ page, request }) => {
  await page.goto("/community/cyanika-technical-secondary-school-outreach");
  await expect(page.getByRole("heading", { level: 1, name: "School outreach at Cyanika Technical Secondary School" })).toBeVisible();
  await expect(page.locator(".community-practical")).toContainText("Tuesday, 17 November 2026");
  await expect(page.getByRole("button", { name: "Show all 37 photos" })).toBeVisible();
  await page.getByRole("button", { name: "Show all 37 photos" }).click();
  await expect(page.getByRole("button", { name: /^View photo: Cyanika outreach photo/ })).toHaveCount(37);
  await expect(page.locator("video, #outreach-videos")).toHaveCount(0);
  const missing = await request.get("/community-outreach/cyanika/video-01.mp4");
  expect(missing.headers()["content-type"] || "").not.toContain("video/");
});
