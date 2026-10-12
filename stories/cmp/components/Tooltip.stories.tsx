/* CMP-272 (REQ-CMP-01/22): Tooltip scenes — Playground, ProviderDelays,
   CoarseLongPress, States, Keyboard — ids flagships-overlays-tooltip--*. */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tooltip } from '../../../src/components/tooltip';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Tooltip',
  component: Tooltip.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Tooltip', kind: 'component' } },
} satisfies Meta<typeof Tooltip.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ label = 'Hint text' }: { label?: string }) => (
  <AuraGlassProvider><OverlayStage>
    <Tooltip.Provider>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content><Tooltip.Arrow />{label}</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </OverlayStage></AuraGlassProvider>
);

export const Playground: Story = {
  render: () => <Demo />,
};
export const ProviderDelays: Story = {
  render: () => <Demo label="600ms delay · 0 closeDelay · 400ms skip-delay window" />,
};
export const CoarseLongPress: Story = {
  render: () => <Demo label="On coarse pointers: press and hold 500ms to open" />,
};

/* Open with its arrow next to a closed trigger, in one provider (shared delay group). */
export const States: Story = {
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <Tooltip.Provider>
        <div style={{ display: 'flex', gap: 'var(--ag-space-8)' }}>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>Open</Tooltip.Trigger>
            <Tooltip.Content><Tooltip.Arrow />Copied to clipboard</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>Closed</Tooltip.Trigger>
            <Tooltip.Content><Tooltip.Arrow />Opens on hover or focus</Tooltip.Content>
          </Tooltip.Root>
        </div>
      </Tooltip.Provider>
    </OverlayStage></AuraGlassProvider>
  ),
};

/* The story tests/a11y/apg/cmp/tooltip.apg.spec.ts drives: focus opens, aria-describedby resolves, Escape closes. */
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => <Demo label="Focus opens it; Escape closes it" />,
};
