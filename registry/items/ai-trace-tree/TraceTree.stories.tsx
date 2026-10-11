import type { Meta, StoryObj } from '@storybook/react';
import { TraceTree } from './TraceTree';

const meta: Meta<typeof TraceTree> = {
  parameters: { ag: { subject: 'TraceTree', kind: 'showcase' } }, title: 'registry/ai-trace-tree', component: TraceTree };
export default meta;
type Story = StoryObj<typeof TraceTree>;

const steps = [
  { id: 'plan', label: 'Plan response', state: 'succeeded' as const, startedAt: 0, endedAt: 120 },
  { id: 'search', label: 'Retrieve docs', state: 'succeeded' as const, startedAt: 120, endedAt: 400,
    children: [{ id: 'q1', label: 'vector query', state: 'succeeded' as const, startedAt: 130, endedAt: 300 }] },
  { id: 'draft', label: 'Draft answer', state: 'running' as const, startedAt: 400 },
  { id: 'gate', label: 'Deploy approval', state: 'needs-approval' as const },
];

export const Default: Story = { args: { steps, totalMs: 600 } };
export const Empty: Story = { args: { steps: [] } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
