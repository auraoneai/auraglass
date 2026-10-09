/* REQ-PLAT-55: the 4.1.1 cut is patch-scope clean — dependencies,
   peerDependencies, and exports are byte-identical to the 4.1.0 tag's
   package.json (git show 15b6de6f7:package.json). Only `version` may differ. */
import { describe, it, expect } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const BASE = '15b6de6f7';

const current = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const base = JSON.parse(
  execFileSync('git', ['show', `${BASE}:package.json`], { cwd: ROOT, encoding: 'utf8' }),
);

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
