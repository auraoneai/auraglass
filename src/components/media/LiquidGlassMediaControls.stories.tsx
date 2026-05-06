import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassMediaControls } from "./LiquidGlassMediaControls";

const meta: Meta<typeof LiquidGlassMediaControls> = { title: "Media/LiquidGlassMediaControls", component: LiquidGlassMediaControls };
export default meta;
type Story = StoryObj<typeof LiquidGlassMediaControls>;

export const ClearOverMedia: Story = { args: { playing: false, currentTime: 30, duration: 120, variant: "clear" } };
