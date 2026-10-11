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
  const seen = new Set<string>();
  for (const c of captures) {
    const k = `${c.cell}\u0000${c.subject}`;
    if (seen.has(k)) throw new Error(`distinctness: subject '${c.subject}' captured twice in cell '${c.cell}'`);
    seen.add(k);
    const list = byCell.get(c.cell);
    if (list) list.push(c); else byCell.set(c.cell, [c]);
  }
  const hashes = new Map<Capture, bigint>(captures.map((c) => [c, dhash(c.image)]));
  const pairs: PairResult[] = [];
  const dupCells = new Map<string, Set<string>>();
  const dupWith = new Map<string, Set<string>>();
  const mark = (s: string, cell: string, other: string) => {
    (dupCells.get(s) ?? dupCells.set(s, new Set()).get(s)!).add(cell);
    (dupWith.get(s) ?? dupWith.set(s, new Set()).get(s)!).add(other);
  };
  for (const [cell, list] of byCell) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const r = comparePair(list[i]!, list[j]!, hashes);
        pairs.push(r);
        if (r.duplicate) { mark(r.a, cell, r.b); mark(r.b, cell, r.a); }
      }
    }
  }
  const cellsOf = new Map<string, number>();
  for (const c of captures) cellsOf.set(c.subject, (cellsOf.get(c.subject) ?? 0) + 1);
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
