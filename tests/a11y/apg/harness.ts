/* @ag-contract-seed: S-40. Owner QUAL. keyboard + axe over @axe-core/playwright. */
import type { ApgHarness, ApgStep } from '../../../src/contracts/testing';

async function expectFocused(page: import('@playwright/test').Page, sel: string) {
  await page.waitForFunction((s) => {
    const el = document.activeElement;
    if (!el) return false;
    if (s.startsWith('role=')) {
      const m = /^role=(\w+)(?:\[name=(.+)\])?$/.exec(s);
      if (!m) return false;
      const role = m[1];
      const name = m[2];
      const r = el.getAttribute('role') ?? el.tagName.toLowerCase();
      if (r !== role) return false;
      if (!name) return true;
      const acc = el.getAttribute('aria-label') ?? el.textContent ?? '';
      return acc.includes(name);
    }
    return el.getAttribute('data-ag-part') === s;
  }, sel, { timeout: 5_000 });
}

async function step(page: import('@playwright/test').Page, s: ApgStep) {
  if (s.press) await page.keyboard.press(s.press);
  if (s.type) await page.keyboard.type(s.type);
  if (s.expectFocus) await expectFocused(page, s.expectFocus);
  if (s.expectState) {
    for (const [attr, value] of Object.entries(s.expectState)) {
      await page.waitForFunction(
        ([a, v]) => a !== undefined && document.activeElement?.getAttribute(a) === v,
        [attr, value], { timeout: 5_000 },
      );
    }
  }
  if (s.expectAnnounced) {
    await page.waitForFunction(
      (msg) => [...document.querySelectorAll('[data-ag-announcer] [aria-live]')]
        .some((el) => (el.textContent ?? '').includes(msg)),
      s.expectAnnounced, { timeout: 5_000 },
    );
  }
}

export const apg: ApgHarness = {
  async keyboard(page, script) {
    for (const s of script) await step(page, s);
  },
  async axe(page, opts = {}) {
    const { AxeBuilder } = await import('@axe-core/playwright');
    let builder = new AxeBuilder({ page });
    if (opts.colorContrast === true) {
      builder = builder.withRules(['color-contrast']);
    } else {
      builder = builder.disableRules(['color-contrast']);
    }
    const results = await builder.analyze();
    if (results.violations.length) {
      throw new Error(
        `axe violations (${results.violations.length}): ` +
        results.violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join(' | '),
      );
    }
  },
};
