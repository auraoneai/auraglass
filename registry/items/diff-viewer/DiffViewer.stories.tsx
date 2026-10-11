// DiffViewer.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { DiffViewer } from './index';
import { diffProps } from './fixtures';

const meta: Meta<typeof DiffViewer> = {
  title: 'plat/items/diff-viewer',
  component: DiffViewer,
  args: diffProps,
  parameters: { ag: { subject: 'diff-viewer', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof DiffViewer>;

export const Default: Story = {};
export const Empty: Story = { args: { lines: [] } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
