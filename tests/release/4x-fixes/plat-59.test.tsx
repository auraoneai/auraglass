/**
 * REQ-PLAT-59 (REQ-FIN-36, FIN-110) — 4.x visual-fixes behavioural tests (6).
 *
 * Each case exercises the shipped code (render, hook, matchMedia) instead of
 * grepping source text. Contrast numbers are never asserted from hand-entered
 * data: case 6 checks that every visual-fixes record is either tool-written by
 * `plat:test:visual-4x` (ratio + artifact URL, ratio >= target) or explicitly
 * `pending` on that tool with no ratio.
 */
import React from "react";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";

jest.mock("framer-motion", () => {
  const R = require("react");
  return {
    motion: new Proxy(
      {},
      {
        get: (_t: any, tag: string) =>
          R.forwardRef(({ children, ...rest }: any, ref: any) =>
            R.createElement(tag, { ...rest, ref }, children)
          ),
      }
    ),
    AnimatePresence: ({ children }: any) => R.createElement(R.Fragment, null, children),
  };
}, { virtual: true });

const ROOT = join(__dirname, "..", "..", "..");

describe("PLAT-59 visual fixes", () => {
  it("1. GlassWorkspaceTabs keeps value/onValueChange off the tablist and drives its tabs", () => {
    const { GlassWorkspaceTabs, GlassWorkspaceTab } = require("../../../src/workspace");
    const onValueChange = jest.fn();
    render(
      <GlassWorkspaceTabs value="a" onValueChange={onValueChange} aria-label="ws">
        <GlassWorkspaceTab data-value="a">A</GlassWorkspaceTab>
        <GlassWorkspaceTab data-value="b">B</GlassWorkspaceTab>
      </GlassWorkspaceTabs>
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist.hasAttribute("value")).toBe(false);
    expect(tablist.hasAttribute("onvaluechange")).toBe(false);
    fireEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  describe("2. no perpetual rAF FPS loop", () => {
    let raf: jest.SpyInstance;
    beforeEach(() => {
      jest.useFakeTimers();
      raf = jest.spyOn(window, "requestAnimationFrame");
    });
    afterEach(() => {
      raf.mockRestore();
      jest.useRealTimers();
    });

    const hooks: Array<[string, () => unknown]> = [
      ["useGlassPerformance", () => require("../../../src/hooks/extended/useGlassPerformance").useGlassPerformance()],
      ["usePerformance", () => require("../../../src/hooks/usePerformance").usePerformance({ sampleRate: 100 })],
      ["useEnhancedPerformance", () => require("../../../src/hooks/useEnhancedPerformance").useEnhancedPerformance()],
    ];

    it.each(hooks)("%s schedules 0 animation frames over 10s", (_name, useHook) => {
      const { unmount } = renderHook(() => useHook());
      act(() => {
        jest.advanceTimersByTime(10_000);
      });
      expect(raf).toHaveBeenCalledTimes(0);
      unmount();
    });

    it("useGlassPerformance().sampleFPS measures one bounded window, then stops", async () => {
      const { useGlassPerformance } = require("../../../src/hooks/extended/useGlassPerformance");
      const { result, unmount } = renderHook(() => useGlassPerformance());
      let sampled: Promise<number> | undefined;
      act(() => {
        sampled = result.current.sampleFPS(1000);
      });
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      const fps = await act(async () => sampled!);
      expect(fps).toBeGreaterThan(0);
      const callsAfterWindow = raf.mock.calls.length;
      expect(callsAfterWindow).toBeGreaterThan(0);
      act(() => {
        jest.advanceTimersByTime(10_000);
      });
      expect(raf).toHaveBeenCalledTimes(callsAfterWindow);
      unmount();
    });
  });

  it("3. prefers-contrast: more is honoured", () => {
    const { prefersHighContrast } = require("../../../src/utils/a11y");
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === "(prefers-contrast: more)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as any;
    try {
      expect(prefersHighContrast()).toBe(true);
    } finally {
      window.matchMedia = original;
    }
  });

  it("4. dark on-surface is OKLCH with L >= 0.92 and C <= 0.02", () => {
    const css = readFileSync(join(ROOT, "src/styles/themes/dark.css"), "utf8");
    for (const token of ["--glass-on-surface", "--glass-on-surface-muted"]) {
      const m = css.match(new RegExp(`${token}:\\s*oklch\\(([\\d.]+)\\s+([\\d.]+)`));
      expect(m).not.toBeNull();
      expect(parseFloat(m![1])).toBeGreaterThanOrEqual(0.92);
      expect(parseFloat(m![2])).toBeLessThanOrEqual(0.02);
    }
  });

  it("5. GlassSwitch renders no shimmer/press motion classes", () => {
    const { GlassSwitch } = require("../../../src/components/input/GlassSwitch");
    const { container } = render(<GlassSwitch aria-label="toggle" />);
    for (const cls of ["glass-lift-on-hover", "glass-press", "glass-shimmer", "glass-animate-shimmer"]) {
      expect(container.querySelector(`.${cls}`)).toBeNull();
    }
  });

  it("6. visual-fixes records carry tool-written contrast or are pending on the tool", () => {
    const dir = join(ROOT, "docs/release/visual-fixes");
    const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
    expect(files).toEqual([
      "dark-navy-text.json",
      "glass-switch-shimmer.json",
      "opacity-vars.json",
      "prefers-contrast-more.json",
    ]);
    const offenders: string[] = [];
    for (const f of files) {
      const doc = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (!doc.fix || !doc.selector) offenders.push(`${f}: missing fix/selector`);
      if (!Array.isArray(doc.textRuns) || doc.textRuns.length === 0) {
        offenders.push(`${f}: no textRuns`);
        continue;
      }
      const m = doc.measurement ?? {};
      if (m.tool !== "plat:test:visual-4x") offenders.push(`${f}: measurement.tool must be plat:test:visual-4x`);
      if (m.status === "pending") {
        if (m.ratio !== null || m.artifactUrl !== null) offenders.push(`${f}: pending record carries a ratio/artifact`);
      } else if (m.status === "measured") {
        if (!/^https:\/\//.test(String(m.artifactUrl))) offenders.push(`${f}: measured without artifactUrl`);
        for (const run of doc.textRuns) {
          const r = m.runs?.[run.id];
          if (typeof r !== "number" || r < run.minRatio) offenders.push(`${f}: ${run.id} below ${run.minRatio}`);
        }
      } else {
        offenders.push(`${f}: measurement.status must be pending|measured`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
