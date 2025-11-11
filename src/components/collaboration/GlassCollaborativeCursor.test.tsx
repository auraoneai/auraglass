"use client";
/**
 * GlassCollaborativeCursor Component Tests
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
import { GlassCollaborativeCursor } from "@/components/collaboration/GlassCollaborativeCursor";
import { CollaborationProvider } from "@/components/collaboration/GlassCollaborationProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CollaborationProvider roomId="test-room">{children}</CollaborationProvider>
);

describe("GlassCollaborativeCursor", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassCollaborativeCursor />, {
      wrapper: TestWrapper,
    });
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassCollaborativeCursor />, {
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
      <GlassCollaborativeCursor
        className="custom-class"
        data-testid="glasscollaborativecursor"
      />,
      { wrapper: TestWrapper }
    );

    const element =
      container.querySelector('[data-testid="glasscollaborativecursor"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassCollaborativeCursor />, {
      wrapper: TestWrapper,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
