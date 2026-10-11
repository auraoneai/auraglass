// tests/capability/report.test.ts — REQ-SURF-182.
// --report md regenerates the committed totals and per-release roadmap text;
// --report release-notes emits the "New capability" section for the rows of
// that minor, each with a GitLab job-artifact URL (a delivered row without one
// exits 1), and --out writes it for PLAT's release-note generator.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');
const REPORT = join(ROOT, 'docs/auraglass-5/capability-ledger.report.md');
const RUBRIC = { r1: true, r2: true, r3: true, r4: true, r5: true, r6: true };
const JOB_URL = 'https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/123456/artifacts/browse';

const run = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT });

function ledgerWith(artifacts: object[]) {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-report-'));
  writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify({
    $schema: './capability-ledger.schema.json', version: '1',
    rows: [{
      id: 'X-06', capability: '`Kbd`', area: 'foundation', priority: 'P2', owner: 'CMP', collaborators: [],
      form: ['export'], names: ['Kbd'], subpath: '.', release: '5.0', evidence: ['exception:fixture'], findings: [],
      reqRefs: [], rubric: RUBRIC, exportDelta: { root: 1, subpath: 0 }, budgetKb: 2, status: 'delivered',
      artifacts, demand: [], stories: [],
    }],
  }));
  return dir;
}

describe('verify-capability-ledger --report md', () => {
  it('emits the totals paragraph deterministically', () => {
    const a = run(['--report', 'md']);
    const b = run(['--report', 'md']);
    expect(a.status).toBe(0);
    const strip = (s: string) => s.replace(/ledger gate: \d+ ms/g, 'ledger gate: <ms> ms');
    expect(strip(a.stdout)).toBe(strip(b.stdout));
    expect(a.stdout).toMatch(/Totals: 58 rows\./);
    expect(a.stdout).toMatch(/P0 15, P1 27, P2 11, P3 5/);
    expect(a.stdout).toMatch(/5\.0 45, 5\.1 11, 5\.2 0, 5\.x\/labs 2/);
  });

  it('renders the roadmap grouped by release then area', () => {
    const r = run(['--report', 'md']);
    const text = r.stdout;
    const roadmap = text.slice(text.indexOf('capability-ledger:roadmap:start'), text.indexOf('capability-ledger:roadmap:end'));
    const releases = [...roadmap.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(releases).toEqual(['5.0', '5.1', '5.x (labs)']);
    // every live row is listed exactly once
    const ids = [...roadmap.matchAll(/^- (X-\d\d) /gm)].map((m) => m[1]);
    expect(ids).toHaveLength(58);
    expect(new Set(ids).size).toBe(58);
    expect(roadmap).not.toMatch(/X-R\d\d/);
    expect(roadmap).toMatch(/### media\n\n- X-37 P1 SURF \(export `\.\/media`; /);
  });

  it('the committed report matches the generator (--report md --check) and has roadmap sections', () => {
    const r = run(['--report', 'md', '--check']);
    expect(r.status).toBe(0);
    expect(existsSync(REPORT)).toBe(true);
    const text = readFileSync(REPORT, 'utf8');
    expect(text).toContain('capability-ledger:totals:start');
    expect(text).toContain('capability-ledger:roadmap:start');
    expect(text).toMatch(/^## 5\.1$/m);
  });
});

describe('verify-capability-ledger --report release-notes', () => {
  it('real ledger: header only while no 5.0 row is delivered', () => {
    const r = run(['--report', 'release-notes', '--version', '5.0.0']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('## New capability (5.0.0)');
  });

  it('delivered row without artifact exits 1', () => {
    const dir = ledgerWith([]);
    const r = run(['--ledger', join(dir, 'capability-ledger.json'), '--report', 'release-notes', '--version', '5.0.0']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-06: listed in release notes without a 5.0 CI job-artifact URL');
  });

  it('an artifact for another release does not count', () => {
    const dir = ledgerWith([{ release: '5.1', url: JOB_URL }]);
    const r = run(['--ledger', join(dir, 'capability-ledger.json'), '--report', 'release-notes', '--version', '5.0.0']);
    expect(r.status).toBe(1);
  });

  it('a non job-artifact URL is rejected by the schema', () => {
    const dir = ledgerWith([{ release: '5.0', url: 'https://example.com/5.0/pipelines/1' }]);
    const r = run(['--ledger', join(dir, 'capability-ledger.json'), '--report', 'release-notes', '--version', '5.0.0']);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/X-06\.artifacts\[0\]\.url/);
  });

  it('delivered row with a job-artifact URL lists it; --out writes the file', () => {
    const dir = ledgerWith([{ release: '5.0', url: JOB_URL }]);
    const r = run(['--ledger', join(dir, 'capability-ledger.json'), '--report', 'release-notes', '--version', '5.0.2']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(`- **Kbd** (X-06, CMP): \`Kbd\` — [CI artifacts](${JOB_URL})`);
    const outFile = join(dir, 'out', 'new-capability.md');
    const w = run(['--ledger', join(dir, 'capability-ledger.json'), '--report', 'release-notes', '--version', '5.0.0', '--out', outFile]);
    expect(w.status).toBe(0);
    expect(readFileSync(outFile, 'utf8')).toContain('## New capability (5.0.0)');
    expect(readFileSync(outFile, 'utf8')).toContain(JOB_URL);
  });
});
