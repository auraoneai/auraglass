/* REQ-QUAL-54 (REQ-FIN-106, FIN-451): Material Lab controls.

   - Discrete axes are public `Surface` props (S-05): variant, thickness, layer, content, shape, interactive, prominent,
     refraction. Tier and transparency are preference axes (S-21/S-22): the Lab scopes them with a nested
     `AuraGlassProvider` on the Lab subtree ("inherit" keeps the toolbar global).
   - Public knobs `--ag-light-angle` (0–360deg), `--ag-specular` (0–1), `--ag-glass-opacity` (0–1) are written by
     `style` on the Lab subtree only while they differ from the shipped value (S-03).
   - Spec knobs (SpecKnobs.tsx) write private overrides on the `[data-ag-lab-override]` subject.
   - "Spec deviation — not shipped" shows while any spec knob differs from its compiled default; "Reset to shipped"
     restores every axis and knob and removes every inline `--_ag-*`; "Export MaterialSpec patch" emits validated
     TokenManifestEntry JSON (nothing while the CC-Q2 seam is pending).
   The panel itself is plain form controls: no library component, no background or ink on any ancestor of the subject. */
import * as React from 'react';
import { Surface } from '../../src/material';
import type { ContentMaterial, DomTier, Layer, MaterialVariant, Shape, Thickness, Transparency } from '../../src/material';
import { AuraGlassProvider } from '../../src/theme';
import { applyOverrides, deviations, exportPatch, labSpecSeam, readDefaults, resetOverrides, SpecKnobs } from './SpecKnobs';
import type { LabSpecSeam, SpecKnobId, SpecValues } from './SpecKnobs';

export const PUBLIC_KNOBS = [
  // `fallback` = the registered @property initial-value (src/material/css/generated/properties.css), used only when the
  // engine does not resolve the property (jsdom); in Storybook the shipped value is read from the computed style.
  { id: 'lightAngle', cssVar: '--ag-light-angle', label: 'Light angle', min: 0, max: 360, step: 1, unit: 'deg', fallback: 300 },
  { id: 'specular', cssVar: '--ag-specular', label: 'Specular', min: 0, max: 1, step: 0.01, unit: '', fallback: 0.5 },
  { id: 'glassOpacity', cssVar: '--ag-glass-opacity', label: 'Glass opacity', min: 0, max: 1, step: 0.01, unit: '', fallback: 0 },
] as const;
export type PublicKnobId = (typeof PUBLIC_KNOBS)[number]['id'];

export interface LabAxes {
  variant: MaterialVariant; thickness: Thickness; layer: Layer; content: ContentMaterial; shape: Shape;
  interactive: boolean; prominent: boolean; refraction: boolean;
  tier: 'inherit' | DomTier; transparency: 'inherit' | Transparency;
}
export interface LabState { axes: LabAxes; knobs: Partial<Record<PublicKnobId, number>>; spec: SpecValues }

export const SHIPPED_AXES: LabAxes = {
  variant: 'regular', thickness: 'regular', layer: 'chrome', content: 'content-raised', shape: 'fixed',
  interactive: false, prominent: false, refraction: false, tier: 'inherit', transparency: 'inherit',
};

type Action =
  | { type: 'axis'; key: keyof LabAxes; value: LabAxes[keyof LabAxes] }
  | { type: 'knob'; id: PublicKnobId; value: number | undefined }
  | { type: 'spec'; id: SpecKnobId; value: number }
  | { type: 'reset'; axes: LabAxes };

function reducer(s: LabState, a: Action): LabState {
  switch (a.type) {
    case 'axis': return { ...s, axes: { ...s.axes, [a.key]: a.value } };
    case 'knob': {
      const knobs = { ...s.knobs };
      if (a.value === undefined) delete knobs[a.id]; else knobs[a.id] = a.value;
      return { ...s, knobs };
    }
    case 'spec': return { ...s, spec: { ...s.spec, [a.id]: a.value } };
    case 'reset': return { axes: a.axes, knobs: {}, spec: {} };
  }
}

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export interface UseLab {
  state: LabState; dispatch: React.Dispatch<Action>; initial: LabAxes; seam: LabSpecSeam | null;
  subtreeRef: React.RefObject<HTMLDivElement | null>; subjectRef: React.RefObject<HTMLElement | null>;
  shipped: Record<PublicKnobId, number>; specDefaults: Partial<Record<SpecKnobId, number>>;
}

/** Lab state for one subject. `seam` defaults to the frozen CC-Q2 export (null = pending). */
export function useLab(initial: Partial<LabAxes> = {}, seam: LabSpecSeam | null = labSpecSeam()): UseLab {
  const axes = React.useMemo(() => ({ ...SHIPPED_AXES, ...initial }), [JSON.stringify(initial)]); // eslint-disable-line react-hooks/exhaustive-deps
  const [state, dispatch] = React.useReducer(reducer, { axes, knobs: {}, spec: {} });
  const subtreeRef = React.useRef<HTMLDivElement | null>(null);
  const subjectRef = React.useRef<HTMLElement | null>(null);
  const [shipped, setShipped] = React.useState<Record<PublicKnobId, number>>(
    () => Object.fromEntries(PUBLIC_KNOBS.map((k) => [k.id, k.fallback])) as Record<PublicKnobId, number>);
  const [specDefaults, setSpecDefaults] = React.useState<Partial<Record<SpecKnobId, number>>>({});
  // Shipped values are read once, before the Lab writes anything.
  useIsoLayoutEffect(() => {
    const el = subtreeRef.current;
    if (el) {
      const cs = getComputedStyle(el);
      setShipped(Object.fromEntries(PUBLIC_KNOBS.map((k) => {
        const v = Number.parseFloat(cs.getPropertyValue(k.cssVar));
        return [k.id, Number.isFinite(v) ? v : k.fallback];
      })) as Record<PublicKnobId, number>);
    }
    if (seam && subjectRef.current) setSpecDefaults(readDefaults(subjectRef.current, seam));
  }, [seam]);
  // Spec overrides live only as inline private vars on the override element.
  useIsoLayoutEffect(() => {
    if (subjectRef.current) applyOverrides(subjectRef.current, state.spec, seam);
  }, [state.spec, seam]);
  return { state, dispatch, initial: axes, seam, subtreeRef, subjectRef, shipped, specDefaults };
}

/** Inline style for the Lab subtree: only knobs that differ from the shipped value. */
export function subtreeStyle(knobs: LabState['knobs']): React.CSSProperties {
  const style: Record<string, string> = {};
  for (const k of PUBLIC_KNOBS) {
    const v = knobs[k.id];
    if (v !== undefined) style[k.cssVar] = `${v}${k.unit}`;
  }
  return style as React.CSSProperties;
}

/** The Lab subject: subtree (public knobs) → optional scoped provider (tier/transparency) → Surface with the axes. */
export function LabSubject({ lab, children, minSize = true }: { lab: UseLab; children: React.ReactNode; minSize?: boolean }): React.ReactElement {
  const { axes } = lab.state;
  const surface = (
    <Surface ref={lab.subjectRef} data-ag-lab-override="" layer={axes.layer} thickness={axes.thickness} shape={axes.shape}
      {...(axes.layer === 'content' ? { content: axes.content } : { variant: axes.variant })}
      {...(axes.interactive ? { interactive: true } : {})} {...(axes.prominent ? { prominent: true } : {})}
      {...(axes.refraction ? { refraction: true } : {})}
      style={{ padding: 24, ...(minSize ? { minInlineSize: 360, minBlockSize: 240 } : {}), boxSizing: 'border-box' }}>
      {children}
    </Surface>
  );
  const scoped = axes.tier === 'inherit' && axes.transparency === 'inherit' ? surface : (
    <AuraGlassProvider storage={null} {...(axes.tier === 'inherit' ? {} : { tier: axes.tier })}
      {...(axes.transparency === 'inherit' ? {} : { transparency: axes.transparency })}>{surface}</AuraGlassProvider>
  );
  return <div ref={lab.subtreeRef} data-ag-part="lab-subtree" style={subtreeStyle(lab.state.knobs)}>{scoped}</div>;
}

function Radios<T extends string>({ label, name, options, value, onChange, disabled = false }: {
  label: string; name: string; options: readonly T[]; value: T; onChange: (v: T) => void; disabled?: boolean;
}): React.ReactElement {
  const id = React.useId();
  return (
    <div role="radiogroup" aria-labelledby={id} aria-disabled={disabled || undefined} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <span id={id} style={{ minInlineSize: '7rem' }}>{label}</span>
      {options.map((o) => (
        <label key={o} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
          <input type="radio" name={`${name}-${id}`} value={o} checked={value === o} disabled={disabled} onChange={() => onChange(o)} />
          {o}
        </label>
      ))}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }): React.ReactElement {
  return (
    <label style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} />
      {label}
    </label>
  );
}

export function LabControls({ lab }: { lab: UseLab }): React.ReactElement {
  const { state, dispatch, seam, shipped, specDefaults } = lab;
  const { axes } = state;
  const [patch, setPatch] = React.useState<string | null>(null);
  const pendingId = React.useId();
  const deviating = seam ? deviations(state.spec, specDefaults) : [];
  const axis = <K extends keyof LabAxes>(key: K) => (value: LabAxes[K]) => { dispatch({ type: 'axis', key, value }); setPatch(null); };
  const reset = () => {
    dispatch({ type: 'reset', axes: lab.initial });
    if (lab.subjectRef.current) resetOverrides(lab.subjectRef.current);
    setPatch(null);
  };
  const doExport = () => {
    const entries = exportPatch(state.spec, specDefaults, seam);
    setPatch(entries === null ? null : JSON.stringify(entries, null, 2));
  };
  return (
    <form data-ag-part="lab-controls" aria-label="Material Lab controls" onSubmit={(e) => e.preventDefault()}
      style={{ display: 'grid', gap: 12, maxInlineSize: 720 }}>
      <fieldset style={{ display: 'grid', gap: 8 }}>
        <legend>Material (public Surface props)</legend>
        <Radios label="Layer" name="layer" options={['chrome', 'overlay', 'transient', 'content'] as const} value={axes.layer} onChange={axis('layer')} />
        <Radios label="Variant" name="variant" options={['regular', 'clear', 'identity'] as const} value={axes.variant}
          onChange={axis('variant')} disabled={axes.layer === 'content'} />
        <Radios label="Content" name="content" options={['content-raised', 'content-sunken'] as const} value={axes.content}
          onChange={axis('content')} disabled={axes.layer !== 'content'} />
        <Radios label="Thickness" name="thickness" options={['thin', 'regular', 'thick'] as const} value={axes.thickness} onChange={axis('thickness')} />
        <Radios label="Shape" name="shape" options={['fixed', 'capsule', 'concentric'] as const} value={axes.shape} onChange={axis('shape')} />
        <div style={{ display: 'flex', gap: 16 }}>
          <Check label="interactive" checked={axes.interactive} onChange={axis('interactive')} />
          <Check label="prominent" checked={axes.prominent} onChange={axis('prominent')} />
          <Check label="refraction" checked={axes.refraction} onChange={axis('refraction')} />
        </div>
      </fieldset>
      <fieldset style={{ display: 'grid', gap: 8 }}>
        <legend>Preferences (scoped provider)</legend>
        <Radios label="Tier" name="tier" options={['inherit', 'lightweight', 'standard', 'enhanced'] as const} value={axes.tier} onChange={axis('tier')} />
        <Radios label="Transparency" name="transparency" options={['inherit', 'glass', 'tinted', 'solid'] as const} value={axes.transparency} onChange={axis('transparency')} />
      </fieldset>
      <fieldset style={{ display: 'grid', gap: 8 }}>
        <legend>Public knobs</legend>
        {PUBLIC_KNOBS.map((k) => {
          const value = state.knobs[k.id] ?? shipped[k.id];
          return (
            <label key={k.id} style={{ display: 'grid', gridTemplateColumns: '10rem 1fr 5rem', gap: 8, alignItems: 'center' }}>
              {k.label}
              <input type="range" min={k.min} max={k.max} step={k.step} value={value} aria-valuenow={value}
                aria-valuetext={`${value}${k.unit}`}
                onChange={(e) => {
                  const v = Number(e.currentTarget.value);
                  dispatch({ type: 'knob', id: k.id, value: Math.abs(v - shipped[k.id]) < 1e-9 ? undefined : v });
                }} />
              <output>{`${value}${k.unit}`}</output>
            </label>
          );
        })}
      </fieldset>
      <SpecKnobs seam={seam} values={state.spec} defaults={specDefaults}
        onChange={(id, value) => { dispatch({ type: 'spec', id, value }); setPatch(null); }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {deviating.length > 0 && (
          <strong data-ag-part="lab-deviation" title={deviating.join(', ')}>Spec deviation — not shipped</strong>
        )}
        <button type="button" onClick={reset}>Reset to shipped</button>
        <button type="button" onClick={doExport} disabled={!seam} aria-describedby={seam ? undefined : pendingId}>
          Export MaterialSpec patch
        </button>
        {!seam && <span id={pendingId}>pending seam: nothing to export</span>}
      </div>
      {patch !== null && (
        <output data-ag-part="lab-patch" aria-label="MaterialSpec patch"><pre style={{ margin: 0 }}>{patch}</pre></output>
      )}
    </form>
  );
}
