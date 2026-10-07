import type { Meta, StoryObj } from '@storybook/react';
import { MediaTranscript } from './index';

const meta: Meta<typeof MediaTranscript> = { title: 'registry/media-transcript', component: MediaTranscript };
export default meta;
type Story = StoryObj<typeof MediaTranscript>;

const cues = [
  { start: 0, end: 2, speaker: 'Host', text: 'Welcome back to the show.' },
  { start: 2, end: 5, speaker: 'Guest', text: 'Great to be here.' },
  { start: 5, end: 9, speaker: 'Host', text: 'Today: glass.' },
];
export const Default: Story = { args: { cues } };
export const Static: Story = { args: { cues } };
export const Empty: Story = { args: { cues: [] } };
export const RTL: Story = { args: { cues }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { cues }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { cues }, parameters: { agEnvironment: { forcedColors: 'active' } } };
