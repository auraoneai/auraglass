import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassLazyImage } from './GlassLazyImage';
import { fn } from '@storybook/test';

const lazyImage = (title: string, accent: string, width = 400, height = 300) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#020617"/>
          <stop offset="0.6" stop-color="${accent}"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect x="${width * 0.12}" y="${height * 0.16}" width="${width * 0.52}" height="${height * 0.16}" rx="18" fill="rgba(255,255,255,.16)"/>
      <circle cx="${width * 0.78}" cy="${height * 0.36}" r="${Math.min(width, height) * 0.16}" fill="rgba(255,255,255,.18)"/>
      <text x="${width * 0.12}" y="${height * 0.74}" font-family="Inter, Arial, sans-serif" font-size="${Math.max(18, width * 0.055)}" font-weight="700" fill="#ffffff">${title}</text>
    </svg>
  `)}`;

const placeholderImage =
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#e2e8f0"/>
      <rect x="80" y="128" width="240" height="24" rx="12" fill="#cbd5e1"/>
    </svg>
  `)}`;

const meta: Meta<typeof GlassLazyImage> = {
  title: 'Media/Glass Lazy Image',
  component: GlassLazyImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasslazyimage component.',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    placeholder: {
      control: 'text',
      description: 'Low quality placeholder image URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    title: {
      control: 'text',
      description: 'Image title',
    },
    width: {
      control: 'number',
      description: 'Image width',
    },
    height: {
      control: 'number',
      description: 'Image height',
    },
    objectFit: {
      control: 'select',
      options: ['contain', 'cover', 'fill', 'none', 'scale-down'],
      description: 'CSS object-fit property',
    },
    blur: {
      control: 'boolean',
      description: 'Enable blur placeholder',
    },
  },
  args: {
    src: lazyImage('Lazy Image', '#2563eb'),
    placeholder: placeholderImage,
    alt: 'Sample image',
    title: 'Beautiful landscape',
    width: 400,
    height: 300,
    objectFit: 'cover',
    blur: true,
    onLoad: fn(),
    onError: fn(),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          boxSizing: 'border-box',
          display: 'grid',
          minHeight: '100vh',
          overflow: 'hidden',
          padding: 16,
          placeItems: 'center',
          width: 'min(100%, calc(100vw - 64px))',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassLazyImage>;

export const Default: Story = {
  args: {
    src: lazyImage('Default', '#0f766e', 300, 200),
    alt: 'Default lazy image',
    title: 'Sample lazy loaded image',
    width: 'min(100%, 300px)',
    height: 200,
    onLoad: fn(),
    onError: fn(),
  },
};

export const Variants: Story = {
  args: {
    src: lazyImage('Variant', '#7c3aed', 500, 400),
    alt: 'Variant lazy image',
    title: 'High quality lazy image',
    width: 500,
    height: 400,
    objectFit: 'contain',
    blur: false,
    onLoad: fn(),
    onError: fn(),
  },
};
