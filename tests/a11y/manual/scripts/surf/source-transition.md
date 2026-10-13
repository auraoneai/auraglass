# Manual script — SourceTransition (SURF flagship 31, REQ-SURF-196)

Subject: SourceTransition Focusable story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the source control; activate it; read where focus lands; continue Tabbing

## Pass criteria (every AT row)

- focus lands on the destination control, never on the page body
- the destination announces with its own name (no leftover source name)
- with reduced motion the focus result is identical

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `source-transition-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `source-transition-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `source-transition-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `source-transition-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `source-transition-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `source-transition-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
