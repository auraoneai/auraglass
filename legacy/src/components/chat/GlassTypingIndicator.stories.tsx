import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MessageCircle, ShieldCheck } from "@/icons";
import { GlassTypingIndicator } from "./GlassTypingIndicator";

const chatShellStyle: React.CSSProperties = {
  width: "min(520px, calc(100vw - 64px))",
  display: "grid",
  gap: 16,
};

const meta = {
  title: 'Workflows/Glass Typing Indicator',
  component: GlassTypingIndicator,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A compact glass typing indicator for chat, collaboration, and assistant interfaces.",
      },
    },
  },
  args: {
    users: ["Maya", "Ari"],
    showUsers: true,
    size: "md",
    elevation: "level2",
    variant: "bounce",
    dotColor: "primary",
    dotCount: 3,
    glass: true,
  },
} satisfies Meta<typeof GlassTypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={chatShellStyle}>
      <div className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5">
        <div className="glass-flex glass-items-center glass-gap-3 glass-mb-5">
          <span className="glass-inline-flex glass-h-10 glass-w-10 glass-items-center glass-justify-center glass-radius-full glass-surface-blue">
            <MessageCircle size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 className="glass-text-base glass-font-semibold glass-text-primary">
              Design review
            </h3>
            <p className="glass-text-sm glass-text-secondary">
              Active conversation preview
            </p>
          </div>
        </div>

        <div className="glass-flex glass-flex-col glass-gap-3">
          <div className="glass-w-fit glass-max-w-full glass-radius-xl glass-surface-overlay glass-border glass-border-subtle glass-px-4 glass-py-3 glass-text-sm glass-text-primary">
            Can we ship the clearer glass surface today?
          </div>
          <div className="glass-ml-auto glass-w-fit glass-max-w-full glass-radius-xl glass-surface-blue glass-px-4 glass-py-3 glass-text-sm glass-text-primary">
            Yes, checking the final contrast pass now.
          </div>
          <GlassTypingIndicator {...args} />
        </div>
      </div>
    </div>
  ),
};

export const DotVariants: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-gap-3"
      style={{ width: "min(560px, calc(100vw - 64px))" }}
    >
      {(["bounce", "pulse", "wave", "fade"] as const).map((variant) => (
        <div
          key={variant}
          className="glass-flex glass-items-center glass-justify-between glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4"
        >
          <span className="glass-text-sm glass-font-medium glass-text-primary">
            {variant}
          </span>
          <GlassTypingIndicator
            {...args}
            showUsers={false}
            users={undefined}
            variant={variant}
            dotColor={variant === "wave" ? "success" : "primary"}
          />
        </div>
      ))}
    </div>
  ),
};

export const CompactStatus: Story = {
  args: {
    users: "Ops assistant",
    text: "{users} {isAre} summarizing the handoff...",
    size: "sm",
    elevation: "level1",
    dotColor: "success",
  },
  render: (args) => (
    <div className="glass-flex glass-items-center glass-gap-3 glass-radius-full glass-border glass-border-subtle glass-surface-overlay glass-p-3">
      <ShieldCheck size={18} className="glass-text-primary" aria-hidden="true" />
      <GlassTypingIndicator {...args} />
    </div>
  ),
};
