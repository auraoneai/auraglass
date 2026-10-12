/* @jest-environment node */
/* REQ-PLAT-70: bare `import "aura-glass<entry>"` — bundled by PACKAGE
   SPECIFIER from the packed tarball (so package.json sideEffects
   [css-only] and the exports map are honoured), peers external — is
   ≤64 B MINIFIED for both esbuild and Rolldown. The tarball is extracted
   into a scratch consumer's node_modules (no workspace link, no absolute
   dist path imports). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt } from '../build/helpers';

const BARE_IMPORT_BYTES = 64;
/* peers are external (REQ-PLAT-70) — same list as verify-size-budgets.mjs. */
const EXTERNALS = ['react', 'react-dom', 'react/*', 'clsx', '@base-ui/*', '@tanstack/*',
  'motion', 'three', '@react-three/*', 'react-aria-components', '@internationalized/*',
  'react-hook-form', 'd3-*', 'tailwindcss'];

const specifier = (subpath: string): string => (subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.slice(2)}`);

/* Pack once, extract into <consumer>/node_modules/aura-glass. */
const consumerDir = (): string => {
  const work = mkdtempSync(join(tmpdir(), 'ag-bare-'));
  const out = execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', work], { cwd: ROOT, encoding: 'utf8' });
  const { parsePackJson } = createRequire(__filename)('../../scripts/ci/lib/npm-pack.cjs') as {
    parsePackJson: (s: string) => { filename: string };
  };
  const tgz = join(work, parsePackJson(out).filename);
  const app = join(work, 'consumer');
  const pkgDir = join(app, 'node_modules', 'aura-glass');
  mkdirSync(pkgDir, { recursive: true });
  execFileSync('tar', ['-xzf', tgz, '-C', pkgDir, '--strip-components=1']);
  writeFileSync(join(app, 'package.json'), JSON.stringify({ name: 'bare-consumer', private: true, type: 'module' }));
  return app;
};

const entries = async (app: string) => {
  const { manifestEntries } = await import('../../scripts/build/lib/graph.mjs');
  return manifestEntries(ROOT).js
    .map((e: { subpath: string; default?: string }) => ({ subpath: e.subpath, spec: specifier(e.subpath), emitted: join(app, 'node_modules', 'aura-glass', e.default ?? '') }))
    .filter((e: { emitted: string }) => existsSync(e.emitted));
};

describe('bare import drop (REQ-PLAT-70)', () => {
  it('esbuild: minified bare package-specifier import ≤ 64 B per entry', async () => {
    ensureBuilt();
    expect(existsSync(DIST)).toBe(true);
    const app = consumerDir();
    const esbuild = await import('esbuild');
    const rows: { spec: string; bytes: number }[] = [];
    for (const e of await entries(app)) {
      const res = await esbuild.build({
        stdin: { contents: `import ${JSON.stringify(e.spec)};`, loader: 'js', resolveDir: app },
        bundle: true, write: false, minify: true, format: 'esm',
        external: EXTERNALS, treeShaking: true, logLevel: 'silent',
      });
      rows.push({ spec: e.spec, bytes: res.outputFiles[0]!.contents.length });
    }
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.filter((r) => r.bytes > BARE_IMPORT_BYTES)).toEqual([]);
  }, 180_000);

  it('rolldown: minified bare package-specifier import ≤ 64 B per entry', async () => {
    ensureBuilt();
    const app = consumerDir();
    const { rolldown } = await import('rolldown');
    const rows: { spec: string; bytes: number }[] = [];
    for (const e of await entries(app)) {
      const stub = join(app, `stub-${e.subpath.replace(/\W+/g, '_')}.mjs`);
      writeFileSync(stub, `import ${JSON.stringify(e.spec)};\n`);
      const b = await rolldown({
        input: stub,
        external: (id: string) => EXTERNALS.some((x) => (x.endsWith('/*') ? id.startsWith(x.slice(0, -1)) : id === x || id.startsWith(`${x}/`))),
        treeshake: true, logLevel: 'silent',
      });
      const { output } = await b.generate({ format: 'esm', minify: true });
      const code = output.map((o: { code?: string }) => o.code ?? '').join('\n');
      rows.push({ spec: e.spec, bytes: Buffer.byteLength(code) });
    }
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.filter((r) => r.bytes > BARE_IMPORT_BYTES)).toEqual([]);
  }, 180_000);
});
