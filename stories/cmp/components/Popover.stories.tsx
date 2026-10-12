/* CMP-272 (REQ-CMP-01/22): Popover scenes — Playground, ArrowTitle, HoverIntent,
   SideAlign — open by default, ids overlays-popover--*. */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Popover } from '../../../src/components/popover';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Popover',
  component: Popover.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Popover', kind: 'component' } },
} satisfies Meta<typeof Popover.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ root = {}, positioner = {}, children }: { root?: Record<string, unknown>; positioner?: Record<string, unknown>; children?: React.ReactNode }) => (
  <AuraGlassProvider><OverlayStage>
    <Popover.Root defaultOpen {...root}>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content {...positioner}>
        <Popover.Arrow />
        <Popover.Title>Popover</Popover.Title>
        <Popover.Description>{children ?? 'Anchored overlay content.'}</Popover.Description>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  </OverlayStage></AuraGlassProvider>
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
    <AuraGlassProvider><OverlayStage>
      <Popover.Root defaultOpen>
        <Popover.Trigger openOnHover delay={300} closeDelay={150}>Hover me</Popover.Trigger>
        <Popover.Content><Popover.Description>Opens after 300ms hover intent.</Popover.Description></Popover.Content>
      </Popover.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};
export const SideAlign: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Popover', id: 'overlays-popover--side-align' } },
  render: () => <Demo positioner={{ side: 'right', align: 'start' }}>side=right align=start.</Demo>,
};
/* REQ-CMP-98: closed at load, so the APG spec can click-open it and check
   that focus moves into the popup and returns to the trigger. */
export const ClickToOpen: Story = {
  tags: ['apg'],
  parameters: { ag: { tier: 'standard', subject: 'Popover', id: 'overlays-popover--click-to-open' } },
  render: () => <Demo root={{ defaultOpen: false }}>Opened by a click on the trigger.</Demo>,
};
