/* REQ-QUAL-32 (QUAL, FIN-434) — the ported 4.x measurement layer.

   Kept, not rebuilt (PRD-QUAL §2 "Kept"): the token-purity measurement layer of
   v4.1.0 tests/visual/design-system/token-purity-layout-audit.spec.ts:852-2232 (on `next` it lived at
   legacy/tests/visual/design-system/… until FIN-C removes legacy/**), plus the two pure judges its 10 detector fixtures
   call (`checkTokenInvariants` :2995-3244 and its helpers). The files under this directory are verbatim copies of
   those line ranges, read from the tag and never imported from legacy/**.

   Scope: these detectors understand the 4.x DOM (glass-* surface classes, #storybook-root, the 4.x Storybook chrome).
   They are what `certification/lanes/known-failures.spec.ts` runs against the v4.1.0 Storybook next to the 5.x L6
   gates, and what `packages/qa/test/inspect.fixtures.test.ts` proves on the 10 ported fixtures
   (packages/qa/fixtures/inspect/). The 5.x adaptation of `collectLayoutIssues` (data-ag-surface, story-root scoped)
   is `../layout.ts` (G-13, REQ-QUAL-15/-18). Browser-only: every collector runs inside `page.evaluate`. */
export type { SurfaceInspection, TextInspection, PaintInspection, LayoutIssue, PresentationIssue, ViewportColorCensus } from './types';
export {
  parseRgba, parseHex, normalizeAlpha, parseColor, extractColorAlphas, isDarkChannel, parseBlurPx, parseFilterComponent,
  isWhiteNeutral, isPermittedScrim, splitCssList,
} from './color';
export { inspectSurface, collectLayoutIssues, collectTextInspections, collectPaintInspections, collectPresentationIssues } from './collectors';
export { inspectViewportColorCensus, checkViewportColorCensus } from './census';
export {
  semanticVisualizationTargetIds, isSemanticVisualizationPixelFinding, isOpaqueDarkFill, checkFilterChain, checkTokenInvariants,
} from './tokenInvariants';
