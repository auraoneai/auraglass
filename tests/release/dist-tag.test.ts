/* @jest-environment node */
// REQ-PLAT-14: scripts/release/dist-tag.mjs is a pure function. The seven PRD
// cases run offline with no `npm` on PATH; the monotonic guard and the CLI's
// --check record are covered against a stub registry.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cmpSemver, distTagFor, monotonicViolation } from '../../scripts/release/dist-tag.mjs';

const CLI = join(process.cwd(), 'scripts/release/dist-tag.mjs');
const distTag = (v: string, o: { ga?: boolean; rollback?: boolean } = {}) =>
  distTagFor(v, { v4DistTag: 'v4-lts', ...o });

// An empty PATH entry plus node's own dir: `npm` is not resolvable.
const OFFLINE_PATH = mkdtempSync(join(tmpdir(), 'ag-nonpm-'));

describe('distTagFor — PRD REQ-PLAT-14 cases (offline)', () => {
  it("distTag('4.1.1',{ga:false})==='latest'", () => expect(distTag('4.1.1', { ga: false })).toBe('latest'));
  it("('4.3.2',{ga:true})==='v4-lts'", () => expect(distTag('4.3.2', { ga: true })).toBe('v4-lts'));
  it("('5.0.0-beta.3')==='next'", () => expect(distTag('5.0.0-beta.3')).toBe('next'));
  it("('5.0.0')==='latest'", () => expect(distTag('5.0.0')).toBe('latest'));
  it("('5.1.0')==='latest'", () => expect(distTag('5.1.0')).toBe('latest'));
  it("('4.4.0',{ga:true,rollback:true})==='latest'", () =>
    expect(distTag('4.4.0', { ga: true, rollback: true })).toBe('latest'));
  it("('3.9.9') throws", () => expect(() => distTag('3.9.9')).toThrow('dist-tag: no rule for major 3'));

  it('the CLI needs no registry when --ga is given (no npm on PATH)', () => {
    const r = spawnSync(process.execPath, [CLI, '4.3.2', '--ga', 'true', '--v4-dist-tag', 'v4-lts'], {
      encoding: 'utf8',
      env: { PATH: OFFLINE_PATH },
    });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('v4-lts');
  });
  it('the CLI fails (does not guess) when GA state is unknown and the registry is unreachable', () => {
    const r = spawnSync(process.execPath, [CLI, '4.3.2'], { encoding: 'utf8', env: { PATH: OFFLINE_PATH } });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('cannot determine GA state');
  });
});

describe('semver compare + monotonic guard', () => {
  it('orders by semver 2.0 precedence', () => {
    expect(cmpSemver('5.0.0', '4.9.9')).toBe(1);
    expect(cmpSemver('5.0.0-rc.1', '5.0.0')).toBe(-1);
    expect(cmpSemver('5.0.0-alpha.10', '5.0.0-alpha.9')).toBe(1);
    expect(cmpSemver('5.0.0-beta.1', '5.0.0-alpha.12')).toBe(1);
    expect(cmpSemver('5.0.0-alpha', '5.0.0-alpha.1')).toBe(-1);
    expect(cmpSemver('4.10.0', '4.9.0')).toBe(1);
    expect(cmpSemver('v4.1.1', '4.1.1')).toBe(0);
  });
  it.each([
    ['latest', '4.1.1', '4.2.0'],
    ['latest', '5.0.0', '5.0.1'],
    ['v4-lts', '4.3.1', '4.3.2'],
    ['next', '5.0.0-alpha.3', '5.0.0-beta.1'],
    ['next', '5.0.0-rc.1', '5.0.0-rc.1'],
  ])('refuses %s %s over %s', (tag, nv, cur) => {
    expect(monotonicViolation(tag, nv, cur)).toContain(`'${tag}' would not move forward: ${cur} -> ${nv}`);
  });
  it.each([
    ['latest', '4.2.0', '4.1.0'],
    ['v4-lts', '4.3.2', '4.3.1'],
    ['next', '5.0.0-beta.1', '5.0.0-alpha.12'],
    ['next', '5.0.0-alpha.0', undefined],
  ])('allows %s %s over %s', (tag, nv, cur) => {
    expect(monotonicViolation(tag, nv, cur as string | undefined)).toBeNull();
  });
  it('rollback allows only a 4.x publish onto latest', () => {
    expect(monotonicViolation('latest', '4.4.0', '5.0.1', { rollbackOk: true })).toBeNull();
    expect(monotonicViolation('latest', '5.0.0', '5.0.1', { rollbackOk: true })).toContain('would not move forward');
    expect(monotonicViolation('v4-lts', '4.3.1', '4.3.2', { rollbackOk: true })).toContain('would not move forward');
    expect(monotonicViolation('latest', '4.4.0', '5.0.1')).toContain('AG_ROLLBACK_LATEST_TO_4X=true');
  });
});

describe('dist-tag.mjs --check (plat:release:verify-dist-tags)', () => {
  const stub = (tags: Record<string, string>) => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-disttag-'));
    mkdirSync(join(dir, 'bin'));
    writeFileSync(
      join(dir, 'bin/npm'),
      `#!/bin/sh\nif [ "$1" = view ] && [ "$3" = dist-tags ]; then printf '%s' '${JSON.stringify(tags)}'; exit 0; fi\nexit 3\n`,
    );
    chmodSync(join(dir, 'bin/npm'), 0o755);
    return dir;
  };
  const check = (dir: string, tag: string) =>
    spawnSync(
      process.execPath,
      [CLI, '--check', tag, '--line', '5x', '--v4-dist-tag', 'v4-lts', '--out', join(dir, 'out/dist-tags.json')],
      { encoding: 'utf8', env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}` } },
    );

  it('writes dist-tags.json and passes when the version holds the derived tag', () => {
    const dir = stub({ latest: '4.1.0', next: '5.0.0-alpha.1' });
    const r = check(dir, 'v5.0.0-alpha.1');
    expect(r.status).toBe(0);
    const rec = JSON.parse(readFileSync(join(dir, 'out/dist-tags.json'), 'utf8'));
    expect(rec).toMatchObject({ version: '5.0.0-alpha.1', expected: 'next', holding: ['next'], ok: true, ga: false });
    expect(rec.registry).toEqual({ latest: '4.1.0', next: '5.0.0-alpha.1' });
  });
  it('fails (and still writes the record) when the registry disagrees', () => {
    const dir = stub({ latest: '5.0.0', 'v4-lts': '4.3.1', next: '5.0.1-rc.1' });
    const r = check(dir, 'v4.3.2');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("expected on 'v4-lts'");
    expect(JSON.parse(readFileSync(join(dir, 'out/dist-tags.json'), 'utf8')).ok).toBe(false);
  });
  it('rejects a non-release tag', () => {
    const r = check(stub({}), 'manual-run');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('not a release tag');
  });
});
