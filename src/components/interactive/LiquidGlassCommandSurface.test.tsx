import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassCommandSurface } from "./LiquidGlassCommandSurface";

it("renders command results", () => {
  render(<LiquidGlassCommandSurface open items={[{ id: "open", label: "Open File" }]} />);
  expect(screen.getByRole("option", { name: /Open File/i })).toBeInTheDocument();
});
