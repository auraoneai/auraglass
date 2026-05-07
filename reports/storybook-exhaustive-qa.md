# Storybook Exhaustive QA

Generated: 2026-05-07T16:41:37.239Z
Storybook: http://127.0.0.1:6016
Public stories inspected: 1595
High-risk mobile stories inspected: 1595
Checks: desktop-liquid, desktop-dark, mobile-liquid

## Summary

- Pass: 1205
- Risk: 205
- Fail: 185
- Total audit findings: 896
- Audit-run errors, excluded from ranking: 0
- False-positive/noise events: 71
- Affected files/groups: 90
- Hard-failure stories: 0

Hard-failure flags are Storybook render errors, page errors, severe console errors, remote media failures, missing story roots, visible native controls, and invalid SVG/runtime values such as `NaN`, `Infinity`, or `undefined`. The remaining `risk` and `fail` rows below are visual heuristics retained as follow-up evidence.

## Flag Counts

| Flag | Count |
| --- | ---: |
| low-contrast | 494 |
| clipped-child | 230 |
| excessive-vertical-overflow | 62 |
| control-overlap | 56 |
| dark-text-on-dark | 54 |

## Top Ranked Failures

| Score | Status | Prefix | Story | File | Flags |
| ---: | --- | --- | --- | --- | --- |
| 468 | fail | Workflows | Workflows/Glass Query Builder / Complex Query | src/components/interactive/GlassQueryBuilder.stories.tsx | clipped-child, low-contrast, dark-text-on-dark |
| 378 | fail | Workflows | Workflows/Glass Query Builder / Default | src/components/interactive/GlassQueryBuilder.stories.tsx | clipped-child, low-contrast, dark-text-on-dark |
| 351 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Performance Test | src/components/layouts/GlassIslandLayout.stories.tsx | control-overlap, clipped-child |
| 342 | fail | Effects + Advanced | Effects + Advanced/Glass Filter Panel / Default | src/components/interactive/GlassFilterPanel.stories.tsx | control-overlap, low-contrast, dark-text-on-dark |
| 338 | fail | Workflows | Workflows/Glass Component Playground / Variants | src/components/interactive/GlassComponentPlayground.stories.tsx | clipped-child, low-contrast, control-overlap |
| 335 | fail | Workflows | Workflows/Glass Component Playground / Default | src/components/interactive/GlassComponentPlayground.stories.tsx | clipped-child, low-contrast, control-overlap |
| 312 | fail | Effects + Advanced | Effects + Advanced/Glass Reaction Bar / Popular Reactions | src/components/interactive/GlassReactionBar.stories.tsx | low-contrast, dark-text-on-dark |
| 279 | fail | Workflows | Workflows/Glass Mind Map / Default | src/components/interactive/GlassMindMap.stories.tsx | clipped-child |
| 273 | fail | Effects + Advanced | Effects + Advanced/Glass Superpositional Menu / Complex System | src/components/quantum/GlassSuperpositionalMenu.stories.tsx | clipped-child, low-contrast |
| 273 | fail | Effects + Advanced | Effects + Advanced/Glass Superpositional Menu / Entangled System | src/components/quantum/GlassSuperpositionalMenu.stories.tsx | clipped-child, low-contrast |
| 273 | fail | Effects + Advanced | Effects + Advanced/Glass Superpositional Menu / Strong Entanglement | src/components/quantum/GlassSuperpositionalMenu.stories.tsx | clipped-child, low-contrast |
| 273 | fail | Effects + Advanced | Effects + Advanced/Glass Superpositional Menu / Weak Entanglement | src/components/quantum/GlassSuperpositionalMenu.stories.tsx | clipped-child, low-contrast |
| 271 | fail | Workflows | Workflows/Glass Mind Map / Complex Mind Map | src/components/interactive/GlassMindMap.stories.tsx | clipped-child |
| 260 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Zoomed Out | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 252 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Wide Spacing | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 249 | fail | Workflows | Workflows/Social/Glass Collaborative Cursor / Many Users | src/components/social/GlassCollaborativeCursor.stories.tsx | clipped-child |
| 245 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Connection Focus | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 243 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / With Grid Lines | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 242 | fail | Media | Media/Glass Advanced Media Player / Media Player Showcase | src/components/media/GlassAdvancedMediaPlayer.stories.tsx | clipped-child, control-overlap |
| 242 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Categorized Islands | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 240 | fail | Effects + Advanced | Effects + Advanced/Glass Reaction Bar / Default | src/components/interactive/GlassReactionBar.stories.tsx | low-contrast, dark-text-on-dark |
| 240 | fail | Surfaces | Surfaces/Cards + Panels/Page Glass Container / Default | src/components/surfaces/PageGlassContainer.stories.tsx | low-contrast |
| 240 | fail | Workflows | Workflows/Glass Dashboard / Edit Mode | src/components/templates/dashboard/GlassDashboard.stories.tsx | low-contrast, dark-text-on-dark |
| 240 | fail | Workflows | Workflows/Glass Social Feed / Sort By Engagement | src/components/social/GlassSocialFeed.stories.tsx | excessive-vertical-overflow, low-contrast |
| 240 | fail | Workflows | Workflows/Glass Social Feed / Sort By Likes | src/components/social/GlassSocialFeed.stories.tsx | excessive-vertical-overflow, low-contrast |
| 237 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Grid Only | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 236 | fail | Navigation | Navigation/Glass Navigation Menu / Variants | src/components/navigation/GlassNavigationMenu.stories.tsx | low-contrast |
| 233 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Deep Subdivision | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 233 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Dense Layout | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 233 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Physics Enabled | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 230 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Default | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 230 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / No Connections | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 227 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / All Connections | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 227 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Grid Enabled | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 227 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Minimized Islands | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 227 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Pinned Islands | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child, control-overlap |
| 222 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Interactive Demo | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 221 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Large Container | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 216 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Large Scale | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child |
| 216 | fail | Workflows | Workflows/Glass Key Value Editor / Variants | src/components/interactive/GlassKeyValueEditor.stories.tsx | low-contrast, dark-text-on-dark |
| 213 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Auto Arranged | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child |
| 198 | fail | Workflows | Workflows/Social/Glass Collaborative Cursor / Silent Mode | src/components/social/GlassCollaborativeCursor.stories.tsx | clipped-child |
| 192 | fail | Controls | Controls/Inputs/Glass Form Table / Default | src/components/input/GlassFormTable.stories.tsx | low-contrast, dark-text-on-dark |
| 192 | fail | Data + Visualization | Data + Visualization/Chart Tooltip / Variants | src/components/charts/components/ChartTooltip.stories.tsx | low-contrast, dark-text-on-dark |
| 192 | fail | Effects + Advanced | Effects + Advanced/Glass Facet Search / Variants | src/components/interactive/GlassFacetSearch.stories.tsx | low-contrast, dark-text-on-dark |
| 192 | fail | Reference | Reference/Legacy Components/Glass Error Boundary / Default | src/components/GlassErrorBoundary.stories.tsx | low-contrast, dark-text-on-dark |
| 192 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Dashboard | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 192 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Tessellation / Large Pattern | src/components/layouts/GlassTessellation.stories.tsx | clipped-child |
| 192 | fail | Workflows | Workflows/Glass Key Value Editor / Default | src/components/interactive/GlassKeyValueEditor.stories.tsx | low-contrast, dark-text-on-dark |
| 192 | fail | Workflows | Workflows/Glass Social Feed / Default | src/components/social/GlassSocialFeed.stories.tsx | excessive-vertical-overflow, low-contrast |
| 192 | fail | Workflows | Workflows/Glass Social Feed / Real Time Updates | src/components/social/GlassSocialFeed.stories.tsx | excessive-vertical-overflow, low-contrast |
| 189 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Tessellation / Geometric Shapes | src/components/layouts/GlassTessellation.stories.tsx | clipped-child |
| 189 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Tessellation / Rhombic Pattern | src/components/layouts/GlassTessellation.stories.tsx | clipped-child |
| 189 | fail | Workflows | Workflows/Social/Glass Collaborative Cursor / Real Time Mode | src/components/social/GlassCollaborativeCursor.stories.tsx | clipped-child |
| 186 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Golden Ratio Grid / Silver Ratio | src/components/layouts/GlassGoldenRatioGrid.stories.tsx | clipped-child |
| 183 | fail | Reference | Reference/Legacy Components/Glass Wipe Slider Examples / Default | src/components/website-components/GlassWipeSliderExamples.stories.tsx | clipped-child |
| 183 | fail | Reference | Reference/Legacy Components/Glass Wipe Slider Examples / Variants | src/components/website-components/GlassWipeSliderExamples.stories.tsx | clipped-child |
| 183 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Masonry Grid / No Animation | src/components/layouts/GlassMasonryGrid.stories.tsx | excessive-vertical-overflow |
| 183 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Tessellation / Morphing Pattern | src/components/layouts/GlassTessellation.stories.tsx | clipped-child |
| 180 | fail | AI + Intelligence | AI + Intelligence/Glass Intelligent Image Processor / Basic Image Uploader | src/components/image/GlassIntelligentImageProcessor.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Controls | Controls/Buttons/Enhanced Glass Button / Variants | src/components/button/EnhancedGlassButton.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Controls | Controls/Buttons/Glass Button / Loading States | src/components/button/GlassButton.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Controls | Controls/Buttons/Glass Button / Variants | src/components/button/GlassButton.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Effects + Advanced | Effects + Advanced/Glass Facet Search / Default | src/components/interactive/GlassFacetSearch.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Effects + Advanced | Effects + Advanced/Glass Filter Panel / Variants | src/components/interactive/GlassFilterPanel.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Navigation | Navigation/Collapsed Menu / Default | src/components/navigation/components/CollapsedMenu.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Reference | Reference/Legacy Components/Glass Toast / Bottom Center | src/components/feedback/GlassToast.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Reference | Reference/Legacy Components/Glass Toast / Bottom Left | src/components/feedback/GlassToast.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Reference | Reference/Legacy Components/Glass Toast / Bottom Right | src/components/feedback/GlassToast.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Reference | Reference/Legacy Components/Glass Toast / Top Center | src/components/feedback/GlassToast.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Reference | Reference/Legacy Components/Glass Toast / Top Left | src/components/feedback/GlassToast.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Reference | Reference/Legacy Components/Glass Toast / Top Right | src/components/feedback/GlassToast.stories.tsx | low-contrast, dark-text-on-dark |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Drag And Resize | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Island Layout / Minimal View | src/components/layouts/GlassIslandLayout.stories.tsx | clipped-child |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Masonry Grid / Default | src/components/layouts/GlassMasonryGrid.stories.tsx | excessive-vertical-overflow |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Masonry Grid / Infinite Scroll | src/components/layouts/GlassMasonryGrid.stories.tsx | excessive-vertical-overflow |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Masonry Grid / Search Enabled | src/components/layouts/GlassMasonryGrid.stories.tsx | excessive-vertical-overflow |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Masonry Grid / Sorted By Category | src/components/layouts/GlassMasonryGrid.stories.tsx | excessive-vertical-overflow |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Masonry Grid / Sorted By Priority | src/components/layouts/GlassMasonryGrid.stories.tsx | excessive-vertical-overflow |
| 180 | fail | Surfaces | Surfaces/App Shells + Layout/Glass Tessellation / Mixed Pattern | src/components/layouts/GlassTessellation.stories.tsx | clipped-child |

## Audit-Run Errors

These are crawler or infrastructure failures. They are excluded from story ranking.

| Kind | Check | Story | File | Message |
| --- | --- | --- | --- | --- |
| - | - | - | - | - |

## False-Positive/Noise

Ignored console messages, benign warnings, font/favicon misses, and known crawler artifacts are summarized here instead of being counted as story failures.

| Kind | Count | Sample |
| --- | ---: | --- |
| console-warning | 71 | Addon controls: Control of type color only supports string, received "other" instead ; Addon controls: Control of type color only supports string, received "other" instead ; Addon controls: Control of type color only supports string, received "other" instead ; |

## Ranked Groups By File/Title Prefix

### 1. src/components/layouts/GlassIslandLayout.stories.tsx

Prefixes: Surfaces
Grouped score: 4188; affected stories: 19; findings: 70
Flags: clipped-child (19), control-overlap (12)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 351 | fail | surfaces-app-shells-layout-glass-island-layout--performance-test | Performance Test | control-overlap, clipped-child |
| 260 | fail | surfaces-app-shells-layout-glass-island-layout--zoomed-out | Zoomed Out | clipped-child, control-overlap |
| 245 | fail | surfaces-app-shells-layout-glass-island-layout--connection-focus | Connection Focus | clipped-child, control-overlap |
| 242 | fail | surfaces-app-shells-layout-glass-island-layout--categorized-islands | Categorized Islands | clipped-child, control-overlap |
| 233 | fail | surfaces-app-shells-layout-glass-island-layout--dense-layout | Dense Layout | clipped-child, control-overlap |
| 233 | fail | surfaces-app-shells-layout-glass-island-layout--physics-enabled | Physics Enabled | clipped-child, control-overlap |
| 230 | fail | surfaces-app-shells-layout-glass-island-layout--default | Default | clipped-child, control-overlap |
| 230 | fail | surfaces-app-shells-layout-glass-island-layout--no-connections | No Connections | clipped-child, control-overlap |
| 227 | fail | surfaces-app-shells-layout-glass-island-layout--all-connections | All Connections | clipped-child, control-overlap |
| 227 | fail | surfaces-app-shells-layout-glass-island-layout--grid-enabled | Grid Enabled | clipped-child, control-overlap |
| 227 | fail | surfaces-app-shells-layout-glass-island-layout--minimized-islands | Minimized Islands | clipped-child, control-overlap |
| 227 | fail | surfaces-app-shells-layout-glass-island-layout--pinned-islands | Pinned Islands | clipped-child, control-overlap |

### 2. src/components/layouts/GlassGoldenRatioGrid.stories.tsx

Prefixes: Surfaces
Grouped score: 2946; affected stories: 25; findings: 44
Flags: clipped-child (25)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 252 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--wide-spacing | Wide Spacing | clipped-child |
| 243 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--with-grid-lines | With Grid Lines | clipped-child |
| 237 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--grid-only | Grid Only | clipped-child |
| 233 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--deep-subdivision | Deep Subdivision | clipped-child |
| 222 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--interactive-demo | Interactive Demo | clipped-child |
| 221 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--large-container | Large Container | clipped-child |
| 192 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--dashboard | Dashboard | clipped-child |
| 186 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--silver-ratio | Silver Ratio | clipped-child |
| 174 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--modified-ratio | Modified Ratio | clipped-child |
| 116 | fail | surfaces-app-shells-layout-glass-golden-ratio-grid--square-container | Square Container | clipped-child |
| 58 | risk | surfaces-app-shells-layout-glass-golden-ratio-grid--classic-golden-ratio | Classic Golden Ratio | clipped-child |
| 58 | risk | surfaces-app-shells-layout-glass-golden-ratio-grid--content-layout | Content Layout | clipped-child |

### 3. src/components/quantum/GlassSuperpositionalMenu.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 2442; affected stories: 19; findings: 50
Flags: low-contrast (19), clipped-child (4)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 273 | fail | effects-advanced-glass-superpositional-menu--complex-system | Complex System | clipped-child, low-contrast |
| 273 | fail | effects-advanced-glass-superpositional-menu--entangled-system | Entangled System | clipped-child, low-contrast |
| 273 | fail | effects-advanced-glass-superpositional-menu--strong-entanglement | Strong Entanglement | clipped-child, low-contrast |
| 273 | fail | effects-advanced-glass-superpositional-menu--weak-entanglement | Weak Entanglement | clipped-child, low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--collapse-mode | Collapse Mode | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--decoherence-mode | Decoherence Mode | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--default | Default | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--fast-decoherence | Fast Decoherence | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--high-coherence | High Coherence | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--high-energy-states | High Energy States | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--interference-mode | Interference Mode | low-contrast |
| 90 | risk | effects-advanced-glass-superpositional-menu--limited-superpositions | Limited Superpositions | low-contrast |

### 4. src/components/layouts/GlassTessellation.stories.tsx

Prefixes: Surfaces
Grouped score: 2290; affected stories: 19; findings: 37
Flags: clipped-child (19)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 192 | fail | surfaces-app-shells-layout-glass-tessellation--large-pattern | Large Pattern | clipped-child |
| 189 | fail | surfaces-app-shells-layout-glass-tessellation--geometric-shapes | Geometric Shapes | clipped-child |
| 189 | fail | surfaces-app-shells-layout-glass-tessellation--rhombic-pattern | Rhombic Pattern | clipped-child |
| 183 | fail | surfaces-app-shells-layout-glass-tessellation--morphing-pattern | Morphing Pattern | clipped-child |
| 180 | fail | surfaces-app-shells-layout-glass-tessellation--mixed-pattern | Mixed Pattern | clipped-child |
| 143 | fail | surfaces-app-shells-layout-glass-tessellation--small-tiles | Small Tiles | clipped-child |
| 131 | fail | surfaces-app-shells-layout-glass-tessellation--custom-glass | Custom Glass | clipped-child |
| 116 | fail | surfaces-app-shells-layout-glass-tessellation--default | Default | clipped-child |
| 116 | fail | surfaces-app-shells-layout-glass-tessellation--elemental-theme | Elemental Theme | clipped-child |
| 116 | fail | surfaces-app-shells-layout-glass-tessellation--interactive-demo | Interactive Demo | clipped-child |
| 116 | fail | surfaces-app-shells-layout-glass-tessellation--large-tiles | Large Tiles | clipped-child |
| 116 | fail | surfaces-app-shells-layout-glass-tessellation--no-animation | No Animation | clipped-child |

### 5. src/components/ai/GlassMusicVisualizer.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 1980; affected stories: 22; findings: 44
Flags: low-contrast (22)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | ai-intelligence-glass-music-visualizer--circular-visualizer | Circular Visualizer | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--controls-only | Controls Only | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--default | Default | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--fire-theme | Fire Theme | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--frequency-bars | Frequency Bars | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--high-particle-count | High Particle Count | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--high-resolution-fft | High Resolution FFT | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--high-sensitivity | High Sensitivity | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--ice-theme | Ice Theme | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--low-particle-count | Low Particle Count | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--low-sensitivity | Low Sensitivity | low-contrast |
| 90 | risk | ai-intelligence-glass-music-visualizer--mirrored-bars | Mirrored Bars | low-contrast |

### 6. src/components/layouts/GlassMasonryGrid.stories.tsx

Prefixes: Surfaces
Grouped score: 1921; affected stories: 12; findings: 35
Flags: excessive-vertical-overflow (12)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 183 | fail | surfaces-app-shells-layout-glass-masonry-grid--no-animation | No Animation | excessive-vertical-overflow |
| 180 | fail | surfaces-app-shells-layout-glass-masonry-grid--default | Default | excessive-vertical-overflow |
| 180 | fail | surfaces-app-shells-layout-glass-masonry-grid--infinite-scroll | Infinite Scroll | excessive-vertical-overflow |
| 180 | fail | surfaces-app-shells-layout-glass-masonry-grid--search-enabled | Search Enabled | excessive-vertical-overflow |
| 180 | fail | surfaces-app-shells-layout-glass-masonry-grid--sorted-by-category | Sorted By Category | excessive-vertical-overflow |
| 180 | fail | surfaces-app-shells-layout-glass-masonry-grid--sorted-by-priority | Sorted By Priority | excessive-vertical-overflow |
| 177 | fail | surfaces-app-shells-layout-glass-masonry-grid--fast-animation | Fast Animation | excessive-vertical-overflow |
| 177 | fail | surfaces-app-shells-layout-glass-masonry-grid--responsive-breakpoints | Responsive Breakpoints | excessive-vertical-overflow |
| 132 | fail | surfaces-app-shells-layout-glass-masonry-grid--dense-layout | Dense Layout | excessive-vertical-overflow |
| 132 | fail | surfaces-app-shells-layout-glass-masonry-grid--fixed-columns | Fixed Columns | excessive-vertical-overflow |
| 132 | fail | surfaces-app-shells-layout-glass-masonry-grid--single-column | Single Column | excessive-vertical-overflow |
| 88 | risk | surfaces-app-shells-layout-glass-masonry-grid--loading-state | Loading State | excessive-vertical-overflow |

### 7. src/components/social/GlassSocialFeed.stories.tsx

Prefixes: Workflows
Grouped score: 1854; affected stories: 15; findings: 38
Flags: low-contrast (14), excessive-vertical-overflow (7)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 240 | fail | workflows-glass-social-feed--sort-by-engagement | Sort By Engagement | excessive-vertical-overflow, low-contrast |
| 240 | fail | workflows-glass-social-feed--sort-by-likes | Sort By Likes | excessive-vertical-overflow, low-contrast |
| 192 | fail | workflows-glass-social-feed--default | Default | excessive-vertical-overflow, low-contrast |
| 192 | fail | workflows-glass-social-feed--real-time-updates | Real Time Updates | excessive-vertical-overflow, low-contrast |
| 148 | fail | workflows-glass-social-feed--compact-mode | Compact Mode | excessive-vertical-overflow, low-contrast |
| 136 | fail | workflows-glass-social-feed--recent-posts | Recent Posts | excessive-vertical-overflow, low-contrast |
| 114 | fail | workflows-glass-social-feed--no-media | No Media | low-contrast |
| 114 | fail | workflows-glass-social-feed--text-only | Text Only | low-contrast |
| 100 | fail | workflows-glass-social-feed--no-interactions | No Interactions | excessive-vertical-overflow |
| 96 | risk | workflows-glass-social-feed--high-engagement | High Engagement | low-contrast |
| 90 | risk | workflows-glass-social-feed--long-content | Long Content | low-contrast |
| 48 | risk | workflows-glass-social-feed--limited-height | Limited Height | low-contrast |

### 8. src/components/ai/GlassGANGenerator.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 1710; affected stories: 20; findings: 38
Flags: low-contrast (20)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | ai-intelligence-glass-gangenerator--art-generation | Art Generation | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--big-gan-objects | Big GAN Objects | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--cycle-gan-style-transfer | Cycle GAN Style Transfer | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--dcgan-art | DCGAN Art | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--face-generation | Face Generation | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--fast-generation | Fast Generation | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--interpolation-focus | Interpolation Focus | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--landscape-generation | Landscape Generation | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--latent-space-focus | Latent Space Focus | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--low-resolution | Low Resolution | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--minimal-interface | Minimal Interface | low-contrast |
| 90 | risk | ai-intelligence-glass-gangenerator--object-generation | Object Generation | low-contrast |

### 9. src/components/ai/GlassGenerativeArt.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 1710; affected stories: 19; findings: 38
Flags: low-contrast (19)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | ai-intelligence-glass-generative-art--abstract-art-focus | Abstract Art Focus | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--advanced-mode | Advanced Mode | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--custom-model | Custom Model | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--default | Default | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--high-guidance | High Guidance | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--high-quality-mode | High Quality Mode | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--history-focus | History Focus | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--landscape-mode | Landscape Mode | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--low-guidance | Low Guidance | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--minimal-interface | Minimal Interface | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--multiple-iterations | Multiple Iterations | low-contrast |
| 90 | risk | ai-intelligence-glass-generative-art--nature-theme | Nature Theme | low-contrast |

### 10. src/components/social/GlassSharedWhiteboard.stories.tsx

Prefixes: Workflows
Grouped score: 1326; affected stories: 13; findings: 26
Flags: low-contrast (13)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 102 | fail | workflows-glass-shared-whiteboard--custom-background | Custom Background | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--dark-background | Dark Background | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--default | Default | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--large-canvas | Large Canvas | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--limited-strokes | Limited Strokes | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--many-users | Many Users | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--no-user-list | No User List | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--real-time-collaboration | Real Time Collaboration | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--silent-mode | Silent Mode | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--small-canvas | Small Canvas | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--solo-mode | Solo Mode | low-contrast |
| 102 | fail | workflows-glass-shared-whiteboard--with-grid | With Grid | low-contrast |

### 11. src/components/navigation/GlassNavigation.stories.tsx

Prefixes: Navigation
Grouped score: 1317; affected stories: 9; findings: 24
Flags: low-contrast (9), control-overlap (6)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 176 | fail | navigation-glass-navigation--consciousness-showcase | Consciousness Showcase | low-contrast, control-overlap |
| 173 | fail | navigation-glass-navigation--adaptive-layout | Adaptive Layout | low-contrast, control-overlap |
| 164 | fail | navigation-glass-navigation--achievement-driven-navigation | Achievement Driven Navigation | low-contrast, control-overlap |
| 164 | fail | navigation-glass-navigation--with-eye-tracking | With Eye Tracking | low-contrast, control-overlap |
| 164 | fail | navigation-glass-navigation--with-predictive-navigation | With Predictive Navigation | low-contrast, control-overlap |
| 152 | fail | navigation-glass-navigation--with-spatial-audio | With Spatial Audio | low-contrast, control-overlap |
| 114 | fail | navigation-glass-navigation--with-submenu | With Submenu | low-contrast |
| 108 | fail | navigation-glass-navigation--vertical-navigation | Vertical Navigation | low-contrast |
| 102 | fail | navigation-glass-navigation--default | Default | low-contrast |

### 12. src/components/ai/GlassLiveFilter.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 1252; affected stories: 21; findings: 28
Flags: low-contrast (20), excessive-vertical-overflow (4)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 133 | fail | ai-intelligence-glass-live-filter--all-filters-selected | All Filters Selected | excessive-vertical-overflow, low-contrast |
| 133 | fail | ai-intelligence-glass-live-filter--gpu-accelerated | GPU Accelerated | excessive-vertical-overflow, low-contrast |
| 133 | fail | ai-intelligence-glass-live-filter--large-canvas | Large Canvas | excessive-vertical-overflow, low-contrast |
| 88 | risk | ai-intelligence-glass-live-filter--tall-canvas | Tall Canvas | excessive-vertical-overflow |
| 45 | risk | ai-intelligence-glass-live-filter--artistic-filters | Artistic Filters | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--blur-effects | Blur Effects | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--chained-filters | Chained Filters | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--color-filters | Color Filters | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--cpu-processing | CPU Processing | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--custom-filters-enabled | Custom Filters Enabled | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--default | Default | low-contrast |
| 45 | risk | ai-intelligence-glass-live-filter--high-frame-rate | High Frame Rate | low-contrast |

### 13. src/components/immersive/GlassFluidSimulation.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 1080; affected stories: 10; findings: 20
Flags: low-contrast (10)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 108 | fail | effects-advanced-glass-fluid-simulation--default | Default | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--gas-cloud | Gas Cloud | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--high-viscosity | High Viscosity | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--honey-flow | Honey Flow | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--interactive-playground | Interactive Playground | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--mercury-droplets | Mercury Droplets | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--multi-force-field | Multi Force Field | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--plasma-field | Plasma Field | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--water-simulation | Water Simulation | low-contrast |
| 108 | fail | effects-advanced-glass-fluid-simulation--zero-gravity | Zero Gravity | low-contrast |

### 14. src/components/feedback/GlassToast.stories.tsx

Prefixes: Reference
Grouped score: 1080; affected stories: 6; findings: 24
Flags: low-contrast (6), dark-text-on-dark (6)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 180 | fail | reference-legacy-components-glass-toast--bottom-center | Bottom Center | low-contrast, dark-text-on-dark |
| 180 | fail | reference-legacy-components-glass-toast--bottom-left | Bottom Left | low-contrast, dark-text-on-dark |
| 180 | fail | reference-legacy-components-glass-toast--bottom-right | Bottom Right | low-contrast, dark-text-on-dark |
| 180 | fail | reference-legacy-components-glass-toast--top-center | Top Center | low-contrast, dark-text-on-dark |
| 180 | fail | reference-legacy-components-glass-toast--top-left | Top Left | low-contrast, dark-text-on-dark |
| 180 | fail | reference-legacy-components-glass-toast--top-right | Top Right | low-contrast, dark-text-on-dark |

### 15. src/components/interactive/GlassPatternBuilder.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 990; affected stories: 8; findings: 16
Flags: low-contrast (8)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 129 | fail | effects-advanced-glass-pattern-builder--with-preset-layers | With Preset Layers | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--basic-builder | Basic Builder | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--default | Default | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--geometric-design | Geometric Design | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--interactive-workspace | Interactive Workspace | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--large-canvas | Large Canvas | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--pattern-designer | Pattern Designer | low-contrast |
| 123 | fail | effects-advanced-glass-pattern-builder--with-custom-colors | With Custom Colors | low-contrast |

### 16. src/components/interactive/GlassVoiceInput.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 960; affected stories: 10; findings: 20
Flags: low-contrast (10)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 96 | risk | effects-advanced-glass-voice-input--bars-visualizer | Bars Visualizer | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--basic-voice-input | Basic Voice Input | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--command-recognition | Command Recognition | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--default | Default | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--high-sensitivity | High Sensitivity | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--interactive-demo | Interactive Demo | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--multi-language | Multi Language | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--particle-visualizer | Particle Visualizer | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--voice-assistant | Voice Assistant | low-contrast |
| 96 | risk | effects-advanced-glass-voice-input--wake-word-enabled | Wake Word Enabled | low-contrast |

### 17. src/components/immersive/GlassVortexPortal.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 900; affected stories: 10; findings: 20
Flags: low-contrast (10)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | effects-advanced-glass-vortex-portal--default | Default | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--dimensional-portal | Dimensional Portal | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--energy-vortex | Energy Vortex | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--high-intensity-vortex | High Intensity Vortex | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--interactive-playground | Interactive Playground | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--quantum-tunnel | Quantum Tunnel | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--red-vortex | Red Vortex | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--slow-motion-vortex | Slow Motion Vortex | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--temporal-rift | Temporal Rift | low-contrast |
| 90 | risk | effects-advanced-glass-vortex-portal--void-portal | Void Portal | low-contrast |

### 18. src/components/charts/GlassChart.stories.tsx

Prefixes: Data + Visualization
Grouped score: 882; affected stories: 7; findings: 15
Flags: clipped-child (7)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 174 | fail | data-visualization-glass-chart--adaptive-chart | Adaptive Chart | clipped-child |
| 122 | fail | data-visualization-glass-chart--consciousness-comparison | Consciousness Comparison | clipped-child |
| 122 | fail | data-visualization-glass-chart--variants | Variants | clipped-child |
| 116 | fail | data-visualization-glass-chart--default | Default | clipped-child |
| 116 | fail | data-visualization-glass-chart--immersive-experience | Immersive Experience | clipped-child |
| 116 | fail | data-visualization-glass-chart--with-eye-tracking | With Eye Tracking | clipped-child |
| 116 | fail | data-visualization-glass-chart--with-predictive-features | With Predictive Features | clipped-child |

### 19. src/components/interactive/GlassQueryBuilder.stories.tsx

Prefixes: Workflows
Grouped score: 846; affected stories: 2; findings: 14
Flags: clipped-child (2), low-contrast (2), dark-text-on-dark (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 468 | fail | workflows-glass-query-builder--complex-query | Complex Query | clipped-child, low-contrast, dark-text-on-dark |
| 378 | fail | workflows-glass-query-builder--default | Default | clipped-child, low-contrast, dark-text-on-dark |

### 20. src/components/interactive/GlassGestureZone.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 768; affected stories: 8; findings: 16
Flags: low-contrast (8)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 96 | risk | effects-advanced-glass-gesture-zone--basic-gestures | Basic Gestures | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--custom-gestures | Custom Gestures | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--custom-trail | Custom Trail | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--debug-mode | Debug Mode | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--default | Default | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--high-sensitivity | High Sensitivity | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--interactive-playground | Interactive Playground | low-contrast |
| 96 | risk | effects-advanced-glass-gesture-zone--multi-touch-enabled | Multi Touch Enabled | low-contrast |

### 21. src/components/interactive/GlassComponentPlayground.stories.tsx

Prefixes: Workflows
Grouped score: 673; affected stories: 2; findings: 12
Flags: clipped-child (2), low-contrast (2), control-overlap (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 338 | fail | workflows-glass-component-playground--variants | Variants | clipped-child, low-contrast, control-overlap |
| 335 | fail | workflows-glass-component-playground--default | Default | clipped-child, low-contrast, control-overlap |

### 22. src/components/media/GlassAdvancedMediaPlayer.stories.tsx

Prefixes: Media
Grouped score: 669; affected stories: 5; findings: 11
Flags: clipped-child (5), control-overlap (4)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 242 | fail | media-glass-advanced-media-player--media-player-showcase | Media Player Showcase | clipped-child, control-overlap |
| 126 | fail | media-glass-advanced-media-player--full-featured-video-player | Full Featured Video Player | control-overlap, clipped-child |
| 123 | fail | media-glass-advanced-media-player--video-with-transcription | Video With Transcription | control-overlap, clipped-child |
| 120 | fail | media-glass-advanced-media-player--video-with-chapters | Video With Chapters | control-overlap, clipped-child |
| 58 | risk | media-glass-advanced-media-player--advanced-video-player | Advanced Video Player | clipped-child |

### 23. src/components/social/GlassCollaborativeCursor.stories.tsx

Prefixes: Workflows
Grouped score: 636; affected stories: 3; findings: 9
Flags: clipped-child (3)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 249 | fail | workflows-social-glass-collaborative-cursor--many-users | Many Users | clipped-child |
| 198 | fail | workflows-social-glass-collaborative-cursor--silent-mode | Silent Mode | clipped-child |
| 189 | fail | workflows-social-glass-collaborative-cursor--real-time-mode | Real Time Mode | clipped-child |

### 24. src/components/navigation/GlassNavigationMenu.stories.tsx

Prefixes: Navigation
Grouped score: 566; affected stories: 3; findings: 9
Flags: low-contrast (3)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 236 | fail | navigation-glass-navigation-menu--variants | Variants | low-contrast |
| 168 | fail | navigation-glass-navigation-menu--default | Default | low-contrast |
| 162 | fail | navigation-glass-navigation-menu--with-nested-items | With Nested Items | low-contrast |

### 25. src/components/interactive/GlassReactionBar.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 552; affected stories: 2; findings: 8
Flags: low-contrast (2), dark-text-on-dark (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 312 | fail | effects-advanced-glass-reaction-bar--popular-reactions | Popular Reactions | low-contrast, dark-text-on-dark |
| 240 | fail | effects-advanced-glass-reaction-bar--default | Default | low-contrast, dark-text-on-dark |

### 26. src/components/interactive/GlassMindMap.stories.tsx

Prefixes: Workflows
Grouped score: 550; affected stories: 2; findings: 6
Flags: clipped-child (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 279 | fail | workflows-glass-mind-map--default | Default | clipped-child |
| 271 | fail | workflows-glass-mind-map--complex-mind-map | Complex Mind Map | clipped-child |

### 27. src/components/interactive/GlassFilterPanel.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 522; affected stories: 2; findings: 11
Flags: low-contrast (2), dark-text-on-dark (2), control-overlap (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 342 | fail | effects-advanced-glass-filter-panel--default | Default | control-overlap, low-contrast, dark-text-on-dark |
| 180 | fail | effects-advanced-glass-filter-panel--variants | Variants | low-contrast, dark-text-on-dark |

### 28. src/components/interactive/GlassKeyValueEditor.stories.tsx

Prefixes: Workflows
Grouped score: 408; affected stories: 2; findings: 8
Flags: low-contrast (2), dark-text-on-dark (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 216 | fail | workflows-glass-key-value-editor--variants | Variants | low-contrast, dark-text-on-dark |
| 192 | fail | workflows-glass-key-value-editor--default | Default | low-contrast, dark-text-on-dark |

### 29. src/components/interactive/GlassFacetSearch.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 372; affected stories: 2; findings: 8
Flags: low-contrast (2), dark-text-on-dark (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 192 | fail | effects-advanced-glass-facet-search--variants | Variants | low-contrast, dark-text-on-dark |
| 180 | fail | effects-advanced-glass-facet-search--default | Default | low-contrast, dark-text-on-dark |

### 30. src/components/website-components/GlassWipeSliderExamples.stories.tsx

Prefixes: Reference
Grouped score: 366; affected stories: 2; findings: 6
Flags: clipped-child (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 183 | fail | reference-legacy-components-glass-wipe-slider-examples--default | Default | clipped-child |
| 183 | fail | reference-legacy-components-glass-wipe-slider-examples--variants | Variants | clipped-child |

### 31. src/components/button/GlassButton.stories.tsx

Prefixes: Controls
Grouped score: 360; affected stories: 2; findings: 8
Flags: low-contrast (2), dark-text-on-dark (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 180 | fail | controls-buttons-glass-button--loading-states | Loading States | low-contrast, dark-text-on-dark |
| 180 | fail | controls-buttons-glass-button--variants | Variants | low-contrast, dark-text-on-dark |

### 32. src/components/cookie-consent/GlobalCookieConsent.stories.tsx

Prefixes: Workflows
Grouped score: 360; affected stories: 2; findings: 8
Flags: low-contrast (2), dark-text-on-dark (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 180 | fail | workflows-global-cookie-consent--default | Default | low-contrast, dark-text-on-dark |
| 180 | fail | workflows-global-cookie-consent--variants | Variants | low-contrast, dark-text-on-dark |

### 33. src/components/website-components/GlassPrismComparison.stories.tsx

Prefixes: Reference
Grouped score: 348; affected stories: 2; findings: 6
Flags: clipped-child (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 174 | fail | reference-legacy-components-glass-prism-comparison--default | Default | clipped-child |
| 174 | fail | reference-legacy-components-glass-prism-comparison--variants | Variants | clipped-child |

### 34. src/components/cms/GlassPageBuilder.stories.tsx

Prefixes: Workflows
Grouped score: 343; affected stories: 4; findings: 6
Flags: clipped-child (4), low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 169 | fail | workflows-glass-page-builder--dashboard-builder | Dashboard Builder | low-contrast, clipped-child |
| 58 | risk | workflows-glass-page-builder--empty-builder | Empty Builder | clipped-child |
| 58 | risk | workflows-glass-page-builder--landing-page-builder | Landing Page Builder | clipped-child |
| 58 | risk | workflows-glass-page-builder--mobile-first | Mobile First | clipped-child |

### 35. src/primitives/focus/SkipLinks.stories.tsx

Prefixes: Foundations
Grouped score: 336; affected stories: 2; findings: 6
Flags: control-overlap (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 168 | fail | foundations-liquid-glass-primitives-skip-links--default | Default | control-overlap |
| 168 | fail | foundations-liquid-glass-primitives-skip-links--variants | Variants | control-overlap |

### 36. src/components/navigation/GlassPagination.stories.tsx

Prefixes: Navigation
Grouped score: 330; affected stories: 3; findings: 7
Flags: low-contrast (3)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 141 | fail | navigation-glass-pagination--default | Default | low-contrast |
| 141 | fail | navigation-glass-pagination--large-dataset | Large Dataset | low-contrast |
| 48 | risk | navigation-glass-pagination--small-size | Small Size | low-contrast |

### 37. src/components/interactive/GlassVideoPlayer.stories.tsx

Prefixes: Media
Grouped score: 312; affected stories: 2; findings: 6
Flags: control-overlap (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 156 | fail | media-glass-video-player--default | Default | control-overlap |
| 156 | fail | media-glass-video-player--with-subtitles | With Subtitles | control-overlap |

### 38. src/components/navigation/HeaderUserMenu.stories.tsx

Prefixes: Navigation
Grouped score: 303; affected stories: 2; findings: 6
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 162 | fail | navigation-header-user-menu--variants | Variants | low-contrast |
| 141 | fail | navigation-header-user-menu--default | Default | low-contrast |

### 39. src/components/interactive/GlassChatInput.stories.tsx

Prefixes: Workflows
Grouped score: 300; affected stories: 2; findings: 6
Flags: control-overlap (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 150 | fail | workflows-glass-chat-input--default | Default | control-overlap |
| 150 | fail | workflows-glass-chat-input--variants | Variants | control-overlap |

### 40. src/components/card/patterns.stories.tsx

Prefixes: Surfaces
Grouped score: 294; affected stories: 2; findings: 6
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 147 | fail | surfaces-cards-panels-patterns--default | Default | low-contrast |
| 147 | fail | surfaces-cards-panels-patterns--with-glass-effect | With Glass Effect | low-contrast |

### 41. src/components/navigation/GlassBottomNav.stories.tsx

Prefixes: Navigation
Grouped score: 285; affected stories: 5; findings: 5
Flags: low-contrast (5)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 57 | risk | navigation-glass-bottom-nav--default | Default | low-contrast |
| 57 | risk | navigation-glass-bottom-nav--floating | Floating | low-contrast |
| 57 | risk | navigation-glass-bottom-nav--large-size | Large Size | low-contrast |
| 57 | risk | navigation-glass-bottom-nav--minimal | Minimal | low-contrast |
| 57 | risk | navigation-glass-bottom-nav--without-labels | Without Labels | low-contrast |

### 42. src/components/ai/GlassDeepDreamGlass.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 270; affected stories: 3; findings: 6
Flags: low-contrast (3)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | ai-intelligence-glass-deep-dream-glass--minimal-interface | Minimal Interface | low-contrast |
| 90 | risk | ai-intelligence-glass-deep-dream-glass--preview-only | Preview Only | low-contrast |
| 90 | risk | ai-intelligence-glass-deep-dream-glass--settings-only | Settings Only | low-contrast |

### 43. src/components/interactive/GlassWhiteboard.stories.tsx

Prefixes: Workflows
Grouped score: 255; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 135 | fail | workflows-glass-whiteboard--default | Default | low-contrast |
| 120 | fail | workflows-glass-whiteboard--collaborative | Collaborative | low-contrast |

### 44. src/components/surfaces/PageGlassContainer.stories.tsx

Prefixes: Surfaces
Grouped score: 240; affected stories: 1; findings: 3
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 240 | fail | surfaces-cards-panels-page-glass-container--default | Default | low-contrast |

### 45. src/components/templates/dashboard/GlassDashboard.stories.tsx

Prefixes: Workflows
Grouped score: 240; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 240 | fail | workflows-glass-dashboard--edit-mode | Edit Mode | low-contrast, dark-text-on-dark |

### 46. src/components/navigation/GlassTabBar.stories.tsx

Prefixes: Navigation
Grouped score: 219; affected stories: 2; findings: 4
Flags: control-overlap (2), clipped-child (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 111 | fail | navigation-glass-tab-bar--default | Default | control-overlap, clipped-child |
| 108 | fail | navigation-glass-tab-bar--compact | Compact | control-overlap, clipped-child |

### 47. src/components/input/GlassFormTable.stories.tsx

Prefixes: Controls
Grouped score: 192; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 192 | fail | controls-inputs-glass-form-table--default | Default | low-contrast, dark-text-on-dark |

### 48. src/components/charts/components/ChartTooltip.stories.tsx

Prefixes: Data + Visualization
Grouped score: 192; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 192 | fail | data-visualization-chart-tooltip--variants | Variants | low-contrast, dark-text-on-dark |

### 49. src/components/interactive/GlassCoachmarks.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 192; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 96 | risk | effects-advanced-glass-coachmarks--default | Default | low-contrast |
| 96 | risk | effects-advanced-glass-coachmarks--multi-step | Multi Step | low-contrast |

### 50. src/components/GlassErrorBoundary.stories.tsx

Prefixes: Reference
Grouped score: 192; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 192 | fail | reference-legacy-components-glass-error-boundary--default | Default | low-contrast, dark-text-on-dark |

### 51. src/components/modal/GlassBottomSheet.stories.tsx

Prefixes: Surfaces
Grouped score: 192; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 96 | risk | surfaces-modals-glass-bottom-sheet--default | Default | low-contrast |
| 96 | risk | surfaces-modals-glass-bottom-sheet--tall-workflow | Tall Workflow | low-contrast |

### 52. src/components/modal/GlassDialog.stories.tsx

Prefixes: Surfaces
Grouped score: 192; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 96 | risk | surfaces-modals-glass-dialog--default | Default | low-contrast |
| 96 | risk | surfaces-modals-glass-dialog--large-review | Large Review | low-contrast |

### 53. src/components/modal/GlassModal.stories.tsx

Prefixes: Surfaces
Grouped score: 183; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 93 | risk | surfaces-modals-glass-modal--fullscreen-review | Fullscreen Review | low-contrast |
| 90 | risk | surfaces-modals-glass-modal--default | Default | low-contrast |

### 54. src/components/image/GlassIntelligentImageProcessor.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 180; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 180 | fail | ai-intelligence-glass-intelligent-image-processor--basic-uploader | Basic Image Uploader | low-contrast, dark-text-on-dark |

### 55. src/components/button/EnhancedGlassButton.stories.tsx

Prefixes: Controls
Grouped score: 180; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 180 | fail | controls-buttons-enhanced-glass-button--variants | Variants | low-contrast, dark-text-on-dark |

### 56. src/components/input/GlassWizard.stories.tsx

Prefixes: Controls
Grouped score: 180; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | controls-inputs-glass-wizard--default | Default | low-contrast |
| 90 | risk | controls-inputs-glass-wizard--variants | Variants | low-contrast |

### 57. src/components/search/GlassSpotlightSearch.stories.tsx

Prefixes: Controls
Grouped score: 180; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | controls-search-glass-spotlight-search--default | Default | low-contrast |
| 90 | risk | controls-search-glass-spotlight-search--ungrouped | Ungrouped | low-contrast |

### 58. src/components/interactive/GlassCodeEditor.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 180; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | effects-advanced-glass-code-editor--multi-file-project | Multi File Project | low-contrast |
| 90 | risk | effects-advanced-glass-code-editor--with-files | With Files | low-contrast |

### 59. src/components/navigation/components/CollapsedMenu.stories.tsx

Prefixes: Navigation
Grouped score: 180; affected stories: 1; findings: 4
Flags: low-contrast (1), dark-text-on-dark (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 180 | fail | navigation-collapsed-menu--default | Default | low-contrast, dark-text-on-dark |

### 60. src/components/modal/GlassDrawer.stories.tsx

Prefixes: Surfaces
Grouped score: 180; affected stories: 2; findings: 4
Flags: low-contrast (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | surfaces-modals-glass-drawer--default | Default | low-contrast |
| 90 | risk | surfaces-modals-glass-drawer--left-navigation | Left Navigation | low-contrast |

### 61. src/components/button/GlassMagneticButton.stories.tsx

Prefixes: Controls
Grouped score: 174; affected stories: 1; findings: 3
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 174 | fail | controls-buttons-glass-magnetic-button--default | Default | clipped-child |

### 62. src/components/layouts/GlassFractalLayout.stories.tsx

Prefixes: Surfaces
Grouped score: 174; affected stories: 1; findings: 3
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 174 | fail | surfaces-app-shells-layout-glass-fractal-layout--zoomed-in | Zoomed In | clipped-child |

### 63. src/components/data-display/GlassTreeView.stories.tsx

Prefixes: Data + Visualization
Grouped score: 168; affected stories: 1; findings: 3
Flags: control-overlap (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 168 | fail | data-visualization-glass-tree-view--default | Default | control-overlap |

### 64. src/utils/errorBoundary.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 150; affected stories: 1; findings: 3
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 150 | fail | effects-advanced-error-boundary--async-error-boundary | Async Error Boundary | low-contrast |

### 65. src/components/templates/dashboard/widgets/ChartWidget.stories.tsx

Prefixes: Workflows
Grouped score: 122; affected stories: 1; findings: 2
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 122 | fail | workflows-chart-widget--variants | Variants | clipped-child |

### 66. src/components/navigation/components/ScrollButtons.stories.tsx

Prefixes: Navigation
Grouped score: 116; affected stories: 2; findings: 2
Flags: clipped-child (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 58 | risk | navigation-scroll-buttons--default | Default | clipped-child |
| 58 | risk | navigation-scroll-buttons--right-only | Right Only | clipped-child |

### 67. src/components/input/GlassTransferList.stories.tsx

Prefixes: Controls
Grouped score: 106; affected stories: 2; findings: 2
Flags: control-overlap (2)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 53 | risk | controls-inputs-glass-transfer-list--compact-picker | Compact Picker | control-overlap |
| 53 | risk | controls-inputs-glass-transfer-list--default | Default | control-overlap |

### 68. src/components/houdini/HoudiniGlassProvider.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 102; affected stories: 1; findings: 2
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 102 | fail | effects-advanced-houdini-glass-provider--showcase | Showcase | low-contrast |

### 69. src/components/ai/examples/AIDemo.stories.tsx

Prefixes: AI + Intelligence
Grouped score: 90; affected stories: 1; findings: 2
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | ai-intelligence-aidemo--default | Default | low-contrast |

### 70. src/components/surfaces/DimensionalGlass.stories.tsx

Prefixes: Surfaces
Grouped score: 90; affected stories: 1; findings: 2
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 90 | risk | surfaces-cards-panels-dimensional-glass--variants | Variants | low-contrast |

### 71. src/components/interactive/GlassStepper.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 70; affected stories: 1; findings: 1
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 70 | risk | effects-advanced-glass-stepper--with-optional-steps | With Optional Steps | clipped-child |

### 72. src/components/backgrounds/GlassDynamicAtmosphere.stories.tsx

Prefixes: Effects + Advanced
Grouped score: 67; affected stories: 1; findings: 1
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 67 | risk | effects-advanced-glass-dynamic-atmosphere--variants | Variants | clipped-child |

### 73. src/stories/ChartsGallery.stories.tsx

Prefixes: Reference
Grouped score: 66; affected stories: 1; findings: 1
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 66 | risk | reference-category-galleries-charts-gallery--gallery | Gallery | low-contrast |

### 74. src/stories/ComponentGallery.stories.tsx

Prefixes: Reference
Grouped score: 60; affected stories: 1; findings: 1
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 60 | risk | reference-category-galleries-component-gallery--gallery | Gallery | low-contrast |

### 75. src/stories/CoreGallery.stories.tsx

Prefixes: Reference
Grouped score: 60; affected stories: 1; findings: 1
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 60 | risk | reference-category-galleries-core-gallery--gallery | Gallery | low-contrast |

### 76. src/components/interactive/GlassLazyImage.stories.tsx

Prefixes: Media
Grouped score: 58; affected stories: 1; findings: 1
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 58 | risk | media-glass-lazy-image--variants | Variants | clipped-child |

### 77. src/components/interactive/GlassMessageList.stories.tsx

Prefixes: Workflows
Grouped score: 58; affected stories: 1; findings: 1
Flags: clipped-child (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 58 | risk | workflows-glass-message-list--with-attachments | With Attachments | clipped-child |

### 78. src/stories/BackgroundsGallery.stories.tsx

Prefixes: Reference
Grouped score: 54; affected stories: 1; findings: 1
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 54 | risk | reference-category-galleries-backgrounds-gallery--gallery | Gallery | low-contrast |

### 79. src/stories/ButtonGallery.stories.tsx

Prefixes: Reference
Grouped score: 54; affected stories: 1; findings: 1
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 54 | risk | reference-category-galleries-button-gallery--gallery | Gallery | low-contrast |

### 80. src/stories/DataDisplayGallery.stories.tsx

Prefixes: Reference
Grouped score: 54; affected stories: 1; findings: 1
Flags: low-contrast (1)

| Score | Status | Story ID | Story | Flags |
| ---: | --- | --- | --- | --- |
| 54 | risk | reference-category-galleries-data-display-gallery--gallery | Gallery | low-contrast |

## Rerun

```bash
STORYBOOK_URL=http://127.0.0.1:6016 STORYBOOK_QA_CONCURRENCY=8 node scripts/storybook-exhaustive-qa.js
```

Useful options: `--broad-limit N`, `--limit N`, `--mobile-all`, `--fail-on-findings`.
