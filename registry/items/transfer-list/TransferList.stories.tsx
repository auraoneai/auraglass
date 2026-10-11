// TransferList.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from '@storybook/react';
import { TransferList } from './index';
import { transferProps } from './fixtures';

const meta: Meta<typeof TransferList> = {
  title: 'plat/items/transfer-list',
  component: TransferList,
  args: transferProps,
  parameters: { ag: { subject: 'transfer-list', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof TransferList>;

export const Default: Story = {};
export const EmptySource: Story = { args: { source: { title: 'Available', rows: [] } } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
