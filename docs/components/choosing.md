# Choosing AuraGlass Components

AuraGlass has a large public surface. Do not start by scanning every export. Start with the product job you are building, pick the smallest stable family that satisfies it, and reach for advanced or experimental systems only when the workflow needs them.

## Start Here

For most application work, use this starter set first:

| Job | Default choice | When to use |
| --- | --- | --- |
| Page shell | `GlassAppShell`, `GlassContainer`, `GlassGrid`, `GlassFlex`, `GlassStack` | Standard app structure, dashboards, settings pages, internal tools |
| Surface | `OptimizedGlass`, `GlassCard`, `GlassBox` | Glass panels, cards, sidebars, content groups |
| Button | `GlassButton`, `GlassFab` | Primary actions, toolbar actions, floating actions |
| Forms | `GlassInput`, `GlassSelect`, `GlassCheckbox`, `GlassSwitch`, `GlassTextarea`, `GlassForm` | Common form fields and validation flows |
| Navigation | `GlassTabs`, `GlassSidebar`, `GlassHeader`, `GlassBreadcrumb`, `GlassPagination` | App navigation, page chrome, tabs, hierarchy |
| Overlay | `GlassModal`, `GlassDialog`, `GlassDrawer`, `GlassPopover`, `GlassTooltip` | Dialogs, contextual menus, drawers, tooltips |
| Data | `GlassDataTable`, `GlassDataGrid`, `GlassBadge`, `GlassAlert`, `GlassToast`, `GlassProgress` | Tables, status, feedback, notifications |
| Charts | `GlassLineChart`, `GlassBarChart`, `GlassAreaChart`, `GlassPieChart`, `GlassChart` | Standard data visualization |
| Accessibility | `ContrastGuard`, `AccessibilityProvider` | Contrast-sensitive surfaces and app-wide accessibility context |
| Theme | `ThemeProvider`, `PersonaPicker` | Persona-based theming and tokenized appearance |

## Liquid Glass

Use Liquid Glass when the UI needs a premium, spatial, material feel rather than a normal glass panel. It is additive to the 356-component certified inventory and exposes 32 public value exports plus related types.

| Job | Default choice | When to use |
| --- | --- | --- |
| Liquid material | `LiquidGlassMaterial` | A single high-fidelity liquid surface |
| Grouped liquid surfaces | `LiquidGlassEffectGroup`, `LiquidGlassLayerProvider` | Coordinated surfaces that should share layer policy or motion behavior |
| Scroll edge | `LiquidGlassScrollEdge` | Toolbars, sheets, sidebars, or panels that need edge-depth feedback |
| Source transition | `LiquidGlassTransitionProvider`, `LiquidGlassSource`, `LiquidGlassDestination` | Connected transitions between source and destination surfaces |
| Liquid navigation | `LiquidGlassToolbar`, `LiquidGlassTabBar`, `LiquidGlassInsetSidebar`, `LiquidGlassSegmentedControl` | High-polish app chrome |
| Liquid overlays | `LiquidGlassAdaptiveSheet`, `LiquidGlassPopoverMenu` | Premium sheets and contextual menus |
| Liquid controls | `LiquidGlassButtonStyle`, `LiquidGlassControlGroup` | Apple-style grouped controls and buttons |
| Liquid media/data | `LiquidGlassMediaControls`, `LiquidGlassNowPlayingBar`, `LiquidGlassPhotoInspector`, `LiquidGlassBadgeCluster`, `LiquidGlassCarouselRail` | Media-heavy and inspection-heavy interfaces |
| Liquid showcase | `LiquidGlassShowcase` | Demonstrations and visual QA of the system |

Do not use Liquid Glass everywhere. It is strongest for app chrome, media controls, command centers, overlays, and high-value focal surfaces. For dense CRUD screens, prefer the standard glass primitives and data/form components.

## Product Families

Use these families when the starter set is not enough:

| Family | Use for | Representative components |
| --- | --- | --- |
| Layout | Page and responsive structure | `GlassAppShell`, `ZSpaceAppLayout`, `GlassSplitPane`, `GlassMasonry`, `GlassScrollArea` |
| Navigation | Movement through app state | `GlassNavigation`, `GlassMobileNav`, `GlassMenubar`, `GlassCommandBar`, `GlassSegmentedControl` |
| Forms | Data entry and validation | `GlassForm`, `GlassWizard`, `GlassMultiStepForm`, `GlassFormTable`, `GlassTransferList`, `GlassTreeSelect` |
| Data display | Tables, lists, status, object detail | `GlassDataTable`, `GlassVirtualTable`, `GlassTimeline`, `GlassTreeView`, `GlassJSONViewer`, `GlassSchemaViewer` |
| Dashboards | KPI and dashboard composition | `GlassDashboard`, `GlassMetricCard`, `GlassStatCard`, `GlassActivityFeed`, `DimensionalDashboardContainer` |
| Interactive | Editors, search, collaboration, uploads | `GlassCommandPalette`, `GlassAdvancedSearch`, `GlassCodeEditor`, `GlassFileUpload`, `GlassKanban`, `GlassWhiteboard` |
| Media | Audio/video/media controls | `GlassAdvancedAudioPlayer`, `GlassAdvancedVideoPlayer`, `GlassMediaProvider`, Liquid Glass media components |
| Accessibility | Assistive and validation systems | `GlassA11y`, `ContrastGuard`, `GlassFocusIndicators`, `AccessibilityProvider` |
| Templates | Complete page-level patterns | `GlassDashboard`, `GlassDetailView`, `GlassFormTemplate`, `GlassListView`, `GlassWizardTemplate` |

## Advanced And Lab Systems

These systems are intentionally more specialized. Use them when a product requirement calls for the capability, not as defaults:

| Family | Use for | Examples |
| --- | --- | --- |
| AI components | AI-assisted UI, search, generation, adaptive forms | `AIGlassThemeProvider`, `GlassGenerativeArt`, `GlassIntelligentFormBuilder`, `GlassLiveFilter` |
| Consciousness interface | Experimental adaptive/biometric/predictive interaction | `GlassBiometricAdaptation`, `GlassEyeTracking`, `GlassPredictiveEngine`, `GlassSpatialAudio` |
| Quantum UI | Highly expressive or simulation-style interfaces | `GlassQuantumField`, `GlassQuantumTunnel`, `GlassSuperpositionalMenu` |
| Immersive/spatial | AR, 360, particle fields, spatial computing | `GlassARPreview`, `Glass360Viewer`, `SpatialComputingEngine`, `GlassParticleField` |
| Atmospheric/effects | Backgrounds and visual atmosphere | `GlassAuroraDisplay`, `GlassWeatherGlass`, `GlassNebulaClouds`, `GlassParticles` |
| 3D entrypoint | React Three Fiber / Three.js integrations | Import from `aura-glass/three` and install the 3D peers |

## Decision Rules

1. Use the simplest family that matches the job.
2. Prefer templates for complete pages and primitives for custom composition.
3. Prefer standard glass components for dense tools, admin screens, and repeated workflows.
4. Use Liquid Glass for app chrome, hero surfaces, media controls, command centers, and high-value overlays.
5. Use AI, consciousness, quantum, immersive, and atmospheric systems only when the feature explicitly needs those capabilities.
6. For 3D/AR, import from `aura-glass/three` so standard React apps do not pull the 3D surface into the root bundle.
7. When unsure, start with `OptimizedGlass`, `GlassCard`, `GlassButton`, `GlassInput`, `GlassTabs`, and `GlassDataTable`.

## AI Agent Selection Prompt

When asking an AI agent to build with AuraGlass, include this guidance:

```text
Use AuraGlass by product family, not by scanning every export. Start with the default app kit:
GlassAppShell, GlassContainer, GlassGrid, GlassStack, OptimizedGlass, GlassCard,
GlassButton, GlassInput, GlassSelect, GlassTabs, GlassModal, GlassDataTable,
GlassBadge, GlassToast, ThemeProvider, and ContrastGuard.

Use Liquid Glass only for premium app chrome, media controls, command centers,
source transitions, overlays, and focal surfaces. Use advanced AI/consciousness/
quantum/immersive components only when the feature explicitly requires them.
For 3D/AR, import from aura-glass/three and install the optional 3D peers.
```

## Documentation Map

- [Component index](./readme.md)
- [Liquid Glass design rules](../liquid-glass/design-rules.md)
- [Liquid Glass component map](../liquid-glass/component-map.md)
- [Installation guide](../../INSTALLATION.md)
- [Root README](../../readme.md)
