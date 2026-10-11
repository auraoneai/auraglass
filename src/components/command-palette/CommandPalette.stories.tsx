// CommandPalette.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CommandPalette } from './CommandPalette';
import { Command } from './Command';

const defaultChildren = undefined;

const meta: Meta = {
  title: 'surf/command-palette',
  component: CommandPalette,
  parameters: { ag: { subject: 'CommandPalette', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <CommandPalette defaultOpen><Command.Root><Command.Input placeholder="Type a command…" /><Command.List><Command.Item value="a">Alpha</Command.Item><Command.Item value="b">Beta</Command.Item></Command.List></Command.Root></CommandPalette> };
export const RTL: Story = { render: () => <CommandPalette defaultOpen><Command.Root><Command.Input placeholder="Type a command…" /><Command.List><Command.Item value="a">Alpha</Command.Item><Command.Item value="b">Beta</Command.Item></Command.List></Command.Root></CommandPalette>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <CommandPalette defaultOpen><Command.Root><Command.Input placeholder="Type a command…" /><Command.List><Command.Item value="a">Alpha</Command.Item><Command.Item value="b">Beta</Command.Item></Command.List></Command.Root></CommandPalette>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <CommandPalette defaultOpen><Command.Root><Command.Input placeholder="Type a command…" /><Command.List><Command.Item value="a">Alpha</Command.Item><Command.Item value="b">Beta</Command.Item></Command.List></Command.Root></CommandPalette>, parameters: { globals: { forcedColors: 'active' } } };
export const Anatomy: Story = {
  render: () => (
    <CommandPalette defaultOpen>
      <Command.Root>
        <Command.Input placeholder="Type a command…" />
        <Command.List>
          <Command.Group heading="Navigate">
            <Command.Item value="home" shortcut="G H">Go home</Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Loading>Loading…</Command.Loading>
        </Command.List>
      </Command.Root>
    </CommandPalette>
  ),
};
export const Empty: Story = {
  render: () => (
    <CommandPalette defaultOpen>
      <Command.Root>
        <Command.Input placeholder="Type a command…" />
        <Command.List><Command.Empty>No commands</Command.Empty></Command.List>
      </Command.Root>
    </CommandPalette>
  ),
};
