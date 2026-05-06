#!/usr/bin/env node

/**
 * AuraGlass Style Audit V2
 * Improved version that handles multi-line JSX elements
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Audit checks
const CHECKS = {
  CLASS_PREFIX: 'class-prefix',
  INTERACTIVE_FOCUS: 'interactive-focus',
  TOUCH_TARGET: 'touch-target',
  CONTRAST_GUARD: 'contrast-guard',
  MOTION_RESPECT: 'motion-respect',
};

class StyleAuditor {
  constructor() {
    this.issues = [];
    this.fileCount = 0;
    this.totalIssues = 0;
  }

  /**
   * Normalize multi-line JSX elements to single line for easier regex matching
   */
  normalizeContent(content) {
    // Replace newlines within JSX tags with spaces
    return content.replace(/<([a-zA-Z]+)([^>]*?)>/gs, (match) => {
      return match.replace(/\n\s*/g, ' ');
    });
  }

  /**
   * Audit a single file
   */
  auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const normalized = this.normalizeContent(content);
    const fileIssues = [];

    // Check for glass- prefix violations
    const classNameMatches = normalized.match(/className=["'][^"']+["']/g) || [];
    classNameMatches.forEach(match => {
      const classes = match.replace(/className=["']|["']/g, '').split(' ');
      classes.forEach(className => {
        if (className.includes('blur') || className.includes('backdrop')) {
          if (!className.startsWith('glass-')) {
            fileIssues.push({
              type: CHECKS.CLASS_PREFIX,
              message: `Class "${className}" should use glass- prefix`,
              line: this.getLineNumber(content, className),
            });
          }
        }
      });
    });

    // Check for interactive elements without focus utilities
    const interactiveElements = [
      { pattern: /<button\s[^>]*>/g, name: 'button' },
      { pattern: /<a\s[^>]*href[^>]*>/g, name: 'a' },
      { pattern: /<input\s[^>]*>/g, name: 'input' },
      { pattern: /<select\s[^>]*>/g, name: 'select' },
      { pattern: /<textarea\s[^>]*>/g, name: 'textarea' },
    ];

    interactiveElements.forEach(({ pattern, name }) => {
      const matches = normalized.match(pattern) || [];
      matches.forEach(match => {
        const hasOnClick = match.includes('onClick');
        const hasFocusClass = match.includes('glass-focus');

        if (hasOnClick && !hasFocusClass) {
          fileIssues.push({
            type: CHECKS.INTERACTIVE_FOCUS,
            message: `Interactive element missing glass-focus utility`,
            line: this.getLineNumber(content, match.substring(0, 50)),
          });
        }
      });
    });

    // Check for contrast guard on glass surfaces
    if (filePath.endsWith('.tsx')) {
      const glassClassMatches = normalized.match(/className=["'][^"']*glass-foundation-complete[^"']*["']/g) || [];
      glassClassMatches.forEach(match => {
        if (!match.includes('glass-contrast-guard')) {
          fileIssues.push({
            type: CHECKS.CONTRAST_GUARD,
            message: 'Glass element missing contrast guard',
            line: this.getLineNumber(content, 'glass-foundation-complete'),
          });
        }
      });
    }

    // Check for minimum touch targets (skip .stories files)
    if (!filePath.includes('.stories.')) {
      const touchTargets = normalized.match(/<(button|a|input)\s[^>]*>/g) || [];
      touchTargets.forEach(match => {
        if (!match.includes('glass-touch-target') && !match.includes('min-height')) {
          fileIssues.push({
            type: CHECKS.TOUCH_TARGET,
            message: 'Interactive element may not meet minimum touch target size',
            line: this.getLineNumber(content, match.substring(0, 50)),
          });
        }
      });
    }

    // Check for motion classes without reduced motion consideration
    const motionClasses = content.match(/glass-animate-\w+/g) || [];
    if (motionClasses.length > 0) {
      const hasPrefersReducedMotion = content.includes('prefersReducedMotion') ||
                                      content.includes('useReducedMotion') ||
                                      content.includes('motionSafe:');

      if (!hasPrefersReducedMotion) {
        fileIssues.push({
          type: CHECKS.MOTION_RESPECT,
          message: 'File uses motion classes but doesn\'t check for reduced motion preference',
          line: 0,
        });
      }
    }

    if (fileIssues.length > 0) {
      this.issues.push({
        file: filePath,
        issues: fileIssues,
      });
      this.totalIssues += fileIssues.length;
    }

    this.fileCount++;
  }

  /**
   * Get line number for a match
   */
  getLineNumber(content, match) {
    const index = content.indexOf(match);
    if (index === -1) return 1;
    const lines = content.substring(0, index).split('\n');
    return lines.length;
  }

  /**
   * Run the audit
   */
  async run() {
    console.log('🔍 Running AuraGlass Style Audit V2...\n');

    const srcFiles = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

    srcFiles.forEach(file => {
      this.auditFile(file);
    });

    this.printReport();

    return this.totalIssues;
  }

  /**
   * Print the audit report
   */
  printReport() {
    console.log(`📊 Audited ${this.fileCount} files\n`);

    if (this.totalIssues === 0) {
      console.log('✅ No style issues found!\n');
      return;
    }

    console.log(`⚠️  Found ${this.totalIssues} style issues in ${this.issues.length} files:\n`);

    // Group by issue type
    const byType = {};
    this.issues.forEach(({ file, issues }) => {
      issues.forEach(issue => {
        if (!byType[issue.type]) byType[issue.type] = 0;
        byType[issue.type]++;
      });
    });

    console.log('📈 Summary by issue type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log('\n💡 Recommendations:');
    console.log('   - Add glass-focus utility to all interactive elements');
    console.log('   - Include glass-contrast-guard on glass surfaces');
    console.log('   - Use glass-touch-target for proper touch target sizing');
    console.log('   - Check for reduced motion preference when using animations');
    console.log('   - Use glass- prefix for all glassmorphism utilities\n');
  }
}

// Run the audit
const auditor = new StyleAuditor();
auditor.run().then(issueCount => {
  process.exit(issueCount === 0 ? 0 : 1);
});
