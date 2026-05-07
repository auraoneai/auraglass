import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassGallery } from './GlassGallery';
import { fn } from '@storybook/test';

const galleryImage = (title: string, accent: string, width = 400, height = 300) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.58" stop-color="${accent}"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${width * 0.78}" cy="${height * 0.28}" r="${Math.min(width, height) * 0.18}" fill="rgba(255,255,255,.18)"/>
      <rect x="${width * 0.12}" y="${height * 0.18}" width="${width * 0.48}" height="${height * 0.16}" rx="18" fill="rgba(255,255,255,.18)"/>
      <text x="${width * 0.12}" y="${height * 0.72}" font-family="Inter, Arial, sans-serif" font-size="${Math.max(18, width * 0.06)}" font-weight="700" fill="#ffffff">${title}</text>
    </svg>
  `)}`;

const meta: Meta<typeof GlassGallery> = {
  title: 'Media/Glass Gallery',
  component: GlassGallery,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassgallery component.',
      },
    },
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Array of gallery images',
    },
    layout: {
      control: 'select',
      options: ['grid', 'masonry', 'list'],
      description: 'Gallery layout type',
    },
    columns: {
      control: 'number',
      description: 'Number of columns for grid layout',
    },
    aspectRatio: {
      control: 'select',
      options: ['square', 'portrait', 'landscape', 'auto'],
      description: 'Image aspect ratio',
    },
    showInfo: {
      control: 'boolean',
      description: 'Whether to show image information',
    },
    showActions: {
      control: 'boolean',
      description: 'Whether to show image actions',
    },
    enableLightbox: {
      control: 'boolean',
      description: 'Whether to enable lightbox on image click',
    },
  },
  args: {
    images: [
      {
        id: '1',
        src: galleryImage('Landscape', '#2563eb'),
        alt: 'Sample Image 1',
        title: 'Beautiful Landscape',
        description: 'A stunning landscape view',
        tags: ['nature', 'landscape'],
        likes: 42,
        views: 128,
        category: 'Nature',
      },
      {
        id: '2',
        src: galleryImage('Architecture', '#7c3aed'),
        alt: 'Sample Image 2',
        title: 'Urban Architecture',
        description: 'Modern city architecture',
        tags: ['urban', 'architecture'],
        likes: 28,
        views: 95,
        category: 'Architecture',
      },
      {
        id: '3',
        src: galleryImage('Abstract', '#db2777'),
        alt: 'Sample Image 3',
        title: 'Abstract Art',
        description: 'Contemporary abstract art',
        tags: ['art', 'abstract'],
        likes: 67,
        views: 203,
        category: 'Art',
      },
    ],
    layout: 'grid',
    columns: 3,
    aspectRatio: 'square',
    showInfo: true,
    showActions: true,
    enableLightbox: true,
    onImageClick: fn(),
    onSelectionChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassGallery>;

export const Default: Story = {
  args: {
    images: [
      {
        id: '1',
        src: galleryImage('Sample 1', '#2563eb', 300, 300),
        alt: 'Gallery Image 1',
        title: 'Sample Image 1',
        description: 'A beautiful sample image',
        tags: ['sample'],
        likes: 12,
        views: 45,
      },
      {
        id: '2',
        src: galleryImage('Sample 2', '#0f766e', 300, 300),
        alt: 'Gallery Image 2',
        title: 'Sample Image 2',
        description: 'Another beautiful sample image',
        tags: ['sample'],
        likes: 8,
        views: 32,
      },
      {
        id: '3',
        src: galleryImage('Sample 3', '#7c3aed', 300, 300),
        alt: 'Gallery Image 3',
        title: 'Sample Image 3',
        description: 'Third sample image',
        tags: ['sample'],
        likes: 15,
        views: 67,
      },
    ],
    onImageClick: fn(),
    onSelectionChange: fn(),
  },
};

export const Variants: Story = {
  args: {
    images: [
      {
        id: '1',
        src: galleryImage('Portrait', '#be123c', 400, 600),
        alt: 'Portrait Image',
        title: 'Portrait Layout',
        description: 'Image with portrait aspect ratio',
        tags: ['portrait'],
        likes: 25,
        views: 89,
      },
      {
        id: '2',
        src: galleryImage('Landscape', '#0f766e', 600, 400),
        alt: 'Landscape Image',
        title: 'Landscape Layout',
        description: 'Image with landscape aspect ratio',
        tags: ['landscape'],
        likes: 18,
        views: 73,
      },
    ],
    layout: 'masonry',
    columns: 2,
    aspectRatio: 'auto',
    onImageClick: fn(),
    onSelectionChange: fn(),
  },
};
