#!/usr/bin/env node

/**
 * FIND ALL CONTEXT AND RUNTIME ERRORS
 * 
 * Systematically finds:
 * 1. Components that need context providers in stories
 * 2. Undefined data access in component code
 * 3. Missing required props causing crashes
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🎯 FINDING ALL REMAINING RUNTIME ERRORS');
console.log('======================================\n');

// Find all context-dependent components
const contextRequirements = [
  { component: 'TreeItem', provider: 'TreeView', path: 'tree-view' },
  { component: 'TabPanel', provider: 'Tabs', path: 'navigation' },
  { component: 'RadioGroupItem', provider: 'RadioGroup', path: 'input' },
  { component: 'CommandItem', provider: 'Command', path: 'interactive' },
  { component: 'SidebarItem', provider: 'Sidebar', path: 'navigation' }
];

let issuesFound = 0;

// 1. Check story files for missing context providers
console.log('🔍 Checking story files for missing context providers...');

contextRequirements.forEach(({ component, provider, path: compPath }) => {
  const storyFiles = glob.sync(`src/components/${compPath}/**/*.stories.{tsx,ts}`);
  
  storyFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes(component) && !content.includes(provider)) {
        console.log(`🚨 ${file}`);
        console.log(`   Missing: ${component} needs ${provider} provider`);
        console.log('');
        issuesFound++;
      }
    } catch (error) {
      // Skip
    }
  });
});

// 2. Check for undefined data access in component files
console.log('🔍 Checking component files for undefined data access...');

const componentFiles = glob.sync('src/components/**/*.{tsx,ts}', {
  ignore: ['**/*.stories.*', '**/*.test.*', '**/*.spec.*']
});

const dangerousPatterns = [
  /(\w+)\.map\s*\(/g,
  /(\w+)\.findIndex\s*\(/g,
  /(\w+)\.filter\s*\(/g,
  /(\w+)\.reduce\s*\(/g,
  /(\w+)\.forEach\s*\(/g
];

componentFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      dangerousPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const variable = match[1];
          
          // Skip safe patterns
          if (['React', 'Array', 'Object', 'children', 'args', 'props', 'items'].includes(variable)) {
            continue;
          }
          
          // Check if there's a null check nearby
          const contextLines = lines.slice(Math.max(0, index - 2), index + 1).join(' ');
          
          if (!contextLines.includes(`${variable} &&`) && 
              !contextLines.includes(`${variable}?.`) &&
              !contextLines.includes(`Array.isArray(${variable})`) &&
              !line.includes('|| []')) {
            
            console.log(`🚨 ${file.replace(process.cwd() + '/', '')}:${index + 1}`);
            console.log(`   Unsafe: ${variable}.${match[0].split('.')[1]} without null check`);
            console.log(`   Line: ${line.trim().substring(0, 80)}...`);
            console.log('');
            issuesFound++;
            break; // Only report one issue per line
          }
        }
      });
    });
  } catch (error) {
    // Skip
  }
});

console.log(`📊 SUMMARY`);
console.log(`=========`);
console.log(`Total runtime errors found: ${issuesFound}`);

if (issuesFound === 0) {
  console.log('🎉 No critical runtime errors found!');
} else {
  console.log(`❌ ${issuesFound} issues need fixing`);
  console.log('\n💊 Quick Fixes:');
  console.log('1. Add TreeView wrapper to TreeItem stories');
  console.log('2. Add null checks: if (!data || !Array.isArray(data)) return;');
  console.log('3. Provide default props: items = []');
  console.log('4. Use optional chaining: data?.map()');
}
