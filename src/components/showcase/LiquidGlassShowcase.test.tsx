import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassShowcase } from "./LiquidGlassShowcase";

it("renders the showcase shell", () => {
  render(<LiquidGlassShowcase />);
  expect(screen.getByText("Aura Liquid Glass")).toBeInTheDocument();
});
