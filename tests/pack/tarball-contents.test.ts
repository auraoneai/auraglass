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

const BASE_FILES: Record<string, string> = {
  'package.json': JSON.stringify({ name: 'ag-fixture', version: '0.0.0', files: ['dist'] }),
  'deprecations.json': '{}',
  'llms.txt': 'x',
  'README.md': 'x',
  'LICENSE': 'x',
  'CHANGELOG.md': 'x',
  'dist/index.js': 'export {};\n',
};

const runVerify = (dir: string) => {
  try {
    const out = execFileSync('node', [join(ROOT, 'scripts/ci/verify-pack.js'), '--root', dir], { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
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

  it('a temp package with a .map file exits 1', () => {
    const dir = PKG({ ...BASE_FILES, 'dist/index.js.map': '{"mappings":""}' });
    try { expect(runVerify(dir).status).toBe(1); } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('a temp package shipping src/ exits 1', () => {
    const dir = PKG({ ...BASE_FILES, 'package.json': JSON.stringify({ name: 'ag-fixture', version: '0.0.0', files: ['dist', 'src'] }), 'src/index.ts': 'export {};\n' });
    try { expect(runVerify(dir).status).toBe(1); } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('a dist file carrying @ag-contract-seed exits 1', () => {
    const dir = PKG({ ...BASE_FILES, 'dist/bad.js': '/* @ag-contract-seed */\nexport {};\n' });
    try { expect(runVerify(dir).status).toBe(1); } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('a dist js file emitting data-ag-seed exits 1', () => {
    const dir = PKG({ ...BASE_FILES, 'dist/bad.js': "document.documentElement.setAttribute('data-ag-seed','x');\n" });
    try { expect(runVerify(dir).status).toBe(1); } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('an unexpected top-level entry exits 1', () => {
    const dir = PKG({ ...BASE_FILES, 'package.json': JSON.stringify({ name: 'ag-fixture', version: '0.0.0', files: ['dist', 'stray'] }), 'stray/index.js': 'export {};\n' });
    try { expect(runVerify(dir).status).toBe(1); } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
