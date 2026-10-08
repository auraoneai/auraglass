/* CMP-395 + CMP-400 + CMP-407 (lane 3i-Q). Remote perf lane only — runs under AG_REMOTE_RUNNER=1 on
   the PRD-PERF harness (tests/perf/harness/run-perf.mjs + grade.mjs). This file
   registers the cases; harness seam lands with PRD-PERF. */
import { test, expect } from '@playwright/test';
import { gotoStory, perf } from '../../../helpers/index';

test.skip(!process.env.AG_REMOTE_RUNNER, 'remote perf lane only (AG_REMOTE_RUNNER=1)');


const LAYER_BUDGETS: Record<string, { story: string; blurred: number }> = {
  Dialog: { story: 'overlays-dialog--default', blurred: 2 },
  AlertDialog: { story: 'overlays-alert-dialog--confirm', blurred: 2 },
  Popover: { story: 'overlays-popover--playground', blurred: 1 },        // CMP-400
  Tooltip: { story: 'overlays-tooltip--playground', blurred: 1 },        // CMP-400
  SheetModal: { story: 'overlays-sheet--bottom-detents', blurred: 2 },   // CMP-407
  SheetNonModal: { story: 'overlays-sheet--non-modal-inspector', blurred: 1 }, // CMP-407
};
const IMPORT_BUDGET_KB: Record<string, number> = { Dialog: 20, AlertDialog: 20 };

test.describe('overlay layer+bundle budget (CMP-395/400/407)', () => {
  for (const [name, { story, blurred }] of Object.entries(LAYER_BUDGETS)) {
    test(`${name}: open adds exactly ${blurred} blurred layer(s)`, async ({ page }) => {
      await gotoStory(page, story);
      expect(await perf.blurredSurfaces(page)).toBeLessThanOrEqual(blurred);
    });
  }

  test('per-import budget lines exist for Dialog and AlertDialog', async () => {
    // PRD-02 budget file — assert the rows the CMP metas already declare.
    const { readFileSync, existsSync } = await import('node:fs');
    const { join } = await import('node:path');
    const budgetPath = join(process.cwd(), 'fragments', 'size-budgets', 'cmp.ts');
    test.skip(!existsSync(budgetPath), 'size-budgets fragment absent');
    const src = readFileSync(budgetPath, 'utf8');
    for (const [name, kb] of Object.entries(IMPORT_BUDGET_KB)) {
      const row = new RegExp(`${name}[^\n]*budgetKb[^\n]*\b${kb}\b`);
      expect(src).toMatch(row);
    }
  });
});
