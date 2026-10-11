/** @jest-environment node */
// REQ-SURF-152 — scripts/surf/calibrate-media-tone.mjs file modes. The
// artifacts below are synthetic test inputs written to a temp dir; they never
// reach scene-stats.json (the script writes to --fixture <tmp>).
import { afterAll, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SCENES } from '../../src/contracts/testing';

const SCRIPT = join(__dirname, '..', '..', 'scripts', 'surf', 'calibrate-media-tone.mjs');
const dir = mkdtempSync(join(tmpdir(), 'ag-calibrate-'));
afterAll(() => { rmSync(dir, { recursive: true, force: true }); });

const run = (...args: string[]) => spawnSync(process.execPath, [SCRIPT, ...args], {
  encoding: 'utf8',
  env: { ...process.env, CI: '', AG_REMOTE_RUNNER: '' },
});

const artifact = (scenes: readonly string[] = SCENES, extra: Record<string, unknown> = {}) => ({
  generatedBy: 'scripts/surf/calibrate-media-tone.mjs',
  job: 'https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/1',
  sha: '0'.repeat(40),
  engine: 'chromium test',
  measuredAt: '2026-10-10T00:00:00.000Z',
  scenes: Object.fromEntries(scenes.map((id, i) => [id, { mean: i / 10 + 0.012345, p10: i / 20, p90: i / 10 + 0.05, stdev: 0.1, tone: i % 2 ? 'dark' : 'busy' }])),
  ...extra,
});
const put = (name: string, value: unknown) => {
  const p = join(dir, name);
  writeFileSync(p, JSON.stringify(value));
  return p;
};

describe('calibrate-media-tone.mjs (REQ-SURF-152)', () => {
  it('measuring outside CI exits 2 and names the remote job', () => {
    const r = run();
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('surf:test:media-tone-calibration');
  });

  it('--write --from writes the 8 scenes rounded to 4 decimals with the artifact provenance; --check then passes', () => {
    const from = put('a.json', artifact());
    const fixture = join(dir, 'scene-stats.json');
    const w = run('--write', '--from', from, '--fixture', fixture);
    expect(w.status).toBe(0);
    const f = JSON.parse(readFileSync(fixture, 'utf8'));
    expect(Object.keys(f.scenes)).toEqual([...SCENES]);
    expect(f.scenes[SCENES[0]]).toEqual({ mean: 0.0123, p10: 0, p90: 0.05, stdev: 0.1, expect: 'busy' });
    expect(f.source).toEqual({ job: artifact().job, sha: '0'.repeat(40), engine: 'chromium test', measuredAt: '2026-10-10T00:00:00.000Z' });
    expect(run('--check', '--from', from, '--fixture', fixture).status).toBe(0);
  });

  it('--check exits 1 when one scene differs', () => {
    const from = put('b.json', artifact());
    const fixture = join(dir, 'scene-stats-b.json');
    expect(run('--write', '--from', from, '--fixture', fixture).status).toBe(0);
    const f = JSON.parse(readFileSync(fixture, 'utf8'));
    f.scenes['flat-white'].mean = 0.5;
    writeFileSync(fixture, JSON.stringify(f));
    const r = run('--check', '--from', from, '--fixture', fixture);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('flat-white');
  });

  it("rejects an artifact with a 'pending' key or without all 8 scenes", () => {
    const fixture = join(dir, 'unused.json');
    const pending = put('p.json', artifact(SCENES, { scenes: { photo: { pending: true } } }));
    expect(run('--write', '--from', pending, '--fixture', fixture).status).toBe(1);
    const seven = put('s.json', artifact(SCENES.slice(1)));
    const r = run('--write', '--from', seven, '--fixture', fixture);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('8 S-42 ids');
  });
});
