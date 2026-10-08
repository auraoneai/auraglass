/* @jest-environment node */
/* PLAT-247: `npm run build` is one pass producing every artifact; a second bundle
   into a parallel out dir is byte-identical (no generator depends on mtime). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk, withBuildLock } from './helpers';

const hashDir = (dir: string, filter: (p: string) => boolean) => {
  const h = createHash('sha256');
  for (const f of walk(dir, filter)) h.update(f.replace(dir, '')).update(readFileSync(f));
  return h.digest('hex');
};

/* .map files legitimately embed out-dir-relative source paths; compare js + d.ts. */

describe('single build (PLAT-247)', () => {
  it('produces js, d.ts, css and the manifest-verified entries in one pass', () => {
    withBuildLock(() => {
      execFileSync('npx', ['tsdown'], { cwd: ROOT, stdio: 'inherit' });
      execFileSync('node', ['scripts/build/post.mjs'], { cwd: ROOT, stdio: 'inherit' });
    });
    expect(walk(DIST).some(f => f.endsWith('.js'))).toBe(true);
    expect(walk(DIST).some(f => f.endsWith('.d.ts'))).toBe(true);
    expect(readFileSync(`${DIST}/styles.css`, 'utf8').startsWith('@layer ag.compat')).toBe(true);
  }, 120_000);

  it('is reproducible byte-for-byte on a second pass', async () => {
    ensureBuilt();
    const first = hashDir(DIST, p => p.endsWith('.js') || p.endsWith('.d.ts'));
    const second = join(ROOT, 'build', '.dist-second');
    rmSync(second, { recursive: true, force: true });
    try {
      execFileSync('npx', ['tsdown', '--out-dir', second], { cwd: ROOT, stdio: 'inherit' });
      execFileSync('npx', ['tsc', '-p', 'build/.tsconfig.emit.json', '--outDir', second], { cwd: ROOT, stdio: 'inherit' });
      const { rewriteAll } = await import('../../scripts/build/rewrite-dts-aliases.mjs');
      rewriteAll(second);
      expect(hashDir(second, p => p.endsWith('.js') || p.endsWith('.d.ts'))).toBe(first);
    } finally {
      rmSync(second, { recursive: true, force: true });
    }
  }, 120_000);
});
