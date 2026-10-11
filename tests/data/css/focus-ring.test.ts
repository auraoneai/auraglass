// REQ-SURF-193 (REQ-FIN-90): static half of the SURF focus gate. The browser
// half is tests/e2e/surf/focus.spec.ts (L5, remote); the markup half is
// tests/data/focusable-parts.test.tsx.
//  1. `outline: none|0` in SURF CSS only survives on a selector that also has
//     a `:focus-visible` replacement painting an outline from the MAT focus
//     tokens (acceptance: `rg -n 'outline:\s*none' src/{date,charts,data,
//     media,ai,app-shell}` hits only rules with a :focus-visible replacement).
//  2. No SURF rule removes the outline on :focus-visible / focus attributes.
//  3. The app-shell scroll region pads both block edges from the sticky
//     chrome vars, and every SURF CSS file parses.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss, { type Root, type Rule } from 'postcss';

const ROOT = process.cwd();
const SURF_DIRS = ['src/date', 'src/charts', 'src/data', 'src/media', 'src/ai', 'src/app-shell'];

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}

interface Decls { outline?: string; outlineNone: boolean }

const files = SURF_DIRS.flatMap((d) => [...walk(join(ROOT, d))]).map((f) => relative(ROOT, f).replace(/\\/g, '/'));
const parsed = new Map<string, Root | Error>();
for (const f of files) {
  try {
    parsed.set(f, postcss.parse(readFileSync(join(ROOT, f), 'utf8'), { from: f }));
  } catch (e) {
    parsed.set(f, e as Error);
  }
}

/** selector -> merged outline declarations, across every SURF rule. */
const rules = new Map<string, Decls>();
for (const root of parsed.values()) {
  if (root instanceof Error) continue;
  root.walkRules((rule: Rule) => {
    for (const raw of rule.selectors) {
      const sel = raw.replace(/\s+/g, ' ').trim();
      const d = rules.get(sel) ?? { outlineNone: false };
      for (const node of rule.nodes) {
        if (node.type !== 'decl') continue;
        const prop = node.prop.toLowerCase();
        const value = node.value.trim();
        if (prop === 'outline' || prop === 'outline-style') {
          if (/^(none|0)$/i.test(value)) d.outlineNone = true;
          else if (prop === 'outline') d.outline = value;
        }
      }
      rules.set(sel, d);
    }
  });
}

const isTokenOutline = (v: string | undefined) => !!v && /var\(--_ag-focus-width\b/.test(v) && /\bsolid\b/.test(v);

describe('SURF focus CSS (REQ-SURF-193)', () => {
  it('scans and parses every SURF CSS file', () => {
    expect(files).toEqual(expect.arrayContaining(['src/charts/charts.css', 'src/date/date.css', 'src/app-shell/app-shell.css']));
    const broken = [...parsed].filter(([, r]) => r instanceof Error).map(([f, r]) => `${f}: ${(r as Error).message}`);
    expect(broken).toEqual([]);
  });

  it('every outline:none rule has a :focus-visible replacement painting the focus tokens', () => {
    const offenders: string[] = [];
    for (const [sel, d] of rules) {
      if (!d.outlineNone || /:focus-visible/.test(sel)) continue;
      if (!isTokenOutline(rules.get(`${sel}:focus-visible`)?.outline)) offenders.push(sel);
    }
    expect(offenders).toEqual([]);
  });

  it('no :focus-visible or focus-attribute rule removes the outline', () => {
    const offenders = [...rules]
      .filter(([sel, d]) => d.outlineNone && /:focus-visible|:focus\b|\[data-focus(ed|-visible)\]/.test(sel))
      .map(([sel]) => sel);
    expect(offenders).toEqual([]);
  });

  it('the app-shell scroll region pads both block edges from the sticky-chrome vars', () => {
    const root = parsed.get('src/app-shell/app-shell.css');
    expect(root).toBeInstanceOf(postcss.Root);
    const props = new Map<string, string>();
    (root as Root).walkRules((rule) => {
      if (rule.selectors.some((s) => s.replace(/\s+/g, ' ').trim() === ".ag-app-shell [data-ag-slot='main']")) {
        rule.walkDecls((decl) => { props.set(decl.prop, decl.value); });
      }
    });
    expect(props.get('scroll-padding-block-start')).toBe('var(--ag-scroll-padding-top, 0px)');
    expect(props.get('scroll-padding-block-end')).toBe('var(--ag-scroll-padding-bottom, 0px)');
  });
});
