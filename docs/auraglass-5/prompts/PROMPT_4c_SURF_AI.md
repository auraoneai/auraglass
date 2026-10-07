# PROMPT-4c (SURF lane W3): Presentational AI (`./ai`)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.2 (statics), §4.5 (AI data model), §5.6, §5.10 (REQ-SURF-172, -173), §13 (AI stories), §14, §15, §16, §20 row W3. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1. LLM policy: Kiro Prism (`/Users/gurbakshchahal/kiro-prism/{README,API,SETUP,LLM}.md`) is the model layer for the `ai-workspace` route; the library makes no model or network call.
Requirement IDs: REQ-SURF-106..129, -172, -173 (owned); W3 rows of REQ-SURF-01..-03, -05..-14, -170, -188..-190, -192..-196.
Acceptance: AC-SURF-15, -16, -17 (owned); W3 rows of AC-SURF-01, -02 (no `ai`/`@ai-sdk/*` in a fresh install), -03, -11, -12, -13, -23, -24, -25, -26.
Tasks: `tasks/SURF.json` lane `W3`, SURF-276..SURF-395. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_13a..13f_AI_*.md` (AI-001..123 re-keyed).
Flagships: 38 Thread, 39 Message, 40 Composer, 41 ToolCall, 42 SourceList/Citation.

## Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing):

```bash
test -f src/contracts/components.ts && test -f src/contracts/preferences.ts && test -f src/contracts/entries.ts \
 && ls tests/contract-doubles/cmp/{collapsible,menu,popover,combobox}.tsx && test -f tests/helpers/index.ts \
 && node -e "const e=require('fs').readFileSync('src/contracts/entries.ts','utf8');if(!/'\.\/ai'/.test(e))process.exit(1)"
```

Seams consumed: S-01/S-05/S-06 (message `content-raised`, composer `chrome thick`, jump pill `chrome thin`), S-03/S-04, S-12 (caret blink tokens, motion `none`), S-21..S-26 (`useAnnouncer` — the only speech path besides `role="log"` and `Composer.Counter`; `useLayer({ kind: 'preview-card' })`; `usePortalContainer('overlay')`), S-30..S-34 (CMP `Collapsible`, `Menu`, `Meter`, `Alert`, `Button`, `TextField`, `Combobox`, `Icon`; doubles via `tests/ai/jest.doubles.cjs`), S-35 (`./ai` = 11 names), S-37..S-46, S-49 (frozen deps — `ai`/`@ai-sdk/*` are **not** in it), S-53 (CI fragment). Intra-stream: I-1 `VirtualList` (W2) for `Thread` above `virtualizeAfter` — until it merges, Thread renders every message (correct below the threshold) and the 2,000-message spec reports `pending`; I-3: `ai-workspace` composes W1 `AppShell` through `aura-glass/app-shell`.

**AI SDK harness (REQ-SURF-106, day 0, no wait):** open additive contract PR `contract/ai-sdk-devdeps` (exact pins of `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`; PLAT regenerates the lockfile inside it). Until it merges every SDK-importing file lives under `ci/surf/ai-sdk/**` (outside the `tsconfig.json` include set) with its own `tsconfig.json`; job `surf:test:ai-sdk` installs the pins into `.artifacts/surf/ai-sdk/` with `npm install --prefix .artifacts/surf/ai-sdk --no-save` and runs `tsc` + Jest there. After the merge one W3 PR moves them to their final paths (task "AI SDK/final paths").

## May touch (lane W3 exclusive)

`src/ai/**` (incl. `__fixtures__/`, `icons/` internal glyphs, `renderers.tsx`, `ai.css`); `src/compat/surf/ai/**`; `tests/ai/**` (incl. `jest.doubles.cjs`, `compat.test.tsx`, `a11y.axe.test.tsx`, `side-effects.test.ts`, `labels.test.tsx`, `exports/**`); `tests/e2e/surf/ai/**`; `tests/a11y/apg/surf/{thread,message,composer,tool-call,citation}.apg.spec.ts`; `tests/visual/surf/ai/**`; `tests/perf/browser/surf/ai-streaming.spec.ts`; `tests/types/surf/ai-*.test-d.ts`; `tests/a11y/manual/{records,scripts}/surf/ai-*`; `canaries/next16/app/surf/{ai-rsc,ai-client}/**`; `scripts/surf/gen-ai-fixtures.mjs`, `scripts/surf/gen-ai-thread-fixture.mjs`; `ci/surf/ai-sdk/**`; `registry/blocks/ai-workspace/**`; `registry/items/ai-*/**`; `tests/capability/registry/{ai-items,ai-workspace-route,ai-sdk-adapter}.test.ts(x)`; `lint/rules/surf/no-network-in-ai.cjs`, `tests/lint/surf/no-network-in-ai.test.ts`; `fragments/codemods/surf/fixtures/ai-chat/**`; `tests/fixtures/consumer-4x/cases/surf/ai/**` is W5's (do not edit); `etc/api/ai.*`; `apps/docs/content/surf/ai-prism-routing.md` (the one docs file W3 owns).
Shared (own `lane W3` block only): `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,review}/surf.ts`, `ci/surf.gitlab-ci.yml` (jobs `surf:build:ai-fixtures`, `surf:test:ai-sdk`), `lint/rules/surf/_strict.cjs`, `scripts/surf/verify-surf-purity.mjs` (AI rule set), `tests/capability/purity-gate.test.ts` (AI fixtures).

## Must not touch

Other lanes' paths and blocks; `package.json`/lockfile (contract PR only); `src/icons/**` (contract R-06); `.storybook/**` (the replay decorator lives in SURF story files); `showcase/**` (QUAL imports `registry/blocks/ai-workspace/fixtures.ts`); any 4.x AI file or `src/services/ai/**` removal (PLAT).

## Steps

1. **Model** (REQ-SURF-106): `src/ai/types.ts` exactly per PRD §4.5 (structural mirror of AI SDK `UIMessage`, no `ai` import in shipped code); `ToolCall.displayState` mapping incl. `denied`; `Message.getText`; generated fixtures `src/ai/__fixtures__/ui-messages.ai-sdk.json` (≥20, every part type and tool state, one unknown type) from `ui-messages.source.ts` by `scripts/surf/gen-ai-fixtures.mjs --check` — never hand-written; `ci/surf/ai-sdk/ai-sdk-compat.test-d.ts` (`expectAssignable<AgMessage[]>`, `AgChatStatus`). Record the pinned SDK version in the first PR (OI-10).
2. **Message, Parts, StreamingText** (REQ-SURF-111..115): `<article>` with a hidden "{author}, {time}" heading (`Intl.DateTimeFormat(locale, { timeZone, timeStyle: 'short' })`, no context read); `Message.Parts` ordering and override precedence (exact > prefix > default; unknown → `null` + one warning; text escapes HTML; `renderText` hook); StreamingText ≤1 commit per frame via `useSyncExternalStore`, `announce: 'complete' | 'sentences' | 'off'`, caret stopped when motion ≠ `full`; actions always in the tab order; file parts; error/aborted states.
3. **Thread** (REQ-SURF-107..110): the only `role="log"`; pin rule (`≤ pinThreshold`), one `scrollTop` write per frame, `overflow-anchor`, no smooth scroll while streaming, `JumpToLatest`, user send re-pins; virtualization via I-1 above `virtualizeAfter` with `anchor: 'end'`; `onReachTop` with one `IntersectionObserver`; handle with 0 `scrollIntoView`.
4. **Composer** (REQ-SURF-116..119): `<form>` on Base UI Field; IME-safe Enter (`!isComposing && keyCode !== 229 && !shiftKey`), Cmd/Ctrl+Enter, Stop swap, Escape stops, draft kept on error; attachments by picker/paste/drop with reasons (`type | size | count`), never read or uploaded; growth 1→`maxRows` with `field-sizing: content`, keyboard inset handling; counter announces at 90 %/100 % only.
5. **Agentic and sources** (REQ-SURF-120..127): ToolCall (Collapsible, 7 SDK states → 6 display states, approval once, focus to trigger), Reasoning (auto open/close, "Thought for {s} s"), AgentSteps (server `<ol>`), SourceList (http/https only, `rel="noopener noreferrer"`), Citation (Base UI PreviewCard on `useLayer({ kind: 'preview-card' })`, activation opens the in-message SourceList), UsageMeter (CMP `Meter`, warning/critical text), ProviderErrorState (`role="alert"` panel, retry countdown — allowlisted timer).
6. **Layout, semantics, statics, entry** (REQ-SURF-01, -02, -128, -129): container queries on Thread/Composer roots, `--ag-scroll-padding-bottom` from composer and pill, no horizontal overflow at 320 px; live-region inventory; statics `Message.Parts`, `Message.getText`, `Thread.RenderersProvider`, `ToolCall.displayState`; `src/ai/index.ts` with exactly the 11 contract names; `etc/api/ai.*`.
7. **Items and block** (REQ-SURF-170, -172, -173): `ai-markdown`, `ai-model-picker`, `ai-artifact-panel` (PLAT `code-surface` only as a `registryDependencies` entry), `ai-trace-tree`, `ai-eval-dashboard` (no hard-coded metrics), `ai-voice-input` (real `MediaRecorder`, permission errors), `ai-sdk-adapter` (`useAuraChat`, interim under `ci/surf/ai-sdk/`); `ai-workspace` block with `app/api/chat/route.ts` (interim `ci/surf/ai-sdk/ai-workspace/…`): `streamText` + `createOpenAICompatible({ name: 'kiro-prism', baseURL: 'https://prism.auraone.ai/v1', apiKey: process.env.PRISM_API_KEY })`, model from `PRISM_MODEL` or the first `/v1/models` entry at request time, `toUIMessageStreamResponse()`, 32 KB cap (413), per-IP 20 req/min bucket (429 + `Retry-After`), 503 `{ kind: 'auth' }` when the key is unset, README says the bucket is per-instance; `fixtures.ts` recorded session replayed deterministically. Tests use a mocked Prism; no CI job holds a Prism key (OI-14).
8. **Gates, lint, CI** (REQ-SURF-05, -06, -195): AI rule set of `verify-surf-purity.mjs` (fetch, XHR, WebSocket, EventSource, sendBeacon, `process.env` other than `NODE_ENV`, `import.meta.env`, provider specifiers, `dangerouslySetInnerHTML`, `scrollIntoView`) with one failing fixture each; `auraglass/no-network-in-ai` rule + test; L2 check `rg "fetch\(|XMLHttpRequest|WebSocket\(|EventSource\("` over `dist/ai/**` = 0; side-effect-free import; W3 jobs in `ci/surf.gitlab-ci.yml`.
9. **Migration** (REQ-SURF-12..14): W3 deprecation rows on `release/4.x` (DEP-S0400..0599; `GlassChat`, `GlassPredictiveChat` + presets, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator`, `GlassVoiceInput`, simulated AI, `NeuralWeightVisualization`, `GlassMusicVisualizer` "no successor until 5.1 (`Waveform`)" — all `since: '4.2.0'`); compat adapters mapping `ChatMessage` → `AgMessage` and naming every dropped prop in the warning; `ai-chat` area spec + fixtures.

## Tests (remote for every `*.spec.ts`)

Jest: `src/ai/**/{Thread,Message,MessageParts,StreamingText,Composer,ToolCall,Reasoning,AgentSteps,SourceList,Citation,UsageMeter,ProviderErrorState}.test.tsx` (incl. "log semantics", "jump to latest", "user send re-pins", "imperative handle" with `scrollIntoView` spy = 0, "accessible name", "explicit locale/timeZone", "escapes text", "IME composition does not submit", "stop swap", "attachments", "counter", "approval", "rejects javascript: and data: URLs"), `tests/ai/{side-effects,labels,a11y.axe,compat}.test.tsx`, `ci/surf/ai-sdk/{ai-sdk-compat.test-d.ts,ai-workspace-route.test.ts,ai-sdk-adapter/useAuraChat.test.tsx}` (then final paths), `tests/capability/registry/ai-items.test.tsx`, `tests/lint/surf/no-network-in-ai.test.ts`, fixture generators `--check`; behaviour suites also under `jest -c tests/ai/jest.doubles.cjs`.
Remote: `tests/e2e/surf/ai/{thread-scroll,thread-virtual,composer-ime,composer-dropzone,composer-grow,citation-preview}.spec.ts` (3 engines; WebKit iOS emulation; Japanese IME), `tests/a11y/apg/surf/{thread,message,composer,tool-call,citation}.apg.spec.ts`, `tests/visual/surf/ai/ai-workspace.visual.spec.ts` (320, 390, 1440, zoom200, rtl), `tests/perf/browser/surf/ai-streaming.spec.ts`, canaries `ai-rsc`, `ai-client`; L13 records `tests/a11y/manual/records/surf/ai-*.json`.

## Visual evidence

Remote captures of every §13 AI story (Thread `Long2000Virtualized`, `StreamingPinned`, `StreamingUnpinnedJump`; Message `WithImage`, `Error`; Composer `Dragging`, `NearLimit`; ToolCall per display state; Sources `Twelve`; ProviderErrorState per kind) and the `ai-workspace` block at 320/390/1440/zoom200/RTL × 8 scenes; L14 items from the W3 block of `fragments/review/surf.ts`. Nothing committed.

## Prohibited

Index list, plus: any network, provider SDK or model call in `src/ai/**`; simulated suggestions, typing indicators driven by timers, `new Blob(["…"])` voice data; HTML injection of model text; `scrollIntoView` or smooth scroll while streaming; additional `aria-live` regions; a hard-coded model id or a Prism key anywhere (including fixtures and CI); hand-written SDK fixtures.

## Exit criteria

- AC-SURF-15: every fixture in `ui-messages.ai-sdk.json` renders with 0 dev warnings except the unknown-type fixture (exactly 1); `ai-sdk-compat.test-d.ts` passes against the recorded pinned `ai` version.
- AC-SURF-16: pinned drift ≤1 px over 300 streamed frames, unpinned drift ≤1 px, prepend offset ≤1 px (3 engines); 2,000 messages: articles ≤ visible + 12, ≥55 fps desktop / ≥30 fps mobile, 0 long tasks in the 30 s stream.
- AC-SURF-17: 0 submits during IME composition on WebKit and Chromium and exactly 1 on the following Enter; all 7 SDK tool states render the right display state with icon + text; approve/deny calls the handler exactly once.
- AC-SURF-26 (W3 rows): `ai-workspace` route test passes against a mocked Prism and contains no literal or public key; every `ai-*` item validates and renders in the canaries.
- W3 rows of AC-SURF-01 (`./ai` = 11 names + statics), -02, -03, -11, -12 (jest-axe 0 on all AI states), -13, -23 (`{ Thread, Message, Composer }` ≤25 KB etc.), -24, -25 (flagships 38–42, L13 records), -26.
- SURF-276..395 `DONE` or `BLOCKED`; `npm test`, `npm run typecheck`, `surf:test:ai-sdk` green; merge-SHA pipeline `success`.

## Final report format

```
PROMPT-4c SURF/W3 REPORT
Branches/PRs   Merge SHAs   GitLab pipelines: <URLs>
contract/ai-sdk-devdeps: open | merged <sha>; pinned versions: ai@<v> @ai-sdk/react@<v> @ai-sdk/openai-compatible@<v>
Tasks SURF-276..395: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (106..129, 172, 173 and W3 shares)
AC-SURF-15/-16/-17 (+ W3 rows of -01/-02/-03/-11/-12/-13/-23/-24/-25/-26): PASS | FAIL | PENDING + artifact
I-1 (Thread virtualization): pending | switched in <PR>; OI-08 screen-reader outcome; OI-10 version record
Budgets measured vs rows; files changed; deviations with evidence
```
