import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSearchField } from "./LiquidGlassSearchField";

const meta: Meta<typeof LiquidGlassSearchField> = {
  title: 'Controls/Search/Liquid Glass Search Field',
  component: LiquidGlassSearchField,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassSearchField>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "start center", padding: "80px 32px 32px", boxSizing: "border-box" }}>
      <style>{`
        .liquid-search-story-wrap,
        .liquid-search-story-wrap * {
          color: #0f172a !important;
        }

        .liquid-search-story-wrap .glass-text-secondary {
          color: #334155 !important;
        }

        .liquid-search-story input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-search-story button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 640px) {
          .liquid-search-story-wrap { width: 100%; }
        }
      `}</style>
      <div
        className="liquid-search-story-wrap"
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
        <h2 style={{ margin: 0, fontSize: 22 }}>Command search</h2>
        <LiquidGlassSearchField
          className="liquid-search-story"
          placeholder="Search workspace"
          scope="Aura"
          results={[
            { id: "one", label: "Dashboard", description: "Open overview" },
            { id: "two", label: "Media", description: "Review current exports" },
            { id: "three", label: "Settings", description: "Adjust Liquid Glass policy" },
          ]}
          suggestions={["Dashboard", "Media", "Settings"]}
        />
      </div>
    </div>
  ),
};
