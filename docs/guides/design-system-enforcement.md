# AuraGlass Design System Enforcement

This document outlines the automated enforcement tools that maintain our 100/100 design system compliance score.

## 🛡️ Enforcement Layers

### 1. ESLint Rules (`eslint-plugin-auraglass.js`)

Custom ESLint rules that catch design system violations in real-time:

**Rules:**
- `auraglass/no-inline-glass` - Prevents inline glass styles that bypass the unified token system
- `auraglass/require-glass-tokens` - Requires using glass tokens instead of hardcoded values

**Violations Detected:**
- Direct `backdrop-filter` usage
- Hardcoded glass background colors (`rgba(255,255,255,0.x)`)
- Deprecated glass function calls
- Inline glass style objects

**Example Violations:**
```typescript
// ❌ Violation: Direct backdrop-filter
const badStyle = {
  backdropFilter: 'blur(8px)' // Should use createGlassStyle()
};

// ❌ Violation: Hardcoded glass background
const badBackground = {
  background: 'rgba(255, 255, 255, 0.15)' // Should use glass-surface-primary
};

// ✅ Correct
const goodStyle = createGlassStyle({ intent: "neutral", elevation: "level2" });
```

### 2. Token Linter (`scripts/ci/token-lint.js`)

Scans files for raw values that should use design tokens:

**Detects:**
- Raw hex colors (`#ffffff` → `glass-surface-white`)
- Raw RGB/RGBA colors (`rgba(255,255,255,0.5)` → `glass-surface-primary`)
- Raw HSL colors (`hsl(200,100%,50%)` → `glass-accent-primary`)
- Inline backdrop filters (`backdrop-filter: blur(8px)` → `createGlassStyle()`)
- Raw box-shadow values (`0 4px 16px rgba(0,0,0,0.16)` → `glass-elev-2`)
- Raw spacing values (`padding: 16px` → `glass-p-4`)
- Raw border-radius (`border-radius: 12px` → `glass-rounded-md`)
- Tailwind's `animate-pulse` (`animate-pulse` → `glass-animate-pulse`)

**Usage:**
```bash
npm run lint:tokens                    # Check all files
npm run lint:tokens src/components     # Check specific directory
node scripts/ci/token-lint.js "**/*.tsx" # Custom pattern
```

### 3. Style Auditor (`scripts/ci/style-audit.js`) 

Validates glassmorphism implementation patterns:

**Checks:**
- Interactive elements have `glass-focus` utility
- Glass surfaces include `glass-contrast-guard`
- Touch targets meet minimum size requirements
- Motion classes respect `prefers-reduced-motion`
- Glass classes use proper `glass-` prefix

**Usage:**
```bash
npm run lint:styles                   # Audit all files
node scripts/ci/style-audit.js "**/*.tsx" # Custom pattern
```

### 4. Pre-commit Hooks (`.husky/pre-commit`)

Automatically runs before each commit:

```bash
# Runs automatically on git commit
git commit -m "feat: add new component"

# Or run manually
npm run lint:staged
```

**What it checks:**
- TypeScript compilation
- ESLint rules (including auraglass rules)
- Token compliance
- Style audit
- Only on staged files for performance

### 5. CI/CD Integration (`.github/workflows/design-system-compliance.yml`)

Ensures design system compliance in continuous integration:

**Features:**
- Runs full compliance check on all pushes/PRs
- Calculates design system score (0-100)
- Generates compliance report
- Comments on PRs with violations
- Blocks merge if score < 80

**Score Calculation:**
- TypeScript check: 20 points
- ESLint compliance: 20 points  
- Token compliance: 20 points
- Style audit: 20 points
- Glass validation: 20 points

### 6. VSCode Integration (`.vscode/settings.json`)

Real-time violation highlighting in the editor:

**Features:**
- Highlights raw colors in red
- Suggests glass tokens
- Auto-fixes on save
- Custom CSS property IntelliSense
- Task integration for quick checks

**Commands:**
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Check Design System Compliance"
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Fix Design System Violations"

## 🚀 Usage

### Daily Development

1. **Write code normally** - violations are highlighted in VSCode
2. **Save files** - auto-fixes apply automatically  
3. **Commit changes** - pre-commit hooks catch remaining issues
4. **Create PR** - CI runs full compliance check

### Manual Checks

```bash
# Full design system check (recommended)
npm run glass:full-check

# Individual checks
npm run lint:tokens        # Token compliance
npm run lint:styles        # Style audit  
npm run lint:check         # ESLint rules
npm run glass:validate     # Glass validation

# Fix violations automatically
npm run codemod:all        # Run all codemods
npx eslint --fix src       # Fix ESLint violations
```

### Troubleshooting Common Violations

#### ❌ Raw Colors
```typescript
// Bad
const style = { color: '#ffffff' };

// Good  
const style = { color: 'var(--glass-surface-white)' };
// Or
<div className="glass-text-white">
```

#### ❌ Inline Backdrop Filter
```typescript
// Bad
const style = { backdropFilter: 'blur(8px)' };

// Good
const style = createGlassStyle({ blur: 'md' });
```

#### ❌ Raw Spacing
```typescript
// Bad
const style = { padding: '16px' };

// Good
<div className="glass-p-4">
// Or  
const style = { padding: 'var(--glass-space-4)' };
```

#### ❌ Missing Focus Utilities
```typescript
// Bad
<button onClick={handleClick}>Click me</button>

// Good
<button 
  onClick={handleClick}
  className="glass-focus"
>
  Click me
</button>
```

## 📊 Design System Score

The enforcement system calculates a compliance score:

- **100/100**: Perfect compliance ✨
- **80-99**: Excellent compliance 🎉  
- **60-79**: Good compliance (room for improvement) ⚠️
- **<60**: Needs attention ❌

## 🔧 Configuration

### Customize Rules

Edit `eslint.config.js`:
```javascript
rules: {
  'auraglass/no-inline-glass': 'error',    // error|warn|off
  'auraglass/require-glass-tokens': 'warn'
}
```

### Adjust Token Linter

Edit `scripts/ci/token-lint.js`:
```javascript
// Add new violation patterns
const PATTERNS = {
  customPattern: /your-pattern/g
};
```

### Modify Style Auditor

Edit `scripts/ci/style-audit.js`:
```javascript
// Add custom checks
const CHECKS = {
  CUSTOM_CHECK: 'custom-check'
};
```

## 🎯 Best Practices

1. **Use glass utilities first**: `glass-surface-primary` over raw colors
2. **Leverage createGlassStyle()**: For complex glass effects
3. **Follow the token system**: All design decisions should use tokens
4. **Test locally**: Run `npm run glass:full-check` before pushing
5. **Fix violations promptly**: Don't accumulate design debt

## 🔍 Automated Validation Commands

### Quick Checks
```bash
# Run full design system validation (recommended)
npm run glass:full-check

# Individual validation checks
npm run lint:tokens        # Check token usage
npm run lint:styles        # Validate style patterns  
npm run lint:glass         # Glass-specific validation
npm run typecheck          # TypeScript validation

# Auto-fix violations
npm run codemod:all        # Run all automated fixes
npm run lint:fix           # Fix ESLint violations
npm run format             # Format code with Prettier
```

### Continuous Integration
```bash
# CI validation pipeline
npm run ci:validate        # Full CI validation
npm run ci:score           # Calculate design system score
npm run ci:report          # Generate compliance report
```

### VSCode Integration
Enable real-time validation in VSCode:
```json
// .vscode/settings.json
{
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "css.customData": [".vscode/glass-css-data.json"]
}
```

## 🎯 Best Practices for Enforcement

### Development Workflow
1. **Write code normally** - violations highlighted in real-time
2. **Save files** - auto-fixes applied automatically
3. **Run validation** - `npm run glass:full-check` before commit
4. **Commit changes** - pre-commit hooks validate automatically
5. **Create PR** - CI runs comprehensive validation

### Team Guidelines
```bash
# Before starting work
npm run glass:full-check    # Ensure clean baseline

# During development  
npm run lint:watch          # Watch mode for real-time feedback

# Before committing
npm run lint:staged         # Validate only staged files
npm run test:visual         # Visual regression tests

# Before pushing
npm run ci:validate         # Full CI-style validation
```

## 📊 Compliance Scoring Details

### Score Breakdown (100 points total)
- **TypeScript Compliance (20 points)**
  - No TypeScript errors: 20 points
  - Warnings reduce score proportionally
  
- **ESLint Compliance (20 points)**  
  - No ESLint errors: 20 points
  - Each error: -1 point, each warning: -0.5 points
  
- **Token Compliance (20 points)**
  - 100% token usage: 20 points
  - Each raw value violation: -0.5 points
  
- **Style Audit (20 points)**
  - Perfect style patterns: 20 points
  - Missing focus utilities: -2 points each
  - Improper glass usage: -1 point each
  
- **Glass Validation (20 points)**
  - Proper glass implementation: 20 points  
  - Semantic elevation usage: bonus +5 points
  - Legacy patterns: -1 point each

### Score Interpretation
- **95-100**: Perfect compliance ✨ (Ideal for production)
- **85-94**: Excellent compliance 🎉 (Minor improvements needed)
- **70-84**: Good compliance ⚠️ (Some attention required)
- **50-69**: Fair compliance 🔧 (Significant work needed)
- **<50**: Poor compliance ❌ (Major issues to address)

## 🚨 Advanced Violation Patterns

### Complex Violations

#### Nested Style Objects
```typescript
// ❌ Violation: Nested glass styles
const complexBad = {
  container: {
    backdropFilter: 'blur(8px)',
    background: 'rgba(255,255,255,0.1)'
  },
  content: {
    boxShadow: '0 4px 16px rgba(0,0,0,0.16)'
  }
};

// ✅ Correct: Token-based approach
const complexGood = {
  container: 'glass glass-blur-md glass-surface-primary',
  content: 'glass-elev-level2'
};
```

#### Dynamic Style Generation
```typescript
// ❌ Violation: Dynamic raw values
const generateBadStyle = (opacity: number) => ({
  background: `rgba(255,255,255,${opacity})`
});

// ✅ Correct: Token-based dynamic styles
const generateGoodStyle = (intent: GlassIntent) => 
  createGlassStyle({ intent, elevation: 'level2' });
```

#### Third-Party Integration
```typescript
// ❌ Violation: Third-party with raw styles
<ThirdPartyComponent
  style={{
    backdropFilter: 'blur(12px)',
    background: 'rgba(0,0,0,0.2)'
  }}
/>

// ✅ Correct: Wrapper with glass utilities
<div className="glass glass-blur-lg glass-surface-dark">
  <ThirdPartyComponent />
</div>
```

## 📋 Enforcement Checklist

### Pre-Development Setup
- [ ] ESLint plugin installed and configured
- [ ] Pre-commit hooks active
- [ ] VSCode extensions installed
- [ ] Token linter available in PATH
- [ ] Style auditor configured

### Development Phase
- [ ] Real-time validation active in editor
- [ ] Auto-fixes enabled on save
- [ ] Glass utilities preferred over raw styles
- [ ] Token usage validated regularly
- [ ] Component patterns follow standards

### Pre-Commit Validation  
- [ ] `npm run lint:staged` passes
- [ ] TypeScript compilation successful
- [ ] No design system violations
- [ ] Visual tests pass
- [ ] Accessibility tests pass

### Continuous Integration
- [ ] CI pipeline includes all validation steps
- [ ] Design system score calculated
- [ ] Compliance report generated
- [ ] PR comments include violations
- [ ] Merge blocked if score < threshold

## 📚 Related Documentation

- [Glass Utilities Reference](../utilities/glass-utilities.md)
- [Component Standards](../guides/component-standards.md)
- [Design Token Reference](../tokens/design-tokens.md)
- [Elevation Guidelines](./elevation-guidelines.md)
- [Button Spacing Guide](./button-spacing.md)
- [Migration Guide](./migration.md)

---

**Maintain the 100/100 score!** 🏆 This enforcement system ensures our design system remains consistent, maintainable, and performant across all components.