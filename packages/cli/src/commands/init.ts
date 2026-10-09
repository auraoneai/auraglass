/** init (PLAT-86): full scaffold — Next App Router / Vite / shadcn; Pages &
 *  React Router detected + reported. Idempotent: second run is 'no changes'. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT } from '../cli/errors.js';
import { detectProject, type ProjectInfo } from '../core/project-detect.js';
import { readConfig, SCHEMA_URL, CONFIG_FILE } from '../core/config.js';
import { installCommand } from '../core/package-manager.js';
import { assertClean } from '../core/git-guard.js';
import { writeProjectFile } from '../core/fs-safety.js';
import { unifiedDiff } from '../migrate/4to5/index.js';
import {
  mergeGlobalsCss, providersTsx, transformLayoutTsx, transformMainTsx,
  transformIndexHtml, NEXT_GLOBALS_CSS,
} from '../init/transforms.js';
import { DOCS_BASE_URL } from '../meta.js';

interface Write { path: string; content: string }
interface Plan { writes: Write[]; notes: string[] }

function layoutRel(cwd: string): string | null {
  for (const p of ['app/layout.tsx', 'app/layout.jsx', 'src/app/layout.tsx', 'src/app/layout.jsx']) {
    if (fs.existsSync(path.join(cwd, p))) return p;
  }
  /* fresh app router projects — create at the canonical location */
  return fs.existsSync(path.join(cwd, 'src/app')) ? 'src/app/layout.tsx' : 'app/layout.tsx';
}

function globalsCssRel(cwd: string, project: ProjectInfo): string | null {
  if (project.globalCss) return project.globalCss;
  return project.framework === 'next-app'
    ? (fs.existsSync(path.join(cwd, 'src/app')) ? 'src/app/globals.css' : 'app/globals.css')
    : project.framework === 'vite' ? 'src/index.css' : null;
}

function buildPlan(cwd: string, project: ProjectInfo): Plan {
  const writes: Write[] = [];
  const notes: string[] = [];
  const cj = (project.componentsJson ?? {}) as Record<string, unknown>;
  const cjAliases = (cj.aliases ?? {}) as Record<string, string>;
  const cjCss = typeof cj.css === 'string' ? cj.css : undefined;

  /* auraglass.json — reuse components.json aliases + css path */
  if (!readConfig(cwd)) {
    writes.push({
      path: CONFIG_FILE,
      content: `${JSON.stringify({
        $schema: SCHEMA_URL,
        registry: `${DOCS_BASE_URL}r`,
        aliases: {
          components: cjAliases.components ?? '@/components',
          utils: cjAliases.utils ?? '@/lib/utils',
        },
        css: { global: cjCss ?? globalsCssRel(cwd, project) ?? undefined },
        tailwind: project.tailwind.present ? { major: project.tailwind.major } : false,
        rsc: project.framework === 'next-app',
      }, null, 2)}\n`,
    });
  }

  if (project.framework === 'next-app') {
    const css = globalsCssRel(cwd, project);
    if (css) {
      const abs = path.join(cwd, css);
      const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
      const merged = mergeGlobalsCss(existing);
      if (merged !== existing) writes.push({ path: css, content: merged });
    }
    const layout = layoutRel(cwd);
    if (layout) {
      const abs = path.join(cwd, layout);
      const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
      const transformed = transformLayoutTsx(existing ?? (
        "export default function RootLayout({ children }: { children: React.ReactNode }) {\n" +
        "  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n"
      ));
      if (existing === null) writes.push({ path: layout, content: transformed ?? '' });
      else if (transformed !== null && transformed !== existing) writes.push({ path: layout, content: transformed });
    }
    const providers = path.dirname(layout ?? 'app/layout.tsx') + '/providers.tsx';
    const pAbs = path.join(cwd, providers);
    const pContent = providersTsx();
    if (!fs.existsSync(pAbs) || fs.readFileSync(pAbs, 'utf8') !== pContent) {
      writes.push({ path: providers, content: pContent });
    }
  } else if (project.framework === 'vite') {
    const main = ['src/main.tsx', 'src/main.jsx', 'src/main.ts', 'src/main.js']
      .find((p) => fs.existsSync(path.join(cwd, p)));
    if (main) {
      const existing = fs.readFileSync(path.join(cwd, main), 'utf8');
      const next = transformMainTsx(existing);
      if (next !== null) writes.push({ path: main, content: next });
    }
    const indexHtml = fs.existsSync(path.join(cwd, 'index.html'))
      ? fs.readFileSync(path.join(cwd, 'index.html'), 'utf8') : null;
    if (indexHtml !== null) {
      const next = transformIndexHtml(indexHtml);
      if (next !== null) writes.push({ path: 'index.html', content: next });
    }
    const css = globalsCssRel(cwd, project);
    if (css) {
      const abs = path.join(cwd, css);
      const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
      const merged = mergeGlobalsCss(existing);
      if (merged !== existing) writes.push({ path: css, content: merged });
    }
  } else if (project.framework === 'next-pages') {
    notes.push('Pages Router detected: add AuraGlassScript in pages/_document and wrap <Component/> in pages/_app — see the init guide.');
  } else if (project.framework === 'react-router') {
    notes.push('React Router detected: add the prepaint script to your HTML shell and wrap the root in AuraGlassProvider.');
  } else {
    notes.push('Unrecognized framework — wrote config only; add the styles import and provider manually.');
  }
  return { writes, notes };
}

export async function initCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  void args;
  const project = detectProject(cwd);
  const { writes, notes } = buildPlan(cwd, project);
  const install = installCommand(project.packageManager, ['aura-glass@^5.0.0']);
  const noInstall = Boolean(flags['no-install']);

  if (flags['dry-run']) {
    const diffs = writes.map((w) => {
      const abs = path.join(cwd, w.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      return { path: w.path, diff: unifiedDiff(w.path, before, w.content) };
    });
    if (out.json) printJson({ version: 1, project, diffs, install: noInstall ? null : install, notes });
    else for (const d of diffs) { if (!out.silent) process.stdout.write(`${d.diff}\n`); }
    return EXIT.ok;
  }

  /* idempotent: nothing to write means a completed init — 'no changes'. */
  if (writes.length === 0) {
    if (out.json) printJson({ version: 1, written: [], project, install, status: 'no changes' });
    else status(out, 'pass', 'no changes');
    return EXIT.ok;
  }

  assertClean(cwd, writes.map((w) => path.join(cwd, w.path)), {
    allowDirty: Boolean(flags['allow-dirty']),
    allowNoGit: Boolean(flags['allow-no-git']),
  });

  for (const w of writes) writeProjectFile(cwd, w.path, w.content);
  if (!noInstall) runInstall(cwd, install);

  if (out.json) printJson({ version: 1, written: writes.map((w) => w.path), project, install: noInstall ? null : install });
  else {
    status(out, 'pass', `initialized aura-glass (${project.framework})`);
    for (const w of writes) status(out, 'info', `wrote ${w.path}`);
    for (const n of notes) status(out, 'info', n);
    status(out, 'info', noInstall ? `install: skipped (--no-install) — run: ${install}` : `install: ${install}`);
  }
  return EXIT.ok;
}

function runInstall(cwd: string, install: string): void {
  /* never install optional peers — only the base package, via the detected pm */
  const [cmd, ...rest] = install.split(' ') as [string, ...string[]];
  try {
    execFileSync(cmd, rest, { cwd, stdio: 'inherit' });
  } catch (e) {
    throw new Error(`install failed: ${install} — run it manually (${(e as Error).message})`);
  }
}

export const _internals = { buildPlan, mergeGlobalsCss, NEXT_GLOBALS_CSS };
