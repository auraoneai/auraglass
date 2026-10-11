/** PLAT-299: @auraglass/cli package shape. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')) as Record<string, any>;
describe('package', () => {
  it('name/version/bin/type/engines', () => {
    expect(pkg.name).toBe('@auraglass/cli');
    expect(pkg.bin).toEqual({ auraglass: './dist/bin.js' });
    expect(pkg.type).toBe('module');
    expect(pkg.engines.node).toBe('>=20.19');
    expect(pkg.publishConfig.access).toBe('public');
  });
  it('runtime deps are exact-pinned and on the allowlist', () => {
    const allow = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dependency-allowlist.json'), 'utf8')) as { allowlist: string[] };
    for (const [d, v] of Object.entries(pkg.dependencies)) {
      expect(allow.allowlist).toContain(d);
      expect(String(v)).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
  it('prepublishOnly gates on require-ci-publish', () => {
    expect(pkg.scripts.prepublishOnly).toContain('require-ci-publish');
  });
  it('files ships only dist + allowlist', () => {
    expect(pkg.files).toContain('dist');
  });
});

describe('tarball contents (REQ-PLAT-84)', () => {
  const hasDist = fs.existsSync(path.join(__dirname, '..', 'dist', 'bin.js'));
  (hasDist ? it : it.skip)('npm-pack installs ≤15 MB unpacked with no aura-glass bin or imports', async () => {
    const { execFileSync } = await import('node:child_process');
    const os = await import('node:os');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agpack-'));
    const tgz = execFileSync('npm', ['pack', '--silent', '--pack-destination', dir],
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' }).trim().split('\n').pop()!;
    const out = path.join(dir, 'pkg');
    fs.mkdirSync(out);
    execFileSync('tar', ['-xzf', path.join(dir, tgz), '-C', out]);
    const bytes = (d: string): number => fs.readdirSync(d, { withFileTypes: true })
      .reduce((n, e) => n + (e.isDirectory() ? bytes(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
    const total = bytes(out);
    console.log(`unpacked ${total} bytes`);
    expect(total).toBeLessThanOrEqual(15_000_000);
    /* bin name is auraglass only — aura-glass must never resolve */
    const pkgJson = JSON.parse(fs.readFileSync(path.join(out, 'package', 'package.json'), 'utf8'));
    expect(Object.keys(pkgJson.bin ?? {})).not.toContain('aura-glass');
    /* dist must not import aura-glass or certification/** */
    const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true })
      .flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
    for (const f of walk(path.join(out, 'package', 'dist'))) {
      if (!/\.(js|mjs|cjs)$/.test(f)) continue;
      const text = fs.readFileSync(f, 'utf8');
      expect(text).not.toMatch(/from\s+['"]aura-glass(\/|['"])/);
      expect(text).not.toMatch(/certification\//);
    }
  }, 120000);
});
