import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';

const runbook = readFileSync('docs/release-rollback-deprecation.md', 'utf8');

describe('rollback runbook (PLAT-206)', () => {
  it('keeps the fixed five-step sequence', () => {
    for (const step of ['1. Triage', '2. Contain', '3. Verify fix', '4. Deprecate', '5. Recover'])
      expect(runbook).toContain(step);
  });
  it('has a script-checkable preflight block requiring dry-run evidence', () => {
    const m = runbook.match(/```text\npreflight:([\s\S]*?)```/);
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/dry-run/);
    expect(m?.[1]).toMatch(/pack --dry-run/);
    expect(m?.[1]).toMatch(/dist-tag/);
  });
  it('documents the first-72-hours deprecate window', () => {
    expect(runbook).toMatch(/72 hours/i);
    expect(runbook).toMatch(/npm deprecate/);
  });
  it('forbids whole-package unpublish', () => {
    expect(runbook).toMatch(/whole-package `npm unpublish` is forbidden/i);
  });
  it('names the decision gates', () => {
    expect(runbook).toContain('## Decision Gates');
    expect(runbook).toMatch(/release owner/i);
  });
});
