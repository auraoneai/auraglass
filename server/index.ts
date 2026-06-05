import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer, Server as HttpServer } from 'http';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

import { OpenAIService } from '../src/services/ai/openai-service';
import { VisionService } from '../src/services/ai/vision-service';
import { AuthError, AuthService } from '../src/services/auth/auth-service';
import {
  AIConfig,
  ProviderUnconfiguredError,
  RuntimeFeatureFlags,
  assertProviderConfigured,
  createAIConfig,
  createRuntimeFeatureFlags,
  isProviderConfigured,
} from '../src/services/ai/config';

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

const API_PORT = Number.parseInt(process.env.API_SERVER_PORT || '3002', 10);
const isDevelopment = process.env.NODE_ENV === 'development';
const providerUnconfiguredCode = 'AURA_PROVIDER_UNCONFIGURED';
const providerUnconfiguredError = 'Provider not configured';

export const app = express();
export const httpServer = createServer(app);

let runtimeConfig: AIConfig = createAIConfig();
let runtimeFeatures: RuntimeFeatureFlags = createRuntimeFeatureFlags();
let openAIService: OpenAIService | null = null;
let searchService: any | null = null;
let visionService: VisionService | null = null;
let authService: AuthService | null = null;

const providerStatus = () => ({
  openai: isProviderConfigured(runtimeConfig, 'openai'),
  pinecone: isProviderConfigured(runtimeConfig, 'pinecone'),
  googleVision: isProviderConfigured(runtimeConfig, 'googleVision'),
  removeBg: isProviderConfigured(runtimeConfig, 'removeBg'),
  redis: isProviderConfigured(runtimeConfig, 'redis'),
});

const readinessChecks = () => {
  const providers = providerStatus();
  const jwtConfigured =
    Boolean(process.env.JWT_SECRET) || process.env.NODE_ENV === 'test';

  return [
    {
      name: 'jwt',
      ok: jwtConfigured,
      remediation: 'Set JWT_SECRET for hosted API authentication.',
    },
    {
      name: 'smartForms',
      ok: !runtimeFeatures.smartForms || providers.openai,
      remediation:
        'Set OPENAI_API_KEY or set ENABLE_SMART_FORMS=false before deployment.',
    },
    {
      name: 'semanticSearch',
      ok:
        !runtimeFeatures.semanticSearch ||
        (providers.openai && providers.pinecone),
      remediation:
        'Set OPENAI_API_KEY and PINECONE_API_KEY, or set ENABLE_SEMANTIC_SEARCH=false.',
    },
    {
      name: 'visionAPI',
      ok: !runtimeFeatures.visionAPI || providers.googleVision,
      remediation:
        'Set GOOGLE_VISION_API_KEY or Google Cloud credentials, or set ENABLE_VISION_API=false.',
    },
    {
      name: 'backgroundRemoval',
      ok: !runtimeFeatures.backgroundRemoval || providers.removeBg,
      remediation:
        'Set REMOVEBG_API_KEY or set ENABLE_BACKGROUND_REMOVAL=false.',
    },
    {
      name: 'redis',
      ok: !runtimeFeatures.aiCaching || providers.redis,
      remediation:
        'Set REDIS_URL for hosted AI caching or set ENABLE_AI_CACHING=false.',
    },
  ];
};

async function ensureOpenAIService(feature: string): Promise<OpenAIService> {
  assertProviderConfigured(
    runtimeConfig,
    'openai',
    feature,
    `Set OPENAI_API_KEY before using ${feature}.`
  );

  if (!openAIService) {
    openAIService = new OpenAIService(runtimeConfig);
  }

  return openAIService;
}

async function ensureSemanticSearchService(): Promise<any> {
  if (!runtimeFeatures.semanticSearch) {
    throw new ProviderUnconfiguredError(
      'pinecone',
      'semantic search',
      'Set ENABLE_SEMANTIC_SEARCH=true and configure OpenAI/Pinecone credentials before using semantic search.'
    );
  }

  await ensureOpenAIService('semantic search query enhancement');
  assertProviderConfigured(
    runtimeConfig,
    'pinecone',
    'semantic search',
    'Set PINECONE_API_KEY and PINECONE_INDEX_NAME before using semantic search.'
  );

  if (!searchService) {
    const { SemanticSearchService } = await import(
      '../src/services/ai/semantic-search-service'
    );
    searchService = new SemanticSearchService(runtimeConfig);
    await searchService.initialize();
  }

  return searchService;
}

async function ensureVisionService(feature: string): Promise<VisionService> {
  if (!visionService) {
    visionService = new VisionService(runtimeConfig);
  }

  if (feature === 'image analysis') {
    if (!runtimeFeatures.visionAPI) {
      throw new ProviderUnconfiguredError(
        'googleVision',
        feature,
        'Set ENABLE_VISION_API=true and configure Google Vision credentials before using image analysis.'
      );
    }
    assertProviderConfigured(
      runtimeConfig,
      'googleVision',
      feature,
      'Set GOOGLE_VISION_API_KEY or Google Cloud credentials before using image analysis.'
    );
  }

  if (feature === 'background removal') {
    if (!runtimeFeatures.backgroundRemoval) {
      throw new ProviderUnconfiguredError(
        'removeBg',
        feature,
        'Set ENABLE_BACKGROUND_REMOVAL=true and REMOVEBG_API_KEY before using background removal.'
      );
    }
    assertProviderConfigured(
      runtimeConfig,
      'removeBg',
      feature,
      'Set REMOVEBG_API_KEY before using background removal.'
    );
  }

  return visionService;
}

async function initializeServices(): Promise<void> {
  runtimeConfig = createAIConfig();
  runtimeFeatures = createRuntimeFeatureFlags();
  authService = new AuthService();

  if (isProviderConfigured(runtimeConfig, 'openai')) {
    openAIService = new OpenAIService(runtimeConfig);
  }

  if (
    isProviderConfigured(runtimeConfig, 'googleVision') ||
    isProviderConfigured(runtimeConfig, 'removeBg')
  ) {
    visionService = new VisionService(runtimeConfig);
  }

  if (
    runtimeFeatures.semanticSearch &&
    isProviderConfigured(runtimeConfig, 'openai') &&
    isProviderConfigured(runtimeConfig, 'pinecone')
  ) {
    await ensureSemanticSearchService();
  }
}

function handleRouteError(
  error: unknown,
  res: Response,
  fallbackMessage = 'Request failed'
): void {
  if (error instanceof ProviderUnconfiguredError) {
    // Provider-unconfigured responses use "Provider not configured",
    // AURA_PROVIDER_UNCONFIGURED, and HTTP 503.
    void providerUnconfiguredCode;
    void providerUnconfiguredError;
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  if (error instanceof AuthError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  Sentry.captureException(error);

  res.status(500).json({
    error: fallbackMessage,
    message: isDevelopment ? (error as Error).message : undefined,
  });
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);
app.use(compression());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  '/api/',
  rateLimit({
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: providerStatus(),
    features: runtimeFeatures,
  });
});

app.get('/ready', (_req: Request, res: Response) => {
  const checks = readinessChecks();
  const ready = checks.every((check) => check.ok);

  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks,
  });
});

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!authService) {
      throw new AuthError('Authentication service is not initialized', 'AUTH_NOT_READY', 503);
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    (req as any).user = authService.verifyToken(token);
    next();
  } catch (error) {
    handleRouteError(error, res, 'Invalid token');
  }
};

const aiRouter = express.Router();
aiRouter.use(authenticateToken);

aiRouter.post('/generate-form', async (req: Request, res: Response) => {
  try {
    if (!runtimeFeatures.smartForms) {
      throw new ProviderUnconfiguredError(
        'openai',
        'smart form generation',
        'Set ENABLE_SMART_FORMS=true and OPENAI_API_KEY before using smart form generation.'
      );
    }

    const { context, existingFields = [] } = req.body;
    if (!context) {
      res.status(400).json({ error: 'Context is required' });
      return;
    }

    const service = await ensureOpenAIService('smart form generation');
    const result = await service.generateFormFieldSuggestionsWithMetadata(
      context,
      existingFields
    );

    res.json({
      fields: result.fields,
      cached: result.cached,
      usage: result.usage,
    });
  } catch (error) {
    handleRouteError(error, res, 'Failed to generate form fields');
  }
});

aiRouter.post('/search', async (req: Request, res: Response) => {
  try {
    const { query, options = {} } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const openAI = await ensureOpenAIService('semantic search');
    const search = await ensureSemanticSearchService();
    const { enhancedQuery, intent } =
      await openAI.generateSemanticSearchQuery(query);

    const results = await search.hybridSearch(enhancedQuery, {
      semanticWeight: intent === 'search' ? 0.8 : 0.6,
      keywordWeight: intent === 'navigation' ? 0.4 : 0.2,
      topK: options.limit || 10,
      ...options,
    });

    res.json({
      results,
      enhancedQuery,
      intent,
      totalResults: results.length,
    });
  } catch (error) {
    handleRouteError(error, res, 'Search failed');
  }
});

aiRouter.post('/index-documents', async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;
    if (!Array.isArray(documents) || documents.length === 0) {
      res.status(400).json({ error: 'Documents array is required' });
      return;
    }

    const search = await ensureSemanticSearchService();
    await search.indexDocuments(documents);

    res.json({
      success: true,
      indexed: documents.length,
      message: `Successfully indexed ${documents.length} documents`,
    });
  } catch (error) {
    handleRouteError(error, res, 'Failed to index documents');
  }
});

aiRouter.post('/analyze-image', async (req: Request, res: Response) => {
  try {
    const { image, analysisTypes = ['all'] } = req.body;
    if (!image) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    const service = await ensureVisionService('image analysis');
    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    const includeAll = analysisTypes.includes('all');
    const analysis: Record<string, unknown> = {};

    if (includeAll || analysisTypes.includes('faces')) {
      analysis.faces = await service.detectFaces(imageBuffer);
    }

    if (includeAll || analysisTypes.includes('objects')) {
      analysis.objects = await service.detectObjects(imageBuffer);
    }

    if (includeAll || analysisTypes.includes('text')) {
      analysis.text = await service.extractText(imageBuffer);
    }

    if (includeAll || analysisTypes.includes('labels')) {
      const result = await service.analyzeImage(imageBuffer);
      analysis.labels = result.labels;
      analysis.safeSearch = result.safeSearch;
      analysis.colors = result.colors;
    }

    res.json({ analysis });
  } catch (error) {
    handleRouteError(error, res, 'Image analysis failed');
  }
});

aiRouter.post('/remove-background', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    const service = await ensureVisionService('background removal');
    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    const processedBuffer = await service.removeBackground(imageBuffer);
    const dataUri = `data:image/png;base64,${processedBuffer.toString('base64')}`;

    res.json({ image: dataUri });
  } catch (error) {
    handleRouteError(error, res, 'Background removal failed');
  }
});

aiRouter.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { content, maxLength = 200 } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const service = await ensureOpenAIService('content summarization');
    const summary = await service.generateContentSummary(content, maxLength);

    res.json({ summary });
  } catch (error) {
    handleRouteError(error, res, 'Summarization failed');
  }
});

app.use('/api/ai', aiRouter);

const authRouter = express.Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    if (!authService) {
      throw new AuthError('Authentication service is not initialized', 'AUTH_NOT_READY', 503);
    }

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    res.json(await authService.login(email, password));
  } catch (error) {
    handleRouteError(error, res, 'Authentication failed');
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    if (!authService) {
      throw new AuthError('Authentication service is not initialized', 'AUTH_NOT_READY', 503);
    }

    const { email, password, name } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    res.json(await authService.register(email, password, name));
  } catch (error) {
    handleRouteError(error, res, 'Registration failed');
  }
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    if (!authService) {
      throw new AuthError('Authentication service is not initialized', 'AUTH_NOT_READY', 503);
    }

    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    res.json(await authService.refreshToken(refreshToken));
  } catch (error) {
    handleRouteError(error, res, 'Token refresh failed');
  }
});

authRouter.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice('Bearer '.length)
      : undefined;

    if (authService && token) {
      await authService.revokeToken(token);
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    handleRouteError(error, res, 'Logout failed');
  }
});

app.use('/api/auth', authRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  Sentry.captureException(err);
  console.error('Server error:', err);

  res.status(500).json({
    error: 'Internal server error',
    message: isDevelopment ? err.message : undefined,
    stack: isDevelopment ? err.stack : undefined,
  });
});

export async function startServer(port = API_PORT): Promise<HttpServer> {
  await initializeServices();

  return new Promise((resolve) => {
    httpServer.listen(port, () => {
      console.log('AuraGlass API server started');
      console.log(`Server: http://localhost:${port}`);
      console.log(`Health: http://localhost:${port}/health`);
      console.log(`Ready: http://localhost:${port}/ready`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      resolve(httpServer);
    });
  });
}

async function shutdown(): Promise<void> {
  console.log('Shutting down AuraGlass API server');
  httpServer.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start AuraGlass API server:', error);
    process.exit(1);
  });

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
