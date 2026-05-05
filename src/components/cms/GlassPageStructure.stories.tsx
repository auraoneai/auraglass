import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as ComponentModule from "./GlassPageStructure";
import {
  CertificationCase,
  type MissingComponentName,
} from "../../stories/GlassMissingInventoryCertification.stories";

const componentName = "GlassPageStructure" satisfies MissingComponentName;
const Component =
  (ComponentModule as Record<string, any>)[componentName] ??
  (ComponentModule as Record<string, any>).default;

const meta = {
  title: "Components/Cms/GlassPageStructure",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassPageStructure. This story renders the certified AuraGlass sample used by the full visual certification suite.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CertificationCase name={componentName} />,
};
