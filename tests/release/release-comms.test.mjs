import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { bannerOf, checkComms, versionsSection } from '../../scripts/release/verify-release-comms.mjs';

const readme = readFileSync('README.md', 'utf8');
const llms = readFileSync('llms.txt', 'utf8');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

describe('release comms (PLAT-209/210)', () => {
  it('finds the README banner block', () => {
    expect(bannerOf(readme)).toMatch(/v5\.0\.0/);
  });
  it('finds the llms.txt Versions section', () => {
    expect(versionsSection(llms)).toMatch(/5\.x/);
  });
  it('live files pass with the repo package version', () => {
    const r = checkComms({ readme, llms, pkgVersion: pkg.version });
    expect(r.errors).toEqual([]);
  });
  it('fails when the banner marker is absent', () => {
    expect(checkComms({ readme: '# x', llms, pkgVersion: '5.0.0' }).errors.join())
      .toMatch(/AG-RELEASE-BANNER/);
  });
  it('fails when Versions omits the current major', () => {
    const r = checkComms({ readme, llms: '## Versions\n- `4.x` only', pkgVersion: '5.0.0' });
    expect(r.errors.join()).toMatch(/Versions/);
  });
  it('flags a next dist-tag on the wrong major', () => {
    const r = checkComms({ readme, llms, pkgVersion: '5.0.0-alpha.1',
      distTags: { latest: '4.1.1', next: '4.9.9' } });
    expect(r.errors.join()).toMatch(/next dist-tag/);
  });
});
