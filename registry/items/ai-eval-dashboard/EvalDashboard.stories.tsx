import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { EvalDashboard } from './EvalDashboard';
import runs from './fixtures/runs.json';

const meta: Meta<typeof EvalDashboard> = {
  title: 'registry/ai-eval-dashboard',
  component: EvalDashboard,
  parameters: { ag: { subject: 'ai-eval-dashboard', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof EvalDashboard>;

export const Default: Story = { args: { runs: runs.runs } };
export const Empty: Story = { args: { runs: [] } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
