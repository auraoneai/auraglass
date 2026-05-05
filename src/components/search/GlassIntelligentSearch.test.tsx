"use client";
/**
 * GlassIntelligentSearch Component Tests
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
import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { GlassIntelligentSearch } from "@/components/search/GlassIntelligentSearch";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassIntelligentSearch", () => {
  // Cleanup after each test to prevent hanging
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container, unmount } = render(<GlassIntelligentSearch />);
    expect(container).toBeInTheDocument();
    jest.advanceTimersByTime(400); // Advance past debounce timeout
    unmount();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container, unmount } = render(<GlassIntelligentSearch />);
    jest.advanceTimersByTime(400); // Advance past debounce timeout
    jest.useRealTimers(); // Use real timers for axe
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.useFakeTimers(); // Switch back to fake timers
    unmount(); // Cleanup
  }, 15000); // Increase timeout

  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe("ARIA Attributes", () => {
    it("supports aria-label", () => {
      const { container, unmount } = render(
        <GlassIntelligentSearch aria-label="Test component" />
      );
      jest.advanceTimersByTime(400); // Advance past debounce timeout
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
      unmount();
    });
  });

  /**
   * Focus Management Tests
   */
  describe("Focus Management", () => {
    it("can receive focus", () => {
      const { unmount } = render(<GlassIntelligentSearch />);
      jest.advanceTimersByTime(400); // Advance past debounce timeout
      const element =
        document.querySelector("[tabindex]") ||
        document.querySelector("button, a, input, select, textarea");

      if (element) {
        act(() => {
          (element as HTMLElement).focus();
        });
        expect(element).toHaveFocus();
      }
      unmount();
    });

    it("shows visible focus indicator", () => {
      const { container, unmount } = render(<GlassIntelligentSearch />);
      jest.advanceTimersByTime(400); // Advance past debounce timeout
      const element =
        container.querySelector("[tabindex]") ||
        container.querySelector("button, a, input, select, textarea");

      if (element) {
        act(() => {
          (element as HTMLElement).focus();
        });
        // Check for focus-visible class or focus styles
        const hasFocusIndicator =
          element.classList.contains("focus-visible") ||
          window.getComputedStyle(element).outline !== "none";
        expect(hasFocusIndicator).toBe(true);
      }
      unmount();
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container, unmount } = render(
      <GlassIntelligentSearch
        className="custom-class"
        data-testid="glassintelligentsearch"
      />
    );
    jest.advanceTimersByTime(400); // Advance past debounce timeout

    const element =
      container.querySelector('[data-testid="glassintelligentsearch"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
    unmount();
  });

  it("renders highlighted matches as text instead of injected HTML", async () => {
    const { container, unmount } = render(
      <GlassIntelligentSearch
        data={[
          {
            id: "unsafe-result",
            title: "<img src=x onerror=alert(1)> launch notes",
            description: "A launch note with img markup in the title.",
            category: "document",
            tags: ["launch"],
            score: 1,
          },
        ]}
      />
    );

    fireEvent.change(screen.getByLabelText("Search input"), {
      target: { value: "img" },
    });

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(screen.getAllByText("img").length).toBeGreaterThan(0);
    expect(screen.getByText(/src=x onerror=alert\(1\)>/)).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
    unmount();
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container, unmount } = render(<GlassIntelligentSearch />);
    jest.advanceTimersByTime(400); // Advance past debounce timeout
    expect(container.firstChild).toMatchSnapshot();
    unmount(); // Cleanup
  });
});
