import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassResponsiveNav } from './GlassResponsiveNav';

const meta: Meta<typeof GlassResponsiveNav> = {
  title: 'Navigation/Glass Responsive Nav',
  component: GlassResponsiveNav,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Responsive navigation framed in desktop and mobile app surfaces without clipped chrome.',
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
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassResponsiveNav>;

const sections = [
  {
    id: 'main',
    label: 'Main',
    items: [
      { id: 'home', label: 'Home', icon: 'H', href: '/home' },
      { id: 'reports', label: 'Reports', icon: 'R', href: '/reports', badge: 4 },
      { id: 'settings', label: 'Settings', icon: 'S', href: '/settings' },
    ],
  },
];

const bottomItems = [
  { id: 'home', label: 'Home', icon: 'H', href: '/home' },
  { id: 'reports', label: 'Reports', icon: 'R', href: '/reports', badge: 4 },
  { id: 'settings', label: 'Settings', icon: 'S', href: '/settings' },
];

export const Default: Story = {
  render: (args) => (
    <div className="glass-min-h-screen glass-w-full glass-p-6">
      <div className="glass-mx-auto glass-flex glass-w-full glass-max-w-6xl glass-flex-col glass-overflow-hidden glass-rounded-2xl glass-bg-white/60 glass-shadow-2xl lg:glass-flex-row">
        <aside className="glass-border-b glass-border-white/30 glass-bg-white/70 glass-p-5 lg:glass-w-64 lg:glass-border-b-0 lg:glass-border-r">
          <div className="glass-text-sm glass-font-semibold glass-text-primary">Desktop shell</div>
          <div className="glass-mt-5 glass-flex glass-flex-wrap glass-gap-2 lg:glass-flex-col">
            {sections[0].items.map((item, index) => (
              <a
                key={item.id}
                href="#"
                className={[
                  'glass-rounded-lg glass-px-3 glass-py-2 glass-text-sm glass-font-medium',
                  index === 1 ? 'glass-bg-blue-100 glass-text-blue-800' : 'glass-text-secondary',
                ].join(' ')}
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>
        <main className="glass-min-h-[520px] glass-min-w-0 glass-flex-1 glass-p-5">
          <GlassResponsiveNav
            {...args}
            config={{ mobileBreakpoint: 360, mobileNavType: 'bottom' }}
            navigation={sections}
            bottomNavItems={bottomItems}
            activePath="/reports"
            activeBottomNavId="reports"
            logo={<span className="glass-font-semibold">Aura</span>}
            title="Responsive navigation"
          />
          <section className="glass-rounded-xl glass-bg-white/70 glass-p-5 glass-shadow-sm">
            <h1 className="glass-text-2xl glass-font-semibold glass-text-primary">Reports</h1>
            <p className="glass-mt-2 glass-text-sm glass-text-secondary">
              Desktop navigation and the adaptive component share a bounded content surface.
            </p>
          </section>
        </main>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-min-h-screen glass-w-full glass-place-items-center glass-p-4">
      <div className="glass-relative glass-flex glass-h-[620px] glass-w-full glass-max-w-sm glass-flex-col glass-overflow-hidden glass-rounded-[2rem] glass-border glass-border-white/40 glass-bg-white/70 glass-shadow-2xl">
        <div className="glass-flex-1 glass-p-5 glass-pt-8">
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary">Mobile viewport</h2>
          <p className="glass-mt-2 glass-text-sm glass-text-secondary">
            Bottom navigation is constrained to the phone frame and leaves content readable.
          </p>
        </div>
          <GlassResponsiveNav
            {...args}
            config={{ mobileBreakpoint: 1200, mobileNavType: 'bottom' }}
          navigation={sections}
          bottomNavItems={bottomItems}
          activePath="/home"
          activeBottomNavId="home"
          title="Mobile menu"
        />
      </div>
    </div>
  ),
};
