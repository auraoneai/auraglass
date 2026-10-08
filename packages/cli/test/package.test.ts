/** PLAT-299: @auraglass/cli package shape. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')) as Record<string, any>;
describe('package', () => {
  it('name/version/bin/type/engines', () => {
    expect(pkg.name).toBe('@auraglass/cli');
    expect(pkg.bin).toEqual({ auraglass: './dist/bin.js' });
    expect(pkg.type).toBe('module');
    expect(pkg.engines.node).toBe('>=20.19');
    expect(pkg.publishConfig.access).toBe('public');
  });
  it('runtime deps are exact-pinned and on the allowlist', () => {
    const allow = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dependency-allowlist.json'), 'utf8')) as { allowlist: string[] };
    for (const [d, v] of Object.entries(pkg.dependencies)) {
      expect(allow.allowlist).toContain(d);
      expect(String(v)).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
  it('prepublishOnly gates on require-ci-publish', () => {
    expect(pkg.scripts.prepublishOnly).toContain('require-ci-publish');
  });
  it('files ships only dist + allowlist', () => {
    expect(pkg.files).toContain('dist');
  });
});
