import { z } from "zod";

export const AIConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string().default(""),
    model: z.enum(["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]).default("gpt-4"),
    maxTokens: z.number().default(2000),
    temperature: z.number().min(0).max(2).default(0.7),
  }),
  googleCloud: z.object({
    projectId: z.string().optional(),
    keyFilename: z.string().optional(),
    apiKey: z.string().optional(),
  }),
  pinecone: z.object({
    apiKey: z.string().default(""),
    environment: z.string().default("us-east-1"),
    indexName: z.string().default("aura-glass-embeddings"),
  }),
  removeBg: z.object({
    apiKey: z.string().default(""),
  }),
  redis: z.object({
    url: z.string().url().default("redis://localhost:6379"),
    ttl: z.number().default(3600),
  }),
  rateLimit: z.object({
    windowMs: z.number().default(15 * 60 * 1000),
    maxRequests: z.number().default(50),
  }),
  costOptimization: z.object({
    enableCaching: z.boolean().default(true),
    enableBatching: z.boolean().default(true),
    maxCostPerRequest: z.number().default(0.1),
    useCheaperModelsThreshold: z.number().min(0).max(1).default(0.5),
  }),
});

export type AIConfig = z.infer<typeof AIConfigSchema>;

export type AIProvider =
  | "openai"
  | "pinecone"
  | "googleVision"
  | "removeBg"
  | "redis";

export interface RuntimeFeatureFlags {
  smartForms: boolean;
  semanticSearch: boolean;
  visionAPI: boolean;
  backgroundRemoval: boolean;
  aiCaching: boolean;
  aiBatching: boolean;
  collaboration: boolean;
}

export interface ProviderUnconfiguredPayload {
  error: string;
  message: string;
  code: "AURA_PROVIDER_UNCONFIGURED";
  provider: AIProvider;
  feature: string;
  remediation: string;
  docsUrl: string;
}

const toBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readModel = (value: string | undefined): AIConfig["openai"]["model"] => {
  const model = value || "gpt-4";
  return AIConfigSchema.shape.openai.shape.model.parse(model);
};

export const defaultAIConfig: AIConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: readModel(process.env.OPENAI_MODEL),
    maxTokens: toNumber(process.env.OPENAI_MAX_TOKENS, 2000),
    temperature: toNumber(process.env.OPENAI_TEMPERATURE, 0.7),
  },
  googleCloud: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    apiKey: process.env.GOOGLE_VISION_API_KEY,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "us-east-1",
    indexName: process.env.PINECONE_INDEX_NAME || "aura-glass-embeddings",
  },
  removeBg: {
    apiKey: process.env.REMOVEBG_API_KEY || "",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    ttl: toNumber(process.env.REDIS_TTL_SECONDS, 3600),
  },
  rateLimit: {
    windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    maxRequests: toNumber(process.env.AI_RATE_LIMIT_MAX_REQUESTS, 50),
  },
  costOptimization: {
    enableCaching: toBoolean(process.env.ENABLE_AI_CACHING, true),
    enableBatching: toBoolean(process.env.ENABLE_AI_BATCHING, true),
    maxCostPerRequest: toNumber(process.env.MAX_COST_PER_REQUEST, 0.1),
    useCheaperModelsThreshold: toNumber(
      process.env.USE_CHEAPER_MODELS_THRESHOLD,
      0.5
    ),
  },
};

export class ProviderUnconfiguredError extends Error {
  readonly code = "AURA_PROVIDER_UNCONFIGURED";
  readonly statusCode = 503;
  readonly remediation: string;
  readonly docsUrl = "https://auraglass.auraone.ai/docs/ai-providers";

  constructor(
    readonly provider: AIProvider,
    readonly feature: string,
    remediation?: string
  ) {
    super(`${provider} is not configured for ${feature}`);
    this.name = "ProviderUnconfiguredError";
    this.remediation =
      remediation ||
      `Configure the required ${provider} credentials or disable ${feature}.`;
  }

  toJSON(): ProviderUnconfiguredPayload {
    return {
      error: "Provider not configured",
      message: this.message,
      code: this.code,
      provider: this.provider,
      feature: this.feature,
      remediation: this.remediation,
      docsUrl: this.docsUrl,
    };
  }
}

export function createAIConfig(env: NodeJS.ProcessEnv = process.env): AIConfig {
  const enableCaching = toBoolean(env.ENABLE_AI_CACHING, true);

  if (
    env.NODE_ENV === "production" &&
    enableCaching &&
    !env.REDIS_URL?.trim()
  ) {
    throw new ProviderUnconfiguredError(
      "redis",
      "AI caching",
      "Set REDIS_URL for hosted production caching or set ENABLE_AI_CACHING=false."
    );
  }

  return AIConfigSchema.parse({
    openai: {
      apiKey: env.OPENAI_API_KEY || "",
      model: env.OPENAI_MODEL || "gpt-4",
      maxTokens: toNumber(env.OPENAI_MAX_TOKENS, 2000),
      temperature: toNumber(env.OPENAI_TEMPERATURE, 0.7),
    },
    googleCloud: {
      projectId: env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
      apiKey: env.GOOGLE_VISION_API_KEY,
    },
    pinecone: {
      apiKey: env.PINECONE_API_KEY || "",
      environment: env.PINECONE_ENVIRONMENT || "us-east-1",
      indexName: env.PINECONE_INDEX_NAME || "aura-glass-embeddings",
    },
    removeBg: {
      apiKey: env.REMOVEBG_API_KEY || "",
    },
    redis: {
      url: env.REDIS_URL || "redis://localhost:6379",
      ttl: toNumber(env.REDIS_TTL_SECONDS, 3600),
    },
    rateLimit: {
      windowMs: toNumber(env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
      maxRequests: toNumber(env.AI_RATE_LIMIT_MAX_REQUESTS, 50),
    },
    costOptimization: {
      enableCaching,
      enableBatching: toBoolean(env.ENABLE_AI_BATCHING, true),
      maxCostPerRequest: toNumber(env.MAX_COST_PER_REQUEST, 0.1),
      useCheaperModelsThreshold: toNumber(
        env.USE_CHEAPER_MODELS_THRESHOLD,
        0.5
      ),
    },
  });
}

export function createRuntimeFeatureFlags(
  env: NodeJS.ProcessEnv = process.env
): RuntimeFeatureFlags {
  return {
    smartForms: toBoolean(env.ENABLE_SMART_FORMS, true),
    semanticSearch: toBoolean(env.ENABLE_SEMANTIC_SEARCH, false),
    visionAPI: toBoolean(env.ENABLE_VISION_API, false),
    backgroundRemoval: toBoolean(env.ENABLE_BACKGROUND_REMOVAL, false),
    aiCaching: toBoolean(env.ENABLE_AI_CACHING, true),
    aiBatching: toBoolean(env.ENABLE_AI_BATCHING, true),
    collaboration: toBoolean(env.ENABLE_COLLABORATION, false),
  };
}

export function isProviderConfigured(
  config: AIConfig,
  provider: AIProvider
): boolean {
  switch (provider) {
    case "openai":
      return config.openai.apiKey.trim().length > 0;
    case "pinecone":
      return (
        config.pinecone.apiKey.trim().length > 0 &&
        config.pinecone.indexName.trim().length > 0
      );
    case "googleVision":
      return Boolean(
        config.googleCloud.apiKey ||
          config.googleCloud.keyFilename ||
          config.googleCloud.projectId
      );
    case "removeBg":
      return config.removeBg.apiKey.trim().length > 0;
    case "redis":
      return config.redis.url.trim().length > 0;
  }
}

export function assertProviderConfigured(
  config: AIConfig,
  provider: AIProvider,
  feature: string,
  remediation?: string
): void {
  if (!isProviderConfigured(config, provider)) {
    throw new ProviderUnconfiguredError(provider, feature, remediation);
  }
}

export function validateAIConfig(config: unknown): AIConfig {
  return AIConfigSchema.parse(config);
}
