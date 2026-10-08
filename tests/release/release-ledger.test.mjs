import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { changelogVersions, ledgerCheck } from '../../scripts/release/verify-release-ledger.mjs';

describe('release ledger (PLAT-200/201)', () => {
  it('parses CHANGELOG headings', () => {
    expect(changelogVersions('# Changelog\n## [4.2.0] — x\n## 4.1.1\n### sub')).toEqual(['4.2.0', '4.1.1']);
  });
  it('passes when all ledgers agree', () => {
    const v = ['4.2.0', '4.1.1'];
    const r = ledgerCheck({ changelog: v, tags: v, gitlab: v, npm: v });
    expect(r.errors).toEqual([]);
  });
  it('fails on a >=cut version missing from any ledger', () => {
    const r = ledgerCheck({
      changelog: ['4.2.0'], tags: ['4.2.0'], gitlab: [], npm: ['4.2.0'],
    });
    expect(r.errors.join()).toMatch(/4\.2\.0: missing from gitlab-release/);
  });
  it('pre-cut mismatches require a correction record, never fail when recorded', () => {
    const live = { changelog: [], tags: ['3.4.8'], gitlab: ['3.4.8'], npm: ['3.4.8'] };
    expect(ledgerCheck(live).errors.join()).toMatch(/3\.4\.8: pre-4\.1\.1 mismatch/);
    const r = ledgerCheck(live, {
      corrections: JSON.parse(readFileSync('docs/release/ledger-corrections.json', 'utf8')).corrections,
    });
    expect(r.errors).toEqual([]);
    expect(r.records.join()).toMatch(/3\.4\.8: recorded/);
  });
  it('--github mode includes GitHub Releases in the agreement set', () => {
    const r = ledgerCheck({ changelog: ['4.2.0'], tags: ['4.2.0'], gitlab: ['4.2.0'], npm: ['4.2.0'], github: [] });
    expect(r.errors.join()).toMatch(/github-release/);
  });
  it('every ledger-corrections entry is pre-cut', () => {
    const { corrections } = JSON.parse(readFileSync('docs/release/ledger-corrections.json', 'utf8'));
    for (const c of corrections) {
      expect(c.version).toMatch(/^\d+\.(\d+\.\d+|x)$/);
      if (!c.version.endsWith('.x')) expect(c.version.split('.').map(Number)).toEqual([Number(c.version.split('.')[0]), expect.any(Number), expect.any(Number)]);
    }
    const vers = corrections.map((c) => c.version);
    for (const v of ['3.4.8', '3.5.0', '3.0.7', '2.17.0', '2.16.4', '2.0.7', '2.0.8']) expect(vers).toContain(v);
  });
});
