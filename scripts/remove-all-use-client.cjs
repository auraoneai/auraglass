#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Get all TypeScript/TSX/JS/JSX files in src directory
const srcPath = path.join(__dirname, '../src');
const files = getAllFiles(srcPath);

let filesModified = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check for various formats of 'use client'
  const useClientRegex = /^["']use client["']?;?\s*\n*/;

  if (useClientRegex.test(content)) {
    // Remove the 'use client' directive and any following empty lines
    const modifiedContent = content.replace(useClientRegex, '');

    fs.writeFileSync(file, modifiedContent, 'utf8');
    filesModified++;
    console.log(`✓ Removed 'use client' from: ${path.relative(process.cwd(), file)}`);
  }
});

console.log(`\n✅ Removed 'use client' directive from ${filesModified} files`);