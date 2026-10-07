"use client";
/**
 * GlassCollaborativeComments Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassCollaborativeComments } from "@/components/collaboration/GlassCollaborativeComments";
import { CollaborationProvider } from "@/components/collaboration/GlassCollaborationProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CollaborationProvider roomId="test-room">{children}</CollaborationProvider>
);

describe("GlassCollaborativeComments", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassCollaborativeComments />, {
      wrapper: TestWrapper,
    });
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassCollaborativeComments />, {
      wrapper: TestWrapper,
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <GlassCollaborativeComments aria-label="Test component" />,
        { wrapper: TestWrapper }
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassCollaborativeComments
        className="custom-class"
        data-testid="glasscollaborativecomments"
      />,
      { wrapper: TestWrapper }
    );

    const element =
      container.querySelector('[data-testid="glasscollaborativecomments"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("keeps compact demo comments bounded inside the container", () => {
    render(
      <GlassCollaborativeComments
        compact
        contained
        maxHeight={180}
        data-testid="compact-comments"
      />,
      { wrapper: TestWrapper }
    );

    const root = screen.getByTestId("compact-comments");
    expect(root).toHaveStyle({ maxHeight: "180px", overflow: "hidden" });
    const bubble = screen
      .getByText("Tighten this surface copy before launch.")
      .closest("[data-glass-component]");
    expect(bubble).toHaveStyle({ top: "28px", transform: "translateX(-50%)" });
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassCollaborativeComments />, {
      wrapper: TestWrapper,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
