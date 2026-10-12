/** REQ-PLAT-44 crash class: GlassButton and GlassContainer with every
 *  "advanced" flag on and no providers render without throwing, keep a stable
 *  hook order when each flag toggles, and start no global listeners, timers,
 *  Workers or AudioContexts from library code. */
import React from "react";
import { render } from "@testing-library/react";
import { GlassButton } from "../components/button/GlassButton";
import { GlassContainer } from "../components/layout/GlassContainer";

const FLAGS = ["predictive", "eyeTracking", "adaptive", "spatialAudio", "trackAchievements"] as const;
type Flags = Partial<Record<(typeof FLAGS)[number], boolean>>;
const ALL_ON: Flags = Object.fromEntries(FLAGS.map((f) => [f, true]));

/* A call counts when library source (src/, not this test or node_modules)
   is on the stack — React / testing-library internals are not the subject. */
const fromLibrary = (stack = new Error().stack ?? "") =>
  stack
    .split("\n")
    .slice(2)
    .some((l) => /[\\/]src[\\/]/.test(l) && !/__tests__/.test(l) && !/node_modules/.test(l));

type Effects = { listeners: string[]; timers: string[]; workers: number; audio: number };

function track(): { effects: Effects; restore: () => void } {
  const effects: Effects = { listeners: [], timers: [], workers: 0, audio: 0 };
  const restores: Array<() => void> = [];
  const wrap = <T extends object>(obj: T, key: keyof T, onCall: (args: unknown[]) => void) => {
    const orig = obj[key] as unknown as (...a: unknown[]) => unknown;
    const had = Object.prototype.hasOwnProperty.call(obj, key);
    (obj as any)[key] = function (this: unknown, ...args: unknown[]) {
      if (fromLibrary()) onCall(args);
      return orig.apply(this, args);
    };
    restores.push(() => {
      if (had) (obj as any)[key] = orig;
      else delete (obj as any)[key];
    });
  };
  wrap(window, "addEventListener", (a) => effects.listeners.push(`window:${String(a[0])}`));
  wrap(document, "addEventListener", (a) => effects.listeners.push(`document:${String(a[0])}`));
  for (const host of [window, globalThis] as any[]) {
    wrap(host, "setInterval", (a) => effects.timers.push(`setInterval(${String(a[1])})`));
    wrap(host, "setTimeout", (a) => effects.timers.push(`setTimeout(${String(a[1])})`));
  }
  const g = globalThis as any;
  const prevWorker = g.Worker;
  const prevAudio = g.AudioContext;
  const prevWebkit = (window as any).webkitAudioContext;
  g.Worker = function Worker() {
    effects.workers++;
    throw new Error("Worker constructed during a provider-less render");
  };
  const Audio = function AudioContext() {
    effects.audio++;
    throw new Error("AudioContext constructed during a provider-less render");
  };
  g.AudioContext = Audio;
  (window as any).AudioContext = Audio;
  (window as any).webkitAudioContext = Audio;
  restores.push(() => {
    g.Worker = prevWorker;
    g.AudioContext = prevAudio;
    (window as any).AudioContext = prevAudio;
    (window as any).webkitAudioContext = prevWebkit;
  });
  return { effects, restore: () => restores.reverse().forEach((r) => r()) };
}

const NONE: Effects = { listeners: [], timers: [], workers: 0, audio: 0 };

describe.each([
  ["GlassButton", (p: Flags) => <GlassButton {...p}>Go</GlassButton>],
  ["GlassContainer", (p: Flags) => <GlassContainer {...p}>Body</GlassContainer>],
] as const)("%s without providers (REQ-PLAT-44)", (_name, el) => {
  let errors: jest.SpyInstance;
  beforeEach(() => {
    errors = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => errors.mockRestore());
  const hookOrderErrors = () =>
    errors.mock.calls.filter((c) => /order of Hooks|Rendered (more|fewer) hooks|Invalid hook call/.test(String(c[0])));

  it("renders with every flag on: 0 listeners, timers, Workers, AudioContexts", () => {
    const t = track();
    try {
      const { unmount } = render(el(ALL_ON));
      unmount();
      expect(t.effects).toEqual(NONE);
    } finally {
      t.restore();
    }
    expect(hookOrderErrors()).toEqual([]);
  });

  it.each(FLAGS)("toggling %s on and off keeps the hook order and starts nothing", (flag) => {
    const t = track();
    try {
      const { rerender, unmount } = render(el({}));
      rerender(el({ [flag]: true }));
      rerender(el({}));
      rerender(el(ALL_ON));
      rerender(el({ ...ALL_ON, [flag]: false }));
      unmount();
      expect(t.effects).toEqual(NONE);
    } finally {
      t.restore();
    }
    expect(hookOrderErrors()).toEqual([]);
  });

  it("the tracker is not vacuous: library code that starts listeners and timers is counted", () => {
    const { AdaptiveAIEngine } = require("../utils/adaptiveAI");
    const t = track();
    try {
      const engine = new AdaptiveAIEngine();
      engine.start();
      engine.disable();
      expect(t.effects.listeners).toEqual(expect.arrayContaining(["document:click", "document:scroll"]));
      expect(t.effects.timers.length).toBeGreaterThan(0);
    } finally {
      t.restore();
    }
  });
});
