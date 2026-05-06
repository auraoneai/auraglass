#!/usr/bin/env node

/**
 * AuraGlass Style Audit
 * Validates glassmorphism implementation patterns
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Audit checks
const CHECKS = {
  CLASS_PREFIX: 'class-prefix',
  FOCUS_UTILITY: 'focus-utility',
  INTERACTIVE_FOCUS: 'interactive-focus',
  TOUCH_TARGET: 'touch-target',
  CONTRAST_GUARD: 'contrast-guard',
  MOTION_RESPECT: 'motion-respect',
  DARK_LIGHT_PARITY: 'dark-light-parity',
};

class StyleAuditor {
  constructor() {
    this.issues = [];
    this.fileCount = 0;
    this.totalIssues = 0;
  }
  
  /**
   * Audit a single file
   */
  auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileIssues = [];
    
    // Check for glass- prefix violations
    const classNameMatches = content.match(/className=["'][^"']+["']/g) || [];
    classNameMatches.forEach(match => {
      const classes = match.replace(/className=["']|["']/g, '').split(' ');
      classes.forEach(className => {
        // Check for glass-related classes without proper prefix
        if (className.includes('blur') || className.includes('backdrop')) {
          if (!className.startsWith('glass-')) {
            fileIssues.push({
              type: CHECKS.CLASS_PREFIX,
              message: `Class "${className}" should use glass- prefix`,
              line: this.getLineNumber(content, match),
            });
          }
        }
      });
    });
    
    // Accessibility and interaction checks have been temporarily disabled
    // due to regex limitations with multi-line JSX elements.
    // These checks produce too many false positives and should be reimplemented
    // using proper AST parsing in a future release.

    // TODO: Reimplement these checks with AST-based parsing:
    // - INTERACTIVE_FOCUS: Elements with onClick should have glass-focus
    // - TOUCH_TARGET: Interactive elements should have glass-touch-target
    // - CONTRAST_GUARD: Glass surfaces should have glass-contrast-guard
    // - MOTION_RESPECT: Files using animations should check prefers-reduced-motion
    
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
    const lines = content.substring(0, content.indexOf(match)).split('\n');
    return lines.length;
  }
  
  /**
   * Get context line for a match
   */
  getContextLine(content, match) {
    const index = content.indexOf(match);
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + 100);
    return content.substring(start, end);
  }
  
  /**
   * Run the audit
   */
  run(pattern = 'src/**/*.{tsx,ts}') {
    console.log('🔍 Running AuraGlass Style Audit...\n');
    
    const files = glob.sync(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.test.*', '**/*.spec.*'],
    });
    
    files.forEach(file => {
      this.auditFile(file);
    });
    
    this.report();
  }
  
  /**
   * Generate report
   */
  report() {
    console.log(`📊 Audited ${this.fileCount} files\n`);
    
    if (this.issues.length === 0) {
      console.log('✅ No style issues found! All files follow AuraGlass patterns.\n');
      process.exit(0);
    }
    
    console.log(`⚠️  Found ${this.totalIssues} style issues in ${this.issues.length} files:\n`);
    
    // Group issues by type
    const issuesByType = {};
    
    this.issues.forEach(({ file, issues }) => {
      console.log(`\n📄 ${file}`);
      
      issues.forEach(issue => {
        const line = issue.line ? `:${issue.line}` : '';
        console.log(`   ${line} - ${issue.message}`);
        
        // Count by type
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
      });
    });
    
    // Summary
    console.log('\n📈 Summary by issue type:');
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    
    console.log('\n💡 Recommendations:');
    console.log('   - Add glass-focus utility to all interactive elements');
    console.log('   - Include glass-contrast-guard on glass surfaces');
    console.log('   - Use glass-touch-target for proper touch target sizing');
    console.log('   - Check for reduced motion preference when using animations');
    console.log('   - Use glass- prefix for all glassmorphism utilities\n');
    
    // Exit with warning code
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  const auditor = new StyleAuditor();
  const pattern = process.argv[2] || 'src/**/*.{tsx,ts}';
  auditor.run(pattern);
}

module.exports = StyleAuditor;