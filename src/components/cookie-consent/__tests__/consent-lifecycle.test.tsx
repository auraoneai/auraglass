"use client";
/**
 * REQ-PLAT-48 / PLAT-105 — consent banner show/dismiss lifecycle.
 * For each of the three consent components:
 *   - after the show delay the banner is open (data-state="open", not
 *     aria-hidden) without forceVisible;
 *   - dismissing through the component's real path (Decline All / Accept /
 *     timeout) leaves exactly one data-state="closed" node, aria-hidden,
 *     with no controls inside, and a click on it reaches no consent callback;
 *   - the timeout path notifies onTimeout exactly once.
 */
import React from "react";
import { render, screen, act, fireEvent, cleanup } from "@testing-library/react";
import { CookieConsent } from "@/components/cookie-consent/CookieConsent";
import { GlobalCookieConsent } from "@/components/cookie-consent/GlobalCookieConsent";
import { CompactCookieNotice } from "@/components/cookie-consent/CompactCookieNotice";

type Callbacks = {
  onAccept: jest.Mock;
  onDecline: jest.Mock;
  onTimeout: jest.Mock;
};

type Case = {
  name: string;
  render: (cb: Callbacks) => React.ReactElement;
  /* Real dismiss path: the visible label of the control to click, or
     "timeout" for the auto-dismiss path. */
  dismiss: { kind: "click"; label: string; fires: keyof Callbacks } | { kind: "timeout" };
  /* Components with a timeout prop render this for the timeout test. */
  renderTimeout?: (cb: Callbacks) => React.ReactElement;
};

const CASES: Case[] = [
  {
    /* CookieConsent's Accept/Decline only notify the parent (controlled);
       its own dismiss path is the timeout. */
    name: "CookieConsent",
    render: (cb) => (
      <CookieConsent
        onAccept={cb.onAccept}
        onDecline={cb.onDecline}
        onTimeout={cb.onTimeout}
        delay={0}
        timeout={500}
      />
    ),
    dismiss: { kind: "timeout" },
    renderTimeout: (cb) => (
      <CookieConsent
        onAccept={cb.onAccept}
        onDecline={cb.onDecline}
        onTimeout={cb.onTimeout}
        delay={0}
        timeout={500}
      />
    ),
  },
  {
    name: "GlobalCookieConsent",
    render: (cb) => (
      <GlobalCookieConsent
        onAccept={cb.onAccept}
        onDecline={cb.onDecline}
        delay={0}
      />
    ),
    dismiss: { kind: "click", label: "Decline All", fires: "onDecline" },
    renderTimeout: (cb) => (
      <GlobalCookieConsent
        onAccept={cb.onAccept}
        onDecline={cb.onDecline}
        onTimeout={cb.onTimeout}
        delay={0}
        timeout={500}
      />
    ),
  },
  {
    /* CompactCookieNotice renders no decline control and has no
       delay/timeout props: Accept is its dismiss path. */
    name: "CompactCookieNotice",
    render: (cb) => <CompactCookieNotice onAccept={cb.onAccept} />,
    dismiss: { kind: "click", label: "Accept", fires: "onAccept" },
  },
];

const callbacks = (): Callbacks => ({
  onAccept: jest.fn(),
  onDecline: jest.fn(),
  onTimeout: jest.fn(),
});

const clearConsentCookies = () => {
  document.cookie.split(";").forEach((c) => {
    const n = c.split("=")[0].trim();
    if (n) document.cookie = `${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};

describe("consent banner lifecycle (REQ-PLAT-48 / PLAT-105)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearConsentCookies();
  });
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    clearConsentCookies();
  });

  describe.each(CASES.map((c) => [c.name, c] as const))("%s", (_name, c) => {
    it('is open after the show delay (data-state="open", not aria-hidden, no forceVisible)', () => {
      const cb = callbacks();
      const { container } = render(c.render(cb));
      act(() => {
        /* show delay is 0 (or immediate); stay below any 500 ms timeout */
        jest.advanceTimersByTime(10);
      });
      const states = [...container.querySelectorAll("[data-state]")].map((n) =>
        n.getAttribute("data-state")
      );
      expect(states).toEqual(["open"]);
      const open = container.querySelector('[data-state="open"]')!;
      expect(open.getAttribute("aria-hidden")).toBe("false");
      expect(open.querySelectorAll("button").length).toBeGreaterThan(0);
    });

    it("dismiss via its real path closes the banner and a click on it reaches no callback", () => {
      const cb = callbacks();
      const { container } = render(c.render(cb));
      act(() => {
        jest.advanceTimersByTime(10);
      });
      expect(container.querySelector('[data-state="open"]')).not.toBeNull();

      if (c.dismiss.kind === "click") {
        fireEvent.click(screen.getByRole("button", { name: c.dismiss.label }));
        expect(cb[c.dismiss.fires]).toHaveBeenCalledTimes(1);
      } else {
        act(() => {
          jest.advanceTimersByTime(600);
        });
        expect(cb.onTimeout).toHaveBeenCalledTimes(1);
      }

      const states = [...container.querySelectorAll("[data-state]")].map((n) =>
        n.getAttribute("data-state")
      );
      expect(states).toEqual(["closed"]);
      const closed = container.querySelector('[data-state="closed"]') as HTMLElement;
      expect(closed.getAttribute("aria-hidden")).toBe("true");
      expect(closed.querySelector("button, a[href], [role='button']")).toBeNull();

      cb.onAccept.mockClear();
      cb.onDecline.mockClear();
      cb.onTimeout.mockClear();
      fireEvent.click(closed);
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(cb.onAccept).not.toHaveBeenCalled();
      expect(cb.onDecline).not.toHaveBeenCalled();
      expect(cb.onTimeout).not.toHaveBeenCalled();
      /* still closed — nothing re-opened it */
      expect(container.querySelector('[data-state="open"]')).toBeNull();
    });
  });

  describe.each(
    CASES.filter((c) => c.renderTimeout).map((c) => [c.name, c] as const)
  )("%s timeout", (_name, c) => {
    it("notifies onTimeout exactly once and stays closed", () => {
      const cb = callbacks();
      const { container } = render(c.renderTimeout!(cb));
      act(() => {
        jest.advanceTimersByTime(10);
      });
      expect(cb.onTimeout).not.toHaveBeenCalled();
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(cb.onTimeout).toHaveBeenCalledTimes(1);
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(cb.onTimeout).toHaveBeenCalledTimes(1);
      expect(cb.onAccept).not.toHaveBeenCalled();
      expect(cb.onDecline).not.toHaveBeenCalled();
      expect(container.querySelector('[data-state="closed"]')).not.toBeNull();
      expect(container.querySelector('[data-state="open"]')).toBeNull();
    });
  });
});
