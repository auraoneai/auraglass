// StatusBar.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StatusBar } from './StatusBar';


const meta: Meta = {
  title: 'surf/status-bar',
  component: StatusBar.Root,
  parameters: { ag: { subject: 'StatusBar', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item><StatusBar.Item>3 issues</StatusBar.Item></StatusBar.Root> };
export const RTL: Story = { render: () => <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item><StatusBar.Item>3 issues</StatusBar.Item></StatusBar.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item><StatusBar.Item>3 issues</StatusBar.Item></StatusBar.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item><StatusBar.Item>3 issues</StatusBar.Item></StatusBar.Root>, parameters: { globals: { forcedColors: 'active' } } };
export const WithLive: Story = { render: () => <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item><StatusBar.Live>Saved</StatusBar.Live></StatusBar.Root> };
