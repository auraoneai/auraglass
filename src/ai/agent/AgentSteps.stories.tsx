// AgentSteps.stories.tsx — AI/AgentSteps (SURF-348).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AgentSteps } from './AgentSteps';
import type { AgStep } from '../types';

const meta = {
  title: 'AI/AgentSteps',
  parameters: { ag: { subject: 'AgentSteps', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Linear: Story = {
  render: () => (
    <AgentSteps steps={[
      { id: '1', label: 'Parse request', state: 'succeeded', startedAt: 0, endedAt: 80 },
      { id: '2', label: 'Query metrics', state: 'running', startedAt: 80 },
      { id: '3', label: 'Compose reply', state: 'queued' },
    ]} />
  ),
};
export const NestedOrchestration: Story = {
  render: () => (
    <AgentSteps steps={[
      { id: '1', label: 'Plan', state: 'succeeded', children: [
        { id: '1a', label: 'Sub-call: calendar', state: 'succeeded' },
        { id: '1b', label: 'Sub-call: tickets', state: 'succeeded' },
      ] },
      { id: '2', label: 'Synthesize', state: 'running' },
    ]} />
  ),
};
export const Failed: Story = {
  render: () => (
    <AgentSteps steps={[
      { id: '1', label: 'Fetch context', state: 'succeeded' },
      { id: '2', label: 'Call provider', state: 'failed', detail: '503' },
    ]} />
  ),
};
