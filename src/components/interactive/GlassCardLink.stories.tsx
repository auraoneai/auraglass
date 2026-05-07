import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCardLink } from './GlassCardLink';
import { cn } from '../../lib/utils';
import { Zap, Star, Heart } from 'lucide-react';

const meta: Meta<typeof GlassCardLink> = {
  title: 'Effects + Advanced/Glass Card Link',
  component: GlassCardLink,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An enhanced card with 3D transform effects and link functionality with physics-inspired animations.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title text',
    },
    description: {
      control: 'text',
      description: 'Card description text',
    },
    link: {
      control: 'text',
      description: 'URL to navigate to when clicked',
    },
    buttonText: {
      control: 'text',
      description: 'Text for the call-to-action button',
    },
    glassVariant: {
      control: { type: 'select' },
      options: ['clear', 'frosted', 'tinted', 'luminous'],
      description: 'Glass styling variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    title: 'Interactive Card',
    description: 'This card demonstrates the GlassCardLink component with hover effects and smooth animations.',
    link: '#',
    buttonText: 'Learn More',
    glassVariant: 'frosted',
  },
};

export default meta;
type Story = StoryObj<typeof GlassCardLink>;

export const Default: Story = {
  args: {
    title: 'Default Card',
    description: 'A basic glass card link with default styling.',
    icon: <Zap className="glass-w-6 glass-h-6" />,
  },
};

export const GlassVariants: Story = {
  render: (args) => (
    <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-2xl">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Frosted</h4>
        <GlassCardLink {...args} glassVariant="frosted" title="Frosted Variant" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Clear</h4>
        <GlassCardLink {...args} glassVariant="clear" title="Clear Variant" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Tinted</h4>
        <GlassCardLink {...args} glassVariant="tinted" title="Tinted Variant" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Luminous</h4>
        <GlassCardLink {...args} glassVariant="luminous" title="Luminous Variant" />
      </div>
    </div>
  ),
  args: {
    description: 'Different glass variants for various visual effects.',
    icon: <Star className="glass-w-6 glass-h-6" />,
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Custom Content',
    description: 'This card uses custom children instead of the default layout.',
    children: (
      <div className="glass-p-6 glass-text-center">
        <Heart className="glass-w-12 glass-h-12 glass-mx-auto glass-mb-4 glass-text-primary" />
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">Custom Card Content</h3>
        <p className="glass-text-sm opacity-80">You can render completely custom content inside the card.</p>
      </div>
    ),
  },
};

export const InteractiveDemo: Story = {
  render: (args) => (
    <div className="space-y-6">
      <GlassCardLink
        {...args}
        title="Hover Effects Demo"
        description="Move your mouse over this card to see the 3D transform effects and glow animations."
        icon={<Zap className="glass-w-8 glass-h-8" />}
        buttonText="Try It Out"
      />

      <div className="glass-text-sm glass-text-secondary dark:glass-text-secondary">
        <p>This component features:</p>
        <ul className="list-disc list-inside glass-mt-2 glass-gap-1">
          <li>Physics-based hover animations</li>
          <li>3D transform effects</li>
          <li>Dynamic glow and lighting</li>
          <li>Smooth transitions</li>
        </ul>
      </div>
    </div>
  ),
};
