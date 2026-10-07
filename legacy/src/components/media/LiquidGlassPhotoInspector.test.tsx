import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassPhotoInspector } from "./LiquidGlassPhotoInspector";

it("renders metadata", () => {
  render(<LiquidGlassPhotoInspector open metadata={{ Camera: "AuraCam" }} />);
  expect(screen.getByText("AuraCam")).toBeInTheDocument();
});
