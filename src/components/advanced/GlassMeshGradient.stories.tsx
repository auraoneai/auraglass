import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassMeshGradient";
import { GlassMeshGradient } from "./GlassMeshGradient";

const componentName = "GlassMeshGradient";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'Effects + Advanced/Glass Mesh Gradient',
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassMeshGradient. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    previewSurface: "media",
  },
  render: () => (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 760,
        height: "clamp(320px, 56vh, 420px)",
        overflow: "hidden",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.34)",
        background: "rgba(15, 23, 42, 0.68)",
        backdropFilter: "blur(22px)",
        boxShadow: "0 28px 72px rgba(15, 23, 42, 0.34)",
      }}
    >
      <GlassMeshGradient
        aria-label="GlassMeshGradient animated mesh gradient preview"
        className="glass-absolute glass-inset-0"
        colors={["#38bdf8", "#22c55e", "#a855f7", "#f59e0b"]}
        points={6}
        speed={0.32}
        blur={72}
        opacity={0.92}
        variant="vibrant"
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          boxSizing: "border-box",
          height: "100%",
          alignContent: "end",
          padding: "clamp(20px, 4vw, 32px)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            padding: "clamp(16px, 3vw, 20px)",
            borderRadius: 16,
            color: "#f8fafc",
            background: "rgba(15, 23, 42, 0.70)",
            border: "1px solid rgba(255, 255, 255, 0.24)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
            ADVANCED VISUAL SYSTEM
          </div>
          <h3
            style={{
              margin: "8px 0 6px",
              fontSize: "clamp(22px, 5vw, 28px)",
              lineHeight: 1.12,
              color: "#f8fafc",
            }}
          >
            Mesh Gradient Field
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "#f8fafc",
            }}
          >
            A full-size animated canvas with enough contrast and foreground
            structure to verify color blending, blur, and glass layering.
          </p>
        </div>
      </div>
    </div>
  ),
};
