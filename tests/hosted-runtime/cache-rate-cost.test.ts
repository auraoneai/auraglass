import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { TextDecoder, TextEncoder } from "util";

if (!(globalThis as any).TextDecoder) {
  (globalThis as any).TextDecoder = TextDecoder;
}

if (!(globalThis as any).TextEncoder) {
  (globalThis as any).TextEncoder = TextEncoder;
}

jest.resetModules();

const mockRedisClient = {
  on: jest.fn(),
  connect: jest.fn(),
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  flushAll: jest.fn(),
  quit: jest.fn(),
};

const mockCreateClient = jest.fn(() => mockRedisClient);
const mockOpenAICreate = jest.fn();
const mockRateLimitMiddleware = jest.fn(
  (_req: unknown, _res: unknown, next?: () => void) => {
    next?.();
  }
);
const mockRateLimit = jest.fn(() => mockRateLimitMiddleware);

jest.mock("redis", () => ({
  __esModule: true,
  createClient: mockCreateClient,
}));

jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockOpenAICreate,
      },
    },
  })),
}));

jest.mock("express-rate-limit", () => ({
  __esModule: true,
  default: mockRateLimit,
}));

const { CacheService } = require("../../src/services/ai/cache-service") as typeof import(
  "../../src/services/ai/cache-service"
);
const {
  createAIConfig,
  defaultAIConfig,
} = require("../../src/services/ai/config") as typeof import("../../src/services/ai/config");
const { OpenAIService } = require("../../src/services/ai/openai-service") as typeof import(
  "../../src/services/ai/openai-service"
);
const { createRateLimiter } = require("../../src/services/auth/middleware") as typeof import(
  "../../src/services/auth/middleware"
);

type AIConfig = import("../../src/services/ai/config").AIConfig;

type PartialNestedConfig = Partial<{
  [Key in keyof AIConfig]: Partial<AIConfig[Key]>;
}>;

const fieldSuggestions = [
  {
    fieldName: "email",
    fieldType: "email",
    label: "Email",
    required: true,
    validation: {
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
    },
  },
];

function createConfig(overrides: PartialNestedConfig = {}): AIConfig {
  return {
    ...defaultAIConfig,
    openai: {
      ...defaultAIConfig.openai,
      apiKey: "test-openai-key",
      model: "gpt-4-turbo",
      maxTokens: 640,
      temperature: 0.2,
      ...overrides.openai,
    },
    googleCloud: {
      ...defaultAIConfig.googleCloud,
      ...overrides.googleCloud,
    },
    pinecone: {
      ...defaultAIConfig.pinecone,
      ...overrides.pinecone,
    },
    removeBg: {
      ...defaultAIConfig.removeBg,
      ...overrides.removeBg,
    },
    redis: {
      ...defaultAIConfig.redis,
      url: "redis://cache.example.test:6379",
      ttl: 321,
      ...overrides.redis,
    },
    rateLimit: {
      ...defaultAIConfig.rateLimit,
      windowMs: 30_000,
      maxRequests: 12,
      ...overrides.rateLimit,
    },
    costOptimization: {
      ...defaultAIConfig.costOptimization,
      enableCaching: true,
      enableBatching: true,
      maxCostPerRequest: 0.025,
      useCheaperModelsThreshold: 0.8,
      ...overrides.costOptimization,
    },
  };
}

function resetRedisClient(): void {
  mockRedisClient.on.mockReset();
  mockRedisClient.connect.mockReset();
  mockRedisClient.get.mockReset();
  mockRedisClient.setEx.mockReset();
  mockRedisClient.del.mockReset();
  mockRedisClient.flushAll.mockReset();
  mockRedisClient.quit.mockReset();

  mockRedisClient.on.mockReturnValue(mockRedisClient);
  mockRedisClient.connect.mockResolvedValue(undefined);
  mockRedisClient.get.mockResolvedValue(null);
  mockRedisClient.setEx.mockResolvedValue(undefined);
  mockRedisClient.del.mockResolvedValue(undefined);
  mockRedisClient.flushAll.mockResolvedValue(undefined);
  mockRedisClient.quit.mockResolvedValue(undefined);
  mockCreateClient.mockReturnValue(mockRedisClient);
}

function resetOpenAI(): void {
  mockOpenAICreate.mockReset();
  mockOpenAICreate.mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({ fields: fieldSuggestions }),
        },
      },
    ],
  });
}

function withEnv(updates: NodeJS.ProcessEnv, callback: () => void): void {
  const previous = { ...process.env };

  for (const key of Object.keys(process.env)) {
    delete process.env[key];
  }
  Object.assign(process.env, previous, updates);

  try {
    callback();
  } finally {
    for (const key of Object.keys(process.env)) {
      delete process.env[key];
    }
    Object.assign(process.env, previous);
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  resetRedisClient();
  resetOpenAI();
  mockRateLimit.mockImplementation(() => mockRateLimitMiddleware);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("3.3 Redis cache service coverage", () => {
  it("connects to Redis and delegates JSON cache operations with TTLs", async () => {
    const service = new CacheService({
      url: "redis://cache.example.test:6379",
      ttl: 900,
    });
    const cachedPayload = { cached: true, usageCents: 1.4 };

    mockRedisClient.get.mockResolvedValueOnce(JSON.stringify(cachedPayload));

    await service.connect();
    await service.set("ai:cost:user-1", cachedPayload);
    const result = await service.get<typeof cachedPayload>("ai:cost:user-1");
    await service.delete("ai:cost:user-1");
    await service.flush();
    await service.disconnect();

    expect(mockCreateClient).toHaveBeenCalledWith({
      url: "redis://cache.example.test:6379",
    });
    expect(mockRedisClient.on).toHaveBeenCalledWith(
      "error",
      expect.any(Function)
    );
    expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
    expect(mockRedisClient.setEx).toHaveBeenCalledWith(
      "ai:cost:user-1",
      900,
      JSON.stringify(cachedPayload)
    );
    expect(result).toEqual(cachedPayload);
    expect(mockRedisClient.del).toHaveBeenCalledWith("ai:cost:user-1");
    expect(mockRedisClient.flushAll).toHaveBeenCalledTimes(1);
    expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
  });

  it("honors per-write TTL overrides for cached AI responses", async () => {
    const service = new CacheService({
      url: "redis://cache.example.test:6379",
      ttl: 900,
    });

    await service.connect();
    await service.set("openai:form-suggestions:abc", fieldSuggestions, 42);

    expect(mockRedisClient.setEx).toHaveBeenCalledWith(
      "openai:form-suggestions:abc",
      42,
      JSON.stringify(fieldSuggestions)
    );
  });

  it("falls back to the in-memory cache when Redis is unavailable", async () => {
    jest.useFakeTimers({ now: new Date("2026-06-05T00:00:00.000Z") });
    mockRedisClient.connect.mockRejectedValueOnce(new Error("redis offline"));

    const service = new CacheService({
      url: "redis://cache.example.test:6379",
      ttl: 60,
    });

    await service.connect();
    await service.set("openai:summary:local", "cached summary", 2);

    await expect(service.get<string>("openai:summary:local")).resolves.toBe(
      "cached summary"
    );

    jest.advanceTimersByTime(2001);

    await expect(service.get<string>("openai:summary:local")).resolves.toBeNull();
    expect(mockRedisClient.setEx).not.toHaveBeenCalled();
  });
});

describe("3.3 AI cache hit, miss, and cost-control coverage", () => {
  it("returns cached form suggestions without calling OpenAI", async () => {
    const service = new OpenAIService(createConfig());
    const cache = {
      get: jest.fn().mockResolvedValue(fieldSuggestions),
      set: jest.fn(),
    };
    (service as any).cache = cache;

    const result = await service.generateFormFieldSuggestions("checkout form");

    expect(result).toEqual(fieldSuggestions);
    expect(cache.get).toHaveBeenCalledWith(
      expect.stringMatching(/^form-suggestions:[a-f0-9]{64}$/)
    );
    expect(cache.set).not.toHaveBeenCalled();
    expect(mockOpenAICreate).not.toHaveBeenCalled();
  });

  it("writes AI responses to cache on misses using the Redis TTL from config", async () => {
    const service = new OpenAIService(createConfig({ redis: { ttl: 123 } }));
    const cache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };
    (service as any).cache = cache;

    const result = await service.generateFormFieldSuggestions("checkout form");

    expect(result).toEqual(fieldSuggestions);
    expect(mockOpenAICreate).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(
      expect.stringMatching(/^form-suggestions:[a-f0-9]{64}$/),
      fieldSuggestions,
      123
    );
  });

  it("returns cost-safe usage metadata without prompt or response content", async () => {
    const service = new OpenAIService(createConfig({ redis: { ttl: 123 } }));
    (service as any).cache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    const result = await service.generateFormFieldSuggestionsWithMetadata(
      "checkout form with email capture"
    );

    expect(result).toEqual({
      fields: fieldSuggestions,
      cached: false,
      usage: expect.objectContaining({
        provider: "openai",
        feature: "smart form generation",
        model: "gpt-3.5-turbo",
        cached: false,
        promptTokensEstimate: expect.any(Number),
        completionTokensEstimate: expect.any(Number),
        estimatedCostUsd: expect.any(Number),
      }),
    });
    expect(result.usage.promptTokensEstimate).toBeGreaterThan(0);
    expect(result.usage.completionTokensEstimate).toBeGreaterThan(0);
    expect(result.usage.estimatedCostUsd).toBeGreaterThan(0);
    expect(JSON.stringify(result.usage)).not.toContain("checkout form");
    expect(JSON.stringify(result.usage)).not.toContain("fieldName");
  });

  it("returns zero-cost usage metadata on AI cache hits", async () => {
    const service = new OpenAIService(createConfig());
    (service as any).cache = {
      get: jest.fn().mockResolvedValue(fieldSuggestions),
      set: jest.fn(),
    };

    const result = await service.generateFormFieldSuggestionsWithMetadata(
      "checkout form"
    );

    expect(result).toEqual({
      fields: fieldSuggestions,
      cached: true,
      usage: {
        provider: "openai",
        feature: "smart form generation",
        model: "gpt-4-turbo",
        promptTokensEstimate: 0,
        completionTokensEstimate: 0,
        cached: true,
        estimatedCostUsd: 0,
      },
    });
    expect(mockOpenAICreate).not.toHaveBeenCalled();
  });

  it("reads hosted cost and rate-limit controls from environment config", () => {
    const config = createAIConfig({
      NODE_ENV: "test",
      REDIS_URL: "redis://cache.example.test:6379",
      REDIS_TTL_SECONDS: "77",
      RATE_LIMIT_WINDOW_MS: "45000",
      AI_RATE_LIMIT_MAX_REQUESTS: "8",
      MAX_COST_PER_REQUEST: "0.015",
      USE_CHEAPER_MODELS_THRESHOLD: "0.7",
      ENABLE_AI_CACHING: "true",
      ENABLE_AI_BATCHING: "false",
    });

    expect(config.redis).toEqual({
      url: "redis://cache.example.test:6379",
      ttl: 77,
    });
    expect(config.rateLimit).toEqual({
      windowMs: 45_000,
      maxRequests: 8,
    });
    expect(config.costOptimization).toEqual({
      enableCaching: true,
      enableBatching: false,
      maxCostPerRequest: 0.015,
      useCheaperModelsThreshold: 0.7,
    });
  });

  it("uses the cheaper model for simple prompts when cost controls allow it", async () => {
    const service = new OpenAIService(
      createConfig({
        costOptimization: {
          useCheaperModelsThreshold: 0.8,
        },
      })
    );
    (service as any).cache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    await service.generateFormFieldSuggestions("simple contact form");

    expect(mockOpenAICreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-3.5-turbo",
        max_tokens: 640,
        temperature: 0.2,
      })
    );
  });

  it("uses the configured model when cheap-model substitution is disabled", async () => {
    const service = new OpenAIService(
      createConfig({
        costOptimization: {
          useCheaperModelsThreshold: 0.4,
        },
      })
    );
    (service as any).cache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    await service.generateFormFieldSuggestions(
      "multi-step enterprise onboarding workflow with compliance approvals"
    );

    expect(mockOpenAICreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-4-turbo",
        max_tokens: 640,
        temperature: 0.2,
      })
    );
  });
});

describe("3.3 hosted rate-limit coverage", () => {
  it("passes explicit middleware settings to express-rate-limit", () => {
    mockRateLimit.mockClear();

    const limiter = createRateLimiter({
      windowMs: 1_000,
      max: 3,
      message: "Slow down",
      skipSuccessfulRequests: true,
    });

    expect(limiter).toBe(mockRateLimitMiddleware);
    expect(mockRateLimit).toHaveBeenCalledWith({
      windowMs: 1_000,
      max: 3,
      message: "Slow down",
      skipSuccessfulRequests: true,
      standardHeaders: true,
      legacyHeaders: false,
    });
  });

  it("wires the hosted /api limiter from RATE_LIMIT_* environment variables", () => {
    mockRateLimit.mockClear();

    withEnv(
      {
        NODE_ENV: "test",
        SENTRY_DSN: "",
        RATE_LIMIT_WINDOW_MS: "25000",
        RATE_LIMIT_MAX_REQUESTS: "4",
      },
      () => {
        jest.isolateModules(() => {
          require("../../server/index");
        });
      }
    );

    expect(mockRateLimit).toHaveBeenCalledWith({
      windowMs: 25_000,
      max: 4,
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
  });
});
