/* stories/qual/fixtures/perf/A11yFallback.stories.tsx — REQ-QUAL-43 (4) fixtures (QUAL, L10; FIN-446).
   Consumed by tests/perf/qual/a11y-fallback.spec.ts. Under forced colours, data-ag-transparency="solid" and tier
   lightweight, no element may keep a computed backdrop-filter.
     Surfaces     public Surfaces of every layer, a refraction surface and a scrim-like content surface → no violation
     BespokeBlur  a hand-rolled blurred panel that ignores the fallbacks                               → backdrop-filter-under-fallback
   Tagged no-cert: never certification subjects. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface, SurfaceGroup } from '../../../../src/material/index';
import type { StoryAgParameters } from '../../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Perf/A11y Fallback',
  tags: ['no-cert'],
  parameters: { layout: 'fullscreen', ag: { subject: 'fixture:perf-a11y-fallback', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const page: React.CSSProperties = { minHeight: '100vh', boxSizing: 'border-box', padding: 48, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' };
const panel: React.CSSProperties = { padding: 24, minInlineSize: 200, minBlockSize: 96 };

export const Surfaces: Story = {
  render: () => (
    <div data-fixture="fallback-surfaces" style={page}>
      <SurfaceGroup>
        <Surface layer="chrome" thickness="thin" style={panel}>chrome thin</Surface>
        <Surface layer="chrome" thickness="regular" style={panel}>chrome regular</Surface>
        <Surface layer="chrome" thickness="thick" style={panel}>chrome thick</Surface>
      </SurfaceGroup>
      <Surface layer="chrome" shape="capsule" refraction interactive style={panel}>refraction</Surface>
      <Surface layer="content" content="content-raised" style={panel}>content</Surface>
    </div>
  ),
};

export const BespokeBlur: Story = {
  render: () => (
    <div data-fixture="fallback-bespoke" style={page}>
      <div data-fixture="bespoke-blur" style={{ ...panel, background: 'rgb(255 255 255 / 0.2)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        hand-rolled blur
      </div>
    </div>
  ),
};
