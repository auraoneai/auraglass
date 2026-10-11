import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { MediaNowPlaying } from './index';

const meta: Meta<typeof MediaNowPlaying> = {
  title: 'registry/media-now-playing',
  component: MediaNowPlaying,
  parameters: { ag: { subject: 'media-now-playing', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof MediaNowPlaying>;

const base = { src: '/media/track.mp3', title: 'Refraction', subtitle: 'AuraOne Sounds', artworkSrc: '/media/art.jpg' };
export const Default: Story = { args: base };
export const Playing: Story = { args: base };
export const Empty: Story = { args: { src: '', title: '' } };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
