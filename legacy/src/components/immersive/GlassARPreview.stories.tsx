import type { Meta, StoryObj } from "@storybook/react";

import { GlassARPreview as ARPreview, type ARObject } from "./GlassARPreview";

const previewObjects: ARObject[] = [
  {
    id: "studio-speaker",
    name: "Studio Speaker",
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 18, z: 0 },
    position: { x: 0, y: 0, z: 0 },
    visible: true,
    opacity: 0.96,
    material: {
      color: "rgba(248, 250, 252, 0.96)",
      metalness: 0.72,
      roughness: 0.18,
    },
    animation: {
      type: "float",
      speed: 0.35,
      enabled: true,
    },
  },
  {
    id: "listening-dock",
    name: "Listening Dock",
    scale: { x: 0.72, y: 0.28, z: 0.72 },
    rotation: { x: 0, y: -12, z: 0 },
    position: { x: 1.45, y: -0.55, z: -0.3 },
    visible: true,
    opacity: 0.82,
    material: {
      color: "rgba(203, 213, 225, 0.92)",
      metalness: 0.58,
      roughness: 0.24,
    },
  },
];

const meta = {
  title: "Effects + Advanced/Glass AR Preview",
  component: ARPreview,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassARPreview export in camera-free inline mode with deterministic neutral objects.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ARPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassARPreview: Story = {
  args: {
    objects: previewObjects,
    enableCamera: false,
    background: "transparent",
    sessionActive: false,
    xrMode: "inline",
    quality: "medium",
    respectMotionPreference: true,
    style: {
      width: "min(720px, calc(100vw - 32px))",
      height: "min(420px, calc(100vh - 48px))",
    },
  },
};
