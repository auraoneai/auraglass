/* REQ-QUAL-20 (FIN-439) — self-test of tests/a11y/apg/harness.ts on a fixture page (no Storybook needed).
   Every step type is shown to pass on a correct script and to fail, with `step <n>: expected …, actual …`, on a wrong
   one; axe is shown to run the full ruleset (colorContrast:true still reports image-alt), to report color-contrast
   only when asked, and to block by impact (serious/critical by default, moderate opt-in). Runs in the qual:a11y-browser
   projects of certification/playwright.cert.config.ts (chromium, webkit, firefox); GitLab CI / remote runner only. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect, type Page } from '@playwright/test';
import { apg, axeScan, createApgHarness, FLAGSHIP_BLOCKING_IMPACTS, ApgStepError } from '../../apg/harness';

const FIXTURE = readFileSync(fileURLToPath(new URL('./fixture.html', import.meta.url)), 'utf8');
const STEP_RE = /^step \d+: expected .* actual/;
const fast = createApgHarness({ timeoutMs: 750 });

async function load(page: Page, extra = ''): Promise<void> {
  await page.setContent(extra ? FIXTURE.replace('</body>', `${extra}</body>`) : FIXTURE);
}

async function failure(run: () => Promise<void>): Promise<Error> {
  try { await run(); } catch (e) { return e as Error; }
  throw new Error('expected the harness to throw, it resolved');
}

test.describe('ApgHarness.keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await load(page);
    await page.focus('[data-ag-part="first"]');
  });

  test('expectFocus by data-ag-part passes', async ({ page }) => {
    await fast.keyboard(page, [{ press: 'ArrowRight', expectFocus: 'trigger' }, { press: 'ArrowRight', expectFocus: 'thumb' }]);
  });

  test('expectFocus by data-ag-part fails with step index and actual focus', async ({ page }) => {
    const e = await failure(() => fast.keyboard(page, [{ press: 'ArrowRight', expectFocus: 'trigger' }, { press: 'ArrowLeft', expectFocus: 'thumb' }]));
    expect(e).toBeInstanceOf(ApgStepError);
    expect(e.message).toMatch(STEP_RE);
    expect(e.message).toMatch(/^step 2: expected focus on part "thumb", actual <button> part=first role=button name="First"$/);
  });

  test('expectFocus by role and accessible name passes', async ({ page }) => {
    await fast.keyboard(page, [{ press: 'ArrowRight', expectFocus: 'role=button[name=Details]' }, { press: 'ArrowRight', expectFocus: 'role=slider[name=Volume]' }]);
  });

  test('expectFocus by role fails naming the actual role', async ({ page }) => {
    const e = await failure(() => fast.keyboard(page, [{ press: 'ArrowRight', expectFocus: 'role=slider' }]));
    expect(e.message).toMatch(STEP_RE);
    expect(e.message).toContain('step 1: expected focus on role=slider, actual <button> part=trigger role=button name="Details"');
  });

  test('expectState passes on the focused element', async ({ page }) => {
    await fast.keyboard(page, [
      { press: 'ArrowRight', expectFocus: 'trigger', expectState: { 'aria-expanded': 'false' } },
      { press: 'Enter', expectState: { 'aria-expanded': 'true' } },
      { press: 'ArrowRight', expectFocus: 'thumb' },
      { press: 'ArrowRight', expectState: { 'aria-valuenow': '6' } },
    ]);
  });

  test('expectState fails with the actual attribute value', async ({ page }) => {
    const e = await failure(() => fast.keyboard(page, [{ press: 'ArrowRight' }, { expectState: { 'aria-expanded': 'true' } }]));
    expect(e.message).toMatch(STEP_RE);
    expect(e.message).toContain('step 2: expected aria-expanded="true" on the focused element, actual aria-expanded="false" on <button> part=trigger');
  });

  test('expectAnnounced passes against the announcer region', async ({ page }) => {
    await fast.keyboard(page, [{ press: 'ArrowRight' }, { press: 'Enter', expectAnnounced: 'Details expanded' }, { press: 'Enter', expectAnnounced: 'collapsed' }]);
  });

  test('expectAnnounced fails with the actual announcer text', async ({ page }) => {
    const e = await failure(() => fast.keyboard(page, [{ press: 'ArrowRight' }, { press: 'Enter', expectAnnounced: 'Details collapsed' }]));
    expect(e.message).toMatch(STEP_RE);
    expect(e.message).toContain('step 2: expected announcement containing "Details collapsed", actual announcer text ["Details expanded"]');
  });

  test('type passes and is observable through expectState', async ({ page }) => {
    await page.focus('[data-ag-part="input"]');
    await fast.keyboard(page, [{ type: 'Ada', expectFocus: 'role=textbox[name=Name]', expectState: { 'data-value': 'Ada' } }]);
  });

  test('type fails with the actual value', async ({ page }) => {
    await page.focus('[data-ag-part="input"]');
    const e = await failure(() => fast.keyboard(page, [{ type: 'Ada', expectState: { 'data-value': 'Grace' } }]));
    expect(e.message).toMatch(STEP_RE);
    expect(e.message).toContain('step 1: expected data-value="Grace" on the focused element, actual data-value="Ada"');
  });

  test('press of an unknown key fails as a step', async ({ page }) => {
    const e = await failure(() => fast.keyboard(page, [{ press: 'NotAKey' }]));
    expect(e.message).toMatch(/^step 1: expected press "NotAKey" to dispatch, actual /);
  });

  test('focus lost to <body> is reported as such', async ({ page }) => {
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    const e = await failure(() => fast.keyboard(page, [{ expectFocus: 'first' }]));
    expect(e.message).toBe('step 1: expected focus on part "first", actual nothing focused (document.body)');
  });
});

test.describe('ApgHarness.axe', () => {
  test('clean fixture: no violations, full ruleset with and without color-contrast', async ({ page }) => {
    await load(page);
    const on = await axeScan(page, { colorContrast: true });
    const off = await axeScan(page);
    expect(on.violations).toEqual([]);
    expect(off.violations).toEqual([]);
    // the seed ran only color-contrast when colorContrast:true (1 rule); the full ruleset is dozens of rules
    expect(on.rulesRun).toBeGreaterThan(40);
    expect(on.rulesRun).toBe(off.rulesRun + 1);
    await apg.axe(page, { colorContrast: true });
    await apg.axe(page);
  });

  test('colorContrast:true on a missing-alt fixture reports image-alt', async ({ page }) => {
    await load(page, '<footer><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="16" height="16"></footer>');
    const r = await axeScan(page, { colorContrast: true });
    expect(r.violations.map((v) => v.id)).toContain('image-alt');
    const e = await failure(() => apg.axe(page, { colorContrast: true }));
    expect(e.message).toMatch(/^axe: \d+ serious\/critical violation\(s\): .*image-alt \[critical\]/);
  });

  test('color-contrast is reported only with colorContrast:true', async ({ page }) => {
    await load(page, '<footer><p class="low">Low contrast footnote</p></footer>');
    const on = await axeScan(page, { colorContrast: true });
    const off = await axeScan(page);
    expect(on.blocking.map((v) => v.id)).toContain('color-contrast');
    expect(off.violations.map((v) => v.id)).not.toContain('color-contrast');
    await apg.axe(page);
    const e = await failure(() => apg.axe(page, { colorContrast: true }));
    expect(e.message).toContain('color-contrast [serious]');
  });

  test('moderate violations block only when requested (flagships)', async ({ page }) => {
    await load(page, '<div>Content outside every landmark</div>');
    const r = await axeScan(page, { colorContrast: true });
    expect(r.violations.find((v) => v.id === 'region')?.impact).toBe('moderate');
    expect(r.blocking).toEqual([]);
    await apg.axe(page, { colorContrast: true });
    const flagship = await axeScan(page, { colorContrast: true, failOn: FLAGSHIP_BLOCKING_IMPACTS });
    expect(flagship.blocking.map((v) => v.id)).toEqual(['region']);
  });

  test('include scopes the scan; selectors matching nothing are dropped', async ({ page }) => {
    await load(page, '<footer><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="16" height="16"></footer>');
    const scoped = await axeScan(page, { colorContrast: true, include: ['main', '#does-not-exist'] });
    expect(scoped.violations.map((v) => v.id)).not.toContain('image-alt');
    const whole = await axeScan(page, { colorContrast: true, include: ['#does-not-exist'] });
    expect(whole.violations.map((v) => v.id)).toContain('image-alt');
  });
});
