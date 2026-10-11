/* Shared helpers for tests/build|exports|pack — ensures dist/ exists once per run. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = process.cwd();
export const DIST = join(ROOT, 'dist');
export const SRC = join(ROOT, 'src');

let built = false;
const LOCK = join(ROOT, 'build/.test-build.lock');
function withBuildLock<T>(fn: () => T): T {
  // cross-process mutex: tsdown --clean wipes dist/, so concurrent jest workers must serialize builds.
  for (;;) {
    try { mkdirSync(LOCK); break; } catch { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50); }
  }
  try { return fn(); } finally { rmSync(LOCK, { recursive: true, force: true }); }
}
export function ensureBuilt(): void {
  if (built || existsSync(join(DIST, 'styles.css'))) { built = true; return; }
  withBuildLock(() => {
    execFileSync('npx', ['tsdown'], { cwd: ROOT, stdio: 'inherit' });
    execFileSync('node', ['scripts/build/post.mjs'], { cwd: ROOT, stdio: 'inherit' });
  });
  built = true;
}
export { withBuildLock };

export function walk(dir: string, filter: (p: string) => boolean = () => true, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    try { statSync(p).isDirectory() ? walk(p, filter, out) : filter(p) && out.push(p); } catch { /* dist rebuilt mid-walk */ }
  }
  return out.sort();
}

export function read(path: string): string { return readFileSync(join(ROOT, path), 'utf8'); }
export function exists(path: string): boolean { return existsSync(join(ROOT, path)); }
