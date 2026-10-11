/**
 * migrate 4to5 engine (PLAT-320..339). Transform order is frozen:
 * imports-subpaths -> providers -> canonical-names -> prop-grammar ->
 * area transforms (AREA_CODEMODS order) -> dead-optical-props ->
 * css-vars -> deps -> removed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadCompiledMappings, type CompiledMappings } from './mappings.js';
export { loadCompiledMappings };
export type { CompiledMappings };
import type { FileUnit, Transform, TransformResult } from './transforms/shared.js';
import { CODE_EXTS, CSS_EXTS } from './transforms/shared.js';
import { importsSubpaths } from './transforms/imports-subpaths.js';
import { providers } from './transforms/providers.js';
import { canonicalNames } from './transforms/canonical-names.js';
import { propGrammar } from './transforms/prop-grammar.js';
import { aiChat } from './transforms/ai-chat.js';
import { appShellSlots } from './transforms/app-shell-slots.js';
import { mediaBackdrops } from './transforms/media-backdrops.js';
import { reducedMotionInitial } from './transforms/reduced-motion-initial.js';
import { motionImports } from './transforms/motion-imports.js';
import { motionProps } from './transforms/motion-props.js';
import { deadOpticalProps } from './transforms/dead-optical-props.js';
import { cssVars } from './transforms/css-vars.js';
import { deps } from './transforms/deps.js';
import { removed } from './transforms/removed.js';
import { nearestPackageJson } from './transforms/deps.js';
import { findTodos, lineOf, type TodoItem } from './todo.js';
import { usageError } from '../../cli/errors.js';
import { PACKAGE_VERSION } from '../../meta.js';

export const CORE_ORDER = [
  'imports-subpaths', 'providers', 'canonical-names', 'prop-grammar',
] as const;
export const AREA_ORDER = [
  'ai-chat', 'app-shell-slots', 'media-backdrops',
  'reduced-motion-initial', 'motion-imports', 'motion-props',
] as const;
export const TAIL_ORDER = ['dead-optical-props', 'css-vars', 'deps', 'removed'] as const;
export const TRANSFORM_ORDER: readonly string[] = [...CORE_ORDER, ...AREA_ORDER, ...TAIL_ORDER];

const REGISTRY: Record<string, Transform> = {
  'imports-subpaths': importsSubpaths,
  providers,
  'canonical-names': canonicalNames,
  'prop-grammar': propGrammar,
  'ai-chat': aiChat,
  'app-shell-slots': appShellSlots,
  'media-backdrops': mediaBackdrops,
  'reduced-motion-initial': reducedMotionInitial,
  'motion-imports': motionImports,
  'motion-props': motionProps,
  'dead-optical-props': deadOpticalProps,
  'css-vars': cssVars,
  deps,
  removed,
};

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.turbo', 'storybook-static']);

export interface FileReport {
  path: string;
  changes: Array<{ transform: string; description: string; line: number | null; before: string | null; after: string | null }>;
  todos: TodoItem[];
}

export interface MigrateReport {
  version: number;
  cliVersion: string;
  transforms: string[];
  files: FileReport[];
  summary: { filesChanged: number; changes: number; todos: number };
}

export function unifiedDiff(rel: string, before: string, after: string): string {
  const a = before.split('\n');
  const b = after.split('\n');
  const lines: string[] = [`--- a/${rel}`, `+++ b/${rel}`];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i += 1) {
    if (a[i] === b[i]) continue;
    lines.push('@@');
    break;
  }
  for (let i = 0; i < max; i += 1) {
    if (a[i] === b[i]) { if (a[i] !== undefined) lines.push(' ' + a[i]); continue; }
    if (a[i] !== undefined) lines.push('-' + a[i]);
    if (b[i] !== undefined) lines.push('+' + b[i]);
  }
  return lines.join('\n');
}

export interface RunOptions {
  cwd: string;
  transforms?: string[] | undefined;
  dryRun?: boolean;
  allowTodo?: boolean;
  write?: (abs: string, contents: string) => void;
  /** optional path roots (project-relative); defaults to the whole tree. */
  paths?: string[] | undefined;
}

/** Minimal .gitignore matcher: dir names, `*.ext`, leading-slash, `**`. */
function gitignoreMatcher(patterns: string[]): (rel: string, isDir: boolean) => boolean {
  const rules = patterns
    .map((p: any) => p.trim())
    .filter((p: any) => p && !p.startsWith('#') && !p.startsWith('!'));
  const toRe = (p: string): RegExp => {
    let s = p;
    const dirOnly = s.endsWith('/');
    if (dirOnly) s = s.slice(0, -1);
    const anchored = s.startsWith('/');
    if (anchored) s = s.slice(1);
    const esc = s
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '[^/]*')
      .replace(//g, '.*');
    const base = anchored ? `^${esc}` : `(^|/)${esc}`;
    return new RegExp(dirOnly ? `${base}(/|$)` : `${base}$`);
  };
  const res = rules.map(toRe);
  return (rel) => res.some((r: any) => r.test(rel));
}

function loadIgnores(cwd: string): (rel: string, isDir: boolean) => boolean {
  const patterns: string[] = [];
  try {
    patterns.push(...fs.readFileSync(path.join(cwd, '.gitignore'), 'utf8').split('\n'));
  } catch { /* none */ }
  const match = gitignoreMatcher(patterns);
  return (rel, isDir) => {
    const seg = rel.split('/');
    if (seg.some((s: any) => SKIP_DIRS.has(s))) return true;
    return match(rel, isDir);
  };
}

export function walkFiles(cwd: string, roots?: string[]): string[] {
  const ignored = loadIgnores(cwd);
  const out: string[] = [];
  const dirs = roots?.length ? roots.map((r: any) => path.join(cwd, r)) : [cwd];
  const stack = [...dirs];
  while (stack.length) {
    const dir = stack.pop()!;
    let ents: fs.Dirent[];
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch { continue; }
    for (const ent of ents) {
      const abs = path.join(dir, ent.name);
      const rel = path.relative(cwd, abs).split(path.sep).join('/');
      if (ignored(rel, ent.isDirectory())) continue;
      if (ent.isDirectory()) stack.push(abs);
      else if (ent.isFile()) out.push(abs);
    }
  }
  return out.sort();
}

function kindOf(rel: string): FileUnit['kind'] {
  const ext = path.extname(rel).toLowerCase();
  if (CODE_EXTS.has(ext)) return 'code';
  if (CSS_EXTS.has(ext)) return 'css';
  if (ext === '.json') return 'json';
  return 'skip';
}

export function runOnSource(
  unit: FileUnit,
  transforms: Transform[],
  ctx: { mappings: CompiledMappings; docBase: string },
): { final: string; changes: FileReport['changes']; todos: TodoItem[] } {
  let src = unit.source;
  const changes: FileReport['changes'] = [];
  const todos: TodoItem[] = [];
  for (const t of transforms) {
    const r = t.run({ ...unit, source: src }, { file: { ...unit, source: src }, mappings: ctx.mappings, docBase: ctx.docBase });
    src = r.source;
    for (const c of r.changes) changes.push({ ...c, line: c.line ?? null, before: c.before ?? null, after: c.after ?? null });
    for (const td of r.todos) todos.push(td);
  }
  return { final: src, changes, todos };
}

export function selectTransforms(only?: string[]): Transform[] {
  const order = TRANSFORM_ORDER;
  const wanted = only?.length ? new Set(only) : null;
  const bad = only?.filter((t: any) => !REGISTRY[t]);
  if (bad?.length) {
    throw usageError(`unknown transform: ${bad.join(', ')} (known: ${order.join(', ')})`);
  }
  return order.filter((id) => !wanted || wanted.has(id)).map((id) => REGISTRY[id]!);
}

export function runMigration(opts: RunOptions): { report: MigrateReport; writes: Map<string, string>; diffs: Map<string, string>; hasTodos: boolean } {
  const mappings = loadCompiledMappings();
  const transforms = selectTransforms(opts.transforms);
  const writes = new Map<string, string>();
  const diffs = new Map<string, string>();
  const files: FileReport[] = [];
  const hasDeps = transforms.some((t: any) => t.id === 'deps');
  const extraPkgJsons = new Set<string>();

  const roots: string[] | undefined = opts.paths?.length ? opts.paths : undefined;
  for (const abs of walkFiles(opts.cwd, roots)) {
    const rel = path.relative(opts.cwd, abs).split(path.sep).join('/');
    const kind = kindOf(rel);
    if (kind === 'skip') continue;
    if (kind === 'json' && !rel.endsWith('package.json')) continue;
    let source: string;
    try {
      source = fs.readFileSync(abs, 'utf8');
    } catch { continue; }
    const unit: FileUnit = { path: rel, abs, kind, source };
    const { final, changes, todos } = runOnSource(unit, transforms, { mappings, docBase: 'docs/auraglass-5' });
    if (final !== source || todos.length) {
      files.push({ path: rel, changes, todos });
    }
    if (final !== source) { if (opts.dryRun) diffs.set(rel, unifiedDiff(rel, source, final)); else writes.set(abs, final); }
    if (hasDeps && kind !== 'json') extraPkgJsons.add(abs);
  }
  // deps: touch the nearest package.json of every changed code file.
  if (hasDeps) {
    const pkgJson = nearestPackageJson(opts.cwd, opts.cwd);
    if (pkgJson) {
      const rel = path.relative(opts.cwd, pkgJson);
      const source = fs.readFileSync(pkgJson, 'utf8');
      const unit: FileUnit = { path: rel, abs: pkgJson, kind: 'json', source };
      const { final, changes, todos } = runOnSource(unit, transforms, { mappings, docBase: 'docs/auraglass-5' });
      if (final !== source || todos.length) {
        const existing = files.find((f) => f.path === rel);
        if (existing) { existing.changes.push(...changes); existing.todos.push(...todos); }
        else files.push({ path: rel, changes, todos });
        if (final !== source) { if (opts.dryRun) diffs.set(rel, unifiedDiff(rel, source, final)); else writes.set(pkgJson, final); }
      }
    }
  }
  // Line numbers for JSON-mode todos.
  for (const f of files) {
    for (const t of f.todos) {
      const abs = path.join(opts.cwd, f.path);
      try {
        const src = writes.get(abs) ?? fs.readFileSync(abs, 'utf8');
        const idx = src.indexOf('TODO(aura-glass 5):');
        if (idx >= 0) t.line ??= lineOf(src, idx);
      } catch { /* skip */ }
    }
  }
  const summary = {
    filesChanged: files.filter((f) => f.changes.length > 0).length,
    changes: files.reduce((n, f) => n + f.changes.length, 0),
    todos: files.reduce((n, f) => n + f.todos.length, 0),
  };
  const report: MigrateReport = {
    version: 1,
    cliVersion: PACKAGE_VERSION,
    transforms: transforms.map((t: any) => t.id),
    files,
    summary,
  };
  return { report, writes, diffs, hasTodos: summary.todos > 0 || files.some((f) => findTodos(f.path).length > 0) };
}
