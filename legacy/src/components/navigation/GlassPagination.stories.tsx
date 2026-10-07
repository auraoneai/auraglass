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
    currentPage: 2,
    totalPages: 4,
    maxPageButtons: 4,
    size: 'sm',
    disabled: false,
    showFirstLast: false,
    onPageChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassPagination>;

const PaginationFrame = (props: React.ComponentProps<typeof GlassPagination>) => (
  <div
    data-bg="light"
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 16,
      boxSizing: 'border-box',
      background: 'linear-gradient(145deg, #fafafa 0%, #f0f0f0 52%, #e6e6e6 100%)',
      color: '#0f172a',
    }}
  >
    <section
      className="glass-w-full glass-max-w-xl glass-rounded-2xl glass-p-5 glass-shadow-xl"
      style={{
        width: '100%',
        maxWidth: 560,
        background: 'rgba(255,255,255,0.26)',
        border: '1px solid rgba(255,255,255,0.32)',
        color: '#0f172a',
      }}
    >
    <div className="glass-mb-4 glass-flex glass-items-center glass-justify-between glass-gap-4">
      <div>
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: 'rgba(15,23,42,.7)' }}>
          Results
        </p>
        <h3 className="glass-text-lg glass-font-semibold" style={{ color: '#0f172a' }}>Renewal queue</h3>
      </div>
      <span className="glass-rounded-full glass-px-3 glass-py-1 glass-text-xs glass-font-medium" style={{ background: 'rgba(255,255,255,0.28)', color: '#0f172a' }}>
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
