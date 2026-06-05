# AuraGlass by AuraOne 3.3 PRD

## Product Title

AuraGlass 3.3: Hosted AI Runtime And Product Trust

## PRD Filename

`auraglass33PRD.md`

## Owner

AuraOne / AuraGlass package and optional hosted-runtime release

## Target Release

AuraGlass `3.3.0`

## Release Type

Major product release inside the 3.x line. 3.2 shipped the dependency-sovereign package and native app chrome launch. 3.3 should convert the remaining optional AI/server, certification, docs, and workflow follow-ups into a coherent release: production-truthful hosted runtime, completed accessibility certification evidence, sharper package ergonomics, and richer post-3.2 product recipes.

## Source Inputs Reviewed

- `auraglass32PRD.md`: 3.2 PRD structure and release pillar model.
- `GoLiveCheckList.md`: package launch scope, remaining hosted-server tasks, manual certification gaps, and release validation items.
- `README.md`: pre-3.3 package positioning, app surface, recipes, package entrypoints, AI-agent guidance, and release gate language.
- `docs/readme.md`: current docs map, source-of-truth notes, and maintenance rules.
- `docs/ai/*`: AI setup, production infrastructure, API, security, cost, deployment, and quick-start docs.
- `docs/app-shell/readme.md`: app shell surface and migration guidance.
- `docs/workflows/readme.md`: workflow surfaces and required production states.
- `docs/recipes/readme.md`: recipe registry expectations and render evidence.
- `docs/theme/theme-engine.md`: Theme Engine 2.0 baseline and migration notes.
- `docs/components/choosing.md`: public product-family selection guidance.
- `docs/components/marketing/readme.md`: Marketing Kit surface and landing-page guidance.
- `docs/cli/migration.md`: audit, migration, and doctor commands.
- `reports/3.2-release/*`: package evidence, app-chrome visuals, accessibility matrix, recipes, workflow components, Storybook, bundle analysis, and completion audit.
- `reports/ai-server-security-review.md`: AI/server security hardening completed and remaining security follow-ups.
- `server/api-server.js`, `server/index.ts`, `server/websocket-server.js`, `src/lib/ai-client.ts`, `src/services/ai/*`, `src/services/auth/*`, `src/services/websocket/*`: current optional runtime implementation.
- `Dockerfile`, `docker-compose.yml`, `scripts/deploy.sh`, `.env.example`, `nginx.conf`, `server/README.md`, `docs/deployment.md`: current deployment, port, and hosted-runtime documentation.

## Executive Summary

AuraGlass 3.2 successfully launched the public package story: first-party icons, first-party primitives, app shell, workflow components, Theme Engine 2.0, recipe registry, migration CLI, package export gates, pack checks, Vite/Next integration, Storybook evidence, and visual/a11y automation.

The remaining gaps are no longer about whether AuraGlass can be published as a package. They are about trust, clarity, and next-level product usefulness:

- The repository contains an optional hosted AI/server story, but the production-ish Docker and deployment paths still point at a legacy mock API server.
- The real TypeScript API server exists, but port conventions, script names, docs, and client defaults are inconsistent.
- The WebSocket server has authenticated room/presence behavior, but collaborative editing still uses placeholder operation transformation.
- The AI docs claim production infrastructure in some places while other evidence says hosted server behavior is optional or demo-shaped.
- Manual screen-reader and physical-device touch certification remain unrecorded.
- The package root export remains broad; 3.2 added targeted subpaths, but 3.3 should continue moving high-value surfaces into smaller, clearer entrypoints.
- README and docs contain stale links and inconsistent recipe counts after the 3.2 launch.

AuraGlass 3.3 should turn this into a stronger product:

- A clean optional hosted runtime path that is either fully provider-backed and tested or explicitly excluded from supported production claims.
- Provider-unconfigured behavior that fails clearly, safely, and without leaking secrets.
- A single documented API/WebSocket port and environment variable contract.
- Real integration tests for hosted AI, auth, Redis, WebSocket auth, and collaboration behavior.
- Completed manual accessibility/touch certification evidence.
- Expanded 3.3 recipes for AI, collaboration, analytics, commerce, support, media, and marketing surfaces.
- Documentation that consistently says what AuraGlass supports as a public library, as optional backend services, and as demos.

## Current State Audit

### 3.2 Baseline Package Foundation

The 3.2 baseline package had strong evidence for public-library readiness:

- `reports/3.2-release/README.md` records passing build, typecheck, dependency sovereignty, CLI, exports, tree-shaking, Vite, recipe render, Storybook, pack, a11y, app-chrome visual, Jest, Next, lint, and dry-run metadata gates.
- `reports/3.2-release/recipe-evidence.md` records 20 registry recipes rendered through the public CLI.
- `reports/3.2-release/bundle-analysis.md` records strict tree-shaking and pack verification.
- `reports/3.2-release/workflow-components.md` records production workflow components and focused tests.
- `reports/3.2-release/accessibility-certification.md` records automated accessibility evidence, browser keyboard checks, axe checks, mobile viewport screenshots, and known manual certification gaps.

### Optional Hosted Runtime Current State

There are two API server stories in the repo:

- `server/index.ts` is the real TypeScript API server that imports `OpenAIService`, `SemanticSearchService`, `VisionService`, and `AuthService`.
- `server/api-server.js` is a legacy/mock server that still returns hardcoded AI responses for form generation, search, image analysis, and document indexing.

Production-ish entrypoints currently point at the legacy/mock server:

- `Dockerfile` runs `node server/api-server.js`.
- `docker-compose.yml` runs `node server/api-server.js` for the `api` service.
- `scripts/deploy.sh` starts `server/api-server.js` through PM2 or direct Node.
- `docs/deployment.md` uses `server/api-server.js` in production instructions.

The hosted-runtime story must be resolved before AuraGlass 3.3 makes any hosted production claim.

### Port And Environment Contract Mismatch

The optional AI/server port contract is inconsistent:

- `server/index.ts` defaults API server to `API_SERVER_PORT || 3001`.
- `server/api-server.js` defaults legacy API server to `API_PORT || 3002`.
- `server/websocket-server.js` defaults WebSocket server to `WS_PORT || 3001`.
- `src/lib/ai-client.ts` defaults `apiUrl` to `http://localhost:3001` and `wsUrl` to `ws://localhost:3002`.
- `.env.example` says `WEBSOCKET_SERVER_URL=ws://localhost:3001`, but its quick-start comment says API is on `3001` and WebSocket is on `3002`.
- `docker-compose.yml`, `Dockerfile`, `scripts/deploy.sh`, `nginx.conf`, and `docs/deployment.md` mostly treat API as `3002` and WebSocket as `3001`.
- `docs/ai/setup-guide.md` and `docs/ai/quick-start.md` use API `3001` in several examples.

3.3 must define and enforce one contract.

### WebSocket And Collaboration Current State

`server/websocket-server.js` includes:

- JWT verification when a token is provided.
- Redis-backed room state and cursor persistence.
- Presence, selection, cursor, join, leave, and create-room events.

Collaborative edit behavior is intentionally scoped out of 3.3:

- `collaborative-edit` emits `COLLABORATION_EDIT_UNSUPPORTED`.
- There is no formal conflict model because editing is not enabled.
- There is no documented authorization model for room/document edit operations because editing is not enabled.
- There is no multi-process Socket.IO Redis adapter setup.
- There are no hosted-production integration tests proving auth, Redis, and collaboration semantics beyond the focused WebSocket runtime contract suite.

### Accessibility And Certification Current State

`reports/3.2-release/accessibility-certification.md` explicitly states that it is not a completed manual screen-reader certification report. It records automated evidence and partial status for several surfaces.

Still open:

- Manual screen-reader pass for menus, selects, comboboxes, dialogs, drawers, popovers, tooltips, tabs, command palette, app-shell navigation, toasts, and notification center.
- Physical phone/tablet touch pass with device/browser details.
- Focused menubar, toast, and notification-center certification beyond source/export evidence.
- Route-level screen-reader and physical touch notes for production workflow surfaces.

### Documentation Current State

Docs were broad and useful, but 3.3 needed to clean up post-launch inconsistency:

- README said 3.2 included 10 launch recipes in one section while release evidence said 20 recipes.
- README recipe acceptance links still pointed to 3.1 evidence in one place.
- AI production docs contained examples that imported from `../server/services/...`, while package service exports live under `aura-glass/services/...` and source services live under `src/services/...`.
- Deployment docs still pointed at `server/api-server.js`.
- Some docs described the AI system as production-ready, while the go-live checklist explicitly treated hosted demo/API server completeness as optional unless launched as a hosted product.

## Problem Statement

AuraGlass 3.2 makes the package credible as a production React/Next.js component system. The next problem is product trust beyond the package:

- Developers should not be confused about whether AuraGlass ships a production hosted AI server, a demo server, service classes for their own backend, or all of those.
- Production deployment paths should not start mock routes.
- Optional provider-backed routes should fail closed when secrets or providers are missing.
- AI examples should be safe and truthful even when users have no provider keys.
- Collaboration should not appear production-grade if operation semantics are placeholder.
- Accessibility claims should not outrun completed manual certification.
- Documentation should be internally consistent after the 3.2 launch.

3.3 should make AuraGlass easier to trust, easier to operate, easier to verify, and harder to misuse.

## Goals

- Resolve the hosted API/server scope: fully support it as optional production runtime, or formally remove/demo-label it from production launch claims.
- Replace or remove `server/api-server.js` mock endpoints from all production paths.
- Standardize API and WebSocket ports, environment variables, client defaults, Docker, deploy scripts, docs, and health checks.
- Wire hosted AI routes to real `src/services/ai/*` service layer behavior.
- Add provider-unconfigured error handling that is clear, typed, status-coded, and secret-safe.
- Make hosted production boot fail closed when required AI, Redis, JWT, auth, and route settings are missing.
- Add integration tests for hosted API routes, auth, provider-unconfigured failures, Redis cache behavior, API key/JWT behavior, WebSocket auth, and collaboration events.
- Replace placeholder collaboration operation behavior with a real operation model or explicitly document collaboration editing as unsupported in the hosted runtime.
- Complete manual screen-reader and physical-device touch certification for the app-chrome and workflow surfaces launched in 3.2.
- Expand 3.3 recipes with production-state coverage, optional hosted AI wiring, and safe provider-missing behavior.
- Keep root package bundle growth under control by adding targeted subpaths where valuable.
- Clean up README/docs/version/recipe/evidence inconsistencies.
- Create a `reports/3.3-release` evidence scaffold and CI gates that match the final 3.3 claims.

## Non-Goals

- Do not turn AuraGlass into a mandatory hosted SaaS product. The public package must remain useful without running AuraOne-hosted infrastructure.
- Do not bundle provider SDKs into the root UI entrypoint.
- Do not require OpenAI, Pinecone, Google Vision, Remove.bg, Redis, Socket.IO server, or Sentry for core UI package usage.
- Do not claim full enterprise data-grid parity, full CRDT suite parity, or full managed auth product parity unless implemented and tested.
- Do not copy third-party implementation code for collaboration, AI, primitives, icons, or routing.
- Do not break existing 3.2 package imports unless the change is explicitly documented as a necessary 3.3 compatibility break.
- Do not publish hosted-server production claims without integration evidence.
- Do not mark accessibility certification complete without recorded human screen-reader and physical-device results.

## Positioning

### Before 3.3

AuraGlass is a strong public npm package for Liquid Glass app surfaces. It includes optional AI service classes and server files, but the hosted server story is mixed between real TypeScript service wiring, legacy mock routes, inconsistent deployment paths, and partially stale docs.

### After 3.3

AuraGlass is a trusted Liquid Glass product system with a clear boundary:

- As a package, it remains dependency-sovereign, SSR-safe, tree-shakable through subpaths, and production-proven through release evidence.
- As optional backend/service code, it either ships a real provider-backed hosted runtime with fail-closed deployment and tests, or it is clearly documented as service-layer building blocks plus local demos only.
- As a documentation set, it accurately tells users what is supported, what needs provider credentials, what fails closed, and what remains experimental.

## Product Promise

Developers should be able to choose one of two clear paths:

### Package-Only Path

```bash
npm install aura-glass
```

Then build a premium app UI without running AuraGlass servers:

```tsx
import { GlassAppShell, GlassCard, GlassButton } from 'aura-glass';
import 'aura-glass/styles';
```

### Optional Hosted Runtime Path

Developers who opt into backend features should get one documented runtime path:

```bash
npm run build:server
npm run server:all
```

That path must:

- Start the real provider-backed API server, not mock routes.
- Start the WebSocket server with authenticated behavior.
- Fail clearly if required environment variables are missing.
- Expose health/readiness endpoints that distinguish process health from provider readiness.
- Return provider-unconfigured errors when optional features are disabled or missing credentials.
- Never leak provider keys, JWT secrets, raw provider errors, or sensitive prompt content.

## 3.3 Release Pillars

## Pillar 1: Hosted Runtime Scope And Deployment Truth

### Objective

Make the optional hosted runtime truthful, testable, and production-safe. Every production path must either run the real server or explicitly label itself as a local demo.

### Requirements

- Define whether 3.3 supports a hosted API/server product in addition to the package.
- If hosted runtime is supported, remove `server/api-server.js` from production paths.
- If hosted runtime is not supported, rename or relocate `server/api-server.js` to a demo-only path and remove it from production docs, Docker, and deploy scripts.
- Update `Dockerfile` to run the real built API server if hosted runtime is supported.
- Update `docker-compose.yml` to use the real API command, correct ports, and readiness checks.
- Update `scripts/deploy.sh` to start the real API server and fail on required env mistakes.
- Update `docs/deployment.md`, `server/README.md`, and `docs/ai/*` to match the chosen scope.
- Add `reports/3.3-release/hosted-runtime-evidence.md`.

### Acceptance Criteria

- [x] `server/api-server.js` is not referenced by `Dockerfile`, `docker-compose.yml`, `scripts/deploy.sh`, `docs/deployment.md`, or production README instructions unless explicitly labeled demo-only.
- [x] Production API startup runs the real TypeScript-built API server.
- [x] `npm run server:api` starts the same API path documented in Docker/deploy docs.
- [x] Docker health check points at the real API health endpoint and correct port.
- [x] Hosted runtime scope is stated in README and 3.3 release notes.
- [x] Local demo behavior is opt-in and cannot be mistaken for production provider behavior.
- [x] `reports/3.3-release/hosted-runtime-evidence.md` records startup, health, readiness, and route smoke results.

## Pillar 2: API, WebSocket, And Environment Contract

### Objective

Establish one canonical API/WebSocket contract across client defaults, server defaults, environment variables, Docker, docs, and tests.

### Canonical Contract To Decide

Choose one of these and enforce it everywhere:

| Service | Recommended local port | Environment variable |
| --- | ---: | --- |
| Frontend/demo app | `3000` | `PORT` or framework-specific app port |
| API server | `3002` | `API_SERVER_PORT` |
| WebSocket server | `3001` | `WS_PORT` |
| Public API URL | `http://localhost:3002` | `NEXT_PUBLIC_API_URL` |
| Public WebSocket URL | `ws://localhost:3001` | `NEXT_PUBLIC_WS_URL` |

The recommendation above matches Docker, Nginx, deploy script summaries, and `docs/deployment.md` more closely than the current `src/lib/ai-client.ts` defaults.

### Requirements

- Standardize on `API_SERVER_PORT` rather than split `API_PORT`/`API_SERVER_PORT`.
- Standardize on `WS_PORT` rather than mixed `WEBSOCKET_SERVER_PORT` naming.
- Fix `src/lib/ai-client.ts` defaults to the canonical API and WebSocket URLs.
- Fix `.env.example` quick-start comments and runtime values.
- Fix `docs/ai/setup-guide.md`, `docs/ai/quick-start.md`, `docs/ai/production-infrastructure.md`, `server/README.md`, and `docs/deployment.md`.
- Add a config validation helper for public URLs and server ports.
- Add tests asserting default client URLs match documented defaults.

### Acceptance Criteria

- [x] `rg "3001|3002|API_PORT|API_SERVER_PORT|WS_PORT|WEBSOCKET_SERVER_PORT|NEXT_PUBLIC_API_URL|NEXT_PUBLIC_WS_URL"` shows only intentional canonical usage.
- [x] `src/lib/ai-client.ts` defaults match `.env.example` and docs.
- [x] API and WebSocket URLs in Docker, Nginx, deploy script, and docs agree.
- [x] A focused test verifies AI client default URL behavior.
- [x] `.env.example` includes a production-safe warning for secrets and a clear local-dev port map.
- [x] The release evidence records a local API/WebSocket smoke run using the canonical ports.

## Pillar 3: Provider-Backed AI Routes

### Objective

Replace mock hosted AI behavior with real service-layer calls, or return provider-unconfigured responses when optional providers are not configured.

### Required Routes

| Route | Required behavior |
| --- | --- |
| `POST /api/ai/generate-form` | Calls `OpenAIService.generateFormFieldSuggestions()` or returns provider-unconfigured. |
| `POST /api/ai/search` | Calls OpenAI query enhancement and `SemanticSearchService.hybridSearch()` when semantic search is enabled. |
| `POST /api/ai/index-documents` | Calls `SemanticSearchService.indexDocuments()` when Pinecone/search is configured. |
| `POST /api/ai/analyze-image` | Calls `VisionService` methods when Google Vision is configured. |
| `POST /api/ai/remove-background` | Calls Remove.bg integration only when configured. |
| `POST /api/ai/summarize` | Calls `OpenAIService.generateContentSummary()`. |

### Provider-Unconfigured Contract

Provider-unconfigured responses should be structured:

```json
{
  "error": "Provider not configured",
  "code": "AURA_PROVIDER_UNCONFIGURED",
  "provider": "openai",
  "feature": "generate-form",
  "docsUrl": "https://..."
}
```

Requirements:

- Use `503 Service Unavailable` or `424 Failed Dependency`; pick one and document it.
- Do not include raw provider stack traces in production.
- Do not include API keys, prompt content, credentials paths, or raw provider error objects.
- Include enough metadata for developers to fix configuration.
- Support feature flags for optional routes.

### Acceptance Criteria

- [x] Hosted AI routes no longer return hardcoded mock success responses in production paths.
- [x] Provider-missing cases return the structured provider-unconfigured shape.
- [x] Provider errors are sanitized in production.
- [x] Request validation rejects missing context/query/documents/image/content before provider calls.
- [x] Rate limiting applies to all AI routes.
- [x] Auth applies to all AI routes.
- [x] Tests cover success with mocked providers and unconfigured failures without real provider credentials.
- [x] Docs include cURL examples for success and provider-unconfigured responses.

## Pillar 4: Auth, API Keys, And Fail-Closed Startup

### Objective

Make hosted production startup and request authorization fail closed by default.

### Requirements

- `AuthService` already requires `JWT_SECRET` outside test environments; hosted startup should surface this clearly.
- Required env validation should run before the API server listens.
- Required variables should depend on feature scope:
  - Core hosted API: `JWT_SECRET`, `API_SERVER_PORT`, `CORS_ORIGIN` or `CLIENT_URL`.
  - OpenAI features: `OPENAI_API_KEY`, `OPENAI_MODEL`.
  - Semantic search: `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, `PINECONE_INDEX_NAME`.
  - Vision: `GOOGLE_CLOUD_PROJECT_ID`, credentials path or `GOOGLE_VISION_API_KEY`.
  - Background removal: `REMOVEBG_API_KEY`.
  - Cache/collaboration: `REDIS_URL`.
  - Monitoring: `SENTRY_DSN`, release name, environment.
- API key auth must be documented and tested if supported.
- JWT auth, refresh, revocation, and permissions must have integration coverage.
- Demo auth must remain disabled by default and opt-in only for local demos.

### Acceptance Criteria

- [x] Hosted production startup fails before listening when required env is missing.
- [x] Missing optional provider settings do not crash unrelated routes; they return provider-unconfigured when called.
- [x] JWT auth tests cover login, refresh, logout/revoke, protected route access, invalid token, expired token, and missing token.
- [x] API key auth tests cover accepted header path and rejected query-string credentials.
- [x] Demo auth cannot be enabled accidentally in `NODE_ENV=production`.
- [x] Sentry release metadata can be configured and is documented.
- [x] Secret scan still passes through `npm run lint:forbidden`.

## Pillar 5: Redis, Caching, Rate Limits, And Cost Controls

### Objective

Make optional AI cost controls real enough to trust in a hosted runtime.

### Requirements

- Redis connection should be explicit for hosted caching/collaboration features.
- Cache service should support connect, health, get, set, delete, TTL, and graceful degradation rules.
- AI cache keys must avoid raw prompt leakage and should use stable hashing.
- Rate limits should be per IP and per authenticated user where possible.
- Cost controls should be configurable with env variables already listed in `.env.example`.
- Usage metadata should record provider, feature, model, token estimate, cache hit, and cost estimate without logging sensitive content.
- Add route-level tests for rate limit behavior where practical.

### Acceptance Criteria

- [x] `ENABLE_AI_CACHING=true` requires `REDIS_URL` in hosted production.
- [x] Cache failures do not leak provider data or crash unrelated UI package imports.
- [x] AI route responses can indicate `cached: true` where implemented.
- [x] Rate limit config is documented and tested at least at middleware/unit level.
- [x] Cost-control docs reflect current env names and runtime behavior.
- [x] `reports/3.3-release/ai-cost-and-cache-evidence.md` records current cache and rate-limit status, including remaining fixture/test gaps.

## Pillar 6: Collaboration Runtime

### Objective

Replace placeholder collaboration operation behavior or formally scope hosted collaboration to presence/cursor-only until a real model exists.

### Decision Required

Pick one:

1. Implement production collaboration editing with a real operation model.
2. Use a proven CRDT/OT library such as Yjs or ShareJS for document state.
3. Scope 3.3 hosted collaboration to auth, presence, room, cursor, and selection only; document editing as unsupported.

### Requirements If Editing Is Supported

- Define document model, operation schema, versioning, and conflict behavior.
- Validate every incoming operation.
- Authorize room/document edits.
- Persist room/document state through Redis or a documented backing store.
- Support multi-process Socket.IO Redis adapter if horizontally scaled.
- Add tests for concurrent edits, stale operations, unauthorized edits, and room isolation.
- Emit typed error events for rejected operations.

### Requirements If Editing Is Not Supported

- Remove edit claims from production docs.
- Emit a clear unsupported-feature error for collaborative edit events in hosted production.
- Keep presence, room, cursor, and selection behavior documented and tested.

### Acceptance Criteria

- [x] `applyOperationalTransform()` is no longer a placeholder in hosted production behavior.
- [x] Collaboration editing is either implemented and tested or explicitly unsupported.
- [x] WebSocket auth requires `JWT_SECRET` for token verification.
- [x] Anonymous/userId-only sessions are allowed only when explicitly configured for local demos.
- [x] Redis room state tests cover create, join, leave, cleanup, and cursor expiration.
- [x] Multi-client WebSocket integration smoke exists.
- [x] Docs distinguish collaboration presence from collaborative document editing.

## Pillar 7: Accessibility And Physical Device Certification

### Objective

Finish the manual certification work intentionally deferred after 3.2.

### Required Surfaces

- Menu / dropdown menu.
- Menubar.
- Select.
- Combobox.
- Dialog.
- Drawer.
- Popover.
- Tooltip.
- Tabs.
- Command palette.
- App shell navigation.
- Workspace tabs.
- Toast and notification center.
- Production workflow components.
- Mobile shell and app-chrome responsive states.

### Required Environments

- macOS with VoiceOver and Safari or Chrome.
- Windows with NVDA or JAWS if available.
- One physical iOS or Android phone.
- One physical tablet if available.
- Reduced-motion and high-contrast settings where supported.

### Requirements

- Record reviewer, date, package version, commit, OS, browser, screen reader, device, viewport, result, notes, and follow-ups.
- Move `reports/3.2-release/accessibility-certification.md` from partial automated ledger to final 3.3 certification evidence, or create `reports/3.3-release/accessibility-certification.md`.
- Add focused automated coverage for menubar, toast, and notification center gaps called out in 3.2.
- Convert manual issues into code tasks before release sign-off.

### Acceptance Criteria

- [ ] Manual screen-reader certification is recorded.
- [ ] Physical phone/touch certification is recorded.
- [ ] Physical tablet/touch certification is recorded or explicitly unavailable with rationale.
- [ ] Menubar, toast, and notification center have focused automated and manual evidence.
- [ ] Any manual certification failures are fixed or explicitly deferred with non-blocking rationale.
- [x] README and release notes only claim the level of certification actually recorded.

### Remaining External Blocker

These unchecked items require a human reviewer with real assistive technology and physical devices. Automated tests, browser emulation, CI, and agent inspection cannot prove them. Record results in `reports/3.3-release/accessibility-certification.md` using `reports/3.3-release/manual-certification-runbook.md`; only then mark the manual certification items complete.

## Pillar 8: Package Surface, Subpaths, And Bundle Ergonomics

### Objective

Continue the 3.2 move toward smaller, clearer entrypoints without breaking the root package API.

### Candidate New Or Formalized Entrypoints

```txt
aura-glass/forms
aura-glass/data
aura-glass/navigation
aura-glass/overlays
aura-glass/workflows
aura-glass/marketing
aura-glass/ai
aura-glass/services/ai/config
aura-glass/services/ai/cache-service
aura-glass/services/ai/semantic-search-service
aura-glass/services/auth
```

### Requirements

- Audit root package export size and high-frequency import paths.
- Add subpaths only where they materially improve bundle clarity or ergonomics.
- Ensure each new subpath has ESM, CJS where supported, and declaration coverage.
- Update `tests/exports/*`, `scripts/ci/verify-tree-shaking.js`, `scripts/ci/run-vite-integration.js`, and `scripts/ci/verify-pack.js`.
- Keep optional provider SDKs out of root UI imports.
- Keep `aura-glass/server` SSR helper semantics distinct from hosted API server docs.

### Acceptance Criteria

- [x] New subpaths have package export map entries.
- [x] New subpaths pass CJS, ESM, TypeScript, Vite, and Next integration tests.
- [x] Root package import behavior remains backward-compatible.
- [x] Bundle scenarios are measured before and after.
- [x] Optional provider SDKs do not enter root app bundle scenarios.
- [x] Docs explain when to use root imports versus subpath imports.

## Pillar 9: 3.3 Recipes, Templates, And Agent Starters

### Objective

Build on the 20 3.2 recipes with deeper production starters and optional AI/server integration examples that fail safely without provider credentials.

### Recipe Upgrade Requirements

- Every 3.3 recipe must scaffold a real product surface, not a decorative preview.
- Every 3.3 recipe must include empty/loading/error states where natural.
- Every 3.3 recipe must use AuraGlass icons and package-owned components for core UI.
- AI/server recipes must default to provider-unconfigured UI states unless a user wires credentials.
- Recipes must not imply hosted-server support beyond what 3.3 actually ships.
- Recipes must render through `npm run test:recipes:render`.

### Candidate New Recipes

- `ai-ops-control-room`: AI usage, provider status, cost budget, rate limits, and prompt safety review.
- `semantic-search-console`: indexed documents, query testing, relevance tuning, and provider-unconfigured state.
- `vision-review-workbench`: image upload, OCR/object/safe-search result panels, and missing-provider state.
- `collaboration-room-console`: room presence, cursor activity, selection state, and unsupported editing state if editing is not shipped.
- `support-triage-workspace`: customer support queue, SLA status, AI summary action, and safe fail-closed action state.
- `release-command-center`: release checklist, rollout status, changelog preview, evidence links, and rollback actions.
- `developer-docs-portal`: docs navigation, code blocks, examples, and package entrypoint selector.
- `marketing-launch-kit`: AuraGlass marketing surfaces with install command, feature tiles, product proof, and visual evidence section.

### Acceptance Criteria

- [x] Registry exposes all 3.3 recipes with titles, categories, descriptions, accessibility notes, performance notes, and files.
- [x] CLI `list`, `info`, `add`, `add all`, `--dry-run`, `--json`, and `--out` work for new recipes.
- [x] Recipe render evidence includes screenshots for all 3.3 recipes.
- [x] AI/server recipes render cleanly with no provider keys.
- [x] AI/server recipes can be smoke-tested against mocked provider-backed routes.
- [x] Docs list 3.3 recipes and remove stale 3.1 recipe evidence links from current README sections.

## Pillar 10: Theme Engine, Marketing Kit, And Product Polish

### Objective

Use 3.3 to make the product feel more complete after the technical 3.2 foundation: better theme packaging, clearer marketing surfaces, and richer visual QA.

### Requirements

- Add theme presets or starter themes for common product domains: SaaS admin, AI command center, media review, commerce operations, support console, docs portal, and marketing launch.
- Add a theme preview recipe or Storybook story that compares density, motion, and contrast policies.
- Expand Marketing Kit examples with production-ready hero, feature grid, install section, changelog section, and social proof section.
- Add visual regression coverage for marketing surfaces if they are part of 3.3 public launch.
- Update docs to distinguish app UI components from marketing components.
- Ensure all theme and marketing examples use tokenized colors and reduced-motion-safe animations.

### Acceptance Criteria

- [x] Theme presets are exported or documented through stable public APIs.
- [x] Marketing Kit docs include complete page-level composition examples.
- [x] Storybook has 3.3 theme/marketing showcase stories.
- [x] Visual evidence is recorded under `reports/3.3-release`.
- [x] Token validation and style audit pass.
- [x] Reduced-motion visual baselines pass.

## Pillar 11: Documentation Truth And Release Messaging

### Objective

Make all current docs align with the final 3.3 release surface.

### Required Docs Updates

- `README.md`
  - Update version to 3.3.0 when release work lands.
  - Correct recipe count language.
  - Replace stale 3.1 recipe evidence links with current 3.3 evidence.
  - State package-only versus optional hosted-runtime scope.
  - Add provider-unconfigured behavior notes.
- `docs/readme.md`
  - Update source-of-truth bullets for 3.3.
  - Add `reports/3.3-release`.
- `docs/ai/*`
  - Fix source/package import paths.
  - Align ports and env names.
  - Remove unsupported production claims.
  - Add provider-unconfigured examples.
  - Add auth/rate-limit/cost/security verification notes.
- `docs/deployment.md`
  - Replace legacy mock server production instructions.
  - Standardize Docker/PM2/systemd examples.
- `server/README.md`
  - Clarify real API server, demo server, and WebSocket support boundaries.
- `docs/components/choosing.md`
  - Update counts and product-family language if entrypoints or recipes change.
- `docs/recipes/readme.md`
  - Add 3.3 recipe list and acceptance rules.
- `CHANGELOG.md`
  - Add 3.3 changes with support scope clarity.

### Acceptance Criteria

- [x] `rg "3.1 release scaffold|10 launch recipes|server/api-server.js|API Server on http://localhost:3001|WebSocket Server on http://localhost:3002"` finds no stale current-release guidance, except historical reports.
- [x] Current docs do not call mock/demo server behavior production-ready.
- [x] Docs contain one port/env contract.
- [x] AI docs use valid package/source import paths.
- [x] README, docs index, release notes, and go-live checklist agree on 3.3 support scope.
- [x] Markdown link checks pass if available.

## Pillar 12: Security, Observability, And Runtime Cleanliness

### Objective

Raise the bar for optional backend behavior to match the package-quality bar.

### Requirements

- Sentry DSN and release metadata documented for API and frontend contexts.
- Structured errors and breadcrumbs avoid secrets and sensitive prompts.
- Request IDs or correlation IDs included in API responses/logs where practical.
- Health endpoint distinguishes process health from provider readiness.
- Readiness endpoint covers configured providers, Redis, auth secret, and feature flags.
- Runtime cleanliness audit remains clean for production source.
- Forbidden secret scan remains active.
- Dependency audit and package provenance are included in release gates.

### Acceptance Criteria

- [x] `npm run audit:runtime` passes or records only intentional findings.
- [x] `npm run lint:forbidden` passes.
- [x] Hosted API logs are structured enough to debug without leaking secrets.
- [x] Sentry release metadata can be set and appears in docs.
- [x] `/health` and `/ready` semantics are documented and tested.
- [x] Security review is updated in `reports/3.3-release/security-review.md`.

## Detailed Implementation Plan By File Area

## Phase 0: 3.3 Baseline Audit

- [x] Create `reports/3.3-release/README.md`.
- [x] Snapshot current `npm run build`, `npm run typecheck`, `npm run lint:ci`, `npm test`, `npm run verify:pack`, `npm run test:exports`, and `npm run test:integration:vite`.
- [x] Snapshot current hosted-runtime references to `server/api-server.js`.
- [x] Snapshot current port/env mismatches.
- [x] Snapshot current accessibility manual-certification gaps.
- [x] Snapshot README/docs stale current-release references.
- [x] Record decisions for hosted-runtime scope and collaboration editing scope.

## Phase 1: Hosted Runtime Decision And Naming

- [x] Decide whether `server/api-server.js` is removed, renamed to demo-only, or kept only behind explicit `ENABLE_DEMO_API=true`.
- [x] Decide canonical API and WebSocket ports.
- [x] Decide canonical env variable names.
- [x] Decide whether hosted collaboration editing is supported in 3.3.
- [x] Decide whether optional provider service classes remain package exports or move to clearer subpaths.
- [x] Document decisions in `reports/3.3-release/scope-decisions.md`.

## Phase 2: Server Entrypoint Cleanup

- [x] Update `package.json` server scripts to run the real API server.
- [x] Update `Dockerfile` command and health check.
- [x] Update `docker-compose.yml` API command, env vars, and health/readiness behavior.
- [x] Update `scripts/deploy.sh` to fail on missing env and start real API path.
- [x] Update `nginx.conf` only if port/service names change.
- [x] Add smoke tests for `npm run server:build-and-start` if practical.

## Phase 3: Runtime Config And Fail-Closed Validation

- [x] Add a hosted runtime config module for env parsing and validation.
- [x] Add feature flags for OpenAI, semantic search, vision, background removal, cache, and collaboration.
- [x] Add provider-unconfigured error helpers.
- [x] Add production startup validation.
- [x] Add tests for missing required env and missing optional providers.
- [x] Update `.env.example`.

## Phase 4: Provider-Backed API Route Hardening

- [x] Ensure `/api/ai/generate-form` calls real OpenAI service or returns provider-unconfigured.
- [x] Ensure `/api/ai/search` calls real OpenAI/Pinecone services or returns provider-unconfigured.
- [x] Ensure `/api/ai/index-documents` calls real indexing behavior or returns provider-unconfigured.
- [x] Ensure `/api/ai/analyze-image` calls real Vision service or returns provider-unconfigured.
- [x] Ensure `/api/ai/remove-background` calls real Remove.bg integration or returns provider-unconfigured.
- [x] Ensure `/api/ai/summarize` calls real OpenAI service or returns provider-unconfigured.
- [x] Add mocked provider integration tests.
- [x] Add error sanitization tests.

## Phase 5: Auth, API Keys, And Middleware

- [x] Add hosted API integration tests for JWT login/register/refresh/logout.
- [x] Add protected route tests.
- [x] Add permission tests if route permissions are enforced.
- [x] Add API key auth route/middleware tests if API key support is part of hosted runtime.
- [x] Ensure query-string credentials are rejected.
- [x] Ensure demo auth is disabled in production.

## Phase 6: Redis, Cache, Rate Limit, And Cost Controls

- [x] Add Redis connection/readiness checks.
- [x] Add cache service tests using mocked Redis or a disposable Redis fixture.
- [x] Add AI cache hit/miss tests where caching is enabled.
- [x] Add rate-limit middleware tests.
- [x] Add cost metadata and usage telemetry tests.
- [x] Update cost optimization docs.

## Phase 7: Collaboration Runtime

- [x] Choose CRDT/OT/no-editing path.
- [x] If CRDT/OT is chosen, add dependency decision and bundle isolation plan. Not applicable for 3.3 because no-editing was chosen.
- [x] Add operation schema and validation. Not applicable for 3.3 because collaborative editing is unsupported.
- [x] Add room/document authorization. Not applicable for 3.3 because collaborative editing is unsupported.
- [x] Add multi-client WebSocket tests.
- [x] Add Redis adapter or document single-process limitation.
- [x] Update collaboration docs and recipe states.

## Phase 8: Accessibility Certification Completion

- [ ] Execute screen-reader runbook.
- [ ] Execute physical phone/touch runbook.
- [ ] Execute tablet/touch runbook or document why unavailable.
- [x] Add focused menubar tests.
- [x] Add focused toast/notification center tests.
- [ ] Fix code issues found during manual QA.
- [x] Record automated evidence and manual placeholders in `reports/3.3-release/accessibility-certification.md`.

Manual runbook execution remains external. Do not mark these lines complete until reviewer/device evidence is recorded.

## Phase 9: Package Subpaths And Bundle Ergonomics

- [x] Audit root export usage and subpath candidates.
- [x] Add selected subpath entrypoints.
- [x] Add CJS/ESM/types export tests.
- [x] Update tree-shaking scenarios.
- [x] Update Vite/Next integration smoke imports.
- [x] Update README and docs with subpath guidance.

## Phase 10: 3.3 Recipes And Storybook

- [x] Add new 3.3 recipes to `src/registry/recipes.ts`.
- [x] Add safe AI/server-unconfigured UI states to relevant recipes.
- [x] Add Storybook stories for 3.3 product surfaces.
- [x] Update `scripts/ci/verify-recipes-render.js` outputs for `reports/3.3-release`.
- [x] Capture recipe screenshots.
- [x] Add recipe docs.

## Phase 11: Documentation Cleanup

- [x] Update README current version, release surface, recipe count, and evidence links.
- [x] Update docs index.
- [x] Update AI docs and deployment docs.
- [x] Update server README.
- [x] Update installation guide if new optional peers or env vars are added.
- [x] Update changelog.
- [x] Run stale-text/current-state scan.
- [x] Run markdown link checks if available.

## Phase 12: Release Evidence And Final Gates

- [x] `npm run build`
- [x] `npm run typecheck`
- [x] `npm run lint:ci`
- [x] `npm test`
- [x] `npm run test:exports`
- [x] `npm run test:types`
- [x] `npm run test:integration:vite`
- [x] `npm run test:integration:next -- --skip-build`
- [x] `npm run test:recipes:render`
- [x] `npm run test:visual:app-chrome`
- [x] `npm run test:a11y`
- [x] `npm run test:a11y:app-chrome`
- [x] Hosted runtime integration suite.
- [x] WebSocket runtime contract suite.
- [x] `npm run verify:pack`
- [x] `npm pack --dry-run --json`
- [x] `git diff --check`
- [x] `npm run release:dry-run` reaches npm after passing `ci` and `prepublishOnly`; final dry-run passed after bumping the package version to `3.3.0`.

## File-Level Checklist

### Server And Runtime

- [x] `server/index.ts`
- [x] `server/api-server.js`
- [x] `server/websocket-server.js`
- [x] `server/README.md`
- [x] `src/services/ai/config.ts`
- [x] `src/services/ai/openai-service.ts`
- [x] `src/services/ai/semantic-search-service.ts`
- [x] `src/services/ai/vision-service.ts`
- [x] `src/services/ai/cache-service.ts`
- [x] `src/services/ai/error-handler.ts`
- [x] `src/services/auth/auth-service.ts`
- [x] `src/services/auth/middleware.ts`
- [x] `src/services/websocket/collaboration-service.ts`
- [x] `src/lib/ai-client.ts`

### Deployment

- [x] `.env.example`
- [x] `Dockerfile`
- [x] `docker-compose.yml`
- [x] `nginx.conf`
- [x] `scripts/deploy.sh`
- [x] `package.json` server scripts
- [x] `tsconfig.server.json`

### Tests And CI

- [x] `src/services/ai/__tests__/ai-services.test.ts`
- [x] `src/services/auth/auth-service.test.ts`
- [x] `src/services/auth/middleware.test.ts`
- [x] New hosted API integration tests.
- [x] New WebSocket integration tests.
- [x] `tests/exports/package-exports.test.ts`
- [x] `tests/exports/package-exports.spec.mjs`
- [x] `tests/types/consumer.tsx`
- [x] `scripts/ci/verify-pack.js`
- [x] `scripts/ci/verify-tree-shaking.js`
- [x] `scripts/ci/run-vite-integration.js`
- [x] `scripts/ci/run-next-integration.js`
- [x] `scripts/ci/verify-recipes-render.js`
- [x] `scripts/ci/verify-app-chrome-visuals.js`

### Package And Recipes

- [x] `package.json`
- [x] `src/index.ts`
- [x] `src/registry/recipes.ts`
- [x] `src/stories/*`
- [x] `src/app-shell/*`
- [x] `src/workspace/*`
- [x] `src/theme/*`
- [x] `src/icons/*`
- [x] `src/primitives/*`

### Documentation

- [x] `README.md`
- [x] `CHANGELOG.md`
- [x] `INSTALLATION.md`
- [x] `docs/readme.md`
- [x] `docs/deployment.md`
- [x] `docs/ai/api-reference.md`
- [x] `docs/ai/quick-start.md`
- [x] `docs/ai/setup-guide.md`
- [x] `docs/ai/production-deployment.md`
- [x] `docs/ai/production-infrastructure.md`
- [x] `docs/ai/security-guide.md`
- [x] `docs/ai/cost-optimization.md`
- [x] `docs/app-shell/readme.md`
- [x] `docs/workflows/readme.md`
- [x] `docs/recipes/readme.md`
- [x] `docs/theme/theme-engine.md`
- [x] `docs/components/choosing.md`
- [x] `docs/cli/migration.md`

## Release Acceptance Criteria

### Package Release

- [x] Root package remains backward-compatible for documented 3.2 imports.
- [x] New subpaths are typed, tested, and documented.
- [x] Optional provider SDKs remain isolated from root UI bundle scenarios.
- [x] Pack verification passes with no test-only files, nested `node_modules`, React runtimes, or dispatcher artifacts.
- [x] Vite and Next integration tests pass from packed tarball.
- [x] Recipe render gate passes for all recipes.
- [x] Storybook build passes.

### Hosted Runtime Release

- [x] Production paths do not start mock routes.
- [x] Real API server starts with canonical env and port contract.
- [x] Missing required hosted env fails before listening.
- [x] Missing optional provider env returns provider-unconfigured responses.
- [x] Auth, rate limiting, cache, provider routes, and WebSocket auth have integration evidence.
- [x] Collaboration editing is implemented and tested or explicitly unsupported.
- [x] Docker Compose smoke passes for API, WebSocket, Redis, and Nginx path if included.

### Accessibility Release

- [ ] Manual screen-reader certification recorded.
- [ ] Physical phone/touch certification recorded.
- [ ] Physical tablet/touch certification recorded or explicitly unavailable.
- [x] Automated a11y gates pass.
- [ ] Manual issues resolved or documented as non-blocking.

### Documentation Release

- [x] README, docs index, AI docs, deployment docs, server README, recipe docs, and changelog agree.
- [x] No stale current-release claims from 3.1/3.2 remain in active 3.3 guidance.
- [x] Hosted runtime support scope is clear.
- [x] Release notes state exactly what is supported: package/library, optional hosted runtime, or both.

## Success Metrics

- Zero production references to mock API server paths unless demo-only.
- One canonical API/WebSocket port contract across code, docs, Docker, deploy scripts, and client defaults.
- Hosted API integration suite covers every AI route in success and provider-unconfigured states.
- WebSocket integration suite covers auth, join/leave, presence, cursor, selection, and collaboration edit support or unsupported behavior.
- Manual accessibility certification recorded for all required app-chrome surfaces.
- Physical-device touch certification recorded for phone and tablet scope.
- Recipe registry grows beyond 20 recipes with all recipes rendered through packed-tarball CLI.
- Root bundle scenarios do not regress beyond approved budgets.
- `npm run verify:pack`, exports, types, Vite, Next, Storybook, visual, and a11y gates pass.
- README/docs current-release stale-text scan passes.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Hosted runtime scope expands too far | 3.3 slips or ships weak backend claims | Make hosted runtime optional and decide early whether editing/provider routes are supported or demo-only. |
| Provider integration tests require real paid services | CI becomes flaky or expensive | Use mocked provider adapters for CI and separate live smoke runbook for credentialed staging. |
| Collaboration editing is harder than expected | Data loss or misleading product claims | Use a proven CRDT/OT library or explicitly scope editing out of 3.3. |
| Port/env migration breaks local demos | Developer confusion | Add compatibility warnings, docs, and focused client config tests. |
| Manual accessibility finds deep focus issues | Release delay | Run certification early, not after code freeze. |
| New subpaths create export-map churn | Consumer breakage | Keep root compatibility and add focused export/type tests. |
| Docs overclaim hosted AI support | Trust and launch risk | Make release notes and README support scope explicit and evidence-backed. |
| Optional provider SDKs leak into UI bundle | Bundle regression | Add strict tree-shaking scenarios and import-boundary tests. |
| Sentry/logging captures sensitive prompt data | Security issue | Sanitize errors and breadcrumbs; add tests for secret-like strings. |

## Open Questions

- Is AuraGlass 3.3 intended to officially support a hosted API/server product, or should hosted runtime remain demo/reference-only?
- Should the canonical local API port be `3002` and WebSocket port be `3001`, matching Docker/deployment, or should docs move to the real TypeScript server default API `3001`?
- Should `server/api-server.js` be deleted, renamed to `server/demo-api-server.js`, or kept behind `ENABLE_DEMO_API=true`?
- Should collaboration editing use Yjs, ShareJS, a minimal custom operation model, or be explicitly unsupported in 3.3?
- Should API key auth be first-class in 3.3 hosted runtime, or should JWT auth be the only supported path?
- Should provider service classes stay under `aura-glass/services/*` exports, or should they move to a clearer backend-only namespace?
- Should live provider smoke tests be part of release sign-off, or should CI use mocks with a separate staging runbook?
- Which 3.3 recipes are launch-blocking versus nice-to-have?
- Which Storybook/docs hosting target will be used for 3.3 public docs evidence?

## Recommended Build Order

1. Make scope decisions: hosted runtime, ports/env, collaboration editing.
2. Clean production entrypoints so no production path starts mock routes.
3. Standardize API/WebSocket/client/docs port contract.
4. Add runtime config validation and provider-unconfigured errors.
5. Harden provider-backed API routes with mocked integration tests.
6. Harden auth, Redis, rate-limit, cache, and cost controls.
7. Resolve collaboration editing or unsupported behavior.
8. Execute manual accessibility and physical touch certification early.
9. Add package subpaths and bundle scenarios.
10. Add 3.3 recipes and Storybook evidence.
11. Sweep README/docs/deployment/AI docs for truth and consistency.
12. Run final package, hosted runtime, visual, a11y, pack, integration, and release dry-run gates.

## Final Definition Of Done

AuraGlass 3.3 is done when all of the following are true:

- The public package release remains installable, typed, tree-shakable through documented subpaths, and compatible with React 18/19 and Next 14/15.
- The optional hosted runtime has a truthful support scope.
- No production path starts legacy mock API routes.
- API/WebSocket ports and env variables are consistent across code, Docker, deployment scripts, docs, and client defaults.
- Provider-backed AI routes either call real service-layer code or return safe provider-unconfigured errors.
- Hosted production startup fails closed for missing required settings.
- Auth, Redis/cache, rate limits, provider routes, WebSocket auth, and collaboration behavior have integration evidence.
- Collaboration editing is either implemented with a real operation model or explicitly documented as unsupported.
- Manual screen-reader and physical-device touch certification results are recorded.
- README/docs/release notes accurately describe package-only usage, optional hosted runtime usage, providers, credentials, and unsupported/demo-only behavior.
- All final release gates pass and evidence is recorded under `reports/3.3-release`.
