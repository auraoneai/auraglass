import React, { useLayoutEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassAdvancedDataViz as GlassAdvancedDataVizComponent,
  type AdvancedDataVizProps,
  type ChartSeries,
} from "./GlassAdvancedDataViz";

const weeklySignals = [
  { id: "mon", x: 1, y: 42, label: "Monday" },
  { id: "tue", x: 2, y: 58, label: "Tuesday" },
  { id: "wed", x: 3, y: 54, label: "Wednesday" },
  { id: "thu", x: 4, y: 71, label: "Thursday" },
  { id: "fri", x: 5, y: 76, label: "Friday" },
  { id: "sat", x: 6, y: 83, label: "Saturday" },
  { id: "sun", x: 7, y: 91, label: "Sunday" },
] as const;

const previousWeek = [
  { id: "prev-mon", x: 1, y: 35, label: "Monday" },
  { id: "prev-tue", x: 2, y: 44, label: "Tuesday" },
  { id: "prev-wed", x: 3, y: 51, label: "Wednesday" },
  { id: "prev-thu", x: 4, y: 57, label: "Thursday" },
  { id: "prev-fri", x: 5, y: 64, label: "Friday" },
  { id: "prev-sat", x: 6, y: 69, label: "Saturday" },
  { id: "prev-sun", x: 7, y: 74, label: "Sunday" },
] as const;

const chartData: ChartSeries[] = [
  {
    color: "rgba(15, 23, 42, 0.9)",
    data: weeklySignals.map((point) => ({ ...point })),
    id: "current",
    name: "Current week",
    type: "line",
  },
  {
    color: "rgba(71, 85, 105, 0.62)",
    data: previousWeek.map((point) => ({ ...point })),
    id: "previous",
    name: "Previous week",
    type: "line",
  },
];

const storyArgs = {
  className: "glass-w-full",
  data: chartData,
  enableAnimation: false,
  enableCrosshair: true,
  enableDrillDown: false,
  enablePan: false,
  enableZoom: true,
  height: 400,
  showDataLabels: false,
  showLegend: true,
  showTooltip: true,
  subtitle: "A stable seven-day comparison across active product signals",
  title: "Signal momentum",
  type: "line",
  width: 800,
  xAxisLabel: "Day of week",
  yAxisLabel: "Signal score",
} satisfies AdvancedDataVizProps;

const ResponsiveDataVizFixture = (props: AdvancedDataVizProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ height: 320, width: 272 });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const updateSize = () => {
      const availableWidth = Math.max(220, frame.clientWidth - 48);
      const width = Math.min(800, availableWidth);
      setChartSize({
        height: width < 520 ? 320 : 400,
        width,
      });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(frame);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={frameRef} style={{ minWidth: 0, width: "100%" }}>
      <GlassAdvancedDataVizComponent
        {...props}
        height={chartSize.height}
        width={chartSize.width}
      />
    </div>
  );
};

const meta = {
  title: "Data + Visualization/Glass Advanced Data Viz",
  component: GlassAdvancedDataVizComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A direct, deterministic mount of GlassAdvancedDataViz using two complete time series and responsive chart bounds.",
      },
    },
  },
  decorators: [
    (Story) => (
      <main
        style={{
          boxSizing: "border-box",
          display: "grid",
          minHeight: "100vh",
          padding: "clamp(12px, 4vw, 48px)",
          placeItems: "center",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 920, minWidth: 0, width: "100%" }}>
          <Story />
        </div>
      </main>
    ),
  ],
  args: storyArgs,
} satisfies Meta<typeof GlassAdvancedDataVizComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassAdvancedDataViz: Story = {
  name: "GlassAdvancedDataViz",
  render: (args) => <ResponsiveDataVizFixture {...args} />,
};
