#!/usr/bin/env node
// certification/gates/no-important.mjs — L1 built-in (REQ-QUAL-27): zero `!important` in stories, showcases and the
// Storybook shell. Scans tracked files only, so generated output never masks or causes a finding.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Every story root loaded by .storybook/main.ts (legacy/ is not a story root), plus showcases and the Storybook shell.
const PATHSPECS = ['src/**/*.stories.tsx', 'stories/**/*.stories.tsx', 'registry/**/*.stories.tsx', 'certification/**/*.stories.tsx',
  'showcase/', '.storybook/'].map((p) => `:(glob)${p.endsWith('/') ? `${p}**` : p}`);
// A CSS declaration priority: `!important` ending a value (`;`, `}`, quote/template end, `,` in a JS style object, or EOL).
const DECL = /!\s*important\s*(?:;|}|['"`]|$)/i;
const files = execFileSync('git', ['ls-files', '-z', '--', ...PATHSPECS], { encoding: 'utf8' }).split('\0').filter(Boolean);
const hits = [];
for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (DECL.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}
console.log(`no-important: scanned ${files.length} files`);
if (hits.length) {
  console.error(`no-important: ${hits.length} occurrence(s) of !important:\n${hits.join('\n')}`);
  process.exit(1);
}
