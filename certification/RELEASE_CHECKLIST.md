# AuraGlass 5 GA checklist (contract §6.2, REQ-QUAL-63)

QUAL-owned. GA is promoted only when every item below is `pass` on one SHA of `next`. The release job
`qual:certify:release` (tag pipeline, `AG_LINE == 5x`) runs every lane at release scope and then writes the
ReleaseVerdict (S-55, `.artifacts/qual/release-verdict.json`) with

```
node certification/run.mjs --lane all --scope release --verdict .artifacts/qual/release-verdict.json
```

The verdict is built by `packages/qa/src/evidence/verdict.ts` (`CHECKLIST` is this table in code; a test keeps the two
identical). Next to it the job writes `release-checklist.md` — this checklist with every box ticked **from the run's
evidence only**, never by hand — and, when the evidence is complete, `.artifacts/qual/claims.json` (REQ-QUAL-62).
`ga` is `true` only when all sixteen items are `pass`. The verdict is advisory (it does not fail the job by itself)
for `-alpha.N`, `-beta.N` and `-rc.N` tags and on the 4.x line; on a GA tag `ga: false` fails the job and
`plat:publish:npm` (`scripts/release/verify-release-verdict.mjs`) refuses to publish.

| # | Item | Verified by | How the verdict reads it |
|---|---|---|---|
| G-01 | Every lane L1–L12 is `pass` for every GA subject; no `pending`, `double-pass` or `pre-existing` remains; the evidence verifies (REQ-QUAL-61) | `qual:certify:release` (lane manifest + evidence verifier) | every result of this run is `pass`, every lane has results, and `verifyEvidence` reports no problem |
| G-02 | Zero `@ag-contract-seed` markers in `src/`; zero `data-ag-seed`, story-only or banned attributes in `dist/`; the tarball has no `contracts/`, `tests/`, `fragments/` or stubs | L1, L2 | every L1 and L2 result `pass` |
| G-03 | Every `ENTRIES` row with `ga: '5.0'` is built and its value exports equal the contract list; `ROOT_EXPORTS` equals the root's value exports | `tests/contract/entries.test.ts` against the tarball | the release-scope L1 row `tests/contract/**/*.test.ts*` (`certification/lanes.config.ts`) `pass` |
| G-04 | All 44 flagships have the §11.3 deliverables | `packages/qa/src/deliverables/` (`scripts/qual/deliverables/check.ts` on L1) | the registered deliverables row `pass`; `pending` until G-19 registers it |
| G-05 | All auraglass lint rules at `error` everywhere with zero violations; the literal baseline is 0 for every stream | L1 | every L1 result `pass` |
| G-06 | Contract conformance suite green (§6.3) | `tests/contract/**` | the release-scope `tests/contract/**` row `pass` |
| G-07 | Every 5.0 removal or rename has a `deprecations` entry that shipped in a published 4.x minor (≥4.2.0) | L3 against the published 4.x tarballs | every L3 result `pass` |
| G-08 | Codemods run clean on the canaries and every registry block; the frozen 4.x fixture passes `migrate 4to5` with zero TODOs | L11 | every L11 result `pass` |
| G-09 | L13 manual screen-reader records exist for all 44 flagships with no `fail` open | L13 artifact (`.artifacts/qual/a11y-manual-<sha>.json`, FIN-H aggregate) | aggregate bound to the SHA with `verdict: pass`; missing → `pending` before RC-1, `fail` from RC-1 |
| G-10 | L14 human visual review signed for the six product surfaces (S1 showcases) and the T0 matrix | L14 records (`certification/review/records/`, `qual:certify:review-record`) | a passing record (all criteria ≥3) for `t0-matrix` and every S1 showcase; missing → `pending` before RC-1, `fail` from RC-1 |
| G-11 | Zero open P0, and ≥4 weeks since the first P0-free RC (§14.1) | issue tracker query (PLAT artifact `release-items/G-11.json`) | owner artifact, else `pending` |
| G-12 | `legacy/` is empty and `reports/` is absent | L1 (PLAT artifact `release-items/G-12.json`; QUAL cross-checks the checkout) | owner artifact, else `pending`; `fail` whenever the checkout still tracks a file under `legacy/` or `reports/` |
| G-13 | Size and perf budgets within their calibrated ceilings, no raise after calibration | L2, L10 | every L2 and L10 result `pass` |
| G-14 | README and release-note claims are generated from this run’s artifacts | PLAT docs-claims gate (`release-items/G-14.json`) | owner artifact, else `pending` |
| G-15 | Gates outside the agent perimeter recorded as decided (Base UI sign-off, D-31 font licence, npm scope, OD-10 trusted publishing, OD-11 GitLab settings) | `docs/release/decisions/` (PLAT artifact `release-items/G-15.json`) | owner artifact, else `pending` |
| G-16 | No GitHub Actions workflow other than `mirror-to-gitlab.yml` on the GA SHA, and every `REQUIRED_JOBS` entry is `allow_failure: false` | `contract:ci-fragments` (PLAT artifact `release-items/G-16.json`) | owner artifact, else `pending` |

## Owner artifacts (G-11, G-12, G-14, G-15, G-16)

An item verified outside QUAL is read from a job artifact its owner writes in the same tag pipeline, at
`.artifacts/<stream>/<job-slug>/release-items/G-NN.json`:

```json
{ "version": 1, "id": "G-11", "sha": "<CI_COMMIT_SHA>", "status": "pass", "evidence": ["<job or query URL>"] }
```

`status` is `pass` or `fail`; a `pass` without evidence URLs, a malformed file or one for another item is `fail`; a
file bound to another SHA is `pending`. The qual job reads it only when the owner's job is an `optional: true` need
of `qual:certify:release` that ran before it; a missing artifact leaves the item `pending`, never `pass`.

## Human evidence (G-09, G-10)

L13 and L14 are required from RC-1 (`v5.x.y-rc.N`, and every GA tag). Agents never write, score or back-fill
them: SrRecords are the testers' (`tests/a11y/manual/records/**`, FIN-H), review records the design reviewer's
(`certification/review/records/**`, FIN-H). The evidence verifier also requires, from RC-1, an L14 record for every
flagship subject-state, bound to the SHA or to an earlier SHA with zero diffs in that subject's baselines and DOM
snapshot.
