// PresenceStack.stories.tsx — six states per the SURF story contract.
import type { Meta, StoryObj } from '@storybook/react';
import { PresenceStack } from './index';
import { presenceProps } from './fixtures';

const meta: Meta<typeof PresenceStack> = {
  title: 'surf/items/presence-stack',
  component: PresenceStack,
  args: presenceProps,
  parameters: { ag: { subject: 'presence-stack', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof PresenceStack>;

export const Default: Story = {};
export const Empty: Story = { args: { users: [] } };
export const Loading: Story = { parameters: { ag: { state: 'loading' } } };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
