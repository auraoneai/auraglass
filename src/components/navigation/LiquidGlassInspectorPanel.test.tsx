import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassInspectorPanel } from "./LiquidGlassInspectorPanel";

it("renders inspector sections", () => {
  render(<LiquidGlassInspectorPanel open sections={[{ id: "details", title: "Details", content: "Body" }]} />);
  expect(screen.getByText("Details")).toBeInTheDocument();
});
