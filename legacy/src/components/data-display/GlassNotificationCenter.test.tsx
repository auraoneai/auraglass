"use client";
/**
 * GlassNotificationCenter Component Tests
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
import { render, screen, waitFor } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import {
  GlassNotificationCenter,
  GlassNotificationProvider,
  useNotificationCenter,
} from "@/components/data-display/GlassNotificationCenter";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("GlassNotificationCenter", () => {
  const NotificationSeeder = ({ onAction }: { onAction: () => void }) => {
    const { notify } = useNotificationCenter();
    const didSeed = React.useRef(false);

    React.useEffect(() => {
      if (didSeed.current) return;
      didSeed.current = true;

      notify.info("Release evidence ready", "Axe checks completed.", {
        persistent: true,
        action: {
          label: "Open report",
          onClick: onAction,
        },
      });
    }, [notify, onAction]);

    return null;
  };

  /**
   * Smoke Test: Component renders without crashing
   */
  it("renders without crashing", () => {
    const { container } = render(<GlassNotificationCenter />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassNotificationCenter />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("announces the empty state from a polite live region", () => {
    const { container } = render(<GlassNotificationCenter />);
    const liveRegion = container.querySelector('[aria-live="polite"]');

    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute("data-empty");
    expect(screen.getByText("No notifications")).toHaveClass("glass-sr-only");
  });

  it("renders action and dismiss controls inside the live region", async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    const { container } = render(
      <GlassNotificationProvider>
        <NotificationSeeder onAction={onAction} />
        <GlassNotificationCenter />
      </GlassNotificationProvider>
    );

    expect(
      await screen.findByText("Release evidence ready")
    ).toBeInTheDocument();
    expect(screen.getByText("Axe checks completed.")).toBeInTheDocument();

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toContainElement(
      screen.getByText("Release evidence ready")
    );

    await user.click(screen.getByRole("button", { name: "Open report" }));

    expect(onAction).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "✕" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Release evidence ready")
      ).not.toBeInTheDocument();
    });
  });

  it("has no accessibility violations with an actionable notification", async () => {
    const onAction = jest.fn();
    const { container } = render(
      <GlassNotificationProvider>
        <NotificationSeeder onAction={onAction} />
        <GlassNotificationCenter />
      </GlassNotificationProvider>
    );

    expect(
      await screen.findByText("Release evidence ready")
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it("accepts and renders with custom props", () => {
    const { container } = render(
      <GlassNotificationCenter
        className="custom-class"
        data-testid="glassnotificationcenter"
      />
    );

    const element =
      container.querySelector('[data-testid="glassnotificationcenter"]') ||
      container.firstChild;

    expect(element).toHaveClass("custom-class");
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it("matches snapshot", () => {
    const { container } = render(<GlassNotificationCenter />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
