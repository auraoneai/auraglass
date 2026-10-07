# PROMPT-3b (CMP lane A): Actions

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **A**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3b-A"` (30 tasks: CMP-066..093, 411..412).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside CMP):** `src/components/{button,icon-button,button-group,toolbar,toggle-group,segmented-control}/**`

**Order inside the lane:** Button first (pattern proof with Dialog; calibration input), then IconButton, ButtonGroup, Toolbar, ToggleGroup, SegmentedControl

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-03, REQ-CMP-13, REQ-CMP-22, REQ-CMP-32, REQ-CMP-35, REQ-CMP-36, REQ-CMP-37, REQ-CMP-38, REQ-CMP-39, REQ-CMP-40, REQ-CMP-41, REQ-CMP-42, REQ-CMP-44, REQ-CMP-47.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-a -b next-cmp/a-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3b-A") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-066 | MODIFY | `src/components/button/Button.css` | REQ-MOT-11/-41/-94 on Button: data-ag-interactive, data-ag-size-class='control', data-ag-pointer-light when pointerLight, installPointerLight only when … | CMP-067, CMP-068 | REQ-CMP-35, REQ-CMP-01 |
| CMP-067 | CREATE | `NEW:src/components/button/Button.client.tsx` | 'use client' leaf on Base UI Button, switching to Toggle when pressed/defaultPressed/onPressedChange is present, via the PRD-FND wrapping pattern (FND-004 types, … |  | REQ-CMP-32, REQ-CMP-35 |
| CMP-068 | CREATE | `NEW:src/components/button/Button.css` | @layer ag.components, selectors only .ag-button, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-067 | REQ-CMP-32 |
| CMP-069 | CREATE | `NEW:src/components/button/Button.meta.ts` | ControlMeta for Button (tier T1, rsc client-leaf). parts [root,icon,label,spinner], states [hover,active,focus-visible,pressed,disabled,loading], variants … | CMP-067 | REQ-CMP-22 |
| CMP-070 | TEST | `NEW:src/components/button/Button.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): loading blocks onClick; the label element stays in the DOM with visibility:hidden (pixel width … | CMP-067, CMP-069 | REQ-CMP-32 |
| CMP-071 | CREATE | `NEW:src/components/button/Button.stories.tsx` | Title Flagships/Controls/Button, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-068, CMP-069 | REQ-CMP-01 |
| CMP-072 | CREATE | `NEW:src/components/icon-button/IconButton.client.tsx` | 'use client' leaf on Base UI Button (Toggle when pressed props present) via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node per … |  | REQ-CMP-36 |
| CMP-073 | CREATE | `NEW:src/components/icon-button/IconButton.css` | @layer ag.components, selectors only .ag-icon-button, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-072 | REQ-CMP-36 |
| CMP-074 | CREATE | `NEW:src/components/icon-button/IconButton.meta.ts` | ControlMeta for IconButton (tier T1, rsc client-leaf). parts [root,icon], variant [regular,clear,identity] (SC-24 material axis; no material prop), apg "button", … | CMP-072 | REQ-CMP-22 |
| CMP-075 | TEST | `NEW:src/components/icon-button/IconButton.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): missing/empty aria-label logs a dev error; TS: omitting aria-label is a type error … | CMP-072, CMP-074 | REQ-CMP-36 |
| CMP-076 | CREATE | `NEW:src/components/icon-button/IconButton.stories.tsx` | Title Flagships/Controls/IconButton, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-073, CMP-074 | REQ-CMP-13 |
| CMP-077 | CREATE | `NEW:src/components/toolbar/Toolbar.client.tsx` | 'use client' leaf on Base UI Toolbar (Root, Button, Group, Separator, Link, Input) via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node … |  | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-078 | CREATE | `NEW:src/components/toolbar/Toolbar.css` | @layer ag.components, selectors only .ag-toolbar, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Item … | CMP-077 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-079 | CREATE | `NEW:src/components/toolbar/Toolbar.meta.ts` | ControlMeta for Toolbar (tier T1, rsc client-leaf). parts [root,item,group,separator], states [pressed,disabled,orientation], apg "toolbar", budgetKb 13. NEW … | CMP-077 | REQ-CMP-22 |
| CMP-080 | TEST | `NEW:src/components/toolbar/Toolbar.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): one tab stop; arrows move focus with loop; Home/End; disabled skipped unless focusableWhenDisabled; … | CMP-077, CMP-079 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-081 | CREATE | `NEW:src/components/toolbar/Toolbar.stories.tsx` | Title Flagships/Controls/Toolbar, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-078, CMP-079 | REQ-CMP-01 |
| CMP-082 | CREATE | `NEW:src/components/toolbar/ButtonGroup.tsx` | Server-safe (no hooks, no "use client"): role="group", required aria-label or aria-labelledby (TS union), orientation, attached (default true). SurfaceGroup root for … | CMP-077 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-083 | CREATE | `NEW:src/components/toolbar/ToggleGroup.client.tsx` | 'use client'. ToggleGroup.Root (value: string[], defaultValue, onValueChange(value, details), multiple default false, orientation, disabled) and ToggleGroup.Item … | CMP-077 | REQ-CMP-37, REQ-CMP-38, REQ-CMP-39 |
| CMP-084 | MODIFY | `src/components/toolbar/Toolbar.client.tsx` | Toolbar overflow: container query on Toolbar.Root; items with priority prop (emitted data-ag-priority pending MAT ratification in SC-21, PRD §21 O-06)="low" move into a … | CMP-077 | REQ-CMP-40 |
| CMP-085 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.client.tsx` | 'use client' leaf on Base UI RadioGroup + Radio (PRD deviation REQ-CTL-40; ToggleGroup allowed only if the alpha check shows radio semantics) via the PRD-FND wrapping … |  | REQ-CMP-41 |
| CMP-086 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.css` | @layer ag.components, selectors only .ag-segmented-control, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no … | CMP-085 | REQ-CMP-41 |
| CMP-087 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.meta.ts` | ControlMeta for SegmentedControl (tier T1, rsc client-leaf). parts [root,item,item-label,indicator], states [checked,unchecked,disabled,animating], variant … | CMP-085 | REQ-CMP-22 |
| CMP-088 | TEST | `NEW:src/components/segmented-control/SegmentedControl.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): refuses to deselect (exactly one value always); arrows move and select with wrap; title set to the … | CMP-085, CMP-087 | REQ-CMP-41 |
| CMP-089 | CREATE | `NEW:src/components/segmented-control/SegmentedControl.stories.tsx` | Title Flagships/Controls/SegmentedControl, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix … | CMP-086, CMP-087 | REQ-CMP-03 |
| CMP-090 | MODIFY | `src/components/{button,icon-button,toolbar,segmented-control,switch,slider,checkbox,radio …` | Fill the `migration.from[]` field of every meta with the §10.2 rows: 4.x name, entry (root, aura-glass/app-shell, or internal), compat yes/no per §7, prop map (SC-24 … |  | REQ-CMP-22 |
| CMP-091 | REMOVE | `src/components/button/{GlassButton,EnhancedGlassButton,GlassMagneticButton,GlassFab,Liqui …` | One revertable PR deleting the buttons 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: compat-controls.test.tsx … |  |  |
| CMP-092 | REMOVE | `src/components/input/{GlassToggle,LiquidGlassControlGroup}.tsx; …` | One revertable PR deleting the toggles/toolbars 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: … |  | REQ-CMP-47 |
| CMP-093 | TEST | `src/components/button/Button.stories.tsx` | Contract check only (SC-31/OV-16: CTL-059 authors Button.stories.tsx and deletes GlassButton.stories.tsx): run story-contract.test.ts against the CTL-059 file as the … | CMP-071 | REQ-CMP-01 |
| CMP-411 | CREATE | `src/components/segmented-control/SegmentedControl.css` | Track as SurfaceGroup (chrome, regular, capsule); indicator layer transient, thin, concentric, inner fill at rest; glass plus [data-ag-animating] (will-change: … |  | REQ-CMP-42 |
| CMP-412 | MODIFY | `src/components/segmented-control/SegmentedControl.tsx` | Segments never wrap: below the summed width (container query) labels ellipsize with item min-inline-size >= 44px and title = full label; with more than 5 items at 390px … |  | REQ-CMP-44 |

## Contract seams this lane consumes

S-01, S-02, S-05, S-06, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-38, S-39, S-41, S-46, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE A REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
