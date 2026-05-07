import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassImageViewer } from './GlassImageViewer';
import { fn } from '@storybook/test';

const viewerImage = (title: string, accent: string, width = 800, height = 600) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.55" stop-color="${accent}"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${width * 0.76}" cy="${height * 0.26}" r="${Math.min(width, height) * 0.18}" fill="rgba(255,255,255,.18)"/>
      <rect x="${width * 0.1}" y="${height * 0.16}" width="${width * 0.5}" height="${height * 0.13}" rx="22" fill="rgba(255,255,255,.16)"/>
      <rect x="${width * 0.1}" y="${height * 0.76}" width="${width * 0.72}" height="${height * 0.035}" rx="12" fill="rgba(255,255,255,.22)"/>
      <text x="${width * 0.1}" y="${height * 0.68}" font-family="Inter, Arial, sans-serif" font-size="${Math.max(24, width * 0.052)}" font-weight="700" fill="#ffffff">${title}</text>
    </svg>
  `)}`;

const meta: Meta<typeof GlassImageViewer> = {
  title: 'Media/Glass Image Viewer',
  component: GlassImageViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassimageviewer component.',
      },
    },
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Array of images to display',
    },
    initialIndex: {
      control: 'number',
      description: 'Initial image index to display',
    },
    enableZoom: {
      control: 'boolean',
      description: 'Whether to enable zoom functionality',
    },
    enablePan: {
      control: 'boolean',
      description: 'Whether to enable pan functionality',
    },
    enableRotation: {
      control: 'boolean',
      description: 'Whether to enable rotation',
    },
    enableFullscreen: {
      control: 'boolean',
      description: 'Whether to enable fullscreen mode',
    },
    enableNavigation: {
      control: 'boolean',
      description: 'Whether to enable image navigation',
    },
    showZoomControls: {
      control: 'boolean',
      description: 'Whether to show zoom controls',
    },
    showRotationControls: {
      control: 'boolean',
      description: 'Whether to show rotation controls',
    },
    showDownloadButton: {
      control: 'boolean',
      description: 'Whether to show download button',
    },
    showImageInfo: {
      control: 'boolean',
      description: 'Whether to show image information',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Whether to auto-play slideshow',
    },
    autoPlayInterval: {
      control: 'number',
      description: 'Auto-play interval in milliseconds',
    },
  },
  args: {
    images: [
      {
        src: viewerImage('Landscape', '#2563eb'),
        alt: 'Sample Image 1',
        title: 'Beautiful Landscape',
        description: 'A stunning landscape view',
        width: 800,
        height: 600,
      },
      {
        src: viewerImage('Architecture', '#7c3aed'),
        alt: 'Sample Image 2',
        title: 'Urban Architecture',
        description: 'Modern city architecture',
        width: 800,
        height: 600,
      },
      {
        src: viewerImage('Nature Detail', '#0f766e'),
        alt: 'Sample Image 3',
        title: 'Nature Close-up',
        description: 'Detailed nature photography',
        width: 800,
        height: 600,
      },
    ],
    initialIndex: 0,
    enableZoom: true,
    enablePan: true,
    enableRotation: true,
    enableFullscreen: true,
    enableNavigation: true,
    showZoomControls: true,
    showRotationControls: true,
    showDownloadButton: true,
    showImageInfo: true,
    autoPlay: false,
    autoPlayInterval: 3000,
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassImageViewer>;

export const Default: Story = {
  args: {
    images: [
      {
        src: viewerImage('Sample Image', '#2563eb', 600, 400),
        alt: 'Default Image',
        title: 'Sample Image',
        description: 'A sample image for the image viewer',
      },
    ],
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn(),
  },
};

export const Variants: Story = {
  args: {
    images: [
      {
        src: viewerImage('Gallery 1', '#7c3aed', 600, 400),
        alt: 'Gallery Image 1',
        title: 'Gallery Image 1',
        description: 'First image in gallery',
      },
      {
        src: viewerImage('Gallery 2', '#0f766e', 600, 400),
        alt: 'Gallery Image 2',
        title: 'Gallery Image 2',
        description: 'Second image in gallery',
      },
    ],
    enableZoom: true,
    enablePan: true,
    enableRotation: true,
    enableFullscreen: true,
    enableNavigation: true,
    showZoomControls: true,
    showRotationControls: true,
    showDownloadButton: true,
    showImageInfo: true,
    autoPlay: true,
    autoPlayInterval: 5000,
    onImageChange: fn(),
    onZoomChange: fn(),
    onFullscreenChange: fn(),
  },
};
