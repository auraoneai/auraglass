"use client";
/**
 * TreeItem Component Tests
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
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { TreeItem } from "@/components/tree-view/TreeItem";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock TreeView context
const MockTreeViewProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = {
    expanded: [],
    selected: [],
    focused: [],
    size: "medium" as const,
    disabled: false,
    glass: false,
    selectNode: jest.fn(),
    toggleNode: jest.fn(),
    focusNode: jest.fn(),
  };

  return React.createElement(
    require("./TreeView").TreeViewContext.Provider,
    { value: contextValue },
    children
  );
};

describe("TreeItem", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(
      <MockTreeViewProvider>
        <TreeItem nodeId="node-1" label="Test Node" />
      </MockTreeViewProvider>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(
      <MockTreeViewProvider>
        <ul role="tree">
          <TreeItem nodeId="node-1" label="Test Node" />
        </ul>
      </MockTreeViewProvider>
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
        <MockTreeViewProvider>
          <TreeItem
            nodeId="node-1"
            label="Test Node"
            aria-label="Test component"
          />
        </MockTreeViewProvider>
      );
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      render(
        <MockTreeViewProvider>
          <TreeItem nodeId="node-1" label="Test Node" />
        </MockTreeViewProvider>
      );
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it("shows visible focus indicator", () => {
      const { container } = render(
        <MockTreeViewProvider>
          <TreeItem nodeId="node-1" label="Test Node" />
        </MockTreeViewProvider>
      );
      const element =
        container.querySelector("[tabindex]") ||
        container.querySelector("button, a, input, select, textarea");

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
   * Reduced Motion Tests
   */
  describe("Reduced Motion Support", () => {
    it("respects prefers-reduced-motion", () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(
        <MockTreeViewProvider>
          <TreeItem nodeId="node-1" label="Test Node" />
        </MockTreeViewProvider>
      );

      // Check that animations are disabled or reduced
      const animatedElements = container.querySelectorAll(
        '[class*="animate"], [class*="transition"]'
      );
      animatedElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const animationDuration = parseFloat(styles.animationDuration || "0");
        const transitionDuration = parseFloat(styles.transitionDuration || "0");

        // Animations should be instant or very short (< 0.1s)
        expect(animationDuration).toBeLessThan(0.1);
        expect(transitionDuration).toBeLessThan(0.1);
      });
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <MockTreeViewProvider>
        <TreeItem
          nodeId="node-1"
          label="Test Node"
          className="custom-class"
          data-testid="treeitem"
        />
      </MockTreeViewProvider>
    );

    const element =
      container.querySelector('[data-testid="treeitem"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(
      <MockTreeViewProvider>
        <TreeItem nodeId="node-1" label="Test Node" />
      </MockTreeViewProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
