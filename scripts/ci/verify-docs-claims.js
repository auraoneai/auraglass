#!/usr/bin/env node
/* PLAT-119/120 — scans docs for retracted claims. Exit 1 on any hit
   outside docs/auraglass-5/** and '> **Retraction' blocks. */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.env.AURAGLASS_REPO_ROOT
  ? path.resolve(process.env.AURAGLASS_REPO_ROOT)
  : path.resolve(__dirname, '..', '..');

const PATTERNS = [
  /498 (visual )?(targets|passed|certified)/i,
  /100\s?%\s*(reduced[- ]motion|coverage)/i,
  /SSR-safe(?! portal)/i,
  /optional backend/i,
  /licensed Aeonik/i,
  /certified component/i,
];
const SCAN = ['README.md', 'llms.txt', 'RELEASE_NOTES_4.1.1.md', 'SECURITY.md'];

function filesToScan() {
  const out = [...SCAN.filter((f) => fs.existsSync(path.join(ROOT, f)))];
  try {
    const docs = execFileSync(
      'git', ['ls-files', 'docs/**/*.md', 'docs/*.md'],
      { cwd: ROOT, encoding: 'utf8' },
    ).split('\n').filter(Boolean);
    out.push(...docs.filter((f) => !f.startsWith('docs/auraglass-5/')));
  } catch {
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.md')) {
          const rel = path.relative(ROOT, p);
          if (!rel.startsWith('docs/auraglass-5/')) out.push(rel);
        }
      }
    };
    walk(path.join(ROOT, 'docs'));
  }
  return [...new Set(out)];
}

const failures = [];
for (const rel of filesToScan()) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8');
  // strip retraction blocks and lines mentioning the corrections ledger
  const clean = text
    .split('\n')
    .filter((l) => !l.startsWith('> **Retraction') && !l.includes('ledger-corrections'))
    .join('\n');
  for (const re of PATTERNS) {
    const m = clean.match(re);
    if (m) failures.push(`${rel}: ${m[0]}`);
  }
}
if (failures.length) {
  console.error('verify-docs-claims: retracted claims found:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log(`verify-docs-claims: clean (${filesToScan().length} files)`);
