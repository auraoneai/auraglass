# PROMPT-13d (AI): ToolCall, Reasoning, AgentSteps, SourceList/Citation, UsageMeter, ProviderErrorState

You are implementing part of PRD-AI (key `AI`; self-id PRD-13 is an alias, §16 PRD-12; AI Primitives) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Work on a branch off `main` (5.0 line). It can run in parallel with PROMPT-13c.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_AI_PRD.md` §2.2 E-09 (typing-indicator lineage: keep its `role="status"` semantics, drop the dead Tailwind classes and the `document.head` injection), E-12 (no `role="tooltip"` on interactive content), §4.1 rows ToolCall/Reasoning/AgentSteps/SourceList/Citation/UsageMeter/ProviderErrorState, §4.2 display-state table, §4.3 (source collection, citation markers), §4.5 (assertive for approval/errors), §4.6 parts/states, §4.7 deviation 2 (the `denied` state), §5.5–5.7 REQ-AI-32..40, §10 signatures, §14 REQ-AI-53, §15 REQ-AI-56/-60/-61/-62/-64.
- Contracts consumed (owner key, anchor task, owner prompt): FND Base UI pin and wrapping pattern for `Collapsible`/`PreviewCard` (FND-001/005) and the portal accessor `usePortalContainer()` (FND-007), all in `PROMPT_08a_FND_FOUNDATION_PATTERN.md`; A11Y `LayerStack`, the only Escape dispatcher (A11Y-049, `PROMPT_05d_A11Y_OVERLAY_RUNTIME.md`; SC-25), announcer (A11Y-054), `usePreference` (A11Y-027); CTL `Button` (CTL-055) and `TextField` (CTL-047); FND core `Alert` (FND-058, `PROMPT_08c_FND_CORE_SERVER.md`) and `Meter` (FND-074, `PROMPT_08d_FND_CORE_INTERACTIVE.md`); MAT `Surface` (`content-sunken`, `overlay regular`; MAT-047).
- Tasks: `docs/auraglass-5/tasks/AI.json` AI-052..AI-070.

Requirements: REQ-AI-24 (error half), 32–40, 53, 56, 60, 61, 64, plus REQ-AI-18 (default renderers wired, AI-067). Acceptance: AC-AI-08; AC-AI-04 (full fixture sweep); AC-AI-01 (15 exports exactly); AC-AI-09 (unit, all states).

## 2. Scope
May create or modify:
- NEW `src/ai/tool/{ToolCall,ToolApproval}.tsx`, `src/ai/reasoning/Reasoning.tsx`, `src/ai/agent/AgentSteps.tsx`, `src/ai/sources/{SourceList,Citation}.tsx`, `src/ai/usage/UsageMeter.tsx`, `src/ai/error/ProviderErrorState.tsx`
- NEW tests under `src/ai/{tool,reasoning,agent,sources,usage,error}/__tests__/`
- `src/ai/message/MessageParts.tsx` and `src/ai/message/Message.tsx` (only the default-renderer wiring and the error-state slot, AI-067), `src/ai/message/__tests__/MessageParts.test.tsx` (extend to all fixtures)
- `src/ai/styles/ai.css` (these components' sections), `src/ai/__tests__/a11y.axe.test.tsx`, `src/ai/__tests__/server-safe.test.tsx` (add AgentSteps, UsageMeter to the server-safe list)
- `src/ai/index.ts` (append 7 exports to reach exactly 15), `etc/api/ai.api.md`, `etc/api/ai.exports.json`

Must NOT touch: `src/components/chat/GlassTypingIndicator.tsx`, `src/components/modal/GlassHoverCard.tsx` and any `src/components/**`; FND/CTL component sources; `src/material/**`; `package.json`; Thread/Composer internals.

## 3. Prerequisites
- 13a merged; 13b merged (`test -f src/ai/message/MessageParts.tsx`). Hard.
- FND-001/005 `Collapsible` and `PreviewCard` wrappers, FND-007 `usePortalContainer()`, A11Y-049 `LayerStack` (`rg -n "Collapsible|PreviewCard" src --glob '!src/components/**'`). Hard.
- FND-074 `Meter`, FND-058 `Alert` (`rg -n "export .*\b(Meter|Alert)\b" src/index.ts`). Hard for AI-063/AI-065. If missing, finish everything else and report those two as blocked.
- CTL-055 `Button`, CTL-047 `TextField`. Hard for AI-053.

## 4. Steps
1. **AI-052 ToolCall.** Collapsible trigger `<button>` with an icon and text label for each of the 6 display states; `data-state` comes from `toolDisplayState`. Open by default for needs-approval and failed. Show a JSON preview capped at 4,000 chars with "Show all", inside a horizontally scrollable labelled `<pre tabIndex=0>`. Re-author the running atom as CSS only (three dots) with a static "Running" under reduced motion. Announce assertively once on entering needs-approval.
2. **AI-053 ToolApproval.** Approve and Deny, with an optional reason field. The handler is called exactly once and both buttons stay `aria-disabled` until `part.state` changes. Focus returns to the trigger. With no handler, show read-only "Waiting for approval" and a dev warning.
3. **AI-054** ToolCall tests: iterate all 7 SDK states plus denied-by-response.
4. **AI-055/056 Reasoning**: auto open/close, respect the user's toggle, the duration label rules, and `durationMs` precedence.
5. **AI-057/058 AgentSteps** (server-safe): nested `<ol>`, `aria-current="step"`, state text, durations.
6. **AI-059/060 SourceList**: the "{n} sources" trigger, default-open rule, item ids `ag-src-{messageId}-{sourceId}`, links for http(s) only with `rel`/`target` and the hidden "(opens in new tab)" text; all other schemes render as text.
7. **AI-061/062 Citation**: an anchor named "Source {i}: {title}"; PreviewCard opens on 300 ms hover and on focus, portals through `usePortalContainer()`, closes on Escape only via `LayerStack` (no own Escape `keydown` handler) and returns focus, there is no `role="tooltip"`; Enter, touch, coarse pointer or a <480px container navigate to and focus the source item; collision padding is 8px.
8. **AI-063/064 UsageMeter** (server-safe module that renders `Meter` as a client island): compact numbers, warning at ≥80% and critical at ≥95% with text, USD to 4 fraction digits.
9. **AI-065/066 ProviderErrorState**: 7 kinds with default copy; `role="alert"` on the panel only; Retry with a countdown (allowlisted interval, cleared on unmount); never success content.
10. **AI-067 wire MessageParts defaults** (reasoning, tool, sources + `citations="markers"`, plus the error status in Message.Root). Remove the interim warnings and extend MessageParts.test.tsx to every fixture: 0 warnings except exactly 1 for the unknown-type fixture.
11. **AI-068 CSS**: state colours only via `--ag-ai-tool-state-*`, keyframes with `--ag-duration-*`, forced colors `CanvasText`/`Highlight`.
12. **AI-069 exports**: exactly the 15 REQ-AI-02 names. Regenerate the report and snapshot. `ai-subpath.spec.mjs` now asserts set equality.
13. **AI-070** axe over all these states.

## 5. Tests to run
Local (jsdom): `./node_modules/.bin/jest src/ai`, `node scripts/ci/verify-ai-purity.mjs`, `./node_modules/.bin/eslint src/ai`. Remote only: `npm run build` + `npm pack` + `node tests/exports/ai-subpath.spec.mjs` (15 names exact) + PKG's `node scripts/ci/verify-size-budgets.mjs` over the AI rows in `docs/size-budgets.json` (`{ToolCall,Reasoning,AgentSteps}` ≤8 KB, `{SourceList,Citation}` ≤6 KB, `ai.css` ≤6 KB gz). Use GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` or EC2 via the `auraone-remote-run` skill. Never use a local browser or local Docker.

## 6. Visual evidence
Remote captures (CI artifact `ai-13d-preview`, not committed) in Chromium, WebKit and Gecko at 1440 and 390, light and dark, over the SC-28 scenes `flat-black` and `saturated-abstract`: ToolCall in all 6 display states, ApprovalWithReason, Reasoning streaming/done, AgentSteps nested, Sources Three/Twelve with an open citation preview, UsageMeter warning/critical, and ProviderErrorState rate-limit with countdown. Also a forced-colors capture of the six tool states. These are for human review only; the gates run in 13e.

## 7. Integrity rules (binding)
- The display states must come from `toolDisplayState`. No hard-coded mapping per component, and no colour-only states.
- No `role="tooltip"`, no `href` for non-http(s) URLs, no `dangerouslySetInnerHTML`, no success placeholder in error states, no `Math.random`, no timers outside the two allowlisted files.
- No `.skip`/`.only`/`xit`, no snapshot `-u`, no changed numbers (300 ms, 4,000 chars, 3-source default, 80/95%, 10 s label rule).

## 8. Exit criteria
- AC-AI-08: ToolCall.test.tsx shows all 7 SDK states → correct display state with icon + text, and approve/deny calls the handler exactly once.
- AC-AI-04: every fixture in `ui-messages.ai-sdk.json` renders with 0 dev warnings except the unknown-type fixture (exactly 1).
- AC-AI-01: the packed tarball exports exactly the 15 names (remote run URL).
- REQ-AI-37/-64: "rejects javascript: URLs" green. REQ-AI-38: Citation tests green, no tooltip role.
- AC-AI-09 (unit): jest-axe 0 violations across all states listed in AI-070.
- The provisional size lines are measured and reported.

## 9. Final report format
```
PROMPT-13d REPORT
Branch/SHA:
Tasks: AI-052..AI-070 -> done|blocked (reason) each
Exports (packed tarball): [15 names] == REQ-AI-02 (yes/no)
Fixture sweep: N fixtures, warnings=1 (unknown-type) 
Sizes (remote): agentic +N B / 8 KB; sources +N B / 6 KB; ai.css N B / 6 KB
Tests: name -> pass/fail (local | remote URL)
Visual artifact: ai-13d-preview URL
Prereq blockers (owner task ids):
Deviations: (each with evidence) or none
Files changed:
```
