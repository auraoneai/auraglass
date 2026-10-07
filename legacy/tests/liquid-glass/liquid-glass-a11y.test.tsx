import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassToolbar } from "../../src/components/navigation/LiquidGlassToolbar";

it("requires accessible toolbar buttons", () => {
  render(<LiquidGlassToolbar groups={[{ id: "tools", items: [{ id: "save", label: "Save" }] }]} />);
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});
