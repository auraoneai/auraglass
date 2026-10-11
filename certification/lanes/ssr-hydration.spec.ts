/* G-18 / REQ-QUAL-21 (FIN-440) — SSR and hydration lane (L5/L6 per lanes.config).

   For every flagship subject (one story per subject, Playground first): the
   story is rendered with react-dom/server in Node and hydrated with
   hydrateRoot in the engine under test, twice — development build (React's
   hydration warnings) and react-dom/profiling build (Profiler commits).
   Each pass must show 0 console warnings/errors (server and client), 0 page
   or React errors, 0 <html> data-ag-* mutations after AuraGlassScript, 0
   class/data-ag-tier mutations on [data-ag-surface], and — profiling pass —
   0 React commits in the first 1 s after the hydration commit without input.

   Negative control: the QUAL Date.now() fixture must be rejected.
   Browser lane: runs only in GitLab CI / the gated remote runner, in the
   chromium, webkit and firefox projects of certification/playwright.cert.config.ts. */
import { test, expect } from '@playwright/test';
import { fixtureStory, laneSubjects, onePerSubject, type SubjectStory } from './_fixtures/subjects';
import { buildSsrBundles, hydrateInPage, hydrationViolations, renderOnServer } from './_fixtures/ssr';

const MISMATCH_FIXTURE = 'qual-fixtures-hydration-mismatch--date-now';

async function ssrViolations(page: import('@playwright/test').Page, story: SubjectStory, outDir: string, mode: 'development' | 'profiling') {
  const bundles = await buildSsrBundles(story, outDir);
  const server = await renderOnServer(bundles);
  const result = await hydrateInPage(page, server, bundles, mode);
  return { violations: hydrationViolations(server, result), result };
}

test.describe('L5 SSR + hydration (REQ-QUAL-21)', () => {
  test('flagship subjects hydrate without warnings, mutations or re-renders', async ({ browser }, testInfo) => {
    test.setTimeout(30 * 60_000);
    const stories = await onePerSubject(await laneSubjects({ tags: ['flagship'] }));
    const failures: Record<string, string[]> = {};
    const stylesheets: Record<string, string | null> = {};
    for (const story of stories) {
      const key = `${story.subject} (${story.id})`;
      let bundles: Awaited<ReturnType<typeof buildSsrBundles>>;
      let server: Awaited<ReturnType<typeof renderOnServer>>;
      try {
        bundles = await buildSsrBundles(story, testInfo.outputPath(story.id.replace(/[^a-z0-9-]/gi, '_')));
        server = await renderOnServer(bundles);
      } catch (e) {
        failures[key] = [`server render error: ${(e as Error).message}`];
        continue;
      }
      for (const mode of ['development', 'profiling'] as const) {
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
          const result = await hydrateInPage(page, server, bundles, mode);
          stylesheets[`${story.id} (${mode})`] = result.stylesheet;
          const violations = hydrationViolations(server, result);
          if (violations.length) failures[`${key} ${mode}`] = violations;
        } catch (e) {
          failures[`${key} ${mode}`] = [`hydration error: ${(e as Error).message}`];
        } finally {
          await context.close();
        }
      }
    }
    await testInfo.attach('ssr-hydration.json', {
      body: JSON.stringify({ subjects: stories.map((s) => s.id), stylesheets, failures }, null, 2), contentType: 'application/json',
    });
    expect(stories.length, 'flagship subjects certified').toBeGreaterThan(0);
    expect(failures).toEqual({});
  });

  for (const mode of ['development', 'profiling'] as const) {
    test(`negative control: a Date.now() render mismatch is rejected (${mode})`, async ({ page }, testInfo) => {
      const story = await fixtureStory(MISMATCH_FIXTURE);
      const { violations } = await ssrViolations(page, story, testInfo.outputPath('fixture'), mode);
      // production builds report hydration failures as minified errors (#418 text mismatch, #423/#425 legacy codes)
      expect(violations.join('\n')).toMatch(/hydrat|did ?n.t match|Minified React error #4(18|19|21|22|23|25)\b/i);
    });
  }
});
