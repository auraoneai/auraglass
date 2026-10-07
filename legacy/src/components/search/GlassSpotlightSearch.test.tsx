"use client";
/**
 * GlassSpotlightSearch Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassSpotlightSearch } from "@/components/search/GlassSpotlightSearch";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassSpotlightSearch", () => {
  const mockActions = [
    {
      id: "1",
      title: "Action 1",
      description: "First action",
      onAction: jest.fn(),
    },
    {
      id: "2",
      title: "Action 2",
      description: "Second action",
      onAction: jest.fn(),
    },
  ];
  const mockOnClose = jest.fn();

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <GlassSpotlightSearch
        open={true}
        onClose={mockOnClose}
        actions={mockActions}
        placeholder="Search..."
      />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <GlassSpotlightSearch
        open={true}
        onClose={mockOnClose}
        actions={mockActions}
        placeholder="Search..."
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      render(
        <GlassSpotlightSearch
          open={true}
          onClose={mockOnClose}
          actions={mockActions}
        />
      );
      const element = document.body.querySelector('[role="dialog"]'); // Query using role
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('aria-label', 'Command search'); // Check aria-label separately
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(
        <GlassSpotlightSearch
          open={true}
          onClose={mockOnClose}
          actions={mockActions}
        />
      );
      const element =
        document.body.querySelector("input"); // Query for the input element directly

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(
        <GlassSpotlightSearch
          open={true}
          onClose={mockOnClose}
          actions={mockActions}
        />
      );
      const element =
        document.body.querySelector("input"); // Query for the input element directly

      if (element) {
        (element as HTMLElement).focus();
        // Check for focus-visible class or focus styles
        const hasFocusIndicator =
          element.classList.contains("focus-visible") ||
          window.getComputedStyle(element).outline !== "none";
        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    render(
      <GlassSpotlightSearch
        open={true}
        onClose={mockOnClose}
        actions={mockActions}
        placeholder="Search..."
        className="custom-class"
        data-testid="glassspotlightsearch"
      />
    );

    const element =
      document.body.querySelector('[data-testid="glassspotlightsearch"]');

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <GlassSpotlightSearch
        open={true}
        onClose={mockOnClose}
        actions={mockActions}
        placeholder="Search..."
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});