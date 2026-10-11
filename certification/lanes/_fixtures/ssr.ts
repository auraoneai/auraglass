/* FIN-G lane fixture (G-18, REQ-QUAL-21): server render in Node, hydrate in
   the engine under test.

   For one story: esbuild bundles (1) a Node server entry that renders
   <AuraGlassScript/> and <Profiler><AuraGlassProvider><Story/></…> with
   react-dom/server, and (2) a browser client entry that hydrateRoot()s the
   same tree — once with the development build (React's hydration warnings)
   and once with the react-dom/profiling build (Profiler commit counting in a
   production-equivalent build). The page is served from an intercepted
   origin; an inline observer installed right after AuraGlassScript records
   every <html> data-ag-* mutation and every class / data-ag-tier mutation on
   [data-ag-surface]. Nothing here passes by default: build, render or
   hydration errors propagate to the test. */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Page } from '@playwright/test';
import { ROOT } from './root';
import type { SubjectStory } from './subjects';

export type ClientMode = 'development' | 'profiling';

export interface SsrBundles { serverFile: string; client: Record<ClientMode, { js: string; css: string | null }> }

const ASSET_LOADERS = { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.webp': 'dataurl',
  '.avif': 'dataurl', '.webm': 'dataurl', '.mp4': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl' } as const;

const imports = (story: SubjectStory) => `
import * as React from 'react';
import * as storyModule from ${JSON.stringify(join(ROOT, story.importPath))};
import { AuraGlassProvider } from ${JSON.stringify(join(ROOT, 'src/theme/index'))};
import { composeStory } from ${JSON.stringify(join(ROOT, 'certification/lanes/_fixtures/compose'))};
const Story = composeStory(storyModule, ${JSON.stringify(story.exportName)});
`;

const serverEntry = (story: SubjectStory) => `${imports(story)}
import { renderToString } from 'react-dom/server';
import { AuraGlassScript } from ${JSON.stringify(join(ROOT, 'src/theme/AuraGlassScript'))};
export function render() {
  const tree = React.createElement(React.Profiler, { id: 'ag-subject', onRender: () => undefined },
    React.createElement(AuraGlassProvider, null, React.createElement(Story)));
  return { head: renderToString(React.createElement(AuraGlassScript)), body: renderToString(tree) };
}
`;

const clientEntry = (story: SubjectStory) => `${imports(story)}
import { hydrateRoot } from 'react-dom/client';
const rec = window.__agSsr;
const msg = (e) => (e && e.message) ? e.message : String(e);
const container = document.getElementById('ag-ssr-root');
const tree = React.createElement(React.Profiler, {
    id: 'ag-subject',
    onRender: (_id, phase) => { rec.commits.push({ phase, at: performance.now() }); },
  }, React.createElement(AuraGlassProvider, null, React.createElement(Story)));
rec.hydrateStart = performance.now();
hydrateRoot(container, tree, {
  onRecoverableError: (e) => { rec.reactErrors.push('recoverable: ' + msg(e)); },
  onCaughtError: (e) => { rec.reactErrors.push('caught: ' + msg(e)); },
  onUncaughtError: (e) => { rec.reactErrors.push('uncaught: ' + msg(e)); },
});
`;

/** Builds the server bundle and both client bundles for `story` under `outDir`. */
export async function buildSsrBundles(story: SubjectStory, outDir: string): Promise<SsrBundles> {
  const esbuild = await import('esbuild');
  mkdirSync(outDir, { recursive: true });
  const common = {
    bundle: true, write: true, jsx: 'automatic' as const, tsconfig: join(ROOT, 'tsconfig.json'),
    logLevel: 'silent' as const, absWorkingDir: ROOT,
  };
  const serverFile = join(outDir, 'server.mjs');
  await esbuild.build({
    ...common,
    stdin: { contents: serverEntry(story), resolveDir: ROOT, sourcefile: 'ag-ssr-server.tsx', loader: 'tsx' },
    outfile: serverFile, platform: 'node', format: 'esm',
    loader: { '.css': 'empty', ...ASSET_LOADERS },
    banner: { js: "import { createRequire as __agCR } from 'node:module'; const require = __agCR(import.meta.url);" },
  });
  const client = {} as SsrBundles['client'];
  for (const mode of ['development', 'profiling'] as const) {
    const js = join(outDir, `client.${mode}.js`);
    const result = await esbuild.build({
      ...common,
      stdin: { contents: clientEntry(story), resolveDir: ROOT, sourcefile: `ag-ssr-client.${mode}.tsx`, loader: 'tsx' },
      outfile: js, platform: 'browser', format: 'iife', metafile: true,
      loader: { '.css': 'css', ...ASSET_LOADERS },
      define: { 'process.env.NODE_ENV': JSON.stringify(mode === 'profiling' ? 'production' : 'development') },
      ...(mode === 'profiling' ? { alias: { 'react-dom/client': 'react-dom/profiling' } } : {}),
    });
    const cssOut = Object.keys(result.metafile?.outputs ?? {}).find((o) => o.endsWith('.css'));
    client[mode] = { js, css: cssOut ? join(ROOT, cssOut) : null };
  }
  return { serverFile, client };
}

export interface ServerRender { head: string; body: string; serverConsole: string[] }

/** Imports the Node server bundle and renders, collecting server-side console.error/warn. */
export async function renderOnServer(bundles: SsrBundles): Promise<ServerRender> {
  const serverConsole: string[] = [];
  const { error, warn } = console;
  console.error = (...a: unknown[]) => { serverConsole.push(`server console.error: ${a.map(String).join(' ')}`); };
  console.warn = (...a: unknown[]) => { serverConsole.push(`server console.warn: ${a.map(String).join(' ')}`); };
  try {
    const mod = (await import(`${pathToFileURL(bundles.serverFile).href}?t=${Date.now()}`)) as { render: () => { head: string; body: string } };
    return { ...mod.render(), serverConsole };
  } finally {
    console.error = error;
    console.warn = warn;
  }
}

/* Inline observer, installed directly after AuraGlassScript in <head>. */
const OBSERVER = `(() => {
  const rec = window.__agSsr = { commits: [], reactErrors: [], htmlMutations: [], surfaceMutations: [], hydrateStart: -1 };
  const html = document.documentElement;
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type !== 'attributes' || !m.attributeName) continue;
      const t = m.target;
      const now = t.getAttribute(m.attributeName);
      if (t === html && m.attributeName.startsWith('data-ag-')) {
        rec.htmlMutations.push(m.attributeName + ': ' + JSON.stringify(m.oldValue) + ' -> ' + JSON.stringify(now));
      } else if (t.matches && t.matches('[data-ag-surface]') && (m.attributeName === 'class' || m.attributeName === 'data-ag-tier')) {
        rec.surfaceMutations.push((t.getAttribute('data-ag-part') || t.tagName.toLowerCase()) + ' ' + m.attributeName + ': '
          + JSON.stringify(m.oldValue) + ' -> ' + JSON.stringify(now));
      }
    }
  }).observe(html, { attributes: true, attributeOldValue: true, subtree: true });
})();`;

export interface HydrationResult {
  mode: ClientMode;
  /** stylesheet served with the page, null when neither the bundle nor dist/styles.css provided one */
  stylesheet: string | null;
  console: string[];
  pageErrors: string[];
  reactErrors: string[];
  htmlMutations: string[];
  surfaceMutations: string[];
  /** Profiler commits after the hydration mount commit, within 1 s, without input */
  updateCommits: Array<{ phase: string; atMs: number }>;
}

const ORIGIN = 'http://ag-ssr.local';

/** Serves the server HTML + client bundle to `page`, hydrates, observes for 1 s without input. */
export async function hydrateInPage(page: Page, server: ServerRender, bundles: SsrBundles, mode: ClientMode): Promise<HydrationResult> {
  const out: HydrationResult = { mode, stylesheet: null, console: [], pageErrors: [], reactErrors: [], htmlMutations: [], surfaceMutations: [], updateCommits: [] };
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') out.console.push(`console.${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => { out.pageErrors.push(`pageerror: ${e.message}`); });
  const { js } = bundles.client[mode];
  // library CSS: whatever the story bundle imported, else the built dist/styles.css (plat:build:dist artifact)
  // — the cert-mode stylesheet (REQ-FIN-05). Recorded in the result so a CSS-less run is visible.
  const distCss = join(ROOT, 'dist', 'styles.css');
  const css = bundles.client[mode].css ?? (existsSync(distCss) ? distCss : null);
  out.stylesheet = css;
  const doc = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ag-ssr</title>'
    + `${server.head}<script>${OBSERVER}</script>${css ? '<link rel="stylesheet" href="/client.css">' : ''}</head>`
    + `<body><div id="ag-ssr-root">${server.body}</div><script src="/client.js"></script></body></html>`;
  await page.route(`${ORIGIN}/**`, async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/') return route.fulfill({ status: 200, contentType: 'text/html', body: doc });
    if (path === '/client.js') return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(js) });
    if (path === '/client.css' && css) return route.fulfill({ status: 200, contentType: 'text/css', body: readFileSync(css) });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.goto(`${ORIGIN}/`);
  await page.waitForFunction(() => (window as unknown as { __agSsr: { hydrateStart: number } }).__agSsr.hydrateStart >= 0);
  await page.waitForTimeout(1_000);
  const rec = await page.evaluate(() => (window as unknown as {
    __agSsr: { commits: Array<{ phase: string; at: number }>; reactErrors: string[]; htmlMutations: string[]; surfaceMutations: string[]; hydrateStart: number };
  }).__agSsr);
  out.reactErrors = rec.reactErrors;
  out.htmlMutations = rec.htmlMutations;
  out.surfaceMutations = rec.surfaceMutations;
  // the first commit is hydration itself (phase 'mount'); any later commit inside 1 s is a re-render without input
  const firstMount = rec.commits.findIndex((c) => c.phase === 'mount');
  out.updateCommits = rec.commits
    .filter((c, i) => i !== firstMount && c.at - rec.hydrateStart <= 1_000)
    .map((c) => ({ phase: c.phase, atMs: Math.round(c.at - rec.hydrateStart) }));
  return out;
}

/** REQ-QUAL-21 verdict for one hydration pass: [] means clean. */
export function hydrationViolations(server: ServerRender, r: HydrationResult): string[] {
  const v = [...server.serverConsole, ...r.console, ...r.pageErrors, ...r.reactErrors];
  for (const m of r.htmlMutations) v.push(`<html> mutated after AuraGlassScript: ${m}`);
  for (const m of r.surfaceMutations) v.push(`[data-ag-surface] mutated after hydration: ${m}`);
  if (r.mode === 'profiling') for (const c of r.updateCommits) v.push(`React commit without input at +${c.atMs} ms (phase ${c.phase})`);
  return v;
}
