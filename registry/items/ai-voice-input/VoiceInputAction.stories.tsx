import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { VoiceInputAction } from './VoiceInputAction';

const meta: Meta<typeof VoiceInputAction> = {
  title: 'registry/ai-voice-input',
  component: VoiceInputAction,
  parameters: { ag: { subject: 'ai-voice-input', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof VoiceInputAction>;

export const Default: Story = {};
export const Empty: Story = { args: { disabled: true } };
export const RTL: Story = { decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { parameters: { agEnvironment: { forcedColors: 'active' } } };
