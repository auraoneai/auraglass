// GanttChart.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { GanttChart } from './index';
import { ganttProps } from './fixtures';

const meta: Meta<typeof GanttChart> = {
  title: 'plat/items/gantt',
  component: GanttChart,
  args: ganttProps,
  parameters: { ag: { subject: 'gantt', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof GanttChart>;

export const Default: Story = {};
export const Empty: Story = { args: { tasks: [] } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
