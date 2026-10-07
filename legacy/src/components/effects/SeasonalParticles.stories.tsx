import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OptimizedGlass } from "../../primitives";
import { SeasonalParticles as SeasonalParticlesComponent } from "./SeasonalParticles";

const stageStyle: CSSProperties = {
  alignItems: "center",
  background:
    "radial-gradient(circle at 22% 14%, rgba(255, 255, 255, 0.98), transparent 34%), radial-gradient(circle at 78% 82%, rgba(203, 213, 225, 0.44), transparent 32%), linear-gradient(145deg, #f8fafc 0%, #e8eef5 100%)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100dvh",
  overflow: "hidden",
  padding: "clamp(16px, 4vw, 48px)",
  width: "100%",
};

const sceneStyle: CSSProperties = {
  height: "min(620px, calc(100dvh - 32px))",
  minHeight: 420,
  minWidth: 0,
  overflow: "hidden",
  position: "relative",
  width: "min(920px, 100%)",
};

const contentStyle: CSSProperties = {
  boxSizing: "border-box",
  left: "50%",
  padding: "clamp(22px, 5vw, 44px)",
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(560px, calc(100% - 32px))",
};

const meta = {
  title: "Effects + Advanced/Seasonal Particles",
  component: SeasonalParticlesComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real SeasonalParticles export composed around a neutral liquid-glass content surface. The static content state keeps review deterministic while the export safely selects its optional 3D implementation when the runtime supports it.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SeasonalParticlesComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SeasonalParticles: Story = {
  name: "SeasonalParticles",
  render: () => (
    <main style={stageStyle}>
      <div style={sceneStyle}>
        <SeasonalParticlesComponent className="glass-w-full glass-h-full">
          <OptimizedGlass
            as="section"
            aria-label="Seasonal particles preview"
            elevation="level2"
            rounded="xl"
            style={contentStyle}
          >
            <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
              Seasonal atmosphere
            </p>
            <h2 className="glass-mt-2 glass-text-3xl glass-font-semibold glass-text-primary">
              A quiet winter study.
            </h2>
            <p className="glass-mt-3 glass-text-secondary glass-leading-relaxed">
              Fine particles move behind a clear, neutral surface while the
              content remains calm and legible.
            </p>
          </OptimizedGlass>
        </SeasonalParticlesComponent>
      </div>
    </main>
  ),
};
