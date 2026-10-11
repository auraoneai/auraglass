/**
 * @jest-environment node
 *
 * FIN-D agent prep (REQ-FIN-54 / REQ-MAT-22 step 5, #178): the mat:tokens-js
 * size evidence copies the size tool's numbers verbatim and fails closed when
 * the tool did not measure the row.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/mat/size-row-evidence.mjs');

const run = (args: string[], env: Record<string, string | undefined> = {}) => {
  const base = { ...process.env };
  delete base.CI;
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', env: { ...base, ...env } });
};

const toolDoc = (rows: unknown[]) => ({ generatedAt: '2026-10-10T00:00:00.000Z', rows, ceilings: {}, measured: {} });

describe('size-row-evidence', () => {
  const dirs: string[] = [];
  const tmp = () => { const d = mkdtempSync(join(tmpdir(), 'size-evidence-')); dirs.push(d); return d; };
  afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

  it('copies the measured row and the full tool output into the out dir', () => {
    const dir = tmp();
    const from = join(dir, 'size-budgets.in.json');
    writeFileSync(from, JSON.stringify(toolDoc([
      { id: 'mat:tokens-js', import: 'aura-glass/tokens', limitBytes: 2048, kind: 'js', status: 'fail', measuredBytes: 4100 },
      { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js', status: 'pass', measuredBytes: 55 },
    ])));
    const out = join(dir, 'out');
    const res = run(['--from', from, '--out-dir', out, '--proposed', '6144'],
      { CI_COMMIT_SHA: 'abc123', CI_JOB_URL: 'https://example.invalid/jobs/1', CI_PIPELINE_URL: 'https://example.invalid/pipelines/1' });
    expect(res.stderr).toBe('');
    expect(res.status).toBe(0);
    const rec = JSON.parse(readFileSync(join(out, 'mat-tokens-js.json'), 'utf8'));
    expect(rec).toMatchObject({
      row: 'mat:tokens-js', measuredBytes: 4100, limitBytes: 2048, withinLimit: false,
      proposedLimitBytes: 6144, withinProposed: true, toolStatus: 'fail',
      toolGeneratedAt: '2026-10-10T00:00:00.000Z', commitSha: 'abc123',
      jobUrl: 'https://example.invalid/jobs/1', pipelineUrl: 'https://example.invalid/pipelines/1', toolExit: null,
    });
    expect(JSON.parse(readFileSync(join(out, 'size-budgets.json'), 'utf8')).rows).toHaveLength(2);
  });

  it('fails closed when the tool left the row pending', () => {
    const dir = tmp();
    const from = join(dir, 'in.json');
    writeFileSync(from, JSON.stringify(toolDoc([
      { id: 'mat:tokens-js', import: 'aura-glass/tokens', limitBytes: 2048, kind: 'js', status: 'pending', measuredBytes: null },
    ])));
    const res = run(['--from', from, '--out-dir', join(dir, 'out')]);
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('mat:tokens-js: not measured by scripts/ci/verify-size-budgets.mjs (status pending)');
    expect(existsSync(join(dir, 'out', 'mat-tokens-js.json'))).toBe(false);
  });

  it('fails closed when the row is absent', () => {
    const dir = tmp();
    const from = join(dir, 'in.json');
    writeFileSync(from, JSON.stringify(toolDoc([])));
    const res = run(['--from', from, '--out-dir', join(dir, 'out'), '--row', 'mat:tokens-js']);
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('mat:tokens-js: row not present');
  });

  it('exits 2 with the remote job when invoked locally without --from', () => {
    const res = run([]);
    expect(res.status).toBe(2);
    expect(res.stderr).toContain('job mat:test:size-evidence');
  });

  it('rejects a non-integer --proposed', () => {
    const res = run(['--from', '/nonexistent', '--proposed', '6k']);
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('--proposed must be a positive integer');
  });
});
