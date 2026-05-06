import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassToolbar } from "./LiquidGlassToolbar";

it("renders grouped toolbar actions", () => {
  render(<LiquidGlassToolbar groups={[{ id: "g", items: [{ id: "save", label: "Save" }] }]} />);
  expect(screen.getByRole("toolbar")).toHaveAttribute("data-liquid-glass-toolbar", "true");
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});
