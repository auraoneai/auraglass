/** init (PLAT-305/308/309): detect project, install deps, write config + css import. */
import fs from 'node:fs';
import path from 'node:path';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT } from '../cli/errors.js';
import { detectProject } from '../core/project-detect.js';
import { readConfig, writeConfig } from '../core/config.js';
import { installCommand } from '../core/package-manager.js';
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

  if (flags['dry-run']) {
    if (out.json) printJson({ version: 1, plan, project });
    else for (const p of plan) status(out, 'info', `would ${p}`);
    return EXIT.ok;
  }

  assertClean(cwd, writes.map((w) => path.join(cwd, w)), {
    allowDirty: Boolean(flags['allow-dirty']),
    allowNoGit: Boolean(flags['allow-no-git']) || writes.length === 0,
  });

  if (!readConfig(cwd)) {
    writeConfig(cwd, {
      framework: project.framework,
      components: 'components/aura',
      aliases: { components: '@/components' },
      css: project.globalCss ? { global: project.globalCss } : {},
    });
  }
  if (cssFile) {
    const abs = path.join(cwd, cssFile);
    const existing = fs.existsSync(abs) ? `${fs.readFileSync(abs, 'utf8')}` : '';
    if (!existing.includes('aura-glass/styles.css')) {
      writeProjectFile(cwd, cssFile, `${CSS_IMPORT}${existing.includes('@layer') ? '' : LAYER}\n${existing}`);
    }
  }
  if (out.json) printJson({ version: 1, written: writes, project, install });
  else {
    status(out, 'pass', `initialized aura-glass (${project.framework})`);
    for (const w of writes) status(out, 'info', `wrote ${w}`);
    status(out, 'info', `install: ${install}`);
  }
  return EXIT.ok;
}
