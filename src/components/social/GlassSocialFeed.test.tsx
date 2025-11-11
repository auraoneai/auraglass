"use client";
/**
 * GlassSocialFeed Component Tests
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
import { GlassSocialFeed } from "@/components/social/GlassSocialFeed";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassSocialFeed", () => {
  const mockPosts = [
    {
      id: "1",
      content: "Test post",
      author: {
        id: "user1",
        name: "User 1",
        username: "user1",
        verified: false,
      },
      timestamp: new Date(),
      likes: 10,
      shares: 5,
      comments: 3,
    },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassSocialFeed posts={mockPosts} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassSocialFeed posts={mockPosts} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassSocialFeed
        posts={mockPosts}
        className="custom-class"
        data-testid="glasssocialfeed"
      />
    );

    const element =
      container.querySelector('[data-testid="glasssocialfeed"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassSocialFeed posts={mockPosts} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
