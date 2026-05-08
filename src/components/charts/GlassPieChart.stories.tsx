import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassPieChart, type PieDataPoint } from './GlassPieChart';

const segmentData: PieDataPoint[] = [
  { label: 'Enterprise', value: 48, color: 'var(--glass-color-primary)' },
  { label: 'Mid-market', value: 27, color: 'var(--glass-color-success)' },
  { label: 'Startup', value: 16, color: 'var(--glass-color-warning)' },
  { label: 'Partner', value: 9, color: 'var(--glass-color-danger)' },
];

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className="glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-5 glass-shadow-xl"
    style={{ width: 'min(760px, calc(100vw - 48px))', overflowX: 'auto' }}
  >
    {children}
  </div>
);

const useResponsivePieLayout = (desktopSize: number) => {
  const [layout, setLayout] = React.useState<{
    size: number;
    legendPosition: React.ComponentProps<typeof GlassPieChart>['legendPosition'];
  }>({
    size: desktopSize,
    legendPosition: 'right',
  });

  React.useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth < 520;
      setLayout({
        size: mobile ? 220 : desktopSize,
        legendPosition: mobile ? 'bottom' : 'right',
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [desktopSize]);

  return layout;
};

const ResponsivePieChart = (args: React.ComponentProps<typeof GlassPieChart>) => {
  const layout = useResponsivePieLayout(args.size ?? 300);
  return <GlassPieChart {...args} size={layout.size} legendPosition={layout.legendPosition} />;
};

const meta: Meta<typeof GlassPieChart> = {
  title: 'Data + Visualization/Glass Pie Chart',
  component: GlassPieChart,
  parameters: {
    layout: 'padded',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Glass pie and donut chart examples with readable segment colors, labels, legend, and tooltips.',
      },
    },
  },
  argTypes: {
    innerRadius: { control: { type: 'range', min: 0, max: 120, step: 10 } },
    showLegend: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    showPercentages: { control: 'boolean' },
  },
  args: {
    title: 'Customer mix',
    data: segmentData,
    size: 300,
    showLegend: true,
    legendPosition: 'right',
    showLabels: false,
    showPercentages: true,
    showTooltips: true,
    formatValue: (value) => `${value}%`,
  },
};

export default meta;
type Story = StoryObj<typeof GlassPieChart>;

export const Default: Story = {
  render: (args) => (
    <ChartFrame>
      <ResponsivePieChart {...args} />
    </ChartFrame>
  ),
};

export const Donut: Story = {
  render: (args) => (
    <ChartFrame>
      <GlassPieChart {...args} title="Revenue share" innerRadius={86} legendPosition="bottom" showLabels />
    </ChartFrame>
  ),
};
