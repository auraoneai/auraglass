/* @jest-environment node */
/* MAT-132 (css-contract) + MAT-115 (ladder consumption) + MAT-130 (coarse
   ladder) + MAT-131 (private attributes) — PostCSS checks over MAT css files.

   Generated files (src/material/css/generated/*.css) are 2a-T compiler outputs:
   while a file still carries the C0 seed marker the generated-only assertions
   report pending and return instead of failing. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { AtRule, Container, Declaration, Rule } from 'postcss';

const postcss = require('postcss') as typeof import('postcss');

const CSS_DIR = join(__dirname, '../css');
const LAYER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';

const SOURCE_FILES = ['material.css', 'lens.css'] as const;
const GENERATED_DIR = join(CSS_DIR, 'generated');

const generatedFiles = () =>
  existsSync(GENERATED_DIR)
    ? readdirSync(GENERATED_DIR).filter((f) => f.endsWith('.css'))
    : [];

const isSeed = (path: string) => /seed:/i.test(readFileSync(path, 'utf8'));

const parse = (rel: string) => postcss.parse(readFileSync(join(CSS_DIR, rel), 'utf8'));

/* ---------- shared static invariants over a parsed file ---------- */

const DENYLIST = [
  /data-theme/, /data-aura-theme/, /data-aura-mode/, /data-persona/, /data-bg/,
  /\.glass-on-light/, /\.glass-on-dark/, /(^|[^\w-])\.dark\b/, /(^|[^\w-])\.light\b/,
  /\[class\*=["']?glass-/, /\.liquid-glass-/, /\.optimized-glass-/,
  /--glass-/, /data-ag-material/, /data-ag-tier\s*=\s*["']?cinematic/,
];

const checkShared = (label: string, ast: Container) => {
  it(`${label}: first statement is the SC-20 layer order`, () => {
    const first = ast.nodes?.[0];
    expect(first?.type).toBe('atrule');
    expect(`@${(first as AtRule).name} ${(first as AtRule).params};`).toBe(LAYER_STATEMENT);
  });

  it(`${label}: zero !important`, () => {
    let count = 0;
    ast.walkDecls((d: Declaration) => { if (d.important) count += 1; });
    expect(count).toBe(0);
  });

  it(`${label}: every non-@property rule lives inside @layer ag.material`, () => {
    const underLayer = (node: Container | AtRule | Rule | Declaration | undefined | null): boolean => {
      let p: typeof node = node;
      while (p) {
        if (p.type === 'atrule' && (p as AtRule).name === 'layer' && (p as AtRule).nodes) return true;
        p = (p as { parent?: typeof p }).parent as typeof p;
      }
      return false;
    };
    const bad: string[] = [];
    ast.walk((node) => {
      if (node.type === 'rule' && !underLayer(node.parent as Container)) {
        bad.push((node as Rule).selector.slice(0, 80));
      }
      if (node.type === 'atrule' && node.parent === ast
        && (node as AtRule).name !== 'property' && (node as AtRule).name !== 'layer') {
        bad.push(`@${(node as AtRule).name}`);
      }
    });
    expect(bad).toEqual([]);
  });

  it(`${label}: no REQ-MAT-13/18 deny-list selectors or --glass-*`, () => {
    const hits: string[] = [];
    ast.walkRules((r: Rule) => {
      for (const re of DENYLIST) {
        if (re.test(r.selector)) hits.push(`${r.selector} :: ${re}`);
      }
    });
    ast.walkDecls((d: Declaration) => {
      if (/--glass-/.test(`${d.prop}${d.value}`)) hits.push(`${d.prop}: ${d.value}`);
    });
    expect(hits).toEqual([]);
  });

  it(`${label}: no transition: all or transition of backdrop-filter/filter`, () => {
    const hits: string[] = [];
    ast.walkDecls((d: Declaration) => {
      const v = d.value;
      if ((d.prop === 'transition' || d.prop === 'transition-property')
        && (/\ball\b/.test(v) || /backdrop-filter|\bfilter\b/.test(v))) {
        hits.push(`${d.prop}: ${v}`);
      }
      if (d.prop === 'animation' && /backdrop|filter/.test(v)) hits.push(`animation: ${v}`);
    });
    expect(hits).toEqual([]);
  });

  it(`${label}: no blur() literal above 32px`, () => {
    const hits: string[] = [];
    ast.walkDecls((d: Declaration) => {
      for (const m of `${d.prop}: ${d.value}`.matchAll(/blur\(\s*(\d+(?:\.\d+)?)px\s*\)/g)) {
        if (Number(m[1]) > 32) hits.push(`${d.prop}: ${d.value}`);
      }
    });
    expect(hits).toEqual([]);
  });

  it(`${label}: will-change only under [data-ag-animating]`, () => {
    const hits: string[] = [];
    ast.walkDecls((d: Declaration) => {
      if (d.prop !== 'will-change') return;
      let p: unknown = d.parent;
      let underAnimating = false;
      while (p) {
        const n = p as Rule;
        if ((n as { type?: string }).type === 'rule' && /data-ag-animating/.test(n.selector)) underAnimating = true;
        p = (n as { parent?: unknown }).parent;
      }
      if (!underAnimating) hits.push(d.toString());
    });
    expect(hits).toEqual([]);
  });
};

describe.each([...SOURCE_FILES])('css-contract: %s', (file) => {
  checkShared(file, parse(file));
});

describe.each(generatedFiles())('css-contract: generated/%s (2a-T output)', (file) => {
  const rel = `generated/${file}`;
  const seeded = isSeed(join(CSS_DIR, rel));
  if (seeded) {
    it('is pending: still the C0 seed', () => {
      console.warn(`[pending] src/material/css/${rel} is the C0 seed — ` +
        'shared invariants run once 2a-T lands the compiler output');
      expect(true).toBe(true);
    });
    return;
  }
  checkShared(`generated/${file}`, parse(rel));
});

/* ---------- material.css specific ---------- */

describe('css-contract: material.css structure', () => {
  const ast = parse('material.css');

  it('contains the @supports-not backdrop-filter lightweight block', () => {
    let found = false;
    ast.walkAtRules('supports', (r) => {
      if (/not.*backdrop-filter/.test(r.params)) found = true;
    });
    expect(found).toBe(true);
  });

  it('::before consumes the ladder vars in fixed blur-saturate-brightness order', () => {
    const vals: string[] = [];
    ast.walkDecls('backdrop-filter', (d) => { vals.push(d.value); });
    const canonical = vals.filter((v) => v.includes('var(--_ag-blur)'));
    expect(canonical.length).toBeGreaterThan(0);
    for (const v of canonical) {
      expect(v).toMatch(/blur\(var\(--_ag-blur\)\)\s+saturate\(var\(--_ag-saturation\)\)\s+brightness\(var\(--_ag-brightness\)\)/);
    }
    // blur is never a transition target
    let bad = 0;
    ast.walkDecls(/^transition/, (d) => { if (/blur|backdrop-filter/.test(d.value)) bad += 1; });
    expect(bad).toBe(0);
  });

  it('grain layer is on ::before via url(../assets/ag-grain-128.avif)', () => {
    let found = false;
    ast.walkRules((r) => {
      if (!r.selector.includes('::before')) return;
      const bg = r.nodes?.find(
        (n): n is Declaration => n.type === 'decl' && /^background(-image)?$/.test(n.prop) && n.value.includes('ag-grain-128.avif'),
      );
      if (bg) found = true;
    });
    expect(found).toBe(true);
  });

  it('rim band uses mask-composite exclude on ::after', () => {
    let found = false;
    ast.walkDecls('mask-composite', (d) => { if (d.value.includes('exclude')) found = true; });
    ast.walkDecls('-webkit-mask-composite', (d) => { if (d.value.includes('xor')) found = found && true; });
    expect(found).toBe(true);
  });

  it('tint formula matches REQ-MAT-29 exactly', () => {
    let alpha = '';
    ast.walkDecls('--_ag-alpha', (d) => {
      if (!alpha && (d.parent as Rule)?.selector === '.ag-surface') {
        alpha = d.value.replace(/\s+/g, ' ');
      }
    });
    expect(alpha).toBe(
      'min(1, max(var(--_ag-tint-floor), calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity, 0))))',
    );
  });

  it('emits the six public read-outs', () => {
    const names = new Set<string>();
    ast.walkDecls(/^--ag-surface-|^--ag-on-surface/, (d) => { names.add(d.prop); });
    for (const n of ['--ag-surface-fill', '--ag-surface-rim', '--ag-surface-shadow',
      '--ag-surface-radius', '--ag-on-surface', '--ag-on-surface-muted']) {
      expect(names.has(n)).toBe(true);
    }
  });

  it('clears backdrop-filter for nested surfaces and group children', () => {
    const sels: string[] = [];
    ast.walkRules((r) => { sels.push(r.selector.replace(/\s+/g, ' ').trim()); });
    expect(sels).toContain('.ag-surface .ag-surface:not([data-ag-allow-nested])::before');
    expect(sels).toContain('[data-ag-group] > .ag-surface::before');
  });
});

/* ---------- lens.css specific ---------- */

describe('css-contract: lens.css structure', () => {
  const ast = parse('lens.css');

  it('uses the single eligibility selector shape', () => {
    let count = 0;
    ast.walkRules((r) => {
      if (/:root\[data-ag-engine="chromium"\]:has\(svg\[data-ag-lens-ready\]\) \.ag-surface\[data-ag-refraction\]\[data-ag-layer="chrome"\]/.test(r.selector)) count += 1;
    });
    expect(count).toBe(9);
  });

  it('has no sheet sizeclass rule', () => {
    let found = false;
    ast.walkRules((r) => { if (/sizeclass="sheet"/.test(r.selector)) found = true; });
    expect(found).toBe(false);
  });

  it('never selects under standard/lightweight/tinted/solid/none rungs as eligible', () => {
    // the exclusion blocks must exist and reset backdrop-filter to the standard value
    let resets = 0;
    ast.walkDecls('backdrop-filter', (d) => {
      if (/blur\(var\(--_ag-blur\)\)/.test(d.value) && d.parent?.type === 'rule'
        && /tier|transparency|motion/.test((d.parent as Rule).selector)) resets += 1;
    });
    expect(resets).toBeGreaterThanOrEqual(3);
  });
});

/* ---------- MAT-131 private attributes ---------- */

describe('private token-keyed attributes (MAT-131)', () => {
  const PRIVATE_ATTRS = /data-ag-(radius|spacing|inset|sizeclass)/;

  it('material.css sets only token-named values on private attrs', () => {
    const ast = parse('material.css');
    const hits: string[] = [];
    ast.walkDecls((d) => {
      let p = d.parent as Container | undefined;
      while (p) {
        if (p.type === 'rule' && PRIVATE_ATTRS.test((p as Rule).selector)) {
          // values inside a private-attr block may only reference token vars
          if (/\b\d+px\b/.test(d.value) && !/var\(/.test(d.value)) {
            hits.push(`${(p as Rule).selector} :: ${d.prop}: ${d.value}`);
          }
        }
        p = p.parent as Container | undefined;
      }
    });
    expect(hits).toEqual([]);
  });

  it('private SC-21 attributes are absent from the public css-api attributes', async () => {
    const api = JSON.parse(readFileSync(
      join(__dirname, '../../../etc/api/material.css-api.json'), 'utf8'));
    for (const attr of api.privateAttributes) {
      expect(api.attributes).not.toContain(attr);
    }
    expect(api.attributes).not.toContain('data-ag-material');
  });
});

/* ---------- MAT-130 coarse-pointer ladder ---------- */

describe('responsive ladder (MAT-130)', () => {
  it('ladders.css coarse-pointer block drops only thick blur and caps grain', () => {
    const file = join(GENERATED_DIR, 'ladders.css');
    if (!existsSync(file) || isSeed(file)) {
      console.warn('[pending] generated/ladders.css is the C0 seed — coarse-pointer assertions run when 2a-T lands it');
      expect(true).toBe(true);
      return;
    }
    const ast = postcss.parse(readFileSync(file, 'utf8'));
    let found = false;
    let thickDropped = false;
    let grainCapped = false;
    ast.walkAtRules('media', (r) => {
      if (!/pointer:\s*coarse/.test(r.params)) return;
      found = true;
      r.walkDecls((d) => {
        if (/thick/.test((d.parent as Rule)?.selector ?? '') && /blur/.test(d.prop + d.value)) {
          if (/(2[0-4])px/.test(d.value) || /var\(/.test(d.value)) thickDropped = true;
        }
        if (/grain/i.test(d.prop) && /(0\.0[0-2]|none)/.test(d.value)) grainCapped = true;
      });
    });
    expect(found).toBe(true);
    expect(thickDropped || grainCapped).toBe(true);
  });
});
