# AI API Reference

This page summarizes the AuraGlass AI service surface used by the AI setup and quick-start guides.

AuraGlass AI routes are optional hosted-runtime features. Package-only React apps do not need these endpoints.

## Runtime Services

- OpenAI service: imported from `aura-glass/services/ai/openai-service` for text generation, form generation, and prompt orchestration.
- Vision service: imported from `aura-glass/services/ai/vision-service` for image analysis workflows.
- Collaboration service: imported from `aura-glass/services/websocket/collaboration-service` for presence and realtime collaboration.
- Repo-local API server source imports service implementations from `src/services/ai/*` and `src/services/auth/*`.

## Runtime URLs

- API base URL: `http://localhost:3002` via `API_SERVER_PORT=3002`.
- WebSocket URL: `ws://localhost:3001` via `WS_PORT=3001`.
- Browser clients should use `NEXT_PUBLIC_API_URL=http://localhost:3002` and `NEXT_PUBLIC_WS_URL=ws://localhost:3001`.

## Environment Inputs

- `OPENAI_API_KEY`: required for OpenAI-backed features.
- `PINECONE_API_KEY`: required for semantic search deployments that use Pinecone.
- `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS`: required for Google Vision deployments.
- `REDIS_URL`: recommended for caching and backend coordination.
- `JWT_SECRET`: required for hosted auth routes outside test environments.

## Provider-Unconfigured Response

When a route depends on a provider that is disabled or missing credentials, return a structured error instead of mock success data:

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

Use the same shape for other providers by changing `provider` and `feature`, for example `pinecone` with `semantic-search` or `google-vision` with `analyze-image`.

## cURL Examples

```bash
curl http://localhost:3002/health

curl -X POST http://localhost:3002/api/ai/generate-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"context":"contact form"}'
```

## Verification

Use the AI quick start with `npm run build:server`, `npm run server:all`, and the documented cURL smoke checks before exposing AI routes in production.
