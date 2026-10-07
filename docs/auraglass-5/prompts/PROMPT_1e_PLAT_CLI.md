# PROMPT-1e (PLAT): `@auraglass/cli`, the `migrate 4to5` engine and TypeScript DX

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.6, §5.8, §11 (codemod column), §12.1 (`packages/cli`, `tests/dx` codemod rows, `tests/types/plat`), §12.2 (catalogue minimum cases), §15.3, §16 (CLI and codemod rows), §22 (CP-PLAT-1, OI-5).
Requirements: REQ-PLAT-84..93 (plus `packages/cli/PUBLISHING.md` for REQ-PLAT-15, `etc/api/cli.*` for REQ-PLAT-22, the 4.3 CLI publish half of REQ-PLAT-62).
Acceptance: AC-PLAT-20 (5.0 half), AC-PLAT-21, AC-PLAT-31 (CLI), AC-PLAT-22 (type DX tests).
Tasks: PLAT-299..PLAT-349 (`lane: "1e-CLI"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: the DX prompts in `archive/v1-19-prd/prompts/` covering `packages/cli` (init/add/diff/update/doctor/audit/migrate) and the REL codemod catalogue; `cli.yml` jobs are now `plat:test:cli`; mapping data comes only from `fragments/codemods/*` (contract §4.8), never from `gen-codemod-tables.mjs` or metas.
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-cli`; branches `next-plat/cli-<topic>` from `origin/next`; by 4.3.0 the same `packages/cli/**` commits are cherry-picked to `release/4.x` (`4x-plat/cli-<topic>`, PLAT-349).

## Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt. Workspace dependencies come only from contract PR CP-PLAT-1 (PLAT-300).
2. Concurrency: start on day 0. Core safety, the JSON contract, the runner and fixtures proceed while CP-PLAT-1 is open (TypeScript compiler API and the frozen set); jscodeshift/postcss transforms run once it merges — no other lane or stream is waited for. Area transforms are written test-first against the owning stream's `areaTransforms[].spec` and fixtures in `fragments/codemods/{surf,mat}*`; until those exist, against `tests/contract-doubles/fragments/` codemod doubles; their fixtures report `pending` until your transform lands (W-3).
3. Ownership: only the "May touch" list; changesets `.changeset/plat-cli-<topic>.md`.
4. GitLab CI only (`plat:test:cli`, `plat:audit:backdrop` manual); never a GitHub workflow; merge after `gitlab-status.mjs --sha <head>` succeeds.
5. Remote-first: the codemod canary (`next build`, three browsers), the 2,000-file perf run, the audit-backdrop remote spec and CLI cold-start timing run in GitLab jobs. Locally: `npx jest <one CLI test file>` over temp-dir fixtures, bounded `rg`, `git`. The CLI bundle never resolves `playwright` or `chromium`.
6. Forbidden: guessing transforms (dynamic values, computed CSS names, unmapped values stay unchanged with the exact `TODO_MARKER`); hard-coded `Glass*`/`--glass-*` literals in `transforms/**`; fixtures edited to match a wrong transform output; `automation: 'full'` outputs containing TODOs; removing a minimum case; skipped tests; mocked HTTP in the remote spec; importing `aura-glass` runtime components or `certification/**`; writing outside the project or into a dirty tree without the flag.
7. Evidence as artifacts (`.artifacts/plat/cli/…`); fixtures are source, not evidence.
8. Credentials: none; publishing only from the tag pipeline; the CLI never stores tokens.
9. Conventional commits; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None except the frozen contract and C0. Verify on `origin/next`: `src/contracts/fragments.ts` (`DeprecationFragment`, `CodemodFragment`, `CORE_CODEMODS`, `AREA_CODEMODS`, `TODO_MARKER`), `src/contracts/load-fragments.mjs`, `src/contracts/components.ts` (S-30/S-31), `src/theme/index.ts` seed (`AuraGlassProvider`, `AuraGlassScript`, `auraGlassPrepaintScript`), `contracts/packages.json` (package names), `tests/contract-doubles/{fragments,cmp}/`. The frozen 4.x fixture `tests/fixtures/consumer-4x/` (lane 1b) is read-only input; if not yet frozen, use its current state and report cells `pending`.

Contract seams consumed: S-38, S-39, S-50 (deprecation and codemod fragments through `loadFragments`), S-22 (init insertion points), S-30, S-31, S-05, S-06, S-35 (eject set, type DX), S-46 (registry layout for `add`), S-36, S-49 (package name and frozen deps), S-43 (L11 registration of the canary by lane 1a).

## May touch

`packages/cli/**`; `fragments/codemods/plat.ts`, `fragments/codemods/plat/**`; `etc/api/cli.api.md`, `etc/api/cli.exports.json`; `tests/types/plat/**`; `tests/dx/{codemod-canary.spec.ts,codemod-perf.test.ts,audit-backdrop.remote.spec.ts}`; `tests/dx/fixtures/{recipes-4x,large-tree}/**`; deletions `scripts/migrate/**`, `scripts/codemods/**`, `tools/codemods/**`, `scripts/ci/{verify-cli,verify-recipes-cli}.js` on `next`.

## Must not touch

Other streams' `fragments/codemods/<s>*` and their fixtures (you read them); `bin/aura-glass.cjs` (lane 1b ports `doctor --v5` and `MOVED_NOTICE` from your `meta.ts`); `tests/fixtures/consumer-4x/**` (1b); `registry/**` (1f; `add` reads it); `ci/**` (1a wires `plat:test:cli`); `package.json` root (1d); `certification/**`; `src/**`.

## Steps

1. PLAT-299..302 (REQ-84): package, `meta.ts` (`PACKAGE_NAME`, `MOVED_NOTICE`), dependency allowlist, CP-PLAT-1 contract PR, router with `--cwd/--json/--yes/--silent`, exit codes 0–4, `NO_COLOR`, output schemas, contract/version tests.
2. PLAT-303..304 (REQ-85): `fs-safety` (realpath both sides), `git-guard` (dirty touched paths, outside work tree), atomic writes, `--dry-run`; tests with `../x`, absolute, symlink, `--out ../`.
3. PLAT-305..313 (REQ-86/87): project detection, `init` for Next App Router, Vite, shadcn (idempotent; never optional peers), registry client, `list`/`info`, `add` (vendored shadcn v4 schema pinned by sha256, dependency resolution with cycle exit 1, alias rewrite, directive iff `client`, cssVars merge, sha256 header), `--source` eject (44 flagships + T2 core; no optics literals), `diff`/`update`; tests.
4. PLAT-314..319 (REQ-88/89): `doctor` checks and `--v5` report (equals `doctor-v5.expected.json`), legacy `audit deps|imports`, `migrate icons --from lucide`, report-only `radix|mui`; `audit backdrop` remote-only with thresholds constants, own Playwright config, mocked unit test and the no-mocks remote spec (ships at GA only if green, else 5.1).
5. PLAT-320..339 (REQ-90/91): runner (order, globbing, TODO format, preservation, report schema), mapping compilation from `loadFragments('codemods')` + the no-hard-coded-names lint, `catalogue.json`, the 8 core transforms fixture-first with every §12.2 minimum case, the 6 area transforms from SURF/MAT specs, fixture/typecheck/catalogue/deprecation-coverage tests, PLAT's own codemod fragment (subpaths B4/B17–B19, deps list, removed services).
6. PLAT-340..343 (REQ-92): codemod canary (frozen fixture → packed CLI → packed 5.0 → 0 TODOs on the flagship subset, `tsc`, `next build`, three-browser smoke, idempotent second run; every registry block; the 28 4.x recipes → exactly `expected-todos.json`), large-tree perf, AuraOne import-site snapshot for the RC review (read-only).
7. PLAT-344 (REQ-93): type DX tests over the packed `.d.ts` (literal unions, Button variant/intent/prominent, type errors, language-service completion sets); seed subjects report `pending`.
8. PLAT-345..349: CLI perf test, `PUBLISHING.md`, `etc/api/cli.api.md`, delete the 4.x migrate/codemod scripts after successors pass, cherry-pick `packages/cli/**` to `release/4.x` for the `v4.3.0` publish of `@auraglass/cli@0.x`.

## Tests

Node (in `plat:test:cli`): `packages/cli/test/{package,deps,contract,version,fs-safety,git-guard,dry-run,perf}.test.ts`; `packages/cli/test/commands/{list-info,init.next,init.vite,init.shadcn,init.install,add,add.rsc-alias,add.eject,diff,update,doctor,doctor.shadcn,doctor.v5,audit.compat,migrate-legacy,audit-backdrop}.test.ts`; `packages/cli/src/migrate/4to5/__tests__/{runner,todo-format,preserve,no-hardcoded-names,fixtures,fixtures-typecheck,catalogue-coverage,deprecation-coverage}.test.ts`; `tests/types/plat/{autocomplete.test-d.ts,completions.test.ts}`.
Remote (GitLab Playwright runner): `tests/dx/codemod-canary.spec.ts` (Chromium, WebKit, Firefox), `tests/dx/codemod-perf.test.ts`, `tests/dx/audit-backdrop.remote.spec.ts` (manual `plat:audit:backdrop`).

## Visual evidence

Codemod-canary screenshots of the migrated frozen fixture at 1440×900 and 390×844 (mobile app-shell page `scrollWidth <= 390`) in three browsers, plus the per-run report JSON, as `plat:test:cli` artifacts; audit-backdrop pass/fail captures from the remote spec.

## Exit criteria

- AC-PLAT-21: 100% of §12.2 minimum cases exist and pass byte-equality and idempotence; 100% of entries with `codemod != null` covered by a fixture; 0 TODOs in `automation: 'full'` outputs; `migrate 4to5` on every canary and block: 0 errors and 0 changes on a second run.
- AC-PLAT-20 (5.0 half): on `5.0.0-rc.1` the frozen fixture builds (`next build`, Vite) and renders after `migrate 4to5` with 0 TODOs on the flagship subset.
- AC-PLAT-31 (CLI): `@auraglass/cli` (or `aura-glass-cli`) on npm with GitLab provenance; `npm view aura-glass@5 bin` empty.
- Perf rows of §16 for CLI and codemods met on the GitLab runner.

## Final report

```
## PROMPT_1e report (PLAT CLI and codemods)
PRs: <urls>  Head SHA: <next>; 4.x cherry-pick SHA: <release/4.x>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Codemods: transform -> cases passing / pending (owner fixture missing)
Canary: TODOs on flagship subset, tsc, next build, browsers, second-run changes, run time
CP-PLAT-1: <PR url, state>
Deviations / Blockers: <exact output>
```
