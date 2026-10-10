#!/usr/bin/env node
// certification/gates/no-important.mjs — L1 built-in (REQ-QUAL-27): zero `!important` in stories, showcases and the
// Storybook shell. Scans tracked files only, so generated output never masks or causes a finding.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PATHSPECS = ['*.stories.tsx', 'showcase/', '.storybook/'];
const files = execFileSync('git', ['ls-files', '-z', '--', ...PATHSPECS], { encoding: 'utf8' }).split('\0').filter(Boolean);
const hits = [];
for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/!\s*important\b/i.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}
console.log(`no-important: scanned ${files.length} files`);
if (hits.length) {
  console.error(`no-important: ${hits.length} occurrence(s) of !important:\n${hits.join('\n')}`);
  process.exit(1);
}
