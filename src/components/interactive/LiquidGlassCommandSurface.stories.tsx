import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassCommandSurface } from "./LiquidGlassCommandSurface";

const meta: Meta<typeof LiquidGlassCommandSurface> = {
  title: 'Effects + Advanced/Liquid Glass Command Surface',
  component: LiquidGlassCommandSurface,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassCommandSurface>;

export const Default: Story = {
  render: () => (
    <div
      data-bg="light"
      className="glass-on-light"
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: 32,
        boxSizing: "border-box",
        color: "#0f172a",
      }}
    >
      <style>{`
        .glass-liquid-command-story-backdrop {
          min-height: calc(100vh - 64px);
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
          gap: 24px;
          border-radius: 32px;
          padding: 28px;
          background:
            radial-gradient(circle at 22% 24%, rgba(96,165,250,.34), transparent 28%),
            radial-gradient(circle at 78% 68%, rgba(45,212,191,.28), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.58), rgba(248,250,252,.34));
          box-shadow: 0 24px 80px rgba(15,23,42,.14);
        }

        .glass-liquid-command-story-card {
          border-radius: 24px;
          padding: 22px;
          background: rgba(255,255,255,.52);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.64);
        }

        .liquid-glass-command-surface {
          color: #0f172a;
          box-shadow: 0 28px 90px rgba(15, 23, 42, .2);
        }

        .liquid-glass-command-surface input {
          appearance: none;
          color: #0f172a;
          caret-color: #2563eb;
        }

        .liquid-glass-command-surface button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }

        @media (max-width: 720px) {
          .glass-liquid-command-story-backdrop {
            min-height: calc(100vh - 40px);
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }
      `}</style>
      <div className="glass-liquid-command-story-backdrop" aria-hidden="true">
        <section className="glass-liquid-command-story-card">
          <h2 style={{ margin: 0, fontSize: 28 }}>Workspace command center</h2>
          <p style={{ maxWidth: 520, color: "#475569" }}>
            The command surface floats over real app content with enough spacing
            for groups, shortcuts, hover states, and scroll edge treatment.
          </p>
        </section>
        <section className="glass-liquid-command-story-card">
          <strong>Recent activity</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {["Media export finished", "Review room synced", "Design tokens updated"].map((item) => (
              <span
                key={item}
                style={{
                  borderRadius: 16,
                  padding: "10px 12px",
                  background: "rgba(255,255,255,.54)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
      <LiquidGlassCommandSurface
        open
        placeholder="Search commands"
        items={[
          { id: "open-dashboard", label: "Open dashboard", description: "Jump to the workspace overview", shortcut: "Cmd 1" },
          { id: "review-media", label: "Review media queue", description: "Inspect exports waiting for approval", shortcut: "Cmd 2" },
          { id: "toggle-liquid", label: "Toggle Liquid preview", description: "Switch the canvas into clear glass mode", shortcut: "Cmd L" },
          { id: "share-room", label: "Share review room", description: "Copy the current review room link", shortcut: "Cmd Shift S" },
          { id: "open-settings", label: "Open material settings", description: "Tune IOR, thickness, and performance policy", shortcut: "Cmd ," },
        ]}
      />
    </div>
  ),
};
