import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  GlassA11y,
  GlassKeyboardNav as ActualGlassKeyboardNav,
  GlassMotionControls as ActualGlassMotionControls,
  type GlassA11yConfig,
} from "./GlassA11y";

const glassA11yStoryStyles = `
  .ag-a11y-story {
    --glass-text-primary: #0f172a;
    --glass-text-secondary: #334155;
    --glass-text-tertiary: #475569;
    --typography-text-primary: #0f172a;
    --typography-text-secondary: #334155;
    color: #0f172a;
    width: 100%;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 16% 8%, rgba(255, 255, 255, 0.98), transparent 36%),
      linear-gradient(145deg, #fafafa 0%, #e9e9e9 100%) !important;
  }

  .ag-a11y-story *,
  .ag-a11y-story *::before,
  .ag-a11y-story *::after {
    box-sizing: border-box;
  }

  .ag-a11y-story .glass-text-primary,
  .ag-a11y-story .glass-text-secondary,
  .ag-a11y-story .glass-text-tertiary,
  .ag-a11y-story h1,
  .ag-a11y-story h2,
  .ag-a11y-story h3,
  .ag-a11y-story h4,
  .ag-a11y-story p,
  .ag-a11y-story span,
  .ag-a11y-story .text-gray-500,
  .ag-a11y-story .text-gray-600,
  .ag-a11y-story .text-gray-700,
  .ag-a11y-story .text-gray-800 {
    color: #0f172a !important;
  }

  .ag-a11y-story .glass-surface-subtle,
  .ag-a11y-story .glass-surface-subtle\\/80,
  .ag-a11y-story .glass-surface-primary\\/80,
  .ag-a11y-story .glass-surface-translucent,
  .ag-a11y-story .glass-contrast-guard {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
    color: #0f172a !important;
  }

  .ag-a11y-story .glass-foundation-complete {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.94) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 20px 48px rgba(20,20,20,0.12) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.06) contrast(1.05) !important;
  }

  .ag-a11y-story [class*="glass-w-96"] {
    width: min(24rem, 100%) !important;
    max-width: 100% !important;
  }

  .ag-a11y-story button[class*="flex-1"][class*="px-4"][class*="py-3"] {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    color: #0f172a !important;
  }

  .ag-a11y-story button,
  .ag-a11y-story input,
  .ag-a11y-story textarea,
  .ag-a11y-story select {
    max-width: 100%;
  }

  .ag-a11y-story button {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.18)) !important;
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.92) !important;
    color: #0f172a !important;
  }

  @media (max-width: 640px) {
    .ag-a11y-story {
      padding: 16px !important;
    }
  }

  .ag-a11y-story__stage {
    width: min(56rem, 100%);
    margin-inline: auto;
  }

  .ag-a11y-story__stage > .glass-a11y-controller {
    width: 100%;
  }

  .ag-a11y-story__support-grid {
    margin-top: 32px;
  }
`;

const meta: Meta<typeof GlassA11y> = {
  title: "Foundations/Accessibility/Glass A11y",
  component: GlassA11y,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A comprehensive accessibility control panel providing WCAG AAA compliance management with real-time testing and adaptive interfaces.",
      },
    },
  },
  argTypes: {
    showDashboard: {
      control: "boolean",
      description: "Whether to show the accessibility dashboard",
    },
    enableTesting: {
      control: "boolean",
      description: "Enable accessibility testing features",
    },
    position: {
      control: { type: "select", options: ["fixed", "relative"] },
      description: "Positioning mode for the panel",
    },
    defaultOpen: {
      control: "boolean",
      description:
        "Open the control panel on initial render for Storybook inspection",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    onConfigChange: {
      action: "config changed",
      description: "Called when accessibility configuration changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassA11y>;

const DirectControlStage = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <main
    className="glass-on-light"
    style={{
      alignItems: "center",
      background: "linear-gradient(145deg, #fafafa 0%, #e9e9e9 100%)",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "clamp(20px, 6vw, 64px)",
    }}
  >
    <section
      className="glass-neutral-level2 glass-contrast-guard"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.30), rgba(255,255,255,0.16))",
        border: "1px solid rgba(255,255,255,0.94)",
        borderRadius: 28,
        boxShadow:
          "0 24px 64px rgba(20,20,20,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",
        color: "rgba(15,23,42,0.94)",
        maxWidth: 560,
        padding: "clamp(22px, 5vw, 36px)",
        width: "100%",
      }}
    >
      <p
        style={{
          color: "rgba(15,23,42,0.72)",
          fontSize: 13,
          fontWeight: 650,
          letterSpacing: ".1em",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        Accessibility preference
      </p>
      <h2
        style={{
          color: "rgba(15,23,42,0.94)",
          fontSize: "clamp(24px,5vw,34px)",
          margin: "10px 0 8px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "rgba(15,23,42,0.74)",
          lineHeight: 1.55,
          margin: "0 0 28px",
        }}
      >
        {description}
      </p>
      {children}
    </section>
  </main>
);

const DirectKeyboardNav = () => {
  const [config, setConfig] = React.useState<GlassA11yConfig>({
    ...defaultAccessibilityStoryConfig,
    enhanceKeyboardNavigation: true,
    showSkipLinks: true,
  });
  return (
    <DirectControlStage
      title="Keyboard navigation"
      description="Keep shortcuts, skip links, and focus movement discoverable without introducing a colored control state."
    >
      <ActualGlassKeyboardNav config={config} updateConfig={setConfig} />
    </DirectControlStage>
  );
};

const DirectMotionControls = () => {
  const [config, setConfig] = React.useState<GlassA11yConfig>({
    ...defaultAccessibilityStoryConfig,
    motionPreference: "reduced",
    enableHoverEffects: false,
  });
  return (
    <DirectControlStage
      title="Motion preferences"
      description="Choose a comfortable motion level while retaining clear, neutral, glass-native controls."
    >
      <ActualGlassMotionControls
        config={config}
        updateConfig={setConfig}
        isMotionReduced
      />
    </DirectControlStage>
  );
};

const defaultAccessibilityStoryConfig: GlassA11yConfig = {
  contrastLevel: "normal",
  motionPreference: "full",
  reduceTransparency: false,
  fontSizeMultiplier: 1,
  colorBlindnessType: "none",
  enhanceKeyboardNavigation: true,
  provideLongDescriptions: true,
  useColorBlindFriendlyPalette: false,
  enableHoverEffects: false,
  announceStateChanges: false,
  showSkipLinks: false,
};

export const GlassKeyboardNav: Story = {
  name: "GlassKeyboardNav",
  render: () => <DirectKeyboardNav />,
};

export const GlassMotionControls: Story = {
  name: "GlassMotionControls",
  render: () => <DirectMotionControls />,
};

export const Default: Story = {
  args: {
    showDashboard: true,
    enableTesting: true,
    position: "relative",
    defaultOpen: true,
    onConfigChange: fn(),
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="ag-a11y-story__stage">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Control Panel Demo
        </h1>

        <GlassA11y {...args} position="relative" maxHeight="min(56vh, 30rem)" />

        <div className="ag-a11y-story__support-grid glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Interactive Content
            </h3>
            <p className="glass-text-secondary dark:text-gray-300 glass-mb-4">
              This content demonstrates how accessibility settings can adapt the
              user interface in real-time. Try using the accessibility panel to
              see the changes.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-subtle hover:glass-surface-subtle glass-text-primary glass-radius-lg transition-colors">
              Interactive Button
            </button>
          </div>

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Form Elements
            </h3>
            <div className="glass-space-y-4">
              <input
                type="text"
                placeholder="Enter text here"
                className="glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"
              />
              <textarea
                placeholder="Enter longer text here"
                rows={3}
                className="glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TestingMode: Story = {
  args: {
    showDashboard: true,
    enableTesting: true,
    position: "relative",
    defaultOpen: true,
    onConfigChange: fn(),
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Testing Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">
              WCAG AA Compliance
            </h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div
                className="glass-surface-dark glass-h-2 glass-radius-full"
                style={{ width: "95%" }}
              ></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">
              95% compliant
            </p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">
              Keyboard Navigation
            </h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div
                className="glass-surface-dark glass-h-2 glass-radius-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">
              Fully accessible
            </p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">
              Screen Reader Support
            </h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div
                className="glass-surface-primary glass-h-2 glass-radius-full"
                style={{ width: "90%" }}
              ></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">
              90% supported
            </p>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
  ),
};

export const HighContrast: Story = {
  args: {
    showDashboard: true,
    enableTesting: false,
    position: "relative",
    defaultOpen: true,
    className: "custom-accessibility-theme",
    onConfigChange: fn(),
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          High Contrast Mode Demo
        </h1>

        <div className="glass-p-6 glass-surface-subtle glass-border-2 glass-border-black glass-radius-xl">
          <h3 className="glass-text-xl glass-font-semibold glass-text-inverse glass-mb-4">
            High Contrast Content
          </h3>
          <p className="glass-text-inverse glass-mb-4">
            This content uses high contrast colors for better visibility. The
            accessibility panel can automatically switch to high contrast mode.
          </p>
          <button className="glass-px-4 glass-py-2 glass-surface-dark glass-text-primary glass-border-2 glass-border-black glass-radius hover:glass-surface-primary transition-colors">
            High Contrast Button
          </button>
        </div>

        <div className="mt-8">
          <GlassA11y {...args} />
        </div>
      </div>
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    showDashboard: true,
    enableTesting: false,
    position: "relative",
    defaultOpen: true,
    onConfigChange: fn(),
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-surface-subtle glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary mb-8">
          Minimal Accessibility Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Clean Interface
            </h3>
            <p className="glass-text-secondary glass-mb-4">
              Simple, clean design that works well with accessibility features.
            </p>
          </div>

          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Focus States
            </h3>
            <p className="glass-text-secondary glass-mb-4">
              Clear focus indicators for keyboard navigation.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-subtle glass-text-primary glass-radius hover:glass-surface-subtle focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors">
              Focusable Button
            </button>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
  ),
};
