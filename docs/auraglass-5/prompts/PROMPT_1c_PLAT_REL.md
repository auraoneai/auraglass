# PROMPT-1c (PLAT): change control, deprecations, release governance and removal of `legacy/**`

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md` (PRD-1) §4.3, §4.4, §4.7, §5.3, §5.7, §9, §11 (breaking register), §12.1 (`tests/{release,deprecations,compat,removal}`), §19 (S-37, S-38, S-39 engine side, S-55 reads).
Requirements: REQ-PLAT-18..36, REQ-PLAT-79..82 (RM-01..RM-12; RM-13 is lane 1f), the `next` half of REQ-PLAT-50.
Acceptance: AC-PLAT-15..19, AC-PLAT-23 (snapshot half), AC-PLAT-32, AC-PLAT-33 (gate records).
Tasks: PLAT-168..PLAT-241 (`lane: "1c-REL"`).
Index: `docs/auraglass-5/prompts/PROMPT_1_PLAT.md`. Archived specifics reused: `archive/v1-19-prd/prompts/PROMPT_01a_REL_BASELINE.md`, `PROMPT_01b_REL_PUBLISH_LEDGER.md` (ledger, notes), `PROMPT_01c_REL_CLASSIFY_BRANCH.md`, `PROMPT_01e_REL_CONTRACTS_43.md`, `PROMPT_01f_REL_TRAIN_OPS.md`, `PROMPT_08f_FND_REMOVAL_EXECUTION.md` (labels → commit trailers and committed records; `removal-gate.yml` → `plat:gate:removal`; `gh api` in CI → operator-run records).
Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`. Worktree `../AuraGlass.wt/plat-rel`; branches `next-plat/rel-<topic>` and `next-plat/rm-<nn>-<slug>` from `origin/next`; line-neutral tools also land on `release/4.x` via `4x-plat/rel-<topic>` (same commits, cherry-picked).

## Common rules (binding)

1. Precedence: Gurbaksh's live instructions → contract-v1.1 → PRD-1 → this prompt.
2. Concurrency: start on day 0; never wait for another stream or PLAT lane. Fragments, metas, compat reports and QUAL reports are read through `loadFragments` (S-50), `etc/api/*` files and `optional: true` artifacts; whatever is absent is `pending` or `uncovered`, never a failure on PRs (G-07 decides at the GA tag).
3. Ownership: only the "May touch" list; changesets `.changeset/plat-rel-<topic>.md`.
4. GitLab CI only. No script reads PR labels or calls the GitHub API in CI: visual-fix approval is a committed `docs/release/visual-fixes/<slug>.json`, multi-family removal is the commit trailer `Multi-Family: <reason>`. Operator-only reads (`gh search code`, `gh api` for GHSA and the archive) run from this worktree with the existing `gh` login and produce committed records.
5. Remote-first: API Extractor runs, export snapshots from packed tarballs, the 4.1.0 → 4.1.1 diff, revert dry-runs and the Vite production-strip test run in GitLab jobs. Locally: bounded `rg`, `git`, `node -e`, `npx eslint <files>`, `npx jest <one test file>`. `downstream-grep.mjs` and `consumer-grep.mjs` are bounded (`rg` with the listed excludes; refuse `$HOME` and `/`).
6. Forbidden: fake classifiers that always pass; hand-edited generated files (`deprecations.json`, `src/internal/deprecations.generated.ts`, schema); skipped tests; lowering rules; shipping a contract stub; history rewrite; deleting any file outside the RM family's paths.
7. Evidence as GitLab artifacts; committed only: decision records, registers, removal records (paths and counts only, no secrets).
8. Credentials: none in CI; no token exports; owner steps (archive repo, GHSA, drill) recorded in the release issue.
9. Conventional commits; RM PRs are one squash commit `refactor(5.0)!: remove <family>` on `next`; never `!` on `release/4.x`; end messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

None except the frozen contract and C0. Verify: `src/contracts/{fragments.ts,load-fragments.mjs}` (S-38, S-39, S-50), `src/internal/*` seeds (S-37), `scripts/build/api-report.mjs` seed with its final CLI (C0-13), `tests/contract-doubles/{fragments,reports}/` and `legacy/` (C0-10 quarantine) exist on `origin/next`.

Contract seams consumed: S-35 (`ENTRIES` for 5x API reports), S-37 (internal helpers you complete), S-38/S-39 (deprecation and codemod schemas, `CORE_CODEMODS`, `AREA_CODEMODS`), S-50 (`loadFragments`), S-55 (`VisualClassReport`), S-30 (compat adapter render contract). Doubles: `tests/contract-doubles/fragments/*`, `tests/contract-doubles/reports/visual-class.json`, compat seeds.

## May touch

`scripts/release/**` except 1a's six files; `scripts/release/lib/**`; `scripts/build/api-report.mjs`; `api-extractor.base.json`; `etc/api/**` tooling/config (never another owner's report; `etc/api/cli.*` is 1e's; 4.x baseline reports are committed by 1b); `docs/release/{change-classes,lts-policy,train}.md`; `docs/release/{exception-allowlist,ledger-corrections,breaking-changes}.json`; `docs/release/decisions/{5.0.0-gates,rollback-drill,change-class-canary}.md`; `docs/release/decisions/downstream-*.json`; `docs/release/decisions/removals/RM-01..RM-12.json`; `docs/schemas/**`; `docs/release-rollback-deprecation.md`; `docs/inventory/component-dispositions.md`; `src/internal/**`; `src/compat/plat/**`; `tests/{release,deprecations,compat,removal}/**` except 1a's and 1b's files; `tests/docs/runbook.test.ts`; `scripts/removal/**`; `legacy/**` except `legacy/tests/**`; root 4.x assets on `next` (`server/`, `Dockerfile`, `docker-compose*.yml`, `nginx.conf`, `tsconfig.server.json`, `workers/`, `bin/`, `examples/`, `visual-baselines/`, `reports/`, root probes, `.dockerignore`, `.env.example`); `.gitignore` (next; content pre-declared in the index); `SECURITY.md` (next); `tools/**` except `tools/codemods/**`; the four root 4.x scripts of PLAT-240.

## Must not touch

`package.json` (1d; scripts you need are invoked as `node scripts/release/<x>.mjs`); `ci/**` (1a; it wires your scripts per the job table); `fragments/deprecations/plat.ts` (1b) and any other stream's fragment; `src/compat/<other>/**`, `src/compat/index.ts` (CONTRACT); `etc/api/<entry>.*` of entry owners; `docs/release/decisions/4.*.md`, `docs/release/visual-fixes/**` (1b); `apps/docs/**` (your `--docs` output is the git-ignored `apps/docs/generated/migration/deprecations.md`, written when 1f's build runs your generator); `legacy/tests/**` and the RM-13 docs (1f); `.github/**`.

## Steps

1. PLAT-168..174 (REQ-18..21): `lib/policy.mjs` (only code copy of the taxonomy), `change-classes.md`, `classify-change.mjs` over API diffs, export snapshots, fragment diffs, `VisualClassReport` with `VISUAL_TOLERANCE`, `package.json` key diff, commit markers and changeset bumps; visual-fix records; `Multi-Family:` trailer; table-driven tests; the AC-PLAT-17 canary on `release/4.x` and its record.
2. PLAT-175..178 (REQ-22/23): API Extractor 7.59.4 behind the C0 `api:update` CLI (4x and 5x modes, B22a paths, `unanalysable`), `export-snapshot.mjs` (runtime/require/types names, `typesRuntimeMismatch`, byte-stable). Land on both lines early: lane 1b's 4.1.1 baseline (PLAT-135) uses them.
3. PLAT-179..189 (REQ-24..27): `gen-deprecations.mjs` (root `deprecations.json`, committed `src/internal/deprecations.generated.ts`, `--line 4x --out`, `--docs`, `--check`), generated schema, `verify-deprecations.mjs` (prefixes `DEP-P/M/C/S/Q`, since/removeIn rules, codemod and breaking references, `--compare-branch`), `src/internal` completion (`cn`, `warnDeprecated` format and silent/production/once rules), CP-PLAT-3 contract PR, `check-tsdoc-deprecated.mjs`; tests.
4. PLAT-190..195 (REQ-28/29): G-07 prior-deprecation coverage in `classify-change.mjs`, `exception-allowlist.json`, `breaking-changes.json` (B1–B21), `verify-breaking-register.mjs` (+ `--coverage` artifact); tests.
5. PLAT-196..199 (REQ-30): `src/compat/plat/index.ts`, `verify-compat-coverage.mjs`, coverage and generic adapter-contract tests (role/name parity, warn-at-call-time).
6. PLAT-200..217 (REQ-31..36): release ledger + corrections, `release-notes.mjs` (heading order, deps first, claims-sourced numbers, SURF capability-ledger section read-only), rollback runbook rewrite + test + drill record (owner's npm 2FA), LTS policy, release-comms verifier, SECURITY.md for 5.x, `downstream-grep.mjs` + runs at the 4.2 cut and rc.1 (AuraOne follow-up issue, no AuraOne edits), `train.md` + test, 5.0 gate records.
7. PLAT-218..227 (REQ-50 next half, REQ-80..82): untrack `reports/` and probes on `next`, `.gitignore` per the index, dispositions generator (all 496 components, R-01..R-18) + committed output + progress and deprecation-coverage tests, `consumer-grep.mjs` (+ `--verify`), `verify-archive.mjs`, the private archive (owner), `no-backend` test.
8. PLAT-228..241 (REQ-79): RM-02..RM-12 in any order, each after its consumer-grep record, one squash commit, PR body with the generated records, `plat:gate:removal` incl. revert dry-run; RM-01 only after the published GHSA id and the verified archive are in `RM-01.json`; root 4.x tooling deletions; `legacy-empty` GA-scope test (G-12; RM-13 is lane 1f's).

## Tests

Node (in `plat:gate:glass-quality`, `plat:gate:change-class`, `plat:gate:removal`): `tests/release/{policy,classify-change,api-report,export-snapshot,release-ledger,release-notes,release-comms,downstream-grep,train}.test.ts`; `tests/deprecations/{gen,verify,warn-deprecated,tsdoc,prior-deprecation,breaking-register}.test.ts`; `tests/compat/{coverage.test.ts,adapters-contract.test.tsx}`; `tests/removal/{inventory-remove-progress,deprecations-coverage,no-backend,legacy-empty}.test.ts`; `scripts/removal/consumer-grep.test.mjs` (`node --test`); `tests/docs/runbook.test.ts`.
Remote (GitLab): the 4.1.0 → 4.1.1 export-snapshot diff from the published tarball, API Extractor on every entry, the Vite production build proving `warnDeprecated` messages are stripped, `revert-dry-run` per RM PR, the AC-PLAT-17 canary pipelines.

## Visual evidence

None produced by this lane; it consumes `VisualClassReport` (QUAL L7 on `next`, `plat:test:visual-4x` on `release/4.x`) and links composite artifacts from visual-fix records in `change-class.json` and the release notes.

## Exit criteria

- AC-PLAT-15: the 4.1.0→4.2.0 and 4.2.0→4.3.0 `change-class.json` report <= C-D with 0 removals; install-level moves satisfy all four conditions.
- AC-PLAT-16: at `v4.3.0` `verify-breaking-register.mjs` exits 0; coverage artifact classifies 100% of root-exported REMOVE/DEPRECATE/CONSOLIDATE symbols; 0 tags without entries and 0 entries without tags.
- AC-PLAT-17: canary fails without the record and passes with it.
- AC-PLAT-18 (ledger half), AC-PLAT-19 (drill <= 15 min), AC-PLAT-23 (snapshot half).
- AC-PLAT-32: at GA `legacy/` empty and `reports/` absent; every RM PR has its record and passed revert-dry-run; RM-01 cites a published GHSA and a verified archive; dispositions `--check` exits 0.
- AC-PLAT-33 (gate records): `5.0.0-gates.md` holds the evidence for each 5.0 stop.

## Final report

```
## PROMPT_1c report (PLAT release control and removal)
PRs: <urls>  Head SHAs: <next> <release/4.x>
| Task | REQ | Status | Commit | Evidence (GitLab pipeline / artifact) |
| AC | Status | Evidence |
Change class per tag: <tag -> class, pipeline>
G-07 coverage: covered N / uncovered M (artifact URL)
Removal: RM-nn -> squash SHA, record, revert-dry-run URL
Owner actions open: archive repo, GHSA id for RM-01, rollback drill, CP-PLAT-3
Deviations / Blockers: <exact output>
```
