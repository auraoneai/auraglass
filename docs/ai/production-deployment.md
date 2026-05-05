# AI Production Deployment

Use this guide with [production infrastructure](./production-infrastructure.md) when deploying AuraGlass AI services.

## Deployment Requirements

- Store provider keys in the platform secret manager, not in source control.
- Run Redis or a compatible cache for rate limits, request coordination, and expensive response reuse.
- Put AI routes behind authentication, authorization, and request-size limits.
- Configure observability for provider latency, failures, and spend.

## Release Checks

- `npm run build:server`
- `npm run server:all` in a staging environment
- API health check against `/health`
- Representative OpenAI, search, and vision smoke requests
