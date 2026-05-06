# AI/Server Security Review

Generated: 2026-05-06

This report records the local AI/auth/server security hardening completed for the `3.0.0` release-readiness pass and the remaining items that still require broader review before the package should be described as fully security-audited.

## Completed Hardening

- `src/services/auth/auth-service.ts`
  - `AuthService` now requires `JWT_SECRET` outside test environments.
  - `AuthService.generateApiKey()` now uses `crypto.randomBytes(24)` and returns `ak_` keys with 48 hex characters.
  - Focused Jest coverage verifies the production secret requirement and generated API key uniqueness/format.
- `src/services/auth/middleware.ts`
  - JWTs are accepted from the `Authorization: Bearer <token>` header and existing cookie session path.
  - API keys are accepted from the `x-api-key` header.
  - JWTs and API keys are no longer accepted from URL query parameters.
  - Focused Jest coverage verifies accepted header/cookie paths and rejected query-string credential paths.
- `server/websocket-server.js`
  - Authenticated websocket connections require `JWT_SECRET` before verifying JWTs.
  - Generated room IDs now use `crypto.randomBytes(9)` instead of `Math.random()`.
- `server/api-server.js`
  - Demo authentication is disabled by default and returns `501` unless `ENABLE_DEMO_AUTH=true` is set for local demos.
  - Static mock JWT and refresh-token strings were removed; the opt-in demo path now generates opaque random demo tokens with `crypto.randomBytes(32)`.
- `src/services/ai/*` and `src/lib/ai-client.ts`
  - AI provider/cache/client error paths no longer emit provider errors, cache errors, or client errors through `console.*`.
  - `ErrorHandler` now relies on Sentry capture in production and includes only structured code/status metadata instead of logging full provider error objects.
  - The AI security test verifies that an error containing an API-key-like string is not written through `console.error`.
- `src/services/ai/vision-service.ts`
  - Image cache keys now use SHA-256 instead of MD5.
- `src/services/websocket/collaboration-service.ts`
  - Anonymous collaboration user IDs now use `crypto.randomUUID()` or `crypto.getRandomValues()` when available instead of `Math.random()`.

## Verification

```bash
PATH="$HOME/.nvm/versions/node/v20.19.0/bin:$PATH" npx jest --config jest.config.js --runInBand src/services/ai/__tests__/ai-services.test.ts src/services/auth/auth-service.test.ts src/services/auth/middleware.test.ts --silent
```

Result:

```text
Test Suites: 3 passed, 3 total
Tests: 28 passed, 28 total
```

```bash
PATH="$HOME/.nvm/versions/node/v20.19.0/bin:$PATH" npm run typecheck
```

Result:

```text
tsc --noEmit passed
```

```bash
PATH="$HOME/.nvm/versions/node/v20.19.0/bin:$PATH" npm run audit:runtime
```

Result:

```text
debuggerFindingCount: 0
consoleFindingCount: 0
todoFindingCount: 0
```

## Remaining Security Follow-Ups

- AI service configuration still defaults several provider API keys to empty strings and localhost service URLs. Constructors validate the config before provider use, but deployment docs and runtime errors should be reviewed so missing provider credentials fail clearly.
- `server/api-server.js` still exposes mock AI response endpoints for local/demo behavior. They should not be represented as production AI service implementations until replaced with the real service layer or clearly excluded from supported production deployment.
- Production-source runtime cleanliness is clean by the current audit scope. `npm run audit:runtime` currently records `0` `console.*` findings, `0` TODO/FIXME/XXX markers, and `0` `debugger` statements.
