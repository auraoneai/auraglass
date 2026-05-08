import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAreaChart } from './GlassAreaChart';

const useResponsiveChartSize = (desktopWidth: number, desktopHeight: number) => {
  const [size, setSize] = React.useState({ width: desktopWidth, height: desktopHeight });

  React.useEffect(() => {
    const updateSize = () => {
      const availableWidth = Math.max(300, Math.min(desktopWidth, window.innerWidth - 96));
      setSize({
        width: availableWidth,
        height: availableWidth < 460 ? Math.min(desktopHeight, 320) : desktopHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [desktopHeight, desktopWidth]);

  return size;
};

const ResponsiveAreaChart = (args: React.ComponentProps<typeof GlassAreaChart>) => {
  const chartSize = useResponsiveChartSize(args.width ?? 600, args.height ?? 400);
  const mobile = chartSize.width < 460;
  const responsiveSeries = mobile
    ? args.series?.map((series) => ({
        ...series,
        data: series.data.filter((_, index) => index % 2 === 0),
      }))
    : args.series;

  return (
    <GlassAreaChart
      {...args}
      series={responsiveSeries ?? []}
      width={chartSize.width}
      height={chartSize.height}
      formatYValue={(value) => `${Math.round(value / 1000)}k`}
      formatXValue={(value) => String(value).slice(0, 3)}
    />
  );
};

const meta: Meta<typeof GlassAreaChart> = {
  title: 'Data + Visualization/Glass Area Chart',
  component: GlassAreaChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glassmorphism area chart with multiple series support, smooth animations, and interactive tooltips.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Chart title',
    },
    width: {
      control: 'number',
      description: 'Chart width in pixels',
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels',
    },
    showGrid: {
      control: 'boolean',
      description: 'Show grid lines',
    },
    showPoints: {
      control: 'boolean',
      description: 'Show data points on lines',
    },
    showLegend: {
      control: 'boolean',
      description: 'Show legend',
    },
    showTooltips: {
      control: 'boolean',
      description: 'Show tooltips on hover',
    },
    xAxisLabel: {
      control: 'text',
      description: 'X-axis label',
    },
    yAxisLabel: {
      control: 'text',
      description: 'Y-axis label',
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Fill opacity for areas',
    },
    stacked: {
      control: 'boolean',
      description: 'Show stacked areas',
    },
    animationDuration: {
      control: 'number',
      description: 'Animation duration in milliseconds',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    title: 'Sample Area Chart',
    width: 600,
    height: 400,
    showGrid: true,
    showPoints: true,
    showLegend: true,
    showTooltips: true,
    xAxisLabel: 'Time',
    yAxisLabel: 'Value',
    fillOpacity: 0.3,
    stacked: false,
    animationDuration: 1000,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassAreaChart>;

// Sample data for demonstration
const sampleSeries = [
  {
    id: 'series1',
    name: 'Revenue',
    data: [
      { x: 'Jan', y: 4000 },
      { x: 'Feb', y: 3000 },
      { x: 'Mar', y: 5000 },
      { x: 'Apr', y: 4500 },
      { x: 'May', y: 6000 },
      { x: 'Jun', y: 5500 },
      { x: 'Jul', y: 7000 },
      { x: 'Aug', y: 6500 },
      { x: 'Sep', y: 8000 },
      { x: 'Oct', y: 7500 },
      { x: 'Nov', y: 9000 },
      { x: 'Dec', y: 8500 },
    ],
    color: 'var(--glass-color-primary)',
  },
  {
    id: 'series2',
    name: 'Expenses',
    data: [
      { x: 'Jan', y: 2400 },
      { x: 'Feb', y: 1398 },
      { x: 'Mar', y: 2800 },
      { x: 'Apr', y: 3908 },
      { x: 'May', y: 4800 },
      { x: 'Jun', y: 3800 },
      { x: 'Jul', y: 4300 },
      { x: 'Aug', y: 5200 },
      { x: 'Sep', y: 4100 },
      { x: 'Oct', y: 3600 },
      { x: 'Nov', y: 4900 },
      { x: 'Dec', y: 4400 },
    ],
    color: 'var(--glass-color-danger)',
  },
];

export const Default: Story = {
  render: (args) => <ResponsiveAreaChart {...args} />,
  args: {
    series: sampleSeries,
  },
};

export const SingleSeries: Story = {
  args: {
    series: [sampleSeries[0]],
    title: 'Revenue Trend',
  },
};

export const Stacked: Story = {
  args: {
    series: sampleSeries,
    stacked: true,
    title: 'Revenue vs Expenses (Stacked)',
  },
};

export const WithCustomColors: Story = {
  args: {
    series: [
      {
        ...sampleSeries[0],
        color: 'var(--glass-color-success)',
      },
      {
        ...sampleSeries[1],
        color: 'var(--glass-color-warning)',
      },
    ],
    title: 'Custom Colors',
  },
};

export const Minimal: Story = {
  args: {
    series: sampleSeries,
    showGrid: false,
    showLegend: false,
    showPoints: false,
    title: 'Minimal Chart',
  },
};

export const LargeDataset: Story = {
  args: {
    series: [
      {
        id: 'large',
        name: 'Large Dataset',
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i,
          y: Math.sin(i * 0.2) * 1000 + Math.random() * 500,
        })),
        color: '#8b5cf6',
      },
    ],
    title: 'Large Dataset (50 points)',
    showPoints: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    title: 'Loading Chart',
  },
};

export const NoData: Story = {
  args: {
    series: [],
    title: 'No Data Available',
  },
};
