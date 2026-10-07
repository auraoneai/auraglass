import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassControlGroup } from "./LiquidGlassControlGroup";

it("renders grouped controls", () => {
  render(<LiquidGlassControlGroup><button>One</button></LiquidGlassControlGroup>);
  expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
});
