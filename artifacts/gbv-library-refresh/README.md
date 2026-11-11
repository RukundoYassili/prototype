# Understand GBV landing-page refresh

Scope: `/understand-gbv` introduction, chapter library and supporting sections. No chapter reader, source transcription, internal teaching scene, source PDF, referral record or source-check date was edited. This is local project work; no deployment was requested.

## Implementation

- `src/learning/gbv/GbvPages.tsx`: hero, navigation to learning/support, library covers, starting-point link, fictional-art disclosures; existing dynamic chapter/section totals, descriptions and draft notice retained.
- `src/learning/gbv/GbvIllustration.tsx`: typed, stable chapter-slug asset mappings; contextual alt text, responsive images, reserved dimensions, eager high-priority hero, lazy covers, readable image-failure fallback.
- `src/learning/gbv/gbv.css`: landing-only typography, spacing, colors, complete 3:2 frames, responsive layout and focus styles. Shared reader styles remain unchanged.
- `src/support/SupportPages.tsx`: optional hero/actions/note/supporter slots; existing topic defaults and all support copy, selectors and resource behavior retained.
- `scripts/prepare-gbv-covers.mjs`: imports retained originals, builds WebP sizes and writes provenance. Does not generate images or contact an image API.
- `scripts/review-gbv-covers.mjs`: browser QA and screenshots using the installed Edge browser.

## Artwork and educational mapping

All artwork was made with the built-in `image_gen` tool. These are raster PNG originals and WebP delivery assets, not editable vectors. Exact prompts, audiences, scenes, background and composition constraints, intended dimensions, placements and generation paths are in `briefs.json`. Originals are retained in `originals/`; public assets and hashes are in `public/images/learning/gbv-covers/provenance.json`.

Every image has a 1536 × 1024 original, with 480 × 320, 960 × 640 and 1440 × 960 WebP variants. Eleven originals produce 33 WebP variants (1,526,696 bytes total). The full image composition is retained at every breakpoint. There is no text embedded as website headings, labels or chapter numbers.

| Placement | Message and source context | Previous visual | Final asset stem |
| --- | --- | --- | --- |
| Hero | Personal space, dignity, choice and respectful connection | Generic support photograph | `hero-dignity-and-space` |
| 01 · 18 sections | Autonomy and respectful support; sections 1-8 and 1-9 | Training-opportunity scene | `01-choice-and-connection` |
| 02 · 19 | Connected forms of harm across home, communication, money and digital life; sections 2-2 through 2-9 | Trainee scene | `02-connected-forms` |
| 03 · 20 | Community responsibility and unequal access; sections 3-2, 3-4, 3-5, 3-9 | Youth discussion scene | `03-opportunity-and-responsibility` |
| 04 · 17 | Personal boundaries and meaningful choice; sections 4-1 through 4-4 | Generic support photograph | `04-space-and-consent` |
| 05 · 17 | Private listening without taking over; section 5-7 and scenario C in 5-11 | Listening photograph | `05-private-support` |
| 06 · 18 | Dignified first response and healthcare options; sections 6-8 and 6-9 | Counseling photograph | `06-care-and-dignity` |
| 07 · 23 | Taking nonphysical harm seriously and listening; sections 7-1, 7-9 | Listening photograph | `07-heard-and-respected` |
| 08 · 18 | Control of documents, work, money and access; sections 8-3, 8-8, 8-9 and market-trader scenario in 8-10 | Learning photograph | `08-resources-and-choice` |
| 09 · 21 | Safety/context before changing technology; sections 9-9 and 9-10 | Generic support photograph | `09-digital-options` |
| 10 · 21 | Age-appropriate listening and adult safeguarding responsibility; sections 10-8, 10-9 and 10-15 | Group photograph | `10-listening-to-young-people` |
| For supporters | Listening with respect for choices | Icon | Reuses `07-heard-and-respected` |

The Chapter 03 architectural model is an editorial metaphor for unequal access, not a diagram of the causes of GBV or a claim that physical accessibility alone resolves gender inequality. All covers are conceptual illustrations, not replacements for the original fictional cases. Anatomy, expressions, scene relevance and framing were visually reviewed. Adult and adolescent characters are used according to the content; no graphic abuse, confrontation or guaranteed recovery is depicted.

The confirmed counts are 18, 19, 20, 17, 17, 18, 23, 18, 21, 21 = 192. The last two include the source reference/publication sections in the current reader data. Counts remain derived from that data.

## Verification

Run the following against the local project server:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
node scripts/review-gbv-covers.mjs
npm.cmd test -- tests/gbv-learning.spec.ts tests/gbv-continuation.spec.ts tests/support-polish.spec.ts tests/navigation.spec.ts
npm.cmd run build
```

The browser review passed at seven widths (320, 375, 680, 768, 1024, 1440, 1920): text overflow, image loading and proportions, source descriptions/counts/status, heading order, contrast, all five anchors and keyboard focus/header clearance, all ten chapter destinations, visible focus, resource selectors, preserved external URLs and source dates, shared topic defaults, priority/lazy loading, no content forms or POST requests, and keyboard Quick exit with a mocked external destination. All 198 checked text nodes met their contrast threshold; the minimum computed ratio was 4.65:1. There were no browser console errors or POST requests. See `after/report.json` and screenshots.

`npm.cmd run build` passed (TypeScript and Vite). Vite emitted its existing React Router `use client` directive warnings. The selected 57-test regression suite initially had 55 passes and two failures in mobile navigation tests at 375px and 768px, on the Blog destination's active Knowledge Hub state. Those tests do not visit the GBV page or use its styles. Both passed when rerun in isolation with `npm.cmd test -- tests/navigation.spec.ts --grep 'information pages fit (375|768)px'`. This is recorded as intermittent regression-test behavior, not silently counted as a clean first run. No navigation code or tests were changed. All selected checks passed across the initial run and targeted rerun; no selected test remains failing.

External destination availability and referral details were not newly verified. Existing source-check dates and caveats remain intact. Quick exit retains its existing Google replacement behavior and does not clear browser history or monitoring. No analytics, disclosure form, reflection storage or other collection was added. The site's existing newsletter outside this page's content was not changed.

## Remaining review and next chapter

No landing-page artwork is pending. The existing educational-draft status remains: GBV-specialist, safeguarding, legal, clinical, accessibility and Rwanda referral reviews are still required before publication. Browser checks are not a substitute for these reviews or an assistive-technology audit.

The next separate task can select Chapter 01, `understanding-gender-based-violence`. Read all 18 sections and source notes before updating its internal visuals. Its six existing paired stories are `gbv-training-opportunity` (section `gbv-section-1-4`) and `gbv-household-earnings`, `gbv-student-monitoring`, `gbv-volunteer-disclosure`, `gbv-child-safeguarding`, `gbv-friend-listening` (section `gbv-section-1-12`). The two precise diagrams are `gbv-consent` (1-8) and `gbv-lives` (1-9). Preserve source examples, captions, optional reflection and stable IDs. Keep paired characters/clothing/props consistent and use “A possible supportive response” framing without implying guaranteed outcomes. The new library cover remains independent from those internal stories.
