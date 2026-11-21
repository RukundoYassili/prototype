import { expect, test } from "@playwright/test";

const profiles = [
  ["X", "https://x.com/NdakumvaVuga"],
  ["LinkedIn", "https://www.linkedin.com/company/vuga-ndakumva-initiative/"],
  ["Instagram", "https://www.instagram.com/vuga_ndakumva_initiative/"],
  ["Facebook", "https://www.facebook.com/vugandakumvainitiative"],
  ["YouTube", "https://www.youtube.com/@vugandakumvainitiative"],
  ["TikTok", "https://www.tiktok.com/@vugandakumvainitiative"],
];

for (const width of [375, 768, 1440]) {
  test(`social links and call icons are usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    const footer = page.getByRole("contentinfo");
    for (const [name, href] of profiles) {
      const link = footer.getByRole("link", { name: `Vuga Ndakumva on ${name} (opens in a new tab)` });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      await expect(link.locator("svg, img")).toBeVisible();
    }
    for (const number of ["112", "3512", "3029", "116", "912"]) {
      const link = page.locator(`.header-hotlines a[href="tel:${number}"]`);
      await expect(link.locator("svg")).toBeVisible();
      await expect(link.locator("svg + strong")).toHaveText(number);
    }
    const support = footer.getByRole("link", { name: "Find support" });
    await expect(support).toHaveAttribute("href", "/support");
    expect(await support.evaluate((element) => { const box = element.getBoundingClientRect(); const footerBox = element.closest("footer")!.getBoundingClientRect(); return box.left >= footerBox.left + footerBox.width / 2; })).toBeTruthy();
    expect(await support.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(await footer.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
      await page.locator(".support-utility-bar").evaluate((element) => getComputedStyle(element).backgroundColor),
    );
    expect(await footer.locator("h3").first().evaluate((element) => getComputedStyle(element).color)).toBe("rgb(255, 255, 255)");
    expect(await footer.evaluate((element) => getComputedStyle(element).minHeight)).toBe("0px");
    await footer.screenshot({ path: `test-results/footer-${width}.png` });
  });
}
