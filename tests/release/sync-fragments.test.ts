/* @jest-environment node */
/* REQ-FIN-13 / REQ-PLAT-09 (AC-FIN-13): scripts/release/sync-fragments.mjs run for
   real against fixture repos — a bare `origin` carrying `next` + `release/4.x`
   and an operator clone — with `gh` stubbed on PATH. The fixture commits this
   repo's real sync-fragments.mjs, gen-deprecations.mjs (+ lib/policy.mjs) and the
   contract loader, so the generated aggregate is the real generator's output.
   Cases: CI refusal, branch name, touched paths, same-day skip (branch + open
   PR), deletion propagation, target-only refusal, codemods next → release/4.x. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const REPO = join(__dirname, '..', '..');
const COPIED = [
  'scripts/release/sync-fragments.mjs',
  'scripts/release/gen-deprecations.mjs',
  'scripts/release/lib/policy.mjs',
  'src/contracts/load-fragments.mjs',
];
const today = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

const git = (cwd: string, args: string[]) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });

type Files = Record<string, string | null>; // null = delete
function write(dir: string, files: Files) {
  for (const [rel, body] of Object.entries(files)) {
    const p = join(dir, rel);
    if (body === null) { rmSync(p, { force: true }); continue; }
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, body);
  }
}
const depRow = (id: string, symbol = id) =>
  `{ id: '${id}', kind: 'export', status: 'active', entry: '.', symbol: '${symbol}', since: '4.2.0', removeIn: '5.0.0', automation: 'full', breaking: 'B5', message: '${symbol} is removed in 5.0.', doc: '#dep-${id.toLowerCase()}' }`;
const depFile = (rows: string[]) =>
  `import type { DeprecationFragment } from '../../src/contracts/fragments';\nexport default [\n  ${rows.join(',\n  ')}\n] satisfies DeprecationFragment;\n`;
// a computed fragment (like 4.x plat.ts): ids exist only after evaluation
const depFileComputed = (ids: string[]) =>
  `import type { DeprecationFragment } from '../../src/contracts/fragments';\nconst IDS = ${JSON.stringify(ids)};\nexport default IDS.map((id) => ({ id, kind: 'export', status: 'active', entry: '.', symbol: 'S' + id, since: '4.2.0', removeIn: '5.0.0', automation: 'full', breaking: 'B5', message: 'm', doc: '#dep-' + id.toLowerCase() })) satisfies DeprecationFragment;\n`;
const codemodFile = (renames: Array<[string, string]>) =>
  `import type { CodemodMappingFragment } from '../../src/contracts/fragments';\nexport default { renames: [${renames
    .map(([from, to]) => `{ from: '${from}', fromEntry: '.', to: '${to}', toEntry: '.' }`)
    .join(', ')}] } satisfies CodemodMappingFragment;\n`;

/* origin.git (bare) with next + release/4.x built from `base` plus per-line
   overrides; work/ is the operator clone on `next`. */
function fixture({ next, fourX }: { next: Files; fourX: Files }) {
  const root = mkdtempSync(join(tmpdir(), 'fragsync-'));
  const origin = join(root, 'origin.git');
  const seed = join(root, 'seed');
  const work = join(root, 'work');
  git(root, ['init', '-q', '--bare', origin]);
  git(root, ['init', '-q', seed]);
  for (const [k, v] of [['user.email', 'fixture@example.invalid'], ['user.name', 'fixture'], ['commit.gpgsign', 'false']]) {
    git(seed, ['config', k, v]);
  }
  const base: Files = { '.gitignore': 'node_modules\n' };
  for (const f of COPIED) base[f] = readFileSync(join(REPO, f), 'utf8');
  write(seed, base);
  symlinkSync(join(REPO, 'node_modules'), join(seed, 'node_modules'), 'dir');
  git(seed, ['add', '-A']);
  git(seed, ['commit', '-q', '-m', 'base']);
  git(seed, ['branch', '-q', '-M', 'base']);
  for (const [line, files] of [['release/4.x', fourX], ['next', next]] as const) {
    git(seed, ['checkout', '-q', '-b', line, 'base']);
    write(seed, files);
    // next commits its generated aggregate, as the real line does
    if (line === 'next') execFileSync('node', ['scripts/release/gen-deprecations.mjs'], { cwd: seed, stdio: 'pipe' });
    git(seed, ['add', '-A']);
    git(seed, ['commit', '-q', '-m', line]);
  }
  git(seed, ['remote', 'add', 'origin', origin]);
  git(seed, ['push', '-q', 'origin', 'next', 'release/4.x']);
  git(root, ['clone', '-q', '-b', 'next', origin, work]);
  for (const [k, v] of [['user.email', 'operator@example.invalid'], ['user.name', 'operator'], ['commit.gpgsign', 'false']]) {
    git(work, ['config', k, v]);
  }
  symlinkSync(join(REPO, 'node_modules'), join(work, 'node_modules'), 'dir');
  const bin = join(root, 'bin');
  mkdirSync(bin);
  // gh stub: logs argv; `pr list` prints $GH_PR_LIST (default []); `pr create` prints a URL.
  writeFileSync(
    join(bin, 'gh'),
    '#!/bin/sh\nprintf "%s\\n" "$*" >> "$GH_LOG"\n' +
      'if [ "$1" = "pr" ] && [ "$2" = "list" ]; then printf "%s" "${GH_PR_LIST:-[]}"; fi\n' +
      'if [ "$1" = "pr" ] && [ "$2" = "create" ]; then echo "https://github.invalid/pr/1"; fi\nexit 0\n',
    { mode: 0o755 },
  );
  const ghLog = join(root, 'gh-log');
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, GH_LOG: ghLog, GITLAB_CI: '', CI: '' };
  const run = (args: string[], extraEnv: NodeJS.ProcessEnv = {}) => {
    const r = spawnSync('node', ['scripts/release/sync-fragments.mjs', ...args], {
      cwd: work, encoding: 'utf8', env: { ...env, ...extraEnv },
    });
    return { status: r.status, stdout: r.stdout, stderr: r.stderr };
  };
  const ghCalls = () => (existsSync(ghLog) ? readFileSync(ghLog, 'utf8') : '');
  const remoteHeads = () => git(origin, ['for-each-ref', '--format=%(refname:short)', 'refs/heads']).split('\n').filter(Boolean);
  const show = (ref: string, path: string) => git(origin, ['show', `${ref}:${path}`]);
  const changed = (ref: string, baseRef: string) =>
    git(origin, ['diff', '--name-only', baseRef, ref]).split('\n').filter(Boolean).sort();
  return { root, work, origin, run, ghCalls, remoteHeads, show, changed, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

const DEP = 'fragments/deprecations';
const CM = 'fragments/codemods';

describe('sync-fragments.mjs', () => {
  it('refuses under CI with exit 2', () => {
    const r = spawnSync('node', [join(REPO, 'scripts/release/sync-fragments.mjs'), '--to', 'next'], {
      cwd: REPO, encoding: 'utf8', env: { ...process.env, GITLAB_CI: 'true' },
    });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('refusing to run under CI');
  });

  it('rejects an unknown direction with exit 2', () => {
    const r = spawnSync('node', [join(REPO, 'scripts/release/sync-fragments.mjs'), '--to', 'main'], {
      cwd: REPO, encoding: 'utf8', env: { ...process.env, GITLAB_CI: '', CI: '' },
    });
    expect(r.status).toBe(2);
  });

  it('--to next: opens sync/fragments-deprecations-<date> from release/4.x, touching only the fragments and the generated aggregate (byte-equal to gen-deprecations)', () => {
    const fx = fixture({
      fourX: {
        [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001'), depRow('DEP-M0002')]),
        [`${DEP}/plat.ts`]: depFileComputed(['DEP-P0001', 'DEP-P0002']),
      },
      next: { [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001')]), [`${DEP}/plat.ts`]: depFile([]) },
    });
    try {
      const r = fx.run(['--to', 'next']);
      expect({ status: r.status, stderr: r.stderr }).toEqual({ status: 0, stderr: '' });
      const branch = `sync/fragments-deprecations-${today()}`;
      expect(fx.remoteHeads()).toContain(branch);
      expect(fx.changed(branch, 'next')).toEqual([
        'deprecations.json', `${DEP}/mat.ts`, `${DEP}/plat.ts`, 'src/internal/deprecations.generated.ts',
      ]);
      expect(fx.show(branch, `${DEP}/mat.ts`)).toBe(fx.show('release/4.x', `${DEP}/mat.ts`));
      expect(fx.show(branch, `${DEP}/plat.ts`)).toBe(fx.show('release/4.x', `${DEP}/plat.ts`));
      // byte-equal to the real generator run on the synced tree
      const generated = fx.show(branch, 'src/internal/deprecations.generated.ts');
      expect(generated).toContain('GENERATED by scripts/release/gen-deprecations.mjs');
      for (const id of ['DEP-M0001', 'DEP-M0002', 'DEP-P0001', 'DEP-P0002']) expect(generated).toContain(`"${id}"`);
      git(fx.work, ['checkout', '-q', branch]);
      const check = spawnSync('node', ['scripts/release/gen-deprecations.mjs', '--check'], { cwd: fx.work, encoding: 'utf8' });
      expect({ status: check.status, stderr: check.stderr }).toEqual({ status: 0, stderr: '' });
      // the PR is opened against next from the sync branch
      expect(fx.ghCalls()).toContain(`pr create --base next --head ${branch}`);
    } finally {
      fx.cleanup();
    }
  });

  it('target-only refusal: exits 1 listing the ids, changes nothing, until --allow-delete names every one; then the deletion propagates', () => {
    const fx = fixture({
      fourX: { [`${DEP}/cmp.ts`]: depFile([depRow('DEP-C0001')]) },
      next: { [`${DEP}/cmp.ts`]: depFile([depRow('DEP-C0001'), depRow('DEP-C0900'), depRow('DEP-C0901')]) },
    });
    try {
      const before = git(fx.work, ['rev-parse', 'HEAD']);
      const refused = fx.run(['--to', 'next']);
      expect(refused.status).toBe(1);
      expect(refused.stderr).toContain('DEP-C0900');
      expect(refused.stderr).toContain('DEP-C0901');
      expect(refused.stderr).not.toContain('DEP-C0001');
      expect(fx.remoteHeads().sort()).toEqual(['next', 'release/4.x']);
      expect(git(fx.work, ['branch', '--show-current']).trim()).toBe('next');
      expect(git(fx.work, ['rev-parse', 'HEAD'])).toBe(before);
      expect(git(fx.work, ['status', '--porcelain'])).toBe('');
      expect(fx.ghCalls()).not.toContain('pr create');

      // naming only one of the two still refuses, listing the other
      const partial = fx.run(['--to', 'next', '--allow-delete', 'DEP-C0900']);
      expect(partial.status).toBe(1);
      expect(partial.stderr).toContain('DEP-C0901');
      expect(partial.stderr).not.toContain('DEP-C0900');
      expect(fx.remoteHeads().sort()).toEqual(['next', 'release/4.x']);

      const ok = fx.run(['--to', 'next', '--allow-delete', 'DEP-C0900,DEP-C0901']);
      expect(ok.status).toBe(0);
      const branch = `sync/fragments-deprecations-${today()}`;
      const cmp = fx.show(branch, `${DEP}/cmp.ts`);
      expect(cmp).toContain('DEP-C0001');
      expect(cmp).not.toContain('DEP-C0900');
      expect(cmp).not.toContain('DEP-C0901');
      expect(fx.show(branch, 'src/internal/deprecations.generated.ts')).not.toContain('DEP-C0900');
      expect(git(fx.origin, ['log', '-1', '--format=%B', branch])).toContain('Deleted (--allow-delete): DEP-C0900, DEP-C0901');
    } finally {
      fx.cleanup();
    }
  });

  it('deletion propagation: a fragment file deleted on the source is deleted on the target (guarded as file:<path>)', () => {
    const fx = fixture({
      fourX: { [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001')]) },
      next: { [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001')]), [`${DEP}/qual.ts`]: depFile([]) },
    });
    try {
      const refused = fx.run(['--to', 'next']);
      expect(refused.status).toBe(1);
      expect(refused.stderr).toContain(`file:${DEP}/qual.ts`);
      const ok = fx.run(['--to', 'next', '--allow-delete', `file:${DEP}/qual.ts`]);
      expect(ok.status).toBe(0);
      const branch = `sync/fragments-deprecations-${today()}`;
      expect(git(fx.origin, ['ls-tree', '-r', '--name-only', branch, `${DEP}/`]).trim().split('\n')).toEqual([`${DEP}/mat.ts`]);
      expect(fx.changed(branch, 'next')).toContain(`${DEP}/qual.ts`);
    } finally {
      fx.cleanup();
    }
  });

  it('same-day skip: an existing remote branch or an open PR for today exits 0 without a new commit', () => {
    const fx = fixture({
      fourX: { [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001'), depRow('DEP-M0002')]) },
      next: { [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001')]) },
    });
    try {
      const branch = `sync/fragments-deprecations-${today()}`;
      const first = fx.run(['--to', 'next']);
      expect(first.status).toBe(0);
      const head = git(fx.origin, ['rev-parse', branch]);
      git(fx.work, ['checkout', '-q', 'next']);
      const second = fx.run(['--to', 'next']);
      expect(second.status).toBe(0);
      expect(second.stdout).toContain('once per working day');
      expect(git(fx.origin, ['rev-parse', branch])).toBe(head);
      expect(fx.ghCalls().match(/pr create/g)).toHaveLength(1);

      // open PR (no remote branch) also skips
      git(fx.origin, ['branch', '-D', branch]);
      const third = fx.run(['--to', 'next'], { GH_PR_LIST: '[{"number":7}]' });
      expect(third.status).toBe(0);
      expect(third.stdout).toContain('once per working day');
      expect(fx.remoteHeads()).not.toContain(branch);
    } finally {
      fx.cleanup();
    }
  });

  it('--to release/4.x: fragments/codemods/** flows next → release/4.x (rows + fixtures), touching nothing else; a 4.x-only codemod row is refused until allowed', () => {
    const fixtureFile = `${CM}/mat/fixtures/canonical-names/basic/input.tsx`;
    const fx = fixture({
      fourX: {
        [`${CM}/mat.ts`]: codemodFile([['OldOnFourX', 'Surface']]),
        [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001')]),
      },
      next: {
        [`${CM}/mat.ts`]: codemodFile([['OptimizedGlass', 'Surface'], ['GlassCore', 'Surface']]),
        [fixtureFile]: "import { OptimizedGlass } from 'aura-glass';\n",
        [`${DEP}/mat.ts`]: depFile([]),
      },
    });
    try {
      const refused = fx.run(['--to', 'release/4.x']);
      expect(refused.status).toBe(1);
      expect(refused.stderr).toContain('mat:renames:.:OldOnFourX');
      expect(fx.remoteHeads().sort()).toEqual(['next', 'release/4.x']);

      const ok = fx.run(['--to', 'release/4.x', '--allow-delete', 'mat:renames:.:OldOnFourX']);
      expect(ok.status).toBe(0);
      const branch = `sync/fragments-codemods-${today()}`;
      expect(fx.remoteHeads()).toContain(branch);
      expect(fx.changed(branch, 'release/4.x')).toEqual([fixtureFile, `${CM}/mat.ts`].sort());
      expect(fx.show(branch, `${CM}/mat.ts`)).toBe(fx.show('next', `${CM}/mat.ts`));
      expect(fx.show(branch, fixtureFile)).toBe(fx.show('next', fixtureFile));
      // deprecations on 4.x are untouched by the codemods direction
      expect(fx.show(branch, `${DEP}/mat.ts`)).toBe(fx.show('release/4.x', `${DEP}/mat.ts`));
      expect(fx.ghCalls()).toContain(`pr create --base release/4.x --head ${branch}`);
    } finally {
      fx.cleanup();
    }
  });

  it('already in sync: exits 0, pushes nothing and returns the operator to the starting branch', () => {
    const same = { [`${DEP}/mat.ts`]: depFile([depRow('DEP-M0001')]) };
    const fx = fixture({ fourX: same, next: same });
    try {
      const r = fx.run(['--to', 'next']);
      expect(r.status).toBe(0);
      expect(r.stdout).toContain('already in sync');
      expect(fx.remoteHeads().sort()).toEqual(['next', 'release/4.x']);
      expect(git(fx.work, ['branch', '--show-current']).trim()).toBe('next');
    } finally {
      fx.cleanup();
    }
  });
});
