// tests/rsc/surf/directives.test.ts — AC-SURF-09 (REQ-SURF-07).
// Static scan of every SURF module:
//   * the REQ-SURF-07 server list has no "use client", no hooks and no context
//     reads;
//   * every other SURF component module starts with "use client";
//   * every entry barrel carries no directive.

import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SURF_DIRS = [
  'src/app-shell',
  'src/data',
  'src/date',
  'src/ai',
  'src/media',
  'src/backdrops',
  'src/charts',
  'src/three',
  // --- lane W2 begin ---
  // Timeline/ActivityFeed live here (REQ-SURF-96/97). src/components is the
  // CMP lane's home now — scan only SURF-owned component dirs; other streams
  // run their own RSC lanes.
  'src/components/timeline',
  'src/components/breadcrumbs',
  'src/components/command-palette',
  'src/components/pagination',
  'src/components/source-transition',
  'src/components/tab-bar',
  'src/components/tabs',
  // --- lane W2 end ---
];

// REQ-SURF-07 server list, matched against module basenames. Server modules
// keep server parts in their own files (AppShell.Root.tsx, Sidebar.Nav.tsx,
// Message.Parts.tsx); the exceptions (StatusBar.Live, Breadcrumbs.Overflow)
// are client parts of server-named modules and must carry the directive.
const SERVER_MODULE = [
  /^AppShell\.(Root|Main|PageHeader|SkipLink)\.tsx?$/,
  /^AppShell\.tsx?$/,
  /^Sidebar(\.(Nav|Item))?\.tsx?$/,
  /^TopBar\.tsx?$/,
  /^StatusBar\.tsx?$/,
  /^MobileShell\.tsx?$/,
  /^Inspector\.tsx?$/,
  /^Breadcrumbs\.tsx?$/,
  /^Pagination\.tsx?$/,
  /^StatCard\.tsx?$/,
  /^Sparkline\.tsx?$/,
  /^ChartFrame\.tsx?$/,
  /^Timeline\.tsx?$/,
  /^ActivityFeed\.tsx?$/,
  /^Message\.(Root|Avatar|Content|Footer|Parts)\.tsx?$/,
  /^AgentSteps\.tsx?$/,
  /^UsageMeter\.tsx?$/,
  /^Backdrop\.tsx?$/,
  /^formatMediaTime\.ts$/,
  /^classifyTone\.ts$/,
  // --- lane W3 begin ---
  // src/ai server-safe modules (server-safe.test.tsx SERVER_MODULES):
  // Message/MessageParts render message content inside RSC trees — the
  // client shell is Thread.tsx.
  /^Message\.tsx?$/,
  /^MessageParts\.tsx?$/,
  // --- lane W3 end ---
  // --- lane W4 begin ---
  // REQ-SURF-140: Waveform (peaks) is server-renderable; live level mode is
  // the client WaveformLevel.tsx.
  /^Waveform\.tsx?$/,
  // --- lane W4 end ---
];

const CLIENT_ONLY = [/^StatusBar\.Live\.tsx?$/, /^Breadcrumbs\.Overflow\.tsx?$/, /^Pagination\.button\.tsx?$/i, /^ChartFrame\.Interactive\.tsx?$/, /^ActivityFeed\.Interactive\.tsx?$/];

const SKIP_FILE = /\.(test|spec|stories|meta|d)\.tsx?$|\.test-d\.ts$|\.css\.ts$/;

function* modules(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* modules(p);
    else if (/\.tsx?$/.test(name) && !SKIP_FILE.test(name)) yield p;
  }
}

function isBarrel(text: string): boolean {
  const meaningful = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//'));
  return meaningful.length > 0 && meaningful.every((l) => /^export\s/.test(l));
}

function firstDirective(text: string): string | null {
  const m = text.match(/^\s*(?:"use client"|'use client'|"use server"|'use server')/);
  return m ? m[0].trim() : null;
}

const files: string[] = [];
for (const d of SURF_DIRS) for (const f of modules(join(ROOT, d))) files.push(relative(ROOT, f).split(sep).join('/'));

const serverFiles = files.filter((f) => {
  // --- lane W4 begin ---
  // src/media/ImageViewer/parts/Inspector.tsx (SURF-473) shares the app-shell
  // Inspector basename but is a client part of a client-only module.
  if (f === 'src/media/ImageViewer/parts/Inspector.tsx') return false;
  // --- lane W4 end ---
  const base = f.split('/').pop() ?? '';
  return !CLIENT_ONLY.some((r) => r.test(base)) && SERVER_MODULE.some((r) => r.test(base));
});
const clientFiles = files.filter((f) => !serverFiles.includes(f) && !isBarrel(readFileSync(join(ROOT, f), 'utf8')));

/** Universal modules (SURF-001-style pure modules): no directive, no React
    import, no hook/DOM usage — importable from both server and client files,
    so they must carry NEITHER 'use client' NOR 'use server'. */
function isSharedModule(f: string): boolean {
  // --- lane W2 begin ---
  // Comments can mention hook names (getRange cites "usePagination"); scan
  // the code, not the prose.
  const text = readFileSync(join(ROOT, f), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ');
  // --- lane W2 end ---
  if (firstDirective(text)) return false;
  // React imports alone do not make a module client-only; hooks, DOM globals
  // or JSX do. createElement/render helpers stay universal.
  // JSX only lives in .tsx — a capitalised generic (`<TRow>`, `<V extends`)
    // in a .ts file is not a component.
    if (/\.tsx$/.test(f) && /<[A-Z][A-Za-z]*[\s/>]/.test(text)) return false;
  if (/from\s+['"](react-dom|next\/)/.test(text)) return false;
  // --- lane W3 begin ---
  // 'source-document' is an AgPart type literal, not a DOM reference — the
  // \bdocument\b probe misfires on it. Strip the literal before scanning.
  const domText = text.replace(/source-document/g, 'srcdoc');
  if (/\buse[A-Z][A-Za-z]*\s*\(|\bwindow\b|\bdocument\b|\bnavigator\b/.test(domText)) return false;
  // --- lane W3 end ---
  return true;
}
const sharedFiles = clientFiles.filter(isSharedModule);
const componentClientFiles = clientFiles.filter((f) => !sharedFiles.includes(f));

describe('REQ-SURF-07 module directives', () => {
  it('finds no SURF module in a server list file with a client directive or hooks', () => {
    const bad: string[] = [];
    for (const f of serverFiles) {
      const text = readFileSync(join(ROOT, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/\/\/[^\n]*/g, ' ');
      if (firstDirective(text) === '"use client"' || firstDirective(text) === "'use client'") {
        bad.push(`${f}: has "use client" but is on the REQ-SURF-07 server list`);
      }
      // --- lane W2 begin ---
      // React.useId is the one hook legal in RSC (React 19 deterministic ids);
      // strip it before scanning for real hooks. The directive exemption also
      // reads code only — comments stripped above can contain 'use client'.
      const hookText = text.replace(/\buseId\s*\(/g, 'uid(');
      if (/\buse[A-Z][A-Za-z]*\s*\(/.test(hookText) && !/['"]use client['"]/.test(text)) {
        bad.push(`${f}: hook call in a server module`);
      }
      // --- lane W2 end ---
      if (/\buseContext\s*\(|\.use\(/.test(text)) {
        bad.push(`${f}: context read in a server module`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every non-server, non-barrel SURF component module starts with "use client"', () => {
    const bad: string[] = [];
    for (const f of componentClientFiles) {
      const text = readFileSync(join(ROOT, f), 'utf8');
      if (firstDirective(text) !== '"use client"' && firstDirective(text) !== "'use client'") {
        bad.push(f);
      }
    }
    expect(bad).toEqual([]);
  });

  it('entry barrels carry no directive', () => {
    const barrels = files.filter((f) => f.endsWith('index.ts') && isBarrel(readFileSync(join(ROOT, f), 'utf8')));
    const bad = barrels.filter((f) => firstDirective(readFileSync(join(ROOT, f), 'utf8')) !== null);
    expect(bad).toEqual([]);
  });
});
