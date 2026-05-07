import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, CreditCard, Info, ShieldCheck, Sparkles } from "lucide-react";
import { GlassHoverCard } from "./GlassHoverCard";

const triggerStyle: React.CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderRadius: 14,
  background: "rgba(255, 255, 255, 0.72)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.68), 0 14px 32px rgba(15,23,42,0.12)",
  color: "#0f172a",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  font: "inherit",
  minHeight: 44,
  padding: "0 16px",
};

const stageStyle: React.CSSProperties = {
  boxSizing: "border-box",
  display: "grid",
  justifyItems: "center",
  gap: 24,
  minHeight: 460,
  padding: 32,
  width: "min(760px, calc(100vw - 48px))",
};

function PreviewCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(148, 163, 184, 0.28)",
        borderRadius: 20,
        background: "rgba(255,255,255,0.78)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.72), 0 18px 44px rgba(15,23,42,0.14)",
        color: "#0f172a",
        display: "grid",
        gap: 10,
        maxWidth: 320,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <strong>{title}</strong>
      </div>
      <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}

const accountContent = (
  <PreviewCard icon={<ShieldCheck size={18} />} title="Account verified">
    Identity, workspace access, and billing permissions are active for this
    profile.
  </PreviewCard>
);

const usageContent = (
  <PreviewCard icon={<BarChart3 size={18} />} title="Usage trend">
    Component adoption is up 18 percent this week with the strongest lift in
    navigation and media surfaces.
  </PreviewCard>
);

const meta: Meta = {
  title: 'Surfaces/Modals/Glass Hover Card',
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass hover card for richer contextual previews. Stories use bounded surfaces and visible static previews so Storybook never looks blank.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={stageStyle}>
      <GlassHoverCard
        content={accountContent}
        title="Account verified"
        description="Workspace status and permissions"
        placement="bottom"
        showDelay={0}
      >
        <button type="button" style={triggerStyle}>
          <Info size={17} aria-hidden="true" />
          Hover for account status
        </button>
      </GlassHoverCard>
      {accountContent}
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div
      style={{
        ...stageStyle,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        alignItems: "center",
      }}
    >
      {(["top", "right", "bottom", "left"] as const).map((placement) => (
        <GlassHoverCard
          key={placement}
          content={
            <PreviewCard icon={<Sparkles size={18} />} title={`${placement} card`}>
              Placement stays inside the viewport with readable glass contrast.
            </PreviewCard>
          }
          title={`${placement} placement`}
          placement={placement}
          showDelay={0}
        >
          <button type="button" style={{ ...triggerStyle, justifyContent: "center" }}>
            {placement}
          </button>
        </GlassHoverCard>
      ))}
    </div>
  ),
};

export const RichPreview: Story = {
  render: () => (
    <div style={stageStyle}>
      <GlassHoverCard
        content={
          <div style={{ display: "grid", gap: 12, minWidth: 260 }}>
            <PreviewCard icon={<CreditCard size={18} />} title="Enterprise plan">
              Renewal is scheduled for May 30 with 24 active seats and priority
              support enabled.
            </PreviewCard>
            <div
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "1fr 1fr",
                color: "#0f172a",
                fontSize: 12,
              }}
            >
              <span>Seats: 24</span>
              <span>Usage: 82%</span>
            </div>
          </div>
        }
        title="Billing preview"
        description="Plan and usage details"
        placement="bottom"
        maxWidth={360}
        showDelay={0}
      >
        <button type="button" style={triggerStyle}>
          <CreditCard size={17} aria-hidden="true" />
          Billing profile
        </button>
      </GlassHoverCard>
      {usageContent}
    </div>
  ),
};
