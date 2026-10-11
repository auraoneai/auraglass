// CommentThread.stories.tsx — six states per the SURF story contract.
import type { Meta, StoryObj } from '@storybook/react';
import { CommentThread } from './index';
import { commentThreadProps } from './fixtures';

const meta: Meta<typeof CommentThread> = {
  title: 'surf/items/comment-thread',
  component: CommentThread,
  args: commentThreadProps,
  parameters: { ag: { subject: 'comment-thread', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof CommentThread>;

export const Default: Story = {};
export const Empty: Story = { args: { comments: [] } };
export const Loading: Story = { parameters: { ag: { state: 'loading' } } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
