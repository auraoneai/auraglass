/* @jest-environment node */
/* REQ-PLAT-74: every ag / glass class name literal used in a production
   className context resolves to a selector shipped in some emitted css bundle,
   or is registered as an intentional consumer styling hook in
   tests/css/class-hooks.json (component roots / BEM part hooks the library
   ships unstyled by design). A literal covered by neither fails. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import { styleRules } from '../../scripts/build/lib/css.mjs';

const CLASS_CTX = /(?:className\s*=|cn\(|clsx\(|cx\()([^;]{0,400})/g;
const CLASS_TOKEN = /['"`]([a-z-]+-[\w-]+)['"`]/g;

const classLiterals = () => {
  const out = new Map<string, Set<string>>();
  for (const f of walk(join(ROOT, 'src'), (p) => /\.(tsx?|jsx?)$/.test(p) && !/\.(test|stories|spec)\./.test(p) && !p.includes('fixture'))) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(CLASS_CTX))
      for (const q of m[1].matchAll(CLASS_TOKEN)) {
        const token = q[1];
        if (!/^(ag|glass)-[\w-]+$/.test(token)) continue;
        (out.get(token) ?? out.set(token, new Set()).get(token)!).add(f.slice(ROOT.length + 1));
      }
  }
  return out;
};

describe('class coverage (REQ-PLAT-74)', () => {
  it('every src class literal matches a shipped selector or a registered hook', () => {
    ensureBuilt();
    const shipped = new Set<string>();
    for (const f of walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map')))
      for (const r of styleRules(readFileSync(f, 'utf8')))
        for (const sel of r.selector.split(','))
          for (const m of sel.matchAll(/\.([A-Za-z][\w-]*)/g)) shipped.add(m[1]);

    const hooks = JSON.parse(readFileSync(join(ROOT, 'tests/css/class-hooks.json'), 'utf8')).hooks as Record<string, unknown>;
    const missing = new Set<string>();
    for (const token of classLiterals().keys()) if (!shipped.has(token) && !hooks[token]) missing.add(token);
    expect([...missing].sort()).toEqual([]);
  });

  it('registered hooks stay honest — an entry whose class is now styled is stale', () => {
    const shipped = new Set<string>();
    for (const f of walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map')))
      for (const r of styleRules(readFileSync(f, 'utf8')))
        for (const sel of r.selector.split(','))
          for (const m of sel.matchAll(/\.([A-Za-z][\w-]*)/g)) shipped.add(m[1]);
    const hooks = JSON.parse(readFileSync(join(ROOT, 'tests/css/class-hooks.json'), 'utf8')).hooks as Record<string, unknown>;
    const stale = Object.keys(hooks).filter((t) => shipped.has(t));
    expect(stale.sort()).toEqual([]);
  });
});
