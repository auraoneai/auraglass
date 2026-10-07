# PROMPT-03c (DS): `glass-material`, `motion-spring`, `contrast-solve` transforms and the contrast matrix

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (PRD-03, §4.2 step 3, §5.3, §5.5, §5.9). Requirements: REQ-DS-14 (transform + blur lint), REQ-DS-15, REQ-DS-17, REQ-DS-37, plus the OKLCH extension of `src/theme/color.ts` that REQ-DS-27 and §4.2 need. Acceptance: AC-DS-04, plus the architecture §16 PRD-03 exit criterion ("`tokens.css` + TS generated and the contrast matrix runs in CI"). Tasks: `docs/auraglass-5/tasks/DS.json` DS-048..DS-062. Contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding: SC-18 generated outputs, SC-28 "composites" terminology, SC-29 L4 Token contrast, OV-12/OV-31). Contracts consumed: accessibility PRD REQ-A11Y-15..18 and its matrix contract `tests/a11y/contrast/matrix-contract.json` (A11Y-002) (`prd/AURAGLASS_ACCESSIBILITY_PRD.md`), motion PRD §4.2/§4.3 and REQ-MOT-03/-04 (`prd/AURAGLASS_MOTION_PRD.md`), material PRD REQ-MAT-33 floor key (`prd/AURAGLASS_MATERIAL_ENGINE_PRD.md`).

## 0. Common rules (binding)

- Remote-first. Node-only Jest and `npm run build:tokens` may run locally. Run full `npm run build`, browsers and perf remotely: in GitHub Actions on `auraoneai/auraglass` (choose per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 worker via the `auraone-remote-run` skill. Never use local Docker or a local Playwright browser.
- Don't fake completion. Floors are solved, never typed by hand. Don't loosen a threshold (4.5 / 3 / 7:1, 0.005 step, 0.001 settle, ≤ 40 stops, ≤ 0.005 error) to make a cell pass; if a cell is unsolvable, change the source token (canvas L/C or `on-*` colour) and record why. No `test.skip`, no snapshot updates, no hand-edits under `tokens/generated/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`.
- Write only the files listed in §2.

## 1. Prerequisites (verify; on failure stop and report)

1. 03b merged: `npm run build:tokens` succeeds on `main`, and `tests/tokens/{schema,compiler-guards,determinism,modes-matrix,emitted-css}.test.ts` pass.
2. `tokens/contrast/busy-reference.json` holds exactly the 9 samples in REQ-A11Y-15 (`node -e` check).
3. `rg -n "REQ-A11Y-16" docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md` finds the thresholds. `rg -n "REQ-MOT-04" docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` finds the spring contract. If either text conflicts with this prompt, the owning PRD's text wins; report the delta.
4. MAT has declared that `src/material/css/material.css` (MAT-015, owner prompt `PROMPT_04_MAT`) imports `generated/{ladders,floors,properties}.css`: check with `rg -n "generated/ladders.css" docs/auraglass-5/prd/AURAGLASS_MATERIAL_ENGINE_PRD.md`. This prompt writes only the generated files. They sit in MAT's tree, but only this compiler emits them (OV-31).
5. A11Y matrix contract (A11Y-002, owner prompt `PROMPT_05_A11Y`): `tests/a11y/contrast/matrix-contract.json` exists. If it doesn't, DS-057 is blocked on A11Y-002.
6. QA L4 Token contrast lane (QA-081, owner prompt `PROMPT_18_QA`): `rg -n "L4" certification/lanes.config.ts`. If the lane is missing, DS-061/062 stay on the interim `Glass Quality Gates` step (DS-047) and are reported as blocked on QA-081.

## 2. File scope

May touch: NEW `scripts/tokens/transforms/{glass-material,motion-spring,contrast-solve}.mjs`, `scripts/tokens/lib/{oklch,wcag,rdp}.mjs` (thin wrappers that import `src/theme/color.ts` through the build's existing `ts-node`/esbuild path, so the maths isn't duplicated), MODIFY `scripts/tokens/build.mjs` (register transforms), generated `src/material/css/generated/{ladders,floors}.css`, `src/tokens/generated/material-spec.ts`, `src/motion/tokens.generated.ts`, `tokens/generated/opacity-floors.json`, MODIFY `src/theme/color.ts`, MODIFY `src/theme/contrast.ts` (fold into `color.ts`; leave a 1-line re-export until 03f DS-109 deletes it; A11Y-004 verifies), NEW `src/theme/__tests__/color.test.ts` (DS-056 creates it; A11Y-006 later adds vectors by MODIFY), NEW `tests/tokens/{material-transform,motion-spring,contrast-matrix}.test.ts`, `tests/tokens/fixtures/{springs,contrast}/**`, MODIFY `tests/tokens/emitted-css.test.ts` (add the generated material files), MODIFY `certification/lanes.config.ts` (register DS providers in L4 only, after QA-081); MODIFY `.github/workflows/glass-pipeline.yml` (only the interim DS `tokens` step from DS-047).

Must not touch: `.github/workflows/design-system-compliance.yml` (QA-118 deletes it, SC-39), `src/material/css/material.css` and any other `src/material/**` that isn't generated (PRD-04), `src/motion/css/**` (PRD-06), `tests/a11y/contrast-matrix.test.ts` (PRD-05's independent recompute), `src/utils/contrastGuard.ts` (PRD-05/16), components, `tokens/**/*.tokens.json` values (except a documented source fix for an unsolvable cell).

## 3. Steps

### DS-048..DS-051 `glass-material` (REQ-DS-14, REQ-DS-10)
1. `transforms/glass-material.mjs` reads the single `glass-material` token and flattens it to `--_ag-blur`, `--_ag-saturation`, `--_ag-grain`, `--_ag-scrim` and related values per `[data-ag-variant=<v>][data-ag-thickness=<t>]`. Variants are `regular|clear|identity`; `identity` emits no backdrop filter. It also emits literal `-webkit-backdrop-filter: blur(<n>px) saturate(1.6)` per `[variant][thickness][tier]` (≈ 18 rules, architecture §4.3; Safari can't use `var()` there). The runtime fill is `oklch(from var(--ag-color-canvas) l c h / var(--_ag-alpha))`. Any blur token above 32 px exits 1, with the message `blur > 32px at <path>`. The output is `src/material/css/generated/ladders.css`, with everything inside `@layer ag.material` and the standard order statement first.
2. The TS output `src/tokens/generated/material-spec.ts` exports a `materialSpec` const that is tree-shakable: `export const` with no side effects, and it's the only generated TS file that carries raw values.
3. `tests/tokens/material-transform.test.ts`: exactly 3 variants × 3 thicknesses; every blur ≤ 32 px; the `-webkit-backdrop-filter` literal count equals `variants_with_blur × thicknesses × tiers` (log the number; expect 18); `materialSpec` has no `intent`/`elevation` keys; a fixture with blur 40 px exits 1.

### DS-052..DS-054 `motion-spring` (REQ-DS-17, owns REQ-MOT-04)
4. `transforms/motion-spring.mjs` takes `{dampingRatio ζ, response r ms}` and computes ω₀ = 2π/r. It samples the critically or over/underdamped unit step response at 1 ms until |1−x| < 0.001 and |x'| < 0.001·ω₀ hold for 50 ms. It then applies Ramer–Douglas–Peucker with tolerance 0.002, caps the result at 40 stops, rounds values to 4 decimals, and forces the last stop to exactly `1`. It emits `--ag-spring-<name>: linear(...)` and `--ag-spring-<name>-duration` (settle time rounded up to 10 ms) in `tokens.css`, plus `@supports not (transition-timing-function: linear(0, 1)) { … var(--ag-ease-emphasized-decelerate) }`. It rejects ζ < 0.8, ζ > 1.0 and r outside 120–800 ms (exit 1, naming the token).
5. The duration exits `-exit` = round10(0.7 × entry) → 60/80/140/220/320 ms. A cubic-bezier with any y control point outside [0,1] exits 1, so there is no Penner back/elastic.
6. DS-053: write `src/motion/tokens.generated.ts` (the `motionTokens` shape from MOT §4.3). DS is its only writer (SC-18, OV-12; MOT-024 is dropped, and MOT consumes the file). It also includes `--ag-duration-ambient` when MOT has added that row.
7. `tests/tokens/motion-spring.test.ts`: snappy (1.0/200), smooth (0.9/350) and fluid (0.82/450) each have ≤ 40 stops, last stop `1`, and max |x(t) − linear(t)| ≤ 0.005 over 1,000 samples (compare against the analytic solution); fixtures `zeta-0.7`, `zeta-1.1` and `response-100` are rejected; exit durations are exact; token values are byte-identical with `data-ag-motion` = full/calm/none (motion modes are PRD-06 CSS, not tokens); a fixture `cubic-bezier(0.3,1.4,0.6,1)` is rejected.

### DS-055..DS-056 OKLCH in `src/theme/color.ts`
8. `src/theme/color.ts` is 79 lines at HEAD and exports `normalizeHexColor`, `hexToRgb`, `rgbToHex`, `mixHex`, `relativeLuminance`, `contrastRatio`, `bestTextColor`. Keep every existing export and its behaviour. Add:
   - `parseColor(input: string): Oklch` (hex, `rgb()`, `hsl()`, `oklch()`);
   - `oklchToSrgb(c: Oklch): GlassRgb` with CSS Color 4 gamut mapping (chroma reduction in OKLCH until in-gamut, ΔEOK < 0.02);
   - `srgbToOklch`;
   - `compositeOver(fg: Oklch & {alpha}, bg: GlassRgb): GlassRgb` (sRGB source-over);
   - `wcagContrast(a, b)` (WCAG 2.2 relative luminance; reuse `relativeLuminance`);
   - `apcaLc(text, bg)` (advisory);
   - `deltaE2000(a, b)`.
   No new dependency. Use the exact names A11Y-003 verifies (DS owns these edits; A11Y consumes them). Move the 1-line `src/theme/contrast.ts` re-export so it targets the same names; 03f deletes it (DS-109).
9. `src/theme/__tests__/color.test.ts`: round-trip vectors from CSS Color 4 (`oklch(0.628 0.2577 29.23)` ≈ `#ff0000`, `oklch(1 0 0)` = `#ffffff`, `oklch(0 0 0)` = `#000000`) within 1/255 per channel; an out-of-gamut input maps into gamut; `wcagContrast('#000','#fff')` = 21; a hex/rgb/hsl/oklch spelling of the same colour parses to ΔE2000 ≤ 0.5; the existing exports' behaviour is unchanged (golden values taken from HEAD before the edit).

### DS-057..DS-060 `contrast-solve` (REQ-DS-15, REQ-DS-37, REQ-A11Y-15..17)
10. `transforms/contrast-solve.mjs` iterates the full matrix: preset {aura, graphite, daylight, midnight} × scheme {light, dark} × contrast {standard, more} × transparency {glass, tinted, solid} × variant {regular, clear+scrim, identity, content-raised, content-sunken} × thickness {thin, regular, thick} × backdrop {light, dark, media}. That's 2,160 cells.
   For each cell it searches alpha from 0 to 1 in 0.005 steps (integer loop `i/200`, never float accumulation) and returns the minimum alpha at which every REQ-A11Y-16 pair passes over all three **composites** (SC-28 term: `#ffffff`, `#000000`, and the minimum over the 9 busy samples). "Backdrop" means only the declared `data-ag-backdrop` axis:
   - `on-surface` ≥ 4.5;
   - `on-surface-muted` ≥ 4.5 (≥ 3 if `ag.usage: "large-only"`);
   - `border`, `focus-inner`, `focus-outer` and control boundary ≥ 3;
   - disabled pair ≥ 3;
   - all text pairs ≥ 7 when `contrast=more`.
   `clear+scrim` adds `scrim.clear` 0.35 over light/media backdrops. Blur contributes nothing. If no alpha ≤ 1 passes, exit 1 with `unsolvable cell <key> pair <pair> best <ratio>`.
11. Outputs:
   - `tokens/generated/opacity-floors.json`, keyed `[preset][scheme][contrast][transparency][variant][thickness][backdrop]` → `{floorAlpha, minRatio, pair, apcaLc}`, keys sorted, prettier-formatted;
   - `dist/contrast-matrix.json` (same per-cell data plus `cellCount`, `generatedFrom` sha256 of the inputs), consumed by A11Y (`tests/a11y/contrast-matrix.test.ts`) and QA L4;
   - `src/material/css/generated/floors.css` in `@layer ag.material` with `--_ag-tint-floor` per `[data-ag-transparency][data-ag-thickness][data-ag-backdrop]` plus the `contrast=more` row (REQ-MAT-33 key). Each emitted value is the maximum solved floor across presets, schemes and variants for that key.
12. `tests/tokens/contrast-matrix.test.ts`:
   - re-solves every cell in-process and asserts deep equality with the committed `opacity-floors.json`;
   - asserts `cellCount === 2160`, logged;
   - asserts every cell meets its threshold (4.5 / 3 / 7:1) over the 3 composites;
   - asserts every emitted `--_ag-tint-floor` equals the max over presets/schemes/variants for its key;
   - fixture `fixtures/contrast/hand-edited/` (one floor lowered by 0.005) fails;
   - fixture `fixtures/contrast/unsolvable/` (canvas L 0.6 with on-surface L 0.62) makes the build exit 1 and names the cell and pair;
   - the solve completes in ≤ 10 s (measured, logged).

### DS-061..DS-062 CI and timing
13. DS-061: register DS providers in QA's L4 Token contrast lane in `certification/lanes.config.ts` (MODIFY after QA-081; SC-29): `npm run build:tokens`, `git diff --exit-code` on the generated files, then `npx jest tests/tokens/contrast-matrix.test.ts tests/tokens/material-transform.test.ts tests/tokens/motion-spring.test.ts src/theme/__tests__/color.test.ts`, and upload `dist/contrast-matrix.json` as an artifact. L4 runs on every PR and main push with no path filter (REQ-QA-29), next to A11Y's `tests/a11y/contrast-matrix.test.ts`. Until QA-081 exists, add the same commands to the interim DS step in `glass-pipeline.yml` (DS-047).
14. DS-062: the L4 provider timing guard fails if the full `build:tokens` takes over 20 s or the contrast solve over 10 s on the CI runner (§16). Print both numbers.

## 4. Tests to run
Local: `npm run build:tokens && npx jest tests/tokens src/theme/__tests__/color.test.ts`. Remote: QA L4 Token contrast (or the interim `Glass Quality Gates` step). A11Y's independent recompute (`tests/a11y/contrast-matrix.test.ts`) also runs in L4; report its status, don't implement it.

## 5. Visual evidence
There's nothing to capture in a browser here. The CI artifact `dist/contrast-matrix.json` is published. Also attach a text summary per transparency × backdrop key: min/max `floorAlpha`, worst `minRatio` and its pair. 03e's `ContrastFloors.stories.tsx` renders this file for human review.

## 6. Exit criteria
- AC-DS-04: 100 % of 2,160 cells pass every REQ-A11Y-16 pair over 3 composites; `opacity-floors.json` re-solve diff = 0; the hand-edit fixture fails.
- PRD-03 architecture exit criterion: the contrast matrix runs in CI, fails closed, and publishes its artifact.
- `material-transform`, `motion-spring` and `color` tests green, 0 skipped; build ≤ 20 s and solve ≤ 10 s.

## 7. Final report format
```
PROMPT-03c report
PRs: <urls>   Branch: main
Prereqs: 1..6 <ok|blocked:...> (A11Y-002, QA-081 named)
Tasks: DS-048 <done|blocked> ... DS-062
Material: rules <n>, -webkit literals <n> (expected 18), max blur <px>
Springs: snappy <stops>/<ms>, smooth <stops>/<ms>, fluid <stops>/<ms>, max error <v>
Contrast: cells 2160, failing 0, worst minRatio <v> at <cell>/<pair>, solve <s> s, build <s> s
Source changes made to solve cells (if any): <token path: old -> new, reason>
Tests: <cmd> -> <pass>/<total>, 0 skipped; CI run <url>; artifact <url>
AC: AC-DS-04 <pass|fail>
Deviations: <list with evidence>
```
