/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-036 (+MAT-053): emitted CSS hygiene — 0 !important; every rule in its
// expected ag.* layer; :root only inside ag.tokens/ag.compat; only @property
// unlayered; no legacy-hook selectors; no class strings in src/tokens/generated;
// no style-dictionary/ajv imports in dist.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const FILES = [
  'dist/css/tokens.css',
  'dist/css/tailwind.css',
  'dist/compat/tokens.css',
  'src/material/css/generated/ladders.css',
  'src/material/css/generated/floors.css',
  'src/material/css/generated/properties.css',
].filter((f) => existsSync(join(ROOT, f)));

const LEGACY_HOOKS = /data-theme|data-aura-|data-persona|data-bg\b|\.glass-on-|\.dark\b|\.light\b/;
const LAYERS = new Set(['ag.compat', 'ag.reset', 'ag.tokens', 'ag.material', 'ag.components', 'ag.a11y']);

const layerOf = (node: postcss.ChildNode): string | null => {
  let n: postcss.ChildNode | postcss.Container | postcss.Document | undefined = node;
  while (n && n.parent) {
    n = n.parent;
    if (n?.type === 'atrule' && (n as postcss.AtRule).name === 'layer')
      return (n as postcss.AtRule).params.trim().replace(/['"]/g, '');
    if (n?.type === 'atrule' && ['media', 'supports'].includes((n as postcss.AtRule).name)) {
      let m: postcss.Container | postcss.Document | undefined = n;
      while (m?.parent) {
        m = m.parent;
        if (m?.type === 'atrule' && (m as postcss.AtRule).name === 'layer')
          return (m as postcss.AtRule).params.trim().replace(/['"]/g, '');
      }
      return null;
    }
  }
  return null;
};

describe('emitted css (MAT-036)', () => {
  for (const f of FILES) {
    describe(f, () => {
      const text = readFileSync(join(ROOT, f), 'utf8');
      const root = postcss.parse(text);

      test('zero !important', () => {
        expect(text).not.toContain('!important');
      });

      test('rules live in expected ag.* layers', () => {
        const bad: string[] = [];
        root.walkRules((r) => {
          const layer = layerOf(r);
          if (layer && !LAYERS.has(layer)) bad.push(`${r.selector} -> ${layer}`);
          if (!layer) {
            // unlayered rules allowed only under @property / @supports / @media
            let p = r.parent;
            const chain: string[] = [];
            while (p && p.type === 'atrule') { chain.push((p as postcss.AtRule).name); p = p.parent; }
            if (!chain.every((c) => ['supports', 'media', 'custom-variant', 'utility'].includes(c)))
              bad.push(`${r.selector} unlayered (${chain.join('>')})`);
          }
        });
        expect(bad).toEqual([]);
      });

      test(':root only inside ag.tokens / ag.compat', () => {
        const bad: string[] = [];
        root.walkRules((r) => {
          if (!/:root|:where\(:root/.test(r.selector)) return;
          const layer = layerOf(r);
          if (layer && !['ag.tokens', 'ag.compat'].includes(layer)) bad.push(`${r.selector} in ${layer}`);
        });
        expect(bad).toEqual([]);
      });

      test('only @property blocks are unlayered at top level', () => {
        const bad: string[] = [];
        root.walkAtRules((r) => {
          if (r.name === 'layer' || r.name === 'import' || r.name === 'charset') return;
          const layer = layerOf(r);
          if (layer) return;
          if (r.name !== 'property' && !['supports', 'media', 'custom-variant', 'utility', 'theme'].includes(r.name))
            bad.push(`@${r.name} ${r.params}`);
        });
        expect(bad).toEqual([]);
      });

      test('no legacy hook selectors', () => {
        const bad: string[] = [];
        root.walkRules((r) => { if (LEGACY_HOOKS.test(r.selector)) bad.push(r.selector); });
        expect(bad).toEqual([]);
      });
    });
  }

  test('no class strings in src/tokens/generated/**', () => {
    const dir = join(ROOT, 'src/tokens/generated');
    for (const f of readdirSync(dir)) {
      const t = readFileSync(join(dir, f), 'utf8');
      // no CSS class strings / className plumbing in generated TS
      expect({ f, ok: !/className\s*[:=]|clsx|classnames|['"]\.[a-z]/i.test(t) }).toEqual({ f, ok: true });
    }
  });

  test('no style-dictionary / ajv imports in dist', () => {
    const walk = (d: string, out: string[] = []) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p, out);
        else out.push(p);
      }
      return out;
    };
    for (const f of walk(join(ROOT, 'dist')))
      expect(readFileSync(f, 'utf8')).not.toMatch(/style-dictionary|from ['"]ajv|require\(['"]ajv/);
  });
});
