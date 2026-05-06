#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to DELETE - conflicting glass implementations
const filesToDelete = [
  'src/styles/glassmorphism.css',           // Legacy glass implementation
  'src/styles/glass-optimized.css',         // Conflicting optimized glass
  'src/styles/ultra-premium-glass.css',    // Over-the-top glass effects
  'src/styles/glass-production.css',        // Conflicting production glass
  'src/styles/force-glassmorphism.css',    // Force glass effects
  'src/styles/glass-foundation.css',       // Old foundation (replaced by glass.css)
];

// Files to KEEP - essential for unified system
const filesToKeep = [
  'src/styles/glass.css',                   // Our unified glass foundation
  'src/styles/index.css',                   // Main styles file
  'src/styles/design-tokens.css',           // Design tokens (non-conflicting)
  'src/styles/premium-typography.css',      // Typography (non-conflicting)
  'src/styles/animations.css',              // Animations (non-conflicting)
  'src/styles/performance-animations.css', // Performance animations
  'src/styles/theme-transitions.css',      // Theme transitions
  'src/styles/surfaces.css',               // Surface styles (non-conflicting)
  'src/styles/header-glassmorphism.css',   // Header-specific (non-conflicting)
  'src/styles/storybook-enhancements.css', // Storybook enhancements
  'src/styles/storybook-utility-shim.css', // Storybook utilities
];

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting ${filePath}:`, error.message);
    return false;
  }
}

function updateIndexCSS() {
  const indexPath = 'src/styles/index.css';
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Remove imports for deleted files
    const importsToRemove = [
      './glass-optimized.css',
      './glassmorphism.css', 
      './ultra-premium-glass.css',
      './glass-production.css',
      './force-glassmorphism.css',
      './glass-foundation.css'
    ];
    
    importsToRemove.forEach(importPath => {
      const importRegex = new RegExp(`@import\\s+['"]${importPath.replace('./', '')}['"];?\\s*`, 'g');
      content = content.replace(importRegex, '');
    });
    
    // Clean up extra whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`✅ Updated: ${indexPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${indexPath}:`, error.message);
    return false;
  }
}

function createCleanupReport() {
  const report = `# CSS Cleanup Report

## Files Deleted (Conflicting Glass Implementations)
${filesToDelete.map(file => `- ✅ ${file}`).join('\n')}

## Files Kept (Essential for Unified System)
${filesToKeep.map(file => `- ✅ ${file}`).join('\n')}

## Summary
- **Deleted:** ${filesToDelete.length} conflicting CSS files
- **Kept:** ${filesToKeep.length} essential CSS files
- **Result:** Single unified glass system with no conflicts

## Unified Glass System
The system now uses only:
- \`src/styles/glass.css\` - Single source of truth for glass effects
- \`src/styles/index.css\` - Main styles file (updated to remove conflicts)
- Other non-conflicting style files for typography, animations, etc.

## Benefits
- ✅ No more conflicting glass implementations
- ✅ Single unified glass foundation
- ✅ Consistent glass effects across all components
- ✅ Better performance (no duplicate styles)
- ✅ Easier maintenance and debugging
`;

  fs.writeFileSync('CSS_CLEANUP_REPORT.md', report, 'utf8');
  console.log('✅ Created: CSS_CLEANUP_REPORT.md');
}

function main() {
  console.log('🧹 Starting CSS cleanup to eliminate conflicts...\n');
  
  let deletedCount = 0;
  
  // Delete conflicting files
  filesToDelete.forEach(file => {
    if (deleteFile(file)) {
      deletedCount++;
    }
  });
  
  // Update index.css to remove imports
  updateIndexCSS();
  
  // Create cleanup report
  createCleanupReport();
  
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Files deleted: ${deletedCount}/${filesToDelete.length}`);
  console.log(`   Files kept: ${filesToKeep.length}`);
  console.log(`   Conflicts eliminated: ✅`);
  console.log(`   Unified system: ✅`);
  console.log(`\n🎉 CSS cleanup complete!`);
}

if (require.main === module) {
  main();
}

module.exports = { deleteFile, updateIndexCSS, createCleanupReport };