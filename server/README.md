# AuraGlass Backend Server

Production-ready AI infrastructure for AuraGlass components.

## Overview

This server provides real AI integrations for:
- **OpenAI GPT-4/3.5** - Smart form generation, search enhancement
- **Pinecone** - Vector database for semantic search
- **Google Vision API** - Image analysis, OCR, face detection
- **Remove.bg** - Background removal
- **WebSocket** - Real-time collaboration

## Architecture

```
server/
├── index.ts              # Main API server with Express
├── websocket-server.js   # WebSocket collaboration server
└── api-server.js         # Legacy API server (being replaced)

src/services/
├── ai/
│   ├── openai-service.ts      # OpenAI GPT integration
│   ├── semantic-search-service.ts  # Pinecone vector search
│   ├── vision-service.ts      # Google Vision API
│   ├── cache-service.ts       # Redis caching layer
│   ├── error-handler.ts       # Error handling
│   └── config.ts              # Configuration
├── auth/
│   └── auth-service.ts        # JWT authentication
└── websocket/
    └── collaboration-service.ts  # Real-time collaboration
```

## Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### AI Features
All require authentication via `Authorization: Bearer <token>` header.

- `POST /api/ai/generate-form` - Generate smart form fields
- `POST /api/ai/search` - Semantic search with AI enhancement
- `POST /api/ai/index-documents` - Index documents for search
- `POST /api/ai/analyze-image` - Analyze image (faces, objects, text, labels)
- `POST /api/ai/remove-background` - Remove image background
- `POST /api/ai/summarize` - Generate content summary

### Health
- `GET /health` - Server health check

## Running

### Development
```bash
npm run server:dev
```

### Production
```bash
npm run build:server
npm run server:all
```

### With PM2
```bash
pm2 start ecosystem.config.js
```

## Environment Variables

See `.env.example` for all configuration options.

**Required:**
```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## Security Features

- ✅ Helmet.js for HTTP security headers
- ✅ CORS with configurable origins
- ✅ Rate limiting per IP
- ✅ JWT authentication with refresh tokens
- ✅ Request validation
- ✅ Error sanitization in production
- ✅ Sentry error tracking

## Cost Optimization

- **Redis caching** - Reduces API calls by ~80%
- **Intelligent model selection** - Uses GPT-3.5 for simple tasks
- **Request batching** - Combines multiple requests
- **Cost limits** - Configurable daily/monthly limits

## Monitoring

- **Sentry** - Error tracking and performance monitoring
- **Logs** - Structured logging with levels
- **Health checks** - `/health` endpoint with service status
- **Metrics** - Request duration, error rates

## Scaling

### Horizontal Scaling
Run multiple instances behind a load balancer:

```bash
# Start multiple instances with PM2
pm2 start ecosystem.config.js -i max
```

### Redis Cluster
For high availability:

```env
REDIS_URL=redis://sentinel1:26379,redis://sentinel2:26379
```

### WebSocket Scaling
Use Redis adapter for multi-server WebSocket:

```js
import { createAdapter } from '@socket.io/redis-adapter';
```

## Development

### Adding New Endpoints

1. Add route to `server/index.ts`:
```ts
aiRouter.post('/my-endpoint', async (req, res) => {
  const { param } = req.body;
  const result = await myService.doSomething(param);
  res.json({ result });
});
```

2. Add method to AI client (`src/lib/ai-client.ts`):
```ts
async myFeature(param: string): Promise<Result> {
  return await this.request('/api/ai/my-endpoint', {
    method: 'POST',
    body: JSON.stringify({ param }),
  });
}
```

3. Use in components:
```tsx
import { aiClient } from '@/lib/ai-client';

const result = await aiClient.myFeature('value');
```

## Troubleshooting

**Server won't start:**
```bash
# Check if port is in use
lsof -i :3001

# Check logs
npm run server:dev
```

**Redis connection failed:**
```bash
# Test Redis
redis-cli ping

# Check Redis logs
docker logs auraglass-redis
```

**API errors:**
```bash
# Check server logs
pm2 logs

# Test health endpoint
curl http://localhost:3001/health | jq
```

## License

MIT
