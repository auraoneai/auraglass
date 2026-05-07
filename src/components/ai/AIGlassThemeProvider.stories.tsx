import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./AIGlassThemeProvider";

const componentName = "AIGlassThemeProvider";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'AI + Intelligence/AIGlass Theme Provider',
  component: Component,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for AIGlassThemeProvider. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      className="ai-theme-provider-story"
      style={{
        width: "100%",
        maxWidth: 720,
        maxHeight: "min(620px, calc(100vh - 64px))",
        overflow: "auto",
        borderRadius: 20,
        border: "1px solid rgba(15, 23, 42, 0.14)",
        background:
          "linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(224, 242, 254, 0.92))",
        boxShadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
        padding: "clamp(18px, 4vw, 30px)",
        color: "#0f172a",
      }}
    >
      <style>{`
        .ai-theme-provider-story,
        .ai-theme-provider-story * {
          box-sizing: border-box;
        }

        .ai-theme-provider-story :where(h3, p, span, strong, button, div) {
          color: #0f172a;
          overflow-wrap: anywhere;
        }

        .ai-theme-provider-story .ai-theme-provider-story-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(176px, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
      `}</style>
      <Component
        storageKey="storybook-ai-theme-provider"
        enableAnalytics={false}
      >
        <div>
          <span
            style={{
              display: "inline-flex",
              borderRadius: 999,
              border: "1px solid rgba(15, 23, 42, 0.16)",
              background: "rgba(255, 255, 255, 0.78)",
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            AI theme context
          </span>
          <h3 style={{ margin: "12px 0 8px", fontSize: 24, lineHeight: 1.2 }}>
            Adaptive Theme Provider
          </h3>
          <p
            style={{ margin: 0, maxWidth: 560, fontSize: 15, lineHeight: 1.55 }}
          >
            Bounded provider sample with readable content, analytics disabled,
            and deterministic storage so the provider shell can be inspected
            without overflowing the Storybook canvas.
          </p>
          <div className="ai-theme-provider-story-grid">
            {["Sentiment", "Context", "Accessibility"].map((label) => (
              <div
                key={label}
                style={{
                  minWidth: 0,
                  borderRadius: 14,
                  border: "1px solid rgba(15, 23, 42, 0.12)",
                  background: "rgba(255, 255, 255, 0.82)",
                  padding: 16,
                }}
              >
                <strong style={{ display: "block", fontSize: 14 }}>
                  {label}
                </strong>
                <span style={{ display: "block", marginTop: 6, fontSize: 13 }}>
                  Enabled in provider state
                </span>
              </div>
            ))}
          </div>
        </div>
      </Component>
    </div>
  ),
};
