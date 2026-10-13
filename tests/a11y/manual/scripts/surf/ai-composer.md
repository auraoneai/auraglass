# Manual script — Composer (SURF flagship 40, REQ-SURF-196)

Subject: Composer Ready story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the input; type a message; attach-mention if present; submit with Enter; try Shift+Enter

## Pass criteria (every AT row)

- the input announces its label ("Message" or the configured label)
- Enter submits and clears; Shift+Enter adds a line and does not submit
- the submit/stop control name matches its state

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `ai-composer-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `ai-composer-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `ai-composer-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `ai-composer-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `ai-composer-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `ai-composer-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
