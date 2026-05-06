#!/usr/bin/env node

/**
 * FINAL ERROR SCAN
 * 
 * Quick scan to verify all critical errors are fixed and provide
 * a final report of remaining issues.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔥 FINAL ERROR VERIFICATION');
console.log('===========================\n');

// Quick scan for the most critical patterns
const patterns = [
  { name: 'undefined.length', pattern: /(\w+)\.length/, severity: 'CRITICAL' },
  { name: 'missing functions', pattern: /(createGalileoPlugin|Chart|animate)\(/, severity: 'CRITICAL' },
  { name: 'input with children', pattern: /<input[^>]*>[^<]+<\/input>/, severity: 'CRITICAL' },
  { name: 'Motion in map', pattern: /<Motion[^>]*delay=.*index/, severity: 'HIGH' },
  { name: 'void elements children', pattern: /<(br|hr|img|area|base)[^>]*>[^<]+<\/\1>/, severity: 'HIGH' }
];

let totalIssues = 0;
let criticalIssues = 0;
let highIssues = 0;

const files = glob.sync('src/**/*.{tsx,ts}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*']
});

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      patterns.forEach(({ name, pattern, severity }) => {
        const matches = line.match(pattern);
        if (matches) {
          // Quick heuristics to avoid false positives
          if (name === 'undefined.length' && (line.includes('?.') || line.includes('&&'))) return;
          if (name === 'missing functions' && line.includes('//')) return;
          
          totalIssues++;
          if (severity === 'CRITICAL') criticalIssues++;
          if (severity === 'HIGH') highIssues++;
          
          console.log(`${severity === 'CRITICAL' ? '🚨' : '⚠️'} ${filePath}:${index + 1}`);
          console.log(`   ${name}: ${line.trim().substring(0, 80)}`);
          console.log('');
        }
      });
    });
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
});

console.log('\n📊 FINAL RESULTS');
console.log('================');
console.log(`Total files scanned: ${files.length}`);
console.log(`Critical errors: ${criticalIssues}`);
console.log(`High priority errors: ${highIssues}`);
console.log(`Total issues: ${totalIssues}\n`);

if (criticalIssues === 0) {
  console.log('🎉 NO CRITICAL ERRORS! Your Storybook should work!');
} else {
  console.log(`❌ ${criticalIssues} critical errors still need fixing`);
}

if (highIssues > 0) {
  console.log(`⚠️  ${highIssues} high priority issues may cause problems`);
}

console.log('\nRun this script periodically to monitor for new errors.');
