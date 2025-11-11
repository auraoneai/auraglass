# Outstanding Failures (per latest build-log.txt)

Fix order mirrors the log output above.

### `src/components/website-components/GlassWipeSliderExamples.test.tsx`
**Error Summary:** GlassWipeSliderExamples › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/advanced/GlassTrophyCase.test.tsx`
**Error Summary:** GlassTrophyCase › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/modal/GlassDialog.test.tsx`
**Error Summary:** GlassDialog › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/charts/components/ChartRenderer.test.tsx`
**Error Summary:** ChartRenderer › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/tests/liquidGlass.test.tsx`
**Error Summary:** Liquid Glass Material System › LiquidGlassMaterial Core › renders with default props
**Fix Tasks:**
- [ ] Review the failure message and component under test to determine why the assertion is missing its target.
- [ ] Adjust the component/fixture so the expected markup exists and re-run the suite.

### `src/components/charts/ModularGlassDataChart.test.tsx`
**Error Summary:** ModularGlassDataChart › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassThemeDemo.test.tsx`
**Error Summary:** GlassThemeDemo › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/data-display/GlassDataTable.test.tsx`
**Error Summary:** GlassDataTable › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/navigation/HeaderUserMenu.test.tsx`
**Error Summary:** HeaderUserMenu › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/collaboration/CollaborativeGlassWorkspace.test.tsx`
**Error Summary:** CollaborativeGlassWorkspace › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/houdini/HoudiniGlassCard.test.tsx`
**Error Summary:** HoudiniGlassCard › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/navigation/GlassPagination.test.tsx`
**Error Summary:** GlassPagination › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/advanced/IntelligentColorSystem.test.tsx`
**Error Summary:** IntelligentColorSystem › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/website-components/GlassPrismComparison.test.tsx`
**Error Summary:** GlassPrismComparison › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/ai/GlassGenerativeArt.test.tsx`
**Error Summary:** GlassGenerativeArt › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/collaboration/GlassCollaborativeCursor.test.tsx`
**Error Summary:** GlassCollaborativeCursor › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/templates/forms/GlassWizardTemplate.test.tsx`
**Error Summary:** GlassWizardTemplate › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/interactive/GlassFileExplorer.test.tsx`
**Error Summary:** GlassFileExplorer › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassFilterPanel.test.tsx`
**Error Summary:** GlassFilterPanel › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassFacetSearch.test.tsx`
**Error Summary:** GlassFacetSearch › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassColorWheel.test.tsx`
**Error Summary:** GlassColorWheel › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/social/GlassSharedWhiteboard.test.tsx`
**Error Summary:** GlassSharedWhiteboard › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/interactive/GlassGallery.test.tsx`
**Error Summary:** GlassGallery › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/interactive/GlassChat.test.tsx`
**Error Summary:** GlassChat › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/navigation/GlassHeader.test.tsx`
**Error Summary:** GlassHeader › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/input/GlassMultiStepForm.test.tsx`
**Error Summary:** GlassMultiStepForm › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/layouts/GlassOrbitalMenu.test.tsx`
**Error Summary:** GlassOrbitalMenu › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/visual-feedback/RippleButton.test.tsx`
**Error Summary:** RippleButton › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/input/GlassToggle.test.tsx`
**Error Summary:** GlassToggle › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/interactive/GlassSearchInterface.test.tsx`
**Error Summary:** GlassSearchInterface › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/templates/list/GlassListView.test.tsx`
**Error Summary:** GlassListView › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/__tests__/components/GlassButton.test.tsx`
**Error Summary:** GlassButton › Rendering › renders with custom className
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/interactive/PageTransitionDemo.test.tsx`
**Error Summary:** PageTransitionDemo › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/navigation/GlassTabBar.test.tsx`
**Error Summary:** GlassTabBar › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/tree-view/TreeItem.test.tsx`
**Error Summary:** TreeItem › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/templates/forms/GlassFormTemplate.test.tsx`
**Error Summary:** GlassFormTemplate › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/charts/components/KpiChart.test.tsx`
**Error Summary:** KpiChart › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/interactive/GlassCommandPalette.test.tsx`
**Error Summary:** GlassCommandPalette › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/interactive/GlassFileUpload.test.tsx`
**Error Summary:** GlassFileUpload › ARIA Attributes › has proper form control role
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/accessibility/GlassFocusIndicators.test.tsx`
**Error Summary:** GlassFocusIndicators › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/templates/forms/GlassFormWizardSteps.test.tsx`
**Error Summary:** GlassFormWizardSteps › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/input/GlassCheckbox.test.tsx`
**Error Summary:** GlassCheckbox › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/media/GlassAdvancedVideoPlayer.test.tsx`
**Error Summary:** GlassAdvancedVideoPlayer › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/advanced/GlassLiquidTransition.test.tsx`
**Error Summary:** GlassLiquidTransition › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/ecommerce/GlassProductRecommendations.test.tsx`
**Error Summary:** GlassProductRecommendations › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/navigation/GlassSidebar.test.tsx`
**Error Summary:** GlassSidebar › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/rating/GlassRating.test.tsx`
**Error Summary:** GlassRating › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/collaboration/GlassCollaborativeComments.test.tsx`
**Error Summary:** GlassCollaborativeComments › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/modal/GlassBottomSheet.test.tsx`
**Error Summary:** GlassBottomSheet › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/layout/GlassSplitPane.test.tsx`
**Error Summary:** GlassSplitPane › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/input/GlassFormStepper.test.tsx`
**Error Summary:** GlassFormStepper › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/data-display/GlassProgress.test.tsx`
**Error Summary:** GlassProgress › Reduced Motion Support › respects prefers-reduced-motion
**Fix Tasks:**
- [ ] Review the failure message and component under test to determine why the assertion is missing its target.
- [ ] Adjust the component/fixture so the expected markup exists and re-run the suite.

### `src/components/input/GlassFileUpload.test.tsx`
**Error Summary:** GlassFileUpload › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/navigation/GlassToolbar.test.tsx`
**Error Summary:** GlassToolbar › ARIA Attributes › has proper navigation role
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/backgrounds/ParticleBackground.test.tsx`
**Error Summary:** ParticleBackground › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/speed-dial/SpeedDialAction.test.tsx`
**Error Summary:** SpeedDialAction › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/ecommerce/GlassSmartShoppingCart.test.tsx`
**Error Summary:** GlassSmartShoppingCart › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/data-display/GlassVirtualTable.test.tsx`
**Error Summary:** GlassVirtualTable › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/interactive/GlassKanban.test.tsx`
**Error Summary:** GlassKanban › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/data-display/GlassTimeline.test.tsx`
**Error Summary:** GlassTimeline › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/cms/GlassPropertyPanel.test.tsx`
**Error Summary:** GlassPropertyPanel › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/input/GlassStepIcon.test.tsx`
**Error Summary:** GlassStepIcon › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/interactive/GlassKeyValueEditor.test.tsx`
**Error Summary:** GlassKeyValueEditor › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/data-display/GlassAvatar.test.tsx`
**Error Summary:** GlassAvatar › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/charts/components/AtmosphericEffects.test.tsx`
**Error Summary:** AtmosphericEffects › matches snapshot
**Fix Tasks:**
- [ ] Ensure the rendered output matches the current markup, updating the snapshot (`-u`) only when intentional.
- [ ] Verify that the new markup still satisfies the accessibility and visual requirements described in the test.

### `src/components/input/GlassMultiSelect.test.tsx`
**Error Summary:** GlassMultiSelect › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/templates/interactive/GlassDataTable.test.tsx`
**Error Summary:** GlassDataTable › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/collaboration/GlassCollaborationDashboard.test.tsx`
**Error Summary:** GlassCollaborationDashboard › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/navigation/GlassResponsiveNav.test.tsx`
**Error Summary:** GlassResponsiveNav › ARIA Attributes › has accessible name
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/mobile/GlassActionSheet.test.tsx`
**Error Summary:** GlassActionSheet › ARIA Attributes › supports aria-label
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/voice/VoiceGlassControl.test.tsx`
**Error Summary:** VoiceGlassControl › renders without crashing
**Fix Tasks:**
- [ ] Track down the runtime error/exception raised during render and fix the cause (e.g., missing props, undefined hooks).
- [ ] Re-run the suite to prove the component mounts cleanly.

### `src/components/input/GlassSlider.test.tsx`
**Error Summary:** GlassSlider › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/layout/GlassSeparator.test.tsx`
**Error Summary:** GlassSeparator › has no accessibility violations
**Fix Tasks:**
- [ ] Inspect the axe output included in the Jest failure and resolve each reported violation.
- [ ] Re-run the accessibility test so it completes without errors.

### `src/components/navigation/GlassTabs.test.tsx`
**Error Summary:** GlassTabs › ARIA Attributes › has proper navigation role
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

### `src/components/navigation/components/CollapsedMenu.test.tsx`
**Error Summary:** CollapsedMenu › ARIA Attributes › has accessible name
**Fix Tasks:**
- [ ] Add or forward accessible labels/roles so the test sees the expected ARIA attributes/name.
- [ ] Run the failing suite (or axe) locally to confirm the accessibility audit passes once the markup is fixed.

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

### `src/components/charts/components/ChartTooltip.test.tsx`
**Error Summary:** ChartTooltip › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

### `src/components/interactive/GlassCoachmarks.test.tsx`
**Error Summary:** GlassCoachmarks › accepts and renders with custom props
**Fix Tasks:**
- [ ] Make sure the component forwards the provided `className`/props to the element the test queries.
- [ ] Re-run the specific test to confirm the target element is now rendered before asserting on its class.

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

> Once all tasks above are cleared the suite should pass cleanly; rerun `pnpm test` to confirm.