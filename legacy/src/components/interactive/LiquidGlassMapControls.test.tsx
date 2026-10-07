import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassMapControls } from "./LiquidGlassMapControls";

it("renders map controls with labels", () => {
  render(<LiquidGlassMapControls controls={[{ id: "zoom", label: "Zoom" }]} />);
  expect(screen.getByRole("button", { name: "Zoom" })).toBeInTheDocument();
});
