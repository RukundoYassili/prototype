import { test, expect } from "@playwright/test";

test("community outreach gallery sits immediately above the homepage newsletter", async ({
  page,
}) => {
  await page.goto("/");
  const community = page.locator("#community");
  await expect(community.getByRole("heading", { level: 2 })).toHaveText(
    "A community thatcares, together.",
  );
  await expect(
    community.getByRole("button", { name: /^View photo:/ }),
  ).toHaveCount(3);
  await expect(community).toContainText(
    "Not photographs of our outreach participants",
  );
  expect(
    await page.evaluate(() => {
      const gallery = document.querySelector("#community")!;
      const newsletter = document.querySelector("#newsletter")!;
      return Math.abs(
        gallery.getBoundingClientRect().bottom -
          newsletter.getBoundingClientRect().top,
      );
    }),
  ).toBeLessThanOrEqual(1);
  await community
    .getByRole("link", { name: "Explore our community work" })
    .click();
  await expect(page).toHaveURL(/\/community$/);
  await expect(page).toHaveTitle("Community — BetterHelp");
  await page.goto("/about");
  await expect(page.locator("#community")).toHaveCount(0);
});

test("gallery supports keyboard viewing, looping, dismissal and focus restoration", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "View photo: Making room for conversation",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Community gallery" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
    "Making room for conversation",
  );
  await expect(dialog.locator("img")).toHaveJSProperty("naturalWidth", 2400);
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
    "Every conversation matters",
  );
  await dialog.getByRole("button", { name: "Next community photo" }).click();
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
    "Making room for conversation",
  );
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
    "Stronger through connection",
  );
  await dialog
    .getByRole("button", { name: "Previous community photo" })
    .click();
  await dialog.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Next community photo" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`community gallery fits at ${width}px with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/");
    const community = page.locator("#community");
    await community.scrollIntoViewIfNeeded();
    for (const image of await community
      .locator(".community-gallery img")
      .all()) {
      await expect(image).toHaveJSProperty("complete", true);
      await expect(image).toHaveJSProperty("naturalWidth", 2400);
    }
    const first = community.locator(".community-photo").first();
    await first.focus();
    expect(
      await first
        .locator("img")
        .evaluate((image) => getComputedStyle(image).transform),
    ).toBe("none");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    await first.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Community gallery" });
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await dialog.getByRole("button", { name: "Next community photo" }).click();
    await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(
      "Stronger through connection",
    );
    await page.keyboard.press("Escape");
    expect(errors).toEqual([]);
  });
}
