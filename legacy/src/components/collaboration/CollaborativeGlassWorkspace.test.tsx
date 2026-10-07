"use client";
/**
 * CollaborativeGlassWorkspace Component Tests
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
import { CollaborativeGlassWorkspace } from "@/components/collaboration/CollaborativeGlassWorkspace";
import { CollaborationProvider } from "@/components/collaboration/GlassCollaborationProvider";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CollaborationProvider roomId="test-room">{children}</CollaborationProvider>
);

describe("CollaborativeGlassWorkspace", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <CollaborativeGlassWorkspace workspaceId="test-workspace" />,
      { wrapper: TestWrapper }
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <CollaborativeGlassWorkspace workspaceId="test-workspace" />,
      { wrapper: TestWrapper }
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container } = render(
        <CollaborativeGlassWorkspace 
          workspaceId="test-workspace"
          aria-label="Test component" 
        />,
        { wrapper: TestWrapper }
      );
      const element = container.querySelector('[aria-label="Test component"]') ||
                      container.querySelector('.glass-collaborative-workspace[aria-label="Test component"]') ||
                      container.querySelector('[role="main"][aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <CollaborativeGlassWorkspace
        workspaceId="test-workspace"
        className="custom-class"
        data-testid="collaborativeglassworkspace"
      />,
      { wrapper: TestWrapper }
    );

    const element =
      container.querySelector('[data-testid="collaborativeglassworkspace"]') ||
      container.querySelector('.glass-collaborative-workspace') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <CollaborativeGlassWorkspace workspaceId="test-workspace" />,
      { wrapper: TestWrapper }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
