import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassNavigationMenu } from './GlassNavigationMenu';

const productItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'O',
    description: 'Health and adoption',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: 'W',
    badge: 4,
    children: [
      { id: 'workflows-live', label: 'Live runs', badge: 2 },
      { id: 'workflows-drafts', label: 'Drafts', badge: 2 },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: 'I',
    featured: true,
  },
];

const meta: Meta<typeof GlassNavigationMenu> = {
  title: 'Navigation/Glass Navigation Menu',
  component: GlassNavigationMenu,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Glass navigation menu presented in bounded app panels with readable active and nested states.',
      },
    },
  },
  argTypes: {
    items: { control: 'object', description: 'Array of navigation items' },
    orientation: { control: { type: 'select', options: ['horizontal', 'vertical'] } },
    variant: { control: { type: 'select', options: ['default', 'sidebar', 'header'] } },
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] } },
    activeItem: { control: 'text' },
    collapsed: { control: 'boolean' },
  },
  args: {
    items: productItems,
    orientation: 'vertical',
    variant: 'default',
    size: 'md',
    activeItem: 'overview',
    collapsed: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassNavigationMenu>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <section className="glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl" style={{ width: '100%', maxWidth: 420, background: 'rgba(15,23,42,0.72)', color: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="glass-mb-4">
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-white/70">
          Product nav
        </p>
        <h3 className="glass-text-lg glass-font-semibold glass-text-white">Workspace sections</h3>
      </div>
      <GlassNavigationMenu {...args} className="glass-w-full glass-rounded-xl glass-p-2" />
    </section>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <div className="glass-grid glass-w-full glass-max-w-5xl glass-grid-cols-1 glass-gap-4 lg:glass-grid-cols-3" style={{ width: '100%', maxWidth: 980 }}>
      {[
        ['Default', 'default', 'vertical'],
        ['Sidebar', 'sidebar', 'vertical'],
        ['Header', 'header', 'horizontal'],
      ].map(([label, variant, orientation]) => (
        <section key={label} className="glass-min-w-0 glass-rounded-2xl glass-p-4 glass-shadow-lg" style={{ background: 'rgba(15,23,42,0.72)', color: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <h3 className="glass-mb-3 glass-text-base glass-font-semibold glass-text-white">{label}</h3>
          <GlassNavigationMenu
            {...args}
            variant={variant as any}
            orientation={orientation as any}
            size="sm"
            className="glass-w-full glass-rounded-xl glass-p-2"
          />
        </section>
      ))}
    </div>
    </div>
  ),
  args: {
    items: productItems,
    activeItem: 'overview',
  },
};

export const WithNestedItems: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <section className="glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl" style={{ width: '100%', maxWidth: 420, background: 'rgba(15,23,42,0.72)', color: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <GlassNavigationMenu {...args} className="glass-w-full glass-rounded-xl glass-p-2" />
    </section>
    </div>
  ),
  args: {
    items: productItems,
    activeItem: 'workflows',
  },
};

export const Collapsed: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <section className="glass-rounded-2xl glass-p-4 glass-shadow-xl" style={{ background: 'rgba(15,23,42,0.72)', color: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <GlassNavigationMenu {...args} className="glass-w-20 glass-rounded-xl glass-p-2" />
    </section>
    </div>
  ),
  args: {
    items: productItems,
    activeItem: 'overview',
    collapsed: true,
  },
};
