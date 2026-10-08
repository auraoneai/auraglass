// Waveform.stories.tsx — internal 5.1 component states (SURF-469).
import type { Meta, StoryObj } from '@storybook/react';
import { Waveform } from './Waveform/Waveform';
import { WaveformLevel } from './Waveform/WaveformLevel';
import peaks from './__fixtures__/peaks-voice.json';

const meta = {
  title: 'Media/Waveform',
  parameters: { ag: { subject: 'Waveform', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Peaks: Story = { render: () => <Waveform peaks={peaks.peaks} label="Voice waveform" /> };
export const HalfProgress: Story = { render: () => <Waveform peaks={peaks.peaks} progress={0.5} label="Voice waveform" /> };
export const Thin: Story = { render: () => <Waveform peaks={peaks.peaks} bars={16} height={32} label="Voice waveform" /> };
export const LiveLevel: Story = { render: () => <WaveformLevel level={0.6} label="Input level" /> };
export const Muted: Story = { render: () => <WaveformLevel level={0.05} label="Input level" /> };
