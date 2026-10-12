/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-076: compat aliases — every name in the 4.x reader set has an entry in the
// map (count logged); the whole emitted file is inside @layer ag.compat (after
// the @import); the only legacy hook selector is the REQ-MAT-13
// [data-theme=dark] / .dark block mapping to every 5.x --ag-color-* dark value;
// map keys equal the reader set exactly.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { COMPAT_DARK_SELECTOR, legacyReaderSet } from '../../scripts/tokens/formats/compat-aliases.mjs';

const CSS_PATH = join(ROOT, 'dist/compat/tokens.css');
const MAP = JSON.parse(readFileSync(join(ROOT, 'tokens/generated/compat-alias-map.json'), 'utf8'));
const CSS = readFileSync(CSS_PATH, 'utf8');

describe('compat aliases (MAT-076)', () => {
  test('every 4.x reader name has a map entry (count logged)', () => {
    const readers = new Set<string>(legacyReaderSet() as Iterable<string>);
    const missing = [...readers].filter((n) => !(n in MAP));
    // Defined names are emitted as declarations; never-defined names are
    // accounted for in the map (defined: false) and must not be declared.
    const declared = new Set<string>();
    postcss.parse(CSS).walkDecls((d) => { declared.add(d.prop); });
    const accounted = [...readers].filter((n) => MAP[n] && MAP[n].defined === declared.has(n));
    console.log(`4.x reader names: ${readers.size}; map entries: ${Object.keys(MAP).length}; accounted: ${accounted.length}`);
    expect(Object.keys(MAP).sort()).toEqual([...readers].sort());
    expect(missing).toEqual([]);
    expect(accounted.length).toBe(readers.size);
  });

  test('every emitted rule lives inside @layer ag.compat', () => {
    const root = postcss.parse(CSS);
    root.walkRules((rule) => {
      let n: postcss.Container | postcss.Document | undefined = rule.parent;
      let layer = '';
      while (n && n.type !== 'root') {
        if (n.type === 'atrule' && (n as postcss.AtRule).name === 'layer') layer = (n as postcss.AtRule).params;
        n = n.parent;
      }
      expect({ sel: rule.selector, layer }).toEqual({ sel: rule.selector, layer: 'ag.compat' });
    });
    // the @import precedes the layer block
    expect(CSS.indexOf('@import')).toBeLessThan(CSS.indexOf('@layer ag.compat'));
  });

  test('the only legacy-hook selector is the [data-theme=dark]/.dark mapping (REQ-MAT-13)', () => {
    const root = postcss.parse(CSS);
    const hooks: string[] = [];
    root.walkRules((rule) => {
      if (/data-theme|data-aura-|data-persona|data-bg\b|\.glass-on-|\.dark\b|\.light\b/.test(rule.selector))
        hooks.push(rule.selector);
    });
    expect(hooks).toEqual([COMPAT_DARK_SELECTOR]);
    expect(COMPAT_DARK_SELECTOR).toBe(':where([data-theme=dark], .dark, [data-theme=dark] > body, .dark > body)');
  });

  test('[data-theme=dark], .dark carries color-scheme: dark and every 5.x dark scheme value', () => {
    // expected: every public --ag-* value dist/tokens.css sets for the 5.x dark scheme —
    // the ag.tokens [data-ag-scheme="dark"] block (dark mode-table cells, e.g. shadows)
    // plus its light-dark() fallback twin (the explicit dark value of every
    // scheme-paired var, all --ag-color-*).
    const tokens = postcss.parse(readFileSync(join(ROOT, 'dist/tokens.css'), 'utf8'));
    const expected = new Map<string, string>();
    tokens.walkRules((r) => {
      if (r.selector !== '[data-ag-scheme="dark"]') return;
      const parent = r.parent as postcss.AtRule;
      const top = parent.type === 'atrule' && parent.name === 'layer' && parent.params === 'ag.tokens';
      const fallback = parent.type === 'atrule' && parent.name === 'supports' && /^not \(color: light-dark\(/.test(parent.params);
      if (top || fallback) r.walkDecls(/^--ag-/, (d) => { expected.set(d.prop, d.value); });
    });
    expect(expected.has('--ag-color-canvas')).toBe(true);
    expect([...expected.keys()].filter((k) => k.startsWith('--ag-color-')).length).toBeGreaterThanOrEqual(13);
    const rules: postcss.Rule[] = [];
    postcss.parse(CSS).walkRules((r) => { if (r.selector === COMPAT_DARK_SELECTOR) rules.push(r); });
    expect(rules).toHaveLength(1);
    const got = new Map<string, string>();
    rules[0].walkDecls((d) => { got.set(d.prop, d.value); });
    expect(got.get('color-scheme')).toBe('dark');
    got.delete('color-scheme');
    expect(Object.fromEntries(got)).toEqual(Object.fromEntries(expected));
  });

  test('defined legacy names alias or freeze (no silent drops)', () => {
    const defined = Object.entries(MAP).filter(([, v]: [string, any]) => v.defined);
    const dropped = defined.filter(([n]) => !CSS.includes(`${n}:`));
    console.log(`defined legacy names: ${defined.length}; successor-mapped: ${defined.filter(([, v]: [string, any]) => v.successor).length}`);
    expect(dropped).toEqual([]);
  });
});

// REQ-MAT-21: tokens/compat-alias-map.json (scripts/mat/compat-alias-map.mjs)
// gives every --glass-* name with a 4.x reader an --ag-* successor or a frozen
// legacy value; nothing is left uncovered and no template prefix is a name.
describe('compat alias map coverage (REQ-MAT-21)', () => {
  const ALIAS = JSON.parse(readFileSync(join(ROOT, 'tokens/compat-alias-map.json'), 'utf8')) as {
    counts: { total: number; mapped: number; frozen: number; uncovered: number; runtimeSet: number; undeclared: number };
    entries: Record<string, { successor?: string; frozenValue?: unknown; frozenAs?: string; setBy?: string[] }>;
  };
  const entries = Object.entries(ALIAS.entries);

  test('uncovered === 0 and every entry has a successor or a frozen value', () => {
    expect(ALIAS.counts.uncovered).toBe(0);
    expect(entries.length).toBe(ALIAS.counts.total);
    const bad = entries.filter(([, e]) => !(typeof e.successor === 'string' && e.successor.startsWith('--ag-'))
      && (e.frozenValue === null || e.frozenValue === undefined));
    expect(bad.map(([k]) => k)).toEqual([]);
    expect(ALIAS.counts.mapped + ALIAS.counts.frozen).toBe(ALIAS.counts.total);
  });

  test('names never declared in 4.x freeze at initial and say why', () => {
    const unset = entries.filter(([, e]) => e.frozenAs !== undefined);
    expect(unset.length).toBe(ALIAS.counts.runtimeSet + ALIAS.counts.undeclared);
    for (const [k, e] of unset) {
      expect({ k, v: e.frozenValue }).toEqual({ k, v: 'initial' });
      expect(['runtime-set-in-4x', 'undeclared-in-4x']).toContain(e.frozenAs);
      if (e.frozenAs === 'runtime-set-in-4x') expect((e.setBy ?? []).length).toBeGreaterThan(0);
    }
  });

  test('no template prefix (name ending in "-") in either map or the reader set', () => {
    expect(Object.keys(ALIAS.entries).filter((k) => k.endsWith('-'))).toEqual([]);
    expect(Object.keys(MAP).filter((k) => k.endsWith('-'))).toEqual([]);
    expect([...(legacyReaderSet() as Iterable<string>)].filter((k) => k.endsWith('-'))).toEqual([]);
  });

  test('the committed map equals a fresh generation from the 4.1.0 snapshot', () => {
    const out = execFileSync(process.execPath, ['scripts/mat/compat-alias-map.mjs', '--check'], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toContain('0 uncovered');
  });
});
