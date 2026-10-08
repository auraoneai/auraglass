/* MAT-187: minimal lab subjects (no forceVisible) standing in for M-01 files
 * that have no 5.0 story yet. Each story exercises the reduced-motion contract
 * REQ-MOT-T06 exercises on the named 4.x files: under reduce, every animated
 * element must reach opacity 1 / scale 1 within 1 s. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const css = `
.aglab-pulse { width: 12px; height: 12px; border-radius: 50%; background: var(--ag-color-accent, #4f8cff);
  animation: ag-pulse var(--ag-duration-large, 1.2s) var(--ag-ease-standard, ease) infinite; }
@keyframes ag-pulse { 0%,100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
.aglab-tunnel { padding: 24px; border-radius: 12px; background: var(--ag-surface-1, rgba(255,255,255,.7));
  animation: ag-materialize var(--ag-duration-medium, .24s) var(--ag-ease-standard, ease) both; }
@keyframes ag-materialize { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
.aglab-focusring:focus-visible { outline: 2px solid var(--ag-color-accent, #4f8cff); outline-offset: 2px;
  transition: outline-offset var(--ag-duration-small, .16s) var(--ag-ease-standard, ease); }
.aglab-tab-pill { position: absolute; left: 0; top: 4px; bottom: 4px; width: 96px; border-radius: 8px;
  background: var(--ag-color-accent-soft, rgba(79,140,255,.25));
  transition: transform var(--ag-duration-medium, .24s) var(--ag-spring-standard, ease); }
.aglab-tab-pill[data-on="1"] { transform: translateX(104px); }
.aglab-sweep { position: relative; overflow: hidden; height: 4px; width: 120px; border-radius: 2px;
  background: var(--ag-track, rgba(0,0,0,.1)); }
.aglab-sweep::before { content: ''; position: absolute; inset: 0; transform: translateX(-100%);
  background: var(--ag-color-accent, #4f8cff); animation: ag-sweep 1400ms var(--ag-ease-standard, ease) infinite; }
@keyframes ag-sweep { to { transform: translateX(100%); } }
`;

const Lab = ({ children }: { children: React.ReactNode }) => (
  <div data-ag-part="lab-root" style={{ padding: 24 }}>
    <style>{css}</style>
    {children}
  </div>
);

const meta: Meta = {
  title: 'Motion Lab/M-01 parity',
  tags: ['mat:motion', '4x-parity'],
  parameters: { layout: 'centered', ag: { kind: 'component' } },
  decorators: [(Story) => <Lab><Story /></Lab>],
};
export default meta;
type Story = StoryObj;

/** 4.x parity: GlassPresenceIndicator — online pulse, settles visible. */
export const GlassPresenceIndicator: Story = {
  name: 'GlassPresenceIndicator',
  render: () => (
    <div data-ag-part="presence" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span data-ag-part="pulse" className="aglab-pulse" />
      <span>Alice Johnson — online</span>
    </div>
  ),
};

/** 4.x parity: GlassQuantumTunnel — state materialization panel. */
export const GlassQuantumTunnel: Story = {
  name: 'GlassQuantumTunnel',
  render: () => (
    <div data-ag-part="tunnel" className="aglab-tunnel">Ground State ▸ tunneled</div>
  ),
};

/** 4.x parity: GlassA11y — keyboard focus ring appears within one frame. */
export const GlassA11y: Story = {
  name: 'GlassA11y',
  render: () => (
    <button data-ag-part="focusable" className="aglab-focusring" type="button">Focusable control</button>
  ),
};

/** Tabs pill morph subject (mat fixture). */
export const TabsMorph: Story = {
  render: () => (
    <div data-ag-part="tabs" style={{ position: 'relative', display: 'flex', gap: 8 }}>
      <div data-ag-part="pill" className="aglab-tab-pill" data-on="0" />
      {['One', 'Two'].map((t, i) => (
        <button key={t} data-ag-part="tab" data-index={i} type="button"
          style={{ width: 96, position: 'relative', zIndex: 1, padding: '8px 0', background: 'none', border: 0 }}>
          {t}
        </button>
      ))}
    </div>
  ),
};

/** Continuous sweep (Spinner/Skeleton shape). */
export const Sweep: Story = {
  render: () => <div data-ag-part="sweep" className="aglab-sweep" data-loading="" />,
};

/** Rest-state subject: layout stack with zero mount motion. */
export const LayoutRest: Story = {
  render: () => (
    <div data-ag-part="stack" style={{ display: 'grid', gap: 8 }}>
      <div data-ag-part="card" style={{ padding: 16, borderRadius: 8, background: 'var(--ag-surface-1,#fff)' }}>Card</div>
      <div data-ag-part="row" style={{ display: 'flex', gap: 8 }}>
        <span data-ag-part="text">Row text</span>
      </div>
    </div>
  ),
};
