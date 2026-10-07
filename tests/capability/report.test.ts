// tests/capability/report.test.ts — REQ-SURF-182.
// --report md regenerates the committed totals text; --report release-notes
// emits a New-capability section for the rows of that minor.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');
const REPORT = join(ROOT, 'docs/auraglass-5/capability-ledger.report.md');

const run = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT });

describe('verify-capability-ledger --report', () => {
  it('--report md emits the totals paragraph deterministically', () => {
    const a = run(['--report', 'md']);
    const b = run(['--report', 'md']);
    expect(a.status).toBe(0);
    // normalize the runtime line (it is inherently nondeterministic)
    const strip = (s: string) => s.replace(/ledger gate: \d+ ms/g, 'ledger gate: <ms> ms');
    expect(strip(a.stdout)).toBe(strip(b.stdout));
    expect(a.stdout).toMatch(/Totals: 58 rows\./);
    expect(a.stdout).toMatch(/P0 15, P1 27, P2 11, P3 5/);
    expect(a.stdout).toMatch(/5\.0 45, 5\.1 11, 5\.2 0, 5\.x\/labs 2/);
  });

  it('the committed report matches the generator (--report md --check)', () => {
    const r = run(['--report', 'md', '--check']);
    expect(r.status).toBe(0);
    expect(existsSync(REPORT)).toBe(true);
    expect(readFileSync(REPORT, 'utf8')).toContain('capability-ledger:totals:start');
  });

  it('release-notes requires an artifact URL per listed row', () => {
    // No row is 'delivered' yet at day 0: the section is a header only.
    const r = run(['--report', 'release-notes', '--version', '5.0.0']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('## New capability (5.0.0)');
  });
});
