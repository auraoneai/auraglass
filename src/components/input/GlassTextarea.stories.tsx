import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MessageSquareText } from "@/icons";
import { GlassTextarea } from "./GlassTextarea";

const meta: Meta<typeof GlassTextarea> = {
  title: 'Controls/Inputs/Glass Textarea',
  component: GlassTextarea,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass textarea for notes, briefs, and longer form content with validation support.",
      },
    },
  },
  args: {
    label: "Launch note",
    placeholder: "Summarize the campaign change...",
    helperText: "Visible to reviewers before approval.",
    minRows: 4,
    maxLength: 180,
    showCharCount: true,
    fullWidth: true,
    icon: <MessageSquareText size={16} />,
  },
};

export default meta;
type Story = StoryObj<typeof GlassTextarea>;

const TextareaFrame = (args: ComponentProps<typeof GlassTextarea>) => {
  const [value, setValue] = useState("Retune the audience ramp after the first warehouse refresh completes.");

  return (
    <div className="glass-grid glass-w-[min(640px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassTextarea
        {...args}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <GlassTextarea label="Reviewer comment" placeholder="Add a blocking note" errorText="Comment is required when rejecting a launch." fullWidth />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TextareaFrame {...args} />,
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
    label: "Internal note",
    showCharCount: false,
    helperText: "Minimal variant for dense forms.",
  },
  render: (args) => <TextareaFrame {...args} />,
};
