# AuraGlass 5.0 Autopsy: Visual Quality (Visual Director Review)

Scope: all 712 certification screenshots in `reports/glassmorphism-storybook-visual-certification/screenshots` (356 targets at desktop 1440x900 and mobile 390x844). Also the 16 frames in `reports/strict-mobile-component-defects` and the 38 in `reports/worker-d-screens`. The 89 contact sheets in `reports/component-screenshot-manual-qa` were included in the first pass. That is 766 primary frames, well above the 90-sample floor.

Score: 3/10 for current visual state against the bar "premium first-party design-system screenshot".

## Method and limits (read first)

The image viewer in this session returned no pixel content for any PNG. So nothing below rests on eyeballing. Every judgement comes from pixel measurement of the PNGs, cross-checked against source:

- OpenCV and NumPy measurements:
  - per-row background subtraction (the canvas is a vertical gradient)
  - content bounding box
  - surface-fill delta from the canvas
  - saturation and neon fraction
  - near-duplicate diffing
  - WCAG luminance contrast inside each target's own content box
- Tesseract OCR at 2x upscale. This gives word count, word height and per-word contrast, and recovers the copy shown in each frame.

The scripts were throwaway, live outside the repo, and are not committed.

What this method cannot judge: the subtle quality of the specular edge, refraction, and how well small elements are aligned. Those still need a human pass on a real display. What it can prove is everything below.

## Executive verdict

The library does not photograph as a premium material system. It photographs as a grayscale wireframe kit floating in a white void. There is no glass-soup or neon problem in the current build; the dominant failure is the opposite. The project overcorrected from loud cobalt and neon (still visible in `strict-mobile-component-defects`) into a material that has nothing to refract, nothing to separate it from the page, and no color or hierarchy.

## Systemic findings (all measured)

1. **Glass is shown on a near-white canvas, so there is nothing for backdrop-filter to act on.**
   - The default preview mode is `light` (`.storybook/preview.tsx:76-77`).
   - It paints `linear-gradient(#ffffff → #f4f4f4 → #e9e9e9)` (`.storybook/StorySurface.tsx:14-17`). The "liquid" mode is the same gray (`StorySurface.tsx:24-27`).
   - 351/356 desktop frames have a canvas mean luminance above 0.6. The median canvas color is rgb(245,245,245).
   - Result: blur at 16-48px (`src/styles/tokens.css:40-45`) blurs a flat gray field. It is visually a no-op.

2. **The surface fill is white-on-white and nearly invisible.**
   - Semantic glass is `rgba(white / 0.25)` (`src/styles/tokens.css:266`). The CSS contract keeps "neutral white fill alpha inside [0.08, 0.35]" (`src/styles/glass.css:1213-1215`).
   - The evidence gate enforces a translucent white-frost alpha of 0.015-0.35 and fails any opaque dark/navy surface (`scripts/audit/verify-visual-evidence.js:334, 371-372`).
   - `scripts/audit/story-presentation-audit.js:4-6` blocks "chromatic, navy" framing.
   - Measured: the median surface-to-canvas difference is 23 RGB-sum units, about 3% luminance. 278/353 rendered desktop frames have surfaces that are *lighter* than the canvas, not darker. Edges come from a hairline border and a soft shadow only.
   - The governance itself mandates the "gray translucent rectangle" look.

3. **The library is achromatic.**
   - 266/353 desktop frames have content saturation (p90) below 3/255, which is pure grayscale. Only 61 show any meaningful color.
   - Semantic color was deleted from primitives. Every `GlassBadge` variant (primary, success, warning, error, info) maps to the same `glass-border glass-border-black/10|12` (`src/components/data-display/GlassBadge.tsx:133-143`).
   - Charts are gray: GlassDataChart sat90=0, GlassLineChart sat90=1, GlassAdvancedDataViz sat90=0, GlassGanttChart sat90=0. A "Revenue vs Target" series pair split only by gray value is not a premium chart.

4. **Components are tiny inside empty frames.**
   - The median desktop content box covers 14.5% of the frame. 88/353 frames use under 6%, and 178/353 use under 15%.
   - GlassButton's default story is one 109x55 px control in a 1440x900 frame (0.5%).
   - 297/353 desktop frames contain exactly one surface region. The grammar is "single centered card in a void", not composed scenes.

5. **There are invisible and blank renders that certification marked "passed".**
   - 3 targets are fully blank at both viewports: GlassNeuroSync, Typography, ThemedGlassComponents.
   - 16 targets never exceed about 2:1 luminance contrast anywhere in their content box (worst-25 list below).
   - Certification "pass" means only that the DOM contains a glass-class/svg/canvas node and is non-empty (`scripts/audit/storybook-visual-certification.mjs:296-315`). GlassNeuroSync passed with 70 "glass elements" and a blank frame.
   - The report labels every target `themesInspected: ["storybook-default-dark"]` (`storybook-visual-certification.mjs:344`). The page actually renders the light preview. Only the browser `colorScheme` is dark (`:232`).

6. **"Effects" do not render, so different components photograph the same.**
   - Near-duplicate diffing (share of differing content pixels):

     | Pair | Differing content pixels |
     |---|---|
     | AuroraPro vs GlassShatterEffects | 3.9% |
     | AuroraPro vs SeasonalParticles | 5.2% |
     | AuroraPro vs OrganicAnimationEngine | 6.7% |
     | SpatialComputingEngine vs GlassDepthLayer | 3.8% |
     | GoldenRatioGrid vs Tessellation | 2.0% |
     | FrostedGlass vs DimensionalGlass | 0.79% of all pixels |
     | GlassCanvas vs GlassDragDropProvider | byte-identical |

   - Root cause for AuroraPro: the component renders a plain `<div>` fallback unless React 19 is present (`src/components/effects/AuroraPro.tsx:20-56`). Storybook runs React 18.2.0 (`package.json:471`). The "Aurora" story is a gray card with the text "Atmospheric effect" (`src/components/effects/AuroraPro.stories.tsx:41-56`).
   - Material variants (frosted, dimensional, depth, heat) are visually indistinguishable.

7. **Copy reads as QA notes, not product.**
   - 61/356 desktop frames contain harness or placeholder copy. Examples:
     - "keeps the overlay from feeling like a blank page" (GlassDialog)
     - "offset from the trigger so it is readable and not clipped by the story frame" (GlassSelectCompound)
     - "Drop glass assets here for certification" (GlassFileUpload)
     - "Component-owned story coverage sample." (GlassErrorBoundary)
     - "This is the default chartcontainer component." (ChartContainer)
   - Other copy is self-referential, such as "Stable preview dimensions keep the particle canvas visible" (GlassParticles).
   - Website stories ship competitor marketing ("AuraOne vs Scale AI", GlassWipeSliderExamples).
   - First-party screenshots never narrate their own test harness.

8. **Typography has no hierarchy.**
   - The median OCR word height is 11 px at both viewports. The body is forced to 14px/1.6 (`.storybook/preview.tsx:53-58`).
   - 16 mobile targets have p10 word heights of 6-7.8 px: GlassMetricsGrid, GlassAdvancedVideoPlayer, MetricWidget, the area and line charts, and others.
   - Most frames are a single type size plus an uppercase eyebrow. The "EYEBROW / H2 / sentence" template repeats across the advanced, effects and surfaces stories.

9. **Radius and depth are consistent in tokens but bubbly in use.**
   - Tokens are sane: 6/10/16/24/32/40 px (`src/styles/tokens.css:57-64`).
   - Use skews to pill and large: `glass-radius-full` 548 uses, `-lg` (24px) 534, `-md` 393 across `src/**/*.tsx`.
   - Rendered panel radius estimates cluster at 28-56 px, wide for dense UI.
   - The shadow ladder tops out at 0.24 alpha (`tokens.css:67-72`). That is the only depth cue on a flat canvas, so depth reads as "card shadow", not "material thickness".

10. **Mobile overflow is masked, not proven.**
    - StorySurface sets `overflowX: hidden` (`.storybook/StorySurface.tsx:103`). Horizontal overflow is clipped silently.
    - No frame showed right-edge bleed, but that is partly by construction.

## Ancillary evidence directories

- **`reports/worker-d-screens`**
  - The six `*-final.png` "after fix" frames for six different components (GlassBottomNav, GlassNavigationMenu, GlassPagination, GlassResponsiveNav ×2, HeaderUserMenu) are byte-identical (md5 `bd967b9b…`). OCR shows they are all the Storybook error page: "Error fetching index.json … The component failed to render properly".
  - Several `*-after.png` light frames are blank white (content box 0.4%), and 3 are fully empty.
  - The dark variants render on mid-gray rgb(135,139,147) with 0 OCR-legible words.
  - This directory documents failed fixes, not certified ones.
- **`reports/strict-mobile-component-defects`**
  - palette, quantum and trophy are on cobalt rgb(21-24,75-83,138-168), with 22-69% of pixels neon-saturated.
  - Quantum: 100% of OCR words fall below 4.5:1. Trophy desktop: 56% fall below 4.5:1.
  - This is the opposite failure (neon, low contrast). It explains why the project then bleached the system.
  - `enhancement-showcase` (pastel blue canvas, 58 legible words, 0% low-contrast words) is the one frame in the evidence set with both color and readability.

## 25 best targets (relative; none reaches the bar)

"bb" = content-box share of frame (desktop/mobile). All 25 have 0% of OCR words below 4.5:1 unless noted.

1. modal-glassmodal: bb 93%/93%, 36 words, 3 layered surfaces over an app backdrop. The best depth story in the library.
2. layout-glassappshell: real app shell, 38 words, coherent navigation and content split. Achromatic.
3. layout-zspaceapplayout: 55 words, two planes, a believable command-center layout.
4. search-glassspotlightsearch: 58 words, the most visible surface (fill Δ41), grouped results. Harness word "inspect" in copy.
5. interactive-glasscommandpalette: 34 words, clear grouping and shortcut hierarchy, full-frame overlay.
6. modal-glassdrawer: 4 surfaces on mobile, a real checklist, good density.
7. card-patterns: 122 words, real dashboard/review/account cards that fill the frame. Copy mentions "Storybook".
8. mobile-glasspulltorefresh: 28 words, a believable daily-briefing schedule, 84% frame use.
9. templates-dashboard-glassdashboard: 48 words, KPI, chart and orders composition. Gray chart.
10. surfaces-pageglasscontainer: 25 words, account table with hierarchy, 59% frame use.
11. ecommerce-glassproductrecommendations: 51 words, priced product rows, good rhythm.
12. input-glasstransferlist: 47 words, dual list with search, 93% frame use on mobile.
13. feedback-glasstoast: 59 words, semantic color present (sat90 38). One of few frames with purposeful color.
14. input-glassinput: 3 distinct fields, helper text and a validation state, all legible.
15. input-glasscheckboxgroup: 44 words, real settings semantics.
16. editor-glassrichtexteditor: toolbar plus editorial copy, a calm, believable editor.
17. media-glassmediaprovider: 27 words, status grid, restrained tint (sat90 10).
18. data-display-glasskanbanboard: 71 words, three lanes with counts. Copy references "Storybook presentation fixes".
19. interactive-glasscoachmarks: overlay on real UI, 87% frame use. Glass fill is faint (Δ9).
20. mobile-glassactionsheet: editorial backdrop behind the sheet, the right way to show glass (sat90 10).
21. modal-glassdialog: 37 words, footer actions, 3 surfaces. Copy narrates the "Storybook wrapper".
22. navigation-glasssidebar: app content beside the rail, 61% frame use.
23. ai-glassmusicvisualizer: controlled color accent (sat90 32) without neon.
24. social-glassvoicewaveform: participants plus waveform, 72% frame use on mobile.
25. interactive-glassspotlight: a single focused surface with readable copy and a visible fill (Δ27).

Notable non-entries: AuroraPro, GlassShatterEffects, SeasonalParticles, OrganicAnimationEngine and SpatialComputingEngine score well on raw metrics. They are excluded because they are the same fallback card (finding 6). demo-enhancementshowcase also scores well on metrics but sells "consciousness interface technology".

## 25 worst targets

1. advanced-glassneurosync: blank at both viewports. Passed certification with 70 glass DOM nodes.
2. data-display-typography: blank. The Default story has empty `args: {}` (`src/components/data-display/Typography.stories.tsx:31-35`).
3. interactive-themedglasscomponents: blank at both viewports.
4. website-glasswipeslider: content max contrast 1.09:1, 0.1% of frame. Nothing visible.
5. icons-clearicon: max contrast 1.10:1, 0% of frame.
6. data-display-glassbadge: badge label sits in a 235-252 gray band (about 1.2:1). OCR finds "Badge" only after contrast stretching, and all variants are identical (`GlassBadge.tsx:133-143`).
7. data-display-glassavatar: a 79 px avatar at about 1.25:1 (desktop), 0.5% of frame.
8. interactive-glasspresets: a 70 px square, 1.24:1. Reads as an empty tile.
9. interactive-contextawareglass: an 80 px square, 1.23:1, no legible content.
10. glasserrorboundary: 1.36:1, and the copy is "Component-owned story coverage sample."
11. charts-chartaxis: an axis occupying 0.1% of the frame, no labels.
12. button-glassbutton: the flagship primitive is a lone 109x55 "Click Me" in a 1440x900 void.
13. card-div: "Glass div" at 4.2:1, 1% of frame.
14. toggle-button-togglebutton: "Like" at 1.84:1. The selected/unselected state cannot be read.
15. social-glasspresenceindicator: 1.41:1 everywhere, presence dots invisible.
16. social-glassreactionbubbles: 1.44:1, no legible reactions.
17. surfaces-heatglass: 1.40:1. A "heat" material with no visible heat, tint or text.
18. data-display-glasssparkline: 1.9:1, the sparkline is barely there.
19. charts-chartrenderer: 1.5:1, only stray axis digits legible.
20. advanced-glassfoldablesupport: 1.9:1 across 74-93% of the frame, no legible text. A gray slab.
21. interactive-pagetransitiondemo: 1.4-1.5:1, no legible content.
22. navigation-glasstabitem: 1% of frame, surface Δ12 (invisible pill).
23. input-glassstepicon: 1.52:1 crop, step icons unreadable.
24. effects-aurorapro: renders the React-18 fallback card. Same image as GlassShatterEffects (3.9% diff) and SeasonalParticles. The effect is never shown.
25. input-glasstreeselect: 1.4% of frame, about 2 OCR words. A tree select with no visible tree.

Also failing badly: GlassStatusDot, GlassMetricChip and GlassInlineEdit (each under 2% of frame). GlassLoadingSkeleton is 1.26:1. GlassImageViewer has neon (4.8% saturated pixels) on the "Sample Image" placeholder.

## What a premium screenshot needs

1. **A real backdrop.**
   - Every surface story sits on authored, high-frequency imagery or an app scene: photography, a document, a map, a dashboard. That gives blur and refraction something to act on.
   - Replace the `#fff→#e9e9e9` default in `StorySurface.tsx:14-27`.
   - Show light and dark side by side.
2. **A surface that separates.**
   - On light content, use a tinted/darkened fill or `saturate()` lift, an inner specular edge, and a two-layer shadow (contact plus ambient).
   - Relax the white-only alpha gate (`verify-visual-evidence.js:334`) to a contrast-against-backdrop rule.
3. **Color with intent.**
   - Restore semantic hues for status (badge, toast, alert, status dot).
   - Restore a categorical chart palette.
   - Add one restrained brand accent for primary actions.
   - Ban neon by measured saturation, not by banning color.
4. **Composed scenes, not specimens.**
   - Every primitive story becomes a dense, framed composition (40-70% of frame) showing states together: default, hover, selected, disabled, error.
   - Button, badge, avatar, tabs and toggle need state matrices.
5. **Type scale.**
   - At least 4 sizes with clear weight contrast in each frame.
   - No rendered text below 11 px on mobile.
6. **Product copy only.**
   - Delete all harness narration ("Storybook", "certification", "inspect", "not clipped", "This is the default …").
   - Delete competitor marketing from the library.
7. **Effects must actually render, or be removed from the visual inventory.**
   - Add a visual-diff gate that fails when two different components differ by under 10% of content pixels.
   - Add a minimum-contrast gate: max content contrast of at least 4.5:1, and at least 3% of frame used.
   - Add a "blank frame" gate on pixels rather than DOM nodes.
8. **Fewer glass surfaces.**
   - Reserve glass for floating chrome (nav, sheets, popovers, toolbars). Content cards should be solid or near-solid.
   - That makes the glass read as glass by contrast.
