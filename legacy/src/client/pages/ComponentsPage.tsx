"use client";

import React from "react";

import { HeroSection } from "../components/HeroSection/HeroSection";
import PageShell, {
  CardGrid,
  InfoCard,
  SectionDescription,
  SectionTitle,
} from "./PageShell";

const componentStats = [
  { label: "Production-ready components", value: "142" },
  { label: "ARIA patterns certified", value: "58" },
  { label: "Animation presets", value: "200+" },
];

const componentMedia = (
  <div>
    <p style={{ ...{ fontSize: "0.95rem", lineHeight: 1.6 } }}>
      Top-level primitives:
    </p>
    <ol
      style={{
        ...{
          marginTop: "0.75rem",
          display: "grid",
          gap: "0.4rem",
          fontSize: "0.9rem",
          counterReset: "primitive",
          color: "rgba(248, 250, 252, 0.78)",
        },
      }}
    >
      <li style={{ ...{ counterIncrement: "primitive" } }}>
        • OptimizedGlass surfaces
      </li>
      <li style={{ ...{ counterIncrement: "primitive" } }}>
        • LiquidGlassMaterials
      </li>
      <li style={{ ...{ counterIncrement: "primitive" } }}>
        • Motion-aware focus toolkits
      </li>
    </ol>
  </div>
);

export const ComponentsPage: React.FC = () => (
  <PageShell data-testid="components-page" showPersonaPicker={true}>
    <HeroSection
      data-testid="components-hero"
      eyebrow="Component Library"
      heading={"Atomic glassmorphism components engineered for production."}
      description={
        "Mix and match atmospheric surfaces, AI-assisted interaction patterns, and accessibility-first primitives. Export to React, Web Components, or design tools from the same manifest."
      }
      actions={[
        {
          label: "Browse Components",
          href: "/components/catalog",
          variant: "primary",
        },
        {
          label: "Open Story Explorer",
          href: "/storybook",
          variant: "secondary",
        },
      ]}
      stats={componentStats}
      media={componentMedia}
      personaId="auraglass-default"
      mode="dark"
    />

    <section>
      <SectionTitle>Ship cohesive glass experiences</SectionTitle>
      <SectionDescription>
        Every component consumes the same generated token surfaces and motion
        curves, so dashboards, immersive canvases, and marketing surfaces stay
        visually aligned without runtime styling frameworks.
      </SectionDescription>
      <CardGrid>
        <InfoCard
          title="CSS module isolation"
          body="Each component encapsulates its visual contract via CSS modules, referencing token variables so layouts stay deterministic across SSR, islands, and micro-frontends."
        />
        <InfoCard
          title="Interaction intelligence"
          body="Built-in hooks for reduced motion, high-contrast pivots, and device capability detection keep glass interactions smooth while respecting user preferences."
        />
        <InfoCard
          title="Composability-first"
          body="Override tokens or slot in new motion presets per persona without ejecting from the design system or shipping duplicate React renderers."
        />
      </CardGrid>
    </section>
  </PageShell>
);

export default ComponentsPage;
