/* REQ-QUAL-26 (QUAL, FIN-433). S-55 VisualClassReport: one row per default-preference cell at 1440×900 and 390×844,
   element-cropped captures of the merge-base and head Storybooks compared with pixelmatch at VISUAL_TOLERANCE
   (threshold 0.1, includeAA false; changed when changedRatio > 0.001). QUAL writes `.artifacts/qual/visual-class.json`
   (REPORTS.visualClass) from qual:certify:l7; PLAT's plat:gate:change-class reads it and decides the class — QUAL never does. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import pixelmatch from 'pixelmatch';
import { REPORTS, VISUAL_TOLERANCE, type VisualClassReport } from '../../../../src/contracts/testing';
import { ENGINES, parseCellId, SCENES } from '../matrix/axes';
import { decodePng, type RgbaImage } from '../pixel/png';

export type VisualClassCell = VisualClassReport['cells'][number];

/** Viewports of the visual-class rows (REQ-QUAL-26). */
export const VISUAL_CLASS_VIEWPORTS = ['1440', '390'] as const;

const SHA_RE = /^[0-9a-f]{40}$/;

/** True for a default-preference cell (glass / default / standard) at a visual-class viewport. */
export function isVisualClassCell(id: string): boolean {
  const { cell } = parseCellId(id);
  return cell.transparency === 'glass' && cell.preference === 'default' && cell.tier === 'standard'
    && (VISUAL_CLASS_VIEWPORTS as readonly string[]).includes(cell.viewport);
}

export interface Comparison { changedRatio: number; changed: boolean; diffPixels: number; reason?: string; diff?: RgbaImage }

/** pixelmatch of two RGBA captures at VISUAL_TOLERANCE. A size change is a full change (ratio 1) with the reason. */
export function compareRgba(base: RgbaImage, head: RgbaImage, opts: { diff?: boolean } = {}): Comparison {
  if (base.width !== head.width || base.height !== head.height) {
    return { changedRatio: 1, changed: true, diffPixels: head.width * head.height, reason: `size-changed ${base.width}x${base.height}→${head.width}x${head.height}` };
  }
  const pixels = base.width * base.height;
  if (!pixels) throw new Error('visual-class: empty capture');
  const out = opts.diff ? new Uint8ClampedArray(pixels * 4) : undefined;
  const diffPixels = pixelmatch(base.data, head.data, out, base.width, base.height,
    { threshold: VISUAL_TOLERANCE.pixelmatchThreshold, includeAA: VISUAL_TOLERANCE.includeAA });
  const changedRatio = diffPixels / pixels;
  return { changedRatio, changed: changedRatio > VISUAL_TOLERANCE.changedRatio, diffPixels, ...(out ? { diff: { width: base.width, height: base.height, data: out } } : {}) };
}

export function comparePngs(basePng: Uint8Array, headPng: Uint8Array, opts: { diff?: boolean } = {}): Comparison {
  return compareRgba(decodePng(basePng), decodePng(headPng), opts);
}

/** Row for a cell whose story does not exist in the merge-base build: a full visual change. */
export function absentAtBase(cell: string): VisualClassCell {
  return { cell, changedRatio: 1, changed: true, reason: 'absent-at-base' };
}

export function cellRow(cell: string, c: Comparison): VisualClassCell {
  return { cell, changedRatio: c.changedRatio, changed: c.changed, ...(c.reason ? { reason: c.reason } : {}) };
}

export function buildVisualClassReport(input: { sha: string; base: string; cells: readonly VisualClassCell[] }): VisualClassReport {
  const seen = new Set<string>();
  for (const c of input.cells) {
    if (seen.has(c.cell)) throw new Error(`visual-class: duplicate cell ${c.cell}`);
    seen.add(c.cell);
  }
  const cells = input.cells.slice().sort((a, b) => a.cell.localeCompare(b.cell));
  const report: VisualClassReport = { version: 1, sha: input.sha, base: input.base, cells, changedCount: cells.filter((c) => c.changed).length };
  const errors = validateVisualClassReport(report);
  if (errors.length) throw new Error(`visual-class: invalid report:\n${errors.join('\n')}`);
  return report;
}

/** Structural + semantic check against the S-55 VisualClassReport type. */
export function validateVisualClassReport(value: unknown): string[] {
  const errors: string[] = [];
  const r = value as Partial<VisualClassReport> | null;
  if (!r || typeof r !== 'object' || Array.isArray(r)) return ['$: not an object'];
  const allowed = new Set(['version', 'sha', 'base', 'cells', 'changedCount']);
  for (const k of Object.keys(r)) if (!allowed.has(k)) errors.push(`$.${k}: unknown key`);
  if (r.version !== 1) errors.push(`$.version: ${JSON.stringify(r.version)} ≠ 1`);
  if (typeof r.sha !== 'string' || !SHA_RE.test(r.sha)) errors.push(`$.sha: not a 40-hex commit sha`);
  if (typeof r.base !== 'string' || !SHA_RE.test(r.base)) errors.push(`$.base: not a 40-hex commit sha`);
  if (!Array.isArray(r.cells)) errors.push('$.cells: not an array');
  else {
    r.cells.forEach((c, i) => {
      const p = `$.cells[${i}]`;
      if (!c || typeof c !== 'object') { errors.push(`${p}: not an object`); return; }
      for (const k of Object.keys(c)) if (!['cell', 'changedRatio', 'changed', 'reason'].includes(k)) errors.push(`${p}.${k}: unknown key`);
      if (typeof c.cell !== 'string') errors.push(`${p}.cell: not a string`);
      // S-55 fixes only `<storyId>|<scene>|<engine>|<axes>`; the axes encoding is QUAL's (matrix/axes.ts), so the
      // contract check is the four-part shape with a known scene and engine.
      else {
        const parts = c.cell.split('|');
        if (parts.length !== 4 || parts.some((s) => !s)) errors.push(`${p}.cell: '${c.cell}' is not <storyId>|<scene>|<engine>|<axes>`);
        else {
          if (!(SCENES as readonly string[]).includes(parts[1]!)) errors.push(`${p}.cell: unknown scene '${parts[1]}'`);
          if (!(ENGINES as readonly string[]).includes(parts[2]!)) errors.push(`${p}.cell: unknown engine '${parts[2]}'`);
        }
      }
      if (typeof c.changedRatio !== 'number' || !(c.changedRatio >= 0 && c.changedRatio <= 1)) errors.push(`${p}.changedRatio: not a number in [0, 1]`);
      if (typeof c.changed !== 'boolean') errors.push(`${p}.changed: not a boolean`);
      else if (typeof c.changedRatio === 'number' && c.changed !== (c.changedRatio > VISUAL_TOLERANCE.changedRatio)) {
        errors.push(`${p}.changed: ${c.changed} disagrees with changedRatio ${c.changedRatio} (changed ⇔ ratio > ${VISUAL_TOLERANCE.changedRatio})`);
      }
      if (c.reason !== undefined && typeof c.reason !== 'string') errors.push(`${p}.reason: not a string`);
    });
    if (typeof r.changedCount !== 'number' || r.changedCount !== r.cells.filter((c) => c?.changed === true).length) {
      errors.push(`$.changedCount: ${JSON.stringify(r.changedCount)} ≠ number of changed cells`);
    }
  }
  return errors;
}

/** Writes REPORTS.visualClass under `root` (the repository / job working directory). Returns the absolute path. */
export function writeVisualClassReport(root: string, report: VisualClassReport): string {
  const errors = validateVisualClassReport(report);
  if (errors.length) throw new Error(`visual-class: refusing to write an invalid report:\n${errors.join('\n')}`);
  const file = join(root, REPORTS.visualClass);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  return file;
}
