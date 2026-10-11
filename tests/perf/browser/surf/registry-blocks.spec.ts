// tests/perf/browser/surf/registry-blocks.spec.ts — SURF registry-blocks
// slice: REQ-SURF-191 blur budget (REQ-FIN-90, AC-FIN-90) plus the
// REQ-SURF-171..178 render/overflow checks. L10 perf lane, remote only
// (fragments/lanes/surf.ts W5 row for this file).
//
// Blocks are discovered from the repository (every registry/blocks/<id>/
// directory) and matched to the Storybook subject index by the story-id
// prefix Storybook derives from each block's `*.stories.tsx` title — an exact
// prefix, never a fuzzy subject match. A block with no story file, no title or
// no story in the index fails.
//
// Blur budget (QUAL `perf.blurredSurfaces`, S-40):
//   - ai-workspace: ≤6 under a fine pointer, ≤3 under a coarse pointer;
//   - every other block: ≤3 under both.
// The coarse leg uses a hasTouch + isMobile 390×844 context and requires the
// page to report `(pointer: coarse)`. The budgets live only in this file.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { coarseContext, expectPointer, measureBlur } from '../../../e2e/surf/_support/blur-budget';

const AI_WORKSPACE = 'ai-workspace';
const AI_WORKSPACE_MAX_FINE = 6;
const AI_WORKSPACE_MAX_COARSE = 3;
const BLOCK_MAX = 3;
const RENDER_BUDGET_MS = 4000;

const budgetFor = (block: string, pointer: 'fine' | 'coarse'): number =>
  block === AI_WORKSPACE ? (pointer === 'fine' ? AI_WORKSPACE_MAX_FINE : AI_WORKSPACE_MAX_COARSE) : BLOCK_MAX;

/** Storybook's title → story-id prefix (storybook/internal/csf `sanitize`). */
const sanitize = (s: string): string =>
  s.toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

interface BlockStories { block: string; prefixes: string[]; storyIds: string[] }

const BLOCKS_DIR = join(process.cwd(), 'registry', 'blocks');

function blockTitlePrefixes(): Array<{ block: string; prefixes: string[] }> {
  return readdirSync(BLOCKS_DIR)
    .filter((d) => statSync(join(BLOCKS_DIR, d)).isDirectory())
    .sort()
    .map((block) => {
      const dir = join(BLOCKS_DIR, block);
      // The CSF meta title is the first `title:` in the file; later ones are story args (e.g. media-viewer `args.title`).
      const titles = readdirSync(dir)
        .filter((f) => f.endsWith('.stories.tsx'))
        .flatMap((f) => {
          const m = /\btitle:\s*(['"])([^'"]+)\1/.exec(readFileSync(join(dir, f), 'utf8'));
          return m ? [m[2]!] : [];
        });
      return { block, prefixes: [...new Set(titles.map((t) => `${sanitize(t)}--`))] };
    });
}

async function discoverBlocks(): Promise<BlockStories[]> {
  const index = await listSubjects();
  const blocks = blockTitlePrefixes().map(({ block, prefixes }) => ({
    block,
    prefixes,
    storyIds: index
      .filter((s) => prefixes.some((p) => s.id.startsWith(p)) && !s.id.endsWith('--docs'))
      .map((s) => s.id)
      .sort(),
  }));
  expect(blocks.map((b) => b.block), 'registry/blocks has no block directories').not.toEqual([]);
  expect(blocks.map((b) => b.block), `${AI_WORKSPACE} block directory missing`).toContain(AI_WORKSPACE);
  const missing = blocks.filter((b) => b.storyIds.length === 0)
    .map((b) => `${b.block} (${b.prefixes.length ? b.prefixes.join(', ') : 'no *.stories.tsx title'})`);
  expect(missing, 'registry blocks without a story in the subject index — a missing subject fails').toEqual([]);
  return blocks;
}

async function expectBlockBudget(page: Page, block: string, storyId: string, pointer: 'fine' | 'coarse'): Promise<void> {
  await gotoStory(page, storyId);
  await expectPointer(page, pointer);
  const report = await measureBlur(page);
  const max = budgetFor(block, pointer);
  expect(report.count, `${storyId} (${pointer}) ≤${max}: ${report.surfaces.map((s) => s.label).join(', ')}`).toBeLessThanOrEqual(max);
}

test.describe('SURF registry blocks perf', () => {
  test('every registry block renders within the interaction budget without horizontal overflow', async ({ page }) => {
    for (const { storyIds } of await discoverBlocks()) {
      for (const id of storyIds) {
        await test.step(id, async () => {
          await gotoStory(page, id);
          const frameMs = await page.evaluate(async () => {
            const t0 = performance.now();
            await new Promise((r) => requestAnimationFrame(() => r(0)));
            return performance.now() - t0;
          });
          expect(frameMs).toBeLessThan(RENDER_BUDGET_MS);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          expect(overflow).toBeLessThanOrEqual(0);
        });
      }
    }
  });

  test(`blur budget at fine: ${AI_WORKSPACE} ≤${AI_WORKSPACE_MAX_FINE}, every other block ≤${BLOCK_MAX}`, async ({ page }) => {
    for (const { block, storyIds } of await discoverBlocks()) {
      for (const id of storyIds) {
        await test.step(id, () => expectBlockBudget(page, block, id, 'fine'));
      }
    }
  });

  test(`blur budget at coarse: ${AI_WORKSPACE} ≤${AI_WORKSPACE_MAX_COARSE}, every other block ≤${BLOCK_MAX}`, async ({ browser, browserName, baseURL }) => {
    const blocks = await discoverBlocks();
    const context = await coarseContext(browser, browserName, baseURL);
    try {
      const page = await context.newPage();
      for (const { block, storyIds } of blocks) {
        for (const id of storyIds) {
          await test.step(id, () => expectBlockBudget(page, block, id, 'coarse'));
        }
      }
    } finally {
      await context.close();
    }
  });
});
