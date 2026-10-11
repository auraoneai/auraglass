/** REQ-FIN-08 (QUAL-69): the S-40 helper contract — all 9 exports: S-01
    attributes on the document root, awaited hydration, banned-attribute scan,
    gotoStory URL + readiness, listSubjects manifest/index/ownership/throw,
    perf rAF cleanup + bci delegation/pending, apg and scenes re-exports. */
import { afterEach, describe, it, expect, jest } from '@jest/globals';
import * as React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import {
  renderAg, renderAgServer, expectParts, expectNoBannedAttributes,
  gotoStory, listSubjects, perf, apg, scenes,
} from '../index';
import { apg as harnessApg } from '../../a11y/apg/harness';
import { SCENES } from '../../../src/contracts/testing';

describe('renderAg', () => {
  it('stamps the S-01 environment attribute set on document.documentElement', () => {
    const r = renderAg(React.createElement('div'), {
      scheme: 'dark', contrast: 'more', transparency: 'solid', motion: 'calm', tier: 'enhanced',
    });
    const html = document.documentElement;
    expect(html.getAttribute('data-ag-root')).toBe('');
    expect(html.getAttribute('data-ag-scheme')).toBe('dark');
    expect(html.getAttribute('data-ag-contrast')).toBe('more');
    expect(html.getAttribute('data-ag-transparency')).toBe('solid');
    expect(html.getAttribute('data-ag-motion')).toBe('calm');
    expect(html.getAttribute('data-ag-tier')).toBe('enhanced');
    r.unmount();
    expect(html.hasAttribute('data-ag-root')).toBe(false);
    expect(html.hasAttribute('data-ag-scheme')).toBe(false);
  });

  it('maps backdrop env onto the S-01 data-ag-backdrop attribute', () => {
    const r = renderAg(React.createElement('div'), { backdrop: 'photo' as never, provider: false });
    expect(document.documentElement.getAttribute('data-ag-backdrop')).toBe('photo');
    r.unmount();
  });

  it('provider=false renders without AuraGlassProvider', () => {
    const r = renderAg(React.createElement('div', { 'data-x': '1' }), { provider: false });
    expect(r.container.querySelector('[data-ag-provider]')).toBeNull();
  });
});

describe('renderAgServer', () => {
  it('returns html and a hydrate() that resolves after hydration ran', async () => {
    const ui = React.createElement('div', { 'data-x': 'y' }, 'hello');
    const { html, hydrate } = renderAgServer(ui);
    expect(html).toContain('hello');
    const { warnings } = await hydrate();
    expect(Array.isArray(warnings)).toBe(true);
  });
});

describe('expectParts / expectNoBannedAttributes', () => {
  it('expectParts matches the declared part set exactly', () => {
    const r = renderAg(
      React.createElement('div', null,
        React.createElement('span', { 'data-ag-part': 'root' }),
        React.createElement('span', { 'data-ag-part': 'icon' })),
      { provider: false },
    );
    expectParts(r.container, { parts: ['root', 'icon'] });
    expect(() => expectParts(r.container, { parts: ['root'] })).toThrow();
  });

  it('expectNoBannedAttributes fails on a banned attribute', () => {
    const r = renderAg(React.createElement('div', { 'data-ag-seed': 'x' }), { provider: false });
    expect(() => expectNoBannedAttributes(r.container)).toThrow();
    const ok = renderAg(React.createElement('div'), { provider: false });
    expectNoBannedAttributes(ok.container);
  });
});

describe('listSubjects', () => {
  const prevUrl = process.env.AG_STORYBOOK_URL;
  const prevFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = prevFetch;
    if (prevUrl === undefined) delete process.env.AG_STORYBOOK_URL; else process.env.AG_STORYBOOK_URL = prevUrl;
  });

  /** fetch double serving only the given paths under AG_STORYBOOK_URL. */
  const serve = (routes: Record<string, unknown>) => {
    process.env.AG_STORYBOOK_URL = 'http://sb.test';
    const calls: string[] = [];
    globalThis.fetch = (async (url: string) => {
      calls.push(String(url));
      const key = String(url).replace('http://sb.test/', '');
      if (!(key in routes)) return { ok: false, status: 404, json: async () => ({}) };
      return { ok: true, status: 200, json: async () => routes[key] };
    }) as unknown as typeof fetch;
    return calls;
  };

  it('throws when no subject index is reachable', async () => {
    process.env.AG_STORYBOOK_URL = 'http://127.0.0.1:1'; // nothing listens
    await expect(listSubjects()).rejects.toThrow(/no subject index reachable/);
  });

  it('throws when the manifest is absent and index.json is empty', async () => {
    serve({ 'index.json': { entries: {} } });
    await expect(listSubjects()).rejects.toThrow(/no subject index reachable/);
  });

  it('reads cert-manifest.json when present and applies the filter', async () => {
    const calls = serve({
      'cert-manifest.json': {
        version: 1,
        stories: [
          { id: 'cmp-button--default', subject: 'Button', kind: 'component', tags: ['cert'], owner: 'CMP' },
          { id: 'surf-app-shell--default', subject: 'AppShell', kind: 'block', tags: ['cert', 'no-cert'], owner: 'SURF' },
        ],
      },
    });
    expect((await listSubjects()).map((s) => s.id)).toEqual(['cmp-button--default', 'surf-app-shell--default']);
    expect((await listSubjects({ owner: 'SURF' })).map((s) => s.id)).toEqual(['surf-app-shell--default']);
    expect((await listSubjects({ tags: ['no-cert'] })).map((s) => s.id)).toEqual(['surf-app-shell--default']);
    expect((await listSubjects({ kind: 'component' })).map((s) => s.id)).toEqual(['cmp-button--default']);
    expect(calls.every((u) => u === 'http://sb.test/cert-manifest.json')).toBe(true);
  });

  it('falls back to index.json and derives owner from contracts/ownership.json by story path', async () => {
    serve({
      'index.json': {
        entries: {
          a: { id: 'cmp-button--default', title: 'Components/Button', importPath: './src/components/button/Button.stories.tsx', tags: ['cert'] },
          b: { id: 'surf-app-shell--default', title: 'App Shell/AppShell', importPath: './src/app-shell/AppShell.stories.tsx', tags: [] },
          c: { id: 'surf-tabs--default', title: 'Navigation/Tabs', importPath: './src/components/tabs/Tabs.stories.tsx', tags: [] },
          d: { id: 'mat-floors--default', title: 'Material/Floors', importPath: './stories/mat/Floors.stories.tsx', tags: [] },
        },
      },
    });
    const owners = Object.fromEntries((await listSubjects()).map((s) => [s.id, s.owner]));
    expect(owners).toEqual({
      'cmp-button--default': 'CMP',
      'surf-app-shell--default': 'SURF',
      'surf-tabs--default': 'SURF', // C04 row precedes the C05 src/components/** CMP row
      'mat-floors--default': 'MAT',
    });
  });
});

describe('gotoStory', () => {
  it('navigates with ag-cert=1, filtered globals, and waits for the readiness token', async () => {
    const urls: string[] = [];
    const waited: string[] = [];
    const page = {
      goto: async (u: string) => { urls.push(u); },
      waitForSelector: async (s: string) => { waited.push(s); },
      addStyleTag: async () => undefined,
    };
    await gotoStory(page as never, 'cmp-button--default', { scheme: 'dark', forcedColors: true, scene: 'photo' });
    const u = new URL(urls[0]!);
    expect(u.pathname).toBe('/iframe.html');
    expect(u.searchParams.get('id')).toBe('cmp-button--default');
    expect(u.searchParams.get('ag-cert')).toBe('1');
    expect(u.searchParams.get('globals')).toBe('scheme:dark;scene:photo');
    expect(waited).toEqual(['[data-ag-cert-ready]']);
  });
});

describe('perf', () => {
  /** page double whose evaluate() runs the page function in this jsdom window. */
  const jsdomPage = () => ({
    evaluate: async (fn: () => unknown) => fn(),
    waitForTimeout: (ms: number) => new Promise((r) => setTimeout(r, ms)),
  });

  it('frames() cancels its own rAF loop and disconnects the observer', async () => {
    const g = globalThis as unknown as { PerformanceObserver?: unknown };
    const prevPO = g.PerformanceObserver;
    let disconnected = 0;
    g.PerformanceObserver = class { observe() {} disconnect() { disconnected++; } };
    const cancelled: number[] = [];
    const prevCaf = window.cancelAnimationFrame;
    window.cancelAnimationFrame = (id: number) => { cancelled.push(id); prevCaf.call(window, id); };
    try {
      const r = await perf.frames(jsdomPage() as never, { durationMs: 60 });
      expect(typeof r.p95Ms).toBe('number');
      expect(r.longTasks).toBe(0);
      const rec = (window as unknown as { __agFrames: { rafId: number } }).__agFrames;
      expect(cancelled).toContain(rec.rafId);
      expect(disconnected).toBe(1);
    } finally {
      window.cancelAnimationFrame = prevCaf;
      g.PerformanceObserver = prevPO;
    }
  });

  const QA_BCI = path.join(__dirname, '..', '..', '..', 'packages', 'qa', 'src', 'perf', 'bci.ts');
  /** Pins existsSync(QA_BCI) so both producer states are exercised on any line. */
  const withQaBci = (present: boolean) => {
    const real = fs.existsSync;
    return jest.spyOn(fs, 'existsSync').mockImplementation((p: fs.PathLike) => (String(p) === QA_BCI ? present : real(p)));
  };
  afterEach(() => { jest.restoreAllMocks(); });

  it('bci() raises a pending-producer error while packages/qa/src/perf/bci.ts is absent', async () => {
    withQaBci(false);
    await expect(perf.bci({} as never)).rejects.toMatchObject({ name: 'AgPendingProducer', message: expect.stringMatching(/^pending: perf\.bci needs packages\/qa\/src\/perf\/bci\.ts/) });
  });

  it('bci() delegates to packages/qa/src/perf/bci.ts once it exists', async () => {
    withQaBci(true);
    const seen: unknown[] = [];
    jest.doMock(QA_BCI, () => ({ bci: async (page: unknown) => { seen.push(page); return 0.25; } }), { virtual: true });
    const page = { marker: 1 };
    await expect(perf.bci(page as never)).resolves.toBe(0.25);
    expect(seen).toEqual([page]);
  });
});

describe('apg / scenes', () => {
  it('re-exports the QUAL APG harness and the contract scene list', () => {
    expect(apg).toBe(harnessApg);
    expect(typeof apg.keyboard).toBe('function');
    expect(typeof apg.axe).toBe('function');
    expect(scenes).toBe(SCENES);
  });
});
