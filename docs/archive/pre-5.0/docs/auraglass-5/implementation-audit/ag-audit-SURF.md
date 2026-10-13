# AuraGlass 5.0 SURF (PRD-4 Product Surfaces) implementation audit

Audited 2026-10-08, read-only. Code was read on origin/next @ 84a3b94f1 through a detached worktree at /tmp/ag-audit-SURF; the deprecations were read from origin/release/4.x. PRD: docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md (196 REQ-SURF, 31 AC-SURF). Tasks: docs/auraglass-5/tasks/SURF.json (645).

## Headline

SURF has landed a large amount of real code on origin/next. All stream branches (next-surf/w1..w5, 4x-surf/skeleton) are fully merged (0 commits ahead): app-shell 53 files, data 62, date 17, ai 73, media 96, backdrops 18, 66 compat adapters, 15 registry blocks, 30 items, ledger and gates.

I ran 49 SURF Jest suites (270 tests) under the root config and all passed. The root-config result overstates coverage, though:
- Registry block render tests pass vacuously: they `return` before asserting when the block cannot be required.
- APG specs return early (pass) when their subject is not registered.
- Under the doubles preset, `tests/capability/registry/ai-items.test.tsx` fails.

No browser, perf, visual, OCR, APG or canary lane has ever run. GitLab project 87152036 has only branch main and 0 pipelines. Every SURF CI job is `allow_failure: true`. All 645 tasks in SURF.json are still `status: todo`, and all 58 non-rejected ledger rows are still `planned`.

Verdict: substantially complete at code level, partial at contract and verification level.

REQ tally: 147 done, 47 partial, 2 missing (both 5.1 scope: REQ-79 inline edit, REQ-105 DateTimePicker). "Done" means the code implements it and unit tests pass where present. For layout, contrast, blur, motion and frame-time REQs, "done" never includes the remote measurement the PRD requires, because none has run.

## Biggest gaps

1. Contract export drift (REQ-01/02, AC-01).
   - `./app-shell` exports 13 values against the contract's 7 (SidebarDrawer, AppShellSidebarToggle, AppShellInspectorToggle, AppShellController, parseAppShellCookie, serializeAppShellCookie), and `etc/api/app-shell.exports.json` freezes the drift.
   - The root slice adds `formatTimestamp`.
   - The statics AppShell.parseCookie, Pagination.getRange, Command.score and SourceTransition.start are missing.
   - The REQ-01 test is a source regex, not the packed-tarball check.
2. Media is unstyled. `src/media/media.css` is an empty lane skeleton in `@layer media`. MediaControls, NowPlayingBar, ImageViewer and CarouselRail ship no CSS, so the responsive, container-query, target-size and height requirements (REQ-135/138/139/145) cannot hold. Backdrop CSS uses `@layer backdrops`, and `ai.css` uses 10x `!important`; both break REQ-03.
3. Fabricated calibration data (REQ-152). `scripts/surf/calibrate-media-tone.mjs` is a stub: it writes `{pending:true}` per scene and hard-coded constants. Yet `src/media/sampling/__fixtures__/scene-stats.json` claims "alpha run on remote runner" with round-number stats, and no such run is possible (0 pipelines). The `classifyTone` test asserts against these authored numbers.
4. Tone sampling is only half wired (REQ-139/145/153). Only `useMediaElement` samples. Backdrop photo/video, NowPlayingBar Artwork and ImageViewer Stage never sample.
5. Registry tests are vacuous under the root config, and the doubles preset is red (REQ-171/173, AC-26). The `ai-workspace` route has not moved to its final path, although the ai-sdk devdeps PR #48 merged (REQ-106/172). The 429 body lacks `retryAfterMs`, and the 32 KB cap trusts Content-Length.
6. Several components use their own primitives instead of the CMP or Base UI ones:
   - Command is a hand-rolled listbox with no virtualization above 100 items (REQ-60/63).
   - FilterBar uses native inputs, with no Sheet or responsive collapse (REQ-87).
   - Date uses RAC Popover, with no bottom sheet (REQ-98/101).
   - Citation has no PreviewCard (REQ-125).
   - Table loading replaces rows with one text row instead of skeletons, and pinning has no edge or auto-pin (REQ-72/74).
   - StreamingText has no per-frame coalescing, truncation or aria-busy (REQ-113).
   - TabBar `minimizeOnScroll` has no CSS behind it (REQ-54).
   - Tabs have no mask fade or scroll-into-view (REQ-50).
   - Breadcrumbs have no 16ch truncation (REQ-57).
   - Pagination has no compact container mode (REQ-59).
7. React 19 rule broken (REQ-10): 21 SURF modules still use `forwardRef`.
8. Migration data is thin.
   - Only 8 codemod fixture cases exist, against at least 1 per absorbed name, about 80 (REQ-14).
   - 7 compat adapters are missing: GlassSplitPane, GlassSidebarRail, GlassSidebarPanel, LiquidGlassInsetSidebar, GlassNavigationMenu, LiquidGlassInspectorPanel, GlassBreadcrumbs (REQ-13).
   - On 4.x, 142 of 145 deprecation rows use `since 4.2.0` (renames should be 4.3.0), and 18 use `removeIn 6.0.0` (REQ-12).
9. Verification never ran (REQ-188..193/195/196, most ACs). There is no L13 manual record (README only) and no L7 baseline. Even if a pipeline ran, the APG specs would pass with an unregistered subject.
10. Repo hygiene (not SURF-owned, but it blocks CI): `npm ci` fails on a fresh origin/next checkout. package-lock.json is out of sync with apps/docs, which points at a tarball under `.artifacts/pack` that does not exist, and `packages/labs`. `@testing-library/dom` is absent from the lock.

## Stubs, fakes, skips found

- `scripts/surf/calibrate-media-tone.mjs:25`: per-scene stats are `{ pending: true }` and the constants are hard-coded. The committed `scene-stats.json` claims a remote run that never happened.
- `tests/capability/registry/{pricing,app-frame,commerce-cart,commerce-checkout,presence-stack,comment-thread,...}.test.tsx`: `if (!Block) { console.warn(PENDING); return; }`. Confirmed: under the root config they pass with 0 assertions, and the warning still says "until CMP lands" although CMP has merged.
- `tests/a11y/apg/surf/*.apg.spec.ts` (23 files): `if (!subject) { console.warn('... pending'); return; }`, so an absent subject passes.
- `tests/capability/contract-tests.test.ts:25` and `tests/capability/deliverables.test.ts`: report "pending" and pass when prerequisites are absent.
- `tests/data/exports/surf-entries.test.ts`: the title says "leaves W1 names pending", and it is a source regex rather than the tarball import REQ-01 requires.
- `registry/blocks/ai-workspace/__tests__/route.test.ts`: only string-matches the route source. The behavioural test runs only in the never-run `surf:test:ai-sdk` harness.
- `src/media/media.css`: empty skeleton.
- `src/components/command-palette/Command.tsx:6`: "until then >100 items render non-virtualized".
- `src/three/index.ts`: `export {}` day-0 stub. This one is legitimate per OI-01 and contract PR #23.
- `src/ai/message/StreamingText.tsx`: dead code (`const done = ...; void done;`).
- `src/ai/__fixtures__/ui-messages.ai-sdk.json`: generated from the hand-authored `ui-messages.source.ts`, not from the SDK types the PRD requires.
- All `ci/surf.gitlab-ci.yml` jobs are `allow_failure: true`.
- There were no `it.skip`, `test.fixme`, `it.todo` or `xit` in SURF tests.

## Tests run (worktree, jsdom)

Batch 1: 21 suites, 178 tests, all pass. Batch 2: 10 suites, 39 tests, all pass, but the registry tests among them are vacuous. Batch 3: 18 suites, 92 tests, all pass. Doubles preset over `tests/capability/registry`: 18 suites, 1 FAILED (ai-items: ai-artifact-panel).

Gates run:
- `verify-surf-purity.mjs`: clean
- `verify-capability-ledger.mjs`: ok
- `verify-labs-admission.mjs`: 0 residents
- `gen-ai-fixtures.mjs --check`: up to date
- `@ag-contract-seed` markers in SURF src: 0

Not run: tsc, build, pack, or any browser lane.

To install dependencies I had to strip `workspaces` from package.json temporarily (in /tmp only) and install `@testing-library/dom` without saving it.

## Task sample (40 tasks, 8 per lane W1..W5, seed 5)

All 645 tasks are `status: "todo"`; the ledger was never updated. For 38 of the 40 sampled tasks, the target file exists on origin/next with matching content. The two partial ones:
- SURF-064 (W1, Tabs.css): no mask-image and no scrollIntoView.
- SURF-374 / ai items (W3): the ai-voice-input VoiceInputAction is present, but the ai-items suite fails in the doubles lane.

Some sampled tasks are delivered with deviations:
- SURF-431 aurora drift: done, in backdrops.css.
- SURF-428 grain: the png and avif are present.
- SURF-397 4.x deprecation rows: present on release/4.x.
- SURF-551/549/564 ledger flags: present and tested.
- SURF-561 CI job: present, never run.
- SURF-593 pricing test: vacuous under the root config.

## Acceptance criteria

| AC | Status | Note |
|---|---|---|
| AC-SURF-01 | not met | app-shell exports 13 vs 7; formatTimestamp extra; 4 statics missing |
| AC-SURF-02 | not verifiable without CI | rg chart.js/date-fns = 0 (passes); metafile and fresh install not run |
| AC-SURF-03 | met | purity gate clean; 0 seed markers; side-effects fragment [] |
| AC-SURF-04 | not verifiable without CI | browser |
| AC-SURF-05 | not verifiable without CI | browser |
| AC-SURF-06 | met (unit level) | Tabs, Sidebar, StatusBar jsdom tests pass |
| AC-SURF-07 | not verifiable without CI | browser |
| AC-SURF-08 | met | score fuzz test (10,000 queries) passes |
| AC-SURF-09 | not verifiable without CI | Next canaries |
| AC-SURF-10 | not verifiable without CI | jsdom virtual test passes; 3-engine and perf parts not run |
| AC-SURF-11 | not verifiable without CI | APG specs never ran, and pass vacuously when the subject is absent |
| AC-SURF-12 | not verifiable without CI | |
| AC-SURF-13 | not verifiable without CI | |
| AC-SURF-14 | not verifiable without CI | |
| AC-SURF-15 | not verifiable without CI | type test only in ai-sdk harness |
| AC-SURF-16 | not verifiable without CI | |
| AC-SURF-17 | not verifiable without CI | jsdom IME and tool-state tests pass |
| AC-SURF-18 | not verifiable without CI | |
| AC-SURF-19 | not met | scene stats are authored, not calibrated; Backdrop does not sample |
| AC-SURF-20 | not verifiable without CI | static portion clean in src/media |
| AC-SURF-21 | not verifiable without CI | |
| AC-SURF-22 | not met | media.css empty, so no container states; filter-then-open unit test passes |
| AC-SURF-23 | not verifiable without CI | |
| AC-SURF-24 | not met | 8 codemod fixtures; 7 adapters missing; `since` and `removeIn` drift |
| AC-SURF-25 | not met | no L13 records |
| AC-SURF-26 | not met | ai-items fails in doubles; route test is a string match |
| AC-SURF-27 | met (pre-RC portion) | 71 rows; verifier exits 0; negative fixtures tested |
| AC-SURF-28 | met | labs package shape plus admission gate |
| AC-SURF-29 | not verifiable without CI | L14 human review |
| AC-SURF-30 | not verifiable without CI | 5.1 |
| AC-SURF-31 | not verifiable without CI | fragment exists; all jobs allow_failure: true |

Of the 11 ACs verifiable now (01, 03, 06, 08, 19, 22, 24, 25, 26, 27, 28), 5 are met.

## REQ table

| REQ | Status | Evidence (origin/next unless noted) |
|---|---|---|
| REQ-SURF-01 | partial | `src/app-shell/index.ts` exports 13 values (adds SidebarDrawer, AppShellSidebarToggle/InspectorToggle/Controller, parseAppShellCookie, serializeAppShellCookie) vs contract 7 (`src/contracts/entries.ts:18`); `etc/api/app-shell.exports.json` freezes the 13; `src/root/surf.ts` also exports `formatTimestamp`. `tests/data/exports/surf-entries.test.ts` is a source regex, not the packed-tarball check required. |
| REQ-SURF-02 | partial | Message.Parts/getText, Thread.RenderersProvider, ToolCall.displayState, FilterBar.useModel/serialize/parse exist. AppShell.parseCookie, Pagination.getRange, Command.score and SourceTransition.start are absent: the objects in `AppShell.tsx`, `Pagination.tsx:247`, `Command.tsx:362` and `SourceTransition.tsx:119` have no such members. `surf-statics.test.ts` only checks FilterBar. |
| REQ-SURF-03 | partial | `src/ai/ai.css:3-12` uses 10x `!important`. `src/media/media.css` is an empty skeleton in `@layer media`, and backdrops CSS is in `@layer backdrops`, not `ag.components`. No hex or backdrop-filter. `fragments/css/surf.ts` is present. |
| REQ-SURF-04 | done | Static boundary tests are present (`tests/data/boundaries.test.ts`, `data-peer-isolation.test.ts`, `no-chart-deps.test.ts`). No chart.js/date-fns in SURF paths. The esbuild metafile check was not run. |
| REQ-SURF-05 | done | `scripts/surf/verify-surf-purity.mjs` runs clean on origin/next. `lint/rules/surf/no-network-in-ai.cjs` and `no-simulation` are present, with purity-gate fixture tests (passed). |
| REQ-SURF-06 | done | `fragments/side-effects/surf.ts` is `[]`; `src/ai/__tests__/side-effects.test.ts` is present. The PLAT gate was not run. |
| REQ-SURF-07 | done | `tests/rsc/surf/directives.test.ts` passed. The Next 16 canary manifest check was never run. |
| REQ-SURF-08 | partial | `tests/data/rsc-hydration.test.tsx` and `useMediaElement.ssr.test.tsx` are present. The Next 16 hydration spec (`tests/e2e/surf/app-shell/ssr-hydration.spec.ts`) is remote and never ran. |
| REQ-SURF-09 | done | 47 `*.meta.ts` across SURF; `src/app-shell/meta.test.ts` and `tests/data/meta-coverage.test.ts` passed. |
| REQ-SURF-10 | partial | 21 SURF modules still use `React.forwardRef` (Backdrop.tsx:19, VirtualList, every MediaControls/NowPlayingBar part, MediaScrubber, Waveform). labels tests are present. The RTL e2e is remote and never ran. |
| REQ-SURF-11 | done | `tests/types/surf/prop-grammar.test-d.ts`; `lint/rules/surf/_strict.cjs`. |
| REQ-SURF-12 | partial | release/4.x `fragments/deprecations/surf.ts` has 145 DEP-S rows, but 142 use `since:'4.2.0'` (only 3 use 4.3.0, although renames should be 4.3.0) and 18 use `removeIn:'6.0.0'` (the PRD says 5.0.0). The next copy holds only 33 W4 rows. |
| REQ-SURF-13 | partial | 66 adapters in `src/compat/surf/**`. Missing: GlassSplitPane, GlassSidebarRail/Panel, LiquidGlassInsetSidebar, GlassNavigationMenu, LiquidGlassInspectorPanel, app-shell GlassBreadcrumbs. |
| REQ-SURF-14 | partial | `fragments/codemods/surf.ts` has about 159 mapping rows, but there are only 8 fixture cases under `fragments/codemods/surf/fixtures/` (the PRD requires at least 1 per absorbed name, about 80). |
| REQ-SURF-15 | done | 21 files under `tests/fixtures/consumer-4x/cases/surf/`. The L11 canary never ran. |
| REQ-SURF-16 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-17 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-18 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-19 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-20 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-21 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-22 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-23 | done | `src/app-shell/AppShell.tsx` (slots via data-ag-slot, no displayName or cloneElement), `app-shell.css` (3 `@container ag-app-shell` conditions), `parseAppShellCookie.ts:50` (Path/Max-Age/SameSite), `appShellStore.ts` (controlled mode); unit tests passed. |
| REQ-SURF-24 | done | `app-shell.css`, `Sidebar.tsx`, `Sidebar.Nav.tsx`, `Sidebar.test.tsx` (passed). Browser measurements were never run. |
| REQ-SURF-25 | done | `app-shell.css`, `Sidebar.tsx`, `Sidebar.Nav.tsx`, `Sidebar.test.tsx` (passed). Browser measurements were never run. |
| REQ-SURF-26 | done | `app-shell.css`, `Sidebar.tsx`, `Sidebar.Nav.tsx`, `Sidebar.test.tsx` (passed). Browser measurements were never run. |
| REQ-SURF-27 | done | `app-shell.css`, `Sidebar.tsx`, `Sidebar.Nav.tsx`, `Sidebar.test.tsx` (passed). Browser measurements were never run. |
| REQ-SURF-28 | done | `app-shell.css`, `Sidebar.tsx`, `Sidebar.Nav.tsx`, `Sidebar.test.tsx` (passed). Browser measurements were never run. |
| REQ-SURF-29 | done | `app-shell.css`, `Sidebar.tsx`, `Sidebar.Nav.tsx`, `Sidebar.test.tsx` (passed). Browser measurements were never run. |
| REQ-SURF-30 | done | `appShellStore.ts:74-76` sets `inert` when collapsed or compact, with CSS display:none and no aria-hidden on the root. |
| REQ-SURF-31 | done | `Sidebar.Drawer.tsx` uses the CMP `Sheet` (modal) rather than Base UI Dialog + useLayer directly (acceptable seam). The drawer e2e was never run. |
| REQ-SURF-32 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-33 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-34 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-35 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-36 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-37 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-38 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-39 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-40 | done | `AppShell.SidebarToggle.tsx` (aria-haspopup, shortcut, shared ResizeObserver in the store), `TopBar.tsx` (MAT ScrollEdge), `Inspector*.tsx`, `StatusBar.Live.tsx` (useAnnouncer, 1000 ms debounce), `MobileShell.tsx`; unit tests are present. |
| REQ-SURF-41 | done | `registry/items/app-shell-workspace/` (index, fixtures, stories, registry-item.json). |
| REQ-SURF-42 | done | `ResizablePanels.tsx` (getBoundingClientRect on pointerdown, setPointerCapture, rAF flex-basis, single onLayout, localStorage in a layout effect, stackBelow) and `resizePanels.ts` (pure reducer); both tests passed. |
| REQ-SURF-43 | done | `ResizablePanels.tsx` (getBoundingClientRect on pointerdown, setPointerCapture, rAF flex-basis, single onLayout, localStorage in a layout effect, stackBelow) and `resizePanels.ts` (pure reducer); both tests passed. |
| REQ-SURF-44 | done | `ResizablePanels.tsx` (getBoundingClientRect on pointerdown, setPointerCapture, rAF flex-basis, single onLayout, localStorage in a layout effect, stackBelow) and `resizePanels.ts` (pure reducer); both tests passed. |
| REQ-SURF-45 | done | `ResizablePanels.tsx` (getBoundingClientRect on pointerdown, setPointerCapture, rAF flex-basis, single onLayout, localStorage in a layout effect, stackBelow) and `resizePanels.ts` (pure reducer); both tests passed. |
| REQ-SURF-46 | done | `ResizablePanels.tsx` (getBoundingClientRect on pointerdown, setPointerCapture, rAF flex-basis, single onLayout, localStorage in a layout effect, stackBelow) and `resizePanels.ts` (pure reducer); both tests passed. |
| REQ-SURF-47 | done | `src/components/tabs/Tabs.tsx` uses `@base-ui/react` and `startMorph` with a view-transition-name; `Tabs.test.tsx` passed. |
| REQ-SURF-48 | done | `src/components/tabs/Tabs.tsx` uses `@base-ui/react` and `startMorph` with a view-transition-name; `Tabs.test.tsx` passed. |
| REQ-SURF-49 | done | `src/components/tabs/Tabs.tsx` uses `@base-ui/react` and `startMorph` with a view-transition-name; `Tabs.test.tsx` passed. |
| REQ-SURF-50 | partial | `Tabs.css` has overflow-x:auto but no `mask-image` edge fade, and no `scrollIntoView` keeps the active tab in view. |
| REQ-SURF-51 | done | `TabBar.tsx` (navigation/tabs semantics, >5 items warning, SurfaceGroup). |
| REQ-SURF-52 | done | `TabBar.tsx` (navigation/tabs semantics, >5 items warning, SurfaceGroup). |
| REQ-SURF-53 | done | `TabBar.tsx` (navigation/tabs semantics, >5 items warning, SurfaceGroup). |
| REQ-SURF-54 | partial | The `minimizeOnScroll` prop is accepted by `TabBar.tsx:23`, but `TabBar.css` has no `animation-timeline: scroll()` rule, so minimize does nothing. |
| REQ-SURF-55 | done | `Breadcrumbs.tsx` and `Breadcrumbs.Overflow.tsx` (CMP Menu, 'Show N more'). |
| REQ-SURF-56 | done | `Breadcrumbs.tsx` and `Breadcrumbs.Overflow.tsx` (CMP Menu, 'Show N more'). |
| REQ-SURF-57 | partial | No `max-inline-size: 16ch` segment truncation in `Breadcrumbs.css`. The server canary page `canaries/next16/app/surf/breadcrumbs-server/page.tsx` is absent. |
| REQ-SURF-58 | partial | `getPaginationRange` exists (`getRange.ts`; 40-case test passed) but is not exposed as `Pagination.getRange`. |
| REQ-SURF-59 | partial | aria-current and aria-disabled are present. No `@container ag-pagination` compact mode ('Page N of M' below 400 px). |
| REQ-SURF-60 | partial | `Command.tsx` is a hand-rolled listbox, not Base UI Combobox. `CommandPalette.tsx` uses the CMP Dialog. |
| REQ-SURF-61 | done | `score.ts` (no RegExp); `score.test.ts` includes a 10,000-query fuzz and passed. |
| REQ-SURF-62 | done | `Command.tsx:210` guards isComposing; loop; one hotkey listener (`CommandPalette.test.tsx` passed). |
| REQ-SURF-63 | partial | Not virtualized: `Command.tsx:6` says "until then >100 items render non-virtualized". The count announcement is present. |
| REQ-SURF-64 | partial | The API is `startSourceTransition(root,id,update)` (`SourceTransition.tsx:111`), not the `SourceTransition.start(id, update)` static. |
| REQ-SURF-65 | done | Uses the MAT `startMorph` and handles focus. |
| REQ-SURF-66 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-67 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-68 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-69 | done | Range selection via shiftKey. The header uses a native `<input type=checkbox>`, not the CMP Checkbox (minor). |
| REQ-SURF-70 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-71 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-72 | partial | Pinning uses `getStart`, but there is no `data-ag-pinned-edge`, no pin shadow var and no auto-pin below 480 px. |
| REQ-SURF-73 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-74 | partial | `Table.tsx:632` replaces all rows with a single text row while loading. There are no 8 CMP Skeleton rows, and existing rows are removed. |
| REQ-SURF-75 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-76 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-77 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-78 | done | `src/data/table/Table.tsx` (653 lines: aria-sort, 'Sort by', announcer, aria-rowcount/rowindex, translateY, resize separator, columnResizeMode, useGridKeyboard with PageUp, scrollToRow/focusCell handle, 'Move left'/'Moved'); Table, virtual, resize and reorder tests passed. |
| REQ-SURF-79 | missing | 5.1: there is no `onCellEditCommit` or editor UI. Only a `meta.editor` type exists in `types.ts`. |
| REQ-SURF-80 | done | `src/data/virtual-list/VirtualList.tsx` (useVirtualizer, anchor, onEndReached, scrollToKey, measureElement). |
| REQ-SURF-81 | done | `src/data/tree-view/TreeView.tsx` on react-aria-components (loadChildren, aria-busy, files preset, virtualize). |
| REQ-SURF-82 | done | `src/data/tree-view/TreeView.tsx` on react-aria-components (loadChildren, aria-busy, files preset, virtualize). |
| REQ-SURF-83 | done | `src/data/tree-view/TreeView.tsx` on react-aria-components (loadChildren, aria-busy, files preset, virtualize). |
| REQ-SURF-84 | done | `filter-model.ts`, `filter-model-ops.ts`, `filter-serialize.ts`; `filter-model.test.ts` passed. The `tests/types/surf/filter-model.test-d.ts` file named in the PRD is absent. |
| REQ-SURF-85 | done | `filter-model.ts`, `filter-model-ops.ts`, `filter-serialize.ts`; `filter-model.test.ts` passed. The `tests/types/surf/filter-model.test-d.ts` file named in the PRD is absent. |
| REQ-SURF-86 | done | `filter-model.ts`, `filter-model-ops.ts`, `filter-serialize.ts`; `filter-model.test.ts` passed. The `tests/types/surf/filter-model.test-d.ts` file named in the PRD is absent. |
| REQ-SURF-87 | partial | `FilterBar.tsx` uses a native `<input type=search>` and its own toggles and popover; there is no CMP SearchField/ToggleGroup/Popover/Sheet. The below-480 px 'Filters (n)' sheet and the '+n more' wrap are not implemented. |
| REQ-SURF-88 | done | Chip, KeyValueEditor, StatCard (Intl, aria-labelledby, trend), Sparkline (non-scaling-stroke, CanvasText, 'no data'); tests passed. |
| REQ-SURF-89 | done | Chip, KeyValueEditor, StatCard (Intl, aria-labelledby, trend), Sparkline (non-scaling-stroke, CanvasText, 'no data'); tests passed. |
| REQ-SURF-90 | done | Chip, KeyValueEditor, StatCard (Intl, aria-labelledby, trend), Sparkline (non-scaling-stroke, CanvasText, 'no data'); tests passed. |
| REQ-SURF-91 | done | Chip, KeyValueEditor, StatCard (Intl, aria-labelledby, trend), Sparkline (non-scaling-stroke, CanvasText, 'no data'); tests passed. |
| REQ-SURF-92 | done | `ChartFrame.tsx` + `ChartFrame.Interactive.tsx` (figcaption, ResizeObserver, aria-pressed legend, 'At least one series', 'Show data table'), `chart-frame.css` `--_ag-chart-1..8` OKLCH. |
| REQ-SURF-93 | done | `ChartFrame.tsx` + `ChartFrame.Interactive.tsx` (figcaption, ResizeObserver, aria-pressed legend, 'At least one series', 'Show data table'), `chart-frame.css` `--_ag-chart-1..8` OKLCH. |
| REQ-SURF-94 | done | `ChartFrame.tsx` + `ChartFrame.Interactive.tsx` (figcaption, ResizeObserver, aria-pressed legend, 'At least one series', 'Show data table'), `chart-frame.css` `--_ag-chart-1..8` OKLCH. |
| REQ-SURF-95 | done | `ChartFrame.tsx` + `ChartFrame.Interactive.tsx` (figcaption, ResizeObserver, aria-pressed legend, 'At least one series', 'Show data table'), `chart-frame.css` `--_ag-chart-1..8` OKLCH. |
| REQ-SURF-96 | done | `src/components/timeline/Timeline.tsx` and `ActivityFeed(.Interactive).tsx` (dateTime, IntersectionObserver, 'new activities' batching, groupBy). |
| REQ-SURF-97 | done | `src/components/timeline/Timeline.tsx` and `ActivityFeed(.Interactive).tsx` (dateTime, IntersectionObserver, 'new activities' batching, groupBy). |
| REQ-SURF-98 | partial | Built on RAC with `DateProvider` (I18nProvider), but popups use RAC Popover rather than CMP Popover, and there is no CMP Sheet below 640 px (the comment in `DatePicker.tsx:3` claims it, but `date.css` has no rule for it). |
| REQ-SURF-99 | done | `src/date/*.tsx` (shared props, Calendar, DateRangePicker presets/visibleMonths, TimePicker minuteStep). The only unit test file is `date-props.test.tsx` (8 cases). |
| REQ-SURF-100 | done | `src/date/*.tsx` (shared props, Calendar, DateRangePicker presets/visibleMonths, TimePicker minuteStep). The only unit test file is `date-props.test.tsx` (8 cases). |
| REQ-SURF-101 | partial | The 'Choose date' trigger and dialog are present. No bottom-sheet presentation below 640 px. |
| REQ-SURF-102 | done | `src/date/*.tsx` (shared props, Calendar, DateRangePicker presets/visibleMonths, TimePicker minuteStep). The only unit test file is `date-props.test.tsx` (8 cases). |
| REQ-SURF-103 | done | `src/date/week-number.ts` (ISO). Boundary cases are covered by one test in `date-props.test.tsx`, not the 20-case `week-number.test.ts`. |
| REQ-SURF-104 | done | `src/date/*.tsx` (shared props, Calendar, DateRangePicker presets/visibleMonths, TimePicker minuteStep). The only unit test file is `date-props.test.tsx` (8 cases). |
| REQ-SURF-105 | missing | 5.1: there is no DateTimePicker. |
| REQ-SURF-106 | partial | The devdeps PR #48 merged (ai 5.0.29 pinned), but the SDK files were never moved to their final paths: they remain in `ci/surf/ai-sdk/**`, and `tests/types/surf/ai-sdk-compat.test-d.ts` is absent. `ui-messages.ai-sdk.json` is generated from the hand-authored `ui-messages.source.ts`, not from the SDK types. |
| REQ-SURF-107 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-108 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-109 | done | Implementation is in Thread.tsx. `scripts/surf/gen-ai-thread-fixture.mjs` (named by the PRD) is absent, although `thread-2000.json` is committed. |
| REQ-SURF-110 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-111 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-112 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-113 | partial | `StreamingText.tsx`: no per-frame commit coalescing (no useSyncExternalStore or rAF), no 600-char truncation of the complete announcement, no `aria-busy`, and 'sentences' mode is not batched at 1,000 ms or more. Contains dead code (`void done`). |
| REQ-SURF-114 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-115 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-116 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-117 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-118 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-119 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-120 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-121 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-122 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-123 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-124 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-125 | partial | `Citation.tsx` uses useLayer, but there is no Base UI PreviewCard. |
| REQ-SURF-126 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-127 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-128 | done | `src/ai/**` (Thread role=log, pinThreshold, virtualizeAfter, VirtualList, no scrollIntoView; Message Intl heading; MessageParts; Composer isComposing/229, Stop, attachments; ToolCall Collapsible/approval; Reasoning; AgentSteps; SourceList safe URLs; UsageMeter; ProviderErrorState). Composer, Thread and ToolCall tests passed. |
| REQ-SURF-129 | done | Semantics are present. The L13 manual records dir contains only README.md. |
| REQ-SURF-130 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-131 | partial | There is no `document.visibilityState` gating of the progress frame loop in `useMediaElement.ts` (only IntersectionObserver). |
| REQ-SURF-132 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-133 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-134 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-135 | partial | There is no CMP Menu 'More' overflow, and responsive container rules are impossible because `src/media/media.css` is empty. |
| REQ-SURF-136 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-137 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-138 | partial | The `<time dateTime=PT..>` element is present, but media.css is empty, so no 44/32 px hit-target CSS exists. |
| REQ-SURF-139 | partial | NowPlayingBar parts exist, but there are no container or height CSS rules (media.css is empty) and no Artwork tone sampling. |
| REQ-SURF-140 | partial | 5.1: `src/media/Waveform/` exists and is tested but is not exported (correct for 5.0). Shipped ahead of schedule. |
| REQ-SURF-141 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-142 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-143 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-144 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-145 | partial | Counter announces. There is no `fetchpriority`, and the stage images are not sampled for tone. Styling depends on the empty media.css. |
| REQ-SURF-146 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-147 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-148 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-149 | partial | The autoplay gate (allowContinuous, motion full, hover/focus/offscreen) is present, but there is no `document.hidden` pause. |
| REQ-SURF-150 | done | No backdrop-filter in `src/media/CarouselRail/**`. |
| REQ-SURF-151 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-152 | partial | `classifyTone.ts` implemented, but its calibration is not real: `scripts/surf/calibrate-media-tone.mjs` writes `{pending:true}` per scene and hard-coded constants, while `src/media/sampling/__fixtures__/scene-stats.json` claims an "alpha run on remote runner" that never ran. There are zero pipelines. |
| REQ-SURF-153 | partial | The cache, requestIdleCallback and LRU in `toneCache.ts` are real, but sampling is wired only through `useMediaElement`. Backdrop photo/video, NowPlayingBar.Root and ImageViewer.Stage never sample. No `decode()`/`loadeddata` trigger. |
| REQ-SURF-154 | partial | Depends on the L6 three-composite run, which never happened. |
| REQ-SURF-155 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-156 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-157 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-158 | partial | `scheme='auto'` has no `light-dark()` CSS. |
| REQ-SURF-159 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-160 | done | `src/media/useMediaElement.ts` + `mediaStore.ts` (AbortController, snapshotHz, subscribeFrame, autoplay-blocked, mediaSession), MediaControls parts (Base UI Toolbar), MediaScrubber ('unknown duration', chapters, --_ag-start), ImageViewer (useLayer, non-passive wheel, pointer capture, translate3d), CarouselRail (IO 0.6, continuous gate), sampling (OffscreenCanvas, BT.709), Backdrop presets, BackdropTone video gating, grain assets. |
| REQ-SURF-161 | done | 5.1: `src/charts/Chart.tsx` + d3 optional peers (`package.json:107-108`), `ga:'5.1'` in entries; Chart.test is present. |
| REQ-SURF-162 | done | 5.1: `src/charts/Chart.tsx` + d3 optional peers (`package.json:107-108`), `ga:'5.1'` in entries; Chart.test is present. |
| REQ-SURF-163 | done | 5.1: `src/charts/Chart.tsx` + d3 optional peers (`package.json:107-108`), `ga:'5.1'` in entries; Chart.test is present. |
| REQ-SURF-164 | done | 5.1: `src/charts/Chart.tsx` + d3 optional peers (`package.json:107-108`), `ga:'5.1'` in entries; Chart.test is present. |
| REQ-SURF-165 | done | `src/three/index.ts` is `export {}`; the contract row has `exports: []` (PR #23 merged). |
| REQ-SURF-166 | done | `packages/labs/package.json` (sideEffects false, peers, no bin; 0 residents); `verify-labs-admission.mjs` exits 0; promotion and admission tests are present. |
| REQ-SURF-167 | done | `packages/labs/package.json` (sideEffects false, peers, no bin; 0 residents); `verify-labs-admission.mjs` exits 0; promotion and admission tests are present. |
| REQ-SURF-168 | done | Spec `tests/perf/browser/surf/labs-spatial-admission.spec.ts`; no spatial residents exist. |
| REQ-SURF-169 | done | `packages/labs/package.json` (sideEffects false, peers, no bin; 0 residents); `verify-labs-admission.mjs` exits 0; promotion and admission tests are present. |
| REQ-SURF-170 | done | `tests/capability/registry/blocks-lint.test.ts`; 15 blocks and 30 items. |
| REQ-SURF-171 | partial | All 7 GA blocks exist, but their render tests pass vacuously under the root Jest config (`if (!Block) { console.warn(PENDING); return; }`, confirmed by running them). Under `jest.doubles.cjs` 'aura-glass' maps to doubles, and `ai-items.test.tsx` FAILS (ai-artifact-panel: "Cannot read properties of undefined (reading 'Root')"). |
| REQ-SURF-172 | partial | The route is real but stays at `ci/surf/ai-sdk/ai-workspace/app/api/chat/route.ts`, not in the block. The 429 body lacks `retryAfterMs`. The 32 KB cap checks only the Content-Length header. `registry/blocks/ai-workspace/__tests__/route.test.ts` only string-matches the source. |
| REQ-SURF-173 | partial | All 7 items exist; `ai-sdk-adapter/useAuraChat.ts` is present. The ai-items suite fails in the doubles lane (see 171). |
| REQ-SURF-174 | done | `registry/items/{query-builder,tree-select,faceted-search,schema-viewer,media-*,backdrop-hero,presence-stack,comment-thread}`, `registry/blocks/{commerce-*,pricing,audit-log,permissions-matrix}`. Several render tests run only under the doubles preset. |
| REQ-SURF-175 | done | `registry/items/{query-builder,tree-select,faceted-search,schema-viewer,media-*,backdrop-hero,presence-stack,comment-thread}`, `registry/blocks/{commerce-*,pricing,audit-log,permissions-matrix}`. Several render tests run only under the doubles preset. |
| REQ-SURF-176 | done | `registry/items/{query-builder,tree-select,faceted-search,schema-viewer,media-*,backdrop-hero,presence-stack,comment-thread}`, `registry/blocks/{commerce-*,pricing,audit-log,permissions-matrix}`. Several render tests run only under the doubles preset. |
| REQ-SURF-177 | done | `registry/items/{query-builder,tree-select,faceted-search,schema-viewer,media-*,backdrop-hero,presence-stack,comment-thread}`, `registry/blocks/{commerce-*,pricing,audit-log,permissions-matrix}`. Several render tests run only under the doubles preset. |
| REQ-SURF-178 | done | `registry/items/{query-builder,tree-select,faceted-search,schema-viewer,media-*,backdrop-hero,presence-stack,comment-thread}`, `registry/blocks/{commerce-*,pricing,audit-log,permissions-matrix}`. Several render tests run only under the doubles preset. |
| REQ-SURF-179 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-180 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-181 | partial | The delivery checker exists and is tested only on fixtures. All 58 non-rejected ledger rows are still `planned` (0 `delivered`), despite the shipped code. |
| REQ-SURF-182 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-183 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-184 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-185 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-186 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-187 | done | `docs/auraglass-5/capability-ledger.json` (71 rows = 58 + 13), schema, `verify-capability-ledger.mjs` exits 0, `stories/surf/capability/CapabilityRoadmap.stories.tsx`, export-budget/no-alias/req-refs tests. |
| REQ-SURF-188 | partial | Implementation hooks and spec files exist (`tests/e2e/surf/**`, `tests/perf/browser/surf/**`), but these are pixel, axe, perf and motion gates that have never executed. There are no remote runs and zero GitLab pipelines. |
| REQ-SURF-189 | partial | Implementation hooks and spec files exist (`tests/e2e/surf/**`, `tests/perf/browser/surf/**`), but these are pixel, axe, perf and motion gates that have never executed. There are no remote runs and zero GitLab pipelines. |
| REQ-SURF-190 | partial | Implementation hooks and spec files exist (`tests/e2e/surf/**`, `tests/perf/browser/surf/**`), but these are pixel, axe, perf and motion gates that have never executed. There are no remote runs and zero GitLab pipelines. |
| REQ-SURF-191 | partial | Implementation hooks and spec files exist (`tests/e2e/surf/**`, `tests/perf/browser/surf/**`), but these are pixel, axe, perf and motion gates that have never executed. There are no remote runs and zero GitLab pipelines. |
| REQ-SURF-192 | partial | Implementation hooks and spec files exist (`tests/e2e/surf/**`, `tests/perf/browser/surf/**`), but these are pixel, axe, perf and motion gates that have never executed. There are no remote runs and zero GitLab pipelines. |
| REQ-SURF-193 | partial | Implementation hooks and spec files exist (`tests/e2e/surf/**`, `tests/perf/browser/surf/**`), but these are pixel, axe, perf and motion gates that have never executed. There are no remote runs and zero GitLab pipelines. |
| REQ-SURF-194 | done | All 11 `fragments/*/surf.*` files are present. |
| REQ-SURF-195 | partial | `ci/surf.gitlab-ci.yml` has the 4 jobs, all `allow_failure: true`, and has never run (GitLab project 87152036 has 0 pipelines and only branch main). |
| REQ-SURF-196 | partial | Metas, APG scripts (23) and size rows are present. The APG specs early-`return` (pass) when the subject is unregistered. There are no L13 manual records and no L7 baselines; perf grades are unmeasured. |