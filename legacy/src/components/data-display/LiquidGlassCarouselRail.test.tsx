import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassCarouselRail } from "./LiquidGlassCarouselRail";

it("renders carousel items", () => {
  render(<LiquidGlassCarouselRail items={[<span key="one">One</span>]} />);
  expect(screen.getByText("One")).toBeInTheDocument();
});
