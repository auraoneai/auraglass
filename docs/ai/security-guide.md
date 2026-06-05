# AI Security Guide

AI-backed features need the same security bar as other production backend routes, plus provider-specific controls.

These controls apply to the optional hosted runtime. Package-only AuraGlass usage should not require provider credentials or hosted auth.

## Required Controls

- Keep API keys in environment secrets.
- Authenticate all write, generation, upload, and search requests.
- Validate prompt inputs, file uploads, MIME types, and payload size.
- Strip secrets and private data from prompts before sending data to third-party providers.
- Log provider request IDs and failures without logging raw secrets or sensitive user content.
- Apply rate limits per user, IP, organization, and endpoint.
- Return structured `AURA_PROVIDER_UNCONFIGURED` errors when optional providers are missing; do not substitute mock success data on production routes.
- Keep the legacy demo/mock API server out of production process managers, Docker commands, and health checks.

## Review Checklist

Before launch, review prompt injection risks, data retention settings, provider terms, rollback behavior, port configuration (`API_SERVER_PORT=3002`, `WS_PORT=3001`), and missing-provider behavior for each AI route.
