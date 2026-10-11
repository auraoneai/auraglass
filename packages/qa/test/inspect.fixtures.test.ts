/* REQ-QUAL-32 (QUAL, FIN-434) — the 10 ported 4.1 detector fixtures keep their verdicts.

   Runs the ported 4.x measurement layer (packages/qa/src/inspect/v41) over the fixtures ported from
   v4.1.0 token-purity-layout-audit.spec.ts:3930-4128 (packages/qa/fixtures/inspect/fixtures.ts) in Chromium and
   asserts each verdict is identical to 4.1: 9 detectors fire, the localized-accent fixture stays silent.
   Browser test: needs the Playwright Chromium of AG_PLAYWRIGHT_IMAGE (GitLab job qual:certify:known-failures).
   It is never run on a developer Mac (machine policy); a missing browser fails the suite, it is never skipped. */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { chromium, type Browser } from '@playwright/test';
import { INSPECT_FIXTURES, loadFixture } from '../fixtures/inspect/fixtures';

/** Playwright's default page viewport — the size the 4.1 fixtures without an explicit viewport ran at. */
const DEFAULT_VIEWPORT = { width: 1280, height: 720 };

let browser: Browser;

beforeAll(async () => {
  try {
    browser = await chromium.launch();
  } catch (error) {
    throw new Error(`inspect.fixtures.test.ts needs Playwright Chromium (run it in AG_PLAYWRIGHT_IMAGE, job qual:certify:known-failures): ${(error as Error).message}`);
  }
});

afterAll(async () => {
  await browser?.close();
});

describe('ported 4.1 perceptual-audit fixtures (REQ-QUAL-32)', () => {
  it('ports exactly the 10 fixtures of :3930-4128, 9 firing and 1 silent', () => {
    expect(INSPECT_FIXTURES).toHaveLength(10);
    expect(new Set(INSPECT_FIXTURES.map((f) => f.id)).size).toBe(10);
    expect(INSPECT_FIXTURES.filter((f) => f.expected === 'fires')).toHaveLength(9);
    expect(INSPECT_FIXTURES.filter((f) => f.expected === 'silent').map((f) => f.id)).toEqual(['localized-accents-allowed']);
  });

  it.each(INSPECT_FIXTURES.map((f) => [f.id, f] as const))('%s keeps its 4.1 verdict', async (_id, fixture) => {
    const context = await browser.newContext({ viewport: DEFAULT_VIEWPORT });
    try {
      const page = await context.newPage();
      await loadFixture(page, fixture);
      const verdict = await fixture.verdict(page);
      if (!verdict.ok) throw new Error(`${fixture.title} (:${fixture.source}) — verdict differs from 4.1; detector output: ${JSON.stringify(verdict.observed).slice(0, 4000)}`);
      expect(verdict.ok).toBe(true);
    } finally {
      await context.close();
    }
  });
});
