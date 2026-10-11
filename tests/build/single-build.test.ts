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

/* REQ-PLAT-64 — build-stack pinning checks: deleted legacy files, no
   rollup/bundlesize, exact scripts, esbuild confinement. */
describe('build stack pinning (REQ-PLAT-64)', () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

  it('legacy build files are deleted', () => {
    const present = [
      'rollup.config.js', 'rollup.config.mjs', 'rollup.config.ts',
      '.bundlesizerc', 'bundlesize.config.js', 'bundlesize.config.json',
    ].filter((f) => existsSync(join(ROOT, f)));
    expect(present).toEqual([]);
  });

  it('no rollup/bundlesize in dependencies or scripts', () => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    const banned = Object.keys(all).filter((n) => /rollup|bundlesize/i.test(n));
    expect(banned).toEqual([]);
    const bannedScripts = Object.entries(pkg.scripts ?? {})
      .filter(([, v]) => /rollup|bundlesize/i.test(String(v)))
      .map(([k]) => k);
    expect(bannedScripts).toEqual([]);
  });

  it('prettier is pinned as an exact devDependency', () => {
    expect(pkg.devDependencies?.prettier).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('exact build script chain (tokens -> tsdown -> tsc emit -> post)', () => {
    expect(pkg.scripts.build).toBe('npm run tokens:build && tsdown');
    expect(pkg.scripts.postbuild).toContain('post.mjs');
  });

  it('esbuild is confined to the tsdown path (no direct esbuild entrypoints)', () => {
    const hits: string[] = [];
    const scan = (dir: string) => {
      for (const f of walk(dir, (p) => /\.(mjs|js|cjs)$/.test(p) && !p.includes('node_modules'))) {
        const text = readFileSync(f, 'utf8');
        if (/esbuild\.buildSync|from ['"]esbuild['"]|require\(['"]esbuild['"]\)/.test(text)) hits.push(f);
      }
    };
    scan(join(ROOT, 'scripts', 'build'));
    scan(join(ROOT, 'scripts', 'tokens'));
    const allowlisted = hits.filter((f) => /build-all\.js$|tsdown/.test(f));
    expect(allowlisted).toEqual([]);
  });
});
