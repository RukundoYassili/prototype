import { expect, test } from "@playwright/test";

test("built pages have unique metadata before JavaScript", async ({ request }) => {
  const home = await request.get("/");
  const about = await request.get("/about/");
  const development = await request.get("/contact/");
  expect(home.ok()).toBeTruthy();
  const homeHtml = await home.text();
  const aboutHtml = await about.text();
  const developmentHtml = await development.text();
  expect(homeHtml).toContain('<link rel="canonical" href="https://vugandakumva.digital/"');
  expect(aboutHtml).toContain('<link rel="canonical" href="https://vugandakumva.digital/about"');
  expect(aboutHtml).toContain("About Us — VUGA NDAKUMVA");
  expect(aboutHtml).toContain('property="og:title"');
  expect(developmentHtml).toContain('content="noindex, follow"');
  expect(homeHtml.match(/name="description"/g)).toHaveLength(1);
});

test("sitemap lists real public pages and excludes unfinished sections", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const robots = await (await request.get("/robots.txt")).text();
  expect(sitemap).toContain("https://vugandakumva.digital/about");
  expect(sitemap).toContain("https://vugandakumva.digital/understand-gbv/");
  expect(sitemap).not.toContain("https://vugandakumva.digital/contact");
  expect(sitemap).not.toContain("https://vugandakumva.digital/admin-preview");
  for (const slug of ["cyanika-technical-secondary-school-outreach", "saint-aloys-rwamagana-outreach", "gs-nyagasambu-outreach"]) {
    expect(sitemap).toContain(`https://vugandakumva.digital/community/${slug}`);
    const html = await (await request.get(`/community/${slug}/`)).text();
    expect(html).toContain(`<link rel="canonical" href="https://vugandakumva.digital/community/${slug}"`);
    expect(html).toContain('content="index, follow"');
  }
  expect(robots).toContain("Sitemap: https://vugandakumva.digital/sitemap.xml");
});

test("client-side navigation updates canonical and social metadata", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About us", exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://vugandakumva.digital/about");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://vugandakumva.digital/about");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /story, mission, values/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});
