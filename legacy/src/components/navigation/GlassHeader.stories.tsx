import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassHeader } from './GlassHeader';

const meta: Meta<typeof GlassHeader> = {
  title: 'Navigation/Glass Header',
  component: GlassHeader,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Header shown as real application chrome with navigation, search, and actions.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof GlassHeader>;

const navLinks = (
  <nav className="glass-hidden glass-items-center glass-gap-2 md:glass-flex" aria-label="Primary">
    {['Overview', 'Reports', 'Automation', 'Settings'].map((item, index) => (
      <a
        key={item}
        href="#"
        className={[
          'glass-rounded-lg glass-px-3 glass-py-2 glass-text-sm glass-font-medium',
          index === 0 ? 'glass-bg-blue-100 glass-text-blue-800' : 'glass-text-secondary',
        ].join(' ')}
      >
        {item}
      </a>
    ))}
  </nav>
);

export const Default: Story = {
  render: (args) => (
    <div className="glass-min-h-screen glass-w-full glass-bg-slate-50">
      <GlassHeader
        {...args}
        className="glass-w-full"
        logo={
          <div>
            <div className="glass-text-sm glass-font-semibold glass-text-primary">Aura Control</div>
            <div className="glass-text-xs glass-text-secondary">Workspace</div>
          </div>
        }
        navigation={navLinks}
        search={{ placeholder: 'Search reports' }}
        actions={[
          { id: 'alerts', label: 'Alerts', badge: 3 },
          { id: 'invite', label: 'Invite' },
        ]}
        userMenu={{
          user: { name: 'Maya Chen', email: 'maya@example.com', status: 'online' },
          items: [
            { id: 'profile', label: 'Profile' },
            { id: 'settings', label: 'Settings' },
            { id: 'sign-out', label: 'Sign out' },
          ],
        }}
      />
      <main className="glass-mx-auto glass-max-w-6xl glass-p-6">
        <section className="glass-rounded-2xl glass-bg-white/70 glass-p-6 glass-shadow-xl">
          <p className="glass-text-sm glass-text-secondary">Header context</p>
          <h1 className="glass-mt-1 glass-text-2xl glass-font-semibold glass-text-primary">
            Weekly business review
          </h1>
          <div className="glass-mt-6 glass-grid glass-grid-cols-3 glass-gap-4">
            {['Revenue', 'Activation', 'Retention'].map((label) => (
              <div key={label} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
                <p className="glass-text-sm glass-text-secondary">{label}</p>
                <div className="glass-mt-2 glass-text-xl glass-font-semibold glass-text-primary">Healthy</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-min-h-screen glass-w-full glass-p-6">
      <GlassHeader
        {...args}
        variant="floating"
        logo={<span className="glass-font-semibold glass-text-primary">Floating Header</span>}
        navigation={navLinks}
        actions={[{ id: 'publish', label: 'Publish' }]}
        className="glass-mx-auto glass-w-full glass-max-w-5xl"
      />
      <div className="glass-mx-auto glass-mt-6 glass-max-w-5xl glass-rounded-2xl glass-bg-white/70 glass-p-6 glass-shadow-lg">
        <h2 className="glass-text-lg glass-font-semibold glass-text-primary">Floating variant</h2>
        <p className="glass-mt-2 glass-text-sm glass-text-secondary">
          The story frames the header above page content instead of leaving it as a flat empty strip.
        </p>
      </div>
    </div>
  ),
  args: {
    className: '',
  },
};
