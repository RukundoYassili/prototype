import { test, expect, type Page } from "@playwright/test";

async function openFixtures(page: Page) {
  await page.goto("/tests/fixtures/community.html");
  await page
    .getByRole("button", { name: "Open fixture hub", exact: true })
    .click();
}
async function openEntry(page: Page, title: string) {
  await page
    .locator("#community-updates")
    .getByRole("link", { name: `Explore ${title}`, exact: true })
    .click();
}

test("published fixture layout has ordered sections and unified discovery with preserved filters", async ({
  page,
}) => {
  await openFixtures(page);
  const sections = await page
    .locator(".community-hub > section")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("id")));
  expect(sections).toEqual([
    null,
    "community-watch",
    "community-upcoming",
    "community-stories",
    "community-updates",
  ]);
  await expect(
    page.locator("#community-upcoming .community-entry"),
  ).toHaveCount(2);
  await expect(
    page.locator("#community-upcoming .community-entry").first(),
  ).toContainText("upcoming workshop");
  await expect(page.locator("#community-updates")).toContainText(
    "Past events & workshops",
  );
  await expect(page.locator("#community-updates")).toContainText(
    "Cancelled activities",
  );
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    8,
  );
  await page
    .getByRole("group", { name: "Community content type" })
    .getByRole("button", { name: "Videos", exact: true })
    .click();
  await page.getByLabel("Community topic").selectOption("Connection");
  await page
    .getByRole("searchbox", { name: "Search community" })
    .fill("transcript");
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    2,
  );
  await expect(page.locator("#community-updates")).toContainText("1:32");
  await openEntry(page, "Test fixture: local video");
  await expect(page.locator(".community-practical")).toContainText("English");
  await page
    .locator(".community-related .community-entry-link")
    .first()
    .click();
  await page
    .getByRole("link", { name: "Back to community", exact: true })
    .click();
  await expect(page).toHaveURL(/type=videos&topic=Connection&q=transcript$/);
  await expect(page.locator("#community-updates .community-entry")).toHaveCount(
    2,
  );
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await page
    .getByRole("button", { name: "Open fixture homepage", exact: true })
    .click();
  await expect(page.locator("#community .community-entry")).toHaveCount(3);
  await expect(page.locator("#community")).not.toContainText("Hidden draft");
});

test("repository rejects drafts, incomplete content and invalid schedules", async ({
  page,
}) => {
  await openFixtures(page);
  const result = await page.evaluate(() => {
    const api = (window as any).communityTest;
    const story = api.records.find(
      (record: any) => record.slug === "fixture-story",
    );
    const video = api.records.find((record: any) => record.kind === "videos");
    const event = api.records.find(
      (record: any) => record.slug === "fixture-event",
    );
    const invalid = [
      { ...story, status: "draft" },
      { ...story, template: true },
      { ...story, mediaApproved: false },
      { ...video, video: { ...video.video, transcript: "" } },
      { ...video, video: { ...video.video, captions: [] } },
      { ...event, schedule: undefined },
      {
        ...event,
        schedule: { ...event.schedule, timeZone: "Invalid/Timezone" },
      },
      { ...event, schedule: { ...event.schedule, startsAt: "not a date" } },
      {
        ...event,
        schedule: { ...event.schedule, startsAt: "2099-11-11T14:00:00" },
      },
      {
        ...event,
        schedule: { ...event.schedule, registrationUrl: "javascript:alert(1)" },
      },
      {
        ...story,
        resources: [{ title: "Bad link", href: "javascript:alert(1)" }],
      },
    ];
    const publicRepo = api.createCommunityRepository(api.records, false);
    return {
      invalid: invalid.map(api.isPublishable),
      visible: publicRepo.list({ previewTemplates: true }).length,
      hidden: publicRepo.get("fixture-draft"),
      templates: publicRepo.get("community-outreach-update", true),
      upcoming: api
        .upcomingActivities(api.records)
        .map((record: any) => record.slug),
      ongoing: api.activityState(
        {
          ...event,
          schedule: {
            ...event.schedule,
            startsAt: "2026-11-11T14:00:00+02:00",
            endsAt: "2026-11-11T16:00:00+02:00",
          },
        },
        Date.parse("2026-11-11T15:00:00+02:00"),
      ),
    };
  });
  expect(result.invalid.every((value: boolean) => value === false)).toBe(true);
  expect(result.visible).toBe(8);
  expect(result.hidden).toBeUndefined();
  expect(result.templates).toBeUndefined();
  expect(result.upcoming).toEqual(["fixture-workshop", "fixture-event"]);
  expect(result.ongoing).toBe("Upcoming");
});

test("local video loads only after interaction, supports captions and does not autoplay", async ({
  page,
}) => {
  await openFixtures(page);
  let requests = 0;
  await page.route("**/tests/fixtures/clip.webm", async (route) => {
    requests++;
    await route.continue();
  });
  await openEntry(page, "Test fixture: local video");
  await expect(page.locator("video")).toHaveCount(0);
  await page.getByText("Read the transcript", { exact: true }).click();
  await expect(page.locator(".community-transcript p")).toContainText(
    "test fixture transcript",
  );
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "Load video", exact: true }).click();
  const player = page.locator("video");
  await expect(player).toHaveJSProperty("readyState", 4);
  await expect(player).toHaveJSProperty("paused", true);
  await expect(player).toHaveJSProperty("autoplay", false);
  await expect(player.locator("track")).toHaveAttribute("kind", "captions");
  await expect(player.locator("track")).toHaveAttribute("srclang", "en");
  await player.evaluate((video: HTMLVideoElement) => video.play());
  await expect(player).toHaveJSProperty("paused", false);
  expect(requests).toBeGreaterThan(0);
});

test("failed local media offers retry and an accessible transcript", async ({
  page,
}) => {
  await page.route("**/tests/fixtures/clip.webm", (route) => route.abort());
  await openFixtures(page);
  await openEntry(page, "Test fixture: local video");
  await page.getByRole("button", { name: "Load video", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retry video" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry video" })).toBeFocused();
  await page.getByRole("button", { name: "Retry video" }).click();
  await expect(page.locator(".community-media-note")).toContainText(
    "could not load",
  );
  await page.getByText("Read the transcript", { exact: true }).click();
  await expect(page.locator(".community-transcript p")).toBeVisible();
});

test("YouTube is never contacted before click and has a usable blocked-player fallback", async ({
  page,
}) => {
  let external = 0;
  await page.route("https://www.youtube-nocookie.com/**", async (route) => {
    external++;
    await route.fulfill({
      contentType: "text/html",
      body: "<p>Test fixture: blocked player</p>",
    });
  });
  await openFixtures(page);
  await openEntry(page, "Test fixture: YouTube video");
  expect(external).toBe(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Load video", exact: true }).click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /autoplay=0&cc_load_policy=1/,
  );
  await expect(
    page.getByRole("link", { name: "Open on YouTube" }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=abcdefghijk");
  await page.getByRole("button", { name: "Reload player" }).click();
  await expect.poll(() => external).toBeGreaterThanOrEqual(2);
  await page.getByText("Read the transcript", { exact: true }).click();
  await expect(page.locator(".community-transcript p")).toBeVisible();
});

test("activity detail uses explicit timezones and suppresses registration for past and cancelled events", async ({
  page,
}) => {
  for (const [title, state] of [
    ["upcoming gathering", "Upcoming"],
    ["upcoming workshop", "Upcoming"],
    ["past gathering", "Past event"],
    ["cancelled gathering", "Cancelled"],
  ]) {
    await openFixtures(page);
    await openEntry(page, `Test fixture: ${title}`);
    const practical = page.locator(".community-practical");
    await expect(practical).toContainText(state);
    await expect(practical).toContainText("14:00 · Africa/Kigali");
    await expect(
      page.getByRole("link", { name: "Registration details", exact: true }),
    ).toHaveCount(title === "upcoming gathering" ? 1 : 0);
  }
});

for (const width of [375, 768, 1440]) {
  test(`fixture hub, videos and album are responsive and keyboard accessible at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openFixtures(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/community-fixture-hub-${width}.png`,
      fullPage: true,
    });
    await openEntry(page, "Test fixture: photo album");
    const trigger = page.getByRole("button", {
      name: "View photo: Making room for conversation",
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", {
      name: "Test fixture: photo album",
    });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
      "Every conversation matters",
    );
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
      "Making room for conversation",
    );
    await dialog.getByRole("button", { name: "Close dialog" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(
      dialog.getByRole("button", { name: "Next community photo" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
      "hidden",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/community-fixture-album-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Back to community", exact: true })
      .click();
    await openEntry(page, "Test fixture: local video");
    const bounds = await page.locator(".community-video-stage").boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
  });
}
