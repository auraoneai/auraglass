# PROMPT-10 (OVL): Flagship Overlays — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` (key **OVL**, self-id PRD-10, architecture §16 PRD-09; REQ-OVL-01..79, AC-OVL-01..20; open items in PRD §21). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-01..SC-40, binding over any older path or name in a prompt). Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-02, D-06, D-07, D-09, D-11, D-13, D-14, D-15, D-18, D-24..D-27, D-29, D-30, D-32; §4.4–4.7, §6–§10, §11.2 #15–21, §11.3, §12, §13, §14, §15). Task fragment: `docs/auraglass-5/tasks/OVL.json` (162 tasks, OVL-001..OVL-164; ids 018–019 are intentionally unused; every REQ-OVL id is covered by at least one task).

PRD-OVL has 79 requirements. They cover a 4.x patch line, a shared overlay layer, seven Base UI flagships, migration tooling inputs and certification. That is too much for one agent session, so the work is split into nine prompts. Each prompt restates the common rules and can run without the others in context.

| Prompt | Scope | REQ-OVL | AC-OVL | Tasks | Branch | Hard prerequisites (owner anchor tasks, SC-40) |
|---|---|---|---|---|---|---|
| `PROMPT_10a_OVL_4X_LINE.md` | REQ-OVL-70 privacy cut (4.1.1 only if TRUST accepts it per SC-36, otherwise 4.2); infinite-animation attribution; 4.2 forced colors, frame rate, notification CSS and feedback toast deletion; 4.2/4.3 deprecations | 05 (attribution), 70, 71, 72, 73, 74 | 05 (4.x half), 08 (4.2 half), 16 (4.x half), 18 | OVL-001..017 | `ovl/42-bridge`, `ovl/43-renames` → `release/4.x` (plus `ovl/411-cut` → TRUST `release/4.1.1` only after TRUST intake) | TRUST-075 (root `deprecations.json`); REL-010 schema, REL-070 generator, REL-072 `warnDeprecated`, REL-040 visual-class, REL-043 change-class |
| `PROMPT_10b_OVL_SHARED_LAYER.md` | `_shared/` modules, `.ag-scrim`, layer registration, the OVL lint rule, shared test harnesses, Playwright overlay projects registered in QA lanes | 01, 02, 04 (CSS), 06 (harness), 09, 10, 11, 12 (CSS), 14 (modules), 15 | 12 (rules), 02 (harness) | OVL-020..039 | `ovl/shared` → `main` | MAT-015/020/046/047; A11Y-029/049/051; FND-001/005/007; DS-026; PKG-015/086/089; QA-003/018/031/082/085 |
| `PROMPT_10c_OVL_DIALOG.md` | `Dialog` (overlays anchor OVL-040, pattern proof with CTL-055), `AlertDialog`, palette shell, perf story, `overlays-dialog-perf.spec.ts`, obscured-page decision | 03 (nested), 04, 05, 07, 08, 16–29, 60 | 01, 02, 03, 04, 05 (Dialog), 06–07 (Dialog parts), 20 | OVL-040..062 | `ovl/dialog` → `main` | 10b merged; PERF-039 (`run-perf.mjs`); CTL-055; A11Y-073 (APG harness); NAV-087 for OVL-061 |
| `PROMPT_10d_OVL_POPOVER_TOOLTIP.md` | `Popover` (+ `openOnHover`), `Tooltip`, anchored-popup contract test, STACK-02 | 14, 40–51 | 06 (2 widgets), 07 (STACK-02) | OVL-063..080 | `ovl/popover-tooltip` → `main` | 10c merged; PKG-048/049 (size rows) |
| `PROMPT_10e_OVL_MENU.md` | `Menu`, `ContextMenu`, `Menubar`, STACK-01 | 03, 52–58 | 06 (3 widgets), 07 (STACK-01) | OVL-081..096 | `ovl/menu` → `main` | 10d merged |
| `PROMPT_10f_OVL_SHEET.md` | `Sheet` (sides, action preset, detents, drag, full-height floor) | 30–39 | 06 (Sheet), 01/02 (Sheet) | OVL-097..112 | `ovl/sheet` → `main` | 10c merged; MOT-040 ticker + DS-053 springs; A11Y-029 announcer; MAT-047 |
| `PROMPT_10g_OVL_TOAST.md` | `Toast`, `useToast`, history, timers, STACK-03, side-effect entries, provider mount check | 61–68 | 06 (Toast), 07 (STACK-03), 19 | OVL-113..130 | `ovl/toast` → `main` | 10b merged; A11Y-029/049 (provider, toast layer); PKG-042 side-effect gate; MAT-048 |
| `PROMPT_10h_OVL_MIGRATION.md` | compat adapters, `.meta.ts` migration fields (mappings are generated), 4to5 fixtures, selector table generator, registry items, the `overlay-flows` block content, removed-name entries | 24 (compat), 28, 45 (compat), 59, 69, 76, 78, 79 | 16, 17 | OVL-131..146, OVL-164 | `ovl/migration` → `main` | 10c–10g merged; DX-041/042/043 (engine, catalogue, mappings); DX-065 compat index; DX-067/076/078 registry; REL-070/072/115 |
| `PROMPT_10i_OVL_CERTIFY_DELETE.md` | cross-engine a11y modes + axe, contrast/pixel subjects, matrix stories, RTL/390, SSR canaries, manual matrix, perf grades and budget calibration, L1 Static, 5.0 deletions, API freeze, consumer re-verification | 12, 13, 77, deletions (§9), DoD | 05, 08, 09, 10, 11, 12, 13, 14, 15 | OVL-147..163 | `ovl/certify`, then one `ovl/delete-<family>` PR per family → `main` | 10a–10h merged; QA-018/031/049/086 (lanes, OCR, canaries); SB-060 Lab frame; FND-103 consumer-grep; REL-003 api-report; DX-104 docs |

Order: 10a can start now on the 4.x line. Then 10b → 10c (the alpha gate, built jointly with the FND Base UI pattern proof) → 10d → 10e. Once 10c is merged, 10f and 10g can run in parallel with 10d/10e. 10h runs after all flagships, and 10i runs last (RC).

## PRD key crosswalk (SC-01, binding for every sub-prompt)

PRD prose cites architecture §16 numbers. Task `depends_on` holds **only real task ids** (SC-40 rule 1). It never holds `PRD-xx` strings. External gates go in the task's `gate` field.

| Key | File | Self-id | §16 boundary (as cited in PRD-OVL) | Anchor tasks |
|---|---|---|---|---|
| TRUST | `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` | PRD-00 | PRD-00 | TRUST-075, TRUST-077 |
| REL | `AURAGLASS_RELEASE_MIGRATION_PRD.md` | PRD-01 | PRD-01, interim PRD-17 (bridge) | REL-010, REL-040, REL-043, REL-070, REL-072, REL-115, REL-003 |
| PKG | `AURAGLASS_PACKAGING_BUILD_PRD.md` | PRD-02 | PRD-02 | PKG-005, PKG-015, PKG-042, PKG-048/049, PKG-086/089 |
| DS | `AURAGLASS_DESIGN_SYSTEM_PRD.md` | PRD-03 | PRD-03 | DS-016, DS-026, DS-053 |
| MAT | `AURAGLASS_MATERIAL_ENGINE_PRD.md` | PRD-04 | PRD-04 | MAT-015, MAT-046, MAT-047, MAT-048 |
| A11Y | `AURAGLASS_ACCESSIBILITY_PRD.md` | PRD-05 | PRD-05 | A11Y-029, A11Y-049, A11Y-051, A11Y-073 |
| MOT | `AURAGLASS_MOTION_PRD.md` | PRD-06 | PRD-06 | MOT-040 |
| PERF | `AURAGLASS_PERFORMANCE_PRD.md` | PRD-07 (collides) | perf policy | PERF-039 |
| FND | `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` | PRD-08 (collides) | PRD-07, PRD-14, PRD-16 | FND-001, FND-005, FND-007, FND-103 |
| CTL | `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` | PRD-09 | PRD-08 | CTL-055 |
| NAV | `AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` | PRD-11 | PRD-10 ("PRD-NAV") | NAV-087 |
| DATA | `AURAGLASS_DATA_PRD.md` | PRD-12 | PRD-11 | — |
| AI | `AURAGLASS_AI_PRD.md` | PRD-13 | PRD-12 | — |
| MED | `AURAGLASS_MEDIA_BACKDROPS_PRD.md` | PRD-14 | PRD-13 | — |
| DX | `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` | PRD-16 (collides) | PRD-18, PRD-20 | DX-041/042/043, DX-065, DX-067, DX-076, DX-078, DX-104 |
| SB | `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` | PRD-17 (collides) | Storybook/Lab half of PRD-19 | SB-048, SB-060 |
| QA | `AURAGLASS_QA_CERTIFICATION_PRD.md` | PRD-18 (collides) | PRD-19 (lanes) | QA-003, QA-018, QA-031, QA-049, QA-082, QA-085, QA-086 |

## File layout (binding for every sub-prompt; PRD-OVL §8 now matches)
- One directory per flagship (FND §4.1): `src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/`. Each holds:
  - `<Name>.client.tsx`: every interactive part, with a `"use client"` directive.
  - `<Name>Layout.tsx`: Header/Body/Footer, with no directive.
  - `<Name>.css`: starts with `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;`. Rules go in `ag.components`, with zero `!important` (SC-20).
  - `<Name>.meta.ts` (SC-27).
  - `index.ts`.
  - `<Name>.test.tsx` and `<Name>.stories.tsx`.
- `OVL-040` is the only CREATE of `Dialog.client.tsx`. OVL-041..044 are MODIFY (OV-32).
- Shared internals: `src/components/overlays/_shared/`. "Overlay file" means `src/components/{overlays/_shared,dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/**`.
- Browser specs (SC-30):
  - APG: `tests/a11y/apg/<kebab>.apg.spec.ts`, on the A11Y-073 harness. OVL-053 owns the dialog spec.
  - Non-APG behaviour: `tests/e2e/overlays/*.spec.ts`.
  - Perf: `tests/perf/browser/overlays-<name>.spec.ts`, via PERF-039 `run-perf.mjs`.
  - Runtime budgets are rows in `tests/perf/harness/budgets.json` (PERF). Byte budgets are rows in `docs/size-budgets.json` (PKG-048), gated by `scripts/ci/verify-size-budgets.mjs`. There is no size-limit.
- Lanes are cited by SC-29 ids (L1 Static … L14 Human visual review). There is no overlay-specific workflow: overlay specs register in QA's `certify-pr.yml` lanes (OVL-037).
- Foundation helpers:
  - `usePortalContainer()` from `src/foundation/portal.ts` (FND-007; SC-25).
  - `ChangeDetails` from `src/foundation/types.ts`. `OverlayOpenChangeDetails` narrows `reason` to the REQ-OVL-17 union.
  - `AG_PARTS` from `src/foundation/parts.ts` (FND-005).
- Some parts have no `AG_PARTS` value: `Sheet.Action`, `Menu.Shortcut`, `Toast.Progress`, `Toast.History` and `Toast.HistoryItem`. The owning prompt requests these values from FND: `action`, `shortcut`, `progress`, `history`, `history-item`. The task stays blocked until FND extends the vocabulary.
- Deprecations: add entries to the repo-root `deprecations.json` (`version: 1`; schema REL-010; seeded by TRUST-075) by MODIFY, and warn through REL-072 `warnDeprecated(id)`.
- Codemods: `packages/cli/src/migrate/4to5/` (SC-33). Fixtures go in `__fixtures__/<id>/overlays-<case>/`. `mappings/*.json` are generated by REL-070/DX-043 and never hand-edited. The marker is `TODO(aura-glass 5)`.
- Lint: OVL owns only `auraglass/no-overlay-global-listeners`. Render purity is PKG's `auraglass/no-random-in-render` (SC-16).

## Cross-PRD decisions (resolved by the contracts; file open items, never stub)
1. Escape: `LayerStack` (A11Y-049) is the only Escape, `inert` and scroll-lock dispatcher. FND-007's wrapper routes Base UI dismissal through it (SC-25).
2. Scrim ownership: `Dialog.Backdrop` is PRD-MAT's REQ-MAT-28 scrim sibling and takes MAT scrim tokens. `overlays.css` adds no second blur. If MAT CSS generates its own pseudo-element scrim, stop and file the conflict (10b, OVL-023).
3. Toast blur: PRD-OVL REQ-OVL-66 (one shared `SurfaceGroup`) is stricter than PERF's "≤3 toasts blurred", so it wins. Record a deviation note to PERF (10g, OVL-119).
4. Perf spec overlap: PERF owns `tests/perf/browser/overlay-cost.spec.ts` (REQ-PERF-18). OVL owns `tests/perf/browser/overlays-*.spec.ts`. Neither duplicates the other's assertions.
5. Provider additions: SC-21 gives `data-ag-obscured` and the `toasts`/`tooltips` opt-outs to A11Y. Until A11Y lands them, OVL-058 and OVL-130 are blocked (PRD §21 O-1). The `[data-ag-obscured]` rule lives in MAT's `material.css` (`ag.material`) and needs MAT review (O-8).

## Common rules (each sub-prompt restates them)
- These run remotely: browser, visual, perf and a11y-mode tests, Storybook builds, full `npm run build`, and size measurement. Use GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never use local Docker. Never run a local Playwright browser.
- Don't fake completion:
  - No `jest.mock` of `@base-ui/react`, of a flagship or of `AuraGlassProvider`.
  - No `test.skip`, `.only`, `fixme` or `it.todo`.
  - No lowered or loosened thresholds or budgets: ratchet down only (D-26).
  - No `-u`/`--update-snapshots`.
  - No placeholder components that render `null` or a `div` to satisfy a test.
- Evidence is CI artifacts keyed to the SHA, never committed (D-32).

Final report: each sub-prompt defines its own. The orchestrator merges them into one AC-OVL-01..20 table with CI artifact links.
