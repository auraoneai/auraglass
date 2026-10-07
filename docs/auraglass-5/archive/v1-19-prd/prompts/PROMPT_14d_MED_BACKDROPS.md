# PROMPT-14d (MED): `aura-glass/backdrops`: `Backdrop` server component, 5 presets, `BackdropTone`, drift and background-video policy

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

## 1. Sources (read before editing)
- PRD `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. Read these sections:
  - §2.3 E-30..E-36
  - §3 items 2 and 5
  - §4.1 (`src/backdrops/` layout)
  - §4.4 (rules a–e)
  - §4.5
  - REQ-MED-01/03/04/05 (backdrops half)
  - §5.7 REQ-MED-62, -63, -65
  - §5.8 REQ-MED-70..77
  - §10 API-MED-11/12/14/15
  - §11 item 3
  - §12.1 `Backdrop*` rows
  - §12.2 `tests/backdrops/*`, `tests/media/media-sampling.spec.ts`
  - §13 `Backdrop.stories.tsx` row
  - §14 `Backdrop` row
  - §15 items 6–8
  - §16 Backdrop rows
- Architecture: §4.5 (no `mix-blend-mode` on the host), §7 item 3, §8 ("`allowContinuous` … gates every loop"), D-12.
- Source to port: `src/components/marketing/AuroraBackground.tsx` (`:21-66` seeded palette logic, `:76-125`), `src/components/marketing/marketing.css:372-396` and `:888-963`, `src/components/marketing/types.ts:1` (`MarketingPalette`).
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-060..MED-076.

**Requirements:** REQ-MED-62, -63, -65 (Backdrop owner), REQ-MED-70..77, and the backdrops halves of REQ-MED-01, -03, -04.
**Acceptance:** AC-MED-05 (three-engine half), AC-MED-09, AC-MED-12 (backdrop half), AC-MED-13 (backdrop half).

## 2. Scope

**May create (all NEW):**
- `src/backdrops/{index.ts,Backdrop.tsx,BackdropTone.tsx,types.ts,backdrops.css}`
- `src/backdrops/presets/{aurora.css,mesh.css,grain.css,media.css}`
- `src/backdrops/assets/{grain-112.avif,grain-112.png}`
- `src/backdrops/__tests__/{Backdrop.ssr,Backdrop,BackdropTone}.test.tsx`
- `src/backdrops/Backdrop.stories.tsx`
- `tests/types/backdrops.tsx`
- `tests/backdrops/{Backdrop.motion,Backdrop.modes}.spec.ts`
- `tests/media/media-sampling.spec.ts`
- `scripts/build/gen-grain-tile.mjs` (SC-11: no `scripts/assets/`)
- rows in PKG's `docs/size-budgets.json` (PKG-048, by MODIFY; SC-15) for the two grain assets

**Must NOT touch:**
- `src/components/marketing/**` (it stays 4.x; you read it only)
- `src/material/**`
- `src/motion/**`
- `src/theme/**` (provider, preferences; A11Y) and `src/motion/**` (MOT)
- `src/media/sampling/**` (consume `getOrSampleTone`, `classifyTone` only)
- `.storybook/**`
- `certification/**`
- `src/index.ts`
- dependencies

## 3. Prerequisites (check; on failure block the dependent tasks and report)
- 14b merged: `test -f src/media/sampling/toneCache.ts && test -f scripts/ci/verify-media-purity.mjs`. The manifest has a `./backdrops` row: `rg -n '"./backdrops"' build/exports.manifest.json`.
- DS-016/DS-026 tokens (PROMPT_03_DS): `--ag-ref-*` palette tokens for `aurora|prism|ocean|ember|mono`, plus `--ag-duration-ambient` (accepted in SC-19; MOT adds the 40 s value row via MOT-020 to `tokens/sys/motion.tokens.json`). Check: `rg -n "duration-ambient|ag-ref-" tokens dist 2>/dev/null | head`. If the row has not landed, MED-066 is blocked (do not add a literal).
- MAT-015/MAT-047 (PROMPT_04_MAT): `media` declaration floors and `[data-ag-backdrop]` consumption (`test -f src/material/Surface.tsx`). `data-ag-backdrop-preset` and `data-ag-palette` are ratified attributes (SC-21).
- A11Y-029/A11Y-037 (PROMPT_05_A11Y): provider and rung CSS (`test -f src/a11y/css/rungs.css`).
- MOT-040 (PROMPT_06_MOT): the ticker's shared IntersectionObserver writes `data-ag-offscreen` (SC-21; not a provider observer). `rg -n "data-ag-offscreen" src/motion`. If it is missing, `BackdropTone` hosts one module-scoped `IntersectionObserver` for all backdrops (fallback, DoD 5); record it. `data-ag-continuous="on"` must be resolvable (`rg -n "data-ag-continuous" src`); if missing, MED-066 and the playing half of MED-065 are blocked. OI-MED-04 (REQ-MOT-T08 admits `ag-backdrop-drift`) must be accepted before MED-066 merges; otherwise apply DoD 5(c) (drift removed, `motion` accepts `'static'` only).
- QA-038/QA-039 scenes (PROMPT_18_QA): `test -f certification/scenes/scenes.manifest.json` (needed for MED-074 and the stories). Lanes: QA-076 (L9 Motion), QA-056 (L6 Environment visual), QA-075 (L8 Engine-specific).
- SB-048/SB-071 (PROMPT_17_SB): `rg -n "StoryEnvironment" .storybook/preview.tsx` and `test -f .storybook/contract/defineComponentStories.tsx` (MED-075).

## 4. Steps
1. **MED-060 `Backdrop.tsx`** (no directive, no hooks, no context).
   - Props exactly per REQ-MED-70, as a TS discriminated union: `photo`/`video` require `src`.
   - Renders `<div class="ag-backdrop" data-ag-backdrop-preset={preset} data-ag-backdrop={decl} data-ag-palette={palette} data-ag-motion={motion} [data-ag-fixed]>`, containing:
     - `<div data-ag-part="backdrop-layer" aria-hidden="true">`
     - `<div data-ag-part="backdrop-content">{children}</div>`
   - The declaration follows REQ-MED-73: `media` for photo/video; `scheme` for aurora/mesh (`auto` produces `data-ag-backdrop="auto"`, and the CSS uses `light-dark()`); no attribute for `grain` alone. `tone` (when given) is written server-side as `data-ag-media-tone`.
   - `ref` is a normal prop forwarded to the root (React 19; no `forwardRef`).
2. **MED-061 `presets/aurora.css`.** Port the three `radial-gradient()` layers plus the `linear-gradient()` base from `marketing.css:380-396` onto `[data-ag-backdrop-preset=aurora] > [data-ag-part=backdrop-layer]`.
   - Map palette values to `--ag-ref-*` via `[data-ag-palette=…]` custom-property blocks. These become `--_ag-aurora-a|b|c`, `--_ag-bg-0|1`.
   - No particle DOM, no `filter:`, no keyframes besides drift.
3. **MED-062 `presets/mesh.css`.** 4 positioned `radial-gradient()` blobs at `%` positions over a `linear-gradient()` base, on the single layer. No canvas, no `filter:`. Use light and dark token sets via `light-dark()`.
4. **MED-063 grain.**
   - `scripts/build/gen-grain-tile.mjs` writes a deterministic 112×112 luminance-noise PNG. It uses a seeded mulberry32 PRNG with seed `0x41475235`; it lives outside `src`, so it is not subject to the purity gate. Encoding is via Node `zlib`.
   - Encode the AVIF on the remote runner with `avifenc` (apt `libavif-bin`, CI-only, not a package dependency).
   - Commit both files. They must be ≤8 KB AVIF and ≤16 KB PNG.
   - `presets/grain.css`: `background-image: image-set(url(../assets/grain-112.avif) type("image/avif"), url(../assets/grain-112.png) type("image/png"))` on the layer, with `opacity: var(--_ag-grain-opacity, 0.03)`. It applies when `[data-ag-backdrop-preset=grain]` or `[data-ag-grain]` is set. Never use `mix-blend-mode` on `.ag-backdrop`.
5. **MED-064 `presets/media.css` + photo/video markup.**
   - `photo`: `<img aria-hidden="true" alt="" decoding="async" fetchpriority="high|auto" src srcSet sizes crossOrigin>` with `object-fit: cover`.
   - `video`: `<video aria-hidden="true" muted playsInline loop disablePictureInPicture preload="metadata" poster crossOrigin>`. There is **no** `autoplay` attribute.
   - `fixed` uses `position: fixed` on the root, never `background-attachment`.
   - REQ-MED-76: under `@media (forced-colors: active)` the layer gets `display: none` and the root gets `background: Canvas`. Under reduced transparency or `solid`, photo/video stay visible. Do not override the A11Y rung CSS.
6. **MED-065 `BackdropTone.tsx`** (`"use client"`, internal, not exported). `Backdrop` renders it for `photo` when `tone` is absent, and always for `video`.
   - **Sampling.** Use `getOrSampleTone`. For an image, sample after `img.decode()` resolves. For video, sample the poster (as an image) if present, otherwise the first `loadeddata`. It writes only `data-ag-media-tone` and `--ag-media-luma` on `.ag-backdrop`, and it skips sampling when `tone` is given.
   - **Playback (REQ-MED-72).** Call `video.play()` only while all of these hold: `closest('[data-ag-continuous="on"]')` is set, the element is intersecting (`data-ag-offscreen` absent (MOT-040), or the fallback IO), and `!document.hidden`. Otherwise call `pause()` and show the poster.
     - React within 250 ms. Re-evaluate on `visibilitychange`, on IO callbacks, and through a `MutationObserver` limited to `attributeFilter: ['data-ag-continuous']` on `<html>`/the provider root.
     - While playing, render `<button type="button" data-ag-part="backdrop-pause" aria-pressed={userPaused} aria-label="Pause background video">`. It uses the `chrome` `thin` material via MAT attributes and is visible on `:focus-visible` and on hover. Toggling it pauses and resumes playback.
   - It never writes `data-ag-backdrop` or any floor, tint or alpha variable.
7. **MED-066 drift (REQ-MED-74).**
   - `@keyframes ag-backdrop-drift` animates `transform: translate3d()` on a 120% oversized layer. This is the §16 preferred property. Use `background-position` only if QA lane L10 Performance measures ≤2 ms paint per frame at 1440; record the choice.
   - Duration is `var(--ag-duration-ambient)`. No literal durations.
   - The rule exists only under `[data-ag-continuous="on"] .ag-backdrop[data-ag-motion=drift] > [data-ag-part=backdrop-layer]`, with `animation-play-state: paused` under `[data-ag-offscreen]`. The hidden-document state comes from the provider/IO.
   - The default output has 0 animations.
8. **MED-067.**
   - `backdrops.css`: `@layer ag.components { @import`-free concatenation of the presets }`, built per PKG's CSS pipeline, starting with the SC-20 layer statement. It has no `!important`, no colour literals and no `backdrop-filter`.
   - `index.ts`: exports `Backdrop` (value) and the types `BackdropProps`, `BackdropPreset`, `MediaTone`. Nothing else.
9. **MED-068 `Backdrop.ssr.test.tsx`** (`/** @jest-environment node */`).
   - `renderToString` succeeds for each of the 5 presets. The `video`/`photo` cases get `src="/scenes/photo.avif"` (a string only; nothing is fetched).
   - Assert `data-ag-backdrop` per REQ-MED-73.
   - Read the server modules' source and assert there is no `"use client"`.
10. **MED-069 `Backdrop.test.tsx`.**
    - aurora and mesh have exactly 1 `[data-ag-part=backdrop-layer]` and 0 child nodes inside it, and no `[data-testid=aurora-particle]`.
    - `video` has no `autoplay` attribute and `preload="metadata"`.
    - `photo` and `video` are `aria-hidden` with `alt=""`.
11. **MED-070 `BackdropTone.test.tsx`.**
    - A `MutationObserver` on the root records only `data-ag-media-tone` and `style` changes, and the `style` diff touches only `--ag-media-luma`.
    - Sampling is skipped when `tone` is given.
    - `play()` is not called without `data-ag-continuous="on"`.
    - The element is paused on `document.hidden` and when offscreen.
    - The pause button toggles `paused` and `aria-pressed`.
    - 100 `timeupdate` plus 10 `seeked` events cause 1 sample.
12. **MED-071 `tests/types/backdrops.tsx`.** Negative cases with `@ts-expect-error`: `preset="photo"` without `src`, `preset="video"` without `src`, `scheme` on `photo`, and `motion="full"`. Run `tsc -p tests/types --noEmit` after the remote build.
13. **MED-072 (remote) `tests/backdrops/Backdrop.motion.spec.ts`.** Runs in QA lane L9 Motion (QA-076) against the stories.
    - For every preset at default props: `document.getAnimations().length === 0`, and 0 rAF callbacks over 5 s (instrumented via `page.addInitScript`).
    - `video` at default props: `video.paused === true` and the poster is visible after 2 s.
    - With `data-ag-continuous="on"`: exactly 1 animation, named `ag-backdrop-drift`, and the video plays. After scrolling the video offscreen, `paused` is true within 250 ms.
    - Under `reducedMotion: 'reduce'`: poster frame.
    - The pause button toggles playback.
14. **MED-073 (remote, L6 Environment visual: forced-colors and reduced-transparency axes, QA-056) `tests/backdrops/Backdrop.modes.spec.ts`.**
    - `forcedColors: 'active'`: the layer has `display: none`, the root's background resolves to `Canvas`, and there are 0 visible elements with a computed `backdrop-filter` other than `none`.
    - Reduced transparency (the A11Y emulation or the `data-ag-transparency=solid` attribute): photo and video stay visible.
15. **MED-074 (remote, L8 Engine-specific, Chromium/WebKit/Gecko) `tests/media/media-sampling.spec.ts`.**
    - `flat-white` produces mean 1.000±0.001 and tone `light`.
    - `flat-black` produces 0.000±0.001 and tone `dark`.
    - An image served by a Playwright route **without** `Access-Control-Allow-Origin` while `crossOrigin="anonymous"` is set produces no `data-ag-media-tone` and exactly one console warning with the REQ-MED-65 text.
    - The same image served with CORS gets a tone.
16. **MED-075 `Backdrop.stories.tsx`.** Exactly these stories, each with a `play` function asserting its claim:
    - `Aurora (each palette)`
    - `Mesh Light / Dark`
    - `Photo with Sampled Tone`
    - `Photo with Precomputed Tone`
    - `Video (poster by default; plays with allowContinuous)`
    - `Grain Overlay`
    - `Glass Over Each Preset` (MAT `Surface` `clear` and `regular` side by side)

    Requirements for every story:
    - It uses SB's `StoryEnvironment`/`StoryRoot` decorator from `.storybook/preview.tsx` (SB-048) and the story contract (SB-071); never edit `preview.tsx`.
    - Media comes from `/scenes/*` (QA assets via `staticDirs`, SC-28). Do not import from `certification/`.
    - It must not use `previewSurface`, inline optics or generated Default stubs.
17. **MED-076.** Add the grain asset rows to `docs/size-budgets.json` (AVIF ≤8192 B, PNG ≤16384 B) and the `backdrops.css` ≤3 KB gz row. Confirm that PKG's tarball gate (`tests/pack/tarball-contents.test.ts`, PKG-068) lists no `.storybook/`, `certification/` or scene file under `dist/backdrops/**`.

## 5. Tests to run
**Local (light):**
- `./node_modules/.bin/jest src/backdrops`
- `node scripts/ci/verify-media-purity.mjs`
- `./node_modules/.bin/tsc --noEmit -p tsconfig.json`
- eslint on `src/backdrops`

**Remote:**
- `npm run build`
- `tsc -p tests/types`
- MED-072/073/074 Playwright (3 engines for MED-074)
- Storybook build with the `play` functions
- the size gate
- MED-063 AVIF encode

## 6. Visual evidence
Remote Storybook captures of all 7 stories at 1440×900 and 390×844 in light and dark, and the `Glass Over Each Preset` story over each preset. Also capture forced-colors and reduced-motion versions of `Video` and `Aurora`. Attach them as CI artifacts for human review. The agent cannot view screenshots.

## 7. Integrity rules (binding)
- No local Docker and no local browser.
- No `Math.random` in `src/backdrops` (the grain script uses a seeded PRNG outside `src`).
- No canvas loops, no WebGL and no particles.
- No `autoplay` attribute.
- Do not loosen the 250 ms, 0-animation or asset-size limits.
- No `.skip`/`.only`/`.todo`, and no `-u`.
- Do not commit evidence.

## 8. Exit criteria
- AC-MED-09: MED-068, MED-069 and MED-072 are green, with 0 animations and 0 rAF at defaults and SSR without a DOM.
- AC-MED-12 (backdrop half): MED-072 reduced-motion and default-preference assertions are green.
- AC-MED-13 (backdrop half): MED-073 is green.
- AC-MED-05 (3-engine half): MED-074 is green.
- REQ-MED-70..77 and REQ-MED-62/63/65 each have their named test green, the purity gate is green, and the asset sizes are within budget.

## 9. Final report format
```
PROMPT-14d REPORT
Branch/SHA:
Tasks: MED-060..076 -> done|blocked (reason) each
Drift property: transform | background-position (paint ms evidence) | removed (fallback b)
Offscreen source: MOT-040 data-ag-offscreen | module IO fallback
Asset sizes: avif=… B png=… B
Sampling (3 engines): flat-white mean, flat-black mean, CORS-less warn count
Tests: name -> pass/fail (local|remote URL)
Visual artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
