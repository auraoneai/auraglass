/* @jest-environment node */
/* REQ-PLAT-80 (PLAT-221): each RM removal commit deletes exactly the records
   its consumer-grep record lists (by legacy/ path, diffed between the commit's
   parent and the commit) and no other row's source — so no other row changes
   destination. Runs over every docs/release/decisions/removals/RM-<nn>.json
   that names its merge `sha`; a synthetic repo proves both failure modes. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dispositionsRows } from '../../scripts/removal/consumer-grep.mjs';
import { familyProgress, loadRecords, removeProgress } from '../../scripts/removal/remove-progress.mjs';
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
      const deleted = nameStatus.split('\n').filter(Boolean).map((l) => l.split('\t')[1] ?? '');
      expect(deleted.length).toBeGreaterThan(0);
      const stray = deleted.filter((p) =>
        !p.startsWith('src/') && !p.startsWith('legacy/') && !ANCILLARY.test(p));
      expect(stray.join(',')).toBe('');
    });
  }


  const records = loadRecords(ROOT);

  it('records exist for RM-01..RM-12 and each merged family names its commit', () => {
    const fams = records.map((r) => r.family);
    for (let n = 1; n <= 12; n++) expect(fams).toContain(`RM-${String(n).padStart(2, '0')}`);
    for (const r of records.filter((x) => x.sha)) expect(r.sha).toMatch(/^[0-9a-f]{7,40}$/);
  });

  const results = removeProgress(ROOT);
  it('at least one merged family is checked', () => {
    expect(results.length).toBeGreaterThan(0);
  });
  for (const r of results) {
    it(`${r.family} (${r.sha}) deletes exactly its listed records and no other row`, () => {
      expect({ family: r.family, unlisted: r.unlisted, notDeleted: r.notDeleted })
        .toEqual({ family: r.family, unlisted: [], notDeleted: [] });
    });
  }

  it('reports a deleted-but-unlisted row and a listed-but-kept row (synthetic repo)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'rmprog-'));
    const g = (...a: string[]) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' });
    try {
      g('init', '-q');
      g('config', 'user.email', 't@example.invalid');
      g('config', 'user.name', 't');
      for (const f of ['A', 'B', 'C']) {
        mkdirSync(join(dir, 'legacy/src/components/x'), { recursive: true });
        writeFileSync(join(dir, `legacy/src/components/x/${f}.tsx`), `export const ${f} = 1;\n`);
      }
      g('add', '-A');
      g('commit', '-qm', 'base');
      g('rm', '-q', 'legacy/src/components/x/A.tsx', 'legacy/src/components/x/B.tsx');
      g('commit', '-qm', 'RM-99');
      const sha = g('rev-parse', 'HEAD').trim();
      const head = '| # | Name | File | 4.x disposition | Public | 5.0 destination | 5.0 target | Owner | Codemod | Owning PRD | Reconciliation note |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
      const row = (i: number, n: string, dest: string) => `| ${i} | ${n} | \`src/components/x/${n}.tsx\` | REMOVE | yes | ${dest} | - | PLAT | removed | PRD-16 |  |`;
      const rows = dispositionsRows(head + [row(0, 'A', 'removed'), row(1, 'B', 'compat'), row(2, 'C', 'removed')].join('\n'));
      const res = familyProgress(dir, rows, { family: 'RM-99', sha, names: ['A', 'C'] });
      expect(res.deleted).toEqual(['A', 'B']);
      expect(res.unlisted).toEqual(['B']);
      expect(res.notDeleted).toEqual(['C']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  // Counts the committed tree (HEAD), not the index: revert-dry-run.mjs runs
  // this suite with an RM revert staged but uncommitted, which restores legacy
  // files by design. Any commit that regrows legacy/ still fails here.
  it('git ls-files legacy never regrows beyond the RM-14 floor', () => {
    const count = Number(execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', '--', 'legacy'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean).length);
    expect(count).toBeLessThanOrEqual(239);
  });

  it('the committed dispositions are the input (rows parse with owner/codemod columns)', () => {
    const rows = dispositionsRows(readFileSync(join(ROOT, 'docs/inventory/component-dispositions.md'), 'utf8'));
    expect(rows).toHaveLength(500);
    expect(rows.every((r: { owner?: string; codemod?: string }) => r.owner && r.codemod)).toBe(true);
  });
});
