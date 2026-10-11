// composer-grow.spec.ts — REQ-SURF-119 (SURF-354/318): textarea growth cap,
// the <480 px actions collapse (Submit stays), the composer block size on the
// Thread, and the visualViewport keyboard-inset fallback. Remote lane only
// (Chromium/WebKit/Gecko + WebKit iOS emulation). A missing story fails.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openStory(page: Page, id: string) {
  const subjects = await listSubjects();
  const subject = subjects.find((s) => s.id === id);
  expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, subject!.id);
  const textarea = page.getByLabel('Message');
  await expect(textarea).toBeVisible();
  return textarea;
}

async function typeLines(page: Page, lines: string[], heightOf: () => Promise<number>) {
  const out: number[] = [await heightOf()];
  for (const [i, l] of lines.entries()) {
    await page.keyboard.insertText(l);
    if (i < lines.length - 1) await page.keyboard.press('Shift+Enter');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    out.push(await heightOf());
  }
  return out;
}

test.describe('ai composer grow (REQ-SURF-119)', () => {
  test('grows 1 → maxRows (8) lines then scrolls internally', async ({ page }) => {
    // with-actions has no play function, so nothing types concurrently.
    const textarea = await openStory(page, 'ai-composer--with-actions');
    await textarea.focus();
    const heightOf = async () => (await textarea.boundingBox())!.height;
    const lines = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    const heights = await typeLines(page, lines, heightOf);
    // heights[n] is the height with n lines typed (heights[0] = empty).
    expect(heights[4]!).toBeGreaterThan(heights[1]! + 1);
    expect(heights[8]!).toBeGreaterThan(heights[4]! + 1);
    // capped at 8 lines: lines 9 and 10 do not grow it, the content scrolls.
    expect(Math.abs(heights[10]! - heights[8]!)).toBeLessThanOrEqual(1);
    const overflow = await textarea.evaluate((el) => el.scrollHeight > el.clientHeight);
    expect(overflow).toBe(true);
  });

  test('at 390 px: secondary actions collapse into the menu; Submit stays visible and clickable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const textarea = await openStory(page, 'ai-composer--with-actions');
    const composer = page.locator('[data-ag-part="composer"]');
    await expect(composer.locator('[data-ag-part="action"]')).toHaveCount(2);
    for (const action of await composer.locator('[data-ag-part="action"]').all()) await expect(action).toBeHidden();
    const submit = page.getByRole('button', { name: 'Send message' });
    await expect(submit).toBeVisible();
    await textarea.fill('narrow send');
    await submit.click();
    await expect(page.getByTestId('sent')).toHaveText('narrow send');
    await expect(textarea).toHaveValue('');
    await expect(textarea).toBeFocused();

    const more = page.getByRole('button', { name: 'More actions' });
    await expect(more).toBeVisible();
    await more.click();
    await page.getByRole('menuitem', { name: 'Insert template' }).click();
    await expect(page.getByTestId('inserted')).toHaveText('1');
  });

  test('at 390 px the textarea caps at 5 lines', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const textarea = await openStory(page, 'ai-composer--with-actions');
    await textarea.focus();
    const heightOf = async () => (await textarea.boundingBox())!.height;
    const heights = await typeLines(page, ['1', '2', '3', '4', '5', '6', '7'], heightOf);
    expect(heights[5]!).toBeGreaterThan(heights[1]! + 1);
    expect(Math.abs(heights[7]! - heights[5]!)).toBeLessThanOrEqual(1);
  });

  test('at 1024 px the actions are inline and the menu is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openStory(page, 'ai-composer--with-actions');
    await expect(page.getByRole('button', { name: 'Attach file' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Insert template' })).toBeVisible();
    await expect(page.locator('[data-ag-part="composer-menu"]')).toBeHidden();
  });

  test('growth publishes the composer block size on the Thread and never unpins it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    const textarea = await openStory(page, 'ai-composer--with-thread');
    const thread = page.locator('[data-ag-part="thread"]');
    const log = page.locator('[role="log"]');
    const read = () => page.evaluate(() => {
      const t = document.querySelector<HTMLElement>('[data-ag-part="thread"]')!;
      const c = document.querySelector<HTMLElement>('[data-ag-part="composer"]')!;
      const l = document.querySelector<HTMLElement>('[role="log"]')!;
      return {
        block: t.style.getPropertyValue('--_ag-ai-composer-block'),
        composer: Math.round(c.getBoundingClientRect().height),
        distance: l.scrollHeight - l.scrollTop - l.clientHeight,
      };
    });
    await expect(thread).toHaveCount(1);
    await log.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await expect.poll(async () => (await read()).distance).toBeLessThanOrEqual(1);
    const before = await read();
    expect(before.block).toBe(`${before.composer}px`);
    await textarea.focus();
    await typeLines(page, ['a', 'b', 'c', 'd'], async () => 0);
    await expect.poll(async () => { const r = await read(); return r.block === `${r.composer}px` ? r.composer : -1; })
      .toBeGreaterThan(before.composer);
    await expect.poll(async () => (await read()).distance).toBeLessThanOrEqual(1);
  });

  test('keyboard inset: one visualViewport listener writes --_ag-ai-keyboard-inset', async ({ page }) => {
    // Emulate a browser without the VirtualKeyboard API and with a
    // controllable visual viewport (the software keyboard shrinks it).
    await page.addInitScript(() => {
      delete (Navigator.prototype as unknown as { virtualKeyboard?: unknown }).virtualKeyboard;
      const vv = new EventTarget() as EventTarget & { height: number; offsetTop: number; width: number; scale: number };
      vv.height = window.innerHeight;
      vv.offsetTop = 0;
      vv.width = window.innerWidth;
      vv.scale = 1;
      let listeners = 0;
      const add = vv.addEventListener.bind(vv);
      vv.addEventListener = ((type: string, ...rest: unknown[]) => {
        if (type === 'resize') listeners += 1;
        return (add as (...a: unknown[]) => void)(type, ...rest);
      }) as typeof vv.addEventListener;
      Object.defineProperty(window, 'visualViewport', { configurable: true, get: () => vv });
      (window as unknown as { __agVV: unknown }).__agVV = {
        open(px: number) { vv.height = window.innerHeight - px; vv.dispatchEvent(new Event('resize')); },
        listeners: () => listeners,
      };
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await openStory(page, 'ai-composer--with-actions');
    const composer = page.locator('[data-ag-part="composer"]');
    const listeners = await page.evaluate(() => (window as unknown as { __agVV: { listeners(): number } }).__agVV.listeners());
    expect(listeners).toBe(1);
    await page.evaluate(() => (window as unknown as { __agVV: { open(px: number): void } }).__agVV.open(300));
    await expect(composer).toHaveCSS('padding-block-end', '300px');
    const submit = page.getByRole('button', { name: 'Send message' });
    await expect(submit).toBeVisible();
  });
});
