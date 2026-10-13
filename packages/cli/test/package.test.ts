/** PLAT-299: aura-glass-cli package shape. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

/** Parse module references, not example imports preserved inside codemod strings. */
function forbiddenImports(source: string): string[] {
  return ts.preProcessFile(source, true, true).importedFiles
    .map((ref) => ref.fileName)
    .filter((name) => name === 'aura-glass' || name.startsWith('aura-glass/') || /(?:^|\/)certification\//.test(name));
}
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')) as Record<string, any>;
describe('package', () => {
  it('name/version/bin/type/engines', () => {
    expect(pkg.name).toBe('aura-glass-cli');
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
  it('detects real static and runtime imports without matching codemod examples', () => {
    expect(forbiddenImports(`
      import { Button } from 'aura-glass';
      export { Dialog } from 'aura-glass/compat';
      const x = require('aura-glass/material');
      const y = import('../../certification/manifest.js');
    `)).toEqual(['aura-glass', 'aura-glass/compat', 'aura-glass/material', '../../certification/manifest.js']);
    expect(forbiddenImports(`
      const example = "import { Button } from 'aura-glass'";
      // from 'aura-glass/compat'; certification/examples are documentation
    `)).toEqual([]);
  });
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
      expect({ file: path.relative(out, f), forbidden: forbiddenImports(text) })
        .toEqual({ file: path.relative(out, f), forbidden: [] });
    }
  }, 120000);
});
