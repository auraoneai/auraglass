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
`@ag-contract-seed` in their source closures (they still do as of 2026-10-08,
pending CMP's core stream). At that event: PLAT rows := `min(provisional,
measured × 1.10)` and `transitiveCeiling` := measured `npm install
--omit=dev --omit=optional --omit=peer` count of the packed tarball
(currently 47 — recorded as the beta floor in tests/deps/transitive-count.test.mjs).
