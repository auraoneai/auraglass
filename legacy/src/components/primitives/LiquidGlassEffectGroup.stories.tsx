import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

const meta: Meta<typeof LiquidGlassEffectGroup> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Effect Group',
  component: LiquidGlassEffectGroup,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassEffectGroup>;

export const GroupedButtons: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, boxSizing: "border-box" }}>
      <style>{`
        .liquid-effect-group-story,
        .liquid-effect-group-story .liquid-glass-content {
          color: #0f172a !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story {
          background:
            linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.08)),
            rgba(17,17,19,.98) !important;
          border: 1px solid rgba(226,232,240,.22);
          box-shadow: 0 24px 80px rgba(0,0,0,.34) !important;
          color: #f8fafc !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story h2 {
          color: #f8fafc !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story p {
          color: #dbeafe !important;
        }

        [data-storybook-preview-mode="dark"] .liquid-effect-group-story .liquid-glass-content {
          color: #f8fafc !important;
        }

        @media (max-width: 480px) {
          .liquid-effect-group-story {
            padding: 22px !important;
          }
        }
      `}</style>
      <div
        className="liquid-effect-group-story"
        style={{
          width: "min(680px, 100%)",
          display: "grid",
          justifyItems: "center",
          gap: 18,
          borderRadius: 30,
          padding: 28,
          background:
            "linear-gradient(145deg, rgba(255,255,255,.34), rgba(255,255,255,.16))",
          border: "1px solid rgba(15,23,42,.12)",
          backdropFilter:
            "blur(32px) saturate(140%) brightness(1.04) contrast(1.02)",
          WebkitBackdropFilter:
            "blur(32px) saturate(140%) brightness(1.04) contrast(1.02)",
          boxShadow: "0 24px 80px rgba(15,23,42,.14)",
          color: "#0f172a",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Grouped effects</h2>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>Adjacent surfaces share the same liquid response.</p>
        </div>
        <LiquidGlassEffectGroup className="glass-flex glass-gap-2" style={{ borderRadius: 999, padding: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {["Inspect", "Tune", "Publish"].map((label) => (
            <LiquidGlassMaterial key={label} material="liquid" interactive radius="full" className="glass-px-4 glass-py-2">
              {label}
            </LiquidGlassMaterial>
          ))}
        </LiquidGlassEffectGroup>
      </div>
    </div>
  ),
};
