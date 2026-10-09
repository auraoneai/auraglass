/**
 * add (PLAT-87): fetch a registry item, validate against the vendored shadcn
 * v4 schema + meta.auraglass, resolve registryDependencies DFS with
 * visiting/done sets (cycle -> exit 1 with the path; shared deps deduped),
 * write files under configured aliases honouring `target`, rewrite
 * `@/components/...` imports, insert 'use client' iff meta.auraglass.client,
 * merge cssVars into the configured CSS file under a single `@layer ag`,
 * collect dependencies and run the install unless --no-install, and stamp
 * '// @auraglass/registry <name>@<version> sha256:<64hex>'.
 *
 * `add <component> --source` ejects `aura-glass-src/<component>` into
 * aliases.components/<slug>/ with internal imports rewritten to public
 * subpaths (each must resolve through installed aura-glass exports);
 * forbidden literals rejected; T0 (Surface/SurfaceGroup/Environment) refused.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, CliError, usageError } from '../cli/errors.js';
import { fetchItem } from '../registry/client.js';
import type { RegistryItem } from '../registry/schema.js';
import { detectProject } from '../core/project-detect.js';
import { readConfig } from '../core/config.js';
import { installCommand } from '../core/package-manager.js';
import { unifiedDiff } from '../migrate/4to5/index.js';
import { assertClean } from '../core/git-guard.js';
import { ensureInsideCwd, atomicWrite } from '../core/fs-safety.js';

function sha256(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

/** DFS with a visiting stack + done set: shared deps deduped, a true cycle
 *  reports the path 'a -> b -> a' and exits 1. */
async function fetchTree(
  name: string,
  registry: string | undefined,
  visiting: Set<string>,
  order: RegistryItem[],
  done: Set<string>,
  chain: string[],
): Promise<RegistryItem[]> {
  if (done.has(name)) return order;
  if (visiting.has(name)) {
    const cycle = [...chain.slice(chain.indexOf(name)), name].join(' -> ');
    throw new CliError(`registry dependency cycle: ${cycle}`, EXIT.validation);
  }
  visiting.add(name);
  chain.push(name);
  const item = await fetchItem(name, registry);
  for (const dep of item.registryDependencies ?? []) {
    await fetchTree(dep, registry, visiting, order, done, chain);
  }
  chain.pop();
  visiting.delete(name);
  done.add(name);
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

/** Merge cssVars scopes into an existing CSS document under ONE `@layer ag`
 *  block with key-level dedupe. Existing keys win (local overrides survive);
 *  new keys are appended in-declaration-order. */
export function mergeCssVars(existing: string, cssVars: Record<string, Record<string, string>>): string {
  const layerRe = /@layer\s+ag\s*\{([\s\S]*?)\}\s*$/;
  const scopes = new Map<string, Map<string, string>>();
  const m = existing.match(layerRe);
  let base = existing;
  if (m) {
    base = existing.slice(0, m.index);
    const inner = m[1]!;
    const scopeRe = /(^|\n)\s*([^{}\n]+?)\s*\{([^}]*)\}/g;
    let s;
    while ((s = scopeRe.exec(inner))) {
      const name = s[2]!.trim();
      const vars = new Map<string, string>();
      for (const decl of s[3]!.split(';')) {
        const kv = decl.split(':');
        if (kv.length >= 2 && kv[0]!.trim()) vars.set(kv[0]!.trim(), kv.slice(1).join(':').trim());
      }
      scopes.set(name, vars);
    }
  }
  for (const [scope, vars] of Object.entries(cssVars)) {
    const cur = scopes.get(scope) ?? new Map<string, string>();
    for (const [k, v] of Object.entries(vars)) if (!cur.has(k)) cur.set(k, v);
    scopes.set(scope, cur);
  }
  const block = '@layer ag {\n' +
    [...scopes.entries()]
      .map(([scope, vars]) => `  ${scope} {\n${[...vars.entries()].map(([k, v]) => `    ${k}: ${v};`).join('\n')}\n  }`)
      .join('\n') +
    '\n}\n';
  return base.trimEnd() ? `${base.trimEnd()}\n\n${block}` : block;
}

/* ---- --source eject (PLAT-87/DX-033) ---- */

/** T0 material surfaces stay centrally upgradeable — never ejectable. */
const T0_SLUGS = new Set(['surface', 'surface-group', 'environment']);
const FORBIDDEN_LITERAL = /backdrop-filter|rgba\s*\(|#[0-9a-fA-F]{3,8}\b|blur\s*\(/;

const toSlug = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();

/** Rewrite internal imports in ejected source to public aura-glass subpaths,
 *  then verify each resolves through the installed package's exports map. */
function rewriteEjectedImports(
  source: string,
  exportsMap: Record<string, unknown>,
): { content: string; unresolved: string[] } {
  const unresolved: string[] = [];
  const subpathFor = (internal: string): string => {
    /* '@aura/internal/x' or '../../x' aren't present in src items — the real
       mapping is aura-glass internals like 'aura-glass/components/x' or
       relative 'src/...' references rewritten by DX-098's eject-source.
       Accept an explicit map on the item plus these default rules. */
    const cleaned = internal
      .replace(/^(?:\.\.\/)+/, '')
      .replace(/^\.\//, '')
      .replace(/^src\//, '')
      .replace(/\.(tsx?|jsx?|css)$/, '');
    const segs = cleaned.split('/');
    /* map known top dirs to public subpaths */
    const top = segs[0];
    if (top === 'components' || top === 'theme' || top === 'material' ||
        top === 'icons' || top === 'utils' || top === 'lib' ||
        top === 'hooks' || top === 'tokens' || top === 'a11y' ||
        top === 'motion' || top === 'media' || top === 'navigation' ||
        top === 'overlay' || top === 'data' || top === 'layout' ||
        top === 'surfaces' || top === 'compat' || top === 'app-shell') {
      return `aura-glass/${top}`;
    }
    /* unknown internal — map to its full cleaned subpath; it will only
       resolve if that exact export exists. */
    return `aura-glass/${cleaned}`;
  };
  const content = source.replace(
    /from\s+['"]([^'"]+)['"]/g,
    (match, spec: string) => {
      if (spec.startsWith('aura-glass/')) return match.replace(spec, spec);
      if (spec.startsWith('./') || spec.startsWith('../') || spec.startsWith('@/')) {
        const pub = subpathFor(spec);
        const key = `./${pub.replace(/^aura-glass\//, '')}`;
        if (!(key in exportsMap) && !('./' in exportsMap && pub === 'aura-glass')) {
          unresolved.push(`${spec} -> ${pub}`);
        }
        return `from '${pub}'`;
      }
      return match;
    },
  );
  return { content, unresolved };
}

function installedAuraExports(cwd: string): Record<string, unknown> | null {
  for (const cand of [
    path.join(cwd, 'node_modules', 'aura-glass', 'package.json'),
    path.join(cwd, '..', '..', 'package.json'), /* in-repo testing */
  ]) {
    try {
      const pkg = JSON.parse(fs.readFileSync(cand, 'utf8')) as { name?: string; exports?: Record<string, unknown> };
      if (pkg.name === 'aura-glass' && pkg.exports) return pkg.exports;
    } catch { /* keep looking */ }
  }
  return null;
}

export async function addCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  const [name] = args;
  if (!name) throw usageError('add <name> expected');
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const dryRun = Boolean(flags['dry-run']);
  const sourceMode = Boolean(flags.source);
  const project = detectProject(cwd);
  const config = readConfig(cwd);
  const cjAliases = (project.componentsJson?.aliases ?? {}) as Record<string, string>;
  const cfgAliases = (config?.aliases ?? {}) as Record<string, string>;
  const componentsDir = String(
    cfgAliases.components ?? cjAliases.components ?? cjAliases.ui ?? 'components/aura',
  ).replace(/^@\//, '').replace(/\/$/, '');
  const aliasPrefix = '@';

  if (sourceMode) {
    return addSource(cwd, name, out, flags, componentsDir);
  }

  const order = await fetchTree(name, registry, new Set(), [], new Set(), []);

  const planned: Array<{ path: string; content: string }> = [];
  const deps = new Set<string>();
  const cssVarAcc: Record<string, Record<string, string>> = {};
  for (const item of order) {
    const version = String((item as { version?: string }).version ?? '0.0.0');
    const metaClient = item.meta?.auraglass?.client === true;
    for (const d of item.dependencies ?? []) deps.add(d);
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
    /* accumulate cssVars across all resolved items -> ONE merged write */
    for (const [scope, vars] of Object.entries(item.cssVars ?? {})) {
      cssVarAcc[scope] = { ...(cssVarAcc[scope] ?? {}), ...vars };
    }
  }
  if (Object.keys(cssVarAcc).length) {
    const cssTarget = (config?.css?.global as string | undefined)
      ?? (project.componentsJson?.css as string | undefined)
      ?? 'styles/auraglass-registry.css';
    const abs = path.join(cwd, cssTarget);
    const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
    planned.push({ path: cssTarget, content: mergeCssVars(existing, cssVarAcc) });
  }

  const install = deps.size ? installCommand(project.packageManager, [...deps].sort()) : null;

  if (dryRun) {
    const diffs = planned.map((p) => {
      const abs = path.join(cwd, p.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      return { path: p.path, diff: unifiedDiff(p.path, before, p.content) };
    });
    if (out.json) printJson({ version: 1, dryRun: true, files: diffs.map((d) => d.path), diffs, install });
    else for (const d of diffs) { if (!out.silent) process.stdout.write(`${d.diff}\n`); }
    return EXIT.ok;
  }

  assertClean(cwd, planned.map((p) => path.join(cwd, p.path)), {
    allowDirty: Boolean(flags['allow-dirty']),
    allowNoGit: Boolean(flags['allow-no-git']),
  });
  for (const p of planned) {
    const dest = ensureInsideCwd(cwd, p.path);
    atomicWrite(cwd, dest, p.content);
  }
  if (install && !flags['no-install']) {
    const [cmd, ...rest] = install.split(' ') as [string, ...string[]];
    try { execFileSync(cmd, rest, { cwd, stdio: 'inherit' }); }
    catch (e) { status(out, 'warn', `install failed — run manually: ${install} (${(e as Error).message})`); }
  }
  if (out.json) printJson({ version: 1, added: order.map((i) => i.name), files: planned.map((p) => p.path), install });
  else {
    status(out, 'pass', `added ${order.map((i) => i.name).join(', ')}`);
    for (const p of planned) status(out, 'info', `wrote ${p.path}`);
    if (install) status(out, 'info', flags['no-install'] ? `install: skipped — run: ${install}` : `installed: ${install}`);
  }
  return EXIT.ok;
}

async function addSource(
  cwd: string,
  name: string,
  out: ReturnType<typeof makeOut>,
  flags: Record<string, string | boolean>,
  componentsDir: string,
): Promise<number> {
  const slug = toSlug(name);
  if (T0_SLUGS.has(slug)) {
    throw new CliError(`not ejectable: ${name} — material stays centrally upgradeable (T0)`, EXIT.validation);
  }
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const srcName = `aura-glass-src/${slug}`;
  const item = await fetchItem(srcName, registry);
  const exportsMap = installedAuraExports(cwd);
  if (!exportsMap) {
    throw new CliError('aura-glass is not installed — eject requires the package exports map', EXIT.validation);
  }

  const planned: Array<{ path: string; content: string }> = [];
  const unresolved: string[] = [];
  const forbiddenHits: string[] = [];
  for (const f of item.files ?? []) {
    if (!f.path || f.content === undefined) continue;
    const { content, unresolved: u } = rewriteEjectedImports(f.content, exportsMap);
    unresolved.push(...u);
    if (FORBIDDEN_LITERAL.test(content)) {
      const m = content.match(FORBIDDEN_LITERAL);
      forbiddenHits.push(`${f.path}: ${m?.[0]}`);
    }
    const version = String((item as { version?: string }).version ?? '0.0.0');
    const stamp = `// @auraglass/ejected aura-glass-src/${slug}@${version} sha256:${sha256(content)}\n`;
    planned.push({ path: path.join(componentsDir, slug, path.basename(f.path)), content: stamp + content });
  }
  if (unresolved.length) {
    throw new CliError(`ejected imports do not resolve through aura-glass exports: ${unresolved.join(', ')}`, EXIT.validation);
  }
  if (forbiddenHits.length) {
    throw new CliError(`ejected source contains forbidden literals: ${forbiddenHits.join('; ')}`, EXIT.validation);
  }

  if (flags['dry-run']) {
    if (out.json) printJson({ version: 1, dryRun: true, source: srcName, files: planned.map((p) => p.path) });
    else for (const p of planned) status(out, 'info', `would write ${p.path}`);
    return EXIT.ok;
  }
  assertClean(cwd, planned.map((p) => path.join(cwd, p.path)), {
    allowDirty: Boolean(flags['allow-dirty']),
    allowNoGit: Boolean(flags['allow-no-git']),
  });
  for (const p of planned) {
    atomicWrite(cwd, ensureInsideCwd(cwd, p.path), p.content);
  }
  if (out.json) printJson({ version: 1, ejected: srcName, files: planned.map((p) => p.path) });
  else {
    status(out, 'pass', `ejected ${srcName} (${planned.length} file(s))`);
    for (const p of planned) status(out, 'info', `wrote ${p.path}`);
  }
  return EXIT.ok;
}
