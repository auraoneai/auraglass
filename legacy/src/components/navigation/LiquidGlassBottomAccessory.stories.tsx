import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassBottomAccessory } from "./LiquidGlassBottomAccessory";

const meta: Meta<typeof LiquidGlassBottomAccessory> = {
  title: "Navigation/Liquid Glass Bottom Accessory",
  component: LiquidGlassBottomAccessory,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassBottomAccessory>;

const bottomAccessoryStoryCss = `
  .liquid-bottom-accessory-story {
    --accessory-story-ink: #0f172a;
    --accessory-story-muted: #334155;
    --accessory-story-border: rgba(15, 23, 42, 0.1);
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(18px, 4vw, 32px);
    box-sizing: border-box;
    color: var(--accessory-story-ink);
  }

  .liquid-bottom-accessory-stage {
    width: min(760px, 100%);
    min-height: 420px;
    display: grid;
    align-items: end;
    padding: 28px;
    box-sizing: border-box;
    border: 1px solid var(--accessory-story-border);
    border-radius: 32px;
    background:
      linear-gradient(145deg, rgba(255,255,255,0.32), rgba(255,255,255,0.12)),
      linear-gradient(180deg, #f8fafc, #e7ebf0);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.14);
  }

  .liquid-bottom-accessory-story .liquid-glass-bottom-accessory {
    border: 1px solid rgba(255, 255, 255, 0.32) !important;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.18)),
      linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08)) !important;
    box-shadow: 0 18px 54px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255,255,255,0.28) !important;
    color: var(--accessory-story-ink);
  }

  .liquid-bottom-accessory-artwork {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    border-radius: 12px;
    background: linear-gradient(145deg, rgba(71,85,105,0.88), rgba(15,23,42,0.78));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
  }

  .liquid-bottom-accessory-title {
    display: block;
  }

  .liquid-bottom-accessory-meta,
  .liquid-bottom-accessory-time {
    color: var(--accessory-story-muted);
    font-size: 12px;
  }

  .liquid-bottom-accessory-meta {
    display: block;
  }

  [data-storybook-preview-mode="dark"] .liquid-bottom-accessory-story {
    --accessory-story-ink: #f8fafc;
    --accessory-story-muted: #e2e8f0;
    --accessory-story-border: rgba(226, 232, 240, 0.22);
  }

  [data-storybook-preview-mode="dark"] .liquid-bottom-accessory-stage {
    background:
      linear-gradient(135deg, rgba(15,23,42,0.86), rgba(51,65,85,0.62)),
      linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08));
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
  }

  [data-storybook-preview-mode="dark"] .liquid-bottom-accessory-story .liquid-glass-bottom-accessory {
    border-color: rgba(226, 232, 240, 0.28) !important;
    background:
      linear-gradient(135deg, rgba(15,23,42,0.66), rgba(51,65,85,0.42)),
      linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08)) !important;
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.16) !important;
  }

  [data-storybook-preview-mode="liquid"] .liquid-bottom-accessory-stage {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.14)),
      linear-gradient(180deg, #f8fafc, #e7ebf0);
  }

  [data-storybook-preview-mode="liquid"] .liquid-bottom-accessory-story .liquid-glass-bottom-accessory {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.16)),
      linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.1), rgba(255,255,255,0.08)) !important;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-story {
    --accessory-story-ink: #fff;
    --accessory-story-muted: #fff;
    --accessory-story-border: #fff;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-stage,
  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-artwork {
    background: #000;
    box-shadow: none;
  }

  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-story .liquid-glass-material,
  [data-storybook-preview-mode="high-contrast"] .liquid-bottom-accessory-artwork {
    border: 2px solid #fff !important;
    background: #000 !important;
    box-shadow: none !important;
    color: #fff !important;
  }
`;

export const Default: Story = {
  render: () => (
    <div className="liquid-bottom-accessory-story">
      <style>{bottomAccessoryStoryCss}</style>
      <div className="liquid-bottom-accessory-stage">
        <LiquidGlassBottomAccessory>
          <div className="liquid-bottom-accessory-artwork" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <strong className="liquid-bottom-accessory-title">
              Now playing
            </strong>
            <span className="liquid-bottom-accessory-meta">
              Liquid Study - Aura System
            </span>
          </div>
          <span className="liquid-bottom-accessory-time">2:14</span>
        </LiquidGlassBottomAccessory>
      </div>
    </div>
  ),
};
