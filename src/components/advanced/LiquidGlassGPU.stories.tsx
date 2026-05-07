import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassGPU } from "./LiquidGlassGPU";

const meta: Meta<typeof LiquidGlassGPU> = {
  title: 'Effects + Advanced/Liquid Glass GPU',
  component: LiquidGlassGPU,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassGPU>;

export const Default: Story = {
  render: () => (
    <div
      className="liquid-glass-gpu-story"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .liquid-glass-gpu-scene {
          width: min(920px, 100%);
          min-height: 520px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr);
          gap: 24px;
          padding: 28px;
          border-radius: 32px;
          color: #0f172a;
          background:
            radial-gradient(circle at 18% 20%, rgba(96, 165, 250, .42), transparent 28%),
            radial-gradient(circle at 78% 64%, rgba(45, 212, 191, .34), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,.64), rgba(219,234,254,.36));
          box-shadow: 0 28px 90px rgba(15, 23, 42, .18);
        }

        .liquid-glass-gpu-demo {
          min-height: 360px;
          border-radius: 30px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.72), 0 24px 70px rgba(15,23,42,.18);
        }

        .liquid-glass-gpu-panel {
          display: grid;
          align-content: center;
          gap: 18px;
          min-width: 0;
        }

        .liquid-glass-gpu-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .liquid-glass-gpu-stat {
          border-radius: 18px;
          padding: 14px;
          background: rgba(255,255,255,.58);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.64);
        }

        @media (max-width: 720px) {
          .liquid-glass-gpu-story { padding: 20px; place-items: start center; }
          .liquid-glass-gpu-scene { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
          .liquid-glass-gpu-demo { min-height: 300px; }
        }
      `}</style>
      <div className="liquid-glass-gpu-scene">
        <LiquidGlassGPU
          variant="clear"
          ior={1.58}
          thickness={18}
          sheen={0.72}
          enableRefraction
          enableReflection
          enableParallax
          className="liquid-glass-gpu-demo"
        >
          <div
            style={{
              minHeight: 360,
              display: "grid",
              alignContent: "end",
              gap: 10,
              padding: 24,
              boxSizing: "border-box",
            }}
          >
            <strong style={{ fontSize: 22 }}>GPU refraction layer</strong>
            <span style={{ maxWidth: 360, color: "#334155" }}>
              A clear Liquid Glass shader surface over a detailed backdrop with
              readable foreground content.
            </span>
          </div>
        </LiquidGlassGPU>
        <aside className="liquid-glass-gpu-panel">
          <div>
            <h2 style={{ margin: 0, fontSize: 26 }}>Liquid Glass GPU</h2>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>
              This story renders the component itself, including its CSS fallback,
              instead of a certification placeholder.
            </p>
          </div>
          <div className="liquid-glass-gpu-stat-grid">
            {[
              ["IOR", "1.58"],
              ["Thickness", "18px"],
              ["Sheen", "72%"],
              ["Mode", "Clear"],
            ].map(([label, value]) => (
              <div key={label} className="liquid-glass-gpu-stat">
                <span style={{ display: "block", color: "#64748b", fontSize: 12 }}>
                  {label}
                </span>
                <strong style={{ display: "block", marginTop: 4 }}>{value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  ),
};
