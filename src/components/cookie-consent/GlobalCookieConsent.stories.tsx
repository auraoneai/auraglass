import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlobalCookieConsent } from './GlobalCookieConsent';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlobalCookieConsent> = {
  title: 'Components/Cookie-consent/GlobalCookieConsent',
  component: GlobalCookieConsent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism globalcookieconsent component.',
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
    cookieCategories: [
      {
        id: 'essential',
        name: 'Essential',
        description: 'Required for basic site functionality',
        required: true,
        cookies: [
          { name: 'session_id', purpose: 'Authentication', duration: 'Session' },
        ],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Help us understand how you use our site',
        required: false,
        cookies: [
          { name: 'ga_tracking', purpose: 'Page analytics', duration: '2 years' },
        ],
      },
    ],
    defaultSelectedCategories: ['essential'],
    delay: 100, // Reduced delay for Storybook
  },
};

export default meta;
type Story = StoryObj<typeof GlobalCookieConsent>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlobalCookieConsent {...args} />
    </div>
  ),
};
