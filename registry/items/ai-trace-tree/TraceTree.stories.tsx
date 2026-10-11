import type { Meta, StoryObj } from '@storybook/react';
import { TraceTree } from './TraceTree';
import { TRACE_STEPS, TRACE_TOTAL_MS } from './fixtures';

const meta: Meta<typeof TraceTree> = {
  parameters: { ag: { subject: 'TraceTree', kind: 'showcase' } }, title: 'registry/ai-trace-tree', component: TraceTree };
export default meta;
type Story = StoryObj<typeof TraceTree>;

export const Default: Story = { args: { steps: TRACE_STEPS, totalMs: TRACE_TOTAL_MS } };
export const Empty: Story = { args: { steps: [] } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
