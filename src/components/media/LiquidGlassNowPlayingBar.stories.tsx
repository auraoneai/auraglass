import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassNowPlayingBar } from "./LiquidGlassNowPlayingBar";

const meta: Meta<typeof LiquidGlassNowPlayingBar> = { title: "Media/LiquidGlassNowPlayingBar", component: LiquidGlassNowPlayingBar };
export default meta;
type Story = StoryObj<typeof LiquidGlassNowPlayingBar>;

export const Default: Story = { args: { title: "Liquid Study", subtitle: "Aura System", progress: 0.42 } };
