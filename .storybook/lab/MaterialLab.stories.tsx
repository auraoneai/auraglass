/* REQ-QUAL-53 (REQ-FIN-106, FIN-451): Material Lab pages — kind `lab`, tag `lab`, title `Material Lab`.
   Twelve stories in this order: Overview, Regular, Clear, Identity, Content Raised, Content Sunken, Tiers,
   Nesting & Groups, Shape & Concentricity, Scroll Edge, Preferences, Motion.
   Composes only MAT's public material family (S-05/S-06: Surface, SurfaceGroup, Environment, ScrollEdge,
   ConcentricFrame, useMaterialTier) and the preference hooks/provider (S-21/S-22). The scene behind every page is the
   preview's `scene` global (painted by the single preview decorator); no story paints a stage, sets ink or supplies
   optics (REQ-QUAL-55). */
import * as React from 'react';
import { flushSync } from 'react-dom';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { ConcentricFrame, ScrollEdge as MaterialScrollEdge, Surface, SurfaceGroup, useMaterialTier } from '../../src/material';
import type { ContentMaterial, DomTier, MaterialVariant, Thickness, Transparency } from '../../src/material';
import { AuraGlassProvider, usePreference, useResolvedPreferences } from '../../src/theme';
import type { StoryAgParameters } from '../../src/contracts/testing';
import { ContrastReadout } from './ContrastReadout';
import { LabControls, LabSubject, useLab } from './LabControls';
import type { LabAxes } from './LabControls';

const THICKNESSES: readonly Thickness[] = ['thin', 'regular', 'thick'];
const VARIANTS: readonly MaterialVariant[] = ['regular', 'clear', 'identity'];
const CONTENTS: readonly ContentMaterial[] = ['content-raised', 'content-sunken'];

const page: React.CSSProperties = { display: 'grid', gap: 24, padding: 24 };
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'start' };

const meta = {
  title: 'Material Lab',
  tags: ['lab'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
type Ctx = StoryContext;

const contrastOf = (ctx: Ctx): 'standard' | 'more' => (ctx.globals.contrast === 'more' ? 'more' : 'standard');

/** Copy for a material cell: two-line label + a paragraph (the certification lanes read text on every subject). */
function CellCopy({ title, detail }: { title: string; detail: string }): React.ReactElement {
  return (
    <>
      <strong style={{ display: 'block' }}>{title}</strong>
      <span style={{ display: 'block' }}>{detail}</span>
      <p style={{ marginBlock: '8px 0' }}>Quarterly revenue rose 12% on renewals across three regions.</p>
    </>
  );
}

// ---- Overview ----------------------------------------------------------------------------------------------------

function OverviewPage(): React.ReactElement {
  const cell: React.CSSProperties = { padding: 20, minInlineSize: 360, minBlockSize: 240, boxSizing: 'border-box' };
  return (
    <div style={{ ...page, gridTemplateColumns: 'repeat(3, minmax(360px, 1fr))' }} data-ag-part="lab-overview">
      {VARIANTS.flatMap((variant) => THICKNESSES.map((thickness) => (
        <Surface key={`${variant}-${thickness}`} layer="chrome" variant={variant} thickness={thickness} style={cell}>
          <CellCopy title={variant} detail={`${thickness} thickness`} />
        </Surface>
      )))}
      {CONTENTS.flatMap((content) => THICKNESSES.map((thickness) => (
        <Surface key={`${content}-${thickness}`} layer="content" content={content} thickness={thickness} style={cell}>
          <CellCopy title={content} detail={`${thickness} thickness`} />
        </Surface>
      )))}
    </div>
  );
}

export const Overview: Story = { parameters: { ag: { subject: 'lab:overview', kind: 'lab' } satisfies StoryAgParameters }, render: () => <OverviewPage /> };

// ---- One material per page, with controls and the contrast estimate ----------------------------------------------

function MaterialPage({ initial, title, ctx }: { initial: Partial<LabAxes>; title: string; ctx: Ctx }): React.ReactElement {
  const lab = useLab(initial);
  const watch = JSON.stringify([lab.state, ctx.globals]);
  return (
    <div style={page}>
      <LabSubject lab={lab}>
        <CellCopy title={title} detail={`${lab.state.axes.thickness} thickness, ${lab.state.axes.shape} shape`} />
      </LabSubject>
      <ContrastReadout subject={lab.subjectRef} contrast={contrastOf(ctx)} watch={watch} label={title} />
      <LabControls lab={lab} />
    </div>
  );
}

export const Regular: Story = {
  name: 'Regular',
  parameters: { ag: { subject: 'lab:regular', kind: 'lab' } satisfies StoryAgParameters },
  render: (_args, ctx) => <MaterialPage initial={{ layer: 'chrome', variant: 'regular' }} title="Regular" ctx={ctx} />,
};
export const Clear: Story = {
  name: 'Clear',
  parameters: { ag: { subject: 'lab:clear', kind: 'lab' } satisfies StoryAgParameters },
  render: (_args, ctx) => <MaterialPage initial={{ layer: 'chrome', variant: 'clear' }} title="Clear" ctx={ctx} />,
};
export const Identity: Story = {
  name: 'Identity',
  parameters: { ag: { subject: 'lab:identity', kind: 'lab' } satisfies StoryAgParameters },
  render: (_args, ctx) => <MaterialPage initial={{ layer: 'chrome', variant: 'identity' }} title="Identity" ctx={ctx} />,
};
export const ContentRaised: Story = {
  name: 'Content Raised',
  parameters: { ag: { subject: 'lab:content-raised', kind: 'lab' } satisfies StoryAgParameters },
  render: (_args, ctx) => <MaterialPage initial={{ layer: 'content', content: 'content-raised' }} title="Content Raised" ctx={ctx} />,
};
export const ContentSunken: Story = {
  name: 'Content Sunken',
  parameters: { ag: { subject: 'lab:content-sunken', kind: 'lab' } satisfies StoryAgParameters },
  render: (_args, ctx) => <MaterialPage initial={{ layer: 'content', content: 'content-sunken' }} title="Content Sunken" ctx={ctx} />,
};

// ---- Tiers -------------------------------------------------------------------------------------------------------

/** `<html data-ag-engine>` (written by MAT's pre-paint script), live. */
function useEngine(): string {
  const read = () => (typeof document === 'undefined' ? 'unknown' : document.documentElement.getAttribute('data-ag-engine') ?? 'unknown');
  return React.useSyncExternalStore((cb) => {
    const mo = new MutationObserver(cb);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ag-engine'] });
    return () => mo.disconnect();
  }, read, () => 'unknown');
}

function TierReadout(): React.ReactElement {
  return <span>useMaterialTier(): {useMaterialTier()}</span>;
}

function TiersPage(): React.ReactElement {
  const engine = useEngine();
  const tiers: readonly DomTier[] = ['lightweight', 'standard', 'enhanced'];
  return (
    <div style={{ ...page, gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))' }}>
      {tiers.map((tier) => (
        <AuraGlassProvider key={tier} storage={null} tier={tier}>
          <Surface layer="chrome" variant="regular" refraction style={{ padding: 20, minBlockSize: 200 }}>
            <strong style={{ display: 'block' }}>{tier}</strong>
            <TierReadout />
            {tier === 'enhanced' && engine !== 'chromium' && (
              <p data-ag-part="tier-inert" style={{ marginBlock: '8px 0' }}>inert on this engine ({engine}): enhanced refraction needs Chromium.</p>
            )}
          </Surface>
        </AuraGlassProvider>
      ))}
    </div>
  );
}

export const Tiers: Story = { parameters: { ag: { subject: 'lab:tiers', kind: 'lab' } satisfies StoryAgParameters }, render: () => <TiersPage /> };

// ---- Nesting & Groups ----------------------------------------------------------------------------------------------

function NestingPage(): React.ReactElement {
  const item: React.CSSProperties = { padding: '8px 12px' };
  return (
    <div style={page}>
      <section aria-label="SurfaceGroup: one backdrop" style={row}>
        <SurfaceGroup spacing="2">
          <span style={item}>Bold</span><span style={item}>Italic</span><span style={item}>Underline</span>
        </SurfaceGroup>
        <span>One SurfaceGroup reads the backdrop once for all three items.</span>
      </section>
      <section aria-label="Separate surfaces" style={row}>
        {['Bold', 'Italic', 'Underline'].map((t) => (
          <Surface key={t} layer="chrome" variant="regular" thickness="thin" style={item}>{t}</Surface>
        ))}
        <span>Three separate surfaces each read the backdrop on their own.</span>
      </section>
      <section aria-label="Nested surfaces" style={row}>
        <Surface layer="chrome" variant="regular" style={{ padding: 20 }}>
          <strong style={{ display: 'block' }}>Outer surface</strong>
          <Surface layer="chrome" variant="regular" style={{ padding: 12, marginBlockStart: 8 }}>Nested surface collapses (no second backdrop)</Surface>
        </Surface>
        <Surface layer="chrome" variant="regular" style={{ padding: 20 }}>
          <strong style={{ display: 'block' }}>Outer surface</strong>
          <Surface layer="chrome" variant="regular" allowNested style={{ padding: 12, marginBlockStart: 8 }}>allowNested keeps its own material</Surface>
        </Surface>
      </section>
    </div>
  );
}

export const NestingAndGroups: Story = { name: 'Nesting & Groups', parameters: { ag: { subject: 'lab:nesting-groups', kind: 'lab' } satisfies StoryAgParameters }, render: () => <NestingPage /> };

// ---- Shape & Concentricity -----------------------------------------------------------------------------------------

function RadiusReadout({ target }: { target: React.RefObject<HTMLElement | null> }): React.ReactElement {
  const [text, setText] = React.useState('measuring…');
  React.useLayoutEffect(() => {
    const el = target.current;
    if (!el) return undefined;
    const update = () => {
      const cs = getComputedStyle(el);
      const v = (n: string) => cs.getPropertyValue(n).trim() || 'unset';
      setText(`--ag-radius-inner: ${v('--ag-radius-inner')} (outer ${v('--ag-radius-outer')}, inset ${v('--ag-inset')})`);
    };
    update();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [target]);
  return <output data-ag-part="radius-readout">{text}</output>;
}

function ShapePage(): React.ReactElement {
  const inner = React.useRef<HTMLElement | null>(null);
  return (
    <div style={page}>
      <section aria-label="ConcentricFrame" style={row}>
        <ConcentricFrame radius="xl" inset="3">
          <Surface layer="chrome" variant="regular" style={{ padding: 12 }}>
            <Surface ref={inner} layer="chrome" variant="regular" shape="concentric" allowNested style={{ padding: 16 }}>
              Concentric inner shape
            </Surface>
          </Surface>
        </ConcentricFrame>
        <RadiusReadout target={inner} />
      </section>
      <section aria-label="Capsule and fixed" style={row}>
        <Surface layer="chrome" variant="regular" shape="capsule" interactive render={<button type="button" />} style={{ padding: '10px 20px' }}>
          Capsule
        </Surface>
        <Surface layer="chrome" variant="regular" shape="fixed" fallbackRadius="md" style={{ padding: '10px 20px' }}>Fixed radius</Surface>
      </section>
    </div>
  );
}

export const ShapeAndConcentricity: Story = { name: 'Shape & Concentricity', parameters: { ag: { subject: 'lab:shape', kind: 'lab' } satisfies StoryAgParameters }, render: () => <ShapePage /> };

// ---- Scroll Edge ---------------------------------------------------------------------------------------------------

const LEDGER = Array.from({ length: 40 }, (_, i) => `Invoice ${1040 + i} · ${['Northwind', 'Contoso', 'Fabrikam', 'Tailspin'][i % 4]} · ${(1200 + i * 37).toLocaleString('en-US')} USD`);

function ScrollPane({ edgeStyle }: { edgeStyle: 'soft' | 'hard' }): React.ReactElement {
  return (
    <Surface layer="chrome" variant="regular" style={{ position: 'relative', inlineSize: 320, blockSize: 280, overflow: 'hidden' }}>
      <MaterialScrollEdge edge="top" edgeStyle={edgeStyle} />
      <div data-ag-scroll-container="" tabIndex={0} aria-label={`${edgeStyle} scroll edge`} style={{ blockSize: '100%', overflowY: 'auto', padding: 16, boxSizing: 'border-box' }}>
        <strong style={{ display: 'block' }}>{edgeStyle} edge</strong>
        <ul style={{ margin: 0, paddingInlineStart: 18 }}>{LEDGER.map((l) => <li key={l}>{l}</li>)}</ul>
      </div>
      <MaterialScrollEdge edge="bottom" edgeStyle={edgeStyle} />
    </Surface>
  );
}

export const ScrollEdge: Story = {
  parameters: { ag: { subject: 'lab:scroll-edge', kind: 'lab' } satisfies StoryAgParameters },
  globals: { scene: 'dense-text' },
  render: () => <div style={{ ...page, ...row }}><ScrollPane edgeStyle="soft" /><ScrollPane edgeStyle="hard" /></div>,
};

// ---- Preferences ---------------------------------------------------------------------------------------------------

function ResolvedLabel(): React.ReactElement {
  const r = useResolvedPreferences();
  return <span style={{ display: 'block' }}>resolved: {r.transparency} / contrast {r.contrast}</span>;
}

function PreferencesPage(): React.ReactElement {
  const forced = usePreference('forcedColors');
  const transparencies: readonly Transparency[] = ['glass', 'tinted', 'solid'];
  const contrasts = ['standard', 'more'] as const;
  return (
    <div style={page}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 16 }}>
        <caption style={{ textAlign: 'start' }}>Transparency × contrast (each cell scopes its own provider)</caption>
        <thead><tr><th scope="col">transparency</th>{contrasts.map((c) => <th key={c} scope="col">contrast {c}</th>)}</tr></thead>
        <tbody>
          {transparencies.map((t) => (
            <tr key={t}>
              <th scope="row">{t}</th>
              {contrasts.map((c) => (
                <td key={c}>
                  <AuraGlassProvider storage={null} transparency={t} contrast={c}>
                    <Surface layer="chrome" variant="regular" style={{ padding: 16, minInlineSize: 220 }}>
                      <strong style={{ display: 'block' }}>{t} · {c}</strong>
                      <ResolvedLabel />
                    </Surface>
                  </AuraGlassProvider>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p data-ag-part="forced-colors-state">
        Forced colours: {forced ? 'active — every cell above renders the system-colour floor' : 'inactive'}. Forced colours
        follow the OS; emulate them in the browser (Rendering → forced-colors) — the preference lane certifies them.
      </p>
    </div>
  );
}

export const Preferences: Story = { parameters: { ag: { subject: 'lab:preferences', kind: 'lab' } satisfies StoryAgParameters }, render: () => <PreferencesPage /> };

// ---- Motion --------------------------------------------------------------------------------------------------------

type DocWithVT = Document & { startViewTransition?: (cb: () => void) => unknown };

function MotionPage(): React.ReactElement {
  const [entrance, setEntrance] = React.useState(0);
  const [wide, setWide] = React.useState(false);
  const vt = typeof document !== 'undefined' && typeof (document as DocWithVT).startViewTransition === 'function';
  const toggle = () => {
    const doc = document as DocWithVT;
    if (doc.startViewTransition) doc.startViewTransition(() => flushSync(() => setWide((w) => !w)));
    else setWide((w) => !w);
  };
  return (
    <div style={page}>
      <section aria-label="Entrance" style={row}>
        <button type="button" onClick={() => setEntrance((n) => n + 1)}>Replay entrance</button>
        <Surface key={entrance} layer="overlay" variant="regular" style={{ padding: 20 }}>Entrance #{entrance + 1}</Surface>
      </section>
      <section aria-label="Hover and press" style={row}>
        <Surface layer="chrome" variant="regular" interactive render={<button type="button" />} style={{ padding: '10px 20px' }}>Hover or press</Surface>
        <Surface layer="chrome" variant="regular" interactive prominent render={<button type="button" />} style={{ padding: '10px 20px' }}>Prominent</Surface>
      </section>
      <section aria-label="Pointer light" style={row}>
        <Surface layer="chrome" variant="regular" interactive style={{ padding: 24, minInlineSize: 360, minBlockSize: 160 }}>
          Move the pointer across this surface: the specular highlight follows it (pointer light).
        </Surface>
      </section>
      <section aria-label="View Transition" style={row}>
        <button type="button" onClick={toggle}>{wide ? 'Collapse' : 'Expand'} with a View Transition</button>
        <Surface layer="chrome" variant="regular" style={{ padding: 20, inlineSize: wide ? 480 : 240 }}>
          Optics drop while the transition runs{vt ? '' : ' (View Transitions unsupported on this engine: the layout changes without a transition)'}.
        </Surface>
      </section>
    </div>
  );
}

export const Motion: Story = { parameters: { ag: { subject: 'lab:motion', kind: 'lab' } satisfies StoryAgParameters }, render: () => <MotionPage /> };
