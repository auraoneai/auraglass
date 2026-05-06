import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassControlGroup } from "./LiquidGlassControlGroup";

const meta: Meta<typeof LiquidGlassControlGroup> = { title: "Input/LiquidGlassControlGroup", component: LiquidGlassControlGroup };
export default meta;
type Story = StoryObj<typeof LiquidGlassControlGroup>;

export const ToolbarGroup: Story = { render: () => <LiquidGlassControlGroup><button>Bold</button><button>Italic</button></LiquidGlassControlGroup> };
