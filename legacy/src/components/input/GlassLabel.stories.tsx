import type { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle, CheckCircle2, Info } from "@/icons";
import { GlassLabel } from "./GlassLabel";
import { GlassInput } from "./GlassInput";

const meta: Meta<typeof GlassLabel> = {
  title: 'Controls/Inputs/Glass Label',
  component: GlassLabel,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass-aware form label with required, icon, description, and state variants.",
      },
    },
  },
  args: {
    children: "Workspace slug",
    description: "Lowercase letters, numbers, and hyphens only.",
    required: true,
    enhanced: true,
    icon: <Info size={15} />,
  },
};

export default meta;
type Story = StoryObj<typeof GlassLabel>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <GlassLabel {...args} htmlFor="workspace-slug" />
        <GlassInput id="workspace-slug" placeholder="revenue-ops" fullWidth />
      </div>
      <GlassLabel variant="success" icon={<CheckCircle2 size={15} />} description="The saved value passed validation.">
        Approved setting
      </GlassLabel>
      <GlassLabel variant="warning" icon={<AlertTriangle size={15} />} description="This label is readable in warning contexts.">
        Needs review
      </GlassLabel>
    </div>
  ),
};
