import type { Meta, StoryObj } from "@storybook/react";
import { GlassPerformanceProvider } from "./GlassPerformanceOptimization";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Performance Optimization',
  component: GlassPerformanceProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/GlassPerformanceOptimization stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassPerformanceProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassPerformanceOptimization / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const PerformanceDashboard: Story = makeStory("Performance Dashboard");
export const EfficientRendering: Story = makeStory("Efficient Rendering");
export const LazyLoading: Story = makeStory("Lazy Loading");
export const BatteryOptimization: Story = makeStory("Battery Optimization");
export const ProgressiveEnhancement: Story = makeStory("Progressive Enhancement");
