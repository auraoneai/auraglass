# PROMPT-11f (NAV): Breadcrumbs (server) + overflow island, Pagination, Command, CommandPalette

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md`; key crosswalk `PROMPT_11_NAV.md`), §4.4, §4.6, §5.7, §5.8, §5.9, §12, §16, §20 steps 8–9.
Requirement IDs: REQ-NAV-51, -52, -53, -54, -55, -56, -57, -58, -59 (integration), -60, -61, -62, -63.
Acceptance: AC-NAV-15, AC-NAV-17 (Breadcrumbs half); inputs to AC-NAV-08 (command-5000 budget), AC-NAV-10 (breadcrumbs-overflow, command APG). Tasks: NAV-078..NAV-091.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture wins; deviations reported with evidence.
- No fake completion: no stubs, no own combobox keyboard model (Base UI Combobox), no own dialog/scrim/blur in `CommandPalette` (PRD-OVL `Dialog` public parts only, REQ-OVL-60, OVL-040), no `RegExp` from user input, no `test.skip`/`fixme`/`it.todo`, no lowered thresholds, no snapshot updates. Missing prerequisite ⇒ BLOCKED with output.
- Remote-first for Playwright/APG/canary/perf (CI or `auraone-remote-run`). Local: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`.
- `Breadcrumbs.tsx` and `Pagination.tsx` are server-safe (no directive, no hooks; Pagination's interactive button mode lives in a `"use client"` part file — see step 3). `BreadcrumbsOverflow.tsx`, `Command.tsx`, `CommandPalette.tsx` are `"use client"`. React 19 ref-as-prop.
- Only allowed new dependency: `@tanstack/react-virtual` (D-29 allowlist; pinned exact version; must already be in the PRD-PKG allowlist `docs/dependency-allowlist.json` (PKG-056, SC-14). Verify it; do not add it to the allowlist yourself).

## Prerequisites (verify)

1. PROMPT-11a: `test -f src/components/navigation/getPaginationRange.ts && test -f src/components/navigation/commandScore.ts`.
2. PRD-OVL `Dialog` (OVL-040) with `placement="top"`, `size="lg"`, `Dialog.Popup initialFocus`, `Dialog.Body padding="none"` (REQ-OVL-60): `rg -n "placement.*\"top\"|padding.*\"none\"" src | rg -i dialog`. Missing ⇒ NAV-087/089 BLOCKED.
3. PRD-OVL `Menu` (OVL-081, overflow) and PRD-CTL `IconButton` (CTL-061): `rg -n "export (const|function) (Menu|IconButton)\b" src`.
4. PRD-A11Y announcer (A11Y-054) and `LayerStack` (A11Y-049, the only Escape dispatcher, SC-25). PRD-FND Base UI wrapping pattern (FND-001, FND-005). Open item PRD §21 O-01: verify that Base UI Combobox supports inline-list mode before step 4. If it does not, report BLOCKED with the evidence.
5. The PRD-PKG allowlist contains `@tanstack/react-virtual` (`rg -n "react-virtual" docs/dependency-allowlist.json`; PKG-056). Missing ⇒ NAV-086 BLOCKED; everything else proceeds.
6. The PRD-QA canaries lane (QA-086) over the PRD-PKG `canaries/next16` fixture, with RSC client-manifest inspection. The spec `tests/canary/next16/breadcrumbs-server.spec.ts` runs against that fixture; there is no second fixture tree.

## May touch

NEW `src/components/navigation/{Breadcrumbs,BreadcrumbsOverflow,Pagination,PaginationButtons,Command,CommandPalette}.tsx`; `src/components/navigation/navigation.css` (Breadcrumbs + Pagination sections; durations only from the PRD-MOT scale, SC-19); `src/index.ts` (add `Breadcrumbs`, `Pagination`, `Command`, `CommandPalette`, `getPaginationRange`, `commandScore` root exports only); `package.json` dependencies (only `@tanstack/react-virtual`, exact version); NEW tests listed below; `tests/e2e/app-shell/layout.spec.ts` (breadcrumb/pagination cases).

## Must not touch

`src/components/navigation/GlassBreadcrumb.tsx`, `GlassPagination.tsx`, `GlassCommandBar.tsx`, `src/components/interactive/{GlassCommandPalette,GlassCommand,LiquidGlassCommandSurface}.tsx`, `src/app-shell/components.tsx` (`GlassBreadcrumbs`, `GlassCommandDock`) — all removed in 11i, except the 4.1.1 E-22 fix, which PRD-TRUST makes on `release/4.x` (SC-36); PRD-OVL `Dialog`/`Menu` source.

## Steps

1. **Breadcrumbs (REQ-NAV-51, -53, -54).** `Breadcrumbs = { Root, List, Item, Link, Current, Separator, Ellipsis }`. `Root` `<nav aria-label={labels.breadcrumb ?? "Breadcrumb"}>`, `List` `<ol>`, `Item` `<li>`, `Link` `<a>` with `render`, `Current` `<span aria-current="page">`, `Separator` `aria-hidden="true"` with default chevron from `aura-glass/icons`, flipped under `:dir(rtl)` via `scale: -1 1`. No surface, no backdrop filter. Segments `max-inline-size: 16ch; text-overflow: ellipsis`, `Current` takes remaining space; full text remains the accessible name (no `title` duplication needed; text is in the DOM).
2. **Overflow (REQ-NAV-52).** `maxItems` (default none) and `itemsAfterCollapse=2`: server `Root` keeps first item and last N; replaces the middle with `<BreadcrumbsOverflow items={[{href,label}]} />` — a PRD-CTL `IconButton` labelled `labels.showMore(n) ?? \`Show ${n} more\`` opening PRD-OVL `Menu` of link items. Overflow is the only client module; it is imported only on that branch.
3. **Pagination (REQ-NAV-55, -56, -57).** `Pagination = { Root, Previous, Next, Item, Ellipsis }`, props `page`, `defaultPage=1`, `pageCount`, `onPageChange`, `siblingCount=1`, `boundaryCount=1`, `getHref?`, `labels`. Range from `getPaginationRange`. Link mode (`getHref`): server-rendered `<a>` items. Button mode: `PaginationButtons.tsx` (`"use client"`) holds `page` state for uncontrolled use. `aria-current="page"` on current; Previous/Next `aria-disabled="true"` at bounds and remain focusable (no `disabled` attribute); item names `labels.page(n) ?? \`Page ${n}\``. `container: ag-pagination / inline-size`; below 400px show Previous, "Page N of M", Next. Content material, no blur.
4. **Command (REQ-NAV-58, -59, -60, -62, -63).** `Command = { Root, Input, List, Group, Item, Empty, Loading, Separator }` on Base UI Combobox inline-list mode: input `role="combobox"`, list `role="listbox"`, `aria-activedescendant`. `Item` props `value`, `keywords`, `onSelect`, `disabled`, `shortcut`. Default filter `commandScore`; `filter(value, query, keywords)` override; `shouldFilter={false}` hands off. Keys: Up/Down wrap (`loop=true`), Home/End, Enter selects, Escape clears query then propagates to the PRD-A11Y `LayerStack` (Command registers no own Escape handler beyond clearing the query), `event.nativeEvent.isComposing` guard. Above 100 rendered items use `@tanstack/react-virtual` loaded by dynamic `import()`; active item kept in the virtual window (`scrollToIndex`), ≤ 30 item nodes mounted at 5,000 items. Result count announced via the PRD-A11Y announcer, polite, 500 ms debounce, `labels.results(n) ?? \`${n} results\``.
5. **CommandPalette (REQ-NAV-58, -61).** `CommandPalette` renders PRD-OVL `Dialog.Root` → `Dialog.Popup size="lg" placement="top" initialFocus={inputRef}` → `Dialog.Body padding="none"` → `Command`. Adds no scrim, blur or material. `hotkey="mod+k"` default (`false` disables): one `document` `keydown` listener per mounted palette, removed on unmount; open focuses input; close restores focus to the previously focused element (Dialog contract).

## Tests

- `src/components/navigation/Breadcrumbs.test.tsx` › `nav > ol > li structure`, `separators aria-hidden`, `aria-current on Current`, `collapses middle items`.
- `src/components/navigation/Pagination.test.tsx` › `stable item count`, `aria-disabled bounds stay focusable`, `link mode uses getHref`, `labels override`.
- `src/components/navigation/Command.test.tsx` › `5,000 items virtualized` (≤30 item nodes, `aria-activedescendant` points to a mounted id after End), `announces result count`, `metacharacter queries do not throw`, `fuzz 10,000 printable-ASCII queries through Command.Input, 0 exceptions` (AC-NAV-15), `IME composition does not select`.
- `src/components/navigation/CommandPalette.test.tsx` › `hotkey opens and restores focus`, `hotkey=false registers no listener`, `one listener per palette`.
- Remote APG `tests/a11y/apg/breadcrumbs-overflow.apg.spec.ts`, `tests/a11y/apg/command.apg.spec.ts` (incl. stacked Escape), 3 engines, LTR/RTL.
- Remote canary `tests/canary/next16/breadcrumbs-server.spec.ts`: Breadcrumbs without overflow ⇒ 0 client modules in RSC client manifest.
- Remote `layout.spec.ts › breadcrumbs truncate at 390`, `› pagination compact`. Remote perf `tests/perf/browser/command-5000.spec.ts` (input → filtered render ≤ 50 ms p95; ≤ 30 DOM item nodes) — authored here, gated in 11h.
Run local: `npm test -- src/components/navigation/Breadcrumbs.test.tsx src/components/navigation/Pagination.test.tsx src/components/navigation/Command.test.tsx src/components/navigation/CommandPalette.test.tsx`.

## Visual evidence

Remote screenshots: Breadcrumbs 2/4/8/collapsed; Pagination first/middle/last/compact; Command empty query/results/empty/loading/5,000; CommandPalette open over each S-01 scene; 390/1440 light/dark. CI artifact, human review.

## Exit criteria

- AC-NAV-15: both fuzz tests green (scorer from 11a + `Command` here).
- AC-NAV-17 (Breadcrumbs half): canary reports 0 client modules without overflow.
- APG breadcrumbs-overflow and command green; `rg -n "new RegExp" src/components/navigation/{Command,CommandPalette,commandScore}.ts*` = 0.

## Final report format

```
PROMPT-11f REPORT
Commit: <sha>   Remote runs: <URLs>
Prerequisites 1-6: <ok | missing + output>
Tasks NAV-078..091: DONE | BLOCKED(<reason>)
REQ-NAV-51..63: <test> -> pass/fail
AC-NAV-15, AC-NAV-17 (breadcrumbs): PASS/FAIL + artifact
Sizes min+gz: Breadcrumbs <KB>(≤2) overflow <KB>(≤3) Pagination <KB>(≤3) Command <KB>(≤12) CommandPalette <KB>(≤32)
Files changed / Deviations (PaginationButtons.tsx split is a NEW file not in PRD §8: reason = server-safe link mode)
```
