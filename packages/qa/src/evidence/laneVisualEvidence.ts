/* L6/L7 visual evidence folded by the lane runner (QUAL).

   REQ-QUAL-03 distinctness at L6: certification/lanes/environment-visual.spec.ts keeps every cell's subject capture
   (environment-visual/png/*.png, indexed by captures-*.jsonl `png`). `distinctnessResult` groups the captures by cell
   (scene × engine × axes × state; one capture per subject and cell, the lowest cell id when a subject has several
   stories), runs checkDistinctnessByCell one cell at a time against the source inventory classification (REQ-QUAL-02)
   and returns the L6 result row: `fail` listing every `duplicate-visual` subject, `pending` when the inventory cannot be
   built, `pass` otherwise. The full report is written to environment-visual/distinctness.json.

   REQ-QUAL-73 review inputs: the L6 part (`writeL6ReviewInputs`, environment-visual/review-inputs.json) has, per
   subject-state (or showcase), the 8 scenes × light/dark at 1440 and the 390 `photo` light capture (downscaled from
   DPR 3 to 390 px), all chromium / glass / default / standard, plus the photo-light 1440 capture as `current` with
   `baseline: null`. The L7 part (`writeL7ReviewInputs`, regression/review-inputs.json) has `baseline` + `current`
   from the regression lane's committed-baseline comparison of the same subject-state. scripts/qual/review-record.mjs
   composites merges the parts by item (L7 baseline/current override the L6 fallback). Items missing a scene, scheme
   or the mobile capture are listed under `incomplete` with what is missing, never written as a partial item. */
import { existsSync, globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCENES } from '../../../../src/contracts/testing.ts';
import { axesKey, type Cell } from '../matrix/axes.ts';
import type { ExportClass, InventoryItem } from '../inventory/buildInventory.ts';
import { checkDistinctnessByCell, type Capture, type DistinctnessReport } from '../pixel/duplicates.ts';
import { decodePng, encodePng } from '../pixel/png.ts';
import { MOBILE_WIDTH, REVIEW_INPUTS_FILE, scaleToWidth } from './composite.ts';
import { itemId } from './reviewRecord.ts';

export const L6_DIR = 'environment-visual';
export const L7_DIR = 'regression';
export const DISTINCTNESS_FILE = 'distinctness.json';
export const REVIEW_CELL = { engine: 'chromium', transparency: 'glass', preference: 'default', tier: 'standard' } as const;

export interface CaptureRow { id: string; subject: string; state?: string; kind?: string; cell: Cell; png?: string }

function readJsonl<T>(dir: string, pattern: string): T[] {
  if (!existsSync(dir)) return [];
  return globSync(pattern, { cwd: dir }).sort()
    .flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T));
}

/** L6 capture rows (environment-visual/captures-*.jsonl). */
export const readCaptureRows = (evidenceDir: string): CaptureRow[] => readJsonl<CaptureRow>(join(evidenceDir, L6_DIR), 'captures-*.jsonl');

/** Distinctness cell key: the same point of the matrix for every subject (story id excluded). */
export const distinctnessCell = (r: Pick<CaptureRow, 'cell' | 'state'>): string =>
  `${r.cell.scene}|${r.cell.engine}|${axesKey(r.cell)}|${r.state ?? 'default'}`;

/** Inventory classification of a subject name: the root entry's export wins, else the first entry (sorted). */
export function inventoryClassOf(items: readonly Pick<InventoryItem, 'entry' | 'name' | 'class'>[]): (subject: string) => ExportClass | undefined {
  const by = new Map<string, Pick<InventoryItem, 'entry' | 'name' | 'class'>>();
  for (const i of [...items].sort((a, b) => (a.entry === '.' ? -1 : b.entry === '.' ? 1 : a.entry.localeCompare(b.entry)))) {
    if (!by.has(i.name)) by.set(i.name, i);
  }
  return (subject) => by.get(subject)?.class;
}

export interface DistinctnessRow { state: 'pass' | 'fail' | 'pending'; reason?: string; tests?: number; subjects?: string[] }

/** REQ-QUAL-03 over this lane run's L6 captures; null when the run recorded no capture. `classOf` throws → pending. */
export function distinctnessResult(evidenceDir: string, loadClassOf: () => (subject: string) => ExportClass | undefined): DistinctnessRow | null {
  const rows = readCaptureRows(evidenceDir);
  if (!rows.length) return null;
  const dir = join(evidenceDir, L6_DIR);
  const problems: string[] = [];
  const byCell = new Map<string, Map<string, CaptureRow>>();
  for (const r of [...rows].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!r.png) { problems.push(`${r.id}: capture row has no png`); continue; }
    if (!existsSync(join(dir, r.png))) { problems.push(`${r.id}: ${r.png} missing`); continue; }
    const key = distinctnessCell(r);
    const cell = byCell.get(key) ?? byCell.set(key, new Map()).get(key)!;
    if (!cell.has(r.subject)) cell.set(r.subject, r);
  }
  if (problems.length) return { state: 'fail', reason: `distinctness: ${problems.length} capture(s) without pixels: ${problems.slice(0, 5).join('; ')}` };
  let classOf: (subject: string) => ExportClass | undefined;
  try { classOf = loadClassOf(); } catch (e) {
    return { state: 'pending', reason: `distinctness: export inventory unavailable (REQ-QUAL-02): ${(e as Error).message.split('\n')[0]}` };
  }
  // Captures are decoded lazily, one cell at a time: `image` is read only when the cell has two or more subjects.
  const cells = function* (): Generator<Capture[]> {
    for (const [key, subjects] of byCell) {
      yield [...subjects.values()].map((r) => {
        let image: Capture['image'] | null = null;
        return { subject: r.subject, cell: key, get image() { return (image ??= decodePng(readFileSync(join(dir, r.png!)))); } };
      });
    }
  };
  let report: DistinctnessReport;
  try { report = checkDistinctnessByCell(cells(), classOf); } catch (e) { return { state: 'fail', reason: `distinctness: ${(e as Error).message}` }; }
  const subjects = report.subjects.map((s) => s.subject);
  writeFileSync(join(dir, DISTINCTNESS_FILE), `${JSON.stringify({
    version: 1, cells: byCell.size, subjects: report.subjects, duplicatePairs: report.pairs.filter((p) => p.duplicate), failures: report.failures,
  }, null, 2)}\n`);
  if (report.failures.length) return { state: 'fail', reason: report.failures.join(' | '), tests: subjects.length, subjects };
  return { state: 'pass', tests: subjects.length, subjects };
}

const isReviewCell = (c: Cell) => c.engine === REVIEW_CELL.engine && c.transparency === REVIEW_CELL.transparency
  && c.preference === REVIEW_CELL.preference && c.tier === REVIEW_CELL.tier;

const reviewItemOf = (r: { kind?: string; subject: string; state?: string }): string => (r.kind === 'showcase'
  ? itemId({ kind: 'showcase', subject: r.subject })
  : itemId({ kind: 'subject-state', subject: r.subject, state: r.state ?? 'default' }));

export interface ReviewInputsResult { file: string; items: number; incomplete: Array<{ item: string; missing: string[] }> }

/** L6 part of review-inputs.json; null when the run recorded no capture. */
export function writeL6ReviewInputs(evidenceDir: string, sha: string | null): ReviewInputsResult | null {
  const rows = readCaptureRows(evidenceDir).filter((r) => r.png && isReviewCell(r.cell));
  if (!rows.length) return null;
  const dir = join(evidenceDir, L6_DIR);
  const groups = new Map<string, CaptureRow[]>();
  for (const r of [...rows].sort((a, b) => a.id.localeCompare(b.id))) {
    const item = reviewItemOf(r);
    (groups.get(item) ?? groups.set(item, []).get(item)!).push(r);
  }
  const items: unknown[] = [];
  const incomplete: ReviewInputsResult['incomplete'] = [];
  for (const [item, list] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) {
    const pick = (scene: string, scheme: string, viewport: string) =>
      list.find((r) => r.cell.scene === scene && r.cell.scheme === scheme && r.cell.viewport === viewport)?.png ?? null;
    const missing: string[] = [];
    const scenes: Record<string, { light: string | null; dark: string | null }> = {};
    for (const scene of SCENES) {
      scenes[scene] = { light: pick(scene, 'light', '1440'), dark: pick(scene, 'dark', '1440') };
      for (const scheme of ['light', 'dark'] as const) if (!scenes[scene]![scheme]) missing.push(`${scene}/${scheme} @1440`);
    }
    const mobileSrc = pick('photo', 'light', '390');
    if (!mobileSrc) missing.push('photo/light @390');
    if (missing.length) { incomplete.push({ item, missing }); continue; }
    // the 390 cell is captured at DPR 3; the composite's mobile tile is the 390 CSS-px frame
    const mobile = `review/${item}-mobile.png`;
    mkdirSync(join(dir, 'review'), { recursive: true });
    const src = decodePng(readFileSync(join(dir, mobileSrc!)));
    writeFileSync(join(dir, mobile), encodePng(src.width === MOBILE_WIDTH ? src : scaleToWidth(src, MOBILE_WIDTH)));
    items.push({ item, scenes, mobile, baseline: null, current: scenes.photo!.light });
  }
  const file = join(dir, REVIEW_INPUTS_FILE);
  writeFileSync(file, `${JSON.stringify({ version: 1, sha, lane: 'L6', items, incomplete }, null, 2)}\n`);
  return { file, items: items.length, incomplete };
}

interface ReviewPairRow { id: string; subject: string; state?: string; kind?: string; cell: Cell; current: string; baseline: string | null }

/** L7 part of review-inputs.json (baseline + current per subject-state, photo/light 1440 chromium preferred); null when
    the regression lane kept no review pair. */
export function writeL7ReviewInputs(evidenceDir: string, sha: string | null): ReviewInputsResult | null {
  const dir = join(evidenceDir, L7_DIR);
  const rows = readJsonl<ReviewPairRow>(dir, 'review-*.jsonl').filter((r) => r.cell?.engine === REVIEW_CELL.engine);
  if (!rows.length) return null;
  const rank = (r: ReviewPairRow) => (r.cell.scene === 'photo' ? 0 : 2) + (r.cell.scheme === 'light' ? 0 : 1) + (r.cell.viewport === '1440' ? 0 : 4);
  const best = new Map<string, ReviewPairRow>();
  for (const r of [...rows].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id))) {
    const item = reviewItemOf(r);
    if (!best.has(item)) best.set(item, r);
  }
  const items = [...best].sort((a, b) => a[0].localeCompare(b[0])).map(([item, r]) => ({ item, baseline: r.baseline, current: r.current, cell: r.id }));
  const file = join(dir, REVIEW_INPUTS_FILE);
  writeFileSync(file, `${JSON.stringify({ version: 1, sha, lane: 'L7', items, incomplete: [] }, null, 2)}\n`);
  return { file, items: items.length, incomplete: [] };
}
