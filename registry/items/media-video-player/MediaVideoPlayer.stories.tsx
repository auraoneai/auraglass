import type { Meta, StoryObj } from '@storybook/react';
import { MediaVideoPlayer } from './index';

const meta: Meta<typeof MediaVideoPlayer> = {
  parameters: { ag: { subject: 'MediaVideoPlayer', kind: 'showcase' } }, title: 'registry/media-video-player', component: MediaVideoPlayer };
export default meta;
type Story = StoryObj<typeof MediaVideoPlayer>;

const base = { src: '/media/film.mp4', poster: '/media/film.jpg', captions: [{ src: '/media/film.vtt', srclang: 'en', label: 'English' }] };
export const Default: Story = { args: base };
export const Playing: Story = { args: base };
export const Empty: Story = { args: { src: '' } };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
