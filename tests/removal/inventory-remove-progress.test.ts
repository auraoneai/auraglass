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

describe('inventory-remove-progress (RM family diffs)', () => {
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

  it('the committed dispositions are the input (rows parse with owner/codemod columns)', () => {
    const rows = dispositionsRows(readFileSync(join(ROOT, 'docs/inventory/component-dispositions.md'), 'utf8'));
    expect(rows).toHaveLength(500);
    expect(rows.every((r: { owner?: string; codemod?: string }) => r.owner && r.codemod)).toBe(true);
  });
});
