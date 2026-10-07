/** @jest-environment node */
// tests/lint/surf/locale-guard.test.ts — SURF-138: toLocaleDateString /
// toLocaleString / toLocaleTimeString are banned over every SURF-owned path
// ("Use Intl.* with an explicit locale (and timeZone)"). Enforced as a source
// scan here; the eslint.config.js no-restricted-properties form is contract-
// owned — see W2 lane report open item.

import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const BANNED = /\.toLocale(String|DateString|TimeString)\s*\(/;
const GLOBS = [
  'src/app-shell',
  'src/data',
  'src/date',
  'src/charts',
  'src/components',
  'src/compat/surf',
];

describe('SURF-138 locale guard', () => {
  it('no toLocale* calls over SURF paths', () => {
    const out = execSync(
      `grep -rEn "\\.toLocale(String|DateString|TimeString)\\s*\\(" ${GLOBS.join(' ')} || true`,
      { encoding: 'utf8', cwd: join(__dirname, '../../..') },
    );
    expect(out.trim()).toBe('');
    void BANNED; // pattern kept for reviewers; grep above is the check
  });
});
