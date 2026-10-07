import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { LiquidGlassButtonStyle } from "./LiquidGlassButtonStyle";

const meta: Meta<typeof LiquidGlassButtonStyle> = {
  title: 'Controls/Buttons/Liquid Glass Button Style',
  component: LiquidGlassButtonStyle,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassButtonStyle>;

const actionRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
};

export const Prominent: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <style>{`
        [data-storybook-preview-mode="dark"] .liquid-glass-button-style {
          color: #0f172a !important;
          background: rgba(255, 255, 255, 0.86) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
      <div
        style={{
          width: "min(720px, 100%)",
          borderRadius: 28,
          padding: 28,
          background: "rgba(255,255,255,0.68)",
          boxShadow: "0 24px 80px rgba(15,23,42,0.14)",
        }}
      >
        <p style={{ margin: "0 0 16px", color: "#475569" }}>Primary Liquid Glass button treatment in a real action group.</p>
        <div style={actionRowStyle}>
          <LiquidGlassButtonStyle prominent size="xl">Continue</LiquidGlassButtonStyle>
          <LiquidGlassButtonStyle size="lg">Save draft</LiquidGlassButtonStyle>
          <LiquidGlassButtonStyle materialVariant="clear" size="lg">Preview</LiquidGlassButtonStyle>
        </div>
      </div>
    </div>
  ),
};
