import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassPopoverMenu } from "./LiquidGlassPopoverMenu";

const meta: Meta<typeof LiquidGlassPopoverMenu> = { title: "Modal/LiquidGlassPopoverMenu", component: LiquidGlassPopoverMenu };
export default meta;
type Story = StoryObj<typeof LiquidGlassPopoverMenu>;

export const Default: Story = { args: { open: true, items: [{ id: "copy", label: "Copy" }, { id: "paste", label: "Paste" }] } };
