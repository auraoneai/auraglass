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

it("marks source and destination nodes as self-contained liquid glass materials", () => {
  const { container } = render(
    <LiquidGlassTransitionProvider>
      <LiquidGlassSource id="thumbnail">Thumbnail</LiquidGlassSource>
      <LiquidGlassDestination id="thumbnail">Detail</LiquidGlassDestination>
    </LiquidGlassTransitionProvider>
  );

  expect(container.querySelector(".liquid-glass-transition-source")).toHaveAttribute(
    "data-liquid-glass-material",
    "true"
  );
  expect(container.querySelector(".liquid-glass-transition-destination")).toHaveAttribute(
    "data-liquid-glass-material",
    "true"
  );
});

it("preserves the material contract when a source renders as a child", () => {
  render(
    <LiquidGlassTransitionProvider>
      <LiquidGlassSource id="button" asChild className="custom-source">
        <button className="consumer-class">Open detail</button>
      </LiquidGlassSource>
    </LiquidGlassTransitionProvider>
  );

  expect(screen.getByRole("button", { name: "Open detail" })).toHaveClass(
    "liquid-glass-transition-source",
    "consumer-class",
    "custom-source"
  );
  expect(screen.getByRole("button", { name: "Open detail" })).toHaveAttribute(
    "data-liquid-glass-material",
    "true"
  );
});
