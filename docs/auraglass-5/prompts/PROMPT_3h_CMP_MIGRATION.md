# PROMPT-3h (CMP lane M): Migration and registry

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **M**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3h-M"` (26 tasks: CMP-322..346, 426).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside CMP):** `src/compat/cmp/**`, `fragments/{deprecations,codemods}/cmp*` (deprecations on `release/4.x` via `4x-cmp/*`), `tests/fixtures/consumer-4x/cases/cmp/**`, `registry/{blocks/overlay-flows,items/account-menu,items/confirm-dialog}/**`, `stories/cmp/migration/**`

**Order inside the lane:** day 0: 4.2 `DEP-C` entries on `release/4.x` (removed props and REMOVE/DEPRECATE names) and the frozen 4.x cases; then 4.3 rename entries; codemod mappings and fixtures per family as each family's API is written (from the §10.2 tables, which do not wait for the component); adapters as each target becomes real; registry content last

**Requirements closed by this lane:** REQ-CMP-22, REQ-CMP-35, REQ-CMP-131, REQ-CMP-132, REQ-CMP-133, REQ-CMP-134, REQ-CMP-135, REQ-CMP-140.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-m -b next-cmp/m-<topic> origin/next
# release/4.x work in this lane (CMP-333, CMP-334, CMP-335, CMP-336, CMP-426): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-m-4x -b 4x-cmp/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3h-M") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-322 | TEST | `NEW:fragments/codemods/cmp/fixtures/canonical-names/fnd-*/` | SC-33: for every 4.x name absorbed by an owned component (appendix rows targeting it), fill the migration table in that component's meta.ts and add {input,output}.tsx … |  | REQ-CMP-22 |
| CMP-323 | CREATE | `NEW:src/compat/cmp/controls/{GlassButton,Button,EnhancedGlassButton,RippleButton,GlassLin …` | Compat adapters (9): GlassButton, Button (4.x alias of GlassButton), EnhancedGlassButton, RippleButton, GlassLinkButton, ToggleButton, MagneticButton, GlassFab, … |  | REQ-CMP-131, REQ-CMP-35 |
| CMP-324 | CREATE | `NEW:src/compat/cmp/controls/GlassIconButton.tsx` | Compat adapters (1): GlassIconButton. Each maps props from packages/cli/src/migrate/4to5/mappings/props.json (one table, two consumers, REQ-DX-41), calls … |  | REQ-CMP-131 |
| CMP-325 | CREATE | `NEW:src/compat/cmp/controls/{LiquidGlassControlGroup,LiquidGlassToolbar,GlassToolbar,Togg …` | Compat adapters (8): LiquidGlassControlGroup, LiquidGlassToolbar, GlassToolbar, ToggleButtonGroup, GlassToggle, GlassCommandBar, LiquidGlassMapControls, GlassActionBar. … |  | REQ-CMP-131 |
| CMP-326 | CREATE | `NEW:src/compat/cmp/controls/{GlassSegmentedControl,LiquidGlassSegmentedControl}.tsx` | Compat adapters (2): GlassSegmentedControl, LiquidGlassSegmentedControl. Each maps props from packages/cli/src/migrate/4to5/mappings/props.json (one table, two … |  | REQ-CMP-131 |
| CMP-327 | CREATE | `NEW:src/compat/cmp/controls/{GlassSwitch,GlassSlider,GlassCheckbox,GlassCheckboxGroup,Gla …` | Compat adapters (5): GlassSwitch, GlassSlider, GlassCheckbox, GlassCheckboxGroup, GlassRadioGroup. Each maps props from … |  | REQ-CMP-131 |
| CMP-328 | CREATE | `NEW:src/compat/cmp/controls/{GlassInput,GlassTextarea,GlassFieldGroup,GlassValidationMess …` | Compat adapters (5): GlassInput, GlassTextarea, GlassFieldGroup, GlassValidationMessage, GlassFormField. Each maps props from … |  | REQ-CMP-131 |
| CMP-329 | CREATE | `NEW:src/compat/cmp/controls/{LiquidGlassSearchField,GlassSearchField,GlassSearchInterface …` | Compat adapters (4): LiquidGlassSearchField, GlassSearchField, GlassSearchInterface, GlassIntelligentSearch. Each maps props from … |  | REQ-CMP-131 |
| CMP-330 | CREATE | `NEW:src/compat/cmp/controls/{GlassSelectCompound,GlassSelect}.tsx` | Compat adapters (2): GlassSelectCompound (GlassSelectRoot/Trigger/Content/Item/Value/Label/Group/Separator/ScrollUp/ScrollDown parts), GlassSelect. Each maps props from … |  | REQ-CMP-131 |
| CMP-331 | CREATE | `NEW:src/compat/cmp/controls/{GlassCombobox,GlassMultiSelect,GlassTagInput,GlassMentionLis …` | Compat adapters (4): GlassCombobox, GlassMultiSelect, GlassTagInput, GlassMentionList. Each maps props from packages/cli/src/migrate/4to5/mappings/props.json (one … |  | REQ-CMP-131 |
| CMP-332 | TEST | `NEW:fragments/codemods/cmp/fixtures/{canonical-names,prop-grammar}/controls/` | Input/output fixture pairs for each of the 40 names for canonical-names and prop-grammar (path per DX §507 convention; PRD §5.1 path "__fixtures__/controls/" mapped to … |  | REQ-CMP-133, REQ-CMP-134 |
| CMP-333 | MODIFY | `fragments/deprecations/cmp.ts` | PR to release/4.x adding, through REL's scripts/release/gen-deprecations.mjs (REL-070), entries valid against docs/schemas/deprecations.schema.json (REL-010; envelope … |  | REQ-CMP-132 |
| CMP-334 | MODIFY | `fragments/deprecations/cmp.ts` | 4.2 C-D entries (since 4.2.0, removeIn 5.0.0) per REQ-OVL-73: GlassModal props consciousness, predictive, adaptive, eyeTracking, trackAchievements, isContained, … |  | REQ-CMP-132 |
| CMP-335 | MODIFY | `fragments/deprecations/cmp.ts` | 4.3 rename C-D entries (kind export) for every §2.4 name with a 5.0 successor (GlassModal→Dialog/AlertDialog, GlassDialog→Dialog, … | CMP-334 | REQ-CMP-132 |
| CMP-336 | MODIFY | `fragments/deprecations/cmp.ts` | Removed-name entries with codemod id `removed` (SC-33): GlassAchievementNotifications (TODO(aura-glass 5) → toast()), GlassTransitions.GlassModal (TODO → Dialog), … | CMP-335 | REQ-CMP-133 |
| CMP-337 | CREATE | `NEW:src/compat/cmp/overlays/GlassModal.tsx` | Adapters GlassModal and NEW src/compat/overlays/GlassDialog.tsx: open+onClose → onOpenChange (if !o onClose()); title/description/footer → parts; role=alertdialog → … |  | REQ-CMP-131 |
| CMP-338 | CREATE | `NEW:src/compat/cmp/overlays/GlassDrawer.tsx` | Adapters GlassDrawer, GlassBottomSheet, GlassActionSheet, LiquidGlassAdaptiveSheet (one file each under src/compat/overlays/): position/placement → side; snap props → … |  | REQ-CMP-131 |
| CMP-339 | CREATE | `NEW:src/compat/cmp/overlays/GlassPopover.tsx` | Adapters GlassPopover (placement 'bottom-start' → side bottom align start; trigger hover → openOnHover), GlassHoverCard (→ Popover openOnHover), GlassTooltip (content → … |  | REQ-CMP-131 |
| CMP-340 | CREATE | `NEW:src/compat/cmp/overlays/GlassDropdownMenu.tsx` | Adapters: all GlassDropdownMenu* parts 1:1 per §10.2 (Content side/align/sideOffset → Positioner; asChild → render); GlassContextMenu → ContextMenu; GlassMenubar → … |  | REQ-CMP-131 |
| CMP-341 | CREATE | `NEW:src/compat/cmp/overlays/GlassToast.tsx` | Adapters GlassToast, GlassToastProvider, GlassToastViewport, useToast (type→intent, error→danger; onClose/onDismiss(id) → onOpenChange/dismiss(id); position value … |  | REQ-CMP-131 |
| CMP-342 | TEST | `NEW:src/compat/cmp/overlays/__tests__/GlassModal.compat.test.tsx` | One *.compat.test.tsx per adapter file in src/compat/overlays/__tests__/: renders the real 5.0 component (data-ag-part root + data-ag-overlay kind present), one … | CMP-337, CMP-338, CMP-339, CMP-340, CMP-341 | REQ-CMP-131 |
| CMP-343 | TEST | `NEW:fragments/codemods/cmp/fixtures/{canonical-names,prop-grammar,providers,removed,impor …` | Hand-written input.tsx/output.tsx per §2.4 name plus cases backdrop-click (TODO on tests clicking role=dialog), on-close-semantics (wrapped callback + … | CMP-336 | REQ-CMP-134, REQ-CMP-22 |
| CMP-344 | CREATE | `NEW:registry/items/confirm-dialog/` | Registry item confirm-dialog built on AlertDialog (variants destructive, neutral) replacing 4.x modal confirm variants; no root export (D-15, D-17). (Cross-lane input … |  | REQ-CMP-140 |
| CMP-345 | CREATE | `NEW:registry/items/account-menu/` | Registry item account-menu built on Menu, replacing HeaderUserMenu. (Cross-lane input 3e-O1 is consumed through its frozen interface, never waited for.) |  | REQ-CMP-133, REQ-CMP-140 |
| CMP-346 | MODIFY | `registry/blocks/overlay-flows/` | Author the content of the GA block overlay-flows (SC-32: content owner OVL; DX-076 scaffolds and registers it). It covers confirm-delete AlertDialog, edit Dialog with … |  | REQ-CMP-140 |
| CMP-426 | TEST | `NEW:tests/fixtures/consumer-4x/cases/cmp/` | On release/4.x (branch 4x-cmp/*): author the CMP subset of real 4.x usage (GlassButton, GlassInput, GlassSelectCompound, GlassSwitch, GlassCheckbox, GlassModal, … |  | REQ-CMP-135 |

## Contract seams this lane consumes

S-12, S-13, S-30, S-31, S-32, S-33, S-34, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-41, S-46. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE M REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
