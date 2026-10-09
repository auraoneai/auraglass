/**
 * add (PLAT-308/310): fetch a registry item, resolve registryDependencies
 * depth-first (cycle -> exit 1), rewrite @/ aliases to the project's tsconfig
 * paths, write files inside cwd with provenance stamps, merge cssVars under
 * @layer ag, add 'use client' iff meta.auraglass.client === true.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, CliError, usageError } from '../cli/errors.js';
import { fetchItem } from '../registry/client.js';
import type { RegistryItem } from '../registry/schema.js';
import { detectProject } from '../core/project-detect.js';
import { readConfig } from '../core/config.js';
import { unifiedDiff } from '../migrate/4to5/index.js';
import { assertClean } from '../core/git-guard.js';
import { ensureInsideCwd, atomicWrite } from '../core/fs-safety.js';

function sha256(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

async function fetchTree(name: string, registry: string | undefined, seen: Set<string>, order: RegistryItem[]): Promise<RegistryItem[]> {
  if (seen.has(name)) {
    throw new CliError(`registry dependency cycle at '${name}'`, EXIT.validation);
  }
  seen.add(name);
  const item = await fetchItem(name, registry);
  for (const dep of item.registryDependencies ?? []) {
    await fetchTree(dep, registry, seen, order);
  }
  order.push(item);
  return order;
}

function stampFor(target: string, name: string, version: string, hash: string): string {
  return /\.css$/.test(target)
    ? `/* @auraglass/registry ${name}@${version} sha256:${hash} */\n`
    : `// @auraglass/registry ${name}@${version} sha256:${hash}\n`;
}

export function rewriteAliases(content: string, aliasPrefix: string, componentsDir: string): string {
  return content
    .replace(/(['"])@\/components\/ui\//g, `$1${componentsDir}/`)
    .replace(/(['"])@\/components\//g, `$1${componentsDir}/`)
    .replace(/(['"])@\//g, `$1${aliasPrefix}/`);
}

export async function addCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  const [name] = args;
  if (!name) throw usageError('add <name> expected');
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const dryRun = Boolean(flags['dry-run']);
  const project = detectProject(cwd);
  const config = readConfig(cwd);
  const componentsDir = String(config?.components ?? (project.componentsJson?.aliases as { ui?: string } | undefined)?.ui ?? 'components/aura').replace(/^@\//, '').replace(/\/$/, '');
  const aliasPrefix = '@';

  const seen = new Set<string>();
  const order: RegistryItem[] = [];
  await fetchTree(name, registry, seen, order);

  const planned: Array<{ path: string; content: string }> = [];
  for (const item of order) {
    const version = String((item as { version?: string }).version ?? '0.0.0');
    const metaClient = item.meta?.auraglass?.client === true;
    for (const f of item.files ?? []) {
      if (!f.path || f.content === undefined) continue;
      let content = rewriteAliases(f.content, aliasPrefix, componentsDir);
      const target = f.target ?? path.join(componentsDir, item.name, f.path);
      if (/\.(tsx?|jsx?)$/.test(f.path) && metaClient && !content.startsWith("'use client'") && !content.startsWith('"use client"')) {
        content = `'use client';\n${content}`;
      }
      content = stampFor(target, item.name, version, sha256(f.content)) + content;
      planned.push({ path: target, content });
    }
    // cssVars merge under @layer ag
    if (item.cssVars && Object.keys(item.cssVars).length) {
      const cssTarget = 'styles/auraglass-registry.css';
      const blocks = Object.entries(item.cssVars)
        .map(([scope, vars]) => `  ${scope} {\n${Object.entries(vars).map(([k, v]) => `    ${k}: ${v};`).join('\n')}\n  }`)
        .join('\n');
      let changesCss = false;
      planned.push({ path: cssTarget, content: `@layer ag {\n${blocks}\n}\n` });
      changesCss = true;
    }
  }

  if (dryRun) {
    const diffs = planned.map((p: any) => {
      const abs = path.join(cwd, p.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      return { path: p.path, diff: unifiedDiff(p.path, before, p.content) };
    });
    if (out.json) printJson({ version: 1, dryRun: true, files: diffs.map((d) => d.path), diffs: diffs.map((d) => ({ path: d.path, diff: d.diff })) });
    else for (const d of diffs) { if (!out.silent) process.stdout.write(`${d.diff}\n`); }
    return EXIT.ok;
  }

  assertClean(cwd, planned.map((p: any) => path.join(cwd, p.path)), {
    allowDirty: Boolean(flags['allow-dirty']),
    allowNoGit: Boolean(flags['allow-no-git']),
  });
  for (const p of planned) {
    const dest = ensureInsideCwd(cwd, p.path);
    atomicWrite(cwd, dest, p.content);
  }
  if (out.json) printJson({ version: 1, added: order.map((i) => i.name), files: planned.map((p: any) => p.path) });
  else {
    status(out, 'pass', `added ${order.map((i) => i.name).join(', ')}`);
    for (const p of planned) status(out, 'info', `wrote ${p.path}`);
  }
  return EXIT.ok;
}

