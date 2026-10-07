# PROMPT-16c (DX): `migrate 4to5` codemod engine and `aura-glass/compat` adapters

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16; contracts in `prd/_shared-contracts.md`: SC-02, SC-24, SC-33, SC-34, SC-40). Requirements: REQ-DX-29..42. Acceptance: AC-DX-05, AC-DX-06, AC-DX-03 (the 5/5 completion). Tasks: `docs/auraglass-5/tasks/DX.json` DX-041..DX-066. Catalogue contract: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` §11.2 (lines 449–462), §11.4 (frozen fixture), §4.6 (compat). Architecture §14.2, §14.3, §14.6, D-18. Index and crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally: `npx vitest run` over `packages/cli/src/migrate/4to5/__tests__/{runner,fixtures,catalogue-coverage,catalogue-sync,no-hardcoded-names,deprecation-coverage,todo-format,preserve,area-contract}.test.ts`, the `src/compat/__tests__` node tests, and ESLint on `packages/cli`. Run remotely (GitHub Actions `cli.yml`, hosted runners, or the `auraone-remote-run` skill): `fixtures-typecheck.test.ts` (installs the 4.3 and 5.0 tarballs), `codemod-canary.spec.ts` (`next build`, Vite build, Playwright in 3 engines), `recipes-4x.test.ts` (needs the 4.3 build), `codemod-perf.test.ts` (2,000 files), and the AuraOne consumer report. Never use local Docker. Never launch a local browser.
- Don't fake completion:
  - Never write an `output.<ext>` fixture by hand to match a buggy transform, and never write a transform that special-cases fixture content.
  - No `test.skip`/`.only`/`it.todo`. No raising the 60 s / 1.5 GB / 15 s budgets. Don't remove cases from `catalogue.json` (adding is allowed).
  - Don't hand-edit `mappings/*.json` (they are generated). No literal 4.x names in `transforms/**`.
  - Transform bugs get a fixture first, then the fix (architecture §14.6).
- Never guess. Dynamic values, computed CSS var names and unmapped values are left unchanged with the exact TODO from `todo.ts`.
- A missing prerequisite owned by another PRD means that task is BLOCKED: report it. Don't create mapping data for another PRD's components.
- Evidence is CI artifacts (D-32).

## 1. Prerequisites

1. 16a and 16b are merged (`packages/cli/src/core/git-guard.ts` and `packages/cli/src/commands/doctor.ts` exist, and `cd packages/cli && npx vitest run` is green).
2. REL generator (REL-070) and catalogue (REL-106): `node scripts/release/gen-deprecations.mjs --help` lists `--codemods` and `--compat`. If not, DX-043 and DX-065 are BLOCKED. You can still write the runner (DX-041), `catalogue.json` (DX-042) and `todo.ts` (DX-044).
3. TRUST-075/REL-010 data: `DEPRECATIONS_PATH` (repo-root `deprecations.json`, SC-02) (from `scripts/docs/paths.mjs`) validates via `scripts/release/verify-deprecations.mjs`. `CONSUMER_4X_PATH` exists, and `CONSUMER_4X_FLAGSHIP_SUBSET` (`tests/fixtures/consumer-4x/flagship-subset.json`, SC-08, REL-115) exists.
4. Flagship mapping tables: `rg --files src | rg "\.meta\.ts$"` lists the flagships whose `migration` field feeds `props.json` (anchors CTL-057, OVL-131, NAV-095, DATA-108, AI-075, MED-155). Record which of the 44 are present. Those that are missing keep `canonical-names`/`prop-grammar` incomplete, which blocks DX-146 (the 4.3 beta) until the 4.3 code freeze.
5. Tarballs: CI can pack 4.3 (`release/4.x` at the `v4.3.0` tag) and the current 5.0 alpha. Before 4.3 ships, use 4.2 for inputs and say so. That partially blocks DX-054.
6. Area transforms (SC-33 ids): `rg --files packages/cli/src/migrate/4to5/transforms | rg "ai-chat|app-shell-slots|reduced-motion-initial|motion-imports|motion-props|media-backdrops"`. If any are absent, DX-059 reports them as missing for their owners: AI (AI-115), NAV (NAV-145), MOT (MOT-001, MOT-090), MED (no task yet, PRD §21 OI-DX-10).

## 2. File scope

May create: `packages/cli/src/migrate/4to5/{index.ts,todo.ts,catalogue.json}`, `transforms/{imports-subpaths,providers,canonical-names,prop-grammar,dead-optical-props,css-vars,deps,removed}.ts`, `mappings/*.json` (generated only), `__fixtures__/<id>/<case>/{input,output}.<ext>`, `__tests__/**` (including `seeds/`), `packages/cli/src/commands/migrate.ts` (add `4to5`), `packages/cli/eslint.config.js`, `packages/cli/schema/output/migrate-report.json`, `packages/cli/test/types-4x/`, `packages/cli/test/types-5x/` (package.json + lockfile only), `scripts/docs/gen-codemod-tables.mjs`, `scripts/registry/extract-recipes-4x.mjs`, `tests/dx/{codemod-canary.spec.ts,recipes-4x.test.ts,codemod-perf.test.ts,codemod-tables.test.ts}`, `tests/dx/fixtures/{recipes-4x,large-tree,auraone-consumers}/**`, `src/compat/index.ts`, `src/compat/<area>/*.tsx`, `src/compat/__tests__/**`, `.github/workflows/cli.yml` (add jobs). Extend `packages/cli/test/{git-guard,dry-run,fs-safety}.test.ts`.
Must not touch: `scripts/release/**` (REL), the repo-root `deprecations.json` (TRUST/REL), `tests/fixtures/consumer-4x/**` (frozen; release-owner approval only), component sources under `src/components/**`, `.meta.ts` files (flagship PRDs), area transforms owned by AI, NAV, MOT and MED (only `area-contract.test.ts` checks them), `src/internal/warnDeprecated.ts` (PRD-01).

## 3. Steps

1. **DX-041, DX-058.** Write the runner with `DEFAULT_ORDER`: `imports-subpaths`, `providers`, `canonical-names`, `prop-grammar`, `dead-optical-props`, then the area transforms in registration order (`ai-chat`, `app-shell-slots`, `reduced-motion-initial`, `motion-imports`, `motion-props`, `media-backdrops`; the id catalogue and schema enum are REL's, SC-33), then `css-vars`, `deps`, `removed`. Use `registerAreaTransform(id, impl)` for area transforms. Glob with `.gitignore` respected, skipping `node_modules`, `dist`, `.next` and `build`. Use jscodeshift with `parser: 'tsx'`, postcss for CSS, and a JSON transform for `package.json`. Write the `--report` schema. An unknown id exits 2.
2. **DX-042.** Write `catalogue.json` from the §11.2 table. `catalogue-sync.test.ts` parses the markdown table, so a PRD-01 edit that adds a case fails here until you add it.
3. **DX-043.** Run `gen-deprecations.mjs --codemods`, then `gen-codemod-tables.mjs`, and commit the generated `mappings/*.json` with their `$generated` headers. Check determinism with `codemod-tables.test.ts`.
4. **DX-044.** `todo.ts`. The exact format is `// TODO(aura-glass 5): <message>, see <doc>`.
5. **DX-045..DX-052.** `prop-grammar` (DX-048) follows SC-24: 4.x Button `primary` → `prominent`, `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"`; drop `elevation` and material-selecting `intent`; emit no `material` prop; `data-ag-button-variant` → `data-ag-intent`. This mapping still needs human confirmation (PRD §21 OI-DX-01), so build it from `mappings/props.json` and never hard-code it. Work one transform plus its required fixture cases at a time (the case lists are in `catalogue.json`). Each `input`/`output` is a complete file that compiles against its `.d.ts` (DX-054). Add a `preserve-attrs` case to every JSX transform (DX-057).
6. **DX-053..DX-057, DX-059.** Write the meta-tests:
   - fixtures: byte-equality and idempotence, with area subfolders auto-discovered.
   - typecheck: remote, with `--strict`.
   - no-hardcoded-names: ESLint over `transforms/**`, plus seeded bad files.
   - deprecation-coverage: every entry with `codemod != null` is covered, and `full` entries produce 0 TODOs.
   - todo-format.
   - preserve: unchanged files keep their mtime.
   - area-contract.
7. **DX-062.** Add the `migrate 4to5` rows to `git-guard`, `dry-run` and `fs-safety`, which brings AC-DX-03 to 5/5.
8. **DX-060.** Remote canary:
   - Copy `CONSUMER_4X_PATH` to a temp dir and run the packed CLI `migrate 4to5` (≤15 s).
   - Swap in the packed 5.0 tarball.
   - Check: `tsc` exits 0, `next build` exits 0, the Vite build exits 0, and the Playwright smoke passes in Chromium, WebKit and Gecko.
   - Check: 0 TODOs in the flagship-subset files, and a second run makes 0 changes.
9. **DX-061.** Extract the 28 recipe file sets from the 4.3 build with `extract-recipes-4x.mjs`. Run the migration, review the residual TODOs, and commit `expected-todos.json`. `recipes-4x.test.ts` asserts no exceptions and the exact TODO set.
10. **DX-063.** For the AuraOne consumer snapshot, copy only the importing files and their `package.json`. Never copy `.env`, credentials or lockfile tokens. The remote report goes to an artifact, and the release owner's review is recorded in the PR.
11. **DX-064.** Write the seeded 2,000-file generator. The remote perf test asserts ≤60 s and ≤1.5 GB RSS.
12. **DX-065, DX-066.** `src/compat/index.ts` exports exactly the `gen-deprecations.mjs --compat` manifest. Each adapter maps props via the same `mappings/props.json` and calls `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (REL-072, SC-34) at call time, once per page load, in dev only. Unmappable props are dropped with a warning, and an adapter never throws. No removed component may be in compat. AI compat goes in `src/compat/ai/*.tsx`.

## 4. Tests

- Local: `cd packages/cli && npx vitest run src/migrate test/git-guard.test.ts test/dry-run.test.ts test/fs-safety.test.ts`, and `npx vitest run -c tests/dx/vitest.config.ts tests/dx/codemod-tables.test.ts`. Run the `src/compat/__tests__` suites with the repo's Jest (`npx jest src/compat`). They are DOM/node tests and don't launch a browser.
- Remote: `fixtures-typecheck.test.ts`, `codemod-canary.spec.ts`, `recipes-4x.test.ts`, `codemod-perf.test.ts`, and the AuraOne report job, all in `cli.yml`.

## 5. Visual evidence

From `codemod-canary.spec.ts`: capture consumer-4x pages before (4.x) and after (5.0 + migrate) at 1440×900 and 390×844, light and dark, in Chromium, WebKit and Gecko. Upload the screenshots, traces and `migrate-report.json` as artifacts. A human reviewer checks that the migrated pages are functionally equivalent. Pixel identity isn't expected, because B11 changes the default material.

## 6. Exit criteria

- AC-DX-06: 100% of the §11.2 required cases exist and pass byte-equality plus idempotence, and 100% of deprecations entries with `codemod != null` are covered by ≥1 fixture.
- AC-DX-05: on consumer-4x there are 0 flagship-subset TODOs, `tsc` reports 0 errors, `next build` exits 0, the smoke is green in 3 engines, and a second run makes 0 changes.
- AC-DX-03: 5/5 writing commands refuse a dirty tree.
- REQ-DX-40: the measured run is ≤60 s and ≤1.5 GB on the CI runner (runner class recorded).
- REQ-DX-41/42: the compat manifest test and the adapters test are green, and the intersection with `compat == null` entries is empty.

## 7. Final report format

```
PROMPT-16c report
PR: <url>  SHA: <sha>
Prereqs: 1 <ok> 2 <ok|blocked REL-070/REL-106> 3 <ok|missing: …> 4 <meta present n/44: list missing> 5 <4.3|4.2 used> 6 <area transforms present|missing→owner>
Tasks: DX-041 <done|blocked: reason> … DX-066
Catalogue: <cases required>/<present>; deprecation coverage <n>/<n>
Canary: TODOs(flagship)=<n>, tsc=<exit>, next build=<exit>, vite=<exit>, smoke C/W/G=<pass>, rerun changes=<n>, time <s>
recipes-4x: 28/28 terminate; residual TODOs = expected (<n>)
Perf: <s>, RSS <MB> on <runner>
Remote runs/artifacts: <urls>
AC: AC-DX-03 (5/5) <pass|fail>, AC-DX-05 <pass|fail|blocked>, AC-DX-06 <pass|fail>
Deviations / requests to owners: <list>
```
