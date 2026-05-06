import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassAdaptiveSheet } from "./LiquidGlassAdaptiveSheet";

it("renders an open dialog", () => {
  render(<LiquidGlassAdaptiveSheet open title="Details">Body</LiquidGlassAdaptiveSheet>);
  expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
});
