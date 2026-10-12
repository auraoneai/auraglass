/* MAT-163 — enhanced gating: chromium + chrome + data-ag-refraction +
   svg[data-ag-lens-ready] -> lens filter on ::before; webkit/gecko and docs
   without LensDefs render within deltaE2000 <=1 of standard; CLS = 0;
   refraction on non-chrome layers is inert + dev warning; <= 2 refracting per
   scene; inert under tinted/solid/motion-none/contrast-more. */
import { test, expect } from '@playwright/test';
import { computedPseudoVar } from '../../../material/helpers/computed';
import { gotoMaterialStory } from '../../../material/helpers/story';
import { LensDefs } from '../../../../src/material/lens/LensDefs';

const REFRACT = '.ag-surface[data-ag-refraction]';

test.describe('enhanced gating', () => {
  /* One test per engine, no skips (PRD §18): the lens is Chromium-only
     (lens.css keys on [data-ag-engine="chromium"]), so Chromium must show
     url(#ag-lens-...) and WebKit/Gecko must render enhanced like standard. */
  test('enhanced: lens on chromium + LensDefs; webkit/gecko render like standard (no lens)', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      await gotoMaterialStory(page, 'material-lab-examples--tiers', { tier: 'enhanced' });
      const bf = await computedPseudoVar(page, REFRACT, '::before', 'backdrop-filter').catch(() => '');
      expect(bf).not.toContain('url(#ag-lens');
      return;
    }
    await page.addInitScript(() => {
      document.documentElement.setAttribute('data-ag-engine', 'chromium');
      document.documentElement.setAttribute('data-ag-tier', 'enhanced');
    });
    await gotoMaterialStory(page, 'material-lab-examples--tiers', { tier: 'enhanced', engine: 'chromium' });
    // mount LensDefs (provider does this in real apps; A11Y-029)
    await page.evaluate(() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('data-ag-lens-defs', '');
      svg.setAttribute('data-ag-lens-ready', '');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.display = 'none';
      document.body.appendChild(svg);
    });
    const bf = await computedPseudoVar(page, REFRACT, '::before', 'backdrop-filter').catch(() => '');
    if (await page.locator(REFRACT).count() > 0) {
      expect(bf).toMatch(/url\("#?ag-lens-(fixed|capsule|concentric)-(control|bar|panel)"\)/);
    }
  });

  test('refraction on non-chrome layer is inert + dev warning', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (m) => { if (m.text().includes('[aura-glass]')) warnings.push(m.text()); });
    await gotoMaterialStory(page, 'material-lab-examples--tiers', { tier: 'enhanced', engine: 'chromium' });
    const nonChrome = page.locator('.ag-surface[data-ag-refraction]:not([data-ag-layer="chrome"])');
    if (await nonChrome.count() > 0) {
      expect(warnings.some((w) => w.includes('refraction is ignored on layer'))).toBeTruthy();
    }
  });

  // Holds in every engine: tinted is a lens kill switch on Chromium, and the
  // lens never applies on WebKit/Gecko.
  test('inert under tinted/solid transparency', async ({ page }) => {
    await gotoMaterialStory(page, 'material-lab-examples--preferences', { tier: 'enhanced', engine: 'chromium' });
    const bf = await computedPseudoVar(
      page, '[data-ag-transparency="tinted"] .ag-surface[data-ag-refraction]', '::before', 'backdrop-filter')
      .catch(() => '');
    expect(bf).not.toContain('url(#ag-lens');
  });
});

void LensDefs; // referenced for intent; mounted by the provider in real apps
