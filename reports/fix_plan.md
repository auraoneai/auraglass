# AuraGlass Compliance Fix Plan

**Version**: 1.0
**Created**: 2025-11-07
**Estimated Effort**: 4-5 weeks (1 engineer)

---

## Overview

This document outlines the systematic remediation strategy to achieve 100% compliance with the AuraGlass design token system, WCAG AA accessibility standards, and glassmorphism best practices.

---

## Fix Strategy Summary

### Approach: **Automated Codemods + Manual Review + Testing**

1. **Phase 1**: Automated token migration (codemods)
2. **Phase 2**: Automated ContrastGuard injection
3. **Phase 3**: Automated ARIA attribute addition
4. **Phase 4**: Manual review & TypeScript fixes
5. **Phase 5**: Comprehensive testing & validation

---

## Phase 1: Token Migration (Week 1)

### 1.1 Opacity Token Migration

**Target**: 342 violations
**Tool**: Automated codemod
**Estimated Time**: 2 hours + 1 hour review

#### Codemod Script

```javascript
// scripts/codemods/migrate-opacity-tokens.js
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Pattern 1: rgba(255, 255, 255, 0.X) → var(--glass-opacity-X0)
  root.find(j.Literal).forEach(path => {
    if (typeof path.value.value === 'string') {
      const rgba = path.value.value;

      // Match: rgba(255, 255, 255, 0.10)
      const match = rgba.match(/rgba\(255,\s*255,\s*255,\s*0\.(\d+)\)/);
      if (match) {
        const opacity = match[1].padStart(2, '0');
        path.value.value = rgba.replace(
          /rgba\(255,\s*255,\s*255,\s*0\.\d+\)/,
          `rgba(var(--glass-color-white) / var(--glass-opacity-${opacity}))`
        );
      }

      // Match: rgba(0, 0, 0, 0.X)
      const matchBlack = rgba.match(/rgba\(0,\s*0,\s*0,\s*0\.(\d+)\)/);
      if (matchBlack) {
        const opacity = matchBlack[1].padStart(2, '0');
        path.value.value = rgba.replace(
          /rgba\(0,\s*0,\s*0,\s*0\.\d+\)/,
          `rgba(var(--glass-color-black) / var(--glass-opacity-${opacity}))`
        );
      }
    }
  });

  return root.toSource();
};
```

#### Run Command

```bash
npx jscodeshift \
  -t scripts/codemods/migrate-opacity-tokens.js \
  src/components/**/*.tsx \
  --parser=tsx \
  --dry
# Remove --dry after review
```

#### Expected Output

```diff
- background: 'rgba(255, 255, 255, 0.1)'
+ background: 'rgba(var(--glass-color-white) / var(--glass-opacity-10))'

- border: '1px solid rgba(59, 130, 246, 0.3)'
+ border: '1px solid hsl(var(--glass-color-primary) / var(--glass-opacity-30))'
```

---

### 1.2 Blur Token Migration

**Target**: 24 violations (high priority)
**Tool**: Automated codemod
**Estimated Time**: 1 hour + 30min review

#### Codemod Script

```javascript
// scripts/codemods/migrate-blur-tokens.js
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const blurMap = {
    '0px': 'none',
    '2px': 'sm',
    '4px': 'sm',
    '8px': 'md',
    '12px': 'lg',
    '16px': 'lg',
    '24px': 'xl',
    '32px': '2xl',
    '48px': '3xl'
  };

  root.find(j.Literal).forEach(path => {
    if (typeof path.value.value === 'string') {
      const str = path.value.value;

      // Match: blur(8px) → var(--glass-blur-md)
      const match = str.match(/blur\((\d+)px\)/);
      if (match) {
        const pixels = match[1] + 'px';
        const token = blurMap[pixels] || 'md';
        path.value.value = str.replace(
          /blur\(\d+px\)/,
          `var(--glass-blur-${token})`
        );
      }
    }
  });

  // Also handle backdropBlur object properties
  root.find(j.Property, {
    key: { name: 'backdropBlur' },
    value: { type: 'ObjectExpression' }
  }).forEach(path => {
    // Convert { px: 8 } to AURA_GLASS reference
    path.replace(
      j.property(
        'init',
        j.identifier('backdropBlur'),
        j.memberExpression(
          j.memberExpression(
            j.memberExpression(
              j.memberExpression(
                j.identifier('AURA_GLASS'),
                j.identifier('surfaces')
              ),
              j.identifier('neutral')
            ),
            j.identifier('level2')
          ),
          j.identifier('backdropBlur')
        )
      )
    );
  });

  return root.toSource();
};
```

---

### 1.3 Color Token Migration

**Target**: 187 violations
**Tool**: Automated codemod + manual review
**Estimated Time**: 3 hours + 2 hours review

#### Codemod Script

```javascript
// scripts/codemods/migrate-color-tokens.js
const colorMap = {
  '#3b82f6': 'COLORS.semantic.primary',
  '#ef4444': 'COLORS.semantic.error',
  '#10b981': 'COLORS.semantic.success',
  '#f59e0b': 'COLORS.semantic.warning',
  '#6b7280': 'COLORS.semantic.secondary',
  // Add more mappings
};

module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Ensure COLORS is imported
  const hasColorsImport = root.find(j.ImportDeclaration, {
    source: { value: '@/tokens/designConstants' }
  }).length > 0;

  if (!hasColorsImport) {
    // Add import
    const importDecl = j.importDeclaration(
      [j.importSpecifier(j.identifier('COLORS'))],
      j.literal('@/tokens/designConstants')
    );
    root.find(j.Program).get('body', 0).insertBefore(importDecl);
  }

  // Replace hex colors
  root.find(j.Literal).forEach(path => {
    if (typeof path.value.value === 'string') {
      const hex = path.value.value.toLowerCase();
      if (colorMap[hex]) {
        // Replace with token reference
        const tokenPath = colorMap[hex];
        const parts = tokenPath.split('.');

        let expr = j.identifier(parts[0]);
        for (let i = 1; i < parts.length; i++) {
          expr = j.memberExpression(expr, j.identifier(parts[i]));
        }

        path.replace(expr);
      }
    }
  });

  return root.toSource();
};
```

---

### 1.4 Animation Token Migration

**Target**: 304 violations
**Tool**: Automated codemod + useReducedMotion integration
**Estimated Time**: 4 hours + 2 hours review

#### Codemod Pattern

```javascript
// scripts/codemods/migrate-animation-tokens.js
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Pattern 1: Inline duration numbers → ANIMATION.DURATION
  const durationMap = {
    '0': 'instant',
    '50': 'instant',
    '100': 'fast',
    '150': 'fast',
    '200': 'normal',
    '250': 'normal',
    '300': 'normal',
    '400': 'slow',
    '500': 'slow',
    '600': 'slower'
  };

  // Pattern 2: Add useReducedMotion hook
  root.find(j.VariableDeclarator).forEach(path => {
    if (path.value.id.name === 'Component' || /^[A-Z]/.test(path.value.id.name)) {
      // Component found - check if it uses animations
      const componentBody = j(path);
      const hasAnimation = componentBody.find(j.Literal, {
        value: /\d+ms/
      }).length > 0;

      if (hasAnimation) {
        // Add useReducedMotion hook
        const hookCall = j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier('prefersReducedMotion'),
            j.callExpression(j.identifier('useReducedMotion'), [])
          )
        ]);

        // Insert after component declaration
        path.parent.insertAfter(hookCall);
      }
    }
  });

  return root.toSource();
};
```

---

## Phase 2: ContrastGuard Integration (Week 2)

### 2.1 Automated ContrastGuard Wrapper

**Target**: 276 critical violations
**Tool**: AST transformation
**Estimated Time**: 6 hours + 4 hours review

#### Strategy

For every component that:
1. Renders text (`<h1>`, `<p>`, `<span>`, `<div>` with text children)
2. Has a glass background (`backdrop-filter`, `glass` prop, or `AURA_GLASS` usage)
3. Does NOT already have ContrastGuard

→ Wrap the text content in `<ContrastGuard>`

#### Implementation

```typescript
// scripts/codemods/inject-contrast-guard.ts
import * as ts from 'typescript';
import { Project } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json'
});

// Get all component files
const sourceFiles = project.getSourceFiles('src/components/**/*.tsx');

sourceFiles.forEach(file => {
  // Find components with glass backgrounds
  const components = file.getFunctions().filter(fn => {
    const name = fn.getName();
    return name && /^Glass/.test(name);
  });

  components.forEach(component => {
    const returnStatement = component.getFirstDescendantByKind(
      ts.SyntaxKind.ReturnStatement
    );

    if (!returnStatement) return;

    // Check if return value is JSX
    const jsxElement = returnStatement.getExpression();
    if (!jsxElement) return;

    // Check if ContrastGuard already exists
    const hasContrastGuard = jsxElement
      .getText()
      .includes('ContrastGuard');

    if (hasContrastGuard) return;

    // Check if renders text
    const rendersText = /(<h\d|<p|<span|<div[^>]*>[^<]+<)/.test(
      jsxElement.getText()
    );

    if (!rendersText) return;

    // Wrap content in ContrastGuard
    const originalJsx = jsxElement.getText();
    const wrappedJsx = `
      <ContrastGuard minRatio={4.5}>
        ${originalJsx}
      </ContrastGuard>
    `;

    jsxElement.replaceWithText(wrappedJsx);

    // Add import if not present
    if (!file.getImportDeclaration('@/lib/contrastGuard')) {
      file.addImportDeclaration({
        moduleSpecifier: '@/lib/contrastGuard',
        namedImports: ['ContrastGuard']
      });
    }
  });

  file.saveSync();
});

console.log('ContrastGuard injection complete');
```

#### Run Command

```bash
npx ts-node scripts/codemods/inject-contrast-guard.ts
```

#### Expected Output

```diff
 export function GlassCard({ children, ...props }) {
   return (
     <div className="glass-card" {...props}>
+      <ContrastGuard minRatio={4.5}>
         {children}
+      </ContrastGuard>
     </div>
   );
 }
```

---

### 2.2 Manual ContrastGuard Tuning

**Target**: 50 complex components
**Estimated Time**: 8 hours

Some components require manual tuning:

1. **Components with multiple text sections** → Wrap each section separately
2. **Components with dynamic backgrounds** → Use `enableSampling={true}`
3. **Liquid Glass "clear" variant** → Set `minRatio={7.0}`

#### Examples

```tsx
// Complex card with multiple sections
export function GlassStatCard({ title, value, trend, ...props }) {
  return (
    <GlassCard {...props}>
      {/* Header section */}
      <ContrastGuard minRatio={4.5}>
        <h3>{title}</h3>
      </ContrastGuard>

      {/* Value section - higher contrast needed */}
      <ContrastGuard minRatio={7.0}>
        <div className="text-4xl font-bold">{value}</div>
      </ContrastGuard>

      {/* Trend section */}
      <ContrastGuard minRatio={4.5}>
        <span>{trend}</span>
      </ContrastGuard>
    </GlassCard>
  );
}

// Liquid Glass with adaptive sampling
export function LiquidGlassHero({ children, ...props }) {
  return (
    <LiquidGlassMaterial
      variant="clear"
      materialProps={{ ior: 1.38, thickness: 6 }}
      {...props}
    >
      <ContrastGuard
        minRatio={7.0}
        enableSampling={true}
        sampleInterval={100}
      >
        {children}
      </ContrastGuard>
    </LiquidGlassMaterial>
  );
}
```

---

## Phase 3: ARIA Attributes (Week 2-3)

### 3.1 Automated ARIA Addition

**Target**: 156 violations
**Tool**: Automated codemod
**Estimated Time**: 5 hours + 3 hours review

#### Codemod Strategy

1. Find interactive elements without `aria-label`:
   - `<button>` without text or with icon-only
   - `<input>` without associated `<label>`
   - Custom controls (`role="combobox"`, `role="menu"`)

2. Add appropriate ARIA attributes:
   - `aria-label` for icon-only buttons
   - `aria-labelledby` for inputs with visible labels
   - `aria-describedby` for additional context
   - `role` for custom controls

#### Implementation

```javascript
// scripts/codemods/add-aria-labels.js
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Find buttons without aria-label
  root.find(j.JSXElement, {
    openingElement: {
      name: { name: 'button' }
    }
  }).forEach(path => {
    const attrs = path.value.openingElement.attributes;

    // Check if has aria-label or text children
    const hasAriaLabel = attrs.some(attr =>
      attr.name && attr.name.name === 'aria-label'
    );
    const hasTextChildren = j(path).find(j.JSXText).length > 0;

    if (!hasAriaLabel && !hasTextChildren) {
      // Likely icon-only button - add aria-label
      attrs.push(
        j.jsxAttribute(
          j.jsxIdentifier('aria-label'),
          j.literal('Button') // TODO: Improve naming
        )
      );
    }
  });

  // Find inputs without labels
  root.find(j.JSXElement, {
    openingElement: {
      name: { name: /^(input|textarea|select)$/ }
    }
  }).forEach(path => {
    const attrs = path.value.openingElement.attributes;

    const hasLabel = attrs.some(attr =>
      attr.name && (
        attr.name.name === 'aria-label' ||
        attr.name.name === 'aria-labelledby'
      )
    );

    if (!hasLabel) {
      // Add aria-label
      const placeholder = attrs.find(attr =>
        attr.name && attr.name.name === 'placeholder'
      );
      const labelText = placeholder
        ? placeholder.value.value
        : 'Input field';

      attrs.push(
        j.jsxAttribute(
          j.jsxIdentifier('aria-label'),
          j.literal(labelText)
        )
      );
    }
  });

  return root.toSource();
};
```

---

### 3.2 Manual ARIA Review

**Target**: Complex components (modals, menus, custom controls)
**Estimated Time**: 12 hours

#### Checklist per Component Type

**Modals**:
- [ ] `role="dialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` pointing to title
- [ ] `aria-describedby` pointing to description
- [ ] Focus trap implemented
- [ ] Escape key closes modal

**Dropdown Menus**:
- [ ] `role="menu"` on container
- [ ] `role="menuitem"` on items
- [ ] `aria-expanded` on trigger
- [ ] `aria-haspopup="menu"` on trigger
- [ ] Roving tabindex for arrow key navigation
- [ ] Escape key closes menu

**Custom Select**:
- [ ] `role="combobox"`
- [ ] `aria-expanded`
- [ ] `aria-haspopup="listbox"`
- [ ] `aria-activedescendant` for keyboard focus
- [ ] `role="listbox"` on dropdown
- [ ] `role="option"` on items

---

## Phase 4: TypeScript Fixes (Week 3-4)

### 4.1 Priority TypeScript Errors

**Target**: Reduce from 6,410 to <100
**Approach**: Incremental fixes by category
**Estimated Time**: 20 hours

#### Error Categories & Fixes

**1. Type Mismatches (3,245 errors)**

```typescript
// Example error:
// Type 'string | undefined' is not assignable to type 'string'

// Fix pattern:
// BEFORE
const value: string = props.value;

// AFTER (Option 1: Non-null assertion if guaranteed)
const value: string = props.value!;

// AFTER (Option 2: Default value)
const value: string = props.value ?? '';

// AFTER (Option 3: Type guard)
if (typeof props.value === 'string') {
  const value: string = props.value;
}
```

**2. Missing Properties (1,892 errors)**

```typescript
// Example error:
// Property 'contrastGuard' is missing in type

// Fix: Make properties optional or provide defaults
interface LiquidGlassProps {
  ior?: number;
  thickness?: number;
  contrastGuard?: boolean; // Make optional
}

// Or provide defaults
const defaultProps: Partial<LiquidGlassProps> = {
  contrastGuard: true,
  ior: 1.48,
  thickness: 4
};
```

**3. Cannot Find Name/Module (784 errors)**

```typescript
// Example error:
// Cannot find name 'XRSession'

// Fix: Add type definitions
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@types/webxr"]
  }
}

// Or create ambient declaration
// src/types/webxr.d.ts
declare class XRSession {
  // ...
}
```

---

### 4.2 Automated TypeScript Fixes

```bash
# Auto-fix simple errors
npx ts-migrate migrate src/

# Fix imports
npx organize-imports-cli tsconfig.json src/**/*.{ts,tsx}

# Add missing properties with defaults
npx ts-node scripts/add-default-props.ts
```

---

## Phase 5: Testing & Validation (Week 5)

### 5.1 Automated Testing

**Estimated Time**: 16 hours

#### Test Categories

**1. Unit Tests with Accessibility Checks**

```typescript
// Add to all component tests
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('GlassButton', () => {
  it('passes accessibility audit', async () => {
    const { container } = render(<GlassButton>Click me</GlassButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA label when icon-only', () => {
    const { getByRole } = render(
      <GlassButton aria-label="Close">
        <XIcon />
      </GlassButton>
    );
    expect(getByRole('button')).toHaveAccessibleName('Close');
  });
});
```

**2. Visual Regression Tests**

```bash
# Update all baselines
npm run test:visual:update

# Run visual tests
npm run test:visual:ci

# Check for regressions
```

**3. Contrast Testing**

```typescript
// scripts/test-contrast.ts
import { getContrast } from 'polished';

// Test all glass components
const components = [
  { name: 'GlassButton', background: 'rgba(255,255,255,0.1)', text: '#fff' },
  // ... all components
];

components.forEach(({ name, background, text }) => {
  const contrast = getContrast(background, text);
  if (contrast < 4.5) {
    console.error(`❌ ${name}: Contrast ${contrast.toFixed(2)}:1 (needs 4.5:1)`);
  } else {
    console.log(`✅ ${name}: Contrast ${contrast.toFixed(2)}:1`);
  }
});
```

---

### 5.2 Manual Testing

**Estimated Time**: 12 hours

#### Testing Checklist

**Screen Reader Testing**:
- [ ] NVDA (Windows) - test 20 key components
- [ ] JAWS (Windows) - test 10 key components
- [ ] VoiceOver (macOS) - test 20 key components

**Keyboard Navigation**:
- [ ] Tab through all interactive elements
- [ ] Arrow keys in menus/lists
- [ ] Escape closes modals/menus
- [ ] Enter/Space activates buttons

**Visual Testing**:
- [ ] Light theme compliance
- [ ] Dark theme compliance
- [ ] High contrast mode
- [ ] Reduced motion mode
- [ ] 200% zoom level

---

## Success Metrics

### Exit Criteria

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Token violations | 0 critical | 300 | ❌ |
| Contrast failures | 0 | 276 | ❌ |
| TypeScript errors | < 100 | 6,410 | ❌ |
| ARIA violations | 0 | 156 | ❌ |
| CSS conflicts | 0 critical | 87 | ⚠️ |
| Test coverage | > 80% | Unknown | ⚠️ |

### Post-Remediation Goals

- **100% WCAG AA compliance** (measured by axe-core)
- **95%+ design token adoption** (measured by automated linting)
- **Zero critical violations** in CI pipeline
- **Lighthouse score > 90** for all demo pages

---

## Estimated Timeline

```
Week 1: Token Migration & CSS Fixes
  Mon-Tue: Opacity & blur token migration (codemods)
  Wed-Thu: Color & animation token migration
  Fri: CSS variable consolidation

Week 2: Accessibility - ContrastGuard
  Mon-Wed: Automated ContrastGuard injection (276 components)
  Thu-Fri: Manual tuning for complex components (50 components)

Week 3: Accessibility - ARIA & Keyboard
  Mon-Tue: Automated ARIA attribute addition (156 violations)
  Wed-Fri: Manual ARIA review & keyboard navigation fixes

Week 4: TypeScript Fixes
  Mon-Thu: Fix TypeScript errors by category (6,410 → <100)
  Fri: Type generation validation & package.json exports

Week 5: Testing & Validation
  Mon-Tue: Automated testing (unit, visual, contrast)
  Wed-Thu: Manual testing (screen readers, keyboard, visual)
  Fri: Final review, documentation updates, merge to main
```

---

## Risk Mitigation

### Potential Issues

1. **Breaking Changes**: Some API changes may break consuming applications
   - Mitigation: Use feature flags, provide migration guide
2. **Performance Regression**: ContrastGuard sampling may impact performance
   - Mitigation: Throttle sampling, use IntersectionObserver for off-screen components
3. **Visual Regressions**: Token changes may alter appearance
   - Mitigation: Comprehensive visual regression testing before merge

---

## Next Steps

1. **Get stakeholder approval** for this plan
2. **Create feature branch**: `fix/compliance-remediation`
3. **Set up CI pipeline** to block new violations
4. **Begin Phase 1** (Token Migration)

For questions or clarifications, contact the audit team.
