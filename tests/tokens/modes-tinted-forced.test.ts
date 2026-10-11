/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// REQ-MAT-12 (FIN D.3-09, REQ-FIN-51): the compiler's mode emitter
//  - emits a [data-ag-transparency="tinted"] attribute block carrying the full
//    transparency value set (tokens without a tinted cell re-declare their default);
//  - the prefers-reduced-transparency media mirror applies the TINTED set, because
//    the OS floor for reduced transparency is tinted (PRD-MAT §4.5), never solid;
//  - emits a forced-colours token block in @layer ag.tokens mapping every
//    ag.forcedColor token to its CSS system colour, last in the layer, whose
//    selector list covers every rule that re-declares one of those variables.
// Parses the built dist/css/tokens.css (npm run tokens:build runs first in
// mat:test:tokens-interim) and the token sources it is compiled from.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import postcss, { type AtRule, type Rule, type Root } from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const root: Root = postcss.parse(css);

const tokensLayer = (): AtRule => {
  const layers = root.nodes.filter(
    (n): n is AtRule => n.type === 'atrule' && n.name === 'layer' && n.params === 'ag.tokens' && !!n.nodes,
  );
  expect(layers).toHaveLength(1);
  return layers[0]!;
};

/** Custom-property declarations of a rule, as a name -> value map. */
const declMap = (rule: Rule): Map<string, string> => {
  const m = new Map<string, string>();
  rule.each((n) => {
    if (n.type === 'decl' && n.prop.startsWith('--')) m.set(n.prop, n.value);
  });
  return m;
};

/** Direct-child rule of @layer ag.tokens with exactly this selector. */
const layerRule = (selector: string): Rule => {
  const hits = (tokensLayer().nodes ?? []).filter((n): n is Rule => n.type === 'rule' && n.selector === selector);
  expect(hits).toHaveLength(1);
  return hits[0]!;
};

/** The :root:not([data-ag-<axis>]) rule inside `@media <query>` in ag.tokens. */
const mirrorRule = (query: string, axis: string): Rule => {
  const media = (tokensLayer().nodes ?? []).filter(
    (n): n is AtRule => n.type === 'atrule' && n.name === 'media' && n.params === query,
  );
  expect(media).toHaveLength(1);
  const rules = (media[0]!.nodes ?? []).filter(
    (n): n is Rule => n.type === 'rule' && n.selector === `:root:not([data-ag-${axis}])`,
  );
  expect(rules).toHaveLength(1);
  return rules[0]!;
};

/** Every token leaf of tokens/** (DTCG), with its dotted path. */
type Leaf = { path: string; $value: unknown; $extensions?: Record<string, unknown> };
const leaves = (): Leaf[] => {
  const out: Leaf[] = [];
  const walkFile = (o: Record<string, unknown>, p: string[]) => {
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('$') || !v || typeof v !== 'object') continue;
      const node = v as Record<string, unknown>;
      if ('$value' in node) out.push({ path: [...p, k].join('.'), ...(node as Omit<Leaf, 'path'>) });
      else walkFile(node, [...p, k]);
    }
  };
  const walkDir = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) {
        if (f !== 'legacy' && f !== 'generated') walkDir(p);
      } else if (f.endsWith('.tokens.json')) walkFile(JSON.parse(readFileSync(p, 'utf8')), []);
    }
  };
  walkDir(join(ROOT, 'tokens'));
  return out;
};

/** cssVars of mode-table tokens with at least one cell on `axis`. */
const varsModedOn = (axis: string): string[] =>
  leaves()
    .filter((l) => l.$value && typeof l.$value === 'object' && !Array.isArray(l.$value))
    .filter((l) => Object.keys(l.$value as object).some((k) => k.startsWith(`${axis}.`)))
    .map((l) => l.$extensions?.['ag.cssVar'])
    .filter((v): v is string => typeof v === 'string')
    .sort();

const SYSTEM_COLORS = new Set([
  'Canvas', 'CanvasText', 'LinkText', 'Highlight', 'HighlightText', 'GrayText', 'ButtonFace', 'ButtonText',
]);

describe('transparency=tinted block (REQ-MAT-12)', () => {
  const transparencyVars = varsModedOn('transparency');

  test('the token sources mode at least one variable on transparency', () => {
    expect(transparencyVars.length).toBeGreaterThan(0);
  });

  test('[data-ag-transparency="tinted"] declares the full transparency value set', () => {
    const tinted = declMap(layerRule('[data-ag-transparency="tinted"]'));
    expect([...tinted.keys()].sort()).toEqual(transparencyVars);
  });

  test('[data-ag-transparency="solid"] declares the same variable set', () => {
    const solid = declMap(layerRule('[data-ag-transparency="solid"]'));
    expect([...solid.keys()].sort()).toEqual(transparencyVars);
  });

  test('tinted keeps the default (glass) value where no tinted cell is authored', () => {
    const tinted = declMap(layerRule('[data-ag-transparency="tinted"]'));
    const base = declMap(layerRule(':root'));
    const authoredTinted = new Set(
      leaves()
        .filter((l) => l.$value && typeof l.$value === 'object' && 'transparency.tinted' in (l.$value as object))
        .map((l) => l.$extensions?.['ag.cssVar']),
    );
    for (const [v, value] of tinted) {
      if (authoredTinted.has(v)) continue;
      expect(`${v}: ${value}`).toBe(`${v}: ${base.get(v)}`);
    }
  });

  test('the reduced-transparency media mirror applies exactly the tinted set', () => {
    const tinted = declMap(layerRule('[data-ag-transparency="tinted"]'));
    const mirror = declMap(mirrorRule('(prefers-reduced-transparency: reduce)', 'transparency'));
    expect(Object.fromEntries(mirror)).toEqual(Object.fromEntries(tinted));
  });

  test('the reduced-transparency mirror is not the solid set', () => {
    const solid = declMap(layerRule('[data-ag-transparency="solid"]'));
    const mirror = declMap(mirrorRule('(prefers-reduced-transparency: reduce)', 'transparency'));
    expect(Object.fromEntries(mirror)).not.toEqual(Object.fromEntries(solid));
  });
});

describe('forced-colours token block (REQ-MAT-12/54)', () => {
  const forcedLeaves = leaves().filter((l) => typeof l.$extensions?.['ag.forcedColor'] === 'string');
  const expected = new Map(
    forcedLeaves.map((l) => [l.$extensions!['ag.cssVar'] as string, l.$extensions!['ag.forcedColor'] as string]),
  );

  const forcedMedia = (): AtRule => {
    const hits = (tokensLayer().nodes ?? []).filter(
      (n): n is AtRule => n.type === 'atrule' && n.name === 'media' && n.params === '(forced-colors: active)',
    );
    expect(hits).toHaveLength(1);
    return hits[0]!;
  };
  const forcedRule = (): Rule => {
    const rules = (forcedMedia().nodes ?? []).filter((n): n is Rule => n.type === 'rule');
    expect(rules).toHaveLength(1);
    return rules[0]!;
  };

  test('every public --ag-color-* token maps to a CSS system colour', () => {
    const colorVars = leaves()
      .map((l) => l.$extensions?.['ag.cssVar'])
      .filter((v): v is string => typeof v === 'string' && v.startsWith('--ag-color-'));
    expect(colorVars.length).toBe(13);
    for (const v of colorVars) expect(expected.has(v)).toBe(true);
  });

  test('the block declares exactly the ag.forcedColor map, values are system colours', () => {
    const decls = declMap(forcedRule());
    expect(Object.fromEntries(decls)).toEqual(Object.fromEntries(expected));
    for (const value of decls.values()) expect(SYSTEM_COLORS.has(value)).toBe(true);
  });

  test('it is the last rule of @layer ag.tokens', () => {
    const nodes = (tokensLayer().nodes ?? []).filter((n) => n.type !== 'comment');
    expect(nodes[nodes.length - 1]).toBe(forcedMedia());
  });

  test('its selector list covers every ag.tokens rule that re-declares a mapped variable', () => {
    const covered = new Set(forcedRule().selectors);
    expect(covered.has(':root')).toBe(true);
    const missing: string[] = [];
    tokensLayer().walkRules((rule) => {
      if (rule === forcedRule()) return;
      const declares = [...declMap(rule).keys()].some((v) => expected.has(v));
      if (!declares) return;
      for (const sel of rule.selectors) if (!covered.has(sel)) missing.push(sel);
    });
    expect(missing).toEqual([]);
  });
});
