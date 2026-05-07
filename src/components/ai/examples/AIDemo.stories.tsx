import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./AIDemo";

const componentName = "AIDemo";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'AI + Intelligence/AIDemo',
  component: Component,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for AIDemo. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      className="ai-demo-story-shell"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "clamp(16px, 3vw, 32px)",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 46%, #eef2ff 100%)",
        color: "#0f172a",
      }}
    >
      <style>{`
        .ai-demo-story-shell,
        .ai-demo-story-shell * {
          box-sizing: border-box;
        }

        .ai-demo-story-shell > [data-glass-component] {
          width: min(920px, 100%);
          min-height: 0;
          max-height: min(760px, calc(100vh - 64px));
          overflow: auto;
          padding: 0;
        }

        .ai-demo-story-shell [data-glass-component] > div {
          width: 100%;
          max-width: none;
          margin: 0;
        }

        .ai-demo-story-shell :where(h1, h2, h3, h4, p, label, span, strong, button, code, input, div) {
          color: #0f172a;
          opacity: 1;
          overflow-wrap: anywhere;
        }

        .ai-demo-story-shell :where(button, input, code) {
          max-width: 100%;
          border-color: rgba(15, 23, 42, 0.18);
        }

        [data-storybook-preview-mode="dark"] .ai-demo-story-shell :where(button) {
          color: #f8fafc;
          border-color: rgba(226, 232, 240, 0.22);
          background: rgba(15, 23, 42, 0.68);
        }

        .ai-demo-story-shell :where(input) {
          background: rgba(255, 255, 255, 0.92);
        }

        .ai-demo-story-shell :where(.glass-flex) {
          flex-wrap: wrap;
        }

        .ai-demo-story-shell :where(.glass-grid-cols-2) {
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        .ai-demo-story-shell :where(.glass-min-h-400px) {
          min-height: 260px;
        }

        @media (max-width: 640px) {
          .ai-demo-story-shell {
            padding: 16px;
          }

          .ai-demo-story-shell > [data-glass-component] {
            max-height: calc(100vh - 40px);
          }

          .ai-demo-story-shell :where(.glass-p-8) {
            padding: 18px;
          }
        }
      `}</style>
      <Component />
    </div>
  ),
};
