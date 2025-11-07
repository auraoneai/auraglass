# AuraGlass Components - Detailed Listing by Category

## Quick Navigation
- [Layout Components (21)](#layout-components)
- [Form Components (36)](#form-components)
- [Data Display Components (46)](#data-display-components)
- [Navigation Components (23)](#navigation-components)
- [Button Components (10)](#button-components)
- [Chart Components (18)](#chart-components)
- [Modal Components (7)](#modal-components)
- [Miscellaneous Components (195)](#miscellaneous-components-advanced)

Legend: 
- 🎯 ARIA Attributes
- ⌨️ Focus Management
- ⚡ Reduced Motion Support

---

## LAYOUT COMPONENTS

### Core Layout Components (21 total)

| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassAppShell** | 🎯 | | ⚡ | `layout/GlassAppShell.tsx` |
| **GlassBox** | | | | `layout/GlassBox.tsx` |
| **GlassContainer** | | ⌨️ | | `layout/GlassContainer.tsx` |
| **GlassDepthLayer** | | | | `surfaces/GlassDepthLayer.tsx` |
| **GlassFlex** | 🎯 | | ⚡ | `layout/GlassFlex.tsx` |
| **GlassFractalLayout** | 🎯 | | ⚡ | `layouts/GlassFractalLayout.tsx` |
| **GlassGoldenRatioGrid** | 🎯 | | ⚡ | `layouts/GlassGoldenRatioGrid.tsx` |
| **GlassGrid** | 🎯 | | ⚡ | `layout/GlassGrid.tsx` |
| **GlassIslandLayout** | | | | `layouts/GlassIslandLayout.tsx` |
| **GlassMasonry** | 🎯 | | ⚡ | `layout/GlassMasonry.tsx` |
| **GlassMasonryGrid** | | | | `layouts/GlassMasonryGrid.tsx` |
| **GlassScrollArea** | 🎯 | | ⚡ | `layout/GlassScrollArea.tsx` |
| **GlassSeparator** | 🎯 | | ⚡ | `layout/GlassSeparator.tsx` |
| **GlassSplitPane** | 🎯 | ⌨️ | ⚡ | `layout/GlassSplitPane.tsx` |
| **GlassStack** | 🎯 | | ⚡ | `layout/GlassStack.tsx` |
| **GlassTessellation** | 🎯 | | ⚡ | `layouts/GlassTessellation.tsx` |
| **HStack** | 🎯 | | ⚡ | `layout/HStack.tsx` |
| **OptimizedGlassContainer** | 🎯 | | ⚡ | `layout/OptimizedGlassContainer.tsx` |
| **VStack** | 🎯 | | ⚡ | `layout/VStack.tsx` |
| **ZSpaceAppLayout** | 🎯 | | | `layout/ZSpaceAppLayout.tsx` |
| **Box** | 🎯 | | | `layout/Box.tsx` |

**Key Features:**
- Flex/Grid systems for responsive layouts
- Stack variants (vertical, horizontal)
- Advanced layouts (golden ratio, tessellation, fractal)
- Good ARIA support and motion handling
- Ideal for page structure and component organization

**Best Practices Reference:** GlassSplitPane, GlassAppShell (full accessibility)

---

## FORM COMPONENTS

### Input Controls & Form Builders (36 total)

#### Text Inputs
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassInput** | 🎯 | ⌨️ | | `input/GlassInput.tsx` |
| **GlassTextarea** | | | | `input/GlassTextarea.tsx` |
| **GlassLabel** | 🎯 | | | `input/GlassLabel.tsx` |

#### Selectors
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassSelect** | 🎯 | | | `input/GlassSelect.tsx` |
| **GlassSelectCompound** | | | | `input/GlassSelectCompound.tsx` |
| **GlassMultiSelect** | 🎯 | | ⚡ | `input/GlassMultiSelect.tsx` |
| **GlassCheckbox** | 🎯 | | ⚡ | `input/GlassCheckbox.tsx` |
| **GlassCheckboxGroup** | 🎯 | ⌨️ | | `input/GlassCheckboxGroup.tsx` |
| **GlassRadioGroup** | 🎯 | ⌨️ | | `input/GlassRadioGroup.tsx` |
| **GlassSwitch** | 🎯 | | | `input/GlassSwitch.tsx` |
| **GlassToggle** | 🎯 | | | `input/GlassToggle.tsx` |
| **GlassTreeSelect** | | | | `input/GlassTreeSelect.tsx` |

#### Advanced Inputs
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassDatePicker** | 🎯 | ⌨️ | | `input/GlassDatePicker.tsx` |
| **GlassDateRangePicker** | | | | `input/GlassDateRangePicker.tsx` |
| **GlassColorPicker** | | ⌨️ | | `input/GlassColorPicker.tsx` |
| **GlassSlider** | 🎯 | | | `input/GlassSlider.tsx` |
| **GlassFileUpload** | | | | `input/GlassFileUpload.tsx` |

#### Form Builders & Complex
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassForm** | 🎯 | | | `input/GlassForm.tsx` |
| **GlassFormBuilder** | 🎯 | | | `interactive/GlassFormBuilder.tsx` |
| **GlassFormStepper** | | | | `input/GlassFormStepper.tsx` |
| **GlassFormTable** | | | | `input/GlassFormTable.tsx` |
| **GlassFormTemplate** | | | | `templates/forms/GlassFormTemplate.tsx` |
| **GlassFormWizardSteps** | | | | `templates/forms/GlassFormWizardSteps.tsx` |
| **GlassMultiStepForm** | | ⌨️ | | `input/GlassMultiStepForm.tsx` |
| **GlassStepper** | | | | `input/GlassStepper.tsx` |
| **GlassStep** | | | | `input/GlassStep.tsx` |
| **GlassStepIcon** | | | | `input/GlassStepIcon.tsx` |
| **GlassStepLabel** | | | | `input/GlassStepLabel.tsx` |
| **GlassWizard** | | | | `input/GlassWizard.tsx` |
| **GlassWizardTemplate** | | | | `templates/forms/GlassWizardTemplate.tsx` |
| **GlassTransferList** | 🎯 | | | `input/GlassTransferList.tsx` |

#### Date/Rating
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassCalendar** | | | | `calendar/GlassCalendar.tsx` |
| **GlassRating** | 🎯 | | | `rating/GlassRating.tsx` |

**Key Features:**
- Complete form control set
- Form builders and wizards
- Good ARIA coverage (61%)
- Moderate focus management (50%)
- Limited reduced motion support (25%)

**Best Practices Reference:** GlassCheckboxGroup, GlassDatePicker, GlassRadioGroup

---

## DATA DISPLAY COMPONENTS

### Tables, Cards, Lists & Indicators (46 total)

#### Tables & Grids
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassDataTable** | 🎯 | | | `data-display/GlassDataTable.tsx` |
| **GlassDataGrid** | 🎯 | ⌨️ | | `data-display/GlassDataGrid.tsx` |
| **GlassDataGridPro** | | | | `data-display/GlassDataGridPro.tsx` |
| **GlassVirtualTable** | 🎯 | | | `data-display/GlassVirtualTable.tsx` |

#### Cards
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassCard** | | | | `card/GlassCard.tsx` |
| **GlowingCard** | | | | `card/GlowingCard.tsx` |
| **GlassCardLink** | 🎯 | | ⚡ | `interactive/GlassCardLink.tsx` |
| **GlassKPICard** | | | | `dashboard/GlassKPICard.tsx` |
| **GlassMetricCard** | | | | `dashboard/GlassMetricCard.tsx` |
| **GlassStatCard** | | | | `dashboard/GlassStatCard.tsx` |

#### Lists & Collections
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassTreeView** | 🎯 | | | `data-display/GlassTreeView.tsx` |
| **GlassKanban** | 🎯 | | | `data-display/GlassKanban.tsx` |
| **GlassTimeline** | 🎯 | | | `data-display/GlassTimeline.tsx` |
| **GlassAccordion** | 🎯 | ⌨️ | ⚡ | `data-display/GlassAccordion.tsx` |
| **GlassAccordionUI** | | | | `ui-components/GlassAccordionUI.tsx` |

#### Badges & Chips
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassBadge** | 🎯 | | ⚡ | `data-display/GlassBadge.tsx` |
| **GlassBadgeLine** | 🎯 | | | `data-display/GlassBadgeLine.tsx` |
| **GlassChip** | 🎯 | ⌨️ | | `data-display/GlassChip.tsx` |
| **GlassMetricChip** | | | | `data-display/GlassMetricChip.tsx` |

#### Avatars & Indicators
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassAvatar** | 🎯 | | | `data-display/GlassAvatar.tsx` |
| **GlassAvatarGroup** | 🎯 | | | `interactive/GlassAvatarGroup.tsx` |
| **GlassStatusDot** | 🎯 | | | `data-display/GlassStatusDot.tsx` |
| **GlassConnectionStatus** | 🎯 | | | `status/GlassConnectionStatus.tsx` |

#### Progress & Feedback
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassProgress** | 🎯 | | | `data-display/GlassProgress.tsx` |
| **GlassAlert** | 🎯 | | ⚡ | `data-display/GlassAlert.tsx` |
| **GlassToast** | | | | `data-display/GlassToast.tsx` |
| **GlassNotificationCenter** | 🎯 | | | `data-display/GlassNotificationCenter.tsx` |
| **GlassLoadingSkeleton** | 🎯 | | | `data-display/GlassLoadingSkeleton.tsx` |
| **GlassSkeleton** | 🎯 | | | `data-display/GlassSkeleton.tsx` |
| **GlassSkeletonLoader** | | | | `data-display/GlassSkeletonLoader.tsx` |

#### Other Display
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassDivider** | 🎯 | | | `data-display/GlassDivider.tsx` |
| **GlassAnimatedNumber** | 🎯 | | | `data-display/GlassAnimatedNumber.tsx` |
| **GlassSparkline** | | | | `data-display/GlassSparkline.tsx` |
| **GlassHeatmap** | | | ⚡ | `data-display/GlassHeatmap.tsx` |
| **GlassGanttChart** | | | | `data-display/GlassGanttChart.tsx` |
| **GlassDiffViewer** | | | | `data-display/GlassDiffViewer.tsx` |
| **GlassJSONViewer** | | | | `data-display/GlassJSONViewer.tsx` |
| **GlassSchemaViewer** | | | | `data-display/GlassSchemaViewer.tsx` |
| **GlassMetricsGrid** | | | | `data-display/GlassMetricsGrid.tsx` |
| **Typography** | | | | `data-display/Typography.tsx` |

**Key Features:**
- Comprehensive data table solutions
- Card variants for different use cases
- Rich list and collection components
- Good ARIA coverage (65%)
- Inconsistent focus management (39%)

**Best Practices Reference:** GlassAccordion, GlassCardLink, GlassDataGrid

---

## NAVIGATION COMPONENTS

### Navigation UI Elements (23 total)

#### Tabs & Tab Systems
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassTabs** | 🎯 | ⌨️ | | `navigation/GlassTabs.tsx` |
| **GlassTabBar** | 🎯 | ⌨️ | ⚡ | `navigation/GlassTabBar.tsx` |
| **GlassTabItem** | 🎯 | ⌨️ | ⚡ | `navigation/GlassTabItem.tsx` |
| **EnhancedGlassTabs** | 🎯 | ⌨️ | ⚡ | `navigation/EnhancedGlassTabs.tsx` |

#### Menus & Commands
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassMenubar** | | ⌨️ | | `navigation/GlassMenubar.tsx` |
| **GlassDropdownMenu** | | | | `navigation/GlassDropdownMenu.tsx` |
| **GlassContextMenu** | | | ⚡ | `navigation/GlassContextMenu.tsx` |
| **GlassCommandBar** | 🎯 | | ⚡ | `navigation/GlassCommandBar.tsx` |
| **CollapsedMenu** | 🎯 | ⌨️ | ⚡ | `navigation/components/CollapsedMenu.tsx` |

#### Navigation & Layout
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassNavigation** | 🎯 | ⌨️ | ⚡ | `navigation/GlassNavigation.tsx` |
| **GlassSidebar** | 🎯 | | | `navigation/GlassSidebar.tsx` |
| **GlassHeader** | 🎯 | ⌨️ | | `navigation/GlassHeader.tsx` |
| **GlassBottomNav** | 🎯 | ⌨️ | ⚡ | `navigation/GlassBottomNav.tsx` |
| **GlassMobileNav** | 🎯 | | | `navigation/GlassMobileNav.tsx` |
| **GlassResponsiveNav** | 🎯 | | ⚡ | `navigation/GlassResponsiveNav.tsx` |
| **GlassToolbar** | 🎯 | | ⚡ | `navigation/GlassToolbar.tsx` |

#### Pagination & Breadcrumbs
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassBreadcrumb** | 🎯 | | ⚡ | `navigation/GlassBreadcrumb.tsx` |
| **GlassPagination** | 🎯 | | | `navigation/GlassPagination.tsx` |
| **GlassSegmentedControl** | 🎯 | | ⚡ | `navigation/GlassSegmentedControl.tsx` |
| **GlassNavigationMenu** | 🎯 | | | `navigation/GlassNavigationMenu.tsx` |

#### Utilities
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **HeaderUserMenu** | | | | `navigation/HeaderUserMenu.tsx` |
| **ScrollButtons** | | | | `navigation/components/ScrollButtons.tsx` |

**Key Features:**
- Excellent ARIA support (91%)
- Strong focus management (74%)
- Good reduced motion support (61%)
- Comprehensive navigation solutions
- **BEST CATEGORY FOR ACCESSIBILITY** - Use as reference

**Best Practices Reference:** GlassNavigation, GlassTabBar, EnhancedGlassTabs, CollapsedMenu

---

## BUTTON COMPONENTS

### Button Variations & Groups (10 total)

| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassButton** | 🎯 | | | `button/GlassButton.tsx` |
| **EnhancedGlassButton** | | | | `button/EnhancedGlassButton.tsx` |
| **GlassFab** | 🎯 | | | `button/GlassFab.tsx` |
| **GlassMagneticButton** | | | ⚡ | `button/GlassMagneticButton.tsx` |
| **SpeedDial** | 🎯 | ⌨️ | ⚡ | `speed-dial/SpeedDial.tsx` |
| **SpeedDialAction** | 🎯 | ⌨️ | ⚡ | `speed-dial/SpeedDialAction.tsx` |
| **SpeedDialIcon** | | | ⚡ | `speed-dial/SpeedDialIcon.tsx` |
| **ToggleButton** | 🎯 | | | `toggle-button/ToggleButton.tsx` |
| **ToggleButtonGroup** | | | | `toggle-button/ToggleButtonGroup.tsx` |
| **RippleButton** | 🎯 | ⌨️ | ⚡ | `visual-feedback/RippleButton.tsx` |

**Key Features:**
- Standard and specialized button types
- FAB and SpeedDial for mobile
- Toggle buttons for state selection
- Good ARIA (70%) but weak focus (10%)
- Motion support (40%)

**Best Practices Reference:** SpeedDialAction, RippleButton (full accessibility)

---

## CHART COMPONENTS

### Data Visualization (18 total)

#### Main Charts
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassBarChart** | 🎯 | ⌨️ | | `charts/GlassBarChart.tsx` |
| **GlassLineChart** | 🎯 | ⌨️ | | `charts/GlassLineChart.tsx` |
| **GlassAreaChart** | 🎯 | ⌨️ | | `charts/GlassAreaChart.tsx` |
| **GlassPieChart** | | | | `charts/GlassPieChart.tsx` |
| **GlassChart** | 🎯 | | ⚡ | `charts/GlassChart.tsx` |
| **GlassDataChart** | 🎯 | | ⚡ | `charts/GlassDataChart.tsx` |
| **ModularGlassDataChart** | 🎯 | | ⚡ | `charts/ModularGlassDataChart.tsx` |

#### Chart Components
| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **ChartContainer** | | | | `charts/components/ChartContainer.tsx` |
| **ChartLegend** | | | | `charts/components/ChartLegend.tsx` |
| **ChartTooltip** | | | | `charts/components/ChartTooltip.tsx` |
| **ChartGrid** | | | | `charts/components/ChartGrid.tsx` |
| **ChartAxis** | | | | `charts/components/ChartAxis.tsx` |
| **ChartFilters** | | | | `charts/components/ChartFilters.tsx` |
| **ChartRenderer** | | | | `charts/components/ChartRenderer.tsx` |
| **AtmosphericEffects** | | | | `charts/components/AtmosphericEffects.tsx` |
| **KpiChart** | | | | `charts/components/KpiChart.tsx` |

**Key Features:**
- Various chart types (bar, line, area, pie)
- Modular and data-focused variants
- Moderate ARIA support (56%)
- Weak focus management (33%)
- Needs accessibility improvements

**Best Practices Reference:** GlassLineChart, GlassAreaChart, GlassBarChart

---

## MODAL COMPONENTS

### Modals, Dialogs & Overlays (7 total)

| Component | ARIA | Focus | Motion | Path |
|-----------|------|-------|--------|------|
| **GlassModal** | 🎯 | ⌨️ | | `modal/GlassModal.tsx` |
| **GlassDialog** | 🎯 | | | `modal/GlassDialog.tsx` |
| **GlassDrawer** | 🎯 | ⌨️ | | `modal/GlassDrawer.tsx` |
| **GlassBottomSheet** | 🎯 | ⌨️ | ⚡ | `modal/GlassBottomSheet.tsx` |
| **GlassPopover** | | ⌨️ | | `modal/GlassPopover.tsx` |
| **GlassHoverCard** | 🎯 | | ⚡ | `modal/GlassHoverCard.tsx` |
| **GlassTooltip** | 🎯 | | ⚡ | `modal/GlassTooltip.tsx` |

**Key Features:**
- Excellent ARIA support (86%)
- Mixed focus management (57%)
- Some motion support (29%)
- Complete modal solution set
- Critical for overlay interactions

**Best Practices Reference:** GlassBottomSheet, GlassModal, GlassDrawer

---

## MISCELLANEOUS COMPONENTS

### Advanced & Specialized (195 components - 54.8%)

This category includes advanced, specialized, and utility components that don't fit standard UI categories.

#### Categories Within Miscellaneous

**Accessibility & Providers (5)**
- AccessibilityProvider, ContrastGuard, GlassA11y, GlassFocusIndicators, GlassErrorBoundary

**Advanced Features (34)**
- AI Integration, Biometric Adaptation, Context Awareness, Eye Tracking, Liquid Transitions, Mesh Gradients, Neuro Sync, Orientation Effects, Parallax Layers, Particles, Performance Optimization, Quantum States, Reactions, Self-Healing Systems, Spatial Audio, WebGL Shaders, etc.

**AI/ML Components (8)**
- AIGlassThemeProvider, GlassDeepDreamGlass, GlassGANGenerator, GlassGenerativeArt, GlassIntelligentFormBuilder, GlassLiveFilter, GlassMusicVisualizer, GlassStyleTransfer, ProductionAIIntegration

**Animations & Effects (8)**
- AdvancedAnimations, GlassMotionController, GlassTransitions, OrganicAnimationEngine, ARGlassEffects, SeasonalParticles, GlassShatterEffects, Glass3DEngine

**Immersive & AR (6)**
- Glass360Viewer, GlassARPreview, GlassFluidSimulation, GlassHologram, GlassParticleField, GlassVortexPortal

**Collaboration & Social (10)**
- CollaborativeGlassWorkspace, GlassCollaborationProvider, GlassCollaborationDashboard, GlassCollaborativeComments, GlassCollaborativeCursor, GlassPresenceIndicator, GlassReactionBubbles, GlassSharedWhiteboard, GlassSocialFeed, GlassVoiceWaveform

**Interactive Tools (50+)**
- Advanced search, Carousels, Chat, Code editors, Command palettes, Color tools, Component playgrounds, Draggable, Drawing canvas, File explorers, Filter panels, Form builders, Galleries, Gesture zones, Image viewers, Infinite scroll, Inline editing, Kanban boards, Key-value editors, Lazy image loading, Mention lists, Mind maps, Pattern builders, Query builders, Reaction bars, Spotlight search, Stepper variants, Tag input, Video player, Virtual lists, Voice input, Whiteboards

**CMS & Page Building (7)**
- GlassCanvas, GlassComponentPalette, GlassDragDropProvider, GlassPageBuilder, GlassPageStructure, GlassPropertyPanel, GlassDetailView

**Media & Visualization (8)**
- GlassAdvancedAudioPlayer, GlassAdvancedVideoPlayer, GlassMediaProvider, GlassImageProcessingProvider, GlassIntelligentImageUploader, GlassAdvancedDataViz, ParticleBackground, AtmosphericBackground

**Dashboard & Analytics (8)**
- GlassDashboard, GlassActivityFeed, GlassChartWidget, DimensionalDashboardContainer, GlassMetricCard, GlassStatCard, GlassKPICard, Widgets

**Surfaces & Backgrounds (6)**
- DimensionalGlass, FrostedGlass, HeatGlass, PageGlassContainer, WidgetGlass, GlassDynamicAtmosphere

**Quantum & Physics (6)**
- GlassQuantumTunnel, GlassCoherenceIndicator, GlassProbabilityCloud, GlassSuperpositionalMenu, GlassQuantumField, GlassWaveFunction

**Ecommerce (4)**
- GlassEcommerceProvider, GlassProductRecommendations, GlassSmartShoppingCart, BrandColorIntegration

**Miscellaneous Utilities (40+)**
- Cookie consent, Editor, Experiential components, Houdini-based cards, Icons, Layouts, Mobile optimization, Search interfaces, Speed dial, UI components, Visual feedback, Website components, and many more

**ARIA Coverage:** 23.1% (45 components) - Needs improvement
**Focus Coverage:** 16.9% (33 components) - Significant gaps
**Motion Coverage:** 26.2% (51 components) - Moderate

---

## Summary Statistics

### Accessibility by Category

| Category | Total | ARIA % | Focus % | Motion % | Overall |
|----------|-------|--------|---------|----------|---------|
| 🏆 Navigation | 23 | 91% | 74% | 61% | ⭐⭐⭐⭐ |
| 🥈 Layout | 21 | 81% | 48% | 62% | ⭐⭐⭐⭐ |
| 🥉 Modal | 7 | 86% | 57% | 29% | ⭐⭐⭐ |
| Data Display | 46 | 65% | 39% | 30% | ⭐⭐⭐ |
| Form | 36 | 61% | 50% | 25% | ⭐⭐⭐ |
| Chart | 18 | 56% | 33% | 28% | ⭐⭐ |
| Button | 10 | 70% | 10% | 40% | ⭐⭐ |
| Misc | 195 | 23% | 17% | 26% | ⭐ |

### Overall Library Statistics

- **Total Components:** 356
- **TypeScript Coverage:** 100% ✅
- **Average ARIA Coverage:** 38.5%
- **Average Focus Coverage:** 20.2%
- **Average Motion Coverage:** 29.8%
- **ContrastGuard Integration:** 0.3% ❌

---

## Navigation Tips

- **Need a grid layout?** → GlassGrid (layout)
- **Need a data table?** → GlassDataTable or GlassDataGrid (data-display)
- **Need tabs?** → EnhancedGlassTabs or GlassTabBar (navigation)
- **Need form inputs?** → GlassInput, GlassSelect, GlassCheckbox (form)
- **Need a button?** → GlassButton or SpeedDialAction (button)
- **Need a chart?** → GlassLineChart, GlassBarChart, GlassAreaChart (chart)
- **Need a modal?** → GlassModal, GlassDrawer, or GlassBottomSheet (modal)
- **Need something advanced?** → Check miscellaneous for specialized components

---

Generated: November 7, 2025  
AuraGlass Library - Comprehensive Component Reference

