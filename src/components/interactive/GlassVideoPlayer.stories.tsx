import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassVideoPlayer } from './GlassVideoPlayer';

const DEMO_VIDEO_SRC =
  "data:video/mp4;base64,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";

const DEMO_SUBTITLES_SRC = `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT

00:00.000 --> 00:02.000
AuraGlass local demo media.

00:02.000 --> 00:04.000
Subtitles load from an inline VTT track.
`)}`;

const posterDataUri = (label: string) =>
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
            ` font-size='28' font-family='Inter, Arial, Helvetica, sans-serif' fill='#ffffff' opacity='0.9'>` +
        label +
      `</text>` +
    `</svg>`
  );

const meta: Meta<typeof GlassVideoPlayer> = {
  title: 'Media/Glass Video Player',
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
  decorators: [
    (Story) => (
      <div style={{ width: 'min(860px, calc(100vw - 64px))' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassVideoPlayer>;

export const Default: Story = {
  args: {
    sources: [
      {
        src: DEMO_VIDEO_SRC,
        type: 'video/mp4',
        quality: '720p',
      },
    ],
    poster: posterDataUri('Video Poster'),
    onPlay: fn(),
    onPause: fn(),
  },
};

export const WithSubtitles: Story = {
  args: {
    sources: [
      {
        src: DEMO_VIDEO_SRC,
        type: 'video/mp4',
      },
    ],
    poster: posterDataUri('Subtitled Video'),
    title: 'Video with Subtitles',
    subtitles: [
      {
        src: DEMO_SUBTITLES_SRC,
        label: 'English',
        language: 'en',
        default: true,
      },
    ],
    enableFullscreen: true,
    enablePiP: true,
  },
};
