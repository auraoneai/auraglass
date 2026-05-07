import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSearchTab } from "./LiquidGlassSearchTab";

const meta: Meta<typeof LiquidGlassSearchTab> = {
  title: 'Controls/Search/Liquid Glass Search Tab',
  component: LiquidGlassSearchTab,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassSearchTab>;

export const Active: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "start center", padding: "80px 32px 32px", boxSizing: "border-box" }}>
      <style>{`
        .liquid-search-tab-story-wrap,
        .liquid-search-tab-story-wrap * {
          color: #0f172a !important;
        }

        .liquid-search-tab-story-wrap .glass-text-secondary {
          color: #334155 !important;
        }

        .liquid-search-tab-story input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-search-tab-story button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 640px) {
          .liquid-search-tab-story-wrap { width: 100%; }
        }
      `}</style>
      <div
        className="liquid-search-tab-story-wrap"
        style={{
          width: "min(640px, 100%)",
          display: "grid",
          gap: 16,
          borderRadius: 30,
          padding: 24,
          background: "rgba(255,255,255,.82)",
          boxShadow: "0 24px 80px rgba(15,23,42,.14)",
          color: "#0f172a",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>Search tab surface</h2>
        <LiquidGlassSearchTab
          className="liquid-search-tab-story"
          active
          placeholder="Find in library"
          results={[
            { id: "a", label: "Find item", description: "Recent result" },
            { id: "b", label: "Final export", description: "Media collection" },
          ]}
          suggestions={["Find item", "Final export"]}
        />
      </div>
    </div>
  ),
};
