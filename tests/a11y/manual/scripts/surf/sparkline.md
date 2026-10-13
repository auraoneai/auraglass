# Manual script — Sparkline (SURF flagship 36, REQ-SURF-196)

Subject: Sparkline Line story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Navigate onto the graphic; read its name; Tab past it

## Pass criteria (every AT row)

- the graphic announces once as an image with the full data summary (count, from/to, low/high)
- the graphic is not a Tab stop

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `sparkline-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `sparkline-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `sparkline-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `sparkline-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `sparkline-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `sparkline-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
