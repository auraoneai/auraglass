import type { Meta, StoryObj } from '@storybook/react';
import { GlassPanel } from './glass-panel';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassPanel> = {
  title: 'Components/UI-Components/GlassPanel',
  component: GlassPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile glass morphism panel component for organizing content with various styles and elevations.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'warning', 'error'],
      description: 'Panel variant style',
    },
    elevation: {
      control: { type: 'select' },
      options: ['level1', 'level2', 'level3', 'level4'],
      description: 'Panel elevation level',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Panel padding',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the panel is interactive',
    },
  },
  args: {
    variant: 'default',
    elevation: 'level1',
    padding: 'md',
    interactive: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassPanel>;

export const Default: Story = {
  args: {
    children: (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Default Panel</h3>
        <p className="text-sm opacity-80">This is a standard glass panel.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      {(['default', 'primary', 'success', 'warning', 'error'] as const).map((variant) => (
        <GlassPanel key={variant} {...args} variant={variant}>
          <div className="text-center">
            <h4 className="text-sm font-medium capitalize mb-2">{variant} Panel</h4>
            <p className="text-xs opacity-70">This is a {variant} variant panel.</p>
          </div>
        </GlassPanel>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Elevations: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl">
      {( ['level1', 'level2', 'level3', 'level4'] as const).map((elevation) => (
        <GlassPanel key={elevation} {...args} elevation={elevation}>
          <div className="text-center">
            <h4 className="text-sm font-medium mb-2 capitalize">{elevation} Elevation</h4>
            <p className="text-xs opacity-70">Panel with {elevation} elevation.</p>
          </div>
        </GlassPanel>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const PaddingSizes: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((padding) => (
        <GlassPanel key={padding} {...args} padding={padding}>
          <div className="text-center">
            <h4 className="text-sm font-medium mb-2 capitalize">{padding} Padding</h4>
            <p className="text-xs opacity-70">Panel with {padding} padding.</p>
            {padding === 'none' && <p className="text-xs opacity-60 glass-mt-1">No padding applied</p>}
          </div>
        </GlassPanel>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <div className="text-center cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">Interactive Panel</h3>
        <p className="text-sm opacity-80">Hover over this panel to see the interactive effects.</p>
        <div className="glass-mt-4 text-xs opacity-60">Click me!</div>
      </div>
    ),
  },
};

export const ContentShowcase: Story = {
  args: {
    variant: 'primary',
    elevation: 'level3',
    padding: 'lg',
    children: (
      <div className="glass-auto-gap glass-auto-gap-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Premium Panel</h3>
          <p className="text-sm opacity-80">
            This panel showcases the full capabilities of the GlassPanel component
            with primary variant, high elevation, and generous padding.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 glass-surface-subtle/10 glass-radius-lg">
            <div className="text-lg font-semibold text-primary">42</div>
            <div className="text-xs opacity-70">Active Users</div>
          </div>
          <div className="text-center p-3 glass-surface-subtle/10 glass-radius-lg">
            <div className="text-lg font-semibold text-primary">89%</div>
            <div className="text-xs opacity-70">Completion Rate</div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <span className="px-3 py-1 glass-surface-subtle/20 glass-radius-full text-xs">Responsive</span>
          <span className="px-3 py-1 glass-surface-subtle/20 glass-radius-full text-xs">Interactive</span>
          <span className="px-3 py-1 glass-surface-subtle/20 glass-radius-full text-xs">Accessible</span>
        </div>
      </div>
    ),
  },
};

export const DashboardLayout: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      <GlassPanel {...args} variant="primary" elevation="level2">
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <h4 className="text-lg font-semibold mb-1">Analytics</h4>
          <p className="text-sm opacity-80">View detailed analytics and insights</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="success" elevation="level2">
        <div className="text-center">
          <div className="text-3xl mb-2">💰</div>
          <h4 className="text-lg font-semibold mb-1">Revenue</h4>
          <p className="text-sm opacity-80">Track financial performance</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="warning" elevation="level2">
        <div className="text-center">
          <div className="text-3xl mb-2">👥</div>
          <h4 className="text-lg font-semibold mb-1">Users</h4>
          <p className="text-sm opacity-80">Manage user accounts and permissions</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="error" elevation="level1">
        <div className="text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <h4 className="text-lg font-semibold mb-1">Alerts</h4>
          <p className="text-sm opacity-80">Monitor system alerts and notifications</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="default" elevation="level1">
        <div className="text-center">
          <div className="text-3xl mb-2">🔧</div>
          <h4 className="text-lg font-semibold mb-1">Settings</h4>
          <p className="text-sm opacity-80">Configure system preferences</p>
        </div>
      </GlassPanel>

      <GlassPanel {...args} variant="primary" elevation="level1">
        <div className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <h4 className="text-lg font-semibold mb-1">Reports</h4>
          <p className="text-sm opacity-80">Generate and view reports</p>
        </div>
      </GlassPanel>
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};
