/**
 * @jest-environment node
 *
 * REQ-PLAT-50 — fixture index for scripts/ci/verify-tree-hygiene.js (next/5x
 * port of the release/4.x test). A fake tracked index is staged in a temp git
 * repo for each negative case; the clean case runs against this repo itself.
 */
import { afterEach, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const SCRIPT = join(ROOT, 'scripts', 'ci', 'verify-tree-hygiene.js');

function gitRepo(files: Record<string, string | Buffer>): string {
  const dir = mkdtempSync(join(tmpdir(), 'tree-hygiene-'));
  execFileSync('git', ['init', '-q'], { cwd: dir });
  for (const [rel, content] of Object.entries(files)) {
    const p = join(dir, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  execFileSync('git', ['add', '-A'], { cwd: dir });
  return dir;
}

function run(root: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT], { cwd: root, encoding: 'utf8',
      env: { ...process.env, AURAGLASS_REPO_ROOT: root }, stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

describe('verify-tree-hygiene (REQ-PLAT-50)', () => {
  const dirs: string[] = [];
  afterEach(() => { for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true }); });
  const repo = (files: Record<string, string | Buffer>) => { const d = gitRepo(files); dirs.push(d); return d; };

  it('fails when reports/ is tracked, with the file count', () => {
    const r = run(repo({ 'reports/evidence.json': '{}', 'src/a.ts': '' }));
    expect(r.code).toBe(1);
    expect(r.out).toContain('tracked reports/ files: 1 files, 2 bytes');
  });

  it('fails on a tracked root probe script but not on a nested one', () => {
    const r = run(repo({ 'probe-dom.mjs': '// probe', 'webkit-probe.mjs': '// probe' }));
    expect(r.code).toBe(1);
    expect(r.out).toContain('tracked root probe scripts: 2 files');
    expect(run(repo({ 'scripts/dev/probe-x.mjs': '// nested is fine' })).code).toBe(0);
  });

  it('fails on each deny-listed scratch file at the root', () => {
    for (const f of ['.audit-inspect.mjs', 'inspect-toggle.mjs', 'list-stories.mjs', 'audit-story.mjs', '.audit-x.mjs']) {
      const r = run(repo({ [f]: '// scratch' }));
      expect(r.code).toBe(1);
      expect(r.out).toContain('tracked deny-listed files: 1 files');
      expect(r.out).toContain(f);
    }
    // The globs are root-only.
    expect(run(repo({ 'scripts/ci/inspect-tree.mjs': '', 'scripts/ci/list-stories.mjs': '' })).code).toBe(0);
  });

  it('fails on a tracked file over 5 MB outside the allowances, passes inside them', () => {
    const big = Buffer.alloc(5 * 1024 * 1024 + 1, 1);
    const r = run(repo({ 'assets/big.bin': big }));
    expect(r.code).toBe(1);
    expect(r.out).toContain('tracked files > 5 MB');
    expect(r.out).toContain('assets/big.bin');
    expect(run(repo({ 'visual-baselines/a.png': big, 'src/styles/fonts/a.woff2': big })).code).toBe(0);
    expect(run(repo({ 'assets/exact.bin': Buffer.alloc(5 * 1024 * 1024, 1) })).code).toBe(0);
  });

  it('passes on this repository index (the 3 root scratch scripts are gone)', () => {
    const r = run(ROOT);
    expect(r.out).toContain('clean');
    expect(r.code).toBe(0);
  });
});
