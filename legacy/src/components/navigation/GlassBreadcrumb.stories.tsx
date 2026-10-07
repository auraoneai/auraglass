import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  GlassBreadcrumb,
  GlassBreadcrumbItem,
  GlassBreadcrumbLink,
} from './GlassBreadcrumb';

const meta: Meta<typeof GlassBreadcrumb> = {
  title: 'Navigation/Glass Breadcrumb',
  component: GlassBreadcrumb,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Breadcrumb navigation with enough page context to judge contrast and spacing.',
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
type Story = StoryObj<typeof GlassBreadcrumb>;

export const Default: Story = {
  render: (args) => (
    <section className="glass-w-[720px] glass-rounded-2xl glass-bg-white/70 glass-p-6 glass-shadow-xl">
      <GlassBreadcrumb {...args} size="md" elevation="level2">
        <GlassBreadcrumbItem>
          <GlassBreadcrumbLink href="#">Workspaces</GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
        <GlassBreadcrumbItem>
          <GlassBreadcrumbLink href="#">Enterprise</GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
        <GlassBreadcrumbItem>
          <GlassBreadcrumbLink href="#">Reports</GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
        <GlassBreadcrumbItem isCurrentPage>Q2 Forecast</GlassBreadcrumbItem>
      </GlassBreadcrumb>
      <div className="glass-mt-6">
        <p className="glass-text-sm glass-text-secondary">Report path</p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          Q2 Forecast
        </h2>
        <p className="glass-mt-2 glass-text-sm glass-text-secondary">
          Breadcrumbs stay legible on a realistic glass page surface.
        </p>
      </div>
    </section>
  ),
  args: {
    className: '',
    children: null,
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-grid glass-w-[760px] glass-gap-4">
      {[3, 5].map((maxItems) => (
        <div key={maxItems} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
          <GlassBreadcrumb {...args} maxItems={maxItems} separator="›">
            {['Home', 'Products', 'Analytics', 'Dashboards', 'Revenue'].map((item, index, items) => (
              <GlassBreadcrumbItem key={item} isCurrentPage={index === items.length - 1}>
                {index === items.length - 1 ? item : <GlassBreadcrumbLink href="#">{item}</GlassBreadcrumbLink>}
              </GlassBreadcrumbItem>
            ))}
          </GlassBreadcrumb>
        </div>
      ))}
    </div>
  ),
  args: {
    className: '',
    children: null,
  },
};
