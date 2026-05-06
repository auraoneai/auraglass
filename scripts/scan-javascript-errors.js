#!/usr/bin/env node

/**
 * JavaScript Error Scanner
 * 
 * Scans the codebase for common JavaScript runtime error patterns
 * like undefined.length, null access, missing prop validation, etc.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class JavaScriptErrorScanner {
  constructor() {
    this.issues = [];
    this.scannedFiles = 0;
  }

  scanDirectory(dir) {
    console.log(`🔍 Scanning ${dir} for JavaScript runtime error patterns...\n`);
    
    const files = glob.sync('**/*.{tsx,ts}', {
      cwd: dir,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*']
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
        
        // Skip comments and imports
        if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('import')) {
          return;
        }
        
        this.checkForErrorPatterns(filePath, lineNumber, trimmedLine, lines, index);
      });
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}:`, error.message);
    }
  }

  checkForErrorPatterns(filePath, lineNumber, line, lines, index) {
    const patterns = [
      // Undefined/null access patterns
      {
        pattern: /(\w+)\.length/g,
        check: (match, line, context) => {
          const variable = match[1];
          // Check if there's no null check before this line
          const contextLines = lines.slice(Math.max(0, index - 3), index).join(' ');
          if (!contextLines.includes(`${variable} &&`) && 
              !contextLines.includes(`${variable}?.`) && 
              !contextLines.includes(`if (${variable})`)) {
            return {
              severity: 'HIGH',
              type: 'Potential undefined.length',
              description: `Accessing .length on '${variable}' without null check`
            };
          }
          return null;
        }
      },
      
      // Array/object access without checks
      {
        pattern: /(\w+)\[(\w+|\d+)\]/g,
        check: (match, line, context) => {
          const variable = match[1];
          const contextLines = lines.slice(Math.max(0, index - 3), index).join(' ');
          if (!contextLines.includes(`${variable} &&`) && 
              !contextLines.includes(`${variable}?.`) && 
              !line.includes('?.[')) {
            return {
              severity: 'MEDIUM',
              type: 'Potential undefined array access',
              description: `Accessing array index on '${variable}' without null check`
            };
          }
          return null;
        }
      },

      // Object property access without checks
      {
        pattern: /(\w+)\.(\w+)/g,
        check: (match, line, context) => {
          const variable = match[1];
          const property = match[2];
          
          // Skip common safe patterns
          if (['console', 'Math', 'Object', 'Array', 'JSON', 'window', 'document'].includes(variable)) {
            return null;
          }
          
          // Skip method calls and common patterns
          if (property === 'map' || property === 'filter' || property === 'length' || 
              line.includes('?.') || line.includes('&&')) {
            return null;
          }
          
          const contextLines = lines.slice(Math.max(0, index - 3), index).join(' ');
          if (!contextLines.includes(`${variable} &&`) && 
              !contextLines.includes(`${variable}?.`) && 
              !contextLines.includes(`if (${variable})`)) {
            return {
              severity: 'LOW',
              type: 'Potential undefined property access',
              description: `Accessing property '${property}' on '${variable}' without null check`
            };
          }
          return null;
        }
      },

      // useMemo/useEffect without dependency checks
      {
        pattern: /useMemo\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?\},\s*\[(.*?)\]/g,
        check: (match, line, context) => {
          const deps = match[1];
          if (deps && deps.includes(',')) {
            return {
              severity: 'LOW',
              type: 'useMemo dependency check needed',
              description: 'useMemo with multiple dependencies should check for undefined values'
            };
          }
          return null;
        }
      },

      // Props destructuring without defaults
      {
        pattern: /\{\s*([^}]+)\s*\}\s*=\s*props/g,
        check: (match, line, context) => {
          const propsText = match[1];
          if (propsText.includes(',') && !propsText.includes('=')) {
            return {
              severity: 'MEDIUM',
              type: 'Props destructuring without defaults',
              description: 'Destructuring props without default values can cause undefined access'
            };
          }
          return null;
        }
      }
    ];

    patterns.forEach(({ pattern, check }) => {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const result = check(match, line, { lines, index });
        if (result) {
          this.issues.push({
            file: filePath.replace(process.cwd() + '/', ''),
            line: lineNumber,
            content: line.trim(),
            ...result
          });
        }
        // Reset regex lastIndex to avoid infinite loops
        if (!pattern.global) break;
      }
    });
  }

  reportResults() {
    console.log(`\n📊 JavaScript Error Scan Results`);
    console.log(`═══════════════════════════════════`);
    console.log(`Files scanned: ${this.scannedFiles}`);
    console.log(`Potential issues found: ${this.issues.length}\n`);

    // Group by severity
    const severityGroups = this.issues.reduce((groups, issue) => {
      groups[issue.severity] = groups[issue.severity] || [];
      groups[issue.severity].push(issue);
      return groups;
    }, {});

    // Report high severity issues first
    ['HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
      if (severityGroups[severity]) {
        console.log(`🚨 ${severity} SEVERITY (${severityGroups[severity].length} issues)`);
        console.log(`${'─'.repeat(60)}`);
        
        // Show first 10 issues per severity to avoid spam
        severityGroups[severity].slice(0, 10).forEach(issue => {
          console.log(`📁 ${issue.file}:${issue.line}`);
          console.log(`   Type: ${issue.type}`);
          console.log(`   Issue: ${issue.description}`);
          console.log(`   Code: ${issue.content.substring(0, 80)}${issue.content.length > 80 ? '...' : ''}`);
          console.log('');
        });
        
        if (severityGroups[severity].length > 10) {
          console.log(`   ... and ${severityGroups[severity].length - 10} more issues\n`);
        }
        console.log('');
      }
    });

    this.provideRecommendations();
  }

  provideRecommendations() {
    const highCount = this.issues.filter(i => i.severity === 'HIGH').length;
    const mediumCount = this.issues.filter(i => i.severity === 'MEDIUM').length;
    
    console.log(`💡 Recommendations`);
    console.log(`═════════════════`);
    
    if (highCount > 0) {
      console.log(`❌ IMMEDIATE ACTION REQUIRED: ${highCount} high-risk issues found`);
      console.log(`   These may cause "Cannot read properties of undefined" errors.`);
    }
    
    if (mediumCount > 0) {
      console.log(`⚠️  MEDIUM PRIORITY: ${mediumCount} medium-risk issues found`);
      console.log(`   These may cause runtime errors under certain conditions.`);
    }
    
    console.log(`\n🔧 Common Fixes:`);
    console.log(`   1. Add null checks: if (data && data.length > 0)`);
    console.log(`   2. Use optional chaining: data?.length`);
    console.log(`   3. Provide default values: const { items = [] } = props`);
    console.log(`   4. Add prop validation or TypeScript checks`);
    console.log(`   5. Use fallbacks: const length = data?.length || 0`);
    
    console.log(`\n📚 Example Fixes:`);
    console.log(`   // ❌ Bad - Can cause undefined.length error`);
    console.log(`   const processedData = useMemo(() => {`);
    console.log(`     return data.map(item => ({ ...item, processed: true }));`);
    console.log(`   }, [data]);`);
    console.log('');
    console.log(`   // ✅ Good - Safe with null checks`);
    console.log(`   const processedData = useMemo(() => {`);
    console.log(`     if (!data || !Array.isArray(data)) return [];`);
    console.log(`     return data.map(item => ({ ...item, processed: true }));`);
    console.log(`   }, [data]);`);
  }
}

// Run the scanner
const scanner = new JavaScriptErrorScanner();
const targetDir = process.argv[2] || './src';

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${targetDir} does not exist`);
  process.exit(1);
}

scanner.scanDirectory(targetDir);
