# PROMPT-13c (AI): Composer

You are implementing part of PRD-AI (key `AI`; self-id PRD-13 is an alias, §16 PRD-12; AI Primitives) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Work on a branch off `main` (5.0 line). It can run in parallel with PROMPT-13d.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_AI_PRD.md` §2.2 E-07 (the IME, duplicate-id, `onKeyPress` and mock-Blob defects you must not repeat), §4.1 (Composer = `chrome thick`, the only backdrop surface in a thread besides the pill), §4.6 (Composer parts/states), §4.7 deviations 2a (Stop on Composer, Regenerate on Message) and 3 (voice is not in core), §5.4 REQ-AI-25..31, §10 Composer signature, §14 REQ-AI-50/-51/-52, §15 REQ-AI-57/-58/-61/-62/-63, §16 keystroke-to-paint line.
- Contracts consumed (owner key, anchor task, owner prompt): FND Base UI pin and wrapping pattern for `Field` (FND-001, `PROMPT_08a_FND_FOUNDATION_PATTERN.md`); CTL `Button`/`IconButton` (CTL-055/061, `PROMPT_09c_CTL_CHROME_CONTROLS.md`) and `TextField` (CTL-047, `PROMPT_09b_CTL_CONTENT_CONTROLS.md`), using CTL's final prop grammar (SC-24; no 4.x `variant="primary"`); OVL `Menu` (OVL-081, `PROMPT_10e_OVL_MENU.md`; collapsed actions, soft); MAT `Surface` chrome thick (MAT-047); A11Y announcer (A11Y-054), `usePreference` (A11Y-027), target pseudo-element and focus ring.
- Tasks: `docs/auraglass-5/tasks/AI.json` AI-042..AI-051.

Requirements: REQ-AI-25..31, 50, 51, 52 (writing `--ag-ai-composer-block`), 57 (composer keys), 58 (Counter is the only own live region), 61, 62, 63 (composer). Acceptance contributions: AC-AI-07 (unit half; the WebKit/Chromium half is in 13e), AC-AI-09 (composer states).

## 2. Scope
May create or modify: NEW `src/ai/composer/{Composer.tsx,useAttachments.ts}`, NEW `src/ai/composer/__tests__/Composer.test.tsx`, `src/ai/styles/ai.css` (composer section only), `src/ai/__tests__/a11y.axe.test.tsx` (add composer states), `src/ai/index.ts` (append `Composer`), regenerated `etc/api/ai.api.md` and `etc/api/ai.exports.json`. If the textarea-growth hand-off needs it, you may also add the smallest internal Thread hook point (an exported-internal `useThreadLayoutSignal`) in `src/ai/thread/Thread.tsx`, and nothing else in that file.

Must NOT touch: `src/components/interactive/GlassChatInput.tsx` or `GlassVoiceInput.tsx` (lineage; deletion belongs to FND, §16 PRD-16), FND/CTL/OVL component sources, `src/material/**`, `package.json`. Add no voice or `MediaRecorder` code. Voice is the `ai-voice-input` registry item (13f).

## 3. Prerequisites
- 13a merged (`node scripts/ci/verify-ai-purity.mjs` exits 0) and 13b merged (`test -f src/ai/thread/Thread.tsx && ./node_modules/.bin/jest src/ai/thread`). Hard.
- FND-001 Field wrapper and CTL-055/061/047 `Button`/`IconButton`/`TextField` exported (`rg -n "export .*\b(Button|IconButton|TextField)\b" src/index.ts`). Hard.
- OVL-081 `Menu`. Soft: until it lands, AI-047 renders the collapsed actions as a CTL `IconButton` that toggles a Base UI `Popover` list. The report records the gap, and AI-047 stays open until `Menu` replaces it.
- React 19 toolchain (`require('react/package.json').version` starts with `19.`).

## 4. Steps
1. **AI-042 `useAttachments`**: validate accept/size/count with the exact defaults (10 files; 20,971,520 B). Rejections call `onAttachmentReject` and announce. Don't read or upload files. Revoke every object URL you create.
2. **AI-043 Composer.Root/Submit/Stop**: `<form>` on Field, controlled and uncontrolled value, `useId` ids, `aria-disabled` empty submit that stays focusable, Stop swap for `submitted|streaming` with no double submit, and `error` keeping the draft. Focus stays in the textarea after submit.
3. **AI-044 Textarea**: `onKeyDown` only, with the exact REQ-AI-26 predicate. Shift+Enter inserts a newline; Cmd/Ctrl+Enter submits. Escape stops while streaming (`stopOnEscape`). Use `field-sizing: content` with a measured fallback for 1→`maxRows`. Signal Thread so a pinned thread re-pins in the same frame.
4. **AI-045 attachments UI**: the attach action with a hidden file input, paste, drag-drop with `data-dragging` (enter/leave counter), chips with remove buttons labelled "Remove {filename}".
5. **AI-046 Counter**: polite announcement only when crossing 90% and 100%.
6. **AI-047 mobile/narrow**: below 480px the actions collapse into one leading menu, `maxRows` becomes 5, and chips scroll-snap. For the keyboard inset, use `env(keyboard-inset-height)` or a single `visualViewport` listener. Write `--ag-ai-composer-block` and `--ag-scroll-padding-block-end`.
7. **AI-048 CSS**, using tokens and MAT `data-ag-*` attributes only (SC-21). Coarse-pointer hit areas are 44px through the A11Y pseudo-element. Reduced transparency follows the D-11 ladder.
8. **AI-049 tests** (full list in AI-049), **AI-050** export, **AI-051** axe states.

## 5. Tests to run
Local (jsdom): `./node_modules/.bin/jest src/ai/composer src/ai/__tests__`, `node scripts/ci/verify-ai-purity.mjs`, `./node_modules/.bin/eslint src/ai`. Remote only: `npm run build`, PKG's size gate (`scripts/ci/verify-size-budgets.mjs`; `{Thread,Message,Composer}` row ≤25 KB min+gz in `docs/size-budgets.json`, provisional), and early runs of `tests/ai/composer-ime.spec.ts` / `composer-grow.spec.ts` / `composer-dropzone.spec.ts` if 13e's lane exists. Run them in GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` or on EC2 via the `auraone-remote-run` skill. Never use a local browser or local Docker.

## 6. Visual evidence
Remote Chromium and WebKit captures (CI artifact `ai-13c-preview`, not committed) of the Composer in the states Ready, WithDraft, WithAttachments, Dragging, Streaming(Stop), Error and NearLimit, at 1440 and 390, over the SC-28 scenes `photo` and `flat-white`, light and dark. Include one capture of the collapsed <480px action menu. This is for human review; the pixel/OCR gates run in 13e.

## 7. Integrity rules (binding)
- No `onKeyPress`, no hard-coded ids, no fake or mock attachment payloads, no `FileReader`/upload/encoding, no voice code.
- `aria-disabled` stays as specified. Don't replace it with `disabled` to make a test pass.
- No `.skip`/`.only`/`xit`, no snapshot `-u`, no changed defaults (Enter submits; 10 files; 20 MiB; maxRows 8/5; 90%/100% thresholds).
- No colour/blur/radius/duration literals or `!important`.

## 8. Exit criteria
- REQ-AI-25..31: every named case in `Composer.test.tsx` is green. That includes "IME composition does not submit", "stop swap", "attachments", "counter", unique ids for two instances, and 0 listeners after unmount.
- REQ-AI-57/-62: Escape stop and focus retention are tested.
- AC-AI-09 (composer): jest-axe 0 violations across the 9 composer states.
- `src/ai/index.ts` has 8 value exports, and the API report is regenerated.
- The provisional size line `{Thread,Message,Composer}` is measured remotely and reported.

## 9. Final report format
```
PROMPT-13c REPORT
Branch/SHA:
Tasks: AI-042..AI-051 -> done|blocked (reason) each
field-sizing support path: native | fallback (engines)
Menu: OVL Menu (OVL-081) | interim Popover (gap recorded)
Tests: name -> pass/fail (local | remote URL)
Size (remote): {Thread,Message,Composer} = N B (budget 25 KB)
Visual artifact: ai-13c-preview URL
Prereq blockers (owner task ids):
Deviations: (each with evidence) or none
Files changed:
```
