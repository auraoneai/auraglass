# PROMPT-15a (EXP): Capability ledger, schema and gate script

Source PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` (Key **EXP**, self-id PRD-15, ledger owner `PRD-EXP`). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-01 crosswalk, SC-29 lanes, SC-40 task ids). Requirements: **REQ-EXP-01, -02, -04, -05, -06, -20, -29 (ledger mapping), -35 (generator), -36**. Acceptance: **AC-EXP-01, AC-EXP-02, AC-EXP-07 (refs half), AC-EXP-15 (generator half)**. Tasks: `docs/auraglass-5/tasks/EXP.json` EXP-001..EXP-024. Index: `docs/auraglass-5/prompts/PROMPT_15_EXP.md`.

## 1. Context

Repo `/Users/gurbakshchahal/platforms/AuraGlass`, `aura-glass` 4.1.0, HEAD `15b6de6f7`. Branch `exp/15a-ledger` from `main`. Jest 29 with ts-jest (`jest.config.js`, `testMatch` `**/*.{spec,test}.{ts,tsx}`, `/docs/` ignored, so fixtures must live under `tests/`). There is no `ajv` in `package.json` and none may be added (REQ-EXP-01).

## 2. Files you may touch

- NEW `docs/auraglass-5/capability-ledger.schema.json`, NEW `docs/auraglass-5/capability-ledger.json`
- NEW `scripts/ci/verify-capability-ledger.mjs`
- NEW `tests/capability/{ledger-schema,verify-ledger,req-refs,report}.test.ts`, NEW `tests/capability/fixtures/*.json`, NEW `tests/capability/__snapshots__/report.test.ts.snap` (created by the first run only)
- MODIFY `package.json` (only the `scripts` key: add `verify:capability`)
- MODIFY `.github/workflows/certify-pr.yml` (QA owns the file, QA-031; add only the L1 Static ledger steps — no separate capability workflow, SC-29)
- MODIFY `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md`: only to wrap the §4.2 "Totals:" paragraph in `<!-- capability-ledger:totals:start -->` / `<!-- capability-ledger:totals:end -->` and replace it with the generated text.

Must not touch: anything under `src/`, `eslint*.js`, `.storybook/`, `registry/`, other PRD files, `build/`, any workflow other than the certify-pr.yml steps above.

## 3. Prerequisites

Wave 1. Hard prerequisite only for EXP-023: QA-031 (`.github/workflows/certify-pr.yml`, PROMPT for QA). If it is not merged, run the same commands on a remote runner and report EXP-023 as blocked on QA-031; do not create a parallel workflow. Verify the inputs exist: `rg --files docs/auraglass-5/prd | rg -c "PRD.md$"` ≥ 19, and `rg -n "^- \*\*REQ-DATA-68" docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` returns one line. If an owner REQ cited in REQ-EXP-20/-29 is missing from its file, record it in the report; do not invent it.

## 4. Steps

1. **EXP-001 schema.** Write JSON Schema 2020-12 for `CapabilityRow` exactly as PRD §4.7, plus the three optional fields PRD §4.7 now lists (`artifacts`, `demand`, `stories`). Top level: `{ "$schema", "version": "1", "rows": CapabilityRow[] }`. Use only `type`, `enum`, `pattern`, `required`, `items`, `properties`, `additionalProperties: false`. Patterns: `id` `^X-(R)?[0-9]{2}$`, `owner` `^(PRD-[0-9]{2}|PRD-EXP)$`, `evidence` items `^(research/competitors\.md:[0-9]+|exception:.+)$`, `reqRefs` items `^REQ-[A-Z0-9]+-[0-9]+$`.
2. **EXP-002..EXP-006 rows X-01..X-58.** Transcribe every column of PRD §4.2 one row at a time. `owner` = the first PRD shown, the second goes to `collaborators` (deviation 6). "this PRD" = `PRD-EXP`. `form` from the Form column (E→`export`, P→`part` or `prop` as named, RI→`registry-item`, RB→`registry-block`, L→`labs`). `release` from Rel (X-26 = `"5.0"` with the 5.1 inline edit noted in `capability`; X-55 = `"5.0"` with wave 2 noted). `evidence`: every `research/competitors.md` citation the PRD gives (open the file and pin a line number that contains the claim); rows whose justification says "exception" get `exception:<the PRD's reason>`. `findings`: E-ids from the row, plus autopsy ids in §2. `reqRefs`: owner REQ ids (X-12 REQ-CTL-128/129, X-15 REQ-DATA-68, X-17 REQ-FND-32, X-18 REQ-FND-33, X-21 REQ-OVL-40, X-24 REQ-DATA-10/14, X-25 REQ-DATA-10/15, X-26 REQ-DATA-10/13, X-28 REQ-DATA-72, X-35/X-36 REQ-AI-41, X-37..X-43 per REQ-EXP-29 (X-42 and X-43 release `"5.1"`, X-43 REQ-MED-95); the 5 open gap rows of REQ-EXP-21 (X-07, X-16, X-19, X-25, X-26) point at REQ-EXP-22/-23/-26/-27/-28; X-57/X-58 owner `PRD-21` (interim this PRD, SC-37) cite REQ-EXP-31, REQ-EXP-38). `rubric` all `true` for non-rejected rows. `exportDelta` = the number of **value** names in the row's `names` that the row delivers as exports, split by `subpath` (root if no subpath): e.g. X-04 `{root:1,subpath:0}`, X-15 `{root:0,subpath:1}`, X-31 (`Thread`, `Message`, `StreamingText` in `./ai`) `{root:0,subpath:3}`, any `part`/`prop`/registry/labs/rejected row `{root:0,subpath:0}`. Take the names from the owner lists PRD §4.3 cites (`AURAGLASS_AI_PRD.md` REQ-AI-02, `AURAGLASS_DATA_PRD.md:108-109`, `AURAGLASS_MEDIA_BACKDROPS_PRD.md` REQ-MED-01, `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md:129`, `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.5); do not guess a count, write the names. 15b reconciles these against the packed manifest. `status`: `planned` (5.1/5.2), `planned` for 5.0 until owners deliver, `deferred` never at this stage.
3. **EXP-007 rejected rows X-R01..X-R13.** From PRD §4.4 and §9: `form: ["rejected"]`, `release: "never"`, `status: "rejected"`, `rubric` with the failing rules `false`, `names` = every 4.x symbol in §9 plus family keywords (`Quantum`, `Consciousness`, `Biometric`, `EyeTracking`, `Gaze`, `Hologram`, `Vortex`, `Fractal`, `Orbital`, `Tessellation`, `Houdini`, `elevation`, …), `capability` = the reason column.
4. **EXP-008 script core.** `scripts/ci/verify-capability-ledger.mjs`, Node ≥20 ESM, no dependencies. Loads ledger + schema, runs an embedded checker for exactly the keywords in step 1, prints `X-nn: <message>` to stderr per failure, exit 1 on any failure. Flags: `--ledger <path>` (default the docs path), `--prd-dir <path>` (default `docs/auraglass-5/prd`).
5. **EXP-009 REQ-EXP-02 checks.** owner missing/array/bad pattern; owner repeated in `collaborators`; duplicate `id`; non-rejected row with any `rubric` false; `evidence` line must exist (read `docs/auraglass-5/research/competitors.md`, line count) or be `exception:` non-empty; every `findings` E-id must be defined in the expansion PRD (parse `| E-NN |` cells from §2).
6. **EXP-010 REQ-EXP-20 refs.** Built-in crosswalk owner → file from the PRD header table (SC-01): PRD-04 MATERIAL_ENGINE, PRD-05 ACCESSIBILITY, PRD-07/14/16 COMPONENT_REMEDIATION, PRD-08 FLAGSHIP_CONTROLS, PRD-09 FLAGSHIP_OVERLAYS, PRD-10 APP_SHELL_NAVIGATION, PRD-11 DATA, PRD-12 AI, PRD-13 MEDIA_BACKDROPS, PRD-18/20 DEVELOPER_EXPERIENCE, PRD-21 and PRD-EXP COMPONENT_EXPANSION (PRD-21 interim owner, SC-37). For each non-rejected row owned by another PRD, each `reqRefs` id must match `\bREQ-…\b` in the owner file **or** be one of REQ-EXP-22/-23/-26/-27/-28 while `status` is `planned` (REQ-EXP-21).
7. **EXP-011 REQ-EXP-06.** `--diff <base>` and default mode both compare each non-rejected row's `names` case-insensitively against every rejected row's `names`; a match exits 1 with `X-Rnn rejected: <capability>`.
8. **EXP-012 REQ-EXP-05 `--diff origin/main`.** Uses `git diff --name-only <base>...HEAD`. If the diff adds files under `registry/blocks/*/`, `registry/items/*/` or `packages/labs/src/*/`, the block/item id must be a `names` entry of a row whose JSON changed in the same diff. Value exports: accept `--exports <before.json> <after.json>` (shape `{ "<subpath>": string[] }`, produced by 15b's enumerator in the Artifact lane); any added name must appear in some row's `names`. Without `--exports`, print `exports diff not evaluated (no --exports)` and still check registry/labs.
9. **EXP-013 `--report md`.** Emits the totals paragraph in the exact PRD wording pattern ("Totals: N rows. By priority: P0 a, P1 b, P2 c, P3 d. By primary release: …") computed from the ledger. **EXP-024**: wrap the PRD §4.2 totals paragraph in the markers and replace it with the generated output; `--check-docs` exits 1 if the text between markers differs. The ledger must produce 58 / P0 15 / P1 27 / P2 11 / P3 5 and by release 5.0 45, 5.1 11, labs 2 (Waveform X-42 is 5.1, SC-12); if your transcription gives different numbers, re-check rows against §4.2 and report any PRD arithmetic error with row ids instead of editing the counts.
10. **EXP-014 `--report release-notes --version <x.y>`.** Markdown "## New capability" listing rows with `release === x.y` and `status === "delivered"`: `- **<names>** (<id>, <owner>): <capability> — [CI run](<artifacts[].url where release matches>)`. A listed row without a matching artifact exits 1 (D-32).
11. **EXP-015 REQ-EXP-36.** A row whose `form` includes `export` and whose id was previously `registry-item`/`registry-block` (compare to `--diff` base ledger via `git show <base>:docs/auraglass-5/capability-ledger.json`) needs `exportDelta.root + exportDelta.subpath > 0`, `subpath` set, and ≥10 distinct `demand` URLs matching `^https://github\.com/.+/issues/[0-9]+$` or `^https://.+/doctor/reports/.+$`.
12. **EXP-016 performance.** Whole run ≤3 s on CI (PRD §16). Measure with `process.hrtime` and print `ledger gate: <ms> ms`; the workflow fails above 3000.
13. **EXP-017 fixtures** in `tests/capability/fixtures/`: `dup-owner.json` (owner also in collaborators), `missing-evidence.json`, `bad-line.json` (`research/competitors.md:99999`), `rubric-false.json`, `unknown-finding.json` (`E-99`), plus `rejected-hologram.json` (adds `GlassHologram`), `promotion-9.json`, `promotion-10.json`, `bad-reqref.json`, `owner-array.json`. Each is a full small ledger with one defect so the failing id is unambiguous.
14. **EXP-018..EXP-021 tests** (run the script with `child_process.spawnSync(process.execPath, [...])`):
   - `ledger-schema.test.ts`: "every row validates"; "58 capability + 13 rejected rows"; "ids unique".
   - `verify-ledger.test.ts`: one `it` per fixture asserting `status === 1` and `stderr` contains the row id; "real ledger exits 0"; "GlassHologram cites X-R04"; "promotion with 9 links exits 1, with 10 exits 0".
   - `req-refs.test.ts`: "every reqRefs id exists in its owner file or is a planned gap contract"; "the open REQ-EXP-21 gap rows are exactly X-07, X-16, X-19, X-25, X-26"; "X-17, X-18, X-43 cite REQ-FND-32, REQ-FND-33, REQ-MED-95"; "media rows X-37..X-43 cite REQ-MED ids per REQ-EXP-29".
   - `report.test.ts`: "md totals for fixture ledger" (jest snapshot written once; never re-written with `-u` to pass); "committed PRD totals match generator" (runs `--check-docs`); "release notes section lists only matching release and requires artifact".
15. **EXP-022** `package.json` `"verify:capability": "node scripts/ci/verify-capability-ledger.mjs"`.
16. **EXP-023** MODIFY `.github/workflows/certify-pr.yml` (QA-031): add an L1 Static step group (fetch-depth 0): `npm run verify:capability -- --check-docs`, `node scripts/ci/verify-capability-ledger.mjs --diff origin/${{ github.base_ref || 'main' }}`, `npx jest tests/capability/ledger-schema.test.ts tests/capability/verify-ledger.test.ts tests/capability/req-refs.test.ts tests/capability/report.test.ts --ci`. Keep QA's job names (SC-10); no secrets, no `continue-on-error`. Read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` first; if Actions is unsuitable for this repo, run the same commands on a remote runner (`auraone-remote-run`) and attach logs.

## 5. Running

Local (light, allowed): `node scripts/ci/verify-capability-ledger.mjs`, `npx jest tests/capability --ci`. Everything else in CI. No browser work in this prompt.

Visual evidence: none. This prompt changes no rendered UI, so it produces no screenshots or baselines; the evidence is the CI run URL and the gate log (runtime line included). Do not attach or claim visual evidence.

## 6. Prohibitions

No placeholder or `TODO` rows; no `exception:` text that just says "none"; no `test.skip`/`.only`/`todo`; no editing fixtures or snapshots to make a red test green; no new dependencies; no `|| true`.

## 7. Exit criteria

- AC-EXP-01: ledger has 58 + 13 rows; `npm run verify:capability` exits 0 on the branch; workflow green (link).
- AC-EXP-02: 5/5 PRD fixtures exit 1 naming the row (plus the 5 extra fixtures).
- AC-EXP-07 (refs half): `req-refs.test.ts` green.
- AC-EXP-15 (generator half): `--report release-notes` implemented and tested.
- REQ-EXP-04: `--check-docs` green; runtime ≤3 s printed in the CI log.

## 8. Final report

```
PROMPT-15a report
branch / SHA / PR:
workflow run URL:
rows: capability=58 rejected=13; totals line (generated):
fixtures: <name> -> exit, row id (10 lines)
owner REQ ids missing from owner files (if any):
competitors.md lines pinned per row (count; rows using exception:):
gate runtime (ms):
deviations used: none expected (PRD now carries the former index deviations); list any new one with evidence
blockers:
```
