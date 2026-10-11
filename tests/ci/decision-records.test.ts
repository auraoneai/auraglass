/* @jest-environment node */
// PLAT-025/026/027/051/052: decision records exist with a status field per row.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';

const STATUS = /applied|missing|verified|failed|pending|unverified/i;

describe('gitlab decision records', () => {
  it('gitlab-project-settings.md lists every setting with a status', () => {
    const f = 'docs/release/decisions/gitlab-project-settings.md';
    expect(existsSync(f)).toBe(true);
    const text = readFileSync(f, 'utf8');
    for (const row of text.split('\n').filter((l) => l.startsWith('|'))) {
      if (/setting|-{3,}/i.test(row)) continue;
      expect(row).toMatch(STATUS);
    }
  });
  it('gitlab-ci-verification.md records the 8 contract-fact rows (4 facts × 2 lines)', () => {
    const f = 'docs/release/decisions/gitlab-ci-verification.md';
    const text = readFileSync(f, 'utf8');
    const rows = text.split('\n').filter((l) => /^\|\s*\d+\s*\|/.test(l));
    expect(rows.length).toBe(8);
    for (const row of rows) {
      expect(row).toMatch(STATUS);
    }
    // both lines present; multi-ref push recorded FAILED until REQ-FIN-20
    expect(text).toContain('release/4.x');
    expect(text).toMatch(/multi-ref push creates a pipeline[\s\S]*?failed/i);
    expect(text).toMatch(/SIGSTORE_ID_TOKEN/);
  });
  it('npm decision records exist with status rows', () => {
    for (const f of ['docs/release/decisions/npm-trusted-publishing.md', 'docs/release/decisions/npm-scope.md']) {
      const text = readFileSync(f, 'utf8');
      expect(text.match(STATUS)).not.toBeNull();
    }
  });
});
