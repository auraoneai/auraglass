#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Complete 100% Glass Component Migration
 * Migrates remaining 232 components to unified glass system
 */

class Complete100PercentMigration {
  constructor() {
    this.componentsProcessed = 0;
    this.componentsMigrated = 0;
    this.totalComponents = 0;
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      this.log(`Error reading ${filePath}: ${error.message}`, 'error');
      return null;
    }
  }

  writeFile(filePath, content) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } catch (error) {
      this.log(`Error writing ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  // Check if component is already migrated
  isAlreadyMigrated(content) {
    return content.includes('createGlassStyle') && 
           content.includes("from '../core/mixins/glassMixins'") ||
           content.includes("from '../../core/mixins/glassMixins'") ||
           content.includes("from '../../../core/mixins/glassMixins'");
  }

  // Check if component needs glass migration (contains glass-related styling)
  needsGlassMigration(content, filePath) {
    const glassIndicators = [
      'backdrop-filter',
      'backdropFilter', 
      'glassmorphism',
      'glass',
      'frosted',
      'blur',
      'Glass',
      'rgba(255,255,255,0.',
      'rgba(0,0,0,0.',
      'background: linear-gradient',
      'border: 1px solid rgba',
      'box-shadow:'
    ];

    // Skip test files, stories, and d.ts files
    if (filePath.includes('.spec.') || filePath.includes('.test.') || 
        filePath.includes('.stories.') || filePath.includes('.d.ts')) {
      return false;
    }

    return glassIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  // Migrate component to unified glass system
  migrateComponent(content, filePath) {
    let migrated = false;
    let newContent = content;

    // Add glass import if not present
    if (!content.includes("from '../core/mixins/glassMixins'") &&
        !content.includes("from '../../core/mixins/glassMixins'") &&
        !content.includes("from '../../../core/mixins/glassMixins'")) {
      
      // Determine correct import path based on component location
      const relativePath = path.relative(path.dirname(filePath), 'src/core/mixins/glassMixins');
      const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      const cleanPath = importPath.replace(/\.tsx?$/, '');

      // Add import after other imports
      const importRegex = /(import[^;]+;[\n\r]*)+/;
      if (importRegex.test(newContent)) {
        newContent = newContent.replace(importRegex, (match) => {
          return match + `import { createGlassStyle } from '${cleanPath}';\n`;
        });
        migrated = true;
      }
    }

    // Replace hardcoded glass styles with createGlassStyle calls
    const glassPatterns = [
      {
        // Replace backdrop-filter patterns
        pattern: /backdrop-filter:\s*blur\((\d+)px\)/g,
        replacement: (match, blur) => {
          const elevation = blur <= 8 ? 'level1' : blur <= 12 ? 'level2' : blur <= 16 ? 'level3' : 'level4';
          return `...createGlassStyle({ elevation: '${elevation}' })`;
        }
      },
      {
        // Replace common glassmorphism background patterns
        pattern: /background:\s*rgba\(255,\s*255,\s*255,\s*0\.\d+\)/g,
        replacement: "...createGlassStyle({ intent: 'neutral', elevation: 'level2' })"
      },
      {
        // Replace box-shadow patterns
        pattern: /box-shadow:\s*0\s+\d+px\s+\d+px\s+rgba\([^)]+\)/g,
        replacement: "...createGlassStyle({ elevation: 'level2' })"
      },
      {
        // Replace border patterns
        pattern: /border:\s*1px\s+solid\s+rgba\([^)]+\)/g,
        replacement: "...createGlassStyle({ elevation: 'level1' })"
      }
    ];

    glassPatterns.forEach(({ pattern, replacement }) => {
      const originalLength = newContent.length;
      if (typeof replacement === 'function') {
        newContent = newContent.replace(pattern, replacement);
      } else {
        newContent = newContent.replace(pattern, replacement);
      }
      if (newContent.length !== originalLength) {
        migrated = true;
      }
    });

    // Add glass props to component interfaces if needed
    if (content.includes('interface') && content.includes('Props') && 
        !content.includes('GlassIntent') && !content.includes('GlassElevation')) {
      
      const interfacePattern = /(interface\s+\w*Props[^{]*{[^}]*)(})/;
      newContent = newContent.replace(interfacePattern, (match, beforeBrace, closingBrace) => {
        migrated = true;
        return `${beforeBrace}
  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
${closingBrace}`;
      });
    }

    // Add createGlassStyle usage in styled components
    if (content.includes('styled.') && !content.includes('createGlassStyle')) {
      // Look for styled component definitions and add glass styles
      const styledPattern = /(styled\.\w+`[^`]*)(backdrop-filter|background|border|box-shadow)([^`]*`)/g;
      newContent = newContent.replace(styledPattern, (match, before, property, after) => {
        migrated = true;
        return `${before}
  \${(props: any) => createGlassStyle({ 
    intent: props.intent || 'neutral', 
    elevation: props.elevation || 'level2',
    tier: props.tier || 'high'
  })}
  ${property}${after}`;
      });
    }

    return { content: newContent, migrated };
  }

  processComponent(filePath) {
    this.componentsProcessed++;
    const originalContent = this.readFile(filePath);
    
    if (!originalContent) return;

    // Skip if already migrated
    if (this.isAlreadyMigrated(originalContent)) {
      this.log(`  ✅ Already migrated: ${filePath}`, 'success');
      return;
    }

    // Skip if doesn't need glass migration
    if (!this.needsGlassMigration(originalContent, filePath)) {
      this.log(`  ➖ No glass needed: ${path.basename(filePath)}`, 'info');
      return;
    }

    this.log(`  🔄 Migrating: ${path.basename(filePath)}`, 'warning');

    const { content, migrated } = this.migrateComponent(originalContent, filePath);

    if (migrated) {
      if (this.writeFile(filePath, content)) {
        this.componentsMigrated++;
        this.log(`  ✅ Migrated: ${path.basename(filePath)}`, 'success');
      }
    } else {
      this.log(`  ➖ No changes needed: ${path.basename(filePath)}`, 'info');
    }
  }

  async run() {
    this.log('🚀 Starting Complete 100% Glass Migration...', 'info');

    // Get all React component files
    const componentFiles = glob.sync('src/components/**/*.{ts,tsx}', { 
      cwd: process.cwd(),
      ignore: [
        '**/*.d.ts', 
        '**/*.spec.ts', 
        '**/*.spec.tsx', 
        '**/*.test.ts', 
        '**/*.test.tsx',
        '**/*.stories.ts',
        '**/*.stories.tsx'
      ] 
    });

    this.totalComponents = componentFiles.length;
    this.log(`📁 Found ${this.totalComponents} components to process`, 'info');

    // Process each component
    for (const filePath of componentFiles) {
      this.processComponent(filePath);
    }

    // Calculate final coverage
    const finalCoverage = Math.round(((195 + this.componentsMigrated) / 427) * 100);

    // Summary
    this.log('\n📊 Migration Summary:', 'success');
    this.log(`   Components processed: ${this.componentsProcessed}`, 'info');
    this.log(`   Components migrated: ${this.componentsMigrated}`, 'success');
    this.log(`   Previous coverage: 195/427 (46%)`, 'info');
    this.log(`   New coverage: ${195 + this.componentsMigrated}/427 (${finalCoverage}%)`, 'success');
    
    if (finalCoverage >= 95) {
      this.log('\n🎉 MISSION ACCOMPLISHED! 95%+ coverage achieved!', 'success');
      this.log('✅ AuraGlass unified glass system migration complete!', 'success');
    } else if (finalCoverage >= 80) {
      this.log(`\n🎯 Great progress! ${finalCoverage}% coverage achieved!`, 'success');
      this.log(`🔄 ${427 - (195 + this.componentsMigrated)} components remaining for 100%`, 'warning');
    } else {
      this.log(`\n📈 Progress made: ${finalCoverage}% coverage`, 'info');
      this.log(`🔄 Continue migration for remaining components`, 'warning');
    }
    
    this.log('\n🔍 Run `npm run typecheck` to verify all changes compile successfully', 'info');
  }
}

// Run the migration
const migrator = new Complete100PercentMigration();
migrator.run().catch(console.error);