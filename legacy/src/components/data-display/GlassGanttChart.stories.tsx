import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassGanttChart, type GanttTask } from "./GlassGanttChart";

const tasks: GanttTask[] = [
  {
    id: "audit",
    name: "Story audit",
    startDate: new Date("2026-05-04"),
    endDate: new Date("2026-05-06"),
    progress: 100,
    status: "completed",
    priority: "high",
    assignee: { id: "mira", name: "Mira" },
  },
  {
    id: "modals",
    name: "Modal overlays",
    startDate: new Date("2026-05-05"),
    endDate: new Date("2026-05-08"),
    progress: 72,
    status: "in-progress",
    priority: "critical",
    dependencies: ["audit"],
    assignee: { id: "rio", name: "Rio" },
  },
  {
    id: "inputs",
    name: "Input controls",
    startDate: new Date("2026-05-06"),
    endDate: new Date("2026-05-10"),
    progress: 48,
    status: "in-progress",
    priority: "high",
    dependencies: ["audit"],
    assignee: { id: "kai", name: "Kai" },
  },
  {
    id: "review",
    name: "Visual review",
    startDate: new Date("2026-05-10"),
    endDate: new Date("2026-05-12"),
    progress: 0,
    status: "not-started",
    priority: "medium",
    dependencies: ["modals", "inputs"],
    milestone: true,
  },
];

const meta = {
  title: 'Data + Visualization/Glass Gantt Chart',
  component: GlassGanttChart,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass Gantt chart for timeline planning with progress, dependencies, and resource labels.",
      },
    },
  },
  args: {
    tasks,
    startDate: new Date("2026-05-03"),
    endDate: new Date("2026-05-14"),
    timeScale: { unit: "day", step: 1 },
    height: 480,
    rowHeight: 48,
    columnWidth: 56,
    editable: true,
    showHierarchy: true,
    viewOptions: {
      showWeekends: true,
      showToday: true,
      showProgress: true,
      showDependencies: true,
      showMilestones: true,
      showResources: true,
    },
  },
} satisfies Meta<typeof GlassGanttChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(1120px, calc(100vw - 64px))" }}>
      <GlassGanttChart {...args} />
    </div>
  ),
};

export const WeeklyPlanning: Story = {
  args: {
    timeScale: { unit: "week", step: 1 },
    columnWidth: 120,
    height: 420,
  },
  render: (args) => (
    <div style={{ width: "min(960px, calc(100vw - 64px))" }}>
      <GlassGanttChart {...args} />
    </div>
  ),
};
