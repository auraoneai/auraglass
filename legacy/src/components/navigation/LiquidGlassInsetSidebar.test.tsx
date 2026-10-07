import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassInsetSidebar } from "./LiquidGlassInsetSidebar";

it("renders selected sidebar item", () => {
  render(<LiquidGlassInsetSidebar items={[{ id: "home", label: "Home" }]} selectedId="home" />);
  expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
});
