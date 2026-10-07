import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassPullToRefresh as GlassPullToRefreshComponent } from "./GlassPullToRefresh";

const meta = {
  title: "Effects + Advanced/Glass Pull To Refresh",
  component: GlassPullToRefreshComponent,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    controls: {
      exclude: ["onRefresh"],
    },
    docs: {
      description: {
        component:
          "A touch-first refresh container shown in its real refreshing state so the liquid-glass progress indicator remains visible for inspection.",
      },
    },
  },
  args: {
    onRefresh: async () => undefined,
    refreshing: true,
    threshold: 80,
    maxDistance: 120,
    showIndicator: true,
    pullText: "Pull to refresh",
    releaseText: "Release to refresh",
    refreshingText: "Refreshing your briefing…",
    elevation: "level2",
    disabled: false,
  },
} satisfies Meta<typeof GlassPullToRefreshComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const briefingItems = [
  ["09:30", "Product review", "Studio 4"],
  ["12:00", "Design critique", "North room"],
  ["15:30", "Launch readiness", "Atrium"],
] as const;

export const GlassPullToRefresh: Story = {
  render: (args) => (
    <div
      style={{
        width: "min(430px, calc(100vw - 32px))",
        height: "min(680px, calc(100vh - 32px))",
        minHeight: 520,
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.28)",
        borderRadius: 32,
        boxShadow:
          "0 24px 72px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.32)",
        color: "rgba(15, 23, 42, 0.92)",
        background:
          "linear-gradient(160deg, rgb(239, 243, 247) 0%, rgb(250, 252, 254) 52%, rgb(227, 234, 240) 100%)",
      }}
    >
      <GlassPullToRefreshComponent {...args} className="glass-h-full">
        <div className="glass-p-6" style={{ paddingTop: 32 }}>
          <p className="glass-text-xs glass-font-medium glass-tracking-wide glass-uppercase">
            Today
          </p>
          <h2 className="glass-mt-2 glass-text-2xl glass-font-semibold">
            Daily briefing
          </h2>
          <p className="glass-mt-2 glass-text-sm" style={{ opacity: 0.7 }}>
            Your schedule is being refreshed with the latest updates.
          </p>

          <div className="glass-mt-8 glass-border-t glass-border-subtle">
            {briefingItems.map(([time, title, location]) => (
              <article
                key={time}
                className="glass-flex glass-items-start glass-gap-4 glass-border-b glass-border-subtle glass-py-5"
              >
                <time
                  className="glass-text-sm glass-font-medium"
                  style={{ width: 56, flexShrink: 0 }}
                >
                  {time}
                </time>
                <div>
                  <h3 className="glass-text-base glass-font-semibold">
                    {title}
                  </h3>
                  <p className="glass-mt-1 glass-text-sm" style={{ opacity: 0.66 }}>
                    {location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </GlassPullToRefreshComponent>
    </div>
  ),
};
