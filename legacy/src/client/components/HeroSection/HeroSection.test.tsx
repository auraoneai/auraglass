import React from "react";
import { render, screen } from "@testing-library/react";

import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("renders heading, description, and actions", () => {
    render(
      <HeroSection
        data-testid="hero"
        eyebrow="Playground"
        heading="Design in real time"
        description="Pair tokens with live components and export production bundles instantly."
        actions={[
          { label: "Launch Playground", href: "/playground" },
          { label: "View Docs", href: "/docs", variant: "secondary" },
        ]}
      />
    );

    expect(screen.getByTestId("hero")).toHaveAttribute("data-aura-theme", "auraglass-default");
    expect(screen.getByText("Design in real time")).toBeInTheDocument();
    expect(screen.getByText("Pair tokens with live components and export production bundles instantly.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Launch Playground" })).toHaveAttribute("href", "/playground");
    expect(screen.getByRole("link", { name: "View Docs" })).toHaveAttribute("href", "/docs");
  });

  it("renders stats and media when provided", () => {
    render(
      <HeroSection
        heading="Accessibility first"
        stats={[{ label: "Automated checks", value: "64" }]}
        media={<div>Media preview</div>}
      />
    );

    expect(screen.getByText("64")).toBeInTheDocument();
    expect(screen.getByText("Automated checks")).toBeInTheDocument();
    expect(screen.getByText("Media preview")).toBeInTheDocument();
  });
});
