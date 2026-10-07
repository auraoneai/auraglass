# PROMPT-04e (MAT): 4.2/4.3 bridge, compat adapters, recipe deletion, beta gate

You are implementing part of PRD-04 (Material Engine) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. It spans two branches: tasks tagged **[4.x]** go to `release/4.x` (4.2/4.3 trains), and tasks tagged **[5.0]** go to `main`. Every deletion is **one revertable PR per family**.

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` §2.1 (R1–R13), §5.2 REQ-MAT-20, §5.10 (mapping table, REQ-MAT-67/69), §6, §9, §10 (API-1..18), §11 (migration and adapter mappings), §17 AC-MAT-01/02/12/13, §20 steps 6, 8, 9, 11, 12; deviation note 6; §21 (O-1, O-7).
- Contracts (binding; registry wins): `docs/auraglass-5/prd/_shared-contracts.md` SC-02/03 (deprecations), SC-08 (frozen fixture), SC-20 (`src/styles/*` owners), SC-33 (codemod ids, TODO marker), SC-34 (compat), SC-36 (4.1.1 scope: none of these items is in it), SC-37 (REL holds the 4.2/4.3 bridge; `preview-v5.css` is MAT-101), SC-39 (removers).
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §12, §13, §14 (C-I/C-E/C-D/C-B, §14.1, §14.3, §14.4, §14.6), D-19, D-27, D-28.
- Tasks: `docs/auraglass-5/tasks/MAT.json` MAT-095..MAT-118.

Requirements: REQ-MAT-12 (compat half), 20, 67, 69 (input, DS), 63/65 (gate flip). Acceptance: AC-MAT-01, AC-MAT-02, AC-MAT-12, AC-MAT-13.

## 2. Scope
May create or modify (per task):
- [4.x] `package.json` `exports` `./material` (experimental; `release/4.x` has no exports manifest).
- [4.x] the root `deprecations.json` (version 1, REL schema `docs/schemas/deprecations.schema.json`; SC-02/03).
- [4.x] the deprecated 4.x files listed in PRD §6. Edit them only to add `warnDeprecated(id)` calls and `data-ag-*` emission.
- [4.x] `src/styles/glass.generated.css:1006-1012`, only if approved (see MAT-098).
- [4.x] NEW `src/material/css/preview-v5.css`, NEW `tests/material/preview-v5.spec.ts`, NEW `src/primitives/__tests__/{deprecations,preview-attributes}.test.tsx`.
- [5.0] NEW `src/compat/material/{OptimizedGlass,LiquidGlassMaterial,GlassCore,LiquidGlassEffectGroup,LiquidGlassScrollEdge,LiquidGlassConcentricFrame,LiquidGlassLayerProvider,OptimizedGlassAdvanced}.tsx` and NEW `src/compat/material/__tests__/adapters.test.tsx`. DX's `src/compat/index.ts` (DX-065) re-exports them, and every adapter calls REL's `warnDeprecated(id)` (REL-072; SC-34).
- [5.0] deletion of exactly the files in the §5.10 rows that this PRD removes (MAT-106..112). Do not delete `src/styles/glass.css` (MOT-084), `src/components/houdini/**` and the GPU/WebGL fakes (FND-123), or `scripts/build-tokens.js` (DS-112).
- [5.0] `src/index.ts` and `src/primitives/index.ts` export removal.
- [5.0] `eslint.config.js`/`eslint-plugin-auraglass.js` (MODIFY only: severity flips and removal of the `no-inline-glass` rule; the plugin file stays).
- [5.0] `scripts/ci/glass-recipes-baseline.json` (`noRegression` list), NEW `scripts/ci/verify-recipe-removal.mjs` (+ NEW `tests/ci/verify-recipe-removal.test.ts`), and `.github/workflows/glass-pipeline.yml` (MODIFY: `Glass Quality Gates` job steps).

Must NOT touch:
- component internals for migration. Each family's PRD (CTL, OVL, NAV, MED, FND) migrates its consumers, and a deletion PR lands only after `rg` shows zero non-compat consumers.
- `compat/tokens.css` (DS-103) and `compat/globals.css` (PKG).
- `src/styles/index.css` (PKG-101; SC-20).
- `.storybook/preview.tsx` (SB-048).
- codemod sources (DX; supply mapping tables and fixtures only on request).
- `src/material/**` engine code.

## 3. Prerequisites (check each one; stop the affected task with a blocker report if a check fails)
- 04a–04c merged on `main` (`test -f src/material/index.ts`). For [4.x] tasks, they are also cherry-picked or ported onto `release/4.x` under REL's 4.2/4.3 train (REL-090 4.2 gate, REL-125 4.3 gate).
- REL/TRUST: the root `deprecations.json` (version 1) and the visual-class gate exist on `release/4.x` (`git show release/4.x:deprecations.json`; TRUST-075, REL-010, `scripts/release/visual-class.mjs`). `src/internal/warnDeprecated.ts` exists (REL-072). The frozen fixture `tests/fixtures/consumer-4x/` exists (REL-115; SC-08).
- DX: the 4to5 engine and catalogue (DX-041/042) and the transforms used by §5.10 (`imports-subpaths`, `canonical-names`, `dead-optical-props`, `providers`, `css-vars`, `removed`; SC-33) exist with passing fixtures before each deletion PR. `doctor --v5` (DX-037) is needed for MAT-099. `src/compat/index.ts` (DX-065) is needed for MAT-103/104.
- PKG/MOT/FND for verify-only tasks: PKG-101 (shim move) for MAT-114, FND-123 (RM-06) for MAT-113, MOT-084 (`glass.css` removal) before MAT-110 closes R10.
- Per-family deletion gate: `rg -l "<symbol>" src --glob '!src/compat/**' --glob '!**/*.stories.tsx' --glob '!**/__tests__/**'` returns only the file being deleted. Otherwise the task stays `blocked` on the owning PRD's anchor task (CTL-055, OVL-040, NAV-016, MED-060, FND-007).

## 4. Steps
1. **MAT-095 [4.x] API-1/2:** `./material` is exported as experimental (C-E). Mark the README/API report entry `@experimental`. No 4.x pixel changes.
2. **MAT-096 [4.x] API-7/API-8:** add root `deprecations.json` entries (SC-03 fields) for every item in PRD §9: `id` DEP-NNNN, `kind`, `status`, `symbol`, `since` 4.2.0, `removeIn` 5.0.0, `replacement`, `codemod` (one of the SC-33 ids in the §5.10 column, or `null`), `automation`, and `compat` availability.
3. **MAT-097 [4.x]:** each deprecated export warns once in development through REL's `warnDeprecated(id)` (REL-072), which emits the canonical `[aura-glass] DEP-NNNN …` message. No hand-written warn helper. This goes in `OptimizedGlassCore.tsx`, `GlassCore.tsx`, `glass/GlassAdvanced.tsx`, `glass/OptimizedGlassAdvanced.tsx`, `LiquidGlassMaterial.tsx`, `LiquidGlassEffectGroup.tsx`, `LiquidGlassLayerProvider.tsx`, `LiquidGlassScrollEdge.tsx`, `LiquidGlassConcentricFrame.tsx`, `LiquidGlassBackdropSampler.tsx`, `hooks/useLiquidGlassBackdrop.ts`, `utils/createGlassStyle.ts`, `core/mixins/glassMixins.ts`. Add a Jest test per file asserting a single warning and an unchanged render.
4. **MAT-098 [4.x] API-17 (conditional):** scope the `[class*="glass-"]` 85% black fallback (`glass.generated.css:1006-1012`) to the explicit class list, **only** with recorded reviewer approval as a D-28 extension plus before/after composites from the remote lane. REL records the approval in `docs/release/decisions/4.2.0-gate.md` (REL-090; PRD §21 O-1). Without approval, set the task to `blocked: awaiting D-28 approval` and move it to 5.0, where it is deleted with R9 in MAT-110.
5. **MAT-099 [4.x] API-18:** a C-D entry for the `storybook-utility-shim.css` import (`kind: css-global`, `codemod: null`) in `deprecations.json`, plus the `doctor --v5` report line (DX-037). Don't edit `src/styles/index.css` (PKG) and don't remove the import in 4.x.
6. **MAT-100 [4.x 4.3] REQ-MAT-20:** the six primitives (`OptimizedGlassCore`, `LiquidGlassMaterial`, `GlassCore`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassEffectGroup`) additionally spread `materialProps(mappedRole)` attributes, mapped as in §11.2 (`elevation 0|1→thin, 2→regular, 3+→thick`; `variant="solid"` → wrapper transparency). Existing classes and inline styles stay, so 4.x pixels don't change.
7. **MAT-101 [4.x 4.3]:** `src/material/css/preview-v5.css` scopes the **same** compiled `ladders.css`/`material.css` under `[data-ag-preview="v5"]` (by `@import … layer(ag.material) supports(...)` or a generated scoped copy from DS; never a hand-authored second recipe). The file starts with the SC-20 order statement. This PRD owns its content (SC-37), and REL-118's Storybook `preview` toolbar depends on it. Inside the preview subtree, 4.x inline optics are neutralised only by data-attribute selectors in `@layer ag.compat`.
8. **MAT-102 [4.x 4.3] AC-MAT-13:** `tests/material/preview-v5.spec.ts` (remote, 3 engines). REL's frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (REL-115; QA job `consumer-4x-frozen`, QA-087) is pixel-identical to 4.1.0 baselines without the attribute. Do not create a second fixture. (ΔE2000 ≤1 on 100% of pixels; baselines captured once from the 4.1.0 tag, never updated in this PR). With `data-ag-preview="v5"`, it renders the 5.0 material (computed `::before` blur equals the ladder value).
9. **MAT-103/104 [5.0] compat adapters** (REQ-MAT-12, §11.2). `OptimizedGlass`: `elevation→thickness`; `intent` dropped unless `primary` + `prominent`; `variant="solid"`→wrapper `data-ag-transparency="solid"`; `interactive`; `className`/`style`/`children` passthrough; no-op props (`caustics, chromatic, lighting, ior, tier, depth, tint, glowIntensity, glowColor, optimization, hardwareAcceleration, intensity, blur, parallax, magnet, cursorHighlight`) dropped with one `warnDeprecated` dev warning listing them; `adaptive`→`data-ag-backdrop="auto"` (renders `regular` for `clear`; SC-21). `LiquidGlassMaterial`: `variant` kept, `thickness`/`size` mapped, `adaptToContent`/`ior`/`material`/`enableTilt` dropped and warned. `GlassCore`, `OptimizedGlassAdvanced` → `Surface`. `LiquidGlassEffectGroup`→`SurfaceGroup` (`spacing`). `LiquidGlassLayerProvider`→fragment. `LiquidGlassScrollEdge`/`ConcentricFrame`→`ScrollEdge` (4.x edge style maps to `edgeStyle`, SC-22)/`ConcentricFrame`. There is no `material` prop on any adapter output (SC-24).
10. **MAT-105** `src/compat/material/__tests__/adapters.test.tsx`: for each adapter, the attribute output equals `materialProps(expectedRole)`, the dropped-prop warning fires once, and no `style` is emitted unless the consumer passed one.
11. **MAT-106..113 [5.0] deletion PRs**, one per family, each gated by §3 and each followed by a remote run of QA's `certify-pr.yml` (`material` project) and the `Glass Quality Gates` job:
    - 106: R1/R2/R3 plus the `glassUtils` alias, `liquidGlassUtils`, `PERFORMANCE_TIERS`, the IOR tables and the ternary ladders `:1002-1021` in `src/tokens/glass.ts`.
    - 107: R4 `LiquidGlassMaterial.tsx` (+ test), `LiquidGlassBackdropSampler.tsx`, `hooks/useLiquidGlassBackdrop.ts` (+ test).
    - 108: R5 `utils/createGlassStyle.ts`, R6 `core/mixins/glassMixins.ts` (and its subpath export), R7 `core/foundation/glassFoundation.ts`, `core/mixins/glassSurface.ts`.
    - 109: R8 `theme/materials.ts`, `core/productionCore.ts:196-200` tier vars, `hooks/useGlassProbes.ts`.
    - 110: R9 `styles/glass.generated.css` only. R10 `styles/glass.css` is removed by MOT-084 (SC-20), after A11Y has migrated the `:4022-4123` a11y blocks and 04b has absorbed `:4425-4486`. DS-111 must drop `glass.generated.css` from its delete list (PRD §21 O-7).
    - 111: `OptimizedGlassCore.tsx`, `GlassCore.tsx`, `glass/GlassAdvanced.tsx`, `glass/OptimizedGlassAdvanced.tsx` (+ stories/tests); root exports `src/index.ts:17` (`OptimizedGlass`), `:960-964` (`createGlassStyle`); root re-exports `aura-glass/material` values.
    - 112: `LiquidGlassEffectGroup.tsx`, `LiquidGlassLayerProvider.tsx`, `LiquidGlassScrollEdge.tsx`, `LiquidGlassConcentricFrame.tsx`, `LiquidGlassSourceTransition.tsx` (successor MOT View Transitions, MOT-045), and the 8 `src/components/primitives/LiquidGlass*.stories.tsx`. FND-128 lists the same material losers; MAT is the proposed remover (PRD §21 O-7).
    - 113 (verify only): FND-123 (RM-06) removes R11 `src/components/houdini/**`, `advanced/LiquidGlassGPU.tsx` (+ `src/index.ts:500-502`), `advanced/GlassWebGLShader.tsx`, `surfaces/HeatGlass.tsx` and `effects/Glass3DEngine.tsx`. This task checks with `rg` that they are gone.
12. **MAT-114 [5.0] API-18 (verify only):** confirm that PKG-101 dropped the `storybook-utility-shim.css` import from shipped styles and moved the file to `.storybook/`. Also confirm the packed tarball's styles contain no global `.flex`/`.absolute` rules.
13. **MAT-115 [5.0] REQ-MAT-67 / AC-MAT-12:** `scripts/ci/verify-recipe-removal.mjs` runs `rg -l "buildSurfaceStyles|buildLiquidGlassStyles|buildBackdropFilter|createGlassStyle|glassFoundation|glassUtils|liquidGlassUtils" src` and fails on any path outside `src/compat/**`. It also checks that every §5.10 row has a `deprecations.json` entry.
14. **MAT-116 [5.0] ratchet per family (§20 step 9):** after each family PR, add its files to `noRegression` in `glass-recipes-baseline.json` and set `auraglass/no-optics-outside-material` to `error` for that family's glob in `eslint.config.js`.
15. **MAT-117 [5.0] beta gate (AC-MAT-01/02):** at 5.0.0-beta.1, switch `count-glass-recipes.mjs` to `--strict` (fail if N > 1), set the lint rule to `error` for all of `src/**`, and run the CSS scanner without a baseline. All three run in the `Glass Quality Gates` job of `glass-pipeline.yml` on every `main` push.
16. **MAT-118 [5.0]:** remove the `auraglass/no-inline-glass` rule (MAT-owned, SC-16) from `eslint-plugin-auraglass.js` and its `eslint.config.js:29` registration. This is a MODIFY; the plugin file stays. Hand `docs/liquid-glass/primitives/liquid-glass-material.md` (and its IOR 1.43 claim) to DX for replacement by `docs/guides/choosing-a-material.md` (DX-127). Don't write the guide here.

## 5. Tests to run
Local (light): `./node_modules/.bin/jest src/compat src/primitives` (deprecation tests), `node scripts/ci/verify-recipe-removal.mjs`, `node scripts/ci/count-glass-recipes.mjs --ratchet …` / `--strict`. Remote: QA's `certify-pr.yml` `material` project (including `preview-v5.spec.ts`) and the `Glass Quality Gates` job on every PR, plus `npm run build && npm run test:exports` in CI after each deletion.

## 6. Visual evidence (remote)
4.3: before/after composites of the frozen fixture with and without `data-ag-preview="v5"` (3 engines, 1440 and 390). MAT-098, if approved: before/after of the fallback on an unsupported-engine emulation. Each 5.0 deletion PR: link to the Material Lab matrix run showing no regression. Artifacts stay in CI per D-32/SC-07.

## 7. Integrity rules (binding)
Don't delete a file that still has non-compat consumers, and don't stub consumers to make `rg` pass. Don't update 4.1.0 baselines to make AC-MAT-13 pass. Don't add paths to the recipe-metric exclusions or lint exemptions beyond the PRD list. Don't put optics CSS in compat (PRD §11.7: "no compat for optics classes"). Manual codemod rows use the SC-33 marker `// TODO(aura-glass 5): <reason>, see <doc>`. No `.skip`/`.only`. One revertable PR per family. Never run local Docker or a local browser.

## 8. Exit criteria
- AC-MAT-13: preview spec green on 3 engines (MAT-102).
- AC-MAT-12: every §5.10 row has a `deprecations.json` entry, and `verify-recipe-removal.mjs` returns only `src/compat/**` (MAT-096, MAT-115).
- AC-MAT-01: `independent-glass-recipes: 1` on the beta.1 SHA and later `main` SHAs (MAT-117).
- AC-MAT-02: 0 lint and CSS-scanner violations across `src/**` on beta.1 (MAT-117).
- REQ-MAT-12 compat: adapter tests green (MAT-105).

## 9. Final report format
```
PROMPT-04e REPORT
Branches/SHAs: release/4.x: … ; main: …
Tasks: MAT-095..118 -> done|blocked (owner/reason)
Deletion PRs: family -> PR URL -> remote run URL
independent-glass-recipes: before N0 -> now N
Lint/CSS violations remaining: count by family
D-28 approval for API-17: yes (link) | no (moved to 5.0)
Deviations: (with evidence) or none
Files changed/deleted:
```
