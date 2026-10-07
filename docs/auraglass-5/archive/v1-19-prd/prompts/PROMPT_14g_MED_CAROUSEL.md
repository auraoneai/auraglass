# PROMPT-14g (MED): Flagship 44: `CarouselRail` (APG carousel on CSS scroll-snap)

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

## 1. Sources (read before editing)
- PRD `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. Read:
  - §2.1 E-12, E-13
  - §3 item 7
  - §4.2 CarouselRail row
  - §4.6
  - §5.6 REQ-MED-50..55
  - REQ-MED-80, -82, -83
  - §10 API-MED-07
  - §11 item 3
  - §12.1 `CarouselRail.test.tsx`
  - §12.2 `CarouselRail.apg.spec.ts`
  - §13 CarouselRail row
  - §14 CarouselRail row
  - §15 items 3, 6, 9
  - §16 rows: `{ CarouselRail }` ≤5 KB, ≤3 filters at fine pointer and ≤1 at coarse, INP ≤100 ms, 0 scroll listeners
- Shared contracts: SC-21 (`data-ag-continuous`, `data-ag-offscreen` owned by MOT), SC-23 (`usePreference`), SC-30 (APG spec path), SC-31 (stories), SC-38 (**CarouselRail autoplay counts as a loop**: gated by `allowContinuous` + resolved motion `full` + the consumer prop).
- Architecture §11.2 #44 and §11.3. WAI-ARIA APG Carousel pattern (tabbed and basic variants; rotation control first in tab order).
- Seeds (read only): `src/components/data-display/LiquidGlassCarouselRail.tsx` (`:17`, `:74`, `:83`), `src/components/interactive/GlassCarousel.tsx`.
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-130..MED-139.

**Requirements:** REQ-MED-50..55, and REQ-MED-80/82/83 for these files.
**Acceptance:** AC-MED-10 (Carousel half) and AC-MED-12 (autoplay half).

## 2. Scope
**May create (all NEW):**
- `src/media/CarouselRail/{CarouselRail.tsx,useCarouselIndex.ts,CarouselRail.meta.ts}`
- `src/media/CarouselRail/parts/{Viewport,Slide,Prev,Next,Indicators,AutoplayToggle}.tsx`
- `src/media/__tests__/CarouselRail.test.tsx`
- `tests/a11y/apg/carousel-rail.apg.spec.ts` (SC-30)
- `src/media/CarouselRail.stories.tsx`

**May modify:** the `/* CarouselRail */` section of `src/media/media.css`, and append to `src/media/index.ts`.

**Must NOT touch:** `src/components/**`, `src/material/**`, `src/theme/**`, `src/motion/**`, `src/a11y/**`, `src/index.ts`, dependencies. Base UI is not used here (§4.6).

## 3. Prerequisites
- 14b is merged: `test -f src/media/index.ts && test -f scripts/ci/verify-media-purity.mjs`.
- A11Y-027/A11Y-029 (PROMPT_05_A11Y): `usePreference` (`test -f src/theme/preferences/usePreference.ts`) and the provider that resolves `data-ag-continuous="on"` (only when `allowContinuous` is true and resolved motion is `full`, MOT semantics). Also the APG harness (A11Y-073, `test -f tests/a11y/apg/harness.ts`) and the announcer (A11Y-054). Without `usePreference` or the continuous attribute, MED-133 is blocked. Do not read `matchMedia` directly as a substitute.
- MOT-040 (PROMPT_06_MOT): `data-ag-offscreen` from the ticker's shared observer; until it lands, use one IntersectionObserver per rail and record it.
- MAT-047 chrome roles (PROMPT_04_MAT): `test -f src/material/Surface.tsx`.
- PKG glyph entries `chevron-left`, `chevron-right`, `pause`, `play` (format rule as in 14e).
- SB-048/SB-071 (`StoryEnvironment`, story contract) and QA-038/039 scenes (MED-138); QA-082 L5 Behaviour (MED-137).

## 4. Steps
1. **MED-130 `Root`/`Viewport`/`Slide`** (`"use client"`).
   - Root props exactly per REQ-MED-50:
     - `index`/`defaultIndex`/`onIndexChange`
     - required `label`
     - `slidesPerView` (default `'auto'`)
     - `loop` (default false)
     - `autoplay` (`{ interval }` with the interval clamped to ≥5000 ms, or `false`, the default)
     - `overMedia`
     - `ref` as a prop
   - Root renders `<section aria-roledescription="carousel" aria-label={label} data-state="autoplaying|stopped">`. `overMedia` adds `data-ag-backdrop="media"`.
   - `Viewport`:
     - CSS: `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`, native touch and trackpad scrolling.
     - `aria-live` is `"off"` while autoplaying and `"polite"` otherwise.
   - `Slide`:
     - Default material is `content` (`content-raised`).
     - Size per REQ-MED-55 and §14: numeric `slidesPerView` becomes `calc((100% - gaps) / n)`, with n forced to 1 below a 480 px container width.
     - Reserves size via `aspect-ratio` (CLS 0).
2. **MED-131 `useCarouselIndex.ts`.**
   - The active index comes from one `IntersectionObserver` at threshold 0.6 on the slides. There are 0 `scroll` listeners.
   - Programmatic navigation uses `viewport.scrollTo({ left, behavior })`. `behavior` is `'auto'` under reduced motion, otherwise `'smooth'`.
   - Controlled `index` is honoured. `onIndexChange` fires once per settled change.
3. **MED-132 `Prev`/`Next`/`Indicators`.**
   - Prev/Next:
     - `aria-label="Previous slide"` / `"Next slide"`.
     - With `loop=false`, set `aria-disabled="true"` at the ends, and make activation a no-op.
     - Material: `chrome` `thin`; `clear` when `overMedia`, else `regular`. These are separate surfaces, so there are ≤3 filters per rail.
     - Hidden at `(pointer: coarse)`.
   - `Indicators` takes `as` (default `'tabs'`):
     - `'tabs'`: `role="tablist"` of `role="tab"` buttons, each with `aria-selected`, `aria-controls` → slide id, and roving tabindex. Left/Right move between tabs only while an indicator has focus. Each `Slide` becomes `role="tabpanel" aria-roledescription="slide" aria-label="N of M"`.
     - `'buttons'`, or no Indicators rendered: each `Slide` is `role="group" aria-roledescription="slide" aria-label="N of M"`. Indicators are `<button aria-label="Slide N">`, with `aria-current="true"` on the active one.
   - Indicators are always shown.
   - No global key listener anywhere.
4. **MED-133 autoplay (REQ-MED-54).**
   - Off by default.
   - When `autoplay` is set, render `AutoplayToggle` as the first focusable element in the Root. Its `aria-label` is "Stop automatic slide show" or "Start automatic slide show".
   - The timer is a single `setTimeout` chain. It is cleared on unmount and paused:
     - on `pointerenter` (hover)
     - on `focusin` within
     - when offscreen (`[data-ag-offscreen]` from MOT-040, or the per-rail IO fallback)
     - when `document.hidden`
   - **Loop gate (SC-38).** Rotation starts only when the consumer `autoplay` prop is set **and** `closest('[data-ag-continuous="on"]')` resolves (i.e. `allowContinuous` is true **and** resolved motion is `full`). Without `allowContinuous`, under `prefers-reduced-motion: reduce`, or with resolved motion `calm|none`, autoplay never starts and the toggle shows the stopped state.
   - When not autoplaying, slide changes announce via the A11Y announcer (A11Y-054) ("Slide 3 of 8").
5. **MED-134 CSS.**
   - No `backdrop-filter` or `backdropFilter` anywhere in `src/media/CarouselRail/**` or in the CarouselRail section. Glass comes from MAT attributes only.
   - Tokens only.
   - Under `forced-colors`, use `ButtonText`/`Highlight` indicators.
   - 0 horizontal page overflow at 390 px.
6. **MED-135 `CarouselRail.meta.ts`.** Parts, `data-state` (`autoplaying|stopped`), and variants (`overMedia`, `Indicators as`). Use the §11.3 shape.
7. **MED-136 `CarouselRail.test.tsx`.**
   - Roles, roledescriptions and labels for both variants.
   - Prev/Next `aria-disabled` at the ends with `loop=false`; wrap with `loop`.
   - The interval clamp: 1000 becomes 5000.
   - Using fake timers plus a `usePreference` mock:
     - autoplay prop alone (no `allowContinuous`) → no rotation; prop + `allowContinuous` + motion `full` → rotation
     - autoplay never starts when the preference is `calm`/`none` or under reduced motion
     - autoplay pauses on hover, focus and `document.hidden`
     - the toggle is first in tab order
   - Read the CSS file source and assert it contains no `backdrop-filter`. The purity gate also covers this.
8. **MED-137 (remote) `tests/a11y/apg/carousel-rail.apg.spec.ts`.** Run through the A11Y APG harness (A11Y-073) in QA lane L5 Behaviour (QA-082), Chromium, WebKit and Gecko, for both variants:
   - the APG carousel script
   - axe reports 0 violations
   - a touch swipe (`page.touchscreen`) and a trackpad-style horizontal scroll produce the expected `onIndexChange` sequence
   - Prev/Next INP ≤100 ms is logged at 4× throttle (14h gates it)
   - computed `backdrop-filter` count per rail is ≤3 at fine pointer and ≤1 at coarse (`hasTouch`, `isMobile`)
9. **MED-138 stories.**
   - Stories: `Product Rail`, `Media Slides with Clear Controls` (slides from `/scenes/*`, `overMedia`), `Autoplay (opt-in, stops under reduced motion)` (the story sets `allowContinuous` through SB's global, SB-048, MOT-091), `Loop`.
   - Every story needs `play` functions, `StoryEnvironment`, and realistic product copy.
   - No generated Default stub (STORYBOOK-SHOWCASE-06).
10. **MED-139.** Append `CarouselRail` and its types to `src/media/index.ts`.

## 5. Tests to run
- **Local (light):** `./node_modules/.bin/jest src/media/__tests__/CarouselRail.test.tsx`, `node scripts/ci/verify-media-purity.mjs`, `tsc --noEmit -p tsconfig.json`, eslint (MAT `auraglass/no-optics-outside-material`, MAT-004, scoped to `src/media/**` if landed).
- **Remote:** `npm run build`, MED-137 in 3 engines, Storybook build with `play` functions, QA mobile-containment gate at 390 px.

## 6. Visual evidence
Capture remotely as artifacts for human review:
- all 4 stories at 1440×900 and 390×844, in light and dark
- `Media Slides with Clear Controls` over `photo`, `dark-media`, `flat-white` and `hf-pattern`
- forced colors
- the autoplay story under reduced motion, showing the stopped toggle

## 7. Integrity rules (binding)
- No local Docker and no local browser.
- No scroll listeners.
- No window or document `keydown` listeners.
- Autoplay is never on by default, and the 5000 ms floor is never lowered.
- No `backdrop-filter` in the rail's code.
- No `.skip`, `.only` or `.todo`. No `-u`.
- Do not commit evidence.

## 8. Exit criteria
- REQ-MED-50..55 each have a green named test (MED-136, MED-137).
- AC-MED-10 (Carousel half): L5 Behaviour passes in 3 engines for both variants, with axe at 0.
- AC-MED-12 (autoplay half): autoplay never starts without `allowContinuous`, under reduced motion or with resolved motion other than `full` (unit test and L9 Motion via MED-151).
- Filter counts are within §16.

## 9. Final report format
```
PROMPT-14g REPORT
Branch/SHA:
Tasks: MED-130..139 -> done|blocked (reason) each
backdrop-filter per rail: fine=… coarse=…
Scroll listeners: 0 (evidence)
APG tabs/buttons (Chromium/WebKit/Gecko): pass/fail
INP Prev/Next @4x: … ms
Tests: name -> pass/fail (local|remote URL)
Visual artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
