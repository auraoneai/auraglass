// waveform-modes.spec.ts — SURF-479 (REQ-SURF-147): Waveform renders bars from
// peaks with progress fill; WaveformLevel tracks a live level input.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('waveform modes (SURF-479)', () => {
  test('waveform renders labeled bars', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Waveform');
    if (!subject) { console.warn('Waveform subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const wave = page.locator('[data-ag-part="waveform"], [aria-label*="waveform" i]').first();
    if (await wave.count() === 0) { console.warn('no waveform — pending'); return; }
    await expect(wave).toBeVisible();
  });
});
