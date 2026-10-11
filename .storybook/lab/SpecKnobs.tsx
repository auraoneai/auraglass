/* REQ-QUAL-54 (REQ-FIN-106, FIN-451): Material Lab spec knobs.

   Spec knobs write ONLY private overrides (`--_ag-*`) as inline style on the Lab subject that carries
   `[data-ag-lab-override]`, and only from `.storybook/lab/**` (lint-stories allows `--_ag-*` here and nowhere else).
   The private names are not invented here: they come from the frozen Lab spec-knob seam CC-Q2 (`LAB_SPEC_VARS`, an
   additive export of `src/contracts/tokens.ts`). Until that export exists the panel renders "pending seam", writes
   nothing and exports nothing; the public knobs and discrete axes keep working (PRD-QUAL CC-Q2 fallback).

   Consumed seam shape (proposed to the contract PR with CC-Q2):
     LAB_SPEC_VARS: Record<SpecKnobId, { privateVar: `--_ag-${string}`; token: string /* DTCG path *\/; cssVar: `--ag-${string}` }> */
import * as React from 'react';
import * as tokenContract from '../../src/contracts/tokens';
import type { TokenManifestEntry } from '../../src/contracts/tokens';

export const SPEC_KNOBS = [
  { id: 'blurThin', label: 'Blur (thin)', min: 0, max: 32, step: 1, unit: 'px' },
  { id: 'blurRegular', label: 'Blur (regular)', min: 0, max: 32, step: 1, unit: 'px' },
  { id: 'blurThick', label: 'Blur (thick)', min: 0, max: 32, step: 1, unit: 'px' },
  { id: 'saturation', label: 'Saturation', min: 1, max: 2, step: 0.05, unit: '' },
  { id: 'brightness', label: 'Brightness', min: 0.9, max: 1.2, step: 0.01, unit: '' },
  { id: 'tintFloor', label: 'Tint floor', min: 0, max: 1, step: 0.01, unit: '' },
  { id: 'grain', label: 'Grain', min: 0, max: 0.06, step: 0.005, unit: '' },
  { id: 'bezel', label: 'Bezel', min: 8, max: 32, step: 1, unit: 'px' },
  { id: 'refractionScale', label: 'Refraction scale', min: 0, max: 1, step: 0.05, unit: '' },
  { id: 'rim', label: 'Rim', min: 0.5, max: 2, step: 0.1, unit: 'px' },
] as const;
export type SpecKnob = (typeof SPEC_KNOBS)[number];
export type SpecKnobId = SpecKnob['id'];
export interface SpecVar { privateVar: `--_ag-${string}`; token: string; cssVar: `--ag-${string}` }
export type LabSpecSeam = Record<SpecKnobId, SpecVar>;
export type SpecValues = Partial<Record<SpecKnobId, number>>;

/** Name of the CC-Q2 export. Read through a computed key so bundlers keep the lookup dynamic until it lands. */
const SEAM_EXPORT = 'LAB_SPEC_VARS';

/** Validates a candidate seam; returns the problems (empty = usable). */
export function seamProblems(seam: unknown): string[] {
  if (!seam || typeof seam !== 'object') return ['LAB_SPEC_VARS is not an object'];
  const rec = seam as Record<string, unknown>;
  const out: string[] = [];
  for (const k of SPEC_KNOBS) {
    const v = rec[k.id] as Partial<SpecVar> | undefined;
    if (!v || typeof v !== 'object') { out.push(`${k.id}: missing`); continue; }
    if (typeof v.privateVar !== 'string' || !v.privateVar.startsWith('--_ag-')) out.push(`${k.id}.privateVar must start with --_ag-`);
    if (typeof v.token !== 'string' || !/^[a-z][\w-]*(\.[\w-]+)+$/i.test(v.token)) out.push(`${k.id}.token must be a DTCG path`);
    if (typeof v.cssVar !== 'string' || !v.cssVar.startsWith('--ag-')) out.push(`${k.id}.cssVar must start with --ag-`);
  }
  return out;
}

/** The frozen seam when it exists and is well-formed, else null ("pending seam"). */
export function labSpecSeam(contract: Record<string, unknown> = tokenContract as unknown as Record<string, unknown>): LabSpecSeam | null {
  const seam = contract[SEAM_EXPORT];
  return seam !== undefined && seamProblems(seam).length === 0 ? (seam as LabSpecSeam) : null;
}

const format = (k: SpecKnob, v: number): string => `${Number(v.toFixed(4))}${k.unit}`;
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-6;

/** Compiled defaults read from the subject before any override (NaN when the var does not resolve). */
export function readDefaults(el: HTMLElement, seam: LabSpecSeam): Record<SpecKnobId, number> {
  const cs = getComputedStyle(el);
  return Object.fromEntries(SPEC_KNOBS.map((k) => [k.id, Number.parseFloat(cs.getPropertyValue(seam[k.id].privateVar))])) as Record<SpecKnobId, number>;
}

/** Knobs whose value differs from the compiled default. */
export function deviations(values: SpecValues, defaults: Partial<Record<SpecKnobId, number>>): SpecKnobId[] {
  return SPEC_KNOBS.filter((k) => values[k.id] !== undefined && !(defaults[k.id] !== undefined && near(values[k.id]!, defaults[k.id]!))).map((k) => k.id);
}

/** Writes the overrides as inline private vars on the override element; removes every other inline `--_ag-*`. */
export function applyOverrides(el: HTMLElement, values: SpecValues, seam: LabSpecSeam | null): void {
  const keep = new Set<string>();
  if (seam) {
    for (const k of SPEC_KNOBS) {
      const v = values[k.id];
      if (v === undefined) continue;
      el.style.setProperty(seam[k.id].privateVar, format(k, v));
      keep.add(seam[k.id].privateVar);
    }
  }
  for (const p of Array.from(el.style)) if (p.startsWith('--_ag-') && !keep.has(p)) el.style.removeProperty(p);
}

/** "Reset to shipped": removes every inline `--_ag-*` from the element. */
export function resetOverrides(el: HTMLElement): void {
  for (const p of Array.from(el.style)) if (p.startsWith('--_ag-')) el.style.removeProperty(p);
}

const MANIFEST_TYPES: ReadonlyArray<TokenManifestEntry['type']> = ['color', 'dimension', 'number', 'duration', 'cubicBezier',
  'motion-spring', 'shadow', 'glass-material', 'fontFamily', 'fontWeight'];
const MANIFEST_TIERS: ReadonlyArray<TokenManifestEntry['tier']> = ['sys', 'material', 'comp'];
const MANIFEST_MODES = ['light', 'dark', 'more', 'tinted', 'solid', 'compact', 'spacious'];

/** Runtime check of one entry against the S-11 TokenManifestEntry shape, plus `type: 'glass-material'`. */
export function manifestEntryProblems(e: unknown): string[] {
  const out: string[] = [];
  const r = (e ?? {}) as Record<string, unknown>;
  const keys = Object.keys(r).sort().join(',');
  if (keys !== 'cssVar,modes,name,tier,type,value') out.push(`keys must be exactly name,cssVar,type,tier,modes,value (got ${keys})`);
  if (typeof r.name !== 'string' || !/^[a-z][\w-]*(\.[\w-]+)+$/i.test(r.name)) out.push('name must be a DTCG path');
  if (typeof r.cssVar !== 'string' || !r.cssVar.startsWith('--ag-')) out.push('cssVar must start with --ag-');
  if (!MANIFEST_TYPES.includes(r.type as TokenManifestEntry['type'])) out.push('type is not a TokenManifestEntry type');
  if (r.type !== 'glass-material') out.push('type must be glass-material');
  if (!MANIFEST_TIERS.includes(r.tier as TokenManifestEntry['tier'])) out.push('tier must be sys|material|comp');
  if (!r.modes || typeof r.modes !== 'object' || Array.isArray(r.modes)
    || Object.entries(r.modes as object).some(([m, v]) => !MANIFEST_MODES.includes(m) || typeof v !== 'string')) out.push('modes must map known modes to strings');
  if (typeof r.value !== 'string' || r.value === '') out.push('value must be a non-empty string');
  return out;
}

/** "Export MaterialSpec patch": one glass-material entry per deviating knob, each validated. Null when pending. */
export function exportPatch(values: SpecValues, defaults: Partial<Record<SpecKnobId, number>>, seam: LabSpecSeam | null): TokenManifestEntry[] | null {
  if (!seam) return null;
  const entries = deviations(values, defaults).map((id) => {
    const k = SPEC_KNOBS.find((x) => x.id === id)!;
    return { name: seam[id].token, cssVar: seam[id].cssVar, type: 'glass-material', tier: 'material', modes: {}, value: format(k, values[id]!) } satisfies TokenManifestEntry;
  });
  for (const e of entries) {
    const problems = manifestEntryProblems(e);
    if (problems.length) throw new Error(`Export MaterialSpec patch: ${e.name}: ${problems.join('; ')}`);
  }
  return entries;
}

export interface SpecKnobsProps {
  seam: LabSpecSeam | null;
  values: SpecValues;
  defaults: Partial<Record<SpecKnobId, number>>;
  onChange: (id: SpecKnobId, value: number) => void;
}

/** The spec-knob panel. Pending seam → a note, no inputs. */
export function SpecKnobs({ seam, values, defaults, onChange }: SpecKnobsProps): React.ReactElement {
  if (!seam) {
    return (
      <fieldset data-ag-part="lab-spec-knobs">
        <legend>Spec knobs</legend>
        <p role="note">pending seam: the Lab spec-knob variables (contract CC-Q2, LAB_SPEC_VARS) have not landed, so spec knobs write and export nothing.</p>
      </fieldset>
    );
  }
  return (
    <fieldset data-ag-part="lab-spec-knobs">
      <legend>Spec knobs (private overrides, not shipped)</legend>
      {SPEC_KNOBS.map((k) => {
        const def = defaults[k.id];
        const value = values[k.id] ?? def;
        const resolved = value !== undefined && Number.isFinite(value);
        return (
          <label key={k.id} style={{ display: 'grid', gridTemplateColumns: '10rem 1fr 4rem', gap: 8, alignItems: 'center' }}>
            {k.label}
            <input type="range" min={k.min} max={k.max} step={k.step} disabled={!resolved}
              value={resolved ? value : k.min} aria-valuenow={resolved ? value : undefined}
              aria-valuetext={resolved ? format(k, value) : 'compiled default unresolved'}
              onChange={(e) => onChange(k.id, Number(e.currentTarget.value))} />
            <output>{resolved ? format(k, value) : 'unresolved'}</output>
          </label>
        );
      })}
    </fieldset>
  );
}
