# PROMPT-17e (SB): Component Lab story contract, information architecture and story deletions

You are implementing part of PRD-SB (key SB, self-id alias PRD-17; Storybook, Material Lab and Showcase) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRD numbers use architecture §16 numbering: PRD-05 a11y, PRD-07 foundation, PRD-08 controls (flagships 1–14), PRD-09 overlays (15–21), PRD-10 app shell (22–31), PRD-11 data (32–37), PRD-12 AI (38–42), PRD-13 media (43–44), PRD-14 core, PRD-16 removal (executed by `prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` RM-01..12), PRD-19 certification.

This prompt has two kinds of work. The **framework** (SB-070..SB-082, SB-090..SB-099) runs in one session. The **per-family rollout** (SB-083..SB-089) is one PR per family, each run as a separate session with this same prompt, scoped to that one task, once the family's owning PRD has landed the components **and their story files**.

Ownership (SC-31, binding): this PRD owns `defineComponentStories`, the contract, tags, IA, MDX docs pages and the contract tests. It creates **no** component story file. Component `*.stories.tsx` files are authored by the component's PRD (CTL-059 Button, OVL-055 Dialog, NAV-101 App Shell, DATA-043.., AI-076.., MED-101.., FND-069/099 core) using `defineComponentStories` (SB-071). SB-076/077 and SB-089 are contract checks; SB-083..088 add MDX pages and extend the contract tests. Contract failures are filed against the owner task (PRD §21 O-SB-04).

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` §2 rows E5–E7, E9–E11, E14, E15, E20, §3 items 1, 4, 7, §4.4 tags, §5.B REQ-SB-08..17, §5.D REQ-SB-27, §5.E REQ-SB-33, §6, §7, §9, §11 "Story-per-component churn", §12, §13, §14 (Mobile), §17 AC-SB-04, -05, -10, -11, §18 (inventory/index agreement), §20 steps 6–8.
- Architecture §11.2 (44 flagships, order and groups), §11.3 (typed variant metadata), §12 (consolidation map), D-14.
- PRD-05 `prd/AURAGLASS_ACCESSIBILITY_PRD.md` REQ-A11Y-40 (`ApgScript.story`); PRD-19 REQ-QA-18.
- Inventory: `docs/auraglass-5/component-inventory.json` (filter with `node -e`, e.g. `r.flagship_candidate`, `r.tier`, `r.action`).
- Tasks: `docs/auraglass-5/tasks/SB.json` SB-070..SB-099.

Requirements: REQ-SB-08, -09, -11, -12, -13 (typed args, no `any`), -14, -15 (`Keyboard` linkage), -17, -27 (marketing file), -33. Acceptance: AC-SB-04, AC-SB-05, AC-SB-10 (APG linkage clause), AC-SB-11.

## 2. Scope
May create or modify:
- NEW `.storybook/contract/{defineComponentStories.tsx,metadata.ts,StatesGrid.tsx,MatrixGrid.tsx,ScenesStrip.tsx,InContextFragments.tsx,docs-blocks.tsx,contract.module.css}`
- Flagship MDX docs pages at `src/stories/flagships/<group>/<Name>.mdx` (not colocated; component story files are the owning PRD's)
- NEW `src/stories/StartHere.stories.tsx` (generated), NEW `scripts/storybook/build-start-here.mjs`, NEW `src/stories/foundations/{Icons,Tokens,Motion,Preferences}.stories.tsx`, NEW `src/stories/migration/*.mdx`
- NEW `scripts/storybook/list-stubs.mjs`; `scripts/ensure-component-inventory.js` (emit `tier`)
- NEW tests: `tests/storybook/story-contract.test.ts`, `tests/storybook/{storybook-index.test.mjs,start-here.test.mjs,docs-pages.test.mjs,inventory-index.test.mjs}`
- Deletions listed in SB-092..SB-097
- `package.json` `prebuild-storybook` (chain `build-start-here.mjs` after `ensure-component-inventory.js`)

Must NOT touch: component source, its typed metadata files and its `*.stories.tsx` files (owned by PRD-07..14: FND, CTL, OVL, NAV, DATA, AI, MED), `tests/a11y/apg/**` (PRD-05 and the component PRDs), `.storybook/preview.tsx` (17c; except the `storySort` value, if you find it wrong against REQ-SB-08), `.storybook/lab/**`, `showcase/**`, `src/components/showcase/LiquidGlassShowcase.tsx`, `src/components/demo/**`, `src/components/advanced/StorybookVisualShowcase.tsx` (source deletion is RM-08), `src/index.ts`.

## 3. Prerequisites
- 17b and 17c merged: `test -f .storybook/contract/StoryRoot.tsx && rg -q "story-no-optics" eslint-plugin-auraglass.js && test -f tsconfig.storybook.json`.
- PRD-07 typed variant metadata. Sibling PRDs fix the convention as colocated `<Name>.meta.ts` files with the PRD-07 meta shape (`parts`, `states`, `variants`, `tier`, `rsc`, `apg`, `budgetKb`, `props`, `sizes`, `defaults`). Examples: `prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` REQ-CTL-15 uses `src/components/<kebab-name>/<Name>.meta.ts`; `prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` uses `src/components/overlays/dialog/Dialog.meta.ts`. Find the shape's type with `rg -n "ComponentMeta|export const meta" src -g '*.meta.ts' -g '*.ts'`. `metadata.ts` reads it, and must also be able to derive the §11.2 group and number and `supports.{interactive,prominent}`; if a field is absent, request it from PRD-07. If PRD-07 hasn't fixed the shape, SB-070..SB-089 are **blocked**. Don't invent a metadata format inside `.storybook`.
- PRD-05 APG harness (A11Y-073, `PROMPT_05f_A11Y_HARNESS_CERT.md`): `test -f tests/a11y/apg/harness.ts`; per flagship, `tests/a11y/apg/<kebab-component>.apg.spec.ts` (SC-30; owned by the component's PRD) exporting an `ApgScript` with `story`.
- PRD-07 parts registry and metadata (FND-005, `PROMPT_08a_FND_FOUNDATION_PATTERN.md`); `deprecations.json` generated output (REL-070/REL-117, `PROMPT_01d_REL_RUNTIME_42.md`) for `MigrationTable`.
- Per family: the owning PRD's components are exported from public entries and its story files exist (CTL `PROMPT_09_CTL.md`, OVL `PROMPT_10_OVL.md`, NAV `PROMPT_11g_NAV_SOURCE_META_STORIES.md`, DATA `PROMPT_12_DATA.md`, AI `PROMPT_13_AI.md`, MED `PROMPT_14_MED.md`, core `PROMPT_08c_FND_CORE_SERVER.md`/`PROMPT_08d_FND_CORE_INTERACTIVE.md`); removals are the FND RM squash PRs (`PROMPT_08f_FND_REMOVAL_EXECUTION.md`).

## 4. Steps (framework)
1. **SB-070 `metadata.ts`**: typed accessors over PRD-07 metadata: `matrixAxes(meta)` returns variant × thickness × (interactive, prominent) restricted to supported axes, `matrixCellCount(meta)` returns their product, and `stateCells(meta)` returns the public-prop states. No hard-coded component lists.
2. **SB-071 `defineComponentStories(meta, { metadata, fixtures, contexts })`** returns the named exports `Playground`, `States`, `Matrix`, `Scenes`, `InContext`, `LightDark`, `Preferences`, `RTL`, `Mobile`. Flagships additionally get `Keyboard`.
   - Tags: `flagship` or `core`, from metadata. `Matrix` is tagged `matrix` + `!autodocs`, with `parameters.a11y.test = 'off'` (PRD-19 checks it by OCR, REQ-SB-48). `Keyboard` is tagged `apg`, with `parameters.a11y.apgScript = 'tests/a11y/apg/<component>.apg.spec.ts'`.
   - `title` is `Flagships/<Group>/<Name>` or `Core/<Name>`.
   - Args are typed: `meta satisfies Meta<typeof C>` and `StoryObj<typeof meta>`. No `as any`.
   - `LightDark` and `Preferences` set `globals` (`scheme`; `transparency: glass|tinted|solid` × `contrast: more`; `forcedColors: active` note; `motion: none`) and render side-by-side through separate provider scopes. Use the provider's documented nested scope; if it has none, use separate stories `Preferences*` and record that.
   - `RTL` sets `globals.dir = 'rtl'`. `Mobile` sets viewport `mobile` and includes a `play` that asserts `scrollWidth ≤ clientWidth + 1` on `[data-ag-story-content]` and that every interactive element is ≥44×44 CSS px for flagships (≥24×24 for core; §14). Tag it `interaction`.
3. **SB-072 `StatesGrid.tsx`**:
   - Renders rest plus each applicable public-prop state (`disabled`, `loading`, `invalid`, `checked`/`value`, `selected`, `defaultOpen`).
   - Renders three more rest-state cells carrying `data-ag-state-cell="hover"|"pressed"|"focus-visible"` for PRD-19 to drive with real input. No pseudo-class simulation CSS.
4. **SB-073 `MatrixGrid.tsx`**: renders exactly `matrixCellCount(meta)` cells, each with `data-ag-matrix-cell="<variant>/<thickness>/<i>/<p>"`.
5. **SB-074 `ScenesStrip.tsx`**: the subject over each of the 8 scenes through 8 nested `Environment`s from `aura-glass/material` using `getScene()`. Read-only use of `.storybook/environment/scenes.ts`.
6. **SB-075 `InContextFragments.tsx`**:
   - Four fragments built only from `Surface`/`SurfaceGroup` plus the subject: gradient (`saturated-abstract`), photography (`photo`), colorful UI (a 3×3 control grid of the subject), and dense dashboard (a KPI row of 4 `Surface` cards with real metric copy).
   - Each fragment renders in light and dark.
   - Fragments have no background and no ink overrides; they must pass 17b's lint.
7. **SB-076/SB-077 pilot contract checks** (no file creation; SC-31/OV-16).
   - **Button**: run `story-contract.test.ts` against CTL-059's `src/components/button/Button.stories.tsx` (CTL-059 also deletes `GlassButton.stories.tsx` with its claim stories `:286-331,454-536` and invalid `'level2'` default `:59`). Assert the REQ-SB-12 required exports, §4.4 tags, `Matrix` cell count from `Button.meta.ts` (SC-24 axes: `variant` regular|clear|identity, `prominent`, `intent`), and `Keyboard` id == `ApgScript.story` in `tests/a11y/apg/button.apg.spec.ts` (CTL-060).
   - **Dialog**: same against OVL-055's `src/components/dialog/Dialog.stories.tsx`. `Playground` must open via `defaultOpen`; it is the REQ-SB-07 entrance story PRD-19 L9 Motion (REQ-QA-21) uses. APG spec `tests/a11y/apg/dialog.apg.spec.ts` (OVL-053).
   - CTL-059 today names stories `Overview`/`Matrix`/`Density`/`Keyboard`/`InContext`/`Preferences` with tag `certified`; report every gap as a defect against CTL-059/OVL-055 (O-SB-04). Additional owner stories are allowed within the REQ-SB-11 cap.
8. **SB-078 docs.**
   - `docs-blocks.tsx` exports `<Anatomy of={meta}/>` (a `data-ag-part` table from metadata), `<KeyboardTable script={…}/>` (generated from the APG spec steps), `<MigrationTable names={…}/>` (from `deprecations.json` entries whose replacement is this component), and `<DoDont/>` (2 live pairs rendered over `ScenesStrip` scenes).
   - Pilot MDX files `Button.mdx` and `Dialog.mdx` use the title `Flagships/<Group>/<Name>/Docs` and the headings, in order: `Usage`, `Anatomy`, `Material role` (text from §11.2's column), `Do/Don't`, `Keyboard`, `Migration from 4.x`.
9. **SB-082 Start Here.**
   - `build-start-here.mjs` reads the previous build's `index.json` (verify-fresh) and the inventory.
   - It writes `src/stories/StartHere.stories.tsx` with computed counts (flagships, core, stories, interaction stories), the version from `package.json`, and `linkTo` links validated against the index. An unresolved link exits 1.
   - The first build bootstraps from a CSF static parse via `loadCsf`.
10. **SB-090 Foundations.** `Foundations/Icons` is rebuilt from `src/stories/IconsGallery.stories.tsx` (real icons) without its hard-coded "412" (`:100`); delete the old file. Add `Foundations/Tokens` (generated from PRD-03 token TS), `Foundations/Motion` (PRD-06 tokens with replay), and `Foundations/Preferences` (`GlassPreferencesPanel`, PRD-05).
11. **SB-091 Migration.** `src/stories/migration/*.mdx`: one before/after page per §12 family that has a 5.0 target, titled `Migration/<Family>`. "Before" is code text only, not live 4.x components.
12. **SB-096 `ensure-component-inventory.js`**: emit `tier` (`flagship`|`core`|`foundation`|`remove`) per record from the post-PRD-16 inventory. Keep existing output fields.
13. **SB-092 deletions.** Delete the 12 text galleries (`BackgroundsGallery`, `ButtonGallery`, `ChartsGallery`, `ComponentGallery`, `ComponentsGallery`, `CoreGallery`, `DataDisplayGallery`, `FocusGallery`, `InteractiveGallery`, `LayoutGallery`, `NavigationGallery`, `WidgetsGallery` under `src/stories/`). Also delete `AppShell.stories.tsx`, `AuraGlassIcons.stories.tsx`, `GlassAuditCoverage.stories.tsx`, `ProductionWorkflowComponents.stories.tsx` and `AuraGlass33ThemeShowcase.stories.tsx`.
14. **SB-093** Delete `src/stories/CuratedComponentGuide.stories.tsx` only after SB-082 is green.
15. **SB-094** Delete `src/components/showcase/LiquidGlassStateMatrix.stories.tsx`, `src/components/templates/showcase/ComprehensiveShowcase.stories.tsx`, and every story or MDX matching `rg -l "LiquidGlassShowcase|LiquidGlassStateMatrix|ComprehensiveShowcase|EnhancementShowcase|StorybookVisualShowcase" -g '*.stories.tsx' -g '*.mdx' src showcase .storybook`. Confirm that RM-08 / PRD-01 has the `LiquidGlassShowcase` `deprecations.json` entry (`src/index.ts:736` root export); if it doesn't, report it. Don't edit `src/index.ts`.
16. **SB-095 stubs.** `list-stubs.mjs` lists titles whose story set is exactly {Default, Variants} (128 at HEAD per autopsy; record your measured count). For stubs whose inventory record is REMOVE, delete the stub in PRD-16's family PR. For survivors, the stub is replaced by the contract file in SB-083..089.
17. **SB-097** `src/stories/AuraGlass33MarketingLaunch.stories.tsx`: if PRD-16 keeps the marketing components (inventory `action` ≠ REMOVE), retitle it to `Showcases/Marketing` and make it pass the 17b lints. Otherwise delete it.

## 5. Steps (per-family rollout: one PR and one session each)
SB-083 Controls (CTL, flagships 1–14; date fields DATA-101), SB-084 Overlays (OVL, 15–21), SB-085 App Shell (NAV, 22–31), SB-086 Data (DATA, 32–37), SB-087 AI (AI, 38–42), SB-088 Media (MED, 43–44), SB-089 Core (FND, about 40; conformance only).

Each family PR does all of the following:
- (a) adds an MDX docs page per flagship at `src/stories/flagships/<group>/<Name>.mdx` (SB-083..088) and extends `story-contract.test.ts`/`docs-pages.test.mjs` expected counts to the family; the owner PRD's story files are the subject under test;
- (b) verifies that the owner PRD deleted every 4.x story absorbed by that family under §12 together with the FND RM source removal, so the index never shows both names (report leftovers against the owner task);
- (c) has `story-contract.test.ts`, `docs-pages.test.mjs` and the 17b lints green for that family's files at **zero** violations;
- (d) lowers `scripts/storybook/story-lint-baseline.json` and `tsc-stories-baseline.json` by the removed counts.

## 6. Tests to write and run
- `story-contract.test.ts` (Jest, `composeStories`):
  - every file tagged `flagship`/`core` exports exactly the REQ-SB-12 set (+`Keyboard` for flagships);
  - `Matrix` cell count === `matrixCellCount(metadata)`;
  - every `data-ag-state-cell` ∈ {hover, pressed, focus-visible};
  - each flagship `Keyboard` id === the `story` field read from `tests/a11y/apg/<component>.apg.spec.ts`, and a missing spec fails with `apg spec missing: <component>`.
- `storybook-index.test.mjs` (built index):
  - every title's first segment ∈ the REQ-SB-08 list;
  - `Flagships/*` groups in order Controls, Overlays, App Shell, Data, AI, Media, with titles ordered by §11.2 number;
  - ≤12 non-matrix stories per component title;
  - no title outside `Flagships`/`Showcases`/`Material Lab` has more stories than the smallest flagship title;
  - 0 {Default, Variants} titles;
  - 8 `cert-scene` ids;
  - 0 titles under `3.2`, `3.3`, `Reference`, `Effects + Advanced`, `Certification`, `Legacy`.
- `start-here.test.mjs`: 0 unresolved links, and 0 numeric literals in `StartHere.stories.tsx` other than layout values.
- `docs-pages.test.mjs`: one MDX per flagship (44 at completion; per-family counts before then), each with the 6 headings in order.
- `inventory-index.test.mjs` (DoD): every non-REMOVE inventory record has exactly one title.
- Local (light): `./node_modules/.bin/jest tests/storybook/story-contract.test.ts` and `node --test tests/storybook/start-here.test.mjs`. The index-dependent tests and Vitest/axe run in `storybook-tests.yml` on the PR.

## 7. Visual evidence (remote)
**SB-099:** for each pilot and each family PR, capture via PRD-19's lane the `States`, `Matrix`, `Scenes` and `Mobile` stories at 1440 and 390 over `photo` and `flat-black`. Attach the artifact URL, the axe result (0 violations on non-`matrix` stories, AC-SB-11) and the `Mobile` play results. A human reviews; you can't view the PNGs.

## 8. Integrity rules (binding)
- No stub export that renders nothing or a placeholder just to satisfy the export set. If a component lacks a state, metadata says so and the cell is omitted, not faked.
- No hand-written matrices. No `as any`.
- No copy from the banned list.
- Don't delete a 4.x story whose component survives without adding its replacement in the same PR.
- No `.skip`/`.only`, no axe rule disabling beyond the `matrix` tag, no snapshot updates to pass.
- No local browser, no local Docker.

## 9. Exit criteria
- AC-SB-04: `storybook-index.test.mjs` green; the first 5 roots are Start Here, Material Lab, Scenes, Showcases, Flagships.
- AC-SB-05: 44/44 flagships and 100% of core titles export the REQ-SB-12 set; 0 stubs.
- AC-SB-10 (linkage): 44/44 `Keyboard` stories tagged `apg` and linked to existing specs.
- AC-SB-11: 0 axe violations with `color-contrast` on across non-`matrix` stories in the `vitest` job.
- REQ-SB-09/14/17/33: tests green; deletion lists empty.

## 10. Final report format
```
PROMPT-17e REPORT
Branch/SHA (framework or family=<name>):
Tasks: SB-070..SB-099 -> done|blocked (reason) each
Prereq status: FND-005 metadata shape, A11Y-073 APG harness, family story tasks (ids), FND RM pairing (cmd + output)
Counts: flagships with contract N/44, core N/M, stubs remaining, MDX pages N/44, axe violations
Baseline deltas: optics/important/tsc/copy before -> after
Remote evidence: capture artifact URLs, vitest run URL
Deviations: (with evidence) or none
Files changed / deleted:
```
