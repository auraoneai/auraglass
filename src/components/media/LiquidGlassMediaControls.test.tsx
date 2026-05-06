import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassMediaControls } from "./LiquidGlassMediaControls";

it("renders play pause control", () => {
  render(<LiquidGlassMediaControls playing={false} />);
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
});
