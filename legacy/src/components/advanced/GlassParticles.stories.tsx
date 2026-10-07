import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassParticles";
import { GlassParticles } from "./GlassParticles";

const componentName = "GlassParticles";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: "Effects + Advanced/Glass Particles",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassParticles. This story renders the certified AuraGlass sample used by the full visual certification suite.",
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
        maxWidth: 760,
        height: "clamp(320px, 56vh, 420px)",
        overflow: "hidden",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.28)",
        background:
          "radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.08) 34%), linear-gradient(135deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.18))",
        backdropFilter:
          "blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)",
        WebkitBackdropFilter:
          "blur(24px) saturate(1.8) brightness(1.05) contrast(1.05)",
        boxShadow: "0 28px 72px rgba(15, 23, 42, 0.16)",
      }}
    >
      <GlassParticles
        aria-label="GlassParticles animated particle field preview"
        className="glass-absolute glass-inset-0"
        count={86}
        maxSize={7}
        minSize={2}
        speed={0.34}
        connectionDistance={72}
        colorScheme="custom"
        colors={[
          "rgba(226,232,240,0.94)",
          "rgba(241,245,249,0.96)",
          "rgba(255,255,255,0.98)",
        ]}
        behavior="float"
        mouseInteraction={false}
        compact
        style={{
          position: "absolute",
          inset: 0,
          minHeight: 0,
          height: "100%",
          maxHeight: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          boxSizing: "border-box",
          height: "100%",
          alignContent: "center",
          justifyItems: "center",
          padding: "clamp(20px, 4vw, 32px)",
          color: "#0f172a",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "min(460px, 100%)",
            padding: "clamp(16px, 3vw, 22px)",
            borderRadius: 16,
            color: "#0f172a",
            background: "rgba(255, 255, 255, 0.30)",
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
              color: "rgba(15,23,42,0.72)",
            }}
          >
            CANVAS PARTICLE SYSTEM
          </div>
          <h3
            style={{
              margin: "8px 0 6px",
              fontSize: "clamp(22px, 5vw, 28px)",
              lineHeight: 1.12,
              color: "#0f172a",
            }}
          >
            Connected Glass Particles
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "#334155",
            }}
          >
            Stable preview dimensions keep the particle canvas visible while the
            foreground card makes density and contrast easy to inspect.
          </p>
        </div>
      </div>
    </div>
  ),
};
