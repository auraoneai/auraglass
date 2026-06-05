# AuraGlass Optional Hosted Runtime Deployment Guide

AuraGlass by AuraOne is package-first. Most React and Next.js apps only need the npm package:

```bash
npm install aura-glass
```

Package-only apps import components and styles from `aura-glass` and do not need AuraGlass API servers, WebSocket servers, Redis, OpenAI, Pinecone, Google Vision, Remove.bg, or Sentry.

This guide covers the optional hosted runtime for teams that choose to self-host AuraGlass AI routes or realtime collaboration. Do not treat the hosted runtime as part of the core package install.

## Supported Runtime Boundary

Use these runtime roles consistently:

| Runtime path | Status | Notes |
| --- | --- | --- |
| `server/index.ts` | Production hosted API source | Real Express API server that wires `src/services/ai/*` and `src/services/auth/*`. |
| `server/websocket-server.js` | Optional WebSocket server | Presence, rooms, cursor/selection events, and authenticated socket handling. |
| `server/api-server.js` | Demo/mock-only legacy API | Must not be used for production deployment because it can return hardcoded mock AI responses. |

If a Dockerfile, process manager, deploy script, or cloud service starts `server/api-server.js`, treat that path as a local demo only and replace it before making production hosted-runtime claims.

## Canonical Local Ports

| Service | URL | Environment variable |
| --- | --- | --- |
| Frontend/demo app | `http://localhost:3000` | `PORT=3000` |
| API server | `http://localhost:3002` | `API_SERVER_PORT=3002` |
| WebSocket server | `ws://localhost:3001` | `WS_PORT=3001` |
| Public API URL | `http://localhost:3002` | `NEXT_PUBLIC_API_URL=http://localhost:3002` |
| Public WebSocket URL | `ws://localhost:3001` | `NEXT_PUBLIC_WS_URL=ws://localhost:3001` |

Set the API and WebSocket ports explicitly while the 3.3 hosted-runtime cleanup is in progress; older code and examples used both `3001` and `3002` for different roles.

## Prerequisites

- Node.js 18+ and npm.
- Redis when enabling hosted caching, rate limiting, or Redis-backed collaboration.
- Provider credentials only for the optional features you enable.
- A secure `JWT_SECRET` for hosted auth routes.
- A configured `CORS_ORIGIN` or `CLIENT_URL` for browser clients.

## Environment

Start from `.env.example`, then set the hosted runtime values explicitly:

```env
NODE_ENV=production
PORT=3000
API_SERVER_PORT=3002
WS_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_WS_URL=ws://localhost:3001
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace-with-a-secure-random-secret
REDIS_URL=redis://localhost:6379

# Optional provider-backed features
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=
REMOVEBG_API_KEY=
SENTRY_DSN=
```

Generate a local secret for non-shared environments:

```bash
openssl rand -base64 32
```

Store production provider keys in a platform secret manager, not in source control.

## Local Hosted Runtime

```bash
npm install
npm run build:server

# Terminal 1: optional Redis
redis-server

# Terminal 2: API and WebSocket runtime with canonical ports
API_SERVER_PORT=3002 WS_PORT=3001 npm run server:all

# Terminal 3: frontend/demo app
NEXT_PUBLIC_API_URL=http://localhost:3002 \
NEXT_PUBLIC_WS_URL=ws://localhost:3001 \
npm run dev
```

`npm run server:api` should start the built API server from `server/index.ts`; `npm run server:websocket` starts `server/websocket-server.js`. Do not substitute `server/api-server.js` for production testing.

## Health And Smoke Checks

Process health:

```bash
curl http://localhost:3002/health
```

Authenticated AI route examples should use `http://localhost:3002`:

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:3002/api/ai/generate-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"context":"contact form"}'
```

When a route depends on a missing optional provider, the hosted runtime should return a safe provider-unconfigured response instead of a mock success or raw provider stack trace:

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

## Provider Scope

| Feature | Provider inputs |
| --- | --- |
| Smart form generation and summaries | `OPENAI_API_KEY` |
| Semantic search | `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, `PINECONE_INDEX_NAME` |
| Image analysis | `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` |
| Background removal | `REMOVEBG_API_KEY` |
| Caching and hosted coordination | `REDIS_URL` |
| Error monitoring | `SENTRY_DSN` |

Missing optional provider settings should not break package-only usage. In hosted API routes, missing provider settings should produce the provider-unconfigured response shape above.

## PM2 Or Process Manager

Build the server first, set environment variables explicitly, and run the real API output from `server/index.ts` plus the WebSocket server:

```bash
npm run build:server

API_SERVER_PORT=3002 pm2 start npm --name aura-api -- run server:api
WS_PORT=3001 pm2 start npm --name aura-websocket -- run server:websocket

pm2 save
pm2 startup
```

Before exposing traffic, verify that the API process is listening on `3002` and that no process manager entry starts the demo/mock `server/api-server.js` path.

## Docker And Compose

Docker or Compose deployments must follow the same contract:

- API service exposes `3002` and starts the real built API server.
- WebSocket service exposes `3001` and starts `server/websocket-server.js`.
- Redis is configured when hosted caching, rate limiting, or collaboration persistence is enabled.
- Health checks target `http://localhost:3002/health`.
- The legacy demo/mock `server/api-server.js` path is not used in production images.

If your local Dockerfile or Compose file still references `server/api-server.js`, treat it as a pending 3.3 runtime cleanup item before production use.

## Collaboration Boundary

The optional WebSocket server supports hosted realtime transport features such as authenticated connections, rooms, presence, cursor position, and selection events. Collaborative document editing is explicitly unsupported in 3.3 and emits `COLLABORATION_EDIT_UNSUPPORTED`; there is no hosted edit engine or env flag that turns editing on.

The server persists room and cursor state in Redis, but 3.3 does not configure the Socket.IO Redis adapter for multi-process event fanout. Use one WebSocket process for verified 3.3 behavior, or add Redis-adapter integration tests before horizontally scaling the realtime transport.

## Troubleshooting

### API Health Check Fails On 3002

```bash
lsof -i :3002
API_SERVER_PORT=3002 npm run server:api
curl http://localhost:3002/health
```

### WebSocket Fails On 3001

```bash
lsof -i :3001
WS_PORT=3001 npm run server:websocket
```

### Provider Route Returns `AURA_PROVIDER_UNCONFIGURED`

Set the matching provider credentials, restart the API server, and retry the request. Keep package-only apps on UI imports and avoid wiring provider routes unless you are intentionally hosting the backend.

### Redis Connection Error

```bash
redis-cli ping
docker run -d -p 6379:6379 redis:alpine
```

## Release Checks For Hosted Runtime Claims

Before a 3.3 hosted-runtime claim is made, evidence should show:

- `npm run build:server` succeeds.
- API health works at `http://localhost:3002/health`.
- WebSocket transport works at `ws://localhost:3001`.
- Missing required hosted env fails closed before production traffic.
- Missing optional providers return `AURA_PROVIDER_UNCONFIGURED`.
- No production deploy path starts `server/api-server.js`.
- Auth, rate limiting, Redis/cache behavior, provider routes, and WebSocket auth have integration evidence.
