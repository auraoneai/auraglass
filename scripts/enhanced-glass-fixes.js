#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Enhanced glass fixes for remaining violations
const enhancedFixes = [
  // Add glass-foundation-complete to components missing it
  {
    pattern: /className=\{cn\(([^}]+)\}/g,
    replacement: (match, content) => {
      if (!content.includes('glass-foundation-complete') && 
          !content.includes('backdrop-filter') &&
          (content.includes('bg-white') || content.includes('border') || content.includes('rounded'))) {
        return `className={cn('glass-foundation-complete', ${content})}`;
      }
      return match;
    }
  },
  
  // Fix story files - add glass classes to example components
  {
    pattern: /<div className="([^"]*)"[^>]*>/g,
    replacement: (match, className) => {
      if (className.includes('bg-white') && !className.includes('glass-foundation-complete')) {
        return match.replace(className, `glass-foundation-complete ${className}`);
      }
      return match;
    }
  },
  
  // Add focus-visible to interactive elements
  {
    pattern: /className="([^"]*(?:button|input|select|textarea|clickable|interactive)[^"]*)"/g,
    replacement: (match, className) => {
      if (!className.includes('focus-visible')) {
        return match.replace(className, `${className} focus-visible:ring-2 focus-visible:ring-blue-500/50`);
      }
      return match;
    }
  },
  
  // Fix remaining low opacity values
  { pattern: /bg-white\/1[0-9]/g, replacement: 'bg-white/25' },
  { pattern: /bg-white\/[1-9]/g, replacement: 'bg-white/25' },
  
  // Fix remaining low contrast text
  { pattern: /text-white\/[1-5][0-9]/g, replacement: 'text-white/70' },
  
  // Fix remaining low opacity borders
  { pattern: /border-white\/[1-9]/g, replacement: 'border-white/30' },
  
  // Add glass-foundation-complete to OptimizedGlass components
  {
    pattern: /<OptimizedGlass([^>]*)className=\{cn\(([^}]+)\}/g,
    replacement: (match, props, className) => {
      if (!className.includes('glass-foundation-complete')) {
        return match.replace(className, `'glass-foundation-complete', ${className}`);
      }
      return match;
    }
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply enhanced fixes
    enhancedFixes.forEach(fix => {
      if (typeof fix.replacement === 'function') {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      } else {
        if (fix.pattern.test(content)) {
          content = content.replace(fix.pattern, fix.replacement);
          modified = true;
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Enhanced fix: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting enhanced glass component fixes...\n');
  
  // Get all component and story files
  const filePatterns = [
    'src/components/**/*.tsx',
    'src/primitives/**/*.tsx'
  ];
  
  let totalFiles = 0;
  let fixedFiles = 0;
  
  filePatterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: process.cwd() });
    
    files.forEach(file => {
      totalFiles++;
      if (fixFile(file)) {
        fixedFiles++;
      }
    });
  });
  
  console.log(`\n📊 Enhanced Fix Summary:`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - fixedFiles}`);
  console.log(`\n🎉 Enhanced glass fixes complete!`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, enhancedFixes };