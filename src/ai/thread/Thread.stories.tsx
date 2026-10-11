// Thread.stories.tsx — AI/Thread states (SURF-347). Data from __fixtures__ only.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Thread } from './Thread';
import { MESSAGES } from '../__fixtures__/ui-messages.source';
import LONG_THREAD from '../__fixtures__/thread-2000.json';
import { createReplay } from '../__fixtures__/replay';
import { THREAD_TOKEN_STREAM } from '../__fixtures__/thread-token-stream';
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

/**
 * REQ-SURF-108 follow spec subjects: `history` messages plus one assistant
 * message replayed from THREAD_TOKEN_STREAM. Specs drive the replay through
 * `window.__agThreadReplay`: `step(n)` streams n tokens, `append(n)` adds n
 * further assistant replies after it (new arrivals for the JumpToLatest pill).
 */
function StreamingReplayStory({ history, virtualizeAfter }: { history: number; virtualizeAfter?: number }) {
  const replay = React.useMemo(() => createReplay(THREAD_TOKEN_STREAM), []);
  const all = (LONG_THREAD as { messages: AgMessage[] }).messages;
  const [extra, setExtra] = React.useState(0);
  const [streamed, setStreamed] = React.useState<readonly AgMessage[]>(() => replay.messages());
  React.useEffect(() => {
    const off = replay.subscribe(() => setStreamed(replay.messages()));
    (window as unknown as { __agThreadReplay?: unknown }).__agThreadReplay = {
      step: (n: number) => replay.step(n),
      finish: () => replay.finish(),
      isDone: () => replay.isDone(),
      append: (n: number) => setExtra((c) => c + n),
    };
    return () => {
      off();
      delete (window as unknown as { __agThreadReplay?: unknown }).__agThreadReplay;
    };
  }, [replay]);
  const messages = React.useMemo(() => [
    ...all.slice(0, history),
    ...streamed,
    ...all.slice(0, extra).map((m, i): AgMessage => ({ ...m, id: `reply-${i}`, role: 'assistant' })),
  ], [all, history, extra, streamed]);
  return (
    <div style={{ blockSize: '50vh' }}>
      <Thread messages={messages} {...(virtualizeAfter !== undefined ? { virtualizeAfter } : {})} />
    </div>
  );
}
export const StreamingReplay: Story = { render: () => <StreamingReplayStory history={40} /> };
export const StreamingReplayVirtualized: Story = {
  render: () => <StreamingReplayStory history={2000} virtualizeAfter={50} />,
};

/** REQ-SURF-109 prepend subject: the last 200 messages (virtualized); `window.__agThreadPrepend(k)` prepends k earlier ones. */
function PrependHistoryStory() {
  const all = (LONG_THREAD as { messages: AgMessage[] }).messages;
  const [start, setStart] = React.useState(1800);
  const messages = React.useMemo(() => all.slice(start, 2000), [all, start]);
  React.useEffect(() => {
    (window as unknown as { __agThreadPrepend?: unknown }).__agThreadPrepend = (k: number) =>
      setStart((s) => Math.max(0, s - k));
    return () => { delete (window as unknown as { __agThreadPrepend?: unknown }).__agThreadPrepend; };
  }, []);
  return (
    <div style={{ blockSize: '70vh' }}>
      <Thread messages={messages} virtualizeAfter={50} />
    </div>
  );
}
export const PrependHistory: Story = { render: () => <PrependHistoryStory /> };
