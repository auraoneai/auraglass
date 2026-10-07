# PROMPT-4e (SURF lane W5): Platform glue — CI, gates, ledger, labs, migration skeleton, cross-cutting checks

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.4, §4.7, §5.1 (stream-wide), §5.9 (labs), §5.10 (ledger, commerce/workspace blocks), §5.11, §6, §9, §11, §20 row W5, §22. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1 §2.3, §2.4, §3.4, §4.11, §4.13 (GitLab CI), §5, §7.2.
Requirement IDs: REQ-SURF-05, -11, -12 (skeleton), -15 (index), -166..-169, -176..-187, -190, -192, -193, -195, -196 (owned); stream-wide scans for REQ-SURF-01..-14; W5 rows of -170, -188, -194.
Acceptance: AC-SURF-03, -27, -28, -31 (owned); W5 rows of AC-SURF-01, -02, -05, -11, -12, -23, -24, -25, -26, -30.
Tasks: `tasks/SURF.json` lane `W5`, SURF-524..SURF-645. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_15a..15e_EXP_*.md` (EXP-001..100 re-keyed; edits to other PRDs, `.github/workflows/*`, `package.json` scripts and `registry/registry.json` were dropped or converted to GitLab jobs and lane registrations).

## Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing):

```bash
test -f .gitlab-ci.yml && test -f ci/surf.gitlab-ci.yml && test -f src/contracts/fragments.ts && test -f src/contracts/load-fragments.mjs \
 && test -f contracts/lint-rule-owners.json && test -f eslint-plugin-auraglass.js && test -f src/contracts/testing.ts \
 && grep -q 'CI_JOBS' src/contracts/testing.ts && test -f docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md
```

Seams consumed: S-35 (`ENTRIES`, `ROOT_EXPORTS.surf`, export enumeration for the budget), S-36 (`@auraglass/labs`, fallback `aura-glass-labs` per `contracts/packages.json`), S-37, S-38/S-39 (deprecation and codemod schemas), S-40..S-43 (helpers, lanes, scenes, job names `CI_JOBS`, `REQUIRED_JOBS`), S-44/S-45/S-50 (fragment schemas and loader), S-46 (block/item ids), S-47 (lint rule owners: `no-simulation`, `no-network-in-ai` = SURF), S-48 (evidence paths), S-49, S-52 (`api:update`, `test`, `typecheck`), S-53 (root `.gitlab-ci.yml` stages, templates `.ag-node`, `.ag-playwright`, `.ag-gpu`, `.ag-aws-remote`, `AG_SCOPE`/`AG_LINE`), S-54 (labs publish through `plat:publish:npm` with GitLab OIDC `id_tokens` and provenance), S-55 (`SubjectIndex` for story ids). No intra-stream interface is consumed; **you publish I-2** (aggregate skeleton) by applying it in your day-0 PRs, but no lane waits for that — any lane may apply it identically.

## May touch (lane W5 exclusive)

`ci/surf.gitlab-ci.yml` (skeleton, `.surf-*` templates, `surf:test:ledger`, `surf:test:doubles`; other lanes add their own jobs in their blocks); `scripts/surf/{verify-surf-purity,verify-capability-ledger,verify-labs-admission}.mjs` (framework + W5 rules; W3/W4 own their rule-set blocks); `lint/rules/surf/{no-simulation.cjs,_strict.cjs (W5 section)}`; `tests/lint/surf/{no-simulation,restricted-imports}.test.ts` and `tests/lint/surf/fixtures/**`; `docs/auraglass-5/capability-ledger.json`, `capability-ledger.schema.json`; `tests/capability/**` except `tests/capability/registry/{app-frame,mobile-settings,app-shell-workspace,data-*,support-inbox,analytics-dashboard,audit-log,permissions-matrix,ai-*,media-*}.test.*` (those belong to W1–W4); `packages/labs/**`; `tests/labs/**`; `tests/perf/browser/surf/{registry-blocks,labs-spatial-admission}.spec.ts`; `tests/e2e/surf/{rtl,target-size,focus}.spec.ts`, `tests/e2e/surf/motion/idle.spec.ts`; `tests/types/surf/prop-grammar.test-d.ts`; `tests/rsc/surf/directives.test.ts`; `tests/a11y/manual/scripts/surf/README.md`; `tests/fixtures/consumer-4x/cases/surf/{README.md,ai/**}`; `stories/surf/**`; `apps/docs/content/surf/**` except `ai-prism-routing.md` (W3); `registry/blocks/{commerce-cart,commerce-checkout,pricing}/**`; `registry/items/{presence-stack,comment-thread}/**`; `etc/api/{root.surf,compat.surf}.api.md`; `.changeset/surf-*.md`; `fragments/{a11y-baseline,literals-baseline}/surf.json`.
Shared (own `lane W5` block only): `fragments/{deprecations,lanes,review,side-effects,size-budgets,perf-budgets,css,codemods}/surf.ts`, `src/compat/surf/index.ts`, `src/root/surf.ts` (structure only — W5 adds no names).

## Must not touch

Other lanes' component, test, block and item paths; the root `.gitlab-ci.yml`, `.github/**` (including the org-managed `mirror-to-gitlab.yml` — OD-8 is the user's decision), `package.json` (no `verify:capability` script: the ledger runs as `node scripts/surf/verify-capability-ledger.mjs` from `surf:test:ledger`), `eslint.config.js`, `eslint-plugin-auraglass.js` (verbatim, registers SURF rules by name), `registry/registry.json`, `scripts/registry/**`, `scripts/release/**`, `packages/cli/**`, other PRDs' files.

## Steps

1. **Day 0 — CI fragment** (REQ-SURF-195): full `ci/surf.gitlab-ci.yml` per contract §4.13.4 with the I-2 YAML lane blocks: `.surf-base` (extends `.ag-node`), `.surf-playwright` (extends `.ag-playwright`; `mcr.microsoft.com/playwright` from root `AG_PLAYWRIGHT_IMAGE`); `surf:test:ledger` (stage `test`, rules `$AG_LINE == "5x"` and `$AG_SCOPE` in `pr|main|release`, script `node scripts/surf/verify-capability-ledger.mjs && node scripts/surf/verify-capability-ledger.mjs --diff "$(git merge-base HEAD origin/next)"`); `surf:test:doubles` (`parallel:matrix` over the four `tests/<area>/jest.doubles.cjs` presets — a missing preset makes that cell report `pending`, it never fails the job); artifacts `name: "evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA"`, `paths: [.artifacts/surf/]`, `expire_in: 14 days`; `allow_failure: true` until the first green run on `next`. No job runs on `merge_request_event`; no credential variable. `tests/capability/ci-fragment.test.ts` enforces naming, templates, rules, artifact paths, no token-like variables and no `.github/workflows/` path in SURF diffs.
2. **Day 0 — lint and purity** (REQ-SURF-05, -11): `auraglass/no-simulation` (`Math.random` outside event-handler props, timers setting literal progress, `new Blob([` with a string literal, default props holding ≥3 object literals) over every SURF path and `packages/labs/src/**`; `_strict.cjs` W5 section (prop-grammar error for SURF globs, `no-forward-ref`, restricted imports for blocks/labs, `three` only in `src/three/**`); `scripts/surf/verify-surf-purity.mjs` framework (AST walk, file:line output, timer allowlist: ProviderErrorState retry countdown, StreamingText sentence flush, StatusBar.Live and Command announcement debounce) with W3/W4 rule blocks left to those lanes; registered as an L1 `node-script` lane; `tests/capability/purity-gate.test.ts` framework.
3. **Day 0 — skeletons** (REQ-SURF-12, -194): apply I-2 to every aggregate; on `release/4.x` (branch `4x-surf/skeleton`) create the `fragments/deprecations/surf.ts` skeleton with the per-lane id ranges (W5 range DEP-S0800..0999 covers subpaths `./workspace`, `./workflows`, commerce/presence/comment 4.x names: `PricingCard`, `GlassCommentThread`, `GlassSmartShoppingCart` family, `GlassTeamCursors`, all `since: '4.2.0'`); baselines `fragments/{a11y-baseline,literals-baseline}/surf.json` empty.
4. **Capability ledger** (REQ-SURF-179..187): `capability-ledger.schema.json` (JSON Schema 2020-12, dependency-free checker), `capability-ledger.json` with the archived 58 rows X-01..X-58 and 13 rejected X-R01..X-R13 carried verbatim except `owner` ∈ `PLAT|MAT|CMP|SURF|QUAL`; `verify-capability-ledger.mjs` failure modes (missing/array/unknown owner, owner in collaborators, duplicate id, `false` rubric on a non-rejected row, bad evidence line, undefined finding, re-admitted rejected name with `X-Rnn rejected: <reason>`), `--report md`, `--report release-notes --version <v>` (each row with a CI artifact URL), `--diff <base-sha>`; export budget (root ≤160, total ≤250, ≥1 root and ≥4 subpath slots free at GA, promotion needs ≥10 demand links); delivery check on the packed tarball (L2); `reqRefs` resolve in the owning PRD file; no alias exports; roadmap story `stories/surf/capability/CapabilityRoadmap.stories.tsx`.
5. **Labs** (REQ-SURF-166..169): `packages/labs/` workspace (`sideEffects: false`, peers `aura-glass ^5.0.0`, `react`/`react-dom ^19.0.0`, one export per resident + `./package.json`, no `bin`); admission gate (ledger row, `no-simulation` 0, public imports only, side-effect-free Node import, loops pause on `visibilitychange`/offscreen and render a static frame under reduced motion/transparency) as an L1 lane with scopes `pr` and `release` so a red run fails the tag pipeline whose `plat:publish:npm` job publishes labs; spatial admission perf spec on the remote mid-tier profile; promotion rules.
6. **Cross-cutting gates** (REQ-SURF-07, -10, -11, -190, -192, -193): `tests/rsc/surf/directives.test.ts`, `tests/types/surf/prop-grammar.test-d.ts`, remote `tests/e2e/surf/{rtl,target-size,focus}.spec.ts` and `tests/e2e/surf/motion/idle.spec.ts` over every SURF subject from `listSubjects` (subjects not yet merged are simply absent; nothing is hard-coded).
7. **Commerce and workspace blocks (5.1/5.2)** (REQ-SURF-176, -177): `commerce-cart`, `commerce-checkout`, `pricing`, `presence-stack`, `comment-thread` with deterministic fixtures, six story states, `registry-only` test (no commerce/workspace name in the tarball `dist/`), block perf spec (≥50 fps median mid-mobile, 0 long tasks >200 ms).
8. **Migration glue and docs** (REQ-SURF-13, -15, -196): `src/compat/surf/index.ts` structure, `etc/api/{root.surf,compat.surf}.api.md` via `npm run api:update`, `cases/surf/README.md` + `ai/` case, `tests/capability/deliverables.test.ts` (24 flagships × §11.3 deliverables), migration guides `apps/docs/content/surf/migration/{app-shell,data-table,date,charts,ai,media}.md` from the lanes' codemod tables, chart adapter guide, rejected-novelty page, one `.changeset/surf-*.md` per SURF PR.
9. **Blocking flip** (AC-SURF-31): after each SURF job's first green run on `next`, flip `allow_failure: false` in the owning lane's block (W5 flips its own; reminds other lanes in the report). By GA every SURF job is blocking.

## Tests

Jest (local OK): `tests/capability/{ledger-schema,verify-ledger,delivery,report,export-budget,req-refs,no-alias-exports,no-rejected,rejected-absent,registry-only,no-spatial-core,no-network,purity-gate,contract-tests,ci-fragment,deliverables}.test.ts` with fixtures `tests/capability/fixtures/{dup-owner,missing-evidence,bad-line,rubric-false,unknown-finding,rejected-readd}.json` (each exits 1 naming the row) and "export added without row", "promotion without demand"; `tests/capability/registry/{blocks-lint,commerce-cart,commerce-checkout,pricing,presence-stack,comment-thread}.test.tsx` (schema vendored as `tests/capability/registry/__fixtures__/registry-item.schema.json`, JPY 0 decimals, `de-DE` EUR, same id → same colour, `jest.getTimerCount() === 0`, IME-safe submit); `tests/labs/{package,admission,promotion}.test.ts` with fixtures `tests/labs/fixtures/{math-random,deep-import,side-effect,no-pause}/`; `tests/lint/surf/{no-simulation,restricted-imports}.test.ts`; `tests/rsc/surf/directives.test.ts`; `npm run typecheck` for `prop-grammar.test-d.ts`.
Remote: `tests/e2e/surf/{rtl,target-size,focus}.spec.ts`, `tests/e2e/surf/motion/idle.spec.ts`, `tests/perf/browser/surf/{registry-blocks,labs-spatial-admission}.spec.ts`. GitLab: `contract:ci-fragments` green on every W5 push.

## Visual evidence

Remote captures of the `CapabilityRoadmap` story and every commerce/presence/comment block at 390/768/1024/1440/1920 × 8 scenes as CI artifacts; L14 items in the W5 block of `fragments/review/surf.ts`. Nothing committed.

## Prohibited

Index list, plus: any `.github/workflows/*` file or edit; a credential in any CI variable or file; `CI_MERGE_REQUEST_*` logic (the mirror has no MRs); editing another stream's PRD, script or registry index; ledger rows dropped silently (undelivered rows become `deferred` with a 5.1 slot by owner decision); lowering export budgets or admission thresholds; publishing labs from anywhere but PLAT's GitLab tag job.

## Exit criteria

- AC-SURF-03: `verify-surf-purity.mjs`, `no-simulation`, `no-network-in-ai` report 0 violations; side-effect gate 0 for every SURF entry; 0 `@ag-contract-seed` markers in SURF `src/**` (G-02).
- AC-SURF-27: ledger has 58 + 13 rows; `node scripts/surf/verify-capability-ledger.mjs` exits 0 on `next`; each of the 6 negative fixtures exits 1 naming the row; at `5.0.0-rc.1` every 5.0 P0/P1 row `delivered`; at GA root ≤160, total ≤250, ledger = manifest, ≥1 root and ≥4 subpath slots free; 0 REQ-SURF-185 alias names exported.
- AC-SURF-28: `packages/labs` matches REQ-SURF-166; admission gate exits 1 on each of 4 negative fixtures and 0 on the real package; no labs version publishes from a tag pipeline whose admission lane is not `pass`.
- AC-SURF-31: `ci/surf.gitlab-ci.yml` passes `contract:ci-fragments`; every SURF job `allow_failure: false` by GA; no SURF commit adds a file under `.github/workflows/` (G-16).
- W5 rows of AC-SURF-01 (root SURF report), -02, -05 (idle), -11 (RTL), -12 (targets/focus), -23 (block bytes), -24 (deprecation skeleton shipped on `release/4.x`, cases index), -25 (deliverables check), -26 (commerce/workspace blocks, blocks-lint), -30 (5.1/5.2 blocks).
- SURF-524..645 `DONE` or `BLOCKED`; `npm test`, `npm run typecheck` green; merge-SHA pipeline `success`.

## Final report format

```
PROMPT-4e SURF/W5 REPORT
Branches/PRs (next-surf/w5-*, 4x-surf/*)   Merge SHAs   GitLab pipelines: <URLs>
CI fragment: contract:ci-fragments <pass/fail>; SURF jobs and allow_failure state: <job: true|false>
Tasks SURF-524..645: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending   (05, 11, 12, 15, 166..169, 176..187, 190, 192, 193, 195, 196 and W5 shares)
AC-SURF-03/-27/-28/-31 (+ W5 rows): PASS | FAIL | PENDING + artifact
Ledger: rows, delivered/planned/deferred counts, export budget numbers (root, total)
OD-8 (mirror Action → GitLab pull mirroring): recorded for the owner, untouched
Files changed; deviations with evidence
```
