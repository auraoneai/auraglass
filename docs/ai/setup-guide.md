# AuraGlass AI Infrastructure Setup Guide
Complete guide to setting up production-ready AI features in AuraGlass.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [API Key Setup](#api-key-setup)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Servers](#running-the-servers)
7. [Using AI in Components](#using-ai-in-components)
8. [Troubleshooting](#troubleshooting)
9. [Cost Optimization](#cost-optimization)

## 🎯 Quick Start

**Get running in 5 minutes:**

```bash
# 1. Clone and install
git clone https://github.com/VeerOneGPT/auraglass.git
cd auraglass
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your API keys (see API Key Setup below)

# 3. Start Redis
docker run -d -p 6379:6379 redis:alpine

# 4. Build and start servers
npm run build:server
npm run server:all

# 5. Start development
npm run dev
```

Open http://localhost:3000/ai-demo to test!

## 📦 Prerequisites

### Required Software

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| **Node.js** | 18.0.0+ | Runtime environment |
| **npm** | 9.0.0+ | Package manager |
| **Redis** | 6.0.0+ | Caching layer |

### Optional Software

| Software | Purpose |
|----------|---------|
| **Docker** | Easiest way to run Redis |
| **PM2** | Production process management |

### Installing Prerequisites

**macOS:**
```bash
# Node.js (via Homebrew)
brew install node

# Redis
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Redis
sudo apt-get install redis-server
sudo service redis-server start
```

**Windows:**
```bash
# Node.js - Download from https://nodejs.org

# Redis (via Docker)
docker run -d -p 6379:6379 redis:alpine
```

**Docker (all platforms):**
```bash
# Redis only
docker run -d -p 6379:6379 --name auraglass-redis redis:alpine

# Full stack with Docker Compose
docker-compose up -d
```

## 🔑 API Key Setup

### 1. OpenAI (Required for Smart Forms & Search)

**Cost:** $5 free credit for new users, then ~$0.001-$0.02 per request

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy key (starts with `sk-...`)
4. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Free tier limitations:**
- $5 free credit for 3 months
- ~500-5000 requests depending on complexity
- After credit expires: Pay-as-you-go ($0.0005-$0.03 per 1K tokens)

### 2. Pinecone (Required for Semantic Search)

**Cost:** Free tier includes 100K vectors + 5M queries/month

1. Go to https://app.pinecone.io/
2. Sign up for free account
3. Go to "API Keys" tab
4. Copy your API key
5. Add to `.env`:
   ```
   PINECONE_API_KEY=your-pinecone-key-here
   PINECONE_ENVIRONMENT=us-east-1-aws
   PINECONE_INDEX_NAME=auraglass-search
   ```

**Free tier limitations:**
- 100,000 vectors
- 5 million queries per month
- Single index
- After limits: $0.096/hour for pod-based indexes

### 3. Google Cloud Vision (Required for Image Analysis)

**Cost:** First 1,000 images/month free, then $1.50 per 1,000

1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "Cloud Vision API"
4. Go to "Credentials" > "Create Credentials" > "Service Account"
5. Download JSON key file
6. Save as `config/google-cloud-key.json` in your project
7. Add to `.env`:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
   ```

**Free tier:**
- 1,000 units/month free (1 unit = 1 image)
- After limit: $1.50 per 1,000 units

### 4. Remove.bg (Optional - for Background Removal)

**Cost:** 50 free images/month, then $0.20 per image

1. Go to https://www.remove.bg/api
2. Sign up for free account
3. Go to API keys
4. Copy key
5. Add to `.env`:
   ```
   REMOVEBG_API_KEY=your-removebg-key-here
   ```

**Free tier:**
- 50 API calls per month
- After limit: $0.20 per image

### 5. Optional: Sentry (for Error Tracking)

1. Go to https://sentry.io/
2. Create new project
3. Copy DSN
4. Add to `.env`:
   ```
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

## 📥 Installation

```bash
# Install dependencies
npm install

# Or with specific package manager
npm install
yarn install
```

**Additional backend dependencies (installed automatically):**
```json
{
  "openai": "^4.28.0",
  "@pinecone-database/pinecone": "^2.0.0",
  "@google-cloud/vision": "^4.0.0",
  "redis": "^4.6.0",
  "express": "^4.18.0",
  "ws": "^8.16.0",
  "jsonwebtoken": "^9.0.0",
  "@sentry/node": "^7.100.0"
}
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**Minimal configuration (for local development):**

```env
# Required
OPENAI_API_KEY=sk-your-key
PINECONE_API_KEY=your-key
REDIS_URL=redis://localhost:6379

# Optional (but recommended)
GOOGLE_CLOUD_PROJECT_ID=your-project
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
REMOVEBG_API_KEY=your-key

# Server config
NODE_ENV=development
API_SERVER_PORT=3001
WEBSOCKET_SERVER_PORT=3002
CLIENT_URL=http://localhost:3000

# Security
JWT_SECRET=change-this-to-random-secret-in-production

# Cost optimization
ENABLE_AI_CACHING=true
USE_CHEAPER_MODEL_FOR_SIMPLE_TASKS=true
```

### Google Cloud Key Setup

Create `config/` directory and add your service account key:

```bash
mkdir -p config
# Download your google-cloud-key.json and place it in config/
```

**Security Note:** Add `config/*.json` to `.gitignore`:

```bash
echo "config/*.json" >> .gitignore
```

## 🚀 Running the Servers

### Development Mode

**Start all services:**
```bash
npm run server:all
```

This starts:
- API Server on http://localhost:3001
- WebSocket Server on http://localhost:3002

**Start servers individually:**
```bash
# API server only
npm run server:api

# WebSocket server only
npm run server:websocket
```

**With hot reload (using nodemon):**
```bash
npm install -g nodemon
nodemon server/index.ts
```

### Production Mode

**Using PM2 (recommended):**
```bash
# Install PM2 globally
npm install -g pm2

# Start all services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Monitor
pm2 monit

# Stop all
pm2 stop all

# Restart
pm2 restart all
```

**Using Docker:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Verify Server is Running

**Health check:**
```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "services": {
    "openai": true,
    "pinecone": true,
    "googleVision": true,
    "removeBg": true,
    "redis": true
  },
  "features": {
    "semanticSearch": true,
    "visionAPI": true,
    "collaboration": true,
    "smartForms": true
  }
}
```

## 💻 Using AI in Components

### Basic Usage

```tsx
import { aiClient } from '@/lib/ai-client';
import { useState } from 'react';

function MyComponent() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateForm = async () => {
    setLoading(true);
    try {
      const fields = await aiClient.generateFormFields('user registration form');
      setFields(fields);
    } catch (error) {
      console.error('Failed to generate form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={generateForm} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Smart Form'}
    </button>
  );
}
```

### With Authentication

```tsx
import { aiClient } from '@/lib/ai-client';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Login user
    const login = async () => {
      const { token } = await aiClient.login('user@example.com', 'password');
      // Token is automatically stored in client
    };
    login();
  }, []);

  // Now all AI requests will be authenticated
}
```

### Semantic Search Example

```tsx
import { aiClient } from '@/lib/ai-client';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const { results, enhancedQuery, intent } = await aiClient.search(query);
    console.log('AI enhanced query:', enhancedQuery);
    console.log('Detected intent:', intent);
    setResults(results);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anything..."
      />
      <button onClick={handleSearch}>Search</button>
      {results.map((result) => (
        <div key={result.id}>
          <h3>{result.content}</h3>
          <p>Score: {result.score.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};
```

### Image Analysis Example

```tsx
import { aiClient } from '@/lib/ai-client';

const ImageAnalyzer = () => {
  const analyzeImage = async (file: File) => {
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;

      // Analyze image
      const analysis = await aiClient.analyzeImage(base64, ['faces', 'objects', 'labels']);

      console.log('Faces detected:', analysis.faces?.length);
      console.log('Objects:', analysis.objects);
      console.log('Labels:', analysis.labels);
    };
    reader.readAsDataURL(file);
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) analyzeImage(file);
      }}
    />
  );
};
```

### Complete Example Component

See `src/components/ai/AIDemo.tsx` for a complete working example with all features.

## 🐛 Troubleshooting

### Common Issues

**❌ "Connection refused" on port 3001**

```bash
# Check if API server is running
curl http://localhost:3001/health

# Start the server
npm run server:api
```

**❌ "Redis connection failed"**

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis
# macOS:
brew services start redis
# Ubuntu:
sudo service redis-server start
# Docker:
docker run -d -p 6379:6379 redis:alpine
```

**❌ "OpenAI API key not found"**

```bash
# Verify .env file exists
cat .env | grep OPENAI_API_KEY

# Make sure it starts with sk-
# Make sure there are no quotes around the value
```

**❌ "Google Vision API authentication failed"**

```bash
# Check credentials file exists
ls -la config/google-cloud-key.json

# Verify path in .env
cat .env | grep GOOGLE_APPLICATION_CREDENTIALS

# Test credentials
export GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
node -e "const vision = require('@google-cloud/vision'); const client = new vision.ImageAnnotatorClient(); console.log('Connected!');"
```

**❌ "Rate limit exceeded"**

Adjust rate limits in `.env`:
```env
RATE_LIMIT_MAX_REQUESTS=200
AI_RATE_LIMIT_MAX_REQUESTS=100
```

**❌ "Module not found" errors**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build server
npm run build:server
```

### Debug Mode

Enable detailed logging:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

View logs:
```bash
# Development
npm run server:all

# Production (PM2)
pm2 logs

# Docker
docker-compose logs -f api-server
```

### Testing Connection

```bash
# Test API endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test health check
curl http://localhost:3001/health | jq
```

## 💰 Cost Optimization

### Reduce API Costs

1. **Enable Caching** (saves ~80% of costs):
   ```env
   ENABLE_AI_CACHING=true
   ```

2. **Use Cheaper Models for Simple Tasks**:
   ```env
   USE_CHEAPER_MODEL_FOR_SIMPLE_TASKS=true
   ```
   - Uses GPT-3.5 Turbo for simple requests (20x cheaper)
   - Uses GPT-4 for complex requests

3. **Set Cost Limits**:
   ```env
   DAILY_COST_LIMIT=50
   MONTHLY_COST_LIMIT=1000
   ```

4. **Batch Requests**:
   ```env
   ENABLE_AI_BATCHING=true
   ```

### Monitor Costs

**View OpenAI usage:**
https://platform.openai.com/usage

**View Pinecone usage:**
https://app.pinecone.io/organizations

**View Google Cloud billing:**
https://console.cloud.google.com/billing

### Cost Estimates

**Typical Usage (1000 users/month):**

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| OpenAI GPT-4 | $50-$200 | With caching enabled |
| OpenAI GPT-3.5 | $5-$20 | With simple task detection |
| Pinecone | $0 | Free tier (100K vectors) |
| Google Vision | $0-$30 | First 1000/mo free |
| Remove.bg | $0-$100 | Free tier then paid |
| Redis | $0-$30 | Self-hosted or cloud |
| **Total** | **$55-$380** | Highly dependent on usage |

## 📚 Next Steps

- [Production Deployment Guide](./production-deployment.md)
- [API Reference](./api-reference.md)
- [Advanced Features](./advanced-features.md)
- [Security Best Practices](./security-guide.md)

## 🆘 Getting Help

- **Documentation**: See [docs/ai/](../ai/)
- **Examples**: See [src/components/ai/examples/](../../src/components/ai/examples/)
- **Issues**: https://github.com/VeerOneGPT/auraglass/issues

---
**Ready to build AI-powered glassmorphism UIs! 🚀**
