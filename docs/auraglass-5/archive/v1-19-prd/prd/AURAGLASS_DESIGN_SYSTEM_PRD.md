# AuraGlass 5.0 Design System PRD (tokens, modes, themes, compiler)

| Field | Value |
|---|---|
| Key | DS (task fragment `tasks/DS.json`, ids `DS-NNN`; program key per `_shared-contracts.md` SC-01) |
| PRD id | PRD-03 (architecture §16 file name `PRD-03-token-compiler.md`; this document is the same PRD under the program's `prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` path) |
| Contract registry | `docs/auraglass-5/prd/_shared-contracts.md` is binding. DS owns SC-17 (raw-value lint and literal ratchet), SC-18 (token source tree and generated outputs) and SC-19 (CSS custom-property namespace and compiler), and the `ag.tokens` layer and `compat/tokens.css` contents (SC-20, SC-34). Every other shared artifact is consumed through its owner's anchor task (SC-40) |
| Owner area | Design system: tokens, token compiler, modes, themes/presets, Tailwind and shadcn bridges, CSS-variable gates |
| Status | Draft |
| Target releases | 4.2.0 (compiler emits experimental `aura-glass/material` per D-19; D-28 dark-text fix in generated tokens; the `--glass-opacity-24/32/52/72` fix on the D-28 visual-fix list and the `getPersona*` C-D, both deferred from 4.1.1 by SC-36; the hand-written `prefers-contrast: more` fix is PRD-17's, interim owner REL per SC-37), 4.3.0 (`compat/tokens.css`, C-D on `--glass-*`), 5.0.0 (`--ag-*` only in `styles.css`) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§3.2, §3.6, §4.3–4.5, §5, §7, §8, §10, §12, §13.3, §14, §15, §16); `docs/auraglass-5/autopsy/tokens-theme.md` (TOKENS-THEME-01..16 with adversarial verification); `docs/auraglass-5/autopsy/motion.md` (MOTION-05/-06); `docs/auraglass-5/autopsy/accessibility.md` (ACCESSIBILITY-04); `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md` (TD-06, TD-08); `docs/auraglass-5/component-inventory.json`; `docs/auraglass-5/research/apple-liquid-glass.md`, `research/translucent-a11y-perf.md`, `research/competitors.md` |
| Architecture anchors | PRD-03, §5 (token taxonomy), D-06 (variant `regular | clear | identity`; `solid` reserved for transparency), D-07 (thickness public, no Elevation axis), D-24 (layers, zero `!important`) |
| Related decisions | D-04, D-10, D-11, D-12, D-18, D-19, D-25, D-26, D-27, D-28, D-29, D-31, D-32 |
| Upstream | PRD-PKG (PRD-02: build/packaging, exports manifest PKG-005, size budgets PKG-048/049, dependency allowlist PKG-056, lint wiring PKG-015, `src/styles/index.css` PKG-101) |
| Downstream | PRD-MAT (PRD-04: consumes `MaterialSpec` and the generated material CSS), PRD-A11Y (PRD-05: a11y rungs, `AuraGlassProvider`/`AuraGlassScript`), PRD-MOT (PRD-06: motion token values), PRD-REL (interim owner of §16 PRD-17, the 4.2/4.3 bridge), PRD-DX (§16 PRD-18/20: `css-vars` codemod, registry `cssVars`, token docs), PRD-QA (§16 PRD-19: L1 Static and L4 Token contrast lanes), PRD-SB (Storybook preview and Lab) |

PRD numbering. This document cites other PRDs by architecture §16 id. Map them through SC-01: PRD-00 = TRUST, PRD-01 = REL, PRD-02 = PKG, PRD-04 = MAT, PRD-05 = A11Y, PRD-06 = MOT, PRD-07/14/16 = FND, PRD-08 = CTL, PRD-09 = OVL, PRD-10 = NAV, PRD-11 = DATA, PRD-12 = AI, PRD-13 = MED, PRD-17 = REL (interim, SC-37), PRD-18/20 = DX, PRD-19 = QA (certification) and SB (Storybook/Lab harness). Task `depends_on` entries use task ids only (SC-40).

Finding-ID note. The architecture (§5.1) and `AURAGLASS_CURRENT_STATE_AUTOPSY.md:301-306` use a renumbered TOKENS-THEME series (dead-var count = "-09", types-vs-runtime = "-10"). The per-domain report `autopsy/tokens-theme.md` numbers the same facts differently (types-vs-runtime = TOKENS-THEME-08, slash utilities = -09, undefined opacity tokens = -10). This PRD cites the **per-domain report's IDs** because they carry the verification verdicts, and gives the summary ID in brackets where they differ.

---

## 1. Problem

AuraGlass 4.1.0 has no design system in the engineering sense. It has about eight parallel token sources and four generators. Four of them call themselves canonical (`src/tokens/glass.ts:4` "SINGLE SOURCE OF TRUTH", `scripts/build-tokens.js:46` "Source: tokens/personas/*.json", `docs/design-tokens.md:9` "canonical source ... `src/theme/designMatrix.ts`", `scripts/generate-glass-css-simple.js:7` "values below MUST mirror AURA_GLASS"). Their values disagree: radius "md" has five values (6, 8, 10, 12, 16 px), primary has four, motion "normal" has five (200/220/250/300/320 ms), and neutral text on glass is slate in TS/JSON but white in generated CSS (TOKENS-THEME-01, -04, CONFIRMED).

Most of the output is dead. 571 of 621 generated `--aura-*` variables are never read, 57–58 of 73–74 persona variables are unread, and 16 of the 17 Theme Engine 2.0 variables have zero consumers (TOKENS-THEME-03, -05, -06, CONFIRMED). The shipped `dist/styles/index.css` defines about 1,430 custom properties in 15+ namespaces, and 753 of 1,374 analysed are dead while 153–298 are referenced but undefined (TD-08). An undefined `var()` with no fallback invalidates the whole declaration, so `backdrop-filter` rules silently vanish (TOKENS-THEME-10 per-domain, `GlassTransitions.tsx:410,867,869`).

The material itself is mode-blind. One white-frost recipe with blur 16–48 px and a fixed `saturate(1.4)` is applied to every intent and elevation (`src/tokens/glass.ts:995-1001`, `:1030`; TOKENS-THEME-02, -13). Light mode, high contrast and reduced transparency are patched afterwards with about 10 competing selector hooks (`data-theme`, `data-aura-theme`, `data-aura-mode`, `data-persona`, `data-bg`, `.glass-on-light`, `.dark`, …) and 200 `!important` declarations in `src/styles/**` (257 package-wide per architecture §10). There is no `@layer`, no OKLCH, no `light-dark()` and no `@property` (TOKENS-THEME §5). The 10 personas are dark-canvas accent swaps over one shared glass surface (TOKENS-THEME-05). `aura-glass/tokens` types declare `getPersona` and `getPersonaModeTokens`, which the runtime does not export (TOKENS-THEME-08). The token lint scans 37 CSS files and skips 17 directories while 180 of 415 production TSX files carry raw color or blur literals (TOKENS-THEME-07, PARTIAL: the ESLint `no-inline-glass` rule exists but is not respected).

Consequences for 5.0: the material engine (PRD-04) cannot be built on a source that does not exist; the contrast guarantee (§7.3) needs solved floors that only a compiler can produce; the Tailwind and shadcn interop promised in §5.5 has no generated bridge; and every consumer theming attempt today writes variables nothing reads.

This PRD defines the single DTCG token tree, the Style Dictionary 4 compiler with three custom transforms, the five-axis mode matrix, the token groups (material, elevation, motion, interaction, environment, shape, density, color, typography, spacing), the theme/preset model that replaces personas, `createGlassTheme`/`createBrandTheme`, the Tailwind v4 bridge and shadcn aliases, the dead/undefined CSS variable gates, and the retirement of the eight legacy sources.

Out of scope: the CSS layer stack and nesting rules of the material (PRD-04), the a11y rung CSS, preference store and the contrast-matrix contract (pairs, thresholds, busy reference: PRD-05 REQ-A11Y-15..18; this PRD implements the solver and supplies tokens and solved floors), motion values, motion-mode CSS, runtime and View Transitions (PRD-06; this PRD compiles duration/ease/spring tokens), package-wide CSS gates for layer order, `!important`, global selectors, class coverage, Storybook CSS and Tailwind strings (PRD-02 REQ-PKG-90..97), the 4.x hand-written `prefers-contrast` fixes (PRD-17), codemod implementation (PRD-18; this PRD supplies the alias map), and `registry/**` (PRD-18).

---

## 2. Evidence from the current codebase

All paths verified with `rg --files` on HEAD 15b6de6f7. Verdicts are from the adversarial section of `autopsy/tokens-theme.md`; PARTIAL findings are cited only for their confirmed part.

### 2.1 The eight token sources and four generators to retire

| # | Source | Size | What it claims / does | Evidence |
|---|---|---|---|---|
| S1 | `tokens/personas/default.json` + `tokens/index.json` + `tokens/schema.json` → `scripts/build-tokens.js` | 1,145 + 30 + 377 lines | "canonical" JSON; emits 621 `--aura-*` vars, Tailwind/UnoCSS presets, ESM/CJS, TS types | `build-tokens.js:46`, `:534-559`; `schema.json` never validated; `index.json` `liquidGlassSystem` unread (TOKENS-THEME-16, CONFIRMED part) |
| S2 | `src/tokens/glass.ts` | 1,645 lines | "SINGLE SOURCE OF TRUTH"; `AURA_GLASS` 30 surface specs, `PERFORMANCE_TIERS`, `LIQUID_GLASS` | `glass.ts:4`; `buildSurfaceStyles` hard-codes fill/border `:995-1001`, `:1030` (TOKENS-THEME-02); `blurMultiplier` 1.0 on every tier `:875-898` (TOKENS-THEME-13) |
| S3 | `src/tokens/designConstants.ts` | 347 lines | `ANIMATION`, `COLORS`, `BORDER_RADIUS`, `BOX_SHADOW` (Tailwind v2 values) | `:18` normal 300 ms, `:190` radius md 6 px, `:199-210` shadows; module-load side effect `:3,316` |
| S4 | `src/tokens/themeTokens.ts` | 542 lines | `lightTheme`, `darkTheme`, `glassTheme` | one consumer, `components/advanced/IntelligentColorSystem.tsx` |
| S5 | `src/tokens/generated.ts` | 1,281 lines | JSON mirrored into TS; `:60` primary #6366f1, `:180` normal 250 ms | MOTION-05 verification |
| S6 | `scripts/generate-glass-css-simple.js` → `src/styles/glass.generated.css` | 1,012 lines | hand-copied constants; neutral/success text forced white | `generate-glass-css-simple.js:7`; `glass.generated.css:33,195,502,672` (TOKENS-THEME-04) |
| S7 | `src/theme/designMatrix.ts` → `scripts/generate-persona-css.ts` → `src/styles/generated/persona-variables.css` | 1,043 / 769 lines | 10 personas × ~74 vars, all dark canvases, one shared `PERSONA_GLASS_SURFACE` | `designMatrix.ts:100,132..971` (TOKENS-THEME-05) |
| S8 | Theme Engine 2.0: `src/theme/createGlassTheme.ts`, `src/theme/materials.ts`, `src/theme/GlassThemeProvider.tsx`, `src/theme/tokens.ts` | 226 / 69 / 145 / 86 lines | 17 `--glass-theme-*` vars, 16 with zero consumers; `system` resolves to dark | `createGlassTheme.ts:128,206-226`; `GlassThemeProvider.tsx:36,55-57` (TOKENS-THEME-06) |
| (S9) | Hand CSS layers: `src/styles/tokens.css` 420, `variables.css` 854, `themes/light.css` 205, `themes/dark.css` 210, `design-tokens.css` 300, `typography.css` 167, `glass.css` 4,605 | | the `--glass-*` primitives actually painted | `tokens.css:40-45` blur 16/24/32/40/48/48; `:60` radius md 16 px; `themes/light.css:5` `:root:not([data-theme="dark"])` |

Generators: `scripts/build-tokens.js`, `scripts/generate-glass-css-simple.js`, `scripts/generate-persona-css.ts` (+ `generate-persona-css-runner.js`), `scripts/generate-glass-css-from-tokens.ts`. The autopsy counts "about 8–9" sources (`AURAGLASS_CURRENT_STATE_AUTOPSY.md:221`); S9 is counted as the eighth when S5 is treated as a mirror of S1. Either way all of them are retired.

### 2.2 Value drift (TOKENS-THEME-01, CONFIRMED)

| Token | Values in tree |
|---|---|
| radius md | 16 px (`src/styles/tokens.css:60`, `src/tokens/glass.ts:856`), 8 px (`src/styles/variables.css:79`), 6 px (`designConstants.ts:190`), 12 px (`createGlassTheme.ts:81`, `docs/design-tokens.md:250`), 10 px persona panel |
| primary | `hsl(217 91% 60%)` (`tokens.css:7`), #6366f1 (`generated.ts:60`), #4FD6FF (`designMatrix.ts:139`), #7dd3fc (`createGlassTheme.ts:123`) |
| duration normal | 200 (`glass.ts:850`), 220 (`createGlassTheme.ts:114`), 250 (`tokens.css:110`), 300 (`designConstants.ts:18`) ms |
| ease standard | `cubic-bezier(0.2,0.8,0.2,1)` (`createGlassTheme.ts:115`) vs `cubic-bezier(0.2,0,0,1)` (`tokens.css:119`) |
| tier taxonomy | `auto/low/medium/high` (`glass.ts:29`), `ultra/high/balanced/efficient` (JSON), `ultra/high/medium/low/minimal` (`ThemeProvider.tsx:19`) |
| density | `createGlassTheme.ts:72-91` (compact/comfortable/spacious), `LIQUID_GLASS.system.density`, `concentric.inset`; `data-density` used 0 times in CSS |

### 2.3 Dead, undefined and colliding variables

- 571 of 621 `--aura-*` unread, including all 490 `--aura-glass-{intent}-{level}-*` (TOKENS-THEME-03, CONFIRMED).
- 753 of 1,374 variables in the shipped namespace unused; 153–298 undefined (TD-08; summary ID TOKENS-THEME-09, PARTIAL because some "conflicts" are intentional overrides).
- `--glass-opacity-24/32/52/72` are referenced without fallback and defined nowhere (`components/animations/GlassTransitions.tsx:410,867,869`, `AdvancedAnimations.tsx:255`; TOKENS-THEME-10, CONFIRMED).
- Slash utilities (`glass-text-primary/80` in `navigation/GlassBreadcrumb.tsx:262`; `glass-border-glass-border/20` 122× in 55 non-story files) have no selector (TOKENS-THEME-09, CONFIRMED for these examples; the summary total of 70 classes / 324 uses was not recounted by the verifier and "70" undercounts).
- Contrast outputs written by `src/utils/contrastGuard.ts:741-763` (`--glass-surface-opacity`, `--glass-adaptive-*`) have no CSS reader (ACCESSIBILITY-04, CONFIRMED).
- `--glass-theme-text` has 151 definitions with 20 distinct values across `src` (TOKENS-THEME-04 verification).
- **Namespace collision (new finding, verified with `rg -o -- "--ag-[a-z0-9-]+" src`):** 28 distinct `--ag-*` names are already used privately in 8 files: `src/components/marketing/marketing.css`, `AuroraBackground.tsx`, `AuroraOrb.tsx` (+ `AuroraOrb.test.tsx`), `LogoMark.tsx` (`--ag-aurora-a..d`, `--ag-tilt-x/y`, `--ag-marketing-*`, `--ag-card-radius`, `--ag-orb-size`, `--ag-logo-size`, `--ag-particle-*`, `--ag-display-*-size`, `--ag-feature-visual-min-height`) and `src/components/navigation/GlassTabBar.module.css`, `src/components/navigation/styled.tsx` (`--ag-tabbar-blur`, `--ag-selector-blur`). These collide with the 5.0 semver-stable `--ag-*` namespace (§4.4).
- Existing partial gates to subsume: `scripts/ci/check-undefined-custom-props.mjs` (per-entry undefined-var check, `npm run verify:css-vars`), `scripts/ci/audit-css-var-coverage.js`, `scripts/ci/token-lint.js` (`lint:tokens`; `:305-331` scope gap).

### 2.4 Modes, themes and APIs

- Seven-plus mode signals; `ThemeProvider.tsx:753-777` writes four at once (TOKENS-THEME §4).
- `prefers-contrast: high` (should be `more`) in `src/styles/glass.css`, `animations.css`, `premium-typography.css`, `theme-transitions.css`, `components/accessibility/GlassFocusIndicators.css` (verified `rg`, 1 hit each), plus `matchMedia('(prefers-contrast: high)')` strings in `src/utils/a11y.ts`, `src/hooks/useAccessibilitySettings.ts`, `src/hooks/useAccessibility.ts`, `src/components/accessibility/AccessibilityProvider.tsx`, `src/core/productionCore.ts` (16–17 sites total per the accessibility PRD §2.4). `theme-transitions.css:52-54` nests `forced-colors: active;` as a declaration (invalid CSS; TOKENS-THEME-11 CONFIRMED part).
- Reduced transparency is a 14-selector allow-list (`glass.css:4022-4052`), absent for `.glass-{intent}-level{n}` and inline `createGlassStyle` (one-shot `matchMedia`, `core/mixins/glassMixins.ts:241,275`).
- Duplicate APIs: two `GlassThemeProvider` (`theme/GlassThemeProvider.tsx:47`, alias `theme/ThemeProvider.tsx:1606`), two `useGlassTheme` (`theme/GlassThemeProvider.tsx:131`, `hooks/useGlassTheme.ts:5`), `contexts/MotionPreferenceContext.tsx`, `contexts/AnimationContext.tsx` (TOKENS-THEME-14, CONFIRMED).
- `aura-glass/tokens` types declare `getPersona`/`getPersonaModeTokens` (`dist/tokens/generated.d.ts:1231-1232`) but `dist/tokens/index.mjs` does not export them (TOKENS-THEME-08, CONFIRMED).
- `createBrandGlassTheme` mixes the brand with a hard-coded `#c084fc` in sRGB hex (`createGlassTheme.ts:193-204`); `src/theme/createBrandGlassTheme.ts` is a 4-line re-export.
- Storybook CSS ships in the package: `src/styles/index.css:24-25` imports `storybook-enhancements.css` and `storybook-utility-shim.css` (TOKENS-THEME-12, CONFIRMED).
- Tailwind export ships hex `var()` colors with no opacity-modifier support and `rounded-md` 0.5 rem vs rendered 16 px (TOKENS-THEME §4). `tailwind-merge@^3.3.1` is a dependency (architecture §3.4 drops it).
- Keep list (autopsy §3): the build-pipeline shape (`build-tokens.js:95-114`), the persona/material guard (`generate-persona-css.ts:51-60`), contrast math in `src/theme/color.ts`, the `createGlassTheme` call shape (`createGlassTheme.ts:13-15,62-70`), `LIQUID_GLASS.system` vocabulary (scroll-edge, concentric inset, clear dimming, illumination per state), and the `@supports`/reduced-transparency fallback block (`glass.css:4022-4123`).

### 2.5 Inventory rows in scope (`component-inventory.json`)

`ContrastGuard` REPLACE (token-level contrast contract); `PersonaPicker` POLISH (overridden: see §9, presets replace personas); `GlassThemeSwitcher` REDESIGN; `GlassColorSchemeGenerator` DEPRECATE (docs playground); `GlassThemeDemo`, `ThemedGlassComponents`, `BrandColorIntegration`, `AIGlassThemeProvider`, `AdaptiveGlassDensity` REMOVE.

---

## 3. Desired end state

At 5.0.0 GA:

1. **One source.** `tokens/**/*.tokens.json` (W3C DTCG 2025.10 format: `$value`, `$type`, `$description`, `$extensions`) is the only place a design value is authored. No TS, CSS or JSON file outside `tokens/` and the compiler output contains a design value. S1–S9 are deleted from `main` (S9 survives only as `compat/tokens.css` aliases until 6.0).
2. **One compiler.** `npm run build:tokens` runs Style Dictionary 4 (pinned exact, devDependency only, never a runtime dependency) with three custom transforms: `glass-material`, `motion-spring` and `contrast-solve`. Output is deterministic byte-for-byte; running it twice yields no diff.
3. **One runtime namespace.** Public `--ag-*` (semver-stable, listed in the API report) and private `--_ag-*`. No `--glass-*`, `--aura-*`, `--persona-*`, `--glass-theme-*`, `--liquid-*`, `--gm-*` or `--grad-*` in `styles.css`. The marketing `--ag-aurora-*`/`--ag-tilt-*` vars are renamed to `--_ag-*` or registered as public.
4. **Four tiers** `ref` (private) → `sys` (public, mode-resolved) → `material` (public composite) → `comp` (optional, narrow), with a lint that forbids skipping tiers (`material` references only `sys`; components reference `sys`, `material` and `comp` only).
5. **Five orthogonal mode axes** (scheme, contrast, transparency, motion, density), each emitted as a `[data-ag-*]` block and mirrored by its media query, working with zero JS. Leaf colours use `light-dark()`. All colour in OKLCH.
6. **Solved, not chosen, contrast.** Every material opacity floor is the minimum alpha that passes the three-composite gate (§7.3) for every preset × scheme × contrast × transparency × variant × thickness × backdrop. The solved table is committed as generated output and diffed in review.
7. **Themes are canvases, not glass.** 4–6 `ThemePreset`s, each with light and dark canvases. `createGlassTheme` keeps its typed call shape and now produces only `ref`/`sys` overrides that real components read. `createBrandTheme(oklch)` derives the accent ramp with relative colour syntax. Brands and presets cannot override `material`.
8. **Interop without coupling.** `aura-glass/tailwind.css` is a generated Tailwind v4 bridge (`@theme inline`, `@utility glass-*`, `@custom-variant ag-*`). shadcn interchange variables are read if present and emitted in `tokens.css`. The library itself ships no Tailwind class strings and does not depend on `tailwind-merge`.
9. **Gates fail closed.** CI fails on: any undefined `--ag-*` reference; any public `--ag-*` with zero consumers that is not marked `$extensions["ag.public"] = true`; any raw colour/blur/shadow/duration literal in `src/**` (ratcheted to 0 by 5.0.0-beta.1); TS types ≠ runtime exports; any contrast-matrix failure. The `!important`, layer and class-coverage gates are PRD-02's and also apply to this PRD's output.
10. **CSS layering** `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` with all token output in `ag.tokens`, zero `!important`, no `:root` dumps outside `ag.tokens`, no global element selectors.

---

## 4. Architecture

### 4.1 Source layout (all NEW)

```
tokens/
  $schema.json                         # DTCG + ag extensions schema (replaces tokens/schema.json)
  ref/color.tokens.json                # OKLCH ramps: slate.1..12, accent ramps, danger/warning/success ramps
  ref/dimension.tokens.json            # space 4pt scale, radius ladder, blur ladder, type sizes
  ref/time.tokens.json                 # duration ladder, cubic-bezier set, springs (ζ, ω)
  sys/color.tokens.json                # canvas, on-surface, on-surface-muted, accent, on-accent, border, focus-*, specular, danger, warning, success
  sys/type.tokens.json                 # display, title-1..3, body (fluid 15–17px), callout, caption, label, mono
  sys/space.tokens.json                # space.0..12, target.min/coarse
  sys/shape.tokens.json                # radius xs..full, concentric formula
  sys/motion.tokens.json               # duration.*, ease.*, spring.* (values per PRD-06 §4.2; see note below)
  sys/interaction.tokens.json          # state.* deltas
  sys/environment.tokens.json          # light.angle, light.specular, backdrop.*, scrim.clear, scrim.media
  sys/elevation.tokens.json            # shadow.{layer}.{thin,regular,thick} × scheme, layer.z.*
  sys/app-shell.tokens.json            # app-shell dimensions; values supplied by PRD-NAV (SC-18 row request, was NAV-009)
  sys/breakpoint.tokens.json           # sm/md/lg/xl, read only by the Tailwind bridge (§14)
  material/material.tokens.json        # $type glass-material: MaterialSpec (§4.3)
  comp/*.tokens.json                   # optional narrow component tokens
  contrast/busy-reference.json         # 9 sRGB busy samples (contract: accessibility PRD REQ-A11Y-15)
  modes/{scheme,contrast,transparency,density}.tokens.json   # per-axis overrides (motion modes are CSS rules owned by PRD-06)
  presets/{aura,graphite,daylight,midnight}.tokens.json             # canvas + accent only
scripts/tokens/
  build.mjs                            # Style Dictionary 4 entry (replaces scripts/build-tokens.js)
  transforms/glass-material.mjs
  transforms/motion-spring.mjs
  transforms/contrast-solve.mjs
  formats/css-layered.mjs              # @layer ag.tokens, [data-ag-*] blocks + media mirrors
  formats/property-registry.mjs        # @property rules
  formats/tailwind-bridge.mjs
  formats/registry-cssvars.mjs
  formats/ts-constants.mjs
  gates/{dead-vars,undefined-vars,literals,types-runtime,tier-skip}.mjs
```

Path ownership (SC-18, binding). This PRD owns the tree layout (architecture §16, PRD-03 boundary "DTCG tree"), the compiler and every generated output. No other PRD creates files under `tokens/`; they submit values as row requests that DS tasks land, and they edit values only by MODIFY on the DS-created file:
- Motion: the source is `tokens/sys/motion.tokens.json` (DS-026). PRD-MOT owns the values in MOT §4.2 and changes them by values-only MODIFY (MOT-020, depending on DS-026). `src/motion/tokens.generated.ts` (`motionTokens`, the shape in PRD-06 §4.3) is generated by DS-053; MOT does not hand-write it (MOT-024 is dropped).
- Contrast references: `tokens/contrast/busy-reference.json` is DS-033 (A11Y-001 is a consumer test). A11Y owns the contract values (REQ-A11Y-15) and the machine-readable matrix contract `tests/a11y/contrast/matrix-contract.json` (A11Y-002), which lives outside `tokens/`.
- App shell: `tokens/sys/app-shell.tokens.json` is created by DS-120 from PRD-NAV's values (NAV-009 is the row request).
- `src/theme/createGlassTheme.ts` belongs to DS (DS-083); MOT-026 applies the REQ-MOT-07 motion mapping as a MODIFY that depends on DS-083.

### 4.2 Compiler pipeline

1. **Validate**: load all `tokens/**/*.tokens.json`, validate against `tokens/$schema.json` with `ajv` (devDependency). Reject unknown `$type`, unresolved aliases, cycles, `ref` referenced from components, `material` referencing anything other than `sys`, and presets defining any `material.*` key (the `generate-persona-css.ts:51-60` invariant, generalised).
2. **Resolve modes**: expand the axis matrix. scheme {light, dark} × contrast {standard, more} × transparency {glass, tinted, solid} × density {compact, regular, spacious}. Motion modes are not token overrides: durations are identical in every motion mode and the `calm`/`none` behaviour is CSS owned by PRD-06 (`src/motion/css/motion-modes.css`, REQ-MOT-20/-21). Presets multiply the colour axis only.
3. **Transforms**:
   - `glass-material`: flattens `MaterialSpec` into `--_ag-*` per `[variant][thickness]`, emits literal `-webkit-backdrop-filter` values per `[variant][thickness][tier]` (about 18 rules, §4.3 of the architecture; dropped C-I if the WebKit lane proves `var()` works), and emits the TS `MaterialSpec` constant.
   - `motion-spring`: implements the PRD-06 §4.3 contract exactly (REQ-MOT-04 is owned here): input `{ dampingRatio: ζ, response: <ms> }`; ω₀ = 2π / r; sample the unit step response until |1 − x| < 0.001 and |x'| < 0.001·ω₀ for 50 ms; Ramer–Douglas–Peucker reduction (tolerance 0.002), ≤ 40 stops, values to 4 decimals; emit `--ag-spring-<name>` (`linear()`), `--ag-spring-<name>-duration` (settle rounded up to 10 ms) and an `@supports not (transition-timing-function: linear(0, 1))` fallback to `--ag-ease-emphasized-decelerate`. Rejects ζ < 0.8, ζ > 1.0 or response outside 120–800 ms (REQ-MOT-03; underdamped defaults are deleted per MOTION-06/§5.3).
   - `contrast-solve`: implements the accessibility PRD contract (REQ-A11Y-15..17). For each cell, searches the minimum tint alpha in 0.005 steps from 0 to 1 such that every pair in REQ-A11Y-16 passes (`on-surface` ≥ 4.5:1; `on-surface-muted` ≥ 4.5:1, or ≥ 3:1 when the token carries `$extensions.ag.usage: "large-only"`; non-text including focus bands and `border` ≥ 3:1; disabled pair ≥ 3:1; every text pair ≥ 7:1 under `contrast=more`) over three composites: `#ffffff`, `#000000` and busy (minimum over the 9 samples in `tokens/contrast/busy-reference.json`). Blur contributes nothing. If no alpha ≤ 1 passes, the build exits 1 naming the cell and pair. Contrast maths uses `src/theme/color.ts` (kept, extended to OKLCH → sRGB conversion with gamut mapping); WCAG 2.2 relative luminance; APCA Lc emitted as advisory only. Writes `tokens/generated/opacity-floors.json` and `dist/contrast-matrix.json` (per-cell `floorAlpha`, `minRatio`, APCA advisory) consumed by PRD-05.
4. **Formats** (CSS under `dist/css/` per PRD-02 §4 placement, plus the committed generated files listed in §8):
   - `dist/css/tokens.css`: `@layer ag.tokens { :root{…} [data-ag-scheme=dark]{…} @media (prefers-color-scheme: dark){ :root:not([data-ag-scheme]){…} } … [data-ag-theme=<preset>]{…} }` (preset blocks included; PRD-02's CSS list has no `presets.css`).
   - Material: `src/material/css/generated/ladders.css`, `src/material/css/generated/floors.css` and `src/material/css/generated/properties.css` (the `@property` registry for `--ag-light-angle`, `--ag-specular`, `--ag-glass-opacity` and the private `--_ag-*` listed in architecture §4.4). PRD-04 owns `src/material/css/material.css`, which imports them and assembles `dist/css/material.css` (file table in `AURAGLASS_MATERIAL_ENGINE_PRD.md` §4).
   - `dist/css/tailwind.css`: §4.6 below.
   - TS: `src/tokens/generated/tokens.ts` (typed names → `var()` strings, no raw values except in `materialSpec` for docs/tests), `tokens.d.ts`, `manifest.json` (every public var, its tier, group, modes, consumers count), and `src/motion/tokens.generated.ts` for PRD-06. No flat `tokens.json` artifact is emitted or exported: there is no `./tokens.json`, `./tokens/json` or `./tokens/manifest` export entry (SC-12); the manifest is read through `aura-glass/tokens` (`manifest`).
   - Registry fragment: `dist/tokens/registry-cssvars.json` (`cssVars.{theme,light,dark}` in the shadcn CLI v4 schema). PRD-DX owns `registry/**` (DX-067) and copies it into its `registry:base` item (DX-068).
5. **Gates**: run §5.9 gates against `dist/` and `src/`.

### 4.3 Token groups (names are normative; values are the initial targets from architecture §5.3)

| Group | DTCG path → CSS var | Initial values |
|---|---|---|
| Color (sys) | `sys.color.canvas` → `--ag-color-canvas`, `on-surface` → `--ag-on-surface`, `on-surface-muted` → `--ag-on-surface-muted`, `accent`, `on-accent`, `border`, `focus-inner` → `--ag-focus-inner`, `focus-outer` → `--ag-focus-outer`, `specular`, `danger`, `warning`, `success` | OKLCH `light-dark()` pairs; navy-text bug fixed (dark `on-surface` L ≥ 0.92) |
| Typography | `sys.type.{display,title-1,title-2,title-3,body,callout,caption,label,mono}.{size,line-height,weight,tracking}` → `--ag-type-<role>-<prop>` | body `clamp(15px, 0.9rem + 0.2vw, 17px)`; on-glass weight bump `+50` via `--ag-type-on-glass-weight-delta`; system font stack default (D-31) |
| Spacing | `sys.space.{0..12}` → `--ag-space-<n>` | 4 pt base: 0,2,4,6,8,12,16,20,24,32,40,48,64 px, × density multiplier |
| Shape | `sys.radius.{xs,sm,md,lg,xl,full}` → `--ag-radius-*`; `--ag-radius-outer`, `--ag-inset`, `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))` | 6, 10, 14, 20, 28, 9999 px |
| Material | `material.*` (`$type: glass-material`) | blur thin 12 / regular 20 / thick 32 px (cap 32); saturation 1.6; grain 0.02–0.04; scrim.clearOverBright 0.35; fallbackFill alpha ≥ 0.85 |
| Elevation | `sys.shadow.{chrome,overlay,transient,content}.{thin,regular,thick}` (ambient + key, × scheme) → `--_ag-shadow-*`, derived from layer × thickness (D-07); `sys.layer.z.{content,chrome,overlay,transient,toast}` → `--ag-z-*` | no public Elevation axis (D-07) |
| Motion | `sys.duration.{instant,micro,small,medium,large}` → `--ag-duration-*`; exits `--ag-duration-<n>-exit` = 0.7 × entry rounded to 10 ms; `sys.duration.ambient` → `--ag-duration-ambient` (accepted addition, SC-19; value and row owned by PRD-MOT, used only by ambient loops gated by `allowContinuous`); `sys.ease.{standard,emphasized,emphasized-decelerate,accelerate}` → `--ag-ease-*`; `sys.spring.{snappy,smooth,fluid}` → `--ag-spring-*` (`linear()`) + `--ag-spring-*-duration` | 90/120/200/320/450 ms (exits 60/80/140/220/320); ambient per MOT §4.2 (40 s requested by MED); standard `cubic-bezier(0.2,0,0,1)`, emphasized-decelerate `cubic-bezier(0.05,0.7,0.1,1)`, accelerate `cubic-bezier(0.3,0,1,1)`; snappy ζ 1.0 / r 200 ms, smooth ζ 0.9 / r 350 ms, fluid ζ 0.82 / r 450 ms (PRD-06 §4.2) |
| Interaction | `sys.state.{hover-specular,press-glow,focus-width,disabled-alpha,selected-tint,loading-alpha,dragging-lift,drop-target-rim}` → `--ag-state-*`; `sys.target.{min,coarse}` → `--ag-target-min` 24px, `--ag-target-coarse` 44px | see §5.6 |
| Environment | `sys.light.angle` → `--ag-light-angle` 300deg; `sys.light.specular` → `--ag-specular` 0.5; `sys.backdrop.{light,dark,media}` tint mapping; `sys.scrim.clear` 0.35; `sys.scrim.media` → `--ag-scrim-media` (accepted addition, SC-19; requested by PRD-MED for the media scrim) | scrim.media `oklch(0% 0 0 / 0.72)` |
| Density | `sys.density.multiplier` → `--_ag-density` | compact 0.875 / regular 1 / spacious 1.125 |

### 4.4 Mode matrix

| Axis | Attribute | Values | Media mirror | Resolution |
|---|---|---|---|---|
| scheme | `data-ag-scheme` | light, dark | `prefers-color-scheme` | attribute wins; absence follows media. Sets `color-scheme` |
| contrast | `data-ag-contrast` | standard, more | `prefers-contrast: more` | max(OS, app, user); `more` also raises effective transparency to at least `tinted` (architecture §7.1) |
| transparency | `data-ag-transparency` | glass, tinted, solid | `prefers-reduced-transparency: reduce` → tinted; `forced-colors: active` → solid | max on glass < tinted < solid (D-11); OS/capability floors in `@layer ag.a11y` after attribute blocks |
| motion | `data-ag-motion` | full, calm, none | `prefers-reduced-motion: reduce` → calm | no token values change; behaviour (calm: keep opacity/colour transitions at token durations, drop transforms, springs → `--ag-ease-standard`; none: `transition-duration: 0s`, `animation: none` on library parts) is PRD-06 REQ-MOT-20/-21 |
| density | `data-ag-density` | compact, regular, spacious | none | attribute only |
| backdrop | `data-ag-backdrop` | light, dark, media, auto | none | selects tint mapping and floor row (`clear` over light/media adds `scrim.clear`) |

The tokens layer emits values for every axis. The rung *behaviour* (border, specular off, `Canvas`/`CanvasText`) belongs to PRD-05, which consumes `--ag-*` from this PRD. Attributes are written by `AuraGlassScript` pre-paint (D-10) or by server layouts; this PRD guarantees the CSS works when they are absent.

Terminology (SC-28): "backdrop" means only the declared `data-ag-backdrop` axis above. The white, black and busy contrast inputs of the solver are **composites**. Preference values are A11Y's (SC-23): the store's `density: comfortable|compact` resolves to `data-ag-density="regular"|"compact"`, and `spacious` is reachable only through the attribute or `createGlassTheme` (see §21 OI-03). The attribute names used here, including `data-ag-theme` and `data-ag-shadcn-source`, must be in the SC-21 registry (§21 OI-02).

### 4.5 Themes and presets

- `ThemePreset` = `{ id, name, canvas: { light: Oklch, dark: Oklch }, neutralHue: number, accent: Oklch, radiusScale?: 0.75 | 1 | 1.25 }`. Initial set: `aura` (default), `graphite`, `daylight`, `midnight` (4; ≤ 6 allowed). Each compiles to a `[data-ag-theme=<id>]` block inside `dist/css/tokens.css` (`@layer ag.tokens`) that overrides only `ref.color.*` and `sys.color.{canvas,accent,on-accent,border}`.
- `createGlassTheme(options)` (client-safe pure function) returns `{ id, cssText, vars, contrast }` where `cssText` is a scoped `[data-ag-theme=<id>]{…}` rule for SSR injection; `vars` is the same as a `Record<\`--ag-${string}\`, string>`; `contrast` reports solved pass/fail per pair. Brand inputs that fail the contrast solve for `on-accent` get the solved accent lightness adjustment and a dev warning, never a silent pass.
- `createBrandTheme(brand: OklchInput, opts?)` derives the 12-step accent ramp with `oklch(from <brand> calc(l ± k) c h)` and returns the same shape. `createBrandGlassTheme` becomes a C-D alias.

### 4.6 Tailwind v4 bridge and shadcn aliases

Generated `dist/css/tailwind.css` per architecture §5.5 and PRD-02 REQ-PKG-97: `@import "./tokens.css"` (relative path, REQ-PKG-97b); `@theme inline { --color-canvas: var(--ag-color-canvas); … }` covering every public `sys.color.*`, `sys.radius.*`, `sys.ease.*`, `sys.duration.*`, `sys.shadow` read-out and `sys.type.*` size; `@utility glass-regular | glass-clear | glass-thin | glass-thick | content-raised | content-sunken` containing the same compiled declarations as the `[data-ag-variant]`/`[data-ag-thickness]` rules (byte-equal, gated); `@custom-variant ag-dark | ag-tinted | ag-solid | ag-contrast-more`. Opacity modifiers work because colours are OKLCH (`bg-accent/50` → `color-mix(in oklab, …)` generated by Tailwind v4).

shadcn interchange (in `tokens.css`, `@layer ag.tokens`): `--ag-color-canvas: var(--background, <default>)` style reads for `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius`, **and** emission of the same eight names from `--ag-*` under `:where(:root:not([data-ag-shadcn-source]))`. Cycle rule: an app sets `data-ag-shadcn-source` on `<html>` when shadcn variables are authoritative; otherwise AuraGlass is authoritative and emits them. The compiler verifies no cycle exists in either direction.

---

## 5. Exact implementation requirements

### 5.1 Source and schema

- **REQ-DS-01** All design values live in `tokens/**/*.tokens.json` in DTCG format. `tokens/$schema.json` defines the standard types plus `glass-material` and `motion-spring` composites and the `$extensions` keys `ag.public` (boolean), `ag.tier` (`ref|sys|material|comp`), `ag.since` (semver), `ag.deprecated` (`{since, replacement}`). Test: `tests/tokens/schema.test.ts`.
- **REQ-DS-02** `scripts/tokens/build.mjs` fails (exit 1) on: schema violation, unresolved alias, alias cycle, a `material.*` token aliasing anything except `sys.*`, a preset or `createGlassTheme` output defining any `material.*` or `--_ag-*` key. Test: `tests/tokens/compiler-guards.test.ts` with one fixture per failure.
- **REQ-DS-03** The build is deterministic: two consecutive runs produce byte-identical `dist/tokens/**` and `tokens/generated/**`; generated files are prettier-formatted (keep `build-tokens.js:25-35` behaviour). Test: `tests/tokens/determinism.test.ts`; CI step `git diff --exit-code tokens/generated src/tokens/generated` after build.
- **REQ-DS-04** Style Dictionary is pinned exact (`style-dictionary@4.x.y`, no range) in `devDependencies` only. `ajv` likewise. Neither appears in `dependencies` or in any `dist/**` import. Gate: PRD-PKG `scripts/ci/verify-deps.mjs` against `docs/dependency-allowlist.json` (PKG-056; SC-14).

### 5.2 Tiers and namespace

- **REQ-DS-05** Tier rules enforced by `scripts/tokens/gates/tier-skip.mjs`: no file under `src/**` (except `src/tokens/generated/**`) may reference a `ref.*`-derived var (`--_ag-ref-*`); `material` references only `sys`; `comp` references `sys` or `material`.
- **REQ-DS-06** Public vars use `--ag-<group>-<name>`; private use `--_ag-*` (SC-19; `--glass-*` exists only as read aliases in `compat/tokens.css`). The manifest (`dist/tokens/manifest.json`) lists every public var with `{tier, group, $type, modes[], since}`; PRD-REL's API report (`etc/api/<slug>.api.md`, SC-04; REL-003) includes it, so adding/removing a public var is a reported API change.
- **REQ-DS-07** Every `--ag-*` name currently used in `src/**` (the 28 names in §2.3 across `src/components/marketing/**` and `src/components/navigation/GlassTabBar.module.css`, `src/components/navigation/styled.tsx`) is renamed to the same name with the `--_ag-` prefix in 4.2 (C-I; none is documented public), and the affected snapshots (`src/components/navigation/__snapshots__/GlassTabBar.test.tsx.snap`, `src/components/marketing/AuroraOrb.test.tsx`) are updated in the same PR, so the `--ag-*` namespace contains only manifest entries. Gate: `undefined-vars` reports any `--ag-*` in `src/**` absent from the manifest.

### 5.3 Colour (OKLCH)

- **REQ-DS-08** Every colour token is authored as OKLCH (`{ colorSpace: "oklch", components: [L, C, H], alpha }`). `ref.color.slate.1..12` and each accent ramp have 12 steps with monotone L (light ramp L 0.99→0.18, ΔL between adjacent steps ≥ 0.03). Emitted as `oklch()`; an sRGB hex fallback is emitted only inside `@supports not (color: oklch(0 0 0))`.
- **REQ-DS-09** Every `sys.color.*` leaf is emitted with `light-dark(<light>, <dark>)` and the scheme blocks set `color-scheme: light` / `dark`. Dark `on-surface` has L ≥ 0.92 and C ≤ 0.02 (fixes the navy-text bug, TOKENS-THEME-05/D-28).
- **REQ-DS-10** Material tint is derived, never authored per preset: `material.tint.{light,dark,media}` aliases `sys.color.canvas`; the runtime fill is `oklch(from var(--ag-color-canvas) l c h / var(--_ag-alpha))` (architecture §4.4).

### 5.4 Typography, spacing, density, radius

- **REQ-DS-11** Type roles exactly: `display, title-1, title-2, title-3, body, callout, caption, label, mono`, each with `size`, `line-height`, `weight`, `tracking`. `body` size is fluid 15–17 px. Minimum rendered size for any role is 12 px (`caption`). `--ag-type-on-glass-weight-delta: 50` is applied by components on `[data-ag-surface]` text (PRD-04/PRD-14 consume it). Default family is the system stack; no Aeonik reference in `tokens.css` (D-31).
- **REQ-DS-12** `--ag-space-<n>` = `calc(<base px> * var(--_ag-density))`; `[data-ag-density=compact]` sets `--_ag-density: 0.875`, `spacious` `1.125`. `--ag-target-min` (24 px) and `--ag-target-coarse` (44 px) are **not** scaled by density.
- **REQ-DS-13** One radius ladder (`xs 6, sm 10, md 14, lg 20, xl 28, full 9999` px) replaces the four 4.x scales. `--ag-radius-inner` is the formula `max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))`. Preset `radiusScale` multiplies xs..xl only.

### 5.5 Material, elevation, environment, motion groups

- **REQ-DS-14** `material/material.tokens.json` is the sole `MaterialSpec` instance: one table, variants `regular | clear | identity` (D-06) × thickness `thin | regular | thick` (D-07). There is no `intent` or `elevation` key. Blur values ≤ 32 px; a lint rejects any blur token > 32 px.
- **REQ-DS-15** `contrast-solve` writes `tokens/generated/opacity-floors.json` keyed `[preset][scheme][contrast][transparency][variant][thickness][backdrop]` with variant ∈ {regular, clear+scrim, identity, content-raised, content-sunken} (REQ-A11Y-15) and backdrop ∈ {light, dark, media} (`auto` resolves to light/dark from the scheme, so it has no row; `MaterialSpec.opacityFloor` keys, architecture §4.3). The emitted CSS follows the architecture/PRD-04 key (REQ-MAT-33): `--_ag-tint-floor` per `[transparency][thickness][backdrop]` (plus the `contrast=more` row) = the **maximum** solved floor across all presets, schemes and variants for that key, so one floor table serves every shipped preset. `createGlassTheme`/`createBrandTheme` canvases are checked against these emitted floors; if a custom canvas needs a higher floor, the function moves the canvas L (and C if needed) by the minimum amount that passes and lists it in `contrast.adjusted[]` (it never emits `--_ag-*`, REQ-DS-02). No floor is hand-authored; a hand-edited value fails `tests/tokens/contrast-matrix.test.ts` because the test re-solves and compares.
- **REQ-DS-16** Elevation is derived: `--_ag-shadow` = `sys.shadow.<layer>.<thickness>` × scheme (D-07: layer × thickness); z-order is `--ag-z-{content 0, chrome 100, overlay 1000, transient 1100, toast 1200}`. No `elevation` prop or token exists in 5.0 output.
- **REQ-DS-17** Motion tokens exactly as PRD-06 §4.2 (this PRD compiles them; PRD-06 owns the values and REQ-MOT-01 is its acceptance test): durations `instant 90, micro 120, small 200, medium 320, large 450` ms; `-exit` variants 60/80/140/220/320 ms (0.7 × entry rounded to 10 ms); eases `standard cubic-bezier(0.2,0,0,1)`, `emphasized cubic-bezier(0.2,0,0,1)`, `emphasized-decelerate cubic-bezier(0.05,0.7,0.1,1)`, `accelerate cubic-bezier(0.3,0,1,1)`; springs `snappy (ζ 1.0, r 200 ms)`, `smooth (ζ 0.9, r 350 ms)`, `fluid (ζ 0.82, r 450 ms)` compiled to `linear()` per §4.2. Token values do not vary by motion mode; `calm`/`none` rules are PRD-06's `motion-modes.css` in `@layer ag.a11y`. No Penner back/elastic easing in output (gate greps for `cubic-bezier` with any control-point y outside [0, 1]). `--ag-duration-ambient` (SC-19 accepted addition) is compiled from the row PRD-MOT adds to `tokens/sys/motion.tokens.json`; it is excluded from the exit-variant rule.
- **REQ-DS-18** Environment tokens: `--ag-light-angle` (`@property`, `<angle>`, `inherits: true`, 300deg), `--ag-specular` (`<number>`, `inherits: false`, 0.5), `--ag-glass-opacity` (`<number>`, `inherits: true`, 0), exactly as architecture §4.4; backdrop tint mapping per `data-ag-backdrop`, `scrim.clear 0.35`; `--ag-scrim-media` = `oklch(0% 0 0 / 0.72)` (SC-19 accepted addition requested by PRD-MED; DS adds the row).

### 5.6 Interaction states

- **REQ-DS-19** Interaction tokens express light response, not scale. Exactly these, each with a CSS var and a documented selector contract consumed by PRD-04/PRD-07:

| State | Token(s) | Selector contract | Rule |
|---|---|---|---|
| hover | `--ag-state-hover-specular` (+0.15 specular), `--ag-state-hover-floor` (+0.02 alpha) | `@media (hover:hover) { [data-ag-interactive]:hover }` | never on coarse pointers |
| active (pressed) | `--ag-state-press-glow` (0.25), `--ag-state-press-floor` (+0.04) | `[data-ag-interactive]:active, [data-pressed]` | duration `micro` |
| selected | `--ag-state-selected-tint` (accent at 0.16 alpha over fill) | `[data-selected], [aria-selected=true], [data-state=on], [aria-pressed=true]` | text pair re-solved ≥ 4.5:1 |
| focused | `--ag-focus-width` 2px, `--ag-focus-inner`, `--ag-focus-outer` (two-tone ring, ≥ 3:1 against both adjacent colours) | `:focus-visible` only | never removed by any mode |
| disabled | `--ag-state-disabled-alpha` 0.45 applied via `--_ag-surface-alpha` on layers, never host `opacity` | `[data-disabled], :disabled, [aria-disabled=true]` | exempt from contrast floor per WCAG 1.4.3, but on-surface ≥ 3:1 retained |
| loading | `--ag-state-loading-alpha` 0.7 for content, shimmer off under `motion≠full` | `[data-loading], [aria-busy=true]` | |
| dragging | `--ag-state-dragging-lift` (shadow one thickness step up), `--ag-state-dragging-specular` | `[data-dragging]` | sets `data-ag-animating` (will-change only then) |
| dropping (drop target) | `--ag-state-drop-target-rim` (accent rim 2px), `--ag-state-drop-target-fill` (+0.06 alpha) | `[data-drop-target]` | |

- **REQ-DS-20** Every state token has a value in each of `contrast=more` (rim/outline forms, no specular) and `transparency=solid` (system colours in forced colours: `Highlight`, `HighlightText`, `GrayText`).

### 5.7 Modes

- **REQ-DS-21** For each axis in §4.4 the compiler emits (a) an attribute block `[data-ag-<axis>=<value>]`, (b) the media mirror applied only when the attribute is absent (`:root:not([data-ag-<axis>])`), in `@layer ag.tokens`. OS-floor overrides (contrast more, reduced transparency, forced colors) are emitted **again** in `@layer ag.a11y` so that `data-ag-transparency=glass` cannot lower an OS floor (D-11), and `contrast=more` (attribute or media) selects at least the `tinted` floor row (architecture §7.1). Test: `tests/tokens/modes-matrix.test.ts` + `tests/visual/tokens/modes.spec.ts` (QA L6).
- **REQ-DS-22** `prefers-contrast: high` appears 0 times in any CSS this compiler emits; `prefers-contrast: more` is the only contrast query it generates. The 4.2 replacement in hand-written 4.x files (`src/styles/glass.css`, `animations.css`, `premium-typography.css`, `theme-transitions.css`, `components/accessibility/GlassFocusIndicators.css` and the TS `matchMedia` sites in §2.4) and the deletion of the invalid `forced-colors: active;` declaration at `src/styles/theme-transitions.css:52-54` are executed on the §16 PRD-17 bridge train (interim owner PRD-REL, SC-37) as D-28 labelled visual fixes (accessibility PRD REQ-A11Y-48 and AC-A11Y-07 own the acceptance). This PRD supplies only the token-level `more` blocks.
- **REQ-DS-23** With zero JS and zero attributes, the page renders correctly in all six OS-preference combinations exercised by QA L6 Environment visual (light, dark, more, reduced-transparency, forced-colors, reduced-motion). "Correctly" = differs from the attribute-driven baseline for the same values by ≤ 0.1 % of pixels (a pixel counts as changed when any channel differs by > 2/255).
- **REQ-DS-24** The 4.x hooks `data-theme`, `data-aura-theme`, `data-aura-mode`, `data-persona`, `data-bg`, `.glass-on-light`, `.glass-on-dark`, `.dark`, `.light` are matched by **no** selector in 5.0 `styles.css`. `compat/tokens.css` maps `[data-theme=dark]` and `.dark` to `data-ag-scheme=dark` values for 5.x only.

### 5.8 Themes, presets, `createGlassTheme`, `createBrandTheme`

- **REQ-DS-25** Ship 4 presets (`aura`, `graphite`, `daylight`, `midnight`), each with light and dark canvases; each passes the full contrast matrix. Narrative persona metadata (`designMatrix.ts:105-128`) moves to docs (PRD-20) and is not in any runtime export.
- **REQ-DS-26** `createGlassTheme(options: CreateGlassThemeOptions): GlassTheme` keeps the 4.x option names `id`, `name`, `brandColor`, `accentColor`, `mode`, `density`, `motionPolicy` (`createGlassTheme.ts:62-70`) and adds `preset`, `neutralHue`, `radiusScale`, `contrast`. Mapping: `mode: "system"` resolves to the media query (fixes `isLight = mode === "light"` at `:128`); `mode: "high-contrast"` → `contrast: "more"`; `density: "comfortable"` → `regular`; `motionPolicy: "reduced"` → `calm`, `"expressive"` → `full` + `allowContinuous: true`, `"system"` → follows the OS, `"none"` → `none` (the mapping in PRD-06 REQ-MOT-07; `pointerLight` stays a separate opt-in, D-04). Output `{ id, cssText, vars, contrast: ContrastReport, tokens }` where every key in `vars` exists in the manifest (test asserts 0 unknown keys and ≥ 1 consumer each).
- **REQ-DS-27** `createGlassTheme` is a pure function, importable from a Server Component (no `"use client"`, no DOM access), and its `cssText` is scoped to `[data-ag-theme="<id>"]` (no `:root`). Accepts hex, `rgb()`, `hsl()` and `oklch()` strings; converts to OKLCH with `src/theme/color.ts`.
- **REQ-DS-28** `createBrandTheme(brand: string | Oklch, opts?: { accentShift?: number; preset?: PresetId })` derives a 12-step accent ramp with relative colour syntax in the emitted CSS (`oklch(from <brand> calc(l + Δ) c h)`) and computes the same ramp in TS for the contrast report. If `on-accent` cannot reach 4.5:1 on any step used for text, the step's L is moved by the minimum amount that passes, and `contrast.adjusted[]` lists it; in development a `console.warn` names the step.
- **REQ-DS-29** 4.x `createBrandGlassTheme` re-exports `createBrandTheme` with a C-D warning in 4.3 and is available only from `aura-glass/compat` in 5.0. `createGlassThemeCssVars` (emits `--glass-theme-*`) is C-D in 4.3 and removed in 5.0; its replacement is `createGlassTheme(...).vars`.
- **REQ-DS-30** `aura-glass/tokens` runtime exports exactly the names in its `.d.ts` at 5.0. `getPersona`/`getPersonaModeTokens` (declared, never implemented, TOKENS-THEME-08) are **not** in 4.1.1 (SC-36 defers them): in 4.2 they become C-D (`@deprecated` in the emitted `.d.ts`, a `deprecations.json` entry since 4.2.0, removeIn 5.0.0) and in 5.0 they are removed. In 4.2/4.3 the parity gate allows exactly these two type-only names, and nothing else. Test: `tests/tokens/types-runtime-parity.test.ts` diffs `Object.keys(await import('aura-glass/tokens'))` against `etc/api/tokens.exports.json` (SC-04; TRUST-072, REL-003).

### 5.9 Gates (CI, fail closed)

- **REQ-DS-31** `gates/undefined-vars.mjs` (supersedes `scripts/ci/check-undefined-custom-props.mjs` and `scripts/ci/audit-css-var-coverage.js`): for each importable CSS entry in `dist/css/` (`styles.css`, `tokens.css`, `material.css`, `tailwind.css`, each per-subpath CSS, `compat/*.css`), every `var(--ag-*)`/`var(--_ag-*)` without fallback must be defined in that entry's import closure. Also scans `src/**/*.{ts,tsx}` string literals and `style={{}}` objects for `--ag-*` names absent from the manifest. Threshold: 0.
- **REQ-DS-32** `gates/dead-vars.mjs`: every public `--ag-*` in the manifest has ≥ 1 reader in built library CSS or TS, or carries `$extensions["ag.public"] = true` (consumer-facing read-out, e.g. `--ag-surface-fill`). Every private `--_ag-*` has ≥ 1 reader. Threshold: 0 dead.
- **REQ-DS-33** `gates/literals.mjs` + stylelint rule `auraglass/no-raw-design-values` + ESLint rule `auraglass/no-raw-design-values` over **all** `src/**/*.{ts,tsx,css}` with no directory exclusions (replaces `scripts/ci/token-lint.js:305-331` scope): forbids colour literals (hex, `rgb[a](`, `hsl[a](`, `oklch(` with literal components), `blur(<n>px)`, `border-radius` px literals, `box-shadow` literals, ms/s durations, `cubic-bezier(` and literal `linear(` spring curves. This is the program's only raw-value rule (SC-17): FND's `no-literal-style` and MOT's `motion-no-literals` fold into it, and motion literals are its `duration|easing|spring` categories. Allowed only in `tokens/**`, the compiler's generated outputs (`src/tokens/generated/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`), `src/theme/color.ts` (conversion constants and test vectors only) and tokens in the data-viz palette group `sys.palette.*`. Severity error. Ratchet (architecture §15.2 Static lane, "ratchet from about 1,890"): `scripts/tokens/gates/literals-baseline.json` (NEW, generated on first run) is the only literal baseline (SC-17; `certification/ratchets.json` holds coverage ratchets only, and no `scripts/ci/motion-literal-baseline.json` exists). It records per-file counts by `category` (`color|blur|radius|shadow|duration|easing|spring`) at HEAD; QA L1 Static reads it; CI fails when any file's count rises or a new file has > 0; the baseline is regenerated only downward; it must be empty (0 violations) at the first 5.0.0-beta.
- **REQ-DS-34** `!important`: owned by PRD-02 REQ-PKG-91 (0 in `dist/css/**`). This PRD's emitters write 0 `!important` from their first commit (D-24); `tests/tokens/emitted-css.test.ts` asserts it on compiler output only.
- **REQ-DS-35** Layer placement: PRD-02 REQ-PKG-90/-92 own the layer-order and no-globals gates for `dist/css/**`. This PRD's emitters place all token output in `ag.tokens`, compat aliases in `ag.compat` (where `:root` is allowed, REQ-PKG-92), material output in `ag.material`, OS-floor re-emission in `ag.a11y`, and emit no unlayered rule except `@property` (layer-agnostic). Asserted on compiler output by `tests/tokens/emitted-css.test.ts`.
- **REQ-DS-36** `className` coverage is PRD-02 REQ-PKG-95 (`tests/css/class-coverage.test.ts`), which catches the undefined slash utilities (TOKENS-THEME-09). This PRD adds no class vocabulary except the six Tailwind `@utility` names in `tailwind.css`, which are consumer-facing and not used in `src/`.
- **REQ-DS-37** Contrast matrix (`tests/tokens/contrast-matrix.test.ts`, solver determinism and committed-table equality) runs in QA's L4 Token contrast lane (SC-29; QA-081) alongside the accessibility PRD's independent recompute (`tests/a11y/contrast-matrix.test.ts`, REQ-A11Y-18); any cell below its REQ-A11Y-16 threshold (4.5 / 3 / 7:1) fails.

### 5.10 Tailwind v4 bridge and shadcn

- **REQ-DS-38** `dist/css/tailwind.css` is generated, imports `./tokens.css` by relative path, and contains `@theme inline` mapping every public `sys` colour, radius, ease, duration, shadow read-out and type size; `@utility glass-regular|glass-clear|glass-thin|glass-thick|content-raised|content-sunken`; `@custom-variant ag-dark|ag-tinted|ag-solid|ag-contrast-more`. `tests/tokens/tailwind-bridge.test.ts` compiles a fixture with `@tailwindcss/node` (devDependency) and asserts each `@utility` produces declarations byte-equal to the corresponding compiled `[data-ag-variant]`/`[data-ag-thickness]` rule. Packaging rules (CSS-first at-rules only, no JS preset, optional peer `tailwindcss ^4`) are PRD-02 REQ-PKG-97.
- **REQ-DS-39** No Tailwind class strings in `dist/**/*.js` and no `tailwind-merge`: gate and dependency removal are PRD-02 (REQ-PKG-97e, REQ-PKG-50). This PRD's generated TS (`src/tokens/generated/**`) contains no class strings (asserted in `tests/tokens/emitted-css.test.ts`).
- **REQ-DS-40** shadcn interchange per §4.6: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius` are read with defaults and emitted; no cycle in either direction (compiler check). `dist/tokens/registry-cssvars.json` (`cssVars.{theme,light,dark}`) is generated from the same source and handed to PRD-DX, which owns `registry/**` (DX-067, DX-068).

### 5.11 Retirement and CSS distribution

- **REQ-DS-41** Retire S1–S9 in the order in §20. At 5.0: `src/tokens/glass.ts` surface data, `src/tokens/designConstants.ts`, `src/tokens/themeTokens.ts`, `src/tokens/generated.ts`, `src/theme/designMatrix.ts`, `src/theme/materials.ts`, `src/theme/tokens.ts`, `src/theme/themeConstants.ts`, `src/styles/glass.generated.css`, `src/styles/generated/persona-variables.css`, `src/styles/variables.css`, `src/styles/design-tokens.css`, `src/styles/themes/light.css`, `src/styles/themes/dark.css`, `src/styles/premium-typography.css`, `src/styles/keyframes.css` (src mirror) and the four generators are deleted; `tokens/personas/default.json`, `tokens/index.json`, `tokens/schema.json` are replaced by the new tree.
- **REQ-DS-42** Before any deletion, freeze the rendered 4.x values (`glass.ts:997` gradient, `:1001` fill, `:1030` border, the blur ternary, `tokens.css` primitives) into `tokens/legacy/4x-rendered.tokens.json` (consumed only by the `compat/tokens.css` and 4.2 `aura-glass/material` builds) so the frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (owner PRD-REL, REL-115; SC-08) stays pixel-identical (D-27).
- **REQ-DS-43** `compat/tokens.css` (`@layer ag.compat`) aliases each of the ~620 `--glass-*` names that has ≥ 1 reader in 4.x `src` or the frozen consumer fixture to its `--ag-*` successor or a frozen legacy value; the alias table is generated (`tokens/generated/compat-alias-map.json`) and is the input to PRD-DX's `css-vars` codemod (DX-050; codemod id `css-vars`, SC-33). This PRD owns the alias map, the `compat-aliases` emitter and the contents of `compat/tokens.css` (SC-18, SC-20, SC-34); PRD-REL (interim owner of §16 PRD-17, SC-37) holds the 4.3 release scope and gates that ship it. Size reported separately, excluded from the `styles.css` budget (D-18); ceiling ≤ 8 KB gz as a DS row in `docs/size-budgets.json` (SC-15).
- **REQ-DS-44** Storybook CSS (`storybook-enhancements.css`, `storybook-utility-shim.css`, imported at `src/styles/index.css:24-25`) is moved to `.storybook/` by PRD-PKG (REQ-PKG-94, PKG-101, 4.2; `src/styles/index.css` belongs to PKG, SC-20). This PRD's outputs never import them, and the §13 stories load them only through SB's `.storybook/preview.tsx` (SB-048, SC-31).

---

## 6. Files/directories affected (existing paths)

| Path | Change |
|---|---|
| `tokens/index.json`, `tokens/personas/default.json`, `tokens/schema.json` | replaced by DTCG tree; values migrated (REQ-DS-01, -41) |
| `scripts/build-tokens.js` | replaced by `scripts/tokens/build.mjs`; npm script `build:tokens` repointed; deleted by DS-112, the single remover (SC-39; PKG-109 drops its removal) |
| `scripts/generate-glass-css-simple.js`, `scripts/generate-glass-css-from-tokens.ts`, `scripts/generate-persona-css.ts`, `scripts/generate-persona-css-runner.js` | deleted after S6/S7 retire; `glass:generate-css`, `glass:generate-persona-css`, `glass:validate-persona-css` scripts removed |
| `scripts/ci/token-lint.js`, `scripts/ci/check-undefined-custom-props.mjs`, `scripts/ci/audit-css-var-coverage.js` | superseded by `scripts/tokens/gates/*`; `lint:tokens` and `verify:css-vars` repointed; removed by DS-078/079/080 (DS-079 is the single remover of `check-undefined-custom-props.mjs`, SC-39; PKG-112 drops its edit) |
| `.github/workflows/design-system-compliance.yml` | not edited by this PRD: QA-118 deletes it (SC-39). The token build, generated-file diff and §5.9 gates run as providers in QA's L1 Static and L4 Token contrast lanes (`certification/lanes.config.ts`, QA-078/QA-081). Until those lanes exist they run as a step in PKG's `Glass Quality Gates` job in `.github/workflows/glass-pipeline.yml` (MODIFY after PKG-038; SC-10) |
| `src/tokens/glass.ts`, `src/tokens/designConstants.ts`, `src/tokens/themeTokens.ts`, `src/tokens/generated.ts`, `src/tokens/index.ts` | surface/constant data deleted; `index.ts` re-exports `src/tokens/generated/tokens.ts` |
| `src/theme/createGlassTheme.ts`, `src/theme/createBrandGlassTheme.ts`, `src/theme/color.ts`, `src/theme/contrast.ts` | `createGlassTheme.ts` is DS-owned (DS-083, SC-18; MOT-026 MODIFY after it). `color.ts` kept and extended with OKLCH conversion and the composite/WCAG names A11Y consumes (DS-055; A11Y-003 verifies). `contrast.ts` (1-line) folded into `color.ts` and deleted by DS-109 (A11Y-004 verifies 0 importers) |
| `src/theme/designMatrix.ts`, `src/theme/materials.ts`, `src/theme/tokens.ts`, `src/theme/themeConstants.ts` | deleted (5.0); C-D in 4.3 |
| `src/theme/GlassThemeProvider.tsx`, `src/theme/ThemeProvider.tsx`, `src/theme/GlassContext.tsx`, `src/theme/useGlassTheme.ts`, `src/theme/useGlassDensity.ts`, `src/theme/useGlassMotionPolicy.ts`, `src/theme/index.ts`, `src/core/themeContext.tsx`, `src/core/themeUtils.ts`, `src/hooks/useGlassTheme.ts` | provider consolidation is PRD-05 (`AuraGlassProvider`); this PRD removes their token emission (`--glass-theme-*`, `data-theme`, `data-aura-*`, `data-persona`) |
| `src/styles/tokens.css`, `variables.css`, `design-tokens.css`, `typography.css`, `themes/light.css`, `themes/dark.css`, `glass.generated.css`, `generated/persona-variables.css`, `premium-typography.css`, `keyframes.css` | deleted from `styles.css` path at 5.0; values frozen to `tokens/legacy/` first |
| `src/styles/glass.css`, `animations.css`, `theme-transitions.css`, `premium-typography.css`, `components/accessibility/GlassFocusIndicators.css` | `prefers-contrast: high`→`more` and invalid `forced-colors` declaration removed in 4.2 on the bridge train (interim owner REL, SC-37; REQ-A11Y-48); `src/styles/glass.css` removal belongs to MOT-084 (SC-20); `!important` removal gated by PRD-02 REQ-PKG-91; this PRD only stops these files from defining design values (REQ-DS-33 ratchet) |
| `src/styles/index.css`, `src/styles/storybook-enhancements.css`, `src/styles/storybook-utility-shim.css` | owned by PKG (PKG-101, SC-20): Storybook imports at `index.css:24-25` removed and files moved to `.storybook/` (REQ-PKG-94). DS-111 removes only the legacy token imports from `index.css` as a MODIFY after PKG-101 |
| `src/components/marketing/marketing.css`, `AuroraBackground.tsx`, `AuroraOrb.tsx`, `AuroraOrb.test.tsx`, `LogoMark.tsx`, `src/components/navigation/GlassTabBar.module.css`, `src/components/navigation/styled.tsx`, `src/components/navigation/__snapshots__/GlassTabBar.test.tsx.snap` | `--ag-*` private vars renamed `--_ag-*` (REQ-DS-07) |
| `src/components/animations/GlassTransitions.tsx`, `src/components/animations/AdvancedAnimations.tsx` | undefined `--glass-opacity-24/32/52/72` replaced in **4.2** as a D-28 labelled visual fix (SC-36 defers it from 4.1.1; REL adds the D-28 entry) |
| `src/utils/contrastGuard.ts`, `src/components/accessibility/ContrastGuard.tsx` | replaced by the build-time contract. `ContrastGuard.tsx` is cut by TRUST-026 in 4.1.1 (SC-39); FND-125 verifies absence on `main`; this PRD supplies `opacity-floors.json` |
| `src/core/mixins/glassMixins.ts` | `createGlassStyle` returns `var()` references only in 4.2 (bridge), deleted in 5.0 (PRD-04) |
| `package.json` | requests to PRD-PKG, which owns `build/exports.manifest.json` (PKG-005, SC-12): entries `./tokens.css`, `./material.css`, `./tailwind.css`, `./compat/tokens.css` (all resolving into `dist/css/`); remove `./tokens/json`, `./tokens/tailwind`, `./tokens/manifest`, `./tokens/css`, `./tokens/keyframes` at 5.0 (alias subpaths C-D in 4.2). DS requests **no** `./tokens.json` or other JSON artifact row (SC-12). Owned here: scripts per above; devDependencies `style-dictionary`, `ajv`, `@tailwindcss/node`, `stylelint`, `postcss` (today only transitive) pinned exact; none is present in `package.json` at HEAD. Unit tests run under the existing Jest 29 + `jest-environment-jsdom` |
| `tests/tokens/export.test.ts`, `tests/tokens/export.spec.mjs` | rewritten against the new export map |
| `src/theme/theme-engine.test.tsx`, `src/theme/usePersonaTheme.test.tsx`, `src/theme/__tests__/ThemePersona.integration.test.tsx` | replaced by §12 tests; persona tests deleted with personas |
| `docs/design-tokens.md`, `docs/theme/theme-engine.md` | regenerated from the manifest (PRD-DX, §16 PRD-20); hand tables deleted (TOKENS-THEME-15) |
| `.storybook/preview.tsx` | owned by SB (SB-048, SC-31). DS-095 adds only the `preset` global and the `data-ag-theme` write through SB's single `StoryEnvironment` + `StoryRoot` decorator, as a MODIFY after SB-048 (§13) |
| `tokens/sys/app-shell.tokens.json` | NEW, created by DS-120 from PRD-NAV's values (SC-18 row request replacing NAV-009) |
| `docs/size-budgets.json` | DS rows added by MODIFY (DS-117) after PKG-048; the file, schema and gate (`scripts/ci/verify-size-budgets.mjs`) are PKG's (SC-15) |

## 7. Components affected

This PRD changes no component behaviour directly; it changes what every component may read.

- **All components (500 inventory records; `rg -l` at HEAD: 197 non-story, non-test `src/components/**/*.tsx` files reference `var(--…)`, 193 of them `var(--glass-…)`)**: must consume only manifest `--ag-*` names and `data-ag-*` attributes by 5.0. The 180 files with raw literals (worst: `ai/GlassMusicVisualizer.tsx` 60, `media/GlassAdvancedVideoPlayer.tsx` 43, `search/GlassIntelligentSearch.tsx` 39, `input/GlassColorPicker.tsx` 38, `atmospheric/GlassBiomeSimulator.tsx` 37) are either migrated by their family PRD or removed by PRD-16; the REQ-DS-33 ratchet blocks any increase immediately and reaches 0 at 5.0.0-beta.
- **Flagships 1–44 (architecture §11.2)**: each consumes `sys.*`, `material.*` read-outs and the REQ-DS-19 interaction contract; their PRDs (PRD-08..13) add `comp.*` tokens only via this compiler.
- **Theme/preference components**: `GlassThemeSwitcher` (REDESIGN → `ThemeSwitcher` writing `data-ag-scheme` via `usePreference`, PRD-05), `PersonaPicker` (replaced by a preset picker inside `GlassPreferencesPanel`; inventory POLISH overridden because personas are removed, §5.4 architecture), `GlassColorSchemeGenerator` (moves to the docs theme playground built on `createBrandTheme`).
- **Removed consumers**: `GlassThemeDemo`, `ThemedGlassComponents`, `BrandColorIntegration`, `AIGlassThemeProvider`, `AdaptiveGlassDensity`, `IntelligentColorSystem` (sole `themeTokens.ts` consumer) — PRD-16.
- **Marketing and navigation** (`AuroraBackground`, `AuroraOrb`, `LogoMark`, `marketing.css`, `GlassTabBar`): private var rename (REQ-DS-07).

## 8. New components/files

All NEW (verified absent with `rg --files`):

- `tokens/$schema.json`, `tokens/ref/*.tokens.json`, `tokens/sys/*.tokens.json`, `tokens/material/material.tokens.json`, `tokens/modes/*.tokens.json`, `tokens/presets/{aura,graphite,daylight,midnight}.tokens.json`, `tokens/sys/app-shell.tokens.json` (values from PRD-NAV), `tokens/sys/breakpoint.tokens.json`, `tokens/contrast/busy-reference.json`, `tokens/comp/` (empty with README until a flagship PRD adds tokens), `tokens/legacy/4x-rendered.tokens.json`.
- Committed generated files: `tokens/generated/opacity-floors.json`, `tokens/generated/compat-alias-map.json`, `src/tokens/generated/tokens.ts`, `src/tokens/generated/material-spec.ts`, `src/material/css/generated/{ladders,floors,properties}.css` (generated output inside MAT's tree, emitted only by this compiler; MAT imports them and never hand-edits them, OV-31), `src/motion/tokens.generated.ts` (DS-053, consumed by PRD-MOT; SC-18), `scripts/tokens/gates/literals-baseline.json`. (`src/material/` and `src/motion/` do not exist at HEAD.)
- `scripts/tokens/build.mjs`, `scripts/tokens/transforms/{glass-material,motion-spring,contrast-solve}.mjs`, `scripts/tokens/formats/{css-layered,property-registry,tailwind-bridge,registry-cssvars,ts-constants,compat-aliases}.mjs`, `scripts/tokens/gates/{undefined-vars,dead-vars,literals,tier-skip,types-runtime}.mjs`.
- Lint rules: rule `auraglass/no-raw-design-values` added by MODIFY to the existing `eslint-plugin-auraglass.js` (namespace and wiring owned by PKG, PKG-015, SC-16; registered at `eslint.config.js:6,25`; replaces the warn-level `auraglass/require-glass-tokens` at `:30`), and `stylelint-plugin-auraglass/no-raw-design-values`.
- Build outputs (not committed, D-32): `dist/css/tokens.css` (incl. preset blocks), `dist/css/tailwind.css`, `dist/css/compat/tokens.css` (contents DS; shipped in the 4.3 scope held by REL, SC-37), `dist/contrast-matrix.json`, `dist/tokens/manifest.json`, `dist/tokens/registry-cssvars.json` (consumed by PRD-DX), `dist/tokens/index.js` + `.d.ts`. `dist/css/material.css` is assembled by PRD-04 from the generated material files.
- Public API: `createBrandTheme`, `ThemePreset` type, `presets` record, `GlassTheme.cssText`, `ContrastReport` type (in `aura-glass/theme`); `token(path)` helper and typed `TokenPath` union (in `aura-glass/tokens`).
- Storybook: `src/design-system/stories/Tokens.mdx`, `src/design-system/stories/ModesMatrix.stories.tsx`, `src/design-system/stories/InteractionStates.stories.tsx`, `src/design-system/stories/Presets.stories.tsx`, `src/design-system/stories/ContrastFloors.stories.tsx` (the repo has no top-level `stories/`; `src/design-system/` exists). DS owns these story files; SB owns the story contract (tags, `Keyboard` story, generated matrices) and the Lab harness `.storybook/lab/**` (SC-31).

---

## 9. Components/files to remove or deprecate

| Item | 4.1.1 / 4.2 | 4.3 | 5.0 | 6.0 |
|---|---|---|---|---|
| `getPersona`, `getPersonaModeTokens` types (never implemented) | C-D in 4.2 (`@deprecated` in `.d.ts`, `deprecations.json` entry; SC-36 moved it out of 4.1.1) | | removed (C-B) | |
| `--glass-opacity-24/32/52/72` usages | fixed in 4.2 (D-28 labelled visual fix; SC-36 moved it out of 4.1.1) | | | |
| `prefers-contrast: high`, invalid `forced-colors` declaration | replaced in 4.2 on the bridge train (interim owner REL, SC-37; D-28 visual fix, REQ-A11Y-48) | | | |
| Storybook CSS in `aura-glass/styles` | moved in 4.2 by PRD-PKG (REQ-PKG-94, PKG-101, C-I) | | | |
| `--glass-*`, `--aura-*`, `--persona-*`, `--glass-theme-*` vars | | C-D (docs + `doctor --v5`) | gone from `styles.css`; aliased in `compat/tokens.css` | removed |
| `data-theme`, `data-aura-theme`, `data-aura-mode`, `data-persona`, `data-bg`, `.glass-on-light/-dark`, `.dark/.light` hooks | | C-D | gone; `compat/tokens.css` maps scheme only | removed |
| 10 personas, `PersonaPicker`, `usePersonaTheme`, `PERSONA_IDS`, `THEME_NAMES` | | C-D (dev warning on use) | removed; nearest preset documented | |
| `createBrandGlassTheme`, `createGlassThemeCssVars`, `glassMaterialPresets` (`src/theme/materials.ts`) | | C-D | `compat` only / removed | removed |
| `aura-glass/tokens/json`, `/tailwind`, `/manifest`, `/css`, `/keyframes` subpaths | C-D in 4.2 (architecture §14.4) | | removed; successors `aura-glass/tokens`, `aura-glass/tokens.css`, `aura-glass/tailwind.css` | |
| Tailwind v3 preset (`dist/tokens/tailwind.theme.mjs`) and UnoCSS preset | C-D in 4.2 | | removed (Tailwind v4 bridge only) | |
| `designConstants.ts` `ANIMATION.*` (449 uses), `COLORS`, `BORDER_RADIUS`, `BOX_SHADOW` | | C-D | removed (callers migrated by family PRDs) | |
| Legacy generators and lints (§6) | | | deleted | |
| `glass-*` slash utility vocabulary | | C-D | removed (architecture §10) | |
| Aeonik (`src/styles/aeonik.css`, `src/styles/fonts/*.woff2`) | per D-31 (legal, out of band; PRD-TRUST) | | | |

Every C-D row above gets an entry in the repo-root `deprecations.json` (SC-02; version 1, schema `docs/schemas/deprecations.schema.json`, REL-010; instance seeded by TRUST-075). DS adds entries by MODIFY (DS-105, DS-106); it never creates the file. Codemod fields use only SC-33 ids (`css-vars`, `providers`, `imports-subpaths`) or null.

## 10. API changes

| API | Change | Class |
|---|---|---|
| `aura-glass/tokens.css` | NEW: `@layer ag.tokens`, all `--ag-*`, modes, preset blocks, shadcn interchange (`@property` registry ships in `material.css`, PRD-04) | C-E (4.2 experimental under `aura-glass/material`, stable 5.0) |
| `aura-glass/material.css` | NEW compiled ladders (content owned by PRD-04) | C-E |
| `aura-glass/tailwind.css` | NEW Tailwind v4 bridge | C-E |
| `aura-glass/compat/tokens.css` | NEW opt-in aliases | C-E (4.3); removed 6.0 |
| `aura-glass/tokens` | 5.0 exports `tokens` (typed `var()` map), `token(path: TokenPath): string`, `materialSpec`, `manifest`, types `TokenPath`, `MaterialSpec`; removes `auraTokens`, `personas`, default export | C-B (5.0) after C-D (4.3) |
| `--ag-*` vars in the manifest | NEW public, semver-stable | C-E |
| `--glass-*` and siblings | removed from core CSS | C-B (after 4.3 C-D) |
| `data-ag-scheme|contrast|transparency|motion|density|backdrop` | attribute contract (architecture §4.5) | C-E |
| `data-ag-theme="<id>"` | NEW (deviation D-A; registry ratification requested from MAT, §21 OI-02) | C-E |
| `createGlassTheme(options)` | same call shape; new options `preset`, `neutralHue`, `radiusScale`, `contrast`; `mode` values mapped (REQ-DS-26); return gains `cssText`, `vars`, `contrast`; `GlassThemeTokens.density.{controlHeight,gap,pagePadding}` removed (zero readers) | C-E for options and added fields (4.3), C-B for removed fields (5.0) |
| `createBrandTheme(brand, opts)` | NEW | C-E (4.3) |
| `createBrandGlassTheme` | alias → `createBrandTheme` | C-D (4.3), `compat` in 5.0 |
| `presets`, `ThemePreset`, `PresetId` | NEW | C-E |
| `GlassThemeMode` `"high-contrast"` | → `contrast: "more"`; accepted with warning in 4.3 | C-D → C-B |
| `GlassDensity` `"comfortable"` | → `"regular"`; accepted with warning in 4.3 | C-D → C-B |
| Tailwind v3 / UnoCSS presets | removed | C-B (after 4.2 C-D) |

Explicit deviations from the architecture:

- **D-A `data-ag-theme`.** Architecture §4.5 has no attribute for a preset or `createGlassTheme` output. Presets carry both canvases, so they are orthogonal to `data-ag-scheme`, and the 4.x inline-style approach caused the re-render reset in TOKENS-THEME-06. A scoped attribute is added (C-E).
- **D-B `data-ag-shadcn-source`.** §4.4 says shadcn vars are "read if present and emitted". Doing both on `:root` is a cycle; a one-bit authority switch resolves it (C-E).
- **D-C extra bridge entries.** `content-sunken` (D-08 defines it; §5.5 lists only `content-raised`) and `ag-contrast-more` are added (C-E).
- **D-D interaction states.** §5.3 lists four interaction tokens; this PRD's scope and the kept `LIQUID_GLASS.system` illumination vocabulary need eight states. Additive and still "light response, not scale".
- **D-E dev tooling.** `style-dictionary`, `ajv`, `@tailwindcss/node`, `stylelint` are pinned devDependencies; D-29 governs runtime dependencies and is unaffected.
- **D-F preset blocks inside `tokens.css`.** Preset `[data-ag-theme=<id>]` blocks are emitted into `tokens.css` instead of a separate `presets.css`, because PKG's CSS entry list (SC-12) has no presets entry. They are budgeted as their own ≤ 2 KB gz sub-row (§16).

## 11. Migration concerns

1. **Pixel stability on 4.x (D-27).** The 4.2 compiler must reproduce 4.x rendered values for 4.x consumers. Mechanism: `tokens/legacy/4x-rendered.tokens.json` and a `legacy` Style Dictionary platform that regenerates today's `--glass-*` primitives. The frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (owner REL, REL-115; SC-08), run by QA's `consumer-4x-frozen` job (QA-087) and classified by REL's `scripts/release/visual-class.mjs` (SC-09), must show 0 changed pixels except the D-28 labelled fixes (before/after composites attached). The 4.2 D-28 set from this PRD is the navy dark-text fix and the `--glass-opacity-*` fix (SC-36).
2. **Inline `createGlassStyle` (59 non-story files under `src/components`, 66 non-story/non-test TSX files under `src`, by `rg -l` at HEAD; ACCESSIBILITY-07 reports 62).** In 4.2 it returns `var(--_ag-*)` strings with the same object shape. Consumers parsing numeric values out of `backdropFilter` break; none found in `src`, external risk documented. Removal is PRD-04.
3. **Consumer CSS reading `--glass-*`.** About 620 read names are aliased by `compat/tokens.css`. Computed names (template strings) are reported, not rewritten, by the `css-vars` codemod (DX-050; the marker is `// TODO(aura-glass 5): <reason>, see <doc>`, SC-33). One generated alias map feeds both, so they cannot drift.
4. **Apps toggling `.dark` or `data-theme` (next-themes default `class`).** 5.0 core ignores them; `compat/tokens.css` maps them to dark scheme values; the guide documents `next-themes` `attribute="data-ag-scheme"`.
5. **Persona users.** No persona maps 1:1. The migration guide (PRD-DX, §16 PRD-20) maps each of the 10 persona ids to the nearest preset plus a `createBrandTheme(accent)` call, generated from `designMatrix.ts` accents before deletion.
6. **Tailwind v3 consumers.** No v3 bridge in 5.0; they use `var(--ag-*)` directly or upgrade. Accepted per architecture §5.5.
7. **Browser floor for colour features.** `oklch()` and `light-dark()` need Safari 15.4/17.5, Chrome 111/123, Firefox 113/120. The compiler emits `@supports not (color: oklch(0 0 0))` hex fallbacks and `@supports not (color: light-dark(#000, #fff))` scheme-block fallbacks. Relative colour syntax needs Safari 18, Chrome 119, Firefox 128, so `createBrandTheme` also emits the precomputed ramp as literals. These version floors are from public compatibility data and must be re-checked in PRD-19's engine lanes.
8. **Marketing `--ag-*` rename** is undocumented API (C-I) but shipped in `marketing.css`; noted in the 4.2 changelog.
9. **Density value rename** `comfortable` → `regular`: warning in 4.3; the `providers` codemod rewrites literal values.

---

## 12. Tests required

Unit and build tests run in CI (Node, no browser) as providers of QA's L1 Static, L4 Token contrast and L12 Unit lanes. Browser assertions run remotely in QA lanes (no local Playwright, per machine policy). Paths follow SC-30: Jest `*.test.ts(x)` under `tests/tokens/` or colocated `__tests__/`; Playwright `*.spec.ts` under `tests/visual/tokens/`.

| Test file (NEW unless noted) | Asserts |
|---|---|
| `tests/tokens/schema.test.ts` | every `tokens/**/*.tokens.json` validates; fixture with unknown `$type` fails; `$extensions.ag.tier` present on every token |
| `tests/tokens/compiler-guards.test.ts` | build exits 1 for: unresolved alias, cycle, `material` → `ref` alias, preset defining `material.blur.regular`, `createGlassTheme` vars containing `--_ag-` |
| `tests/tokens/determinism.test.ts` | two builds produce identical SHA-256 for every file in `dist/tokens/**` and `tokens/generated/**` |
| `tests/tokens/material-transform.test.ts` | `glass-material` emits exactly 3 variants × 3 thicknesses; blur ≤ 32px; literal `-webkit-backdrop-filter` count = 18 (± tier rows); no `intent`/`elevation` keys |
| `tests/tokens/motion-spring.test.ts` | snappy/smooth/fluid → `linear()` with ≤ 40 stops; last stop exactly `1`; max \|x(t) − linear(t)\| ≤ 0.005 over 1,000 samples (REQ-MOT-04); fixtures with ζ 0.7, ζ 1.1 and response 100 ms rejected; exit durations = 60/80/140/220/320 ms; token values identical with `data-ag-motion` = full/calm/none |
| `tests/tokens/contrast-matrix.test.ts` | re-solves every cell and equals `tokens/generated/opacity-floors.json`; every cell meets REQ-A11Y-16 (`on-surface` ≥ 4.5:1; `on-surface-muted` ≥ 4.5:1 or ≥ 3:1 if `large-only`; non-text, focus bands, disabled ≥ 3:1; ≥ 7:1 under `contrast=more`) over `#ffffff`, `#000000` and the busy minimum of `tokens/contrast/busy-reference.json`; emitted `--_ag-tint-floor` per key = max over presets/schemes/variants; hand-edited floor fixture fails; unsolvable-cell fixture exits 1 naming cell and pair |
| `tests/tokens/oklch.test.ts` | ramps monotone in L with ΔL ≥ 0.03; every `sys.color` leaf emitted as `light-dark()`; hex fallback inside `@supports not`; dark `on-surface` L ≥ 0.92 |
| `tests/tokens/modes-matrix.test.ts` | for each scheme/contrast/transparency/density value an attribute block and a media mirror exist; OS floors re-emitted in `@layer ag.a11y`; `contrast=more` selects ≥ tinted floor row; 0 `prefers-contrast: high`; parsed with `postcss` (no invalid declarations) |
| `tests/tokens/emitted-css.test.ts` | on compiler output only (`dist/css/tokens.css`, `tailwind.css`, `compat/tokens.css`, `src/material/css/generated/*.css`): 0 `!important`; every rule in the expected `ag.*` layer (`:root` only in `ag.tokens`/`ag.compat`); only `@property` unlayered; no class strings in `src/tokens/generated/**`. Package-wide layer/`!important`/class-coverage gates are PRD-02 (`tests/css/layer-order.test.ts`, `no-important.test.ts`, `class-coverage.test.ts`) |
| `tests/tokens/vars-gates.test.ts` | runs `undefined-vars`, `dead-vars`, `tier-skip` against built CSS + `src`; 0 violations; fixtures with a dead var, an undefined var and an unmanifested `--ag-*` in TSX each fail |
| `tests/tokens/literals-lint.test.ts` | ESLint and stylelint `no-raw-design-values` flag `#fff`, `rgba(0,0,0,.2)`, `blur(8px)`, `200ms`, `cubic-bezier(...)` in fixtures; allow in `tokens/**`, generated outputs and `sys.palette.*`; ratchet: a fixture that adds one violation to a baselined file fails, one that removes a violation passes and lowers the baseline |
| `tests/tokens/types-runtime-parity.test.ts` | runtime export keys of `aura-glass/tokens` and `aura-glass/theme` equal `etc/api/<slug>.exports.json` (SC-04); 4.2/4.3: only the two deprecated `getPersona*` type names may differ; 5.0: no `getPersona` |
| `tests/tokens/tailwind-bridge.test.ts` | compiles a fixture with `@tailwindcss/node`; each `@utility glass-*` output byte-equals the compiled attribute rule; `bg-accent/50` produces `color-mix`; `ag-dark:` variant matches under `[data-ag-scheme=dark]` |
| `tests/tokens/shadcn-interop.test.ts` | without shadcn vars, `--background` etc. are emitted from `--ag-*`; with `data-ag-shadcn-source` and shadcn values set, `--ag-color-canvas` resolves to `--background`; no cycle (computed in `jsdom` with a CSS var resolver) |
| `tests/tokens/compat-aliases.test.ts` | every `--glass-*` name with ≥ 1 reader in the 4.x snapshot has an alias; `compat/tokens.css` is in `@layer ag.compat`; alias map equals codemod input |
| `tests/tokens/legacy-freeze.test.ts` | `legacy` platform output equals the 4.1.0 `--glass-*` primitive values (snapshot of `src/styles/tokens.css` computed values) |
| `src/theme/__tests__/color.test.ts` (created by DS-056; A11Y-006 adds its reference vectors by MODIFY) | OKLCH ↔ sRGB vectors, gamut mapping ΔEOK < 0.02, `parseColor` for hex/rgb/hsl/oklch, ΔE2000 |
| `src/theme/__tests__/createGlassTheme.test.ts` | 4.x option names accepted; `mode:"system"` emits media-driven output (not dark); `high-contrast` → `contrast:"more"`; `cssText` scoped to `[data-ag-theme]`; every `vars` key in the manifest; pure (runs in a Node worker with no DOM) |
| `src/theme/__tests__/createBrandTheme.test.ts` | 12-step ramp monotone; low-contrast brand (`oklch(0.85 0.1 95)`) yields `contrast.adjusted.length > 0` and passing pairs; hex/rgb/hsl/oklch inputs equal within ΔE2000 ≤ 0.5 |
| `src/theme/__tests__/presets.test.ts` | exactly 4 presets; each defines light and dark canvas; none defines `material.*`; each passes the contrast matrix |
| `tests/tokens/export.test.ts`, `tests/tokens/export.spec.mjs` (existing, rewritten) | CJS-free ESM import of `aura-glass/tokens`, `aura-glass/tokens.css` resolvable, removed subpaths absent at 5.0 |
| Remote, QA L6 Environment visual: `tests/visual/tokens/modes.spec.ts` | zero-JS page under each emulated preference (`colorScheme`, `forcedColors`, `contrast`, `reducedMotion`) matches the attribute-driven baseline (≤ 0.1 % pixels); computed `--ag-on-surface` differs between light and dark |
| Remote, QA L11 Consumer canaries: `tests/visual/tokens/canaries.spec.ts` | PKG's `canaries/vite-tailwind4` (PKG-128) and `canaries/vite` (PKG-126) built from the packed tarball (`scripts/ci/lib/npm-pack.js`, TRUST-002): each `glass-*` utility equals the attribute-driven surface; zero-Tailwind render; shadcn interchange (AC-DS-10/11) |

## 13. Storybook requirements

- `.storybook/preview.tsx` belongs to SB (SB-048, SC-31): one decorator (`StoryEnvironment` + `StoryRoot`) and the globals `scheme`, `transparency`, `contrast`, `motion`, `density`, `environment` (the 8 SC-28 scenes, which also set `data-ag-backdrop`) with A11Y's SC-23 values. DS registers one additional global through SB, `preset` (`aura|graphite|daylight|midnight`), which `StoryRoot` writes as `data-ag-theme` (DS-095, MODIFY after SB-048). "system" removes the attribute so media mirrors apply. DS does not add a second decorator or its own copies of the axis globals.
- `Tokens.mdx`: generated tables from `dist/tokens/manifest.json` (name, tier, group, value per mode, swatch, consumers count). No hand-written values (TOKENS-THEME-15).
- `ModesMatrix.stories.tsx`: one `Surface` (MAT-047) per variant × thickness on the 8 certification scenes (`certification/scenes/`, QA-038/039, SC-28), all axis combinations reachable via toolbar; `play` asserts computed `--ag-on-surface` changes when `scheme` changes.
- `InteractionStates.stories.tsx`: a grid of `Button`, `IconButton`, `Tabs` item and `Table` row forced into hover / active / selected / focus-visible / disabled / loading / dragging / drop-target via `data-*` attributes (Storybook pseudo-states addon not required); `play` asserts each state changes at least one computed `--ag-state-*`-driven property. Until the FND/CTL flagships exist (CTL-055 Button), the grid renders MAT's `Surface` (MAT-047) with `interactive` and the same `data-*` attributes; the flagship rows are added when those components land (no placeholder components).
- `Presets.stories.tsx`: each preset in light and dark, plus a `createBrandTheme` playground with an OKLCH picker that renders the contrast report (adjusted steps highlighted).
- `ContrastFloors.stories.tsx`: renders `opacity-floors.json` as a heatmap table (text values, not colour-only) with the measured ratio per cell.
- Storybook CSS (`storybook-enhancements.css`, `storybook-utility-shim.css`) is loaded only from `.storybook/` (REQ-DS-44).
- Captures for human visual review run remotely in QA's L14 Human visual review lane, on SB's Lab harness (`.storybook/lab/**`, SB-060); screenshots are CI artifacts (D-32).

## 14. Responsive requirements

- Type: `body` fluid 15–17 px via `clamp()`; display and title roles use `clamp()` with min at 320 px viewport and max at 1440 px; no role below 12 px at any width; text resizes to 200 % without loss (WCAG 1.4.4) because sizes are `rem`-based within the clamp.
- Targets: `--ag-target-coarse` (44 px) applies under `@media (pointer: coarse)` via `--_ag-target` = max(target.min, target.coarse); `--ag-target-min` 24 px under fine pointers (WCAG 2.5.8).
- Density does not auto-switch by viewport; it is an explicit axis. Components use container queries (PRD-04/-10), not viewport breakpoint tokens. No breakpoint tokens are emitted except `sys.breakpoint.{sm 640, md 768, lg 1024, xl 1280}` for the Tailwind bridge `@theme` (Tailwind defaults kept aligned).
- Blur budgets differ by pointer (≤ 6 surfaces fine, ≤ 3 coarse, architecture §4.7); this PRD emits no per-breakpoint blur values, so mobile does not get a second material.
- Space tokens are px-based multiplied by density; spacing tokens are not fluid (predictable layout for concentric radii).

## 15. Accessibility requirements

- Contrast: solved floors guarantee ≥ 4.5:1 normal text, ≥ 3:1 large text and non-text (borders of inputs, focus ring both tones), ≥ 7:1 under `contrast=more`, over white, black and busy composites, for every preset and mode (WCAG 1.4.3, 1.4.6, 1.4.11). APCA reported as advisory only.
- Focus: `--ag-focus-width` 2 px two-tone ring (`--ag-focus-inner`/`--ag-focus-outer`) with ≥ 3:1 against both the surface and the backdrop; never suppressed by any mode; in forced colours it is `Highlight` (WCAG 2.4.7, 2.4.13 informative).
- OS preferences are floors (D-11): `prefers-contrast: more`, `prefers-reduced-transparency: reduce`, `forced-colors: active`, `prefers-reduced-motion: reduce` each have token-level effects that no app or user setting can lower.
- Forced colours: every `sys.color` role maps to a system colour (`Canvas`, `CanvasText`, `LinkText`, `Highlight`, `HighlightText`, `GrayText`, `ButtonFace`, `ButtonText`); shadows and specular resolve to `none`.
- Motion: token values are mode-independent; `calm`/`none` behaviour, the settled-state invariant and the no-loop rule are PRD-06 (REQ-MOT-20/-21/-23). This PRD guarantees no emitted easing has a y control point outside [0, 1] (no overshoot curves) and that every spring has ζ ≥ 0.8 (overshoot ≤ 1.5 %).
- State is never colour-only: selected and drop-target tokens include a rim/weight change in addition to tint; `disabled` keeps text ≥ 3:1.
- Text spacing: tokens tolerate WCAG 1.4.12 overrides (line-height 1.5, letter spacing 0.12 em) without clipping; type tokens set `line-height` unitless.
- Targets per §14.

## 16. Performance requirements (numeric budgets)

Byte budgets are min+gz integer rows that DS submits to `docs/size-budgets.json` (PKG-048; schema and gate `scripts/ci/verify-size-budgets.mjs`, PKG-049; no `size-limit`, `.size-limit.json` or `build/budgets.lock.json`, SC-15). PERF REQ-PERF-01 sets default ceilings; a DS row may be stricter, never looser. The runtime row (scheme-toggle style recalc) is requested in PERF's `tests/perf/harness/budgets.json` (PERF-039). Numbers are provisional until QA L10 calibrates them at 5.0.0-alpha.1, then ratchet down only (D-26). Sub-budgets marked "this PRD" are new and sit inside architecture §3.6.

| Metric | Budget |
|---|---|
| `styles.css` total (architecture §3.6) | ≤ 32 KB gz (49.9 KB today) |
| `tokens.css` (this PRD; modes, shadcn interchange, excluding preset blocks) | ≤ 8 KB gz |
| preset blocks inside `tokens.css` (4 presets) | ≤ 2 KB gz (so `tokens.css` total ≤ 10 KB gz) |
| `material.css` (assembled by PRD-04; this PRD's generated ladders/floors/properties are inside it) | ≤ 8 KB gz total per REQ-MAT-70 |
| `tailwind.css` bridge (excluding imported `tokens.css`) | ≤ 3 KB gz target, inside PRD-02's REQ-PKG-42 ceiling of ≤ 6 KB gz |
| `compat/tokens.css` | reported, not counted in `styles.css` (D-18); ceiling ≤ 8 KB gz (DS row in `docs/size-budgets.json`) |
| Public `--ag-*` count | ≤ 260 (manifest); private `--_ag-*` ≤ 200; total custom properties in `styles.css` ≤ 460 (1,430 today) |
| Dead vars / undefined vars | 0 / 0 |
| `!important` | 0 (200 in `src/styles` today) |
| `@property` registrations | ≤ 16 (only animatable or typed-inheritance vars) |
| `aura-glass/tokens` JS (`token()`, typed map, no raw values) | ≤ 2 KB gz; `materialSpec` tree-shakable and excluded unless imported |
| `createGlassTheme` + `createBrandTheme` + OKLCH conversion | ≤ 3 KB gz combined; `createBrandTheme` call ≤ 2 ms median in Node 20 on CI runner |
| Token build (`npm run build:tokens`, full matrix incl. contrast solve) | ≤ 20 s on the CI runner; contrast solve ≤ 10 s |
| Gates (`scripts/tokens/gates/*` total) | ≤ 30 s |
| Style recalc on scheme toggle (QA L10 Performance via PERF's harness, 6-surface scene, mid-tier Android profile; row in `tests/perf/harness/budgets.json`) | ≤ 8 ms per toggle; no layout (attribute change on `<html>` triggers style + paint only) |
| Pre-paint correctness (owned and measured by PRD-05 `AuraGlassScript`; listed because it depends on this PRD's attribute-keyed CSS) | 0 frames rendered in the wrong scheme with `AuraGlassScript` present (QA first-frame capture) |

## 17. Acceptance criteria

- **AC-DS-01** At 5.0.0-beta.1 the `literals` gate (ESLint + stylelint `no-raw-design-values` + `gates/literals.mjs`) reports 0 violations across all `src/**/*.{ts,tsx,css}` with no directory exclusions, `scripts/tokens/gates/literals-baseline.json` is empty, and the only exempt paths are those listed in REQ-DS-33. Before beta, CI shows no per-file increase over the baseline on any PR.
- **AC-DS-02** S1–S9 and the four generators are absent from `main` at 5.0.0 (`rg --files` returns 0 for each path in REQ-DS-41).
- **AC-DS-03** `npm run build:tokens` twice → `git diff --exit-code` passes; build ≤ 20 s.
- **AC-DS-04** Contrast matrix: 100 % of cells pass; cell count logged and equal to 4 presets × 2 schemes × 2 contrast × 3 transparency × 5 variant forms × 3 thicknesses × 3 declared backdrops = 2,160 cells, each evaluated over 3 composites for every REQ-A11Y-16 pair; `opacity-floors.json` re-solve diff = 0.
- **AC-DS-05** `undefined-vars` = 0 and `dead-vars` = 0 for every importable CSS entry; public `--ag-*` ≤ 260; total custom properties in `styles.css` ≤ 460.
- **AC-DS-06** Compiler output contains 0 `!important` and 0 `prefers-contrast: high`, and every emitted rule is in its expected `ag.*` layer (`tests/tokens/emitted-css.test.ts`); package-wide equivalents are AC-PKG-14 (PRD-02) and AC-A11Y-07.
- **AC-DS-07** Types-vs-runtime parity for `aura-glass/tokens` and `aura-glass/theme`: 0 mismatched names.
- **AC-DS-08** Zero-JS page under each of 6 emulated OS preferences matches the attribute-driven baseline within 0.1 % changed pixels (QA L6 Environment visual, remote, Chromium, WebKit, Gecko; pixel rule per SC-09).
- **AC-DS-09** Under emulated `forced-colors: active` with `data-ag-transparency="glass"` on `<html>`, computed `backdrop-filter` on every `[data-ag-surface]` is `none` (OS floor wins).
- **AC-DS-10** Tailwind v4 canary (packed tarball) builds; each `glass-*` utility's computed style equals the attribute-driven surface (0 property differences); the zero-Tailwind Vite canary renders with no Tailwind installed.
- **AC-DS-11** shadcn canary: a stock shadcn `Button` inside an AuraGlass app picks up `--primary`/`--ring` from `--ag-*`; with `data-ag-shadcn-source`, AuraGlass `Button` picks up the app's `--primary`; no cycle warning.
- **AC-DS-12** `createGlassTheme({ mode: "system" })` renders light under `prefers-color-scheme: light` (fixes TOKENS-THEME-06); every emitted var has ≥ 1 consumer.
- **AC-DS-13** `createBrandTheme` with 20 fixture brand colours spanning hue 0–360 and L 0.3–0.9 yields 100 % passing text pairs.
- **AC-DS-14** Frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (REL-115) on 4.2 and 4.3: 0 changed pixels per REL's `visual-class.mjs` (SC-09) outside REL's D-28 labelled-fix list (this PRD's entries: navy dark text; `--glass-opacity-*`; other PRDs' entries such as the `prefers-contrast: more` fix are classified by their owners).
- **AC-DS-15** `compat/tokens.css` covers 100 % of `--glass-*` names read in the 4.x snapshot; the `css-vars` codemod (DX-050) rewrites 100 % of literal references in its `packages/cli/src/migrate/4to5/__fixtures__/css-vars/` suite.
- **AC-DS-16** Size budgets in §16 met by `scripts/ci/verify-size-budgets.mjs` against the DS rows in `docs/size-budgets.json`.
- **AC-DS-17** `rg -o -- "--ag-[a-z0-9-]+" src` returns no name absent from `dist/tokens/manifest.json` (the 28 names in §2.3 are `--_ag-*`).

## 18. Definition of done

- All REQ-DS-01..44 implemented, each linked from its PR to the test that proves it.
- All AC-DS-01..17 green in CI on `main`; remote QA lanes (L4, L6, L10, L11) attached as CI artifacts, not committed (D-32).
- Architecture §16 PRD-03 exit criterion met: `tokens.css` + TS generated and the contrast matrix runs in CI.
- Manifest included in the API report (`etc/api/`, SC-04); repo-root `deprecations.json` (SC-02) has entries for every C-D in §9/§10, and the generated migration guide section for tokens/themes renders.
- Storybook stories in §13 exist and pass their `play` assertions; human visual review of the remote captures signed off by the design-system owner.
- `docs/design-tokens.md` and `docs/theme/theme-engine.md` replaced by generated pages (PRD-DX hand-off).
- No open TOKENS-THEME-01..16 finding remains unaddressed or without an owning PRD.
- 4.2 and 4.3 deliverables in §20 shipped without pixel changes beyond D-28.

## 19. Dependencies (other PRDs)

Keys per SC-01. "Anchor" is the task id that DS tasks put in `depends_on` (SC-40).

| PRD (key, §16 id) | Relationship | Anchor tasks |
|---|---|---|
| TRUST (PRD-00) | 4.1.1 contents only (SC-36). The 4.1.1 scope does not include any DS item: the `getPersona*` C-D and the `--glass-opacity-*` fix move to 4.2. TRUST owns the D-31 font decision (REQ-TRUST-46/-47), consumed as "system stack default", the API scripts and the `deprecations.json` seed | TRUST-002 npm-pack, TRUST-072 export snapshot, TRUST-075 deprecations seed |
| REL (PRD-01; interim §16 PRD-17) | API report (manifest inclusion), `deprecations.json` schema, gen-deprecations, change class, visual-class gate for the D-28 fixes, frozen 4.x fixture; holds the 4.2/4.3 bridge scope (SC-37) | REL-003, REL-010, REL-013, REL-040, REL-052, REL-115, REL-116 |
| PKG (PRD-02, **upstream, blocking**) | exports manifest and `dist/css/` placement, size-budget file and gate, dependency allowlist, lint wiring, pipeline job names, `src/styles/index.css`, canaries; owns the package-wide layer-order, `!important`, no-globals, class-coverage, Storybook-CSS and Tailwind-string gates (REQ-PKG-90..97) | PKG-005, PKG-015, PKG-038, PKG-048, PKG-049, PKG-056, PKG-101, PKG-126, PKG-128 |
| MAT (PRD-04) | consumes `MaterialSpec`, the generated `src/material/css/generated/*.css` (never hand-edited, OV-31) and solved floors; assembles `material.css`; owns the `data-ag-*` registry (SC-21) | MAT-015 `material.css`, MAT-047 `Surface` |
| A11Y (PRD-05) | consumes mode tokens, OS-floor blocks and `dist/contrast-matrix.json`; owns the contrast contract (REQ-A11Y-15..18), the WCAG maths in `color.ts`, the preference store and values (SC-23), `AuraGlassProvider`, `AuraGlassScript`, provider consolidation | A11Y-002 matrix contract, A11Y-029 provider, A11Y-032 `AuraGlassScript` |
| MOT (PRD-06) | owns motion token values (MOT §4.2, including `ambient`) and the `calm`/`none` CSS; edits `tokens/sys/motion.tokens.json` values-only after DS-026; consumes `src/motion/tokens.generated.ts` (DS-053) | none (MOT depends on DS-026/DS-053/DS-083) |
| FND (PRD-07/14/16) | prop grammar and parts; inventory REMOVE families that hold raw literals and theme demos | FND-129 (last family removal), FND-130 (beta removal check) |
| CTL, OVL, NAV, DATA, AI, MED (PRD-08..13) | consume `sys`/`comp` tokens and the REQ-DS-19 interaction contract; submit `comp.*` and `sys.*` rows (for example NAV app-shell, MED `scrim.media`) as DS row requests | none |
| DX (PRD-18/20) | consumes `compat-alias-map.json` (`css-vars` codemod) and `registry-cssvars.json`; owns `registry/**`, compat adapters, docs app and guides | DX-050, DX-068, DX-101, DX-124 |
| QA (PRD-19 certification) | hosts L1 Static and L4 Token contrast (DS gates as providers), L6, L10, L11, L14; scenes; Playwright configs; deletes `design-system-compliance.yml` | QA-018, QA-038, QA-039, QA-078, QA-081, QA-087 |
| SB (PRD-19 Storybook/Lab) | `.storybook/preview.tsx` and the Lab harness; DS registers the `preset` global through SB | SB-048, SB-060 |
| PERF | default byte ceilings (REQ-PERF-01) and the runtime budget file | PERF-039 |

## 20. Execution order

1. **4.2 items deferred from 4.1.1 (SC-36; on `release/4.x`, REL train):** `getPersona*` become C-D in the emitted `.d.ts` with a `deprecations.json` entry (removed in 5.0); fix `--glass-opacity-24/32/52/72` references in `GlassTransitions.tsx:410,867,869` and `AdvancedAnimations.tsx:255` as a D-28 labelled visual fix (update `src/components/animations/__snapshots__/GlassTransitions.test.tsx.snap`). Nothing from this PRD ships in 4.1.1.
2. **Freeze 4.x rendered values** into `tokens/legacy/4x-rendered.tokens.json` (REQ-DS-42) and snapshot test `legacy-freeze.test.ts`.
3. **Scaffold** `tokens/$schema.json`, `scripts/tokens/build.mjs` with Style Dictionary 4 pinned; port `build-tokens.js` behaviour (manifest check, prettier); land schema/guard/determinism tests.
4. **Author `ref` and `sys`** (OKLCH colour, type, space, shape, motion, interaction, environment, elevation) and the `modes/*` files; land `tokens.css` emitter with layers, media mirrors, `@property`.
5. **Implement transforms** `glass-material`, `motion-spring`, `contrast-solve`; commit `opacity-floors.json`; contrast matrix in CI (PRD-03 exit criterion; QA L4, with an interim `Glass Quality Gates` step until L4 exists).
6. **Gates on** (as providers of QA L1 Static, QA-078; interim step in PKG's `glass-pipeline.yml` until L1 exists): undefined-vars, dead-vars and types-runtime fail closed on compiler output from the first commit; the literals gate fails closed against `literals-baseline.json` (no increase) from the same commit and ratchets to 0 by 5.0.0-beta.1; tier-skip fails closed. Retire `token-lint.js`, `check-undefined-custom-props.mjs`, `audit-css-var-coverage.js` once the new gates report a superset of their findings on HEAD (diff attached to the PR).
7. **4.2 release items:** dark-text fix (D-28) in the generated tokens with composites; marketing/navigation `--ag-*` → `--_ag-*`; experimental `aura-glass/material` generated by this compiler (contents MAT/DS, release scope REL per SC-37); C-D on token subpaths and Tailwind v3/UnoCSS presets. (The bridge train, interim owner REL, lands the hand-written `prefers-contrast: more` fixes; PKG-101 moves Storybook CSS.)
8. **Presets and theme functions:** 4 presets; `createGlassTheme` new return shape + mapped options; `createBrandTheme`; tests; Storybook stories (§13).
9. **Bridges:** `tailwind.css`, shadcn interchange, registry `cssVars`; canaries in QA L11 on PKG's canary apps.
10. **4.3 release items:** `compat/tokens.css` + alias map (to DX-050); C-D on `--glass-*` vars, mode hooks, personas, `createBrandGlassTheme`, `createGlassThemeCssVars`, `comfortable`, `high-contrast`.
11. **5.0 alpha:** switch `styles.css` to `--ag-*` only; delete S1–S9 and generators (REQ-DS-41); calibrate §16 budgets in QA L10 at 5.0.0-alpha.1 and ratchet down only.
12. **5.0 beta → GA:** all AC-DS green across the engine matrix; generated docs handed to PRD-DX; sign-off per §18.

## 21. Open items

Status as of 2026-10-06, after reconciling with `_shared-contracts.md` (SC-08, SC-12, SC-15, SC-17..21, SC-23, SC-28..31, SC-33, SC-36, SC-39, SC-40) and `_verification-remaining-concerns.md` §DS. Items resolved by a registry row are listed at the end with the row that resolves them.

| Id | Item | Owner | How to close |
|---|---|---|---|
| OI-01 | SC-36 moves the `getPersona*` change and the `--glass-opacity-*` fix from 4.1.1 to 4.2 (C-D for `getPersona*`, D-28 visual fix for opacity). The registry marks this as needing human confirmation. | TRUST (4.1.1 scope), REL (4.2 train) | Record the decision in `docs/release/decisions/`. If 4.1.1 re-admits them, restore the 4.1.1 rows in §9/§20 and retarget DS-001..006 to `release/4.x` at 4.1.1. |
| OI-02 | `data-ag-theme` (D-A) and `data-ag-shadcn-source` (D-B) are not in the SC-21 attribute registry. | MAT (SC-21 registry), architecture owner (E-03) | MAT adds both to the ratified additions with DS as owner, or the registry rejects them and DS replaces them (presets would then need a class or a `:where()` scope). |
| OI-03 | Density values: SC-23 lists the preference as `comfortable|compact`, but this PRD's axis is `compact|regular|spacious` and `GlassDensity "comfortable"` is C-D (§10). §4.4 currently maps preference `comfortable` → attribute `regular`. | A11Y (SC-23), REL (registry) | The registry picks one value set for both the store and the attribute. If it keeps `comfortable`, drop the C-D row for `"comfortable"` in §10 and the `providers` codemod rewrite in §11.9. |
| OI-04 | SB-048 still lists contrast `default|more` and motion `os` (SC-23 requires `standard` and `system`) and does not yet include the DS `preset` global. | SB | SB-048 adopts the SC-23 values. DS-095 adds `preset` as a MODIFY after SB-048. |
| OI-05 | Resolved 2026-10-06: A11Y-002 moved the matrix contract to `tests/a11y/contrast/matrix-contract.json` (outside `tokens/`, SC-18), and A11Y-001 is now a consumer test of DS-033. | A11Y | Closed. DS-057 depends on A11Y-002. |
| OI-06 | SC-18 names `dist/tokens.css`, but PKG (REQ-PKG CSS list) and this PRD place CSS in `dist/css/` (`dist/css/tokens.css`, `dist/css/tailwind.css`, `dist/css/compat/tokens.css`). | REL (registry), PKG | Correct the SC-18 row to `dist/css/tokens.css`. PKG's exports manifest is authoritative. |
| OI-07 | `src/material/css/generated/properties.css` (`@property` registry) is emitted by this compiler but missing from SC-18's generated-output list. OV-31 covers `src/material/css/generated/*`. | REL (registry) | Add `properties.css` to SC-18. |
| OI-08 | Resolved in the fragments 2026-10-06: DS owns the `src/theme/color.ts` edits (DS-055) and creates `src/theme/__tests__/color.test.ts` (DS-056). A11Y-003/004 are consumer tests and A11Y-006 is a MODIFY. The registry §H has no row for these files yet. | REL (§H) | Add an OV row: `color.ts`/`color.test.ts` owned by DS, with A11Y as consumer. |
| OI-09 | Floors are the maximum over presets, schemes and variants per `[transparency][thickness][backdrop]` (REQ-DS-15). This matches MAT's key but can give light presets higher floors than they need. | MAT | MAT confirms in REQ-MAT-33, or asks for a per-scheme floor row (one extra key and a new AC-DS-04 cell count). |
| OI-10 | The 4.2 navy dark-text fix through `tokens/legacy` does not yet name which legacy `--glass-*` values change. | DS | DS-102 lists the exact changed legacy names and values. REL-089 classifies the result as one D-28 labelled change on the frozen fixture. |
| OI-11 | Non-token content of `src/styles/premium-typography.css` (typography rules) and `keyframes.css` (keyframes), both deleted by REQ-DS-41, has no owner. | REL (registry) | Assign it: keyframes to MOT (as with MOT-084 `glass.css`), typography rules to FND or PKG. DS-111 deletes only after the owner's migration task is done. |
| OI-12 | The DTCG `2025.10` format version, the shadcn CLI v4 `cssVars` schema and the browser floors (§11.7) come from research docs and were not re-checked live. | DS (versions), QA (engine lanes) | DS-014 and DS-091 record the checked versions at implementation. QA L8 engine lanes confirm the `oklch()`/`light-dark()`/relative-colour floors. |
| OI-13 | No DX task generates the token docs page from `dist/tokens/manifest.json`. DS-118 currently depends on DX-101/DX-124. | DX | DX adds a `scripts/docs/gen-tokens.mjs` task, and DS-118 retargets its dependency to it. |
| OI-14 | Other fragments must change to match the DS-owned contracts: MOT-020 (values-only MODIFY on DS-026), MOT-024 (dropped), MOT-026 (after DS-083), MOT-076/085 (dropped; DS-109 removes `designConstants.ts`), PKG-109/112 (drop; DS-112/079 remove), PKG-133 (consumer of `tests/fixtures/consumer-4x/`), QA-079 (literals read from the DS baseline). | MOT, PKG, QA | Each owner edits its own fragment. REL's proposed `scripts/release/verify-task-graph.mjs` (SC-40, not yet built) checks that there is one CREATE per file. |

Resolved by the registry, so no action in this PRD:
- Motion source path: `tokens/sys/motion.tokens.json` is canonical (SC-18). MOT must edit REQ-MOT-01; see OI-14.
- "Backdrop" vs composites: SC-28 defines "backdrop" as the declared axis and white/black/busy as composites. A11Y renames its usage in REQ-A11Y-15.
- Literal baseline ≈1,890: SC-17 says the first gate run (DS-073) sets the real number.
- Press-scale and Card-hover deviations: rejected by SC-38, which matches REQ-DS-19 ("light response, not scale"). That rejection still needs human confirmation under SC-38.
- Size-budget source: `docs/size-budgets.json` (SC-15). DS-117 is a MODIFY after PKG-048.
- Frozen fixture: `tests/fixtures/consumer-4x/` (SC-08). DS-103/116 use it, and `canaries/v4-frozen/` is not used.
