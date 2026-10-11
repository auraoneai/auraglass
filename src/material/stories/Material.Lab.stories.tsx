/* MAT-171/173 — Material Lab stories (REQ-SB-18 order). kind 'lab' wraps each
   story in QUAL's Material Lab frame (S-41): controls + contrast read-out are
   harness-provided; no local decorators or globals. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../Surface';
import { SurfaceGroup } from '../SurfaceGroup';
import { Environment } from '../Environment';
import { ScrollEdge } from '../ScrollEdge';
import { ConcentricFrame } from '../ConcentricFrame';
import type { StoryAgParameters } from '../../contracts/testing';

const meta = {
  title: 'Material Lab',
  component: Surface,
  parameters: {
    ag: { subject: 'Surface', kind: 'lab' } satisfies StoryAgParameters,
  },
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;

const Pad = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '32px', maxWidth: 560 }}>{children}</div>
);

export const Overview: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        <Surface layer="chrome" thickness="regular" style={{ padding: 24 }}>
          <h3 style={{ margin: 0 }}>Regular chrome</h3>
          <p>Blur + tint + rim + grain from the compiled ladder.</p>
        </Surface>
      </Pad>
    </Environment>
  ),
};

export const Regular: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        <Surface layer="chrome" variant="regular" style={{ padding: 24 }}>regular</Surface>
      </Pad>
    </Environment>
  ),
};

export const Clear: Story = {
  render: () => (
    <>
      <Environment backdrop="light">
        <Pad>
          <Surface layer="chrome" variant="clear" style={{ padding: 24 }}>clear over light (dimmed)</Surface>
        </Pad>
      </Environment>
      <Environment backdrop="media">
        <Pad>
          <Surface layer="chrome" variant="clear" style={{ padding: 24 }}>clear over media</Surface>
        </Pad>
      </Environment>
      <Pad>
        <Surface layer="chrome" variant="clear" style={{ padding: 24 }}>
          clear without a backdrop — renders as regular (dev warning)
        </Surface>
      </Pad>
    </>
  ),
};

export const Identity: Story = {
  render: () => (
    <Pad>
      <Surface layer="chrome" variant="identity" style={{ padding: 24 }}>
        identity — optically inert, keeps data-ag-surface
      </Surface>
    </Pad>
  ),
};

export const ContentRaised: Story = {
  render: () => (
    <Pad>
      <Surface layer="content" content="content-raised" style={{ padding: 24 }}>
        content-raised — opaque fill, rim + grain + shadow, no backdrop filter
      </Surface>
    </Pad>
  ),
};

export const ContentSunken: Story = {
  render: () => (
    <Pad>
      <Surface layer="content" content="content-sunken" style={{ padding: 24 }}>
        content-sunken — inset top shade
      </Surface>
    </Pad>
  ),
};

export const Tiers: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        <div data-ag-tier="lightweight">
          <Surface layer="chrome" thickness="regular" style={{ padding: 16, marginBottom: 8 }}>
            lightweight rung — solid fill, no backdrop filter
          </Surface>
        </div>
        <Surface layer="chrome" thickness="regular" style={{ padding: 16, marginBottom: 8 }}>
          standard
        </Surface>
        <div data-ag-tier="enhanced">
          <Surface layer="chrome" refraction thickness="regular" style={{ padding: 16 }}>
            enhanced + refraction (inert on this engine if data-ag-engine ≠ chromium)
          </Surface>
        </div>
      </Pad>
    </Environment>
  ),
};

export const NestingAndGroups: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        <Surface layer="chrome" style={{ padding: 16 }}>
          outer
          <Surface layer="chrome" style={{ padding: 16, marginTop: 8 }}>
            nested — no live ::before (inner fill)
          </Surface>
          <Surface layer="chrome" allowNested style={{ padding: 16, marginTop: 8 }}>
            allowNested — keeps optics (dev warning at depth ≥ 2)
          </Surface>
        </Surface>
        <div style={{ display: 'flex', padding: 12, marginTop: 16 }}>
        <SurfaceGroup spacing="2">
          {['one', 'two', 'three', 'four', 'five'].map((c) => (
            <Surface key={c} layer="chrome" interactive style={{ padding: '8px 12px' }}>{c}</Surface>
          ))}
        </SurfaceGroup>
        </div>
        <Surface layer="chrome" data-disabled style={{ padding: 16, marginTop: 16 }}>
          disabled — fill dimmed, host opacity stays 1
        </Surface>
      </Pad>
    </Environment>
  ),
};

export const ShapeAndConcentricity: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        <ConcentricFrame radius="lg" inset="3">
          <Surface layer="chrome" shape="concentric" style={{ padding: 16 }}>
            concentric — radius = outer − inset
            <Surface layer="chrome" shape="concentric" style={{ padding: 16, marginTop: 8 }}>
              inner concentric
            </Surface>
          </Surface>
        </ConcentricFrame>
        <Surface layer="chrome" shape="capsule" style={{ padding: '8px 24px', marginTop: 16, display: 'inline-block' }}>
          capsule
        </Surface>
      </Pad>
    </Environment>
  ),
};

export const ScrollEdgeStory: Story = {
  name: 'Scroll Edge',
  render: () => (
    <Environment backdrop="media">
      <div style={{ height: 160, overflow: 'auto', position: 'relative', padding: 16 }}>
        <ScrollEdge edge="top" edgeStyle="soft" />
        {Array.from({ length: 40 }, (_, i) => <p key={i}>dense text line {i + 1} — scroll to see the fade</p>)}
        <ScrollEdge edge="bottom" edgeStyle="hard" />
      </div>
    </Environment>
  ),
};

export const Preferences: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        {(['glass', 'tinted', 'solid'] as const).map((t) => (
          <div key={t} data-ag-transparency={t}>
            <Surface layer="chrome" style={{ padding: 16, marginTop: 8 }}>
              {t} — rendered under transparency preference
            </Surface>
          </div>
        ))}
      </Pad>
    </Environment>
  ),
};

export const Motion: Story = {
  render: () => (
    <Environment backdrop="media">
      <Pad>
        <Surface layer="chrome" interactive style={{ padding: 16 }}>
          hover me — specular rises, duration from --ag-duration-micro
        </Surface>
      </Pad>
    </Environment>
  ),
};
