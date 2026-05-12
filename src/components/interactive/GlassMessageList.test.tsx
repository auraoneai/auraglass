"use client";
/**
 * GlassMessageList Component Tests
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
import { GlassMessageList } from "@/components/interactive/GlassMessageList";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassMessageList", () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassMessageList />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassMessageList />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassMessageList
        className="custom-class"
        data-testid="glassmessagelist"
      />
    );

    const element =
      container.querySelector('[data-testid="glassmessagelist"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  it("renders compact messages inside a bounded preview surface", () => {
    const now = new Date("2026-05-11T12:00:00Z");
    const messages = [
      {
        id: "m1",
        content: "Short compact preview message",
        timestamp: now,
        type: "text",
        sender: { id: "u1", name: "Nova", status: "online" },
      },
    ] as any;

    render(
      <GlassMessageList
        messages={messages}
        compact
        contained
        maxHeight={220}
        maxWidth={320}
        data-testid="glassmessagelist"
      />
    );

    const list = screen.getByTestId("glassmessagelist");
    expect(list).toHaveStyle({ maxHeight: "220px", maxWidth: "320px" });
    expect(screen.getByText("Short compact preview message")).toHaveClass(
      "glass-line-clamp-2"
    );
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassMessageList />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
