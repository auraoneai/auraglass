# PROMPT-03f (DS): legacy platform, `compat/tokens.css`, 4.2/4.3 deprecations, 5.0 retirement, remote certification

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (PRD-03, §5.7, §5.11, §9, §11, §16, §17, §20 steps 7, 10–12). Requirements: REQ-DS-23, REQ-DS-24 (compat half), REQ-DS-41, REQ-DS-42 (legacy platform), REQ-DS-43, plus final verification of REQ-DS-21, -33 (beta), -38, -40. Acceptance: AC-DS-01 (beta), AC-DS-02, AC-DS-05 (`styles.css`), AC-DS-08, AC-DS-09, AC-DS-10, AC-DS-11, AC-DS-14, AC-DS-15, AC-DS-16. Tasks: `docs/auraglass-5/tasks/DS.json` DS-101..DS-119. Architecture: §3.6 budgets, §14 (C-D/C-B, §14.4 subpaths), §15 (lanes), D-18, D-26, D-27, D-28, D-32.

Contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding. The rows that apply here: SC-02/SC-03 (repo-root `deprecations.json`, MODIFY only), SC-08 (frozen fixture `tests/fixtures/consumer-4x/`, owner REL), SC-09 (pixel rule), SC-12, SC-15 (`docs/size-budgets.json` is PKG's; DS adds rows), SC-18/SC-20/SC-34 (DS owns the `compat/tokens.css` contents; REL holds the 4.3 scope, SC-37), SC-29/SC-30 (lanes and paths), SC-33 (`css-vars` codemod id; DX implements it) and SC-39 (DS is the single remover of `scripts/build-tokens.js` and `src/tokens/designConstants.ts`).

## 0. Common rules (binding)

- Remote-first. Node-only Jest may run locally. Every browser lane (zero-JS modes, forced colours, canaries, frozen fixture), perf calibration, Storybook builds, `npm pack` canary installs and full `npm run build` run remotely: in GitHub Actions on `auraoneai/auraglass` (choose per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`), in QA's `certify-*.yml` lanes (SC-29), or on an ephemeral EC2 worker via the `auraone-remote-run` skill (tear it down afterwards). Never use local Docker. Never run a local Playwright browser.
- Don't fake completion:
  - Visual thresholds stay exact: ≤ 0.1 % changed pixels with channel delta > 2/255 for AC-DS-08, and 0 changed pixels outside REL's D-28 labelled-fix list for AC-DS-14 (DS's entries: navy dark text, `--glass-opacity-*`). Never regenerate baselines to pass.
  - Don't delete a source while it still has a reader; prove it with `rg` output.
  - Don't widen size budgets (they ratchet down only, D-26).
  - Never empty the literals baseline by adding exemptions.
- Deletions run on `main` only. 4.2/4.3 items run on `release/4.x`, and each produces only the listed C-D/C-E changes (REL's `change-class` check must report C-D or lower; pixel changes are classified by REL's `scripts/release/visual-class.mjs`).

## 1. Prerequisites (verify; on failure stop and report)

1. 03a–03e merged on `main`. `npm run build:tokens && npm run gates:tokens && npx jest tests/tokens src/theme/__tests__` are green.
2. Frozen 4.x consumer fixture (REL-115/116, owner prompt `PROMPT_01_REL`; SC-08): `rg --files tests/fixtures/consumer-4x` returns files, including `flagship-subset.json`. QA's `consumer-4x-frozen` job exists in `certify-main.yml` (QA-087, owner prompt `PROMPT_18_QA`): `rg -n "consumer-4x-frozen" .github/workflows`. Without them, AC-DS-14 and DS-103's fixture half are blocked. `canaries/v4-frozen/` is not used.
3. DX `css-vars` transform and fixtures (DX-050, owner prompt `PROMPT_16_DX`; SC-33 layout): `rg --files packages/cli/src/migrate/4to5 | rg "css-vars"` hits `transforms/css-vars.ts` and `__fixtures__/css-vars/`. Without it, AC-DS-15's second half is blocked. DX-065 (`src/compat/index.ts`) must exist before DS-109 moves `createBrandGlassTheme` to compat.
4. QA lanes (owner prompt `PROMPT_18_QA`): `certification/playwright.cert.config.ts` (QA-018) and `rg --files .github/workflows | rg "certify-(pr|main|nightly)"` (QA-031..033). PKG canaries (owner prompt `PROMPT_02_PKG`): `canaries/vite` (PKG-126) and `canaries/vite-tailwind4` (PKG-128). If they're missing, DS-114/DS-115 are blocked on the named task. Do not add an ad-hoc workflow; report the blocker.
4a. Size and perf anchors: `docs/size-budgets.json` + `scripts/ci/verify-size-budgets.mjs` (PKG-048/049) and `tests/perf/harness/run-perf.mjs` (PERF-039, owner prompt `PROMPT_07_PERF`). DS-119 also needs FND-130 (beta removal check, owner prompt `PROMPT_08_FND`).
5. Before the 5.0 deletions (DS-109..DS-112), every reader of a retired source is gone. Each command must return 0 outside the files being deleted, tests being deleted, and `src/tokens/legacy`:
   - `rg -l "from ['\"].*tokens/(glass|designConstants|themeTokens|generated)['\"]" src`
   - `rg -l "designMatrix|themeConstants|theme/materials|theme/tokens" src`
   - `rg -l -- "--(glass|aura|persona|glass-theme|liquid|gm|grad)-" src --glob '!**/*.test.*' --glob '!**/*.stories.*'`
   If readers remain, list them with their owning PRD key (FND, CTL, OVL, NAV, DATA, AI, MED, MOT) and stop only the deletion tasks. `premium-typography.css`/`keyframes.css` are deleted only after their non-token content has an owner (PRD §21 OI-11).

## 2. File scope

May touch:
- MODIFY `scripts/tokens/build.mjs` (`legacy` platform), NEW `scripts/tokens/formats/compat-aliases.mjs`, NEW `scripts/tokens/compat-successors.json`, generated `tokens/generated/compat-alias-map.json` and `tokens/generated/persona-preset-map.json`;
- NEW `tests/tokens/compat-aliases.test.ts`, NEW `src/theme/__tests__/deprecations-4-3.test.ts`, MODIFY `tests/tokens/legacy-freeze.test.ts`, MODIFY `tests/tokens/export.test.ts` and `tests/tokens/export.spec.mjs`;
- NEW `tests/visual/tokens/modes.spec.ts`, `tests/visual/tokens/canaries.spec.ts` and `tests/visual/tokens/fixtures/*.html` (SC-30);
- `deprecations.json` (repo root, SC-02; instance seeded by TRUST-075, schema `docs/schemas/deprecations.schema.json` from REL-010; add entries only, validated by `scripts/release/verify-deprecations.mjs`, REL-013);
- dev warnings in `src/theme/createGlassTheme.ts`, `src/theme/ThemeProvider.tsx` (`usePersonaTheme` at `:1530`, `PERSONA_IDS`/`THEME_NAMES` exports), `src/theme/themeConstants.ts`, `src/components/theme/PersonaPicker.tsx` (warning lines only; `release/4.x`);
- `scripts/build-tokens.js` (4.2 C-D banner only);
- `package.json` (`scripts` only; `exports` changes only through PKG's `build/exports.manifest.json`, PKG-005);
- MODIFY `docs/size-budgets.json` (DS rows only, DS-117);
- MODIFY `src/styles/index.css` (remove legacy token imports only; the file is PKG's, PKG-101);
- `CHANGELOG.md`;
- the deletions in DS-109..DS-112;
- `scripts/tokens/gates/literals-baseline.json` (downward only);
- `docs/design-tokens.md` and `docs/theme/theme-engine.md` (replaced by a stub pointing at DX's generated docs output; DS-118).

Must not touch: `registry/**` and codemod code (DX), `canaries/**` (PKG; request pages from PKG if needed), `tests/fixtures/consumer-4x/**` (REL), `certification/**` configs (QA), `src/theme/ThemeProvider.tsx` beyond warning lines, `src/styles/glass.css` (MOT-084), `src/material/**` beyond the generated files, component sources (family PRDs migrate them), and any `src/styles/**` file not listed for deletion.

## 3. Steps

### DS-101..DS-102 `legacy` platform (REQ-DS-42, D-27)
1. Add a Style Dictionary platform named `legacy` to `build.mjs`. Its only input is `tokens/legacy/4x-rendered.tokens.json`, and it outputs `dist/css/compat/legacy-primitives.css` (part of `compat/tokens.css`) plus the 4.2 experimental `aura-glass/material` legacy values used by PRD-17. It regenerates every 4.1.0 `--glass-*` primitive with the value byte-identical to `src/styles/tokens.css` at 4.1.0.
2. Extend `tests/tokens/legacy-freeze.test.ts`: the `legacy` platform output equals the 4.1.0 primitives. The comparison uses a postcss-parsed map of `name → value` taken from `git show 15b6de6f7:src/styles/tokens.css` (fixed reference, not the working tree), and must have 0 differences.

### DS-103..DS-104 `compat/tokens.css` + alias map (REQ-DS-43, REQ-DS-24 compat half)
3. `formats/compat-aliases.mjs`:
   - Build the 4.x reader set: every `--glass-*`, `--aura-*`, `--persona-*` and `--glass-theme-*` name read via `var()` in `git show 15b6de6f7` `src/**` plus `tests/fixtures/consumer-4x/**` (REL-115).
   - Map each to its `--ag-*` successor (hand-curated table `scripts/tokens/compat-successors.json`, NEW, reviewed in the PR) or to its frozen value from `tokens/legacy/4x-rendered.tokens.json`.
   - Emit `tokens/generated/compat-alias-map.json` (`{legacyName: {successor|frozen, kind}}`, sorted) and `dist/css/compat/tokens.css`. The CSS has the order statement and `@layer ag.compat { :root { --glass-x: var(--ag-y); … } [data-theme=dark], .dark { <dark scheme --ag-* values> } }`, and is ≤ 8 KB gz (reported separately, D-18).
   - DS owns the contents (SC-18/SC-34). REL holds the 4.3 release scope that ships it (SC-37). DX's `css-vars` codemod (DX-050) reads the map as `packages/cli/src/migrate/4to5/mappings/css-vars.json`.
4. `tests/tokens/compat-aliases.test.ts`:
   - every name in the 4.x reader set has an alias (log the count; the PRD estimates ~620);
   - the CSS is entirely inside `@layer ag.compat`;
   - `[data-theme=dark]` and `.dark` are mapped, and no other legacy hook is;
   - the alias-map keys equal DX's `mappings/css-vars.json` once DX-050 exists;
   - computed template-string names found in the scan are listed in a `reported` array, not aliased.

### DS-105 4.2 C-D: token subpaths and Tailwind v3/UnoCSS presets (`release/4.x`)
5. Add repo-root `deprecations.json` entries (since `4.2.0`, removeIn `5.0.0`; `codemod` is an SC-33 id or null) for:
   - `aura-glass/tokens/json`, `/tokens/tailwind`, `/tokens/manifest`, `/tokens/css`, `/tokens/keyframes` (successors `aura-glass/tokens`, `aura-glass/tokens.css`, `aura-glass/tailwind.css`);
   - `dist/tokens/tailwind.theme.mjs`;
   - `dist/tokens/unocss.preset.ts`;
   - the type-only `getPersona`/`getPersonaModeTokens` from 03a (SC-36; codemod null).
   Add a one-time `console.warn` banner to the generated Tailwind v3/UnoCSS preset modules through `scripts/build-tokens.js`. Add a `CHANGELOG.md` 4.2.0 "Deprecated" entry.

### DS-106..DS-107 4.3 C-D items (`release/4.x`)
6. `deprecations.json` entries (since `4.3.0`) cover:
   - `--glass-*`/`--aura-*`/`--persona-*`/`--glass-theme-*` vars;
   - the hooks `data-theme`, `data-aura-theme`, `data-aura-mode`, `data-persona`, `data-bg`, `.glass-on-light`, `.glass-on-dark`, `.dark`, `.light`;
   - the 10 personas, `PersonaPicker`, `usePersonaTheme`, `PERSONA_IDS`, `THEME_NAMES`;
   - `createBrandGlassTheme` (→ `createBrandTheme`, `compat` in 5.0), `createGlassThemeCssVars` (→ `createGlassTheme().vars`), `glassMaterialPresets`;
   - `GlassThemeMode "high-contrast"`, `GlassDensity "comfortable"`, `GlassThemeTokens.density.{controlHeight,gap,pagePadding}`;
   - `designConstants` `ANIMATION`/`COLORS`/`BORDER_RADIUS`/`BOX_SHADOW`;
   - the `glass-*` slash utilities.
   Codemod ids: `css-vars` for the vars, `providers` for `"high-contrast"`/`"comfortable"`, otherwise null (SC-33). The `"comfortable"` row depends on PRD §21 OI-03. Every C-B in PRD §9/§10 needs an entry with `since ≤ 4.3.0` (REQ-REL-27).
7. Dev-only `console.warn` (once per name, stripped when `NODE_ENV === 'production'`) on use of: persona APIs, `"high-contrast"`, `"comfortable"`, `createBrandGlassTheme`, `createGlassThemeCssVars`. Test: `src/theme/__tests__/deprecations-4-3.test.ts` (NEW) spies on `console.warn` per API, and checks a production build emits none.

### DS-108 Persona → preset map (before deletion; for DX docs)
8. Generate `tokens/generated/persona-preset-map.json` from `src/theme/designMatrix.ts`: for each of the 10 persona ids, the nearest preset (minimum ΔE2000 between dark canvases) and the `createBrandTheme(<accent oklch>)` call. It must exist before DS-110 deletes `designMatrix.ts`.

### DS-109..DS-112 5.0 alpha retirement (REQ-DS-41, AC-DS-02; `main` only, after §1.5)
9. DS-109 TS sources. Delete `src/tokens/designConstants.ts`, `src/tokens/themeTokens.ts`, `src/tokens/generated.ts`, and the surface data in `src/tokens/glass.ts` (delete the file if nothing else remains). `src/tokens/index.ts` then re-exports only `src/tokens/generated/tokens.ts` (`tokens`, `token`, `materialSpec`, `manifest`, types `TokenPath`, `MaterialSpec`), and `auraTokens`, `personas` and the default export are removed (C-B). Delete `createGlassThemeCssVars` and move `createBrandGlassTheme` to the `aura-glass/compat` entry as `src/compat/theme/createBrandGlassTheme.ts`, registered in DX's `src/compat/index.ts` (DX-065) and calling `warnDeprecated(id)` (REL-072, SC-34). Delete `src/theme/contrast.ts` (A11Y-004 verifies 0 importers). DS-109 is the single remover of `designConstants.ts` (SC-39). FND-126 runs after it.
10. DS-110 theme sources. Delete `src/theme/designMatrix.ts`, `src/theme/materials.ts`, `src/theme/tokens.ts`, `src/theme/themeConstants.ts`, and the tests `src/theme/theme-engine.test.tsx`, `src/theme/usePersonaTheme.test.tsx`, `src/theme/__tests__/ThemePersona.integration.test.tsx`. Their replacements are 03e's `src/theme/__tests__/*`; list them in the PR.
11. DS-111 CSS sources. Delete `src/styles/glass.generated.css`, `src/styles/generated/persona-variables.css`, `src/styles/variables.css`, `src/styles/design-tokens.css`, `src/styles/themes/light.css`, `src/styles/themes/dark.css`, `src/styles/premium-typography.css`, `src/styles/keyframes.css`, `src/styles/tokens.css` and `src/styles/typography.css` (its values are in `tokens/sys/type.tokens.json`). In PKG's `src/styles/index.css` (MODIFY after PKG-101; → `dist/css/styles.css`), import only `tokens.css`, `material.css` and the component CSS. `rg -c -- "--(glass|aura|persona|glass-theme|liquid|gm|grad)-" dist/css/styles.css` must print 0, and no selector may match the legacy hooks (REQ-DS-24).
12. DS-112 generators and old JSON (DS is the single remover, SC-39; PKG-109 drops its removal). Delete `scripts/build-tokens.js`, `scripts/generate-glass-css-simple.js`, `scripts/generate-glass-css-from-tokens.ts`, `scripts/generate-persona-css.ts`, `scripts/generate-persona-css-runner.js`, `tokens/index.json`, `tokens/personas/default.json` and `tokens/schema.json`. Remove the npm scripts `glass:generate-css`, `glass:generate-persona-css`, `glass:validate-persona-css` and `build:tokens:legacy`, and the `npm run glass:generate-persona-css &&` prefix of `build`. Fix `glass:full-check`. AC-DS-02: `rg --files` returns 0 for every REQ-DS-41 path (paste the command and output).
13. DS-113. Rewrite `tests/tokens/export.test.ts` and `tests/tokens/export.spec.mjs` for the 5.0 map:
   - ESM import of `aura-glass/tokens` exposes exactly `tokens`, `token`, `materialSpec` and `manifest`;
   - `aura-glass/tokens.css`, `aura-glass/material.css`, `aura-glass/tailwind.css` and `aura-glass/compat/tokens.css` resolve;
   - the removed subpaths throw `ERR_PACKAGE_PATH_NOT_EXPORTED`;
   - no CJS entry.

### DS-114 Remote zero-JS modes + forced colours (REQ-DS-21, -23, AC-DS-08, AC-DS-09)
14. `tests/visual/tokens/modes.spec.ts` (remote, QA L6 Environment visual, `certification/playwright.cert.config.ts`) uses `tests/visual/tokens/fixtures/{zero-js,attr}.html`, both built from the packed tarball's CSS with no JS. Each page shows a 6-surface scene: 3 variants × 2 thicknesses plus text pairs on the `photo` and `flat-white` scenes.
   - Test `zero-js matches attribute baseline under <pref>`, for each of 6 emulations: `colorScheme: light`, `colorScheme: dark`, `contrast: more`, reduced transparency (Chromium `--force-prefers-reduced-transparency` / `emulateMedia` where supported; unsupported engines are reported as N/A per engine, not passed), `forcedColors: active`, `reducedMotion: reduce`. Compare against `attr.html` with the matching `data-ag-*`. Changed pixels must be ≤ 0.1 % (channel delta > 2/255; same as REL's SC-09 `changedRatio > 0.001` rule). Runs in Chromium, WebKit and Gecko.
   - Test `computed --ag-on-surface differs light vs dark`.
   - Test `forced-colors beats data-ag-transparency=glass`: with `forcedColors: active` and `<html data-ag-transparency="glass">`, `getComputedStyle(el).backdropFilter === 'none'` for every `[data-ag-surface]` (AC-DS-09).
   - Test `createGlassTheme system follows media`: the `cssText` from `createGlassTheme({mode:'system'})` injected under `colorScheme: light` renders light (computed `--ag-color-canvas` L > 0.9) (AC-DS-12 browser half).

### DS-115 Remote canaries (AC-DS-10, AC-DS-11, REQ-DS-38, -40)
15. In `tests/visual/tokens/canaries.spec.ts` (remote, QA L11 Consumer canaries), run against the packed tarball (`scripts/ci/lib/npm-pack.js`, TRUST-002, on the runner):
   - `canaries/vite-tailwind4`: builds; for each of the 6 `glass-*`/`content-*` utilities, the element's computed style equals that of a sibling using `data-ag-variant`/`data-ag-thickness` (0 property differences over the full `getComputedStyle` list).
   - `canaries/vite`: renders with no `tailwindcss` installed (`npm ls tailwindcss` exit 1).
   - shadcn: a stock shadcn `Button` (copied from the shadcn CLI output for the pinned version, recorded) inside an AuraGlass page. Its computed `background-color` equals the `--ag-accent` value and its focus ring equals `--ag-focus-outer`. With `<html data-ag-shadcn-source>` and app `--primary: oklch(0.6 0.2 30)`, the AuraGlass `Button` (CTL-055 if it exists; otherwise MAT `Surface interactive`, MAT-047) picks up that colour. The console shows no cycle warning.
   - Add these pages only under the canary owner's allowed path, or ask PKG to add them; report which.

### DS-116 Frozen 4.x fixture + codemod coverage (AC-DS-14, AC-DS-15)
16. On `release/4.x` at 4.2 and at 4.3, run QA's `consumer-4x-frozen` job (QA-087) on REL's fixture `tests/fixtures/consumer-4x/` (REL-115; pages per REL-116: Chromium, light/dark, 1440×900 and 390×844). Classify with REL's `visual-class.mjs`. It must show 0 changed pixels outside REL's D-28 labelled-fix list (DS entries: navy dark text, `--glass-opacity-*`), with before/after composites attached. Run DX's `css-vars` fixture suite (`packages/cli/src/migrate/4to5/__fixtures__/css-vars/`, DX-050) with the generated alias map; 100 % of literal references must be rewritten (report the count).

### DS-117 Budgets + perf calibration (AC-DS-16, §16, D-26)
17. Add DS rows by MODIFY to PKG's `docs/size-budgets.json` (PKG-048; integer bytes min+gz, peers external; gate `scripts/ci/verify-size-budgets.mjs`, PKG-049). There is no `size-limit`, `.size-limit.json` or `build/budgets.lock.json` (SC-15). Rows may be stricter than PERF's REQ-PERF-01 defaults, never looser:
   - `styles.css` ≤ 32 KB gz;
   - `tokens.css` ≤ 8 KB gz excluding presets, preset blocks ≤ 2 KB gz;
   - `tailwind.css` ≤ 3 KB target / 6 KB ceiling;
   - `compat/tokens.css` ≤ 8 KB gz (reported separately);
   - `aura-glass/tokens` JS ≤ 2 KB gz;
   - theme functions ≤ 3 KB gz.
   Counts (asserted by DS gates, not size rows): public ≤ 260, private ≤ 200, total custom properties in `styles.css` ≤ 460, `@property` ≤ 16.
   Request the runtime row in PERF's `tests/perf/harness/budgets.json` (PERF-039): scheme-toggle style recalc on `<html>` ≤ 8 ms, 0 layout events (mid-tier Android profile, 6-surface scene), measured in QA L10 Performance. QA L10 calibrates at 5.0.0-alpha.1. After that, values only go down (D-26).

### DS-118 Docs hand-off
18. Replace the hand tables in `docs/design-tokens.md` and `docs/theme/theme-engine.md` with a short pointer to the generated pages (DX's docs app DX-101 and theming guide DX-124 consume `dist/tokens/manifest.json` and `persona-preset-map.json`; DX has no token-page generator task yet, PRD §21 OI-13). TOKENS-THEME-15 is closed when no hand-typed token value remains in either file. Check with `rg -n "#[0-9a-fA-F]{3,8}|[0-9]+px|[0-9]+ms" docs/design-tokens.md docs/theme/theme-engine.md`, expecting 0.

### DS-119 Beta flip + final sweep (AC-DS-01, AC-DS-02, AC-DS-05)
19. At 5.0.0-beta.1: `scripts/tokens/gates/literals-baseline.json` is `{}`, and `npm run lint:tokens` reports 0 across all of `src/**/*.{ts,tsx,css}` with the REQ-DS-33 exempt list only. Run `undefined-vars`/`dead-vars` on every importable CSS entry, including `styles.css` and `compat/*.css`, and expect 0/0. Then run the whole AC-DS-01..17 table on `main` across the engine matrix and attach every CI artifact link. If family PRDs still own violations, don't flip; list the remaining files per owning PRD key. FND-130 (beta removal check) must be green first.

## 4. Tests to run
Local: `npx jest tests/tokens src/theme/__tests__`. Remote: `tests/visual/tokens/modes.spec.ts` (QA L6, 3 engines), `tests/visual/tokens/canaries.spec.ts` (QA L11), the frozen-fixture job, the codemod suite, the perf lane, the size gate, and `npm run gates:tokens` after a full `npm run build`.

## 5. Visual evidence (CI artifacts only)
Upload:
- per-engine zero-JS vs attribute diff images for all 6 preferences;
- forced-colours captures;
- Tailwind canary side-by-side (utility vs attribute);
- shadcn canary captures in both authority modes;
- frozen-fixture before/after composites for the two D-28 fixes;
- the perf trace.
A human reviewer (design-system owner) signs off in the PR.

## 6. Exit criteria
AC-DS-01 (beta 0 violations, baseline empty), AC-DS-02 (`rg --files` = 0 per REQ-DS-41 path), AC-DS-05 (0/0 on every entry; ≤ 260 public; ≤ 460 total in `styles.css`), AC-DS-08, AC-DS-09, AC-DS-10, AC-DS-11, AC-DS-14, AC-DS-15, AC-DS-16, all green. For any AC blocked by another PRD's missing input, report it as blocked with the owner's task id (for example REL-115, QA-087, DX-050); never report it as passing.

## 7. Final report format
```
PROMPT-03f report
PRs: <urls>  Branches: release/4.x (<shas>), main (<shas>)
Prereqs: 1..5, 4a <ok|blocked:<task id>>  (remaining readers per PRD key: <list>)
Tasks: DS-101 <done|blocked> ... DS-119
Compat: aliased <n>/<reader set n>, reported computed names <n>, compat gz <KB>
Deletions: <path -> rg --files count 0> ...
Lanes: tokens-modes <engine: pass/fail/N-A per pref>, forced-colors <p|f>, tailwind canary <p|f>, zero-tailwind <p|f>, shadcn <p|f>
Frozen fixture 4.2/4.3: changed px outside D-28 = <n>; codemod rewrite <n>/<n>
Budgets: styles <KB>, tokens <KB>+presets <KB>, tailwind <KB>, compat <KB>, tokens JS <KB>, theme fns <KB>; vars public <n> private <n> total <n>; recalc <ms> ms, layouts <n>
Literals: baseline total <n> (beta target 0)
AC table: AC-DS-01..17 <pass|fail|blocked(<task id>)> with artifact links
Sign-off: <name/date|pending>
Deviations: <list with evidence>
```
