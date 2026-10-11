// resizable.spec.ts — SURF-43/052: pointer drag resizes neighbours (sum stays 100)
// and a TOUCH drag commits no React work between pointerdown and pointerup.
// Remote lane (3 engines); absent subjects fail the test.
//
// Commit counting: a minimal React DevTools global hook is installed before
// the page loads. React (dev and production builds alike) calls
// hook.onCommitFiberRoot on every commit, so the count is engine- and
// build-independent. The hook proves itself live by counting the mount
// commit and the pointerup commit.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.use({ hasTouch: true });

declare global {
  interface Window {
    __agCommits?: number;
  }
}

async function installCommitCounter(page: Page) {
  await page.addInitScript(() => {
    window.__agCommits = 0;
    let nextId = 0;
    const hook = {
      renderers: new Map<number, unknown>(),
      supportsFiber: true,
      inject(renderer: unknown) {
        nextId += 1;
        hook.renderers.set(nextId, renderer);
        return nextId;
      },
      onCommitFiberRoot() {
        window.__agCommits = (window.__agCommits ?? 0) + 1;
      },
      onCommitFiberUnmount() {},
      onPostCommitFiberRoot() {},
      checkDCE() {},
      isDisabled: false,
    };
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      configurable: true,
      writable: true,
      value: hook,
    });
  });
}

async function openDefault(page: Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'ResizablePanels' && s.id.endsWith('--default'));
  if (!subject) throw new Error('ResizablePanels --default story not registered');
  await gotoStory(page, subject.id);
}

const bases = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.ag-panels > [data-ag-part="resizable-panel"]')].map((p) =>
      parseFloat(p.style.flexBasis),
    ),
  );

/* Touch drag. Chromium drives a real touch sequence over CDP; WebKit and
   Firefox expose no touch-drag API in Playwright, so the same pointer
   sequence (pointerType 'touch') is dispatched to the handle. Both paths
   assert the same outcome. */
async function touchDrag(page: Page, browserName: string, from: { x: number; y: number }, dx: number) {
  if (browserName === 'chromium') {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: from.x + (dx * i) / 8, y: from.y }],
      });
    }
    return {
      end: async () => {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      },
    };
  }
  const handle = page.locator('[data-ag-part="resize-handle"]').first();
  const base = { pointerId: 11, pointerType: 'touch', isPrimary: true, bubbles: true, clientY: from.y };
  await handle.dispatchEvent('pointerdown', { ...base, clientX: from.x, buttons: 1 });
  for (let i = 1; i <= 8; i++) {
    await handle.dispatchEvent('pointermove', { ...base, clientX: from.x + (dx * i) / 8, buttons: 1 });
  }
  return {
    end: async () => {
      await handle.dispatchEvent('pointerup', { ...base, clientX: from.x + dx, buttons: 0 });
    },
  };
}

test.describe('resizable panels (SURF-43/052)', () => {
  test('mouse drag resizes panels, sum stays 100', async ({ page }) => {
    await openDefault(page);
    const handle = page.locator('[data-ag-part="resize-handle"]').first();
    await expect(handle).toHaveCount(1);
    const box = await handle.boundingBox();
    if (!box) throw new Error('no handle box');
    const before = await bases(page);
    expect(before).toEqual([50, 50]);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    const after = await bases(page);
    expect(after).toHaveLength(2);
    expect(after[0]!).toBeGreaterThan(50);
    expect(after[0]! + after[1]!).toBeCloseTo(100, 1);
  });

  test('handle owns touch-action:none (panels do not)', async ({ page }) => {
    await openDefault(page);
    const actions = await page.evaluate(() => ({
      handle: getComputedStyle(document.querySelector('[data-ag-part="resize-handle"]')!).touchAction,
      panel: getComputedStyle(document.querySelector('[data-ag-part="resizable-panel"]')!).touchAction,
    }));
    expect(actions).toEqual({ handle: 'none', panel: 'auto' });
  });

  test('touch drag: 0 React commits between pointerdown and pointerup', async ({ page, browserName }) => {
    await installCommitCounter(page);
    await openDefault(page);
    const mountCommits = await page.evaluate(() => window.__agCommits ?? 0);
    expect(mountCommits, 'devtools hook saw no commits — counter is not live').toBeGreaterThan(0);

    const handle = page.locator('[data-ag-part="resize-handle"]').first();
    const box = await handle.boundingBox();
    if (!box) throw new Error('no handle box');
    // let any mount-time effects settle before measuring
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const atDown = await page.evaluate(() => window.__agCommits ?? 0);

    const drag = await touchDrag(page, browserName, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, 120);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const midDrag = await bases(page);
    const beforeUp = await page.evaluate(() => window.__agCommits ?? 0);
    await drag.end();
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
    const afterUp = await page.evaluate(() => window.__agCommits ?? 0);

    expect(midDrag[0]!, 'flex-basis did not move during the drag').toBeGreaterThan(50);
    expect({ commitsDuringDrag: beforeUp - atDown }).toEqual({ commitsDuringDrag: 0 });
    // pointerup is where React state lands (aria-valuenow) — proves the
    // counter observes this subtree's commits.
    expect(afterUp - beforeUp, 'no commit observed on pointerup').toBeGreaterThan(0);
    const final = await bases(page);
    expect(final[0]! + final[1]!).toBeCloseTo(100, 1);
  });
});
