# Manual script — Message (SURF flagship 39, REQ-SURF-196)

Subject: Message stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Read a composed message with avatar, text and actions; activate a message action

## Pass criteria (every AT row)

- author/role is announced before the body text
- action buttons have distinct names (copy, regenerate, feedback)
- activating an action announces its result (e.g. copied)

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `ai-message-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `ai-message-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `ai-message-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `ai-message-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `ai-message-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `ai-message-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
