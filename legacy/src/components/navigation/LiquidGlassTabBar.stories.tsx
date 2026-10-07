import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassTabBar } from "./LiquidGlassTabBar";

const meta: Meta<typeof LiquidGlassTabBar> = {
  title: "Navigation/Liquid Glass Tab Bar",
  component: LiquidGlassTabBar,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassTabBar>;

export const WithSearchTab: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          minHeight: 420,
          display: "grid",
          alignItems: "end",
          padding: 28,
          boxSizing: "border-box",
          borderRadius: 32,
          background:
            "linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.12)), linear-gradient(180deg, #f8fafc, #e7ebf0)",
          boxShadow: "0 24px 80px rgba(15,23,42,.14)",
        }}
      >
        <LiquidGlassTabBar
          tabs={[
            { id: "home", label: "Home" },
            { id: "search", label: "Search" },
            { id: "library", label: "Library" },
          ]}
          activeTab="home"
          searchTabId="search"
          minimizeBehavior="never"
        />
      </div>
    </div>
  ),
};
