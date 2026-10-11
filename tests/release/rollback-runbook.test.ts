/* REQ-PLAT-33: the rollback/deprecation runbook keeps its 8 scenarios and the
   operational literals the tooling actually reads. */
import { readFileSync } from 'node:fs';

const doc = readFileSync('docs/release-rollback-deprecation.md', 'utf8');

describe('rollback runbook (REQ-PLAT-33)', () => {
  it('has all 8 scenarios', () => {
    for (let i = 1; i <= 8; i++) expect(doc).toContain(`### S${i}`);
  });
  it('references the recorded rollback escape hatch', () => {
    expect(doc).toContain('AG_ROLLBACK_LATEST_TO_4X');
  });
  it('keeps the standard/emergency tier split', () => {
    expect(doc).toContain('tier');
    expect(doc).toContain('standard');
  });
  it('documents data-ag-transparency as the surface attribute', () => {
    expect(doc).toContain('data-ag-transparency');
  });
  it('codemod rollback is git checkout .', () => {
    expect(doc).toContain('git checkout .');
  });
  it('forbids npm unpublish as a rollback path', () => {
    expect(doc).toMatch(/never `?npm unpublish`?/i);
  });
  it('the drill record is written by the CI drill job, not by hand', () => {
    expect(doc).toContain('plat:release:rollback-drill');
    expect(doc).toContain('node scripts/release/rollback-drill.mjs --registry');
    expect(doc).toContain('docs/release/drills/<date>.json');
    expect(doc).toContain('node scripts/release/rollback-drill.mjs --verify');
  });
  it('the S2 command is executable by dist-tag.mjs', () => {
    expect(doc).toContain('node scripts/release/dist-tag.mjs --move latest --version 4.9.9');
  });
});
