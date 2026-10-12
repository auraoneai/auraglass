/* REQ-QUAL-03 Distinctness (QUAL). Captures of different subjects in the same matrix cell are
   `duplicate-visual` when their dHash Hamming distance is ≤ 2 AND their pixelmatch diff ratio is
   < 0.001 (VISUAL_TOLERANCE.changedRatio, pixelmatch threshold/AA per VISUAL_TOLERANCE). A `visual`
   subject that duplicates another subject in ≥ 90 % of the cells it was captured in fails, unless the
   inventory classifies it `alias`. */
import pixelmatch from 'pixelmatch';
import { VISUAL_TOLERANCE } from '../../../../src/contracts/testing.ts';
import type { ExportClass } from '../inventory/buildInventory.ts';
import { dhash, hamming, type RgbaImage } from './dhash.ts';

export const DISTINCTNESS = { maxHamming: 2, maxDiffRatio: VISUAL_TOLERANCE.changedRatio, failShare: 0.9 } as const;

export interface Capture { subject: string; cell: string; image: RgbaImage }

export interface PairResult { a: string; b: string; cell: string; hamming: number; diffRatio: number; duplicate: boolean }

export interface SubjectDistinctness {
  subject: string;
  class: ExportClass | 'unknown';
  cells: number;
  duplicateCells: number;
  share: number;
  duplicates: string[];          // other subjects it duplicated somewhere
  verdict: 'pass' | 'fail';
}

export interface DistinctnessReport { pairs: PairResult[]; subjects: SubjectDistinctness[]; failures: string[] }

export function diffRatio(a: RgbaImage, b: RgbaImage): number {
  if (a.width !== b.width || a.height !== b.height) return 1;
  const diff = pixelmatch(a.data, b.data, undefined, a.width, a.height,
    { threshold: VISUAL_TOLERANCE.pixelmatchThreshold, includeAA: VISUAL_TOLERANCE.includeAA });
  return diff / (a.width * a.height);
}

export function comparePair(a: Capture, b: Capture, hashes = new Map<Capture, bigint>()): PairResult {
  const ha = hashes.get(a) ?? dhash(a.image);
  const hb = hashes.get(b) ?? dhash(b.image);
  const h = hamming(ha, hb);
  // The pixel diff only decides when the hash already says "near-identical".
  const ratio = h <= DISTINCTNESS.maxHamming ? diffRatio(a.image, b.image) : 1;
  return { a: a.subject, b: b.subject, cell: a.cell, hamming: h, diffRatio: ratio,
    duplicate: h <= DISTINCTNESS.maxHamming && ratio < DISTINCTNESS.maxDiffRatio };
}

/** `classOf` is the inventory classification of a subject (REQ-QUAL-02). */
export function checkDistinctness(captures: readonly Capture[], classOf: (subject: string) => ExportClass | undefined): DistinctnessReport {
  const byCell = new Map<string, Capture[]>();
  for (const c of captures) {
    const list = byCell.get(c.cell);
    if (list) list.push(c); else byCell.set(c.cell, [c]);
  }
  return checkDistinctnessByCell(byCell.values(), classOf);
}

/** Same rule over captures supplied one cell at a time (each element: every subject's capture of one cell), so a
    lane's full matrix never has to be decoded into memory at once (REQ-QUAL-03 at L6 scale). */
export function checkDistinctnessByCell(cells: Iterable<readonly Capture[]>, classOf: (subject: string) => ExportClass | undefined): DistinctnessReport {
  const seenCells = new Set<string>();
  const pairs: PairResult[] = [];
  const dupCells = new Map<string, Set<string>>();
  const dupWith = new Map<string, Set<string>>();
  const cellsOf = new Map<string, number>();
  const mark = (s: string, cell: string, other: string) => {
    (dupCells.get(s) ?? dupCells.set(s, new Set()).get(s)!).add(cell);
    (dupWith.get(s) ?? dupWith.set(s, new Set()).get(s)!).add(other);
  };
  for (const list of cells) {
    if (!list.length) continue;
    const cell = list[0]!.cell;
    if (seenCells.has(cell)) throw new Error(`distinctness: cell '${cell}' supplied twice`);
    seenCells.add(cell);
    const subjects = new Set<string>();
    for (const c of list) {
      if (c.cell !== cell) throw new Error(`distinctness: capture of '${c.subject}' in cell '${c.cell}' supplied with cell '${cell}'`);
      if (subjects.has(c.subject)) throw new Error(`distinctness: subject '${c.subject}' captured twice in cell '${cell}'`);
      subjects.add(c.subject);
      cellsOf.set(c.subject, (cellsOf.get(c.subject) ?? 0) + 1);
    }
    if (list.length < 2) continue; // a lone subject in a cell has nothing to duplicate; its image is never read
    const hashes = new Map<Capture, bigint>(list.map((c) => [c, dhash(c.image)]));
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const r = comparePair(list[i]!, list[j]!, hashes);
        pairs.push(r);
        if (r.duplicate) { mark(r.a, cell, r.b); mark(r.b, cell, r.a); }
      }
    }
  }
  const subjects: SubjectDistinctness[] = [];
  const failures: string[] = [];
  for (const [subject, cells] of [...cellsOf].sort((a, b) => a[0].localeCompare(b[0]))) {
    const cls = classOf(subject) ?? 'unknown';
    const duplicateCells = dupCells.get(subject)?.size ?? 0;
    const share = duplicateCells / cells;
    const fails = share >= DISTINCTNESS.failShare && cls === 'visual';
    const duplicates = [...(dupWith.get(subject) ?? [])].sort();
    subjects.push({ subject, class: cls, cells, duplicateCells, share, duplicates, verdict: fails ? 'fail' : 'pass' });
    if (fails) {
      failures.push(`duplicate-visual: '${subject}' (${cls}) duplicates ${duplicates.join(', ')} in ${duplicateCells}/${cells} cells `
        + `(${(share * 100).toFixed(1)} % ≥ ${DISTINCTNESS.failShare * 100} %); classify it alias or make it distinct`);
    }
  }
  return { pairs, subjects, failures };
}
