# PROMPT-1f (PLAT): registry, docs site, claims, `llms.txt`, MCP and the RM-13 docs removal

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.6, §5.9, §5.10, REQ-PLAT-83, §12.1 (`tests/{registry,docs}`, `tests/dx` docs/registry rows, `packages/mcp`), §13 items 1–4, §14.3–14.5, §15.8, §16 (registry, block, docs, llms, MCP rows), §19 (S-46 provider; S-24, S-30, S-31, S-51, S-55 consumer).
Requirements: REQ-PLAT-83, REQ-PLAT-94..106 (plus `packages/{registry,mcp}/PUBLISHING.md` for REQ-PLAT-15, the README banner markers of REQ-PLAT-34 on `next`, and the `DOCS_BASE_URL` constant of REQ-PLAT-07).
Acceptance: AC-PLAT-28, AC-PLAT-29, AC-PLAT-30, AC-PLAT-31 (registry, MCP), AC-PLAT-32 (RM-13 half).
Tasks: PLAT-350..PLAT-402 (`lane: "1f-DX"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: the DX prompts in `archive/v1-19-prd/prompts/` covering registry, docs, claims, llms and MCP, `PROMPT_08f_FND_REMOVAL_EXECUTION.md` (RM-13), the REL Storybook migration pages (`SB-REL-3`); `registry.yml`/`docs.yml`/Vercel previews are now `plat:test:registry`, `plat:test:docs`, `plat:build:docs` and GitLab Pages.
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-dx`; branches `next-plat/dx-<topic>` and `next-plat/rm-13-docs` from `origin/next`.

## Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt. The docs app's `next@16` and MCP's SDK pins arrive through contract PR CP-PLAT-1 (lane 1e opens it); until then build the generators, gates and content against the frozen set.
2. Concurrency: start on day 0. Blocks and items compose only CMP contract props (S-30), MAT seams (S-06, S-21, S-24) and PLAT code, tested against seeds and `tests/contract-doubles/cmp/*`; generators read whatever metas, `registry-item.json` files, fragments and artifacts exist; a missing cross-stream input renders `pending` (claims fail only on the `v5.x.y` tag, G-14); the quickstart falls back to `tests/dx/fixtures/alpha-smoke/` until `app-frame` (SURF) is certified.
3. Ownership: only the "May touch" list; changesets `.changeset/plat-dx-<topic>.md`.
4. GitLab CI only; GitLab Pages serves the docs (`public/`), Storybook (`public/storybook/`) and the Material Lab (`public/lab/`) through lane 1a's `pages` job; no Vercel, no `gh-pages`, no GitHub workflow. Merge after `gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: docs static build, render gate, shadcn interop, quickstart (verdaccio container), axe, Lighthouse and plain-CSS specs run only in GitLab jobs on the Playwright image. Locally: bounded `rg`, `git`, `node -e`, `npx jest <one node test file>`.
6. Forbidden: hand-written numbers outside claims; claims without an artifact source; pages for non-exported symbols; recipe strings ported into blocks; colour literals, `!important`, inline optics or viewport-only classes in blocks; `Math.random`/wall clock/network in block fixtures; marking an item certified without the render gate; lowering a Lighthouse, axe or size budget; skipped tests; mocks in remote specs; `certification/**` imports (PLAT's own pixel gates live in `tests/dx/lib/pixel-gates.ts`); MCP network I/O, file writes or child processes; any LLM call (MCP calls none, so Kiro Prism does not apply).
7. Evidence as artifacts; `apps/docs/out/`, `apps/docs/generated/**`, `registry/registry.json` and `apps/docs/public/r/**` are git-ignored outputs.
8. Credentials: none; packages publish only from the tag pipeline.
9. Conventional commits; RM-13 is one squash commit `refactor(5.0)!: remove 4.x docs and tests`; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None except the frozen contract and C0. Verify on `origin/next`: `src/contracts/{components,testing,fragments}.ts` (S-30, S-31, S-40..S-42, S-46), seeds `src/theme/index.ts` (incl. `GlassPreferencesPanel`, S-24) and `src/material/index.ts`, `.storybook/blocks/index.tsx` seed (S-51), `tests/contract-doubles/{cmp,tokens,reports}/`, `build/exports.manifest.json`. Lane 1c's `gen-deprecations.mjs --docs` (PLAT-179) is consumed by the migration guide (task edge PLAT-396); until it lands, the guide renders `pending` sections from the fragment doubles.

Contract seams consumed: S-01, S-06, S-10, S-11, S-21, S-24, S-30, S-31, S-33, S-35, S-37, S-38, S-39, S-40..S-44, S-46 (you provide the registry build), S-51, S-55 (`PerfReport`, `ReleaseVerdict` for claims).

## May touch

`apps/docs/**` (inside `content/` only `content/plat/**`); `scripts/docs/**`; `scripts/registry/**`; `registry/schema/**`, `registry/base/**`, `registry/blocks/{auth,settings}/**`, `registry/items/{code-surface,diff-viewer,gantt,kanban,react-hook-form,rich-text,transfer-list}/**`; `packages/{registry,mcp}/**`; `README.md`, `README.tmpl.md`, `llms.txt`, `llms.txt.tmpl` (on `next`); `.lighthouserc.js`; `stories/plat/**`; `docs/{quickstart,guides,migration}/**`; `docs/inventory/registry-recipe-fates.json`; `docs/release/decisions/removals/RM-13.json`; RM-13 paths (`docs/components/**`, `docs/guides/{consciousness-interface,consciousness-migration,migration,ssr-setup}.md`, `docs/liquid-glass/migration.md`, `docs/recipes/readme.md`, `docs/cli/migration.md`, `docs/theme/theme-engine.md`, `docs/app-shell/readme.md`, `docs/package-entrypoints.md`, `docs/readme.md`, `INSTALLATION.md`, `legacy/tests/**`); `scripts/ci/verify-markdown-links.js`; deletion `scripts/ci/verify-recipes-render.js`; `tests/{registry,docs}/**` except `tests/docs/runbook.test.ts`; `tests/dx/**` except lane 1e's files.

## Must not touch

Other owners' `registry/{blocks,items}/<id>/**` (SURF: `app-frame`, `ai-workspace`, `data-workspace`, `analytics-dashboard`, `media-viewer`, `overlay-flows`, `support-inbox`, `mobile-settings`, `schema-viewer`, `ai-sdk-adapter`, …) — the build and render gate discover them; `apps/docs/content/<other stream>/**` (MAT owns Theming and Choosing a material); `.storybook/**` except importing `.storybook/blocks/index.tsx`; `docs/{motion,design-tokens}.md` (MAT); `docs/certification/**` (QUAL); `docs/release/**` other than `removals/RM-13.json`; `docs/release-rollback-deprecation.md`, `docs/auraglass-5/**`; `ci/**`; `package.json` root; `src/**`.

## Steps

1. PLAT-350: `scripts/docs/paths.mjs` (`DOCS_BASE_URL` = `$CI_PAGES_URL` until OD-12).
2. PLAT-351..357 (REQ-94/95): registry build (every owner's `registry-item.json`, deterministic, certified-SHA filter, size limits, `@auraglass/registry` data), generated `auraglass` base item, schema/build tests, `packages/registry` + `PUBLISHING.md`, shadcn interop spec, registry lint with one seeded failing fixture per rule.
3. PLAT-358..367 (REQ-96): blocks `auth` and `settings` (index, deterministic fixtures, colocated stories with `parameters.ag`, `layout.assert.json`) and the seven PLAT items; render test on seeds and doubles that runs unchanged on real exports.
4. PLAT-368..373 (REQ-97/98): `tests/dx/lib/pixel-gates.ts` (+ unit test), the render gate over every block and item (Next 16 and Vite, 1440/390, light/dark, glass/solid, axe incl. forced colors and contrast more, landmarks, keyboard, touch targets, JS and long-task budgets, pixel gates), recipe fates file and test (committed 4.x id fixture), delete `verify-recipes-render.js` once the gate runs.
5. PLAT-374..385 (REQ-99..102): docs app (Next 16 static export from the packed tarball, exact nav), `Example`/`Claim`/`PropsTable`/`PartsTable`, PLAT content, IA tests, generated component pages and markdown from metas (TSDoc thresholds), PLAT guides (Tailwind v4, plain CSS, shadcn, Next.js, Vite, React Router, RSC table, testing, AI agents), snippet compiler (0 failures vs baseline 79/278), case-sensitive link checker, imports/links/axe/Lighthouse gates, `.lighthouserc.js`.
6. PLAT-386..388 (REQ-103): quickstarts (<= 6 commands, <= 2 manual edits, `{step}` blocks), alpha-smoke fixture, quickstart spec over four cells with timing and material-presence gates.
7. PLAT-389..395 (REQ-104, 106): claims generator/renderer/lint and allow-list, generated README from `README.tmpl.md` (quickstart and release-banner markers), claims tests, generated `llms.txt` (<= 12 KB, version-locked) and `llms-full.txt`, `@auraglass/mcp` with the five tools and the permission-model run (by rc.1).
8. PLAT-396..398 (REQ-105): migration guide template and Migrate pages (from MUI, Radix, Lucide), anchors per entry and B-id, guide test, generated `stories/plat/{migration,packaging}/*.generated.mdx` importing only `.storybook/blocks/index.tsx`.
9. PLAT-399..402 (REQ-83): generated redirects with 301s via `public/_redirects` and `/v4`, redirect/removed tests, RM-13 consumer-grep record (lane 1c's tool), then the RM-13 family PR through `plat:gate:removal`.

## Tests

Node (in `plat:test:registry`, `plat:test:docs`, `plat:gate:glass-quality`): `tests/registry/{schema,build,lint,plat-blocks,recipe-fates}.test.*`; `tests/docs/{docs-artifact,docs-ia,docs-pages,tsdoc-coverage,docs-content,docs-imports,links,lint-claims,readme-generated,llms,migration-guide,redirects,docs-removed}.test.ts`; `tests/dx/lib/pixel-gates.test.ts`; `packages/mcp/test/tools.test.ts`.
Remote (GitLab Playwright runner): `tests/dx/registry-render.spec.ts`, `tests/dx/registry-shadcn-interop.spec.ts`, `tests/dx/quickstart.spec.ts` (clean container + verdaccio), `tests/dx/plain-css.spec.ts`, `tests/dx/docs-a11y.spec.ts` (Chromium, WebKit, 390×844), `tests/dx/docs-lighthouse.spec.ts`; docs static build in `plat:build:docs` (<= 10 min, `out/` <= 150 MB); Pages deploy by lane 1a.

## Visual evidence

Render-gate captures for every block/item cell (Next and Vite × 1440×900 and 390×844 × light/dark × glass/solid; `mobile-settings` also 360×740) with per-cell assertion JSON; quickstart first-render screenshots per cell with timings; docs route screenshots at 320, 390 and 1440 px with axe JSON; Lighthouse reports for the three probe pages — all GitLab artifacts, linked from the claims and the release notes.

## Exit criteria

- AC-PLAT-28: `registry.json` validates; every block of every owner listed and certified at the GA SHA; registry lint 0 violations; render gate passes every cell with 0 console/page errors; shadcn interop installs and builds.
- AC-PLAT-29: all four quickstart cells pass on the GA SHA within <= 300 s (Next) / <= 240 s (Vite) rendering `app-frame` with material presence and 0 console errors.
- AC-PLAT-30: 0 snippet failures, 0 import-lint, 0 broken links; every route axe-clean; Lighthouse budgets met; no page for a non-exported symbol; one guide anchor per entry; 0 unsourced claims, every claim's artifact SHA equals the GA SHA; `llms.txt` version equals `package.json`, <= 12 KB.
- AC-PLAT-31 (registry, MCP): `@auraglass/registry` and `@auraglass/mcp` published with GitLab provenance; the five MCP tools pass schema tests under the permission model.
- AC-PLAT-32 (RM-13): record present, revert-dry-run green, redirects resolve.

## Final report

```
## PROMPT_1f report (PLAT registry, docs and agent DX)
PRs: <urls>  Head SHA: <next>  Pages URL: <CI_PAGES_URL>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Registry: items listed / certified / omitted (registry-report.json)
Docs: snippet failures, broken links, axe violations, Lighthouse scores, build time, out/ size
Claims: resolved / pending (cross-stream artifact missing)
Quickstart: cell -> seconds, material presence, console errors
Deviations / Blockers: <exact output>
```
