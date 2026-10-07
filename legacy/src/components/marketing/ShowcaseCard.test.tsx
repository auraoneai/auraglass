"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import { ShowcaseCard } from "./ShowcaseCard";

describe("ShowcaseCard", () => {
  it("supports intensity, glow, highlight, and interactive props", () => {
    render(
      <ShowcaseCard
        intensity="strong"
        glow="aurora"
        highlight
        interactive
        data-testid="card"
      >
        Marketing surface
      </ShowcaseCard>
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-intensity", "strong");
    expect(card).toHaveAttribute("data-glow", "aurora");
    expect(card).toHaveAttribute("data-highlight", "true");
    expect(card).toHaveAttribute("data-interactive", "true");
  });
});
