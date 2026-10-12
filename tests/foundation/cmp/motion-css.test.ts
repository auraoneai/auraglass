/** @jest-environment node */
/* REQ-CMP-18 (motion) / REQ-CMP-94 (sheet snap): static checks over the CMP
   component sheets. The browser proof is tests/e2e/cmp/motion.spec.ts (L9);
   this pins the source so a regression fails in L12 without a browser.
   - every transition leg names an ANIMATABLE property (src/contracts/motion.ts);
     the one documented exception is the REQ-CMP-53 checkbox check path,
     which draws in via stroke-dashoffset on a non-part SVG <path>;
   - backdrop-filter / filter are never transitioned;
   - dialogs, alert dialogs and sheets exit on --ag-duration-medium-exit
     (full-height sheets --ag-duration-large-exit) with --ag-ease-accelerate;
   - toasts use the medium row (enter medium, exit medium-exit);
   - the sheet detent snap uses --ag-spring-smooth. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import postcss, { type Root } from 'postcss';
import { ANIMATABLE } from '../../../src/contracts/motion';

const ROOT = join(__dirname, '../../..');
const COMPONENTS = join(ROOT, 'src/components');

function componentSheets(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.css')) out.push(p);
    }
  };
  walk(COMPONENTS);
  return out.sort();
}

const parse = (rel: string): Root => postcss.parse(readFileSync(join(COMPONENTS, rel), 'utf8'));
const legs = (value: string) => value.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Declarations of `prop` in full-motion rules (not inside @media / @supports)
    whose selector list contains `selector`. */
function declsOf(ast: Root, selector: string, prop: string): string[] {
  const out: string[] = [];
  ast.walkRules((r) => {
    const p = r.parent;
    if (p && p.type === 'atrule' && (p as { name?: string }).name !== 'layer') return;
    if (r.selectors.map(norm).includes(selector)) r.walkDecls(prop, (d) => { out.push(norm(d.value)); });
  });
  return out;
}

const EXCEPTIONS = new Set(["checkbox/Checkbox.css .ag-checkbox[data-checked] [data-ag-part='icon'] path stroke-dashoffset"]);

describe('REQ-CMP-18 transitions list only ANIMATABLE properties', () => {
  const sheets = componentSheets();
  it('scans the component sheets', () => {
    expect(sheets.length).toBeGreaterThan(20);
  });

  it('no component transitions a non-ANIMATABLE property (or backdrop-filter / filter)', () => {
    const allowed = new Set<string>([...ANIMATABLE, 'none', 'all']);
    const offenders: string[] = [];
    for (const file of sheets) {
      const rel = file.slice(COMPONENTS.length + 1);
      postcss.parse(readFileSync(file, 'utf8')).walkDecls(/^transition(-property)?$/, (d) => {
        const sel = d.parent && 'selector' in d.parent ? norm(String(d.parent.selector)) : '';
        for (const leg of legs(d.value)) {
          const prop = d.prop === 'transition' ? leg.split(/\s+/)[0]! : leg;
          if (prop.startsWith('var(')) continue;
          if (allowed.has(prop) && prop !== 'all') continue;
          const key = `${rel} ${sel} ${prop}`;
          if (!EXCEPTIONS.has(key)) offenders.push(key);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});

describe('REQ-CMP-18 overlay exit and toast durations', () => {
  it.each([
    ['dialog/Dialog.css', '.ag-dialog-popup[data-ending-style]'],
    ['alert-dialog/AlertDialog.css', '.ag-alert-dialog-popup[data-ending-style]'],
    ['sheet/Sheet.css', '.ag-sheet-popup[data-ending-style]:not([data-dragging])'],
  ])('%s exits on --ag-duration-medium-exit with --ag-ease-accelerate', (file, selector) => {
    const ast = parse(file);
    const durations = declsOf(ast, selector, 'transition-duration');
    expect(durations.length).toBeGreaterThan(0);
    for (const d of durations) for (const leg of legs(d)) expect(leg).toBe('var(--ag-duration-medium-exit)');
    const eases = declsOf(ast, selector, 'transition-timing-function');
    expect(eases.length).toBeGreaterThan(0);
    for (const e of eases) for (const leg of legs(e)) expect(leg).toBe('var(--ag-ease-accelerate)');
  });

  it('full-height sheets exit on --ag-duration-large-exit', () => {
    const ast = parse('sheet/Sheet.css');
    expect(declsOf(ast, '.ag-sheet-popup[data-ag-appearance="full-height"][data-ending-style]:not([data-dragging])', 'transition-duration'))
      .toEqual(['var(--ag-duration-large-exit)']);
  });

  it('toasts enter on --ag-duration-medium and exit on --ag-duration-medium-exit', () => {
    const ast = parse('toast/Toast.css');
    const enter = declsOf(ast, '.ag-toast[data-open]', 'animation');
    const exit = declsOf(ast, '.ag-toast[data-ending]', 'animation');
    expect(enter).toEqual([expect.stringContaining('var(--ag-duration-medium) ')]);
    expect(exit).toEqual([expect.stringContaining('var(--ag-duration-medium-exit) var(--ag-ease-accelerate)')]);
  });
});

describe('REQ-CMP-94 sheet detent snap', () => {
  it('the snap transition (not dragging) uses --ag-spring-smooth for transform', () => {
    const snap = declsOf(parse('sheet/Sheet.css'), '.ag-sheet-popup:not([data-dragging])', 'transition');
    expect(snap).toHaveLength(1);
    const transform = legs(snap[0]!).find((l) => l.startsWith('transform '));
    expect(transform).toBe('transform var(--ag-duration-medium) var(--ag-spring-smooth)');
  });

  it('only the handle sets touch-action: none', () => {
    const owners: string[] = [];
    parse('sheet/Sheet.css').walkDecls('touch-action', (d) => {
      if (d.value.trim() === 'none' && d.parent && 'selector' in d.parent) owners.push(norm(String(d.parent.selector)));
    });
    expect(owners.length).toBeGreaterThan(0);
    for (const o of owners) expect(o).toMatch(/handle/);
  });
});
