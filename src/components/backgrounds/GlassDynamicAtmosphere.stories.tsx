import type { Meta, StoryObj } from '@storybook/react';
import { DynamicAtmosphere } from './GlassDynamicAtmosphere';

import { cn } from '../../lib/utils';
const meta: Meta<typeof DynamicAtmosphere> = {
  title: 'Components/Backgrounds/DynamicAtmosphere',
  component: DynamicAtmosphere,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdynamicatmosphere component.',
      },
    },
  },
  argTypes: {
    // Component-specific argTypes will be added here
  },
  args: {
    // Default args will be added here
  },
};

export default meta;
type Story = StoryObj<typeof DynamicAtmosphere>;

export const Default: Story = {
  args: {
    type: 'subtle',
    intensity: 0.5,
    speed: 0.5,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <DynamicAtmosphere {...args} type="subtle" />
      <DynamicAtmosphere {...args} type="nebula" />
      <DynamicAtmosphere {...args} type="aurora" />
      <DynamicAtmosphere {...args} type="particles" />
    </div>
  ),
};
