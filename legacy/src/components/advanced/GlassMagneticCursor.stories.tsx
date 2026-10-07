import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassMagneticCursor } from "./GlassMagneticCursor";

const frameStyle: CSSProperties = {
  minHeight: "100dvh",
  width: "100%",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.08) 32%), linear-gradient(145deg, #f6f6f5, #dfdedb)",
};

const meta: Meta = {
  title: "Effects + Advanced/Glass Magnetic Cursor",
  component: GlassMagneticCursor,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real GlassMagneticCursor export in its contained, accessible preview mode.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <div style={{ width: "min(440px, calc(100vw - 40px))" }}>
        <GlassMagneticCursor
          contained
          compact
          variant="glow"
          color="rgba(255,255,255,0.24)"
          size={26}
          maxWidth={440}
          maxHeight={240}
          magnetStrength={0.36}
          magnetRadius={92}
          aria-label="Contained magnetic cursor material preview"
        />
      </div>
    </main>
  ),
};
