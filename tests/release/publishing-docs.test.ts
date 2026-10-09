/* @jest-environment node */
// PLAT-046: the docs record the OIDC publishing toolchain end to end.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';

describe('publishing docs', () => {
  it('npm-trusted-publishing.md records the OIDC decision and commands', () => {
    const t = readFileSync('docs/release/decisions/npm-trusted-publishing.md', 'utf8');
    expect(t).toMatch(/trusted publish|OIDC|id_tokens/i);
    expect(t).toMatch(/npmjs\.com|npm\.configure/i);
  });
  it('npm-scope.md records the package scope decision incl. fallbacks', () => {
    const t = readFileSync('docs/release/decisions/npm-scope.md', 'utf8');
    expect(t).toContain('aura-glass');
    expect(t).toContain('@auraglass/');
    for (const fb of ['aura-glass-cli', 'aura-glass-registry', 'aura-glass-mcp']) {
      expect(t).toContain(fb);
    }
  });
  it('no NPM_TOKEN / NODE_AUTH_TOKEN outside enforcers/docs/reports', () => {
    const { execFileSync } = require('node:child_process');
    let out = '';
    try {
      out = execFileSync(
        'git',
        ['grep', '-lF', '-e', 'NPM_TOKEN', '-e', 'NODE_AUTH_TOKEN', '--',
          ':!docs', ':!legacy', ':!tests', ':!reports', ':!scripts/ci'],
        { encoding: 'utf8' },
      ) as string;
    } catch {
      out = ''; // git grep exits 1 when there are no matches
    }
    expect(out.trim()).toBe('');
  });
});
