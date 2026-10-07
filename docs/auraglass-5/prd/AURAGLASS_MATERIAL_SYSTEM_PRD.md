# AuraGlass 5.0 PRD-2: Material System (tokens, material engine, tiers, motion, preferences, a11y rungs)

| Field | Value |
|---|---|
| PRD id | PRD-2 |
| Key | MAT (path key `mat`; task ids `MAT-NNN` in `tasks/MAT.json`; branches `next-mat/*`, `4x-mat/*`) |
| Status | Draft, 2026-10-06 |
| Binding contract | `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` `contract-v1.1` (frozen). Where this PRD and the contract disagree, the contract wins until this PRD is corrected (contract §1.4) |
| Sources (consolidated) | Archived `archive/v1-19-prd/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (DS, REQ-DS-01..44), `AURAGLASS_MATERIAL_ENGINE_PRD.md` (MAT, REQ-MAT-01..87 + 13a), `AURAGLASS_MOTION_PRD.md` (MOT, REQ-MOT-01..131), `AURAGLASS_ACCESSIBILITY_PRD.md` (A11Y, REQ-A11Y-01..50). Old → new REQ mapping: Appendix A |
| Evidence | `AURAGLASS_CURRENT_STATE_AUTOPSY.md`, `autopsy/{tokens-theme,material-engine,motion,accessibility,runtime-remote}.md`, `component-inventory.json`, `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`, `AURAGLASS_MISSING_CAPABILITY_MAP.md` |
| Decisions consumed | D-02, D-04, D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-16, D-18, D-19, D-20, D-24, D-25, D-26, D-27, D-28, D-31, D-32; errata E-01, E-03, E-10; contract-v1 decisions in §4.3 (self-layered CSS, type split, `info`, density values) and §4.5 (portal accessor and toast region in MAT) |
| Seams provided | S-01, S-02 (`ag-surface`), S-03, S-04 (content of `ag.tokens`, `ag.material`, `ag.a11y`, MAT half of `ag.compat`), S-05, S-06, S-10, S-11, S-12, S-13, S-20..S-26, MAT rows of S-47, `mat:build:tokens` (S-53) |
| Seams consumed | S-31 (`ComponentMeta` type only, from `src/contracts/components.ts`), S-33 (`hit-area`, `scroll-edge` parts), S-34 (`Portal`), S-35, S-37, S-38, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-48, S-49, S-50, S-51, S-52, S-53 |
| CI/CD | GitLab CI only, in `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036). MAT owns `ci/mat.gitlab-ci.yml` and `ci/mat/**` on both branches (row A20). No GitHub Actions |

---

## 1. Problem

AuraGlass 4.1.0 has no material, no token source and no preference model. Everything this stream owns exists today as several competing, partly fictional implementations:

1. **Tokens.** About eight token sources and four generators, four of which claim to be canonical, disagree on every core value (radius `md` 6/8/10/12/16 px, motion "normal" 200/220/250/300 ms, neutral text slate vs white). 571 of 621 generated `--aura-*` variables are dead; 153–298 referenced variables are undefined, which silently drops whole `backdrop-filter` declarations. No `@layer`, no OKLCH, no `light-dark()`, 200 `!important` in `src/styles/**` (TOKENS-THEME-01..16, TD-06, TD-08).
2. **Material.** 9–13 independent glass recipes (about 121 files emit `backdrop-filter`). `LiquidGlassMaterial` computes adaptive tint and then overwrites it with `rgba(255,255,255,0.018)`. Typical fill is about 2% white; 266/342 sampled text runs fail WCAG on black. Refraction refracts a hard-coded gradient, Houdini worklets never register, about 15 optical props are no-ops, tiers change nothing, nested glass samples a near-transparent parent (MATERIAL-ENGINE-01..12, PERFORMANCE-03/04).
3. **Motion.** 84 reduced-motion sites leave content at `opacity: 0`; the OS preference is ignored by default; `motionPolicy: "always-safe"` overrides it; 43 `repeat: Infinity` loops, 95–102 CSS infinite animations, animated `filter: blur()`, hover/tap scale bumps, an underdamped default spring, and framer-motion imported by 83 files despite being an optional peer (MOTION-01..09).
4. **Preferences and accessibility.** `ContrastGuard` always passes; `prefers-contrast: high` never matches; reduced transparency is a 14-selector allow-list that misses inline glass; forced colours keep live backdrop filters (modal 10, showcase 12); there are ≥10 preference detectors, 6 focus traps, 6 announcers and multiple portals with document-level Escape (ACCESSIBILITY-01..18).

5.0 needs one source, one compiler, one material, one motion language and one preference store, with OS signals as floors and every guarantee proven by a test that fails when the behaviour is reverted.

## 2. Evidence from the current codebase

All paths are at HEAD `15b6de6f7` (on `next` they live under `legacy/` after C0-10; on `release/4.x` at their original path). Only CONFIRMED findings, or the confirmed part of PARTIAL findings, are used.

| Area | Evidence | Finding |
|---|---|---|
| Token sources | `tokens/personas/default.json` + `scripts/build-tokens.js:46`; `src/tokens/glass.ts:4` ("SINGLE SOURCE OF TRUTH", 1,645 lines); `src/tokens/designConstants.ts:18,190`; `src/tokens/generated.ts:60,180`; `scripts/generate-glass-css-simple.js:7`; `src/theme/designMatrix.ts`; `src/theme/createGlassTheme.ts:81,114,128`; `src/styles/{tokens,variables,design-tokens}.css` | TOKENS-THEME-01/-04/-05/-06 |
| Dead/undefined vars | `--glass-opacity-24/32/52/72` undefined (`GlassTransitions.tsx:410,867,869`); 28 private `--ag-*` names already used in `src/components/marketing/**`, `GlassTabBar.module.css`, `navigation/styled.tsx` | TOKENS-THEME-03/-10, TD-08 |
| Types ≠ runtime | `getPersona`/`getPersonaModeTokens` declared in `dist/tokens/generated.d.ts:1231-1232`, not exported | TOKENS-THEME-08 |
| Mode hooks | `data-theme`, `data-aura-theme`, `data-persona`, `.glass-on-light`, `.dark`; `prefers-contrast: high` in 5 CSS files and 5 TS `matchMedia` sites; invalid nested `forced-colors: active;` at `src/styles/theme-transitions.css:52-54` | TOKENS-THEME-11, ACCESSIBILITY-04 |
| Recipes | R1 `glass.ts:960-1038`; R3 `:1559-1626` (32 px for every elevation); R4 `LiquidGlassMaterial.tsx:531-540`; R5/R6 two `createGlassStyle`; R9 `glass.generated.css:1006-1012` (`[class*="glass-"]{background:rgba(0,0,0,.85)!important}`); R11 Houdini `HoudiniGlassProvider.tsx:517-521`; R13 26 component CSS files + 11 inline `backdropFilter` | MATERIAL-ENGINE-01..10 |
| Runtime | Fill ≈ `rgba(255,255,255,0.02)`; white/black luminance delta median 0.881; glass-modal 12 fps, SaaS shell 21–23 fps vs 60 on simple stories; 12–29 visible filters, nesting depth 4, max blur 40 px (`autopsy/runtime-remote.md:21,65,125-145`) | MATERIAL-ENGINE-06, PERFORMANCE-04 |
| Motion | `initial={{opacity:0}}` + `animate={reduced ? {} : …}` in 35 files; `MotionPreferenceContext` default `false`, provider never mounted; `useGalileoStateSpring` frozen `useState` (cookie banners invisible but clickable); 150 rAF calls in 78 files, 0 pause offscreen | MOTION-01..08 |
| A11y | `ContrastGuard` always passes; 109 `focus:outline-none`; `GlassSlider` has no keys; `contrast more` changes 0.000% of pixels on 12/12 stories | ACCESSIBILITY-01..18 |
| Keep list | `src/theme/color.ts` (contrast maths), `createGlassTheme` call shape (`:13-15,62-70`), `LIQUID_GLASS.system` vocabulary, the a11y media policy `glass.css:4022-4123`, scroll-edge/concentric primitives `glass.css:4425-4486`, the build-pipeline shape of `build-tokens.js:95-114` | autopsy §3 |

C0 keeps `src/theme/{color,materials,createGlassTheme,createBrandGlassTheme}.ts` and `tokens/**` in place on `next`, owned by MAT (contract §3.1a). Everything else above is legacy that PLAT deletes.

## 3. Desired end state

At 5.0.0 GA, on one SHA of `next`:

1. **One source, one compiler.** `tokens/**/*.tokens.json` (DTCG) is the only place a design value is authored. `npm run tokens:build` (Style Dictionary `4.4.0`) writes every `TOKEN_OUTPUTS` path deterministically, plus the solved contrast floors.
2. **One namespace.** Every emitted `--ag-*` is in `PUBLIC_CSS_VARS` or `MOTION_CSS_VARS`; everything else is `--_ag-*`. 0 dead, 0 undefined variables.
3. **One recipe.** Every pixel of glass comes from `src/material/css/**` under `@layer ag.material`, keyed on `.ag-surface` and `data-ag-*`. The CI metric `independent-glass-recipes` reports **1**. `Surface` and `materialProps()` emit no style.
4. **Readable by construction.** Opacity floors are solved over white, black and busy composites; the user dial can only raise alpha; OS signals are floors (D-11) that no app or user setting can lower.
5. **Four tiers, no auto-downgrade.** `lightweight | standard | enhanced` in the DOM; `cinematic` only in `@auraglass/labs`. Engine and tier are set pre-paint by `AuraGlassScript`.
6. **One motion language.** CSS-first, light response not scale, springs compiled to `linear()`, no JS runtime in core except the shared frame ticker, pointer light and View Transitions; loops only with `allowContinuous`; `motion@^12` only behind `aura-glass/motion`.
7. **One preference store, one provider, one portal root, one LayerStack, one announcer, one focus ring.**
8. **Every claim is an artifact.** Contrast matrix, rendered-pixel contrast, motion report and manual SR records are GitLab job artifacts (D-32), never committed.

## 4. Architecture

### 4.1 Pipeline

```
tokens/{ref,sys,material,modes,presets,contrast,legacy}/**/*.tokens.json   (DTCG; MAT)
  └─ scripts/tokens/build.mjs  (Style Dictionary 4.4.0; transforms glass-material, motion-spring, contrast-solve)
       ├─ dist/tokens.css                       @layer ag.tokens   (git-ignored)
       ├─ dist/tokens/manifest.json             S-11 TokenManifest (git-ignored)
       ├─ dist/compat/tokens.css                @layer ag.compat   (git-ignored)
       ├─ dist/contrast-matrix.json             per-cell floorAlpha/minRatio (git-ignored, L4 artifact)
       ├─ src/tokens/index.ts                   S-10 `tokens` (committed generated)
       ├─ src/motion/tokens.generated.ts        S-12 values + spring physics (committed generated)
       └─ src/material/css/generated/{ladders,floors}.css   (committed generated)
src/material/**  → Surface / materialProps → class + data-ag-* only → @layer ag.material
src/motion/**    → motion.css, view-transition.css, loading.css (ag.material); motion-modes.css (ag.a11y); ticker, pointer light, startMorph
src/a11y/css/**  → rungs.css, focus.css, targets.css (ag.a11y)
src/theme/**     → preference store, AuraGlassProvider, AuraGlassScript, LayerStack, announcer, portal root, presets, createGlassTheme/createBrandTheme, GlassPreferencesPanel
<html data-ag-engine data-ag-tier data-ag-scheme data-ag-contrast data-ag-transparency data-ag-motion data-ag-density data-ag-continuous>  ← AuraGlassScript pre-paint
```

PLAT assembles `dist/styles.css`, `dist/material.css` and `dist/tailwind.css` from `fragments/css/*`; MAT declares its source sheets in `fragments/css/mat.ts`. Every MAT source `.css` file is self-layered (starts with `LAYER_ORDER_STATEMENT`, one `@layer` block), so Storybook and browser specs work without PLAT's assembly (contract §4.3).

### 4.2 Concept chain (one mechanism per stage)

| Stage | Input | Mechanism | Module |
|---|---|---|---|
| Environment | `data-ag-backdrop` on any ancestor | inherited `--_ag-env-*` per `[data-ag-backdrop]` block | `src/material/css/material.css` |
| Layer | `data-ag-layer` | chrome/overlay/transient = glass; content = content material; z from `--ag-z-*` | same |
| Material | `data-ag-variant`, `-thickness`, `-content`, nesting | compiled ladders; descendant collapse | `generated/ladders.css`, `material.css` |
| Lighting | `--ag-light-angle`, `--ag-specular`, `data-ag-interactive`, `data-ag-prominent` | `::after` rim + sheen | `material.css` |
| Motion | Base UI state attributes, `data-ag-motion`, `data-ag-continuous` | `--ag-specular`, `--_ag-press`, `--_ag-optics` transitions | `src/motion/css/*.css` |
| Tier | `data-ag-tier`, `data-ag-engine`, `data-ag-refraction`, `svg[data-ag-lens-ready]` | tier-gated blocks; lens `url(#ag-lens-*)` | `material.css`, `lens.css` |
| Contrast floor | solved table | `--_ag-tint-floor` per transparency × thickness × backdrop | `generated/floors.css` |
| Fallback / floors | media queries, `@supports`, `data-ag-transparency`, `data-ag-contrast` | rungs on `[data-ag-surface]` | `src/a11y/css/rungs.css` |

### 4.3 Surface layer model (one host, two pseudo-elements, no extra DOM)

| # | Layer | Where | Rule |
|---|---|---|---|
| 1 | Backdrop optics | `::before`, `z-index:-1` | `backdrop-filter: blur(var(--_ag-blur)) saturate(var(--_ag-saturation)) brightness(var(--_ag-brightness))` + literal `-webkit-backdrop-filter` per ladder cell; opacity `var(--_ag-optics)` |
| 2 | Grain | `::before` background image `ag-grain-128.avif` at `--_ag-grain-opacity` | never `mix-blend-mode` on the host |
| 3 | Tint/fill | host `background: var(--_ag-fill)` | beneath `::before` in the host's isolated context |
| 4 | Rim, edge light, specular | `::after`, `pointer-events:none` | masked gradient band; sheen oriented by `--ag-light-angle` |
| 5 | Inner depth / press | `::after` inset shadow; press opacity `var(--_ag-press)` | |
| 6 | Outer shadow | host `box-shadow: var(--_ag-shadow)` | layer × thickness (D-07) |

Host baseline: `position:relative; isolation:isolate; border-radius:var(--ag-surface-radius); color:var(--ag-on-surface)`. Never on a default surface: `transform`, `will-change`, `contain: paint`, `transition: all`, host `opacity < 1`, host `filter`.

### 4.4 Tiers

| Tier | Renders | Gate (pre-paint, CSS only) | Design budget per viewport |
|---|---|---|---|
| lightweight | fallback fill alpha ≥ 0.85 + rim + shadow; `::before` `backdrop-filter: none` | `@supports not` backdrop-filter, transparency `solid`, forced colours, `[data-ag-tier=lightweight]` | unlimited |
| standard (default, SSR) | layers 1–6 | default; no attribute required | ≤ 6 blurred surfaces at fine pointer, ≤ 3 at coarse; blur ≤ 32 px; full-viewport blur only on `scrim` ≤ 12 px |
| enhanced (preview) | standard + SVG edge refraction | `:root[data-ag-engine=chromium]:has(svg[data-ag-lens-ready]) .ag-surface[data-ag-refraction][data-ag-layer=chrome]`, transparency `glass`, motion ≠ `none` | ≤ 2 refracting surfaces, each ≤ 25% of viewport |
| cinematic | WebGL over library-owned pixels | `@auraglass/labs` only (SURF-owned package) | 1 WebGL context per page |

### 4.5 Preference resolution (D-11)

```
transparency = max(osFloor, capFloor, app, user)    on glass(0) < tinted(1) < solid(2)
  osFloor  = forced-colors:active → 2; prefers-contrast:more → 1; prefers-reduced-transparency:reduce → 1; else 0
  capFloor = !CSS.supports('(backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))') → 2; else 0
  user     = persisted transparency; glassOpacity ≥ 0.7 → at least 1
contrast = max(prefers-contrast:more, app, user)    forced colours ⇒ 'more' and 'solid', absolute
motion   = min(OS ceiling, app, user)               prefers-reduced-motion:reduce ⇒ at most 'calm'
allowContinuous(resolved) = user/app allowContinuous && motion === 'full'
```

Two enforcement paths, both required: the JS path writes the effective values to `<html>` (pre-paint and on change); the CSS path in `@layer ag.a11y` re-applies every OS floor from media queries so that floors hold with JavaScript off and with a hard-coded `data-ag-transparency="glass"`.

### 4.6 Provider, portal root and layer stack

The outermost `AuraGlassProvider` portals `PORTAL_ROOT_MARKUP` (S-23) once per document through the kept `Portal` primitive (S-34). Nested providers reuse it and only scope `data-ag-*` on their own wrapper. `LayerStack` (S-25) is the only Escape, `inert` and scroll-lock dispatcher in the library: one `keydown` listener per document, dispatched to the topmost entry. The provider renders only the toast **region**; the application or a block mounts CMP's `Toast.Provider`, whose viewport portals into `usePortalContainer('toast')` (contract §4.5). MAT imports nothing from CMP except `Portal`.

---

## 5. Exact implementation requirements

Each REQ names its proof in §12. "Surface" means any element produced by `Surface` or `materialProps()`, that is, any element carrying `data-ag-surface`.

### 5.1 Tokens and compiler

- **REQ-MAT-01 Source.** All design values live in `tokens/**/*.tokens.json` (DTCG: `$value`, `$type`, `$description`, `$extensions`). `tokens/$schema.json` defines the standard types plus `glass-material` and `motion-spring` composites and the extensions `ag.public` (boolean), `ag.tier` (`ref|sys|material|comp`), `ag.since`, `ag.deprecated` (`{since, replacement}`), `ag.usage` (`"large-only"`). Layout: `ref/`, `sys/{color,type,space,shape,motion,interaction,environment,elevation,breakpoint}.tokens.json`, `material/material.tokens.json`, `modes/{scheme,contrast,transparency,density}.tokens.json`, `presets/*.tokens.json`, `contrast/busy-reference.json`, `legacy/4x-rendered.tokens.json`, `comp/` (empty until a component owner requests a row through a MAT task).
- **REQ-MAT-02 Compiler guards.** `scripts/tokens/build.mjs` exits 1, naming the token, on: schema violation; unresolved alias or cycle; a `material.*` token aliasing anything but `sys.*`; a component-facing output referencing `ref.*`; a preset or `createGlassTheme` output defining any `material.*` or `--_ag-*` key; any blur token > 32 px; any cubic-bezier with a y control point outside [0, 1]; any spring with ζ < 0.8, ζ > 1.0 or response outside 120–800 ms. Schema validation is implemented in `scripts/tokens/validate.mjs` with no new dependency (the frozen devDependency set has no `ajv`, contract §4.12).
- **REQ-MAT-03 Outputs and determinism.** `npm run tokens:build` (S-52) replaces the C0-13 seed without changing its CLI and writes exactly `TOKEN_OUTPUTS` (S-10/S-11) plus `dist/contrast-matrix.json`. Two consecutive runs are byte-identical. The committed generated files (`src/tokens/index.ts`, `src/motion/tokens.generated.ts`, `src/material/css/generated/{ladders,floors}.css`) change only in MAT PRs; job `mat:test:drift` fails if a fresh compile differs from the committed copy. Style Dictionary is `4.4.0`, devDependency only, never imported from `dist/**`.
- **REQ-MAT-04 Namespace and manifest.** Every `--ag-*` defined by any MAT output is in `PUBLIC_CSS_VARS` or `MOTION_CSS_VARS`, and every name in those lists is defined (S-03). All other variables are `--_ag-*` (MAT) or `--_ag-<component>-*` (component owners). `dist/tokens/manifest.json` satisfies `TokenManifest` (S-11): one entry per public variable with `tier`, `type`, `modes` and resolved default `value`; `ref` never appears. Tier rule (`scripts/tokens/gates/tier-skip.mjs`): no `src/**` file except generated outputs reads a `ref`-derived variable; `material` reads only `sys`; `comp` reads `sys` or `material`. Removing or renaming a public variable needs a `css-var` deprecation entry (S-38) and a contract PR.
- **REQ-MAT-05 Colour.** Every colour is authored in OKLCH. `ref.color.slate.1..12` and each accent ramp have 12 steps with monotone L (light 0.99 → 0.18, ΔL ≥ 0.03). Every `sys.color.*` leaf (`canvas, on-surface, on-surface-muted, accent, on-accent, border, focus-inner, focus-outer, specular, danger, warning, success, info` → `--ag-color-*`) is emitted as `light-dark(<light>, <dark>)`; scheme blocks set `color-scheme`. Dark `on-surface` has L ≥ 0.92 and C ≤ 0.02 (navy-text fix, TOKENS-THEME-05). sRGB fallbacks appear only inside `@supports not (color: oklch(0 0 0))` and `@supports not (color: light-dark(#000, #fff))`. Material tint is derived, never authored per preset: `--_ag-fill: oklch(from var(--ag-color-canvas) l c h / var(--_ag-alpha))`.
- **REQ-MAT-06 Type, space, density, shape.** Type roles exactly `display, title-1, title-2, title-3, body, callout, caption, label, mono`, each emitted as `--ag-type-<role>-{size,leading,weight}` (tracking is private `--_ag-type-<role>-tracking`); `body` is `clamp(15px, 0.9rem + 0.2vw, 17px)`; no role below 12 px; leading unitless; on-glass weight delta is private `--_ag-type-on-glass-weight-delta: 50`; fonts `--ag-font-sans`/`--ag-font-mono` are the system stacks (D-31). Space: `--ag-space-<n>` for n ∈ {0,1,2,3,4,5,6,8,10,12,16} = `calc(n × 4px × var(--ag-density))`; `--ag-density` is 0.875 / 1 / 1.125 for `compact | regular | spacious`; `--ag-target-min` 24 px and `--ag-target-coarse` 44 px are never density-scaled. Radius ladder `--ag-radius-{xs,sm,md,lg,xl,full}` = 6/10/14/20/28/9999 px; `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))`, non-negative at every density.
- **REQ-MAT-07 Material, elevation, environment.** `material/material.tokens.json` is the sole `MaterialSpec`: variants `regular | clear | identity` (D-06) × thickness `thin | regular | thick` (D-07), plus `content-raised | content-sunken` (D-08); no `intent` or `elevation` key. Initial values: blur 12/20/32 px, saturation 1.6, brightness 1.0–1.08 light / 0.9–1.0 dark, grain 0.02–0.04, rim 1/1/1.5 px, `scrim.clearOverBright` 0.35, `scrim.modal`, fallback fill alpha ≥ 0.85, refraction bezel 12/16/24 px. Shadows `--ag-shadow-{thin,regular,thick}` (ambient + key, per scheme) derive from layer × thickness into private `--_ag-shadow`. z-order `--ag-z-{content 0, chrome 100, overlay 1000, transient 1100, toast 1200}`. Environment: `--ag-light-angle` 300deg, `--ag-specular` 0.5, `--ag-glass-opacity` 0, `--ag-scrim-clear` 0.35, `--ag-scrim-media` `oklch(0% 0 0 / 0.72)`.
- **REQ-MAT-08 Motion tokens and springs.** `tokens/sys/motion.tokens.json` holds exactly the S-12 values: `DURATIONS_MS` (enter/exit 90/60, 120/80, 200/140, 320/220, 450/320), `AMBIENT_DURATION_MS` 40,000 (no exit variant), `EASES`, `SPRINGS` (snappy ζ 1.0 / 200 ms, smooth 0.9 / 350 ms, fluid 0.82 / 450 ms), emitted as exactly `MOTION_CSS_VARS`. Values never vary by motion mode. The `motion-spring` transform: ω₀ = 2π / r; sample x'' + 2ζω₀x' + ω₀²x = ω₀² at 1 ms; settle T = earliest t with |1 − x| < 0.001 and |x'| < 0.001·ω₀ for 50 ms; Ramer–Douglas–Peucker tolerance 0.002, ≤ 40 stops, 4-decimal values, 1-decimal percentages, ≤ 600 bytes; emits `--ag-spring-<name>` (`linear()`) and `--ag-spring-<name>-duration` (T rounded up to 10 ms); `@supports not (transition-timing-function: linear(0, 1))` maps snappy → `--ag-ease-standard`, smooth and fluid → `--ag-ease-emphasized-decelerate`. `src/motion/tokens.generated.ts` exports `motionTokens` with `spring.<name>.{zeta,response,duration,linear,stiffness,damping}`, stiffness = (2π / (r/1000))², damping = 2ζ√stiffness (smooth = 322.3 / 32.31).
- **REQ-MAT-09 Interaction states.** Light response, never scale. Public: `--ag-state-hover-specular` (+0.15), `--ag-state-press-glow` (0.25), `--ag-state-disabled-alpha` (0.45). Private: `--_ag-state-{hover-floor (+0.02), press-floor (+0.04), selected-tint (accent 0.16), loading-alpha (0.7), dragging-lift, dragging-specular, drop-target-rim (2 px accent), drop-target-fill (+0.06)}`. Selector contract: hover `@media (hover:hover) { [data-ag-interactive]:hover }`; press `[data-ag-interactive]:active, [data-pressed]`; selected `[data-selected], [aria-selected=true], [data-state=on], [aria-pressed=true]`; focus `:focus-visible`; disabled `[data-disabled], :disabled, [aria-disabled=true]`; loading `[data-loading], [aria-busy=true]`; dragging `[data-dragging]`; drop target `[data-drop-target]`. Every state has a `contrast=more` value (rim/outline forms, no specular) and a forced-colours value (`Highlight`, `HighlightText`, `GrayText`). Selected and drop-target add a rim/weight cue, not only tint.
- **REQ-MAT-10 Contrast solver.** `contrast-solve` evaluates preset × scheme {light, dark} × contrast {standard, more} × transparency {glass, tinted, solid} × variant {regular, clear+scrim, identity, content-raised, content-sunken} × thickness {thin, regular, thick} × declared backdrop {light, dark, media} (4 presets ⇒ 2,160 cells), each over three composites: `#ffffff`, `#000000` and busy (minimum over the 9 samples `#777777 #ff3b30 #34c759 #0a84ff #ffcc00 #af52de #ff9500 #5ac8fa #8e8e93` in `tokens/contrast/busy-reference.json`). Pairs: `on-surface` ≥ 4.5:1; `on-surface-muted` ≥ 4.5:1, or ≥ 3:1 when the token is `ag.usage: "large-only"`; non-text (border, icon, focus bands, control boundary) ≥ 3:1; disabled label ≥ 3:1; every text pair ≥ 7:1 under `contrast=more`. Blur contributes nothing. WCAG 2.2 relative luminance after OKLCH → sRGB gamut mapping (`src/theme/color.ts`); APCA Lc is emitted as advisory only. Search: minimum alpha in 0.005 steps; no passing alpha ≤ 1 ⇒ exit 1 naming cell and pair. `generated/floors.css` sets `--_ag-tint-floor` per `[transparency][thickness][backdrop]` (plus the `contrast=more` row) to the maximum solved floor over presets, schemes and variants. No floor is hand-written.
- **REQ-MAT-11 Independent recompute.** `tests/a11y/contrast-matrix.test.ts` parses built `dist/tokens.css` and `generated/floors.css`, recomputes every cell with `src/theme/color.ts` (no second WCAG implementation), and asserts equality with the solver's `minRatio` within 0.01 and every REQ-MAT-10 threshold. It also checks focus bands: ratio(inner, outer) ≥ 3, and for 4,096 sampled sRGB backdrops (16 levels per channel) max(ratio(inner, bg), ratio(outer, bg)) ≥ 3.
- **REQ-MAT-12 Modes.** For scheme, contrast, transparency and density the compiler emits an attribute block `[data-ag-<axis>=<value>]` and a media mirror applied only when the attribute is absent (`:root:not([data-ag-<axis>])`), in `@layer ag.tokens`. OS floors are re-emitted in `@layer ag.a11y` (REQ-MAT-54). `contrast=more` selects at least the tinted floor row. `prefers-contrast: high` occurs 0 times in any MAT output or source; `prefers-contrast: less` and `custom` map to `standard`. With zero JS and zero attributes a page renders correctly under each of light, dark, contrast more, reduced transparency, forced colours and reduced motion: it differs from the attribute-driven baseline for the same values by ≤ 0.1% of pixels (`VISUAL_TOLERANCE`).
- **REQ-MAT-13 No 4.x hooks.** No MAT CSS outside `@layer ag.compat` selects `data-theme`, `data-aura-theme`, `data-aura-mode`, `data-persona`, `data-bg`, `.glass-on-light`, `.glass-on-dark`, `.dark`, `.light`, `[class*="glass-"]`, `.liquid-glass-*` or `.optimized-glass-*`. `dist/compat/tokens.css` maps `[data-theme=dark]` and `.dark` to the dark scheme values for 5.x only.
- **REQ-MAT-14 Presets.** Exactly 4 `ThemePreset`s, `aura` (default), `graphite`, `daylight`, `midnight`, each `{ id, name, canvas: { light, dark }, neutralHue, accent, radiusScale?: 0.75 | 1 | 1.25 }`, compiled into `dist/tokens.css` as scoped blocks that override only `ref.color.*` and `sys.color.{canvas,accent,on-accent,border}` (`radiusScale` multiplies xs..xl only). Each passes the full matrix. The scope attribute is `data-ag-theme="<id>"`, which is not yet in `AG_ATTRIBUTES` (OI-MAT-01): MAT opens the additive contract PR on day 0. Until it merges, the provider's `preset` prop applies a preset by rendering its `cssText` in the provider's single `<style>` element, scoped to that provider's registered `[data-ag-root]` element, so no unregistered attribute reaches `dist/`. Persona narrative metadata is not in any runtime export.
- **REQ-MAT-15 `createGlassTheme`.** Keeps the 4.x option names `id`, `name`, `brandColor`, `accentColor`, `mode`, `density`, `motionPolicy` and adds `preset`, `neutralHue`, `radiusScale`, `contrast`. Mapping: `mode: "system"` follows `prefers-color-scheme` (fixes `isLight = mode === "light"`); `"high-contrast"` → `contrast: "more"`; `density: "comfortable"` → `regular`; `motionPolicy` `reduced` → `calm`, `expressive` → `full` + `allowContinuous: true`, `system` → OS, `none` → `none`. Returns `{ id, cssText, vars, contrast, tokens }`: `cssText` is scoped to the theme attribute (no `:root`); every `vars` key is a public variable with ≥ 1 consumer. Pure: no `"use client"`, no DOM access, importable from a Server Component. Accepts hex, `rgb()`, `hsl()` and `oklch()`. A brand input failing `on-accent` gets the minimum lightness adjustment, listed in `contrast.adjusted[]`, with a development warning.
- **REQ-MAT-16 `createBrandTheme`.** `createBrandTheme(brand: string | Oklch, opts?: { accentShift?: number; preset?: PresetId })` derives a 12-step accent ramp in CSS with relative colour syntax (`oklch(from <brand> calc(l + Δ) c h)`) plus precomputed literals for engines without relative colour, and computes the same ramp in TS for the report. Any text step that cannot reach 4.5:1 is moved by the minimum L and listed in `contrast.adjusted[]`. 20 fixture brands spanning hue 0–360 and L 0.3–0.9 yield 100% passing text pairs. `createBrandGlassTheme` exists only in `src/compat/mat/` (warns once through `warnDeprecated`).
- **REQ-MAT-17 Variable gates.** `scripts/tokens/gates/undefined-vars.mjs`: for every CSS entry MAT emits or declares in `fragments/css/mat.ts`, every `var(--ag-*)`/`var(--_ag-*)` without fallback is defined in that entry's import closure, and no `src/**/*.{ts,tsx}` string or `style` object names an `--ag-*` absent from the manifest; threshold 0. `scripts/tokens/gates/dead-vars.mjs`: every public variable has ≥ 1 reader in built library CSS/TS or `ag.public: true` (read-outs); every `--_ag-*` has ≥ 1 reader; threshold 0. Both run over whatever streams have merged; findings on another stream's paths are reported `pre-existing` for that stream (§2.3 of the contract).
- **REQ-MAT-18 Raw-value rule and ratchet.** One rule, `auraglass/no-raw-design-values` (ESLint, `lint/rules/mat/no-raw-design-values.cjs`) plus its stylelint half (`stylelint-plugin-auraglass/no-raw-design-values`), over all `src/**/*.{ts,tsx,css}` with no directory exclusions. It forbids colour literals (hex, `rgb[a](`, `hsl[a](`, literal `oklch(`), `blur(<n>px)`, `border-radius` px, `box-shadow` literals, ms/s durations, `cubic-bezier(`, literal `linear(` curves, and numeric `duration|delay|stiffness|damping|mass|bounce|visualDuration` keys outside `src/motion/**`. Exempt: `tokens/**`, the generated outputs, `src/theme/color.ts` conversion constants. `scripts/tokens/gates/literals.mjs` (L1) counts per file and category against `fragments/literals-baseline/<stream>.json` (`LiteralsBaseline`); each stream refreshes its own file with `--update --stream <s>` in its own PR, downward only; any per-file increase fails. Severity is `error` on MAT globs and `warn` on other streams' globs until they opt in via `lint/rules/<stream>/_strict.cjs`; every baseline is 0 by 5.0.0-beta.1 (G-05).
- **REQ-MAT-19 Layering.** Every MAT source `.css` file and every MAT-emitted file starts with `LAYER_ORDER_STATEMENT` and puts all rules in exactly one block of its `fragments/css/mat.ts` layer: `ag.tokens` (`dist/tokens.css`), `ag.material` (`src/material/css/**`, `src/motion/css/{motion,view-transition,loading}.css`), `ag.a11y` (`src/a11y/css/**`, `src/motion/css/motion-modes.css`), `ag.compat` (`dist/compat/tokens.css`). Only `@property` rules are unlayered. 0 `!important`. `:root` appears only in `ag.tokens` and `ag.compat`. `ag.a11y` selectors have specificity ≤ (0,2,0), except forced-colours pseudo-element selectors at (0,1,1).
- **REQ-MAT-20 shadcn interchange.** `dist/tokens.css` reads `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius` with defaults when the app declares shadcn variables authoritative, and otherwise emits the same eight names from `--ag-*` under `:where(:root:not([data-ag-shadcn-source]))`. The compiler proves no cycle in either direction. `data-ag-shadcn-source` is part of the OI-MAT-01 contract PR; until it merges only the AuraGlass-authoritative direction ships. The Tailwind bridge and the registry `cssVars` are PLAT's, generated from the S-11 manifest.
- **REQ-MAT-21 Compat tokens and legacy freeze.** Before any 4.x value changes, the rendered 4.1.0 values (`glass.ts:997,1001,1030`, the blur ternary, `src/styles/tokens.css` primitives) are frozen into `tokens/legacy/4x-rendered.tokens.json`; a `legacy` platform regenerates them byte-equal (`tests/tokens/legacy-freeze.test.ts`). `tokens/compat-alias-map.json` maps every `--glass-*` name with ≥ 1 reader in the 4.x snapshot or the frozen consumer fixture (about 620) to an `--ag-*` successor or a frozen legacy value (including `--glass-motion-default` → `--ag-duration-small`). It generates `dist/compat/tokens.css` (`@layer ag.compat`, ≤ 8 KB gz, outside the `styles.css` budget, D-18) and the `cssVars` field of `fragments/codemods/mat.ts` (S-39, `css-vars`). `material.css` neither reads nor writes `--glass-*`.
- **REQ-MAT-22 Entry parity and API reports.** The value exports of `./material`, `./theme`, `./tokens` and `./motion` equal their `ENTRIES` lists exactly; `src/root/mat.ts` re-exports exactly `ROOT_EXPORTS.mat`, adding each name only once it is real (contract §5.2 rule 3). `./tokens` exports only `tokens` (one entry per public variable, value `var(<name>)`); `motionTokens`, the manifest and `MaterialSpec` data stay internal. MAT writes `etc/api/{material,theme,tokens,motion}.{api.md,exports.json}`, `etc/api/material.css-api.json` (public variables and attributes), `etc/api/root.mat.api.md` and `etc/api/compat.mat.api.md` with `npm run api:update -- --entry <entry>` in its own PRs. Types declared in `.d.ts` equal runtime exports (fixes TOKENS-THEME-08).

### 5.2 Material engine (`src/material/**`)

- **REQ-MAT-23 `materialProps` and `resolveRole`.** `materialProps(role)` is the C0 seed's final implementation (contract §4.10): pure, no `window`/`document`/React/context; `data-ag-layer = role.layer ?? 'content'` always; `data-ag-variant = role.variant ?? 'regular'`, omitted only for `layer=content` with no explicit variant; `data-ag-content = role.content ?? 'content-raised'` only when `layer=content`; `data-ag-thickness`/`data-ag-shape` only when set; boolean attributes only when `true`; no `style` key. The internal `src/material/internal/resolveRole.ts` (not exported from `./material`) maps a library component's size class to thickness (`control→thin`, `bar→regular`, `panel→regular`, `sheet→thick`), emits private `data-ag-sizeclass` only when `refraction` is set (derived from thickness when no size class is passed) and private `data-ag-radius` for `fallbackRadius`. Components reach it only through `materialProps` and `Surface`; size class is never a public prop (D-07).
- **REQ-MAT-24 `Surface`.** Renders `<div>` or clones `render` (one DOM node); `className` joined with `cn` (S-37); consumer non-`data-ag-*` attributes win, role `data-ag-*` always win; `ref` is a prop (React 19); `as` is a type error. It emits **no** `style` unless the consumer passes one, which is passed through by reference. The deleted 4.x optical props (`caustics, chromatic, lighting, ior, tier, depth, tint, glowIntensity, glowColor, optimization, hardwareAcceleration, intensity, blur, parallax, adaptive, magnet, cursorHighlight`) are type errors; `refraction` keeps its boolean 5.0 meaning. In `src/compat/mat/` the 4.x primitives (`OptimizedGlass`, `LiquidGlassMaterial`, `GlassCore`/`GlassPrimitive`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassEffectGroup`, `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame`, `LiquidGlassLayerProvider`) are adapters over `Surface`/`SurfaceGroup`/`ScrollEdge`/`ConcentricFrame` that drop no-op props with one `warnDeprecated(id)` and map `elevation 0|1→thin, 2→regular, 3+→thick`, `variant="solid"` → a `data-ag-transparency="solid"` wrapper, `adaptive` → `data-ag-backdrop="auto"`, `intent="primary"` → `prominent`.
- **REQ-MAT-25 Server safety and tier hook.** `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` and `materialProps` have no hooks, context, effects or `"use client"` and render with `renderToString` in Node with no DOM globals and no provider. `useMaterialTier.ts` is the only `"use client"` material module: `useSyncExternalStore` over `<html data-ag-tier>`, server snapshot `'standard'`, unknown values → `'standard'`, never `'cinematic'`; one `MutationObserver` (`attributeFilter: ['data-ag-tier']`) created on first subscribe and disconnected at zero subscribers.
- **REQ-MAT-26 Structural components.** `SurfaceGroup` renders one `div[data-ag-group]` that is itself a chrome/regular/regular surface, emits private `data-ag-spacing` (default `2`) from which CSS sets the group gap (no inline style), and is the only owner of a backdrop filter among its direct `.ag-surface` children. `Environment` sets `data-ag-backdrop` to `backdrop` (`auto` + `image`/`video` ⇒ `media`) and, with `image`/`video`, renders a library-owned `aria-hidden` media layer (`<img decoding="async" alt="">` or `<video muted playsinline>`); it never samples pixels. `ScrollEdge` renders `<div aria-hidden="true" data-ag-part="scroll-edge" data-ag-edge data-ag-edge-style>` (`edgeStyle` default `soft`, E-01), a `mask-image` gradient with no `backdrop-filter`, height `clamp(16px, 4vh, 32px)`. `ConcentricFrame` emits private `data-ag-radius`/`data-ag-inset` from which CSS sets `--ag-radius-outer`/`--ag-inset` (no inline style, contract seed behaviour is replaced) and pads by `--ag-inset`; descendants with `data-ag-shape="concentric"` use `--ag-radius-inner`; `capsule` = 9999 px; outside a frame `concentric` falls back to `fallbackRadius` (default `md`).
- **REQ-MAT-27 Attribute discipline.** MAT code emits only attributes whose `AG_ATTRIBUTES` setter is `MAT` or `ANY` (S-01) and never a `BANNED_ATTRIBUTES` name. The engine reads but never writes `<html>` `data-ag-engine`, `data-ag-tier`, `data-ag-scheme`, `data-ag-contrast`, `data-ag-transparency`, `data-ag-motion`, `data-ag-density` (only `AuraGlassScript` and the provider write them). Subtree `data-ag-tier` and `data-ag-transparency` override `<html>` for that subtree. Material CSS never selects another stream's attributes.
- **REQ-MAT-28 Registered properties.** `src/material/css/properties.css` (hand-authored, checked against this list by test) registers exactly: `--ag-light-angle <angle>` inherits 300deg; `--ag-specular <number>` no-inherit 0.5; `--ag-glass-opacity <number>` inherits 0; and, all `inherits: false`, `--_ag-blur <length> 0px`, `--_ag-saturation 1`, `--_ag-brightness 1`, `--_ag-tint-floor 0.6`, `--_ag-dim 0`, `--_ag-surface-alpha 1`, `--_ag-refraction-scale 0`, `--_ag-rim-width <length> 1px`, `--_ag-grain-opacity 0.03`, `--_ag-optics 1`, `--_ag-press 0`. Every initial value is computationally independent (no `var(`); ≤ 16 registrations; `CSS.registerProperty` is never called at runtime. `.ag-surface::before, .ag-surface::after` set every private scalar and `--ag-specular` to `inherit`, so pseudo-elements see host values while nested surfaces do not inherit their parent's.
- **REQ-MAT-29 Read-outs and tint formula.** Every surface sets `--ag-surface-fill`, `--ag-surface-rim`, `--ag-surface-shadow`, `--ag-surface-radius`, `--ag-on-surface`, `--ag-on-surface-muted` to the resolved values for its variant × thickness × scheme × transparency × backdrop, so component CSS (and small-chrome glyph flipping) follows the declared backdrop through `--ag-on-surface`. Alpha: `--_ag-alpha: min(1, max(var(--_ag-tint-floor), calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity))))`; for `--ag-glass-opacity` ∈ {−1, 0, 0.3, 0.7, 1, 2} alpha ∈ [floor, 1] and non-decreasing.
- **REQ-MAT-30 Layer stack and host invariants.** Backdrop filter only on `::before`; host computed `backdrop-filter: none` in every tier and engine. Default surfaces compute `transform: none`, `will-change: auto`, `contain: none`, `opacity: 1`, `filter: none`, and no `transition-property` containing `all`, `backdrop-filter` or `filter`. `will-change: opacity, transform` appears only under `[data-ag-animating]`.
- **REQ-MAT-31 Nesting, groups, content, disabled, state.** A `.ag-surface` inside another without `data-ag-allow-nested` has `::before` `backdrop-filter: none` (both prefixes) and `--_ag-fill: var(--_ag-inner-fill)`; portaled overlays in `[data-ag-portal-root]` are not descendants and keep optics. `allowNested` keeps optics. Direct `.ag-surface` children of `[data-ag-group]` lose their backdrop filter but keep tint, rim, specular and shadow (a 5-control group = 1 visible backdrop filter). `layer=content` without explicit variant renders an opaque content material with rim, grain and shadow and no backdrop filter in any tier (D-08); `content-sunken` adds a 1 px inset top shade. Disabled surfaces dim via `--_ag-surface-alpha: var(--ag-state-disabled-alpha)` on fill and pseudo-layers; host `opacity` stays 1. `[data-ag-layer=overlay][data-open]` uses the overlay floor row; `[data-expanded]` raises the floor one thickness row; modal overlays get a `data-ag-layer="scrim"` sibling (rendered by the overlay owner) styled by MAT at `scrim.modal` alpha and blur ≤ 12 px; `data-ag-full-height` sheets resolve to `tinted`.
- **REQ-MAT-32 Optics.** Each optic maps to one `MaterialSpec` field and one CSS location; anything else is out of core:

| Optic | CSS rule | Tiers |
|---|---|---|
| Blur | `::before` `blur(var(--_ag-blur))` 12/20/32 px by thickness; group on group `::before`; scrim ≤ 12 px; never transitioned; nothing > 32 px reachable | standard, enhanced |
| Saturation, brightness | `saturate(var(--_ag-saturation))` (one value), `brightness(var(--_ag-brightness))` scheme-resolved; order `blur() saturate() brightness()`; `contrast=more` ⇒ saturation 1 | standard, enhanced |
| Tint | host `background: var(--_ag-fill)`; intent never tints the fill; one `prominent` surface per view mixes `--ag-color-accent` at ≤ 0.18 | all |
| Transparency | `--_ag-tint-floor` by `[data-ag-thickness]` × inherited backdrop × resolved transparency; `tinted` raises the row and disables refraction | all |
| Grain | `::before` `url(ag-grain-128.avif)` (≤ 4 KB), 128 px, `--_ag-grain-opacity`; off under `contrast=more`, forced colours and `solid`; ≤ 0.02 in lightweight | all |
| Rim / edge light | `::after` masked band (`mask-composite: exclude`, padding `--_ag-rim-width`), `conic-gradient(from var(--ag-light-angle), …)`; renders in all 3 engines | all |
| Fresnel approximation | second `::after` layer brightening the edge facing `--ag-light-angle` within 8 px; lit inner 4 px band ≥ 12 levels brighter than the opposite band over `flat-black` (provisional, calibrated at alpha.1) | all |
| Specular | `::after` sheen `linear-gradient(var(--ag-light-angle), rgb(from var(--ag-color-specular) r g b / calc(var(--ag-specular) * 0.35)), transparent 40%)`; `contrast=more` ⇒ `--ag-specular: 0` | all but forced colours |
| Refraction | enhanced only (REQ-MAT-36) | enhanced |
| Dispersion | not rendered by core | cinematic |
| Shadow | host `box-shadow: var(--_ag-shadow)` + `::after` inset; overlays use the thick key; none in forced colours | all |
| Scrim | `clear` over `light`/`media` sets `--_ag-dim: 0.35` inside `::before` | all |
| `identity` | no optics, transparent fill, no rim or shadow, keeps `data-ag-surface` | all |

- **REQ-MAT-33 `clear` fail-safe (D-12).** `variant=clear` with no ancestor declaring `data-ag-backdrop` ∈ {light, dark, media} renders the `regular` cell (selector `.ag-surface[data-ag-variant=clear]:not(:is([data-ag-backdrop=light],[data-ag-backdrop=dark],[data-ag-backdrop=media]) *)`) and warns once per element in development: `[aura-glass] variant="clear" requires a declared backdrop; rendering as "regular"`. `auto` never satisfies `clear`; the dev check walks to the nearest `[data-ag-backdrop]` so a nearer `auto` inside a `light` section also warns.
- **REQ-MAT-34 WebKit literal ladder.** `generated/ladders.css` has, for each blurred `[variant][thickness][tier]` cell, a literal `-webkit-backdrop-filter: blur(Npx) saturate(N) brightness(N)` with no `var()` (about 18 rules). If the L8 WebKit probe proves `var()` works in the prefixed property, the literals are removed as C-I.
- **REQ-MAT-35 Tiers, no auto-downgrade.** With no `data-ag-tier` every surface renders standard; `renderToString(<Surface/>)` output is identical in every tier. Lightweight applies under any REQ §4.4 condition, renders fill alpha ≥ 0.85 following the scheme (never a black slab), rim, shadow, grain ≤ 0.02, and `::before` `backdrop-filter: none`. No production code writes `data-ag-tier` or changes optics in response to FPS, intersection, surface count or mount order (D-09); `scripts/mat/verify-material-runtime.mjs` fails on `IntersectionObserver`, `requestAnimationFrame`, `WebGL`, `<canvas>`, `three` or a `data-ag-tier` write in `src/material/**` outside `dev/`. With no script, enhanced never applies and media mirrors still drive the rungs.
- **REQ-MAT-36 Enhanced lens (preview, D-05).** `scripts/tokens/lens-maps.mjs` deterministically generates 9 maps `src/material/assets/lens/ag-lens-<fixed|capsule|concentric>-<control|bar|panel>.png` (committed, ≤ 3 KB each, no noise/turbulence). `src/material/lens/LensDefs.tsx` (internal, server-safe) renders one `<svg data-ag-lens-ready aria-hidden="true" focusable="false" width="0" height="0">` with 9 `<filter id="ag-lens-…">` = `feImage` (map) → `feDisplacementMap` with a static per-thickness `scale` (E-10; nothing writes it at runtime), masked to the bezel band 12/16/24 px; markup + maps ≤ 30 KB. The provider mounts it once per document unless `tier` is `standard` or `lightweight`. `lens.css` maps `[data-ag-shape][data-ag-sizeclass]` to the id under the §4.4 enhanced selector, which never matches under `[data-ag-tier=standard|lightweight]`, `[data-ag-transparency=tinted|solid]`, `[data-ag-motion=none]`, reduced transparency, `contrast: more` or forced colours. `refraction` on a non-chrome layer is ignored with a dev warning; the `sheet` size class never refracts. Without `LensDefs`, or on WebKit/Gecko, output is pixel-equal to standard (ΔE2000 ≤ 1 on 99% of pixels) with CLS 0. On Chromium no text box (`Range.getClientRects()`) intersects non-zero displacement. `refraction` carries a TSDoc `@preview` tag until L8 certification passes at RC-1; otherwise it ships inert and is promoted in 5.1.
- **REQ-MAT-37 Cinematic boundary.** Core has no WebGL, `three` import or `<canvas>` in `src/material/**`, and no core CSS selects a cinematic tier. The labs admission contract (SURF, `packages/labs/**`) is documented in `apps/docs/content/mat/cinematic-contract.md`: refract only library-owned pixels (no DOM rasterisation), ≤ 1 WebGL context per page, pause offscreen and when hidden, render the standard `Surface` under `calm`/`none`, non-`glass` transparency, forced colours or context loss, no import side effects, import only public entries.
- **REQ-MAT-38 Dev diagnostics.** `src/material/dev/{surfaceCounter,warnings}.ts`, started by the provider in development only (production bundles contain neither; bundle grep for `surfaceCounter` = 0): after mount and on `requestIdleCallback` after mutations (500 ms debounce) it counts visible surfaces whose `::before` filter ≠ `none` and warns once per crossing: > 6 at fine pointer, > 3 at coarse, > 2 refracting, any refracting surface > 25% of the viewport, blur > 32 px, full-viewport blur > 12 px, live nesting depth > 1, and `allowNested at depth N at <selector>` for depth ≥ 2. It never changes attributes or styles.
- **REQ-MAT-39 Optics lint, CSS scanner, recipe metric.** `auraglass/no-optics-outside-material` (`lint/rules/mat/`) reports, outside `src/material/**`, `tokens/**` and generated outputs, the keys `backdropFilter`/`WebkitBackdropFilter`, literals matching `/backdrop-filter|-webkit-backdrop-filter/`, `/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/`, `/\bblur\(\s*\d/`, `/\bsaturate\(\s*\d/` and white specular gradients; stories and tests are not exempt. `scripts/mat/verify-optics-css.mjs` applies the same patterns to `*.css` outside `src/material/css/**`. `scripts/mat/count-glass-recipes.mjs` reports `independent-glass-recipes: N` (files outside `src/material/**` emitting any backdrop filter, + 1 if `src/material/**` does) in the job log and `.artifacts/mat/<job>/recipes.json`; ratchet (N never rises) until 5.0.0-beta.1, then fails on N > 1. `no-inline-glass` is retired into this rule.
- **REQ-MAT-40 Coarse pointer.** Under `(pointer: coarse)` the ladder drops `thick` blur one step (32 → 20 px) and grain to ≤ 0.02 (media block in `ladders.css`, no JS); at 390×844 a modal scene shows ≤ 3 visible backdrop filters including the scrim.
- **REQ-MAT-41 4.x bridge content (row group H, MAT on `release/4.x`).** 4.2: the 5.0 compiler generates an experimental `aura-glass/material` (H01) from the same token tree, with the D-28 navy dark-text fix (REQ-MAT-05) emitted through `tokens/legacy` as one labelled change (the exact changed legacy names and values are listed in the PR). 4.3: `src/styles/preview-v5.css` and `src/styles/v5.css` (H02) apply the same compiled `ladders.css` to the six 4.x primitives under `[data-ag-preview="v5"]` (no second recipe); `dist/compat/tokens.css` ships (H03). The frozen 4.x consumer fixture is pixel-unchanged without the attribute. Because PLAT owns every other `release/4.x` path (contract §2.4.1), MAT commits the bridge outputs as generated files inside its own H paths (`src/material/**`, including `src/material/compat/tokens.css` generated from `tokens/compat-alias-map.json`, and `src/styles/{v5,preview-v5}.css`), so PLAT's 4.x build bundles them without running MAT's compiler, and `mat:build:bridge` fails if a fresh compile differs from the committed copy. Wiring them into the 4.x exports map, the provider `preview?: 'v5'` prop and the 4.x primitives' attribute emission is PLAT's work under the contract's row group H note (seam: the H file paths plus the S-01 `data-ag-preview` row). MAT proves its half independently: colocated tests under `src/material/**` load `preview-v5.css` on fixture markup of the six primitives with `data-ag-preview="v5"` set by the test itself.

### 5.3 Motion (`src/motion/**`)

- **REQ-MAT-42 Interaction motion.** `src/motion/css/motion.css` (`@layer ag.material`): `@media (hover: hover) { [data-ag-interactive]:hover }` raises `--ag-specular` to `--ag-state-hover-specular` (in `micro`/`standard`, out `micro-exit`/`accelerate`); `[data-ag-interactive]:active, [data-pressed]` sets `--_ag-press: 1` (inset depth + specular dip; in `instant`, release `--ag-spring-snappy`). No hover or press rule anywhere sets `scale`, `transform`, `translate` or `rotate`, and no `whileHover`/`whileTap` exists in `src/**`. Shadow changes cross-fade pseudo-layer opacity, never `box-shadow` geometry. Transitions list properties explicitly from `ANIMATABLE` (S-12); `transition: all`, and any transition or keyframe of `backdrop-filter`, `filter`, `box-shadow`, `width`, `height`, `top`, `left`, `inset`, `border-radius` or `clip-path`, is banned. Focus rings appear within one frame and are never delayed by an entrance.
- **REQ-MAT-43 Enter, exit and materialization contract.** MAT ships the shared CSS for Base UI popups keyed on surface and state attributes: `[data-ag-surface][data-starting-style]`/`[data-ending-style]` animate `opacity` and `scale` 0.96 → 1 from `var(--transform-origin)` (enter `small` + `spring-snappy`, exit `small-exit` + `accelerate`; Dialog/Sheet/Toast `medium` + `spring-smooth`, full-screen sheet `large`); menus add `translate` 4 px from the anchor side; `--_ag-optics` goes 0 → 1 over the first 60% of the entry while the `backdrop-filter` value stays constant; scrims animate opacity only. `will-change: transform, opacity` exists only under the starting/ending selectors and `[data-ag-animating]`; no element keeps `will-change` 100 ms after settle (≤ 3 elements while animating). Layout primitives and resting cards have no mount animation (0 `getAnimations()` 50 ms after mount). Non-Base-UI entrances use `@starting-style` with `opacity`/`translate` only. Component owners apply these selectors to their own parts; no popup uses JS to delay unmount.
- **REQ-MAT-44 Modes and settled state.** `src/motion/css/motion-modes.css` (`@layer ag.a11y`): `calm` (attribute, or `prefers-reduced-motion: reduce` when no attribute) keeps opacity cross-fades at token durations, sets transforms to their settled values in starting styles, replaces springs with `--ag-ease-standard`, makes hover/press light response instant, disables pointer light and parallax, and gives infinite animations `animation: none`; `none` sets `transition-duration: 0s` and `animation: none` on `[data-ag-part], [data-ag-surface]` only (never `*`). Settled-state invariant in every mode: `--ag-duration-large` + 100 ms after a state change, every visible library part has opacity ≥ 0.99, `scale` ∈ {none, 1}, `translate` ∈ {none, 0px}, `visibility` ≠ hidden and a non-zero box. JS-driven motion checks the resolved mode at start and on change, jumping to its final state within one frame.
- **REQ-MAT-45 No API raises motion.** Under `prefers-reduced-motion: reduce` the resolved motion is at most `calm` (S-12 rule). `motionPolicy`, `"always-safe"`, `respectMotionPreference`, `forceMotion`, `disableReducedMotion`, `initialMotionPolicy`, motion `preset`/`animationPreset` and `disableAnimation` exist on no MAT type and on no `AuraGlassProvider` prop (type tests). Under forced colours, pointer light, specular sweeps and optics fades are disabled.
- **REQ-MAT-46 Continuous motion.** `allowContinuous` defaults to `false`; `data-ag-continuous="on"` is written only when it is true **and** resolved motion is `full`. Without it no library animation has `iterationCount === Infinity` and no library rAF callback runs 1 s after settle. The only core loop is `@keyframes ag-sweep` in `src/motion/css/loading.css`: `translate` of a specular pseudo-element −100% → 100%, 1,400 ms, `--ag-ease-standard`, nested under `[data-ag-continuous="on"]`, luminance change < 10% per frame and ≤ 3 peaks per second (WCAG 2.3.1); without the attribute it renders one static frame that still conveys state. Every infinite animation in any stream must be nested under `[data-ag-continuous="on"]` (enforced by `motion-no-ungated-loop`, REQ-MAT-51); `--ag-duration-ambient` is valid only there. `[data-ag-offscreen] { animation-play-state: paused }` is shipped by MAT. No core motion uses `Math.random()`.
- **REQ-MAT-47 Frame runtime (S-13).** `src/motion/index.ts` (internal) implements `MotionRuntime`: `subscribeFrame(cb, { element })` runs one shared rAF loop, `dt` capped at 50 ms, stops at zero subscribers, pauses while `document.visibilityState === 'hidden'`, and skips subscribers whose element is offscreen; `observeOffscreen(el)` uses one shared `IntersectionObserver` that is the sole writer of `data-ag-offscreen`. `MotionCapabilityContext` is `createContext<MotionCapability | null>(null)`; core never imports `aura-glass/motion`.
- **REQ-MAT-48 View Transitions.** `startMorph(update, { surfaces })` sets `data-ag-vt` on participants, calls `document.startViewTransition({ update, types: ['ag-morph'] })` (or the callback form), awaits `finished`, then sets `data-ag-vt-settled` for one `micro`; with no View Transition support it runs a FLIP fallback animating only `transform` with `--ag-spring-fluid` read from computed style, cancelled to its end on interruption or preference change. It always runs `update` exactly once and never throws on `AbortError`/`InvalidStateError`. Under `calm` the update is a 120 ms opacity cross-fade; under `none` it is synchronous. `src/motion/css/view-transition.css`: during `:root:active-view-transition`, `[data-ag-surface][data-ag-vt]` and `[data-ag-surface][data-ag-vt-participant]` have `--_ag-optics: 0` and no transition; `::view-transition-group(*.ag-morph)` uses `--ag-duration-medium` + `--ag-spring-fluid`; settled surfaces fade optics back over `--ag-duration-micro`. Morph owners (Tabs, SegmentedControl, TabBar, Menu→Sheet, SourceTransition) generate names from `useId()` sanitised to `[a-z0-9-]`, render `data-ag-vt-participant` and, on React 19.3+, `<ViewTransition share="ag-morph">`.
- **REQ-MAT-49 Pointer light (D-04, orthogonal to tiers).** `src/motion/pointerLight.ts`: one passive `pointermove` and one `pointerleave` listener per document (ref-counted), installed only while some element carries `data-ag-pointer-light` and resolved motion is `full`, transparency `glass`, `(hover: hover) and (pointer: fine)` and tier `standard|enhanced`. Per ticker frame it writes `--_ag-pointer` (`"<x>% <y>%"`, 1 decimal) on the nearest `[data-ag-pointer-light]` ancestor only: ≤ 1 `setProperty` per frame, 0 React commits, ≤ 1 `getBoundingClientRect` per entered element (cached, invalidated on scroll/resize); removed on leave. `[data-ag-highlights]` (S-01, value `''`, setter MAT; present = reduced highlights) disables pointer light, press glow and sweeps. No 5.0 preference key writes it yet (a `highlights` key would be an additive contract PR); the CSS and runtime honour it wherever an app or a test sets it. Emission of `data-ag-pointer-light` (setter MAT) goes through `MaterialRole.pointerLight` once the OI-MAT-02 contract PR merges; until then the runtime and CSS are tested on `Surface` fixtures.
- **REQ-MAT-50 `aura-glass/motion`.** `src/motion/public.ts` and `src/motion/adapter/**` (`"use client"` per file) are the only importers of `motion@^12` (contract §4.12). Exports exactly `MotionProvider`, `toMotionTransition`, `useDragDetents`, `useMomentum`, `SharedLayout`, `Shared`, `magnetic`. `MotionProvider` provides `MotionCapabilityContext` and renders `<MotionConfig reducedMotion={resolved === 'full' ? 'never' : 'always'}>` from `usePreference('motion')`. `toMotionTransition('spring-smooth')` = `{ type: 'spring', stiffness: 322.3, damping: 32.31, mass: 1 }` read from `motionTokens` (≤ 0.01 deviation from the CSS `linear()` curve at every 10 ms); durations → `{ duration: ms / 1000, ease }`. `useDragDetents` projects `position + velocity × 0.2`, passes release velocity to the spring, rubber-bands at 0.55, dismisses at 25% height or > 800 px/s, snaps with opacity under `calm`, jumps under `none`. `useMomentum` uses inertia (`power 0.8`, `timeConstant 325`), clamps to bounds, settles ≤ 1,000 ms, is interruptible. `magnetic` moves ≤ min(strength × 0.5 × min(w, h), 8 px), only under `full` and fine pointer, with no React state. `Shared` sets `data-ag-animating` and `--_ag-optics: 0` during layout animation. Importing `./motion` without the peer fails with an install message; components that consume `MotionCapability` work without it.
- **REQ-MAT-51 Motion lint and CSS checker.** MAT rules (S-47) in `lint/rules/mat/`: `motion-no-empty-animate` (conditional `animate` with `{}`/`undefined`/`false`, or `initial={{ opacity: 0 }}` with conditional `animate`); `motion-raf-via-ticker` (`requestAnimationFrame(`/`setInterval(` in `src/components/**`, `src/app-shell/**`, `src/data/**`, `src/ai/**`, `src/media/**`, `src/backdrops/**`, `src/date/**`, and state setters inside frame callbacks); `motion-transition-allowlist` (properties outside `ANIMATABLE`, `whileHover`/`whileTap`, transforms in hover/press rules); `motion-no-ungated-loop` (`repeat: Infinity`, `iterations: Infinity`, `infinite` not under `[data-ag-continuous="on"]` or not guarded by `usePreference('allowContinuous')`). `scripts/mat/verify-motion-css.mjs` (L1) additionally fails on overshoot beziers, `!important` in motion rules, duplicate or non-`ag-` `@keyframes`, and unregistered custom properties in transition lists. `scripts/mat/verify-preference-source.mjs` (L1) fails on `matchMedia(` strings containing `prefers-reduced-motion`, `prefers-contrast`, `prefers-reduced-transparency` or `forced-colors`, and on imports of 4.x reduced-motion hooks, outside `src/theme/preferences/**` and `src/theme/script/**` (folded into a named lint rule once OI-MAT-03 lands).

### 5.4 Preferences, provider and accessibility rungs (`src/theme/**`, `src/a11y/**`)

- **REQ-MAT-52 Resolution.** `src/theme/preferences/resolve.ts` exports pure `resolveTransparency`, `resolveContrast`, `resolveMotion` and `resolvePreferences(values): ResolvedPreferences` implementing §4.5 exactly. Exhaustive test over 2×2×2 OS booleans × 2 capability × 4 app × 4 user × glassOpacity {0, 0.69, 0.7, 1} (1,024 cases): no result below any floor; forced colours ⇒ `solid` + `more` regardless of every input, with no API (prop, attribute, `set`, compat adapter, `deprecations` option) able to change it; resolved `allowContinuous` is false unless motion is `full`; `floors` reports why an option is unavailable. `glassOpacity` is clamped to [0, 1] and written only as `--ag-glass-opacity`.
- **REQ-MAT-53 Store and hooks (S-20, S-21).** One `PreferenceStore` per document, created lazily on first use (never at import): `usePreference(key)` = `useSyncExternalStore` with `SERVER_SNAPSHOT`; `useResolvedPreferences()`; `usePreferenceActions().{set, reset}` (only `UserSettableKey`). Exactly one `MediaQueryList` per query per window, shared by all subscribers (`matchMedia` count = 1 after 200 subscribers of one key; ≤ 6 queries total: forced colours, contrast more, reduced transparency, reduced motion, colour scheme, coarse pointer); listeners removed at zero subscribers. Persistence under `STORAGE_KEY` through the injected `PreferenceStorage` (`storage={null}` disables it); invalid JSON is ignored; throwing `localStorage` falls back to memory. `LEGACY_STORAGE_KEY` is read once, `highContrast` → `contrast: 'more'`, `reducedTransparency` → `transparency: 'tinted'`, written to `STORAGE_KEY`, never written back. `set` below a floor persists the user value while `resolved` stays at the floor. Changing a preference re-renders ≤ 1 React component (surfaces respond through attributes only). `renderToString` + `hydrateRoot` emit 0 hydration warnings.
- **REQ-MAT-54 Rungs (`src/a11y/css/rungs.css`, `@layer ag.a11y`).** Keyed only on `[data-ag-surface]` and its pseudo-elements (no class list), attribute blocks first, then media blocks that only raise:

| Effective state | `::before` | Host fill | Ink / border | Other |
|---|---|---|---|---|
| `glass` | compiled optics | `--_ag-fill` at the solved floor | `--ag-on-surface` | refraction allowed |
| `tinted` | blur kept | tinted floor row | unchanged | `--_ag-refraction-scale: 0` |
| `contrast=more` | ≥ tinted | ≥ tinted | `color: var(--_ag-on-surface-max)`; `border: 1px solid var(--_ag-border-strong)` | `--ag-specular: 0`, grain off, text pairs ≥ 7:1 |
| `solid` | `backdrop-filter: none` (both prefixes) | `background: var(--_ag-fallback-fill)` alpha ≥ 0.85, `background-image: none` | solid pair | rim kept |
| forced colours | `backdrop-filter: none`, `background-image: none` | `background: Canvas` | `color: CanvasText; border: 1px solid CanvasText` | `box-shadow: none`; focus `Highlight`; scrims transparent with no filter (modality via `inert` + panel border) |

  With JavaScript off and `data-ag-transparency="glass"` hard-coded on `<html>`, emulated forced colours, `contrast: more` and (Chromium, via CDP `Emulation.setEmulatedMedia`) reduced transparency produce the forced, contrast-more and tinted rungs on every surface. The `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` block renders the solid rung. Under forced colours the count of elements (host or pseudo) with a non-`none` backdrop filter is 0 on every subject, including scrims (4.1: modal 10). `contrast=more` changes > 0.5% of pixels inside the largest surface of every subject (4.1: 0.000%). Disabled ink keeps ≥ 3:1 without host `opacity`. Unlayered consumer CSS may still override (documented escape hatch); certification asserts library CSS alone.
- **REQ-MAT-55 `AuraGlassProvider` (S-22).** Accepts exactly `AuraGlassProviderProps`. It applies props as `data-ag-*` on its root (the outermost provider marks `<html>` with `data-ag-root`; nested providers render `<div data-ag-root data-ag-provider>` and reuse the outer portal root), plus the single `--ag-glass-opacity` property and at most one `<style>` (brand via `createBrandTheme`, preset until OI-MAT-01); no other inline style. It hosts the store, `LayerStack`, the announcer, `LensDefs` (REQ-MAT-36), pointer-light installation (REQ-MAT-49) and, in development, the surface counter (REQ-MAT-38). `toasts`/`tooltips` (default `true`) control only whether the toast region and transient root render. `deprecations` (`'warn'` default in development) is forwarded to compat warnings. Without a provider every CSS rung and floor still works from server-layout attributes and media mirrors.
- **REQ-MAT-56 Portal root (S-23).** One `[data-ag-portal-root]` per document containing exactly `PORTAL_ROOT_MARKUP`, rendered at the end of `document.body` through the kept `Portal` primitive (S-34), or into `portalContainer`. Two providers ⇒ one portal root. `usePortalContainer(root = 'overlay')` returns the matching `[data-ag-layer-root]` element, or `null` with no provider (Base UI default). Layer roots take z-order from `--ag-z-overlay|transient|toast`; DOM order is stack order within a root. The portal root carries the resolved scheme and transparency attributes so portaled overlays resolve like the page.
- **REQ-MAT-57 LayerStack (S-25).** `useLayer(entry)` returns `{ id, depth, isTop }` and registers `{ kind, modal, open, onEscape, element, lockScroll }`. One `keydown` listener per document dispatches Escape to the topmost open entry only; with Dialog → Popover → Tooltip open, three Escapes close them in reverse order, each returning focus to its own trigger (overlay owners pass Base UI `onEscapeKeyDown`/dismissal to `useLayer`). Modal entries set `inert` on every sibling of the portal root and on lower layer roots; non-modal entries do not. Scroll lock is reference-counted and applied once. Covered elements get `data-ag-obscured`. Escape dispatch is O(1); `inert` toggling ≤ 2 ms for 1,000 background nodes. Lint `auraglass/no-document-escape` (MAT) reports any other document- or window-level Escape listener.
- **REQ-MAT-58 Announcer (S-26).** `useAnnouncer().announce(message, { politeness = 'polite', id })` writes into the matching `[data-ag-announcer]` live region; an identical message within 500 ms is coalesced; an `id` replaces the queued message with the same id; regions clear 7,000 ms after the last write; `clear()` empties both. Outside a provider: one dev warning, no-op. Streaming budget for consumers (SURF Thread/StreamingText): ≤ 1 polite write per 1,000 ms per region plus one final write (≤ 11 writes for a 10 s stream); tweened values announce only final values.
- **REQ-MAT-59 `AuraGlassScript` and `auraGlassPrepaintScript` (S-22, D-10).** A Server Component that emits one inline `<script nonce>` (no `eval`/`new Function`, synchronous in `<head>`, ≤ 1.5 KB minified, ≤ 1 ms on the mid-tier mobile profile) built by `scripts/mat/build-prepaint-script.mjs` from the same `resolve.ts` source. Before first paint it reads persisted settings (`storageKey`, `defaults` equal to the provider props), evaluates the six media queries and `CSS.supports` for the capability floor, and sets `data-ag-transparency`, `-contrast`, `-motion`, `-scheme`, `-density`, `-continuous` and `--ag-glass-opacity` on `<html>`. Engine: `navigator.userAgentData.brands` (Chromium/Edge/Opera brands → `chromium`), else UA string (`AppleWebKit` without `Chrome`/`Chromium` → `webkit`, `Gecko/` + `Firefox/` → `gecko`), else `unknown` (caps at standard); never `@supports url()` detection. Tier: `lightweight` only for `saveData`, or `deviceMemory ≤ 2` with `(pointer: coarse)`, or a persisted/app value; otherwise unset or the persisted/app `standard|enhanced`. `auraGlassPrepaintScript` is the same compiled body as a string. Persisted `solid` ⇒ the first captured frame already has `backdrop-filter: none` (0 blur frames across 20 reloads per engine); CLS 0. Without a nonce under strict CSP the CSS path still enforces floors.
- **REQ-MAT-60 `GlassPreferencesPanel` (S-24).** Client component at `src/theme/preferences-panel/`, built from native form controls styled through `materialProps` (no import of CMP components, which would make `./theme` depend on `src/components/**`). Renders `<fieldset>`/`<legend>` groups for the `keys` it is given (default all seven `UserSettableKey`): transparency (System/Glass/Tinted/Solid), glass opacity range (0–100%, step 5, `aria-valuetext` such as "40% more opaque"), contrast (System/Standard/More), motion (System/Full/Calm/None), scheme, density, and an "Allow continuous animation" switch (WCAG 2.2.2 control). Options below an active floor are `aria-disabled="true"`, stay focusable, and are described by a note naming the floor ("Your system's Increase Contrast setting requires at least Tinted"); selecting one is a no-op. Changes apply immediately through `usePreferenceActions`, call `onChange(key, value)` and are announced politely ("Transparency set to Tinted"). Single column at coarse pointer, full-width controls; RTL-correct.
- **REQ-MAT-61 Focus ring (`src/a11y/css/focus.css`).** The only focus implementation: `:where([data-ag-focusable], .ag-focusable):focus-visible { outline: var(--ag-focus-width) solid var(--ag-focus-outer); outline-offset: var(--ag-focus-width); box-shadow: 0 0 0 var(--ag-focus-width) var(--ag-focus-inner), var(--_ag-shadow, 0 0 #0000) }`; `--ag-focus-width: 2px`; forced colours `outline: 2px solid Highlight`. Clipping containers use `overflow: clip` with `overflow-clip-margin: 4px` or the private inset offset. No library CSS sets `outline: none`/`0` on `:focus-visible`, `[aria-disabled="true"]` or element selectors; `focus:outline-none` occurs 0 times in `src/**`. WCAG 2.4.13 is the default: for every focusable part the indicator area ≥ the 2 px perimeter and the changed pixels reach ≥ 3:1 between focused and unfocused states on rendered pixels in all 8 scenes. The ring is never animated away in any mode.
- **REQ-MAT-62 Target size (`src/a11y/css/targets.css`).** `[data-ag-part="hit-area"]` (part rendered by each interactive component owner, S-33) is `position: absolute`, `aria-hidden`, centred, sized `max(100%, var(--ag-target-min))` and, under `(pointer: coarse)`, `max(100%, var(--ag-target-coarse))`; adjacent hit areas shrink toward the midpoint so they never overlap; 0 layout contribution. Proof over every interactive subject: ≥ 24×24 at fine pointer (or the 24 px spacing exception) and ≥ 44×44 at coarse pointer (WebKit and Chromium, `hasTouch`, 390×844).
- **REQ-MAT-63 Focus not obscured.** `[data-ag-scroll-container] { scroll-padding-block: var(--ag-scroll-padding-top, 0) var(--ag-scroll-padding-bottom, 0) }` (and the same on `<html>`). Sticky chrome owners write `--ag-scroll-padding-top|bottom` (public S-03 `layout` variables; their block size + 8 px); MAT's proof uses its own sticky `Surface` fixtures and, as SURF subjects appear in `listSubjects()`, reports their results against SURF. Proof: tabbing through ≥ 50 focusables under a sticky top bar and bottom tab bar at 1440 and 390 leaves no focused element fully covered and median coverage 0 (WCAG 2.4.11).
- **REQ-MAT-64 No runtime contrast.** No production code measures contrast at runtime: `getComputedStyle`-driven contrast, canvas sampling and `ResizeObserver`/`MutationObserver` contrast loops are reported by `auraglass/no-runtime-contrast` (MAT rule) everywhere except `src/backdrops/**`, which may set only `data-ag-backdrop`.
- **REQ-MAT-65 Catalogue-wide a11y suites.** MAT owns these specs, which enumerate subjects with `listSubjects()` (S-40) and never hard-code another stream's story ids; a failure is reported against the subject's owner: rendered-pixel text contrast (every visible text run, worst sample vs the median backdrop of a text-hidden twin; body ≥ 4.5, large ≥ 3, `contrast=more` ≥ 7; 8 scenes × 3 engines × light/dark × glass/tinted/solid × default/more/forced × 1440/390; 0 failing rows for flagships; artifact `.artifacts/mat/<job>/a11y-pixel-contrast.json`); forced-colours zero-filter sweep (REQ-MAT-54); coverage sweep (100% of live `::before` backdrop filters carry `data-ag-surface`; material decorative elements are `aria-hidden`, never focusable or with a role); focus appearance (REQ-MAT-61); target size (REQ-MAT-62); focus-not-obscured (REQ-MAT-63); zoom and reflow (200% at 1280×800 ⇒ 640×400 with `deviceScaleFactor: 2`; 400% ⇒ 320×256 and 320×640 with `deviceScaleFactor: 4`; no clipping, no 2-D scroll outside `Table`, code surfaces and `ImageViewer`, sticky chrome ≤ 50% of viewport height; `document.documentElement.style.zoom` is not used); text spacing (WCAG 1.4.12 values injected unlayered; no loss of content); colour vision (Machado 2009 protan/deutan/tritan at severity 1.0: each intent pair has ΔE2000 ≥ 10 or a registered non-colour cue). QUAL's L5 axe lane runs with `colorContrast: true` (S-40 `apg.axe`) over MAT subjects with 0 serious/critical violations.
- **REQ-MAT-66 Manual records.** For MAT subjects (`Surface` in the Material Lab, `GlassPreferencesPanel`) and for the reduced-motion manual pass, MAT writes scripts in `tests/a11y/manual/scripts/mat/` and `SrRecord`s in `tests/a11y/manual/records/mat/` (schema `contracts/schemas/sr-record.schema.json`): VoiceOver Safari macOS, VoiceOver iOS, NVDA Chrome, TalkBack Chrome (required) plus physical touch on iOS and Android. The motion pass confirms, with OS motion reduction on in all four, that Button, Dialog, Menu, Sheet and Tabs stay visible and operable (subjects reached through `listSubjects`; records stored under MAT's directory with the subject named). G-09 counts these with CMP's and SURF's.
- **REQ-MAT-67 Deprecations and codemods.** Every 4.x name, prop, subpath, class or variable this stream retires (§9) has one entry in `fragments/deprecations/mat.ts` (`DeprecationEntry`, S-38; ids in MAT's own space `DEP-M0001`, `DEP-M0002`, …), authored on `release/4.x` so it ships in a published 4.x minor (G-07; 4.2 for material, motion and a11y items, 4.3 for `--glass-*`, mode hooks, personas and theme APIs). `fragments/codemods/mat.ts` (S-39) carries the rename and prop tables, the `cssVars` alias map (REQ-MAT-21) and specs plus input/output fixtures under `fragments/codemods/mat/fixtures/<id>/<case>/` for the area transforms `reduced-motion-initial`, `motion-imports` and `motion-props`; PLAT writes the transform code (W-3). Fixtures cover `prefersReducedMotion`, `reducedMotion`, `!shouldAnimate`, nested ternaries, multiline, `useReducedMotion()` → `usePreference('motion') !== 'full'`, `ReducedMotionProvider` unwrap, `<Motion preset="fadeIn">` → element + `TODO_MARKER`, `RippleButton` → `Button`, `magnetic` → `aura-glass/motion`, and idempotence on a second run.

---

## 6. Files and directories affected (MAT ownership globs only)

Exactly the MAT rows of contract §3.2; a MAT PR touching anything else fails `contract:ownership`.

| Row | Glob (on `next` unless noted) | Use in this PRD |
|---|---|---|
| A07 | `src/root/mat.ts` | re-exports `ROOT_EXPORTS.mat` |
| A09 | `fragments/*/mat{.ts,.json}`, `fragments/*/mat/**` | `deprecations` (authored on `release/4.x`), `codemods` (+ `mat/fixtures/**`), `size-budgets`, `perf-budgets`, `lanes`, `playwright`, `css`, `side-effects` (empty), `review`, `literals-baseline`, `a11y-baseline` |
| A14 | `.changeset/mat-*.md` | changesets |
| A15 | `lint/rules/mat/**` | the 9 MAT rules (S-47) and `_strict.cjs` |
| A16 | `stories/mat/**` | docs-only MDX (`Tokens.mdx`, Motion Lab notes) |
| A17 | `apps/docs/content/mat/**` | "Choosing a material", motion guide (was `docs/motion.md`), tokens guide (was `docs/design-tokens.md`, row B20), cinematic contract |
| A18 | `docs/auraglass-5/…MATERIAL_SYSTEM_PRD.md`, `prompts/mat/**`, `tasks/MAT.json` | this PRD, its prompts and tasks (see OI-MAT-06 on the path) |
| A20 | `ci/mat.gitlab-ci.yml`, `ci/mat/**` (both branches) | MAT's CI fragment |
| B07 | `stylelint.config.mjs`, `stylelint-plugin-auraglass/**` | stylelint half of `no-raw-design-values` |
| B20 | `docs/{motion,design-tokens}.md` | moved (deleted here, rewritten under A17) |
| B22a | `etc/api/{material,theme,tokens,motion}.{api.md,exports.json}`, `etc/api/material.css-api.json`, `etc/api/root.mat.api.md`, `etc/api/compat.mat.api.md` | API reports |
| B23a | `canaries/next16/app/mat/**`, `canaries/vite/src/mat/**`, `canaries/<app>/fixtures/mat/**` | RSC/no-provider/no-motion-peer canary pages |
| C01 | `src/material/**`, `src/tokens/**`, `src/theme/**`, `src/a11y/**`, `src/motion/**`, `src/styles/**`, `src/hooks/**` | all runtime code and CSS (colocated stories and tests follow, row C10) |
| C02 | `src/compat/mat/**` | 4.x theme, provider, material, motion and a11y adapters |
| D02 | `tests/{a11y/apg,a11y/manual/records,a11y/manual/scripts,perf/browser,visual,e2e,ssr,rsc,types,lint}/mat/**` | browser, visual, perf, SSR/RSC, type and lint-rule tests |
| D03 | `tests/fixtures/consumer-4x/cases/mat/**` (see the note below the table) | frozen 4.x usage cases |
| D06 | `tests/{material,tokens,motion,theme,a11y}/**` (except D01's `tests/a11y/apg/harness.ts`, `tests/a11y/browser/**`) | unit, compiler and gate tests |
| E01 | `scripts/tokens/**` | compiler, transforms, formats, gates, `lens-maps.mjs` |
| E03 | `scripts/mat/**` | `verify-optics-css`, `count-glass-recipes`, `verify-material-runtime`, `verify-motion-css`, `verify-preference-source`, `verify-a11y-css`, `build-prepaint-script` |
| F09 | `tokens/**` | DTCG sources, `compat-alias-map.json`, `legacy/4x-rendered.tokens.json` |
| H01–H03 (`release/4.x`) | `src/material/**`, `tokens/**`, `scripts/tokens/**`, `src/styles/v5.css`, `src/styles/preview-v5.css`, `tokens/compat-alias-map.json` | 4.2/4.3 bridge content (generated outputs committed, REQ-MAT-41) |

On `release/4.x` MAT touches only rows A09 (`fragments/deprecations/mat.ts`), A20 and H01–H03 (contract §2.4.1). Row D03 says the `cases/mat/` fixtures are authored on `release/4.x`, which §2.4.1 does not list; until a contract PR reconciles the two (OI-MAT-11), MAT authors them on `next` under D03 and they describe 4.1.0 usage only.

Paths this PRD reads but never writes: `src/contracts/**` and `contracts/**` (CONTRACT), `src/primitives/index.ts` (CMP), `src/internal/index.ts` (PLAT), `tests/helpers/**` and `tests/a11y/apg/harness.ts` (QUAL), `legacy/**` (PLAT; read-only reference for 4.x sources).

## 7. Components affected

| Group | Change | Owner of the change |
|---|---|---|
| Every component that renders glass (166–168 `OptimizedGlass`, 31 `LiquidGlassMaterial`, 24 `GlassCore`, 59 `createGlassStyle` files, 37 R13 files in 4.x) | 5.0 successors render through `Surface`/`materialProps` and read only S-03 variables and S-01 attributes | CMP and SURF in their own directories; legacy deleted by PLAT |
| Flagships 1–44 | consume `sys.*` tokens, the REQ-MAT-09 state contract, REQ-MAT-43 motion selectors, `useLayer`, `usePortalContainer`, `useAnnouncer`, the `hit-area` part and the focus ring | CMP, SURF |
| Theme and preference UI: `GlassThemeSwitcher` (REDESIGN), `PersonaPicker` (replaced by the preset group in `GlassPreferencesPanel`), `GlassColorSchemeGenerator` (docs playground on `createBrandTheme`), `GlassA11y` family (→ `GlassPreferencesPanel`) | rebuilt or replaced here | MAT |
| Morph users (Tabs, SegmentedControl, TabBar, Menu→Sheet, SourceTransition); drag users (Sheet, TabBar) | adopt `startMorph`/`data-ag-vt-participant` and `MotionCapability` | CMP, SURF |
| Streaming/live components (Toast, Thread, StreamingText) | use `useAnnouncer` and the toast region | CMP, SURF |
| Removed families (Houdini, `LiquidGlassGPU`, `GlassWebGLShader`, `HeatGlass`, `Glass3DEngine`, physics engines, atmospheric/particle components, `ContrastGuard`, theme demos) | deleted from `legacy/` | PLAT (MAT supplies the deprecation entries) |

## 8. New components and files

| Path | Purpose |
|---|---|
| `tokens/$schema.json`, `tokens/{ref,sys,material,modes,presets,contrast,legacy,comp}/**` | DTCG tree (REQ-MAT-01..14, 21) |
| `scripts/tokens/{build,validate,lens-maps}.mjs`, `scripts/tokens/transforms/{glass-material,motion-spring,contrast-solve}.mjs`, `scripts/tokens/formats/{css-layered,ts-constants,manifest,compat-aliases,floors}.mjs`, `scripts/tokens/gates/{undefined-vars,dead-vars,literals,tier-skip,types-runtime}.mjs` | compiler and gates |
| `src/tokens/index.ts` (generated, committed) | `tokens` |
| `src/material/{index,types,materialProps,useMaterialTier}.ts`, `src/material/{Surface,SurfaceGroup,Environment,ScrollEdge,ConcentricFrame}.tsx`, `src/material/internal/resolveRole.ts` | `./material` |
| `src/material/css/{material,properties,lens}.css`, `src/material/css/generated/{ladders,floors}.css` | material CSS |
| `src/material/lens/LensDefs.tsx`, `src/material/assets/lens/*.png`, `src/material/assets/ag-grain-128.avif` | enhanced lens and grain |
| `src/material/dev/{surfaceCounter,warnings}.ts` | dev diagnostics |
| `src/motion/{index,ticker,offscreen,viewTransition,pointerLight,capability,public}.ts`, `src/motion/tokens.generated.ts`, `src/motion/adapter/**`, `src/motion/css/{motion,motion-modes,view-transition,loading}.css` | motion runtime, `./motion`, CSS |
| `src/theme/{index,public}.ts`, `src/theme/preferences/{store,resolve,usePreference}.ts`, `src/theme/AuraGlassProvider.tsx`, `src/theme/script/AuraGlassScript.tsx`, `src/theme/layers/LayerStack.ts`, `src/theme/announcer.ts`, `src/theme/portal.ts`, `src/theme/presets.ts`, `src/theme/createBrandTheme.ts`, `src/theme/preferences-panel/GlassPreferencesPanel.tsx` | `./theme` and internal seams (kept: `color.ts`, `createGlassTheme.ts`, `materials.ts` until §9 removes it) |
| `src/theme/preferences-panel/GlassPreferencesPanel.tsx`, `src/material/Surface.meta.ts`, `src/theme/preferences-panel/GlassPreferencesPanel.meta.ts` | panel; metas typed `satisfies ComponentMeta` from `src/contracts/components.ts` (S-31 type only, no import of CMP's `defineMeta`), so the `matrix` story and QUAL's subject resolver find `Surface` and the panel |
| `src/a11y/css/{rungs,focus,targets,scroll-padding}.css` | `ag.a11y` |
| `src/compat/mat/**` | adapters (REQ-MAT-24, §9) |
| `lint/rules/mat/{no-optics-outside-material,no-inline-glass,no-raw-design-values,motion-no-empty-animate,motion-raf-via-ticker,motion-transition-allowlist,motion-no-ungated-loop,no-document-escape,no-runtime-contrast}.cjs`, `lint/rules/mat/_strict.cjs`, `stylelint-plugin-auraglass/no-raw-design-values.mjs` | lint (S-47; `no-inline-glass` is an alias that reports "use no-optics-outside-material") |
| `scripts/mat/*.mjs` (row E03 list in §6) | private gates registered as L1 lanes |
| `ci/mat.gitlab-ci.yml`, `ci/mat/**` | CI fragment (§12.4) |
| Fragments `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,review,side-effects}/mat.ts`, `fragments/{playwright,literals-baseline,a11y-baseline}/mat.json` | per-owner fragment data |

## 9. Components and files to remove or deprecate

PLAT deletes legacy files (rows B01, R-01). MAT's obligation is the deprecation entry (4.x minor shown), the replacement and the codemod mapping. "compat" means an adapter in `src/compat/mat/` through 5.x, removed in 6.0.

| 4.x item | C-D in | 5.0 | Replacement | Codemod id |
|---|---|---|---|---|
| `OptimizedGlass`/`OptimizedGlassCore`, `GlassCore`/`GlassPrimitive`, `GlassAdvanced`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial` | 4.2 | compat | `Surface` | `canonical-names` + `dead-optical-props` |
| `LiquidGlassEffectGroup`, `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame` | 4.2 | compat | `SurfaceGroup`, `ScrollEdge`, `ConcentricFrame` | `canonical-names` |
| `LiquidGlassLayerProvider`, `LiquidGlassSurfaceLayer`, `useLiquidGlassLayer` | 4.2 | compat passthrough | nested rule + dev counter | `providers` |
| `LiquidGlassBackdropSampler`, `useLiquidGlassBackdrop`, `useGlassProbes` | 4.2 | removed | `data-ag-backdrop`, `Environment` | `removed` |
| `createGlassStyle` (both), `glassFoundation`, `glassSurface`, `glassTokenUtils`, `glassUtils`, `liquidGlassUtils`, `core/mixins/glassMixins` subpath, `src/theme/materials.ts` exports | 4.2 | removed | `materialProps`, `MaterialSpec` | `removed` with `TODO_MARKER` (+ `imports-subpaths`) |
| `glass.generated.css`, `glass.css` recipe classes, `glass-backdrop-blur*`, `glass-animate-*`, `glass-transition-all`, `glass-tier-*`, `liquid-glass-*` emissions, `--aura-blur-amount` | 4.2 | removed | `material.css`, `data-ag-tier` | `css-vars`; class usage reported by `doctor` |
| Houdini, `LiquidGlassGPU`, `GlassWebGLShader`, `HeatGlass`, `Glass3DEngine` | 4.2 | removed | none in core (labs only over owned pixels) | `removed` |
| `Motion` (root and primitives), `MotionNative`, `GlassMotionController` family, `animationPresets`, `GlassTransitions` family, `OrganicAnimationEngine` family, `AdvancedAnimations`, physics/Galileo/orchestration hooks | 4.2 | removed (`Motion` compat: passthrough `div`) | CSS motion, `startMorph`, `aura-glass/motion` | `motion-imports` |
| `ReducedMotionProvider`, `MotionPreferenceProvider`/`Context`, `useReducedMotion`, `useEnhancedReducedMotion`, `useMotionPreference`, `useMotionAwareAnimation`, `prefersReducedMotion`, `useGlassMotionPolicy` | 4.2 | compat `useReducedMotion` wrapper | `usePreference('motion')` | `motion-imports`, `providers` |
| Props `respectMotionPreference`, `motionPolicy`, `initialMotionPolicy`, motion `preset`/`animationPreset`, `animate`, `disableAnimation`, whileHover/whileTap pass-through | 4.2 | removed | preferences | `motion-props` |
| `GlassMagneticButton`, `GlassMagneticCursor`, `RippleButton`, `TouchRippleEffects`, `MotionAwareGlass`, `GlassDepthLayer` | 4.2 | removed | `Button` + `magnetic()`, `Surface` | `motion-props` |
| `ANIMATION`, `AURA_GLASS.motion`, `LIQUID_GLASS.motionFluency`, `--glass-motion-*`, `--glass-theme-duration-*`, `tokens/keyframes` | 4.2 | removed | motion tokens | `motion-imports`, `css-vars` |
| `ContrastGuard`, `TextWithContrast`, `HighContrastText`, `useContrastGuard`, `useAutoTextContrast`, `validateTextContrast`, `validateLiquidContrast`, `sampleBackdropLuminance` | 4.2 | removed | solved floors | `removed` (unwraps `<ContrastGuard as=X>`) |
| `GlassA11y` (+ `GlassHighContrast`, `GlassMotionControls`, `GlassScreenReader`, `GlassKeyboardNav`), `GlassA11yAuditor` | 4.2 | removed | `GlassPreferencesPanel`; CI axe | `removed` |
| `GlassFocusIndicators` (+ CSS, `SkipLinks`, `LandmarkAnnouncer`, `KeyboardShortcutsHelper`), `GlassFocusRing`, `FocusIndicator` | 4.2 | removed | `focus.css`, `useAnnouncer` | `removed` |
| `AccessibilityProvider`, `useAccessibility`, `useAccessibilitySettings`, `GlassThemeProvider`, `ThemeProvider`, `useGlassTheme`, `AIGlassThemeProvider` | 4.2 | compat (`highContrast` → `contrast="more"`, `reducedTransparency` → `transparency="tinted"`, `colorBlindness` dropped with warning) | `AuraGlassProvider`, `usePreference` | `providers` |
| Announcers `ScreenReader`, `LiveRegion`, `announce`, `useAnnounce`, `announceToScreenReader` ×2 | 4.2 | removed | `useAnnouncer` (`ScreenReaderOnly` → CMP `VisuallyHidden`) | `canonical-names` |
| `--glass-*`, `--aura-*`, `--persona-*`, `--glass-theme-*` vars; `data-theme`, `data-aura-theme`, `data-persona`, `data-bg`, `.glass-on-light/-dark`, `.dark/.light` hooks; `.high-contrast`, `.large-text`, `data-color-blindness`, `glass-contrast-guard`, `glass-focus`, `glass-touch-target` | 4.3 | `compat/tokens.css` aliases (scheme only for hooks) | `--ag-*`, `data-ag-*` | `css-vars`, `removed` |
| 10 personas, `PersonaPicker`, `usePersonaTheme`, `PERSONA_IDS`, `THEME_NAMES`; `createBrandGlassTheme`, `createGlassThemeCssVars`, `glassMaterialPresets`; `GlassThemeMode "high-contrast"`, `GlassDensity "comfortable"`; `getPersona*` types | 4.3 (`getPersona*` 4.2) | presets; `createBrandGlassTheme` compat; rest removed | `presets`, `createBrandTheme`, `.vars` | `providers` rewrites literal values |
| `framer-motion` peer | 4.2 (both optional) | removed; `motion@^12` optional peer of `./motion` | `aura-glass/motion` | `deps` (PLAT) |

## 10. API changes

Classes per D-27: C-I internal, C-E additive, C-D deprecation (4.x), C-B breaking (5.0 only, after a 4.x C-D).

| API | Change | Class | Release |
|---|---|---|---|
| `aura-glass/material` (`Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps`, `useMaterialTier`; types from `src/contracts/material.ts`) | new; experimental in 4.2 from the 5.0 compiler | C-E | 4.2 / 5.0 |
| `aura-glass/theme` (`AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript`, `createGlassTheme`, `createBrandTheme`, `presets`, `usePreference`, `useResolvedPreferences`, `usePreferenceActions`, `GlassPreferencesPanel`) | new entry; `createGlassTheme` keeps its call shape and gains `preset`, `neutralHue`, `radiusScale`, `contrast` and the `{ cssText, vars, contrast, tokens }` return; `GlassThemeTokens.density.{controlHeight,gap,pagePadding}` removed | C-E (4.2 experimental, options 4.3), C-B removed fields | 4.2 / 4.3 / 5.0 |
| `aura-glass/tokens` | exports only `tokens`; `auraTokens`, `personas`, the default export, `getPersona*` removed | C-B | 5.0 |
| `aura-glass/motion` (`MotionProvider`, `toMotionTransition`, `useDragDetents`, `useMomentum`, `SharedLayout`, `Shared`, `magnetic`) | new; `motion@^12` optional peer | C-E | 4.2 experimental / 5.0 |
| `aura-glass/tokens.css`, `aura-glass/material.css`, `aura-glass/compat/tokens.css` | new CSS entries (contents MAT; assembly PLAT) | C-E | 4.2 / 4.3 / 5.0 |
| Root (`ROOT_EXPORTS.mat`) | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `AuraGlassProvider`, `AuraGlassScript`, `usePreference` | C-E | 5.0 |
| Public CSS variables (S-03, `MOTION_CSS_VARS`) and MAT attributes (S-01) | semver-stable contract; listed in `etc/api/material.css-api.json` | C-E | 5.0 |
| `data-ag-theme`, `data-ag-shadcn-source`; `MaterialRole.pointerLight` | requested additions (OI-MAT-01/02) | C-E (contract PR) | 5.0 |
| `data-ag-preview="v5"` | subtree preview on 4.3 only | C-E, then removed | 4.3 |
| Variant union `regular | clear | identity`; `thickness` replaces `elevation`/`intent`; `layer="content"` defaults to content materials; `clear` without backdrop renders `regular` | material grammar | C-B (D-06/07/08), C-E (D-12) | 5.0 |
| OS floors cannot be lowered by app or user; `"always-safe"` no longer overrides the OS | behaviour fix | C-B (D-11); 4.2 `"always-safe"` → `"auto"` is C-I (PLAT on 4.x) | 4.2 / 5.0 |
| Global `*` reduced-motion rules → `calm` (cross-fades kept); hover/tap scale removed; focus ring appearance changes; `--glass-*` no longer emitted by core CSS | visible changes | C-B | 5.0 |
| Removals in §9 | removal | C-D → C-B | 4.2/4.3 → 5.0 |

## 11. Migration concerns

1. **Visible change is the norm.** 4.x glass is about 2% white; 5.0 surfaces sit at solved floors, content layers stop blurring, hover scale and bounce disappear, the focus ring changes. All of it is C-B, so `release/4.x` changes only through the D-28 list (navy dark text in the 4.2 compiler output; PLAT's hand-written 4.x fixes) and the opt-in `data-ag-preview="v5"` subtree.
2. **4.x pixel stability (D-27).** The 4.2 compiler reproduces 4.x values from `tokens/legacy/4x-rendered.tokens.json`; the frozen fixture (`tests/fixtures/consumer-4x/`, MAT cases under `cases/mat/`) is pixel-unchanged except the labelled D-28 change.
3. **Inline-style consumers.** `style={createGlassStyle(...)}` becomes `{...materialProps(role)}`; other shapes get `TODO_MARKER`. A consumer `background` on a surface now overrides the tint (documented).
4. **Backdrop declaration.** Runtime sampling is gone; apps declare `data-ag-backdrop` on sections or wrap media in `Environment`. Undeclared `clear` falls back to `regular`. `@auraglass/cli doctor` (PLAT) flags undeclared `clear`.
5. **CSS hooks.** `.optimized-glass-surface`, `.liquid-glass-material`, `--glass-*` targets move to `[data-ag-surface]`, `[data-ag-variant]` and `--ag-surface-*` read-outs; `compat/tokens.css` aliases reads only; there is no compat for optics classes or for the 4.x global focus CSS (it was a defect).
6. **Themes.** Apps toggling `.dark`/`data-theme` (next-themes `class`) switch to `attribute="data-ag-scheme"`; persona users map to the nearest preset plus `createBrandTheme(accent)` (table generated from `designMatrix.ts` before PLAT deletes it).
7. **Motion.** framer-motion users who relied on AuraGlass's transitive copy must declare it (`deps` codemod). `layoutId` users import `aura-glass/motion` and install `motion@^12`. Reduced-motion users now keep opacity cross-fades (WCAG 2.3.3-aligned); apps that forced motion on lose that ability by design.
8. **Preferences.** The 4.x accessibility settings key is migrated once. Under strict CSP without a nonce, floors still hold through CSS; user choices apply after hydration.
9. **Browser floors.** `oklch()`, `light-dark()`, relative colour and `linear()` have `@supports` fallbacks and precomputed literals; the version floors are re-checked in L8.
10. **Rollback (architecture §14.6).** Enhanced regression → `tier="standard"` or `data-ag-tier="standard"`; unreadable backdrop → `data-ag-transparency="tinted|solid"` per subtree; a floor fix is one row in `MaterialSpec`.

---

## 12. Tests required

Unit tests run in Jest (QUAL's verbatim `jest.config.js`, discovered by location). Every browser, visual and perf spec runs remotely in GitLab CI through QUAL's lane jobs (`.ag-playwright`, image `mcr.microsoft.com/playwright`), never on a developer Mac. MAT registers each suite in `fragments/lanes/mat.ts` (`LaneRegistration`: `remote: true` for browser/perf, `failClosed: true`, `scope: 'pr'` for unit, L1 gates and the single-engine smoke of each browser spec, `scope: 'nightly'` for the full engine × scene × preference matrix, `scope: 'release'` for L13/L14 records) and its Playwright projects in `fragments/playwright/mat.json` (names `mat:*`, `mat:cert-*`). Evidence goes to `.artifacts/mat/<job-slug>/` (S-48). Specs that iterate other streams' subjects use `listSubjects()` only; a subject whose owner has not merged yet is absent or `pending`, never a MAT failure.

### 12.1 Unit and node

| File | Proves |
|---|---|
| `tests/tokens/{schema,compiler-guards,determinism}.test.ts` | REQ-MAT-01..03 (one fixture per guard; SHA-256 equality of two builds; drift check) |
| `tests/tokens/{namespace,manifest,tier-skip}.test.ts` | REQ-MAT-04 (every emitted `--ag-*` ∈ `PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS` and vice versa; manifest satisfies `TokenManifest`) |
| `tests/tokens/{oklch,type-space-shape,material-transform,interaction}.test.ts` | REQ-MAT-05..07, 09 (ramps; `light-dark()`; 3×3 ladder; 18 literal WebKit rules; blur ≤ 32; no `intent`/`elevation`) |
| `tests/tokens/motion-spring.test.ts` | REQ-MAT-08 (≤ 40 stops; last stop `1`; max error ≤ 0.005 over 1,000 samples; settle ±10 ms; overshoot ≤ 1.5%; ζ 0.7/1.1 and r 100 ms rejected; exits 60/80/140/220/320; stiffness/damping values) |
| `tests/tokens/contrast-solver.test.ts`, `tests/a11y/contrast-matrix.test.ts` | REQ-MAT-10/11 (2,160 cells × 3 composites; hand-edited floor fixture fails; unsolvable fixture exits 1; focus bands over 4,096 colours) |
| `tests/tokens/{modes-matrix,emitted-css,legacy-hooks}.test.ts` | REQ-MAT-12, 13, 19 (attribute block + media mirror per value; floors re-emitted in `ag.a11y`; 0 `prefers-contrast: high`; layering; 0 `!important`; specificity) |
| `tests/theme/{presets,createGlassTheme,createBrandTheme,color}.test.ts` | REQ-MAT-14..16 (4 presets, none defines `material.*`; option mapping; pure in a Node worker; 20 brand fixtures) |
| `tests/tokens/{vars-gates,literals-lint,compat-aliases,legacy-freeze,shadcn-interop}.test.ts` | REQ-MAT-17, 18, 20, 21 |
| `tests/material/exports/entries.test.ts`, `tests/types/mat/*.test-d.ts` | REQ-MAT-22, 24, 45 (`@ts-expect-error` on removed props, `as`, `"always-safe"`) |
| `tests/material/{materialProps,Surface,server-safe,useMaterialTier,components,properties,tint-formula,css-contract,lens-maps,dev-warnings,import-side-effects}.test.ts(x)` | REQ-MAT-23..29, 34..36, 38 (40-role table matches the seed rules; no `style` on 36/36 roles; `renderToString` without DOM; 9 lens ids byte-identical; no counter code in production bundle; 0 listeners/timers/DOM mutations on import) |
| `tests/material/gates/{verify-optics-css,count-glass-recipes,verify-material-runtime}.test.ts`, `tests/lint/mat/*.test.ts` (ESLint `RuleTester`, stylelint; one file per rule, `tests/lint/mat/<rule>.test.ts`) | REQ-MAT-18, 35, 39, 51, 57, 64 (valid and invalid fixture per rule and per pattern) |
| `tests/motion/{tokens,css-output,modes,ticker,pointerLight,viewTransition,adapter}.test.ts(x)` | REQ-MAT-42..50 (allowlist; `calm`/`none` scoping; one rAF for N subscribers; dt cap; hidden pause; one listener per document across 10 mounts; `update` runs once on `AbortError`; `toMotionTransition` values; `MotionProvider` mapping; detent projection at ±1,500 px/s; `magnetic` ≤ 8 px) |
| `tests/theme/{resolve,store,usePreference,AuraGlassProvider,portal,LayerStack,announcer,AuraGlassScript,GlassPreferencesPanel}.test.ts(x)` | REQ-MAT-52..60 (1,024 cases; shared MQL; legacy key; single portal root with nested providers; Escape order; coalescing, 7 s clear, ≤ 11 writes per 10 s stream; nonce, no `eval`, ≤ 1.5 KB, engine/tier for Chromium/WebKit/Gecko/unknown UA fixtures; floor-locked options) |
| `tests/a11y/css/{supports-fallback,a11y-css-gate}.test.ts` | REQ-MAT-54, 61 (`@supports not` block; `scripts/mat/verify-a11y-css.mjs`: no `!important`, max specificity, no hand-written floor, no `outline: none` on focus, no host opacity on disabled, selectors keyed on `[data-ag-surface]`) |
| `tests/ssr/mat/a11y/hydration.test.tsx` | 0 hydration warnings for provider + script + every server-safe export |

### 12.2 Browser (remote; Chromium, WebKit, Gecko unless noted)

| File | Lane | Proves |
|---|---|---|
| `tests/e2e/mat/material/{layer-stack,nesting,group,content-materials,optics,clear-fallback,tiers,kill-switches,no-auto-downgrade,responsive}.spec.ts` | L5 | REQ-MAT-26, 28..33, 35, 40 (computed host/pseudo values; 1 filter for a 5-child group; 0 filters on a nested input in a dialog; Fresnel band delta) |
| `tests/e2e/mat/material/enhanced-gating.spec.ts`, `tests/e2e/mat/material/webkit-literal.spec.ts` | L8 | REQ-MAT-34, 36 (enhanced only on Chromium + chrome + refraction + lens-ready; ΔE ≤ 1 on WebKit/Gecko; no text over displacement; CLS 0; WebKit `hf-pattern` variance drop ≥ 40%) |
| `tests/visual/mat/material/environment-matrix.spec.ts` | L6 | Material Lab subjects × 8 scenes × light/dark × glass/tinted/solid × default/more/forced/reduced-motion × tier × 1440/390: not blank, surface separation, material presence, OCR contrast ≥ 4.5 (≥ 7 under more) |
| `tests/visual/mat/tokens/modes-zero-js.spec.ts` | L6 | REQ-MAT-12 (≤ 0.1% pixels vs attribute baseline under 6 emulated preferences) |
| `tests/e2e/mat/motion/{settle,frame-strip,continuous,view-transition-optics,reduced-idle,no-mount-motion,pointer-light}.spec.ts` | L9 | REQ-MAT-42..49: ≥ 3 distinct frames of 12 on entrance (deterministic `currentTime` stepping of `getAnimations()`), settle invariant per subject × engine × 1440/390 × {no-preference, reduce} × {full, calm, none}, 0 library rAF/interval callbacks and 0 running animations 2 s after settle under reduce (URL-filtered registering stack), no transform under reduce, VT optics 0 during and 1 after, 0 infinite animations without `allowContinuous`; artifact `.artifacts/mat/<job>/motion-report.json` |
| `tests/e2e/mat/a11y/{floors,rungs,forced-colors,pixel-modes,prepaint,layer-stack,focus-appearance,target-size,focus-not-obscured,zoom-reflow,text-spacing,color-vision,coverage}.spec.ts`, `tests/visual/mat/a11y/pixel-contrast.spec.ts` | L5/L6 | REQ-MAT-54..65 over `listSubjects()` |
| `tests/a11y/apg/mat/glass-preferences-panel.apg.spec.ts` | L5 | REQ-MAT-60 keys through `apg.keyboard` (S-40): Tab between groups, arrows within radio groups, Home/End and arrows on the range, Space on the switch, floor-locked options focusable and inert; `apg.axe` with `colorContrast: true` |
| `tests/rsc/mat/server-exports.spec.ts` with `canaries/next16/app/mat/{rsc,no-provider}/page.tsx`; `canaries/vite/src/mat/no-motion-peer.page.tsx` | L11 | REQ-MAT-25, 50, 55 (Server Component page builds and hydrates with 0 warnings; no-provider floors; drag components work without `motion`) |
| `tests/perf/browser/mat/material/{material-surfaces,modal-scene,lens}.spec.ts`, `tests/perf/browser/mat/motion/motion-frame-time.spec.ts`, `tests/perf/browser/mat/a11y/preference-toggle.spec.ts` | L10 | §16 runtime budgets via `perf.frames`, `perf.blurredSurfaces`, `perf.settledIdle`; `modal-scene` is MAT's own Material Lab modal story (overlay `Surface` + scrim), not CMP's `Dialog` |

### 12.3 Manual (L13) and review (L14)

`tests/a11y/manual/scripts/mat/*.md` and `tests/a11y/manual/records/mat/*.json` per REQ-MAT-66. `fragments/review/mat.ts` lists the L14 items: specular quality, optical hierarchy, radius rhythm and "reads as one hand" on the six product scenes and the T0 matrix, plus the motion review (specular response, materialization, no bounce).

### 12.4 CI fragment `ci/mat.gitlab-ci.yml`

Follows contract §4.13.4: jobs named `mat:<stage>:<name>`, extending `.mat-base` (`extends: .ag-node`), every job's `rules` test `$AG_SCOPE` (and `$AG_LINE`), never `merge_request_event`, evidence only under `.artifacts/mat/`, `needs` across streams only on `CI_JOBS` names with `optional: true`, no credentials. Each job starts `allow_failure: true`; MAT flips it after its first green run on `next`.

| Job | Stage | Rules | Script | Artifacts (`expire_in` per `EVIDENCE.expireIn`) |
|---|---|---|---|---|
| `mat:build:tokens` (C0 seed, kept) | build | `$AG_LINE == "5x" && $AG_SCOPE != "release"` | `npm run tokens:build` | `dist/tokens/`, `dist/tokens.css`, `dist/compat/tokens.css`, `.artifacts/` (14 days) |
| `mat:test:drift` | test | `$AG_LINE == "5x" && ($AG_SCOPE == "pr" \|\| $AG_SCOPE == "main")` | `npm run tokens:build && git diff --exit-code src/tokens/index.ts src/motion/tokens.generated.ts src/material/css/generated` | `.artifacts/mat/` |
| `mat:test:lens-maps` | test | `$AG_LINE == "5x" && ($AG_SCOPE == "pr" \|\| $AG_SCOPE == "main")` | `node scripts/tokens/lens-maps.mjs --check` | `.artifacts/mat/` |
| `mat:build:bridge` | build | `$AG_LINE == "4x" && ($AG_SCOPE == "pr" \|\| $AG_SCOPE == "main")` | `node scripts/tokens/build.mjs --platform bridge-4x && git diff --exit-code src/material src/styles/v5.css src/styles/preview-v5.css` (regenerates and drift-checks the committed bridge outputs of REQ-MAT-41; `scripts/tokens/**` is MAT on `release/4.x`, row H01) | `.artifacts/mat/` (14 days). Not in `CI_JOBS`, so no other stream's job `needs` it; the 4.x tarball takes the committed outputs |

All gates, unit tests and browser suites run inside QUAL's `qual:certify:l*` jobs through MAT's lane registrations; MAT adds no per-lane job. GPU or physical-device perf cells (L10 GPU profiles) use QUAL's `.ag-gpu`/`.ag-aws-remote` jobs; MAT only marks them `remote: true`.

---

## 13. Storybook requirements

MAT writes stories only in its own paths, with `parameters.ag` (S-41) and no decorators, globals or imports from `.storybook/**`; QUAL's preview applies scenes, preference axes and the Lab frame from `parameters.ag` (globals are the S-20 keys and S-42 scene ids). MDX imports only `.storybook/blocks/index.tsx` (S-51). No story sets `!important`, paints an opaque stage, passes a prop that disables a preference, or uses an animated background.

| Story file | Kind | Content |
|---|---|---|
| `src/material/Material.lab.stories.tsx` | `lab` | title `Material Lab`, exactly in order: Overview, Regular, Clear (over light/media with scrim, and without backdrop: fallback + warning), Identity, Content Raised, Content Sunken, Tiers ("inert on this engine" label off Chromium), Nesting & Groups (collapse, `allowNested`, `SurfaceGroup`, portaled overlay in a nested tree, disabled), Shape & Concentricity, Scroll Edge (soft/hard over `dense-text`), Preferences, Motion |
| `src/material/Material.matrix.stories.tsx` | `matrix` | 4 materials × 3 thicknesses per scene, generated from typed metadata; L6 subject `Surface` |
| `src/material/Material.optics.stories.tsx` | `component` | one story per optic in REQ-MAT-32 (grain, rim only, specular angle sweep, `Environment` image/video) |
| `src/tokens/Tokens.stories.tsx`, `stories/mat/Tokens.mdx` | `component` | tables generated from `dist/tokens/manifest.json` (name, tier, value per mode, swatch); modes matrix; presets light/dark with a `createBrandTheme` playground and contrast report; contrast floors as a text heatmap |
| `src/tokens/InteractionStates.stories.tsx` | `matrix` | `Surface interactive` forced into each REQ-MAT-09 state via `data-*`; flagship rows are QUAL matrix subjects from CMP/SURF metas, not imported here |
| `src/motion/Motion.lab.stories.tsx` | `lab` | Tokens (curves plotted; play only while held), Interactions (one per §4.6 interaction of the archived catalogue that MAT owns: hover, press, enter/exit, materialize, depth, loading, pointer light), View Transitions (debug outline while `--_ag-optics` = 0), Physics (`aura-glass/motion`) |
| `src/a11y/A11y.stories.tsx` | `component` | Rungs (live read-out of effective transparency, contrast, floor and `minRatio`), Floors, FocusRing (8 scenes, `aria-disabled` focus), Targets, LayerStack (Dialog double → Popover → Tooltip → toast region), Announcer, ScrollPadding, ColorVision (Machado matrices, story-only) |
| `src/theme/preferences-panel/GlassPreferencesPanel.stories.tsx` | `component` | Playground, States (default, floor-locked under emulated contrast more, `keys` subsets, dark, RTL), Keyboard |

## 14. Responsive requirements

- Budgets switch by input media, not width: ≤ 6 blurred surfaces at `(hover: hover) and (pointer: fine)`, ≤ 3 at `(pointer: coarse)`; coarse drops `thick` blur to 20 px and grain to ≤ 0.02 (REQ-MAT-40); full-viewport blur only on the scrim.
- Type is fluid only through `clamp()` (320 → 1440 px); text resizes to 200% without loss; spacing is not fluid; density is an explicit axis and never switches by viewport; components use container queries, and only `sys.breakpoint.{sm 640, md 768, lg 1024, xl 1280}` is emitted (for PLAT's Tailwind bridge).
- Targets 24 px fine / 44 px coarse (REQ-MAT-62); hover light and pointer light only under `(hover: hover)`, pointer light also `(pointer: fine)`; on touch, press feedback is the only interaction cue, within one frame of `pointerdown`.
- Lens maps are keyed by size class, not pixels; a refracting surface over 25% of the viewport (for example a full-width bar at 390 px) warns in development and fails the enhanced cell.
- `ScrollEdge` height `clamp(16px, 4vh, 32px)`; concentric inner radius ≥ 0 at every density; sheet travel is relative (`translate: 0 100%`); popups grow from Base UI's `--transform-origin` at every viewport.
- Rung and focus CSS have no viewport or container dependence; no orientation lock; at 320 CSS px width sticky chrome stays ≤ 50% of viewport height (owners collapse it; MAT proves it in `zoom-reflow.spec.ts`).

## 15. Accessibility requirements

| Criterion | Target | REQ |
|---|---|---|
| 1.4.3 / 1.4.6 / 1.4.11 Contrast | solved matrix and rendered pixels: 4.5 / 3 (large, non-text) / 7 under `contrast=more`, over white, black, busy and the 8 scenes | 10, 11, 54, 65 |
| 1.4.1 Use of colour | non-colour cue or ΔE2000 ≥ 10 under 3 simulations | 9, 65 |
| 1.4.4 / 1.4.10 / 1.4.12 | 200%, 320 px reflow, text spacing | 6, 65 |
| 2.2.2 Pause, Stop, Hide | no loop without `allowContinuous`; panel control to turn it off | 46, 60 |
| 2.3.1 / 2.3.3 | no flashing; `calm` removes interaction-triggered transforms | 44, 46 |
| 2.4.7 / 2.4.11 / 2.4.13 | one two-tone ring, never removed, not obscured, AAA appearance by default | 61, 63 |
| 2.5.8 | 24 px, 44 px coarse | 62 |
| 4.1.3 Status messages | one announcer | 58 |
| OS preferences | forced colours, contrast more, reduced transparency, reduced motion are floors no API can lower | 45, 52, 54, 59 |
| Keyboard and APG | LayerStack Escape order and `inert`; `GlassPreferencesPanel` radio/slider/switch keys | 57, 60 |

APCA Lc is published as advisory only. No WCAG 3 claim. Claims in docs are generated from artifacts by PLAT (G-14).

## 16. Performance requirements

Byte budgets are rows in `fragments/size-budgets/mat.ts` (min+gz, never looser than `DEFAULT_CEILINGS`); runtime budgets are rows in `fragments/perf-budgets/mat.ts`, `provisional: true` until the alpha.1 calibration PR, then ratchet down only (D-26, W-2).

| Metric | Budget |
|---|---|
| `aura-glass/material` JS (all value exports, React external) | ≤ 3 KB (`MaterialJs` 3072) |
| `material.css` (structure + ladders + floors + properties + lens selectors) | ≤ 8 KB gz |
| `tokens.css` (modes + shadcn) / preset blocks inside it | ≤ 8 KB / ≤ 2 KB gz |
| `compat/tokens.css` | ≤ 8 KB gz, outside `styles.css` |
| MAT share of `styles.css` (motion CSS ≤ 3.5 KB, `src/a11y/css` ≤ 3 KB) | inside PLAT's 32 KB `styles.css` ceiling |
| Core motion JS (ticker, offscreen, viewTransition, pointerLight, capability) | ≤ 2 KB; adds ≤ 0.5 KB to `{ Button }` and ≤ 1 KB to `{ Dialog }`; 0 bytes of `motion` in either |
| `aura-glass/motion` own code (`motion` external) | ≤ 4 KB |
| `{ AuraGlassProvider, usePreference }` / `GlassPreferencesPanel` | ≤ 4 KB / ≤ 3 KB extra |
| `AuraGlassScript` | ≤ 1.5 KB minified, ≤ 1 ms on mid-tier mobile |
| Grain / lens assets | ≤ 4 KB / 9 maps ≤ 3 KB each, defs + maps ≤ 30 KB |
| Public / private / total custom properties | contract list exactly / ≤ 200 / ≤ 460 in `styles.css` (1,430 today) |
| `tokens:build` incl. contrast solve / all MAT gates | ≤ 20 s (solve ≤ 10 s) / ≤ 30 s on the GitLab runner |
| Standard tier, 6 surfaces, scripted hover + scroll | ≥ 55 fps p50 at 120 Hz desktop; ≥ 50 fps p50 mid-tier mobile with 3 surfaces (4.x: 12–23) |
| Modal scene open/close (MAT's overlay `Surface` + scrim story, OI-MAT-10) | p95 frame ≤ 16.7 ms mid-tier mobile, ≤ 8.3 ms at 120 Hz; 0 long tasks > 50 ms; 0 layout events from the transition; ≥ 55 fps median vs 4.x `glass-modal` 12 fps in the software-raster harness |
| Enhanced, 2 lenses | ≥ 50 fps p50 desktop Chromium; ≤ 2 ms added GPU frame time at p75 |
| Pointer light, 20 buttons | ≤ 0.5 ms scripting per frame; 0 React commits |
| View Transition setup | ≤ 4 ms desktop, ≤ 12 ms mid-tier mobile |
| Idle after settle (`allowContinuous` off) | 0 running animations, 0 library rAF callbacks; 0 ticker callbacks while hidden or offscreen; `will-change` on 0 elements |
| Preference change | ≤ 1 React re-render; attribute write → style recalc ≤ 16 ms with 6 blurred surfaces; scheme toggle ≤ 8 ms, no layout |
| Production material code | 0 long tasks, 0 rAF loops, 1 observer (`useMaterialTier`); CLS 0 from tier, lens or preferences |

---

## 17. Acceptance criteria

Measured on GitLab pipeline artifacts for the stated SHA (D-32).

| ID | Criterion | 4.1 baseline | Target |
|---|---|---|---|
| AC-MAT-01 | `independent-glass-recipes` on the 5.0.0-beta.1 SHA and every later `next`/`main` SHA | ≈ 121 files (9–13 recipes) | **1** |
| AC-MAT-02 | Violations of `no-optics-outside-material`, `verify-optics-css`, `no-raw-design-values` (all streams, stories and tests included); every `fragments/literals-baseline/*.json` | ≈ 1,890 literals | **0** at beta.1 (G-05); no per-file increase on any earlier PR |
| AC-MAT-03 | `tokens:build` twice → `git diff --exit-code`; build time | 4 generators, non-deterministic | identical; ≤ 20 s |
| AC-MAT-04 | Contrast matrix cells below threshold (2,160 cells × 3 composites); recompute diff | not measured | **0**; diff ≤ 0.01; `minRatio` published from `dist/contrast-matrix.json` |
| AC-MAT-05 | Undefined / dead variables in every MAT CSS entry; emitted `--ag-*` outside the contract lists | 153–298 / 753 | **0 / 0 / 0** |
| AC-MAT-06 | `!important`, `prefers-contrast: high`, unlayered rules (except `@property`) in MAT CSS | 200 / 16 | **0 / 0 / 0** |
| AC-MAT-07 | Value exports of `./material`, `./theme`, `./tokens`, `./motion` and `ROOT_EXPORTS.mat` vs `ENTRIES` (G-03) | types ≠ runtime | exact match |
| AC-MAT-08 | Zero-JS page under 6 emulated preferences vs attribute baseline | n/a | ≤ 0.1% changed pixels, 3 engines |
| AC-MAT-09 | `Surface` with no consumer `style`, 36 role combinations | inline optics | **36/36** with no `style` attribute |
| AC-MAT-10 | Visible backdrop filters: 5-control `SurfaceGroup`; input nested in a dialog | per-control | **1**; **0** on the input |
| AC-MAT-11 | `Surface` environment matrix (L6): cells failing not-blank, separation, material presence or OCR contrast | luminance delta 0.881 | **0** |
| AC-MAT-12 | Enhanced: WebKit/Gecko pixels within ΔE2000 ≤ 1 of standard; Chromium text boxes over displacement; CLS | fake refraction | ≥ 99%; **0**; **0** (else `refraction` ships inert and `@preview`, promoted in 5.1, without failing this AC) |
| AC-MAT-13 | Under forced colours, elements with a live backdrop filter, per subject (T0/T1 + Material Lab) | modal 10, showcase 12 | **0** on 100% |
| AC-MAT-14 | Surfaces at ≥ tinted under emulated reduced transparency or contrast more with app and user `transparency="glass"`, JS on and off | not enforced | **100%** |
| AC-MAT-15 | `contrast=more` pixel change inside the largest surface, per subject | 0.000% on 12/12 | **> 0.5%** on 100% |
| AC-MAT-16 | Rendered-pixel text contrast failures, flagships, full §12.2 matrix | 266/342 on black | **0**; worst ≥ 4.5 / 3.0 / 7.0 |
| AC-MAT-17 | Persisted `solid`: frames with blur before hydration, 20 reloads × 3 engines; hydration warnings with provider + script in Next 16 and Vite canaries | n/a | **0 / 0** |
| AC-MAT-18 | Settle invariant across flagship subjects × 3 engines × 2 viewports × 2 OS preferences × 3 modes | invisible content under reduce | **100%** pass |
| AC-MAT-19 | Under reduce: running animations and library rAF/interval callbacks 2 s after settle; with `allowContinuous` off: infinite animations on any story | 43 loops, 95–102 CSS loops | **0 / 0 / 0** |
| AC-MAT-20 | Entrance frames for Button press, Dialog, Menu, Popover open and Tabs morph under no-preference | n/a | ≥ 3 distinct of 12, 3 engines |
| AC-MAT-21 | View Transition optics check (FLIP path where unsupported) | no morphs | pass on every engine |
| AC-MAT-22 | Pointer light: listeners per document; writes per frame; React commits during a 2 s sweep; disabled under calm/none, coarse, tinted/solid, lightweight | n/a | **1 / ≤ 1 / 0**; disabled in all |
| AC-MAT-23 | `src/**` files importing `framer-motion` or `motion` outside `src/motion/public.ts` and `src/motion/adapter/**`; `{ Button }`/`{ Dialog }` bytes of motion runtime | 83 files | **0 / 0** |
| AC-MAT-24 | `[data-ag-portal-root]` count with 4 layer kinds open; stacked Escape | multiple portals | **1**; 3/3 in order with focus restored |
| AC-MAT-25 | Preference detectors / providers / announcers / focus systems in the 5.0 tree | ≥ 10 / 4 / 6 / ≥ 4 | **1 / 1 / 1 / 1** |
| AC-MAT-26 | Focus 2.4.13 failures; focus-not-obscured full coverage; hit areas < 24 (fine) / < 44 (coarse); `focus:outline-none` strings | not measured; 109 | **0 / 0 / 0 / 0 / 0** |
| AC-MAT-27 | Reflow/zoom/text-spacing and colour-vision failures on flagships and the six product surfaces | not measured | **0** outside documented exemptions |
| AC-MAT-28 | QUAL L5 axe (`colorContrast: true`) serious/critical violations on MAT subjects | axe absent | **0** |
| AC-MAT-29 | MAT `SrRecord`s (4 AT cells + touch) for MAT subjects and the reduced-motion pass, no open `fail` (G-09) | issue #16 open | complete |
| AC-MAT-30 | Every §9 row has a `fragments/deprecations/mat.ts` entry that shipped in a published 4.x minor (G-07) and a codemod mapping or fixture that runs clean in L11 (G-08) | none | **100%** |
| AC-MAT-31 | Frozen 4.x fixture on the 4.2/4.3 tarballs without `data-ag-preview` (L11); MAT's colocated preview tests with `data-ag-preview="v5"` set on fixture markup of the six 4.x primitives; `mat:build:bridge` drift | n/a | 0 changed pixels outside the labelled D-28 change; computed `::before` filter and fill equal the `ladders.css` cell for 6/6 primitives; drift 0 |
| AC-MAT-32 | §16 budgets on the alpha.1 calibration and on the GA artifact (G-13) | 49.9 KB `styles.css` | all within budget, no raise after calibration |
| AC-MAT-33 | L14 human review of `fragments/review/mat.ts` items (G-10) | n/a | signed |

## 18. Definition of done

1. REQ-MAT-01..67 implemented; each PR links the test in §12 that fails when the behaviour is reverted (spot-checked by reverting one rule per §5 subsection on a throwaway branch in the remote lane). No skipped, `.only`, constant or snapshot-only test stands in for a pixel claim, and no gate passes by allowlisting MAT's own failures.
2. AC-MAT-01..33 met on the GA candidate SHA in the `qual:certify:release` pipeline; artifacts retained 90 days.
3. Zero `@ag-contract-seed` markers in MAT paths (G-02); every MAT CI job is `allow_failure: false`.
4. API reports in §6 row B22a reviewed and frozen; the API diff classified (C-E additions, C-B list matching `fragments/deprecations/mat.ts`).
5. Material Lab, Motion Lab, A11y and token stories published on GitLab Pages through QUAL's Storybook; MAT guides in `apps/docs/content/mat/` with no unsourced numbers.
6. Budget rows calibrated at alpha.1 and frozen; `.changeset/mat-*.md` written for every user-visible change.
7. No temporary probe scripts, no committed evidence, no `reports/` content.

## 19. Dependencies (frozen contract seams only)

MAT has **no dependency on any other PRD or on any other stream's task**. It consumes these seams, all present at C0 as type modules, seeds, stubs or verbatim files:

| Seam | Used for | Present on day 0 as |
|---|---|---|
| S-31 `ComponentMeta` (type only) | `Surface.meta.ts`, `GlassPreferencesPanel.meta.ts` | `src/contracts/components.ts` |
| S-33 part grammar (`hit-area`, `scroll-edge`) | target CSS, `ScrollEdge` | `src/contracts/components.ts` |
| S-34 `Portal` | portal root | kept 4.x `src/primitives/Portal.tsx` (keep list) |
| S-35 `ENTRIES`, `ROOT_EXPORTS` | barrels, parity tests | `src/contracts/entries.ts` |
| S-37 `cn`, `warnDeprecated` | `Surface`, compat adapters | `src/internal/index.ts` (final at C0) |
| S-38, S-39 | `fragments/deprecations/mat.ts`, `fragments/codemods/mat.ts` | `src/contracts/fragments.ts` |
| S-40, S-41, S-42 | tests, `parameters.ag`, scenes | `tests/helpers/**` seeds; `SCENES`/`SCENE_BACKDROP` constants |
| S-43, S-44, S-45, S-50 | lanes, budgets, CSS/review/baseline fragments, loader | `src/contracts/{testing,fragments}.ts`, `load-fragments.mjs` |
| S-48 | evidence paths `.artifacts/mat/<job-slug>/`, artifact naming, `expire_in` | `EVIDENCE` in `src/contracts/testing.ts` |
| S-49 | `style-dictionary@4.4.0`, `stylelint@17.16.0`, `motion@^12` optional peer (importers `src/motion/public.ts`, `src/motion/adapter/**`) | §4.12 frozen sets in C0 `package.json` |
| S-51 | MDX docs blocks | `.storybook/blocks/index.tsx` seed |
| S-52, S-53 | `tokens:build`, `api:update`, root pipeline, `.ag-*` templates | §4.12 scripts, root `.gitlab-ci.yml` |
| Row group H note (contract §3.2) | PLAT wires MAT's committed bridge files into the 4.x exports map and provider; MAT never edits those PLAT files | the H file paths and the S-01 `data-ag-preview` row |

Release gates (never `depends_on`): G-02, G-03, G-05, G-07, G-09, G-10, G-13 (contract §6.2). Contract PRs MAT proposes (OI-MAT-01..05) are additive and never block MAT work.

## 20. Execution order (parallel internal lanes, disjoint files)

All five lanes start on day 0 in separate worktrees (`../AuraGlass.wt/mat-<lane>/`, branches `next-mat/<lane>-<topic>`, plus `4x-mat/<topic>` for lane B). Each lane codes against the frozen contract and the MAT seeds, so no lane waits for another; an intra-MAT `depends_on` is allowed but only for ordering inside a lane.

| Lane | Files (disjoint) | Delivers | Order inside the lane |
|---|---|---|---|
| **T** Tokens | `tokens/**` (except `compat-alias-map.json` and `legacy/`), `scripts/tokens/**` (except `lens-maps.mjs`), `src/tokens/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`, `stylelint*`, `lint/rules/mat/no-raw-design-values.cjs`, `tests/lint/mat/no-raw-design-values.test.ts`, `fragments/literals-baseline/mat.json`, `tests/tokens/**`, `tests/a11y/contrast-matrix.test.ts`, `tests/visual/mat/tokens/**`, `src/theme/{color,createGlassTheme,createBrandTheme,createBrandGlassTheme,presets,materials}.ts` (`createBrandGlassTheme.ts` is deleted here once its compat adapter exists in lane B), `tests/theme/{presets,createGlassTheme,createBrandTheme,color}.test.ts`, `docs/{motion,design-tokens}.md` (deletion) | REQ-MAT-01..20 | schema + guards → `ref`/`sys` + modes → transforms (spring, material, solver) → gates + literal rule → presets and theme functions |
| **M** Material | `src/material/**` (except `generated/`), `scripts/tokens/lens-maps.mjs`, `scripts/mat/{verify-optics-css,count-glass-recipes,verify-material-runtime}.mjs`, `lint/rules/mat/{no-optics-outside-material,no-inline-glass}.cjs`, `tests/lint/mat/{no-optics-outside-material,no-inline-glass}.test.ts`, `tests/material/**` (except `exports/`), `tests/{e2e,visual,perf/browser}/mat/material/**` | REQ-MAT-23..40 | lint + recipe metric in ratchet mode → structural CSS on the seed ladders → components → tiers and dev counter → enhanced lens |
| **V** Motion | `src/motion/**` (except `tokens.generated.ts`), `scripts/mat/verify-motion-css.mjs`, `lint/rules/mat/motion-*.cjs`, `tests/lint/mat/motion-*.test.ts`, `tests/motion/**`, `tests/{e2e,perf/browser}/mat/motion/**` | REQ-MAT-42..51 | motion CSS + modes → ticker/offscreen → View Transitions + pointer light → `./motion` adapter |
| **P** Preferences and a11y | `src/theme/{index,public,AuraGlassProvider,announcer,portal}.ts(x)`, `src/theme/{preferences,script,layers,preferences-panel}/**`, `src/a11y/**`, `src/hooks/**`, `scripts/mat/{verify-preference-source,verify-a11y-css,build-prepaint-script}.mjs`, `lint/rules/mat/{no-document-escape,no-runtime-contrast}.cjs`, `tests/lint/mat/{no-document-escape,no-runtime-contrast}.test.ts`, `tests/theme/{resolve,store,usePreference,AuraGlassProvider,portal,LayerStack,announcer,AuraGlassScript,GlassPreferencesPanel}.test.ts(x)`, `tests/a11y/{css,contrast}/**`, `tests/{e2e,visual,ssr,perf/browser}/mat/a11y/**`, `tests/a11y/apg/mat/**`, `tests/a11y/manual/{scripts,records}/mat/**` | REQ-MAT-52..66 | resolve + store → provider/portal/LayerStack/announcer → script → rungs, focus, targets → panel → catalogue suites and manual records |
| **B** Bridge and integration | `tokens/compat-alias-map.json`, `tokens/legacy/**`, `src/styles/**` (incl. H02), `src/compat/mat/**`, `src/root/mat.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,playwright,css,review,side-effects,a11y-baseline}/mat*` (+ `mat/**`), `ci/mat.gitlab-ci.yml`, `ci/mat/**`, `etc/api/{material,theme,tokens,motion}.*`, `etc/api/{root,compat}.mat.api.md`, `stories/mat/**`, `apps/docs/content/mat/**`, `canaries/next16/app/mat/**`, `canaries/vite/src/mat/**`, `canaries/<app>/fixtures/mat/**`, `tests/fixtures/consumer-4x/cases/mat/**`, `tests/{rsc,types}/mat/**`, `tests/material/exports/**`, `.changeset/mat-*.md` | REQ-MAT-21, 22, 41, 67; §12.4 | day 0: CI fragment, lane/playwright/css fragments, 4.2 deprecation entries on `release/4.x` → legacy freeze + 4.2 bridge build → compat adapters and codemod fixtures → 4.3 preview + compat tokens → API reports and docs |

Lane-crossing reads only: lane M renders the committed generated ladders (seeded at C0, refreshed by T); lane P mounts `LensDefs` and the surface counter through their stable module paths; lane B registers files the other lanes create (a registration for a missing file reports `pending`, never fails).

## 21. Concurrency statement

- **Provides through the contract:** the material grammar and runtime (S-01, S-02, S-05, S-06), public CSS variables and layers (S-03, S-04), tokens and the manifest (S-10, S-11), motion values and runtime (S-12, S-13), the preference model, provider, script, portal root, panel, LayerStack and announcer (S-20..S-26), the MAT lint rules (S-47) and the `mat:build:tokens` artifact (S-53). Every one of these exists at C0 as a type module or a seed with frozen exports, so CMP, SURF, PLAT and QUAL code and test against them on day 0 and switch to the real implementation without rewiring when MAT removes the seed marker.
- **Consumes through the contract:** see §19. MAT tests against: the kept 4.x `Portal`; QUAL's seed helpers (`renderAg`, `gotoStory`, `listSubjects` falling back to `index.json`, `apg.axe`, `perf.*`); `tests/contract-doubles/cmp/*` for Dialog, Popover, Menu and Tooltip behaviour in LayerStack, motion and portal specs; its own `Surface` stories as subjects until CMP/SURF subjects appear in the `SubjectIndex`; scene ids from `SCENES` (a scene whose asset is absent reports `pending`).
- **Why MAT never waits:** it owns every path it writes (§6); cross-stream behaviour (overlays calling `useLayer`, components rendering `hit-area`, morph owners setting `data-ag-vt-participant`) is specified as a seam rule, proven by MAT's catalogue suites as subjects merge, and reported against the subject's owner; lint rules are `error` only on MAT globs until each stream opts in; 4.x fixes on other domains are PLAT's; codemod transforms are PLAT's code from MAT's specs and fixtures (W-3); deprecation entries ship by release gate G-07, not by dependency; budgets are provisional until the state-triggered calibration (W-2).

## 22. Open items

| Id | Item | Default until decided | Owner |
|---|---|---|---|
| OI-MAT-01 | Additive contract PR: add `data-ag-theme` (preset id) and `data-ag-shadcn-source` (`''`) to `AG_ATTRIBUTES` with setter MAT | preset via the provider's scoped `<style>` (REQ-MAT-14); shadcn one-way (REQ-MAT-20) | MAT (proposer) |
| OI-MAT-02 | Additive contract PR: `MaterialRole.pointerLight?: boolean` and `MaterialAttributes['data-ag-pointer-light']?` so components emit the MAT-setter attribute through `materialProps` | pointer light tested on `Surface` fixtures only | MAT |
| OI-MAT-03 | Additive contract PR: lint rule `motion-single-preference-source` (MAT) and colour/`display`/`overlay` additions to `ANIMATABLE` for colour cross-fades and `allow-discrete` exits | `scripts/mat/verify-preference-source.mjs` gate; colour transitions not used | MAT |
| OI-MAT-04 | Frozen devDependencies lack `ajv`, `postcss` and `@tailwindcss/node` | hand-written validator; CSS gates parse with stylelint's PostCSS via `createRequire` from `stylelint` | MAT (contract PR if the shim proves fragile) |
| OI-MAT-05 | `defineMaterial` (archived REQ-MAT-01, architecture §3.2) is not in the frozen `./material` export list | dropped from 5.0; propose as C-E in 5.1 | MAT |
| OI-MAT-06 | Row A18 places PRD files at `docs/auraglass-5/AURAGLASS_MATERIAL_SYSTEM_PRD.md`; this file is at `docs/auraglass-5/prd/` per the planning task | keep `prd/`; correct A18 or move the file in the next contract PR | PLAT (contract steward) |
| OI-MAT-07 | Floors are the maximum over presets, schemes and variants per key, which can over-tint light presets | keep; a per-scheme row is a later C-I change with a new AC-MAT-04 cell count | MAT |
| OI-MAT-08 | Press `scale` and card hover `translate` rejection (archived SC-38) awaits human confirmation | rejected (no scale/translate on hover or press) | product, at L14 |
| OI-MAT-09 | Live checks not yet run: DTCG 2025.10 version, Style Dictionary 4.4.0 `linear()` handling, the Chromium flag to disable backdrop-filter for REQ-MAT-54's `@supports` browser check, Gecko forced-colours emulation on the GitLab Playwright image, and the browser floors of §11 item 9 | asserted statically until L8 confirms | MAT, recorded in the first L8 run |
| OI-MAT-10 | The §16 Dialog row (≥ 55 fps vs 12 fps `glass-modal`) mixes MAT's material cost with CMP's Dialog markup | MAT's `fragments/perf-budgets/mat.ts` row measures MAT's own modal scene (`modal-scene.spec.ts`: overlay `Surface` + scrim, ≤ 3 live filters by REQ-MAT-31/40), `provisional: true` until alpha.1 calibration; the real `Dialog` row is CMP's own perf fragment row, and an L10 result on CMP's subject is reported against CMP | MAT (own row) |
| OI-MAT-11 | Contract row D03 says `tests/fixtures/consumer-4x/cases/<stream>/**` is authored on `release/4.x`, but §2.4.1 lets non-PLAT streams touch only their fragments, CI fragment and row group H there | MAT authors its cases on `next` (row D03 holds there); a contract PR either adds D03 to the §2.4.1 exception list or moves the authoring note | MAT (proposer), contract steward |
| OD-8 (program) | Replace the org-managed `mirror-to-gitlab` GitHub Action with GitLab pull mirroring so no GitHub Action runs at all and every MAT branch push triggers its pipeline promptly | existing push mirror (main, tags, daily); MAT merges per contract §2.3 | Gurbaksh |

---

## Appendix A. Old REQ → new REQ mapping

Every archived REQ of DS, MAT, MOT and A11Y appears exactly once below. "→ PLAT/CMP/SURF/QUAL" marks a requirement that the contract moved to another stream; MAT keeps only the seam or fixture named.

### A.1 DS (REQ-DS-01..44)

| Old | New | Old | New |
|---|---|---|---|
| DS-01 | 01 | DS-23 | 12 |
| DS-02 | 02 | DS-24 | 13 |
| DS-03, DS-04 | 03 | DS-25 | 14 |
| DS-05, DS-06 | 04 | DS-26, DS-27 | 15 |
| DS-07 | dropped (see A.5) | DS-28, DS-29 | 16 (DS-29 compat half), 67 |
| DS-08, DS-09, DS-10 | 05 | DS-30 | 22 |
| DS-11, DS-12, DS-13 | 06 | DS-31, DS-32 | 17 |
| DS-14, DS-16, DS-18 | 07 | DS-33 | 18 |
| DS-15 | 10 | DS-34, DS-35 | 19 |
| DS-17 | 08 | DS-36 | → PLAT (A.5) |
| DS-19, DS-20 | 09 | DS-37 | 11 |
| DS-21 | 12 | DS-38, DS-39 | → PLAT (A.5) |
| DS-22 | 12 (token half); hand-written 4.x half → PLAT | DS-40 | 20 |
| | | DS-41 | → PLAT (A.5) |
| | | DS-42, DS-43 | 21 |
| | | DS-44 | → PLAT/QUAL (A.5) |

### A.2 MAT (REQ-MAT-01..87, 13a)

| Old | New | Old | New |
|---|---|---|---|
| MAT-01 | 22 (`defineMaterial` dropped, OI-MAT-05) | MAT-45 | 33 |
| MAT-02, MAT-03 | 23 | MAT-46 | 32 |
| MAT-04, MAT-05, MAT-12 | 24 | MAT-47 | 34 |
| MAT-06, MAT-07 | 25 | MAT-48, MAT-49, MAT-53, MAT-56 | 35 |
| MAT-08..MAT-11 | 26 | MAT-50, MAT-51, MAT-57, MAT-58, MAT-59, MAT-74, MAT-81, MAT-86, MAT-87 | 36 |
| MAT-13, MAT-13a | 28 | MAT-52, MAT-72 | 38 |
| MAT-14, MAT-15, MAT-83 | 29 | MAT-54, MAT-55 | 59 |
| MAT-16 | 04, 22 | MAT-60, MAT-61, MAT-62 | 37 |
| MAT-17 | 27 | MAT-63, MAT-64, MAT-65 | 39 |
| MAT-18 | 13 | MAT-66 | 39 (gate); audit-script deletion → PLAT |
| MAT-19 | 19 | MAT-67 | 67 |
| MAT-20 | 41 | MAT-68 | → PLAT (A.5) |
| MAT-21, MAT-22 | 30 | MAT-69 | 21 |
| MAT-23..MAT-28 | 31 | MAT-70, MAT-71 | §16, 23/25 (side-effect test); rows in `fragments/size-budgets/mat.ts` |
| MAT-29..MAT-43 | 32 (MAT-33 also 29; MAT-43 also 31) | MAT-73, MAT-76 | 40 |
| MAT-44 | 42 | MAT-75 | 06 |
| | | MAT-77 | 26, 63 |
| | | MAT-78, MAT-82, MAT-85 | 65 |
| | | MAT-79 | 10 |
| | | MAT-80 | 54 |
| | | MAT-84 | 44 |

### A.3 MOT (REQ-MOT-01..131)

| Old | New | Old | New |
|---|---|---|---|
| MOT-01..MOT-06 | 08 (MOT-02, MOT-03 guards also 02) | MOT-60 | → PLAT `contract-boundary` and dependency allowlist (A.5) |
| MOT-07 | 15 | MOT-61 | 18 |
| MOT-10 | 28 (`--_ag-optics`, `--_ag-press` registered; `--_ag-hover` folded into `--ag-specular`; `--_ag-pointer` stays an unregistered string, set only by REQ-MAT-49) | MOT-62..MOT-67 | 51 (MOT-62 also 42) |
| MOT-11, MOT-12, MOT-13 | 42 | MOT-68 | §12.1 lint tests |
| MOT-14..MOT-18 | 43 | MOT-70..MOT-78 | 44, 46, 48 via §12.2 L9 specs (lane runner is QUAL) |
| MOT-20, MOT-21, MOT-23, MOT-26 | 44 | MOT-80..MOT-84, MOT-87, MOT-88 | 46, 51 (5.0 tree); legacy deletion → PLAT |
| MOT-22, MOT-28, MOT-29, MOT-85, MOT-86 | → PLAT on `release/4.x` (A.5) | MOT-90, MOT-93 | §13 (globals → QUAL S-20/S-42) |
| MOT-24, MOT-25 | 45, 51 | MOT-91 | §13 Motion Lab |
| MOT-27 | 67 (codemod fixtures); 4.x edit → PLAT | MOT-92, MOT-94 | → CMP/SURF (A.5) |
| MOT-30, MOT-31, MOT-32, MOT-35 | 46 | MOT-100, MOT-105 | §14, 43 |
| MOT-33 | 47 | MOT-101, MOT-102 | → CMP (A.5) |
| MOT-34 | dropped (A.5) | MOT-103 | 50 |
| MOT-36..MOT-39 | 48 | MOT-104 | → SURF (A.5) |
| MOT-40, MOT-41, MOT-42, MOT-117 | 49 | MOT-110, MOT-113 | 44, 45 |
| MOT-50..MOT-59 | 50 | MOT-111, MOT-112 | 46, 60 |
| | | MOT-114 | → CMP (A.5) |
| | | MOT-115 | 61 |
| | | MOT-116 | 58 |
| | | MOT-118 | 66 |
| | | MOT-120..MOT-131 | §16 (MOT-131 also 08) |

### A.4 A11Y (REQ-A11Y-01..50)

| Old | New | Old | New |
|---|---|---|---|
| A11Y-01, A11Y-02, A11Y-03, A11Y-07 | 52 (A11Y-03 `high` ban also 12; A11Y-07 formula also 29) | A11Y-28 | 63 |
| A11Y-04, A11Y-06, A11Y-08..A11Y-12, A11Y-13 | 54 (A11Y-13 pair also 10) | A11Y-29, A11Y-30 | 62 |
| A11Y-05 | 19 | A11Y-31 | 55 |
| A11Y-14 | 33 | A11Y-32 | 55, 56 |
| A11Y-15, A11Y-16, A11Y-17 | 10 | A11Y-33, A11Y-34 | 57 |
| A11Y-18 | 11 | A11Y-35, A11Y-36 | 58 |
| A11Y-19 | 65 | A11Y-37 | 59 |
| A11Y-20 | 64 | A11Y-38, A11Y-39 | 60 |
| A11Y-21, A11Y-22, A11Y-23 | 53 | A11Y-40, A11Y-41 | → QUAL (harness) and CMP/SURF (key scripts) (A.5) |
| A11Y-24..A11Y-27 | 61 (A11Y-24 build check also 11) | A11Y-42 | 65 (lane → QUAL L5) |
| | | A11Y-43, A11Y-44 | 66 |
| | | A11Y-45, A11Y-46 | 65 |
| | | A11Y-47 | 67 |
| | | A11Y-48 | → PLAT on `release/4.x` (A.5) |
| | | A11Y-49 | → PLAT G-14 (A.5) |
| | | A11Y-50 | → CMP (A.5) |

### A.5 Deliberately dropped or moved out of MAT

| Old REQ | Disposition | Reason |
|---|---|---|
| DS-07 | moved to PLAT (4.2 rename on `release/4.x`); void on `next` | the 28 private `--ag-*` names live in legacy files; on `next` REQ-MAT-04 already forbids any non-contract `--ag-*` |
| DS-22 (4.x half), A11Y-48, MOT-22, MOT-28, MOT-29, MOT-85, MOT-86 | moved to PLAT | contract §2.4.1: PLAT owns every `release/4.x` path and executes every 4.x fix (cookie consent, `high` → `more`, `ContrastGuard` honesty, Switch shimmer, FPS loops, `MotionFramer`, global `*` blocks) |
| DS-36, DS-38, DS-39, MAT-68 | moved to PLAT | class coverage and `./tailwind.css` are PLAT's (`ENTRIES` owner PLAT, row B22a); the bridge reads the S-11 manifest |
| DS-41, MAT-66 (audit deletion), MOT-80..88 (deletions) | moved to PLAT | legacy quarantine: PLAT deletes `legacy/**` family by family (contract §3.1a); MAT's lint keeps the 5.0 tree clean |
| DS-44 | moved to PLAT/QUAL | Storybook CSS lives in `.storybook/**` (QUAL) and the 4.x move is PLAT's |
| MAT-01 `defineMaterial` | dropped from 5.0 | not in the frozen `./material` export list (OI-MAT-05) |
| MOT-34 | dropped | `AnimatedNumber` has no 5.0 export and no registry owner in contract §3.3; `StatCard` is static |
| MOT-60 | moved to PLAT | the dependency allowlist (`importers` column, §4.12) and `contract-boundary` enforce it |
| MOT-92, MOT-94 | moved to CMP/SURF | `play` functions are story-owner duties under S-41; `ComponentMeta` (S-31) is CMP's schema and has no motion field |
| MOT-101, MOT-102, MOT-114 | moved to CMP | Menu→Sheet presentation, Sheet travel and `inert` on exiting popups belong to the overlay components and the wrapping pattern; MAT supplies the selectors and LayerStack |
| MOT-104 | moved to SURF | parallax lives in `./backdrops` |
| A11Y-40, A11Y-41 | moved to QUAL and CMP/SURF | the APG harness is QUAL's (row D01); key scripts are owned per component; MAT keeps APG scripts only for `GlassPreferencesPanel` |
| A11Y-49 | moved to PLAT | docs-claims gate G-14 |
| A11Y-50 | moved to CMP | contract §3.5 row 59 |
