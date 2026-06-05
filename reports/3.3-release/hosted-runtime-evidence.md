# 3.3 Hosted Runtime Evidence

This file records current hosted-runtime evidence for AuraGlass 3.3. It separates verified local/runtime checks from external deployment and live-provider work that still requires a staging or production environment.

Updated: 2026-06-05T06:36Z.

## Current-State Summary

| Area | Status | Evidence |
| --- | --- | --- |
| Real TypeScript API server | [x] Verified | `server/index.ts` exports `app`, `httpServer`, and `startServer()`, defaults to `API_SERVER_PORT=3002`, exposes `/health` and `/ready`, and wires provider-aware AI routes. |
| Production entrypoints avoid mock API server | [x] Verified locally | `Dockerfile`, `docker-compose.yml`, `scripts/deploy.sh`, and `npm run server:api` all use `dist/server/server/index.js`; `server/api-server.js` is demo-only. |
| Canonical local ports | [x] Verified by source scan/tests | API `3002`, WebSocket `3001`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_WS_URL` are aligned in `src/lib/ai-client.ts`, `.env.example`, Docker/Compose, deploy script, README, and active AI/deployment docs. |
| Provider-unconfigured contract | [x] Verified by tests | `ProviderUnconfiguredError` returns `error: "Provider not configured"`, `code: "AURA_PROVIDER_UNCONFIGURED"`, provider, feature, remediation, and docs URL. |
| Hosted AI route request validation | [x] Verified by tests | `tests/hosted-runtime/ai-provider-contract.test.ts` asserts route presence and input checks before provider calls. |
| Hosted auth route methods | [x] Verified by tests | `AuthService` implements `login`, `register`, `refreshToken`, and `revokeToken`; demo login/register are gated by `ENABLE_DEMO_AUTH=true` and not production. |
| AI client URL/error metadata | [x] Verified by tests | `tests/hosted-runtime/ai-client-url-contract.test.ts` passes for default URLs, env overrides, and provider-unconfigured metadata propagation. |
| WebSocket auth and edit scope | [x] Verified by tests | WebSocket token auth requires `JWT_SECRET`; anonymous/userId-only sessions require explicit non-production demo config; collaborative editing always emits `COLLABORATION_EDIT_UNSUPPORTED` in 3.3. |
| Redis/cache/rate/cost controls | [x] Verified by tests | `tests/hosted-runtime/cache-rate-cost.test.ts` covers production Redis requirements, cache key privacy, cache service TTL/health behavior, rate-limit config, and usage metadata. |
| Route-level AI cache metadata | [x] Verified by tests | `tests/hosted-runtime/ai-route-cache-metadata.test.ts` verifies `/api/ai/generate-form` returns `cached: false` on miss, `cached: true` on hit, usage metadata, and a single mocked OpenAI provider call. |
| Multi-client WebSocket room state | [x] Verified by tests | `tests/hosted-runtime/websocket-multiclient.test.ts` covers create/join/leave/cleanup behavior, cursor expiration, and multi-client room event visibility. |
| Server TypeScript build | [x] Verified | `npm run build:server` passed after runtime changes. |
| Local missing-env startup | [x] Verified locally | Hosted production startup fails before listening when required env is absent. With caching enabled, missing `REDIS_URL` fails first; with `ENABLE_AI_CACHING=false`, missing `JWT_SECRET` fails before listening. |
| Local provider-unconfigured route smoke | [x] Verified locally | With `JWT_SECRET`, demo auth enabled outside production, and no OpenAI key, `/health` returns 200, `/ready` returns 503, demo login returns a JWT, and `/api/ai/generate-form` returns `AURA_PROVIDER_UNCONFIGURED`. |
| Live provider/Sentry deployment smoke | [ ] Pending external | No credentialed staging or production provider/Sentry run has been recorded. |
| Docker Compose full smoke | [x] Verified locally | `npm run test:deployment:compose` passed for API, WebSocket, Redis, frontend Nginx, and reverse-proxy Nginx using disposable localhost ports. |

## Commands Run

### Hosted Runtime Contract Tests

```bash
npx jest tests/hosted-runtime --runInBand --no-cache
```

Result:

```text
Test Suites: 8 passed, 8 total
Tests:       43 passed, 43 total
```

Covered:

- Provider route declarations, request validation, and no hardcoded mock success responses in hosted entrypoints.
- `AURA_PROVIDER_UNCONFIGURED` payload shape and source-level handling.
- AI client canonical URL defaults and provider-unconfigured metadata preservation.
- JWT middleware behavior for missing, invalid, expired, and valid tokens.
- Permission rejection.
- Auth route method presence.
- JWT login/register/refresh/logout/revoke/protected route flows.
- Demo auth production guard.
- WebSocket runtime dependency declarations, JWT secret requirement, anonymous demo gating, room-scoped presence/cursor/selection, and unsupported collaborative edit behavior.
- Redis room state create/join/leave/cleanup and cursor expiration.
- Cache service key privacy, TTL normalization, route-level hit/miss behavior, rate-limit config, and usage metadata.

### Server Build

```bash
npm run build:server
```

Result: pass.

### Deployment Contract And Local Hosted Startup Smoke

```bash
npm run test:deployment
node tests/deployment/server-build-and-start-smoke.js
npm run test:deployment:compose
```

Results:

- `npm run test:deployment`: pass, 1 suite / 4 tests.
- `server-build-and-start` smoke: pass; API `/health` and WebSocket TCP reachability verified on disposable localhost ports.
- `npm run test:deployment:compose`: pass; `docker compose smoke passed: api=63002, ws=63003, redis=63001, nginx=https://127.0.0.1:63006`.

Final hosted-server output check:

```bash
test -f dist/server/server/index.js
```

Result: pass.

### Local Startup Smoke

Missing required hosted env:

```bash
NODE_ENV=production API_SERVER_PORT=3998 node dist/server/server/index.js
```

Result: fails before listening because hosted production caching requires `REDIS_URL` unless `ENABLE_AI_CACHING=false`.

```bash
NODE_ENV=production ENABLE_AI_CACHING=false API_SERVER_PORT=3998 node dist/server/server/index.js
```

Result: fails before listening with `JWT_SECRET is required to initialize AuthService`.

Canonical local route smoke:

```bash
NODE_ENV=development JWT_SECRET=<local-secret> ENABLE_DEMO_AUTH=true ENABLE_SMART_FORMS=true API_SERVER_PORT=3999 node dist/server/server/index.js
```

Observed results:

- `GET /health`: 200.
- `GET /ready`: 503 because the optional OpenAI provider was not configured.
- `POST /api/auth/login`: returns a demo JWT because demo auth was explicitly enabled outside production.
- `POST /api/ai/generate-form`: returns 503 with `code: "AURA_PROVIDER_UNCONFIGURED"` and no provider credential leakage.

### Static Syntax Checks

```bash
node --check server/api-server.js
node --check server/websocket-server.js
node --check scripts/ci/stale-3-3-scan.js
```

Result: pass.

### Stale/Current-State Scanner

```bash
node scripts/ci/stale-3-3-scan.js
```

Result: pass. Latest informational counts:

- `legacyMockServerReferences`: 12, all active-doc findings describe `server/api-server.js` as demo/mock-only or not production.
- `portAndEnvContract`: expected canonical references to `3001`, `3002`, `API_SERVER_PORT`, `WS_PORT`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_WS_URL`.
- `staleReleaseGuidance`: 0 after current docs/changelog cleanup.
- `providerUnconfiguredContract`: implementation and docs references present.
- `collaborationPlaceholder`: 0.
- `manualCertificationGaps`: expected pending manual evidence references.

## Entrypoint Snapshot

| File | Runtime behavior |
| --- | --- |
| `package.json` | `server:api` runs `node dist/server/server/index.js`; `server:build-and-start` runs `build:hosted` first. |
| `Dockerfile` | Builder uses Node 22 with Alpine native build tools, runs `npm run build:hosted`; default command runs `dist/server/server/index.js`; health check targets `http://localhost:3002/health`. |
| `docker-compose.yml` | API service sets `API_SERVER_PORT=3002` and runs `node dist/server/server/index.js`; WebSocket service uses `WS_PORT=3001`; frontend serves built `dist` through Nginx on internal port `3000`. |
| `scripts/deploy.sh` | Builds hosted output and starts `dist/server/server/index.js`; `JWT_SECRET` is required by deployment validation. |
| `server/api-server.js` | Demo-only legacy API path; AI endpoints return disabled/demo responses rather than hardcoded production success. |

## Remaining Evidence Required Before Final 3.3

- [ ] Run a credentialed staging smoke for OpenAI, Pinecone, Google Vision, Remove.bg, and Sentry before making live-hosted production claims for those features.
- [x] Docker Compose smoke covers API, WebSocket, Redis, frontend Nginx, and reverse-proxy Nginx paths.
- [ ] Record a live `/health` and `/ready` run from the final deployment environment.
- [x] Hosted runtime scope is decided: optional self-hosted runtime code with local integration evidence; live-hosted production claims require separate staging/live evidence.
- [ ] Keep manual accessibility and physical-device certification pending until human results are recorded.
