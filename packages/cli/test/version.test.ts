/** PLAT-301: MOVED_NOTICE + --version path. */
import { describe, expect, it } from '@jest/globals';
import { MOVED_NOTICE, PACKAGE_NAME, PACKAGE_VERSION } from '../src/meta.js';
describe('meta', () => {
  it('MOVED_NOTICE mentions both names', () => {
    expect(MOVED_NOTICE).toContain('@auraglass/cli');
    expect(MOVED_NOTICE).toMatch(/aura-glass/);
  });
  it('package name + version present', () => {
    expect(PACKAGE_NAME).toBe('@auraglass/cli');
    expect(PACKAGE_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
