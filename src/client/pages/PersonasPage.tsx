"use client";

import React from "react";

import { HeroSection } from "../components/HeroSection/HeroSection";
import PageShell, {
  CardGrid,
  InfoCard,
  SectionDescription,
  SectionTitle,
} from "./PageShell";

const personaStats = [
  { label: "Modes tuned per persona", value: "12" },
  { label: "Token overrides available", value: "420+" },
  { label: "Persona switch latency", value: "<12ms" },
];

const personaMedia = (
  <div>
    <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
      Active modes:
    </p>
    <ul
      style={{
        marginTop: "0.75rem",
        display: "grid",
        gap: "0.45rem",
        fontSize: "0.9rem",
        color: "rgba(248, 250, 252, 0.75)",
      }}
    >
      <li>• Aurora Daylight — signature glass gradients with elevated warmth.</li>
      <li>• Midnight Resonance — deep contrast palette for OLED displays.</li>
      <li>• Horizon Mist — accessibility-first variant with elevated text ratios.</li>
    </ul>
  </div>
);

export const PersonasPage: React.FC = () => (
  <PageShell data-testid="personas-page">
    <HeroSection
      data-testid="personas-hero"
      eyebrow="Persona Engine"
      heading={"Adaptive design tokens that respond to every audience."}
      description={
        "Curate branded color science, typography ramps, glass depths, and motion envelopes with instant previews across light, dark, and ambient-aware modes."
      }
      actions={[
        { label: "Launch Persona Designer", href: "/designer", variant: "primary" },
        { label: "View Token Manifest", href: "/tokens", variant: "secondary" },
      ]}
      stats={personaStats}
      media={personaMedia}
      personaId="auraglass-default"
      mode="dark"
    />

    <section>
      <SectionTitle>How persona modes stay in sync</SectionTitle>
      <SectionDescription>
        Each persona compiles into CSS variables, typed TypeScript manifests, design-system presets, and runtime guards. Toggle instantly between editorial campaigns, regional variants, or seasonal experiences without runtime style conflicts.
      </SectionDescription>
      <CardGrid>
        <InfoCard
          title="Live schema validation"
          body="Personas are validated against the AuraGlass token schema, guaranteeing every theme exports typography, spacing, motion, and glass surfaces before publication."
        />
        <InfoCard
          title="Zero-runtime hydration"
          body="Persona switches atomically update CSS variables via data attributes, eliminating hydration mismatches or duplicate React runtime injections."
        />
        <InfoCard
          title="AI-assisted palette tuning"
          body="Use semantic intent tagging to automatically propagate color ramps across CTAs, surfaces, and state overlays while safeguarding contrast ratios."
        />
      </CardGrid>
    </section>
  </PageShell>
);

export default PersonasPage;
