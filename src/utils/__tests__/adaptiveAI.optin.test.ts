/** REQ-PLAT-40 (PLAT-071/072): adaptive AI tracking is opt-in.
 *  import -> 0 listeners/intervals; enableAdaptiveAI() -> exactly 2 document
 *  listeners + 1 interval; its disposer removes exactly those 3; a second call
 *  installs nothing and returns the same disposer; exactly 1 console.warn per
 *  page load with the PRD text; interaction arrays cap at 20. */
const WARNING =
  "[aura-glass] enableAdaptiveAI() is deprecated and will be removed in 5.0. It records click and scroll activity on this page.";

type Mod = typeof import("../adaptiveAI");

describe("adaptiveAI opt-in (REQ-PLAT-40)", () => {
  let add: jest.SpyInstance;
  let remove: jest.SpyInstance;
  let setIv: jest.SpyInstance;
  let clearIv: jest.SpyInstance;
  let warn: jest.SpyInstance;
  let mod: Mod;

  beforeEach(async () => {
    jest.resetModules();
    jest.useFakeTimers();
    add = jest.spyOn(document, "addEventListener");
    remove = jest.spyOn(document, "removeEventListener");
    setIv = jest.spyOn(globalThis, "setInterval");
    clearIv = jest.spyOn(globalThis, "clearInterval");
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    mod = await import("../adaptiveAI");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const tracked = () => add.mock.calls.filter(([t]) => t === "click" || t === "scroll");

  it("import installs 0 listeners and 0 intervals and keeps the 4.1.0 engine export", () => {
    expect(tracked()).toHaveLength(0);
    expect(setIv).toHaveBeenCalledTimes(0);
    expect(mod.adaptiveAI).toBeInstanceOf(mod.AdaptiveAIEngine);
    expect(mod.adaptiveAI.isTracking()).toBe(false);
    expect(typeof mod.adaptiveAI.getConfiguration).toBe("function");
    expect(warn).toHaveBeenCalledTimes(0);
  });

  it("the environment no longer auto-enables tracking", async () => {
    process.env.NEXT_PUBLIC_AURAGLASS_ADAPTIVE_AI = "true";
    try {
      jest.resetModules();
      const fresh: Mod = await import("../adaptiveAI");
      expect(fresh.adaptiveAI.isTracking()).toBe(false);
      expect(tracked()).toHaveLength(0);
    } finally {
      delete process.env.NEXT_PUBLIC_AURAGLASS_ADAPTIVE_AI;
    }
  });

  it("enable -> exactly 2 document listeners + 1 interval; disposer removes exactly those 3", () => {
    const dispose = mod.enableAdaptiveAI();
    expect(tracked().map(([t]) => t).sort()).toEqual(["click", "scroll"]);
    expect(setIv).toHaveBeenCalledTimes(1);
    const handlers = tracked().map(([t, h]) => [t, h]);
    const handle = setIv.mock.results[0]!.value;

    dispose();
    expect(remove.mock.calls.map(([t, h]) => [t, h]).sort()).toEqual(handlers.sort());
    expect(clearIv).toHaveBeenCalledTimes(1);
    expect(clearIv).toHaveBeenCalledWith(handle);
    expect(remove.mock.calls.length + clearIv.mock.calls.length).toBe(3);
    expect(mod.adaptiveAI.isTracking()).toBe(false);
    // disposing twice is a no-op
    dispose();
    expect(remove.mock.calls.length + clearIv.mock.calls.length).toBe(3);
  });

  it("a second call is idempotent: same disposer, nothing new installed", () => {
    const a = mod.enableAdaptiveAI();
    const b = mod.enableAdaptiveAI();
    expect(b).toBe(a);
    expect(tracked()).toHaveLength(2);
    expect(setIv).toHaveBeenCalledTimes(1);
    a();
  });

  it("emits exactly one console.warn per page load, with the PRD text", () => {
    mod.enableAdaptiveAI()();
    mod.enableAdaptiveAI()();
    mod.enableAdaptiveAI();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(WARNING);
    expect(mod.ENABLE_ADAPTIVE_AI_WARNING).toBe(WARNING);
    mod.enableAdaptiveAI()();
  });

  it("25 clicks and 25 scrolls keep 20 entries each (oldest dropped)", () => {
    const dispose = mod.enableAdaptiveAI();
    for (let i = 0; i < 25; i++) {
      const el = document.createElement("button");
      el.id = `b${i}`;
      document.body.appendChild(el);
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 1, clientY: 1 }));
      jest.advanceTimersByTime(1);
      document.dispatchEvent(new Event("scroll"));
    }
    const data = mod.adaptiveAI.exportData();
    expect(data.userBehavior.clicks).toHaveLength(20);
    expect(data.userBehavior.clicks[0]!.element).toBe("BUTTON#b5");
    expect(data.userBehavior.clicks[19]!.element).toBe("BUTTON#b24");
    expect(data.userBehavior.scrollPatterns).toHaveLength(20);
    expect(mod.AdaptiveAIEngine.MAX_INTERACTIONS).toBe(20);
    dispose();
    document.body.innerHTML = "";
  });

  it("useAdaptiveAI keeps the 4.1.0 shape, never enables tracking and schedules nothing while idle", () => {
    // /pure: no auto-cleanup hooks; required after beforeEach's resetModules so it shares mod's React
    const { renderHook, act } = require("@testing-library/react/pure");
    const { result, unmount } = renderHook(() => mod.useAdaptiveAI());
    expect(Object.keys(result.current).sort()).toEqual(["ai", "config", "insights"]);
    expect(result.current.ai).toBe(mod.adaptiveAI);
    expect(result.current.config).toEqual(mod.adaptiveAI.getConfiguration());
    expect(tracked()).toHaveLength(0);
    expect(setIv).toHaveBeenCalledTimes(0);
    act(() => {
      jest.advanceTimersByTime(20_000);
    });
    expect(setIv).toHaveBeenCalledTimes(0);
    // opting in starts the hook's refresh; disposing stops it again
    let dispose!: () => void;
    act(() => {
      dispose = mod.enableAdaptiveAI();
    });
    expect(setIv).toHaveBeenCalledTimes(2); // engine session interval + hook refresh
    act(() => dispose());
    expect(clearIv).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("src/index exports adaptiveAI, enableAdaptiveAI and useAdaptiveAI", () => {
    const src = require("fs").readFileSync(require("path").join(__dirname, "../../index.ts"), "utf8");
    const block = src.match(/\{([^}]*)\}\s*from\s*"\.\/utils\/adaptiveAI"/)?.[1] ?? "";
    for (const name of ["adaptiveAI", "enableAdaptiveAI", "useAdaptiveAI"]) expect(block).toMatch(new RegExp(`\\b${name}\\b`));
  });
});
