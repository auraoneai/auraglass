import type { Meta, StoryObj } from "@storybook/react";
import { SpatialComputingEngine as SpatialComputingEngineComponent } from "./SpatialComputingEngine";

const meta: Meta<typeof SpatialComputingEngineComponent> = {
  title: "Reference/Legacy Components/Spatial Computing Engine",
  component: SpatialComputingEngineComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A direct, deterministic preview of the spatial-computing export. XR initialization, physics, anchoring, and gesture listeners remain disabled so visual certification captures the component itself in a stable state.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SpatialComputingEngineComponent>;

export const SpatialComputingEngine: Story = {
  args: {
    children: null,
  },
  render: () => (
    <main
      style={{
        minHeight: "100vh",
        padding: "clamp(1.25rem, 6vw, 4rem)",
        display: "grid",
        placeItems: "center",
        color: "rgba(15, 23, 42, 0.92)",
        background:
          "radial-gradient(circle at 24% 20%, rgba(255, 255, 255, 0.98), transparent 34%), linear-gradient(145deg, #eeeeef 0%, #fafafa 48%, #e7e7e9 100%)",
      }}
    >
      <SpatialComputingEngineComponent
        spatialId="storybook-spatial-engine"
        position={{ x: 0, y: 0, z: 0, pitch: 0, yaw: 0, roll: 0 }}
        enableGestures={false}
        enableAnchoring={false}
        enablePhysics={false}
        enableOcclusion={false}
      >
        <section
          className="glass-foundation-complete glass-radius-2xl glass-border glass-border-white/20 glass-p-6"
          style={{
            width: "min(100%, 34rem)",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.30), rgba(250,250,250,0.22))",
            borderColor: "rgba(255,255,255,0.28)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.28), 0 18px 46px rgba(24,24,27,0.14)",
            backdropFilter:
              "blur(24px) saturate(1.4) brightness(1.04) contrast(1.02)",
            WebkitBackdropFilter:
              "blur(24px) saturate(1.4) brightness(1.04) contrast(1.02)",
          }}
        >
          <p
            className="glass-text-xs glass-uppercase glass-tracking-wide"
            style={{ color: "rgba(15, 23, 42, 0.68)" }}
          >
            Spatial coordinate 0 · 0 · 0
          </p>
          <h2 className="glass-text-2xl glass-text-primary glass-font-semibold glass-mt-2">
            Spatial computing surface
          </h2>
          <p className="glass-text-sm glass-text-secondary glass-mt-3">
            The real engine owns this three-dimensional scene while its liquid
            glass content remains crisp, neutral, and fully contained.
          </p>
        </section>
      </SpatialComputingEngineComponent>
    </main>
  ),
};
