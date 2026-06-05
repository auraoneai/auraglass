import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

import {
  AuroraBackground,
  DisplayText,
  FeatureTile,
  GlassBadge,
  GlassButton,
  InstallCommand,
  LogoMark,
  ShowcaseCard,
} from "../index";

const features = [
  {
    title: "Production app surfaces",
    description:
      "App shell, workflow, data, and recipe starters are positioned for real product screens.",
  },
  {
    title: "Provider-safe AI states",
    description:
      "AI and hosted-runtime examples stay fail-closed until teams wire credentials and auth.",
  },
  {
    title: "Theme and marketing polish",
    description:
      "Documented presets and launch sections use tokenized color and reduced-motion defaults.",
  },
];

const changelog = [
  "Eight 3.3 recipe starters added to the registry.",
  "Theme preset guidance covers seven product domains.",
  "Marketing Kit docs now include a complete page composition.",
];

const proof = [
  "Recipe render gate",
  "Storybook visual baseline",
  "Reduced-motion check",
  "Manual a11y signoff",
];

const MarketingLaunch = () => (
  <main style={styles.page}>
    <section style={styles.hero}>
      <AuroraBackground
        particles={14}
        grain
        vignette
        reducedMotion
        seed="auraglass-33-story"
      />
      <div style={styles.heroInner}>
        <LogoMark label="AuraGlass" animated={false} />
        <GlassBadge variant="primary">3.3 launch surface</GlassBadge>
        <DisplayText as="h1" size="hero" gradient="aurora" balance>
          AuraGlass for product launches that still behave like product UI.
        </DisplayText>
        <p style={styles.heroCopy}>
          A complete Storybook surface for hero, install, feature grid,
          changelog, social proof, and release evidence sections using package
          marketing components.
        </p>
        <div style={styles.actions}>
          <GlassButton variant="aurora">Start building</GlassButton>
          <InstallCommand packageManager="npm" />
        </div>
      </div>
    </section>

    <section style={styles.band} aria-label="Feature grid">
      <div style={styles.sectionHeader}>
        <DisplayText as="h2" size="section" gradient="ocean">
          Feature grid
        </DisplayText>
        <p style={styles.sectionCopy}>
          Marketing surfaces stay clear about package UI versus optional hosted
          runtime behavior.
        </p>
      </div>
      <div style={styles.grid}>
        {features.map((feature, index) => (
          <FeatureTile
            key={feature.title}
            index={index + 1}
            title={feature.title}
            description={feature.description}
            tone={index === 1 ? "warning" : "aurora"}
          />
        ))}
      </div>
    </section>

    <section style={styles.split} aria-label="Launch proof">
      <ShowcaseCard intensity="strong" glow="aurora" radius="lg" padding="lg">
        <DisplayText as="h2" size="title">
          Changelog preview
        </DisplayText>
        <ul style={styles.list}>
          {changelog.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ShowcaseCard>
      <ShowcaseCard intensity="medium" glow="subtle" radius="lg" padding="lg">
        <DisplayText as="h2" size="title">
          Social proof and evidence
        </DisplayText>
        <div style={styles.proofGrid}>
          {proof.map((item) => (
            <span key={item} style={styles.proofItem}>
              {item}
            </span>
          ))}
        </div>
        <p style={styles.sectionCopy}>
          Replace these labels with links to captured 3.3 evidence before the
          public launch page ships.
        </p>
      </ShowcaseCard>
    </section>
  </main>
);

const styles = {
  page: {
    minHeight: "100dvh",
    color: "var(--glass-marketing-text-primary, #f8fafc)",
    background: "var(--ag-marketing-bg-0, #07111f)",
  },
  hero: {
    position: "relative",
    minHeight: 560,
    display: "grid",
    alignItems: "center",
    overflow: "hidden",
    padding: "56px 32px",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gap: 18,
  },
  heroCopy: {
    maxWidth: 760,
    margin: 0,
    color: "var(--glass-marketing-text-secondary, rgba(226,232,240,0.82))",
    fontSize: 18,
    lineHeight: 1.55,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  band: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "40px 32px",
    display: "grid",
    gap: 20,
  },
  sectionHeader: {
    display: "grid",
    gap: 8,
    maxWidth: 820,
  },
  sectionCopy: {
    margin: 0,
    color: "var(--glass-marketing-text-secondary, rgba(226,232,240,0.82))",
    lineHeight: 1.55,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  split: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "0 32px 56px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
  },
  list: {
    margin: "16px 0 0",
    paddingLeft: 20,
    color: "var(--glass-marketing-text-secondary, rgba(226,232,240,0.82))",
    lineHeight: 1.6,
  },
  proofGrid: {
    margin: "16px 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 10,
  },
  proofItem: {
    borderRadius: 8,
    border: "1px solid var(--glass-marketing-glass-border, rgba(255,255,255,0.12))",
    background:
      "var(--glass-marketing-glass-bg-subtle, rgba(255,255,255,0.07))",
    padding: "10px 12px",
    color: "var(--glass-marketing-text-primary, #f8fafc)",
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>;

const meta: Meta<typeof MarketingLaunch> = {
  title: "3.3/Marketing Launch Kit",
  component: MarketingLaunch,
  parameters: { layout: "fullscreen", previewSurface: "marketing" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LaunchPage: Story = {};
