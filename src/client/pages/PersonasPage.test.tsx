import React from "react";
import { render, screen } from "@testing-library/react";

import { PersonasPage } from "./PersonasPage";
import { ComponentsPage } from "./ComponentsPage";
import { PlaygroundPage } from "./PlaygroundPage";
import { AccessibilityPage } from "./AccessibilityPage";

describe("Marketing pages", () => {
  it("renders personas hero copy", () => {
    render(<PersonasPage />);
    expect(screen.getByText(/Adaptive design tokens/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Launch Persona Designer" })).toBeInTheDocument();
  });

  it("renders components hero copy", () => {
    render(<ComponentsPage />);
    expect(screen.getByText(/Atomic glassmorphism components/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse Components" })).toBeInTheDocument();
  });

  it("renders playground hero copy", () => {
    render(<PlaygroundPage />);
    expect(screen.getByText(/Design tokens, surfaces, and motion/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Playground" })).toBeInTheDocument();
  });

  it("renders accessibility hero copy", () => {
    render(<AccessibilityPage />);
    expect(screen.getByText(/glassmorphism without compromise/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Run Accessibility Suite" })).toBeInTheDocument();
  });
});
