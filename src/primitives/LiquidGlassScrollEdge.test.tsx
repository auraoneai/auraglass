import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassScrollEdge } from "./LiquidGlassScrollEdge";

it("renders an active soft scroll edge without pointer interception", () => {
  render(
    <LiquidGlassScrollEdge
      edge="top"
      styleMode="soft"
      active
      data-testid="edge"
    />
  );
  const edge = screen.getByTestId("edge");
  expect(edge).toHaveAttribute("data-liquid-glass-scroll-edge", "top");
  expect(edge).toHaveAttribute("data-active", "true");
  expect(edge).toHaveAttribute("aria-hidden", "true");
});

it("can render as a scroll container without dropping children", () => {
  render(
    <LiquidGlassScrollEdge
      asContainer
      edge="bottom"
      active
      data-testid="scroll-container"
      edgeClassName="edge"
      style={{ maxHeight: 120 }}
    >
      <div>Scrollable content</div>
    </LiquidGlassScrollEdge>
  );

  const container = screen.getByTestId("scroll-container");
  const edge = container.querySelector(
    "[data-liquid-glass-scroll-edge='bottom']"
  );

  expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  expect(container).toHaveAttribute(
    "data-liquid-glass-scroll-edge-container",
    "bottom"
  );
  expect(edge).toHaveAttribute("data-active", "true");
  expect(edge).toHaveClass("edge");
});
