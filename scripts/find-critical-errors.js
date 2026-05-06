#!/usr/bin/env node

/**
 * CRITICAL ERROR FINDER
 * 
 * Focuses on finding ONLY the errors that are actually crashing Storybook:
 * 1. Void elements with children (input, br, img, etc.)
 * 2. Missing function imports causing "X is not a function"
 * 3. Real undefined.length errors in useMemo/useEffect
 * 4. Motion performance issues in loops
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class CriticalErrorFinder {
  constructor() {
    this.criticalIssues = [];
    this.scannedFiles = 0;
  }

  scanDirectory(dir) {
    console.log(`🎯 FINDING CRITICAL ERRORS ONLY`);
    console.log(`Looking for errors that actually crash components...\n`);
    
    const files = glob.sync('**/*.{tsx,ts}', {
      cwd: dir,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*']
    });

    files.forEach(file => {
      this.scanFile(path.join(dir, file));
    });

    this.reportCriticalIssues();
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.scannedFiles++;
      
      // Check for critical patterns that cause crashes
      this.findVoidElementsWithChildren(filePath, content);
      this.findMissingFunctionCalls(filePath, content);
      this.findUnsafeDataAccess(filePath, content);
      this.findMotionInLoops(filePath, content);
      
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}:`, error.message);
    }
  }

  findVoidElementsWithChildren(filePath, content) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Look for input with children pattern
      if (line.includes('<input') && !line.includes('/>') && !line.includes('type=')) {
        // Check if there's a closing input tag
        const nextLines = lines.slice(index, Math.min(lines.length, index + 5)).join('');
        if (nextLines.includes('</input>')) {
          this.addCriticalIssue(filePath, index + 1, 'VOID_ELEMENT_CHILDREN', 
            'input element has children (void elements cannot have children)', line);
        }
      }
      
      // Other void elements
      const voidElements = ['br', 'hr', 'img', 'area', 'base', 'col', 'embed', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
      voidElements.forEach(element => {
        if (line.includes(`<${element}`) && line.includes(`</${element}>`)) {
          this.addCriticalIssue(filePath, index + 1, 'VOID_ELEMENT_CHILDREN', 
            `${element} is void element with children`, line);
        }
      });
    });
  }

  findMissingFunctionCalls(filePath, content) {
    const lines = content.split('\n');
    
    // Find functions that are called but likely not properly imported
    const suspiciousFunctions = [
      'createGalileoPlugin', 'createPlugin', 'useGalileo', 'galileoInit',
      'chart', 'Chart', 'createChart', 'initChart',
      'motion', 'animate', 'spring', 'physics'
    ];
    
    lines.forEach((line, index) => {
      suspiciousFunctions.forEach(func => {
        if (line.includes(`${func}(`) && !content.includes(`import ${func}`) && 
            !content.includes(`import { ${func}`) && !content.includes(`function ${func}`) &&
            !content.includes(`const ${func} =`)) {
          this.addCriticalIssue(filePath, index + 1, 'MISSING_FUNCTION', 
            `${func} is called but not imported or defined`, line);
        }
      });
    });
  }

  findUnsafeDataAccess(filePath, content) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Look for .length access in useMemo/useEffect without checks
      if ((line.includes('useMemo') || line.includes('useEffect')) && 
          lines.slice(index, index + 10).some(l => l.includes('.length') && !l.includes('&&') && !l.includes('?.'))) {
        const problematicLine = lines.slice(index, index + 10).find(l => l.includes('.length'));
        if (problematicLine) {
          this.addCriticalIssue(filePath, index + 1, 'UNSAFE_LENGTH_ACCESS', 
            'Accessing .length in useMemo/useEffect without null check', problematicLine);
        }
      }
    });
  }

  findMotionInLoops(filePath, content) {
    const lines = content.split('\n');
    let inMapFunction = false;
    
    lines.forEach((line, index) => {
      if (line.includes('.map(')) {
        inMapFunction = true;
      }
      
      if (inMapFunction && line.includes('<Motion') && line.includes('delay=')) {
        this.addCriticalIssue(filePath, index + 1, 'MOTION_PERFORMANCE', 
          'Motion with delay in map function causes freezing', line);
      }
      
      if (line.includes('})') || line.includes('];')) {
        inMapFunction = false;
      }
    });
  }

  addCriticalIssue(file, line, type, description, code) {
    this.criticalIssues.push({
      file: file.replace(process.cwd() + '/', ''),
      line,
      type,
      description,
      code: code.trim().substring(0, 100)
    });
  }

  reportCriticalIssues() {
    console.log(`\n🚨 CRITICAL ERRORS THAT CRASH STORYBOOK`);
    console.log(`══════════════════════════════════════════`);
    console.log(`Files scanned: ${this.scannedFiles}`);
    console.log(`Critical issues: ${this.criticalIssues.length}\n`);

    if (this.criticalIssues.length === 0) {
      console.log(`🎉 NO CRITICAL ERRORS FOUND!`);
      console.log(`Your components should render without crashing.\n`);
      return;
    }

    // Group by type
    const typeGroups = this.criticalIssues.reduce((groups, issue) => {
      groups[issue.type] = groups[issue.type] || [];
      groups[issue.type].push(issue);
      return groups;
    }, {});

    Object.keys(typeGroups).forEach(type => {
      const issues = typeGroups[type];
      console.log(`💀 ${type} (${issues.length} issues)`);
      console.log(`${'─'.repeat(60)}`);
      
      issues.forEach(issue => {
        console.log(`📁 ${issue.file}:${issue.line}`);
        console.log(`   🐛 ${issue.description}`);
        console.log(`   📄 ${issue.code}${issue.code.length >= 100 ? '...' : ''}`);
        console.log('');
      });
      console.log('');
    });

    console.log(`🔧 IMMEDIATE FIXES NEEDED:`);
    console.log(`   1. Fix void element children (use <input /> not <input></input>)`);
    console.log(`   2. Add missing imports for functions`);
    console.log(`   3. Add null checks in useMemo/useEffect`);
    console.log(`   4. Replace Motion in loops with CSS animations`);
  }
}

// Run the scanner
const scanner = new CriticalErrorFinder();
const targetDir = process.argv[2] || './src';

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory ${targetDir} does not exist`);
  process.exit(1);
}

scanner.scanDirectory(targetDir);
