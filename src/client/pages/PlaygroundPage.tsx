"use client";

import React from "react";

import { HeroSection } from "../components/HeroSection/HeroSection";
import PageShell, {
  CardGrid,
  InfoCard,
  SectionDescription,
  SectionTitle,
} from "./PageShell";

const playgroundStats = [
  { label: "Live presets", value: "68" },
  { label: "Token edits / sec", value: "3.4k" },
  { label: "Team collaboration slots", value: "16" },
];

const playgroundMedia = (
  <div>
    <p style={{ fontSize: "0.94rem", lineHeight: 1.6 }}>
      Live playground channels:
    </p>
    <div
      style={{
        marginTop: "0.75rem",
        display: "grid",
        gap: "0.45rem",
        fontSize: "0.9rem",
        color: "rgba(248, 250, 252, 0.76)",
      }}
    >
      <span>• Token Mapper — adjust any variable and preview across personas instantly.</span>
      <span>• Layout Composer — prototype dashboards with drag-and-drop glass tiles.</span>
      <span>• Motion Studio — tune physics-driven animations with reduced-motion previews.</span>
    </div>
  </div>
);

export const PlaygroundPage: React.FC = () => (
  <PageShell data-testid="playground-page">
    <HeroSection
      data-testid="playground-hero"
      eyebrow="Live Playground"
      heading={"Design tokens, surfaces, and motion tuned in real time."}
      description={
        "Pair tokens with real components, stream updates to stakeholders, and export production-ready configuration bundles instantly."
      }
      actions={[
        { label: "Open Playground", href: "/playground/live", variant: "primary" },
        { label: "View Integration Docs", href: "/docs/playground", variant: "secondary" },
      ]}
      stats={playgroundStats}
      media={playgroundMedia}
      personaId="auraglass-default"
      mode="dark"
    />

    <section>
      <SectionTitle>Collaborate on glass experiences in minutes</SectionTitle>
      <SectionDescription>
        The AuraGlass playground mirrors production rendering so product teams, brand partners, and accessibility leads can design hand-in-hand while the system enforces contrast, motion, and responsive breakpoints.
      </SectionDescription>
      <CardGrid>
        <InfoCard
          title="Multi-person editing"
          body="Cursor presence, annotation overlays, and change suggestions are streamed via the collaboration worker with full audit history."
        />
        <InfoCard
          title="Instant export pipelines"
          body="Generate CSS modules, Typed APIs, and Storybook stories directly from the playground session to seed new journeys."
        />
        <InfoCard
          title="Scenario presets"
          body="Spin up hero, dashboard, and immersive canvases with persona-aware defaults to accelerate experimentation."
        />
      </CardGrid>
    </section>
  </PageShell>
);

export default PlaygroundPage;
