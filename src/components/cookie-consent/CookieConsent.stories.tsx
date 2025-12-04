import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CookieConsent } from './CookieConsent';
import { cn } from '../../lib/utils';

const meta: Meta<typeof CookieConsent> = {
  title: 'Components/Cookie-consent/CookieConsent',
  component: CookieConsent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism cookieconsent component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    title: {
      control: 'text',
      description: 'Cookie consent title',
    },
    message: {
      control: 'text',
      description: 'Cookie consent message',
    },
    position: {
      control: 'select',
      options: ['bottom', 'top', 'bottom-left', 'bottom-right', 'top-left', 'top-right'],
      description: 'Position of the cookie consent banner',
    },
    acceptButtonText: {
      control: 'text',
      description: 'Text for accept button',
    },
    declineButtonText: {
      control: 'text',
      description: 'Text for decline button',
    },
  },
  args: {
    className: '',
    title: 'We use cookies',
    message: 'This website uses cookies to enhance your experience. Please accept to continue.',
    position: 'bottom',
    acceptButtonText: 'Accept All',
    declineButtonText: 'Decline',
  },
};

export default meta;
type Story = StoryObj<typeof CookieConsent>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <CookieConsent {...args} />
    </div>
  ),
};
