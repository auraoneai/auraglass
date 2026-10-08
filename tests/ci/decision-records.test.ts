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
  it('gitlab-ci-verification.md records the four unverified facts', () => {
    const f = 'docs/release/decisions/gitlab-ci-verification.md';
    const text = readFileSync(f, 'utf8');
    for (const k of ['pipeline', 'protected', 'Pages', 'runner']) {
      expect(text.toLowerCase()).toContain(k.toLowerCase());
    }
    expect(text.match(STATUS)).not.toBeNull();
  });
  it('npm decision records exist with status rows', () => {
    for (const f of ['docs/release/decisions/npm-trusted-publishing.md', 'docs/release/decisions/npm-scope.md']) {
      const text = readFileSync(f, 'utf8');
      expect(text.match(STATUS)).not.toBeNull();
    }
  });
});
