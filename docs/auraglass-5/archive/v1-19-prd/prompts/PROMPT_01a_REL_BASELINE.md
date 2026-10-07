# PROMPT-01a (REL): API baselines, tarball export snapshots, deprecations schema, task-graph validator

You are working in `/Users/gurbakshchahal/platforms/AuraGlass` (`aura-glass`, 4.1.x). Source PRD: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (key REL, alias PRD-01) §4.2, §4.3, §5.1, §5.2 (REQ-REL-05/06 only), §5.9, §12, §20 steps 1–3, §21. Binding registry: `docs/auraglass-5/prd/_shared-contracts.md` (SC-02, SC-03, SC-04, SC-06, SC-11, SC-40 win over any text here). Requirements: **REQ-REL-01, 02, 03, 04, 05, 06, 42**. Acceptance: **AC-REL-01**, **AC-REL-21**, plus the 01a share of AC-REL-04. Tasks: `docs/auraglass-5/tasks/REL.json` REL-001..REL-018, REL-140, REL-141. Branch: `rel/baseline` → PR to `main`.

## Common rules

- Remote-first. Don't run Docker, Playwright/Chromium, Storybook builds, `npm run build`, `npm pack` of the full library, temp-project installs of a tarball, or the full `npx jest --ci` on the Mac. Run them in this public repo's GitHub Actions (hosted runners; see `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) on your PR, or on an ephemeral EC2 worker through the `auraone-remote-run` skill. Locally you may run only single Jest files whose fixtures are tiny and in-repo (`npx jest tests/release/<file> --runInBand`) and `node --check`.
- No fake completion. No mock or placeholder implementations standing in for real logic, no `test.skip`/`.only`/`xit`/`describe.skip`, no lowered thresholds, no `-u`/`--update-snapshots` or regenerated baselines just to get to green, and no editing a committed report to match broken output. Mocks are allowed only where the PRD names them (`npm view`, `gh api`).
- Don't commit evidence (D-32). Evidence is CI artifacts keyed to the SHA.
- Don't change `package.json` `dependencies`, `peerDependencies` or `exports` (REQ-TRUST-52 until 4.2). The only `devDependencies` you may add are the exact-pinned ones named here.
- Jest tests for Node scripts start with the docblock `/** @jest-environment node */`, because `jest.config.js` defaults to `jsdom`.
- Paths are fixed by the registry; there is no path-discovery file. API dir `etc/api/` (root slug `index`), scripts `scripts/release/{api-report,export-snapshot}.mjs` (never `scripts/api/`), repo-root `deprecations.json` at `version: 1` (never `docs/deprecations.json`, no `schemaVersion: 0`, no migration script), publish workflow `.github/workflows/publish-npm.yml`, pack helper `scripts/ci/lib/npm-pack.js`.

## May touch / must not touch

May touch: `scripts/release/lib/paths.mjs` (NEW), `docs/release/exception-allowlist.json` (NEW), `docs/schemas/deprecations.schema.json` (NEW), `scripts/release/verify-deprecations.mjs` (NEW), `scripts/release/verify-task-graph.mjs` (NEW), `scripts/release/api-report.mjs` and `scripts/release/export-snapshot.mjs` (MODIFY; created by TRUST-071/072), root `deprecations.json` (only the REL-012 conditional fix, with TRUST review), `etc/api/` (only regenerated baselines per REQ-REL-04), `api-extractor.base.json` (MODIFY), `package.json` (`devDependencies.ajv`, scripts `deprecations:check`, `api:check`, `api:snapshot`), `tests/release/` (extend TRUST-074/076 files; NEW files for the rest), `tests/release/fixtures/` (NEW), `.github/workflows/api-baseline.yml` (NEW, remote job).

Must not touch: `src/**`, `.github/workflows/publish-npm.yml`, `glass-pipeline.yml`, `CHANGELOG.md`, `README.md`, `tests/ci/**` (TRUST), `scripts/docs/paths.mjs` (DX-019; import it only), and anything under `docs/auraglass-5/` except reading it.

## Prerequisites (verify; stop with a blocker report if any fails)

1. TRUST-071 and TRUST-072 merged (`PROMPT_00g_TRUST_RELEASE.md`): `scripts/release/api-report.mjs`, `scripts/release/export-snapshot.mjs` and `api-extractor.base.json` exist on `main`, and `etc/api/manifest.json` exists. Either `git tag -l v4.1.1` is non-empty or `git log main --oneline -- scripts/release/api-report.mjs` shows a commit.
2. TRUST-075 merged: root `deprecations.json` exists with `"version": 1` and a `$schema` of `./docs/schemas/deprecations.schema.json`; `docs/deprecations.json` does not exist. If TRUST shipped another path or envelope, stop and report it against SC-02 (do not migrate it here).
3. TRUST-002 merged (`PROMPT_00a_TRUST_PACK.md`): `scripts/ci/lib/npm-pack.js` exists.
4. DX-019 merged (`PROMPT_16a_DX_CLI_CORE.md` or the DX prompt that owns it): `scripts/docs/paths.mjs` exports `DEPRECATIONS_PATH`. If it is not merged yet, REL-001 may define a local fallback constant `deprecations.json` with a `TODO(REL-001): import from scripts/docs/paths.mjs` comment, and the report lists this as a blocker to close.
5. `node -p "require('./package.json').devDependencies['@microsoft/api-extractor']"` prints an exact version (no `^`/`~`).
6. `npm view aura-glass@4.1.1 version` prints `4.1.1`. If not, REQ-REL-04 regeneration runs against the 4.1.1 candidate tarball and is re-run after publish. Record this.

## Steps

1. **REL-001** Create `scripts/release/lib/paths.mjs` exporting `API_DIR = "etc/api"`, `ROOT_SLUG = "index"`, `API_MANIFEST = "etc/api/manifest.json"`, `PUBLISH_WORKFLOW = ".github/workflows/publish-npm.yml"`, `SCHEMA_PATH = "docs/schemas/deprecations.schema.json"`, `DEPRECATIONS_PATH` (re-exported from `scripts/docs/paths.mjs`) and `entrySlug(key)` (`.` → `index`, `./data` → `data`, `./primitives/slot` → `primitives-slot`, `./services/ai/config` → `services-ai-config`). Every script in this PRD imports it; none hard-codes these literals.
2. **REL-002** Add `ajv` as an exact-pinned devDependency (`npm view ajv version`, then pin at least 8.20.0 exactly), plus `ajv-formats` if the schema uses `format`. Update the lockfile in the same commit.
3. **REL-003 / REL-004 (REQ-REL-01/02)** Extend TRUST-071's `api-report.mjs` to the full contract. The entry list is `package.json` `exports` keys with a `types` condition (40 at `15b6de6f7`; assert the count from the file, never hard-code it). Write `etc/api/<slug>.api.md` and upsert `etc/api/manifest.json` `{ entries: [{ key, slug, types, apiReport: "ok" | "unanalysable", error? , exports: "<slug>.exports.json" }] }`. Add `--check` (exit 1 on any diff, printing the differing slugs) and `--mode 4x|5x`. Default is `4x` when `version` starts with `4.`. In 4x mode, copy the `.d.ts` tree to a temp dir and rewrite `@/…` specifiers through `tsconfig.json` `compilerOptions.paths`. An entry that still fails becomes `unanalysable` with the API Extractor message. In 5x mode, `unanalysable` exits 1.
4. **REL-005 / REL-006 (REQ-REL-03)** Extend TRUST-072's `scripts/release/export-snapshot.mjs`; don't add a second script. Add `--tarball <file>`. The script installs the tarball into `os.tmpdir()/ag-snap-<hash>` with `npm init -y && npm i <file> --ignore-scripts --no-audit --no-fund` (Node ≥20.19). For each of the 47 `exports` keys it writes `etc/api/<slug>.exports.json` `{ key, kind: "code" | "asset", runtime: [...sorted], require: [...sorted] | null, types: [...sorted] | null, typesRuntimeMismatch, file? }`. `runtime` comes from `await import(spec)` with jsdom globals installed, as in PRD-00. `require` is filled only when the key has a `require` condition (35 keys, E-20). `types` comes from the TypeScript compiler API over the entry's `types` file. Output is sorted and has stable key order, so two runs are byte-identical. `--tarball` also accepts the output of `npm pack aura-glass@<published>`. Add `--out <dir>` so a published-version snapshot can go to a temp dir instead of `etc/api/`. Pack only through `scripts/ci/lib/npm-pack.js` (TRUST-002, SC-06).
5. **REL-007 (REQ-REL-04)** In `.github/workflows/api-baseline.yml` (NEW; `workflow_dispatch` plus a `pull_request` path filter on `scripts/release/**`, `etc/api/**`), run `api-report.mjs --check` and `export-snapshot --tarball` on a remote runner and upload the reports as artifacts. If the TRUST baseline is missing `require` names, `manifest.json`, or any of the 47 `exports.json` files, regenerate it with `--tarball "$(npm pack aura-glass@4.1.1)"` in that job and commit the job's output in this PR. Diff before/after and list every changed file in the PR body. Never hand-edit.
6. **REL-010 (REQ-REL-05; SC-02/SC-03/SC-33)** `docs/schemas/deprecations.schema.json`, JSON Schema 2020-12, exactly PRD §4.3. Envelope `{ $schema, version: 1, entries }` (no `schemaVersion`):
   - `kind` enum of 13 (`export subpath prop prop-value css-var css-global peer dependency engine behavior cli data-attr asset`)
   - `status` `active | planned`
   - `id` `^DEP-\d{4}$`
   - `since` semver pattern
   - `removeIn` `5.0.0 | 6.0.0`
   - `codemod` enum of the 14 §11.2 ids or null: core `imports-subpaths canonical-names prop-grammar dead-optical-props providers css-vars deps removed`; area `ai-chat app-shell-slots reduced-motion-initial motion-imports motion-props media-backdrops`
   - `automation` `full | mostly | partial | manual | none`
   - `breaking` items `^B\d+$`
   - `exception` `security | privacy | crash | legal | honesty | null` (`honesty` = retracted or simulated claims: ContrastGuard, `validateTextContrast`, `data-meets-wcag`)
   - `message` `maxLength: 200`
   - `doc` `format: uri` with pattern `#dep-\d{4}$`

   Cross-field rules that JSON Schema can't express (unique id, `removeIn > since`, message names `replacement.symbol`) live in `verify-deprecations.mjs`.
7. **REL-011 / REL-012 (seed check; replaces the dropped v0 migration)** Run `verify-deprecations.mjs` on the TRUST-075 seed exactly as committed. It must pass unchanged: `version: 1`, `$schema` set, every §13.1 cut entry valid, ContrastGuard/`validateTextContrast` entries with `exception: "honesty"`. Write no converter script. If it fails, report the exact entries to TRUST for a TRUST-075 fix; only if TRUST has not fixed it before 4.2 does REL-012 correct the file in place (same ids, same count) in a PR with TRUST review.
8. **REL-013 (REQ-REL-06)** `verify-deprecations.mjs [--file] [--fixtures-root <dir>] [--api-dir]` (defaults from `lib/paths.mjs`; fixtures root `packages/cli/src/migrate/4to5/__fixtures__`). It validates with ajv, then fails on each REQ-REL-06 rule:
   - duplicate id
   - `active` with `since` > `package.json` version
   - `planned` with `since` ≤ version
   - `removeIn ≤ since`
   - `codemod` with no `<fixtures-root>/<codemod>/` directory
   - `kind: export` whose `symbol` is missing from the `since` version's `<slug>.exports.json`. Read it from `git show v<since>:etc/api/<slug>.exports.json`, falling back to the working tree when `since` equals the current version.

   Exit codes: 0 OK, 1 rule failure, 2 usage error. **REL-014**: add the `deprecations:check` and `api:snapshot` scripts and confirm `api:check` → `api-report.mjs --check`. **REL-017**: `api-baseline.yml` also runs `npx jest tests/release --ci` and `npm run deprecations:check` on PRs touching `scripts/release/**`, `tests/release/**`, `deprecations.json` or `etc/api/**`.
9. **REL-018** `docs/release/exception-allowlist.json` `{ version: 1, entries: [{ id, symbol, exception, section: "§13.1", evidence }] }`, generated from every entry in `deprecations.json` with a non-null `exception` (including `honesty`). It needs a release-owner review on the PR.
10. **REL-140 (REQ-REL-42; SC-40)** `scripts/release/verify-task-graph.mjs [--report]` reads every `docs/auraglass-5/tasks/*.json` and fails when: a file is not a JSON array; a task lacks any of `id, prd, system, file, action, description, depends_on, priority, test, storybook, acceptance, status`; an id is duplicated or does not match `^(TRUST|REL|PKG|DS|MAT|A11Y|MOT|PERF|FND|CTL|OVL|NAV|DATA|AI|MED|EXP|DX|SB|QA)-\d{3}$`; a `depends_on` entry is not an existing id (so `PRD-xx` strings fail; external gates belong in the optional `gate` field); the graph has a cycle; or one file path has more than one CREATE across fragments. It prints per-fragment counts. `--report` prints and exits 0 (used until every fragment is clean; 01c's REL-142 wires it into `change-class.yml`).

## Tests (write them, then run remotely in the PR's CI)

- `tests/release/api-report.test.ts` (REL-008): unchanged fixture → `--check` exit 0; added export → non-empty diff; removed export → non-empty diff with the slug named; `@/` alias fixture `.d.ts` → `unanalysable` in 4x mode, exit 1 in 5x mode. Fixtures go in `tests/release/fixtures/api-report/`.
- `tests/release/export-snapshot.test.ts` (REL-009; **extend** TRUST-074's file, no second file): fixture package `tests/release/fixtures/facade-pkg/` whose `./data` `types` points at a narrow `.d.ts` while its `import` resolves to the root `index.mjs` → `typesRuntimeMismatch: true`; two runs byte-identical (`Buffer.compare === 0`). Remote only, because it packs and installs.
- `tests/release/deprecations-schema.test.ts` (REL-015): rejects duplicate id, `DEP-42`, `removeIn ≤ since`, unknown kind, unknown codemod, a 201-char message, and a replacement not named in the message; accepts the PRD §4.3 example verbatim, `exception: "honesty"` and each of the 14 codemod ids.
- `tests/release/deprecations-seed.test.ts` (REL-016; **extend** TRUST-076's file): the root file has `$schema` and `version: 1`, no `schemaVersion`, every entry passes the schema unchanged, ContrastGuard/`validateTextContrast` use `honesty`; `scripts/release/migrate-deprecations-v0.mjs` and `docs/deprecations.json` do not exist. Also an `active` entry with a future `since` → fail, a `planned` one → pass.
- `tests/release/task-graph.test.ts` (REL-141): fixture fragments with a `PRD-08` `depends_on` string, a missing id, a duplicate id, a missing field, a 2-task cycle and two CREATE tasks on one file each fail; a clean fixture passes.

Run: `npx jest tests/release --ci` in GitHub Actions. This prompt has no UI surface, so its evidence is the `api-baseline.yml` artifact (`manifest.json`, the 47 `exports.json` files, `--check` log) and the `verify-task-graph.mjs --report` output.

## Exit criteria

- AC-REL-01: `etc/api/manifest.json` lists all 47 4.1.x keys, each with an `.exports.json`, and `npm run api:check` exits 0 on `v4.1.1`, or on `main` HEAD if it isn't tagged yet (then re-check after the tag).
- AC-REL-04 (01a share): the five test files above pass in CI on `main`.
- `npm run deprecations:check` exits 0 on `main` on the unchanged TRUST-075 seed.
- AC-REL-21 (01a share): `verify-task-graph.mjs` runs; REL's own fragment reports 0 invalid entries. Other fragments' counts are reported, not fixed here.

## Final report (return in this shape)

```
PROMPT-01a REL report
SHA / PR: <sha> / <url>
Paths: lib/paths.mjs constants match SC-02/04/05 (yes|no: <diff>); DEPRECATIONS_PATH source: scripts/docs/paths.mjs|fallback
Entries: typed=<n>/47 analysable=<n> unanalysable=<slugs>
Snapshots: <n>/47, typesRuntimeMismatch=<slugs>
Deprecations seed: entries=<n> version=1 schema-valid=<bool>; honesty entries=<ids>; verify exit=<code>
Task graph: per-fragment invalid depends_on/dup/cycle/double-CREATE counts
Tests: <file → pass/fail, CI run URL>
AC-REL-01: met|blocked (<evidence URL>)
Blockers / owner actions: <list>
```
