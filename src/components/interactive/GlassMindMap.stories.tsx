import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMindMap } from './GlassMindMap';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassMindMap> = {
  title: 'Workflows/Glass Mind Map',
  component: GlassMindMap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmindmap component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    editable: {
      control: 'boolean',
      description: 'Enable node editing',
    },
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'radial'],
      description: 'Layout direction',
    },
    showMinimap: {
      control: 'boolean',
      description: 'Show mini-map',
    },
    zoomable: {
      control: 'boolean',
      description: 'Enable zoom and pan',
    },
  },
  args: {
    className: '',
    editable: false,
    direction: 'horizontal',
    showMinimap: true,
    zoomable: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassMindMap>;

export const Default: Story = {
  args: {
    data: {
      id: 'root',
      label: 'Project Planning',
      children: [
        {
          id: 'research',
          label: 'Research',
          children: [
            { id: 'market', label: 'Market Analysis' },
            { id: 'competitors', label: 'Competitor Research' },
          ],
        },
        {
          id: 'development',
          label: 'Development',
          children: [
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'testing', label: 'Testing' },
          ],
        },
        {
          id: 'deployment',
          label: 'Deployment',
          children: [
            { id: 'staging', label: 'Staging' },
            { id: 'production', label: 'Production' },
          ],
        },
      ],
    },
    onNodeClick: fn(),
  },
};

export const ComplexMindMap: Story = {
  args: {
    data: {
      id: 'root',
      label: 'AI Development',
      children: [
        {
          id: 'ml',
          label: 'Machine Learning',
          children: [
            {
              id: 'supervised',
              label: 'Supervised Learning',
              children: [
                { id: 'classification', label: 'Classification' },
                { id: 'regression', label: 'Regression' },
              ],
            },
            {
              id: 'unsupervised',
              label: 'Unsupervised Learning',
              children: [
                { id: 'clustering', label: 'Clustering' },
                { id: 'dimensionality', label: 'Dimensionality Reduction' },
              ],
            },
          ],
        },
        {
          id: 'nlp',
          label: 'Natural Language Processing',
          children: [
            { id: 'sentiment', label: 'Sentiment Analysis' },
            { id: 'translation', label: 'Machine Translation' },
            { id: 'generation', label: 'Text Generation' },
          ],
        },
        {
          id: 'vision',
          label: 'Computer Vision',
          children: [
            { id: 'detection', label: 'Object Detection' },
            { id: 'recognition', label: 'Image Recognition' },
            { id: 'segmentation', label: 'Image Segmentation' },
          ],
        },
      ],
    },
    direction: 'radial',
    onNodeClick: fn(),
  },
};
