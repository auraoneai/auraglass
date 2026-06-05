import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

import { GlassBadge, GlassCard, GlassProgress } from "../index";
import { createGlassTheme, createGlassThemeCssVars } from "../theme";

const domainPresets = [
  {
    name: "SaaS admin",
    brandColor: "#2563eb",
    accentColor: "#14b8a6",
    mode: "light",
    density: "compact",
    motionPolicy: "reduced",
    purpose: "Dense account, billing, and operations screens.",
  },
  {
    name: "AI command center",
    brandColor: "#7c3aed",
    accentColor: "#06b6d4",
    mode: "dark",
    density: "comfortable",
    motionPolicy: "reduced",
    purpose: "Provider readiness, telemetry, and command workflows.",
  },
  {
    name: "Media review",
    brandColor: "#db2777",
    accentColor: "#f59e0b",
    mode: "dark",
    density: "spacious",
    motionPolicy: "system",
    purpose: "Review rooms, clip notes, and timeline workspaces.",
  },
  {
    name: "Commerce ops",
    brandColor: "#16a34a",
    accentColor: "#0ea5e9",
    mode: "light",
    density: "comfortable",
    motionPolicy: "reduced",
    purpose: "Orders, inventory, carts, and payment follow-up.",
  },
  {
    name: "Support console",
    brandColor: "#ea580c",
    accentColor: "#64748b",
    mode: "light",
    density: "compact",
    motionPolicy: "none",
    purpose: "Ticket queues, SLA risk, and manual triage.",
  },
  {
    name: "Docs portal",
    brandColor: "#0891b2",
    accentColor: "#4f46e5",
    mode: "light",
    density: "comfortable",
    motionPolicy: "none",
    purpose: "Reference docs, examples, and entrypoint selectors.",
  },
  {
    name: "Marketing launch",
    brandColor: "#c026d3",
    accentColor: "#22d3ee",
    mode: "dark",
    density: "spacious",
    motionPolicy: "reduced",
    purpose: "Hero, feature grid, install, proof, and launch sections.",
  },
] as const;

const ThemeShowcase = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <div>
        <GlassBadge variant="primary">AuraGlass 3.3</GlassBadge>
        <h1 style={styles.title}>Theme preset showcase</h1>
        <p style={styles.copy}>
          Domain starters use the public theme API to compare brand color,
          density, motion policy, and contrast budgets without introducing a new
          package entrypoint.
        </p>
      </div>
      <GlassCard style={styles.summary} depth="medium" tint="neutral">
        <strong style={styles.summaryValue}>{domainPresets.length}</strong>
        <span style={styles.summaryLabel}>
          documented presets across app and marketing surfaces
        </span>
      </GlassCard>
    </section>
    <section style={styles.grid} aria-label="Theme preset comparison">
      {domainPresets.map((preset) => {
        const theme = createGlassTheme({
          id: preset.name.toLowerCase().replace(/\s+/g, "-"),
          name: `${preset.name} preset`,
          brandColor: preset.brandColor,
          accentColor: preset.accentColor,
          mode: preset.mode,
          density: preset.density,
          motionPolicy: preset.motionPolicy,
        });
        const vars = createGlassThemeCssVars(theme);
        const contrastValue = Math.round(theme.contrast.textOnSurface * 10) / 10;

        return (
          <article
            key={preset.name}
            style={{
              ...styles.preset,
              ...vars,
              background: `linear-gradient(135deg, ${theme.tokens.color.surface}, ${theme.tokens.color.surfaceStrong})`,
              color: theme.tokens.color.text,
              borderColor: theme.tokens.color.border,
            }}
          >
            <div style={styles.presetHeader}>
              <span
                aria-hidden="true"
                style={{
                  ...styles.swatch,
                  background: theme.tokens.color.brand,
                  boxShadow: `0 0 0 4px ${theme.tokens.color.focus}`,
                }}
              />
              <div>
                <h2 style={styles.presetTitle}>{preset.name}</h2>
                <p style={{ ...styles.presetCopy, color: theme.tokens.color.textMuted }}>
                  {preset.purpose}
                </p>
              </div>
            </div>
            <dl style={styles.metaGrid}>
              <div>
                <dt>Density</dt>
                <dd>{theme.density}</dd>
              </div>
              <div>
                <dt>Motion</dt>
                <dd>{theme.motionPolicy}</dd>
              </div>
              <div>
                <dt>Mode</dt>
                <dd>{theme.mode}</dd>
              </div>
              <div>
                <dt>Contrast</dt>
                <dd>{contrastValue}:1</dd>
              </div>
            </dl>
            <GlassProgress
              value={Math.min(100, Math.round(theme.contrast.textOnSurface * 12))}
              label="Text on surface contrast"
              showValue
              animated={false}
              variant={theme.contrast.textOnSurface >= 4.5 ? "success" : "warning"}
            />
          </article>
        );
      })}
    </section>
  </main>
);

const styles = {
  page: {
    minHeight: "100dvh",
    padding: 32,
    boxSizing: "border-box",
    color: "var(--glass-theme-text, #0f172a)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #dbeafe 38%, #ecfdf5 100%)",
  },
  header: {
    maxWidth: 1180,
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: 20,
    alignItems: "stretch",
  },
  title: {
    margin: "10px 0 8px",
    fontSize: 38,
    lineHeight: 1.08,
    letterSpacing: 0,
  },
  copy: {
    margin: 0,
    maxWidth: 760,
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.55,
  },
  summary: {
    padding: 20,
    display: "grid",
    alignContent: "center",
    gap: 4,
  },
  summaryValue: { color: "#075985", fontSize: 42, lineHeight: 1 },
  summaryLabel: { color: "#475569", lineHeight: 1.4 },
  grid: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  preset: {
    minHeight: 300,
    padding: 18,
    borderRadius: 8,
    border: "1px solid",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
    display: "grid",
    gap: 16,
    alignContent: "start",
  },
  presetHeader: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    gap: 12,
    alignItems: "start",
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.4)",
  },
  presetTitle: { margin: 0, fontSize: 20, lineHeight: 1.2 },
  presetCopy: { margin: "6px 0 0", lineHeight: 1.45, fontSize: 14 },
  metaGrid: {
    margin: 0,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
} satisfies Record<string, CSSProperties>;

const meta: Meta<typeof ThemeShowcase> = {
  title: "3.3/Theme Preset Showcase",
  component: ThemeShowcase,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DomainPresets: Story = {};
