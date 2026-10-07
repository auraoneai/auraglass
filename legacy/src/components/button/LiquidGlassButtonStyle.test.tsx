import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassButtonStyle } from "./LiquidGlassButtonStyle";

it("renders a liquid button", () => {
  render(<LiquidGlassButtonStyle>Save</LiquidGlassButtonStyle>);
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-liquid-glass-button-style", "true");
});
