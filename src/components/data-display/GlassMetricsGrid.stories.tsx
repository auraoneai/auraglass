import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Activity, DollarSign, Gauge, Users } from "@/icons";
import { GlassMetricsGrid, type MetricConfig } from "./GlassMetricsGrid";

const metrics: MetricConfig[] = [
  {
    id: "revenue",
    title: "Revenue",
    description: "Net booked revenue",
    value: { current: 128400, previous: 112000, format: "currency" },
    trend: { direction: "up", percentage: 14.6, period: "vs last week" },
    spark: {
      data: [62, 68, 70, 76, 84, 91, 98],
      color: "#2563eb",
      showArea: true,
    },
    icon: <DollarSign size={18} />,
    status: "success",
    category: "Business",
  },
  {
    id: "audience",
    title: "Qualified audience",
    description: "Matched high-intent accounts",
    value: { current: 48230, previous: 45100, format: "number" },
    trend: { direction: "up", percentage: 6.9, period: "7 days" },
    spark: { data: [44, 49, 52, 59, 61, 70, 73], color: "#14b8a6" },
    icon: <Users size={18} />,
    status: "info",
    category: "Audience",
  },
  {
    id: "latency",
    title: "API latency",
    description: "P95 request time",
    value: {
      current: 184,
      target: 220,
      unit: "ms",
      format: "custom",
      customFormatter: (value) => `${value}ms`,
    },
    trend: { direction: "down", percentage: 8.4, period: "24 hours" },
    spark: { data: [230, 214, 206, 198, 190, 188, 184], color: "#f59e0b" },
    icon: <Gauge size={18} />,
    status: "success",
    category: "Platform",
  },
  {
    id: "errors",
    title: "Error budget",
    description: "Monthly budget consumed",
    value: { current: 31, target: 50, format: "percentage" },
    trend: { direction: "neutral", percentage: 0.8, period: "month" },
    spark: { data: [24, 25, 27, 27, 29, 30, 31], color: "#ef4444" },
    icon: <Activity size={18} />,
    status: "warning",
    category: "Reliability",
  },
];

const MetricsStory = (args: React.ComponentProps<typeof GlassMetricsGrid>) => {
  const [query, setQuery] = useState(args.searchQuery ?? "");

  return (
    <div style={{ width: "min(1080px, calc(100vw - 64px))" }}>
      <GlassMetricsGrid
        {...args}
        searchQuery={query}
        onSearchChange={setQuery}
      />
    </div>
  );
};

const meta: Meta<typeof GlassMetricsGrid> = {
  title: 'Data + Visualization/Glass Metrics Grid',
  component: GlassMetricsGrid,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A dense glass metrics grid for dashboards with trends, sparklines, search, and actions.",
      },
    },
  },
  args: {
    metrics,
    layout: { columns: 4, gap: 16 },
    showTrends: true,
    showSparks: true,
    searchable: true,
    exportable: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassMetricsGrid>;

export const Default: Story = {
  render: (args) => <MetricsStory {...args} />,
};

export const Loading: Story = {
  args: {
    loading: true,
    searchable: false,
    exportable: false,
  },
  render: (args) => <MetricsStory {...args} />,
};
