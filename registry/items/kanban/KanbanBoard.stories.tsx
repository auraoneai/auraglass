// KanbanBoard.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './index';
import { kanbanProps } from './fixtures';

const meta: Meta<typeof KanbanBoard> = {
  title: 'plat/items/kanban',
  component: KanbanBoard,
  args: kanbanProps,
  parameters: { ag: { subject: 'kanban', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {};
export const Empty: Story = { args: { columns: kanbanProps.columns.map((c) => ({ ...c, cards: [] })) } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
