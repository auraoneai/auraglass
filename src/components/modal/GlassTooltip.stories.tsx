import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Info, Keyboard, MousePointer2, ShieldCheck } from "@/icons";
import {
  GlassTooltip,
  GlassTooltipContent,
  GlassTooltipTrigger,
} from "./GlassTooltip";

const TooltipButton = ({
  children,
  tone = "overlay",
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "red" | "overlay";
}) => {
  const toneClass =
    tone === "blue"
      ? "glass-surface-blue"
      : tone === "green"
        ? "glass-surface-green"
        : tone === "red"
          ? "glass-surface-red"
          : "glass-surface-overlay";

  return (
    <button
      type="button"
      className={`${toneClass} glass-inline-flex glass-items-center glass-gap-2 glass-radius-lg glass-border glass-border-subtle glass-px-4 glass-py-2 glass-text-sm glass-font-medium glass-text-primary glass-focus glass-touch-target glass-contrast-guard`}
    >
      {children}
    </button>
  );
};

const StaticTooltipPreview = ({ children }: { children: React.ReactNode }) => (
  <div className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-px-3 glass-py-2 glass-text-sm glass-text-primary glass-shadow-lg">
    {children}
  </div>
);

const meta: Meta<typeof GlassTooltip> = {
  title: 'Surfaces/Modals/Glass Tooltip',
  component: GlassTooltip,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass tooltip for concise contextual help with responsive trigger layouts.",
      },
    },
  },
  argTypes: {
    position: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left", "auto"],
    },
    showDelay: { control: { type: "number", min: 0, max: 2000, step: 100 } },
    hideDelay: { control: { type: "number", min: 0, max: 2000, step: 100 } },
  },
  args: {
    position: "top",
    showDelay: 0,
    hideDelay: 100,
    maxWidth: "240px",
  },
};

export default meta;
type Story = StoryObj<typeof GlassTooltip>;

export const Default: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-gap-4 glass-justify-items-center"
      style={{ width: "min(420px, calc(100vw - 64px))" }}
    >
      <GlassTooltip {...args} content="Changes are saved automatically.">
        <TooltipButton tone="blue">
          <Info size={16} aria-hidden="true" />
          Save status
        </TooltipButton>
      </GlassTooltip>
      <StaticTooltipPreview>Changes are saved automatically.</StaticTooltipPreview>
    </div>
  ),
};

export const Positions: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-2 glass-gap-4"
      style={{ width: "min(520px, calc(100vw - 64px))" }}
    >
      {(["top", "right", "bottom", "left"] as const).map((position) => (
        <GlassTooltip
          key={position}
          position={position}
          content={`Tooltip on ${position}`}
          showDelay={args.showDelay}
          hideDelay={args.hideDelay}
        >
          <TooltipButton tone={position === "left" ? "green" : "overlay"}>
            {position}
          </TooltipButton>
        </GlassTooltip>
      ))}
    </div>
  ),
};

export const RichContent: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-gap-4 glass-justify-items-center"
      style={{ width: "min(460px, calc(100vw - 64px))" }}
    >
      <GlassTooltip
        {...args}
        content={
          <div className="glass-grid glass-gap-2">
            <div className="glass-flex glass-items-center glass-gap-2 glass-font-semibold">
              <ShieldCheck size={16} aria-hidden="true" />
              Permission required
            </div>
            <p className="glass-text-sm glass-text-secondary">
              Admin approval is needed before this release can be promoted.
            </p>
          </div>
        }
      >
        <TooltipButton tone="green">
          <ShieldCheck size={16} aria-hidden="true" />
          Review access
        </TooltipButton>
      </GlassTooltip>
      <StaticTooltipPreview>
        Admin approval is needed before this release can be promoted.
      </StaticTooltipPreview>
    </div>
  ),
};

export const TooltipComponents: Story = {
  render: (args) => (
    <div
      className="glass-flex glass-flex-wrap glass-justify-center glass-gap-4"
      style={{ width: "min(560px, calc(100vw - 64px))" }}
    >
      <GlassTooltip
        content={<p>Keyboard shortcut: Command K</p>}
        showDelay={args.showDelay}
        hideDelay={args.hideDelay}
      >
        <GlassTooltipTrigger asChild>
          <TooltipButton>
            <Keyboard size={16} aria-hidden="true" />
            Command menu
          </TooltipButton>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Keyboard shortcut: Command K</p>
        </GlassTooltipContent>
      </GlassTooltip>

      <GlassTooltip
        content={<p>Pointer actions stay inside the current canvas.</p>}
        position="right"
        showDelay={args.showDelay}
        hideDelay={args.hideDelay}
      >
        <GlassTooltipTrigger asChild>
          <TooltipButton tone="blue">
            <MousePointer2 size={16} aria-hidden="true" />
            Pointer mode
          </TooltipButton>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Pointer actions stay inside the current canvas.</p>
        </GlassTooltipContent>
      </GlassTooltip>
    </div>
  ),
  args: {
    children: null,
  },
};

export const CustomTriggerContent: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-gap-4"
      style={{ width: "min(520px, calc(100vw - 64px))" }}
    >
      <GlassTooltip
        content={
          <div className="glass-grid glass-gap-1">
            <div className="glass-font-semibold">Custom trigger</div>
            <p className="glass-text-sm glass-text-secondary">
              Non-button triggers are styled and focusable for keyboard users.
            </p>
          </div>
        }
        showDelay={args.showDelay}
        hideDelay={args.hideDelay}
      >
        <GlassTooltipTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4 glass-text-sm glass-font-medium glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
          >
            Focus or hover this custom glass trigger
          </div>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Non-button triggers are styled and focusable for keyboard users.</p>
        </GlassTooltipContent>
      </GlassTooltip>
      <StaticTooltipPreview>
        Non-button triggers are styled and focusable for keyboard users.
      </StaticTooltipPreview>
    </div>
  ),
  args: {
    children: null,
  },
};
