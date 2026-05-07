import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { BarChart3, Bell, Settings } from "lucide-react";
import { GlassCoachmarks } from "./GlassCoachmarks";

const steps = [
  {
    id: "welcome",
    content: (
      <div>
        <h3 className="glass-text-base glass-font-semibold glass-text-primary glass-mb-1">
          Start with campaign health
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          Coachmarks should sit over real UI, with clear glass and controls that
          do not crowd on mobile.
        </p>
      </div>
    ),
  },
  {
    id: "alerts",
    content: (
      <div>
        <h3 className="glass-text-base glass-font-semibold glass-text-primary glass-mb-1">
          Review priority alerts
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          Use concise guidance and keep all actions inside the visible panel.
        </p>
      </div>
    ),
  },
  {
    id: "settings",
    content: (
      <div>
        <h3 className="glass-text-base glass-font-semibold glass-text-primary glass-mb-1">
          Tune workspace settings
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          Final step copy remains readable in dark and liquid preview modes.
        </p>
      </div>
    ),
  },
];

const DemoSurface = ({ current = 0 }: { current?: number }) => (
  <div className="glass-min-h-screen glass-p-6">
    <div
      className="glass-mx-auto glass-grid glass-gap-4"
      style={{ maxWidth: 880 }}
    >
      <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5">
        <div>
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
            Campaign command center
          </h2>
          <p className="glass-text-sm glass-text-secondary">
            Guided tour overlay mounted open for inspection.
          </p>
        </div>
        <button
          type="button"
          className="glass-radius-lg glass-surface-blue glass-px-4 glass-py-2 glass-text-sm glass-font-medium glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
        >
          Restart tour
        </button>
      </div>

      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4">
        {[
          [BarChart3, "Campaign health", "94% delivery confidence"],
          [Bell, "Priority alerts", "2 changes need review"],
          [Settings, "Workspace settings", "Automation enabled"],
        ].map(([Icon, title, value]) => (
          <div
            key={String(title)}
            className="glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-4"
          >
            <Icon size={20} className="glass-text-primary glass-mb-3" aria-hidden="true" />
            <div className="glass-text-sm glass-font-semibold glass-text-primary">
              {title as string}
            </div>
            <div className="glass-text-sm glass-text-secondary">
              {value as string}
            </div>
          </div>
        ))}
      </div>
    </div>
    <GlassCoachmarks
      steps={steps}
      current={current}
      onNext={fn()}
      onPrev={fn()}
      onClose={fn()}
    />
  </div>
);

const meta: Meta<typeof GlassCoachmarks> = {
  title: 'Effects + Advanced/Glass Coachmarks',
  component: GlassCoachmarks,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass guided-tour overlay with responsive controls and readable copy.",
      },
    },
  },
  args: {
    steps,
    current: 0,
    onNext: fn(),
    onPrev: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassCoachmarks>;

export const Default: Story = {
  render: () => <DemoSurface current={0} />,
};

export const MultiStep: Story = {
  render: () => <DemoSurface current={1} />,
};
