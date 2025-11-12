import { z } from 'zod';

export const AIConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1),
    model: z.enum(['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']).default('gpt-4'),
    maxTokens: z.number().default(2000),
    temperature: z.number().min(0).max(2).default(0.7),
  }),
  googleCloud: z.object({
    projectId: z.string().optional(),
    keyFilename: z.string().optional(),
    apiKey: z.string().optional(),
  }),
  pinecone: z.object({
    apiKey: z.string().min(1),
    environment: z.string().min(1),
    indexName: z.string().default('aura-glass-embeddings'),
  }),
  removeBg: z.object({
    apiKey: z.string().min(1),
  }),
  redis: z.object({
    url: z.string().url().default('redis://localhost:6379'),
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

export const defaultAIConfig: AIConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  },
  googleCloud: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    apiKey: process.env.GOOGLE_VISION_API_KEY,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
    indexName: 'aura-glass-embeddings',
  },
  removeBg: {
    apiKey: process.env.REMOVEBG_API_KEY || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 3600,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 50,
  },
  costOptimization: {
    enableCaching: true,
    enableBatching: true,
    maxCostPerRequest: 0.1,
    useCheaperModelsThreshold: 0.5,
  },
};

export function validateAIConfig(config: unknown): AIConfig {
  return AIConfigSchema.parse(config);
}