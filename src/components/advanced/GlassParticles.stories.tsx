import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassParticles";
import { GlassParticles } from "./GlassParticles";

const componentName = "GlassParticles";
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'Effects + Advanced/Glass Particles',
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
        border: "1px solid rgba(255, 255, 255, 0.28)",
        background:
          "radial-gradient(circle at 22% 18%, rgba(56, 189, 248, 0.32), transparent 34%), rgba(2, 6, 23, 0.68)",
        backdropFilter: "blur(22px)",
        boxShadow: "0 28px 72px rgba(2, 6, 23, 0.44)",
      }}
    >
      <GlassParticles
        aria-label="GlassParticles animated particle field preview"
        className="glass-absolute glass-inset-0"
        count={86}
        maxSize={7}
        minSize={2}
        speed={0.34}
        connectionDistance={126}
        colorScheme="gradient"
        colors={["#7dd3fc", "#c4b5fd", "#5eead4"]}
        behavior="float"
        mouseInteraction={false}
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
          color: "#f8fafc",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "min(460px, 100%)",
            padding: "clamp(16px, 3vw, 22px)",
            borderRadius: 16,
            color: "#f8fafc",
            background: "rgba(15, 23, 42, 0.70)",
            border: "1px solid rgba(255, 255, 255, 0.24)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
            CANVAS PARTICLE SYSTEM
          </div>
          <h3
            style={{
              margin: "8px 0 6px",
              fontSize: "clamp(22px, 5vw, 28px)",
              lineHeight: 1.12,
              color: "#f8fafc",
            }}
          >
            Connected Glass Particles
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "#f8fafc",
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
