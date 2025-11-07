# 🤖 AUTONOMOUS EXECUTION PROMPT - AuraGlass 100% Compliance

## CRITICAL DIRECTIVES - MANDATORY COMPLIANCE

### PRIMARY OPERATING RULES
1. **NEVER PAUSE** - Work continuously without stopping for any reason
2. **NEVER COMMUNICATE** - No interim updates, questions, or status messages until 100% complete
3. **NEVER REQUEST INPUT** - Use autonomous judgment for all decisions
4. **UPDATE FINALTO100.MD** - Mark each task complete immediately upon finishing
5. **WORK SYSTEMATICALLY** - Complete all 1,300+ tasks in sequence
6. **FINAL REPORT ONLY** - Submit comprehensive status only after ALL tasks complete

### EXECUTION PARAMETERS
- **Mode**: FULLY AUTONOMOUS
- **Interruptions**: FORBIDDEN
- **Feedback Requests**: PROHIBITED
- **Clarification Requests**: PROHIBITED
- **Progress Updates**: INTERNAL ONLY (update Finalto100.md)
- **Communication**: FINAL REPORT ONLY

---

## 🚀 AUTONOMOUS EXECUTION SEQUENCE

### INITIALIZATION PHASE
```
BEGIN AUTONOMOUS MODE
1. Load Finalto100.md into working memory
2. Create internal task tracking with all 1,300+ items
3. Set up automated progress logging
4. Initialize all required tools and utilities
5. Create backup of entire codebase
6. Begin systematic execution
```

### IMMEDIATE TODO LIST POPULATION
Add ALL following tasks to immediate execution queue:

```typescript
const IMMEDIATE_TASKS = {
  WEEK_1: {
    TOKEN_MIGRATION: [
      "Fix 590 hardcoded values across 354 components",
      "Update Navbar.tsx lines 45,67,89",
      "Update Sidebar.tsx lines 112,156,203",
      "Update MobileNav.tsx lines 34,78,92",
      "Fix all Modal components",
      "Fix all Form components",
      "Run automated token migration codemod",
      // ... all 590 token fixes
    ]
  },
  WEEK_2: {
    CONTRASTGUARD: [
      "Integrate ContrastGuard in 276 components",
      "Fix PageHeader.tsx",
      "Fix PageContent.tsx",
      "Fix all Layout components (24 files)",
      "Fix all Data Display components (36 files)",
      "Fix all Chart components (18 files)",
      // ... all 276 ContrastGuard integrations
    ]
  },
  WEEK_3: {
    ACCESSIBILITY: [
      "Add ARIA to 156 components",
      "Fix GlassButton.tsx aria attributes",
      "Implement keyboard navigation",
      "Add reduced motion support to 304 components",
      "Implement focus management",
      // ... all 460 accessibility fixes
    ]
  },
  WEEK_4: {
    TYPESCRIPT: [
      "Fix 3,245 type mismatches",
      "Fix 1,892 missing properties",
      "Fix 784 unresolved modules",
      "Replace all 'any' types",
      "Enable strict mode",
      // ... all 6,410 TypeScript fixes
    ]
  },
  WEEK_5: {
    TESTING: [
      "Create test files for 354 components",
      "Run axe-core validation",
      "Perform automated accessibility testing",
      "Run visual regression tests",
      "Execute performance benchmarks",
      // ... all testing tasks
    ]
  }
}
```

---

## 📋 DETAILED AUTONOMOUS EXECUTION INSTRUCTIONS

### WEEK 1: TOKEN MIGRATION (Execute Days 1-5)

#### AUTONOMOUS ACTIONS:
```bash
# 1. Create token migration script
cat > migrate-tokens.js << 'EOF'
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const TOKEN_MAPPINGS = {
  'backdrop-filter: blur(10px)': 'backdrop-filter: var(--aura-glass-blur-md)',
  'backdrop-filter: blur(20px)': 'backdrop-filter: var(--aura-glass-blur-lg)',
  'background: rgba(255,255,255,0.1)': 'background: var(--aura-glass-bg)',
  'opacity: 0.8': 'opacity: var(--aura-glass-opacity-default)',
  // Add all 590 mappings
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  Object.entries(TOKEN_MAPPINGS).forEach(([oldValue, newValue]) => {
    if (content.includes(oldValue)) {
      content = content.replace(new RegExp(oldValue, 'g'), newValue);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    updateFinalto100(filePath, 'token_migration');
  }
}

// Execute on all components
glob.sync('src/components/**/*.tsx').forEach(migrateFile);
glob.sync('src/components/**/*.css').forEach(migrateFile);
EOF

node migrate-tokens.js
```

#### FILE-BY-FILE EXECUTION:
1. **Navbar.tsx** - Lines 45, 67, 89
   - OPEN FILE
   - REPLACE hardcoded values with tokens
   - SAVE FILE
   - UPDATE Finalto100.md: ✅ Navbar.tsx token migration complete

2. **Sidebar.tsx** - Lines 112, 156, 203
   - OPEN FILE
   - REPLACE blur values with tokens
   - UPDATE border colors to variables
   - SAVE FILE
   - UPDATE Finalto100.md: ✅ Sidebar.tsx token migration complete

[CONTINUE FOR ALL 354 COMPONENTS]

### AUTONOMOUS DECISION MATRIX:
```
IF (ambiguous token choice) THEN:
  - Use most specific token available
  - Default to --aura-glass-* namespace
  - Prefer semantic tokens over raw values

IF (missing token) THEN:
  - Create new token in design system
  - Follow existing naming convention
  - Add to AURA_GLASS token manifest

IF (conflict detected) THEN:
  - Preserve functionality over aesthetics
  - Log conflict for final report
  - Continue execution without stopping
```

---

### WEEK 2: CONTRASTGUARD INTEGRATION (Execute Days 6-10)

#### AUTONOMOUS IMPLEMENTATION:
```typescript
// ContrastGuard Template - Apply to ALL 276 components
const CONTRASTGUARD_TEMPLATE = `
import { ContrastGuard } from '@/utils/ContrastGuard';

// Wrap all text elements
<ContrastGuard
  minContrast={4.5}
  fallbackColor="var(--aura-high-contrast-text)"
  backgroundColor="var(--aura-glass-bg)"
>
  {textContent}
</ContrastGuard>
`;
```

#### SYSTEMATIC EXECUTION:
1. For each of 276 components:
   - INJECT ContrastGuard import
   - FIND all text rendering points
   - WRAP with ContrastGuard component
   - SET appropriate contrast ratios
   - TEST with automated validator
   - UPDATE Finalto100.md immediately

### AUTOMATED CONTRASTGUARD SCRIPT:
```javascript
// Execute autonomously for all components
const ast = require('@babel/parser');
const traverse = require('@babel/traverse');
const generate = require('@babel/generator');

function injectContrastGuard(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });

  traverse(ast, {
    JSXText(path) {
      // Wrap text nodes with ContrastGuard
      const wrapped = t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier('ContrastGuard'), []),
        t.jsxClosingElement(t.jsxIdentifier('ContrastGuard')),
        [path.node]
      );
      path.replaceWith(wrapped);
    }
  });

  const output = generate(ast);
  fs.writeFileSync(filePath, output.code);
  updateFinalto100(filePath, 'contrastguard_added');
}
```

---

### WEEK 3: ACCESSIBILITY FIXES (Execute Days 11-15)

#### ARIA AUTOMATION SCRIPT:
```javascript
// Add ARIA attributes to all 156 interactive components
const ARIA_MAPPINGS = {
  'button': {
    attributes: ['aria-label', 'aria-pressed', 'role="button"'],
    handlers: ['onKeyDown', 'onKeyUp']
  },
  'input': {
    attributes: ['aria-label', 'aria-required', 'aria-invalid'],
    handlers: ['onChange', 'onFocus', 'onBlur']
  },
  'modal': {
    attributes: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby'],
    handlers: ['onEscape']
  }
  // ... complete mappings for all component types
};

function addAccessibility(component) {
  // Parse component
  // Identify interactive elements
  // Add appropriate ARIA attributes
  // Implement keyboard handlers
  // Add focus management
  // Save and update Finalto100.md
}

// Execute on all components
components.forEach(addAccessibility);
```

#### REDUCED MOTION FIXES:
```typescript
// Apply to all 304 animated components
const REDUCED_MOTION_TEMPLATE = `
import { useReducedMotion } from '@/hooks/useReducedMotion';

function Component() {
  const prefersReducedMotion = useReducedMotion();

  const animationDuration = prefersReducedMotion ? 0 : 300;
  const animationEasing = prefersReducedMotion ? 'none' : 'ease-in-out';

  // Apply to all animations
}
`;
```

---

### WEEK 4: TYPESCRIPT FIXES (Execute Days 16-20)

#### AUTOMATED TYPE FIXING:
```bash
# Fix all 6,410 TypeScript errors systematically

# 1. Fix type mismatches (3,245 errors)
npx ts-migrate migrate src/components --migration-type infer-types

# 2. Fix missing properties (1,892 errors)
npx ts-migrate migrate src/components --migration-type add-missing-properties

# 3. Fix unresolved modules (784 errors)
npx ts-migrate migrate src/components --migration-type fix-imports

# 4. Replace 'any' types (489 occurrences)
npx ts-migrate migrate src/components --migration-type remove-any

# After each fix category:
# - Run tsc --noEmit
# - Log remaining errors
# - Update Finalto100.md
```

#### MANUAL TYPE FIXES:
For each remaining error:
1. PARSE error message
2. LOCATE file and line
3. APPLY appropriate fix:
   - Type mismatch → Update interface
   - Missing property → Add default value
   - Unresolved module → Fix import path
4. VERIFY fix with TypeScript compiler
5. UPDATE Finalto100.md task status

---

### WEEK 5: TESTING & VALIDATION (Execute Days 21-25)

#### AUTOMATED TEST GENERATION:
```javascript
// Generate tests for all 354 components
const TEST_TEMPLATE = `
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Component } from './Component';

describe('Component', () => {
  it('meets WCAG AA standards', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes', () => {
    render(<Component />);
    // Test all ARIA attributes
  });

  it('supports keyboard navigation', () => {
    // Test keyboard interactions
  });

  it('respects reduced motion', () => {
    // Test animation preferences
  });

  it('uses design tokens', () => {
    // Verify no hardcoded values
  });
});
`;

components.forEach(comp => {
  const testFile = comp.replace('.tsx', '.test.tsx');
  fs.writeFileSync(testFile, TEST_TEMPLATE);
  updateFinalto100(comp, 'test_created');
});
```

#### VALIDATION EXECUTION:
```bash
# Run all validations autonomously
npm run test -- --coverage
npm run lint
npm run type-check
npx lighthouse --output json --output-path ./lighthouse-report.json
npx axe --dir src/components --save axe-report.json
```

---

## 🔄 CONTINUOUS PROGRESS TRACKING

### FINALTO100.MD UPDATE FUNCTION:
```javascript
function updateFinalto100(task, status) {
  const content = fs.readFileSync('Finalto100.md', 'utf8');
  const updated = content.replace(
    `- [ ] ${task}`,
    `- [x] ${task} ✅ [${new Date().toISOString()}]`
  );
  fs.writeFileSync('Finalto100.md', updated);

  // Internal progress tracking only
  const progress = calculateProgress();
  internal_log(`Progress: ${progress}% complete`);
}
```

### ERROR HANDLING (AUTONOMOUS):
```javascript
try {
  executeTask(task);
} catch (error) {
  // DO NOT STOP OR ASK FOR HELP
  // Log error internally
  internal_errors.push({ task, error: error.message });

  // Attempt automatic recovery
  if (error.type === 'MODULE_NOT_FOUND') {
    npm install missing_module;
    retry_task(task);
  } else if (error.type === 'SYNTAX_ERROR') {
    revert_file(task.file);
    apply_alternative_fix(task);
  } else {
    // Skip and continue
    mark_task_failed(task);
    continue_to_next_task();
  }
}
```

---

## 📊 FINAL COMPREHENSIVE REPORT STRUCTURE

### ONLY AFTER 100% COMPLETION, GENERATE:

```markdown
# 🎯 AUTONOMOUS EXECUTION COMPLETE - FINAL REPORT

## EXECUTION SUMMARY
- Start Time: [ISO timestamp]
- End Time: [ISO timestamp]
- Total Duration: [hours:minutes]
- Tasks Attempted: 1,300
- Tasks Completed: [number]
- Tasks Failed: [number]
- Success Rate: [percentage]

## WEEK 1 RESULTS - TOKEN MIGRATION
✅ COMPLETED: [number] of 590 token migrations
- Files Modified: [list]
- Token Adoption: Before 29.4% → After [percentage]
- Remaining Hardcoded Values: [number]

## WEEK 2 RESULTS - CONTRASTGUARD
✅ COMPLETED: [number] of 276 ContrastGuard integrations
- WCAG AA Compliance: [percentage]
- WCAG AAA Compliance: [percentage]
- Contrast Violations Remaining: [number]

## WEEK 3 RESULTS - ACCESSIBILITY
✅ COMPLETED: [number] of 460 accessibility fixes
- ARIA Coverage: [percentage]
- Keyboard Navigation: [percentage]
- Reduced Motion Support: [percentage]

## WEEK 4 RESULTS - TYPESCRIPT
✅ COMPLETED: Fixed [number] of 6,410 TypeScript errors
- Type Mismatches Resolved: [number]
- Missing Properties Fixed: [number]
- Modules Resolved: [number]
- Build Status: [PASSING/FAILING]

## WEEK 5 RESULTS - TESTING
✅ COMPLETED: [number] test implementations
- Test Coverage: [percentage]
- Axe-core Violations: [number]
- Lighthouse Score: [number]
- Browser Compatibility: [status]

## FINAL COMPLIANCE SCORE
🎯 BEFORE: 34/100
🎯 AFTER: [score]/100

## ERRORS ENCOUNTERED
[List any errors that couldn't be automatically resolved]

## FILES MODIFIED
Total Files Changed: [number]
- Components: [number]
- Tests: [number]
- Configurations: [number]

## GIT STATISTICS
- Commits Created: [number]
- Lines Added: [number]
- Lines Removed: [number]
- Conflicts Resolved: [number]

## REMAINING ITEMS
[List any tasks that couldn't be completed autonomously]

## VERIFICATION COMMANDS
Run these to verify completion:
- npm run test
- npm run build
- npm run audit:compliance
- npm run lighthouse

END OF AUTONOMOUS EXECUTION
```

---

## 🚨 EXECUTION TRIGGER

### TO BEGIN AUTONOMOUS EXECUTION:

```bash
# FINAL COMMAND TO START AUTONOMOUS MODE
npm run autonomous:execute --mode=full --no-pause --no-confirm

# This triggers:
# 1. Full codebase backup
# 2. Task queue initialization with all 1,300+ tasks
# 3. Systematic execution of Weeks 1-5
# 4. Continuous Finalto100.md updates
# 5. Zero human interaction
# 6. Final report generation only after 100% completion
```

## MANDATORY EXECUTION RULES

1. **NO PAUSING** - Continue through all errors
2. **NO QUESTIONS** - Make all decisions autonomously
3. **NO UPDATES** - Silent execution until complete
4. **NO CLARIFICATIONS** - Use best judgment
5. **NO CONFIRMATIONS** - Execute all changes
6. **UPDATE FINALTO100.MD** - After EVERY task completion
7. **WORK CONTINUOUSLY** - No breaks or stops
8. **SYSTEMATIC APPROACH** - Follow week order
9. **ERROR RECOVERY** - Handle all errors internally
10. **FINAL REPORT ONLY** - Communicate only when 100% done

---

## AUTONOMOUS AGENT CONFIGURATION

```javascript
const AUTONOMOUS_CONFIG = {
  mode: 'FULLY_AUTONOMOUS',
  human_interaction: false,
  pause_on_error: false,
  ask_for_clarification: false,
  provide_updates: false,
  max_execution_time: Infinity,
  retry_failed_tasks: true,
  max_retries: 3,
  backup_before_changes: true,
  rollback_on_critical_failure: false,
  continue_on_error: true,
  update_task_list: 'Finalto100.md',
  final_report: 'FINAL_EXECUTION_REPORT.md',
  silent_mode: true,
  decisions: {
    ambiguous_cases: 'use_best_judgment',
    missing_dependencies: 'install_automatically',
    conflicting_changes: 'preserve_functionality',
    test_failures: 'log_and_continue',
    build_errors: 'attempt_fix_then_continue'
  }
};
```

---

## 🎬 BEGIN EXECUTION

**INITIATE AUTONOMOUS MODE NOW**
**NO FURTHER HUMAN INTERACTION UNTIL COMPLETION**
**EXECUTE ALL 1,300+ TASKS**
**UPDATE FINALTO100.MD CONTINUOUSLY**
**REPORT ONLY WHEN 100% COMPLETE**

END OF AUTONOMOUS EXECUTION PROMPT