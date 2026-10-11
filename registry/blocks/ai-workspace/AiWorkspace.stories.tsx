import type { Meta, StoryObj } from '@storybook/react';
import { AiWorkspace } from './index';
import { AWAITING_APPROVAL, COMPLETED, REPLAY_REPLY } from './fixtures';
import { createReplayTransport } from './replay-transport';

// Stories drive the real useAuraChat → useChat path through a fixture replay
// transport (REQ-SURF-172): no server, no model call. A fresh transport per
// render keeps the replay order deterministic.
const meta: Meta<typeof AiWorkspace> = {
  title: 'registry/ai-workspace',
  component: AiWorkspace,
  render: (args) => <AiWorkspace {...args} transport={createReplayTransport([REPLAY_REPLY])} />,
  args: { initialMessages: AWAITING_APPROVAL },
};
export default meta;
type Story = StoryObj<typeof AiWorkspace>;

export const Default: Story = {};
export const Completed: Story = { args: { initialMessages: COMPLETED } };
export const Empty: Story = { args: { initialMessages: [] }, parameters: { note: 'composer-only empty thread' } };
export const RTL: Story = { decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { parameters: { agEnvironment: { forcedColors: 'active' } } };
