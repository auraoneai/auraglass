/* @jest-environment node */
/* PLAT-281: no emitted dist js contains a Tailwind utility class string or a
   tailwind-merge import, and no dist/tokens/tailwind.theme.* ships. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from '../build/helpers';

const TW_RE = /\b(flex|grid|p[xytblr]?-\d+|m[xytblr]?-\d+|text-(xs|sm|base|lg|xl|2xl|3xl)|bg-(red|blue|slate|gray|zinc|neutral|stone)-\d+|rounded-(sm|md|lg|xl|full)|w-\d+|h-\d+|gap-\d+|items-(center|start|end)|justify-(center|between|around)|font-(bold|medium|light))\b/;

describe('no tailwind class strings (PLAT-281)', () => {
  it('emitted js has no tailwind-merge import or utility class string', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const f of walk(DIST, p => p.endsWith('.js'))) {
      const t = readFileSync(f, 'utf8');
      if (/from\s*['"]tailwind-merge['"]/.test(t)) bad.push(`${f}: tailwind-merge import`);
      if (new RegExp(`class(Name)?=\\s*[\`'"][^'\`"]*${TW_RE.source}`).test(t)) bad.push(`${f}: utility class string`);
    }
    expect(bad).toEqual([]);
  });

  it('no tailwind theme artifacts ship under dist/tokens/', () => {
    ensureBuilt();
    expect(walk(join(DIST, 'tokens'), p => /tailwind\.theme\./.test(p))).toEqual([]);
  });
});
