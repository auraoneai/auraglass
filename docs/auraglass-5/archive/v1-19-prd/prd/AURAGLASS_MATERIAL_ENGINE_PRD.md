# AuraGlass 5.0 PRD: Material Engine

| Field | Value |
|---|---|
| Key | **MAT** (task fragment `tasks/MAT.json`; shared contract registry `prd/_shared-contracts.md` SC-01) |
| PRD id | **PRD-04** (architecture §16 PRD-04, plus the **interim owner of the unfiled §16 PRD-15 enhanced tier**: lens maps, bezel clamp, kill switches, `preview/*`, per SC-37). It also specifies the engine contract for the cinematic resident, whose implementation is interim-owned by PRD-EXP (§16 PRD-21, SC-37) |
| Owner area | Material engine (`src/material/**`, `material.css`, optics lint) |
| Status | Draft |
| Baseline | `aura-glass` 4.1.0, HEAD `15b6de6f7` |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §1, §4, §5, §7, §8, §9.1, §12, §13, §14.6, §15, §16, §17; `docs/auraglass-5/autopsy/material-engine.md`; `docs/auraglass-5/autopsy/performance.md`; `docs/auraglass-5/autopsy/runtime-remote.md`; `docs/auraglass-5/autopsy/accessibility.md`; `docs/auraglass-5/AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` (P1–P14, §4.2 gates); `docs/auraglass-5/research/web-glass-techniques.md`; `docs/auraglass-5/research/translucent-a11y-perf.md`; `docs/auraglass-5/research/apple-liquid-glass.md` |
| Related decisions | D-04 (tier vocabulary), D-05 (enhanced opt-in, cinematic in labs), D-06 (variant union), D-07 (thickness axis, no elevation), D-08 (content materials), D-09 (no production downgrade), D-10 (`AuraGlassScript` pre-paint), D-11 (OS floors), D-12 (`clear` without backdrop → `regular`), D-16 (labs), D-19 (4.x bridge), D-20 (attribute names), D-24 (CSS layers, zero `!important`) |
| Related PRDs | PRD-DS (§16 PRD-03, token compiler, upstream), PRD-A11Y (§16 PRD-05: rungs, provider, script, portal root, `LayerStack`), PRD-MOT (§16 PRD-06), PRD-FND (§16 PRD-07/14/16: Base UI integration, T2 core, removal), PRD-CTL/OVL/NAV/DATA/AI/MED (§16 PRD-08..13, consumers), PRD-REL (§16 PRD-01, plus the interim §16 PRD-17 4.2/4.3 bridge), PRD-PKG (§16 PRD-02), PRD-PERF (numeric policy), PRD-DX (§16 PRD-18/20: codemods, compat adapters, docs), PRD-QA (§16 PRD-19 certification infra), PRD-SB (§16 PRD-19 Storybook/Lab harness), PRD-EXP (interim §16 PRD-21 labs), PRD-TRUST (§16 PRD-00) |
| Citation convention | Bare `PRD-NN` in this document means architecture §16 numbering. SC-01 maps it to a key. Cross-PRD task dependencies cite only real task ids from the owner's anchor list (SC-40) and never `PRD-NN` strings |

**Deviation notes (explicit).**
1. File name. Resolved. The PRD file names are the `AURAGLASS_*_PRD.md` files in SC-01, and architecture erratum E-07 corrects §16. No `PRD-04-material-engine.md` pointer is needed.
2. Boundary with PRD-05 (A11Y) and PRD-15. §16 assigns `AuraGlassScript` to PRD-05, and A11Y still owns it (A11Y-032). §16 PRD-15 has no PRD file, so per SC-37 **this PRD is its interim owner**: lens-map generation, `<defs>` markup (`LensDefs`), `data-ag-lens-ready`, the bezel clamp, the kill-switch CSS and test (`tests/material/kill-switches.spec.ts`, MAT-079), `src/material/css/lens.css`, the enhanced certification cell, and the `preview/*` disposition (REQ-MAT-86/87). Engine detection inside `AuraGlassScript` stays with A11Y and is specified here as a contract (§5.6). Requirements owned by another PRD are tagged `[owner: <KEY>]`. They are acceptance inputs for this PRD, not work items.
3. Cinematic. Per D-05/D-16, cinematic is not in `aura-glass` 5.0 core. This PRD defines only the engine contract a cinematic resident must honour (`data-ag-tier`, the owned-pixel rule, the budget). The implementation is interim-owned by PRD-EXP at `packages/labs/`, with tests in `tests/labs/` (SC-37).
4. Private token-keyed attributes. Ratified in the SC-21 registry, which this PRD owns. The private, non-semver, undocumented MAT attributes are exactly `data-ag-sizeclass`, `data-ag-radius`, `data-ag-spacing`, `data-ag-inset`, `data-ag-edge`, `data-ag-edge-style`, `data-ag-lens-ready` and `data-ag-full-height`. `data-ag-lens-defs` is an addition (REQ-MAT-87, PERF-063) that is recorded in §21. Their values are token names or enums, never pixel values. They are excluded from `etc/api/material.css-api.json` and from the public data-attribute contract (REQ-MAT-03, -08, -10, -11, -17, -57).
5. `@property` registry. Architecture §4.4 registers 9 properties. This PRD registers 3 more private scalars (`--_ag-brightness`, `--_ag-rim-width`, `--_ag-grain-opacity`) and adds the pseudo-element `inherit` rule (REQ-MAT-13a). The architecture omits that rule, but `inherits: false` properties set on the host cannot reach `::before`/`::after` without it. The upstream fix is architecture erratum E-02. The registry file is DS compiler output (DS-036), and this PRD consumes it.
6. 4.2 visual fix scope. D-28 names only two fixes: the dark-mode navy text and `prefers-contrast: more`. Scoping the `[class*="glass-"]` 85% black fallback (API-17) in 4.2 extends D-28. It needs the same reviewer approval and before/after composites, and if not approved it ships in 5.0 only. This is still open (§21, owner REL). The `storybook-utility-shim.css` move is **not** a D-28 fix. PKG-101 moves the file to `.storybook/` on the architecture §14.1/§14.4 schedule (global `.flex`/`.grid` are C-D in 4.3 and removed in 5.0). See API-18.
7. Registry alignment (2026-10-06). The following follow `_shared-contracts.md`: paths, script locations (SC-11), API report files (SC-04), compat adapter locations (SC-34), codemod ids (SC-33), lane names (SC-29), test layout (SC-30), Storybook harness (SC-31), budgets (SC-15), layers (SC-20) and the `ScrollEdge` prop name (SC-22). Where this PRD consumes an artifact, it cites the owner and does not re-specify it.
8. Browser floor. Every shipped CSS file is inside `@layer` (D-24). Browsers older than Chrome 99, Safari 15.4 and Firefox 97 therefore receive no AuraGlass styling at all. This is the REQ-PKG-96 baseline (architecture erratum E-09), and this PRD's tier and engine matrix applies only above it.

No screenshot was viewed while writing this PRD. Visual statements are measured (remote runtime evidence) or inferred from code.

---

## 1. Problem

AuraGlass 4.1 has no material engine. It has 9–13 independent glass recipes (MATERIAL-ENGINE-03) that disagree on blur, saturation, fill, radius and fallback, and the visible output depends on which import path a component happened to use. The release-gating metric for 5.0 is **independent glass recipes = 1** (architecture §1.1); today it is about 9–13.

Concretely, four failures make the current glass unfit as a product material:

1. **The adaptive work never reaches the screen.** `LiquidGlassMaterial` computes adaptive tint, contrast tint and the `clear` dimming scrim, then overwrites `background`, `backgroundColor` and `opacity` with constants in its final style merge (MATERIAL-ENGINE-01). Its backdrop sampler still runs observers on every resize, scroll and subtree mutation for 31 consumers (PERFORMANCE-04), at full cost and zero visual effect, and misreads transparent wrappers as black (MATERIAL-ENGINE-08).
2. **The glass is nearly invisible and nearly unreadable.** Remote runtime capture measures the typical computed fill at `rgba(255,255,255,0.02)` plus a 0.106→0.02 white gradient. Mean pixel inside the top glass surface is 255 over white and 19–26 over black (white/black luminance delta median 0.881, max 0.993 across 84 story×viewport pairs; `autopsy/runtime-remote.md:65`). There is no contrast floor; `ContrastGuard` always passes (ACCESSIBILITY-01).
3. **The advertised optics are fake or no-ops.** "GPU refraction" refracts a hardcoded indigo→pink gradient (MATERIAL-ENGINE-02). Houdini worklets are never registered (MATERIAL-ENGINE-04). About 15 "physical" props on `OptimizedGlass` (166–168 consumers) are destructured and discarded (MATERIAL-ENGINE-05). Performance tiers change nothing (PERFORMANCE-03).
4. **Layering is undefined and expensive.** Every surface carries its own `backdrop-filter`, so nested glass samples a near-transparent parent (MATERIAL-ENGINE-06). `allowNestedGlass` and `depth` are stored but never read. Modal, dialog and app-shell stories run 12–29 visible backdrop filters at nesting depth up to 4 and blur up to 40px, dropping to 12–23 fps under scripted hover/scroll while simple stories hold 60 fps (`autopsy/runtime-remote.md:21, 125-145`). Accessibility fallbacks target a hand-maintained class list that omits `.liquid-glass-material` and inline glass (MATERIAL-ENGINE-07), and `glass.generated.css` turns any `[class*="glass-"]` element into an 85% black slab with `!important` on unsupported browsers.

The 5.0 engine must replace all of this with **one material, compiled to CSS once**: components choose a role (layer, variant, thickness) and never choose optics. The engine owns environment, layering, lighting, tier, the solved contrast floor and the fallbacks.

---

## 2. Evidence from the current codebase

All paths exist at `15b6de6f7` unless marked. Line numbers are taken from the verified autopsy (`autopsy/material-engine.md` §8 and the adversarial verification table); where the two verification passes cite slightly different line ranges, both are given. PARTIAL verdicts are honoured: refuted parts are not used as evidence.

### 2.1 The independent recipes (MATERIAL-ENGINE-03, CONFIRMED, counts approximate)

| # | Recipe | Location | Notes |
|---|---|---|---|
| R1 | `glassTokenUtils.buildSurfaceStyles` | `src/tokens/glass.ts:960-1038` | "canonical"; reads only `backdropBlur.px`, `outerShadow`, `highlightOpacity`, `innerGlow` (MATERIAL-ENGINE-09) |
| R2 | `glassTokenUtils.buildBackdropFilter` | `src/tokens/glass.ts:940-955` | `saturate(1.8)`, zero callers |
| R3 | `liquidGlassUtils.buildLiquidGlassStyles` | `src/tokens/glass.ts:1559-1626` (export at `:1457`) | hardcodes 32px blur for every elevation; unconditional `contain: paint` (`:1621-1624`) |
| R4 | `LiquidGlassMaterial` inline overrides | `src/primitives/LiquidGlassMaterial.tsx:338-372, 531-540` | final merge overwrites adaptive output (MATERIAL-ENGINE-01) |
| R5 | `createGlassStyle` (utils) | `src/utils/createGlassStyle.ts:20-84` (fn at `:64`) | own token table; 21 internal importers |
| R6 | `createGlassStyle` (mixins) | `src/core/mixins/glassMixins.ts:41` | same exported name as R5, different material; only this one is public (`src/index.ts:960-964`) |
| R7 | `glassFoundation` | `src/core/foundation/glassFoundation.ts:72, 122, 213, 242` | `rgba(255,255,255,X)` foundation |
| R8 | `theme/materials.ts` | `src/theme/materials.ts:25-55` | 4 materials, `saturate` 150–175% |
| R9 | `glass.generated.css` | `src/styles/glass.generated.css:514` (fallback `:1006-1012`) | per-intent/elevation classes, `saturate(1.8)`; `[class*="glass-"]{background:rgba(0,0,0,.85)!important}` |
| R10 | `glass.css` recipes | `src/styles/glass.css:31-65, 4161, 4489` | `.glass`, `.glass-foundation-complete`, `.glass-premium`, `.liquid-glass-transition-*` |
| R11 | Houdini injected CSS | `src/components/houdini/HoudiniGlassProvider.tsx:528-539` | worklets never registered (`:517-521`) |
| R12 | `OptimizedGlassAdvanced` / `GlassAdvanced` | `src/primitives/glass/OptimizedGlassAdvanced.tsx:414-420`, `src/primitives/glass/GlassAdvanced.tsx` | undefined `backdrop-saturate-*`/`backdrop-brightness-*` classes (MATERIAL-ENGINE-10) |
| R13 | Ad hoc | 26 component `.css` files with `backdrop-filter` (21 of them `*.module.css`, per MATERIAL-ENGINE-07 verification; `rg -l -i backdrop-filter -g '*.css' src/components` = 26) (e.g. `src/components/navigation/GlassPageTabs.module.css:269,280`), 11 inline `backdropFilter:` components | |

Supporting mixin: `src/core/mixins/glassSurface.ts`. Legacy alias: `export const glassUtils = glassTokenUtils` (`src/tokens/glass.ts:1128`).

Measured spread (`rg` over `src/`): 121 files mention `backdrop-filter`/`backdropFilter` (580 occurrences); about 119–139 distinct filter value strings; 15–20 distinct `saturate()` values (1.8 ×97, 1.4 ×64, 1.5 ×34, 160% ×8, …); 22 distinct `blur(Npx)` literals; 0 `@property` registrations in CSS.

### 2.2 Primitive call-site counts (component `.tsx`, non-story/test)

| Primitive | Count | Source |
|---|---|---|
| `<OptimizedGlass>` (`OptimizedGlassCore`, re-exported as `OptimizedGlass` at `src/index.ts:17`, `src/primitives/index.ts:89`) | 166–168 | MATERIAL-ENGINE-05 |
| `<LiquidGlassMaterial>` | 23 component families; 31 importing files | MATERIAL-ENGINE-01 verification |
| `<GlassCore>` / `<Glass>` (`src/primitives/GlassCore.tsx`, exported as `GlassPrimitive`) | 24 | autopsy §2 |
| `createGlassStyle(` (either) | 59 component files calling it (autopsy importer counts, 51 importing from mixins and 21 from utils, count importing files and do not sum to 59); 63 files under `src/components` mention it (non-story/test) | autopsy §2; `rg -l createGlassStyle src/components` |
| `glass-foundation-complete` class | 25 | autopsy §2 |
| `glass-backdrop-blur*` classes | 111, incl. undefined `glass-backdrop-blur-md-medium` ×9 (`src/components/website-components/GlassWipeSliderExamples.tsx:52,73,252,300,443`) | MATERIAL-ENGINE-10 |
| No engine hook at all | 68 | autopsy §2 |

### 2.3 Finding-by-finding evidence

| Finding | Verdict | Evidence used by this PRD |
|---|---|---|
| MATERIAL-ENGINE-01 | CONFIRMED | `combinedStyles` spreads `dynamicStyles` then hard-sets `background`, `backgroundColor: rgba(255,255,255,0.018)`, `opacity` (`LiquidGlassMaterial.tsx:531-540`), discarding adaptive tint (`:379-389`), contrast tint (`:334-336`), clear scrim (`:389-397`), `modifications.opacity` (`:330-332`). Sampling on by default (`adaptToContent = true`, `:148, :156`). `data-liquid-glass-requires-dimming` (`:559-565`) has no CSS reader. The contrast-guard `backdropBlur` override (`:338-351`) survives (overstatement corrected). |
| MATERIAL-ENGINE-02 | CONFIRMED | `captureElementBackdrop` paints `#4f46e5→#7c3aed→#ec4899` (`src/components/advanced/LiquidGlassGPU.tsx:569-604`); exported `src/index.ts:500-502`. |
| MATERIAL-ENGINE-04 | PARTIAL | `addModule` commented out (`HoudiniGlassProvider.tsx:517-521`); `paint()` still assigned (`:396-415`, gated on `enableWorklets`); `registerProperty` with `var()` initial value throws inside a shared try/catch (`:447-452`), so nothing registers. **Refuted parts not used:** surfaces are degraded (background-color survives), not blank; the normal border still renders. |
| MATERIAL-ENGINE-05 | CONFIRMED | `intensity, depth, tint, border, blur, variant, lighting, optimization` destructured (`src/primitives/OptimizedGlassCore.tsx:150-160`) and only reappear in the `__ignore*` strip (`:245-269`); `caustics, chromatic, parallax, refraction, adaptive, magnet, cursorHighlight` become unselected `data-*` (`:298-305`); `glowColor`, `glowIntensity`, `animation` also unused. Radius md=8px inline (`:233`) vs 16px class. |
| MATERIAL-ENGINE-06 | PARTIAL → CONFIRMED in pass 2 | Parent `backdrop-filter` is a Backdrop Root per Filter Effects 2, so child glass samples the parent only. `allowNestedGlass`/`depth` stored, never read (`src/primitives/LiquidGlassLayerProvider.tsx:16-27, 97-102`); `liquid-glass-layered-surface` (`LiquidGlassMaterial.tsx:525`) has no CSS. **Refuted part not used:** `transform: translateZ(0)` and `contain: paint` are not Backdrop Roots; they are removed as waste, not as root causes. |
| MATERIAL-ENGINE-07 | PARTIAL | `.liquid-glass-material` absent from reduced-transparency (`src/styles/glass.css:4022-4044`), forced-colors (`:4073-4097`) and `@supports not` (`:4099-4122`). Corrected outcome: `glass.generated.css:1006-1012` (imported by `src/styles/index.css:11`) paints an 85% black `!important` slab on every `[class*="glass-"]`, including text and icons. |
| MATERIAL-ENGINE-08 | CONFIRMED | `parseRgb` accepts `rgba(0, 0, 0, 0)` (`src/hooks/useLiquidGlassBackdrop.ts:35-50`); `luminanceFor` ignores alpha (`:52-60`); averaging carries but ignores `a` (`:134-145`); observers at `:202-235`. |
| MATERIAL-ENGINE-09 | PARTIAL | Dead: `noiseOpacity`, `enableNoise` (`src/tokens/glass.ts:880-902`), `adaptiveOpacity`, `buildBackdropFilter` (`:940`). **Refuted part not used:** `surface.base`, `border`, `text` are read by other paths (`glassMixins.ts:64, 193-198`; `src/tokens/themeTokens.ts:192-194`). `ior` is a gate only (`LiquidGlassMaterial.tsx:357`); code default 1.33 vs docs 1.43. |
| MATERIAL-ENGINE-10 | CONFIRMED | `src/styles/index.css:25` imports `storybook-utility-shim.css` (224–228 unprefixed rules: `.absolute`, `.flex`, `.backdrop-blur-md`); ships as `./styles` (`package.json:38`). |
| MATERIAL-ENGINE-11 | PARTIAL | `scripts/audit/static-glass-material-audit.js:1385-1404` fails any non-literal `backdropFilter`, producing the duplicated 16/24/32/40/48 ternary ladders (`src/tokens/glass.ts:1002-1021`, `LiquidGlassMaterial.tsx:338-370`). "Forced" is inferred, not proven. |
| MATERIAL-ENGINE-12 | CONFIRMED | `deviceorientation` without `requestPermission` and per-event `setDeviceTilt` (`LiquidGlassMaterial.tsx:273-297`); `transition: all` at `:406, :412` and in base tokens (`src/tokens/glass.ts:1034`). Correct permission pattern exists at `src/components/advanced/GlassOrientationEffects.tsx:128-135`. |
| PERFORMANCE-03 | CONFIRMED (performance autopsy) | Tiers are cosmetic: `blurMultiplier: 1.0` everywhere (`src/tokens/glass.ts:874-904`); `--aura-blur-amount` never consumed (`src/core/productionCore.ts:196-200`). |
| PERFORMANCE-04 | CONFIRMED | Always-on sampling, subtree MutationObserver, scroll/resize/ResizeObserver, permanent `will-change` incl. `backdrop-filter` in `LiquidGlassMaterial.tsx:156-157, 444-447`. |
| MOTION-09 | per crosswalk | `transition: all` and animated `backdrop-filter` on default surfaces (`src/tokens/glass.ts:1034-1036`). |

### 2.4 Assets to keep (autopsy §3)

- The accessibility media policy in `src/styles/glass.css:4022-4123` (re-keyed to `[data-ag-surface]`).
- "Glass is never disabled, only reduced" (`src/tokens/glass.ts:871-873`) and the optically-clear taste note (`:998-1001`).
- The scroll-edge, concentric-frame and source-transition primitives (`src/styles/glass.css:4425-4486`; `src/primitives/LiquidGlassScrollEdge.tsx`, `src/primitives/LiquidGlassConcentricFrame.tsx`), which become `ScrollEdge` and `ConcentricFrame`.
- The token→CSS generator direction (`scripts/generate-glass-css-from-tokens.ts`), superseded by the PRD-03 compiler.
- The context-aware primitive *shape* of `LiquidGlassMaterial` (`:189-196, 556-565`), re-expressed as CSS attribute selectors with no runtime context.

### 2.5 Runtime evidence (remote, `autopsy/runtime-remote.md`)

- Fill ≈ `rgba(255,255,255,0.02)`; white/black luminance delta median 0.881, max 0.993 (`:65`).
- Forced colors: `liquid-glass-material` keeps 1 → 1 visible backdrop filter (`:113-120`).
- Density: median 3 visible filters per story; state matrix 51; app shells 21–29; collaborative workspace 18; nesting depth 4; max blur 40px (`:138-145`).
- FPS: glass-modal 12, glass-dialog 13–14, AI command center shell 19, SaaS shell 21–23 vs 60 on simple stories (software raster; the relative 5× gap is the signal, `:125-134`).

---

## 3. Desired end state

At 5.0 GA:

1. **One recipe.** Every pixel of glass in `aura-glass` comes from compiled `material.css` rules under `@layer ag.material`, keyed on `.ag-surface` and `data-ag-*`. The CI metric `independent-glass-recipes` reports **1**. No file outside `src/material/**` (and the compiler output directory) contains `backdrop-filter`, `backdropFilter`, `-webkit-backdrop-filter`, `rgba(255,255,255,…)`, a `blur(Npx)` literal or a specular gradient.
2. **One public material surface.** `aura-glass/material` exports `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps()`, `useMaterialTier()` and the types in architecture §4.2; `defineMaterial()` is a build-time helper exported from the same entry (architecture §3.2). Every server-safe export renders in a React Server Component with no provider.
3. **No inline optics, ever.** `Surface` and `materialProps()` emit only `className="ag-surface"` and `data-ag-*` attributes. MATERIAL-ENGINE-01 is structurally impossible because there is no JS style to merge.
4. **Declared environment.** Backdrop luminance class comes from `data-ag-backdrop` (`light | dark | media | auto`) inherited through CSS. No runtime DOM sampling ships. `clear` without a declared backdrop renders as `regular` and warns in development (D-12).
5. **Defined layering.** The fixed six-layer stack (§4.4) on one host plus two pseudo-elements; blur on `::before`; nested glass collapses to the inner material in CSS alone; `SurfaceGroup` owns one backdrop for its children; content-layer surfaces use non-backdrop content materials by default (D-08).
6. **Four tiers, one vocabulary** (`lightweight`, `standard`, `enhanced`, `cinematic`; D-04) with design budgets enforced by component design, dev-time counters and certification, and **no production auto-downgrade** (D-09). Tier and engine are resolved **before first paint** from `<html data-ag-engine data-ag-tier>` written by `AuraGlassScript` (D-10). `enhanced` is opt-in Chromium SVG edge refraction (D-05). `cinematic` exists only in `@auraglass/labs` over library-owned pixels (D-16).
7. **Readable by construction.** Opacity floors are solved at build time by the PRD-03 three-composite gate; the user `--ag-glass-opacity` dial can only raise alpha; OS signals are floors (D-11) and the `ag.a11y` rungs reach every surface because every surface carries `data-ag-surface`.
8. **Optics are honest.** Every documented optical property (blur, saturation, brightness, tint, transparency, grain, rim/edge light, Fresnel rim, specular reflection, refraction, shadow, layer interaction) maps to a named `MaterialSpec` field and a CSS rule that a test can observe. No accepted prop is a no-op.
9. **Lint keeps it that way.** `auraglass/no-optics-outside-material` fails CI on any regression.

---

## 4. Architecture

### 4.1 Pipeline

```
tokens/{ref,sys,…}/<group>.tokens.json (DTCG; compiler scripts/tokens/build.mjs, DS-016)
  └─ material composite ($type "glass-material")  ──▶  Style Dictionary transforms [owner: DS, DS-048]
        glass-material → material.css ladders (variant × thickness × tier, literal -webkit-)
        contrast-solve → opacityFloor table (generated, committed, diffed)
        → @property registry, TS constants (aura-glass/tokens), Tailwind @utility bridge
                                   │
src/material/** (this PRD)         ▼
  Surface / SurfaceGroup / Environment / ScrollEdge / ConcentricFrame / materialProps
  → class + data-ag-* only  ──▶  .ag-surface rules in @layer ag.material
                                   │
<html data-ag-engine data-ag-tier data-ag-transparency …>  [writer: AuraGlassScript, A11Y-032]
  → tier gates in ag.material; preference rungs in ag.a11y [owner: A11Y]
  → enhanced: backdrop-filter:url(#ag-lens-<shape>-<sizeclass>) [maps + LensDefs: this PRD, interim §16 PRD-15]
```

Layer order (D-24, SC-20): every shipped CSS file, `material.css` and `lens.css` included, starts with exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;`. There is no variant of this statement. Zero `!important`. This PRD owns the content of `ag.material` only. PKG owns the statement, `ag.reset` and `styles.css` assembly; DS owns `ag.tokens` and `compat/tokens.css`; A11Y owns `ag.a11y`.

### 4.2 Concept chain (architecture §4.1)

`Environment → Layer → Material (variant × thickness, derived inner) → Lighting → Tier → Contrast floor → Fallback`. Each stage maps to exactly one mechanism:

| Stage | Input | Mechanism | Owner |
|---|---|---|---|
| Environment | `data-ag-backdrop` on any ancestor | inherited custom properties `--_ag-env-*` selected by `[data-ag-backdrop=…]` blocks | PRD-04 |
| Layer | `data-ag-layer` | per-layer defaults: chrome/overlay/transient = glass; content = content material; z from `layer.z.*` | PRD-04 |
| Material | `data-ag-variant`, `data-ag-thickness`, `data-ag-content`, nesting context | compiled ladders; descendant selector collapse | PRD-04 (+ PRD-03 values) |
| Lighting | `--ag-light-angle`, `--ag-specular`, `data-ag-interactive`, `data-ag-prominent` | `::after` rim + sheen; state modulates pseudo-layer opacity | PRD-04 (pointer light: PRD-06) |
| Tier | `<html data-ag-tier>`, subtree `data-ag-tier`, `data-ag-engine`, `data-ag-refraction` | tier-gated rule blocks; lens filter reference | PRD-04 CSS and lens maps (interim §16 PRD-15), A11Y script |
| Contrast floor | solved `opacityFloor` | `--_ag-tint-floor` per (transparency × thickness × backdrop) | PRD-03 solve, PRD-04 consumption |
| Fallback | `@supports`, media queries, `data-ag-transparency`, `data-ag-contrast` | `ag.a11y` rungs on `[data-ag-surface]` | PRD-05 (rule bodies), PRD-04 (coverage guarantee) |

### 4.3 Source layout of `src/material/**` (all NEW)

| Path | Responsibility | RSC |
|---|---|---|
| `src/material/types.ts` | `MaterialVariant`, `Thickness`, `Layer`, `ContentMaterial`, `Backdrop`, `Tier`, `Transparency`, `Shape`, `MaterialRole`, `SurfaceProps`, `MaterialSpec`, `RadiusToken`/`SpaceToken` re-exports from `aura-glass/tokens` | types only |
| `src/material/materialProps.ts` | pure `materialProps(role)` → class + `data-ag-*`; delegates to `resolveRole` | server |
| `src/material/internal/resolveRole.ts` | internal `resolveRole(role, sizeClass?)`: default resolution table (REQ-MAT-03), `data-ag-sizeclass`/`data-ag-radius`; imported by library components, **not** re-exported from `aura-glass/material` | server |
| `src/material/Surface.tsx` | `Surface` (`render` element ownership, ref-as-prop, no hooks) | server |
| `src/material/SurfaceGroup.tsx` | `SurfaceGroup` (`data-ag-group`, `--ag-group-spacing`) | server |
| `src/material/Environment.tsx` | `Environment` (`data-ag-backdrop`; optional `image`/`video` render as library-owned media layer that self-declares) | server |
| `src/material/ScrollEdge.tsx` | `ScrollEdge` (`edge`, `edgeStyle`; SC-22 erratum, not `style`) | server |
| `src/material/ConcentricFrame.tsx` | `ConcentricFrame` (`--ag-radius-outer`, `--ag-inset`) | server |
| `src/material/useMaterialTier.ts` | `useMaterialTier()` via `useSyncExternalStore` on `<html data-ag-tier>` (MutationObserver on `<html>` attributes only), server snapshot `'standard'` | `"use client"` |
| `src/material/defineMaterial.ts` | build-time `defineMaterial(spec)` validator + defaults; exported from `aura-glass/material` (architecture §3.2, no separate subpath), pure and side-effect free so runtime bundles tree-shake it | build only |
| `src/material/css/material.css` | hand-authored structural rules (layer stack, nesting, group, content, shape, scroll edge) importing compiler output | n/a |
| `src/material/css/generated/ladders.css` | DS compiler output (DS-049): `[variant][thickness][tier]` optics with literal `-webkit-backdrop-filter` (~18 rules); never hand-edited here (SC-18, OV-31) | generated |
| `src/material/css/generated/properties.css` | DS compiler output (DS-036): `@property` registry (REQ-MAT-13) | generated |
| `src/material/css/generated/floors.css` | DS compiler output (DS-059): solved `--_ag-tint-floor` table | generated |
| `src/material/css/lens.css` | enhanced-tier selectors referencing `url(#ag-lens-*)` (this PRD, interim §16 PRD-15) | n/a |
| `src/material/lens/LensDefs.tsx` | internal server-safe component that renders the 9-id `<svg data-ag-lens-defs data-ag-lens-ready>` `<defs>` block (REQ-MAT-87); mounted by `AuraGlassProvider` [owner of the mount point: A11Y] | server |
| `src/material/assets/lens/ag-lens-<shape>-<sizeclass>.png` | 9 precomputed displacement maps generated by `scripts/build/lens-maps.mjs` (REQ-MAT-86) | asset |
| `src/material/dev/surfaceCounter.ts` | dev-only budget counter consumed by `AuraGlassProvider` (stripped from production via `process.env.NODE_ENV` guard) | client, dev |
| `src/material/dev/warnings.ts` | dev warnings: nesting depth ≥2 with `allowNested`, `clear` without backdrop, budget exceeded, `refraction` on non-chrome | client, dev |
| `src/material/index.ts` | entry for `aura-glass/material` (no directive on barrel) | mixed |
| `src/material/assets/ag-grain-128.avif` | static grain, 128×128, ≤4 KB | asset |

### 4.4 Layer model (one host, two pseudo-elements, no extra DOM)

| # | Layer | Where | Rule |
|---|---|---|---|
| 1 | Backdrop optics | `::before`, `z-index:-1` | `backdrop-filter: blur(var(--_ag-blur)) saturate(var(--_ag-saturation)) brightness(var(--_ag-brightness))` plus literal `-webkit-backdrop-filter` per ladder cell. On the pseudo-element so the host is never a Backdrop Root for portaled or descendant overlays |
| 2 | Grain | `::before` `background-image: url(ag-grain-128.avif)` at `--_ag-grain-opacity` 0.02–0.04 | never on the host (blend modes create Backdrop Roots) |
| 3 | Tint and fill | host `background: var(--_ag-fill)` | paints beneath `::before` within the host's isolated stacking context |
| 4 | Rim, edge light, specular | `::after`, `pointer-events:none` | `mask-composite: exclude` gradient border band of width `--_ag-rim-width`; sheen oriented by `--ag-light-angle` |
| 5 | Inner depth | `::after` inset `box-shadow` | |
| 6 | Outer shadow | host `box-shadow: var(--_ag-shadow)` | derived from layer × thickness (D-07); dropped under forced colors |

Host baseline: `position:relative; isolation:isolate; border-radius:var(--ag-surface-radius); color:var(--ag-on-surface)`. Never on a default surface: `transform: translateZ(0)`, `will-change`, `contain: paint`, `transition: all`, host `opacity < 1`, host `filter`. `will-change: opacity, transform` appears only under `[data-ag-animating]`.

### 4.5 Nested-glass rule and groups

```css
@layer ag.material {
  /* Nested → inner material. CSS only; Surface stays a server component. */
  .ag-surface .ag-surface:not([data-ag-allow-nested])::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .ag-surface .ag-surface:not([data-ag-allow-nested]) { --_ag-fill: var(--_ag-inner-fill); }
  /* SurfaceGroup owns ONE backdrop. */
  [data-ag-group]::before { /* compiled optics for the group's variant/thickness */ }
  [data-ag-group] > .ag-surface::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
  /* Content materials never blur. */
  .ag-surface[data-ag-layer=content]:not([data-ag-variant])::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
}
```

Portaled overlays render into the single `[data-ag-portal-root]` (A11Y-049/051; the accessor is FND's `usePortalContainer()`, FND-007; SC-25), so they are not descendants of a page surface and stay full glass. Disabled surfaces dim through `--_ag-surface-alpha` applied to fill and pseudo-layers, never host `opacity`.

State-driven opacity (P10), keyed on Base UI state attributes: `[data-ag-layer=overlay][data-open]` uses the overlay floor row; `[data-expanded]` raises the floor one step; a modal adds the `scrim` (full-viewport, blur ≤12px); a full-height sheet resolves `tinted`.

### 4.6 Tiers

| Tier | Renders | Gate (pre-paint) | Design budget per viewport |
|---|---|---|---|
| lightweight | `fallbackFill` ≥0.85 alpha + rim + shadow; `backdrop-filter:none` | `@supports not (backdrop-filter: blur(1px))`, transparency `solid`, forced colors, explicit `data-ag-tier=lightweight`, or script low-power hint (`saveData`, or `deviceMemory ≤ 2` with `(pointer:coarse)`) | unlimited |
| standard (default, SSR) | layers 1–6, static specular, grain | default; no attribute required | ≤6 blurred surfaces at `(hover:hover) and (pointer:fine)`, ≤3 at `(pointer:coarse)`; blur ≤32px; full-viewport blur only on `scrim` at ≤12px; blur radius never animated |
| enhanced | standard + SVG edge refraction via `backdrop-filter:url(#ag-lens-<shape>-<sizeclass>) blur(…)`, displacement clamped to bezel 12/16/24px | `html[data-ag-engine=chromium]` and `[data-ag-refraction]` on a flagship chrome surface and effective transparency `glass` and motion ≠ `none` and lens `<defs>` mounted | ≤2 refracting surfaces, each ≤25% viewport area |
| cinematic | WebGL refraction/dispersion/Fresnel over library-owned pixels only | explicit labs component | 1 WebGL context per page; paused offscreen and when `document.hidden` |

Engine matrix (above the `@layer` floor in deviation note 8): Chromium → up to enhanced; WebKit (Safari 18/26/27) → standard with stronger rim/highlight band (displacement unsupported, WebKit bug 245510); Gecko → standard, detected by engine (Firefox parses `url()` in `backdrop-filter` and renders nothing, and `@supports` passes); any engine + forced colors → lightweight; no `backdrop-filter` → lightweight.

Kill switches (architecture §14.6; CSS and certification owned here as interim §16 PRD-15 owner, SC-37): `AuraGlassProvider tier="standard"` (prop owned by A11Y), `data-ag-tier="standard"` on any subtree, `data-ag-transparency="tinted|solid"` on any subtree.

### 4.7 Boundary with neighbouring PRDs

- DS supplies token values, ladders, the solved floor table, the `@property` registry and the Tailwind `@utility` bridge, all generated from the same rules (DS-036/048/049/059/090). PRD-04 supplies the `MaterialSpec` type, the structural CSS and the consumption selectors. It never hand-edits `src/material/css/generated/*` (OV-31).
- A11Y owns `AuraGlassScript`, `AuraGlassProvider`, `usePreference`, the portal root, `LayerStack` and the `ag.a11y` rung bodies. PRD-04 guarantees that every surface carries `data-ag-surface` and that its custom properties are the ones the rungs override.
- MOT owns `pointerLight` (MOT-042) and the View Transition optics drop (MOT-045..047). PRD-04 exposes `--ag-light-angle` and `--ag-specular` as the only animatable optics, plus `[data-ag-animating]`.
- §16 PRD-15 (enhanced tier) has no PRD file. **This PRD is its interim owner** (SC-37) and holds lens-map generation, `LensDefs`, `data-ag-lens-ready`, the bezel clamp, kill switches, the enhanced certification cell and the `preview/*` disposition. Lens motion is **static scale**, with no JS attribute writes (D-09; architecture erratum E-10). PRD-04 also owns the `data-ag-refraction` attribute, the eligibility selector and standard-equivalent rendering before the defs mount. The runtime budget spec for lenses is PERF's (PERF-063).
- PRD-EXP (interim §16 PRD-21) owns `@auraglass/labs` and the cinematic resident. PRD-04 defines the contract in REQ-MAT-60..62.
- SB owns `.storybook/preview.tsx` (SB-048), the Lab harness `.storybook/lab/**` (SB-060..069) and the Material Lab titles and order (REQ-SB-18). PRD-04 writes the story files in `src/material/stories/` (SC-31).
- QA owns the lanes (L1..L14), `certification/playwright.cert.config.ts`, the `certify-*.yml` workflows and the 8 scenes in `certification/scenes/` (SC-28/29). PRD-04 adds a `material` Playwright project by MODIFY and supplies the subjects.
- PKG owns `build/exports.manifest.json`, `docs/size-budgets.json`, the side-effect gate, `glass-pipeline.yml`, the layer statement and `src/styles/index.css`. PRD-04 submits rows and steps by MODIFY.

---

## 5. Exact implementation requirements

Each requirement is testable; the test that proves it is named in §12. "Surface" means any element produced by `Surface` or `materialProps()`.

### 5.1 Public API and element contract

- **REQ-MAT-01** `aura-glass/material` exports exactly these values: `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps`, `useMaterialTier`; and the types `MaterialVariant`, `Thickness`, `Layer`, `ContentMaterial`, `Backdrop`, `Tier`, `Transparency`, `Shape`, `MaterialRole`, `SurfaceProps`, `MaterialSpec`. `defineMaterial` is exported from the same `aura-glass/material` entry, as architecture §3.2 lists it. It is a pure build-time helper with no side effects, so runtime bundles that do not import it tree-shake it away. There is no `aura-glass/material/define` subpath, because SC-12 says entries are exactly architecture §3.2. The API report `etc/api/material.api.md` and the export snapshot `etc/api/material.exports.json` are the frozen contract. REL's `scripts/release/api-report.mjs` and `scripts/release/export-snapshot.mjs` generate them (SC-04; TRUST-071/072, REL-003).
- **REQ-MAT-02** `materialProps(role)` is a pure function: same input → deeply equal output, no access to `window`, `document`, React or context. It returns `className: 'ag-surface'`, `'data-ag-surface': ''`, `'data-ag-layer'` always, and the optional attributes in architecture §4.2 only when the role sets them or a default applies.
- **REQ-MAT-03** Default resolution (in `resolveRole`): `layer` defaults to the caller's value, else `chrome`; `variant` defaults to `regular` (omitted from output when `layer=content` and no explicit variant); `content` defaults to `content-raised` when `layer=content`; `shape` defaults to `fixed`. `thickness`: explicit value wins; otherwise library components pass their internal size class to `resolveRole(role, sizeClass)` (`control→thin`, `bar→regular`, `panel→regular`, `sheet→thick`); public `materialProps(role)` with no thickness resolves `regular`. When `refraction` is set, `data-ag-sizeclass` is the passed size class, else derived from thickness (`thin→control`, `regular→bar`, `thick→panel`). `fallbackRadius` is emitted as private `data-ag-radius=<token name>` (deviation note 4).
- **REQ-MAT-04** `Surface` renders a `<div>` by default, or clones `render` (Base UI-style element ownership) merging `className` with `clsx` (allowlisted, D-29; not the 4.x `cn` copies in `src/lib/utilsComprehensive.ts`/`src/design-system/utilsCore.ts`) and attributes with consumer-wins precedence for non-`data-ag-*` attributes; `data-ag-*` from the role always win. `as` is not accepted (TS error). `ref` is a prop (React 19), forwarded to the rendered element.
- **REQ-MAT-05** `Surface` emits **no** `style` attribute unless the consumer passes `style`, in which case the consumer object is passed through by reference and never merged with optics. Snapshot test asserts `style` is `undefined` for every role in the 3 × 3 × 4 role matrix.
- **REQ-MAT-06** `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` and `materialProps` contain no hooks, no context, no effects and no `"use client"`; each renders through `react-dom/server` `renderToString` in a Node environment with no DOM globals and no provider. `useMaterialTier.ts` is the only material module with `"use client"`.
- **REQ-MAT-07** `useMaterialTier()` returns the current `<html data-ag-tier>` value (`lightweight | standard | enhanced`; the `Tier` return type also admits `cinematic`, which core never returns) via `useSyncExternalStore`; server snapshot `'standard'`; updates within one task when the attribute changes; unknown values resolve to `'standard'`. Its `MutationObserver` (`attributeFilter: ['data-ag-tier']` on `<html>`) is created on first subscribe and disconnected when the last subscriber unmounts; it is the only observer in production material code.
- **REQ-MAT-08** `SurfaceGroup` renders one element with `data-ag-group` and the group's own `.ag-surface` optics (it is itself a `chrome`, `regular`-variant, `regular`-thickness surface; architecture §4.2 gives it only `spacing` and `children`, so no `variant`/`thickness` props are added), emits private `data-ag-spacing=<SpaceToken name>` (default `2`) from which generated CSS sets `--ag-group-spacing` (no inline style), and is the only owner of a `backdrop-filter` among its direct `.ag-surface` children.
- **REQ-MAT-09** `Environment` always sets `data-ag-backdrop` to the required `backdrop` prop, except that `backdrop="auto"` together with `image` or `video` resolves to `media`. With `image` or `video`, it renders a library-owned media layer (`<img decoding="async" alt="">` or `<video muted playsinline>` (autoplay/pause policy under reduced motion and WCAG 2.2.2 is owned by PRD-13), `aria-hidden="true"`) behind its children. It performs no pixel sampling; owned-pixel luminance sampling is PRD-13's `Backdrop` responsibility.
- **REQ-MAT-10** `ScrollEdge` takes `edge: 'top'|'bottom'` and `edgeStyle: 'soft'|'hard'` (default `soft`). The prop is `edgeStyle`, not `style`, because `style` collides with React's style attribute (SC-22; architecture erratum E-01). `ScrollEdge` renders `<div aria-hidden="true" data-ag-part="scroll-edge" data-ag-edge="top|bottom" data-ag-edge-style="soft|hard">`, implemented as a `mask-image` gradient over the scroll container's sticky edge, with no `backdrop-filter` and no JS. The documented rule is at most one per view. `TopBar`, `Toolbar` and `TabBar` render it automatically [owner: NAV].
- **REQ-MAT-11** `ConcentricFrame` emits private `data-ag-radius=<RadiusToken name>` and `data-ag-inset=<SpaceToken name>`, from which generated CSS sets `--ag-radius-outer` and `--ag-inset` (no inline style), and pads its content by `--ag-inset`; descendants with `data-ag-shape="concentric"` compute `border-radius: var(--ag-radius-inner)` where `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))`. `capsule` resolves to `9999px`. Outside a `ConcentricFrame` (no inherited `--ag-radius-outer`, detected by `var()` fallback), `concentric` falls back to `fallbackRadius` (default `md`, `sys.radius.md` 14px per architecture §5.2; value owned by PRD-03).
- **REQ-MAT-12** The deleted 4.x optical props (`caustics`, `chromatic`, `lighting`, `ior`, `tier`, `depth`, `tint`, `glowIntensity`, `glowColor`, `optimization`, `hardwareAcceleration`, `intensity`, `blur`, `parallax`, `adaptive`, `magnet`, `cursorHighlight`) are absent from `SurfaceProps`; passing one is a TS error. `refraction` stays in `MaterialRole` with its 5.0 boolean meaning, so a 4.x non-boolean `refraction` value is a TS error but `refraction` itself is not. In `aura-glass/compat` (adapters in `src/compat/material/*.tsx`, re-exported by DX's `src/compat/index.ts`; SC-34) they are accepted and dropped, with one dev warning through REL's `warnDeprecated(id)` (REL-072). The exception is `adaptive`, which maps to `data-ag-backdrop="auto"` (architecture §14.3) and therefore renders `regular` for `clear` (REQ-MAT-45).

### 5.2 CSS custom-property and data-attribute contracts

- **REQ-MAT-13** `properties.css` registers with `@property` exactly: `--ag-light-angle <angle> inherits 300deg`, `--ag-specular <number> no-inherit 0.5`, `--ag-glass-opacity <number> inherits 0`, `--_ag-blur <length> 0px`, `--_ag-saturation <number> 1`, `--_ag-brightness <number> 1`, `--_ag-tint-floor <number> 0.6`, `--_ag-dim <number> 0`, `--_ag-surface-alpha <number> 1`, `--_ag-refraction-scale <number> 0`, `--_ag-rim-width <length> 1px`, `--_ag-grain-opacity <number> 0.03`. Every initial value is computationally independent (the 4.x Houdini `var()` initial-value bug cannot recur). `--_ag-brightness`, `--_ag-rim-width`, `--_ag-grain-opacity` are additions to architecture §4.4 (deviation note 5); all private ones are `inherits: false`.
- **REQ-MAT-13a** Pseudo-element inheritance. `::before`/`::after` inherit from their host, so a non-inheriting registered property set on the host would resolve to its initial value inside the pseudo-element (e.g. `--_ag-blur: 0px`, `--ag-specular: 0.5` regardless of hover). `material.css` therefore declares `.ag-surface::before, .ag-surface::after { --_ag-blur: inherit; --_ag-saturation: inherit; --_ag-brightness: inherit; --_ag-dim: inherit; --_ag-surface-alpha: inherit; --_ag-refraction-scale: inherit; --_ag-rim-width: inherit; --_ag-grain-opacity: inherit; --ag-specular: inherit; }` and ladders set these on the host. `inherits: false` still prevents a nested surface from inheriting its parent's values. Verified by `tests/material/layer-stack.spec.ts`: `::before` computed `--_ag-blur` equals the ladder value (not `0px`), and `::after` computed `--ag-specular` changes on `[data-ag-interactive]:hover`.
- **REQ-MAT-14** Public read-outs are set on every `.ag-surface`: `--ag-surface-fill`, `--ag-surface-rim`, `--ag-surface-shadow`, `--ag-surface-radius`, `--ag-on-surface`, `--ag-on-surface-muted`. Consumer CSS reading them inside a surface gets the resolved value for the current variant × thickness × scheme × transparency.
- **REQ-MAT-15** Tint formula on `.ag-surface`: `--_ag-alpha: min(1, max(var(--_ag-tint-floor), calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity))))`; `--_ag-fill: oklch(from var(--ag-color-canvas) l c h / var(--_ag-alpha))`. For any `--ag-glass-opacity` value, computed alpha ≥ the solved floor and ≤1; values <0 are clamped to the floor by `max()`, values >1 to 1 by `min()` (the outer `min(1, …)` is an explicit addition to architecture §4.4, which relied on implicit colour-alpha clamping).
- **REQ-MAT-16** `--ag-*` names in `etc/api/material.css-api.json` (NEW, generated by `scripts/release/material-css-api.mjs`, next to the SC-04 API reports) are semver-stable public; `--_ag-*` are private. A CI check fails if a public name is removed or renamed without a root `deprecations.json` entry of kind `css-var` (schema and gate owned by REL: `docs/schemas/deprecations.schema.json`, `scripts/release/verify-deprecations.mjs`; SC-02/03).
- **REQ-MAT-17** Data attributes and allowed values are exactly the SC-21 registry, which this PRD owns (architecture §4.5 plus ratified additions; erratum E-03). The engine reads but never writes `data-ag-engine`, `data-ag-tier` (on `<html>`), `data-ag-scheme`, `data-ag-contrast`, `data-ag-transparency`, `data-ag-motion` and `data-ag-density`. It writes only the surface attributes, `data-ag-group`, `data-ag-backdrop` (via `Environment`), `data-ag-part` and the private MAT attributes: `data-ag-sizeclass`, `data-ag-radius`, `data-ag-spacing`, `data-ag-inset`, `data-ag-edge`, `data-ag-edge-style`, `data-ag-lens-ready`, `data-ag-full-height`, plus `data-ag-lens-defs` (REQ-MAT-87). The private attributes are not semver and are undocumented. Subtree `data-ag-tier` and `data-ag-transparency` on any ancestor override `<html>` for that subtree. `data-ag-material` is banned (D-20), and a unit test asserts that no material module emits it. Other PRDs' ratified additions, for example MED's `data-ag-media-tone` and MOT's `data-ag-offscreen`, are registered in SC-21. Material CSS never selects them.
- **REQ-MAT-18** No material CSS selects any 4.x hook (`data-theme`, `data-aura-theme`, `data-persona`, `.glass-on-light`, `.dark`, `[class*="glass-"]`, `.liquid-glass-*`, `.optimized-glass-*`). The exception is `@layer ag.compat` in `compat/tokens.css` [owner: DS] and `compat/globals.css` [owner: PKG] (SC-34).
- **REQ-MAT-19** `material.css` and `lens.css` start with the exact SC-20 order statement. They contain zero `!important` and zero unlayered rules: every rule is inside `@layer ag.material`, except `@property`, which is layer-agnostic.
- **REQ-MAT-20** `[data-ag-preview="v5"]` (4.3 only, D-19): the same compiled `ladders.css` applies to the six 4.x primitives (`OptimizedGlassCore`, `LiquidGlassMaterial`, `GlassCore`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassEffectGroup`) once they emit `data-ag-surface` + role attributes. No second recipe is authored for 4.x. This PRD owns `src/material/css/preview-v5.css` (MAT-101). REL holds the 4.3 train scope and gates (REQ-REL-27; SC-37), and its Storybook `preview` toolbar global (REL-118) depends on MAT-101.

### 5.3 Layer model and nested-glass rule

- **REQ-MAT-21** Every surface's `backdrop-filter` is on `::before` only. Computed style of the host has `backdrop-filter: none` in every tier and engine.
- **REQ-MAT-22** Default surfaces have computed `transform: none`, `will-change: auto`, `contain: none`, `opacity: 1`, `filter: none`, and no `transition-property` containing `all`, `backdrop-filter` or `filter`. `will-change: opacity, transform` appears only under `[data-ag-animating]`.
- **REQ-MAT-23** Nested rule: for a `.ag-surface` descendant of another `.ag-surface` without `data-ag-allow-nested`, `::before` computed `backdrop-filter` and `-webkit-backdrop-filter` are `none` and `--_ag-fill` equals `--_ag-inner-fill`. Exception: an element portaled into `[data-ag-portal-root]` (A11Y; SC-25), as overlays are, is not a descendant and keeps full optics.
- **REQ-MAT-24** `allowNested` sets `data-ag-allow-nested`, and the nested surface keeps its own `::before` optics. In development, `allowNested` at nesting depth ≥2 logs `[aura-glass] allowNested at depth N at <selector>` once per element via `dev/warnings.ts`. The dev counter detects depth by walking `closest('.ag-surface')`. The message matches PERF's `/allowNested at depth \d/` (PERF tightening request, accepted).
- **REQ-MAT-25** Group rule: direct `.ag-surface` children of `[data-ag-group]` have `::before` `backdrop-filter: none`; the group's own `::before` carries the one backdrop. Children keep tint, rim, specular and shadow. Visible backdrop-filter count for a 5-control `SurfaceGroup` toolbar is 1.
- **REQ-MAT-26** Content rule (D-08): `layer=content` without explicit `variant` renders `content-raised` or `content-sunken` — an opaque OKLCH fill from `MaterialSpec.content`, rim, grain (at `::before` with `backdrop-filter:none`) and shadow. Glass on content requires an explicit `variant` and is documented as "over media only".
- **REQ-MAT-27** Disabled: `[data-disabled]` or `[aria-disabled=true]` surfaces set `--_ag-surface-alpha: var(--ag-state-disabled-alpha)` applied to fill alpha and pseudo-layer opacity; host `opacity` stays 1 (REQ-MAT-22).
- **REQ-MAT-28** State-driven opacity: `[data-ag-layer=overlay][data-open]` uses the overlay floor row; `[data-expanded]` raises the floor to the next thickness row; `[data-ag-layer=overlay][data-modal]` (set by Dialog/AlertDialog) renders a scrim sibling with `MaterialSpec.scrim.modal` alpha and blur ≤12px; a sheet with `data-ag-full-height` resolves to `tinted`. All keyed on Base UI's own state attributes plus these material attributes.

### 5.4 Optical property specifications

Initial values come from `MaterialSpec` (architecture §4.3); PRD-03 owns the numbers, PRD-04 owns where and how they apply. Each optic maps to one spec field and one CSS location. Anything not listed is out of scope for core.

| REQ | Optic | Spec field | CSS location and rule | Tier availability |
|---|---|---|---|---|
| **REQ-MAT-29** | Blur | `blur.{thin 12, regular 20, thick 32}px`, cap 32 | `::before backdrop-filter: blur(--_ag-blur)`; group blur on group `::before`; scrim ≤12px. Blur radius is never transitioned or animated. No value >32px reachable from any role | standard, enhanced |
| **REQ-MAT-30** | Saturation | `saturation` one value (≈1.6) | `saturate(var(--_ag-saturation))` in the same filter list; one value replaces the 15–20 literals. `contrast=more` sets saturation 1 [rung body: PRD-05; this row defines the required value] | standard, enhanced |
| **REQ-MAT-31** | Brightness | `brightness` (≈1.0–1.08 light, 0.9–1.0 dark) | `brightness(var(--_ag-brightness))` in the filter list, scheme-resolved | standard, enhanced |
| **REQ-MAT-32** | Tint | `tint.{light,dark,media}` OKLCH+alpha derived from `sys.color.canvas` via relative colour | host `background: var(--_ag-fill)` (REQ-MAT-15). Intent never tints the fill; only the rim/specular, or the one `prominent` surface per view, which mixes `--ag-color-accent` into the fill at ≤0.18 alpha | all |
| **REQ-MAT-33** | Transparency | `opacityFloor[transparency][thickness][backdrop]` (solved) | `--_ag-tint-floor` selected by `[data-ag-thickness]` × inherited `[data-ag-backdrop]` × resolved transparency. `tinted` raises to the tinted row and disables refraction; `solid` → lightweight rung | all |
| **REQ-MAT-34** | Noise / grain | `grain.opacity` 0.02–0.04, `grain.asset` | `::before background-image: url(ag-grain-128.avif)`, `background-size:128px`, opacity via `--_ag-grain-opacity`; never `mix-blend-mode` on the host; removed under `contrast=more`, forced colors and `solid` | standard, enhanced, lightweight (grain kept, ≤0.02) |
| **REQ-MAT-35** | Edge lighting (rim) | `rim.width.{thin 1, regular 1, thick 1.5}px`, `rim.light`, `rim.shade` | `::after` border band via `mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; padding: var(--_ag-rim-width)` with `background: conic-gradient(from var(--ag-light-angle), rim.light, rim.shade, rim.light)`. Must render in all three engines | all |
| **REQ-MAT-36** | Fresnel rim | `rim.light`, `specular.spread` | Approximated in core as edge-brightening: a second, unmasked `::after` background layer `radial-gradient` anchored on the edge facing `--ag-light-angle`, fading to transparent within 8px of the edge, so the lit edge is brighter than the opposite edge. Measurable: over the flat-black scene, mean 8-bit luminance of the 4px inner band on the lit side exceeds the opposite side by ≥12 levels (`optics.spec.ts`; a provisional design target calibrated in QA L6/L10 at 5.0.0-alpha.1, §21). True angle-of-incidence Fresnel is cinematic-only (labs) | all (approx.); cinematic (physical) |
| **REQ-MAT-37** | Specular reflection | `specular.intensity` (0.5), `specular.spread` | `::after` sheen `linear-gradient(var(--ag-light-angle), rgb(from var(--ag-color-specular) r g b / calc(var(--ag-specular) * 0.35)), transparent 40%)` clipped to the top-lit third; static in standard; `--ag-specular` is the only animatable optic for hover/press (PRD-06); `contrast=more` sets `--ag-specular: 0` | all except forced colors |
| **REQ-MAT-38** | Refraction / distortion | `refraction.bezel.{thin 12, regular 16, thick 24}px`, `refraction.scale.*` | Only in enhanced: `::before backdrop-filter: url(#ag-lens-<shape>-<sizeclass>) blur(--_ag-blur) saturate(…)`. Displacement confined to the bezel band; zero displacement under text boxes; never contributes to the contrast floor. Displacement `scale` is a static `feDisplacementMap` attribute per lens id, fixed per thickness from `refraction.scale.*`; CSS custom properties cannot drive SVG filter attributes, so core CSS never animates displacement (see REQ-MAT-58). No turbulence/noise displacement in core | enhanced only |
| **REQ-MAT-39** | Chromatic dispersion | none in core | Not rendered by core in any tier. Allowed only in a labs cinematic resident | cinematic only |
| **REQ-MAT-40** | Shadows | `shadow.{thin,regular,thick}` × scheme (ambient + key) | host `box-shadow: var(--_ag-shadow)` + `::after` inset depth; derived from layer × thickness; overlays use `thick` key; dropped under forced colors; no public elevation prop | all |
| **REQ-MAT-41** | Inner fill (nested) | `innerFill.{light,dark}` | `--_ag-inner-fill` per REQ-MAT-23 | all |
| **REQ-MAT-42** | Content materials | `content.{content-raised,content-sunken}.{light,dark}` | REQ-MAT-26; sunken adds 1px inset top shade | all |
| **REQ-MAT-43** | Scrim | `scrim.clearOverBright 0.35`, `scrim.modal` | `clear` over `[data-ag-backdrop=light|media]` sets `--_ag-dim: 0.35` composited as a dark layer in `::before`; modal scrim per REQ-MAT-28 | all |
| **REQ-MAT-44** | Layer interaction (light response) | `state.hover-specular`, `state.press-glow` | `[data-ag-interactive]:hover` raises `--ag-specular` to `state.hover-specular`; `:active`/`[data-pressed]` raises press glow in `::after`; transitions only on `opacity` of pseudo-layers and registered `--ag-*` scalars, duration `--ag-duration-micro`. No `scale` hover formula. Under `prefers-reduced-motion` the state change is instant | all |

Additional optic rules:

- **REQ-MAT-45** `clear` variant: `variant=clear` with no ancestor declaring `data-ag-backdrop` ∈ {`light`, `dark`, `media`} renders with the `regular` ladder cell and logs `[aura-glass] variant="clear" requires a declared backdrop; rendering as "regular"` once per element in development (D-12). `auto` does **not** satisfy `clear`, because it follows only the scheme and says nothing about the pixels behind. SC-21 ratifies this reading of D-12 (architecture erratum E-03), so compat `adaptive` → `auto` → `regular`. Implemented in CSS via `.ag-surface[data-ag-variant=clear]:not(:is([data-ag-backdrop=light],[data-ag-backdrop=dark],[data-ag-backdrop=media]) *)` plus the dev warning. Known limit: a nearer `auto` ancestor inside an outer `light` section still satisfies the guard; the dev warning walks to the nearest `[data-ag-backdrop]` and warns in that case.
- **REQ-MAT-46** `identity` variant renders no optics (`::before` none, transparent fill, no rim, no shadow) but keeps `data-ag-surface` so a11y rungs still apply.
- **REQ-MAT-47** WebKit literal ladder: `ladders.css` contains, for every `[variant][thickness][tier]` cell with blur, a literal `-webkit-backdrop-filter: blur(Npx) saturate(N) brightness(N)` (no `var()`), ≈18 rules. If the QA L8 Engine-specific lane (QA-075, WebKit probe over `hf-pattern`) proves that `var()` works in the prefixed property, the literals are removed under C-I and this REQ is closed.

### 5.5 Rendering tiers and budgets

- **REQ-MAT-48** With no `data-ag-tier` anywhere, every surface renders the **standard** tier. SSR HTML from `renderToString(<Surface/>)` is identical regardless of tier (tier is a CSS concern only); no hydration mismatch is possible from tier.
- **REQ-MAT-49** **lightweight** applies when any of: `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`; resolved transparency `solid`; `forced-colors: active`; `[data-ag-tier=lightweight]` on `<html>` or an ancestor. It renders `fallbackFill` (alpha ≥0.85), rim, shadow, grain ≤0.02, and computed `backdrop-filter: none` on `::before`. It never produces a black slab: fill lightness follows scheme.
- **REQ-MAT-50** **enhanced** CSS applies only through the selector `:root[data-ag-engine=chromium]:has(svg[data-ag-lens-ready]) .ag-surface[data-ag-refraction][data-ag-layer=chrome]`. `data-ag-lens-ready` sits on the `LensDefs` element (REQ-MAT-87), so no JS attribute write is involved. `:has()` is available in every Chromium that can reach enhanced (105+). The selector does not apply under `[data-ag-tier=standard|lightweight]`, `[data-ag-transparency=tinted|solid]`, `[data-ag-motion=none]`, `prefers-reduced-transparency`, `prefers-contrast: more` or forced colors. Without `LensDefs` in the document, the surface is pixel-identical to standard and has no layout shift (CLS contribution 0).
- **REQ-MAT-51** `refraction` on a non-chrome layer (overlay, transient, content) is ignored and warns in development. On Gecko and WebKit `data-ag-refraction` has no visual effect and no blank output.
- **REQ-MAT-52** Dev budget counter (`src/material/dev/surfaceCounter.ts`): in development only, after mount and on `requestIdleCallback` following DOM mutations (debounced 500ms), counts visible surfaces whose `::before` computed `backdrop-filter` ≠ `none` and intersect the viewport. It warns once per threshold crossing: >6 at `(pointer:fine)`, >3 at `(pointer:coarse)`, >2 refracting, any blur >32px, any full-viewport blur >12px, effective live-backdrop nesting depth >1 (a CSS-collapse failure), and any `allowNested` surface at depth ≥2 (REQ-MAT-24). The last two thresholds are PERF's tightening request (PERF §4.5), accepted here. The counter does not compute BCI. It is hosted by `AuraGlassProvider` (A11Y-029, which calls `startSurfaceCounter()`). It never changes attributes or styles. Production bundles contain no counter code, verified by a bundle grep for `surfaceCounter` and by REQ-PERF-08.
- **REQ-MAT-53** No production auto-downgrade (D-09): no production code path writes `data-ag-tier` or changes optics in response to FPS, IntersectionObserver, surface count or mount order. Lint/grep gate: no `IntersectionObserver` or `requestAnimationFrame` in `src/material/**` outside `dev/`.

### 5.6 Pre-paint engine and tier detection contract (AuraGlassScript) [owner: A11Y, A11Y-032]

- **REQ-MAT-54** Before first paint, `<html>` carries `data-ag-engine ∈ {chromium, webkit, gecko, unknown}` from `navigator.userAgentData.brands` when present (Chromium/Edge/Opera brands → `chromium`), else UA string (`AppleWebKit` without `Chrome`/`Chromium` → `webkit`; `Gecko/` + `Firefox/` → `gecko`); else `unknown`. `unknown` caps at standard. The script never uses `@supports` for `url()` backdrop detection.
- **REQ-MAT-55** The script sets `data-ag-tier=lightweight` only for `navigator.connection.saveData === true`, or `navigator.deviceMemory <= 2` together with `matchMedia('(pointer: coarse)').matches`, or a persisted user preference; otherwise it leaves `data-ag-tier` unset (standard) or applies the persisted/app value (`standard|enhanced`). It is inline, ≤1.5 KB min, CSP-nonce aware, uses no `eval`/`new Function`, and runs synchronously in `<head>`.
- **REQ-MAT-56** The material engine renders correctly with no script: missing `data-ag-engine` → enhanced never applies; missing `data-ag-tier` → standard; preference media queries still apply via `ag.a11y` media mirrors.

### 5.7 Enhanced SVG lens tier [interim owner: this PRD for §16 PRD-15, SC-37]

- **REQ-MAT-57** Lens filter ids follow `ag-lens-<shape>-<sizeclass>`, with `shape ∈ {fixed, capsule, concentric}` and `sizeclass ∈ {control, bar, panel}`, for at most 9 ids. `lens.css` maps `[data-ag-shape][data-ag-sizeclass]` to the id. `data-ag-sizeclass` is a private SC-21 attribute that `resolveRole` emits only when `refraction` is set (REQ-MAT-03). The `sheet` size class is never refracting, for area-budget reasons.
- **REQ-MAT-58** Lens filter structure: `feImage` (a precomputed convex-squircle displacement map, n≈1.5, kube.io model) → `feDisplacementMap in="SourceGraphic" scale="<bezel-scaled>" xChannelSelector="R" yChannelSelector="G"`, then blur and saturate in the same `backdrop-filter` list, with specular composited in the filter. Maps are built once per id per document. **Static scale (decided, SC-37; architecture erratum E-10 corrects §4.7 "only `scale` animates"):** `scale` is an SVG attribute shared by every surface that uses the id, and CSS (including `--_ag-refraction-scale`) cannot set it. In 5.0, `scale` is a fixed per-thickness value from `refraction.scale.*`, and no code writes the attribute at runtime (D-09, REQ-MAT-53). `--_ag-refraction-scale` stays registered (architecture §4.4) but core does not consume it.
- **REQ-MAT-59** The bezel never overlaps text. Displacement is masked to the outer `refraction.bezel` band, and the bezel is clamped to 12/16/24px by thickness. Certification asserts on Chromium that no text box from `Range.getClientRects()` intersects a non-zero displacement region (QA L8, QA-075 `[data-ag-part="bezel"]` probe; MAT-078).
- **REQ-MAT-86** Lens maps are generated at build time by `scripts/build/lens-maps.mjs` (NEW) into `src/material/assets/lens/ag-lens-<shape>-<sizeclass>.png`: 9 files, deterministic (two runs are byte-identical), and with no `feTurbulence` or noise. The PNGs are committed and shipped as package assets. Each map is ≤3 KB, and the `<defs>` markup plus maps is ≤30 KB in total. Both are rows in `docs/size-budgets.json` (PKG-048). Test: `src/material/__tests__/lens-maps.test.ts`.
- **REQ-MAT-87** `LensDefs` (`src/material/lens/LensDefs.tsx`, internal and not exported from `aura-glass/material`) is server-safe, with no hooks, no effects and no `"use client"`. It renders one `<svg data-ag-lens-defs data-ag-lens-ready aria-hidden="true" focusable="false" width="0" height="0">` that contains the 9 `<filter id="ag-lens-…">` definitions referencing the REQ-MAT-86 assets. `AuraGlassProvider` renders it once per document unless its `tier` prop is `standard` or `lightweight` [mount point owned by A11Y, A11Y-029]. Because the defs are present in SSR HTML, enhanced needs no post-mount attribute write. The enhanced lens is a **preview**: `refraction` carries a TSDoc `@preview` tag until Chromium certification passes at RC-1, and no `preview/*` export is added, because enhanced has no public JS surface. If certification fails, `refraction` ships inert in 5.0 and is promoted in 5.1 (D-05, AC-MAT-10).

### 5.8 Cinematic tier contract (`@auraglass/labs`) [implementation: PRD-EXP, interim §16 PRD-21, SC-37]

- **REQ-MAT-60** Core contains no WebGL, no `three` import and no `<canvas>` in `src/material/**`. `Tier` includes `'cinematic'` as a type so labs and `aura-glass/three` can declare it, but no core CSS selects `data-ag-tier=cinematic`.
- **REQ-MAT-61** A cinematic resident may refract only library-owned pixels (`Environment image|video`, a labs canvas, an R3F scene); it must not rasterise DOM (`html-to-image`, `foreignObject`, `html2canvas`). It imports only public `aura-glass` entries (`aura-glass/material`, `aura-glass/theme`).
- **REQ-MAT-62** A cinematic resident creates ≤1 WebGL context per page, pauses rendering when offscreen (IntersectionObserver) or `document.hidden`, renders the standard-tier `Surface` when `data-ag-motion` is `none`/`calm`, transparency ≠ `glass`, forced colors, or WebGL context loss, and has no import side effects.

### 5.9 Optics lint rule and the recipe metric

- **REQ-MAT-63** The ESLint rule `auraglass/no-optics-outside-material` is added to the existing `eslint-plugin-auraglass.js` by MODIFY. PKG owns the plugin file and its `eslint.config.js` wiring (PKG-015; SC-16), and this PRD owns the rule. It replaces `auraglass/no-inline-glass`, which this PRD also owns and retires (MAT-118). In any file outside `src/material/**`, `tokens/**` and compiler output, the rule reports: the JSX/object keys `backdropFilter` and `WebkitBackdropFilter`; string or template literals matching `/backdrop-filter|-webkit-backdrop-filter/`, `/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/`, `/\bblur\(\s*\d/` or `/\bsaturate\(\s*\d/`; and specular gradient literals matching `/linear-gradient\([^)]*rgba\(255,\s*255,\s*255/`. Severity is `warn` in ratchet mode from §20 step 2. It becomes `error` in `eslint.config.js` from §20 step 9 for migrated families, and for all of `src/**` from 5.0.0-beta.1. Stories and tests are not exempt. The only exemptions are `src/material/**`, `tokens/**`, compiler output (`src/material/css/generated/**`, the generated `tailwind.css`) and the rule's own `RuleTester` fixtures in `tests/lint/no-optics-outside-material.test.ts`. Raw colour, blur and radius literals in general are DS's `auraglass/no-raw-design-values` (SC-17). This rule covers only the optics patterns above.
- **REQ-MAT-64** `scripts/ci/verify-optics-css.mjs` (NEW, a PostCSS scanner) enforces the same patterns in `*.css`/`*.module.css` outside `src/material/css/**` and generated token CSS. PERF's `scripts/ci/verify-css-perf.mjs` checks blur scale and layer forcing, and DS's stylelint `no-raw-design-values` checks literals. This scanner checks only where optics may appear, so the three gates do not overlap.
- **REQ-MAT-65** `scripts/ci/count-glass-recipes.mjs` (NEW) computes **independent glass recipes** = number of distinct source files outside `src/material/**` and the PRD-03 compiler output (`src/material/css/generated/**`, generated `tailwind.css`, which REQ-MAT-68 proves identical to the ladders) that emit any `backdrop-filter`/`-webkit-backdrop-filter` declaration or `backdropFilter`/`WebkitBackdropFilter` key, plus 1 if `src/material/**` emits any. This is a file-level upper bound on the conceptual 9–13 recipes of §2.1: the expected baseline at `15b6de6f7` is ≈121 (`rg -l -i "backdrop-filter|backdropFilter" src`), not 9–13. It writes `independent-glass-recipes: N` to the CI summary. Until 5.0.0-beta.1 it runs in ratchet mode (N may never increase; a migrated family's files are added to a no-regression list). From the 5.0.0-beta.1 SHA it fails when N > 1.
- **REQ-MAT-66** `scripts/audit/static-glass-material-audit.js` rule `dynamic-*-unproven` (`:1385-1404`) is deleted; the audit is replaced by REQ-MAT-63..65 and the QA L6 Environment visual and L7 Pixel regression gates. The duplicated ternary ladders (`src/tokens/glass.ts:1002-1021`, `LiquidGlassMaterial.tsx:338-370`) are deleted with their files.

### 5.10 Replacing the existing recipes

- **REQ-MAT-67** Every recipe R1–R13 (§2.1) has exactly one disposition in the mapping table below, executed in the listed release. After 5.0.0-beta.1, `rg -l "buildSurfaceStyles|buildLiquidGlassStyles|buildBackdropFilter|createGlassStyle|glassFoundation|glassUtils|liquidGlassUtils" src` returns only `src/compat/**` adapters. The codemod column uses only SC-33 ids (`imports-subpaths`, `canonical-names`, `dead-optical-props`, `providers`, `css-vars`, `removed`) or `null` (manual). DX implements the transforms (DX-041/042/047/049/050/052), and REL registers the ids. Manual rows get the `// TODO(aura-glass 5): <reason>, see <doc>` marker through DX's TODO emitter (DX-044).

| 4.x recipe / entry | 5.0 replacement | 4.2 (C-E/C-D) | 4.3 | 5.0 | Codemod id (SC-33) |
|---|---|---|---|---|---|
| R1 `glassTokenUtils.buildSurfaceStyles` (`src/tokens/glass.ts:960-1038`) and its consumer `OptimizedGlassCore` (`OptimizedGlass`, 166–168 sites) | `Surface` + `materialProps()`; values → `MaterialSpec` | C-D warning on `OptimizedGlass`; `/material` experimental | emits `data-ag-surface`; v5 optics under `data-ag-preview` | deleted; `compat` `OptimizedGlass` → `Surface` adapter (drops no-op props) | `canonical-names` + `dead-optical-props` |
| R2 `buildBackdropFilter` (`:940-955`, 0 callers) | none | C-D | — | deleted | `null` (no callers) |
| R3 `liquidGlassUtils.buildLiquidGlassStyles` (`:1559-1626`) | compiled ladders (`thick` = 32px is the only 32px cell) | C-D | — | deleted | `null` (internal) |
| R4 `LiquidGlassMaterial` (`src/primitives/LiquidGlassMaterial.tsx`, 31 importers) | `Surface`; `variant`/`thickness` keep names; `adaptToContent`, `ior`, `material`, tilt, sampling removed | C-D (no 4.1.1 change: not in the SC-36 accepted list) | `data-ag-preview` | deleted; `compat` adapter | `canonical-names` + `dead-optical-props` |
| R5 `src/utils/createGlassStyle.ts` (21 importers) | `materialProps()` spread or `Surface render` | C-D | — | deleted | `null` (manual: returns style object → attributes; TODO marker) |
| R6 `src/core/mixins/glassMixins.ts:41` `createGlassStyle` (public) | `materialProps()` | C-D | — | deleted with `core/mixins/glassMixins` subpath | `null` (as R5) + `imports-subpaths` for the subpath |
| R7 `src/core/foundation/glassFoundation.ts` | compiled `material.css` | C-D | — | deleted | `null` (internal) |
| `src/core/mixins/glassSurface.ts` | compiled `material.css` | C-D | — | deleted | `null` |
| R8 `src/theme/materials.ts` | `MaterialSpec` (one table) | C-D | — | deleted | `null` (internal) |
| R9 `src/styles/glass.generated.css` (incl. `[class*="glass-"]` 85% black fallback `:1006-1012`) | `ladders.css` + `ag.a11y` rungs | 4.2 visual bug fix: scope fallback to listed classes (D-28 extension, needs approval per deviation note 6; else 5.0) | — | deleted (MAT-110) | `css-vars` |
| R10 `src/styles/glass.css` recipes (`.glass`, `.glass-foundation-complete`, `.glass-premium`, …); a11y blocks `:4022-4123` | `material.css`; a11y blocks re-keyed to `[data-ag-surface]` in `ag.a11y` [A11Y] | C-D on classes | — | file removed by MOT-084 (SC-20); this PRD first migrates `:4425-4486` (MAT-037/038); class names unsupported (no compat CSS for optics) | `css-vars`; class usage reported by `doctor --v5` (DX-037) |
| `glass.css:4425-4486` scroll-edge / concentric / source-transition rules, `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame` | `ScrollEdge`, `ConcentricFrame` (source transition → MOT View Transitions) | C-D | — | deleted; compat adapters | `canonical-names` |
| `LiquidGlassEffectGroup` (`src/primitives/LiquidGlassEffectGroup.tsx`) | `SurfaceGroup` | C-D | `data-ag-preview` | deleted; compat adapter | `canonical-names` |
| `LiquidGlassLayerProvider` / `LiquidGlassSurfaceLayer` (`src/primitives/LiquidGlassLayerProvider.tsx`) | CSS nested rule (REQ-MAT-23) + dev counter | C-D | — | deleted; compat no-op passthrough | `providers` (remove wrapper) |
| `LiquidGlassBackdropSampler`, `useLiquidGlassBackdrop` (`src/primitives/LiquidGlassBackdropSampler.tsx`, `src/hooks/useLiquidGlassBackdrop.ts`) | `data-ag-backdrop` / `Environment`; dev `@auraglass/cli audit backdrop` | C-D | — | deleted, no compat | `removed` (inserts a `data-ag-backdrop` TODO) |
| R11 `HoudiniGlassProvider`, `HoudiniGlassCard` (`src/components/houdini/**`) | none | C-D | — | deleted by FND-123 (RM-06; architecture §4.8); MAT-113 verifies | `removed` |
| R12 `OptimizedGlassAdvanced`, `GlassAdvanced` (`src/primitives/glass/**`) | `Surface` | C-D | `data-ag-preview` | deleted; compat adapter | `canonical-names` |
| `GlassCore` / `GlassPrimitive` (`src/primitives/GlassCore.tsx`, 24 sites) | `Surface` | C-D | `data-ag-preview` | deleted; compat adapter | `canonical-names` |
| R13 26 component CSS files (21 `*.module.css`) + 11 inline `backdropFilter` components | consuming component adopts `Surface`/`materialProps` in its flagship/T2 PRD | — | — | lint REQ-MAT-63/64 fails on residue | per component |
| `LiquidGlassGPU` (`src/components/advanced/LiquidGlassGPU.tsx`) | none (fake backdrop) | C-D (not in the SC-36 4.1.1 scope) | — | deleted by FND-123 | `removed` |
| `GlassWebGLShader`, `HeatGlass` (`src/components/surfaces/HeatGlass.tsx`), `Glass3DEngine` (`src/components/effects/Glass3DEngine.tsx`) | labs only if rebuilt over owned pixels (REQ-MAT-61) | C-D | — | deleted from core (FND RM-06; MAT-113 verifies) | `removed` |
| `storybook-utility-shim.css` import (`src/styles/index.css:25`) | none; PKG-101 moves the file to `.storybook/` and imports it from `.storybook/preview.tsx` | 4.2 C-D (`deprecations.json` kind `css-global`; `doctor --v5` report, DX-037) | 4.3 `compat/globals.css` available (PKG) | removed from shipped styles (C-B) | `null` |
| `useGlassProbes` (`src/hooks/useGlassProbes.ts`) | certification-only probe in QA L8 (QA-075) | C-D | — | subpath removed | `removed` |
| `--aura-blur-amount`, tier classes in `src/core/productionCore.ts:196-200` | `data-ag-tier` | C-D | — | deleted | `null` |

- **REQ-MAT-68** Tailwind bridge utilities `glass-regular`, `glass-clear`, `glass-thin`, `glass-thick`, `content-raised` are generated from the same rule objects as `ladders.css` (no hand-written duplicate) and produce byte-identical declaration blocks to their `[data-ag-*]` counterparts [generator: DS, DS-090; equality test here].
- **REQ-MAT-69** `--glass-*` → `--ag-*` read aliases exist only in `compat/tokens.css` (`@layer ag.compat`) [owner: DS, generated from `compat-alias-map.json` by DS-103; SC-19/34]; `material.css` neither reads nor writes `--glass-*`.

### 5.11 Packaging and size

- **REQ-MAT-70** Budgets, submitted as rows in `docs/size-budgets.json` and checked by `scripts/ci/verify-size-budgets.mjs` (both owned by PKG, PKG-048; SC-15; no `size-limit`): `aura-glass/material` runtime JS (all value exports, min+gz, React external) ≤3 KB; `material.css` (structural + ladders + properties + floors + lens selectors) ≤8 KB gz of the ≤32 KB `styles.css` budget, inside PERF's per-subpath CSS default; `ag-grain-128.avif` ≤4 KB; lens assets per REQ-MAT-86. The `./material` and `./material.css` entries are rows in PKG's `build/exports.manifest.json` (PKG-005).
- **REQ-MAT-71** Importing `aura-glass/material` has no side effects: 0 listeners, 0 timers, 0 `<html>`/`<head>` mutations and 0 `<style>` injection. This is checked by PKG's per-entry jsdom gate `scripts/ci/verify-side-effects.mjs` (PKG-042) and by the unit test `import-side-effects.test.ts`.

---

## 6. Files/directories affected (existing paths)

Verified with `rg --files` at `15b6de6f7`.

| Path | Change |
|---|---|
| `src/tokens/glass.ts` (1,645 lines) | R1–R3, `glassUtils` alias (`:1128`), `liquidGlassUtils` (`:1457`), `PERFORMANCE_TIERS` (`:874-904`), `LIQUID_GLASS` IOR tables: C-D in 4.2, deleted in 5.0 |
| `src/tokens/generated.ts` | regenerated by DS; `noiseOpacity` etc. removed |
| `src/primitives/OptimizedGlassCore.tsx`, `src/primitives/OptimizedGlassCore.stories.tsx` | 4.3: emit `data-ag-surface` + role attrs; 5.0: deleted |
| `src/primitives/LiquidGlassMaterial.tsx`, `.test.tsx` | 4.3: emit attrs; 5.0: deleted |
| `src/primitives/GlassCore.tsx`, `GlassCore.stories.tsx` | as above |
| `src/primitives/glass/OptimizedGlassAdvanced.tsx`, `src/primitives/glass/GlassAdvanced.tsx` (+ stories/tests) | as above |
| `src/primitives/LiquidGlassEffectGroup.tsx`, `LiquidGlassLayerProvider.tsx`, `LiquidGlassScrollEdge.tsx`, `LiquidGlassConcentricFrame.tsx`, `LiquidGlassBackdropSampler.tsx`, `LiquidGlassSourceTransition.tsx` (+ tests) | C-D in 4.2; deleted in 5.0 (successors in `src/material/**`; source transition → MOT) |
| `src/primitives/index.ts` | 4.x exports deprecated; 5.0 file reduced to KEEP primitives [FND] |
| `src/index.ts` (`:17` `OptimizedGlass`, `:500-502` `LiquidGlassGPU`, `:960-964` `createGlassStyle`) | exports removed in 5.0; root re-exports `aura-glass/material` values |
| `src/utils/createGlassStyle.ts` | deleted 5.0 |
| `src/core/mixins/glassMixins.ts`, `src/core/mixins/glassSurface.ts`, `src/core/foundation/glassFoundation.ts` | deleted 5.0 |
| `src/theme/materials.ts` | deleted 5.0 |
| `src/core/productionCore.ts` (`:196-200`) | tier variables removed |
| `src/hooks/useLiquidGlassBackdrop.ts` (+ test), `src/hooks/useGlassProbes.ts` | deleted 5.0 |
| `src/styles/glass.css` (4,605 lines) | this PRD migrates `:4425-4486` into `src/material/css/material.css` (MAT-037/038); `:4022-4123` a11y policy migrates to `ag.a11y` [A11Y]; file removal is MOT's (MOT-084, SC-20) |
| `src/styles/glass.generated.css` | 4.2 fallback scoping fix (if approved, deviation note 6); deleted 5.0 by MAT-110 |
| `src/styles/index.css` (`:11`, `:25`) | owned by PKG (PKG-101; SC-20). 4.2: C-D entry for the `storybook-utility-shim.css` import; 5.0: PKG-101 drops the import and the file becomes the `styles.css` entry; this PRD only verifies (MAT-114) |
| `src/styles/storybook-utility-shim.css` | moved to `.storybook/` by PKG-101 (architecture §14.4 schedule) |
| `src/styles/tokens.css`, `src/styles/design-tokens.css`, `src/styles/variables.css` | superseded by DS `tokens.css` (DS-111) |
| `src/components/houdini/**` | deleted by FND-123 (RM-06); verified here |
| `src/components/advanced/LiquidGlassGPU.tsx`, `src/components/advanced/GlassWebGLShader.tsx`, `src/components/surfaces/HeatGlass.tsx`, `src/components/effects/Glass3DEngine.tsx` (+ stories/tests/snapshots) | deleted from core by FND removal families (FND-123); verified here |
| `src/components/primitives/LiquidGlass*.stories.tsx` (Material, ScrollEdge, SurfaceLayer, ConcentricFrame, BackdropSampler, EffectGroup, LayerProvider, SourceTransition) | replaced by Material Lab stories (§13) |
| `scripts/audit/static-glass-material-audit.js` | `dynamic-*-unproven` (`:1385-1404`) deleted; script retired after REQ-MAT-65 lands |
| `scripts/generate-glass-css-from-tokens.ts`, `scripts/generate-glass-css-simple.js`, `scripts/build-tokens.js` | retired in favour of the DS compiler `scripts/tokens/build.mjs`; `scripts/build-tokens.js` is removed by DS-112 (SC-39) |
| `eslint-plugin-auraglass.js`, `eslint.config.js` (`:29` `no-inline-glass`) | MODIFY only (files owned by PKG, PKG-015; SC-16): new rule `no-optics-outside-material` replaces `no-inline-glass` |
| `.storybook/preview.tsx` | owned by SB (SB-048 REDESIGN); this PRD makes no structural edit and registers nothing outside SB's globals (MAT-090 verifies the `environment` global and the single decorator) |
| `tokens/index.json`, `tokens/schema.json` | superseded by DTCG `tokens/{ref,sys,…}/*.tokens.json` [DS] |
| `tests/liquid-glass/`, `tests/visual/` | material specs move to `tests/material/` and the QA lanes (§12); visual pixel specs live in `tests/visual/<area>/` (SC-30) |
| `docs/liquid-glass/primitives/liquid-glass-material.md` | replaced by `docs/guides/choosing-a-material.md` [DX, DX-127]; IOR 1.43 claim removed |

## 7. Components affected

Every component that renders glass is a consumer. This PRD changes their material source, not their behaviour; each owning PRD migrates its components onto `Surface`/`materialProps`.

| Group | Components (examples, existing paths) | Current recipe | Owning PRD |
|---|---|---|---|
| `LiquidGlassMaterial` consumers (26 component files) | `src/components/button/GlassButton.tsx`, `card/GlassCard.tsx`, `input/GlassInput.tsx`, `layout/GlassContainer.tsx`, `modal/GlassDialog.tsx`, `modal/GlassModal.tsx`, `modal/GlassDrawer.tsx`, `modal/GlassPopover.tsx`, `modal/LiquidGlassPopoverMenu.tsx`, `modal/LiquidGlassAdaptiveSheet.tsx`, `navigation/GlassHeader.tsx`, `navigation/LiquidGlassToolbar.tsx`, `navigation/LiquidGlassTabBar.tsx`, `navigation/LiquidGlassInsetSidebar.tsx`, `navigation/LiquidGlassSegmentedControl.tsx`, `navigation/LiquidGlassInspectorPanel.tsx`, `navigation/LiquidGlassBottomAccessory.tsx`, `input/LiquidGlassControlGroup.tsx`, `search/LiquidGlassSearchField.tsx`, `interactive/LiquidGlassCommandSurface.tsx`, `media/LiquidGlassMediaControls.tsx`, `data-display/LiquidGlassBadgeCluster.tsx`, `button/LiquidGlassButtonStyle.tsx`, `surfaces/DimensionalGlass.tsx` | R4 | CTL, OVL, NAV, MED, FND (§16 PRD-08/09/10/13/14) |
| `OptimizedGlass` consumers (166–168) | most of `src/components/**` | R1 | per family (§12 of architecture) |
| `createGlassStyle` callers (63 files under `src/components`) | e.g. form, data-display, navigation families | R5/R6 | per family |
| Inline `backdropFilter:` (11) | `navigation/GlassDropdownMenu.tsx`, `interactive/GlassSpotlight.tsx`, `data-display/GlassJSONViewer.tsx`, `quantum/GlassQuantumTunnel.tsx`, `quantum/GlassSuperpositionalMenu.tsx`, `backgrounds/GlassDynamicAtmosphere.tsx`, `advanced/GlassSelfHealingSystem.tsx`, `media/GlassAdvancedVideoPlayer.tsx`; `types.ts` style-prop types in `button/`, `card/`, `modal/`, `surfaces/`, `interactive/`, `layout/` | R13 | flagship/T2 PRDs, or FND (§16 PRD-16 removal) if REMOVE |
| Component CSS files with `backdrop-filter` (26; 21 `*.module.css`) | `navigation/GlassPageTabs.module.css`, `navigation/GlassTabBar.module.css`, `input/GlassMultiSelect.module.css`, `tree-view/TreeView.module.css`, `tree-view/TreeItem.module.css`, `speed-dial/SpeedDial.module.css`, `image-list/ImageList.module.css`, `charts/GlassChart.module.css`, `cookie-consent/CookieConsent.module.css`, `backgrounds/AtmosphericBackground.module.css`, … | R13 | per family |
| Accessibility | `src/components/accessibility/ContrastGuard.tsx`, `src/utils/contrastGuard.ts` | runtime contrast theatre | `ContrastGuard.tsx` removed in the 4.1.1 cut by TRUST-026 (SC-39); FND-125 verifies absence; engine floor replaces it |
| Theme | `src/theme/ThemeProvider.tsx`, `src/theme/GlassThemeProvider.tsx` | 4.x theme hooks | replaced by `AuraGlassProvider` [A11Y] |

## 8. New components/files

All NEW (no `src/material` directory exists today).

| File | Purpose |
|---|---|
| `src/material/{types.ts, materialProps.ts, Surface.tsx, SurfaceGroup.tsx, Environment.tsx, ScrollEdge.tsx, ConcentricFrame.tsx, useMaterialTier.ts, defineMaterial.ts, index.ts}`, `src/material/internal/resolveRole.ts` | §4.3 |
| `src/material/css/material.css`, `src/material/css/lens.css` | structural rules, enhanced selectors |
| `src/material/lens/LensDefs.tsx`, `src/material/assets/lens/*.png`, `scripts/build/lens-maps.mjs` | enhanced lens defs and maps (REQ-MAT-86/87; interim §16 PRD-15) |
| `src/material/css/preview-v5.css` | 4.3 `[data-ag-preview="v5"]` scoping (REQ-MAT-20; SC-37) |
| `src/material/css/generated/{ladders.css, properties.css, floors.css}` | DS compiler output (DS-049/036/059 write, PRD-04 consumes; OV-31) — not created by this PRD |
| `src/material/dev/{surfaceCounter.ts, warnings.ts}` | dev-only diagnostics |
| `src/material/assets/ag-grain-128.avif` | grain |
| `src/material/__tests__/*.test.ts(x)` | §12 unit tests |
| `src/material/stories/*.stories.tsx` | Material Lab stories on SB's `.storybook/lab/**` harness (§13; SC-31) |
| `src/compat/material/{OptimizedGlass, LiquidGlassMaterial, GlassCore, LiquidGlassEffectGroup, LiquidGlassScrollEdge, LiquidGlassConcentricFrame, LiquidGlassLayerProvider, OptimizedGlassAdvanced}.tsx` | prop adapters to `Surface` (SC-34: adapter pattern and `src/compat/index.ts` owned by DX, DX-065; `warnDeprecated` by REL, REL-072; mapping tables owned here, §11) |
| `etc/api/material.api.md`, `etc/api/material.exports.json` | API report and export snapshot (generated by REL's scripts, SC-04) |
| `etc/api/material.css-api.json`, `scripts/release/material-css-api.mjs` | public CSS-variable and attribute manifest and its generator/check (REQ-MAT-16) |
| `scripts/ci/count-glass-recipes.mjs` | REQ-MAT-65 |
| `scripts/ci/verify-optics-css.mjs` | REQ-MAT-64 |
| `scripts/ci/verify-material-runtime.mjs` | REQ-MAT-53/60 grep gate (no observers, rAF, WebGL or tier writes in production material code) |
| `tests/material/*.spec.ts` | Playwright material specs, run as the `material` project of QA's `certification/playwright.cert.config.ts` (§12) |
| `eslint-plugin-auraglass.js` rule `no-optics-outside-material` | REQ-MAT-63 (MODIFY of PKG's existing file) |

## 9. Components/files to remove or deprecate

| Item | 4.2 | 5.0 | Successor |
|---|---|---|---|
| `OptimizedGlass` / `OptimizedGlassCore`, `GlassCore` / `GlassPrimitive`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial` | C-D (warn once, `deprecations.json`) | C-B removal from root; `aura-glass/compat` through 5.x; removed 6.0 | `Surface` |
| `LiquidGlassEffectGroup`, `useLiquidGlassEffectGroup` | C-D | C-B; compat | `SurfaceGroup` |
| `LiquidGlassLayerProvider`, `LiquidGlassSurfaceLayer`, `useLiquidGlassLayer` | C-D | C-B; compat passthrough | CSS nested rule + dev counter |
| `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame` | C-D | C-B; compat | `ScrollEdge`, `ConcentricFrame` |
| `LiquidGlassBackdropSampler`, `useLiquidGlassBackdrop` | C-D | C-B, no compat | `data-ag-backdrop`, `Environment`, `cli audit backdrop` |
| `createGlassStyle` (both), `glassFoundation`, `glassSurface`, `glassTokenUtils`, `glassUtils`, `liquidGlassUtils`, `theme/materials.ts`, `core/mixins/glassMixins` subpath | C-D | C-B, no compat (internal or replaced by `materialProps`) | `materialProps`, `MaterialSpec` |
| `glass.generated.css`, `glass.css` recipe classes, `glass-backdrop-blur*` utilities | C-D | C-B | `material.css`, Tailwind bridge utilities |
| `HoudiniGlassProvider`, `HoudiniGlassCard` | C-D | C-B, deleted (FND-123) | none |
| `LiquidGlassGPU`, `GlassWebGLShader`, `HeatGlass`, `Glass3DEngine` | C-D (not in the SC-36 4.1.1 scope) | deleted from core (FND-123) | labs resident only if rebuilt over owned pixels |
| `useGlassProbes`, `--aura-blur-amount`, tier classes `glass-tier-*`, `liquid-glass-{refraction,reflection,parallax,advanced,layered-surface}` emissions | C-D | deleted | `data-ag-tier`, certification probe |
| `scripts/audit/static-glass-material-audit.js` | retired from CI gating | deleted | REQ-MAT-63..65 + QA L6/L7 gates |
| ESLint `auraglass/no-inline-glass` (owned here, SC-16) | kept | rule removed from the plugin (MODIFY) | `auraglass/no-optics-outside-material` |

---

## 10. API changes

Classes per D-27: C-I safe internal, C-E additive, C-D deprecation, C-B breaking (5.0 only, after a prior 4.x C-D).

| # | Change | Release | Class | Notes |
|---|---|---|---|---|
| API-1 | New subpath `aura-glass/material` (experimental in 4.2, generated by the 5.0 compiler) | 4.2 | C-E | D-19 |
| API-2 | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps`, `useMaterialTier`, types | 4.2 (experimental), 5.0 (stable) | C-E | |
| API-3 | `defineMaterial` from `aura-glass/material` (build-time helper, tree-shaken; architecture §3.2) | 5.0 | C-E | no separate subpath (SC-12) |
| API-4 | Public CSS vars `--ag-light-angle`, `--ag-specular`, `--ag-glass-opacity`, read-outs, shape, focus, layout vars | 4.2 | C-E | semver-stable from 5.0 |
| API-5 | Data attributes `data-ag-surface/layer/variant/thickness/content/shape/interactive/prominent/refraction/allow-nested/group/backdrop` | 4.2 (on new API), 4.3 (on six 4.x primitives) | C-E | private SC-21 MAT attributes (`data-ag-sizeclass`, `-radius`, `-spacing`, `-inset`, `-edge`, `-edge-style`, `-lens-ready`, `-full-height`, `-lens-defs`) are not API |
| API-6 | `data-ag-preview="v5"` subtree switch | 4.3 only | C-E | removed in 5.0 (C-B, it was preview) |
| API-7 | Deprecate `OptimizedGlass`, `GlassCore`/`GlassPrimitive`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial`, `LiquidGlassEffectGroup`, `LiquidGlassLayerProvider`, `LiquidGlassSurfaceLayer`, `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame`, `LiquidGlassBackdropSampler`, `useLiquidGlassBackdrop`, `useLiquidGlassLayer`, `useLiquidGlassEffectGroup` | 4.2 | C-D | `deprecations.json` entries, dev warning, codemod id |
| API-8 | Deprecate `createGlassStyle` (both), `glassUtils`, `glassTokenUtils`, `liquidGlassUtils`, `core/mixins/glassMixins` subpath, `glass-*` utility classes | 4.2 | C-D | |
| API-9 | Remove all API-7/API-8 items from root and subpaths | 5.0 | C-B | API-7 components available from `aura-glass/compat` through 5.x |
| API-10 | Remove 4.x optical props (REQ-MAT-12) | 5.0 | C-B | no pixel change: they were no-ops (MATERIAL-ENGINE-05) |
| API-11 | Variant union `regular | clear | identity` replaces 4.x `variant` values on glass primitives; `solid` moves to the transparency axis | 5.0 | C-B | D-06; compat maps `variant="solid"` → `data-ag-transparency="solid"` subtree |
| API-12 | `thickness` replaces `elevation`/`intent` material selection; intent only tints rim/specular or `prominent` | 5.0 | C-B | D-07; compat maps `elevation 0|1→thin, 2→regular, 3+→thick` |
| API-13 | `layer="content"` defaults to content materials (no blur) | 5.0 | C-B (visible) | D-08; `GlassCard` visibly changes from 1.8% white glass to `content-raised` |
| API-14 | `clear` without backdrop renders `regular` | 5.0 | C-E (behavioural safety) | D-12 |
| API-15 | Houdini, `LiquidGlassGPU`, `GlassWebGLShader`, `HeatGlass`, `Glass3DEngine` removed | 5.0 (none is in the SC-36 4.1.1 scope) | C-B | removal by FND-123 |
| API-16 | `--glass-*` variables no longer emitted by core CSS | 5.0 | C-B | opt-in read aliases in `compat/tokens.css` (D-18; DS-103) |
| API-17 | `[class*="glass-"]` 85% black fallback scoped to listed classes | 4.2 if approved as a D-28 extension (deviation note 6), else 5.0 | C-I (labelled visual bug fix) | fixes MATERIAL-ENGINE-07 corrected outcome |
| API-18 | `storybook-utility-shim.css` no longer shipped in `./styles` | 4.2 C-D entry; 4.3 `compat/globals.css` (PKG); 5.0 C-B removal (PKG-101 move) | C-D → C-B | MATERIAL-ENGINE-10; architecture §14.4 (global `.flex`/`.grid` C-D in 4.3, removed 5.0) |

Final 5.0 signatures are exactly architecture §4.2; this PRD adds no props beyond it.

## 11. Migration concerns

1. **Visible change is the norm, not the exception.** 4.x glass is ≈2% white over whatever is behind it; 5.0 glass has a solved floor (e.g. `tinted` and `glass` rows chosen so `on-surface` ≥4.5:1 over white, black and busy). Every screenshot baseline changes. Per D-27 this is C-B and lands only in 5.0; on `release/4.x` the visual-class gate blocks it except under `data-ag-preview="v5"`.
2. **Prop adapters (compat).** `aura-glass/compat` `OptimizedGlass`: `elevation`→`thickness` (API-12), `intent`→ dropped unless `intent="primary"` + `prominent`, `variant="solid"`→ wrapper `data-ag-transparency="solid"`, `interactive`→`interactive`, `className`/`style`/`children` passthrough; all no-op props dropped with one dev warning listing them. `LiquidGlassMaterial`: `variant` (`regular|clear`) kept, `thickness`/`size` mapped, `adaptToContent`/`ior`/`material`/`enableTilt` dropped with warning. `LiquidGlassEffectGroup`→`SurfaceGroup` (`spacing` kept). `LiquidGlassLayerProvider`→fragment.
3. **Inline-style consumers.** Code that spread `createGlassStyle()` output into `style` must switch to `{...materialProps(role)}`. The `prop-grammar`/`removed` transforms (DX) rewrite the common `style={createGlassStyle({ elevation })}` shape and leave `// TODO(aura-glass 5): replace createGlassStyle with materialProps(role), see <doc>` elsewhere (SC-33 marker). Combining a consumer `background` with a surface now overrides the tint (consumer wins); documented in the migration guide.
4. **Backdrop declaration.** Apps relied on runtime sampling (which misread transparent wrappers as black, MATERIAL-ENGINE-08). In 5.0 they declare `data-ag-backdrop` on sections or wrap media in `Environment`/`Backdrop`. Undeclared `clear` falls back safely to `regular` (D-12). `@auraglass/cli doctor --v5` (DX-037) reports `variant="clear"` usage without an ancestor declaration (static scan).
5. **Nested glass.** Inputs inside dialogs and cards inside containers render the inner material, not a second blur. Consumers who visually depended on double-frost must add `allowNested` (and see a depth warning).
6. **Content layer.** `Card`, `Table`, `Thread`, form panels become non-blurred content materials. Marketing pages that want glass cards over media opt in with `variant="regular"` inside `Environment backdrop="media"`.
7. **CSS hooks.** Consumer CSS that targeted `.optimized-glass-surface`, `.liquid-glass-material`, `.glass-foundation-complete` or `--glass-*` breaks. Selector targets become `[data-ag-surface]`, `[data-ag-variant]`, `--ag-surface-*` read-outs. `compat/tokens.css` provides read-only `--glass-*` aliases; there is no compat for optics classes.
8. **SSR.** No change needed for RSC apps; `Surface` is server-safe. Apps that want enhanced or persisted preferences without a flash add `<AuraGlassScript nonce={…}/>` in `<head>` [A11Y].
9. **4.3 preview.** Teams can evaluate the 5.0 material on 4.x by setting `data-ag-preview="v5"` on a subtree; the frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (REL-115, SC-08) must be pixel-unchanged without the attribute.
10. **Rollback.** Per architecture §14.6: enhanced regression → `tier="standard"` or `data-ag-tier="standard"`; unreadable backdrop → `data-ag-transparency="tinted|solid"` per subtree; forward fix is one row in `MaterialSpec.opacityFloor`.

---

## 12. Tests required

Unit tests are Jest `*.test.ts(x)` (QA's `jest.config.js`, QA-003; L12 Unit) and run locally only if light. Browser specs are Playwright `*.spec.ts` under `tests/material/` (SC-30) and run **remotely**, never on a developer Mac. They form a `material` project added by MODIFY to QA's `certification/playwright.cert.config.ts` (depends on QA-018; SC-29) and run in QA's `certify-pr.yml` as L5 Behaviour cells, with WebKit/Gecko/Chromium-specific cells in L8 Engine-specific. No material-specific Playwright config or workflow is created. Static gates (lint, CSS scanner, recipe metric, CSS-API check) are steps in the `Glass Quality Gates` job of PKG's `glass-pipeline.yml` (MODIFY, depends on PKG-038; SC-10), and L1 Static reads them. Artifacts follow SC-07 (`evidence-<job>-<sha>`, retention 14/30/90 days).

### 12.1 Unit / node (NEW files)

| File | Asserts | REQs |
|---|---|---|
| `src/material/__tests__/materialProps.test.ts` | pure, deterministic output over the full role matrix (4 layers × 3 variants × 3 thicknesses × 2 content × 3 shapes × booleans); defaults table incl. `resolveRole(role, sizeClass)` size-class → thickness and thickness → sizeclass mapping; no `style` key; `data-ag-sizeclass` only with `refraction`; `resolveRole` not exported from `src/material/index.ts` | 02, 03, 05, 57 |
| `src/material/__tests__/Surface.test.tsx` | `render` cloning keeps one DOM node; consumer `style` passed by reference; `ref` reaches element; `as` is a type error (`// @ts-expect-error`); deleted props are type errors | 04, 05, 12 |
| `src/material/__tests__/server-safe.test.tsx` (`@jest-environment node`) | `renderToString` of every server-safe export with no `window`/`document`/provider; no module in `src/material/**` except `useMaterialTier.ts` has `"use client"` | 06 |
| `src/material/__tests__/useMaterialTier.test.tsx` | server snapshot `standard`; reacts to `<html data-ag-tier>` change; unknown → `standard` | 07 |
| `src/material/__tests__/components.test.tsx` | `SurfaceGroup`, `Environment` (media layer `aria-hidden`, `data-ag-backdrop=media`), `ScrollEdge` attrs, `ConcentricFrame` vars | 08–11 |
| `src/material/__tests__/properties.test.ts` | parse `properties.css`: exact registry names/syntax/initial values; each initial value is computationally independent (no `var(`) | 13 |
| `src/material/__tests__/css-contract.test.ts` | PostCSS parse of `material.css` + generated: 0 `!important`, every rule inside `@layer ag.material`, no selectors from REQ-MAT-18 deny list, no `transition: all`, no `will-change` outside `[data-ag-animating]`, `-webkit-backdrop-filter` literals without `var(` per ladder cell (≈18) | 18, 19, 22, 47 |
| `src/material/__tests__/tint-formula.test.ts` | evaluates REQ-MAT-15 formula for `--ag-glass-opacity` ∈ {−1, 0, 0.3, 0.7, 1, 2} → alpha ∈ [floor, 1] | 15 |
| `src/material/__tests__/lens-maps.test.ts` | 9 ids exactly; two generator runs are byte-identical; no `feTurbulence`; each map ≤3 KB; `LensDefs` renders server-side with `data-ag-lens-defs` + `data-ag-lens-ready`, no `"use client"` | 86, 87 |
| `src/material/__tests__/tailwind-bridge-parity.test.ts` | `@utility glass-*`/`content-raised` declaration blocks equal `[data-ag-*]` blocks | 68 |
| `src/material/__tests__/import-side-effects.test.ts` (jsdom) | importing `aura-glass/material` adds 0 listeners, 0 timers, 0 DOM mutations | 71 |
| `src/material/__tests__/dev-warnings.test.tsx` | `clear` without backdrop warns once; nested depth ≥2 with `allowNested` warns; `refraction` on content warns; no warnings when `NODE_ENV=production` and counter code absent from prod bundle | 24, 45, 51, 52 |
| `tests/lint/no-optics-outside-material.test.ts` (NEW, ESLint `RuleTester`) | valid/invalid fixtures for every REQ-MAT-63 pattern; `src/material/**` allowed | 63 |
| `tests/ci/verify-optics-css.test.ts` (NEW) | fixture CSS with each REQ-MAT-63 pattern outside `src/material/css/**` fails; generated CSS passes | 64 |
| `tests/ci/count-glass-recipes.test.ts` (NEW) | fixture tree with 0/1/3 emitters → N = 1/2/4; ratchet mode rejects increase | 65 |
| `tests/exports/material-exports.test.ts` (NEW in existing `tests/exports/`) | exact value-export list of `aura-glass/material` (incl. `defineMaterial`); `LensDefs`/`resolveRole` not exported; `{ Surface }` bundle contains no `defineMaterial` code | 01 |

### 12.2 Browser specs (remote, Chromium + WebKit + Gecko) — NEW `tests/material/`, `material` project in QA's cert config

| File | Asserts | REQs |
|---|---|---|
| `tests/material/layer-stack.spec.ts` | host computed `backdrop-filter: none`; `::before` carries blur; `::before` computed `--_ag-blur` equals ladder value and `::after` `--ag-specular` changes on interactive hover (REQ-MAT-13a); host `transform none`, `will-change auto`, `contain none`, `opacity 1`, `filter none`; public read-outs `--ag-surface-*`/`--ag-on-surface*` non-empty on every surface | 13a, 14, 21, 22 |
| `tests/material/nesting.spec.ts` | nested surface `::before` none + inner fill; `allowNested` keeps optics; portaled overlay inside a nested tree keeps optics; disabled surface host opacity 1 | 23–25, 27 |
| `tests/material/group.spec.ts` | 5-child `SurfaceGroup` → exactly 1 visible backdrop-filter; children keep rim/shadow | 25 |
| `tests/material/content-materials.spec.ts` | `layer=content` has no backdrop-filter in any tier; explicit variant opt-in blurs | 26 |
| `tests/material/optics.spec.ts` | per optic row in §5.4: computed filter list order `blur() saturate() brightness()`; blur values 12/20/32 by thickness; no blur >32; grain asset present on `::before`; rim band present in all engines; specular 0 under contrast more; scrim 0.35 for `clear` over light/media | 29–37, 40–44 |
| `tests/material/clear-fallback.spec.ts` | `clear` without backdrop computes same filter/fill as `regular` | 45 |
| `tests/material/tiers.spec.ts` | default is standard; `data-ag-tier=lightweight` and forced colors produce the lightweight rung (fill alpha ≥0.85, `::before` none, light-scheme fill never dark); the `@supports not` block is asserted statically in `css-contract.test.ts` because a supporting engine cannot be made to fail `@supports` | 48, 49 |
| `tests/material/enhanced-gating.spec.ts` | enhanced filter reference only on Chromium + chrome + `data-ag-refraction` + `svg[data-ag-lens-ready]`; inert on WebKit/Gecko (pixel-equal to standard within ΔE ≤1); without `LensDefs` pixel-equal to standard; CLS = 0; no text box intersects displacement (Chromium) | 50, 51, 56, 59, 87 |
| `tests/material/kill-switches.spec.ts` | subtree `data-ag-tier=standard` and `data-ag-transparency=tinted|solid` override `<html>`; provider `tier="standard"` omits `LensDefs` (owned here as interim §16 PRD-15 owner, SC-37) | 17, 87, §4.6 |
| `tests/material/webkit-literal.spec.ts` (WebKit only, L8) | measured: blur actually applied (pixel variance under surface over the `hf-pattern` scene drops ≥40% vs no surface) | 47 |
| `tests/material/no-auto-downgrade.spec.ts` | mounting 20 surfaces does not change any attribute or computed optics in production build | 53 |
| `tests/material/rsc-canary.spec.ts` (run in QA L11 Consumer canaries against PKG's `canaries/next16`) | Server Component page rendering every server-safe material export builds and hydrates with 0 warnings | 06 |
| `tests/material/responsive.spec.ts` | at `(pointer:coarse)` emulation `thick` blur computes 20px and grain ≤0.02; 390×844 modal story ≤3 visible backdrop filters incl. scrim; `ScrollEdge` height within 16–32px and never overlapping a focusable element's box; concentric inner radius ≥0 at compact/regular/spacious; full-width refracting bar at 390px triggers the dev warning | 72–77 |
| `tests/material/a11y-coverage.spec.ts` | DOM sweep over each of the 8 `certification/scenes/` ids (QA-038/039): 100% of live `::before` backdrop filters carry `[data-ag-surface]`; `Environment` media and `ScrollEdge` `aria-hidden`, no material element focusable or with a role; forced-colors computed `Canvas`/`CanvasText`/no shadow; `data-ag-transparency=glass` + `--ag-glass-opacity: 0` cannot lower an OS floor | 78, 80, 82 |
| `tests/a11y/browser/axe.spec.ts` (A11Y-078; MODIFY adds the Material Lab story ids, SC-30) | `@axe-core/playwright` with `color-contrast` enabled, 0 violations on every Material Lab story, 3 engines | 85 |
| `tests/perf/browser/material-surfaces.spec.ts` (driven by PERF's `tests/perf/harness/run-perf.mjs`, PERF-039; SC-30) | §16 frame-rate and long-task budgets, read from `tests/perf/harness/budgets.json` rows submitted here | §16 |

### 12.3 Certification (QA lanes, subjects owned here)

- L6 Environment visual (QA-056) matrix (architecture §15.1) for `Surface`: {regular, clear, identity, content-raised} × {thin, regular, thick} × 8 scenes × {light, dark} × {glass, tinted, solid} × {default, contrast more, forced colors, reduced motion} × tier × {1440, 390}; reduced to the 3 engines. Pixel gates: not blank, surface separation, OCR text contrast ≥4.5:1 worst case, material presence (backdrop luminance variance under the surface fails "glass over nothing"), glass density ≤0.3. The 8 scenes are `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern` and `video-frame` (SC-28). White/black/busy contrast inputs are **composites**. L7 Pixel regression uses REL's visual-class tolerance (SC-09).
- L4 Token contrast: three-composite contrast matrix green (owned by DS; PRD-04 blocks on it).

## 13. Storybook requirements

Storybook becomes the Material Lab (architecture §15.4). The split is fixed by SC-31 and architecture erratum E-07. SB owns `.storybook/preview.tsx` (SB-048), the single decorator `StoryEnvironment` + `StoryRoot` with one `AuraGlassProvider` (REQ-SB-06), the globals (`environment` with the 8 scene ids, `scheme`, `transparency`, `contrast`, `forcedColors`, `motion`, `tier`, `density`, `dir`), the Lab harness `.storybook/lab/**` (`MaterialLabFrame`, `LabControls`, `ContrastReadout`, `spec-export`; SB-060..069) and the Lab titles and order (REQ-SB-18). This PRD writes the story files, all NEW under `src/material/stories/`, against that harness:

| Story file | Content |
|---|---|
| `Material.Lab.stories.tsx` | title `Material Lab`; exactly the 12 REQ-SB-18 stories in this order: `Overview`, `Regular`, `Clear`, `Identity`, `Content Raised`, `Content Sunken`, `Tiers`, `Nesting & Groups`, `Shape & Concentricity`, `Scroll Edge`, `Preferences`, `Motion`. Each renders its subject through `MaterialLabFrame`. `Clear` covers `clear` over light/media with scrim and `clear` with no backdrop (fallback + dev warning). `Tiers` shows the "inert on this engine" label when `data-ag-engine` ≠ chromium. `Nesting & Groups` covers nested collapse, `allowNested`, `SurfaceGroup`, a portaled overlay inside a nested tree, and disabled. `Scroll Edge` shows `edgeStyle` soft/hard over `dense-text`. Live controls and the contrast read-out come from SB's harness (REQ-SB-19/20), not from local knobs |
| `Material.Matrix.stories.tsx` | generated grid of 4 materials × 3 thicknesses per scene from typed metadata (not hand-written); the L6 subject (title per SB) |
| `Material.Optics.stories.tsx` | one story per §5.4 optic isolating it (grain on/off, rim only, specular angle sweep via `--ag-light-angle`, `Environment` image/video); title per SB |

Rules. Stories add no decorators and no globals of their own. Any new global or decorator is requested through an SB task and depends on SB-048 (MAT-090 is a contract check against SB-048, not an edit). The 4.x "no provider dependency" note is withdrawn: every story renders under SB's single provider decorator. Only the harness's `[data-ag-lab-override]` wrapper may set `--_ag-*`. `storybook-utility-shim.css` is imported only from `.storybook/` (PKG-101), never by stories' production CSS. Motion follows the OS setting, with forced reduction only in the CI snapshot run. The 8 `src/components/primitives/LiquidGlass*.stories.tsx` files are deleted in 5.0 (MAT-112). SB's `storybook-index.test.mjs` asserts the 12-story order.

---

## 14. Responsive requirements

- **REQ-MAT-72** Budget thresholds switch by input media, not width: ≤6 blurred surfaces under `(hover:hover) and (pointer:fine)`, ≤3 under `(pointer:coarse)` (dev counter, REQ-MAT-52; certification at 1440 and 390).
- **REQ-MAT-73** At `(pointer:coarse)` the compiled ladder drops one blur step for `thick` (32→20px) and grain to ≤0.02; `thin`/`regular` unchanged. Implemented as a media block inside `ladders.css`, not JS.
- **REQ-MAT-74** Lens maps are keyed by size class, not pixel size. `materialProps` never emits `data-ag-refraction` for the `sheet` size class. A refracting surface whose rendered area exceeds 25% of the viewport (e.g. a full-width bar at 390px) triggers a dev-counter warning (REQ-MAT-52) and fails the enhanced certification cell; there is no runtime auto-removal (D-09).
- **REQ-MAT-75** `ConcentricFrame` radii and insets use `sys.radius`/`sys.space` tokens with the density multiplier (compact 0.875, spacious 1.125); concentric inner radius stays ≥0px at every density.
- **REQ-MAT-76** Full-viewport blur occurs only on `scrim` (≤12px) at every viewport; at 390×844 the modal story shows ≤3 visible backdrop filters including scrim.
- **REQ-MAT-77** `ScrollEdge` height is `clamp(16px, 4vh, 32px)`; it never covers focusable content (sticky chrome writes `--ag-scroll-padding-top/bottom` [A11Y/NAV]).

## 15. Accessibility requirements

The rung bodies are owned by A11Y (A11Y-036..038); this PRD guarantees reach and floors.

- **REQ-MAT-78** Coverage by construction: 100% of elements with a non-`none` `::before` `backdrop-filter` in any certification scene also carry `[data-ag-surface]` (DOM sweep in `tests/material/a11y-coverage.spec.ts`, NEW). This replaces the hand-maintained class list that omitted `.liquid-glass-material` (MATERIAL-ENGINE-07).
- **REQ-MAT-79** Contrast floors: every ladder cell's `--_ag-tint-floor` equals the DS solved value (DS-059); `on-surface` ≥4.5:1, `on-surface-muted` large text ≥3:1, non-text (rim vs adjacent) ≥3:1, and ≥7:1 under `contrast=more`, over white, black and busy composites. Blur contributes nothing to the computation.
- **REQ-MAT-80** OS floors (D-11) [rung bodies: A11Y; PRD-04 guarantees every surface exposes the overridden properties]: under `forced-colors: active` every surface computes `backdrop-filter: none` on `::before`, `background: Canvas`, `color: CanvasText`, `border-color: CanvasText`, no `box-shadow`; under `prefers-reduced-transparency: reduce` and `prefers-contrast: more`, at least `tinted`; no app or user attribute (`data-ag-transparency=glass`, `--ag-glass-opacity: 0`) can lower these. Verified with Playwright `forcedColors`, `contrast`, `reducedTransparency` emulation.
- **REQ-MAT-81** Refraction never under text and never in `contrast=more`, `tinted`, `solid`, reduced motion `none` or forced colors (REQ-MAT-50, -59).
- **REQ-MAT-82** Decorative layers are non-semantic: pseudo-elements only; `Environment` media and `ScrollEdge` are `aria-hidden="true"`; no material element receives focus or a role.
- **REQ-MAT-83** Glyph flipping on small chrome follows declared `data-ag-backdrop` via `--ag-on-surface` (TabBar, Toolbar, IconButton); large surfaces raise floors instead of flipping.
- **REQ-MAT-84** Motion: hover/press light response is instant (0ms) under `prefers-reduced-motion: reduce` or `data-ag-motion=calm|none`; `backdrop-filter`, `filter` and lens displacement are never transitioned.
- **REQ-MAT-85** `@axe-core/playwright` with colour-contrast **on** reports 0 violations on every Material Lab story in all three engines, run from A11Y's `tests/a11y/browser/axe.spec.ts` (A11Y-078).

## 16. Performance requirements (numeric budgets)

Design targets, calibrated by QA L10 Performance (PERF's `tests/perf/harness/run-perf.mjs`) at 5.0.0-alpha.1 and then frozen as ceilings that only ratchet down (D-26). Byte budgets are rows in PKG's `docs/size-budgets.json`. Runtime budgets (fps, surfaces, nesting, long tasks) are rows in PERF's `tests/perf/harness/budgets.json` (PERF-044; SC-15). This PRD submits the rows and does not keep a parallel budget file. The 4.x baselines quoted below were captured with software rasterisation (`autopsy/runtime-remote.md:125-134`); absolute fps comparisons against them are valid only when the 5.0 run uses the same harness configuration, and the GPU-backed profiles below are reported separately.

| Metric | Budget | Measured by |
|---|---|---|
| Visible blurred surfaces per viewport | ≤6 fine pointer, ≤3 coarse pointer (design + dev warning) | dev counter; certification density gate |
| Blur radius | ≤32px any surface; ≤12px full-viewport scrim; never animated | CSS contract test; optics spec |
| Refracting surfaces (enhanced) | ≤2 per viewport, each ≤25% viewport area | enhanced-gating spec |
| Nesting depth of live backdrop filters | ≤1 (nested collapse), ≤2 with `allowNested` | nesting spec |
| Frame rate (provisional, §21), standard tier, 6 surfaces, scripted hover + scroll | ≥55 fps p50 on 120 Hz desktop profile; ≥50 fps p50 on emulated mid-tier mobile with 3 surfaces (4.x baseline: 12–23 fps on modal/app-shell stories) | remote perf harness |
| Frame rate, enhanced, 2 lenses | ≥50 fps p50 on desktop Chromium; ≤2 ms added GPU frame time vs standard at p75 | remote perf harness |
| Long tasks from material code | 0 attributable long tasks; 0 rAF loops; 0 observers in production material code other than the single `<html>` `attributeFilter` MutationObserver of `useMaterialTier` (REQ-MAT-07) | perf harness, grep gate (REQ-MAT-53) |
| `aura-glass/material` JS | ≤3 KB min+gz | `verify-size-budgets.mjs` (PKG) |
| `material.css` | ≤8 KB gz | `verify-size-budgets.mjs` (PKG) |
| Grain asset | ≤4 KB, one request, cached | tarball check |
| Lens maps | ≤9 ids per document; each map built once; total `<defs>` + maps ≤30 KB | this PRD (REQ-MAT-86/87); PERF-063 browser budget spec |
| `AuraGlassScript` | ≤1.5 KB min inline; ≤1 ms execution on mid-tier mobile | A11Y (A11Y-033) |
| CLS from tier/lens resolution | 0 | enhanced-gating spec |
| Hydration | 0 mismatches from material attributes | QA L5 `ssr-hydration` cells (QA-083) + `hydration.test.tsx` |

## 17. Acceptance criteria

- **AC-MAT-01** `scripts/ci/count-glass-recipes.mjs` reports `independent-glass-recipes: 1` on the 5.0.0-beta.1 SHA and every later `main` SHA.
- **AC-MAT-02** `auraglass/no-optics-outside-material` and `verify-optics-css` report 0 violations across `src/**` (stories and tests included) on the beta.1 SHA.
- **AC-MAT-03** All §12.1 unit tests and §12.2 browser specs pass in Chromium, WebKit and Gecko in the remote QA lanes (L5/L8/L12) on the GA SHA, with artifacts retained per SC-07 (release 90 days).
- **AC-MAT-04** `Surface` environment-matrix certification (§12.3) green: 0 cells failing not-blank, surface-separation, material-presence or OCR contrast (worst case ≥4.5:1; ≥7:1 under contrast more).
- **AC-MAT-05** Coverage half (owned here): under forced-colors, contrast-more and reduced-transparency emulation over each of the 8 certification scenes, 100% of elements with a live `::before` backdrop filter carry `[data-ag-surface]` (REQ-MAT-78), and 0 surfaces keep a live backdrop filter under forced colors (4.x baseline: `liquid-glass-material` kept 1 → 1). The rung-correctness lanes themselves are A11Y's exit criterion and are an acceptance input here, not re-certified.
- **AC-MAT-06** `renderToString` + `hydrateRoot` of every server-safe material export: 0 warnings; Next 16 canary `next build` passes with them imported from a Server Component.
- **AC-MAT-07** For each of the 3 × 3 × 4 role combinations, rendered `Surface` has no `style` attribute (absent consumer `style`) — 36/36.
- **AC-MAT-08** A 5-control `SurfaceGroup` has exactly 1 visible backdrop filter; a nested input inside a dialog has 0 on the input.
- **AC-MAT-09** Perf lane meets §16 frame-rate budgets; the 4.x glass-modal-equivalent 5.0 scene (Dialog over app shell) ≥50 fps p50 on mobile profile.
- **AC-MAT-10** Enhanced: on WebKit and Gecko, enhanced-eligible surfaces are within ΔE2000 ≤1 of standard on 99% of pixels; on Chromium, 0 text boxes intersect non-zero displacement. If not met by RC-1, `refraction` ships inert (still `@preview`) and this PRD, as interim §16 PRD-15 owner, promotes it in 5.1 (D-05) without failing this AC.
- **AC-MAT-11** Size: `aura-glass/material` JS ≤3 KB gz, `material.css` ≤8 KB gz on the GA artifact.
- **AC-MAT-12** Every R1–R13 row in §5.10 has a `deprecations.json` entry (4.2) and is absent from the 5.0 root and subpaths except `aura-glass/compat`; `rg` check in REQ-MAT-67 returns only `src/compat/**`.
- **AC-MAT-13** Frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (REL-115; QA job `consumer-4x-frozen`, QA-087) is pixel-unchanged on 4.3 without `data-ag-preview`, and renders the 5.0 material with the attribute (D-19).
- **AC-MAT-14** Tailwind bridge parity test passes: 5/5 utilities byte-identical to attribute rules.
- **AC-MAT-15** Human review (QA L14 Human visual review, rubric `certification/review/visual-rubric.md`, QA-099/105) signs off specular quality, optical hierarchy, radius rhythm and "reads as one hand" on the six product scenes; recorded as a GA-blocking checklist item.

---

## 18. Definition of done

1. REQ-MAT-01..87 and REQ-MAT-13a implemented, each linked to a passing test in §12 or an explicit `[owner: <KEY>]` acceptance input that the owning PRD has closed.
2. AC-MAT-01..15 met on the GA SHA, with CI artifacts (not committed evidence, D-32) linked from the release.
3. `etc/api/material.api.md`, `etc/api/material.exports.json` and `etc/api/material.css-api.json` reviewed and frozen; API report diff classified (C-E for 4.2 additions, C-B list in §10 matching `deprecations.json`).
4. Every §5.10 row has: 4.2 `deprecations.json` entry, dev warning, SC-33 codemod id (or `null`) with a passing DX fixture under `packages/cli/src/migrate/4to5/__fixtures__/<id>/`, and a 5.0 deletion PR (one revertable PR per family).
5. Material Lab stories (§13) published in the docs Storybook on SB's `.storybook/lab/**` harness, in the REQ-SB-18 order, under SB's single decorator, rendering over the 8 scenes.
6. `docs/liquid-glass/primitives/liquid-glass-material.md` replaced by DX's `docs/guides/choosing-a-material.md` (DX-127) that documents variant × thickness × layer, `clear` discipline, nesting, groups, tiers and kill switches; no unsourced numeric claims.
7. Remote perf calibration recorded; §16 byte budgets frozen as rows in `docs/size-budgets.json` (PKG-048) and runtime budgets as rows in `tests/perf/harness/budgets.json` (PERF-044).
8. No temporary probe scripts added by this work remain at the repo root (the existing root `probe-*.mjs` files are deleted by TRUST, REQ-TRUST-36).
9. No simulated completion: no test is skipped, `.only`-scoped, snapshot-only for a pixel claim, or asserting a constant; no gate passes by allowlisting the material's own failures; every REQ marked done links a test that fails when the behaviour is reverted (spot-checked by reverting one CSS rule per §5 subsection on a throwaway branch in the remote lane).

## 19. Dependencies

Anchor tasks are from SC-40. Task-level `depends_on` cites only these real ids.

| Key (§16) | Relationship | What PRD-04 needs / provides | Anchor tasks |
|---|---|---|---|
| REL (PRD-01, + interim PRD-17) | upstream | `deprecations.json` schema and gate, API report scripts, `warnDeprecated`, frozen 4.x fixture, visual-class tolerance, 4.2/4.3 train scope and gates | REL-010, REL-003, REL-072, REL-115, REL-090, REL-125 |
| TRUST (PRD-00) | upstream | root `deprecations.json` seed, API report/export snapshot scripts | TRUST-075, TRUST-071/072 |
| PKG (PRD-02) | upstream | `./material`, `./material.css`, `./styles.css` manifest rows; plugin/jest wiring; side-effect gate; size budgets; `glass-pipeline.yml`; `src/styles/index.css` | PKG-005, PKG-015, PKG-038, PKG-042, PKG-048, PKG-101 |
| DS (PRD-03) | **hard upstream** | token compiler, `glass-material` transform, ladders with literal `-webkit-`, `@property` registry, solved floors, Tailwind bridge, `compat/tokens.css` | DS-016, DS-036, DS-048, DS-049, DS-059, DS-090, DS-103 |
| A11Y (PRD-05) | downstream consumer + contract owner | `AuraGlassScript` (REQ-MAT-54..56), provider (dev-counter host, `LensDefs` mount), portal root, `ag.a11y` rungs, browser axe spec | A11Y-032, A11Y-029, A11Y-049, A11Y-036, A11Y-078 |
| MOT (PRD-06) | downstream | consumes `--ag-light-angle`, `--ag-specular`, `[data-ag-animating]`; owns pointer light, View Transition optics drop and `glass.css` removal | MOT-040, MOT-042, MOT-045, MOT-084 |
| FND (PRD-07/14/16) | downstream | wrapping pattern, `usePortalContainer()`, T2 migration, removal families (Houdini, GPU, WebGL fakes) | FND-007, FND-123, FND-128 |
| CTL, OVL, NAV, DATA, AI, MED (PRD-08..13) | downstream | migrate components in §7 onto the engine; MED `Backdrop` presets self-declare `data-ag-backdrop` | CTL-055, OVL-040, NAV-016, MED-060 |
| this PRD as interim PRD-15 | owned here (SC-37) | lens maps, `LensDefs`, bezel clamp, kill switches, enhanced certification by RC-1 | MAT-035, MAT-078, MAT-079, MAT-119, MAT-120 |
| DX (PRD-18/20) | downstream | codemod engine and transforms, compat index, `doctor --v5`, "Choosing a material" guide | DX-041, DX-042, DX-065, DX-037, DX-127 |
| QA (PRD-19 cert) | parallel (starts Wave 1) | 8 scenes, jest and cert Playwright configs, `certify-pr.yml`, L6/L8/L10/L14 lanes | QA-003, QA-018, QA-031, QA-038/039, QA-056, QA-075, QA-099 |
| SB (PRD-19 Storybook) | parallel | `.storybook/preview.tsx`, Lab harness, REQ-SB-18 order | SB-048, SB-060 |
| PERF | parallel | runtime budget file and harness, lens budget spec | PERF-039, PERF-044, PERF-063 |
| EXP (interim PRD-21) | downstream | cinematic resident honouring REQ-MAT-60..62 in `packages/labs/` | none yet (no labs package task exists; §21) |

## 20. Execution order

1. **Contract freeze (Wave 2 start).** Land `src/material/types.ts`, the `etc/api/material.api.md` draft (REL's `api-report.mjs`) and the `etc/api/material.css-api.json` draft; review against architecture §4.2/§4.4/§4.5. Blocks every downstream PRD.
2. **Lint in ratchet mode.** Land `auraglass/no-optics-outside-material` as `warn` plus `scripts/ci/count-glass-recipes.mjs` in ratchet mode (N may not increase) and `verify-optics-css.mjs`, as steps in the `Glass Quality Gates` job of `glass-pipeline.yml` (PKG-038). Record baseline N.
3. **Compiler hand-off.** With DS (DS-036/048/049/059), emit `ladders.css`, `properties.css`, `floors.css` from the `MaterialSpec` composite; land `properties.test.ts`, `css-contract.test.ts`, `tint-formula.test.ts`.
4. **Structural CSS.** Land `material.css` (layer stack, nesting, group, content, shape, scroll edge, state opacity) and the Tailwind parity test.
5. **Components.** Land `materialProps`, `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `useMaterialTier`, dev counter/warnings; unit tests §12.1.
6. **4.2 bridge.** Ship `aura-glass/material` experimental (C-E); deprecations for §9 (C-D); `glass.generated.css` fallback scoping only if approved as a D-28 extension (deviation note 6); C-D entry for the shim import (removal is 5.0, PKG-101). REL holds the 4.2 scope and gate (REQ-REL-26, REL-090).
7. **Browser lanes + Material Lab.** Land `tests/material/*.spec.ts` as the `material` project of QA's cert config and the §13 stories on SB's harness; first environment-matrix run on `Surface`.
8. **4.3 preview.** Six 4.x primitives emit `data-ag-surface` + role attributes; `[data-ag-preview="v5"]` applies compiled CSS; frozen fixture check (AC-MAT-13).
9. **5.0 alpha migration.** CTL-055 (Button) and OVL-040 (Dialog) prove the FND wrapping pattern on `Surface`; perf lane calibrates §16 and §3.6; flip lint to `error` for families migrated so far and add their files to the recipe-metric no-regression list (ratchet per family PR; the hard N > 1 failure starts at beta.1, REQ-MAT-65).
10. **Enhanced hook-up.** `lens.css` selectors + `data-ag-sizeclass`; this PRD (interim §16 PRD-15) lands `lens-maps.mjs`, the maps and `LensDefs`, and A11Y mounts `LensDefs` in the provider; enhanced-gating spec green (or deferred per D-05).
11. **Deletion.** One revertable PR per §5.10 family removes the 4.x recipe after its consumers migrate; compat adapters (`src/compat/material/`) land with DX's codemods.
12. **Beta gate.** AC-MAT-01/02/12 green (recipes = 1). Then RC: AC-MAT-03..11, 14; GA: AC-MAT-15 human review.

## 21. Open items

Reconciled against `_shared-contracts.md` and `_verification-remaining-concerns.md` (MAT section and MAT mentions elsewhere) on 2026-10-06.

**Resolved in this revision.**

| Concern | Resolution |
|---|---|
| Arch §4.7 "only scale animates" for lens maps | Static scale, with no JS attribute writes (SC-37, E-10). REQ-MAT-58 |
| Deviation 1 file name | SC-01/E-07 ratify `AURAGLASS_*_PRD.md`. Deviation note 1 |
| Private `data-ag-sizeclass/-radius/-spacing/-inset` | Ratified in SC-21, with `-edge`, `-edge-style`, `-lens-ready` and `-full-height`. REQ-MAT-17 |
| `data-ag-backdrop=auto` does not satisfy `clear` | Ratified (SC-21, E-03). REQ-MAT-45 |
| `ScrollEdge` `style` prop | Renamed to `edgeStyle` (SC-22, E-01). REQ-MAT-10, §4.3 |
| Kill-switch ownership overlap with PRD-15 | This PRD owns them as interim §16 PRD-15 owner (SC-37). §4.6, MAT-079 |
| §13 Lab harness, REQ-SB-18 order, "no provider dependency" | Adopted SB's `.storybook/lab/**`, the 12-story order and the single decorator (SC-31). §13 |
| `@layer` browser floor (PKG concern) | Acknowledged as the REQ-PKG-96 baseline (E-09). Deviation note 8 |
| PERF tightening request: nesting depth >1 and `allowNested` depth ≥2 counter thresholds | Accepted. REQ-MAT-24, REQ-MAT-52 |
| MED request to confirm `data-ag-media-tone` | Confirmed as a ratified MED addition in the SC-21 registry, which this PRD owns. REQ-MAT-17 |
| DS floor aggregation (max across presets/schemes/variants per transparency × thickness × backdrop) | Accepted by the PRD-04 owner as the conservative choice for the REQ-MAT-33 keying. Light presets may get higher-than-minimal floors, which is preferred to under-contrast |
| Ownership of `premium-typography.css`/`keyframes.css` non-token content (DS concern) | PRD-04 owns none of it. Keyframes belong to MOT and typography rules to DS |
| `compat/tokens.css` owner | DS, not §16 PRD-17 (SC-19). REQ-MAT-69 |
| Layer statement variant | Full six-name statement only (SC-20). §4.1, REQ-MAT-19 |
| `aura-glass/material/define` subpath | Dropped. `defineMaterial` ships from `./material` (SC-12, arch §3.2). REQ-MAT-01, API-3 |

**Still open.**

| # | Item | Owner | How to close |
|---|---|---|---|
| O-1 | Extending D-28 to the `[class*="glass-"]` fallback scoping in 4.2 (API-17, MAT-098) | REL (4.2 scope, D-28 list), reviewer approval | REL records approval and the before/after composites in `docs/release/decisions/4.2.0-gate.md` (REL-090), or the fix moves to 5.0 and MAT-098 is closed as won't-do |
| O-2 | Fresnel threshold (≥12 levels, REQ-MAT-36) and the §16 fps targets (55/50 fps) are unmeasured design targets | MAT, with QA L6/L10 and PERF | Calibrate at 5.0.0-alpha.1 on the remote GPU profile (QA-123, PERF-044). Commit the measured values as `budgets.json` rows and update this PRD, ratchet-down only |
| O-3 | WebKit `var()` inside `-webkit-backdrop-filter`, and the visual claims in §5.4 | MAT (MAT-080), QA L8 | Run `webkit-literal.spec.ts` and QA-075 on Safari 18/26. If `var()` works, remove the literals under C-I (REQ-MAT-47) |
| O-4 | Architecture erratum E-02 (pseudo-element `inherit` rule) is not yet applied upstream | architecture owner | Apply E-02 to §4.4/§4.6. This PRD already complies (REQ-MAT-13a) |
| O-5 | `data-ag-lens-defs` is a new private MAT attribute that is not yet listed in SC-21 (PERF-063 already selects it) | MAT (registry owner), REL (program index) | Add it to the SC-21 private MAT list |
| O-6 | `scripts/build/lens-maps.mjs`: SC-11 describes `scripts/build/` as exports generation | PKG (SC-11 owner) | PKG confirms that `scripts/build/` covers build-time asset generation, or names another directory. MAT-119 moves accordingly |
| O-7 | Two-remover overlaps outside §H: FND-128 (RM-11 "material losers": `GlassCore`, `OptimizedGlassCore`, `LiquidGlass*`, `primitives/glass/`) vs MAT-107/111/112, and DS-111 (deletes `glass.generated.css`) vs MAT-110 | REL (program index §H) | Proposed: MAT keeps the REMOVE for its recipe files. FND-128 drops the material losers and DS-111 drops `glass.generated.css` from its delete list, depending on MAT-110 instead. Record as OV-33/OV-34 |
| O-8 | The EXP labs package has no task for the cinematic resident contract, so no anchor exists for REQ-MAT-60..62 consumers | EXP (interim §16 PRD-21) | EXP adds a `packages/labs/` resident task that cites REQ-MAT-61/62 in `acceptance`. MAT-066 stays the core-side contract |
| O-9 | REL-118 (`.storybook/preview.tsx` `preview` global on `release/4.x`) lists `PRD-04` in `depends_on` | REL | Change it to `MAT-101` (SC-40) |
| O-10 | REQ-MOT-130 (Dialog ≥55 fps) depends on this PRD cutting live backdrop filters to ≤3 in a modal | MOT, MAT | REQ-MAT-76 and the `responsive.spec.ts` 390×844 modal case enforce ≤3. Close when MOT's Dialog measurement runs in QA L10 |

Not verified in this revision: the line references in §2 and §6 date from `15b6de6f7` and were not re-checked against the source tree. Task-graph validation uses only the rules in SC-40, because REL's `scripts/release/verify-task-graph.mjs` does not exist yet.
