# PROMPT-16d (DX): shadcn-compatible registry, 10 blocks, items, render gate, recipe retirement

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16). Binding contracts: `prd/_shared-contracts.md` SC-32 (registry layout, block ids, content ownership), SC-02 (root `deprecations.json`), SC-39 (DX-100 is the only remover of `verify-recipes-render.js`), SC-40 (`depends_on`). Requirements: REQ-DX-43..53, plus §13 (Storybook blocks), §14 (responsive), §15.1–15.3 (block a11y) and the §16 registry/block budgets. Acceptance: AC-DX-07, AC-DX-08, AC-DX-09, AC-DX-10, AC-DX-11. Tasks: `docs/auraglass-5/tasks/DX.json` DX-067..DX-100. Architecture: D-17 (removed-but-honest components become items), §3 (the 10 surfaces), §4.4 (interchange), §15.2 (pixel gates). Index and crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally (node only, no browser, no app builds): `node scripts/registry/lint.mjs`, `node scripts/registry/build.mjs`, `npx vitest run -c tests/dx/vitest.config.ts tests/dx/{registry-schema,registry-blocks,registry-lint,registry-build,recipe-fates}.test.ts`. Run remotely in `.github/workflows/registry.yml` (public repo, hosted runners per `ci-selection.md`) or via the `auraone-remote-run` skill:
  - `registry-render.spec.ts` (Next 16 + Vite scaffolds, builds, Playwright, axe, traces);
  - `registry-shadcn-interop.spec.ts`;
  - the Storybook build.
  Never use local Docker. Never launch a local browser.
- Don't fake completion:
  - Blocks are authored new from certified flagship components. They are not ports of recipe strings (REQ-DX-53).
  - Never patch a component bug inside a block (no overrides, no `className` hacks, no `!important`). File it to the owning PRD and mark the block BLOCKED.
  - The render gate's pass flag is the conjunction of every assertion, never a screenshot count.
  - No `test.skip`, no per-block threshold relaxations, no `--update-baselines`.
  - Never publish an item without a certification SHA.
- Copy is product-realistic: no lorem, demo or placeholder text.
- Secrets: the only key reference allowed is `process.env.PRISM_API_KEY`, and only inside `registry/blocks/ai-workspace/app/api/chat/route.ts`. Never use `NEXT_PUBLIC_*KEY`. No vendor key names.
- A missing prerequisite owned by another PRD means that task is BLOCKED: report the component or lane and its owner.
- Evidence is CI artifacts (D-32). Don't commit PNGs.

## 1. Prerequisites

1. 16b is merged (`packages/cli/src/commands/{init,add}.ts` exist and their tests are green). Without them the render gate can't run `auraglass init`/`add`.
2. QA harness (QA-018 cert config, QA-039 scenes manifest): `rg --files packages/qa/src | rg "pixel/|ocr/|matrix/"` is non-empty, and the 8 scene assets plus `scenes.manifest.json` exist. If not, DX-094 is BLOCKED. Don't write private pixel gates.
3. Block content owners (SC-32) and the flagship certification status per block:
   - `app-frame`: content NAV (NAV-106 creates the folder). DX-071 registers it only.
   - `ai-workspace`: content AI (AI-107 page, AI-108 route). DX-072 scaffolds and registers it.
   - `data-workspace`: content DATA, but no DATA task exists yet (PRD §21 OI-DX-02). DX-073 scaffolds it; report the gap.
   - `analytics-dashboard`: content DATA (DATA-133). DX-074 scaffolds it.
   - `media-viewer`: content MED (MED-153). DX-075 scaffolds it.
   - `overlay-flows`: content OVL (OVL-164). DX-076 scaffolds it.
   - `auth`, `settings`, `mobile-settings`, `support-inbox`: content DX (DX-077..080), using CTL-055, A11Y-088 `GlassPreferencesPanel`, NAV-095, OVL-105, DATA-108 and AI-075. OVL-143 MODIFYs `settings` and CTL-161 tests `auth`/`settings`/`mobile-settings`.
   Never write content for an area-owned block. File block bugs to the owner. A block certifies only after its components certify; DX-081 gates content completeness.
4. DS interchange variables (DS-090 tailwind/shadcn bridge): `rg -n -- "--background|--primary-foreground" src/tokens src/styles 2>/dev/null` or the PRD-03 generated output defines the shadcn mapping to `--ag-*`.
5. AI items under `registry/items/ai-<name>/` (SC-32; AI-099, AI-101..AI-106). List which of the 7 exist. The missing ones are listed in `registry.json` only when they exist; report the rest.
6. SB `environment` toolbar global (SB-048) with the 8 scenes: `rg -n "environment" .storybook`.

## 2. File scope

May create: `registry/registry.json`, `registry/base/auraglass/**`, `registry/blocks/{app-frame,ai-workspace,data-workspace,analytics-dashboard,media-viewer,overlay-flows,auth,settings,mobile-settings,support-inbox}/**` (each with `layout.assert.json`), `registry/items/{kanban,gantt,transfer-list,schema-viewer,code-surface,rich-text,diff-viewer,react-hook-form}/**`, `scripts/registry/{lint,build}.mjs`, `packages/registry/{package.json,PUBLISHING.md,README.md}`, `tests/dx/{registry-schema,registry-blocks,registry-lint,registry-build,recipe-fates}.test.ts`, `tests/dx/{registry-render,registry-shadcn-interop}.spec.ts`, `tests/dx/fixtures/registry-lint-bad/**`, `docs/auraglass-5/registry-recipe-fates.json`, `src/stories/blocks/*.stories.tsx`, `.github/workflows/registry.yml`, `.gitignore` (`apps/docs/public/r/`).
May modify: the repo-root `deprecations.json` on `release/4.x` for 4.2 (DX-096: entries only, through `DEPRECATIONS_PATH`; instance TRUST-075, schema REL-010, validated by `scripts/release/verify-deprecations.mjs`). Content of area-owned blocks: scaffold files only (DX-072..076). May delete (beta.1, after DX-094 is green): `scripts/ci/verify-recipes-render.js`, `scripts/ci/verify-recipes-cli.js`, and 4.x recipe stories found by `rg -l "recipes" src/stories`.
Must not touch: `src/components/**`, `src/registry/**` (its removal is NAV-136, SC-38), `registry/items/ai-*/**` content (AI; you only register it), content of `app-frame`, `ai-workspace`, `data-workspace`, `analytics-dashboard`, `media-viewer` and `overlay-flows` (area PRDs), `packages/qa/**`, `.storybook/**` (Storybook PRD), `packages/cli/src/**` (16a–16c; import `eject-source.ts` only).

## 3. Steps

1. **DX-067, DX-068.** `registry.json` with the exact `$schema`/`name`/`homepage` values. Base item `auraglass`: `dependencies ["aura-glass@^5"]`; `cssVars` theme, light and dark for `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--ring`, `--radius` → `var(--ag-*)`; the `css` imports; `lib/auraglass.ts` re-exporting `cn`. Built size ≤40 KB.
2. **DX-070.** Write `lint.mjs` with every REQ-DX-46 rule, the §14.2 responsive-class rule and the REQ-DX-53 selector rule. Add one seeded bad fixture per rule under `tests/dx/fixtures/registry-lint-bad/<rule-id>/`; each must fail with its rule id.
3. **DX-071..DX-080.** DX-071 registers the NAV-built `app-frame`. DX-072..076 create scaffolds (skeleton, `layout.assert.json`, `registry.json` entry) that the area owners fill. DX-077..080 author `auth`, `settings`, `mobile-settings` and `support-inbox` with the components listed in REQ-DX-45 and the intent from §9.2. For every block:
   - Each declares `registryDependencies: ["auraglass"]`, `meta.auraglass.components` (the exact import set), and `meta.auraglass.client` per file.
   - Each has landmarks (banner, navigation, main) and exactly one `h1`. Inputs are uncontrolled or wired to state.
   - Layout uses container queries and component props only.
   - `layout.assert.json` holds the geometric assertions per breakpoint. For `app-frame` at 1440: `sidebar.x + sidebar.width ≤ main.x` and `|sidebar.y − main.y| ≤ 1`.
4. **DX-081.** This task depends on the area content tasks (NAV-106, AI-107, AI-108, DATA-133, MED-153, OVL-164, OVL-143). `registry-blocks.test.ts`: the 10 exact names, imports parsed with the TS compiler API equal `meta.auraglass.components`, and the `items` case.
5. **DX-082..DX-090.** D-17 items and adapters. Third-party packages are exact-pinned in the item `dependencies` and never enter `aura-glass`. Register the AI items (DX-090) from `registry/items/ai-<name>/`, with `ai-eval-dashboard` typed `registry:item` (SC-32).
6. **DX-091, DX-098, DX-092, DX-093.** `build.mjs`:
   - Output: `apps/docs/public/r/*.json`, `/r/registry.json`, immutable `/r/v/<version>/*.json`. Deterministic: sorted keys, LF.
   - Size budgets: block ≤150 KB, `code-surface`/`rich-text` ≤400 KB, base ≤40 KB.
   - `aura-glass-src/<component>` items via `eject-source.ts`, with T0 excluded.
   - `--release <sha>` writes `meta.auraglass.certified` from `registry-render-results.json`, and items that fail are excluded.
   - `--pack` produces `packages/registry`.
7. **DX-094.** `registry-render.spec.ts`. Reuse the flow from `scripts/ci/verify-recipes-render.js:90-140` and `:348-410` (pack → scaffold → build → serve → capture). Replace its gating with these assertions, each checked per capture with its own console/pageerror buffer:
   - **Matrix:** {Next 16, Vite} × {1440×900, 390×844} × {light, dark} × {glass, solid} = 16 cells per block. `mobile-settings` runs 390×844 + 360×740 only.
   - **Pixel gates** via `packages/qa`: not blank, surface separation, OCR contrast ≥4.5:1 body / ≥3:1 large, glass density ≤0.3, mobile containment, material presence.
   - **Layout:** `layout.assert.json` holds, and `scrollWidth ≤ innerWidth` at 390.
   - **Axe:** Chromium and WebKit, colour contrast on, plus `forcedColors: active`, `prefers-contrast: more` and `reducedMotion: reduce`; 0 serious/critical.
   - **Keyboard and touch:** a tab walk reaches every interactive element, and touch targets are ≥24×24 (≥44×44 for primary `mobile-settings` controls).
   - **Budgets:** `app-frame` first-render JS ≤60 KB gzip excluding React/Next. Trace at 4× CPU throttle: 0 long tasks >200 ms, ≤2 >50 ms.
   Write `registry-render-results.json`.
8. **DX-069.** `registry-shadcn-interop.spec.ts`: a fresh shadcn Base UI app, `shadcn add` of `auraglass.json` and `app-frame.json` from the job-served `/r/`, `next build` exits 0, and the shadcn Button and AuraGlass Button resolve the same `--primary` colour.
9. **DX-095, DX-096.** Write `registry-recipe-fates.json` (28 rows: 16 block, 1 item, 11 delete) and `recipe-fates.test.ts`. The 4.2 deprecations entries (`kind: cli`, `symbol: recipe:<id>`) go into the repo-root `deprecations.json` on `release/4.x`, through REL's verifier (DX-096 depends on TRUST-075 and REL-010).
10. **DX-097.** Block stories that import `registry/blocks/<name>/` directly, under the `environment` global, tagged `["block","certified"]`, with no story CSS.
11. **DX-099, DX-100.** `registry.yml` with sharded remote jobs and artifacts. At beta.1, delete the legacy recipe gates once DX-094 is green.

## 4. Tests

- Local: `npx vitest run -c tests/dx/vitest.config.ts tests/dx/registry-schema.test.ts tests/dx/registry-blocks.test.ts tests/dx/registry-lint.test.ts tests/dx/registry-build.test.ts tests/dx/recipe-fates.test.ts`.
- Remote (`registry.yml`): `registry-render.spec.ts` (160 block cells + the `mobile-settings` 360 cells + the item lane), `registry-shadcn-interop.spec.ts`, and the Storybook build with block stories.

## 5. Visual evidence

Upload every render-gate capture (per block × framework × viewport × scheme × transparency) with axe JSON and traces, the shadcn interop screenshots, and remote Storybook captures of each block story across the 8 scenes. A human blind review checks that the 10 blocks "read as one hand" (DoD 7, architecture §15.2 Manual lane) on these remote captures, and the reviewer and verdict are recorded in the PR.

## 6. Exit criteria

- AC-DX-07: `registry.json` validates, there are exactly 10 blocks, and every published item has `meta.auraglass.certified` equal to the release SHA (GA run).
- AC-DX-08: `registry-lint` reports 0 for `!important`, colour literals, inline optics, undeclared/unused dependencies and frozen inputs.
- AC-DX-09: 160/160 block cells pass, each with 0 console/page errors.
- AC-DX-10: the shadcn add of base + `app-frame` into a fresh Base UI app gives `next build` exit 0.
- AC-DX-11: the fates file has 28 rows (16/1/11), and `src/registry/**` is absent on `main` at 5.0.0-beta.1 (deleted by NAV-136; verify it).

## 7. Final report format

```
PROMPT-16d report
PR: <url>  SHA: <sha>
Prereqs: 1 <ok> 2 <qa harness ok|blocked> 3 <per block: certified|pending owner> 4 <ok> 5 <AI items present n/7> 6 <ok|missing>
Tasks: DX-067 <done|blocked: reason> … DX-100
Lint: findings=0 over registry/**; seeded rules failing as expected <n>/<n>
Render gate: cells pass <n>/160 (+360 cells <n>/<n>); console errors=0; app-frame JS <KB>; long tasks <counts>
Registry build: deterministic <yes>; sizes max block <KB>, base <KB>
shadcn interop: next build <exit>; --primary equal <yes|no>
Artifacts: <urls>; blind review: <reviewer> <verdict>
AC: AC-DX-07..11 <pass|fail|blocked each>
Component bugs filed to owners: <list>
```
