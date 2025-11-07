import type { Meta, StoryObj } from '@storybook/react';
import { GlassGestureZone } from './GlassGestureZone';

const meta = {
  title: 'Glass UI/Interactive/GlassGestureZone',
  component: GlassGestureZone,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    height: {
      control: { type: 'range', min: 200, max: 600, step: 50 },
    },
    sensitivity: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
    },
    trailColor: {
      control: { type: 'color' },
      type: 'string',
      table: { type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof GlassGestureZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 600,
    height: 400,
    active: true,
    showControls: true,
    showTrail: true,
    showFeedback: true,
  },
};

export const BasicGestures: Story = {
  args: {
    width: 500,
    height: 300,
    sensitivity: 0.8,
    showTrail: true,
    showFeedback: true,
    debug: false,
  },
};

export const MultiTouchEnabled: Story = {
  args: {
    width: 600,
    height: 400,
    multiTouch: true,
    maxTouches: 3,
    showTrail: true,
    trailColor: 'var(--glass-color-success)',
  },
};

export const HighSensitivity: Story = {
  args: {
    width: 400,
    height: 300,
    sensitivity: 1,
    minGesturePoints: 2,
    showTrail: true,
    showFeedback: true,
  },
};

export const CustomTrail: Story = {
  args: {
    width: 500,
    height: 350,
    showTrail: true,
    trailColor: '#8B5CF6',
    trailFadeDuration: 3000,
    showFeedback: false,
  },
};

export const DebugMode: Story = {
  args: {
    width: 600,
    height: 400,
    debug: true,
    showTrail: true,
    showFeedback: true,
    showControls: true,
  },
};

export const MinimalInterface: Story = {
  args: {
    width: 400,
    height: 250,
    showControls: false,
    showTrail: false,
    showFeedback: true,
    sensitivity: 0.7,
  },
};

export const CustomGestures: Story = {
  args: {
    width: 600,
    height: 400,
    gestureTemplates: [
      {
        name: 'Triangle',
        type: 'triangle',
        points: [
          { x: 0, y: -1 },
          { x: 0.866, y: 0.5 },
          { x: -0.866, y: 0.5 },
          { x: 0, y: -1 }
        ],
        threshold: 0.4
      },
      {
        name: 'Square',
        type: 'square',
        points: [
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: 1, y: 1 },
          { x: -1, y: 1 },
          { x: -1, y: -1 }
        ],
        threshold: 0.3
      },
      {
        name: 'Zigzag',
        type: 'zigzag',
        points: [
          { x: -1, y: 0 },
          { x: -0.5, y: -1 },
          { x: 0, y: 0 },
          { x: 0.5, y: -1 },
          { x: 1, y: 0 }
        ],
        threshold: 0.4
      }
    ],
    showTrail: true,
    showFeedback: true,
    debug: true,
  },
};

export const InteractivePlayground: Story = {
  args: {
    width: 700,
    height: 500,
    active: true,
    sensitivity: 0.8,
    multiTouch: true,
    maxTouches: 2,
    showTrail: true,
    trailColor: 'var(--glass-color-primary)',
    showFeedback: true,
    feedbackDuration: 2000,
    showControls: true,
    debug: false,
    gestureTemplates: [
      {
        name: 'Heart',
        type: 'heart',
        points: [
          { x: 0, y: 0.3 },
          { x: -0.5, y: -0.3 },
          { x: -0.8, y: -0.7 },
          { x: -0.3, y: -1 },
          { x: 0, y: -0.5 },
          { x: 0.3, y: -1 },
          { x: 0.8, y: -0.7 },
          { x: 0.5, y: -0.3 },
          { x: 0, y: 0.3 }
        ],
        threshold: 0.25
      },
      {
        name: 'Star',
        type: 'star',
        points: [
          { x: 0, y: -1 },
          { x: 0.2, y: -0.3 },
          { x: 1, y: -0.3 },
          { x: 0.3, y: 0.1 },
          { x: 0.6, y: 1 },
          { x: 0, y: 0.4 },
          { x: -0.6, y: 1 },
          { x: -0.3, y: 0.1 },
          { x: -1, y: -0.3 },
          { x: -0.2, y: -0.3 },
          { x: 0, y: -1 }
        ],
        threshold: 0.3
      }
    ],
  },
};

export const TouchInterface: Story = {
  args: {
    width: 400,
    height: 300,
    multiTouch: true,
    showTrail: true,
    trailColor: 'var(--glass-color-warning)',
    sensitivity: 0.9,
    showFeedback: true,
    showControls: false,
  },
};
