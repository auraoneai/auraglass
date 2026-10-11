/**
 * @jest-environment node
 */
/* tests/docs/docs-artifact.test.ts — REQ-PLAT-99 / PLAT-377 (REQ-FIN-43, AC-FIN-43).
   The docs app consumes aura-glass only from the packed tarball whose path is
   derived from the package version — never src/ or a workspace link — is a
   static export whose basePath follows DOCS_BASE_URL, and the build fails
   unless apps/docs/out has an HTML file for every nav href. */
import { describe, expect, it, jest } from '@jest/globals';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { main as installMain, packPath, verifyInstalled } from '../../scripts/docs/install-pack.mjs';
import { htmlFor, verifyOut } from '../../scripts/docs/verify-docs-out.mjs';

const root = join(__dirname, '..', '..');
const appDir = join(root, 'apps', 'docs');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function fixtureRoot(version: string) {
  const dir = mkdtempSync(join(tmpdir(), 'docs-artifact-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version, workspaces: ['apps/*'] }));
  mkdirSync(join(dir, 'apps/docs'), { recursive: true });
  writeFileSync(join(dir, 'apps/docs/package.json'), JSON.stringify({ name: '@auraglass/docs', version: '0.0.0', private: true }));
  return dir;
}
function installFake(dir: string, version: string) {
  const p = join(dir, 'apps/docs/node_modules/aura-glass');
  mkdirSync(join(p, 'dist'), { recursive: true });
  writeFileSync(join(p, 'package.json'), JSON.stringify({ name: 'aura-glass', version }));
  return p;
}

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.next', 'out', 'generated', 'public'].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.(ts|tsx|mjs|js|cjs)$/.test(name)) out.push(p);
  }
  return out;
}

describe('docs app artifact consumption', () => {
  it('derives the tarball path from the package.json version', () => {
    expect(packPath(root)).toBe(`.artifacts/pack/aura-glass-${pkg.version}.tgz`);
    expect(packPath(fixtureRoot('9.8.7-rc.1'))).toBe('.artifacts/pack/aura-glass-9.8.7-rc.1.tgz');
  });

  it('fails when the version-matched tarball is missing, even if another version is present', () => {
    const dir = fixtureRoot('5.0.0-alpha.3');
    mkdirSync(join(dir, '.artifacts/pack'), { recursive: true });
    writeFileSync(join(dir, '.artifacts/pack/aura-glass-5.0.0-alpha.2.tgz'), 'stale');
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(installMain(dir, { install: false })).toBe(1);
    expect(err.mock.calls.map((c) => String(c[0])).join('\n')).toContain('.artifacts/pack/aura-glass-5.0.0-alpha.3.tgz missing');
    err.mockRestore();
  });

  it('accepts an installed tarball of the same version and rejects mismatches and links', () => {
    const ok = fixtureRoot('5.0.0-alpha.0');
    installFake(ok, '5.0.0-alpha.0');
    expect(verifyInstalled(ok)).toEqual([]);

    const stale = fixtureRoot('5.0.0-alpha.1');
    installFake(stale, '5.0.0-alpha.0');
    expect(verifyInstalled(stale)).toEqual(['installed aura-glass 5.0.0-alpha.0 != package.json version 5.0.0-alpha.1']);

    const linked = fixtureRoot('5.0.0-alpha.0');
    mkdirSync(join(linked, 'apps/docs/node_modules'), { recursive: true });
    mkdirSync(join(linked, 'src'));
    symlinkSync(linked, join(linked, 'apps/docs/node_modules/aura-glass'), 'dir');
    const errors = verifyInstalled(linked);
    expect(errors).toContain('aura-glass resolves to the repository root (workspace/self link), not the tarball');
    expect(errors).toContain('installed aura-glass contains src/ — not a packed tarball');

    expect(verifyInstalled(fixtureRoot('5.0.0-alpha.0'))).toEqual(['aura-glass is not resolvable from apps/docs']);
  });

  it('never imports library source: relative imports stay inside apps/docs', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(appDir)) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*|require\(\s*)['"]([^'"]+)['"]/g)) {
        const spec = m[1] ?? '';
        const rel = relative(appDir, file);
        if (/^aura-glass\/(src|dist\/src)\b/.test(spec)) offenders.push(`${rel}: ${spec}`);
        if (!spec.startsWith('.')) continue;
        const target = resolve(dirname(file), spec);
        const inside = !relative(appDir, target).startsWith('..');
        const allowed = rel === 'next.config.ts' && relative(root, target) === join('scripts', 'docs', 'paths.mjs');
        if (!inside && !allowed) offenders.push(`${rel}: ${spec}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('declares no workspace, link or file dependency on aura-glass and no path alias out of the app', () => {
    const app = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'])
      expect(app[field]?.['aura-glass']).toBeUndefined();
    const tsconfig = JSON.parse(readFileSync(join(appDir, 'tsconfig.json'), 'utf8'));
    expect(tsconfig.compilerOptions.paths).toEqual({ '@/*': ['./*'] });
    expect(pkg.workspaces).not.toContain('.');
    expect(pkg.workspaces).not.toContain('./');
  });

  it('builds through install-pack → prepare → next build → verify-docs-out', () => {
    expect(pkg.scripts['docs:build']).toBe(
      'node scripts/docs/install-pack.mjs && node scripts/docs/prepare-docs-app.mjs && npm run build -w apps/docs && node scripts/docs/verify-docs-out.mjs',
    );
    const app = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
    expect(app.scripts.build).toBe('next build');
  });

  it('is a static export whose basePath follows DOCS_BASE_URL', () => {
    const load = (env: Record<string, string | undefined>) => {
      const saved = { ...process.env };
      Object.assign(process.env, env);
      for (const k of Object.keys(env)) if (env[k] === undefined) delete process.env[k];
      let cfg: Record<string, unknown> = {};
      jest.isolateModules(() => { cfg = require('../../apps/docs/next.config.ts').default; });
      process.env = saved;
      return cfg;
    };
    const pages = load({ DOCS_BASE_URL: 'https://group.gitlab.io/sub/auraglass/', NEXT_BASE_PATH: undefined });
    expect(pages).toMatchObject({ output: 'export', trailingSlash: true, basePath: '/sub/auraglass', assetPrefix: '/sub/auraglass/', env: { DOCS_BASE_PATH: '/sub/auraglass' } });
    const domain = load({ DOCS_BASE_URL: 'https://auraglass.dev/', NEXT_BASE_PATH: undefined });
    expect(domain).toMatchObject({ output: 'export', basePath: undefined, env: { DOCS_BASE_PATH: '' } });
  });
});

describe('verify-docs-out', () => {
  const nav = [{ title: 'Get started', groups: [{ title: 'Get started', entries: [{ title: 'Intro', href: '/plat/introduction' }, { title: 'Next', href: '/quickstart/next' }] }] }];
  const outFixture = () => {
    const out = mkdtempSync(join(tmpdir(), 'docs-out-'));
    writeFileSync(join(out, 'index.html'), '<!doctype html>');
    writeFileSync(join(out, 'nav.json'), JSON.stringify({ version: '5.0.0-alpha.0', nav }));
    mkdirSync(join(out, 'plat/introduction'), { recursive: true });
    writeFileSync(join(out, 'plat/introduction/index.html'), '<!doctype html>');
    return out;
  };

  it('reports every nav href without an HTML file', () => {
    const out = outFixture();
    expect(verifyOut(out)).toEqual({ hrefs: ['/plat/introduction', '/quickstart/next'], missing: ['/quickstart/next'], error: null });
    mkdirSync(join(out, 'quickstart/next'), { recursive: true });
    writeFileSync(htmlFor(out, '/quickstart/next'), '<!doctype html>');
    expect(verifyOut(out).missing).toEqual([]);
  });

  it('fails when the exported nav.json or the home page is missing', () => {
    const out = mkdtempSync(join(tmpdir(), 'docs-out-'));
    expect(verifyOut(out).error).toMatch(/index\.html missing/);
    writeFileSync(join(out, 'index.html'), '<!doctype html>');
    expect(verifyOut(out).error).toMatch(/nav\.json missing/);
  });
});
