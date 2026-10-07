import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  GlassPageTabs as GlassPageTabsComponent,
  type GlassPageTab,
} from "./GlassPageTabs";

const tabs: GlassPageTab[] = [
  {
    value: "overview",
    label: "Overview",
    badge: "12",
    panel: (
      <div className="glass-space-y-2">
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          Workspace overview
        </h3>
        <p className="glass-m-0 glass-text-sm glass-text-secondary">
          Twelve liquid-glass surfaces are ready for review.
        </p>
      </div>
    ),
  },
  {
    value: "activity",
    label: "Activity",
    panel: (
      <div className="glass-space-y-2">
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          Recent activity
        </h3>
        <p className="glass-m-0 glass-text-sm glass-text-secondary">
          Token, layout, and interaction checks completed successfully.
        </p>
      </div>
    ),
  },
  {
    value: "settings",
    label: "Settings",
    panel: (
      <div className="glass-space-y-2">
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          View settings
        </h3>
        <p className="glass-m-0 glass-text-sm glass-text-secondary">
          Configure density and motion preferences for this workspace.
        </p>
      </div>
    ),
  },
];

const meta = {
  title: "Navigation/Glass Page Tabs",
  component: GlassPageTabsComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Direct coverage for the accessible GlassPageTabs export, including badges, panels, and keyboard activation behavior.",
      },
    },
  },
  args: {
    tabs,
    defaultValue: "overview",
    orientation: "horizontal",
    activationMode: "automatic",
    renderPanel: true,
    onChange: fn(),
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    activationMode: {
      control: "inline-radio",
      options: ["automatic", "manual"],
    },
    renderPanel: { control: "boolean" },
  },
} satisfies Meta<typeof GlassPageTabsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassPageTabs: Story = {
  name: "GlassPageTabs",
  render: (args) => (
    <div
      className="glass-grid glass-w-full glass-p-4"
      style={{ minHeight: "100vh", placeItems: "center" }}
    >
      <GlassPageTabsComponent
        {...args}
        className="glass-foundation-complete glass-w-full glass-p-4"
        style={{ maxWidth: 760 }}
        aria-label="Workspace page tabs"
      />
    </div>
  ),
};
