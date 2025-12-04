import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCoachmarks } from './GlassCoachmarks';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassCoachmarks> = {
  title: 'Components/Interactive/GlassCoachmarks',
  component: GlassCoachmarks,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscoachmarks component.',
      },
    },
  },
  argTypes: {
    steps: {
      control: 'object',
      description: 'Array of coachmark steps',
    },
    current: {
      control: 'number',
      description: 'Current step index',
    },
  },
  args: {
    steps: [
      {
        id: '1',
        content: (
          <div>
            <h3 className="glass-font-semibold glass-mb-2">Welcome to GlassCoachmarks!</h3>
            <p className="glass-text-sm">This is your first step in the guided tour.</p>
          </div>
        ),
      },
      {
        id: '2',
        content: (
          <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 2</h3>
            <p className="glass-text-sm">Learn about the features available.</p>
          </div>
        ),
      },
    ],
    current: 0,
  },
};

export default meta;
type Story = StoryObj<typeof GlassCoachmarks>;

export const Default: Story = {
  args: {
    steps: [
      {
        id: 'welcome',
        content: (
          <div>
            <h3 className="glass-font-semibold glass-mb-2">Welcome!</h3>
            <p className="glass-text-sm">This is a guided tour of the application.</p>
          </div>
        ),
      },
    ],
    current: 0,
    onNext: fn(),
    onPrev: fn(),
    onClose: fn(),
  },
};

export const MultiStep: Story = {
  args: {
    steps: [
      {
        id: 'step1',
        content: (
          <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 1</h3>
            <p className="glass-text-sm">First step in the tour.</p>
          </div>
        ),
      },
      {
        id: 'step2',
        content: (
          <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 2</h3>
            <p className="glass-text-sm">Second step with more information.</p>
          </div>
        ),
      },
      {
        id: 'step3',
        content: (
          <div>
            <h3 className="glass-font-semibold glass-mb-2">Step 3</h3>
            <p className="glass-text-sm">Final step of the tour.</p>
          </div>
        ),
      },
    ],
    current: 1,
    onNext: fn(),
    onPrev: fn(),
    onClose: fn(),
  },
};
