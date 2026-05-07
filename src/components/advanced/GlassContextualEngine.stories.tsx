import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassContextualEngine";
import { type MissingComponentName } from "../../stories/GlassMissingInventoryCertification.stories";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const componentName = "GlassContextualEngine" satisfies MissingComponentName;
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'AI + Intelligence/Glass Contextual Engine',
  component: Component,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassContextualEngine. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <StorybookVisualShowcase name={componentName} kind="advanced" />,
};
