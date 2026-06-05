import * as aiConfigModule from "../../src/services/ai/config";
import {
  expectProviderUnconfiguredPayload,
  readRepoFile,
} from "./helpers/hostedRuntimeContracts";

describe("Hosted AI provider route contract", () => {
  const serverSource = readRepoFile("server/index.ts");
  const demoServerSource = readRepoFile("server/api-server.js");

  it("declares every 3.3 AI route and validates required request bodies before provider calls", () => {
    const routeContracts = [
      {
        route: "/generate-form",
        requiredInput: /if \(!context\)/,
        providerCall: "generateFormFieldSuggestions",
      },
      {
        route: "/search",
        requiredInput: /if \(!query\)/,
        providerCall: "generateSemanticSearchQuery",
      },
      {
        route: "/index-documents",
        requiredInput: /if \(!Array\.isArray\(documents\) \|\| documents\.length === 0\)/,
        providerCall: "indexDocuments",
      },
      {
        route: "/analyze-image",
        requiredInput: /if \(!image\)/,
        providerCall: "analyzeImage",
      },
      {
        route: "/remove-background",
        requiredInput: /if \(!image\)/,
        providerCall: "removeBackground",
      },
      {
        route: "/summarize",
        requiredInput: /if \(!content\)/,
        providerCall: "generateContentSummary",
      },
    ];

    for (const contract of routeContracts) {
      expect(serverSource).toContain(`aiRouter.post('${contract.route}'`);
      expect(serverSource).toMatch(contract.requiredInput);
      expect(serverSource).toContain(contract.providerCall);
    }
  });

  it("defines the provider-unconfigured payload shape required by the 3.3 PRD", () => {
    expectProviderUnconfiguredPayload(
      {
        error: "Provider not configured",
        code: "AURA_PROVIDER_UNCONFIGURED",
        provider: "openai",
        feature: "generate-form",
        docsUrl: "https://auraglass.auraone.ai/docs/ai-providers",
      },
      { provider: "openai", feature: "generate-form" }
    );
  });

  it("uses structured provider-unconfigured responses instead of raw provider errors", () => {
    expect(/AURA_PROVIDER_UNCONFIGURED/.test(serverSource)).toBe(true);
    expect(/Provider not configured/.test(serverSource)).toBe(true);
    expect(/503|424/.test(serverSource)).toBe(true);
    expect(/message:\s*\(error as Error\)\.message/.test(serverSource)).toBe(
      false
    );
  });

  it("exports the runtime AI config factory that the hosted server imports", () => {
    expect(typeof (aiConfigModule as any).createAIConfig).toBe("function");
  });

  it("requires REDIS_URL for hosted production caching", () => {
    const createAIConfig = (aiConfigModule as any).createAIConfig as (
      env: NodeJS.ProcessEnv
    ) => unknown;

    expect(() =>
      createAIConfig({
        NODE_ENV: "production",
        ENABLE_AI_CACHING: "true",
      })
    ).toThrow(/redis is not configured for AI caching/);

    expect(() =>
      createAIConfig({
        NODE_ENV: "production",
        ENABLE_AI_CACHING: "false",
      })
    ).not.toThrow();

    expect(() =>
      createAIConfig({
        NODE_ENV: "production",
        ENABLE_AI_CACHING: "true",
        REDIS_URL: "redis://localhost:6379",
      })
    ).not.toThrow();
  });

  it("includes Redis caching in hosted readiness checks", () => {
    expect(serverSource).toContain("name: 'redis'");
    expect(serverSource).toContain("runtimeFeatures.aiCaching");
    expect(serverSource).toContain(
      "Set REDIS_URL for hosted AI caching or set ENABLE_AI_CACHING=false."
    );
  });

  it("keeps hardcoded mock AI success responses out of hosted API entrypoints", () => {
    expect(/For now, return a mock response/.test(demoServerSource)).toBe(
      false
    );
    expect(/Mock search results/.test(demoServerSource)).toBe(false);
    expect(/Mock analysis result/.test(demoServerSource)).toBe(false);
    expect(
      /Successfully indexed|indexed: documents\.length/.test(demoServerSource)
    ).toBe(false);
  });
});
