# PROMPT-12j (DATA): 5.1 `aura-glass/charts`

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass`. This prompt is self-contained. Branch: the 5.1 development branch, cut after the 5.0.0 GA tag. Never land this on the 5.0.x `latest` line.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §3 (5.1 bullet), §4.1 rule 4, §4.4, §5.8 (ChartFrame contract you build on), §5.11 (REQ-DATA-72..75), §8 `src/charts/*` row, §10.1 A-13, §12.2 `chart.keyboard`, §13 Chart row, §16 `{ Chart }` line, AC-DATA-19, §20 step 13.
- Architecture: D-21, §11.1 (`@tier preview`), §14 (dist-tags).
- `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` §16 (`{ Chart }` line; aligned to this PRD's ≤ 15 KB owner row per SC-38).
- `docs/auraglass-5/prd/_shared-contracts.md` SC-12 (`./charts` ships in 5.1 via the exports manifest), SC-14 (allowlist), SC-15 (size rows), SC-38 (`{ Chart }` ≤ 15 KB gz decided; EXP is aligned).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-135..DATA-144.

Requirements: REQ-DATA-72, -73, -74, -75. Acceptance: AC-DATA-19.

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May create: `src/charts/{index.ts,Chart.tsx,ChartTooltip.tsx,charts.css,Chart.test.tsx,Chart.stories.tsx}`, `src/charts/marks/{Line,Area,Bar,Donut}.tsx`, `tests/charts/chart.keyboard.spec.ts`.
May modify (MODIFY only): `build/exports.manifest.json` (rows `./charts`, `./charts.css`; PKG-005; `exports` is generated, never hand-edited), `package.json` (d3 optional peers + exact devDependencies), PRD-PKG build config (add the entry), `tests/exports/data-peer-isolation.test.ts` ('charts' case), `docs/size-budgets.json` (`{ Chart }` row; PKG-048), `docs/dependency-allowlist.json` (d3 entries; PKG-056), `tests/a11y/browser/axe.spec.ts` (register Chart stories; A11Y-078).
Must NOT touch: `src/data/**` (use `ChartFrame` as is; file defects against 12e), `src/index.ts` (no root export), the 5.0.x release branch, `scripts/ci/verify-tree-shaking.js` (deleted by PKG-054).

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 5.0.0 GA tagged: `git tag --list 'v5.0.0'` is non-empty, and you are on a branch descending from it.
- `ChartFrame` certified (12e + 12i): `test -f src/data/chart-frame/ChartFrame.tsx` and AC-DATA-10/11 green on the GA SHA.
- PRD-PKG manifest, allowlist and size gate (PKG-005, PKG-056, PKG-048/049): `test -f build/exports.manifest.json && test -f docs/dependency-allowlist.json && test -f scripts/ci/verify-size-budgets.mjs`. Add the remotely measured `d3-scale`/`d3-shape` allowlist entries if absent, with the CI URL.
- PRD-OVL `Tooltip` (OVL-066), PRD-A11Y announcer (A11Y-054) and `usePreference` (A11Y-027) present; PRD-DS tokens for axes/grid (DS-016).

## 4. Steps
1. **DATA-135** packaging: `./charts` and `./charts.css` rows in `build/exports.manifest.json`, d3 optional peers, `next` dist-tag only, every export TSDoc `@tier preview`. Confirm `tests/exports/data-date-entries.test.ts` "no charts entry in 5.0.0" is still green on 5.0.x.
2. **DATA-136** `Chart.tsx`: one data shape (rows + `x` + `series`), renders inside `ChartFrame` as its `ChartAdapter`, own SVG on `d3-scale`/`d3-shape`, static output server-renderable, plot `role="group"` + `aria-roledescription="chart"` + `aria-labelledby` = frame title id, one tab stop, never `role="application"`.
3. **DATA-137** marks: Line, Area (stacked), Bar (stacked, horizontal), Donut. Colours only via `ctx.color()`. Forced-colors uses `CanvasText` plus dash patterns for series ≥ 2.
4. **DATA-138** `ChartTooltip.tsx` client island: crosshair, PRD-OVL Tooltip styling, Left/Right cursor, `aria-live="polite"` debounced 150 ms announcing x and each visible series value, no motion under reduced motion.
5. **DATA-139..141** CSS, unit tests (path snapshots per type for fixed data, stacked sums, curve mapping, ARIA, `renderToString`), stories `Line`, `Area`, `StackedArea`, `Bar`, `HorizontalBar`, `Donut`, `Tooltip`, `Keyboard`.
6. **DATA-142** `chart.keyboard.spec.ts` (three engines, OCR ≥ 4.5:1 on axis labels); axe with contrast on runs through `tests/a11y/browser/axe.spec.ts` with the Chart stories registered.
7. **DATA-143** peer-isolation 'charts' case and the `deps` codemod fixture `packages/cli/src/migrate/4to5/__fixtures__/deps/data-charts-d3-missing/` plus the `doctor` hint text for PRD-DX (DX-035/DX-041).
8. **DATA-144** row `{ Chart }` ≤ 15 KB gz with d3 external in `docs/size-budgets.json`, gated by `scripts/ci/verify-size-budgets.mjs` (SC-38 decided this value; EXP is aligned). When all AC-DATA-19 checks pass on the 5.1.0 SHA, remove `@tier preview` and promote to `latest` (C-E).

## 5. Tests to run
Local: `./node_modules/.bin/jest src/charts`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`, `./node_modules/.bin/eslint src/charts`. Remote: `tests/charts/chart.keyboard.spec.ts` on three engines, `tests/a11y/browser/axe.spec.ts` (Chart stories), L6/L7 visual and pixel gates for Chart stories across the 8 scenes, `tests/exports/data-peer-isolation.test.ts`, and `scripts/ci/verify-size-budgets.mjs`.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote gallery (three engines, light/dark, 1440/390 px, 8 scenes) of every Chart story, including the tooltip open and the keyboard cursor on a datum, plus forced-colors captures. Pixel-gate scores per image. A human reviewer checks palette saturation (no grey charts, E-09) and mark contrast against `content-raised`.

## 7. Integrity rules (binding)
No chart.js, Recharts or other engine as a dependency. d3 stays an optional peer imported only in `src/charts/**`. Don't publish to `latest` before AC-DATA-19 passes. Don't raise the 15 KB line. No `.skip`/`.only`, no snapshot updates to pass. No local Docker or local browser.

## 8. Exit criteria
- REQ-DATA-72: `Chart.test.tsx` green for all four types.
- REQ-DATA-73: peer-isolation 'charts' green; missing-d3 fixture fails resolution with the doctor hint.
- REQ-DATA-74: `chart.keyboard.spec.ts` green in three engines.
- REQ-DATA-75: no `./charts` in any 5.0.x `latest` exports map; `next` publications tagged `@tier preview`.
- AC-DATA-19: AC-DATA-08/09/10 equivalents for Chart green, and `{ Chart }` ≤ 15 KB gz on the 5.1.0 SHA.

## 9. Final report format
```
PROMPT-12j REPORT
Branch/SHA:
Tasks: DATA-135..144 -> done|blocked (reason) each
Budget: {Chart}=… KB gz (CI URL); Expansion PRD line aligned: yes|no
Dist-tag state: next=… latest=…
Prereq blockers: (exact output)
Tests: name -> engine -> pass/fail (local|remote URL)
Visual evidence: artifact URL + reviewer notes
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
