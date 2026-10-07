# PROMPT-14b (MED): Subpath entries, `formatMediaTime`, the media purity gate, owned-pixel sampling core

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). The prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. Read §2.2 (E-20..E-26), §3 items 1, 2 and 5, §4.1, §4.4, §5.1, REQ-MED-16, REQ-MED-26 (static half), §5.7 (REQ-MED-60..67), REQ-MED-77, REQ-MED-80, §8 (`formatMediaTime` row), §12.1 rows (formatMediaTime, sampling), §12.3, §18 item 5, §20 step 2 and §21 (open items).
- Shared contracts: SC-07 (evidence dir), SC-10 (required check names), SC-11 (scripts layout), SC-12 (exports manifest; 7 `./media` values at 5.0.0), SC-17 (raw-value lint), SC-21 (attribute registry), SC-28 (scene ids).
- Architecture: §3 package-map rows `./media` and `./backdrops`, §4.1 item 1 (no DOM-behind sampling), §7 (single luminance helper, item 3 glyph flip), D-15, D-32.
- Evidence: `docs/auraglass-5/autopsy/material-engine.md` (MATERIAL-ENGINE-08), `docs/auraglass-5/autopsy/runtime-remote.md` (lines 14 and 65).
- Packaging PRD `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md`: the exports manifest, the directive lint, `scripts/ci/verify-side-effects.mjs`.
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-020..MED-037.

**Requirements in scope:**
- REQ-MED-01 (entry wiring only; the final export-list spec lives in 14h)
- REQ-MED-03
- REQ-MED-04 for `src/media/index.ts`, `formatMediaTime.ts` and `sampling/classifyTone.ts`
- REQ-MED-16
- REQ-MED-26 (the static ban only)
- REQ-MED-60, -61, -63, -64 (idle scheduling; the perf measurement is in 14h), -65
- REQ-MED-67 (the grep gate only)
- REQ-MED-77 (the import-boundary half)
- REQ-MED-80 (the gate)

**Acceptance criteria in scope:** AC-MED-05 (the `classifyTone` half), AC-MED-11.

## 2. Scope

**May create or modify:**
- `build/exports.manifest.json` (PKG-owned, PKG-005; rows only, by MODIFY): add `./media` → `src/media/index.ts`, `./media.css` → `src/media/media.css`, `./backdrops` → `src/backdrops/index.ts`, `./backdrops.css` → `src/backdrops/backdrops.css`. Regenerate `package.json#exports` only with PKG's `scripts/build/generate-exports.mjs`. Never hand-edit `exports`.
- NEW `src/media/index.ts`, `src/media/media.css`, `src/media/formatMediaTime.ts`
- NEW `src/media/sampling/{sampleOwnedPixels.ts,classifyTone.ts,toneCache.ts}`, `src/media/sampling/__fixtures__/scene-stats.json`, `src/media/sampling/__tests__/{sampleOwnedPixels,classifyTone,toneCache,sampleErrors}.test.ts`
- NEW `src/media/__tests__/formatMediaTime.test.ts`
- NEW `scripts/ci/verify-media-purity.mjs`, `tests/ci/verify-media-purity.test.ts`, `tests/ci/fixtures/media-purity/**`
- NEW `scripts/audit/calibrate-media-tone.mjs` (dev-only, never a required check, SC-11)
- `package.json`: the `scripts` field only, to add `"verify:media-purity": "node scripts/ci/verify-media-purity.mjs"`
- `.github/workflows/glass-pipeline.yml` (PKG-owned, SC-10): one step inside the existing `Glass Quality Gates` job that runs `npm run verify:media-purity` after `lint:check`. No new job, no required-check rename.
- `src/theme/color.ts`: only under the condition in step 6

**Must NOT touch:**
- `src/material/**` (MAT)
- `src/primitives/LiquidGlassBackdropSampler.tsx`, `src/hooks/useLiquidGlassBackdrop.ts` (MAT)
- `src/tokens/glass.ts` (the `sampleBackdropLuminance` deletion is owned by MAT/FND)
- `eslint-plugin-auraglass.js` (PKG wiring; the A11Y `no-runtime-contrast` allowance for `src/media/sampling/**` is A11Y's decision, OI-MED-06)
- any `src/components/**`
- `src/index.ts`
- dependencies (`canvas` and `jest-canvas-mock` must not be added)

## 3. Prerequisites
- PKG-005 manifest (PROMPT_02_PKG): `test -f build/exports.manifest.json`. If it is missing, MED-020 is blocked. Record the four rows in the report for PKG to apply. All other tasks proceed.
- PKG-038 pipeline: the `Glass Quality Gates` job exists in `.github/workflows/glass-pipeline.yml`. If not, MED-027 is blocked.
- QA-038/QA-039 scenes for MED-031 (PROMPT_18_QA): `test -f certification/scenes/scenes.manifest.json`, with ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`. If they are missing, MED-031 and the scene-table half of MED-032 are blocked. MED-032 still asserts the threshold boundaries on synthetic stats, and `scene-stats.json` is not fabricated.
- The ESLint/AST tooling already present: `node -e "require.resolve('typescript')"` (used for the AST gate; nothing is added).

## 4. Steps
1. **MED-020.** Add the four manifest rows. `./media` and `./backdrops` are ESM entries with types. The `.css` rows are style exports.
2. **MED-021.** `src/media/index.ts` is a pure re-export barrel: no `"use client"`, no statements other than `export … from`. At this stage it exports `formatMediaTime` and its types. Later prompts append `useMediaElement`, `MediaControls`, `MediaScrubber`, `NowPlayingBar`, `ImageViewer` and `CarouselRail` (7 values at 5.0.0). `Waveform` is appended only in 5.1 (MED-167, SC-12). Sampling internals are never exported.
3. **MED-022.** `src/media/media.css` starts with the SC-20 layer statement `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` followed by `@layer ag.components { }` and has a header comment listing the component sections later prompts fill in. It contains no `!important`, no `backdrop-filter` and no colour literals.
4. **MED-023.** `formatMediaTime(seconds: number, opts?: { spoken?: boolean; hours?: 'auto' | 'always' }): string` is pure and server-safe, and uses `Intl.NumberFormat` only (with `style: 'unit'`, `unit: 'minute'|'second'|'hour'`, `unitDisplay: 'long'` for spoken output). Expected values:
   - `0`→`"0:00"`
   - `92`→`"1:32"`
   - `3725`→`"1:02:05"`
   - `hours:'always'`, `92`→`"0:01:32"`
   - spoken `92`→`"1 minute 32 seconds"`
   - spoken `3725`→`"1 hour 2 minutes 5 seconds"`
   - spoken `0`→`"0 seconds"`
   - `NaN`/`Infinity`→`"--:--"` / `"unknown duration"`
   - negative values clamp to 0
5. **MED-024.** `formatMediaTime.test.ts` covers every value above. Add a `/** @jest-environment node */` case proving there is no DOM dependency.
6. **MED-028.** In `sampleOwnedPixels.ts`, export (module-internal) `computeLumaStats(data: Uint8ClampedArray, width: number, height: number): ToneStats`, where `ToneStats` is `{ mean, p10, p90, stdev }`. It computes BT.709 relative luminance on linearised sRGB with the single helper in `src/theme/color.ts`. At HEAD that file only has `relativeLuminance(hex: string)` (`:49-59`).
   - If a channel-level helper exists when you start, use it.
   - Otherwise, make one C-I extraction: add `relativeLuminanceFromChannels(r: number, g: number, b: number): number` and have `relativeLuminance` call it. The output must be byte-identical and existing tests must stay green. Record this as a deviation, because §6 marks the file "Consumed".
   - Do not duplicate the formula.

   Also export `sampleOwnedPixels(el: HTMLImageElement | HTMLVideoElement, region?: { x; y; w; h }): ToneStats | null`. It draws the element (or its fractional region) into a 32×32 `OffscreenCanvas`, falling back to a detached `<canvas>` that is never appended to the document. It calls `getImageData` once and wraps the call in `performance.mark('ag:sample:start')` and `performance.measure('ag:sample', 'ag:sample:start')`. Percentiles use a sort over the 1,024 luma values.
7. **MED-035 (error path, same file).** A `SecurityError`, a draw or decode exception, `naturalWidth === 0`, `videoWidth === 0` or a zero-size region all return `null`, never throw, and emit, only when `process.env.NODE_ENV !== 'production'`, exactly one `console.warn` per `currentSrc` with exactly this text: `` `[aura-glass] Cannot sample ${src}: add crossOrigin="anonymous" and CORS headers, or pass tone="light|dark" to Backdrop.` `` Track sources in a module-level `Set`.
8. **MED-030.** `classifyTone.ts` contains no `"use client"` and no hooks. It exports:
   - the constants `TONE_LIGHT_MEAN = 0.60`, `TONE_LIGHT_P10 = 0.35`, `TONE_DARK_MEAN = 0.30`, `TONE_DARK_P90 = 0.55`
   - `classifyTone(stats: ToneStats | null): 'light' | 'dark' | undefined`, using the REQ-MED-61 rules. `null` returns `undefined`.

   These are exported from the module only, never from `aura-glass/media`.
9. **MED-031 (remote, alpha).** `scripts/audit/calibrate-media-tone.mjs` runs in remote Chromium. It loads each of the 8 scene thumbnails from `certification/scenes/` into a page that runs the built `sampleOwnedPixels` and writes the per-scene stats plus the chosen thresholds as CI artifact `media-tone-calibration.json` under the evidence dir resolved by `scripts/ci/lib/evidence-dir.js` (SC-07, D-32).
   - Commit only the per-scene stats as `src/media/sampling/__fixtures__/scene-stats.json`, shaped `{ "<sceneId>": { mean, p10, p90, stdev, sha256 } }`, where `sha256` is the hash of the scene file.
   - If calibration shows the PRD constants misclassify a scene that the PRD expectation list pins, stop and report. Do not tune the constants. Later changes are C-I visual-fix PRs only.
10. **MED-032.** `classifyTone.test.ts`:
    - Boundary table on synthetic stats, covering exactly-at, just-below and just-above each of the four constants.
    - 8-scene table from `scene-stats.json`: photo→`light`, dark-media→`dark`, flat-white→`light`, flat-black→`dark`, hf-pattern→`undefined`, saturated-abstract→`undefined`, dense-text→`undefined`, video-frame→the recorded value.
11. **MED-029.** `sampleOwnedPixels.test.ts` feeds synthetic RGBA buffers to `computeLumaStats` and checks them within ±0.001:
    - white → mean 1.000
    - black → mean 0.000
    - 50/50 split → p10 0, p90 1
    - mid-grey `#777777` → equal to `relativeLuminance('#777777')`
12. **MED-033.** `toneCache.ts` provides an LRU `Map` capped at 64 entries keyed by `` `${currentSrc}|${x},${y},${w},${h}` ``. It exports `getOrSampleTone(el, region, onResult)`, which:
    - returns a cached `ToneResult` synchronously when one exists
    - otherwise schedules exactly one sample per key via `requestIdleCallback(cb, { timeout: 500 })`, falling back to `setTimeout(cb, 0)`
    - de-dupes in-flight keys

    The `ToneResult` is `{ tone, luma }`, where `luma` is the mean rounded to 3 decimals. There are no listeners on scroll, resize, mutation, `timeupdate` or `seeked`.
13. **MED-034.** `toneCache.test.ts` checks:
    - 100 `getOrSampleTone` calls with the same key → `getImageData` is called once (spy the 2D context returned by a stubbed `HTMLCanvasElement.prototype.getContext`, with no new dependency)
    - eviction of the first key at insertion 65
    - the idle fallback path when `requestIdleCallback` is undefined
14. **MED-036.** `sampleErrors.test.ts` checks:
    - a `SecurityError` thrown by `getImageData` → `null`, plus one warn with the exact text
    - a second call for the same `src` → no additional warn
    - zero-size → `null`
    - `NODE_ENV=production` → 0 warns
15. **MED-025.** `scripts/ci/verify-media-purity.mjs` uses a TypeScript-compiler-API walk over `src/media/**/*.{ts,tsx}` and `src/backdrops/**/*.{ts,tsx}`, plus a text scan of `*.css`. Exit code 1 lists `file:line rule`. The banned patterns:
    - `fetch(`, `XMLHttpRequest`, `AudioContext`, `webkitAudioContext`, `MediaRecorder`, `Math.random`
    - assignment to `.src` on any identifier typed or named as a media element
    - `.load()` calls
    - `addEventListener('keydown'|"keydown"` on `window` or `document`
    - `elementsFromPoint`, `elementFromPoint`, `html2canvas`, `foreignObject` and `getComputedStyle(` in `src/media/sampling/**` and `src/backdrops/**`
    - `backdropFilter`/`backdrop-filter`, `!important`, `filter:` in `src/backdrops/presets/*.css`
    - colour literals (`#hex`, `rgb(`, `hsl(`, `oklch(` outside a `var(--ag-*, …)` fallback)
    - duration literals (`\d+m?s` outside `var()` fallbacks)
    - JSX `style={{…}}` keys other than `--ag-start`, `--ag-end`, `--ag-chapter-start`, `--ag-media-progress`
    - imports from `.storybook/`, `certification/`, `showcase/`

    The file allowlist is empty.
16. **MED-026.** `tests/ci/verify-media-purity.test.ts` spawns the script against `tests/ci/fixtures/media-purity/<rule>/` with one violating fixture per rule, each asserted to fail with its rule id, plus one clean fixture asserted to pass. It also runs the script against the real tree: it passes even with an empty `src/media`.
17. **MED-027.** Add the `package.json` script and the step in the `Glass Quality Gates` job of `glass-pipeline.yml`.
18. **MED-037 (DoD item 5, PRD §21).** File the 7 still-open owner items as GitHub issues with the existing `gh` on the repo's origin. Each issue quotes the PRD text and its rejection fallback:
    - OI-MED-01 EXP: X-42 `Waveform` → 5.1 (SC-12)
    - OI-MED-02 MAT: glyph-flip selector consuming `data-ag-media-tone` (attribute already ratified, SC-21)
    - OI-MED-03 OVL: `media` scrim variant with blur 0 on `.ag-scrim` (OVL-023)
    - OI-MED-04 MOT: REQ-MOT-T08 admitting `ag-backdrop-drift`, and `src/motion/ticker.ts` importable from `src/media/**`
    - OI-MED-05 DX: `@auraglass/cli sample-media`
    - OI-MED-06 A11Y: `auraglass/no-runtime-contrast` (A11Y-012) allowance for `src/media/sampling/**`
    - OI-MED-07 QA: a CREATE task for `scripts/ci/verify-flagship-deliverables.mjs`

    Do not file the items the registry already settled: `--ag-scrim-media`/`--ag-duration-ambient` (SC-19), `data-ag-offscreen` owned by the MOT ticker (SC-21), CarouselRail autoplay (SC-38).

    Record the issue URLs. Never modify the owners' code.

## 5. Tests to run
**Local (light):**
- `./node_modules/.bin/jest src/media tests/ci/verify-media-purity.test.ts`
- `node scripts/ci/verify-media-purity.mjs`
- `./node_modules/.bin/tsc --noEmit -p tsconfig.json`
- `./node_modules/.bin/eslint src/media scripts/ci/verify-media-purity.mjs`

**Remote:** MED-031 calibration (Chromium), and PKG's directive lint (`auraglass/use-client-required`, PKG-023) plus manifest checks in CI (QA lanes L1 Static / L2 Artifact).

## 6. Visual evidence
None. This prompt has no UI. The calibration artifact `media-tone-calibration.json` is the evidence for MED-031.

## 7. Integrity rules (binding)
- No local Docker or local browser. Calibration runs remotely.
- Never invent scene stats.
- Never tune thresholds to make a test pass.
- Never add `canvas`/`jest-canvas-mock`.
- No `.skip`/`.only`/`.todo`.
- No `-u`.
- No allowlist entries in the purity gate.
- No DOM-behind sampling API of any kind.
- Do not commit evidence (calibration JSON is an artifact; only the stats fixture is committed).

## 8. Exit criteria
- REQ-MED-03/04 (these modules): server modules have no directive and no hooks, `media.css` is layered and literal-free (MED-020..024).
- AC-MED-11: the purity gate is wired, fixture-tested and green on the tree (MED-025..027).
- AC-MED-05 (unit half): `classifyTone` passes for all 8 scene fixtures; the `sampleErrors` message is exact (MED-030..036).
- REQ-MED-60/63/65 unit tests green (MED-028/029/033/034/036).
- 7 open-item issues filed (MED-037).

## 9. Final report format
```
PROMPT-14b REPORT
Branch/SHA:
Tasks: MED-020..037 -> done|blocked (reason) each
Manifest rows applied | handed to PKG:
color.ts helper: existing | extracted (diff summary)
Calibration: artifact URL; per-scene tone table; thresholds unchanged (yes/no + evidence)
Purity gate rules: N; fixtures: N fail + 1 pass
Open items: OI-MED-01..07 -> issue URL
Tests: name -> pass/fail (local|remote URL)
Deviations (with evidence) or none
Files changed:
```
