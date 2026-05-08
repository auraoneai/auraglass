import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBottomNav } from './GlassBottomNav';

const sampleNavItems = [
  { id: 'home', label: 'Home', icon: <span>H</span>, activeIcon: <span>H</span> },
  { id: 'search', label: 'Search', icon: <span>S</span>, activeIcon: <span>S</span> },
  {
    id: 'favorites',
    label: 'Saved',
    icon: <span>V</span>,
    activeIcon: <span>V</span>,
    badge: '3',
    badgeVariant: 'error' as const,
  },
  { id: 'profile', label: 'Profile', icon: <span>P</span>, activeIcon: <span>P</span> },
];

const meta: Meta<typeof GlassBottomNav> = {
  title: 'Navigation/Glass Bottom Nav',
  component: GlassBottomNav,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Mobile bottom navigation shown inside a phone-sized app frame without native button chrome.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'floating', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showLabels: { control: 'boolean' },
    labelPosition: { control: 'select', options: ['below', 'beside'] },
    sticky: { control: 'boolean' },
    safeArea: { control: 'boolean' },
    activeId: { control: 'select', options: ['home', 'search', 'favorites', 'profile'] },
  },
};

export default meta;
type Story = StoryObj<typeof GlassBottomNav>;

const renderCleanItem: React.ComponentProps<typeof GlassBottomNav>['renderItem'] = (item, active) => (
  <button
    type="button"
    style={{
      width: '100%',
      minHeight: 52,
      border: 0,
      borderRadius: 14,
      background: active ? '#bfdbfe' : 'transparent',
      color: active ? '#0f172a' : '#cbd5e1',
      font: 'inherit',
      display: 'grid',
      placeItems: 'center',
      gap: 2,
      position: 'relative',
    }}
  >
    <span style={{ fontWeight: 700 }}>{active && item.activeIcon ? item.activeIcon : item.icon}</span>
    <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
    {item.badge && (
      <span
        style={{
          position: 'absolute',
          top: 3,
          right: 8,
          minWidth: 18,
          height: 18,
          borderRadius: 999,
          background: '#ef4444',
          color: '#fff',
          fontSize: 11,
          lineHeight: '18px',
        }}
      >
        {item.badge}
      </span>
    )}
  </button>
);

const PhoneFrame = (props: React.ComponentProps<typeof GlassBottomNav>) => (
  <div
    data-bg="dark"
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 16,
      boxSizing: 'border-box',
      background:
        'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.92) 48%, rgba(8,47,73,0.9) 100%)',
    }}
  >
  <div
    className="glass-flex glass-w-full glass-max-w-sm glass-flex-col glass-overflow-hidden glass-rounded-[2rem] glass-border glass-border-white/40 glass-shadow-2xl"
    style={{
      width: '100%',
      maxWidth: 390,
      minHeight: 560,
      background: 'rgba(15,23,42,0.78)',
      color: '#f8fafc',
    }}
  >
    <div className="glass-flex-1 glass-space-y-4 glass-p-5">
      <div>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: '#cbd5e1' }}>
          Mobile shell
        </p>
        <h3 className="glass-text-xl glass-font-semibold" style={{ color: '#f8fafc' }}>Daily overview</h3>
      </div>
      {['Pipeline review', 'Saved accounts', 'Profile updates'].map((item) => (
        <div
          key={item}
          className="glass-rounded-xl glass-p-4 glass-text-sm"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
        >
          {item}
        </div>
      ))}
    </div>
    <GlassBottomNav {...props} className="glass-w-full" sticky={false} safeArea={false} renderItem={renderCleanItem} />
  </div>
  </div>
);

export const Default: Story = {
  render: (args) => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'home',
    variant: 'default',
    size: 'md',
    showLabels: true,
    labelPosition: 'below',
  },
};

export const Floating: Story = {
  render: (args) => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'search',
    variant: 'floating',
    size: 'md',
    showLabels: true,
    labelPosition: 'below',
  },
};

export const Minimal: Story = {
  render: (args) => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'favorites',
    variant: 'minimal',
    size: 'md',
    showLabels: true,
    labelPosition: 'below',
  },
};

export const WithoutLabels: Story = {
  render: (args) => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'profile',
    variant: 'default',
    size: 'md',
    showLabels: false,
  },
};

export const LargeSize: Story = {
  render: (args) => <PhoneFrame {...args} />,
  args: {
    items: sampleNavItems,
    activeId: 'home',
    variant: 'default',
    size: 'lg',
    showLabels: true,
    labelPosition: 'below',
  },
};
