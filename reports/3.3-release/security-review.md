# 3.3 Security Review

This file records current 3.3 security evidence for hosted runtime, provider errors, auth, observability, and release cleanliness. It is still not a final deployment security audit because live TLS/proxy/secrets/provider evidence has not been recorded.

Updated: 2026-06-05T07:14Z.

## Current-State Summary

| Area | Status | Evidence |
| --- | --- | --- |
| Forbidden secret/debug scan | [x] Passed | `npm run lint:forbidden` passed in the final 3.3 evidence pass: latest scan covered 2418 files with no forbidden release-blocking patterns. |
| Runtime cleanliness audit | [x] Passed | `npm run audit:runtime` passed in the final 3.3 evidence pass: `src`, 760 files, 0 findings. |
| Auth secret fail-closed behavior | [x] Verified | `AuthService` throws when `JWT_SECRET` is missing outside tests; `startServer()` initializes services before `listen()`. |
| JWT protected route behavior | [x] Verified | `tests/hosted-runtime/auth-hosted-contract.test.ts` covers missing, invalid, expired, and valid token paths. |
| API key query-string rejection | [x] Verified | `src/services/auth/middleware.test.ts` covers `x-api-key` header acceptance and query-string API-key rejection. |
| Provider-unconfigured structured errors | [x] Verified | Focused hosted-runtime tests pass for `AURA_PROVIDER_UNCONFIGURED` shape and client metadata preservation. |
| Raw provider/client error leakage | [x] Source-reviewed/test-covered | Generic route errors only include messages in development; provider-unconfigured responses use sanitized metadata; AI error handling redacts likely secrets and prompt-like payloads before Sentry capture. |
| Demo/mock server production exclusion | [x] Verified locally | Docker, Compose, deploy script, and `server:api` no longer start `server/api-server.js`; active docs label it demo/mock-only. |
| WebSocket auth hardening | [x] Verified | Token auth requires `JWT_SECRET`; anonymous/userId-only sessions require explicit non-production demo config. |
| Collaboration editing scope | [x] Verified | Collaborative edit events always emit `COLLABORATION_EDIT_UNSUPPORTED` in 3.3; there is no env flag that enables hosted editing. |
| Redis/cache/rate/cost runtime controls | [x] Verified locally | Hosted-runtime tests cover Redis readiness/config, cache key privacy, route cache hit/miss metadata, rate-limit config, and usage metadata without prompt/response content. |
| Nginx hosted proxy config | [x] Verified locally | Deployment contract tests assert API, WebSocket, `/health`, and frontend upstream routing; CORS/OPTIONS and `server_tokens off` are present in `nginx.conf`; Compose smoke verifies reverse-proxy `/health` over HTTPS with a smoke certificate. |
| Full local test/coverage gate | [x] Verified | `npm test` passed in the earlier full gate; final `npm run release:dry-run` coverage passed with 432 suites / 2373 tests. |
| Release dry-run environment | [x] Verified | `npm run release:dry-run` passed after bumping package metadata to `3.3.0`; npm dry-run publish completed for `aura-glass@3.3.0`. |
| Sentry metadata and release observability | [ ] Partial | `SENTRY_DSN` initializes Sentry and docs mention release metadata; no deployed Sentry event evidence is recorded. |
| TLS/proxy/CORS deployment review | [ ] Pending external | Nginx config, local proxy contracts, and local Compose HTTPS proxy smoke exist, but no live platform review has been recorded. |

## Commands Run

```bash
npm run lint:forbidden
npm run audit:runtime
npx jest tests/hosted-runtime --runInBand --no-cache
npm run test:deployment
npm run test:deployment:compose
npm run build:server
node --check server/api-server.js
node --check server/websocket-server.js
npm test
npm run test:coverage
npm run release:dry-run
git diff --check
```

Recorded results:

- `npm run lint:forbidden`: pass, 2418 files scanned.
- `npm run audit:runtime`: pass, `src`, 760 files, 0 findings.
- `npx jest tests/hosted-runtime --runInBand --no-cache`: 8 suites / 43 tests pass.
- `npm run test:deployment`: pass, 1 suite / 4 tests.
- `npm run test:deployment:compose`: pass; API, WebSocket, Redis, frontend Nginx, and reverse-proxy Nginx smoke passed.
- `npm run build:server`: pass.
- Node syntax checks: pass.
- `npm test`: pass, 427 suites / 2346 tests.
- `npm run test:coverage`: pass inside `npm run release:dry-run`, 432 suites / 2373 tests.
- `npm run release:dry-run`: pass after bumping to `3.3.0`; coverage passed with 432 suites / 2373 tests, pack verification passed, Next React 18/19 integration passed, Vite integration passed, and npm dry-run publish completed.
- `git diff --check`: pass.

## Security Evidence Required Before Final 3.3

- [x] Rerun `npm run lint:forbidden` on the final release candidate.
- [x] Rerun `npm run audit:runtime` on the final release candidate.
- [ ] Record live or staging Sentry DSN, environment, and release metadata behavior without sensitive payloads.
- [ ] Record TLS, proxy headers, CORS origins, rate limits, Redis, and provider-secret storage for the final hosted deployment.
- [x] Docker/Compose smoke recorded before local hosted-runtime deployment claims.
- [ ] Confirm manual accessibility and physical-device certification results before claiming full certification.

## Current Risk Notes

- `server/index.ts` logs request method/path/status/duration with `console.log`. The current runtime cleanliness audit scans `src`, so hosted server log review should remain part of final security sign-off.
- Live provider errors have not been exercised against real provider APIs in this evidence pass. CI uses mocked/provider-unconfigured contracts.
- Sentry is initialized when `SENTRY_DSN` exists, but release-name/commit metadata still needs deployed evidence.
