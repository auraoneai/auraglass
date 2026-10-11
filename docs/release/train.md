# Release train — AuraGlass 4.x → 5.0.0

Each stop lists its entry gates. **A missed gate moves the date, never the gate.**
Every gate carries a checklist id (`TR-<stop>-<n>`); the same ids, in the same order, are in
`docs/release/train-checklist.json`, which the release jobs fill in at each cut.
`tests/release/train.test.ts` fails when an id is missing from its stop here or in the
checklist. Contract §6.2 gate ids (G-01 … G-16) are named where a train gate feeds one.

## Stops

### 4.1.1 — week of 2026-10-12 (`release/4.1.x`)

- `TR-4.1.1-1` REQ-PLAT-37..55 done on `release/4.1.x` (trust patch scope; patch-scope gate green).
- `TR-4.1.1-2` The hosted-runtime security advisory is published before the tag (OD-21).
- `TR-4.1.1-3` Release ledger green: `verify-release-ledger --cut 4.1.1` (CHANGELOG, tag, GitLab Release, npm).
- `TR-4.1.1-4` npm trusted publishing repointed to GitLab CI (G-15 / OD-10 recorded).

### 4.2.0 — 2026-11-16 (`release/4.x`)

- `TR-4.2.0-1` Change class ≤ C-D against 4.1.1.
- `TR-4.2.0-2` Every "C-D since 4.2" row of the breaking-change register has a deprecation entry (G-07 feed).
- `TR-4.2.0-3` REQ-PLAT-56..61 done on `release/4.x`.
- `TR-4.2.0-4` Downstream grep attached: `docs/release/decisions/downstream-4.2.0.json` (operator run, REQ-PLAT-35).

### 4.3.0 — 2027-01-18 (`release/4.x`)

- `TR-4.3.0-1` Change class ≤ C-D against 4.2.0.
- `TR-4.3.0-2` Every C-B item of the breaking-change register has an entry with `since` ≤ 4.3.0 (G-07 feed).
- `TR-4.3.0-3` Codemod fixture suite green.
- `TR-4.3.0-4` `@auraglass/cli@0.x` published from the tag pipeline.
- `TR-4.3.0-5` Preview baselines captured by `plat:test:visual-4x` (preview cells).

### 4.4.0 — after 4.3.0 (`release/4.x`)

- `TR-4.4.0-1` **Late C-D only**: deprecation entries discovered after 4.3.0 whose B-id already exists in the register, nothing else. This is the last 4.x minor.

### 5.0.0-alpha.N — rolling (`next` → `next`)

- `TR-5.0.0-alpha.N-1` Fixed train: every alpha publishes from `next` to the `next` dist-tag on the same cadence and never waits for a stream.
- `TR-5.0.0-alpha.N-2` Change-class check green; API reports regenerated (`api:update`).

### 5.0.0-beta.1 — after alpha (`next`)

- `TR-5.0.0-beta.1-1` REQ-PLAT-28 deprecation-coverage report attached (G-07).
- `TR-5.0.0-beta.1-2` Canaries green **including the frozen 4.x fixture after `migrate 4to5`** (feeds G-08).
- `TR-5.0.0-beta.1-3` Lint literal baseline 0 (G-05).

### 5.0.0-rc.1 — after beta (`next`)

- `TR-5.0.0-rc.1-1` Flagship API frozen: a C-B change in `etc/api/*.api.md` between rc.1 and GA fails unless it fixes a P0 and is listed in the RC notes.
- `TR-5.0.0-rc.1-2` Zero open P0 (G-11 window starts).
- `TR-5.0.0-rc.1-3` Codemods clean on every canary and every registry block (G-08).
- `TR-5.0.0-rc.1-4` Downstream grep at rc.1 attached: `docs/release/decisions/downstream-5.0.0-rc.1.json`.

### 5.0.0 GA — ≥ 4 weeks after the first P0-free RC (`next` → `main`)

- `TR-5.0.0-GA-1` `ReleaseVerdict.ga === true` (every G-01 … G-16 item `pass`).
- `TR-5.0.0-GA-2` At least 4 weeks since the first P0-free RC.
- `TR-5.0.0-GA-3` `next` merged into `main`.
- `TR-5.0.0-GA-4` `5.0.0` published as a new version, never a retag.
- `TR-5.0.0-GA-5` `v4-lts` dist-tag set on the last 4.x; the LTS clock starts (`docs/release/lts-policy.md`).

## Gate ↔ evidence map

- G-05: lint literal baseline report.
- G-07: `.artifacts/plat/deprecation-coverage.json` (`verify-breaking-register --coverage --published-dir`).
- G-08: canary + fixture run records under `docs/release/decisions/`.
- G-11: issue-tracker P0 query (operator).
- G-12: `legacy/` empty + `reports/` absent on the GA SHA.
- G-15 / OD-10 / OD-11: decision records under `docs/release/decisions/`.
- GA verdict: `verify-release-verdict.mjs` output + `release-verdict.json` URL.
- Per-5.0-stop evidence index: `docs/release/5.0.0-gates.md`.
