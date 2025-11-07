import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassVideoPlayer } from './GlassVideoPlayer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassVideoPlayer> = {
  title: 'Components/Interactive/GlassVideoPlayer',
  component: GlassVideoPlayer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassvideoplayer component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    title: {
      control: 'text',
      description: 'Video title',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Auto-play video',
    },
    controls: {
      control: 'boolean',
      description: 'Show controls',
    },
    enableFullscreen: {
      control: 'boolean',
      description: 'Enable fullscreen',
    },
  },
  args: {
    className: '',
    title: 'Sample Video',
    autoPlay: false,
    controls: true,
    enableFullscreen: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassVideoPlayer>;

export const Default: Story = {
  args: {
    sources: [
      {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
        quality: '720p',
      },
    ],
    // Use an inline SVG data URI to avoid external network requests
    poster:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>` +
          `<defs>` +
            `<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
              `<stop offset='0%' stop-color='#0066cc'/>` +
              `<stop offset='100%' stop-color='#004a99'/>` +
            `</linearGradient>` +
          `</defs>` +
          `<rect width='100%' height='100%' fill='url(#g)'/>` +
          `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'` +
                ` font-size='28' font-family='Inter, Arial, Helvetica, sans-serif' fill='var(--glass-white)' opacity='0.9'>` +
            `Video Poster` +
          `</text>` +
        `</svg>`
      ),
    onPlay: fn(),
    onPause: fn(),
  },
};

export const WithSubtitles: Story = {
  args: {
    sources: [
      {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        type: 'video/mp4',
      },
    ],
    title: 'Video with Subtitles',
    subtitles: [
      {
        src: 'https://example.com/subtitles.vtt',
        label: 'English',
        language: 'en',
        default: true,
      },
    ],
    enableFullscreen: true,
    enablePiP: true,
  },
};
