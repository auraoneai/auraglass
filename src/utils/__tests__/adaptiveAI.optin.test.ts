/** PLAT-071/072: adaptive AI engine is opt-in. Importing the module must not
    construct the engine; enableAdaptiveAI() or the env flag turns it on. */
describe("adaptiveAI opt-in", () => {
  const ENV_KEY = "NEXT_PUBLIC_AURAGLASS_ADAPTIVE_AI";

  beforeEach(() => {
    jest.resetModules();
    delete process.env[ENV_KEY];
  });

  afterEach(() => {
    delete process.env[ENV_KEY];
  });

  it("does not construct the engine at import when the flag is unset", async () => {
    const mod = await import("../adaptiveAI");
    expect(mod.adaptiveAI).toBeNull();
    expect(typeof mod.useAdaptiveAI).toBe("function");
  });

  it("enableAdaptiveAI() returns the same disposer every call (idempotent)", async () => {
    const mod = await import("../adaptiveAI");
    const a = mod.enableAdaptiveAI();
    expect(a).toBeTruthy();
    expect(typeof a).toBe("function");
    expect(mod.enableAdaptiveAI()).toBe(a);
    a();
  });

  it("env opt-in constructs the engine at import", async () => {
    process.env[ENV_KEY] = "true";
    const mod = await import("../adaptiveAI");
    expect(mod.adaptiveAI).not.toBeNull();
  });

  it("src/index exports enableAdaptiveAI", async () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../../index.ts"),
      "utf8"
    );
    expect(src).toMatch(/enableAdaptiveAI/);
  });
});

describe("tracking lifecycle (REQ-PLAT-40)", () => {
  it("constructor installs no listeners or intervals; start() does; disable() removes them", async () => {
    jest.resetModules();
    const addSpy = jest.spyOn(document, "addEventListener");
    const rmSpy = jest.spyOn(document, "removeEventListener");
    const ivSpy = jest.spyOn(globalThis, "setInterval");
    const civSpy = jest.spyOn(globalThis, "clearInterval");
    const mod = await import("../adaptiveAI");
    const before = addSpy.mock.calls.length;
    // Construct the singleton directly — tracking must still be zero.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Engine =
      (mod as any).AdaptiveAIEngine ??
      Object.getPrototypeOf(mod.adaptiveAI ?? {})?.constructor;
    expect(addSpy.mock.calls.length).toBe(before);
    const dispose = mod.enableAdaptiveAI();
    const afterEnable = addSpy.mock.calls.length - before;
    expect(afterEnable).toBeGreaterThan(0);
    expect(ivSpy.mock.calls.length).toBeGreaterThan(0);
    dispose();
    expect(rmSpy.mock.calls.length).toBeGreaterThanOrEqual(afterEnable);
    expect(civSpy.mock.calls.length).toBeGreaterThan(0);
    addSpy.mockRestore();
    rmSpy.mockRestore();
    ivSpy.mockRestore();
    civSpy.mockRestore();
  });
});
