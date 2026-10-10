/* @jest-environment node */
// REQ-PLAT-12 / REQ-PLAT-15: the publishing docs record the OIDC toolchain per
// package, and no file outside the enforcers and the planning archive names the
// npm token variables.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const contract = JSON.parse(readFileSync('contracts/packages.json', 'utf8'));
const PUBLISHED = Object.entries(contract.packages as Record<string, any>)
  .filter(([, p]) => p.published === true)
  .map(([name]) => name);

describe('publishing docs', () => {
  it('npm-trusted-publishing.md records the OIDC decision and points at the per-package table', () => {
    const t = readFileSync('docs/release/decisions/npm-trusted-publishing.md', 'utf8');
    expect(t).toMatch(/trusted publish|OIDC|id_tokens/i);
    expect(t).toMatch(/npmjs\.com|npm\.configure/i);
    expect(t).toContain('chahal-foundation-group/github-auraoneai');
    expect(t).toContain('docs/release/trusted-publishers.md');
  });

  it('npm-scope.md records the package scope decision incl. fallbacks', () => {
    const t = readFileSync('docs/release/decisions/npm-scope.md', 'utf8');
    expect(t).toContain('aura-glass');
    expect(t).toContain('@auraglass/');
    for (const fb of ['aura-glass-cli', 'aura-glass-registry', 'aura-glass-mcp']) {
      expect(t).toContain(fb);
    }
  });

  it('trusted-publishers.md has one row per published package with the six publisher fields', () => {
    const t = readFileSync('docs/release/trusted-publishers.md', 'utf8');
    const rows = t
      .split('\n')
      .filter((l) => /^\| `[^`]+` \|/.test(l))
      .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
    expect(rows.map((r) => r[0].replace(/`/g, '')).sort()).toEqual([...PUBLISHED].sort());
    expect(PUBLISHED).toHaveLength(5);
    for (const [pkg, provider, namespace, project, file, environment, status, date] of rows) {
      expect({ pkg, provider, namespace, project, file, environment }).toEqual({
        pkg,
        provider: 'GitLab CI/CD',
        namespace: '`chahal-foundation-group/github-auraoneai`',
        project: '`auraglass`',
        file: '`.gitlab-ci.yml`',
        environment: '`npm-publish`',
      });
      // owner-filled: `missing` until configured; `configured` must carry a date
      expect(['missing', 'configured']).toContain(status);
      if (status === 'configured') expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      else expect(date).toBe('—');
    }
    expect(t).toMatch(/## First publish of a name that does not exist on npm yet/);
  });

  it('every PLAT-published workspace package has a PUBLISHING.md with the publisher fields', () => {
    for (const [name, p] of Object.entries(contract.packages as Record<string, any>)) {
      if (p.published !== true || p.owner !== 'PLAT' || p.dir === '.') continue;
      const f = join(p.dir, 'PUBLISHING.md');
      expect({ name, exists: existsSync(f) }).toEqual({ name, exists: true });
      const t = readFileSync(f, 'utf8');
      for (const field of ['chahal-foundation-group/github-auraoneai', '`auraglass`', '`.gitlab-ci.yml`', '`npm-publish`', 'docs/release/trusted-publishers.md']) {
        expect({ name, field, present: t.includes(field) }).toEqual({ name, field, present: true });
      }
    }
  });

  it('no NPM_TOKEN / NODE_AUTH_TOKEN outside the enforcers and the planning archive', () => {
    const r = (() => {
      try {
        return execFileSync(
          'git',
          [
            'grep', '-lF', '-e', 'NPM_TOKEN', '-e', 'NODE_AUTH_TOKEN', '--',
            ':!docs/auraglass-5/**',
            ':!legacy/**',
            ':!scripts/ci/forbidden-check.js',
            ':!scripts/ci/verify-ci-fragments.mjs',
            ':!tests/ci/fixtures/ci-fragments/**',
            ':!tests/release/publishing-docs.test.ts',
          ],
          { encoding: 'utf8' },
        );
      } catch (e: any) {
        if (e.status === 1) return ''; // git grep: no match
        throw e;
      }
    })();
    expect(r.trim()).toBe('');
  });

  it('the token grep is not vacuous: it finds the enforcer that names the variable', () => {
    const out = execFileSync('git', ['grep', '-lF', '-e', 'NPM_TOKEN', '--', 'scripts/ci/verify-ci-fragments.mjs'], {
      encoding: 'utf8',
    });
    expect(out.trim()).toBe('scripts/ci/verify-ci-fragments.mjs');
  });
});
