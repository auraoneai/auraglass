/* @jest-environment node */
// REQ-FIN-31 / REQ-PLAT-11, -14: scripts/release/publish.mjs against real
// tarballs and a stub `npm` on PATH that records argv and serves registry state;
// scripts/release/verify-release-verdict.mjs GA binding.
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const PUBLISH = join(ROOT, 'scripts/release/publish.mjs');
const VERDICT = join(ROOT, 'scripts/release/verify-release-verdict.mjs');

type Registry = {
  distTags: Record<string, Record<string, string>>;
  published: string[];
  files: Record<string, { name: string; version: string }>;
  freezeTags?: boolean; // publish succeeds but the dist-tag never moves
  viewError?: boolean; // every `npm view` fails with a non-404 error
};

// Stub npm: node script, state in $NPM_STUB_STATE, argv log in $NPM_STUB_LOG.
const STUB = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const statePath = process.env.NPM_STUB_STATE;
const s = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const a = process.argv.slice(2);
fs.appendFileSync(process.env.NPM_STUB_LOG, JSON.stringify(a) + '\\n');
const e404 = () => { process.stderr.write('npm error code E404\\nnpm error 404 Not Found\\n'); process.exit(1); };
if (a[0] === 'view') {
  if (s.viewError) { process.stderr.write('npm error code ECONNRESET\\n'); process.exit(1); }
  const spec = a[1];
  if (a[2] === 'dist-tags') {
    if (!s.distTags[spec]) e404();
    process.stdout.write(JSON.stringify(s.distTags[spec]));
    process.exit(0);
  }
  if (a[2] === 'version') {
    if (!s.published.includes(spec)) e404();
    process.stdout.write(spec.slice(spec.lastIndexOf('@') + 1) + '\\n');
    process.exit(0);
  }
}
if (a[0] === 'publish') {
  const f = s.files[path.basename(a[1])];
  const tag = a[a.indexOf('--tag') + 1];
  s.published.push(f.name + '@' + f.version);
  if (!s.freezeTags) { s.distTags[f.name] = s.distTags[f.name] || {}; s.distTags[f.name][tag] = f.version; }
  fs.writeFileSync(statePath, JSON.stringify(s));
  process.exit(0);
}
process.stderr.write('stub npm: unexpected ' + a.join(' ') + '\\n');
process.exit(3);
`;

const sha512 = (f: string) => 'sha512-' + createHash('sha512').update(readFileSync(f)).digest('base64');

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'ag-publish-'));
  for (const d of ['bin', '.artifacts/pack', '.artifacts/plat', 'contracts', 'src']) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, 'bin/npm'), STUB);
  chmodSync(join(dir, 'bin/npm'), 0o755);
  writeFileSync(
    join(dir, 'contracts/packages.json'),
    JSON.stringify({
      version: 1,
      packages: {
        'aura-glass': { dir: '.', published: true, fallback: 'aura-glass' },
        '@auraglass/cli': { dir: 'packages/cli', published: true, fallback: 'aura-glass-cli' },
        '@auraglass/qa': { dir: 'packages/qa', published: false },
      },
    }),
  );
  const state: Registry = { distTags: {}, published: [], files: {} };
  const record: any = { version: 1, line: '5x', sha: 'abc', packages: {} };
  const save = () => {
    writeFileSync(join(dir, 'state.json'), JSON.stringify(state));
    writeFileSync(join(dir, '.artifacts/plat/pack-record.json'), JSON.stringify(record));
  };
  const addTarball = (name: string, version: string, { record: rec = true } = {}) => {
    const src = mkdtempSync(join(tmpdir(), 'ag-pkg-'));
    mkdirSync(join(src, 'package'));
    writeFileSync(join(src, 'package/package.json'), JSON.stringify({ name, version }));
    const file = `${name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
    execFileSync('tar', ['-czf', join(dir, '.artifacts/pack', file), '-C', src, 'package']);
    state.files[file] = { name, version };
    if (rec) record.packages[name] = { file, version, integrity: sha512(join(dir, '.artifacts/pack', file)) };
    save();
    return file;
  };
  const run = (tag: string, env: Record<string, string> = {}, { noRecord = false } = {}) => {
    save();
    if (noRecord) rmSync(join(dir, '.artifacts/plat/pack-record.json'));
    const r = spawnSync('node', [PUBLISH, '--tag', tag, '--line', '5x', '--v4-dist-tag', 'v4-lts'], {
      cwd: dir,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${join(dir, 'bin')}:${process.env.PATH}`,
        NPM_STUB_STATE: join(dir, 'state.json'),
        NPM_STUB_LOG: join(dir, 'npm.log'),
        AG_ROLLBACK_LATEST_TO_4X: '',
        ...env,
      },
    });
    const log = existsSync(join(dir, 'npm.log'))
      ? readFileSync(join(dir, 'npm.log'), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
      : [];
    return { code: r.status, out: `${r.stdout}${r.stderr}`, publishes: log.filter((x: string[]) => x[0] === 'publish') };
  };
  return { dir, state, record, save, addTarball, run };
}

describe('publish.mjs (REQ-PLAT-11)', () => {
  it('fails when pack-record.json is missing', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    const r = f.run('v5.0.0-alpha.1', {}, { noRecord: true });
    expect(r.code).toBe(1);
    expect(r.out).toContain('pack-record');
    expect(r.out).toContain('missing');
    expect(r.publishes).toEqual([]);
  });

  it('fails on a sha512 mismatch between the record and the tarball', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    f.record.packages['aura-glass'].integrity = 'sha512-' + Buffer.from('other').toString('base64');
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(1);
    expect(r.out).toContain('sha512 mismatch');
    expect(r.publishes).toEqual([]);
  });

  it('fails when a tarball has no pack-record entry', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    f.addTarball('@auraglass/cli', '0.1.0', { record: false });
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(1);
    expect(r.out).toContain('@auraglass/cli');
    expect(r.out).toContain('no entry');
    expect(r.publishes).toEqual([]);
  });

  it('refuses a tarball for a package contracts/packages.json does not publish', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    f.addTarball('@auraglass/qa', '0.1.0');
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(1);
    expect(r.out).toContain('@auraglass/qa');
    expect(r.out).toContain('contracts/packages.json');
    expect(r.publishes).toEqual([]);
  });

  it('refuses when the aura-glass tarball version is not the tag', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.2');
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(1);
    expect(r.out).toContain('!= tag 5.0.0-alpha.1');
  });

  it('publishes each tarball with --provenance --access public and the derived tag', () => {
    const f = fixture();
    const root = f.addTarball('aura-glass', '5.0.0-alpha.1');
    const cli = f.addTarball('@auraglass/cli', '0.1.0');
    f.state.distTags['aura-glass'] = { latest: '4.1.0', next: '5.0.0-alpha.0' };
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(0);
    expect(r.publishes).toEqual([
      ['publish', join('.artifacts/pack', root), '--provenance', '--access', 'public', '--tag', 'next'],
      ['publish', join('.artifacts/pack', cli), '--provenance', '--access', 'public', '--tag', 'latest'],
    ]);
    expect(r.out).toContain('dist-tags verified');
  });

  it('skips a name@version already on the registry and still verifies its dist-tag', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    f.state.published.push('aura-glass@5.0.0-alpha.1');
    f.state.distTags['aura-glass'] = { latest: '4.1.0', next: '5.0.0-alpha.1' };
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(0);
    expect(r.out).toContain('already on the registry');
    expect(r.publishes).toEqual([]);
  });

  it('fails the post-publish check when the dist-tag did not move', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    f.state.distTags['aura-glass'] = { latest: '4.1.0', next: '5.0.0-alpha.0' };
    f.state.freezeTags = true;
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(1);
    expect(r.out).toContain("post-publish aura-glass: dist-tag 'next' is 5.0.0-alpha.0");
  });

  it('refuses a non-monotonic latest move; AG_ROLLBACK_LATEST_TO_4X=true allows a 4.x rollback', () => {
    const f = fixture();
    f.addTarball('aura-glass', '4.1.1');
    f.state.distTags['aura-glass'] = { latest: '4.2.0' };
    const refused = f.run('v4.1.1');
    expect(refused.code).toBe(1);
    expect(refused.out).toContain("dist-tag 'latest' would not move forward: 4.2.0 -> 4.1.1");
    expect(refused.publishes).toEqual([]);
    const allowed = f.run('v4.1.1', { AG_ROLLBACK_LATEST_TO_4X: 'true' });
    expect(allowed.code).toBe(0);
    expect(allowed.publishes.map((p) => p[p.length - 1])).toEqual(['latest']);
  });

  it('refuses a non-monotonic next move', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.3');
    f.state.distTags['aura-glass'] = { latest: '4.1.0', next: '5.0.0-beta.1' };
    const r = f.run('v5.0.0-alpha.3');
    expect(r.code).toBe(1);
    expect(r.out).toContain("dist-tag 'next' would not move forward: 5.0.0-beta.1 -> 5.0.0-alpha.3");
  });

  it('after 5.0 GA a 4.x stable goes to AG_V4_DIST_TAG', () => {
    const f = fixture();
    f.addTarball('aura-glass', '4.3.2');
    f.state.distTags['aura-glass'] = { latest: '5.0.0', 'v4-lts': '4.3.1' };
    const r = f.run('v4.3.2');
    expect(r.code).toBe(0);
    expect(r.publishes.map((p) => p[p.length - 1])).toEqual(['v4-lts']);
  });

  it('fails closed when the registry read errors (not a 404)', () => {
    const f = fixture();
    f.addTarball('aura-glass', '5.0.0-alpha.1');
    f.state.viewError = true;
    const r = f.run('v5.0.0-alpha.1');
    expect(r.code).toBe(1);
    expect(r.out).toContain('ECONNRESET');
    expect(r.publishes).toEqual([]);
  });
});

describe('verify-release-verdict.mjs (REQ-PLAT-11)', () => {
  const verdictDir = (verdict: object | null) => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-verdict-'));
    if (verdict) {
      mkdirSync(join(dir, '.artifacts/qual'), { recursive: true });
      writeFileSync(join(dir, '.artifacts/qual/release-verdict.json'), JSON.stringify(verdict));
    }
    return dir;
  };
  const run = (dir: string, tag: string, sha = 'f00d') => {
    const r = spawnSync('node', [VERDICT, '--tag', tag, '--line', '5x'], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, CI_COMMIT_SHA: sha },
    });
    return { code: r.status, out: `${r.stdout}${r.stderr}` };
  };

  it('GA tag: ga:false fails', () => {
    const r = run(verdictDir({ sha: 'f00d', ga: false, items: [{ id: 'G-01', status: 'fail' }] }), 'v5.0.0');
    expect(r.code).toBe(1);
    expect(r.out).toContain('G-01:fail');
  });
  it('GA tag: a verdict for another sha fails', () => {
    const r = run(verdictDir({ sha: 'beef', ga: true }), 'v5.0.0');
    expect(r.code).toBe(1);
    expect(r.out).toContain('verdict sha beef != CI_COMMIT_SHA f00d');
  });
  it('GA tag: a verdict without sha fails', () => {
    const r = run(verdictDir({ ga: true }), 'v5.0.0');
    expect(r.code).toBe(1);
    expect(r.out).toContain('has no sha');
  });
  it('GA tag: a missing verdict fails', () => {
    const r = run(verdictDir(null), 'v5.0.0');
    expect(r.code).toBe(1);
    expect(r.out).toContain('missing');
  });
  it('GA tag: matching sha and ga:true passes', () => {
    expect(run(verdictDir({ sha: 'f00d', ga: true }), 'v5.0.0').code).toBe(0);
  });
  it('pre-release tag: a missing verdict is advisory', () => {
    const r = run(verdictDir(null), 'v5.0.0-alpha.9');
    expect(r.code).toBe(0);
    expect(r.out).toContain('advisory');
  });
});
