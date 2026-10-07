import type { Meta, StoryObj } from "@storybook/react";
import {
  HoudiniGlassCard as HoudiniGlassCardComponent,
  HoudiniGlassShowcase as HoudiniGlassShowcaseComponent,
} from "./HoudiniGlassCard";
import { HoudiniGlassProvider } from "./HoudiniGlassProvider";

const meta = {
  title: "Effects + Advanced/Houdini Glass Card",
  component: HoudiniGlassCardComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct Storybook coverage for the exported Houdini glass card and showcase components.",
      },
    },
  },
} satisfies Meta<typeof HoudiniGlassCardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const storyFrame = {
  width: "100%",
  minHeight: "100vh",
  padding: "clamp(20px, 4vw, 48px)",
  boxSizing: "border-box" as const,
};

export const HoudiniGlassCard: Story = {
  args: {
    children: null,
  },
  render: () => (
    <HoudiniGlassProvider enabledEffects={["frost", "border"]} performanceMode>
      <main style={storyFrame}>
        <div style={{ width: "min(100%, 680px)", margin: "0 auto" }}>
          <HoudiniGlassCardComponent
            title="Liquid Glass Workspace"
            description="A direct mount of the exported Houdini glass card."
            preset="standard"
            effects={["frost", "border"]}
            interactive
            showControls
          >
            <div className="glass-space-y-3 glass-p-2">
              <p className="glass-text-primary glass-font-medium">
                Refined depth, responsive highlights, and clear content
                hierarchy.
              </p>
              <p className="glass-text-secondary glass-text-sm">
                The card remains readable and structurally intact across the
                certification viewports.
              </p>
            </div>
          </HoudiniGlassCardComponent>
        </div>
      </main>
    </HoudiniGlassProvider>
  ),
};

export const HoudiniGlassShowcase: Story = {
  args: {
    children: null,
  },
  render: () => (
    <HoudiniGlassProvider
      enabledEffects={["frost", "caustics", "border", "refraction"]}
      performanceMode
    >
      <main style={storyFrame}>
        <div style={{ width: "min(100%, 1120px)", margin: "0 auto" }}>
          <HoudiniGlassShowcaseComponent />
        </div>
      </main>
    </HoudiniGlassProvider>
  ),
};
