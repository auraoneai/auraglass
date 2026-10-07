import type { Meta, StoryObj } from "@storybook/react";

import {
  GlassParticleField as ParticleField,
  type ParticleEmitter,
  type ParticleForce,
} from "./GlassParticleField";

const neutralEmitter: ParticleEmitter = {
  id: "neutral-orbit",
  x: 310,
  y: 180,
  z: 0,
  rate: 18,
  velocity: { min: 12, max: 28 },
  angle: { min: 0, max: Math.PI * 2 },
  size: { min: 2, max: 5 },
  life: { min: 3.2, max: 5.4 },
  colors: [
    "rgba(255, 255, 255, 0.96)",
    "rgba(226, 232, 240, 0.9)",
    "rgba(100, 116, 139, 0.78)",
  ],
  enabled: true,
};

const orbitalForce: ParticleForce = {
  type: "vortex",
  strength: 6,
  x: 310,
  y: 180,
  z: 0,
  radius: 220,
  enabled: true,
};

const meta = {
  title: "Effects + Advanced/Glass Particle Field",
  component: ParticleField,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassParticleField export with a restrained monochrome emitter and bounded particle count.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ParticleField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassParticleField: Story = {
  render: () => (
    <div style={{ width: "min(620px, calc(100vw - 32px))" }}>
      <ParticleField
        emitters={[neutralEmitter]}
        forces={[orbitalForce]}
        maxParticles={80}
        physics
        collisions={false}
        trails={false}
        interactive={false}
        bounds={{ width: 620, height: 360, depth: 80 }}
        performance={{ culling: true, lodDistance: 220, targetFPS: 60 }}
        effects={{ bloom: false, blur: false, glow: true, sparkle: false }}
        colorScheme="monochrome"
        speed={0.72}
        paused
        debug={false}
        respectMotionPreference
        style={{ width: "100%" }}
      />
    </div>
  ),
};
