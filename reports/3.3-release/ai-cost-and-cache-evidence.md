# 3.3 AI Cost And Cache Evidence

This file records current 3.3 evidence for Redis, caching, rate limits, and AI cost controls. It is not a final hosted-runtime cost-control certification because live provider accounts, Sentry, and final deployment evidence remain external.

Updated: 2026-06-05T06:36Z.

## Current-State Summary

| Area | Status | Evidence |
| --- | --- | --- |
| AI cost/cache env vars documented | [x] Observed | `.env.example` and AI docs include `AI_RATE_LIMIT_MAX_REQUESTS`, `ENABLE_AI_CACHING`, `ENABLE_AI_BATCHING`, `MAX_COST_PER_REQUEST`, and `USE_CHEAPER_MODELS_THRESHOLD`. |
| Config parses cost/cache settings | [x] Verified by source/build | `src/services/ai/config.ts` maps env vars into `rateLimit` and `costOptimization`; `npm run build:server` passes. |
| Redis cache service exists | [x] Observed | `src/services/ai/cache-service.ts` supports connect/get/set/delete/flush/disconnect with memory fallback. |
| Cache keys avoid raw prompt/query leakage | [x] Implemented/tested | `openai-service.ts`, `semantic-search-service.ts`, `vision-service.ts`, and `cache-service.ts` use SHA-256 digests or normalized bounded keys for user-content cache keys; hosted tests assert raw prompt text does not appear in generated keys. |
| Hosted route rate limiting exists | [x] Verified by tests | `server/index.ts` applies `express-rate-limit` to `/api/`; hosted-runtime tests cover default env parsing, custom env parsing, and middleware wiring. |
| AI service cache/error tests | [x] Verified | `npm test -- --runTestsByPath src/services/ai/__tests__/ai-services.test.ts src/services/auth/middleware.test.ts --runInBand` passed: 2 suites / 26 tests. |
| API route cache metadata | [x] Verified by tests | `tests/hosted-runtime/ai-route-cache-metadata.test.ts` proves `POST /api/ai/generate-form` returns `cached: false` on a miss, `cached: true` on a hit, and only calls the mocked provider once. |
| Per-user rate limiting | [ ] Not implemented in 3.3 | Current middleware is IP/global oriented through `express-rate-limit`. The 3.3 PRD acceptance item is documented/tested rate-limit config, which is complete; per-user quota support remains a future enhancement. |
| `ENABLE_AI_CACHING=true` production Redis behavior | [x] Config/test verified | `createAIConfig()` throws in hosted production when caching is enabled without `REDIS_URL`; hosted-runtime tests cover enabled, disabled, configured, and `/ready` Redis reporting paths. |
| Local Redis deployment smoke | [x] Verified by Compose | `npm run test:deployment:compose` passed and verified Redis `PONG` through the Compose Redis service. |
| Cost telemetry by provider/feature/model | [x] Verified by tests | `OpenAIService.generateFormFieldSuggestionsWithMetadata()` and the hosted route return provider, feature, model, token estimates, cache hit, and estimated cost without prompt or response content. |

## Commands Run

```bash
npm test -- --runTestsByPath src/services/ai/__tests__/ai-services.test.ts src/services/auth/middleware.test.ts --runInBand
npx jest tests/hosted-runtime --runInBand --no-cache
npm run build:server
npm run test:deployment:compose
```

Results:

- AI/auth focused tests: pass, 2 suites / 26 tests.
- Hosted runtime suite: pass, 8 suites / 43 tests in the broad run.
- Focused cache/rate/cost suite: pass, 1 suite / 12 tests.
- Hosted server build: pass.
- Docker Compose smoke: pass; Redis service returned `PONG`.

## Remaining Cost/Cache Gates

- [x] Route-level cache hit/miss tests for the implemented form-generation route.
- [x] Redis readiness/config evidence for hosted production caching.
- [x] Local Compose Redis smoke evidence.
- [x] Rate-limit config evidence beyond source wiring.
- [x] Cost telemetry evidence that excludes prompt, document, credential, and API-key content.
- [ ] Live provider-account evidence for cost telemetry with real OpenAI billing data, if that is launch-scoped.
- [ ] Future per-user quota support, if product requirements move beyond IP/global hosted rate limits.
