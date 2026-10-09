/* @jest-environment node */
/* REQ-CMP-09: every CMP/SURF-adjacent component CSS file obeys the layer
   contract — LAYER_ORDER_STATEMENT first, exactly one @layer ag.components
   block, no :root, no element selectors, only PUBLIC_CSS_VARS / MOTION_CSS_VARS
   or --_ag-<component>-* names, and every file declared in fragments/css. */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LAYER_ORDER_STATEMENT, PUBLIC_CSS_VARS } from '../../src/contracts/tokens';
import { MOTION_CSS_VARS } from '../../src/contracts/motion';

const PUBLIC = new Set([
  ...Object.values(PUBLIC_CSS_VARS).flatMap((v) => v as readonly string[]),
  ...MOTION_CSS_VARS,
]);
const BU_RUNTIME = new Set([
  '--available-height', '--available-width', '--transform-origin',
  '--anchor-width', '--anchor-height', '--toast-index', '--ff-delay',
]);

function* walk(dir: string): Generator<string> {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}
const FILES = [...walk('src/components'), ...walk('src/icons'), ...walk('src/primitives')];
const stripComments = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

const ELEMENT_SEL = /(^|[},]\s*|\n\s*)(div|span|button|input|ul|ol|li|a|p|h[1-6]|img|svg|path|section|article|header|footer|nav|main|aside|form|label|fieldset|legend|table|thead|tbody|tr|td|th|select|option|textarea|kbd|code|pre)\b(?![\w-]*[.[:]|\w*-])/g;

describe('css-contract (REQ-CMP-09)', () => {
  it('covers every component css file (>=64 files)', () => {
    expect(FILES.length).toBeGreaterThanOrEqual(60);
  });

  it.each(FILES.map((f) => [f]))('%s: first statement is LAYER_ORDER_STATEMENT', (f) => {
    const text = readFileSync(f as string, 'utf8');
    expect(text.startsWith(LAYER_ORDER_STATEMENT)).toBe(true);
  });

  it.each(FILES.map((f) => [f]))('%s: exactly one @layer ag.components block', (f) => {
    const text = readFileSync(f as string, 'utf8');
    expect(text.match(/@layer\s+ag\.components\s*\{/g) ?? []).toHaveLength(1);
  });

  it.each(FILES.map((f) => [f]))('%s: no :root selector', (f) => {
    expect(readFileSync(f as string, 'utf8')).not.toMatch(/:root\b/);
  });

  it.each(FILES.map((f) => [f]))('%s: no bare element selectors', (f) => {
    const text = stripComments(readFileSync(f as string, 'utf8'));
    const hits = [...text.matchAll(ELEMENT_SEL)].map((m) => m[0].trim().slice(0, 60));
    expect(hits).toEqual([]);
  });

  it.each(FILES.map((f) => [f]))('%s: only public/motion/--_ag-<comp>-* var names', (f) => {
    const text = stripComments(readFileSync(f as string, 'utf8'));
    const bad = new Set<string>();
    for (const m of text.matchAll(/--[\w-]+/g)) {
      const n = m[0];
      if (n.startsWith('--_ag-') || n.startsWith('--ag-')) {
        if (PUBLIC.has(n) || BU_RUNTIME.has(n)) continue;
        if (n.startsWith('--_ag-')) continue; // private namespace
        bad.add(n);
      }
    }
    expect([...bad].sort()).toEqual([]);
  });

  it('every file is declared in fragments/css/{cmp,surf}.ts', () => {
    const cmp = readFileSync('fragments/css/cmp.ts', 'utf8');
    const surf = readFileSync('fragments/css/surf.ts', 'utf8');
    const listed = new Set(
      [...(cmp + surf).matchAll(/'(src\/[^']+\.css)'/g)].map((m) => m[1]),
    );
    const missing = FILES.filter((f) => !listed.has(f));
    expect(missing).toEqual([]);
  });
});
