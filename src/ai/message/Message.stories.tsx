// Message.stories.tsx — AI/Message states (SURF-347).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Message } from './Message';
import { StreamingText, type StreamingTextHandle } from './StreamingText';
import type { AgMessage } from '../types';

const meta = {
  title: 'AI/Message',
  parameters: { ag: { subject: 'Message', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const m = (over: Partial<AgMessage>): AgMessage => ({ id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'Here is the rollout plan.' }], ...over });

export const User: Story = { render: () => <Message message={m({ role: 'user' })} /> };
export const Assistant: Story = { render: () => <Message message={m({})} /> };
export const System: Story = { render: () => <Message message={m({ role: 'system' as never })} /> };
export const Tool: Story = {
  render: () => (
    <Message message={m({ parts: [{ type: 'tool-search', toolCallId: 't1', state: 'output-available', input: { q: 'deploy' }, output: 'found 3' } as never] })} />
  ),
};
export const WithAttachments: Story = {
  render: () => (
    <Message message={m({ role: 'user', parts: [{ type: 'text', text: 'Logs attached' }, { type: 'file', url: 'data:text/plain,x', mediaType: 'text/plain', filename: 'server.log' } as never] })} />
  ),
};
export const WithImage: Story = {
  render: () => (
    <Message message={m({ parts: [{ type: 'file', url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', mediaType: 'image/svg+xml', filename: 'chart.svg' } as never] })} />
  ),
};
export const Streaming: Story = {
  render: () => <Message message={m({ metadata: { status: 'streaming' } })} />,
};
export const Error: Story = { render: () => <Message message={m({ metadata: { status: 'error' } })} /> };
export const Aborted: Story = { render: () => <Message message={m({ metadata: { status: 'aborted' } })} /> };
export const ActionsFocused: Story = {
  render: () => (
    <Message message={m({ metadata: { createdAt: '2026-05-12T09:14:03Z' } })} timeZone="UTC">
      <Message.Content><Message.Parts message={m({})} /></Message.Content>
      <Message.Actions message={m({})} onRegenerate={() => undefined} onFeedback={() => undefined} />
    </Message>
  ),
};

/** REQ-SURF-115: http(s) link (no download), blob: download, javascript: rendered as text. */
export const FileLinks: Story = {
  render: () => (
    <Message
      message={m({
        role: 'user',
        parts: [
          { type: 'file', url: 'https://files.example/spec.pdf', mediaType: 'application/pdf', filename: 'spec.pdf' },
          { type: 'file', url: 'blob:https://app.example/1', mediaType: 'application/pdf', filename: 'local.pdf' },
          { type: 'file', url: 'javascript:alert(1)', mediaType: 'application/pdf', filename: 'unsafe.pdf' },
        ],
      })}
    />
  ),
};

/**
 * REQ-SURF-113 perf subject: 200 messages, the last streaming through the
 * StreamingText handle. `window.__agStreamingText.append(chunk)` feeds tokens
 * (the L10 spec drives it at 60 updates/s); same-frame writes coalesce.
 */
function StreamingIn200Story() {
  const handle = React.useRef<StreamingTextHandle | null>(null);
  React.useEffect(() => {
    const w = window as unknown as { __agStreamingText?: StreamingTextHandle };
    w.__agStreamingText = {
      setText: (t) => handle.current?.setText(t),
      append: (c) => handle.current?.append(c),
    };
    return () => { delete w.__agStreamingText; };
  }, []);
  const history = React.useMemo(
    () => Array.from({ length: 199 }, (_, i) => m({
      id: `h-${i}`,
      role: i % 2 ? 'assistant' : 'user',
      parts: [{ type: 'text', text: `History message ${i + 1}: the rollout plan, step ${i + 1}.` }],
    })),
    [],
  );
  const last = m({ id: 'live', metadata: { status: 'streaming' } });
  return (
    <div data-ag-part="message-list" style={{ blockSize: 600, overflowY: 'auto' }}>
      {history.map((h) => <Message key={h.id} message={h} />)}
      <Message.Root message={last}>
        <Message.Content>
          <div data-ag-part="text-part" data-state="streaming">
            <StreamingText ref={handle} text="" streaming />
          </div>
        </Message.Content>
      </Message.Root>
    </div>
  );
}
export const StreamingIn200: Story = { render: () => <StreamingIn200Story /> };
