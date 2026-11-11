# Visual and functional QA

## Mental Health chapter library — ten illustrated covers, 11 November 2026

Refreshed only the Why Mental Health listing page. All ten chapter covers now use coherent, content-specific flat 2D scenes. The first seven accepted covers are byte-identical. Three new built-in ImageGen assets depict evening rest, respectful peer connection, and distinct child/adolescent interactions with attentive adults. Reviewed the existing scenes and each new illustration for educational relevance, anatomy, expression, age, safe context, and complete mobile framing. The library retains its reading hero, with a mobile height reduction from 817px to 698px at 375px. Chapter cards use a consistent two-column layout above 650px and one column below, with aligned actions and uncropped 3:2 artwork.

All titles, summaries, reading information, language labels, routes, section counts, and educational-draft notices are preserved. The library derives its ten chapters and 210 sections from source data; Grief has 20 sections. The source readers, internal teaching visuals, PDFs, worksheets, print behavior, homepage, and shared navigation were not edited. An audit covered 372 pre-existing source/download/asset files: 371 remain byte-identical; one concurrently changed GBV-only stylesheet (`src/learning/gbv/chapter-01.css`) was preserved and explicitly excluded from this task's integrity assertion.

The 40 affected browser checks pass across the main run and targeted follow-ups. The first run completed 29 checks before the pre-existing preview server stopped. It was restarted, and interrupted checks were rerun. Follow-up exposed the inherited wide-screen three-column rule and a keyboard-test modality assumption; the library now scopes its two-column rule explicitly, and the test uses actual Tab navigation. A cold reader-load timeout passed on the subsequent check. No source reader changes were needed. Coverage includes exact catalog metadata, all ten keyboard chapter links, search/reset, back navigation, image failures, reduced motion, source integrity, downloads, and existing reader/print regressions. An additional keyboard check at 375 and 1440px verifies that the Explore the chapters anchor receives focus below the floating header, using a library-scoped scroll margin.

Final layout evidence covers 375, 768, 1024, 1440, and 1920px: no horizontal overflow, failed cover assets, or browser errors. All 96 sampled text contrast checks meet their applicable threshold. Captures include full pages, library heroes, and the three new cards. Full-page captures preserve the floating header; isolated element screenshots can include that header when the browser scrolls the target beneath it. The independent ten-cover inventory shows each complete composition. Evidence: `artifacts/mental-health-library-ten/verification.json`, `after/`, and `handoff.json`.

TypeScript, the final production build, and scoped formatting checks pass. Existing React Router use-client bundling warnings remain nonfatal. The optimized cover directory contains thirty WebP variants (480/960/1440px), with the three new 960px assets totaling about 117 KB. Complete prompts, provenance, source hashes, and review notes are in `public/images/learning/mental-health-covers/provenance.json`; retained new PNG originals are in `artifacts/mental-health-library-ten/originals/`. Artwork is raster, not editable vector. All ten library covers are complete; internal chapter illustration work remains a separately selected task.

## Mental Health Chapters 8–10 — 11 November 2026

Added the complete Sleep, Relationships, and Child and Adolescent Mental Health chapters. The library now contains ten chapters in numerical order and 210 reader sections. All 31 new source pages were read and visually reviewed. The continuation preserves 62 ordered sections, 14 scenarios, 13 optional activities, 30 answers, 23 references, and five tables containing 68 cells. Original headings, differing numbering, cover information, safety qualifications, and educational-draft notices remain intact.

The separate importer audits ordered section text, front matter, independent whole-document character coverage, and reconstructed table cells. All audits pass, and all three downloadable PDFs have the same SHA-256 hashes as the supplied originals. Activity downloads include their complete source instructions and safety notes. Evidence: `artifacts/mental-health-08-10/source-audit.json` and `public/learning/mental-health/source-manifest-08-10.json`.

All 61 affected browser checks passed across the main run and targeted follow-up: the 45 existing learning checks passed, and all 16 new continuation checks passed after correcting a test assumption about search. Searching “sleep” legitimately finds relevant sections in multiple chapters. Coverage includes all ten readers, numerical ordering, direct links, browser history, citation targets including the printed R-prefix citations, unchanged PDF downloads, complete activity downloads, keyboard access, optional answers, contents navigation, print disclosure restoration, and absence of new forms or persistence.

The library and three new readers were captured at 375, 768, 1024, 1440, and 1920px. All 20 route/width checks report no horizontal overflow, failed images, or runtime errors. Reviewed 55 captures covering headers, full pages, chapter cards, and scenario layouts. The existing local card photographs are reused; the original seven chapters' teaching visuals remain unchanged. Evidence: `artifacts/mental-health-08-10/screens/results.json` and the captures in that directory.

Printed all three new readers to A4 and visually reviewed all 41 rendered pages: Sleep 14 pages, Relationships 14, and Child and Adolescent Mental Health 13. All 539 checked source text units are present; no pages are blank and no text lies outside page bounds. All 24 checked scenario and activity groups remain together. A print-only adjustment keeps short activity blocks and their safety notes together in Mental Health readers without supplemental visuals. Answers and source disclosures expand for printing, then restore their previous states. Evidence: `artifacts/mental-health-08-10/print/audit.json`, `print/results.json`, and the rendered page sheets.

TypeScript, the production build, and formatting checks pass. Existing nonfatal React Router bundling warnings remain. This continuation does not change the homepage, slideshow, booking system, backend, or persistence. The Content Library Guide documents the collection, source variants, reference-marker handling, and verification commands.

Ten selected official reference/contact records were checked separately on 11 November 2026. The source Sleep chapter's opening map does not match its later section numbering; the original map remains unchanged and the discrepancy is recorded for editorial review. This is a selected reference check, not clinical or publication approval. Details: `public/learning/mental-health/reference-review-08-10.json`.

## GBV Chapters 4–10 — 11 November 2026

The user confirmed that these seven GBV documents belong in Understand GBV, using the detailed shared chapter reader. The library now contains ten chapters in numerical order and 192 reader sections. All 73 new source pages were read and visually reviewed. The continuation preserves 135 ordered reader sections, 34 scenarios, 35 optional activities, 70 explained answers, 52 references, and six tables containing 74 cells. Original editions, printed numbering, cover material, safety qualifications, and publication-review notices remain intact.

The separate continuation importer records per-section source coverage, independent whole-document character coverage, front-matter coverage, and table reconstruction checks. All seven downloaded PDFs have the same SHA-256 hashes as the supplied originals. Chapter 5’s five flattened comparisons are restored as readable tables without dropping source words; Chapter 10’s table retains its source geometry. Chapter 9’s numbered bibliography and Chapter 10’s unnumbered bibliography retain their original markers. Evidence: `artifacts/gbv-continuation/source-audit.json` and `public/learning/gbv/source-manifest-04-10.json`.

The full GBV browser run passed all 43 tests. A subsequent 20-test shared-reader and responsive follow-up also passed, covering all seven Mental Health readers, the seven new GBV readers, contents-panel scrolling, source rendering, and mobile indexes. Coverage includes chapter ordering, browser history, direct links, citation targets, unchanged PDF downloads, complete activity downloads, keyboard access, optional answers, print disclosure restoration, and the absence of forms, submissions, or new persistence. The follow-up checked the fix that prevents long contents links from shrinking and overlapping.

Final captures cover the library and seven new readers at 375, 768, 1024, 1440, and 1920px: all 40 route/width checks report no horizontal overflow, missing images, or browser runtime errors. Reviewed headers, chapter cards, long-title wrapping, contents navigation, and source scenarios. Existing local card photography is retained. The original 32 GBV teaching images and eight diagrams remain associated with Chapters 1–3; no new generated scenes are claimed for Chapters 4–10. Evidence: `artifacts/gbv-continuation/screens/results.json` and the 115 captures in that directory.

All seven new readers were printed to A4 and all 94 rendered pages were visually reviewed. The print audit found all 1,150 expected text units, no blank pages, and no text outside page bounds. Answers and source disclosures expand for printing and their previous states restore afterward. Original source PDFs remain separate from these browser-print QA artifacts. Evidence: `artifacts/gbv-continuation/print/audit.json`, `print/results.json`, and the rendered page sheets.

TypeScript, the final production build, and formatting checks pass. Existing nonfatal React Router bundling warnings remain. The homepage, slideshow, booking features, and backend were not changed by this continuation. The content handoff guide documents the new collections, import process, interfaces, source corrections, and verification commands.

Key Rwanda referral listings and WHO care guidance were checked separately against official pages on 11 November 2026. This is a selected-source check, not an exhaustive bibliography review or clinical, legal, safeguarding, or publication approval. The historical law portal and an NCBI browser-verification page need manual review; the original source claims remain unchanged. Details: `public/learning/gbv/reference-review-04-10.json`.

## Mental Health Chapters 3–7 — 9 November 2026

Expanded the Mental Health library to seven complete readers. The dedicated continuation importer preserves the five supplied PDFs' 50 pages, 115 ordered sections, 17 tables, 21 main scenarios, front matter, references, exercises, answers, and editorial material. Original printed numbering and Grief Parts IV–VII remain intact. Per-section, independent whole-body, and front-matter audits pass; the five locally served PDF hashes match the audited originals. Source evidence: `artifacts/mental-health-source-review-03-07.json`.

Added 42 fictional teaching scenes, ten concept diagrams, and 18 compact skill sequences. Both scenes remain visible, with editable captions, source-heading associations, optional explanations/reflections, alternative text, image-failure descriptions, and individual crop settings. All 42 images were generated with the built-in image tool and inspected for source alignment, continuity, anatomy, expression, and non-graphic settings. Originals, complete prompts, and per-story review notes are in `artifacts/learning-visuals/`; responsive files and the combined 58-scene provenance manifest are in `public/images/learning/`. The original 16 scenes remain available.

The affected 86-check browser set passed across the full run and its targeted follow-up: 85 checks passed in the final full run; the remaining library-navigation check exposed a continuing-series notice removed by concurrent layout work. The explicit future-chapter message was restored within that layout, and the isolated check then passed. Coverage includes all seven readers, source rendering, navigation/history, keyboard access, contents-panel scrolling, downloads, image failures, native explanations/answers, privacy, reduced motion, shared navigation, floating header, and slideshow behavior. A separate final 40-check learning run and 15-check layout follow-up also passed before the shared-layout consolidation.

Refreshed 300 captures at 375, 768, 1024, 1440, and 1920px. All 30 library/reader layout checks report no horizontal overflow, missing images, or browser errors. Reviewed the library, chapter headers, scene crops, and diagram layouts; four-step support sequences use an unbroken vertical flow, and four-item influence diagrams use balanced pairs. Evidence: `artifacts/chapters-03-07/screens/`, `screen-sheets/`, and `screen-checks.json`. Concurrent shared-reader and library-layout changes were preserved and checked with the continuation.

Printed all five new readers to A4: Stress 23 pages, Anxiety 25, Depression 20, Trauma 22, and Grief 22 (112 pages). The print audit checks 897 source text blocks, 384 supplemental text blocks, all 17 table headers/first rows, ten native question-answer pairs, all 49 new visual units, and 42 printed scene images. No source or supplemental text is missing, no checked visual unit or question-answer pair is split, no table header is orphaned, and no text lies outside page bounds. Reviewed all 112 rendered pages in 19 contact sheets. Answers/explanations expand for printing and prior disclosure states restore afterward. Evidence: `artifacts/chapters-03-07/review/print-checks.json` and `print-pages/`. Browser-print PDFs are QA outputs; source downloads are unchanged.

TypeScript, production builds, and formatting checks for the affected Mental Health files, shared reader, tests, scripts, and documentation pass. No new backend, accounts, persistence, sensitive intake, diagnostic quiz, or required exercise completion was introduced by this continuation. The homepage and slideshow source were not changed by this work.

Final source rendering was rechecked on the live development server for all seven chapters after the shared-reader consolidation: all seven checks passed.

Reference retrieval is separate from clinical review: 16 official URLs were retrieved, four returned HTTP 403 to automated access, and one printed DSM bibliography entry has no URL. The original citations are retained. Manual link verification and the source documents' clinical/editorial review requirements remain outstanding before publication; no approval is implied. See `artifacts/mental-health-reference-review-03-07.json`.

final result: passed

Scope: close visual recreation of the flattened reference, with the photographic and font limitations agreed in the implementation plan. This is not a pixel-identical reconstruction or an accessibility certification.

## Evidence

- Reference: `artifacts/reference.webp` (1024 × 4023).
- Desktop comparison: `artifacts/landing-1024.png` (same 1024px viewport width and default selection state).
- Responsive captures: `artifacts/landing-375.png`, `artifacts/landing-768.png`, `artifacts/landing-1440.png`.
- TypeScript and production build: passed.
- Full browser suite: 13 passed. Final responsive-only rerun: 4 passed after the last desktop typography adjustment.

## Visual review

All major sections are present in the reference order. The white page on beige, full-width photographic hero, yellow primary accents, 2+1 course feature row, three-card course row, asymmetric event row, offset plan selector, service panels, testimonial strip, and oversized footer wordmark are reproduced. At 1024px, the page height is approximately 4066px versus the source's 4023px, including its outer canvas. Primary reference heading wraps and the broad section spacing are maintained. At larger desktop widths, heading sizes and spacing scale with the content. Narrow layouts reflow into readable stacks and two-column cards rather than shrinking the desktop screenshot.

Corrected during QA: full hero composition restored; service photo no longer crops the face away; lazy photos are decoded before full-page capture; mobile heading whitespace and card packing corrected; header arrow no longer squeezed; modal Tab/Shift+Tab cycles within its controls.

## Functional review

Search and filters change courses; unavailable matches show a reset action. Products and mentors change visible content. Detail actions open dialogs. Consultation fields use native validation and show an explicit local-only outcome. Newsletter validation makes no network submission. Plan selection changes its description and label. Testimonial arrows and review buttons change content. The story opens a text alternative, never a nonfunctional media player. Navigation anchors, mobile menu, Escape dismissal, restored focus and reduced-motion behavior are exercised in browser tests.

All four viewport checks report no horizontal overflow and no uncaught browser exceptions. All image assets load. Fonts and photographs are local.

Final capture also checks console errors and failed network requests: none. A missing favicon discovered by this check was replaced with a local vector icon.

## Acknowledged differences

- Hero: reconstructed with built-in ImageGen to remove embedded text and controls; fine photographic details differ from the original.
- Other photography: crops taken from the screenshot have less resolution and tighter framing than the unavailable originals.
- Font: locally bundled DM Sans is a close visual approximation, not a confirmed source font.
- Decorative logo linework and smile icon are vector approximations. The screenshot's story thumbnail retains its embedded play artwork.
- Some copy spacing is corrected for mobile readability. Footer external links use local explanatory dialogs; no external company destinations or source video were supplied.

No unresolved broken interactions or layout blockers remain. Remaining differences require original source photography/font files for exact reproduction.

## Full-screen hero slideshow update

The outer beige margins were removed at the user's request. The desktop hero now fills the viewport and the page is edge to edge. The hero subsequently became a five-image slideshow: the restored portrait plus four high-resolution yoga, meditation, movement and nature photos from Unsplash, stored locally. Added image widths are 2400px; the original portrait remains at its native 1542 × 1020. Credits are recorded in `public/images/hero-slide-credits.json`.

Current browser suite: **18 passed**, covering the original flows plus all five slides, wrapping navigation, autoplay, pause/resume, reduced motion, keyboard selection and mobile swipe. Desktop captures of each image are `artifacts/hero-slide-1.png` through `artifacts/hero-slide-5.png`; mobile capture is `artifacts/hero-slideshow-mobile.png`. Visual review confirms the headline and consultation panel remain readable, the controls do not overlap navigation, and the full-width layout remains intact. Crossfade duration is 1.1 seconds; automatic advancement is 6.5 seconds. Rotation pauses on hover, focus, manual selection, offscreen visibility and hidden browser tabs. Reduced-motion mode starts paused and disables fades.

## Clean automatic slideshow revision

The visible slideshow bar, counter, dots, arrows, and play/pause controls are removed. Images advance right to left every 6.5 seconds with a 900ms transform transition. A duplicate first frame and a transition-free track reset make the fifth-to-first loop continue in the same direction without a flash. Main navigation, headline, and consultation actions remain stationary. Manual slide selection and touch swipes are removed.

Current verification: **19 browser tests passed** and production build passed. Tests check image loading, absence of slideshow controls, the incoming photograph moving from the right, fixed overlay positions, all five automatic steps, seamless loop reset, hover/focus/Space behavior, offscreen pause, reduced-motion inactivity, and removal of swipe navigation. Existing page flows and responsive checks also pass. Final browser capture reports no console errors, failed requests, or horizontal overflow.

Reviewed captures: `artifacts/hero-clean-slide-1.png` through `artifacts/hero-clean-slide-5.png`, `artifacts/hero-sliding-mid-transition.png`, and `artifacts/hero-clean-mobile.png`. These supersede the older slideshow captures. Focus the hero and use Space to resume/pause while focused; reduced-motion preferences keep movement disabled.

## Services experience verification

The homepage and clean hero slideshow remain intact. New routes cover the service catalog, eight service detail pages, four fictional professional profiles, My space, resources, and a public administration preview. All data is temporary React state; refresh restores seed examples. No real accounts, care, payments, external booking requests, email, or video links are created.

Verification: combined homepage/slideshow/service suite **32 passed**. Following the final provider/format eligibility adjustment, the service-only regression suite **14 passed**, including the added paused-profile regression. Production TypeScript check and Vite build passed. Vite emits benign React Router `use client` directive warnings during bundling; no runtime console errors were found.

Covered journeys: homepage Service navigation; direct routes and browser back/forward; rapid combined filters; available-time filters and empty states; preference matching and no-match explanations; service-to-professional-to-booking-to-dashboard; native field validation; contact discard and absence of POST/storage writes; regional RWF/USD and Kigali/browser-zone presentation without shifting appointment instants; free group registration; saved services; rescheduling; cancellations; history; private feedback; searchable articles; worksheet downloads; admin edits/additions, schedules, enquiry status, paused profiles and edited formats; official urgent-support links; unknown-route handling.

All six route types were captured at **375px, 768px, and 1440px** with no page-level horizontal overflow or browser exceptions. Admin tables scroll inside their own container on small screens. Captures are `artifacts/services-{catalog,detail,profile,dashboard,resources,admin}-{375,768,1440}.png`. Reviewed desktop/mobile catalog, detail, dashboard and administration captures. Booking mobile screenshots are `artifacts/service-booking-mobile.png` and `artifacts/service-booking-review-mobile.png`; step changes now focus the dialog heading, confirmed in the browser.

Boundaries: demo profiles are fictional and credentials are explicitly unverified; prices are illustrative and independently specified per currency; in-person locations are placeholders in Kigali. Resource content is general information, not clinical assessment or treatment. Administration is public because it contains sample data only. English UI is implemented; service language filters do not imply translated site content. Two worksheets download as plain-text files. Static hosting requires an SPA fallback for direct route access.

Urgent-help source checks: Government of Rwanda emergency page (https://www.gov.rw/emergency), Rwanda Biomedical Centre contact page (https://rbc.gov.rw/contact), and international directory verification information (https://findahelpline.com/about), checked 8 November 2026. Routine appointments are explicitly separated from emergencies; the site does not monitor or respond to urgent situations.

## Services catalog polish

The catalog uses a scoped editorial card presentation, with three columns from 1024px, two on tablets, and one on mobile. Titles are 22px, descriptions 14px, image proportions consistent, and Explore service actions remain labeled. Saved dashboard cards keep their default presentation. Local photography, service data, prices, booking behavior and the homepage slideshow are unchanged.

Search and category remain prominent. All four advanced filters are visible on desktop; mobile visitors can expand Filters, see an active advanced-filter count, and close the panel without losing selections. Removable chips, Clear all, direct query links and browser back/forward share the URL state. Matching questions and recommendation logic are unchanged; only dialog spacing and type were refined.

Responsive captures: artifacts/catalog-polished-{375,768,1024,1440,1920}.png. All images are decoded before capture. Checks cover the expected column counts, readable card type, horizontal overflow, labeled actions and reduced-motion rendering, plus mobile filter persistence, chip removal, reset, empty results and URL history.

Final verification: TypeScript and production build passed. The full 39-test run had 38 passes and one administration timeout when its newly added temporary service disappeared during live source updates; the isolated administration rerun passed (9 seconds). The prior 20-test catalog/service run passed in full. All six new catalog tests passed, including the five requested widths, filter count/persistence, chip focus, history, reset and empty results. Homepage and slideshow regressions passed. Vite retains its existing benign React Router directive warnings.

## Green branding and visible navigation

Primary accents now use fresh leaf green #9DE65A, with #89D749 hover, #286340 accent text and #EAF6E0 soft backgrounds. Homepage navigation has an opaque white surface, dark links, a selected-link underline, green booking actions and an opaque mobile menu. Shared service branding uses the same tokens. The service announcement bar now describes wellness and mental health support. Accurate booking/profile limitations remain until live infrastructure and genuine service data are supplied; this visual change does not activate real appointment submissions.

Visual browser checks passed at 375, 768 and 1440px for solid headers, green actions, mobile navigation, no horizontal overflow and no runtime exceptions. Captures: artifacts/green-home-{375,768,1440}.png, artifacts/green-services-{375,768,1440}.png and artifacts/green-mobile-menu.png. TypeScript and production build passed.

Green-theme regression suite: 25 passed (homepage, slideshow and catalog checks). An optional imagegen attempt to remove the original promotional portrait's embedded yellow backdrop did not complete and was stopped; the original asset remains unchanged. All editable interface accents use the green tokens. Live bookings, real provider data, persistence and authentication are not activated by this branding update.

## Green interface finishing pass

Polished the shared navigation and green homepage with a single-row mobile header, a concise mobile booking label (its accessible name stays Book a consultation), a region selector within the mobile dropdown, consistent active states and visible focus, and Escape/outside-click dismissal. Region selection remains directly available from 1001px upward; the intermediate-width header no longer wraps. The dropdown is height-limited and scrolls on short screens.

The homepage now has a darker, more even photographic overlay, clearer proof-card type, softer card edges, consistent green hover states, and a framed promotional portrait. Its source photograph is retained unchanged; the inset white frame separates its baked-in yellow backdrop from the green card. The promotional heading is shorter to avoid awkward mobile word breaks. Shared public cards and footer links also received restrained contrast and spacing refinements. No service, price, booking, persistence, or slideshow timing logic was changed.

Responsive browser checks passed at 375, 768, 1024, 1440 and 1920px: no page overflow or header-item collisions, solid white navigation, a compact mobile header, working region selection and menu dismissal/navigation, and no runtime or console errors. Captures are artifacts/polished-{home,services}-{width}.png and artifacts/polished-menu-{375,768}.png. TypeScript and production build passed.

## Consistent website and public pages — 8 November 2026

Shared chrome now connects the homepage and all inner routes: one logo, public navigation, My space and consultation utilities, regional preferences, a responsive menu with Escape/outside-click dismissal, and a relevant footer. Intermediate desktop widths use two header rows so My space and the region selector stay available. The homepage slideshow remains unchanged. Consultation actions use the existing service-selection and booking journey, whose details/review/confirmation steps now have a progress indicator. Service details include a desktop booking sidebar and a separate mobile booking action without overlapping content.

New routes: `/expertise`, `/stories`, `/about`, `/contact`, `/privacy`, and `/terms`. Expertise reads active professionals from shared temporary data. Stories open accessible reading dialogs and are explicitly fictional. Contact validates and clears its fields without creating a request or retaining data. Policies describe prototype behavior and explicitly require review before production. Source-template corporate footer content and unsupported homepage outcome statistics were removed.

Verification: final TypeScript/Vite production build passed. The 44-test suite produced 43 passes and identified one intermediate-width My space visibility failure. After the final header correction, all four targeted regressions passed: catalog at 1024px, homepage at 1024px, regional currency/time-zone switching, and paused-provider/rescheduling/changed-format behavior. All 44 scenarios therefore passed across the full run and targeted rerun; no known failing scenario remains. Existing benign React Router bundling directive warnings remain.

Automated Edge captures cover the homepage and six public pages at 375, 768, and 1440px, plus service catalog, details, profile, dashboard, resources, and admin at those three widths. No page-level horizontal overflow or runtime errors were reported. Catalog checks additionally cover 1024 and 1920px. Captures are `artifacts/public-{home,expertise,stories,about,contact,privacy,terms}-{375,768,1440}.png` and `artifacts/services-{catalog,detail,profile,dashboard,resources,admin}-{375,768,1440}.png`; final 1024px captures use the existing landing/catalog capture names.

Visual spot checks covered Expertise mobile, About desktop, Contact mobile, Stories tablet, Privacy desktop, Terms mobile, service details mobile, profile tablet, dashboard desktop, resources desktop, and admin mobile. Existing lower-resolution reference crops remain illustrative. Automated captures were available even though interactive browser access was disabled; this is not a full assistive-technology accessibility certification. No backend, authentication, persistence, real care, or deployment was introduced.

Final layout note: the latest shared header retains My space alongside booking at intermediate desktop widths, with the complete navigation arranged in two explicit aligned rows. Mobile remains a compact single row with a dropdown. Existing local photography and all booking/service boundaries remain intact.

Finishing-pass regression result: all 44 browser tests passed, including homepage, public pages, service journeys, regional presentation, catalog filters and slideshow motion/pause/reduced-motion behavior. TypeScript and Vite production build passed; only the existing React Router directive warnings remain.

## Mental-health learning finishing pass

Polished the chapter library and both readers while retaining the original generated source records, PDFs, 16 scene assets, captions, explanations, reflection questions, and safety qualifications. The library has a shorter mobile hero and aligned cards with visual-learning indicators. Prose is approximately 16px on desktop and 15px on mobile; scene captions remain 14px, with supporting labels raised to at least 12px. Seven supplemental titles are replaced by accessible references to the original example headings, avoiding duplicate visible titles. Privacy and learning-choice guidance appears once per chapter introduction, and every story retains a concise fictional/AI-generated disclosure.

Scenes retain a 4:3 desktop/print ratio and use 3:2 mobile frames with optional per-scene focal positions. Inspected all 16 mobile crops: faces, shared tasks, study materials, phones, and conversational gestures remain visible. Reduced panel padding and repeated framing produce measured 375px story-height reductions of 8–16.2%; every one of the eight stories is shorter. Measurements are in `artifacts/learning-polish/comparison.json`, with 105 before and 105 after captures across 375, 768, 1024, 1440, and 1920px. No overflow, image-loading failures, console errors, or uncaught exceptions were found. The library chapter section appears earlier at all recorded widths.

The desktop index has 44px minimum entries, stronger active states, and keeps the current section in view by adjusting only the index's own scroll position. A browser check confirms that this does not move the document. Mobile keeps the existing expandable contents, direct section links, and focus behavior. The emotional check-in and skills use vertical timelines, connected experiences use bidirectional links, and respectful listening follows a desktop horizontal / mobile vertical sequence. Missing-image descriptions, optional native disclosures, reduced motion, download links, and source references remain intact.

All 57 affected browser regression tests passed, covering the new polishing checks, visual lessons, complete source fidelity, navigation, floating header, and automatic slideshow. TypeScript and production builds passed. Verification used a dedicated production folder after the shared `dist/` output changed during the first run and caused a transient 404; no application fallback or test retry was added to hide the failure. The remaining initial assertion was updated for the new privacy note's punctuation. The successful rerun used `artifacts/learning-polish/production` on port 5176.

Print QA verifies that original example headings remain with their photo stories where they fit, all visual units remain intact, all 16 scene images are printed, and all 142 captured visual text blocks are present within page bounds. The seven removed supplemental headings account for the reduction from the previous 149 visual text blocks. All 38 printed pages were visually reviewed (17 in Chapter 1, 21 in Chapter 2); final print evidence and seven contact sheets are in `artifacts/learning-polish/print-final/`. After hiding decorative print-only section kickers to avoid orphaned labels, both affected print tests passed again and print content/bounds checks passed again. These are QA copies; source PDF downloads remain unchanged. Editorial illustrations are still deferred, and this pass adds no image generation, external assets, submissions, persistence, or backend integration.

## Visual learning for both mental-health chapters

Added eight two-scene photo stories, five concept diagrams, and five compact skill sequences within the existing readers. The original generated lesson records and PDFs are unchanged. Visual stories sit directly after their corresponding example paragraphs; the work-meeting story and concept/skill diagrams sit within the relevant source sections. All scene captions and diagram text remain editable English content in a separate typed collection linked by chapter slug, section ID, and source-example label.

The built-in image-generation tool produced 16 fictional photographic scenes with natural daylight and consistent characters within each story. Every original was visually inspected for character continuity, anatomy, expressions, lesson alignment, and absence of embedded explanatory labels. The examples represent everyday circumstances relevant to readers in Rwanda without claiming actual locations, real participants, diagnoses, or guaranteed outcomes. Generated-scene disclosure is visible in every story. Existing chapter photography remains unchanged; editorial illustrations are deferred. Originals and the complete prompt set are in `artifacts/learning-visuals/`; responsive 640 × 480 / 1280 × 960 WebP assets and provenance are in `public/images/learning/`. All 32 responsive files total 2,886,668 bytes.

Both scenes and their captions are visible in reading order, with two columns on larger screens and a single column on mobile. Native optional explanations and private reflection prompts introduce no forced progression, forms, scores, or storage. Semantic lists and description lists provide complete text equivalents for diagrams; decorative icons are hidden from assistive technology. Lazy images have explicit dimensions and alt text. Failed-image states retain the scene description, caption, and explanation. Five skill sequences preserve their source limits, including stopping uncomfortable exercises, prioritizing physical safety, and seeking appropriate support.

The 25 targeted visual/source-learning browser tests passed. All 18 visual units were captured at 375, 768, 1024, 1440, and 1920px with zero image failures, document-level overflow, console errors, or uncaught exceptions. Reviewed desktop/mobile story composition, diagram connections, captions, disclosure behavior, and context below the floating header. Captures and the result report are in `artifacts/learning-visuals/review/`; reproduce with `scripts/review-learning-visuals.mjs`. TypeScript and the production build passed. The chapter bundle remains separate from the unchanged-size shared 484 kB JavaScript bundle.

Print QA includes the visual explanations and restores disclosure states afterward. Original print downloads remain unchanged; browser-print PDFs are QA-only artifacts. The print checker verifies all 149 visual text blocks across both chapters and checks page text bounds. Contact sheets cover every generated print page. Reproduce text/bounds checks with `scripts/check-learning-print.py` in a Python environment with `pypdf` and `pdfplumber`.

Final visual-learning regression: all 122 browser tests passed, including the new visual lessons and existing homepage, support, services, navigation, community, blog, newsletter, and slideshow suites. After the final print-only grouping refinement, both affected print tests passed again. The final TypeScript/production build and formatting checks passed. Final responsive capture generation again reported zero overflow, image failures, console errors, or uncaught exceptions at all five widths.

Final A4 print review: visually inspected all 39 printed pages (18 in Chapter 1 and 21 in Chapter 2). All 18 visual units stay together, all 16 scene images are printed, all 149 captured visual text blocks are present, and no text extends beyond page bounds. The report is `artifacts/learning-visuals/review/print-checks.json`; final page renders and seven contact sheets are in `artifacts/learning-visuals/review/print-final/`. Superseded print renders were removed. The temporary production preview was stopped; the main development site remains available on port 5173.

## Detailed Why Mental Health learning series

Reviewed all 14 pages of the two supplied VUGA NDAKUMVA PDFs visually and through text extraction. Replaced the short `/why-mental-health` introduction with a chapter library and two full reading routes. All 33 numbered lesson sections are retained, along with 11 learning goals, six lesson tables, ten knowledge-check questions and answers, fictional examples, reflection prompts, summaries, original references, source notes, front matter, and editorial checklists. Chapter 1's handbook review and its additional table remain accessible in the source/editorial disclosure. Both unmodified PDFs are downloadable.

The import audit in `artifacts/mental-health-source-review.json` confirms 4,326 source words across the lesson sections and editorial review, with complete token coverage for every section. Browser assertions additionally verify the rendered goals, front matter, reference text, and notes against the typed records. Original educational-draft, version, and publication-review status remains visible. Official reference links were checked on 9 November 2026; no clinical review, publication approval, or deployment is claimed.

Readers have a sticky desktop index, expandable mobile contents, direct section and reference links, previous/next chapters, private reflection-prompt downloads, original PDF downloads, and a print layout that opens all answer/editorial disclosures temporarily. There are no reflection inputs, scoring, diagnostic assessments, submissions, or application-storage writes. Future chapters can extend the typed collection and lightweight route catalog. The chapter module is loaded separately, keeping the shared production JavaScript bundle below Vite's default 500 kB warning threshold.

All 14 targeted learning tests passed, including complete content rendering, download byte hashes, keyboard disclosures, deep links, browser history, privacy, printing, unknown-route recovery, and reduced motion. Visually reviewed library, reading, table, reflection, answers, and source-reference captures across 375, 768, 1024, 1440, and 1920px. No document-level overflow or console/page errors were found. Wide tables scroll inside labeled, keyboard-focusable wrappers; the floating header remains clear of focused sections. Captures are `artifacts/mental-health-library-*.png` and `artifacts/mental-health-chapter-*.png`; reproduce with `scripts/review-mental-health-learning.mjs`. TypeScript and the production build passed.

Full learning-series integration regression: all 111 browser tests passed in the production preview, including the existing homepage, navigation, community, blog, services, newsletter, and automatic slideshow suites. Final formatting checks passed. The temporary production preview was stopped after verification; the main development site remains available on port 5173.

## Navigation, Knowledge Hub, and information pages

Replaced the crowded top-level navigation with About Us, Awareness, Why Mental Health, Knowledge Hub, Community, Find support, and Donate. Knowledge Hub groups the existing GBV, alcohol/drugs, guides/worksheets, and Blog routes, with a separate overview page. The floating white header and primary green support action are preserved; Donate uses a quiet outlined action on desktop and appears inside the mobile menu.

The disclosure supports pointer, touch, keyboard activation, Arrow Down/Up entry, sequential Tab access, Escape, outside dismissal, focus-out dismissal, active-route highlighting, and route-change reset. Mobile uses a scrollable nested disclosure; Escape closes it before the outer menu. Existing tests now follow the changed hierarchy rather than expecting removed top-level links.

Added `/awareness`, `/why-mental-health`, `/knowledge-hub`, and informational `/donate` pages using existing local imagery and scoped styles. The mental-health introduction links to WHO guidance checked 9 November 2026. The user explicitly deferred donation functionality; no payment form or collection is implemented. Photography remains illustrative and no completed campaigns or fundraising results are fabricated.

TypeScript and production build passed. Reviewed page and dropdown captures at 375, 768, 1024, 1440, and 1920px with no overflow or browser errors. Files are `artifacts/navigation-{page}-{width}.png` and `artifacts/navigation-dropdown-{width}.png`; reproduce with `node scripts/review-navigation.mjs`.

Navigation integration regression: all 96 browser tests passed, including the updated desktop/mobile navigation journeys and existing homepage, community, blog, services, newsletter, and slideshow checks. A final 14-test navigation/support rerun passed after improving current-page dismissal and touch selection in the expanded mobile menu. Pointer selection now keeps targets stationary through the click; keyboard focus still dismisses the disclosure normally. The final rerun includes a 375 × 667 touch-device context and selecting both the current Donate page and a different Community route. The final TypeScript and production build passed.

## Community news, events, and workshops

Added `/community` and six `/community/:slug` pages, with links from the homepage gallery, shared header, and footer. The cream-and-green page uses a photographic hero, three category shortcuts, News / Events / Workshops tabs, combined search, aligned three/two/one-column cards, related entries, and a practical-information panel on detail pages. Navigation fits at the 1251px desktop breakpoint, and category shortcuts focus the catalog below the floating header without making later filters jump to the page top.

The user asked for content templates pending their actual details. Two news, two event, and two workshop templates are explicitly labeled; no dates, venues, facilitators, participant accounts, or registrations are invented. Typed records in `src/community/content.ts` support confirmed publication dates, intended audiences, local schedules with explicit IANA zones, and optional external HTTPS registration links. Template records never offer registration. Photographs reuse existing credited local images and remain marked illustrative.

All 11 new browser tests passed, covering discovery, search, combined filters, URL history, empty results, category anchors, related/return journeys, direct and missing links, mobile menus, keyboard access, reduced motion, no POST requests or application storage, and responsive layouts at 375, 768, 1024, 1251, 1440, and 1920px. Reviewed news, event, workshop, filtered, and index captures at the five standard screen widths with no overflow or browser errors. Reproduce captures with `node scripts/review-community-pages.mjs`; evidence is in `artifacts/community-page-*.png`. TypeScript, production build, and formatting checks passed.

Full community integration regression: all 86 browser tests passed, including the existing homepage, blog, services, floating header, newsletter, and slideshow suites.

## Community outreach gallery

Added a homepage-only Community & Outreach section directly above the shared newsletter. It retains the existing green, cream, DM Sans, rounded photography, and editorial spacing. Three existing local photographs form a featured-photo mosaic on desktop and a stacked gallery on mobile. Typed photo records allow additional images; even collections use balanced rows, while odd collections feature the first photograph. Existing source credits apply, and the visible note distinguishes illustrative photography from actual outreach participants.

Photo actions open a larger, uncropped viewer with previous/next buttons, wrapping arrow-key navigation, a live photo caption, Escape dismissal, focus trapping and restoration, and temporary background scroll locking. Hover zoom is disabled for reduced-motion preferences. No image uploads, participant information, invented impact figures, or external requests are introduced.

Reviewed captures at 375, 768, 1024, 1440, and 1920px: balanced headings, readable captions, consistent crops, no horizontal overflow, and no browser errors. Captures are `artifacts/community-{width}.png`, `artifacts/community-home-{width}.png`, and `artifacts/community-viewer-{width}.png`; reproduce with `node scripts/review-community.mjs`. All 29 targeted community, homepage, newsletter, and slideshow browser tests passed. TypeScript and the production build passed.

## Floating navigation and fitted hero

The shared navigation is fixed to the viewport and becomes an inset rounded white bar with a soft shadow after 24px of scrolling. A measured spacer preserves its document space; the header remains above page content after leaving the homepage hero. ResizeObserver keeps its reserved height accurate across desktop, two-row intermediate layouts and mobile. Anchor scroll padding accounts for the header. Mobile menus and reduced-motion behavior are retained.

The homepage header sits outside the hero. The hero fills the viewport below the measured header, with minimum heights on short screens for readable content. All five photographs use cover sizing without distortion, and desktop/mobile focal positions are configured individually. The old forced mobile crop is removed. Automatic timing, seamless leftward looping and pause behavior are unchanged.

New browser checks cover floating position on homepage and services at 375, 768 and 1440px, no layout shift or overflow, header visibility beyond the hero, menu use and route changes while scrolled, plus all five slide dimensions and captures on desktop and mobile. Captures: artifacts/floating-{home,services}-{375,768,1440}.png and artifacts/fitted-hero-{375,1440}-slide-{1,2,3,4,5}.png. The new checks and slideshow regression suite passed (14 tests). TypeScript and the production build passed.

Final verification for floating navigation/hero fit: all 52 browser checks passed across the targeted 14-test navigation/slideshow run and the 38-test homepage/public/service regression run. TypeScript and production build passed. Reviewed desktop floating navigation, mobile floating navigation and the fitted desktop/mobile hero crops. Existing React Router bundling directive warnings are unchanged.

## Newsletter section

Added a shared cream-and-green newsletter section above the footer, with an editable heading, decorative line icon, email field, privacy link, loading state, API-confirmed success/double-opt-in states, and retry feedback. The old homepage newsletter card now links to the shared section instead of showing a validation-only confirmation. Since no provider has been chosen, the default page says Signups open soon and disables collection. The user explicitly selected the option that they have not chosen a mailing-list service.

Newsletter integration contract is documented in README.md and .env.example. API secrets stay server-side. The frontend never stores the address in localStorage/sessionStorage, clears it on a confirmed response, and rejects unrecognized response bodies as unconfirmed. Unmount aborts an in-progress request.

TypeScript and production build passed. Configured-state browser checks with intercepted responses verified native required/email validation, exact submitted payload, success, double opt-in, server failure/retry, unknown-response rejection, loading/duplicate-submit prevention, success focus and no browser storage. These checks made no real subscriptions. Desktop/mobile configured previews: artifacts/newsletter-connected-{desktop,mobile}.png. Default shared-section captures: artifacts/newsletter-{375,768,1440}.png.

Final newsletter verification: 21 homepage/newsletter/public-page browser tests passed after giving the newsletter field a distinct visible label. Configured API-response behavior was separately verified with mocked responses. TypeScript and production build passed. No mailing service has been selected, no mailing credentials are configured, no real subscriber was added, and the temporary configured preview on port 5174 was stopped; the main site remains on port 5173.

## Newsletter finishing pass

Refined the newsletter with a two-tone editorial heading, a quieter pale-green background, a compact branded signup heading, an email icon inside the field, and shorter privacy copy. The large background flower is replaced with a small mark inside the card. The availability notice now explains only what visitors need to know: signup is not open and addresses are not being collected. Mobile spacing is tighter, and the newsletter transitions into the footer with less excess padding.

Signup configuration, API contract and state behavior are unchanged. TypeScript and production build passed. Configured-state checks with mocked API responses passed again for validation, success, double opt-in, retry, loading and storage behavior. Updated desktop/mobile captures are artifacts/newsletter-{375,768,1440}.png and artifacts/newsletter-connected-{desktop,mobile}.png. The temporary configured preview was stopped after verification.
Newsletter finishing verification: all 21 homepage, newsletter and public-page browser tests passed; mobile, tablet and desktop captures show no horizontal overflow.

## Mental health hero photography

Replaced all five homepage slideshow photos with professional mental health stock photography: counseling, listening, group support, connection and mental health learning. Each new image is 2400 × 1600 WebP and is stored under public/images/mental-health-*.webp. Existing wellness images remain untouched for service cards and other pages. Desktop/mobile focal positions were reviewed individually, and a scoped overlay keeps white text legible on the lighter office backgrounds. Animation timing, looping, pause behavior, controls, floating navigation and booking actions are unchanged.

Sources and photographer/license details are in public/images/mental-health-slide-credits.json. Pexels source pages and license were reviewed 8 November 2026. Photo subjects are illustrative models, not claimed providers, actual clients or endorsers of this site. Source preparation is reproducible with scripts/prepare-mental-health-slides.mjs. No AI image generation was used for this set.

TypeScript and production build passed. All 14 slideshow/floating-header checks passed, including all five images filling the hero at mobile and desktop sizes, seamless looping, focus/hover/offscreen/Space pauses and reduced motion. Reviewed every mobile and desktop slide. Contact sheets: artifacts/mental-health-mobile-review.png and artifacts/mental-health-desktop-review.png; individual captures remain artifacts/fitted-hero-{375,1440}-slide-{1,2,3,4,5}.png.
