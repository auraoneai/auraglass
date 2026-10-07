// SURF-142 — REQ-SURF-04 peer isolation: importing the data barrel must not
// drag RAC/@internationalized/tanstack into its own evaluation graph beyond
// the allowed lanes, and src/date must not import tanstack.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(e) && !/\.(test|spec|stories|meta|d)\./.test(e)) yield p;
  }
}

describe('peer isolation (SURF-142)', () => {
  it('react-aria-components only in src/date + src/data/tree-view', () => {
    const bad: string[] = [];
    for (const f of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, f).replace(/\\/g, '/');
      const src = readFileSync(f, 'utf8');
      if (/react-aria-components/.test(src) && !(rel.startsWith('src/date/') || rel.startsWith('src/data/tree-view/'))) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });
  it('@tanstack/* only in src/data', () => {
    const bad: string[] = [];
    for (const f of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, f).replace(/\\/g, '/');
      if (/@tanstack\//.test(readFileSync(f, 'utf8')) && !rel.startsWith('src/data/')) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });
  it('@internationalized/date only in src/date', () => {
    const bad: string[] = [];
    for (const f of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, f).replace(/\\/g, '/');
      if (/@internationalized\/date/.test(readFileSync(f, 'utf8')) && !(rel.startsWith('src/date/') || rel.startsWith('src/compat/surf/date/'))) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });
  it('the ./charts source is absent from the 5.0 data/date import graphs', () => {
    const bad: string[] = [];
    for (const dir of ['src/data', 'src/date', 'src/components/timeline']) {
      for (const f of walk(join(ROOT, dir))) {
        const src = readFileSync(f, 'utf8');
        if (/from ['"][^'"]*charts/.test(src)) bad.push(relative(ROOT, f));
      }
    }
    expect(bad).toEqual([]);
  });
});
