/* REQ-QUAL-29 L11 consumer canaries: the planning and verdict rules of certification/lanes/_fixtures/canaries.ts that
   certification/lanes/canaries.spec.ts applies in the browser lane (no browser, no install here). */
import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  SMOKE_APP, canaryApps, consumer4xMissing, countTodos, installedAuraGlass, missingStreamPages, nextRoutes, ownAssertion,
  readFlagshipSubset, routeVerdict,
} from '../../../certification/lanes/_fixtures/canaries.ts';
import { loadRegistrations, selectRows } from '../src/evidence/laneRunner.ts';
import { REPO } from './helpers/laneFixture.ts';

const made: string[] = [];
afterAll(() => { for (const d of made.splice(0)) rmSync(d, { recursive: true, force: true }); });
const tree = (files: Record<string, string>) => {
  const d = mkdtempSync(join(tmpdir(), 'ag-l11-'));
  made.push(d);
  for (const [rel, text] of Object.entries(files)) { mkdirSync(dirname(join(d, rel)), { recursive: true }); writeFileSync(join(d, rel), text); }
  return d;
};

describe('canary discovery (this repository)', () => {
  it('lists every canaries/<app> with a package.json, never canaries/_shared', () => {
    const apps = canaryApps(REPO);
    expect(apps).toEqual(expect.arrayContaining([SMOKE_APP, 'next15', 'vite', 'types-strict', 'jest-cjs']));
    expect(apps).not.toContain('_shared');
  });

  it('enumerates the next16 App Router routes, including the per-stream pages', () => {
    const { routes, dynamic } = nextRoutes(join(REPO, 'canaries', SMOKE_APP));
    expect(routes).toEqual(expect.arrayContaining(['/plat/empty', '/cmp/server', '/surf/app-shell', '/data-client']));
    expect(dynamic).toEqual([]);
    // streams without a page are reported (pending before release, fail at release in the spec)
    expect(missingStreamPages(join(REPO, 'canaries', SMOKE_APP))).toEqual(expect.not.arrayContaining(['plat', 'cmp', 'surf']));
  });

  it('is registered on L11 as a remote fail-closed playwright row', async () => {
    const regs = await loadRegistrations(REPO);
    expect(selectRows(regs.rows, 'L11', 'pr')).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'certification/lanes/canaries.spec.ts', kind: 'playwright', remote: true, failClosed: true, stream: 'qual' }),
    ]));
  });
});

describe('route planning', () => {
  it('drops route groups and private folders, reports dynamic segments, maps app/page to /', () => {
    const d = tree({
      'app/page.tsx': '', 'app/(marketing)/about/page.tsx': '', 'app/_private/x/page.tsx': '', 'app/qual/lab/page.mdx': '',
      'app/blog/[slug]/page.tsx': '', 'app/plat/layout.tsx': '',
    });
    expect(nextRoutes(d)).toEqual({ routes: ['/', '/about', '/qual/lab'], dynamic: ['app/blog/[slug]/page.tsx'] });
    expect(missingStreamPages(d)).toEqual(['plat', 'mat', 'cmp', 'surf']); // a layout without a page is no page
  });
});

describe('route verdict: HTTP 200 and 0 console errors', () => {
  it('passes a clean 200 and fails a missing route, a 500 and console errors', () => {
    expect(routeVerdict({ route: '/plat/empty', engine: 'webkit', status: 200, consoleErrors: [] })).toEqual([]);
    expect(routeVerdict({ route: '/nope', engine: 'chromium', status: 404, consoleErrors: [] })).toEqual(['/nope @chromium: HTTP 404 (expected 200)']);
    expect(routeVerdict({ route: '/x', engine: 'firefox', status: null, consoleErrors: ['Hydration failed'] })).toEqual([
      '/x @firefox: HTTP no response (expected 200)', '/x @firefox: console error: Hydration failed']);
  });
});

describe('installed from the tarball, never a symlink', () => {
  it('accepts a package directory and rejects a symlink and a missing install', () => {
    const real = tree({ 'node_modules/aura-glass/package.json': '{"name":"aura-glass"}' });
    expect(installedAuraGlass(real)).toBeNull();
    const linked = tree({ 'pkg/package.json': '{"name":"aura-glass"}', 'node_modules/.keep': '' });
    symlinkSync(join(linked, 'pkg'), join(linked, 'node_modules', 'aura-glass'));
    expect(installedAuraGlass(linked)).toMatch(/is a symlink/);
    expect(installedAuraGlass(tree({ 'package.json': '{}' }))).toMatch(/is not installed/);
  });

  it('own assertions: test, else check; none is null', () => {
    expect(ownAssertion({ scripts: { build: 'x', test: 'playwright test' } })).toBe('test');
    expect(ownAssertion({ scripts: { check: 'tsc --noEmit' } })).toBe('check');
    expect(ownAssertion({ scripts: { build: 'vite build' } })).toBeNull();
  });
});

describe('consumer-4x after migrate 4to5', () => {
  it('counts TODO(aura-glass 5) markers on the flagship subset only', () => {
    const d = tree({
      'flagship-subset.json': JSON.stringify(['app/a.tsx', 'app/b.tsx']),
      'app/a.tsx': '// TODO(aura-glass 5): x, see y\n// TODO(aura-glass 5): z, see y\n', 'app/b.tsx': 'ok', 'app/other.tsx': '// TODO(aura-glass 5): q, see y',
    });
    const subset = readFlagshipSubset(d)!;
    expect(countTodos(d, subset)).toEqual({ total: 2, perFile: { 'app/a.tsx': 2, 'app/b.tsx': 0 }, missing: [] });
    expect(countTodos(d, ['app/gone.tsx']).missing).toEqual(['app/gone.tsx']);
    expect(readFlagshipSubset(tree({ 'flagship-subset.json': JSON.stringify({ files: ['a'] }) }))).toEqual(['a']);
    expect(() => readFlagshipSubset(tree({ 'flagship-subset.json': '[]' }))).toThrow(/must list the flagship files/);
    expect(readFlagshipSubset(tree({}))).toBeNull();
  });

  it('names what the fixture still lacks (pending before release, fail at release in the spec)', () => {
    const missing = consumer4xMissing(REPO);
    // tests/fixtures/consumer-4x is PLAT's (REQ-PLAT-63); on this line it has usage cases but no harness yet
    for (const m of missing) expect(m).toMatch(/^tests\/fixtures\/consumer-4x\/(package\.json|flagship-subset\.json)/);
    const ready = tree({ 'tests/fixtures/consumer-4x/package.json': '{"scripts":{"build":"next build"}}', 'tests/fixtures/consumer-4x/flagship-subset.json': '["a"]' });
    expect(consumer4xMissing(ready)).toEqual([]);
    expect(consumer4xMissing(tree({ 'tests/fixtures/consumer-4x/package.json': '{}' }))).toEqual([
      'tests/fixtures/consumer-4x/package.json scripts.test|check|build', 'tests/fixtures/consumer-4x/flagship-subset.json']);
  });
});
