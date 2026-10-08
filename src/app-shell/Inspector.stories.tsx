// Inspector.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Inspector } from './Inspector';


const meta: Meta = {
  title: 'surf/inspector',
  component: Inspector.Root,
  parameters: { ag: { subject: 'Inspector', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root> };
export const RTL: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <Inspector.Root aria-label="Details"><Inspector.Header title="Details" /><Inspector.Content><Inspector.Field label="Name">Atlas</Inspector.Field></Inspector.Content></Inspector.Root>, parameters: { globals: { forcedColors: 'active' } } };
