import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PageTransitionDemo } from './PageTransitionDemo';

const meta: Meta<typeof PageTransitionDemo> = {
  title: 'Effects + Advanced/Page Transition Demo',
  component: PageTransitionDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'AnimatePresence-based page transition with blur-on-enter and springy ease-out.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageTransitionDemo>;

export const Default: Story = {
  render: () => <PageTransitionDemo />,
};

