import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
for (const [name, route] of [['gbv-02','/understand-gbv/types-and-forms-of-gender-based-violence'],['mental-health-01','/why-mental-health/understanding-mental-health-and-wellbeing']]) {
  await page.goto('http://127.0.0.1:5191' + route);
  await page.locator('.mh-reader h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/gbv-chapter-01-refresh/before/reconstructed-${name}.png` });
}
await browser.close();
console.log('Settled comparison readers captured from original saved sources. Live workspace unchanged.');
