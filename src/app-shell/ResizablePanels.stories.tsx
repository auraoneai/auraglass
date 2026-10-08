// ResizablePanels.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ResizablePanels } from './ResizablePanels';


const meta: Meta = {
  title: 'surf/resizable-panels',
  component: ResizablePanels.Root,
  parameters: { ag: { subject: 'ResizablePanels', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <ResizablePanels.Root><ResizablePanels.Panel id="left"><div>Left</div></ResizablePanels.Panel><ResizablePanels.Handle /><ResizablePanels.Panel id="right"><div>Right</div></ResizablePanels.Panel></ResizablePanels.Root> };
export const RTL: Story = { render: () => <ResizablePanels.Root><ResizablePanels.Panel id="left"><div>Left</div></ResizablePanels.Panel><ResizablePanels.Handle /><ResizablePanels.Panel id="right"><div>Right</div></ResizablePanels.Panel></ResizablePanels.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <ResizablePanels.Root><ResizablePanels.Panel id="left"><div>Left</div></ResizablePanels.Panel><ResizablePanels.Handle /><ResizablePanels.Panel id="right"><div>Right</div></ResizablePanels.Panel></ResizablePanels.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <ResizablePanels.Root><ResizablePanels.Panel id="left"><div>Left</div></ResizablePanels.Panel><ResizablePanels.Handle /><ResizablePanels.Panel id="right"><div>Right</div></ResizablePanels.Panel></ResizablePanels.Root>, parameters: { globals: { forcedColors: 'active' } } };
