"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import { AuroraBackground } from "./AuroraBackground";

describe("AuroraBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<AuroraBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("generates deterministic particles from a seed", () => {
    const first = render(<AuroraBackground particles={4} seed="launch" />);
    const firstStyles = first
      .getAllByTestId("aurora-particle")
      .map((particle) => particle.getAttribute("style"));
    first.unmount();

    const second = render(<AuroraBackground particles={4} seed="launch" />);
    const secondStyles = second
      .getAllByTestId("aurora-particle")
      .map((particle) => particle.getAttribute("style"));
    second.unmount();

    const different = render(
      <AuroraBackground particles={4} seed="different" />
    );
    const differentStyles = different
      .getAllByTestId("aurora-particle")
      .map((particle) => particle.getAttribute("style"));

    expect(firstStyles).toEqual(secondStyles);
    expect(firstStyles).not.toEqual(differentStyles);
  });

  it("marks reduced motion in the rendered output", () => {
    const { container } = render(
      <AuroraBackground reducedMotion particles={2} />
    );

    expect(container.firstChild).toHaveAttribute(
      "data-ag-reduced-motion",
      "true"
    );
    expect(screen.getAllByTestId("aurora-particle")).toHaveLength(2);
  });

  it("keeps child content accessible unless aria-hidden is explicitly set", () => {
    render(
      <AuroraBackground>
        <h1>Launch page</h1>
      </AuroraBackground>
    );

    expect(
      screen.getByRole("heading", { name: "Launch page" })
    ).toBeInTheDocument();
  });
});
