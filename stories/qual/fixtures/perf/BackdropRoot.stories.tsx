/* stories/qual/fixtures/perf/BackdropRoot.stories.tsx — REQ-QUAL-43 (1) fixtures (QUAL, L10; FIN-446).
   Consumed by tests/perf/qual/backdrop-root.spec.ts. A `.ag-surface` host must not be a backdrop root: computed
   backdrop-filter none, filter none, opacity 1, mix-blend-mode normal, will-change auto unless [data-ag-animating].
     Hosts  five surfaces, each turned into a backdrop root by one inline host style   → one violation per property,
            plus a will-change surface marked [data-ag-animating]                        → allowed, no violation
     Clean  public Surfaces of every layer, unstyled                                       → no violation
   Tagged no-cert: negative/clean controls, never certification subjects. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../../../../src/material/index';
import type { StoryAgParameters } from '../../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Perf/Backdrop Root',
  tags: ['no-cert'],
  parameters: { layout: 'fullscreen', ag: { subject: 'fixture:perf-backdrop-root', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const page: React.CSSProperties = { minHeight: '100vh', boxSizing: 'border-box', padding: 48, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 240px))', gap: 24 };
const panel: React.CSSProperties = { padding: 24, minBlockSize: 96 };

/** Each entry: the fixture name and the one host style that makes the host a backdrop root. */
const HOST_OFFENCES = [
  { name: 'opacity', style: { opacity: 0.9 } },
  { name: 'filter', style: { filter: 'saturate(1.2)' } },
  { name: 'mix-blend-mode', style: { mixBlendMode: 'multiply' } },
  { name: 'will-change', style: { willChange: 'transform' } },
  { name: 'backdrop-filter', style: { backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' } },
] as const satisfies ReadonlyArray<{ name: string; style: React.CSSProperties }>;

export const Hosts: Story = {
  render: () => (
    <div data-fixture="backdrop-root-hosts" style={page}>
      {HOST_OFFENCES.map((o) => (
        <Surface key={o.name} layer="chrome" thickness="regular" data-fixture={o.name} style={{ ...panel, ...o.style }}>{o.name}</Surface>
      ))}
      <Surface layer="chrome" thickness="regular" data-fixture="animating-allowed" data-ag-animating="" style={{ ...panel, willChange: 'transform' }}>
        animating
      </Surface>
    </div>
  ),
};

export const Clean: Story = {
  render: () => (
    <div data-fixture="backdrop-root-clean" style={page}>
      <Surface layer="chrome" thickness="regular" style={panel}>chrome</Surface>
      <Surface layer="chrome" thickness="thin" interactive style={panel}>chrome interactive</Surface>
      <Surface layer="content" content="content-raised" style={panel}>content</Surface>
      <Surface layer="chrome" shape="capsule" refraction style={panel}>refraction</Surface>
    </div>
  ),
};
