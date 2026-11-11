# GBV landing-page polish

Refined `/understand-gbv` while preserving the current Chapter 01 presentation, all chapter content, routes, descriptions, section counts, safety guidance, resource data and editorial status.

Changes:

- `src/learning/gbv/GbvPages.tsx`: two-column library introduction on desktop, foundations link grouped with the description, removal of a redundant introductory block, and a source-image fallback for a future chapter without a mapped cover.
- `src/learning/gbv/gbv.css`: balanced content width, tighter typography and spacing, chapter numbers above the complete artwork, improved navigation wrapping, clearer support sections, and anchor offsets that account for the document's existing header padding.
- `src/learning/gbv/GbvIllustration.tsx`: responsive image-size hints matched to hero, cover and supporting placements. Existing artwork and alternative text retained.
- `scripts/review-gbv-covers.mjs`: optional output-directory setting so this review does not overwrite the original refresh evidence.

At 375px, the library introduction before the first card reduced from 752.5px to 571.6px. At 1440px it reduced from 538.6px to 353.9px. Chapter numbers no longer overlap image content. All original 3:2 compositions remain intact. Before/after measurements and captures are retained in this directory.

Verification passed:

- TypeScript and production build: `npm.cmd run build -- --outDir artifacts/gbv-library-polish/production`.
- Existing landing review against the isolated production preview: seven widths from 320px to 1920px, all five section anchors, all ten chapter routes, keyboard focus, quick-exit replacement, resource selectors, preserved links/dates, image loading, heading hierarchy and text overflow.
- All 196 checked text nodes passed contrast thresholds; minimum ratio 4.65:1. No browser console errors or POST requests.
- Targeted existing keyboard regression: `tests/support-polish.spec.ts`, “topic section navigation moves keyboard focus below the floating header”.

The initial development-server review was interrupted by a Windows file-watch lock on another task's image and a subsequent live source reload. Final checks passed against a stable production build. No shared server configuration was changed. The full 57-test suite from the earlier refresh was not repeated for this scoped presentation pass.

See `after/report.json`, `after/metrics.json` and the screenshots. No new illustration assets were needed, no deployment was performed, and no editorial or referral verification was newly claimed. The existing required specialist reviews remain outstanding.
