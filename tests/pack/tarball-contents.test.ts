/* @jest-environment node */
/* PLAT-297/78: tarball contents assert — verify-pack.js gates the packed shape;
   negative fixtures prove each check actually fails (exit 1). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { ROOT, ensureBuilt, withBuildLock } from '../build/helpers';

const PKG = (files: Record<string, string>) => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-pack-fix-'));
  for (const [rel, content] of Object.entries(files)) {
    const p = join(dir, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  return dir;
};

const FILES = ['dist', 'deprecations.json', 'llms.txt', 'README.md', 'LICENSE', 'CHANGELOG.md'];
const manifest = (extra: string[] = []) =>
  JSON.stringify({ name: 'ag-fixture', version: '0.0.0', files: [...FILES, ...extra] });

/* BASE_FILES is a valid package on its own (asserted below), so every
   negative fixture fails only for the defect it adds. */
const BASE_FILES: Record<string, string> = {
  'package.json': manifest(),
  'deprecations.json': '{}',
  'llms.txt': 'x',
  'README.md': 'x',
  'LICENSE': 'x',
  'CHANGELOG.md': 'x',
  'dist/index.js': 'export {};\n',
};

const runVerify = (dir: string) => {
  try {
    /* fixture evidence stays in the fixture dir — never clobbers the real
       run's .artifacts/pack/verify-pack.json */
    const out = execFileSync('node', [join(ROOT, 'scripts/ci/verify-pack.js'), '--root', dir], {
      cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, AURAGLASS_EVIDENCE_DIR: join(dir, '.evidence') },
    });
    return { status: 0, out };
  } catch (e: any) {
    return { status: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('tarball contents (PLAT-297)', () => {
  it('verify-pack passes on the current artifact', () => {
    ensureBuilt();
    const out = withBuildLock(() => execFileSync('node', ['scripts/ci/verify-pack.js'], { cwd: ROOT, encoding: 'utf8' }));
    expect(out).toMatch(/verify-pack: \d+ files/);
  }, 240_000);

  const expectFails = (files: Record<string, string>, message: RegExp) => {
    const dir = PKG({ ...BASE_FILES, ...files });
    try {
      const r = runVerify(dir);
      expect(r.status).toBe(1);
      expect(r.out).toMatch(message);
      expect(r.out).not.toMatch(/missing required/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };

  it('the base fixture package passes (control for the negative cases)', () => {
    const dir = PKG(BASE_FILES);
    try {
      const r = runVerify(dir);
      expect(r.out).toMatch(/verify-pack: \d+ files, .* clean/);
      expect(r.status).toBe(0);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('a temp package with a .map file exits 1', () => {
    expectFails({ 'dist/index.js.map': '{"mappings":""}' }, /denylist: .*dist\/index\.js\.map/);
  });

  it('a temp package shipping src/ exits 1', () => {
    expectFails({ 'package.json': manifest(['src']), 'src/index.ts': 'export {};\n' }, /src\/index\.ts/);
  });

  it('a dist file carrying @ag-contract-seed exits 1', () => {
    expectFails({ 'dist/bad.js': '/* @ag-contract-seed */\nexport {};\n' }, /@ag-contract-seed inside package\/dist\/bad\.js/);
  });

  it('a dist js file emitting data-ag-seed exits 1', () => {
    expectFails({ 'dist/bad.js': "document.documentElement.setAttribute('data-ag-seed','x');\n" }, /data-ag-seed inside package\/dist\/bad\.js/);
  });

  it('an unexpected top-level entry exits 1', () => {
    expectFails({ 'package.json': manifest(['stray']), 'stray/index.js': 'export {};\n' }, /unexpected top-level entries: stray\/index\.js/);
  });
});
