# AuraGlass 5.0 PRD: AI Primitives (`aura-glass/ai`, flagships 38–42)

| Field | Value |
|---|---|
| Key | **AI** (task key, `_shared-contracts.md` SC-01). Task ids are `AI-NNN` in `tasks/AI.json`; other PRDs cite this document as `PRD-AI` or by its §16 id PRD-12 |
| PRD id | **PRD-13** is a program self-id and only an alias (SC-01); it must not be used in `depends_on`. The architecture's §16 table lists this boundary as **PRD-12 `PRD-12-ai-primitives.md`**; the file name (`AURAGLASS_AI_PRD.md`) was assigned by the program orchestrator and the boundary is unchanged. **Other PRDs cited in this document use the architecture §16 numbering** (PRD-07 foundation, PRD-11 data/date, PRD-16 removal, and so on); §19 maps each §16 id to its task key and anchor task |
| Owner area | Components: AI product surfaces. Owns `src/ai/**` (NEW), the `./ai` and `./ai.css` rows of `build/exports.manifest.json` (file owned by PKG, SC-12), the content of the AI registry items and the `ai-workspace` block (layout, `registry.json`, build and lint owned by DX, SC-32), and the AI Workspace composition supplied to `showcase/ai-command-center/` (showcase files owned by SB, SC-31) |
| Status | Draft |
| Target release | 5.0.0-alpha.N (after the PRD-07 pattern gate and the PRD-11 `VirtualList` contract), T1 API frozen at 5.0.0-rc.1 (§11.1) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2 D-08/D-13/D-15/D-29/D-30, §3 subpath map, §3.6 budgets, §6 behaviour/a11y foundation, §7 adaptive contrast, §8 motion, §9 RSC, §11.2 rows 38–42, §11.3, §12, §13.2–13.3, §15, §16); `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_MISSING_CAPABILITY_MAP.md` ("AI" rows and §"By area → AI"); `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `autopsy/server-services-ai.md`; `autopsy/runtime-remote.md` §1; `component-inventory.json` (records `GlassChat`, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator`, `GlassVirtualList`, `GlassCombobox`, `GlassHoverCard`, all `src/components/ai/*`); `research/competitors.md` §3; `/Users/gurbakshchahal/kiro-prism/LLM.md` (demo routing only) |
| Related decisions | D-02 (React 19 refs), D-08 (content materials: `Thread` is content-raised by default), D-13 (Base UI: Field, Collapsible, PreviewCard, Combobox), D-14 (no `Glass` prefix; `aura-glass/compat`), D-15 (export cap; this PRD adds exactly 15 value exports to `./ai`, REQ-AI-02), D-22 (registry), D-24 (CSS layers, zero `!important`), D-25 (no JS motion runtime), D-26 (per-import budgets), D-27 (change classes), D-29 (dependency allowlist: **no** `ai`, markdown or highlighter runtime dependency), **D-30 (server/services/simulated AI deleted; `./ai` presentational, no provider calls)**, D-32 (evidence as CI artifacts) |
| Depends on | PRD-07 / `PRD-FND` (Base UI wrapping pattern, `data-ag-part` contract), PRD-11 / `PRD-DATA` (`VirtualList` internal from `@tanstack/react-virtual`; `TreeView` for the trace item). Consumes PRD-03 / `PRD-DS` tokens, PRD-04 / `PRD-MAT` `Surface`, PRD-05 / `PRD-A11Y` announcer/preferences, PRD-06 / `PRD-MOT` motion tokens. PRD-16 (`PRD-FND`) performs the deletions this PRD's §9 lists. Shared files and names follow `_shared-contracts.md`; where this PRD is a consumer it references the owner (§19) |

**Scope rule.** The T1 flagships are exactly §11.2 rows 38–42. The other surfaces the program asks for (model picker, artifacts, trace view, eval dashboard, multimodal input) are delivered at the tier the architecture allows without breaching D-15 or D-29: T2 exports already named in the §3 `./ai` row (`UsageMeter`, `ProviderErrorState`), parts of the flagships (`Composer` attachments, `ToolCall` approval), or consumer-owned **registry items/blocks** (`ai-model-picker`, `ai-artifact-panel`, `ai-trace-tree`, `ai-eval-dashboard`, `ai-sdk-adapter`, block `ai-workspace`). See §4.1 for the tier table and §4.7 for the one explicit deviation.

**LLM routing note.** The library makes no network or provider calls (D-30). Every AuraOne integration, docs live demo or example app that needs a real model routes **Application → Kiro Prism → selected model** (`https://prism.auraone.ai/v1`, OpenAI-compatible `chat/completions`/`responses`; model list from `/v1/models`), per the machine-wide policy and architecture §13.2 ("Any future generation feature routes through Kiro Prism in the *app*, never in the library"). Storybook and certification use recorded fixtures only and never touch the network.

## 1. Problem

AuraGlass 4.1.0 has no AI product primitives, while AI surfaces are now table stakes for a React UI library in 2026 (shadcn chat components June 2026, Vercel AI Elements, prompt-kit, `@mui/x-chat` alpha; `research/competitors.md` §3). What it ships instead is worse than nothing:

1. **The "AI" category is fake.** `src/components/ai/` root-exports generative-art simulations built on `Math.random` and `setTimeout` (`GlassGANGenerator`, `GlassDeepDreamGlass`, `GlassStyleTransfer`, `GlassGenerativeArt`, `AIGlassThemeProvider`) and a "form builder" whose AI is keyword heuristics (`GlassIntelligentFormBuilder`). None calls any model (SERVER-SERVICES-AI-06, CONFIRMED). They are presented as product components.
2. **The chat components that do exist are generic human chat with simulated intelligence.** `GlassChat` (score 2.5) draws "suggested responses" from the random-weight `GlassPredictiveEngine`; its list has no live region, its textarea has no label, and its hover-only actions are unreachable by keyboard. `GlassChatInput` (3) delivers `new Blob(["mock audio data"])` to the consumer's `onVoiceRecording`. `GlassMessageList` (4) has the right `role="log"` seed but a no-op `virtualScroll` prop, `<div onClick>` rows and unlabeled icon buttons.
3. **There is no AI data model.** No message-part model (text, reasoning, tool call, source, file), no streaming text, no tool invocation states, no citations, no reasoning disclosure, no agent run status, no human-in-the-loop approval (capability map rows "AI reasoning display", "Tool invocation", "Citations", "Artifacts", "Model picker", "Agent trace views", "Eval dashboards": all "No" or "Recipe only"). Consumers using the Vercel AI SDK `useChat` must hand-write every renderer.
4. **The package ships a backend and live provider SDKs to every consumer.** `openai`, `@google-cloud/vision`, redis, express and others are hard runtime dependencies (SERVER-SERVICES-AI-03), Node-only `./services/ai/*` subpaths are built for the browser (SERVER-SERVICES-AI-04), and provider failures are reported as fabricated success (SERVER-SERVICES-AI-05). A UI library must not own model calls.
5. **What little renders fails legibility.** In fresh remote Chromium evidence the chat stories' text fails contrast on the busy background and on black (runtime-remote.md §1: 266/342 sampled text runs fail on black, median 1.92:1; chat is named among the busy-background failures).

The result: AuraGlass cannot be used to build the AI workspace that the architecture names as one of its six certification scenes, and its "AI" exports actively damage trust. 5.0 must replace them with a small, honest, presentational set that renders AI SDK–shaped data, is accessible while streaming, and certifies on the material.

## 2. Evidence from the current codebase

All paths verified with `rg --files` at HEAD `15b6de6f7`. Verdicts are from the adversarial verification sections; REFUTED/PARTIAL nuances are honored as stated.

### 2.1 Simulated AI (to delete, not migrate)

| # | Evidence | Finding / verdict |
|---|---|---|
| E-01 | `src/index.ts:453` (`GlassIntelligentFormBuilder`), `src/index.ts:608-611,622-626` (`AIGlassThemeProvider`, `GlassDeepDreamGlass`, `GlassGANGenerator`, `GlassGenerativeArt`, `GlassLiveFilter`, `GlassMusicVisualizer`, `NeuralWeightVisualization`, `NeuromorphicLearningNetwork`, `GlassStyleTransfer`): 10 root-exported `components/ai` entries | SERVER-SERVICES-AI-06, CONFIRMED: five (GAN, DeepDream, StyleTransfer, AIGlassThemeProvider, IntelligentFormBuilder) are simulations with no fetch/OpenAI/`/api/` call; `GlassGenerativeArt` has 20 `Math.random`/`setTimeout` hits. **Nuance honored:** `NeuralWeightVisualization` and `NeuromorphicLearningNetwork` have 0 such hits and `GlassLiveFilter`/`GlassMusicVisualizer` 1–2, so this PRD does **not** call all 10 fake (capability map §"By area → AI"). Their dispositions come from the inventory, not from "fake" |
| E-02 | `src/components/ai/GlassGANGenerator.tsx:242-504`, `GlassDeepDreamGlass.tsx:192-228`, `GlassStyleTransfer.tsx:158-252`, `AIGlassThemeProvider.tsx:289-306`, `GlassIntelligentFormBuilder.tsx:272-330` | Simulation bodies cited by SERVER-SERVICES-AI-06 |
| E-03 | `src/components/ai/ProductionAIIntegration.tsx:1-4,57-88`; `ProductionAIIntegration.stories.tsx:38-39`; comment block `src/index.ts:918-924` | SERVER-SERVICES-AI-11, PARTIAL: instantiates OpenAI/Pinecone/Vision/Auth services in a `"use client"` component and ships in `dist/esm`, **but** it is not root-exported and `./components/*` is not a subpath, so consumers cannot import it. Deleted as dead, dangerous code, not as an exposed API |
| E-04 | `src/components/advanced/GlassPredictiveEngine.tsx` (REMOVE), `src/components/advanced/GlassAutoComposer.tsx` (REMOVE; only `useAutoComposer` is root-exported) | Inventory dispositions; the predictive engine feeds `GlassChat` suggestions (E-06) |
| E-05 | `package.json:180-204` (`./services/ai/{config,cache-service,openai-service,vision-service}`, `./services/websocket/collaboration-service`); `package.json:373,375,390,399` (`@google-cloud/vision`, `openai` peers + peer meta); `package.json:487,503` (same as hard deps); `src/lib/ai-client.ts` | SERVER-SERVICES-AI-03 CONFIRMED (backend hard deps), -04 PARTIAL (browser-built Node services; secret inlining needs a consumer `define`, a hazard not a default leak), -05 CONFIRMED (fabricated success on provider failure), -15 CONFIRMED (deprecated `gpt-3.5-turbo`/`ada-002`, no Prism or provider-neutral adapter). Owned by PRD-16 / D-30; listed here because `./ai` replaces the public story |

### 2.2 Chat components (seeds and lineage for the flagships)

| # | Evidence | Finding |
|---|---|---|
| E-06 | `src/components/interactive/GlassChat.tsx` (1,245 lines; inventory overall 2.5, REDESIGN). `:193-198` six conditional hooks (`predictive ? usePredictiveEngine() : null`, eye tracking, biometric, spatial audio, interaction recorder, achievements); `:25-27` imports `GlassPredictiveEngine`; `:299-304` "Predictive response suggestions" effect; `:201-208` `scrollIntoView({behavior:"smooth"})` on every change; `:514` Enter handler on deprecated `onKeyPress`; `:1213` `GlassPredictiveChat` preset wrapper | Inventory a11y: list lacks `role="log"`/`aria-live`, textarea has no label, hover-only actions (opacity-0 group-hover) unreachable by keyboard, header buttons have no handlers, status is colour-only. Fake complexity "Very high" |
| E-07 | `src/components/interactive/GlassChatInput.tsx` (704 lines; 3, REDESIGN). `:206-211` Enter submits with no `isComposing` check (IME composition commits submit the message); `:553` hard-coded `id="chat-message-input"` and `char-count` id (collide when two instances mount); `:556` `onKeyPress`; `:301-304` voice stop emits `new Blob(["mock audio data"], {type:"audio/wav"})` | Inventory: remove-attachment and formatting buttons unlabeled; emoji grid has no grid navigation. Capability map "Multimodal input: Fake" |
| E-08 | `src/components/interactive/GlassMessageList.tsx` (569 lines; 4, REDESIGN). `:238-239` `role="log" aria-label="Message list"` (the seed §11.2 row 38 names); `:59,111` `virtualScroll` declared and defaulted, never used; `:134-141` smooth `scrollIntoView` on every message change (no "stick to bottom only when already at bottom"); `:296-309` `<div onClick>` rows with no role/tabIndex; `:480` hover-only action rail; `:483-517` icon-only Heart/Reply/More with no `aria-label`; `:513` More is a no-op | Inventory evidence (no separate finding ID); capability map: salvageable, not disqualified |
| E-09 | `src/components/chat/GlassTypingIndicator.tsx` (293 lines; 4.3, POLISH). `:89` `prefersReducedMotion` computed and unused; `:135-149` Tailwind colour/animation classes that do not exist in the shipped CSS (`src/styles/storybook-utility-shim.css:585` has only `bg-blue-500/50`, no `.animate-bounce`); `:274-291` module-scope `document.head` style injection (import side effect) | Inventory a11y is good: `role="status"`, `aria-live="polite"`, dots `aria-hidden`. Becomes the status atom of `AgentSteps`/`Message` pending state (§11.2 row 41) |
| E-10 | `src/components/interactive/GlassVoiceInput.tsx` (2, REMOVE); `src/components/interactive/GlassVirtualList.tsx` (3, REPLACE; broken dynamic sizing) | Voice is not reborn in `./ai` (§4.7). Virtualization comes from PRD-11's `VirtualList` |
| E-11 | `src/components/input/GlassCombobox.tsx` (4.5; best APG model in its shard; defects `:113` no blur close, `:105-107` activedescendant while closed) | Lineage for the `ai-model-picker` registry item, which composes the 5.0 `Combobox` (flagship 12), not this file |
| E-12 | `src/components/modal/GlassHoverCard.tsx` (3.5, CONSOLIDATE): `:327-332` mouse-only trigger, `:353` `role="tooltip"` on interactive content | Anti-pattern `Citation` must not repeat; replaced by Base UI `PreviewCard` (§11.2 row 42) |

### 2.3 Missing capability (grep evidence)

| # | Evidence | Finding |
|---|---|---|
| E-13 | `rg ToolCall\|ToolInvocation` = 0; `rg Citation` = 0; `rg Artifact` = 0 component hits; case-sensitive `rg Reasoning` hits only `src/registry/recipes.ts:306` ("Atlas Reasoning") | Capability map rows "Tool invocation", "Citations", "Artifacts", "AI reasoning display": No |
| E-14 | `rg ModelPicker\|ModelSelect` hits only `src/components/ai/GlassGANGenerator.tsx` | "Model picker: No" |
| E-15 | `rg AgentTrace\|TraceView` = 0 | "Agent trace views: No" |
| E-16 | `src/registry/recipes.ts:937-940` "AI product console" recipe: hard-coded `98.0%`, `94.6%`, `$0.018` in inline-styled `GlassCard`s | "Eval dashboards: Recipe only"; static, no components |
| E-17 | `src/icons/ai.ts`, `src/icons/ai/index.ts`; subpath `./icons/ai` (`package.json:79-83`) | Existing AI glyphs; `./ai` consumes per-glyph icons through `./icons/<name>` (§3 map), no new icon set |

### 2.4 Runtime and visual evidence

| # | Evidence | Finding |
|---|---|---|
| E-18 | `autopsy/runtime-remote.md` §1 (stage removed): contrast fails 266/342 on black (median 1.92:1), 20/342 on busy; "On busy, the failures are in the modal, dialog, drawer, chat and app-shell stories"; tint adapts in 0/84 story×viewport pairs; ink pinned to `rgba(0,0,0,.9)` by `src/styles/glass.css:78-100` and `src/styles/premium-typography.css:113-118` (`!important`) | The chat surfaces are legibility failures over real content. Limit honored: the capture used `storybook-static/` built before the 4.1.0 commit, so it describes pre-4.1.0 source |
| E-19 | `AURAGLASS_CURRENT_STATE_AUTOPSY.md` (42 stories captured, including "chat and chat input"); 0 console/page errors | Hygiene is fine; the defects are material, a11y and data model |

### 2.5 Market bar

`research/competitors.md` §3: shadcn chat (MessageScroller, Message, Bubble, Attachment, Marker; June 2026) and `@shadcn/helpers` human-in-the-loop mocks for the AI SDK; AI Elements (2,476 stars), prompt-kit (3,110); `@mui/x-chat` alpha. Capability map priorities: **P0** chat core and composer; **P1** Reasoning, ToolCall, Citations, ModelPicker; **P2** Artifact, Trace, Eval. Constraint carried from the capability map: components are presentational, accept AI SDK message parts and make no provider calls (competitors.md:31,193).

## 3. Desired end state

At 5.0.0 GA:

1. `aura-glass/ai` is a real subpath (own build entry, own types, own `./ai.css`) exporting the five certified T1 flagships of §11.2 rows 38–42 and their named parts: `Thread`, `Message` (+`StreamingText`, `MessageParts`), `Composer`, `ToolCall` (+`Reasoning`, `AgentSteps`), `SourceList`/`Citation`; plus the two T2 exports the §3 map names, `UsageMeter` and `ProviderErrorState`. Nothing else ships under `./ai`.
2. Every component renders an **AI SDK `UIMessage`** (from `useChat`) with no mapping code: `message.parts` of type `text`, `reasoning`, `tool-*`, `dynamic-tool`, `source-url`, `source-document`, `file`, `step-start` and `data-*` render through `MessageParts`. Unknown part types render nothing and log one dev warning. A consumer on another stack (LangGraph, OpenAI Responses, a custom SSE) passes the same structural shape.
3. The package has **no** provider SDK, no `fetch`, no `WebSocket`, no `EventSource`, no timers that fabricate content, no `Math.random` in render, and no `ai`/`@ai-sdk/*` runtime or peer dependency (D-29, D-30). A static gate proves it.
4. Streaming is first-class and accessible: the thread sticks to the bottom only when the reader is already there, offers "Jump to latest" otherwise, does not jitter during token growth, announces responses once (or by sentence when asked), and renders correctly under reduced motion, forced colors and `contrast: more`.
5. Tool calls show six display states (queued, running, needs-approval, succeeded, failed, denied) with icon **and** text, and support human-in-the-loop approval through a callback; reasoning is a collapsible, streaming-aware disclosure with a duration label; sources are inline citations with a keyboard- and touch-reachable preview.
6. The model picker, artifact panel, agent trace tree, eval dashboard, AI SDK hook binding, markdown/code renderers and voice input exist as **consumer-owned registry items** on the 5.0 components, and an `ai-workspace` registry block assembles them. The block's server route example calls **Kiro Prism** (`https://prism.auraone.ai/v1`) through an OpenAI-compatible provider, with the key read server-side only.
7. The AI Workspace scene (one of the six product surfaces, §1 and §15.4) is built from unmodified components with product-realistic recorded fixtures and passes the full §15.1 matrix: 3 engines × 8 environments × light/dark × glass/tinted/solid × 4 preferences × tier {lightweight, standard, enhanced (Chromium only)} × 2 viewports, plus manual VoiceOver, NVDA and TalkBack runs.
8. All simulated-AI components and the backend are gone from `main` (executed by PRD-16), 4.x chat names map to `./ai` through `aura-glass/compat` adapters (C-D in 4.2/4.3, removed in 6.0), and the `migrate 4to5` codemod rewrites imports and flags the manual data-model change.
9. `{ Thread, Message, Composer }` from `aura-glass/ai` is ≤25 KB min+gz (markdown renderer excluded, §3.6), and a 2,000-message thread streams at ≥55 fps on the desktop perf lane.

## 4. Architecture

### 4.1 Tier and delivery table

| Surface | Delivery | Tier | Foundation | Material role (D-08) | RSC |
|---|---|---|---|---|---|
| `Thread` (#38) | `./ai` export | T1 Certified | Own + PRD-11 `VirtualList` (`@tanstack/react-virtual`) | `content` (no backdrop); jump pill `chrome thin` | client |
| `Message` (#39) + `MessageParts`, `StreamingText` | `./ai` export | T1 | Own | `content-raised` (assistant), `content-raised` + accent ink (user), none (system/tool rows) | `Message.Root/Avatar/Content/Footer` + `MessageParts` server-safe; `Message.Actions`, `StreamingText` client |
| `Composer` (#40) | `./ai` export | T1 | Base UI `Field` + own textarea/attachments | `chrome thick` (floats over the thread; the only backdrop surface in a thread view besides the pill) | client |
| `ToolCall` (#41) + `Reasoning`, `AgentSteps` | `./ai` export | T1 | Base UI `Collapsible` + own; `GlassTypingIndicator` lineage as the running atom | `content-sunken` | `ToolCall`/`Reasoning` client; `AgentSteps` server-safe |
| `SourceList` / `Citation` (#42) | `./ai` export | T1 | Base UI `PreviewCard` (Citation), `Collapsible` (SourceList) | inline chip: none; preview: `overlay regular` | client |
| `UsageMeter` | `./ai` export | T2 Verified | root `Meter` (PRD-14; Base UI Meter, a client module) | none (inline) | server-safe module (no directive, no hooks) that renders `Meter` as a client island |
| `ProviderErrorState` | `./ai` export | T2 | Own + root `Button`, `Alert` | `content-sunken` | client |
| `ai-model-picker` | registry:item | consumer-owned | root `Combobox` (flagship 12) with provider groups and capability badges | overlay (Combobox popup) | client |
| `ai-artifact-panel` | registry:item | consumer-owned | `ResizablePanels` (PRD-10) + `Tabs` + `CodeSurface` item (lazy CodeMirror/Shiki, §13.5 list) | `content-raised` | client |
| `ai-trace-tree` | registry:item | consumer-owned | `TreeView` (PRD-11) + duration bars | `content` | client |
| `ai-eval-dashboard` | registry:item | consumer-owned | `Table`, `StatCard`, `Sparkline`, `ChartFrame` (PRD-11) | `content-raised` | mixed |
| `ai-sdk-adapter` | registry:item | consumer-owned | `@ai-sdk/react` `useChat` → component props | n/a | client |
| `ai-markdown` | registry:item | consumer-owned | consumer's markdown renderer behind `renderText` | n/a | mixed |
| `ai-voice-input` | registry:item | consumer-owned | real `MediaRecorder` + `Composer.Action` slot | n/a | client |
| `ai-workspace` | registry:block | consumer-owned | `AppShell` + all of the above + Prism route example | scene | mixed |

Registry entries follow the D-22 shadcn CLI v4 schema and are published as static JSON at `https://auraglass.dev/r/<name>.json` (§3 registry row, which already lists "AI SDK adapter"). They are outside semver and outside the D-15 export count. Per SC-32, sources live at `registry/items/<id>/` (the seven items above) and `registry/blocks/ai-workspace/` (one of the 10 GA blocks), indexed in `registry/registry.json` (DX-067), built by `scripts/registry/build.mjs` and linted by `scripts/registry/lint.mjs`. DX owns the schema, index, build, lint and render harness and scaffolds the `ai-workspace` block (DX-072); this PRD owns the item and block content.

### 4.2 Data model (`src/ai/types.ts`, NEW)

The model is a structural mirror of the AI SDK `UIMessage`, so `useChat().messages` type-checks against `AgMessage[]` with no cast. There is **no** import of `ai` in shipped code; compatibility is asserted by a type test against the `ai` devDependency (REQ-AI-03).

```ts
export type AgRole = 'user' | 'assistant' | 'system' | 'tool'; // 'tool' is an AuraGlass extension for non-AI-SDK sources
export interface AgMessage<M = AgMessageMetadata> {
  id: string;
  role: AgRole;
  parts: readonly AgPart[];
  metadata?: M;
}
export interface AgMessageMetadata {
  createdAt?: string | number;      // ISO or epoch ms; rendered with Intl.DateTimeFormat
  model?: string;                    // display only
  status?: 'pending' | 'streaming' | 'complete' | 'error' | 'aborted';
  usage?: AgUsage;
}
export type AgPart =
  | { type: 'text'; text: string; state?: 'streaming' | 'done' }
  | { type: 'reasoning'; text: string; state?: 'streaming' | 'done' }
  | AgToolPart                                       // type: `tool-${string}`
  | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string })
  | { type: 'source-url'; sourceId: string; url: string; title?: string }
  | { type: 'source-document'; sourceId: string; mediaType: string; title: string; filename?: string }
  | { type: 'file'; mediaType: string; url: string; filename?: string }
  | { type: 'step-start' }
  | { type: `data-${string}`; id?: string; data: unknown };
export interface AgToolPart {
  type: `tool-${string}`;
  toolCallId: string;
  state: AgToolSdkState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  approval?: { id: string; approved?: boolean; reason?: string };
}
export type AgToolSdkState =
  | 'input-streaming' | 'input-available'
  | 'approval-requested' | 'approval-responded'
  | 'output-available' | 'output-error' | 'output-denied';
export type AgToolDisplayState = 'queued' | 'running' | 'needs-approval' | 'succeeded' | 'failed' | 'denied';
export interface AgUsage { inputTokens?: number; outputTokens?: number; reasoningTokens?: number; cachedInputTokens?: number; contextWindow?: number; costUsd?: number }
export type AgChatStatus = 'ready' | 'submitted' | 'streaming' | 'error'; // mirrors useChat().status
```

Display-state mapping (pure function `toolDisplayState(part)`, exported):

| SDK state | Display state | Label (default, i18n via `labels`) |
|---|---|---|
| `input-streaming` | `queued` | "Preparing" |
| `input-available`, `approval-responded` (approved) | `running` | "Running" |
| `approval-requested` | `needs-approval` | "Needs approval" |
| `output-available` | `succeeded` | "Done" |
| `output-error` | `failed` | "Failed" |
| `output-denied`, `approval-responded` (denied) | `denied` | "Denied" |

**Unverified here:** the exact AI SDK version whose `UIMessage` matches this shape. The approval states are from the AI SDK tool-approval API and must be confirmed against the pinned `ai` devDependency in the first implementation PR; the PR records the version, and the fixture `src/ai/__fixtures__/ui-messages.ai-sdk.json` is generated from that version's types, not hand-written. If a state is absent in the pinned version, the union keeps it (forward compatible) and the type test documents it.

### 4.3 Rendering pipeline

`MessageParts` iterates `message.parts` in order and dispatches by `type` to a renderer map. Defaults: `text` → `StreamingText` (when `state==='streaming'` or message status `streaming`) or plain text; `reasoning` → `Reasoning`; `tool-*`/`dynamic-tool` → `ToolCall`; `source-*` → collected into one `SourceList` after the last text part, with `Citation` markers resolved from `[n]` or `[^sourceId]` tokens only when `citations="markers"`; `file` → attachment chip (images as `<img loading="lazy" decoding="async">` thumbnails with `alt` = filename); `step-start` → a hairline separator with `role="separator"` between steps when `showSteps`; `data-*` → nothing unless `renderers['data-<name>']` is provided.

Consumers override any renderer with `renderers={{ 'tool-weather': WeatherCard, text: MyMarkdown }}` on `MessageParts` or once on `<AiRenderersProvider>` (context, client). `MessageParts` itself never reads context (it must stay server-safe, REQ-AI-07; hooks including `useContext` are unavailable in Server Components): the client `Thread.Items` reads `AiRenderersProvider` and passes the merged map down as the `renderers` prop. A server-rendered `MessageParts` therefore honours only its `renderers` prop. Text rendering defaults to **plain text with preserved line breaks** (`white-space: pre-wrap`); markdown is opt-in through `renderText={(text, { streaming }) => ReactNode}` so no parser enters the budget. The `ai-markdown` registry item supplies a streaming-safe renderer (closes unterminated fences and emphasis while `streaming` is true) and links to the `CodeSurface` item for code blocks.

### 4.4 Thread scroll model

- One scroll container (`data-ag-part="viewport"`) with `overflow-anchor: auto` on items and `overflow-anchor: none` on the bottom sentinel, so token growth in the last message does not move earlier content.
- "Pinned" when `scrollHeight - scrollTop - clientHeight ≤ 64px` (`pinThreshold`, px). While pinned, growth keeps the bottom in view using `scrollTop` assignment in a single `requestAnimationFrame` per frame (no `scrollIntoView`, no smooth scroll during streaming).
- When the reader scrolls up (wheel, touch, keyboard, or `scrollend` with a non-pinned position), auto-scroll stops; `Thread.JumpToLatest` appears with the count of messages added since unpinning ("3 new messages") and scrolls to bottom on activation (smooth unless reduced motion), then re-pins.
- A new **user** message always re-pins (the user just sent it).
- Virtualization switches on above `virtualizeAfter` messages (default 100) through PRD-11's `VirtualList` (`AURAGLASS_DATA_PRD.md` REQ-DATA-25: `anchor: 'end'`, `overscan` 6, `measureElement`, handle `scrollToKey`) with `role` left unset on the list so `Thread.Viewport` remains the single `role="log"` element. Thread's pin rule (64px threshold, unpin on user scroll) governs; if `VirtualList`'s `anchor: 'end'` behaviour diverges from it, Thread passes `anchor: 'start'` and drives `scrollTop` itself, and the divergence is filed against PRD-11. Below the threshold the DOM holds every message so browser find-in-page works; docs state the trade-off.
- `Thread.Root` exposes an imperative handle via React 19 ref-as-prop: `{ scrollToBottom(opts?), scrollToMessage(id), isPinned(): boolean }`. Because REQ-AI-15 and the purity gate ban `scrollIntoView` in `src/ai/`, `scrollToMessage` is implemented through `VirtualList`'s `scrollToKey(id, { align })` handle when virtualized and through a computed `scrollTop` assignment (item `offsetTop` relative to the viewport, adjusted for `block: 'start' | 'center' | 'end'`) when not.
- Loading earlier history: `onReachTop` fires when the first item enters the viewport (IntersectionObserver on a top sentinel, created once, disconnected on unmount); prepending preserves the visual position by restoring `scrollTop + Δheight` in a layout effect.

### 4.5 Announcements while streaming

Architecture §6: one provider announcer (PRD-05), `Thread` uses `role="log"`, `StreamingText` batches polite announcements. Concretely:

- `Thread.Viewport` carries `role="log"`, `aria-label` (required prop `label`, default "Conversation"), `aria-relevant="additions"`. Each message is an `<article aria-labelledby>` whose hidden heading reads "<Author>, <time>" so screen-reader article navigation works.
- While a message streams, its content element has `aria-busy="true"`; it flips to `false` on completion. `StreamingText` additionally sends text to the PRD-05 announcer according to `announce`: `'complete'` (default: one polite announcement of the final text, truncated to 600 characters with "…response continues in the conversation"), `'sentences'` (sentence-boundary batches, no more often than every 1,000 ms), or `'off'`.
- Status changes (`submitted` → "Sending", tool `needs-approval` → "Approval needed: <tool>", `error` → error title) go through the announcer once per transition; `needs-approval` and errors are `assertive`, everything else `polite`.
- **Unverified:** whether `aria-busy` inside `role="log"` suppresses duplicate announcements identically in VoiceOver, NVDA and TalkBack. The manual matrix (§15.2) records the behaviour per reader; if any reader double-announces, the fallback is `aria-live="off"` on the streaming article's content and announcer-only speech, decided before RC-1.

### 4.6 Material, tokens, CSS and the part contract

- All optics come from PRD-04 `Surface` roles (§4.1 table); `src/ai/**` contains no blur, colour, duration or radius literals (static lint, §15.2). The Composer is the only chrome-thick surface in a thread view, so a full AI Workspace stays within the architecture §4.7 standard-tier budget (≤6 blurred surfaces at fine pointer, ≤3 at coarse pointer, blur ≤32px; design targets calibrated at alpha).
- Component tokens requested from PRD-03 (names fixed here, values PRD-03's): `--ag-ai-thread-gap`, `--ag-ai-message-max-inline`, `--ag-ai-bubble-radius`, `--ag-ai-user-bubble-fill`, `--ag-ai-user-bubble-ink`, `--ag-ai-tool-state-{queued|running|needs-approval|succeeded|failed|denied}`, `--ag-ai-caret-color`, `--ag-ai-composer-max-block`. Each state token has a paired icon; colour is never the only signal.
- CSS ships in `./ai.css` inside `@layer ag.components` (D-24): zero `!important`, no global element selectors, no Tailwind utility classes (the E-09 dead-class failure cannot recur).
- `data-ag-part` values (the supported styling/testing contract, §10): Thread `root | viewport | item | jump-to-latest | empty`; Message `root | avatar | author | content | text | caret | actions | action | footer | attachment`; Composer `root | field | textarea | attachments | attachment | attachment-remove | actions | submit | stop | counter | dropzone`; ToolCall `root | trigger | name | state | duration | panel | input | output | error | approval | approve | deny`; Reasoning `root | trigger | label | panel`; AgentSteps `root | step | step-indicator | step-label | step-detail | substeps`; SourceList `root | trigger | list | item | favicon`; Citation `trigger | popup | title | snippet | url`. `data-state` values: Message `pending | streaming | complete | error | aborted`; ToolCall the six display states; Reasoning `streaming | done` plus Base UI `data-open`; Composer `ready | submitted | streaming | error` and `data-dragging` while a file is dragged over.
- Motion (PRD-06): the streaming caret is a CSS `opacity` blink using `--ag-duration-*` tokens and stops under `usePreference('motion') !== 'full'`; the running indicator (three dots, `GlassTypingIndicator` lineage) is CSS-only and becomes a static "Running" label under reduced motion; message entrance is a 1-step `@starting-style` opacity+translateY(4px) fade, disabled under `motion: 'none'`. No JS animation runtime.

### 4.7 Kiro Prism, demos and deviations

- **Library:** no provider calls (D-30). A static gate fails the `./ai` build if any file under `src/ai/` references `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `process.env` (except `process.env.NODE_ENV`), `import.meta.env`, `openai`, `@ai-sdk/`, `@anthropic-ai/`, `@google/` or `ai` as a module specifier.
- **Registry block `ai-workspace` and docs live demo:** the server route template (`app/api/chat/route.ts` in the block) uses `streamText` with `createOpenAICompatible({ name: 'kiro-prism', baseURL: 'https://prism.auraone.ai/v1', apiKey: process.env.PRISM_API_KEY })` and returns `toUIMessageStreamResponse()`. The model id is `process.env.PRISM_MODEL` when set, otherwise the first entry the route fetches from Prism `/v1/models` at request time (never hard-coded, because the Prism catalog changes). The key is server-only (never `NEXT_PUBLIC_*`), the route enforces a per-session rate limit and a 32 KB request cap, and it is the **consumer's** code. The `ai-model-picker` item's demo options come from the same `/v1/models` response, grouped by provider prefix. Any AuraOne consumer integrating `./ai` follows the same Application → Kiro Prism → model path; a direct provider is used only where Prism cannot meet a stated requirement, recorded in that consumer's PR.
- **Storybook and certification:** recorded fixtures only (`src/ai/__fixtures__/*.json`), replayed by a deterministic stream simulator (`src/ai/__fixtures__/replay.ts`, story-only, never exported) driven by Storybook's clock, so pixel and OCR runs are reproducible. No network in any lane.
- **Deviations from the architecture, stated explicitly:**
  1. *PRD id/file name* differ from §16 (see header; key `AI`, crosswalk SC-01). Boundary unchanged.
  2. *`denied` display state* extends §11.2 row 41's five states (queued/running/succeeded/failed/needs-approval). Evidence: the AI SDK approval flow has an explicit denied outcome; folding it into `failed` would mislabel a user decision as an error. C-E, no export added. (The `tool` role is **not** a deviation: row 39 already lists roles user/assistant/system/tool.)
  2a. *Regenerate lives on `Message.Actions`, not `Composer`.* Row 40 lists "stop/regenerate" for `Composer`; this PRD puts Stop on `Composer.Submit` (REQ-AI-28) and Regenerate on the assistant message (`Message.Actions` `regenerate`, REQ-AI-22), matching the AI SDK `regenerate({ messageId })` per-message shape. No capability is dropped.
  3. *Voice input is not in core.* §11.2 row 40 does not list it, the only 4.x voice paths are fake (E-07 mock Blob) or REMOVE (`GlassVoiceInput`), and real capture adds permission and codec surface the certification matrix cannot cover by GA. It ships as the `ai-voice-input` registry item using `MediaRecorder` through the `Composer.Action` slot.
  4. *Model picker, artifact, trace, eval* are registry items/blocks, not `./ai` exports. This is consistent with D-15 and §3 (the `./ai` row does not list them) and the capability map's "ModelPicker = Combobox recipe" and "EvalDashboard recipe", so it is a scoping choice within the architecture, not a deviation; promotion to exports is a 5.x C-E if demand is shown.

## 5. Exact implementation requirements

Each requirement names the test that proves it (§12). "Dev warning" means `console.warn` once per component instance type, stripped in production by the PRD-02 `process.env.NODE_ENV` convention.

### 5.1 Entry, dependencies and purity

- **REQ-AI-01** `aura-glass/ai` is generated from the PKG exports manifest `build/exports.manifest.json` (owner PKG, anchor PKG-005; generator `scripts/build/generate-exports.mjs`, SC-12) with `types` and `default` conditions only (ESM-only, D-03; `AURAGLASS_PACKAGING_BUILD_PRD.md` REQ-PKG-12 manifest shape), resolving to `dist/ai/index.js` and `dist/ai/index.d.ts`; `aura-glass/ai.css` resolves to `dist/css/ai.css`. This PRD adds the two rows by MODIFY; it does not create the manifest. Test: `tests/exports/ai-subpath.spec.mjs` (NEW file in the existing `tests/exports/` directory).
- **REQ-AI-02** Value exports of `aura-glass/ai` are exactly: `Thread`, `Message`, `MessageParts`, `StreamingText`, `Composer`, `ToolCall`, `Reasoning`, `AgentSteps`, `SourceList`, `Citation`, `UsageMeter`, `ProviderErrorState`, `AiRenderersProvider`, `toolDisplayState`, `getMessageText` (15). Adding one requires an API-report diff (REL, SC-04). Test: API Extractor report `etc/api/ai.api.md` and runtime snapshot `etc/api/ai.exports.json` (NEW instances, slug `ai`), produced by REL's `scripts/release/api-report.mjs` and `scripts/release/export-snapshot.mjs` (anchors TRUST-071/072, REL-003), and the `tests/exports/ai-subpath.spec.mjs` export-list snapshot.
- **REQ-AI-03** `AgMessage[]` accepts `UIMessage[]` from the pinned `ai` devDependency without a cast, and `AgToolSdkState` is a superset of that version's tool states. Test: `tests/types/ai-sdk-compat.test-d.ts` (`expectAssignable<AgMessage[]>(uiMessages)`), run by `npm run test:types`.
- **REQ-AI-04** No file under `src/ai/` imports or references `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, `process.env` (sole exception: the exact member expression `process.env.NODE_ENV`, used for the dev-warning convention in §5's preamble), `import.meta.env`, or module specifiers matching `^(ai|openai|@ai-sdk/|@anthropic-ai/|@google/|@google-cloud/)`; none calls `Math.random`; `setTimeout`/`setInterval` appear only in an allowlist the gate encodes (`src/ai/error/ProviderErrorState.tsx` retry countdown, `src/ai/message/StreamingText.tsx` sentence-batch flush), each cleared on unmount and never producing displayed content. Test: `scripts/ci/verify-ai-purity.mjs` (NEW, AST-based, fails CI; run as a step of PKG's `.github/workflows/glass-pipeline.yml`, added by MODIFY after PKG-038) and the ESLint rule `auraglass/no-network-in-ai` added by MODIFY to `eslint-plugin-auraglass.js` (plugin wiring owned by PKG, PKG-015; SC-16/OV-10).
- **REQ-AI-05** The `./ai` entry adds zero runtime dependencies beyond the D-29 allowlist (`@base-ui/react`, `clsx`, `@tanstack/react-virtual`). Test: PKG's dependency-allowlist gate `scripts/ci/verify-deps.mjs` over `docs/dependency-allowlist.json` (owner PKG, anchor PKG-056, SC-14), to which this PRD adds the `./ai` importer scope by MODIFY.
- **REQ-AI-06** Importing `aura-glass/ai` in jsdom has no side effects: no `document.head` mutation, no listeners, no timers (the E-09 pattern is banned). Test: `src/ai/__tests__/side-effects.test.ts` plus PKG's side-effect gate `scripts/ci/verify-side-effects.mjs` (anchor PKG-042) with `./ai` in scope.
- **REQ-AI-07** Server-safe parts (`Message.Root`, `Message.Avatar`, `Message.Content`, `Message.Footer`, `MessageParts` with only `text`/`source-*`/`file`/`step-start` parts, `AgentSteps`, `UsageMeter`) render in a React Server Component with no `"use client"` boundary of their own (they may render client islands such as `SourceList` or `Meter`, which is allowed); none of these modules calls a hook or reads context; every other module starts with `"use client"`. Test: Next 16 consumer canary page `canaries/next16/app/ai-rsc/page.tsx` (canary app owned by PKG, PKG-121/122; run in QA lane L11 Consumer canaries) builds with `next build`, plus the PKG directive lint (PKG-082/084).

### 5.2 Thread (#38)

- **REQ-AI-08** `Thread` is a compound: `Thread.Root`, `Thread.Viewport`, `Thread.Items` (render prop `(message, index) => ReactNode` over `messages: readonly AgMessage[]`), `Thread.Empty`, `Thread.JumpToLatest`. `Thread.Viewport` renders `role="log"`, `aria-label={label}` (default "Conversation"), `aria-relevant="additions"`, `tabIndex={0}`. Test: `src/ai/thread/__tests__/Thread.test.tsx` "renders log semantics".
- **REQ-AI-09** Pinned threshold: auto-scroll keeps the bottom in view only while `distanceFromBottom ≤ pinThreshold` (default 64, px). Appending 50 tokens/frame for 300 frames to a pinned thread leaves `distanceFromBottom ≤ 1px` after each frame; doing the same after the user scrolled up 400px leaves `scrollTop` unchanged (±1px). Test: `tests/ai/thread-scroll.spec.ts` (Playwright, QA L5 Behaviour, remote).
- **REQ-AI-10** When unpinned and ≥1 message is added, `Thread.JumpToLatest` becomes visible with text "{n} new message(s)" (pluralized via `labels.newMessages(n)`), is a `<button>`, and on activation scrolls to the bottom (behavior `smooth` unless `usePreference('motion') !== 'full'`, then `instant`), re-pins and moves focus to the viewport. Test: `Thread.test.tsx` "jump to latest" and `thread-scroll.spec.ts`.
- **REQ-AI-11** A new message with `role === 'user'` always re-pins. Test: `Thread.test.tsx` "user send re-pins".
- **REQ-AI-12** Above `virtualizeAfter` (default 100) messages, the DOM contains ≤ `visibleCount + 2 × overscan(6)` message articles; below it, all messages are in the DOM. Dynamic heights are measured; a streaming last message never causes a measured jump >2px of the first visible message. Test: `tests/ai/thread-virtual.spec.ts` with 2,000-message fixture `src/ai/__fixtures__/thread-2000.json`.
- **REQ-AI-13** `onReachTop` fires once per top-sentinel intersection; after the consumer prepends k messages, the first previously visible message keeps its viewport offset within 1px. Test: `thread-scroll.spec.ts` "prepend keeps position".
- **REQ-AI-14** The imperative handle (`ref` prop, React 19) exposes `scrollToBottom({ behavior? })`, `scrollToMessage(id, { block? })` and `isPinned()`. `scrollToMessage` on a virtualized off-screen id scrolls it into view through `VirtualList.scrollToKey`; on a non-virtualized thread it assigns `scrollTop` directly (no `scrollIntoView`, §4.4). Test: `Thread.test.tsx` "imperative handle" (asserts 0 `scrollIntoView` calls), `thread-virtual.spec.ts`.
- **REQ-AI-15** No `scrollIntoView` and no `behavior: 'smooth'` while any message has `status === 'streaming'` (the E-06/E-08 jitter). Test: `verify-ai-purity.mjs` rule plus `Thread.test.tsx` spy on `Element.prototype.scrollIntoView` = 0 calls.

### 5.3 Message, MessageParts, StreamingText (#39)

- **REQ-AI-16** `Message` is a compound: `Message.Root` (`<article>`, props `message: AgMessage`, `author?: ReactNode`), `Message.Avatar`, `Message.Content` (renders `MessageParts`), `Message.Actions`, `Message.Action`, `Message.Footer`. `Message.Root` sets `data-role={message.role}` and `data-state` from `metadata.status` (default `complete`). Test: `src/ai/message/__tests__/Message.test.tsx`.
- **REQ-AI-17** `Message.Root` renders a visually hidden heading "{author}, {formatted time}" referenced by `aria-labelledby`. Time uses `Intl.DateTimeFormat(locale, { timeZone, timeStyle: 'short' })` with `locale?` and `timeZone?` props (the client `Thread.Items` passes the PRD-05 provider locale/time zone; `Message.Root` itself reads no context). With neither prop set, server and client may format differently, so the RSC canary sets both and asserts 0 hydration warnings, and the docs require them for server rendering. Default authors: user "You", assistant "Assistant", system "System", tool "Tool" (overridable via `labels`). Test: `Message.test.tsx` "accessible name" and "explicit locale/timeZone".
- **REQ-AI-18** `MessageParts` renders parts in array order with the §4.3 default renderer map; a `renderers` prop (populated from the nearest `AiRenderersProvider` by `Thread.Items`, §4.3; `MessageParts` never reads context) overrides by exact `type`, then by prefix (`tool-*`, `data-*`). Unknown types render `null` and issue one dev warning naming the type. Test: `src/ai/message/__tests__/MessageParts.test.tsx` over every fixture in `ui-messages.ai-sdk.json`.
- **REQ-AI-19** Default text rendering is plain text with `white-space: pre-wrap` and no HTML injection: a part `text: "<img src=x onerror=alert(1)>"` renders as literal text (no `dangerouslySetInnerHTML` anywhere in `src/ai/`). `renderText(text, { streaming, messageId })` replaces it. Test: `MessageParts.test.tsx` "escapes text", purity script bans `dangerouslySetInnerHTML` in `src/ai/`.
- **REQ-AI-20** `StreamingText` renders its `text` prop and, while `streaming`, a caret span (`data-ag-part="caret"`, `aria-hidden="true"`). It does not re-render more than once per animation frame regardless of prop update rate (internal rAF coalescing of the displayed string via `useSyncExternalStore`, no per-token React state in parents). Test: `src/ai/message/__tests__/StreamingText.test.tsx` (React Profiler: 1,000 updates in 1 frame → 1 commit).
- **REQ-AI-21** Announcements follow §4.5: `announce='complete'` sends exactly one polite announcement on completion (≤600 chars + suffix); `'sentences'` sends batches no closer than 1,000 ms; `'off'` sends none; the content element has `aria-busy="true"` only while streaming. Test: `StreamingText.test.tsx` with the PRD-05 announcer mock.
- **REQ-AI-22** `Message.Actions` is always in the accessibility tree and tab order; it is visible on `:hover`, `:focus-within`, `(pointer: coarse)` and `(hover: none)` (never hover-only, fixing E-06/E-08). Built-in actions: `copy` (copies `getMessageText(message)` via `navigator.clipboard.writeText`, announces "Copied"), `regenerate` (`onRegenerate(messageId)`), `feedback` (`onFeedback(messageId, 'up' | 'down')`, `aria-pressed`). Every icon-only action has an `aria-label`. Test: `Message.test.tsx` "actions reachable", axe pass.
- **REQ-AI-23** `file` parts with `mediaType` `image/*` render a thumbnail `<img>` with `alt` = filename (or "Attached image"), `loading="lazy"`, `decoding="async"`, explicit `width`/`height` from `thumbnailSize` (default 96) to avoid layout shift; other media types render a chip with filename, type and a link (`download` attribute when `url` is a `blob:`/`data:` URL). Test: `MessageParts.test.tsx` "file parts".
- **REQ-AI-24** `metadata.status === 'error'` renders the inline `ProviderErrorState` variant `compact` below the content; `aborted` renders "Stopped" (`data-state="aborted"`). Test: `Message.test.tsx`.

### 5.4 Composer (#40)

- **REQ-AI-25** `Composer` is a compound on Base UI `Field`: `Composer.Root` (`<form>`), `Composer.Textarea`, `Composer.Attachments`, `Composer.Actions`, `Composer.Action`, `Composer.Submit`, `Composer.Counter`. Props on Root: `value`/`defaultValue`/`onValueChange` (the shared selection-style contract, §11.1), `status: AgChatStatus`, `onSubmit({ text, files }: { text: string; files: File[] })`, `onStop()`, `disabled`, `maxLength`, `submitOnEnter` (default `true`). IDs come from `useId` (two instances never collide, fixing E-07 `:553`). Test: `src/ai/composer/__tests__/Composer.test.tsx`.
- **REQ-AI-26** IME-safe submit: Enter submits only when `!event.nativeEvent.isComposing && event.keyCode !== 229 && !event.shiftKey && submitOnEnter`; Shift+Enter inserts a newline; Cmd/Ctrl+Enter submits even when `submitOnEnter` is `false`. Handlers use `onKeyDown` (never `onKeyPress`). Test: `Composer.test.tsx` "IME composition does not submit" (dispatches `compositionstart`, Enter with `isComposing: true`, asserts `onSubmit` not called) and Playwright `tests/ai/composer-ime.spec.ts` on WebKit with a Japanese IME composition sequence.
- **REQ-AI-27** Empty or whitespace-only text with no files does not submit; `Composer.Submit` is `aria-disabled="true"` (not `disabled`, so it stays focusable) in that case. Test: `Composer.test.tsx`.
- **REQ-AI-28** `status === 'submitted' | 'streaming'` swaps `Composer.Submit` to a Stop button (`aria-label` "Stop generating", calls `onStop`), keeps the textarea editable and blocks a second submit; `status === 'error'` keeps the draft text. Test: `Composer.test.tsx` "stop swap".
- **REQ-AI-29** Attachments: a hidden `<input type="file" multiple>` opened by `Composer.Action kind="attach"`, paste of files from the clipboard, and drag-drop onto `Composer.Root` (`data-dragging` while over). Props `accept` (MIME list), `maxFiles` (default 10), `maxFileSize` (bytes, default 20 MiB); rejected files call `onAttachmentReject({ file, reason: 'type' | 'size' | 'count' })` and announce the reason. No file is read, uploaded or encoded by the library; `files` are passed through. Each chip has a remove button labelled "Remove {filename}". Test: `Composer.test.tsx` "attachments" and `tests/ai/composer-dropzone.spec.ts`.
- **REQ-AI-30** The textarea auto-grows from 1 to `maxRows` (default 8) lines using `field-sizing: content` where supported and a measured fallback otherwise; growth never moves the thread's pinned bottom (Thread re-pins in the same frame). Test: `tests/ai/composer-grow.spec.ts` on Chromium, WebKit, Gecko.
- **REQ-AI-31** `Composer.Counter` shows `{length}/{maxLength}` and is announced politely only when crossing 90% and 100% of `maxLength`. Test: `Composer.test.tsx`.

### 5.5 ToolCall, Reasoning, AgentSteps (#41)

- **REQ-AI-32** `ToolCall` (Base UI `Collapsible`) takes `part: AgToolPart | dynamic-tool part`, `title?`, `labels?`, `renderInput?`, `renderOutput?`, `onApprovalResponse?({ approvalId, toolCallId, approved, reason? })`, `defaultOpen?`. Display state comes from `toolDisplayState(part)` (§4.2 table) and is exposed as `data-state`; the header shows an icon **and** the text label for every state. Test: `src/ai/tool/__tests__/ToolCall.test.tsx` iterating all seven SDK states.
- **REQ-AI-33** Default open when state is `needs-approval` or `failed`; otherwise closed. The trigger is a `<button>` with `aria-expanded` and `aria-controls`. Input and output default to `JSON.stringify(value, null, 2)` in `<pre>` capped at `maxPreviewChars` (default 4,000) with a "Show all" toggle. Test: `ToolCall.test.tsx`.
- **REQ-AI-34** In `needs-approval`, `ToolCall` renders `ToolCall.Approval` with Approve and Deny buttons (Deny optionally reveals a reason `TextField`); activation calls `onApprovalResponse` exactly once and disables both buttons until `part.state` changes. Without `onApprovalResponse` the panel renders read-only text "Waiting for approval" and a dev warning fires. Test: `ToolCall.test.tsx` "approval".
- **REQ-AI-35** `Reasoning` (Collapsible) takes `text`, `state: 'streaming' | 'done'`, `durationMs?`. It opens automatically when streaming starts and closes once on `done` unless the user toggled it during streaming; the label reads "Thinking…" while streaming and "Thought for {s} s" (`Intl.NumberFormat`, 0 decimals ≥10 s, 1 decimal <10 s) when done. Duration is `durationMs` if given, else measured from the first streaming render to `done` via `performance.now()`. Test: `src/ai/reasoning/__tests__/Reasoning.test.tsx`.
- **REQ-AI-36** `AgentSteps` renders an `<ol>` of `steps: AgStep[]` where `AgStep = { id; label; state: AgToolDisplayState | 'skipped'; detail?; startedAt?; endedAt?; children?: AgStep[] }`; nested `children` render as nested `<ol>` (orchestration of sub-agents), the running step has `aria-current="step"`, each step shows icon + state text + duration when both timestamps exist. Server-safe (no hooks). Test: `src/ai/agent/__tests__/AgentSteps.test.tsx` and RSC canary.

### 5.6 SourceList, Citation (#42)

- **REQ-AI-37** `SourceList` takes `sources: (source-url | source-document part)[]`, renders a Collapsible trigger "{n} sources" (default closed when n > 3, open otherwise) and an `<ol>` whose items have `id="ag-src-{messageId}-{sourceId}"`, title, hostname (via `new URL(url).hostname`, rendered as text) and an external link with `rel="noopener noreferrer"` and `target="_blank"` plus visually hidden "(opens in new tab)". Non-`http(s)` URLs render as plain text, never as `href`. Test: `src/ai/sources/__tests__/SourceList.test.tsx` "rejects javascript: URLs".
- **REQ-AI-38** `Citation` takes `source` and `index`; it renders an `<a href="#ag-src-{messageId}-{sourceId}">` labelled "Source {index}: {title}" showing `[{index}]`, and a Base UI `PreviewCard` popup (title, snippet if provided, hostname) opening on hover after 300 ms and on keyboard focus, closing on Escape and blur. The popup portals into the single `[data-ag-portal-root]` through FND's `usePortalContainer()` (FND-007), and Escape reaches it only through A11Y's `LayerStack` (A11Y-049), the sole Escape dispatcher (SC-25); `Citation` adds no own `keydown` Escape handler. Activation on touch or Enter navigates to the in-message `SourceList` item (which is opened if collapsed) and moves focus there. The popup has no `role="tooltip"` (fixing E-12). Test: `src/ai/sources/__tests__/Citation.test.tsx`, `tests/ai/citation-preview.spec.ts`.

### 5.7 T2: UsageMeter, ProviderErrorState

- **REQ-AI-39** `UsageMeter` takes `usage: AgUsage`, `format?: 'compact' | 'full'`; renders input/output/reasoning tokens with `Intl.NumberFormat` compact notation and, when `contextWindow` is set, a root `Meter` (`role="meter"`, `aria-valuenow`, `aria-valuemax`) of `(input+output)/contextWindow`, state `warning` ≥80% and `critical` ≥95%; `costUsd` renders with `Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 4 })` (`locale?` prop, no context read). Server-safe module; the root `Meter` it renders is a client island. Test: `src/ai/usage/__tests__/UsageMeter.test.tsx`.
- **REQ-AI-40** `ProviderErrorState` takes `kind: 'rate-limit' | 'auth' | 'network' | 'content-filter' | 'context-length' | 'aborted' | 'unknown'`, `title?`, `detail?`, `retryAfterMs?`, `onRetry?`, `variant?: 'compact' | 'panel'`. It renders `role="alert"` for `panel`, a per-kind default title and guidance, and a Retry `Button` disabled with a live countdown when `retryAfterMs` is set. It never renders placeholder success content (the inverse of SERVER-SERVICES-AI-05). Test: `src/ai/error/__tests__/ProviderErrorState.test.tsx`.

### 5.8 Registry items and the AI SDK adapter

- **REQ-AI-41** Registry sources follow SC-32: items at `registry/items/{ai-sdk-adapter, ai-markdown, ai-model-picker, ai-artifact-panel, ai-trace-tree, ai-eval-dashboard, ai-voice-input}/` (all `registry:item`, including `ai-eval-dashboard`) and the GA block at `registry/blocks/ai-workspace/` (scaffolded by DX-072; this PRD writes its content). Each is registered in `registry/registry.json` (owner DX, DX-067) by MODIFY and built by `scripts/registry/build.mjs` to `apps/docs/public/r/<id>.json`, served at `https://auraglass.dev/r/<id>.json` and published in `@auraglass/registry`. Each item declares its npm dependencies (for example `@ai-sdk/react` for `ai-sdk-adapter`) in the item JSON, never in `aura-glass`'s `package.json`. Test: `tests/registry/ai-items.test.ts` (schema validation) and DX's registry render harness `tests/dx/registry-render.spec.ts` (DX-094).
- **REQ-AI-42** `ai-sdk-adapter` exports `useAuraChat(options)` returning `{ threadProps, composerProps, messageProps(message), toolCallProps(part) }` wired to `useChat`: `status`, `stop`, `regenerate({ messageId })`, `sendMessage({ text, files })`, and the SDK's tool-approval response function. Test: `registry/items/ai-sdk-adapter/__tests__/useAuraChat.test.tsx` against `@ai-sdk/react` with a mocked transport (no network).
- **REQ-AI-43** `ai-workspace` contains `app/api/chat/route.ts` calling Kiro Prism as in §4.7 (`baseURL: 'https://prism.auraone.ai/v1'`, `apiKey: process.env.PRISM_API_KEY`, model from `/v1/models` or `process.env.PRISM_MODEL`), a 32 KB body cap (HTTP 413 above it) and a per-IP token bucket (20 requests/min; HTTP 429 with `Retry-After` and body `{ kind: 'rate-limit', retryAfterMs }`). The bucket is in-memory and the block `README.md` states it is per-instance only and must be replaced by a shared store (for example the app's existing KV) before multi-instance deployment. The template contains no literal key, no `NEXT_PUBLIC_` key, and fails closed (HTTP 503 with a `ProviderErrorState`-compatible JSON body `{ kind: 'auth' }`) when the key is unset. Test: `registry/blocks/ai-workspace/__tests__/route.test.ts` with a mocked Prism.
- **REQ-AI-44** `ai-model-picker` composes root `Combobox` with `options: { id; label; provider; capabilities?: ('vision'|'tools'|'reasoning'|'long-context')[]; contextWindow?; }[]`, grouped by `provider`, capability badges with text, and `value`/`onValueChange`. `ai-trace-tree` maps `AgStep` trees (REQ-AI-36) onto PRD-11 `TreeView` with a duration bar per span (`width` = span/total, min 2px) and text durations. `ai-eval-dashboard` renders `Table` of eval runs (columns: run, model, dataset, pass rate, Δ vs baseline, cost, started) plus three `StatCard`s fed from props; it ships **no hard-coded metrics** (fixing E-16). Test: DX registry render harness (`tests/dx/registry-render.spec.ts`) + `tests/registry/ai-items.test.ts` "no numeric literals in eval dashboard sample data outside fixtures".

### 5.9 Material, certification and migration

- **REQ-AI-45** `src/ai/**` contains no colour, blur, radius or duration literals and no `!important`; every surface uses PRD-04 `Surface`/content materials per §4.1. Test: QA lane L1 Static (DS raw-value lint, SC-17) scoped to `src/ai/`.
- **REQ-AI-46** Every T1 flagship meets the §11.3 deliverables: typed variant metadata (`src/ai/<component>/<component>.meta.ts`), `data-ag-part`/`data-state` table (§4.6), selector-change table vs 4.x, registry block usage, APG keyboard spec `tests/a11y/apg/<kebab>.apg.spec.ts` on A11Y's harness (A11Y-073, SC-30; files `thread`, `message`, `composer`, `tool-call`, `citation`), budget row in `docs/size-budgets.json`, perf grade ≥C, environment-matrix baselines, codemod fixtures. Test: `scripts/ci/verify-flagship-deliverables.mjs` (owner QA, §16 PRD-19; no creating task exists yet, see §21 item 7) with the five AI entries.
- **REQ-AI-47** `aura-glass/compat` exports `GlassChat`, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator` as adapters that map 4.x `ChatMessage` (`src/components/interactive/GlassChat.tsx:33-57`: `{ id, content, sender: { id, name, avatar? }, timestamp: Date, type: 'text'|'image'|'file'|'system', attachments? }`) to `AgMessage` (`content` → one `text` part; `attachments[]` → `file` parts; `type === 'system'` → `system`; `sender.id === currentUserId ?? currentUser.id` → `user`, else `assistant`; `timestamp` → `metadata.createdAt`; `reactions`/`replyTo`/`edited` dropped and named in the warning) and warn once in dev through `warnDeprecated(id)` (`src/internal/warnDeprecated.ts`, REL-072) with the root `deprecations.json` entry. Adapters live at `src/compat/ai/{GlassChat,GlassChatInput,GlassMessageList,GlassTypingIndicator}.tsx` and are re-exported from `src/compat/index.ts` (owner DX, DX-065, SC-34); this PRD supplies the prop tables and adapter content. Props without a 5.0 meaning (`predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `consciousness`, `trackAchievements`, `virtualScroll`, `onVoiceRecording`) are accepted, ignored and named in the warning. Test: `src/compat/__tests__/ai-compat.test.tsx`.
- **REQ-AI-48** `npx @auraglass/cli migrate 4to5 --transform ai-chat` (area id `ai-chat`, registered in REL's §11.2 catalogue and the deprecations schema `codemod` enum, SC-33) rewrites imports of the four names to `aura-glass/compat` (automatic) and inserts a `// TODO(aura-glass 5): migrate to aura-glass/ai Thread/Message/Composer — data model changed, see <migration doc>` comment at each usage; it never rewrites JSX structure. Transform `packages/cli/src/migrate/4to5/transforms/ai-chat.ts`; fixtures `packages/cli/src/migrate/4to5/__fixtures__/ai-chat/<case>/{input,output}.tsx`; mapping data only from the generated `mappings/*.json` (`scripts/release/gen-deprecations.mjs --codemods`, REL-070) and `<Component>.meta.ts` `migration` fields. Engine owned by DX (DX-041/042). Test: the DX codemod fixture runner (`packages/cli/src/migrate/4to5/__tests__/`).

## 6. Files/directories affected (existing paths)

All verified to exist at HEAD. "Owner" says who edits; this PRD edits only what it owns and hands the rest to the named PRD (§16 exclusivity).

| Path | Change | Owner |
|---|---|---|
| `src/components/interactive/GlassChat.tsx`, `GlassChat.stories.tsx`, `GlassChat.test.tsx`, `__snapshots__/GlassChat.test.tsx.snap` | Deprecated (C-D in 4.2), deleted in 5.0 `main`; lineage for `Thread`/`Message` | this PRD (4.2 deprecation note), PRD-16 (deletion) |
| `src/components/interactive/GlassChatInput.tsx`, `.stories.tsx`, `.test.tsx`, `__snapshots__/GlassChatInput.test.tsx.snap` | Same; lineage for `Composer`. 4.1.1 note: `:301-304` mock Blob is a fake payload to consumer code, see §11.3 | this PRD / PRD-16 |
| `src/components/interactive/GlassMessageList.tsx`, `.stories.tsx`, `.test.tsx`, `__snapshots__/GlassMessageList.test.tsx.snap` | Same; `role="log"` seed for `Thread` | this PRD / PRD-16 |
| `src/components/chat/GlassTypingIndicator.tsx`, `.stories.tsx`, `.test.tsx`, `__snapshots__/` | Same; visual lineage of the running atom (CSS re-authored, no module-scope `<style>` injection) | this PRD / PRD-16 |
| `src/components/interactive/GlassVoiceInput.tsx` (+ story, test, snapshot) | REMOVE (no successor in core; `ai-voice-input` registry item) | PRD-16 |
| `src/components/interactive/GlassVirtualList.tsx` | REPLACE by PRD-11 `VirtualList` | PRD-11 |
| `src/components/interactive/index.ts` | Drops the chat exports in 5.0 | PRD-16 |
| `src/components/ai/*` (all files incl. `examples/AIDemo.*`, `__snapshots__/`, `index.ts`) | Deleted or moved per inventory disposition (§9) | PRD-16 |
| `src/components/advanced/GlassPredictiveEngine.tsx`, `GlassAutoComposer.tsx` (+ stories, tests, snapshots) | Deleted | PRD-16 |
| `src/index.ts:405-406,441,453,494,608-611,622-626,918-924,1148,1209` | Remove chat/AI root exports and the stale comment block; no `./ai` re-export from root (D-15, §3 "no subpath aliases the root") | PRD-16 (removal), PRD-02 (manifest) |
| `src/types.ts:259` (`GlassChatProps`) | Moves to `aura-glass/compat` types | PRD-16 / PRD-18 |
| `src/registry/recipes.ts:930-945` ("AI product console", hard-coded metrics) | Deleted with the whole file by NAV-136 (app-shell recipes family, SC-38); replaced by the `ai-eval-dashboard` item | NAV (removal), this PRD (item source; AI-112 only verifies the AI recipe is gone and depends on NAV-136) |
| `src/stories/AppShell.stories.tsx:17` ("AI Command Center Shell") | Deleted by SB (SC-31, SB-106 with NAV's deletion task); the AI Workspace composition moves to `showcase/ai-command-center/` (SB-109 creates the files, this PRD supplies the composition) | SB (files), this PRD (composition content), PRD-10 / NAV (shell parts) |
| `src/icons/ai.ts`, `src/icons/ai/index.ts` | Consumed (glyphs: send, stop, attach, sparkle, tool, source); any missing glyph is added as one module per glyph | PRD-02 icon pipeline; this PRD requests glyphs |
| `src/lib/ai-client.ts`, `src/services/**`, `server/`, `workers/`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `tsconfig.server.json` | Extracted to private archive (§13.2) | PRD-16 |
| `package.json:180-204` (`./services/*` exports), `:369-410` (`openai`, `@google-cloud/vision` peers), `:486-508` (backend deps) | Removed; `./ai`, `./ai.css` added via the manifest | PRD-02 / PRD-16 |
| `eslint-plugin-auraglass.js` | Adds rule `auraglass/no-network-in-ai` by MODIFY (OV-10) | PKG (file and wiring, PKG-015), this PRD (rule) |
| `tests/types/tsconfig.json` | Includes `tests/types/ai-sdk-compat.test-d.ts` | this PRD |
| `.storybook/preview.tsx` | Single `StoryEnvironment` + `StoryRoot` decorator owned by SB (SB-048); this PRD registers the AI fixture clock decorator through SB's decorator contract by MODIFY after SB-048 | SB (owner), this PRD (decorator) |
| `.github/workflows/glass-pipeline.yml` | Gains the `verify-ai-purity`, `no-network-in-ai` and `test:types` steps by MODIFY (no new workflow file; job names per SC-10) | PKG (file, PKG-038), this PRD (steps) |
| `llms.txt` | Gains the `./ai` section generated from metadata | PRD-20 (DX) |

## 7. Components affected

| 4.x component | Inventory score / disposition | 5.0 outcome |
|---|---|---|
| `GlassChat` (+ `GlassPredictiveChat` and five preset wrappers) | 2.5 / REDESIGN | `Thread` + `Message` + `Composer`; compat adapter; predictive/consciousness features dropped |
| `GlassChatInput` | 3 / REDESIGN | `Composer`; voice dropped from core |
| `GlassMessageList` | 4 / REDESIGN | `Thread` (`role="log"` kept, virtualization real) |
| `GlassTypingIndicator` | 4.3 / POLISH | Running atom inside `ToolCall`/`AgentSteps`/pending `Message`; compat maps it to `AgentSteps` single running step |
| `GlassVoiceInput` | 2 / REMOVE | none (registry `ai-voice-input`) |
| `GlassCombobox` | 4.5 / CONSOLIDATE | lineage of root `Combobox` (PRD-08) used by `ai-model-picker` |
| `GlassHoverCard` | 3.5 / CONSOLIDATE | not reused; `Citation` uses Base UI `PreviewCard` |
| `GlassVirtualList` | 3 / REPLACE | PRD-11 `VirtualList`, consumed by `Thread` |
| `GlassIntelligentFormBuilder` | 3.5 / REDESIGN (target outside `./ai`) | not an AI primitive; out of this PRD (inventory target: form-schema recipe) |
| `GlassTimeline` | 4 / POLISH | PRD-11 `Timeline`; `ai-trace-tree` may show a timeline toggle |
| `AppShell` (PRD-10) | — | hosts the AI Workspace scene |

## 8. New components/files

All NEW (none exist at HEAD; `src/ai`, `registry/`, `src/compat`, `etc/`, `canaries/`, `packages/` verified absent). Paths owned by another PRD are marked.

**Source (`src/ai/`)**

| Path | Contents |
|---|---|
| `src/ai/index.ts` | Plain re-export module, no directive (§9.1); the 15 value exports of REQ-AI-02 and all `Ag*` types |
| `src/ai/types.ts` | §4.2 data model |
| `src/ai/tool-state.ts` | `toolDisplayState()` |
| `src/ai/text.ts` | `getMessageText(message)` (joins `text` parts with `\n\n`; excludes reasoning) |
| `src/ai/renderers.tsx` | `AiRenderersProvider`, renderer registry ("use client") |
| `src/ai/thread/Thread.tsx`, `useThreadScroll.ts`, `Thread.meta.ts` | Thread compound, scroll model (§4.4) |
| `src/ai/message/Message.tsx`, `MessageParts.tsx`, `StreamingText.tsx`, `MessageActions.tsx`, `Message.meta.ts` | Message family; `MessageActions.tsx` and `StreamingText.tsx` are "use client" leaf modules |
| `src/ai/composer/Composer.tsx`, `useAttachments.ts`, `Composer.meta.ts` | Composer |
| `src/ai/tool/ToolCall.tsx`, `ToolApproval.tsx`, `ToolCall.meta.ts` | ToolCall |
| `src/ai/reasoning/Reasoning.tsx` | Reasoning |
| `src/ai/agent/AgentSteps.tsx` | AgentSteps (server-safe) |
| `src/ai/sources/SourceList.tsx`, `Citation.tsx`, `SourceList.meta.ts` | Sources |
| `src/ai/usage/UsageMeter.tsx` | UsageMeter (server-safe) |
| `src/ai/error/ProviderErrorState.tsx` | ProviderErrorState |
| `src/ai/styles/ai.css` | `@layer ag.components` rules for all of the above, built to `dist/css/ai.css` (PRD-02 CSS layout) |
| `src/ai/__fixtures__/ui-messages.ai-sdk.json` | Generated from the pinned `ai` devDependency (every part type and tool state) by `scripts/build/gen-ai-fixtures.mjs` from the typed source `src/ai/__fixtures__/ui-messages.source.ts` (SC-11 layout: no `scripts/ai/` directory) |
| `src/ai/__fixtures__/thread-2000.json`, `stream-*.json`, `replay.ts` | Perf thread (generated by `scripts/build/gen-ai-thread-fixture.mjs`, seeded PRNG in the script only); recorded token streams (assistant answer, reasoning, 3 tool calls incl. approval and denial, citations, error); deterministic replay (story/test only, excluded from the build) |
| `src/ai/**/__tests__/*.test.tsx` | Unit tests (§12) |
| `src/ai/**/*.stories.tsx` | Stories (§13) |

**Tooling and tests**

| Path | Contents |
|---|---|
| `scripts/ci/verify-ai-purity.mjs` | REQ-AI-04/-15/-19 AST gate (step in PKG's `glass-pipeline.yml`) |
| `scripts/build/gen-ai-fixtures.mjs` | Writes `ui-messages.ai-sdk.json` from the typed source |
| `scripts/build/gen-ai-thread-fixture.mjs` | Writes `thread-2000.json` deterministically (`--check` mode) |
| `tests/types/ai-sdk-compat.test-d.ts` | REQ-AI-03 |
| `tests/exports/ai-subpath.spec.mjs` | REQ-AI-01/-02 |
| `tests/ai/*.spec.ts` | Behaviour Playwright specs (QA lane L5 Behaviour, remote only) |
| `tests/a11y/apg/{thread,message,composer,tool-call,citation}.apg.spec.ts` | APG keyboard specs on A11Y's harness (A11Y-073), one per widget (SC-30) |
| `tests/visual/ai/ai-workspace.visual.spec.ts` | Environment visual/OCR matrix (QA lanes L6/L7, SC-30) |
| `tests/perf/browser/ai-streaming.spec.ts` | §16 runtime budgets on PERF's harness (`tests/perf/harness/run-perf.mjs`, PERF-039; lane L10) |
| `tests/registry/ai-items.test.ts` | Registry schema + content checks |
| `etc/api/ai.api.md`, `etc/api/ai.exports.json` | API Extractor report and runtime export snapshot (REL format, SC-04) |
| `canaries/next16/app/ai-rsc/page.tsx`, `canaries/next16/app/ai-client/page.tsx` | Consumer canary pages added by MODIFY to PKG's canary app (PKG-121/122), run in QA L11 |

**Registry (DX layout, SC-32)**: `registry/items/ai-sdk-adapter/useAuraChat.ts`, `registry/items/ai-markdown/StreamingMarkdown.tsx`, `registry/items/ai-model-picker/ModelPicker.tsx`, `registry/items/ai-artifact-panel/ArtifactPanel.tsx`, `registry/items/ai-trace-tree/TraceTree.tsx`, `registry/items/ai-eval-dashboard/EvalDashboard.tsx`, `registry/items/ai-voice-input/VoiceInputAction.tsx`, and block `registry/blocks/ai-workspace/` (scaffold DX-072; content here: page, `app/api/chat/route.ts`, `README.md` stating the Prism route and server-only key).

**Compat and CLI (owned by DX, §16 PRD-18; specified here)**: `src/compat/ai/{GlassChat,GlassChatInput,GlassMessageList,GlassTypingIndicator}.tsx` (REQ-AI-47 adapters, re-exported from DX's `src/compat/index.ts`), `packages/cli/src/migrate/4to5/transforms/ai-chat.ts` and `__fixtures__/ai-chat/` (REQ-AI-48). Entries in the repo-root `deprecations.json` (schema `docs/schemas/deprecations.schema.json` owned by REL, REL-010; instance seeded by TRUST-075; SC-02/SC-03) for `GlassChat`, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator`, `GlassPredictiveChat`, `GlassVoiceInput` and every §9 simulated-AI export (`codemod` is `ai-chat` for the four chat names and `null` otherwise, SC-03).

## 9. Components/files to remove or deprecate

Deletion is executed by PRD-16 (one PR per family); this PRD supplies the successor and the deprecation text. Dispositions are the inventory's.

| 4.x item | Disposition | Successor / note | Class |
|---|---|---|---|
| `GlassChat`, `GlassPredictiveChat` and preset wrappers (`GlassChat.tsx:1213` etc.) | REDESIGN → replaced | `Thread`+`Message`+`Composer`; `aura-glass/compat` adapter | C-D 4.2 → removed from root in 5.0, compat until 6.0 |
| `GlassChatInput` | REDESIGN → replaced | `Composer` | C-D 4.2 → C-B 5.0 (compat) |
| `GlassMessageList` | REDESIGN → replaced | `Thread` | same |
| `GlassTypingIndicator` | POLISH → absorbed | running atom; compat → `AgentSteps` | same |
| `GlassVoiceInput` | REMOVE | `ai-voice-input` registry item | C-D 4.2 → C-B 5.0, no compat |
| `GlassGANGenerator`, `GlassDeepDreamGlass`, `GlassStyleTransfer`, `GlassGenerativeArt`, `AIGlassThemeProvider`, `NeuromorphicLearningNetwork` | REMOVE (simulated or no-successor; SERVER-SERVICES-AI-06) | none (§13.3) | C-D 4.2 → C-B 5.0, no compat |
| `GlassLiveFilter` | REMOVE | optional `ImageFilterPreview` recipe (inventory target) | same |
| `NeuralWeightVisualization` | REPLACE (not fake: 0 random hits) | generic heatmap/matrix in `./data` (PRD-11 decides) | same |
| `GlassMusicVisualizer` | CONSOLIDATE (not fake) | `./media` audio spectrum (PRD-13 media, §16 numbering) | same |
| `GlassIntelligentFormBuilder` | REDESIGN outside `./ai` | form-schema recipe; the "AI" label is dropped | same |
| `ProductionAIIntegration`, `examples/AIDemo.*` | REMOVE (not importable today, SERVER-SERVICES-AI-11 PARTIAL) | none; any real integration lives in an app and routes through Kiro Prism | deletion only (not public API) |
| `GlassPredictiveEngine`, `GlassAutoComposer` / `useAutoComposer` | REMOVE | none | C-D 4.2 → C-B 5.0 |
| `./services/ai/*`, `./services/websocket/*`, `src/lib/ai-client.ts`, `openai`/`@google-cloud/vision` peers and deps | Extracted (D-30, §13.2) after the security advisory | private `auraglass-server-archive` | C-D 4.2 → C-B 5.0 |
| `adaptiveAI`, `aiPersonalization` (`src/utils/adaptiveAI.ts`, `src/utils/aiPersonalization.ts`) | Removed (§13.1 opt-in first, then §13.3) | none | 4.1.1 exception, then C-B |
| `src/registry/recipes.ts` "AI product console" | Deleted (whole file removed by NAV-136, SC-38) | `ai-eval-dashboard` item | registry (no semver) |

## 10. API changes

Classes (architecture §2): **C-I** safe internal, **C-E** additive, **C-D** deprecation, **C-B** breaking (5.0 only, and only after a prior 4.x C-D).

| # | Change | Release | Class |
|---|---|---|---|
| API-01 | New subpath `aura-glass/ai` + `aura-glass/ai.css` with the 15 value exports and `Ag*` types (REQ-AI-02) | 5.0.0-alpha.N | C-E |
| API-02 | Optional: `aura-glass/ai` published as **experimental** in 4.3 containing only `types.ts`, `toolDisplayState`, `getMessageText` (no components), so 4.x apps can adopt the data model early. Not in the architecture's 4.3 scope (§14): ships only if PRD-17 (interim owner REL, SC-37) accepts it; otherwise dropped with no effect on 5.0 | 4.3.0 | C-E |
| API-03 | Entries in the repo-root `deprecations.json` (`version: 1`, REL schema, SC-02) + dev warnings via `warnDeprecated` for `GlassChat`, `GlassPredictiveChat` and presets, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator`, `GlassVoiceInput` and the §9 simulated-AI exports | 4.2.0 | C-D |
| API-04 | Root exports of the chat family removed; available from `aura-glass/compat` with adapters (REQ-AI-47) until 6.0 | 5.0.0 | C-B (after API-03) |
| API-05 | Root exports of simulated-AI components removed with no compat | 5.0.0 | C-B (after API-03) |
| API-06 | `./services/ai/*`, `./services/websocket/*` subpaths and `openai`/`@google-cloud/vision` peers removed | 4.2 C-D → 5.0 C-B | C-D → C-B |
| API-07 | Message data model changes from 4.x `ChatMessage` (`content: string`, `sender`) to `AgMessage` (`role`, `parts[]`) | 5.0.0 (compat adapter bridges) | C-B |
| API-08 | `onVoiceRecording` (mock Blob) has no successor prop; `Composer.Action` slot + registry item | 5.0.0 | C-B (after API-03) |
| API-09 | `ChatMessage.reactions`, `replyTo`, `edited` have no `./ai` equivalent (human-chat features); consumers render them via `renderers['data-reactions']` or keep 4.x LTS | 5.0.0 | C-B (after API-03) |
| API-10 | 5.x additions without breaking: new renderer keys, new `labels` keys, new optional props, promotion of a registry item to an export | 5.x minors | C-E |
| API-11 | `data-ag-part`/`data-state` values in §4.6 are public contract; adding a value is C-E, renaming/removing is C-B (6.0) | 5.x | C-E / C-B |
| API-12 | Internal: Thread uses PRD-11's `VirtualList` (not exported from `./ai`) | 5.0 | C-I |

Public prop signatures (abridged; full types in `etc/api/ai.api.md`):

```ts
<Thread.Root messages={AgMessage[]} label?="Conversation" pinThreshold?={64} virtualizeAfter?={100}
  onReachTop?={() => void} ref?={Ref<ThreadHandle>} labels?={ThreadLabels}>
<Message.Root message={AgMessage} author?={ReactNode} labels?={MessageLabels}>
<MessageParts message={AgMessage} renderers?={AgRenderers} renderText?={(t, ctx) => ReactNode}
  citations?="off" | "markers" showSteps?={false}>
<StreamingText text={string} streaming={boolean} announce?="complete" | "sentences" | "off">
<Composer.Root value? defaultValue? onValueChange? status={AgChatStatus} onSubmit onStop?
  accept? maxFiles?={10} maxFileSize?={20971520} maxLength? maxRows?={8} submitOnEnter?={true}
  onAttachmentReject? disabled?>
<ToolCall part={AgToolPart} title? renderInput? renderOutput? onApprovalResponse? defaultOpen? maxPreviewChars?={4000}>
<Reasoning text state durationMs? defaultOpen?>
<AgentSteps steps={AgStep[]} labels?>
<SourceList messageId sources defaultOpen?>   <Citation messageId source index>
<UsageMeter usage={AgUsage} format?="compact">
<ProviderErrorState kind title? detail? retryAfterMs? onRetry? variant?="panel">
```

## 11. Migration concerns

1. **The data model change is manual.** 4.x `ChatMessage` is a human-chat record (`sender`, `reactions`, `replyTo`). AI apps already hold AI SDK `UIMessage[]`; for them migration is "delete the mapping code and pass `messages`". Human-chat apps (if any) either keep the compat adapter through 5.x or stay on 4.x LTS (12 months, D-17). The migration guide (PRD-20, generated from `deprecations.json`) shows both paths with a before/after for `GlassChat` → `Thread`+`Message`+`Composer`.
2. **Consumer grep before deletion.** Architecture §17 lists "Downstream consumers of `services/*` and root AI exports in AuraOne: unknown". PRD-16 must grep AuraOne consumers for `GlassChat`, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator`, `aura-glass/services/` and each §9 simulated-AI name before the 5.0 removals, and record the result in the PRD-16 PR. Any AuraOne consumer that today calls a model through `aura-glass/services/ai/*` migrates to an app-side route through **Kiro Prism**, not to a new library API.
3. **Selector changes.** 4.x `glass-*` classes on chat DOM disappear; `data-ag-part`/`data-state` (§4.6) are the only supported hooks. The per-component selector-change table (§11.3) maps e.g. the `GlassMessageList` root (`role="log"`, `GlassMessageList.tsx:238`) → `[data-ag-part="viewport"][role="log"]`.
4. **Test IDs and IDs.** Hard-coded `id="chat-message-input"` is gone; tests that queried it must use `getByRole('textbox', { name })`.
5. **Behavioural changes users will notice:** Enter no longer submits during IME composition; the thread no longer scrolls to bottom while the reader is scrolled up; message actions are always keyboard-reachable; voice recording disappears unless the registry item is installed (it previously sent a fake Blob, so any consumer depending on it was receiving garbage).
6. **4.1.1 trust note.** `GlassChatInput`'s mock Blob is a fake payload delivered to consumer callbacks. Architecture §13.1 does not list it as a 4.1.1 cut, so this PRD does not change it in 4.1.1; it requests that PRD-00 add a JSDoc/README retraction ("`onVoiceRecording` receives placeholder data in 4.x") as a claim retraction, which is within PRD-00's "claim retractions" boundary.
7. **Visual change.** Every AI surface changes pixels (new material). Under D-27 visible pixel change is breaking, which is satisfied because the whole family is a 5.0 C-B with prior C-D; 4.3's `data-ag-preview="v5"` does not cover chat (D-19 scopes it to the six glass primitives).
8. **AI SDK version drift.** The SDK's `UIMessage` evolves. Compatibility is structural and tested against a pinned devDependency; a new SDK major is evaluated in a C-E PR that widens the unions. The library never hard-depends on `ai`, so consumers on an older SDK are not forced to upgrade.

## 12. Tests required

Unit tests run in Jest + jsdom (`jest.config.js`, existing). Playwright specs, visual, OCR, perf and engine lanes run **remotely only** (QA certification harness `certification/playwright.cert.config.ts`, QA-018, on ephemeral workers; never local browsers or local Docker). Lanes are cited by QA id (SC-29): L5 Behaviour, L6 Environment visual, L7 Pixel regression, L9 Motion, L10 Performance, L11 Consumer canaries, L13 Manual SR, L14 Human visual review. Test file layout follows SC-30. All are NEW files; `jest.config.js` and the Playwright configs are QA's and gain AI projects by MODIFY only.

| Test file | Asserts |
|---|---|
| `tests/exports/ai-subpath.spec.mjs` | `import('aura-glass/ai')` from the packed tarball resolves; export names equal the REQ-AI-02 list exactly; `aura-glass/ai.css` resolves; types resolve to the same graph (attw) |
| `tests/types/ai-sdk-compat.test-d.ts` | `UIMessage[]` (pinned `ai`) assignable to `AgMessage[]`; each SDK tool state assignable to `AgToolSdkState`; `useChat().status` assignable to `AgChatStatus` |
| `scripts/ci/verify-ai-purity.mjs` (run as CI step) | REQ-AI-04 banned identifiers/specifiers; no `dangerouslySetInnerHTML`; no `scrollIntoView`; no `Math.random`; no `document.head` access at module scope; exits non-zero with file:line |
| `src/ai/__tests__/side-effects.test.ts` | Importing `aura-glass/ai` adds 0 listeners, 0 timers, 0 `<style>`/`<script>` nodes |
| `src/ai/thread/__tests__/Thread.test.tsx` | log semantics and label; jump-to-latest visibility, count text, focus move; user send re-pins; imperative handle; 0 `scrollIntoView` calls during streaming; empty state renders `Thread.Empty` |
| `src/ai/message/__tests__/Message.test.tsx` | `data-role`/`data-state`; hidden heading text and `aria-labelledby`; actions in tab order and labelled; copy calls `navigator.clipboard.writeText` with `getMessageText`; feedback `aria-pressed`; error and aborted rendering |
| `src/ai/message/__tests__/MessageParts.test.tsx` | Every part in `ui-messages.ai-sdk.json` renders the expected default renderer (snapshot of `data-ag-part` tree, not class names); override precedence exact > prefix > default; unknown type → `null` + one warning; HTML in text renders literally; image `alt`/`width`/`height`/`loading` |
| `src/ai/message/__tests__/StreamingText.test.tsx` | 1,000 updates inside one frame → 1 commit (React Profiler); caret only while streaming; `aria-busy` lifecycle; announcer call counts for `complete`/`sentences`/`off` and 600-char truncation |
| `src/ai/composer/__tests__/Composer.test.tsx` | controlled/uncontrolled value; IME composition does not submit; Shift+Enter newline; Cmd/Ctrl+Enter; empty submit blocked with `aria-disabled`; stop swap and single submit; attachments accept/size/count rejections with reasons; remove-chip labels; two instances have unique ids; counter announcements at 90%/100% |
| `src/ai/tool/__tests__/ToolCall.test.tsx` | all 7 SDK states → 6 display states, icon + text present; default open rules; `aria-expanded`/`aria-controls`; JSON preview cap and "Show all"; approval calls `onApprovalResponse` once and disables buttons; warning without handler |
| `src/ai/reasoning/__tests__/Reasoning.test.tsx` | auto-open on streaming, auto-close once on done, user toggle respected; label formats (<10 s one decimal, ≥10 s integer); `durationMs` precedence |
| `src/ai/agent/__tests__/AgentSteps.test.tsx` | `<ol>` nesting; `aria-current="step"` on running; durations; renders via `renderToString` with no client hooks |
| `src/ai/sources/__tests__/SourceList.test.tsx` | count label; default open rule; item ids; `rel`/`target` and hidden "(opens in new tab)"; `javascript:` and `data:` URLs render as text |
| `src/ai/sources/__tests__/Citation.test.tsx` | accessible name "Source n: title"; preview opens on focus and on hover after 300 ms (fake timers), closes on Escape; activation opens SourceList and moves focus; no `role="tooltip"` |
| `src/ai/usage/__tests__/UsageMeter.test.tsx` | `role="meter"` values; 80%/95% states; currency formatting; server render |
| `src/ai/error/__tests__/ProviderErrorState.test.tsx` | per-kind default copy; `role="alert"` in panel; retry countdown with `retryAfterMs`; `onRetry` called |
| `src/ai/__tests__/a11y.axe.test.tsx` | jest-axe on every story fixture state: 0 violations |
| `src/compat/__tests__/ai-compat.test.tsx` | 4.x `ChatMessage` → `AgMessage` mapping table; one dev warning naming dropped props |
| `tests/ai/thread-scroll.spec.ts` (Playwright, Chromium/WebKit/Gecko) | REQ-AI-09/-10/-13 numeric scroll assertions using the replay fixture |
| `tests/ai/thread-virtual.spec.ts` | 2,000 messages: DOM article count bound; no >2px jump of first visible message while the last streams; `scrollToMessage` off-screen |
| `tests/ai/composer-ime.spec.ts` | WebKit + Chromium: composition Enter does not submit; post-composition Enter submits |
| `tests/ai/composer-dropzone.spec.ts`, `tests/ai/composer-grow.spec.ts` | drag-drop sets `data-dragging` and adds chips; growth 1→8 rows then scrolls; pinned thread stays pinned |
| `tests/ai/citation-preview.spec.ts` | hover/focus open, Escape close, touch tap navigates to source (WebKit iOS emulation) |
| `tests/a11y/apg/{thread,message,composer,tool-call,citation}.apg.spec.ts` | APG keyboard scripts from the `*.meta.ts` files run through A11Y's `runApgScript` harness (A11Y-073) in 3 engines (QA L5 imports them, QA-082); REQ-AI-57 order and Escape behaviour |
| `tests/visual/ai/ai-workspace.visual.spec.ts` | AI Workspace showcase (`showcase/ai-command-center/`) across the §15.1 matrix (8 SC-28 scenes); pixel gates and OCR contrast (on-surface ≥4.5:1, muted large ≥3:1, `contrast: more` ≥7:1) on rendered text of every message role, tool state label, composer placeholder and citation chip |
| `tests/perf/browser/ai-streaming.spec.ts` | §16 runtime budgets on PERF's harness `tests/perf/harness/run-perf.mjs` (PERF-039) with rows in `tests/perf/harness/budgets.json` (PERF-owned, SC-15); mid-tier mobile emulation + 120 Hz desktop |
| `tests/registry/ai-items.test.ts` | every `registry/items/ai-*` item and `registry/blocks/ai-workspace` validates against the shadcn v4 schema; `ai-workspace` route has no literal key or `NEXT_PUBLIC_` key; eval dashboard sample has no hard-coded metrics outside fixtures |
| `registry/items/ai-sdk-adapter/__tests__/useAuraChat.test.tsx` | prop wiring to `useChat` with a mocked transport (no network) |
| `registry/blocks/ai-workspace/__tests__/route.test.ts` | Prism base URL, server-only key, 503 `{ kind: 'auth' }` when unset, 32 KB cap, rate limit (mocked Prism, no network) |
| `canaries/next16/app/ai-rsc/page.tsx` (PKG canary app, QA L11) | `next build` + `next start` succeed with server-safe AI parts in a Server Component; hydration has 0 warnings on the client page |

## 13. Storybook requirements

- Stories live beside components (`src/ai/**/<Name>.stories.tsx`) under the sidebar group **"AI/"**: `AI/Thread`, `AI/Message`, `AI/Composer`, `AI/ToolCall`, `AI/Reasoning`, `AI/AgentSteps`, `AI/Sources`, `AI/UsageMeter`, `AI/ProviderErrorState`, and the AI Workspace scene, which is the showcase `showcase/ai-command-center/` (story title `Showcases/AI Command Center`; files and import/determinism contract owned by SB, SB-109; composition supplied by this PRD, SC-31).
- Every story uses SB's `environment` toolbar global (`.storybook/preview.tsx`, SB-048; the 8 SC-28 scene ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`) as its background; no decorative or text-only gallery stories (§15.4). Primitives are shot large and first.
- Data comes only from `src/ai/__fixtures__/` and the deterministic `replay.ts` driven by a Storybook clock decorator registered through SB's preview contract after SB-048 (`play`-controllable: `pause`, `step(n tokens)`, `finish`). No network, no `Math.random`, no wall-clock timers.
- Required states (each a named story; the matrix is generated from `*.meta.ts`): Thread `Empty`, `Short`, `Long2000Virtualized`, `StreamingPinned`, `StreamingUnpinnedJump`, `LoadingEarlier`; Message `User`, `Assistant`, `System`, `Tool`, `WithAttachments`, `WithImage`, `Streaming`, `Error`, `Aborted`, `ActionsFocused`; Composer `Ready`, `WithDraft`, `WithAttachments`, `Dragging`, `Submitted`, `Streaming(Stop)`, `Error`, `NearLimit`, `Disabled`; ToolCall one per display state plus `ApprovalWithReason` and `LargeOutput`; Reasoning `Streaming`, `DoneCollapsed`, `DoneExpanded`; AgentSteps `Linear`, `NestedOrchestration`, `Failed`; Sources `Three`, `Twelve`, `CitationFocused`; UsageMeter `Normal`, `Warning`, `Critical`; ProviderErrorState one per `kind`, `RetryCountdown`.
- The AI Workspace composition (`showcase/ai-command-center/AiCommandCenter.showcase.tsx`, data in `showcase/ai-command-center/data.ts` replayed from `src/ai/__fixtures__/`) composes `AppShell` (PRD-10) + `Thread` + `Composer` + an inspector with `AgentSteps`, `UsageMeter` and the `ai-artifact-panel` item, with product-realistic copy (a support-engineering agent answering with citations and an approval-gated tool call). No meta copy ("This component demonstrates…").
- Docs pages per component (DX `apps/docs/`, §16 PRD-20) render the `data-ag-part`/`data-state` table, the APG keyboard table, the tier badge (`@tier certified` / `verified`), the per-import budget line, and a "Using with the Vercel AI SDK" snippet (`useChat` → `<Thread messages>`), plus a "Routing models through Kiro Prism" note linking the `ai-workspace` block.
- Interaction tests (`play`) exist for: submit via Enter, IME composition, Stop, approve/deny, jump-to-latest, citation focus preview. They run in SB's remote Storybook test workflow (`.github/workflows/storybook-tests.yml`, SB-124).
- Motion follows the OS setting in Storybook; forced reduction applies only in the CI snapshot run (§15.4).

## 14. Responsive requirements

Layout uses container queries on `Thread.Root` and `Composer.Root` (`container-type: inline-size`), not viewport media queries, so the components work in a sidebar, an inspector or full-page.

- **REQ-AI-49** Message max inline size is `min(var(--ag-ai-message-max-inline), 100%)` (token default 72ch). Below a 480px container: avatars hide (`Message.Avatar` renders `null` visually, the hidden heading keeps the author), user bubbles use full width minus 24px start inset, `Message.Actions` move below the content as a row. Test: `ai-workspace.visual.spec.ts` at 390 and 1440.
- **REQ-AI-50** Composer at <480px container: actions collapse into one leading `Composer.Action` menu (attach + slot actions) and the trailing Submit/Stop button; attachment chips scroll horizontally with `scroll-snap-type: x mandatory`; textarea `maxRows` drops to 5. Test: `composer-grow.spec.ts` at 390.
- **REQ-AI-51** Mobile keyboard: in the AI Workspace scene the composer stays above the on-screen keyboard using `interactive-widget=resizes-content` guidance in docs and `env(keyboard-inset-height, 0px)` padding where supported, falling back to `visualViewport` resize handling in `Composer.Root` (one listener, removed on unmount). The thread stays pinned when the keyboard opens. Test: WebKit iOS emulation in `composer-grow.spec.ts` (keyboard simulated via `visualViewport` resize); real-device check in the manual matrix.
- **REQ-AI-52** `Thread.JumpToLatest` sits centred above the composer with `bottom: calc(var(--ag-ai-composer-block, 0px) + 12px)` and respects `env(safe-area-inset-bottom)`. Test: visual spec at 390.
- **REQ-AI-53** Citation preview is `PreviewCard` positioned with collision padding 8px; on containers <480px or `(pointer: coarse)` activation navigates to the source item instead of relying on hover. ToolCall JSON `<pre>` scrolls horizontally inside its panel (`overflow-x: auto`, `tabIndex={0}`, labelled region) and never widens the thread. Test: `citation-preview.spec.ts`, visual spec.
- **REQ-AI-54** No horizontal page scroll at 320px CSS width with any fixture (long URLs and code are wrapped with `overflow-wrap: anywhere`). Test: visual spec at 320 (added viewport for AI only).
- **REQ-AI-55** Text zoom to 200% and `font-size: 32px` root keep all controls operable without overlap (WCAG 1.4.4, 1.4.10 reflow). Test: visual spec variant `zoom200`.

## 15. Accessibility requirements

Floors from architecture §6–§7; failures block certification.

- **REQ-AI-56** Semantics: Thread `role="log"` with a name; messages are `<article>` with a name; Composer is a `<form>` with a labelled textarea (visible or `aria-label`, never placeholder-only, fixing E-06); ToolCall/Reasoning/SourceList triggers are buttons with `aria-expanded`; AgentSteps is an ordered list with `aria-current="step"`; UsageMeter is `role="meter"`; ProviderErrorState panel is `role="alert"`.
- **REQ-AI-57** Keyboard (APG scripts declared in `src/ai/**/*.meta.ts` and run by `tests/a11y/apg/{thread,message,composer,tool-call,citation}.apg.spec.ts` on A11Y's harness, imported by QA L5; SC-30): Tab reaches the viewport (scrollable region, `tabIndex=0`), each message's actions, every tool/reasoning/source trigger, approval buttons, citations, Jump-to-latest, attachment remove buttons, and Submit/Stop in DOM order; arrow keys are not hijacked inside the textarea; Escape in the textarea with `status==='streaming'` calls `onStop` when `stopOnEscape` (default `true`); Escape closes an open citation preview and returns focus to the citation.
- **REQ-AI-58** Live regions: exactly the provider announcer plus `role="log"`; no component in `src/ai/` creates its own `aria-live` region except `Composer.Counter` (polite, threshold-only). Assertive only for approval-needed and errors (§4.5). Verified per screen reader in the manual matrix: VoiceOver/Safari macOS and iOS, NVDA/Chrome, TalkBack/Chrome, including "a streamed answer is announced once" and "approval request is announced".
- **REQ-AI-59** Contrast (OCR on rendered pixels, §15.2): every text run in every AI story ≥4.5:1 (large/muted ≥3:1), every icon and state indicator ≥3:1 non-text contrast, `contrast: more` ≥7:1, across all 8 environments in light and dark. The E-18 failure mode (dark ink on dark backdrop) is the regression this gate exists for.
- **REQ-AI-60** Color is never the only signal: tool states, step states, meter warning/critical and feedback pressed state each carry text or an icon with an accessible name. Forced colors: all surfaces render solid (D-11), state icons use `CanvasText`/`Highlight`, focus ring `outline: 2px solid Highlight`.
- **REQ-AI-61** Targets: every interactive element ≥24×24 CSS px, with a 44px hit area under `(pointer: coarse)` (PRD-05 pseudo-element). Citation chips meet this via their hit area even though the glyph is inline.
- **REQ-AI-62** Focus: focus ring per PRD-05 (2px two-tone `outline`, WCAG 2.4.13); the composer and jump pill write `--ag-scroll-padding-block-end` so focused messages are not obscured (2.4.11). After submit, focus stays in the textarea; after approve/deny, focus moves to the ToolCall trigger.
- **REQ-AI-63** Reduced motion and transparency: under `motion: 'none'` no caret blink, no running-dots animation (static "Running" text), no entrance transform, instant scroll; after settle, 0 rAF/WAAPI activity (QA L9 Motion). Reduced transparency → `tinted`/`solid` per the D-11 ladder on Composer and the pill.
- **REQ-AI-64** Content safety for assistive tech: model text is never injected as HTML by the library; links from model output are only rendered by the consumer's `renderText` or as sanitized `SourceList` items (http/https only).
- **REQ-AI-65** Internationalisation: all strings come from `labels` props with English defaults; RTL (`dir="rtl"`) mirrors bubble alignment and chip order via logical properties only (`margin-inline-start`, `inset-inline-end`). Test: `Message.test.tsx` "rtl" + visual spec `rtl` variant on Chromium.

## 16. Performance requirements

Budgets are provisional until QA lane L10 calibrates them at 5.0.0-alpha.1 (D-26), then ratchet down only. Byte budgets are rows this PRD submits to `docs/size-budgets.json` (file, schema and gate `scripts/ci/verify-size-budgets.mjs` owned by PKG, PKG-048/049; PERF default ceilings such as 8 KB gz per subpath CSS apply, rows may only be stricter; SC-15). There is no `size-limit` config. Runtime budgets (fps, long tasks, frame time) are rows in PERF's `tests/perf/harness/budgets.json`.

| Metric | Budget | Measured by |
|---|---|---|
| `{ Thread, Message, Composer }` from `aura-glass/ai`, min+gz, peers external, markdown excluded | ≤25 KB (architecture §3.6) | `docs/size-budgets.json` row via `verify-size-budgets.mjs` |
| `{ ToolCall, Reasoning, AgentSteps }` | ≤8 KB incremental over the line above | `docs/size-budgets.json` row (new, this PRD) |
| `{ SourceList, Citation }` | ≤6 KB incremental (Base UI PreviewCard included) | `docs/size-budgets.json` row |
| `aura-glass/ai.css` gz | ≤6 KB (within PERF's 8 KB subpath-CSS ceiling) | `docs/size-budgets.json` row |
| Streaming render cost: assistant message receiving 60 updates/s for 30 s in a 200-message thread | main-thread long tasks (>50 ms) = 0; p95 frame time ≤16.7 ms desktop 120 Hz lane, ≤33 ms mid-tier mobile | `ai-streaming.spec.ts` |
| 2,000-message virtualized thread, scroll fling | ≥55 fps desktop, ≥30 fps mobile; mounted message articles ≤ visible + 12 | `ai-streaming.spec.ts`, `thread-virtual.spec.ts` |
| Initial mount, 100 messages (no virtualization) | ≤120 ms scripting on mid-tier mobile emulation | `ai-streaming.spec.ts` |
| Composer keystroke to paint (INP proxy) in a 2,000-message thread | p95 ≤50 ms desktop, ≤100 ms mobile | `ai-streaming.spec.ts` |
| Layout shift while streaming (CLS of earlier messages) | 0.00 for messages above the streaming one | `ai-streaming.spec.ts` (LayoutShift entries filtered by node) |
| Visible backdrop surfaces in the AI Workspace scene | ≤6 fine pointer, ≤3 coarse pointer (§4.7 standard tier) | MAT dev counter + QA certification cost gate |
| React commits per animation frame from `StreamingText` | ≤1 | `StreamingText.test.tsx` |
| Perf grade (A–F, §15.2) | ≥C for each T1 AI flagship; ≥B target for `Thread` | QA L10 Performance |
| Timers/listeners after unmount | 0 | `Thread.test.tsx`/`Composer.test.tsx` leak checks |

## 17. Acceptance criteria

All evidence is a CI artifact keyed to the release SHA (D-32), never committed.

- **AC-AI-01** `aura-glass/ai` from the packed tarball exports exactly the 15 REQ-AI-02 names; publint and attw pass for the subpath.
- **AC-AI-02** `verify-ai-purity.mjs` reports 0 violations on `src/ai/`; `npm ls` of a fresh consumer install of `aura-glass` contains no `openai`, `@google-cloud/vision`, `ai` or `@ai-sdk/*` package.
- **AC-AI-03** `ai-sdk-compat.test-d.ts` passes against the pinned `ai` version, and the PR records that version.
- **AC-AI-04** Every fixture in `ui-messages.ai-sdk.json` (≥1 per part type and per tool state, ≥20 fixtures) renders with 0 dev warnings except the deliberate unknown-type fixture (exactly 1 warning).
- **AC-AI-05** Thread scroll: pinned drift ≤1px over 300 streamed frames; unpinned drift ≤1px; prepend offset ≤1px; on Chromium, WebKit and Gecko.
- **AC-AI-06** 2,000-message thread: mounted articles ≤ visible+12; ≥55 fps desktop and ≥30 fps mobile fling; 0 long tasks during the 30 s stream test.
- **AC-AI-07** IME: 0 submits during composition on WebKit and Chromium; 1 submit on the following Enter.
- **AC-AI-08** All 7 tool SDK states render the correct display state with icon + text; approve/deny calls the handler exactly once.
- **AC-AI-09** jest-axe: 0 violations across all AI story states; APG keyboard scripts pass for all 5 flagships.
- **AC-AI-10** OCR contrast on the AI Workspace scene: 0 text runs below 4.5:1 (muted large below 3:1) and 0 below 7:1 under `contrast: more`, over all 8 environments × light/dark × 3 engines × 2 viewports (compare E-18: 266/342 failures on black today).
- **AC-AI-11** Forced colors: 0 elements with a non-`none` computed `backdrop-filter` inside AI components; focus ring visible on every focusable element.
- **AC-AI-12** Reduced motion: 0 running CSS animations and 0 rAF callbacks 500 ms after settle in every AI story.
- **AC-AI-13** Budgets: every §16 row at or under budget in `scripts/ci/verify-size-budgets.mjs` (bytes) and `run-perf.mjs` (runtime); perf grade ≥C for each of the 5 flagships.
- **AC-AI-14** Manual matrix signed off for the 5 flagships: VoiceOver macOS + iOS, NVDA/Chrome, TalkBack/Chrome, physical touch; "streamed answer announced once" passes on every reader, or the §4.5 fallback is shipped and re-verified.
- **AC-AI-15** RSC canary: Next 16 `next build` + `next start` with server-safe AI parts in a Server Component succeeds, 0 hydration warnings on the client page; Next 15 + React 19.0 floor canary imports every `./ai` export.
- **AC-AI-16** Registry: the 7 `registry/items/ai-*` items and the `registry/blocks/ai-workspace` block validate (`scripts/registry/lint.mjs`) and render in DX's registry render harness (`tests/dx/registry-render.spec.ts`); `ai-workspace` route test passes with a mocked Prism and contains no literal or public key.
- **AC-AI-17** Compat: `ai-compat.test.tsx` passes; the frozen 4.x consumer fixture (`tests/fixtures/consumer-4x/`, REL-115, SC-08) using `GlassChat` renders through `aura-glass/compat` with exactly one deprecation warning per name.
- **AC-AI-18** On 5.0 `main`, `rg -n "GlassGANGenerator|GlassDeepDreamGlass|GlassStyleTransfer|AIGlassThemeProvider|ProductionAIIntegration|GlassPredictiveEngine|mock audio data" src` returns 0 hits (PRD-16 deletions landed), and `src/components/ai/` does not exist.
- **AC-AI-19** Human visual review of the AI Workspace scene (specular quality, hierarchy, radius rhythm, "reads as one hand") recorded as approved in the release review (§15.2 manual lane, QA L14 Human visual review).

## 18. Definition of done

1. REQ-AI-01 … REQ-AI-65 implemented; each linked test exists and is green on `main` (unit) and in the remote lanes (Playwright, visual, OCR, perf, engine).
2. AC-AI-01 … AC-AI-19 met on the release-candidate SHA, with artifacts linked from the release.
3. §11.3 per-flagship deliverables complete for `Thread`, `Message`, `Composer`, `ToolCall`, `SourceList`/`Citation`: typed metadata, part/state table, selector-change table, registry usage, APG script, budget line, perf grade, environment baselines, codemod fixtures.
4. `etc/api/ai.api.md` and `etc/api/ai.exports.json` reviewed and committed; root `deprecations.json` entries present for every §9 name (landed in 4.2) and valid against `docs/schemas/deprecations.schema.json` (`scripts/release/verify-deprecations.mjs`).
5. Docs pages (PRD-20, DX) published for every `./ai` export, including the AI SDK snippet and the Kiro Prism routing note; `llms.txt` lists `./ai`.
6. No open "unverified" item from §4.2 (AI SDK version) or §4.5 (screen-reader duplicate announcement) without a recorded resolution.
7. T1 API frozen at 5.0.0-rc.1; later changes are C-E only.
8. Temporary remote workers used for the lanes are torn down (QA runbook).
9. Every §21 open item is closed or carried with a named owner.

## 19. Dependencies

Architecture §16 ids with their task key (SC-01) and the owner anchor tasks that `tasks/AI.json` cites in `depends_on` (SC-40: only real task ids, never `PRD-xx`).

| §16 PRD (key) | Needed for | Anchor tasks | Hard/soft |
|---|---|---|---|
| PRD-00 (TRUST) | `deprecations.json` instance seed; API-report scripts; claim retraction request for the 4.x mock voice Blob (§11.6) | TRUST-075, TRUST-071/072, TRUST-069 | hard (seed); soft (retraction request) |
| PRD-01 (REL) | deprecations schema and generator, `warnDeprecated`, API-report extension, frozen 4.x fixture, `ai-chat` codemod id in the §11.2 catalogue | REL-010, REL-070, REL-072, REL-003, REL-115 | hard |
| PRD-02 (PKG) | exports manifest rows, lint/eslint wiring, `glass-pipeline.yml`, side-effect gate, size budgets, dependency allowlist, directive lint, Next 16 canary app | PKG-005, PKG-015, PKG-038, PKG-042, PKG-048/049, PKG-056, PKG-082, PKG-121 | hard |
| PRD-03 (DS) | `--ag-ai-*` component tokens through the token compiler, contrast-solved state colours, motion duration tokens | DS-016, DS-026, DS-053 | hard |
| PRD-04 (MAT) | `Surface`, content materials, chrome thick/thin, surface budget counter | MAT-015, MAT-047 | hard |
| PRD-05 (A11Y) | announcer, `usePreference`, provider (portal root), `LayerStack` (only Escape dispatcher, SC-25), APG harness, SR record schema | A11Y-054, A11Y-027, A11Y-029, A11Y-049, A11Y-073, A11Y-084 | hard |
| PRD-06 (MOT) | caret/entrance timing on the shared ticker contract, QA L9 Motion criteria | MOT-040 | soft (static fallback acceptable until ready) |
| PRD-07/14/16 (FND) | Base UI pin and wrapping pattern (`Field`, `Collapsible`, `PreviewCard`), parts registry, `usePortalContainer()`; core `Meter`, `Alert`, `Badge`, `Kbd`; removal of §9 items and the server archive | FND-001, FND-005, FND-007, FND-074, FND-058, FND-051, FND-053, FND-118, FND-119 | hard |
| PRD-08 (CTL) | `Button`, `IconButton`, `TextField`, `Combobox` (model picker item) | CTL-055, CTL-061, CTL-047, CTL-109 | hard for Composer actions; soft for registry |
| PRD-09 (OVL) | `Menu` (collapsed composer actions), `Toast` (copy confirmation optional) | OVL-081 | soft |
| PRD-10 (NAV) | `AppShell`, `ResizablePanels`, `Inspector` for the AI Workspace showcase and artifact item; deletion of `src/registry/recipes.ts` | NAV-016, NAV-136 | hard for scene certification |
| PRD-11 (DATA) | internal `VirtualList`, `TreeView` (trace item), `Table`/`StatCard` (eval item) | DATA-033, DATA-085, DATA-059 | hard (virtualization) |
| PRD-17 (interim REL, SC-37) | 4.2 deprecation train, optional 4.3 experimental types (API-02) | REL-082, REL-090, REL-125 | hard for API-03 |
| PRD-18/20 (DX) | codemod engine and catalogue, compat index, `registry.json`, registry build/lint/render, `ai-workspace` block scaffold, docs pages, migration guide, `llms.txt` | DX-041, DX-042, DX-065, DX-067, DX-070, DX-072, DX-091, DX-094, DX-113 | hard for AC-AI-16/-17 and DoD 5 |
| PRD-19 (QA) | jest and certification Playwright configs, scenes, OCR, behaviour/environment/canary lanes, manual matrix | QA-003, QA-018, QA-038/039, QA-049, QA-056, QA-082, QA-086 | hard |
| PRD-19 (SB) | `.storybook/preview.tsx` contract, `showcase/ai-command-center/`, Storybook test workflow | SB-048, SB-109, SB-124 | hard |
| perf policy (PERF) | perf harness and runtime budget file | PERF-039 | hard |

## 20. Execution order

1. **Wave 1 (parallel with PRD-02/16/19):** land `src/ai/types.ts`, `tool-state.ts`, `text.ts`, the generated AI SDK fixture, `ai-sdk-compat.test-d.ts` and `verify-ai-purity.mjs` (pure TS; no material needed). Add the §9 entries to the root `deprecations.json` by MODIFY after TRUST-075/REL-010 so they ship in 4.2 (REL train, SC-37).
2. **4.2 (PRD-17, interim owner REL):** deprecation warnings for the chat family and simulated AI ship; PRD-16 publishes the server security advisory and `./services/*` plus the `openai`/`@google-cloud/vision` peers are marked C-D.
3. **After the PRD-07 gate (alpha):** build `Message` + `MessageParts` + `StreamingText` first (server-safe core), then `Thread` (needs PRD-11 `VirtualList`), then `Composer` (needs PRD-08 `Button`/`TextField`). Submit the §16 rows to `docs/size-budgets.json` and `tests/perf/harness/budgets.json`; QA L10 calibrates them at alpha.1.
4. **Alpha +1:** `ToolCall` (+ approval), `Reasoning`, `AgentSteps`, then `SourceList`/`Citation`; then T2 `UsageMeter`, `ProviderErrorState`.
5. **Alpha +2:** stories and fixtures for every §13 state; the AI Workspace composition in `showcase/ai-command-center/` (after SB-109) on PRD-10 `AppShell`; first full remote run of visual, OCR, engine, motion and perf lanes; fix to green.
6. **Beta:** registry items/blocks (`ai-sdk-adapter`, `ai-markdown`, `ai-model-picker`, `ai-artifact-panel`, `ai-trace-tree`, `ai-eval-dashboard`, `ai-voice-input`, `ai-workspace` with the Kiro Prism route); `aura-glass/compat` adapters and the `ai-chat` codemod on DX's engine (DX-041/065); PRD-16 grep of AuraOne consumers and deletion PRs for §9 families.
7. **Beta +1:** manual screen-reader and touch matrix; resolve the §4.5 announcement question; docs pages with PRD-20.
8. **RC-1:** freeze the T1 API (`etc/api/ai.api.md`, `etc/api/ai.exports.json`), verify AC-AI-01…19 on the RC SHA, human visual review of the scene.
9. **GA:** release with artifacts linked; promotion of any registry item to an export is deferred to 5.x as C-E.

## 21. Open items

Reconciled against `_shared-contracts.md` (SC-01..SC-40) and the AI section of `_verification-remaining-concerns.md` on 2026-10-06. "Closed" items are kept for traceability.

| # | Item | Status | Owner | How to close |
|---|---|---|---|---|
| 1 | PRD numbering: self-id PRD-13 vs §16 PRD-12 | Closed: header `Key` field `AI`, §19 crosswalk, `depends_on` uses task ids only (SC-01, SC-40) | REL (crosswalk) | none |
| 2 | AI SDK `UIMessage` shape, approval states (`approval-requested`/`approval-responded`/`output-denied`) and the `approval` field are unverified (§4.2) | Open | AI (AI-006, AI-007..009) | Pin `ai` as an exact devDependency, generate `ui-messages.ai-sdk.json` from it, pass `ai-sdk-compat.test-d.ts`, record the version in the PR (AC-AI-03). REQ-AI-03/-32 become final then |
| 3 | `aria-busy` inside `role="log"` duplicate-announcement behaviour per screen reader (§4.5) | Open | AI, with A11Y (record schema A11Y-084; QA L13 Manual SR) | Run the AI-093 matrix (VoiceOver macOS/iOS, NVDA, TalkBack); if any reader double-announces, ship the §4.5 fallback in AI-094 and re-verify before RC-1 (AC-AI-14, DoD 6) |
| 4 | Perf budget "p95 frame time ≤16.7 ms on the 120 Hz desktop lane" accepts 60 fps-level frames on a 120 Hz display | Open | PERF (runtime budgets file), calibrated by QA L10 | At 5.0.0-alpha.1 calibration, PERF either keeps 16.7 ms (consistent with the ≥55 fps floor) or tightens to 8.3 ms in `tests/perf/harness/budgets.json`; the number then only ratchets down (D-26) |
| 5 | Kiro Prism is exercised only through a mocked Prism (`route.test.ts`); no live smoke of the `ai-workspace` block | Open (decision) | AI; decision by the product owner (Gurbaksh) | Default stays mocked-only. A live smoke would be an optional, gated remote job that uses an already-provisioned CI secret through the existing provider store (no new credential handling, no key in repo or logs). Record the decision in `docs/release/decisions/` |
| 6 | REQ-AI-14 `scrollToMessage` vs the global `scrollIntoView` ban | Closed: §4.4 and REQ-AI-14 now specify `VirtualList.scrollToKey` or a direct `scrollTop` assignment | AI | none |
| 7 | `scripts/ci/verify-flagship-deliverables.mjs` (REQ-AI-46) had no CREATE task in any fragment | Closed 2026-10-06: QA-127 creates the script and `certification/flagship-deliverables.json`; AI-092 depends on QA-127 | QA (§16 PRD-19) | none |
| 8 | AC-AI-19 human visual review is subjective by design | Accepted (architecture §15.2 manual lane) | QA L14 Human visual review | Approval recorded in the release review; it remains the only non-numeric AC |
| 9 | §7 omitted `GlassCombobox`'s CONSOLIDATE disposition | Closed: §7 row now reads `4.5 / CONSOLIDATE` | AI | none |
| 10 | DX-recorded deviations in this PRD: `ai-eval-dashboard` typed `registry:block`, TODO marker `TODO(auraglass-5)`, non-canonical codemod and compat paths | Closed: `registry:item` (SC-32), `TODO(aura-glass 5)` and the `4to5` layout (SC-33), `src/compat/ai/*.tsx` (SC-34) | AI | none |
| 11 | Registry layout conflict (`registry/ai/` here vs `registry-src/` in EXP) | Closed for this PRD: `registry/items/ai-*` and `registry/blocks/ai-workspace` (SC-32) | DX (layout) | EXP's own move is tracked in its PRD |
| 12 | Showcase location for the AI Workspace composition (SB open item) | Closed: composition supplied to `showcase/ai-command-center/` (SB-109); `src/stories/AppShell.stories.tsx` deleted by SB/NAV, not re-authored here | SB (files), AI (composition) | none |
| 13 | EXP ledger row X-43 (media transcript) lists owner "PRD-13" | Not this PRD: EXP uses §16 numbering, where PRD-13 is media/backdrops (key MED) | MED, with EXP | MED adds the X-43 requirement before its Wave-4 start (EXP REQ-EXP-21); no AI task |
| 14 | SC-24 Button prop grammar (awaiting human confirmation) | Open (external) | CTL; confirmation by the product owner | `src/ai/**` uses `Button`/`IconButton` only through CTL's final props (no 4.x `variant="primary"`); AI-043/053/065 follow the confirmed grammar |
| 15 | API-02 optional 4.3 experimental `aura-glass/ai` types | Open (decision) | REL (interim PRD-17 owner, SC-37) | REL accepts or rejects in the 4.3 gate record (`docs/release/decisions/4.3.0-gate.md`, REL-125); AI-117 is dropped if rejected |
| 16 | The SC-40 task-graph validator `scripts/release/verify-task-graph.mjs` does not exist yet | Open | REL | Until it lands, `tasks/AI.json` `depends_on` entries were checked by hand against `tasks/*.json` on 2026-10-06 |
