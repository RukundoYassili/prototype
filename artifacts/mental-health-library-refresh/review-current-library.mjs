import { chromium, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = 'artifacts/mental-health-library-refresh';
const metadata = JSON.parse(await readFile(`${root}/chapter-metadata.json`, 'utf8'));
const report = { status: 'running', scope: 'Seven cover integration after concurrent addition of Chapters 08–10', layouts: [], links: [], errors: [] };
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ reducedMotion: 'reduce' });
page.on('pageerror', error => report.errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
try {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('http://localhost:5173/why-mental-health');
    assert.equal(response.status(), 200);
    await expect(page.locator('.mh-cover-illustration')).toHaveCount(7);
    assert((await page.locator('.mh-chapter-card').count()) >= 7);
    for (let i = 0; i < metadata.length; i++) {
      const chapter = metadata[i];
      const card = page.locator('.mh-chapter-card').nth(i);
      await expect(card.locator('h3')).toHaveText(chapter.title);
      await expect(card.locator('.mh-card-body > p')).toHaveText(chapter.summary);
      await expect(card.locator('.mh-card-time')).toHaveText(chapter.studyTime);
      await expect(card.locator('.mh-card-meta')).toContainText(`${chapter.sections} sections`);
      await expect(card.locator('.mh-card-meta')).toContainText('English · Educational draft');
      await expect(card.locator('a')).toHaveAttribute('href', `/why-mental-health/${chapter.slug}`);
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('.mh-library img')].map(image => {
        image.loading = 'eager';
        return image.decode();
      }));
    });
    const layout = await page.evaluate(() => ({ width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, cards: document.querySelectorAll('.mh-chapter-card').length, allImagesLoaded: [...document.querySelectorAll('.mh-library img')].every(image => image.naturalWidth > 0), sourceNote: document.querySelector('.mh-draft-note').textContent.trim() }));
    assert.equal(layout.overflow, false);
    assert.equal(layout.allImagesLoaded, true);
    report.layouts.push(layout);
    await page.screenshot({ path: `${root}/after/current-library-${width}.png`, fullPage: true });
    await page.getByRole('searchbox', { name: 'Search chapters' }).fill('  GRIEF, LOSS  ');
    await expect(page.locator('.mh-chapter-card')).toHaveCount(1);
    await expect(page.locator('.mh-chapter-card h3')).toHaveText(metadata[6].title);
  }
  for (const chapter of metadata) {
    await page.goto('http://localhost:5173/why-mental-health');
    const link = page.getByRole('link', { name: `Read Chapter ${String(chapter.number).padStart(2, '0')}: ${chapter.title}`, exact: true });
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`http://localhost:5173/why-mental-health/${chapter.slug}`);
    await expect(page.locator('h1')).toHaveText(chapter.title);
    report.links.push({ chapter: chapter.number, keyboardNavigation: 'passed' });
  }
  assert.deepEqual(report.errors, []);
  report.status = 'passed';
} finally {
  await writeFile(`${root}/after/current-library-review.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
