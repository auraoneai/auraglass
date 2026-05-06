#!/usr/bin/env node

/**
 * REACT CONTEXT ERROR SCANNER
 * 
 * Finds components that require Context providers but their stories don't provide them.
 * This causes "X must be used within Y" errors in Storybook.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ContextErrorScanner {
  constructor() {
    this.contextErrors = [];
    this.scannedFiles = 0;
  }

  scanDirectory(dir) {
    console.log(`🔍 Scanning ${dir} for React Context errors...\n`);
    
    const storyFiles = glob.sync('**/*.stories.{tsx,ts}', {
      cwd: dir,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });

    storyFiles.forEach(file => {
      this.scanStoryFile(path.join(dir, file));
    });

    this.reportResults();
  }

  scanStoryFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.scannedFiles++;
      
      // Extract component name from story file
      const componentMatch = content.match(/import.*\{.*(\w+)\}.*from.*['"](.*)['"]/);
      const componentName = componentMatch ? componentMatch[1] : null;
      
      if (!componentName) return;
      
      // Check for context requirements
      this.checkForContextRequirements(filePath, componentName, content);
      
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}:`, error.message);
    }
  }

  checkForContextRequirements(filePath, componentName, content) {
    // Known context requirements
    const contextRequirements = {
      'TreeItem': 'TreeView',
      'TabPanel': 'Tabs',
      'TabTrigger': 'Tabs', 
      'RadioGroupItem': 'RadioGroup',
      'ToggleGroupItem': 'ToggleGroup',
      'CommandItem': 'Command',
      'SidebarItem': 'Sidebar',
      'ToastAction': 'ToastProvider',
      'NotificationItem': 'NotificationProvider'
    };

    // Check if component needs a context provider
    const requiredProvider = contextRequirements[componentName];
    
    if (requiredProvider) {
      // Check if the story provides the required context
      if (!content.includes(requiredProvider) && !content.includes('Provider')) {
        this.addContextError(filePath, componentName, requiredProvider, 'MISSING_PROVIDER');
      }
    }

    // Check for undefined data access patterns in stories
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      // Look for .map() calls without data validation
      if (line.includes('.map(') && !line.includes('?.map(') && 
          !line.includes(' || []') && !line.includes('Array.isArray(')) {
        
        const variable = line.match(/(\w+)\.map\(/)?.[1];
        if (variable && !['React', 'Object', 'Array', 'children'].includes(variable)) {
          this.addContextError(filePath, componentName, 'Data validation needed', 'UNSAFE_MAP_ACCESS', 
            `Line ${index + 1}: ${variable}.map() without null check`);
        }
      }
      
      // Look for .length access without checks
      if (line.includes('.length') && !line.includes('?.length') && 
          !line.includes(' || 0') && !line.includes('Array.isArray(')) {
        
        const variable = line.match(/(\w+)\.length/)?.[1];
        if (variable && !['React', 'Object', 'Array', 'children', 'arguments'].includes(variable)) {
          this.addContextError(filePath, componentName, 'Data validation needed', 'UNSAFE_LENGTH_ACCESS',
            `Line ${index + 1}: ${variable}.length without null check`);
        }
      }
    });
  }

  addContextError(file, component, provider, type, details = '') {
    this.contextErrors.push({
      file: file.replace(process.cwd() + '/', ''),
      component,
      provider,
      type,
      details
    });
  }

  reportResults() {
    console.log(`\n📊 React Context Error Scan Results`);
    console.log(`══════════════════════════════════════`);
    console.log(`Story files scanned: ${this.scannedFiles}`);
    console.log(`Context errors found: ${this.contextErrors.length}\n`);

    // Group by error type
    const typeGroups = this.contextErrors.reduce((groups, error) => {
      groups[error.type] = groups[error.type] || [];
      groups[error.type].push(error);
      return groups;
    }, {});

    Object.keys(typeGroups).forEach(type => {
      const errors = typeGroups[type];
      console.log(`🚨 ${type} (${errors.length} issues)`);
      console.log(`${'─'.repeat(60)}`);
      
      errors.forEach(error => {
        console.log(`📁 ${error.file}`);
        console.log(`   Component: ${error.component}`);
        
        if (error.type === 'MISSING_PROVIDER') {
          console.log(`   ❌ Missing: ${error.provider} provider`);
          console.log(`   🔧 Fix: Wrap stories with <${error.provider}>`);
        } else {
          console.log(`   ❌ Issue: ${error.provider}`);
          console.log(`   🔧 Details: ${error.details}`);
        }
        console.log('');
      });
      console.log('');
    });

    this.provideFixes();
  }

  provideFixes() {
    const missingProviders = this.contextErrors.filter(e => e.type === 'MISSING_PROVIDER');
    const unsafeAccess = this.contextErrors.filter(e => e.type.includes('UNSAFE'));
    
    console.log(`💡 Quick Fixes`);
    console.log(`═════════════`);
    
    if (missingProviders.length > 0) {
      console.log(`\n🔧 Missing Context Providers (${missingProviders.length} issues):`);
      console.log(`   Add decorators to story files:`);
      console.log(`   
decorators: [
  (Story) => (
    <RequiredProvider>
      <Story />
    </RequiredProvider>
  )
]`);
    }
    
    if (unsafeAccess.length > 0) {
      console.log(`\n🔧 Unsafe Data Access (${unsafeAccess.length} issues):`);
      console.log(`   Add data validation to story args:`);
      console.log(`   
args: {
  data: [], // Provide default empty arrays
  items: [], // Prevent undefined access
}`);
    }
  }
}

// Run the scanner
const scanner = new ContextErrorScanner();
const targetDir = process.argv[2] || './src';

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${targetDir} does not exist`);
  process.exit(1);
}

scanner.scanDirectory(targetDir);
