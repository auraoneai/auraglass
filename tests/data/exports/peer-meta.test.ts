/** @jest-environment node */
// tests/data/exports/peer-meta.test.ts — SURF-143: the optional-peer metadata
// the W2 entries rely on stays declared on package.json (react-aria-components
// and @internationalized/date optional; d3-scale/d3-shape optional once the
// ./charts contract PR lands — see contract/charts-peers).

import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PKG = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const ALLOWLIST = JSON.parse(readFileSync(join(process.cwd(), 'docs/dependency-allowlist.json'), 'utf8'));

describe('peer metadata (SURF-143)', () => {
  it('react-aria-components and @internationalized/date are optional peers', () => {
    const meta = PKG.peerDependenciesMeta ?? {};
    expect(meta['react-aria-components']?.optional).toBe(true);
    expect(meta['@internationalized/date']?.optional).toBe(true);
    expect(PKG.peerDependencies['react-aria-components']).toMatch(/^\^1\./);
    expect(PKG.peerDependencies['@internationalized/date']).toMatch(/^\^3\./);
  });
  it('allowlist scopes RAC/@internationalized to the date lane', () => {
    const pkgs = ALLOWLIST.packages;
    expect(pkgs['react-aria-components'].optional).toBe(true);
    expect(pkgs['react-aria-components'].importers).toContain('src/date/**');
    expect(pkgs['@internationalized/date'].optional).toBe(true);
    expect(pkgs['@internationalized/date'].importers).toContain('src/date/**');
  });
  it('d3 optional peers land with the ./charts contract PR (SURF-275)', () => {
    const meta = PKG.peerDependenciesMeta ?? {};
    if (meta['d3-scale'] === undefined) {
      console.warn('PENDING SURF-143: d3 peers arrive via contract/charts-peers (PR #38)');
      return;
    }
    expect(meta['d3-scale'].optional).toBe(true);
    expect(meta['d3-shape'].optional).toBe(true);
    expect(ALLOWLIST.packages['d3-scale'].importers).toContain('src/charts/**');
    expect(ALLOWLIST.packages['d3-shape'].importers).toContain('src/charts/**');
  });
});
