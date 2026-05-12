"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import { DisplayText } from "./DisplayText";

describe("DisplayText", () => {
  it("renders the requested semantic tag", () => {
    render(<DisplayText as="h1">Launch page</DisplayText>);

    expect(
      screen.getByRole("heading", { level: 1, name: "Launch page" })
    ).toBeInTheDocument();
  });

  it("supports gradient and non-gradient modes", () => {
    const { rerender } = render(
      <DisplayText gradient="ocean">Gradient</DisplayText>
    );

    expect(screen.getByText("Gradient")).toHaveAttribute(
      "data-gradient",
      "true"
    );
    expect(screen.getByText("Gradient")).toHaveAttribute(
      "data-ag-palette",
      "ocean"
    );

    rerender(<DisplayText gradient={false}>Plain</DisplayText>);
    expect(screen.getByText("Plain")).not.toHaveAttribute("data-gradient");
  });
});
