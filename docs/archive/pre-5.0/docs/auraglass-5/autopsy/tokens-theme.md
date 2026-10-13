# AuraGlass 5.0 Autopsy: Tokens, Themes, Personas, Design System

Scope: `tokens/`, `src/tokens/`, `src/theme/`, `src/design-system/`, `src/contexts/`, `src/styles/` (token layers), `scripts/build-tokens.js`, `scripts/generate-glass-css-simple.js`, `scripts/generate-persona-css.ts`, `scripts/ci/token-lint.js`, `docs/design-tokens.md`, `docs/theme/theme-engine.md`, `dist/tokens/*`, `reports/token_violations.csv`, `reports/css_variables_matrix.csv`.

Method: I read the code and counted with `rg`, scoped to `src/` and excluding snapshots, stories and tests unless noted. I could not view the certification screenshots: the image reader returned empty output for these PNGs, so this report contains no visual judgement. Every claim comes from code. I did not run a build or typecheck.

Two caveats on the counts. Variable-usage counts are static: they cannot see a custom property set from JS with a computed name. Raw-literal counts include legitimate data-viz palettes.

---

## 1. Summary and score

**Score: 3/10**

AuraGlass has no token system. It has at least five parallel ones, and none of them is the real source of truth. Each layer calls itself canonical:

- `src/tokens/glass.ts:4` says "SINGLE SOURCE OF TRUTH".
- `scripts/build-tokens.js:46` says "Source: tokens/personas/*.json".
- `docs/design-tokens.md:9` says "canonical source ... `src/theme/designMatrix.ts`".

The values disagree, and the rendered material ignores most of them:

- The inline material factory `glassTokenUtils.buildSurfaceStyles` hard-codes one gradient and one border for all 30 intent×elevation specs (`src/tokens/glass.ts:995-1001`, `:1030`).
- 569 of the 621 `--aura-*` variables generated from the "canonical" JSON (92%) are never read.
- 58 of the 74 persona variables are never read.
- None of the 17 variables emitted by "Theme Engine 2.0" is consumed by any component.

The material has a single mode: white frost on a fixed scale of heavy blur (16–48px). It is not mode-aware, backdrop-aware, or contrast-aware. Light mode, high contrast and reduced transparency are patched afterwards with selector overrides and `!important`. The 10 "personas" are all dark-canvas accent swaps that share one hard-coded glass surface.

The parts worth keeping:

- The JSON → CSS/TS/Tailwind build pipeline shape.
- The color/contrast math in `src/theme/color.ts`.
- The generator-time guard that stops personas tinting the material.
- The vocabulary in `LIQUID_GLASS.system`: scroll-edge, concentric radii, clear dimming, groups.

This is a generic React library with `backdrop-filter: blur()` and a lot of naming. It is not a first-party material system.

---

## 2. What exists (counts)

| Layer | Files / size | What it defines | Who consumes it |
|---|---|---|---|
| JSON token manifest | `tokens/index.json` (30 lines), `tokens/personas/default.json` (1,145 lines), `tokens/schema.json` (377 lines) | 1 persona (`auraglass-default`): color, typography, spacing, motion, marketing, and 30 glass surface specs | `build-tokens.js` turns it into 621 `--aura-*` vars. 52 of them are read in `src`. `schema.json` is never validated (no ajv/schema reference in `scripts/`). `liquidGlassSystem` in `index.json` is read by nothing. |
| TS canonical glass tokens | `src/tokens/glass.ts` (1,645 lines) | `AURA_GLASS` (30 surface specs, motion, radii, gaps), `PERFORMANCE_TIERS`, `LIQUID_GLASS` (IOR, thickness, sheen, tint, motion fluency, system) | `createGlassStyle()` → inline styles (66 component files); `LiquidGlassMaterial` |
| TS "design constants" | `src/tokens/designConstants.ts` (347 lines) | `ANIMATION`, `COLORS`, `TYPOGRAPHY`, `SPACING`, `BORDER_RADIUS`, `BOX_SHADOW`, `Z_INDEX`, `GLASS` | `ANIMATION.*` used 449 times in components, `COLORS` 31, `BORDER_RADIUS` 9 |
| TS theme objects | `src/tokens/themeTokens.ts` (542 lines) | `lightTheme`, `darkTheme`, `glassTheme` | 1 consumer (`components/advanced/IntelligentColorSystem.tsx`) plus a re-export |
| Generated TS | `src/tokens/generated.ts` (1,281 lines) | JSON mirrored into TS | `aura-glass/tokens` types |
| Hand-mirrored glass CSS | `scripts/generate-glass-css-simple.js` → `src/styles/glass.generated.css` (1,012 lines) | `--glass-{intent}-level{n}-*` and `.glass-{intent}-level{n}` classes | Class path |
| Persona matrix | `src/theme/designMatrix.ts` (1,043 lines) → `src/styles/generated/persona-variables.css` (769 lines) | 10 personas × 74 vars (`--glass-theme-*`, `--persona-*`) | 16 of the 74 vars are read anywhere |
| Theme Engine 2.0 | `src/theme/createGlassTheme.ts`, `GlassThemeProvider.tsx`, `materials.ts` (`aura-glass/theme` subpath) | brand/mode/density/motion → 17 `--glass-theme-*` vars, plus 5 material presets | 0 of the 16 unique-name vars are read. `--glass-theme-text` is the only shared name, and it collides with the persona var of the same name |
| Unified ThemeProvider | `src/theme/ThemeProvider.tsx` (1,606 lines) | 8 contexts (color mode, variant, persona, style utils, effects, prefs, responsive, presence). Writes `data-aura-theme`, `data-aura-mode`, `data-theme`, `data-persona` | Root `aura-glass` export |
| Hand CSS token layers | `tokens.css` 420, `variables.css` 854, `themes/dark.css` 210, `themes/light.css` 205, `glass.css` 4,605, `design-tokens.css` 300, `typography.css` 167, `animations.css` 605, `theme-transitions.css` 155 | `--glass-*` primitives and semantics, light/dark overrides, a11y media queries | Everything |
| Dead CSS | `premium-typography.css` 252, `keyframes.css` 28 | Not `@import`ed by `src/styles/index.css` or `glass.css` | Nothing |
| Shipped CSS | `dist/styles/index.css` 373 KB | 1,430 unique custom properties: 643 `--aura-*`, 633 `--glass-*`, 38 `--persona-*`, plus 116 in 15+ other namespaces (`--liquid`, `--ag`, `--gm`, `--grad`, `--brand`, ...) | |

Consumption in production components (415 `.tsx` files under `src/components`, excluding stories and tests):

- 287 files reference at least one `var(--…)`. 280 reference `var(--glass-…)`. 35 reference `--aura-*`.
- 180 files (43%) contain raw color or blur literals: 1,209 numeric `rgba(`/`rgb(` occurrences, 505 hex literals across 69 files, 273 `hsl(` occurrences, and 76 inline `blur(Npx)`.
- Only 17 files use the primitive-opacity token form `rgba(var(--glass-color-white) / var(--glass-opacity-N))`.
- Worst offenders by literal count: `ai/GlassMusicVisualizer.tsx` 60, `media/GlassAdvancedVideoPlayer.tsx` 43, `search/GlassIntelligentSearch.tsx` 39, `input/GlassColorPicker.tsx` 38, `atmospheric/GlassBiomeSimulator.tsx` 37.
- 1,909 Tailwind-style slash utilities (`glass-text-primary/80`, `glass-border-white/25`, ...) appear in TSX. 70 of the 158 unique ones are defined in no CSS file. Non-story components use undefined ones 324 times (top: `glass-border-glass-border/20` ×70, `glass-text-primary/80` ×48).

The reports in `reports/` are stale. `token_violations.csv` (1,301 rows: 369 hardcoded_opacity, 309 hardcoded_animation, 276 missing_contrast_guard, 141 hardcoded_color) and `css_variables_matrix.csv` (556 vars, 74 conflicts) were last committed on 2025-11-07, 11 months and two majors ago. Today's counts are worse for colors (1,209 numeric rgba in TSX against 141 recorded `hardcoded_color`). Treat them as history, not current state.

---

## 3. What is excellent (keep)

- **The build pipeline shape.** `scripts/build-tokens.js:95-114` loads a manifest and asserts required keys. It emits CSS vars, a keyframes CSS file, Tailwind and UnoCSS presets, JSON, ESM/CJS modules and TS types (`:534-559`), and prettier-formats its `src/` output so builds stay idempotent (`:25-35`). This is the right skeleton for a DTCG pipeline.
- **The persona/material boundary guard.** `scripts/generate-persona-css.ts:51-60` rejects any persona whose glass surface is not near-white at an alpha between 0.015 and 0.12. That is a real design-system invariant enforced at generation time. Keep the idea: brand may tint canvas and accent, never the material.
- **Contrast math.** `src/theme/color.ts` (`contrastRatio`, `relativeLuminance`, `bestTextColor`, `mixHex`). `createGlassTheme` computes contrast metadata per theme (`createGlassTheme.ts:179-183`).
- **Theme Engine 2.0 API shape.** `createGlassTheme({ brandColor, mode, density, motionPolicy })` and the `mode: "high-contrast"` and `motionPolicy` axes (`createGlassTheme.ts:13-15`) are the correct public axes. Only the plumbing is missing.
- **Liquid Glass system vocabulary.** `LIQUID_GLASS.system` (`glass.ts`, about lines 1290-1330): scroll-edge soft/hard, concentric inset radii, a layer depth warning, clear-variant dimming, group spacing, and an illumination delta per interaction state. These map onto Apple's 2025 Liquid Glass concepts and belong in 5.0 as first-class tokens.
- **The reduced-transparency path exists.** `glass.css:4022-4052` honours `prefers-reduced-transparency`, and `@supports not (backdrop-filter)` fallbacks exist (`glass.generated.css:1006`).
- **The tokens subpath exports** (`package.json:17-37`: `./tokens`, `/json`, `/tailwind`, `/css`, `/keyframes`, `/manifest`). This is the right distribution surface.

---

## 4. What is mediocre

- **Light/dark is selector soup.** At least 7 mode signals exist: `data-theme` (39 CSS hits), `data-bg` (10), `data-aura-mode` (2), `data-aura-theme` (3), `data-persona` (10), `.glass-on-light`/`.glass-on-dark` (14), and `.dark`/`.light`. `ThemeProvider.tsx:753-777` writes four of them at once. The light theme activates on `:root:not([data-theme="dark"])` (`themes/light.css:5`), so the absence of an attribute counts as a mode.
- **Light-mode correctness is patched per selector.** `glass.css:76-91` redefines `--glass-theme-text` on light glass because "the active persona ... must not leak its dark-canvas white text into a luminous glass surface". `--glass-theme-text` is assigned 28 times in 8 files with 17 distinct values, and `--glass-text-primary` 31 times in 20 files with 14 distinct values.
- **Text color is bound to intent, not to the backdrop.** `glass.generated.css` sets neutral and success text to `rgba(255,255,255,0.98)` (`:33`, `:195`, applied at `:502`, `:672`). The same surfaces in `glass.ts` (level1 `text.primary` ≈ line 87) and `default.json` use slate `rgba(15,23,42,0.94)`. One material, opposite foregrounds.
- **Motion tokens live in JS milliseconds.** `ANIMATION.DURATION.*` (449 uses) are numbers baked into inline transitions. CSS reduced-motion or density policy cannot retune them centrally.
- **Typography scale.** Rem-based in JSON (display 3.5rem, `default.json` typography.scale), px-based in personas (body 13–15px, tracking 0.05–0.5px, `designMatrix.ts:152-178`), and three font stacks (`default.json` mono = JetBrains Mono, `designConstants.ts:104` mono = SF Mono). Nobody reads `--persona-typography-*` or `--glass-theme-typography-*`.
- **Density.** Defined three ways: `createGlassTheme` densityTokens (`:72-91`), `LIQUID_GLASS.system.density` multipliers, and `concentric.inset`. `data-density` appears 0 times in CSS. No component reads `--glass-theme-control-height`, `-gap` or `-page-padding`.
- **Tailwind export.** It ships `var(--aura-color-semantic-primary)` hex colors (`dist/tokens/tailwind.theme.mjs`). Tailwind v3 opacity modifiers (`bg-primary/50`) will not work, and the export has no material utilities. Its `rounded-md` is 0.5rem while components render 16px radii.

---

## 5. What is outdated

- **Heavy-blur frosting as the material model.** The blur scale runs 16/24/32/40/48px (`tokens.css:40-45`; `--glass-blur-2xl` and `--glass-blur-3xl` are both 48px). Every surface uses fixed `saturate(1.4) brightness(1.08) contrast(1.04)` (`glass.ts:1003-1021`). Modern Liquid Glass is low blur plus lensing/refraction, specular edge light, adaptive tint, and legibility driven by what is behind the glass. A fixed white-alpha ramp is the 2020 Dribbble glassmorphism look.
- **No modern CSS.** There is no `@layer` (0 occurrences), no OKLCH, no `light-dark()`, and no `@property` typed tokens. `color-mix` appears 3 times. Specificity is fought with `!important`: 75 in `glass.css`, 37 in `design-tokens.css`, 15 in `index.css`.
- **Tailwind 2019 defaults posing as tokens.** `BOX_SHADOW` (`designConstants.ts:199-210`) and `BORDER_RADIUS` (`:187-196`) are verbatim Tailwind v2 values. `ANIMATION.EASING.elasticOut` equals `bounceIn` (`:31`, `:34`).
- **Storybook shims ship to consumers.** `src/styles/index.css:24-25` imports `storybook-enhancements.css` (`.sb-story { … !important }`) and `storybook-utility-shim.css` (792 lines of `.flex`, `.grid`, `.absolute` …) into the published `aura-glass/styles` (`dist/styles/index.css` contains `.sb-story`). Global `.flex`/`.grid` collide with any host app's Tailwind.
- **An invalid CSS declaration.** `theme-transitions.css:52-54` is `@media (prefers-contrast: high) { forced-colors: active; }`. `forced-colors` is a media feature, not a property, so the block does nothing.

---

## 6. Duplication

The same token is defined in many places with different values:

| Token | Values found |
|---|---|
| Radius "md" | 16px (`tokens.css:60`, `glass.ts:856`), 0.5rem/8px (`default.json` spacing.radii → `--aura-radius-md`, Tailwind export), 0.375rem/6px (`designConstants.ts:190`), 0.75rem/12px (`docs/design-tokens.md:249`, `createGlassTheme.ts:81`), persona panel 10px (`designMatrix.ts:182`ff.) |
| Primary color | `hsl(217 91% 60%)` ≈ #3b82f6 (`tokens.css:7`), #6366f1 (`default.json` semantic.primary → `--aura-color-semantic-primary`), #4FD6FF (default persona accent, `designMatrix.ts:139`), #7dd3fc (`createGlassTheme.ts:123`) |
| Success | `hsl(160 84% 39%)` (`tokens.css:8`), #22c55e (`default.json`, `createGlassTheme.ts:163`), #3BE0AA (persona), literal `rgba(34,197,94,…)` in `glass.generated.css` |
| Motion "normal" | 250ms (`default.json`, `tokens.css:110`), 300ms (`designConstants.ts:18`), 200ms (`glass.ts:850` `defaultMs`), 220ms (`createGlassTheme.ts:114`), persona entry 300–320ms |
| Easing "standard" | `cubic-bezier(0.2,0.8,0.2,1)` (`default.json`, `createGlassTheme.ts:115`), `cubic-bezier(0.2,0,0,1)` (`tokens.css:119`) |
| Neutral level1 surface | `0.25→0.15` gradient (`default.json:266`), `0.12/0.08/0.08` (`glass.ts:71`, `generate-glass-css-simple.js:26`), `0.105/0.035/0.018` (actually rendered: `glass.ts:997`, `designMatrix.ts:100-101`) |
| Neutral text on glass | slate 0.94 (`glass.ts`, JSON) against white 0.98 (`glass.generated.css:33`) |
| Quality tier taxonomy | `auto/low/medium/high` (`glass.ts:29`), `ultra/high/balanced/efficient` (`default.json` performance, `LIQUID_GLASS.performance`), `ultra/high/medium/low/minimal` (`ThemeProvider.tsx:19`) |
| Motion preference systems | `MotionPreferenceContext` (`auto/always-safe/never-safe`), `AnimationContext.reducedMotion`, `createGlassTheme` `motionPolicy` (`system/reduced/expressive/none`), `hooks/useReducedMotion.ts` **and** `hooks/useReducedMotion.tsx`, `hooks/useEnhancedReducedMotion.ts`, `LIQUID_GLASS.system.reducedMotion`. 261 files touch reduced-motion APIs. |
| `GlassThemeProvider` | Two different components share the name: `src/theme/GlassThemeProvider.tsx:47` (Theme Engine 2.0, `aura-glass/theme`) and the alias `ThemeProvider.tsx:1606` (Unified provider) |
| `useGlassTheme` | `theme/GlassThemeProvider.tsx:131` (GlassThemeContext) and `hooks/useGlassTheme.ts:5` (core `ThemeContext`) |
| Liquid-glass system tokens | `tokens/index.json` `liquidGlassSystem` (unused) duplicates `LIQUID_GLASS.system` |
| Glass CSS | `glass.generated.css` is generated from **hand-copied** constants (`generate-glass-css-simple.js:7`: "values below MUST mirror AURA_GLASS"), not from `glass.ts` or the JSON |

Docs drift as well: `docs/design-tokens.md:136-141` lists the blur scale as sm 4 / md 8 / lg 16 / xl 24 / 2xl 32, while the code has 16/24/32/40/48 (`tokens.css:40-45`). The radius doc (`:247-251`) gives sm 8 / md 12 / lg 16, while the code has 10/16/24.

---

## 7. Fake complexity

- **Index of refraction does almost nothing.** `LIQUID_GLASS.material.ior` defines glass 1.52, crystal 1.76, liquid 1.33 and diamond 2.42. Components pass hand-tuned IORs (`GlassButton.tsx:887` uses 1.48/1.44, `GlassInput.tsx:270` uses 1.46/1.43). The only effect, in `LiquidGlassMaterial.tsx:357-367`, is that any `ior > 1` swaps `saturate(1.4)` for `saturate(1.5)`. Water and diamond render identically. (The WebGL path in `LiquidGlassGPU.tsx:517` does pass `uIOR`, but that is an opt-in advanced component, not the material.)
- **30 surface specs collapse to one.** `buildSurfaceStyles` (`glass.ts:960-1037`) ignores `surface.base`, `surface.overlay`, `border`, `noiseOpacity` and `text` for every intent and elevation. It returns the same gradient (`:997`), the same `backgroundColor` (`:1001`), the same border (`:1030`), and a blur chosen by a ternary chain instead of interpolation. The fallback in `createGlassStyle` (`glassMixins.ts:62-65`) can never fire.
- **Performance tiers.** `PERFORMANCE_TIERS.*.blurMultiplier` is 1.0 on every tier (`glass.ts:874-907`, "Canonical blur scale is invariant across tiers"). `saturateMultiplier` is never applied (saturation is hard-coded to 1.4), and `enableNoise` is never read by `buildSurfaceStyles`. The persona JSON adds a fourth tier set with `blurMultiplier` 0.65–1.0 that nothing reads.
- **Personas.** There are 10 personas, each with narrative metadata (`primaryContext`, `narrativePillars`, `microinteractionNotes`, `designMatrix.ts:105-128`). Only `PersonaPicker.tsx:65` displays any of it. All 10 have dark canvases (#060B1C–#120E1A) and near-white text, and all share `PERSONA_GLASS_SURFACE` (`designMatrix.ts:100`). 58 of 74 vars per persona are unread. `--glass-theme-background-canvas`, `-base-grid`, `-overlay-blur`, `-focus-ring` and all typography vars have 0 consumers. `ThemeProvider.tsx:118-129` admits that personas cannot change the glass token block at all.
- **The token lint is close to theatre.** `scripts/ci/token-lint.js:305-331` scans only `src/components/**/*.css` (37 files exist), not the 415 TSX files where the literals live. It also excludes 17 component directories (`advanced`, `ai`, `dashboard`, `chat`, `layouts`, `collaboration`, …). It cannot see any of the 1,209 TSX rgba literals.
- **Unvalidated JSON schema.** `tokens/schema.json` (377 lines) is never loaded by any script.
- **`designConstants` side effect.** `designConstants.ts:3,316` calls `createGlassStyle` at module load to build `GLASS.variants.clear`. The tokens module therefore imports the mixin layer, which imports tokens back.

---

## 8. Critical findings

| ID | Severity | Claim | Evidence |
|---|---|---|---|
| TOKENS-THEME-01 | critical | There is no single source of truth: five token layers, each claiming to be canonical, with conflicting values for radius, primary color, motion, surface fill and text-on-glass. | `glass.ts:4`; `build-tokens.js:46`; `docs/design-tokens.md:9`; `generate-glass-css-simple.js:7`; the duplication table in §6 |
| TOKENS-THEME-02 | critical | The rendered inline material ignores its own tokens. `buildSurfaceStyles` hard-codes one background gradient, backgroundColor and border for all 6 intents × 5 elevations, so `surface.base`, `overlay`, `border`, `noiseOpacity` and `text` are dead in the inline path (66 component files). | `src/tokens/glass.ts:995-1001`, `:1030`; `src/core/mixins/glassMixins.ts:53-65` |
| TOKENS-THEME-03 | high | The "canonical" JSON pipeline is mostly dead output: 569 of 621 generated `--aura-*` vars (92%) are unread, including all 490 `--aura-glass-{intent}-{level}-*` surface vars. | `scripts/build-tokens.js:188-265`; `src/styles/variables.css:164-186` |
| TOKENS-THEME-04 | high | The material is mode-blind and binds text to intent rather than backdrop. Generated neutral and success surfaces force white text while TS and JSON specs say slate, and light mode is fixed afterwards with per-selector overrides. | `glass.generated.css:33,195,502,672`; `glass.ts` neutral level1 `text.primary`; `glass.css:68-91`; `themes/light.css:5` |
| TOKENS-THEME-05 | high | Personas are cosmetic. 10 dark-only accent swaps share one hard-coded glass surface, and 58 of 74 vars per persona have no consumers. | `designMatrix.ts:100-101,132,1040`; `styles/generated/persona-variables.css`; `ThemeProvider.tsx:118-129` |
| TOKENS-THEME-06 | high | Theme Engine 2.0 (`aura-glass/theme`) is disconnected. None of its 16 unique-name `--glass-theme-*` vars is consumed, the `system` mode silently resolves to dark, the declared `asChild` prop is never used, and a `useEffect` on object identity resets user `setMode`/`setDensity` whenever the parent re-renders with an inline options object. | `createGlassTheme.ts:128,206-226`; `GlassThemeProvider.tsx:36,55-57,120-124` |
| TOKENS-THEME-07 | high | Token enforcement is largely absent. The lint scans only component CSS (37 files) minus 17 directories, while 180 of 415 production components (43%) carry raw color or blur literals (1,209 rgba, 505 hex, 76 blur). | `scripts/ci/token-lint.js:305-331`; counts in §2 |
| TOKENS-THEME-08 | high | `aura-glass/tokens` types promise `getPersona` and `getPersonaModeTokens`, but the runtime module does not export them. The import typechecks and then yields `undefined`. | `package.json:18-21`; `dist/tokens/generated.d.ts` (`getPersona`); `scripts/build-tokens.js:484-506`; `dist/tokens/index.mjs:3-7` |
| TOKENS-THEME-09 | medium | 70 Tailwind-style slash utilities used by components exist in no stylesheet (324 non-story uses), so the intended opacity silently does not apply. | e.g. `glass-text-primary/80` in `components/navigation/GlassBreadcrumb.tsx:262`; `glass-border-glass-border/20` ×70 |
| TOKENS-THEME-10 | medium | Undefined opacity tokens are used without fallback, which invalidates the whole declaration (`--glass-opacity-24/32/52/72` are not on the scale). | `components/animations/GlassTransitions.tsx:410,867,869`; `components/animations/AdvancedAnimations.tsx:255`; scale in `tokens.css` |
| TOKENS-THEME-11 | medium | Reduced transparency and high contrast are partial. `prefers-reduced-transparency` covers a 14-class allow-list only, missing `.glass-{intent}-level{n}`, CSS modules and inline `createGlassStyle` (read once via `matchMedia`, not reactive). The high-contrast block is invalid CSS, and `animations.css` forces a black fill regardless of mode. | `glass.css:4022-4052`; `glass.generated.css:492-1012` (no reduced-transparency block); `glassMixins.ts:241,275`; `theme-transitions.css:52-54`; `animations.css:550-554` |
| TOKENS-THEME-12 | medium | The published stylesheet includes Storybook-only CSS: global `.flex`/`.grid` shims and `.sb-story !important`. | `src/styles/index.css:24-25`; `dist/styles/index.css` (contains `.sb-story`) |
| TOKENS-THEME-13 | medium | IOR, performance tiers and saturate multipliers are decorative. Distinct token values produce identical output. | `LiquidGlassMaterial.tsx:357-367`; `glass.ts:874-907,1003-1021` |
| TOKENS-THEME-14 | medium | Duplicate theme APIs share names: two `GlassThemeProvider`s, two `useGlassTheme`s, and 5+ reduced-motion systems. | `theme/GlassThemeProvider.tsx:47` vs `theme/ThemeProvider.tsx:1606`; `theme/GlassThemeProvider.tsx:131` vs `hooks/useGlassTheme.ts:5`; `contexts/MotionPreferenceContext.tsx`, `contexts/AnimationContext.tsx`, `hooks/useReducedMotion.ts(x)` |
| TOKENS-THEME-15 | low | Docs contradict code on the blur and radius scales. The audit CSVs are 11 months stale. | `docs/design-tokens.md:136-141,247-251` vs `tokens.css:40-45,57-64`; `reports/token_violations.csv` (last commit 2025-11-07) |
| TOKENS-THEME-16 | low | Dead files and duplicates: `premium-typography.css` and `keyframes.css` are never imported, `tokens/schema.json` is never validated, `liquidGlassSystem` is unread, and `--glass-blur-2xl` equals `-3xl`. `generate-glass-css-simple.js` writes unformatted output, so running it dirties the tracked file (242+/576− formatting-only diff observed). | `src/styles/index.css`; `glass.css:3-6`; `tokens.css:44-45` |

---

## 9. Recommendations for AuraGlass 5.0: a material token architecture

**Principle:** one source (DTCG JSON), one compiler, one runtime namespace. Components consume semantic and material roles only. Mode, contrast, transparency, density and motion are orthogonal axes resolved in CSS, not in React.

### 9.1 Source and compiler
- Make `tokens/*.tokens.json` in W3C DTCG format the only source. Validate it in CI with the schema; fail the build on drift.
- Compile with Style Dictionary 4 (or extend `build-tokens.js`) to CSS, TS types and a matching runtime, the Tailwind v4 `@theme` block, and docs tables. Delete `designConstants.ts`, `themeTokens.ts`, the hand constants in `generate-glass-css-simple.js`, the surface data in `glass.ts`, and `designMatrix.ts` once they are migrated.
- Use one namespace: `--ag-*`. Generated TS exports only typed names (`token('material.regular.fill')` → `var(--ag-material-regular-fill)`), never raw values.

### 9.2 Tiers
1. **Reference:** OKLCH color ramps, a size scale, a duration scale, an easing set. No component may reference this tier.
2. **System semantic:** `--ag-color-{fg|fg-muted|fg-on-accent|accent|danger|...}`, `--ag-radius-{control|container|sheet}` with concentric rules, `--ag-space-*`, `--ag-type-{display|title|body|caption|mono}-*`.
3. **Material:** a small set of roles, not intent×level matrices.
   - `material.{clear|regular|thick|chrome}`, each with `fill`, `tint-mix`, `blur` (low, about 4–20px), `saturation`, `edge-highlight`, `specular`, `rim`, `inner-shadow`, `shadow`, `noise`, `refraction-scale` (consumed by the SVG/WebGL lens).
   - `elevation.{0..4}` holds shadow and z only and is orthogonal to material.
   - `interaction.{hover|press|focus|selected|disabled}` as illumination and scale deltas (keep `LIQUID_GLASS.system.illumination`).
   - `environment.{scroll-edge-soft|scroll-edge-hard|clear-dimming|group-spacing|concentric-inset}`, lifted from `LIQUID_GLASS.system`.
4. **Component:** only where it is truly needed (`--ag-button-height-{sm|md|lg}`, driven by density).

### 9.3 Axes resolved in CSS
- **Mode:** a single attribute `data-ag-mode="light|dark"` with `color-scheme` set, and `light-dark()` for every semantic and material color. Delete `data-bg`, `.glass-on-light/-dark`, `data-aura-mode` and the `.dark`/`.light` aliases.
- **Backdrop-adaptive legibility:** expose `--ag-backdrop-luma` (set by the existing sampler for opt-in surfaces, with a static default per mode). Materials derive `fg`, `tint-mix` and `clear-dimming` from it using `color-mix(in oklch, …)`. Text binds to backdrop, not intent.
- **Contrast:** `@media (prefers-contrast: more)` and a `data-ag-contrast="more"` override raise fill opacity, add a 1px solid rim, and remove noise. `@media (forced-colors: active)` maps to system colors.
- **Transparency:** `@media (prefers-reduced-transparency: reduce)` and `data-ag-transparency="reduced"` swap every `material.*` to an opaque fill at the token level, so components, modules and inline styles all inherit it. No class allow-list.
- **Density:** `data-ag-density="compact|comfortable|spacious"` scales the `space`, `control-height` and `radius` tokens.
- **Motion:** `@media (prefers-reduced-motion)` and `data-ag-motion="reduced|none|expressive"` scale `--ag-duration-*` in CSS. JS reads durations from CSS (or uses a single `useMotionPolicy`) instead of `ANIMATION.*` numbers.
- **Performance tier:** `data-ag-quality` toggles only refraction/specular layers and noise. Blur and fill stay invariant so the screenshots stay deterministic.

### 9.4 Brand and personas
- Replace the 10 personas with `createGlassTheme({ brand, accent, neutralHue, mode, contrast, density, motion, radiusScale })`. It produces only reference and semantic overrides (accent ramp, canvas, neutral hue); material stays brand-neutral, keeping the `generate-persona-css.ts:51` invariant.
- Ship 3–4 curated presets (`aura`, `graphite`, `daylight`, `midnight`), each with real light and dark values and contrast checked at build time with `color.ts`. Drop the narrative metadata.
- `GlassThemeProvider` emits a scoped `data-ag-theme` and a `<style>` block with `@scope`/`:where()` instead of inline style vars, so it is SSR-safe and has no re-render resets.

### 9.5 CSS architecture
- Wrap everything in `@layer ag.reset, ag.tokens, ag.material, ag.components, ag.utilities`, use `:where()` for zero-specificity defaults, and set a target of 0 `!important` outside the a11y layers.
- Register key tokens with `@property` (typed `<color>`, `<length>`, `<number>`) so material transitions interpolate.
- Split `aura-glass/styles` into `tokens.css`, `material.css` and `components.css`. Move the Storybook shims into `.storybook/`.

### 9.6 Enforcement
- An ESLint rule and a stylelint rule over **all** `src/**/*.{ts,tsx,css}` with no directory exclusions. Forbid raw color, blur and shadow literals and undefined `--ag-*` references (checked against the generated manifest). Allow exceptions only in `tokens/` and data-viz palette files, through an explicit `palette` token group.
- A CI check that every generated token has at least one consumer or is marked `public`.
- A codemod from `--glass-*`, `--aura-*` and `--glass-theme-*` to `--ag-*`, plus deletion of the slash-utility classes in favour of semantic tokens.

### 9.7 Migration order
1. Freeze the values the current UI actually renders (`glass.ts:997`, `:1030`, the blur ternary) into DTCG as `material.regular`.
2. Generate `--ag-*` with aliases from the legacy names.
3. Port `createGlassStyle` to return `var()` references only.
4. Point mode, contrast and transparency at token swaps.
5. Lint to zero, then remove the legacy layers.

## Verification (adversarial)

Independent re-check against source on 2026-10-06. Counts were recomputed with my own greps; where they differ from the original, the difference is noted.

| id | verdict | note |
|---|---|---|
| TOKENS-THEME-01 | CONFIRMED | Radius md: `src/tokens/glass.ts:856` = 16, `src/styles/tokens.css:60` = 16px, `src/styles/variables.css:79` `--aura-radius-md: 0.5rem` (8px), `src/tokens/designConstants.ts:190` 0.375rem (6px), `docs/design-tokens.md:250` 0.75rem (12px). Primary: tokens.css:7 is hsl(217 91% 60%) (#3b82f6), `src/tokens/generated.ts:60` #6366f1, `src/theme/designMatrix.ts:139` #4FD6FF, `src/theme/createGlassTheme.ts:123` #7dd3fc. Motion: glass.ts:850 is 200ms, tokens.css:110 is 250ms. `glass.ts:4` calls itself "SINGLE SOURCE OF TRUTH". One softening: the two layers that actually paint surfaces (glass.ts and tokens.css) agree on radius md = 16. |
| TOKENS-THEME-02 | CONFIRMED | `glass.ts:995-1001` hard-codes the gradient and `backgroundColor: rgba(255,255,255,0.018)`, and `:1030` hard-codes the border. `color` is `var(--glass-theme-text, ...)` (`:1033`), so surface.text is never read. The `surface.base` fallback in `glassMixins.ts:62-65` cannot run because background is always set. Blur, shadow and innerGlow do still come from tokens, and the comment at `:997-999` says the flattening was deliberate. I count 63 non-story files in src/components calling `createGlassStyle`, not 66. |
| TOKENS-THEME-03 | CONFIRMED | 621 unique `--aura-*` names are defined in `src/styles/variables.css` + `generated/`. 571 of them never appear as `var(--aura-...)` anywhere in src, and all 490 glass-surface vars are among them. The original says 569, so the counts are within noise. These are public CSS API, so consumers could read them, but nothing in the library does. |
| TOKENS-THEME-04 | CONFIRMED | `glass.generated.css:33,195` set neutral/success level1 text-primary to `rgba(255,255,255,0.98)`, and `:502,672` apply it as `color`. The TS spec has neutral primary `rgba(15,23,42,0.94)` (`glass.ts:86`). `themes/light.css:5` uses `:root:not([data-theme="dark"])`, so light is the root default and the white-text surfaces depend on overrides. My count for `--glass-theme-text:` in src/styles is 19 definitions with 13 distinct values; across all of src it is 151 definitions with 20 distinct values. The 17/28 figure depends on scope, but the conclusion holds. |
| TOKENS-THEME-05 | CONFIRMED | `PERSONA_GLASS_SURFACE` (`designMatrix.ts:100`) is assigned to all 10 personas (10 matches). All 10 canvases are dark (#060B1C to #120E1A, `designMatrix.ts:132..971`), including "glacier-morn" and "lumen-veil". The solar-apex block has 73 vars, and 57 have no `var()` consumer outside the generated file (original: 58 of 74). `ThemeProvider.tsx:118-129` pins `data-aura-theme` to `auraglass-default`. |
| TOKENS-THEME-06 | CONFIRMED | `createGlassThemeCssVars` emits 17 vars. Only `--glass-theme-text` has consumers (249 `var()` uses), and that name is shared with the legacy layer; the other 16 have zero exact consumers. Because `glass.css:90,409,674` redefine `--glass-theme-text` on descendants, even that one is usually shadowed. `isLight = mode === "light"` (`createGlassTheme.ts:128`), so "system" gets the dark palette. `asChild` is declared (`GlassThemeProvider.tsx:36`) but not destructured (`:47-50`). `useEffect(..., [initialTheme])` (`:55-57`) resets state whenever an inline options object changes identity. |
| TOKENS-THEME-07 | PARTIAL | token-lint does default to `src/components/**/*.css` (`token-lint.js:305,417`), with 37 CSS files and 17 ignored directories, and is the only token gate in CI (`design-system-compliance.yml`). 180 non-story TSX files contain rgba/hex; I count 1,266 `rgba(`. The claim misses that `eslint-plugin-auraglass.js` `no-inline-glass` is an **error** for TSX style props with rgba/backdrop-filter (`eslint.config.js:29`). It does fire: `GlassSidebar.tsx:278` reports an error. So TSX enforcement exists but is not respected. It is not true that only CSS is policed. `require-glass-tokens` is only a warning, and lint-staged uses `--max-warnings 999999`. |
| TOKENS-THEME-08 | CONFIRMED | The `./tokens` types point to `dist/tokens/generated.d.ts`, which declares `getPersona`/`getPersonaModeTokens` at lines 1231-1232. `dist/tokens/index.mjs` and `index.cjs` export only auraTokens, personas, version, description and default, and the generator emits exactly that (`build-tokens.js:488-506`). Calling either function at runtime fails. |
| TOKENS-THEME-09 | CONFIRMED | `glass-text-primary/80` (`GlassBreadcrumb.tsx:262`) and `glass-border-glass-border/20` have no matching selector in src/styles; only literal-color forms such as `.glass-border-white\/20` exist (`glass.css:229`). There is no tailwind or postcss config at the repo root to generate them. `glass-border-glass-border/20` appears 122 times in 55 non-story files, so "70" undercounts. I did not recount the total of 70 classes / 324 uses. |
| TOKENS-THEME-10 | CONFIRMED | `--glass-opacity-24/32/52/72` have zero definitions in src. The cited lines (`GlassTransitions.tsx:410,867,869`, `AdvancedAnimations.tsx:255`) use them without a fallback, so the whole declaration is invalid at computed-value time. |
| TOKENS-THEME-11 | PARTIAL | Reduced transparency is a 14-selector allow-list (`glass.css:4022-4052`) and is not applied to `.glass-{intent}-level{n}`. Only one CSS module handles it (`GlassPageTabs.module.css`). JS checks are one-shot `matchMedia` calls (`glassMixins.ts:241,275`). The invalid property `forced-colors: active` is real, but only in `theme-transitions.css:52-54`. The `animations.css:550-554` block is valid CSS (it is just heavy-handed), so "the high-contrast block is invalid" overstates the second citation. |
| TOKENS-THEME-12 | CONFIRMED | `src/styles/index.css:24-25` import `storybook-enhancements.css` and `storybook-utility-shim.css`. The shipped `dist/styles/index.css` contains `.sb-story{...!important...}` and global `.flex{display:flex}` / `.grid{display:grid}`. |
| TOKENS-THEME-13 | CONFIRMED | `LiquidGlassMaterial.tsx:357-367`: any `ior > 1` only swaps saturate 1.4 to 1.5, and the IOR value is otherwise just displayed (`:590`). `blurMultiplier` is 1.0 on every tier (`glass.ts:875-898`). `saturateMultiplier` is read only by `buildBackdropFilter` (`glass.ts:949`), which only the build script `scripts/generate-glass-css-from-tokens.ts:165` calls. The runtime path hard-codes `saturate(1.4)`. |
| TOKENS-THEME-14 | CONFIRMED | `export const GlassThemeProvider` exists in both `theme/GlassThemeProvider.tsx:47` and `theme/ThemeProvider.tsx:1606` (alias of ThemeProvider). `useGlassTheme` is exported from both `theme/GlassThemeProvider.tsx:131` and `hooks/useGlassTheme.ts:5`. `MotionPreferenceContext.tsx`, `AnimationContext.tsx`, `useReducedMotion.ts` and `useReducedMotion.tsx` all exist. |
| TOKENS-THEME-15 | CONFIRMED | The docs blur scale (4/8/16/24/32/48, `design-tokens.md:135-141`) does not match code (16/24/32/40/48/48, `tokens.css:40-45`). Docs radius md is 12px; code is 16px (`tokens.css:60`). `reports/token_violations.csv` was last committed 2025-11-07, 11 months ago. |
| TOKENS-THEME-16 | PARTIAL | Confirmed: `premium-typography.css` is imported nowhere (only listed in `scripts/css-cleanup.js:21`), `liquidGlassSystem` has no reader in src/scripts, `schema.json` is only referenced as a `$schema` string with no validator, and `--glass-blur-2xl` = `-3xl` = 48px (`tokens.css:44-45`). Overstated: `src/styles/keyframes.css` is a generated mirror (`build-tokens.js:559`) of the published `./tokens/keyframes` export (`package.json:37`). The src copy is unimported, but the content is not dead. |
