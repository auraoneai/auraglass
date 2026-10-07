# PROMPT-04b (MAT): Compiled CSS engine (`material.css`, `lens.css`, lens maps, spec, contract tests)

You are implementing part of PRD-04 (Material Engine) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained.

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` §4 (pipeline, layer model, nesting, tiers), §5.2–§5.5, §5.7 (incl. REQ-MAT-86/87), §5.10 REQ-MAT-68/69, §5.11, §14, §15, deviation notes 2, 4, 5 and 8, §12.1, §20 steps 3–4 and 10, §21.
- Contracts (binding; registry wins): `docs/auraglass-5/prd/_shared-contracts.md` SC-15 (budgets), SC-18 (generated outputs, DS), SC-19 (CSS var names), SC-20 (layer statement), SC-21 (attributes), SC-37 (MAT is the interim §16 PRD-15 owner; static lens scale), OV-31.
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §4.3–§4.7, §5.2, D-04, D-05, D-07, D-08, D-09, D-11, D-12, D-24.
- Evidence: `docs/auraglass-5/autopsy/material-engine.md`, `autopsy/runtime-remote.md`, `research/web-glass-techniques.md`, `research/translucent-a11y-perf.md`.
- Tasks: `docs/auraglass-5/tasks/MAT.json` MAT-013..MAT-044 and MAT-119..MAT-121.

Requirements: REQ-MAT-01 (`defineMaterial`), 13, 13a, 14, 15, 18, 19, 21, 22, 23, 25 (CSS), 26, 27, 28, 29–47, 48 (CSS default), 49, 50 (selectors), 57 (selectors), 58 (contract), 68, 69, 70 (byte rows), 73, 75, 77, 79, 80 (property exposure), 81, 83, 84, 86, 87. Acceptance: AC-MAT-14, AC-MAT-11, the static half of AC-MAT-10, and inputs to AC-MAT-03/04/05/10 that PROMPT_04d certifies in the browser.

## 2. Scope
May create or modify:
- NEW `src/material/defineMaterial.ts`, NEW `src/material/css/material.css`, NEW `src/material/css/lens.css`, NEW `src/material/assets/ag-grain-128.avif`, NEW `scripts/build/make-grain.mjs`
- NEW `scripts/build/lens-maps.mjs`, NEW `src/material/assets/lens/ag-lens-<shape>-<sizeclass>.png` (9 files), NEW `src/material/lens/LensDefs.tsx` (interim §16 PRD-15, SC-37). The `scripts/build/` location is pending PKG confirmation (PRD §21 O-6).
- `src/material/types.ts` (add `LensId` template-literal type only)
- NEW `src/material/__tests__/{defineMaterial,properties,css-contract,tint-formula,tailwind-bridge-parity,lens-maps}.test.ts`
- `docs/size-budgets.json` (MODIFY after PKG-048: add the MAT byte rows; no MAT-specific size script and no `size-limit`, SC-15)
- `etc/api/material.css-api.json` via `scripts/release/material-css-api.mjs` (add an `a11yOverridable` list)
- `package.json` `devDependencies`: add `postcss` with an exact pinned version, only if it is not already a direct devDependency. At `15b6de6f7` it is not (it is only transitive). Record the version in the report and add it to PKG's `docs/dependency-allowlist.json` through PKG-056 if required.

Must NOT touch:
- `src/material/css/generated/**`. This is DS compiler output (DS-036/049/059; OV-31). If a value is wrong, file it against DS; don't hand-edit.
- token sources `tokens/**`, `src/styles/**`, or any 4.x primitive or component.
- `ag.a11y` rung bodies (A11Y-036..038).
- `src/theme/AuraGlassProvider.tsx`. A11Y-029 owns the `LensDefs` mount point; record the mount request in the report.

## 3. Prerequisites (check each one; stop with a blocker report if any fails)
- PROMPT_04a merged: `test -f src/material/types.ts && rg -q "no-optics-outside-material" eslint-plugin-auraglass.js`.
- DS compiler output exists and is committed (DS-036/049/059): `test -f src/material/css/generated/ladders.css -a -f src/material/css/generated/properties.css -a -f src/material/css/generated/floors.css`. `ladders.css` contains literal `-webkit-backdrop-filter: blur(` lines (`rg -c "^\s*-webkit-backdrop-filter: blur\(\d" src/material/css/generated/ladders.css` ≥ 18), a `@media (pointer: coarse)` block (REQ-MAT-73), and token-keyed blocks for `[data-ag-radius=…]`, `[data-ag-spacing=…]`, `[data-ag-inset=…]`. The DS Tailwind bridge file exists, with `@utility glass-regular` (DS-090).
- DS three-composite contrast check (QA L4 Token contrast) is green (CI link). Without it REQ-MAT-79 can't be closed. Report it as an input blocker and continue with the other tasks.
- If any generated file is missing, implement nothing that depends on it. Don't write stand-in ladders.

## 4. Steps (all rules inside `@layer ag.material`; zero `!important`; `material.css` and `lens.css` each start with exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` — SC-20, no variant)
1. **MAT-013 `defineMaterial(spec)`** is a build-time validator. It returns a frozen `MaterialSpec` with defaults, and throws on blur > 32, scrim blur > 12, `grain.opacity` outside 0.02–0.04, any `opacityFloor` cell < 0 or > 1, or a missing `fallbackFill` alpha < 0.85. It is exported from `aura-glass/material` (architecture §3.2; no `/define` subpath, SC-12). It must be pure and side-effect free so runtime bundles that don't import it drop it. Test: `defineMaterial.test.ts`.
2. **MAT-014** `properties.test.ts` parses `generated/properties.css` (PostCSS). It checks exactly the 12 names, syntax and initial values in REQ-MAT-13, `inherits:false` for every `--_ag-*`, and that no initial value contains `var(`. Any mismatch is a DS defect: report it, and don't edit the generated file.
3. **MAT-015 host baseline:** `.ag-surface{position:relative;isolation:isolate;border-radius:var(--ag-surface-radius);color:var(--ag-on-surface);background:var(--_ag-fill);box-shadow:var(--_ag-shadow)}`. Never set `transform`, `will-change`, `contain`, `filter`, `opacity`, or a `transition` that includes `all|backdrop-filter|filter`. Add `.ag-surface[data-ag-animating]{will-change:opacity,transform}`. Import order: `generated/properties.css`, `generated/ladders.css`, `generated/floors.css`, then structural rules, then `lens.css`.
4. **MAT-016 layer stack (REQ-MAT-21, 13a):** `.ag-surface::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;backdrop-filter:blur(var(--_ag-blur)) saturate(var(--_ag-saturation)) brightness(var(--_ag-brightness))}`, in that order. The literal `-webkit-` value comes from the ladder cell. `::after` has `inset:0;border-radius:inherit;pointer-events:none`. Add the exact REQ-MAT-13a `inherit` declaration list for `::before, ::after`.
5. **MAT-017 read-outs (REQ-MAT-14):** set `--ag-surface-fill:var(--_ag-fill)`, `--ag-surface-rim`, `--ag-surface-shadow:var(--_ag-shadow)`, `--ag-surface-radius`, `--ag-on-surface` and `--ag-on-surface-muted` on `.ag-surface`.
6. **MAT-018 tint formula (REQ-MAT-15, 33, 79):** use the exact `--_ag-alpha: min(1, max(var(--_ag-tint-floor), calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity))))` and `--_ag-fill: oklch(from var(--ag-color-canvas) l c h / var(--_ag-alpha))`. `--_ag-tint-floor` comes only from `floors.css`. `tint-formula.test.ts` evaluates the formula numerically for `--ag-glass-opacity` ∈ {−1, 0, 0.3, 0.7, 1, 2} and every floor in `floors.css`, asserting floor ≤ alpha ≤ 1. It also asserts the `material.css` declaration text matches the formula string.
7. **MAT-019 environment (REQ-MAT-17, 83):** `[data-ag-backdrop=light|dark|media|auto]` blocks set `--_ag-env-*` and the backdrop-specific `--ag-on-surface` (glyph flip for small chrome). `auto` follows `data-ag-scheme`.
8. **MAT-020 nesting (REQ-MAT-23, 41):** the architecture §4.5 rule verbatim: `.ag-surface .ag-surface:not([data-ag-allow-nested])::before{backdrop-filter:none;-webkit-backdrop-filter:none}` and `--_ag-fill:var(--_ag-inner-fill)`.
9. **MAT-021 group (REQ-MAT-25, 08):** `[data-ag-group]::before` carries the group optics, and `[data-ag-group] > .ag-surface::before{backdrop-filter:none;-webkit-backdrop-filter:none}`. Children keep tint, rim and shadow. `--ag-group-spacing` comes from the generated `[data-ag-spacing]` block, with `gap:var(--ag-group-spacing)`.
10. **MAT-022 content (REQ-MAT-26, 42):** `.ag-surface[data-ag-layer=content]:not([data-ag-variant])` gets no backdrop and an opaque fill from `MaterialSpec.content`. The sunken style adds a 1px inset top shade.
11. **MAT-023 disabled and state (REQ-MAT-27, 28):** `[data-disabled]`/`[aria-disabled=true]` set `--_ag-surface-alpha: var(--ag-state-disabled-alpha)`, multiplied into fill alpha and pseudo-layer opacity. Host opacity stays 1. Add the `[data-ag-layer=overlay][data-open]` overlay floor row, the `[data-expanded]` next-row floor, the `[data-ag-layer=overlay][data-modal]` scrim (`MaterialSpec.scrim.modal`, blur ≤12px), and `[data-ag-full-height]` resolving to `tinted`.
12. **MAT-024..033 optics (one task per row, REQ-MAT-29..46):** blur, saturation and brightness come from the ladder (assert in tests that no reachable cell exceeds 32px). Tint and `prominent` mix `--ag-color-accent` at ≤0.18 (REQ-32). Grain: `::before` `background-image:url(../assets/ag-grain-128.avif)`, `background-size:128px`, opacity `--_ag-grain-opacity`; never `mix-blend-mode` on the host (REQ-34). The AVIF is 128×128 and ≤4 KB, generated deterministically by a committed script `scripts/build/make-grain.mjs` (NEW, seeded noise) so it can be reproduced. Rim per REQ-35, with the exact mask/`mask-composite: exclude`/`conic-gradient(from var(--ag-light-angle), …)` and `-webkit-mask-composite: xor` alongside for WebKit. Fresnel approximation per REQ-36 as a second unmasked `::after` radial layer fading within 8px. The ≥12-level threshold is a provisional target (PRD §21 O-2). Specular per REQ-37 (exact `linear-gradient` with `calc(var(--ag-specular) * 0.35)`). Shadow per REQ-40. Interaction per REQ-44/84: `[data-ag-interactive]:hover` raises `--ag-specular`; `:active,[data-pressed]` raise press glow; `transition` is limited to `opacity` and `--ag-specular` over `--ag-duration-micro`, with 0ms under `prefers-reduced-motion: reduce` and `[data-ag-motion=calm|none]`. `clear` uses the scrim `--_ag-dim:0.35` over `light|media` (REQ-43) and falls back to the `regular` cell via the REQ-45 selector verbatim. `identity` has no optics but keeps `data-ag-surface` (REQ-46).
13. **MAT-034 tiers (REQ-MAT-48, 49, 17):** standard needs no attribute. The lightweight rung applies on `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`, `[data-ag-tier=lightweight] .ag-surface` / `.ag-surface[data-ag-tier=lightweight]`, `[data-ag-transparency=solid]` and `forced-colors: active`. It uses `fallbackFill` alpha ≥0.85 that follows the scheme (never a black slab), rim, shadow, grain ≤0.02 and `::before` backdrop none. A subtree `[data-ag-tier=standard]` or `[data-ag-transparency=tinted|solid]` overrides `<html>` for its descendants.
14. **MAT-035/036 `lens.css` (REQ-MAT-50, 57, 38, 39, 81, 58):** a single eligibility selector, `:root[data-ag-engine=chromium]:has(svg[data-ag-lens-ready]) .ag-surface[data-ag-refraction][data-ag-layer=chrome]`. `data-ag-lens-ready` sits on the `LensDefs` element, so no JS writes it. The selector is excluded by `:where([data-ag-tier=standard],[data-ag-tier=lightweight],[data-ag-transparency=tinted],[data-ag-transparency=solid],[data-ag-motion=none]) *` and the media queries `prefers-reduced-transparency: reduce`, `prefers-contrast: more`, `forced-colors: active`. There are 9 `[data-ag-shape=X][data-ag-sizeclass=Y]` rules, each mapping to `backdrop-filter:url(#ag-lens-X-Y) blur(var(--_ag-blur)) saturate(var(--_ag-saturation))`, and none for `sheet`. No chromatic dispersion. The header comment states the REQ-MAT-58 filter structure and that `scale` is static (decided by SC-37 and erratum E-10; no runtime scale writes). In `types.ts`, add `type LensId = \`ag-lens-${Shape}-${'control'|'bar'|'panel'}\``.
15. **MAT-037/038 shape and scroll edge (REQ-MAT-11, 75, 10, 77):** `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))`. `[data-ag-shape=concentric]` uses `border-radius: var(--ag-radius-inner, <fallbackRadius token var>)`. `capsule` is `9999px`. `[data-ag-part=scroll-edge]` gets a `mask-image` gradient, `height: clamp(16px, 4vh, 32px)` and no backdrop-filter. Port the useful geometry from `src/styles/glass.css:4425-4486` without copying the 4.x selectors. The file itself is removed by MOT-084 (SC-20), so do not edit it. `data-ag-edge-style` is emitted from the `ScrollEdge` `edgeStyle` prop (SC-22).
16. **MAT-039/040 generated blocks verification:** `css-contract.test.ts` asserts that the coarse-pointer media block lowers only `thick` (32→20px) and grain to ≤0.02, and that the private-attribute blocks emit only token names, never px values in attribute selectors.
17. **MAT-041 a11y exposure (REQ-MAT-80, 30, 37):** add `a11yOverridable` to `etc/material.css-api.json`: `--_ag-blur`, `--_ag-saturation`, `--ag-specular`, `--_ag-tint-floor`, `--_ag-grain-opacity`, `--_ag-shadow`, `--_ag-fill`, plus the required rung values (`contrast=more` → saturation 1, specular 0, grain removed; forced colors → `Canvas`/`CanvasText`, no shadow). A11Y implements the rung bodies against this list (A11Y-036..038).
18. **MAT-042 `css-contract.test.ts`** (PostCSS over `material.css`, `lens.css`, `generated/*.css`) checks: the first statement equals the SC-20 six-name order statement; 0 `!important`; every non-`@property` rule inside `@layer ag.material`; none of the REQ-MAT-18 deny-list selectors (`data-theme`, `data-aura-theme`, `data-persona`, `.glass-on-light`, `.dark`, `[class*="glass-"]`, `.liquid-glass-`, `.optimized-glass-`); no `--glass-*` read or write (REQ-69); no `transition: all` and no `transition` naming `backdrop-filter`/`filter`; `will-change` only under `[data-ag-animating]`; ≥18 literal `-webkit-backdrop-filter` values with no `var(`; a static assertion that the `@supports not` lightweight block exists (REQ-49); no `blur(` value >32px; no `cinematic` selector (REQ-60); no `data-ag-material` selector (D-20). `compat/tokens.css` is DS's and is out of scope (REQ-69).
19. **MAT-043 `tailwind-bridge-parity.test.ts` (REQ-MAT-68, AC-MAT-14):** for `glass-regular`, `glass-clear`, `glass-thin`, `glass-thick` and `content-raised`, the normalised declaration block of the `@utility` equals the matching `[data-ag-*]` block byte for byte (5/5).
20. **MAT-044 size rows (REQ-MAT-70, AC-MAT-11):** add rows to PKG's `docs/size-budgets.json` (integer `limitBytesGz`, min+gz, peers external):
    - `aura-glass/material` JS: 3072
    - `material.css`: 8192 (within PERF's per-subpath CSS default)
    - `ag-grain-128.avif`: 4096
    - each lens map: 3072
    - `LensDefs` markup + maps: 30720

    PKG's `scripts/ci/verify-size-budgets.mjs` checks them. Do not create a MAT size script.
21. **MAT-119 lens maps (REQ-MAT-86, 58):** `scripts/build/lens-maps.mjs` deterministically generates the 9 convex-squircle displacement maps (n≈1.5, R/G channels, bezel 12/16/24px by size class, no `feTurbulence`/noise) into `src/material/assets/lens/`, and they are committed.
22. **MAT-120 `LensDefs` (REQ-MAT-87):** an internal, server-safe component (no hooks, effects or `"use client"`; not exported from `aura-glass/material`). It renders one `<svg data-ag-lens-defs data-ag-lens-ready aria-hidden="true" focusable="false" width="0" height="0">` with the 9 `<filter id="ag-lens-…">` (feImage → feDisplacementMap with static `scale` → blur/saturate). A11Y-029 mounts it once per document unless provider `tier` is `standard|lightweight`.
23. **MAT-121 `lens-maps.test.ts`:** 9 ids exactly; two generator runs byte-identical; no `feTurbulence`; each map ≤3 KB; `renderToString(<LensDefs/>)` contains both attributes.

## 5. Tests to run
Local (light Jest/node): `./node_modules/.bin/jest src/material/__tests__/{defineMaterial,properties,css-contract,tint-formula,tailwind-bridge-parity,lens-maps}.test.ts`, `node scripts/ci/verify-size-budgets.mjs` (PKG; run remotely if it needs a full build), `./node_modules/.bin/eslint src/material`, `node scripts/ci/count-glass-recipes.mjs --ratchet scripts/ci/glass-recipes-baseline.json` (N may increase by at most 1, for `src/material/**`). Browser verification of computed styles is PROMPT_04d's job and runs remotely. Don't start Storybook or a browser locally.

## 6. Visual evidence
This prompt produces none itself. Push the branch and let QA's `certify-pr.yml` run the `material` project if 04d has added it (MAT-068/070). If it hasn't, record "visual evidence deferred to PROMPT_04d (MAT-069..094)".

## 7. Integrity rules (binding)
Don't hand-edit generated CSS or write stand-in ladders/floors. Don't use `!important`, and don't wrap rules outside `@layer` to win specificity. Don't skip tests (`.skip`/`.only`/`xit`). Don't loosen thresholds (blur cap 32, scrim 12, alpha ≥0.85, grain 0.02–0.04, 8 KB gz, 4 KB AVIF, 3 KB per lens map). Don't add deny-list exceptions, and don't use snapshot updates as proof of a CSS claim. Every rule must be observable by a test: either in this prompt, or named in PROMPT_04d with the REQ id. Never run local Docker or a local browser.

## 8. Exit criteria
- AC-MAT-14: parity 5/5 (MAT-043).
- AC-MAT-11: MAT rows present in `docs/size-budgets.json` and green in `verify-size-budgets.mjs` (MAT-044).
- REQ-MAT-86/87: `lens-maps.test.ts` green; LensDefs mount request recorded for A11Y-029 (MAT-119..121).
- REQ-MAT-13/13a/15/18/19/22/47/49/69 green in Jest (MAT-014, 018, 042).
- Every §5.4 optic row has exactly one CSS location, cited in the report table (optic → selector → file:line).
- Inputs ready for 04d: every REQ in §1 has a selector a browser spec can assert.

## 9. Final report format
```
PROMPT-04b REPORT
Branch/SHA:
Tasks: MAT-013..044, MAT-119..121 -> done|blocked (reason)
Optic map: REQ-MAT-xx | spec field | selector | file:line
Generated-file defects filed against DS (DS-036/049/059/090): (list) or none
Tests: name -> pass/fail (local|remote URL)
Size: material.css gz=…B, grain=…B, lens maps max=…B, LensDefs total=…B
Deviations: (each with evidence) or none
Files changed:
```
