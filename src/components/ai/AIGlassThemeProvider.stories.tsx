import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./AIGlassThemeProvider";
import {
  CertificationCase,
  type MissingComponentName,
} from "../../stories/GlassMissingInventoryCertification.stories";

const componentName = "AIGlassThemeProvider" satisfies MissingComponentName;
const Component = (ComponentModule as Record<string, any>)[componentName];

const meta = {
  title: "Components/Ai/AIGlassThemeProvider",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for AIGlassThemeProvider. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CertificationCase name={componentName} />,
};
