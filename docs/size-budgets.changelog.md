# size-budgets.changelog.md

Raise ledger for `fragments/size-budgets/*` rows and `transitiveCeiling`.
Every raise requires a row below plus commit trailer `Perf-Budget-Raise: <row id>`
linking the remote-measured delta that justifies it. After the D-26 calibration,
rows only decrease.

## Rows

| Date | Row | From → To | Remote-measured delta | Commit |
| ---- | --- | --------- | --------------------- | ------ |

_(none yet — PLAT rows landed at their floors in the build-system PR)_

## D-26 calibration record

Pending — fires on the first pre-release where Button and Dialog carry no
`@ag-contract-seed` in their source closures. At that event: PLAT rows :=
`min(provisional, measured × 1.10)` and `transitiveCeiling` := measured
`npm install --omit=dev --omit=optional --omit=peer` count of the packed
tarball. The transitive leg is recorded only by
`node scripts/build/calibrate-transitive.mjs --write` in GitLab CI (it reports
`pending` while either trigger entry is seeded and refuses to raise the
ceiling); never edit the lines below by hand.

Machine-readable record (read by `tests/deps/transitive-count.test.mjs`, which
fails when the record is absent or the count exceeds it). Until calibration the
ceiling is the provisional beta floor the test enforced before REQ-PLAT-71:

transitiveCeiling: 64
transitiveCeilingStatus: provisional

