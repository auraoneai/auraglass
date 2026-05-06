# LiquidUpgrade.md

## Objective

Create a complete Aura Liquid Glass upgrade plan that converts the current glassmorphism library into a structured Liquid Glass design system. The work is split into implementation prompts that can be handed to engineers or agents one at a time.

This upgrade should follow these principles:

- Liquid Glass is a functional layer for navigation, controls, presentations, and temporary interactive surfaces.
- Do not apply Liquid Glass everywhere or turn every content card into glass.
- Prefer shared material containers over stacked glass-on-glass layers.
- Use `regular` Liquid Glass as the default adaptive material.
- Use `clear` Liquid Glass only over media-rich content, with local dimming and stronger contrast requirements.
- Preserve accessibility, reduced-motion behavior, keyboard navigation, and SSR safety.
- Add stories, tests, and exports for every new public component.

## Current Foundation

The repo already contains these Liquid Glass-related files:

- `src/primitives/LiquidGlassMaterial.tsx`
- `src/components/advanced/LiquidGlassGPU.tsx`
- `src/components/advanced/GlassLiquidTransition.tsx`
- `src/components/accessibility/ContrastGuard.tsx`
- `src/utils/contrastGuard.ts`
- `src/tokens/glass.ts`
- `docs/guides/liquid-glass-migration.md`
- `docs/primitives/liquid-glass-system.md`
- `docs/primitives/liquid-glass-material.md`

The repo also has existing components that should be modernized instead of duplicated:

- `src/components/navigation/GlassToolbar.tsx`
- `src/components/navigation/GlassSidebar.tsx`
- `src/components/navigation/GlassTabBar.tsx`
- `src/components/navigation/GlassSegmentedControl.tsx`
- `src/components/modal/GlassBottomSheet.tsx`
- `src/components/modal/GlassDrawer.tsx`
- `src/components/modal/GlassModal.tsx`
- `src/components/modal/GlassPopover.tsx`
- `src/components/mobile/GlassActionSheet.tsx`
- `src/components/button/GlassButton.tsx`
- `src/components/input/GlassInput.tsx`
- `src/components/input/GlassSlider.tsx`
- `src/components/input/GlassSwitch.tsx`
- `src/components/interactive/GlassCommandPalette.tsx`
- `src/components/search/GlassSpotlightSearch.tsx`

## Global Acceptance Checklist

Every prompt below should satisfy this shared checklist unless explicitly scoped otherwise.

- [ ] Uses repo-native TypeScript, React, tokens, and utility patterns.
- [ ] Adds or updates public exports in the relevant `index.ts` files.
- [ ] Adds focused unit tests for behavior and accessibility.
- [ ] Adds Storybook stories with light, dark, reduced-motion, dense, mobile, and media-rich examples where relevant.
- [ ] Avoids hardcoded color, radius, opacity, blur, z-index, and animation values when existing tokens are available.
- [ ] Uses `useReducedMotion`, `MotionPreferenceContext`, or existing motion settings consistently.
- [ ] Keeps SSR safe by guarding access to `window`, `document`, `ResizeObserver`, `IntersectionObserver`, and device orientation APIs.
- [ ] Adds `aria-*`, roles, focus management, and keyboard behavior for all interactive surfaces.
- [ ] Avoids nested Liquid Glass surfaces unless they are inside a shared Liquid Glass effect group.
- [ ] Adds docs or updates migration docs for public API changes.
- [ ] Runs targeted tests for changed components.

## Prompt 01: Build `LiquidGlassEffectGroup`

### Target Files

Create:

- `src/primitives/LiquidGlassEffectGroup.tsx`
- `src/primitives/LiquidGlassEffectGroup.test.tsx`
- `src/components/primitives/LiquidGlassEffectGroup.stories.tsx`
- `docs/primitives/liquid-glass-effect-group.md`

Update:

- `src/primitives/index.ts`
- `src/index.ts`
- `docs/components/README.md`

### Task

Create a shared Liquid Glass grouping primitive inspired by Apple's `GlassEffectContainer`. It should allow nearby glass shapes to share one sampling region and morph/blend as a group, avoiding inconsistent glass-on-glass rendering.

The component should support:

- `spacing?: number | string`
- `morph?: boolean`
- `samplingStrategy?: "shared" | "isolated" | "auto"`
- `performanceLevel?: "ultra" | "high" | "balanced" | "efficient"`
- `disabled?: boolean`
- `children`
- `className`
- `style`

Implementation notes:

- Provide context for child Liquid Glass surfaces to know they are inside a group.
- Expose a hook named `useLiquidGlassEffectGroup`.
- Add data attributes for testing: `data-liquid-glass-effect-group`, `data-sampling-strategy`.
- Avoid requiring WebGL for baseline behavior.
- Use CSS variables for spacing and morph strength.

### Checklist

- [ ] Children render without changing semantic structure.
- [ ] Grouped children receive shared group context.
- [ ] `disabled` falls back to normal rendering.
- [ ] Reduced motion disables morph animation while preserving visual grouping.
- [ ] Story shows separate glass buttons versus grouped glass buttons.
- [ ] Story shows badge cluster morphing.
- [ ] Tests verify context, data attributes, disabled mode, and reduced-motion behavior.

## Prompt 02: Build `LiquidGlassScrollEdge`

### Target Files

Create:

- `src/primitives/LiquidGlassScrollEdge.tsx`
- `src/primitives/LiquidGlassScrollEdge.test.tsx`
- `src/components/primitives/LiquidGlassScrollEdge.stories.tsx`
- `docs/primitives/liquid-glass-scroll-edge.md`

Update:

- `src/primitives/index.ts`
- `src/index.ts`

### Task

Create a scroll-edge boundary primitive that clarifies where floating Liquid Glass UI overlaps scrollable content. It should support Apple's soft and hard edge concepts without becoming a decorative overlay.

Props:

- `edge?: "top" | "bottom" | "left" | "right"`
- `styleMode?: "soft" | "hard" | "none"`
- `active?: boolean`
- `height?: number | string`
- `targetRef?: React.RefObject<HTMLElement>`
- `observeScroll?: boolean`
- `className`

Behavior:

- Soft edge: gradual blur/fade transition.
- Hard edge: stronger uniform boundary for dense UIs, table headers, inspectors, or macOS-like layouts.
- Only render when `active` or when observed scroll position indicates content underlaps a floating layer.
- Do not block pointer events.

### Checklist

- [ ] Renders nothing or inert state when `styleMode="none"`.
- [ ] Does not intercept clicks.
- [ ] Supports all four edges.
- [ ] Can observe a scroll target safely after mount.
- [ ] Uses tokens and CSS variables for blur, opacity, height, and transition.
- [ ] Stories cover toolbar top edge, bottom tab bar edge, and table header hard edge.
- [ ] Tests cover active/inactive, style modes, and SSR-safe mount.

## Prompt 03: Finish `LiquidGlassBackdropSampler`

### Target Files

Create:

- `src/primitives/LiquidGlassBackdropSampler.tsx`
- `src/hooks/useLiquidGlassBackdrop.ts`
- `src/hooks/useLiquidGlassBackdrop.test.ts`
- `docs/primitives/liquid-glass-backdrop-sampler.md`

Update:

- `src/primitives/LiquidGlassMaterial.tsx`
- `src/utils/contrastGuard.ts`
- `src/components/accessibility/ContrastGuard.tsx`
- `src/primitives/index.ts`
- `src/index.ts`

### Task

Replace placeholder backdrop adaptation with production-ready sampling primitives. The system should estimate luminance, dominant tint, and media richness behind a Liquid Glass surface, then feed those values into contrast and tint decisions.

API:

- `useLiquidGlassBackdrop(ref, options)`
- `LiquidGlassBackdropSampler`
- `sample.luminance`
- `sample.dominantColor`
- `sample.contrastHint`
- `sample.mediaRichness`
- `sample.requiresDimming`

Implementation notes:

- Prefer safe DOM/CSS sampling. If pixel sampling is not possible, fall back to computed styles and theme hints.
- Never throw if canvas, observers, or DOM APIs are unavailable.
- Use throttled updates on scroll, resize, mutation, and theme changes.
- Feed `regular` surfaces to AA contrast rules and `clear` surfaces to AAA-oriented rules.

### Checklist

- [ ] `LiquidGlassMaterial` no longer relies on fixed luminance placeholder values.
- [ ] `clear` variant can request local dimming when contrast is insufficient.
- [ ] ContrastGuard receives real or fallback backdrop data.
- [ ] Sampling is throttled and cleaned up on unmount.
- [ ] Tests cover fallback mode, observer cleanup, contrast handoff, and clear variant dimming.
- [ ] Story shows the same glass over light, dark, image, and colorful backgrounds.

## Prompt 04: Build `LiquidGlassConcentricFrame`

### Target Files

Create:

- `src/primitives/LiquidGlassConcentricFrame.tsx`
- `src/primitives/LiquidGlassConcentricFrame.test.tsx`
- `src/components/primitives/LiquidGlassConcentricFrame.stories.tsx`
- `docs/primitives/liquid-glass-concentric-frame.md`

Update:

- `src/tokens/glass.ts`
- `src/primitives/index.ts`
- `src/index.ts`

### Task

Create a geometry primitive that calculates nested radii using concentric shape rules. This prevents pinched or flared corners when controls sit inside sheets, cards, sidebars, or device/window edges.

Props:

- `radius?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | number`
- `inset?: number`
- `shape?: "concentric" | "capsule" | "rounded-rect" | "fixed"`
- `fallbackRadius?: number`
- `asChild?: boolean`
- `children`

### Checklist

- [ ] Outputs CSS variables for parent radius, inset, and computed child radius.
- [ ] Capsule mode uses half-height logic where CSS allows it.
- [ ] Fixed mode preserves exact radius.
- [ ] Supports `asChild` without invalid DOM nesting.
- [ ] Stories show nested toolbar, sheet button row, media controls, and dense macOS inspector controls.
- [ ] Tests cover radius calculation and CSS variable output.

## Prompt 05: Build `LiquidGlassLayerProvider`

### Target Files

Create:

- `src/primitives/LiquidGlassLayerProvider.tsx`
- `src/primitives/LiquidGlassLayerProvider.test.tsx`
- `docs/primitives/liquid-glass-layer-provider.md`

Update:

- `src/primitives/LiquidGlassMaterial.tsx`
- `src/primitives/index.ts`
- `src/index.ts`

### Task

Create a policy provider that coordinates Liquid Glass depth, variant choice, nested layer warnings, performance level, and accessibility behavior.

Context should include:

- current layer depth
- whether the current subtree is inside a Liquid Glass surface
- current material variant
- performance level
- reduced-motion state
- contrast policy
- grouping state

Behavior:

- Warn in development when a Liquid Glass surface is nested directly inside another without `LiquidGlassEffectGroup`.
- Allow explicit overrides for advanced cases.
- Provide helper hook `useLiquidGlassLayer`.

### Checklist

- [ ] Direct nested glass warns in development only.
- [ ] Grouped glass does not warn.
- [ ] `LiquidGlassMaterial` consumes provider defaults.
- [ ] Tests cover nested, grouped, and override behavior.
- [ ] Docs explain when nesting is allowed.

## Prompt 06: Modernize `GlassToolbar` Into `LiquidGlassToolbar`

### Target Files

Create:

- `src/components/navigation/LiquidGlassToolbar.tsx`
- `src/components/navigation/LiquidGlassToolbar.test.tsx`
- `src/components/navigation/LiquidGlassToolbar.stories.tsx`
- `docs/components/navigation/liquid-glass-toolbar.md`

Update:

- `src/components/navigation/GlassToolbar.tsx`
- `src/components/navigation/index.ts`
- `src/index.ts`

### Task

Create a modern Liquid Glass toolbar while keeping `GlassToolbar` backward compatible. The new toolbar should support grouped bar items, standalone primary actions, monochrome icons, badges, scroll-edge integration, and density modes.

Props:

- `left`, `center`, `right`
- `groups?: LiquidGlassToolbarGroup[]`
- `floating?: boolean`
- `sticky?: boolean`
- `scrollEdge?: "soft" | "hard" | false`
- `density?: "compact" | "comfortable" | "spacious"`
- `primaryActionId?: string`
- `materialVariant?: "regular" | "clear"`

### Checklist

- [ ] Uses `LiquidGlassEffectGroup` for grouped toolbar items.
- [ ] Uses `LiquidGlassScrollEdge` only when floating/sticky over scroll content.
- [ ] Primary action can be tinted for meaning, not decoration.
- [ ] Icon-only items require accessible labels.
- [ ] Avoids mixing text and symbol actions inside a single ambiguous group.
- [ ] Stories show iOS-style bottom toolbar, desktop top toolbar, dense toolbar, and scrolling content.
- [ ] Existing `GlassToolbar` tests still pass.

## Prompt 07: Modernize `GlassSidebar` Into `LiquidGlassInsetSidebar`

### Target Files

Create:

- `src/components/navigation/LiquidGlassInsetSidebar.tsx`
- `src/components/navigation/LiquidGlassInsetSidebar.test.tsx`
- `src/components/navigation/LiquidGlassInsetSidebar.stories.tsx`
- `docs/components/navigation/liquid-glass-inset-sidebar.md`

Update:

- `src/components/navigation/GlassSidebar.tsx`
- `src/components/navigation/index.ts`
- `src/index.ts`

### Task

Create an inset floating sidebar that lets content flow behind it while preserving legibility and navigation hierarchy.

Props:

- `items`
- `selectedId`
- `onSelect`
- `placement?: "left" | "right"`
- `collapsible?: boolean`
- `collapsed?: boolean`
- `backgroundExtension?: boolean`
- `scrollEdge?: "soft" | "hard" | false`
- `materialVariant?: "regular" | "clear"`

### Checklist

- [ ] Sidebar is inset from window/content edges by default.
- [ ] Content can visually extend behind the sidebar.
- [ ] Text and controls are always layered above distortion.
- [ ] Keyboard navigation works through all items.
- [ ] Collapsed mode keeps icons and labels accessible.
- [ ] Stories show iPad split view, Mac wide canvas, and mobile collapsed behavior.

## Prompt 08: Modernize `GlassTabBar` Into `LiquidGlassTabBar`

### Target Files

Create:

- `src/components/navigation/LiquidGlassTabBar.tsx`
- `src/components/navigation/LiquidGlassTabBar.test.tsx`
- `src/components/navigation/LiquidGlassTabBar.stories.tsx`
- `src/components/navigation/LiquidGlassBottomAccessory.tsx`
- `src/components/navigation/LiquidGlassBottomAccessory.test.tsx`
- `src/components/navigation/LiquidGlassBottomAccessory.stories.tsx`
- `docs/components/navigation/liquid-glass-tab-bar.md`

Update:

- `src/components/navigation/GlassTabBar.tsx`
- `src/components/navigation/index.ts`
- `src/index.ts`

### Task

Create a floating tab bar that can minimize on scroll, host a persistent bottom accessory, and support a dedicated search tab role.

Props:

- `tabs`
- `activeTab`
- `onChange`
- `minimizeBehavior?: "never" | "on-scroll-down" | "on-scroll" | "auto"`
- `searchTabId?: string`
- `bottomAccessory?: React.ReactNode`
- `accessoryPlacement?: "above" | "collapsed" | "auto"`
- `scrollTargetRef?: React.RefObject<HTMLElement>`
- `materialVariant?: "regular" | "clear"`

### Checklist

- [ ] Tab bar floats above content with proper scroll-edge boundary.
- [ ] Minimized mode preserves selected state and accessibility.
- [ ] Search tab can replace tab bar with search field behavior.
- [ ] Bottom accessory can collapse into the tab bar area.
- [ ] Reduced motion disables animated collapse while preserving state.
- [ ] Stories show mobile tab bar, search tab, mini-player accessory, and desktop adaptation.

## Prompt 09: Add `LiquidGlassSearchField` And `LiquidGlassSearchTab`

### Target Files

Create:

- `src/components/search/LiquidGlassSearchField.tsx`
- `src/components/search/LiquidGlassSearchField.test.tsx`
- `src/components/search/LiquidGlassSearchField.stories.tsx`
- `src/components/search/LiquidGlassSearchTab.tsx`
- `src/components/search/LiquidGlassSearchTab.test.tsx`
- `src/components/search/LiquidGlassSearchTab.stories.tsx`
- `docs/components/search/liquid-glass-search.md`

Update:

- `src/components/search/GlassSpotlightSearch.tsx`
- `src/components/search/index.ts`
- `src/index.ts`

### Task

Create adaptive search components that follow Liquid Glass placement patterns.

`LiquidGlassSearchField` should support:

- `placement?: "bottom" | "top-trailing" | "center" | "auto"`
- `minimized?: boolean`
- `onMinimizedChange`
- `suggestions`
- `results`
- `scope`

`LiquidGlassSearchTab` should support:

- replacing tab bar with search field when active
- suggestion-first browsing
- keyboard navigation
- grouped results

### Checklist

- [ ] iPhone-sized story places search at bottom.
- [ ] iPad/Mac-sized story places search top-trailing or centered.
- [ ] Minimized search opens into full-width search.
- [ ] Results use listbox or combobox semantics as appropriate.
- [ ] `Escape`, arrows, and `Enter` behavior is tested.
- [ ] Existing spotlight search remains backward compatible.

## Prompt 10: Add `LiquidGlassSourceTransition`

### Target Files

Create:

- `src/primitives/LiquidGlassSourceTransition.tsx`
- `src/primitives/LiquidGlassSourceTransition.test.tsx`
- `src/components/primitives/LiquidGlassSourceTransition.stories.tsx`
- `docs/primitives/liquid-glass-source-transition.md`

Update:

- `src/components/advanced/GlassLiquidTransition.tsx`
- `src/primitives/index.ts`
- `src/index.ts`

### Task

Create a source/destination transition primitive that lets buttons morph into sheets, popovers, dialogs, menus, inspectors, or badge clusters.

API:

- `LiquidGlassTransitionProvider`
- `LiquidGlassSource`
- `LiquidGlassDestination`
- `useLiquidGlassTransition`

Props:

- `id`
- `namespace`
- `disabled`
- `duration`
- `spring`
- `respectReducedMotion`

### Checklist

- [ ] Source and destination can be in different DOM subtrees.
- [ ] Reduced motion uses fade/instant fallback.
- [ ] Works with portals.
- [ ] Does not steal focus during transition.
- [ ] Stories show toolbar button to sheet, badge to cluster, and menu source anchoring.

## Prompt 11: Modernize `GlassActionSheet`

### Target Files

Update:

- `src/components/mobile/GlassActionSheet.tsx`
- `src/components/mobile/GlassActionSheet.test.tsx`
- `src/components/mobile/GlassActionSheet.stories.tsx`

Create:

- `docs/components/mobile/liquid-glass-action-sheet.md`

### Task

Modernize the existing action sheet so it can spring from the control that triggered it, support dimmed interruptive mode, and support parallel floating mode without dimming.

Props to add:

- `material?: "glass" | "liquid"`
- `sourceId?: string`
- `presentationMode?: "interruptive" | "parallel"`
- `sourceTransition?: boolean`
- `localDimming?: boolean`

### Checklist

- [ ] Existing API still works.
- [ ] Liquid mode uses `LiquidGlassMaterial`.
- [ ] Source transition works when `sourceId` is provided.
- [ ] Interruptive mode includes dimming and focus trap.
- [ ] Parallel mode avoids full-screen dimming.
- [ ] Keyboard dismissal and screen reader announcement work.

## Prompt 12: Modernize `GlassBottomSheet`, `GlassDrawer`, And `GlassModal`

### Target Files

Update:

- `src/components/modal/GlassBottomSheet.tsx`
- `src/components/modal/GlassBottomSheet.test.tsx`
- `src/components/modal/GlassBottomSheet.stories.tsx`
- `src/components/modal/GlassDrawer.tsx`
- `src/components/modal/GlassDrawer.test.tsx`
- `src/components/modal/GlassDrawer.stories.tsx`
- `src/components/modal/GlassModal.tsx`
- `src/components/modal/GlassModal.test.tsx`
- `src/components/modal/GlassModal.stories.tsx`
- `src/components/modal/GlassModal.liquid.stories.tsx`

Create:

- `src/components/modal/LiquidGlassAdaptiveSheet.tsx`
- `src/components/modal/LiquidGlassAdaptiveSheet.test.tsx`
- `src/components/modal/LiquidGlassAdaptiveSheet.stories.tsx`
- `docs/components/modal/liquid-glass-adaptive-sheet.md`

### Task

Modernize modal surfaces around Liquid Glass behavior:

- partial-height sheets are inset by default
- full-height sheets become more opaque and edge-anchored
- source-based transitions are supported
- local dimming is applied when needed
- focus management is consistent

### Checklist

- [ ] Existing modal APIs remain compatible.
- [ ] `material="liquid"` works consistently across modal, drawer, and bottom sheet.
- [ ] Partial sheet has inset rounded/concentric bottom or top geometry.
- [ ] Full-height state becomes more opaque and anchored.
- [ ] Clear variant enforces dimming/contrast requirements.
- [ ] Focus trap and restore-focus behavior are tested.
- [ ] Reduced motion disables sheet morphing.

## Prompt 13: Modernize `GlassPopover` And Menus

### Target Files

Update:

- `src/components/modal/GlassPopover.tsx`
- `src/components/modal/GlassPopover.test.tsx`
- `src/components/modal/GlassPopover.stories.tsx`
- `src/components/navigation/GlassDropdownMenu.tsx`
- `src/components/navigation/GlassContextMenu.tsx`
- `src/components/navigation/GlassMenubar.tsx`

Create:

- `src/components/modal/LiquidGlassPopoverMenu.tsx`
- `src/components/modal/LiquidGlassPopoverMenu.test.tsx`
- `src/components/modal/LiquidGlassPopoverMenu.stories.tsx`
- `docs/components/modal/liquid-glass-popover-menu.md`

### Task

Create a Liquid Glass popover/menu surface with source anchoring, leading icons, text labels, selection indicator, trailing accessory slot, and consistent keyboard behavior.

### Checklist

- [ ] Popover can morph from source control.
- [ ] Menu rows support icon, label, shortcut/accessory, checked/selected state, disabled state.
- [ ] Menus use roving tabindex.
- [ ] `Escape`, arrows, `Home`, `End`, `Enter`, and typeahead are tested.
- [ ] Clear variant is blocked or warned unless media-rich + dimming conditions are met.

## Prompt 14: Add `LiquidGlassInspectorPanel`

### Target Files

Create:

- `src/components/navigation/LiquidGlassInspectorPanel.tsx`
- `src/components/navigation/LiquidGlassInspectorPanel.test.tsx`
- `src/components/navigation/LiquidGlassInspectorPanel.stories.tsx`
- `docs/components/navigation/liquid-glass-inspector-panel.md`

Update:

- `src/components/navigation/index.ts`
- `src/index.ts`

### Task

Create an iPad/Mac-style inspector panel for related detail and editing workflows. It should feel like a parallel surface associated with current selection, not a generic modal.

Props:

- `open`
- `onOpenChange`
- `title`
- `selectionLabel`
- `placement?: "right" | "left" | "bottom"`
- `resizable?: boolean`
- `sections`
- `materialVariant?: "regular" | "clear"`

### Checklist

- [ ] Panel supports keyboard close and focus management.
- [ ] Panel can be resizable on desktop.
- [ ] Uses hard scroll edge for pinned section headers when needed.
- [ ] Stories show editor inspector, data-grid inspector, and media metadata inspector.

## Prompt 15: Modernize `GlassButton` And `EnhancedGlassButton`

### Target Files

Update:

- `src/components/button/GlassButton.tsx`
- `src/components/button/GlassButton.test.tsx`
- `src/components/button/GlassButton.stories.tsx`
- `src/components/button/EnhancedGlassButton.tsx`
- `src/components/button/EnhancedGlassButton.test.tsx`
- `src/components/button/EnhancedGlassButton.stories.tsx`

Create:

- `src/components/button/LiquidGlassButtonStyle.tsx`
- `src/components/button/LiquidGlassButtonStyle.test.tsx`
- `src/components/button/LiquidGlassButtonStyle.stories.tsx`
- `docs/components/button/liquid-glass-button-style.md`

### Task

Modernize buttons to support Apple's glass and glass-prominent button concepts without replacing the existing API.

Required behavior:

- Capsule by default for touch-friendly controls.
- Rounded rectangle for compact/dense desktop controls.
- XL prominent action support.
- Tint only when conveying meaning or primary action.
- Interactive illumination, press density, and shimmer.
- Reduced motion disables bounce/shimmer.

### Checklist

- [ ] `material="liquid"` remains backward compatible.
- [ ] `size="xl"` or equivalent is available.
- [ ] Icon-only buttons require labels.
- [ ] Loading/disabled/focus states remain accessible.
- [ ] Button groups can opt into `LiquidGlassEffectGroup`.
- [ ] Stories cover regular, prominent, clear over media, compact desktop, and reduced motion.

## Prompt 16: Add `LiquidGlassControlGroup`

### Target Files

Create:

- `src/components/input/LiquidGlassControlGroup.tsx`
- `src/components/input/LiquidGlassControlGroup.test.tsx`
- `src/components/input/LiquidGlassControlGroup.stories.tsx`
- `docs/components/input/liquid-glass-control-group.md`

Update:

- `src/components/input/index.ts`
- `src/index.ts`

### Task

Create a shared material group for related controls: segmented buttons, icon clusters, view switchers, toolbar groups, and compact inspectors.

Props:

- `orientation?: "horizontal" | "vertical"`
- `density?: "compact" | "comfortable" | "spacious"`
- `selectionMode?: "none" | "single" | "multiple"`
- `rovingFocus?: boolean`
- `materialVariant?: "regular" | "clear"`

### Checklist

- [ ] Uses `LiquidGlassEffectGroup`.
- [ ] Supports roving tabindex.
- [ ] Supports disabled children.
- [ ] Stories show toolbar actions, segmented picker, inspector toggles, and floating map controls.

## Prompt 17: Modernize `GlassSegmentedControl`

### Target Files

Update:

- `src/components/navigation/GlassSegmentedControl.tsx`
- `src/components/navigation/GlassSegmentedControl.test.tsx`
- `src/components/navigation/GlassSegmentedControl.stories.tsx`

Create:

- `src/components/navigation/LiquidGlassSegmentedControl.tsx`
- `src/components/navigation/LiquidGlassSegmentedControl.test.tsx`
- `src/components/navigation/LiquidGlassSegmentedControl.stories.tsx`
- `docs/components/navigation/liquid-glass-segmented-control.md`

### Task

Create a Liquid Glass segmented control with shared material, morphing selection indicator, concentric geometry, and keyboard support.

### Checklist

- [ ] Existing segmented control remains compatible.
- [ ] Selection indicator morphs within group.
- [ ] Roving tabindex works.
- [ ] `aria-pressed` or tab semantics are chosen correctly based on mode.
- [ ] Reduced motion removes morph animation.

## Prompt 18: Modernize `GlassSlider`

### Target Files

Update:

- `src/components/input/GlassSlider.tsx`
- `src/components/input/GlassSlider.test.tsx`
- `src/components/input/GlassSlider.stories.tsx`

Create:

- `docs/components/input/liquid-glass-slider.md`

### Task

Modernize the slider to support Liquid Glass interaction states, tick marks, manual ticks, neutral fill origin, and reduced-motion behavior.

Props to add:

- `material?: "glass" | "liquid"`
- `ticks?: boolean | Array<number | { value: number; label?: string }>`
- `neutralValue?: number`
- `showTickLabels?: boolean`
- `interactionGlass?: boolean`

### Checklist

- [ ] Keyboard behavior remains correct.
- [ ] `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and labels are present.
- [ ] Tick marks render with tokenized styling.
- [ ] Neutral value changes fill origin.
- [ ] Liquid interaction state is transient and motion-safe.

## Prompt 19: Modernize `GlassSwitch` And `GlassToggle`

### Target Files

Update:

- `src/components/input/GlassSwitch.tsx`
- `src/components/input/GlassSwitch.test.tsx`
- `src/components/input/GlassSwitch.stories.tsx`
- `src/components/input/GlassToggle.tsx`
- `src/components/input/GlassToggle.test.tsx`
- `src/components/input/GlassToggle.stories.tsx`

Create:

- `docs/components/input/liquid-glass-switch-toggle.md`

### Task

Modernize switch and toggle controls so active interaction uses transient Liquid Glass, capsule geometry, and clear state semantics.

### Checklist

- [ ] Uses correct `role="switch"` and `aria-checked` where appropriate.
- [ ] Focus ring is visible on all backgrounds.
- [ ] Disabled state is clear and noninteractive.
- [ ] Reduced motion disables thumb bounce.
- [ ] Stories show normal, dense, prominent, error/warning, and reduced-motion states.

## Prompt 20: Add `LiquidGlassBadgeCluster`

### Target Files

Create:

- `src/components/data-display/LiquidGlassBadgeCluster.tsx`
- `src/components/data-display/LiquidGlassBadgeCluster.test.tsx`
- `src/components/data-display/LiquidGlassBadgeCluster.stories.tsx`
- `docs/components/data-display/liquid-glass-badge-cluster.md`

Update:

- `src/components/data-display/GlassBadge.tsx`
- `src/components/data-display/GlassChip.tsx`
- `src/components/data-display/index.ts`
- `src/index.ts`

### Task

Create grouped badges/chips that share one Liquid Glass effect and morph between collapsed and expanded states.

Props:

- `items`
- `expanded`
- `onExpandedChange`
- `maxCollapsed`
- `selectionMode`
- `materialVariant`

### Checklist

- [ ] Collapsed state preserves count and accessible names.
- [ ] Expanded state supports keyboard navigation.
- [ ] Uses `LiquidGlassEffectGroup`.
- [ ] Reduced motion uses opacity/instant layout instead of morph.
- [ ] Stories show achievement badges, filters, reactions, and status chips.

## Prompt 21: Add `LiquidGlassMediaControls`

### Target Files

Create:

- `src/components/media/LiquidGlassMediaControls.tsx`
- `src/components/media/LiquidGlassMediaControls.test.tsx`
- `src/components/media/LiquidGlassMediaControls.stories.tsx`
- `docs/components/media/liquid-glass-media-controls.md`

Update:

- `src/components/media/index.ts`
- `src/index.ts`

### Task

Create media controls that demonstrate correct `clear` Liquid Glass use over media-rich content. Include local dimming and bold/bright foreground controls.

Props:

- `playing`
- `onPlayPause`
- `currentTime`
- `duration`
- `volume`
- `onSeek`
- `onVolumeChange`
- `variant?: "regular" | "clear"`
- `localDimming?: boolean`
- `compact?: boolean`

### Checklist

- [ ] Clear variant requires local dimming by default.
- [ ] Controls remain legible over bright, dark, and colorful media.
- [ ] Keyboard media control behavior is supported.
- [ ] Reduced motion disables shimmer/animated reflections.
- [ ] Stories show video overlay, audio mini-player, and compact accessory mode.

## Prompt 22: Add `LiquidGlassMapControls`

### Target Files

Create:

- `src/components/interactive/LiquidGlassMapControls.tsx`
- `src/components/interactive/LiquidGlassMapControls.test.tsx`
- `src/components/interactive/LiquidGlassMapControls.stories.tsx`
- `docs/components/interactive/liquid-glass-map-controls.md`

Update:

- `src/components/interactive/index.ts`
- `src/index.ts`

### Task

Create floating map-style control clusters for zoom, layers, location, compass, and search. These should be grouped, source-aware, and safe over media/map-like content.

### Checklist

- [ ] Related buttons share a group surface.
- [ ] Clusters can be placed in all corners.
- [ ] Clear variant uses local dimming only within cluster footprint.
- [ ] Buttons have labels and keyboard support.
- [ ] Stories show map, satellite, and high-contrast backgrounds.

## Prompt 23: Add `LiquidGlassNowPlayingBar`

### Target Files

Create:

- `src/components/media/LiquidGlassNowPlayingBar.tsx`
- `src/components/media/LiquidGlassNowPlayingBar.test.tsx`
- `src/components/media/LiquidGlassNowPlayingBar.stories.tsx`
- `docs/components/media/liquid-glass-now-playing-bar.md`

Update:

- `src/components/navigation/LiquidGlassBottomAccessory.tsx`
- `src/components/media/index.ts`
- `src/index.ts`

### Task

Create a mini-player bottom accessory that can collapse into the tab bar area and morph into a full now-playing sheet.

### Checklist

- [ ] Integrates with `LiquidGlassTabBar` bottom accessory placement.
- [ ] Supports source transition to full sheet.
- [ ] Includes play/pause, title, subtitle, artwork, progress.
- [ ] Text remains legible on artwork.
- [ ] Reduced motion disables morph and uses fade/slide fallback.

## Prompt 24: Add `LiquidGlassPhotoInspector`

### Target Files

Create:

- `src/components/media/LiquidGlassPhotoInspector.tsx`
- `src/components/media/LiquidGlassPhotoInspector.test.tsx`
- `src/components/media/LiquidGlassPhotoInspector.stories.tsx`
- `docs/components/media/liquid-glass-photo-inspector.md`

Update:

- `src/components/navigation/LiquidGlassInspectorPanel.tsx`
- `src/components/media/index.ts`
- `src/index.ts`

### Task

Create a media-rich inspector that demonstrates clear and regular Liquid Glass variants correctly over photography or artwork.

### Checklist

- [ ] Supports metadata sections, actions, tags, and rating.
- [ ] Uses local dimming for clear glass.
- [ ] Uses hard scroll edge for pinned metadata header when dense.
- [ ] Works on mobile as a sheet and desktop as an inspector.
- [ ] Stories show bright, dark, and colorful images.

## Prompt 25: Add `LiquidGlassCarouselRail`

### Target Files

Create:

- `src/components/data-display/LiquidGlassCarouselRail.tsx`
- `src/components/data-display/LiquidGlassCarouselRail.test.tsx`
- `src/components/data-display/LiquidGlassCarouselRail.stories.tsx`
- `docs/components/data-display/liquid-glass-carousel-rail.md`

Update:

- `src/components/data-display/index.ts`
- `src/index.ts`

### Task

Create a horizontal rail that can scroll beneath an inset sidebar or toolbar while maintaining content visibility and scroll-edge clarity.

### Checklist

- [ ] Supports keyboard and pointer scrolling.
- [ ] Supports scroll buttons without layout shift.
- [ ] Integrates with `LiquidGlassScrollEdge`.
- [ ] Does not apply Liquid Glass to every card by default.
- [ ] Stories show rail under sidebar, rail under toolbar, and mobile full-width rail.

## Prompt 26: Modernize `GlassCommandPalette` And `GlassSpotlightSearch`

### Target Files

Update:

- `src/components/interactive/GlassCommandPalette.tsx`
- `src/components/interactive/GlassCommandPalette.test.tsx`
- `src/components/interactive/GlassCommandPalette.stories.tsx`
- `src/components/search/GlassSpotlightSearch.tsx`
- `src/components/search/GlassSpotlightSearch.test.tsx`
- `src/components/search/GlassSpotlightSearch.stories.tsx`

Create:

- `src/components/interactive/LiquidGlassCommandSurface.tsx`
- `src/components/interactive/LiquidGlassCommandSurface.test.tsx`
- `src/components/interactive/LiquidGlassCommandSurface.stories.tsx`
- `docs/components/interactive/liquid-glass-command-surface.md`

### Task

Create a unified command/search surface with Liquid Glass material, source anchoring, keyboard-first behavior, grouped results, and scroll-edge result clarity.

### Checklist

- [ ] Existing command palette and spotlight APIs remain functional.
- [ ] New command surface supports search input, grouped results, shortcuts, icons, selected state, and empty state.
- [ ] Uses combobox/listbox semantics where appropriate.
- [ ] Handles `Escape`, arrow keys, `Home`, `End`, `Enter`, and mouse hover.
- [ ] Focus is restored to opener on close.
- [ ] Results scroll area uses `LiquidGlassScrollEdge`.

## Prompt 27: Update `LiquidGlassMaterial`

### Target Files

Update:

- `src/primitives/LiquidGlassMaterial.tsx`
- `src/components/primitives/LiquidGlassMaterial.stories.tsx`
- `src/tests/liquidGlass.test.tsx`
- `docs/primitives/liquid-glass-material.md`

### Task

Modernize `LiquidGlassMaterial` so it consumes the new backdrop sampler, layer provider, effect group context, concentric frame variables, and reduced-motion rules.

Required improvements:

- Real backdrop adaptation path.
- Development warning for invalid nested glass.
- `clear` variant local dimming support.
- Shared sampling region awareness.
- Better `interactive` behavior.
- More explicit `data-*` attributes for tests.

### Checklist

- [ ] No placeholder luminance behavior remains in production path.
- [ ] Clear variant can apply or request dimming.
- [ ] Group context changes sampling strategy.
- [ ] Reduced motion disables parallax and shimmer.
- [ ] SSR mount does not warn or crash.
- [ ] Stories show regular, clear, grouped, interactive, reduced-motion, and contrast fallback.

## Prompt 28: Update Tokens And CSS Utilities

### Target Files

Update:

- `src/tokens/glass.ts`
- `src/styles/glass.css`
- `src/styles/glass.generated.css`
- `src/styles/design-tokens.css`
- `src/styles/tokens.css`
- `tokens/index.json`
- `docs/tokens/design-tokens.md`

### Task

Add token coverage for the new Liquid Glass system so components do not invent values locally.

Add tokens for:

- scroll-edge soft/hard opacity, blur, size
- concentric radius inset scales
- material layer depth
- clear variant dimming strength
- grouped morph spacing and blend strength
- toolbar/tab/sidebar density
- interactive illumination strength
- reduced-motion fallbacks

### Checklist

- [ ] Tokens are available in TS and CSS variable form.
- [ ] Token names match existing naming conventions.
- [ ] No component hardcodes newly introduced visual constants.
- [ ] Token docs include usage examples.
- [ ] Tests for token exports pass.

## Prompt 29: Add Liquid Glass Showcase App

### Target Files

Create:

- `src/components/showcase/LiquidGlassShowcase.tsx`
- `src/components/showcase/LiquidGlassShowcase.test.tsx`
- `src/components/showcase/LiquidGlassShowcase.stories.tsx`
- `docs/showcase/liquid-glass-showcase.md`

Update:

- `src/index.ts`
- Storybook navigation if applicable.

### Task

Create a portfolio-grade demo that shows the Liquid Glass system as a complete app experience, not disconnected widgets.

The showcase must include:

- inset sidebar
- floating toolbar
- scroll-edge content
- adaptive search
- floating/minimizing tab bar
- bottom accessory now-playing bar
- source-anchored sheet
- badge cluster morph
- media controls using clear variant
- reduced-motion and high-contrast toggles

### Checklist

- [ ] First viewport looks like a real product/tool, not a marketing page.
- [ ] Uses real visual assets or rich generated placeholders for media/map areas.
- [ ] Demonstrates correct regular versus clear variant use.
- [ ] No text or controls overlap at desktop or mobile widths.
- [ ] Storybook screenshots pass visual sanity checks.
- [ ] Includes accessibility demo states.

## Prompt 30: Update Documentation And Migration Guide

### Target Files

Update:

- `docs/guides/liquid-glass-migration.md`
- `docs/primitives/liquid-glass-system.md`
- `docs/primitives/liquid-glass-material.md`
- `docs/components/README.md`
- `README.md`
- `CHANGELOG.md`

Create:

- `docs/guides/liquid-glass-design-rules.md`
- `docs/guides/liquid-glass-component-map.md`

### Task

Document the new system clearly enough for consumers to know when to use each component and when not to use Liquid Glass.

Docs must include:

- use Liquid Glass for navigation/control/presentation layers
- avoid Liquid Glass in content layer by default
- avoid glass-on-glass stacking
- regular versus clear variant rules
- scroll-edge rules
- source transition rules
- accessibility and contrast requirements
- performance tier guidance
- upgrade map from existing components to new Liquid components

### Checklist

- [ ] Migration table lists old component, new component, and whether to upgrade or replace.
- [ ] Each new component has a one-paragraph purpose and code example.
- [ ] Docs call out incorrect usage patterns.
- [ ] Docs include reduced-motion and contrast requirements.
- [ ] README links to the new guide.

## Prompt 31: Add Public Export Audit

### Target Files

Update:

- `src/index.ts`
- `src/components/**/index.ts`
- `src/primitives/index.ts`
- `reports/public-export-audit.md`
- `scripts/audit/public-export-audit.js`

### Task

Ensure every public Liquid Glass component, primitive, hook, and type is exported intentionally and appears in the public export audit.

### Checklist

- [ ] New components are exported from local indexes.
- [ ] Public exports include props types.
- [ ] Internal-only helpers remain private.
- [ ] Public export audit passes.
- [ ] Package build includes new files.

## Prompt 32: Add Liquid Glass Quality Tests

### Target Files

Create:

- `tests/liquid-glass/liquid-glass-a11y.test.tsx`
- `tests/liquid-glass/liquid-glass-layering.test.tsx`
- `tests/liquid-glass/liquid-glass-reduced-motion.test.tsx`
- `tests/liquid-glass/liquid-glass-exports.test.ts`
- `tests/visual/liquid-glass/liquid-glass-showcase.spec.ts`

Update:

- `jest.config.js`
- `playwright.visual-ci.config.ts`
- `reports/glass_compliance_summary.md`

### Task

Add test coverage for cross-cutting Liquid Glass behavior.

Test categories:

- contrast policy
- clear variant dimming
- reduced motion
- nested glass warnings
- grouped glass no-warning path
- keyboard navigation
- public exports
- visual nonblank showcase screenshots

### Checklist

- [ ] Tests are focused and deterministic.
- [ ] Visual tests check desktop and mobile.
- [ ] Reduced motion tests do not depend on real animation timing.
- [ ] Layering tests run in development mode where warnings are enabled.
- [ ] Reports are updated with the new compliance status.

## Suggested Execution Order

1. Prompt 28: Tokens and CSS utilities.
2. Prompt 05: Layer provider.
3. Prompt 03: Backdrop sampler.
4. Prompt 01: Effect group.
5. Prompt 02: Scroll edge.
6. Prompt 04: Concentric frame.
7. Prompt 27: LiquidGlassMaterial integration.
8. Prompt 06: Toolbar.
9. Prompt 07: Sidebar.
10. Prompt 08: Tab bar and bottom accessory.
11. Prompt 09: Search field and search tab.
12. Prompt 10: Source transition.
13. Prompt 11: Action sheet.
14. Prompt 12: Adaptive sheet/modal/drawer.
15. Prompt 13: Popover menu.
16. Prompt 15 through Prompt 20: Controls and badge clusters.
17. Prompt 21 through Prompt 25: Portfolio media/content surfaces.
18. Prompt 26: Command surface.
19. Prompt 29: Showcase app.
20. Prompt 30: Documentation.
21. Prompt 31: Export audit.
22. Prompt 32: Quality tests.

## Definition Of Done

- [ ] The new Liquid Glass system has primitives for grouping, scroll edges, backdrop sampling, concentric geometry, layer policy, and source transitions.
- [ ] Navigation, search, tab bars, sidebars, sheets, popovers, buttons, sliders, switches, segmented controls, badges, media controls, and command surfaces have modern Liquid Glass variants.
- [ ] The portfolio showcase demonstrates a full app-like experience.
- [ ] Documentation explains correct and incorrect usage.
- [ ] Accessibility and reduced-motion behavior are tested.
- [ ] Public exports and package build are clean.
- [ ] The system reads as a disciplined Liquid Glass design library, not a generic blur component collection.
