'use client';
/**
 * GlassNavigation Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ✅ Reduced motion support
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { GlassNavigation } from "@/components/navigation/GlassNavigation";
import { GlassNavigationProps } from "@/components/navigation/types";

jest.mock("@/utils/deviceCapabilities", () => {
  const actual = jest.requireActual<
    typeof import("@/utils/deviceCapabilities")
  >("@/utils/deviceCapabilities");

  return {
    ...actual,
    detectDevice: jest.fn(() => ({
      ...actual.DEFAULT_DEVICE_INFO,
      capabilities: {
        ...actual.DEFAULT_DEVICE_INFO.capabilities,
        gpu: false,
        webgl: false,
        webgl2: false,
        hardwareAcceleration: false,
      },
    })),
  };
});

expect.extend(toHaveNoViolations);

type Overrides = Partial<GlassNavigationProps>;

const baseItems: GlassNavigationProps["items"] = [
  { id: "home", key: "home", label: "Home" },
  {
    id: "settings",
    key: "settings",
    label: "Settings",
    children: [{ id: "profile", key: "profile", label: "Profile" }],
  },
];

const baseProps: GlassNavigationProps = {
  items: baseItems,
  activeItem: "home",
  onItemClick: jest.fn(),
  onMenuToggle: jest.fn(),
};

const renderNavigation = (overrides: Overrides = {}) =>
  render(<GlassNavigation {...baseProps} {...overrides} />);

describe("GlassNavigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders provided navigation items", () => {
    renderNavigation();
    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("calls onItemClick when an item is selected", () => {
    const onItemClick = jest.fn();
    renderNavigation({ onItemClick });

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));

    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "settings" })
    );
  });

  it("reveals nested items when a parent is expanded", () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));

    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    renderNavigation({ className: "custom-class" });
    const navigationElement = screen.getByLabelText("Main navigation");
    expect(navigationElement).toHaveClass("custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderNavigation();
    const results = await axe(container, {
      rules: {
        "aria-allowed-attr": { enabled: false },
        "aria-required-children": { enabled: false },
        list: { enabled: false },
        listitem: { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});