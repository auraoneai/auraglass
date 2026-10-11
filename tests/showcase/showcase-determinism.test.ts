/** @jest-environment node */
/* tests/showcase/showcase-determinism.test.ts — REQ-QUAL-59 determinism (FIN-G G-27, REQ-FIN-107, FIN-455).
 *
 * For every showcase in showcase/showcases.json (all 10), its full page and every story (full page + fragments):
 *   - the page component takes a `now` prop whose default is the showcase's fixed SHOWCASE_EPOCH (copy.ts), so
 *     every time-derived value comes from the fixed epoch;
 *   - two server renders produce byte-identical HTML, and rendering every fragment in between does not change
 *     the page's HTML (no module-level counters or caches leak between renders);
 *   - rendering with `now` = the epoch equals rendering with the default, and a second epoch renders identically
 *     twice;
 *   - nothing calls Math.random, Date.now, performance.now, crypto.randomUUID/getRandomValues, fetch,
 *     XMLHttpRequest, WebSocket or EventSource while rendering (each is trapped and recorded with its stack);
 *   - the static scan (scripts/storybook/verify-showcase-imports.mjs) reports no determinism violation.
 * Server rendering is what Storybook's first paint and the capture lanes see before effects run. */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ROOT, SHOWCASES, installShowcaseModuleMap, loadShowcase, showcaseEpoch, showcaseStories } from './harness';
import * as probes from './__probe__/probes';

installShowcaseModuleMap(jest);

type Trap = { name: string; stack: string };
const esc = (p: string) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// tests/showcase/__probe__/ holds the trap self-test's components, which prove a call inside a rendering component
// is caught.
const OWN_FRAME = new RegExp(`${esc(ROOT)}/(?:showcase|registry|src|tests/showcase/__probe__)/`);
const traps: Trap[] = [];
const restores: Array<() => void> = [];

function trap<T extends object>(obj: T, key: string, name: string, impl: (...a: unknown[]) => unknown): void {
  const target = obj as Record<string, unknown>;
  const had = Object.prototype.hasOwnProperty.call(target, key);
  const original = target[key];
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value: (...args: unknown[]) => {
      // Attributed to the showcase when any frame is showcase, registry-block or library code (React's own
      // scheduler timing inside react-dom is not render output and is not counted).
      const frames = (new Error(name).stack ?? '').split('\n').slice(2);
      const own = frames.filter((l) => OWN_FRAME.test(l));
      if (own.length) traps.push({ name, stack: own.slice(0, 6).join('\n') });
      return impl(...args);
    },
  });
  restores.push(() => {
    if (had) Object.defineProperty(target, key, { configurable: true, writable: true, value: original });
    else delete target[key];
  });
}

/** Installs the traps only around one render, so test-framework timing is never counted. */
function withTraps<T>(fn: () => T): { value: T; calls: Trap[] } {
  traps.length = 0;
  const realRandom = Math.random.bind(Math);
  const realNow = Date.now.bind(Date);
  trap(Math, 'random', 'Math.random', () => realRandom());
  trap(Date, 'now', 'Date.now', () => realNow());
  if (globalThis.performance) trap(globalThis.performance, 'now', 'performance.now', () => 0);
  if (globalThis.crypto) {
    trap(globalThis.crypto, 'randomUUID', 'crypto.randomUUID', () => '00000000-0000-4000-8000-000000000000');
    trap(globalThis.crypto, 'getRandomValues', 'crypto.getRandomValues', (a) => a);
  }
  for (const g of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource']) {
    trap(globalThis, g, g, () => { throw new Error(`${g} called while rendering a showcase`); });
  }
  try {
    return { value: fn(), calls: [...traps] };
  } finally {
    while (restores.length) restores.pop()!();
  }
}

type Comp = (props: Record<string, unknown>) => unknown;
const html = (C: Comp, props: Record<string, unknown> = {}) => renderToString(React.createElement(C as React.FC, props));

beforeEach(() => { traps.length = 0; });
afterEach(() => { while (restores.length) restores.pop()!(); });

describe('trap self-test', () => {
  it.each([
    ['Math.random', probes.RandomProbe],
    ['Date.now', probes.ClockProbe],
    ['fetch', probes.FetchProbe],
  ])('records %s called while rendering', (name, Probe) => {
    const r = withTraps(() => renderToString(React.createElement(Probe)));
    expect(r.calls.map((c) => c.name)).toContain(name);
  });
});

describe('showcase manifest coverage', () => {
  it('covers the ten REQ-QUAL-58 showcases', () => {
    expect(SHOWCASES.map((s) => s.id).sort()).toEqual([
      'ai-command-center', 'analytics', 'collaborative-workspace', 'ecommerce', 'financial-dashboard',
      'media-workspace', 'mobile-productivity', 'music-player', 'ops-console', 'spatial-control-center',
    ]);
  });
});

describe.each(SHOWCASES.map((s) => [s.id, s] as const))('%s', (_id, entry) => {
  const mod = loadShowcase(entry, require);
  const epoch = showcaseEpoch(entry, require);
  const page = mod[entry.component] as Comp;
  const stories = showcaseStories(entry, require);

  it('exports the page component; its stories are the full page plus 2-4 fragments', () => {
    expect(typeof page).toBe('function');
    expect(stories.length).toBeGreaterThanOrEqual(3);
    expect(stories.length).toBeLessThanOrEqual(5);
  });

  it('uses a fixed epoch (whole seconds, not the wall clock) as the `now` default', () => {
    expect(Number.isInteger(epoch)).toBe(true);
    expect(epoch % 1000).toBe(0);
    expect(html(page, { now: epoch })).toBe(html(page));
  });

  it.each(stories.map(([n, C]) => [n, C] as const))('story %s renders identical HTML twice without non-deterministic calls', (_name, C) => {
    const a = withTraps(() => html(C as Comp));
    const b = withTraps(() => html(C as Comp));
    expect(a.calls).toEqual([]);
    expect(b.calls).toEqual([]);
    // Portal-only stories (sheets) server-render to an empty string; their client DOM is compared in
    // showcase-a11y.test.tsx. The page itself must render content.
    expect(b.value).toBe(a.value);
  });

  it('server-renders the full page with content', () => {
    expect(html(page).length).toBeGreaterThan(1000);
  });

  it('leaks no module state between renders (page, every fragment, page again)', () => {
    const first = html(page);
    for (const [, C] of stories) html(C as Comp);
    expect(html(page)).toBe(first);
  });

  it('renders a second epoch deterministically', () => {
    const later = epoch + 86_400_000 * 3 + 3_600_000;
    const a = withTraps(() => html(page, { now: later }));
    const b = withTraps(() => html(page, { now: later }));
    expect(a.calls).toEqual([]);
    expect(b.value).toBe(a.value);
  });
});

describe('static determinism scan', () => {
  it('reports no Math.random / Date.now / wall-clock Date / network call in showcase/**', () => {
    // Run as a child process: the script is ESM and must not depend on how Jest loads .mjs (vm-modules or not).
    const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ag-showcase-det-')), 'report.json');
    spawnSync(process.execPath, [path.join(ROOT, 'scripts/storybook/verify-showcase-imports.mjs'), '--json', out], { cwd: ROOT, encoding: 'utf8' });
    const report = JSON.parse(fs.readFileSync(out, 'utf8')) as { showcases: string[]; violations: Array<{ rule: string }> };
    expect(report.showcases).toHaveLength(SHOWCASES.length);
    expect(report.violations.filter((v) => v.rule === 'determinism')).toEqual([]);
  });
});
