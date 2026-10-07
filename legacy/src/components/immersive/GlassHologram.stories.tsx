import type { Meta, StoryObj } from "@storybook/react";

import { GlassHologram as Hologram, type HologramLayer } from "./GlassHologram";

const hologramLayers: HologramLayer[] = [
  {
    id: "aura-mark",
    type: "text",
    content: "AURA",
    opacity: 0.96,
    depth: 16,
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1.08, y: 1.08, z: 1 },
    position: { x: -34, y: -12, z: 0 },
    animation: {
      type: "float",
      speed: 0.32,
      amplitude: 4,
      enabled: true,
    },
    holographic: {
      interference: true,
      chromatic: false,
      scanlines: true,
      noise: 0.04,
    },
  },
  {
    id: "signal-core",
    type: "shape",
    opacity: 0.78,
    depth: 52,
    rotation: { x: 14, y: 22, z: 8 },
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    position: { x: 48, y: 34, z: 0 },
    animation: {
      type: "rotate",
      speed: 0.22,
      amplitude: 1,
      enabled: true,
    },
    holographic: {
      interference: false,
      chromatic: false,
      scanlines: false,
      noise: 0,
    },
  },
];

const meta = {
  title: "Effects + Advanced/Glass Hologram",
  component: Hologram,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassHologram export with neutral white projection layers and reduced visual noise.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Hologram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassHologram: Story = {
  args: {
    layers: hologramLayers,
    colorScheme: "white",
    size: "md",
    background: "grid",
    intensity: "medium",
    ambientLight: 0.4,
    autoRotate: false,
    interactive: true,
    scanLines: true,
    glitchEnabled: false,
    chromaticAberration: false,
    noiseOverlay: false,
    depthOfField: true,
    showControls: true,
    respectMotionPreference: true,
  },
};
