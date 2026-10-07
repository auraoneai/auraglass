"use client";
/**
 * GlassPageBuilder Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassPageBuilder } from "@/components/cms/GlassPageBuilder";
import { DragDropProvider } from "@/components/cms/GlassDragDropProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DragDropProvider>{children}</DragDropProvider>
);

describe("GlassPageBuilder", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassPageBuilder />, {
      wrapper: TestWrapper,
    });
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassPageBuilder />, {
      wrapper: TestWrapper,
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassPageBuilder
        className="custom-class"
        data-testid="glasspagebuilder"
      />,
      { wrapper: TestWrapper }
    );

    const element =
      container.querySelector('[data-testid="glasspagebuilder"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassPageBuilder />, {
      wrapper: TestWrapper,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
