import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CompactCookieNotice } from './CompactCookieNotice';

const CookieStoryFrame = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    document.cookie = 'cookie-consent=; Max-Age=0; path=/';
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div style={{ width: 'min(100%, 420px)' }}>
      {children}
    </div>
  );
};

const meta: Meta<typeof CompactCookieNotice> = {
  title: 'Workflows/Compact Cookie Notice',
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
  render: (args) => (
    <CookieStoryFrame>
      <CompactCookieNotice
        {...args}
        animate={false}
        forceVisible
        position="bottom"
        style={{
          position: 'static',
          transform: 'none',
          width: '100%',
          maxWidth: '100%',
        }}
      />
    </CookieStoryFrame>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4" style={{ width: 720, maxWidth: '100%' }}>
      {(['bottom', 'top', 'bottom-left', 'bottom-right'] as const).map((position) => (
        <CompactCookieNotice
          key={position}
          {...args}
          position={position}
          style={{ position: 'static', transform: 'none', width: '100%' }}
        />
      ))}
    </div>
  ),
};
