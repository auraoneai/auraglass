# PROMPT-11g (NAV): SourceTransition, typed metadata, labels, component stories S-01..S-08, `app-frame` block content, showcase shell parts, readme

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md` SC-27, SC-31, SC-32; key crosswalk `PROMPT_11_NAV.md`), §5.11, §5.12 (REQ-82..84), §8, §13, §20 steps 10–11; DoD items 3, 5, 6.
Requirement IDs: REQ-NAV-73, -74, -75, -76, -82, -83, -84; Storybook S-01..S-08; REQ-NAV-01/-03 (app-frame block, showcase shell parts).
Acceptance: AC-NAV-20 (automated half: six non-identical stories, 0 `<style>`, 0 `!important`), AC-NAV-22 (metadata deliverables). Tasks: NAV-092..NAV-107, NAV-144.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture and `_shared-contracts.md` win; deviations reported with evidence.
- No fake completion: no own View Transition engine (PRD-MOT `startMorph` only), no placeholder or mock `Table`/`Timeline` in any story or block (if the PRD-DATA `Table` is not certified, the `Saas` story is BLOCKED, not stubbed), no story with inline layout, `<style>` blocks, hex literals or `!important`, no aliased stories, no `test.skip`/`fixme`/`it.todo`, no snapshot updates. Missing prerequisite ⇒ BLOCKED with output.
- Remote-first: Storybook build/test-runner, motion specs and registry render specs run in CI or `auraone-remote-run`. Local: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`. Do not run `npm run storybook` locally for verification.
- Ownership (SC-31/SC-32): NAV owns its component story files `src/**/<Name>.stories.tsx`, the `app-frame` block **content** and the per-component `*.meta.ts`. PRD-SB owns `.storybook/**`, the story contract, generated matrices, `showcase/**` files and the deletion of `src/stories/AppShell.stories.tsx`, `AppChromeVisualBaseline.stories.tsx` and `NavigationGallery.stories.tsx`. PRD-DX owns `registry/registry.json`, the schema, build, lint and render harness.
- `SourceTransition.tsx` is `"use client"`. React 19 ref-as-prop everywhere (REQ-NAV-83).

## Prerequisites (verify)

1. PROMPT-11b..11f merged: `rg --files src/app-shell src/components/navigation | rg '(AppShell|Sidebar|TopBar|Inspector|StatusBar|MobileShell|ResizablePanels|Tabs|TabBar|Breadcrumbs|Pagination|Command|CommandPalette)\.tsx$'` lists all 13.
2. PRD-MOT `startMorph`/`useMorphName` (MOT-045, MOT-048): `test -f src/motion/viewTransition.ts`; motion scale `--ag-duration-small` present in `dist/tokens.css` (DS-026/053).
3. PRD-SB: `.storybook/preview.tsx` rewritten (SB-048, `environment` global with the 8 SC-28 scenes, `certify` mode); `test -f .storybook/contract/defineComponentStories.tsx` (SB-071); showcase files exist for `ops-console`, `collaborative-workspace`, `mobile-productivity` (SB-105, SB-111, SB-112).
4. PRD-DATA `Table` (DATA-038) exported (`rg -n "export (const|function) Table\b" src`); PRD-FND `Card` (FND-050), `Avatar` (FND-072), `Container` (FND-047).
5. PRD-DX registry: `test -f registry/registry.json` (DX-067), `test -f scripts/registry/lint.mjs` (DX-070), `test -f tests/dx/registry-render.spec.ts` (DX-094).
6. PRD-A11Y provider dev blur counter overlay (A11Y-029) for S-06. PRD-FND parts registry `src/foundation/parts.ts` (FND-005).

## May touch

NEW `src/primitives/SourceTransition.tsx`, `src/primitives/SourceTransition.test.tsx`; NEW per-component metadata `src/app-shell/{AppShell,Sidebar,TopBar,Inspector,StatusBar,MobileShell,ResizablePanels}.meta.ts`, `src/components/navigation/{Tabs,TabBar,Breadcrumbs,Pagination,Command,CommandPalette}.meta.ts`, `src/primitives/SourceTransition.meta.ts`, plus the re-export-only aggregates `src/app-shell/meta.ts` and `src/components/navigation/meta.ts`; NEW `src/app-shell/meta.test.ts`, `src/app-shell/labels.test.tsx`; `labels` prop wiring in the 5.0 files from 11b–11f; NEW `tests/motion/source-transition.spec.ts`; NEW component story files `src/app-shell/{AppShell,Sidebar,TopBar,Inspector,StatusBar,MobileShell,ResizablePanels}.stories.tsx`, `src/components/navigation/{Tabs,TabBar,Breadcrumbs,Pagination,Command,CommandPalette}.stories.tsx`, `src/primitives/SourceTransition.stories.tsx`; NEW `src/app-shell/AppShell.mdx`; `.storybook/preview.tsx` (MODIFY through the SB-048 contract only: S-05/S-06 options, no second decorator); NEW `registry/blocks/app-frame/` content (files only; DX-071 registers it); shell-part compositions inside `showcase/{ops-console,collaborative-workspace,mobile-productivity}/` (MODIFY, NAV-144); `docs/app-shell/readme.md`; `src/index.ts` (add `SourceTransition`, `startSourceTransition`).

## Must not touch

`src/primitives/LiquidGlassSourceTransition.tsx` (removed in 11i), `src/motion/**`, `.storybook/contract/**` and other PRD-SB decorators, `src/stories/**` (PRD-SB deletes `AppShell.stories.tsx`, `AppChromeVisualBaseline.stories.tsx`, `NavigationGallery.stories.tsx`; SB-092, SB-106), `registry/registry.json` and `scripts/registry/**` (PRD-DX), `registry/blocks/{mobile-settings,support-inbox}/` (PRD-DX blocks), `src/registry/recipes.ts` (retired in 11i, NAV-136), any 4.x component.

## Steps

1. **SourceTransition (REQ-NAV-73..76).** `SourceTransition = { Root, Source, Destination }` + `startSourceTransition(id, update)`. Root holds a registry `Map<id, {source?, destination?}>`. On start: set `view-transition-name: ag-src-<sanitised id>` (via `useMorphName`) on the source only, call PRD-MOT `startMorph(() => { source.style.viewTransitionName = ""; update(); destination.style.viewTransitionName = name; }, { surfaces: [source, destination] })`, and clear the name after `finished`. Dev warning on a duplicate active id. Both parts render `data-ag-vt-participant`. `motion=calm` ⇒ opacity cross-fade ≤ `--ag-duration-small` (SC-19); `none` ⇒ synchronous. After the transition, if the source had focus, focus the destination's first focusable, or the destination itself with `tabIndex=-1`. Final state `opacity: 1`, identity transform.
2. **Metadata (REQ-NAV-82, SC-27).** One `<Component>.meta.ts` per exported component, `as const`: `parts` (kebab-case names from `src/foundation/parts.ts`), `states` (`data-state` values), `slots`, `variants` (typed unions incl. `appearance`), `keyboard` table, `selectorChanges4x` (§11.3 and §11 item 4), `migration` (4.x prop/name → 5.0 rows consumed by the 4to5 `mappings/*.json` and `app-shell-slots`, SC-33), budget row name (§16.1), `storyIds`. The two aggregates only re-export.
3. **Labels (REQ-NAV-84).** Every root that renders user-visible text accepts `labels` (typed partial record): `AppShell` (`skipToMain`, `collapseSidebar`, `expandSidebar`, `openNavigation`), `Breadcrumbs` (`breadcrumb`, `showMore(n)`), `Pagination` (`pagination`, `page(n)`, `pageOf(n,m)`, `previous`, `next`), `Command` (`results(n)`, `empty`, `loading`), `ResizablePanels` (`resize(label)`), `Inspector` (`close`). No other English literal in these files (`labels.test.tsx` enforces).
4. **Ref pattern (REQ-NAV-83).** Confirm `rg -n "forwardRef" src/app-shell src/components/navigation/{Tabs,TabBar,Breadcrumbs,BreadcrumbsOverflow,Pagination,PaginationButtons,Command,CommandPalette}.tsx src/primitives/SourceTransition.tsx` = 0. Add these paths to the PRD-QA L1 static scope (QA-078) through NAV-117.
5. **S-01 product shells.** In `src/app-shell/AppShell.stories.tsx` (authored with `defineComponentStories`, SB-071; meta `title: "Flagships/App Shell/AppShell"`, REQ-SB-08/10), add six InContext variants: `Saas` (name "SaaS Admin"), `AiCommandCenter` ("AI Workspace"), `Mail`, `Settings`, `MobileApp`, `CommandCenter`, composed exactly as in PRD §13 S-01, with product-realistic copy, unmodified 5.0 components, and no `<style>`, inline layout, hex or `!important`. Ids resolve to `flagships-app-shell-appshell--saas` and `flagships-app-shell-appshell--ai-command-center`. Report them for PRD §21 O-04 (PERF/QA subject rename).
6. **S-02..S-08.** S-02 matrices are generated by the PRD-SB contract `Matrix` export from the `*.meta.ts` states; NAV writes no matrix generator. S-03 is a `containerWidth` arg (320–1920) on the AppShell playground. S-04 adds RTL variants of S-01. S-05 consumes the PRD-SB toolbar globals (no new globals here). S-06 renders the PRD-A11Y dev counter overlay in S-01. S-07 is the MDX page generated from `*.meta.ts`. S-08 adds `play` functions for drawer open/close, tab keyboard, splitter keyboard and command search. Every flagship 22–31 gets its own `Flagships/App Shell/<Name>` story file.
7. **`app-frame` block content (SC-32, NAV-106).** Put the content files under `registry/blocks/app-frame/` (AppShell + Sidebar + TopBar + StatusBar + Inspector, replacing the `saas-admin-shell` recipe), with `layout.assert.json` (sidebar-beside-main at 1440; no overflow at 390), 0 `!important` and 0 hex. Pass `scripts/registry/lint.mjs`. PRD-DX scaffolds it and registers it in `registry/registry.json`. `mobile-settings` and `support-inbox` are PRD-DX blocks.
8. **Showcase shell parts (NAV-144).** Supply the shell compositions that the PRD-SB showcases `ops-console`, `collaborative-workspace` and `mobile-productivity` import, using the public API only. PRD-SB owns the files and their import/determinism tests.
9. **Readme.** Rewrite `docs/app-shell/readme.md` from the metadata. Drop the fragment-as-sidebar example. Document the `cookies()` + `parseAppShellCookie` recipe, router `render` usage and the `layout="desktop"` override.
10. **Verify the deletions (NAV-105).** Check that PRD-SB has deleted `src/stories/AppShell.stories.tsx`, `AppChromeVisualBaseline.stories.tsx` and `NavigationGallery.stories.tsx`. Do not delete them here.

## Tests

- `src/primitives/SourceTransition.test.tsx` › `unique view-transition-name allocation and cleanup`, `focus follows morph`, `FLIP fallback path when startViewTransition is absent` (asserts `startMorph` is called; the engine is PRD-MOT's).
- Remote `tests/motion/source-transition.spec.ts` per engine path (fixtures: `<ViewTransition>` present, `startViewTransition` only, neither) › `reduced motion final state visible`.
- `src/app-shell/meta.test.ts` › `every rendered part is declared`, `aggregates only re-export per-component metas`.
- `src/app-shell/labels.test.tsx` › pseudo-locale (`[!! … !!]`) renders all components with 0 English defaults remaining.
- Remote Storybook test-runner: S-08 play functions; a `story-dom-hash` check that the six S-01 stories are pairwise non-identical and contain 0 `<style>`/`!important`; the PRD-SB `story-contract` and `lint-titles` checks; `tests/dx/registry-render.spec.ts` case `app-frame`; the SB showcase imports and determinism tests.

## Visual evidence

Remote Storybook build. Capture screenshots of all six S-01 stories × 8 scenes × light/dark at 1440 and 390, plus the S-02 matrices, as CI artifacts for the 11i human review. Nothing from here is committed as a baseline.

## Exit criteria

- AC-NAV-20 (automated half): six S-01 stories exist, their DOM hashes differ pairwise, and they contain 0 `<style>` and 0 `!important`.
- AC-NAV-22 (metadata half): a `*.meta.ts` exists for every flagship 22–31 and `./app-shell` member, with parts, states, keyboard, selector table, `migration` and the budget row.
- REQ-NAV-73..76 and 82..84 tests green; `app-frame` renders in the DX harness.

## Final report format

```
PROMPT-11g REPORT
Commit: <sha>   Remote runs: <URLs>   Storybook artifact: <URL>
Prerequisites 1-6: <ok | missing + output>
Tasks NAV-092..107, NAV-144: DONE | BLOCKED(<reason>)
REQ-NAV-73..76, 82, 83, 84; S-01..S-08: <test> -> pass/fail
AC-NAV-20 (automated), AC-NAV-22 (metadata): PASS/FAIL
Story ids: <list>  DOM hashes: <list>
Files changed / Deviations / Open items touched (O-04, O-05)
```
