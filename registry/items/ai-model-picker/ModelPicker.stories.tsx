import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { ModelPicker } from './ModelPicker';
import { MODELS } from './fixtures';

const meta: Meta<typeof ModelPicker> = {
  title: 'registry/ai-model-picker',
  component: ModelPicker,
  parameters: { ag: { subject: 'ai-model-picker', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof ModelPicker>;

export const Default: Story = { args: { options: MODELS, value: 'aura-large' } };
export const Empty: Story = { args: { options: [] } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
