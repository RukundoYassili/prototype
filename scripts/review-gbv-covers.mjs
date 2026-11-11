import { chromium, expect } from "@playwright/test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import ts from "typescript";

const output = process.env.GBV_REVIEW_OUTPUT || "artifacts/gbv-library-refresh/after";
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";
await mkdir(output, { recursive: true });
const metadata = JSON.parse(await readFile("artifacts/gbv-library-refresh/chapter-metadata.json", "utf8"));
const content = ts.transpile(await readFile("src/support/content.ts", "utf8"), { module: ts.ModuleKind.ESNext });
const { officialResources, topics } = await import(`data:text/javascript;base64,${Buffer.from(content).toString("base64")}`);
const topic = topics.find(t => t.id === "understand-gbv");
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const report = { layouts: [], anchors: [], chapters: [], resources: [], checks: [], consoleErrors: [], posts: [] };
page.on("pageerror", e => report.consoleErrors.push(e.message));
page.on("console", m => { if (m.type() === "error") report.consoleErrors.push(m.text()); });
page.on("request", r => { if (r.method() === "POST") report.posts.push(r.url()); });
async function library() {
  await page.goto(`${base}/understand-gbv`);
  await expect(page.locator(".mh-chapter-card")).toHaveCount(10);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll(".topic-understand-gbv img")].map(i => { i.loading = "eager"; return i.decode(); }));
  });
}
try {
  for (const width of [320, 375, 680, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await library();
    await expect(page.locator("h1")).toHaveText(topic.headline);
    await expect(page.locator(".support-page-hero > div > p").first()).toHaveText(topic.intro);
    await expect(page.locator(".gbv-library-meta")).toContainText("10 chapters · 192 sections");
    await expect(page.locator(".mh-draft-note")).toContainText("not approved for publication");
    await expect(page.locator(".mh-draft-note")).toContainText("GBV-specialist, safeguarding, legal, clinical, accessibility and Rwanda referral review remain required");
    await expect(page.locator(".topic-understand-gbv input, .topic-understand-gbv textarea, .topic-understand-gbv form")).toHaveCount(0);
    for (const [i, c] of metadata.entries()) {
      const card = page.locator(".mh-chapter-card").nth(i);
      await expect(card.locator("h3")).toHaveText(c.title);
      await expect(card.locator(".mh-card-body > p")).toHaveText(c.summary);
      await expect(card.locator(".mh-card-time")).toHaveText(c.studyTime);
      await expect(card.locator(".mh-card-meta")).toContainText(`${c.sections} sections`);
      await expect(card.locator(".mh-card-meta")).toContainText(`${c.language} · Educational draft`);
      await expect(card.locator("a")).toHaveAttribute("href", `/understand-gbv/${c.slug}`);
      await expect(card.locator("img")).toHaveAttribute("alt", /^Illustration\b/);
    }
    const metrics = await page.evaluate(() => {
      const scope = document.querySelector(".topic-understand-gbv");
      const images = [...scope.querySelectorAll("img")].map(i => ({src:i.currentSrc, loaded:i.complete && i.naturalWidth > 0, width:i.clientWidth,height:i.clientHeight,fit:getComputedStyle(i).objectFit}));
      const headings = [...scope.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h=>({level:Number(h.tagName[1]), text:h.textContent}));
      const clipped = [...scope.querySelectorAll("h1,h2,h3,p,a,select")].filter(e=>e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).display !== "inline").map(e=>e.textContent.slice(0,80));
      return {width:innerWidth,overflow:document.documentElement.scrollWidth > innerWidth,images,headings,clipped};
    });
    assert(!metrics.overflow, `${width}: horizontal overflow`);
    assert.deepEqual(metrics.clipped, [], `${width}: clipped text`);
    assert(metrics.images.every(i=>i.loaded && Math.abs(i.width / i.height - 1.5) < .02), `${width}: image frame`);
    for (let i=1;i<metrics.headings.length;i++) assert(metrics.headings[i].level <= metrics.headings[i-1].level + 1, "Heading level skipped");
    report.layouts.push(metrics);
    await page.screenshot({path:`${output}/page-${width}.png`,fullPage:true});
    if ([375,1440].includes(width)) {
      await page.locator(".support-page-hero").screenshot({path:`${output}/hero-${width}.png`});
      await page.locator(".mh-chapter-card").first().screenshot({path:`${output}/card-01-${width}.png`});
      await page.locator(".mh-chapter-card").nth(8).screenshot({path:`${output}/card-09-${width}.png`});
      await page.locator("#support-options").screenshot({path:`${output}/support-${width}.png`});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await library();
  // Validate native anchor keyboard behavior, focus and header clearance.
  for (const [name, id] of [["Chapters","gbv-chapters"],["Understanding","understanding"],["Support options","support-options"],["Official resources","official-resources"],["For supporters","for-supporters"]]) {
    const a = page.getByRole("navigation",{name:"On this page"}).getByRole("link",{name,exact:true});
    await a.focus(); await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeFocused();
    const rect=await page.locator(`#${id}`).boundingBox();
    const header=await page.getByRole("banner").boundingBox();
    assert(rect.y >= header.y + header.height - 1, `${id}: hidden under header`);
    report.anchors.push({id,top:rect.y,headerBottom:header.y+header.height});
  }
  for (const region of ["International","Rwanda"]) {
    await page.getByRole("combobox",{name:"Support location",exact:true}).selectOption(region);
    const resources = officialResources.filter(s=>topic.sourceIds.includes(s.id) && s.region===region);
    await expect(page.locator("#official-resources .support-source")).toHaveCount(resources.length);
    for (const source of resources) {
      const a=page.locator(`#official-resources a[href="${source.url}"]`);
      await expect(a).toHaveAttribute("target","_blank");
      await expect(a).toHaveAttribute("rel","noreferrer");
      if(source.phone) await expect(page.locator(`#official-resources a[href="tel:${source.phone}"]`)).toBeVisible();
      report.resources.push({region,id:source.id,url:source.url,checkedAtPreserved:source.checkedAt});
    }
  }
  await library();
  const link = page.locator(".mh-chapter-card a").first();
  await link.focus();
  assert.equal(await link.evaluate(e=>getComputedStyle(e).outlineStyle),"solid");
  await page.keyboard.press("Enter");
  await expect(page.locator("h1")).toHaveText(metadata[0].title);
  for (const c of metadata) {
    await page.goto(`${base}/understand-gbv/${c.slug}`);
    await expect(page.locator("h1")).toHaveText(c.title);
    await expect(page.locator(".gbv-illustration")).toHaveCount(0);
    report.chapters.push(c.slug);
  }
  // Shared TopicPage defaults remain photography; no GBV styling leaks in.
  for (const route of ["/mental-health","/alcohol-and-drugs"]) {
    await page.goto(base+route);
    await expect(page.locator(".support-page-hero figcaption")).toContainText("Illustrative photography");
    await expect(page.locator(".gbv-illustration")).toHaveCount(0);
  }
  await page.goto(base+"/why-mental-health");
  await expect(page.locator(".mh-library-illustrated .mh-chapter-card").first()).toBeVisible();
  await expect(page.locator(".gbv-illustration")).toHaveCount(0);
  // Priority and failure handling use a separate clean page, not QA-eager images.
  await page.goto(base+"/understand-gbv");
  await expect(page.locator(".support-page-hero img")).toHaveAttribute("fetchpriority","high");
  await expect(page.locator(".support-page-hero img")).toHaveAttribute("loading","eager");
  for(const img of await page.locator(".mh-chapter-card img").all()) await expect(img).toHaveAttribute("loading","lazy");
  report.checks.push("Metadata, source counts, heading order, full frames, keyboard anchors, focus, all ten reader routes, shared topic defaults, selector and link targets, eager hero/lazy covers");
  assert.deepEqual(report.consoleErrors,[]);
  assert.deepEqual(report.posts,[]);
  const contrast = await page.evaluate(() => {
    const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
    const luminance = c => c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
    const failures=[];
    const walker=document.createTreeWalker(document.querySelector('.topic-understand-gbv'),NodeFilter.SHOW_TEXT);
    let text; let count=0; let minimum=Infinity;
    while(text=walker.nextNode()) {
      if(!text.textContent.trim()) continue;
      const el=text.parentElement;
      if(!el.getClientRects().length) continue;
      const style=getComputedStyle(el);
      let bg=[255,255,255]; const ancestors=[]; let parent=el;
      while(parent) {ancestors.unshift(parent);parent=parent.parentElement;}
      for(const a of ancestors) {const c=rgb(getComputedStyle(a).backgroundColor);const alpha=c[3]??1;if(alpha)bg=bg.map((v,i)=>c[i]*alpha+v*(1-alpha));}
      const values=[luminance(rgb(style.color)),luminance(bg)].sort((a,b)=>a-b);
      const ratio=(values[1]+.05)/(values[0]+.05);
      const large=parseFloat(style.fontSize)>=24||(parseFloat(style.fontSize)>=18.66&&parseFloat(style.fontWeight)>=700);
      minimum=Math.min(minimum,ratio);count++;
      if(ratio<(large?3:4.5)) failures.push({text:text.textContent.trim(),ratio});
    }
    return {count,minimum,failures};
  });
  assert.deepEqual(contrast.failures,[]);
  report.contrast=contrast;
  await writeFile(`${output}/contrast-findings.json`,JSON.stringify(contrast,null,2)+"\n");
  // Intercept the destination to test replacement without contacting Google.
  await page.route("https://www.google.com/**",r=>r.fulfill({contentType:"text/html",body:"<title>Exit destination test</title>"}));
  await page.goto(base+"/support");
  await page.goto(base+"/understand-gbv");
  const exit = page.getByRole("button",{name:"Quick exit",exact:true});
  await exit.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://www.google.com/");
  await page.goBack(); await expect(page).toHaveURL(base+"/support");
  report.checks.push("Keyboard Quick exit replaces current history entry; destination intercepted, no external call");
  await writeFile(`${output}/report.json`,JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify({widths:report.layouts.map(l=>l.width),anchors:report.anchors.length,chapterRoutes:report.chapters.length,resourceRecords:report.resources.length,errors:report.consoleErrors,posts:report.posts}));
} finally { await browser.close(); }
