"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import { LogoMark } from "./LogoMark";

describe("LogoMark", () => {
  it("is decorative by default", () => {
    const { container } = render(<LogoMark />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("supports an accessible label", () => {
    render(<LogoMark label="AuraGlass" />);

    expect(screen.getByRole("img", { name: "AuraGlass" })).toBeInTheDocument();
  });
});
