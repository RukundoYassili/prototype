import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
for (const width of [375, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/services"]) {
    await page.goto("http://127.0.0.1:5173" + route);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((i) => {
          i.loading = "eager";
          return i.decode();
        }),
      );
    });
    await expect(page.locator(".unified-header")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error(`Overflow ${route} at ${width}`);
    const header = await page.locator(".unified-header").boundingBox();
    if (width === 375 && header.height > 90)
      throw Error("Mobile header is not compact");
    const boxes = await page
      .locator(
        ".unified-header > .site-brand,.site-utilities,.site-menu-toggle,.public-navigation",
      )
      .evaluateAll((nodes) =>
        nodes
          .filter((n) => getComputedStyle(n).display !== "none")
          .map((n) => {
            const r = n.getBoundingClientRect();
            return { x: r.x, right: r.right, y: r.y, bottom: r.bottom };
          }),
      );
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++)
        if (
          boxes[i].x < boxes[j].right &&
          boxes[i].right > boxes[j].x &&
          boxes[i].y < boxes[j].bottom &&
          boxes[i].bottom > boxes[j].y
        )
          throw Error("Header items overlap at " + width);
    await page.screenshot({
      path: `artifacts/polished-${route === "/" ? "home" : "services"}-${width}.png`,
      fullPage: true,
    });
  }
  if (width <= 1000) {
    const menu = page.getByRole("button", {
      name: "Open navigation",
      exact: true,
    });
    await menu.click();
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "My space", exact: true }),
    ).toBeVisible();
    await page.getByLabel("Display region").selectOption("International");
    await expect(page.locator(".site-region select")).toHaveValue(
      "International",
    );
    await page.screenshot({ path: `artifacts/polished-menu-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await page.mouse.click(5, 200);
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Resources", exact: true })
      .click();
    await expect(page).toHaveURL(/\/resources$/);
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  } else await expect(page.getByLabel("Display region")).toBeVisible();
}
if (errors.length) throw Error(errors.join("\n"));
console.log(
  "Five widths passed: no overflow or header overlap, compact mobile header, region selection, menu Escape/outside/route dismissal and no browser errors.",
);
await browser.close();
