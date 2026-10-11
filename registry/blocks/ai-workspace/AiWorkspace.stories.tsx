import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
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
  parameters: { ag: { subject: 'ai-workspace', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof AiWorkspace>;

export const Default: Story = {};
export const Completed: Story = { args: { initialMessages: COMPLETED } };
export const Empty: Story = { args: { initialMessages: [] }, parameters: { note: 'composer-only empty thread' } };
export const RTL: Story = { decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { parameters: { agEnvironment: { forcedColors: 'active' } } };

/** Submits through the real Composer/useAuraChat path and delays recorded
 * chunks so the pending/streaming state is visible without provider access. */
export const Loading: Story = {
  args: { initialMessages: [] },
  render: (args) => <AiWorkspace {...args} transport={createReplayTransport([REPLAY_REPLY], { delayMs: 1000 })} />,
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    if (!textarea) throw new Error('Loading story requires the Composer textarea');
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    if (!setValue) throw new Error('Textarea value setter unavailable');
    setValue.call(textarea, 'Investigate the recorded latency regression.');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    // Let React commit the controlled draft before submitting its form.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    if (!textarea.form) throw new Error('Loading story requires the Composer form');
    textarea.form.requestSubmit();
  },
};
