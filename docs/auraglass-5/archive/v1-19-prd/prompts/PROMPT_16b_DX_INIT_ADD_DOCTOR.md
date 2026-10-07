# PROMPT-16b (DX): `init`, `add`/`diff`/`update`/eject, `doctor`, `audit backdrop`

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16; contracts in `prd/_shared-contracts.md`: SC-02, SC-23, SC-37 and SC-40). Requirements: REQ-DX-11..25, REQ-DX-27, and the test half of REQ-DX-52. Acceptance: AC-DX-02, AC-DX-03 (4 of the 5 writing commands), plus inputs to AC-DX-04 and AC-DX-10. Tasks: `docs/auraglass-5/tasks/DX.json` DX-023..DX-040. Architecture: §4.4 (shadcn interchange), §5.4 (zero-JS mirrors), §5.5 (shadcn drop-in), §10 (T0 not ejectable). Index and crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally: `npx vitest run` in `packages/cli` (all fixture projects are on-disk trees, and nothing in them builds or launches a browser), and `tsc --noEmit` on a single small fixture. Run remotely, in GitHub Actions `cli.yml` (public repo, hosted runners) or via the `auraone-remote-run` skill: `add.eject.test.ts` (it installs the packed tarball and runs `tsc`), `audit-backdrop.remote.spec.ts`, and any `next build`/`vite build`. Never use local Docker. Never launch a local browser.
- Don't fake completion. That means no stubbed command bodies, no `test.skip`/`.only`/`xit`/`it.todo`, no lowered timing budgets (init ≤2 s, add ≤3 s, doctor ≤5 s), no `-u` snapshot refresh, and no hand-typed `expected/` trees. Generate the expected trees by running the command once, review every line, and commit them with that note in the PR. A mocked HTTP test **does not** satisfy REQ-DX-27's remote half.
- Never inline a hand-copied pre-paint script. Use only the `auraGlassPrepaintScript` export (A11Y, SC-23; A11Y-032/A11Y-034).
- A missing prerequisite owned by another PRD means that task is BLOCKED: report the path or symbol and the owner.
- Evidence is CI artifacts (D-32).

## 1. Prerequisites

1. 16a is merged: `rg --files packages/cli/src/core | sort` lists `config.ts fs-safety.ts git-guard.ts package-manager.ts project-detect.ts report.ts`, and `cd packages/cli && npx vitest run` is green.
2. The DS CSS entries (DS-016, DS-090) exist in the packed 5.0 alpha (`npm pack` in CI, then list): `styles.css`, `tailwind.css`. They are needed for the DX-023 expected output (the import specifiers only). Without the tarball, the unit tests still run on string output, but DX-033 is BLOCKED.
3. A11Y (A11Y-029 provider, A11Y-032 script, A11Y-034 exports): `rg -n "export (function|const) AuraGlassScript|export (function|const) AuraGlassProvider" src` returns hits. For `auraGlassPrepaintScript`: `rg -n "auraGlassPrepaintScript" src` (if absent, DX-024 takes the documented fallback; this is not a blocker).
4. TRUST-075 and REL-010 for DX-037 (repo-root `deprecations.json`, SC-02), plus REL-115 for consumer-4x: `node -e "require('./scripts/docs/paths.mjs')"`, or `import()`, resolves `DEPRECATIONS_PATH`, and that file validates via `node scripts/release/verify-deprecations.mjs`. `CONSUMER_4X_PATH` exists. If either is missing, DX-037 is BLOCKED on TRUST-075, REL-010 or REL-115 (name the one that is missing).
5. QA (QA-018 remote config; the endpoint itself has no task, PRD §21 OI-DX-04) for DX-038/DX-039: a documented remote capture endpoint. `rg -n "capture" docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` currently shows no CLI-facing endpoint (index deviation 5). DX-038 can be built against the request/response schema you define in `schema/output/audit.json`. DX-039 is BLOCKED until the endpoint exists.
6. For the shadcn fixtures: generate `next-shadcn-base-ui` once with the real `shadcn@<exact>` CLI in a remote job, download the tree, and commit it (no `node_modules`).

## 2. File scope

May create or modify: `packages/cli/src/commands/{init,add,diff,update,doctor,audit}.ts`, `packages/cli/src/registry/{install,hash,eject-source}.ts`, `packages/cli/src/core/package-manager.ts`, `packages/cli/schema/{registry-item.json,registry.json,SOURCE.md,output/*.json}`, `packages/cli/test/commands/**`, `packages/cli/test/fixtures/**` (projects: `next-app-tailwind`, `next-app-plain`, `next-app-existing-head`, `next-app-src-dir`, `vite-react-ts`, `vite-react-tailwind`, `next-shadcn-base-ui`, one per doctor check; `registry/`; `doctor-v5.expected.json`), `packages/cli/test/schema-pin.test.ts`, `tests/dx/audit-backdrop.remote.spec.ts`, `tests/dx/fixtures/audit-backdrop/**`, `.github/workflows/cli.yml` (add the remote jobs).
Must not touch: `src/**` (request missing exports from their owners), `bin/aura-glass.cjs`, `registry/**` (16d), `apps/**`, the repo-root `deprecations.json`, other PRDs' scripts. Exception: DX-150 may modify `bin/aura-glass.cjs` on `release/4.x` only, to add `doctor --v5`.

## 3. Steps

1. **DX-028 (first).** Vendor the shadcn v4 `registry-item.json` and `registry.json` schemas, and record the URL, date and sha256 in `SOURCE.md`. Write `schema-pin.test.ts`.
2. **DX-023.** Next App Router `init`, with AST edits through jscodeshift (`tsx` parser) and CSS edits through postcss:
   - `globals.css` line 1 is `@layer theme, base, ag, components, utilities;`, line 2 is `@import "aura-glass/styles.css" layer(ag);`. With Tailwind v4: keep `@import "tailwindcss";` and add `@import "aura-glass/tailwind.css";` after it.
   - `layout.tsx`: `<AuraGlassScript />` is the first child of `<head>`, and `{children}` is wrapped in `<Providers>` from the new `app/providers.tsx` (`"use client"` on line 1).
   - Write `auraglass.json`.
   Fixtures: the 4 Next projects. Assert idempotence (second run is `no changes`, byte-identical) and ≤2 s.
3. **DX-024.** The Vite path as specified, with the fallback info id `prepaint-script-unavailable`.
4. **DX-025, DX-026.** Install argv per package manager (spawn mocked in the unit test only) and `--no-install`. For shadcn alias reuse, there is no second globals file.
5. **DX-027, DX-029, DX-030.** `add`:
   - zod validation (vendored schema plus `meta.auraglass`) and depth-first `registryDependencies` with the cycle path printed.
   - Target paths go through `fs-safety`. `cssVars` merges into `@layer ag {}` without duplicates.
   - Header line `// @auraglass/registry <name>@<ver> sha256:<hex>` (CSS `/* */`). `"use client"` goes on line 1 iff `meta.auraglass.client === true`, with the header on line 2.
   - Rewrite `@/components/…` to the configured alias. Timing ≤3 s with no install.
6. **DX-031, DX-032.** `diff` covers four states, including `--patch`. `update` refuses locally-modified files; with `--force` it writes a `.auraglass-upstream` sidecar.
7. **DX-033, DX-034.** Eject with `--source`. The fixture registry carries `aura-glass-src/{button,dialog,table}.json`, generated from the packed tarball's source by the same function DX-098 will use. Put that function in `packages/cli/src/registry/eject-source.ts` and import it in 16d; don't duplicate it. Rewrite imports to public subpaths and verify them against the `exports` map. Surface/SurfaceGroup/Environment exit 1. The remote job runs `tsc --noEmit` and greps for optics literals.
8. **DX-035..DX-037.** `doctor`:
   - The check ids exactly as listed in REQ-DX-23, one fixture per id.
   - The shadcn downgrade (no `fail` for Radix or MUI, Lucide rule).
   - `--v5`: group by `codemod`, with summary `{automatic, needsReview, manual}`. Generate `doctor-v5.expected.json` by running against `CONSUMER_4X_PATH`, then review it. Include one `recipe:<id>` entry once DX-096 exists, or a fixture deprecations file carrying one until then. ≤5 s.
9. **DX-038, DX-039.** `audit backdrop`. Unit: HTTP mocked, schema-validated, the bundle has no browser module, and with no endpoint it exits 4. Remote spec against the real endpoint: one surface passes and the glass-over-nothing surface fails.
10. **DX-150 (release/4.x, 4.2).** Port `doctor --v5` into `bin/aura-glass.cjs` with the same checks, grouping, summary and output text as DX-037, reading the repo-root `deprecations.json`. Its output on `tests/fixtures/consumer-4x/` must equal `doctor-v5.expected.json`. Don't touch the moved notice (REL-114). REL holds the 4.2 gate (SC-37, REL-090).
11. **DX-040.** Extend `git-guard.test.ts`, `dry-run.test.ts` and `fs-safety.test.ts` to init, add, update and `migrate icons --write` (4/4). 16c adds `migrate 4to5`.

## 4. Tests

- Local: `cd packages/cli && npx vitest run test/commands test/schema-pin.test.ts test/git-guard.test.ts test/dry-run.test.ts test/fs-safety.test.ts`.
- Remote (`cli.yml`): the full suite, `add.eject.test.ts` (tarball + `tsc`), `audit-backdrop.remote.spec.ts`.

## 5. Visual evidence

In the remote job, build `next-app-tailwind` and `vite-react-ts` after `init` + `add` of the fixture item, serve the production build, and capture 1440×900 and 390×844 in light and dark (Chromium). Upload them as artifacts. A human reviewer confirms the AuraGlass surface renders over a backdrop with no unstyled flash. No PNGs in git.

## 6. Exit criteria

- AC-DX-02: every new command test passes, and line coverage stays ≥90%.
- AC-DX-03: the dirty tree exits 3 for init, add, update and `migrate icons --write` (4/4 here), and the `add` path-escape case exits 3.
- REQ-DX-13: both runs are byte-identical for all 6 init fixtures.
- REQ-DX-24: `doctor.shadcn.test.ts` produces 0 `fail`.
- REQ-DX-25: the `doctor --v5` summary equals `doctor-v5.expected.json`.
- REQ-DX-27: the unit half is green, and the remote half is green or reported BLOCKED with the missing endpoint.

## 7. Final report format

```
PROMPT-16b report
PR: <url>  SHA: <sha>
Prereqs: 1 <ok> 2 <tarball ver|blocked> 3 <Script/Provider ok; prepaint const present|absent→fallback> 4 <ok|blocked TRUST-075/REL-010/REL-115> 5 <endpoint url|blocked QA PRD> 6 <shadcn ver>
Tasks: DX-023 <done|blocked: reason> … DX-040, DX-150
Timings (remote): init <s>, add <s>, doctor consumer-4x <s>
Tests: local <pass>/<total>, 0 skipped; remote <run urls>
Visual artifacts: <urls>; reviewer: <name> <ok|issues>
AC: AC-DX-02 <pass|fail>, AC-DX-03 (4/5) <pass|fail>
Requests filed: <A11Y auraGlassPrepaintScript | QA endpoint (OI-DX-04) | …>
Deviations: <list with evidence>
```
