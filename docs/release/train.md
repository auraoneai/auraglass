# Release train — AuraGlass 4.x → 5.0.0

Each stop lists its entry gate. **A missed gate moves the date, never the gate.**
Gate ids are the contract §6.2 ids (G-01 … G-16); stop-level prerequisites are
named alongside them.

## Stops

| Stop | Target date | Entry gate |
| --- | --- | --- |
| **4.1.1** | week of 2026-10-12 | Patch stop: C-I/C-I-VF changes only; `npm view` ledger green (`verify-release-ledger --cut 4.1.1`); npm trusted publishing repointed (G-15/OD-10 recorded). |
| **4.2.0** | 2026-11-16 | Minor stop: every deprecation entry slated for a 5.0 removal ships here or earlier (G-07 feed); downstream-grep record at cut committed; CHANGELOG/tag/GitLab/npm ledger green. |
| **4.3.0** | 2027-01-18 | Minor stop: remaining G-07 deprecations published; late C-D list frozen for 4.4.0. |
| **4.4.0** | after 4.3.0 | **Late C-D only** — deprecations discovered after 4.3.0, nothing else. This is the last 4.x minor. |
| **5.0.0-alpha.N** | rolling from `next` | Fixed train: every alpha publishes from `next` on the same cadence; change-class check green; API reports regenerated (api:update). |
| **5.0.0-beta.1** | after alpha | REQ-PLAT-28 deprecation-coverage report attached; canaries green **including the frozen 4.x fixture after `migrate 4to5`** (feeds G-08); lint baseline 0 (G-05). |
| **5.0.0-rc.1** | after beta | Flagship API frozen (api-report `--check` clean); zero open P0 (G-11 start); codemods clean on all registry blocks (G-08); downstream-grep record at rc.1 committed. |
| **5.0.0 GA** | ≥ 4 weeks after first P0-free RC | `ReleaseVerdict.ga === true` — every G-01…G-16 item `pass`; `next` merged into `main`; 5.0.0 published **new version, never retagged**; `v4-lts` dist-tag set; LTS clock starts (lts-policy.md). |

## Gate ↔ evidence map

- G-07: `.artifacts/plat/deprecation-coverage.json` (`verify-breaking-register --coverage --published-dir`).
- G-08: canary + fixture run records under `docs/release/decisions/`.
- G-11: issue-tracker P0 query (operator).
- G-12: `legacy/` empty + `reports/` absent (PLAT-218/240/241).
- G-15/OD-10/OD-11: decision records under `docs/release/decisions/`.
- GA verdict: `verify-release-verdict.mjs` output + `release-verdict.json` URL.
