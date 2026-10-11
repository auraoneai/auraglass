/**
 * @jest-environment node
 */
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): verify-fresh rejects a missing manifest, a SHA mismatch, a dirty CI build
   and an index hash mismatch; accepts a fresh one. Exercised through the CLI (exit codes) and the shared rules. */
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { freshnessProblems, sha256, MANIFEST_KEYS } from '../../scripts/storybook/lib/storybook-build.mjs';
import { buildManifest } from '../../scripts/storybook/write-build-manifest.mjs';

const ROOT = join(__dirname, '..', '..');
const CLI = join(ROOT, 'scripts', 'storybook', 'verify-fresh.mjs');
const SHA = 'a'.repeat(40);
const INDEX = JSON.stringify({ v: 5, entries: {
  'cmp-button--playground': { id: 'cmp-button--playground', type: 'story', title: 'Flagships/Controls/Button', name: 'Playground', importPath: './src/components/button/Button.stories.tsx', tags: ['flagship'] },
  'cmp-button--docs': { id: 'cmp-button--docs', type: 'docs', title: 'Flagships/Controls/Button', name: 'Docs', importPath: './src/components/button/Button.mdx' },
} });

let dir;
const manifest = (over = {}) => ({
  sha: SHA, dirty: false, builtAt: '2026-10-10T00:00:00.000Z', storybookVersion: '9.1.20', packageVersion: '5.0.0-alpha.0',
  storyCount: 1, indexSha256: sha256(INDEX), ...over,
});
const write = (m) => writeFileSync(join(dir, 'ag-build.json'), JSON.stringify(m));
const run = (args, env = {}) => spawnSync(process.execPath, [CLI, '--dir', dir, ...args], {
  encoding: 'utf8', env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'ag-verify-fresh-'));
  writeFileSync(join(dir, 'index.json'), INDEX);
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('verify-fresh.mjs (REQ-QUAL-56)', () => {
  it('accepts a fresh, clean build of the SHA under test (CI)', () => {
    write(manifest());
    const r = run(['--sha', SHA], { CI: 'true' });
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
  });

  it('takes the SHA under test from CI_COMMIT_SHA', () => {
    write(manifest());
    expect(run([], { CI: 'true', CI_COMMIT_SHA: SHA }).status).toBe(0);
    expect(run([], { CI: 'true', CI_COMMIT_SHA: 'b'.repeat(40) }).status).toBe(1);
  });

  it('case 1: missing manifest → non-zero', () => {
    const r = run(['--sha', SHA], { CI: 'true' });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/ag-build\.json is missing/);
  });

  it('case 2: SHA mismatch → non-zero', () => {
    write(manifest({ sha: 'c'.repeat(40) }));
    const r = run(['--sha', SHA], { CI: 'true' });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/≠ SHA under test/);
  });

  it('case 3: dirty tree → non-zero in CI (and with --require-clean), tolerated only outside CI', () => {
    write(manifest({ dirty: true }));
    const ci = run(['--sha', SHA], { CI: 'true' });
    expect(ci.status).toBe(1);
    expect(ci.stderr).toMatch(/dirty tree/);
    expect(run(['--sha', SHA, '--require-clean']).status).toBe(1);
    expect(run(['--sha', SHA]).status).toBe(0);
  });

  it('case 4: index hash mismatch → non-zero', () => {
    write(manifest());
    writeFileSync(join(dir, 'index.json'), INDEX.replace('Playground', 'Playground2'));
    const r = run(['--sha', SHA], { CI: 'true' });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/index\.json sha256/);
  });

  it('rejects a manifest missing any contract field, and a missing index.json', () => {
    for (const key of MANIFEST_KEYS) {
      const m = manifest();
      delete m[key];
      expect(freshnessProblems({ manifest: m, indexText: INDEX, sha: SHA, requireClean: true }).join('\n')).toContain(key);
    }
    expect(freshnessProblems({ manifest: manifest(), indexText: null, sha: SHA, requireClean: true })).toEqual(['index.json is missing']);
  });
});

describe('write-build-manifest.mjs (REQ-QUAL-56)', () => {
  it('writes the ag-build.json fields from the built index and the checkout', () => {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
    const { manifest: m, dirtyPaths } = buildManifest({ root: ROOT, dir, sha: head, now: new Date('2026-10-10T12:00:00Z') });
    expect(Object.keys(m).sort()).toEqual([...MANIFEST_KEYS].sort());
    expect(m.sha).toBe(head);
    expect(m.storyCount).toBe(1); // docs entries are not stories
    expect(m.indexSha256).toBe(sha256(readFileSync(join(dir, 'index.json'))));
    expect(m.builtAt).toBe('2026-10-10T12:00:00.000Z');
    expect(m.packageVersion).toBe(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version);
    expect(m.storybookVersion).toMatch(/^9\.\d+\.\d+/);
    expect(m.dirty).toBe(dirtyPaths.length > 0);
    write(m);
    expect(freshnessProblems({ manifest: m, indexText: readFileSync(join(dir, 'index.json')), sha: head, requireClean: false })).toEqual([]);
  });
});
