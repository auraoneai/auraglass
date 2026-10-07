# AuraGlass 5.0 Target Architecture: Material-First Proposal

Status: proposal (architecture angle: "design from the material engine outward").
Date: 2026-10-06. Baseline: `aura-glass` 4.1.0 (`15b6de6f7`).

Inputs read in full: all `autopsy/*.md` present on 2026-10-06 (material-engine, tokens-theme, packaging-ssr-dx, accessibility, motion, hooks-utils-types, appshell-workspace-recipes-cli, server-services-ai, storybook-showcase, runtime-local), all `research/*.md` (apple-liquid-glass, web-glass-techniques, translucent-a11y-perf, competitors), and the 480-record component inventory (`autopsy/inventory/shard-*.json`, summarized by script). The qa-certification, history-hygiene, api-consistency, docs-readme, performance and visual-quality autopsies did not exist when this was written; sections 13 and 15 note where they could change a decision.

Source spot-checks I ran myself (read-only):
- `src/primitives/LiquidGlassMaterial.tsx:532-540`: the final `combinedStyles` overwrites `background` with a constant 145° white gradient after spreading `dynamicStyles`. MATERIAL-ENGINE-01 is confirmed.
- `src/primitives/Slot.tsx:76`: reads `child.ref`, which React 19 has removed. PACKAGING-SSR-DX-11 is confirmed.
- `src/index.ts:1`: `"use client"` sits on the root barrel. PACKAGING-SSR-DX-03 is confirmed.
- `src/tokens/glass.ts:1034-1036`: `transition: all …` and `transform: translateZ(0)` are on every canonical surface. MATERIAL-ENGINE-06 and MOTION-09 are confirmed.
- `package.json`: peer `react >=18 <20`, dev `react 18.2.0`, `framer-motion >=10` peer, `^11.18.2` dev. No Radix, React Aria or Base UI dependency today.

Visual evidence is limited to pixel statistics (storybook-showcase §1). No screenshot was viewed.

---

## 0. Thesis in one paragraph

AuraGlass 4.x has roughly 13 independent glass recipes (MATERIAL-ENGINE-03), 8 token sources (TOKENS-THEME-01), 10 reduced-motion detectors (MOTION duplication), 4 contrast engines that always pass (ACCESSIBILITY-01), and 480 components with an average inventory score of **3.0/10**. Most components (304 of 480) are marked CONSOLIDATE or REMOVE. Patching components one at a time cannot fix this, because every component carries its own copy of the material. 5.0 therefore inverts the dependency direction. **One material engine is compiled to CSS once, and every surface in the library is a projection of it.** Components choose a *role* (variant, thickness, layer). They never choose optics. The engine owns environment, layering, lighting, refraction tier, adaptive contrast and accessibility fallbacks. Tokens feed the engine. Headless behavior comes from an adopted foundation (Base UI). Components are thin. 5.0 is a hard major and is not shipped as a 4.x continuation.

Success metric, tracked in CI: **independent glass recipes = 1**. Today it is about 13, and this metric is recommended in material-engine §9.6.

---

## 1. Evidence baseline (what the design must fix)

| Problem | Evidence | Architectural response |
|---|---|---|
| Adaptive material is computed and then thrown away | MATERIAL-ENGINE-01 (verified) | The engine has no JS style merge at all. Optics are CSS-only, keyed on data attributes (§3) |
| About 15 physical props on `OptimizedGlass` are no-ops | MATERIAL-ENGINE-05, 166 call sites | The `Surface` API exposes only knobs the engine actually renders (§3.3) |
| Every surface is a backdrop root, so nested glass breaks | MATERIAL-ENGINE-06; Filter Effects 2 Backdrop Root (web-glass-techniques §2) | Nesting is resolved in CSS: inner surfaces switch to a non-backdrop material automatically (§3.5) |
| a11y fallbacks miss `.liquid-glass-material` and inline glass | MATERIAL-ENGINE-07, ACCESSIBILITY-05 | Every surface carries one attribute (`data-ag-surface`), so fallback coverage is 100% by construction (§6) |
| GPU refraction refracts a hard-coded purple gradient | MATERIAL-ENGINE-02 | The cinematic tier is allowed only over library-owned pixels (§3.6) |
| Houdini stub blanks surfaces | MATERIAL-ENGINE-04; Houdini polyfill archived 2026-04-19 (web-glass-techniques §4) | Houdini is deleted |
| 8 token sources; 55% of CSS vars dead; 213 undefined | TOKENS-THEME-01, -09 | One DTCG tree, one compiler, dead and undefined var gates (§4) |
| `prefers-reduced-transparency` never fires in Safari or Firefox | translucent-a11y-perf §3; web-glass-techniques §8 | A transparency axis with an explicit user and app control (§6) |
| ContrastGuard always passes | ACCESSIBILITY-01/02 | A build-time two-extreme composite contrast gate plus opacity floors (§6.3) |
| Keyboard models missing (slider, tree, date picker, grid, menubar) | ACCESSIBILITY-06..08, -12, -15 | Adopt Base UI and React Aria behavior (§5) |
| 5.8 MB single-file client bundle; `GlassButton` alone is 449 KB gzip | PACKAGING-SSR-DX-02 | `preserveModules` ESM; 15 KB gzip budget for one button (§2, §10) |
| RSC: whole root is one client boundary; subpaths crash in RSC | PACKAGING-SSR-DX-03 | Server-safe material via data attributes; per-file directives (§8) |
| Backend stack installed for every consumer | PACKAGING-SSR-DX-01, SERVER-SERVICES-AI-01 | Removed from the package (§11) |
| Import has side effects (click and scroll tracking, `<html>` mutation, audio) | HOOKS-UTILS-TYPES-01, -15 | A side-effect-free import gate (§13) |
| Motion has no language; reduced-motion "100%" claim is false (6/25 pass) | MOTION-01..06 | Material motion tokens plus a single policy store (§7) |
| Storybook shows glass over white; 345/356 screenshots ≥90% near-white | STORYBOOK-SHOWCASE-01/02 | An environment matrix is a first-class part of the engine and of certification (§3.1, §13) |
| App-shell grid classes don't exist; sidebar stacks above content | APPSHELL-WORKSPACE-RECIPES-CLI-01/02 | No utility-class system; authored, layered component CSS (§9) |
| React 19 ref breakage; 450 `forwardRef` | PACKAGING-SSR-DX-11 (verified at `Slot.tsx:76`) | React 19-only, ref as prop (§8.2) |

Inventory snapshot (480 records): KEEP 10, POLISH 46, REDESIGN 70, CONSOLIDATE 158, REPLACE 24, DEPRECATE 26, REMOVE 146. Mean dimension scores are production 2.65, docs 2.99, consistency 3.23, a11y 3.30, material 3.45. The worst directories by mean are `effects` 1.3, `accessibility` 1.4, `immersive` 1.7, `advanced` 1.9 (32 REMOVE) and `cms` 1.9. 24 records are flagged `flagship_candidate`, and §9.2 names them.

---

## 2. Package and entry-point structure

### 2.1 Packages

| Package | Contents | Runtime deps |
|---|---|---|
| `aura-glass` | Material engine, tokens, core and flagship components, subpaths below | `clsx`, `@base-ui/react` (pinned exact). Peers: `react`/`react-dom` `^19.2` |
| `@auraglass/cli` | `init`, `add`, `diff`, `migrate` (icons, `4to5` codemods), `audit`, `doctor`. Moved from `bin/aura-glass.cjs` so UI consumers don't install it | none at the app's runtime |
| `@auraglass/registry` (static JSON, published to a URL and npm) | shadcn-compatible `registry.json` with `registry:base` (whole material system) and blocks/pages | n/a |
| Not published in 5.0 | `server/`, `src/services/**`, workers, "AI" simulations, quantum/consciousness. These are deleted or moved to a private `auraone/auraglass-hosted` repo (SERVER-SERVICES-AI rec. 1) | n/a |

ESM-only, with `"type": "module"`. CJS consumers on Node 20.19+/22 use `require(esm)`. Rationale: Next 16 requires Node 20.9+ (translucent-a11y-perf §7.1), and dropping CJS removes the shared-`.d.ts` ESM/CJS type ambiguity (PACKAGING-SSR-DX-15). Sourcemaps are excluded from the tarball. Target is under 2 MB packed, against 9.65 MB today (runtime-local §3).

### 2.2 Subpath exports of `aura-glass`

Every subpath is a real entry with its own type barrel. No subpath may alias the root (PACKAGING-SSR-DX-06, HOOKS-UTILS-TYPES-05).

| Subpath | Purpose | RSC status | Optional peers |
|---|---|---|---|
| `aura-glass` | Curated core plus flagship components (§9), about 110 to 130 exports, an explicit generated manifest with no `export *` | Mixed. Per-file `"use client"` only where needed | none |
| `aura-glass/material` | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps()`, `defineMaterial()`, types; `MaterialRuntime` (client) | Server-safe except `MaterialRuntime` | none |
| `aura-glass/tokens` | Generated TS constants and types, matched to runtime (fixes TOKENS-THEME-10) | Server-safe | none |
| `aura-glass/styles.css` | The whole layered stylesheet (tokens, material, components, a11y) | n/a | none |
| `aura-glass/tokens.css`, `aura-glass/material.css` | Partial sheets for consumers who style their own components on the AuraGlass material | n/a | none |
| `aura-glass/tailwind.css` | Tailwind v4 `@theme` bridge plus `@utility` material classes (§9.4) | n/a | `tailwindcss@^4` |
| `aura-glass/theme` | `createGlassTheme`, `AuraGlassProvider`, `useGlassPreferences`, presets | Provider is client; `createGlassTheme` is server-safe | none |
| `aura-glass/motion` | Spring, layout and drag helpers on `motion` (pinned) | Client | `motion` |
| `aura-glass/icons` + `aura-glass/icons/<name>` | One file per glyph, `/*#__PURE__*/`, `sideEffects:false` (HOOKS-UTILS-TYPES-02) | Server-safe | none |
| `aura-glass/app-shell` | One merged shell plus workspace (absorbs `/workspace` and `/workflows`; APPSHELL-06) | Mixed | none |
| `aura-glass/ai` | Provider-agnostic AI product primitives (SERVER-SERVICES-AI rec. 5) | Mixed | none |
| `aura-glass/data` | Table, Tree, Calendar/DatePicker, KeyValueEditor, FilterBar, chart shell and sparkline | Client | `react-aria-components` (§5); chart adapters optional |
| `aura-glass/forms` | `GlassForm` field bindings for react-hook-form (inventory POLISH: GlassForm family) | Client | `react-hook-form` |
| `aura-glass/fx` | Decorative environment backdrops that *declare their luminance* (`AuroraBackground` 6.5, the highest-scoring inventory record; `AuroraOrb`; one `AmbientBackground`; one `ParticleField`) | Mixed | none |
| `aura-glass/three` | Cinematic tier: WebGL refraction over library-owned media and canvas (§3.6) | Client | `three`, `@react-three/fiber` |
| `aura-glass/legacy` | Time-boxed 4.x shims: `OptimizedGlass`/`LiquidGlassMaterial`/`GlassCore` → `Surface` adapters, old `GlassAppShell` prop mapping, renamed-export aliases. It logs dev warnings and is **removed in 6.0** | Client | none |
| `aura-glass/package.json` | Kept | n/a | n/a |

Removed subpaths: `forms` and `data` as root aliases (they become real entries), `navigation`, `overlays`, `marketing`, `workflows`, `workspace` (merged), `client`, `ssr`, `server`, `registry` (moved to `@auraglass/registry`), `services/*`, and the `dist/esm` deep paths. Evidence: PACKAGING-SSR-DX-06, -12, -13; SERVER-SERVICES-AI-14.

No `labs` subpath. Experimental scenes either belong to `fx` with a perf budget, or they leave the package. A labs entry inside a semver'd package recreates the 4.x pattern in which 35% of stories went to fake AI and effects (STORYBOOK-SHOWCASE-06).

### 2.3 Build

There is one tool: tsdown (or Rollup with `preserveModules` plus `rollup-plugin-preserve-directives`). It replaces `build-all.js`, the unused `rollup.config.js`, and the full `tsc` emit to `dist/esm` (PACKAGING-SSR-DX-12). Output is one file per module, so directives survive and tree-shaking works within an entry. Declarations come from `tsc --emitDeclarationOnly` with alias rewriting, and the build fails if any `dist/**/*.d.ts` contains `from "@/` (HOOKS-UTILS-TYPES-06). `sideEffects: ["**/*.css"]`.

---

## 3. Material engine architecture

The engine lives in `src/material/**`. It is the **only** place in the repo allowed to write `backdrop-filter`, `rgba(255,255,255,…)`, blur literals, or specular gradients. A lint rule enforces this (material-engine §9.6a; ACCESSIBILITY rec. 2).

### 3.1 Concepts

```
Environment ─▶ Layer ─▶ Material (variant × thickness) ─▶ Lighting ─▶ Tier ─▶ Contrast floor ─▶ Fallback
  (what's        (chrome,      (regular | clear |          (light angle,   (lightweight |   (transparency   (reduced-transparency,
   behind)        overlay,      identity; thin |            specular,       standard |       axis + user      contrast:more,
                  transient,    regular | thick;            rim, interact)  enhanced |       opacity dial)    forced-colors,
                  content)      + derived 'inner')                          cinematic)                        no backdrop-filter)
```

1. **Environment.** This is a declared description of what is behind glass. Browsers cannot expose backdrop pixels to JS (apple-liquid-glass §2.2 [I]; translucent-a11y-perf §2.3), so 4.x's DOM color sniffer is wrong by design. It reads transparent wrappers as black (MATERIAL-ENGINE-08, ACCESSIBILITY-09). 5.0 uses a **declared contract**: `data-ag-backdrop="light | dark | media | auto"` on any ancestor, inherited through CSS. `auto` resolves from the color scheme. Library-owned backdrops (`fx/*`, media components, `Environment image=…`) declare their own value, and they may sample their *own* pixels (an image's average or a canvas) to refine it. Sampling DOM behind the element is never allowed at runtime. A dev-only linter (`@auraglass/cli audit backdrop`, remote Playwright) can sample real pixels to flag undeclared risky sections.
2. **Layer.** This is Apple's core rule, made enforceable (apple-liquid-glass §2.5). Glass belongs to `chrome` (bars, rails, toolbars), `overlay` (popover, menu, dialog, sheet, toast) and `transient` (a slider thumb or switch knob, glass only while manipulated). The `content` layer (cards, tables, body text) uses **content materials**: opaque-leaning tinted fills with no `backdrop-filter`, unless the author explicitly opts in with `variant="regular"` on a card over media. This directly answers NN/g's "text on top of images" finding (translucent-a11y-perf §4) and the 4.x habit of applying glass to everything.
3. **Material.** This has two orthogonal axes plus one derived state:
   - `variant`: `regular | clear | identity`. This is Apple's typed union; "They should never be mixed" (apple-liquid-glass §2.6). `clear` *requires* a dimming scrim when the backdrop is `light` or `media` (35% default, HIG). `identity` renders no optics, which allows conditional toggling.
   - `thickness`: `thin | regular | thick`, with a default derived from the component's size class (chip = thin, card/popover = regular, sheet/sidebar = thick). Thickness drives blur radius, shadow depth, rim width, refraction strength and opacity floor ("thickness scales with size", apple-liquid-glass §2.3; tokens-theme §9.2 "size-dependent blur").
   - Derived `inner`: any surface nested inside another surface renders as `inner`, which is fill plus rim with no `backdrop-filter` (§3.5). This is never a prop. The engine derives it.
   - `content` materials: `content-raised`, `content-sunken`. These are non-backdrop, tinted from the canvas.
   - `scrim`: the modal dimming layer.
   - Intent (`primary | danger | …`) is **not** a material axis. It tints only rim and specular, or the single `prominent` tone ("tint is stained glass, not paint", apple-liquid-glass §2.7). This deletes the 30 intent × elevation specs, which `buildSurfaceStyles` collapses to one background anyway (TOKENS-THEME §7).
4. **Lighting.** One global light: `--ag-light-angle` (`@property <angle>`), `--ag-specular-intensity`, `--ag-rim-width`. The highlight is a masked rim (`mask-composite` gradient border) plus an angle-driven top sheen, drawn on `::before`/`::after`. Interaction ("illuminates from within", apple-liquid-glass §2.4) modulates the opacity of a pre-composited glow layer. It never uses `transition: all`, and it never animates `backdrop-filter` (MOTION-09). The light angle can optionally follow the pointer through `MaterialRuntime` writing one CSS variable on `:root`, which is rAF-throttled, off under reduced motion, and never React state (MATERIAL-ENGINE-12).
5. **Tier.** This is the rendering capability level (§3.6).
6. **Contrast floor.** The transparency axis and user opacity dial (§6).
7. **Fallback.** These are the preference and capability rungs (§6).

### 3.2 Material spec (TypeScript, compiled at build time)

```ts
// src/material/spec.ts
export type MaterialVariant = 'regular' | 'clear' | 'identity';
export type Thickness = 'thin' | 'regular' | 'thick';
export type Layer = 'chrome' | 'overlay' | 'transient' | 'content';
export type Backdrop = 'light' | 'dark' | 'media' | 'auto';
export type Tier = 'lightweight' | 'standard' | 'enhanced' | 'cinematic';
export type Transparency = 'glass' | 'tinted' | 'solid';
export type Shape = 'fixed' | 'capsule' | 'concentric';

export interface MaterialSpec {
  blur: Record<Thickness, Length>;            // e.g. thin 12px / regular 20px / thick 32px
  saturation: number;                          // single value, e.g. 1.6 (replaces 19 distinct values)
  brightness: number;
  tint: { light: OklchAlpha; dark: OklchAlpha; media: OklchAlpha }; // derived from sys.color.canvas via RCS
  opacityFloor: Record<Transparency, Record<Thickness, number>>;    // contrast-gated (§6.3)
  rim: { width: Record<Thickness, Length>; light: OklchAlpha; shade: OklchAlpha };
  specular: { intensity: number; spread: Angle };
  refraction: { bezel: Record<Thickness, Length>; scale: Record<Thickness, number> }; // enhanced tier
  grain: { opacity: number; asset: 'ag-grain-128.avif' };
  shadow: Record<Thickness, ShadowToken>;      // ambient + key, mode-aware
  scrim: { clearOverBright: number /* 0.35 */; modal: number };
  fallbackFill: Record<'light' | 'dark', OklchColor>; // ≥ 0.85 alpha (material-engine §9.5)
}

export function defineMaterial(spec: Partial<MaterialSpec>): MaterialSpec; // brand overrides, build-time
```

The spec comes from the DTCG token tree (§4). The compiler emits:
- **literal** per-combination rules for `-webkit-backdrop-filter`, because there is an unverified report that Safari's prefixed property ignores `var()` (web-glass-techniques §2 [R]). Each `[data-ag-variant][data-ag-thickness][data-ag-tier]` combination gets both prefixed and unprefixed literal values. This is a legitimate reason for literal values, so the static audit that "certified spelling" (MATERIAL-ENGINE-11) becomes a by-product of the compiler instead of a constraint on authors. There are about 3 variants × 3 thicknesses × 2 backdrop tiers, so roughly 18 rules.
- `@property` registrations for the animatable scalars (`--ag-light-angle`, `--ag-specular-intensity`, `--ag-surface-alpha`, `--ag-refraction-scale`). There are 0 today (material-engine §2).
- TS constants for docs and tests.

### 3.3 Runtime API

```tsx
// aura-glass/material — server-safe (no hooks, no context)
export function materialProps(opts: {
  variant?: MaterialVariant; thickness?: Thickness; layer?: Layer;
  shape?: Shape; fallbackRadius?: Length; interactive?: boolean; prominent?: boolean;
}): { 'data-ag-surface': ''; 'data-ag-variant': …; 'data-ag-thickness': …; 'data-ag-layer': …;
      'data-ag-shape'?: …; 'data-ag-interactive'?: ''; 'data-ag-prominent'?: ''; className: 'ag-surface' };

export function Surface<E extends ElementType = 'div'>(props: SurfaceProps<E>): JSX.Element; // render-as via `render` prop (Base UI style)
export function SurfaceGroup(props: { spacing?: Length; children: ReactNode }): JSX.Element;  // one shared backdrop
export function Environment(props: { backdrop: Backdrop; image?: string; video?: string; children: ReactNode }): JSX.Element;
export function ScrollEdge(props: { edge: 'top' | 'bottom'; style?: 'soft' | 'hard' }): JSX.Element;
export function ConcentricFrame(props: { radius: Length; inset: Length; children: ReactNode }): JSX.Element;

// client
export function MaterialRuntime(props: { tier?: Tier | 'auto'; pointerLight?: boolean }): null;
export function useMaterialTier(): Tier;
```

Rules:
- **No inline optics.** `Surface` emits only `data-*` and one class. It emits no `style` apart from consumer passthrough. That makes MATERIAL-ENGINE-01 (a JS merge overwriting adaptive output) structurally impossible.
- `Surface` is a server component. Components built on Base UI apply material with `render={<Surface …/>}` or by spreading `materialProps()` onto Base UI parts.
- The `Surface` prop surface is the spec's role knobs and nothing else. 4.x props `caustics`, `chromatic`, `refraction`, `lighting`, `ior`, `tier`, `depth`, `tint`, `glowIntensity`, `optimization` and `hardwareAcceleration` are deleted (MATERIAL-ENGINE-05, -09). `/legacy` maps the 4.x props it can and warns about the rest.

### 3.4 CSS custom-property contract

Public variables (themable, documented, semver-stable) use `--ag-*`. Private engine internals use `--_ag-*` and are not API.

| Group | Public variables |
|---|---|
| Environment | `--ag-light-angle`, `--ag-specular-intensity` |
| Preference | `--ag-user-opacity` (0 to 1, the user dial §6.2) |
| Material read-outs (for consumers' own CSS) | `--ag-surface-fill`, `--ag-surface-rim`, `--ag-surface-shadow`, `--ag-surface-radius`, `--ag-on-surface`, `--ag-on-surface-muted` |
| Shape | `--ag-radius-outer`, `--ag-inset`, `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))` (apple-liquid-glass §2.8) |
| Focus | `--ag-focus-inner`, `--ag-focus-outer`, `--ag-focus-width` |
| Layout | `--ag-scroll-padding-top`, `--ag-scroll-padding-bottom` (written by sticky chrome, WCAG 2.4.11) |
| Semantic sys tokens | `--ag-color-canvas`, `--ag-color-accent`, `--ag-space-*`, `--ag-radius-*`, `--ag-type-*`, `--ag-duration-*`, `--ag-ease-*` |
| shadcn interchange aliases | `--background`, `--foreground`, `--primary`, `--ring`, `--radius` … emitted in `tokens.css` and mapped to sys tokens (competitors §5.2) |

DOM attribute contract: `data-ag-surface`, `data-ag-variant`, `data-ag-thickness`, `data-ag-layer`, `data-ag-backdrop`, `data-ag-tier` (root), `data-ag-scheme`, `data-ag-contrast`, `data-ag-transparency`, `data-ag-motion`, `data-ag-density`. These replace the roughly 10 competing theme hooks (`data-theme`, `data-aura-theme`, `data-persona`, `.glass-on-light`, `.dark` …; TOKENS-THEME §2).

### 3.5 Optical layer stack and nesting (CSS)

```css
@layer ag.material {
  .ag-surface {                         /* every surface, every component */
    position: relative; isolation: isolate;
    border-radius: var(--ag-surface-radius);
    background: var(--_ag-fill);        /* tint + opacity floor (§6) */
    box-shadow: var(--_ag-shadow);
    color: var(--ag-on-surface);
  }
  .ag-surface::before {                 /* (1) backdrop layer: optics live HERE, not on the element */
    content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
    /* compiler emits literal backdrop-filter per variant×thickness×tier */
  }
  .ag-surface::after {                  /* (3) rim + specular + grain, mask-composited to the border band */
    content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  }

  /* Nested glass → inner material, no JS (fixes MATERIAL-ENGINE-06 / "no glass on glass") */
  .ag-surface .ag-surface:not([data-ag-allow-nested])::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .ag-surface .ag-surface:not([data-ag-allow-nested]) { --_ag-fill: var(--_ag-inner-fill); }

  /* SurfaceGroup: one shared backdrop for siblings (apple-liquid-glass §2.10) */
  [data-ag-group] > .ag-surface::before { backdrop-filter: none; -webkit-backdrop-filter: none; }
}
```

Why the blur sits on `::before` and not on the element: the element itself must not become a backdrop root for descendant overlays, and grain needs `mix-blend-mode` on a child layer because blend modes create backdrop roots (web-glass-techniques §2, §5). The engine sets no `transform: translateZ(0)`, no `will-change`, and no `contain: paint` by default (MATERIAL-ENGINE-06). `will-change` is added only during an active transition, through `[data-ag-animating]`.

`LiquidGlassLayerProvider` (inventory POLISH) is cut down to a **dev-only** diagnostic. In development, `MaterialRuntime` counts `[data-ag-surface]` nesting depth and visible surface count, then warns past budget (§3.6). The context-based depth tracking is deleted, because CSS now does the enforcement, and because the 166 `OptimizedGlass` users never participated in it anyway (material-engine §4).

### 3.6 Rendering tiers, budgets, refraction per browser

| Tier | What renders | Who gets it | Budget per viewport | Cost class |
|---|---|---|---|---|
| **lightweight** | `fallbackFill` (≥85% alpha) plus rim plus shadow. No `backdrop-filter` | `@supports not (backdrop-filter: blur(1px))`, `data-ag-transparency=solid`, `prefers-reduced-transparency`, forced colors, `MaterialRuntime` low-power heuristic (`hardwareConcurrency ≤ 4` combined with `(pointer: coarse)` and `saveData`), or an explicit `tier` | unlimited | paint only |
| **standard** (default, SSR) | `backdrop-filter: blur(thickness) saturate(1.6) brightness(…)` on `::before`, tint plus floor, rim and specular, static grain | All modern engines (Chrome 76+, Firefox 103+, Safari 9+/18 unprefixed; web-glass-techniques §2) | ≤6 blurred surfaces on fine-pointer desktop, ≤3 on coarse pointer. Blur cap 32px; a full-viewport blur only on `scrim` at ≤12px | compositor blur, scales with radius × area × layers |
| **enhanced** | standard plus **edge-band refraction**: SVG `feImage` displacement map → `feDisplacementMap` through `backdrop-filter: url(#ag-lens-<shape>-<sizeclass>)`, clamped to the bezel (12/16/24px by thickness). The specular map is composited in the same filter | **Chromium only**, selected by engine detection. Opt-in per surface with `refraction` on flagship chrome only. Safari and Firefox stay standard with the stronger specular rim | ≤2 refracting lenses visible | high; the map rebuilds only when the size class changes |
| **cinematic** | WebGL/WebGPU shader refraction, chromatic dispersion and Fresnel, **only over pixels the library owns** (`Environment image/video`, `fx/*` canvas, `three` scenes). Never over arbitrary DOM | `aura-glass/three`, explicit opt-in | 1 WebGL context per page (cap is about 16 browser-wide, web-glass-techniques §1.2) | GPU pass per frame, paused offscreen and when the tab is hidden |

Refraction approach and rationale:
- **Chromium:** `backdrop-filter: url()` displacement is the only real-backdrop refraction available (kube.io reference, web-glass-techniques §1.1, §1.4). Maps are precomputed per shape × size class, encoding Snell's law with a convex squircle bezel at n≈1.5. Only `scale` is animated, which is cheap. A map is regenerated only when the size class changes, not on every resize.
- **Safari:** WebKit bug 245510 has unmerged PRs and a planned software path (web-glass-techniques §1.4). Safari gets standard plus rim lighting. If WebKit ships it, the engine enables it through the same detection switch, with no API change.
- **Firefox:** it parses `url()` and renders nothing, so `@supports` cannot detect it (web-glass-techniques §1.4 [R]). Detection is therefore by engine (`navigator.userAgentData?.brands` Chromium check, with a 1×1 pixel-probe fallback). It is **never** done with `@supports`.
- Refraction is never placed under text. It is confined to the bezel band ("refraction belongs at the bezel", web-glass-techniques §9 [I]), and it never contributes to the contrast floor (translucent-a11y-perf §6).
- Optional small-lens path (toggles, slider thumbs): an SVG `filter` on an inner content copy (PallavAg pattern) is cross-browser but unverified [R]. It is **deferred** until the remote perf harness proves it (§13).
- Deleted: `LiquidGlassGPU` (fake backdrop, MATERIAL-ENGINE-02), `GlassWebGLShader` unless rebuilt into the cinematic tier (inventory target "One WebGL effect primitive … sample a real backdrop or rename"), `HeatGlass`/`Glass3DEngine` displacement of their own content (MATERIAL-ENGINE §7), and Houdini.

Tier resolution: SSR always renders `standard`, which is pure CSS with no attribute required. `MaterialRuntime` (client, mounted by `AuraGlassProvider`) may set `data-ag-tier` on the provider root after mount to downgrade (low power) or upgrade (enhanced). It also injects the shared `<svg><defs>` lens filters once. Neither action changes the React tree, so there is no hydration mismatch (compare PACKAGING-SSR-DX-08 and HOOKS-UTILS-TYPES-09/10, which are 4.x mismatch bugs).

Budgets are design targets, not measured facts. No reproducible public `backdrop-filter` benchmark exists (web-glass-techniques §2; translucent-a11y-perf §6). The remote perf harness in §13 must calibrate them before 5.0 GA, and the numbers above are the initial values to test.

### 3.7 Concentricity, scroll edge, state-driven opacity

- `shape="concentric"` reads `--ag-radius-inner` from the nearest `ConcentricFrame`, and `fallbackRadius` applies when standalone. `capsule` = `9999px`. Kept from `LiquidGlassConcentricFrame` (inventory POLISH; material-engine §3).
- `ScrollEdge` is kept (inventory POLISH) and is automatic in `TopBar`, `Toolbar` and `TabBar`. It has `soft | hard` styles and is one per view (apple-liquid-glass §2.9).
- Opacity is state: `[data-ag-layer=overlay][data-expanded]` raises the floor one step, and `[data-ag-modal]` adds the scrim (apple-liquid-glass §2.11). These are driven by Base UI's own `data-open`/`data-expanded` attributes, so no glue code is needed.

---

## 4. Token architecture

One DTCG tree (`tokens/*.tokens.json`, `$value`/`$type`) and one compiler (Style Dictionary 4 with custom `glass-material` and `motion` transforms). These replace the 8 sources and 4 generators listed in TOKENS-THEME §2 and §6.

| Tier | Visibility | Content |
|---|---|---|
| `ref` | private | OKLCH ramps (`ref.color.slate.1…12`), `ref.blur.*`, `ref.radius.*`, `ref.duration.*`, `ref.space.*` (4pt) |
| `sys` | public, mode-resolved | `sys.color.{canvas, on-surface, on-surface-muted, accent, focus-inner, focus-outer, specular, …}`, `sys.space`, `sys.radius.{xs 6, sm 10, md 14, lg 20, xl 28, full}` plus concentric, `sys.type.{display, title-1..3, body, callout, caption, label, mono}` (fluid `clamp()`, on-surface weight bump), `sys.elevation`, `sys.motion` |
| `material` | public composite (`$type: glass-material`) | The `MaterialSpec` of §3.2. Values may only reference `sys` |
| `comp` | optional, narrow | `comp.button.radius`, `comp.tooltip.thickness` |

Mode matrix. Each axis is a separate generated block keyed by `[data-ag-*]` **and** mirrored in the matching media query, so it works with zero JS (TOKENS-THEME §9.3):

| Axis | Values | Media mirror |
|---|---|---|
| scheme | light, dark | `prefers-color-scheme`; leaf colors use `light-dark()` |
| contrast | standard, more | `prefers-contrast: more` (**not `high`**, ACCESSIBILITY-04) |
| transparency | glass, tinted, solid | `prefers-reduced-transparency: reduce` → tinted; `forced-colors: active` → solid |
| motion | full, calm, none | `prefers-reduced-motion: reduce` → calm |
| density | compact, regular, spacious | none |

Personas become 4 to 6 `ThemePreset`s, each with light **and** dark canvases. Persona and brand may override `sys.*` only and never `material.*` ("persona tints the canvas, not the glass", kept from `designMatrix.ts:93-101`). `createBrandGlassTheme(brand)` derives the accent ramp and tint from one OKLCH input with relative color syntax. Narrative persona metadata moves to docs (TOKENS-THEME-13).

Fonts: the system stack is the default. Aeonik (12 woff2 files, commercial, no license notice) is removed from the package until a license review passes (TOKENS-THEME-12, PACKAGING-SSR-DX-05). If licensed, it ships as opt-in `aura-glass/fonts.css`.

Gates (§13): dead or undefined `--ag-*` var check, types-vs-runtime check per subpath, and the build-time contrast matrix.

---

## 5. Headless and a11y foundation: adopt Base UI, with React Aria for domain widgets

**Decision.** Core interactive behavior comes from **Base UI** (`@base-ui/react`, pinned exact). Domain widgets that Base UI lacks or does less deeply (Calendar/DatePicker, Tree, Table with DnD and grid navigation) come from **React Aria Components**, as an optional peer of `aura-glass/data` only. AuraGlass keeps owned code only for the small primitives that are already good: `Slot` (fixed for React 19), `Portal` (KEEP 6.5), `FocusScope` (KEEP 5.5), `Label` (KEEP), and `VisuallyHidden`. These are internal, or exported from the root as utilities.

Evidence for adopting instead of building:
- The owned behavior layer is where 4.x fails accessibility. Slider has no keyboard (ACCESSIBILITY-06). Tree views have no keyboard (-07). The date picker has no dialog or grid (-08). The menubar violates APG (-12). Tabs produce duplicate IDs (-13). The data grid is not a grid (-15). Accordion uses tab roles (-16). There are 4 focus traps, 3 announcers and 3 skip-link implementations (accessibility §6). The inventory's own slider target is "Rebuild on a proven slider behaviour (Radix Slider / react-aria useSlider)".
- The ecosystem has consolidated. Base UI is shadcn's default base since July 2026 and has 19.27M weekly downloads. React Aria is shadcn's third base and the HeroUI v3 foundation (competitors §1, §3). Hand-rolling focus, dismissal and typeahead is "off-consensus".
- Animation fit: Base UI exposes CSS state attributes (`data-open`, `data-starting-style`, `data-ending-style`). That lets the material's state-driven opacity (§3.7) and CSS-first motion (§7) run with no framer dependency in core.
- `render`-prop composition lets `Surface` *be* the popup element, which keeps one DOM node and one backdrop.

Why not Radix: it is now the legacy-compatible base, Radix Themes is slowing (last push 2026-04-11), and 4.x's own CLI markets "No Radix required" while shipping `migrate radix` (competitors §3; APPSHELL §Outdated). Base UI comes from the same authors and uses the newer API.

Why not React Aria everywhere: it is heavier and more verbose (competitors §3, "verbose APIs"), and core chrome does not need its depth. It is confined to `/data` because that is where its press, drag, grid, calendar and i18n depth pays off.

Cost and risk: a runtime dependency enters core. Mitigations: pin the exact version; wrap Base UI parts in AuraGlass compound components, so it is never re-exported and can be swapped behind the API; and add a bundle budget per component. This choice reverses the 3.2-era "no third-party primitives" positioning, and that reversal needs explicit product sign-off (§15).

What AuraGlass still owns: material, tokens, focus-ring rendering, touch-target floors, glass-specific a11y fallbacks, and component composition. Owned a11y rules:
- **Focus:** one implementation, a 2px two-tone `outline` (inner `--ag-focus-inner`, outer ring through `outline-offset` plus `::after`). It meets WCAG 2.4.13 AAA by default. Under forced colors it is `outline: 2px solid Highlight`. Box-shadow rings are never the only indicator (translucent-a11y-perf §5; ACCESSIBILITY-11). All Tailwind `focus:*` strings are deleted (105 occurrences).
- **Touch targets:** at least 24×24 for every control (WCAG 2.5.8), and a 44px hit area under `(pointer: coarse)` through a pseudo-element (ACCESSIBILITY-14).
- **IDs:** `useId` only. `Math.random()` in render is banned (540 uses today; PACKAGING-SSR-DX-08).
- **Icons:** decorative only when no `aria-label` or `title` is present (HOOKS-UTILS-TYPES-07).

---

## 6. Adaptive contrast and reduced-transparency mechanism

### 6.1 Rungs (CSS, layer `ag.a11y`, keyed on `[data-ag-surface]`)

| Trigger | Result |
|---|---|
| `transparency=glass` (default) | Material floor for the thickness and backdrop |
| `transparency=tinted` ← `prefers-reduced-transparency: reduce`, `data-ag-transparency=tinted`, or user dial ≥ 0.7 | Floor raised (Apple "frostier", apple-liquid-glass §3), no refraction, blur kept |
| `contrast=more` ← `prefers-contrast: more` or `data-ag-contrast=more` | At least tinted, plus a 1px solid contrasting border; near-black/white on-surface; specular off (Apple Increase Contrast) |
| `transparency=solid` ← `forced-colors: active`, `@supports not (backdrop-filter)`, or the user choice | `backdrop-filter: none`, `background: Canvas` / `fallbackFill`, `color: CanvasText`, borders through `border-color: CanvasText`, shadows dropped (forced colors removes them; translucent-a11y-perf §3) |

Coverage is by construction: one selector, `[data-ag-surface]`, and every surface carries it. This replaces hand-maintained class lists that miss `.liquid-glass-material` and inline-style glass (MATERIAL-ENGINE-07, ACCESSIBILITY-05). There are no `!important` rules. Layer order (§9.3) puts `ag.a11y` after `ag.components`, so it wins without them.

### 6.2 User and app control (Safari and Firefox gap)

`prefers-reduced-transparency` is Chromium-only (no Safari through 27.x, flagged off in Firefox; translucent-a11y-perf §3), so it cannot be the only signal. `AuraGlassProvider` exposes:
- `transparency: 'system' | 'glass' | 'tinted' | 'solid'`
- `glassOpacity: number` (0 to 1), Apple's iOS 27 "ultra-clear to fully tinted" slider (apple-liquid-glass §1, §3). It writes `--ag-user-opacity`, and the fill alpha is `max(floor, mix(floor, 1, var(--ag-user-opacity)))`.
- A ready-made `<GlassPreferencesPanel>` (Tier 2), so product teams can expose the dial to end users. The setting persists through the injectable storage adapter from `SettingsContext` (kept, HOOKS-UTILS-TYPES §Excellent).

### 6.3 Contrast guarantee (build-time, measurable)

All runtime ContrastGuard machinery is deleted: the `ContrastGuard` component and class, `useAutoTextContrast`, `validate*Contrast`, and `sampleBackdropLuminance` (ACCESSIBILITY-01..03, TOKENS-THEME-07). It is replaced by:
1. **Two-extreme composite gate** (translucent-a11y-perf §2.3). For every preset × scheme × contrast × transparency × variant × thickness, composite the tint at its floor alpha over pure white and over pure black, then over a "busy" reference (a saturated mid-gray gradient). `on-surface` must reach ≥4.5:1 against every composite, `on-surface-muted` large-text ≥3:1, and `contrast=more` ≥7:1. Blur counts for nothing. The floors in `MaterialSpec.opacityFloor` are *solved* by the compiler (the minimum alpha that passes) and committed as generated output. One luminance implementation (`src/theme/color.ts`, kept) replaces 13 copies (accessibility §6).
2. **`clear` discipline.** `variant="clear"` with `backdrop=light|media` gets the 35% scrim automatically. With `backdrop=auto` it is a dev error.
3. **Rendered-pixel verification** in remote certification (§13), measured on real composites across 8 environments.
4. **`contrast-color()`** (Baseline April 2026) is used only for text on *known* opaque tints (chips, prominent buttons), with an `@supports` fallback. It is never presented as solving backdrop contrast (translucent-a11y-perf §2.3).
5. APCA Lc is reported as advisory only (WCAG 3 is unresolved; translucent-a11y-perf §2.2).

Glyph flipping ("small elements flip light/dark", apple-liquid-glass §2.2) follows declared `data-ag-backdrop` and needs no runtime sampling. Large surfaces don't flip; they raise the floor instead.

---

## 7. Motion system

Principle: **glass responds with light, not by bouncing.** Hover and press modulate specular, rim and shadow opacity. Entrances "materialize" by cross-fading the pre-blurred `::before` and rim layers together with a small scale. `backdrop-filter` and `filter` are never animated (MOTION-09; apple-liquid-glass §2.1; HIG "avoid animating into and out of blurs").

Tokens, one source (DTCG `motion`), emitted to CSS vars and TS:
- Durations in ms only: `micro 120`, `small 200`, `medium 320`, `large 450`. Exits are about 30% shorter.
- Curves: `standard cubic-bezier(0.2,0,0,1)` and `emphasized` / `emphasized-decelerate` / `accelerate`. These are kept from `tokens.css:115-123` (motion §Excellent). Penner back and elastic curves are deleted.
- Springs (only in `/motion`): `snappy` (critically damped), `smooth` (ζ≈0.9), `fluid` (drag release, sheets). The underdamped `100/10` default is deleted (MOTION-06).

Implementation layers:
1. **Core, CSS-first, no JS dependency.** Transitions on Base UI state attributes, `@starting-style` for entry, and same-document View Transitions (Baseline since October 2025) for tab-indicator and menu→sheet continuity. View Transitions snapshot backdrop blur as a flat image (web-glass-techniques §6 [I]), so morphing surfaces drop optics during `:active-view-transition` and cross-fade them back afterwards. That behavior must be verified per engine in the motion lane (§13).
2. **`aura-glass/motion`**, optional `motion` peer at a pinned major, for springs, `layoutId` and drag (sheets, tab bar momentum, magnetic button). There is one adapter that converts ms tokens to `motion` units (motion rec. 1).

Policy: there is one preference store, `usePreference(key)` on `useSyncExternalStore`, with one shared `MediaQueryList` per query and a server snapshot of `false` (HOOKS-UTILS-TYPES rec. 2). It is overridable by the provider. `motion: 'full' | 'calm' | 'none'`, where `calm` keeps opacity cross-fades and drops transforms, springs, pointer light and elasticity (Apple Reduce Motion; Motion UI's "calm", competitors §3). `allowContinuous` defaults to **false**, and every loop is gated on it (MOTION-12). Under `prefers-reduced-motion: reduce`, motion is at most `calm`, and **no API may override the OS preference upward**. `MotionPreferenceContext`'s `"always-safe"` and the 87 `respectMotionPreference` opt-outs are deleted (MOTION-07). The 10 detectors, 4 providers and 9 physics stacks are deleted (MOTION duplication, HOOKS-UTILS-TYPES-04).

Lint: no `transition: all` (350 sites today), and only `transform`, `opacity` and registered `--ag-*` scalars may be animated. rAF loops require delta-time and pause when offscreen or hidden. Per-frame values must not live in React state (MOTION-10, motion §Mediocre).

---

## 8. RSC / "use client" and React version strategy

### 8.1 Server Components

- The material is data attributes plus CSS, so **presentational components are Server Components**: `Surface`, `SurfaceGroup`, `Environment` (static), `ScrollEdge`, `ConcentricFrame`, `Card`, `Badge`, `Text`/`DisplayText`, `Stack`/`Grid`, `Separator`, `Alert` (static), `EmptyState`, `Skeleton`, `Icon`/every glyph, `Kbd`, `Avatar` (static), and the AppShell layout frame. Today zero AuraGlass components can be RSC (PACKAGING-SSR-DX-03).
- `"use client"` is per leaf module and preserved by the build. Lint rules fail the build when a module uses hooks or context without the directive, or carries the directive with no client usage. 61 shipped files have the directive needlessly today, and 370 test files have it (packaging §What exists).
- Client components exported across the boundary take serializable props. Callback props live only on client compositions (translucent-a11y-perf §7.2).
- `AuraGlassProvider` is a client component. It writes only `data-ag-*` attributes and a `<style>` of brand overrides, with no inline token dump. Theme presets can also be applied **without** the provider by putting `data-ag-*` on `<html>` in a server layout. The CSS must look correct with no provider at all (PACKAGING-SSR-DX DX score, step 4).
- Hydration: no `Math.random()` in render, no lazy initializers reading the DOM, and every preference hook has a `false`/standard server snapshot.

### 8.2 React version and refs

**Peer `react@^19.2`, `react-dom@^19.2`. React 18 is dropped.** Reasons:
- Next 16 (Turbopack default, React 19.2 features) is the primary consumer target (translucent-a11y-perf §7.1). Repo devDeps pin React 18.2 and override `scheduler`, so React 19 is not actually tested today (PACKAGING-SSR-DX-11).
- `forwardRef` "will be deprecated". `element.ref` is removed, and `Slot.tsx:76` already depends on it (verified).
- A major release is the cheapest place to delete 450 `forwardRef` calls. Supporting both would require a version-sniffing shim across every component.

Pattern: `function Button({ ref, ...props }: ButtonProps & { ref?: Ref<HTMLButtonElement> })`. `Slot` reads `child.props.ref`. Ref callbacks use React 19 cleanup functions for observers. Library code follows the Rules of React and CI builds a fixture with `babel-plugin-react-compiler`, so it is compiler-safe. `@types/react@19`, no global `JSX` namespace (PACKAGING-SSR-DX-11).

---

## 9. Component taxonomy, flagship tier, styling distribution

### 9.1 Taxonomy (material role first)

| Tier | Material role | Members |
|---|---|---|
| **T0 Material** | is the engine | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `MaterialRuntime` |
| **T1 Flagship chrome and overlays** | `chrome` / `overlay` / `transient` glass, enhanced tier eligible | listed in §9.2 |
| **T2 Core content and controls** | `content` materials; transient glass on knobs and thumbs only | `Card`, `Input`, `Textarea`, `Checkbox`, `Radio`/`RadioGroup`, `NumberField`, `DateField` (KEEP 5.5), `TimeField` (KEEP 6), `Field`/`Label`/`FieldGroup`/`ValidationMessage`, `Alert`, `Badge`, `Avatar`, `Progress`/`Meter`, `Skeleton`, `LoadingState`, `EmptyState`, `Separator`, `Stack`/`Grid`/`Container`, `Breadcrumbs`, `Pagination`, `Accordion` (heading plus button, ACCESSIBILITY-16), `Timeline`, `Rating`, `Kbd`, `InlineEdit`, `ImageList`, `GlassPreferencesPanel`, `Icon` + glyphs |
| **T3 Domain (subpaths)** | uses T0–T2 | `/data`: `Table` (one headless core plus glass skin; replaces GlassDataTable plus 4 "consciousness" variants, inventory REDESIGN 3.3), `Tree` (merges two), `Calendar`/`DatePicker`, `KeyValueEditor`, `FilterBar`, `Sparkline`, `ChartFrame`. `/ai`: `Thread`, `Message` (roles user/assistant/system/tool), `StreamingText`, `ToolCallCard`, `CitationChip`/`SourceList`, `ReasoningDisclosure`, `AgentStatus`/`StepTimeline`, `Composer`, `FeedbackBar`, `UsageMeter`, `ProviderErrorState` (SERVER-SERVICES-AI rec. 5–6; carries over `GlassTypingIndicator` POLISH and the `role="log"` semantics). `/app-shell`: §9.2. `/fx`: AuroraBackground, AuroraOrb, AmbientBackground, ParticleField. `/three`: cinematic lens |
| **Removed** | — | §11 |

Root export target: about 120 names, against 1,073 values today (packaging §Measured). The manifest is generated, and CI fails on duplicate names. The 90 aliases are dropped (`Button=GlassButton` and so on). Naming: the `Glass` prefix goes from component names (`Button`, `Dialog`), because the package is the glass namespace. `/legacy` re-exports the old names for one major.

### 9.2 Flagship tier (named)

These are the components that get the enhanced tier, the full environment certification matrix and the premium showcase. The selection comes from the inventory's 24 `flagship_candidate` records, merged by their own consolidation targets:

| 5.0 flagship | Built on (Base UI part) | Absorbs (inventory evidence) |
|---|---|---|
| `Button`, `IconButton` | Button | GlassButton, EnhancedGlassButton, RippleButton, GlassLinkButton (packaging §Duplication), GlassMagneticButton behavior as `/motion` option |
| `SegmentedControl` | Radio/ToggleGroup | GlassSegmentedControl (4.3), LiquidGlassSegmentedControl, GlassToggleGroup single |
| `Toolbar` / `ToggleGroup` | Toolbar, ToggleGroup | LiquidGlassControlGroup (4.4), ToggleButtonGroup |
| `Tabs` + `TabBar` presentation | Tabs | GlassPageTabs (KEEP 6.0, canonical styling), GlassTabs (5.0), EnhancedGlassTabs, LiquidGlassTabBar (3.8), GlassTabBar |
| `Switch` | Switch | GlassSwitch (POLISH 5.3), with shimmer loop removed (MOTION-12) |
| `Slider` | Slider | GlassSlider (REDESIGN 3.3, ACCESSIBILITY-06); transient-glass thumb |
| `Dialog`, `Sheet` (side, bottom, action) | Dialog | GlassModal (5.0), GlassDialog, GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet, MobileGlassBottomSheet |
| `Popover`, `Tooltip` | Popover, Tooltip | positioned with CSS anchor positioning where Baseline (web-glass-techniques §6), Floating UI inside Base UI otherwise |
| `Menu` (+ `ContextMenu`, `Menubar`) | Menu, ContextMenu, Menubar | GlassDropdownMenu (POLISH 5.0, canonical), GlassContextMenu, GlassMenubar (ACCESSIBILITY-12) |
| `Select`, `Combobox`, `MultiSelect` | Select, Combobox | GlassSelectCompound (5.2), GlassMultiSelect (6.0; its token CSS), GlassCombobox ARIA model |
| `SearchField` | Combobox/Input | LiquidGlassSearchField (4.8) |
| `Command` (+ palette shell) | Dialog plus Combobox | GlassCommand (3.5), GlassCommandPalette (4.0), LiquidGlassCommandSurface |
| `Toast` | Toast | GlassToast ×2, GlassNotificationCenter (3.0) |
| `AppShell` (`TopBar`, `Sidebar` rail and panel, `Main`, `Inspector`, `StatusBar`, `SplitPane`, `MobileShell`) | Dialog (mobile drawer), owned separator | both GlassAppShells (4.5 / 3.0; APPSHELL-06), ZSpaceAppLayout, workspace components, legacy draggable SplitPane measured against its container rect (APPSHELL-12) |
| `MediaControls`, `NowPlayingBar`, `PhotoInspector` | Slider, Toolbar | LiquidGlassMediaControls (POLISH 5.5) and siblings, the canonical **clear-over-media** demonstration |
| `Thread` + `Composer` (`/ai`) | owned | new; the AI flagship surface |
| `CarouselRail` | owned | LiquidGlassCarouselRail (POLISH) |
| Transitions: `SourceTransition` | View Transitions | LiquidGlassSourceTransition (REDESIGN 3.0) |

`LiquidGlassEffectGroup` (REDESIGN 4.0) becomes `SurfaceGroup`. `LiquidGlassMaterial` (REDESIGN 3.5), `OptimizedGlassCore` and `GlassCore` become `Surface`.

### 9.3 Styling distribution: CSS layers

There is a single authored stylesheet. Component CSS is co-located (`button.css`) and compiled into `aura-glass/styles.css` plus per-entry partials. It is all inside one root layer:

```css
@layer ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;
```

- Consumers order it: `@layer theme, base, ag, components, utilities;`. App utilities then beat library CSS with no specificity fight, and unlayered library CSS can no longer override app utilities (translucent-a11y-perf §7.3).
- Zero `!important` (257 today), no global element selectors (`h1`–`h6` today), no `:root` dumps beyond the tokens layer, and no Storybook CSS (PACKAGING-SSR-DX-04; TOKENS-THEME-06).
- **No utility-class system inside the library.** The `glass-*` utility vocabulary is deleted. About 33 of 94 app-shell tokens and all 168 responsive variants are undefined (APPSHELL-01/02), and `storybook-utility-shim.css` ships global `.flex`/`.grid`. Components use semantic BEM-ish hooks (`.ag-button`, `.ag-app-shell__body`) and container queries for responsiveness. A CI check fails if any `className` token in source has no selector in the built CSS (APPSHELL rec. 1).
- `cn` = `clsx` only. `tailwind-merge` is dropped from core (HOOKS-UTILS-TYPES §Mediocre).

### 9.4 Tailwind v4 interop

`aura-glass/tailwind.css`:
```css
@import "aura-glass/tokens.css";
@theme inline {
  --color-canvas: var(--ag-color-canvas); --color-accent: var(--ag-color-accent);
  --radius-md: var(--ag-radius-md); --ease-standard: var(--ag-ease-standard); /* … */
}
@utility glass-regular { /* applies data-free equivalent of [data-ag-variant=regular] via material.css mixin rules */ }
@utility glass-thin    { … }  @utility glass-thick { … }  @utility glass-clear { … }
@custom-variant ag-dark (&:where([data-ag-scheme=dark] *));
@custom-variant ag-tinted (&:where([data-ag-transparency=tinted] *));
```
The library ships no Tailwind class strings, so consumers do **not** need `@source "../node_modules/aura-glass"`, which avoids the v3/v4 purge mismatch class of bugs (translucent-a11y-perf §7.3). The zero-Tailwind path (plain CSS vars) is first-class. The shadcn variable aliases (§3.4) make AuraGlass drop into a shadcn app, and `@auraglass/registry` ships `registry:base` for copy-in ownership (competitors §5.2).

---

## 10. Performance budgets (enforced in CI)

| Budget | Target | 4.1 today |
|---|---|---|
| `import { Button } from 'aura-glass'` (min+gz, peers external) | ≤15 KB, including Base UI part | 449 KB |
| `aura-glass/styles.css` gz | ≤35 KB | 49.9 KB |
| `aura-glass/material` JS gz | ≤3 KB (runtime only) | n/a |
| Single icon | ≤1 KB | category = all 160 icons |
| Tarball packed | ≤2 MB | 9.65 MB |
| Production `dependencies` | ≤3 (`clsx`, `@base-ui/react`, plus at most one) | 24 |
| Node ESM cold import of root | ≤150 ms | 4.4 s (date-fns barrel) |
| Visible blurred surfaces | §3.6 budgets; dev warning past budget | unbounded |
| Per-component perf grade | Published A–F from the remote harness (compositor/paint/filter cost), in the style of MotionScore (competitors §5.4) | none |

---

## 11. Removed and extracted

| Item | Fate | Evidence |
|---|---|---|
| `server/`, `src/services/**`, `src/lib/ai-client.ts`, `tsconfig.server.json`, `build:server`/`hosted`, the `docker:*` scripts | Deleted from the package. Extracted to a private hosted repo only if a consumer exists (grep AuraOne consumers first). Any future generation routes through Kiro Prism in the *app*, never in the library | SERVER-SERVICES-AI-01..17 |
| Backend and AI runtime deps (express, socket.io, openai, pinecone, vision, redis, ioredis, sentry/node, bcrypt, jwt, helmet, cors, compression, dotenv, rate-limit, zod, date-fns, chart.js, react-chartjs-2, react-hook-form as hard deps) | Removed. RHF and chart libraries become optional peers of `/forms` and `/data` | PACKAGING-SSR-DX-01; runtime-local §3 |
| `adaptiveAI`, `emotionalIntelligence`, `aiPersonalization`, `consciousnessOptimization`, `ConsciousnessStreamProvider`, `types/consciousness`, workers, `soundDesign` default-on | Deleted. Sound returns, if at all, as opt-in `useGlassSound`, default off (inventory target) | HOOKS-UTILS-TYPES-01, -14, -15 |
| Simulated AI components (GAN, DeepDream, StyleTransfer, NeuralWeight, Neuromorphic, AIGlassThemeProvider, ProductionAIIntegration, VoiceGlassDemo) | Deleted | SERVER-SERVICES-AI-10 |
| `src/components/{advanced, quantum, immersive, effects, cms}` REMOVE records (32 + 5 + 5 + 6 + 6) and the other 92 REMOVE records | Deleted. Decorative scenes worth keeping are rebuilt in `/fx` under a perf grade | inventory |
| Material duplicates: both `createGlassStyle`, `glassFoundation`, `glassSurface` mixin, `theme/materials.ts`, legacy `glassTokens`/`glassUtils`/`liquidGlassUtils`, `OptimizedGlassAdvanced`/`GlassAdvanced`, `HoudiniGlassProvider`/`Card`, `LiquidGlassGPU`, `glass.generated.css`, `glass.css` recipes | Deleted, replaced by `src/material` | material-engine §9.7 |
| Token duplicates: `designConstants.ts`, `theme/tokens.ts`, `themeTokens.ts`, `designMatrix` metadata, 3 orphan generators, 5 theme providers, 2 `useGlassTheme`, `core/themeContext` | Deleted. One provider and one hook | TOKENS-THEME §9.9 |
| Motion duplicates (10 detectors, 4 providers, 2 physics engines, 5 easing tables, `useGalileoStateSpring`, GlassTransitions' shadow Accordion/Modal/Tabs, bounce/rainbow keyframes) | Deleted | motion rec. 5 |
| ContrastGuard family and the stale a11y, reduced-motion and certification reports | Deleted | ACCESSIBILITY rec. 1, 7; MOTION-01 |
| `src/client` demo pages, `src/data`, `src/constants`, `glass-api-stable.ts`, about 4,600 dead util lines, `utils/ssr.ts` caches, `new Function` detection | Deleted. Demo pages move to the docs app | HOOKS-UTILS-TYPES-17, -18, -20 |
| `layouts/` novelty (Fractal, Orbital, Tessellation, Island) | Deleted. Masonry merged once into T2 `Grid` options | APPSHELL rec. 7 |
| Storybook-only props (`previewUsers`, `forceVisible`, `isStorybookDataMedia`), the shim CSS, the 13 text-only galleries, `StorybookVisualShowcase`, `LiquidGlassShowcase` `!important` overrides | Deleted | STORYBOOK-SHOWCASE-03, -04, -07 |
| Aeonik fonts | Removed pending license review | TOKENS-THEME-12 |
| `bin/aura-glass.cjs` | Moved to `@auraglass/cli` (its write-safety, audit and Lucide codemod are kept) | APPSHELL §Excellent |
| 28 recipes | Cut to about 10 flagship blocks in the JSON registry. Zero inline layout, zero hex, zero `!important`, real interaction, provider-agnostic | APPSHELL-04, -07, -08, -11 |

---

## 12. Versioning: 5.0 is a hard major

Yes, 5.0 is a breaking major, and it must not be softened into a 4.x line. Five reasons:
1. **Peer change:** React 18 is dropped and ref-as-prop replaces `forwardRef` (§8.2).
2. **Module format:** ESM-only, a new export map, and removed subpaths (§2).
3. **API removal:** about 950 root exports go away, including aliases, fake components, backend services and global side effects (§9.1, §11).
4. **Visual contract change:** one material replaces about 13 recipes. Every surface will render differently, and some should, because the 4.1 neutral fill is 1.8% white, effectively unfilled (runtime-local §4; `c07fd7111`).
5. **DOM and CSS contract change:** `data-ag-*` attributes, `--ag-*` variables, the layered stylesheet, and no `glass-*` utilities.

Migration path:
- **4.2 (bridge minor, ships first):** commit the npm 11/12 pack-JSON fix (packaging §Uncommitted), fix the stale snapshots (runtime-local §4), add dev deprecation warnings on everything in §11, and ship `aura-glass/material` as an *experimental* subpath, so teams can adopt `Surface` early.
- **5.0:** `/legacy` provides adapters (`OptimizedGlass` → `Surface`, old prop names → nearest role or a warning, old export names). `npx @auraglass/cli migrate 4to5` rewrites imports, renames components, maps `intent`/`elevation` props to `variant`/`thickness`, removes no-op props, and swaps `forwardRef` in consumer wrappers where it can be detected.
- **6.0:** `/legacy` is removed.

Semver policy from 5.0: the public API covers the export manifest, `--ag-*` public vars, `data-ag-*` attributes, the material role union and the token `sys` tier. `--_ag-*` and `ref` tokens are private. A visual change to materials is a minor release only if it passes the contrast and environment gates, and it is called out in the changelog with before/after composites.

---

## 13. Certification model

The 4.x certification checked DOM presence ("a `glass`-named element exists"), labelled every run dark, ran with animation and reduced motion forced, and passed 498 targets with 0 issues (STORYBOOK-SHOWCASE-02, MOTION-08, APPSHELL-03). 5.0 certifies **the material, the behavior and the artifact**. Heavy lanes run remotely (CI or remote runners). None runs on the Mac.

| Lane | What it proves | Gate |
|---|---|---|
| **Static** | Lint: no optics outside `src/material`, no color/blur/duration literals in components (ratcheting baseline from about 1,890), no `transition: all`, no emoji or raw `<svg>` UI icons (HOOKS-UTILS-TYPES-08), no `!important` in components or stories, `"use client"` correctness, no `Math.random` in render; undefined-class check; dead/undefined `--ag-*` check | Fail on any violation |
| **Artifact** | `publint`, `@arethetypeswrong/cli`, types-vs-runtime export test per subpath, no `@/` in `.d.ts`, dependency allowlist, size budgets (§10), **side-effect-free import** (jsdom: no listeners, intervals, `<html>` mutation, Workers, or AudioContext) | Fail |
| **Token** | Two-extreme composite contrast matrix (§6.3); floors solved and diffed | Fail below 4.5:1 / 3:1 / 7:1 |
| **Behavior** | Playwright APG keyboard scripts per widget; `@axe-core/playwright` with color-contrast on in a real browser; emulation of `forcedColors`, `contrast: more`, `reducedMotion`, `reducedTransparency`; SSR `renderToString` → `hydrateRoot` with zero warnings | Fail |
| **Environment visual matrix** | Each flagship and T0 surface × {regular, clear} × {thin, regular, thick} × tier {lightweight, standard, enhanced on Chromium} × 8 licensed, bundled environments (photo, saturated abstract, dense text, dark media, white, black, high-frequency pattern, video frame; STORYBOOK rec. 1) × scheme × transparency {glass, tinted, solid}. Pixel baselines per cell. **Measured text contrast on rendered pixels**. A "glass over nothing" detector fails when backdrop luminance variance under a surface is near zero | Fail on contrast, baseline drift past threshold, or a starved backdrop |
| **Performance** | A remote harness on emulated mid-tier mobile and a 120 Hz desktop: frame time versus visible surface count, blur radius and tier; calibrates the §3.6 budgets; publishes a per-component grade | Fail below grade C for T1 |
| **Motion** | Video and frame-strip capture with motion on; under `reducedMotion: reduce`, assert no rAF or WAAPI activity after settle; View Transition behavior with optics per engine | Fail |
| **Integration** | Next 16 / React 19.2 fixture: Server Component imports of T0/T2, `next build`, zero hydration warnings. Vite fixture *rendered* in a browser with a one-button gzip assertion. Recipe render gate that accumulates errors and fails on layout overlap or overflow (APPSHELL-03) | Fail |
| **Manual** | Living matrix for 12 core widgets: VoiceOver/Safari, NVDA/Chrome, physical iOS/Android touch (closes issue #16) | Release blocker for GA |

Evidence is generated per version into `reports/<version>/` as CI artifacts and is **not committed** as proof. Committed evidence JSON is how 4.0 and 4.1 shipped with 3.5.0 Vite evidence (PACKAGING-SSR-DX §Uncommitted). Release metrics on the dashboard: independent glass recipes (target 1), literal-color count (ratchet to 0), root export count, button gzip, and contrast-matrix minimum.

Storybook becomes the **Material Lab**. A toolbar `environment` global offers the 8 backdrops, which is the default way to view any surface, and the "no decorative backgrounds" rule is deleted (STORYBOOK-SHOWCASE-01). Per material and tier pages have live knobs and a contrast read-out. Component Lab matrices are auto-generated from typed variant metadata. Three or four premium app showcases are built from unmodified components (AI workspace, media over real video, analytics at real data size, mobile settings sheet). Motion defaults to the OS setting, and forced reduction applies only in the CI snapshot run.

Note: the qa-certification and visual-quality autopsies were not available. If they show that Chromatic or the Storybook test-runner is already partially wired, the visual lane should reuse it rather than building new tooling.

---

## 14. Delivery sequence (dependency order)

1. **Engine core:** DTCG tree, compiler, `MaterialSpec`, CSS layer stack, `Surface`/`SurfaceGroup`/`Environment`, a11y rungs, contrast gate, and the Material Lab with 8 environments. Exit criterion: the environment matrix is green for `Surface` alone.
2. **Foundation:** build tool switch, export map, side-effect gate, preference store, `AuraGlassProvider`, the motion tokens and CSS layer, Base UI integration, and the React 19 ref pattern.
3. **Flagship T1** (§9.2), each certified through every lane before the next starts. Order: Button → Dialog/Sheet → Menu → Popover/Tooltip → Select/Combobox → Tabs/TabBar → Toolbar/SegmentedControl → Switch/Slider → Toast → Command → AppShell → MediaControls → AI Thread.
4. **T2 core**, then the `/data`, `/ai`, `/forms`, `/fx` and `/three` subpaths.
5. **`/legacy` adapters, the `4to5` codemod, registry blocks and docs.** Removal (§11) happens throughout. Nothing in §11 is ported.

Parallelism: steps 1 and 2 are independent. Inside step 3, components can be built in parallel once Button and Dialog have proven the pattern.

---

## 15. Risks and open decisions

| Risk / decision | Position | Owner action |
|---|---|---|
| Adopting Base UI reverses the 3.2 "no third-party primitives" positioning | Recommended (§5). Behavior quality is the larger risk | Product sign-off |
| Safari `-webkit-backdrop-filter` with `var()` (unverified) | Avoided by compiling literal values per combination | Verify on Safari 26/27 remotely; simplify the compiler if fixed |
| Budgets in §3.6 are not measured | They are targets only | The perf lane calibrates them before GA |
| Enhanced refraction maintenance (map per shape × size class) | Limited to flagship chrome, opt-in | Cap shapes at capsule, fixed and concentric with 3 size classes |
| Downstream consumers of `aura-glass/services/*` or root AI exports | Unknown | Grep AuraOne consumers before deleting (SERVER-SERVICES-AI rec. 1) |
| Aeonik licensing | Removed by default | Legal review |
| Declared-backdrop contract adds author burden | Mitigated: `auto` defaults to scheme, library backdrops self-declare, and the dev audit flags gaps | Docs: a "Choosing a material" guide |
| Missing autopsies (qa-certification, history-hygiene, api-consistency, docs-readme, performance, visual-quality) | May refine §10 budgets, §12 migration scope and §13 tooling reuse | Re-review this proposal when they land |
