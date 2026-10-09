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

const emptyCase = <Command.Root><Command.List><Command.Empty>Nothing found</Command.Empty></Command.List></Command.Root>;
export const EmptyState: Story = { render: () => emptyCase };
export const Default: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Group heading="File"><Command.Item value="open" shortcut="⌘O">Open</Command.Item><Command.Item value="save" shortcut="⌘S">Save</Command.Item></Command.Group><Command.Separator /><Command.Item value="quit">Quit</Command.Item><Command.Loading>Loading…</Command.Loading></Command.List></Command.Root> };
export const RTL: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <Command.Root><Command.Input placeholder="Search…" /><Command.List><Command.Item value="open">Open</Command.Item><Command.Item value="save">Save</Command.Item></Command.List></Command.Root>, parameters: { globals: { forcedColors: 'active' } } };
