/* MAT-310 (REQ-QA-18): axe — @axe-core/playwright over every subject story,
   wcag2a/2aa/21aa/22aa tags, color-contrast on (color-contrast-enhanced under
   contrast=more). AXE_SCOPE=pr covers subject-states on photo + flat-white,
   light/dark; AXE_SCOPE=full (nightly/RC/GA) sweeps the whole subject index.
   0 serious/critical; moderate fails T1, ratcheted T2 via axe-moderate-baseline.
   Writes axe-results.json with run id + SHA. jest-axe is never merged.
   REQ-MAT-65: the subject index is listSubjects() (S-40) — never a regex over
   index.json — and every serious/critical row is attributed to the subject's
   owner; QUAL's S-40 apg.axe({ colorContrast: true }) runs over every
   MAT-owned subject with 0 violations. */
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { apg, listSubjects } from '../../helpers';
import { sweepSubjects, allSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

const SCOPE = process.env.AXE_SCOPE ?? 'pr';
const BASELINE = 'tests/a11y/axe-moderate-baseline.json';

interface AxeRow {
  story: string; subject: string; owner: Owner; scene: string; engine: string;
  violations: Array<{ id: string; impact: string; nodes: number }>;
  seriousCritical: number; moderate: number;
}

test.describe('axe', () => {
  test(`scope=${SCOPE}: 0 serious/critical, moderate ratcheted`, async ({ page, browserName }, testInfo) => {
    test.setTimeout(60 * 60 * 1000);
    const stories = await sweepSubjects(listSubjects, SCOPE === 'full' ? 'full' : 'pr');
    const scenes = ['photo', 'flat-white'];
    const schemes = ['light', 'dark'];
    const baseline: Record<string, number> = fs.existsSync(BASELINE)
      ? (JSON.parse(fs.readFileSync(BASELINE, 'utf8')) as Record<string, number>) : {};
    const rows: AxeRow[] = [];
    const seriousCriticalFails: Array<{ owner: Owner; msg: string }> = [];
    const moderateOver: string[] = [];

    for (const story of stories) {
      for (const scheme of schemes) {
        for (const scene of scenes) {
          await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=scheme:${scheme};scene:${scene}`);
          await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
          const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
          const moderate = results.violations.filter((v) => v.impact === 'moderate');
          rows.push({
            story: story.id, subject: story.subject, owner: story.owner, scene: `${scene}/${scheme}`, engine: browserName,
            violations: results.violations.map((v) => ({ id: v.id, impact: v.impact ?? '', nodes: v.nodes.length })),
            seriousCritical: serious.length, moderate: moderate.length,
          });
          if (serious.length) seriousCriticalFails.push({ owner: story.owner, msg: `${tag(story)} @${scene}/${scheme}: ${serious.map((v) => v.id).join(',')}` });
          const base = baseline[story.id] ?? 0;
          if (moderate.length > base) moderateOver.push(`${tag(story)} @${scene}/${scheme}: ${moderate.length} > baseline ${base}`);
        }
      }
    }

    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/axe-results-${browserName}.json`, JSON.stringify({
      runId: process.env.CI_JOB_ID ?? process.env.GITLAB_CI?.toString() ?? 'local',
      sha: process.env.CI_COMMIT_SHA ?? 'unknown',
      scope: SCOPE, rows, byOwner: byOwner(seriousCriticalFails),
    }, null, 2));
    testInfo.annotations.push({ type: 'note', description: `${rows.length} cells, ${seriousCriticalFails.length} serious/critical` });
    expect(seriousCriticalFails.map((f) => f.msg), 'serious/critical violations').toEqual([]);
    expect(moderateOver, 'moderate over T2 ratchet').toEqual([]);
  });

  test('apg.axe colorContrast over every MAT subject: 0 violations', async ({ page, browserName }) => {
    test.setTimeout(30 * 60 * 1000);
    const mat = (await allSubjects(listSubjects)).filter((s) => s.owner === 'MAT' && !s.tags.includes('no-cert'));
    expect(mat.length, 'MAT subjects in listSubjects()').toBeGreaterThan(0);
    const fails: Array<{ owner: Owner; msg: string }> = [];
    for (const s of mat) {
      for (const scheme of ['light', 'dark']) {
        await page.goto(`/iframe.html?id=${s.id}&viewMode=story&globals=scheme:${scheme}`);
        await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
        try {
          await apg.axe(page, { colorContrast: true });
        } catch (e) {
          fails.push({ owner: s.owner, msg: `${tag(s)} @${scheme}: ${(e as Error).message}` });
        }
      }
    }
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/axe-color-contrast-${browserName}.json`, JSON.stringify({ subjects: mat.map((s) => s.id), byOwner: byOwner(fails) }, null, 2));
    expect(fails.map((f) => f.msg), 'axe color-contrast violations on MAT subjects').toEqual([]);
  });
});
