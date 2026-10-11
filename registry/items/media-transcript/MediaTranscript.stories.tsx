import type { Meta, StoryObj } from '@storybook/react';
import { MediaTranscript } from './index';
import { TRANSCRIPT_CUES } from './fixtures';

const meta: Meta<typeof MediaTranscript> = {
  parameters: { ag: { subject: 'MediaTranscript', kind: 'showcase' } }, title: 'registry/media-transcript', component: MediaTranscript };
export default meta;
type Story = StoryObj<typeof MediaTranscript>;

const cues = TRANSCRIPT_CUES;
export const Default: Story = { args: { cues } };
export const Static: Story = { args: { cues } };
export const Empty: Story = { args: { cues: [] } };
export const RTL: Story = { args: { cues }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { cues }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { cues }, parameters: { agEnvironment: { forcedColors: 'active' } } };
