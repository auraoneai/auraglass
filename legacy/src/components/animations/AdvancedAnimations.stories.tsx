import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./AdvancedAnimations";

const componentName = "AdvancedAnimations";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'Foundations/Motion/Advanced Animations',
  component: Component,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for AdvancedAnimations. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: "min(720px, calc(100vw - 40px))",
        maxWidth: 720,
        maxHeight: "min(620px, calc(100vh - 64px))",
        overflow: "auto",
        borderRadius: 20,
        border: "1px solid rgba(15, 23, 42, 0.12)",
        background:
          "linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.14))",
        backdropFilter:
          "blur(32px) saturate(140%) brightness(1.04) contrast(1.02)",
        WebkitBackdropFilter:
          "blur(32px) saturate(140%) brightness(1.04) contrast(1.02)",
        boxShadow:
          "0 28px 72px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.88)",
        padding: "clamp(18px, 4vw, 30px)",
        color: "rgba(15, 23, 42, 0.92)",
      }}
    >
      <style>{`
        .advanced-animations-story,
        .advanced-animations-story * {
          box-sizing: border-box;
        }

        .advanced-animations-story :where(h3, p, span, div) {
          overflow-wrap: anywhere;
        }

        .advanced-animations-story :where(.glass-grid) {
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          width: 100%;
          min-width: 0;
        }

        @media (max-width: 520px) {
          .advanced-animations-story :where(.glass-p-6) {
            padding: 18px;
          }
        }
      `}</style>
      <Component className="advanced-animations-story" sampleCount={4} />
    </div>
  ),
};
