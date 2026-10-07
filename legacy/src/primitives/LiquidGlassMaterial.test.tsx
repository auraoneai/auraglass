import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassMaterial } from "./LiquidGlassMaterial";

it("renders liquid glass material attributes", () => {
  render(<LiquidGlassMaterial material="liquid" data-testid="material">Content</LiquidGlassMaterial>);
  expect(screen.getByTestId("material")).toHaveAttribute("data-liquid-glass-material", "true");
});
