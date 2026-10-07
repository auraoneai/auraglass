# PROMPT-2a (MAT lane T): Tokens and compiler

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **T**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2a-T"` (94 tasks: MAT-001..094).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside MAT):** `tokens/**` (except `compat-alias-map.json` and `legacy/`), `scripts/tokens/**` (except `lens-maps.mjs`), `src/tokens/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`, `stylelint*`, `lint/rules/mat/no-raw-design-values.cjs`, `tests/lint/mat/no-raw-design-values.test.ts`, `fragments/literals-baseline/mat.json`, `tests/tokens/**`, `tests/a11y/contrast-matrix.test.ts`, `tests/visual/mat/tokens/**`, `src/theme/{color,createGlassTheme,createBrandTheme,createBrandGlassTheme,presets,materials}.ts` (`createBrandGlassTheme.ts` is deleted here once its compat adapter exists in lane B), `tests/theme/{presets,createGlassTheme,createBrandTheme,color}.test.ts`, `docs/{motion,design-tokens}.md` (deletion)

**Delivers:** REQ-MAT-01..20

**Order inside the lane:** schema + guards → `ref`/`sys` + modes → transforms (spring, material, solver) → gates + literal rule → presets and theme functions

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-02, REQ-MAT-03, REQ-MAT-04, REQ-MAT-05, REQ-MAT-06, REQ-MAT-07, REQ-MAT-08, REQ-MAT-09, REQ-MAT-10, REQ-MAT-11, REQ-MAT-12, REQ-MAT-13, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, REQ-MAT-17, REQ-MAT-18, REQ-MAT-19, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-33, REQ-MAT-39, REQ-MAT-41, REQ-MAT-52, REQ-MAT-54, REQ-MAT-61, REQ-MAT-66, REQ-MAT-67.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-t -b next-mat/t-<topic> origin/next
# release/4.x work in this lane (MAT-066, MAT-067): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-t-4x -b 4x-mat/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2a-T") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-001 | TEST | `NEW:tests/tokens/types-runtime-parity.test.ts` | 4.2 form: collect value exports from dist/tokens/index.d.ts with the TS compiler API (checker.getExportsOfModule) and compare them as sets with … |  | REQ-MAT-22 |
| MAT-002 | TEST | `NEW:tests/tokens/no-undefined-opacity.test.ts` | Assert every --glass-opacity-<n> referenced in src/**/*.{ts,tsx,css} is defined in src/styles/**/*.css; a fixture string containing --glass-opacity-24 must be reported. … |  | REQ-MAT-17 |
| MAT-003 | TEST | `NEW:tests/tokens/private-ag-namespace.test.ts` | Update the AuroraOrb.test.tsx assertions and regenerate src/components/navigation/__snapshots__/GlassTabBar.test.tsx.snap; its diff may contain only --ag- -> --_ag- … |  | REQ-MAT-04 |
| MAT-004 | TEST | `NEW:tests/tokens/legacy-freeze.test.ts` | Re-run the extraction in memory and deep-equal it against the committed tokens/legacy/4x-rendered.tokens.json; assert >= 1 entry per --glass-* primitive in tokens.css … |  | REQ-MAT-21 |
| MAT-005 | CREATE | `NEW:tokens/$schema.json` | JSON Schema 2020-12 for DTCG 2025.10 ($value/$type/$description/$extensions) covering the standard types plus the glass-material composite (architecture §4.3 … |  | REQ-MAT-01 |
| MAT-006 | TEST | `NEW:tests/tokens/schema.test.ts` | Validate every tokens/**/*.tokens.json against tokens/$schema.json with ajv; NEW fixture tests/tokens/fixtures/unknown-type.tokens.json must fail; a token without … | MAT-005 | REQ-MAT-01 |
| MAT-007 | CREATE | `NEW:scripts/tokens/build.mjs` | Style Dictionary 4 entry: ajv validate -> resolve aliases -> expand modes (scheme x contrast x transparency x density; presets on the colour axis only) -> formats -> … | MAT-005 | REQ-MAT-02, REQ-MAT-03 |
| MAT-008 | TEST | `NEW:tests/tokens/compiler-guards.test.ts` | One fixture dir per failure under tests/tokens/fixtures/guards/{unresolved-alias,cycle,material-to-ref,preset-material,preset-private-var,schema}; each asserts exit … | MAT-007 | REQ-MAT-02 |
| MAT-009 | TEST | `NEW:tests/tokens/determinism.test.ts` | Build twice into two temp dirs; assert identical SHA-256 for every file in dist/tokens/**, tokens/generated/**, src/tokens/generated/**, src/material/css/generated/** … | MAT-007 | REQ-MAT-03 |
| MAT-010 | CREATE | `NEW:tokens/ref/color.tokens.json` | OKLCH {colorSpace, components [L,C,H], alpha} ramps: slate.1..12 (light L 0.99 -> 0.18, adjacent dL >= 0.03), plus 12-step accent, danger, warning and success ramps; … | MAT-006 | REQ-MAT-05 |
| MAT-011 | CREATE | `NEW:tokens/ref/dimension.tokens.json` | 4 pt space base (0,2,4,6,8,12,16,20,24,32,40,48,64 px), radius ladder (6,10,14,20,28,9999 px), blur ladder (12,20,32 px; none > 32) and type sizes. | MAT-006 | REQ-MAT-06, REQ-MAT-07 |
| MAT-012 | CREATE | `NEW:tokens/ref/time.tokens.json` | Duration ladder 90/120/200/320/450 ms; cubic-bezier set (0.2,0,0,1), (0.05,0.7,0.1,1), (0.3,0,1,1); springs snappy {1.0, 200}, smooth {0.9, 350}, fluid {0.82, 450} as … | MAT-006 | REQ-MAT-08 |
| MAT-013 | CREATE | `NEW:tokens/sys/color.tokens.json` | {light, dark} pairs aliasing ref for canvas, on-surface, on-surface-muted, accent, on-accent, border, focus-inner, focus-outer, specular, danger, warning, success; dark … | MAT-010 | REQ-MAT-05 |
| MAT-014 | CREATE | `NEW:tokens/sys/type.tokens.json` | Roles display, title-1..3, body, callout, caption, label, mono, each with size, line-height (unitless), weight and tracking; body clamp(15px, 0.9rem + 0.2vw, 17px); … | MAT-011 | REQ-MAT-06 |
| MAT-015 | CREATE | `NEW:tokens/sys/space.tokens.json` | space.0..12 emitted as calc(<px> * var(--_ag-density)); target.min 24px and target.coarse 44px, not density-scaled; --_ag-target = max(min, coarse) under @media … | MAT-011 | REQ-MAT-06 |
| MAT-016 | CREATE | `NEW:tokens/sys/shape.tokens.json` | radius xs 6, sm 10, md 14, lg 20, xl 28, full 9999 px replace the four 4.x scales; --ag-radius-outer, --ag-inset, --ag-radius-inner = max(0px, … | MAT-011 | REQ-MAT-06 |
| MAT-017 | CREATE | `NEW:tokens/sys/motion.tokens.json` | Create tokens/sys/motion.tokens.json, the only motion token source (SC-18; anchor for MOT-020): sys.duration.{instant,micro,small,medium,large} with -exit variants … | MAT-012 | REQ-MAT-08 |
| MAT-018 | CREATE | `NEW:tokens/sys/interaction.tokens.json` | 8 states per the REQ-DS-19 table: hover-specular +0.15 / hover-floor +0.02; press-glow 0.25 / press-floor +0.04; selected-tint accent at 0.16; focus-width 2px with … | MAT-013 | REQ-MAT-09 |
| MAT-019 | CREATE | `NEW:tokens/sys/environment.tokens.json` | light.angle 300deg -> --ag-light-angle, light.specular 0.5 -> --ag-specular, glass-opacity 0 -> --ag-glass-opacity; backdrop.{light,dark,media} tint mapping selected by … | MAT-013 | REQ-MAT-07 |
| MAT-020 | CREATE | `NEW:tokens/sys/elevation.tokens.json` | shadow.{chrome,overlay,transient,content}.{thin,regular,thick} x scheme (ambient + key) -> --_ag-shadow-*; layer.z content 0, chrome 100, overlay 1000, transient 1100, … | MAT-013 | REQ-MAT-07 |
| MAT-021 | CREATE | `NEW:tokens/material/material.tokens.json` | The single glass-material token (sole MaterialSpec instance): variants regular\|clear\|identity (D-06) x thickness thin\|regular\|thick (D-07); blur 12/20/32 px (cap 32); … | MAT-013, MAT-019, MAT-020 | REQ-MAT-05, REQ-MAT-07 |
| MAT-022 | CREATE | `NEW:tokens/modes/scheme.tokens.json` | Per-axis overrides in tokens/modes/{scheme,contrast,transparency,density}.tokens.json: scheme light/dark; contrast standard/more (more raises effective transparency to … | MAT-013, MAT-015 | REQ-MAT-12 |
| MAT-023 | CREATE | `NEW:tokens/presets/aura.tokens.json` | tokens/presets/{aura,graphite,daylight,midnight}.tokens.json, each with canvas {light, dark}, neutralHue, accent and optional radiusScale (0.75\|1\|1.25) only; no … | MAT-013 | REQ-MAT-14 |
| MAT-024 | CREATE | `NEW:tokens/contrast/busy-reference.json` | Exactly the 9 sRGB busy samples #777777 #ff3b30 #34c759 #0a84ff #ffcc00 #af52de #ff9500 #5ac8fa #8e8e93 (contract: REQ-A11Y-15). DS is the only creator of this file … | MAT-006 | REQ-MAT-10 |
| MAT-025 | DOC | `NEW:tokens/comp/README.md` | State that comp.* tokens are narrow component tokens added only by flagship PRDs (PRD-07..14) through this compiler, may alias only sys.* and material.*, and are … | MAT-006 | REQ-MAT-04 |
| MAT-026 | CREATE | `NEW:scripts/tokens/formats/css-layered.mjs` | Emit dist/css/tokens.css: the order statement '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;'; everything else in @layer ag.tokens: :root, … | MAT-007, MAT-022, MAT-023 | REQ-MAT-05 |
| MAT-027 | CREATE | `NEW:scripts/tokens/formats/property-registry.mjs` | Emit src/material/css/generated/properties.css: @property --ag-light-angle (<angle>, inherits true, 300deg), --ag-specular (<number>, false, 0.5), --ag-glass-opacity … | MAT-007, MAT-019 | REQ-MAT-07 |
| MAT-028 | CREATE | `NEW:scripts/tokens/formats/ts-constants.mjs` | Emit src/tokens/generated/tokens.ts (typed tokens map of var(--ag-*) strings, token(path: TokenPath), TokenPath union, no raw values, no class strings), tokens.d.ts and … | MAT-007 | REQ-MAT-04 |
| MAT-029 | CREATE | `NEW:scripts/tokens/formats/manifest.mjs` | Emit dist/tokens/manifest.json listing every public --ag-* with {tier, group, $type, modes[], since, public}; consumers is filled by dead-vars (DS-064). Hand it to … | MAT-007 | REQ-MAT-04 |
| MAT-030 | MODIFY | `src/tokens/index.ts` | Additively export tokens and token from './generated/tokens' plus type TokenPath; leave the 4.x exports until DS-109. | MAT-028 | REQ-MAT-03, REQ-MAT-41 |
| MAT-031 | TEST | `NEW:tests/tokens/oklch.test.ts` | Ramps monotone in L with dL >= 0.03; every sys.color leaf in tokens.css emitted as light-dark(; hex only inside @supports not; dark on-surface L >= 0.92 and C <= 0.02. | MAT-026 | REQ-MAT-05 |
| MAT-032 | TEST | `NEW:tests/tokens/scales.test.ts` | Added beyond PRD §12 to cover REQ-DS-11..13 and §14: 9 roles x 4 props; caption >= 12px; exact body clamp; unitless line-heights; space = calc(px * var(--_ag-density)); … | MAT-026, MAT-037 | REQ-MAT-06 |
| MAT-033 | TEST | `NEW:tests/tokens/interaction-states.test.ts` | All 8 states have standard, contrast=more and transparency=solid values; disabled uses --_ag-surface-alpha and emitted CSS has no host 'opacity:'; selected and … | MAT-026, MAT-018 | REQ-MAT-09 |
| MAT-034 | TEST | `NEW:tests/tokens/environment-elevation.test.ts` | Exact @property rules; z-scale 0/100/1000/1100/1200; no elevation token; shadows for 4 layers x 3 thicknesses x 2 schemes; scrim.clear 0.35. | MAT-027, MAT-020 | REQ-MAT-07 |
| MAT-035 | TEST | `NEW:tests/tokens/modes-matrix.test.ts` | postcss-parse tokens.css: for each scheme/contrast/transparency/density value, an attribute block and media mirror exist; OS floors re-emitted in ag.a11y; contrast=more … | MAT-026 | REQ-MAT-12 |
| MAT-036 | TEST | `NEW:tests/tokens/emitted-css.test.ts` | On dist/css/tokens.css and src/material/css/generated/*.css (extended later with tailwind.css and compat/tokens.css): 0 !important; each rule in its expected ag.* … | MAT-026, MAT-027, MAT-028 | REQ-MAT-13, REQ-MAT-19 |
| MAT-037 | CREATE | `NEW:tokens/sys/breakpoint.tokens.json` | sys.breakpoint sm 640, md 768, lg 1024, xl 1280 px, used only by the Tailwind bridge @theme (PRD §14); no other breakpoint or per-breakpoint blur tokens. | MAT-011 |  |
| MAT-038 | CREATE | `NEW:scripts/tokens/transforms/glass-material.mjs` | Flatten MaterialSpec into --_ag-* per [data-ag-variant][data-ag-thickness] in @layer ag.material; emit literal -webkit-backdrop-filter: blur(<n>px) saturate(1.6) per … | MAT-021, MAT-007 | REQ-MAT-07, REQ-MAT-05 |
| MAT-039 | CREATE | `NEW:src/material/css/generated/ladders.css` | Committed generated output of glass-material. It lives in MAT's tree but only this compiler emits it (OV-31). MAT imports it from src/material/css/material.css … | MAT-038 | REQ-MAT-07 |
| MAT-040 | CREATE | `NEW:src/tokens/generated/material-spec.ts` | Generated, side-effect-free 'export const materialSpec' (the only generated TS with raw values; for docs/tests), tree-shakable and excluded from aura-glass/tokens … | MAT-038 | REQ-MAT-07 |
| MAT-041 | TEST | `NEW:tests/tokens/material-transform.test.ts` | Exactly 3 variants x 3 thicknesses; every blur <= 32px; -webkit-backdrop-filter literal count = variants_with_blur x thicknesses x tiers (expect 18, logged); … | MAT-039, MAT-040 | REQ-MAT-07 |
| MAT-042 | CREATE | `NEW:scripts/tokens/transforms/motion-spring.mjs` | REQ-MOT-04 contract: omega0 = 2*pi/r; sample the step response at 1 ms until \|1-x\| < 0.001 and \|x'\| < 0.001*omega0 hold for 50 ms; RDP tolerance 0.002; <= 40 stops; 4 … | MAT-017 | REQ-MAT-08 |
| MAT-043 | CREATE | `NEW:src/motion/tokens.generated.ts` | Generated motionTokens (PRD-06 §4.3 shape) including compiled spring linear() strings and durations; path owned by PRD-06, content by this compiler. | MAT-042, MAT-028 | REQ-MAT-08 |
| MAT-044 | TEST | `NEW:tests/tokens/motion-spring.test.ts` | snappy/smooth/fluid: <= 40 stops, last stop exactly 1, max \|x(t) - linear(t)\| <= 0.005 over 1,000 samples vs the analytic solution; fixtures zeta 0.7, zeta 1.1 and … | MAT-042, MAT-043 | REQ-MAT-08 |
| MAT-045 | MODIFY | `src/theme/color.ts` | DS owns the edits to src/theme/color.ts; A11Y-003 is a consumer test of this task. Keep normalizeHexColor, hexToRgb, rgbToHex, mixHex, relativeLuminance, contrastRatio … | MAT-007 | REQ-MAT-15 |
| MAT-046 | CREATE | `NEW:scripts/tokens/transforms/contrast-solve.mjs` | Implement A11Y's matrix contract (REQ-A11Y-15..17; data in tests/a11y/contrast/matrix-contract.json, A11Y-002). For each of 2,160 cells (4 presets x 2 schemes x 2 … | MAT-045, MAT-024, MAT-023, MAT-021 | REQ-MAT-10 |
| MAT-047 | CREATE | `NEW:tokens/generated/opacity-floors.json` | Committed solver output keyed [preset][scheme][contrast][transparency][variant][thickness][backdrop] -> {floorAlpha, minRatio, pair, apcaLc}, keys sorted, … | MAT-046 | REQ-MAT-10, REQ-MAT-52 |
| MAT-048 | CREATE | `NEW:src/material/css/generated/floors.css` | Emit --_ag-tint-floor per [data-ag-transparency][data-ag-thickness][data-ag-backdrop] plus the contrast=more row, in @layer ag.material, each value = max solved floor … | MAT-047 | REQ-MAT-10 |
| MAT-049 | TEST | `NEW:tests/tokens/contrast-matrix.test.ts` | Re-solve every cell and deep-equal opacity-floors.json; cellCount === 2160 (logged); every cell meets 4.5/3/7:1 over 3 composites; emitted floors = max per key; … | MAT-048 | REQ-MAT-11 |
| MAT-050 | CREATE | `NEW:scripts/tokens/gates/undefined-vars.mjs` | For each importable dist/css entry (styles, tokens, material, tailwind, per-subpath, compat/*), resolve its @import closure with postcss; every var(--ag-*\|--_ag-*) … | MAT-029, MAT-048 | REQ-MAT-17 |
| MAT-051 | CREATE | `NEW:scripts/tokens/gates/dead-vars.mjs` | Every public manifest var needs >= 1 reader in dist/css/** or library src TS (excluding generated, tests, stories), or carries $extensions['ag.public'] = true; every … | MAT-029 | REQ-MAT-17 |
| MAT-052 | CREATE | `NEW:scripts/tokens/gates/tier-skip.mjs` | Fail when any src/** file (except src/tokens/generated/**) references --_ag-ref-*, when a material.* token aliases anything but sys.*, or when a comp.* token aliases … | MAT-007 | REQ-MAT-04 |
| MAT-053 | TEST | `NEW:tests/tokens/vars-gates.test.ts` | Run undefined-vars, dead-vars and tier-skip on the real build and expect 0 violations; fixtures under … | MAT-050, MAT-051, MAT-052 |  |
| MAT-054 | CREATE | `NEW:scripts/tokens/gates/types-runtime.mjs` | Compare Object.keys(await import('aura-glass/tokens')) and aura-glass/theme (through package exports, built dist) with etc/api/tokens.exports.json and … | MAT-030 | REQ-MAT-22 |
| MAT-055 | TEST | `tests/tokens/types-runtime-parity.test.ts` | Rewrite the DS-003 test to call gates/types-runtime.mjs for aura-glass/tokens and aura-glass/theme; assert 0 mismatches and no getPersona. | MAT-054 | REQ-MAT-22 |
| MAT-056 | MODIFY | `lint/rules/mat/` | MODIFY the existing plugin (namespace and wiring PKG, PKG-015, SC-16): add rule auraglass/no-raw-design-values, the program's only raw-value rule (SC-17; it absorbs FND … | MAT-007 | REQ-MAT-18 |
| MAT-057 | MODIFY | `lint/rules/mat/` | Register 'auraglass/no-raw-design-values': 'error' and remove 'auraglass/require-glass-tokens': 'warn' (:30). | MAT-056 | REQ-MAT-18, REQ-MAT-39 |
| MAT-058 | CREATE | `NEW:stylelint-plugin-auraglass/rules/no-raw-design-values.js` | Stylelint plugin auraglass/no-raw-design-values (NEW stylelint-plugin-auraglass/index.js) with the same pattern set as DS-069 on declaration values in src/**/*.css, … | MAT-056 | REQ-MAT-18 |
| MAT-059 | CREATE | `NEW:scripts/tokens/gates/literals.mjs` | Run both rules programmatically over all src/**/*.{ts,tsx,css} with no directory exclusions. Compare per-file counts by category … | MAT-057, MAT-058 | REQ-MAT-18, REQ-MAT-16 |
| MAT-060 | CREATE | `NEW:scripts/tokens/gates/literals-baseline.json` | Generate once at the current main HEAD and commit, keyed {file: {category: count}} with the SC-17 categories. Log the measured total (architecture §15.2 expects about … | MAT-059 | REQ-MAT-18, REQ-MAT-12 |
| MAT-061 | TEST | `NEW:tests/tokens/literals-lint.test.ts` | Fixtures tests/tokens/fixtures/literals/{hex.tsx,rgba.tsx,blur.css,duration.tsx,bezier.css} containing #fff, rgba(0,0,0,.2), blur(8px), 200ms and cubic-bezier(.2,0,0,1) … | MAT-059, MAT-060 | REQ-MAT-16 |
| MAT-062 | TEST | `scripts/tokens/gates/undefined-vars.mjs` | On one commit, run scripts/ci/token-lint.js, check-undefined-custom-props.mjs and audit-css-var-coverage.js, normalise findings to {file, var\|literal}, diff against the … |  | REQ-MAT-17 |
| MAT-063 | CREATE | `NEW:src/theme/presets.ts` | ts-constants emits src/tokens/generated/presets.ts (presets: Record<PresetId, ThemePreset>; PresetId 'aura'\|'graphite'\|'daylight'\|'midnight'; ThemePreset {id, name, … | MAT-023, MAT-028, MAT-049 | REQ-MAT-14 |
| MAT-064 | REDESIGN | `src/theme/createGlassTheme.ts` | DS owns this file (SC-18; anchor for MOT-026). Keep options id, name, brandColor, accentColor, mode, density, motionPolicy (:62-70) and add preset, neutralHue, … | MAT-045, MAT-048, MAT-051, MAT-063 | REQ-MAT-15 |
| MAT-065 | CREATE | `NEW:src/theme/createBrandTheme.ts` | createBrandTheme(brand: string \| Oklch, opts?: {accentShift?: number; preset?: PresetId}): GlassTheme. 12-step accent ramp emitted with oklch(from <brand> calc(l + d) c … | MAT-064 | REQ-MAT-16, REQ-MAT-67 |
| MAT-066 | DEPRECATE | `src/theme/createBrandGlassTheme.ts` | Re-export createBrandTheme as createBrandGlassTheme with a one-time dev warning ('createBrandGlassTheme is deprecated; use createBrandTheme'); C-D cherry-picked to … | MAT-065 | REQ-MAT-16, REQ-MAT-67 |
| MAT-067 | DEPRECATE | `src/theme/createGlassTheme.ts` | createGlassThemeCssVars (:206) becomes a C-D wrapper returning the 4.x --glass-theme-* output with a one-time dev warning pointing to createGlassTheme(...).vars; … | MAT-064 | REQ-MAT-16, REQ-MAT-67 |
| MAT-068 | CREATE | `NEW:scripts/tokens/formats/tailwind-bridge.mjs` | Emit dist/css/tailwind.css: order statement; @import "./tokens.css" (relative); @theme inline mapping every public sys colour, radius, ease, duration, shadow read-out, … | MAT-039, MAT-026, MAT-037 | REQ-MAT-20, REQ-MAT-41 |
| MAT-069 | TEST | `NEW:tests/tokens/tailwind-bridge.test.ts` | Compile NEW tests/tokens/fixtures/tailwind/input.css with @tailwindcss/node (pinned exact with tailwindcss 4.x as devDependencies) over classes glass-regular glass-thin … | MAT-068 | REQ-MAT-20, REQ-MAT-41 |
| MAT-070 | MODIFY | `scripts/tokens/formats/css-layered.mjs` | Inside @layer ag.tokens: under :root[data-ag-shadcn-source], read --background, --foreground, --primary, --primary-foreground, --muted, --border, --ring and --radius … | MAT-026 | REQ-MAT-20 |
| MAT-071 | TEST | `NEW:tests/tokens/shadcn-interop.test.ts` | jsdom plus a var() resolver over parsed tokens.css: without the attribute, --primary resolves to the --ag-accent value; with data-ag-shadcn-source and --primary … | MAT-070 | REQ-MAT-20 |
| MAT-072 | CREATE | `NEW:scripts/tokens/formats/registry-cssvars.mjs` | Emit dist/tokens/registry-cssvars.json {cssVars: {theme, light, dark}} (shadcn CLI v4 schema) from the same source; validate against a committed schema copy … | MAT-070 | REQ-MAT-20 |
| MAT-073 | MODIFY | `scripts/tokens/build.mjs` | Add a Style Dictionary 'legacy' platform whose only input is tokens/legacy/4x-rendered.tokens.json; it outputs dist/css/compat/legacy-primitives.css (part of … | MAT-004, MAT-007 | REQ-MAT-21 |
| MAT-074 | TEST | `tests/tokens/legacy-freeze.test.ts` | Extend: legacy platform output equals the 4.1.0 primitives parsed from 'git show 15b6de6f7:src/styles/tokens.css' (fixed reference); 0 differences. | MAT-073 | REQ-MAT-21 |
| MAT-075 | CREATE | `NEW:scripts/tokens/formats/compat-aliases.mjs` | Build the 4.x reader set: --glass-*, --aura-*, --persona-* and --glass-theme-* read via var() in git show 15b6de6f7 src/** plus the frozen 4.x consumer fixture … | MAT-073 | REQ-MAT-21, REQ-MAT-13 |
| MAT-076 | TEST | `NEW:tests/tokens/compat-aliases.test.ts` | Every name in the 4.x reader set has an alias (count logged, ~620 expected); the whole file is inside @layer ag.compat; only [data-theme=dark] and .dark are mapped … | MAT-075 | REQ-MAT-13 |
| MAT-077 | CREATE | `NEW:tokens/generated/persona-preset-map.json` | Generate from src/theme/designMatrix.ts before deletion: for each of the 10 persona ids, the nearest preset (minimum dE2000 between dark canvases) and the … | MAT-065, MAT-063 | REQ-MAT-13 |
| MAT-078 | TEST | `tests/tokens/export.test.ts` | Rewrite tests/tokens/export.test.ts and tests/tokens/export.spec.mjs for the 5.0 map: ESM aura-glass/tokens exposes exactly tokens, token, materialSpec and manifest; … |  | REQ-MAT-08 |
| MAT-079 | TEST | `NEW:tests/visual/mat/tokens/modes.spec.ts` | Remote, QA L6 Environment visual (SC-29/SC-30; config certification/playwright.cert.config.ts, QA-018), Chromium/WebKit/Gecko. Pages NEW … | MAT-064 | REQ-MAT-12 |
| MAT-080 | TEST | `NEW:tests/visual/mat/tokens/canaries.spec.ts` | Remote, QA L11 Consumer canaries, packed tarball (scripts/ci/lib/npm-pack.js, TRUST-002). PKG's canaries/vite-tailwind4 (PKG-128) builds, and getComputedStyle for each … | MAT-069, MAT-071 |  |
| MAT-081 | DOC | `docs/design-tokens.md` | Replace the hand tables in docs/design-tokens.md and docs/theme/theme-engine.md with a pointer to DX's generated pages (docs app DX-101, theming guide DX-124; built … | MAT-077, MAT-029 |  |
| MAT-082 | MODIFY | `scripts/tokens/gates/literals-baseline.json` | At 5.0.0-beta.1: literals-baseline.json is {} and lint:tokens reports 0 across src/**/*.{ts,tsx,css} with only the REQ-DS-33 exemptions; undefined-vars/dead-vars = 0/0 … | MAT-079, MAT-080 | REQ-MAT-18 |
| MAT-083 | CREATE | `NEW:tokens/sys/app-shell.tokens.json` | SC-18 row request from NAV (NAV-009 is now the row request; DS is the creator): author the app-shell tokens with NAV's values as DTCG sys tokens ($extensions ag.tier … | MAT-011, MAT-015, MAT-007 | REQ-MAT-01, REQ-MAT-04 |
| MAT-084 | REMOVE | `src/theme/materials.ts` | [main 5.0, one PR] Delete theme/materials.ts (R8), core/productionCore.ts:196-200 --aura-blur-amount and glass-tier-* classes, hooks/useGlassProbes.ts and its subpath. … |  | REQ-MAT-39 |
| MAT-085 | MODIFY | `tokens/sys/motion.tokens.json` | REQ-MOT-01/-03 values-only MODIFY of the DS-owned file (SC-18): durations instant 90/micro 120/small 200/medium 320/large 450 (ms), -exit 60/80/140/220/320, ambient … | MAT-017 | REQ-MAT-08 |
| MAT-086 | MODIFY | `tokens/$schema.json` | REQ-MOT-02: constrain cubicBezier y1/y2 to [0,1] via prefixItems; compiler must reject [0.68,-0.55,0.265,1.55]. MODIFY of DS-014's schema (SC-18); compiler is DS-016 … | MAT-085, MAT-005, MAT-007 | REQ-MAT-08 |
| MAT-087 | MODIFY | `tokens/$schema.json` | REQ-MOT-03: constrain motion-spring dampingRatio to [0.8,1.0] and response to 120-800 ms; compiler rejects zeta 0.5. MODIFY of DS-014's schema (SC-18). | MAT-085, MAT-005, MAT-007 | REQ-MAT-08 |
| MAT-088 | MODIFY | `src/theme/createGlassTheme.ts` | REQ-MOT-07 (mapping): motion policy expressive -> {motion:'full', allowContinuous:true}, system -> OS-following, reduced -> calm, none -> none, passed to PRD-05 store … | MAT-064 | REQ-MAT-15 |
| MAT-089 | MODIFY | `lint/rules/mat/; stylelint-plugin-auraglass/rules/no-raw-design-values.js` | REQ-MOT-61 (SC-17): no auraglass/motion-no-literals rule and no scripts/ci/motion-literal-baseline.json. MODIFY DS's auraglass/no-raw-design-values (ESLint + stylelint, … | MAT-058, MAT-059, MAT-060 | REQ-MAT-18 |
| MAT-090 | DOC | `NEW:docs/motion.md` | REQ-MOT-118 + AC-MOT-19/-20: checklist for VoiceOver/Safari macOS+iOS (Reduce Motion), NVDA/Chrome (Show animations off), TalkBack/Chrome (Remove animations) x Button, … |  | REQ-MAT-66 |
| MAT-091 | TEST | `tokens/contrast/busy-reference.json` | Consumer of DS-033 (SC-18: only DS creates files under tokens/). Verify the DS-created file holds exactly the 9 ordered sRGB busy samples #777777 #ff3b30 #34c759 … | MAT-024 | REQ-MAT-10 |
| MAT-092 | TEST | `src/theme/color.ts` | Consumer of DS-055 (PRD-03 owns src/theme/color.ts edits). Verify the single luminance implementation exports what this PRD needs under the DS names: relativeLuminance, … | MAT-045 | REQ-MAT-11 |
| MAT-093 | TEST | `NEW:tests/a11y/contrast-matrix.test.ts` | Parse built material.css/tokens.css (PostCSS) and dist/contrast-matrix.json; import only src/theme/color.ts; recompute every cell's minRatio over white, black and 9 … | MAT-092, MAT-046, MAT-048 | REQ-MAT-54, REQ-MAT-33, REQ-MAT-10, REQ-MAT-11 |
| MAT-094 | TEST | `tests/a11y/contrast-matrix.test.ts` | Add case 'focus bands': per scheme ratio(--ag-focus-inner, --ag-focus-outer) >= 3 and for 4,096 backdrops (16 levels per sRGB channel) max(ratio(inner,bg), … | MAT-093, MAT-013 | REQ-MAT-61 |

## Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-39, S-40, S-41, S-42, S-43, S-46, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE T REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
