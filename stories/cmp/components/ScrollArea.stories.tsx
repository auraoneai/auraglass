import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '../../../src/components/scroll-area';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/ScrollArea',
  component: ScrollArea.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'ScrollArea', kind: 'component' } },
} satisfies Meta<typeof ScrollArea.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'ScrollArea', id: 'core-scroll-area--default' } },
  render: () => (
    <ScrollArea.Root style={{ height: 80, width: 200 }}>
      <ScrollArea.Viewport>
        <div style={{ height: 300 }}>Tall content</div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar keepMounted><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

