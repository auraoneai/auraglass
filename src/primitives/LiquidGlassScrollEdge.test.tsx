import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassScrollEdge } from "./LiquidGlassScrollEdge";

it("renders an active soft scroll edge without pointer interception", () => {
  render(<LiquidGlassScrollEdge edge="top" styleMode="soft" active data-testid="edge" />);
  const edge = screen.getByTestId("edge");
  expect(edge).toHaveAttribute("data-liquid-glass-scroll-edge", "top");
  expect(edge).toHaveAttribute("data-active", "true");
  expect(edge).toHaveAttribute("aria-hidden", "true");
});
