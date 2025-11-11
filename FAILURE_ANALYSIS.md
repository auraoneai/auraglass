# Test Failure Analysis & Fix Checklist

## Quick Summary
- **Total Failing Test Suites**: 147
- **Total Failing Tests**: 397
- **Total Failed Snapshots**: 27
- **Files Fixed**: 12
- **Files Remaining**: ~135

## Current Status
- **Test Suites**: 147 failed, 215 passed, 362 total
- **Tests**: 397 failed, 2 skipped, 1649 passed, 2048 total  
- **Snapshots**: 27 failed, 17 written, 259 passed, 303 total

---

## Category 1: Context Provider Wrappers (46+ failures)

### EcommerceProvider Required (20+ failures)

#### ✅ Fixed
- [x] `src/components/ecommerce/GlassProductRecommendations.test.tsx`
- [x] `src/components/ecommerce/GlassSmartShoppingCart.test.tsx`

#### ⏳ Remaining
- [ ] Check other ecommerce component tests for `useEcommerce` usage

**Fix Pattern:**
```typescript
import { EcommerceProvider } from '@/components/ecommerce/GlassEcommerceProvider';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EcommerceProvider>{children}</EcommerceProvider>
);

// Then use in tests:
render(<Component />, { wrapper: TestWrapper });
```

### CollaborationProvider Required (26+ failures)

#### ✅ Fixed
- [x] `src/components/collaboration/GlassCollaborativeComments.test.tsx`
- [x] `src/components/collaboration/GlassCollaborationDashboard.test.tsx`
- [x] `src/components/collaboration/GlassCollaborativeCursor.test.tsx`

#### ⏳ Remaining
- [ ] Check other collaboration component tests for `useCollaboration` usage

**Fix Pattern:**
```typescript
import { CollaborationProvider } from '@/components/collaboration/GlassCollaborationProvider';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CollaborationProvider roomId="test-room">{children}</CollaborationProvider>
);

// Then use in tests:
render(<Component />, { wrapper: TestWrapper });
```

---

## Category 2: Snapshot Failures (27 failures)

### Snapshot Files Needing Update

1. [ ] `src/components/navigation/GlassPagination.test.tsx` - Structure changed (aria-labels added)
2. [ ] `src/components/navigation/GlassMobileNav.test.tsx` - Wrapper structure changed
3. [ ] `src/components/dashboard/GlassStatCard.test.tsx` - Content structure changed
4. [ ] `src/components/image-list/ImageListItem.test.tsx` - Wrapped in `<ul>` element
5. [ ] `src/components/modal/GlassTooltip.test.tsx` - Trigger element structure changed
6. [ ] `src/components/dashboard/GlassMetricCard.test.tsx` - Content structure changed
7. [ ] `src/components/ecommerce/GlassEcommerceProvider.test.tsx` - Wrapper div added
8. [ ] `src/components/button/GlassFab.test.tsx` - Structure changed
9. [ ] `src/components/ai/AIGlassThemeProvider.test.tsx` - Wrapper div added
10. [ ] `src/components/input/GlassStepIcon.test.tsx` - Structure changed
11. [ ] `src/components/accessibility/AccessibilityProvider.test.tsx` - Wrapper div added
12. [ ] `src/components/navigation/GlassCommandBar.test.tsx` - Structure changed
13. [ ] `src/components/GlassErrorBoundary.test.tsx` - Error state structure changed
14. [ ] `src/components/button/GlassMagneticButton.test.tsx` - Structure changed
15. [ ] `src/components/collaboration/GlassCollaborationProvider.test.tsx` - Wrapper div added
16. [ ] `src/components/media/GlassMediaProvider.test.tsx` - Wrapper div added
17. [ ] `src/components/cms/GlassComponentPalette.test.tsx` - Structure changed
18. [ ] `src/components/image/GlassIntelligentImageUploader.test.tsx` - Structure changed
19. [ ] `src/components/quantum/GlassSuperpositionalMenu.test.tsx` - Structure changed
20. [ ] `src/components/cms/GlassCanvas.test.tsx` - Content reordered

**Fix Method:**
```bash
# Update all snapshots
pnpm test -- -u

# Or update specific file
pnpm test GlassPagination.test.tsx -u
```

**Note:** Review snapshot diffs before committing to ensure changes are expected.

---

## Category 3: Missing Default Props (TypeError: Cannot read properties of undefined)

### ✅ Fixed
- [x] `src/components/interactive/GlassTagInput.tsx` - Made `value` optional with default `[]`
- [x] `src/components/input/GlassTransferList.tsx` - Made `items` optional with default `[]`

### ⏳ Remaining - Check for similar issues
- [ ] Review all components that use `.map()`, `.filter()`, `.forEach()` on props
- [ ] Add default empty arrays/objects where appropriate
- [ ] Add null checks before array operations

**Fix Pattern:**
```typescript
// Before
export interface Props {
  items: Item[];
}

export function Component({ items }: Props) {
  return items.map(item => ...); // ❌ Crashes if items is undefined
}

// After
export interface Props {
  items?: Item[];
}

export function Component({ items = [] }: Props) {
  return items.map(item => ...); // ✅ Safe with default
}
```

---

## Category 4: Accessibility Violations

### ✅ Fixed
- [x] `src/components/interactive/GlassVideoPlayer.tsx` - Added aria-label to all 9 icon-only buttons
- [x] `src/components/layout/GlassAppShell.tsx` - Removed role="application" to fix landmark violation
- [x] `src/components/layouts/GlassMasonryGrid.tsx` - Added aria-label to select elements
- [x] `src/components/navigation/GlassMobileNav.test.tsx` - Fixed test expectation

### ⏳ Remaining Accessibility Issues

#### Button Name Violations (68+ failures)
- [ ] Search codebase for all `<button>` elements without aria-label
- [ ] Search for `<GlassButton>` components without aria-label
- [ ] Add descriptive aria-labels to all icon-only buttons
- [ ] Ensure buttons have either visible text or aria-label

**Fix Pattern:**
```typescript
// Icon-only button
<GlassButton
  onClick={handleAction}
  aria-label="Close dialog" // ✅ Required for icon-only buttons
>
  <XIcon />
</GlassButton>

// Button with text (no aria-label needed)
<GlassButton onClick={handleAction}>
  Save Changes {/* ✅ Visible text is sufficient */}
</GlassButton>
```

#### Form Element Labels
- [ ] `src/components/atmospheric/GlassAuroraDisplay.tsx` - Add labels to range inputs
- [ ] `src/components/input/GlassFileUpload.tsx` - Fix aria-allowed-role violation (label with role="button")
- [ ] Search for all `<input>`, `<select>`, `<textarea>` without labels
- [ ] Add `<label>` elements or `aria-label` attributes

**Fix Pattern:**
```typescript
// Option 1: Explicit label
<label htmlFor="input-id">Label Text</label>
<input id="input-id" />

// Option 2: aria-label
<input aria-label="Label Text" />

// Option 3: aria-labelledby
<span id="label-id">Label Text</span>
<input aria-labelledby="label-id" />
```

#### Select Elements
- [ ] Search for all `<select>` elements
- [ ] Ensure each has a label or aria-label
- [ ] Check `GlassMasonryGrid` - Already fixed ✅

#### Landmark Violations
- [ ] Check for nested `<main>` elements
- [ ] Ensure only one `<main>` per page
- [ ] Check `GlassAppShell` - Already fixed ✅

---

## Category 5: Import/Export Issues

### ✅ Fixed
- [x] `src/components/visual-feedback/StateIndicator.test.tsx` - Changed from named to default import

### ⏳ Remaining
- [ ] Check for other import/export mismatches
- [ ] Verify all test files import components correctly
- [ ] Check for default vs named export inconsistencies

**Fix Pattern:**
```typescript
// If component exports as default:
export default Component;

// Test should import as:
import Component from './Component';

// If component exports as named:
export { Component };

// Test should import as:
import { Component } from './Component';
```

---

## Category 6: Test Logic Issues

### ✅ Fixed
- [x] `src/components/navigation/GlassMobileNav.test.tsx` - Fixed aria-label test to query wrapper div

### ⏳ Remaining
- [ ] `src/components/modal/GlassDialog.test.tsx` - aria-label test failing (element not found)
- [ ] `src/components/modal/GlassTooltip.test.tsx` - aria-label test failing (role="tooltip" not found)
- [ ] Review all tests that query by aria-label or role
- [ ] Ensure test queries match actual component structure
- [ ] Update test expectations to match component implementation

**Fix Pattern:**
```typescript
// If aria-label is on wrapper, not the element itself:
const { container } = render(<Component aria-label="Test" />);
const element = container.querySelector('[aria-label="Test"]'); // ✅ Query container
expect(element).toBeInTheDocument();

// Not:
const element = screen.getByLabelText('Test'); // ❌ May not work if label is on wrapper
```

---

## Category 7: Component-Specific Issues

### Custom Props Not Forwarded
- [ ] `src/components/data-display/GlassLoadingSkeleton.test.tsx` - className not forwarded properly
- [ ] Review all components to ensure `className` and `data-testid` are forwarded
- [ ] Check components wrapped in `OptimizedGlass` or `Motion` primitives

**Fix Pattern:**
```typescript
// Ensure props are forwarded to root element
export const Component = forwardRef<HTMLDivElement, Props>(
  ({ className, 'data-testid': dataTestId, ...props }, ref) => {
    return (
      <OptimizedGlass
        ref={ref}
        className={cn('base-classes', className)}
        data-testid={dataTestId}
        {...props}
      >
        {/* content */}
      </OptimizedGlass>
    );
  }
);
```

---

## Category 8: Remaining Test Files (147 total failing)

### Files Already Fixed (10)
1. ✅ `src/components/ecommerce/GlassProductRecommendations.test.tsx`
2. ✅ `src/components/ecommerce/GlassSmartShoppingCart.test.tsx`
3. ✅ `src/components/collaboration/GlassCollaborativeComments.test.tsx`
4. ✅ `src/components/collaboration/GlassCollaborationDashboard.test.tsx`
5. ✅ `src/components/collaboration/GlassCollaborativeCursor.test.tsx`
6. ✅ `src/components/interactive/GlassVideoPlayer.tsx` (component fix)
7. ✅ `src/components/layout/GlassAppShell.tsx` (component fix)
8. ✅ `src/components/layouts/GlassMasonryGrid.tsx` (component fix)
9. ✅ `src/components/navigation/GlassMobileNav.test.tsx`
10. ✅ `src/components/interactive/GlassTagInput.tsx` (component fix)
11. ✅ `src/components/input/GlassTransferList.tsx` (component fix)
12. ✅ `src/components/visual-feedback/StateIndicator.test.tsx`

### Remaining Files to Fix (~135 files)

**Complete List of Failing Test Files (68 unique files):**

1. [ ] `src/components/navigation/GlassPagination.test.tsx` - Snapshot failure
2. [ ] `src/components/ecommerce/GlassProductRecommendations.test.tsx` - ✅ FIXED (Provider wrapper)
3. [ ] `src/components/layout/GlassAppShell.test.tsx` - ✅ FIXED (Landmark issue)
4. [ ] `src/components/layouts/GlassMasonryGrid.test.tsx` - ✅ FIXED (Select labels)
5. [ ] `src/components/navigation/GlassMobileNav.test.tsx` - ✅ FIXED (Test expectation)
6. [ ] `src/components/ecommerce/GlassSmartShoppingCart.test.tsx` - ✅ FIXED (Provider wrapper)
7. [ ] `src/components/interactive/GlassTagInput.test.tsx` - ✅ FIXED (Default props)
8. [ ] `src/components/collaboration/GlassCollaborativeComments.test.tsx` - ✅ FIXED (Provider wrapper)
9. [ ] `src/components/data-display/GlassLoadingSkeleton.test.tsx` - className forwarding issue
10. [ ] `src/components/dashboard/GlassStatCard.test.tsx` - Snapshot failure
11. [ ] `src/components/interactive/GlassUserPresence.test.tsx`
12. [ ] `src/components/input/GlassTransferList.test.tsx` - ✅ FIXED (Default props)
13. [ ] `src/components/atmospheric/GlassAuroraDisplay.test.tsx` - Missing form labels
14. [ ] `src/components/input/GlassFileUpload.test.tsx` - aria-allowed-role violation
15. [ ] `src/components/image-list/ImageListItem.test.tsx` - Snapshot failure
16. [ ] `src/components/visual-feedback/StateIndicator.test.tsx` - ✅ FIXED (Import issue)
17. [ ] `src/components/modal/GlassDialog.test.tsx` - aria-label test failing
18. [ ] `src/components/ui-components/GlassCheckboxUI.test.tsx` - Accessibility violation
19. [ ] `src/components/modal/GlassTooltip.test.tsx` - Snapshot + aria-label test failing
20. [ ] `src/components/immersive/GlassVortexPortal.test.tsx`
21. [ ] `src/__tests__/components/GlassButton.test.tsx`
22. [ ] `src/components/dashboard/GlassMetricCard.test.tsx` - Snapshot failure
23. [ ] `src/components/dashboard/GlassChartWidget.test.tsx`
24. [ ] `src/components/layout/ZSpaceAppLayout.test.tsx`
25. [ ] `src/components/navigation/components/CollapsedMenu.test.tsx`
26. [ ] `src/components/ecommerce/GlassEcommerceProvider.test.tsx` - Snapshot failure
27. [ ] `src/components/templates/interactive/GlassDataTable.test.tsx`
28. [ ] `src/components/interactive/PageTransitionDemo.test.tsx`
29. [ ] `src/components/input/GlassStepLabel.test.tsx`
30. [ ] `src/components/data-display/GlassTimeline.test.tsx`
31. [ ] `src/components/button/GlassFab.test.tsx` - Snapshot failure
32. [ ] `src/components/immersive/Glass360Viewer.test.tsx`
33. [ ] `src/components/data-display/GlassAvatar.test.tsx`
34. [ ] `src/components/layout/GlassSeparator.test.tsx`
35. [ ] `src/components/charts/components/KpiChart.test.tsx`
36. [ ] `src/components/social/GlassSharedWhiteboard.test.tsx`
37. [ ] `src/components/input/GlassStep.test.tsx`
38. [ ] `src/components/layout/GlassSplitPane.test.tsx`
39. [ ] `src/components/tree-view/TreeItem.test.tsx`
40. [ ] `src/components/social/GlassVoiceWaveform.test.tsx`
41. [ ] `src/components/mobile/GlassActionSheet.test.tsx`
42. [ ] `src/components/visual-feedback/RippleButton.test.tsx`
43. [ ] `src/components/navigation/components/ScrollButtons.test.tsx`
44. [ ] `src/components/input/GlassToggle.test.tsx`
45. [ ] `src/components/ai/AIGlassThemeProvider.test.tsx` - Snapshot failure
46. [ ] `src/components/input/GlassSwitch.test.tsx`
47. [ ] `src/components/modal/GlassPopover.test.tsx`
48. [ ] `src/components/navigation/GlassToolbar.test.tsx`
49. [ ] `src/components/quantum/GlassWaveFunction.test.tsx`
50. [ ] `src/components/collaboration/GlassCollaborationDashboard.test.tsx` - ✅ FIXED (Provider wrapper)
51. [ ] `src/components/interactive/GlassCoachmarks.test.tsx`
52. [ ] `src/components/collaboration/GlassCollaborativeCursor.test.tsx` - ✅ FIXED (Provider wrapper)
53. [ ] `src/components/input/GlassStepIcon.test.tsx` - Snapshot failure
54. [ ] `src/components/accessibility/AccessibilityProvider.test.tsx` - Snapshot failure
55. [ ] `src/components/navigation/GlassCommandBar.test.tsx` - Snapshot failure
56. [ ] `src/components/GlassErrorBoundary.test.tsx` - Snapshot failure
57. [ ] `src/components/interactive/GlassFocusRing.test.tsx`
58. [ ] `src/components/button/GlassMagneticButton.test.tsx` - Snapshot failure
59. [ ] `src/components/advanced/IntelligentColorSystem.test.tsx`
60. [ ] `src/components/interactive/GlassKeyValueEditor.test.tsx`
61. [ ] `src/components/collaboration/GlassCollaborationProvider.test.tsx` - Snapshot failure
62. [ ] `src/components/media/GlassMediaProvider.test.tsx` - Snapshot failure
63. [ ] `src/components/charts/components/ChartRenderer.test.tsx`
64. [ ] `src/components/interactive/GlassThemeSwitcher.test.tsx`
65. [ ] `src/components/cms/GlassComponentPalette.test.tsx` - Snapshot failure
66. [ ] `src/components/image/GlassIntelligentImageUploader.test.tsx` - Snapshot failure
67. [ ] `src/components/quantum/GlassSuperpositionalMenu.test.tsx` - Snapshot failure
68. [ ] `src/components/cms/GlassCanvas.test.tsx` - Snapshot failure
69. [ ] `src/components/interactive/GlassVideoPlayer.test.tsx` - ✅ FIXED (Button aria-labels)

**Note:** Extract complete list from logs.txt using:
```bash
grep "^FAIL" logs.txt | awk '{print $2}' | sort -u
```

---

## Priority Fix Order

### Phase 1: Quick Wins (High Impact, Low Effort)
1. ✅ Provider wrappers (5 files) - DONE
2. ✅ Missing default props (2 files) - DONE
3. ✅ Import/export fixes (1 file) - DONE
4. [ ] Snapshot updates (27 files) - Run `jest -u` after all fixes
5. [ ] Button aria-labels (68+ buttons) - Search and fix systematically

### Phase 2: Accessibility (High Impact, Medium Effort)
1. [ ] Form element labels (select, input, textarea)
2. [ ] Landmark structure fixes
3. [ ] Navigation accessible names
4. [ ] ARIA attribute forwarding

### Phase 3: Test Logic (Medium Impact, Low Effort)
1. [ ] Fix test expectations to match component structure
2. [ ] Update queries to find elements correctly
3. [ ] Fix custom props forwarding tests

### Phase 4: Component Fixes (Medium Impact, Medium Effort)
1. [ ] Ensure all components forward className and data-testid
2. [ ] Add default props where needed
3. [ ] Fix prop type definitions

---

## Automated Fix Commands

### Update All Snapshots
```bash
pnpm test -- -u
```

### Run Specific Test File
```bash
pnpm test GlassPagination.test.tsx
```

### Find All Buttons Without aria-label
```bash
grep -r "<button\|<GlassButton" src/components --include="*.tsx" | grep -v "aria-label"
```

### Find All Select Elements Without Labels
```bash
grep -r "<select" src/components --include="*.tsx" | grep -v "aria-label\|aria-labelledby\|<label"
```

### Find All Components Using useEcommerce
```bash
grep -r "useEcommerce" src/components --include="*.tsx" | grep -v "GlassEcommerceProvider"
```

### Find All Components Using useCollaboration
```bash
grep -r "useCollaboration" src/components --include="*.tsx" | grep -v "GlassCollaborationProvider"
```

---

## Progress Tracking

### Completed ✅
- Provider wrappers: 5/5 (100%)
- Missing default props: 2/2 (100%)
- Import/export fixes: 1/1 (100%)
- Component accessibility fixes: 3/3 (100%)
- Test logic fixes: 1/1 (100%)

### In Progress ⏳
- Snapshot updates: 0/27 (0%)
- Button aria-labels: 9/68+ (~13%)
- Form element labels: 2/10+ (20%)

### Remaining 📋
- ~135 test files need review and fixes
- Various accessibility violations
- Component prop forwarding issues

---

## Next Steps

1. **Extract complete list** of failing test files from logs.txt
2. **Categorize each file** by failure type
3. **Create batch fix scripts** for common patterns
4. **Fix systematically** by category
5. **Update snapshots** after all fixes
6. **Run full test suite** to verify fixes

---

## Notes

- Some fixes may require component changes, not just test changes
- Snapshot updates should be done last, after all component fixes
- Review snapshot diffs carefully before committing
- Some accessibility fixes may require design decisions
- Provider wrappers are the quickest wins - focus on these first

