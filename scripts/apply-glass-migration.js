#!/usr/bin/env node

/**
 * Glass Utilities Migration Script
 * Systematically replaces direct Tailwind classes with glass utilities across all components
 */

const fs = require('fs');
const path = require('path');

// Define replacement patterns - from Tailwind to Glass utilities
const replacements = [
  // Text colors
  { from: /text-white(?![a-zA-Z-])/g, to: 'glass-text-primary' },
  { from: /text-white\/80/g, to: 'glass-text-secondary' },
  { from: /text-white\/60/g, to: 'glass-text-tertiary' },
  { from: /text-white\/40/g, to: 'glass-text-disabled' },
  { from: /text-gray-(\d+)/g, to: 'glass-text-secondary' },
  { from: /text-muted-foreground/g, to: 'glass-text-secondary' },
  { from: /text-card-foreground/g, to: 'glass-text-primary' },
  
  // Spacing - Padding
  { from: /\bpx-0(?![a-zA-Z-])/g, to: 'glass-px-0' },
  { from: /\bpx-1(?![a-zA-Z-])/g, to: 'glass-px-1' },
  { from: /\bpx-2(?![a-zA-Z-])/g, to: 'glass-px-2' },
  { from: /\bpx-3(?![a-zA-Z-])/g, to: 'glass-px-3' },
  { from: /\bpx-4(?![a-zA-Z-])/g, to: 'glass-px-4' },
  { from: /\bpx-6(?![a-zA-Z-])/g, to: 'glass-px-6' },
  { from: /\bpx-8(?![a-zA-Z-])/g, to: 'glass-px-8' },
  
  { from: /\bpy-0(?![a-zA-Z-])/g, to: 'glass-py-0' },
  { from: /\bpy-1(?![a-zA-Z-])/g, to: 'glass-py-1' },
  { from: /\bpy-2(?![a-zA-Z-])/g, to: 'glass-py-2' },
  { from: /\bpy-3(?![a-zA-Z-])/g, to: 'glass-py-3' },
  { from: /\bpy-4(?![a-zA-Z-])/g, to: 'glass-py-4' },
  { from: /\bpy-6(?![a-zA-Z-])/g, to: 'glass-py-6' },
  
  { from: /\bp-0(?![a-zA-Z-])/g, to: 'glass-p-0' },
  { from: /\bp-1(?![a-zA-Z-])/g, to: 'glass-p-1' },
  { from: /\bp-2(?![a-zA-Z-])/g, to: 'glass-p-2' },
  { from: /\bp-3(?![a-zA-Z-])/g, to: 'glass-p-3' },
  { from: /\bp-4(?![a-zA-Z-])/g, to: 'glass-p-4' },
  { from: /\bp-6(?![a-zA-Z-])/g, to: 'glass-p-6' },
  
  // Spacing - Margins
  { from: /\bmx-0(?![a-zA-Z-])/g, to: 'glass-mx-0' },
  { from: /\bmx-1(?![a-zA-Z-])/g, to: 'glass-mx-1' },
  { from: /\bmx-2(?![a-zA-Z-])/g, to: 'glass-mx-2' },
  { from: /\bmx-4(?![a-zA-Z-])/g, to: 'glass-mx-4' },
  
  { from: /\bmy-0(?![a-zA-Z-])/g, to: 'glass-my-0' },
  { from: /\bmy-1(?![a-zA-Z-])/g, to: 'glass-my-1' },
  { from: /\bmy-2(?![a-zA-Z-])/g, to: 'glass-my-2' },
  { from: /\bmy-4(?![a-zA-Z-])/g, to: 'glass-my-4' },
  
  { from: /\bml-1(?![a-zA-Z-])/g, to: 'glass-ml-1' },
  { from: /\bml-2(?![a-zA-Z-])/g, to: 'glass-ml-2' },
  { from: /\bml-4(?![a-zA-Z-])/g, to: 'glass-ml-4' },
  
  { from: /\bmr-1(?![a-zA-Z-])/g, to: 'glass-mr-1' },
  { from: /\bmr-2(?![a-zA-Z-])/g, to: 'glass-mr-2' },
  { from: /\bmr-4(?![a-zA-Z-])/g, to: 'glass-mr-4' },
  
  { from: /\bmt-1(?![a-zA-Z-])/g, to: 'glass-mt-1' },
  { from: /\bmt-2(?![a-zA-Z-])/g, to: 'glass-mt-2' },
  { from: /\bmt-4(?![a-zA-Z-])/g, to: 'glass-mt-4' },
  
  { from: /\bmb-0(?![a-zA-Z-])/g, to: 'glass-mb-0' },
  { from: /\bmb-1(?![a-zA-Z-])/g, to: 'glass-mb-1' },
  { from: /\bmb-2(?![a-zA-Z-])/g, to: 'glass-mb-2' },
  { from: /\bmb-4(?![a-zA-Z-])/g, to: 'glass-mb-4' },
  
  // Gap utilities
  { from: /\bgap-0(?![a-zA-Z-])/g, to: 'glass-gap-0' },
  { from: /\bgap-1(?![a-zA-Z-])/g, to: 'glass-gap-1' },
  { from: /\bgap-2(?![a-zA-Z-])/g, to: 'glass-gap-2' },
  { from: /\bgap-3(?![a-zA-Z-])/g, to: 'glass-gap-3' },
  { from: /\bgap-4(?![a-zA-Z-])/g, to: 'glass-gap-4' },
  { from: /\bgap-6(?![a-zA-Z-])/g, to: 'glass-gap-6' },
  
  // Space utilities
  { from: /space-y-1(?![a-zA-Z-])/g, to: 'glass-gap-1' },
  { from: /space-y-2(?![a-zA-Z-])/g, to: 'glass-gap-2' },
  { from: /space-y-3(?![a-zA-Z-])/g, to: 'glass-gap-3' },
  { from: /space-y-4(?![a-zA-Z-])/g, to: 'glass-gap-4' },
  { from: /space-x-1(?![a-zA-Z-])/g, to: 'glass-gap-1' },
  { from: /space-x-2(?![a-zA-Z-])/g, to: 'glass-gap-2' },
  { from: /space-x-3(?![a-zA-Z-])/g, to: 'glass-gap-3' },
  { from: /space-x-4(?![a-zA-Z-])/g, to: 'glass-gap-4' },
  
  // Border radius
  { from: /\brounded(?![a-zA-Z-])/g, to: 'glass-radius-md' },
  { from: /rounded-sm(?![a-zA-Z-])/g, to: 'glass-radius-sm' },
  { from: /rounded-md(?![a-zA-Z-])/g, to: 'glass-radius-md' },
  { from: /rounded-lg(?![a-zA-Z-])/g, to: 'glass-radius-lg' },
  { from: /rounded-xl(?![a-zA-Z-])/g, to: 'glass-radius-xl' },
  { from: /rounded-full(?![a-zA-Z-])/g, to: 'glass-radius-full' },
  
  // Typography sizes
  { from: /text-xs(?![a-zA-Z-])/g, to: 'glass-text-xs' },
  { from: /text-sm(?![a-zA-Z-])/g, to: 'glass-text-sm' },
  { from: /text-base(?![a-zA-Z-])/g, to: 'glass-text-base' },
  { from: /text-lg(?![a-zA-Z-])/g, to: 'glass-text-lg' },
  { from: /text-xl(?![a-zA-Z-])/g, to: 'glass-text-xl' },
  { from: /text-2xl(?![a-zA-Z-])/g, to: 'glass-text-2xl' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Apply all replacements
  replacements.forEach(({ from, to }) => {
    if (content.match(from)) {
      content = content.replace(from, to);
      hasChanges = true;
    }
  });
  
  // Only write if there are changes
  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Simple glob implementation for finding tsx files
function findTsxFiles(dir) {
  const results = [];
  
  function walkDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return results;
}

function main() {
  // Find all TypeScript files in components directory
  const componentsDir = '/Users/gurbakshchahal/AuraGlass/src/components';
  const files = findTsxFiles(componentsDir);
  
  console.log(`Processing ${files.length} files...`);
  
  let updatedCount = 0;
  files.forEach(file => {
    try {
      const updated = processFile(file);
      if (updated) {
        updatedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  console.log(`Completed: Updated ${updatedCount}/${files.length} files`);
}

main();
