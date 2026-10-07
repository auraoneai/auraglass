import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  GlassTabs,
  GlassTabsContent,
  GlassTabsList,
  GlassTabsTrigger,
} from "./GlassTabs";

const meta: Meta<typeof GlassTabs> = {
  title: "Navigation/Glass Tabs",
  component: GlassTabs,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A composable glass tab system with bounded content panels and keyboard navigation.",
      },
    },
  },
  args: {
    defaultValue: "overview",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof GlassTabs>;

const TabsExample = (args: ComponentProps<typeof GlassTabs>) => (
  <div className="glass-grid glass-min-h-screen glass-w-full glass-place-items-center glass-p-4">
    <div
      className="glass-w-full glass-max-w-[760px] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-4 glass-shadow-xl glass-backdrop-blur-xl sm:glass-p-5"
      style={{ width: "calc(100% - 16px)", boxSizing: "border-box" }}
    >
      <style>{`
        .glass-tabs-mobile-labels [role="tab"] {
          gap: 4px !important;
          padding-inline: 4px !important;
          font-size: 12px !important;
        }
      `}</style>
      <GlassTabs {...args} aria-label="Workspace views">
        <GlassTabsList
          className="glass-tabs-mobile-labels glass-w-full glass-max-w-full glass-overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            width: "100%",
          }}
        >
          <GlassTabsTrigger
            className="glass-min-w-0 glass-flex-1 glass-px-2 sm:glass-px-3"
            value="overview"
          >
            Overview
          </GlassTabsTrigger>
          <GlassTabsTrigger
            className="glass-min-w-0 glass-flex-1 glass-px-2 sm:glass-px-3"
            value="metrics"
          >
            Metrics
          </GlassTabsTrigger>
          <GlassTabsTrigger
            className="glass-min-w-0 glass-flex-1 glass-px-2 sm:glass-px-3"
            value="settings"
          >
            Settings
          </GlassTabsTrigger>
        </GlassTabsList>
        <GlassTabsContent value="overview">
          <Panel title="Overview" value="18 active tasks" />
        </GlassTabsContent>
        <GlassTabsContent value="metrics">
          <Panel title="Metrics" value="92% delivery health" />
        </GlassTabsContent>
        <GlassTabsContent value="settings">
          <Panel title="Settings" value="3 approval rules enabled" />
        </GlassTabsContent>
      </GlassTabs>
    </div>
  </div>
);

const Panel = ({ title, value }: { title: string; value: string }) => (
  <div className="glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/30 glass-p-5">
    <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
      {title}
    </h3>
    <p className="glass-mt-2 glass-text-sm glass-text-secondary">{value}</p>
  </div>
);

export const Default: Story = {
  render: (args) => <TabsExample {...args} />,
};

export const Pills: Story = {
  args: { defaultValue: "metrics", variant: "pills" },
  render: (args) => <TabsExample {...args} />,
};
