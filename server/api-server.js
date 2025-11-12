const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

// Import services (these would be transpiled from TypeScript in production)
// For now, we'll create simple wrappers
const PORT = process.env.API_PORT || 3002;

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

    // In production, this would call the OpenAIService
    // For now, return a mock response
    const fields = [
      {
        fieldName: 'name',
        fieldType: 'text',
        label: 'Full Name',
        placeholder: 'Enter your name',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
        },
      },
      {
        fieldName: 'email',
        fieldType: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
      },
    ];

    res.json({ fields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Semantic search endpoint
aiRouter.post('/search', async (req, res) => {
  try {
    const { query, options } = req.body;

    // Mock search results
    const results = [
      {
        id: '1',
        content: 'Sample search result matching your query',
        score: 0.95,
        highlights: ['matching your query'],
      },
    ];

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image analysis endpoint
aiRouter.post('/analyze-image', async (req, res) => {
  try {
    const { image } = req.body; // Base64 encoded image

    // Mock analysis result
    const analysis = {
      faces: [],
      objects: [{ name: 'object', confidence: 0.9 }],
      text: { text: 'Sample text', confidence: 0.8 },
      labels: [{ description: 'image', score: 0.95 }],
      safeSearch: {
        adult: 'UNLIKELY',
        violence: 'VERY_UNLIKELY',
        medical: 'UNLIKELY',
      },
    };

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Index documents for search
aiRouter.post('/index-documents', async (req, res) => {
  try {
    const { documents } = req.body;

    res.json({
      success: true,
      indexed: documents.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/ai', aiRouter);

// Authentication routes
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mock authentication
    const token = 'mock-jwt-token';
    const refreshToken = 'mock-refresh-token';

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
    const { refreshToken } = req.body;

    const newToken = 'new-mock-jwt-token';

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