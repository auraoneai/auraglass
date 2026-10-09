/* @jest-environment node */
/* REQ-FIN-03 (MAT-34/35/40/07): the generated ladders.css must
   - emit engine scalars on [data-ag-surface][data-ag-variant][data-ag-thickness]
     plus default-thickness rows
   - put -webkit-backdrop-filter literals on ::before selectors only, constants
     only (never var()), for standard/enhanced/no-tier — never the lightweight tier
   - include brightness() in every literal (MAT-034)
   - emit the clear-variant fail-safe regular rows outside declared backdrops
   - cap thick surfaces at 20px blur and grain at 0.02 under (pointer: coarse)
   - emit thick rim 1.5px and two-layer --ag-shadow-<t> (ambient+key) with a
     dark override (MAT-07)
   - never emit --_ag-surface-alpha or unprefixed backdrop-filter here */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

const ROOT = join(__dirname, '../../..');
const LADDERS = readFileSync(join(ROOT, 'src/material/css/generated/ladders.css'), 'utf8');
const TOKENS_CSS = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');

type Rule = { selectors: string[]; decls: Record<string, string> };
const rulesOf = (css: string): Rule[] => {
  const root = postcss.parse(css);
  const rules: Rule[] = [];
  root.walkRules((rule) => {
    const decls: Record<string, string> = {};
    rule.walkDecls((d) => (decls[d.prop] = d.value));
    rules.push({ selectors: rule.selectors, decls });
  });
  return rules;
};
const RULES = rulesOf(LADDERS);
const CELL_RE =
  /^\[data-ag-surface\]\[data-ag-variant="(regular|clear|identity)"\]\[data-ag-thickness="(thin|regular|thick)"\]$/;
const backdropRules = RULES.filter((r) => 'backdrop-filter' in r.decls || '-webkit-backdrop-filter' in r.decls);

describe('REQ-FIN-03 ladders.css shape', () => {
  it('emits the engine scalars on every variant x thickness surface cell', () => {
    const cells = RULES.filter((r) => r.selectors.length === 1 && CELL_RE.test(r.selectors[0]));
    expect(cells).toHaveLength(9); // 3 variants x 3 thicknesses
    for (const rule of cells) {
      for (const v of [
        '--_ag-blur',
        '--_ag-saturation',
        '--_ag-brightness',
        '--_ag-grain-opacity',
        '--_ag-rim-width',
        '--_ag-shadow',
        '--_ag-tint-alpha',
      ])
        expect(rule.decls).toHaveProperty(v);
      expect(rule.decls['--_ag-brightness']).toMatch(/^light-dark\(/);
      expect(rule.decls['--_ag-shadow']).toMatch(/var\(--ag-shadow-\w+\), var\(--ag-shadow-\w+-key\)/);
      expect(rule.decls).not.toHaveProperty('--_ag-surface-alpha');
    }
  });

  it('emits default-thickness rows (no [data-ag-thickness] behaves as regular)', () => {
    const def = RULES.filter((r) =>
      r.selectors.some((s) =>
        /^\[data-ag-surface\]\[data-ag-variant="(regular|clear|identity)"\]:not\(\[data-ag-thickness\]\)$/.test(s)
      )
    );
    expect(def).toHaveLength(3);
    expect(def[0].decls['--_ag-blur']).toBe('20px'); // regular cell
  });

  it('emits the clear fail-safe regular row outside declared backdrops', () => {
    const rows = RULES.filter((r) =>
      r.selectors.some((s) => s.includes('[data-ag-variant="clear"]') && s.includes('[data-ag-backdrop] *'))
    );
    expect(rows.length).toBe(3); // per thickness
    const blurByThickness = { thin: '12px', regular: '20px', thick: '32px' };
    for (const r of rows) {
      const t = /\[data-ag-thickness="(\w+)"\]/.exec(r.selectors[0])![1] as keyof typeof blurByThickness;
      expect(r.decls['--_ag-blur']).toBe(blurByThickness[t]);
    }
  });

  it('puts backdrop-filter on ::before only, constants only, never the lightweight tier', () => {
    expect(backdropRules.length).toBe(8); // 2 blurred variants x 3 thicknesses + 2 coarse literals
    for (const r of backdropRules) {
      expect(r.selectors.every((s) => s.endsWith('::before'))).toBe(true);
      expect(r.decls).not.toHaveProperty('backdrop-filter'); // prefixed only
      const bf = r.decls['-webkit-backdrop-filter'];
      expect(bf).toBeDefined();
      expect(bf).not.toContain('var(');
      expect(bf).toMatch(/^blur\(\d+px\) saturate\([\d.]+\) brightness\([\d.]+\)$/); // MAT-034: brightness() present
      expect(
        r.selectors.every((sel) => {
          const flat = sel.replace(/\s+/g, ' ');
          return !flat.includes('lightweight') || flat.includes(':not( :where([data-ag-tier="lightweight"]');
        })
      ).toBe(true);
    }
    // no rule explicitly emits for the lightweight tier
    const lite = backdropRules.filter((r) =>
      r.selectors.some((s) => {
        const flat = s.replace(/\s+/g, ' ');
        return flat.includes('[data-ag-tier="lightweight"]') && !flat.includes(':not(');
      })
    );
    expect(lite).toHaveLength(0);
  });

  it('lightweight tier block pins blur 0px and grain <= 0.02', () => {
    const lite = RULES.find((r) => r.selectors.some((s) => s === '[data-ag-surface][data-ag-tier="lightweight"]'));
    expect(lite).toBeDefined();
    expect(lite!.decls['--_ag-blur']).toBe('0px');
    expect(lite!.decls['--_ag-grain-opacity']).toContain('min(var(--_ag-grain-opacity), 0.02)');
  });

  it('coarse pointers: thick capped at 20px blur, grain <= 0.02 on all cells (MAT-040)', () => {
    expect(LADDERS).toContain('@media (pointer: coarse)');
    // postcss walkRules already descends into the @media block -> RULES covers it
    const thick = RULES.find((r) => r.selectors.some((s) => s === '[data-ag-surface][data-ag-thickness="thick"]') && r.decls['--_ag-blur'] === '20px');
    expect(thick).toBeDefined();
    const grain = RULES.find((r) => r.selectors.some((s) => s === '[data-ag-surface]') && r.decls['--_ag-grain-opacity']?.includes('0.02'));
    expect(grain).toBeDefined();
    const literal = backdropRules.find((r) => r.decls['-webkit-backdrop-filter'] === 'blur(20px) saturate(1.6) brightness(1)');
    expect(literal).toBeDefined();
  });

  it('thick cells emit --_ag-rim-width: 1.5px (MAT-07)', () => {
    const thick = RULES.find((r) => r.selectors[0] === '[data-ag-surface][data-ag-variant="regular"][data-ag-thickness="thick"]');
    expect(thick?.decls['--_ag-rim-width']).toBe('1.5px');
  });

  it('--ag-shadow-<t> emits two-layer ambient+key values with a dark override (MAT-07)', () => {
    for (const t of ['thin', 'regular', 'thick']) {
      expect(TOKENS_CSS).toMatch(new RegExp(`--ag-shadow-${t}: \\d+px \\d+px \\d+px \\d+px [^;]+`));
      expect(TOKENS_CSS).toMatch(new RegExp(`--ag-shadow-${t}-key: \\d+px \\d+px \\d+px \\d+px [^;]+`));
    }
    const dark = TOKENS_CSS.slice(TOKENS_CSS.indexOf('@media (prefers-color-scheme: dark)'));
    expect(dark).toContain('--ag-shadow-regular:');
    expect(dark).toContain('--ag-shadow-regular-key:');
    // dark override must differ from light
    const lightVal = /--ag-shadow-regular: ([^;]+)/.exec(TOKENS_CSS)![1];
    const darkVal = /--ag-shadow-regular: ([^;]+)/.exec(dark)![1];
    expect(darkVal).not.toBe(lightVal);
  });

  it('emits no unprefixed backdrop-filter and no --_ag-surface-alpha anywhere', () => {
    expect(LADDERS.match(/^\s*backdrop-filter:/m)).toBeNull();
    expect(LADDERS).not.toContain('--_ag-surface-alpha');
  });
});
