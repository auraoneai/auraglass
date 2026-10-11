/* REQ-QUAL-20 (S-40, FIN-439) — QUAL's axe spec: every subject-state from listSubjects() (never `no-cert` fixtures) in
   its default story environment, through ApgHarness axe semantics: the full ruleset with color-contrast on,
   serious/critical violations fail. The scan is scoped to the story content and overlay roots so Storybook's iframe
   page structure (title, landmarks) is not attributed to the subject. Runs in the qual:a11y-browser-<engine> projects
   (chromium, webkit, firefox) of certification/playwright.cert.config.ts; the scene × scheme × preference matrix and the
   flagship moderate rule are certification/lanes/behaviour.spec.ts (L5). GitLab CI / remote runner only. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../helpers';
import { axeScan, formatViolations } from '../apg/harness';
import { STORY_SCAN_INCLUDE } from '../../../certification/lanes/_fixtures/behaviour';
import { pendingOrFail } from '../../../certification/lanes/_fixtures/pending';
import { laneSubjects, type Subject } from '../../../certification/lanes/_fixtures/subjects';

let subjects: Subject[] = [];
let unavailable: string | null = null;
try {
  subjects = await laneSubjects();
} catch (e) {
  unavailable = (e as Error).message.replace(/^(pending|release scope): /, '');
}

test.describe('axe over listSubjects()', () => {
  if (unavailable !== null) {
    const reason = unavailable;
    test('subject index', () => { pendingOrFail(reason, 'qual:build:storybook served at AG_STORYBOOK_URL + cert manifest (G-01)'); });
    return;
  }
  for (const s of subjects) {
    test(`axe ${s.id}`, async ({ page }) => {
      await gotoStory(page, s.id);
      const r = await axeScan(page, { colorContrast: true, include: STORY_SCAN_INCLUDE });
      expect(r.rulesRun, 'full axe ruleset ran').toBeGreaterThan(1);
      expect(r.blocking.length ? formatViolations(r.blocking) : null, `[${s.owner}] ${s.subject}: serious/critical axe violations`).toBeNull();
    });
  }
});
