/* MAT-307 (REQ-A11Y-28) / REQ-MAT-63 (WCAG 2.4.11): focus not obscured.
   - MAT's own sticky-chrome fixture (A11y/ScrollPadding, resolved through
     listSubjects() and required to be MAT-owned): Tab through >= 50
     focusables at 1440 and 390; no focused element is fully covered by
     sticky/fixed chrome and the median coverage is 0.
   - REQ-MAT-63/-65: every sticky-chrome subject another stream lists in
     listSubjects() (AppShell, TopBar, Toolbar, TabBar, by subject name — never
     a hard-coded story id) gets the same probe at both widths, and each
     failure is reported against that subject's owner ([<owner> <subject> <id>]).
   - Artifact: .artifacts/mat/<job>/focus-not-obscured.json, one row per
     subject x width, written even when a row fails. */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listSubjects } from '../../helpers';
import { allSubjects, byOwner, matFixture, onePerSubject, tag, type Owner, type Subject } from './helpers/subjects';

const STORY = 'a11y-scrollpadding--default';
const WIDTHS = [1440, 390] as const;
const TABS = 50;
/** Sticky-chrome subjects owned by other streams, matched by subject name. */
const STICKY_CHROME = /^(app-?shell|top-?bar|toolbar|tab-?bar)$/i;

const JOB = process.env.CI_JOB_NAME_SLUG ?? 'local';
const ART_DIR = join('.artifacts', 'mat', JOB);

interface Row {
  owner: Owner; subject: string; storyId: string; width: number; engine: string;
  focused: number; chrome: number; median: number; max: number; fullyCovered: number; pass: boolean;
}
const rows: Row[] = [];
const fails: Array<{ owner: Owner; msg: string }> = [];

/** Fraction of the focused element covered by sticky/fixed chrome that does
    not contain it (a control inside the top bar is not obscured by the bar). */
async function coverageProbe(page: import('@playwright/test').Page) {
  const coverages: number[] = [];
  let chrome = 0;
  for (let i = 0; i < TABS; i += 1) {
    await page.keyboard.press('Tab');
    const c = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) return null;
      const r = el.getBoundingClientRect();
      if (r.width * r.height <= 0) return null;
      const bars = [...document.querySelectorAll<HTMLElement>('body *')].filter((n) => {
        const pos = getComputedStyle(n).position;
        return (pos === 'sticky' || pos === 'fixed') && !n.contains(el) && n.getBoundingClientRect().height > 0;
      });
      let covered = 0;
      for (const ch of bars) {
        const cr = ch.getBoundingClientRect();
        const w = Math.max(0, Math.min(r.right, cr.right) - Math.max(r.left, cr.left));
        const h = Math.max(0, Math.min(r.bottom, cr.bottom) - Math.max(r.top, cr.top));
        covered += w * h;
      }
      return { coverage: Math.min(1, covered / (r.width * r.height)), chrome: bars.length };
    });
    if (c === null) continue;
    chrome = Math.max(chrome, c.chrome);
    coverages.push(c.coverage);
  }
  const sorted = [...coverages].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)]! : 0;
  return { coverages, median, chrome, max: sorted.at(-1) ?? 0 };
}

async function probe(page: import('@playwright/test').Page, s: Subject, width: number, engine: string) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto(`/iframe.html?id=${s.id}&viewMode=story`);
  await page.waitForSelector('#storybook-root > *');
  // start the Tab walk from the scroll container when there is one
  const container = page.locator('[data-ag-scroll-container]').first();
  if (await container.count()) await container.click({ position: { x: 1, y: 1 } });
  const { coverages, median, chrome, max } = await coverageProbe(page);
  const fullyCovered = coverages.filter((c) => c >= 1).length;
  const pass = fullyCovered === 0 && median === 0;
  rows.push({
    owner: s.owner, subject: s.subject, storyId: s.id, width, engine,
    focused: coverages.length, chrome, median, max, fullyCovered, pass,
  });
  if (!pass) {
    fails.push({
      owner: s.owner,
      msg: `${tag(s)} @${width}px ${engine}: ${fullyCovered} focused element(s) fully covered by sticky chrome, median coverage ${median.toFixed(3)}`,
    });
  }
  return { coverages, median, fullyCovered };
}

test.describe('focus-not-obscured', () => {
  test.describe.configure({ mode: 'serial' });

  test.afterAll(async ({ browserName }) => {
    mkdirSync(ART_DIR, { recursive: true });
    writeFileSync(join(ART_DIR, `focus-not-obscured${browserName === 'chromium' ? '' : `-${browserName}`}.json`), JSON.stringify({
      req: 'REQ-MAT-63', wcag: '2.4.11', tabs: TABS, widths: WIDTHS, rows,
      failuresByOwner: byOwner(fails),
    }, null, 2));
  });

  for (const width of WIDTHS) {
    test(`MAT fixture: sticky chrome never covers the focused element at ${width}px`, async ({ page, browserName }) => {
      const fixture = await matFixture(listSubjects, STORY);
      const { coverages, median, fullyCovered } = await probe(page, fixture, width, browserName);
      expect(coverages.length, `${tag(fixture)} tabbed through >= ${TABS} focus targets`).toBeGreaterThanOrEqual(TABS);
      expect(fullyCovered, `${tag(fixture)} no focus target fully covered by chrome`).toBe(0);
      expect(median, `${tag(fixture)} median chrome coverage = 0`).toBe(0);
    });
  }

  test('sticky-chrome subjects of other streams, reported against their owner', async ({ page, browserName }) => {
    test.setTimeout(10 * 60_000);
    const subjects = onePerSubject((await allSubjects(listSubjects))
      .filter((s) => s.owner !== 'MAT' && STICKY_CHROME.test(s.subject.replace(/\s+/g, '-')) && !s.tags.includes('no-cert')));
    expect(subjects.length, 'listSubjects() lists at least one sticky-chrome subject (AppShell/TopBar/Toolbar/TabBar)').toBeGreaterThan(0);
    const before = fails.length;
    for (const s of subjects) {
      for (const width of WIDTHS) await probe(page, s, width, browserName);
    }
    const mine = fails.slice(before);
    expect(mine.map((f) => f.msg), JSON.stringify(byOwner(mine), null, 2)).toEqual([]);
  });
});
