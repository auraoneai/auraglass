/* @jest-environment node */
// PLAT-019/020: gitlab-status.mjs against recorded API fixtures. The mock API
// runs in a child process (sync exec in the test would starve an in-process
// server).
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { execFileSync, spawn, spawnSync, type ChildProcess } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

const FIX = 'tests/ci/fixtures/gitlab-api';
const SCRIPT = 'scripts/ci/gitlab-status.mjs';

// helper: serves the fixture body on :0, prints the port on stdout
function startApi(fixturePath: string): Promise<{ port: number; child: ChildProcess }> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [
        '-e',
        `const f=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
         require('http').createServer((q,r)=>{
           r.setHeader('content-type','application/json');
           if(q.url.includes('/pipelines')&&q.url.includes('/jobs')) r.end(JSON.stringify(f.jobs??[]));
           else if(q.url.includes('/pipelines')) r.end(JSON.stringify(f.pipelines));
           else{r.statusCode=404;r.end('{}')}
         }).listen(0,'127.0.0.1',function(){console.log(this.address().port)});`,
        fixturePath,
      ],
      { stdio: ['ignore', 'pipe', 'ignore'] },
    );
    let buf = '';
    child.stdout!.on('data', (d) => {
      buf += d;
      const port = parseInt(buf.trim(), 10);
      if (port) resolve({ port, child });
    });
  });
}

function run(base: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT, '--sha', 'sha-under-test', '--api-base', base], {
      encoding: 'utf8',
      env: { ...process.env, CI: '', GITLAB_CI: '' },
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

describe('gitlab-status.mjs', () => {
  it.each(readdirSync(FIX).filter((f) => f.endsWith('.json')))('fixture %s', async (file) => {
    const fixture = JSON.parse(readFileSync(join(FIX, file), 'utf8'));
    const want = fixture.expect;
    const { port, child } = await startApi(join(process.cwd(), FIX, file));
    try {
      const r = run(`http://127.0.0.1:${port}`);
      expect(r.code).toBe(want.code);
      for (const s of want.contains ?? []) expect(r.out).toContain(s);
    } finally {
      child.kill();
    }
  }, 30000);
});

// REQ-FIN-20 fallback (OD-8), REQ-PLAT-06, FIN-044/045: push-gitlab-refs.mjs
// against a stubbed `git` placed first on PATH. The stub logs every argv to a
// file, answers `ls-remote` from a fixture and `show origin/main:<workflow>`
// from a fixture workflow, and never touches a network or a real repository.
describe('push-gitlab-refs', () => {
  const PUSH_SCRIPT = join(process.cwd(), 'scripts/release/push-gitlab-refs.mjs');
  const SHA = (n: number) => n.toString(16).padStart(40, '0');
  // One matching ref per pattern, plus refs that must NOT be selected.
  const LS_REMOTE = [
    [SHA(1), 'refs/heads/main'],
    [SHA(2), 'refs/heads/next'],
    [SHA(3), 'refs/heads/release/4.x'],
    [SHA(4), 'refs/heads/release/4.1.x'],
    [SHA(5), 'refs/heads/next-fin/b-ci'],
    [SHA(6), 'refs/heads/4x-fin/b-ci'],
    [SHA(7), 'refs/heads/4x11-fin/b-ci'],
    [SHA(8), 'refs/heads/contract/v1.2-final'],
    [SHA(9), 'refs/heads/sync/fragments-deprecations-20261010'],
    [SHA(10), 'refs/tags/v4.1.0'],
    [SHA(11), 'refs/tags/v4.1.0^{}'],
    // not selected:
    [SHA(12), 'refs/heads/feature/x'],
    [SHA(13), 'refs/heads/next-fin'],
    [SHA(14), 'refs/heads/release/3.x'],
    [SHA(15), 'refs/heads/auraglass-5-planning'],
    [SHA(16), 'refs/tags/release-candidate'],
    [SHA(17), 'refs/heads/contract'],
  ]
    .map(([s, r]) => `${s}\t${r}`)
    .join('\n');
  const SELECTED = [
    'refs/heads/main',
    'refs/heads/next',
    'refs/heads/release/4.x',
    'refs/heads/release/4.1.x',
    'refs/heads/next-fin/b-ci',
    'refs/heads/4x-fin/b-ci',
    'refs/heads/4x11-fin/b-ci',
    'refs/heads/contract/v1.2-final',
    'refs/heads/sync/fragments-deprecations-20261010',
    'refs/tags/v4.1.0',
  ];
  const NOT_SELECTED = [
    'refs/heads/feature/x',
    'refs/heads/next-fin\n',
    'refs/heads/release/3.x',
    'refs/heads/auraglass-5-planning',
    'refs/tags/release-candidate',
    'refs/heads/contract\n',
    'v4.1.0^{}',
  ];
  const WF_PRUNE = 'run: |\n  git push gitlab --force --all --prune || git push gitlab --force --all\n';
  const WF_NO_PRUNE = 'run: |\n  git push gitlab --force --all\n  git push gitlab --force --tags\n';

  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'push-gitlab-refs-'));
    mkdirSync(join(dir, 'bin'));
    writeFileSync(join(dir, 'ls-remote.txt'), `${LS_REMOTE}\n`);
    const stub = `#!${process.execPath}
const fs = require('fs');
const a = process.argv.slice(2);
fs.appendFileSync(process.env.STUB_GIT_LOG, JSON.stringify(a) + '\\n');
if (a[0] === 'ls-remote') { process.stdout.write(fs.readFileSync(process.env.STUB_LS_REMOTE, 'utf8')); process.exit(0); }
if (a[0] === 'show') {
  if (!process.env.STUB_WORKFLOW) { process.stderr.write("fatal: path '.github/workflows/mirror-to-gitlab.yml' does not exist in 'origin/main'\\n"); process.exit(128); }
  process.stdout.write(fs.readFileSync(process.env.STUB_WORKFLOW, 'utf8')); process.exit(0);
}
if (a[0] === 'fetch' || a[0] === 'push') process.exit(0);
process.stderr.write('stub git: unexpected ' + a.join(' ') + '\\n'); process.exit(97);
`;
    writeFileSync(join(dir, 'bin', 'git'), stub);
    chmodSync(join(dir, 'bin', 'git'), 0o755);
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  function runPush(args: string[], env: Record<string, string>, workflow: string | null) {
    const wfPath = join(dir, 'workflow.yml');
    if (workflow !== null) writeFileSync(wfPath, workflow);
    const r = spawnSync(process.execPath, [PUSH_SCRIPT, ...args], {
      encoding: 'utf8',
      env: {
        PATH: `${join(dir, 'bin')}${delimiter}${process.env.PATH}`,
        HOME: dir,
        STUB_GIT_LOG: join(dir, 'git.log'),
        STUB_LS_REMOTE: join(dir, 'ls-remote.txt'),
        STUB_WORKFLOW: workflow === null ? '' : wfPath,
        USER: 'gurbakshchahal',
        ...env,
      },
    });
    const log = existsSync(join(dir, 'git.log'))
      ? readFileSync(join(dir, 'git.log'), 'utf8')
          .trim()
          .split('\n')
          .map((l) => JSON.parse(l) as string[])
      : [];
    return { code: r.status, out: `${r.stdout}${r.stderr}`, stdout: r.stdout, log };
  }

  it('dry-run prints every ref pattern and one git push per selected ref, pushes nothing', () => {
    const r = runPush([], {}, WF_PRUNE);
    expect(r.code).toBe(0);
    for (const p of [
      'main',
      'next',
      'release/4.x',
      'release/4.1.x',
      'next-*/**',
      '4x-*/**',
      '4x11-*/**',
      'contract/**',
      'sync/**',
      'v*',
    ]) {
      expect(r.stdout).toContain(p);
    }
    const pushLines = r.stdout.split('\n').filter((l) => l.startsWith('git push '));
    expect(pushLines).toHaveLength(SELECTED.length);
    for (const ref of SELECTED) {
      expect(pushLines.some((l) => l.endsWith(`:${ref}`))).toBe(true);
    }
    for (const ref of NOT_SELECTED) expect(`${pushLines.join('\n')}\n`).not.toContain(ref);
    expect(pushLines.join('\n')).not.toMatch(/--force|--prune|--mirror|--all/);
    // the stub saw no push and no fetch: dry-run only reads
    expect(r.log.map((a) => a[0])).not.toContain('push');
    expect(r.log.map((a) => a[0])).not.toContain('fetch');
    // and it reports the guard that --apply would hit
    expect(r.stdout).toContain('--apply would currently be refused');
    expect(r.stdout).toContain('--prune');
  });

  it('--apply under CI=1 exits 1 and runs no git command', () => {
    const r = runPush(['--apply'], { CI: '1' }, WF_NO_PRUNE);
    expect(r.code).toBe(1);
    expect(r.out).toContain('CI/GITLAB_CI is set');
    expect(r.log).toEqual([]);
  });

  it('--apply as a user other than the owner exits 1 and runs no git command', () => {
    const r = runPush(['--apply'], { USER: 'someone-else' }, WF_NO_PRUNE);
    expect(r.code).toBe(1);
    expect(r.out).toContain('not the owner account');
    expect(r.log).toEqual([]);
  });

  it('--apply while origin/main mirror-to-gitlab.yml has --prune exits 1 naming OD-8, pushes nothing', () => {
    const r = runPush(['--apply'], {}, WF_PRUNE);
    expect(r.code).toBe(1);
    expect(r.out).toContain('OD-8');
    expect(r.out).toContain('--prune');
    expect(r.log.some((a) => a[0] === 'show' && a[1] === 'origin/main:.github/workflows/mirror-to-gitlab.yml')).toBe(
      true,
    );
    expect(r.log.map((a) => a[0])).not.toContain('push');
  });

  it('--apply refuses a GitLab URL with embedded credentials', () => {
    const r = runPush(['--apply', '--gitlab-url', 'https://oauth2:tok@gitlab.example/x.git'], {}, WF_NO_PRUNE);
    expect(r.code).toBe(1);
    expect(r.out).toContain('embeds credentials');
    expect(r.out).not.toContain('tok@');
    expect(r.log).toEqual([]);
  });

  it('--apply as owner with a prune-free workflow pushes each selected ref by SHA, never forced', () => {
    const r = runPush(['--apply'], {}, WF_NO_PRUNE);
    expect(r.code).toBe(0);
    const pushes = r.log.filter((a) => a[0] === 'push');
    expect(pushes).toHaveLength(SELECTED.length);
    for (const p of pushes) {
      expect(p).toHaveLength(3);
      expect(p[1]).toBe('https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass.git');
      expect(p[2]).toMatch(/^[0-9a-f]{40}:refs\/(heads|tags)\//);
    }
    expect(pushes.map((p) => String(p[2]).split(':')[1]).sort()).toEqual([...SELECTED].sort());
    // origin/main is refreshed before the --prune check
    const fetchIdx = r.log.findIndex((a) => a[0] === 'fetch');
    const showIdx = r.log.findIndex((a) => a[0] === 'show');
    expect(fetchIdx).toBeGreaterThanOrEqual(0);
    expect(fetchIdx).toBeLessThan(showIdx);
  });
});
