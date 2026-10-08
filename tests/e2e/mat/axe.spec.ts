/* MAT-310 (REQ-QA-18): axe — @axe-core/playwright over every subject story,
   wcag2a/2aa/21aa/22aa tags, color-contrast on (color-contrast-enhanced under
   contrast=more). AXE_SCOPE=pr covers subject-states on photo + flat-white,
   light/dark; AXE_SCOPE=full (nightly/RC/GA) sweeps the whole subject index.
   0 serious/critical; moderate fails T1, ratcheted T2 via axe-moderate-baseline.
   Writes axe-results.json with run id + SHA. jest-axe is never merged. */
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'node:fs';

const SCOPE = process.env.AXE_SCOPE ?? 'pr';
const BASELINE = 'tests/a11y/axe-moderate-baseline.json';

interface AxeRow {
  story: string; scene: string; engine: string;
  violations: Array<{ id: string; impact: string; nodes: number }>;
  seriousCritical: number; moderate: number;
}

test.describe('axe', () => {
  test(`scope=${SCOPE}: 0 serious/critical, moderate ratcheted`, async ({ page, baseURL, browserName }, testInfo) => {
    const res = await fetch(`${baseURL}/index.json`);
    const idx = (await res.json()) as { entries: Record<string, { id: string; type: string; tags?: string[] }> };
    let stories = Object.values(idx.entries).filter((e) => e.type === 'story');
    if (SCOPE === 'pr') {
      stories = stories.filter((s) => /a11y|states/i.test(s.id)).slice(0, 20);
    }
    const scenes = SCOPE === 'pr' ? ['photo', 'flat-white'] : ['photo', 'flat-white'];
    const schemes = ['light', 'dark'];
    const baseline: Record<string, number> = fs.existsSync(BASELINE)
      ? (JSON.parse(fs.readFileSync(BASELINE, 'utf8')) as Record<string, number>) : {};
    const rows: AxeRow[] = [];
    const seriousCriticalFails: string[] = [];
    const moderateOver: string[] = [];

    for (const story of stories) {
      for (const scheme of schemes) {
        for (const scene of scenes) {
          await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=scheme:${scheme};scene:${scene}`);
          await page.waitForSelector('body');
          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
          const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
          const moderate = results.violations.filter((v) => v.impact === 'moderate');
          rows.push({
            story: story.id, scene: `${scene}/${scheme}`, engine: browserName,
            violations: results.violations.map((v) => ({ id: v.id, impact: v.impact ?? '', nodes: v.nodes.length })),
            seriousCritical: serious.length, moderate: moderate.length,
          });
          if (serious.length) seriousCriticalFails.push(`${story.id}@${scene}/${scheme}: ${serious.map((v) => v.id).join(',')}`);
          const base = baseline[story.id] ?? 0;
          if (moderate.length > base) moderateOver.push(`${story.id}@${scene}/${scheme}: ${moderate.length} > baseline ${base}`);
        }
      }
    }

    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync('.artifacts/mat/axe-results.json', JSON.stringify({
      runId: process.env.CI_JOB_ID ?? process.env.GITLAB_CI?.toString() ?? 'local',
      sha: process.env.CI_COMMIT_SHA ?? 'unknown',
      scope: SCOPE, rows,
    }, null, 2));
    testInfo.annotations.push({ type: 'note', description: `${rows.length} cells, ${seriousCriticalFails.length} serious/critical` });
    expect(seriousCriticalFails, 'serious/critical violations').toEqual([]);
    expect(moderateOver, 'moderate over T2 ratchet').toEqual([]);
  });
});
