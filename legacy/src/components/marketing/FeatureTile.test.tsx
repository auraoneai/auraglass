"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import { FeatureTile } from "./FeatureTile";

describe("FeatureTile", () => {
  it("renders title, index, description, and visual", () => {
    render(
      <FeatureTile
        index="01"
        title="Refractive surfaces"
        description="Polished marketing cards built on package tokens."
        visual={<span>Visual sample</span>}
      />
    );

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Refractive surfaces" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Polished marketing cards built on package tokens.")
    ).toBeInTheDocument();
    expect(screen.getByText("Visual sample")).toBeInTheDocument();
  });
});
