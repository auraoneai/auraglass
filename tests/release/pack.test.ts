/* @jest-environment node */
// REQ-PLAT-11 / -16: scripts/release/pack.mjs packs the contracts/packages.json
// set, writes pack-record.json with the on-disk sha512 and dist-maps.tgz.
// `npm pack` is a stub that builds real tarballs with tar.
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PACK = join(process.cwd(), 'scripts/release/pack.mjs');

// Stub `npm pack --json --pack-destination <d> [-w <dir>]`: tars <dir>/package.json
// as package/package.json, prints lifecycle noise then npm's JSON report.
// AG_TEST_LIE_INTEGRITY=1 reports a wrong integrity.
const STUB = `#!/usr/bin/env node
const fs = require('fs'); const path = require('path'); const cp = require('child_process'); const crypto = require('crypto');
const a = process.argv.slice(2);
if (a[0] !== 'pack') { process.stderr.write('stub npm: unexpected ' + a.join(' ')); process.exit(3); }
const dest = a[a.indexOf('--pack-destination') + 1];
const w = a.includes('-w') ? a[a.indexOf('-w') + 1] : '.';
const pkg = JSON.parse(fs.readFileSync(path.join(w, 'package.json'), 'utf8'));
const stage = fs.mkdtempSync(path.join(require('os').tmpdir(), 'stub-pack-'));
fs.mkdirSync(path.join(stage, 'package'));
fs.copyFileSync(path.join(w, 'package.json'), path.join(stage, 'package/package.json'));
const filename = pkg.name.replace(/^@/, '').replace('/', '-') + '-' + pkg.version + '.tgz';
cp.execFileSync('tar', ['-czf', path.join(dest, filename), '-C', stage, 'package']);
const sum = 'sha512-' + crypto.createHash('sha512').update(fs.readFileSync(path.join(dest, filename))).digest('base64');
process.stdout.write('\\n> ' + pkg.name + '@' + pkg.version + ' prepack\\n> node scripts/release/gen-deprecations.mjs\\n\\n');
process.stdout.write(JSON.stringify([{ id: pkg.name + '@' + pkg.version, name: pkg.name, version: pkg.version, filename,
  integrity: process.env.AG_TEST_LIE_INTEGRITY ? 'sha512-AAAA' : sum }], null, 2) + '\\n');
`;

function fixture({ maps = true, labsPrivate = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-pack-'));
  const w = (p: string, c: string) => {
    mkdirSync(join(dir, p, '..'), { recursive: true });
    writeFileSync(join(dir, p), c);
  };
  w('bin/npm', STUB);
  chmodSync(join(dir, 'bin/npm'), 0o755);
  w('contracts/packages.json', JSON.stringify({
    version: 1,
    packages: {
      'aura-glass': { dir: '.', published: true, fallback: 'aura-glass' },
      '@auraglass/cli': { dir: 'packages/cli', published: true, fallback: 'aura-glass-cli' },
      '@auraglass/labs': { dir: 'packages/labs', published: true, fallback: 'aura-glass-labs' },
      '@auraglass/mcp': { dir: 'packages/mcp', published: true, fallback: 'aura-glass-mcp' },
      '@auraglass/qa': { dir: 'packages/qa', published: false },
    },
  }));
  w('package.json', JSON.stringify({ name: 'aura-glass', version: '5.0.0-alpha.1' }));
  w('packages/cli/package.json', JSON.stringify({ name: '@auraglass/cli', version: '0.1.0' }));
  w('packages/labs/package.json', JSON.stringify({ name: '@auraglass/labs', version: '0.1.0', private: labsPrivate }));
  w('packages/qa/package.json', JSON.stringify({ name: '@auraglass/qa', version: '0.0.0' }));
  // packages/mcp is absent on this "line"
  if (maps) {
    w('dist-maps/index.js.map', '{"version":3}');
    w('dist-maps/forms/index.js.map', '{"version":3}');
  }
  const run = (env: Record<string, string> = {}) => {
    const r = spawnSync('node', [PACK, '--line', '5x'], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}`, CI_COMMIT_SHA: 'cafe', AG_TEST_LIE_INTEGRITY: '', ...env },
    });
    return { code: r.status, out: `${r.stdout}${r.stderr}` };
  };
  return { dir, run };
}

describe('pack.mjs (REQ-PLAT-11, -16)', () => {
  it('packs the published set and records the on-disk sha512 of each tarball', () => {
    const f = fixture();
    const r = f.run();
    expect(r.out).toContain('wrote .artifacts/plat/pack-record.json (3 packages)');
    expect(r.code).toBe(0);
    const rec = JSON.parse(readFileSync(join(f.dir, '.artifacts/plat/pack-record.json'), 'utf8'));
    expect(rec.sha).toBe('cafe');
    expect(Object.keys(rec.packages).sort()).toEqual(['@auraglass/cli', '@auraglass/labs', 'aura-glass']);
    for (const p of Object.values(rec.packages) as any[]) {
      const file = join(f.dir, '.artifacts/pack', p.file);
      expect(p.integrity).toBe('sha512-' + createHash('sha512').update(readFileSync(file)).digest('base64'));
    }
    expect(rec.packages['aura-glass']).toMatchObject({ file: 'aura-glass-5.0.0-alpha.1.tgz', version: '5.0.0-alpha.1', dir: '.' });
    expect(readFileSync(join(f.dir, '.artifacts/plat/pack.env'), 'utf8')).toBe(
      'AURAGLASS_TARBALL=.artifacts/pack/aura-glass-5.0.0-alpha.1.tgz\n',
    );
  });

  it('writes dist-maps.tgz containing the staged sourcemaps', () => {
    const f = fixture();
    expect(f.run().code).toBe(0);
    const list = execFileSync('tar', ['-tzf', join(f.dir, '.artifacts/plat/dist-maps.tgz')], { encoding: 'utf8' })
      .split('\n').filter((l) => l.endsWith('.map')).sort();
    expect(list).toEqual(['dist-maps/forms/index.js.map', 'dist-maps/index.js.map']);
  });

  it('fails without sourcemaps instead of shipping an empty dist-maps.tgz', () => {
    const f = fixture({ maps: false });
    const r = f.run();
    expect(r.code).toBe(1);
    expect(r.out).toContain('dist-maps/ has no .map files');
    expect(existsSync(join(f.dir, '.artifacts/plat/dist-maps.tgz'))).toBe(false);
  });

  it('fails when npm reports an integrity different from the tarball on disk', () => {
    const r = fixture().run({ AG_TEST_LIE_INTEGRITY: '1' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('npm reported integrity sha512-AAAA');
  });

  it('skips a private package', () => {
    const f = fixture({ labsPrivate: true });
    expect(f.run().code).toBe(0);
    const rec = JSON.parse(readFileSync(join(f.dir, '.artifacts/plat/pack-record.json'), 'utf8'));
    expect(Object.keys(rec.packages).sort()).toEqual(['@auraglass/cli', 'aura-glass']);
  });

  it('fails when a package dir carries a name the contract does not list', () => {
    const f = fixture();
    writeFileSync(join(f.dir, 'packages/cli/package.json'), JSON.stringify({ name: 'some-cli', version: '0.1.0' }));
    const r = f.run();
    expect(r.code).toBe(1);
    expect(r.out).toContain('name some-cli is neither @auraglass/cli nor its fallback aura-glass-cli');
  });
});
