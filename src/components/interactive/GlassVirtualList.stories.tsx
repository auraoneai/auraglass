import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassVirtualList } from './GlassVirtualList';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassVirtualList> = {
  title: 'Components/Interactive/GlassVirtualList',
  component: GlassVirtualList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassvirtuallist component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    height: {
      control: 'number',
      description: 'Container height',
    },
    itemHeight: {
      control: 'number',
      description: 'Item height (uniform)',
    },
    smoothScroll: {
      control: 'boolean',
      description: 'Enable smooth scrolling',
    },
  },
  args: {
    className: '',
    height: 300,
    itemHeight: 50,
    smoothScroll: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassVirtualList>;

export const Default: Story = {
  args: {
    items: Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      height: 50,
      component: ({ index }: { index: number }) => (
        <div className="p-3 border-b border-white/10">
          Item {index + 1}
        </div>
      ),
      props: { index: i },
    })),
    onEndReached: fn(),
  },
};

export const DynamicHeight: Story = {
  args: {
    items: Array.from({ length: 50 }, (_, i) => ({
      id: `dynamic-${i}`,
      height: 30 + Math.random() * 50, // Random height between 30-80px
      component: ({ index }: { index: number }) => (
        <div className="p-3 border-b border-white/10">
          Dynamic Item {index + 1} - Height: {30 + Math.random() * 50}px
        </div>
      ),
      props: { index: i },
    })),
    estimatedItemHeight: 55,
  },
};
