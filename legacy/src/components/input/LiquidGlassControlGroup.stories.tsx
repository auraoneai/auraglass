import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { LiquidGlassControlGroup } from "./LiquidGlassControlGroup";

const meta: Meta<typeof LiquidGlassControlGroup> = {
  title: 'Controls/Inputs/Liquid Glass Control Group',
  component: LiquidGlassControlGroup,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassControlGroup>;

const textButtonStyle: CSSProperties = {
  border: 0,
  borderRadius: 999,
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  minWidth: 42,
  padding: "8px 12px",
};

const controlGroupStoryCss = `
  .liquid-control-group-story {
    --control-story-ink: #0f172a;
    --control-story-muted: #334155;
    --control-story-panel: rgba(255, 255, 255, 0.66);
    --control-story-border: rgba(15, 23, 42, 0.1);
    --control-story-active: rgba(255, 255, 255, 0.3);
    --control-story-active-strong: rgba(255, 255, 255, 0.36);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--control-story-ink);
  }

  .liquid-control-group-panel {
    width: min(760px, 100%);
    display: grid;
    gap: 22px;
    border: 1px solid var(--control-story-border);
    border-radius: 30px;
    padding: 28px;
    background: linear-gradient(135deg, var(--control-story-panel), rgba(255,255,255,0.34));
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-control-group-story p {
    color: var(--control-story-muted);
  }

  .liquid-control-group-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .liquid-control-group-story .liquid-glass-control-group {
    border: 1px solid rgba(255, 255, 255, 0.32) !important;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.18)) !important;
    box-shadow: 0 18px 54px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.28) !important;
    color: var(--control-story-ink);
  }

  .liquid-control-group-button {
    background: transparent;
  }

  .liquid-control-group-button.is-active {
    background: var(--control-story-active);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  .liquid-control-group-button.is-alternate {
    background: var(--control-story-active-strong);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-story {
    --control-story-ink: #f8fafc;
    --control-story-muted: #dbeafe;
    --control-story-panel: rgba(15, 23, 42, 0.66);
    --control-story-border: rgba(226, 232, 240, 0.22);
    --control-story-active: rgba(255, 255, 255, 0.22);
    --control-story-active-strong: rgba(255, 255, 255, 0.28);
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-panel {
    background:
      linear-gradient(135deg, rgba(15,23,42,0.86), rgba(30,41,59,0.62));
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-story .liquid-glass-control-group {
    border-color: rgba(226, 232, 240, 0.28) !important;
    background:
      linear-gradient(135deg, rgba(15,23,42,0.66), rgba(30,41,59,0.42)) !important;
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.16) !important;
  }

  [data-storybook-preview-mode="dark"] .liquid-control-group-button.is-alternate {
    color: #fff !important;
    background: var(--control-story-active-strong);
    box-shadow: inset 0 0 0 1px rgba(153, 246, 228, 0.42);
  }

  [data-storybook-preview-mode="liquid"] .liquid-control-group-panel {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.32));
  }

  [data-storybook-preview-mode="liquid"] .liquid-control-group-story .liquid-glass-control-group {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.26)) !important;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-story {
    --control-story-ink: #fff;
    --control-story-muted: #fff;
    --control-story-panel: #000;
    --control-story-border: #fff;
    --control-story-active: #000;
    --control-story-active-strong: #000;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-panel {
    background: #000;
    box-shadow: none;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-story .liquid-glass-material,
  [data-storybook-preview-mode="high-contrast"] .liquid-control-group-button {
    border: 2px solid #fff !important;
    background: #000 !important;
    box-shadow: none !important;
    color: #fff !important;
  }
`;

export const ToolbarGroup: Story = {
  render: () => (
    <div className="liquid-control-group-story">
      <style>{controlGroupStoryCss}</style>
      <div className="liquid-control-group-panel">
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Formatting controls</h2>
          <p style={{ margin: "6px 0 0" }}>
            Multiple density groups stay readable without overlapping or browser-native chrome.
          </p>
        </div>
        <div className="liquid-control-group-row">
          <LiquidGlassControlGroup selectionMode="multiple">
            <button type="button" className="liquid-control-group-button is-active" style={{ ...textButtonStyle, fontWeight: 700 }} aria-pressed="true">B</button>
            <button type="button" className="liquid-control-group-button" style={{ ...textButtonStyle, fontStyle: "italic" }} aria-pressed="false">I</button>
            <button type="button" className="liquid-control-group-button" style={{ ...textButtonStyle, textDecoration: "underline" }} aria-pressed="false">U</button>
          </LiquidGlassControlGroup>
          <LiquidGlassControlGroup selectionMode="single" materialVariant="clear">
            <button type="button" className="liquid-control-group-button is-alternate" style={textButtonStyle} aria-pressed="true">Left</button>
            <button type="button" className="liquid-control-group-button" style={textButtonStyle} aria-pressed="false">Center</button>
            <button type="button" className="liquid-control-group-button" style={textButtonStyle} aria-pressed="false">Right</button>
          </LiquidGlassControlGroup>
        </div>
      </div>
    </div>
  ),
};
