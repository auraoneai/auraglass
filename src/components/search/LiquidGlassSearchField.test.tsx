import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiquidGlassSearchField } from "./LiquidGlassSearchField";

it("filters and selects search results", async () => {
  const onSelect = jest.fn();
  render(<LiquidGlassSearchField results={[{ id: "one", label: "One" }]} onSelect={onSelect} />);
  await userEvent.type(screen.getByRole("combobox"), "one");
  await userEvent.click(screen.getByRole("option", { name: /One/i }));
  expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "one" }));
});
