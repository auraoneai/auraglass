// SURF-149/253 — REQ-SURF-03: every W2 css file is declared in
// fragments/css/surf.ts, starts with LAYER_ORDER_STATEMENT, uses one
// @layer ag.components block, has no !important / hex / physical
// properties (logical-properties rule).
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const LAYER_ORDER = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';
const PHYSICAL = /(?<![a-z-])(?:left|right|top|bottom|margin-left|margin-right|margin-top|margin-bottom|padding-left|padding-right|padding-top|padding-bottom|border-left|border-right|border-top|border-bottom|inset-left|inset-right)\s*:/;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}

const W2_DIRS = ['src/data', 'src/date', 'src/charts', 'src/components/timeline'];
const fragSrc = readFileSync(join(ROOT, 'fragments/css/surf.ts'), 'utf8');

describe('SURF W2 css discipline (SURF-149, REQ-SURF-03)', () => {
  const files: string[] = [];
  for (const d of W2_DIRS) for (const f of walk(join(ROOT, d))) files.push(relative(ROOT, f).replace(/\\/g, '/'));

  it('every W2 css file is declared in the fragment', () => {
    const orphans = files.filter((f) => !fragSrc.includes(`'${f}'`));
    expect(orphans).toEqual([]);
  });
  it('every file starts with LAYER_ORDER_STATEMENT and one components layer', () => {
    const bad = files.filter((f) => {
      const src = readFileSync(join(ROOT, f), 'utf8');
      return !src.startsWith(LAYER_ORDER) || !/@layer ag\.components \{/.test(src);
    });
    expect(bad).toEqual([]);
  });
  it('no !important, no hex literals, no physical properties', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = readFileSync(join(ROOT, f), 'utf8');
      if (/!important/.test(src)) bad.push(`${f}: !important`);
      if (/#[0-9a-fA-F]{3,8}\b/.test(src)) bad.push(`${f}: hex literal`);
      if (PHYSICAL.test(src)) bad.push(`${f}: physical property`);
    }
    expect(bad).toEqual([]);
  });
});
