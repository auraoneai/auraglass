import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassDestination, LiquidGlassSource, LiquidGlassTransitionProvider } from "../../primitives/LiquidGlassSourceTransition";

const meta: Meta<typeof LiquidGlassTransitionProvider> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Source Transition',
  component: LiquidGlassTransitionProvider,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassTransitionProvider>;

export const SourceToSheet: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, boxSizing: "border-box" }}>
      <style>{`
        .liquid-source-transition-story,
        .liquid-source-transition-story * {
          color: #0f172a !important;
        }
      `}</style>
      <LiquidGlassTransitionProvider>
        <div
          className="glass-neutral-level1 liquid-source-transition-story"
          style={{
            width: "min(820px, 100%)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: 20,
            borderRadius: 30,
            padding: 28,
            boxShadow:
              "0 24px 80px rgba(15,23,42,.14), inset 0 0 14px rgba(255,255,255,.14), inset 0 1px 0 rgba(255,255,255,.18)",
            color: "#0f172a",
          }}
        >
          <LiquidGlassSource
            id="demo"
            className="glass-p-4 glass-surface-subtle"
            style={{ minHeight: 180, borderRadius: 24, display: "grid", alignContent: "end" }}
          >
            <strong>Source thumbnail</strong>
            <span style={{ color: "#475569", fontSize: 12 }}>Compact origin surface</span>
          </LiquidGlassSource>
          <LiquidGlassDestination
            id="demo"
            className="glass-p-5 glass-surface-default"
            style={{ minHeight: 220, borderRadius: 24, display: "grid", alignContent: "center", gap: 8 }}
          >
            <strong style={{ fontSize: 20 }}>Expanded Liquid Glass destination</strong>
            <span style={{ color: "#475569" }}>
              Source and destination are shown together so the morph relationship is
              visible without relying on a tiny text-only sample.
            </span>
          </LiquidGlassDestination>
        </div>
      </LiquidGlassTransitionProvider>
    </div>
  ),
};
