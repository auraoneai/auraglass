/* @jest-environment node */
/* PLAT-269/270: deps exactly the allowlisted pins; no dep is also a peer. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../build/helpers';

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const allow = JSON.parse(readFileSync(join(ROOT, 'docs', 'dependency-allowlist.json'), 'utf8'));
const rows = allow.packages ?? allow;

describe('dependency allowlist (PLAT-269/270)', () => {
  it('package.json dependencies exactly match allowlist dependency rows', () => {
    const want = Object.fromEntries(Object.entries(rows).filter(([, v]: any) => v.kind === 'dependency').map(([k, v]: any) => [k, v.version]));
    expect({ ...pkg.dependencies }.constructor === Object ? pkg.dependencies : {}).toEqual(want);
  });

  it('no package is both a dependency and a peer', () => {
    const peers = Object.keys(pkg.peerDependencies ?? {});
    const both = Object.keys(pkg.dependencies ?? {}).filter(d => peers.includes(d));
    expect(both).toEqual([]);
  });
});
