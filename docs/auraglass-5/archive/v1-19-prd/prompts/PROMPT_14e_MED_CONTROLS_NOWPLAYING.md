# PROMPT-14e (MED): Flagship 43, part 1: `MediaScrubber`, `MediaControls`, `NowPlayingBar`

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, CTL, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

## 1. Sources (read before editing)
- PRD `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`:
  - §2.1 E-01, E-02, E-06, E-11, E-15, E-16
  - §3 item 4
  - §4.2 rows MediaControls/NowPlayingBar/Scrubber
  - §4.3 last paragraph
  - §4.6
  - §5.3 (REQ-MED-20..29)
  - §5.4 REQ-MED-30..34
  - REQ-MED-80, -82, -83
  - §10 API-MED-03/04
  - §11 items 2 and 5
  - §12.1/12.2 rows for these components
  - §13 rows MediaControls/MediaScrubber/NowPlayingBar
  - §14 rows MediaControls/Hit targets/MediaScrubber/NowPlayingBar
  - §15
  - §16
- Architecture: §11.2 #43, §11.3, D-12 (clear needs a declared backdrop), §7.
- Seeds (read only): `src/components/media/LiquidGlassMediaControls.tsx`, `src/components/media/LiquidGlassNowPlayingBar.tsx`.
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-080..MED-101.

**Requirements:** REQ-MED-20..34; REQ-MED-80 (these files); REQ-MED-82 (Root, Scrubber); REQ-MED-83.
**Acceptance:** AC-MED-10 (MediaControls Toolbar/Slider APG and axe half), AC-MED-18.

## 2. Scope

May create (all NEW):
- `src/media/MediaScrubber/{MediaScrubber.tsx,BufferedLayer.tsx,ChapterMarkers.tsx}`
- `src/media/MediaControls/{MediaControls.tsx,MediaControls.meta.ts,shortcuts.ts}`
- `src/media/MediaControls/parts/{PlayButton,Time,Volume,Mute,Rate,Captions,PictureInPicture,Fullscreen,Spacer,MoreMenu}.tsx`
- `src/media/NowPlayingBar/{NowPlayingBar.tsx,NowPlayingBar.meta.ts}`
- `src/media/NowPlayingBar/parts/{Artwork,Title,Subtitle,Progress,Actions,Expand}.tsx`
- `src/media/__tests__/{MediaScrubber,MediaControls.parts,MediaControls.controlled,MediaControls.shortcuts,MediaControls.a11y,NowPlayingBar}.test.tsx`
- `tests/a11y/apg/media-controls.apg.spec.ts` (SC-30: APG specs live at `tests/a11y/apg/<kebab>.apg.spec.ts`, owned by the component PRD) and `tests/media/{MediaScrubber.drag,NowPlayingBar.container,MediaControls.container}.spec.ts`. `MediaControls.container.spec.ts` is not named in PRD §12.2. It is added for AC-MED-18's 320/480 MediaControls states.
- `src/media/{MediaControls,MediaScrubber,NowPlayingBar}.stories.tsx`

May modify:
- `src/media/media.css`: the `/* MediaScrubber */`, `/* MediaControls */` and `/* NowPlayingBar */` sections only
- `src/media/index.ts`: append `MediaControls`, `MediaScrubber`, `NowPlayingBar` and their prop types
- `src/media/useMediaElement.ts`: only to call the existing internal `registerMediaRoot`, if 14c left a gap

Must NOT touch:
- `src/material/**`, `src/foundation/**` (consume them)
- `src/icons/**`, except as allowed in §3
- `src/components/**`
- `src/index.ts`
- dependencies

## 3. Prerequisites
Check each. If one fails, block the dependent tasks and report it.

- 14c is merged: `rg -n "export \{ useMediaElement" src/media/index.ts`.
- FND-001/FND-005 (PROMPT_08_FND), with `@base-ui/react` pinned and the parts registry `src/foundation/parts.ts`: `node -e "require.resolve('@base-ui/react/slider');require.resolve('@base-ui/react/toolbar');require.resolve('@base-ui/react/toggle');require.resolve('@base-ui/react/menu')"` and `test -f src/foundation/parts.ts`. All of these are absent at HEAD. Do not add Base UI yourself.
- MAT-047 (PROMPT_04_MAT): `test -f src/material/SurfaceGroup.tsx && test -f src/material/Surface.tsx`. Glass comes only from `<SurfaceGroup layer="chrome" variant=… thickness="thin">` or the `materialProps()` attributes. Never write optics CSS.
- A11Y-073/A11Y-065 (PROMPT_05_A11Y): `test -f tests/a11y/apg/harness.ts && test -f src/a11y/css/targets.css`, plus the tokens `--ag-target-coarse` and `--ag-space-*` (`rg -n "target-coarse" src/a11y src/tokens`).
- PKG per-glyph icon entries in `src/icons/glyphs/**` (exports manifest PKG-005). Glyphs needed: `play`, `pause`, `volume`, `volume-off`, `captions`, `picture-in-picture`, `fullscreen`, `fullscreen-exit`, `skip-back`, `skip-forward`, `chevron-up`, `more-horizontal`.
  - If some are missing, add them only through PKG's glyph format/generator, if one exists. Otherwise file a request to PKG and leave that button's glyph part blocked.
  - Never inline SVG paths in `src/media/**`. `src/icons/media.ts` is lineage only (it exports `PlayIcon` and others).
- SB-048/SB-071 (`StoryEnvironment` in `.storybook/preview.tsx`, story contract) and QA-038/039 `certification/scenes/` (stories, MED-101). QA-082 (L5 Behaviour) for MED-083/095/099/100.

## 4. Steps
1. **MED-080 `MediaScrubber.tsx`** (`"use client"`).
   - Wraps Base UI `Slider` (Root, Control, Track, Indicator, Thumb) with `data-ag-part` values `media-scrubber`, `-track`, `-indicator`, `-thumb`.
   - Props per REQ-MED-23. Defaults: `step` 1, `largeStep` 10. `frameRate` enables `,` and `.` steps of `1/frameRate` s while paused.
   - `aria-label="Seek"`. `aria-valuetext` = `formatMediaTime(v,{spoken:true}) + ' of ' + formatMediaTime(max,{spoken:true})`. When `max` is not finite: `"… of unknown duration"`.
   - **Drag (REQ-MED-25).** Coalesce `onValueChange` to one call per rAF. Call `onValueCommit` once on release. The thumb gets `data-ag-layer="transient"` only while `data-dragging`.
   - The indicator fill reads `--ag-media-progress` during playback.
2. **MED-081 layers.**
   - `BufferedLayer` renders one `<div data-ag-part="media-scrubber-buffered" style={{'--ag-start': s/max, '--ag-end': e/max}}>` per range.
   - `ChapterMarkers` renders `<div data-ag-part="media-scrubber-chapter" title={title} style={{'--ag-chapter-start': start/max}}>`.
   - Hover tooltip: `data-ag-part="media-scrubber-hover"`, `aria-hidden="true"`, shown only under `(hover: hover)`. At coarse pointer the time appears above the thumb while dragging.
   - The thumb's `::before` expands the hit area to ≥44 px tall at `(pointer: coarse)`.
3. **MED-084 `MediaControls.Root`** (`"use client"`).
   - Base UI `Toolbar` with `role="toolbar"`, `aria-label={label ?? "Media controls"}`, one tab stop, and roving Left/Right/Home/End.
   - Renders inside `SurfaceGroup` (layer `chrome`, `variant` default `'clear'`, thin, size class `bar`). That gives exactly one `backdrop-filter`; child buttons have none of their own.
   - `refraction` passes through to the enhanced-tier flag only (§16 PRD-15, interim owner MAT, SC-37).
   - Props per REQ-MED-21. `media` (a `MediaHandle`) or controlled props. Passing both `media` and `playing` logs one dev `console.error`.
   - Sets `data-ag-media-root` and `data-state` = `playing|paused|waiting|ended|error` (REQ-MED-82), and registers itself via `registerMediaRoot`.
   - Default children reproduce the 4.x layout: `PlayButton`, `Scrubber`, `Time`, `Volume`.
   - `ref` is a prop (no `forwardRef`).
4. **MED-085 toggles.**
   - `PlayButton`, `Mute`, `PictureInPicture`, `Fullscreen` are Base UI `Toggle`s with `aria-pressed`. Labels stay fixed: "Play", "Mute", "Picture in picture", "Full screen".
   - `PictureInPicture` renders nothing when `document.pictureInPictureEnabled` is false. It renders after mount, using a client-only effect that avoids hydration mismatch.
   - Hit targets: ≥`--ag-target-coarse` (44) at `(pointer: coarse)`, ≥32 px at fine pointer, expressed with `--ag-space-*` tokens. No px literals.
5. **MED-086 parts.**
   - `Time`: `<time dateTime="PT1M32S">` elements with `font-variant-numeric: tabular-nums`, and `aria-hidden="true"` when a Scrubber is present (detected via the Root context).
   - `Volume`: a Base UI Slider, `aria-label="Volume"`, valuetext "N percent".
   - `Rate`: a Base UI Slider or Menu with values 0.5/0.75/1/1.25/1.5/2. `<` and `>` step through it.
   - `Spacer`: `aria-hidden`.
   - Every part sets `data-ag-part="media-<part>"` (REQ-MED-20).
6. **MED-087 `Captions` (REQ-MED-29).**
   - Considers only `textTracks` of kind `captions`/`subtitles`. With 0 tracks it renders nothing. With 1 track it is a `Toggle` that flips `mode` between `showing` and `disabled`. With more than 1 it is a Base UI `Menu` listing the track labels plus "Off".
   - The library never generates captions.
7. **MED-088 shortcuts (REQ-MED-26).**
   - A `keydown` handler on the Root element, and on `shortcutTarget.current` when that is given. It acts only if `event.target` is inside that element and is not an editable field: Space/K, J/L ±10 s, M, F, C, `<`/`>`.
   - Never attach to `window` or `document`.
   - `shortcuts={false}` disables it.
8. **MED-089 `media.css`.**
   - `@container ag-media`: at ≥480 px, the full row. At 320–479 px, `Volume` collapses to `Mute`, `Rate`/`PictureInPicture` move into `MoreMenu` (Base UI Menu, `aria-label="More"`), and `Time` shows elapsed only. Below 320 px, Play and Scrubber only.
   - `flex-wrap: nowrap`.
   - Track and fill use `--ag-on-surface` tokens. Under `forced-colors`, `CanvasText`/`Highlight`.
   - The focus ring is A11Y's. No `backdrop-filter`, colour, radius or duration literals.
9. **MED-096 `NowPlayingBar`.**
   - Parts and Root props per REQ-MED-30. `variant` defaults to `'regular'`, and nothing switches it automatically. Root is a `Surface` with layer `chrome`, thickness `regular`.
   - `Progress` (REQ-MED-31): `role="progressbar"`, `aria-valuemin=0`, `aria-valuemax=100`, integer `aria-valuenow`, spoken `aria-valuetext`. The fill comes from `--ag-media-progress` (`transform: scaleX(var(--ag-media-progress))`), with no inline `width`.
   - `Expand` (REQ-MED-32): `aria-expanded` and `aria-controls={expandedId}`. If `expandedId` is missing, log a dev error.
   - `Artwork` (REQ-MED-33): `<img alt="">` by default, overridable with `alt`. It reserves its size with `width`/`height` (CLS 0). When `sampleTone` is set, it samples the artwork through `getOrSampleTone` once per distinct `src` and writes the tone on Root.
   - `Actions`: optional `onPrevious`/`onNext` icon buttons labelled "Previous track"/"Next track".
10. **MED-097 NowPlayingBar CSS + meta.**
    - `@container ag-now-playing (min-width: 360px)` gives a single row. Below that width, `Subtitle` and the non-play `Actions` are hidden, and `Title` truncates with ellipsis. The bar never wraps.
    - Height is 56 px coarse / 48 px fine, via tokens. When `fixed`, add `env(safe-area-inset-bottom)`.
    - `NowPlayingBar.meta.ts` and `MediaControls.meta.ts` (MED-090) type the variants, the `data-ag-part` list and the `data-state` values (§11.3).
11. **Tests.**
    - **MED-082** `MediaScrubber.test.tsx`: valuetext at 0/92/3725/NaN, the buffered and chapter nodes with their custom properties, a single commit per simulated drag.
    - **MED-091** `MediaControls.parts.test.tsx`: every `data-ag-part`, and the 5 `data-state` values driven by stub-element events.
    - **MED-092** `MediaControls.controlled.test.tsx`: the headless DOM equals the controlled DOM after removing the `data-ag-media-root` id. One dev error when both are supplied.
    - **MED-093** `MediaControls.shortcuts.test.tsx`: Space inside an external `<input>` does not toggle. Space with focus inside the Root does. `shortcutTarget` extends the scope. `addEventListener` is never called on `window`/`document` for `keydown`.
    - **MED-094** `MediaControls.a11y.test.tsx`: jest-axe reports 0 violations in the default, clear and captions-menu states. `aria-pressed` is present on the toggles.
    - **MED-098** `NowPlayingBar.test.tsx`: the progressbar values, `style.width` is empty, `aria-expanded`/`aria-controls`, the dev error, and one sample per artwork `src`.
12. **Remote specs.**
    - **MED-083** `MediaScrubber.drag.spec.ts`: a 300 px pointer drag over 30 frames gives ≤30 seek calls and 1 commit.
    - **MED-095** `tests/a11y/apg/media-controls.apg.spec.ts`: through `tests/a11y/apg/harness.ts` (A11Y-073) in QA lane L5 Behaviour (QA-082), Chromium, WebKit and Gecko. Checks toolbar roving, that the slider's Arrow keys adjust the value, that Tab exits, and axe 0.
    - **MED-099** `NowPlayingBar.container.spec.ts`: container widths 320/360/600.
    - **MED-100** `MediaControls.container.spec.ts`: 320/480/600, plus 0 horizontal overflow at a 390 px viewport.
13. **MED-101 stories + exports.** Stories exactly as PRD §13:
    - MediaControls: `Over Video (Clear)`, `Over Photo (Clear)`, `Over Flat Canvas (falls back to Regular)`, `Headless with useMediaElement` (a real `<video src="/scenes/video-frame.webm">`), `Captions and Rate` (a `<track kind="captions">` WebVTT fixture added under the story's own folder), `Compact (Play + Scrubber)`, `Enhanced Refraction (Chromium)`.
    - MediaScrubber: `Buffered and Chapters`, `Frame Step (paused, 24 fps)`, `Unknown Duration (live)`.
    - NowPlayingBar: `Over Album Art`, `Collapsed at 320px`, `With Expanded Player`.

    Every story has a `play` function, uses `StoryEnvironment`, and contains realistic copy. No `previewSurface`, and no inline optics. Append the exports to `src/media/index.ts`.

## 5. Tests to run
- **Local (light):** `./node_modules/.bin/jest src/media/__tests__/MediaScrubber.test.tsx src/media/__tests__/MediaControls src/media/__tests__/NowPlayingBar.test.tsx`, `node scripts/ci/verify-media-purity.mjs`, `tsc --noEmit -p tsconfig.json`, and eslint on `src/media` (PRD-04 optics lint and PRD-07 ref lint, if they have landed).
- **Remote:** `npm run build`, MED-083/095/099/100 in 3 engines, the Storybook build and `play` functions, and the MAT single-`backdrop-filter` count (QA `cost.spec.ts`, QA-060). Each of `MediaControls` and `NowPlayingBar` must have exactly 1 element with a computed `backdrop-filter` other than `none`.

## 6. Visual evidence
Capture remotely and attach as CI artifacts for human review:
- every story at 1440×900 and 390×844, in light and dark, over the `video-frame`, `photo`, `dark-media` and `flat-white` scenes
- container states 320/360/480/600
- forced colors and contrast more

14h owns the full clear-over-media matrix.

## 7. Integrity rules (binding)
- Do not use local Docker or a local browser.
- Do not write your own slider or toolbar if Base UI is missing. Block instead.
- No text-word buttons, no inline `width`, and no `backdropFilter`.
- No window or document `keydown` listeners.
- No `.skip`, `.only` or `.todo`. Do not pass `-u`. Do not lower target sizes or the seek-call limits.
- Do not commit evidence.

## 8. Exit criteria
- REQ-MED-20..34 each have a green named test (MED-082, 091–095, 098–100).
- AC-MED-10 (MediaControls): L5 Behaviour passes in 3 engines and axe reports 0.
- AC-MED-18: 0 overflow at 390, and the container states are correct at 320/360/480/600.
- 1 `backdrop-filter` per bar.

## 9. Final report format
```
PROMPT-14e REPORT
Branch/SHA:
Tasks: MED-080..101 -> done|blocked (reason) each
Base UI version pinned by FND-001:
Glyphs: present | added via PKG generator | blocked (list)
backdrop-filter count: MediaControls=… NowPlayingBar=…
Seek calls over 30-frame drag: N; commits: 1
APG (Chromium/WebKit/Gecko): pass/fail
Tests: name -> pass/fail (local|remote URL)
Visual artifacts: URLs
Deviations (with evidence) or none
Files changed:
```
