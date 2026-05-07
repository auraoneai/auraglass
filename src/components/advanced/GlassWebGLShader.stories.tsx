import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassWebGLShader";
import { GlassWebGLShader } from "./GlassWebGLShader";

const componentName = "GlassWebGLShader";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'Effects + Advanced/Glass Web GLShader',
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassWebGLShader. This story renders the certified AuraGlass sample used by the full visual certification suite.",
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
        maxWidth: 800,
        height: "clamp(320px, 58vh, 450px)",
        overflow: "hidden",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.28)",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.68) 0%, rgba(22, 78, 99, 0.7) 42%, rgba(76, 29, 149, 0.68) 100%)",
        backdropFilter: "blur(22px)",
        boxShadow: "0 28px 72px rgba(15, 23, 42, 0.4)",
      }}
    >
      <GlassWebGLShader
        className="glass-absolute glass-inset-0"
        variant="prism"
        intensity={0.72}
        animated
        interactive={false}
        backgroundColor="transparent"
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 38%, rgba(255, 255, 255, 0.12) 68%, transparent)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          boxSizing: "border-box",
          height: "100%",
          alignContent: "end",
          padding: "clamp(20px, 4vw, 34px)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            width: "min(440px, 100%)",
            padding: "clamp(16px, 3vw, 22px)",
            borderRadius: 16,
            color: "#f8fafc",
            background: "rgba(15, 23, 42, 0.70)",
            border: "1px solid rgba(255, 255, 255, 0.24)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
            GPU GLASS SHADER
          </div>
          <h3
            style={{
              margin: "8px 0 6px",
              fontSize: "clamp(22px, 5vw, 28px)",
              lineHeight: 1.12,
              color: "#f8fafc",
            }}
          >
            Prism Refraction Preview
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "#f8fafc",
            }}
          >
            The WebGL canvas now fills a framed scene, giving Storybook a
            nonblank render target for shader and fallback inspection.
          </p>
        </div>
      </div>
    </div>
  ),
};
