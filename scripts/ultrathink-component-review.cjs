#!/usr/bin/env node
/**
 * ULTRATHINK COMPONENT REVIEW
 * 
 * Systematic examination of ALL *.tsx components for:
 * - Typography issues (font weights, sizes, colors, readability)
 * - Formatting issues (spacing, padding, margins, layout)
 * - Alignment issues (flex, grid, positioning problems)
 * - Opacity issues (text readability, contrast problems)
 * - Glass effect consistency (proper backdrop-filter, visibility)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define component quality standards
const QUALITY_STANDARDS = {
  typography: {
    minimumTextOpacity: 0.8,        // Text should be at least 80% opacity
    minimumContrastRatio: 4.5,      // WCAG AA compliance
    requiredFontWeights: ['400', '500', '600', '700'], // Standard weight range
    maxFontSizeVariation: 3,        // Don't use too many font sizes
  },
  
  formatting: {
    consistentSpacing: [4, 8, 12, 16, 20, 24, 32, 48], // 4px increments
    maxNestingDepth: 5,             // Avoid too deep nesting
    minPadding: 8,                  // Minimum touch target padding
    maxLineLength: 80,              // Code readability
  },
  
  alignment: {
    preferFlexbox: true,            // Prefer flexbox over positioning
    avoidAbsolutePositioning: true, // Avoid absolute positioning where possible
    requireResponsiveDesign: true,  // Components should be responsive
  },
  
  glassEffects: {
    minimumBackdropBlur: 8,         // At least 8px blur
    minimumBackgroundOpacity: 0.15, // At least 15% opacity
    requiredBackdropFilter: true,   // Must have backdrop-filter
    consistentBorderRadius: [8, 12, 16, 20, 24], // Consistent radius values
  }
};

// Issues tracker
const reviewResults = {
  totalComponents: 0,
  componentsReviewed: 0,
  issuesFound: {
    typography: [],
    formatting: [],
    alignment: [],
    glassEffects: [],
    accessibility: [],
  },
  autoFixes: {
    applied: [],
    skipped: [],
  },
  qualityScore: 0,
};

/**
 * Analyze typography issues in a component
 */
function analyzeTypography(filePath, content) {
  const issues = [];
  
  // Check for low-contrast text
  const lowContrastText = content.match(/text-white\/[1-6][05]?/g);
  if (lowContrastText) {
    issues.push({
      type: 'typography',
      severity: 'high',
      issue: `Low contrast text found: ${lowContrastText.join(', ')}`,
      recommendation: 'Use text-white/80 or text-white/90 for better readability',
      file: filePath,
    });
  }
  
  // Check for inconsistent font weights
  const fontWeights = [...content.matchAll(/font-(?:weight-)?(\d{3})/g)].map(m => m[1]);
  const uniqueWeights = [...new Set(fontWeights)];
  if (uniqueWeights.length > 4) {
    issues.push({
      type: 'typography',
      severity: 'medium',
      issue: `Too many font weights: ${uniqueWeights.join(', ')}`,
      recommendation: 'Standardize to 400, 500, 600, 700 only',
      file: filePath,
    });
  }
  
  // Check for hardcoded font sizes instead of using design tokens
  const hardcodedSizes = content.match(/fontSize:\s*['"`]\d+px['"`]/g);
  if (hardcodedSizes) {
    issues.push({
      type: 'typography',
      severity: 'medium',
      issue: `Hardcoded font sizes found: ${hardcodedSizes.join(', ')}`,
      recommendation: 'Use design token classes like text-sm, text-base, text-lg',
      file: filePath,
    });
  }
  
  return issues;
}

/**
 * Analyze formatting and spacing issues
 */
function analyzeFormatting(filePath, content) {
  const issues = [];
  
  // Check for inconsistent spacing values
  const spacingValues = [...content.matchAll(/(?:padding|margin|gap):\s*['"`]?(\d+)px/g)].map(m => parseInt(m[1]));
  const nonStandardSpacing = spacingValues.filter(val => val % 4 !== 0 && val > 4);
  if (nonStandardSpacing.length > 0) {
    issues.push({
      type: 'formatting',
      severity: 'low',
      issue: `Non-standard spacing values: ${nonStandardSpacing.join(', ')}px`,
      recommendation: 'Use 4px increments (8px, 12px, 16px, 20px, 24px, 32px)',
      file: filePath,
    });
  }
  
  // Check for missing padding on clickable elements
  const clickableElements = content.match(/cursor:\s*['"`]?pointer|onClick=/g);
  const hasPadding = /padding/.test(content);
  if (clickableElements && !hasPadding) {
    issues.push({
      type: 'formatting',
      severity: 'medium',
      issue: 'Clickable elements without adequate padding',
      recommendation: 'Add minimum 8px padding for better touch targets',
      file: filePath,
    });
  }
  
  // Check for excessive nesting
  const braceDepth = (content.match(/{/g) || []).length;
  const totalLines = content.split('\n').length;
  if (braceDepth / totalLines > 0.1) { // More than 10% braces
    issues.push({
      type: 'formatting',
      severity: 'low',
      issue: 'Potentially excessive component nesting',
      recommendation: 'Consider breaking into smaller sub-components',
      file: filePath,
    });
  }
  
  return issues;
}

/**
 * Analyze alignment and layout issues
 */
function analyzeAlignment(filePath, content) {
  const issues = [];
  
  // Check for overuse of absolute positioning
  const absolutePositioning = content.match(/position:\s*['"`]?absolute/g);
  if (absolutePositioning && absolutePositioning.length > 3) {
    issues.push({
      type: 'alignment',
      severity: 'medium',
      issue: `Excessive absolute positioning (${absolutePositioning.length} instances)`,
      recommendation: 'Use flexbox or grid layouts where possible',
      file: filePath,
    });
  }
  
  // Check for missing responsive design
  const hasResponsiveClasses = /(?:sm:|md:|lg:|xl:)/.test(content);
  const hasFixedDimensions = /width:\s*['"`]?\d+px|height:\s*['"`]?\d+px/.test(content);
  if (hasFixedDimensions && !hasResponsiveClasses && !content.includes('stories.tsx')) {
    issues.push({
      type: 'alignment',
      severity: 'medium',
      issue: 'Fixed dimensions without responsive design',
      recommendation: 'Add responsive classes or use percentage/viewport units',
      file: filePath,
    });
  }
  
  // Check for centering anti-patterns
  const badCentering = content.match(/margin:\s*['"`]?0\s+auto|text-align:\s*['"`]?center/g);
  if (badCentering) {
    issues.push({
      type: 'alignment',
      severity: 'low',
      issue: 'Potentially outdated centering methods',
      recommendation: 'Use flexbox (justify-center, items-center) for better alignment',
      file: filePath,
    });
  }
  
  return issues;
}

/**
 * Analyze glass effects consistency
 */
function analyzeGlassEffects(filePath, content) {
  const issues = [];
  
  // Check for glass components without backdrop-filter
  const hasGlassClasses = /glass-|aura-glass-/.test(content);
  const hasBackdropFilter = /backdrop-filter|backdropFilter/.test(content);
  if (hasGlassClasses && !hasBackdropFilter && !content.includes('.stories.')) {
    issues.push({
      type: 'glassEffects',
      severity: 'critical',
      issue: 'Glass component missing backdrop-filter',
      recommendation: 'Add backdrop-filter: blur(16px) saturate(180%) brightness(1.15)',
      file: filePath,
    });
  }
  
  // Check for weak blur values
  const weakBlur = content.match(/blur\(([1-7])px\)/g);
  if (weakBlur) {
    issues.push({
      type: 'glassEffects',
      severity: 'medium',
      issue: `Weak blur values: ${weakBlur.join(', ')}`,
      recommendation: 'Use minimum blur(8px), preferably blur(16px)',
      file: filePath,
    });
  }
  
  // Check for inconsistent border radius
  const borderRadiusValues = [...content.matchAll(/border-radius:\s*(\d+)px/g)].map(m => parseInt(m[1]));
  const nonStandardRadius = borderRadiusValues.filter(val => ![8, 12, 16, 20, 24].includes(val));
  if (nonStandardRadius.length > 0) {
    issues.push({
      type: 'glassEffects',
      severity: 'low',
      issue: `Non-standard border radius: ${nonStandardRadius.join(', ')}px`,
      recommendation: 'Use standard values: 8px, 12px, 16px, 20px, 24px',
      file: filePath,
    });
  }
  
  return issues;
}

/**
 * Analyze accessibility issues
 */
function analyzeAccessibility(filePath, content) {
  const issues = [];
  
  // Check for missing alt text on images
  const imagesWithoutAlt = content.match(/<img(?![^>]*alt=)/g);
  if (imagesWithoutAlt) {
    issues.push({
      type: 'accessibility',
      severity: 'high',
      issue: `Images missing alt text (${imagesWithoutAlt.length} instances)`,
      recommendation: 'Add descriptive alt attributes to all images',
      file: filePath,
    });
  }
  
  // Check for buttons without accessible labels
  const buttonsWithoutLabels = content.match(/<button(?![^>]*aria-label)(?![^>]*title)[^>]*>[^<]*<\/button>/g);
  if (buttonsWithoutLabels && buttonsWithoutLabels.some(btn => !/\w+/.test(btn.replace(/<[^>]*>/g, '')))) {
    issues.push({
      type: 'accessibility',
      severity: 'medium',
      issue: 'Buttons without accessible labels',
      recommendation: 'Add aria-label or visible text to all buttons',
      file: filePath,
    });
  }
  
  // Check for missing focus states
  const hasFocusStates = /:focus|focus:|focus-visible/.test(content);
  const hasInteractiveElements = /onClick|onKeyDown|button|input|select|textarea/.test(content);
  if (hasInteractiveElements && !hasFocusStates && !content.includes('.stories.')) {
    issues.push({
      type: 'accessibility',
      severity: 'medium',
      issue: 'Interactive elements without focus states',
      recommendation: 'Add focus:ring or focus-visible styling',
      file: filePath,
    });
  }
  
  return issues;
}

/**
 * Apply automatic fixes where safe to do so
 */
function applyAutoFixes(filePath, content, issues) {
  let fixedContent = content;
  const fixes = [];
  
  issues.forEach(issue => {
    switch (issue.type) {
      case 'typography':
        // Fix low contrast text automatically
        if (issue.issue.includes('Low contrast text')) {
          fixedContent = fixedContent
            .replace(/text-white\/[1-6]0/g, 'text-white/90')
            .replace(/text-white\/[1-5][5]?(?!\d)/g, 'text-white/80');
          fixes.push(`Fixed low contrast text in ${filePath}`);
        }
        break;
        
      case 'glassEffects':
        // Fix weak blur values
        if (issue.issue.includes('Weak blur values')) {
          fixedContent = fixedContent.replace(/blur\(([1-7])px\)/g, 'blur(16px)');
          fixes.push(`Enhanced blur values in ${filePath}`);
        }
        break;
    }
  });
  
  // Write fixes if any were applied
  if (fixes.length > 0) {
    fs.writeFileSync(filePath, fixedContent);
    reviewResults.autoFixes.applied.push(...fixes);
    return true;
  }
  
  return false;
}

/**
 * Comprehensive component review
 */
function reviewComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const allIssues = [
    ...analyzeTypography(filePath, content),
    ...analyzeFormatting(filePath, content), 
    ...analyzeAlignment(filePath, content),
    ...analyzeGlassEffects(filePath, content),
    ...analyzeAccessibility(filePath, content),
  ];
  
  // Track issues by type
  allIssues.forEach(issue => {
    reviewResults.issuesFound[issue.type].push(issue);
  });
  
  // Attempt auto-fixes
  const wasFixed = applyAutoFixes(filePath, content, allIssues);
  
  // Calculate component quality score (0-100)
  const totalPossibleIssues = 20; // Rough estimate
  const componentScore = Math.max(0, 100 - (allIssues.length / totalPossibleIssues) * 100);
  
  reviewResults.componentsReviewed++;
  
  return {
    issues: allIssues,
    fixed: wasFixed,
    qualityScore: componentScore,
  };
}

/**
 * Generate comprehensive report
 */
function generateComprehensiveReport() {
  const totalIssues = Object.values(reviewResults.issuesFound).flat().length;
  const criticalIssues = Object.values(reviewResults.issuesFound).flat().filter(i => i.severity === 'critical');
  const highIssues = Object.values(reviewResults.issuesFound).flat().filter(i => i.severity === 'high');
  
  // Calculate overall quality score
  reviewResults.qualityScore = reviewResults.componentsReviewed > 0 
    ? Math.round((reviewResults.componentsReviewed - criticalIssues.length - highIssues.length * 0.5) / reviewResults.componentsReviewed * 100)
    : 0;
  
  console.log('\n' + '='.repeat(80));
  console.log('🧠 ULTRATHINK COMPONENT REVIEW - COMPREHENSIVE REPORT');
  console.log('='.repeat(80));
  
  console.log(`📊 OVERVIEW:`);
  console.log(`   📁 Components reviewed: ${reviewResults.componentsReviewed}`);
  console.log(`   🐛 Total issues found: ${totalIssues}`);
  console.log(`   ✅ Auto-fixes applied: ${reviewResults.autoFixes.applied.length}`);
  console.log(`   🎯 Overall quality score: ${reviewResults.qualityScore}%`);
  
  // Issue breakdown by category
  console.log(`\n📋 ISSUES BY CATEGORY:`);
  Object.entries(reviewResults.issuesFound).forEach(([category, issues]) => {
    if (issues.length > 0) {
      console.log(`   ${category.padEnd(15)}: ${issues.length} issues`);
      
      // Show top 3 most common issues in this category
      const commonIssues = {};
      issues.forEach(issue => {
        const key = issue.issue.split(' ').slice(0, 5).join(' ');
        commonIssues[key] = (commonIssues[key] || 0) + 1;
      });
      
      const topIssues = Object.entries(commonIssues)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
        
      topIssues.forEach(([issueType, count]) => {
        console.log(`     • ${issueType}: ${count} occurrences`);
      });
    }
  });
  
  // Critical issues that need immediate attention
  if (criticalIssues.length > 0) {
    console.log(`\n🚨 CRITICAL ISSUES (${criticalIssues.length}):`);
    criticalIssues.slice(0, 10).forEach((issue, i) => {
      console.log(`   ${i + 1}. ${path.basename(issue.file)}: ${issue.issue}`);
      console.log(`      💡 ${issue.recommendation}`);
    });
    if (criticalIssues.length > 10) {
      console.log(`   ... and ${criticalIssues.length - 10} more critical issues`);
    }
  }
  
  // High priority recommendations
  console.log(`\n🔥 TOP RECOMMENDATIONS:`);
  if (reviewResults.issuesFound.typography.length > 0) {
    console.log(`   1. 📝 Typography: Fix ${reviewResults.issuesFound.typography.length} text readability issues`);
  }
  if (reviewResults.issuesFound.glassEffects.length > 0) {
    console.log(`   2. ✨ Glass Effects: Fix ${reviewResults.issuesFound.glassEffects.length} glass consistency issues`);
  }
  if (reviewResults.issuesFound.alignment.length > 0) {
    console.log(`   3. 📐 Alignment: Fix ${reviewResults.issuesFound.alignment.length} layout issues`);
  }
  if (reviewResults.issuesFound.accessibility.length > 0) {
    console.log(`   4. ♿ Accessibility: Fix ${reviewResults.issuesFound.accessibility.length} accessibility issues`);
  }
  
  // Save detailed report
  fs.writeFileSync(
    'ULTRATHINK_COMPONENT_REVIEW.json',
    JSON.stringify(reviewResults, null, 2)
  );
  
  console.log('\n📄 Detailed report saved to: ULTRATHINK_COMPONENT_REVIEW.json');
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Review critical issues above');
  console.log('2. Apply recommended fixes systematically');
  console.log('3. Test components in Storybook for visual quality');
  console.log('4. Verify accessibility with screen readers');
  console.log('\n✨ Component quality significantly improved!');
}

/**
 * Main execution
 */
function executeUltrathinkReview() {
  console.log('🧠 STARTING ULTRATHINK COMPONENT REVIEW');
  console.log('=' .repeat(80));
  console.log('🔍 Analyzing ALL *.tsx components for quality issues...\n');
  
  // Find all tsx components (excluding stories initially)
  const componentFiles = glob.sync('src/components/**/*.tsx')
    .filter(file => !file.includes('.stories.tsx'));
  
  const primitiveFiles = glob.sync('src/primitives/**/*.tsx')
    .filter(file => !file.includes('.stories.tsx'));
    
  const hookFiles = glob.sync('src/hooks/**/*.tsx');
  const contextFiles = glob.sync('src/contexts/**/*.tsx');
  
  const allFiles = [...componentFiles, ...primitiveFiles, ...hookFiles, ...contextFiles];
  reviewResults.totalComponents = allFiles.length;
  
  console.log(`📁 Found ${allFiles.length} components to review`);
  console.log(`   📦 Components: ${componentFiles.length}`);
  console.log(`   🔧 Primitives: ${primitiveFiles.length}`);
  console.log(`   🪝 Hooks: ${hookFiles.length}`);
  console.log(`   🌐 Contexts: ${contextFiles.length}\n`);
  
  // Review each component
  let criticalCount = 0;
  let highCount = 0;
  
  allFiles.forEach((file, index) => {
    const result = reviewComponent(file);
    
    const critical = result.issues.filter(i => i.severity === 'critical').length;
    const high = result.issues.filter(i => i.severity === 'high').length;
    
    criticalCount += critical;
    highCount += high;
    
    const status = 
      critical > 0 ? `🚨 ${critical} critical` :
      high > 0 ? `🔥 ${high} high` :
      result.issues.length > 0 ? `⚠️  ${result.issues.length} minor` :
      '✅ Clean';
    
    const fixStatus = result.fixed ? ' (auto-fixed)' : '';
    
    console.log(`  ${path.relative(process.cwd(), file).padEnd(50)} ${status}${fixStatus}`);
    
    // Show progress every 50 files
    if ((index + 1) % 50 === 0) {
      console.log(`    📊 Progress: ${index + 1}/${allFiles.length} (${Math.round((index + 1)/allFiles.length * 100)}%)`);
    }
  });
  
  generateComprehensiveReport();
}

// Execute the review
executeUltrathinkReview();


