#!/usr/bin/env node

/**
 * DIAGNOSE STORYBOOK ISSUES
 *
 * Detailed analysis of Storybook problems:
 * 1. Find missing story files
 * 2. Check import/export issues
 * 3. Analyze component dependencies
 * 4. Provide specific fix recommendations
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class StorybookDiagnostician {
  constructor() {
    this.issues = {
      missingStories: [],
      brokenImports: [],
      dependencyIssues: [],
      structuralProblems: []
    };
    this.foundStories = [];
    this.storyList = [];
  }

  async run() {
    console.log('🔍 STORYBOOK DIAGNOSTIC ANALYSIS');
    console.log('=================================\n');

    // Load the story list
    this.loadStoryList();

    // Find all actual story files
    await this.findAllStoryFiles();

    // Analyze missing stories
    this.analyzeMissingStories();

    // Analyze existing stories for issues
    await this.analyzeStoryFiles();

    // Generate comprehensive report
    this.generateDiagnosticReport();
  }

  loadStoryList() {
    console.log('📚 Loading expected story list...');

    try {
      const content = fs.readFileSync('story_files.txt', 'utf8');
      this.storyList = content.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => line.trim());

      console.log(`📋 Found ${this.storyList.length} expected stories`);
    } catch (error) {
      console.error('❌ Cannot read story_files.txt:', error.message);
      process.exit(1);
    }
  }

  async findAllStoryFiles() {
    console.log('\n🔎 Scanning for actual story files...');

    try {
      // Use a simpler approach with fs and path
      const { execSync } = require('child_process');

      // Use find command to locate all story files
      const result = execSync('find src -name "*.stories.*" -type f', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      this.foundStories = result.trim().split('\n').filter(line => line.trim());

      // Also check for .story. files
      const storyResult = execSync('find src -name "*.story.*" -type f', {
        encoding: 'utf8',
        cwd: process.cwd()
      });

      const storyFiles = storyResult.trim().split('\n').filter(line => line.trim());
      this.foundStories.push(...storyFiles);

      // Remove duplicates
      this.foundStories = [...new Set(this.foundStories)];

      console.log(`📁 Found ${this.foundStories.length} actual story files`);

    } catch (error) {
      console.log('⚠️  Using fallback file discovery method...');

      // Fallback: manual directory traversal
      this.foundStories = this.findStoryFilesRecursively('src');
      console.log(`📁 Found ${this.foundStories.length} actual story files (fallback method)`);
    }
  }

  findStoryFilesRecursively(dir) {
    const results = [];
    const fs = require('fs');
    const path = require('path');

    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          results.push(...this.findStoryFilesRecursively(fullPath));
        } else if (item.includes('.stories.') || item.includes('.story.')) {
          results.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return results;
  }

  analyzeMissingStories() {
    console.log('\n🔍 Analyzing missing story files...');

    const expectedNames = new Set();

    // Extract component names from expected stories
    this.storyList.forEach(story => {
      // Handle category/component format
      const parts = story.split('/');
      const componentName = parts.length > 1 ? parts[parts.length - 1] : story;
      expectedNames.add(componentName);
    });

    // Check which expected components have story files
    const foundNames = new Set();
    this.foundStories.forEach(filePath => {
      const fileName = path.basename(filePath, path.extname(filePath));
      // Remove .stories or .story suffix
      const componentName = fileName.replace(/\.stories?$/, '');
      foundNames.add(componentName);
    });

    // Find missing ones
    expectedNames.forEach(expected => {
      if (!foundNames.has(expected)) {
        this.issues.missingStories.push(expected);
      }
    });

    console.log(`❌ ${this.issues.missingStories.length} missing story files`);
    console.log(`✅ ${expectedNames.size - this.issues.missingStories.length} story files found`);
  }

  async analyzeStoryFiles() {
    console.log('\n🔧 Analyzing existing story files...');

    for (const storyFile of this.foundStories) {
      try {
        await this.analyzeSingleStoryFile(storyFile);
      } catch (error) {
        this.issues.structuralProblems.push({
          file: storyFile,
          error: error.message
        });
      }
    }

    console.log(`📊 Analysis complete`);
  }

  async analyzeSingleStoryFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const componentName = path.basename(filePath, path.extname(filePath)).replace(/\.stories?$/, '');

      // Check imports
      this.checkImports(filePath, content, componentName);

      // Check exports
      this.checkExports(filePath, content);

      // Check Storybook structure
      this.checkStorybookStructure(filePath, content);

      // Check for common issues
      this.checkCommonIssues(filePath, content, lines);

    } catch (error) {
      this.issues.structuralProblems.push({
        file: filePath,
        error: error.message
      });
    }
  }

  checkImports(filePath, content, componentName) {
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));

    // Check for component import
    const hasComponentImport = importLines.some(line =>
      line.includes(`import ${componentName}`) ||
      line.includes(`import { ${componentName}`) ||
      line.includes(`from './${componentName}'`) ||
      line.includes(`from '../${componentName}'`) ||
      line.includes(`from '../../${componentName}'`)
    );

    if (!hasComponentImport) {
      this.issues.brokenImports.push({
        file: filePath,
        type: 'MISSING_COMPONENT_IMPORT',
        component: componentName,
        suggestion: `Add: import ${componentName} from './${componentName}';`
      });
    }

    // Check for React import
    const hasReactImport = importLines.some(line =>
      line.includes('import React') ||
      line.includes("from 'react'")
    );

    if (!hasReactImport) {
      this.issues.brokenImports.push({
        file: filePath,
        type: 'MISSING_REACT_IMPORT',
        component: componentName,
        suggestion: `Add: import React from 'react';`
      });
    }
  }

  checkExports(filePath, content) {
    // Check for default export
    const hasDefaultExport = content.includes('export default');

    if (!hasDefaultExport) {
      this.issues.structuralProblems.push({
        file: filePath,
        type: 'MISSING_DEFAULT_EXPORT',
        suggestion: 'Add default export with meta object'
      });
    }

    // Check for named exports (stories)
    const hasNamedExports = content.includes('export const');

    if (!hasNamedExports) {
      this.issues.structuralProblems.push({
        file: filePath,
        type: 'MISSING_STORY_EXPORTS',
        suggestion: 'Add at least one story export'
      });
    }
  }

  checkStorybookStructure(filePath, content) {
    // Check for Storybook v7+ structure
    const hasMeta = content.includes('export default') &&
                   (content.includes('title:') || content.includes('component:'));

    if (!hasMeta) {
      this.issues.structuralProblems.push({
        file: filePath,
        type: 'MISSING_STORYBOOK_META',
        suggestion: 'Add proper meta export: export default { title: "...", component: ... }'
      });
    }

    // Check for Story type imports
    const hasStoryImports = content.includes('StoryObj') ||
                           content.includes('StoryFn') ||
                           content.includes('Story<');

    if (!hasStoryImports) {
      this.issues.structuralProblems.push({
        file: filePath,
        type: 'MISSING_STORY_TYPES',
        suggestion: 'Add: import type { Meta, StoryObj } from "@storybook/react";'
      });
    }
  }

  checkCommonIssues(filePath, content, lines) {
    // Check for undefined values
    const undefinedLines = lines.filter(line => line.includes('undefined'));

    if (undefinedLines.length > 0) {
      this.issues.dependencyIssues.push({
        file: filePath,
        type: 'POTENTIAL_UNDEFINED_VALUES',
        lines: undefinedLines.length,
        suggestion: 'Replace undefined with proper default values'
      });
    }

    // Check for missing dependencies
    const functionCalls = content.match(/(\w+)\(/g) || [];
    const calledFunctions = functionCalls.map(match => match.replace('(', ''));

    for (const func of calledFunctions) {
      if (!content.includes(`import ${func}`) &&
          !content.includes(`import { ${func}`) &&
          !content.includes(`function ${func}`) &&
          !content.includes(`const ${func} =`)) {

        // Skip common built-ins
        if (!['console', 'setTimeout', 'setInterval', 'require', 'import', 'export'].includes(func)) {
          this.issues.brokenImports.push({
            file: filePath,
            type: 'MISSING_FUNCTION_DEPENDENCY',
            function: func,
            suggestion: `Add import for ${func} or define it locally`
          });
        }
      }
    }
  }

  generateDiagnosticReport() {
    console.log('\n📊 DIAGNOSTIC REPORT');
    console.log('===================');

    const totalIssues = Object.values(this.issues).reduce((sum, arr) => sum + arr.length, 0);

    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total expected stories: ${this.storyList.length}`);
    console.log(`   Total found stories: ${this.foundStories.length}`);
    console.log(`   Total issues found: ${totalIssues}`);

    // Missing stories
    if (this.issues.missingStories.length > 0) {
      console.log(`\n❌ MISSING STORY FILES (${this.issues.missingStories.length}):`);
      console.log(`   These components need story files created:`);

      this.issues.missingStories.slice(0, 20).forEach(component => {
        console.log(`   • ${component}`);
      });

      if (this.issues.missingStories.length > 20) {
        console.log(`   ... and ${this.issues.missingStories.length - 20} more`);
      }
    }

    // Import issues
    if (this.issues.brokenImports.length > 0) {
      console.log(`\n🔗 BROKEN IMPORTS (${this.issues.brokenImports.length}):`);
      console.log(`   Import/export problems in story files:`);

      const groupedImports = {};
      this.issues.brokenImports.forEach(issue => {
        if (!groupedImports[issue.type]) {
          groupedImports[issue.type] = [];
        }
        groupedImports[issue.type].push(issue);
      });

      Object.keys(groupedImports).forEach(type => {
        console.log(`   📂 ${type} (${groupedImports[type].length} issues):`);
        groupedImports[type].slice(0, 5).forEach(issue => {
          console.log(`      ${issue.file}`);
          if (issue.suggestion) {
            console.log(`      💡 ${issue.suggestion}`);
          }
        });
      });
    }

    // Dependency issues
    if (this.issues.dependencyIssues.length > 0) {
      console.log(`\n⚠️  DEPENDENCY ISSUES (${this.issues.dependencyIssues.length}):`);
      this.issues.dependencyIssues.slice(0, 10).forEach(issue => {
        console.log(`   📁 ${issue.file}`);
        console.log(`   🐛 ${issue.type}`);
        if (issue.suggestion) {
          console.log(`   💡 ${issue.suggestion}`);
        }
      });
    }

    // Structural problems
    if (this.issues.structuralProblems.length > 0) {
      console.log(`\n🏗️  STRUCTURAL PROBLEMS (${this.issues.structuralProblems.length}):`);
      this.issues.structuralProblems.slice(0, 10).forEach(issue => {
        console.log(`   📁 ${issue.file}`);
        console.log(`   🐛 ${issue.type}`);
        if (issue.suggestion) {
          console.log(`   💡 ${issue.suggestion}`);
        }
      });
    }

    // Recommendations
    this.provideRecommendations();
  }

  provideRecommendations() {
    console.log('\n💡 ACTIONABLE RECOMMENDATIONS');
    console.log('=============================');

    if (this.issues.missingStories.length > 100) {
      console.log('🚨 CRITICAL: Most story files are missing!');
      console.log('   • Use the existing scripts/generate-stories.js to auto-generate missing stories');
      console.log('   • Check if story files exist in different locations');
      console.log('   • Update story_files.txt if component names have changed');
    }

    if (this.issues.brokenImports.length > 0) {
      console.log('\n🔧 IMPORT FIXES NEEDED:');
      console.log('   • Add missing React imports: import React from "react";');
      console.log('   • Fix component import paths');
      console.log('   • Add missing function imports');
      console.log('   • Use the mass fix scripts to bulk update imports');
    }

    if (this.issues.structuralProblems.length > 0) {
      console.log('\n🏗️  STORYBOOK STRUCTURE FIXES:');
      console.log('   • Update to Storybook v7+ format');
      console.log('   • Add proper meta exports');
      console.log('   • Add StoryObj type imports');
      console.log('   • Follow the updated story format');
    }

    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. Run: node scripts/generate-stories.js');
    console.log('   2. Fix import issues with mass fix scripts');
    console.log('   3. Update Storybook to latest format');
    console.log('   4. Re-run smoke test to verify fixes');
    console.log('   5. Test in browser: npm run storybook');

    console.log('\n📊 EXPECTED OUTCOME:');
    console.log('   After fixes, you should see 90%+ of components working');
    console.log('   The remaining 10% will need manual attention');
  }
}

// Run the diagnostic
const diagnostician = new StorybookDiagnostician();
diagnostician.run().catch(error => {
  console.error('💥 Diagnostic failed:', error);
  process.exit(1);
});
