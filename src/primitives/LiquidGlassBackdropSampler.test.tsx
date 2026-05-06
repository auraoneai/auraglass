import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassBackdropSampler } from "./LiquidGlassBackdropSampler";

it("renders sampled children", () => {
  render(<LiquidGlassBackdropSampler>{(sample) => <span>{sample.contrastHint}</span>}</LiquidGlassBackdropSampler>);
  expect(screen.getByText(/mixed|light|dark/)).toBeInTheDocument();
});
