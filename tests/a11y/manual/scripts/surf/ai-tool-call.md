# Manual script — ToolCall (SURF flagship 41, REQ-SURF-196)

Subject: ToolCall approval stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Read a running tool call; reach an approval-requested call; approve it; read the result state

## Pass criteria (every AT row)

- the tool name and state (running/needs approval/succeeded/failed) are announced
- approve/deny controls are reachable buttons with those names
- after approval the new state is announced without a focus jump

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `ai-tool-call-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `ai-tool-call-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `ai-tool-call-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `ai-tool-call-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `ai-tool-call-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `ai-tool-call-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
