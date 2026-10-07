# PROMPT-13b (AI): Message, MessageParts, StreamingText, Thread

You are implementing part of PRD-AI (key `AI`; self-id PRD-13 is an alias, §16 PRD-12; AI Primitives) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Work on a branch off `main` (5.0 line).

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_AI_PRD.md` §2.2 (E-06, E-08, E-09: the defects you must not repeat), §4.1 (material roles, RSC column), §4.3 (rendering pipeline), §4.4 (scroll model), §4.5 (announcements), §4.6 (tokens, CSS, `data-ag-part` contract, motion), §5.2–5.3 (REQ-AI-08..24), §10 prop signatures, §12 rows for Thread/Message/MessageParts/StreamingText, §14 REQ-AI-49/-52, §15 REQ-AI-56..65, §16.
- Architecture: D-02 (ref-as-prop), D-08 (content materials), D-24 (layers, no `!important`), D-25 (no JS motion runtime), §6 (one announcer, `role="log"`), §9 (RSC).
- Contracts consumed (owner key, anchor task, owner prompt): MAT `Surface` (`aura-glass/material`; MAT-047, `PROMPT_04c_MAT_RUNTIME.md`) and `material.css` layers (MAT-015, `PROMPT_04b_MAT_CSS_ENGINE.md`); A11Y announcer (A11Y-054, `PROMPT_05d_A11Y_OVERLAY_RUNTIME.md`) and `usePreference` (A11Y-027, `PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`); DS `--ag-ai-*` and motion tokens (DS-016/026, `PROMPT_03b_DS_COMPILER_SOURCE.md`); FND Base UI pin and `data-ag-part` registry (FND-001/005, `PROMPT_08a_FND_FOUNDATION_PATTERN.md`); DATA `VirtualList` (DATA-033, `PROMPT_12c_DATA_VIRTUALLIST_TABLE.md`; `AURAGLASS_DATA_PRD.md` REQ-DATA-25); CTL `Button`/`IconButton` (CTL-055/061, `PROMPT_09c_CTL_CHROME_CONTROLS.md`); FND icons (FND-048, `PROMPT_08c_FND_CORE_SERVER.md`). Shared contracts: `_shared-contracts.md` SC-12, SC-19, SC-20, SC-21.
- Tasks: `docs/auraglass-5/tasks/AI.json` AI-024..AI-041.

Requirements: REQ-AI-07 (server-safe Message/MessageParts), 08–24 (REQ-AI-24 aborted half; the error half is in 13d), 45 (thread/message CSS), 49, 52, 56–58 (thread/message), 60, 62–65. Acceptance contributions: AC-AI-04 (partial; the full fixture sweep lands in 13d AI-067), AC-AI-05 (unit half), AC-AI-09 (unit half).

## 2. Scope
May create or modify:
- NEW `src/ai/renderers.tsx`, `src/ai/message/{Message,MessageParts,StreamingText,MessageActions}.tsx`, `src/ai/thread/{Thread.tsx,useThreadScroll.ts}`, `src/ai/styles/ai.css`
- NEW tests `src/ai/message/__tests__/{Message,MessageParts,StreamingText}.test.tsx`, `src/ai/thread/__tests__/Thread.test.tsx`, `src/ai/__tests__/{css-contract.test.ts,server-safe.test.tsx,a11y.axe.test.tsx}`
- `src/ai/index.ts` (append 5 value exports), `etc/api/ai.api.md`, `etc/api/ai.exports.json` (regenerated)
- `build/exports.manifest.json` (MODIFY after PKG-005: add the `./ai.css` row only; the file is PKG's)
- Icon imports only from existing per-glyph modules (AI-024). Missing glyphs are filed as a request to the icon owner (FND-048) and not added here, unless that pipeline documents that flagship PRDs add glyph modules.

Must NOT touch: `src/components/**` (including `GlassChat.tsx`, `GlassMessageList.tsx`, `GlassTypingIndicator.tsx`; they are lineage only, so read them and copy nothing), `src/material/**`, token sources, `src/index.ts`, other manifest entries, `package.json` dependencies, DATA's `VirtualList` source (file divergences against PRD-DATA instead).

## 3. Prerequisites (verify; stop with a blocker report if a hard one fails)
- 13a merged: `test -f src/ai/types.ts && node scripts/ci/verify-ai-purity.mjs && node scripts/build/gen-ai-fixtures.mjs --check`.
- React 19 dev toolchain (PKG REQ-PKG-57): `node -p "require('react/package.json').version"` starts with `19.` (ref-as-prop, D-02). Hard.
- FND gate (FND-001/005): Base UI wrapper pattern present (`rg -l "@base-ui/react" src` and `src/foundation/parts.ts`). Hard.
- MAT-047 `Surface` exported from `src/material/index.ts`. Hard.
- A11Y-054 announcer + A11Y-027 `usePreference` (`rg -n "export (function|const) (useAnnouncer|usePreference)" src`). Hard.
- DATA-033 `VirtualList` with `anchor`, `overscan`, `measureElement`, `scrollToKey`. If it is missing, build everything except the >100 virtualization path, report AI-034 as partial-blocked, and keep the threshold test failing. Do not mark it skipped.
- DS `--ag-ai-*` tokens in the generated token CSS (`rg -- "--ag-ai-thread-gap" src tokens`; compiler DS-016). If they are missing, AI-038 fails. Request them from PRD-DS and do not inline values.

## 4. Steps
1. **AI-024 icons.** List the glyphs used and where each comes from. Use per-glyph imports only.
2. **AI-025 renderers.** Write the `"use client"` provider plus the pure `resolveRenderer` (exact type, then prefix, then default).
3. **AI-026/027 StreamingText.** Use an external store + `useSyncExternalStore`, with a single rAF per frame that is cancelled on unmount. Render the caret span only while streaming. Implement the three `announce` modes against the A11Y announcer. The sentence flush `setTimeout` is one of the two allowlisted timers. The caret stops when `usePreference('motion') !== 'full'` (enforced in CSS via the A11Y `data-ag-motion` attribute).
4. **AI-028/029 MessageParts.** Server-safe: no directive, no hooks, no context. Implement the default map from AI-028. Reasoning, tool and source parts fall back to null plus the dev warning until 13d AI-067; state this in the PR. Never use `dangerouslySetInnerHTML`.
5. **AI-030 Message** (server-safe compound) and **AI-031 MessageActions** (client leaf). Message gets the hidden heading, `aria-labelledby`, `data-role`/`data-state`, explicit `locale`/`timeZone` props, and aborted "Stopped". Actions are always in the tab order and become visible on `:hover`, `:focus-within`, `(pointer: coarse)` and `(hover: none)`.
6. **AI-032** Message tests, including "rtl" and jest-axe.
7. **AI-033 useThreadScroll** and **AI-034 Thread**, exactly per §4.4: a 64px pin threshold, `scrollTop` assignment in rAF, unpin on user scroll, user-message re-pin, a top-sentinel IntersectionObserver, prepend compensation in a layout effect, the imperative handle via the `ref` prop (`scrollToMessage` through `VirtualList.scrollToKey` when virtualized, otherwise a direct `scrollTop` assignment; never `scrollIntoView`, PRD §4.4/REQ-AI-14), and `VirtualList` above 100 messages with `role` unset. `Thread.JumpToLatest` is the only place smooth scroll is allowed, and only when motion is `full` and no message is streaming. `Thread.Items` reads `AiRenderersProvider` and the A11Y provider locale/time zone and passes them down as props.
8. **AI-035** Thread tests, including the `scrollIntoView` spy and the unmount leak check.
9. **AI-036 ai.css** and **AI-037** the `./ai.css` row in PKG's manifest (MODIFY). **AI-038** CSS contract test. Use tokens only, inside `@layer ag.components`, with container queries on the root (`container-type: inline-size`), the <480px rules from REQ-AI-49, the jump-pill position from REQ-AI-52, logical properties only, and the forced-colors rules from REQ-AI-60.
10. **AI-039** Append exports (`Thread`, `Message`, `MessageParts`, `StreamingText`, `AiRenderersProvider`) and regenerate the API report and snapshot.
11. **AI-040** Server-safe/directive test. **AI-041** jest-axe states.

## 5. Tests to run
Local (jsdom, light): `./node_modules/.bin/jest src/ai`, `node scripts/ci/verify-ai-purity.mjs`, `./node_modules/.bin/eslint src/ai`. Remote: `npm run build` and the packed-tarball `tests/exports/ai-subpath.spec.mjs` and PKG's size gate (`node scripts/ci/verify-size-budgets.mjs` over `docs/size-budgets.json`, report the `{Thread,Message}` share). Real-browser scroll specs belong to 13e. If you need an early signal, run `tests/ai/thread-scroll.spec.ts` drafts only on the remote QA L5 Behaviour lane (`certification/playwright.cert.config.ts`) (GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` or EC2 via the `auraone-remote-run` skill). Never use a local browser or local Docker.

## 6. Visual evidence
Stories land in 13e. For this PR, attach remote Chromium captures of a scratch harness page from the CI artifact (not committed): Thread with 20 fixture messages at 1440 and 390, light and dark, over the SC-28 `flat-black` and `dense-text` scenes (QA-038). Include a 390 capture showing the <480px layout. Name the artifact `ai-13b-preview`. Human review only; no pixel gate here.

## 7. Integrity rules (binding)
- Never use `scrollIntoView`, smooth scroll during streaming, `onKeyPress`, `Math.random`, module-scope DOM access, `<style>` injection, Tailwind classes, colour/blur/radius/duration literals, `!important`, or element selectors in `ai.css`.
- No hover-only actions, no unlabeled icon buttons, no `<div onClick>`.
- No mock VirtualList. If DATA-033 is missing, the task is blocked, not faked.
- No `.skip`/`.only`/`xit`, no `-u` snapshot updates to get to green, no lowered thresholds (64px, 100 messages, 600 chars, 1,000 ms, 1 commit per frame).

## 8. Exit criteria
- REQ-AI-08..23 each has its named test green (Thread.test.tsx, Message.test.tsx, MessageParts.test.tsx, StreamingText.test.tsx).
- REQ-AI-15: 0 `scrollIntoView` calls (spy) and the purity gate is clean.
- REQ-AI-20 / §16: 1,000 updates in one frame produce 1 commit.
- REQ-AI-07 (unit half): `server-safe.test.tsx` green.
- AC-AI-09 (unit half): jest-axe 0 violations on the Thread/Message states.
- REQ-AI-45: `css-contract.test.ts` green, and every `--ag-ai-*` var is defined by DS's generated tokens.
- `src/ai/index.ts` has 7 value exports (2 from 13a + 5), and the API report diff is reviewed.

## 9. Final report format
```
PROMPT-13b REPORT
Branch/SHA:
Tasks: AI-024..AI-041 -> done|blocked (reason) each
VirtualList: anchor 'end' used | fallback 'start' (divergence filed: link)
Interim: reasoning/tool/source parts render null until AI-067 (yes/no)
Tests: name -> pass/fail (local | remote URL)
Sizes (remote, provisional): {Thread,Message} min+gz = N B
Visual artifact: ai-13b-preview URL
Prereq blockers (owner task ids) / token requests to PRD-DS / glyph requests to FND-048:
Deviations: (each with evidence) or none
Files changed:
```
