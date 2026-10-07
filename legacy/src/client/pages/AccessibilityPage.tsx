"use client";

import React from "react";

import { HeroSection } from "../components/HeroSection/HeroSection";
import PageShell, {
  CardGrid,
  InfoCard,
  SectionDescription,
  SectionTitle,
} from "./PageShell";

const accessibilityStats = [
  { label: "A11y test suites", value: "64" },
  { label: "Contrast compliant tokens", value: "100%" },
  { label: "Screen reader heuristics", value: "92" },
];

const accessibilityMedia = (
  <div>
    <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
      Accessibility toolchain:
    </p>
    <ul
      style={{
        marginTop: "0.75rem",
        display: "grid",
        gap: "0.45rem",
        fontSize: "0.9rem",
        color: "rgba(248, 250, 252, 0.78)",
      }}
    >
      <li>• ContrastGuard with adaptive sampling and media-query fallbacks.</li>
      <li>• Motion governance with automatic reduced-motion overrides.</li>
      <li>• AI-generated aria annotation hints for complex interactive surfaces.</li>
    </ul>
  </div>
);

export const AccessibilityPage: React.FC = () => (
  <PageShell data-testid="accessibility-page">
    <HeroSection
      data-testid="accessibility-hero"
      eyebrow="Accessibility"
      heading={"Glassmorphism without compromise on compliance."}
      description={
        "Every AuraGlass component ships with ARIA semantics, contrast protections, and reduced-motion fallbacks so teams can deliver premium visuals and inclusive experiences simultaneously."
      }
      actions={[
        { label: "Run Accessibility Suite", href: "/accessibility/audit", variant: "primary" },
        { label: "Download VPAT", href: "/accessibility/vpat.pdf", variant: "secondary" },
      ]}
      stats={accessibilityStats}
      media={accessibilityMedia}
      personaId="auraglass-default"
      mode="dark"
    />

    <section>
      <SectionTitle>Accessibility is embedded, not bolted on</SectionTitle>
      <SectionDescription>
        Dynamic surfaces can still meet WCAG AA and AAA thanks to token-aware overlays, focus orchestration, and end-to-end automated testing baked into the framework.
      </SectionDescription>
      <CardGrid>
        <InfoCard
          title="Semantic-first components"
          body="Interactive primitives include role mappings, keyboard scopes, and roving tabindex logic so screen reader flows remain predictable."
        />
        <InfoCard
          title="Contrast governance"
          body="ContrastGuard monitors gradient overlays and ambient backdrops with sampling, auto-adjusting text tokens before paint when contrast dips."
        />
        <InfoCard
          title="Motion respect"
          body="Reduced motion preferences short-circuit hero animations, ripple effects, and glass transitions automatically without removing affordances."
        />
      </CardGrid>
    </section>
  </PageShell>
);

export default AccessibilityPage;
