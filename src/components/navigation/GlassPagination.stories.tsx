import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassPagination } from './GlassPagination';

const meta: Meta<typeof GlassPagination> = {
  title: 'Navigation/Glass Pagination',
  component: GlassPagination,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Responsive glass pagination with bounded wrapping for mobile and dark previews.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    showFirstLast: { control: 'boolean' },
  },
  args: {
    className: '',
    currentPage: 4,
    totalPages: 10,
    size: 'md',
    disabled: false,
    showFirstLast: true,
    onPageChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassPagination>;

const PaginationFrame = (props: React.ComponentProps<typeof GlassPagination>) => (
  <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <section
      className="glass-w-full glass-max-w-xl glass-rounded-2xl glass-p-5 glass-shadow-xl"
      style={{ width: '100%', maxWidth: 560, background: 'rgba(255,255,255,0.86)', color: '#0f172a' }}
    >
    <div className="glass-mb-4 glass-flex glass-items-center glass-justify-between glass-gap-4">
      <div>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
          Results
        </p>
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">Renewal queue</h3>
      </div>
      <span className="glass-rounded-full glass-bg-blue-100 glass-px-3 glass-py-1 glass-text-xs glass-font-medium glass-text-blue-800" style={{ color: '#1e40af' }}>
        Page {props.currentPage}
      </span>
    </div>
    <GlassPagination {...props} className="glass-w-full glass-flex glass-justify-center" />
  </section>
  </div>
);

export const Default: Story = {
  render: (args) => <PaginationFrame {...args} />,
};

export const LargeDataset: Story = {
  render: (args) => <PaginationFrame {...args} />,
  args: {
    currentPage: 5,
    totalPages: 50,
    maxPageButtons: 3,
  },
};

export const SmallSize: Story = {
  render: (args) => <PaginationFrame {...args} />,
  args: {
    currentPage: 2,
    totalPages: 8,
    size: 'sm',
    showFirstLast: false,
    maxPageButtons: 4,
  },
};
