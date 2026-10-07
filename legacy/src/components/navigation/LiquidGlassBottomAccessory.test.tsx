import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassBottomAccessory } from "./LiquidGlassBottomAccessory";

it("renders collapsed state", () => {
  render(<LiquidGlassBottomAccessory collapsed>Accessory</LiquidGlassBottomAccessory>);
  expect(screen.getByText("Accessory").closest("[data-collapsed]")).toHaveAttribute("data-collapsed", "true");
});
