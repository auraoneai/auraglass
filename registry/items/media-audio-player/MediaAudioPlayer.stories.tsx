import type { Meta, StoryObj } from '@storybook/react';
import { MediaAudioPlayer } from './index';

const meta: Meta<typeof MediaAudioPlayer> = { title: 'registry/media-audio-player', component: MediaAudioPlayer };
export default meta;
type Story = StoryObj<typeof MediaAudioPlayer>;

const base = { src: '/media/podcast.mp3', captions: [{ src: '/media/podcast.vtt', srclang: 'en', label: 'English' }], 'aria-label': 'Episode 12' };
export const Default: Story = { args: base };
export const Compact: Story = { args: base };
export const Empty: Story = { args: { src: '', 'aria-label': 'Nothing loaded' } };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
