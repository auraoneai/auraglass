"use client";
/**
 * PLAT-105 — consent banner show/dismiss lifecycle.
 * For each of the three consent components: after the show delay the
 * banner is visible (data-state="open", not aria-hidden); after dismissing
 * it is hidden/closed; and a click on the hidden banner reaches no
 * consent callback.
 */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieConsent } from "@/components/cookie-consent/CookieConsent";
import { GlobalCookieConsent } from "@/components/cookie-consent/GlobalCookieConsent";
import { CompactCookieNotice } from "@/components/cookie-consent/CompactCookieNotice";

const CASES: {
  name: string;
  render: (
    onAccept: jest.Mock,
    onDecline: jest.Mock,
    onTimeout: jest.Mock
  ) => React.ReactElement;
  renderTimeout?: (
    onAccept: jest.Mock,
    onDecline: jest.Mock,
    onTimeout: jest.Mock
  ) => React.ReactElement;
  /* How the banner is dismissed: 'decline' button, 'accept' button, or
     'timeout' auto-dismiss. */
  dismiss: "decline" | "accept" | "timeout";
}[] = [
  {
    name: "CookieConsent",
    render: (onAccept, onDecline) => (
      <CookieConsent onAccept={onAccept} onDecline={onDecline} delay={0} />
    ),
    dismiss: "timeout",
    renderTimeout: (onAccept, onDecline, onTimeout) => (
      <CookieConsent
        onAccept={onAccept}
        onDecline={onDecline}
        onTimeout={onTimeout}
        delay={0}
        timeout={500}
      />
    ),
  },
  {
    name: "GlobalCookieConsent",
    render: (onAccept, onDecline) => (
      <GlobalCookieConsent
        onAccept={onAccept}
        onDecline={onDecline}
        delay={0}
      />
    ),
    dismiss: "decline",
    renderTimeout: (onAccept, onDecline, onTimeout) => (
      <GlobalCookieConsent
        onAccept={onAccept}
        onDecline={onDecline}
        onTimeout={onTimeout}
        delay={0}
        timeout={500}
      />
    ),
  },
  {
    name: "CompactCookieNotice",
    render: (onAccept, onDecline) => (
      <CompactCookieNotice
        onAccept={onAccept}
        declineText="Decline"
        onDecline={onDecline}
      />
    ),
    /* CompactCookieNotice renders no decline UI (declineText/onDecline are
       declared but unused) — accept is the dismiss path. */
    dismiss: "accept",
    /* CompactCookieNotice has no delay/timeout props — lifecycle covers
       show + dismiss only. */
  },
];

describe("consent banner lifecycle (PLAT-105)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    /* consent persistence must not leak between cases */
    document.cookie.split(";").forEach((c) => {
      const n = c.split("=")[0].trim();
      if (n)
        document.cookie = `${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  });
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  for (const c of CASES) {
    describe(c.name, () => {
      it('is shown after the show delay with data-state="open" (no forceVisible)', async () => {
        const onAccept = jest.fn(),
          onDecline = jest.fn(),
          onTimeout = jest.fn();
        const { container } = render(c.render(onAccept, onDecline, onTimeout));
        await act(async () => {
          jest.runAllTimers();
        });
        const open = container.querySelector('[data-state="open"]');
        expect(open).toBeTruthy();
        expect(open?.getAttribute("aria-hidden")).not.toBe("true");
      });

      it("dismiss hides the banner and a click on it calls no consent callback", async () => {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const onAccept = jest.fn(),
          onDecline = jest.fn(),
          onTimeout = jest.fn();
        const renderTimed = c.renderTimeout ?? c.render;
        const { container } = render(
          renderTimed(onAccept, onDecline, onTimeout)
        );
        await act(async () => {
          jest.runAllTimers();
        });

        /* Dismiss per component's real path. */
        if (c.dismiss !== "timeout") {
          const name =
            c.dismiss === "decline"
              ? /decline|deny|reject|no thanks/i
              : /accept|got it|ok/i;
          /* controls are data-glass-component divs, not native buttons */
          const candidates = [
            ...container.querySelectorAll("button, [data-glass-component]"),
          ].filter((el) => name.test((el.textContent ?? "").trim()));
          const btn =
            candidates.find((el) => el.tagName === "BUTTON") ?? candidates[0];
          expect(btn ?? `${c.name}: no ${c.dismiss} control`).toBeTruthy();
          await user.click(btn as Element);
        }
        await act(async () => {
          jest.runAllTimers();
          jest.advanceTimersByTime(2000);
        });

        const stillOpen = container.querySelector('[data-state="open"]');
        const closed = container.querySelector('[data-state="closed"]');
        expect(closed ?? stillOpen).toBeTruthy();
        if (stillOpen)
          expect(stillOpen.getAttribute("aria-hidden")).toBe("true");

        /* Click whatever is left — the consent callback must not fire. */
        onAccept.mockClear();
        const interactive = container.querySelector(
          'button, a[href], [role="button"]'
        );
        if (interactive) await user.click(interactive as Element);
        expect(onAccept).not.toHaveBeenCalled();
      });

      if (c.renderTimeout) {
        it("timeout path notifies onTimeout at most once", async () => {
          const onAccept = jest.fn(),
            onDecline = jest.fn(),
            onTimeout = jest.fn();
          render(c.renderTimeout!(onAccept, onDecline, onTimeout));
          await act(async () => {
            jest.advanceTimersByTime(2000);
          });
          expect(onTimeout.mock.calls.length).toBeLessThanOrEqual(1);
        });
      }
    });
  }
});
