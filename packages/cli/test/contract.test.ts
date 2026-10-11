/** PLAT-300: dependency-allowlist.json drives package.json deps (CP-PLAT-1). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.join(__dirname, '..');
const allow = JSON.parse(fs.readFileSync(path.join(dir, 'dependency-allowlist.json'), 'utf8')) as { allowlist: string[] };
const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
describe('dependency allowlist', () => {
  it('every allowlist dep is pinned in package.json', () => {
    for (const d of allow.allowlist) expect(pkg.dependencies[d]).toMatch(/^\d+\.\d+\.\d+$/);
  });
  it('no extra runtime deps', () => {
    for (const d of Object.keys(pkg.dependencies)) expect(allow.allowlist).toContain(d);
  });
});
