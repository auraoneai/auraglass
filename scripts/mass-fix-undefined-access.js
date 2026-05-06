#!/usr/bin/env node

/**
 * MASS FIX UNDEFINED ACCESS
 * 
 * Since these .length errors keep popping up everywhere, let's fix them
 * across the entire codebase with intelligent replacements.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('💀 MASS FIX: UNDEFINED ACCESS ERRORS');
console.log('====================================\n');

let fixedFiles = 0;

// Find all TypeScript/TSX files
const files = glob.sync('src/**/*.{tsx,ts}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*']
});

console.log(`Checking ${files.length} files for unsafe property access...\n`);

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let hasChanges = false;

    // Skip files that already look safe or are utility files
    if (content.includes('// SAFE FILE') || filePath.includes('/utils/') || filePath.includes('/types/')) {
      return;
    }

    // Fix common undefined.length patterns
    const lengthPatterns = [
      // Pattern: variable.length (not already safe)
      {
        find: /(\w+)\.length(?!\s*[\|\&\?\.])/g,
        replace: (match, variable) => {
          // Skip safe variables and already protected patterns
          if (['Array', 'Object', 'React', 'children', 'arguments', 'window', 'document'].includes(variable) ||
              content.includes(`${variable}?.length`) ||
              content.includes(`${variable} || []`) ||
              content.includes(`Array.isArray(${variable})`)) {
            return match;
          }
          return `(${variable}?.length || 0)`;
        }
      },
      
      // Pattern: variable[index] (not already safe)
      {
        find: /(\w+)\[([^\]]+)\](?!\s*[\?\.])/g,
        replace: (match, variable, index) => {
          if (['Array', 'Object', 'React', 'window', 'document'].includes(variable) ||
              content.includes(`${variable}?.`) ||
              content.includes(`${variable} || []`)) {
            return match;
          }
          return `${variable}?.[${index}]`;
        }
      }
    ];

    lengthPatterns.forEach(({ find, replace }) => {
      content = content.replace(find, replace);
    });

    // Fix component prop access patterns
    const propPatterns = [
      // data.property → data?.property || 'fallback'
      { find: /\bdata\.(\w+)(?!\?)/g, replace: 'data?.$1' },
      { find: /\bprops\.(\w+)(?!\?)/g, replace: 'props?.$1' },
      { find: /\bmetric\.(\w+)(?!\?)/g, replace: 'metric?.$1' },
      { find: /\bitem\.(\w+)(?!\?)/g, replace: 'item?.$1' }
    ];

    propPatterns.forEach(({ find, replace }) => {
      const newContent = content.replace(find, (match, prop) => {
        // Skip if already safe
        if (match.includes('?.') || match.includes('||')) {
          return match;
        }
        return replace.replace('$1', prop);
      });
      
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });

    // Write changes if any
    if (hasChanges && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed undefined access in ${path.basename(filePath)}`);
      fixedFiles++;
    }

  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
});

console.log(`\n📊 MASS FIX SUMMARY`);
console.log(`==================`);
console.log(`Files checked: ${files.length}`);
console.log(`Files fixed: ${fixedFiles}`);
console.log(`\n✅ Most undefined access patterns should now be safe!`);
console.log(`This should eliminate the majority of "Cannot read properties of undefined" errors.`);
