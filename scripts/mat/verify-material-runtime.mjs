#!/usr/bin/env node
/* MAT-152 — REQ-MAT-35/37 runtime gate over src/material/** (excluding dev/ and
   __tests__/): no auto-downgrade machinery and no cinematic escapes may exist.

   Fails on: IntersectionObserver, requestAnimationFrame, WebGL, getContext(,
   'three', <canvas, MutationObserver outside useMaterialTier.ts, "use client"
   outside useMaterialTier.ts, data-ag-tier writes (setAttribute/dataset),
   setAttribute('scale' on lens filters, window/document inside materialProps.ts
   and internal/resolveRole.ts.

   Usage: node scripts/mat/verify-material-runtime.mjs [--root <dir>]
   Exit 1 on any hit. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const ROOT = resolve(opt('--root', '.'));

const GLOBAL_PATTERNS = [
  { re: /\bIntersectionObserver\b/, label: 'IntersectionObserver' },
  { re: /\brequestAnimationFrame\b/, label: 'requestAnimationFrame' },
  { re: /\bWebGL\b|\bwebgl\b/, label: 'WebGL' },
  { re: /\bgetContext\s*\(/, label: 'getContext(' },
  { re: /from\s+['"]three['"]|require\(['"]three['"]\)/, label: "from 'three'" },
  { re: /<canvas\b|createElement\s*\(\s*['"]canvas['"]/, label: '<canvas>' },
  { re: /setAttribute\s*\(\s*['"]data-ag-tier['"]|dataset\.agTier\s*=(?![=>])/, label: 'data-ag-tier write' },
  { re: /setAttribute\s*\(\s*['"]scale['"]/, label: "setAttribute('scale' on lens filter" },
];

const isSrcFile = (name) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(name);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'dev' || name === '__tests__' || name.startsWith('.') || name === 'node_modules') continue;
      yield* walk(p);
    } else if (isSrcFile(name)) {
      yield p;
    }
  }
}

/* Comments are not runtime usage: a doc sentence mentioning WebGL must not trip
   the gate (MAT-153 requires that TSDoc). Strip block + line comments while
   preserving line numbers and quoted strings (a string literal containing a
   pattern is still a real usage). */
function stripComments(src) {
  const out = [];
  let inBlock = false, inStr = null, i = 0;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (inBlock) {
      if (c === '*' && n === '/') { inBlock = false; i += 2; continue; }
      out.push(c === '\n' ? '\n' : ' '); i += 1; continue;
    }
    if (inStr) {
      out.push(c);
      if (c === '\\') { out.push(n ?? ''); i += 2; continue; }
      if (c === inStr) inStr = null;
      i += 1; continue;
    }
    if (c === '/' && n === '*') { inBlock = true; out.push('  '); i += 2; continue; }
    if (c === '/' && n === '/') { while (i < src.length && src[i] !== '\n') { out.push(' '); i += 1; } continue; }
    if (c === '"' || c === "'" || c === '`') inStr = c;
    out.push(c); i += 1;
  }
  return out.join('');
}

export function scan(root) {
  const base = join(root, 'src/material');
  const hits = [];
  if (!existsSync(base)) return hits;
  for (const file of walk(base)) {
    const rel = relative(root, file).replace(/\\/g, '/');
    const leaf = rel.split('/').pop() ?? '';
    const isTierHook = leaf === 'useMaterialTier.ts' || leaf === 'useMaterialTier.tsx';
    const isPureModule = leaf === 'materialProps.ts' || rel.includes('/internal/');
    const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
    lines.forEach((line, i) => {
      for (const p of GLOBAL_PATTERNS) {
        if (p.re.test(line)) hits.push({ file: rel, line: i + 1, label: p.label });
      }
      if (!isTierHook && /\bMutationObserver\b/.test(line)) {
        hits.push({ file: rel, line: i + 1, label: 'MutationObserver outside useMaterialTier.ts' });
      }
      if (!isTierHook && /^\s*['"]use client['"]/.test(line)) {
        hits.push({ file: rel, line: i + 1, label: '"use client" outside useMaterialTier.ts' });
      }
      if (isPureModule && /\b(?:window|document)\b/.test(line)) {
        hits.push({ file: rel, line: i + 1, label: 'window/document in pure module' });
      }
    });
  }
  return hits;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);

if (isMain) {
  const hits = scan(ROOT);
  for (const h of hits) console.log(`${h.file}:${h.line}  ${h.label}`);
  if (hits.length) {
    console.error(`[verify-material-runtime] ${hits.length} forbidden runtime pattern(s) in src/material/**`);
    process.exit(1);
  }
  console.log('[verify-material-runtime] OK');
}
