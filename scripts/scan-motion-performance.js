#!/usr/bin/env node

/**
 * Motion Performance Scanner
 * 
 * Scans the codebase for potential performance issues with Motion components
 * that could cause freezing like the GlassCalendar issue.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class MotionPerformanceScanner {
  constructor() {
    this.issues = [];
    this.scannedFiles = 0;
  }

  scanDirectory(dir) {
    console.log(`🔍 Scanning ${dir} for Motion performance issues...\n`);
    
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
      let inMapFunction = false;
      let mapStartLine = 0;
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        
        // Check if we're entering a map function
        if (trimmedLine.includes('.map(') || trimmedLine.includes('Array.from(')) {
          inMapFunction = true;
          mapStartLine = lineNumber;
        }
        
        // Check if we're exiting a map function
        if (inMapFunction && (trimmedLine.includes(')}') || trimmedLine.includes('])') || trimmedLine.includes('});'))) {
          inMapFunction = false;
        }
        
        // Look for Motion components
        if (trimmedLine.includes('<Motion')) {
          const issue = {
            file: filePath.replace(process.cwd() + '/', ''),
            line: lineNumber,
            content: trimmedLine,
            severity: this.calculateSeverity(line, inMapFunction, lines, index),
            type: this.getIssueType(line, inMapFunction)
          };
          
          this.issues.push(issue);
        }
      });
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}:`, error.message);
    }
  }

  calculateSeverity(line, inMapFunction, lines, index) {
    let severity = 'LOW';
    
    if (inMapFunction) {
      severity = 'MEDIUM';
      
      // Check for staggered animations
      if (line.includes('delay=') && (line.includes('index') || line.includes('* 50') || line.includes('* 100'))) {
        severity = 'HIGH';
      }
      
      // Check for complex animations in loops
      if (line.includes('preset=') && (line.includes('slideUp') || line.includes('fadeIn') || line.includes('scaleIn'))) {
        severity = 'HIGH';
      }
      
      // Look for large potential datasets
      const contextLines = lines.slice(Math.max(0, index - 5), index + 5).join(' ');
      if (contextLines.includes('pageSize') || contextLines.includes('items.length') || contextLines.includes('data.map')) {
        severity = 'CRITICAL';
      }
    }
    
    return severity;
  }

  getIssueType(line, inMapFunction) {
    if (inMapFunction) {
      if (line.includes('delay=')) {
        return 'Staggered Animation in Loop';
      }
      return 'Motion in Map Function';
    }
    return 'Motion Component';
  }

  reportResults() {
    console.log(`\n📊 Motion Performance Scan Results`);
    console.log(`═══════════════════════════════════`);
    console.log(`Files scanned: ${this.scannedFiles}`);
    console.log(`Issues found: ${this.issues.length}\n`);

    // Group by severity
    const severityGroups = this.issues.reduce((groups, issue) => {
      groups[issue.severity] = groups[issue.severity] || [];
      groups[issue.severity].push(issue);
      return groups;
    }, {});

    // Report critical issues first
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
      if (severityGroups[severity]) {
        console.log(`🚨 ${severity} SEVERITY (${severityGroups[severity].length} issues)`);
        console.log(`${'─'.repeat(50)}`);
        
        severityGroups[severity].forEach(issue => {
          console.log(`📁 ${issue.file}:${issue.line}`);
          console.log(`   Type: ${issue.type}`);
          console.log(`   Code: ${issue.content.substring(0, 80)}${issue.content.length > 80 ? '...' : ''}`);
          console.log('');
        });
        console.log('');
      }
    });

    // Provide recommendations
    this.provideRecommendations();
  }

  provideRecommendations() {
    const criticalCount = this.issues.filter(i => i.severity === 'CRITICAL').length;
    const highCount = this.issues.filter(i => i.severity === 'HIGH').length;
    
    console.log(`💡 Recommendations`);
    console.log(`═════════════════`);
    
    if (criticalCount > 0) {
      console.log(`❌ IMMEDIATE ACTION REQUIRED: ${criticalCount} critical issues found`);
      console.log(`   These components may cause browser freezing with large datasets.`);
    }
    
    if (highCount > 0) {
      console.log(`⚠️  HIGH PRIORITY: ${highCount} high-risk issues found`);
      console.log(`   These may cause performance degradation.`);
    }
    
    console.log(`\n🔧 Common Fixes:`);
    console.log(`   1. Remove Motion from map functions for large lists`);
    console.log(`   2. Use CSS transitions instead of Motion for simple effects`);
    console.log(`   3. Implement virtualization for large datasets`);
    console.log(`   4. Limit staggered animations to first 10-20 items`);
    console.log(`   5. Use useReducedMotion to disable animations when needed`);
    
    console.log(`\n📚 Example Fix:`);
    console.log(`   // ❌ Bad - Motion in map with delay`);
    console.log(`   {items.map((item, index) => (`);
    console.log(`     <Motion key={item.id} preset="fadeIn" delay={index * 50}>`);
    console.log(`       <ItemComponent item={item} />`);
    console.log(`     </Motion>`);
    console.log(`   ))}`);
    console.log('');
    console.log(`   // ✅ Good - Simple div with CSS transitions`);
    console.log(`   {items.map((item, index) => (`);
    console.log(`     <div key={item.id} className="fade-in-item" style={{animationDelay: \`\${Math.min(index, 10) * 50}ms\`}}>`);
    console.log(`       <ItemComponent item={item} />`);
    console.log(`     </div>`);
    console.log(`   ))}`);
  }
}

// Run the scanner
const scanner = new MotionPerformanceScanner();
const targetDir = process.argv[2] || './src';

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${targetDir} does not exist`);
  process.exit(1);
}

scanner.scanDirectory(targetDir);
