# PROMPT-13f (AI): Registry items, Kiro Prism route, compat adapters, codemod, deprecations, removal check

You are implementing part of PRD-AI (key `AI`; self-id PRD-13 is an alias, §16 PRD-12; AI Primitives) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained.

Branches:
- AI-098 (`deprecations.json`) and AI-117 (optional 4.3 experimental subpath) go on a branch off `release/4.x`, so they ship in 4.2/4.3 on REL's release train (interim owner of §16 PRD-17, SC-37).
- Everything else goes on a branch off `main` (5.0 line).

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_AI_PRD.md` §4.1 registry rows, §4.7 (Kiro Prism route spec; library makes no provider calls), §5.8 REQ-AI-41..44, §5.9 REQ-AI-47/-48, §8 registry + compat rows, §9 removal table, §10 API-02..09, §11 migration concerns, §17 AC-AI-02, -16, -17, -18.
- Architecture: D-14, D-17, D-18, D-22, D-27, D-30, §13.2–13.3.
- Owning PRDs (paths per `_shared-contracts.md` SC-02, SC-03, SC-32, SC-33, SC-34; the AI PRD now uses the same paths):
  - DX (§16 PRD-18/20) = `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (`PROMPT_16d_DX_REGISTRY.md`: DX-067 `registry.json`, DX-070 lint, DX-072 `ai-workspace` scaffold, DX-091 build, DX-094 render harness; `PROMPT_16c_DX_CODEMODS_COMPAT.md`: DX-041/042 codemod engine and catalogue, DX-065 `src/compat/index.ts`): registry pipeline `registry/registry.json`, `scripts/registry/build.mjs`, `scripts/registry/lint.mjs` (REQ-DX-46 block rules, including the `PRISM_API_KEY` server-route allowance), schema `packages/cli/schema/registry-item.json`, REQ-DX-47 (the item set), and "Fixture path conventions".
  - REL (§16 PRD-01) = `AURAGLASS_RELEASE_MIGRATION_PRD.md`: schema `docs/schemas/deprecations.schema.json` (REL-010, `PROMPT_01a_REL_BASELINE.md`), `gen-deprecations.mjs` and `warnDeprecated` (REL-070/072, `PROMPT_01d_REL_RUNTIME_42.md`), the §11.2 codemod id catalogue (area id `ai-chat`), the compat contract §4.6, the frozen 4.x fixture `tests/fixtures/consumer-4x/` (REL-115). The root `deprecations.json` instance (`version: 1`) is seeded by TRUST-075 (`PROMPT_00f_TRUST_HYGIENE_CLAIMS.md`).
  - NAV removes `src/registry/recipes.ts` (NAV-136, `PROMPT_11i_NAV_MIGRATE_REMOVE.md`); FND executes the §9 deletions (FND-118/119, `PROMPT_08f_FND_REMOVAL_EXECUTION.md`).
- LLM routing: `/Users/gurbakshchahal/kiro-prism/README.md`, `API.md`, `SETUP.md`, `LLM.md`. Read all four before writing the route (machine policy §4). The route uses Prism's OpenAI-compatible `/v1` and `/v1/models`.
- Tasks: `docs/auraglass-5/tasks/AI.json` AI-098..AI-118.

Requirements: REQ-AI-41, 42, 43, 44, 47, 48; API-02, -03, -06, -08, -09. Acceptance: AC-AI-16, AC-AI-17, AC-AI-18 (verify only), AC-AI-02 (`npm ls` half).

## 2. Scope and canonical paths
The AI PRD and the shared contract registry agree on these paths (no deviation remains):
- Compat goes in `src/compat/ai/{GlassChat,GlassChatInput,GlassMessageList,GlassTypingIndicator,mapChatMessage}.tsx|ts`, re-exported from DX's `src/compat/index.ts` (SC-34); warnings via REL's `warnDeprecated(id)`.
- The codemod is `packages/cli/src/migrate/4to5/transforms/ai-chat.ts`, with cases under `packages/cli/src/migrate/4to5/__fixtures__/ai-chat/<case>/{input,output}.tsx`; marker `// TODO(aura-glass 5): <reason>, see <doc>` (SC-33).
- Registry: items at `registry/items/{ai-sdk-adapter,ai-markdown,ai-model-picker,ai-artifact-panel,ai-trace-tree,ai-eval-dashboard,ai-voice-input}/` (all `registry:item`); block content at `registry/blocks/ai-workspace/` inside DX-072's scaffold (SC-32).

May create or modify: NEW `registry/items/ai-*/**` (7 items with tests); `registry/blocks/ai-workspace/**` content (page, route, README, tests; MODIFY inside DX-072's scaffold); `registry/registry.json` (MODIFY after DX-067: AI entries only); NEW `tests/registry/ai-items.test.ts`; NEW `src/compat/ai/**`, `src/compat/__tests__/ai-compat.test.tsx`, and `src/compat/index.ts` (AI re-exports only); NEW `packages/cli/src/migrate/4to5/transforms/ai-chat.ts`, its fixtures, and its registration in the transform order (after `prop-grammar`, before `css-vars`); the repo-root `deprecations.json` (MODIFY after TRUST-075/REL-010: AI entries, on `release/4.x`; never `docs/deprecations.json`); NEW `docs/auraglass-5/requests/PRD-00-voice-blob-retraction.md`; `jest.config.js` (`roots`/`testMatch` for `registry/**/__tests__` only if needed).

Must NOT touch: `src/registry/recipes.ts` (NAV-136 removes the whole file; AI-112 only verifies the AI recipe is gone); `src/ai/**` component code; `aura-glass` `package.json` dependencies (item deps live in item JSON); `src/components/**`. FND (§16 PRD-16) performs the deletions; this prompt only verifies them in AI-118. Also off limits: other registry items, other transforms, DX pipeline code, the compat index beyond the AI re-exports.

## 3. Prerequisites
- 13a merged (AI-098 needs only the names). 13b–13d merged for the registry/compat tasks: `node -p "require('./etc/api/ai.exports.json').length"` prints 15. Hard.
- TRUST-075/REL-010: `test -f deprecations.json && test -f docs/schemas/deprecations.schema.json`. Hard for AI-098.
- DX-067/070/091/072: `test -f registry/registry.json && test -f scripts/registry/build.mjs && test -f scripts/registry/lint.mjs && test -d registry/blocks/ai-workspace && test -f packages/cli/schema/registry-item.json`; DX-041/042/065: `test -f packages/cli/src/migrate/4to5/index.ts && test -f src/compat/index.ts`. Hard for AI-099..AI-115.
- NAV-016 `AppShell`/`ResizablePanels`, DATA-085 `TreeView`, DATA-038 `Table`, DATA-059 `StatCard`, CTL-109 `Combobox` exported. Hard for the items that use them. If one is missing, its item is blocked.
- FND-118/119: deletion PRs merged on `main`. Hard for AI-118 only. NAV-136 merged. Hard for AI-112 only.

## 4. Steps
1. **AI-098 deprecations** (release/4.x): one entry per name in AI-098, with the successor and class from PRD §9/§10. Don't call `NeuralWeightVisualization`, `NeuromorphicLearningNetwork`, `GlassLiveFilter` or `GlassMusicVisualizer` "fake" (E-01 nuance).
2. **AI-099/100 `ai-sdk-adapter`**: `useAuraChat` maps `useChat` (`status`, `stop`, `regenerate({messageId})`, `sendMessage({text, files})`, the tool-approval response) onto the component props. Pin the item deps exactly to the repo's devDependency versions. Test with an in-memory transport.
3. **AI-101 `ai-markdown`**: streaming-safe close of fences and emphasis. Links are http(s)/mailto only.
4. **AI-102 `ai-model-picker`**: options come from the app route's proxied Prism `/v1/models`, grouped by provider prefix, with capability badges that include text. No hard-coded model ids.
5. **AI-103/104/105/106** artifact panel, trace tree (duration bars with a 2px minimum plus text), eval dashboard (metrics from props, fixtures JSON only), voice input (real `MediaRecorder`, an unsupported-browser state, no mock data).
6. **AI-107/108/109 `ai-workspace`** block, page and route:
   - Use `createOpenAICompatible({ name: 'kiro-prism', baseURL: 'https://prism.auraone.ai/v1', apiKey: process.env.PRISM_API_KEY })`.
   - The model is `PRISM_MODEL`, or else the first id from `/v1/models` at request time.
   - Cap the request at 32 KB (413).
   - Rate-limit with a per-IP bucket of 20 requests/min (429 + `Retry-After` + `{kind:'rate-limit', retryAfterMs}`).
   - With no key, return 503 `{kind:'auth'}`.
   - The README states the server-only key and that the bucket is per-instance only.
   - The route test mocks `fetch` inside the test. There is no network and no real key.
7. **AI-110/111** Registry entries; build + lint; schema test.
8. **AI-112** Verify (no edit) that NAV-136 removed `src/registry/recipes.ts` including the hard-coded "AI product console" recipe, and that `ai-eval-dashboard` is its replacement.
9. **AI-113/114 compat adapters**: implement the REQ-AI-47 mapping table exactly. Emit one dev warning per name through `warnDeprecated(id)` that cites its root `deprecations.json` entry and lists the dropped and ignored props.
10. **AI-115 codemod `ai-chat`**: import rewrite plus the `// TODO(aura-glass 5): …` comment. Never rewrite JSX. Names come from the mappings JSON. Four fixture cases.
11. **AI-116** Write the TRUST (§16 PRD-00) retraction request. **AI-117** Only if REL's 4.3 gate (REL-125) accepts API-02; otherwise record that it was dropped.
12. **AI-118** Verify FND's removals (FND-118/119) and run the fresh-consumer `npm ls`.

## 5. Tests to run
Local (Node/jsdom, no network): `./node_modules/.bin/jest tests/registry/ai-items.test.ts registry/items registry/blocks/ai-workspace src/compat`, `node scripts/registry/lint.mjs`, DX's codemod fixture runner (`packages/cli/src/migrate/4to5/__tests__/`) for `ai-chat`. Remote: `node scripts/registry/build.mjs` and DX's registry render harness `tests/dx/registry-render.spec.ts` (browser) for all 8 entries; REL's frozen 4.x fixture `tests/fixtures/consumer-4x/` through compat (browser, QA L11); `npm pack` + fresh-consumer `npm ls openai @google-cloud/vision ai @ai-sdk/react`. Use GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` or EC2 via the `auraone-remote-run` skill. Never use a local browser or local Docker.

No live Prism calls in any test or CI lane. A manual smoke of the route against real Prism is optional and pending a product-owner decision (PRD §21 item 5). If you run it, do it only from a scratch deployment using the existing server-side Prism credential store per `/Users/gurbakshchahal/.config/agent-policy/reference/shared-service-access.md`; never print or commit the key. Record only the status code and model id.

## 6. Visual evidence
Remote captures (CI artifact `ai-13f-registry`, not committed) from DX's registry render harness: `ai-workspace` at 1440 and 390, light and dark; `ai-model-picker` open with grouped options; `ai-trace-tree` with duration bars; `ai-eval-dashboard` from fixture runs. Also the compat-rendered frozen 4.x `GlassChat` page. Human review only.

## 7. Integrity rules (binding)
- No literal API key, no `NEXT_PUBLIC_*` key, no `OPENAI_API_KEY` or other vendor key names, no direct provider SDK (all routing is Kiro Prism). No hard-coded model ids or metrics.
- No mock audio or fabricated success. Tests mock transports or `fetch` only inside test files.
- No `.skip`/`.only`/`xit`, no snapshot `-u`, no registry-lint exemptions beyond REQ-DX-46's `PRISM_API_KEY` route allowance.
- Don't perform FND or NAV deletions here. AI-112 and AI-118 only verify them.

## 8. Exit criteria
- AC-AI-16: the 7 `registry/items/ai-*` items and `registry/blocks/ai-workspace` validate and render in DX's registry render harness. `route.test.ts` passes with mocked Prism, and the route contains no literal or public key.
- AC-AI-17: `ai-compat.test.tsx` is green, and the frozen 4.x `GlassChat` fixture renders through `aura-glass/compat` with exactly one deprecation warning per name. The `ai-chat` codemod fixtures pass.
- API-03: the `deprecations.json` entries exist on `release/4.x` and pass REL's `scripts/release/verify-deprecations.mjs` against `docs/schemas/deprecations.schema.json`.
- AC-AI-18: the `rg` command returns 0 hits and `src/components/ai/` is absent, or the report says this is blocked on FND-118/119 with the current hit count.
- AC-AI-02 (`npm ls` half): a fresh consumer has no `openai`, `@google-cloud/vision`, `ai` or `@ai-sdk/*`.

## 9. Final report format
```
PROMPT-13f REPORT
Branches/SHAs: release/4.x: ; main:
Tasks: AI-098..AI-118 -> done|blocked (reason) each
Registry: entry -> schema ok / lint ok / render lane URL
Route test: cases pass (413, 429, 503, model selection)
Compat: warnings per name (count); codemod fixtures pass/total
Removal check (AC-AI-18): rg hits = N; src/components/ai exists yes/no
npm ls fresh consumer: output summary
API-02 decision: shipped | dropped (REL-125 gate record)
Prereq blockers (owner task ids):
Deviations: none expected (paths per SC-32/33/34); any other with evidence
Files changed:
```
