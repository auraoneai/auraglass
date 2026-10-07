# PROMPT-15c (EXP): Commerce, collaboration and enterprise registry content (5.1 / 5.2)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` (Key **EXP**, self-id PRD-15). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-24 prop grammar, SC-28 scenes, SC-29 lanes, SC-30 test paths, SC-31 stories, SC-32 registry). Requirements: **REQ-EXP-13, -14, -15, -16, -17, -18, -19**, plus PRD §13.2 (stories), §14 (responsive), §15 (a11y), §16 (per-block budgets). Acceptance: **AC-EXP-09 (blocks half), AC-EXP-10, AC-EXP-11, AC-EXP-12**. Ledger rows X-46, X-47, X-48, X-49, X-50, X-55 (wave 2). Tasks: `docs/auraglass-5/tasks/EXP.json` EXP-047..EXP-071. Index: `docs/auraglass-5/prompts/PROMPT_15_EXP.md`. The PRD now fixes the layout (SC-32): sources in `registry/blocks/<id>/` and `registry/items/<id>/`, unit tests in `tests/registry/<id>.test.tsx`, stories in DX's `src/stories/blocks/`, DX's lint (`scripts/registry/lint.mjs`) and render harness (`tests/dx/registry-render.spec.ts`).

## 1. Context

These are copy-in source (shadcn registry), not `aura-glass` exports (REQ-EXP-34), and are SC-32 "later blocks", not GA blocks. They compose only public 5.0 components: `NumberField`, `SegmentedControl`, `Button`, `IconButton`, `TextField`, `Checkbox` (CTL), `Sheet`, `Popover` (OVL), `Card`, `Avatar`/`AvatarGroup`, `ScrollArea`, `Field`/`Fieldset`/`Form` (FND T2), `Table`, `FilterBar` (`aura-glass/data`, DATA), `DateRangePicker` (`aura-glass/date`, DATA). Prop grammar follows SC-24: no `material` prop anywhere; content surfaces use `Card` (content-raised). Locale comes from the `AuraGlassProvider` `locale` (X-07, REQ-EXP-22). Branch `exp/15c-blocks-5.1` (later `exp/15c-blocks-5.2`) from `main` after 5.0.0 GA.

## 2. Files you may touch

- NEW `registry/blocks/commerce-cart/{ProductCard,LineItem,CartSummary}.tsx`, `commerce-cart.css`, `layout.assert.json`
- NEW `registry/blocks/commerce-checkout/{CheckoutSteps,CheckoutPage}.tsx`, `commerce-checkout.css`, `layout.assert.json`
- NEW `registry/blocks/pricing/{PricingTable,PlanComparison}.tsx`, `pricing.css`, `layout.assert.json`
- NEW `registry/items/presence-stack/{PresenceStack.tsx,presence-stack.css}`
- NEW `registry/items/comment-thread/{CommentThread.tsx,comment-thread.css}`
- NEW `tests/registry/{commerce-cart,commerce-checkout,pricing,presence-stack,comment-thread}.test.tsx` (SC-30; never inside the copied registry source)
- 5.2 only: NEW `registry/blocks/audit-log/{AuditLogPage.tsx,layout.assert.json}`, `registry/blocks/permissions-matrix/{PermissionsMatrix.tsx,layout.assert.json}`, `tests/registry/{audit-log,permissions-matrix}.test.tsx`
- MODIFY `registry/registry.json` (DX-067 owns the file, OV-20: add the 5/7 entries only)
- NEW `src/stories/blocks/{CommerceCart,CommerceCheckout,Pricing,PresenceStack,CommentThread,AuditLog,PermissionsMatrix}.stories.tsx` (inside DX-097's directory, OV-29)
- NEW `tests/registry/blocks-lint.test.ts`
- NEW `tests/perf/browser/registry-blocks.spec.ts` (SC-30 perf path, driven by `tests/perf/harness/run-perf.mjs`, PERF-039); MODIFY `tests/dx/registry-render.spec.ts` (DX-094) only to add the 5/7 ids
- MODIFY `docs/size-budgets.json` (PKG-048): add the 7 per-block byte rows; MODIFY `tests/perf/harness/budgets.json` (PERF) for the runtime rows
- MODIFY `docs/auraglass-5/capability-ledger.json` (rows X-46..X-50, X-55: `status`, `artifacts`, `stories`, `budgetKb`)

Must not touch: `src/**` outside `src/stories/blocks/`, `scripts/registry/*`, other `tests/dx/*`, `.storybook/*`, `jest.config.js` (QA), any other registry entry.

## 3. Prerequisites (owner prompts named; all must pass, otherwise stop and report the failing check)

- PROMPT-15a merged: `npm run verify:capability` exits 0.
- DX pipeline (DX prompt; DX-067, DX-070, DX-091, DX-094, DX-097): `test -f registry/registry.json && test -f scripts/registry/build.mjs && test -f scripts/registry/lint.mjs && test -f tests/dx/registry-render.spec.ts && test -d src/stories/blocks`.
- Components exported from the packed 5.0 tarball (PROMPT-15b `exports.json`): root contains `NumberField` (CTL-095), `SegmentedControl` (CTL-081), `Button`, `TextField` (CTL-047), `Checkbox` (CTL-029), `Sheet` (OVL-097), `Popover` (OVL-063), `Card` (FND-050), `AvatarGroup` (FND-060), `ScrollArea` (FND-077), `Form` (FND-083); `./data` contains `Table` (DATA-038), `FilterBar` (DATA-080); `./date` contains `DateRangePicker` (DATA-097). `AuraGlassProvider` (A11Y-029) accepts `locale` (X-07 delivered).
- QA/SB: scenes `certification/scenes/` (8 SC-28 ids, QA-038/039), SB's `StoryEnvironment` decorator (SB-048), PERF's `run-perf.mjs` (PERF-039), PKG canaries (PKG-120).

## 4. Steps

1. **EXP-047..EXP-049 `commerce-cart` (REQ-EXP-13).** Props exactly as REQ-EXP-13. `ProductCard`: `<article>` on `Card` (content-raised; no `material` prop, SC-24), `<h3>` title, `<img alt>` required when `image` is set, price via `Intl.NumberFormat(locale, { style: 'currency', currency })`, add button ≥24×24 (≥44×44 under `pointer: coarse`). `LineItem`: `NumberField min={1} max={maxQuantity}`; `onQuantityChange(id, q)`; remove `IconButton` named "Remove <title>"; line total announced politely through the provider announcer on change (§15.5). `CartSummary`: `<dl>` of `lines`, total, `cta` slot, `footnote`. No arithmetic beyond formatting. CSS: tokens only (`var(--ag-*)`), logical properties, layout per §14.2 (≥1024 px side-by-side, summary `inline-size: 360px`; below, sticky CTA bar with `padding-block-end: env(safe-area-inset-bottom)`).
2. **EXP-050** `tests/registry/commerce-cart.test.tsx`: "formats JPY with 0 fraction digits" (`ja-JP`), "formats EUR with comma decimal" (`de-DE`), "quantity uses NumberField min 1", "onRemove called with id", "line total change is announced politely".
3. **EXP-051 / EXP-052 `commerce-checkout` (REQ-EXP-14).** `CheckoutSteps` = `<ol>`; exactly one item `aria-current="step"`; steps are links/buttons (no roving, §15.3). Below 768 px container width: "Step n of m: label" with full list in a `Sheet` (§14.3). `CheckoutPage` composes `Form` + `Fieldset` (contact, shipping) and a `payment` `ReactNode` slot; no payment SDK. Tests: "aria-current on exactly one step", "list is an ol", "compact label at narrow width".
4. **EXP-053..EXP-055 `pricing` (REQ-EXP-15).** `PricingTable` period toggle = `SegmentedControl` (radiogroup); grid 1/2/3+ columns at 390/768/≥1024 (§14.1), toggle sticky at 390. `PlanComparison` = `<table>`, `<th scope="col">` plans, `<th scope="row">` features, booleans = icon + visually hidden "Included"/"Not included" (strings via props, English defaults, §15.8); at 390 inside `ScrollArea`, first column `position: sticky; inset-inline-start: 0`, never cards. Tests: "comparison has scoped headers", "boolean cells have hidden text", "period toggle is a radiogroup".
5. **EXP-056 / EXP-057 `presence-stack` (REQ-EXP-16).** `<ul>` on `AvatarGroup`, names as text; overflow `+N` button named "N more collaborators" (string prop); colour = deterministic FNV-1a hash of `id` mod the categorical palette token list (`--ag-color-categorical-1..n`, read the token names from PRD-03's generated tokens); `max` 3 below 390 px **container** width (`@container`). Tests: "same id → same colour across renders", "overflow label", "no timers" (`jest.useFakeTimers(); render(); expect(jest.getTimerCount()).toBe(0)`).
6. **EXP-058 / EXP-059 `comment-thread` (REQ-EXP-17).** `<ol>` of `<article>` with `<time dateTime>`, `Card` content-raised, `TextField multiline`, IME-safe submit (ignore Enter while `event.nativeEvent.isComposing` or between `compositionstart`/`compositionend`), resolve `Button` → `onResolve`. Avatar column collapses below 360 px container width. Tests: "Enter during composition does not submit", "time element has dateTime", "resolve calls onResolve".
7. **EXP-060 registry entries.** Add `commerce-cart`, `commerce-checkout`, `pricing` (`registry:block`) and `presence-stack`, `comment-thread` (`registry:item`) to `registry/registry.json` with `files`, `registryDependencies: ["auraglass"]` and `meta.auraglass.components` = the exact set of `aura-glass` imports (REQ-DX-45 rule). REQ-DX-45 asserts exactly 10 GA blocks; if `tests/dx/registry-blocks.test.ts` is not version-aware, report it as DX blocker PRD §21 O-07 with the failing assertion; do not edit DX's test.
8. **EXP-061 stories (§13.2, SC-31).** One file per block under DX's `src/stories/blocks/`, importing from `registry/...` (no copies), with stories `Default`, `Empty`, `Loading` (comment-thread submit pending; others only if async), `RTL` (`dir="rtl"`, locale `he-IL` or `ar-EG`), `ReducedTransparency`, `ForcedColors`; `tags: ['block']`; product copy (no "Lorem"/"Demo"); rendered under SB's `StoryEnvironment` and `environment` global (SB-048), never an opaque stage; no story-level CSS.
9. **EXP-062** `tests/registry/blocks-lint.test.ts`: spawns DX's `node scripts/registry/lint.mjs registry/blocks/<id> …` (DX-070) for the 7 ids and asserts exit 0; then itself asserts REQ-EXP-19 extras: every import is `aura-glass` or a manifest subpath (no `aura-glass/compat`, no `aura-glass/dist`), 0 `style={{` with colour/blur values, 0 `!important`, and every `aura-glass` component used appears in `meta.auraglass.components`.
10. **EXP-063 render canaries (remote, L11 Consumer canaries, AC-EXP-09).** Add the 5 ids to DX's `tests/dx/registry-render.spec.ts` (DX-094) and run it in CI (PKG-120 Next 16 + Vite canaries, packed tarball): 0 console errors, axe 0 violations with colour contrast on, over the 8 SC-28 scenes. Add `layout.assert.json` per block encoding §14 (e.g. commerce-cart at 1440: `summary.x ≥ lines.x + lines.width`, `summary.width == 360 ± 1`; at 390: no horizontal overflow, CTA bar bottom = viewport bottom).
11. **EXP-064 visual capture (remote, L14 Human visual review).** Each story × 390/768/1024/1440/1920 × 8 scenes, light/dark, captured by QA's cert runner (QA-018); upload as `exp-blocks-<sha>`; request human review (DoD 8). No baseline exists yet: first capture is reviewed by a person and approved, never auto-accepted.
12. **EXP-065** `tests/perf/browser/registry-blocks.spec.ts` (remote, mid-tier mobile profile, L10 Performance via `run-perf.mjs`, PERF-039): per block byte row in `docs/size-budgets.json` (min+gz, AuraGlass deps external, gate `verify-size-budgets.mjs`, PKG-049): commerce-cart ≤6 KB, commerce-checkout ≤6, pricing ≤5, presence-stack ≤2, comment-thread ≤4 (audit-log ≤6, permissions-matrix ≤4 at 5.2); ≤3 visible backdrop-filter layers per viewport; ≥50 fps median and grade ≥C under scripted hover + scroll; 0 long tasks >200 ms and total blocking ≤150 ms on load.
13. **EXP-066 contrast/preferences (remote).** QA OCR gate (QA-049) worst case ≥4.5:1 body / 3:1 large + non-text over all 8 scenes (AC-EXP-11); under `forced-colors: active` 0 visible backdrop-filters by CDP computed style (AC-EXP-12); `prefers-contrast: more` and `prefers-reduced-transparency: reduce` drop to tinted/solid (D-11).
14. **EXP-067 ledger.** Set X-46..X-50 `status: "delivered"`, `release: "5.1"`, `artifacts` (CI run URLs of EXP-063..066), `stories` ids, `budgetKb`; `npm run verify:capability` green.
15. **EXP-068..EXP-071 (5.2 train).** `audit-log`: `Table` with `manualPagination`, `pageCount`, `onPaginationChange`, `FilterBar`, `DateRangePicker`, virtualization on at all widths, filters into a `Sheet` at 390. `permissions-matrix`: `<table>` roles × permissions, `Checkbox` cells named "<role> <permission>", `aria-describedby` → permission description, row/column `<th scope>`. Tests: "calls onPaginationChange with pageIndex", "each checkbox name = role + permission". Then repeat steps 7–14 for these two (X-55 wave 2).

## 5. Running

Unit tests (jsdom): `npx jest tests/registry/commerce-cart.test.tsx` etc. locally is allowed. Storybook build, Next/Vite canaries, visual capture, OCR, axe-in-browser and perf run only in CI or on an `auraone-remote-run` worker (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` and `ci-selection.md` first). Never local Docker or a local browser.

## 6. Prohibitions

No mock checkout/payment logic, no `setTimeout` loading fakes, no `Math.random` colours, no demo-data default props (the `auraglass/no-simulation` rule covers `registry/**`); no `eslint-disable`; no skipped/only tests; no relaxing any number in steps 10–13; no `--update-snapshots`/baseline auto-accept; no `aura-glass` exports for these names.

## 7. Exit criteria

- AC-EXP-09 (blocks half): 5 entries delivered at 5.1.0 (2 more at 5.2.0), each green in the Vite and Next 16 canaries over 8 scenes with 0 console errors and 0 axe violations.
- AC-EXP-10: every §16 line met (size, ≤3 filters, ≥50 fps, grade ≥C, 0 long tasks >200 ms).
- AC-EXP-11 / AC-EXP-12: OCR and forced-colors gates green for every block story.
- All REQ-EXP-13..19 named tests green; human review recorded.

## 8. Final report

```
PROMPT-15c report (train 5.1 | 5.2)
branch / SHA / PR:
per block: id | unit tests | lint | canary run URL | axe | min+gz KB / budget | filters | fps median / grade | long tasks | OCR worst ratio | forced-colors filters
visual artifact + human reviewer + date:
registry.json diff summary; DX REQ-DX-45 count assertion status (PRD §21 O-07):
ledger rows flipped:
blockers:
```
