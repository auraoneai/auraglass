// MobileShell.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MobileShell } from './MobileShell';


const meta: Meta = {
  title: 'surf/mobile-shell',
  component: MobileShell,
  parameters: { ag: { subject: 'MobileShell', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <MobileShell topBar={<span>App</span>} tabBar={<span>Tabs</span>}><p>Content</p></MobileShell> };
export const RTL: Story = { render: () => <MobileShell topBar={<span>App</span>} tabBar={<span>Tabs</span>}><p>Content</p></MobileShell>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <MobileShell topBar={<span>App</span>} tabBar={<span>Tabs</span>}><p>Content</p></MobileShell>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <MobileShell topBar={<span>App</span>} tabBar={<span>Tabs</span>}><p>Content</p></MobileShell>, parameters: { globals: { forcedColors: 'active' } } };
