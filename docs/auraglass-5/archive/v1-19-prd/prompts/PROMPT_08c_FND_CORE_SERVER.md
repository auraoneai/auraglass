# PROMPT-08c (FND): T0 layout/type + server-safe T2 core

You are implementing part of `PRD-FND` (Component Remediation, key FND, self-id PRD-08; REQ-FND-*) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Prose `PRD-xx` means architecture §16 numbering (`PRD-02` = `PRD-PKG`, `PRD-04` = `PRD-MAT`, `PRD-19` = `PRD-QA`/`PRD-SB`). Task `depends_on` holds only real task ids (SC-40). The registry `docs/auraglass-5/prd/_shared-contracts.md` is binding: SC-15 (size budgets file is PKG's), SC-24 (prop grammar: status is `intent`, never `tone`; no `as`, `material` or `elevation`), SC-28 (scene ids), SC-30 (APG spec paths), SC-31 (stories owned here, preview owned by SB).

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` deviations 4 and 7, §4.1, §4.2 (rules), §4.3, §4.5 rows 1, 2, 5, 6, 10, 11, 12, 15, 22, 23, 29, 31–33, 35–40, §4.6 "T2 core and T0 layout", §5.4 REQ-FND-25/26/27/30/37/39/40, §5.7, §13–§16.
- Architecture: §4 (content materials, D-08), §9.1 (server-safe rules), §10, §11.1 (T0/T2 rows), D-14, D-24.
- Upstream: `AURAGLASS_MATERIAL_ENGINE_PRD.md` (content layers, `data-ag-backdrop="media"`), `AURAGLASS_PACKAGING_BUILD_PRD.md` REQ-PKG-80/81 (`canaries/next16`), `AURAGLASS_PERFORMANCE_PRD.md` REQ-PERF-01 (`docs/size-budgets.json`), `AURAGLASS_COMPONENT_EXPANSION_PRD.md` X-53 (no `Banner`).
- Inventory: `docs/auraglass-5/component-inventory.json` (filter with node by `name`), appendix `docs/auraglass-5/prd/appendix/component-dispositions.md`.
- Tasks: `docs/auraglass-5/tasks/FND.json` FND-043..FND-070.

Requirements: REQ-FND-25 (server set), 26, 27, 30, 37, 39, 40, 53 (rows), 54, plus REQ-FND-03/08/13/14/16 applied to these components. Acceptance: AC-FND-04 (these components), AC-FND-06 (T0 rows 35–40 and server T2, verified in 08g), AC-FND-16.

## 2. Components in this prompt (directory → seed)
T0: `text/` Text ← `src/components/data-display/Typography.tsx`; `heading/` Heading ← Typography + `src/components/marketing/DisplayText.tsx`; `stack/` Stack ← `src/components/layout/GlassStack.tsx`; `grid/` Grid ← `src/components/layout/GlassGrid.tsx` + `GlassMasonry.tsx`; `container/` Container ← `src/components/layout/GlassContainer.tsx`; `src/icons/` Icon + `createIcon` + per-glyph modules ← `src/icons/components.tsx`, `src/icons/createGlassIcon.tsx`.
Server T2: `card/` Card ← `src/components/card/GlassCard.tsx`; `badge/` Badge ← `data-display/GlassBadge.tsx`; `separator/` Separator ← `layout/GlassSeparator.tsx`; `kbd/` Kbd (NEW); `description-list/` DescriptionList (NEW); `state-views/` EmptyState/ErrorState/LoadingState ← `data-display/Glass{Empty,Error,Loading}State.tsx`; `steps/` Steps ← `interactive/GlassStepper.tsx` (R-08: the flow one, not `input/GlassStepper.tsx`); `link/` Link (NEW); `alert/` Alert ← `data-display/GlassAlert.tsx`; `skeleton/` Skeleton ← `data-display/GlassSkeleton.tsx`; `avatar-group/` AvatarGroup ← `interactive/GlassAvatarGroup.tsx`; `image-list/` ImageList (+ `Item`, `ItemBar`) ← `src/components/image-list/ImageList.tsx`.

The PRD §8 directory list has no `avatar-group/`. AvatarGroup is a separate server export from the client `Avatar` (08d), so it gets its own directory. This is a recorded deviation; list it in the report.

## 3. Scope
May create or modify:
- The directories above. Each gets `<Name>.tsx`, `<Name>.css`, `<Name>.meta.ts`, `index.ts`, `<Name>.test.tsx`, `<Name>.stories.tsx` per PRD §4.1. Existing dirs `card/` and `image-list/` are rewritten in place. The 4.x files in them (`GlassCard.tsx`, `GlowingCard.tsx`, `div.tsx`, `glass-card-link.tsx`, `patterns.tsx`, `ImageListItem*.tsx`, `*.module.css`) are deleted in the same PR **only** if they have no root export left. Otherwise they stay until 08f RM-11.
- `src/icons/**` (Icon rebuild; `createIcon.tsx` is deleted by 08b RM-12)
- `src/index.ts` (add the new exports; do not remove 4.x lines, 08f does)
- NEW `tests/ssr/t2-server-safe.test.tsx`, NEW `src/icons/__tests__/icon-a11y.test.tsx`, NEW `tests/e2e/material/content-layer.spec.ts`, NEW `tests/e2e/layout/grid-masonry.spec.ts`, NEW `tests/a11y/apg/steps.apg.spec.ts`
- `canaries/next16/app/server/page.tsx` server-safe export list **only** (MODIFY; PKG-122 creates the page and PKG-123 the spec)
- `docs/size-budgets.json` (MODIFY, append rows only; SC-15: file, schema and gate `verify-size-budgets.mjs` owned by PKG, PKG-048/049; default ceilings by PERF REQ-PERF-01; rows at or below the ceiling; record each change in `docs/size-budgets.changelog.md`)
- `tests/foundation/contract-coverage.json` (append names); `tests/types/no-legacy-onchange.test-d.ts` (`OWNED_PROP_TYPES` append)
- Generated `apps/docs/content/components/<name>.parts.md` (via `scripts/docs/gen-component-docs.mjs`; never `docs/components/**`, which RM-13 deletes)

Must NOT touch: `src/material/**` (PRD-04), `src/theme/**` (PRD-05), tokens (PRD-03), `.storybook/preview.tsx` (PRD-19), flagship directories (PRD-08..13), `package.json` `exports` (PRD-02; if a subpath entry is missing, report it), 4.x loser files that other components still import.

## 4. Prerequisites (check each; stop with a blocker report if a hard one fails)
- 08a and 08b merged: `test -f src/foundation/parts.ts && test -f src/primitives/VisuallyHidden.tsx && [ "$(rg -o -w forwardRef src --glob '!src/compat/**' | wc -l)" = 0 ]`.
- PROMPT_04 MAT, anchors MAT-047 (`Surface`, `materialProps()`) and MAT-015 (`material.css`) (hard): `rg -n "export (function|const) (materialProps|Surface)" src/material` and the content-layer CSS (`rg -n "data-ag-layer=.content" src/material`).
- PROMPT_03 DS, anchors DS-016/DS-026 (hard): generated `--ag-*` tokens exist (`rg -l -- "--ag-space-|--ag-radius-|--ag-text-" src tokens | head`). Record the exact token names you consume.
- PROMPT_02 PKG, anchors PKG-122/123 (hard for REQ-FND-26): `test -f canaries/next16/app/server/page.tsx`. If it is absent, do everything else and report AC-FND-16 blocked.
- PROMPT_02 PKG, anchor PKG-048 (soft): `test -f docs/size-budgets.json`. If it is absent, put the proposed rows in the report for PKG/PERF to add, and do not create the file (PKG-048 is its only CREATE).
- PROMPT_05 A11Y, anchor A11Y-054 announcer (soft, for `LoadingState` announcements): the announcer export (`rg -n "useAnnouncer|announce\(" src/theme`).
- PROMPT_05 A11Y (A11Y-029 provider) and PROMPT_06 MOT (MOT-040) (hard for Skeleton shimmer): `allowContinuous` and the motion preference read (`rg -n "allowContinuous" src/theme src/motion`).

## 5. Common build rules (apply to every component here)
- Entry module `<Name>.tsx` has **no** `"use client"`, no hooks, no context reads, and no `window`/`document` access (architecture §9.1). Server components get their CSS from `styles.css`; they render correctly with no `AuraGlassProvider` (REQ-FND-54).
- `ref?: React.Ref<E>` is a plain prop (React 19). Root element carries `data-ag-part="root"` and `className={cn('ag-<kebab>', className)}`. Every rendered part carries a `data-ag-part` from `AG_PARTS`.
- Material only via `materialProps()`/`<Surface>`. No `backdrop-filter`, alpha backgrounds, `box-shadow`, colour/duration/easing literals or `!important` in `.tsx` or `.css` (REQ-FND-08). CSS lives in `@layer ag.components` and uses `--ag-*` vars only. Layout uses `@container`, not viewport media queries (§14).
- Public props are AuraGlass-owned types. There is no `asChild`: composition uses `render` (REQ-FND-07). There is no `onChange` (REQ-FND-06). Append each prop type to `OWNED_PROP_TYPES` in `tests/types/no-legacy-onchange.test-d.ts`.
- `<Name>.meta.ts` via `defineMeta` with `parts`, `states`, `variants`, `tier`, `rsc: 'server'`, `apg`, `budgetKb` (PRD §16 number), `selectorMigration` (4.x `.glass-*` classes and roles from the seed file → 5.0 `[data-ag-part]`/`[data-state]` selectors; read the seed with `rg -n "className=|glass-" <seed>` and list every public-looking class).
- Stories `Core/<Name>` (T2) or `Foundation/<Name>` (T0) import only from `aura-glass` (or the listed subpath), never `src/`. Required stories: `Default`, a generated variant matrix from `meta.variants`, `States`, `ReducedTransparency`, `ForcedColors`, `ContrastMore`, `RTL`, `Mobile390`. No Storybook-only props, no stage wrappers, no inline hex.
- Unit test `<Name>.test.tsx`: props → attributes, `ref` reaches root, `jest-axe` structural rules (no contrast in jsdom), plus the named cases below.
- Register the name in `tests/foundation/contract-coverage.json` in the same PR, then run `node scripts/docs/gen-component-docs.mjs` and commit `apps/docs/content/components/<name>.parts.md`. Fill `meta.migration` for every 4.x name the component absorbs (SC-27).

## 6. Steps
1. **FND-043 Text** (`text/`): `as`-free; `render` for the element; `size` (`xs|sm|md|lg`), `muted` (boolean) and status `intent` (`neutral|success|warning|danger`; SC-24, never `tone`), `weight`, `truncate` (`true | number` lines via `-webkit-line-clamp` set through a CSS var), `align`. Default element `<p>`; `inline` renders `<span>`. Parts: `root`.
2. **FND-044 Heading** (`heading/`): `level` 1–6 (required; renders `h1..h6`), `size` (`sm|md|lg|xl|display`), where `size="display"` absorbs `DisplayText`. Visual size is independent of `level`. Parts: `root`.
3. **FND-045 Stack** (`stack/`): `direction` (`row|column`, logical with RTL), `gap` (space token names), `align`, `justify`, `wrap`, `separator?: ReactNode` (inserted between children with `aria-hidden` when decorative). Absorbs GlassFlex/Box/HStack/VStack behaviour. HStack/VStack are not exported. Parts: `root`, `separator`.
4. **FND-046 Grid** (`grid/`, REQ-FND-39): `columns: number | { base, sm, md, lg }` keyed on container breakpoints 480/768/1024 px, `minItemWidth`, `gap`, `masonry?: boolean`. Masonry CSS: `@supports (grid-template-rows: masonry) { grid-template-rows: masonry }`, else a `columns` fallback with `break-inside: avoid`. Both paths keep DOM order = source order; no JS reordering. Parts: `root`.
5. **FND-047 Container** (`container/`): `size` (`sm|md|lg|xl|full`) → `max-inline-size` tokens, `padding`, establishes `container-type: inline-size` (named `ag-container`). Parts: `root`.
6. **FND-048 Icon** (`src/icons/`, REQ-FND-40): `Icon` renders `<svg aria-hidden="true" focusable="false">` with no `role` by default; with `aria-label` or `title` it renders `role="img"` and `<title>`. `createIcon(name, path | ReactNode)` returns a server-safe component with `/*#__PURE__*/`. Each glyph is its own module under `src/icons/<category>/<name>.tsx`, exported from `./icons` and `./icons/<name>`. Delete the `createGlassIcon` alias from root (compat keeps it via PRD-18). `ClearIcon` becomes a glyph module.
7. **FND-049** `src/icons/__tests__/icon-a11y.test.tsx`: decorative default (`aria-hidden="true"`, no role), labelled → `role="img"` + accessible name, `title` → `<title>` id linked via `aria-labelledby`; every glyph module source starts its export with `/*#__PURE__*/` (fs scan).
8. **FND-050 Card** (`card/`, REQ-FND-27): compound `Card`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`, `Card.Actions` (parts `root, header, title, description, body, footer, actions`). Default material `materialProps({ layer: 'content', content: 'content-raised' })` → `data-ag-layer="content"` and no `data-ag-variant`. `variant="regular"` adds the backdrop only under an ancestor `[data-ag-backdrop="media"]` (CSS selector, no JS). `interactive` wraps the root via `render={<a/>}` or `<button>` and gets a focus ring from the PRD-05 token. Absorbs GlowingCard/WidgetGlass/ContentSection visually (no glow animation).
9. **FND-051 Badge** (`badge/`): status `intent` (`neutral|info|success|warning|danger`, renders `data-ag-intent`; SC-24), `dot`, `count` (+ `max`, rendering `99+`), opaque tint fill with `contrast-color()` and a token fallback. Count badges carry a visually hidden label prop `label` ("3 unread"). Absorbs GlassStatusDot/LiquidGlassBadgeCluster/GlassConnectionStatus. Parts `root, indicator, value`.
10. **FND-052 Separator** (`separator/`): `orientation`, `decorative` (→ `role="none"`), otherwise `role="separator"` + `aria-orientation`, `data-orientation`. If the pinned `@base-ui/react/separator` module carries `"use client"` (check `node_modules/@base-ui/react/separator/*.js` first line), use owned markup to keep `rsc: 'server'` (PRD §4.5 fallback rule) and record it. Absorbs GlassDivider. Parts `root`.
11. **FND-053 Kbd** (`kbd/`): renders `<kbd>`; `keys?: string[]` renders nested `<kbd>` per key with `+` separators. Parts `root, item, separator`.
12. **FND-054 DescriptionList** (`description-list/`): `<dl>` with `DescriptionList.Item` (`<div>`), `.Term` (`<dt>`), `.Details` (`<dd>`); `layout` (`stacked|inline`); stacks term above detail when the container is <400 px. Parts `root, item, label, value`.
13. **FND-055 State views** (`state-views/`): one shared layout file `StateView.tsx` (internal) and three server exports `EmptyState`, `ErrorState`, `LoadingState`, each with `title`, `description`, `icon`, `actions` (parts `root, icon, title, description, actions`). `ErrorState` uses `role="alert"` only when `urgent`, else none. `LoadingState` sets `aria-busy="true"` on its root and a visually hidden live `role="status"` text (`label`, default "Loading"). It hosts Skeleton children.
14. **FND-056 Steps** (`steps/`, REQ-FND-37): `<ol data-ag-part="list">` of `Steps.Item` (`<li data-ag-part="item">`), `current` index, per-item `status` (`complete|current|upcoming|error`). The current item has `aria-current="step"`; complete and error carry visually hidden text ("Completed", "Error") next to their icons. Horizontal ≥480 px container, vertical below. Unit test `src/components/steps/Steps.test.tsx`; APG-style spec `tests/a11y/apg/steps.apg.spec.ts` (remote) checks reading order, `aria-current` and the hidden text in all three engines.
15. **FND-057 Link** (`link/`): `<a>`; `render` for router links (`render={<NextLink href=… />}`). With `target="_blank"` it adds `rel="noopener noreferrer"` and a `VisuallyHidden` " (opens in new tab)". `intent` (`neutral|danger`), `underline` (`always|hover|none`; `none` is disallowed inside running text via a dev warning when the parent is a `Text`). Replaces `glass-card-link.tsx`. Parts `root, icon`.
16. **FND-058 Alert** (`alert/`): `Alert`, `Alert.Title`, `Alert.Description`, `Alert.Actions`; status `intent` (`info|success|warning|danger`, renders `data-ag-intent`), `urgent` → `role="alert"`, else `role="status"`; `layout="banner"` spans 100% inline size with the same role rule; `onDismiss` renders a close button (`aria-label="Dismiss"`). Server entry: the dismiss button is a small `Alert.Close` client part in `Alert.client.tsx`, so `meta.rsc` is `mixed` and the entry stays directive-free. Content-raised material + `intent` rim (tint of text, rim and specular only; never selects material, SC-24). Test "banner layout roles". Parts `root, icon, title, description, actions, close`.
17. **FND-059 Skeleton** (`skeleton/`, REQ-FND-30): `aria-hidden="true"` always; `shape` (`text|rect|circle`), `lines`. Shimmer CSS keyframes run only under `[data-ag-allow-continuous="true"][data-ag-motion="full"]` ancestors (attributes written by PRD-05/06 provider; confirm exact names in prerequisites). Content-sunken material. Test `src/components/skeleton/Skeleton.test.tsx`: aria-hidden, no shimmer class without the ancestor attributes, nearest `[aria-busy]` comes from `LoadingState`.
18. **FND-060 AvatarGroup** (`avatar-group/`): `max` with a "+N" overflow item whose label is "N more"; `size`; overlap via negative logical margin token. Accepts `Avatar` children from 08d (typed as `ReactNode`, so there is no build-order cycle). Parts `root, item, value`.
19. **FND-061 ImageList** (`image-list/`): `ImageList` (`cols` is a maximum; reduces by container width with `minItemWidth` default 160 px; `variant` `standard|quilted|masonry` (masonry reuses Grid CSS)), `ImageList.Item`, `ImageList.ItemBar` (chrome thin material over media: the list root sets `data-ag-backdrop="media"`). Parts `root, item, media, header, title, description, actions`.
20. **FND-062 `tests/ssr/t2-server-safe.test.tsx` (REQ-FND-54):** for every meta with `rsc: 'server'` (and the server entry of `mixed`), `renderToString(<X {...meta-derived minimal props}/>)` with `console.error`/`console.warn` spied gives 0 calls; also assert the entry file's first statement is not `"use client"`.
21. **FND-063 Canary (REQ-FND-26):** append every `rsc: 'server'` export of this prompt to the server-safe list in `canaries/next16/app/server/page.tsx` (PRD-02's format). The canary job builds and serves remotely; it runs in 08g for AC-FND-16.
22. **FND-064 `tests/e2e/material/content-layer.spec.ts` (REQ-FND-27, remote):** in Chromium and WebKit, the `Default` stories of Card, Alert and Skeleton have `getComputedStyle(el, '::before').backdropFilter === 'none'` and `data-ag-layer="content"`; the `Card` `RegularOverMedia` story has a non-`none` backdrop filter; `RegularNoMedia` has `none`.
23. **FND-065 `tests/e2e/layout/grid-masonry.spec.ts` (REQ-FND-39, remote):** for the `Masonry` story in Chromium (column fallback) and in an engine/flag where `grid-template-rows: masonry` is supported (record which; if none, assert the `@supports` branch with `CSS.supports` false and record "native path unverified"), press `Tab` through focusable items and assert the focus order equals DOM order.
24. **FND-066** `tests/a11y/apg/steps.apg.spec.ts` (see step 14).
25. **FND-067 Budgets (REQ-FND-53):** append rows (min+gz, peers external) to `docs/size-budgets.json`: ≤1.5 KB for Card, Badge, Separator, Kbd, Text, Heading, Stack, Grid, Container, DescriptionList, Empty/Error/LoadingState, Steps; ≤3 KB for AvatarGroup, Alert, Skeleton, Link; ≤1 KB per glyph; ≤1.2 KB CSS each. Marked `"provisional": true` per PERF's schema. Never raise a number to pass.
26. **FND-068 Exports (REQ-FND-25, server set):** add each to `src/index.ts` (root) and the icon modules to `./icons`. Record the root value-export delta.
27. **FND-069 Stories** for every component, per §5.
28. **FND-070 Docs:** generated `apps/docs/content/components/<name>.parts.md` with the selector tables; `gen-component-docs.mjs --check` is green.

## 7. Tests to write and run
Unit (local, jsdom): the 20 `<Name>.test.tsx` files (including `Steps.test.tsx`, `Skeleton.test.tsx`, `Alert.test.tsx` "banner layout roles"), `src/icons/__tests__/icon-a11y.test.tsx`, `tests/ssr/t2-server-safe.test.tsx`, `src/foundation/__tests__/*` over these metas: `./node_modules/.bin/jest src/components/{text,heading,stack,grid,container,card,badge,separator,kbd,description-list,state-views,steps,link,alert,skeleton,avatar-group,image-list} src/icons tests/ssr src/foundation`. Types: `tsc -p tests/types/tsconfig.json --noEmit`. Remote: `content-layer.spec.ts`, `grid-masonry.spec.ts`, `steps.spec.ts` on the PRD-19 behaviour/material lanes (GitHub Actions or `auraone-remote-run`), the Storybook build, and the size-budget job (`scripts/ci/verify-size-budgets.mjs`, PRD-02).

## 8. Visual evidence
Remote Storybook capture of every story in §5 for these components, at 390 and 1440, light and dark, over the SC-28 scenes `dense-text` and `photo` (Card `RegularOverMedia` and ImageList on `photo` and `video-frame`), plus forced colors and 320 px container overflow checks. Also capture `Migration/<family>` stories (compat adapter beside the 5.0 component) where PRD-18 adapters exist. Artifacts are CI-retained, not committed (D-32), and a human reviews them. The agent attaches URLs and the per-story capture count, and claims nothing about how the images look.

## 9. Integrity rules (binding)
No placeholder components (`return null`, empty fragments, "coming soon"). No `"use client"` added to a server entry to make a test pass. No `.skip`/`.only`/`.todo`/`test.fixme`/`xit`/`expect(true)`, no `-u`, no raised budgets, no exemptions added to lint or `verify-foundation-pattern.mjs`. Do not mark a lane green without its run URL. Never run local Docker or a local browser.

## 10. Exit criteria
- REQ-FND-25 (server set) / AC-FND-04: every component here is in `contract-coverage.json`, and `parts-contract`, `ref-forwarding` and `portal-root` pass for it.
- REQ-FND-54: `t2-server-safe.test.tsx` green, with 0 warnings.
- REQ-FND-27: `content-layer.spec.ts` green in Chromium and WebKit (URL).
- REQ-FND-30/37/39/40: the named unit and remote specs are green.
- REQ-FND-26 / AC-FND-16 input: the server list is updated in the canary (the run itself is in 08g).
- REQ-FND-53: budget rows are present in `docs/size-budgets.json` by MODIFY and pass `verify-size-budgets.mjs` remotely (or proposed in the report if PKG-048's file is missing).
- REQ-FND-16: a docs page exists for each component, and `--check` is green.

## 11. Final report format
```
PROMPT-08c REPORT
Branch/SHA:
Tasks: FND-043..070 -> done|blocked (reason) each
Components: name -> meta.rsc, parts, budget KB (measured remotely | not yet), tests pass/fail
Server-safety: renderToString warnings=N; entries with "use client"=0 (list if not)
Base UI parts used / fallen back to Own: (Separator ...) with evidence
Remote runs: content-layer, grid-masonry (native masonry path verified? y/n + engine), steps APG -> URL
Visual evidence: artifact URL(s), story count
Root value exports added: N (names)
Prereq blockers / Deviations (incl. avatar-group/ directory; Alert meta.rsc=mixed because Alert.Close is a client part while the entry stays server-safe): ...
Files changed: (list)
```
