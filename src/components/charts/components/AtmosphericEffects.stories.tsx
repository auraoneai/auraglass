import type { Meta, StoryObj } from '@storybook/react';
import { AtmosphericEffects } from './AtmosphericEffects';

const meta: Meta<typeof AtmosphericEffects> = {
  title: 'Components/Components/AtmosphericEffects',
  component: AtmosphericEffects,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism atmosphericeffects component.',
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
type Story = StoryObj<typeof AtmosphericEffects>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <AtmosphericEffects {...args}>
        Default
      </AtmosphericEffects>
    </div>
  ),
  args: {
    
  },
};
