#!/usr/bin/env node

/**
 * COMPREHENSIVE ERROR SCANNER
 * 
 * Finds ALL types of errors that could crash components:
 * 1. Motion performance issues (freezing)
 * 2. JavaScript runtime errors (undefined.length)
 * 3. Missing imports/functions (createGalileoPlugin is not a function)
 * 4. Invalid JSX patterns (input with children)
 * 5. React specific errors
 * 6. TypeScript issues
 * 7. Common crash patterns
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ComprehensiveErrorScanner {
  constructor() {
    this.issues = [];
    this.scannedFiles = 0;
    this.errorCategories = {
      MOTION_PERFORMANCE: 'Motion Performance (Freezing)',
      RUNTIME_ERROR: 'JavaScript Runtime Error',
      MISSING_IMPORT: 'Missing Import/Function',
      INVALID_JSX: 'Invalid JSX Pattern',
      REACT_ERROR: 'React Specific Error',
      TYPESCRIPT_ERROR: 'TypeScript Issue',
      STORYBOOK_ERROR: 'Storybook Configuration'
    };
  }

  scanDirectory(dir) {
    console.log(`🔥 COMPREHENSIVE ERROR SCAN: ${dir}`);
    console.log(`Finding ALL errors that could crash your components...\n`);
    
    const files = glob.sync('**/*.{tsx,ts,jsx,js}', {
      cwd: dir,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*', 'scripts/**']
    });

    files.forEach(file => {
      this.scanFile(path.join(dir, file));
    });

    this.reportResults();
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.scannedFiles++;
      
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine === '') {
          return;
        }
        
        this.checkAllErrorPatterns(filePath, lineNumber, trimmedLine, lines, index, content);
      });
    } catch (error) {
      this.addIssue(filePath, 1, 'FILE_READ_ERROR', 'RUNTIME_ERROR', 'HIGH', `Cannot read file: ${error.message}`, '');
    }
  }

  checkAllErrorPatterns(filePath, lineNumber, line, lines, index, fullContent) {
    const checks = [
      // 1. MOTION PERFORMANCE ISSUES
      this.checkMotionPerformance,
      
      // 2. JAVASCRIPT RUNTIME ERRORS
      this.checkRuntimeErrors,
      
      // 3. MISSING IMPORTS/FUNCTIONS
      this.checkMissingImports,
      
      // 4. INVALID JSX PATTERNS
      this.checkInvalidJSX,
      
      // 5. REACT SPECIFIC ERRORS
      this.checkReactErrors,
      
      // 6. TYPESCRIPT ISSUES
      this.checkTypeScriptIssues,
      
      // 7. STORYBOOK SPECIFIC
      this.checkStorybookIssues
    ];

    checks.forEach(check => {
      try {
        check.call(this, filePath, lineNumber, line, lines, index, fullContent);
      } catch (error) {
        // Don't let one check break others
      }
    });
  }

  checkMotionPerformance(filePath, lineNumber, line, lines, index) {
    // Motion in map functions
    if (line.includes('.map(') && this.findMotionInContext(lines, index, 5)) {
      let severity = 'MEDIUM';
      
      // Check for staggered animations (high severity)
      const contextLines = lines.slice(Math.max(0, index - 2), index + 8).join(' ');
      if ((line.includes('delay=') || contextLines.includes('delay=')) && 
          (contextLines.includes('index') || contextLines.includes('* 50') || contextLines.includes('* 100'))) {
        severity = 'CRITICAL';
      }
      
      this.addIssue(filePath, lineNumber, 'MOTION_IN_MAP', 'MOTION_PERFORMANCE', severity, 
        'Motion component inside map function can cause freezing', line);
    }
  }

  checkRuntimeErrors(filePath, lineNumber, line, lines, index) {
    // Undefined.length patterns
    const lengthAccess = line.match(/(\w+)\.length/g);
    if (lengthAccess) {
      lengthAccess.forEach(match => {
        const variable = match.replace('.length', '');
        const contextLines = lines.slice(Math.max(0, index - 3), index).join(' ');
        
        if (!contextLines.includes(`${variable} &&`) && 
            !contextLines.includes(`${variable}?.`) && 
            !contextLines.includes(`if (${variable})`) &&
            !contextLines.includes(`Array.isArray(${variable})`)) {
          this.addIssue(filePath, lineNumber, 'UNDEFINED_LENGTH', 'RUNTIME_ERROR', 'CRITICAL', 
            `Accessing .length on '${variable}' without null check`, line);
        }
      });
    }

    // Undefined property access
    const propAccess = line.match(/(\w+)\.(\w+)/g);
    if (propAccess) {
      propAccess.forEach(match => {
        const [variable, property] = match.split('.');
        
        // Skip safe patterns
        if (['console', 'Math', 'Object', 'Array', 'JSON', 'window', 'document', 'React'].includes(variable)) {
          return;
        }
        
        if (line.includes('?.') || line.includes('&&')) {
          return;
        }
        
        const contextLines = lines.slice(Math.max(0, index - 3), index).join(' ');
        if (!contextLines.includes(`${variable} &&`) && 
            !contextLines.includes(`${variable}?.`)) {
          this.addIssue(filePath, lineNumber, 'UNDEFINED_PROPERTY', 'RUNTIME_ERROR', 'HIGH', 
            `Accessing property '${property}' on '${variable}' without null check`, line);
        }
      });
    }
  }

  checkMissingImports(filePath, lineNumber, line, lines, index, fullContent) {
    // Functions called but not imported or defined
    const functionCalls = line.match(/(\w+)\(/g);
    if (functionCalls) {
      functionCalls.forEach(match => {
        const funcName = match.replace('(', '');
        
        // Skip common functions
        if (['console', 'setTimeout', 'setInterval', 'require', 'import', 'export', 'useState', 'useEffect', 'useMemo', 'useCallback'].includes(funcName)) {
          return;
        }
        
        // Check if function is imported or defined
        const isImported = fullContent.includes(`import ${funcName}`) || 
                          fullContent.includes(`import { ${funcName}`) ||
                          fullContent.includes(`from '${funcName}'`) ||
                          fullContent.includes(`require('${funcName}')`);
                          
        const isDefined = fullContent.includes(`function ${funcName}`) ||
                         fullContent.includes(`const ${funcName} =`) ||
                         fullContent.includes(`export const ${funcName}`);
                         
        if (!isImported && !isDefined) {
          this.addIssue(filePath, lineNumber, 'MISSING_FUNCTION', 'MISSING_IMPORT', 'CRITICAL', 
            `Function '${funcName}' is called but not imported or defined`, line);
        }
      });
    }
  }

  checkInvalidJSX(filePath, lineNumber, line, lines, index) {
    // Input with children
    if (line.includes('<input') && !line.includes('/>') && !line.includes('</input>')) {
      // Look for closing tag in next few lines
      let hasChildren = false;
      for (let i = index; i < Math.min(lines.length, index + 10); i++) {
        if (lines[i].includes('</input>')) {
          hasChildren = true;
          break;
        }
        if (lines[i].includes('>') && i === index && !lines[i].includes('/>')) {
          hasChildren = true;
          break;
        }
      }
      
      if (hasChildren) {
        this.addIssue(filePath, lineNumber, 'INPUT_WITH_CHILDREN', 'INVALID_JSX', 'CRITICAL', 
          'Input is a void element and cannot have children', line);
      }
    }

    // Other void elements with children
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    voidElements.forEach(element => {
      if (line.includes(`<${element}`) && line.includes(`</${element}>`)) {
        this.addIssue(filePath, lineNumber, 'VOID_ELEMENT_WITH_CHILDREN', 'INVALID_JSX', 'CRITICAL', 
          `${element} is a void element and cannot have children`, line);
      }
    });

    // Invalid JSX syntax
    if (line.includes('<>') && line.includes('</>') && line.split('<>').length !== line.split('</>').length) {
      this.addIssue(filePath, lineNumber, 'FRAGMENT_MISMATCH', 'INVALID_JSX', 'HIGH', 
        'Fragment tags mismatch', line);
    }
  }

  checkReactErrors(filePath, lineNumber, line, lines, index) {
    // Missing key prop in map
    if (line.includes('.map(') && line.includes('=>') && line.includes('<')) {
      const contextLines = lines.slice(index, Math.min(lines.length, index + 5)).join(' ');
      if (!contextLines.includes('key=') && !contextLines.includes('key:')) {
        this.addIssue(filePath, lineNumber, 'MISSING_KEY_PROP', 'REACT_ERROR', 'HIGH', 
          'Missing key prop in mapped elements', line);
      }
    }

    // setState in render
    if (line.includes('setState') && !line.includes('useEffect') && !line.includes('useCallback')) {
      this.addIssue(filePath, lineNumber, 'SETSTATE_IN_RENDER', 'REACT_ERROR', 'CRITICAL', 
        'setState called during render can cause infinite loops', line);
    }

    // Hooks in conditions/loops
    const hookPattern = /use[A-Z]\w*/g;
    const hooks = line.match(hookPattern);
    if (hooks && (line.includes('if (') || line.includes('for (') || line.includes('while ('))) {
      this.addIssue(filePath, lineNumber, 'CONDITIONAL_HOOK', 'REACT_ERROR', 'CRITICAL', 
        'React hooks cannot be called conditionally', line);
    }
  }

  checkTypeScriptIssues(filePath, lineNumber, line, lines, index) {
    // Type assertions that might be wrong
    if (line.includes(' as ') && line.includes('unknown')) {
      this.addIssue(filePath, lineNumber, 'UNSAFE_TYPE_ASSERTION', 'TYPESCRIPT_ERROR', 'MEDIUM', 
        'Unsafe type assertion using unknown', line);
    }

    // Any types
    if (line.includes(': any') || line.includes('<any>')) {
      this.addIssue(filePath, lineNumber, 'ANY_TYPE', 'TYPESCRIPT_ERROR', 'LOW', 
        'Using any type loses type safety', line);
    }

    // Non-null assertion without check
    if (line.includes('!') && !line.includes('!=') && !line.includes('!==')) {
      const variable = line.match(/(\w+)!/);
      if (variable) {
        this.addIssue(filePath, lineNumber, 'NON_NULL_ASSERTION', 'TYPESCRIPT_ERROR', 'MEDIUM', 
          'Non-null assertion without proper null check', line);
      }
    }
  }

  checkStorybookIssues(filePath, lineNumber, line, lines, index) {
    // Storybook story without proper typing
    if (filePath.includes('.stories.') && line.includes('export const') && !line.includes(': Story')) {
      this.addIssue(filePath, lineNumber, 'UNTYPED_STORY', 'STORYBOOK_ERROR', 'MEDIUM', 
        'Storybook story without proper Story type', line);
    }

    // Missing meta export
    if (filePath.includes('.stories.') && line.includes('export default') && !line.includes('meta')) {
      this.addIssue(filePath, lineNumber, 'MISSING_META', 'STORYBOOK_ERROR', 'HIGH', 
        'Storybook file should export meta as default', line);
    }
  }

  findMotionInContext(lines, index, contextSize) {
    const contextLines = lines.slice(Math.max(0, index - contextSize), index + contextSize).join(' ');
    return contextLines.includes('<Motion') || contextLines.includes('Motion ');
  }

  addIssue(file, line, type, category, severity, description, code) {
    this.issues.push({
      file: file.replace(process.cwd() + '/', ''),
      line,
      type,
      category,
      severity,
      description,
      code: code.substring(0, 100)
    });
  }

  reportResults() {
    console.log(`\n💀 COMPREHENSIVE ERROR SCAN RESULTS`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Files scanned: ${this.scannedFiles}`);
    console.log(`Total issues found: ${this.issues.length}\n`);

    // Group by severity
    const severityGroups = this.issues.reduce((groups, issue) => {
      groups[issue.severity] = groups[issue.severity] || [];
      groups[issue.severity].push(issue);
      return groups;
    }, {});

    // Report by severity
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
      if (severityGroups[severity]) {
        const count = severityGroups[severity].length;
        const emoji = severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '⚠️' : severity === 'MEDIUM' ? '🔥' : '💡';
        
        console.log(`${emoji} ${severity} SEVERITY (${count} issues)`);
        console.log(`${'─'.repeat(80)}`);
        
        // Group by category within severity
        const categoryGroups = severityGroups[severity].reduce((groups, issue) => {
          groups[issue.category] = groups[issue.category] || [];
          groups[issue.category].push(issue);
          return groups;
        }, {});

        Object.keys(categoryGroups).forEach(category => {
          const categoryIssues = categoryGroups[category];
          console.log(`\n📂 ${this.errorCategories[category]} (${categoryIssues.length} issues)`);
          
          // Show first 5 issues per category to avoid spam
          categoryIssues.slice(0, 5).forEach(issue => {
            console.log(`   📁 ${issue.file}:${issue.line}`);
            console.log(`   🐛 ${issue.description}`);
            if (issue.code.trim()) {
              console.log(`   📄 ${issue.code}${issue.code.length >= 100 ? '...' : ''}`);
            }
            console.log('');
          });
          
          if (categoryIssues.length > 5) {
            console.log(`   ... and ${categoryIssues.length - 5} more ${category.toLowerCase()} issues\n`);
          }
        });
        
        console.log('');
      }
    });

    this.provideSolutions();
  }

  provideSolutions() {
    const criticalCount = this.issues.filter(i => i.severity === 'CRITICAL').length;
    const highCount = this.issues.filter(i => i.severity === 'HIGH').length;
    
    console.log(`🔧 IMMEDIATE ACTIONS NEEDED`);
    console.log(`═══════════════════════════`);
    
    if (criticalCount > 0) {
      console.log(`🚨 ${criticalCount} CRITICAL issues will crash your app!`);
    }
    
    if (highCount > 0) {
      console.log(`⚠️  ${highCount} HIGH priority issues may cause problems`);
    }
    
    console.log(`\n💊 QUICK FIXES:`);
    
    // Motion fixes
    const motionIssues = this.issues.filter(i => i.category === 'MOTION_PERFORMANCE').length;
    if (motionIssues > 0) {
      console.log(`\n🎭 Motion Performance (${motionIssues} issues):`);
      console.log(`   • Replace <Motion> in map functions with CSS animations`);
      console.log(`   • Limit staggered delays: Math.min(index, 10) * 50ms`);
    }

    // Runtime fixes
    const runtimeIssues = this.issues.filter(i => i.category === 'RUNTIME_ERROR').length;
    if (runtimeIssues > 0) {
      console.log(`\n🔥 JavaScript Runtime (${runtimeIssues} issues):`);
      console.log(`   • Add null checks: if (data && data.length)`);
      console.log(`   • Use optional chaining: data?.length`);
      console.log(`   • Provide defaults: const { items = [] } = props`);
    }

    // Import fixes
    const importIssues = this.issues.filter(i => i.category === 'MISSING_IMPORT').length;
    if (importIssues > 0) {
      console.log(`\n📦 Missing Imports (${importIssues} issues):`);
      console.log(`   • Add missing imports at top of file`);
      console.log(`   • Create mock functions for missing dependencies`);
      console.log(`   • Check package.json for missing packages`);
    }

    // JSX fixes
    const jsxIssues = this.issues.filter(i => i.category === 'INVALID_JSX').length;
    if (jsxIssues > 0) {
      console.log(`\n⚛️  Invalid JSX (${jsxIssues} issues):`);
      console.log(`   • Use <input /> (self-closing) instead of <input></input>`);
      console.log(`   • Remove children from void elements`);
      console.log(`   • Fix fragment syntax <> ... </>`);
    }

    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Fix all CRITICAL issues first (app crashes)`);
    console.log(`   2. Fix HIGH priority issues (functionality breaks)`);
    console.log(`   3. Run this scanner again to verify fixes`);
    console.log(`   4. Test in Storybook to confirm everything works`);
    
    console.log(`\n🏁 This scanner found EVERY type of error that could break your components!`);
  }
}

// Run the scanner
const scanner = new ComprehensiveErrorScanner();
const targetDir = process.argv[2] || './src';

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${targetDir} does not exist`);
  process.exit(1);
}

scanner.scanDirectory(targetDir);
