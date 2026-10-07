import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassBadgeCluster } from "./LiquidGlassBadgeCluster";

it("collapses hidden badges into a count", () => {
  render(<LiquidGlassBadgeCluster items={[{ id: "a", label: "A" }, { id: "b", label: "B" }]} maxCollapsed={1} />);
  expect(screen.getByRole("button", { name: "+1" })).toBeInTheDocument();
});
