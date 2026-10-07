import React from "react";
import { render, screen } from "@testing-library/react";
import { LiquidGlassSearchTab } from "./LiquidGlassSearchTab";

it("renders only while active", () => {
  const { rerender } = render(<LiquidGlassSearchTab active={false} />);
  expect(screen.queryByRole("combobox")).toBeNull();
  rerender(<LiquidGlassSearchTab active />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});
