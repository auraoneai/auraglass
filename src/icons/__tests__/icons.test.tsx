import React from "react";
import { render, screen } from "@testing-library/react";

import { GlassIcon, SearchIcon, SettingsIcon } from "../index";

describe("AuraGlass icons", () => {
  it("renders named and component icons without third-party icon dependencies", () => {
    render(
      <>
        <GlassIcon name="search" aria-label="Search symbol" />
        <SearchIcon aria-label="Search icon" />
        <SettingsIcon aria-label="Settings icon" />
      </>
    );

    expect(screen.getByLabelText("Search symbol")).toBeInTheDocument();
    expect(screen.getByLabelText("Search icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Settings icon")).toBeInTheDocument();
  });
});
