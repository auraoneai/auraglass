# Autonomous Test Fix Execution Prompt

## Mission
You are tasked with autonomously fixing all 147 failing test suites, 397 failing tests, and 27 failed snapshots identified in `FAILURE_ANALYSIS.md`. You must work systematically through every category and file without interruption, updating the analysis document as you progress.

## Critical Directives

### Primary Rule: NO PAUSES, NO UPDATES, NO INTERRUPTIONS
- **NEVER pause** or send interim updates during execution
- **NEVER request** feedback, clarification, or confirmation
- **NEVER interrupt** the user for any reason
- Work continuously and independently until ALL tasks are complete
- Only provide a final comprehensive status report after everything is finished

### Document Update Requirement
- **IMMEDIATELY update** `FAILURE_ANALYSIS.md` upon completion of each task
- Mark completed items with ✅
- Update progress counters in the document
- Track which files have been fixed

### Task Management
- Add ALL remaining tasks to your immediate todo list at the start
- Work through tasks systematically by category
- Complete one category before moving to the next
- Update todos as you progress

## Execution Plan

### Phase 1: Quick Wins (High Impact, Low Effort)

#### Task 1.1: Provider Wrappers
**Status**: 5/5 files fixed, ~41 remaining

**Action Items**:
1. Search codebase for all components using `useEcommerce` hook
2. Search codebase for all components using `useCollaboration` hook
3. For each test file that renders these components:
   - Add provider import
   - Create TestWrapper component
   - Wrap all render() calls with `{ wrapper: TestWrapper }`
   - Update FAILURE_ANALYSIS.md to mark as fixed

**Files to Fix**:
- All ecommerce component tests using `useEcommerce`
- All collaboration component tests using `useCollaboration`
- Any other provider-dependent tests

**Fix Pattern**:
```typescript
import { EcommerceProvider } from '@/components/ecommerce/GlassEcommerceProvider';
// OR
import { CollaborationProvider } from '@/components/collaboration/GlassCollaborationProvider';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EcommerceProvider>{children}</EcommerceProvider>
  // OR
  <CollaborationProvider roomId="test-room">{children}</CollaborationProvider>
);

// Update all render calls:
render(<Component />, { wrapper: TestWrapper });
```

#### Task 1.2: Missing Default Props
**Status**: 2/2 files fixed, check for more

**Action Items**:
1. Search for all components using `.map()`, `.filter()`, `.forEach()` on props
2. Identify props that could be undefined
3. Add default values (empty arrays/objects) where appropriate
4. Update component interfaces to make props optional
5. Update FAILURE_ANALYSIS.md

**Fix Pattern**:
```typescript
// Before
export interface Props {
  items: Item[];
}
export function Component({ items }: Props) {
  return items.map(...); // ❌ Crashes if undefined
}

// After
export interface Props {
  items?: Item[];
}
export function Component({ items = [] }: Props) {
  return items.map(...); // ✅ Safe
}
```

#### Task 1.3: Import/Export Fixes
**Status**: 1/1 file fixed, check for more

**Action Items**:
1. Find all test files with import errors
2. Check component export type (default vs named)
3. Fix imports to match exports
4. Update FAILURE_ANALYSIS.md

### Phase 2: Accessibility Fixes (High Impact, Medium Effort)

#### Task 2.1: Button aria-labels
**Status**: 9/68+ buttons fixed (~13%)

**Action Items**:
1. Search codebase for all `<button>` and `<GlassButton>` elements
2. Identify icon-only buttons (buttons with only icons, no text)
3. Add descriptive `aria-label` to each icon-only button
4. Ensure buttons have either visible text OR aria-label
5. Update FAILURE_ANALYSIS.md progress

**Search Commands**:
```bash
grep -r "<button\|<GlassButton" src/components --include="*.tsx" | grep -v "aria-label"
```

**Fix Pattern**:
```typescript
// Icon-only button - REQUIRES aria-label
<GlassButton onClick={handleAction} aria-label="Close dialog">
  <XIcon />
</GlassButton>

// Button with text - aria-label optional
<GlassButton onClick={handleAction}>
  Save Changes {/* Visible text is sufficient */}
</GlassButton>
```

#### Task 2.2: Form Element Labels
**Status**: 2/10+ fixed (20%)

**Action Items**:
1. Find all `<input>`, `<select>`, `<textarea>` elements
2. Check if they have labels or aria-label
3. Add labels or aria-label where missing
4. Fix `GlassFileUpload` aria-allowed-role violation (remove role="button" from label)
5. Fix `GlassAuroraDisplay` range input labels
6. Update FAILURE_ANALYSIS.md

**Fix Pattern**:
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

#### Task 2.3: Landmark Structure
**Status**: 1/1 fixed

**Action Items**:
1. Check for nested `<main>` elements
2. Ensure only one `<main>` per page
3. Remove role="application" from containers with main landmarks
4. Update FAILURE_ANALYSIS.md

### Phase 3: Test Logic Fixes (Medium Impact, Low Effort)

#### Task 3.1: Test Expectations
**Status**: 1/3+ fixed

**Action Items**:
1. Fix `GlassDialog.test.tsx` - aria-label test (element not found)
2. Fix `GlassTooltip.test.tsx` - aria-label test (role="tooltip" not found)
3. Review all tests querying by aria-label or role
4. Update queries to match actual component structure
5. Update FAILURE_ANALYSIS.md

**Fix Pattern**:
```typescript
// If aria-label is on wrapper, query container:
const { container } = render(<Component aria-label="Test" />);
const element = container.querySelector('[aria-label="Test"]');
expect(element).toBeInTheDocument();

// Not screen.getByLabelText() if label is on wrapper
```

#### Task 3.2: Custom Props Forwarding
**Status**: 0/1+ fixed

**Action Items**:
1. Fix `GlassLoadingSkeleton.test.tsx` - className forwarding
2. Review components wrapped in `OptimizedGlass` or `Motion`
3. Ensure className and data-testid are forwarded to root element
4. Update FAILURE_ANALYSIS.md

**Fix Pattern**:
```typescript
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

### Phase 4: Snapshot Updates (Low Impact, Low Effort)

#### Task 4.1: Update All Snapshots
**Status**: 0/27 snapshots updated

**Action Items**:
1. **WAIT** until all component fixes are complete
2. Run `pnpm test -- -u` to update all snapshots
3. Review snapshot diffs to ensure changes are expected
4. Update FAILURE_ANALYSIS.md to mark all snapshots as fixed

**Files with Snapshot Failures** (27 total):
1. `src/components/navigation/GlassPagination.test.tsx`
2. `src/components/navigation/GlassMobileNav.test.tsx`
3. `src/components/dashboard/GlassStatCard.test.tsx`
4. `src/components/image-list/ImageListItem.test.tsx`
5. `src/components/modal/GlassTooltip.test.tsx`
6. `src/components/dashboard/GlassMetricCard.test.tsx`
7. `src/components/ecommerce/GlassEcommerceProvider.test.tsx`
8. `src/components/button/GlassFab.test.tsx`
9. `src/components/ai/AIGlassThemeProvider.test.tsx`
10. `src/components/input/GlassStepIcon.test.tsx`
11. `src/components/accessibility/AccessibilityProvider.test.tsx`
12. `src/components/navigation/GlassCommandBar.test.tsx`
13. `src/components/GlassErrorBoundary.test.tsx`
14. `src/components/button/GlassMagneticButton.test.tsx`
15. `src/components/collaboration/GlassCollaborationProvider.test.tsx`
16. `src/components/media/GlassMediaProvider.test.tsx`
17. `src/components/cms/GlassComponentPalette.test.tsx`
18. `src/components/image/GlassIntelligentImageUploader.test.tsx`
19. `src/components/quantum/GlassSuperpositionalMenu.test.tsx`
20. `src/components/cms/GlassCanvas.test.tsx`
21-27. (Additional snapshot failures to be identified)

## Execution Workflow

### Step 1: Initialization
1. Read `FAILURE_ANALYSIS.md` completely
2. Extract all failing test files from logs.txt
3. Create comprehensive todo list with ALL tasks
4. Categorize each file by failure type
5. Prioritize tasks by impact and effort

### Step 2: Systematic Execution
For each category in priority order:
1. Identify all files in that category
2. Fix each file systematically
3. After each file fix:
   - Update FAILURE_ANALYSIS.md (mark as ✅)
   - Update progress counters
   - Update todo list
4. Move to next file without pausing
5. Complete entire category before moving to next

### Step 3: Verification
1. After all fixes complete, run full test suite
2. Verify all tests pass
3. Update FAILURE_ANALYSIS.md with final status

### Step 4: Final Report
Only after ALL tasks are complete, provide:
- Total files fixed
- Total tests fixed
- Total snapshots updated
- Summary of changes made
- Any remaining issues (if any)

## File-by-File Checklist

Work through this list systematically, marking each as complete in FAILURE_ANALYSIS.md:

### Provider Wrappers (~41 remaining)
- [ ] Find all ecommerce components using `useEcommerce`
- [ ] Find all collaboration components using `useCollaboration`
- [ ] Fix each test file with provider wrapper
- [ ] Update FAILURE_ANALYSIS.md after each fix

### Missing Default Props
- [ ] Search for components with array/object props used in `.map()/.filter()`
- [ ] Add default values to each
- [ ] Update FAILURE_ANALYSIS.md

### Button aria-labels (~59 remaining)
- [ ] Find all icon-only buttons
- [ ] Add aria-label to each
- [ ] Update FAILURE_ANALYSIS.md progress

### Form Element Labels (~8 remaining)
- [ ] Fix `GlassAuroraDisplay` range inputs
- [ ] Fix `GlassFileUpload` aria-allowed-role
- [ ] Find and fix other form elements
- [ ] Update FAILURE_ANALYSIS.md

### Test Logic Fixes (~2 remaining)
- [ ] Fix `GlassDialog.test.tsx`
- [ ] Fix `GlassTooltip.test.tsx`
- [ ] Fix `GlassLoadingSkeleton.test.tsx`
- [ ] Update FAILURE_ANALYSIS.md

### Snapshot Updates (27 files)
- [ ] Wait until all component fixes complete
- [ ] Run `pnpm test -- -u`
- [ ] Review diffs
- [ ] Update FAILURE_ANALYSIS.md

## Success Criteria

All tasks are complete when:
- ✅ All 147 test suites pass
- ✅ All 397 tests pass
- ✅ All 27 snapshots updated
- ✅ FAILURE_ANALYSIS.md fully updated with ✅ marks
- ✅ No remaining failing tests

## Important Notes

1. **Never pause** - Work continuously through all tasks
2. **Update document immediately** - After each fix, update FAILURE_ANALYSIS.md
3. **No interim reports** - Only final comprehensive report
4. **Use your judgment** - Make decisions autonomously
5. **Fix systematically** - One category at a time, one file at a time
6. **Verify fixes** - Run tests after each category to ensure fixes work

## Commands Reference

```bash
# Find components using useEcommerce
grep -r "useEcommerce" src/components --include="*.tsx" | grep -v "GlassEcommerceProvider"

# Find components using useCollaboration
grep -r "useCollaboration" src/components --include="*.tsx" | grep -v "GlassCollaborationProvider"

# Find buttons without aria-label
grep -r "<button\|<GlassButton" src/components --include="*.tsx" | grep -v "aria-label"

# Find select elements without labels
grep -r "<select" src/components --include="*.tsx" | grep -v "aria-label\|aria-labelledby\|<label"

# Update all snapshots
pnpm test -- -u

# Run specific test file
pnpm test GlassPagination.test.tsx

# Run full test suite
pnpm test
```

## Begin Execution

Start immediately. Work through every task systematically. Update FAILURE_ANALYSIS.md continuously. Complete all work before providing final report.

**DO NOT PAUSE. DO NOT UPDATE. WORK AUTONOMOUSLY UNTIL COMPLETE.**

