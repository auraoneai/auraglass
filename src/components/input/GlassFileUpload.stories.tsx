import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassFileUpload as Component } from "./GlassFileUpload";

const meta = {
  title: "Components/Input/GlassFileUpload",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component-owned Storybook coverage for GlassFileUpload.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Component
      accept="image/*"
      maxFiles={2}
      uploadText="Drop glass assets here for certification"
      browseText="Browse assets"
      showPreview={false}
      onUpload={async () => undefined}
    />
  ),
};
