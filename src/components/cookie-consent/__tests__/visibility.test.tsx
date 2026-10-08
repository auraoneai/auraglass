/**
 * PLAT-105 — cookie-consent visibility (CSS-driven data-state).
 *
 * After the show delay the banner settles open; after dismiss it carries
 * data-state='closed', whose CSS rule is visibility:hidden + pointer-events
 * none — asserted here both via the DOM contract and by checking the shipped
 * CSS module still contains the rule (jsdom cannot read module CSS).
 * A click on a hidden banner must reach no consent callback.
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { readFileSync } from "fs";
import path from "path";
import { CookieConsent } from "../CookieConsent";
import { CompactCookieNotice } from "../CompactCookieNotice";
import { GlobalCookieConsent } from "../GlobalCookieConsent";

jest.useFakeTimers();

afterEach(() => {
  cleanup();
  document.cookie = "cookie-consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
});

const components = [
  ["CookieConsent", CookieConsent, "CookieConsent.module.css"],
  [
    "CompactCookieNotice",
    CompactCookieNotice,
    "CompactCookieNotice.module.css",
  ],
  [
    "GlobalCookieConsent",
    GlobalCookieConsent,
    "GlobalCookieConsent.module.css",
  ],
] as const;

describe.each(components.map(([n]) => n))("%s visibility", (name) => {
  const [, Component, cssFile] = components.find(([n]) => n === name)!;
  const cssPath = path.join(__dirname, "..", cssFile);

  it("settles open (computed opacity 1) after the show timeout", () => {
    render(<Component message="We use cookies" delay={200} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    const el = document.querySelector("[data-state]");
    expect(el).not.toBeNull();
    expect(el!.getAttribute("data-state")).toBe("open");
    // jsdom reports unset opacity as "" or "1" — either means fully visible.
    expect(["", "1"]).toContain(getComputedStyle(el as Element).opacity);
  });

  it("carries visibility:hidden + pointer-events:none via data-state='closed' after dismiss", () => {
    // consent already recorded -> component renders its closed-state node
    document.cookie = "cookie-consent=all";
    render(<Component message="We use cookies" delay={0} />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    const el = document.querySelector("[data-state]");
    expect(el).not.toBeNull();
    expect(el!.getAttribute("data-state")).toBe("closed");
    expect(el!.getAttribute("aria-hidden")).toBe("true");

    // the CSS rule that actually hides it must ship in the module
    const css = readFileSync(cssPath, "utf8");
    const closedRule = css.match(/\[data-state=['"]closed['"]\][^{]*\{[^}]+\}/);
    expect(closedRule).not.toBeNull();
    expect(closedRule![0]).toMatch(/visibility:\s*hidden/);
    expect(closedRule![0]).toMatch(/pointer-events:\s*none/);
    expect(closedRule![0]).toMatch(/opacity:\s*0/);
  });

  it("a click on the hidden banner calls no consent callback", () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();
    document.cookie = "cookie-consent=all";
    render(
      <Component
        message="We use cookies"
        onAccept={onAccept}
        onDecline={onDecline}
      />
    );
    act(() => {
      jest.advanceTimersByTime(500);
    });
    const el = document.querySelector("[data-state='closed']") as HTMLElement;
    expect(el).not.toBeNull();
    // the closed node renders no buttons at all — nothing clickable inside
    expect(el.querySelector("button")).toBeNull();
    fireEvent.click(el);
    expect(onAccept).not.toHaveBeenCalled();
    expect(onDecline).not.toHaveBeenCalled();
  });
});
