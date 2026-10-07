# PROMPT-1b (PLAT): 4.x line — 4.1.1 trust patch, 4.2/4.3 bridge, frozen 4.x fixture

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §3 (4.x end state), §5.4, §5.5, §13.5, §14.1, §15.1, §16 (4.1.1 rows), §11 risks 8–9.
Requirements: REQ-PLAT-37..50, REQ-PLAT-52..63 (plus the 4.x wiring halves of REQ-PLAT-12, -27, -31, -35).
Acceptance: AC-PLAT-01..13 (4.1.1 tag), AC-PLAT-15..17 (4.2/4.3), AC-PLAT-20 (4.x half).
Tasks: PLAT-055..PLAT-167 (`lane: "1b-4X"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_00a..00g_TRUST_*.md`, `PROMPT_01c_REL_CLASSIFY_BRANCH.md`, `PROMPT_01d_REL_RUNTIME_42.md`, `PROMPT_01e_REL_CONTRACTS_43.md` (their GitHub Actions jobs are GitLab jobs of lane 1a now; their "Must change" registry rows are replaced by the contract).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-4x`; branches `4x-plat/4x-<topic>` from `origin/release/4.x` only (cut at `v4.1.0` by C0). `main` is frozen; 5.0 work is on `next` and never here.

## Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt.
2. Concurrency: start on day 0. The 4.x line is intra-stream: on `release/4.x` PLAT owns every path except other streams' `fragments/{deprecations,codemods}/<s>*`, `ci/<s>*` and row H (MAT's bridge content). A row-H input absent at a cut is omitted from that minor, never waited for. Other PLAT lanes' tools are consumed only through the late task edges listed in the index (PLAT-135, 137, 139, 145, 148, 151, 159, 162).
3. Ownership: lane 1b owns every PLAT path on `release/4.x` except the line-neutral files of lanes 1a, 1c, 1d (`src/compat/css/globals.css`) and 1e (`packages/cli/**`) listed in the index. Changesets `.changeset/plat-4x-<topic>.md`.
4. CI/CD is GitLab CI only. Your tests run in the C0 seed jobs from day 0 (`plat:gate:glass-quality` runs `jest --ci` on `4x`; `plat:integration:next`/`:vite` run the 4.1.0 integration scripts); lane 1a adds `plat:test:pack-matrix`, `plat:test:react19`, `plat:test:visual-4x`. Never add or edit a GitHub workflow. Merge only after `node scripts/ci/gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: no Docker build of `Dockerfile`, no Playwright/Chromium, Storybook build, `npm run build`, full `jest --ci`, `next build`, integration scripts or `npm pack` matrix on the Mac. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <touched files>`, `npx jest <one jsdom test file>`.
6. Forbidden: mock/placeholder/TODO fixes reported as done; skipped or `.only` tests; `--passWithNoTests`; `|| true`, `--no-verify`; lowering any budget or count; snapshot updates to pass (single reviewed exception PLAT-069: the two GlassButton/GlassCard snapshots, regenerated in CI, with the accepted c07fd7111 fill change stated in the PR); shipping a contract stub.
7. Patch scope for 4.1.1: no change to `dependencies`, `peerDependencies` or `exports`; no export removed; no React floor change; no root `"use client"`; no deletion of `server/` or `src/services/**`; no history rewrite. Every observable behaviour removal is a §13.1 exception with a `fragments/deprecations/plat.ts` entry (`DEP-P####`, `since: '4.1.1'`, `removeIn: '5.0.0'`) and a release-note line.
8. No committed evidence; decision records only (`docs/release/decisions/4.*.md`, `docs/release/visual-fixes/*.json`).
9. Credentials: no publish from the Mac, no token exports; the tag is pushed on GitHub and published by the GitLab tag pipeline. GHSA publication, npm trusted publisher (OD-10), font licence (D-31) are owner gates recorded in the release issue.
10. Conventional commits with no `!` (any `!` on `release/4.x` fails change class); end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None except the frozen contract and C0. Verify:
- `git rev-parse origin/release/4.x` descends from `v4.1.0` (`15b6de6f7`).
- In the main checkout `git status --porcelain` shows ` M scripts/ci/{run-next-integration,run-vite-integration,verify-pack}.js` and ` M reports/3.2-release/vite-integration.json`: carry exactly those three script diffs into PLAT-055 (copy the diff into the worktree with `git diff -- <3 files> | git -C ../AuraGlass.wt/plat-4x apply`), restore the report file. If already committed, cite the commit.
- `ci/plat.gitlab-ci.yml` exists on `release/4.x` (C0 seed). If lane 1a's added jobs are not merged yet, use the seed jobs; do not edit the CI fragment.

Contract seams consumed: S-38 and S-50 (deprecation fragment schema and loader for `fragments/deprecations/plat.ts`), S-47 (`motion-no-empty-animate` rule name), S-22 note (4.x provider `preview?: 'v5'`), S-37 format (4.x `warnDeprecated`), S-11 (row-H token outputs), S-43 (fixture registered as an L11 subject on `next` by 1a). Test inputs: the 4.1.0 code; real npm pack outputs captured in CI; the row-H-absent fixture of REQ-PLAT-60.

## May touch (on `release/4.x` only)

Every PLAT path on `release/4.x` (4.x `src/**`, `server/**`, `Dockerfile`, `.env.example`, `.gitignore`, `package.json` scripts/files/version and, from 4.2, peers per REQ-PLAT-56, `eslint.config.js`, `eslint-plugin-auraglass.js`, `.storybook/**` (4.x only), `scripts/**` except the line-neutral files, `README.md`, `llms.txt`, `SECURITY.md`, `CHANGELOG.md`, `RELEASE_NOTES_4.1.*.md`, `fragments/deprecations/plat.ts`, `etc/api/*` 4.x baseline files, `docs/inventory/component_inventory.json`, `docs/certification/certification-audit-spec.md`, `docs/security/**`, `docs/release/decisions/4.*.md`, `docs/release/visual-fixes/**`, `tests/{ci,release,deployment,eslint,docs,deprecations,fixtures/consumer-4x}/**` files of PLAT-055..167, root probe scripts and `reports/` (untrack/delete)).

## Must not touch

`next` and `main`; `.gitlab-ci.yml`, `ci/**`, `scripts/ci/{verify-ownership,verify-ci-fragments,gitlab-status,assemble-pages}.mjs`, `scripts/ci/require-ci-publish.js`, `scripts/release/**`, `scripts/build/api-report.mjs`, `api-extractor.base.json`, `docs/release/{branch-policy,change-classes,lts-policy,train}.md`, `docs/release/*.json`, `docs/schemas/**`, `docs/release-rollback-deprecation.md` (line-neutral files of lanes 1a/1c); `packages/cli/**` (1e); `src/compat/css/globals.css` (1d); row H (`src/material/**`, `tokens/**`, `scripts/tokens/**`, `src/styles/{v5,preview-v5}.css`, `tokens/compat-alias-map.json`: MAT); other streams' fragments and `tests/fixtures/consumer-4x/cases/<s>/**`; `.github/workflows/**`; `docs/auraglass-5/**`.

## Steps

**4.1.1 (target week of 2026-10-12; a missed gate moves the date, never the gate).** Open PRs in parallel where files do not overlap.
1. PLAT-055..063 (REQ-37/38): pack-fix commit, `scripts/ci/lib/npm-pack.js` (npm 10/11/12 shapes), CI-captured fixtures, all five callers, `evidence-dir.js`, the 28 `reports/` writers, tests; then run `plat:test:pack-matrix` on both legs.
2. PLAT-071..084 (REQ-40..43): adaptiveAI opt-in + `enableAdaptiveAI`, 4.x import side-effect gate and baseline, GlassCanvas `new Function` removal + `onComponentAction`, video player data-src fix, ContrastGuard `unverified`, `validateTextContrast` `"unverified"`, each with its test.
3. PLAT-085..096 (REQ-44..47): rules-of-hooks registration, `useOptional*` readers, hoist all 109 conditional calls (count measured in CI), `GlassInput`/hooks-order tests, `"use client"` on `/primitives` and `/theme` + `client-entries.json` + RSC page in the Next integration app, hydration-stable helpers, `Slot` ref by React major, React 19 matrix record.
4. PLAT-097..107 (REQ-48/49): motion test utils, the 84 reduced-motion sites in two batches, 35-row test, 4.x `motion-no-empty-animate` rule, remote reduced-motion pass in `plat:test:visual-4x`, cookie-consent visibility, command-palette regex escape.
5. PLAT-064..070 (REQ-39) after steps 2–4 merge: measure `lint:check`, fix or baseline `no-inline-glass` (shrink-only), decision record, non-mutating `lint`, `no-gate-bypass` test, the reviewed snapshot update, gate green.
6. PLAT-108..115 (REQ-50): relocate the inventory and certification spec, `ensure-component-inventory` exits 1 when missing, `git rm -r --cached reports`, delete the 45 root probes, `verify-tree-hygiene.js`, report-path constants as `kind: 'export'` entries.
7. PLAT-116..132 (REQ-52..54): README/llms/RELEASE_NOTES_4.1.0/CHANGELOG retractions and the ledger-corrections note, `verify-docs-claims.js`, advisory draft (bounded AuraOne grep, counts only), JWT guard, Dockerfile/.env.example, SECURITY.md, owner GHSA handoff, font decision and default removal, tarball font assertion, labelled visual-fix record with composites.
8. PLAT-133..140 (REQ-55): complete the 4.1.1 deprecation set (>= 19, 20 with font), API reports + export snapshots for all 47 keys from the 4.1.1 build using lane 1c's tools in a GitLab job (commit the artifact unedited), patch-scope test, `prepublishOnly` → `require-ci-publish.js`, remove `release` scripts, size check, release commit, then — only after the GHSA is published, OD-10 is configured and lane 1a's gates are flipped — tag `v4.1.1` on GitHub; verify provenance (AC-PLAT-01); compile the AC table.

**4.2.0 (2026-11-16)** — PLAT-141..155, 163: dependency diet as install-level C-D (OI-3 decision record first), lazy importers with the exact install error, `kind: 'dependency'` and all §14.4 "4.2" entries, real `/forms` and `/data` builds, `./deprecations.json`, 4.x budgets, 4.x `warnDeprecated` + generated table (via lane 1c's generator), providers wrapping, stale TSDoc block, D-28 fixes with visual-fix records, opacity vars, Switch shimmer, FPS loops, WorkspaceTabs props; downstream grep record; 4.2.0 gate record; tag.

**4.3.0 (2027-01-18)** — PLAT-156..162: `./material`, `preview="v5"`, `./styles/v5.css`, `./compat/tokens.css`, `./compat/globals.css` wiring with the row-H-absent omission test, Storybook `preview` toolbar global, 4.x CLI `doctor --v5` port and `MOVED_NOTICE`, PLAT entries active `since <= 4.3.0`, coverage artifact, `@auraglass/cli@0.x` published from the tag pipeline (lane 1e cherry-picks `packages/cli`), 4.3.0 gate record; tag. 4.4.0 only for late C-D entries whose B-id exists.

**Fixture** — PLAT-164..167 (REQ-63) any time from day 0: `tests/fixtures/consumer-4x/` harness (Next 15 + React 19.0, Vite + React 18.3, >= 30 root exports, aliases, subpaths, `--glass-*` reads, global reliance, mobile page), `undeclared-deps` fixture, contents test, run on every 4.x tag. Frozen after first green; later edits need release-owner CODEOWNERS approval (contract PR adds the CODEOWNERS line).

## Tests

jsdom/node (in `plat:gate:glass-quality` on `4x`): `tests/ci/{npm-pack,evidence-dir,no-gate-bypass,import-side-effects,use-client-entries,tree-hygiene,tarball-fonts,package-json-patch-scope}.test.ts`; `src/utils/__tests__/adaptiveAI.optin.test.ts`; `GlassCanvas.security.test.tsx`; `GlassAdvancedVideoPlayer.datasrc.test.tsx`; `ContrastGuard.honesty.test.tsx`; `validateTextContrast.test.ts`; `GlassInput.hooks.test.tsx`; `src/__tests__/hooks-order.test.tsx`; `src/__tests__/ssr/hydration.test.tsx`; `Slot.ref.test.tsx`; `src/__tests__/motion/reduced-motion-visible.test.tsx`; `tests/eslint/motion-no-empty-animate.test.ts`; `GlassCommandPalette.regex.test.tsx`; `cookie-consent/__tests__/visibility.test.tsx`; `tests/docs/claims-lint.test.ts`; `tests/deployment/jwt-secret-guard.test.ts`; `tests/deprecations/seed-4.1.1.test.ts`; `tests/release/{diet-4.2,budgets-4x,providers-wrap,bridge-wiring,cli-4x,consumer-4x-contents}.test.ts`; `tests/release/4x-fixes/*`.
Remote (GitLab): `plat:test:pack-matrix` (Node 20/npm 10, Node 24/npm 11), `plat:test:react19` (smoke + unit legs), `plat:integration:next` (incl. the RSC page `next build`), `plat:integration:vite`, `plat:test:visual-4x` (app chrome, reduced-motion pass, font composites, D-28 records, preview cells), `jest-axe` suites in touched folders.

## Visual evidence

`plat:test:visual-4x` artifacts: base | head | diff composites at 1440×900 and 390×844, light and dark, for the font fallback (line-count diff per text node, 0 overflow), the D-28 dark text and contrast-more fixes (measured contrast per text run), the reduced-motion settle check, and the 4.3 preview cells. Each labelled visual change has its `docs/release/visual-fixes/<slug>.json` listing exactly the changed cells.

## Exit criteria

- 4.1.1 tag: AC-PLAT-01..13 hold (provenance names GitLab CI and the project; four gates `allow_failure: false`; no token path; pack matrix both legs; 0 import-time listeners; `new Function`/`eval` only at the three allowed lines; 0 rules-of-hooks and 0 `lint:check` errors; RSC page builds; hydration clean on 18.2 and 19; 35/35 reduced-motion; ContrastGuard unverified; claims lint 0; `reports/` untracked, <= 3,000 files; one font outcome; 47 export snapshots and >= 19/20 entries; patch scope; GHSA published before the tag; JWT guard).
- 4.2.0 / 4.3.0: AC-PLAT-15, -16, -17 hold; AC-PLAT-20 holds on every 4.x tag.
- All PLAT-055..167 done or listed with their external gate.

## Final report

```
## PROMPT_1b report (PLAT 4.x line)
Tags: v4.1.1 <sha> <pipeline>, v4.2.0 ..., v4.3.0 ...
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Measurements: hook calls hoisted N (CI count), lint errors before/after, reduced-motion 35/35, tarball bytes, Button min/gz, entries count
Exceptions shipped (DEP-P ids): <list>
Owner gates: GHSA <id, published time>, OD-10 <status>, D-31 <outcome>, OI-3 <decision>
Deviations / Blockers: <exact output>
```
