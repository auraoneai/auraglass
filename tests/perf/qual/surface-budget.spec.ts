/* tests/perf/qual/surface-budget.spec.ts — REQ-QUAL-38 runtime surface budgets (QUAL, L10; remote only).

   For every subject (flagships at pr scope; every component/scene/showcase subject at main/nightly/release), in this
   project's engine (qual:l10-surface-budget-{chromium,webkit,firefox}), at standard tier over `photo`, with every overlay
   in the story opened (its parameters.ag.states `open`/`press` drive steps, in order) and at 3 scroll positions
   (thresholds.json#perf.surfaceBudget) in 1440×900 and 1920×1080 (pointer:fine budgets) and 390×844 (pointer:coarse):
   packages/qa/src/perf/surfaceBudget.ts checks blurred surfaces, BCI, nesting, blur radius, full-viewport blur, refracting
   surfaces and live WebGL contexts against certification/budgets.json (scripts/qual/perf/resolve-budgets.mjs).
   Per-subject results → $AURAGLASS_EVIDENCE_DIR/qual/<job>/surface-budget-<engine>.json.
   A seed subject (data-ag-seed in the rendered story) is `pending:` before release (lane-runner convention), a failure at
   release. Locally (no AG_REMOTE_RUNNER=1) the file throws the remote-only message. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { ROOT, REMOTE_ONLY_MESSAGE, agPerfInit, loadQaPerf, openStory, readDrive } from '../harness/run-perf.mjs';
import { listSubjects } from '../../helpers/index';
import { budgetFor, parsePerfThresholds, type Pointer, type PerfThresholds } from '../../../packages/qa/src/perf/budgets';
import { evaluateSurfaceCell, type HostFacts } from '../../../packages/qa/src/perf/surfaceBudget';
import type { BlurLayerSnapshot } from '../../../packages/qa/src/perf/bci';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const SCOPE = (process.env.AG_SCOPE ?? 'pr') as 'pr' | 'main' | 'nightly' | 'release';
const BASE = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const EVIDENCE = resolve(ROOT, process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10');
const t: PerfThresholds = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8')));
const PROFILE_OF: Record<Pointer, 'desktop-120hz' | 'mid-mobile'> = { fine: 'desktop-120hz', coarse: 'mid-mobile' };

function loadBudgets() {
  const file = join(ROOT, 'certification/budgets.json');
  if (!existsSync(file)) throw new Error('certification/budgets.json missing: run node scripts/qual/perf/resolve-budgets.mjs before this spec');
  return JSON.parse(readFileSync(file, 'utf8'));
}

/** One story per subject (playground, then states, then the first), skipping lab/matrix framing and no-cert stories. */
async function subjects() {
  const all = await listSubjects(SCOPE === 'pr' ? { tags: ['flagship'] } : {});
  const rank = (id: string) => (id.endsWith('--playground') ? 0 : id.endsWith('--states') ? 1 : 2);
  const by = new Map<string, (typeof all)[number]>();
  for (const s of all) {
    if (s.tags.includes('no-cert') || s.kind === 'lab' || s.kind === 'matrix' || s.id.startsWith('perf-')) continue;
    const cur = by.get(s.subject);
    if (!cur || rank(s.id) < rank(cur.id)) by.set(s.subject, s);
  }
  return [...by.values()].sort((a, b) => a.subject.localeCompare(b.subject));
}

/** Opens every overlay declared by the story's drive steps, in order. A declared target that is missing fails the cell. */
async function openOverlays(page: Page, touch: boolean): Promise<string[]> {
  const opened: string[] = [];
  for (const step of await readDrive(page)) {
    if (step.action !== 'open' && step.action !== 'press') continue;
    const loc = page.locator(`[data-ag-part="${step.target}"]`).first();
    if (!(await loc.count())) throw new Error(`drive step ${step.action} target [data-ag-part="${step.target}"] not found`);
    if (touch) await loc.tap(); else await loc.click();
    await page.waitForTimeout(400);                               // past the overlay transition (≤1 s cap, REQ-QUAL-34)
    opened.push(step.target);
  }
  return opened;
}

/** Scrolls the document (or, when the document does not scroll, its largest scroll container) to `fraction`. */
async function scrollTo(page: Page, fraction: number): Promise<boolean> {
  return page.evaluate((f) => {
    const doc = document.scrollingElement as HTMLElement | null;
    let el: HTMLElement | null = doc && doc.scrollHeight > doc.clientHeight + 1 ? doc : null;
    if (!el) {
      let best = 0;
      for (const n of Array.from(document.querySelectorAll<HTMLElement>('*'))) {
        const oy = getComputedStyle(n).overflowY;
        const extra = n.scrollHeight - n.clientHeight;
        if ((oy === 'auto' || oy === 'scroll') && extra > 1 && n.clientHeight * n.clientWidth > best) { best = n.clientHeight * n.clientWidth; el = n; }
      }
    }
    if (!el) return false;
    el.scrollTop = Math.round((el.scrollHeight - el.clientHeight) * f);
    return true;
  }, fraction);
}

async function cell(page: Page, pointer: Pointer, ids: string[], budgets: ReturnType<typeof loadBudgets>) {
  const qa = await loadQaPerf();
  await page.waitForTimeout(150);
  const snapshot = (await page.evaluate(qa.collectBlurLayers as () => BlurLayerSnapshot)) as BlurLayerSnapshot;
  const hostIdx: number[] = [...new Set(snapshot.layers.map((l) => l.host))];
  const hosts: HostFacts[] = await page.evaluate((idx: number[]) => {
    const all = document.querySelectorAll('*');
    return idx.map((host) => {
      const el = all[host] as Element | undefined;
      return { host, scrim: !!el?.closest('[data-ag-layer="scrim"]'), allowNested: !!el?.closest('[data-ag-allow-nested]') };
    });
  }, hostIdx);
  const liveWebglContexts = await page.evaluate(() => (window as unknown as { __agPerf: { webgl: Array<{ canvas: HTMLCanvasElement; ctx: WebGLRenderingContext }> } })
    .__agPerf.webgl.filter((x) => x.canvas.isConnected && !x.ctx.isContextLost()).length);
  const profile = PROFILE_OF[pointer];
  const lim = { blurredSurfaces: Number(budgetFor(budgets, ids, profile, 'blurred-surfaces')), bci: Number(budgetFor(budgets, ids, profile, 'bci')) };
  return { limits: lim, ...evaluateSurfaceCell({ pointer, snapshot, hosts, liveWebglContexts }, lim, t) };
}

test('surface budgets: every subject × 3 viewports × 3 scroll positions, overlays open', async ({ browser, browserName }) => {
  test.setTimeout(4 * 60 * 60 * 1000);
  const budgets = loadBudgets();
  const list = await subjects();
  expect(list.length, 'subject index (storybook-static/cert-manifest.json) lists no subject').toBeGreaterThan(0);
  const rows: Array<Record<string, unknown>> = [];
  const failures: string[] = []; const seeds: string[] = [];
  for (const s of list) {
    await test.step(s.subject, async () => {
      for (const vp of t.surfaceBudget.viewports) {
        const coarse = vp.pointer === 'coarse';
        const ctx = await (browser as Browser).newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: coarse,
          isMobile: coarse && browserName === 'chromium', reducedMotion: 'no-preference' });
        const page = await ctx.newPage();
        try {
          await page.addInitScript(agPerfInit);
          await openStory(page, BASE, s.id, { scene: 'photo', tier: 'standard' });
          if (await page.locator('[data-ag-seed]').count()) { seeds.push(s.subject); return; }
          const opened = await openOverlays(page, coarse);
          for (const pos of t.surfaceBudget.scrollPositions) {
            const scrolled = await scrollTo(page, pos);
            const r = await cell(page, vp.pointer, [s.id, s.subject], budgets);
            rows.push({ subject: s.subject, storyId: s.id, owner: s.owner, engine: browserName, viewport: `${vp.width}x${vp.height}`, pointer: vp.pointer,
              scroll: pos, scrolled, opened, ...r });
            for (const v of r.violations) failures.push(`${s.subject} (${s.id}) ${browserName} ${vp.width}x${vp.height} scroll ${pos}: ${v}`);
          }
        } catch (e) {
          failures.push(`${s.subject} (${s.id}) ${browserName} ${vp.width}x${vp.height}: ${String((e as Error)?.message ?? e).split('\n')[0]}`);
        } finally { await ctx.close(); }
      }
    });
  }
  mkdirSync(EVIDENCE, { recursive: true });
  writeFileSync(join(EVIDENCE, `surface-budget-${browserName}.json`), `${JSON.stringify({ version: 1, scope: SCOPE, engine: browserName,
    subjects: list.length, seeds: [...new Set(seeds)], failures, rows }, null, 2)}\n`);
  expect(failures, failures.slice(0, 40).join('\n')).toEqual([]);
  if (seeds.length) {
    const msg = `${new Set(seeds).size} seed subject(s) not measured: ${[...new Set(seeds)].slice(0, 20).join(', ')}`;
    if (SCOPE === 'release') throw new Error(`release scope: ${msg}`);
    throw new Error(`pending: ${msg} (producers: CMP/SURF/MAT seed replacement)`);
  }
});
