/* @ag-contract-seed: S-40. Owner QUAL replaces internals; the frozen export list is
   renderAg, renderAgServer, expectParts, expectNoBannedAttributes, gotoStory,
   listSubjects, apg, perf, scenes (§4.10). */
import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BANNED_ATTRIBUTES } from '../../src/contracts/material';
import { SCENES } from '../../src/contracts/testing';
import { REPORTS } from '../../src/contracts/testing';
import type {
  RenderAg, RenderAgServer, ExpectParts, ExpectNoBannedAttributes,
  GotoStory, ListSubjects, AgEnvironment, SubjectIndex, PerfProbe, ApgHarness,
} from '../../src/contracts/testing';
import { AuraGlassProvider } from '../../src/theme/index';
import { apg } from '../a11y/apg/harness';

export { apg };
export const scenes = SCENES;

const envAttrs = (env: AgEnvironment): Record<string, string> => {
  const out: Record<string, string> = {};
  if (env.scheme) out['data-ag-scheme'] = env.scheme;
  if (env.contrast) out['data-ag-contrast'] = env.contrast;
  if (env.transparency) out['data-ag-transparency'] = env.transparency;
  if (env.motion) out['data-ag-motion'] = env.motion;
  if (env.tier) out['data-ag-tier'] = env.tier;
  if (env.backdrop) out['data-ag-backdrop-env'] = env.backdrop;
  if (env.forcedColors) out['data-ag-forced-colors'] = '';
  return out;
};

/** jsdom: wraps RTL render in a div carrying the data-ag-* environment. */
export const renderAg: RenderAg = (ui, env = {}) => {
  const { provider = true, ...attrs } = env;
  const inner = provider ? React.createElement(AuraGlassProvider, null, ui) : ui;
  return render(inner, {
    wrapper: ({ children }) => React.createElement('div', { 'data-ag-root': '', ...envAttrs(attrs) }, children),
  });
};

/** react-dom/server then hydrateRoot, collecting console warnings on hydrate. */
export const renderAgServer: RenderAgServer = (ui, _env = {}) => {
  const { renderToString } = require('react-dom/server') as typeof import('react-dom/server');
  const html = renderToString(ui);
  return {
    html,
    async hydrate() {
      const warnings: string[] = [];
      const origError = console.error;
      const origWarn = console.warn;
      console.error = (...a: unknown[]) => { warnings.push(a.map(String).join(' ')); };
      console.warn = (...a: unknown[]) => { warnings.push(a.map(String).join(' ')); };
      try {
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);
        const { hydrateRoot } = await import('react-dom/client');
        hydrateRoot(container, ui);
      } finally {
        console.error = origError;
        console.warn = origWarn;
      }
      return { warnings };
    },
  };
};

/** Final: DOM parts == meta.parts (order-insensitive, duplicates counted). */
export const expectParts: ExpectParts = (container, meta) => {
  const found = [...container.querySelectorAll('[data-ag-part]')]
    .map((el) => el.getAttribute('data-ag-part'))
    .sort();
  expect(found).toEqual([...meta.parts].map(String).sort());
};

/** Final: no BANNED_ATTRIBUTES, no data-ag-seed anywhere under container. */
export const expectNoBannedAttributes: ExpectNoBannedAttributes = (container) => {
  const offenders: string[] = [];
  const scan = (el: Element) => {
    for (const name of el.getAttributeNames()) {
      if ((BANNED_ATTRIBUTES as readonly string[]).includes(name) || name === 'data-ag-seed') {
        offenders.push(`${el.tagName.toLowerCase()}[${name}]`);
      }
    }
  };
  scan(container);
  container.querySelectorAll('*').forEach(scan);
  expect(offenders).toEqual([]);
};

/** Navigates to iframe.html?id=<id>&globals=<k>:<v>;… and waits for data-ag-cert-ready.
    stub: 'reference' injects contracts/stubs/reference.css until src/material/css/material.css exists. */
const STUB_PATH = join(__dirname, '..', '..', 'contracts', 'stubs', 'reference.css');
const MATERIAL_CSS = join(__dirname, '..', '..', 'src', 'material', 'css', 'material.css');
export const gotoStory: GotoStory = async (page, storyId, env = {}) => {
  const { stub, scene, ...attrs } = env;
  const globals = { ...envAttrs(attrs), ...(scene ? { scene } : {}) };
  const qs = Object.entries(globals)
    .map(([k, v]) => `${k.replace(/^data-ag-/, '')}:${v}`)
    .filter(([k]) => k)
    .join(';');
  const base = process.env.AG_STORYBOOK_URL ?? 'http://localhost:6006';
  await page.goto(`${base}/iframe.html?id=${encodeURIComponent(storyId)}&globals=${encodeURIComponent(qs)}`);
  if (stub === 'reference' && !existsSync(MATERIAL_CSS) && existsSync(STUB_PATH)) {
    await page.addStyleTag({ path: STUB_PATH });
  }
  await page.waitForSelector('[data-ag-cert-ready]', { timeout: 30_000 });
};

/** Reads REPORTS.subjects (storybook-static/cert-manifest.json) from AG_STORYBOOK_URL,
    falling back to index.json. Never hard-codes another stream's story ids. */
export const listSubjects: ListSubjects = async (filter = {}) => {
  const base = process.env.AG_STORYBOOK_URL ?? 'http://localhost:6006';
  const path = REPORTS.subjects.startsWith('storybook-static/')
    ? REPORTS.subjects.slice('storybook-static/'.length)
    : REPORTS.subjects;
  const res = await fetch(`${base}/${path}`).catch(() => null)
    ?? await fetch(`${base}/${path}`);
  let index: SubjectIndex;
  if (res && res.ok) {
    index = (await res.json()) as SubjectIndex;
  } else {
    const idx = await fetch(`${base}/index.json`);
    if (!idx.ok) return [];
    const raw = await idx.json() as { entries?: Record<string, { id: string; title?: string; tags?: string[] }> };
    index = {
      version: 1,
      stories: Object.values(raw.entries ?? {}).map((e) => ({
        id: e.id,
        subject: (e.title ?? '').split('/').pop() ?? e.id,
        kind: 'component' as const,
        tags: e.tags ?? [],
        owner: 'PLAT' as const,
      })),
    };
  }
  return index.stories.filter((s) =>
    (!filter.tags || filter.tags.every((t) => s.tags.includes(t))) &&
    (!filter.kind || s.kind === filter.kind) &&
    (!filter.owner || s.owner === filter.owner));
};

/** Page-side perf probes (QUAL implements the real harness; these are the final
    page-side counts the contract fixes). */
export const perf: PerfProbe = {
  async blurredSurfaces(page) {
    return page.evaluate(() => {
      let n = 0;
      for (const el of document.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        const pseudo = getComputedStyle(el, '::before');
        if (cs.backdropFilter !== 'none' || pseudo.backdropFilter !== 'none') n++;
      }
      return n;
    });
  },
  async bci(page) {
    return page.evaluate(() => {
      const vw = window.innerWidth * window.innerHeight || 1;
      let area = 0;
      for (const el of document.querySelectorAll<HTMLElement>('*')) {
        const cs = getComputedStyle(el);
        if (cs.backdropFilter !== 'none' && cs.backdropFilter !== '') {
          const r = el.getBoundingClientRect();
          area += Math.max(0, r.width) * Math.max(0, r.height);
        }
      }
      return Math.min(1, area / vw);
    });
  },
  async frames(page, opts) {
    await page.evaluate(() => {
      (window as unknown as Record<string, unknown>).__agFrames = { stamps: [] as number[], longTasks: 0 };
      const rec = (window as unknown as Record<string, { stamps: number[]; longTasks: number }>).__agFrames!;
      const obs = new PerformanceObserver((list) => { rec.longTasks += list.getEntries().length; });
      try { obs.observe({ entryTypes: ['longtask'] }); } catch { /* unsupported */ }
      (window as unknown as Record<string, unknown>).__agObs = obs;
      const loop = (t: number) => { rec.stamps.push(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
    try {
      if (opts.during) await opts.during();
      else await page.waitForTimeout(opts.durationMs);
    } finally {
      /* collect below */
    }
    return page.evaluate(() => {
      const w = window as unknown as Record<string, { stamps: number[]; longTasks: number } & { __agObs?: PerformanceObserver }>;
      const rec = w.__agFrames!;
      (w.__agObs as PerformanceObserver | undefined)?.disconnect();
      const deltas = rec.stamps.slice(1).map((t, i) => t - (rec.stamps[i] ?? 0)).sort((a, b) => a - b);
      const p95 = deltas.length ? (deltas[Math.min(deltas.length - 1, Math.floor(deltas.length * 0.95))] ?? 0) : 0;
      return { p95Ms: p95, longTasks: rec.longTasks };
    });
  },
  async settledIdle(page, opts = {}) {
    await page.evaluate(() => {
      const w = window as unknown as { __agPendingRaf: number };
      w.__agPendingRaf = 0;
      const origRaf = window.requestAnimationFrame.bind(window);
      const origCaf = window.cancelAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => { w.__agPendingRaf++; return origRaf((t) => { w.__agPendingRaf--; cb(t); }); };
      window.cancelAnimationFrame = (id) => { w.__agPendingRaf--; origCaf(id); };
    });
    if (opts.afterMs) await page.waitForTimeout(opts.afterMs);
    return page.evaluate(() => ({
      pendingRaf: (window as unknown as Record<string, number>).__agPendingRaf ?? 0,
      intervals: 0,
      infiniteAnimations: document.getAnimations().filter((a) =>
        a.effect && (a.effect as KeyframeEffect).getComputedTiming().iterations === Infinity).length,
    }));
  },
};
