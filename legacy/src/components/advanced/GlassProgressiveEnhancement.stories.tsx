import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  EnhancedGlass as EnhancedGlassComponent,
  GlassProgressiveEnhancement as GlassProgressiveEnhancementComponent,
} from "./GlassProgressiveEnhancement";

const meta = {
  title: "Effects + Advanced/Glass Progressive Enhancement",
  component: GlassProgressiveEnhancementComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct stories for the progressive-enhancement exports with capability detection, performance monitoring, and optional effects pinned for repeatable rendering.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassProgressiveEnhancementComponent>;

export default meta;
type Story = StoryObj;

const stageStyle: CSSProperties = {
  boxSizing: "border-box",
  display: "grid",
  minHeight: "100vh",
  minWidth: 0,
  padding: "clamp(20px, 6vw, 72px)",
  placeItems: "center",
  width: "100%",
};

function StoryStage({ children }: { children: ReactNode }) {
  return (
    <div style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 720px)" }}>{children}</div>
    </div>
  );
}

function EnhancementCopy() {
  return (
    <div className="glass-p-8 glass-space-y-4">
      <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
        Premium quality tier
      </p>
      <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
        One material, gracefully enhanced
      </h2>
      <p className="glass-max-w-xl glass-text-base glass-leading-relaxed glass-text-secondary">
        Blur, motion, and rendering features respond to capability signals while
        the content hierarchy and neutral liquid-glass character remain intact.
      </p>
    </div>
  );
}

function DeterministicEnhancement({ children }: { children: ReactNode }) {
  return (
    <GlassProgressiveEnhancementComponent
      adaptToBattery={false}
      adaptToNetwork={false}
      autoDetect={false}
      className="glass-w-full"
      forcedTier="premium"
      monitorPerformance={false}
      respectUserPreferences
      showDebugHud={false}
    >
      {children}
    </GlassProgressiveEnhancementComponent>
  );
}

export const GlassProgressiveEnhancement: Story = {
  name: "GlassProgressiveEnhancement",
  render: () => (
    <StoryStage>
      <DeterministicEnhancement>
        <EnhancedGlassComponent
          animation={false}
          blur={24}
          className="glass-foundation-complete glass-radius-3xl glass-shadow-soft-xl"
          particles={false}
          webgl={false}
        >
          <EnhancementCopy />
        </EnhancedGlassComponent>
      </DeterministicEnhancement>
    </StoryStage>
  ),
};

export const EnhancedGlass: Story = {
  name: "EnhancedGlass",
  render: () => (
    <StoryStage>
      <DeterministicEnhancement>
        <EnhancedGlassComponent
          animation={false}
          blur={24}
          className="glass-foundation-complete glass-radius-3xl glass-shadow-soft-xl"
          particles={false}
          webgl={false}
        >
          <EnhancementCopy />
        </EnhancedGlassComponent>
      </DeterministicEnhancement>
    </StoryStage>
  ),
};
