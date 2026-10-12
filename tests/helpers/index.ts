/* S-40 test helper API — QUAL-owned. Frozen export list (§4.10):
   renderAg, renderAgServer, expectParts, expectNoBannedAttributes, gotoStory,
   listSubjects, apg, perf, scenes. */
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
  if (env.backdrop) out['data-ag-backdrop'] = env.backdrop;
  if (env.forcedColors) out['data-forced-colors'] = '';   // jsdom test marker (forced-colors media query cannot be emulated)
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
          // React 19 routes hydration mismatches to onRecoverableError (default:
          // window.reportError), not console: collect them as warnings too.
          hydrateRoot(container, ui, {
            onRecoverableError: (error) => {
              warnings.push(error instanceof Error ? error.message : String(error));
            },
          });
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
    .filter(([k, v]) => k !== 'data-forced-colors' && v !== undefined && v !== '')
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

/** Reads REPORTS.subjects (storybook-static/cert-manifest.json, written by
    scripts/storybook/write-cert-manifest.mjs at every storybook:build) from AG_STORYBOOK_URL.
    REQ-QUAL-01: packages/qa/src/resolve is the only subject→story mapping, so there is no
    index.json / title-leaf fallback — a missing or empty manifest throws. */
export const listSubjects: ListSubjects = async (filter = {}) => {
  const base = process.env.AG_STORYBOOK_URL ?? 'http://localhost:6006';
  const path = REPORTS.subjects.startsWith('storybook-static/')
    ? REPORTS.subjects.slice('storybook-static/'.length)
    : REPORTS.subjects;
  const get: typeof fetch | undefined = typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined;
  const res = get ? await get(`${base}/${path}`).catch(() => null) : null;
  const index = res && res.ok ? ((await res.json()) as SubjectIndex) : null;
  if (!index || !Array.isArray(index.stories) || index.stories.length === 0) {
    throw new Error(`listSubjects: no subject index reachable at ${base}/${path} (REPORTS.subjects; written by `
      + `scripts/storybook/write-cert-manifest.mjs during storybook:build) — is Storybook built?`);
  }
  return index.stories.filter((s) =>
    (!filter.tags || filter.tags.every((t) => s.tags.includes(t))) &&
    (!filter.kind || s.kind === filter.kind) &&
    (!filter.owner || s.owner === filter.owner));
};

/** Resolves packages/qa/src/perf/bci.ts (FIN-G, REQ-QUAL-36). Absence of the
    producer is a pending state, raised as an error named `AgPendingProducer`
    with a `pending:` message the lane runner classifies; any other failure
    (the module throws, or has no `bci` export) propagates unchanged. */
const QA_BCI = join(__dirname, '..', '..', 'packages', 'qa', 'src', 'perf', 'bci.ts');
const loadQaBci = async (): Promise<PerfProbe['bci']> => {
  if (!existsSync(QA_BCI)) {
    const err = new Error('pending: perf.bci needs packages/qa/src/perf/bci.ts (FIN-G, REQ-QUAL-36), not on this line yet');
    err.name = 'AgPendingProducer';
    throw err;
  }
  const mod = (await import(QA_BCI)) as { bci?: PerfProbe['bci'] };
  if (typeof mod.bci !== 'function') throw new Error(`perf.bci: ${QA_BCI} does not export bci()`);
  return mod.bci;
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
    // qa package). Delegate to it; while it is absent the probe raises a
    // pending-producer error that the lane runner reports as `pending`
    // (PRD-F §4.3 rule 2). No inline re-implementation, nothing swallowed.
    return (await loadQaBci())(page);
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
      // S-40 `intervals`: intervals started during the settle window and still live at collection.
      const iw = window as unknown as { __agIntervals?: { live: Set<number>; restore: () => void } };
      const origSet = window.setInterval;
      const origClear = window.clearInterval;
      const live = new Set<number>();
      window.setInterval = ((...args: Parameters<typeof window.setInterval>) => {
        // runs in the browser page, where setInterval returns a number (not node's Timeout)
        const id = origSet.apply(window, args) as unknown as number;
        live.add(id);
        return id;
      }) as typeof window.setInterval;
      window.clearInterval = ((id?: number) => {
        if (id !== undefined) live.delete(id);
        origClear.call(window, id);
      }) as typeof window.clearInterval;
      iw.__agIntervals = { live, restore: () => { window.setInterval = origSet; window.clearInterval = origClear; } };
    });
    if (opts.afterMs) await page.waitForTimeout(opts.afterMs);
    return page.evaluate(() => {
      const iw = window as unknown as { __agIntervals?: { live: Set<number>; restore: () => void } };
      const intervals = iw.__agIntervals?.live.size ?? 0;
      iw.__agIntervals?.restore();
      delete iw.__agIntervals;
      return {
        pendingRaf: (window as unknown as Record<string, number>).__agPendingRaf ?? 0,
        intervals,
        infiniteAnimations: document.getAnimations().filter((a) =>
          a.effect && (a.effect as KeyframeEffect).getComputedTiming().iterations === Infinity).length,
      };
    });
  },
};
