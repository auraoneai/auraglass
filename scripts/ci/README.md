# AuraGlass by AuraOne CI Scripts

This directory contains automated enforcement tools for maintaining design system compliance and ensuring a 100/100 design system score.

## ✅ Recent Comprehensive Audit (November 2025)

**These CI scripts were instrumental in the comprehensive glassmorphism audit:**
- **621 components audited** across 20+ categories
- **441 files fixed** (systematic CSS class prefix duplication resolved)
- **1,419+ issues detected and resolved** using these enforcement tools
- **100% token compliance verified** through automated validation

These scripts continue to protect code quality and prevent regressions. See [GLASSMORPHISM_AUDIT_REPORT.md](../../reports/glass_compliance_summary.md) for complete audit details.

## 🎯 Overview

These scripts enforce token-first styling, accessibility rules, and glassmorphism patterns to prevent design system violations.

## 📁 Scripts

### 🎨 `token-lint.js`
**Purpose**: Validates token usage and flags raw values that should use design tokens.

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
node token-lint.js                    # Check src directory
node token-lint.js "**/*.tsx"         # Custom glob pattern
npm run lint:tokens                   # Via npm script
```

### 🔍 `style-audit.js`
**Purpose**: Validates glassmorphism implementation patterns and accessibility compliance.

**Checks:**
- Interactive elements have `glass-focus` utility for accessibility
- Glass surfaces include `glass-contrast-guard` for readability
- Touch targets meet minimum size requirements (44px)
- Motion classes respect `prefers-reduced-motion` preference
- Proper `glass-` class prefixes for consistent naming

**Usage:**
```bash
node style-audit.js                   # Check src directory
node style-audit.js "**/*.tsx"        # Custom glob pattern
npm run lint:styles                   # Via npm script
```

### 🚫 `verify-no-core-ui-deps.js`
**Purpose**: Enforces the AuraGlass 3.3 dependency-elimination gate for core app chrome.

**Checks:**
- Forbidden production metadata entries in `dependencies`, `peerDependencies`, and `peerDependenciesMeta`
- Forbidden source imports from MUI/material, Radix, Lucide, and legacy Material packages
- Current docs references outside migration docs and release reports

**Usage:**
```bash
node scripts/ci/verify-no-core-ui-deps.js
node scripts/ci/verify-no-core-ui-deps.js --json
```

### 🌳 `verify-tree-shaking.js`
**Purpose**: Tracks AuraGlass 3.3 export-map and bundle-sovereignty requirements for icons, primitives, app shell, workspace, theme, and focused package subpath entrypoints.

**Checks:**
- Required 3.3 sub-entrypoints in `package.json.exports`
- Scoped `sideEffects` metadata
- Built runtime output for forbidden core UI package signals in strict mode
- esbuild bundle scenarios in strict mode

**Usage:**
```bash
node scripts/ci/verify-tree-shaking.js
node scripts/ci/verify-tree-shaking.js --strict
node scripts/ci/verify-tree-shaking.js --json
```

### ⚡ `run-vite-integration.js`
**Purpose**: Packs the local AuraGlass build into a temporary Vite React app and verifies production bundling from the npm tarball.

**Checks:**
- Root `aura-glass` imports
- `aura-glass/app-shell`
- `aura-glass/icons/navigation`
- `aura-glass/primitives/slot`
- `aura-glass/theme`
- `aura-glass/styles`

**Usage:**
```bash
npm run test:integration:vite
npm run test:integration:vite -- --skip-build
```

### 🧾 `verify-recipes-render.js`
**Purpose**: Proves package recipes are not only registry metadata. The script packs AuraGlass, scaffolds every recipe through the public CLI, builds a generated Vite app, opens it in Chromium, and captures one screenshot per recipe.

**Outputs:**
- `reports/3.3-release/recipe-render-evidence.json`
- `reports/3.3-release/recipe-render-evidence.md`
- `reports/3.3-release/recipe-screenshots/*.png`

**Usage:**
```bash
npm run test:recipes:render
npm run test:recipes:render -- --skip-build
```

### 🖼️ `verify-app-chrome-visuals.js`
**Purpose**: Proves the 3.3 app-chrome replacement surfaces render and respond to basic browser interactions from the packed npm tarball through public package entrypoints. The script creates a temporary Vite app, renders targeted visual fixtures, opens them in Chromium, captures screenshots, and runs focused keyboard/interaction checks.

**Targets:**
- First-party icon gallery
- Native dropdown menu
- Native select
- Dialog, drawer, popover, and tooltip
- Tabs
- Command palette
- Mobile shell
- Reduced-motion baseline

**Keyboard and interaction checks:**
- Dropdown opens from keyboard and closes on escape
- Select opens from keyboard and closes on escape
- Tabs support arrow-key activation
- Dialog and drawer close on escape
- Tooltip appears on pointer hover
- Command palette search filters commands

**Outputs:**
- `reports/3.3-release/app-chrome-visual-evidence.json`
- `reports/3.3-release/app-chrome-visual-evidence.md`
- `reports/3.3-release/app-chrome-visuals/*.png`

**Usage:**
```bash
npm run test:visual:app-chrome
npm run test:visual:app-chrome -- --skip-build
```

## 🚀 Integration Points

Both scripts are integrated into multiple layers:

### 1. Pre-commit Hooks
```bash
# Runs automatically on git commit
git commit -m "feat: add new component"
```

### 2. GitHub Actions
```yaml
# .github/workflows/design-system-compliance.yml
- name: Run Token Linter
  run: npm run lint:tokens
  
- name: Run Style Audit  
  run: npm run lint:styles
```

### 3. VSCode Tasks
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Check Design System Compliance"

### 4. NPM Scripts
```json
{
  "scripts": {
    "lint:tokens": "node scripts/ci/token-lint.js",
    "lint:styles": "node scripts/ci/style-audit.js",
    "glass:full-check": "npm run typecheck && npm run lint:check && npm run lint:tokens && npm run lint:styles && npm run glass:validate && npm run test:glass-contrast"
  }
}
```

## 📊 Exit Codes & Output

**Exit Codes:**
- `0`: No violations found ✅
- `1`: Violations detected ❌

**Output Format:**
```bash
🔍 Running AuraGlass Token Linter...

📊 Scanned 45 files

❌ Found 3 violations in 2 files:

📄 1. src/components/BadComponent.tsx
   ❌ 12:5 - Raw hex color "#ffffff" found. Use glass color tokens instead.
      💡 Suggestion: glass-surface-white
   ❌ 15:23 - Inline backdrop-filter found. Use createGlassStyle() instead.
      💡 Suggestion: Use createGlassStyle({ blur: "md" })

📈 Summary by violation type:
   🎨 raw-color: 1
   🌫️ inline-backdrop: 1

🔧 Quick fixes:
   • Raw colors: Use tokens from --glass-color-* or glass-surface-*
   • Backdrop filters: Replace with createGlassStyle({ blur: "md" })
```

## ⚙️ Configuration

### Customize Patterns
Edit violation patterns in the scripts:

```javascript
// token-lint.js
const PATTERNS = {
  hexColor: /#[0-9a-fA-F]{3,8}/g,
  customPattern: /your-regex/g  // Add custom patterns
};

// style-audit.js  
const CHECKS = {
  CUSTOM_CHECK: 'custom-check'  // Add custom checks
};
```

### Adjust Suggestions
Modify the suggestion mappings:

```javascript
// token-lint.js
suggestColorToken(hexColor) {
  const colorMap = {
    '#ffffff': 'glass-surface-white',
    '#your-color': 'glass-surface-custom'  // Add mappings
  };
  return colorMap[hexColor.toLowerCase()] || 'appropriate glass token';
}
```

## 🎯 Best Practices

### Token Usage
```typescript
// ❌ Bad - Raw values
const style = {
  backgroundColor: '#ffffff',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
  padding: '16px'
};

// ✅ Good - Using tokens
const style = createGlassStyle({ 
  intent: 'neutral', 
  elevation: 'level2',
  blur: 'md' 
});
// Or
<div className="glass-surface-white glass-elev-2 glass-blur-md glass-p-4">
```

### Accessibility
```typescript
// ❌ Bad - Missing focus utilities
<button onClick={handleClick}>Click me</button>

// ✅ Good - Proper accessibility
<button 
  onClick={handleClick}
  className="glass-focus glass-touch-target"
>
  Click me
</button>
```

## 🔄 Troubleshooting

### Common Issues

1. **File not found**: Ensure the script is run from the project root
2. **Pattern not matching**: Check your glob pattern syntax
3. **False positives**: Add exceptions for CSS custom properties and comments
4. **Performance**: Use specific patterns instead of scanning all files

### Debug Mode
Add debug logging to scripts for troubleshooting:

```javascript
const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) console.log('Processing file:', filePath);
```

## 📚 Related Documentation

- [Design System Enforcement Guide](../../docs/guides/design-system-enforcement.md)
- [Glass Tokens Reference](../../docs/design-tokens.md)
- [Contributing Guidelines](../../README.md)

---

**Goal: Maintain 100/100 design system compliance!** 🏆
