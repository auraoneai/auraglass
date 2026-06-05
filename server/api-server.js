const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.API_SERVER_PORT || 3002;
const isProduction = process.env.NODE_ENV === 'production';
const enableDemoApi = process.env.ENABLE_DEMO_API === 'true' && !isProduction;
const enableDemoAuth = process.env.ENABLE_DEMO_AUTH === 'true' && !isProduction;

const createDemoToken = (prefix) => `${prefix}_${crypto.randomBytes(32).toString('base64url')}`;
const demoApiDisabled = (res, feature) =>
  res.status(501).json({
    error: 'Demo API is disabled',
    code: 'AURA_DEMO_API_DISABLED',
    feature,
    remediation:
      'Use the compiled hosted API at dist/server/server/index.js, or set ENABLE_DEMO_API=true outside production for local demos only.',
  });

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      pinecone: !!process.env.PINECONE_API_KEY,
      vision: !!process.env.GOOGLE_VISION_API_KEY,
      redis: !!process.env.REDIS_URL,
    },
  });
});

// AI Routes
const aiRouter = express.Router();

// Form generation endpoint
aiRouter.post('/generate-form', async (req, res) => {
  try {
    const { context, existingFields } = req.body;

    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }

    void existingFields;
    return demoApiDisabled(res, 'generate-form');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Semantic search endpoint
aiRouter.post('/search', async (req, res) => {
  try {
    const { query, options } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    void options;
    return demoApiDisabled(res, 'search');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image analysis endpoint
aiRouter.post('/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    return demoApiDisabled(res, 'analyze-image');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Index documents for search
aiRouter.post('/index-documents', async (req, res) => {
  try {
    const { documents } = req.body;

    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'Documents array is required' });
    }

    return demoApiDisabled(res, 'index-documents');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/ai', aiRouter);

// Authentication routes
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    if (!enableDemoAuth) {
      return res.status(501).json({
        error: 'Demo authentication is disabled. Set ENABLE_DEMO_AUTH=true only for local demos.',
      });
    }

    const { email } = req.body;

    const token = createDemoToken('demo_access');
    const refreshToken = createDemoToken('demo_refresh');

    res.json({
      token,
      refreshToken,
      user: {
        id: 'user-123',
        email,
        role: 'user',
        permissions: ['ai:use_openai', 'collab:join_room'],
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

authRouter.post('/refresh', async (req, res) => {
  try {
    if (!enableDemoAuth) {
      return res.status(501).json({
        error: 'Demo authentication is disabled. Set ENABLE_DEMO_AUTH=true only for local demos.',
      });
    }

    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }

    const newToken = createDemoToken('demo_access');

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code,
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    process.exit(0);
  });
});
