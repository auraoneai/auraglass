/* REQ-FIN-02 (REQ-MAT-09, -26, -29, -31, -42, -43, -49): structural checks on
   src/material/css/{material,lens}.css. Every emitted --_ag-state-* private
   scalar must have a var() reader in material.css — a state token nothing
   reads is a dead spec. Emitted set = the ag.cssVar names in
   tokens/sys/interaction.tokens.json (the compiler's contract) plus any
   --_ag-state-* declared in generated css. Rendering (computed styles in
   three engines) is the remote L5 lane's job, not this file's. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import postcss, { type Declaration, type Rule } from 'postcss';

const ROOT = resolve(__dirname, '..', '..');
const MATERIAL_CSS = readFileSync(join(ROOT, 'src/material/css/material.css'), 'utf8');
const LENS_CSS = readFileSync(join(ROOT, 'src/material/css/lens.css'), 'utf8');
const ast = postcss.parse(MATERIAL_CSS);
const lensAst = postcss.parse(LENS_CSS);

const collectEmitted = (): Set<string> => {
  const names = new Set<string>();
  const tokens = JSON.parse(readFileSync(join(ROOT, 'tokens/sys/interaction.tokens.json'), 'utf8'));
  const walk = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (k === 'ag.cssVar' && typeof v === 'string' && v.startsWith('--_ag-state-')) names.add(v);
      else if (typeof v === 'object') walk(v);
    }
  };
  walk(tokens);
  const gen = join(ROOT, 'src/material/css/generated');
  if (existsSync(gen)) {
    for (const f of readdirSync(gen)) {
      if (!f.endsWith('.css')) continue;
      for (const m of readFileSync(join(gen, f), 'utf8').matchAll(/--_ag-state-[a-z-]+/g)) names.add(m[0]);
    }
  }
  return names;
};

const unread = (emitted: Iterable<string>, css: string): string[] =>
  [...emitted].filter((v) => !new RegExp(`var\\(\\s*${v}\\s*[,)]`).test(css));

const rulesMatching = (root: postcss.Root, re: RegExp): Rule[] => {
  const out: Rule[] = [];
  root.walkRules((r) => { if (re.test(r.selector)) out.push(r); });
  return out;
};
const declsOf = (r: Rule, prop: string): Declaration[] =>
  (r.nodes ?? []).filter((n): n is Declaration => n.type === 'decl' && n.prop === prop);

describe('REQ-FIN-02 state readers (REQ-MAT-09)', () => {
  it('every emitted --_ag-state-* has a var() reader in material.css', () => {
    const emitted = [...collectEmitted()].sort();
    expect(emitted.length).toBeGreaterThanOrEqual(9);
    expect(unread(emitted, MATERIAL_CSS)).toEqual([]);
  });

  it('the reader check fails when a state reader is removed (failing fixture)', () => {
    const stripped = MATERIAL_CSS.replace(/var\(--_ag-state-loading-alpha\)/g, '0.7');
    expect(unread(collectEmitted(), stripped)).toEqual(['--_ag-state-loading-alpha']);
  });

  it('reads at least 9 distinct --_ag-state-* vars (AC-FIN-02)', () => {
    const read = new Set([...MATERIAL_CSS.matchAll(/var\((--_ag-state-[a-z-]+)/g)].map((m) => m[1]));
    expect(read.size).toBeGreaterThanOrEqual(9);
  });

  it('state readers carry no hard-coded literal fallbacks (0.16 / 0.7 / 2px / 0.06)', () => {
    expect(MATERIAL_CSS).not.toMatch(/var\(--_?ag-state-[a-z-]+\s*,/);
  });

  it('no custom property is declared in terms of itself (guaranteed-invalid cycle)', () => {
    const cycles: string[] = [];
    ast.walkDecls(/^--/, (d) => { if (new RegExp(`var\\(\\s*${d.prop}\\s*[,)]`).test(d.value)) cycles.push(`${(d.parent as Rule).selector} ${d.prop}`); });
    expect(cycles).toEqual([]);
  });

  it('selected / drop-target change the rim width, not only the tint', () => {
    const selected = rulesMatching(ast, /\[aria-selected="true"\]/).filter((r) => r.parent?.type !== 'atrule' || (r.parent as postcss.AtRule).name !== 'media');
    expect(selected.some((r) => declsOf(r, '--_ag-rim-width').some((d) => d.value.includes('--_ag-state-selected-rim-width')))).toBe(true);
    const drop = rulesMatching(ast, /^\[data-ag-surface\]\[data-drop-target\]$/);
    expect(drop.some((r) => declsOf(r, '--_ag-rim-width').length > 0)).toBe(true);
  });

  it('forced-colors maps selected/press to Highlight and disabled to GrayText', () => {
    const blocks: string[] = [];
    ast.walkAtRules('media', (a) => { if (a.params.includes('forced-colors: active')) blocks.push(a.toString()); });
    const joined = blocks.join('\n');
    expect(joined).toMatch(/\[aria-selected="true"\][^{]*\{[^}]*Highlight/);
    expect(joined).toMatch(/\[data-pressed\][^{]*\{[^}]*Highlight/);
    expect(joined).toMatch(/\[aria-disabled="true"\][^{]*\{[^}]*GrayText/);
  });

  it('contrast=more has an outline form', () => {
    const more = rulesMatching(ast, /\[data-ag-contrast="more"\]/);
    expect(more.some((r) => declsOf(r, 'outline').length > 0)).toBe(true);
  });
});

describe('REQ-FIN-02 selector identity (REQ-MAT-29)', () => {
  it('no .ag-surface class selector survives in src/material/css (AC-FIN-02)', () => {
    expect(MATERIAL_CSS).not.toMatch(/\.ag-surface/);
    expect(LENS_CSS).not.toMatch(/\.ag-surface/);
  });

  it('the host baseline and pseudo-element baselines have zero specificity', () => {
    const sels: string[] = [];
    ast.walkRules((r) => sels.push(r.selector.replace(/\s+/g, ' ').trim()));
    expect(sels).toContain(':where([data-ag-surface])');
    expect(sels).toContain(':where([data-ag-surface])::before');
    expect(sels).toContain(':where([data-ag-surface])::after');
  });

  it('no host rule redeclares --_ag-on-surface / --_ag-on-surface-muted', () => {
    const host = rulesMatching(ast, /\[data-ag-surface\]/);
    const offenders = host.filter((r) => declsOf(r, '--_ag-on-surface').length + declsOf(r, '--_ag-on-surface-muted').length > 0);
    expect(offenders.map((r) => r.selector)).toEqual([]);
  });

  it('declares the contract read-outs; --ag-surface-fill derives from --_ag-fill only', () => {
    const [host] = rulesMatching(ast, /^:where\(\[data-ag-surface\]\)$/);
    expect(host).toBeDefined();
    for (const n of ['--ag-surface-fill', '--ag-surface-rim', '--ag-surface-shadow', '--ag-surface-radius', '--ag-on-surface', '--ag-on-surface-muted']) {
      expect(declsOf(host!, n)).toHaveLength(1);
    }
    expect(declsOf(host!, '--ag-surface-fill')[0]!.value).toBe('var(--_ag-fill)');
    const writers: string[] = [];
    ast.walkDecls('--ag-surface-fill', (d) => writers.push((d.parent as Rule).selector));
    expect(writers).toEqual([':where([data-ag-surface])']);
  });
});

describe('REQ-FIN-02 floor rows (REQ-MAT-31)', () => {
  it.each([
    ['[data-ag-layer="overlay"][data-open]'],
    ['[data-expanded]'],
    ['[data-ag-full-height]'],
  ])('%s sets --_ag-tint-floor', (attr) => {
    const rules = rulesMatching(ast, new RegExp(`\\[data-ag-surface\\]${attr.replace(/[[\]"=]/g, '\\$&')}`));
    expect(rules.some((r) => declsOf(r, '--_ag-tint-floor').length > 0)).toBe(true);
  });

  it('the scrim blur is capped at 12px', () => {
    const [scrim] = rulesMatching(ast, /^\[data-ag-layer="scrim"\]$/);
    expect(declsOf(scrim!, 'backdrop-filter')[0]!.value).toMatch(/min\([^)]*\), 12px\)/);
  });
});

describe('REQ-FIN-02 optics clauses (REQ-MAT-26, -32, -42, -43, -49)', () => {
  it('::before and ::after opacity are bound to --_ag-optics; backdrop-filter has no --_ag-optics term', () => {
    for (const sel of [':where([data-ag-surface])::before', ':where([data-ag-surface])::after']) {
      const [r] = rulesMatching(ast, new RegExp(`^${sel.replace(/[()[\]:]/g, '\\$&')}$`));
      expect(declsOf(r!, 'opacity')[0]!.value).toContain('var(--_ag-optics)');
      for (const d of declsOf(r!, 'backdrop-filter')) expect(d.value).not.toContain('--_ag-optics');
    }
  });

  it('grain is its own ::before layer and is removed under contrast=more, solid and forced colours', () => {
    const [base] = rulesMatching(ast, /^:where\(\[data-ag-surface\]\)::before$/);
    expect(declsOf(base!, 'background-image')[0]!.value).toContain('ag-grain-128.avif');
    const moreBefore = rulesMatching(ast, /\[data-ag-contrast="more"\][^,]*\[data-ag-surface\]::before|\[data-ag-surface\]\[data-ag-contrast="more"\]::before/);
    expect(moreBefore.length).toBeGreaterThan(0);
    for (const r of moreBefore) for (const d of declsOf(r, 'background-image')) expect(d.value).not.toContain('grain');
    const solid = rulesMatching(ast, /\[data-ag-transparency="solid"\][^,]*::before/);
    for (const r of solid) for (const d of declsOf(r, 'background-image')) expect(d.value).not.toContain('grain');
  });

  it('--_ag-hover is not read by material.css (MAT-42)', () => {
    expect(MATERIAL_CSS).not.toContain('--_ag-hover');
  });

  it('interactive and overlay transition lists both carry the --_ag-optics cross-fade and the overlay∩interactive rule has the union', () => {
    const list = (sel: RegExp) => declsOf(rulesMatching(ast, sel)[0]!, 'transition')[0]!.value;
    const interactive = list(/^\[data-ag-surface\]\[data-ag-interactive\]$/);
    const overlay = list(/^\[data-ag-surface\]\[data-ag-overlay\]$/);
    const both = list(/^\[data-ag-surface\]\[data-ag-overlay\]\[data-ag-interactive\]$/);
    for (const v of [interactive, overlay, both]) expect(v).toContain('--_ag-optics');
    for (const p of ['--ag-specular', '--_ag-press', 'scale', 'translate', 'opacity']) expect(both).toContain(p);
    for (const v of [interactive, overlay, both]) expect(v).not.toMatch(/\ball\b|blur|backdrop-filter/);
  });

  it('transform-origin sits on the resting overlay rule', () => {
    const [r] = rulesMatching(ast, /^\[data-ag-surface\]\[data-ag-overlay\]$/);
    expect(declsOf(r!, 'transform-origin')).toHaveLength(1);
  });

  it('pointer light rides the ::after sheen at var(--_ag-pointer, 50% 30%)', () => {
    const [r] = rulesMatching(ast, /^\[data-ag-surface\]\[data-ag-pointer-light\]::after$/);
    expect(declsOf(r!, 'background')[0]!.value).toMatch(/radial-gradient\(circle at var\(--_ag-pointer, 50% 30%\)/);
  });

  it('maps every SpaceToken / RadiusToken attribute value to its var', () => {
    const SPACE = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];
    const RADIUS = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const decl = (sel: string, prop: string) => {
      const r = rulesMatching(ast, new RegExp(`^${sel.replace(/[[\]"=():]/g, '\\$&')}$`))[0];
      return r ? declsOf(r, prop)[0]?.value : undefined;
    };
    for (const s of SPACE) {
      expect(decl(`[data-ag-inset="${s}"]`, '--ag-inset')).toBe(`var(--ag-space-${s})`);
      expect(decl(`[data-ag-group][data-ag-spacing="${s}"]`, '--ag-group-spacing')).toBe(`var(--ag-space-${s})`);
    }
    for (const r of RADIUS) {
      expect(decl(`[data-ag-radius="${r}"]:not([data-ag-surface])`, '--ag-radius-outer')).toBe(`var(--ag-radius-${r})`);
    }
  });

  it('scroll edge paints the host fill', () => {
    const [r] = rulesMatching(ast, /^:where\(\[data-ag-part="scroll-edge"\]\)$/);
    expect(declsOf(r!, 'background')[0]!.value).toContain('var(--ag-surface-fill');
  });
});

describe('REQ-FIN-02 lens eligibility (REQ-MAT-36 lens.css clause)', () => {
  it('every lens rule is prefixed with :root[data-ag-tier="enhanced"]', () => {
    const sels: string[] = [];
    lensAst.walkRules((r) => { for (const s of r.selectors) sels.push(s.trim()); });
    expect(sels.length).toBeGreaterThanOrEqual(9);
    for (const s of sels) expect(s.startsWith(':root[data-ag-tier="enhanced"]')).toBe(true);
  });
});
