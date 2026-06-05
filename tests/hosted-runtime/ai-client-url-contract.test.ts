import {
  expectProviderUnconfiguredPayload,
  ProviderUnconfiguredPayload,
} from "./helpers/hostedRuntimeContracts";

const originalEnv = process.env;
const originalFetch = global.fetch;

describe("AIClient hosted runtime URL and provider error contract", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_WS_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("uses the 3.3 canonical local hosted defaults when env overrides are absent", () => {
    const AIClient = require("../../src/lib/ai-client").default;
    const client = new AIClient();

    expect((client as any).config.apiUrl).toBe("http://localhost:3002");
    expect((client as any).config.wsUrl).toBe("ws://localhost:3001");
  });

  it("honors public API and WebSocket URL overrides", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.test";
    process.env.NEXT_PUBLIC_WS_URL = "wss://api.example.test/ws";

    const AIClient = require("../../src/lib/ai-client").default;
    const client = new AIClient();

    expect((client as any).config.apiUrl).toBe("https://api.example.test");
    expect((client as any).config.wsUrl).toBe("wss://api.example.test/ws");
  });

  it("preserves provider-unconfigured metadata from hosted API responses", async () => {
    const payload: ProviderUnconfiguredPayload = {
      error: "Provider not configured",
      code: "AURA_PROVIDER_UNCONFIGURED",
      provider: "openai",
      feature: "generate-form",
      docsUrl: "https://auraglass.auraone.ai/docs/ai-providers",
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: jest.fn().mockResolvedValue(payload),
    } as any);

    const AIClient = require("../../src/lib/ai-client").default;
    const client = new AIClient({
      apiUrl: "https://api.example.test",
      getAuthToken: () => Promise.resolve("jwt-token"),
    });

    try {
      await client.generateFormFields("checkout form");
      throw new Error("Expected generateFormFields to reject");
    } catch (error: any) {
      expect(error).toMatchObject({
        message: "Provider not configured",
        code: "AURA_PROVIDER_UNCONFIGURED",
        status: 503,
        provider: "openai",
        feature: "generate-form",
        docsUrl: "https://auraglass.auraone.ai/docs/ai-providers",
      });
    }

    expectProviderUnconfiguredPayload(payload, {
      provider: "openai",
      feature: "generate-form",
    });
  });
});
