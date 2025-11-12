# Outstanding Failures (per latest logs.txt)

Fix order mirrors the log output above.

### `src/services/ai/__tests__/ai-services.test.ts`
**Error Summary:** Test suite failed to run
**Fix Tasks:**
- [ ] Fix the module resolution (restore the referenced file or point the import at the `.ts.bak` copy).
- [ ] Re-run the suite to verify Jest loads the module successfully.

### `src/components/ai/ProductionAIIntegration.test.tsx`
**Error Summary:** Test suite failed to run
**Fix Tasks:**
- [ ] Fix the module resolution (restore the referenced file or point the import at the `.ts.bak` copy).
- [ ] Re-run the suite to verify Jest loads the module successfully.

### `src/components/data-display/GlassAvatar.test.tsx`
**Error Summary:** GlassAvatar › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/interactive/GlassKanban.test.tsx`
**Error Summary:** GlassKanban › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/ecommerce/GlassSmartShoppingCart.test.tsx`
**Error Summary:** GlassSmartShoppingCart › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/media/GlassAdvancedVideoPlayer.test.tsx`
**Error Summary:** GlassAdvancedVideoPlayer › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassFileExplorer.test.tsx`
**Error Summary:** GlassFileExplorer › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/cms/GlassPageBuilder.test.tsx`
**Error Summary:** GlassPageBuilder › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/charts/GlassDataChart.test.tsx`
**Error Summary:** GlassDataChart › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassFilterPanel.test.tsx`
**Error Summary:** GlassFilterPanel › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/cms/GlassPropertyPanel.test.tsx`
**Error Summary:** GlassPropertyPanel › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/ecommerce/GlassProductRecommendations.test.tsx`
**Error Summary:** GlassProductRecommendations › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/charts/ModularGlassDataChart.test.tsx`
**Error Summary:** ModularGlassDataChart › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassFacetSearch.test.tsx`
**Error Summary:** GlassFacetSearch › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassChat.test.tsx`
**Error Summary:** GlassChat › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassFormBuilder.test.tsx`
**Error Summary:** GlassFormBuilder › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassSearchInterface.test.tsx`
**Error Summary:** GlassSearchInterface › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassThemeDemo.test.tsx`
**Error Summary:** GlassThemeDemo › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/templates/forms/GlassFormWizardSteps.test.tsx`
**Error Summary:** GlassFormWizardSteps › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/tests/liquidGlass.test.tsx`
**Error Summary:** Liquid Glass Material System › LiquidGlassMaterial Core › renders with default props
**Fix Tasks:**
- [ ] Review the failure message and component under test to determine why the assertion is missing its target.
- [ ] Adjust the component/fixture so the expected markup exists and re-run the suite.

### `src/components/website-components/GlassPrismComparison.test.tsx`
**Error Summary:** GlassPrismComparison › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/data-display/GlassDataGridPro.test.tsx`
**Error Summary:** GlassDataGridPro › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/navigation/HeaderUserMenu.test.tsx`
**Error Summary:** HeaderUserMenu › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/navigation/GlassToolbar.test.tsx`
**Error Summary:** GlassToolbar › ARIA Attributes › has proper navigation role
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/navigation/GlassSidebar.test.tsx`
**Error Summary:** GlassSidebar › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/PageTransitionDemo.test.tsx`
**Error Summary:** PageTransitionDemo › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassFileUpload.test.tsx`
**Error Summary:** GlassFileUpload › ARIA Attributes › has proper form control role
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/navigation/components/CollapsedMenu.test.tsx`
**Error Summary:** CollapsedMenu › ARIA Attributes › has accessible name
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/templates/list/GlassListView.test.tsx`
**Error Summary:** GlassListView › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/rating/GlassRating.test.tsx`
**Error Summary:** GlassRating › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/input/GlassFileUpload.test.tsx`
**Error Summary:** GlassFileUpload › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/data-display/GlassVirtualTable.test.tsx`
**Error Summary:** GlassVirtualTable › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/ui-components/GlassCheckboxUI.test.tsx`
**Error Summary:** GlassCheckboxUI › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/layout/GlassSplitPane.test.tsx`
**Error Summary:** GlassSplitPane › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/layouts/GlassOrbitalMenu.test.tsx`
**Error Summary:** GlassOrbitalMenu › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/collaboration/GlassCollaborativeComments.test.tsx`
**Error Summary:** GlassCollaborativeComments › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/charts/components/AtmosphericEffects.test.tsx`
**Error Summary:** AtmosphericEffects › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/navigation/GlassHeader.test.tsx`
**Error Summary:** GlassHeader › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/navigation/GlassTabs.test.tsx`
**Error Summary:** GlassTabs › ARIA Attributes › has proper navigation role
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/modal/GlassBottomSheet.test.tsx`
**Error Summary:** GlassBottomSheet › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/navigation/GlassTabItem.test.tsx`
**Error Summary:** GlassTabItem › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/speed-dial/SpeedDialAction.test.tsx`
**Error Summary:** SpeedDialAction › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/advanced/GlassLiquidTransition.test.tsx`
**Error Summary:** GlassLiquidTransition › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/mobile/GlassActionSheet.test.tsx`
**Error Summary:** GlassActionSheet › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/layout/ZSpaceAppLayout.test.tsx`
**Error Summary:** ZSpaceAppLayout › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/data-display/GlassProgress.test.tsx`
**Error Summary:** GlassProgress › Reduced Motion Support › respects prefers-reduced-motion
**Fix Tasks:**
- [ ] Review the failure message and component under test to determine why the assertion is missing its target.
- [ ] Adjust the component/fixture so the expected markup exists and re-run the suite.

### `src/components/navigation/GlassResponsiveNav.test.tsx`
**Error Summary:** GlassResponsiveNav › ARIA Attributes › has accessible name
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/collaboration/GlassCollaborationDashboard.test.tsx`
**Error Summary:** GlassCollaborationDashboard › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/interactive/GlassCoachmarks.test.tsx`
**Error Summary:** GlassCoachmarks › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/navigation/components/TabItem.test.tsx`
**Error Summary:** TabItem › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/charts/components/ChartTooltip.test.tsx`
**Error Summary:** ChartTooltip › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/modal/GlassPopover.test.tsx`
**Error Summary:** GlassPopover › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/input/GlassStepLabel.test.tsx`
**Error Summary:** GlassStepLabel › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/interactive/GlassVideoPlayer.test.tsx`
**Error Summary:** GlassVideoPlayer › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/website-components/GlassWipeSliderExamples.test.tsx`
**Error Summary:** GlassWipeSliderExamples › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/effects/Glass3DEngine.test.tsx`
**Error Summary:** Glass3DEngine › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/advanced/GlassTrophyCase.test.tsx`
**Error Summary:** GlassTrophyCase › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/button/EnhancedGlassButton.test.tsx`
**Error Summary:** EnhancedGlassButton › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

> Once all tasks above are cleared the suite should pass cleanly; rerun `pnpm test` to confirm.