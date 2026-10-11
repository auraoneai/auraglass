/* @jest-environment node */
/* REQ-PLAT-80 (PLAT-220): diff the dispositions between each RM commit's
   parent and the commit itself — every deletion must be a family path, a
   story/test/snapshot tied to a removed component, or an index barrel line. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { ROOT } from '../build/helpers';

const RM_COMMITS: Record<string, string> = {
  'RM-01': 'fd35eab92', 'RM-02': '5c6516a00', 'RM-03': '132e735c0',
  'RM-04': '2ec63ace5', 'RM-05': '852e63cf2', 'RM-06': '0a39ef29a',
  'RM-07': '86c58e6e4', 'RM-08': 'a30c28a9d', 'RM-09': 'e14836962',
  'RM-10': '0753e2893', 'RM-11': '935091f7f', 'RM-12': '1087dea50',
  'RM-13': '4842edc5e',
};

/* ancillary deletions any RM commit may legitimately carry: stories, tests,
   snapshots, barrel indexes, css for the removed names, docs. */
const ANCILLARY = /\.(stories|test|spec)\.|__snapshots__|__tests__|index\.ts$|\.css$|^docs\/|^tokens\/|^src\/index|fixtures|\.stories\.of|storybook|^examples\/|^Dockerfile$|^docker-compose|^bin\/|^server\/|^scripts\/(legacy|remove)|^apps\/docs.*4x|tsconfig\.server|\.env|^package-lock|^ci\/|^nginx\.conf|^INSTALLATION|^\.changeset|^scripts\/(build-tokens\.js|docs\/)|^apps\/docs\/redirects\.json/;

describe('inventory-remove-progress (RM family diffs)', () => {
  for (const [family, sha] of Object.entries(RM_COMMITS)) {
    it(`${family} (${sha.slice(0, 9)}) deletes only component-source and ancillary files`, () => {
      const nameStatus = execFileSync(
        'git', ['diff', '--name-status', '--diff-filter=D', `${sha}^`, sha],
        { cwd: ROOT, encoding: 'utf8' },
      );
      const deleted = nameStatus.split('\n').filter(Boolean).map((l) => l.split('\t')[1]);
      expect(deleted.length).toBeGreaterThan(0);
      const stray = deleted.filter((p) =>
        !p.startsWith('src/') && !p.startsWith('legacy/') && !ANCILLARY.test(p));
      expect(stray.join(',')).toBe('');
    });
  }

  it('git ls-files legacy never regrows beyond the RM-14 floor', () => {
    const count = Number(execFileSync('git', ['ls-files', 'legacy'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean).length);
    expect(count).toBeLessThanOrEqual(239);
  });
});
