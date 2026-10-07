import type { Meta, StoryObj } from "@storybook/react";

import {
  GlassImageProcessingProvider as ImageProcessingProvider,
  useImageProcessing,
} from "./GlassImageProcessingProvider";

const ImagePipelineSummary = () => {
  const {
    images,
    templates,
    uploadProgresses,
    autoOptimize,
    defaultOptimizations,
  } = useImageProcessing();

  return (
    <div
      className="glass-surface glass-p-6 glass-radius-xl"
      style={{
        width: "min(560px, calc(100vw - 32px))",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.14) 50%, rgba(255, 255, 255, 0.1) 100%)",
        backdropFilter: "blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",
        border: "1px solid rgba(255, 255, 255, 0.22)",
      }}
    >
      <div className="glass-space-y-5">
        <div>
          <p className="glass-text-xs glass-font-medium glass-text-tertiary glass-uppercase glass-tracking-wide">
            Image pipeline
          </p>
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary glass-mt-1">
            Processing workspace online
          </h2>
          <p className="glass-text-sm glass-text-secondary glass-mt-2">
            Upload, optimization, templates, and AI-assisted edits share one
            live provider state.
          </p>
        </div>

        <div className="glass-grid glass-grid-cols-2 glass-gap-3">
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <span className="glass-text-xs glass-text-tertiary">Assets</span>
            <div className="glass-text-2xl glass-font-semibold glass-text-primary glass-mt-1">
              {images.length}
            </div>
          </div>
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <span className="glass-text-xs glass-text-tertiary">Templates</span>
            <div className="glass-text-2xl glass-font-semibold glass-text-primary glass-mt-1">
              {templates.length}
            </div>
          </div>
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <span className="glass-text-xs glass-text-tertiary">Uploads</span>
            <div className="glass-text-lg glass-font-semibold glass-text-primary glass-mt-1">
              {uploadProgresses.length} active
            </div>
          </div>
          <div className="glass-surface-subtle glass-radius-lg glass-p-4">
            <span className="glass-text-xs glass-text-tertiary">Quality</span>
            <div className="glass-text-lg glass-font-semibold glass-text-primary glass-mt-1">
              {defaultOptimizations.quality}%
            </div>
          </div>
        </div>

        <div className="glass-flex glass-items-center glass-justify-between glass-border-t glass-border-subtle glass-pt-4">
          <span className="glass-text-sm glass-text-secondary">
            Automatic optimization
          </span>
          <span className="glass-text-sm glass-font-semibold glass-text-primary">
            {autoOptimize ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Reference/Legacy Components/Glass Image Processing Provider",
  component: ImageProcessingProvider,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct rendering of the public GlassImageProcessingProvider export with a live consumer reading its image-pipeline state.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageProcessingProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassImageProcessingProvider: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ImageProcessingProvider>
      <ImagePipelineSummary />
    </ImageProcessingProvider>
  ),
};
