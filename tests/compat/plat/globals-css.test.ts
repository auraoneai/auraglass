/* @jest-environment node */
// REQ-PLAT-30 / AC-FIN-33: src/compat/css/globals.css is the ag.compat layer
// with the 4.x primitives (h1–h6, .flex, .grid), <= 1 KB gzip, no !important,
// and nothing outside `@layer ag.compat`.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from '@jest/globals';
import postcss from 'postcss';

const FILE = 'src/compat/css/globals.css';
const css = readFileSync(FILE, 'utf8');
const root = postcss.parse(css, { from: FILE });

describe('compat globals.css (REQ-PLAT-30)', () => {
  it('is <= 1024 B gzip', () => {
    expect(gzipSync(Buffer.from(css), { level: 9 }).length).toBeLessThanOrEqual(1024);
  });

  it('every rule lives inside a single @layer ag.compat block', () => {
    const top = root.nodes.filter((n) => n.type !== 'comment');
    expect(top).toHaveLength(1);
    const layer = top[0] as postcss.AtRule;
    expect(layer.type).toBe('atrule');
    expect(layer.name).toBe('layer');
    expect(layer.params).toBe('ag.compat');
  });

  it('carries h1–h6, .flex and .grid', () => {
    const selectors = new Set<string>();
    root.walkRules((r) => r.selectors.forEach((s) => selectors.add(s.trim())));
    for (const s of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.flex', '.grid']) expect(selectors).toContain(s);
    const decl = (sel: string, prop: string) => {
      let v: string | undefined;
      root.walkRules((r) => { if (r.selectors.includes(sel)) r.walkDecls(prop, (d) => { v = d.value; }); });
      return v;
    };
    expect(decl('.flex', 'display')).toBe('flex');
    expect(decl('.grid', 'display')).toBe('grid');
    expect(decl('h1', 'font-size')).toBe('2.25rem');
  });

  it('uses no !important', () => {
    const important: string[] = [];
    root.walkDecls((d) => { if (d.important) important.push(`${d.parent && 'selector' in d.parent ? d.parent.selector : '?'} ${d.prop}`); });
    expect(important).toEqual([]);
  });
});
