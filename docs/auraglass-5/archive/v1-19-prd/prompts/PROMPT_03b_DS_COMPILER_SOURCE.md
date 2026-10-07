# PROMPT-03b (DS): DTCG source tree, Style Dictionary 4 compiler, `tokens.css` emitter

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (PRD-03, §4.1–4.5, §5.1–5.7, §14, §15). Requirements: REQ-DS-01, -02, -03, -04, -05 (source rule), -06, -08, -09, -10 (source), -11, -12, -13, -14 (source), -16, -18, -19, -20, -21, -22, -24 (core half), -34, -35. Acceptance: AC-DS-03 and AC-DS-06. Tasks: `docs/auraglass-5/tasks/DS.json` DS-013..DS-047 and DS-120. Contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding (SC-12, SC-14, SC-16, SC-18, SC-19, SC-20, SC-21). DS is the **only** creator of files under `tokens/` (SC-18). MOT, NAV, MED and A11Y supply values as row requests, and DS lands them. Architecture: §4.3 (`MaterialSpec`), §4.4 (`--ag-*`/`--_ag-*`, `@property`), §4.5 (attribute contract), §5 (taxonomy), §7.1 (rungs), §10 (layers), D-06, D-07, D-11, D-24, D-31.

## 0. Common rules (binding)

- Remote-first. Node-only Jest and `npm run build:tokens` may run locally. Run Storybook builds, any browser work and full `npm run build` remotely: in GitHub Actions on `auraoneai/auraglass` (decide per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 worker via the `auraone-remote-run` skill. Never use local Docker or a local Playwright browser.
- Don't fake completion: no placeholder token values (every value comes from the PRD §4.3 table or architecture §5.3, or is derived as specified), no `test.skip`/`.only`, no lowered thresholds, no snapshot updates to get to green, no hand-edits to anything under `tokens/generated/**`, `src/tokens/generated/**` or `dist/**`.
- From the first commit, emitters write 0 `!important` and 0 `prefers-contrast: high` (D-24, REQ-DS-22/-34).
- Pin dependencies exactly (no `^`/`~`). They go in devDependencies only.

## 1. Prerequisites (verify; on failure stop and report)

1. 03a merged on `main`: `tokens/legacy/4x-rendered.tokens.json` exists and `npx jest tests/tokens/legacy-freeze.test.ts` passes.
2. PKG anchors (owner prompt `PROMPT_02_PKG`): `build/exports.manifest.json` (PKG-005) places CSS in `dist/css/` (`rg -n "dist/css/tokens.css" docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` hits). `docs/dependency-allowlist.json` + `scripts/ci/verify-deps.mjs` (PKG-056) exist. `.github/workflows/glass-pipeline.yml` has the `Glass Quality Gates` job (PKG-038). Compiler tools are devDependencies, so they are not runtime allowlist rows. Do not create or edit the allowlist; `verify-deps.mjs` must simply pass. If PKG-056 is missing, verify REQ-DS-04 with DS-013's own test and report the gap. If PKG-038 is missing, DS-047 is blocked.
3. MOT §4.2 motion values (owner prompt `PROMPT_06_MOT`): `rg -n "instant 90|90/120/200/320/450" docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` matches. If the values differ from REQ-DS-17, MOT wins: report the delta and use MOT's values. The file is still `tokens/sys/motion.tokens.json`. Never create `tokens/motion.tokens.json` (SC-18). MOT edits values later by MODIFY (MOT-020) after DS-026.
3a. NAV app-shell values (row request NAV-009, owner prompt `PROMPT_11_NAV`) for DS-120. MED's `sys.scrim.media` value `oklch(0% 0 0 / 0.72)` (SC-19 accepted addition).
4. `tokens/generated/`, `src/tokens/generated/`, `src/material/`, `src/motion/` don't exist at HEAD 15b6de6f7 (verified). Create them.

## 2. File scope

May touch (NEW unless marked): `tokens/$schema.json`; `tokens/ref/{color,dimension,time}.tokens.json`; `tokens/sys/{color,type,space,breakpoint,shape,motion,interaction,environment,elevation,app-shell}.tokens.json`; `tokens/material/material.tokens.json`; `tokens/modes/{scheme,contrast,transparency,density}.tokens.json`; `tokens/presets/{aura,graphite,daylight,midnight}.tokens.json`; `tokens/contrast/busy-reference.json`; `tokens/comp/README.md`; `scripts/tokens/build.mjs`; `scripts/tokens/lib/*.mjs`; `scripts/tokens/formats/{css-layered,property-registry,ts-constants,manifest}.mjs`; generated `src/tokens/generated/{tokens.ts,tokens.d.ts}`, `src/material/css/generated/properties.css`, `src/motion/tokens.generated.ts`; MODIFY `src/tokens/index.ts` (additive exports only); MODIFY `package.json` (`scripts.build:tokens`, devDependencies); MODIFY `.github/workflows/glass-pipeline.yml` (add one interim step to PKG's `Glass Quality Gates` job; job name unchanged, SC-10); `tests/tokens/{schema,compiler-guards,determinism,oklch,scales,interaction-states,environment-elevation,modes-matrix,emitted-css}.test.ts`; `tests/tokens/fixtures/**`.

Must not touch: `scripts/build-tokens.js` (it stays for the 4.x platform until 03f), `tokens/personas/**`, `tokens/index.json`, `tokens/schema.json`, `src/styles/**`, `src/theme/**` (03e), components, `registry/**`, `src/material/css/material.css` (MAT-015), `.github/workflows/design-system-compliance.yml` (QA-118 deletes it, SC-39), `build/exports.manifest.json` (PKG-005), `docs/dependency-allowlist.json` (PKG-056).

## 3. Steps

### DS-013 Dependencies (REQ-DS-04)
Add these exact versions to `devDependencies`: `style-dictionary` (latest 4.x at execution time, e.g. `4.4.0`), `ajv` (8.x exact), and `postcss` (8.x exact, already transitive). Then `npm install` (light; local OK). Verify with `node -e` that none of them is in `dependencies`. Add `tests/tokens/emitted-css.test.ts` case "no compiler dependency imported from dist": grep `dist/**/*.{js,mjs,cjs}` for `style-dictionary|ajv`, expect 0 matches.

### DS-014..DS-015 Schema (REQ-DS-01)
Write `tokens/$schema.json` (JSON Schema 2020-12). It covers the DTCG 2025.10 `$value/$type/$description/$extensions`; the standard types `color`, `dimension`, `duration`, `cubicBezier`, `number`, `fontFamily`, `fontWeight`, `shadow`, `typography`; the composites `glass-material` (fields from architecture §4.3 `MaterialSpec`) and `motion-spring` (`dampingRatio`, `response`); and `$extensions` keys `ag.public` (boolean), `ag.tier` (`ref|sys|material|comp|legacy`), `ag.since` (semver), `ag.deprecated` (`{since, replacement}`), `ag.usage` (`"large-only"`). `ag.tier` is required on every token. Test `tests/tokens/schema.test.ts`: every `tokens/**/*.tokens.json` validates; fixture `tests/tokens/fixtures/unknown-type.tokens.json` fails; a token missing `ag.tier` fails.

### DS-016..DS-018 Compiler entry, guards, determinism (REQ-DS-02, -03)
`scripts/tokens/build.mjs` runs the pipeline in §4.2 of the PRD: validate with ajv, resolve aliases, expand modes, run transforms (stubs aren't allowed; until 03c lands, the `glass-material`/`motion-spring`/`contrast-solve` steps aren't registered at all), format, and prettier-format the output (port `scripts/build-tokens.js:25-35`). It takes `--fixtures <dir>` and `--out <dir>` for tests. It exits 1 with a message naming the token path for: schema violation, unresolved alias, alias cycle, a `material.*` alias to anything but `sys.*`, a preset defining any `material.*` key, and any output var starting `--_ag-` from a preset or theme input. Repoint `package.json` `build:tokens` to `node scripts/tokens/build.mjs`, and keep the 4.x builder reachable as `build:tokens:legacy` (`node scripts/build-tokens.js`) until 03f. Tests:
- `tests/tokens/compiler-guards.test.ts` has one fixture directory per failure under `tests/tokens/fixtures/guards/{unresolved-alias,cycle,material-to-ref,preset-material,preset-private-var,schema}`. Each asserts exit code 1 and the named path in stderr.
- `tests/tokens/determinism.test.ts` builds twice into two temp dirs and asserts equal SHA-256 for every file under `dist/tokens/**`, `tokens/generated/**`, `src/tokens/generated/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`.

### DS-019..DS-034 Author the source (REQ-DS-08..20, -25 source)
- `ref/color.tokens.json`: OKLCH `{colorSpace:"oklch",components:[L,C,H],alpha}`. `slate.1..12` light ramp L 0.99→0.18 with ΔL ≥ 0.03, plus accent, danger, warning and success 12-step ramps.
- `sys/color.tokens.json`: `canvas`, `on-surface`, `on-surface-muted`, `accent`, `on-accent`, `border`, `focus-inner`, `focus-outer`, `specular`, `danger`, `warning`, `success`. Each is a `{light, dark}` pair. Dark `on-surface` has L ≥ 0.92 and C ≤ 0.02 (D-28). Each role also gets an `$extensions.ag.forcedColor` mapping to `Canvas|CanvasText|LinkText|Highlight|HighlightText|GrayText|ButtonFace|ButtonText` (§15).
- `sys/type.tokens.json`: roles `display,title-1,title-2,title-3,body,callout,caption,label,mono` × `size,line-height(unitless),weight,tracking`. `body` = `clamp(15px, 0.9rem + 0.2vw, 17px)`. Display/title roles use `clamp()` (min at 320 px, max at 1440 px). Caption min 12 px. `type.on-glass-weight-delta: 50`. Family is the system stack; there is no Aeonik reference (D-31).
- `sys/space.tokens.json`: `space.0..12` = 0,2,4,6,8,12,16,20,24,32,40,48,64 px. `target.min` is 24 px and `target.coarse` is 44 px; neither is scaled by density.
- `sys/breakpoint.tokens.json`: sm 640, md 768, lg 1024, xl 1280. These are for the Tailwind bridge only.
- `sys/shape.tokens.json`: `radius.xs..full` = 6,10,14,20,28,9999 px; `radius.inner` = `max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))`.
- `sys/motion.tokens.json` (DS-026, the only motion source and the anchor for MOT-020): REQ-DS-17 values (durations, exits, eases). Springs are `$type: motion-spring` (03c compiles them). Reserve `sys.duration.ambient` → `--ag-duration-ambient` (SC-19) with MOT's value (40 s requested by MED), and give it no `-exit` variant.
- `sys/interaction.tokens.json`: the 8 states in REQ-DS-19 with the values in its table. Each has `contrast=more` (rim/outline, specular 0) and `transparency=solid` (system colours) values (REQ-DS-20).
- `sys/environment.tokens.json`: `light.angle` 300deg, `light.specular` 0.5, `glass-opacity` 0, `backdrop.{light,dark,media}` tint mapping, `scrim.clear` 0.35, `scrim.media` `oklch(0% 0 0 / 0.72)` → `--ag-scrim-media` (SC-19).
- `sys/app-shell.tokens.json` (DS-120): NAV's values from NAV-009 (`--ag-app-shell-sidebar-width` 16rem, `-rail-width` 4rem, `-inspector-width` 20rem, `-topbar-height` 3.25rem (compact 2.75rem), `-tabbar-height` 3.5rem, `-gap` aliasing `--ag-space-*`), all `ag.public: true`. The `-bp-*` values are documentation only.
- `sys/elevation.tokens.json`: `shadow.{chrome,overlay,transient,content}.{thin,regular,thick}` × scheme (ambient + key) emitted as `--_ag-shadow-*`; `layer.z.{content 0, chrome 100, overlay 1000, transient 1100, toast 1200}` → `--ag-z-*`. There is no `elevation` key.
- `material/material.tokens.json`: one `glass-material` token. Variants `regular|clear|identity` × thickness `thin|regular|thick`; blur 12/20/32 px; saturation 1.6; grain 0.02–0.04; `scrim.clearOverBright` 0.35; `fallbackFill` alpha ≥ 0.85; `tint.{light,dark,media}` aliases `sys.color.canvas` (REQ-DS-10). There is no `intent`/`elevation` key.
- `modes/*.tokens.json`: overrides per axis value (scheme, contrast, transparency, density with `--_ag-density` 0.875/1/1.125).
- `presets/*.tokens.json`: `aura`, `graphite`, `daylight`, `midnight`. Each sets canvas light/dark, `neutralHue`, accent and optional `radiusScale`. Nothing else is allowed (the guard enforces this).
- `contrast/busy-reference.json` (DS-033; A11Y-001 is a consumer test): exactly `#777777 #ff3b30 #34c759 #0a84ff #ffcc00 #af52de #ff9500 #5ac8fa #8e8e93` (REQ-A11Y-15).
- `comp/README.md`: comp tokens are added only by flagship PRDs through this compiler.

### DS-035..DS-039 Emitters (REQ-DS-06, -09, -21, -22, -24, -34, -35)
- `formats/css-layered.mjs` → `dist/css/tokens.css`. The file starts with the order statement `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;`. All content sits in `@layer ag.tokens`: `:root{…}`; for each axis an attribute block `[data-ag-<axis>=<v>]` plus the media mirror `@media (<query>){ :root:not([data-ag-<axis>]){…} }`; `color-scheme` set per scheme; `sys.color` leaves as `light-dark()`; the hex fallback only inside `@supports not (color: oklch(0 0 0))`; the scheme-block fallback inside `@supports not (color: light-dark(#000, #fff))`; and `[data-ag-theme=<preset>]` blocks. OS floors (`prefers-contrast: more`, `prefers-reduced-transparency: reduce`, `forced-colors: active`) are emitted again in `@layer ag.a11y`. `contrast=more` selects at least the `tinted` row. Nothing matches `data-theme`, `data-aura-*`, `data-persona`, `data-bg`, `.glass-on-*`, `.dark` or `.light`.
- `formats/property-registry.mjs` → `src/material/css/generated/properties.css`: `@property --ag-light-angle {syntax:'<angle>';inherits:true;initial-value:300deg}`, `--ag-specular` (`<number>`, false, 0.5), `--ag-glass-opacity` (`<number>`, true, 0) and the private registrations from architecture §4.4. That's ≤ 16 total.
- `formats/ts-constants.mjs` → `src/tokens/generated/tokens.ts` (`tokens` typed map of `var(--ag-…)` strings, `token(path: TokenPath)`, `TokenPath` union; no raw values and no class strings), `tokens.d.ts`, and `src/motion/tokens.generated.ts` (`motionTokens`, shape per MOT §4.3; DS-053 in 03c owns its content; MOT-024 is dropped). No flat `tokens.json` (SC-12: there is no `./tokens.json` export row).
- `formats/manifest.mjs` → `dist/tokens/manifest.json`: every public var with `{tier, group, $type, modes[], since, public}`, and the `consumers` count filled in by 03d's gate.
- `src/tokens/index.ts`: add `export { tokens, token } from './generated/tokens'` and `export type { TokenPath }`. Don't remove the 4.x exports yet (03f).

### DS-040..DS-045 Tests (DS-046 is `sys/breakpoint.tokens.json` above)
- `tests/tokens/oklch.test.ts`: every ramp is monotone with ΔL ≥ 0.03; every `sys.color` leaf in `tokens.css` is `light-dark(`; hex only inside `@supports not`; dark `on-surface` L ≥ 0.92 and C ≤ 0.02.
- `tests/tokens/scales.test.ts` (added to cover REQ-DS-11..13 and §14; not in PRD §12, see deviations): 9 type roles × 4 props; caption ≥ 12 px; body clamp string exact; line-heights unitless; `--ag-space-n` = `calc(<px> * var(--_ag-density))`; target tokens unscaled; radius ladder exact; `--ag-radius-inner` formula exact; no `Aeonik` in `tokens.css`.
- `tests/tokens/interaction-states.test.ts`: all 8 states exist with standard, `contrast=more` and `transparency=solid` values; disabled is applied via `--_ag-surface-alpha` (no `opacity:` on the host in emitted CSS).
- `tests/tokens/environment-elevation.test.ts`: `@property` rules exact; z-scale exact; no `elevation` token; shadows exist for 4 layers × 3 thicknesses × 2 schemes.
- `tests/tokens/modes-matrix.test.ts`: parse with postcss and assert an attribute block plus a media mirror per axis value; OS floors re-emitted in `ag.a11y`; `contrast=more` → ≥ tinted; 0 `prefers-contrast: high`; postcss parse has 0 warnings.
- `tests/tokens/emitted-css.test.ts`: on `dist/css/tokens.css` and `src/material/css/generated/*.css`, 0 `!important`; every rule is in its expected `ag.*` layer; `:root` appears only in `ag.tokens`/`ag.compat`; only `@property` is unlayered; no legacy hook selector; no class strings in `src/tokens/generated/**`. 03c and 03e extend the file list.

### DS-047 CI (interim)
Add a `tokens` step to PKG's `Glass Quality Gates` job in `.github/workflows/glass-pipeline.yml` (MODIFY after PKG-038; keep the job name, SC-10): `npm ci`, `npm run build:tokens`, `git diff --exit-code tokens/generated src/tokens/generated src/material/css/generated src/motion/tokens.generated.ts`, `npx jest tests/tokens`, and a timing check that fails if `build:tokens` is over 20 s (AC-DS-03). Do not edit `design-system-compliance.yml` (QA-118 deletes it, SC-39). The step moves to QA L4 Token contrast (DS-061) and L1 Static (DS-076) in 03c/03d.

## 4. Tests to run
Local: `npm run build:tokens && npx jest tests/tokens`. Remote: the PR's `Glass Quality Gates` `tokens` step (determinism + diff + timing).

## 5. Visual evidence
This prompt produces no browser output. Attach `dist/css/tokens.css` (gz size logged) and `dist/tokens/manifest.json` as CI artifacts. Public var count must be ≤ 260 and private ≤ 200 (§16); log both.

## 6. Exit criteria
- AC-DS-03: two consecutive `npm run build:tokens` runs followed by `git diff --exit-code` pass in CI; build ≤ 20 s.
- AC-DS-06 (compiler output so far): `emitted-css.test.ts` and `modes-matrix.test.ts` green, with 0 `!important`, 0 `prefers-contrast: high`, and every rule in its layer.
- All tests in §3 green, with 0 skipped.

## 7. Final report format
```
PROMPT-03b report
PRs: <urls>   Branch: main
Prereqs: 1, 2 (PKG-005/056/038), 3 (MOT values), 3a (NAV/MED rows), 4 <ok|blocked:...>
Pinned devDeps: style-dictionary@x.y.z ajv@x.y.z postcss@x.y.z
Tasks: DS-013 <done|blocked> ... DS-047, DS-120
Tests: npx jest tests/tokens -> <pass>/<total>, 0 skipped
Determinism: sha256 list identical (<n> files); build time <s> s
Counts: public --ag-* <n>/260, private --_ag-* <n>/200, @property <n>/16, tokens.css gz <KB> (presets excl.) / preset blocks gz <KB>
AC: AC-DS-03 <pass|fail>, AC-DS-06 (partial) <pass|fail>
Deviations: scales/interaction-states/environment-elevation tests added beyond PRD §12; <others with evidence>
```
