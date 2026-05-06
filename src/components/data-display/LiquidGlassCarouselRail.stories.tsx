import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassCarouselRail } from "./LiquidGlassCarouselRail";

const meta: Meta<typeof LiquidGlassCarouselRail> = { title: "Data Display/LiquidGlassCarouselRail", component: LiquidGlassCarouselRail };
export default meta;
type Story = StoryObj<typeof LiquidGlassCarouselRail>;

export const Default: Story = { args: { items: Array.from({ length: 6 }, (_, i) => <div className="glass-w-40 glass-radius-xl glass-surface-subtle glass-p-4">Item {i + 1}</div>) } };
