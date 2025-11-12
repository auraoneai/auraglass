import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

// Import AI services
import { OpenAIService } from '../src/services/ai/openai-service';
import { SemanticSearchService } from '../src/services/ai/semantic-search-service';
import { VisionService } from '../src/services/ai/vision-service';
import { AuthService } from '../src/services/auth/auth-service';
import { defaultAIConfig, createAIConfig } from '../src/services/ai/config';

dotenv.config();

// Initialize Sentry if DSN is provided
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

const app = express();
const httpServer = createServer(app);
const PORT = parseInt(process.env.API_SERVER_PORT || '3001', 10);

// Initialize services
let openAIService: OpenAIService;
let searchService: SemanticSearchService;
let visionService: VisionService;
let authService: AuthService;

async function initializeServices() {
  try {
    const config = createAIConfig();

    openAIService = new OpenAIService(config);
    searchService = new SemanticSearchService(config);
    visionService = new VisionService(config);
    authService = new AuthService();

    // Initialize services that need async setup
    if (process.env.ENABLE_SEMANTIC_SEARCH === 'true') {
      await searchService.initialize();
      console.log('✓ Semantic search service initialized');
    }

    console.log('✓ All AI services initialized successfully');
  } catch (error) {
    console.error('✗ Failed to initialize services:', error);
    throw error;
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// CORS configuration
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      pinecone: !!process.env.PINECONE_API_KEY,
      googleVision: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      removeBg: !!process.env.REMOVEBG_API_KEY,
      redis: !!process.env.REDIS_URL,
    },
    features: {
      semanticSearch: process.env.ENABLE_SEMANTIC_SEARCH === 'true',
      visionAPI: process.env.ENABLE_VISION_API === 'true',
      collaboration: process.env.ENABLE_COLLABORATION === 'true',
      smartForms: process.env.ENABLE_SMART_FORMS === 'true',
    },
  };

  res.json(health);
});

// Authentication middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const verified = await authService.verifyToken(token);
    if (!verified) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ============================================
// AI Routes
// ============================================

const aiRouter = express.Router();

// Apply authentication to all AI routes
aiRouter.use(authenticateToken);

// Generate smart form fields
aiRouter.post('/generate-form', async (req: Request, res: Response) => {
  try {
    const { context, existingFields = [] } = req.body;

    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }

    const fields = await openAIService.generateFormFieldSuggestions(context, existingFields);

    Sentry.addBreadcrumb({
      category: 'ai',
      message: 'Generated form fields',
      level: 'info',
      data: { context, fieldCount: fields.length },
    });

    res.json({ fields, cached: false });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Failed to generate form fields',
      message: (error as Error).message
    });
  }
});

// Semantic search
aiRouter.post('/search', async (req: Request, res: Response) => {
  try {
    const { query, options = {} } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Enhance query with OpenAI
    const { enhancedQuery, intent } = await openAIService.generateSemanticSearchQuery(query);

    // Perform hybrid search
    const results = await searchService.hybridSearch(enhancedQuery, {
      semanticWeight: intent === 'search' ? 0.8 : 0.6,
      keywordWeight: intent === 'navigation' ? 0.4 : 0.2,
      topK: options.limit || 10,
      ...options,
    });

    res.json({
      results,
      enhancedQuery,
      intent,
      totalResults: results.length
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Search failed',
      message: (error as Error).message
    });
  }
});

// Index documents for search
aiRouter.post('/index-documents', async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;

    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'Documents array is required' });
    }

    await searchService.indexDocuments(documents);

    res.json({
      success: true,
      indexed: documents.length,
      message: `Successfully indexed ${documents.length} documents`,
    });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Failed to index documents',
      message: (error as Error).message
    });
  }
});

// Analyze image
aiRouter.post('/analyze-image', async (req: Request, res: Response) => {
  try {
    const { image, analysisTypes = ['all'] } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const includeAll = analysisTypes.includes('all');
    const results: any = {};

    // Perform requested analyses
    if (includeAll || analysisTypes.includes('faces')) {
      results.faces = await visionService.detectFaces(imageBuffer);
    }

    if (includeAll || analysisTypes.includes('objects')) {
      results.objects = await visionService.detectObjects(imageBuffer);
    }

    if (includeAll || analysisTypes.includes('text')) {
      results.text = await visionService.extractText(imageBuffer);
    }

    if (includeAll || analysisTypes.includes('labels')) {
      const analysis = await visionService.analyzeImage(imageBuffer);
      results.labels = analysis.labels;
      results.safeSearch = analysis.safeSearch;
      results.colors = analysis.colors;
    }

    Sentry.addBreadcrumb({
      category: 'vision',
      message: 'Analyzed image',
      level: 'info',
      data: {
        analysisTypes,
        faceCount: results.faces?.length || 0,
        objectCount: results.objects?.length || 0,
      },
    });

    res.json({ analysis: results });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Image analysis failed',
      message: (error as Error).message
    });
  }
});

// Remove image background
aiRouter.post('/remove-background', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const processedBuffer = await visionService.removeBackground(imageBuffer);

    // Convert buffer back to base64
    const base64Image = processedBuffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;

    res.json({ image: dataUri });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Background removal failed',
      message: (error as Error).message
    });
  }
});

// Generate content summary
aiRouter.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { content, maxLength = 200 } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const summary = await openAIService.generateContentSummary(content, maxLength);

    res.json({ summary });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Summarization failed',
      message: (error as Error).message
    });
  }
});

app.use('/api/ai', aiRouter);

// ============================================
// Authentication Routes
// ============================================

const authRouter = express.Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.login(email, password);

    res.json(result);
  } catch (error) {
    Sentry.captureException(error);
    res.status(401).json({
      error: 'Authentication failed',
      message: (error as Error).message
    });
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.register(email, password, name);

    res.json(result);
  } catch (error) {
    Sentry.captureException(error);
    res.status(400).json({
      error: 'Registration failed',
      message: (error as Error).message
    });
  }
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const result = await authService.refreshToken(refreshToken);

    res.json(result);
  } catch (error) {
    Sentry.captureException(error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: (error as Error).message
    });
  }
});

authRouter.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      await authService.revokeToken(token);
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({
      error: 'Logout failed',
      message: (error as Error).message
    });
  }
});

app.use('/api/auth', authRouter);

// ============================================
// Error Handling
// ============================================

// Sentry error handler (must be before other error handlers)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ============================================
// Server Startup
// ============================================

async function startServer() {
  try {
    console.log('Initializing AuraGlass AI Infrastructure...\n');

    // Initialize services
    await initializeServices();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log('\n┌─────────────────────────────────────────────┐');
      console.log('│  🚀 AuraGlass API Server Started!          │');
      console.log('└─────────────────────────────────────────────┘\n');
      console.log(`📡 Server:        http://localhost:${PORT}`);
      console.log(`🏥 Health check:  http://localhost:${PORT}/health`);
      console.log(`🌍 Environment:   ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n✓ Ready to accept requests\n`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');

      httpServer.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('✗ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
