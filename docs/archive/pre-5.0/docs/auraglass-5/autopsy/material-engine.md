# AuraGlass 5.0 Autopsy: Glass Material Engine

Scope: `src/primitives/**`, `src/core/**`, `src/tokens/glass.ts`, `src/theme/materials.ts`, `src/utils/createGlassStyle.ts`, `src/utils/contrastGuard.ts`, `src/hooks/useLiquidGlassBackdrop.ts`, `src/styles/*.css`, `src/components/{houdini,effects,atmospheric,backgrounds,surfaces}`, `src/components/advanced/{LiquidGlassGPU,GlassWebGLShader}.tsx`, `docs/liquid-glass/**`, `docs/glass-utilities.md`, `scripts/audit/static-glass-material-audit.js`.

Method: source reading plus `rg` counts (excluding `node_modules`, `dist`, stories, tests, snapshots where noted). Certification PNGs could not be visually inspected in this session (the image reader returned empty output for every PNG/JPEG tried), so the visual claims below come from code only. No source files were modified.

---

## 1. Summary and score

**Score: 3/10.**

AuraGlass does not have a glass material engine. Its "material" is one fixed CSS recipe: `backdrop-filter: blur(N) saturate(1.4–1.8) brightness(~1.05) contrast(~1.04)`, a white 145° gradient at 1.8–10.5% alpha, a 1px white border, and a box-shadow stack with a 1px inset top highlight. That recipe is written out by hand in at least 9 separate places, with values that disagree. The physical vocabulary (IOR, thickness, sheen, refraction, reflection, Fresnel, caustics, chromatic, adaptive tint, backdrop sampling, Houdini worklets, GPU refraction) is mostly typed props, CSS class names with no CSS rules behind them, `data-*` attributes, or stub functions that say "In a real implementation…".

The best piece is the main `LiquidGlassMaterial` primitive, which wires layer context, effect groups, backdrop sampling and contrast guarding. But the last style merge throws away the background it computes (MATERIAL-ENGINE-01), so none of that adaptive work reaches the screen. The "GPU refraction" path refracts a hardcoded indigo→pink gradient, not the real backdrop (MATERIAL-ENGINE-02).

The single source of truth is half real. `AURA_GLASS` tokens feed `buildSurfaceStyles`, and about 170 components use it through `OptimizedGlass`. But that factory ignores most of its own token fields (surface base, intent border, noise, text), and it competes with two functions both named `createGlassStyle`, a generated CSS file, `glass.css` classes, `theme/materials.ts`, and the `LIQUID_GLASS` overrides.

---

## 2. What exists (counts)

| Metric | Count | How measured |
|---|---|---|
| Files in `src/` mentioning `backdrop-filter`/`backdropFilter` | **121** (580 occurrences) | `rg -l --ignore-case 'backdrop-?filter' src` |
| `blur(` occurrences / files | 1,232 / 137 | `rg -c 'blur\(' src` |
| Distinct literal `backdrop-filter` value strings | **~130** | normalized `rg -o` over property values |
| Distinct `saturate()` values | **19** (1.8 ×97, 1.4 ×64, 1.5 ×34, 160% ×8, 1.45 ×8, 140% ×7, 150%, 145%, 175%, 170%, 1.2, 1.6, 1.35, 1.65, 1.16, 0.8, …) | `rg -o 'saturate\([0-9.%]+\)'` |
| Distinct `blur(Npx)` literals | 22 | `rg -o 'blur\([0-9.]+px\)'` |
| Component `.tsx` files (non-story/test) | 415 | `rg --files src/components -g '*.tsx'` |
| …render `<OptimizedGlass>` | **166** | |
| …render `<LiquidGlassMaterial>` | **23** | modal, navigation, card, input, container, etc. |
| …render `<GlassCore>`/`<Glass>` | 24 | |
| …call `createGlassStyle(` (either of two functions) | 59 | 51 import from `core/mixins/glassMixins`, 21 from `utils/createGlassStyle` |
| …use `glass-foundation-complete` class | 25 | |
| …use `glass-backdrop-blur*` classes | 111 | including undefined `glass-backdrop-blur-md-medium` ×9, `-md2xl`, `-md-subtle` |
| …set inline `backdropFilter:` directly | 11 | GlassSpotlight, GlassDropdownMenu, GlassTreeView, GlassJSONViewer, LiquidGlassCarouselRail, GlassQuantumTunnel, … |
| Component CSS modules with `backdrop-filter` | 26 | |
| Component tsx with no engine hook at all | 68 | no OptimizedGlass/LGM/createGlassStyle/glass-foundation/backdrop/module.css |
| `feDisplacementMap` users | 2 (HeatGlass, Glass3DEngine) | neither displaces the backdrop |
| WebGL/R3F files | 11 | none sample the real DOM backdrop |
| Houdini paint worklets actually registered | **0** | `addModule` calls are commented out |
| Components using the noise overlay class | 4 | `.glass-overlay-noise`, `src/styles/glass.css:2759` |
| `@supports not (backdrop-filter)` fallback blocks | 2 | `glass.css:4099`, `glass.generated.css:1006` |
| `@property` registrations in CSS | 0 | |

### Glass implementations (independent recipes)

1. `glassTokenUtils.buildSurfaceStyles`: `src/tokens/glass.ts:960-1038` (the canonical one)
2. `glassTokenUtils.buildBackdropFilter`: `src/tokens/glass.ts:940-955` (saturate 1.8, tier-aware, **zero callers**)
3. `liquidGlassUtils.buildLiquidGlassStyles`: `src/tokens/glass.ts:1559-1626` (hardcodes blur 32px for every elevation)
4. `LiquidGlassMaterial` inline overrides: `src/primitives/LiquidGlassMaterial.tsx:338-372, 532-540`
5. `utils/createGlassStyle.ts`: its own token table with different radii and shadows, `src/utils/createGlassStyle.ts:20-84`
6. `core/mixins/glassMixins.createGlassStyle`: wraps #1 under the **same exported name** as #5, `src/core/mixins/glassMixins.ts:41`
7. `core/foundation/glassFoundation.ts`: deprecated `rgba(255,255,255,X)` foundation (`:72, :122, :213, :242`)
8. `theme/materials.ts`: 4 more materials with saturate 150–175% (`src/theme/materials.ts:25-55`)
9. `styles/glass.generated.css`: per-intent/elevation classes with `saturate(1.8)` (`:514`)
10. `styles/glass.css`: `.glass`, `.glass-foundation-complete`, `.glass-premium`, `.liquid-glass-transition-*` and others, each with its own literal recipe (`:31-65, :4161, :4489`)
11. `HoudiniGlassProvider` injected CSS: `src/components/houdini/HoudiniGlassProvider.tsx:528-539`
12. `OptimizedGlassAdvanced` / `GlassAdvanced`: class-based, using undefined Tailwind classes (`src/primitives/glass/OptimizedGlassAdvanced.tsx:416-420`)
13. 26 component CSS modules plus 11 inline-style components (ad hoc)

---

## 3. What is excellent (keep)

- **The concept of `LiquidGlassMaterial` as a context-aware primitive.** It reads layer context, effect-group context, backdrop sampling and the contrast guard, and it emits data attributes for QA (`src/primitives/LiquidGlassMaterial.tsx:189-196, 556-565`). That is the right shape for a 5.0 primitive, even though the internals are wrong.
- **Accessibility media coverage in `glass.css`.** It handles `prefers-reduced-transparency` (`:4022`), `prefers-contrast: high` (`:4055`), `forced-colors: active` with `Canvas`/`CanvasText` (`:4073-4097`), and `@supports not (backdrop-filter)` (`:4099-4123`). Few glass libraries do this. Keep the policy, but make it apply to the elements that actually carry glass (see MATERIAL-ENGINE-07).
- **The design principle "glass is never disabled, only reduced"** (`src/tokens/glass.ts:871-873`), and the comment-documented choice to keep the material optically clear rather than an acrylic slab (`:998-1001`). That is good taste.
- **The canonical blur scale (16/24/32/40/48) tied to elevation** (`src/tokens/glass.ts:69-165`, `src/styles/tokens.css:39-44`). It is consistent where it is used.
- **The token→CSS generator idea** (`scripts/generate-glass-css-from-tokens.ts` → `glass.generated.css`). The pipeline direction is right; the outputs just aren't the source that wins.
- **The scroll-edge, concentric-frame and source-transition primitives** are small, honest, and CSS-variable-driven (`src/styles/glass.css:4425-4486`).

## 4. What is mediocre

- **`buildSurfaceStyles` ignores most of its token spec.** Every intent and elevation gets the same hardcoded background and border (`src/tokens/glass.ts:996-1001, 1030`). `surface.base`, `surface.overlay`, `border.color` (for example `hsl(var(--glass-color-primary)/0.40)` at `:229`) and `text.*` are dead for the main code path. Intent only changes the inset glow color and shadow, so a "primary" and a "danger" `OptimizedGlass` look almost identical.
- **The backdrop sampler is a DOM color sniffer, not a backdrop sampler.** `elementsFromPoint` plus `getComputedStyle().backgroundColor` at 9 points (`src/hooks/useLiquidGlassBackdrop.ts:88-115`). It cannot see gradients, images, video, canvas or text; it only flags whether `background-image` is present. Transparent wrappers compute to `rgba(0, 0, 0, 0)`, which `parseRgb` accepts (it only rejects the literal string `"transparent"`, `:36`). Alpha is then ignored in luminance (`:52-60`), so any transparent wrapper reads as **black** and biases every sample toward "dark".
- **Nested glass is tracked but never acted on.** `LiquidGlassSurfaceLayer` increments `depth` and sets `insideGlass` (`src/primitives/LiquidGlassLayerProvider.tsx:94-103`). `LiquidGlassMaterial` only adds the class `liquid-glass-layered-surface` (`LiquidGlassMaterial.tsx:525`), and no CSS rule exists for it. `maxRecommendedDepth`/`warningDepth` (`src/tokens/glass.ts:1422-1425`) are never read, and `allowNestedGlass` is never checked. The docs claim it "registers with LiquidGlassLayerProvider to warn about accidental nested glass" (`docs/liquid-glass/primitives/liquid-glass-material.md:370`). There is no warning. The 166 `OptimizedGlass` users are not part of the layer system at all.
- **The noise/grain token exists per surface but is not applied.** `noiseOpacity` is defined for all 30 surfaces, and `PERFORMANCE_TIERS.enableNoise` (`src/tokens/glass.ts:880`) has **0** readers. Grain only appears through the opt-in `.glass-overlay-noise` class, used by 4 components.
- **Radius has four competing scales.** `OptimizedGlassCore` md=8px (`src/primitives/OptimizedGlassCore.tsx:233`). `LiquidGlassMaterial` lg=16px (`:436`). `utils/createGlassStyle` lg=16px and 2xl=24px (`:37-44`). CSS `--glass-radius-md: 16px` / `lg: 24px` (`src/styles/tokens.css:59-61`). The same element gets `border-radius: var(--glass-radius-md)` (16px) from the class and 8px inline.

## 5. What is outdated

- **Heavy saturation backdrop-filter glassmorphism** (2020–2022 Dribbble style) presented as "Apple Liquid Glass parity" (`LiquidGlassMaterial.tsx:132`). Liquid Glass's defining traits are lensing/refraction at the edges, specular highlights that respond to light and motion, adaptive light/dark switching, and shape morphing between glass elements. None of these is implemented beyond a 1px inset highlight and a radial top sheen (`LiquidGlassMaterial.tsx:569-578`).
- **Houdini Paint API** as a material path. It is Chromium-only, has no momentum, and here it is also a stub (MATERIAL-ENGINE-04).
- **Device-orientation tilt via `deviceorientation`** with no permission flow (`LiquidGlassMaterial.tsx:273-297`). iOS 13+ needs `DeviceOrientationEvent.requestPermission()`, so it silently never fires on iOS.
- **`will-change: backdrop-filter` and `transform: translateZ(0)` on every surface** (`src/tokens/glass.ts:1036, 1621-1624`). This is 2016-era layer forcing, and it also has backdrop-root side effects (MATERIAL-ENGINE-06).
- **A Storybook Tailwind shim shipped in the package CSS.** `src/styles/index.css:25` imports `storybook-utility-shim.css`, which describes itself as a shim "for Storybook to emulate a few Tailwind classes" (`src/styles/storybook-utility-shim.css:1-3`).

## 6. Duplication

- **Two public functions named `createGlassStyle` with different signatures and outputs.** `src/utils/createGlassStyle.ts:64` takes `{elev, variant, blur, radius}`, emits saturate 1.5, white 25% gradient, border 0.28. `src/core/mixins/glassMixins.ts:41` takes `{intent, elevation, tier}` and emits `buildSurfaceStyles` (saturate 1.4, white 10.5% gradient, border 0.18). `src/index.ts:960` exports one of them. Which recipe a component gets depends on its import path: 21 files use one, 51 the other.
- **The same backdrop recipe is spelled out as a 5-branch ternary 4 times.** `src/tokens/glass.ts:1002-1021` (twice, for the prefixed and unprefixed properties), and `src/primitives/LiquidGlassMaterial.tsx:339-348` and `:358-367`. Every branch differs only in the px value it would have interpolated.
- **One element gets two conflicting recipes.** `OptimizedGlassCore` emits the class `glass-${intent}-${elevation}` (`OptimizedGlassCore.tsx:284`), and that class in `glass.generated.css:509-520` sets `saturate(1.8) brightness(1.05) contrast(1.05)` and `radius 16px`. The inline style sets `saturate(1.4) brightness(1.08) contrast(1.04)` and `radius 8px`. Inline wins, so the generated CSS is dead weight for the most-used primitive, but it still matters for consumers who use the class alone.
- **`theme/materials.ts`** is a fourth material table (saturate 150–175%) that does not match any of the others.
- **Legacy `glassTokens`** (`src/tokens/glass.ts:1045-1125`, blur 4/8/16/24px and rainbow gradients) sits beside the canonical tokens and is still exported.
- **`glassUtils` is an alias of `glassTokenUtils`** (`:1128`), and `liquidGlassUtils` spreads it again (`:1458`).

## 7. Fake complexity

| Claim | Reality | Evidence |
|---|---|---|
| "IOR-based refraction physics" | `ior > 1` only switches saturate from 1.4 to 1.5. IOR is never used numerically in CSS | `LiquidGlassMaterial.tsx:357-372` |
| `enableRefraction` / `enableReflection` / `enableParallax` | They add classes `liquid-glass-refraction`/`-reflection`/`-parallax`, which have **0** CSS rules | `LiquidGlassMaterial.tsx:517-519`; `rg '\.liquid-glass-refraction' src -g '*.css'` → none |
| `OptimizedGlass` props `caustics`, `chromatic`, `refraction`, `lighting` (10 modes), `border` (9 modes), `variant` (6), `blur`, `intensity` (6), `depth`, `tint` | They are destructured and discarded, or become `data-*` attributes. None changes the rendered output | `OptimizedGlassCore.tsx:150-175, 245-269, 298-305` |
| `tier` high/medium/low | Classes `glass-tier-*` have 0 CSS rules. `blurMultiplier` is 1.0 on every tier, and `buildLiquidGlassStyles` forces `"high"` | `src/tokens/glass.ts:876-899, 1576` |
| "Content-aware adaptive tint" | Computed, then overwritten by a constant background | MATERIAL-ENGINE-01 |
| Contrast guard canvas sampling | `captureBackdrop` returns `null` ("For now, return null") | `src/utils/contrastGuard.ts:343-353` |
| `validateTextContrast`, `validateLiquidContrast` | `return true` | `src/tokens/glass.ts:931-935, 1631-1642` |
| `sampleBackdropLuminance` | `return 0.5` | `src/tokens/glass.ts:1521-1527` |
| GPU refraction with Fresnel | It refracts a synthetic gradient | MATERIAL-ENGINE-02 |
| Houdini worklets | Never loaded; injected `paint()` values point at unregistered worklets | MATERIAL-ENGINE-04 |
| HeatGlass "heat distortion" | `feDisplacementMap in="SourceGraphic"` warps the component's own content, not the backdrop. The 4 filters differ only by seed, and only `heat-distortion-0` is ever used | `src/components/surfaces/HeatGlass.tsx:15-55, 203` |
| Glass3DEngine distortion | Displaces a grid of decorative circles | `src/components/effects/Glass3DEngine.tsx:332-367` |
| GlassMorphingEngine "real-time environmental data" | Hardcoded `weather: "sunny", temperature: 22` | `src/components/effects/GlassMorphingEngine.tsx:490-516` |
| `OptimizedGlassAdvanced` blur levels | All 4 intensities map to the same class, `glass-backdrop-blur`. Saturation classes `backdrop-saturate-120/115/105` don't exist (no Tailwind) | `src/primitives/glass/OptimizedGlassAdvanced.tsx:104-110, 416-420` |
| Static material audit | It forbids non-literal expressions (`static-glass-material-audit.js:1389`), so the code was bent into literal ternary ladders to pass. The audit checks spelling, not material quality | `src/tokens/glass.ts:1591-1593` ("statically audited above") |

---

## 8. Critical findings

### MATERIAL-ENGINE-01: `LiquidGlassMaterial` discards its adaptive tint, contrast tint and clear-variant dimming. Severity: critical
`dynamicStyles` builds layered backgrounds: the contrast tint (`src/primitives/LiquidGlassMaterial.tsx:334-336`), the adaptive tint from backdrop luminance (`:380-389`), and the clear-variant dimming scrim (`:391-397`). `combinedStyles` then sets `background` to a constant 145° gradient and `backgroundColor: rgba(255,255,255,0.018)` (`:532-540`). All environment adaptation is thrown away. The backdrop sampler, MutationObserver, ResizeObserver and scroll listener (`src/hooks/useLiquidGlassBackdrop.ts:202-235`) still run for every one of the 23 component families that render it, at runtime cost and with no visual effect. The `variant="clear"` legibility guarantee (7:1, `:194`) is never enforced visually.

### MATERIAL-ENGINE-02: "GPU-accelerated Liquid Glass" refracts a fake backdrop. Severity: critical
`captureElementBackdrop` returns a canvas filled with a hardcoded `#4f46e5 → #7c3aed → #ec4899` gradient ("For now, create a simple placeholder", `src/components/advanced/LiquidGlassGPU.tsx:569-604`). The refract2D and Fresnel shader (`:64-177`) therefore distorts a purple gradient that has nothing to do with the page. It is exported publicly from `src/index.ts`. Any screenshot of it shows a purple shader where the user's content should be.

### MATERIAL-ENGINE-03: no single source of truth; at least 9 independent recipes with conflicting values. Severity: high
See §2 and §6. There are 19 different `saturate()` values and ~130 distinct `backdrop-filter` strings. Two exported functions named `createGlassStyle` produce different materials (`src/utils/createGlassStyle.ts:64` vs `src/core/mixins/glassMixins.ts:41`). The class-based (`glass.generated.css:514`) and inline (`src/tokens/glass.ts:1002`) recipes conflict on the same `OptimizedGlass` element. Changing "the glass" means editing about 10 places, and the outcome per component depends on import path.

### MATERIAL-ENGINE-04: Houdini provider is a stub and strips surface layers. Severity: high
`registerGlassWorklets` has every `CSS.paintWorklet.addModule` commented out (`src/components/houdini/HoudiniGlassProvider.tsx:517-520`). With `options.enableWorklets`, it still sets `element.style.backgroundImage = "paint(glass-frost), …"` and `borderImage = "paint(glass-refraction) 1"` (`:396-415`). An unregistered `paint()` renders as a transparent image, so the surface loses its gradient layers and border image (`background-color` survives, so it is degraded rather than fully blank). `registerGlassProperties` registers `--glass-background` as `<color>` with `initialValue: "var(--glass-bg-default)"` (`:447-452`). `registerProperty` rejects that initial value because it is not computationally independent; the throw is swallowed by the shared `catch`, which also skips every later registration. Nothing is registered. The file comment admits it: "Mock functions for Houdini API registration" (`:436`).

### MATERIAL-ENGINE-05: about 15 "physical" props are no-ops. Severity: high
`OptimizedGlass`, the most-used primitive (166 components), accepts `caustics`, `chromatic`, `refraction`, `parallax`, `lighting`, `border`, `variant`, `blur`, `intensity`, `depth`, `tint`, `glowColor`, `glowIntensity`, `optimization`, `hardwareAcceleration`. It then discards them (`src/primitives/OptimizedGlassCore.tsx:150-175, 245-269`). Glow only adds a class. Consumers and docs believe these props change the material. They do not.

### MATERIAL-ENGINE-06: nested glass cannot see the real backdrop and no policy handles it. Severity: high
Every glass surface carries its own `backdrop-filter`, and `LiquidGlassMaterial` adds `will-change: transform, opacity, backdrop-filter` when micro-interactions or parallax are on (`LiquidGlassMaterial.tsx:444-447`). Per the Filter Effects Level 2 backdrop-root rules (an element with `backdrop-filter`, `filter`, `opacity < 1`, or `will-change` on those properties becomes a Backdrop Root), any glass inside a glass, such as `GlassInput` in `GlassModal` or `GlassCard` in `GlassContainer`, samples only the parent's near-transparent fill, not the page. It renders as a flat tinted rectangle, or double-frosts. (`transform: translateZ(0)` at `src/tokens/glass.ts:1036` and `contain: paint` are layer-forcing waste but not themselves Backdrop Roots.) No nested-glass policy compensates: `allowNestedGlass` and `depth` are stored (`src/primitives/LiquidGlassLayerProvider.tsx:16-27, 97-102`) but never read, and `liquid-glass-layered-surface` (`LiquidGlassMaterial.tsx:525`) has no CSS rule.

### MATERIAL-ENGINE-07: the unsupported-backdrop fallback does not reach `LiquidGlassMaterial` or inline-style glass. Severity: medium
`@supports not`, `prefers-reduced-transparency` and `forced-colors` only target `.glass`, `.glass-foundation-*`, `.optimized-glass-surface` and the blur utility classes (`src/styles/glass.css:4031-4044, 4073-4122`). `.liquid-glass-material` is not listed, and neither are the 59 components using `createGlassStyle()` inline (unless they also carry a listed class) or the component CSS modules that use `backdrop-filter` (only `GlassPageTabs.module.css:269,280` has its own reduced-transparency/forced-colors handling). On those, unsupported browsers get a 1.8–10.5%-alpha white gradient with no blur, which leaves text effectively on raw background. `canUseHighQualityGlass` (`src/core/mixins/glassMixins.ts:231`) is computed in JS and not wired into the styles.

### MATERIAL-ENGINE-08: the backdrop sampler misreads transparent layers as black. Severity: medium
`parseRgb` rejects only the literal `"transparent"` (`src/hooks/useLiquidGlassBackdrop.ts:36`). `getComputedStyle` returns `rgba(0, 0, 0, 0)` for transparent elements, which is parsed and averaged with its alpha ignored (`:52-60, :134-145`). Typical layouts, with transparent wrappers over a gradient body, are classified as "dark". Because of MATERIAL-ENGINE-01 this is currently invisible, but it will surface as soon as 01 is fixed.

### MATERIAL-ENGINE-09: the token spec is mostly dead data. Severity: medium
Of each `GlassSurfaceSpec`, `buildSurfaceStyles` reads only `backdropBlur.px`, `outerShadow`, `highlightOpacity` and `innerGlow` (`src/tokens/glass.ts:965-1037`). It ignores `surface.base`/`overlay`, `border.*`, `text.*` and `noiseOpacity` (other paths read `surface.base`/`border`/`text` — `src/core/mixins/glassMixins.ts:64, 193-198`, `src/tokens/themeTokens.ts:192-194` — but not the 166-component `OptimizedGlass` path). `noiseOpacity`, `enableNoise` and `adaptiveOpacity` have no readers anywhere. `buildBackdropFilter` and `getPerformanceBlur` have 0 callers. `adaptiveOpacity`, `refraction.intensity` and `reflection.intensity` have 0 readers. `LIQUID_GLASS.material.ior` values (glass 1.52 / crystal 1.76 / diamond 2.42) have no rendering effect. The docs list a different IOR default (1.43, `docs/liquid-glass/primitives/liquid-glass-material.md:13`) from the code (1.33, `src/tokens/glass.ts:1323`).

### MATERIAL-ENGINE-10: undefined classes and the Storybook shim make Storybook output differ from consumer output. Severity: medium
`glass-backdrop-blur-md-medium` (9 uses), `-md2xl` and `-md-subtle` (`src/components/website-components/GlassWipeSliderExamples.tsx:52,73,252,300,443`) are leftovers from a find/replace and have no CSS. `backdrop-saturate-*` and `backdrop-brightness-*` (`OptimizedGlassAdvanced.tsx:416-420`) do not exist. `storybook-utility-shim.css` defines `backdrop-blur-*` and layout utilities and ships in `index.css` (`src/styles/index.css:25`), so library CSS pollutes global names like `.flex` and `.grid`.

### MATERIAL-ENGINE-11: the static audit drives code shape instead of quality. Severity: low
`scripts/audit/static-glass-material-audit.js:1389` fails any non-literal `backdropFilter` expression. That produced the copy-paste ternary ladders (`src/tokens/glass.ts:1002-1021`; `LiquidGlassMaterial.tsx:339-367`) and comments like "statically audited above" (`src/tokens/glass.ts:1591-1593`). The audit certifies that both prefixes are spelled out, not that the glass looks like glass.

### MATERIAL-ENGINE-12: `deviceorientation` tilt and hover use `transition: all`. Severity: low
There is no iOS permission request (`LiquidGlassMaterial.tsx:292-296`). Hover and press set `transition: all …` (`:406, :412`), which animates `backdrop-filter` and `background`, the most expensive properties on the page. Each orientation event re-renders the whole material through `setDeviceTilt` instead of writing a CSS variable.

---

## 9. Recommendations for AuraGlass 5.0

### 9.1 One material, compiled once
- Define a typed **`MaterialSpec`**: `{ blur, saturation, brightness, tint (OKLCH + alpha), fill opacity, border (inner/outer hairline, gradient angle), specular (angle, intensity, width), refraction (edge lens width, strength), noise (opacity, scale), shadow (ambient + key, elevation-scaled), depthTint, fallbackFill }`.
- Ship **3–5 named materials**, for example `thin`, `regular`, `thick`, `chrome`/`clear`, and `scrim`, multiplied only by elevation and color scheme. Delete per-intent material tables; intent belongs in content and accent, not in the frost.
- **Compile the spec to CSS custom properties and one cascade-layered class** (`@layer aura.material { .ag-material { … } }`), using `@property`-registered variables so blur, tint and specular can animate cheaply. Components set `data-material="regular" data-elevation="2"`, never inline `backdropFilter`. Delete both `createGlassStyle` functions, `glassFoundation`, `theme/materials.ts`, legacy `glassTokens`, and the Houdini provider. Codemod the 166 `OptimizedGlass` call sites onto one `<Material>` primitive (or a `Surface` slot) whose props are the spec's knobs and nothing else.

### 9.2 Real optical layers (CSS-first, progressive)
Build each surface from fixed layers: (1) backdrop (`backdrop-filter` blur, saturate and brightness from the spec); (2) tint/fill; (3) noise, a single shared tiled SVG or AVIF at 2–4% to prevent banding on large blurs; (4) a specular/edge-light rim, from a `mask-composite`d gradient border plus an angle-driven top highlight, with the angle bound to a global `--ag-light-angle` variable (optionally pointer- or scroll-driven); (5) inner shadow and depth; (6) outer shadow scaled by elevation. Use `::before`/`::after` with `isolation: isolate` to avoid extra DOM.

**Refraction:** offer an opt-in `lens` tier using an SVG `feDisplacementMap` applied through `backdrop-filter: url(#ag-lens)` in Chromium, with a generated edge-normal map per radius, clamped to the outer ~12px rim. It falls back to the specular rim in Safari and Firefox. Do not ship GLSL "refraction" unless it actually samples the backdrop (via `html2canvas` on a worker, or a host app that already renders to canvas). Otherwise delete `LiquidGlassGPU`.

### 9.3 Layer and nesting model
- Keep `LiquidGlassLayerProvider` but **make it enforce rules**. A surface at `depth ≥ 1` automatically switches to a **non-backdrop "inner" material** (opaque-ish fill plus rim, no `backdrop-filter`), as Apple does for content inside glass. `allowNestedGlass` opts out. Log a dev warning at `warningDepth`.
- Remove `transform: translateZ(0)`, `will-change` and `contain: paint` from the default material. Add `will-change` only during active animation.
- **Effect groups:** siblings in a `LiquidGlassEffectGroup` share one backdrop layer (a parent pseudo-element) so adjacent controls don't double-blur at their seams. This is also the place to implement morphing.

### 9.4 Background awareness
- Use an explicit **scheme/contrast contract** instead of DOM sniffing: `data-backdrop="light|dark|media"` on a section, inherited by CSS, which flips tint, text and rim tokens. Keep automatic sampling only as a dev-time linter. If you keep runtime sampling, skip `alpha=0` layers, walk up to the first opaque ancestor, and treat `background-image` as "media".
- Enforce legibility with a **minimum-opacity floor per scheme** and an automatic scrim for `clear` over media, in CSS rather than JS.

### 9.5 Fallbacks and accessibility
Put `@supports not (backdrop-filter: blur(1px))`, `prefers-reduced-transparency` and `forced-colors` rules on **`.ag-material`**, the single class every surface carries, so coverage is 100% by construction. The fallback fill must be the spec's `fallbackFill` (at least 85% opaque) with the rim and shadow kept, so the design still reads as premium.

### 9.6 Verification that measures material, not spelling
Replace the literal-spelling audit with (a) a lint rule: no `backdrop-filter`, `backdropFilter`, or `rgba(255,255,255,…)` outside `src/material/**`; and (b) a remote visual fixture matrix: each material × elevation × {photo, gradient, text-heavy, dark, light} backdrop × {supported, unsupported, reduced-transparency} × nested/un-nested. Score it with contrast measurement on the rendered pixels. Track "independent glass recipes" as a release metric, with a target of 1.

### 9.7 Delete list (5.0)
`HoudiniGlassProvider`/`HoudiniGlassCard`, `LiquidGlassGPU` (unless re-implemented against a real backdrop), `utils/createGlassStyle.ts`, `core/foundation/glassFoundation.ts`, `core/mixins/glassSurface.ts`, `theme/materials.ts`, legacy `glassTokens`/`glassUtils`, `OptimizedGlassAdvanced`/`GlassAdvanced`, every no-op prop on `OptimizedGlass`, the `glass-tier-*` and `liquid-glass-{refraction,reflection,parallax,advanced,layered-surface}` class emissions, the `storybook-utility-shim.css` import from `index.css`, and the stub functions that return constants (`validate*Contrast`, `sampleBackdropLuminance`, `captureBackdrop`). Move HeatGlass, Glass3DEngine, GlassMorphingEngine, the atmospheric and backgrounds components, and the R3F effects to an optional `aura-glass/fx` entry point. They are decorative scenes, not the material.

## Verification (adversarial)

Each finding was re-checked against source with the intent of refuting it. I did not render anything; every verdict comes from reading code.

| id | verdict | note |
|---|---|---|
| MATERIAL-ENGINE-01 | CONFIRMED | `combinedStyles` spreads `dynamicStyles` and then hard-sets `background`, `backgroundColor` and `opacity` (src/primitives/LiquidGlassMaterial.tsx:531-538). That discards the adaptive tint (:379-387), the modification tint (:334-336), the clear-variant dimming scrim (:389-395) and `modifications.opacity` (:330-332). The sample still reaches `data-liquid-glass-requires-dimming` and `data-liquid-glass-backdrop-source` (:559-565) and `onBackdropAnalysis` (:310), but no CSS selector in src reads those attributes (rg finds only the emitter), so there is no visual effect. The observers in src/hooks/useLiquidGlassBackdrop.ts:202-235 run on every resize, scroll and subtree mutation of the parent. |
| MATERIAL-ENGINE-02 | CONFIRMED | `captureElementBackdrop` paints a fixed #4f46e5 to #7c3aed to #ec4899 gradient (src/components/advanced/LiquidGlassGPU.tsx:573-600; the comment reads "For now, create a simple placeholder"). The component is publicly exported (src/index.ts:500-502). |
| MATERIAL-ENGINE-03 | CONFIRMED (counts approximate) | Two exported `createGlassStyle` functions exist and produce different materials. src/utils/createGlassStyle.ts:64 uses its own `tokens.gradient`/`elev` tables and has 21 importers. src/core/mixins/glassMixins.ts:41 uses `buildSurfaceStyles` and claims to be the "SINGLE PUBLIC API". My count is 15 distinct literal `saturate()` values in non-story src, about 20 including templated ones (1.5 and 150% are counted separately), and about 119 distinct backdrop-filter strings. Those are slightly below the claimed 19 and 130, but the conclusion holds. |
| MATERIAL-ENGINE-04 | PARTIAL | The stub is confirmed: all four `paintWorklet.addModule` calls are commented out (src/components/houdini/HoudiniGlassProvider.tsx:518-521), yet the code still assigns `paint(glass-*)` to backgroundImage, borderImage and borderImageSource (:396-415). Two parts are overstated. (a) `registerProperty` with a `var()` initialValue (:447-452) does throw, but the throw is inside a try/catch. It is swallowed, and it aborts the remaining registrations. (b) An unregistered `paint()` renders as a transparent image. Because only `background-image` is overwritten, `background-color` survives, so surfaces lose their layers rather than going "blank". The path is also gated on `options.enableWorklets` (:396). |
| MATERIAL-ENGINE-05 | CONFIRMED | `intensity, depth, tint, border, blur, variant, lighting` are destructured (src/primitives/OptimizedGlassCore.tsx:153-159) and never read in the style memo, which depends only on intent, elevation, tier, interactive, liftOnHover and press (:180-222). `caustics, chromatic, parallax, refraction, adaptive, magnet, cursorHighlight` become only `data-*` attributes (:298-304), and no CSS rule selects them (rg `[data-caustics` etc. returns 0 hits). There are exactly 166 component files with `<OptimizedGlass`, outside stories and tests. |
| MATERIAL-ENGINE-06 | PARTIAL | The conclusion holds: nested glass cannot sample the real backdrop, and no policy exists. `allowNestedGlass` and `depth` are stored (src/primitives/LiquidGlassLayerProvider.tsx:16-27, 97-102) but never read, and `liquid-glass-layered-surface` (LiquidGlassMaterial.tsx:525) has no CSS rule. The stated mechanism is partly wrong and "every surface" is overstated. Per Filter Effects 2, `transform: translateZ(0)` and `contain: paint` do not create a Backdrop Root. The actual roots are the parent's own `backdrop-filter` and `will-change: opacity, backdrop-filter`. In LiquidGlassMaterial, will-change and contain are conditional on microInteractions or parallax (:444-447). In tokens they are unconditional only for contain (src/tokens/glass.ts:1621-1624). |
| MATERIAL-ENGINE-07 | PARTIAL | Confirmed that `.liquid-glass-material` is absent from all three fallback blocks (src/styles/glass.css:4031-4044, 4073-4122). Inline `createGlassStyle` output is not covered unless the element also has one of the listed classes. The JS `prefers-reduced-transparency` check in glassMixins.ts:241/276 only feeds `canUseHighQualityGlass` and `getRecommendedTier`, and `createGlassStyle` defaults to `tier="high"`, so it does not apply. On the modules: there are 30 `*.module.css` files, 21 of which use backdrop-filter. One of them, GlassPageTabs.module.css:269/280, has its own reduced-transparency and forced-colors handling, so "26 missed" is slightly overstated. |
| MATERIAL-ENGINE-08 | CONFIRMED | `parseRgb` accepts `rgba(0, 0, 0, 0)` (src/hooks/useLiquidGlassBackdrop.ts:35-50). `getComputedBackdropColor` keeps it (:80-86). `elementsFromPoint` returns the topmost non-self element, which is usually a transparent wrapper. `luminanceFor` ignores alpha (:52-60), and the averaging (:134-145) carries alpha but never uses it. The result is that transparent wrappers read as black, which pushes the sample toward "dark". |
| MATERIAL-ENGINE-09 | PARTIAL | Confirmed dead: `noiseOpacity` (0 reads outside generated tokens), `enableNoise` (only defined at src/tokens/glass.ts:880-902), `adaptiveOpacity` (only defined), and `buildBackdropFilter` (only its definition at :940). Refuted: `surface.base`, `border` and `text` are read in src/core/mixins/glassMixins.ts:64, 193-198, src/tokens/themeTokens.ts:192-194 and LiquidGlassMaterial.tsx:268. `ior` is read as a gate (`ior > 1`, LiquidGlassMaterial.tsx:357) and shown in debug output (:590), but its value never affects the optics. |
| MATERIAL-ENGINE-10 | CONFIRMED | No CSS defines `glass-backdrop-blur-md-medium` (used at src/components/website-components/GlassWipeSliderExamples.tsx:52) or `backdrop-saturate-*` / `backdrop-brightness-*` (src/primitives/glass/OptimizedGlassAdvanced.tsx:414-420). src/styles/index.css:25 imports `storybook-utility-shim.css`, which has 224 unprefixed rules (`.absolute`, `.bg-black`, `.backdrop-blur-md`, ...). index.css ships as the public `./styles` export (package.json:38). |
| MATERIAL-ENGINE-11 | CONFIRMED | The audit flags any non-literal TS value as `dynamic-*-unproven` (scripts/audit/static-glass-material-audit.js:1385-1404). That rule explains the duplicated 16/24/32/40/48 ternary ladders in src/tokens/glass.ts:1002-1021 and LiquidGlassMaterial.tsx:338-372. The ladders also silently map any blur outside those five values to 48px. Every token today uses one of the five, so this is latent. |
| MATERIAL-ENGINE-12 | CONFIRMED | `deviceorientation` is attached without `DeviceOrientationEvent.requestPermission()`, so iOS Safari never fires it (src/primitives/LiquidGlassMaterial.tsx:273-297). Hover and press set `transition: all` (:406, :412). The base token transition is also `all` (src/tokens/glass.ts:1034). |

## Verification (adversarial), second independent pass

I re-checked each finding against the source on 2026-10-06 and did not rely on the pass above. Where the two passes disagree, the note says why.

| id | verdict | note |
|---|---|---|
| MATERIAL-ENGINE-01 | CONFIRMED | `combinedStyles` hard-sets `background`, `backgroundColor` and `opacity` after spreading `dynamicStyles` (src/primitives/LiquidGlassMaterial.tsx:532-540). That discards the adaptive tint (:380-387), the dimming scrim (:389-396), the contrast tint (:334-336) and `modifications.opacity` (:330-332). One small overstatement: "all adaptation discarded" is not quite true. The contrast-guard `backdropBlur` override (:338-351) and the `fallbackMode` class (:513) survive, because `backdropFilter` is not overwritten. Sampling is on by default (`adaptToContent = true`, `material = "liquid"`, :148, :156, :191-196). LiquidGlassMaterial is imported by 31 non-story, non-test src files. The "23 families" figure is plausible, but I did not recount it. |
| MATERIAL-ENGINE-02 | CONFIRMED | The capture function paints a fixed #4f46e5, #7c3aed, #ec4899 gradient after the comment "For now, create a simple placeholder" (src/components/advanced/LiquidGlassGPU.tsx:578-600). It is exported at src/index.ts:500-502. |
| MATERIAL-ENGINE-03 | CONFIRMED | `rg -l -i "backdrop-filter\|backdropFilter" src` finds exactly 121 files. A rough regex finds about 139 distinct filter value strings, which includes noise, and 20 distinct `saturate(...)` tokens, including % forms. Both `createGlassStyle` functions exist (src/utils/createGlassStyle.ts:64 and src/core/mixins/glassMixins.ts:41). Only the glassMixins version reaches the package's public index (src/index.ts:960-964). The utils version is the one that internal components import, so the public API and the internals render different materials. |
| MATERIAL-ENGINE-04 | PARTIAL | The stub is confirmed: the addModule calls are commented out (src/components/houdini/HoudiniGlassProvider.tsx:517-520) while `paint()` is assigned (:396-415, gated on `enableWorklets`). The registration claim is confirmed: all six `registerProperty` calls share one try/catch, and the first uses `initialValue: "var(--glass-bg-default)"`, which is not computationally independent and throws. The global flag is set before the throw, so registration never retries. Two parts are overstated. (a) Replacing `background-image` removes the gradient, but `background-color` survives. (b) It does not "strip the border". When `border-image-source` cannot be displayed, the UA falls back to `border-style`/`border-color`, so the normal border still renders. |
| MATERIAL-ENGINE-05 | CONFIRMED | `intensity, depth, tint, border, blur, variant, lighting, optimization` are destructured (src/primitives/OptimizedGlassCore.tsx:150-160) and appear again only in the `__ignore*` strip block (:245-269). `caustics, chromatic, parallax, refraction, adaptive, magnet, cursorHighlight` reach only `data-*` (:298-305), and no `.css` file selects any of them. The undercount runs the other way: `glowColor`, `glowIntensity` and `animation` are also destructured and never used. 168 files under src/components contain `<OptimizedGlass`, which is consistent with "166 components". |
| MATERIAL-ENGINE-06 | CONFIRMED | The context stores `depth`/`allowNestedGlass` (src/primitives/LiquidGlassLayerProvider.tsx:16-27, 97-102), and no consumer reads `allowNestedGlass`. `layer.depth` hits are unrelated z-space layers. `liquid-glass-layered-surface` (LiquidGlassMaterial.tsx:525) has zero CSS rules. A parent with `backdrop-filter` is itself a Backdrop Root under Filter Effects 2, so child glass samples only the parent's composited content. That holds even when `will-change` (:444-447) is conditional. |
| MATERIAL-ENGINE-07 | PARTIAL | The coverage gap is confirmed: `.liquid-glass-material` is absent from the reduced-transparency (src/styles/glass.css:4022-4044), forced-colors (:4073-4097) and `@supports not` (:4099-4122) lists. The outcome claim is wrong for unsupported browsers. src/styles/glass.generated.css:1006-1012 is imported earlier by src/styles/index.css:11 and contains `@supports not (backdrop-filter: blur(0)) { [class*="glass-"] { background: rgba(0,0,0,0.85) !important } }`. That selector matches `liquid-glass-material` and every element carrying any `glass-*` utility class, including text, layout and icons. Because of `!important`, it beats the inline 1.8-10.5% white fill. The real failure is an 85% black slab on any element with a `glass-` class, which is worse than claimed and conflicts with glass.css's own `--glass-backdrop-fallback-bg`. |
| MATERIAL-ENGINE-08 | CONFIRMED | `parseRgb` returns `{0,0,0,a:0}` for `rgba(0, 0, 0, 0)` and rejects only the literal keyword `transparent`, which computed styles never return (src/hooks/useLiquidGlassBackdrop.ts:35-50). `getComputedBackdropColor` keeps it (:80-86). `elementsFromPoint(...).find(...)` takes the topmost non-self element, usually a wrapper (:62-78). `luminanceFor` ignores `a` (:52-60), and the average carries `a` but never uses it (:134-145). Luminance near 0 maps to `contrastHint "dark"`. |
| MATERIAL-ENGINE-09 | CONFIRMED | `noiseOpacity` appears only in src/tokens/glass.ts and src/tokens/generated.ts. `enableNoise`, `adaptiveOpacity` and `buildBackdropFilter` appear only in src/tokens/glass.ts, with no readers anywhere else in src. `ior` is used only as a gate in `materialSpec.ior > 1` (LiquidGlassMaterial.tsx:357, which swaps saturate 1.4 for 1.5) and in a debug readout (:590). The default `material="liquid"` (:148) resolves to `LIQUID_GLASS.material.ior.liquid = 1.33` (src/tokens/glass.ts:1320-1324, 1497), while docs/liquid-glass/primitives/liquid-glass-material.md:13 says the default is 1.43. ("standard" would use 1.52, and neither is 1.43.) |
| MATERIAL-ENGINE-10 | CONFIRMED | No CSS rule defines `.backdrop-saturate-*` or `.backdrop-brightness-*` (used at src/primitives/glass/OptimizedGlassAdvanced.tsx:414-420), and none defines `glass-backdrop-blur-md-medium`. src/styles/index.css:25 imports storybook-utility-shim.css, whose header says it is a Storybook Tailwind emulation (:1-3). It contains 228 rule selectors, 229 of them non-`glass-` class starts. index.css ships as `./styles` (package.json:38). The "about 224" figure is in range. |
| MATERIAL-ENGINE-11 | PARTIAL | The audit treats any non-literal TS value as `dynamic-*-unproven` (scripts/audit/static-glass-material-audit.js:1385-1404), and the 5-branch ladders exist twice per site (src/tokens/glass.ts:1002-1021, LiquidGlassMaterial.tsx:338-370). "Forced" is an inference about intent, not something the code proves. The 48px fallthrough is latent: every `backdropBlur.px` in src/tokens/glass.ts is 16, 24, 32, 40 or 48, with 6 of each, and nothing in tokens, primitives or utils scales `px`. Only a consumer-supplied custom spec would hit it. |
| MATERIAL-ENGINE-12 | CONFIRMED | src/primitives/LiquidGlassMaterial.tsx:273-297 attaches `deviceorientation` with no `requestPermission`. A correct pattern already exists in the repo at src/components/advanced/GlassOrientationEffects.tsx:128-135, which makes the omission an inconsistency. `transition: all` is set at :406 and :412. `setDeviceTilt` puts every orientation event through React state (:286-289), and there is no throttle. |
