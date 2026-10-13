# AI Production Deployment

Use this guide with [production infrastructure](./production-infrastructure.md) when deploying the optional AuraGlass hosted AI runtime. Package-only apps do not need hosted AI services.

## Deployment Requirements

- Store provider keys in the platform secret manager, not in source control.
- Run Redis or a compatible cache for rate limits, request coordination, and expensive response reuse.
- Put AI routes behind authentication, authorization, and request-size limits.
- Configure observability for provider latency, failures, and spend.
- Use the canonical runtime contract: API `http://localhost:3002` via `API_SERVER_PORT=3002`, WebSocket `ws://localhost:3001` via `WS_PORT=3001`.
- Confirm production entrypoints run the real API server built from `server/index.ts`, not the legacy demo/mock `server/api-server.js` path.
- Return `AURA_PROVIDER_UNCONFIGURED` for missing optional provider credentials instead of mock success responses.

## Release Checks

- `npm run build:server`
- `API_SERVER_PORT=3002 WS_PORT=3001 npm run server:all` in a staging environment
- API health check against `http://localhost:3002/health`
- Representative OpenAI, search, and vision smoke requests with configured providers
- Missing-provider smoke requests that prove the provider-unconfigured response shape
