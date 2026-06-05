# AuraGlass Go-Live Checklist

Audit date: 2026-05-28
Recalculation update: 2026-06-02
3.3 release update: 2026-06-05

## Verdict

AuraGlass is a public library/package and should be judged primarily on package, component, documentation, accessibility, and release quality. The 3.3 package release gates passed and `aura-glass@3.3.0` is published to npm as `latest`. The optional hosted runtime now has local API/WebSocket/Docker/Compose contract evidence, but live provider, Sentry, and physical accessibility certification remain external evidence.

## Code-Complete Score

**97 / 100**

This score is weighted toward remaining package/library code, not hosted demo-server behavior. AuraGlass is strong as a public component/library product: package artifacts, docs, Storybook, build scripts, tests, visual/a11y automation, and runtime cleanliness evidence are present. The remaining code-side gap is mostly package-release verification, export/content polish, and any accessibility fixes discovered during manual certification. Demo/mock hosted server behavior is treated as optional unless AuraGlass is later launched as a hosted API product.

2026-06-05 recalculation: score raised to 97 for the package/library launch scope after the 3.3 release gate, hosted-runtime contract suite, deployment smoke tests, Docker Compose smoke, docs link check, release dry-run, and public npm publish passed. The score is not 100 because manual screen-reader and physical phone/tablet touch certification are still unrecorded.

## Evidence Reviewed

- `reports/3.3-release/README.md` records the final 3.3 package, hosted-runtime, deployment, docs, and release dry-run evidence.
- npm registry verification reports public `latest` as `aura-glass@3.3.0` with modified time `2026-06-05T07:55:20.186Z`.
- `reports/3.3-release/manual-certification-runbook.md` says automated gates pass but manual screen-reader and physical mobile/touch certification are not recorded.
- `reports/3.3-release/hosted-runtime-evidence.md` records local API/WebSocket runtime contracts and Docker/Compose smoke evidence.
- `reports/3.3-release/security-review.md` records auth, provider-unconfigured, runtime cleanliness, and deployment security evidence.
- `docs/deployment.md` documents optional hosted-runtime deployment and provider requirements.
- Source search confirms `server/api-server.js` is now documented as demo/mock-only and is not the production hosted-runtime entrypoint.
- `.env.example`, `docker-compose.yml`, `Dockerfile`, Storybook/build artifacts, CI scripts, and broad test coverage exist.

## Current Readiness

- Library/components: Built package artifacts, docs, Storybook, tests, visual/a11y automation, token/build pipelines, and runtime cleanliness reports exist.
- AI services: OpenAI, Pinecone, Google Vision, Remove.bg, Redis cache, auth, and error-handling service code exists.
- Server: Optional Express API and WebSocket servers exist; production deployment uses the real built TypeScript API server and the WebSocket server, while `server/api-server.js` is demo/mock-only.
- Infra: Docker Compose, Nginx config, deployment script, and production deployment docs exist.

## Library/Package Tasks Remaining

- [x] Confirm the package release scope explicitly excludes the demo/mock API server unless a hosted product is being launched.
- [x] Re-run package release gates:
  - `npm run build`
  - `npm run typecheck`
  - `npm run lint:ci`
  - `npm test`
  - visual/a11y regression scripts used by the 3.3 release.
- [x] Confirm generated `dist/` package contents are complete and do not include test-only files.
- [x] Run npm publish dry run and inspect included files.
- [x] Verify package exports, CJS/ESM/types, tree-shaking, token builds, worker builds, and recipe exports.
- [x] Verify Storybook/docs build renders public release surfaces.
- [x] Confirm examples do not imply unsupported hosted-server capabilities.

## Frontend/Package Tasks Remaining

- [ ] Complete manual screen-reader certification and save results in `reports/3.3-release/accessibility-certification.md`.
- [ ] Complete physical phone/tablet touch certification and save device/browser results.
- [x] Verify docs, examples, recipes, and Storybook accurately describe public-library usage.
- [x] Verify automated component accessibility notes, keyboard behavior, reduced motion, and viewport behavior across current release gates.
- [x] Verify visual regression baselines for the current package version.

## Infrastructure Tasks Remaining

- [x] Maintain npm/package release workflow and GitHub release/tag workflow.
- [ ] Deploy docs/Storybook if they are part of the public release surface.
- [ ] Configure Sentry DSN and release metadata for any live hosted-runtime deployment.
- [ ] Establish rollback/deprecation procedure for bad npm releases.
- [ ] If a hosted demo/API server is later included in launch scope, provision Redis, API host, WebSocket host, TLS, reverse proxy, health checks, logging, and real provider-backed routes.

## Third-Party Environments Required

- npm publishing account and package release workflow. Completed for `aura-glass@3.3.0`.
- GitHub release/tag workflow.
- OpenAI production API key and spending cap.
- Pinecone production project/index.
- Google Cloud Vision API project and service account or API key.
- Remove.bg API key if background removal is shipped.
- Redis production instance.
- Sentry project.
- Optional CDN/Storybook hosting environment.

## Explicit External Dependency Inventory

### Accounts, Providers, And Approvals

- [x] npm organization/user with publish rights for the public package.
- [ ] GitHub repository release/tag permissions.
- [ ] Storybook/docs hosting provider if docs are part of the public release.
- [ ] OpenAI production API account if AI examples/services are included.
- [ ] Pinecone production project/index if semantic search examples/services are included.
- [ ] Google Cloud project with Vision API enabled if vision examples/services are included.
- [ ] Remove.bg account if background-removal examples/services are included.
- [ ] Redis provider if the optional AI/cache server is shipped.
- [ ] Sentry project if runtime error reporting is shipped.
- [ ] Manual accessibility reviewer/device-owner assignments for screen-reader and touch certification.

### Env Vars And Production Secrets To Populate

- [ ] AI: `OPENAI_API_KEY`, `OPENAI_MODEL`.
- [ ] Google Vision: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_VISION_API_KEY`.
- [ ] Pinecone: `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, `PINECONE_INDEX_NAME`.
- [ ] Background removal: `REMOVEBG_API_KEY`.
- [ ] Optional server/cache: `REDIS_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, `BCRYPT_ROUNDS`.
- [ ] Optional collaboration/server URLs: `WEBSOCKET_SERVER_URL`, `COLLABORATION_SERVER_URL`, `IMAGE_SERVICE_URL`.
- [ ] Monitoring/runtime: `SENTRY_DSN`, `NODE_ENV`, `PORT`.
- [ ] Rate/cost controls: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `AI_RATE_LIMIT_MAX_REQUESTS`, `ENABLE_AI_CACHING`, `ENABLE_AI_BATCHING`, `MAX_COST_PER_REQUEST`, `USE_CHEAPER_MODELS_THRESHOLD`.

### App-Store Or Marketplace Reviews

- [x] None required for npm package release.
- [x] npm package publish dry run reviewed before public publish.
- [ ] GitHub release notes reviewed before tagging.

### Live Smoke Evidence Required

- [x] Clean install from packed tarball works in fresh sample apps.
- [x] CJS, ESM, and TypeScript declarations import successfully.
- [ ] Storybook/docs deployment loads public components and recipes.
- [x] Visual regression baseline passes for public components.
- [x] Axe/automated accessibility checks pass.
- [ ] Manual screen-reader certification result is recorded.
- [ ] Physical mobile/touch certification result is recorded.
- [x] Optional AI examples either work with real provider keys or clearly fail closed.

## Final Go/No-Go Checklist

- [x] Public release scope is package/library, with demo server behavior clearly excluded or labeled.
- [ ] Manual accessibility and touch certification are recorded.
- [x] Clean checkout package/build/typecheck/lint/test gates pass.
- [x] npm package dry run is reviewed.
- [x] Package exports, docs, Storybook, examples, and recipes are verified.
- [x] Provider credential absence in optional examples fails clearly without leaking secrets.
- [x] Release notes state exactly what is supported: library/package plus optional self-hosted AI/WebSocket runtime contracts.

## Optional Hosted Server Tasks

Only use this section if AuraGlass is later marketed as a hosted API/server product in addition to the public library.

- [x] Replace or formally remove `server/api-server.js` mock endpoints before any hosted production claim:
  - form generation currently returns a mock response.
  - search currently returns mock search results.
  - analysis currently returns mock analysis output.
- [x] Wire hosted server routes to the real `src/services/ai/*` service layer where 3.3 exposes hosted routes.
- [x] Replace placeholder collaboration operation behavior in `server/websocket-server.js` with explicit unsupported-editing behavior and presence/cursor/selection support.
- [x] Make hosted production boot and provider routes fail closed when required AI, Redis, and JWT settings are missing.
- [x] Add integration tests proving hosted API routes call real provider service boundaries or cleanly return provider-unconfigured errors.
- [x] Verify Redis cache, JWT auth, API key auth, and WebSocket auth under hosted production settings.
