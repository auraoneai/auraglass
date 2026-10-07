# PROMPT-14f (MED): `Waveform` and `ImageViewer` (lightbox, gallery navigation, viewer chrome)

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

**Release split (SC-12/SC-38).** `ImageViewer` (REQ-MED-40..49) ships in 5.0. `Waveform` (REQ-MED-35..39, MED-110..115 and MED-125) is **5.1** (C-E): build and test it on `main` behind no export; it is not appended to `src/media/index.ts`, not in the 5.0 API report and not in the 5.0 size gate. MED-167 (PROMPT-14h) exports it in 5.1.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. Read:
  - §2.1 E-07, E-08, E-09, E-10, E-14
  - §3 item 6
  - §4.2 (ImageViewer rows)
  - §4.6
  - §5.4 REQ-MED-35..39
  - §5.5 REQ-MED-40..49
  - REQ-MED-80, -82, -83
  - §10 API-MED-05, -06, -10
  - §11 item 6
  - §12.1 rows for Waveform and ImageViewer
  - §12.2 `ImageViewer.apg.spec.ts`
  - §13 rows for Waveform and ImageViewer
  - §14 (ImageViewer)
  - §15
  - §16 (`{ Waveform }` ≤2 KB, `{ ImageViewer }` ≤24 KB, ≤2 filters)
  - The "Reconciliation" note at the top and §21: `Waveform` is 5.1 (SC-12); OI-MED-03 (OVL `media` scrim variant).
- Shared contracts: SC-12, SC-19 (`--ag-scrim-media`), SC-25 (portal root, `usePortalContainer()`, `LayerStack` is the only Escape dispatcher), SC-28, SC-30 (APG spec path), SC-31.
- Overlays PRD `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`: the `Dialog` (OVL-040, `src/components/dialog/Dialog.client.tsx`) and `.ag-scrim` (OVL-023, `src/components/overlays/_shared/overlays.css`).
- Seeds (read only): `src/components/interactive/GlassImageViewer.tsx`, `GlassGallery.tsx`, `src/components/social/GlassVoiceWaveform.tsx`, `src/components/media/LiquidGlassPhotoInspector.tsx`.
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-110..MED-125.

Requirements: REQ-MED-35..49, plus REQ-MED-80/82/83 for these files. Acceptance: AC-MED-10 (the Dialog half), AC-MED-17.

## 2. Scope
May create (all NEW):
- `src/media/Waveform/{Waveform.tsx,WaveformLevel.tsx,downsample.ts}`
- `src/media/__fixtures__/peaks-voice.json`, `scripts/fixtures/gen-peaks-voice.mjs`
- `src/media/ImageViewer/{ImageViewer.tsx,useZoomPan.ts,ImageViewer.meta.ts}`
- `src/media/ImageViewer/parts/{Trigger,Popup,Stage,Toolbar,Caption,Inspector,Prev,Next,Counter,ZoomIn,ZoomOut,ZoomReset,Close}.tsx`
- `src/media/__tests__/{Waveform,ImageViewer}.test.tsx`
- `tests/a11y/apg/image-viewer.apg.spec.ts` (SC-30)
- `tests/media/Waveform.modes.spec.ts` (not named in PRD §12.2; it carries the REQ-MED-37/-39 computed-style lane checks)
- `src/media/{Waveform,ImageViewer}.stories.tsx`

May modify: the `/* Waveform */` and `/* ImageViewer */` sections of `src/media/media.css`, and appends to `src/media/index.ts` (`ImageViewer` only; never `Waveform` before 5.1).

Must NOT touch:
- `src/components/dialog/**`, `src/components/overlays/**` (OVL; consume `Dialog`)
- `src/theme/layers/**` (A11Y `LayerStack`)
- `src/material/**`, `src/a11y/**`, `src/components/**`
- `src/index.ts`
- dependencies

## 3. Prerequisites
- 14b merged (`toneCache`, purity gate) and 14c merged (`useMediaElement` export) for sampling helpers.
- OVL-040 `Dialog` (PROMPT_10_OVL): `test -f src/components/dialog/Dialog.client.tsx`, exposing Popup/Backdrop parts, with dismissal routed through A11Y `LayerStack` (A11Y-049). Without it, MED-116..124 are blocked. Do not build a dialog.
- FND-007 `usePortalContainer()` (`test -f src/foundation/portal.ts`, PROMPT_08_FND).
- OVL-023 `media` scrim variant (OI-MED-03): `rg -n "scrim-media|data-ag-scrim=.media" src`. If OVL rejects it, use the standard ≤12 px scrim and record the §16 ImageViewer filter budget as ≤3 (REQ-MED-46 fallback).
- DS tokens (PROMPT_03_DS): `--ag-on-surface`, `--ag-on-surface-muted`, `--ag-duration-micro` (DS-026), `--ag-scrim-media` (DS-028; accepted in SC-19).
- A11Y-054 announcer (`test -f src/theme/announcer/Announcer.tsx`) and A11Y-073 `tests/a11y/apg/harness.ts` (PROMPT_05_A11Y); QA-082 L5 Behaviour.
- FND-001 Base UI `Toolbar` (`node -e "require.resolve('@base-ui/react/toolbar')"`).
- PKG glyph entries for zoom-in, zoom-out, close, chevron-left and chevron-right (the same rule as 14e: use PKG's format only, and never inline SVG paths).

## 4. Steps
1. **MED-110 `downsample.ts`.** `downsamplePeaks(peaks: ArrayLike<number>, bars: number): Float32Array`. It is pure, takes max-abs per bucket, clamps each value to 0–1, and clamps `bars` to 8–256. Equal input produces equal output.
2. **MED-111 `Waveform.tsx`.** No directive and no hooks on the `peaks` path.
   - Props per REQ-MED-35. `label` is required.
   - Renders exactly one `<svg role="img" aria-label={label} viewBox="0 0 {bars} 1" preserveAspectRatio="none">` containing one `<path d>` built from the downsampled columns as rect subpaths, with numbers rounded to 4 decimals so `d` is byte-stable.
   - When `progress` is set, render a second `<path>` clipped by one `<clipPath>` `<rect width={progress*bars}>`. That is ≤2 paths, and there are no per-bar nodes.
   - Fill: played = `var(--ag-on-surface)`, unplayed = `var(--ag-on-surface-muted)`. Under `forced-colors: active`, use `CanvasText`/`GrayText`.
   - When `level` is defined, render `<WaveformLevel>` instead.
3. **MED-112 `WaveformLevel.tsx`** (`"use client"`). A single-bar meter: `transform: scaleY(level)` with `transition: transform var(--ag-duration-micro)`. The transition is removed under `[data-ag-motion=calm]` and `[data-ag-motion=none]`. There is no rAF and no animation loop; the consumer drives `level`.
4. **MED-113 fixture.** `scripts/fixtures/gen-peaks-voice.mjs` decodes a licensed or CC0 voice recording with the ffmpeg CLI on the remote runner and writes 1,024 max-abs peaks to `src/media/__fixtures__/peaks-voice.json` as `{ "source": "<URL>", "license": "<SPDX or licence URL>", "sha256": "<input hash>", "peaks": [...] }`. Random or synthetic peaks are forbidden. If no licensed clip is approved, block MED-113, MED-115 `Voice Memo Peaks` and the Waveform part of MED-125, and report.
5. **MED-114 `Waveform.test.tsx`.** Assert:
   - 1 svg with `role=img`.
   - ≤2 paths; 1 path when `progress` is undefined.
   - 10,000 input peaks produce `bars` columns, counted as subpaths in `d`.
   - A `d` snapshot for a fixed 16-value array (a new snapshot, written once; never regenerated to pass).
   - A server render with `peaks` under `/** @jest-environment node */`.
   - No `Math.random`; the purity gate covers this.
6. **MED-116 `ImageViewer.Root/Trigger/Popup`.**
   - Root props per REQ-MED-40. `items` are keyed by `id`; selection is `value`/`defaultValue`/`onValueChange(id)`; open state is `open`/`defaultOpen`/`onOpenChange`; `loop` defaults to false.
   - `Trigger` takes `itemId` and resolves by id (REQ-MED-43).
   - `Popup` is OVL's `Dialog` popup (OVL-040), portalled via `usePortalContainer()` (FND-007):
     - `role="dialog"`, `aria-modal="true"`.
     - `aria-label` is the current item's `alt`, or `aria-labelledby` points at the `Caption` id when one is rendered.
     - Initial focus is `Close`. Focus returns to the invoking Trigger. The background is `inert`.
     - Escape closes only when the viewer is on top of A11Y's `LayerStack` (A11Y-049), which is the only Escape dispatcher (SC-25). The popup registers no keydown Escape handler of its own.
7. **MED-117 `Stage` + `useZoomPan.ts`.**
   - `Stage` sets `data-ag-backdrop="media"` and `data-state="zoomed|fit"`.
   - It renders the current `<img>` plus the previous and next as hidden `<img loading="eager" decoding="async" fetchpriority="low">`. At most 3 `<img>` exist at once. No `new Image()` and no `fetch`.
   - It samples the current image via `getOrSampleTone` (it is library-rendered) and writes the tone on `Stage`.
   - Zoom range is 1–8×, with a 1.25× step for buttons and keys.
   - Wheel uses a non-passive listener on `Stage` only. It calls `preventDefault` only when `ctrlKey || metaKey` or when already zoomed, so page scroll is not blocked at 1×.
   - Pan uses pointer events with `setPointerCapture`. Pinch works with two active pointers.
   - Transforms are `translate3d()` and `scale()` on the `<img>` only. `touch-action` is `none` while zoomed and `pan-y` at 1×.
8. **MED-118 chrome parts.**
   - `Toolbar` uses Base UI Toolbar and `Caption` is a separate surface. Both are `chrome` `clear` `thin` (2 surfaces, ≤2 `backdrop-filter`) and are inset by `env(safe-area-inset-*)`.
   - `Prev` and `Next` resolve by id; with `loop=false` they are disabled at the ends.
   - Keys inside the popup only: Left/Right, Home/End, `+`/`=`, `-`, `0`. No window or document listeners.
   - `Counter` renders "3 of 12" and announces once per navigation through the A11Y announcer (A11Y-054; the popup's single live region).
   - `ZoomIn`, `ZoomOut`, `ZoomReset` and `Close` are labelled buttons.
9. **MED-119 `Inspector`.** Optional `overlay` `regular` side panel, 320 px at ≥768 px. Below 768 px it is a bottom region inside the same popup, with max height 50 dvh. It is never a second dialog. It is the `LiquidGlassPhotoInspector` successor and reuses its section markup.
10. **MED-120 CSS.**
    - The popup is full-viewport at all sizes.
    - The scrim uses the `media` variant: `background: var(--ag-scrim-media)`, `--_ag-scrim-blur: 0`, computed `backdrop-filter: none`.
    - Under `prefers-reduced-motion: reduce`, open, close and slide transitions are opacity-only within `--ag-duration-micro`, and zoom applies without a transition.
    - No literals.
11. **MED-121 `ImageViewer.meta.ts`.** Parts, `data-state` values and variants (§11.3 shape).
12. **MED-122 `ImageViewer.test.tsx`.**
    - Id-keyed navigation.
    - Regression: filter 10 items to 3, click the Trigger for `"p7"`, and assert the stage `alt` is p7's. Run 10 iterations (AC-MED-17).
    - ≤3 stage `<img>`.
    - The announcer spy is called once per navigation.
    - Computed scrim `backdrop-filter: none`.
    - The Inspector renders as a region at 390 px and as a side panel at 1440 px (matchMedia stub).
13. **MED-123 (remote) `tests/a11y/apg/image-viewer.apg.spec.ts`.** Runs through the A11Y APG harness (A11Y-073) in QA lane L5 Behaviour (QA-082), 3 engines. Covers:
    - focus in and out, `inert`, Escape via `LayerStack`, and keys
    - pointer pan, pinch (two pointers) and ctrl-wheel zoom, asserting the `transform` values
    - `window.scrollY` changes on a wheel at 1× (scroll is not prevented)
    - axe reports 0
14. **MED-124 stories + exports (5.0).**
    - ImageViewer stories: `Lightbox from Grid`, `Zoom and Pan`, `With Inspector`, `Mobile (390) Inspector Sheet`, `Filtered Gallery (id-keyed)`. Images are `/scenes/*` QA assets (SC-28).
    - Every story has a `play` function and uses SB's `StoryEnvironment` decorator (SB-048) and story contract (SB-071), with realistic captions. No `previewSurface`.
    - Append `ImageViewer` with its types to `src/media/index.ts`. Do not export `Waveform` (5.1, MED-167).
    - **MED-115 (5.1):** Waveform stories `Voice Memo Peaks`, `Live Level Meter` (fixture-driven, on the Storybook clock), `Played Progress`, importing from the module path, not from `aura-glass/media`.
15. **MED-125 (remote, 5.1) `Waveform.modes.spec.ts`.** In QA lane L6 Environment visual (forced-colors axis, QA-056) the computed path fills are `CanvasText`/`GrayText`. In L9 Motion (QA-076), under `[data-ag-motion=calm]` and `[data-ag-motion=none]`, `WaveformLevel` has `transition-duration: 0s`. The ImageViewer reduced-motion check (REQ-MED-49) is a 5.0 item in MED-151 (PROMPT-14h).

## 5. Tests to run
- Local (light): `./node_modules/.bin/jest src/media/__tests__/Waveform.test.tsx src/media/__tests__/ImageViewer.test.tsx`, `node scripts/ci/verify-media-purity.mjs`, `tsc --noEmit -p tsconfig.json`, eslint.
- Remote: `npm run build`, MED-123 and MED-125 in 3 engines, the MED-113 fixture generation, the Storybook build with `play` functions, a filter count while ImageViewer is open (≤2, or ≤3 under the fallback), and INP for next/prev ≤100 ms at 4× throttle (logged; 14h gates it).

## 6. Visual evidence
Capture remotely as artifacts for human review:
- Every story at 1440×900 and 390×844 in light and dark.
- The viewer open over `photo`, `dark-media`, `flat-white` and `hf-pattern`.
- Zoomed state, inspector side and sheet, forced colors.

## 7. Integrity rules (binding)
- No local Docker or local browser.
- No random peaks, no AnalyserNode and no audio decoding in the library.
- Do not build a dialog if OVL's is missing.
- No index-keyed navigation.
- No window or document `keydown` listeners.
- No `.skip`, `.only` or `.todo`, and no `-u` beyond the first write of the new `d` snapshot.
- Do not raise the 3-image or filter limits.
- Do not commit evidence.

## 8. Exit criteria
- 5.0: REQ-MED-40..49 each have a green named test (MED-122, MED-123; REQ-MED-49 via MED-151).
- 5.1: REQ-MED-35..39 green (MED-114, MED-125).
- AC-MED-17: the filter-then-open regression passes 10/10 and the stage holds ≤3 images.
- AC-MED-10 (Dialog half): L5 Behaviour is green in 3 engines with axe 0.
- ImageViewer open has ≤2 `backdrop-filter` (or ≤3 with the recorded fallback).

## 9. Final report format
```
PROMPT-14f REPORT
Branch/SHA:
Tasks: MED-110..125 -> done|blocked (reason) each
Waveform: built (5.1, not exported) | blocked (reason)
Peaks fixture source/licence:
Scrim: media variant (blur 0) | fallback <=12px (budget <=3)
ImageViewer backdrop-filter count open: N
Filter-then-open regression: 10/10
APG (Chromium/WebKit/Gecko): pass/fail
Tests: name -> pass/fail (local|remote URL)
Visual artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
