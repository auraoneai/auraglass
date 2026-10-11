// Message.stories.tsx — AI/Message states (SURF-347).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Message } from './Message';
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
  render: () => (
    <Message message={m({ metadata: { status: 'streaming' }, parts: [{ type: 'text', text: 'Drafting the rollout', state: 'streaming' } as never] })} />
  ),
};
/* Composed anatomy: avatar, content with step separators, footer. */
const stepped = m({ parts: [{ type: 'step-start' } as never, { type: 'text', text: 'Checked the deploy log.' }, { type: 'step-start' } as never, { type: 'text', text: 'Rollout is safe.' }] });
export const Anatomy: Story = {
  render: () => (
    <Message message={stepped}>
      <Message.Avatar>AI</Message.Avatar>
      <Message.Content><Message.Parts message={stepped} showSteps /></Message.Content>
      <Message.Footer>2 steps</Message.Footer>
    </Message>
  ),
};
export const Error: Story = { render: () => <Message message={m({ metadata: { status: 'error' } })} /> };
export const Aborted: Story = { render: () => <Message message={m({ metadata: { status: 'aborted' } })} /> };
export const ActionsFocused: Story = {
  render: () => (
    <Message message={m({})}>
      <Message.Actions message={m({})} onRegenerate={() => undefined} />
    </Message>
  ),
};
