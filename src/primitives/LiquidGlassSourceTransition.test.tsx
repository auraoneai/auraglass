import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiquidGlassDestination, LiquidGlassSource, LiquidGlassTransitionProvider } from "./LiquidGlassSourceTransition";

it("marks a destination active after source activation", async () => {
  render(
    <LiquidGlassTransitionProvider>
      <LiquidGlassSource id="sheet">Open</LiquidGlassSource>
      <LiquidGlassDestination id="sheet">Sheet</LiquidGlassDestination>
    </LiquidGlassTransitionProvider>
  );
  await userEvent.click(screen.getByText("Open"));
  expect(screen.getByText("Sheet")).toHaveAttribute("data-liquid-glass-transition-active", "true");
});
