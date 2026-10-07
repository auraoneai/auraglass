# PROMPT-09 (CTL): Flagship Controls and Inputs — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` (key **CTL**, `PRD-CTL`; self-id alias PRD-09; architecture §16 PRD-08; REQ-CTL-01..19, 20..28, 30..36, 40..46, 50..55, 60..66, 70..75, 80..84, 90..98, 100..104, 110..116, 120..129, 130..134, 150..154, 160..167, 170..177; AC-CTL-01..20; open items §21 O-01..O-11). Binding contract registry: `docs/auraglass-5/prd/_shared-contracts.md` (SC-01..SC-40; a registry row wins over any PRD or prompt text). Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-02, D-04..D-09, D-11..D-15, D-18, D-24..D-29, D-32; §4, §6..§10, §11.2 rows 1–14, §11.3, §12, §14, §15, §16). Task fragment: `docs/auraglass-5/tasks/CTL.json` (CTL-001..CTL-162). Every `depends_on` entry is a real task id (SC-40); cross-PRD dependencies point at the owner's anchor task, never at a PRD id.

PRD-CTL specifies 13 implemented flagship families, a shared field shell, 123 requirements, 30+ named suites, 40 compat adapters and the 4.x deletions. That does not fit one agent session, so it is split into six prompts. Each one is independently executable and restates the common rules.

| Prompt | Scope | REQ IDs | AC IDs | Tasks | Hard prerequisites (owner anchor tasks) |
|---|---|---|---|---|---|
| `PROMPT_09a_CTL_SHARED_FIELD.md` | entry gate (Base UI parts check), `control-shared/`, `Field`/`Fieldset`, family fixture registry, the seven cross-family jsdom suites, selector-table run (DX-105), lint/jest/CI wiring by MODIFY | 01–17, 90, 93, 94, 95 (shell), 96, 172 (shell), 174 (strings) | AC-CTL-02, 04, 05, 12 (harness), 20 | CTL-001..028 | FND-001/003 pin, FND-004 types, FND-005 parts, FND-007 `usePortalContainer`; MAT-046/047 `materialProps`/`Surface`; DS-016/024 tokens; A11Y-029 provider, A11Y-065 hit-area span; PKG-015 lint wiring; QA-003 jest config |
| `PROMPT_09b_CTL_CONTENT_CONTROLS.md` | Wave A: Checkbox/CheckboxGroup, RadioGroup/Radio, Switch, TextField | 50–55, 70–75, 80–84, 91–98, 160, 165, 167 | AC-CTL-03/04 (wave A rows), 06 (checkbox, radio-group, switch) | CTL-029..054 | 09a merged; A11Y-073 APG harness; QA-018 cert Playwright config; SB-073 matrix |
| `PROMPT_09c_CTL_CHROME_CONTROLS.md` | Wave B: Button (full API, SC-24 grammar; CTL-055 is the SC-40 pattern-proof anchor), IconButton, ButtonGroup/Toolbar/ToggleGroup, SearchField, SegmentedControl | 20–28, 30–36, 40–46, 100–104, 163, 164 | AC-CTL-03/04 (wave B rows), 06 (button, toolbar, segmented-control, search-field) | CTL-055..088 | 09a merged; MOT-047 VT optics drop; OVL-081 `Menu` (REQ-CTL-163 only) |
| `PROMPT_09d_CTL_COMPLEX_CONTROLS.md` | Wave C: Slider, NumberField, Select, Combobox (virtualization, autocomplete, `loadOptions`, creatable) | 60–66, 110–116, 120–134, 161, 162, 166 | AC-CTL-03/04 (wave C rows), 06 (slider, number-field, select, combobox) | CTL-089..120 | 09a merged; A11Y-049 `LayerStack` + A11Y-054 announcer; FND-007; MOT-040 ticker; PKG-056 allowlist with `@tanstack/react-virtual` |
| `PROMPT_09e_CTL_LANES_BUDGETS.md` | remote cross-family suites (axe, focus, sizing, overlay stack, motion, visual matrix, engine, nesting, perf), size-budget rows + calibration, Storybook test runner, flagship-14 contract case, human/manual review requests | 05, 06, 09–12, 28, 33, 95 (contrast), 102, 150–152, 154, 161, 162, 167, 170–177; §16 | AC-CTL-01 (date half), 07, 08, 09, 10, 11, 13, 14, 17, 18, 19 | CTL-121..139 | 09b–09d merged; QA-018/031/038/039/086/123; A11Y-078 axe runner, A11Y-084/085 manual schema + template; PERF-039 harness, PERF-002 ceilings; PKG-048/049 size budgets; OVL-040 Dialog; DATA-094/096 date |
| `PROMPT_09f_CTL_COMPAT_REMOVAL_CERT.md` | 40 compat adapters (`src/compat/controls/<OldName>.tsx`), `migration` meta fields, codemod fixtures handoff, `deprecations.json` entries, 4.2 shimmer verification, root export swap, per-group 4.x deletion, RC certification sweep | 18, 19, 153, §9, §10, §11; final sweep of all | AC-CTL-01, 15, 16, 20 + recording all AC-CTL-01..20 | CTL-140..162 | 09a–09e merged; DX-065 `src/compat/index.ts`, DX-041/053 codemod engine + fixture runner, DX-077/078/079 blocks; REL-010/070/072 deprecations schema, generator, `warnDeprecated`; TRUST-075 root `deprecations.json`; MOT-009 + REL-090 shimmer; NAV-025; REL-125 4.3 gate for removals |

Order: 09a → 09b → 09c → 09d (09b/09c/09d may run in parallel once 09a is merged, each on its own branch, because their directories don't overlap; root `src/index.ts` edits must be rebased one at a time) → 09e → 09f. The 09f removal tasks wait for the 4.3 deprecations to be published (REL-125 gate); its final certification sweep (CTL-162) runs last on one RC SHA.

## Key crosswalk (SC-01; the PRD cites architecture §16 numbers)
| §16 boundary | Key | File | Self-id alias |
|---|---|---|---|
| PRD-00 | TRUST | `prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` | PRD-00 |
| PRD-01 (+ interim PRD-17 bridge, SC-37) | REL | `prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` | PRD-01 |
| PRD-02 | PKG | `prd/AURAGLASS_PACKAGING_BUILD_PRD.md` | PRD-02 |
| PRD-03 | DS | `prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` | PRD-03 |
| PRD-04 (+ interim PRD-15 enhanced tier) | MAT | `prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` | PRD-04 |
| PRD-05 | A11Y | `prd/AURAGLASS_ACCESSIBILITY_PRD.md` | PRD-05 |
| PRD-06 | MOT | `prd/AURAGLASS_MOTION_PRD.md` | PRD-06 |
| perf policy | PERF | `prd/AURAGLASS_PERFORMANCE_PRD.md` | PRD-07 (collides) |
| PRD-07 + PRD-14 + PRD-16 | FND | `prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` | PRD-08 (collides) |
| PRD-08 | CTL | this PRD | PRD-09 |
| PRD-09 | OVL | `prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` | PRD-10 |
| PRD-10 | NAV | `prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` | PRD-11 |
| PRD-11 | DATA | `prd/AURAGLASS_DATA_PRD.md` | PRD-12 |
| PRD-18 + PRD-20 | DX | `prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` | PRD-16 (collides) |
| PRD-19 (Storybook/Lab half) | SB | `prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` | PRD-17 (collides) |
| PRD-19 (certification infra) | QA | `prd/AURAGLASS_QA_CERTIFICATION_PRD.md` | PRD-18 (collides) |

## Registry contracts applied by all sub-prompts
1. **Branch.** All 5.0 work targets `main` (REL fixes `main` → 5.x, `next` is a dist-tag only). 4.x items (deprecations, shimmer verification) target `release/4.x` through their owners.
2. **Prop grammar (SC-24).** Material axis is `variant: regular|clear|identity` (default `regular`); `prominent` is the accent; status is `intent` (`neutral|danger` on Button/IconButton); no `material`, `elevation` or `as` prop; styling hook `data-ag-intent` replaces `data-ag-button-variant` (SC-21). The Button break awaits human confirmation (PRD §21 O-02); implement it as written.
3. **Size budgets (SC-15).** §16 rows go into PKG's `docs/size-budgets.json` (PKG-048) by MODIFY, checked by `scripts/ci/verify-size-budgets.mjs` (PKG-049); runtime rows go into PERF's `tests/perf/harness/budgets.json`. No `tests/size/`, no `size-limit`.
4. **Test layout (SC-30).** APG specs are `tests/a11y/apg/<kebab>.apg.spec.ts` on A11Y's harness (A11Y-073), owned by CTL; perf specs are `tests/perf/browser/controls-*.spec.ts` on PERF-039; axe uses A11Y's `tests/a11y/browser/axe.spec.ts` runner (A11Y-078).
5. **Lanes and configs (SC-29).** Cite lanes as L1..L14. `jest.config.js`, `playwright.config.ts` and `certification/playwright.cert.config.ts` are QA's: MODIFY only, depending on QA-003/QA-018. No controls-specific workflow.
6. **Scenes (SC-28).** `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`. `controls-dense-form` is an InContext story, not a scene.
7. **Migration (SC-02/03/33/34).** Mapping data lives only in each `<Name>.meta.ts` `migration` field (plus `selectorChanges`, rendered by DX-105); fixtures go to `packages/cli/src/migrate/4to5/__fixtures__/{canonical-names,prop-grammar}/controls-<kebab>/`; marker `// TODO(aura-glass 5): <reason>, see <doc>`; adapters are `src/compat/controls/<OldName>.tsx` calling `warnDeprecated(id)` (REL-072); entries go to the repo-root `deprecations.json` (TRUST-075 instance, REL-010 schema) through REL-070.
8. **Portals and Escape (SC-25).** `container={usePortalContainer()}` (FND-007); `LayerStack` (A11Y-049) is the only Escape dispatcher.
9. **Stories (SC-31).** CTL owns `src/components/<kebab>/<Name>.stories.tsx` (CTL-059 owns `Button.stories.tsx`); SB owns `.storybook/**`. Do not edit `.storybook/preview.tsx`.
10. **Scripts (SC-11).** No `scripts/controls/`, `scripts/lib/` or `scripts/api/`; `scripts/audit/` is never a required check.
11. **4.2 shimmer (SC-36).** Deferred from 4.1.1 to 4.2; MOT-009 edits `GlassSwitch.tsx`, REL adds the D-28 entry, CTL-154 only verifies.
12. **Directories.** PRD §8 puts `Fieldset` in `field/` and `ToggleGroup` in `toolbar/`; Field family and ToggleGroup ownership is CTL's (SC-38).
13. PRD-internal deviations stay as written: §4.4 (flagship 14 contract only), REQ-CTL-40 (SegmentedControl on `RadioGroup`, SC-38 / erratum E-08).

## Common rules (each sub-prompt restates them in full)
- Browser, visual, axe, motion, perf, Storybook build/test-runner, full `npm run build` and `npm pack` checks run remotely: GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner through the `auraone-remote-run` skill (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` first). Never local Docker, never a local browser.
- No fake completion: no mocked Base UI parts, no placeholder components, no `.skip`/`.only`/`.todo`/`xit`/`test.fixme`, no lowered thresholds, no `-u`/`--update-snapshots`, no unapproved baselines, no `eslint-disable` in `$CONTROLS`, no agent-reviewed screenshot counted as human review. A lane that does not run counts as failed.
- If an owner anchor task has not landed, stop that task and report the anchor id; never build the owner's artifact here.
- Don't revert unrelated working-tree changes (at authoring time `scripts/ci/verify-pack.js`, `scripts/ci/run-{next,vite}-integration.js`, `reports/3.2-release/vite-integration.json` were modified).

Final report: each sub-prompt defines its own. The orchestrator merges them into one AC-CTL-01..20 table that links CI artifacts (D-32: evidence is CI artifacts, not committed reports).
