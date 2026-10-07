// SourceTransition.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SourceTransition } from './SourceTransition';

const defaultChildren = undefined;

const meta: Meta = {
  title: 'surf/source-transition',
  component: SourceTransition.Root,
  parameters: { ag: { subject: 'SourceTransition', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <SourceTransition.Root><SourceTransition.Source id="a"><div>Source</div></SourceTransition.Source><SourceTransition.Destination id="a"><div>Destination</div></SourceTransition.Destination></SourceTransition.Root> };
export const RTL: Story = { render: () => <SourceTransition.Root><SourceTransition.Source id="a"><div>Source</div></SourceTransition.Source><SourceTransition.Destination id="a"><div>Destination</div></SourceTransition.Destination></SourceTransition.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <SourceTransition.Root><SourceTransition.Source id="a"><div>Source</div></SourceTransition.Source><SourceTransition.Destination id="a"><div>Destination</div></SourceTransition.Destination></SourceTransition.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <SourceTransition.Root><SourceTransition.Source id="a"><div>Source</div></SourceTransition.Source><SourceTransition.Destination id="a"><div>Destination</div></SourceTransition.Destination></SourceTransition.Root>, parameters: { globals: { forcedColors: 'active' } } };
