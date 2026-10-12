/* @jest-environment node */
/* PLAT-261/262, REQ-PLAT-69: build/server-safe-exports.json is generated from
   every ComponentMeta with rsc:'server' plus cn, tokens and icon glyphs. For
   EACH safe module the graph reached under the react-server condition,
   without crossing a 'use client' boundary, imports no client signal (the
   use-client-required signal set, whole files) and no SSR shim; bare imports
   resolve with ['react-server', 'import', 'default']. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import * as sse from '../../../scripts/build/server-safe.mjs';
import { ROOT } from '../../build/helpers';

const RECORD = join(ROOT, 'build', 'server-safe-exports.json');
const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
type Row = { module: string; from: 'meta' | 'foundation'; meta?: string; safe: boolean; reason?: string };

describe('server-safe exports record (PLAT-261)', () => {
  it('is up to date (server-safe.mjs --check)', () => {
    execFileSync('node', ['scripts/build/server-safe.mjs', '--check'], { cwd: ROOT });
  });
  it('lists every manifest JS entry', async () => {
    const { manifestEntries } = await import('../../../scripts/build/lib/graph.mjs');
    const subs = new Set(rec.entries.map((e: { subpath: string }) => e.subpath));
    for (const e of manifestEntries(ROOT).js) expect(subs.has(e.subpath)).toBe(true);
  });
  it("has one module row per rsc:'server' meta plus the cn/tokens/glyph foundations", () => {
    const rows = rec.modules as Row[];
    const serverMetas = (rec.meta as { name: string; rsc?: string }[]).filter((m) => m.rsc === 'server').map((m) => m.name).sort();
    expect(rows.filter((r) => r.from === 'meta').map((r) => r.meta).sort()).toEqual(serverMetas);
    const foundations = rows.filter((r) => r.from === 'foundation').map((r) => r.module);
    expect(foundations).toContain('src/internal/cn.ts');
    expect(foundations.some((m) => m.startsWith('src/tokens/'))).toBe(true);
    expect(foundations.some((m) => /^src\/icons\/[a-z-]+\/[a-z-]+\.tsx$/.test(m))).toBe(true);
    expect(rows.filter((r) => !r.safe).every((r) => typeof r.reason === 'string' && r.reason.length > 0)).toBe(true);
    expect(rec.safeModules).toEqual([...new Set(rows.filter((r) => r.safe).map((r) => r.module))].sort());
  });
  it('the closure of each safe module is free of client signals and SSR shims (recomputed)', () => {
    const bad: string[] = [];
    for (const m of rec.safeModules as string[]) {
      const g = sse.serverGraph(join(ROOT, m), ROOT);
      if (!g.safe) bad.push(`${m}: ${g.reason}`);
      expect(g.files.size).toBeGreaterThan(0);
    }
    expect(bad).toEqual([]);
  });
  it("react-server hooks come from React's react-server build", () => {
    const hooks = sse.reactServerHooks(ROOT);
    expect(hooks).toContain('useId');
    expect(hooks).not.toContain('useState');
    expect(hooks).not.toContain('useEffect');
  });
});

describe('serverGraph on fixtures (REQ-PLAT-69)', () => {
  const root = mkdtempSync(join(tmpdir(), 'ag-server-graph-'));
  const put = (rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
  // fake packages: one with a react-server export, one without
  put('node_modules/srv-pkg/package.json', JSON.stringify({ name: 'srv-pkg', exports: { '.': { 'react-server': './server.js', default: './index.js' } } }));
  put('node_modules/srv-pkg/server.js', 'export const x = 1;\n');
  put('node_modules/srv-pkg/index.js', 'export const x = 2;\n');
  put('node_modules/browser-pkg/package.json', JSON.stringify({ name: 'browser-pkg', exports: { '.': { browser: './b.js' } } }));
  put('node_modules/browser-pkg/b.js', 'export const y = 1;\n');
  put('src/deep/hook.ts', "import { useState } from 'react';\nexport const useX = () => useState(0);\n");
  put('src/deep/dom.ts', 'export const w = () => window.innerWidth;\n');
  put('src/deep/client.tsx', "'use client';\nimport { useState } from 'react';\nexport const C = () => { useState(0); return null; };\n");
  put('src/deep/shim.tsx', 'export const S = (p: { children: unknown }) => p.children;\nexport const AuraGlassSSRProvider = S;\n');
  put('src/deep/types.ts', "import { useState } from 'react';\nexport const v = () => useState(0);\n");
  put('src/a-signal.tsx', "import { useX } from './deep/hook';\nexport const A = () => useX();\n");
  put('src/a-dom.ts', "export { w } from './deep/dom';\n");
  put('src/a-boundary.tsx', "import { C } from './deep/client';\nexport const A = () => <C />;\n");
  put('src/a-shim.tsx', "import { S } from './deep/shim';\nexport const A = () => <S>{null}</S>;\n");
  put('src/a-typeonly.ts', "import type { v } from './deep/types';\nexport type V = typeof v;\n");
  put('src/a-srv.ts', "import { x } from 'srv-pkg';\nexport const a = x;\n");
  put('src/a-browser.ts', "import { y } from 'browser-pkg';\nexport const a = y;\n");
  put('src/a-deep-signal.ts', "export * from './a-signal';\n");
  const run = (f: string) => sse.serverGraph(join(root, f), root);

  it('a client hook deep in the closure (whole file, not a head) is unsafe', () => {
    const g = run('src/a-deep-signal.ts');
    expect(g.safe).toBe(false);
    expect(g.reason).toBe('client signal (call to useState()) in src/deep/hook.ts');
  });
  it('a DOM global is unsafe', () => {
    expect(run('src/a-dom.ts').reason).toBe('client signal (reference to window) in src/deep/dom.ts');
  });
  it("a 'use client' module is a boundary: reached, not walked", () => {
    const g = run('src/a-boundary.tsx');
    expect(g.safe).toBe(true);
    expect([...g.files].map((f) => f.slice(root.length + 1)).sort()).toEqual(['src/a-boundary.tsx', 'src/deep/client.tsx']);
  });
  it('an SSR shim is unsafe', () => {
    expect(run('src/a-shim.tsx').reason).toBe('SSR shim reachable: src/deep/shim.tsx');
  });
  it('type-only imports are not edges', () => {
    const g = run('src/a-typeonly.ts');
    expect(g.safe).toBe(true);
    expect(g.files.size).toBe(1);
  });
  it('bare imports resolve under react-server; a package without that export is unsafe', () => {
    expect(run('src/a-srv.ts').safe).toBe(true);
    expect(sse.resolveBare('srv-pkg', join(root, 'src/a-srv.ts'))).toEqual({ file: join(root, 'node_modules/srv-pkg/server.js') });
    expect(run('src/a-browser.ts').reason).toBe("'browser-pkg' is not exported under the react-server conditions (imported by src/a-browser.ts)");
  });
  it('exportsTarget follows Node condition order and patterns', () => {
    const exp = { '.': { 'react-server': './rs.js', import: './i.js' }, './x/*': { default: './dist/*.js' }, './y': { browser: './b.js' } };
    expect(sse.exportsTarget(exp, '.')).toBe('./rs.js');
    expect(sse.exportsTarget(exp, './x/a')).toBe('./dist/a.js');
    expect(sse.exportsTarget(exp, './y')).toBeNull();
    expect(sse.exportsTarget({ import: './i.js', 'react-server': './rs.js' }, '.')).toBe('./i.js'); // object order wins
  });
  afterAll(() => rmSync(root, { recursive: true, force: true }));
});
