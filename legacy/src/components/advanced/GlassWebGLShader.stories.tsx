import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassWebGLShader";
import { GlassWebGLShader } from "./GlassWebGLShader";

const componentName = "GlassWebGLShader";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: "Effects + Advanced/Glass Web GLShader",
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
    previewSurface: "component",
  },
  render: () => (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 800,
        height: "clamp(320px, 58vh, 450px)",
        overflow: "auto",
        scrollbarWidth: "none",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.28)",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 42%, rgba(255, 255, 255, 0.14) 100%)",
        backdropFilter:
          "blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)",
        WebkitBackdropFilter:
          "blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)",
        boxShadow: "0 28px 72px rgba(20, 20, 20, 0.28)",
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
          color: "rgba(15, 23, 42, 0.92)",
        }}
      >
        <div
          style={{
            width: "min(440px, 100%)",
            padding: "clamp(16px, 3vw, 22px)",
            borderRadius: 16,
            color: "rgba(15, 23, 42, 0.92)",
            background: "rgba(255, 255, 255, 0.24)",
            border: "1px solid rgba(255, 255, 255, 0.24)",
            backdropFilter:
              "blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)",
            WebkitBackdropFilter:
              "blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(15, 23, 42, 0.72)",
            }}
          >
            GPU GLASS SHADER
          </div>
          <h3
            style={{
              margin: "8px 0 6px",
              fontSize: "clamp(22px, 5vw, 28px)",
              lineHeight: 1.12,
              color: "rgba(15, 23, 42, 0.94)",
            }}
          >
            Prism Refraction Preview
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(15, 23, 42, 0.78)",
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
