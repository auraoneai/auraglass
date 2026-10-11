// Thread.stories.tsx — AI/Thread states (SURF-347). Data from __fixtures__ only.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Thread } from './Thread';
import { MESSAGES } from '../__fixtures__/ui-messages.source';
import LONG_THREAD from '../__fixtures__/thread-2000.json';
import type { AgMessage } from '../types';

const meta = {
  title: 'AI/Thread',
  parameters: { ag: { subject: 'Thread', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { render: () => <Thread messages={[]} /> };
export const Short: Story = { render: () => <Thread messages={MESSAGES.slice(0, 4)} /> };
export const Long2000Virtualized: Story = {
  render: () => (
    <div style={{ blockSize: '70vh' }}>
      <Thread messages={(LONG_THREAD as { messages: AgMessage[] }).messages} virtualizeAfter={50} />
    </div>
  ),
};

const streamingMessages = [
  ...MESSAGES.slice(0, 3),
  {
    id: 'streaming-1', role: 'assistant' as const,
    parts: [{ type: 'text' as const, text: 'Compiling the incident timeline…' }],
    metadata: { status: 'streaming' as const },
  },
];
export const StreamingPinned: Story = { render: () => <Thread messages={streamingMessages} /> };
export const StreamingUnpinnedJump: Story = {
  render: () => (
    <div style={{ blockSize: '50vh' }}>
      <Thread
        messages={[...(LONG_THREAD as { messages: AgMessage[] }).messages.slice(0, 120), ...streamingMessages]}
        virtualizeAfter={40}
      />
    </div>
  ),
};
export const LoadingEarlier: Story = {
  render: () => (
    <Thread
      messages={MESSAGES.slice(4)}
      onReachTop={() => undefined}
    />
  ),
};
/* Composed anatomy: Items inside a Viewport plus an explicit JumpToLatest. */
export const Anatomy: Story = {
  render: () => (
    <Thread.Root messages={MESSAGES.slice(0, 2)}>
      <Thread.Viewport>
        <Thread.Items />
      </Thread.Viewport>
      <Thread.JumpToLatest aria-label="Jump to latest">1 new message</Thread.JumpToLatest>
    </Thread.Root>
  ),
};
