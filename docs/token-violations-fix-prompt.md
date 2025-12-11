# Token Violations Fix - Completion Prompt

## Status Summary

**Completed:** 59 components fixed  
**Remaining:** ~200+ components still need fixes

## Core Requirements

### 1. Design Token Replacements

Replace all hardcoded values with design tokens from `src/tokens/designConstants.ts`:

#### Colors
- **Hex colors** (`#FF6B6B`, `#8B5CF6`, etc.) → `var(--glass-color-*)` or `COLORS.*`
- **RGBA values** (`rgba(100, 150, 255, 0.8)`) → `color-mix(in srgb, var(--glass-color-*) <percentage>%, transparent)`
- **RGB values** → Use CSS variables or color-mix

#### Animation Durations
- **Hardcoded durations** (`300`, `500`, `1000`, `2000`, `3000`, `5000`, `15000`, `30000`) → `ANIMATION.DURATION.*`
  - `50-100ms` → `ANIMATION.DURATION.fast / 2` or `ANIMATION.DURATION.fast`
  - `200-300ms` → `ANIMATION.DURATION.fast` or `ANIMATION.DURATION.normal`
  - `500ms` → `ANIMATION.DURATION.slow`
  - `1000ms` → `ANIMATION.DURATION.slower`
  - `2000-5000ms` → `ANIMATION.DURATION.slower * 2` to `ANIMATION.DURATION.slower * 5`
  - `15000ms+` → `ANIMATION.DURATION.slower * 25` or `ANIMATION.DURATION.slower * 50`

#### Animation Easing/Spring
- **Hardcoded spring configs** (`stiffness: 400, damping: 25`) → `ANIMATION.SPRING.stiff` or `ANIMATION.SPRING.default`
- **Hardcoded easing** → `ANIMATION.EASING.*`

#### Border Radius
- **Hardcoded radius** (`8px`, `12px`, `18px`, `24px`) → `BORDER_RADIUS.*`
  - `4px` → `BORDER_RADIUS.xs`
  - `8px` → `BORDER_RADIUS.sm`
  - `12px` → `BORDER_RADIUS.md`
  - `16px` → `BORDER_RADIUS.lg`
  - `18px` → `BORDER_RADIUS.xl`
  - `24px+` → `BORDER_RADIUS.2xl`

#### Opacity/Blur
- **Hardcoded opacity** (`0.5`, `0.6`, `0.8`) → `var(--glass-opacity-50)`, `var(--glass-opacity-60)`, `var(--glass-opacity-80)`
- **Hardcoded blur** → Use CSS variables or design tokens

### 2. Accessibility Requirements

#### ContrastGuard Integration
- Wrap all text elements over glass backgrounds with `<ContrastGuard>`
- Import: `import { ContrastGuard } from "../../components/accessibility/ContrastGuard";`
- Example:
  ```tsx
  <ContrastGuard>
    <span>{textContent}</span>
  </ContrastGuard>
  ```

#### ARIA Attributes
- Add appropriate ARIA attributes to interactive elements:
  - `aria-label` for buttons/icons without visible text
  - `aria-labelledby` / `aria-describedby` for complex components
  - `role` attributes where needed
  - `aria-expanded`, `aria-modal`, `aria-hidden`, `aria-selected` as appropriate

#### Reduced Motion
- Always respect `prefers-reduced-motion`:
  - Import: `import { useReducedMotion } from "../../hooks/useReducedMotion";` or use `useMotionPreferenceContext`
  - Gate animations: `if (prefersReducedMotion) return;` or `prefersReducedMotion ? {} : { ...animation }`
  - Set duration to 0 when reduced motion: `transition: { duration: prefersReducedMotion ? 0 : ANIMATION.DURATION.normal / 1000 }`

### 3. Common Patterns

#### Import Pattern
```tsx
import { ANIMATION, COLORS, BORDER_RADIUS } from "../../tokens/designConstants";
import { ContrastGuard } from "../../components/accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";
```

#### Color Replacement Pattern
```tsx
// Before
rgba(100, 150, 255, 0.8)
// After
color-mix(in srgb, var(--glass-color-info) 80%, transparent)

// Before
#8B5CF6
// After
var(--glass-color-secondary)

// Before
rgba(255, 255, 255, 0.3)
// After
color-mix(in srgb, var(--glass-white) 30%, transparent)
```

#### Duration Replacement Pattern
```tsx
// Before
setInterval(callback, 2000)
// After
setInterval(callback, ANIMATION.DURATION.slower * 3)

// Before
transition: { duration: 0.2 }
// After
transition: { duration: ANIMATION.DURATION.fast / 1000 }

// Before
className="duration-300"
// After
className={`duration-[${ANIMATION.DURATION.normal}ms]`}
```

#### Border Radius Replacement Pattern
```tsx
// Before
style={{ borderRadius: 18 }}
// After
style={{ borderRadius: BORDER_RADIUS.xl }}

// Before
className="rounded-lg"
// After (if using inline style)
style={{ borderRadius: BORDER_RADIUS.lg }}
```

## Remaining Components to Fix

### Highest Priority (Most Violations - 20+)
1. **"TooltipStyles"** (28 violations) - `src/components/charts/styles/TooltipStyles.tsx` - **ALREADY FIXED** ✅
2. **"ChartContainerStyles"** (27 violations) - Check chart container style files
3. **"GlassMultiSelect"** (26 violations) - `src/components/input/GlassMultiSelect.tsx`
4. **"ChartElementStyles"** (25 violations) - `src/components/charts/styles/ChartElementStyles.tsx` - **ALREADY FIXED** ✅
5. **"SpeedDial"** (22 violations) - Search for SpeedDial component
6. **"IntelligentColorSystem"** (21 violations) - `src/components/advanced/IntelligentColorSystem.tsx`
7. **"GlassGradientPicker"** (21 violations) - Search for gradient picker component

### High Priority (10-20 violations)
8. **"GlassDataChart"** (18 violations) - `src/components/charts/GlassDataChart.tsx`
9. **"GlassTransitions"** (16 violations) - `src/components/animations/GlassTransitions.tsx`
10. **"BrandColorIntegration"** (15 violations) - `src/components/advanced/BrandColorIntegration.tsx`
11. **"OrganicAnimationEngine"** (13 violations) - `src/components/animations/OrganicAnimationEngine.tsx`
12. **"styled"** (12 violations) - Check styled-components usage across codebase
13. **"GlassMoodRing"** (12 violations) - `src/components/experiential/GlassMoodRing.tsx` - **ALREADY FIXED** ✅
14. **"GlassDataGrid"** (12 violations) - `src/components/data-display/GlassDataGrid.tsx`
15. **"GlassReactions"** (11 violations) - `src/components/advanced/GlassReactions.tsx`
16. **"GlassCoherenceIndicator"** (11 violations) - `src/components/quantum/GlassCoherenceIndicator.tsx` - **ALREADY FIXED** ✅
17. **"GlassQuantumTunnel"** (10 violations) - `src/components/quantum/GlassQuantumTunnel.tsx` - **ALREADY FIXED** ✅
18. **"GlassDepthLayer"** (10 violations) - `src/components/surfaces/GlassDepthLayer.tsx` - **ALREADY FIXED** ✅
19. **"GlassAutoComposer"** (10 violations) - `src/components/advanced/GlassAutoComposer.tsx`

### Medium Priority (7-9 violations)
20. **"HoudiniGlassProvider"** (9 violations) - `src/components/houdini/HoudiniGlassProvider.tsx`
21. **"GlassCollaborativeComments"** (9 violations) - `src/components/collaboration/GlassCollaborativeComments.tsx` - **ALREADY FIXED** ✅
22. **"GlassChartsDemo"** (9 violations) - Search for charts demo component
23. **"FrostedGlass"** (9 violations) - `src/components/surfaces/FrostedGlass.tsx` - **ALREADY FIXED** ✅
24. **"StateIndicator"** (8 violations) - `src/components/visual-feedback/StateIndicator.tsx` - **ALREADY FIXED** ✅
25. **"GlassPrismComparison"** (8 violations) - `src/components/website-components/GlassPrismComparison.tsx` - **ALREADY FIXED** ✅
26. **"GlassHeader"** (8 violations) - `src/components/navigation/GlassHeader.tsx` - **ALREADY FIXED** ✅
27. **"GlassChart"** (8 violations) - `src/components/charts/GlassChart.tsx` - **ALREADY FIXED** ✅
28. **"GlassBiomeSimulator"** (8 violations) - `src/components/atmospheric/GlassBiomeSimulator.tsx` - **ALREADY FIXED** ✅
29. **"GlassARPreview"** (8 violations) - `src/components/immersive/GlassARPreview.tsx`
30. **"ChartTooltip"** (8 violations) - `src/components/charts/components/ChartTooltip.tsx`

### Lower Priority (4-7 violations)
- **"TreeView"** (7 violations) - `src/components/tree-view/TreeView.tsx` - **ALREADY FIXED** ✅
- **"TreeItem"** (7 violations) - `src/components/tree-view/TreeItem.tsx` - **ALREADY FIXED** ✅
- **"PageTransitionDemo"** (7 violations) - `src/components/interactive/PageTransitionDemo.tsx` - **ALREADY FIXED** ✅
- **"ModularGlassDataChart"** (7 violations) - `src/components/charts/ModularGlassDataChart.tsx` - **ALREADY FIXED** ✅
- **"GlobalCookieConsent"** (7 violations) - `src/components/cookie-consent/GlobalCookieConsent.tsx` - **ALREADY FIXED** ✅
- **"GlassWipeSlider"** (7 violations) - `src/components/website-components/GlassWipeSlider.tsx` - **ALREADY FIXED** ✅
- **"GlassWeatherGlass"** (7 violations) - `src/components/atmospheric/GlassWeatherGlass.tsx` - **ALREADY FIXED** ✅
- **"GlassVortexPortal"** (7 violations) - `src/components/immersive/GlassVortexPortal.tsx` - **ALREADY FIXED** ✅
- **"GlassSocialFeed"** (7 violations) - `src/components/social/GlassSocialFeed.tsx` - **ALREADY FIXED** ✅
- **"GlassSidebar"** (7 violations) - `src/components/navigation/GlassSidebar.tsx` - **ALREADY FIXED** ✅
- **"GlassParticleField"** (7 violations) - `src/components/immersive/GlassParticleField.tsx`
- **"GlassMeshGradient"** (7 violations) - `src/components/advanced/GlassMeshGradient.tsx`
- **"GlassIslandLayout"** (7 violations) - `src/components/layouts/GlassIslandLayout.tsx` - **ALREADY FIXED** ✅
- **"GlassCollaborativeCursor"** (7 violations) - `src/components/collaboration/GlassCollaborativeCursor.tsx` - **ALREADY FIXED** ✅
- **"EnhancedGlassTabs"** (7 violations) - `src/components/navigation/EnhancedGlassTabs.tsx` - **ALREADY FIXED** ✅
- **"ChartRenderer"** (7 violations) - `src/components/charts/components/ChartRenderer.tsx`
- **"SeasonalParticles"** (6 violations) - `src/components/effects/SeasonalParticles.tsx`
- **"GlassWaveFunction"** (6 violations) - `src/components/quantum/GlassWaveFunction.tsx` - **ALREADY FIXED** ✅
- **"GlassVoiceInput"** (6 violations) - `src/components/interactive/GlassVoiceInput.tsx` - **ALREADY FIXED** ✅
- **"GlassPerformanceOptimization"** (6 violations) - `src/components/advanced/GlassPerformanceOptimization.tsx` - **ALREADY FIXED** ✅
- **"GlassProbabilityCloud"** (4 violations) - `src/components/quantum/GlassProbabilityCloud.tsx`
- **"GlassFluidSimulation"** (4 violations) - `src/components/immersive/GlassFluidSimulation.tsx`
- **"Glass3DEngine"** (4 violations) - `src/components/effects/Glass3DEngine.tsx`
- **"GalileoElementInteractionPlugin"** (4 violations) - `src/components/charts/plugins/GalileoElementInteractionPlugin.tsx`
- **"ContextAwareGlass"** (4 violations) - Search for this component
- **"WidgetGlass"** (3 violations) - Search for this component
- **"TouchGlassOptimization"** (3 violations) - Search for this component

**Note:** Components marked with ✅ have already been fixed. Focus on the remaining unfixed components.

## Step-by-Step Process

### For Each Component:

1. **Read the file** and identify violations:
   ```bash
   grep -E "#[0-9A-Fa-f]{6}|rgba\(|duration|transition|setInterval|setTimeout|borderRadius|blur|opacity|#[0-9A-Fa-f]{3}\b" src/components/path/to/Component.tsx
   ```

2. **Add necessary imports** at the top:
   ```tsx
   import { ANIMATION, COLORS, BORDER_RADIUS } from "../../tokens/designConstants";
   import { ContrastGuard } from "../../components/accessibility/ContrastGuard";
   import { useReducedMotion } from "../../hooks/useReducedMotion";
   ```

3. **Replace hardcoded values** systematically:
   - Colors → CSS variables or color-mix
   - Durations → ANIMATION.DURATION tokens
   - Border radius → BORDER_RADIUS tokens
   - Opacity → CSS variables

4. **Wrap text with ContrastGuard**:
   - Find all text elements (especially over glass backgrounds)
   - Wrap with `<ContrastGuard>`

5. **Add ARIA attributes** where missing:
   - Interactive elements need `aria-label` or `aria-labelledby`
   - Complex components need proper roles

6. **Respect reduced motion**:
   - Check if component uses animations
   - Gate animations with `prefersReducedMotion` checks

7. **Remove TODO/FIXME comments** once addressed

8. **Run linter** to verify:
   ```bash
   read_lints paths: ['src/components/path/to/Component.tsx']
   ```

## Special Cases

### Canvas/WebGL Components
- For canvas fillStyle/strokeStyle, use `color-mix` in string format:
  ```tsx
  ctx.fillStyle = `color-mix(in srgb, var(--glass-color-primary) ${alpha * 100}%, transparent)`;
  ```

### Tailwind Classes
- For Tailwind duration classes, use template literals:
  ```tsx
  className={`transition-all duration-[${ANIMATION.DURATION.fast}ms]`}
  ```

### Inline Styles
- Replace hardcoded values in style objects:
  ```tsx
  style={{ borderRadius: BORDER_RADIUS.lg, opacity: 'var(--glass-opacity-80)' }}
  ```

### Semantic Colors
- Some colors may be semantic (e.g., weather colors, nebula colors). These can remain if they're domain-specific, but generic colors should be replaced.

## Verification Checklist

After fixing each component, verify:
- [ ] All hex colors replaced with CSS variables or color-mix
- [ ] All rgba values replaced with color-mix
- [ ] All hardcoded durations replaced with ANIMATION tokens
- [ ] All hardcoded border radius replaced with BORDER_RADIUS tokens
- [ ] Text over glass wrapped with ContrastGuard
- [ ] ARIA attributes added where needed
- [ ] Reduced motion respected
- [ ] TODO/FIXME comments removed
- [ ] No linter errors
- [ ] Component still functions correctly

## Batch Processing Strategy

1. Process components in batches of 5-10
2. Focus on high-violation components first
3. Use grep to find violations before reading files
4. Fix systematically: imports → colors → durations → accessibility
5. Test each batch before moving to next

## Key Files Reference

- **Design Tokens:** `src/tokens/designConstants.ts`
- **ContrastGuard:** `src/components/accessibility/ContrastGuard.tsx`
- **Reduced Motion Hook:** `src/hooks/useReducedMotion.ts` or `src/contexts/MotionPreferenceContext.tsx`
- **Violations List:** `reports/token_violations.csv`

## Example Fix

### Before:
```tsx
const gradient = ctx.createLinearGradient(0, height, 0, 0);
gradient.addColorStop(0, "rgba(100, 150, 255, 0.8)");
gradient.addColorStop(1, "rgba(200, 220, 255, 0.4)");

setTimeout(() => {
  updateState();
}, 2000);

<div style={{ borderRadius: 18 }}>
  <span>{text}</span>
</div>
```

### After:
```tsx
import { ANIMATION, BORDER_RADIUS } from "../../tokens/designConstants";
import { ContrastGuard } from "../../components/accessibility/ContrastGuard";

const gradient = ctx.createLinearGradient(0, height, 0, 0);
gradient.addColorStop(0, "color-mix(in srgb, var(--glass-color-info) 80%, transparent)");
gradient.addColorStop(1, "color-mix(in srgb, var(--glass-color-info) 40%, transparent)");

setTimeout(() => {
  updateState();
}, ANIMATION.DURATION.slower * 3);

<div style={{ borderRadius: BORDER_RADIUS.xl }}>
  <ContrastGuard>
    <span>{text}</span>
  </ContrastGuard>
</div>
```

## Quick Reference Cheat Sheet

### Common Replacements

| Before | After |
|--------|-------|
| `rgba(100, 150, 255, 0.8)` | `color-mix(in srgb, var(--glass-color-info) 80%, transparent)` |
| `#8B5CF6` | `var(--glass-color-secondary)` |
| `#FF6B6B` | `var(--glass-color-danger)` |
| `#00FF00` | `var(--glass-color-success)` |
| `rgba(255, 255, 255, 0.3)` | `color-mix(in srgb, var(--glass-white) 30%, transparent)` |
| `rgba(0, 0, 0, 0.1)` | `color-mix(in srgb, var(--glass-black) 10%, transparent)` |
| `duration: 200` | `duration: ANIMATION.DURATION.fast` |
| `duration: 300` | `duration: ANIMATION.DURATION.normal` |
| `duration: 500` | `duration: ANIMATION.DURATION.slow` |
| `duration: 1000` | `duration: ANIMATION.DURATION.slower` |
| `setInterval(..., 2000)` | `setInterval(..., ANIMATION.DURATION.slower * 3)` |
| `setTimeout(..., 5000)` | `setTimeout(..., ANIMATION.DURATION.slower * 7)` |
| `borderRadius: 8` | `borderRadius: BORDER_RADIUS.sm` |
| `borderRadius: 12` | `borderRadius: BORDER_RADIUS.md` |
| `borderRadius: 18` | `borderRadius: BORDER_RADIUS.xl` |
| `opacity: 0.8` | `opacity: 'var(--glass-opacity-80)'` |
| `className="duration-300"` | `className={\`duration-[${ANIMATION.DURATION.normal}ms]\`}` |

### Import Template
```tsx
import { ANIMATION, COLORS, BORDER_RADIUS } from "../../tokens/designConstants";
import { ContrastGuard } from "../../components/accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";
// or
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
```

### Text Wrapping Template
```tsx
<ContrastGuard>
  <span>{textContent}</span>
</ContrastGuard>
```

### Reduced Motion Template
```tsx
const prefersReducedMotion = useReducedMotion();
// or
const { prefersReducedMotion } = useMotionPreferenceContext();

// In animation
animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
transition={prefersReducedMotion ? { duration: 0 } : { duration: ANIMATION.DURATION.normal / 1000 }}
```

## Notes

- Some components may have semantic colors that should remain (e.g., weather colors, nebula colors)
- Always preserve functionality while replacing tokens
- When in doubt, use CSS variables over hardcoded values
- Test components after fixes to ensure they still work
- Some violations may be false positives - verify before fixing
- For canvas/WebGL contexts, use string interpolation with color-mix
- Tailwind classes need template literals for dynamic values

## Completion Goal

Fix all remaining ~200+ components systematically, ensuring:
1. All hardcoded values replaced with design tokens
2. All text over glass wrapped with ContrastGuard
3. All components respect reduced motion preferences
4. All interactive elements have proper ARIA attributes
5. No linter errors remain
6. All TODO/FIXME comments addressed

## Workflow Command Reference

```bash
# Find violations in a component
grep -E "#[0-9A-Fa-f]{6}|rgba\(|duration|transition|setInterval|setTimeout|borderRadius|blur|opacity|#[0-9A-Fa-f]{3}\b" src/components/path/to/Component.tsx

# Check remaining violations count
tail -n +2 reports/token_violations.csv | cut -d',' -f1 | sort | uniq -c | sort -rn | head -20

# Check linter errors
read_lints paths: ['src/components/path/to/Component.tsx']
```
