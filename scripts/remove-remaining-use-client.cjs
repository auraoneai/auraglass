#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use grep to find all files with 'use client' directive
const grepCommand = "grep -r \"^['\\\"]use client['\\\"]\" src --include=\"*.tsx\" --include=\"*.ts\" -l";
let files = [];

try {
  const output = execSync(grepCommand, { encoding: 'utf8', cwd: path.resolve(__dirname, '..') });
  files = output.trim().split('\n').filter(Boolean).map(f => path.resolve(__dirname, '..', f));
  console.log(`Found ${files.length} files with 'use client' directives`);
} catch (error) {
  if (error.status === 1) {
    console.log("No files found with 'use client' directives");
    process.exit(0);
  }
  throw error;
}

let modifiedCount = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');

    // More comprehensive regex to match various formats of 'use client'
    const useClientRegex = /^["']use client["'][\s;]*\r?\n?/m;

    if (useClientRegex.test(content)) {
      const modifiedContent = content.replace(useClientRegex, '');
      fs.writeFileSync(file, modifiedContent, 'utf8');
      console.log(`✅ Removed 'use client' from ${path.relative(process.cwd(), file)}`);
      modifiedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Removed 'use client' directive from ${modifiedCount} files`);