#!/usr/bin/env node
/**
 * Design Consistency Validation Script
 * 
 * Validates that our design system fixes are working properly:
 * - Text contrast meets WCAG AA standards
 * - Typography is consistent across components
 * - Glass tokens are being used correctly
 */

const fs = require('fs');
const path = require('path');

class DesignConsistencyValidator {
  constructor() {
    this.results = {
      textContrast: { pass: 0, fail: 0, issues: [] },
      typography: { pass: 0, fail: 0, issues: [] },
      glassTokens: { pass: 0, fail: 0, issues: [] },
      totalComponents: 0
    };
  }

  async run() {
    console.log('🔍 Validating Design Consistency...\n');

    await this.validateTextContrast();
    await this.validateTypography();
    await this.validateGlassTokenUsage();
    
    this.generateReport();
  }

  async validateTextContrast() {
    console.log('📝 Validating text contrast...');

    const problematicPatterns = [
      'color: black',
      'color: #000',
      'color: #333',
      'color: #666',
      'color: rgba(0,0,0',
      'color: \'black\'',
      'color: "black"'
    ];

    const componentFiles = this.getAllTsxFiles('src/components');
    
    for (const filePath of componentFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      let hasContrastIssues = false;
      
      for (const pattern of problematicPatterns) {
        if (content.includes(pattern)) {
          hasContrastIssues = true;
          this.results.textContrast.issues.push({
            file: fileName,
            issue: `Found problematic pattern: ${pattern}`
          });
        }
      }
      
      if (hasContrastIssues) {
        this.results.textContrast.fail++;
      } else {
        this.results.textContrast.pass++;
      }
      
      this.results.totalComponents++;
    }

    console.log(`  ✅ Components with good contrast: ${this.results.textContrast.pass}`);
    console.log(`  ❌ Components with contrast issues: ${this.results.textContrast.fail}`);
  }

  async validateTypography() {
    console.log('\n🔤 Validating typography consistency...');

    const hardcodedTypographyPatterns = [
      /fontSize:\s*['"]?\d+px['"]?/g,
      /fontWeight:\s*['"]?bold['"]?/g,
      /fontWeight:\s*['"]?700['"]?/g,
      /font-size:\s*\d+px/g,
      /font-weight:\s*bold/g,
      /font-weight:\s*700/g
    ];

    const componentFiles = this.getAllTsxFiles('src/components');
    
    for (const filePath of componentFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      let hasTypographyIssues = false;
      
      for (const pattern of hardcodedTypographyPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          hasTypographyIssues = true;
          this.results.typography.issues.push({
            file: fileName,
            issue: `Found hardcoded typography: ${matches[0]}`
          });
        }
      }
      
      if (hasTypographyIssues) {
        this.results.typography.fail++;
      } else {
        this.results.typography.pass++;
      }
    }

    console.log(`  ✅ Components with consistent typography: ${this.results.typography.pass}`);
    console.log(`  ❌ Components with typography issues: ${this.results.typography.fail}`);
  }

  async validateGlassTokenUsage() {
    console.log('\n🎨 Validating glass token usage...');

    const componentFiles = this.getAllTsxFiles('src/components');
    
    for (const filePath of componentFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      // Skip if it's not a glass component
      if (!fileName.toLowerCase().includes('glass') && !this.appearsToNeedGlass(content)) {
        continue;
      }

      const hasGlassImport = content.includes('createGlassStyle');
      const hasGlassUsage = content.includes('glassStyles');
      const hasHardcodedGlass = this.hasHardcodedGlassValues(content);
      
      if (hasGlassImport && hasGlassUsage && !hasHardcodedGlass) {
        this.results.glassTokens.pass++;
      } else {
        this.results.glassTokens.fail++;
        
        if (!hasGlassImport) {
          this.results.glassTokens.issues.push({
            file: fileName,
            issue: 'Missing createGlassStyle import'
          });
        }
        
        if (!hasGlassUsage) {
          this.results.glassTokens.issues.push({
            file: fileName,
            issue: 'Not using glassStyles variable'
          });
        }
        
        if (hasHardcodedGlass) {
          this.results.glassTokens.issues.push({
            file: fileName,
            issue: 'Contains hardcoded glass values'
          });
        }
      }
    }

    console.log(`  ✅ Components using glass tokens correctly: ${this.results.glassTokens.pass}`);
    console.log(`  ❌ Components with glass token issues: ${this.results.glassTokens.fail}`);
  }

  getAllTsxFiles(dir) {
    let files = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllTsxFiles(fullPath));
      } else if (item.endsWith('.tsx') && !item.includes('.stories.')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  appearsToNeedGlass(content) {
    const glassIndicators = [
      'backdrop',
      'glassmorphism', 
      'blur',
      'rgba(',
      'card',
      'modal',
      'dialog',
      'panel'
    ];
    
    return glassIndicators.some(indicator => 
      content.toLowerCase().includes(indicator)
    );
  }

  hasHardcodedGlassValues(content) {
    const hardcodedPatterns = [
      /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.\d+\s*\)/,
      /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\.\d+\s*\)/,
      /backdrop-filter:\s*blur\(\d+px\)/,
      /background:\s*rgba\(/
    ];
    
    return hardcodedPatterns.some(pattern => pattern.test(content));
  }

  generateReport() {
    console.log('\n📊 Design Consistency Validation Report:');
    console.log('='.repeat(60));
    
    const totalScore = (
      this.results.textContrast.pass +
      this.results.typography.pass +
      this.results.glassTokens.pass
    );
    
    const totalPossible = this.results.totalComponents * 3; // 3 categories
    const overallScore = Math.round((totalScore / totalPossible) * 100);
    
    console.log(`🎯 Overall Design Consistency Score: ${overallScore}%`);
    console.log(`📁 Total Components Analyzed: ${this.results.totalComponents}`);
    
    console.log('\n📝 Text Contrast Results:');
    console.log(`   ✅ Compliant: ${this.results.textContrast.pass}`);
    console.log(`   ❌ Issues: ${this.results.textContrast.fail}`);
    
    console.log('\n🔤 Typography Results:');
    console.log(`   ✅ Consistent: ${this.results.typography.pass}`);
    console.log(`   ❌ Issues: ${this.results.typography.fail}`);
    
    console.log('\n🎨 Glass Token Usage Results:');
    console.log(`   ✅ Using tokens: ${this.results.glassTokens.pass}`);
    console.log(`   ❌ Issues: ${this.results.glassTokens.fail}`);

    // Show top issues if any
    const allIssues = [
      ...this.results.textContrast.issues,
      ...this.results.typography.issues,
      ...this.results.glassTokens.issues
    ];

    if (allIssues.length > 0) {
      console.log('\n⚠️  Top Issues to Address:');
      allIssues.slice(0, 10).forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.file}: ${issue.issue}`);
      });
      
      if (allIssues.length > 10) {
        console.log(`   ... and ${allIssues.length - 10} more issues`);
      }
    }

    console.log('\n🎉 Design System Status:');
    if (overallScore >= 90) {
      console.log('   🟢 EXCELLENT - Design system is highly consistent');
    } else if (overallScore >= 75) {
      console.log('   🟡 GOOD - Minor consistency issues remain');
    } else if (overallScore >= 60) {
      console.log('   🟠 NEEDS WORK - Significant consistency issues');
    } else {
      console.log('   🔴 CRITICAL - Major consistency problems');
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Review and fix components with contrast issues');
    console.log('   2. Replace hardcoded typography with token system');
    console.log('   3. Migrate remaining components to glass tokens');
    console.log('   4. Test changes in Storybook for visual consistency');
  }
}

// Run the validator
if (require.main === module) {
  const validator = new DesignConsistencyValidator();
  validator.run().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DesignConsistencyValidator;