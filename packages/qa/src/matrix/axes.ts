/* REQ-QUAL-12 (QUAL, FIN-429). Environment-matrix axes (PRD-QUAL §4.3, architecture §15.1) and the cell id.
   A cell is one point in engine × scene × scheme × transparency × preference × tier × viewport. The cell id is
   `<storyId>|<scene>|<engine>|<axes>` (S-55 VisualClassReport.cells[].cell); `<axes>` is
   `<scheme>.<transparency>.<preference>.<tier>.<viewport>`, with `.state-<name>` appended for a driven state. */
import { SCENES, type SceneId } from '../../../../src/contracts/testing';

/** Playwright engine names (contract `Engine` calls Firefox `gecko`; the matrix uses the browser project names). */
export const ENGINES = ['chromium', 'webkit', 'firefox'] as const;
export type MatrixEngine = (typeof ENGINES)[number];
export { SCENES };
export type { SceneId };
export const SCHEMES = ['light', 'dark'] as const;
export type MatrixScheme = (typeof SCHEMES)[number];
export const TRANSPARENCIES = ['glass', 'tinted', 'solid'] as const;
export type MatrixTransparency = (typeof TRANSPARENCIES)[number];
export const PREFERENCES = ['default', 'contrast-more', 'forced-colors', 'reduced-motion'] as const;
export type MatrixPreference = (typeof PREFERENCES)[number];
export const TIERS = ['lightweight', 'standard', 'enhanced'] as const;
export type MatrixTier = (typeof TIERS)[number];

export interface ViewportSpec { width: number; height: number; deviceScaleFactor: number; touch: boolean }
/** Desktop 1440×900 DPR 1; mobile 390×844 DPR 3 with touch. DPR is always set explicitly (REQ-QUAL-12). */
export const VIEWPORTS = {
  '1440': { width: 1440, height: 900, deviceScaleFactor: 1, touch: false },
  '390': { width: 390, height: 844, deviceScaleFactor: 3, touch: true },
} as const satisfies Record<string, ViewportSpec>;
export type ViewportId = keyof typeof VIEWPORTS;
export const VIEWPORT_IDS = Object.keys(VIEWPORTS) as ViewportId[];

export interface Cell {
  engine: MatrixEngine;
  scene: SceneId;
  scheme: MatrixScheme;
  transparency: MatrixTransparency;
  preference: MatrixPreference;
  tier: MatrixTier;
  viewport: ViewportId;
}

/** The default point of every non-engine/scene axis (the "core" cell). */
export const DEFAULTS = { transparency: 'glass', preference: 'default', tier: 'standard' } as const;

/** The default subject-state: the story as rendered, no driven input. */
export const BASE_STATE = 'default';

const STATE_RE = /^[a-z0-9][a-z0-9-]*$/;

export function axesKey(cell: Cell): string {
  return [cell.scheme, cell.transparency, cell.preference, cell.tier, cell.viewport].join('.');
}

export function cellId(storyId: string, cell: Cell, state: string = BASE_STATE): string {
  if (!storyId || storyId.includes('|')) throw new Error(`cell-id: invalid story id '${storyId}'`);
  if (!STATE_RE.test(state)) throw new Error(`cell-id: state '${state}' must be kebab-case`);
  const axes = state === BASE_STATE ? axesKey(cell) : `${axesKey(cell)}.state-${state}`;
  return `${storyId}|${cell.scene}|${cell.engine}|${axes}`;
}

function member<T extends string>(list: readonly T[], v: string | undefined, axis: string, id: string): T {
  if (v === undefined || !(list as readonly string[]).includes(v)) throw new Error(`cell-id: '${id}' has invalid ${axis} '${v}'`);
  return v as T;
}

/** Inverse of cellId; throws on any malformed or unknown axis value. */
export function parseCellId(id: string): { storyId: string; cell: Cell; state: string } {
  const parts = id.split('|');
  if (parts.length !== 4) throw new Error(`cell-id: '${id}' must have 4 '|'-separated parts`);
  const [storyId, scene, engine, axes] = parts as [string, string, string, string];
  const a = axes.split('.');
  if (a.length !== 5 && a.length !== 6) throw new Error(`cell-id: '${id}' axes must have 5 parts (+ optional state)`);
  let state: string = BASE_STATE;
  if (a.length === 6) {
    const m = /^state-(.+)$/.exec(a[5]!);
    if (!m || !STATE_RE.test(m[1]!)) throw new Error(`cell-id: '${id}' has malformed state '${a[5]}'`);
    state = m[1]!;
  }
  const cell: Cell = {
    engine: member(ENGINES, engine, 'engine', id),
    scene: member(SCENES, scene, 'scene', id),
    scheme: member(SCHEMES, a[0], 'scheme', id),
    transparency: member(TRANSPARENCIES, a[1], 'transparency', id),
    preference: member(PREFERENCES, a[2], 'preference', id),
    tier: member(TIERS, a[3], 'tier', id),
    viewport: member(VIEWPORT_IDS, a[4], 'viewport', id),
  };
  return { storyId, cell, state };
}

/** Cartesian product of explicit axis lists, in a stable order. */
export function product(axes: {
  engines: readonly MatrixEngine[]; scenes: readonly SceneId[]; schemes: readonly MatrixScheme[];
  transparencies: readonly MatrixTransparency[]; preferences: readonly MatrixPreference[]; tiers: readonly MatrixTier[];
  viewports: readonly ViewportId[];
}): Cell[] {
  const out: Cell[] = [];
  for (const engine of axes.engines) for (const scene of axes.scenes) for (const scheme of axes.schemes)
    for (const transparency of axes.transparencies) for (const preference of axes.preferences)
      for (const tier of axes.tiers) for (const viewport of axes.viewports)
        out.push({ engine, scene, scheme, transparency, preference, tier, viewport });
  return out;
}
