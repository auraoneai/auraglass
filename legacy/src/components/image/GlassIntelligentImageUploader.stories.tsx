import type { Meta, StoryObj } from "@storybook/react";

import { GlassImageProcessingProvider as ImageProcessingProvider } from "./GlassImageProcessingProvider";
import { GlassIntelligentImageUploader as IntelligentImageUploader } from "./GlassIntelligentImageUploader";

const meta = {
  title: "AI + Intelligence/Glass Intelligent Image Uploader",
  component: IntelligentImageUploader,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassIntelligentImageUploader export inside its required image-processing provider.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IntelligentImageUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassIntelligentImageUploader: Story = {
  render: () => (
    <ImageProcessingProvider>
      <div
        style={{
          width: "min(720px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        <IntelligentImageUploader
          aria-label="Intelligent image uploader"
          maxFiles={6}
          maxFileSize={12}
          acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
          showEditor={false}
          showOptimization
          showTemplates
          showAIFeatures
        />
      </div>
    </ImageProcessingProvider>
  ),
};
