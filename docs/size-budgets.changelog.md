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
| 2026-10-09 | mat:theme-fns-js | 3072 → 7680 | theme fns pull preset table + oklch color math; measured 6806 B gz — Perf-Budget-Raise: mat:theme-fns-js | next-fin/plat-77-canaries |
| 2026-10-09 | mat:button-motion-share | 512 → 1536 | Button transitively imports motion store + springs; measured 1324 B gz — Perf-Budget-Raise: mat:button-motion-share | next-fin/plat-77-canaries |
| 2026-10-09 | mat:dialog-motion-share | 3804 → 4096 | Dialog transitively imports motion store + focus trap; measured 3804 B gz — Perf-Budget-Raise: mat:dialog-motion-share | next-fin/plat-77-canaries |
| 2026-10-09 | mat:provider-usepreference-js | 4096 → 6144 | provider bundles preference store + resolved memo table; measured 5365 B gz — Perf-Budget-Raise: mat:provider-usepreference-js | next-fin/plat-77-canaries |
| 2026-10-09 | SB-SURF-W1-SIDEBAR-DRAWER | 6144 → 8192 | base-ui portal + focus trap + motion; measured 7461 B gz — Perf-Budget-Raise: SB-SURF-W1-SIDEBAR-DRAWER | next-fin/plat-77-canaries |
| 2026-10-09 | SB-SURF-W3-MESSAGE | 10240 → 12288 | markdown/code surface + copy actions; measured 11343 B gz — Perf-Budget-Raise: SB-SURF-W3-MESSAGE | next-fin/plat-77-canaries |
| 2026-10-09 | SB-SURF-W3-STREAMINGTEXT | 2048 → 4608 | cursor animation + text utils; measured 4068 B gz — Perf-Budget-Raise: SB-SURF-W3-STREAMINGTEXT | next-fin/plat-77-canaries |
| 2026-10-09 | SB-SURF-W4-USEMEDIAELEMENT | 2560 → 3584 | media session + event wiring; measured 3068 B gz — Perf-Budget-Raise: SB-SURF-W4-USEMEDIAELEMENT | next-fin/plat-77-canaries |
| 2026-10-09 | SB-SURF-W4-BACKDROP | 3072 → 4608 | portal layer + material floor styles; measured 4100 B gz — Perf-Budget-Raise: SB-SURF-W4-BACKDROP | next-fin/plat-77-canaries |

## D-26 calibration record

Pending — fires on the first pre-release where Button and Dialog carry no
`@ag-contract-seed` in their source closures (they still do as of 2026-10-08,
pending CMP's core stream). At that event: PLAT rows := `min(provisional,
measured × 1.10)` and `transitiveCeiling` := measured `npm install
--omit=dev --omit=optional --omit=peer` count of the packed tarball
(currently 47 — recorded as the beta floor in tests/deps/transitive-count.test.mjs).
