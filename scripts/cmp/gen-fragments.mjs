#!/usr/bin/env node
/* REQ-CMP-131: compat adapter manifest generator.
   --report prints JSON: one row per compat export expected in src/compat/cmp —
   union of meta migration rows with compat:true (source 'meta') and adapter
   files already shipped under src/compat/cmp (source 'adapter'). The row count
   MUST equal the number of `export *` lines in src/compat/cmp/index.ts. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const COMPAT = join(ROOT, 'src/compat/cmp');
const COMP_DIR = join(ROOT, 'src/components');

const metaRows = new Map(); // name -> {component, automation}
for (const dir of readdirSync(COMP_DIR)) {
  const d = join(COMP_DIR, dir);
  let files;
  try { files = readdirSync(d).filter((f) => f.endsWith('.meta.ts')); } catch { continue; }
  for (const f of files) {
    const src = readFileSync(join(d, f), 'utf8');
    for (const m of src.matchAll(/from:\s*'([A-Za-z]+)'/g)) {
      const rest = src.slice(m.index, m.index + 500);
      const next = rest.indexOf('from:', 10);
      const seg = next === -1 ? rest : rest.slice(0, next);
      if (/compat:\s*true/.test(seg)) {
        if (!metaRows.has(m[1])) metaRows.set(m[1], { component: dir, file: `${dir}/${f}` });
      }
    }
  }
}

const adapterFiles = new Map(); // name -> file
for (const area of ['core', 'controls', 'overlays']) {
  const d = join(COMPAT, area);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d)) {
    if (!f.endsWith('.tsx') || f.startsWith('_')) continue;
    adapterFiles.set(f.replace(/\.tsx$/, ''));
  }
}

const indexSrc = readFileSync(join(COMPAT, 'index.ts'), 'utf8');
const exportLines = indexSrc.split('\n').filter((l) => /^export \* from '\.\//.test(l.trim()));

const names = new Set([...metaRows.keys(), ...adapterFiles.keys()]);
const rows = [...names].sort().map((name) => ({
  name,
  source: metaRows.has(name) ? 'meta' : 'adapter',
  component: metaRows.get(name)?.component ?? null,
  exported: exportLines.some((l) => l.includes(`/${name}'`)),
}));

const report = { count: rows.length, exports: exportLines.length, rows };
if (process.argv.includes('--report')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`gen-fragments: ${report.count} compat rows, ${report.exports} index exports ${report.count === report.exports ? 'OK' : 'MISMATCH'}`);
  const missing = rows.filter((r) => !r.exported).map((r) => r.name);
  if (missing.length) console.log('missing exports:', missing.join(', '));
  if (report.count !== report.exports) process.exit(1);
}
