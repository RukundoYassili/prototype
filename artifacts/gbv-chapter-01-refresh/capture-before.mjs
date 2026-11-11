import { chromium } from '@playwright/test';
import fs from 'node:fs';
const root='artifacts/gbv-chapter-01-refresh/before';
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage({reducedMotion:'reduce'});
for(const width of [375,1440]) {
 await page.setViewportSize({width,height:960});
 await page.goto('http://localhost:5173/understand-gbv/understanding-gender-based-violence');
 await page.locator('.mh-reader').waitFor();
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode()}))});
 await page.screenshot({path:`${root}/chapter-${width}.png`,fullPage:true});
 await page.screenshot({path:`${root}/header-${width}.png`});
 for(const id of ['gbv-section-1-4','gbv-section-1-8','gbv-section-1-9','example-gbv-household-earnings']) {
  await page.locator('#'+id).screenshot({path:`${root}/${id}-${width}.png`});
 }
}
await page.setViewportSize({width:1440,height:960});
for(const [name,route] of [['gbv-library','/understand-gbv'],['gbv-02','/understand-gbv/types-and-forms-of-gender-based-violence'],['mental-health-01','/why-mental-health/understanding-mental-health-and-wellbeing']]) {
 await page.goto('http://localhost:5173'+route);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${root}/${name}.png`});
}
await browser.close();console.log('Desktop/mobile and regression screenshots saved');
