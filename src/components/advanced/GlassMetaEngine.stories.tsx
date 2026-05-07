import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassMetaEngine";
import { type MissingComponentName } from "../../stories/GlassMissingInventoryCertification.stories";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const componentName = "GlassMetaEngine" satisfies MissingComponentName;
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: 'Effects + Advanced/Glass Meta Engine',
  component: Component,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassMetaEngine. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <StorybookVisualShowcase name={componentName} kind="advanced" />,
};
