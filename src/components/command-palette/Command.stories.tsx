// Command.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Command } from './Command';

const defaultChildren = undefined;

const meta: Meta = {
  title: 'surf/command',
  component: Command.Root,
  parameters: { ag: { subject: 'Command', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root> };
export const RTL: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root>, parameters: { globals: { forcedColors: 'active' } } };

/* SURF-63: 5,000 items (virtualized above 100 visible). */
const fiveThousand = Array.from({ length: 5000 }, (_, i) => `Command ${i}`);
export const FiveThousand: Story = {
  render: () => (
    <Command.Root>
      <Command.Input placeholder="Search 5,000 commands…" />
      <Command.List style={{ blockSize: '20rem' }}>
        {fiveThousand.map((label, i) => <Command.Item key={i} value={`cmd-${i}`}>{label}</Command.Item>)}
      </Command.List>
    </Command.Root>
  ),
};
