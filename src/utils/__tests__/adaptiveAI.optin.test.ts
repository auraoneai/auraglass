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

  it("enableAdaptiveAI() constructs the singleton once", async () => {
    const mod = await import("../adaptiveAI");
    const a = mod.enableAdaptiveAI();
    expect(a).toBeTruthy();
    expect(mod.enableAdaptiveAI()).toBe(a);
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
