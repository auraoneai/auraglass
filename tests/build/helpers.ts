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
  if (built) return;
  withBuildLock(() => {
    // re-check under the lock: another worker may be mid-build (post.mjs writes
    // styles.css before tailwind.css), so an unlocked existence check races.
    if (existsSync(join(DIST, 'styles.css'))) return;
    // same steps as `npm run build` + postbuild: the token build emits
    // dist/tokens/manifest.json, dist/tokens.css and dist/compat/tokens.css,
    // which post.mjs assembles into styles.css and the tailwind bridge.
    execFileSync('node', ['scripts/tokens/build.mjs'], { cwd: ROOT, stdio: 'inherit' });
    execFileSync('npx', ['tsdown', '--no-clean'], { cwd: ROOT, stdio: 'inherit' });
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
