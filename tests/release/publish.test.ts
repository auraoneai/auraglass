/* @jest-environment node */
// REQ-FIN-31 / REQ-PLAT-11: publish.mjs against a stub `npm` + stub `tar`.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const FIX = () => {
  const dir = mkdtempSync(join(tmpdir(), 'pub-'));
  mkdirSync(join(dir, 'bin'), { recursive: true });
  mkdirSync(join(dir, '.artifacts/pack'), { recursive: true });
  mkdirSync(join(dir, 'contracts'), { recursive: true });
  return dir;
};

const stubNpm = (dir: string, behavior: string) => {
  writeFileSync(join(dir, 'bin/npm'), `#!/usr/bin/env bash\necho "npm $*" >> "$NPMDIR/npm.log"\n${behavior}\n`);
  writeFileSync(join(dir, 'bin/tar'), `#!/usr/bin/env bash\nif [ "$1" = "-xzOf" ]; then echo '{"name":"aura-glass","version":"5.0.0"}'; fi\n`);
  execFileSync('chmod', ['+x', join(dir, 'bin/npm'), join(dir, 'bin/tar')]);
};

const envFor = (dir: string, extra: Record<string, string> = {}) => ({
  ...process.env,
  PATH: `${dir}/bin:${process.env.PATH}`,
  NPMDIR: dir,
  CI_COMMIT_TAG: 'v5.0.0',
  CI_COMMIT_SHA: 'abc123',
  AG_V4_DIST_TAG: 'v4-lts',
  AG_PUBLISH_DIR: join(dir, '.artifacts/pack'),
  ...extra,
});

const runPublish = (dir: string, env: Record<string, string>) => {
  try {
    const out = execFileSync('node', [`${process.cwd()}/scripts/release/publish.mjs`], {
      cwd: dir, env, encoding: 'utf8',
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

const putTarball = (dir: string, name: string, sha512: string | null) => {
  writeFileSync(join(dir, '.artifacts/pack', name), 'fake');
  if (sha512 !== null) {
    writeFileSync(join(dir, '.artifacts/plat/pack-record.json'.replace('.artifacts/plat/', '.artifacts/plat/')), '');
  }
};

const writeRecord = (dir: string, rec: any) => {
  mkdirSync(join(dir, '.artifacts/plat'), { recursive: true });
  writeFileSync(join(dir, '.artifacts/plat/pack-record.json'), JSON.stringify(rec));
};

const writePackages = (dir: string, names: string[]) => {
  const pkg: any = { version: 1, packages: {} };
  for (const n of names) pkg.packages[n] = { dir: '.', owner: 'PLAT', published: true };
  writeFileSync(join(dir, 'contracts/packages.json'), JSON.stringify(pkg));
};

// real sha512 for content 'fake'
import { createHash } from 'node:crypto';
const SHA = 'sha512-' + createHash('sha512').update('fake').digest('base64');

describe('publish.mjs (stub npm)', () => {
  it('fails when pack-record.json is missing', () => {
    const dir = FIX();
    writeFileSync(join(dir, '.artifacts/pack', 'aura-glass-5.0.0.tgz'), 'fake');
    stubNpm(dir, 'exit 0');
    const r = runPublish(dir, envFor(dir));
    expect(r.code).toBe(1);
    expect(r.out).toContain('pack-record');
  });

  it('fails when tarball sha512 mismatches the record', () => {
    const dir = FIX();
    writeFileSync(join(dir, '.artifacts/pack', 'aura-glass-5.0.0.tgz'), 'fake');
    writeRecord(dir, { 'aura-glass-5.0.0.tgz': { sha512: 'sha512-WRONG' } });
    writePackages(dir, ['aura-glass']);
    stubNpm(dir, 'if echo "$*" | grep -q "view"; then exit 1; fi; if echo "$*" | grep -q "dist-tag"; then echo "{}"; exit 0; fi; exit 0');
    const r = runPublish(dir, envFor(dir));
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/sha|integrity|mismatch/i);
  });

  it('fails when tarball package is not in contracts/packages.json', () => {
    const dir = FIX();
    writeFileSync(join(dir, '.artifacts/pack', 'aura-glass-5.0.0.tgz'), 'fake');
    writeRecord(dir, { 'aura-glass-5.0.0.tgz': { sha512: SHA } });
    writePackages(dir, ['@auraglass/cli']); // aura-glass NOT listed
    stubNpm(dir, 'exit 0');
    const r = runPublish(dir, envFor(dir));
    expect(r.code).toBe(1);
    expect(r.out).toContain('contracts/packages.json');
  });

  it('fails with no tarballs at all', () => {
    const dir = FIX();
    writePackages(dir, ['aura-glass']);
    stubNpm(dir, 'exit 0');
    const r = runPublish(dir, envFor(dir));
    expect(r.code).toBe(1);
  });

  it('passes and publishes with provenance when sha matches', () => {
    const dir = FIX();
    writeFileSync(join(dir, '.artifacts/pack', 'aura-glass-5.0.0.tgz'), 'fake');
    writeRecord(dir, { 'aura-glass-5.0.0.tgz': { sha512: SHA } });
    writePackages(dir, ['aura-glass']);
    stubNpm(dir, `if echo "$*" | grep -q "view aura-glass"; then exit 1; fi
if echo "$*" | grep -q "view "; then exit 1; fi
if echo "$*" | grep -q "dist-tag list"; then echo '{"latest":"5.0.0"}'; exit 0; fi
exit 0`);
    const r = runPublish(dir, envFor(dir));
    expect(r.code).toBe(0);
    const log = existsSync(join(dir, 'npm.log')) ? require('node:fs').readFileSync(join(dir, 'npm.log'), 'utf8') : '';
    expect(log).toContain('publish');
    expect(log).toContain('--provenance');
  });

  it('skips already-published versions (npm view hit) without publishing', () => {
    const dir = FIX();
    writeFileSync(join(dir, '.artifacts/pack', 'aura-glass-5.0.0.tgz'), 'fake');
    writeRecord(dir, { 'aura-glass-5.0.0.tgz': { sha512: SHA } });
    writePackages(dir, ['aura-glass']);
    stubNpm(dir, `if echo "$*" | grep -q "dist-tag list"; then echo '{"latest":"5.0.0"}'; exit 0; fi
if echo "$*" | grep -q "view"; then echo "5.0.0"; exit 0; fi
exit 0`);
    const r = runPublish(dir, envFor(dir));
    expect(r.code).toBe(0);
    const log = existsSync(join(dir, 'npm.log')) ? require('node:fs').readFileSync(join(dir, 'npm.log'), 'utf8') : '';
    expect(log).not.toContain('npm publish');
  });
});
