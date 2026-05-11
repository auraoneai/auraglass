# AuraGlass 3.0.6 Upstream Fix Plan

## Purpose

This document is the package-side fix plan for `aura-glass@3.0.6`.

It exists because the AuraGlass website V5 catalog pass proved that the website can now expose the package surface, but several green website outcomes are still produced by temporary staging wrappers, probe exemptions, or hand-built previews. Those must be removed by fixing the core AuraGlass package.

The goal for 3.0.6 is simple:

**No more mini-fixes. No more website-only hiding. Fix the package defects completely, remove the website workarounds, repack into the website, and prove the website catalog stays green using the real components.**

## Repos

- Package repo: `/Users/gurbakshchahal/AuraGlass`
- Website repo: `/Users/gurbakshchahal/auraglasswebsite`
- Website upstream bug tracker: `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.2-rebuild/AURAGLASS-UPSTREAM-BUGS.md`
- Website V5 report folder: `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.6-catalog/`
- Current package baseline: `aura-glass@3.0.5`
- Target package release: `aura-glass@3.0.6`

## What The Website Proved

The website V5 pass made the catalog much more complete:

- `aura-glass@3.0.5` installed cleanly.
- Website typecheck had 0 TypeScript errors.
- Package runtime component-like exports: 448.
- Website registry entries: 449.
- Website missing components: 0.
- Website duplicates: 0.
- Live previews increased from 261 to 282.
- Current V5 probe state at plan creation:
  - `inventory-reconciliation.json`: 449 preview entries, 0 missing, 0 duplicates, 1 website-only intentional entry.
  - `empty-previews.json`: passed, 0 findings.
  - `visual-density.json`: passed, 0 findings.
  - `geometry.json`: failed, 85 findings across 33 component IDs.
- New probes were added:
  - `scripts/audit/inventory.ts`
  - `scripts/audit/empty-previews.ts`
  - `scripts/audit/geometry.ts`
  - `scripts/audit/visual-density.ts`
  - `scripts/audit/contact-sheet.ts`
  - upgraded `scripts/audit/runtime.ts`
  - upgraded `scripts/audit/symmetry.ts`
- 13-step gate was expanded and run.

But the website also exposed core package problems that are currently masked by staging:

- 43 dense components needed `CompactPreview` wrappers.
- `GlassDiffViewer` was replaced by a hand-built table preview.
- `ContrastGuard` needed a custom manually staged backdrop.
- `GlassAdvanced` needed explicit props to avoid a sparse default.
- Dropdown/menu content still has containment/portal problems.
- Headless canvas/WebGL exemptions need real-browser verification.

## Non-Negotiable Rules For 3.0.6

- Fix package source first. Do not rely on website-only CSS, wrapper, or mock previews.
- Keep website staging only long enough to prove the catalog while upstream fixes are being built.
- Every website workaround must have a matching upstream bug ID and deletion target.
- After package fixes land, remove the website workaround and run the website gate again.
- Do not replace real components with hand-built previews.
- Do not call a website gate "package clean" unless the website is using real AuraGlass components.
- Do not break normal production behavior to make preview cards pass.
- Add compact/contained behavior as opt-in where the full-size default is legitimate.
- Add tests for every upstream bug fixed.
- Update changelog and README only after behavior is actually fixed.

## Current Website Workarounds That Must Be Removed

| Workaround | Website location | Why it is not enough | Upstream bug |
| --- | --- | --- | --- |
| `CompactPreview maxHeight={220}` wrapping dense components | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/**` and `composition.tsx` | Hides package components that cannot render in constrained containers | B19 / B23 |
| Hand-built diff table replacing `GlassDiffViewer` | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/dataDisplay.tsx` | Stops proving the real package component | B21 |
| Custom busy gradient backdrop around `ContrastGuard` | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/accessibility.tsx` | Demonstrates website staging, not intrinsic component usefulness | B22 |
| Explicit strong props/min-height on `GlassAdvanced` | `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/surfaces.tsx` | Masks weak package defaults | B20 |
| Headless canvas/WebGL exemptions | `/Users/gurbakshchahal/auraglasswebsite/scripts/audit/empty-previews.ts` and possibly density probes | May hide real blank-rendering if not validated in real browser | B24 candidate |
| Dropdown/menu stills or containment staging | Website navigation/input/overlay previews | Hides portal content escaping card/container | B18 |

## Release Success Criteria

3.0.6 is complete only when all of the following are true:

- Package fixes for B18, B19/B23, B20, B21, B22, and B24 verification are complete.
- Package unit/regression tests pass.
- Package release gates pass.
- `aura-glass@3.0.6` is packed into the website.
- Website removes the corresponding workarounds.
- Website still has 0 missing catalog entries.
- Website 13-step gate passes with real components.
- Website `SUMMARY.md` marks fixed upstream bugs as resolved and names the package version.
- README and CHANGELOG accurately describe the release.
- Package metadata, docs, and npm-facing links point to the new organization repository: `https://github.com/auraoneai/auraglass`.
- npm latest points to `3.0.6` if publishing is requested.

## Live Execution Ledger

This section is updated as the 3.0.6 work proceeds. It is intentionally blunt: "source fixed" means package code has been changed, but the issue is not truly closed until package tests pass, the local pack is installed into the website, website workarounds are removed, and the website 13-step gate passes against the real package.

| Area | Package source status | Website workaround status | Verification status | Release status |
| --- | --- | --- | --- | --- |
| B18 overlay/menu containment | Source patched for dropdown menu, select, select compound, context menu, and menubar containment APIs. | Still must remove/drop still previews and use real contained overlays where applicable. | Package gates passed through focused regressions, full Jest, `glass:full-check`, `verify:pack`, and `release:dry-run`; website gate still required. | Package-side ready; not closed until website proof passes. |
| B19/B23 dense component compact/contained modes | Source patched for the first large tranche of dense components across data, calendar, interactive, layout, ecommerce, dashboard, templates, AI, collaboration, social, media, input, and theme families. | Website `CompactPreview` wrappers still must be replaced with real `compact`/`contained`/`maxHeight` props. | Package gates passed through focused regressions, full Jest, `glass:full-check`, `verify:pack`, and `release:dry-run`; website geometry gate still required. | Package-side ready; not closed until website proof passes. |
| B20 `GlassAdvanced` weak default | Source patched with stronger visible defaults plus compact/preview/minHeight support. | Website explicit prop inflation still must be removed or reduced to a normal example. | Focused test added; package gates passed through full Jest, `glass:full-check`, `verify:pack`, and `release:dry-run`; website proof still required. | Package-side ready; not closed until website proof passes. |
| B21 `GlassDiffViewer` hand-built website mock | Source patched with semantic diff rendering, compact/maxHeight support, default sample diff, and tests. | Website hand-built table still must be replaced with real `GlassDiffViewer`. | Focused tests passed after snapshot update; package gates passed through full Jest, `glass:full-check`, `verify:pack`, and `release:dry-run`; website proof still required. | Package-side ready; not closed until website proof passes. |
| B22 `ContrastGuard` staged website backdrop | Source patched with optional package-owned `demoBackdrop` and `showIndicator`. | Website custom-only gradient staging still must be replaced with package API. | Focused tests passed after snapshot update; package gates passed through full Jest, `glass:full-check`, `verify:pack`, and `release:dry-run`; website proof still required. | Package-side ready; not closed until website proof passes. |
| B24 headless canvas/WebGL blank-render exemptions | Not source-fixed yet; requires real-browser evidence first. | Website exemptions may remain only if each is proven headless-only. | Real-browser screenshots/console evidence still required for all 10 exempt IDs. | Not closed. |
| B25 inventory taxonomy mismatch | Planned. Not required for 3.0.6 unless release messaging still conflicts. | Website inventory script can remain heuristic for 3.0.6 if counts are clearly documented. | Must decide before release notes are finalized. | Open/likely 3.1 unless blocking. |
| B26 organization repo migration | Package metadata/docs source patched to `auraoneai/auraglass`; local Git remote now points to `https://github.com/auraoneai/auraglass.git`. | Website/docs references must be checked separately when website is touched. | Repository-link audit has no old public AuraGlass repo URLs; `npm pack --dry-run --json` includes updated README/package metadata. | Package-side ready; not closed until publish and push land. |

Current hard blockers before publishing:

- [x] Focused Jest regression run over every changed component family.
- [x] Full `npm test -- --runInBand`.
- [x] `npm run glass:full-check`.
- [x] `npm run verify:pack`.
- [x] `npm run release:dry-run`.
- [x] Bump `package.json` and `package-lock.json` to `3.0.6`.
- [x] Update README and CHANGELOG with only proven behavior.
- [x] Pack local `aura-glass-3.0.6.tgz`.
- [x] Install local pack into `/Users/gurbakshchahal/auraglasswebsite` as recorded in this ledger; website verification still pending.
- [x] Run repository-link audit excluding `node_modules`, `dist`, `coverage`, and source-map files.
- [ ] Remove website workarounds listed in this file.
- [ ] Run website typecheck and 13-step gate.
- [ ] Mark fixed upstream bugs resolved in website upstream tracker.
- [x] Update Git remote to `https://github.com/auraoneai/auraglass.git`.
- [ ] Publish to npm only after package and website proof pass.

## Master Bug List For 3.0.6

### Existing Upstream Tracker Items That Must Be Respected

The website upstream tracker already contains B1-B23. The 3.0.6 release is primarily scoped to B18-B23 plus B24 verification, but the package must not regress any earlier package-level bugs. Before publishing, run a pass against all tracker entries and record whether each is fixed, still open, or out of scope for 3.0.6.

Earlier tracker entries:

| ID | Title | 3.0.6 requirement |
| --- | --- | --- |
| B1 | `OptimizedGlass` inline gradient uses broken `var()` fallback as alpha | Verify no new `var(--token, 0.xx)` alpha misuse is introduced; fix if touched by compact/default visual work. |
| B2-B9 | Earlier package-level website suppression bugs documented in `AURAGLASS-UPSTREAM-BUGS.md` | Read and preserve current status; do not delete website suppression comments unless the upstream source is fixed and verified. |
| B10 | `GlassModal` and controlled overlays can cause maximum-update-depth loops | Re-run runtime probe after overlay containment work; no controlled overlay loops may return. |
| B11 | `GlassCollaborationProvider` package barrel exports a stub | Verify collaboration previews use the real provider/export after package repack. |
| B12 | `useMotionController` requires `GlassMotionController` | Verify provider-dependent motion previews stay wrapped and runtime-clean. |
| B13 | `useAccessibility` requires `AccessibilityProvider` | Verify accessibility previews stay wrapped and runtime-clean. |
| B14 | WebGL components call `gl.readPixels()` per frame | Verify this is fixed or documented; do not hide frame stalls with website probe exemptions. |
| B15 | `Glass3DEngine` renders debug text in default child slot | Verify no debug text appears in package examples or website contact sheets. |
| B16 | Color/theme inputs assign CSS `var(...)` strings to `<input type="color">` values | Fix if still present; color inputs must receive resolved `#rrggbb` values. |
| B17 | `GlassMetricCard.valueStyle` and `valueClassName` typedef props do not reach rendered value span | Verify prop forwarding or add a regression test if touched. |

The detailed source lines and website workaround references remain in:

- `/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.2-rebuild/AURAGLASS-UPSTREAM-BUGS.md`

### B18 — Dropdown/Menu Portal Containment

**Severity:** high.

**Problem:**

Dropdown/menu content portals to `document.body` by default and cannot reliably stay inside constrained surfaces such as catalog cards, modals, drawers, sidebars, or embedded app shells.

**Why website workaround is not enough:**

The website can use still previews or staging wrappers, but real consumers need a package API that supports contained overlays.

**Likely package areas:**

- `/Users/gurbakshchahal/AuraGlass/src/components/navigation/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/input/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/overlay/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/modal/**`
- Any dropdown/context-menu/menubar/select/popover primitives.

**Required package fix:**

Add a consistent containment API to overlay/menu components:

```ts
portalContainer?: HTMLElement | null;
portalled?: boolean;
positionStrategy?: 'fixed' | 'absolute' | 'contained';
contained?: boolean;
```

Implementation requirements:

- Default production behavior can remain portalled/fixed where appropriate.
- `contained` or `positionStrategy="contained"` must render content inside the local component boundary.
- Must work in SSR/Next.js without touching `document` during render.
- Must not break keyboard navigation or focus management.
- Must avoid z-index clipping surprises by documenting required parent overflow behavior.

**Tests required:**

- Renders default portalled behavior.
- Renders contained behavior without appending content to body.
- SSR render does not access `document`.
- Keyboard navigation still works.
- Focus management still works.
- Website preview can use the real component, not a still/mock.

**Website workaround to remove after fix:**

- Any still previews or custom containment wrappers around dropdown/menu content.

**Acceptance criteria:**

- Website dropdown/menu previews can render real open content in card previews.
- Geometry probe no longer sees portal content escaping cards.
- No provider/runtime errors.

### B19 / B23 — Dense Components Need Native Compact/Contained Modes

**Severity:** critical for catalog credibility and real app embedding.

**Problem:**

The website had to wrap 43 dense components with `CompactPreview maxHeight={220}`. This is catalog staging, not a package fix. These components have natural heights/widths that overflow preview cards and likely also fail in real embedded dashboards, drawers, side panels, command surfaces, and docs examples.

**Why website workaround is not enough:**

The package should support constrained rendering directly. Consumers should not need to invent clipping/fade wrappers for every dense component.

**Current website workaround:**

- `CompactPreview` in `/Users/gurbakshchahal/auraglasswebsite/components/auraglass/previews/composition.tsx`
- `CompactPreview` wrappers across many preview files.

**Required package API pattern:**

Add appropriate opt-in props across dense components:

```ts
compact?: boolean;
contained?: boolean;
preview?: boolean;
height?: number | string;
maxHeight?: number | string;
width?: number | string;
maxWidth?: number | string;
showHeader?: boolean;
showToolbar?: boolean;
showActions?: boolean;
showLegend?: boolean;
showFooter?: boolean;
density?: 'compact' | 'comfortable' | 'spacious';
```

Not every component needs every prop. Use the smallest coherent API per family and keep names consistent.

**Required behavior:**

- Normal full-size production behavior remains default.
- `compact` or `preview` mode must fit inside a 320px by 220px-ish preview surface without invisible clipping.
- Dense data remains meaningful, not simply hidden.
- Legends, labels, buttons, headers, toolbars, and rows compress or simplify intentionally.
- Long text wraps, truncates, or scrolls intentionally.
- The component owns its compact behavior rather than relying on website clipping.

**Component families to audit:**

- Data display
- Charts
- Calendars
- Heatmaps
- Tables and virtual tables
- Tree views
- Accordions
- Carousels
- Code editors
- Diff/code viewers
- Search/query builders
- Gradient/color pickers
- Persona pickers
- Menus/dropdowns/selects
- Layout/app-shell components
- AI/media visualization components
- Accessibility tooling panels

**Exact B23 component IDs that currently require website `CompactPreview` staging:**

These 43 IDs are copied from the website upstream bug tracker B23. Every item must either receive a native package compact/contained API or be explicitly reclassified with evidence that the website workaround was unnecessary.

| # | Website ID | Package-side action |
| ---: | --- | --- |
| 1 | `glass-data-table` | Add native compact/contained sizing, row density, toolbar/header compression. |
| 2 | `glass-heatmap` | Add compact legend/axis layout; no legend/value overlap. |
| 3 | `glass-calendar` | Add compact month/week layout; contain controls and day grid. |
| 4 | `glass-carousel` | Add compact slide controls and contained media frame. |
| 5 | `persona-picker` | Add compact cards/list; avoid large persona panels in card previews. |
| 6 | `glass-advanced-search` | Add compact filter/query layout and max-height handling. |
| 7 | `glass-gradient-picker` | Add compact swatch/stop editor layout. |
| 8 | `glass-code-editor` | Add compact line wrapping or horizontal scroll containment. |
| 9 | `glass-advanced-audio-player` | Add compact control bar and metadata layout. |
| 10 | `glass-data-grid` | Add compact grid/header/row sizing. |
| 11 | `glass-theme-demo` | Add compact theme sample layout. |
| 12 | `glass-virtual-table` | Add compact virtual viewport sizing. |
| 13 | `glass-accordion` | Add compact panel spacing and bounded expanded content. |
| 14 | `glass-schema-viewer` | Add compact schema/code rendering and scroll containment. |
| 15 | `glass-breadcrumb` | Add compact wrapping/collapse behavior. |
| 16 | `glass-split-pane` | Add compact demo pane sizing. |
| 17 | `glass-fractal-layout` | Add compact preview scale/bounds. |
| 18 | `glass-golden-ratio-grid` | Add compact grid scale/bounds. |
| 19 | `glass-island-layout` | Add compact island bounds. |
| 20 | `glass-gallery` | Add compact thumbnail grid. |
| 21 | `glass-music-visualizer` | Add compact visualizer canvas/frame. |
| 22 | `glass-smart-shopping-cart` | Add compact cart row/summary layout. |
| 23 | `glass-wipe-slider` | Add compact slider bounds. |
| 24 | `glass-animated` | Add compact animation frame. |
| 25 | `glass-animation-sequence` | Add compact timeline/sequence frame. |
| 26 | `glass-animation-timeline` | Add compact timeline frame. |
| 27 | `glass-magnetic-cursor` | Add compact cursor demo area. |
| 28 | `glass-a11y-auditor` | Add compact audit panel layout. |
| 29 | `glass-masonry-grid` | Add compact masonry columns and bounded height. |
| 30 | `glass-color-scheme-generator` | Add compact palette controls and swatches. |
| 31 | `glass-detail-view` | Add compact detail metadata layout. |
| 32 | `glass-intelligent-form-builder` | Add compact form-builder surface. |
| 33 | `glass-multi-select` | Add compact selected-token wrapping and dropdown containment. |
| 34 | `glass-scroll-area` | Add compact viewport/scrollbar sizing. |
| 35 | `glass-form-template` | Add compact form template layout. |
| 36 | `glass-activity-feed` | Add compact feed item spacing. |
| 37 | `collaborative-glass-workspace` | Add compact workspace/sidebar layout. |
| 38 | `glass-message-list` | Add compact chat/message row layout. |
| 39 | `glass-reaction-bubbles` | Add compact reaction cluster layout. |
| 40 | `multi-user-glass-editor` | Add compact editor/collaboration layout. |
| 41 | `glass-theme-switcher` | Add compact switcher layout. |
| 42 | `glass-a11y` | Add compact accessibility panel layout. |
| 43 | `neural-weight-visualization` | Add compact visualization controls/label layout. |

**Current V5 geometry failures that must be closed:**

The latest website geometry report still has 85 findings across these 33 IDs. These are the immediate verification targets for B19/B23. Items not in this list still remain in B23 and must be audited, but these are the components currently failing the gate.

| Website ID | Current finding count | Required 3.0.6 outcome |
| --- | ---: | --- |
| `glass-calendar` | 7 | Compact mode fits controls and day grid without clipped buttons/text. |
| `glass-data-table` | 7 | Compact rows/header/search fit inside bounded preview. |
| `glass-heatmap` | 7 | Legend, labels, and cells no longer overlap. |
| `glass-carousel` | 6 | Slides and navigation controls stay inside preview. |
| `persona-picker` | 5 | Persona cards/list render without right/bottom overflow. |
| `glass-code-editor` | 4 | Long code lines are wrapped or scroll-contained. |
| `glass-gradient-picker` | 4 | Gradient stops/labels fit without overlap. |
| `glass-advanced-audio-player` | 3 | Player controls and labels fit compact frame. |
| `glass-data-grid` | 3 | Grid columns and headers fit compact frame. |
| `glass-theme-demo` | 3 | Theme samples fit compact frame. |
| `glass-accordion` | 2 | Expanded panels fit or scroll intentionally. |
| `glass-breadcrumb` | 2 | Breadcrumb items collapse/wrap cleanly. |
| `glass-color-scheme-generator` | 2 | Palette controls fit compact frame. |
| `glass-fractal-layout` | 2 | Layout demo bounds itself. |
| `glass-gallery` | 2 | Gallery tiles stay inside frame. |
| `glass-golden-ratio-grid` | 2 | Grid demo bounds itself. |
| `glass-island-layout` | 2 | Islands stay inside frame. |
| `glass-masonry-grid` | 2 | Masonry tiles stay inside frame. |
| `glass-music-visualizer` | 2 | Visualizer and labels fit compact frame. |
| `glass-schema-viewer` | 2 | Schema text/code wraps or scrolls intentionally. |
| `glass-smart-shopping-cart` | 2 | Cart rows/actions fit compact frame. |
| `glass-theme-switcher` | 2 | Switcher labels/options fit compact frame. |
| `glass-virtual-table` | 2 | Virtual rows/header fit compact viewport. |
| `collaborative-glass-workspace` | 1 | Workspace layout has compact/sidebar mode. |
| `glass-activity-feed` | 1 | Feed item text and controls fit. |
| `glass-detail-view` | 1 | Detail fields fit compact frame. |
| `glass-form-template` | 1 | Form template fields fit compact frame. |
| `glass-intelligent-form-builder` | 1 | Builder controls fit compact frame. |
| `glass-multi-select` | 1 | Tokens/dropdown fit and wrap cleanly. |
| `glass-reaction-bubbles` | 1 | Reaction bubbles fit compact frame. |
| `glass-scroll-area` | 1 | Scroll viewport and bars fit compact frame. |
| `multi-user-glass-editor` | 1 | Editor/collab controls fit compact frame. |
| `neural-weight-visualization` | 1 | Visualization label/control overlap is fixed. |

**Package source areas:**

- `/Users/gurbakshchahal/AuraGlass/src/components/data-display/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/charts/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/calendar/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/input/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/interactive/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/navigation/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/layout/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/layouts/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/collaboration/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/ecommerce/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/ai/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/media/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/image/**`

**Tests required:**

- For every fixed dense component:
  - default render test
  - compact render test
  - constrained container render test
  - no runtime crash
  - no invalid DOM props
  - snapshot or structural assertion for compact layout

**Website workaround to remove after fix:**

- Remove `CompactPreview` around components whose package compact mode is fixed.
- Replace with real component props:

```tsx
<GlassDataTable compact maxHeight={220} rows={sampleRows} />
```

not:

```tsx
<CompactPreview>
  <GlassDataTable />
</CompactPreview>
```

**Acceptance criteria:**

- Website geometry probe passes without `CompactPreview` hiding real content.
- Website contact sheet shows dense components as intentionally compact, not clipped.
- B19/B23 marked resolved in upstream tracker.

### B20 — `GlassAdvanced` Default Intensity Is Too Sparse

**Severity:** medium-high.

**Problem:**

`GlassAdvanced` default rendering is visually too sparse/weak in catalog previews. The website had to set explicit props and min-height to make it visibly meaningful.

**Why website workaround is not enough:**

Defaults are part of the package product. A component named `GlassAdvanced` should look intentionally advanced with simple usage.

**Package source:**

- `/Users/gurbakshchahal/AuraGlass/src/primitives/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/**GlassAdvanced**`
- `/Users/gurbakshchahal/AuraGlass/src/components/website-components/**` if this wrapper lives there.

**Required package fix:**

- Improve default background, border, highlight, and blur so the component reads as glass in dark mode.
- Ensure valid prop names and defaults are documented.
- Consider a `variant`, `depth`, or `preset="preview"` API if default should remain subtle.
- Ensure default content area has enough visible surface for small demos.

**Tests required:**

- Default render snapshot.
- Dark theme render test.
- Compact/constrained render test.
- Token lint/style lint.

**Website workaround to remove after fix:**

- Remove explicit strong props and min-height from the website preview unless the example is intentionally demonstrating those props.

**Acceptance criteria:**

```tsx
<GlassAdvanced>Advanced glass</GlassAdvanced>
```

renders as a visible, polished glass surface in the website preview.

### B21 — `GlassDiffViewer` Needs Real Semantic Diff Rendering

**Severity:** critical.

**Problem:**

The website replaced `GlassDiffViewer` with a hand-built `<table>` to make the preview visible. That means the website is not proving the package component.

**Why website workaround is unacceptable as final state:**

The catalog must show the real component. A hand-built table is effectively a mock.

**Package source:**

- `/Users/gurbakshchahal/AuraGlass/src/components/data-display/**`
- Search for `GlassDiffViewer`.

**Required package fix:**

`GlassDiffViewer` must render a usable diff itself.

Minimum API:

```ts
interface GlassDiffViewerProps {
  left: string;
  right: string;
  language?: string;
  compact?: boolean;
  maxHeight?: number | string;
  showLineNumbers?: boolean;
  mode?: 'unified' | 'split';
}
```

Minimum rendering behavior:

- Uses semantic `<pre><code>` or table/grid with line-level rows.
- Shows added and removed lines clearly.
- Tokenized colors for add/remove backgrounds and text.
- Long lines wrap or horizontally scroll within component, not outside card.
- Compact mode fits preview cards.
- Empty inputs render a useful empty state.
- Accessible labels distinguish added/removed lines.

**Tests required:**

- Renders additions and removals.
- Renders compact mode.
- Handles long lines without page overflow.
- Handles empty left/right.
- Snapshot for visible diff structure.
- No invalid raw color/token output.

**Website workaround to remove after fix:**

Replace the hand-built table with real component usage:

```tsx
<GlassDiffViewer
  left={'export const greet = () => "hello"\n'}
  right={'export const greet = (name: string) => `hello, ${name}`\n'}
  compact
  maxHeight={200}
/>
```

**Acceptance criteria:**

- Website preview uses `GlassDiffViewer`.
- Empty-preview probe passes.
- Geometry probe passes.
- Contact sheet shows a real diff with green/red lines.

### B22 — `ContrastGuard` Needs Demonstrable Package Behavior

**Severity:** medium.

**Problem:**

`ContrastGuard` does not show a clear visual effect unless the website manually creates a busy/light gradient backdrop.

**Why website workaround is not enough:**

The package should make this component easy to demonstrate and easy for users/agents to understand.

**Package source:**

- `/Users/gurbakshchahal/AuraGlass/src/components/accessibility/**`
- `/Users/gurbakshchahal/AuraGlass/src/utils/contrast**`
- Any `ContrastGuard` implementation file.

**Required package fix options:**

Pick the least gimmicky option:

1. Add a `demoBackdrop` or `sampleBackdrop` prop for docs/previews.
2. Add a documented `debug` or `showOverlay` prop that displays contrast status.
3. Improve examples and default wrapper behavior.
4. Expose a small render-prop state so docs can show computed contrast.

Possible API:

```ts
interface ContrastGuardProps {
  children: React.ReactNode;
  minRatio?: number;
  strategy?: 'auto' | 'light' | 'dark';
  showIndicator?: boolean;
  demoBackdrop?: 'none' | 'busy-light' | 'busy-dark';
}
```

**Tests required:**

- Renders without provider.
- Computes/readjusts contrast for light and dark backdrops.
- `showIndicator` or demo mode renders visible status if added.
- SSR-safe.

**Website workaround to remove after fix:**

- Remove custom hand-staged gradient if package provides demo mode.
- Or keep a normal background composition but no package-defect workaround.

**Acceptance criteria:**

- Website preview demonstrates real `ContrastGuard` behavior without custom fake UI.
- Contrast probe passes.
- Docs can explain usage clearly.

### B24 Candidate — Headless Canvas/WebGL Blank Render Verification

**Severity:** unknown until verified.

**Problem:**

The website exempted 10 canvas/WebGL components from empty-preview detection because headless Chromium rendered blank canvases/SVGs. That may be a legitimate headless limitation, or it may hide real rendering defects.

**Why this cannot be hand-waved:**

AuraGlass has advanced visual components. If those are blank in real browsers, they are serious package bugs. If only headless is blank, the audit exemption is acceptable but must be documented with evidence.

**Components to verify:**

Use the website `HEADLESS_CANVAS_EXEMPT_IDS` list as the source of truth. At plan creation the exact exempt list is:

| # | Website ID | Current probe reason | Required evidence before release |
| ---: | --- | --- | --- |
| 1 | `enhanced-glass-button` | `blank-canvas` in headless Chromium | Real-browser screenshot showing animated/glass button effect is nonblank; no console errors. |
| 2 | `glass-island-layout` | `blank-canvas` in headless Chromium | Real-browser screenshot showing the layout effect canvas is nonblank; no console errors. |
| 3 | `glass-particle-field` | `blank-canvas` in headless Chromium | Real-browser screenshot showing particles render; no per-frame readback stall. |
| 4 | `glass-physics-engine` | `blank-canvas` in headless Chromium | Real-browser screenshot showing physics simulation render; reduced-motion fallback verified. |
| 5 | `glass-deep-dream-glass` | `blank-canvas` in headless Chromium | Real-browser screenshot showing AI/canvas effect render; fallback verified. |
| 6 | `glass-generative-art` | `blank-canvas` in headless Chromium | Real-browser screenshot showing generated art render; no console errors. |
| 7 | `glass-live-filter` | `blank-canvas` in headless Chromium | Real-browser screenshot or documented camera-unavailable fallback; no blank silent failure. |
| 8 | `glass-style-transfer` | `blank-canvas` in headless Chromium | Real-browser screenshot showing style transfer/canvas fallback; no blank silent failure. |
| 9 | `glass-data-chart` | `blank-svg` in headless Chromium | Real-browser screenshot showing non-empty chart with sample data; no empty-state leakage. |
| 10 | `heat-glass` | `blank-svg` in headless Chromium | Real-browser screenshot showing effect SVG/data render; no blank silent failure. |

Known likely source families:

- WebGL shader components.
- Particle field components.
- Mesh gradient components.
- Atmospheric/nebula/aurora components.
- Deep dream / generative / style transfer canvases.
- Liquid/canvas primitives.
- Chart/effect SVG components that require non-empty data.

**Package source areas:**

- `/Users/gurbakshchahal/AuraGlass/src/components/advanced/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/ai/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/atmospheric/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/backgrounds/**`
- `/Users/gurbakshchahal/AuraGlass/src/components/three/**`
- `/Users/gurbakshchahal/AuraGlass/src/three/**`

**Verification required:**

- Open website in normal Chrome/Safari with GPU.
- Capture screenshots for every exempt component.
- Confirm nonblank rendering.
- Confirm no console errors.
- Confirm no frame stalls.
- Confirm reduced-motion mode has safe fallback.

**If real browser is blank:**

Create package bugs for each affected component:

- Missing fallback
- WebGL context failure
- canvas not initialized
- SSR guard issue
- asset loading issue
- resize/layout issue
- performance stall

**If only headless is blank:**

Keep website audit exemption with explicit comment:

- headless-only limitation
- real-browser evidence path
- date verified
- browser version

**Tests required:**

- Unit/structural fallback tests.
- Playwright visual smoke for real browser where feasible.
- Reduced-motion fallback test.

**Acceptance criteria:**

- Every exempt component has evidence proving whether it is headless-only or a real package defect.
- No unverified blank canvas exemption remains.

### B25 Candidate — Website Is Counting Component-Like Runtime Exports, Not Certified Inventory

**Severity:** medium for trust and messaging.

**Problem:**

The website reconciliation found 448 component-like runtime exports, while prior messaging referenced a certified 356-component inventory. The website now has 449 entries and 100.2% coverage, but that number may include providers, primitives, helpers, compound parts, or runtime values that are not user-facing components.

**Why this matters:**

Conflicting counts hurt trust. The website and package need a shared taxonomy:

- Component
- Primitive
- Provider
- Hook
- Utility
- Type
- Compound child
- Recipe
- Example
- Experimental
- Internal

**Package fix needed:**

Create an authoritative package inventory manifest.

Possible file:

- `/Users/gurbakshchahal/AuraGlass/src/reports/componentInventory.ts`
- `/Users/gurbakshchahal/AuraGlass/reports/component-inventory.manifest.json`
- generated `dist/reports/componentInventory.*`

Required fields:

```ts
interface AuraGlassInventoryItem {
  id: string;
  exportName: string;
  sourceFile: string;
  category: string;
  kind: 'component' | 'primitive' | 'provider' | 'hook' | 'utility' | 'type' | 'compound-child' | 'recipe' | 'example' | 'internal';
  status: 'flagship' | 'production' | 'advanced' | 'experimental' | 'internal';
  renderableInCatalog: boolean;
  requiresProvider?: string;
  requiresParent?: string;
  optionalPeers?: string[];
}
```

**Tests required:**

- Inventory manifest validates.
- Every public export is classified.
- Website reconciliation can consume the manifest.
- README/docs component counts use the manifest, not regex heuristics.

**Acceptance criteria:**

- 356 vs 448 vs 449 ambiguity is resolved.
- Website and package use the same inventory language.

### B26 — Repository Ownership / npm Metadata Migration

**Severity:** release-blocking metadata issue.

**Problem:**

The AuraGlass GitHub repository has moved to the Aura One AI organization:

- New canonical repo: `https://github.com/auraoneai/auraglass`
- Legacy owner-owned metadata references existed in package/docs before this pass and must not remain in public package metadata or published documentation.

**Why this matters:**

The npm package page, README badges, issue links, generated docs, and release instructions are part of the public API surface. They must route users and AI coding agents to the correct canonical repository before 3.0.6 is published.

**Required package metadata updates:**

- `package.json.repository.url` must be `git+https://github.com/auraoneai/auraglass.git`.
- `package.json.bugs.url` must be `https://github.com/auraoneai/auraglass/issues`.
- Local `origin` remote should be updated to `https://github.com/auraoneai/auraglass.git` before push.
- `package.json.homepage` must remain the product website if still canonical, or be updated only if the website has moved.
- `README.md` badges and GitHub links must point to `auraoneai/auraglass`.
- `CHANGELOG.md` support links must point to `auraoneai/auraglass`.
- Any docs under `docs/`, `.github/`, `reports/`, and npm-published files must not point to old owner-owned repository paths.
- Release notes must mention the organization transfer as a metadata-only change.

**Search commands:**

```bash
rg -n "VeerOneGPT|gurbakshchahal/AuraGlass|github.com/.*/auraglass|repository|bugs|homepage" package.json README.md CHANGELOG.md docs .github reports
```

**Acceptance criteria:**

- `npm view aura-glass repository bugs homepage` after publish points to the organization repo.
- `npm pack --dry-run --json` includes updated README/package metadata.
- A repository-link audit returns no public docs/package metadata hits for the legacy owner-owned AuraGlass repository URLs.
- Any local filesystem references in internal reports remain clearly local-only and are not presented as public repo URLs.

## Implementation Phases

### Phase 0 — Lock Evidence

- [ ] Read website `SUMMARY.md`.
- [ ] Read website `inventory-reconciliation.json`.
- [ ] Read website `empty-previews.json`.
- [ ] Read website `geometry.json`.
- [ ] Read website `visual-density.json`.
- [ ] Read website `contact-sheet-summary.json`.
- [ ] Read `AURAGLASS-UPSTREAM-BUGS.md` B18-B23/B24.
- [ ] Verify the exact 43 `CompactPreview` component IDs in this file still match website B23.
- [ ] Verify the current 85 geometry findings in this file still match the latest `geometry.json`.
- [ ] Verify the 10 headless canvas/SVG exempt IDs in this file still match `HEADLESS_CANVAS_EXEMPT_IDS`.
- [ ] Confirm which website workarounds are currently present.

Output:

- `/Users/gurbakshchahal/AuraGlass/reports/3.0.6-upstream/SUMMARY.md`
- `/Users/gurbakshchahal/AuraGlass/reports/3.0.6-upstream/workaround-map.json`

### Phase 1 — Package Audit Before Editing

- [ ] Locate source files for B18.
- [ ] Locate source files for B19/B23 affected dense components.
- [ ] Locate source file for `GlassAdvanced`.
- [ ] Locate source file for `GlassDiffViewer`.
- [ ] Locate source file for `ContrastGuard`.
- [ ] Locate source files for headless canvas/WebGL exempt components.
- [ ] Identify existing compact/contained API patterns from 3.0.5 work.
- [ ] Identify tests for each component.
- [ ] Identify missing tests.

Output:

- `/Users/gurbakshchahal/AuraGlass/reports/3.0.6-upstream/source-map.md`

### Phase 2 — Fix B21 First: `GlassDiffViewer`

Why first:

- It is the clearest unacceptable website mock.
- It proves whether the package can replace hand-built preview content.

Tasks:

- [ ] Implement real diff rendering.
- [ ] Add compact mode.
- [ ] Add line wrapping/scroll containment.
- [ ] Add tokenized add/remove colors.
- [ ] Add accessibility labels.
- [ ] Add tests.
- [ ] Update snapshots.
- [ ] Replace website hand-built table with real component.
- [ ] Re-run website empty/geometry probes for `glass-diff-viewer`.

Done when:

- Website no longer hand-builds diff UI.
- `GlassDiffViewer` preview passes probes.

### Phase 3 — Fix B20: `GlassAdvanced`

Tasks:

- [ ] Improve default visual strength.
- [ ] Confirm prop names are valid and documented.
- [ ] Add compact/preview mode if needed.
- [ ] Add dark theme test.
- [ ] Add constrained preview test.
- [ ] Remove explicit website workaround props if no longer needed.

Done when:

- Default `GlassAdvanced` looks intentional in website preview.

### Phase 4 — Fix B22: `ContrastGuard`

Tasks:

- [ ] Decide API: `showIndicator`, `demoBackdrop`, render-prop, or docs-only composition.
- [ ] Implement minimal package behavior.
- [ ] Add tests for light/dark/busy backdrops.
- [ ] Add SSR-safe behavior.
- [ ] Update website preview to use package API.

Done when:

- Website preview demonstrates real package behavior without fake-only staging.

### Phase 5 — Fix B18: Overlay/Menu Containment

Tasks:

- [ ] Define common overlay containment prop names.
- [ ] Implement for dropdown/menu/select/context/menubar/popover families.
- [ ] Add SSR-safe portal container handling.
- [ ] Add tests.
- [ ] Update website previews to use real contained mode.

Done when:

- No overlay/menu content escapes card previews.

### Phase 6 — Fix B19/B23: Dense Component Compact Modes

Tasks:

- [ ] Use the exact 43 component IDs already embedded in this file from website B23.
- [ ] Prioritize the 33 IDs with 85 current geometry failures.
- [ ] Keep the other 10 B23 IDs in the audit queue even if current geometry is green, because website staging may be masking them.
- [ ] Group by family.
- [ ] Implement compact/contained/preview props family by family.
- [ ] Add tests per component or per shared family behavior.
- [ ] Update snapshots.
- [ ] Remove website `CompactPreview` wrappers family by family.
- [ ] Re-run website geometry probe after each family.

Suggested order:

1. Data tables/grids/virtual tables.
2. Calendar/heatmap/gantt/timeline/chart visualizations.
3. Code/diff/search/query/gradient builder components.
4. Navigation/menu/dropdown/select components.
5. Layout/app-shell/sidebar/dashboard components.
6. AI/media/collaboration/ecommerce dense surfaces.

Done when:

- Website geometry probe passes without `CompactPreview` hiding real content.

### Phase 7 — Verify B24: Canvas/WebGL

Tasks:

- [ ] Extract `HEADLESS_CANVAS_EXEMPT_IDS`.
- [ ] Open real browser screenshots.
- [ ] Confirm each is nonblank or create package bug.
- [ ] Add fallback/static rendering for blank components.
- [ ] Add reduced-motion fallback where missing.
- [ ] Add evidence path to website summary.

Done when:

- No unverified blank canvas exemption remains.

### Phase 8 — Resolve Inventory Taxonomy B25

Tasks:

- [ ] Decide whether B25 is in scope for 3.0.6 or 3.1.
- [ ] If in 3.0.6, create manifest.
- [ ] Classify public exports.
- [ ] Update website inventory script to consume manifest.
- [ ] Update README/docs count language.

Done when:

- Counts no longer conflict.

### Phase 9 — Update Repository Ownership Metadata B26

Current package-side status for this sweep:

- [x] `package.json` repository is `git+https://github.com/auraoneai/auraglass.git`.
- [x] `package.json` bugs URL is `https://github.com/auraoneai/auraglass/issues`.
- [x] Local `origin` remote is `https://github.com/auraoneai/auraglass.git`.
- [x] `README.md` and `CHANGELOG.md` public GitHub links point to `auraoneai/auraglass`.
- [x] Repository-link audit excluding `node_modules`, `dist`, `coverage`, and source-map files found no legacy AuraGlass GitHub owner URLs. The only non-organization GitHub URL outside lockfile dependency sponsor metadata is the unrelated example repo link `https://github.com/VeerOneGPT/consciousness-examples`.
- [x] `npm pack --dry-run --json` includes the updated README and package metadata for `aura-glass@3.0.6`.

Tasks:

- [x] Update `package.json` repository and bugs fields to `auraoneai/auraglass`.
- [x] Audit README badges/links for GitHub owner references.
- [x] Audit CHANGELOG support/issue links for GitHub owner references.
- [x] Audit docs and npm-published files for old GitHub owner links.
- [x] Keep product homepage only if it remains canonical.
- [x] Add a 3.0.6 changelog bullet noting the organization transfer.
- [x] Verify `npm pack --dry-run --json` includes the updated metadata.

Done when:

- Public npm/GitHub docs use `https://github.com/auraoneai/auraglass`.
- No old owner repo URLs remain in public-facing package docs.

## Test Plan

### Package Commands

Run from `/Users/gurbakshchahal/AuraGlass`:

```bash
npm run lint:check
npm run lint:tokens
npm run lint:styles
npm run glass:full-check
npm run test:coverage
npm run verify:pack
npm run release:dry-run
```

Expected:

- 0 errors.
- Warning-only debt documented.
- React 18 Next smoke passes.
- React 19 Next smoke passes.
- Pack verification passes.
- No bundled React runtime.

### Focused Regression Tests To Add

- `GlassDiffViewer` renders additions/deletions semantically.
- `GlassDiffViewer` compact mode fits constrained container.
- `GlassAdvanced` default dark render has visible glass surface.
- `ContrastGuard` demo/indicator/render behavior works.
- Overlay contained mode does not portal to body.
- Dense components compact mode renders without visible overflow.
- Canvas/WebGL fallback renders nonblank static fallback when WebGL unavailable.
- Inventory manifest, if created, validates public exports.

### Website Verification After Package Fixes

Run from `/Users/gurbakshchahal/auraglasswebsite` after installing/packing local package:

```bash
npm install /Users/gurbakshchahal/AuraGlass/aura-glass-3.0.6.tgz --legacy-peer-deps --no-audit --no-fund
npm run typecheck
scripts/audit/run.sh
```

Or use the repo's established local pack flow if different.

Expected website outputs:

- `reports/website-3.0.6-catalog/inventory-reconciliation.json`
- `reports/website-3.0.6-catalog/runtime.json`
- `reports/website-3.0.6-catalog/contrast.json`
- `reports/website-3.0.6-catalog/geometry.json`
- `reports/website-3.0.6-catalog/empty-previews.json`
- `reports/website-3.0.6-catalog/visual-density.json`
- `reports/website-3.0.6-catalog/contact-sheet.png`
- `reports/website-3.0.6-catalog/SUMMARY.md`

Expected website state:

- No hand-built `GlassDiffViewer`.
- No `CompactPreview` wrappers for fixed components.
- No undocumented headless canvas exemptions.
- No unresolved PreviewBoundary catches.
- No console/page errors.
- No provider crashes.
- No text-only visual previews.
- No geometry failures for fixed compact components.

## Website Workaround Removal Checklist

For each fixed upstream bug:

- [ ] Find website workaround.
- [ ] Replace workaround with real package component/API.
- [ ] Add comment only if workaround remains intentionally.
- [ ] Re-run focused probe.
- [ ] Re-run full 13-step gate.
- [ ] Mark bug resolved in `AURAGLASS-UPSTREAM-BUGS.md`.
- [ ] Link package commit/version.
- [ ] Update website `SUMMARY.md`.

### Specific Removal Targets

- [ ] Remove hand-built diff table in `dataDisplay.tsx`; restore `GlassDiffViewer`.
- [ ] Remove custom `ContrastGuard` fake/demo backdrop if package demo behavior replaces it.
- [ ] Remove explicit `GlassAdvanced` prop inflation if defaults are fixed.
- [ ] Remove `CompactPreview` wrappers for all B23 fixed components.
- [ ] Keep only legitimate headless canvas exemptions with real-browser evidence.
- [ ] Remove dropdown/menu stills if contained overlay mode works.

## Changelog Requirements

Update `/Users/gurbakshchahal/AuraGlass/CHANGELOG.md` with:

- B18 fixed: overlay/menu containment API.
- B19/B23 fixed: compact/contained modes for dense components.
- B20 fixed: `GlassAdvanced` default visual strength.
- B21 fixed: `GlassDiffViewer` semantic diff rendering.
- B22 fixed: `ContrastGuard` demonstrable behavior.
- B24 verified: canvas/WebGL real-browser evidence or fixed fallbacks.
- B25 taxonomy status if included.
- Package gates run.
- Website gate run against packed 3.0.6.
- Any remaining known risks.

## README Requirements

Update `/Users/gurbakshchahal/AuraGlass/README.md` only after package fixes land:

- Mention compact/contained component support.
- Mention semantic `GlassDiffViewer`.
- Mention overlay containment where relevant.
- Mention accessibility/contrast guard behavior.
- Do not overclaim that every component is perfect unless website gate proves it.

## Publishing Checklist

Only publish after package and website gates pass.

- [x] `package.json` version is `3.0.6`.
- [x] `package-lock.json` version is `3.0.6`.
- [x] CHANGELOG updated.
- [x] README updated.
- [x] Package build complete.
- [x] `npm run release:dry-run` passes.
- [ ] Website packed-package gate passes.
- [x] Git status reviewed.
- [ ] Commit created: `Release aura-glass 3.0.6`.
- [ ] npm publish completed.
- [ ] `npm view aura-glass version dist-tags --json` shows latest `3.0.6`.
- [ ] GitHub push completed.
- [ ] Git tag `v3.0.6` created if release process requires it.

## Final Definition Of Done

AuraGlass 3.0.6 is done when:

- The website no longer needs to fake `GlassDiffViewer`.
- The website no longer needs `CompactPreview` to hide dense component overflow for fixed components.
- `GlassAdvanced` defaults are visually credible.
- `ContrastGuard` can be demonstrated using package-owned behavior.
- Dropdown/menu overlays support contained rendering.
- Canvas/WebGL blank states are either fixed or proven headless-only with evidence.
- The website 13-step gate passes against the real `aura-glass@3.0.6` package.
- All resolved upstream bugs are marked resolved in `AURAGLASS-UPSTREAM-BUGS.md`.
- npm and GitHub both reflect `3.0.6`.

## Immediate Next Commands

Start by collecting exact evidence from the website:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
node -e "const fs=require('fs'); const p='reports/website-3.0.6-catalog/geometry.json'; if(fs.existsSync(p)) { const j=require('./'+p); const by={}; for (const f of j.findings || []) by[f.componentId]=(by[f.componentId]||0)+1; console.log(Object.entries(by).sort((a,b)=>b[1]-a[1])); }"
rg -n "CompactPreview|HEADLESS_CANVAS_EXEMPT|GlassDiffViewer|ContrastGuard|GlassAdvanced" components scripts reports
```

Then fix package source:

```bash
cd /Users/gurbakshchahal/AuraGlass
rg -n "GlassDiffViewer|ContrastGuard|GlassAdvanced|DropdownMenu|ContextMenu|Menubar|Select|portal|createPortal|requestAnimationFrame|readPixels|getImageData" src
```

Do not begin publishing until the package fixes have replaced the website workarounds and the website gate passes.
