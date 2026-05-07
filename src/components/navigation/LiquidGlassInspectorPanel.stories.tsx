import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassInspectorPanel } from "./LiquidGlassInspectorPanel";

const meta: Meta<typeof LiquidGlassInspectorPanel> = {
  title: 'Navigation/Liquid Glass Inspector Panel',
  component: LiquidGlassInspectorPanel,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassInspectorPanel>;

const inspectorPanelStoryCss = `
  .liquid-inspector-story {
    --inspector-story-ink: #0f172a;
    --inspector-story-muted: #334155;
    --inspector-story-border: rgba(15, 23, 42, 0.1);
    --inspector-story-panel:
      linear-gradient(135deg, rgba(255,255,255,0.86), rgba(219,234,254,0.5)),
      radial-gradient(circle at 18% 18%, rgba(96,165,250,0.24), transparent 30%);
    min-height: 100vh;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 24px;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--inspector-story-ink);
  }

  .liquid-inspector-story,
  .liquid-inspector-story * {
    color: var(--inspector-story-ink) !important;
  }

  .liquid-inspector-story .liquid-inspector-work-area {
    min-width: 0;
    border: 1px solid var(--inspector-story-border);
    border-radius: 28px;
    padding: 28px;
    background: var(--inspector-story-panel);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-inspector-story .liquid-inspector-muted,
  .liquid-inspector-story .liquid-glass-inspector-panel .glass-text-secondary {
    color: var(--inspector-story-muted) !important;
  }

  .liquid-inspector-story .liquid-glass-inspector-panel button {
    border: 0;
    border-radius: 999px;
    background: rgba(15,23,42,.08);
    color: inherit;
    cursor: pointer;
    font: inherit;
    line-height: 1;
    min-width: 28px;
    padding: 6px 10px;
  }

  [data-storybook-preview-mode="dark"] .liquid-inspector-story {
    --inspector-story-ink: #f8fafc;
    --inspector-story-muted: #dbeafe;
    --inspector-story-border: rgba(226, 232, 240, 0.22);
    --inspector-story-panel:
      linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.72)),
      radial-gradient(circle at 18% 18%, rgba(96,165,250,0.18), transparent 30%);
  }

  [data-storybook-preview-mode="dark"] .liquid-inspector-story .liquid-glass-inspector-panel button {
    background: rgba(226,232,240,.16);
  }

  [data-storybook-preview-mode="liquid"] .liquid-inspector-story {
    --inspector-story-panel:
      linear-gradient(135deg, rgba(255,255,255,0.72), rgba(236,253,245,0.42)),
      radial-gradient(circle at 20% 20%, rgba(29,78,216,0.2), transparent 30%);
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-inspector-story {
    --inspector-story-ink: #fff;
    --inspector-story-muted: #fff;
    --inspector-story-border: #fff;
    --inspector-story-panel: #000;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-inspector-story .liquid-glass-inspector-panel button {
    border: 2px solid #fff;
    background: #000;
  }
`;

export const Default: Story = {
  render: () => (
    <div className="liquid-inspector-story">
      <style>{inspectorPanelStoryCss}</style>
      <div className="liquid-inspector-work-area">
        <h2 style={{ margin: 0 }}>Selected photo</h2>
        <p className="liquid-inspector-muted">The inspector is anchored to a composed work area with readable surrounding content.</p>
      </div>
      <LiquidGlassInspectorPanel
        open
        selectionLabel="Hero image - final crop"
        sections={[
          { id: "properties", title: "Properties", content: <div className="liquid-inspector-muted">1200 x 900, sRGB, approved</div> },
          { id: "access", title: "Access", content: <div className="liquid-inspector-muted">Shared with design review</div> },
        ]}
        style={{ width: "100%", minHeight: 520 }}
      />
    </div>
  ),
};
