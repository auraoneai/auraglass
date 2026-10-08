#!/usr/bin/env node
/* PRD-02 side-effect gate (CMP-244 adds the overlay flagship entries).
   package.json marks only "*.css" as sideEffects — every JS module in a
   flagged entry must be import-safe: no top-level access to DOM globals,
   timers, observers, or storage outside function/class bodies.

   Static check: strips comments/strings/types heuristically, tracks brace
   depth, and flags banned identifiers appearing at depth 0 (module top level)
   or inside a module-level `const x = …` initializer that calls them eagerly.
   Run: node scripts/cmp/verify-side-effects.mjs (exit 1 on violations). */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/** Entries whose transitive sources must be import-safe. */
const ENTRIES = [
  // CMP-244 overlay flagship rows
  'src/components/dialog/index.ts',
  'src/components/alert-dialog/index.ts',
  'src/components/sheet/index.ts',
  'src/components/popover/index.ts',
  'src/components/tooltip/index.ts',
  'src/components/menu/index.ts',
  'src/components/toast/index.ts',
  // earlier-lane rows stay gated here too
  'src/components/button/index.ts',
  'src/components/text-field/index.ts',
  'src/components/select/index.ts',
  'src/components/combobox/index.ts',
  'src/components/icon/index.ts',
];

const BANNED = /\b(window|document|localStorage|sessionStorage|navigator|setTimeout|setInterval|requestAnimationFrame|MutationObserver|ResizeObserver|IntersectionObserver)\b/;

const strip = (src) => {
  // remove line comments, block comments, template/quoted strings (keeps length≈)
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
    .replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length))
    .replace(/`(?:[^`\\]|\\.)*`/g, (m) => ' '.repeat(m.length))
    .replace(/'(?:[^'\\\n]|\\.)*'/g, (m) => ' '.repeat(m.length))
    .replace(/"(?:[^"\\\n]|\\.)*"/g, (m) => ' '.repeat(m.length));
};

const scan = (file, seen = new Set()) => {
  if (seen.has(file) || !existsSync(file)) return [];
  seen.add(file);
  const src = readFileSync(file, 'utf8');
  const clean = strip(src);
  const violations = [];
  // statement-level scan: accumulate chars while depth===0; a statement ends
  // at ';', '{' or '}'. Non-braced arrow bodies (`=> expr;`) stay depth-0 in
  // text, so a statement containing '=>' is treated as lazy and skipped.
  let depth = 0;
  let stmt = '';
  let stmtLine = 0;
  const lineAt = (i) => clean.slice(0, i).split('\n').length;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (depth === 0) {
      if (!stmt.trim()) stmtLine = lineAt(i);
      stmt += ch;
      if (ch === '{' || ch === '(' || ch === '[') { depth += 1; continue; }
      if (ch === ';' || ch === '}') {
        const text = stmt;
        if (!/^\s*(import\s|export\s+type\s|import\s+type\s)/.test(text) && !text.includes('=>')) {
          for (const m of text.matchAll(new RegExp(BANNED.source, 'g'))) {
            const ident = m[1];
            const residual = text.replace(new RegExp(`typeof\\s+${ident}`, 'g'), ' '.repeat(10));
            if (new RegExp(`\\b${ident}\\b`).test(residual)
                && !new RegExp(`typeof\\s+${ident}`).test(text)) {
              violations.push(`${file.replace(ROOT + '/', '')}:${stmtLine} top-level '${ident}' — ${text.trim().slice(0, 90)}`);
            }
          }
        }
        stmt = '';
        if (ch === ';') continue;
        else { stmt = ''; continue; }
      }
      continue;
    }
    if (ch === '{' || ch === '(' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ')' || ch === ']') depth -= 1;
  }
  // follow relative imports (barrel files re-export other modules)
  for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
    const base = join(dirname(file), m[1]);
    for (const cand of [base + '.ts', base + '.tsx', base + '.css', join(base, 'index.ts'), join(base, 'index.tsx')]) {
      if (cand.endsWith('.css')) continue;
      if (existsSync(cand)) { violations.push(...scan(cand, seen)); break; }
    }
  }
  return violations;
};

const violations = [];
const missing = [];
for (const entry of ENTRIES) {
  if (!existsSync(join(ROOT, entry))) { missing.push(entry); continue; }
  violations.push(...scan(join(ROOT, entry)));
}
if (missing.length) {
  console.log('verify-side-effects: entries pending other lanes (skipped):');
  for (const m of missing) console.log(`  - ${m}`);
}
if (violations.length) {
  console.error('verify-side-effects: side effects at import time:');
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log(`verify-side-effects: ${ENTRIES.length - missing.length} entries clean (${missing.length} pending)`);
