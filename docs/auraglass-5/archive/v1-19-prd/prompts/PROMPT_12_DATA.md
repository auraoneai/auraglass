# PROMPT-12 (DATA): Data and Date — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` (key **DATA**, cited as `PRD-DATA`; program self-id PRD-12 and architecture §16 boundary PRD-11 are aliases only, SC-01). Binding cross-PRD contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-01..SC-40; a row there wins over any PRD or prompt text). Requirements REQ-DATA-01..07, 10..22, 25..26, 30..32, 35..39, 42..44, 47..49, 52..57, 60..61, 62..69, 72..75, 78..81 (60 ids); acceptance AC-DATA-01..20; API changes A-01..A-14; open items PRD §21 OI-01..OI-17. Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-08, D-09, D-13, D-15, D-17, D-18, D-21, D-24..D-29, D-32; §3.2, §3.6, §11.2 #14 and #32–37, §12–§16). Task fragment: `docs/auraglass-5/tasks/DATA.json` (DATA-001..DATA-144; `depends_on` holds only real task ids, SC-40).

The PRD spans a 4.x maintenance bridge, a packaging boundary, seven flagships with browser-certified keyboard models, compat/codemods, six removal families, certification and a 5.1 subpath. It is split into ten independently executable prompts. Each restates the common rules below so it can run without the others in context.

| Prompt | Scope | REQ IDs | AC IDs | Tasks | Branch | Hard prerequisites (owner prompt / anchor task) |
|---|---|---|---|---|---|---|
| `PROMPT_12a_DATA_BRIDGE_4X.md` | chart.js scoped registration, lazy date-fns, optional peers, 4.2/4.3 deprecations, migration guides | 78, 79 (+ A-01..A-05) | 04, 05, 15 | DATA-001..015 | `release/4.x` | PRD-REL change-class gate (REL-052), schema (REL-010); PRD-TRUST root `deprecations.json` seed (TRUST-075); PRD-DX `doctor` (DX-035) |
| `PROMPT_12b_DATA_ENTRY_GUARDS.md` | lint boundaries, react-hooks, locale lint, exports-manifest rows, deps/peers, allowlist data, entry/peer/side-effect/RSC tests, runner wiring, size-budget rows, CSS entries | 01–07, 22 (lint), 69 (lint) | 01 (scan), 02, 03 (rows), 20 (lint) | DATA-016..032 | `main` | PRD-PKG PKG-005 (exports manifest), PKG-015 (ESLint wiring), PKG-042 (side-effect gate), PKG-048/049 (size budgets), PKG-056/057/059 (allowlist, verify-deps, optional peers), PKG-018 (React 19); PRD-QA QA-003/QA-018 (configs); PRD-MAT MAT-015 |
| `PROMPT_12c_DATA_VIRTUALLIST_TABLE.md` | `VirtualList`, `Table` table mode (sort, selection, virtualize, sticky header, states, density, numeric, DOM contract) | 10–14, 18–22, 25, 26 | 06 (jsdom), 20 | DATA-033..044 | `main` | 12b merged; PRD-MAT MAT-047; PRD-A11Y A11Y-054 (announcer); PRD-CTL CTL-029 (Checkbox); PRD-FND FND-005, FND-059 (Skeleton); pattern gate CTL-055 + OVL-040 certified; PRD-SB SB-048 (stories) |
| `PROMPT_12d_DATA_TABLE_ADVANCED.md` | resize, pinning, pagination, grid mode (`useGridKeyboard`), Table browser specs incl. `tests/a11y/apg/table.apg.spec.ts` | 15, 16, 17, 10 (pagination), 14 (browser), 20 (coarse) | 06, 08 (Table), 17 (Table) | DATA-045..054 | `main` | 12c merged; DATA-030; PRD-A11Y A11Y-073 (APG harness); PRD-QA QA-082; PRD-CTL CTL-055/CTL-102; PRD-FND FND-001 (alpha coverage check) |
| `PROMPT_12e_DATA_SERVER_SET.md` | `Sparkline`, `StatCard`, `ChartFrame` (+ islands), `Timeline`, `ActivityFeed`, palette token test, hydration test, adapter docs | 42–44, 47–49, 52–57, 60, 61 | 10, 11, 12, 13 (unit half) | DATA-055..076 | `main` | 12b merged; PRD-DS DS-016/DS-022 (component tokens: PRD §21 OI-04); PRD-MAT MAT-047; PRD-OVL OVL-066; PRD-A11Y A11Y-027/A11Y-054; PRD-FND FND-038; PRD-DX DX-101 |
| `PROMPT_12f_DATA_FILTERS_TREE.md` | `useFilterModel`, serialize/parse, `FilterBar`, `TreeView` (RA), registry items `query-builder`/`faceted-search`/`tree-select`, APG specs | 30–32, 35–39 | 08 (FilterBar, TreeView) | DATA-077..091 | `main` | 12b + 12c (`VirtualList`) merged; PRD-CTL CTL-075/081/061/102; PRD-OVL OVL-063/097; PRD-FND FND-071/FND-001; PRD-DX DX-067/DX-070 |
| `PROMPT_12g_DATA_DATE.md` | `./date`: provider, fields, Calendar/RangeCalendar, DatePicker, DateRangePicker, TimePicker, ISO weeks, date specs | 62–69 | 08 (date), 12 (date), 17 (date) | DATA-092..107 | `main` | 12b merged; PRD-A11Y A11Y-029; PRD-CTL CTL-007 (field shell), CTL-055; PRD-OVL OVL-063/OVL-097; RAC peer pinned (PKG-059, DATA-021/022); PRD-DX DX-035 |
| `PROMPT_12h_DATA_COMPAT_REMOVAL.md` | `*.meta.ts`, `src/compat/data/`/`src/compat/date/` adapters, codemod `migration` fields + 4to5 fixtures, frozen-fixture run, root export removal, removal families, dep removal | 80, 81, 04 (removal) | 01, 14 | DATA-108..122 | `main` | 12c–12g merged; PRD-DX DX-041/042/065; PRD-REL REL-070/072/115; PRD-FND removal gate FND-107/108 and RM-07 FND-127; PRD-NAV NAV-124; PRD-PKG PKG-059 |
| `PROMPT_12i_DATA_CERTIFICATION.md` | showcase compositions, preferences/perf/axe/visual/pixel gates, canaries, manual matrix, grade calibration, GA block content `analytics-dashboard`/`data-workspace`, docs pages | §14, §15, §16, DoD | 03, 07, 09, 10, 13, 16, 17, 18 | DATA-123..134 | `main` | 12c–12h merged; PRD-SB SB-048/105/107/116; PRD-QA QA-045/047/056/085/099; PRD-PERF PERF-039; PRD-A11Y A11Y-078/084; PRD-PKG PKG-122/125/126; PRD-MAT MAT-055; PRD-DX DX-073/074/101; PRD-NAV NAV-016 |
| `PROMPT_12j_DATA_CHARTS_5_1.md` | 5.1 `aura-glass/charts` `Chart` on d3 optional peers | 72–75 | 19 | DATA-135..144 | 5.1 branch after 5.0.0 GA | 12e (`ChartFrame`) merged; 5.0.0 GA tagged; PRD-PKG PKG-005/048/049/056; PRD-OVL OVL-066 |

Order: 12a runs on `release/4.x` at any time (target 4.2 on 2026-11-16, 4.3 on 2027-01-18). On `main`: 12b → 12c → (12d ∥ 12e ∥ 12f ∥ 12g) → 12h → 12i. 12c's `VirtualList` (DATA-033) unblocks PRD-AI `Thread`. 12j starts after GA.

## Numbering and dependencies (read before following any dependency)

Cite PRDs by key (`PRD-CTL`, `PRD-OVL`, …). The PRD body uses §16 numbers with the key authoritative; task text uses keys. `depends_on` in `tasks/DATA.json` contains only real task ids that exist in `tasks/*.json` and point at the owner's anchor task (SC-40). Key → file:

| Key | §16 id | File |
|---|---|---|
| TRUST | PRD-00 | `prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` |
| REL | PRD-01 (+ interim PRD-17 bridge) | `prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` |
| PKG | PRD-02 | `prd/AURAGLASS_PACKAGING_BUILD_PRD.md` |
| DS | PRD-03 | `prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` |
| MAT | PRD-04 | `prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` |
| A11Y | PRD-05 | `prd/AURAGLASS_ACCESSIBILITY_PRD.md` |
| MOT | PRD-06 | `prd/AURAGLASS_MOTION_PRD.md` |
| FND | PRD-07 + PRD-14 + PRD-16 | `prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` |
| CTL | PRD-08 | `prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` |
| OVL | PRD-09 | `prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` |
| NAV | PRD-10 | `prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` |
| AI | PRD-12 | `prd/AURAGLASS_AI_PRD.md` |
| DX | PRD-18 + PRD-20 | `prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` |
| QA | PRD-19 (certification) | `prd/AURAGLASS_QA_CERTIFICATION_PRD.md` |
| SB | PRD-19 (Storybook/Lab) | `prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` |
| PERF | perf policy | `prd/AURAGLASS_PERFORMANCE_PRD.md` |

## Shared contracts this PRD consumes (do not re-specify or build)

- `deprecations.json` at the repo root (SC-02/03; seed TRUST-075, schema REL-010). Size budgets: rows in `docs/size-budgets.json` gated by `scripts/ci/verify-size-budgets.mjs` (SC-15; PKG-048/049); no `verify-tree-shaking.js` (deleted by PKG-054), no `size-limit`. Runtime budgets: `tests/perf/harness/budgets.json` (PERF).
- Exports: rows in `build/exports.manifest.json` (SC-12, PKG-005). Allowlist: `docs/dependency-allowlist.json` (SC-14, PKG-056). Side effects: `scripts/ci/verify-side-effects.mjs` (PKG-042).
- Tests (SC-30): APG specs `tests/a11y/apg/<kebab>.apg.spec.ts` on `tests/a11y/apg/harness.ts`; browser axe in `tests/a11y/browser/axe.spec.ts` (A11Y-078); perf specs `tests/perf/browser/data-*.spec.ts`; visual specs `tests/visual/data/`. Lanes cited as L1..L14 (SC-29); `jest.config.js`/`playwright.config.ts` are QA's (MODIFY only).
- Frozen 4.x fixture `tests/fixtures/consumer-4x/` (SC-08, REL-115). Codemods (SC-33): `npx @auraglass/cli migrate 4to5`, fixtures `packages/cli/src/migrate/4to5/__fixtures__/<id>/data-*`, mappings generated by `scripts/release/gen-deprecations.mjs --codemods`, marker `// TODO(aura-glass 5): <reason>, see <doc>`.
- Compat (SC-34): `src/compat/data/<OldName>.tsx`, `src/compat/date/<OldName>.tsx`, re-exported by `src/compat/index.ts` (DX-065), `warnDeprecated` (REL-072). No compat for chart names or `GlassTimelineRail`.
- Registry (SC-32): items `registry/items/<id>/`; GA blocks `analytics-dashboard` and `data-workspace` whose content DATA owns (DX scaffolds/registers). No `dashboard` block. Showcases (SC-31): DATA supplies compositions to SB-owned `showcase/{financial-dashboard,analytics,ops-console}/`.
- Scenes (SC-28): `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`. Attribute: `data-ag-pinned-edge` is DATA's ratified `data-ag-*` addition (SC-21).
- Decided values (SC-38): `StatCard` is static (no tweening `AnimatedNumber`); `{ Chart }` ≤ 15 KB gz.

## Deviations recorded across prompts (each with evidence)

1. PRD §4.2: `ChartFrame` is `content-raised` and `Sparkline`/`Timeline`/`ActivityFeed` inherit their parent, versus architecture §11.2 `content` (PRD's own deviation; erratum request PRD §21 OI-07).
2. PRD §4.3: own `useGridKeyboard` instead of RA grid (PRD's own deviation; spike DATA-049 re-checks it, PRD §21 OI-08).
3. PRD §4.7 / §3: `Timeline`/`ActivityFeed` only in `./data`; `RangeCalendar`/`TimePicker` added to `./date` (accepted by SC-12; errata E-04).
4. `src/components/charts/ModularGlassDataChart.tsx:130` also calls `Chart.register(` at module scope (verified with `rg`). REQ-DATA-78 lists only `GlassDataChart.tsx` and `ChartRenderer.tsx`; DATA-003 fixes this third site so AC-DATA-04 can pass.
5. The only static `from "date-fns"` import in `src` is `src/lib/GlassLocalizationProvider.tsx:9` (exported at `src/index.ts:64`). REQ-DATA-79 names only `dateAdapters.ts`; DATA-006 covers the provider, which is what actually loads 304 modules on root import.

## Common rules (each sub-prompt restates them in full)

- Remote-first. Playwright (all `tests/**/*.spec.ts`), visual/OCR/pixel gates, perf, Storybook builds, `next build` canaries, `npm pack` + tarball tests and full `npm run build` run remotely: GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never use local Docker. Never run a local browser. Local runs are limited to single Jest files (`./node_modules/.bin/jest <path>`), ESLint on touched files, and `./node_modules/.bin/tsc --noEmit`. No `npx` when a `node_modules/.bin` executable exists.
- No fake completion: no stub/placeholder components, no mocked TanStack or React Aria modules in browser specs, no `test.skip`/`.only`/`test.fixme`/`xit`, no lowered thresholds, no `-u`/`--update-snapshots` to get green, no axe rules disabled, no baseline regeneration without the pixel gates and human review. Evidence is CI artifacts (D-32), never committed reports.
- Shared artifacts are edited only by MODIFY after the owner's anchor task exists (SC rule 1). If the anchor has not landed, stop that task and report the blocker; do not create the artifact yourself.
- Final report: each sub-prompt defines its block. The orchestrator merges them into one AC-DATA-01..20 table with CI artifact links.
