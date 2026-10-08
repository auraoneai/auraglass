#!/usr/bin/env node
// MAT-052 gate tier-skip.
// Fails when:
//   - any src file (except src/tokens/generated/) references --_ag-ref-*;
//   - a material.* token aliases anything but sys.*;
//   - a comp.* token aliases anything but sys.*/material.*.
// Prints the alias chain on failure.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, rel, walkFiles } from './_util.mjs';
import { loadTokens } from '../build.mjs';
import { isAlias } from '../validate.mjs';

const REF_RE = /\{([^{}]+)\}/g;
const findings = [];
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const srcDir = arg('--src') ?? join(ROOT, 'src');
const tokensDir = arg('--tokens') ?? join(ROOT, 'tokens');

// 1) src scans: --_ag-ref-* references outside generated dirs
for (const f of walkFiles(srcDir, ['.ts', '.tsx', '.css', '.js', '.jsx'])) {
  const r = rel(f);
  if (r.includes('src/tokens/generated/')) continue;
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/--_ag-ref-[a-zA-Z0-9-]+/g)) {
    const line = text.slice(0, m.index).split('\n').length;
    findings.push(`${r}:${line}: references private ref var ${m[0]}`);
  }
}

// 2) alias tier rules in token sources
const records = loadTokens(tokensDir);
const TIER_RULES = {
  material: new Set(['sys', 'material']),
  comp: new Set(['sys', 'material', 'comp']),
};

const chainOf = (name, target) => `${name} -> ${target}`;

for (const rec of records.values()) {
  const tier = rec.ext?.['ag.tier'];
  if (!TIER_RULES[tier]) continue;
  const scan = (v) => {
    if (typeof v === 'string') {
      for (const m of v.matchAll(REF_RE)) {
        const target = records.get(m[1]);
        const tt = target?.ext?.['ag.tier'];
        if (target && !TIER_RULES[tier].has(tt))
          findings.push(`${rec.name} (${tier}.*): alias {${m[1]}} targets tier '${tt ?? 'none'}' — chain: ${chainOf(rec.name, m[1])}`);
      }
    } else if (v && typeof v === 'object') {
      for (const x of Object.values(v)) scan(x);
    }
  };
  scan(rec.value);
}

if (findings.length) {
  for (const f of findings) console.error(`tier-skip: ${f}`);
  process.exit(1);
}
console.log(`tier-skip: 0 violations`);
