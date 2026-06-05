# AuraGlass by AuraOne Optional Hosted Runtime

AuraGlass is package-first. You can use the npm package in React and Next.js apps without running anything in this directory.

The `server/` directory is for the optional hosted runtime: self-hosted API routes, auth, AI provider calls, and WebSocket collaboration transport. Use it only when your application intentionally hosts those backend features.

## Runtime Boundary

```
server/
├── index.ts              # Real Express API server source
├── websocket-server.js   # Optional WebSocket collaboration server
└── api-server.js         # Legacy demo/mock API server; not production

src/services/
├── ai/
│   ├── openai-service.ts
│   ├── semantic-search-service.ts
│   ├── vision-service.ts
│   ├── cache-service.ts
│   ├── error-handler.ts
│   └── config.ts
├── auth/
│   └── auth-service.ts
└── websocket/
    └── collaboration-service.ts
```

Production hosted-runtime paths should build and run `server/index.ts` and `server/websocket-server.js`. Do not use `server/api-server.js` as a production API entrypoint; it is a legacy demo/mock path and can return hardcoded AI responses.

## Canonical Local Contract

| Service | URL | Environment variable |
| --- | --- | --- |
| API server | `http://localhost:3002` | `API_SERVER_PORT=3002` |
| WebSocket server | `ws://localhost:3001` | `WS_PORT=3001` |
| Browser API URL | `http://localhost:3002` | `NEXT_PUBLIC_API_URL` |
| Browser WebSocket URL | `ws://localhost:3001` | `NEXT_PUBLIC_WS_URL` |

Set these explicitly while the 3.3 runtime cleanup is in progress because older code and examples used mixed defaults.

## API Server

`server/index.ts` wires the repo-local source services:

```ts
import { OpenAIService } from '../src/services/ai/openai-service';
import { SemanticSearchService } from '../src/services/ai/semantic-search-service';
import { VisionService } from '../src/services/ai/vision-service';
import { AuthService } from '../src/services/auth/auth-service';
```

Package consumers that need service classes outside this repo should use public package subpaths where they exist:

```ts
import { OpenAIService } from 'aura-glass/services/ai/openai-service';
import { VisionService } from 'aura-glass/services/ai/vision-service';
import { CollaborationService } from 'aura-glass/services/websocket/collaboration-service';
```

## Endpoints

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### AI Features

AI routes require `Authorization: Bearer <token>`.

- `POST /api/ai/generate-form`
- `POST /api/ai/search`
- `POST /api/ai/index-documents`
- `POST /api/ai/analyze-image`
- `POST /api/ai/remove-background`
- `POST /api/ai/summarize`

### Health

- `GET /health`

Process health is not the same as provider readiness. A healthy server can still return provider-unconfigured responses for optional AI features whose credentials are missing.

## Provider-Unconfigured Responses

Hosted routes that depend on optional providers should fail safely when the provider is disabled or credentials are absent:

```json
{
  "error": "Provider not configured",
  "message": "openai is not configured for generate-form",
  "code": "AURA_PROVIDER_UNCONFIGURED",
  "provider": "openai",
  "feature": "generate-form",
  "docsUrl": "https://auraglass.auraone.ai/docs/ai-providers"
}
```

Do not replace missing providers with mock production success responses.

## Running Locally

```bash
npm install
npm run build:server

API_SERVER_PORT=3002 npm run server:api
WS_PORT=3001 npm run server:websocket
```

Or start both with inherited environment:

```bash
API_SERVER_PORT=3002 WS_PORT=3001 npm run server:all
```

Health check:

```bash
curl http://localhost:3002/health | jq
```

## Environment Variables

Core hosted API settings:

```env
NODE_ENV=production
API_SERVER_PORT=3002
WS_PORT=3001
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace-with-a-secure-random-secret
```

Optional provider settings:

```env
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=
REMOVEBG_API_KEY=
REDIS_URL=redis://localhost:6379
SENTRY_DSN=
```

## Security Features

- Helmet.js for HTTP security headers.
- CORS with explicit allowed origins.
- Rate limiting per IP and route family.
- JWT authentication with refresh tokens.
- Request validation before provider calls.
- Sanitized production errors.
- Optional Sentry error tracking.

## Collaboration Boundary

The WebSocket server supports authenticated connections, rooms, presence, cursor, and selection events. Collaborative document editing is explicitly unsupported in 3.3 and emits `COLLABORATION_EDIT_UNSUPPORTED`; there is no hosted edit engine or env flag that turns editing on.

The 3.3 WebSocket server stores room and cursor state in Redis, but it does not configure the Socket.IO Redis adapter for multi-process event fanout. Treat the default server as a single-process realtime transport until a Redis adapter smoke test is added.

## Troubleshooting

### API Server Will Not Start

```bash
lsof -i :3002
API_SERVER_PORT=3002 npm run server:api
curl http://localhost:3002/health
```

### WebSocket Server Will Not Start

```bash
lsof -i :3001
WS_PORT=3001 npm run server:websocket
```

### Redis Connection Failed

```bash
redis-cli ping
docker run -d -p 6379:6379 redis:alpine
```

### Provider-Unconfigured AI Response

Set the matching provider credentials and restart the API server. Missing optional provider settings should not affect package-only imports.

## License

MIT
