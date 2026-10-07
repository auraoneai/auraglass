import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiquidGlassTabBar } from "./LiquidGlassTabBar";

it("changes active tab when clicked", async () => {
  const onChange = jest.fn();
  render(<LiquidGlassTabBar tabs={[{ id: "home", label: "Home" }]} onChange={onChange} />);
  await userEvent.click(screen.getByRole("tab", { name: "Home" }));
  expect(onChange).toHaveBeenCalledWith("home");
});
