/* @jest-environment node */
/* REQ-FIN-13 fixture-repo test: two bare-ish repos (one remote carrying both
   branches), stubbed `gh`, real `node scripts/release/sync-fragments.mjs` runs
   covering branch name, touched paths, same-day skip, deletion propagation and
   the target-only refusal (AC-FIN-13). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(__dirname, '..', '..', 'scripts', 'release', 'sync-fragments.mjs');
const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

const sh = (cwd: string, cmd: string, args: string[], env: NodeJS.ProcessEnv = {}) =>
  execFileSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
const git = (cwd: string, args: string[]) => sh(cwd, 'git', args);

function writeFragment(dir: string, id: string) {
  mkdirSync(join(dir, 'fragments', 'deprecations'), { recursive: true });
  writeFileSync(
    join(dir, 'fragments', 'deprecations', 'plat.ts'),
    `export default [{ id: '${id}', kind: 'export', breaking: 13, since: '4.3.0' }];\n`,
  );
}
function writeCodemod(dir: string, id: string) {
  mkdirSync(join(dir, 'fragments', 'codemods'), { recursive: true });
  writeFileSync(
    join(dir, 'fragments', 'codemods', 'mat.ts'),
    `export default [{ id: '${id}', kind: 'rename' }];\n`,
  );
}

/* Builds: remote.git (bare) with branches next + release/4.x; work/ clone.
   next's deprecations hold 'next-only-id'; 4.x deprecations hold 'old-id'.
   Returns paths + a PATH-prepended env where `gh` is a stub logging to gh-log. */
function fixture(extraNextId?: string) {
  const root = mkdtempSync(join(tmpdir(), 'fragsync-'));
  const remote = join(root, 'remote.git');
  const work = join(root, 'work');
  const seed = join(root, 'seed');
  git(root, ['init', '--bare', remote]);
  git(root, ['init', seed]);
  git(seed, ['config', 'user.email', 't@t']); git(seed, ['config', 'user.name', 't']);
  writeFragment(seed, 'old-id');
  writeCodemod(seed, 'cm-4x-source');
  git(seed, ['add', '-A']); git(seed, ['commit', '-m', 'x']);
  git(seed, ['branch', '-M', 'next']);
  git(seed, ['remote', 'add', 'origin', remote]);
  git(seed, ['push', '-q', 'origin', 'next']);
  // release/4.x: same shape, different ids
  writeFragment(seed, 'four-x-only');
  writeCodemod(seed, 'cm-on-4x');
  git(seed, ['add', '-A']); git(seed, ['commit', '-m', 'x']);
  git(seed, ['push', '-q', 'origin', 'HEAD:release/4.x']);
  git(seed, ['checkout', '-q', 'next']);
  // next target state: its own next-only ids on deprecations
  writeFragment(seed, extraNextId ?? 'next-only-id');
  rmSync(join(seed, 'fragments', 'codemods'), { recursive: true, force: true });
  git(seed, ['add', '-A']); git(seed, ['commit', '-m', 'x']);
  git(seed, ['push', '-q', 'origin', 'next']);
  git(root, ['clone', '-q', remote, work]);
  git(work, ['checkout', '-q', 'next']);
  mkdirSync(join(work, 'scripts', 'release', 'lib'), { recursive: true });
  writeFileSync(join(work, 'scripts', 'release', 'sync-fragments.mjs'), readFileSync(SCRIPT, 'utf8'));
  // gen-deprecations.mjs is stubbed in the fixture (its real contract loading
  // pulls half the repo); the test asserts the script invokes it and stages the
  // generated files — byte-equality of output is covered by gen-deprecations' own tests.
  writeFileSync(
    join(work, 'scripts', 'release', 'gen-deprecations.mjs'),
    `import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('src/internal', { recursive: true });
writeFileSync('src/internal/deprecations.generated.ts', '/* fixture-generated */');
writeFileSync('deprecations.json', '{}');
`,
  );
  const bin = join(root, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), '#!/bin/sh\necho "$@" >> "$GH_LOG"\n[ "$1" = "pr" ] && [ "$2" = "list" ] && echo "[]"\nexit 0\n');
  sh(bin, 'chmod', ['+x', 'gh']);
  return { root, work, env: { PATH: `${bin}:${process.env.PATH}`, GH_LOG: join(root, 'gh-log'), GITLAB_CI: '', CI: '' } };
}
const run = (work: string, env: NodeJS.ProcessEnv, ...args: string[]) =>
  sh(work, 'node', ['scripts/release/sync-fragments.mjs', ...args], env);

describe('sync-fragments fixture repo', () => {
  it('--to next creates sync/fragments-deprecations-<date> touching only fragments/deprecations + generated', () => {
    const { work, env } = fixture('will-be-replaced');
    const out = run(work, env, '--to', 'next', '--allow-delete', 'will-be-replaced');
    expect(git(work, ['branch', '--show-current'])).toContain(`sync/fragments-deprecations-${date}`);
    const touched = git(work, ['show', '--name-only', '--format=', 'HEAD']).trim().split('\n');
    expect(touched.every((f) => f.startsWith('fragments/deprecations') || f === 'src/internal/deprecations.generated.ts' || f === 'deprecations.json')).toBe(true);
    expect(readFileSync(join(work, 'fragments/deprecations/plat.ts'), 'utf8')).toContain("'four-x-only'");
    expect(readFileSync(join(work, 'fragments/deprecations/plat.ts'), 'utf8')).not.toContain('will-be-replaced');
    expect(out + git(work, ['log', '-1', '--format=%s'])).toContain('fragments/deprecations');
  });
  it('refuses when target holds ids absent on source unless --allow-delete names them', () => {
    const { work, env } = fixture();
    // target (next) holds 'next-only-id' absent on 4.x source → refusal, exit 1
    expect(() => run(work, env, '--to', 'next')).toThrow();
    try { run(work, env, '--to', 'next'); } catch (e: any) {
      expect(e.status).toBe(1);
      expect(String(e.stderr)).toContain('next-only-id');
    }
    const out = run(work, env, '--to', 'next', '--allow-delete', 'next-only-id');
    expect(git(work, ['show', '--name-only', '--format=', 'HEAD'])).toContain('fragments/deprecations');
    expect(out).toContain('sync/fragments-');
  });
  it('same-day skip: existing remote branch exits 0 without changes', () => {
    const { work, env } = fixture();
    git(work, ['push', '-q', 'origin', `HEAD:sync/fragments-deprecations-${date}`]);
    const out = run(work, env, '--to', 'next');
    expect(out).toContain('once per working day');
  });
  it('--to release/4.x syncs codemods next→4.x and propagates deletions', () => {
    const { work, env } = fixture('target-kept');
    const out = run(work, env, '--to', 'release/4.x', '--allow-delete', 'cm-on-4x');
    expect(git(work, ['branch', '--show-current'])).toContain(`sync/fragments-codemods-${date}`);
    // next's codemods dir is empty (deleted) → target's mat.ts must be deleted
    expect(existsSync(join(work, 'fragments', 'codemods', 'mat.ts'))).toBe(false);
    const touched = git(work, ['show', '--name-only', '--format=', 'HEAD']).trim();
    expect(touched).toContain('fragments/codemods/mat.ts');
    expect(out).toBeTruthy();
  });
});
