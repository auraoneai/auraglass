/* tests/registry/lint.test.ts — PLAT-357: one seeded failing fixture per
   REQ-PLAT-95 rule, plus a clean fixture proving the allowlist shape. */
import { describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lint, lintFile } from '../../scripts/registry/lint.mjs';

const run = (src: string, opts: Partial<Parameters<typeof lintFile>[0]> = {}) =>
  lintFile({ file: 'index.tsx', rel: 'index.tsx', src, id: opts.id ?? 'x', deps: opts.deps ?? [], tailwind: opts.tailwind ?? false, ...opts });

describe('registry lint rules', () => {
  it('no-important', () => {
    expect(run('.a { color: red !important; }').some((v) => v.rule === 'no-important')).toBe(true);
    expect(run('/* mention of !important in prose is fine */').some((v) => v.rule === 'no-important')).toBe(false);
  });
  it('no-color-literal incl. var() fallbacks', () => {
    for (const s of ['#fff', '#a1b2c3d4', 'rgb(1 2 3)', 'hsl(10 50% 50%)', 'oklch(50% .1 200)', 'color-mix(in srgb, red 50%, blue)'])
      expect(run(`const c = '${s}';`).some((v) => v.rule === 'no-color-literal')).toBe(true);
    expect(run("const c = 'var(--ag-fill, #a1b2c3)';").some((v) => v.rule === 'no-color-literal')).toBe(true);
    expect(run("const c = 'var(--ag-on-surface)';").some((v) => v.rule === 'no-color-literal')).toBe(false);
  });
  it('no-inline-optics', () => {
    expect(run('const s = { backdropFilter: "blur(8px)" };').some((v) => v.rule === 'no-inline-optics')).toBe(true);
    expect(run('.a { filter: blur(2px); }').some((v) => v.rule === 'no-inline-optics')).toBe(true);
  });
  it('no-inline-optics-style', () => {
    expect(run('<div style={{ borderRadius: "0.5rem" }} />').some((v) => v.rule === 'no-inline-optics-style')).toBe(true);
    expect(run('<div style={{ inlineSize: "100%" }} />').some((v) => v.rule === 'no-inline-optics-style')).toBe(false);
  });
  it('import-allowlist', () => {
    expect(run("import { Button } from 'aura-glass';", { deps: [] })).toEqual([]);
    expect(run("import x from '@dnd-kit/core';", { deps: ['@dnd-kit/core@^6'] })).toEqual([]);
    expect(run("import x from 'lodash';", { deps: [] }).some((v) => v.rule === 'import-allowlist')).toBe(true);
    expect(run("import { Meta } from '@storybook/react';", { rel: 'x.stories.tsx', deps: [] })).toEqual([]);
  });
  it('declared-dep-imported', () => {
    const root = mkdtempSync(join(tmpdir(), 'ag-lint-'));
    const dir = join(root, 'registry', 'items', 'x');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'registry-item.json'), JSON.stringify({ name: 'x', type: 'registry:item', dependencies: ['@dnd-kit/core@^6'], meta: { auraglass: { components: [] } } }));
    writeFileSync(join(dir, 'index.tsx'), 'export const X = () => null;\n');
    const v = lint({ root });
    expect(v.some((x) => x.rule === 'declared-dep-imported')).toBe(true);
    rmSync(root, { recursive: true });
  });
  it('no-const-controlled', () => {
    expect(run('<input value={"fixed"} onChange={() => {}} />').some((v) => v.rule === 'no-const-controlled')).toBe(true);
    expect(run('<input value={CONST} onChange={noop} />').some((v) => v.rule === 'no-const-controlled')).toBe(true);
    expect(run('<input value={"fixed"} />').some((v) => v.rule === 'no-const-controlled')).toBe(true);
    expect(run('<input value={v} onChange={(e) => set(e.target.value)} />').some((v) => v.rule === 'no-const-controlled')).toBe(false);
  });
  it('no-api-key', () => {
    expect(run('const k = process.env.STRIPE_API_KEY;').some((v) => v.rule === 'no-api-key')).toBe(true);
    expect(run("const k = process.env.PRISM_API_KEY;", { rel: 'app/api/ai/route.ts', file: 'registry/blocks/x/app/api/ai/route.ts' })).toEqual([]);
    expect(run("const k = process.env.PRISM_API_KEY;", { rel: 'app/api/ai/route.test.ts', file: 'x/route.test.ts' })).toEqual([]);
  });
  it('no-client-key', () => {
    expect(run("const k = process.env.NEXT_PUBLIC_STRIPE_KEY;", { rel: 'index.tsx' }).some((v) => v.rule === 'no-client-key')).toBe(true);
  });
  it('no-copy-filler (example.com allowed in auth)', () => {
    expect(run('<p>Lorem ipsum dolor sit amet</p>').some((v) => v.rule === 'no-copy-filler')).toBe(true);
    expect(run('<p>Email user@example.com</p>', { id: 'auth' })).toEqual([]);
  });
  it('no-viewport-class (unless Tailwind v4 project)', () => {
    expect(run('<div className="sm:grid-cols-2" />').some((v) => v.rule === 'no-viewport-class')).toBe(true);
    expect(run('<div className="sm:grid-cols-2" />', { tailwind: true })).toEqual([]);
    expect(run('<div className="@sm:grid-cols-2" />', {})).toEqual([]);
  });
  it('no-legacy-selector', () => {
    expect(run('<div className="glass-sidebar-rail" />').some((v) => v.rule === 'no-legacy-selector')).toBe(true);
    expect(run('<div className="glass-app-shell__body" />').some((v) => v.rule === 'no-legacy-selector')).toBe(true);
  });
  it('meta-components: blocks list every aura-glass import', () => {
    const root = mkdtempSync(join(tmpdir(), 'ag-lint-'));
    const dir = join(root, 'registry', 'blocks', 'x');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'registry-item.json'), JSON.stringify({ name: 'x', type: 'registry:block', meta: { auraglass: { components: ['Button'] } } }));
    writeFileSync(join(dir, 'index.tsx'), "import { Button, Card } from 'aura-glass';\nexport const X = () => null;\n");
    const v = lint({ root });
    expect(v.some((x) => x.rule === 'meta-components' && x.excerpt.includes('Card'))).toBe(true);
    rmSync(root, { recursive: true });
  });
});
