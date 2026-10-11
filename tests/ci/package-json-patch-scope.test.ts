/* REQ-PLAT-55: the 4.1.1 cut is patch-scope clean — dependencies,
   peerDependencies, and exports are byte-identical to the 4.1.0 tag's
   package.json (git show 15b6de6f7:package.json). Only `version` may differ. */
import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { v410PackageJson } from '../release/lib/v410-package';

const ROOT = join(__dirname, '..', '..');

const current = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
// git show 15b6de6f7:package.json — the helper fetches the v4.1.0 tag when the
// CI clone is shallow and asserts it still points at that commit.
const base = v410PackageJson();

describe('package-json-patch-scope (REQ-PLAT-55)', () => {
  it('base ref is the 4.1.0 tag', () => {
    expect(base.version).toBe('4.1.0');
  });
  it('dependencies deep-equal the 4.1.0 set', () => {
    expect(current.dependencies).toEqual(base.dependencies);
  });
  it('peerDependencies deep-equal the 4.1.0 set', () => {
    expect(current.peerDependencies).toEqual(base.peerDependencies);
  });
  it('exports deep-equal the 4.1.0 map', () => {
    expect(current.exports).toEqual(base.exports);
  });
});
