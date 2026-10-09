/* CMP-272 (REQ-CMP-01/22): Popover scenes — Playground, ArrowTitle, HoverIntent,
   SideAlign — open by default, ids overlays-popover--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PopoverPortal, PopoverPositioner, PopoverPopup, Popover } from '../../../src/components/popover';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Popover',
  component: Popover.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Popover', kind: 'component' } },
} satisfies Meta<typeof Popover.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ root = {}, positioner = {}, children }: { root?: Record<string, unknown>; positioner?: Record<string, unknown>; children?: React.ReactNode }) => (
  <AuraGlassProvider>
    <Popover.Root defaultOpen {...root}>
      <Popover.Trigger><Button>Open popover</Button></Popover.Trigger>
      <PopoverPortal>
        <PopoverPositioner {...positioner}>
          <PopoverPopup>
            <Popover.Arrow />
            <Popover.Title>Popover</Popover.Title>
            <Popover.Description>{children ?? 'Anchored overlay content.'}</Popover.Description>
            <Popover.Close><Button >Close</Button></Popover.Close>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover.Root>
  </AuraGlassProvider>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Popover', id: 'overlays-popover--playground' } },
  render: () => <Demo />,
};
export const ArrowTitle: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Popover', id: 'overlays-popover--arrow-title' } },
  render: () => <Demo>Title + Description + Arrow parts wired.</Demo>,
};
export const HoverIntent: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Popover', id: 'overlays-popover--hover-intent' } },
  render: () => (
    <AuraGlassProvider>
      <Popover.Root defaultOpen>
        <Popover.Trigger openOnHover delay={300} closeDelay={150}><Button>Hover me</Button></Popover.Trigger>
        <PopoverPortal>
          <PopoverPositioner>
            <PopoverPopup><Popover.Description>Opens after 300ms hover intent.</Popover.Description></PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover.Root>
    </AuraGlassProvider>
  ),
};
export const SideAlign: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Popover', id: 'overlays-popover--side-align' } },
  render: () => <Demo positioner={{ side: 'right', align: 'start' }}>side=right align=start.</Demo>,
};
