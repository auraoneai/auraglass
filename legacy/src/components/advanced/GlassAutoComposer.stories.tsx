import type { ComponentProps, CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassAutoComposer as GlassAutoComposerComponent,
  GlassAutoComposerInterface as GlassAutoComposerInterfaceComponent,
  GlassAutoComposerProvider as GlassAutoComposerProviderComponent,
  GlassGeneratedLayoutRenderer as GlassGeneratedLayoutRendererComponent,
} from "./GlassAutoComposer";

const meta = {
  title: "AI + Intelligence/Glass Auto Composer",
  component: GlassAutoComposerComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct stories for every visual GlassAutoComposer export, using deterministic local generation settings and neutral liquid-glass presentation.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassAutoComposerComponent>;

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

const contentStyle: CSSProperties = {
  minWidth: 0,
  width: "min(100%, 760px)",
};

const composerConfig = {
  accessibility: true,
  designSystem: "glass",
  maxTokens: 1200,
  model: "local",
  responsive: true,
  temperature: 0.3,
} as const;

const renderedLayout: ComponentProps<
  typeof GlassGeneratedLayoutRendererComponent
>["layout"] = {
  confidence: 0.96,
  css: "",
  id: "story-layout-release-overview",
  iterations: 1,
  jsx: '<ReleaseOverview status="ready" />',
  prompt: {
    constraints: ["responsive", "accessible", "neutral liquid glass"],
    description: "A calm release overview for an AI workspace",
    purpose: "release planning",
    style: "minimal",
  },
  timestamp: Date.UTC(2026, 7, 12, 16, 0, 0),
  tokens: {
    animations: {
      duration: { normal: "var(--glass-motion-duration-normal)" },
      easing: { ease: "var(--glass-motion-ease-standard)" },
    },
    borders: { radius: "var(--glass-radius-lg)" },
    colors: {
      accent: "var(--glass-text-secondary)",
      background: "var(--glass-bg-default)",
      primary: "var(--glass-text-primary)",
      secondary: "var(--glass-text-secondary)",
      surface: "var(--glass-gradient-neutral)",
      text: "var(--glass-text-primary)",
      textSecondary: "var(--glass-text-secondary)",
    },
    shadows: { glass: "var(--glass-elev-2)" },
    spacing: { lg: "1.5rem", md: "1rem", sm: "0.5rem" },
    typography: {
      fontSize: { base: "1rem", lg: "1.125rem" },
      fontWeight: { medium: 500, semibold: 600 },
    },
  },
};

function StoryStage({ children }: { children: ReactNode }) {
  return (
    <div style={stageStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}

export const GlassAutoComposer: Story = {
  name: "GlassAutoComposer",
  render: () => (
    <StoryStage>
      <GlassAutoComposerComponent className="glass-w-full" />
    </StoryStage>
  ),
};

export const GlassAutoComposerProvider: Story = {
  name: "GlassAutoComposerProvider",
  render: () => (
    <StoryStage>
      <GlassAutoComposerProviderComponent config={composerConfig}>
        <GlassAutoComposerInterfaceComponent className="glass-w-full" />
      </GlassAutoComposerProviderComponent>
    </StoryStage>
  ),
};

export const GlassAutoComposerInterface: Story = {
  name: "GlassAutoComposerInterface",
  render: () => (
    <StoryStage>
      <GlassAutoComposerProviderComponent config={composerConfig}>
        <GlassAutoComposerInterfaceComponent className="glass-w-full" />
      </GlassAutoComposerProviderComponent>
    </StoryStage>
  ),
};

export const GlassGeneratedLayoutRenderer: Story = {
  name: "GlassGeneratedLayoutRenderer",
  render: () => (
    <StoryStage>
      <GlassGeneratedLayoutRendererComponent
        className="glass-foundation-complete glass-radius-3xl glass-shadow-soft-xl"
        data={{ status: "ready" }}
        layout={renderedLayout}
      />
    </StoryStage>
  ),
};
