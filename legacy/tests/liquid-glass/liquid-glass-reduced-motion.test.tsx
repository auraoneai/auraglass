import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassEffectGroup } from "../../src/primitives/LiquidGlassEffectGroup";

it("renders effect groups without requiring animation timing", () => {
  render(<LiquidGlassEffectGroup data-testid="group">Content</LiquidGlassEffectGroup>);
  expect(screen.getByTestId("group")).toHaveAttribute("data-liquid-glass-effect-group", "true");
});
