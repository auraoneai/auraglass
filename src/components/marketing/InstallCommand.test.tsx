"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallCommand } from "./InstallCommand";

describe("InstallCommand", () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  });

  it("renders the package-manager command", () => {
    render(<InstallCommand packageManager="pnpm" />);

    expect(screen.getByText("pnpm add aura-glass")).toBeInTheDocument();
  });

  it("copies from the event handler and announces copied state", async () => {
    const user = userEvent.setup();
    const writeText = jest.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<InstallCommand command="npm install @scope/package" />);

    expect(writeText).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Copy install command" })
    );

    expect(writeText).toHaveBeenCalledWith("npm install @scope/package");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
});
