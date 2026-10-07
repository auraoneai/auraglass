import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: 'Showcases/Liquid Glass State Matrix',
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj;

type MatrixTone = "light" | "dark" | "dense" | "media";

type MatrixSurfaceProps = {
  title: string;
  caption: string;
  tone: MatrixTone;
};

const cards: MatrixSurfaceProps[] = [
  {
    title: "Light",
    caption: "Bright app chrome with readable foreground controls.",
    tone: "light",
  },
  {
    title: "Dark",
    caption: "Deep glass surface with protected contrast and visible edges.",
    tone: "dark",
  },
  {
    title: "Dense",
    caption: "Compact controls stay scannable without overlap.",
    tone: "dense",
  },
  {
    title: "Media Clear",
    caption: "Clear glass over saturated imagery keeps controls contained.",
    tone: "media",
  },
];

const toneStyles: Record<
  MatrixTone,
  {
    background: string;
    foreground: string;
    muted: string;
    panel: string;
    panelStrong: string;
    stroke: string;
    glow: string;
    accent: string;
  }
> = {
  light: {
    background:
      "linear-gradient(135deg, #f8fbff 0%, #eaf2ff 47%, #ecfdf7 100%)",
    foreground: "#0f172a",
    muted: "#475569",
    panel: "rgba(255, 255, 255, 0.72)",
    panelStrong: "rgba(255, 255, 255, 0.88)",
    stroke: "rgba(148, 163, 184, 0.32)",
    glow: "0 22px 70px rgba(15, 23, 42, 0.14)",
    accent: "#0284c7",
  },
  dark: {
    background:
      "linear-gradient(135deg, #020617 0%, #0f1b3d 48%, #172554 100%)",
    foreground: "#f8fafc",
    muted: "rgba(226, 232, 240, 0.78)",
    panel: "rgba(15, 23, 42, 0.58)",
    panelStrong: "rgba(30, 41, 59, 0.72)",
    stroke: "rgba(147, 197, 253, 0.38)",
    glow: "0 24px 80px rgba(2, 6, 23, 0.52)",
    accent: "#38bdf8",
  },
  dense: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #edf4ff 50%, #e9fbf5 100%)",
    foreground: "#0f172a",
    muted: "#475569",
    panel: "rgba(255, 255, 255, 0.74)",
    panelStrong: "rgba(255, 255, 255, 0.9)",
    stroke: "rgba(148, 163, 184, 0.34)",
    glow: "0 20px 64px rgba(15, 23, 42, 0.13)",
    accent: "#0d9488",
  },
  media: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1d4ed8 46%, #0f766e 100%)",
    foreground: "#f8fafc",
    muted: "rgba(226, 232, 240, 0.8)",
    panel: "rgba(15, 23, 42, 0.38)",
    panelStrong: "rgba(255, 255, 255, 0.18)",
    stroke: "rgba(255, 255, 255, 0.32)",
    glow: "0 24px 80px rgba(2, 6, 23, 0.48)",
    accent: "#5eead4",
  },
};

const glassPanel = (
  tone: MatrixTone,
  overrides: CSSProperties = {}
): CSSProperties => {
  const tokens = toneStyles[tone];

  return {
    background: tokens.panel,
    border: `1px solid ${tokens.stroke}`,
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.32), 0 16px 40px rgba(15, 23, 42, 0.12)",
    backdropFilter: "blur(24px) saturate(1.35)",
    WebkitBackdropFilter: "blur(24px) saturate(1.35)",
    ...overrides,
  };
};

function Pill({
  children,
  tone,
  active = false,
}: {
  children: string;
  tone: MatrixTone;
  active?: boolean;
}) {
  const tokens = toneStyles[tone];

  return (
    <span
      style={{
        ...glassPanel(tone, {
          background: active ? tokens.panelStrong : tokens.panel,
          color: tokens.foreground,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 32,
          padding: "0 13px",
          fontSize: 13,
          fontWeight: active ? 700 : 600,
          whiteSpace: "nowrap",
        }),
      }}
    >
      {children}
    </span>
  );
}

function PreviewToolbar({ title, tone }: { title: string; tone: MatrixTone }) {
  const tokens = toneStyles[tone];

  return (
    <div
      style={{
        ...glassPanel(tone, {
          background: tokens.panelStrong,
          borderRadius: 22,
          color: tokens.foreground,
          display: "grid",
          gridTemplateColumns: "minmax(130px, 1fr) minmax(180px, 260px) auto",
          alignItems: "center",
          gap: 14,
          minWidth: 0,
          padding: "12px 14px",
        }),
      }}
    >
      <div style={{ minWidth: 0 }}>
        <strong
          style={{
            display: "block",
            fontSize: 15,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </strong>
        <span style={{ color: tokens.muted, display: "block", fontSize: 12 }}>
          Liquid surface
        </span>
      </div>

      <div
        style={{
          ...glassPanel(tone, {
            background: tone === "dark" ? "rgba(15, 23, 42, 0.72)" : tokens.panel,
            borderRadius: 999,
            color: tokens.muted,
            display: "flex",
            alignItems: "center",
            gap: 9,
            minWidth: 0,
            padding: "9px 13px",
            fontSize: 13,
          }),
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: tokens.accent,
            flex: "0 0 auto",
          }}
        />
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Search surfaces
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 8,
          minWidth: 0,
          color: tokens.foreground,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <span>Grid</span>
        <span style={{ color: tokens.muted }}>List</span>
        <Pill tone={tone} active>
          Apply
        </Pill>
      </div>
    </div>
  );
}

function SidebarRail({ tone, dense }: { tone: MatrixTone; dense: boolean }) {
  const tokens = toneStyles[tone];
  const items = dense ? ["A", "M", "S"] : ["Overview", "Media", "Systems"];

  return (
    <aside
      style={{
        ...glassPanel(tone, {
          background: tone === "dark" ? "rgba(15, 23, 42, 0.66)" : tokens.panel,
          borderRadius: 24,
          minHeight: dense ? 188 : 240,
          padding: 12,
          display: "grid",
          alignContent: "start",
          gap: 10,
        }),
      }}
    >
      <div
        style={{
          height: 24,
          borderRadius: 999,
          background:
            tone === "dark"
              ? "linear-gradient(90deg, rgba(147,197,253,0.34), rgba(255,255,255,0.08))"
              : "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(226,232,240,0.45))",
        }}
      />
      {items.map((item, index) => (
        <div
          key={item}
          style={{
            borderRadius: 16,
            color: index === 0 ? tokens.foreground : tokens.muted,
            background:
              index === 0
                ? tone === "dark"
                  ? "rgba(56, 189, 248, 0.2)"
                  : "rgba(219, 234, 254, 0.86)"
                : "transparent",
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            minHeight: 36,
            padding: dense ? "0 10px" : "0 13px",
            alignItems: "center",
            fontSize: dense ? 12 : 13,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <span>{item}</span>
          {!dense && index === 0 && <span style={{ color: tokens.muted }}>12</span>}
        </div>
      ))}
    </aside>
  );
}

function MediaStrip({ tone, dense }: { tone: MatrixTone; dense: boolean }) {
  const tokens = toneStyles[tone];

  return (
    <div
      style={{
        ...glassPanel(tone, {
          background:
            tone === "media"
              ? "linear-gradient(135deg, rgba(15,23,42,0.42), rgba(20,184,166,0.22))"
              : tone === "dark"
                ? "rgba(15, 23, 42, 0.62)"
                : "rgba(255, 255, 255, 0.54)",
          borderRadius: 24,
          minHeight: dense ? 112 : 152,
          display: "grid",
          alignContent: "end",
          padding: 16,
        }),
      }}
    >
      <div
        style={{
          ...glassPanel(tone, {
            background: tone === "dark" ? "rgba(30, 41, 59, 0.78)" : tokens.panelStrong,
            borderRadius: 999,
            display: "grid",
            gridTemplateColumns: "auto minmax(120px, 1fr) auto",
            alignItems: "center",
            gap: 14,
            maxWidth: dense ? 250 : 360,
            minWidth: 0,
            padding: "10px 13px",
            color: tokens.foreground,
          }),
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800 }}>Play</span>
        <span
          style={{
            height: 6,
            borderRadius: 999,
            background:
              tone === "dark"
                ? "linear-gradient(90deg, #38bdf8 0 54%, rgba(255,255,255,0.3) 54%)"
                : `linear-gradient(90deg, ${tokens.accent} 0 54%, rgba(15,23,42,0.28) 54%)`,
            minWidth: 0,
          }}
        />
        <span style={{ color: tokens.muted, fontSize: 12 }}>1:12</span>
      </div>
    </div>
  );
}

function MatrixSurface({ title, caption, tone }: MatrixSurfaceProps) {
  const tokens = toneStyles[tone];
  const dense = tone === "dense";

  return (
    <section
      data-liquid-glass-state={tone}
      style={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        borderRadius: 30,
        minHeight: dense ? 430 : 500,
        padding: dense ? 18 : 22,
        background: tokens.background,
        color: tokens.foreground,
        boxShadow: tokens.glow,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.28), transparent 28%), radial-gradient(circle at 86% 78%, rgba(20,184,166,0.22), transparent 32%)",
        }}
      />

      <div style={{ display: "grid", gap: dense ? 14 : 18 }}>
        <PreviewToolbar title={title} tone={tone} />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 9,
            minWidth: 0,
          }}
        >
          <Pill tone={tone} active>
            Adaptive
          </Pill>
          <Pill tone={tone}>Grouped</Pill>
          <Pill tone={tone}>Motion-safe</Pill>
          {!dense && <Pill tone={tone}>AA contrast</Pill>}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: dense ? "92px minmax(0, 1fr)" : "170px minmax(0, 1fr)",
            gap: dense ? 12 : 16,
            minWidth: 0,
          }}
        >
          <SidebarRail tone={tone} dense={dense} />
          <div style={{ display: "grid", gap: dense ? 12 : 16, minWidth: 0 }}>
            <MediaStrip tone={tone} dense={dense} />
            <div
              style={{
                ...glassPanel(tone, {
                  background: tone === "dark" ? "rgba(15,23,42,0.52)" : tokens.panel,
                  borderRadius: 999,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 8,
                  padding: 8,
                }),
              }}
            >
              <Pill tone={tone} active>
                Home
              </Pill>
              <Pill tone={tone}>Search</Pill>
              {!dense && <Pill tone={tone}>Profile</Pill>}
            </div>
          </div>
        </div>

        <p
          style={{
            color: tokens.muted,
            fontSize: 13,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {caption}
        </p>
      </div>
    </section>
  );
}

export const LightDarkDenseMedia: Story = {
  render: () => (
    <div
      style={{
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 620px), 1fr))",
        gap: 24,
        minHeight: "100vh",
        padding: 28,
        width: "100%",
      }}
    >
      {cards.map((card) => (
        <MatrixSurface key={card.tone} {...card} />
      ))}
    </div>
  ),
};
