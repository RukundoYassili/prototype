# BetterHelp reference recreation

A responsive React + TypeScript support website built on the screenshot-inspired cream-and-green design, rounded photographic cards, editorial headings, floating header, and automatic hero slideshow. BetterHelp remains temporary branding; this independent project is not the official BetterHelp website.

For the chapter-library workflow and handoff to future GBV and Alcohol & Drugs work, read [Content Library Guide and Handoff Memory](CONTENT_LIBRARY_GUIDE.md). It covers source preservation, the reader architecture, teaching visuals, verification, and a prompt for another chat.

```sh
npm install
npm run dev
npm run build
npm test
```

Open the address printed by Vite. Tests expect the server at `http://127.0.0.1:5173` and use installed Microsoft Edge in headless mode. `npm run test:ui` shows the browser.

## Mental Health library illustrations

All ten chapter covers now use content-specific flat editorial illustrations. The first seven accepted scenes are retained; Chapters 08–10 add evening rest, respectful peer connection, and age-appropriate adult support. Source chapters, downloads, internal visuals, and routes remain unchanged. The library has compact mobile spacing, aligned card actions, uncropped responsive images, and a fictional/AI-generated disclosure.

Cover mapping: `src/learning/mental-health-covers.tsx`. Optimized artwork and complete provenance: `public/images/learning/mental-health-covers/`. New originals, prompts, before/after captures, and handoff: `artifacts/mental-health-library-ten/`. Run `node scripts/prepare-mental-health-library-ten.mjs` to prepare the new assets, and `npx playwright test tests/mental-health-library-covers.spec.ts` for the current ten-cover checks. See the Content Library Guide for the separate single-chapter workflow.

## GBV Chapters 4–10

The Understand GBV library now contains ten complete chapters. The seven continuation PDFs add 73 source pages, 135 reader sections, 34 scenarios, 35 optional activities, 70 explained assessment answers and 52 references. All original lessons, qualifications, editorial notices and source downloads are retained. Five flattened Chapter 5 comparisons were rebuilt as readable tables without losing words; Chapter 10's bibliography remains unnumbered.

The separate importer is `scripts/import-gbv-chapters-04-10.py`; its page evidence and source audit live in `artifacts/gbv-continuation/`. Generated continuation data is registered through `src/learning/gbv/chapters.ts` and `catalog.ts`. Original PDFs, exact hashes, activity downloads and selected-source review notes live in `public/learning/gbv/`. Existing teaching images remain in Chapters 1–3; the new chapter cards reuse local illustrative photographs. Mental Health has its separate ten-chapter collection.

## Mental Health Chapters 8–10

Why Mental Health now contains ten complete readers. Sleep and Mental Wellbeing; Relationships, Social Connection, and Mental Wellbeing; and Child and Adolescent Mental Health add 31 source pages, 62 ordered reader sections, 14 scenarios, 13 optional activities, 30 explained answers, 23 references and five tables. Original source PDFs and educational-draft notices are preserved. The existing seven readers and their visual assets remain intact.

The new routes beneath `/why-mental-health/` are `understanding-sleep-and-mental-wellbeing`, `relationships-social-connection-and-mental-wellbeing`, and `child-and-adolescent-mental-health`. They participate in chapter search, previous/next navigation, direct section links and route metadata. The shared reader supports the child chapter's original R-prefixed citations and unnumbered activity section.

The dedicated inspector/importer are `scripts/inspect-mental-health-08-10.py` and `scripts/import-mental-health-chapters-08-10.py`. Evidence is in `artifacts/mental-health-08-10/`; original PDFs, activity downloads, source hashes and selected-source review notes are in `public/learning/mental-health/`. Sleep's inaccurate opening chapter-map ranges are preserved and flagged separately for editorial correction. No source claim was silently rewritten and no publication review was marked complete.

Run `npx.cmd playwright test tests/mental-health-08-10.spec.ts tests/mental-health-learning.spec.ts tests/mental-health-continuation.spec.ts tests/learning-polish.spec.ts`. `node scripts/review-mental-health-08-10.mjs` captures five widths; `--print` exports all three new readers for `scripts/check-mental-health-08-10-print.py`. This expansion adds no backend, accounts, personal data collection or persistence.

Run `npx.cmd playwright test tests/gbv-continuation.spec.ts tests/gbv-learning.spec.ts` for source rendering, downloads, navigation, disclosures, privacy and responsive checks. `node scripts/review-gbv-continuation.mjs` captures five widths; its `--print` mode exports all seven new readers for the Python print audit. These are educational drafts, not approved service protocols. No public deployment or backend was added.

## Support experience

The homepage replaces the former course showcase with three topic cards, five support pathways, support categories, resource guides, four values, and community-program focus areas. Dedicated pages live at `/mental-health`, `/alcohol-and-drugs`, and `/understand-gbv`. `/support` offers pathways and practical questions to ask providers; `/urgent-help` shows source-backed Rwanda information and international country-information links. `/about` describes the mission and values.

Typed English content and official-source records (region, URL, checked date, and relevant caveats) are in `src/support/content.ts`. Official links do not constitute a verified provider directory, partnership, or appointment service. Confirm availability, eligibility, language, cost, accessibility, confidentiality, and reporting limits directly with the relevant organization. The new pages do not collect personal stories, perform assessments, or persist browsing activity in application storage. Browser history can retain page URLs and resource-search terms.

The shared navigation includes Urgent help and Quick exit. Quick exit uses same-tab `location.replace()` to Google; it does not erase browser history or monitoring records. English is the only current UI language. Local photography is illustrative and does not identify clients or survivors.

The resource library combines existing practices/worksheets with four new introductory articles. Search, type, category, and topic filters are shareable through URL parameters and support browser history. `/resources?topic=understand-gbv` is an example.

The topic cards use a single accessible link across the photo, text, and labeled action. Tablet layouts give the third card a horizontal full-width row. Topic pages include keyboard-accessible section links, and the shared menu collapses through 1250px to keep smaller laptop headers compact. Motion feedback respects reduced-motion settings. Before/after captures are generated with `node scripts/review-support-polish.mjs before` and `node scripts/review-support-polish.mjs after`.

To test the production build without development-server hot reload, run `npm run build`, serve `npm run preview -- --port 5175`, then set `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5175` in the test process environment before `npm test`. `scripts/review-support.mjs` captures the development site at five screen widths.

## Navigation and information pages

The shared navigation is **About Us · Awareness · Why Mental Health · Knowledge Hub · Community**, followed by **Find support** and **Donate**. Knowledge Hub replaces the former top-level Resources label and groups Understand GBV, Alcohol & Drugs, Guides & Worksheets, and Blog beneath an overview link. The desktop disclosure supports click, keyboard activation, Arrow Down/Up entry, Escape, outside-click dismissal, and closing when focus leaves. Mobile uses an accordion inside the existing scrollable navigation; Escape closes the inner disclosure before the outer menu. Donate moves into that menu on smaller screens, while Find support stays visible.

New routes are `/awareness`, `/why-mental-health`, `/knowledge-hub`, and `/donate`. Awareness describes the organisation's focus areas without claiming completed campaigns. Why Mental Health now opens the growing educational chapter library described below. Knowledge Hub links to existing topics, guides, and articles. Existing topic and resource URLs are preserved.

The user explicitly deferred donation functionality. `/donate` is an informational page with an unavailable-giving notice. It contains no payment form, collection, amount selector, payment connection, or claims about fundraising totals or tax treatment. Donation functionality can be built separately when the organisation's giving arrangements are ready.

Shared navigation code and scoped disclosure styles are in `src/SiteChrome.tsx` and `src/navigation.css`; the general information pages are in `src/support/InformationPages.tsx` with `information.css`. Run `node scripts/review-navigation.mjs` for responsive page and dropdown captures. `tests/navigation.spec.ts` covers the new structure and disclosure behavior; affected existing navigation journeys are updated for the new labels and hierarchy.

## Why Mental Health chapter library

`/why-mental-health` presents ten supplied VUGA NDAKUMVA chapters with space for the continuing series. Chapters 3–7 add Stress, Anxiety, Depression, Trauma and Post-Traumatic Stress, and Grief and Loss. Their implementation and verification are described in the continuation section below. The full readers are `/why-mental-health/understanding-mental-health-and-wellbeing` and `/why-mental-health/recognizing-emotions-and-responding-to-them`. The original two chapters retain all 33 lesson sections as editable React content, including six lesson tables, learning goals, fictional teaching examples, reflection prompts, ten expandable knowledge-check answers, summaries, and original references. Source front matter, editorial review, the additional review table, source notes, and publication checklists are retained. The supplied version 1.1 / 9 November 2026 / English master draft status is visible; the site does not imply clinical review or public-release approval.

Readers include a desktop section index, expandable mobile index, direct section links, numbered reference links, previous/next chapters, original PDF downloads, reflection-prompt text downloads, and a print layout that includes all answers and editorial notes. No reflection responses are collected or persisted. Official source links were checked on 9 November 2026; link checking is explicitly distinguished from clinical review. Existing support and urgent-help routes remain available throughout.

The unmodified source PDFs are in `public/learning/mental-health/`. `scripts/import-mental-health-chapters.py` uses Python with `pypdf` to regenerate `src/learning/chapters.generated.ts`, the lightweight `chapter-catalog.generated.ts`, reflection downloads, and `artifacts/mental-health-source-review.json`. Its source-token audit covers every lesson section and the editorial review, while browser tests verify rendering of the complete records, including metadata, goals, references, and source notes. Tables were checked visually against all 14 source pages. Run the script from an environment containing `pypdf`; it does not modify the original PDFs.

The importer is specific to these first two documents. Add future chapters as typed `MentalHealthChapter` modules and extend the collection in `src/learning/chapters.ts`; cards, readers, and previous/next links follow that collection. Also extend the lightweight catalog in `src/learning/catalog.ts` so route titles and descriptions include new chapters without loading all lesson content. Do not edit generated files to add future chapters, because rerunning the importer replaces them. The reader module is loaded separately from the shared site bundle.

`tests/mental-health-learning.spec.ts` checks source fidelity, section navigation, browser history, downloads, answer disclosures, privacy, printing, missing routes, keyboard focus, reduced motion, and responsive layouts. Run `node scripts/review-mental-health-learning.mjs` against the production preview for 375, 768, 1024, 1440, and 1920px captures in `artifacts/mental-health-*.png`. This is a local implementation; no deployment has been performed.

## Visual learning in the mental-health chapters

### Chapters 3 to 7

The continuation adds five complete readers for Stress, Anxiety, Depression, Trauma and Post-Traumatic Stress, and Grief and Loss. `scripts/import-mental-health-chapters-03-07.py` imports their 50 source pages into a separate generated collection and lightweight catalog. It uses font and table geometry, checks each section, and independently compares the full body and front matter with `pypdf` extraction. All 17 source tables, 21 main scenarios, numbered references/review sections, and Grief Parts IV–VII remain in source order. The original two generated chapter files are not replaced.

The continuation supplies 42 new fictional scenes, ten concept diagrams, and 18 compact skill visuals. `src/learning/visuals-03-07.ts` holds the editable supplemental teaching records; explicit source example IDs and activity IDs place each visual beside its lesson. The complete series now has 29 two-scene stories, 15 concept diagrams, and 23 skill sequences. The original 16 images and their responsive variants are retained. Prompts and generation relationships for the new scenes are in `artifacts/learning-visuals/chapters-03-07-generation-progress.json`; scene briefs and visual review records are alongside it. The combined public provenance manifest includes all 58 scenes and 116 responsive variants.

The reader supports source subheadings, example/activity groups, optional answer groups, table answers, and references within ordered sections. Original reference URL placement and citation ranges are retained. Trauma's DSM citation remains a printed bibliography entry without an invented URL. Reference retrieval results are in `artifacts/mental-health-reference-review-03-07.json`: 16 URLs were retrieved, four official-site fetches returned HTTP 403, and one citation has no URL. These are link checks, not clinical approval; original citations and editorial status are preserved.

Run `tests/mental-health-continuation.spec.ts` for the new source formats, navigation, downloads, source-heading associations, activity placement, private optional learning, print restoration, and five-width layout coverage. `node scripts/review-mental-health-continuation.mjs` captures library/readers and all new visual units. Use `node scripts/review-learning-visuals.mjs --continuation-only --print-only` for the five browser-print QA PDFs, then run `scripts/check-learning-print.py artifacts/chapters-03-07/review` with Python containing `pypdf` and `pdfplumber`. The checker also accepts its original directory by default.

### Chapters 1 and 2

The original two readers supplement the unchanged source lessons with eight fictional photo stories (two scenes each), five concept diagrams, and five compact skill sequences. Chapter 1 illustrates examination pressure, unemployment, caregiving, influences on mental health, protective support, and respectful listening. Chapter 2 illustrates the work-meeting example and all four everyday examples, the connections between experiences, the emotional check-in, and the five existing coping/communication skills. Scenes and captions are immediately available; explanations use optional native disclosures. Reflection remains private and optional, with no responses, scores, progression locks, accounts, or storage.

All 16 scenes were generated with the built-in `image_gen` tool and visually checked for story alignment, recurring-character continuity, natural anatomy, and respectful representation. They are labeled as AI-generated fictional examples, not actual participants or case histories. Original PNGs and the full prompt set are in `artifacts/learning-visuals/`; responsive 640 × 480 and 1280 × 960 WebP variants are in `public/images/learning/`. All 32 responsive assets total approximately 2.9 MB. `public/images/learning/provenance.json` records prompts, reference relationships, original hashes, output dimensions, and generation disclosure. Run `node scripts/prepare-learning-visuals.mjs` to rebuild variants from the retained originals; this script does not generate new scenes or download images.

Supplemental content is separate from the source transcription in `src/learning/visuals.ts`. Add stories or diagrams there with the destination chapter slug and section ID; photo stories associated with an existing example also specify its original `sourceExample` label. Source paragraphs are rendered unchanged, followed by their visual. Reusable components in `LearningVisuals.tsx` provide semantic text-based diagrams, captions, alt text, missing-image descriptions, explanations, and reflections. Explanatory labels are editable React content rather than text embedded in images. The existing chapter photography is retained; editorial illustrations are deferred.

Story images load lazily, display in two columns on larger screens and stack below 681px, and retain descriptions if loading fails. Diagrams have text equivalents and no animation. Printing keeps visual units together, includes visual explanations, and restores their previous disclosure states afterward. `tests/learning-visuals.spec.ts` adds provenance, sizing, placement, keyboard, failure-state, print, privacy, and five-width responsive coverage. `node scripts/review-learning-visuals.mjs` generates visual captures and browser-print QA PDFs in `artifacts/learning-visuals/review/`; `scripts/check-learning-print.py` uses `pypdf` and `pdfplumber` to check print text coverage, intact visual units, scene counts, and page bounds. These PDFs are QA artifacts, not replacements for the original source downloads.

## Learning experience finishing pass

The chapter library has a tighter mobile hero, aligned chapter cards, and visual-example indicators. Readers use approximately 16px desktop / 15px mobile prose, 14px scene captions, and supporting labels of at least 12px. Source-based stories are labeled by their original example headings rather than repeating supplemental titles. Standalone stories retain their own headings. A single chapter-introduction note explains privacy, optional learning, and fictional generated scenes; each story also retains a concise disclosure. Source lessons, captions, explanations, reflection questions, safety qualifications, references, PDFs, and all 58 scene assets are preserved.

Mobile scenes use 3:2 frames, while desktop and print retain 4:3 frames. Optional `focalPosition` / `mobileFocalPosition` fields on typed visual scenes control framing without changing the image files. The check-in and skill sequences use vertical timelines; connected experiences retain bidirectional arrows, and respectful listening uses a desktop row / mobile column. The desktop contents index follows the active section by adjusting only its own scroll position, with 44px minimum entry targets. Mobile retains the existing expandable contents panel. Print groups source examples with their associated visuals where they fit, includes expanded explanations, and restores disclosure states afterward.

Run `node scripts/review-learning-polish.mjs before` before editing and `node scripts/review-learning-polish.mjs after` after editing to generate five-width captures and comparison measurements in `artifacts/learning-polish/`. The recorded 375px story panels are 8–16.2% shorter, with all teaching content retained. `tests/learning-polish.spec.ts` covers source-heading associations, index scrolling without document movement, card alignment, typography, and responsive crops. Existing visual/source/navigation/slideshow tests cover the other preserved journeys.

For stable verification when the shared `dist/` folder is being rebuilt elsewhere, build with `npm run build -- --outDir artifacts/learning-polish/production`, serve with `npm run preview -- --host 127.0.0.1 --port 5176 --strictPort --outDir artifacts/learning-polish/production`, and set `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5176` for tests/captures. `node scripts/review-learning-visuals.mjs --print-only` refreshes print QA without repeating every screen capture. The print checker uses `pypdf` and `pdfplumber`; generated print PDFs are internal QA artifacts. No deployment or new connection is introduced.

## Blog and journal

`/blog` provides a featured read, six introductory articles, topic filters, full-text search, empty-result recovery, and shareable `topic` / `q` URL parameters. `/blog/:slug` offers individual reading pages with computed reading times, section navigation, related articles, official further-reading links, and support pathways. Search/filter context stays available when following section links or related posts and returning to the blog. The header, footer, and a compact homepage preview link to the journal.

Articles are typed local content in `src/blog/posts.ts`. Add a record with a unique slug, category, local image, sections, takeaway, and source links to extend the journal. Reading times are calculated at 200 words per minute. New copy is general educational reading, with source context checked on 8 November 2026; it is not presented as clinical assessment or medical review. There are no fabricated author profiles, endorsements, comments, or readership counts. No CMS, account, submission form, or publishing integration is configured.

Run `node scripts/review-blog.mjs` for desktop/mobile captures. `tests/blog.spec.ts` covers discovery, filters and history, reading navigation, source links, missing articles, keyboard access, reduced motion, and responsive layouts.

## Service catalog preview

Open `/services` for the separate wellness and mental health demonstration catalog. It remains reachable through the footer’s “Interactive previews” disclosure, separate from the official-resource support journey.

| Route                  | Experience                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/services`            | Eight example services, search and combined filters, optional preference questionnaire, accessibility FAQs      |
| `/services/:slug`      | Benefits, preparation, formats, example prices, sample professionals, availability, demo booking                |
| `/professionals/:slug` | Explicitly fictional profiles, unverified credential notice, offerings and sample availability                  |
| `/dashboard`           | Upcoming example appointments, saved services, history, rescheduling, cancellation, private feedback preview    |
| `/resources`           | Ten searchable resources, topic filters, reading dialogs, two downloadable plain-text worksheets                |
| `/admin-preview`       | Public demonstration of service/profile editing, availability management, booking status and enquiry management |

The booking dialog has details, review and confirmation steps. Contact inputs are used only within that dialog and discarded on completion or closure; appointments retain only a sample session reference, time, format, example prices and status. No POST requests, email, real bookings, joining links, payments or authentication are created. Everything stays in React memory and resets on refresh. The administration preview is intentionally public and must not be used for real data.

Rwanda mode shows illustrative RWF prices and `Africa/Kigali` session times. International mode shows independently configured USD examples and the browser's detected time zone. Switching region changes presentation without changing stored UTC appointment instants. English copy is used initially, with service/profile content structured in typed data for future localization; Kinyarwanda and French are demonstration service-language options, not website translations.

Service models and seed content are in `src/services/data.ts`; shared temporary state is in `src/services/DemoContext.tsx`. Filter preferences are reflected in the URL for browser history. Source photograph limitations from the original recreation still apply. All local images are illustrative and do not identify real providers or endorse services.

Urgent-help information distinguishes routine appointments from emergencies and links to official Government of Rwanda, Rwanda Biomedical Centre, RIB, and UNHCR information. International country-information directories are explicitly distinguished from emergency responders. Sources were checked on 8 November 2026; dates and caveats appear alongside the links. No clinical assessment is implemented.

For static hosting, configure an SPA fallback to `index.html` so direct links to these routes work. Vite's development/preview server supports the local routes. No site has been deployed or published.

## Hero slideshow

The hero has five mental health photographs showing one-to-one counseling, attentive listening, facilitated group support, human connection, and mental health learning. Each is served locally as a 2400 × 1600 WebP image with individual desktop and mobile focal positions. Photographer credits, original source URLs, and license links are recorded in `public/images/mental-health-slide-credits.json`. The photographs are illustrative; people shown are not presented as this website’s providers, clients, or endorsers.

The photos advance every 6.5 seconds in a smooth 900ms right-to-left transition. The final slide loops seamlessly into a duplicate of the first, then resets without animation. There are no visible slideshow controls or swipe navigation. Hovering or keyboard focus pauses rotation; focus the hero itself and press Space to resume or pause while focused. Rotation suspends when the hero is offscreen or the browser tab is hidden. Reduced-motion preferences disable automatic movement. The headline, navigation, and consultation buttons remain fixed over the photos.

The slideshow implementation lives in `src/HeroSlideshow.tsx`. To prepare its current images again, run `node scripts/prepare-mental-health-slides.mjs`; it uses retained source files when available and otherwise downloads the credited Pexels originals. The prepared images are already included, so the live page makes no external image requests. Earlier wellness images remain available for other sections; `scripts/download-hero-slides.mjs` pertains to that older set.

Topic navigation, support pathways, shareable resource filters, accessible reading dialogs, regional urgent-help information, and Quick exit work locally. The separate service previews retain catalog filtering, matching, saved services, and demonstration bookings. No support-intake form or diagnostic assessment is provided.

Reusable primitives and tokens remain in `src/system/`. The homepage is in `src/App.tsx`; new support layouts and scoped styles are in `src/support/`. DM Sans is bundled locally. Images are served locally, so the page makes no external image or font requests.

## Asset provenance and visual limits

The flattened screenshot is preserved as `artifacts/reference.webp`. Earlier photographic regions and a restored version of the original hero remain in `public/images/` for legacy preview pages. The current homepage uses the five local mental-health photographs described above. Its topic cards reuse those local photographs; no new images were downloaded for the support update.

`public/images/asset-provenance.json` records crop coordinates and the hero restoration prompt. To reproduce extraction, run `node scripts/extract-assets.mjs` followed by `node scripts/prepare-hero.mjs`; the latter uses the retained `artifacts/hero-restored.png`. Source photo edits are not needed to run or build the page.

Current support-page captures are in `artifacts/support-verified-{route}-{375,768,1024,1440,1920}.png`, with the root route named `home`. Earlier captures and `design-qa.md` document previous iterations. The component-library guide remains in `DESIGN_SYSTEM.md` as a reference for the underlying reusable components; its original showcase is no longer the homepage.

## Services catalog

`/services` has an editorial three/two/one-column layout, larger card typography, consistent local photo crops, and labeled Explore service actions. On mobile, the four advanced filters are expandable with a selection count; search, category tabs and removable chips remain accessible. URL parameters retain filter state through browser history. The optional ServiceCard presentation variant leaves saved dashboard cards unchanged. Responsive captures at 375, 768, 1024, 1440 and 1920 pixels are in `artifacts/catalog-polished-*.png`; verification details are in `design-qa.md`.

## Consistent public website

The homepage and inner routes share the responsive floating header, temporary BetterHelp mark, green actions, DM Sans typography, utility links, newsletter, and footer. Public navigation focuses on support topics, resources, About us, and Our work. Catalog, dashboard, profiles, stories, and administration previews remain in the footer’s “Interactive previews” disclosure. The regional price selector remains available on legacy service-preview routes, while support and urgent-help pages use a separate support-location selector backed by the same temporary preference.

Additional direct-link routes:

| Route        | Content                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| `/expertise` | Approaches, specialties, and active fictional professional profiles from the shared demo data |
| `/stories`   | Clearly labeled fictional scenarios with accessible reading dialogs                           |
| `/about`     | Mission, four values, privacy/accessibility approach, and project boundaries                  |
| `/contact`   | Local-only enquiry validation with cleared fields and explicit no-submission confirmation     |
| `/privacy`   | Current temporary state, form handling, downloads, assets, and external-link practices        |
| `/terms`     | Prototype-use boundaries and production-review requirements                                   |

Policy content describes this prototype and requires review before production use. Contact enquiries are not transmitted or added to administration records. No backend, authentication, persistence, or deployment is introduced. Public-page responsive captures use `artifacts/public-{home,expertise,stories,about,contact,privacy,terms}-{375,768,1440}.png`.

## Community news, events, and workshops

`/community` is the shared community hub, linked from the homepage, main navigation, and footer. It supports stories (the existing `news` URL value), videos, events, workshops, and photo albums. Search, content-type, and topic filters use shareable `q`, `type`, and `topic` parameters. Detail and related-content navigation retain the discovery filters. Existing `/community/:slug` addresses are preserved.

The public hub and homepage currently include seven replaceable demonstration records: two stories, two locally playable films, one photo album, and two fictional activities. Demo banners and individual card/detail labels distinguish these from real community activity. No sample activity accepts registrations. Populated sections appear in this order: featured item, Watch & Learn, upcoming activities, stories and albums, then unified discovery. Discovery separates upcoming, past, and cancelled activities.

To replace the demos, edit `src/community/demo-content.ts`, or add real approved records with matching slugs to `editorialEntries` in `src/community/content.ts`; real records take precedence. Set `SHOW_COMMUNITY_DEMOS = false` in that file to remove all demo records at once. Keep `demo: true` while a record is fictional. Remove it only when the story/media and any event details have been confirmed. The existing public slugs remain unchanged. `public/community-demo/` contains the media, captions and credits: a 12-second silent montage derived from the existing illustrative photographs, plus a five-second MDN CC0 nature clip. Both videos load only after interaction and have matching descriptive transcripts and WebVTT captions.

Add approved records to `editorialEntries` in `src/community/content.ts`. Set `status: "published"`, `mediaApproved: true`, and `template: false` only after editorial/media review. Supply the title, summary, local cover image and alternative text, sections, and topics. Use the original slug when replacing a template; its template preview is then superseded. Optional `featured`, `relatedSlugs`, and `resources` connect records and learning material. Mark illustrative images honestly; approval does not turn an illustrative image into an outreach photograph. Draft records are not private secrets: this is a static frontend, not an authenticated CMS.

Events and workshops require an audience and confirmed schedule: offset-bearing ISO `startsAt`, valid IANA `timeZone`, location, and format. Optional `endsAt` keeps an activity current until it ends; otherwise its start marks the upcoming/past boundary. `cancelled: true` labels cancellation and suppresses registration. Only current, non-cancelled activities expose optional HTTPS organiser `registrationUrl` links. There is no registration collection on this site.

Video records use `kind: "videos"` and `video: { source, durationSeconds, language, captions, transcript }`. Source is `{ provider: "youtube", id: "11-character-id" }` or `{ provider: "local", src: "/videos/approved-recording.webm" }`. Captions are local WebVTT files with `{ src, language, label }`; provide matching closed captions on the YouTube upload too. Local files go in `public/`. The player loads only after an explicit click, never autoplays, and offers transcripts, caption downloads, retry, and YouTube fallback links. The browser's native video controls start playback after loading. No player is loaded for transcript-only reading.

Album records use `kind: "albums"` and `photos`, with each photo providing `id`, `src`, descriptive `alt`, `title` (caption), `category`, focal `position`, and `illustrative`. The viewer supports buttons, arrow keys, Escape, focus containment and restoration. Obtain the appropriate permissions before marking media approved.

`src/community/repository.ts` defines the content boundary (`list` and `get`), publication checks, sorting, search, and event helpers. A future CMS adapter can implement the same interface without replacing the UI. Staff accounts, uploads, persistence, CMS tooling, visitor accounts, and comments are deferred.

Legacy templates are available only with `?preview=templates` on the development server, including direct detail URLs. Production ignores that parameter. This is a development aid, not an authenticated preview portal. Automated test records and the labelled test harness live in `tests/fixtures/` and are not part of the production entry or build. Run `npx playwright test tests/community.spec.ts tests/community-pages.spec.ts tests/community-media.spec.ts tests/navigation.spec.ts`. Tests cover public empty states, template isolation, filters/history, publication validation, local playback and failure recovery, click-only YouTube connections, event dates/registration, and responsive album accessibility.

## Community outreach gallery

The homepage Community & Outreach section immediately above the newsletter now reads the same published collection as the hub. It shows up to three recent entries, or an honest empty state. The former independent illustrative gallery no longer appears as public outreach content. `src/community/photos.ts` retains the photo type and legacy illustrative records for reference and test fixtures; published albums supply their own approved photo records.

Obtain permission from people pictured before publishing identifiable outreach media. No uploads, registration form, invented attendance figures, or outreach outcomes are introduced. Current responsive screenshots are generated by the community browser tests; older review scripts and captures describe the former gallery.

## Awareness learning page

`/awareness` combines three educational introductions, five audience perspectives, fictional conversation starters, programme descriptions, six curated resources, and FAQs. Its dedicated `src/awareness/` module uses the shared site design and resolves existing resource identifiers without importing chapter bodies. Audience selections are temporary; the page adds no forms or browser storage.

`loadAwarenessContent()` is the local content boundary. Community remains the source for activities: only published, media-approved, non-template, non-illustrative entries with a publication date qualify. Otherwise an explicit empty state appears. Sources were checked on 11 November 2026; independent specialist review is still pending and is disclosed on the page.

The Awareness illustration refresh uses four AI-generated fictional scenes: a community reading terrace, study support, personal device choice, and a calm check-in between relatives. The page preserves the full compositions and labels them accurately. Resource cards reuse four existing chapter covers, the existing About listening illustration, and the new check-in scene. No programme-delivery imagery or claims were added. Source content and its checked date remain unchanged.

Artwork mappings and contextual alternative text live in `src/awareness/illustrations.ts`. Original PNGs and the complete generation prompt set are retained in `artifacts/awareness-refresh/`. Run `node scripts/prepare-awareness-illustrations.mjs` to rebuild the 480/960/1440px WebP variants and public provenance manifest in `public/images/awareness/`. All twelve variants total approximately 527 KiB. Captures and verification output are retained in `artifacts/awareness-refresh/`.

A later headless CMS adapter should preserve the content contract, with editor/publisher roles, draft/review/published states, revision history, preview, sources, and review dates. That backend is deferred. Focused checks are in `tests/awareness.spec.ts`; baseline and completed responsive screenshots are in `artifacts/awareness/`.

## Newsletter configuration

The shared footer includes the BetterHelp Letter signup section at `#newsletter`. It remains unavailable while no mailing-list service is configured; no addresses are collected and no subscription is claimed.

To connect it later, copy `.env.example` to `.env.local` and set `VITE_NEWSLETTER_ENDPOINT` to your own newsletter API URL. The frontend POSTs JSON `{ "email": "reader@example.com" }` without cookies or browser storage. The API must return JSON `{ "status": "subscribed" }` only after an accepted subscription, or `{ "status": "confirmation_required" }` after starting double opt-in. Other responses show a retry message, never a success confirmation. Provider credentials belong on the server, never in a `VITE_*` variable. Update the privacy notice with the selected provider before activating signups. Restart Vite after changing environment variables and rebuild for deployment.

The optional configured-state browser review uses a separate Vite preview with `VITE_NEWSLETTER_ENDPOINT=/api/newsletter` on port 5174, then `node scripts/review-newsletter.mjs`. That script intercepts API requests and makes no real subscriptions. Regular browser tests check the default unconfigured state.
