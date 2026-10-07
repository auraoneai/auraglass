# PROMPT-3d (CMP lane P): Pickers

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **P**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3d-P"` (15 tasks: CMP-175..188, 418).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

## Scope

**Owned paths (exclusive inside CMP):** `src/components/{select,combobox}/**`

**Order inside the lane:** Select, then Combobox (core → async → autocomplete → creatable → virtual list)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-22, REQ-CMP-65, REQ-CMP-67, REQ-CMP-69, REQ-CMP-71, REQ-CMP-72, REQ-CMP-74.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-p -b next-cmp/p-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3d-P") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-175 | CREATE | `NEW:src/components/select/Select.client.tsx` | 'use client' leaf on Base UI Select (Root, Trigger, Value, Icon, Portal, Positioner, Popup, List, Item, ItemText, ItemIndicator, Group, GroupLabel, Separator, … |  | REQ-CMP-65 |
| CMP-176 | CREATE | `NEW:src/components/select/Select.css` | @layer ag.components, selectors only .ag-select, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Popup … | CMP-175 | REQ-CMP-65 |
| CMP-177 | CREATE | `NEW:src/components/select/Select.meta.ts` | ControlMeta for Select (tier T1, rsc client-leaf). parts … | CMP-175 | REQ-CMP-22 |
| CMP-178 | TEST | `NEW:src/components/select/Select.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Enter/Space/ArrowDown/ArrowUp on the trigger open; typeahead focuses by label; Escape closes and … | CMP-175, CMP-177 | REQ-CMP-65 |
| CMP-179 | CREATE | `NEW:src/components/select/Select.stories.tsx` | Title Flagships/Controls/Select, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-176, CMP-177 | REQ-CMP-01 |
| CMP-180 | CREATE | `NEW:src/components/combobox/Combobox.client.tsx` | 'use client' leaf on Base UI Combobox (Root, Input, Trigger, Clear, Portal, Positioner, Popup, List, Item, ItemIndicator, Empty, Group, GroupLabel, Chips, Chip, … |  | REQ-CMP-69 |
| CMP-181 | CREATE | `NEW:src/components/combobox/Combobox.css` | @layer ag.components, selectors only .ag-combobox, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-180 | REQ-CMP-69 |
| CMP-182 | CREATE | `NEW:src/components/combobox/Combobox.meta.ts` | ControlMeta for Combobox (tier T1, rsc client-leaf). parts … | CMP-180 | REQ-CMP-22 |
| CMP-183 | TEST | `NEW:src/components/combobox/Combobox.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): ArrowDown opens and moves; Alt+ArrowDown opens without moving; Escape closes, second Escape clears; … | CMP-180, CMP-182 | REQ-CMP-69 |
| CMP-184 | CREATE | `NEW:src/components/combobox/Combobox.stories.tsx` | Title Flagships/Controls/Combobox, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-181, CMP-182 | REQ-CMP-01 |
| CMP-185 | CREATE | `NEW:src/components/combobox/ComboboxVirtualList.client.tsx` | 'use client'. Above 200 items, Combobox.Content renders this list, loaded with dynamic import() so @tanstack/react-virtual (exact pin, D-29 allowlist via PRD-PKG) stays … | CMP-180 | REQ-CMP-72 |
| CMP-186 | MODIFY | `src/components/combobox/Combobox.client.tsx` | Add mode "select"\|"autocomplete" (default select; autocomplete uses Base UI Autocomplete when the pin ships it, else Combobox with aria-autocomplete="list"; free text … | CMP-180 | REQ-CMP-71 |
| CMP-187 | MODIFY | `src/components/combobox/Combobox.client.tsx` | Add creatable (boolean \| { label?: (query) => ReactNode }) and onCreate(query). When no item matches exactly after itemToString (case-insensitive), the list ends with … | CMP-186 | REQ-CMP-74 |
| CMP-188 | REMOVE | `src/components/input/{GlassSwitch,GlassSlider,GlassCheckbox,GlassCheckboxGroup,GlassRadio …` | One revertable PR deleting the selection 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: compat-controls.test.tsx … |  |  |
| CMP-418 | CREATE | `src/components/select/Select.css` | Trigger is the content-sunken field shell; popup overlay regular; item highlight a content-raised fill with no blur; popup materialises from var(--transform-origin) … |  | REQ-CMP-67 |

## Contract seams this lane consumes

S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-35, S-36, S-41, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE P REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
