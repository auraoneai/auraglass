// TopBar.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TopBar } from './TopBar';


const meta: Meta = {
  title: 'surf/top-bar',
  component: TopBar.Root,
  parameters: { ag: { subject: 'TopBar', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <TopBar.Root><TopBar.Leading><span>Logo</span></TopBar.Leading><TopBar.Title>App</TopBar.Title><TopBar.Trailing><span>Actions</span></TopBar.Trailing></TopBar.Root> };
export const RTL: Story = { render: () => <TopBar.Root><TopBar.Leading><span>Logo</span></TopBar.Leading><TopBar.Title>App</TopBar.Title><TopBar.Trailing><span>Actions</span></TopBar.Trailing></TopBar.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <TopBar.Root><TopBar.Leading><span>Logo</span></TopBar.Leading><TopBar.Title>App</TopBar.Title><TopBar.Trailing><span>Actions</span></TopBar.Trailing></TopBar.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <TopBar.Root><TopBar.Leading><span>Logo</span></TopBar.Leading><TopBar.Title>App</TopBar.Title><TopBar.Trailing><span>Actions</span></TopBar.Trailing></TopBar.Root>, parameters: { globals: { forcedColors: 'active' } } };
export const WithCenter: Story = { render: () => <TopBar.Root><TopBar.Leading><span>Logo</span></TopBar.Leading><TopBar.Center><span>Search</span></TopBar.Center><TopBar.Trailing><span>Actions</span></TopBar.Trailing></TopBar.Root> };
