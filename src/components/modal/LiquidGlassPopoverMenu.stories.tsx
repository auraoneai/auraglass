import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassPopoverMenu } from "./LiquidGlassPopoverMenu";

const meta: Meta<typeof LiquidGlassPopoverMenu> = {
  title: 'Surfaces/Modals/Liquid Glass Popover Menu',
  component: LiquidGlassPopoverMenu,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassPopoverMenu>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <style>{`
        .liquid-popover-story,
        .liquid-popover-story * {
          color: #0f172a !important;
        }

        .liquid-glass-popover-menu button {
          border: 0;
          background: transparent;
          color: #0f172a !important;
          cursor: pointer;
          font: inherit;
          width: 100%;
        }
      `}</style>
      <div className="liquid-popover-story" style={{ position: "relative", width: 360, minHeight: 260, borderRadius: 28, padding: 24, background: "rgba(255,255,255,0.82)", color: "#0f172a" }}>
        <button type="button" style={{ border: 0, borderRadius: 999, background: "rgba(15,23,42,.10)", color: "#0f172a", padding: "8px 14px", font: "inherit" }}>More actions</button>
        <div style={{ position: "absolute", top: 72, left: 24 }}>
          <LiquidGlassPopoverMenu
            open
            items={[
              { id: "copy", label: "Copy", shortcut: "Cmd C" },
              { id: "duplicate", label: "Duplicate", shortcut: "Cmd D", selected: true },
              { id: "archive", label: "Archive" },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
