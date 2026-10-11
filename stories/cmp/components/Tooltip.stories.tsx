/* CMP-272 (REQ-CMP-01/22): Tooltip scenes — Playground, ProviderDelays,
   CoarseLongPress — ids overlays-tooltip--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tooltip } from '../../../src/components/tooltip';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Tooltip',
  component: Tooltip.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Tooltip', kind: 'component' } },
} satisfies Meta<typeof Tooltip.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ label = 'Hint text' }: { label?: string }) => (
  <AuraGlassProvider>
    <Tooltip.Provider>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup><Tooltip.Arrow />{label}</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  </AuraGlassProvider>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Tooltip', id: 'overlays-tooltip--playground' } },
  render: () => <Demo />,
};
export const ProviderDelays: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Tooltip', id: 'overlays-tooltip--provider-delays' } },
  render: () => <Demo label="600ms delay · 0 closeDelay · 400ms skip-delay window" />,
};
export const CoarseLongPress: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Tooltip', id: 'overlays-tooltip--coarse-long-press' } },
  render: () => <Demo label="On coarse pointers: press and hold 500ms to open" />,
};
