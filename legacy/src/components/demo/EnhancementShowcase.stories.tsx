import type { Meta, StoryObj } from "@storybook/react";
import { EnhancementShowcase as EnhancementShowcaseComponent } from "./EnhancementShowcase";

const meta = {
  title: "Reference/Legacy Components/Enhancement Showcase",
  component: EnhancementShowcaseComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A direct rendering of the complete EnhancementShowcase export without certification substitutes or story-level component overrides.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EnhancementShowcaseComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnhancementShowcase: Story = {
  name: "EnhancementShowcase",
  render: () => <EnhancementShowcaseComponent />,
};
