import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassNowPlayingBar } from "./LiquidGlassNowPlayingBar";

it("renders title and subtitle", () => {
  render(<LiquidGlassNowPlayingBar title="Track" subtitle="Artist" />);
  expect(screen.getByText("Track")).toBeInTheDocument();
  expect(screen.getByText("Artist")).toBeInTheDocument();
});
