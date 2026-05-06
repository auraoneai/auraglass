#!/usr/bin/env node
/**
 * Final Glass Migration Script
 * 
 * Migrates the remaining 50+ components with hardcoded rgba values to unified glass system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of files that still need migration (from our audit)
const FILES_WITH_HARDCODED_VALUES = [
  'src/components/charts/plugins/GalileoElementInteractionPlugin.tsx',
  'src/components/charts/components/ChartGrid.tsx', 
  'src/components/charts/components/ChartAxis.tsx',
  'src/components/navigation/components/ScrollButtons.tsx',
  'src/components/tree-view/TreeView.tsx',
  'src/components/visual-feedback/RippleButton.tsx',
  'src/components/speed-dial/SpeedDial.tsx',
  'src/components/image-list/ImageListItem.tsx',
  'src/components/cookie-consent/CompactCookieNotice.tsx',
  'src/components/charts/GlassDataChart.tsx',
  'src/components/surfaces/HeatGlass.tsx',
  'src/components/surfaces/DimensionalGlass.tsx',
  'src/components/charts/ModularGlassDataChart.tsx',
  'src/components/navigation/GlassSidebar.tsx',
  'src/components/surfaces/FrostedGlass.tsx',
  'src/components/navigation/GlassHeader.tsx',
  'src/components/navigation/GlassNavigation.tsx',
  'src/components/data-display/GlassSkeletonLoader.tsx',
  'src/components/image-list/ImageList.tsx',
  'src/components/image-list/ImageListItemBar.tsx',
  'src/components/charts/components/ChartContainer.tsx',
  'src/components/data-display/GlassSkeleton.tsx',
  'src/components/interactive/GlassThemeDemo.tsx',
  'src/components/templates/dashboard/widgets/ChartWidget.tsx',
  'src/components/navigation/components/TabItem.tsx',
  'src/components/navigation/components/CollapsedMenu.tsx',
  'src/components/data-display/GlassAnimatedNumber.tsx',
  'src/components/cookie-consent/CookieConsent.tsx',
  'src/components/cookie-consent/GlobalCookieConsent.tsx',
  'src/components/data-display/GlassLoadingSkeleton.tsx',
  'src/components/charts/GlassChart.tsx',
  'src/components/charts/components/KpiChart.tsx',
  'src/components/charts/components/ChartTooltip.tsx',
  'src/components/charts/components/ChartRenderer.tsx',
  'src/components/charts/components/ChartLegend.tsx',
  'src/components/charts/components/ChartFilters.tsx',
  'src/components/website-components/MotionAwareGlass.tsx',
  'src/components/website-components/GlassWipeSlider.tsx',
  'src/components/website-components/GlassPrismComparison.tsx',
  'src/components/website-components/GlassLinkButton.tsx',
  'src/components/website-components/GlassChartsDemo.tsx',
  'src/components/visual-feedback/VisualFeedback.tsx',
  'src/components/visual-feedback/StateIndicator.tsx',
  'src/components/visual-feedback/FocusIndicator.tsx',
  'src/components/tree-view/TreeItem.tsx',
  'src/components/toggle-button/ToggleButton.tsx',
  'src/components/surfaces/WidgetGlass.tsx',
  'src/components/surfaces/PageGlassContainer.tsx',
  'src/components/speed-dial/SpeedDialAction.tsx',
  'src/components/navigation/GlassTabBar.tsx'
];

class FinalGlassMigration {
  constructor() {
    this.migratedCount = 0;
    this.errorCount = 0;
    this.skippedCount = 0;
  }

  async run() {
    console.log('🚀 Starting Final Glass Migration for 50+ remaining components...\n');
    
    for (const filePath of FILES_WITH_HARDCODED_VALUES) {
      try {
        const fullPath = path.join(process.cwd(), filePath);
        
        if (!fs.existsSync(fullPath)) {
          console.log(`⚠️  Skipping missing file: ${filePath}`);
          this.skippedCount++;
          continue;
        }

        await this.migrateComponent(fullPath);
        this.migratedCount++;
        
        if (this.migratedCount % 10 === 0) {
          console.log(`✅ Progress: ${this.migratedCount}/${FILES_WITH_HARDCODED_VALUES.length} components migrated`);
        }
        
      } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
        this.errorCount++;
      }
    }

    this.generateReport();
    await this.createMissingStory();
  }

  async migrateComponent(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changed = false;

    // Skip if already fully migrated
    if (this.isFullyMigrated(content)) {
      console.log(`⏭️  Already migrated: ${path.basename(filePath)}`);
      this.skippedCount++;
      return;
    }

    // Add import if needed
    if (!content.includes('createGlassStyle')) {
      content = this.addGlassStyleImport(content, filePath);
      changed = true;
    }

    // Add glass styles variables if needed
    if (!content.includes('const glassStyles = createGlassStyle')) {
      content = this.addGlassStylesVariable(content);
      changed = true;
    }

    // Replace hardcoded rgba values
    const { newContent, replacements } = this.replaceHardcodedValues(content);
    if (replacements > 0) {
      content = newContent;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Migrated ${path.basename(filePath)} (${replacements} replacements)`);
    } else {
      this.skippedCount++;
    }
  }

  isFullyMigrated(content) {
    // Check if it uses createGlassStyle and has no hardcoded rgba values
    const hasGlassStyle = content.includes('createGlassStyle');
    const hasHardcodedValues = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/.test(content);
    
    return hasGlassStyle && !hasHardcodedValues;
  }

  addGlassStyleImport(content, filePath) {
    // Calculate correct relative path
    const componentDir = path.dirname(filePath);
    const glassMixinsPath = path.resolve('src/core/mixins/glassMixins.ts');
    const relativePath = path.relative(componentDir, glassMixinsPath)
      .replace(/\\/g, '/')
      .replace('.ts', '');
    
    const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
    const importStatement = `import { createGlassStyle } from '${importPath}';`;

    // Find the best place to insert the import
    const reactImportMatch = content.match(/import React[^;]*;/);
    if (reactImportMatch) {
      return content.replace(reactImportMatch[0], `${reactImportMatch[0]}\n${importStatement}`);
    } else {
      return `${importStatement}\n${content}`;
    }
  }

  addGlassStylesVariable(content) {
    // Find component function start
    const patterns = [
      /const\s+\w+Component\s*=\s*\([^)]*\)\s*=>\s*\{/,
      /function\s+\w+Component\s*\([^)]*\)\s*\{/,
      /const\s+\w+\s*=\s*forwardRef\(\s*\([^)]*\)\s*=>\s*\{/
    ];

    for (let pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const insertIndex = match.index + match[0].length;
        const glassVars = `
  // Unified glass styles
  const glassStyles = createGlassStyle({ intent: 'neutral', elevation: 'level2', tier: 'high' });
`;
        return content.slice(0, insertIndex) + glassVars + content.slice(insertIndex);
      }
    }

    return content;
  }

  replaceHardcodedValues(content) {
    let newContent = content;
    let replacements = 0;

    // Common replacement patterns
    const patterns = [
      // White background colors
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.1\)/g,
        replacement: '${glassStyles.surface?.base || "rgba(255, 255, 255, 0.1)"}',
      },
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.05\)/g,
        replacement: '${glassStyles.surface?.base || "rgba(255, 255, 255, 0.05)"}',
      },
      
      // Border colors
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.2\)/g,
        replacement: '${glassStyles.borderColor || "rgba(255, 255, 255, 0.2)"}',
      },
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.15\)/g,
        replacement: '${glassStyles.borderColor || "rgba(255, 255, 255, 0.15)"}',
      },
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.3\)/g,
        replacement: '${glassStyles.borderColor || "rgba(255, 255, 255, 0.3)"}',
      },

      // Text colors
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.9\)/g,
        replacement: '${glassStyles.text?.primary || "rgba(255, 255, 255, 0.9)"}',
      },
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.7\)/g,
        replacement: '${glassStyles.text?.secondary || "rgba(255, 255, 255, 0.7)"}',
      },
      {
        pattern: /rgba\(255,\s*255,\s*255,\s*0\.6\)/g,
        replacement: '${glassStyles.text?.secondary || "rgba(255, 255, 255, 0.6)"}',
      },

      // Blue accent (primary)
      {
        pattern: /rgba\(59,\s*130,\s*246,\s*0\.([\d]+)\)/g,
        replacement: '${glassStyles.borderColor || "rgba(59, 130, 246, 0.$1)"}',
      }
    ];

    for (const { pattern, replacement } of patterns) {
      const matches = newContent.match(pattern);
      if (matches) {
        newContent = newContent.replace(pattern, replacement);
        replacements += matches.length;
      }
    }

    return { newContent, replacements };
  }

  async createMissingStory() {
    console.log('\n📚 Creating missing Storybook story...');
    
    const storyPath = 'src/components/card/patterns.stories.tsx';
    const componentPath = 'src/components/card/patterns.tsx';
    
    if (!fs.existsSync(storyPath)) {
      const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { patterns as CardPatterns } from './patterns';

const meta: Meta<typeof CardPatterns> = {
  title: 'Glass Components/Card/Patterns',
  component: CardPatterns,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithGlassEffect: Story = {
  args: {
    glassVariant: 'standard',
  },
};
`;
      
      fs.writeFileSync(storyPath, storyContent, 'utf8');
      console.log('✅ Created missing story: patterns.stories.tsx');
    }
  }

  generateReport() {
    console.log('\n📊 Final Migration Report:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${this.migratedCount}`);
    console.log(`⏭️  Already migrated/skipped: ${this.skippedCount}`);
    console.log(`❌ Errors: ${this.errorCount}`);
    console.log(`📁 Total components processed: ${FILES_WITH_HARDCODED_VALUES.length}`);
    
    // Verify final state
    console.log('\n🔍 Final verification...');
    try {
      const result = execSync(
        'find src/components -name "*.tsx" -not -name "*.stories.tsx" -exec grep -l "rgba(" {} \\; 2>/dev/null | wc -l',
        { encoding: 'utf8', cwd: process.cwd() }
      ).trim();
      
      const remainingComponents = parseInt(result);
      console.log(`📊 Components with remaining hardcoded values: ${remainingComponents}`);
      
      if (remainingComponents === 0) {
        console.log('🎉 SUCCESS: All components migrated to unified glass system!');
      } else {
        console.log(`⚠️  ${remainingComponents} components still need manual review`);
      }
    } catch (error) {
      console.log('⚠️  Could not verify final state');
    }
  }
}

// Run the migration
if (require.main === module) {
  const migration = new FinalGlassMigration();
  migration.run().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

module.exports = FinalGlassMigration;