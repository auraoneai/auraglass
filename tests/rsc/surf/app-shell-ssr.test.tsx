/** @jest-environment node */
/* REQ-SURF-20: the AppShell server namespace renders on the server with only
   the contract Root props, and its server module graph stays server-only:
   walking static imports from every REQ-SURF-07 server module (AppShell,
   Sidebar, Sidebar.Nav, TopBar, StatusBar, Inspector, MobileShell,
   Breadcrumbs, Pagination) never reaches a SURF module that uses hooks or
   context without first crossing a 'use client' boundary. Foreign graphs
   (src/material, src/contracts, …) are PLAT's server-graph test. The real
   react-server Flight render is the L11 next16 canary (app/surf). */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { AppShell } from '../../../src/app-shell/AppShell';
import { Sidebar } from '../../../src/app-shell/Sidebar';
import { Inspector } from '../../../src/app-shell/Inspector';
import { TopBar } from '../../../src/app-shell/TopBar';
import { StatusBar } from '../../../src/app-shell/StatusBar';

const ROOT = resolve(__dirname, '../../..');
const SURF_ROOTS = ['src/app-shell/', 'src/components/breadcrumbs/', 'src/components/pagination/'];
const SERVER_ENTRIES = [
  'src/app-shell/AppShell.tsx',
  'src/app-shell/Sidebar.tsx',
  'src/app-shell/Sidebar.Nav.tsx',
  'src/app-shell/TopBar.tsx',
  'src/app-shell/StatusBar.tsx',
  'src/app-shell/Inspector.tsx',
  'src/app-shell/MobileShell.tsx',
  'src/components/breadcrumbs/Breadcrumbs.tsx',
  'src/components/pagination/Pagination.tsx',
];

const code = (f: string) =>
  readFileSync(join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
const isClient = (f: string) => /^\s*['"]use client['"]/.test(code(f));

function resolveRel(from: string, spec: string): string | null {
  const base = resolve(join(ROOT, dirname(from)), spec);
  for (const c of [base, `${base}.tsx`, `${base}.ts`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (existsSync(c) && /\.tsx?$/.test(c)) return relative(ROOT, c).split(sep).join('/');
  }
  return null;
}

/** Value imports only (`import type` is erased and never reaches the graph). */
function valueImports(f: string): string[] {
  const out: string[] = [];
  for (const m of code(f).matchAll(/(?:^|\n)\s*(import|export)\s+(type\s+)?[^'"]*?from\s+['"](\.[^'"]+)['"]/g)) {
    if (m[2]) continue;
    out.push(m[3]!);
  }
  return out;
}

describe('AppShell server render (REQ-SURF-20)', () => {
  it('renders the full server shell to string with only contract attrs', () => {
    const html = renderToString(
      h(AppShell.Root, { layout: 'auto', defaultSidebar: 'rail', persistKey: 'prefs' },
        h(AppShell.SkipLink, {}),
        h(TopBar.Root, {}),
        h(Sidebar.Root, {}, h(Sidebar.Nav, { 'aria-label': 'Primary' })),
        h(AppShell.Main, {}, h(AppShell.PageHeader, { title: 'T' })),
        h(Inspector.Root, { 'aria-label': 'Props' }),
        h(StatusBar.Root, {}),
      ),
    );
    expect(html).toContain('data-ag-part="root"');
    expect(html).toContain('data-ag-layout="auto"');
    expect(html).toContain('data-ag-sidebar="rail"');
    expect(html).toContain('data-persist-key="prefs"');
    // SURF-20: the removed props never reach markup.
    expect(html).not.toContain('data-ag-density');
    expect(html).not.toContain('data-ag-backdrop');
    expect(html).not.toContain('data-collapse-to');
    expect(html).not.toContain('data-ag-collapse-to');
  });

  it('server module graph reaches no hook/context module without a use client boundary', () => {
    const seen = new Set<string>();
    const reached: string[] = [];
    const bad: string[] = [];
    const walk = (f: string, chain: string[]) => {
      if (seen.has(f)) return;
      seen.add(f);
      if (!SURF_ROOTS.some((r) => f.startsWith(r))) return; // foreign graph: PLAT's test
      if (isClient(f)) return; // client boundary: its subtree is client code
      reached.push(f);
      const text = code(f).replace(/\buseId\s*\(/g, 'uid(');
      if (/\buse[A-Z][A-Za-z]*\s*\(|\bcreateContext\s*\(|\buseContext\s*\(/.test(text)) {
        bad.push([...chain, f].join(' -> '));
      }
      for (const spec of valueImports(f)) {
        const next = resolveRel(f, spec);
        if (next) walk(next, [...chain, f]);
      }
    };
    for (const e of SERVER_ENTRIES) {
      expect(isClient(e)).toBe(false);
      walk(e, []);
    }
    // The walk really covered the server list plus their shared helpers.
    expect(reached).toEqual(expect.arrayContaining([...SERVER_ENTRIES, 'src/app-shell/_internal/partElement.ts']));
    expect(bad).toEqual([]);
  });
});
