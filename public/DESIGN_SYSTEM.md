# Sunroom design system · 1.0.0

**Current app:** the documentation showcase has been replaced by the screenshot-matching BetterHelp landing page. This document describes the retained reusable primitives. The page uses locally bundled DM Sans and extracted screenshot photography, with an ImageGen-restored hero. See README.md and design-qa.md for the current page and verification.

A React and TypeScript foundation inspired by the supplied wellness screenshot. The yellow accents, warm neutral canvas, generous whitespace, pill actions, organic linework, and image cards are interpreted into an original system. Colors are visual approximations, and Arial/Helvetica is a deliberate system-font substitute; the source font cannot be reliably identified from the screenshot. Photography in the showcase is illustrative, loaded from Unsplash, and requires an internet connection. No source brand identity or endorsements are reproduced.

## Getting started

Run `npm install`, then `npm run dev`. Run `npm run build` for a typechecked production build. Import `src/system/tokens.css` and `src/system/components.css` once, then import components from `src/system/components.tsx`. `src/styles.css` is documentation-site styling and is optional for consuming applications.

```tsx
import './system/tokens.css';
import './system/components.css';
import { Button, Input, Card } from './system/components';

export function Newsletter() {
  return <Card><form onSubmit={event => event.preventDefault()}>
    <Input label="Email address" type="email" autoComplete="email" required />
    <Button type="submit">Join the community</Button>
  </form></Card>;
}
```

## Foundations

| Semantic token | Light | Dark | Use |
|---|---|---|---|
| `--color-brand` | #FFE14D | #FFE14D | Primary actions and selected controls |
| `--color-on-brand` | #20231D | #20231D | Text on yellow |
| `--color-bg` | #F6F6F1 | #181E18 | App canvas |
| `--color-surface` | #FFFFFF | #232C24 | Panels and controls |
| `--color-subtle` | #EEEFE8 | #303B31 | Secondary surfaces |
| `--color-text` | #242820 | #F2F3E9 | Primary text |
| `--color-muted` | #656B5F | #B2BCAE | Supporting text |
| `--color-border` | #DEDFD5 | #435043 | Decorative boundaries |
| `--color-focus` | #425EAE | #A7BCFF | Keyboard focus |

Status foreground/background pairs exist for success, warning, danger, and info in both themes. Pair color with text or icons. Pale borders are decorative; persistent labels identify fields. Do not use yellow text on white. Set `data-theme="dark"` on an ancestor to opt into dark mode. The host application owns preference persistence and initial theme selection.

Typography: Arial, Helvetica, sans-serif. Use regular 400 for body and 600–700 for headings and actions. Scale: 12, 14, 16, 20, 24, 32, 48 and fluid display 44.8–73.6px. H1 showcase uses a fluid display; samples demonstrate an editorial scale rather than imposing heading semantics. Body line height 1.6, large text 1.5, headings 1.05–1.25. Keep long body copy near 65 characters per line. Eyebrows are short supporting labels, never primary instructions.

Spacing uses a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Prefer 16–24px within cards and 32–64px between sections. Radius: 8px controls, 16px cards, 24px feature surfaces, 999px pills. Shadows are reserved for transient layers; most surfaces use quiet borders. Icons use Lucide outlines, normally 16–24px and 1.5–2px strokes. Label standalone icon buttons.

Layout: mobile first, a single column below 600px; supporting columns at 600–900px; persistent sidebar above 900px; expanded desktop at 1200px and 1600px. The documentation container caps at 1320px including gutters. Product layouts should use a 12-column desktop / 4-column mobile grid, 24px gaps, and 16–48px gutters. Cards may span multiple columns. Avoid fixed content heights where translated text can grow.

Motion: 150ms feedback, 240ms transitions, `cubic-bezier(.2,.8,.2,1)`. Reduced-motion users receive no animations or smooth scrolling.

## Component contracts

| Component | Anatomy and variants | States and behavior | Guidance |
|---|---|---|---|
| Button | Label, optional icon; primary / secondary / ghost / danger; sm / md / lg | Hover, focus, disabled, loading (`aria-busy`) | One primary action per context. Pass `type="submit"` only for form submission. Loading disables interaction; retain a meaningful label. |
| IconButton | Circular hit area, icon, required `label` | Hover, focus, disabled via native prop | Minimum 44px hit area. Do not rely on icon shape alone. |
| Badge | Compact label; neutral / brand / success / warning / danger / info | Non-interactive | For status or metadata, never use as a button. |
| Input | Persistent label, native input, optional hint/error | Default, focus, invalid, disabled, native required validation | Unique generated IDs; error referenced by `aria-describedby`. Provide clear corrective copy. |
| Select | Persistent label, native select, options | Native keyboard selection and focus | Use for finite choices; pass a meaningful default or placeholder option. |
| Checkbox | Native checkbox and adjacent label | Checked, unchecked, disabled | For independent consent or choices. Never preselect consent. |
| Switch | Label and track/thumb | Controlled checked state, `role=switch`, `aria-checked` | Immediate binary preferences; avoid switches for submitting forms. |
| Tabs | Group of pill buttons | Controlled `value`, pressed state | This component is a segmented category selector using button-group semantics. All buttons are keyboard reachable. It does not claim ARIA tabpanel behavior. Render the selected content yourself. |
| Avatar | Circular photo or initials; sm / md / lg | Stable initials fallback when no source is passed | Pass a name; do not encode status through avatar color. |
| Card | Surface, border, padding, content slot | Static layout | Do not make the entire card an unlabelled click target; put explicit actions inside. |
| Alert | Status icon and message; success / warning / danger / info | Polite status, assertive error | Keep actionable or persistent errors visible. Do not trigger assertive announcements on every keystroke. |
| Modal | Native dialog, heading, close action, content | Native focus containment, Escape, close and backdrop click | Native dialog restores focus. Supply a concise title. For destructive flows, supply explicit confirmation copy and cancel action. |
| Tooltip | Focusable trigger wrapper and floating explanation | Hover and focus disclosure | Optional context only; essential help belongs inline. Avoid interactive content. |
| EmptyState | Symbol, heading, explanation, optional action | No-content state | Explain what will appear and provide a useful next action. |
| Toast pattern | Status icon, message, dismiss | Polite announcement; 3.5 seconds | Showcase implementation lives in App.tsx. Only use for nonessential confirmations; persistent feedback is needed for important outcomes. |
| Table pattern | Caption, column headers, row headers, status cells | Horizontal overflow on narrow screens | Showcase implementation lives in App.tsx. Preserve table semantics; add sorting only with corresponding buttons and `aria-sort`. |
| Sidebar pattern | Brand, search, section groups, current section | Search filters sections; mobile menu toggles | Showcase implementation lives in App.tsx. Use anchor destinations for navigation. |

## Product patterns

Forms: group related fields, use one submission action, validate native constraints on submission, preserve user values on error, and pair server errors with corrective guidance. The demo form shows local validation and confirmation only; it does not store data.

Search and filters: search in the sidebar filters documentation destinations; category chips and segmented controls demonstrate controlled selection. The course card updates its category to illustrate the selected filter. Real result fetching, loading, empty, error and pagination states belong to the consuming application.

Onboarding: ask only for information needed for the next step, explain optional preferences, and let users revisit choices. A group invitation card and dialog demonstrate entry points, not a complete account flow.

Image cards: keep text outside imagery when possible; if overlaying, use a dark gradient and verify contrast across all source images. Do not put small yellow text directly on photos. Use licensed photography with descriptive alternatives for meaningful images; showcase background photos are decorative.

## Accessibility and verification

Use semantic headings, explicit labels, 44px action targets, visible focus, sufficient text contrast, reduced motion, native form controls, and native dialogs. Do not communicate status only through color. Product teams must verify content-specific contrast, keyboard order, zoom to 200%, screen-reader announcements, translated layouts, and mobile touch behavior in their deployed environment. This implementation is not a certification of WCAG compliance.

Manual acceptance: tab through navigation and controls; use Enter/Space to activate; open the modal, confirm focus stays inside, dismiss with Escape and confirm focus returns; toggle light/dark; submit invalid and valid form data; filter navigation; toggle a saved course; open/dismiss a toast; resize to 375px and 1440px; enable reduced motion. Production build performs TypeScript checks.

## Governance

Tokens use `--category-role` names rather than raw color names. Components use PascalCase, CSS classes use the `ds-` namespace, and public props use typed unions for finite variants. Tokens are the source of truth; do not duplicate color literals in product components. Showcase photography and composition are intentionally separate from reusable primitives.

Version with semantic versioning: patch for visual fixes that preserve API, minor for additive variants/components, major for removed or changed APIs/tokens. Before adding a component, check for a composition of existing primitives, define its states and keyboard behavior, document props and usage, verify both themes and narrow layouts, and record the change. Changes to accessible names or keyboard behavior need deliberate review. This starter is a local library, not a published package; package exports, external React peer dependencies and release automation can be added when it is extracted into its own repository.
