import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CompactCookieNotice } from './CompactCookieNotice';
import { cn } from '../../lib/utils';

const meta: Meta<typeof CompactCookieNotice> = {
  title: 'Components/Cookie-consent/CompactCookieNotice',
  component: CompactCookieNotice,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism compactcookienotice component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class name',
    },
    position: {
      control: { type: 'select' },
      options: ['bottom', 'top', 'bottom-left', 'bottom-right', 'top-left', 'top-right'],
      description: 'Position of the cookie notice',
    },
    message: {
      control: 'text',
      description: 'Cookie consent message',
    },
    acceptText: {
      control: 'text',
      description: 'Accept button text',
    },
    declineText: {
      control: 'text',
      description: 'Decline button text',
    },
    animate: {
      control: 'boolean',
      description: 'Enable animations',
    },
  },
  args: {
    className: '',
    position: 'bottom',
    message: 'This website uses cookies to enhance your experience.',
    acceptText: 'Accept',
    declineText: 'Decline',
    animate: true,
  },
};

export default meta;
type Story = StoryObj<typeof CompactCookieNotice>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <CompactCookieNotice {...args} position="bottom" />
      <CompactCookieNotice {...args} position="top" />
      <CompactCookieNotice {...args} position="bottom-left" />
      <CompactCookieNotice {...args} position="bottom-right" />
    </div>
  ),
};
