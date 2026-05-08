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
      color: '#f8fafc',
    }}
  >
    <section
      className="glass-w-full glass-max-w-xl glass-rounded-2xl glass-p-5 glass-shadow-xl"
      style={{
        width: '100%',
        maxWidth: 560,
        background: 'rgba(15,23,42,0.78)',
        border: '1px solid rgba(226,232,240,0.18)',
        color: '#f8fafc',
      }}
    >
    <div className="glass-mb-4 glass-flex glass-items-center glass-justify-between glass-gap-4">
      <div>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: '#cbd5e1' }}>
          Results
        </p>
        <h3 className="glass-text-lg glass-font-semibold" style={{ color: '#f8fafc' }}>Renewal queue</h3>
      </div>
      <span className="glass-rounded-full glass-px-3 glass-py-1 glass-text-xs glass-font-medium" style={{ background: 'rgba(191,219,254,0.18)', color: '#bfdbfe' }}>
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
