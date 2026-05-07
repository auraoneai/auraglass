import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  AccessibilityProvider,
  useAccessibility,
} from "./AccessibilityProvider";
import { GlassButton } from "../button/GlassButton";
import { GlassCard } from "../card/GlassCard";

const meta: Meta<typeof AccessibilityProvider> = {
  title: 'Foundations/Accessibility/Accessibility Provider',
  component: AccessibilityProvider,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Accessibility context provider for managing WCAG compliance settings across the application.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const accessibilityStoryStyles = `
  .ag-accessibility-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background:
      radial-gradient(circle at 18% 12%, rgba(59, 130, 246, 0.28), transparent 32%),
      radial-gradient(circle at 84% 20%, rgba(20, 184, 166, 0.22), transparent 30%),
      linear-gradient(135deg, #0f172a 0%, #1e1b4b 48%, #164e63 100%);
    color: #f8fafc;
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-accessibility-story,
  .ag-accessibility-story *,
  .ag-accessibility-story *::before,
  .ag-accessibility-story *::after {
    box-sizing: border-box;
  }

  .ag-accessibility-story .glass-text-primary,
  .ag-accessibility-story .glass-text-secondary,
  .ag-accessibility-story h2,
  .ag-accessibility-story h3,
  .ag-accessibility-story span {
    color: #f8fafc !important;
  }

  .ag-accessibility-story pre {
    max-width: 100%;
    overflow-x: auto;
    color: #f8fafc !important;
    background: rgba(15, 23, 42, 0.78) !important;
  }

  .ag-accessibility-story label,
  .ag-accessibility-story [data-testid="glass-card"],
  .ag-accessibility-story .glass-card {
    background: rgba(15, 23, 42, 0.72) !important;
    color: #f8fafc !important;
  }

  .ag-accessibility-story button {
    color: #f8fafc !important;
  }

  @media (max-width: 640px) {
    .ag-accessibility-story {
      padding: 16px;
    }
  }
`;

const AccessibilityStoryFrame = ({ children }: { children: ReactNode }) => (
  <div className="ag-accessibility-story glass-contrast-guard">
    <style>{accessibilityStoryStyles}</style>
    {children}
  </div>
);

const DemoSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="glass-flex glass-items-center glass-justify-between glass-gap-4 glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3 glass-text-sm glass-text-primary">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="sr-only"
      style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
    />
    <span
      aria-hidden="true"
      className="glass-relative glass-inline-flex glass-h-6 glass-w-11 glass-flex-shrink-0 glass-radius-full glass-border glass-border-subtle"
      style={{
        background: checked
          ? "linear-gradient(135deg, rgba(37,99,235,0.78), rgba(20,184,166,0.72))"
          : "rgba(255,255,255,0.48)",
      }}
    >
      <span
        className="glass-absolute glass-h-5 glass-w-5 glass-radius-full"
        style={{
          left: checked ? 21 : 2,
          top: 2,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(15,23,42,0.22)",
          transition: "left 160ms ease",
        }}
      />
    </span>
  </label>
);

// Demo component to show accessibility features
const AccessibilityDemo = () => {
  const { settings, updateSettings, resetToDefaults } = useAccessibility();

  return (
    <div
      className="glass-p-6"
      style={{
        width: "min(760px, 100%)",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <GlassCard className="glass-p-6">
        <h2 className="glass-text-xl glass-font-semibold glass-mb-4">
          Accessibility Settings
        </h2>
        <div
          className="glass-grid glass-gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <DemoSwitch
            label="Focus Indicators"
            checked={settings.focusIndicators}
            onChange={(checked) => updateSettings({ focusIndicators: checked })}
          />
          <DemoSwitch
            label="High Contrast"
            checked={settings.highContrast}
            onChange={(checked) => updateSettings({ highContrast: checked })}
          />
          <DemoSwitch
            label="Reduced Motion"
            checked={settings.reducedMotion}
            onChange={(checked) => updateSettings({ reducedMotion: checked })}
          />
          <DemoSwitch
            label="Large Text"
            checked={settings.largeText}
            onChange={(checked) => updateSettings({ largeText: checked })}
          />
        </div>
        <div className="mt-4">
          <GlassButton onClick={resetToDefaults}>Reset to Defaults</GlassButton>
        </div>
      </GlassCard>

      <GlassCard className="glass-p-6">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">
          Current Settings
        </h3>
        <pre className="glass-text-sm glass-surface-subtle glass-p-2 glass-radius">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </GlassCard>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <AccessibilityStoryFrame>
      <AccessibilityProvider>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
  ),
};

export const HighContrast: Story = {
  render: () => (
    <AccessibilityStoryFrame>
      <AccessibilityProvider initialSettings={{ highContrast: true }}>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
  ),
};

export const ReducedMotion: Story = {
  render: () => (
    <AccessibilityStoryFrame>
      <AccessibilityProvider initialSettings={{ reducedMotion: true }}>
        <AccessibilityDemo />
      </AccessibilityProvider>
    </AccessibilityStoryFrame>
  ),
};
