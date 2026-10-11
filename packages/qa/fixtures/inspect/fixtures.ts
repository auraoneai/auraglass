/* REQ-QUAL-32 (QUAL, FIN-434) — the 10 perceptual-audit regression fixtures, ported from
   v4.1.0 tests/visual/design-system/token-purity-layout-audit.spec.ts:3930-4128 (on `next` until FIN-C's removal:
   legacy/tests/visual/design-system/…). Read from the tag, never imported.

   Each fixture keeps the original page content, viewport, preparation step and assertion. The assertion is expressed as
   a `verdict` predicate over the ported detectors (packages/qa/src/inspect/v41) so the same fixture runs under Jest
   (packages/qa/test/inspect.fixtures.test.ts) and under Playwright (certification/lanes/known-failures.spec.ts).
   `expected` is the 4.1 verdict: 9 fixtures must fire their detector, 1 (`localized-accents-allowed`) must stay
   silent. A detector change that flips any verdict fails both runners. Browser-only (Chromium). */
import type { Page } from '@playwright/test';
import {
  checkTokenInvariants, checkViewportColorCensus, collectLayoutIssues, collectPaintInspections, collectPresentationIssues,
  collectTextInspections, inspectViewportColorCensus,
} from '../../src/inspect/v41';

export interface FixtureVerdict {
  /** true when the detector output matches the 4.1 assertion of this fixture */
  ok: boolean;
  /** detector output the verdict was computed from (reported on mismatch) */
  observed: unknown;
}

export interface InspectFixture {
  id: string;
  /** the original Playwright test title */
  title: string;
  /** line range of the original test in the v4.1.0 spec */
  source: string;
  /** what the 4.1 fixture asserts: the detector fires, or stays silent */
  expected: 'fires' | 'silent';
  viewport?: { width: number; height: number };
  html: string;
  prepare?: (page: Page) => Promise<void>;
  verdict: (page: Page) => Promise<FixtureVerdict>;
}

export const INSPECT_FIXTURES: readonly InspectFixture[] = [
  {
    id: 'control-near-collision',
    title: 'fails a near-collision between a settings row and reset control',
    source: '3931-3954',
    expected: 'fires',
    html: `
      <style>
        body { margin: 0; }
        .row { width: 320px; height: 48px; display:flex; align-items:center; background:rgba(255,255,255,.2); }
        .reset { display:block; width:140px; height:28px; margin-top:1px; background:rgba(255,255,255,.3); }
      </style>
      <div class="row"><button aria-label="Reduced motion">Reduced motion</button></div>
      <button class="reset">Reset to Defaults</button>
    `,
    verdict: async (page) => {
      const issues = await collectLayoutIssues(page);
      const ok = issues.some((i) => /control-spacing|visual-control-collision/.test(i.type) && i.detail.includes('required>=8px'));
      return { ok, observed: issues };
    },
  },
  {
    id: 'saturated-canvas-navy-control',
    title: 'fails saturated canvas and opaque navy interactive paint',
    source: '3956-3981',
    expected: 'fires',
    html: `
      <style>
        html, body, #storybook-root { width:100%; height:100%; margin:0; }
        body { background:rgb(18,82,182); }
        button { background:rgb(27,38,67); color:white; }
      </style>
      <button>Primary Button</button>
    `,
    verdict: async (page) => {
      const paints = await collectPaintInspections(page);
      const failures = checkTokenInvariants([], await collectTextInspections(page), paints);
      const ok = failures.some((f) => f.includes('canvas paint saturated')) && failures.some((f) => f.includes('interactive paint dark/navy'));
      return { ok, observed: failures };
    },
  },
  {
    id: 'white-pastel-text-on-white',
    title: 'fails opaque white and pastel text on a white local backdrop',
    source: '3983-4009',
    expected: 'fires',
    html: `
      <style>
        body { margin:0; background:rgb(248,250,252); }
        .card { margin:20px; padding:20px; background:rgba(255,255,255,.84); }
        .white { color:rgb(255,255,255); }
        .pastel { color:rgb(210,225,238); }
      </style>
      <section class="card"><h2 class="white">Glass context</h2><p class="pastel">Persona details</p></section>
    `,
    verdict: async (page) => {
      const texts = await collectTextInspections(page);
      const measured = texts.some((t) => typeof t.contrastRatio === 'number');
      const failures = checkTokenInvariants([], texts, []);
      const contrast = failures.filter((f) => f.includes('local contrast'));
      const ok = measured && contrast.length === 2
        && failures.some((f) => f.includes('text="Glass context"')) && failures.some((f) => f.includes('text="Persona details"'));
      return { ok, observed: { contrastRatios: texts.map((t) => t.contrastRatio), failures } };
    },
  },
  {
    id: 'blank-minuscule-output',
    title: 'fails blank and minuscule primary output',
    source: '4011-4021',
    expected: 'fires',
    html: '<div id="storybook-root"><span style="display:inline-block;width:2px;height:2px"></span></div>',
    verdict: async (page) => {
      const issues = await collectPresentationIssues(page);
      return { ok: issues.some((i) => i.type === 'blank-or-minuscule-primary-output'), observed: issues };
    },
  },
  {
    id: 'cropped-displaced-output',
    title: 'fails cropped and responsively displaced primary output even inside a scroller',
    source: '4023-4039',
    expected: 'fires',
    viewport: { width: 390, height: 844 },
    html: `
      <style>body{margin:0}.scroll{width:390px;overflow:auto}.demo{width:900px;height:500px;transform:translateX(-240px);background:rgba(255,255,255,.2)}</style>
      <div id="storybook-root"><div class="scroll"><main class="demo" data-primary-output>Primary dashboard output</main></div></div>
    `,
    verdict: async (page) => {
      const issues = await collectPresentationIssues(page);
      const ok = issues.some((i) => i.type === 'major-responsive-offscreen-displacement' || i.type === 'primary-output-viewport-cutoff');
      return { ok, observed: issues };
    },
  },
  {
    id: 'closed-compound-dropdown',
    title: 'fails a compound dropdown shown only as a closed constituent',
    source: '4041-4053',
    expected: 'fires',
    html: '<div id="storybook-root" data-certification-component="Glass Dropdown"><button aria-haspopup="menu" aria-expanded="false">Choose item</button></div>',
    verdict: async (page) => {
      const issues = await collectPresentationIssues(page);
      return { ok: issues.some((i) => i.type === 'hidden-constituent-evidence'), observed: issues };
    },
  },
  {
    id: 'native-controls-chromatic-canvas',
    title: 'fails unfinished native controls and dominant chromatic canvas pixels',
    source: '4055-4075',
    expected: 'fires',
    html: '<div id="storybook-root"><select><option>Native select</option></select><canvas width="240" height="160"></canvas></div>',
    prepare: async (page) => {
      await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d')!;
        context.fillStyle = 'rgb(8, 42, 118)';
        context.fillRect(0, 0, canvas.width, canvas.height);
      });
    },
    verdict: async (page) => {
      const issues = await collectPresentationIssues(page);
      const ok = issues.some((i) => i.type === 'unfinished-native-control-presentation') && issues.some((i) => i.type === 'dominant-canvas-chroma-darkness');
      return { ok, observed: issues };
    },
  },
  {
    id: 'blue-mint-field-wash',
    title: 'fails broad subtle blue and mint field washes like EffectGroup',
    source: '4077-4092',
    expected: 'fires',
    viewport: { width: 900, height: 600 },
    html: `
      <style>
        html,body,#storybook-root{width:100%;height:100%;margin:0}
        body{background:linear-gradient(130deg,rgba(108,176,236,.34),rgba(115,222,202,.30)),rgb(238,244,249)}
        .glass{position:absolute;inset:70px;background:rgba(221,241,248,.58);box-shadow:0 24px 80px rgba(55,167,202,.28)}
      </style><div id="storybook-root"><main class="glass">Effect group</main></div>
    `,
    verdict: async (page) => {
      const census = await inspectViewportColorCensus(page);
      const failures = checkViewportColorCensus(census);
      const ok = failures.length === 1 && failures[0]!.includes('whole-viewport problematic tint');
      return { ok, observed: { census, failures } };
    },
  },
  {
    id: 'blue-purple-field-tinted-shadows',
    title: 'fails broad blue purple field and overlapping tinted shadows like AdvancedAnimations',
    source: '4094-4109',
    expected: 'fires',
    viewport: { width: 900, height: 600 },
    html: `
      <style>
        html,body,#storybook-root{width:100%;height:100%;margin:0}
        body{background:linear-gradient(120deg,rgb(28,53,126),rgb(40,102,219) 62%,rgb(28,142,151))}
        .card{display:inline-block;margin:160px 16px 0 90px;width:180px;height:110px;background:rgba(144,164,236,.42);box-shadow:0 20px 72px rgba(43,64,210,.42)}
      </style><div id="storybook-root"><div class="card">Advanced animation</div><div class="card">Material physics</div></div>
    `,
    verdict: async (page) => {
      const census = await inspectViewportColorCensus(page);
      const failures = checkViewportColorCensus(census);
      const ok = failures.length === 1 && failures[0]!.includes('whole-viewport problematic tint');
      return { ok, observed: { census, failures } };
    },
  },
  {
    id: 'localized-accents-allowed',
    title: 'allows tiny localized semantic and spectral edge accents',
    source: '4111-4127',
    expected: 'silent',
    viewport: { width: 900, height: 600 },
    html: `
      <style>
        html,body,#storybook-root{width:100%;height:100%;margin:0;background:rgb(242,245,248)}
        .glass{position:absolute;inset:70px;background:rgba(255,255,255,.34);box-shadow:inset 0 1px rgba(255,255,255,.28),0 20px 48px rgba(15,23,42,.08)}
        .edge{position:absolute;left:70px;top:70px;width:5px;height:90px;background:linear-gradient(rgb(66,153,225),rgb(147,51,234))}
        .status{position:absolute;right:90px;top:90px;width:12px;height:12px;border-radius:50%;background:rgb(34,197,94)}
      </style><div id="storybook-root"><main class="glass">Neutral liquid glass</main><span class="edge"></span><span class="status"></span></div>
    `,
    verdict: async (page) => {
      const census = await inspectViewportColorCensus(page);
      const failures = checkViewportColorCensus(census);
      return { ok: failures.length === 0, observed: { census, failures } };
    },
  },
];

/** Loads one fixture into `page` exactly as the 4.1 test did (viewport first, then setContent, then preparation). */
export async function loadFixture(page: Page, fixture: InspectFixture): Promise<void> {
  if (fixture.viewport) await page.setViewportSize(fixture.viewport);
  await page.setContent(fixture.html);
  if (fixture.prepare) await fixture.prepare(page);
}
