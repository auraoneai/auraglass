# PROMPT-4d (SURF lane W4): Media, owned-pixel sampling, backdrops and `./three`

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.6, §5.7, §5.8, §5.9 (REQ-SURF-165), §5.10 (REQ-SURF-175), §13 (Media, Backdrop stories), §14, §15, §16, §20 row W4. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1.
Requirement IDs: REQ-SURF-130..160, -165, -175 (owned); W4 rows of REQ-SURF-01, -03, -05, -07..-09, -12..-15, -170, -171, -188, -192, -194..-196.
Acceptance: AC-SURF-18, -19, -20, -21, -22 (owned); W4 rows of AC-SURF-01, -03, -11, -12, -13, -23, -24, -25, -26, -30 (5.1 Waveform, `media-transcript`).
Tasks: `tasks/SURF.json` lane `W4`, SURF-396..SURF-523. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_14a..14h_MED_*.md` (MED-001..167 re-keyed; 4.1.1 `isStorybookDataMedia` removal and all 4.x component edits dropped — PLAT's).
Flagships: 43 MediaControls/NowPlayingBar, 44 CarouselRail (+ ImageViewer, MediaScrubber, `useMediaElement`, Backdrop).

## Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing):

```bash
test -f src/contracts/motion.ts && test -f src/contracts/testing.ts && test -f src/contracts/entries.ts \
 && ls tests/contract-doubles/cmp/{slider,toolbar,menu,dialog}.tsx && test -f tests/helpers/index.ts \
 && node -e "const t=require('fs').readFileSync('src/contracts/testing.ts','utf8');for(const s of ['photo','dark-media','flat-white','flat-black','video-frame'])if(!t.includes(s))process.exit(1)"
```

Seams consumed: S-01 (`data-ag-backdrop`, `data-ag-media-root`, `data-ag-media-tone`, `data-ag-backdrop-preset`, `data-ag-palette` — SURF setters only), S-03/S-04 (`--ag-scrim-media`, `--ag-target-coarse`, `--ag-duration-ambient`), S-05/S-06 (`SurfaceGroup` `chrome thin` `clear`, `content-raised` slides), S-12/S-13 (`subscribeFrame` for `--_ag-media-progress`, `observeOffscreen` for `[data-ag-offscreen]`, `[data-ag-continuous="on"]` gate), S-21..S-26 (`useLayer({ kind: 'image-viewer' })`, `usePortalContainer('overlay')`, `useAnnouncer`), S-30 (CMP `Slider`, `Toolbar`, `Toggle`, `Menu`, `Icon`, `Grid`; doubles via `tests/media/jest.doubles.cjs`), S-35 (`./media` 7 names, `./backdrops` = `Backdrop`, `./three`), S-37..S-46, S-40/S-42 (QUAL scene assets at `/scenes`, `gotoStory`, `perf`), S-53. No intra-stream interface is consumed.

## May touch (lane W4 exclusive)

`src/media/**` (incl. `sampling/`, `__fixtures__/`, 5.1 `Waveform/`), `src/backdrops/**` (incl. `assets/grain-112.{avif,png}`), `src/three/**`; `src/compat/surf/{media,backdrops}/**`; `tests/{media,backdrops}/**` (incl. `jest.doubles.cjs`, `compat.test.tsx`, `deprecation-coverage.test.ts`, `exports/**`, `assets.test.ts`); `tests/e2e/surf/{media,backdrops}/**`; `tests/a11y/apg/surf/{media-controls,image-viewer,carousel-rail}.apg.spec.ts`; `tests/visual/surf/media/**`; `tests/perf/browser/surf/{media-playback,media-sampling,backdrops-presets}.spec.ts`; `tests/types/surf/{media,backdrops}.test-d.ts`; `tests/a11y/manual/{records,scripts}/surf/{media,carousel,image-viewer}*`; `scripts/surf/{calibrate-media-tone,gen-grain-tile,gen-peaks-voice}.mjs`; `registry/blocks/media-viewer/**`; `registry/items/{media-video-player,media-audio-player,media-gallery,media-now-playing,media-transcript,backdrop-hero}/**`; `tests/capability/registry/{media-items,media-viewer}.test.tsx`; `fragments/codemods/surf/fixtures/media-backdrops/**`; `tests/fixtures/consumer-4x/cases/surf/media/**`; `etc/api/{media,backdrops,three}.*`.
Shared (own `lane W4` block only): `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,side-effects}/surf.ts`, `fragments/playwright/surf.json` (project `surf:cert-media-sampling`), `scripts/surf/verify-surf-purity.mjs` (media rule set), `tests/capability/purity-gate.test.ts` (media fixtures).

## Must not touch

Other lanes' paths and blocks; `certification/**` and `certification/scenes/**` (consume via `/scenes` only); `src/theme/color.ts` or any MAT file (SURF implements its own BT.709 luma in `src/media/sampling/luma.ts`); MAT floors and variables (`data-ag-backdrop` on chrome, any `--ag-*` MAT var); 4.x media/backdrop files and `release/4.x` code (PLAT); `showcase/**` (QUAL imports `registry/blocks/media-viewer/fixtures.ts`).

## Steps

1. **Sampling (pure first)** (REQ-SURF-151..153): `computeLumaStats` and `classifyTone` (constants `TONE_LIGHT_MEAN/P10`, `TONE_DARK_MEAN/P90`) with synthetic-RGBA tests; `sampleOwnedPixels` on a 32×32 `OffscreenCanvas` (detached `<canvas>` fallback), one `getImageData`, `requestIdleCallback` (500 ms timeout), LRU 64 keyed by `(currentSrc, region)`, tainted/zero-size → no tone + one dev warning (exact PRD text), silent in production. Calibrate once at alpha on a remote runner with `scripts/surf/calibrate-media-tone.mjs` over the 8 scenes; commit only `src/media/sampling/__fixtures__/scene-stats.json`, the run artifact goes to `.artifacts/surf/<job>/media-tone-calibration.json`.
2. **`useMediaElement`, store, `formatMediaTime`** (REQ-SURF-130..133): per-element external store over the 16 events of PRD §4.6, snapshots ≤`snapshotHz` (default 4, clamp 1–15) with immediate publish for play/pause/seeked/ended/error/volumechange; `--_ag-media-progress` from one `subscribeFrame` only while playing, visible and intersecting; `NotAllowedError` → `autoplay-blocked`; optional Media Session; one `AbortController` per element; never sets `src`, never `load()`, no `AudioContext`, no fetch; exact server snapshot.
3. **Backdrop presets** (REQ-SURF-155..160): server `Backdrop` with discriminated `preset` union; `aurora`/`mesh` as stacked radial gradients from S-03 colours (one element, no canvas, no `filter`, `%` positions); declarations (photo/video `media`, aurora/mesh `light|dark|auto`, grain none); `photo` `<img aria-hidden alt="">`; `video` muted/playsinline/loop, `preload="metadata"`, no `autoplay`, `BackdropTone` plays only under the continuous gate + intersecting + visible and renders the "Pause background video" toggle (WCAG 2.2.2); `motion="drift"` one keyframe under the gate; grain tile ≤8 KB AVIF / ≤16 KB PNG via `image-set()`; forced colors hide decorative layers.
4. **MediaScrubber → MediaControls → NowPlayingBar** (REQ-SURF-134..139): Scrubber on Base UI Slider (`aria-valuetext` spoken "1 minute 32 seconds of 4 minutes 10 seconds", buffered/chapters as layers whose only inline style is `--_ag-start/--_ag-end`, ≤1 seek per frame, 1 commit); MediaControls as Base UI Toolbar in one `SurfaceGroup` `chrome thin`, default `clear`, parts per PRD, shortcuts only when focus is inside (never `window`/`document`), container-responsive rows (≥480 / 320–479 / <320), Captions over real `TextTrack`s; NowPlayingBar with `role="progressbar"` from `--_ag-media-progress`, `Expand` with `aria-controls`, artwork sampled once per `src`.
5. **ImageViewer** (REQ-SURF-141..145): SURF overlay on Base UI Dialog with `useLayer({ kind: 'image-viewer', modal: true })`, focus to Close and back, id-keyed items (filter 10 → 3, trigger `p7` opens p7, 10/10), zoom 1–8× (wheel only with ctrl/meta or when zoomed, non-passive on Stage only), pan/pinch with pointer capture, `--ag-scrim-media` with no backdrop filter, ≤3 `<img>`, no `new Image()`, Inspector as a side panel ≥768 px / bottom region below (never a second dialog), counter announced once per navigation.
6. **CarouselRail** (REQ-SURF-146..150): APG carousel (`aria-roledescription`, `Indicators as: 'tabs' | 'buttons'`), scroll-snap + `IntersectionObserver` (threshold 0.6, no scroll listeners), Prev/Next `aria-disabled` at ends, autoplay only with `autoplay` **and** `[data-ag-continuous="on"]`, toggle first focusable, pauses on hover/focus/offscreen/hidden; no `backdrop-filter` in `src/media/CarouselRail/**`.
7. **`./three`** (REQ-SURF-165): day 0 `src/three/index.ts` = `export {};` and open contract PR `contract/three-entry` (`exports: []` at 5.0, `ga` kept); no 4.x three component is ported.
8. **Stories, items, block, migration** (REQ-SURF-09, -12..-15, -170, -171, -175): §13 stories (MediaControls `OverVideoClear`, `OverPhotoClear`, `OverFlatCanvas` (falls back to regular, D-12), `HeadlessUseMediaElement`, `CaptionsAndRate`, `Compact`, `EnhancedRefraction`; Scrubber, NowPlayingBar, ImageViewer, CarouselRail, Backdrop sets) using `/scenes` assets only; items `media-video-player`, `media-audio-player` (with `<track kind="captions">`), `media-gallery`, `media-now-playing`, `backdrop-hero`, 5.1 `media-transcript`; `media-viewer` block over `Backdrop preset="photo"`; W4 deprecation rows on `release/4.x` (DEP-S0600..0799, media family `since: '4.2.0'`, `ImageList*` `4.3.0`, sampler names, particle families with the `Backdrop preset="aurora"` hint); 13 compat adapters; `media-backdrops` area spec + fixtures; `cases/surf/media/`.
9. **Gates and fragments** (REQ-SURF-05, -06, -154, -194): media rule set of the purity gate (`AudioContext`, `webkitAudioContext`, `MediaRecorder`, media `.src` assignment, global `keydown`, `elementsFromPoint`/`elementFromPoint`/`html2canvas`/`foreignObject`/`getComputedStyle(` in sampling/backdrops, `.storybook`/`certification` imports); side-effect rows; L6 tone on/off registration; L8 project `surf:cert-media-sampling`; size and perf rows. 5.1: `Waveform` by additive contract PR to `./media`.

## Tests (remote for every `*.spec.ts`)

Jest: `src/media/sampling/{sampleOwnedPixels,classifyTone,toneCache,sampleErrors}.test.ts` (white 1.000±0.001, black 0.000±0.001; 100 `timeupdate` + 10 `seeked` → 1 `getImageData`), `src/media/**/useMediaElement{,.throttle,.raf,.session}.test.tsx` (60 `timeupdate`/s → ≤4 renders; 0 frame callbacks paused/hidden/offscreen; "listeners aborted"), `tests/media/useMediaElement.ssr.test.tsx`, `MediaControls.{parts,controlled,shortcuts,a11y}.test.tsx`, `MediaScrubber.test.tsx` (valuetext 0, 92, 3725, NaN), `NowPlayingBar.test.tsx`, `ImageViewer.test.tsx` ("filter then open", "≤3 images", "announces once"), `CarouselRail.test.tsx` (fake timers: prop only → no rotation; prop + gate → rotation), `src/backdrops/{Backdrop,Backdrop.ssr,BackdropTone}.test.tsx` (`getAnimations().length === 0`; MutationObserver sees only the two names), `tests/backdrops/assets.test.ts`, `tests/types/surf/{media,backdrops}.test-d.ts` (`@ts-expect-error` for non-media refs and arbitrary elements), `tests/media/{compat,deprecation-coverage}.test.tsx`, `tests/media/exports/*.test.ts`, `tests/capability/registry/{media-items,media-viewer}.test.tsx`, 5.1 `Waveform.test.tsx`; behaviour suites also under `jest -c tests/media/jest.doubles.cjs`.
Remote: `tests/a11y/apg/surf/{media-controls,image-viewer,carousel-rail}.apg.spec.ts`; `tests/e2e/surf/media/{controls-container,scrubber-drag,target-size,now-playing-container,image-viewer-chrome,blur-budget,sampling-engines}.spec.ts`; `tests/e2e/surf/backdrops/{motion,modes}.spec.ts` (L9); `tests/visual/surf/media/clear-over-media.spec.ts` (MediaControls and NowPlayingBar `clear` over 8 scenes × light/dark × glass/tinted/solid × default/contrast-more/forced-colors/reduced-motion × lightweight/standard/enhanced (Chromium) × 1440/390 × 3 engines, tone on/off); `tests/perf/browser/surf/{media-playback,media-sampling,backdrops-presets}.spec.ts` (4× throttle, `performance.measure('ag:sample')`). GPU/real-device cells may use the gated AWS remote runner.

## Visual evidence

Remote clear-over-media matrix captures, ImageViewer at 390/1440 (inspector placement), CarouselRail `MediaSlidesClearControls`, every Backdrop preset with glass over it (`GlassOverEachPreset`), as CI artifacts; L14 reviews the clear-over-media scene. Nothing committed.

## Prohibited

Index list, plus: mock waveforms/transcripts/peaks at runtime (fixtures are generated by scripts from real decoded media), DOM-point sampling or sampling anything the library does not own, lowering or overriding a MAT contrast floor from tone, page-wide key listeners, autoplay or loops without the continuous gate, `background-attachment: fixed`, `mix-blend-mode` on the host, setting `src` on consumer media.

## Exit criteria

- AC-SURF-18: clear-over-media passes every pixel gate over the full matrix (enhanced only if it certifies by RC-1, D-05) with 0 failures; tone forced on vs off never lowers worst-case contrast.
- AC-SURF-19: `classifyTone` correct for all 8 scene fixtures; a CORS-less image yields no tone and exactly one dev warning in 3 engines; `getImageData` once per source across 30 s of playback with 10 seeks, ≤4 ms at 4× throttle.
- AC-SURF-20: 30 s playback + 3 scrubs — 0 long tasks >50 ms, median ≥55 fps scrub, ≤4 commits/s per MediaControls; static gate 0 for global `keydown`, `Math.random`, `fetch`, `AudioContext`, `elementsFromPoint`, `backdrop-filter`, `!important` in `src/media/**` and `src/backdrops/**`.
- AC-SURF-21: every Backdrop preset at defaults — 0 animations, 0 rAF over 5 s, server render without a DOM, `video` paused with poster; reduced motion → carousel autoplay never starts; `autoplay` without `allowContinuous` does not rotate.
- AC-SURF-22: ImageViewer filter-then-open 10/10, ≤3 images; 0 horizontal overflow at 390 px and correct container states at 320/360/480/600 px for MediaControls and NowPlayingBar.
- W4 rows of AC-SURF-01 (`./media` 7 names, `./backdrops`, `./three` per OI-01), -11, -12, -13, -23 (`{ useMediaElement, MediaControls }` ≤14 KB, `{ ImageViewer }` ≤24 KB, grain assets), -24 (13 adapters, fixtures), -25 (flagships 43, 44), -26 (`media-viewer` and media items), -30 (5.1 `Waveform`, `media-transcript`).
- SURF-396..523 `DONE` or `BLOCKED`; `npm test`, `npm run typecheck` green; merge-SHA pipeline `success`.

## Final report format

```
PROMPT-4d SURF/W4 REPORT
Branches/PRs   Merge SHAs   GitLab pipelines: <URLs>
contract/three-entry: open | merged; tone calibration artifact: <URL>; TONE_* constants: <values>
Tasks SURF-396..523: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (130..160, 165, 175 and W4 shares)
AC-SURF-18..22 (+ W4 rows of -01/-03/-11/-12/-13/-23/-24/-25/-26/-30): PASS | FAIL | PENDING + artifact
Budgets measured vs rows; files changed; deviations with evidence
```
