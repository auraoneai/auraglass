# PROMPT-03e (DS): presets, `createGlassTheme`, `createBrandTheme`, Tailwind v4 bridge, shadcn interchange, Storybook

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (PRD-03, §4.5, §4.6, §5.8, §5.10, §13). Requirements: REQ-DS-25, REQ-DS-26, REQ-DS-27, REQ-DS-28, REQ-DS-29, REQ-DS-38, REQ-DS-40, REQ-DS-44. Acceptance: AC-DS-12, AC-DS-13, plus the unit halves of AC-DS-10 and AC-DS-11 (03f runs the canaries). Tasks: `docs/auraglass-5/tasks/DS.json` DS-081..DS-100. Architecture: §5.4 (presets replace personas), §5.5 (Tailwind/shadcn), deviations D-A (`data-ag-theme`), D-B (`data-ag-shadcn-source`), D-C (`content-sunken`, `ag-contrast-more`) in PRD §10.

Contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding. The rows that apply here: SC-12 (PKG owns exports), SC-18 (`createGlassTheme.ts` is DS-owned; MOT-026 MODIFYs it after DS-083), SC-21 (the attribute registry is MAT's; `data-ag-theme`/`data-ag-shadcn-source` still need ratification, PRD §21 OI-02), SC-23 (preference values are A11Y's), SC-28 (scenes), SC-31 (`.storybook/preview.tsx` is SB's: one decorator, and other PRDs register globals through SB), SC-32 (DX owns `registry/**`) and SC-38 (light response only, no press scale).

## 0. Common rules (binding)

- Remote-first. Node-only Jest may run locally. Storybook build, story `play` runs, browser captures and full `npm run build` run remotely: in GitHub Actions on `auraoneai/auraglass` (choose per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 worker via the `auraone-remote-run` skill. Never use local Docker. Never run `storybook dev` with a browser or Playwright locally.
- Don't fake completion:
  - no placeholder components in stories (PRD §13: flagship rows are added only when those components exist);
  - no hard-coded contrast results;
  - no silent contrast pass for a brand colour;
  - no `test.skip`, no lowered thresholds, no snapshot or baseline updates to get to green.
- `createGlassTheme`/`createBrandTheme` must never emit `material.*` or `--_ag-*` keys (REQ-DS-02 guard).

## 1. Prerequisites (verify; on failure stop and report)

1. 03b and 03c merged: `tokens/generated/opacity-floors.json` exists, and `npx jest tests/tokens/contrast-matrix.test.ts src/theme/__tests__/color.test.ts` passes.
2. 03d merged (gates exist), so `vars` keys can be checked against the manifest with consumer counts.
3. MAT `Surface` (MAT-047, owner prompt `PROMPT_04_MAT`) exists for the stories: `rg --files src/material | rg "Surface\.tsx$"`. If it's missing, DS-097/DS-098 are blocked; build the other stories and report.
3a. SB preview (SB-048, owner prompt `PROMPT_17_SB`): `.storybook/preview.tsx` has the single `StoryEnvironment` + `StoryRoot` decorator. If it's missing, DS-095..DS-100 are blocked on SB-048. Do not rewrite the preview yourself.
3b. QA scenes (QA-038/039, owner prompt `PROMPT_18_QA`): `certification/scenes/scenes.manifest.json` lists the 8 SC-28 ids.
4. PKG exports (PKG-005, owner prompt `PROMPT_02_PKG`) for `./tailwind.css` and `./tokens.css`; there is no `./tokens.json` row (SC-12): `node -e "console.log(Object.keys(require('./package.json').exports))"`. If they're missing, the canaries in 03f are blocked, but the unit tests here still run against `dist/css/`.
5. PKG-101 (REQ-PKG-94) moved the Storybook CSS: `rg -n "storybook-(enhancements|utility-shim)" src/styles/index.css` returns 0. If it doesn't, don't move the files yourself (PKG owns that); still make sure none of your stories imports them.

## 2. File scope

May touch:
- MODIFY `scripts/tokens/formats/ts-constants.mjs` (emit `src/tokens/generated/presets.ts`); NEW `scripts/tokens/formats/{tailwind-bridge,registry-cssvars}.mjs`; MODIFY `scripts/tokens/formats/css-layered.mjs` (shadcn interchange); MODIFY `scripts/tokens/build.mjs` (cycle check);
- REDESIGN `src/theme/createGlassTheme.ts`; NEW `src/theme/createBrandTheme.ts`, `src/theme/presets.ts`; MODIFY `src/theme/createBrandGlassTheme.ts`, `src/theme/index.ts`;
- NEW `src/theme/__tests__/{createGlassTheme,createBrandTheme,presets}.test.ts`, `src/theme/__tests__/fixtures/brand-colors.json`; NEW `tests/tokens/{tailwind-bridge,shadcn-interop}.test.ts`, `tests/tokens/fixtures/tailwind/**`; MODIFY `tests/tokens/emitted-css.test.ts` (add `dist/css/tailwind.css`);
- MODIFY `.storybook/preview.tsx` (only the `preset` global and its `data-ag-theme` write inside SB's `StoryRoot`, after SB-048); NEW `src/design-system/stories/{Tokens.mdx,ModesMatrix.stories.tsx,InteractionStates.stories.tsx,Presets.stories.tsx,ContrastFloors.stories.tsx}`;
- MODIFY `package.json` (devDependencies `@tailwindcss/node`, `tailwindcss` 4.x exact; `@storybook/test-runner` exact, only if SB/QA haven't already provided a story-interaction lane).

Must not touch: `src/theme/GlassThemeProvider.tsx`, `ThemeProvider.tsx` and the other providers (PRD-05), `registry/**` (DX-067/068), `src/material/**` other than imports (MAT), SB's decorator and axis globals in `.storybook/preview.tsx` (SB-048), `.storybook/lab/**` (SB-060), `tokens/**/*.tokens.json` (except a preset canvas fix proven necessary by the solver, recorded in the report).

## 3. Steps

### DS-081..DS-082 Presets (REQ-DS-25)
1. `ts-constants` emits `src/tokens/generated/presets.ts`: `export const presets: Record<PresetId, ThemePreset>` holding the 4 presets from `tokens/presets/*.tokens.json`, `PresetId = 'aura'|'graphite'|'daylight'|'midnight'`, and `ThemePreset = { id, name, canvas:{light:Oklch,dark:Oklch}, neutralHue:number, accent:Oklch, radiusScale?:0.75|1|1.25 }`. `src/theme/presets.ts` re-exports these. No persona narrative metadata (`designMatrix.ts:105-128`) appears in any runtime export.
2. `src/theme/__tests__/presets.test.ts`: there are exactly 4 presets; each has a light and a dark canvas; no preset source has a `material.*` key; each preset's cells in `opacity-floors.json` all pass (from the committed matrix); each `[data-ag-theme=<id>]` block in `tokens.css` overrides only `ref.color.*` and `sys.color.{canvas,accent,on-accent,border}` vars (parse and compare with an allowlist).

### DS-083..DS-084 `createGlassTheme` (REQ-DS-26, REQ-DS-27, AC-DS-12)
3. Rewrite `src/theme/createGlassTheme.ts` on the compiler output. DS owns the file (SC-18, DS-083), and MOT-026 later verifies the motion mapping as a MODIFY.
   - Keep the 4.x option names `id`, `name`, `brandColor`, `accentColor`, `mode`, `density`, `motionPolicy` (`:62-70`) and add `preset`, `neutralHue`, `radiusScale`, `contrast`.
   - Map the old values:
     - `mode:"system"` → no scheme pin. The output relies on the media mirror; the `isLight = mode === "light"` bug at `:128` goes away.
     - `mode:"high-contrast"` → `contrast:"more"`, with a dev warning in 4.3.
     - `density:"comfortable"` → `"regular"`, with a dev warning in 4.3. SC-23 keeps `comfortable|compact` as A11Y preference values, which is an open conflict (PRD §21 OI-03). Implement the mapping, and report the C-D warning as pending OI-03.
     - `motionPolicy`: `"reduced"`→`calm`, `"expressive"`→`full` + `allowContinuous:true`, `"system"`→ follows the OS, `"none"`→`none` (PRD-06 REQ-MOT-07). `pointerLight` isn't touched (D-04).
   - Return `{ id, name, cssText, vars, contrast: ContrastReport, tokens }`:
     - `cssText` is exactly one rule `[data-ag-theme="<id>"]{…}`, with no `:root`;
     - `vars` is `Record<\`--ag-${string}\`, string>` with manifest names only;
     - `ContrastReport = { pairs: {pair, ratio, threshold, pass}[], adjusted: {token, from, to, reason}[], brandOnBackground, textOnSurface, textOnBrand }`. Keeping the three 4.x numeric fields is a compatibility choice; record it as a deviation note.
     - Remove `GlassThemeTokens.density.{controlHeight,gap,pagePadding}` (zero readers; C-B at 5.0, already C-D in 4.3 via DS-106).
   - Custom canvases are checked against the emitted `--_ag-tint-floor` values (REQ-DS-15). If a canvas fails, move canvas L (then C) by the minimum amount that passes and list it in `adjusted[]`.
   - The module is pure: no `"use client"`, no `window`/`document`/`matchMedia`. Inputs accept hex/`rgb()`/`hsl()`/`oklch()` via `parseColor` from `src/theme/color.ts`.
4. `src/theme/__tests__/createGlassTheme.test.ts`:
   - every 4.x option name is accepted;
   - `mode:"system"` output contains no `data-ag-scheme`/`color-scheme: dark` pin;
   - `high-contrast` → `contrast:"more"`;
   - `cssText` matches `/^\[data-ag-theme="[^"]+"\]\{[^}]*\}$/` and contains no `:root`;
   - every `vars` key is in `dist/tokens/manifest.json` with `consumers ≥ 1` (0 unknown keys);
   - no `--_ag-` key;
   - a pure-function check: run inside `new Worker` (`worker_threads`) with no jsdom, and fail if `document` is touched;
   - 4 colour syntaxes give equal output within ΔE2000 ≤ 0.5.

### DS-085..DS-086 `createBrandTheme` (REQ-DS-28, AC-DS-13)
5. `src/theme/createBrandTheme.ts`: `createBrandTheme(brand: string | Oklch, opts?: { accentShift?: number; preset?: PresetId }): GlassTheme`.
   - It builds a 12-step accent ramp. The CSS uses relative colour syntax `oklch(from <brand> calc(l + Δ) c h)`, and precomputed literal fallbacks are emitted inside `@supports not (color: oklch(from red l c h))` (PRD §11.7).
   - The same ramp is computed in TS for the report.
   - For each step used for text, if `on-accent` < 4.5:1, move that step's L by the minimum amount that passes, list it in `adjusted[]`, and `console.warn` the step name when `process.env.NODE_ENV !== 'production'`.
   - Combined gz size of `createGlassTheme` + `createBrandTheme` + the OKLCH helpers is ≤ 3 KB.
6. `src/theme/__tests__/createBrandTheme.test.ts`:
   - the ramp is monotone in L;
   - `oklch(0.85 0.1 95)` gives `adjusted.length > 0`, every pair passes, and a dev warning is emitted (spy on `console.warn`);
   - `fixtures/brand-colors.json` holds 20 colours covering hue 0–360 in 18° steps and L 0.3–0.9; every text pair must pass for all 20 (AC-DS-13);
   - the median call time over 200 calls is ≤ 2 ms (logged; the CI runner is authoritative).

### DS-087..DS-089 Deprecations and exports (REQ-DS-29)
7. `src/theme/createBrandGlassTheme.ts` re-exports `createBrandTheme` as `createBrandGlassTheme`, with a one-time dev warning `createBrandGlassTheme is deprecated; use createBrandTheme` (C-D, cherry-pick to `release/4.x` for 4.3). In `createGlassTheme.ts`, `createGlassThemeCssVars` (`:206`) becomes a C-D wrapper that returns the 4.x `--glass-theme-*` output and warns. It's deleted in 5.0 (03f, DS-109).
8. `src/theme/index.ts` exports `createGlassTheme`, `createBrandTheme`, `presets`, and the types `ThemePreset`, `PresetId`, `GlassTheme`, `ContrastReport`. Run `npm run gates:tokens` (types-runtime) and the PRD-01 API report update (`etc/api/theme.api.md`). The API diff is reviewed as C-E plus the listed C-D/C-B items.

### DS-090..DS-091 Tailwind v4 bridge (REQ-DS-38, D-C)
9. `formats/tailwind-bridge.mjs` → `dist/css/tailwind.css`. It contains:
   - the layer order statement;
   - `@import "./tokens.css";`;
   - `@theme inline { --color-<role>: var(--ag-<role>); --radius-<n>: var(--ag-radius-<n>); --ease-<n>: …; --duration-<n>: …; --shadow-<n>: …; --text-<role>: var(--ag-type-<role>-size); --breakpoint-sm: 640px … }` covering every public `sys` colour, radius, ease, duration, shadow read-out and type size;
   - `@utility glass-regular|glass-clear|glass-thin|glass-thick|content-raised|content-sunken`, each carrying the declarations copied byte-for-byte from the compiled `[data-ag-variant]`/`[data-ag-thickness]` rule (generated from the same AST nodes);
   - `@custom-variant ag-dark (&:where([data-ag-scheme=dark], [data-ag-scheme=dark] *))`, plus `ag-tinted`, `ag-solid`, `ag-contrast-more`.
   - There is no JS preset. Size ≤ 3 KB gz excluding `tokens.css`.
10. `tests/tokens/tailwind-bridge.test.ts` uses `@tailwindcss/node` (pinned exact devDependency) to compile `fixtures/tailwind/input.css` (`@import "../../../dist/css/tailwind.css"; @source "./index.html";`, with classes `glass-regular glass-thin content-sunken bg-accent/50 ag-dark:bg-canvas`). It asserts:
    - each `@utility` output equals the attribute rule's declarations byte-for-byte;
    - `bg-accent/50` compiles to `color-mix(in oklab, var(--color-accent) 50%, transparent)`;
    - `ag-dark:` output is scoped by `[data-ag-scheme=dark]`.

### DS-092..DS-094 shadcn interchange + registry cssVars (REQ-DS-40, D-B)
11. `css-layered.mjs` adds, inside `@layer ag.tokens`, `--ag-color-canvas: var(--background, <default>)` style reads for `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius`. These reads apply only under `:root[data-ag-shadcn-source]`. It also emits the same eight names from `--ag-*` under `:where(:root:not([data-ag-shadcn-source]))`. `build.mjs` adds a cycle check over the resolved var graph in both modes and exits 1 on a cycle.
12. `tests/tokens/shadcn-interop.test.ts` (jsdom plus a small `var()` resolver that walks the parsed `tokens.css`):
    - without the attribute, `--primary` resolves to the `--ag-accent` value;
    - with `data-ag-shadcn-source` and `--primary: oklch(0.6 0.2 30)`, `--ag-accent` resolves to it;
    - neither mode contains a cycle;
    - a cycle fixture fails the build.
13. `formats/registry-cssvars.mjs` → `dist/tokens/registry-cssvars.json` `{cssVars:{theme,light,dark}}` (shadcn CLI v4 schema). It's validated against the schema URL's JSON copy committed under `tests/tokens/fixtures/shadcn-registry-item.schema.json`, fetched once and recorded with its source URL and date. This file is handed to DX (DX-068 `registry/base/auraglass/`); don't touch `registry/**`.

### DS-095..DS-100 Storybook (PRD §13, REQ-DS-44)
14. DS-095. `.storybook/preview.tsx` belongs to SB (SB-048). It already defines the axis globals `scheme`, `transparency`, `contrast`, `motion`, `density`, `environment` (the 8 SC-28 scenes, which also set `data-ag-backdrop`) with A11Y's SC-23 values, plus one decorator.
    - Through SB's contract, add only `preset` (aura/graphite/daylight/midnight; `system` = no attribute). SB's `StoryRoot` writes it as `data-ag-theme` on the story root. Do not add a second decorator or duplicate the axis globals; SB-050's `decorators.length === 1` test must stay green.
    - Import `aura-glass` `dist/css/tokens.css` (or `src` equivalent through the build alias) in preview. Storybook-only CSS is loaded only from `.storybook/` (REQ-DS-44).
15. `src/design-system/stories/Tokens.mdx` renders tables generated at build time from `dist/tokens/manifest.json`: name, tier, group, value per mode, swatch with a text value (never colour-only), and consumers count. There are no hand-typed values (TOKENS-THEME-15).
16. `ModesMatrix.stories.tsx` renders one MAT `Surface` (MAT-047) per variant × thickness over the 8 SC-28 certification scenes (`certification/scenes/*`, QA-038/039; story ids `scenes--<id>`). If the scenes don't exist yet, mark the story's scene control as blocked in the report; don't substitute stock images. Its `play` toggles `scheme` and asserts that computed `--ag-on-surface` on the story root differs between light and dark.
17. `InteractionStates.stories.tsx` is a grid of MAT `Surface interactive` (light response only, no press scale, SC-38) forced into hover / active / selected / focus-visible / disabled / loading / dragging / drop-target through `data-*` attributes (`data-pressed`, `data-selected`, `data-disabled`, `data-loading`, `data-dragging`, `data-drop-target`) and real focus for `:focus-visible`. Add `Button`, `IconButton`, `Tabs` item and `Table` row rows only if those 5.0 components exist (`rg --files src | rg "<Name>"`), with no placeholders. `play` asserts that each state changes at least one computed property driven by its `--ag-state-*` token, compared to the rest state, and that disabled doesn't set the host's `opacity`.
18. `Presets.stories.tsx` shows each preset in light and dark, plus a `createBrandTheme` playground with an OKLCH input (L/C/H number inputs with labels; keyboard operable). It renders `contrast.pairs` and `contrast.adjusted`, with adjusted steps marked by text and an icon, not colour alone.
19. `ContrastFloors.stories.tsx` renders `tokens/generated/opacity-floors.json` as a table: rows are transparency × thickness × backdrop, columns are preset × scheme × contrast, and each cell shows `floorAlpha` and `minRatio` as text. A heat tint is allowed only alongside the text values.
20. Run the `play` functions remotely. Use the SB/QA Storybook interaction lane if it exists. Otherwise add `@storybook/test-runner` (exact pin compatible with `storybook` 9.x) and a GitHub Actions job that runs `npm run build-storybook` and then `test-storybook --url` against the static build served on the runner. Never run either locally.

## 4. Tests to run
Local: `npx jest src/theme/__tests__ tests/tokens/tailwind-bridge.test.ts tests/tokens/shadcn-interop.test.ts tests/tokens/emitted-css.test.ts && npm run gates:tokens`. Remote: QA L1/L4 (or the interim `Glass Quality Gates` step), the Storybook build plus test-runner job (all `play` assertions), and the size check for `tailwind.css` and the theme functions.

## 5. Visual evidence (remote, CI artifacts only, D-32)
Remote Playwright captures of the built Storybook:
- `Presets` in all 4 presets × light/dark;
- `ModesMatrix` per scheme × transparency (glass/tinted/solid) × contrast on the `photo`, `flat-white`, `flat-black` and `dense-text` scenes;
- `InteractionStates` per state;
- `ContrastFloors`.
Each runs in Chromium at 1440×900; Presets and InteractionStates also run in WebKit. Upload the captures as artifacts. The design-system owner reviews them and records sign-off in the PR (PRD §18).

## 6. Exit criteria
- AC-DS-12: `createGlassTheme({mode:"system"})` output has no dark pin, and the unit test proves that light applies under `prefers-color-scheme: light` (the browser half is in 03f's lane). Every emitted var has ≥ 1 consumer.
- AC-DS-13: 20/20 fixture brand colours give 100 % passing text pairs.
- AC-DS-10 (unit half): `tailwind-bridge.test.ts` shows byte equality for all six utilities.
- AC-DS-11 (unit half): `shadcn-interop.test.ts` resolves both directions with no cycle.
- Every §13 story `play` passes in the remote run, and the captures are uploaded and signed off.

## 7. Final report format
```
PROMPT-03e report
PRs: <urls>   Branch: main (+ release/4.x cherry-picks: <shas>)
Prereqs: 1..5, 3a (SB-048), 3b (QA-038/039) <ok|blocked:...>
Tasks: DS-081 <done|blocked> ... DS-100
Presets: 4, all cells pass; canvas fixes: <none | list>
createBrandTheme: 20/20 pass; adjusted steps total <n>; median <ms> ms; theme fns gz <KB>
tailwind.css gz <KB> (excl tokens.css); utilities byte-equal 6/6
shadcn: both directions ok, cycles 0
Storybook: play <pass>/<total> (run <url>); captures <artifact url>; sign-off <name/date|pending>
Tests: <cmd> -> <pass>/<total>, 0 skipped
AC: AC-DS-12 <p|f>, AC-DS-13 <p|f>, AC-DS-10(unit) <p|f>, AC-DS-11(unit) <p|f>
Deviations: ContrastReport keeps 4.x numeric fields; <others with evidence>
```

