#!/usr/bin/env node
/**
 * Comprehensive Glass Migration Script
 * 
 * Migrates ALL 427 components to use the unified glass system.
 * This addresses the critical gap of only having 27/427 components migrated (6%).
 */

const fs = require('fs');
const path = require('path');

class ComprehensiveGlassMigration {
  constructor() {
    this.stats = {
      totalComponents: 0,
      migratedComponents: 0,
      skippedComponents: 0,
      errorComponents: 0,
      newStoriesCreated: 0
    };
    
    this.glassPatterns = [
      // Direct backdrop-filter usage
      /backdrop-filter:\s*blur\([^)]+\)/g,
      /-webkit-backdrop-filter:\s*blur\([^)]+\)/g,
      
      // Common glass background patterns
      /background:\s*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)/g,
      /backgroundColor:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)['"]/g,
      
      // Box shadow glass patterns
      /box-shadow:[^;]*inset[^;]*rgba\([^)]*0\.[0-9][^)]*\)/g,
      
      // Border glass patterns
      /border:[^;]*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)/g
    ];
    
    this.intentMapping = {
      'primary': ['primary', 'main', 'blue'],
      'success': ['success', 'green', 'positive'],
      'warning': ['warning', 'yellow', 'caution'],
      'danger': ['danger', 'error', 'red', 'destructive'],
      'info': ['info', 'blue', 'information'],
      'neutral': ['neutral', 'default', 'gray', 'grey']
    };
  }

  async run() {
    console.log('🚀 Starting Comprehensive Glass Migration...');
    console.log('🎯 Target: 427 components, Currently: 27 migrated (6%)');
    console.log('📊 Goal: 100% migration coverage\n');
    
    const startTime = Date.now();
    
    // Phase 1: Scan all components
    await this.scanAllComponents();
    
    // Phase 2: Identify glass components  
    await this.identifyGlassComponents();
    
    // Phase 3: Migrate components
    await this.migrateComponents();
    
    // Phase 4: Create missing Storybook stories
    await this.createStorybookStories();
    
    // Phase 5: Generate migration report
    await this.generateReport(startTime);
    
    console.log(`\n✅ Migration completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    console.log(`📊 Results: ${this.stats.migratedComponents} migrated, ${this.stats.skippedComponents} skipped, ${this.stats.errorComponents} errors`);
  }

  async scanAllComponents() {
    console.log('📂 Scanning all components...');
    
    const componentsDir = path.join(process.cwd(), 'src', 'components');
    const componentFiles = this.getAllTsxFiles(componentsDir);
    
    this.stats.totalComponents = componentFiles.length;
    console.log(`   Found ${this.stats.totalComponents} total components`);
    
    return componentFiles;
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

  async identifyGlassComponents() {
    console.log('🔍 Identifying components that need glass effects...');
    
    const componentsDir = path.join(process.cwd(), 'src', 'components');
    const componentFiles = this.getAllTsxFiles(componentsDir);
    
    this.glassComponents = [];
    this.nonGlassComponents = [];
    
    for (const filePath of componentFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      // Check if component likely needs glass effects
      if (this.needsGlassEffects(content, fileName)) {
        this.glassComponents.push(filePath);
      } else {
        this.nonGlassComponents.push(filePath);
      }
    }
    
    console.log(`   Glass components: ${this.glassComponents.length}`);
    console.log(`   Non-glass components: ${this.nonGlassComponents.length}`);
  }

  needsGlassEffects(content, fileName) {
    // Check filename patterns
    if (fileName.toLowerCase().includes('glass')) return true;
    if (fileName.toLowerCase().includes('card')) return true;
    if (fileName.toLowerCase().includes('modal')) return true;
    if (fileName.toLowerCase().includes('dialog')) return true;
    if (fileName.toLowerCase().includes('panel')) return true;
    if (fileName.toLowerCase().includes('overlay')) return true;
    
    // Check content for glass patterns
    for (const pattern of this.glassPatterns) {
      if (pattern.test(content)) return true;
    }
    
    // Check for glass-related imports or usage
    if (content.includes('backdrop') || 
        content.includes('glassmorphism') ||
        content.includes('createGlassStyle') ||
        content.includes('glassMixins')) {
      return true;
    }
    
    // Check styled-components with glass patterns
    if (content.includes('styled') && (
        content.includes('blur(') ||
        content.includes('rgba(255, 255, 255, 0.') ||
        content.includes('inset')
    )) {
      return true;
    }
    
    return false;
  }

  async migrateComponents() {
    console.log(`🔧 Migrating ${this.glassComponents.length} glass components...`);
    
    for (const filePath of this.glassComponents) {
      try {
        await this.migrateComponent(filePath);
        this.stats.migratedComponents++;
        
        if (this.stats.migratedComponents % 50 === 0) {
          console.log(`   Progress: ${this.stats.migratedComponents}/${this.glassComponents.length} components migrated`);
        }
      } catch (error) {
        console.error(`   ❌ Error migrating ${path.basename(filePath)}:`, error.message);
        this.stats.errorComponents++;
      }
    }
  }

  async migrateComponent(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const componentName = path.basename(filePath, '.tsx');
    
    // Skip if already migrated
    if (content.includes('createGlassStyle') && 
        content.includes('from') && 
        content.includes('glassMixins')) {
      this.stats.skippedComponents++;
      return;
    }
    
    // Add createGlassStyle import if not present
    if (!content.includes('createGlassStyle')) {
      const importLine = "import { createGlassStyle } from '../../core/mixins/glassMixins';";
      
      if (content.includes('import React')) {
        content = content.replace(
          /(import React[^;]*;)/,
          `$1\n${importLine}`
        );
      } else {
        content = `${importLine}\n${content}`;
      }
    }
    
    // Determine appropriate glass intent based on component name/path
    const intent = this.determineIntent(componentName, filePath);
    const elevation = this.determineElevation(componentName);
    
    // Replace glass patterns with createGlassStyle
    content = this.replaceGlassPatterns(content, intent, elevation);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
    } else {
      this.stats.skippedComponents++;
    }
  }

  determineIntent(componentName, filePath) {
    const name = componentName.toLowerCase();
    const path = filePath.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(this.intentMapping)) {
      for (const keyword of keywords) {
        if (name.includes(keyword) || path.includes(keyword)) {
          return intent;
        }
      }
    }
    
    return 'neutral'; // default
  }

  determineElevation(componentName) {
    const name = componentName.toLowerCase();
    
    if (name.includes('modal') || name.includes('dialog') || name.includes('tooltip')) {
      return 'level4';
    }
    if (name.includes('dropdown') || name.includes('popup') || name.includes('overlay')) {
      return 'level3';  
    }
    if (name.includes('card') || name.includes('panel')) {
      return 'level2';
    }
    
    return 'level2'; // default
  }

  replaceGlassPatterns(content, intent, elevation) {
    const glassCall = `createGlassStyle({ intent: '${intent}', elevation: '${elevation}' })`;
    
    // Replace inline backdrop-filter
    content = content.replace(
      /backdrop-filter:\s*blur\([^)]+\)/g,
      `\${${glassCall}}`
    );
    
    // Replace webkit backdrop-filter
    content = content.replace(
      /-webkit-backdrop-filter:\s*blur\([^)]+\)/g,
      `\${${glassCall}}`
    );
    
    // Replace glass background patterns
    content = content.replace(
      /background:\s*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)/g,
      `\${${glassCall}}`
    );
    
    // Replace styled-component glass patterns
    content = content.replace(
      /\$\{props => css`[^`]*backdrop-filter:[^`]*`\}/g,
      `\${() => ${glassCall}}`
    );
    
    return content;
  }

  async createStorybookStories() {
    console.log('📚 Creating missing Storybook stories...');
    
    for (const filePath of this.glassComponents) {
      const storyPath = filePath.replace('.tsx', '.stories.tsx');
      
      if (!fs.existsSync(storyPath)) {
        await this.createStoryFile(filePath);
        this.stats.newStoriesCreated++;
      }
    }
    
    console.log(`   Created ${this.stats.newStoriesCreated} new story files`);
  }

  async createStoryFile(componentPath) {
    const componentName = path.basename(componentPath, '.tsx');
    const relativePath = path.relative(path.join(process.cwd(), 'src'), componentPath);
    const importPath = './' + relativePath.replace('.tsx', '');
    
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from '${importPath}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Glass Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'glass', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
  },
  argTypes: {
    // Add common glass props
    intent: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    elevation: {
      control: { type: 'select' }, 
      options: ['level1', 'level2', 'level3', 'level4'],
    },
    tier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Glass ${componentName}',
  },
};

export const Primary: Story = {
  args: {
    ...Default.args,
    intent: 'primary',
  },
};

export const Elevated: Story = {
  args: {
    ...Default.args,
    elevation: 'level3',
  },
};

export const HighTier: Story = {
  args: {
    ...Default.args,
    tier: 'high',
  },
};
`;

    const storyPath = componentPath.replace('.tsx', '.stories.tsx');
    fs.writeFileSync(storyPath, storyContent, 'utf8');
  }

  async generateReport(startTime) {
    const report = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      phase: 'Comprehensive Glass Migration',
      stats: this.stats,
      coverage: {
        before: '27/427 (6%)',
        after: `${this.stats.migratedComponents}/427 (${Math.round(this.stats.migratedComponents / 427 * 100)}%)`,
        improvement: `${this.stats.migratedComponents - 27} additional components migrated`
      },
      glassComponents: this.glassComponents.length,
      storybookCoverage: `${this.stats.newStoriesCreated} new stories created`,
      success: this.stats.errorComponents === 0
    };
    
    const reportDir = path.join(process.cwd(), 'reports', 'glass');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, 'comprehensive-migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Migration Report:');
    console.log('='.repeat(50));
    console.log(`🏁 Duration: ${(report.duration / 1000).toFixed(1)}s`);
    console.log(`📈 Coverage: ${report.coverage.before} → ${report.coverage.after}`);
    console.log(`🔧 Migrated: ${this.stats.migratedComponents} components`);
    console.log(`📚 Stories: ${this.stats.newStoriesCreated} created`);
    console.log(`⚠️  Errors: ${this.stats.errorComponents}`);
    console.log(`📄 Report: ${reportPath}`);
    
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const migration = new ComprehensiveGlassMigration();
  migration.run().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

module.exports = ComprehensiveGlassMigration;