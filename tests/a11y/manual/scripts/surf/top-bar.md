# Manual script — TopBar (SURF flagship 24, REQ-SURF-196)

Subject: TopBar Default story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Move to the banner landmark; read the title and trailing actions

## Pass criteria (every AT row)

- exactly one banner landmark is announced
- the app title reads as text (not an image) in reading order

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `top-bar-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `top-bar-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `top-bar-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `top-bar-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `top-bar-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `top-bar-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
