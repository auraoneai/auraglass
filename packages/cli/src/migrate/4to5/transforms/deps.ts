/**
 * deps (B7): update the nearest package.json to the consumer — bump
 * aura-glass to ^5, remove deleted 4.x runtime deps the merged `deps` table
 * marks for removal, and add deps the consumer now uses transitively.
 * Idempotent: already-declared entries are left alone.
 */
import path from 'node:path';
import fs from 'node:fs';
import type { FileUnit, Transform, TransformCtx, TransformResult } from './shared.js';

const AURA_DEPS = new Set(['aura-glass', '@auraglass/core', '@auraglass/react']);

function applyPackageJson(source: string, ctx: TransformCtx): TransformResult {
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(source) as Record<string, unknown>;
  } catch {
    return { source, changes, todos };
  }
  let touched = false;
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
    const deps = pkg[field] as Record<string, string> | undefined;
    if (!deps) continue;
    if (AURA_DEPS.has('aura-glass') && deps['aura-glass']) {
      const cur = deps['aura-glass'];
      if (/^[~^]?[0-4][\d.]/.test(cur) || /file:|link:|workspace:/.test(cur)) {
        deps['aura-glass'] = '^5.0.0';
        changes.push({ transform: 'deps', description: `aura-glass ${cur} -> ^5.0.0` });
        touched = true;
      }
    }
    for (const row of ctx.mappings.deps) {
      if (!(row.pkg in deps)) continue;
      const when = row.when ?? 'consumer direct import — remove';
      if (/remove/i.test(when)) {
        delete deps[row.pkg];
        changes.push({ transform: 'deps', description: `remove ${row.pkg}` });
        touched = true;
      } else if (row.range && deps[row.pkg] !== row.range) {
        deps[row.pkg] = row.range;
        changes.push({ transform: 'deps', description: `${row.pkg} -> ${row.range}` });
        touched = true;
      } else if (!row.range) {
        const resolved = resolveLockVersion(path.dirname(String((ctx.file as { abs?: string }).abs ?? '.')), row.pkg);
        if (resolved && deps[row.pkg] !== `^${resolved}`) {
          deps[row.pkg] = `^${resolved}`;
          changes.push({ transform: 'deps', description: `${row.pkg} -> ^${resolved} (lockfile)` });
          touched = true;
        } else if (!resolved) {
          todos.push({ transform: 'deps', reason: `${row.pkg} has no mapped range and no lockfile — pin a 5.0-compatible version manually`, doc: 'docs/auraglass-5/migration/4to5.md' });
        }
      }
    }
  }
  const out = touched ? `${JSON.stringify(pkg, null, 2)}\n` : source;
  return { source: out, changes, todos };
}

/** Resolve the version installed for `pkg` from the consumer's lockfile
 * (package-lock.json / pnpm-lock.yaml / yarn.lock), or null when absent. */
export function resolveLockVersion(dir: string, pkg: string): string | null {
  const pl = path.join(dir, 'package-lock.json');
  if (fs.existsSync(pl)) {
    try {
      const lock = JSON.parse(fs.readFileSync(pl, 'utf8')) as { packages?: Record<string, { version?: string }> };
      const v = lock.packages?.[`node_modules/${pkg}`]?.version;
      if (v) return v;
    } catch { /* fall through */ }
  }
  const pnpm = path.join(dir, 'pnpm-lock.yaml');
  if (fs.existsSync(pnpm)) {
    const m = fs.readFileSync(pnpm, 'utf8').match(new RegExp(`/${pkg.replace(/[/@]/g, (c) => `\\${c}`)}@([0-9][\\w.\\-+~]*)`));
    if (m) return m[1]!;
  }
  const yarn = path.join(dir, 'yarn.lock');
  if (fs.existsSync(yarn)) {
    const m = fs.readFileSync(yarn, 'utf8').match(new RegExp(`"?${pkg.replace(/[/@]/g, (c) => `\\${c}`)}@[^:\\n]*:\\n(?:\\s+[^\\n]+\\n)*?\\s+version "([^"]+)"`));
    if (m) return m[1]!;
  }
  return null;
}

/** Find the package.json nearest to `from` (dir upward, bounded by cwd). */
export function nearestPackageJson(from: string, cwd: string): string | null {
  let dir = fs.statSync(from).isDirectory() ? from : path.dirname(from);
  const stop = path.resolve(cwd);
  for (;;) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) return candidate;
    if (dir === stop || dir === path.dirname(dir)) return null;
    dir = path.dirname(dir);
  }
}

export const deps: Transform = {
  id: 'deps',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    // Engine only feeds package.json-kind units; file name not asserted.
    if (unit.kind !== 'json') {
      return { source: unit.source, changes: [], todos: [] };
    }
    return applyPackageJson(unit.source, ctx);
  },
};
