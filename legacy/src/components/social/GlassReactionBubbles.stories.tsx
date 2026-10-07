import type { Meta, StoryObj } from '@storybook/react';
import { GlassReactionBubbles, type ReactionBubble } from './GlassReactionBubbles';

const mockReactions: ReactionBubble[] = [
  {
    id: '1',
    emoji: '❤️',
    userId: 'user1',
    userName: 'Alice',
    userColor: '#FF6B6B',
    x: 150,
    y: 100,
    timestamp: Date.now() - 1000,
    size: 35,
    velocity: { x: 1, y: -0.5 },
    life: 4000,
    maxLife: 5000
  },
  {
    id: '2',
    emoji: '😂',
    userId: 'user2',
    userName: 'Bob',
    userColor: '#4ECDC4',
    x: 300,
    y: 200,
    timestamp: Date.now() - 2000,
    size: 40,
    velocity: { x: -0.5, y: -1 },
    life: 3000,
    maxLife: 5000
  },
  {
    id: '3',
    emoji: '🎉',
    userId: 'user3',
    userName: 'Carol',
    userColor: '#45B7D1',
    x: 450,
    y: 150,
    timestamp: Date.now() - 500,
    size: 30,
    velocity: { x: 0.8, y: -1.2 },
    life: 4500,
    maxLife: 5000
  }
];

const customEmojis = ['🚀', '⚡', '🌟', '💎', '🔥', '🎊', '🌈', '✨'];

const meta = {
  title: 'Workflows/Glass Reaction Bubbles',
  component: GlassReactionBubbles,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 300, max: 1000, step: 50 },
    },
    height: {
      control: { type: 'range', min: 200, max: 600, step: 50 },
    },
    bubbleLifetime: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
    },
    maxBubbles: {
      control: { type: 'range', min: 10, max: 100, step: 10 },
    },
    gravity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    windForce: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
    },
  },
} satisfies Meta<typeof GlassReactionBubbles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true,
  },
};

export const RealTimeMode: Story = {
  args: {
    width: 700,
    height: 450,
    realTimeMode: true,
    showControls: true,
    showUserNames: true,
    interactive: true,
    soundEnabled: true,
  },
};

export const CustomEmojis: Story = {
  args: {
    width: 600,
    height: 400,
    availableEmojis: customEmojis,
    showControls: true,
    showUserNames: true,
    interactive: true,
  },
};

export const NoControls: Story = {
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    showControls: false,
    showUserNames: true,
    interactive: false,
  },
};

export const CompactView: Story = {
  args: {
    width: 400,
    height: 300,
    reactions: mockReactions.slice(0, 2),
    showControls: true,
    showUserNames: false,
    interactive: true,
  },
};

export const LargeCanvas: Story = {
  args: {
    width: 900,
    height: 600,
    reactions: mockReactions,
    showControls: true,
    showUserNames: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const HighGravity: Story = {
  args: {
    width: 600,
    height: 400,
    gravity: 0.5,
    windForce: 0.1,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const LowGravity: Story = {
  args: {
    width: 600,
    height: 400,
    gravity: 0.02,
    windForce: 0.02,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const NoBounce: Story = {
  args: {
    width: 600,
    height: 400,
    bounceEnabled: false,
    gravity: 0.1,
    windForce: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const LongLifetime: Story = {
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 10000,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const ShortLifetime: Story = {
  args: {
    width: 600,
    height: 400,
    bubbleLifetime: 2000,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const ManyBubbles: Story = {
  args: {
    width: 800,
    height: 500,
    maxBubbles: 100,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const FewBubbles: Story = {
  args: {
    width: 600,
    height: 400,
    maxBubbles: 15,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const NoFadeOut: Story = {
  args: {
    width: 600,
    height: 400,
    fadeOut: false,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const StrongWind: Story = {
  args: {
    width: 600,
    height: 400,
    windForce: 0.2,
    gravity: 0.05,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const SilentMode: Story = {
  args: {
    width: 600,
    height: 400,
    soundEnabled: false,
    showControls: true,
    interactive: true,
    realTimeMode: true,
  },
};

export const ReadOnlyMode: Story = {
  args: {
    width: 600,
    height: 400,
    reactions: mockReactions,
    interactive: false,
    showControls: false,
    showUserNames: true,
  },
};

export const EmojiStorm: Story = {
  args: {
    width: 800,
    height: 500,
    availableEmojis: ['🌪️', '⚡', '🌊', '🔥', '❄️', '🌟'],
    realTimeMode: true,
    maxBubbles: 80,
    gravity: 0.3,
    windForce: 0.15,
    showControls: true,
    interactive: true,
  },
};