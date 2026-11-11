import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'artifacts/full-width-desktop.png'});
console.log(await page.evaluate(()=>{const p=document.querySelector('.page-shell').getBoundingClientRect(),h=document.querySelector('.hero').getBoundingClientRect();return {pageLeft:p.left,pageTop:p.top,pageWidth:p.width,viewport:innerWidth,heroHeight:h.height,viewportHeight:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth}}));
await browser.close();
