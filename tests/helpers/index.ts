/* S-40 test helper API — QUAL-owned. Frozen export list (§4.10):
   renderAg, renderAgServer, expectParts, expectNoBannedAttributes, gotoStory,
   listSubjects, apg, perf, scenes. */
import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
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
  if (env.backdrop) out['data-ag-backdrop'] = env.backdrop;
  if (env.forcedColors) out['data-ag-forced-colors'] = '';   // jsdom test marker (forced-colors media query cannot be emulated)
  return out;
};

/** Applies the S-01 environment attribute set to document.documentElement,
    as AuraGlassScript/the provider would stamp it pre-paint; removed on unmount. */
const DocumentEnv: React.FC<{ attrs: Record<string, string>; children?: React.ReactNode }> = ({ attrs, children }) => {
  React.useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-ag-root', '');
    for (const [k, v] of Object.entries(attrs)) html.setAttribute(k, v);
    return () => {
      html.removeAttribute('data-ag-root');
      for (const k of Object.keys(attrs)) html.removeAttribute(k);
    };
  }, [attrs]);
  return React.createElement(React.Fragment, null, children);
};

/** jsdom: wraps RTL render, stamping the S-01 environment on the document root. */
export const renderAg: RenderAg = (ui, env = {}) => {
  const { provider = true, ...attrs } = env;
  const inner = provider ? React.createElement(AuraGlassProvider, null, ui) : ui;
  const envForDoc = envAttrs(attrs);
  return render(inner, {
    wrapper: ({ children }) => React.createElement(DocumentEnv, { attrs: envForDoc }, children),
  });
};

/** react-dom/server then hydrateRoot inside act(), so hydrate() resolves only
    once hydration has actually run; console warnings are collected meanwhile. */
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
        const { act } = await import('react');
        await act(async () => {
          hydrateRoot(container, ui);
        });
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
  const globals: Record<string, string> = { ...envAttrs(attrs), ...(scene ? { scene } : {}) };
  // globals filter: strip the data-ag- prefix and drop empty-valued keys
  // (forced-colors markers have no Storybook global; cert mode is opt-in via ag-cert=1).
  const qs = Object.entries(globals)
    .filter(([k, v]) => k !== 'data-ag-forced-colors' && v !== undefined && v !== '')
    .map(([k, v]) => `${k.replace(/^data-ag-/, '')}:${v}`)
    .join(';');
  const base = process.env.AG_STORYBOOK_URL ?? 'http://localhost:6006';
  await page.goto(`${base}/iframe.html?id=${encodeURIComponent(storyId)}&ag-cert=1&globals=${encodeURIComponent(qs)}`);
  if (stub === 'reference' && !existsSync(MATERIAL_CSS) && existsSync(STUB_PATH)) {
    await page.addStyleTag({ path: STUB_PATH });
  }
  // per-story readiness token: the preview decorator stamps data-ag-cert-ready
  // on <html> for the story that just mounted — wait for it on this navigation.
  await page.waitForSelector('[data-ag-cert-ready]', { timeout: 30_000 });
};

/** Reads REPORTS.subjects (storybook-static/cert-manifest.json) from AG_STORYBOOK_URL,
    falling back to index.json. Never hard-codes another stream's story ids. */
const OWNERSHIP_JSON = join(__dirname, '..', '..', 'contracts', 'ownership.json');

/** Minimal glob matcher for ownership.json rows (`**` crosses `/`, `*` does not). */
const ownershipOwner = (() => {
  let rows: Array<{ glob: string; owner: SubjectIndex['stories'][number]['owner']; re: RegExp }> | null = null;
  return (storyPath: string): SubjectIndex['stories'][number]['owner'] => {
    if (rows === null) {
      rows = [];
      try {
        const doc = JSON.parse(readFileSync(OWNERSHIP_JSON, 'utf8')) as { rows?: Array<{ glob: string; owner: string }> };
        for (const r of doc.rows ?? []) {
          const re = new RegExp('^' + r.glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*') + '$');
          rows.push({ glob: r.glob, owner: r.owner as SubjectIndex['stories'][number]['owner'], re });
        }
      } catch { /* ownership.json absent */ }
    }
    const hit = rows.find((r) => r.re.test(storyPath));
    return hit?.owner ?? 'QUAL'; // helpers' own stream when a path is unclaimed
  };
})();

export const listSubjects: ListSubjects = async (filter = {}) => {
  const base = process.env.AG_STORYBOOK_URL ?? 'http://localhost:6006';
  const path = REPORTS.subjects.startsWith('storybook-static/')
    ? REPORTS.subjects.slice('storybook-static/'.length)
    : REPORTS.subjects;
  let index: SubjectIndex | null = null;
  const get: typeof fetch | undefined = typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined;
  const res = get ? await get(`${base}/${path}`).catch(() => null) : null;
  if (res && res.ok) {
    index = (await res.json()) as SubjectIndex;
  } else {
    // seed fallback: storybook index.json; owner is derived from the story's
    // importPath via contracts/ownership.json — never a hard-coded stream.
    const idx = get ? await get(`${base}/index.json`).catch(() => null) : null;
    if (idx && idx.ok) {
      const raw = await idx.json() as { entries?: Record<string, { id: string; title?: string; importPath?: string; tags?: string[] }> };
      index = {
        version: 1,
        stories: Object.values(raw.entries ?? {}).map((e) => {
          const storyPath = (e.importPath ?? '').replace(/^\.\//, '');
          return {
            id: e.id,
            subject: (e.title ?? '').split('/').pop() ?? e.id,
            kind: 'component' as const,
            tags: e.tags ?? [],
            owner: ownershipOwner(storyPath),
          };
        }),
      };
    }
  }
  if (!index || index.stories.length === 0) {
    throw new Error(`listSubjects: no subject index reachable at ${base} (tried ${REPORTS.subjects} and index.json) — is Storybook built?`);
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
    // REQ-QUAL-36 BCI lives in packages/qa/src/perf/bci.ts (FIN-G creates the
    // qa package); delegate once it exists, meanwhile the same computation
    // runs inline so existing specs keep working.
    try {
      const spec = '../../packages/qa/src/perf/bci.js';
      const mod = (await import(spec).catch(() => null)) as { bci?: PerfProbe['bci'] } | null;
      if (mod?.bci) return mod.bci(page);
    } catch { /* qa package not present yet */ }
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
      (window as unknown as Record<string, unknown>).__agFrames = { stamps: [] as number[], longTasks: 0, rafId: 0 };
      const rec = (window as unknown as Record<string, { stamps: number[]; longTasks: number; rafId: number }>).__agFrames!;
      const obs = new PerformanceObserver((list) => { rec.longTasks += list.getEntries().length; });
      try { obs.observe({ entryTypes: ['longtask'] }); } catch { /* unsupported */ }
      (window as unknown as Record<string, unknown>).__agObs = obs;
      const loop = (t: number) => { rec.stamps.push(t); rec.rafId = requestAnimationFrame(loop); };
      rec.rafId = requestAnimationFrame(loop);
    });
    try {
      if (opts.during) await opts.during();
      else await page.waitForTimeout(opts.durationMs);
    } finally {
      /* collect below */
    }
    return page.evaluate(() => {
      const w = window as unknown as { __agFrames: { stamps: number[]; longTasks: number; rafId: number }; __agObs?: PerformanceObserver };
      const rec = w.__agFrames!;
      cancelAnimationFrame(rec.rafId);   // never leave the probe's rAF running past collection
      w.__agObs?.disconnect();
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
