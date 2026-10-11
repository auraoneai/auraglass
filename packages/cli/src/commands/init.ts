/** init (PLAT-305/308/309): detect project, install deps, write config + css import. */
import fs from 'node:fs';
import path from 'node:path';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT } from '../cli/errors.js';
import { detectProject } from '../core/project-detect.js';
import { readConfig, writeConfig } from '../core/config.js';
import { installCommand } from '../core/package-manager.js';
import { unifiedDiff } from '../migrate/4to5/index.js';
import { assertClean } from '../core/git-guard.js';
import { writeProjectFile } from '../core/fs-safety.js';

const CSS_IMPORT = "@import 'aura-glass/styles.css';\n";
const LAYER = '@layer theme, base, ag, components, utilities;\n';

export async function initCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  void args;
  const project = detectProject(cwd);
  const writes: string[] = [];
  const plan: string[] = [];

  // auraglass.json
  if (!readConfig(cwd)) {
    writes.push('auraglass.json');
    plan.push('write auraglass.json');
  }
  // css import + layer statement
  const cssFile = project.globalCss ?? (project.framework === 'next-app' ? 'app/globals.css' : project.framework === 'vite' ? 'src/index.css' : null);
  if (cssFile) {
    const abs = path.join(cwd, cssFile);
    const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
    if (!existing.includes('aura-glass/styles.css')) {
      writes.push(cssFile);
      plan.push(`prepend ${CSS_IMPORT.trim()} + layer statement to ${cssFile}`);
    }
  }
  // layout provider seam for next
  const install = installCommand(project.packageManager, ['aura-glass@^5.0.0']);
  plan.push(install);

  const plannedWrites: Array<{ path: string; content: string }> = [];
  if (!readConfig(cwd)) {
    plannedWrites.push({ path: 'auraglass.json', content: `${JSON.stringify({
      framework: project.framework,
      components: 'components/aura',
      aliases: { components: '@/components' },
      css: project.globalCss ? { global: project.globalCss } : {},
    }, null, 2)}\n` });
  }
  if (cssFile) {
    const abs = path.join(cwd, cssFile);
    const existing = fs.existsSync(abs) ? `${fs.readFileSync(abs, 'utf8')}` : '';
    if (!existing.includes('aura-glass/styles.css')) {
      
      plannedWrites.push({ path: cssFile, content: `${CSS_IMPORT}${existing.includes('@layer') ? '' : LAYER}\n${existing}` });
    }
  }

  if (flags['dry-run']) {
    const diffs = plannedWrites.map((w) => {
      const abs = path.join(cwd, w.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      return { path: w.path, diff: unifiedDiff(w.path, before, w.content) };
    });
    if (out.json) printJson({ version: 1, plan, project, diffs });
    else for (const d of diffs) { if (!out.silent) process.stdout.write(`${d.diff}\n`); }
    return EXIT.ok;
  }

  assertClean(cwd, plannedWrites.map((w) => path.join(cwd, w.path)), {
    allowDirty: Boolean(flags['allow-dirty']),
    allowNoGit: Boolean(flags['allow-no-git']) || plannedWrites.length === 0,
  });

  for (const w of plannedWrites) writeProjectFile(cwd, w.path, w.content);
  if (out.json) printJson({ version: 1, written: writes, project, install });
  else {
    status(out, 'pass', `initialized aura-glass (${project.framework})`);
    for (const w of writes) status(out, 'info', `wrote ${w}`);
    status(out, 'info', `install: ${install}`);
  }
  return EXIT.ok;
}
