#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Violation patterns to detect
const violationPatterns = [
  {
    name: 'Low Opacity Background',
    pattern: /bg-white\/([1-9]|1[0-9])/g,
    severity: 'HIGH',
    description: 'Background opacity below minimum threshold (≥ 0.22)',
    fix: 'Use bg-white/25 or higher'
  },
  {
    name: 'Low Opacity Border',
    pattern: /border-white\/([1-9]|1[0-9])/g,
    severity: 'MEDIUM',
    description: 'Border opacity below minimum threshold (≥ 0.20)',
    fix: 'Use border-white/20 or higher'
  },
  {
    name: 'Low Contrast Text',
    pattern: /text-white\/([1-5][0-9])/g,
    severity: 'HIGH',
    description: 'Text opacity below minimum threshold (≥ 0.70)',
    fix: 'Use text-white/70 or higher'
  },
  {
    name: 'Missing Backdrop Filter',
    pattern: /className.*(?!.*backdrop-filter|.*glass-foundation-complete)/g,
    severity: 'MEDIUM',
    description: 'Component may be missing backdrop-filter',
    fix: 'Add glass-foundation-complete class'
  },
  {
    name: 'Missing Focus Visible',
    pattern: /className.*(?!.*focus-visible)/g,
    severity: 'MEDIUM',
    description: 'Interactive element may be missing focus-visible',
    fix: 'Add focus-visible:ring-2 focus-visible:ring-blue-500/50'
  },
  {
    name: 'Hard-coded Colors',
    pattern: /rgba\(255,\s*255,\s*255,\s*0\.([0-1][0-9])\)/g,
    severity: 'LOW',
    description: 'Hard-coded rgba values instead of tokens',
    fix: 'Use CSS variables or Tailwind classes'
  },
  {
    name: 'Legacy Glass Classes',
    pattern: /glass-base(?!.*glass-foundation-complete)/g,
    severity: 'MEDIUM',
    description: 'Using legacy glass-base instead of glass-foundation-complete',
    fix: 'Replace with glass-foundation-complete'
  },
  {
    name: 'Inconsistent Shadow Classes',
    pattern: /shadow-glass-\d+/g,
    severity: 'LOW',
    description: 'Using legacy shadow-glass classes',
    fix: 'Replace with standard shadow classes'
  }
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    
    violationPatterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            file: filePath,
            pattern: pattern.name,
            severity: pattern.severity,
            description: pattern.description,
            fix: pattern.fix,
            match: match,
            line: getLineNumber(content, match)
          });
        });
      }
    });
    
    return violations;
  } catch (error) {
    console.error(`❌ Error scanning ${filePath}:`, error.message);
    return [];
  }
}

function getLineNumber(content, match) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return 0;
}

function generateCSVReport(violations) {
  const csvHeader = 'File,Pattern,Severity,Description,Fix,Match,Line\n';
  const csvRows = violations.map(v => 
    `"${v.file}","${v.pattern}","${v.severity}","${v.description}","${v.fix}","${v.match}",${v.line}`
  ).join('\n');
  
  return csvHeader + csvRows;
}

function generateHTMLReport(violations) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Glass Violation Scanner Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .violation { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }
        .high { border-left: 4px solid #ef4444; }
        .medium { border-left: 4px solid #f59e0b; }
        .low { border-left: 4px solid #10b981; }
        .file { font-weight: bold; color: #3b82f6; }
        .pattern { font-weight: bold; }
        .severity { padding: 2px 8px; border-radius: 4px; color: white; font-size: 12px; }
        .severity.high { background: #ef4444; }
        .severity.medium { background: #f59e0b; }
        .severity.low { background: #10b981; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Glass Violation Scanner Report</h1>
        <p>Automated detection of glass design system violations</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Total Violations:</strong> ${violations.length}</p>
        <p><strong>High Severity:</strong> ${violations.filter(v => v.severity === 'HIGH').length}</p>
        <p><strong>Medium Severity:</strong> ${violations.filter(v => v.severity === 'MEDIUM').length}</p>
        <p><strong>Low Severity:</strong> ${violations.filter(v => v.severity === 'LOW').length}</p>
    </div>
    
    <h2>🚨 Violations Found</h2>
    ${violations.map(v => `
        <div class="violation ${v.severity.toLowerCase()}">
            <div class="file">${v.file}</div>
            <div class="pattern">${v.pattern}</div>
            <span class="severity ${v.severity.toLowerCase()}">${v.severity}</span>
            <p><strong>Description:</strong> ${v.description}</p>
            <p><strong>Fix:</strong> ${v.fix}</p>
            <p><strong>Match:</strong> <code>${v.match}</code> (Line ${v.line})</p>
        </div>
    `).join('')}
</body>
</html>`;
  
  return html;
}

function main() {
  console.log('🔍 Starting glass violation scanner...\n');
  
  // Get all component files
  const componentPatterns = [
    'src/components/**/*.tsx',
    'src/primitives/**/*.tsx'
  ];
  
  let allViolations = [];
  let totalFiles = 0;
  
  componentPatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    
    files.forEach(file => {
      totalFiles++;
      const violations = scanFile(file);
      allViolations = allViolations.concat(violations);
    });
  });
  
  // Generate reports
  const csvReport = generateCSVReport(allViolations);
  const htmlReport = generateHTMLReport(allViolations);
  
  // Write reports
  fs.writeFileSync('reports/glass/_auto-findings.csv', csvReport);
  fs.writeFileSync('reports/glass/_auto-findings.html', htmlReport);
  
  // Console output
  console.log(`📊 Scan Results:`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Total violations: ${allViolations.length}`);
  console.log(`   High severity: ${allViolations.filter(v => v.severity === 'HIGH').length}`);
  console.log(`   Medium severity: ${allViolations.filter(v => v.severity === 'MEDIUM').length}`);
  console.log(`   Low severity: ${allViolations.filter(v => v.severity === 'LOW').length}`);
  
  if (allViolations.length > 0) {
    console.log(`\n🚨 Violations found:`);
    allViolations.forEach(v => {
      console.log(`   ${v.severity}: ${v.file}:${v.line} - ${v.pattern}`);
    });
  } else {
    console.log(`\n✅ No violations found! All components comply with glass standards.`);
  }
  
  console.log(`\n📄 Reports generated:`);
  console.log(`   CSV: reports/glass/_auto-findings.csv`);
  console.log(`   HTML: reports/glass/_auto-findings.html`);
}

if (require.main === module) {
  main();
}

module.exports = { scanFile, violationPatterns, generateCSVReport, generateHTMLReport };