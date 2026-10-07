# PROMPT-11 (NAV): App Shell, Navigation and Workspace Surfaces — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key **NAV**; program self-id PRD-11 is an alias only; architecture §16 boundary **PRD-10**). Requirements REQ-NAV-01..84, acceptance AC-NAV-01..22, open items §21 O-01..O-10. Binding shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (wins over any older text; NAV rows SC-02, SC-18, SC-19, SC-22, SC-27, SC-31, SC-32, SC-36, SC-39, SC-40). Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` D-02, D-04..D-09, D-10, D-11, D-13, D-14, D-15, D-20, D-24..D-27, D-29, D-32; §3.2, §4.6, §4.7, §6, §8, §9.1, §10, §11.2 (flagships 22–31), §11.3, §12, §13, §14, §15.2. Task fragment: `docs/auraglass-5/tasks/NAV.json` (NAV-001..NAV-145).

PRD-NAV has 84 requirements across a server frame, five client islands, ten flagships, a certification run and a 4.x migration. That does not fit one agent session, so it is split into nine independently executable prompts. Each restates the common rules, names its REQ/AC IDs, file scope, prerequisite checks, tests, evidence and report.

| Prompt | Scope | REQ-NAV | AC-NAV | Tasks | Hard prerequisites (owner prompt / anchor task) |
|---|---|---|---|---|---|
| `PROMPT_11a_NAV_PURE_CSS.md` | pure modules, `--ag-app-shell-*` row request to DS, `app-shell.css` grid + container queries, static-HTML geometry fixture, E-22 handover to TRUST | 02 (CSS), 03, 04, 06, 07, 09 (parser), 13 (CSS), 55/56 (range), 59, 69 | 01 (fixture half), 02 (CSS half), 15 (scorer) | NAV-001..015 | PRD-PKG prompt (PKG-005 manifest, PKG-105 class coverage); PRD-DS prompt (DS-016 compiler, DS-024 space) |
| `PROMPT_11b_NAV_FRAME.md` | `AppShell` server frame, `TopBar`, `StatusBar`, `MobileShell`, store, toggles, `Controller`, cookie, hydration | 01, 05, 06, 08..14, 20 (toggle ARIA), 25..29, 33, 34, 36, 37 | 13 (status half), 16, 17 (frame half) | NAV-016..035 | 11a; PRD-MAT (MAT-047 `Surface`, MAT-050 `ScrollEdge`); PRD-A11Y (A11Y-054 announcer); PRD-FND (FND-005 parts); PRD-CTL (CTL-061 `IconButton`); PRD-QA (QA-018, QA-086) |
| `PROMPT_11c_NAV_SIDEBAR.md` | `Sidebar` family, rail tooltips, collapsibles, `SidebarDrawer` | 15..24 | 12 (Sidebar half), 13 (collapsed half) | NAV-036..047 | 11b; PRD-OVL (OVL-097 `Sheet`, OVL-066 `Tooltip`); PRD-FND (FND-001, FND-007); PRD-A11Y (A11Y-073) |
| `PROMPT_11d_NAV_PANELS_INSPECTOR.md` | `ResizablePanels`, `Inspector`, `app-shell-workspace` registry item | 30..32, 35, 64..72 | 14 | NAV-048..062 | 11a (`resizePanels.ts`), 11b; PRD-OVL (OVL-097, OVL-099); PRD-DX (DX-067 `registry.json`, DX-070 lint, DX-094 render harness) |
| `PROMPT_11e_NAV_TABS_TABBAR.md` | `Tabs` (Base UI), indicator morph, `TabBar` (navigation/tabs, floating, minimize, accessory) | 38..50 | 11, 12 (TabBar half) | NAV-063..077 | 11b; PRD-MOT (MOT-045, MOT-048 `startMorph`); PRD-FND (FND-001); PRD-MAT (MAT-048); PRD-CTL (CTL-075) |
| `PROMPT_11f_NAV_CRUMBS_PAGES_COMMAND.md` | `Breadcrumbs` + overflow, `Pagination`, `Command`, `CommandPalette` | 51..63 | 15, 17 (Breadcrumbs half) | NAV-078..091 | 11a pure modules; PRD-OVL (OVL-040 `Dialog`, OVL-081 `Menu`); PRD-CTL (CTL-061); PRD-A11Y (A11Y-049 `LayerStack`); PRD-PKG (PKG-056 allowlist) |
| `PROMPT_11g_NAV_SOURCE_META_STORIES.md` | `SourceTransition`, per-component `*.meta.ts`, labels, NAV component story files (S-01..S-08), `app-frame` block content, showcase shell parts, docs readme | 73..76, 82, 83, 84; §13 | 20 (automated half), 22 (metadata) | NAV-092..107, NAV-144 | 11b..11f merged; PRD-MOT (MOT-045); PRD-SB (SB-048 preview, SB-071 story contract, SB-092/SB-106 deletions, SB-105/111/112 showcases); PRD-DATA (DATA-038 `Table`) for the `Saas` story; PRD-DX (DX-067, DX-070) |
| `PROMPT_11h_NAV_CERTIFY.md` | remote certification: layout/a11y/blur/forced-colors/contrast/motion/perf/canary lanes, budget calibration | 77..81 + all browser assertions of 03..72 | 01, 03..10, 14, 16, 17 | NAV-108..119 | 11a..11g merged; PRD-QA (QA-018, QA-056 L6, QA-049, QA-051, QA-076, QA-078, QA-086); PRD-PERF (PERF-039, PERF-044); PRD-PKG (PKG-048/049); PRD-DX (DX-094) |
| `PROMPT_11i_NAV_MIGRATE_REMOVE.md` | `app-shell-slots` transform and fixtures, `compat` adapters, `deprecations.json` entries, E-15 4.2 fix, removal PRs per family, manual lane | §9, §10, §11; 35 (workspace removal) | 18, 19, 20 (human review), 21, 22 | NAV-120..143, NAV-145 | 11h green; PRD-TRUST (TRUST-075); PRD-REL (REL-003, REL-010, REL-046, REL-070, REL-072, REL-082, REL-115); PRD-DX (DX-037, DX-041, DX-042, DX-065); PRD-MED (MED-119) |

Order: 11a → 11b → (11c ∥ 11d ∥ 11e ∥ 11f) → 11g → 11h → 11i. Within 11h, lanes may be re-run per family as each of 11c..11f lands. Only 11h's final run on the release SHA closes ACs.

## PRD key crosswalk (binding for every NAV prompt and `NAV.json`)

Cite PRDs by key (`PRD-<KEY>`, SC-01). `depends_on` holds only real task ids (`^(TRUST|…|QA)-\d{3}$`) that exist in `docs/auraglass-5/tasks/*.json` and point at the owner's anchor task (SC-40). It never holds `PRD-xx` strings. External gates go in the task's `gate` field.

| Key | §16 id | File in `docs/auraglass-5/prd/` | Anchors used by NAV |
|---|---|---|---|
| TRUST | PRD-00 | `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` | TRUST-075 |
| REL | PRD-01 (+ interim PRD-17 bridge) | `AURAGLASS_RELEASE_MIGRATION_PRD.md` | REL-003, REL-010, REL-046, REL-070, REL-072, REL-082, REL-115 |
| PKG | PRD-02 | `AURAGLASS_PACKAGING_BUILD_PRD.md` | PKG-005, PKG-048, PKG-049, PKG-056, PKG-105 |
| DS | PRD-03 | `AURAGLASS_DESIGN_SYSTEM_PRD.md` | DS-016, DS-024, DS-083 |
| MAT | PRD-04 (+ interim PRD-15) | `AURAGLASS_MATERIAL_ENGINE_PRD.md` | MAT-047, MAT-048, MAT-050, MAT-051 |
| A11Y | PRD-05 | `AURAGLASS_ACCESSIBILITY_PRD.md` | A11Y-027, A11Y-029, A11Y-049, A11Y-054, A11Y-073 |
| MOT | PRD-06 | `AURAGLASS_MOTION_PRD.md` | MOT-045, MOT-048 |
| PERF | none (policy) | `AURAGLASS_PERFORMANCE_PRD.md` | PERF-039, PERF-044 |
| FND | PRD-07 + PRD-14 + PRD-16 | `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` | FND-001, FND-005, FND-007, FND-047, FND-050 |
| CTL | PRD-08 | `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` | CTL-061, CTL-066, CTL-075 |
| OVL | PRD-09 | `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` | OVL-040, OVL-066, OVL-081, OVL-097, OVL-099 |
| DATA | PRD-11 | `AURAGLASS_DATA_PRD.md` | DATA-038 |
| MED | PRD-13 | `AURAGLASS_MEDIA_BACKDROPS_PRD.md` | MED-119 |
| DX | PRD-18 + PRD-20 | `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` | DX-037, DX-041, DX-042, DX-065, DX-067, DX-070, DX-094 |
| SB | Storybook/Lab half of PRD-19 | `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` | SB-048, SB-071, SB-092, SB-105, SB-106, SB-111, SB-112 |
| QA | PRD-19 | `AURAGLASS_QA_CERTIFICATION_PRD.md` | QA-003, QA-018, QA-038, QA-049, QA-051, QA-056, QA-076, QA-078, QA-086 |

Owner-tagged contracts (for example `ScrollEdge` `edgeStyle` REQ-MAT-10, `Dialog` REQ-OVL-60, the APG harness REQ-A11Y-40, class coverage PKG-105, `docs/size-budgets.json` PKG-048, root `deprecations.json` TRUST-075/REL-010, `.storybook/preview.tsx` SB-048) are consumed, never implemented here. NAV-owned shared artifacts: the SC-21 NAV attributes, `app-frame` block content, the `app-shell-workspace` item, the `app-shell-slots` transform, the shell blur budget and the `src/registry/recipes.ts` removal. If a prerequisite check fails, the prompt stops that task as BLOCKED with the check output. It never ships a local stand-in.

## Final report

Each sub-prompt emits its own report block. The orchestrator aggregates them into one table: `REQ-NAV-NN | task ids | test name | lane | PASS/FAIL/BLOCKED | CI run URL`, and `AC-NAV-NN | PASS/FAIL/BLOCKED | release SHA | artifact path`. AC-NAV-01..22 close only on the release SHA from 11h/11i artifacts (D-32). Open items O-01..O-10 (PRD §21) are reported with their owner and status.
