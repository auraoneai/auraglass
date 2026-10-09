# size-budgets.changelog.md

Raise ledger for `fragments/size-budgets/*` rows and `transitiveCeiling`.
Every raise requires a row below plus commit trailer `Perf-Budget-Raise: <row id>`
linking the remote-measured delta that justifies it. After the D-26 calibration,
rows only decrease.

## Rows

| Date | Row | From → To | Remote-measured delta | Commit |
| ---- | --- | --------- | --------------------- | ------ |

| 2026-10-09 | plat:warnDeprecated | 150 → 2560 | warnDeprecated bundles the generated DEPRECATIONS lookup table (measured 2272 B gz); floor unreachable — Perf-Budget-Raise: plat:warnDeprecated | next-fin/plat-76-size-budgets |
| 2026-10-09 | mat:tokens-js | 2048 → 6144 | tokens entry re-exports the generated manifest table; first real measurement 4862 B gz (was seed-pending) — Perf-Budget-Raise: mat:tokens-js | next-fin/plat-76-size-budgets |

## D-26 calibration record

Pending — fires on the first pre-release where Button and Dialog carry no
`@ag-contract-seed` in their source closures (they still do as of 2026-10-08,
pending CMP's core stream). At that event: PLAT rows := `min(provisional,
measured × 1.10)` and `transitiveCeiling` := measured `npm install
--omit=dev --omit=optional --omit=peer` count of the packed tarball
(currently 47 — recorded as the beta floor in tests/deps/transitive-count.test.mjs).
