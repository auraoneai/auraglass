import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDashboard } from './GlassDashboard';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof GlassDashboard> = {
  title: 'Components/Dashboard/GlassDashboard',
  component: GlassDashboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdashboard component.',
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
type Story = StoryObj<typeof GlassDashboard>;

export const Default: Story = {
  args: {
    layout: {
      id: 'default-layout',
      name: 'Default Dashboard',
      cols: 4,
      gap: 'md' as const,
      widgets: [
        {
          id: 'metric-1',
          title: 'Total Users',
          type: 'metric',
          size: { cols: 1, rows: 1 },
          position: { x: 0, y: 0 },
          data: {
            value: '1,234',
            label: 'Active Users',
            change: 12.5
          }
        },
        {
          id: 'metric-2',
          title: 'Revenue',
          type: 'metric',
          size: { cols: 1, rows: 1 },
          position: { x: 1, y: 0 },
          data: {
            value: '$45,678',
            label: 'Monthly Revenue',
            change: 8.2
          }
        },
        {
          id: 'chart-1',
          title: 'Sales Chart',
          type: 'chart',
          size: { cols: 2, rows: 2 },
          position: { x: 2, y: 0 },
          data: {
            title: 'Sales Over Time',
            chartType: 'line'
          }
        },
        {
          id: 'table-1',
          title: 'Recent Orders',
          type: 'table',
          size: { cols: 2, rows: 1 },
          position: { x: 0, y: 1 },
          data: {
            title: 'Latest Orders',
            rows: [
              { name: 'Order #1234', value: '$299.00' },
              { name: 'Order #1235', value: '$149.50' },
              { name: 'Order #1236', value: '$599.00' }
            ]
          }
        },
        {
          id: 'text-1',
          title: 'Welcome Message',
          type: 'text',
          size: { cols: 2, rows: 1 },
          position: { x: 2, y: 2 },
          data: {
            content: 'Welcome to your dashboard! Here you can monitor your key metrics and performance indicators.'
          }
        }
      ]
    }
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-w-full glass-h-screen">
      <GlassDashboard {...args} />
    </div>
  ),
  args: {
    layout: {
      id: 'variant-layout',
      name: 'Variant Dashboard',
      cols: 3,
      gap: 'lg' as const,
      widgets: [
        {
          id: 'metric-variant-1',
          title: 'Performance',
          type: 'metric',
          size: { cols: 1, rows: 1 },
          position: { x: 0, y: 0 },
          data: {
            value: '98.5%',
            label: 'System Uptime',
            change: 2.1
          }
        },
        {
          id: 'chart-variant-1',
          title: 'Traffic Analytics',
          type: 'chart',
          size: { cols: 2, rows: 2 },
          position: { x: 1, y: 0 },
          data: {
            title: 'Website Traffic',
            chartType: 'bar'
          }
        }
      ]
    }
  },
};

export const EditMode: Story = {
  args: {
    editMode: true,
    availableWidgets: [
      {
        type: 'metric',
        title: 'Metric Widget',
        icon: '📊',
        defaultSize: { cols: 1, rows: 1 }
      },
      {
        type: 'chart',
        title: 'Chart Widget',
        icon: '📈',
        defaultSize: { cols: 2, rows: 2 }
      },
      {
        type: 'table',
        title: 'Table Widget',
        icon: '📋',
        defaultSize: { cols: 2, rows: 1 }
      }
    ],
    layout: {
      id: 'edit-mode-layout',
      name: 'Editable Dashboard',
      cols: 4,
      gap: 'md' as const,
      widgets: [
        {
          id: 'existing-metric',
          title: 'Existing Metric',
          type: 'metric',
          size: { cols: 1, rows: 1 },
          position: { x: 0, y: 0 },
          data: {
            value: '42',
            label: 'Sample Metric',
            change: -5.2
          },
          editable: true,
          removable: true,
          resizable: true
        }
      ]
    }
  },
};
