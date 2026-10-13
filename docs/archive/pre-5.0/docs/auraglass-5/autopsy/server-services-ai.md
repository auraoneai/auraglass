# AuraGlass 5.0 Autopsy: Server, Services, Workers, AI Infra

Scope: `server/`, `src/server`, `src/services`, `src/workers`, `workers/`, `src/lib`, `src/workflows`, `src/tools`, `src/components/ai`, `src/components/chat`, `src/components/voice`, plus `tsconfig.server.json`, `build:server`, `Dockerfile`, `docker-compose.yml`, `.env.example`, and `reports/ai-server-security-review.md`. I verified everything below against source. I did not trust reports. I ran nothing heavy.

Limitation: the Read tool returned empty for the certification PNGs in this session, so I made no visual judgments from screenshots. Every visual or UX claim below comes from reading source.

## Summary and score: 3/10

The UI package also contains a self-hosted Express + Socket.IO backend: auth, OpenAI/Pinecone/Google Vision/remove.bg calls, Redis, Sentry, a Dockerfile and docker-compose. That backend's runtime libraries are hard `dependencies` of `aura-glass`. The root browser bundle is clean (it imports only react, framer-motion, clsx, tailwind-merge, date-fns and react-chartjs-2). But every consumer still installs express, socket.io, @google-cloud/vision (gRPC), Pinecone, ioredis, redis, @sentry/node, jsonwebtoken and bcryptjs.

The backend has had real hardening: required `JWT_SECRET`, no tokens in the query string, random IDs, provider-unconfigured 503s. Several real problems remain:
- The Docker image bakes a public default JWT secret into the container.
- An unused API-key middleware treats any key that matches a regex as valid.
- Placeholder provider keys count as "configured".
- Provider failures quietly return made-up "AI" output with HTTP 200.

The "AI components" are mostly simulations. GAN, DeepDream, StyleTransfer and AIGlassThemeProvider use `Math.random` and `setTimeout` to fake inference. The "intelligent" form builder is keyword matching plus a fake 1 s delay. VoiceGlassControl is labelled as a mock. There is no AI-chat primitive set at all: no assistant/user message parts, no streaming, tool calls, citations, reasoning disclosure or agent run status. The only chat surfaces are a Slack-style human `GlassChat` and a typing indicator, and `GlassChat` imports eye-tracking and biometric hooks.

## What exists (counts)

| Area | Files | Lines | Nature |
|---|---|---|---|
| `server/` | 4 | 1,366 | `index.ts` (659, real Express API), `api-server.js` (192, legacy demo API that returns 501), `websocket-server.js` (316, Socket.IO + Redis), README |
| `src/server` | 2 | 39 | `aura-glass/server` export = SSR helpers plus no-op registry guards (`src/server/registryGuard.ts:6-18`). Unrelated to `server/` despite the name |
| `src/services` | 12 | 3,851 | ai: openai, semantic-search (Pinecone), vision (GCV + remove.bg), cache (redis), error-handler, config; auth: service + middleware; websocket client; 3 test files |
| `src/workers` + `workers/` | 3 + 6 | 469 + 300 | "Biometric", "eye-tracking" and "predictive" heuristics as Web Workers. `workers/` is gitignored build output that ships in `files` |
| `src/lib` | 7 | 1,228 | `ai-client.ts` (404, browser fetch client + singleton), utils, localization provider |
| `src/workflows` | 1 | 1 | `export * from "../workspace"` |
| `src/tools` | 1 | 512 | `GlassDevTools` (not exported) |
| `src/components/ai` | 44 (12 components) | 16,118 | 9 of 12 components are exported from the root index |
| `src/components/chat` | 4 | 521 | `GlassTypingIndicator` only |
| `src/components/voice` | 5 | 1,509 | `VoiceGlassControl` (mock), exported twice, once as `VoiceGlassDemo` |

Package surface:
- 5 `./services/*` subpath exports (`package.json:180-204`).
- Root exports of the AI demos (`src/index.ts:453,608-626`) and voice (`src/index.ts:751-755`).
- 13 server-only runtime `dependencies` (`package.json:486-508`). `openai`, `redis` and `@google-cloud/vision` are also declared as optional peers (`package.json:373-380`), so the same packages appear in two dependency lists.

## What is excellent (keep, but move)

- **Provider-unconfigured contract.** `ProviderUnconfiguredError` returns HTTP 503 with `code`, `provider`, `feature`, `remediation` and `docsUrl` (`src/services/ai/config.ts:122-151`). `/ready` lists checks with remediation text (`server/index.ts:60-104,305-314`). This is a good pattern for any future AI adapter.
- **Auth hardening is real.** `JWT_SECRET` is required outside tests (`src/services/auth/auth-service.ts:37-49`). Demo auth is opt-in (`auth-service.ts:268-276`). API keys use `randomBytes` (`:157-159`). Credentials are not accepted from query strings (middleware). Refresh tokens are rotated and checked (`:220-262`).
- **Injectable `OpenAIClientFactory`** (`src/services/ai/openai-service.ts:8-10,82-101`) makes the service testable without network calls. There are 599 lines of service tests (`src/services/ai/__tests__/ai-services.test.ts`).
- **Typed JSON output validation with zod** (`openai-service.ts:12-45,165-168`).
- **Honest labelling in places.** `VoiceGlassControl.tsx:3-7` documents itself as a mock. `websocket-server.js:217-226` refuses fake collaborative editing (it says a real OT/CRDT engine is required) instead of pretending.
- **`GlassTypingIndicator`** is a small, real primitive with `role="status"` and `aria-live` (`src/components/chat/GlassTypingIndicator.tsx:227-251`). It is the one piece here that belongs in an AI kit.

## What is mediocre

- **`ai-client.ts`** is a sensible fetch wrapper, but:
  - The singleton `aiClient` defaults to `http://localhost:3002` (`src/lib/ai-client.ts:113-118`).
  - It keeps the bearer token in module memory.
  - Its types are hand-copied from the service zod schemas.
  - It has no streaming, `AbortSignal` support, retry or backoff.
- **Rate limiting** is per-IP with no `trust proxy` setting (`server/index.ts:272-281`). Behind the compose nginx or any load balancer, every client shares one bucket of 100 requests per 15 minutes.
- **`/health` is unauthenticated** and exposes provider and feature flags (`server/index.ts:295-303`).
- **Permissions are defined but never enforced.** `Permissions.*` exist, but `aiRouter` only calls `authenticateToken` (`server/index.ts:347-348`), so any valid JWT can use every paid provider.
- **Session state lives in process memory.** Users, refresh tokens and the revocation list are in-process `Map`/`Set` (`auth-service.ts:53-55`). That breaks with more than one replica and is lost on restart.
- **Silent fallback hides failures.** `ErrorHandler.handleWithFallback` (`src/services/ai/error-handler.ts:64-71`) turns any provider failure into invented output. Form suggestions fall back to heuristics (`openai-service.ts:183-196`). `removeBackground` returns the original image unchanged (`vision-service.ts:369-373`). In both cases the response is HTTP 200 and the client never knows the AI failed.
- **WebSocket server:**
  - No room-level authorization: any authenticated socket can `join-room` any ID (`server/websocket-server.js:86-107`).
  - Client payloads are re-broadcast with `...data` / `...presence` spreads (`:208-212,243-246`).
  - No per-event rate limit.
  - `create-room` stores an unbounded `initialState` in Redis (`:164-183`).
  - Clients can choose their own `userId` in demo mode (`:54-65`).

## What is outdated

- **Models are hard-coded.** The config enum is `gpt-4 | gpt-4-turbo | gpt-3.5-turbo` (`src/services/ai/config.ts:6`). `gpt-3.5-turbo` is forced for "cheap" paths (`openai-service.ts:145,226,289`). Embeddings use `text-embedding-ada-002` (`semantic-search-service.ts:333`). The price table is from 2023 (`openai-service.ts:451-453`). Everything uses `chat.completions` with no streaming and no tools.
- **No Kiro Prism.** The provider SDKs are wired directly. Per the machine-wide AuraOne policy, any future AI feature should go through Kiro Prism as the default-first LLM layer. These services predate that and should not be extended as they are.
- **`ProductionAIIntegration`** reads `process.env.REACT_APP_WEBSOCKET_URL` (`src/components/ai/ProductionAIIntegration.tsx:92`), which is a CRA-era variable. Its error message still says "AuraGlass 3.3" (`:114`).
- **"Consciousness" features.** Biometric, eye-tracking and predictive workers run heuristics, with code comments that defer the real logic to a future ML model (`src/workers/biometricWorker.ts:52-54`). `GlassChat` pulls in `useEyeTracking`, `useBiometricAdaptation` and `useSpatialAudio` (`src/components/interactive/GlassChat.tsx:24-31`). This is a 2023-era gimmick layer, not a 2026 AI product surface.
- **`src/server/registryGuard.ts`** is all no-op styled-components compatibility shims (`:1-18`).

## Duplication

- **Two API servers.** `server/index.ts` is the real one. `server/api-server.js` is a legacy demo that returns 501 (`server/api-server.js:18-25,63-64`).
- **Two auth middlewares.** `authenticateToken` is inlined in `server/index.ts:316-345`. `AuthMiddleware` in `src/services/auth/middleware.ts` is never used by the server.
- **Two rate-limiter setups.** One in `server/index.ts:272-281`, one in `middleware.ts:190-229`.
- **Two Redis clients.** `redis` is used by cache-service; `ioredis` is used by websocket-server (`server/websocket-server.js:3`). Both are runtime deps.
- **Two OpenAI client constructions.** `openai-service.ts:92` and `semantic-search-service.ts:54`.
- **Env parsing written twice.** `defaultAIConfig` reads `process.env` at module load (`config.ts:83-120`). `createAIConfig` repeats the same parsing as a function (`config.ts:153-206`).
- **Worker sources and committed-shape artifacts.** `src/workers/*.ts` and `workers/*.js`, plus one stale reference to a `.ts` worker URL (`src/utils/consciousnessOptimization.ts:304-305`) that cannot resolve in dist.
- **Two names for one voice component.** `VoiceGlassControl` and `VoiceGlassDemo` are the same default export (`src/index.ts:751-755`). Voice also overlaps with `GlassVoiceInput` and `GlassVoiceWaveform`.
- **Overlapping chat surfaces.** `GlassChat` (1,245 lines) re-implements the rendering in `GlassMessageList` (569 lines). `GlassChatInput` (704 lines) is a third piece.
- **Duplicated types.** The FormField and SearchResult types in `ai-client.ts:45-105` duplicate the service zod schemas.

## Fake complexity

- **GlassGANGenerator** (1,032 lines): "generation" is random latent vectors plus pixel noise. "Training" is `1.0 + Math.random()*0.5 - epoch*0.01` with a `setTimeout` (`src/components/ai/GlassGANGenerator.tsx:242-245,349,480-504`).
- **GlassDeepDreamGlass** (1,057 lines): `simulateLayerActivation` writes random pixels (`GlassDeepDreamGlass.tsx:192-228,370-396`).
- **GlassStyleTransfer** (736 lines): "Simulate style transfer processing" draws random strokes after a staged `setTimeout` (`GlassStyleTransfer.tsx:158-252`).
- **AIGlassThemeProvider** (574 lines): "Simulate AI processing delay", then a random hue. Sentiment input becomes "mockContent" (`AIGlassThemeProvider.tsx:289-306,361-363`).
- **GlassIntelligentFormBuilder** (1,194 lines, root-exported): "Real-time AI analysis" is a `setTimeout` labelled "Simulate AI analysis delay" plus `includes("contact")` keyword checks (`GlassIntelligentFormBuilder.tsx:272-330`).
- **VoiceGlassControl** (889 lines): mock hook and mock command processing, with a random test command (`VoiceGlassControl.tsx:67,83,171,276,445,499`).
- **ProductionAIIntegration** (485 lines): its own story passes `disableServiceInitialization: true` (`ProductionAIIntegration.stories.tsx:38-39`), so the certification screenshot is a static shell. In real use it dynamically imports server services into the browser (`ProductionAIIntegration.tsx:57-84`). That cannot work: the services use node `crypto`, the browser OpenAI SDK requires `dangerouslyAllowBrowser`, and `new AuthService()` throws without `JWT_SECRET`.
- **The "biometric" workers** (heart rate, HRV, skin conductance) have no data source a web app could supply.
- **About 7,000 lines of `*.test.tsx` + snapshots** for these AI demos mostly lock in random-canvas markup. They do not test behaviour.

## Critical findings

| ID | Severity | Claim | Evidence |
|---|---|---|---|
| SERVER-SERVICES-AI-01 | critical | The Docker image ships a public default JWT secret. The Dockerfile copies `.env.example` to `.env` and the server calls `dotenv.config()`. If `JWT_SECRET` is not set at runtime (for example a plain `docker run`), the secret is `your-super-secret-jwt-key-change-in-production`. Anyone can then forge an `admin` JWT and use every paid AI provider route. | `Dockerfile:50`, `.env.example:22`, `server/index.ts:7,26`, `src/services/auth/auth-service.ts:38-41,136` |
| SERVER-SERVICES-AI-02 | high | `AuthMiddleware.authenticateApiKey` accepts any string matching `/^ak_[a-z0-9]{20,}$/` as authenticated. It never looks the key up. This is a latent auth bypass for anyone who wires this exported middleware in. | `src/services/auth/auth-service.ts:161-163`, `src/services/auth/middleware.ts:64-84` |
| SERVER-SERVICES-AI-03 | high | A UI library hard-depends on a whole backend stack. express, socket.io, ioredis, redis, @google-cloud/vision, @pinecone-database/pinecone, @sentry/node, jsonwebtoken, bcryptjs, helmet, cors, compression and dotenv are runtime `dependencies`, so every consumer installs them. Some are also listed as optional peers. | `package.json:486-508`, `package.json:369-410` |
| SERVER-SERVICES-AI-04 | high | Node-only services are published as browser ESM subpaths. `./services/ai/*` and `./services/websocket/*` are built with `platform: 'browser'` yet import node `crypto`. `defaultAIConfig` reads secret env vars at module load, so a bundler `define: {'process.env': ...}` would inline API keys into client bundles. | `package.json:180-204`, `scripts/build-all.js:107-109,128-131`, `dist/esm/services/ai/openai-service.js:2`, `src/services/ai/config.ts:83-102` |
| SERVER-SERVICES-AI-05 | high | AI failures are reported as success. Provider errors return invented results with HTTP 200: heuristic form fields, the unmodified image from remove-background, the raw query echoed back from search enhancement. Placeholder keys in `.env.example` count as "configured", so `/ready` passes and then the fallback fakes output. | `src/services/ai/error-handler.ts:64-71`, `src/services/ai/openai-service.ts:183-196,254-263`, `src/services/ai/vision-service.ts:369-373`, `src/services/ai/config.ts:222-245`, `.env.example:2,11,16` |
| SERVER-SERVICES-AI-06 | high | No real AI primitives exist. There are no assistant/user message-part components, no streaming text, tool-call cards, citations/sources, reasoning disclosure or agent run status. The "AI" category is generative-art demos built on `Math.random` and `setTimeout`, and they are root-exported as product components. | `src/components/ai/GlassGANGenerator.tsx:242-504`, `GlassDeepDreamGlass.tsx:192-228`, `GlassStyleTransfer.tsx:158-252`, `AIGlassThemeProvider.tsx:289-306`, `GlassIntelligentFormBuilder.tsx:272-330`, `src/index.ts:453,608-626` |
| SERVER-SERVICES-AI-07 | medium | Cost abuse is possible on paid routes. Any valid JWT can call every provider: no permission checks, a 10 MB JSON body limit, and a client-controlled `maxLength` passed into the summarize prompt. The per-IP limiter without `trust proxy` either throttles all users together or nobody effectively. | `server/index.ts:272-284,347-348,497-506` |
| SERVER-SERVICES-AI-08 | medium | Demo auth is not blocked in production on the real server. `api-server.js` gates on `!isProduction`, but `AuthService.assertDemoAuthEnabled` only checks `ENABLE_DEMO_AUTH`. With it set, `/login` creates an account for any email with AI permissions (`role: developer`). | `server/api-server.js:15`, `src/services/auth/auth-service.ts:165-181,268-299` |
| SERVER-SERVICES-AI-09 | medium | The compose file publishes Redis on the host with no password (`${REDIS_HOST_PORT:-6379}:6379`, no `requirepass`). Room state, cursors and the AI cache are readable and writable from outside. | `docker-compose.yml:3-9` |
| SERVER-SERVICES-AI-10 | medium | The WebSocket server has no room ACL. It re-broadcasts arbitrary client payload spreads, has no event rate limit, and accepts unbounded `initialState`. | `server/websocket-server.js:86-107,164-183,193-248` |
| SERVER-SERVICES-AI-11 | medium | `ProductionAIIntegration` is a client component that instantiates OpenAI, Pinecone, Vision and Auth services in the browser. It is compiled into the shipped `dist/esm/components/ai/ProductionAIIntegration.js`. Its story disables initialization, so the screenshot proves nothing. | `src/components/ai/ProductionAIIntegration.tsx:1-4,57-88`, `ProductionAIIntegration.stories.tsx:38-39`, `dist/esm/components/ai/ProductionAIIntegration.js` |
| SERVER-SERVICES-AI-12 | medium | The worker URLs are fragile. `new URL("../workers/*.js", import.meta.url)` only resolves from the bundled `dist/index.mjs`. A `.ts` worker URL is referenced that never exists in dist. In CJS `import.meta` is empty and the error is swallowed silently. | `src/utils/consciousnessOptimization.ts:46-65,304-305`, `dist/index.js` (contains `import_meta`) |
| SERVER-SERVICES-AI-13 | medium | The `aura-glass/server` subpath name collides with the hosted server. `build:server` emits into `dist/server/` (as `dist/server/server/index.js` and `dist/server/src/**`), the same folder as the SSR-helper export. `build:hosted` therefore puts backend JS into the npm `files` payload. | `package.json:212-216,232-238,244-245`, `tsconfig.server.json:7-8,26-30`, `Dockerfile:66` |
| SERVER-SERVICES-AI-14 | low | `GlassDevTools` returns early before calling `useEffect` (Rules of Hooks violation) and monkey-patches the global console. It is dead code and not exported. | `src/tools/GlassDevTools.tsx:30-40` |
| SERVER-SERVICES-AI-15 | low | Models and pricing are pinned to deprecated OpenAI models (gpt-4, gpt-3.5-turbo, ada-002) with direct SDK wiring. There is no Prism-routed or provider-neutral adapter. | `src/services/ai/config.ts:6`, `openai-service.ts:145,226,289,451-453`, `semantic-search-service.ts:333` |

## Recommendations for AuraGlass 5.0

1. **Take the backend out of the package.** Delete `server/`, `src/services/`, `src/lib/ai-client.ts`, `Dockerfile`, `docker-compose.yml`, `build:server`, `build:hosted`, the `server:*` and `docker:*` scripts, and `tsconfig.server.json` from `aura-glass`. If AuraOne needs this runtime, move it to a separate private repo/app (for example `auraglass-hosted`) and fix SERVER-SERVICES-AI-01, 02, 05, 07, 08, 09 and 10 there before it is deployed anywhere. Remove all 13 server runtime deps and the `openai`/`redis`/`@google-cloud/vision` peers from `aura-glass`.
2. **Remove the `./services/*` subpath exports in a breaking 5.0 change.** Rename `aura-glass/server` to `aura-glass/ssr` (or drop it, since `registryGuard` is a no-op). Delete `src/workflows` (an alias) and `src/server/registryGuard.ts`.
3. **Delete or quarantine the simulated "AI" components.** GAN, DeepDream, StyleTransfer, GenerativeArt, LiveFilter, MusicVisualizer, NeuralWeight, Neuromorphic, AIGlassThemeProvider, ProductionAIIntegration, AIDemo, VoiceGlassControl/VoiceGlassDemo, and the biometric/eye-tracking/predictive workers with their `GlassChat` hooks. If any are kept as art, put them in an `aura-glass/labs` subpath marked experimental. Never root-export them.
4. **Build a real, headless-first AI kit behind `aura-glass/ai`.** It should be provider-agnostic, with no SDKs and no network calls:
   - `Thread`, `Message` with parts (text, markdown, code, image, file)
   - `StreamingText` that takes an `AsyncIterable` or `ReadableStream`, with a caret and reduced-motion support
   - `ToolCallCard` (pending, running, success, error; args/result disclosure)
   - `Citation` / `SourceList` with inline footnote chips
   - `ReasoningDisclosure` (collapsible, with duration)
   - `AgentRunStatus` / step timeline
   - `PromptComposer` (attachments, stop/regenerate, keyboard submit)
   - `ApprovalPrompt` for tool confirmation
   - The existing `GlassTypingIndicator`

   Components should consume a typed message model compatible with common streaming formats. Data fetching stays in the consumer app.
5. **Route all future AuraOne-hosted AI through Kiro Prism**, the policy's default-first LLM layer. The component kit itself should stay transport-agnostic. Do not extend `openai-service.ts`.
6. **Keep the good patterns as docs and examples, not package code.** That means the `ProviderUnconfiguredError`-style 503 payload and `/ready` remediation checks, as example route handlers in a Next.js recipe.
7. **Merge the chat surfaces.** Collapse `GlassChat`, `GlassMessageList` and `GlassChatInput` into one composable set. Remove the eye-tracking, biometric and predictive imports from `GlassChat`.
8. **Clean up the tests that go with the removals.** Delete the snapshot tests that lock in random-canvas output. Replace them with behaviour tests for the new AI kit: stream append, abort, tool-state transitions, citation focus order, and `aria-live` politeness.

## Verification (adversarial)

Each finding was re-checked against source and the built `dist/`. Nothing was executed.

| id | verdict | note |
|---|---|---|
| SERVER-SERVICES-AI-01 | CONFIRMED (scoped) | `Dockerfile:50` copies `.env.example` into `.env`. `.env.example:22` sets `JWT_SECRET=your-super-secret-jwt-key-change-in-production`, `server/index.ts:26` calls `dotenv.config()`, and `auth-service.ts:38-41` accepts any value that is truthy. The string is never checked, so `/ready` passes as well (`server/index.ts:62-63`). Limit: `docker-compose.yml:29,55` sets `JWT_SECRET=${JWT_SECRET}`. If that host variable is unset, compose passes an empty string, dotenv will not override it, and `auth-service.ts:48` throws. So compose fails closed. The default secret applies to `docker run` or k8s deployments that do not set the variable. Admin forging works because `hasPermission` short-circuits on `role==="admin"` (`auth-service.ts:136`) and `verifyToken` trusts the role in the token (`:109-110`). |
| SERVER-SERVICES-AI-02 | PARTIAL | The code is as described: `validateApiKey` is only the regex `/^ak_[a-z0-9]{20,}$/` (`auth-service.ts:161-163`), and `middleware.ts:65-84` sets `req.apiKey` and calls `next()` with no lookup. However, `rg authenticateApiKey src server` finds only the definition. No route uses it, and `AuthMiddleware` is not imported by `server/index.ts`. It is a latent bypass (it ships in `dist/server` via `build:server`, which includes `src/services/**`). It is not exploitable today. "High" overstates it; medium fits better. |
| SERVER-SERVICES-AI-03 | CONFIRMED | Runtime `dependencies` include express, socket.io, ioredis, redis, @google-cloud/vision, @pinecone-database/pinecone, @sentry/node, jsonwebtoken, bcryptjs, helmet, cors, compression, dotenv and express-rate-limit (package.json:486-508). `@google-cloud/vision`, `openai`, `redis`, framer-motion, react-hook-form and react-chartjs-2 are also listed as optional peers (package.json:369-410). The optional-peer declaration has no effect because they are hard deps too. |
| SERVER-SERVICES-AI-04 | PARTIAL | The shipping claim is confirmed. `./services/ai/{config,cache-service,openai-service,vision-service}` and `./services/websocket/collaboration-service` are exported with only import/default conditions, so there is no `node` condition (package.json:180-204). They are built with `platform: 'browser'` (`scripts/build-all.js:107-109,131`). `dist/esm/services/ai/openai-service.js:2,6-7,130` imports `crypto`, `redis` and `@sentry/node`. `dist/esm/services/ai/config.js` reads `process.env.OPENAI_API_KEY` and others at module load (21 references). The inlining risk is conditional. Vite (`import.meta.env`) and Next (`NEXT_PUBLIC_` only) do not inline these by default. Leakage needs a consumer config like `define: {'process.env': process.env}`, a pattern that does exist in the wild. Treat it as a real hazard, but not a default leak. |
| SERVER-SERVICES-AI-05 | CONFIRMED | `handleWithFallback` logs and returns `fallbackFn()` (`error-handler.ts:64-80`). Generate-form returns heuristic fields with `cached:false` (`openai-service.ts:189-196`). Query enhancement fabricates `confidence: 0.5` (`:254-263`). removeBackground returns the original image unchanged (`vision-service.ts:369-373`). `isProviderConfigured` only tests that values are non-empty (`config.ts:222-245`). `sk-your-openai-api-key` and similar placeholders from the copied `.env` count as configured, and googleVision is "configured" by `projectId=your-project-id` alone. |
| SERVER-SERVICES-AI-06 | CONFIRMED | Math.random/setTimeout matches: GANGenerator 6, DeepDream 6, StyleTransfer 8, AIGlassThemeProvider 3, IntelligentFormBuilder 2. None of these five call fetch, OpenAI or `/api/`. All are root-exported (`src/index.ts:453,609-626`). `rg -il "streaming\|toolcall\|citation\|reasoning" src/components` matches no message/AI primitive. Caveat: `GlassChat`, `GlassMessageList` and `GlassTypingIndicator` exist as generic chat UI. They have no streaming, tool or citation model, so the claim holds. |
| SERVER-SERVICES-AI-07 | CONFIRMED | `aiRouter.use(authenticateToken)` only (`server/index.ts:347-348`). `server/index.ts` has no `hasPermission` or `Permissions.` reference. Bodies are capped at 10mb (`:283-284`). `maxLength` comes from the client and sets `max_tokens: Math.ceil(maxLength/4)` with no clamp (`openai-service.ts:293,301`); it is also interpolated into the system prompt. The rate limiter is global per IP (`:272-281`) and there is no `trust proxy`. Behind a load balancer, all clients would share one bucket, which is a self-DoS rather than a bypass. |
| SERVER-SERVICES-AI-08 | PARTIAL | The code path is confirmed. `assertDemoAuthEnabled` checks only `ENABLE_DEMO_AUTH==="true"`, with no NODE_ENV guard (`auth-service.ts:268-276`). `api-server.js:15` does add `&& !isProduction`. Login auto-creates a user with USE_OPENAI, USE_VISION and USE_EMBEDDINGS for an unknown email (`:174-181,288-298`). The default is off, though: `.env.example:59` has `ENABLE_DEMO_AUTH=false`, and compose sets `NODE_ENV=production` but not the flag. Exposure requires an operator to enable the flag explicitly. |
| SERVER-SERVICES-AI-09 | CONFIRMED | `docker-compose.yml:5-9` maps `${REDIS_HOST_PORT:-6379}:6379` with no host-IP bind, so all interfaces are exposed. `command: redis-server --appendonly yes` has no `--requirepass`, and `REDIS_URL=redis://redis:6379` has no credentials. |
| SERVER-SERVICES-AI-10 | PARTIAL | No room ACL is confirmed: `join-room` joins any client-supplied `roomId` (`websocket-server.js:86-94`), and there is no per-event rate limit. The spread re-broadcast is real (`:208-212,241-245`), but `userId` and `userName` are written after the spread, so identity cannot be spoofed. Only extra fields are relayed. "Unbounded initialState" overstates it: socket.io's default `maxHttpBufferSize` of 1 MB applies, because the server does not override it. What is unbounded is the number of rooms held in memory. |
| SERVER-SERVICES-AI-11 | PARTIAL | Confirmed: the component builds `OpenAIService`, `SemanticSearchService`, `VisionService` and `AuthService` with `defaultAIConfig` in a `"use client"` component (`ProductionAIIntegration.tsx:1-4,59-88`). `dist/esm/components/ai/ProductionAIIntegration.js` exists, and the story sets `disableServiceInitialization: true` (`.stories.tsx:38-39`), which returns early at `:53-56`. Mitigation the claim leaves out: the component is deliberately not root-exported (`src/index.ts:918-919`), and `./components/*` is not an export subpath. The file is in the tarball, but consumers cannot import it through `exports`. |
| SERVER-SERVICES-AI-12 | CONFIRMED | Root bundles use `new URL("../workers/*.js", import.meta.url)`, which resolves to `<pkg>/workers/*.js`. Those files exist and `files` includes `workers`. `dist/esm/utils/consciousnessOptimization.js` also has `../workers/predictiveWorker.ts`, but `dist/esm/workers` does not exist and `dist/workers` holds only `.d.ts` files, so both paths break from the esm tree. In CJS, `dist/index.js:150907` has `var import_meta = {}`, so `new URL(rel, undefined)` throws and the empty `catch {}` swallows it (`src/utils/consciousnessOptimization.ts:61-63`). Nuance: the `.ts` URL is tree-shaken out of `dist/index.mjs` (0 hits) and appears only in the unbundled `dist/esm` copy. |
| SERVER-SERVICES-AI-13 | CONFIRMED | `tsconfig.server.json:7-8` sets `outDir ./dist/server` and `rootDir ./`, and includes `server/**` and `src/services/**`. This emits `dist/server/server/index.js` (the Dockerfile CMD at :66) and `dist/server/src/services/**` next to the `./server` SSR export at `dist/server/index.mjs` (package.json:211-215). `files: ["dist"]` ships them if packed after `build:hosted`. Note that `prepublishOnly` runs plain `npm run build`, and `build-all.js` first deletes `dist`, so the official publish path cleans this. The leak only happens with a manual `npm pack` or `npm publish --ignore-scripts` after `build:hosted`. |
| SERVER-SERVICES-AI-14 | PARTIAL | Confirmed: `if (!enabled) return null;` comes before `useEffect` (`GlassDevTools.tsx:31-34`), which violates the Rules of Hooks, and the effect replaces `globalThis.console.log/warn/error` (`:35-60`). Not strictly dead: it is imported and rendered by `ComprehensiveShowcase.stories.tsx:6,297`. It is not root-exported, so it is story-only code rather than shipped API. |
| SERVER-SERVICES-AI-15 | CONFIRMED | The zod enum allows only `gpt-4`, `gpt-4-turbo` and `gpt-3.5-turbo` (`config.ts:6`). Summarize is hard-coded to `gpt-3.5-turbo` (`openai-service.ts:289`), and the cheap-model branch also uses it (`:144-145`). Pricing is stale (`:449-453`), and embeddings use `text-embedding-ada-002` (`semantic-search-service.ts:333`). The OpenAI SDK is wired directly, with no Prism or provider-neutral adapter. |
