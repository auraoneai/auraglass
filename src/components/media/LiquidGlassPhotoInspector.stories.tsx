import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassPhotoInspector } from "./LiquidGlassPhotoInspector";

const meta: Meta<typeof LiquidGlassPhotoInspector> = { title: "Media/LiquidGlassPhotoInspector", component: LiquidGlassPhotoInspector };
export default meta;
type Story = StoryObj<typeof LiquidGlassPhotoInspector>;

export const Default: Story = { args: { open: true, metadata: { Camera: "AuraCam", Lens: "35mm" }, tags: ["portrait", "review"] } };
