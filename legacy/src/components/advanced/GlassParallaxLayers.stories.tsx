import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassParallaxLayers } from "./GlassParallaxLayers";

const frameStyle: CSSProperties = {
  minHeight: "100dvh",
  width: "100%",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 18% 14%, #ffffff 0%, transparent 30%), linear-gradient(145deg, #efefed, #cfceca)",
};

const layerCardStyle: CSSProperties = {
  minHeight: "130px",
  display: "grid",
  alignContent: "center",
  gap: "8px",
  padding: "24px",
  color: "#0f172a",
};

const meta = {
  title: "Effects + Advanced/Glass Parallax Layers",
  component: GlassParallaxLayers,
  args: {
    layers: [],
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The actual GlassParallaxLayers export with real depth layers, bounded motion, and neutral liquid surfaces.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassParallaxLayers>;

export default meta;
type Story = StoryObj<typeof meta>;

function LayerContent({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={layerCardStyle}>
      <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
        {eyebrow}
      </span>
      <strong className="glass-text-xl glass-font-semibold glass-text-primary">
        {title}
      </strong>
    </div>
  );
}

function ParallaxScene({
  autoRotate = false,
  debug = false,
  content,
}: {
  autoRotate?: boolean;
  debug?: boolean;
  content?: ReactNode;
}) {
  const layers = [
    {
      depth: 8,
      blur: "lg" as const,
      opacity: 1,
      scale: 0.88,
      content: content ?? (
        <LayerContent eyebrow="Atmosphere" title="Far material" />
      ),
    },
    {
      depth: 4,
      blur: "md" as const,
      opacity: 1,
      scale: 0.94,
      content: <LayerContent eyebrow="Context" title="Middle material" />,
    },
    {
      depth: 0,
      blur: "sm" as const,
      content: <LayerContent eyebrow="Focus" title="Front material" />,
    },
  ];

  return (
    <main style={frameStyle}>
      <div style={{ width: "min(760px, 100%)", height: "460px" }}>
        <GlassParallaxLayers
          layers={layers}
          mouseIntensity={0.24}
          scrollIntensity={0.1}
          perspective={1400}
          autoRotate={autoRotate}
          rotateSpeed={0.08}
          interactive
          debug={debug}
          aria-label="Interactive liquid glass depth composition"
        />
      </div>
    </main>
  );
}

export const HeroSection: Story = { render: () => <ParallaxScene /> };
export const CardStack: Story = { render: () => <ParallaxScene /> };
export const AutoRotating: Story = {
  render: () => <ParallaxScene autoRotate />,
};
export const DataVisualization: Story = {
  render: () => (
    <ParallaxScene
      content={<LayerContent eyebrow="Signals" title="Depth telemetry" />}
    />
  ),
};
export const InteractiveDebug: Story = {
  render: () => <ParallaxScene debug />,
};
