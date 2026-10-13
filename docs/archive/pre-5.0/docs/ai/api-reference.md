# AI API reference

Optional hosted AI routes and service classes. Package-only React apps do not need these endpoints.

## Service imports

```ts
import { OpenAIService } from 'aura-glass/services/ai/openai-service';
import { VisionService } from 'aura-glass/services/ai/vision-service';
import {
  createAIConfig,
  createRuntimeFeatureFlags,
  ProviderUnconfiguredError,
} from 'aura-glass/services/ai/config';
```

The repo-local production API (`server/index.ts`) constructs those services from `src/services/ai/*` and `src/services/auth/*`.

Collaboration transport for browser clients is `aura-glass/services/websocket/collaboration-service`. The socket server itself is `server/websocket-server.js`.

## URLs

| Role | Default | Variable |
| --- | --- | --- |
| API | `http://localhost:3002` | `API_SERVER_PORT`, `NEXT_PUBLIC_API_URL` |
| WebSocket | `ws://localhost:3001` | `WS_PORT`, `NEXT_PUBLIC_WS_URL` |

## Routes

Every `/api/ai/*` route requires `Authorization: Bearer <token>`. Auth routes are implemented in `server/index.ts`.

| Method | Path | Body | Provider |
| --- | --- | --- | --- |
| `GET` | `/health` | — | none |
| `GET` | `/ready` | — | JWT plus enabled feature flags |
| `POST` | `/api/auth/login` | `{ email, password }` | JWT |
| `POST` | `/api/auth/register` | `{ email, password, name }` | JWT |
| `POST` | `/api/auth/refresh` | `{ refreshToken }` | JWT |
| `POST` | `/api/auth/logout` | Bearer token | JWT |
| `POST` | `/api/ai/generate-form` | `{ context, existingFields? }` | OpenAI (`ENABLE_SMART_FORMS`) |
| `POST` | `/api/ai/search` | `{ query, options? }` | OpenAI + Pinecone |
| `POST` | `/api/ai/index-documents` | `{ documents: [] }` | OpenAI + Pinecone |
| `POST` | `/api/ai/analyze-image` | `{ image, analysisTypes? }` | Google Vision (`ENABLE_VISION_API`) |
| `POST` | `/api/ai/remove-background` | `{ image }` | Remove.bg (`ENABLE_BACKGROUND_REMOVAL`) |
| `POST` | `/api/ai/summarize` | `{ content, maxLength? }` | OpenAI |

`image` is a data URI or raw base64. `analysisTypes` defaults to `["all"]` and may include `faces`, `objects`, `text`, `labels`.

## Provider-unconfigured response

HTTP `503`. Shape from `ProviderUnconfiguredError.toJSON()`:

```json
{
  "error": "Provider not configured",
  "message": "openai is not configured for smart form generation",
  "code": "AURA_PROVIDER_UNCONFIGURED",
  "provider": "openai",
  "feature": "smart form generation",
  "remediation": "Set OPENAI_API_KEY before using smart form generation.",
  "docsUrl": "https://auraglass.auraone.ai/docs/ai-providers"
}
```

`provider` is one of `openai`, `pinecone`, `googleVision`, `removeBg`, `redis`.

## Feature flags

From `createRuntimeFeatureFlags` in `src/services/ai/config.ts`:

| Variable | Default |
| --- | --- |
| `ENABLE_SMART_FORMS` | `true` |
| `ENABLE_SEMANTIC_SEARCH` | `false` |
| `ENABLE_VISION_API` | `false` |
| `ENABLE_BACKGROUND_REMOVAL` | `false` |
| `ENABLE_AI_CACHING` | `true` |
| `ENABLE_AI_BATCHING` | `true` |
| `ENABLE_COLLABORATION` | `false` |

Allowed OpenAI models in the config schema are `gpt-4`, `gpt-4-turbo`, and `gpt-3.5-turbo` (`OPENAI_MODEL`, default `gpt-4`).

## Smoke

```bash
npm run build:server
API_SERVER_PORT=3002 WS_PORT=3001 npm run server:all

curl http://localhost:3002/health
curl http://localhost:3002/ready

curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:3002/api/ai/generate-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"context":"contact form"}'
```

See [deployment.md](../deployment.md) for ports, Docker, and the collaboration editing boundary.
