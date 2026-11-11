import { test, expect, type Page } from "@playwright/test";
test.use({ timezoneId: "America/New_York" });
async function nav(page: Page, name: string) {
  if (["My space", "Admin preview", "Services"].includes(name)) {
    const footer = page.getByRole("contentinfo");
    const disclosure = footer.locator(".support-preview-links");
    await disclosure.evaluate((el) => ((el as HTMLDetailsElement).open = true));
    const label =
      name === "Services"
        ? "Service catalog demo"
        : name === "My space"
          ? "My space preview"
          : "Admin preview ↗";
    await footer.getByRole("link", { name: label, exact: true }).click();
    return;
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name, exact: true })
    .click();
}
async function timeAndConsent(page: Page, contact = true) {
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Session time", { exact: true })
    .selectOption({ index: 1 });
  if (contact) {
    await dialog.getByLabel("Your name", { exact: true }).fill("Demo Visitor");
    await dialog
      .getByLabel("Email address", { exact: true })
      .fill("demo@example.com");
  }
  await dialog
    .getByLabel("I understand this is a demo, not a real appointment.")
    .check();
  await dialog.getByRole("button", { name: "Review demo request" }).click();
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBeTruthy();
}

test("separate catalog preview remains reachable and browser history works", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page, "Services");
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator(".svc-card")).toHaveCount(8);
  await page
    .getByRole("group", { name: "Service category" })
    .getByRole("button", { name: "Wellness", exact: true })
    .click();
  await expect(page.locator(".svc-card")).toHaveCount(4);
  await page
    .getByRole("link", { name: "Yoga, at your own pace", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Yoga, at your own pace",
  );
  await page.goBack();
  await expect(page).toHaveURL(/category=wellness/);
  await expect(page.locator(".svc-card")).toHaveCount(4);
  await page.goForward();
  await expect(page).toHaveURL(/gentle-yoga/);
});

test("combined catalog filters, availability, search, and empty reset", async ({
  page,
}) => {
  await page.goto("/services");
  await page
    .getByRole("group", { name: "Service category" })
    .getByRole("button", { name: "Mental health support", exact: true })
    .click();
  await page.getByLabel("Price", { exact: true }).selectOption("free");
  await page.getByLabel("Format", { exact: true }).selectOption("Online");
  await page
    .getByLabel("Language", { exact: true })
    .selectOption("Kinyarwanda");
  await page.getByLabel("Availability", { exact: true }).selectOption("7");
  await expect(page.locator(".svc-card")).toHaveCount(1);
  await expect(page.locator(".svc-card")).toContainText(
    "A circle of shared support",
  );
  await page
    .getByRole("textbox", { name: "Search services" })
    .fill("not-a-real-service");
  await expect(
    page.getByRole("heading", { name: "Let’s try a different path." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.locator(".svc-card")).toHaveCount(8);
  await page.getByLabel("Availability", { exact: true }).selectOption("7");
  await expect(page.locator(".svc-card")).toHaveCount(7);
});

test("matching questionnaire gives non-diagnostic preferences and a no-match state", async ({
  page,
}) => {
  await page.goto("/services");
  await page
    .getByRole("button", { name: "Find my support", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("What would you like to make room for?")
    .selectOption("Talk to someone");
  await dialog
    .getByLabel("Preferred kind of support")
    .selectOption("mental-health");
  await dialog.getByLabel("Budget preference").selectOption("Free only");
  await dialog.getByRole("button", { name: "See my suggestions" }).click();
  await expect(dialog).toContainText("not a diagnosis");
  await expect(dialog.getByRole("link")).toContainText(
    "A circle of shared support",
  );
  await dialog.getByRole("button", { name: "Adjust preferences" }).click();
  await dialog.getByLabel("Preferred language").selectOption("French");
  await dialog.getByRole("button", { name: "See my suggestions" }).click();
  await expect(dialog).toContainText("No exact match");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("discovery to profile to booking to dashboard without storing or transmitting contacts", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await page.goto("/services");
  await page
    .getByRole("link", { name: "Yoga, at your own pace", exact: true })
    .click();
  await page.getByRole("button", { name: "Save service", exact: true }).click();
  await page
    .locator(".svc-provider-card")
    .filter({ hasText: "Alex Morgan" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Alex Morgan",
  );
  await expect(page.locator(".svc-credential-note")).toContainText(
    "not verified",
  );
  await page
    .getByRole("button", { name: "Choose a demo time" })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Review demo request" }).click();
  await expect(
    dialog.getByRole("button", { name: "Confirm demo booking" }),
  ).toHaveCount(0);
  await timeAndConsent(page);
  await expect(dialog).toContainText("Demo Visitor");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBeTruthy();
  await dialog.getByRole("button", { name: "Confirm demo booking" }).click();
  await expect(dialog).toContainText(
    "no contact information was sent or retained",
  );
  await expect(dialog.locator(".svc-booking-time")).toBeVisible();
  await dialog.getByRole("button", { name: "View my space" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator(".svc-appointment")).toHaveCount(2);
  await expect(
    page
      .locator(".svc-appointment")
      .filter({ hasText: "Yoga, at your own pace" }),
  ).toContainText("Alex Morgan");
  await expect(page.locator("body")).not.toContainText("demo@example.com");
  await page
    .getByRole("button", { name: "Saved services", exact: true })
    .click();
  await expect(page.locator(".svc-card")).toHaveCount(1);
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.reload();
  await expect(page.locator(".svc-appointment")).toHaveCount(1);
});

test("region preferences change currency and display zone without shifting appointment instants", async ({
  page,
}) => {
  await page.goto("/dashboard");
  const iso = await page
    .locator(".svc-appointment")
    .getAttribute("data-starts-at");
  await expect(page.locator(".svc-appointment")).toContainText("Africa/Kigali");
  await page.getByLabel("Display region").selectOption("International");
  await expect(page.locator(".svc-appointment")).toContainText(
    "America/New_York",
  );
  expect(
    await page.locator(".svc-appointment").getAttribute("data-starts-at"),
  ).toBe(iso);
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(
    page
      .locator(".svc-appointment")
      .filter({ hasText: "Yoga, at your own pace" }),
  ).toContainText("$20");
  await page.getByLabel("Display region").selectOption("Rwanda");
  await expect(
    page
      .locator(".svc-appointment")
      .filter({ hasText: "Yoga, at your own pace" }),
  ).toContainText("18,000");
});

test("rescheduling, cancellation, history and private feedback", async ({
  page,
}) => {
  await page.goto("/dashboard");
  const before = await page
    .locator(".svc-appointment")
    .getAttribute("data-starts-at");
  await page.getByRole("button", { name: "Reschedule", exact: true }).click();
  await timeAndConsent(page, false);
  let dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Confirm demo reschedule" }).click();
  await dialog.getByRole("button", { name: "View my space" }).click();
  expect(
    await page.locator(".svc-appointment").getAttribute("data-starts-at"),
  ).not.toBe(before);
  await page
    .getByRole("button", { name: "Cancel appointment", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm demo cancellation" }).click();
  await expect(page.locator(".svc-appointment")).toHaveCount(0);
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(page.locator(".svc-appointment")).toHaveCount(3);
  await page.getByRole("button", { name: "Leave private feedback" }).click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Optional non-sensitive feedback")
    .fill("The preview felt clear.");
  await dialog
    .getByLabel("I understand this stays in the demo and is not published.")
    .check();
  await dialog
    .getByRole("button", { name: "Save private feedback preview" })
    .click();
  await expect(page.getByRole("status")).toContainText("No public review");
  await page.getByRole("button", { name: "Edit private feedback" }).click();
  await expect(page.getByLabel("Optional non-sensitive feedback")).toHaveValue(
    "The preview felt clear.",
  );
});

test("group registration remains free and uses the demo booking journey", async ({
  page,
}) => {
  await page.goto("/services/peer-support");
  await expect(page.locator(".svc-detail-price")).toContainText("Free");
  await page.getByRole("button", { name: "Register a demo place" }).click();
  await timeAndConsent(page);
  await expect(page.getByRole("dialog")).toContainText("Free");
  await page.getByRole("button", { name: "Confirm demo booking" }).click();
  await page.getByRole("button", { name: "View my space" }).click();
  await expect(
    page
      .locator(".svc-appointment")
      .filter({ hasText: "A circle of shared support" }),
  ).toHaveCount(1);
});

test("resources search, article reading and worksheet download", async ({
  page,
}) => {
  await page.goto("/resources");
  await page
    .getByLabel("Resource type", { exact: true })
    .selectOption("Worksheet");
  await expect(page.locator(".svc-resource-card")).toHaveCount(2);
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download My week, with a little more space" })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("weekly-wellness.txt");
  await page
    .getByLabel("Resource type", { exact: true })
    .selectOption("Article");
  await page.getByRole("textbox", { name: "Search resources" }).fill("Finding");
  await expect(page.locator(".svc-resource-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Read more" }).click();
  await expect(page.getByRole("dialog")).toContainText("qualifications");
  await page.keyboard.press("Escape");
  await page.getByRole("textbox", { name: "Search resources" }).fill("zzzz");
  await expect(
    page.getByRole("heading", { name: "No resources found." }),
  ).toBeVisible();
});

test("admin edits services, adds availability, and changes enquiry status in memory", async ({
  page,
}) => {
  await page.goto("/admin-preview");
  await page
    .getByRole("button", { name: "Edit service Yoga, at your own pace" })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Service title").fill("A softer yoga practice");
  await dialog.getByRole("button", { name: "Save sample record" }).click();
  await nav(page, "Services");
  await expect(
    page.getByRole("link", { name: "A softer yoga practice", exact: true }),
  ).toBeVisible();
  await nav(page, "Admin preview");
  await page.getByRole("button", { name: "Add service", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Service title").fill("Sample creative pause");
  await dialog
    .getByLabel("Service description")
    .fill("A temporary example for a quiet creative routine.");
  await dialog.getByLabel("Free service", { exact: true }).check();
  await dialog.getByRole("button", { name: "Save sample record" }).click();
  await page.getByRole("button", { name: "Schedules", exact: true }).click();
  await page.getByRole("button", { name: "Add demo time" }).click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Service", { exact: true })
    .selectOption("sample-creative-pause");
  const date = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  await dialog.getByLabel("Session date (UTC)").fill(date);
  await dialog.getByLabel("Session time (UTC)").fill("14:00");
  await dialog.getByRole("button", { name: "Save sample record" }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "Enquiries", exact: true }).click();
  await page.getByRole("button", { name: "Mark resolved" }).first().click();
  await expect(page.getByRole("button", { name: "Reopen" })).toHaveCount(2);
  await nav(page, "Services");
  await page.getByRole("textbox", { name: "Search services" }).fill("creative");
  await expect(page.locator(".svc-card")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Sample creative pause", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Book a demo session" }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "This path needs a fresh start." }),
  ).toBeVisible();
});

test("urgent support sources follow the region and unknown routes are handled", async ({
  page,
}) => {
  await page.goto("/services");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Urgent help", exact: true })
    .click();
  await expect(
    page
      .locator(".support-source")
      .filter({ hasText: "Government of Rwanda emergency information" })
      .getByRole("link", { name: "Official information", exact: true }),
  ).toHaveAttribute("href", "https://www.gov.rw/emergency");
  await page
    .getByLabel("Support location", { exact: true })
    .selectOption("International");
  await expect(
    page
      .locator(".support-source")
      .filter({ hasText: "WHO country information" })
      .getByRole("link", { name: "Official information", exact: true }),
  ).toHaveAttribute("href", "https://www.who.int/countries");
  await page.goto("/not-a-page");
  await expect(
    page.getByRole("heading", { name: "This path needs a fresh start." }),
  ).toBeVisible();
});

for (const width of [375, 768, 1440])
  test(`service routes fit ${width}px and capture without errors`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.setViewportSize({ width, height: 950 });
    for (const [path, name] of [
      ["/services", "catalog"],
      ["/services/counseling-consultation", "detail"],
      ["/professionals/jordan-reed", "profile"],
      ["/dashboard", "dashboard"],
      ["/resources", "resources"],
      ["/admin-preview", "admin"],
    ]) {
      await page.goto(path);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((i) => {
            i.loading = "eager";
            return i.decode();
          }),
        );
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        path,
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `artifacts/services-${name}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
    if (width === 375) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("button", { name: "Knowledge Hub", exact: true })
        .click();
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Guides & Worksheets", exact: true })
        .click();
      await expect(page).toHaveURL(/resources/);
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
  });

test("paused professionals and changed service formats update booking choices", async ({
  page,
}) => {
  await page.goto("/services/gentle-yoga");
  await page.getByRole("button", { name: "Book a demo session" }).click();
  await timeAndConsent(page);
  await page.getByRole("button", { name: "Confirm demo booking" }).click();
  await page.getByRole("button", { name: "View my space" }).click();
  await nav(page, "Admin preview");
  await page
    .getByRole("button", { name: "Professionals", exact: true })
    .click();
  await page
    .getByRole("row")
    .filter({ hasText: "Alex Morgan" })
    .getByRole("button", { name: "Pause", exact: true })
    .click();
  await nav(page, "My space");
  await page
    .locator(".svc-appointment")
    .filter({ hasText: "Yoga, at your own pace" })
    .getByRole("button", { name: "Reschedule" })
    .click();
  await expect(
    page.getByRole("dialog").getByLabel("Professional", { exact: true }),
  ).toHaveValue("samira-n");
  await page.keyboard.press("Escape");
  await nav(page, "Admin preview");
  await page
    .getByRole("button", { name: "Edit service Yoga, at your own pace" })
    .click();
  await page
    .getByRole("dialog")
    .getByLabel("In person", { exact: true })
    .uncheck();
  await page.getByRole("button", { name: "Save sample record" }).click();
  await nav(page, "Services");
  await page
    .getByRole("link", { name: "Yoga, at your own pace", exact: true })
    .click();
  await expect(
    page.locator(".svc-slot-row").filter({ hasText: "In person" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Book a demo session" }).click();
  await expect(
    page.getByRole("dialog").getByLabel("Session format"),
  ).toHaveValue("Online");
  await expect(
    page.getByRole("dialog").getByLabel("Session format").locator("option"),
  ).toHaveCount(1);
});
