# PROMPT-11i (NAV): `app-shell-slots` transform, migration fixtures, compat adapters, deprecations, E-15 4.2 fix, removal PRs, manual lane and sign-off

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md` SC-02..04, SC-08, SC-33, SC-34, SC-36, SC-38; key crosswalk `PROMPT_11_NAV.md`), §6, §7, §9, §10 (API-01..18), §11, §15 (manual lane), §17, §18 DoD 1/3/4/6/7, §20 steps 13–15.
Requirement IDs: migration/removal obligations of §9/§10/§11 for every REQ family; REQ-NAV-35 (workspace subpath removal); DoD items 4, 6, 7.
Acceptance: AC-NAV-18, AC-NAV-19, AC-NAV-20 (human review), AC-NAV-21, AC-NAV-22. Tasks: NAV-120..NAV-143, NAV-145.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture wins; deviations reported with evidence.
- D-27: no 5.0 removal PR merges until the name's `deprecations.json` entry has **shipped** in 4.2 (subpaths, DEPRECATE/REMOVE names) or 4.3 (renamed and CONSOLIDATE/REDESIGN/REPLACE/POLISH/KEEP losers), verified against the published `aura-glass@4.2.x`/`4.3.x` tarball (`npm view aura-glass versions` + the tarball's `deprecations.json`). One revertable PR per family (§14.6).
- No fake completion: no codemod that emits a TODO on the flagship subset (§15.2 zero-TODO canary; handler-only rail/tab-bar items become `render={<button type="button" onClick={handler} />}`), no compat adapter for DEPRECATE/REMOVE names or `GlassHeader` consciousness exports, no deleting tests to make removals compile (delete a 4.x test only together with its component), no snapshot updates, no `test.skip`. Human-review and screen-reader items are recorded as performed by a named reviewer; an agent may not mark them PASS.
- Remote-first: frozen-fixture migration run, API Extractor, Storybook and canaries in CI / `auraone-remote-run`. Local: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`, `rg`.
- Ownership: the 4to5 engine, catalogue and `src/compat/index.ts` belong to PRD-DX (DX-041, DX-042, DX-065); the codemod id catalogue and `deprecations.json` schema belong to PRD-REL (SC-33, SC-02/03). This prompt owns the NAV area transform `app-shell-slots` (NAV-145), its fixtures, the `migration` rows in the NAV `*.meta.ts`, the adapters `src/compat/app-shell/<OldName>.tsx` and `src/compat/navigation/<OldName>.tsx` (SC-34; matches PRD §8), the NAV `deprecations.json` entries (MODIFY only), and the `src/registry/recipes.ts` removal (NAV-136, sole remover per SC-38).

## Prerequisites (verify)

1. PROMPT-11h report: AC-NAV-01..10, 14, 16, 17 PASS on the release-candidate SHA.
2. PRD-TRUST/PRD-REL: repo-root `deprecations.json` exists with `version: 1` (TRUST-075; `rg -n '"version": 1' deprecations.json`), schema `docs/schemas/deprecations.schema.json` (REL-010), gate `scripts/release/verify-deprecations.mjs`, generator `scripts/release/gen-deprecations.mjs` (REL-070), API scripts `scripts/release/{api-report,export-snapshot}.mjs` (REL-003), `warnDeprecated` (REL-072).
3. PRD-REL 4.2/4.3 bridge (interim owner of §16 PRD-17, SC-37; REL-082, REL-090, REL-125): 4.2 and 4.3 published with this PRD's deprecations (check tarballs). Missing ⇒ removal tasks BLOCKED; mapping/adapter/fixture tasks proceed.
4. PRD-DX: `packages/cli/src/migrate/4to5/{index.ts,catalogue.json}` (DX-041, DX-042) with the core `prop-grammar` and `imports-subpaths` transforms (DX-048, DX-045) and the `__fixtures__/<id>/<case>/` convention; `app-shell-slots` registered in the catalogue (PRD §21 O-08, otherwise NAV-145 is BLOCKED); `src/compat/index.ts` (DX-065); `doctor --v5` (DX-037). PRD-REL frozen 4.x fixture `tests/fixtures/consumer-4x/` (REL-115, SC-08), containing a root `GlassAppShell` page and an `aura-glass/app-shell` page.
5. PRD-MED: `ImageViewer.Inspector` (MED-119) landed and `LiquidGlassPhotoInspector` removal PR merged or queued (gates NAV-134 only).
6. PRD-A11Y: deleting the three skip-link implementations is PRD-A11Y's job (do not delete `src/primitives/focus/SkipLinks.tsx` here).

## May touch

NEW `packages/cli/src/migrate/4to5/transforms/app-shell-slots.ts` and `__tests__/app-shell-slots.test.ts` (NAV-145); NEW `packages/cli/src/migrate/4to5/__fixtures__/app-shell-slots/<case>/{input,output}.tsx` plus NAV cases under the core ids' folders (`__fixtures__/{prop-grammar,imports-subpaths,canonical-names,removed}/nav-*`); no hand-written mapping JSON (mappings come from the `*.meta.ts` `migration` fields through `gen-deprecations.mjs --codemods`); NEW `src/compat/app-shell/*.tsx`, `src/compat/navigation/*.tsx`, NEW `src/compat/__tests__/app-shell.test.tsx`; repo-root `deprecations.json` (MODIFY: entries for every §9 row); deletions listed per family below; `src/index.ts`, `src/components/navigation/index.ts`, `src/components/layout/index.ts`, `src/app-shell/index.ts` (drop 4.x names); `package.json` `exports` (remove `./workspace`, `./workflows`); `src/registry/recipes.ts` (delete; NAV-136 is the sole remover, and PRD-AI AI-112 depends on it); `src/workspace/index.tsx` on `release/4.x` only (E-15 fix, NAV-143); `docs/auraglass-5/release/NAV-deliverables.md` (NEW, §11.3 index generated from `meta.ts`; artifact pointer list only, no claimed results); `docs/auraglass-5/release/NAV-review-sheet.md` (created by 11h; reviewers fill it, the agent only collects); `etc/api/app-shell.api.md`, `etc/api/app-shell.exports.json` and the nav rows of `etc/api/index.*` (generated by the PRD-REL scripts, SC-04); NEW `packages/cli/src/migrate/4to5/__fixtures__/app-shell-slots/frozen-fixture.test.ts`; NEW `tests/dx/fixtures/doctor-v5/app-shell-selectors.css`.

## Must not touch

5.0 component internals (fixes go back to 11a–11g), `src/components/media/LiquidGlassPhotoInspector.tsx` (PRD-13), `src/primitives/focus/SkipLinks.tsx` (PRD-05), `GlassToolbar.tsx`/`LiquidGlassToolbar.tsx`/`GlassMenubar.tsx`/`HeaderUserMenu.tsx` (PRD-08/PRD-09), `release/4.x` except the E-15 fix (PRD-REL runs the 4.x warnings and gates); `scripts/release/**`, `docs/schemas/**`, `packages/cli/src/migrate/4to5/{index.ts,catalogue.json}` (PRD-REL/PRD-DX).

## Steps

0. **E-15 on the 4.2 train (NAV-143; SC-36).** On `release/4.x`, stop spreading `value`/`onValueChange` onto `<div role="tablist">` in `GlassWorkspaceTabs` (`src/workspace/index.tsx:93`). Add a regression test. Class C-I, no API change. It must land before the PRD-REL 4.2.0 gate record (REL-090). E-22 is a 4.1.1 fix that PRD-TRUST implements, so this prompt does not touch it.
0b. **`app-shell-slots` transform (NAV-145; SC-33).** Implement `transforms/app-shell-slots.ts` on the PRD-DX engine. It converts inline-JSX slot props to `data-ag-slot` compound children (API-02) and maps `GlassAppShell` `header`/`footer` to `TopBar`/`StatusBar` (API-04). Unmappable cases emit `// TODO(aura-glass 5): <reason>, see <doc>`.
1. **Mapping fixtures (§10 API-02..13, §11 item 3).** One fixture pair per absorbed §7 name: `GlassAppShell` (both), `ZSpaceAppLayout`, `GlassSidebar`/`Rail`/`Panel`, `LiquidGlassInsetSidebar`, `GlassNavigationMenu`, `GlassTopBar`, `GlassHeader`, `GlassTabs`, `GlassPageTabs`, `GlassTabBar`, `GlassWorkspaceTabs`, `LiquidGlassTabBar`, `GlassBottomNav`, `LiquidGlassBottomAccessory`, `GlassMobileNav`, `GlassBreadcrumb(s)`, `GlassPagination`(+`WithInfo`), `GlassCommandPalette`, `GlassCommand`, `LiquidGlassCommandSurface`, `GlassSplitPane` (root), `LiquidGlassTransitionProvider`/`Source`/`Destination`, `LiquidGlassInspectorPanel`, workspace `GlassInspectorPanel`, `GlassStatusBar`, `GlassMobileShell`, `GlassMain`, `GlassPage`, `GlassPageHeader`, `GlassActionBar`, `GlassCommandBar`. Value maps: `left→start`, `right→end`; `collapsed={x}` → `sidebar={x ? "rail" : "expanded"}`; `currentPage/totalPages` → `page/pageCount`; `direction` → `orientation`; index-based `onChange(e,i)` is the only TODO and is outside the flagship subset. Removed-without-adapter names emit the `removed` TODO naming the successor.
2. **Compat adapters (§11 item 8; SC-34).** One file `src/compat/<area>/<OldName>.tsx` per name with a successor, re-exported by `src/compat/index.ts` (DX-065) and calling `warnDeprecated(id)` (REL-072) (inventory KEEP/POLISH/REDESIGN/REPLACE/CONSOLIDATE), mapping 4.x props to 5.0 children; one dev warning per symbol; `ZSpaceAppLayout` drops depth layers with a one-time warning. None for `EnhancedGlassTabs`, `GlassTabItem`, `GlassResponsiveNav`, `GlassCommandDock`, `GlassNavigation`/`GlassNavbar`, `TabBarContainer`/`TabSelector`, `LiquidGlassSearchTab`, `MobileGlassNavigation`, app-shell `GlassSplitPane`, `GlassResizablePanel`, app-shell `GlassIconButton`, `GlassHeader` consciousness exports.
3. **deprecations.json (SC-02/03; MODIFY only).** Add one entry per §9 row in the PRD-REL schema: `id` (`DEP-NNNN`), `kind` (`export|subpath|prop|prop-value|css-global|data-attr|…`), `status`, `entry`, `symbol`, `since` (`4.2.0` or `4.3.0` per the §9 column rule), `removeIn: "5.0.0"`, `replacement`, `codemod` (an SC-33 id: `app-shell-slots`, `prop-grammar`, `imports-subpaths`, `canonical-names`, `removed`, or null), `automation`, `breaking`, `message` (≤200 chars), `doc`, optional `compat`. Record the reason in `message`/`doc` (no-successor rows: API-CONSISTENCY-02 for consciousness headers; §4.7 budget for ZSpace depth).
4. **Removal PRs (one per family, each after step 3 shipped):** shell; workspace/workflows subpaths; sidebar; header/nav; tabs; tab bar; breadcrumbs; pagination; command; split/resizable; source transition; inspector (with/after PRD-13). Each PR deletes exactly the §6 paths of that family (component + test + story + `__snapshots__`), updates barrels, keeps `npm run typecheck` and `npm test` green, and links its `deprecations.json` entry.
5. **Root exports + recipes.** `src/index.ts` lines 72/82/91 and nav exports switch to 5.0 names; `src/registry/recipes.ts` app-shell recipes removed (replacements are 11g blocks).
6. **Frozen fixture (AC-NAV-18).** Remote: `migrate 4to5` on the frozen fixture; compile, render, count TODOs on the flagship subset = 0; every fixture pair passes.
7. **API report (AC-NAV-19).** Remote `scripts/release/api-report.mjs` and `export-snapshot.mjs --tarball` (PRD-REL, SC-04) for slugs `index` and `app-shell` match §10; every removed name present in `deprecations.json` with a 4.x version.
8. **Human review (AC-NAV-20) and manual lane (AC-NAV-21).** Prepare the checklist from 11g/11h remote screenshots: per S-01 story, items specular quality, optical hierarchy, radius rhythm, "reads as one hand" (pass/fail each). Manual lane scripts from `tests/a11y/apg/*` for VoiceOver macOS/iOS, NVDA/Chrome, TalkBack/Chrome, physical touch. Record reviewer name, date, defects; the agent only prepares and collects.
9. **Deliverables index (AC-NAV-22).** Generate `NAV-deliverables.md` from `meta.ts`: per flagship 22–31 link metadata, part contract, selector table, registry block, APG script, budget row, perf grade artifact, env-matrix baseline artifact, codemod fixtures. Missing link = AC-NAV-22 FAIL.
10. **doctor selectors (§11 item 2).** Supply PRD-DX `doctor --v5` (DX-037) with the selector list `.glass-app-shell*`, `.glass-sidebar*`, `.glass-top-bar`, `.glass-status-bar` as the fixture `tests/dx/fixtures/doctor-v5/app-shell-selectors.css` (NAV-141).

## Tests

- `src/compat/__tests__/app-shell.test.tsx` › renders every adapter with its 4.x props; exactly one dev warning per symbol.
- `packages/cli/src/migrate/4to5/__tests__/app-shell-slots.test.ts` and the PRD-DX core transform tests over the NAV fixture cases (input → output equality); `tests/release/codemod-catalogue.test.ts` (REL-106) lists `app-shell-slots`.
- `scripts/release/verify-deprecations.mjs` green over the NAV entries.
- Remote: frozen-fixture `migrate 4to5` job on `tests/fixtures/consumer-4x/`; `tests/release/api-report.test.ts` and `export-snapshot.test.ts`; full Jest + typecheck on each removal PR; 11h lanes re-run on the final SHA.

## Visual evidence

Human-review sheet referencing remote screenshot artifact URLs per S-01 story × scene; no screenshots committed.

## Exit criteria

AC-NAV-18 (0 TODOs; every §7 name has a passing fixture), AC-NAV-19, AC-NAV-20 (signed by design reviewer; any fail blocks GA), AC-NAV-21 (0 blocker defects), AC-NAV-22; DoD 7: no §6 "deleted" file remains (`rg --files src | rg -f <deleted-list>` = 0), inventory REMOVE = 0 for this boundary.

## Final report format

```
PROMPT-11i REPORT
Final SHA: <sha>
Prerequisites 1-6: <ok | missing + output>
Tasks NAV-120..143, NAV-145: DONE | BLOCKED(<reason>)
Removal PRs: <family> -> <PR URL> -> deprecations entry version
Fixtures: <count> pass / <count> total; TODOs on flagship subset: <n>
AC-NAV-18, 19, 20, 21, 22: PASS/FAIL + artifact/reviewer
Remaining §6 files: <list or none>
Deviations: <none | item + evidence>; Open items touched: O-03, O-08
```
