# FIN-E — Core components leftovers (CMP, PRD §5.5) — status 2026-10-10

Refs checked: origin/next e5a2d6835, release/4.x 645735fce, release/4.1.x a19f4bbe1.
Scope: REQ-FIN-70..76 = 129 original REQ-CMP rows (Appendix A.3, WP = FIN-E).

## Bottom line

- No FIN-E REQ-FIN is done. **0 of 7 REQ-FIN** and **0 of 129 original REQs** are fully on any release line.
- One PR per original REQ exists (#200–#337, plus 4.x #228/#313): 129 FIN-E PRs, all OPEN, all single-commit, none draft, none stacked. Every branch is based on 84a3b94f1, so each is 30 commits behind next.
- **0 status checks on any PR.** GitLab 87152036 still has 0 pipelines, so none of the remote Playwright, APG, perf or visual specs these PRs add has ever run.
- 35 of the FIN-E PRs are CONFLICTING/DIRTY and the other 94 are MERGEABLE/CLEAN. Counting the 9 FIN-A-mapped CMP PRs too, it is 40 conflicting out of 138.
- Partial landing via merged #369 (direct commits on next): REQ-CMP-31 `src/forms/{index,FormField,useFormField}.ts` (no `tests/controls/forms.test.tsx`) and REQ-CMP-59 `Fieldset = Object.assign(FieldsetRoot,{Root})` (stories, compat, tests and 4.x DEP-C0028 not done). #369 also landed the provider self-adoption fix that #317, #320 and #325 duplicate. These overlaps are why #200, #227, #317 and #325 now conflict.
- Original REQs with no PR: REQ-CMP-27. Its remaining work is CI only: stacked-escape APG green on 3 engines. Related jest/remote legs are in #249 and #326, which are FIN-A-mapped.
- Missing from every PR: `tests/types/cmp-contract.test-d.ts`, which is the AC-FIN-74 gate. It is not on next or 4.x either. #317 stops reading `tests/foundation/contract-coverage.json` but does not delete it, even though the PRD says to delete it.

## REQ-FIN table

| REQ-FIN | Orig rows | Status | PRs (C = conflicting) | Why not done |
|---|---|---|---|---|
| 70 Foundation contract | 19 (CMP-01..08,10,13..18,20..22,24) | (b) open only | 315, 316, 317C, 318, 319, 320C, 321, 322C, 311 (CMP-10 job), 324, 327, 328, 329, 330, 331C, 333, 334C, 335, 337C | 6 conflict. No CI: CMP-10/15/16/17/21 need pipelines (C). CMP-03 does not delete contract-coverage.json. CMP-06 CC-CMP-01 parts need OD-16. CMP-24 #337 duplicates #242's tanstack→windowed rewrite of ComboboxVirtualList. |
| 71 Primitives/icons/forms | 4 (CMP-27,28,30,31) | (b) partial | 279C, 281, 200C (forms partly on next via #369; also duplicated by #310 and #336) | CMP-27 has no PR and needs a CI run on 3 engines (plus REQ-FIN-07 #122). CMP-28 conflicts (deprecations.json/generated). CMP-31 conflicts with the forms barrel already on next. |
| 72 Buttons/toolbars/toggles/segmented | 12 (CMP-32,33,35..44) | (b) open only | 201, 202, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213 | All are MERGEABLE but none has been merged and none has CI. APG and L6 legs are remote-only. 210/211/213 all edit SegmentedControl.client.tsx/.css, and SegmentedControl.css also changed on next. |
| 73 Form controls | 32 (CMP-45..57,59..77) | (b) open only | 214C, 215, 216, 217, 218, 219, 220, 221, 222, 223C, 224, 225, 226, 227C, 228 (4.x), 229, 230C, 231, 232, 233, 234, 235, 236C, 237C, 238, 239, 240, 241, 242, 243C, 244, 245, 246 | 7 conflict. CMP-72 needs owner OD-15 (#242 picked owned windowed list). #239 notes a BU-side follow-up. #228 (DEP-C0028) duplicates a row that #313 also adds to the same 4.x file. CMP-47 is CI-gated. |
| 74 Overlays | 30 (CMP-79,81..86,88..110) | (b) open only | 248C, 250, 251, 252, 253, 254C, 255, 256, 257, 258, 259, 260, 261, 262C, 263, 264C, 265, 266, 267, 268, 269, 270, 271, 272C, 273, 274, 275, 276, 277C, 278 | 6 conflict. AC-FIN-74 type test (cmp-contract.test-d.ts) is missing everywhere. #255 left `modal='trap-focus'` undecided (OD-16). #260 kept SheetSide left/right pending owner. #250's exact counts depend on FIN-A #247/#249. CMP-81/90/96/98/101 are CI-gated. 13 PRs edit Sheet.client.tsx, 12 edit Toast.client.tsx and 12 edit Dialog.client.tsx. |
| 75 Content/core | 20 (CMP-111..130) | (b) open only | 282C, 283C, 284, 285C, 286, 287C, 288C, 289, 290, 291, 292, 293, 294C, 295, 296, 297, 298C, 299C, 300, 301 | 8 conflict. #279, 282, 283, 285, 288 and 298 each regenerate deprecations.json, src/internal/deprecations.generated.ts and fragments/deprecations/cmp.ts, so only one of them can merge cleanly. CMP-130 is remote-only (#301). |
| 76 Compat/fragments/registry/changesets/CI | 12 (CMP-131..142) | (b) open only | 302C, 303, 304, 305, 306, 307, 308C, 309C, 310C, 311, 312C, 313 (4.x), 314C | 6 conflict. CMP-132 is a pair (#313 on 4.x, #314 on next) that bypasses the 4.x→next sync design (REQ-FIN-13 #125). #304 adds 122 pending fixtures. #305 and #306 rows are provisional (D-26). #311 sets selectors to allow_failure until first green. CMP-135/136/137/138 need CI. |

## Original REQ counts (129)

- Fully merged: 0.
- Open PR only: 128. 31 and 59 are partly on next via #369.
- No PR: 1 (REQ-CMP-27, CI execution only).
- Needs breakdown from Appendix A: rows marked C are blocked on GitLab pipelines even after their PR merges.

## Merge problems

1. **Shared generated deprecation files.** fragments/deprecations/cmp.ts, deprecations.json and src/internal/deprecations.generated.ts are each touched by 11 PRs: 228, 275, 279, 282, 283, 285, 288, 298, 302, 313, 314, 320, plus 331 for deprecations.json. These have to be serialised and regenerated after each merge.
2. **CSS sweeps overlap every CMP CSS file.** #322 (CMP-08), #308 (CMP-139 zero-literal, 57 files), #323 (CMP-09 FIN-A, 70 files), #331 (CMP-18), #332 (CMP-19 FIN-A), #334 (CMP-21) and #324 (CMP-13) all rewrite the same files, as do the per-component CSS PRs. For example, 11 PRs touch Combobox.css and 10 touch Select.css. next has also changed about 50 of these CSS files since the base (MAT-003 namespace and literals commits), so these PRs need rebasing.
3. **Overlay client files.** #317 (ref-as-prop), #320 (compound), #325 (portal seam, FIN-A), #318, #330, #333 and #337 rewrite the same Menu/Dialog/Sheet/Toast/Popover files as the per-overlay PRs #247–#278. FIN-A #122 (REQ-FIN-07 layers) also overlaps #249, #325 and #326.
4. **Duplicates.**
   - `./forms`: #200, #310 and #336 (FIN-A) all create it, and next already has it via #369.
   - Package exports: #280 and #336.
   - etc/api: #310 and #336.
   - Tanstack removal in ComboboxVirtualList: #242 and #337.
   - fragments/lanes/cmp.ts: #301 and #307.
   - canaries/next16/app/cmp: #301 and #330.
   - ci/cmp.gitlab-ci.yml: #311, #312 and #315.
   - CMP-133 mapping rows: #303 and #312.
   - DEP-C0028: #228 and #313 (same 4.x file).
   - Provider self-adoption fix: #317, #320 and #325, already on next and also in FIN-A #121.
5. **Lines.** Only #228 and #313 target release/4.x. No CMP PR targets release/4.1.x, and the PRD does not require one there. #313 (+18,910 lines) and #314 carry the same 166 DEP-C rows separately instead of reaching next through the 4.x→next sync.
6. **No CI anywhere.** statusCheckRollup is empty on all 138 CMP PRs. The remote Playwright lanes need OD-8 (GitLab mirror of next).

## Needs human / owner

- OD-15: CMP-72 virtualisation. #242 chose an owned windowed list. Accept it or amend the allowlist.
- OD-16:
  - CC-CMP-01 compound parts (#320)
  - `modal='trap-focus'` (#255)
  - Toast.Progress/History parts
- CMP-92: SheetSide `left|right`. #260 kept them, so owner confirmation is needed.
- Merge order: deprecation-fragment and CSS-sweep PRs need serialising and rebasing, and the duplicates in item 4 need choosing.
- OD-8/OD-11: GitLab pipelines and remote runner, needed for every "C" row, CMP-27, the APG/visual/perf specs, and #312's consumer-4x remote job.
- A 4.x minor release has to ship DEP-C0028 and the CMP fragment (#313/#228).
