import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassLiveCursorPresence } from "./GlassLiveCursorPresence";

const currentUser = {
  id: "storybook-owner",
  name: "You",
  color: "rgba(255,255,255,0.9)",
  lastSeen: 0,
};

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 78% 14%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0) 30%), linear-gradient(150deg, #f7f7f6 0%, #e2e2e0 100%)",
};

const surfaceStyle: CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.14))",
  border: "1px solid rgba(15, 23, 42, 0.16)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.32), 0 24px 56px rgba(15, 23, 42, 0.12)",
  backdropFilter: "blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",
  WebkitBackdropFilter:
    "blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",
};

const meta = {
  title: "Effects + Advanced/Glass Live Cursor Presence",
  component: GlassLiveCursorPresence,
  args: {
    children: null,
    roomId: "storybook-liquid-workspace",
    currentUser,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The actual GlassLiveCursorPresence export rendered in a deterministic disconnected collaboration state.",
      },
    },
  },
} satisfies Meta<typeof GlassLiveCursorPresence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlassLiveCursorPresence
        roomId="storybook-liquid-workspace"
        currentUser={currentUser}
        className="glass-foundation-complete glass-w-full glass-max-w-3xl glass-radius-3xl glass-p-8"
        style={surfaceStyle}
        showTrails
        showLabels
      >
        <div className="glass-grid glass-min-h-320 glass-content-center glass-gap-5 glass-text-center">
          <span
            className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide"
            style={{ color: "rgba(15, 23, 42, 0.68)" }}
          >
            Shared workspace
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Presence stays out of the way
          </h2>
          <p className="glass-mx-auto glass-max-w-lg glass-text-secondary glass-leading-relaxed">
            Cursor trails, labels, and connection state layer above the content
            without shifting the collaborative canvas.
          </p>
        </div>
      </GlassLiveCursorPresence>
    </main>
  ),
};
