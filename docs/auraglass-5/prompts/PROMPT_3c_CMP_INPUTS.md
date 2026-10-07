# PROMPT-3c (CMP lane I): Inputs

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **I**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3c-I"` (87 tasks: CMP-094..174, 413..417, 419).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

## Scope

**Owned paths (exclusive inside CMP):** `src/components/{field,text-field,search-field,number-field,checkbox,radio-group,switch,slider}/**`, `tests/controls/**`

**Order inside the lane:** Field/Fieldset/Form, then TextField, Checkbox/CheckboxGroup, RadioGroup, Switch, then SearchField, NumberField, Slider

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-02, REQ-CMP-03, REQ-CMP-04, REQ-CMP-06, REQ-CMP-08, REQ-CMP-12, REQ-CMP-15, REQ-CMP-16, REQ-CMP-17, REQ-CMP-20, REQ-CMP-21, REQ-CMP-22, REQ-CMP-31, REQ-CMP-32, REQ-CMP-45, REQ-CMP-46, REQ-CMP-48, REQ-CMP-49, REQ-CMP-51, REQ-CMP-52, REQ-CMP-54, REQ-CMP-55, REQ-CMP-57, REQ-CMP-58, REQ-CMP-59, REQ-CMP-60, REQ-CMP-61, REQ-CMP-62, REQ-CMP-63, REQ-CMP-68, REQ-CMP-69, REQ-CMP-71, REQ-CMP-73, REQ-CMP-75, REQ-CMP-76, REQ-CMP-130, REQ-CMP-131, REQ-CMP-136, REQ-CMP-138, REQ-CMP-139, REQ-CMP-141.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-i -b next-cmp/i-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3c-I") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-094 | TEST | `NEW:tests/controls/base-ui-parts.test.ts` | Entry gate (PRD §20 step 1). Assert @base-ui/react is pinned to an exact version in package.json dependencies, and that every Base UI part named in … |  | REQ-CMP-01, REQ-CMP-69, REQ-CMP-32 |
| CMP-095 | CREATE | `NEW:src/components/control-shared/size.ts` | Export `type ControlSize = 'sm' \| 'md' \| 'lg'`, `DEFAULT_CONTROL_SIZE = 'md'`, and `sizeAttrs(size?: ControlSize): { 'data-ag-size': ControlSize }`. No hooks, no 'use … | CMP-094 | REQ-CMP-21 |
| CMP-096 | CREATE | `NEW:src/components/control-shared/value.ts` | Export `warnControlledSwitch(component: string, prop: "value"\|"checked"\|"pressed", wasControlled: boolean, isControlled: boolean): void` that logs one console.error per … | CMP-094 | REQ-CMP-04, REQ-CMP-02 |
| CMP-097 | CREATE | `NEW:src/components/control-shared/messages.ts` | Export `CONTROL_MESSAGES` defaults: clearSearch "Clear search", increase "Increase", decrease "Decrease", removeChip "Remove {label}", noResults "No results", … | CMP-094 | REQ-CMP-73 |
| CMP-098 | CREATE | `NEW:src/components/control-shared/meta.ts` | Export `ControlMeta` = the PRD-FND (foundation) meta shape `{ parts, states, variants, tier, rsc, apg, budgetKb }` plus `props`, `sizes`, `defaults`, optional `keys` … | CMP-094 | REQ-CMP-22 |
| CMP-099 | CREATE | `NEW:src/components/control-shared/controls.css` | In `@layer ag.components`: (1) `[data-ag-size]` block sizes from `--ag-comp-control-height-{sm,md,lg}-{compact,regular,spacious}` (PRD-DS tokens 24/32/44, 28/36/44, … | CMP-094 | REQ-CMP-21 |
| CMP-100 | CREATE | `NEW:src/components/field/Field.client.tsx` | 'use client'. `Field.Root`, `Field.Label`, `Field.Description`, `Field.Error` wrapping Base UI `Field.Root/Label/Description/Error` (+ `Field.Validity` internally). … | CMP-099, CMP-098 | REQ-CMP-57 |
| CMP-101 | CREATE | `NEW:src/components/field/Fieldset.client.tsx` | 'use client'. `Fieldset.Root` (part `root`, renders `<fieldset>` via Base UI `Fieldset.Root`, `disabled` propagates `data-disabled` to child controls) and … | CMP-100 | REQ-CMP-57 |
| CMP-102 | CREATE | `NEW:src/components/field/Field.types.ts` | AuraGlass-declared `FieldRootProps`, `FieldLabelProps`, `FieldDescriptionProps`, `FieldErrorProps`, `FieldsetRootProps`, `FieldsetLegendProps` (no Base UI type names; … | CMP-100 | REQ-CMP-01 |
| CMP-103 | CREATE | `NEW:src/components/field/Field.meta.ts` | Field.meta.ts and NEW Fieldset.meta.ts typed as ControlMeta: parts [root,label,control-shell,description,error] / [root,legend]; states … | CMP-102, CMP-098 | REQ-CMP-22 |
| CMP-104 | CREATE | `NEW:src/components/field/Field.css` | `@layer ag.components`, `.ag-field` scope only. `[data-ag-part=control-shell]` content-sunken fill + rim at rest from PRD-MAT vars; `[data-focused]` rim -> … | CMP-100, CMP-099 | REQ-CMP-61 |
| CMP-105 | CREATE | `NEW:src/components/field/index.ts` | Named re-exports only (no directive, no export *): Field, Fieldset and their prop types. | CMP-100, CMP-101, CMP-102 | REQ-CMP-17 |
| CMP-106 | MODIFY | `src/root/cmp.ts` | Add named root exports `Field`, `Fieldset` and their prop types from ./components/field (C-E). Do not touch any existing 4.x export line; removals happen in PROMPT_09f. | CMP-105 | REQ-CMP-17 |
| CMP-107 | TEST | `NEW:src/components/field/Field.test.tsx` | Field.Label for/id; aria-describedby order description then error; aria-invalid when error set; toggling error undefined->string->undefined across 6 rerenders throws … | CMP-100, CMP-101 | REQ-CMP-58 |
| CMP-108 | CREATE | `NEW:src/components/field/Field.stories.tsx` | Title Flagships/Controls/Field, tags ["certified"], parameters.ag.tier "Certified"; stories Overview, Matrix (generated from Field.meta.ts), Density, InContext … | CMP-103, CMP-104 | REQ-CMP-01 |
| CMP-109 | CREATE | `NEW:tests/controls/families.ts` | Family registry for the parametrised suites: an array of `{ name, meta, fixture }` where `fixture` comes from NEW `tests/controls/fixtures/<kebab-name>.tsx` exporting … | CMP-103 | REQ-CMP-139 |
| CMP-110 | TEST | `NEW:tests/controls/controls-contract.test.tsx` | Parametrised over tests/controls/families.ts: every part in meta.parts renders data-ag-part; Base UI state attributes appear per meta.states (data-checked, … | CMP-109, CMP-096 | REQ-CMP-06 |
| CMP-111 | TEST | `NEW:tests/controls/controls-hooks.test.tsx` | For each family rerender 6 times toggling each key in fixture.toggleProps (error, description, label, disabled, loading, multiple). Fail on any "Rendered more … | CMP-109 | REQ-CMP-15 |
| CMP-112 | TEST | `NEW:tests/controls/controls-side-effects.test.tsx` | Spies on MutationObserver, ResizeObserver, IntersectionObserver constructors and disconnect, window/document addEventListener/removeEventListener("scroll"\|"resize"), … | CMP-109 | REQ-CMP-16 |
| CMP-113 | TEST | `NEW:tests/controls/controls-ssr.test.tsx` | For each family: renderToString(fixture.Default) then hydrateRoot in jsdom; and the defaultOpen variant for popup families. Zero console.error/warn; outerHTML identical … | CMP-109 | REQ-CMP-17 |
| CMP-114 | TEST | `NEW:tests/controls/controls-api-report.test.ts` | Read the API Extractor report for "." (etc/api path from PRD-REL; fail closed if missing). Assert: no "@base-ui" substring; no prop named intent, elevation, tier, … | CMP-106 | REQ-CMP-01 |
| CMP-115 | TEST | `n/a` | Selector/role change tables (REQ-CTL-17) are generated by DX's scripts/docs/gen-selectors.mjs (DX-105) from each meta's `selectorChanges: Array<{before, after}>`; CTL … | CMP-098 | REQ-CMP-22 |
| CMP-116 | TEST | `NEW:tests/controls/controls-meta.test.ts` | TS-AST (typescript compiler API) comparison: each *.meta.ts props == the exported props interface keys; parts == the data-ag-part literals in the family .client.tsx … | CMP-109, CMP-115 | REQ-CMP-22 |
| CMP-117 | TEST | `NEW:tests/controls/controls-css.test.ts` | PostCSS walk of the built dist styles.css (build artifact from the remote build job): every rule whose selector contains .ag-<control> or a control data-ag-part sits … | CMP-099, CMP-104 | REQ-CMP-08, REQ-CMP-03 |
| CMP-118 | TEST | `NEW:tests/controls/field-shell.test.tsx` | Field wiring for TextField, NumberField, Select trigger, Combobox input, Switch, Checkbox: Field.Label for/id (or aria-labelledby for non-input roots); aria-describedby … | CMP-100, CMP-109 | REQ-CMP-57 |
| CMP-119 | MODIFY | `lint/rules/cmp/` | MODIFY the PKG-wired eslint.config.js (PKG-015) with a config block scoped to the $CONTROLS glob (PRD §5): 'react-hooks/rules-of-hooks': 'error'; the registered … | CMP-094 | REQ-CMP-08, REQ-CMP-03 |
| CMP-120 | MODIFY | `ci/cmp.gitlab-ci.yml` | No controls-specific workflow (SC-29 workflows are the PR-scope qual:certify:l* jobs/main/release only). If QA's the PR-scope qual:certify:l* jobs (QA-031) L1 Static … | CMP-119 | REQ-CMP-141 |
| CMP-121 | CREATE | `NEW:src/components/checkbox/Checkbox.client.tsx` | 'use client' leaf on Base UI Checkbox.Root + Checkbox.Indicator and CheckboxGroup via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-52 |
| CMP-122 | CREATE | `NEW:src/components/checkbox/Checkbox.css` | @layer ag.components, selectors only .ag-checkbox, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Box … | CMP-121 | REQ-CMP-52, REQ-CMP-20 |
| CMP-123 | CREATE | `NEW:src/components/checkbox/Checkbox.meta.ts` | ControlMeta for Checkbox (tier T1, rsc client-leaf). Checkbox.meta.ts parts [root,indicator,icon], states … | CMP-121, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-124 | TEST | `NEW:src/components/checkbox/Checkbox.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Space toggles; indeterminate -> aria-checked="mixed"; parent cycles mixed->checked->unchecked and … | CMP-121, CMP-123 | REQ-CMP-52 |
| CMP-125 | CREATE | `NEW:src/components/checkbox/Checkbox.stories.tsx` | Title Flagships/Controls/Checkbox, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-122, CMP-123 | REQ-CMP-01 |
| CMP-126 | CREATE | `NEW:src/components/radio-group/RadioGroup.client.tsx` | 'use client' leaf on Base UI RadioGroup + Radio.Root + Radio.Indicator via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node per surface, … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-55 |
| CMP-127 | CREATE | `NEW:src/components/radio-group/RadioGroup.css` | @layer ag.components, selectors only .ag-radio-group, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-126 | REQ-CMP-55, REQ-CMP-20 |
| CMP-128 | CREATE | `NEW:src/components/radio-group/RadioGroup.meta.ts` | ControlMeta for RadioGroup (tier T1, rsc client-leaf). RadioGroup.meta.ts parts [root,item,indicator,label], states [checked,unchecked,disabled,readonly,required], apg … | CMP-126, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-129 | TEST | `NEW:src/components/radio-group/RadioGroup.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): one tab stop on the checked item (first enabled when none); arrows move and select with wrap; Space … | CMP-126, CMP-128 | REQ-CMP-55 |
| CMP-130 | CREATE | `NEW:src/components/radio-group/RadioGroup.stories.tsx` | Title Flagships/Controls/RadioGroup, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-127, CMP-128 | REQ-CMP-01 |
| CMP-131 | CREATE | `NEW:src/components/switch/Switch.client.tsx` | 'use client' leaf on Base UI Switch.Root + Switch.Thumb via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node per surface, ref as prop, … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-45 |
| CMP-132 | CREATE | `NEW:src/components/switch/Switch.css` | @layer ag.components, selectors only .ag-switch, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Track … | CMP-131 | REQ-CMP-45 |
| CMP-133 | CREATE | `NEW:src/components/switch/Switch.meta.ts` | ControlMeta for Switch (tier T1, rsc client-leaf). parts [root,thumb], states [checked,unchecked,disabled,readonly], apg "switch", budgetKb 8, keys.enter recorded as … | CMP-131, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-134 | TEST | `NEW:src/components/switch/Switch.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Space toggles; Enter behaviour equals Switch.meta.ts keys.enter; role="switch" with aria-checked; no … | CMP-131, CMP-133 | REQ-CMP-45 |
| CMP-135 | CREATE | `NEW:src/components/switch/Switch.stories.tsx` | Title Flagships/Controls/Switch, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-132, CMP-133 | REQ-CMP-01 |
| CMP-136 | CREATE | `NEW:src/components/text-field/TextField.client.tsx` | 'use client' leaf on Base UI Field + Input (and a textarea Field.Control when multiline) via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-60 |
| CMP-137 | CREATE | `NEW:src/components/text-field/TextField.css` | @layer ag.components, selectors only .ag-text-field, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-136 | REQ-CMP-60 |
| CMP-138 | CREATE | `NEW:src/components/text-field/TextField.meta.ts` | ControlMeta for TextField (tier T1, rsc client-leaf). parts [root,label,control-shell,control,adornment-start,adornment-end,description,error,counter], states … | CMP-136, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-139 | TEST | `NEW:src/components/text-field/TextField.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): error toggling never throws and keeps hook count; aria-describedby order; validate + validationMode … | CMP-136, CMP-138 | REQ-CMP-60 |
| CMP-140 | CREATE | `NEW:src/components/text-field/TextField.stories.tsx` | Title Flagships/Controls/TextField, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-137, CMP-138 | REQ-CMP-31 |
| CMP-141 | TEST | `NEW:tests/controls/text-field-ime.test.tsx` | compositionstart, input x3, compositionend sequence: onValueChange called once, after compositionend, with the composed string; keydown Enter with isComposing=true … | CMP-136 | REQ-CMP-62 |
| CMP-142 | MODIFY | `src/root/cmp.ts` | Add named root exports Checkbox, CheckboxGroup, RadioGroup, Radio, Switch, TextField and their prop types (C-E). Existing 4.x lines (GlassSwitch :247, GlassInput :220, … | CMP-123, CMP-128, CMP-133, CMP-138 | REQ-CMP-17 |
| CMP-143 | CREATE | `NEW:src/components/search-field/SearchField.client.tsx` | 'use client' leaf on Base UI Field + Input type="search" plus an AuraGlass IconButton clear via the PRD-FND wrapping pattern (materialProps on the Base UI element, one … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-63 |
| CMP-144 | CREATE | `NEW:src/components/search-field/SearchField.css` | @layer ag.components, selectors only .ag-search-field, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-143 | REQ-CMP-63 |
| CMP-145 | CREATE | `NEW:src/components/search-field/SearchField.meta.ts` | ControlMeta for SearchField (tier T1, rsc client-leaf). parts [root,control-shell,icon,control,clear,shortcut,spinner], variant [regular,clear,identity] (SC-24 material … | CMP-143, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-146 | TEST | `NEW:src/components/search-field/SearchField.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): Escape clears then propagates when empty (spy on a parent keydown handler); onClear called once; … | CMP-143, CMP-145 | REQ-CMP-63 |
| CMP-147 | CREATE | `NEW:src/components/search-field/SearchField.stories.tsx` | Title Flagships/Controls/SearchField, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-144, CMP-145 | REQ-CMP-12 |
| CMP-148 | MODIFY | `src/root/cmp.ts` | Add named root exports IconButton, ButtonGroup, Toolbar, ToggleGroup, SegmentedControl, SearchField and their prop types (C-E). Do NOT change `:266 GlassButton as … | CMP-145 | REQ-CMP-17 |
| CMP-149 | CREATE | `NEW:src/components/slider/Slider.client.tsx` | 'use client' leaf on Base UI Slider.Root, Control, Track, Indicator, Thumb, Value via the PRD-FND wrapping pattern (materialProps on the Base UI element, one DOM node … | CMP-099, CMP-109, CMP-119 | REQ-CMP-48 |
| CMP-150 | CREATE | `NEW:src/components/slider/Slider.css` | @layer ag.components, selectors only .ag-slider, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). Track … | CMP-149 | REQ-CMP-48 |
| CMP-151 | CREATE | `NEW:src/components/slider/Slider.meta.ts` | ControlMeta for Slider (tier T1, rsc client-leaf). parts [root,control,track,range,thumb,value,mark,mark-label], states [dragging,disabled,orientation], apg "slider", … | CMP-149, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-152 | TEST | `NEW:src/components/slider/Slider.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): onValueCommitted fires once per pointerup and once per keyup; aria-valuetext from format and from … | CMP-149, CMP-151 | REQ-CMP-48 |
| CMP-153 | CREATE | `NEW:src/components/slider/Slider.stories.tsx` | Title Flagships/Controls/Slider, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-150, CMP-151 | REQ-CMP-01 |
| CMP-154 | CREATE | `NEW:src/components/number-field/NumberField.client.tsx` | 'use client' leaf on Base UI NumberField.Root, Group, Input, Increment, Decrement, ScrubArea, ScrubAreaCursor via the PRD-FND wrapping pattern (materialProps on the … | CMP-099, CMP-100, CMP-109, CMP-119 | REQ-CMP-75 |
| CMP-155 | CREATE | `NEW:src/components/number-field/NumberField.css` | @layer ag.components, selectors only .ag-number-field, [data-ag-part] and Base UI data-* state; tokens only (no literals, no !important, no transition: all, no :root). … | CMP-154 | REQ-CMP-75 |
| CMP-156 | CREATE | `NEW:src/components/number-field/NumberField.meta.ts` | ControlMeta for NumberField (tier T1, rsc client-leaf). parts [root,group,input,increment,decrement,scrub-area], states … | CMP-154, CMP-098, CMP-109 | REQ-CMP-22 |
| CMP-157 | TEST | `NEW:src/components/number-field/NumberField.test.tsx` | Family unit suite (jsdom, real Base UI, no jest.mock of @base-ui): steppers are BUTTON elements with tabIndex -1 and accessible names; Alt+Arrow +-smallStep; wheel does … | CMP-154, CMP-156 | REQ-CMP-75 |
| CMP-158 | CREATE | `NEW:src/components/number-field/NumberField.stories.tsx` | Title Flagships/Controls/NumberField, tags ["certified"], parameters.ag.tier "Certified". Stories: Overview (default environment global, product copy), Matrix (sizes x … | CMP-155, CMP-156 | REQ-CMP-01 |
| CMP-159 | TEST | `NEW:tests/controls/number-field-format.test.tsx` | locale de-DE: typing "1.234,5" then blur yields onValueChange(1234.5) and displays "1.234,5"; blur clamps to [min,max]; invalid text ("abc") restores the last valid … | CMP-154 | REQ-CMP-75 |
| CMP-160 | TEST | `NEW:tests/controls/select-form.test.tsx` | Inside a <form>: hidden input value equals the selection; form.reset() restores defaultValue; required with no value blocks submit (submit handler not called) and shows … |  | REQ-CMP-68 |
| CMP-161 | TEST | `NEW:tests/controls/combobox-async.test.tsx` | filter={null} + loading: aria-busy on the list, announcer called at most once per 500ms (fake timers), Empty has role="status"; 1,000 items render <= visible + 2x … |  | REQ-CMP-71 |
| CMP-162 | MODIFY | `src/root/cmp.ts` | Add named root exports Slider, NumberField, Select, Combobox and their prop types (C-E). Existing 4.x lines (GlassSlider :243, GlassSelectCompound :231-242, etc.) stay … | CMP-151, CMP-156 | REQ-CMP-17 |
| CMP-163 | MODIFY | `fragments/playwright/cmp.json` | MODIFY QA's configs (QA-018, SC-29/OV-22). In playwright.config.ts add projects controls-chromium, controls-webkit, controls-firefox with testMatch … |  | REQ-CMP-138 |
| CMP-164 | CREATE | `NEW:src/components/control-shared/ControlsDenseForm.stories.tsx` | Story Flagships/Controls/DenseForm (id used as the "controls-dense-form" subject): 20 fields (TextField x8, NumberField x3, Select x3, Combobox x2, Switch x2, Checkbox … |  |  |
| CMP-165 | MODIFY | `fragments/size-budgets/cmp.ts` | Add the §16 rows (min+gz, gzip 9, peers external, limitBytesGz integer bytes, KB=1024): Button 10, IconButton 10, Toolbar 13, ToggleGroup 11, ButtonGroup 10, … |  | REQ-CMP-22, REQ-CMP-136 |
| CMP-166 | MODIFY | `fragments/size-budgets/cmp.ts` | Calibration commit (PRD §20 step 6), consuming QA-123's alpha.1 L2/L10 artifacts: run verify-size-budgets.mjs and the perf lane on the alpha build remotely; set each … | CMP-165 | REQ-CMP-22, REQ-CMP-136 |
| CMP-167 | TEST | `tests/controls/field-shell.test.tsx` | Add the aura-glass/date cases: DateField, TimeField, DatePicker, DateRangePicker use Field.Root/Label/Description/Error wiring and render data-ag-part control-shell, … | CMP-118 | REQ-CMP-22, REQ-CMP-58 |
| CMP-168 | TEST | `canaries/next16/app/cmp/` | Ensure the PRD-PKG canary pages import all 14 families (13 root + aura-glass/date) and the Vite canary asserts { Button } gzip <=10 KB; edit only the import list of the … |  | REQ-CMP-17, REQ-CMP-130 |
| CMP-169 | DOC | `NEW:apps/docs/content/cmp/migration/controls-review-request.md` | Request (not a result) listing the remote capture artifacts a named human reviewer must score: chrome families (Button, IconButton, Toolbar, SegmentedControl, … |  | REQ-CMP-139 |
| CMP-170 | MODIFY | `src/components/field/Field.meta.ts` | Mapping data for PRD-DATA (REQ-CTL-153) recorded in the `migration` field of Field.meta.ts (SC-33: mapping data only from meta `migration` fields and generated … | CMP-103 | REQ-CMP-01 |
| CMP-171 | TEST | `NEW:tests/controls/compat-controls.test.tsx` | For each of the 40 names: import from aura-glass/compat (source alias), render with representative 4.x props, assert the 5.0 component renders (data-ag-part root of the … |  | REQ-CMP-131 |
| CMP-172 | MODIFY | `src/root/cmp.ts` | After the 4.3 deprecations are published (REQ-REL-09 gate green): replace :266 `GlassButton as Button` and :265 GlassButton with the new Button export; remove the … | CMP-171 | REQ-CMP-17 |
| CMP-173 | REMOVE | `src/components/input/{GlassInput,GlassTextarea,GlassFieldGroup,GlassValidationMessage,Gla …` | One revertable PR deleting the fields/search 4.x files with their *.stories.tsx, *.test.tsx and __snapshots__ (PRD §6, §20 step 8). Precondition: … | CMP-172, CMP-171 | REQ-CMP-60 |
| CMP-174 | TEST | `n/a` | RC certification sweep (PRD §20 step 9): on one RC SHA run the full jest set, all 11 APG specs x 3 engines (33 runs), controls-axe/focus/sizing/motion/overlay-stack, … | CMP-173, CMP-166, CMP-167, CMP-169, CMP-168 |  |
| CMP-413 | CREATE | `src/components/switch/Switch.css` | Track content-sunken when unchecked and opaque --ag-color-accent when checked; thumb transient (inner fill at rest, glass only while dragged or animating); translate … |  | REQ-CMP-46 |
| CMP-414 | CREATE | `src/components/slider/Slider.css` | Track content-sunken 4/6/8px by size; range is the accent fill; thumb transient 16/20/24px with glass only under [data-dragging]; never scales (dragging raises … |  | REQ-CMP-49 |
| CMP-415 | MODIFY | `src/components/slider/Slider.client.tsx` | Pointer capture on the control; track click jumps to the value; touch-action: none on the control only; during a drag forward onValueChange at most once per frame … |  | REQ-CMP-51 |
| CMP-416 | CREATE | `src/components/checkbox/Checkbox.css; src/components/radio-group/RadioGroup.css` | Box content-sunken with a 1px --ag-surface-rim; checked = opaque accent fill with a contrast-color() icon (fallback --ag-color-on-accent); no backdrop-filter anywhere … |  | REQ-CMP-54 |
| CMP-417 | CREATE | `NEW:src/components/field/Fieldset.tsx` | Flat Fieldset on Base UI Fieldset with a legend prop and legend part; absorbs GlassFieldGroup (compat adapter in src/compat/cmp/, codemod mapping in … |  | REQ-CMP-59 |
| CMP-419 | CREATE | `NEW:src/components/number-field/parse.ts` | Parse and format with Intl.NumberFormat(locale) (de-DE "1.234,5" -> 1234.5); blur normalises and clamps to [min, max]; invalid text restores the last valid value; no … |  | REQ-CMP-76 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE I REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
